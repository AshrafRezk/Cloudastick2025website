/**
 * Netlify Function to Subscribe to Push Notifications
 * Stores push notification subscriptions
 * 
 * In production, you should use a database (e.g., Netlify Blobs, MongoDB, etc.)
 */

/**
 * Store subscription using Netlify Blobs or in-memory fallback
 */
async function saveSubscription(subscriptionId, subscriptionData) {
  try {
    // Try Netlify Blobs first (persistent storage)
    if (typeof require !== 'undefined') {
      try {
        const { getStore } = require('@netlify/blobs');
        const store = getStore('push-subscriptions');
        await store.set(subscriptionId, subscriptionData);
        console.log('📱 Subscription saved to Netlify Blobs');
        return true;
      } catch (blobError) {
        console.log('Netlify Blobs not available, using in-memory storage');
      }
    }
    
    // Fallback to in-memory storage (not persistent)
    if (!global.subscriptions) {
      global.subscriptions = new Map();
    }
    global.subscriptions.set(subscriptionId, subscriptionData);
    return true;
  } catch (error) {
    console.error('Error saving subscription:', error);
    return false;
  }
}

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { subscription, userId, salesforceObjectType } = JSON.parse(event.body || '{}');

    if (!subscription || !subscription.endpoint) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid subscription data' }),
      };
    }

    // Store subscription
    const subscriptionId = subscription.endpoint;
    const subscriptionData = {
      subscription,
      userId,
      salesforceObjectType,
      createdAt: new Date().toISOString()
    };

    await saveSubscription(subscriptionId, subscriptionData);

    console.log('📱 Push subscription saved:', {
      subscriptionId,
      userId,
      salesforceObjectType
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Subscription saved successfully'
      }),
    };
  } catch (error) {
    console.error('❌ Error saving subscription:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to save subscription' }),
    };
  }
};

