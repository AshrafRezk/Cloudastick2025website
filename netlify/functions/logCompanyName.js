/**
 * Netlify Function to log company names from lead capture forms
 * Stores submissions in Neon database for analytics
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
    const { companyName, industry, source = 'lead-capture-modal' } = JSON.parse(event.body || '{}');

    if (!companyName || !industry) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Company name and industry are required' }),
      };
    }

    // Get user info from headers
    const userAgent = event.headers['user-agent'] || 'Unknown';
    const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown';
    const referer = event.headers['referer'] || event.headers['referrer'] || 'Unknown';
    
    // Create log entry
    const logEntry = {
      companyName: companyName.trim(),
      industry: industry.trim(),
      source,
      timestamp: new Date().toISOString(),
      userAgent,
      ip: ip.split(',')[0].trim(), // Get first IP if multiple
      referer,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD for easy querying
    };

    // Store in Neon database
    const db = getDb();
    
    await db`
      INSERT INTO company_leads (company_name, industry, source, user_agent, ip_address, referer, created_at)
      VALUES (${logEntry.companyName}, ${logEntry.industry}, ${logEntry.source}, ${logEntry.userAgent}, ${logEntry.ip}, ${logEntry.referer}, ${logEntry.timestamp})
    `;

    console.log('✅ Logged company lead:', {
      companyName: logEntry.companyName,
      industry: logEntry.industry,
      timestamp: logEntry.timestamp,
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Company name logged successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error logging company name:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to log company name',
        message: error.message,
      }),
    };
  }
};

