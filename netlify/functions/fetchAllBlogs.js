/**
 * Netlify Function for fetching all blogs from Salesforce with pagination
 * Queries Blog_Post__c object and returns paginated results
 * Uses Netlify Blobs cache to reduce API calls
 */

const {
  getCache,
  setCache,
  getCacheKey,
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
    console.log('📰 Fetch All Blogs - Request received');

    const { access_token, instance_url, page = 1, pageSize = 10 } = JSON.parse(event.body || '{}');

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

    const offset = (page - 1) * pageSize;

    // Check cache for all blogs first
    const baseQuery = "SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null ORDER BY Published_Date__c DESC";
    const listCacheKey = getListCacheKey('Blog_Post__c', simpleHash(baseQuery));
    const cacheTTL = CACHE_TTLS['Blog_Post__c'] || CACHE_TTLS['all-blogs'];
    
    let allBlogs = null;
    let fromCache = false;
    let totalCount = 0;
    
    const cached = await getCache(listCacheKey, cacheTTL, context);
    if (cached && !cached.isStale) {
      // Use cached blog IDs list
      console.log('✅ Using cached blog list');
      const cachedRecordIds = cached.data || [];
      
      // Fetch individual blog records from cache
      const blogPromises = cachedRecordIds.map(id => {
        const recordCacheKey = getCacheKey('Blog_Post__c', id);
        return getCache(recordCacheKey, cacheTTL, context);
      });
      
      const cachedBlogs = await Promise.all(blogPromises);
      allBlogs = cachedBlogs
        .filter(b => b && b.data)
        .map(b => b.data)
        .filter(record => record && record.Id); // Filter out any nulls
      
      if (allBlogs.length > 0) {
        fromCache = true;
        totalCount = allBlogs.length;
      }
    }

    // If cache miss, fetch from Salesforce
    if (!fromCache) {
      const soqlQuery = encodeURIComponent(baseQuery);
      const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${soqlQuery}`;

      console.log('📤 Querying Salesforce for all blogs...');

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
          if (cached && cached.isStale) {
            console.warn('⚠️ API failed, using stale cache');
            // Try to get from stale cache
            const cachedRecordIds = cached.data || [];
            const blogPromises = cachedRecordIds.map(id => {
              const recordCacheKey = getCacheKey('Blog_Post__c', id);
              return getCache(recordCacheKey, cacheTTL * 2, context); // Use stale cache TTL
            });
            const cachedBlogs = await Promise.all(blogPromises);
            allBlogs = cachedBlogs
              .filter(b => b && b.data)
              .map(b => b.data)
              .filter(record => record && record.Id);
            totalCount = allBlogs.length;
            fromCache = true;
          } else {
            const errorText = await response.text();
            throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
          }
        } else {
          data = await response.json();
          const records = data.records || [];
          
          // Cache individual records
          const cachePromises = records.map(record => {
            const recordCacheKey = getCacheKey('Blog_Post__c', record.Id);
            return setCache(recordCacheKey, record, {
              objectType: 'Blog_Post__c',
              cachedAt: new Date().toISOString(),
            }, context);
          });
          await Promise.all(cachePromises);
          
          // Cache the list
          const recordIds = records.map(r => r.Id);
          await setCache(listCacheKey, recordIds, {
            objectType: 'Blog_Post__c',
            query: baseQuery,
            count: records.length,
            cachedAt: new Date().toISOString(),
          }, context);
          
          allBlogs = records;
          totalCount = records.length;
        }
      } catch (fetchError) {
        if (cached && cached.isStale) {
          console.warn('⚠️ Fetch failed, using stale cache:', fetchError.message);
          // Try stale cache
          const cachedRecordIds = cached.data || [];
          const blogPromises = cachedRecordIds.map(id => {
            const recordCacheKey = getCacheKey('Blog_Post__c', id);
            return getCache(recordCacheKey, cacheTTL * 2, context);
          });
          const cachedBlogs = await Promise.all(blogPromises);
          allBlogs = cachedBlogs
            .filter(b => b && b.data)
            .map(b => b.data)
            .filter(record => record && record.Id);
          totalCount = allBlogs.length;
          fromCache = true;
        } else {
          throw fetchError;
        }
      }
    }

    // Transform to blog format and paginate
    const blogsData = (allBlogs || []).map((record) => ({
      id: record.Id,
      urlName: record.URL_Name__c || '',
      title: record.Header__c || '',
      content: record.Content__c || '',
      publishedDate: record.Published_Date__c || null,
    }));

    // Apply pagination
    const blogs = blogsData.slice(offset, offset + pageSize)

    const totalPages = Math.ceil(totalCount / pageSize);

    // Enhanced Netlify CDN caching headers for global distribution
    // Using stale-while-revalidate for better performance
    const cacheControl = fromCache 
      ? 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
      : 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': cacheControl,
        // Additional headers for Netlify CDN
        'CDN-Cache-Control': 'public, max-age=3600',
        'Vary': 'Accept-Encoding',
      },
      body: JSON.stringify({ 
        blogs,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
        metadata: {
          fromCache,
          cached: fromCache,
        }
      }),
    };

  } catch (error) {
    console.error('❌ Fetch All Blogs Function Error:');
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

