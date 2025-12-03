/**
 * Netlify Function to delete a Vertical Module
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow DELETE requests
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🗑️ Delete Vertical Module - Request received');

    const { 
      access_token, 
      instance_url, 
      moduleId
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

    // Delete Vertical Module in Salesforce
    const deleteUrl = `${instance_url}/services/data/v58.0/sobjects/Vertical_Module__c/${moduleId}`;

    console.log('📤 Deleting Vertical Module...');

    const deleteResponse = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error('❌ Salesforce delete failed:', errorText);
      throw new Error(`Salesforce delete failed: ${deleteResponse.status} - ${errorText}`);
    }

    console.log('✅ Vertical Module deleted successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Vertical Module deleted successfully',
      }),
    };
  } catch (error) {
    console.error('❌ Error deleting Vertical Module:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Failed to delete Vertical Module',
      }),
    };
  }
};

