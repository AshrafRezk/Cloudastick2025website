/**
 * Netlify Function to create a new Vertical Module
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
    console.log('➕ Create Vertical Module - Request received');

    const { 
      access_token, 
      instance_url, 
      verticalId,
      name,
      featureList,
      cloudastickEdge,
      priority
    } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          message: 'access_token and instance_url are required'
        }),
      };
    }

    if (!verticalId || !name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          message: 'verticalId and name are required'
        }),
      };
    }

    // Prepare create payload
    const createPayload = {
      Name: name,
      Vertical__c: verticalId,
      Feature_list__c: featureList || '',
      Cloudastick_Edge__c: cloudastickEdge || '',
    };

    if (priority !== undefined && priority !== null) {
      createPayload.Priority__c = priority;
    }

    // Create Vertical Module in Salesforce
    const createUrl = `${instance_url}/services/data/v58.0/sobjects/Vertical_Module__c`;

    console.log('📤 Creating Vertical Module...');

    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('❌ Salesforce create failed:', errorText);
      throw new Error(`Salesforce create failed: ${createResponse.status} - ${errorText}`);
    }

    const createResult = await createResponse.json();

    console.log('✅ Vertical Module created successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Vertical Module created successfully',
        moduleId: createResult.id,
      }),
    };
  } catch (error) {
    console.error('❌ Error creating Vertical Module:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Failed to create Vertical Module',
      }),
    };
  }
};

