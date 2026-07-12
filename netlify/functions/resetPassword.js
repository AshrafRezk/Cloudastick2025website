exports.handler = async (event, context) => {
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
    const { token, newPassword } = JSON.parse(event.body || '{}');

    if (!token || !newPassword) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Token and new password are required' }),
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

    // Query Contact by Token
    const escapedToken = token.replace(/'/g, "\\'");
    const soqlQuery = `SELECT Id, Password_Reset_Expires__c FROM Contact WHERE Password_Reset_Token__c = '${escapedToken}' LIMIT 1`;
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
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'Invalid or expired token.' }),
      };
    }

    const contact = records[0];

    // Check Expiration
    if (!contact.Password_Reset_Expires__c || new Date(contact.Password_Reset_Expires__c) < new Date()) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'This password reset link has expired. Please request a new one.' }),
      };
    }

    // Update Contact with New Password and clear Token
    const updateUrl = `${instance_url}/services/data/v58.0/sobjects/Contact/${contact.Id}`;
    const updateBody = {
      Portal_Password__c: newPassword,
      Password_Reset_Token__c: null,
      Password_Reset_Expires__c: null
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
      throw new Error(`Failed to update Salesforce`);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Password updated successfully' }),
    };

  } catch (error) {
    console.error('Password reset error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
