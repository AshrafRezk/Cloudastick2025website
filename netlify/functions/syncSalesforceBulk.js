/**
 * Netlify Function to Sync All Salesforce Data Using Bulk API 2.0
 * 
 * Uses Salesforce Bulk API 2.0 for efficient large data transfers
 * Runs queries for all objects and stores in Netlify Blobs cache
 * 
 * This can be run:
 * - Manually via POST request
 * - Scheduled via Netlify Scheduled Functions (cron)
 * - Triggered via webhook after Salesforce data changes
 * 
 * Usage:
 * POST /.netlify/functions/syncSalesforceBulk
 * Body: { access_token, instance_url, objects?: ['Contact', 'User', ...] }
 */

const {
  setCache,
  getCacheKey,
  getListCacheKey,
  simpleHash,
  CACHE_TTLS,
  clearAllCache,
} = require('./salesforceCacheManager');

/**
 * Create a Bulk API 2.0 job
 */
async function createBulkJob(soqlQuery, objectType, access_token, instance_url) {
  const jobUrl = `${instance_url}/services/data/v58.0/jobs/query`;
  
  const response = await fetch(jobUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operation: 'query',
      query: soqlQuery,
      contentType: 'JSON',
      lineEnding: 'LF',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Bulk API job: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Check Bulk API job status
 */
async function checkBulkJobStatus(jobId, access_token, instance_url) {
  const statusUrl = `${instance_url}/services/data/v58.0/jobs/query/${jobId}`;
  
  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to check job status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get Bulk API job results
 */
async function getBulkJobResults(jobId, access_token, instance_url) {
  const resultsUrl = `${instance_url}/services/data/v58.0/jobs/query/${jobId}/results`;
  
  const response = await fetch(resultsUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get job results: ${response.status}`);
  }

  // Bulk API returns results as newline-delimited JSON
  const text = await response.text();
  const lines = text.trim().split('\n');
  
  return lines
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        console.warn('Failed to parse JSON line:', line);
        return null;
      }
    })
    .filter(record => record !== null);
}

/**
 * Wait for Bulk API job to complete
 */
async function waitForBulkJobCompletion(jobId, access_token, instance_url, maxWaitTime = 300000) {
  const startTime = Date.now();
  const pollInterval = 2000; // Poll every 2 seconds

  while (Date.now() - startTime < maxWaitTime) {
    const jobStatus = await checkBulkJobStatus(jobId, access_token, instance_url);
    
    console.log(`📊 Bulk API Job ${jobId} status: ${jobStatus.state}`);

    if (jobStatus.state === 'JobComplete') {
      return jobStatus;
    } else if (jobStatus.state === 'Failed' || jobStatus.state === 'Aborted') {
      throw new Error(`Bulk API job failed: ${jobStatus.stateMessage || 'Unknown error'}`);
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('Bulk API job timed out');
}

/**
 * Sync a single object using Bulk API
 */
async function syncObjectBulk(objectType, access_token, instance_url) {
  const result = {
    objectType,
    count: 0,
    cached: 0,
    errors: 0,
    records: [],
    jobId: null,
  };

  try {
    // Define queries for each object type
    const queries = {
      'Contact': "SELECT Id, Name, Email, ReportsToId, ReportsTo.Name, Associated_User__c FROM Contact",
      'User': "SELECT Id, Name, Email, Username FROM User WHERE IsActive = true",
      'OKR__c': "SELECT Id, Name, Owner__c, Type__c, Status__c, Parent_Objective__c, Due_Date__c, Department__c, Quarter__c, Progress__c, Weight__c, Overall_Health__c, Comments__c, CreatedDate FROM OKR__c",
      'Blog_Post__c': "SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null",
      'Requirement__c': "SELECT Id, Name, OwnerId, Status__c, Description__c FROM Requirement__c",
      'SFDC_Project__c': "SELECT Id, Name, OwnerId, Status__c FROM SFDC_Project__c",
    };

    const soqlQuery = queries[objectType];
    if (!soqlQuery) {
      throw new Error(`No query configured for object type: ${objectType}`);
    }

    console.log(`📦 Creating Bulk API job for ${objectType}...`);
    
    // Create Bulk API job
    const job = await createBulkJob(soqlQuery, objectType, access_token, instance_url);
    result.jobId = job.id;
    
    console.log(`⏳ Waiting for Bulk API job ${job.id} to complete...`);
    
    // Wait for job to complete
    const jobStatus = await waitForBulkJobCompletion(job.id, access_token, instance_url);
    
    console.log(`✅ Bulk API job completed. Records: ${jobStatus.numberRecordsProcessed || 0}`);
    
    // Get results
    const records = await getBulkJobResults(job.id, access_token, instance_url);
    result.count = records.length;
    
    console.log(`📥 Retrieved ${records.length} records for ${objectType}`);

    // Cache each record individually
    for (const record of records) {
      try {
        const cacheKey = getCacheKey(objectType, record.Id);
        await setCache(cacheKey, record, {
          objectType,
          syncedAt: new Date().toISOString(),
          syncMethod: 'bulk-api',
        });
        result.cached++;
        result.records.push(record.Id);
      } catch (cacheError) {
        console.warn(`⚠️ Failed to cache ${objectType}:${record.Id}:`, cacheError.message);
        result.errors++;
      }
    }

    // Cache the full list as well
    const listCacheKey = getListCacheKey(objectType, simpleHash(soqlQuery));
    await setCache(listCacheKey, result.records, {
      objectType,
      query: soqlQuery,
      count: result.count,
      syncedAt: new Date().toISOString(),
      syncMethod: 'bulk-api',
    });

    console.log(`✅ Cached ${result.cached} ${objectType} records`);

  } catch (error) {
    console.error(`❌ Error syncing ${objectType} via Bulk API:`, error);
    result.error = error.message;
    throw error;
  }

  return result;
}

/**
 * Sync objects using regular SOQL (for smaller datasets or fallback)
 */
async function syncObjectRegular(objectType, access_token, instance_url) {
  const result = {
    objectType,
    count: 0,
    cached: 0,
    errors: 0,
    records: [],
  };

  try {
    const queries = {
      'Contact': "SELECT Id, Name, Email, ReportsToId, ReportsTo.Name, Associated_User__c FROM Contact",
      'User': "SELECT Id, Name, Email, Username FROM User WHERE IsActive = true",
      'OKR__c': "SELECT Id, Name, Owner__c, Type__c, Status__c, Parent_Objective__c, Due_Date__c, Department__c, Quarter__c, Progress__c, Weight__c, Overall_Health__c, Comments__c, CreatedDate FROM OKR__c",
      'Blog_Post__c': "SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null ORDER BY Published_Date__c DESC",
      'Requirement__c': "SELECT Id, Name, OwnerId, Status__c, Description__c FROM Requirement__c",
      'SFDC_Project__c': "SELECT Id, Name, OwnerId, Status__c FROM SFDC_Project__c",
    };

    const soqlQuery = queries[objectType];
    if (!soqlQuery) {
      throw new Error(`No query configured for object type: ${objectType}`);
    }

    // Use regular SOQL with pagination
    let hasMore = true;
    let offset = 0;
    const limit = 2000;

    while (hasMore) {
      const query = `${soqlQuery} LIMIT ${limit} OFFSET ${offset}`;
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

      // Cache each record
      for (const record of records) {
        try {
          const cacheKey = getCacheKey(objectType, record.Id);
          await setCache(cacheKey, record, {
            objectType,
            syncedAt: new Date().toISOString(),
            syncMethod: 'soql',
          });
          result.cached++;
          result.records.push(record.Id);
        } catch (cacheError) {
          result.errors++;
        }
      }

      result.count += records.length;
      hasMore = data.done === false && records.length === limit;
      offset += limit;

      if (offset > 50000) {
        console.warn(`⚠️ Reached safety limit for ${objectType}`);
        break;
      }
    }

    // Cache the list
    const listCacheKey = getListCacheKey(objectType, simpleHash(soqlQuery));
    await setCache(listCacheKey, result.records, {
      objectType,
      query: soqlQuery,
      count: result.count,
      syncedAt: new Date().toISOString(),
      syncMethod: 'soql',
    });

  } catch (error) {
    console.error(`❌ Error syncing ${objectType}:`, error);
    throw error;
  }

  return result;
}

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
    console.log('🔄 Starting Salesforce Bulk API sync...');

    const { 
      access_token, 
      instance_url, 
      objects = [],
      useBulkAPI = true,
      clearCacheFirst = false,
    } = JSON.parse(event.body || '{}');

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

    // Clear cache first if requested
    if (clearCacheFirst) {
      console.log('🗑️ Clearing all cache first...');
      await clearAllCache();
    }

    const results = {
      startedAt: new Date().toISOString(),
      syncMethod: useBulkAPI ? 'bulk-api' : 'soql',
      objects: {},
      totalRecordsCached: 0,
      errors: [],
      duration: null,
    };

    // Sync each object
    for (const objectType of objectsToSync) {
      try {
        console.log(`\n📦 Syncing ${objectType}...`);
        const startTime = Date.now();
        
        let objectResult;
        if (useBulkAPI) {
          objectResult = await syncObjectBulk(objectType, access_token, instance_url);
        } else {
          objectResult = await syncObjectRegular(objectType, access_token, instance_url);
        }
        
        objectResult.duration = Date.now() - startTime;
        results.objects[objectType] = objectResult;
        results.totalRecordsCached += objectResult.cached;
        
        console.log(`✅ ${objectType}: ${objectResult.cached} records cached in ${objectResult.duration}ms`);
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

    console.log(`\n✅ Bulk sync complete!`);
    console.log(`📊 Total records cached: ${results.totalRecordsCached}`);
    console.log(`⏱️ Duration: ${results.duration}ms`);

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
    console.error('❌ Error in Bulk API sync:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to sync via Bulk API',
        message: error.message,
      }),
    };
  }
};

