/**
 * Netlify Function to retrieve logged company names
 * Returns all leads or filtered by date
 */

const { getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  // Allow both GET and POST requests
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed. Use GET or POST.' }),
    };
  }

  try {
    // Parse parameters from body (POST) or query string (GET)
    let params = {};
    if (event.httpMethod === 'POST') {
      params = JSON.parse(event.body || '{}');
    } else {
      // GET request - parse from query string
      params = {
        date: event.queryStringParameters?.date,
        limit: event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit) : 100,
      };
    }
    
    const { date, limit = 100 } = params;

    // Initialize store with proper error handling
    let store;
    try {
      // Try automatic configuration first (with context)
      store = getStore({
        name: 'company-leads',
        context,
      });
    } catch (storeError) {
      console.error('❌ Failed to initialize Netlify Blobs store with context:', storeError);
      
      // Try manual configuration with environment variables
      try {
        const siteID = process.env.NETLIFY_SITE_ID || context?.site?.id;
        const token = process.env.NETLIFY_AUTH_TOKEN || context?.account?.token;
        
        if (siteID && token) {
          console.log('🔄 Trying manual Blobs configuration with siteID and token');
          store = getStore({
            name: 'company-leads',
            siteID,
            token,
          });
        } else {
          throw new Error('Missing siteID or token for manual configuration');
        }
      } catch (manualError) {
        console.error('❌ Manual configuration also failed:', manualError);
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Failed to initialize storage',
            message: storeError.message,
            hint: 'Netlify Blobs is not configured. Please enable it in your Netlify site settings or set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN environment variables.',
            details: {
              automaticConfigFailed: storeError.message,
              manualConfigFailed: manualError.message,
              hasSiteID: !!process.env.NETLIFY_SITE_ID,
              hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
            },
          }),
        };
      }
    }

    const allLeads = [];

    // If date is specified, get daily log
    if (date) {
      const dailyKey = `daily-${date}`;
      const dailyLog = await store.get(dailyKey, { type: 'json' }).catch(() => null);
      
      if (dailyLog && dailyLog.entries) {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: true,
            date,
            count: dailyLog.entries.length,
            leads: dailyLog.entries.slice(0, limit),
          }),
        };
      }
    }

    // Otherwise, get all individual leads
    let count = 0;
    try {
      for await (const blob of store.list({ prefix: 'lead-' })) {
        if (count >= limit) break;
        
        try {
          const lead = await store.get(blob.key, { type: 'json' });
          if (lead) {
            allLeads.push(lead);
            count++;
          }
        } catch (e) {
          // Skip invalid entries
          console.warn(`⚠️ Skipping invalid lead entry: ${blob.key}`, e.message);
        }
      }
    } catch (listError) {
      console.error('❌ Error listing leads from store:', listError);
      // If listing fails, try to get daily logs as fallback
      if (!date) {
        // Try to get today's date as fallback
        const today = new Date().toISOString().split('T')[0];
        const dailyKey = `daily-${today}`;
        const dailyLog = await store.get(dailyKey, { type: 'json' }).catch(() => null);
        
        if (dailyLog && dailyLog.entries) {
          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              success: true,
              count: dailyLog.entries.length,
              leads: dailyLog.entries.slice(0, limit),
              note: 'Returned today\'s leads due to listing error',
            }),
          };
        }
      }
      
      // If we can't get any data, return empty result
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          count: 0,
          leads: [],
          note: 'No leads found or store access error',
        }),
      };
    }

    // Sort by timestamp (newest first)
    allLeads.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        count: allLeads.length,
        leads: allLeads,
      }),
    };

  } catch (error) {
    console.error('❌ Error retrieving company leads:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to retrieve company leads',
        message: error.message,
      }),
    };
  }
};

