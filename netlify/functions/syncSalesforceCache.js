/**
 * Netlify Function to Sync All Salesforce Data to Cache
 * 
 * This function queries all relevant Salesforce data and stores it in Netlify Blobs cache
 * Run this periodically (e.g., daily) or on-demand to populate/refresh the cache
 * 
 * Objects synced:
 * - Contacts (all)
 * - Users (all)
 * - OKRs (all, with pagination)
 * - Blogs (all published)
 * - Requirements (all)
 * - Projects (all)
 * 
 * Usage:
 * POST /.netlify/functions/syncSalesforceCache
 * Body: { access_token, instance_url }
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
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    console.log('🔄 Starting Salesforce cache sync...');

    const { access_token, instance_url, objects = [] } = JSON.parse(event.body || '{}');

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

    // Default objects to sync if none specified
    const objectsToSync = objects.length > 0 ? objects : [
      'Contact',
      'User',
      'OKR__c',
      'Blog_Post__c',
      'Requirement__c',
      'SFDC_Project__c',
    ];

    const results = {
      startedAt: new Date().toISOString(),
      objects: {},
      totalRecordsCached: 0,
      errors: [],
    };

    // Sync each object type
    for (const objectType of objectsToSync) {
      try {
        console.log(`📦 Syncing ${objectType}...`);
        const objectResult = await syncObject(objectType, access_token, instance_url);
        results.objects[objectType] = objectResult;
        results.totalRecordsCached += objectResult.count;
        console.log(`✅ Synced ${objectResult.count} ${objectType} records`);
      } catch (error) {
        console.error(`❌ Error syncing ${objectType}:`, error.message);
        results.errors.push({
          objectType,
          error: error.message,
        });
      }
    }

    results.completedAt = new Date().toISOString();
    results.duration = new Date(results.completedAt) - new Date(results.startedAt);

    console.log(`✅ Cache sync complete: ${results.totalRecordsCached} records cached`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        results,
      }),
    };
  } catch (error) {
    console.error('❌ Error in cache sync:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to sync cache',
        message: error.message,
      }),
    };
  }
};

/**
 * Sync a specific object type
 */
async function syncObject(objectType, access_token, instance_url) {
  const result = {
    count: 0,
    cached: 0,
    errors: 0,
    records: [],
  };

  try {
    // Define queries for each object type
    const queries = {
      'Contact': {
        query: "SELECT Id, Name, Email, ReportsToId, ReportsTo.Name, Associated_User__c FROM Contact",
        limit: 5000,
      },
      'User': {
        query: "SELECT Id, Name, Email, Username FROM User WHERE IsActive = true",
        limit: 5000,
      },
      'OKR__c': {
        query: "SELECT Id, Name, Owner__c, Type__c, Status__c, Parent_Objective__c, Due_Date__c, Department__c, Quarter__c, Progress__c, Weight__c, Overall_Health__c, Comments__c, CreatedDate FROM OKR__c",
        limit: 5000,
      },
      'Blog_Post__c': {
        query: "SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null ORDER BY Published_Date__c DESC",
        limit: 1000,
      },
      'Requirement__c': {
        query: "SELECT Id, Name, OwnerId, Status__c, Description__c FROM Requirement__c",
        limit: 5000,
      },
      'SFDC_Project__c': {
        query: "SELECT Id, Name, OwnerId, Status__c FROM SFDC_Project__c",
        limit: 5000,
      },
    };

    const queryConfig = queries[objectType];
    if (!queryConfig) {
      throw new Error(`No query configured for object type: ${objectType}`);
    }

    // Execute query with pagination
    let hasMore = true;
    let offset = 0;
    const limit = queryConfig.limit || 2000;

    while (hasMore) {
      const query = `${queryConfig.query} LIMIT ${limit} OFFSET ${offset}`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

      const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const records = data.records || [];

      // Cache each record individually
      for (const record of records) {
        try {
          const cacheKey = getCacheKey(objectType, record.Id);
          await setCache(cacheKey, record, {
            objectType,
            syncedAt: new Date().toISOString(),
          });
          result.cached++;
          result.records.push(record.Id);
        } catch (cacheError) {
          console.warn(`⚠️ Failed to cache ${objectType}:${record.Id}:`, cacheError.message);
          result.errors++;
        }
      }

      result.count += records.length;
      hasMore = data.done === false && records.length === limit;
      offset += limit;

      // Safety limit to prevent infinite loops
      if (offset > 10000) {
        console.warn(`⚠️ Reached safety limit for ${objectType} sync`);
        break;
      }
    }

    // Cache the list as well (for list queries)
    const listQuery = queryConfig.query.split(' LIMIT')[0]; // Remove LIMIT if present
    const listCacheKey = getListCacheKey(objectType, simpleHash(listQuery));
    await setCache(listCacheKey, result.records, {
      objectType,
      query: listQuery,
      count: result.count,
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error(`❌ Error syncing ${objectType}:`, error);
    throw error;
  }

  return result;
}

