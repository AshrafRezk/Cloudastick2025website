/**
 * BFF proxy for Customer Feedback Survey — GET context
 *
 * Browser calls:  GET /.netlify/functions/surveyContext?token=...
 * This function:
 *   1. Gets a Salesforce OAuth bearer token (client credentials)
 *   2. Calls Salesforce GET .../context?token=...
 *      with BOTH: Authorization: Bearer {token}  AND  X-Cloudastick-Api-Key
 *
 * Required env vars (all already configured in Netlify):
 *   SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, SALESFORCE_TOKEN_URL
 *   SALESFORCE_SURVEY_API_BASE_URL, CLOUDASTICK_SURVEY_API_KEY
 */

const SF_BASE    = process.env.SALESFORCE_SURVEY_API_BASE_URL;
const API_KEY    = process.env.CLOUDASTICK_SURVEY_API_KEY;
const CLIENT_ID  = process.env.SALESFORCE_CLIENT_ID;
const CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
const TOKEN_URL  = process.env.SALESFORCE_TOKEN_URL;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

/** Obtain a Salesforce OAuth access token via client credentials */
async function getSalesforceToken() {
  if (!CLIENT_ID || !CLIENT_SECRET || !TOKEN_URL) {
    throw new Error('Missing Salesforce OAuth env vars (CLIENT_ID / CLIENT_SECRET / TOKEN_URL)');
  }
  const form = new URLSearchParams();
  form.append('grant_type', 'client_credentials');
  form.append('client_id', CLIENT_ID);
  form.append('client_secret', CLIENT_SECRET);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Salesforce OAuth failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.access_token;
}

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

  // Validate survey env vars
  if (!SF_BASE || !API_KEY) {
    console.error('surveyContext: Missing SALESFORCE_SURVEY_API_BASE_URL or CLOUDASTICK_SURVEY_API_KEY');
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
    // Step 1 — get Salesforce OAuth bearer token
    const accessToken = await getSalesforceToken();

    // Step 2 — call Salesforce with BOTH auth headers
    const sfUrl = `${SF_BASE}/context?token=${encodeURIComponent(token)}`;
    console.log(`surveyContext: calling ${sfUrl}`);

    const sfRes = await fetch(sfUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Cloudastick-Api-Key': API_KEY,
        'Accept': 'application/json',
      },
    });

    const body = await sfRes.text();
    console.log(`surveyContext: Salesforce responded ${sfRes.status}`);

    return {
      statusCode: sfRes.status,
      headers: CORS_HEADERS,
      body,
    };
  } catch (err) {
    console.error('surveyContext: error:', err.message);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unable to reach survey service. Please try again later.' }),
    };
  }
};
