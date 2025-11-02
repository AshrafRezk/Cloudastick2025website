exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    console.log('🏢 Company Enrichment - Request received');
    console.log('📥 Request Body:', event.body);

    const { domain } = JSON.parse(event.body);

    if (!domain) {
      console.log('❌ Missing domain in request body');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Domain is required' }),
      };
    }

    // Clean domain (remove protocol, www, trailing slashes)
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .split('/')[0];

    console.log('🧹 Cleaned domain:', cleanDomain);

    // Smart extraction from domain name
    console.log('🧠 Using intelligent domain analysis');
    
    // Extract company name from domain
    const domainParts = cleanDomain.split('.');
    const baseName = domainParts[0];
    
    // Capitalize properly (handle cases like "emaar", "bechtel", etc.)
    let companyName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
    
    // Better formatting for common patterns
    if (baseName.includes('-')) {
      companyName = baseName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Detect industry from domain name keywords
    const detectIndustryFromDomain = (domain) => {
      const lowerDomain = domain.toLowerCase();
      
      // Real estate keywords
      if (lowerDomain.match(/property|estate|realty|homes|housing|apartments|land|properties|real-?estate/)) {
        return { industry: 'Real Estate', normalized: 'real-estate' };
      }
      
      // Construction keywords
      if (lowerDomain.match(/construct|build|engineer|architect|contractor|infrastructure/)) {
        return { industry: 'Construction & Engineering', normalized: 'construction' };
      }
      
      // Insurance keywords
      if (lowerDomain.match(/insurance|insure|life|health|assurance/)) {
        return { industry: 'Insurance', normalized: 'insurance' };
      }
      
      // Manufacturing keywords
      if (lowerDomain.match(/manufact|industrial|factory|production/)) {
        return { industry: 'Manufacturing', normalized: 'manufacturing' };
      }
      
      // Tech keywords
      if (lowerDomain.match(/tech|software|digital|cloud|ai|data|cyber|it-|saas|app/)) {
        return { industry: 'Technology', normalized: 'technology' };
      }
      
      // Healthcare keywords
      if (lowerDomain.match(/health|medical|hospital|clinic|pharma|care/)) {
        return { industry: 'Healthcare', normalized: 'healthcare' };
      }
      
      // Retail keywords
      if (lowerDomain.match(/shop|store|retail|ecommerce|market/)) {
        return { industry: 'Retail', normalized: 'retail' };
      }
      
      // Finance keywords
      if (lowerDomain.match(/bank|finance|fintech|capital|invest|wealth/)) {
        return { industry: 'Financial Services', normalized: 'finance' };
      }
      
      // Travel keywords
      if (lowerDomain.match(/travel|hotel|resort|tourism|hospitality/)) {
        return { industry: 'Travel & Tourism', normalized: 'travel-tourism' };
      }
      
      // Education keywords
      if (lowerDomain.match(/edu|school|university|college|academy|learning/)) {
        return { industry: 'Education', normalized: 'education' };
      }
      
      return { industry: 'Business Services', normalized: 'other' };
    };
    
    const industryInfo = detectIndustryFromDomain(cleanDomain);
    
    console.log('📊 Detected from domain:', { companyName, ...industryInfo });

    // Return intelligent enriched data
    const enrichedData = {
      companyName: companyName,
      industry: industryInfo.industry,
      employeeCount: null, // Will be enriched from news context if available
      location: null, // Will be enriched from news context if available
      normalizedIndustry: industryInfo.normalized,
      source: 'intelligent-detection',
      confidence: industryInfo.normalized !== 'other' ? 'high' : 'medium'
    };

    console.log('✅ Intelligently enriched company data:', enrichedData);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedData),
    };

  } catch (error) {
    console.error('❌ Company Enrichment error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);

    // Return fallback data on error
    try {
      const { domain } = JSON.parse(event.body);
      const cleanDomain = domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .split('/')[0];
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: cleanDomain.split('.')[0].charAt(0).toUpperCase() + cleanDomain.split('.')[0].slice(1),
          industry: 'Unknown',
          employeeCount: null,
          location: null,
          normalizedIndustry: 'other',
          source: 'fallback',
          error: error.message
        }),
      };
    } catch {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to enrich company data',
          message: error.message
        }),
      };
    }
  }
};

