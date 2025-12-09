/**
 * Netlify Function to Receive Salesforce Cache Invalidation Webhooks
 * 
 * This function receives webhooks from Salesforce (CDC/Platform Events)
 * and invalidates the appropriate cache entries in Netlify Blobs
 * 
 * Setup in Salesforce:
 * 1. Enable Change Data Capture (CDC) for objects: Contact, User, OKR__c, Blog_Post__c, Requirement__c
 * 2. Or create Platform Events for these objects
 * 3. Create a Flow or Trigger that publishes to Platform Event or uses CDC
 * 4. Configure HTTP Callout in Flow/Trigger to POST to this webhook URL
 * 
 * Webhook URL: https://cloudastick.org/.netlify/functions/salesforceCacheWebhook
 * 
 * Environment variables:
 * - WEBHOOK_SECRET (optional, for authentication)
 */

const {
  invalidateRelatedCaches,
  invalidateRecord,
  invalidateObjectType,
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
    console.log('🔄 Salesforce cache invalidation webhook received');
    console.log('Headers:', JSON.stringify(event.headers, null, 2));

    // Optional: Verify webhook secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = event.headers.authorization || 
                        event.headers['x-webhook-secret'] || 
                        event.headers['x-salesforce-secret'];
      if (authHeader !== `Bearer ${webhookSecret}` && authHeader !== webhookSecret) {
        console.error('❌ Invalid webhook secret');
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }

    // Parse webhook payload
    let payload;
    try {
      payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      console.error('❌ Failed to parse webhook body as JSON:', e.message);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid JSON payload',
          message: e.message 
        }),
      };
    }

    console.log('📥 Webhook payload:', JSON.stringify(payload, null, 2));

    // Extract Salesforce data from different webhook formats
    let objectType, recordId, changeType, records;

    // Format 1: Change Data Capture (CDC) format
    if (payload.data && payload.data.payload) {
      const changeEvent = payload.data.payload.ChangeEventHeader;
      objectType = changeEvent?.entityName;
      recordId = payload.data.payload.Id;
      changeType = changeEvent?.changeType?.toLowerCase(); // 'CREATE', 'UPDATE', 'DELETE'
      records = [{
        objectType,
        recordId,
        changeType,
        payload: payload.data.payload,
      }];
    }
    // Format 2: Platform Event format from Apex HTTP Callout (simple format)
    // This is the format sent by NetlifyCacheWebhookCallout Apex class
    else if (payload.objectType && payload.recordId) {
      objectType = payload.objectType;
      recordId = payload.recordId;
      changeType = (payload.changeType || payload.action || 'UPDATE').toLowerCase();
      records = [{
        objectType,
        recordId,
        changeType,
        payload,
      }];
    }
    // Format 3: Platform Event format (array of events)
    else if (Array.isArray(payload)) {
      records = payload.map(event => {
        // Platform Event payload structure
        const objType = event.entityName || event.objectType || event.Object_Type__c || event.sObject?.attributes?.type;
        const recId = event.recordId || event.Record_ID__c || event.Id || event.sObject?.Id;
        const change = event.changeType || event.Change_Type__c || event.action || 'UPDATE';
        return {
          objectType: objType,
          recordId: recId,
          changeType: change.toLowerCase(),
          payload: event,
        };
      });
      // Get object type from first record
      if (records.length > 0) {
        objectType = records[0].objectType;
      }
    }
    // Format 4: Platform Event sObject format
    else if (payload.entityName || (payload.sObject && payload.sObject.attributes)) {
      objectType = payload.entityName || payload.objectType || payload.sObject?.attributes?.type;
      recordId = payload.recordId || payload.Id || payload.sObject?.Id;
      changeType = (payload.changeType || payload.action || 'UPDATE').toLowerCase();
      records = [{
        objectType,
        recordId,
        changeType,
        payload,
      }];
    }
    // Format 5: Platform Event with custom fields (Object_Type__c, Record_ID__c, Change_Type__c)
    else if (payload.Object_Type__c || payload.Record_ID__c) {
      objectType = payload.Object_Type__c || payload.objectType;
      recordId = payload.Record_ID__c || payload.recordId;
      changeType = (payload.Change_Type__c || payload.changeType || payload.action || 'UPDATE').toLowerCase();
      records = [{
        objectType,
        recordId,
        changeType,
        payload,
      }];
    }
    // Format 6: Fallback - try to infer from payload
    else {
      objectType = payload.objectType || payload.type || payload.EntityName;
      recordId = payload.recordId || payload.id || payload.Id;
      changeType = (payload.action || payload.changeType || payload.ChangeType || 'UPDATE').toLowerCase();
      
      if (objectType && recordId) {
        records = [{
          objectType,
          recordId,
          changeType,
          payload,
        }];
      }
    }

    if (!objectType) {
      console.error('❌ Missing objectType in webhook payload');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required field: objectType',
          received: payload 
        }),
      };
    }

    console.log(`🔄 Processing cache invalidation for ${records.length} record(s) of type ${objectType}`);

    // Invalidate cache for each record
    const results = [];
    for (const record of records) {
      if (!record.objectType || !record.recordId) {
        console.warn('⚠️ Skipping invalid record:', record);
        continue;
      }

      try {
        if (record.changeType === 'delete') {
          // Delete - invalidate the record cache
          await invalidateRecord(record.objectType, record.recordId);
          results.push({
            objectType: record.objectType,
            recordId: record.recordId,
            action: 'deleted',
            success: true,
          });
        } else {
          // Create or Update - invalidate record and related caches
          await invalidateRelatedCaches(record.objectType, record.recordId);
          results.push({
            objectType: record.objectType,
            recordId: record.recordId,
            action: record.changeType,
            success: true,
          });
        }
      } catch (error) {
        console.error(`❌ Error invalidating cache for ${record.objectType}:${record.recordId}:`, error.message);
        results.push({
          objectType: record.objectType,
          recordId: record.recordId,
          action: record.changeType,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    console.log(`✅ Cache invalidation complete: ${successCount} successful, ${failCount} failed`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: `Processed ${records.length} cache invalidation(s)`,
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failCount,
        },
      }),
    };
  } catch (error) {
    console.error('❌ Error processing cache invalidation webhook:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to process cache invalidation webhook',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    };
  }
};

