/**
 * Netlify Function to retrieve Team build and Team build member records from Salesforce
 * Queries by Account, Opportunity, Project, or Team build ID
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
      instance_url, 
      teamBuildId,
      accountId,
      opportunityId,
      projectId,
      guid
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

    // At least one identifier must be provided
    if (!teamBuildId && !accountId && !opportunityId && !projectId && !guid) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'At least one identifier (teamBuildId, accountId, opportunityId, projectId, or guid) is required' }),
      };
    }

    console.log('📖 Retrieving Team build from Salesforce...');
    console.log('Query params:', { teamBuildId, accountId, opportunityId, projectId, guid });

    let teamBuildIdToUse = teamBuildId;
    let resolvedOpportunityId = opportunityId;

    // If projectId is provided but opportunityId is not, fetch the Project to get its Opportunity__c
    if (projectId && !opportunityId && !teamBuildIdToUse) {
      try {
        const projectUrl = `${instance_url}/services/data/v58.0/sobjects/SFDC_Project__c/${projectId}?fields=Id,Opportunity__c`;
        const projectOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        };

        const projectResponse = await fetch(projectUrl, projectOptions);
        if (projectResponse.ok) {
          const projectData = await projectResponse.json();
          if (projectData.Opportunity__c) {
            resolvedOpportunityId = projectData.Opportunity__c;
            console.log('✅ Resolved Project Opportunity__c:', resolvedOpportunityId);
          } else {
            console.log('⚠️ Project does not have an Opportunity__c lookup set');
          }
        } else {
          console.warn('⚠️ Could not fetch Project record to resolve Opportunity__c');
        }
      } catch (projectError) {
        console.warn('⚠️ Error fetching Project to resolve Opportunity__c:', projectError);
        // Continue with just projectId lookup
      }
    }

    // If no direct ID provided, query by lookup fields
    if (!teamBuildIdToUse) {
      // Build SOQL query
      const conditions = [];
      if (accountId) {
        conditions.push(`Account__c = '${accountId.replace(/'/g, "\\'")}'`);
      }
      if (resolvedOpportunityId) {
        conditions.push(`Opportunity__c = '${resolvedOpportunityId.replace(/'/g, "\\'")}'`);
      }
      if (projectId) {
        conditions.push(`Project__c = '${projectId.replace(/'/g, "\\'")}'`);
      }
      if (guid) {
        conditions.push(`GUID__c = '${guid.replace(/'/g, "\\'")}'`);
      }

      const whereClause = conditions.join(' OR ');
      const soqlQuery = `SELECT Id, Name, Scope__c, Deliverables__c, Account__c, Opportunity__c, Project__c, GUID__c, CreatedDate, LastModifiedDate FROM Team_build__c WHERE ${whereClause} ORDER BY CreatedDate DESC LIMIT 1`;

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
        console.error('❌ Network error querying Team build:', fetchError);
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

        console.error('❌ Failed to query Team build:', errorMessage);
        return {
          statusCode: queryResponse.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Failed to query Team build',
            message: errorMessage,
          }),
        };
      }

      const queryResult = await queryResponse.json();

      if (!queryResult.records || queryResult.records.length === 0) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: 'Team build not found',
            message: 'No Team build record found for the provided criteria',
          }),
        };
      }

      teamBuildIdToUse = queryResult.records[0].Id;
      console.log('✅ Found Team build:', teamBuildIdToUse);
    }

    // Now fetch the Team build record and its members
    // Fetch Team build details
    const teamBuildUrl = `${instance_url}/services/data/v58.0/sobjects/Team_build__c/${teamBuildIdToUse}`;
    const teamBuildOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    let teamBuildResponse;
    try {
      teamBuildResponse = await fetch(teamBuildUrl, teamBuildOptions);
    } catch (fetchError) {
      console.error('❌ Network error fetching Team build:', fetchError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Network error',
          message: fetchError.message || 'Failed to fetch Team build record',
        }),
      };
    }

    if (!teamBuildResponse.ok) {
      const errorText = await teamBuildResponse.text();
      let errorMessage = 'Failed to fetch Team build record';
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

      return {
        statusCode: teamBuildResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to fetch Team build',
          message: errorMessage,
        }),
      };
    }

    const teamBuild = await teamBuildResponse.json();

    // Fetch Team build members
    const membersSoql = `SELECT Id, Name, Team_build__c FROM Team_build_member__c WHERE Team_build__c = '${teamBuildIdToUse.replace(/'/g, "\\'")}' ORDER BY Name`;
    const membersEncodedQuery = encodeURIComponent(membersSoql);
    const membersQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${membersEncodedQuery}`;

    const membersOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };

    let membersResponse;
    let members = [];
    try {
      membersResponse = await fetch(membersQueryUrl, membersOptions);
      if (membersResponse.ok) {
        const membersResult = await membersResponse.json();
        members = membersResult.records || [];
      }
    } catch (fetchError) {
      console.warn('⚠️ Error fetching team members:', fetchError);
      // Continue without members
    }

    console.log(`✅ Retrieved Team build with ${members.length} member(s)`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: {
          teamBuildId: teamBuild.Id,
          name: teamBuild.Name,
          scope: teamBuild.Scope__c || '',
          deliverables: teamBuild.Deliverables__c || '',
          accountId: teamBuild.Account__c,
          opportunityId: teamBuild.Opportunity__c,
          projectId: teamBuild.Project__c,
          guid: teamBuild.GUID__c,
          createdAt: teamBuild.CreatedDate,
          updatedAt: teamBuild.LastModifiedDate,
          teamMembers: members.map(m => m.Name),
        },
      }),
    };

  } catch (error) {
    console.error('❌ Error retrieving Team build:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to retrieve Team build',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

