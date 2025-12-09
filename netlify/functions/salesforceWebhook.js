/**
 * Netlify Function to Receive Salesforce Webhooks
 * This function receives webhooks from Salesforce when objects are created/updated
 * and triggers push notifications
 * 
 * To set up in Salesforce:
 * 1. Create a Platform Event or use Change Data Capture (CDC)
 * 2. Create an Outbound Message or use a Flow with HTTP Callout
 * 3. Point the webhook URL to: https://cloudastick.org/.netlify/functions/salesforceWebhook
 *    See DEPLOYMENT_URLS.md for all available URLs
 * 
 * Environment variables required:
 * - WEBHOOK_SECRET (optional, for authentication)
 */

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
    console.log('📥 Salesforce webhook received');
    console.log('Headers:', event.headers);
    console.log('Body:', event.body);

    // Optional: Verify webhook secret
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = event.headers.authorization || event.headers['x-webhook-secret'];
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

    // Parse Salesforce webhook payload
    // The format depends on how you configure the webhook in Salesforce
    let payload;
    try {
      payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (e) {
      // Handle SOAP/XML format from Outbound Messages
      console.log('Body is not JSON, might be XML or other format');
      payload = event.body;
    }

    // Extract Salesforce data
    // This depends on your Salesforce webhook configuration
    // Examples for different formats:

    // Format 1: Change Data Capture (CDC) format
    let salesforceObjectType, recordId, recordName, action, additionalData;

    if (payload.data && payload.data.payload) {
      // CDC format
      const changeEvent = payload.data.payload.ChangeEventHeader;
      salesforceObjectType = changeEvent?.entityName;
      recordId = payload.data.payload.Id;
      recordName = payload.data.payload.Name || payload.data.payload.Subject;
      action = changeEvent?.changeType?.toLowerCase(); // 'CREATE', 'UPDATE', 'DELETE'
      additionalData = payload.data.payload;
    } else if (payload.sobject) {
      // SOAP Outbound Message format
      salesforceObjectType = payload.sobject.type || payload.sobject.attributes?.type;
      recordId = payload.sobject.Id;
      recordName = payload.sobject.Name || payload.sobject.Subject;
      action = payload.sobject.attributes?.type ? 'updated' : 'created';
      additionalData = payload.sobject;
    } else if (payload.objectType) {
      // Custom format
      salesforceObjectType = payload.objectType;
      recordId = payload.recordId;
      recordName = payload.recordName;
      action = payload.action || 'updated';
      additionalData = payload;
    } else {
      // Try to infer from payload
      salesforceObjectType = payload.type || payload.EntityName || payload.objectType || 'Case';
      recordId = payload.Id || payload.id || payload.recordId;
      recordName = payload.Name || payload.name || payload.recordName || payload.Subject || payload.subject;
      action = payload.action || payload.ChangeType?.toLowerCase() || 'updated';
      additionalData = payload.additionalData || payload;
    }

    if (!salesforceObjectType || !recordId) {
      console.error('❌ Missing required fields:', { salesforceObjectType, recordId });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required fields: objectType and recordId',
          received: payload
        }),
      };
    }

    console.log('📥 Processing webhook:', {
      salesforceObjectType,
      recordId,
      recordName,
      action
    });

    // Invalidate cache for this record
    let cacheResult = null;
    try {
      const { invalidateRelatedCaches } = require('./salesforceCacheManager');
      await invalidateRelatedCaches(salesforceObjectType, recordId);
      cacheResult = { success: true, message: 'Cache invalidated' };
      console.log('✅ Cache invalidated for', salesforceObjectType, recordId);
    } catch (cacheError) {
      console.warn('⚠️ Cache invalidation failed:', cacheError.message);
      cacheResult = { success: false, error: cacheError.message };
    }

    // Call the sendPushNotification function
    // In Netlify, you can call another function or make an HTTP request
    const functionUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}/.netlify/functions/sendPushNotification`;
    
    let notificationResult = null;
    try {
      const notificationResponse = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salesforceObjectType,
          recordId,
          recordName,
          action,
          additionalData
        })
      });

      notificationResult = await notificationResponse.json();
      console.log('📱 Push notification result:', notificationResult);
    } catch (notificationError) {
      console.warn('⚠️ Push notification failed:', notificationError.message);
      notificationResult = { success: false, error: notificationError.message };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Webhook processed successfully',
        cacheResult,
        notificationResult
      }),
    };
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to process webhook',
        message: error.message
      }),
    };
  }
};

