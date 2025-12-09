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

    // Step 2: Collect all contacts in the hierarchy
    const allContacts = [currentContact];
    const contactIdToContact = new Map();
    contactIdToContact.set(currentContact.Id, currentContact);

    // Build hierarchy up (managers)
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
          const manager = managerData.records[0];
          managers.push(manager);
          allContacts.push(manager);
          contactIdToContact.set(manager.Id, manager);
          currentManagerId = manager.ReportsToId;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Step 3: Collect all subordinates recursively
    const collectSubordinates = async (parentId, depth = 0) => {
      if (depth > 10) return; // Prevent infinite recursion

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
        return;
      }

      const subordinatesData = await subordinatesResponse.json();
      const directSubordinates = subordinatesData.records || [];

      // Add to all contacts and recursively collect their subordinates
      for (const sub of directSubordinates) {
        allContacts.push(sub);
        contactIdToContact.set(sub.Id, sub);
        await collectSubordinates(sub.Id, depth + 1);
      }
    };

    await collectSubordinates(contactId);

    // Step 4: Build User-to-Contact map
    const userToContactsMap = new Map();
    allContacts.forEach(contact => {
      if (contact.Associated_User__c) {
        if (!userToContactsMap.has(contact.Associated_User__c)) {
          userToContactsMap.set(contact.Associated_User__c, []);
        }
        userToContactsMap.get(contact.Associated_User__c).push(contact);
      }
    });

    // Step 5: Batch fetch requirements and OKRs for all users
    const userIds = Array.from(userToContactsMap.keys()).filter(Boolean);
    const contactIds = allContacts.map(c => c.Id).filter(Boolean);
    console.log(`👥 Total contacts: ${allContacts.length}, Unique user IDs: ${userIds.length}`);
    console.log(`👤 User IDs for OKR query:`, userIds.slice(0, 5).join(', '), userIds.length > 5 ? `... (${userIds.length} total)` : '');
    console.log(`👤 Contact IDs for OKR query:`, contactIds.slice(0, 5).join(', '), contactIds.length > 5 ? `... (${contactIds.length} total)` : '');
    
    // Log which contacts have Associated_User__c
    const contactsWithUsers = allContacts.filter(c => c.Associated_User__c);
    const contactsWithoutUsers = allContacts.filter(c => !c.Associated_User__c);
    console.log(`📊 Contacts with Associated_User__c: ${contactsWithUsers.length}, without: ${contactsWithoutUsers.length}`);
    if (contactsWithoutUsers.length > 0) {
      console.log(`⚠️ Contacts without Associated_User__c:`, contactsWithoutUsers.slice(0, 3).map(c => c.Name).join(', '));
    }
    
    // Step 5a: Fetch requirements first
    const requirementsStatsMap = await getRequirementsStatsForUsers(userIds, access_token, instance_url);
    console.log(`✅ Requirements fetched for ${requirementsStatsMap.size} users`);
    
    // Step 5b: Fetch OKRs AFTER requirements, using both user IDs and contact IDs
    // Also build a contact-to-user map for fallback matching
    const contactToUserMap = new Map();
    allContacts.forEach(contact => {
      if (contact.Associated_User__c) {
        contactToUserMap.set(contact.Id, contact.Associated_User__c);
      }
    });
    const okrsMap = await getOKRsForUsers(userIds, contactIds, contactToUserMap, access_token, instance_url);
    console.log(`✅ OKRs fetched for ${okrsMap.size} users`);

    // Step 6: Fetch team builds for all contacts in parallel
    const teamBuildsPromises = allContacts.map(contact => 
      getTeamBuildsForContact(contact.Name, access_token, instance_url)
    );
    const allTeamBuilds = await Promise.all(teamBuildsPromises);
    const contactIdToTeamBuilds = new Map();
    allContacts.forEach((contact, index) => {
      contactIdToTeamBuilds.set(contact.Id, allTeamBuilds[index]);
    });

    // Step 7: Build hierarchy structure with mapped data
    const buildSubordinates = (parentId, depth = 0) => {
      if (depth > 10) return []; // Prevent infinite recursion

      const subordinates = allContacts.filter(c => c.ReportsToId === parentId);
      
      return subordinates.map(sub => {
        const children = buildSubordinates(sub.Id, depth + 1);
        
        // Get team builds from map
        const teamBuilds = contactIdToTeamBuilds.get(sub.Id) || [];
        
        // Get requirements stats from map
        const requirementsStats = requirementsStatsMap.get(sub.Associated_User__c) || { completed: 0, inProgress: 0, total: 0 };
        
        // Get OKRs from map
        const okrs = okrsMap.get(sub.Associated_User__c) || [];
        
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
      });
    };

    const subordinates = buildSubordinates(contactId);

    // Step 8: Enrich current contact with data
    const currentTeamBuilds = contactIdToTeamBuilds.get(currentContact.Id) || [];
    const currentRequirementsStats = requirementsStatsMap.get(currentContact.Associated_User__c) || { completed: 0, inProgress: 0, total: 0 };
    const currentOKRs = okrsMap.get(currentContact.Associated_User__c) || [];
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

    // Fetch team members for each team build
    const teamBuildsWithMembers = await Promise.all(
      teamBuilds.map(async (tb) => {
        // Fetch team members for this team build
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

    return teamBuildsWithMembers;

  } catch (error) {
    console.error('Error fetching team builds:', error);
    return [];
  }
}

/**
 * Get OKR counts for multiple users (batch)
 * Uses Owner__c field (lookup to User) on OKR__c
 * Returns Map<UserId, number> where number is the count of OKRs per user
 * Only fetches counts for performance - full OKR data should be loaded on demand
 */
async function getOKRsForUsers(userIds, contactIds, contactToUserMap, access_token, instance_url) {
  const okrsMap = new Map();
  
  try {
    if (!userIds || userIds.length === 0) {
      console.log('⚠️ No user IDs provided for OKR count fetching');
      return okrsMap;
    }

    console.log(`📊 Fetching OKR counts for ${userIds.length} users`);
    console.log(`   User IDs:`, userIds.slice(0, 5).join(', '), userIds.length > 5 ? `... (${userIds.length} total)` : '');

    // Initialize map with 0 counts for all users
    userIds.forEach(userId => {
      okrsMap.set(userId, []);
    });

    // Query OKR counts per user - batch queries to avoid query length limits
    // Process in batches of 50 users at a time (Salesforce IN clause limit is 500, but we'll be conservative)
    const batchSize = 50;
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batchUserIds = userIds.slice(i, i + batchSize);
      const escapedUserIds = batchUserIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
      
      // Query to get counts grouped by Owner__c
      // Note: We can't directly GROUP BY in SOQL, so we'll use a workaround
      // Query all OKRs for this batch and count them in memory
      const okrQuery = `SELECT Owner__c FROM OKR__c WHERE Owner__c IN (${escapedUserIds})`;
      const okrEncoded = encodeURIComponent(okrQuery);
      const okrUrl = `${instance_url}/services/data/v58.0/query/?q=${okrEncoded}`;

      try {
        const okrResponse = await fetch(okrUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (okrResponse.ok) {
          const okrData = await okrResponse.json();
          const okrs = okrData.records || [];
          
          // Count OKRs per user
          const userCounts = new Map();
          okrs.forEach(okr => {
            const ownerId = okr.Owner__c;
            if (ownerId && batchUserIds.includes(ownerId)) {
              userCounts.set(ownerId, (userCounts.get(ownerId) || 0) + 1);
            }
          });
          
          // Handle pagination if there are more results
          let nextRecordsUrl = okrData.nextRecordsUrl;
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
                const nextOkrs = nextData.records || [];
                
                nextOkrs.forEach(okr => {
                  const ownerId = okr.Owner__c;
                  if (ownerId && batchUserIds.includes(ownerId)) {
                    userCounts.set(ownerId, (userCounts.get(ownerId) || 0) + 1);
                  }
                });
                
                nextRecordsUrl = nextData.nextRecordsUrl;
              } else {
                break;
              }
            } catch (nextError) {
              console.warn(`⚠️ Error fetching next OKR batch:`, nextError.message);
              break;
            }
          }
          
          // Update the map with placeholder arrays of appropriate length for compatibility
          // The arrays are just for length - actual OKR data will be loaded on demand
          userCounts.forEach((count, userId) => {
            okrsMap.set(userId, new Array(count));
          });
          
          console.log(`✅ Processed OKR counts for batch ${Math.floor(i / batchSize) + 1}`);
        } else {
          const errorText = await okrResponse.text();
          console.warn(`⚠️ Failed to query OKR counts for batch: ${okrResponse.status} - ${errorText.substring(0, 200)}`);
        }
      } catch (queryError) {
        console.warn(`⚠️ Error querying OKR counts for batch:`, queryError.message);
      }
    }

    // Log summary
    let totalCount = 0;
    okrsMap.forEach((okrs, userId) => {
      totalCount += okrs.length;
    });
    console.log(`✅ OKR counts fetched: ${totalCount} total OKRs across ${okrsMap.size} users`);

    return okrsMap;

  } catch (error) {
    console.error('Error fetching OKR counts:', error);
    return okrsMap;
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
 * Get requirements statistics for multiple users (batch)
 * Uses OwnerId field (lookup to User) on Requirement__c
 * Returns Map<UserId, RequirementStats>
 */
async function getRequirementsStatsForUsers(userIds, access_token, instance_url) {
  const statsMap = new Map();
  
  try {
    if (!userIds || userIds.length === 0) {
      return statsMap;
    }

    // Initialize map with default stats for all users
    userIds.forEach(userId => {
      statsMap.set(userId, { completed: 0, inProgress: 0, total: 0 });
    });

    // Escape user IDs for SOQL
    const escapedUserIds = userIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
    
    // Query requirements grouped by OwnerId and Status__c
    // Using OwnerId (lookup to User) instead of Associated_User__c
    const requirementsQuery = `SELECT OwnerId, Status__c, COUNT(Id) total FROM Requirement__c WHERE OwnerId IN (${escapedUserIds}) GROUP BY OwnerId, Status__c`;
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
      console.warn('Failed to fetch requirements stats:', requirementsResponse.status);
      return statsMap;
    }

    const requirementsData = await requirementsResponse.json();
    const records = requirementsData.records || [];

    // Process records and aggregate by user
    records.forEach(record => {
      const userId = record.OwnerId;
      const count = record.total || 0;
      
      if (!statsMap.has(userId)) {
        statsMap.set(userId, { completed: 0, inProgress: 0, total: 0 });
      }
      
      const stats = statsMap.get(userId);
      stats.total += count;
      
      const status = (record.Status__c || '').toLowerCase();
      if (status === 'completed' || status === 'done' || status === 'closed') {
        stats.completed += count;
      } else if (status === 'in progress' || status === 'in-progress' || status === 'working') {
        stats.inProgress += count;
      }
    });

    return statsMap;

  } catch (error) {
    console.error('Error fetching requirements stats:', error);
    return statsMap;
  }
}

