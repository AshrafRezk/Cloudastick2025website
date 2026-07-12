const crypto = require('crypto');

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

    if (!clientId || !clientSecret || !tokenUrl) {
      throw new Error('Salesforce credentials not configured');
    }

    // Authenticate with Salesforce
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const authResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!authResponse.ok) {
      throw new Error(`Salesforce authentication failed`);
    }

    const authData = await authResponse.json();
    const { access_token, instance_url } = authData;

    // Query Contact by Email
    const escapedEmail = email.replace(/'/g, "\\'");
    const soqlQuery = `SELECT Id, Name, Email, Portal_Access__c, Portal_LMS_Access__c FROM Contact WHERE Email = '${escapedEmail}' LIMIT 1`;
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodeURIComponent(soqlQuery)}`;

    const queryResponse = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!queryResponse.ok) {
      throw new Error(`Salesforce query failed`);
    }

    const queryData = await queryResponse.json();
    const records = queryData.records || [];

    if (records.length === 0) {
      // Return 200 even if not found to prevent email enumeration
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'If an account exists, an email was sent.' }),
      };
    }

    const contact = records[0];

    // Check LMS access
    if (!contact.Portal_Access__c || !contact.Portal_LMS_Access__c) {
      // Again, pretend it succeeded to prevent snooping
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'If an account exists, an email was sent.' }),
      };
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString('hex');
    // Set Expiration (48 hours from now)
    const expires = new Date();
    expires.setHours(expires.getHours() + 48);

    // Update Contact with Token
    // We update Password_Reset_Token__c and Password_Reset_Expires__c
    const updateUrl = `${instance_url}/services/data/v58.0/sobjects/Contact/${contact.Id}`;
    const updateBody = {
      Password_Reset_Token__c: token,
      Password_Reset_Expires__c: expires.toISOString()
    };

    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateBody),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('Failed to update contact with reset token:', errorText);
      throw new Error(`Failed to update Salesforce`);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'If an account exists, an email was sent.' }),
    };

  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
