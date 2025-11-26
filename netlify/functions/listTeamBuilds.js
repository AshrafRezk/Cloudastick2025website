/**
 * Netlify Function to list all Team build records from Salesforce
 * Returns all Team_build__c records with their associated team members
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    const { 
      access_token, 
      instance_url 
    } = event.queryStringParameters || {};

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

    console.log('📋 Listing all Team builds from Salesforce...');

    // Query all Team build records
    const soqlQuery = `SELECT Id, Name, Scope__c, Deliverables__c, Account__c, Opportunity__c, Project__c, CreatedDate, LastModifiedDate FROM Team_build__c ORDER BY LastModifiedDate DESC`;
    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📝 SOQL Query:', soqlQuery);

    const queryOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    let queryResponse;
    try {
      queryResponse = await fetch(queryUrl, queryOptions);
    } catch (fetchError) {
      console.error('❌ Network error querying Team builds:', fetchError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Network error',
          message: fetchError.message || 'Failed to query Team build records',
        }),
      };
    }

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text();
      let errorMessage = 'Failed to query Team build records';
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

      console.error('❌ Failed to query Team builds:', errorMessage);
      return {
        statusCode: queryResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to query Team builds',
          message: errorMessage,
        }),
      };
    }

    const queryResult = await queryResponse.json();
    const teamBuilds = queryResult.records || [];

    console.log(`✅ Found ${teamBuilds.length} Team build(s)`);

    // For each team build, fetch its members and get account/opportunity/project names
    const teamBuildsWithDetails = await Promise.all(
      teamBuilds.map(async (teamBuild) => {
        // Fetch team members
        const membersSoql = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${teamBuild.Id.replace(/'/g, "\\'")}'`;
        const membersEncodedQuery = encodeURIComponent(membersSoql);
        const membersQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${membersEncodedQuery}`;

        let members = [];
        try {
          const membersResponse = await fetch(membersQueryUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (membersResponse.ok) {
            const membersResult = await membersResponse.json();
            members = membersResult.records || [];
          }
        } catch (e) {
          console.warn(`⚠️ Error fetching members for ${teamBuild.Id}:`, e);
        }

        // Determine the primary lookup and get its name
        let companyName = '';
        let primaryId = teamBuild.Account__c || teamBuild.Opportunity__c || teamBuild.Project__c;

        // Try to get Account name if Account__c is populated
        if (teamBuild.Account__c) {
          try {
            const accountUrl = `${instance_url}/services/data/v58.0/sobjects/Account/${teamBuild.Account__c}?fields=Name`;
            const accountResponse = await fetch(accountUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
            if (accountResponse.ok) {
              const accountData = await accountResponse.json();
              companyName = accountData.Name || '';
              primaryId = teamBuild.Account__c;
            }
          } catch (e) {
            console.warn(`⚠️ Error fetching Account name:`, e);
          }
        } else if (teamBuild.Opportunity__c) {
          try {
            const oppUrl = `${instance_url}/services/data/v58.0/sobjects/Opportunity/${teamBuild.Opportunity__c}?fields=Name,AccountId,Account.Name`;
            const oppResponse = await fetch(oppUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
            if (oppResponse.ok) {
              const oppData = await oppResponse.json();
              companyName = oppData.Account?.Name || oppData.Name || '';
              primaryId = teamBuild.Opportunity__c;
            }
          } catch (e) {
            console.warn(`⚠️ Error fetching Opportunity name:`, e);
          }
        } else if (teamBuild.Project__c) {
          try {
            const projectUrl = `${instance_url}/services/data/v58.0/sobjects/SFDC_Project__c/${teamBuild.Project__c}?fields=Name,Account__c,Account__r.Name`;
            const projectResponse = await fetch(projectUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              companyName = projectData.Account__r?.Name || projectData.Name || '';
              primaryId = teamBuild.Project__c;
            }
          } catch (e) {
            console.warn(`⚠️ Error fetching Project name:`, e);
          }
        }

        return {
          projectId: primaryId || teamBuild.Id,
          teamBuildId: teamBuild.Id,
          companyName: companyName || 'N/A',
          teamMemberCount: members.length,
          hasScope: !!teamBuild.Scope__c,
          hasDeliverables: !!teamBuild.Deliverables__c,
          updatedAt: teamBuild.LastModifiedDate || teamBuild.CreatedDate,
          createdAt: teamBuild.CreatedDate,
          accountId: teamBuild.Account__c,
          opportunityId: teamBuild.Opportunity__c,
          projectId_sf: teamBuild.Project__c,
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        projects: teamBuildsWithDetails,
        total: teamBuildsWithDetails.length,
      }),
    };

  } catch (error) {
    console.error('❌ Error listing Team builds:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to list Team builds',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

