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

    // Generate unique request ID for idempotency tracking
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`📝 [${requestId}] Creating Team build in Salesforce...`);
    console.log(`📋 [${requestId}] Lookups:`, { accountId, opportunityId, projectId });
    console.log(`👥 [${requestId}] Team members: ${teamMembers.length}`);

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
      // This is the initial check before any creation attempts
      console.log(`🔍 [${requestId}] Initial duplicate check for team build ${teamBuildId}...`);
      const checkSoql = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
      const checkEncoded = encodeURIComponent(checkSoql);
      const checkUrl = `${instance_url}/services/data/v58.0/query/?q=${checkEncoded}`;
      
      let existingMemberNames = new Set();
      let existingMemberIds = new Map();
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
          const existingRecords = checkResult.records || [];
          existingRecords.forEach((m) => {
            existingMemberNames.add(m.Name);
            existingMemberIds.set(m.Name, m.Id);
          });
          if (existingMemberNames.size > 0) {
            console.log(`✅ [${requestId}] Found ${existingMemberNames.size} existing members: ${Array.from(existingMemberNames).join(', ')}`);
            // Add existing IDs to memberIds array
            existingMemberIds.forEach((id) => memberIds.push(id));
          } else {
            console.log(`✅ [${requestId}] No existing members found (new team build)`);
          }
        }
      } catch (checkError) {
        console.warn(`⚠️ [${requestId}] Could not check existing members:`, checkError.message);
        // Continue anyway - we'll check again after composite API
      }
      
      // Filter out members that already exist
      const membersToCreate = teamMembers.filter(name => !existingMemberNames.has(name));
      console.log(`📋 [${requestId}] Members to create: ${membersToCreate.length} (${existingMemberNames.size} already exist)`);
      
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
        const compositeCreatedNames = new Set();
        const compositeCreatedIds = new Map(); // Track name -> ID mapping
        const compositeFailedNames = new Set();
        
        console.log(`📤 [${requestId}] Calling Composite API to create ${membersToCreate.length} member(s)...`);
        console.log(`📋 [${requestId}] Members to create: ${membersToCreate.join(', ')}`);
        
        try {
          const compositeResponse = await fetch(compositeUrl, compositeOptions);
          const compositeStatus = compositeResponse.status;
          console.log(`📥 Composite API response status: ${compositeStatus}`);
          
          if (compositeResponse.ok) {
            const compositeResult = await compositeResponse.json();
            console.log(`📦 Composite API response structure:`, JSON.stringify(Object.keys(compositeResult)));
            
            // Check for standard compositeResponse array
            if (compositeResult.compositeResponse && Array.isArray(compositeResult.compositeResponse)) {
              console.log(`✅ Composite API returned ${compositeResult.compositeResponse.length} response items`);
              
              compositeResult.compositeResponse.forEach((item, index) => {
                const memberName = membersToCreate[index];
                const httpStatus = item.httpStatusCode;
                const responseBody = item.body;
                
                console.log(`  [${index}] ${memberName}: HTTP ${httpStatus}`);
                
                if (httpStatus === 201 && responseBody && responseBody.id) {
                  const createdId = responseBody.id;
                  memberIds.push(createdId);
                  compositeCreatedNames.add(memberName);
                  compositeCreatedIds.set(memberName, createdId);
                  console.log(`    ✅ Created with ID: ${createdId}`);
                } else {
                  compositeFailedNames.add(memberName);
                  const errorMsg = responseBody && Array.isArray(responseBody) && responseBody[0] 
                    ? responseBody[0].message 
                    : (responseBody?.message || responseBody?.errorCode || 'Unknown error');
                  memberErrors.push({ memberName, error: errorMsg });
                  console.error(`    ❌ Failed: ${errorMsg}`);
                }
              });
              
              // Composite succeeded if all members were created
              if (compositeCreatedNames.size === membersToCreate.length) {
                compositeSucceeded = true;
                console.log(`✅ Composite API created all ${membersToCreate.length} member(s) successfully`);
              } else {
                console.log(`⚠️ Composite API created ${compositeCreatedNames.size} of ${membersToCreate.length} member(s), ${compositeFailedNames.size} failed`);
              }
            } else {
              console.warn('⚠️ Composite API returned unexpected format:', JSON.stringify(compositeResult).substring(0, 200));
            }
          } else {
            const errorText = await compositeResponse.text();
            console.warn(`⚠️ Composite API failed with status ${compositeStatus}: ${errorText.substring(0, 200)}`);
          }
        } catch (compositeError) {
          console.error('❌ Composite API error:', compositeError.message);
          console.error('Stack:', compositeError.stack);
        }

        // CRITICAL: After composite API, verify what was ACTUALLY created in Salesforce
        // This prevents duplicates if composite API succeeded but we didn't parse it correctly
        // This is the idempotency check - we verify the actual state in Salesforce
        console.log(`🔍 [${requestId}] Verifying actual members in Salesforce after composite API (idempotency check)...`);
        const verifySoql = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}'`;
        const verifyEncoded = encodeURIComponent(verifySoql);
        const verifyUrl = `${instance_url}/services/data/v58.0/query/?q=${verifyEncoded}`;
        
        let actuallyExistingNames = new Set();
        let actuallyExistingIds = new Map();
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
            const actualMembers = verifyResult.records || [];
            actualMembers.forEach((m) => {
              actuallyExistingNames.add(m.Name);
              actuallyExistingIds.set(m.Name, m.Id);
            });
            console.log(`✅ Verified: ${actuallyExistingNames.size} members actually exist in Salesforce`);
            console.log(`   Existing members: ${Array.from(actuallyExistingNames).join(', ')}`);
          } else {
            console.warn('⚠️ Could not verify existing members, using composite API results');
            // Fallback to composite results
            actuallyExistingNames = new Set([...Array.from(existingMemberNames), ...Array.from(compositeCreatedNames)]);
          }
        } catch (verifyError) {
          console.warn('⚠️ Error verifying members:', verifyError.message);
          // Fallback to composite results
          actuallyExistingNames = new Set([...Array.from(existingMemberNames), ...Array.from(compositeCreatedNames)]);
        }

        // Determine which members still need to be created
        const membersStillNeeded = membersToCreate.filter(name => !actuallyExistingNames.has(name));
        console.log(`📊 Summary: ${membersToCreate.length} requested, ${actuallyExistingNames.size} exist, ${membersStillNeeded.length} still needed`);
        
        // Only create individually the members that are confirmed missing
        if (membersStillNeeded.length > 0) {
          console.log(`🔨 Creating ${membersStillNeeded.length} missing member(s) individually: ${membersStillNeeded.join(', ')}`);
          
          for (const memberName of membersStillNeeded) {
            // Final safety check: query if this specific member exists
            const finalCheckSoql = `SELECT Id FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}' AND Name = '${memberName.replace(/'/g, "\\'")}' LIMIT 1`;
            const finalCheckEncoded = encodeURIComponent(finalCheckSoql);
            const finalCheckUrl = `${instance_url}/services/data/v58.0/query/?q=${finalCheckEncoded}`;
            
            let memberExists = false;
            try {
              const finalCheckResponse = await fetch(finalCheckUrl, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (finalCheckResponse.ok) {
                const finalCheckResult = await finalCheckResponse.json();
                if (finalCheckResult.records && finalCheckResult.records.length > 0) {
                  memberExists = true;
                  const existingId = finalCheckResult.records[0].Id;
                  memberIds.push(existingId);
                  console.log(`  ⚠️ ${memberName} already exists (ID: ${existingId}), skipping creation`);
                }
              }
            } catch (finalCheckError) {
              console.warn(`  ⚠️ Could not check if ${memberName} exists, will attempt creation`);
            }
            
            if (memberExists) {
              continue;
            }
            
            try {
              const memberRecord = {
                Team_build__c: teamBuildId,
                Name: memberName,
              };

              const memberUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build_member__c`;
              console.log(`  📝 Creating ${memberName}...`);
              
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
                console.log(`  ✅ Created ${memberName} with ID: ${memberResult.id}`);
              } else {
                const errorText = await memberResponse.text();
                // Check if error is due to duplicate (Salesforce will return specific error)
                if (errorText.includes('duplicate') || errorText.includes('already exists') || errorText.includes('DUPLICATE_VALUE')) {
                  console.log(`  ⚠️ ${memberName} already exists (duplicate detected), skipping`);
                } else {
                  memberErrors.push({ memberName, error: errorText });
                  console.error(`  ❌ Failed to create ${memberName}: ${errorText.substring(0, 100)}`);
                }
              }
            } catch (memberError) {
              memberErrors.push({ memberName, error: memberError.message });
              console.error(`  ❌ Error creating ${memberName}:`, memberError.message);
            }
          }
        } else {
          console.log(`✅ All ${membersToCreate.length} member(s) already exist, no individual creation needed`);
        }
      }
    }

    // Final verification: query all members to ensure we have the complete list
    console.log(`🔍 [${requestId}] Final verification: querying all members for team build ${teamBuildId}...`);
    const finalVerifySoql = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuildId.replace(/'/g, "\\'")}' ORDER BY Name`;
    const finalVerifyEncoded = encodeURIComponent(finalVerifySoql);
    const finalVerifyUrl = `${instance_url}/services/data/v58.0/query/?q=${finalVerifyEncoded}`;
    
    try {
      const finalVerifyResponse = await fetch(finalVerifyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (finalVerifyResponse.ok) {
        const finalVerifyResult = await finalVerifyResponse.json();
        const finalMembers = finalVerifyResult.records || [];
        const finalMemberNames = finalMembers.map(m => m.Name);
        const finalMemberIds = finalMembers.map(m => m.Id);
        
        console.log(`✅ [${requestId}] Final state: ${finalMembers.length} member(s) in Salesforce`);
        console.log(`   Member names: ${finalMemberNames.join(', ')}`);
        
        // Check for duplicates
        const nameCounts = {};
        finalMemberNames.forEach(name => {
          nameCounts[name] = (nameCounts[name] || 0) + 1;
        });
        
        const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);
        if (duplicates.length > 0) {
          console.error(`❌ [${requestId}] DUPLICATE DETECTED: ${duplicates.map(([name, count]) => `${name} (${count}x)`).join(', ')}`);
        } else {
          console.log(`✅ [${requestId}] No duplicates detected - all members are unique`);
        }
        
        // Use final verified IDs
        memberIds.length = 0;
        memberIds.push(...finalMemberIds);
      }
    } catch (finalVerifyError) {
      console.warn(`⚠️ [${requestId}] Could not perform final verification:`, finalVerifyError.message);
    }

    console.log(`✅ [${requestId}] Created ${memberIds.length} team member(s) total`);
    if (memberErrors.length > 0) {
      console.warn(`⚠️ [${requestId}] ${memberErrors.length} member(s) failed to create`);
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
        requestId, // Include request ID for tracking
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

