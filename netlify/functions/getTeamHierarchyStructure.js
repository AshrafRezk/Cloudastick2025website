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

    // Step 2: Collect all contacts in the hierarchy (structure only)
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

