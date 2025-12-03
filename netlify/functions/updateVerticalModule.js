/**
 * Netlify Function to update Vertical Module fields
 * Updates Feature_list__c and Cloudastick_Edge__c fields
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
    console.log('📝 Update Vertical Module - Request received');

    const { 
      access_token, 
      instance_url, 
      moduleId,
      featureList,
      cloudastickEdge
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

    if (!moduleId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing required parameters',
          message: 'moduleId is required'
        }),
      };
    }

    // Prepare update payload
    const updatePayload = {};
    if (featureList !== undefined) {
      updatePayload.Feature_list__c = featureList;
    }
    if (cloudastickEdge !== undefined) {
      updatePayload.Cloudastick_Edge__c = cloudastickEdge;
    }

    if (Object.keys(updatePayload).length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'No fields to update',
          message: 'At least one field (featureList or cloudastickEdge) must be provided'
        }),
      };
    }

    // Update Vertical Module in Salesforce
    const updateUrl = `${instance_url}/services/data/v58.0/sobjects/Vertical_Module__c/${moduleId}`;

    console.log('📤 Updating Vertical Module...');

    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('❌ Salesforce update failed:', errorText);
      throw new Error(`Salesforce update failed: ${updateResponse.status} - ${errorText}`);
    }

    const updateResult = await updateResponse.json();

    console.log('✅ Vertical Module updated successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Vertical Module updated successfully',
        moduleId: moduleId,
      }),
    };
  } catch (error) {
    console.error('❌ Error updating Vertical Module:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Failed to update Vertical Module',
      }),
    };
  }
};

