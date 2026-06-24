/**
 * BFF proxy for Customer Feedback Survey — GET context
 *
 * Browser calls:  GET /.netlify/functions/surveyContext?token=...
 * This function:  GET https://...salesforce.com/.../context?token=...
 *                 with X-Cloudastick-Api-Key header (never exposed to browser)
 */

const SF_BASE = process.env.SALESFORCE_SURVEY_API_BASE_URL;
const API_KEY = process.env.CLOUDASTICK_SURVEY_API_KEY;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate server-side env vars
  if (!SF_BASE || !API_KEY) {
    console.error('surveyContext: Missing SALESFORCE_SURVEY_API_BASE_URL or CLOUDASTICK_SURVEY_API_KEY env vars');
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
    };
  }

  const token = event.queryStringParameters && event.queryStringParameters.token;

  if (!token) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Token is required.' }),
    };
  }

  try {
    const sfUrl = `${SF_BASE}/context?token=${encodeURIComponent(token)}`;

    const sfRes = await fetch(sfUrl, {
      method: 'GET',
      headers: {
        'X-Cloudastick-Api-Key': API_KEY,
        'Accept': 'application/json',
      },
    });

    const body = await sfRes.text();

    return {
      statusCode: sfRes.status,
      headers: CORS_HEADERS,
      body,
    };
  } catch (err) {
    console.error('surveyContext: Salesforce fetch failed:', err);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unable to reach survey service. Please try again later.' }),
    };
  }
};
