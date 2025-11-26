/**
 * Netlify Function to delete Team build and cascade delete Team build member records in Salesforce
 * Deletes all Team_build_member__c records first, then deletes the Team_build__c record
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body (DELETE can have body in some cases, or use query params)
    let requestData = {};
    if (event.body) {
      try {
        requestData = JSON.parse(event.body);
      } catch (parseError) {
        // If body parsing fails, try query params
        requestData = event.queryStringParameters || {};
      }
    } else {
      requestData = event.queryStringParameters || {};
    }

    const { 
      access_token, 
      instance_url, 
      teamBuildId 
    } = requestData;

    // Validate required fields
    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing access_token or instance_url' }),
      };
    }

    if (!teamBuildId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'teamBuildId is required' }),
      };
    }

    console.log('🗑️ Deleting Team build from Salesforce...');
    console.log('Team build ID:', teamBuildId);

    // First, delete all Team build member records
    const membersSoql = `SELECT Id FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
    const membersEncodedQuery = encodeURIComponent(membersSoql);
    const membersQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${membersEncodedQuery}`;

    const membersQueryOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    let memberIds = [];
    try {
      const membersQueryResponse = await fetch(membersQueryUrl, membersQueryOptions);
      if (membersQueryResponse.ok) {
        const membersResult = await membersQueryResponse.json();
        memberIds = (membersResult.records || []).map(m => m.Id);
      }
    } catch (fetchError) {
      console.warn('⚠️ Error fetching members for deletion:', fetchError);
    }

    // Delete members if any exist
    if (memberIds.length > 0) {
      console.log(`Deleting ${memberIds.length} team member record(s)...`);
      
      // Use composite API for bulk delete
      const compositeUrl = `${instance_url}/services/data/v58.0/composite/sobjects`;
      const deleteRecords = memberIds.map(id => ({
        method: 'DELETE',
        url: `/services/data/v58.0/sobjects/Team_build_member__c/${id}`,
      }));

      const deleteOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allOrNone: false,
          compositeRequest: deleteRecords,
        }),
      };

      try {
        const deleteResponse = await fetch(compositeUrl, deleteOptions);
        if (deleteResponse.ok) {
          console.log(`✅ Deleted ${memberIds.length} team member record(s)`);
        } else {
          // Fallback: delete individually
          console.log('⚠️ Composite delete failed, trying individual deletes...');
          for (const memberId of memberIds) {
            try {
              const deleteUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c/${memberId}`;
              await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                },
              });
            } catch (e) {
              console.warn(`⚠️ Failed to delete member ${memberId}:`, e);
            }
          }
        }
      } catch (deleteError) {
        console.warn('⚠️ Error deleting members:', deleteError);
        // Continue to delete Team build anyway
      }
    }

    // Delete Team build record
    const deleteUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build__c/${teamBuildId}`;
    const deleteOptions = {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    let deleteResponse;
    try {
      deleteResponse = await fetch(deleteUrl, deleteOptions);
    } catch (fetchError) {
      console.error('❌ Network error deleting Team build:', fetchError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Network error',
          message: fetchError.message || 'Failed to delete Team build record',
        }),
      };
    }

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      let errorMessage = 'Failed to delete Team build record';
      try {
        const errorData = JSON.parse(errorText);
        if (Array.isArray(errorData) && errorData[0] && errorData[0].message) {
          errorMessage = errorData[0].message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      console.error('❌ Failed to delete Team build:', errorMessage);
      return {
        statusCode: deleteResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to delete Team build',
          message: errorMessage,
        }),
      };
    }

    console.log('✅ Team build deleted successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        teamBuildId,
        message: 'Team build and associated members deleted successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error deleting Team build:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to delete Team build',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

