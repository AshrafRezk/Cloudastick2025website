/**
 * Netlify Function to Unsubscribe from Push Notifications
 * Removes push notification subscriptions
 */

/**
 * Remove subscription from Netlify Blobs or in-memory storage
 */
async function removeSubscription(subscriptionId) {
  try {
    // Try Netlify Blobs first
    if (typeof require !== 'undefined') {
      try {
        const { getStore } = require('@netlify/blobs');
        const store = getStore('push-subscriptions');
        await store.delete(subscriptionId);
        console.log('📱 Subscription removed from Netlify Blobs');
        return true;
      } catch (blobError) {
        console.log('Netlify Blobs not available, using in-memory storage');
      }
    }
    
    // Fallback to in-memory storage
    if (global.subscriptions) {
      global.subscriptions.delete(subscriptionId);
    }
    return true;
  } catch (error) {
    console.error('Error removing subscription:', error);
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
    const { subscription } = JSON.parse(event.body || '{}');

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

    // Remove subscription
    const subscriptionId = subscription.endpoint;
    await removeSubscription(subscriptionId);

    console.log('📱 Push subscription removed:', {
      subscriptionId
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Subscription removed successfully'
      }),
    };
  } catch (error) {
    console.error('❌ Error removing subscription:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to remove subscription' }),
    };
  }
};

