/**
 * Netlify Function to log company names from lead capture forms
 * Stores submissions in Netlify Blobs for analytics
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

    // Store in Netlify Blobs
    const store = getStore({
      name: 'company-leads',
      context,
    });

    // Create unique key with timestamp
    const logKey = `lead-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    await store.setJSON(logKey, logEntry);

    // Also append to a daily log file for easy viewing
    const dailyKey = `daily-${logEntry.date}`;
    const existingDailyLog = await store.get(dailyKey, { type: 'json' }).catch(() => null);
    const dailyLog = existingDailyLog || { date: logEntry.date, entries: [] };
    dailyLog.entries.push({
      companyName: logEntry.companyName,
      industry: logEntry.industry,
      timestamp: logEntry.timestamp,
    });
    await store.setJSON(dailyKey, dailyLog);

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

