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

    if (teamMembers && teamMembers.length > 0) {
      // First, check if any members already exist (to prevent duplicates)
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
          existingMemberNames = new Set((checkResult.records || []).map((m) => m.Name));
          if (existingMemberNames.size > 0) {
            console.log(`Found ${existingMemberNames.size} existing members, will skip duplicates`);
          }
        }
      } catch (checkError) {
        console.warn('Could not check existing members:', checkError);
        // Continue anyway
      }
      
      // Filter out members that already exist
      const membersToCreate = teamMembers.filter(name => !existingMemberNames.has(name));
      
      if (membersToCreate.length === 0) {
        console.log('✅ All members already exist, no new members to create');
      } else if (membersToCreate.length === 1) {
        // For single member, create directly (simpler)
        try {
          const memberRecord = {
            Team_build__c: teamBuildId,
            Name: membersToCreate[0],
          };

          const memberUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c`;
          const memberResponse = await fetch(memberUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberRecord),
          });

          if (memberResponse.ok) {
            const memberResult = await memberResponse.json();
            memberIds.push(memberResult.id);
            console.log(`✅ Created 1 team member`);
          } else {
            const errorText = await memberResponse.text();
            memberErrors.push({ memberName: membersToCreate[0], error: errorText });
          }
        } catch (memberError) {
          memberErrors.push({ memberName: membersToCreate[0], error: memberError.message });
        }
      } else {
        // For multiple members, try composite API first
        const compositeUrl = `${instance_url}/services/data/v58.0/composite/sobjects`;
        const compositeRecords = membersToCreate.map((memberName) => ({
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

        let compositeSucceeded = false;
        const compositeCreatedNames = new Set<string>();
        
        try {
          const compositeResponse = await fetch(compositeUrl, compositeOptions);
          
          if (compositeResponse.ok) {
            const compositeResult = await compositeResponse.json();
            
            // Check for standard compositeResponse array
            if (compositeResult.compositeResponse && Array.isArray(compositeResult.compositeResponse)) {
              compositeResult.compositeResponse.forEach((item, index) => {
                if (item.httpStatusCode === 201 && item.body && item.body.id) {
                  memberIds.push(item.body.id);
                  compositeCreatedNames.add(membersToCreate[index]);
                } else {
                  const memberName = membersToCreate[index];
                  const errorMsg = item.body && Array.isArray(item.body) && item.body[0] ? item.body[0].message : (item.body?.message || 'Unknown error');
                  memberErrors.push({ memberName, error: errorMsg });
                  console.error(`❌ Failed to create member ${memberName}:`, errorMsg);
                }
              });
              compositeSucceeded = true;
              console.log(`✅ Composite API created ${memberIds.length} of ${membersToCreate.length} member(s)`);
            } else {
              console.warn('⚠️ Composite API returned unexpected format, will verify and fallback if needed');
            }
          } else {
            console.warn(`⚠️ Composite API failed with status ${compositeResponse.status}, falling back to individual creation`);
          }
        } catch (compositeError) {
          console.warn('⚠️ Composite API error, falling back to individual creation:', compositeError.message);
        }

        // After composite API, verify what was actually created to prevent duplicates
        // Query existing members to see what's actually in Salesforce
        const verifySoql = `SELECT Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
        const verifyEncoded = encodeURIComponent(verifySoql);
        const verifyUrl = `${instance_url}/services/data/v58.0/query/?q=${verifyEncoded}`;
        
        let actuallyExistingNames = new Set();
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
            actuallyExistingNames = new Set((verifyResult.records || []).map((m) => m.Name));
            console.log(`Verified: ${actuallyExistingNames.size} members actually exist in Salesforce`);
          }
        } catch (verifyError) {
          console.warn('Could not verify existing members:', verifyError);
          // If we can't verify, use the composite result or existing check
          const allNames = Array.from(existingMemberNames);
          compositeCreatedNames.forEach(name => allNames.push(name));
          actuallyExistingNames = new Set(allNames);
        }

        // Determine which members still need to be created
        const membersStillNeeded = membersToCreate.filter(name => !actuallyExistingNames.has(name));
        
        // Fallback to individual creation if composite failed or some members are missing
        if (!compositeSucceeded || membersStillNeeded.length > 0) {
          if (membersStillNeeded.length > 0) {
            console.log(`Creating ${membersStillNeeded.length} remaining member(s) individually (${membersToCreate.length - membersStillNeeded.length} already exist)...`);
            for (const memberName of membersStillNeeded) {
              try {
                const memberRecord = {
                  Team_build__c: teamBuildId,
                  Name: memberName,
                };

                const memberUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c`;
                const memberResponse = await fetch(memberUrl, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(memberRecord),
                });

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
          } else if (!compositeSucceeded) {
            console.log(`Composite API failed, but all ${membersToCreate.length} members already exist. Skipping individual creation.`);
          }
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

