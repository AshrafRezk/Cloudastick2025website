const { getStore } = require('@netlify/blobs');

/**
 * Fuzzy search algorithm for company names
 * Returns a similarity score between 0 and 1
 */
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Exact match
  if (s1 === s2) return 1;

  // One contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }

  // Levenshtein distance for fuzzy matching
  const matrix = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const maxLen = Math.max(s1.length, s2.length);
  const distance = matrix[s2.length][s1.length];
  return 1 - distance / maxLen;
}

/**
 * Netlify Function to search for cached company data
 * Implements cognitive/fuzzy search to find similar companies
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    let searchQuery = '';
    
    // Support both GET and POST
    if (event.httpMethod === 'GET') {
      searchQuery = event.queryStringParameters?.query || '';
    } else if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      searchQuery = body.query || body.domain || '';
    }

    if (!searchQuery) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Search query is required' }),
      };
    }

    // Clean search query
    const cleanQuery = searchQuery
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .split('/')[0]
      .toLowerCase();

    console.log('🔍 Searching for:', cleanQuery);

    // Initialize Netlify Blobs store
    const store = getStore({
      name: 'company-intelligence',
      context,
    });

    // Try exact match first
    const exactMatch = await store.get(cleanQuery);
    if (exactMatch) {
      console.log('✅ Exact match found');
      const data = JSON.parse(exactMatch);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          found: true,
          exact: true,
          data: data,
          domain: cleanQuery,
        }),
      };
    }

    // Get search index for fuzzy matching
    let searchIndex = [];
    try {
      const indexData = await store.get('_search_index');
      if (indexData) {
        searchIndex = JSON.parse(indexData);
      }
    } catch (e) {
      console.log('No search index found');
    }

    if (searchIndex.length === 0) {
      console.log('📭 No cached companies found');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          found: false,
          message: 'No cached data available',
          suggestions: [],
        }),
      };
    }

    // Fuzzy search through index
    const results = searchIndex
      .map(item => {
        // Calculate similarity scores for different fields
        const scores = [
          calculateSimilarity(cleanQuery, item.domain),
          calculateSimilarity(cleanQuery, item.companyName),
          ...item.searchTerms.map(term => calculateSimilarity(cleanQuery, term)),
        ];
        
        const maxScore = Math.max(...scores);
        
        return {
          ...item,
          similarityScore: maxScore,
        };
      })
      .filter(item => item.similarityScore > 0.5) // Only include decent matches
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 5); // Top 5 matches

    if (results.length === 0) {
      console.log('🔍 No similar companies found');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          found: false,
          message: 'No similar companies found',
          suggestions: [],
        }),
      };
    }

    // Fetch full data for best match if similarity is high enough
    const bestMatch = results[0];
    if (bestMatch.similarityScore >= 0.7) {
      const fullData = await store.get(bestMatch.domain);
      if (fullData) {
        console.log('✅ High similarity match found:', bestMatch.domain);
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            found: true,
            exact: false,
            similarityScore: bestMatch.similarityScore,
            data: JSON.parse(fullData),
            domain: bestMatch.domain,
            suggestions: results.slice(1),
          }),
        };
      }
    }

    // Return suggestions if no high-confidence match
    console.log(`📋 Found ${results.length} similar companies`);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        found: false,
        message: 'Similar companies found',
        suggestions: results,
      }),
    };

  } catch (error) {
    console.error('❌ Error searching companies:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to search companies',
        message: error.message,
      }),
    };
  }
};

