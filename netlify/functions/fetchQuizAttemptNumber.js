/**
 * Netlify Function to fetch current quiz attempt number for a learner and material
 * Returns the highest Attempt_Number__c from completed Learning_Material_Instance__c records
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
    console.log('📊 Fetch Quiz Attempt Number - Request received');

    const { access_token, instance_url, contactId, learningMaterialId } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url || !contactId || !learningMaterialId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Query for the highest attempt number from completed instances
    const escapedContactId = contactId.replace(/'/g, "\\'");
    const escapedMaterialId = learningMaterialId.replace(/'/g, "\\'");
    
    const soqlQuery = `SELECT Attempt_Number__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c = '${escapedMaterialId}' AND Attempt_Number__c != null AND Status__c = 'Completed' ORDER BY Attempt_Number__c DESC LIMIT 1`;
    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Salesforce for quiz attempt number...');

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Salesforce query error:', errorText);
      throw new Error(`Salesforce query failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const records = data.records || [];
    
    let maxAttemptNumber = 0;
    if (records.length > 0 && records[0].Attempt_Number__c) {
      maxAttemptNumber = records[0].Attempt_Number__c;
      console.log(`✅ Found max attempt number: ${maxAttemptNumber}`);
    } else {
      console.log(`📊 No completed attempts found, returning 0 (next attempt will be 1)`);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        maxAttemptNumber,
        nextAttemptNumber: maxAttemptNumber + 1
      }),
    };

  } catch (error) {
    console.error('❌ Fetch Quiz Attempt Number Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch quiz attempt number',
        message: errorMessage
      }),
    };
  }
};

