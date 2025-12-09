/**
 * Netlify Function to create a Key Result for an OKR
 * Key Results are child OKR__c records where Parent_Objective__c points to the parent OKR
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { access_token, instance_url, okrId, name, description, target, unit, status, currentValue } =
      JSON.parse(event.body || '{}');

    if (!access_token || !instance_url || !okrId || !name) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Key Results are child OKR__c records - create a child OKR with Parent_Objective__c pointing to parent
    const body = {
      Name: name,
      Parent_Objective__c: okrId, // This makes it a key result (child OKR)
    };

    // Map optional fields (use field names from OKR__c)
    if (description) {
      body.Comments__c = description; // Use Comments__c field for description
    }

    if (status) {
      body.Status__c = status;
    }

    if (unit) {
      // Unit might not be a field on OKR__c, skip if not available
      // Could use a custom field if needed
    }

    // Note: Target and Current Value might not be standard OKR__c fields
    // If they exist as custom fields, add them here

    const url = `${instance_url}/services/data/v58.0/sobjects/OKR__c`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('❌ Failed to create Key Result (child OKR):', errorText);
      throw new Error(`Failed to create Key Result: ${resp.status} - ${errorText}`);
    }

    const data = await resp.json();
    
    if (!data.id) {
      throw new Error('Failed to create Key Result - no ID returned');
    }

    console.log('✅ Created Key Result (child OKR):', data.id);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        id: data.id,
        object: 'OKR__c', // Key Result is a child OKR__c record
      }),
    };
  } catch (error) {
    console.error('❌ Error creating Key Result:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Failed to create Key Result',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

