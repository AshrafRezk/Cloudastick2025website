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
  aiInsights: string;
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
 * Generate AI insights using existing Gemini integration
 */
const generateAIInsights = async (companyData: CompanyData, news: NewsArticle[]): Promise<string> => {
  const newsContext = news.length > 0
    ? `Recent news about ${companyData.companyName}: ${news.slice(0, 2).map(n => n.title).join('; ')}`
    : '';
  
  const prompt = `You are a Salesforce solutions expert. Based on the following company information, provide 2-3 concise bullet points (max 50 words each) on how Salesforce could specifically help this company:

Company: ${companyData.companyName}
Industry: ${companyData.industry}
${newsContext}

Focus on:
1. Industry-specific Salesforce solutions
2. Key pain points Salesforce solves in this industry
3. Competitive advantages they would gain

Keep responses professional, specific, and benefit-focused. Use bullet points starting with "•".`;

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
  return data.response || 'Unable to generate insights at this time.';
};

/**
 * Main function to enrich company with full intelligence
 */
export const enrichCompany = async (domain: string, forceRefresh = false): Promise<CompanyIntelligence> => {
  const cleanedDomain = cleanDomain(domain);
  
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedData(cleanedDomain);
    if (cached) {
      return cached;
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
    
    // Step 4: Generate AI insights
    console.log('🤖 Generating AI insights...');
    const aiInsights = await generateAIInsights(companyData, newsData.articles);
    
    // Step 5: Get product recommendation
    const recommendedProduct = getProductRecommendation(companyData.normalizedIndustry);
    
    // Build intelligence object
    const intelligence: CompanyIntelligence = {
      domain: cleanedDomain,
      companyData,
      news: newsData.articles || [],
      events: newsData.events || [],
      aiInsights,
      recommendedProduct,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };
    
    // Cache the results
    setCachedData(cleanedDomain, intelligence);
    
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

