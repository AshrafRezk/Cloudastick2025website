/**
 * Netlify Function to fetch Team Hierarchy for a Contact
 * Returns hierarchical tree of contacts (subordinates and managers)
 * with team build allocations, requirements stats, and LMS progress
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
    console.log('👥 Fetch Team Hierarchy - Request received');

    const { access_token, instance_url, contactId } = JSON.parse(event.body || '{}');

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

    // Step 1: Get current contact info
    const contactQuery = `SELECT Id, Name, Email, ReportsToId, ReportsTo.Name, Associated_User__c FROM Contact WHERE Id = '${escapedContactId}' LIMIT 1`;
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

    const currentContact = contactData.records[0];

    // Step 2: Build hierarchy up (managers)
    const managers = [];
    let currentManagerId = currentContact.ReportsToId;
    const visitedIds = new Set([contactId]); // Prevent cycles

    while (currentManagerId && !visitedIds.has(currentManagerId)) {
      visitedIds.add(currentManagerId);
      const managerQuery = `SELECT Id, Name, Email, ReportsToId, Associated_User__c FROM Contact WHERE Id = '${currentManagerId.replace(/'/g, "\\'")}' LIMIT 1`;
      const managerEncoded = encodeURIComponent(managerQuery);
      const managerUrl = `${instance_url}/services/data/v58.0/query/?q=${managerEncoded}`;

      const managerResponse = await fetch(managerUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (managerResponse.ok) {
        const managerData = await managerResponse.json();
        if (managerData.records && managerData.records.length > 0) {
          managers.push(managerData.records[0]);
          currentManagerId = managerData.records[0].ReportsToId;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Step 3: Build hierarchy down (subordinates) - recursively
    const buildSubordinates = async (parentId, depth = 0) => {
      if (depth > 10) return []; // Prevent infinite recursion

      const subordinatesQuery = `SELECT Id, Name, Email, ReportsToId, Associated_User__c FROM Contact WHERE ReportsToId = '${parentId.replace(/'/g, "\\'")}' ORDER BY Name`;
      const subordinatesEncoded = encodeURIComponent(subordinatesQuery);
      const subordinatesUrl = `${instance_url}/services/data/v58.0/query/?q=${subordinatesEncoded}`;

      const subordinatesResponse = await fetch(subordinatesUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!subordinatesResponse.ok) {
        return [];
      }

      const subordinatesData = await subordinatesResponse.json();
      const directSubordinates = subordinatesData.records || [];

      // For each subordinate, recursively get their subordinates and enrich with data
      const enrichedSubordinates = await Promise.all(
        directSubordinates.map(async (sub) => {
          const children = await buildSubordinates(sub.Id, depth + 1);
          
          // Get team builds for this contact
          const teamBuilds = await getTeamBuildsForContact(sub.Name, access_token, instance_url);
          
          // Get requirements stats
          const requirementsStats = await getRequirementsStats(sub.Associated_User__c, access_token, instance_url);
          
          // Get OKRs
          const okrs = await getOKRsForContact(sub.Id, access_token, instance_url);
          
          // Calculate total allocation percentage
          const totalAllocation = teamBuilds.reduce((sum, tb) => sum + (tb.allocationPercentage || 0), 0);

          return {
            id: sub.Id,
            name: sub.Name,
            email: sub.Email,
            reportsToId: sub.ReportsToId,
            associatedUserId: sub.Associated_User__c,
            subordinates: children,
            teamBuilds: teamBuilds,
            requirementsStats: requirementsStats,
            okrs: okrs,
            totalAllocationPercentage: totalAllocation,
          };
        })
      );

      return enrichedSubordinates;
    };

    const subordinates = await buildSubordinates(contactId);

    // Step 4: Enrich current contact with data
    const currentTeamBuilds = await getTeamBuildsForContact(currentContact.Name, access_token, instance_url);
    const currentRequirementsStats = await getRequirementsStats(currentContact.Associated_User__c, access_token, instance_url);
    const currentOKRs = await getOKRsForContact(currentContact.Id, access_token, instance_url);
    const currentTotalAllocation = currentTeamBuilds.reduce((sum, tb) => sum + (tb.allocationPercentage || 0), 0);

    const enrichedCurrentContact = {
      id: currentContact.Id,
      name: currentContact.Name,
      email: currentContact.Email,
      reportsToId: currentContact.ReportsToId,
      reportsToName: currentContact.ReportsTo?.Name || null,
      associatedUserId: currentContact.Associated_User__c,
      managers: managers.map(m => ({
        id: m.Id,
        name: m.Name,
        email: m.Email,
        reportsToId: m.ReportsToId,
        associatedUserId: m.Associated_User__c,
      })),
      subordinates: subordinates,
      teamBuilds: currentTeamBuilds,
      requirementsStats: currentRequirementsStats,
      okrs: currentOKRs,
      totalAllocationPercentage: currentTotalAllocation,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: enrichedCurrentContact,
      }),
    };

  } catch (error) {
    console.error('❌ Error fetching team hierarchy:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch team hierarchy',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

/**
 * Get team builds for a contact by matching Team_build_member__c.Name with Contact.Name
 */
async function getTeamBuildsForContact(contactName, access_token, instance_url) {
  try {
    if (!contactName) return [];

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
      return [];
    }

    const membersData = await membersResponse.json();
    const members = membersData.records || [];

    if (members.length === 0) {
      return [];
    }

    // Get unique team build IDs
    const teamBuildIds = [...new Set(members.map(m => m.Team_build__c).filter(Boolean))];

    if (teamBuildIds.length === 0) {
      return [];
    }

    // Query Team_build__c records
    const teamBuildIdsStr = teamBuildIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
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
      return [];
    }

    const teamBuildsData = await teamBuildsResponse.json();
    const teamBuilds = teamBuildsData.records || [];

    // Map to simplified format
    return teamBuilds.map(tb => ({
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
    }));

  } catch (error) {
    console.error('Error fetching team builds:', error);
    return [];
  }
}

/**
 * Get OKRs for a contact
 * Since OKR.Owner__c is a User lookup and Contact.Associated_User__c links to User,
 * we need to get the Contact's Associated_User__c first, then query OKRs by Owner__c
 * Supports both OKR__c and Objective__c object names
 */
async function getOKRsForContact(contactId, access_token, instance_url) {
  try {
    if (!contactId) return [];

    // First, get the Contact's Associated_User__c (User ID)
    const escapedContactId = contactId.replace(/'/g, "\\'");
    const contactQuery = `SELECT Id, Associated_User__c FROM Contact WHERE Id = '${escapedContactId}' LIMIT 1`;
    const contactEncoded = encodeURIComponent(contactQuery);
    const contactUrl = `${instance_url}/services/data/v58.0/query/?q=${contactEncoded}`;

    const contactResponse = await fetch(contactUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    let userId = null;
    if (contactResponse.ok) {
      const contactData = await contactResponse.json();
      if (contactData.records && contactData.records.length > 0) {
        userId = contactData.records[0].Associated_User__c;
      }
    }

    // If no Associated_User__c, try querying with Contact ID as fallback for other field variations
    // But prioritize Owner__c as User lookup
    if (!userId) {
      console.warn(`No Associated_User__c found for Contact ${contactId}, trying fallback fields`);
    }

    // Try OKR__c first, then Objective__c
    const objectNames = ['OKR__c', 'Objective__c'];
    let okrs = [];

    for (const objectName of objectNames) {
      try {
        // Owner__c is a User lookup - use userId if available
        // Also try other field variations as fallback
        const fieldVariations = [];
        if (userId) {
          const escapedUserId = userId.replace(/'/g, "\\'");
          fieldVariations.push(`Owner__c = '${escapedUserId}'`); // User lookup - prioritize this
        }
        // Fallback variations (in case Owner__c is used differently or other fields exist)
        fieldVariations.push(
          `Contact__c = '${escapedContactId}'`,
          `Employee__c = '${escapedContactId}'`,
          `OwnerId = '${escapedContactId}'`
        );

        for (const whereClause of fieldVariations) {
          try {
            // Query OKR with common fields
            const okrQuery = `SELECT Id, Name, Objective__c, Objective_Description__c, Status__c, Progress__c, Period__c, Year__c, Quarter__c, Start_Date__c, End_Date__c, CreatedDate FROM ${objectName} WHERE ${whereClause} ORDER BY Year__c DESC, Quarter__c DESC, CreatedDate DESC`;
            const okrEncoded = encodeURIComponent(okrQuery);
            const okrUrl = `${instance_url}/services/data/v58.0/query/?q=${okrEncoded}`;

            const okrResponse = await fetch(okrUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });

            if (okrResponse.ok) {
              const okrData = await okrResponse.json();
              const records = okrData.records || [];

              if (records.length > 0) {
                // Fetch key results for each OKR
                const okrsWithKeyResults = await Promise.all(
                  records.map(async (okr) => {
                    const keyResults = await getKeyResultsForOKR(okr.Id, access_token, instance_url);
                    return {
                      id: okr.Id,
                      name: okr.Name,
                      objective: okr.Objective__c || okr.Objective_Description__c || '',
                      status: okr.Status__c || 'Active',
                      progress: okr.Progress__c || 0,
                      period: okr.Period__c || okr.Quarter__c || '',
                      year: okr.Year__c || new Date().getFullYear(),
                      startDate: okr.Start_Date__c || null,
                      endDate: okr.End_Date__c || null,
                      createdDate: okr.CreatedDate,
                      keyResults: keyResults,
                    };
                  })
                );

                okrs = okrsWithKeyResults;
                break; // Found OKRs, stop trying other variations
              }
            }
          } catch (fieldError) {
            // Field variation didn't work, try next one
            continue;
          }
        }

        if (okrs.length > 0) {
          break; // Found OKRs with this object name, stop trying others
        }
      } catch (objectError) {
        // Object doesn't exist or not accessible, try next object name
        continue;
      }
    }

    return okrs;
  } catch (error) {
    console.error('Error fetching OKRs:', error);
    return [];
  }
}

/**
 * Get Key Results for an OKR
 * Supports both Key_Result__c and OKR_Key_Result__c object names
 */
async function getKeyResultsForOKR(okrId, access_token, instance_url) {
  try {
    if (!okrId) return [];

    const escapedOkrId = okrId.replace(/'/g, "\\'");

    // Try different object and field name variations
    const objectNames = ['Key_Result__c', 'OKR_Key_Result__c', 'KR__c'];
    let keyResults = [];

    for (const objectName of objectNames) {
      try {
        // Try common lookup field names
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
 * Get requirements statistics for a user
 */
async function getRequirementsStats(associatedUserId, access_token, instance_url) {
  try {
    if (!associatedUserId) {
      return { completed: 0, inProgress: 0, total: 0 };
    }

    const escapedUserId = associatedUserId.replace(/'/g, "\\'");
    
    // Query requirements grouped by status
    const requirementsQuery = `SELECT Status__c, COUNT(Id) total FROM Requirement__c WHERE Associated_User__c = '${escapedUserId}' GROUP BY Status__c`;
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

