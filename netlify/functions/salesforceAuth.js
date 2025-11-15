/**
 * Netlify Function for Salesforce OAuth Authentication
 * Uses client credentials flow for server-to-server authentication
 * 
 * Environment variables required:
 * - SALESFORCE_CLIENT_ID
 * - SALESFORCE_CLIENT_SECRET
 * - SALESFORCE_TOKEN_URL
 */

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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🔐 Salesforce Auth - Authentication request received');
    console.log('Environment check:', {
      hasClientId: !!process.env.SALESFORCE_CLIENT_ID,
      hasClientSecret: !!process.env.SALESFORCE_CLIENT_SECRET,
      clientIdLength: process.env.SALESFORCE_CLIENT_ID?.length || 0,
      clientSecretLength: process.env.SALESFORCE_CLIENT_SECRET?.length || 0
    });

    // Salesforce OAuth credentials from environment variables
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

    if (!clientId || !clientSecret || !tokenUrl) {
      console.error('❌ Missing Salesforce credentials');
      console.error('Client ID present:', !!clientId);
      console.error('Client Secret present:', !!clientSecret);
      console.error('Token URL present:', !!tokenUrl);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Salesforce credentials not configured',
          message: 'Please set SALESFORCE_CLIENT_ID, SALESFORCE_CLIENT_SECRET, and SALESFORCE_TOKEN_URL environment variables in Netlify.'
        }),
      };
    }

    // Prepare form data for OAuth token request
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    console.log('📤 Sending OAuth request to Salesforce...');
    console.log('Token URL:', tokenUrl);
    console.log('Form data keys:', ['grant_type', 'client_id', 'client_secret']);

    let response;
    try {
      response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      throw new Error(`Network error connecting to Salesforce: ${fetchError.message}`);
    }

    console.log('📥 Salesforce Response Status:', response.status);
    console.log('📥 Salesforce Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Salesforce OAuth Error Response:', errorText);
      console.error('❌ Status Code:', response.status);
      throw new Error(`Salesforce authentication failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Salesforce authentication successful');

    // Return the access token and other relevant data
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: data.access_token,
        instance_url: data.instance_url,
        token_type: data.token_type,
        issued_at: data.issued_at,
        // Calculate expiration time (typically 2 hours, but use issued_at + expires_in if provided)
        expires_at: data.issued_at ? parseInt(data.issued_at) + (data.expires_in || 7200) * 1000 : Date.now() + 7200000,
      }),
    };

  } catch (error) {
    console.error('❌ Salesforce Auth Function Error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Full Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to authenticate with Salesforce',
        message: errorMessage
      }),
    };
  }
};

