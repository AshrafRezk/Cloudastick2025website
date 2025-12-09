/**
 * Netlify Function to fetch Team Hierarchy Structure (Fast)
 * Returns only contact hierarchy structure (names, emails, relationships)
 * No heavy data (OKRs, requirements, team builds)
 * Response time target: <500ms
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
    console.log('📋 Fetch Team Hierarchy Structure - Request received');

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
      let errorMessage = `Failed to fetch contact: ${contactResponse.status}`;
      try {
        const errorText = await contactResponse.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData[0]?.message || errorMessage;
            // Log the full error for debugging
            console.error('❌ Contact query error details:', JSON.stringify(errorData));
          } catch (e) {
            errorMessage = errorText.substring(0, 500) || errorMessage;
          }
        }
      } catch (e) {
        console.error('❌ Error parsing contact response:', e);
      }
      
      return {
        statusCode: contactResponse.status === 403 ? 403 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to fetch contact',
          message: errorMessage,
          statusCode: contactResponse.status,
          suggestion: contactResponse.status === 403 
            ? 'Check if the user has permission to read Contact records and the ReportsTo.Name field'
            : 'Check the contact ID and try again',
        }),
      };
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

    // Step 2: Collect all contacts in the hierarchy (optimized - batch queries)
    const allContacts = [currentContact];
    const contactIdToContact = new Map();
    contactIdToContact.set(currentContact.Id, currentContact);

    // Build hierarchy up (managers) - collect IDs first, then batch query
    const managerIds = [];
    const visitedIds = new Set([contactId]); // Prevent cycles
    let currentManagerId = currentContact.ReportsToId;

    while (currentManagerId && !visitedIds.has(currentManagerId)) {
      visitedIds.add(currentManagerId);
      managerIds.push(currentManagerId);
      // We'll fetch ReportsToId in batch query, so we need to track it
      currentManagerId = currentManagerId; // Keep for now, will update after batch fetch
    }

    // Batch query all managers at once
    const managers = [];
    if (managerIds.length > 0) {
      // Fetch managers in batches of 500 (Salesforce limit)
      const batchSize = 500;
      for (let i = 0; i < managerIds.length; i += batchSize) {
        const batch = managerIds.slice(i, i + batchSize);
        const escapedIds = batch.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
        const managerQuery = `SELECT Id, Name, Email, ReportsToId, Associated_User__c FROM Contact WHERE Id IN (${escapedIds}) ORDER BY Name`;
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
          const managerRecords = managerData.records || [];
          
          for (const manager of managerRecords) {
            managers.push(manager);
            allContacts.push(manager);
            contactIdToContact.set(manager.Id, manager);
          }

          // Handle pagination if needed
          let nextRecordsUrl = managerData.nextRecordsUrl;
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
                const nextRecords = nextData.records || [];
                for (const manager of nextRecords) {
                  managers.push(manager);
                  allContacts.push(manager);
                  contactIdToContact.set(manager.Id, manager);
                }
                nextRecordsUrl = nextData.nextRecordsUrl;
              } else {
                break;
              }
            } catch (e) {
              console.warn('Error fetching next manager batch:', e.message);
              break;
            }
          }
        }
      }
    }

    // Step 3: Collect all subordinates using iterative batch queries (much more efficient)
    let contactIdsToQuery = [contactId];
    const maxDepth = 10;
    let depth = 0;

    while (contactIdsToQuery.length > 0 && depth < maxDepth) {
      depth++;
      const escapedParentIds = contactIdsToQuery.map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
      
      // Batch query all subordinates at this level
      const subordinatesQuery = `SELECT Id, Name, Email, ReportsToId, Associated_User__c FROM Contact WHERE ReportsToId IN (${escapedParentIds}) ORDER BY Name`;
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
        break;
      }

      const subordinatesData = await subordinatesResponse.json();
      const directSubordinates = subordinatesData.records || [];

      // Handle pagination for subordinates
      let nextRecordsUrl = subordinatesData.nextRecordsUrl;
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
            directSubordinates.push(...(nextData.records || []));
            nextRecordsUrl = nextData.nextRecordsUrl;
          } else {
            break;
          }
        } catch (e) {
          console.warn('Error fetching next subordinates batch:', e.message);
          break;
        }
      }

      // Add to all contacts
      for (const sub of directSubordinates) {
        if (!contactIdToContact.has(sub.Id)) {
          allContacts.push(sub);
          contactIdToContact.set(sub.Id, sub);
        }
      }

      // Get IDs for next level (only if we found subordinates)
      contactIdsToQuery = directSubordinates.map(sub => sub.Id).filter(Boolean);
    }

    // Step 4: Build hierarchy structure (no heavy data)
    const buildSubordinates = (parentId, depth = 0) => {
      if (depth > 10) return []; // Prevent infinite recursion

      const subordinates = allContacts.filter(c => c.ReportsToId === parentId);
      
      return subordinates.map(sub => {
        const children = buildSubordinates(sub.Id, depth + 1);

        return {
          id: sub.Id,
          name: sub.Name,
          email: sub.Email,
          reportsToId: sub.ReportsToId,
          associatedUserId: sub.Associated_User__c,
          subordinates: children,
          // Placeholder data - will be loaded on demand
          teamBuilds: [],
          requirementsStats: { completed: 0, inProgress: 0, total: 0 },
          okrs: [],
          totalAllocationPercentage: 0,
        };
      });
    };

    const subordinates = buildSubordinates(contactId);

    // Build current contact structure
    const structure = {
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
      // Placeholder data - will be loaded on demand
      teamBuilds: [],
      requirementsStats: { completed: 0, inProgress: 0, total: 0 },
      okrs: [],
      totalAllocationPercentage: 0,
    };

    console.log(`✅ Structure fetched: ${allContacts.length} contacts`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      body: JSON.stringify({
        success: true,
        data: structure,
        metadata: {
          totalContacts: allContacts.length,
          loadedAt: new Date().toISOString(),
        },
      }),
    };

  } catch (error) {
    console.error('❌ Error fetching team hierarchy structure:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch team hierarchy structure',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

