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
    console.log('📰 News Fetching - Request received');
    console.log('📥 Request Body:', event.body);

    const { companyName, industry } = JSON.parse(event.body);

    if (!companyName && !industry) {
      console.log('❌ Missing companyName or industry in request body');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Company name or industry is required' }),
      };
    }

    // Get API key from environment variables
    const apiKey = process.env.NEWSAPI_KEY;

    if (!apiKey) {
      console.log('⚠️ NewsAPI key not configured, returning empty results');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: [],
          events: [],
          source: 'fallback',
          message: 'News API not configured'
        }),
      };
    }

    console.log('📤 Sending request to NewsAPI');
    console.log('📤 API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('📤 Query:', { companyName, industry });

    // Build search query - prioritize company name, fallback to industry
    const searchQuery = companyName || industry;
    const sortBy = 'relevancy'; // or 'publishedAt' for latest
    const pageSize = 5; // Top 5 articles

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=${sortBy}&pageSize=${pageSize}&language=en&apiKey=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📥 NewsAPI Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NewsAPI Error Response:', errorText);
      
      // Return empty results instead of failing
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: [],
          events: [],
          source: 'fallback',
          error: 'News API unavailable'
        }),
      };
    }

    const data = await response.json();
    console.log('📥 NewsAPI Response - Total Results:', data.totalResults);

    // Process articles
    const articles = (data.articles || []).slice(0, 3).map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source?.name || 'Unknown',
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage
    }));

    // Detect events from articles (simple keyword detection)
    const eventKeywords = ['event', 'conference', 'summit', 'expo', 'exhibition', 'launch', 'announcement', 'webinar', 'seminar'];
    const events = articles.filter(article => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      return eventKeywords.some(keyword => text.includes(keyword));
    });

    console.log('✅ Processed articles:', articles.length);
    console.log('✅ Detected events:', events.length);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articles,
        events,
        source: 'newsapi',
        query: searchQuery
      }),
    };

  } catch (error) {
    console.error('❌ News Fetching error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articles: [],
        events: [],
        source: 'fallback',
        error: error.message
      }),
    };
  }
};

