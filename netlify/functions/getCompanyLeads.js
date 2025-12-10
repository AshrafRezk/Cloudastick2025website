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
    const { date, limit = 100 } = JSON.parse(event.body || '{}');

    const store = getStore({
      name: 'company-leads',
      context,
    });

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
      }
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

