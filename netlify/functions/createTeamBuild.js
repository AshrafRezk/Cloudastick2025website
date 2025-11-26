/**
 * Netlify Function to create Team build and Team build member records in Salesforce
 * Creates a Team_build__c record and associated Team_build_member__c records
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight
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

    // At least one lookup field must be provided
    if (!accountId && !opportunityId && !projectId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'At least one lookup field (accountId, opportunityId, or projectId) is required' }),
      };
    }

    // Validate teamMembers is an array
    if (!Array.isArray(teamMembers)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'teamMembers must be an array' }),
      };
    }

    console.log('📝 Creating Team build in Salesforce...');
    console.log('Lookups:', { accountId, opportunityId, projectId });
    console.log('Team members:', teamMembers.length);

    // Prepare Team build record
    const teamBuildRecord = {
      Scope__c: scope || '',
      Deliverables__c: deliverables || '',
    };

    // Add lookup fields (only non-null values)
    if (accountId) {
      teamBuildRecord.Account__c = accountId;
    }
    if (opportunityId) {
      teamBuildRecord.Opportunity__c = opportunityId;
    }
    if (projectId) {
      teamBuildRecord.Project__c = projectId;
    }

    // Create Team build record
    const createUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build__c`;
    const createOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamBuildRecord),
    };

    let createResponse;
    try {
      createResponse = await fetch(createUrl, createOptions);
    } catch (fetchError) {
      console.error('❌ Network error creating Team build:', fetchError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Network error',
          message: fetchError.message || 'Failed to create Team build record',
        }),
      };
    }

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      let errorMessage = 'Failed to create Team build record';
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

      console.error('❌ Failed to create Team build:', errorMessage);
      return {
        statusCode: createResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to create Team build',
          message: errorMessage,
        }),
      };
    }

    const createResult = await createResponse.json();
    const teamBuildId = createResult.id;

    if (!teamBuildId) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to create Team build',
          message: 'No ID returned from Salesforce',
        }),
      };
    }

    console.log('✅ Team build created:', teamBuildId);

    // Create Team build member records
    const memberIds = [];
    const memberErrors = [];

    if (teamMembers.length > 0) {
      // Use composite API to create multiple records in one call
      const compositeUrl = `${instance_url}/services/data/v58.0/composite/sobjects`;
      const compositeRecords = teamMembers.map((memberName, index) => ({
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
          allOrNone: false, // Continue even if some fail
          records: compositeRecords,
        }),
      };

      let compositeSucceeded = false;
      
      try {
        const compositeResponse = await fetch(compositeUrl, compositeOptions);
        
        if (!compositeResponse.ok) {
          // Composite API failed, will fallback to individual creation
          console.log(`⚠️ Composite API failed with status ${compositeResponse.status}, will create members individually...`);
          throw new Error(`Composite API returned ${compositeResponse.status}`);
        }

        const compositeResult = await compositeResponse.json();
        console.log('Composite API response structure:', Object.keys(compositeResult));

        // Check if we have compositeResponse array (standard Salesforce Composite API response)
        if (compositeResult.compositeResponse && Array.isArray(compositeResult.compositeResponse)) {
          let successCount = 0;
          compositeResult.compositeResponse.forEach((item, index) => {
            if (item.httpStatusCode === 201 && item.body && item.body.id) {
              memberIds.push(item.body.id);
              successCount++;
            } else {
              const memberName = teamMembers[index];
              const errorMsg = item.body && Array.isArray(item.body) && item.body[0] ? item.body[0].message : (item.body?.message || 'Unknown error');
              memberErrors.push({ memberName, error: errorMsg });
              console.error(`❌ Failed to create member ${memberName}:`, errorMsg);
            }
          });
          console.log(`✅ Composite API created ${successCount} of ${teamMembers.length} member(s)`);
          compositeSucceeded = true;
        } 
        // Check if we have records array (alternative response format - shouldn't happen with composite/sobjects)
        else if (compositeResult.records && Array.isArray(compositeResult.records)) {
          compositeResult.records.forEach((record, index) => {
            if (record.id) {
              memberIds.push(record.id);
            } else {
              const memberName = teamMembers[index];
              memberErrors.push({ memberName, error: 'No ID returned' });
            }
          });
          console.log(`✅ Composite API created ${memberIds.length} member(s) via records format`);
          compositeSucceeded = true;
        }
        // If composite API returned OK but we can't parse it, verify by querying existing members
        else if (compositeResponse.ok) {
          console.warn('⚠️ Composite API returned OK but unexpected response format. Verifying by querying existing members...');
          // Query existing members to see if they were actually created
          const verifySoql = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
          const verifyEncoded = encodeURIComponent(verifySoql);
          const verifyUrl = `${instance_url}/services/data/v58.0/query/?q=${verifyEncoded}`;
          
          try {
            const verifyResponse = await fetch(verifyUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (verifyResponse.ok) {
              const verifyResult = await verifyResponse.json();
              const existingMembers = verifyResult.records || [];
              console.log(`Found ${existingMembers.length} existing members after composite API call`);
              
              if (existingMembers.length >= teamMembers.length) {
                // Members were created, just add their IDs
                existingMembers.forEach(m => memberIds.push(m.Id));
                compositeSucceeded = true;
                console.log('✅ Verified: Composite API succeeded, members were created');
              } else {
                // Not all members were created, need to create missing ones individually
                const existingNames = new Set(existingMembers.map(m => m.Name));
                const missingMembers = teamMembers.filter(name => !existingNames.has(name));
                console.log(`⚠️ Only ${existingMembers.length} of ${teamMembers.length} members created. Missing: ${missingMembers.join(', ')}`);
                // Will fall through to individual creation for missing members
                existingMembers.forEach(m => memberIds.push(m.Id));
              }
            }
          } catch (verifyError) {
            console.error('Error verifying members:', verifyError);
            // Can't verify, assume composite failed
          }
        }
      } catch (compositeError) {
        console.error('❌ Composite API error:', compositeError.message);
      }

      // Only create individually if composite API didn't succeed or some members are missing
      if (!compositeSucceeded || memberIds.length < teamMembers.length) {
        const existingNames = memberIds.length > 0 ? new Set() : new Set(); // We don't have names, only IDs
        // Query to get existing member names to avoid duplicates
        const checkSoql = `SELECT Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
        const checkEncoded = encodeURIComponent(checkSoql);
        const checkUrl = `${instance_url}/services/data/v58.0/query/?q=${checkEncoded}`;
        
        let existingMemberNames = new Set();
        try {
          const checkResponse = await fetch(checkUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (checkResponse.ok) {
            const checkResult = await checkResponse.json();
            existingMemberNames = new Set((checkResult.records || []).map((m: any) => m.Name));
            console.log(`Found ${existingMemberNames.size} existing members to avoid duplicates`);
          }
        } catch (checkError) {
          console.warn('Could not check existing members:', checkError);
        }
        
        // Only create members that don't already exist
        const membersToCreate = teamMembers.filter(name => !existingMemberNames.has(name));
        
        if (membersToCreate.length > 0) {
          console.log(`Creating ${membersToCreate.length} missing member(s) individually...`);
          for (const memberName of membersToCreate) {
            try {
              const memberRecord = {
                Team_build__c: teamBuildId,
                Name: memberName,
              };

              const memberUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c`;
              const memberOptions = {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(memberRecord),
              };

              const memberResponse = await fetch(memberUrl, memberOptions);
              if (memberResponse.ok) {
                const memberResult = await memberResponse.json();
                memberIds.push(memberResult.id);
              } else {
                const errorText = await memberResponse.text();
                memberErrors.push({ memberName, error: errorText });
              }
            } catch (memberError) {
              memberErrors.push({ memberName, error: memberError.message });
            }
          }
        } else {
          console.log('✅ All members already exist, no duplicates created');
        }
      }
    }

    console.log(`✅ Created ${memberIds.length} team member(s)`);
    if (memberErrors.length > 0) {
      console.warn(`⚠️ ${memberErrors.length} member(s) failed to create`);
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
        memberIds,
        memberErrors: memberErrors.length > 0 ? memberErrors : undefined,
        message: `Team build created successfully with ${memberIds.length} member(s)`,
      }),
    };

  } catch (error) {
    console.error('❌ Error creating Team build:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to create Team build',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

