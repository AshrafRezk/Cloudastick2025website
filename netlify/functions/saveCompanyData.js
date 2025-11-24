const { getStore } = require('@netlify/blobs');

/**
 * Netlify Function to save company intelligence data
 * This creates a searchable cache of company data to avoid redundant API calls
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { domain, data } = JSON.parse(event.body);

    if (!domain || !data) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Domain and data are required' }),
      };
    }

    // Clean domain
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
      .split('/')[0]
      .toLowerCase();

    console.log('💾 Saving company data for:', cleanDomain);

    // Initialize Netlify Blobs store
    const store = getStore({
      name: 'company-intelligence',
      context,
    });

    // Prepare data to save
    const companyData = {
      domain: cleanDomain,
      ...data,
      savedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // Save company data with domain as key
    await store.set(cleanDomain, JSON.stringify(companyData));

    // Update search index (list of all companies)
    let searchIndex = [];
    try {
      const existingIndex = await store.get('_search_index');
      if (existingIndex) {
        searchIndex = JSON.parse(existingIndex);
      }
    } catch (e) {
      console.log('Creating new search index');
    }

    // Add/update entry in search index
    const indexEntry = {
      domain: cleanDomain,
      companyName: data.companyName || cleanDomain,
      industry: data.industry || 'Unknown',
      searchTerms: [
        cleanDomain,
        (data.companyName || '').toLowerCase(),
        (data.industry || '').toLowerCase(),
        ...(data.products || []).map(p => (p.name || '').toLowerCase()),
      ].filter(Boolean),
      lastUpdated: new Date().toISOString(),
    };

    // Remove old entry if exists
    searchIndex = searchIndex.filter(item => item.domain !== cleanDomain);
    // Add new entry
    searchIndex.push(indexEntry);

    // Save updated search index
    await store.set('_search_index', JSON.stringify(searchIndex));

    console.log('✅ Company data saved successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        domain: cleanDomain,
        message: 'Company data saved successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error saving company data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to save company data',
        message: error.message,
      }),
    };
  }
};

