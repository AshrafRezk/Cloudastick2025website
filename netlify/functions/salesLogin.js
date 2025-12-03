/**
 * Netlify Function for Sales Portal Login
 * Authenticates sales users by validating Portal_Username__c and Portal_Password__c
 * Checks Portal_Sales_Access__c field for sales access
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
    console.log('🔐 Sales Login - Authentication request received');

    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing credentials',
          message: 'Username and password are required'
        }),
      };
    }

    // First, authenticate with Salesforce to get access token
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

    if (!clientId || !clientSecret || !tokenUrl) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Salesforce credentials not configured'
        }),
      };
    }

    // Get Salesforce access token
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const authResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Salesforce authentication failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const { access_token, instance_url } = authData;

    // Query Contact by Portal_Username__c - include Portal_Sales_Access__c
    const escapedUsername = username.replace(/'/g, "\\'");
    const soqlQuery = `SELECT Id, Name, Email, Portal_Username__c, Portal_Password__c, Portal_Access__c, Portal_Sales_Access__c, LinkedInURL__c, TrailheadProfileURL__c, NumberofCertifications__c, Certifications_List__c FROM Contact WHERE Portal_Username__c = '${escapedUsername}' LIMIT 1`;
    
    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Contact by username...');

    const queryResponse = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text();
      throw new Error(`Salesforce query failed: ${queryResponse.status} - ${errorText}`);
    }

    const queryData = await queryResponse.json();
    const records = queryData.records || [];

    if (records.length === 0) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          message: 'Username not found'
        }),
      };
    }

    const contact = records[0];

    // Check if portal is active
    if (!contact.Portal_Access__c) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Portal access disabled',
          message: 'Your portal access has been disabled. Please contact support.'
        }),
      };
    }

    // Check if Sales access is enabled
    if (!contact.Portal_Sales_Access__c) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Sales access not granted',
          message: 'You do not have access to the Sales Portal. Please contact your administrator.'
        }),
      };
    }

    // Compare password (plain text as specified)
    if (contact.Portal_Password__c !== password) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          message: 'Incorrect password'
        }),
      };
    }

    // Return contact data (excluding password)
    const contactData = {
      id: contact.Id,
      name: contact.Name,
      email: contact.Email,
      linkedInUrl: contact.LinkedInURL__c || null,
      trailheadUrl: contact.TrailheadProfileURL__c || null,
      numberOfCertifications: contact.NumberofCertifications__c || 0,
      certificationsList: contact.Certifications_List__c || null,
    };

    console.log('✅ Sales login successful:', contactData.name);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        contact: contactData
      }),
    };

  } catch (error) {
    console.error('❌ Sales Login Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Login failed',
        message: errorMessage
      }),
    };
  }
};

