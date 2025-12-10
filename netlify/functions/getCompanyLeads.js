/**
 * Netlify Function to retrieve logged company names
 * Returns all leads or filtered by date from Neon database
 */

const { getDb } = require('./db');

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

    // Get database connection
    const db = getDb();

    let leads;
    
    // If date is specified, filter by date
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      leads = await db`
        SELECT 
          id,
          company_name as "companyName",
          industry,
          source,
          user_agent as "userAgent",
          ip_address as "ip",
          referer,
          created_at as "timestamp",
          DATE(created_at) as "date"
        FROM company_leads
        WHERE created_at >= ${startDate.toISOString()} AND created_at <= ${endDate.toISOString()}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    } else {
      // Get all leads
      leads = await db`
        SELECT 
          id,
          company_name as "companyName",
          industry,
          source,
          user_agent as "userAgent",
          ip_address as "ip",
          referer,
          created_at as "timestamp",
          DATE(created_at) as "date"
        FROM company_leads
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        count: leads.length,
        leads: leads,
        ...(date && { date }),
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

