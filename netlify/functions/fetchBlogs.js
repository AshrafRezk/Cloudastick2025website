/**
 * Netlify Function for fetching blogs from Salesforce
 * Queries Blog_Post__c object and returns the latest published blogs
 * Uses Netlify Blobs cache to reduce API calls
 */

const {
  getCache,
  setCache,
  getListCacheKey,
  simpleHash,
  CACHE_TTLS,
} = require('./salesforceCacheManager');

exports.handler = async (event, context) => {
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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📰 Fetch Blogs - Request received');

    const { access_token, instance_url } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing access_token or instance_url' }),
      };
    }

    // Check cache first
    const query = "SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null ORDER BY Published_Date__c DESC LIMIT 3";
    const queryHash = simpleHash(query);
    const listCacheKey = getListCacheKey('Blog_Post__c', queryHash);
    const cacheTTL = CACHE_TTLS['Blog_Post__c'] || CACHE_TTLS['all-blogs'];
    
    let blogs = null;
    let fromCache = false;
    
    const cached = await getCache(listCacheKey, cacheTTL, context);
    if (cached && !cached.isStale) {
      // Use fresh cache
      blogs = cached.data;
      fromCache = true;
      console.log('✅ Using cached blogs');
    } else {
      // Cache miss or stale - fetch from Salesforce
      const soqlQuery = encodeURIComponent(query);
      const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${soqlQuery}`;

      console.log('📤 Querying Salesforce for blogs...');

      let response;
      let data;
      
      try {
        response = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📥 Salesforce Response Status:', response.status);

        if (!response.ok) {
          // If API fails but we have stale cache, use it
          if (cached && cached.isStale) {
            console.warn('⚠️ Salesforce API failed, using stale cache');
            blogs = cached.data;
            fromCache = true;
          } else {
            const errorText = await response.text();
            console.error('❌ Salesforce API Error:', errorText);
            throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
          }
        } else {
          data = await response.json();
          console.log(`✅ Fetched ${data.records?.length || 0} blog records from Salesforce`);

          // Transform Salesforce records to blog format
          blogs = (data.records || []).map((record) => ({
            id: record.Id,
            urlName: record.URL_Name__c || '',
            title: record.Header__c || '',
            content: record.Content__c || '',
            publishedDate: record.Published_Date__c || null,
          }));

          // Cache the result (async, don't wait)
          setCache(listCacheKey, blogs, {
            objectType: 'Blog_Post__c',
            query: query,
            cachedAt: new Date().toISOString(),
          }, context).catch(err => console.warn('⚠️ Failed to cache blogs:', err.message));
        }
      } catch (fetchError) {
        // If we have stale cache, use it
        if (cached && cached.isStale) {
          console.warn('⚠️ Fetch error, using stale cache:', fetchError.message);
          blogs = cached.data;
          fromCache = true;
        } else {
          throw fetchError;
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': fromCache ? 'public, max-age=3600' : 'public, max-age=86400',
      },
      body: JSON.stringify({ 
        blogs,
        metadata: {
          fromCache,
          cached: fromCache,
        },
      }),
    };

  } catch (error) {
    console.error('❌ Fetch Blogs Function Error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch blogs from Salesforce',
        message: error.message
      }),
    };
  }
};

