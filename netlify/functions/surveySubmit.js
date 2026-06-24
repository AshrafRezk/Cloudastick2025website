/**
 * BFF proxy for Customer Feedback Survey — POST submit
 *
 * Browser calls:  POST /.netlify/functions/surveySubmit  { token, ratings... }
 * This function:  POST https://...salesforce.com/.../submit
 *                 with X-Cloudastick-Api-Key header (never exposed to browser)
 */

const SF_BASE = process.env.SALESFORCE_SURVEY_API_BASE_URL;
const API_KEY = process.env.CLOUDASTICK_SURVEY_API_KEY;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Validate server-side env vars
  if (!SF_BASE || !API_KEY) {
    console.error('surveySubmit: Missing SALESFORCE_SURVEY_API_BASE_URL or CLOUDASTICK_SURVEY_API_KEY env vars');
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  // Validate JSON before forwarding
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (parseErr) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  // Basic front-end guard: ensure token is present
  if (!payload.token) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Token is required.' }),
    };
  }

  try {
    const sfRes = await fetch(`${SF_BASE}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cloudastick-Api-Key': API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = await sfRes.text();

    return {
      statusCode: sfRes.status,
      headers: CORS_HEADERS,
      body,
    };
  } catch (err) {
    console.error('surveySubmit: Salesforce fetch failed:', err);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unable to reach survey service. Please try again later.' }),
    };
  }
};
