// Company Intelligence Service with 7-day caching

import { getProductRecommendation, normalizeIndustry } from '../data/industryProductMapping';

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const CACHE_PREFIX = 'company_intel_';

export interface CompanyData {
  companyName: string;
  industry: string;
  employeeCount: number | null;
  location: string | null;
  normalizedIndustry: string;
  source: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
}

export interface CompanyIntelligence {
  domain: string;
  companyData: CompanyData;
  news: NewsArticle[];
  events: NewsArticle[];
  aiInsights: string; // Legacy single block
  structuredInsights: {
    crm: string;        // More than just a CRM
    connect: string;    // Seamlessly connect
    dataCloud: string;  // Data cloud
    tailored: string;   // Tailored solutions
  } | null;
  companyProducts: string[]; // List of company's products/services
  recommendedProduct: {
    productId: string;
    productName: string;
    productPath: string;
    message: string;
    icon: string;
  } | null;
  timestamp: number;
  expiresAt: number;
}

/**
 * Clean and normalize domain
 */
const cleanDomain = (domain: string): string => {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .split('/')[0]
    .toLowerCase();
};

/**
 * Get cache key for a domain
 */
const getCacheKey = (domain: string): string => {
  return `${CACHE_PREFIX}${cleanDomain(domain)}`;
};

/**
 * Get cached data for a domain
 */
export const getCachedData = (domain: string): CompanyIntelligence | null => {
  try {
    const key = getCacheKey(domain);
    const cached = localStorage.getItem(key);
    
    if (!cached) {
      return null;
    }
    
    const data: CompanyIntelligence = JSON.parse(cached);
    
    // Check if cache has expired
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    
    console.log('✅ Using cached company intelligence for', domain);
    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Set cached data for a domain
 */
export const setCachedData = (domain: string, data: CompanyIntelligence): void => {
  try {
    const key = getCacheKey(domain);
    localStorage.setItem(key, JSON.stringify(data));
    console.log('✅ Cached company intelligence for', domain);
  } catch (error) {
    console.error('Error writing cache:', error);
  }
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    let cleared = 0;
    
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          if (Date.now() > data.expiresAt) {
            localStorage.removeItem(key);
            cleared++;
          }
        } catch {
          // Invalid data, remove it
          localStorage.removeItem(key);
          cleared++;
        }
      }
    }
    
    if (cleared > 0) {
      console.log(`🧹 Cleared ${cleared} expired cache entries`);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Enrich company data via API
 */
const enrichCompanyData = async (domain: string): Promise<CompanyData> => {
  const response = await fetch('/.netlify/functions/enrichCompany', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to enrich company: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Fetch company news via API
 */
const fetchCompanyNews = async (companyName: string, industry: string): Promise<{ articles: NewsArticle[], events: NewsArticle[] }> => {
  const response = await fetch('/.netlify/functions/fetchNews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companyName, industry }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Refine industry detection using news content
 */
const refineIndustryFromNews = (companyData: CompanyData, news: NewsArticle[]): CompanyData => {
  if (news.length === 0 || companyData.normalizedIndustry !== 'other') {
    return companyData; // Already confident or no news
  }
  
  // Analyze news titles and descriptions for industry keywords
  const newsText = news.map(n => `${n.title} ${n.description}`).join(' ').toLowerCase();
  
  // Real estate indicators
  if (newsText.match(/property|real estate|housing|development|residential|commercial property/)) {
    return {
      ...companyData,
      industry: 'Real Estate',
      normalizedIndustry: 'real-estate',
      source: 'news-enhanced'
    };
  }
  
  // Construction indicators
  if (newsText.match(/construction|building|infrastructure|contractor|project|engineering/)) {
    return {
      ...companyData,
      industry: 'Construction & Engineering',
      normalizedIndustry: 'construction',
      source: 'news-enhanced'
    };
  }
  
  // Extract location from news if available
  const locationMatch = newsText.match(/\b(Dubai|Abu Dhabi|Riyadh|Saudi|UAE|Egypt|Kuwait|Qatar|London|New York|Singapore)\b/i);
  if (locationMatch && !companyData.location) {
    companyData.location = locationMatch[0];
  }
  
  return companyData;
};

/**
 * Generate structured AI insights for different sections
 */
const generateStructuredInsights = async (companyData: CompanyData, news: NewsArticle[]): Promise<{
  crm: string;
  connect: string;
  dataCloud: string;
  tailored: string;
}> => {
  const newsContext = news.length > 0
    ? `Recent news: ${news.slice(0, 2).map(n => n.title).join('; ')}`
    : '';
  
  // Industry-specific context for better insights
  const industryContext: { [key: string]: string } = {
    'Technology': 'IT service companies need scalable CRM, professional services automation, and customer success tools',
    'Real Estate': 'Real estate firms need property management, lead tracking, and tenant portals',
    'Healthcare': 'Healthcare organizations need patient management, HIPAA compliance, and care coordination',
    'Manufacturing': 'Manufacturers need supply chain integration, order management, and B2B commerce',
    'Financial Services': 'Financial firms need regulatory compliance, wealth management, and customer advisory tools',
    'Retail': 'Retailers need omnichannel commerce, inventory management, and customer personalization'
  };
  
  const context = industryContext[companyData.industry] || 'businesses need comprehensive CRM and automation';
  
  const prompt = `You are a Salesforce expert writing for ${companyData.companyName}, a ${companyData.industry} company. ${newsContext}

Context: ${context}.

Write 4 specific, impressive insights about how Salesforce helps ${companyData.industry} companies. Each insight should be concrete and valuable.

Format EXACTLY as shown:

[CRM]
One powerful sentence (20-35 words) about comprehensive platform capabilities beyond basic CRM for ${companyData.industry}.

[CONNECT]
One powerful sentence (20-35 words) about seamless system integration and team connection for ${companyData.industry}.

[DATACLOUD]
One powerful sentence (20-35 words) about unified data and intelligence for ${companyData.industry}.

[TAILORED]
One powerful sentence (20-35 words) about industry-specific features and competitive advantages for ${companyData.industry}.

Rules:
- Be specific to ${companyData.industry}
- NO markdown, NO asterisks, NO emojis
- Professional, confident tone
- Action-oriented language
- If you lack context, write general ${companyData.industry} insights
- NEVER say "I don't have", "cannot provide", "missing"

Your response:`;

  const response = await fetch('/.netlify/functions/cloudiator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate AI insights: ${response.status}`);
  }
  
  const data = await response.json();
  const fullResponse = data.response || '';
  
  // Validate full response first
  if (!isValidAIResponse(fullResponse)) {
    console.log('❌ Invalid structured insights response');
    return null;
  }
  
  // Parse the structured response
  const crmMatch = fullResponse.match(/\[CRM\]\s*\n?(.*?)(?=\n\[|$)/is);
  const connectMatch = fullResponse.match(/\[CONNECT\]\s*\n?(.*?)(?=\n\[|$)/is);
  const dataCloudMatch = fullResponse.match(/\[DATACLOUD\]\s*\n?(.*?)(?=\n\[|$)/is);
  const tailoredMatch = fullResponse.match(/\[TAILORED\]\s*\n?(.*?)(?=\n\[|$)/is);
  
  // Clean function to remove any markdown formatting
  const cleanText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\*\*\./g, '.')     // Remove **. pattern
      .replace(/\*\*/g, '')        // Remove bold markers
      .replace(/\* \*\*/g, '')     // Remove * ** pattern
      .replace(/\*/g, '')          // Remove all asterisks
      .replace(/^[•-]\s*/gm, '')  // Remove bullet points
      .replace(/#{1,6}\s*/g, '')   // Remove headers
      .replace(/—/g, '-')          // Replace em dash
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove all emojis
      .replace(/^\s*\.\s*/gm, '')  // Remove lone periods
      .trim();
  };
  
  const crm = cleanText(crmMatch?.[1] || '');
  const connect = cleanText(connectMatch?.[1] || '');
  const dataCloud = cleanText(dataCloudMatch?.[1] || '');
  const tailored = cleanText(tailoredMatch?.[1] || '');
  
  // Validate each section
  if (!isValidAIResponse(crm) || !isValidAIResponse(connect) || 
      !isValidAIResponse(dataCloud) || !isValidAIResponse(tailored)) {
    console.log('❌ One or more structured insights invalid');
    return null;
  }
  
  return {
    crm,
    connect,
    dataCloud,
    tailored
  };
};

/**
 * Validate if AI response is useful and not an error message
 */
const isValidAIResponse = (text: string): boolean => {
  if (!text || text.trim().length < 10) return false;
  
  const lowerText = text.toLowerCase();
  
  // Detect error messages
  const errorPhrases = [
    'provided prompt',
    'does not contain',
    'missing information',
    'cannot provide',
    'unable to',
    'i don\'t have',
    'no information',
    'insufficient data',
    'not enough context',
    'based on the provided',
    'therefore i cannot',
    'sorry',
    'i apologize'
  ];
  
  for (const phrase of errorPhrases) {
    if (lowerText.includes(phrase)) {
      return false;
    }
  }
  
  // Check if response is too generic/vague
  const genericPhrases = [
    'generally speaking',
    'typically companies',
    'in most cases',
    'usually businesses'
  ];
  
  let genericCount = 0;
  for (const phrase of genericPhrases) {
    if (lowerText.includes(phrase)) {
      genericCount++;
    }
  }
  
  // If more than 2 generic phrases, probably not specific enough
  if (genericCount > 2) return false;
  
  return true;
};

/**
 * Extract company products/services using Gemini
 */
const extractCompanyProducts = async (companyData: CompanyData, news: NewsArticle[]): Promise<string[]> => {
  const newsContext = news.length > 0
    ? `Recent news about the company: ${news.slice(0, 2).map(n => n.title).join('. ')}`
    : '';
  
  // Industry-specific product examples to guide AI
  const industryExamples: { [key: string]: string } = {
    'Technology': 'Software Solutions, Cloud Services, IT Consulting',
    'Real Estate': 'Residential Properties, Commercial Spaces, Property Management',
    'Healthcare': 'Medical Devices, Pharmaceuticals, Healthcare Services',
    'Manufacturing': 'Industrial Equipment, Manufactured Goods, Production Services',
    'Financial Services': 'Banking Services, Investment Products, Insurance Solutions',
    'Retail': 'Consumer Products, E-commerce Platform, Retail Services'
  };
  
  const exampleProducts = industryExamples[companyData.industry] || 'Products, Services, Solutions';
  
  const prompt = `You are analyzing ${companyData.companyName}, a ${companyData.industry} company. ${newsContext}

List their 3-5 main products or services. Be specific and use their actual product/service names if known from the news context. If you don't know the exact names, infer logical ${companyData.industry} offerings.

Format: Simple comma-separated list ONLY. NO explanations, NO "based on", NO apologies.

Example for ${companyData.industry}: ${exampleProducts}

If you truly cannot determine products, respond with ONLY: UNKNOWN

Your response:`;

  try {
    const response = await fetch('/.netlify/functions/cloudiator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to extract products: ${response.status}`);
    }
    
    const data = await response.json();
    const productsText = data.response || '';
    
    // Check if response is UNKNOWN or invalid
    if (productsText.trim() === 'UNKNOWN' || !isValidAIResponse(productsText)) {
      console.log('❌ Invalid product response from AI');
      return [];
    }
    
    // Parse comma-separated list
    const products = productsText
      .split(',')
      .map(p => p.trim())
      .filter(p => {
        // Filter out invalid products
        if (p.length === 0 || p.length > 100) return false;
        if (p.toUpperCase() === 'UNKNOWN') return false;
        
        // Filter out error messages or generic responses
        const lowerP = p.toLowerCase();
        if (lowerP.includes('based on') || 
            lowerP.includes('missing') || 
            lowerP.includes('context') ||
            lowerP.includes('unable') ||
            lowerP.includes('cannot') ||
            lowerP.includes('sorry') ||
            lowerP.includes('i don') ||
            lowerP.includes('therefore') ||
            lowerP.includes('prompt') ||
            lowerP.includes('no information')) {
          return false;
        }
        
        return true;
      })
      .slice(0, 5); // Max 5 products
    
    // If we got no valid products or only error messages, return empty
    if (products.length === 0) {
      console.log('❌ No valid products extracted');
      return [];
    }
    
    console.log('✅ Extracted products:', products);
    return products;
  } catch (error) {
    console.error('Failed to extract products:', error);
    return [];
  }
};

/**
 * Generate AI insights using existing Gemini integration (legacy format)
 */
const generateAIInsights = async (companyData: CompanyData, news: NewsArticle[]): Promise<string> => {
  const newsContext = news.length > 0
    ? `Recent developments: ${news.slice(0, 2).map(n => n.title).join('. ')}`
    : '';
  
  // Industry-specific Salesforce solutions
  const industrySolutions: { [key: string]: string } = {
    'Technology': 'Professional Services Cloud for project management, Sales Cloud for pipeline tracking',
    'Real Estate': 'Property management with Experience Cloud, lead scoring with Einstein AI',
    'Healthcare': 'Health Cloud for patient 360, compliance with Shield',
    'Manufacturing': 'Manufacturing Cloud for forecasting, CPQ for complex pricing',
    'Financial Services': 'Financial Services Cloud for wealth management, compliance tools',
    'Retail': 'Commerce Cloud for e-commerce, Marketing Cloud for personalization'
  };
  
  const solutions = industrySolutions[companyData.industry] || 'Sales Cloud, Service Cloud, Marketing Cloud';
  
  const prompt = `You are writing for ${companyData.companyName}, a ${companyData.industry} company. ${newsContext}

Write 3 powerful, specific insights about how Salesforce transforms ${companyData.industry} operations.

Salesforce for ${companyData.industry}: ${solutions}

Instructions:
- Write 3 numbered points (1., 2., 3.)
- Each 30-40 words
- Specific to ${companyData.industry}
- Mention actual Salesforce products/features
- Action-oriented, confident tone
- NO asterisks, NO markdown, NO emojis
- Plain professional prose only
- If lacking specific info, use general ${companyData.industry} insights
- NEVER write error messages or apologies

Your response:`;

  const response = await fetch('/.netlify/functions/cloudiator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate AI insights: ${response.status}`);
  }
  
  const data = await response.json();
  const rawResponse = data.response || '';
  
  // Validate response first
  if (!isValidAIResponse(rawResponse)) {
    console.log('❌ Invalid AI insights response');
    return ''; // Return empty string to hide section
  }
  
  // Clean the response thoroughly - remove ALL markdown and special formatting
  const cleaned = rawResponse
    .replace(/\*\*\./g, '.')        // Remove **. pattern
    .replace(/\*\*/g, '')           // Remove bold markers
    .replace(/\* \*\*/g, '')        // Remove * ** pattern
    .replace(/\*/g, '')             // Remove all asterisks
    .replace(/^[•-]\s*/gm, '')      // Remove bullet points
    .replace(/#{1,6}\s*/g, '')      // Remove headers
    .replace(/—/g, '-')             // Replace em dash
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/^\s*\.\s*/gm, '')     // Remove lone periods at start of lines
    .trim();
  
  // Final check on cleaned text
  if (!isValidAIResponse(cleaned)) {
    console.log('❌ Cleaned insights still invalid');
    return '';
  }
  
  return cleaned;
};

/**
 * Check backend cache for company data
 */
const checkBackendCache = async (domain: string): Promise<CompanyIntelligence | null> => {
  try {
    const response = await fetch('/.netlify/functions/searchCompanies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    
    // Check if we found an exact or high-confidence match
    if (result.found && result.data) {
      console.log('💾 Found cached data in backend:', result.exact ? 'exact match' : `similarity: ${result.similarityScore}`);
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.log('⚠️ Backend cache check failed:', error);
    return null;
  }
};

/**
 * Save company intelligence to backend cache
 */
const saveToBackendCache = async (domain: string, intelligence: CompanyIntelligence): Promise<void> => {
  try {
    await fetch('/.netlify/functions/saveCompanyData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain,
        data: intelligence,
      }),
    });
    console.log('💾 Saved to backend cache');
  } catch (error) {
    console.log('⚠️ Failed to save to backend cache:', error);
    // Don't throw - caching is optional
  }
};

/**
 * Main function to enrich company with full intelligence
 */
export const enrichCompany = async (domain: string, forceRefresh = false): Promise<CompanyIntelligence> => {
  const cleanedDomain = cleanDomain(domain);
  
  // Check local cache first
  if (!forceRefresh) {
    const cached = getCachedData(cleanedDomain);
    if (cached) {
      console.log('💾 Using local cache');
      return cached;
    }
    
    // Check backend cache (shared across users)
    const backendCached = await checkBackendCache(cleanedDomain);
    if (backendCached) {
      // Also save to local cache
      setCachedData(cleanedDomain, backendCached);
      return backendCached;
    }
  }
  
  console.log('🔍 Enriching company:', cleanedDomain);
  
  try {
    // Step 1: Enrich company data from domain
    console.log('📊 Analyzing domain...');
    let companyData = await enrichCompanyData(cleanedDomain);
    
    // Step 2: Fetch news
    console.log('📰 Fetching news...');
    const newsData = await fetchCompanyNews(companyData.companyName, companyData.industry);
    
    // Step 3: Refine industry detection using news content
    console.log('🔍 Refining industry from news context...');
    companyData = refineIndustryFromNews(companyData, newsData.articles);
    
    // Step 4: Generate AI insights and extract products (parallel)
    console.log('🤖 Generating AI insights and extracting products...');
    const [aiInsights, structuredInsights, companyProducts] = await Promise.all([
      generateAIInsights(companyData, newsData.articles),
      generateStructuredInsights(companyData, newsData.articles),
      extractCompanyProducts(companyData, newsData.articles)
    ]);
    
    // Step 5: Get product recommendation
    const recommendedProduct = getProductRecommendation(companyData.normalizedIndustry);
    
    // Build intelligence object
    const intelligence: CompanyIntelligence = {
      domain: cleanedDomain,
      companyData,
      news: newsData.articles || [],
      events: newsData.events || [],
      aiInsights,
      structuredInsights,
      companyProducts,
      recommendedProduct,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };
    
    // Cache the results locally
    setCachedData(cleanedDomain, intelligence);
    
    // Save to backend cache for other users (don't await - fire and forget)
    saveToBackendCache(cleanedDomain, intelligence).catch(console.error);
    
    console.log('✅ Company intelligence complete');
    return intelligence;
    
  } catch (error) {
    console.error('❌ Error enriching company:', error);
    throw error;
  }
};

/**
 * Initialize service (clear expired cache on load)
 */
export const initCompanyIntelligence = (): void => {
  clearExpiredCache();
};

