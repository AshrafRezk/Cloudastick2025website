/**
 * Netlify Function to update Team build and sync Team build member records in Salesforce
 * Updates the Team_build__c record and creates/deletes Team_build_member__c records as needed
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow PUT requests
  if (event.httpMethod !== 'PUT') {
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
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid request body. Expected JSON.' }),
      };
    }

    const { 
      access_token, 
      instance_url, 
      teamBuildId,
      accountId,
      opportunityId,
      projectId,
      scope, 
      deliverables, 
      teamMembers 
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

    // Validate teamMembers is an array if provided
    if (teamMembers !== undefined && !Array.isArray(teamMembers)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'teamMembers must be an array' }),
      };
    }

    console.log('🔄 Updating Team build in Salesforce...');
    console.log('Team build ID:', teamBuildId);
    console.log('Team members:', teamMembers?.length || 0);

    // Prepare update fields for Team build
    const updateFields = {};
    if (scope !== undefined) {
      updateFields.Scope__c = scope;
    }
    if (deliverables !== undefined) {
      updateFields.Deliverables__c = deliverables;
    }
    if (accountId !== undefined) {
      updateFields.Account__c = accountId || null;
    }
    if (opportunityId !== undefined) {
      updateFields.Opportunity__c = opportunityId || null;
    }
    if (projectId !== undefined) {
      updateFields.Project__c = projectId || null;
    }

    // Update Team build record if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      const updateUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build__c/${teamBuildId}`;
      const updateOptions = {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateFields),
      };

      let updateResponse;
      try {
        updateResponse = await fetch(updateUrl, updateOptions);
      } catch (fetchError) {
        console.error('❌ Network error updating Team build:', fetchError);
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Network error',
            message: fetchError.message || 'Failed to update Team build record',
          }),
        };
      }

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        let errorMessage = 'Failed to update Team build record';
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

        console.error('❌ Failed to update Team build:', errorMessage);
        return {
          statusCode: updateResponse.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Failed to update Team build',
            message: errorMessage,
          }),
        };
      }

      console.log('✅ Team build updated');
    }

    // Sync team members if provided
    if (teamMembers !== undefined) {
      // First, get existing members
      const membersSoql = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
      const membersEncodedQuery = encodeURIComponent(membersSoql);
      const membersQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${membersEncodedQuery}`;

      const membersQueryOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      };

      let existingMembers = [];
      try {
        const membersQueryResponse = await fetch(membersQueryUrl, membersQueryOptions);
        if (membersQueryResponse.ok) {
          const membersResult = await membersQueryResponse.json();
          existingMembers = membersResult.records || [];
        }
      } catch (fetchError) {
        console.warn('⚠️ Error fetching existing members:', fetchError);
      }

      // Determine which members to add and which to delete
      const existingMemberNames = new Set(existingMembers.map(m => m.Name));
      const newMemberNames = new Set(teamMembers);
      
      const membersToAdd = teamMembers.filter(name => !existingMemberNames.has(name));
      const membersToDelete = existingMembers.filter(m => !newMemberNames.has(m.Name));

      // Delete removed members
      if (membersToDelete.length > 0) {
        const deleteIds = membersToDelete.map(m => m.Id);
        // Use composite API for bulk delete
        const compositeUrl = `${instance_url}/services/data/v58.0/composite/sobjects`;
        const deleteRecords = deleteIds.map(id => ({
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
            console.log(`✅ Deleted ${membersToDelete.length} member(s)`);
          }
        } catch (deleteError) {
          console.warn('⚠️ Error deleting members:', deleteError);
          // Continue - try individual deletes as fallback
          for (const member of membersToDelete) {
            try {
              const deleteUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c/${member.Id}`;
              await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                },
              });
            } catch (e) {
              console.warn(`⚠️ Failed to delete member ${member.Name}:`, e);
            }
          }
        }
      }

      // Add new members
      if (membersToAdd.length > 0) {
        const compositeUrl = `${instance_url}/services/data/v58.0/composite/sobjects`;
        const compositeRecords = membersToAdd.map(memberName => ({
          attributes: { type: 'Team_build_member__c' },
          Team_build__c: teamBuildId,
          Name: memberName,
        }));

        const compositeOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            allOrNone: false,
            records: compositeRecords,
          }),
        };

        try {
          const compositeResponse = await fetch(compositeUrl, compositeOptions);
          if (compositeResponse.ok) {
            const compositeResult = await compositeResponse.json();
            const createdCount = compositeResult.compositeResponse?.filter(
              item => item.httpStatusCode === 201
            ).length || 0;
            console.log(`✅ Created ${createdCount} new member(s)`);
          }
        } catch (compositeError) {
          console.warn('⚠️ Error creating members via composite API, trying individually...');
          // Fallback: create individually
          for (const memberName of membersToAdd) {
            try {
              const memberRecord = {
                Team_build__c: teamBuildId,
                Name: memberName,
              };

              const memberUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c`;
              await fetch(memberUrl, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberRecord),
              });
            } catch (e) {
              console.warn(`⚠️ Failed to create member ${memberName}:`, e);
            }
          }
        }
      }

      if (membersToAdd.length === 0 && membersToDelete.length === 0) {
        console.log('✅ No member changes needed');
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        teamBuildId,
        message: 'Team build updated successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error updating Team build:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to update Team build',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

