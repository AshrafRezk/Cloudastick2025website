/**
 * Netlify Function to Send Push Notifications
 * This function receives Salesforce webhook data and sends push notifications to subscribed users
 * 
 * Environment variables required:
 * - VAPID_PUBLIC_KEY
 * - VAPID_PRIVATE_KEY
 * - VAPID_SUBJECT (usually your email or app URL)
 */

const webpush = require('web-push');

// Initialize web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:arezk@cloudastick.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// In production, you should use a database to store subscriptions
// For now, using in-memory storage (will be lost on function restart)
// IMPORTANT: In production, use Netlify Blobs, a database, or shared storage
let subscriptions = new Map();

/**
 * Get subscriptions from storage
 * In production, replace this with database/Blob storage
 */
async function getSubscriptions(salesforceObjectType) {
  try {
    // Option 1: Use Netlify Blobs (recommended for Netlify)
    if (typeof require !== 'undefined') {
      try {
        const { getStore } = require('@netlify/blobs');
        const store = getStore('push-subscriptions');
        const allSubscriptions = [];
        
        // Get all subscriptions from Blob store
        for await (const blob of store.list()) {
          const sub = await store.get(blob.key, { type: 'json' });
          if (sub) {
            allSubscriptions.push(sub);
          }
        }
        
        // Filter by salesforceObjectType if provided
        if (salesforceObjectType) {
          return allSubscriptions.filter(
            sub => sub.salesforceObjectType === salesforceObjectType
          );
        }
        return allSubscriptions;
      } catch (blobError) {
        console.log('Netlify Blobs not available, trying other storage methods');
      }
    }
    
    // Option 2: Call backend API (for local dev or separate backend)
    const backendUrl = process.env.BACKEND_URL;
    if (backendUrl) {
      const response = await fetch(`${backendUrl}/api/push/subscriptions`);
      if (response.ok) {
        const data = await response.json();
        if (salesforceObjectType) {
          return data.subscriptions.filter(
            sub => sub.salesforceObjectType === salesforceObjectType
          );
        }
        return data.subscriptions;
      }
    }
    
    // Option 3: Use in-memory storage (fallback, not persistent)
    if (global.subscriptions) {
      const allSubscriptions = Array.from(global.subscriptions.values());
      if (salesforceObjectType) {
        return allSubscriptions.filter(
          sub => sub.salesforceObjectType === salesforceObjectType
        );
      }
      return allSubscriptions;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

/**
 * Send push notification to a subscription
 */
async function sendNotification(subscription, payload) {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.subscription.endpoint,
        keys: {
          p256dh: subscription.subscription.keys.p256dh,
          auth: subscription.subscription.keys.auth
        }
      },
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    // If subscription is invalid, you might want to remove it
    if (error.statusCode === 410) {
      return { success: false, expired: true };
    }
    return { success: false, error: error.message };
  }
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
    console.log('📱 Push notification request received');

    // Check if VAPID keys are configured
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      console.error('❌ VAPID keys not configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'VAPID keys not configured',
          message: 'Please set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT in Netlify environment variables'
        }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const {
      salesforceObjectType, // e.g., 'Case', 'Lead', 'Opportunity'
      recordId,
      recordName,
      action, // 'created', 'updated', 'deleted'
      additionalData
    } = body;

    if (!salesforceObjectType || !recordId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'salesforceObjectType and recordId are required' }),
      };
    }

    // Get subscriptions for this object type
    const subscriptions = await getSubscriptions(salesforceObjectType);

    if (subscriptions.length === 0) {
      console.log('No subscriptions found for object type:', salesforceObjectType);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: 'No subscriptions found',
          sent: 0
        }),
      };
    }

    // Create notification payload
    // Special handling for Push_Notification__c object
    let title, bodyText;
    
    if (salesforceObjectType === 'Push_Notification__c') {
      // For Push_Notification__c, use the record's Title and Body directly
      title = additionalData?.Title || additionalData?.Name || recordName || 'Push Notification';
      bodyText = additionalData?.Body || additionalData?.Body__c || 'You have a new notification';
    } else {
      // For other objects, use standard format
      title = `New ${salesforceObjectType} ${action || 'update'}`;
      bodyText = recordName 
        ? `${salesforceObjectType} "${recordName}" has been ${action || 'updated'}`
        : `A new ${salesforceObjectType} has been ${action || 'created'}`;
    }

    // Build URL - customize based on object type
    let notificationUrl = '/';
    if (salesforceObjectType === 'Push_Notification__c') {
      notificationUrl = `/push-notification/${recordId}`;
    } else {
      notificationUrl = `/${salesforceObjectType.toLowerCase()}/${recordId}`;
    }
    
    const payload = {
      title,
      body: bodyText,
      icon: '/Assets/Company Logos/blue-logo.png',
      badge: '/Assets/Company Logos/blue-logo.png',
      tag: `${salesforceObjectType}-${recordId}`,
      url: notificationUrl,
      data: {
        salesforceObjectType,
        recordId,
        recordName,
        action,
        ...additionalData
      }
    };

    // Send notifications to all subscribers
    const results = await Promise.allSettled(
      subscriptions.map(sub => sendNotification(sub, payload))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    console.log(`📱 Push notifications sent: ${successful} successful, ${failed} failed`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        sent: successful,
        failed,
        total: subscriptions.length
      }),
    };
  } catch (error) {
    console.error('❌ Error sending push notifications:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to send push notifications',
        message: error.message
      }),
    };
  }
};

