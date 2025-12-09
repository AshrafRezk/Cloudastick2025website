/**
 * Netlify Function to fetch data for a single team member
 * Returns OKRs, requirements stats, and team builds for one contact
 * Supports pagination for large datasets
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('👤 Fetch Team Member Data - Request received');

    const { 
      access_token, 
      instance_url, 
      contactId,
      okrOffset = 0,
      okrLimit = 50,
      teamBuildOffset = 0,
      teamBuildLimit = 20
    } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url || !contactId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    const escapedContactId = contactId.replace(/'/g, "\\'");

    // Step 1: Get contact info and associated user
    const contactQuery = `SELECT Id, Name, Email, Associated_User__c FROM Contact WHERE Id = '${escapedContactId}' LIMIT 1`;
    const contactEncoded = encodeURIComponent(contactQuery);
    const contactUrl = `${instance_url}/services/data/v58.0/query/?q=${contactEncoded}`;

    const contactResponse = await fetch(contactUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!contactResponse.ok) {
      throw new Error(`Failed to fetch contact: ${contactResponse.status}`);
    }

    const contactData = await contactResponse.json();
    if (!contactData.records || contactData.records.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Contact not found' }),
      };
    }

    const contact = contactData.records[0];
    const userId = contact.Associated_User__c;

    if (!userId) {
      // Contact has no associated user, return empty data
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          data: {
            contactId: contact.Id,
            okrs: [],
            requirementsStats: { completed: 0, inProgress: 0, total: 0 },
            teamBuilds: [],
            totalAllocationPercentage: 0,
            pagination: {
              okrs: { offset: 0, limit: okrLimit, total: 0, hasMore: false },
              teamBuilds: { offset: 0, limit: teamBuildLimit, total: 0, hasMore: false },
            },
          },
        }),
      };
    }

    // Step 2: Fetch requirements stats
    const requirementsStats = await getRequirementsStatsForUser(userId, access_token, instance_url);

    // Step 3: Fetch OKRs with pagination
    const okrData = await getOKRsForUser(userId, access_token, instance_url, okrOffset, okrLimit);

    // Step 4: Fetch team builds with pagination
    const teamBuildData = await getTeamBuildsForContact(contact.Name, access_token, instance_url, teamBuildOffset, teamBuildLimit);

    // Calculate total allocation
    const totalAllocation = teamBuildData.teamBuilds.reduce((sum, tb) => sum + (tb.allocationPercentage || 0), 0);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify({
        success: true,
        data: {
          contactId: contact.Id,
          okrs: okrData.okrs,
          requirementsStats: requirementsStats,
          teamBuilds: teamBuildData.teamBuilds,
          totalAllocationPercentage: totalAllocation,
          pagination: {
            okrs: {
              offset: okrOffset,
              limit: okrLimit,
              total: okrData.total,
              hasMore: okrData.hasMore,
            },
            teamBuilds: {
              offset: teamBuildOffset,
              limit: teamBuildLimit,
              total: teamBuildData.total,
              hasMore: teamBuildData.hasMore,
            },
          },
        },
      }),
    };

  } catch (error) {
    console.error('❌ Error fetching team member data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch team member data',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

/**
 * Get requirements statistics for a single user
 */
async function getRequirementsStatsForUser(userId, access_token, instance_url) {
  try {
    const escapedUserId = userId.replace(/'/g, "\\'");
    const requirementsQuery = `SELECT Status__c, COUNT(Id) total FROM Requirement__c WHERE OwnerId = '${escapedUserId}' GROUP BY Status__c`;
    const requirementsEncoded = encodeURIComponent(requirementsQuery);
    const requirementsUrl = `${instance_url}/services/data/v58.0/query/?q=${requirementsEncoded}`;

    const requirementsResponse = await fetch(requirementsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!requirementsResponse.ok) {
      return { completed: 0, inProgress: 0, total: 0 };
    }

    const requirementsData = await requirementsResponse.json();
    const records = requirementsData.records || [];

    let completed = 0;
    let inProgress = 0;
    let total = 0;

    records.forEach(record => {
      const count = record.total || 0;
      total += count;
      const status = (record.Status__c || '').toLowerCase();
      if (status === 'completed' || status === 'done' || status === 'closed') {
        completed += count;
      } else if (status === 'in progress' || status === 'in-progress' || status === 'working') {
        inProgress += count;
      }
    });

    return { completed, inProgress, total };
  } catch (error) {
    console.error('Error fetching requirements stats:', error);
    return { completed: 0, inProgress: 0, total: 0 };
  }
}

/**
 * Get OKRs for a single user with pagination
 */
async function getOKRsForUser(userId, access_token, instance_url, offset = 0, limit = 50) {
  try {
    const escapedUserId = userId.replace(/'/g, "\\'");
    
    // First, get total count
    const countQuery = `SELECT COUNT() FROM OKR__c WHERE Owner__c = '${escapedUserId}'`;
    const countEncoded = encodeURIComponent(countQuery);
    const countUrl = `${instance_url}/services/data/v58.0/query/?q=${countEncoded}`;

    let total = 0;
    try {
      const countResponse = await fetch(countUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (countResponse.ok) {
        const countData = await countResponse.json();
        total = countData.totalSize || 0;
      }
    } catch (e) {
      console.warn('Could not get OKR count:', e.message);
    }

    // Fetch parent OKRs with pagination
    const okrQuery = `SELECT FIELDS(ALL) FROM OKR__c WHERE Owner__c = '${escapedUserId}' AND Parent_Objective__c = null ORDER BY Year__c DESC, Quarter__c DESC, CreatedDate DESC LIMIT ${limit} OFFSET ${offset}`;
    const okrEncoded = encodeURIComponent(okrQuery);
    const okrUrl = `${instance_url}/services/data/v58.0/query/?q=${okrEncoded}`;

    const okrResponse = await fetch(okrUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!okrResponse.ok) {
      return { okrs: [], total: 0, hasMore: false };
    }

    const okrData = await okrResponse.json();
    const parentOkrs = okrData.records || [];

    // Fetch child OKRs for the parent OKRs we got
    let childOkrs = [];
    if (parentOkrs.length > 0) {
      const parentOkrIds = parentOkrs.map(okr => okr.Id);
      const escapedParentIds = parentOkrIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
      const childOkrQuery = `SELECT FIELDS(ALL) FROM OKR__c WHERE Parent_Objective__c IN (${escapedParentIds})`;
      const childOkrEncoded = encodeURIComponent(childOkrQuery);
      const childOkrUrl = `${instance_url}/services/data/v58.0/query/?q=${childOkrEncoded}`;

      try {
        const childOkrResponse = await fetch(childOkrUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (childOkrResponse.ok) {
          const childOkrData = await childOkrResponse.json();
          childOkrs = childOkrData.records || [];
        }
      } catch (e) {
        console.warn('Error fetching child OKRs:', e.message);
      }
    }

    // Combine and fetch key results
    const allOkrs = [...parentOkrs, ...childOkrs];
    const keyResultsPromises = allOkrs.map(okr => getKeyResultsForOKR(okr.Id, access_token, instance_url));
    const allKeyResults = await Promise.all(keyResultsPromises);

    // Build OKR objects
    const okrObjects = allOkrs.map((okr, index) => {
      const isChild = !!okr.Parent_Objective__c;
      return {
        id: okr.Id,
        name: okr.Name || '',
        objective: okr.Objective__c || okr.Objective_Description__c || okr.Name || '',
        status: okr.Status__c || 'Active',
        progress: okr.Progress__c || 0,
        period: okr.Period__c || okr.Quarter__c || '',
        year: okr.Year__c || new Date().getFullYear(),
        startDate: okr.Start_Date__c || null,
        endDate: okr.End_Date__c || null,
        createdDate: okr.CreatedDate,
        parentObjectiveId: okr.Parent_Objective__c || null,
        keyResults: allKeyResults[index] || [],
        children: [],
      };
    });

    // Build hierarchy
    const okrIdToOkr = new Map();
    okrObjects.forEach(okr => {
      okrIdToOkr.set(okr.id, okr);
    });

    const topLevelOkrs = [];
    okrObjects.forEach(okr => {
      if (okr.parentObjectiveId && okrIdToOkr.has(okr.parentObjectiveId)) {
        const parent = okrIdToOkr.get(okr.parentObjectiveId);
        const { parentObjectiveId, ...cleanOkr } = okr;
        parent.children.push(cleanOkr);
      } else if (!okr.parentObjectiveId) {
        const { parentObjectiveId, ...cleanOkr } = okr;
        topLevelOkrs.push(cleanOkr);
      }
    });

    const hasMore = (offset + limit) < total;

    return {
      okrs: topLevelOkrs,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching OKRs:', error);
    return { okrs: [], total: 0, hasMore: false };
  }
}

/**
 * Get Key Results for an OKR
 */
async function getKeyResultsForOKR(okrId, access_token, instance_url) {
  try {
    if (!okrId) return [];

    const escapedOkrId = okrId.replace(/'/g, "\\'");
    const objectNames = ['Key_Result__c', 'OKR_Key_Result__c', 'KR__c'];
    let keyResults = [];

    for (const objectName of objectNames) {
      try {
        const lookupVariations = [
          `OKR__c = '${escapedOkrId}'`,
          `Objective__c = '${escapedOkrId}'`,
          `Parent_OKR__c = '${escapedOkrId}'`,
        ];

        for (const whereClause of lookupVariations) {
          try {
            const krQuery = `SELECT Id, Name, Description__c, Key_Result__c, Target__c, Current_Value__c, Progress__c, Status__c, Unit__c, CreatedDate FROM ${objectName} WHERE ${whereClause} ORDER BY CreatedDate ASC`;
            const krEncoded = encodeURIComponent(krQuery);
            const krUrl = `${instance_url}/services/data/v58.0/query/?q=${krEncoded}`;

            const krResponse = await fetch(krUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });

            if (krResponse.ok) {
              const krData = await krResponse.json();
              const records = krData.records || [];

              if (records.length > 0) {
                keyResults = records.map(kr => ({
                  id: kr.Id,
                  name: kr.Name,
                  description: kr.Description__c || kr.Key_Result__c || '',
                  target: kr.Target__c || 0,
                  currentValue: kr.Current_Value__c || 0,
                  progress: kr.Progress__c || (kr.Target__c && kr.Current_Value__c ? Math.round((kr.Current_Value__c / kr.Target__c) * 100) : 0),
                  status: kr.Status__c || 'In Progress',
                  unit: kr.Unit__c || '',
                  createdDate: kr.CreatedDate,
                }));
                break;
              }
            }
          } catch (fieldError) {
            continue;
          }
        }

        if (keyResults.length > 0) {
          break;
        }
      } catch (objectError) {
        continue;
      }
    }

    return keyResults;
  } catch (error) {
    console.error('Error fetching key results:', error);
    return [];
  }
}

/**
 * Get team builds for a contact with pagination
 */
async function getTeamBuildsForContact(contactName, access_token, instance_url, offset = 0, limit = 20) {
  try {
    if (!contactName) return { teamBuilds: [], total: 0, hasMore: false };

    const escapedName = contactName.replace(/'/g, "\\'");
    
    // Query Team_build_member__c records where Name matches contact name
    const membersQuery = `SELECT Id, Name, Team_build__c FROM Team_build_member__c WHERE Name = '${escapedName}'`;
    const membersEncoded = encodeURIComponent(membersQuery);
    const membersUrl = `${instance_url}/services/data/v58.0/query/?q=${membersEncoded}`;

    const membersResponse = await fetch(membersUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!membersResponse.ok) {
      return { teamBuilds: [], total: 0, hasMore: false };
    }

    const membersData = await membersResponse.json();
    const members = membersData.records || [];

    if (members.length === 0) {
      return { teamBuilds: [], total: 0, hasMore: false };
    }

    // Get unique team build IDs
    const teamBuildIds = [...new Set(members.map(m => m.Team_build__c).filter(Boolean))];
    const total = teamBuildIds.length;

    if (teamBuildIds.length === 0) {
      return { teamBuilds: [], total: 0, hasMore: false };
    }

    // Apply pagination
    const paginatedIds = teamBuildIds.slice(offset, offset + limit);
    const hasMore = (offset + limit) < total;

    // Query Team_build__c records
    const teamBuildIdsStr = paginatedIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
    const teamBuildsQuery = `SELECT Id, Name, Scope__c, Deliverables__c, Account__c, Account__r.Name, Opportunity__c, Opportunity__r.Name, Project__c, Project__r.Name, Allocation_Percentage__c, CreatedDate FROM Team_build__c WHERE Id IN (${teamBuildIdsStr})`;
    const teamBuildsEncoded = encodeURIComponent(teamBuildsQuery);
    const teamBuildsUrl = `${instance_url}/services/data/v58.0/query/?q=${teamBuildsEncoded}`;

    const teamBuildsResponse = await fetch(teamBuildsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!teamBuildsResponse.ok) {
      return { teamBuilds: [], total, hasMore };
    }

    const teamBuildsData = await teamBuildsResponse.json();
    const teamBuilds = teamBuildsData.records || [];

    // Fetch team members for each team build
    const teamBuildsWithMembers = await Promise.all(
      teamBuilds.map(async (tb) => {
        const escapedTeamBuildId = tb.Id.replace(/'/g, "\\'");
        const membersQuery = `SELECT Id, Name FROM Team_build_member__c WHERE Team_build__c = '${escapedTeamBuildId}' ORDER BY Name`;
        const membersEncoded = encodeURIComponent(membersQuery);
        const membersUrl = `${instance_url}/services/data/v58.0/query/?q=${membersEncoded}`;

        let teamMembers = [];
        try {
          const membersResponse = await fetch(membersUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            teamMembers = (membersData.records || []).map(m => ({
              id: m.Id,
              name: m.Name,
            }));
          }
        } catch (error) {
          console.warn(`Error fetching team members for ${tb.Id}:`, error);
        }

        return {
          id: tb.Id,
          name: tb.Name,
          scope: tb.Scope__c || '',
          deliverables: tb.Deliverables__c || '',
          accountId: tb.Account__c,
          accountName: tb.Account__r?.Name || '',
          opportunityId: tb.Opportunity__c,
          opportunityName: tb.Opportunity__r?.Name || '',
          projectId: tb.Project__c,
          projectName: tb.Project__r?.Name || '',
          allocationPercentage: tb.Allocation_Percentage__c || 0,
          createdDate: tb.CreatedDate,
          teamMembers: teamMembers,
        };
      })
    );

    return {
      teamBuilds: teamBuildsWithMembers,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching team builds:', error);
    return { teamBuilds: [], total: 0, hasMore: false };
  }
}

