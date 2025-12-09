/**
 * Netlify Function to fetch data for a single team member
 * Returns OKRs, requirements stats, and team builds for one contact
 * Supports pagination for large datasets
 * Uses cache first to reduce API calls
 */

const {
  getCache,
  setCache,
  getCacheKey,
  getListCacheKey,
  simpleHash,
  CACHE_TTLS,
} = require('./salesforceCacheManager');

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

    // Step 1: Get contact info and associated user - check cache first
    let contact = null;
    const contactCacheKey = getCacheKey('Contact', contactId);
    const contactCached = await getCache(contactCacheKey, CACHE_TTLS['Contact'], context);
    
    if (contactCached && contactCached.data) {
      contact = contactCached.data;
      console.log('✅ Found contact in cache');
    } else {
      // Cache miss - query Salesforce
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

      contact = contactData.records[0];
      
      // Cache the contact
      setCache(contactCacheKey, contact, {
        objectType: 'Contact',
        cachedAt: new Date().toISOString(),
      }, context).catch(err => console.warn('⚠️ Failed to cache contact:', err.message));
    }
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
    const requirementsStats = await getRequirementsStatsForUser(userId, access_token, instance_url, context);

    // Step 3: Fetch OKRs with pagination
    const okrData = await getOKRsForUser(userId, access_token, instance_url, okrOffset, okrLimit, context);

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
 * Uses cache first to reduce API calls
 * @param {object} context - Netlify function context (required for Blobs)
 */
async function getRequirementsStatsForUser(userId, access_token, instance_url, context) {
  try {
    // Try to get all requirements from cache
    const allRequirementsKey = getListCacheKey('Requirement__c', 'all');
    const cached = await getCache(allRequirementsKey, CACHE_TTLS['Requirement__c'], context);
    
    if (cached && cached.data && Array.isArray(cached.data)) {
      // Filter requirements by OwnerId from cache
      const userRequirements = cached.data.filter(req => req.OwnerId === userId);
      
      let completed = 0;
      let inProgress = 0;
      let total = userRequirements.length;

      userRequirements.forEach(record => {
        const status = (record.Status__c || '').toLowerCase();
        if (status === 'completed' || status === 'done' || status === 'closed') {
          completed++;
        } else if (status === 'in progress' || status === 'in-progress' || status === 'working') {
          inProgress++;
        }
      });

      console.log('✅ Got requirements stats from cache');
      return { completed, inProgress, total };
    }
    
    // Cache miss - query Salesforce
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
 * Uses cache first to reduce API calls
 * @param {object} context - Netlify function context (required for Blobs)
 */
async function getOKRsForUser(userId, access_token, instance_url, offset = 0, limit = 50, context) {
  try {
    // Try to get all OKRs from cache
    const allOKRsKey = getListCacheKey('OKR__c', 'all');
    const cached = await getCache(allOKRsKey, CACHE_TTLS['OKR__c'], context);
    
    let parentOkrs = [];
    let childOkrs = [];
    let total = 0;
    let fromCache = false;
    
    if (cached && cached.data && Array.isArray(cached.data)) {
      // Filter OKRs by Owner__c from cache
      const userOKRs = cached.data.filter(okr => okr.Owner__c === userId);
      total = userOKRs.length;
      
      // Separate parent and child OKRs
      const allParentOkrs = userOKRs.filter(okr => !okr.Parent_Objective__c);
      childOkrs = userOKRs.filter(okr => okr.Parent_Objective__c);
      
      // Sort parent OKRs by Quarter and CreatedDate (descending)
      allParentOkrs.sort((a, b) => {
        const quarterCompare = (b.Quarter__c || '').localeCompare(a.Quarter__c || '');
        if (quarterCompare !== 0) return quarterCompare;
        const dateA = new Date(a.CreatedDate || 0);
        const dateB = new Date(b.CreatedDate || 0);
        return dateB - dateA;
      });
      
      // Apply pagination
      parentOkrs = allParentOkrs.slice(offset, offset + limit);
      fromCache = true;
      console.log('✅ Got OKRs from cache');
    }
    
    // If cache miss or insufficient data, query Salesforce
    if (!fromCache || parentOkrs.length === 0) {
      const escapedUserId = userId.replace(/'/g, "\\'");
      
      // First, get total count
      const countQuery = `SELECT COUNT() FROM OKR__c WHERE Owner__c = '${escapedUserId}'`;
      const countEncoded = encodeURIComponent(countQuery);
      const countUrl = `${instance_url}/services/data/v58.0/query/?q=${countEncoded}`;

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
      const okrFields = 'Id, Name, Owner__c, Type__c, Status__c, Parent_Objective__c, Due_Date__c, Department__c, Quarter__c, Progress__c, Weight__c, Overall_Health__c, Comments__c, CreatedDate';
      let okrQuery = `SELECT ${okrFields} FROM OKR__c WHERE Owner__c = '${escapedUserId}' AND Parent_Objective__c = null ORDER BY Quarter__c DESC, CreatedDate DESC LIMIT ${limit} OFFSET ${offset}`;
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
      parentOkrs = okrData.records || [];

    // Fetch child OKRs for the parent OKRs we got
    if (parentOkrs.length > 0 && !fromCache) {
      const parentOkrIds = parentOkrs.map(okr => okr.Id);
      const escapedParentIds = parentOkrIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
      const okrFields = 'Id, Name, Owner__c, Type__c, Status__c, Parent_Objective__c, Due_Date__c, Department__c, Quarter__c, Progress__c, Weight__c, Overall_Health__c, Comments__c, CreatedDate';
      const childOkrQuery = `SELECT ${okrFields} FROM OKR__c WHERE Parent_Objective__c IN (${escapedParentIds})`;
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
          
          // Handle pagination for child OKRs if needed
          let nextRecordsUrl = childOkrData.nextRecordsUrl;
          while (nextRecordsUrl) {
            try {
              const nextResponse = await fetch(`${instance_url}${nextRecordsUrl}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (nextResponse.ok) {
                const nextData = await nextResponse.json();
                childOkrs = [...childOkrs, ...(nextData.records || [])];
                nextRecordsUrl = nextData.nextRecordsUrl;
              } else {
                break;
              }
            } catch (nextError) {
              console.warn('Error fetching next child OKR batch:', nextError.message);
              break;
            }
          }
        }
      } catch (e) {
        console.warn('Error fetching child OKRs:', e.message);
      }
    } else if (fromCache && parentOkrs.length > 0) {
      // Filter child OKRs from cache for these parent IDs
      const parentOkrIds = new Set(parentOkrs.map(okr => okr.Id));
      childOkrs = childOkrs.filter(okr => parentOkrIds.has(okr.Parent_Objective__c));
    }

    // Group child OKRs by their parent (these are the key results)
    const childOkrsByParent = new Map();
    childOkrs.forEach(childOkr => {
      const parentId = childOkr.Parent_Objective__c;
      if (parentId) {
        if (!childOkrsByParent.has(parentId)) {
          childOkrsByParent.set(parentId, []);
        }
        childOkrsByParent.get(parentId).push(childOkr);
      }
    });

    // Build OKR objects - map from specific fields only
    const allOkrs = [...parentOkrs, ...childOkrs];
    const okrObjects = allOkrs.map((okr) => {
      // Get key results for this parent OKR (child OKRs where Parent_Objective__c = this OKR's Id)
      const keyResultsForThisOkr = childOkrsByParent.get(okr.Id) || [];
      const mappedKeyResults = keyResultsForThisOkr.map(childOkr => ({
        id: childOkr.Id,
        name: childOkr.Name || '',
        description: childOkr.Comments__c || childOkr.Name || '',
        target: 0, // Not applicable for OKR-style key results
        currentValue: 0, // Not applicable for OKR-style key results
        progress: childOkr.Progress__c || 0,
        status: childOkr.Status__c || 'In Progress',
        unit: '', // Not applicable for OKR-style key results
        createdDate: childOkr.CreatedDate || '',
      }));

      return {
        id: okr.Id,
        name: okr.Name || '',
        objective: okr.Name || '', // Use Name as objective if Objective__c is not available
        status: okr.Status__c || 'Active',
        progress: okr.Progress__c || 0,
        period: okr.Quarter__c || '',
        year: new Date().getFullYear(), // Default to current year if Year__c not available
        startDate: null, // Not in requested fields
        endDate: okr.Due_Date__c || null, // Map Due_Date__c to endDate
        createdDate: okr.CreatedDate || '',
        parentObjectiveId: okr.Parent_Objective__c || null,
        keyResults: mappedKeyResults,
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
 * NOTE: Key Results are child OKR__c records where Parent_Objective__c points to the parent OKR
 * This function is deprecated - key results are now fetched as child OKRs directly
 * Keeping as stub for backward compatibility
 */
async function getKeyResultsForOKR(okrId, access_token, instance_url) {
  // Key results are child OKR__c records, not a separate object
  // This function is kept for backward compatibility but returns empty array
  // Key results should be fetched as child OKRs in the main query
  console.warn('getKeyResultsForOKR called - key results should be fetched as child OKR__c records');
  return [];
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

