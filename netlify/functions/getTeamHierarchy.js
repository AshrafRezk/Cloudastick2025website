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
 * Get OKRs for multiple users (batch)
 * Uses Owner__c field (lookup to User) on OKR__c
 * Simple direct query: SELECT FIELDS(ALL) FROM OKR__c WHERE Owner__c IN (userIds)
 * Returns Map<UserId, OKR[]> where OKRs include children
 */
async function getOKRsForUsers(userIds, contactIds, contactToUserMap, access_token, instance_url) {
  const okrsMap = new Map();
  
  try {
    if (!userIds || userIds.length === 0) {
      console.log('⚠️ No user IDs provided for OKR fetching');
      return okrsMap;
    }

    console.log(`📊 Fetching OKRs for ${userIds.length} users`);
    console.log(`   User IDs:`, userIds.slice(0, 5).join(', '), userIds.length > 5 ? `... (${userIds.length} total)` : '');

    // Initialize map with empty arrays for all users
    userIds.forEach(userId => {
      okrsMap.set(userId, []);
    });

    // Escape user IDs for SOQL
    const escapedUserIds = userIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
    
    // Simple direct query: SELECT FIELDS(ALL) FROM OKR__c WHERE Owner__c IN (userIds)
    const okrQuery = `SELECT FIELDS(ALL) FROM OKR__c WHERE Owner__c IN (${escapedUserIds}) `;
    const okrEncoded = encodeURIComponent(okrQuery);
    const okrUrl = `${instance_url}/services/data/v58.0/query/?q=${okrEncoded}`;

    console.log(`🔍 Querying OKRs: SELECT FIELDS(ALL) FROM OKR__c WHERE Owner__c IN (${userIds.length} user IDs)`);
    console.log(`📝 Full query: ${okrQuery}`);

    let allOkrs = [];

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
        allOkrs = okrData.records || [];

        console.log(`✅ Query successful: Found ${allOkrs.length} OKRs`);
        if (allOkrs.length > 0) {
          console.log(`📋 Sample OKR Owner__c:`, allOkrs[0].Owner__c);
          console.log(`📋 Sample OKR Name:`, allOkrs[0].Name);
          console.log(`📋 Sample OKR fields:`, Object.keys(allOkrs[0]).slice(0, 10).join(', '));
        } else {
          console.log(`⚠️ Query returned 0 OKRs. Checking if OKR__c object exists and has records...`);
          
          // Diagnostic query to see if OKRs exist at all
          const diagnosticQuery = `SELECT COUNT() FROM OKR__c`;
          const diagnosticEncoded = encodeURIComponent(diagnosticQuery);
          const diagnosticUrl = `${instance_url}/services/data/v58.0/query/?q=${diagnosticEncoded}`;
          
          try {
            const diagnosticResponse = await fetch(diagnosticUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (diagnosticResponse.ok) {
              const diagnosticData = await diagnosticResponse.json();
              console.log(`📊 Total OKRs in system: ${diagnosticData.totalSize || 0}`);
              
              // Also check a sample OKR to see Owner__c values
              const sampleQuery = `SELECT Id, Name, Owner__c FROM OKR__c LIMIT 5`;
              const sampleEncoded = encodeURIComponent(sampleQuery);
              const sampleUrl = `${instance_url}/services/data/v58.0/query/?q=${sampleEncoded}`;
              
              const sampleResponse = await fetch(sampleUrl, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (sampleResponse.ok) {
                const sampleData = await sampleResponse.json();
                const samples = sampleData.records || [];
                if (samples.length > 0) {
                  console.log(`📋 Sample OKR Owner__c values:`, samples.map(okr => okr.Owner__c).join(', '));
                  console.log(`📋 User IDs we're querying for:`, userIds.slice(0, 5).join(', '));
                  const sampleOwner = samples[0].Owner__c;
                  const matches = userIds.includes(sampleOwner);
                  console.log(`📋 Match check (first sample vs our user IDs): ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
                }
              }
            }
          } catch (diagError) {
            console.warn('⚠️ Diagnostic query failed:', diagError.message);
          }
        }
      } else {
        const errorText = await okrResponse.text();
        console.error(`❌ Failed to query OKR__c: ${okrResponse.status} - ${errorText.substring(0, 500)}`);
        return okrsMap;
      }
    } catch (queryError) {
      console.error(`❌ Error querying OKR__c:`, queryError.message);
      return okrsMap;
    }

    if (allOkrs.length === 0) {
      console.log('⚠️ No OKRs found for any users');
      return okrsMap;
    }

    console.log(`✅ Found ${allOkrs.length} total parent OKRs across all users`);

    // Collect all parent OKR IDs
    const parentOkrIds = allOkrs.map(okr => okr.Id);
    console.log(`📋 Parent OKR IDs: ${parentOkrIds.length}`);

    // Fetch child OKRs (child objectives) where Parent_Objective__c points to parent OKRs
    let childOkrs = [];
    if (parentOkrIds.length > 0) {
      const escapedParentIds = parentOkrIds.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
      const childOkrQuery = `SELECT FIELDS(ALL) FROM OKR__c WHERE Parent_Objective__c IN (${escapedParentIds}) `;
      const childOkrEncoded = encodeURIComponent(childOkrQuery);
      const childOkrUrl = `${instance_url}/services/data/v58.0/query/?q=${childOkrEncoded}`;

      console.log(`🔍 Fetching child OKRs: SELECT FIELDS(ALL) FROM OKR__c WHERE Parent_Objective__c IN (${parentOkrIds.length} parent IDs)`);

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
          console.log(`✅ Found ${childOkrs.length} child OKRs`);
        } else {
          const errorText = await childOkrResponse.text();
          console.warn(`⚠️ Failed to fetch child OKRs: ${childOkrResponse.status} - ${errorText.substring(0, 200)}`);
        }
      } catch (childError) {
        console.warn(`⚠️ Error fetching child OKRs:`, childError.message);
      }
    }

    // Combine parent and child OKRs
    const allOkrsWithChildren = [...allOkrs, ...childOkrs];
    console.log(`📊 Total OKRs (parent + child): ${allOkrsWithChildren.length}`);

    // Fetch key results for all OKRs (parent + child) in parallel
    const keyResultsPromises = allOkrsWithChildren.map(okr => 
      getKeyResultsForOKR(okr.Id, access_token, instance_url)
    );
    const allKeyResults = await Promise.all(keyResultsPromises);

    // Build OKR objects with key results
    // Owner__c is the lookup field to User - use it directly
    const okrObjects = allOkrsWithChildren.map((okr, index) => {
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
        ownerId: okr.Owner__c, // Owner__c is the lookup to User
        parentObjectiveId: okr.Parent_Objective__c || null,
        keyResults: allKeyResults[index] || [],
        children: [], // Will be populated below
      };
    });

    // Build hierarchy: group OKRs by owner and establish parent-child relationships
    const okrIdToOkr = new Map();
    okrObjects.forEach(okr => {
      okrIdToOkr.set(okr.id, okr);
    });

    // Group by owner and build parent-child relationships
    okrObjects.forEach(okr => {
      const userId = okr.ownerId;
      
      if (!userId) {
        console.warn(`⚠️ OKR ${okr.id} has no Owner__c value`);
        return; // Skip OKRs without owner
      }
      
      if (!okrsMap.has(userId)) {
        okrsMap.set(userId, []);
      }

      // If this OKR has a parent, add it as a child to the parent
      if (okr.parentObjectiveId && okrIdToOkr.has(okr.parentObjectiveId)) {
        const parent = okrIdToOkr.get(okr.parentObjectiveId);
        // Remove temporary fields before adding as child
        const { ownerId, parentObjectiveId, ...cleanOkr } = okr;
        parent.children.push(cleanOkr);
      } else {
        // This is a top-level OKR (no parent), add it to the user's list
        // Remove temporary fields
        const { ownerId, parentObjectiveId, ...cleanOkr } = okr;
        okrsMap.get(userId).push(cleanOkr);
      }
    });

    return okrsMap;

  } catch (error) {
    console.error('Error fetching OKRs:', error);
    return okrsMap;
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

