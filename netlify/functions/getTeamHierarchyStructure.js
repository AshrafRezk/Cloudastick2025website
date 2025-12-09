/**
 * Netlify Function to fetch Team Hierarchy Structure (Fast)
 * Returns only contact hierarchy structure (names, emails, relationships)
 * No heavy data (OKRs, requirements, team builds)
 * Response time target: <500ms
 * 
 * Uses Netlify Blobs for caching to reduce API calls and provide fallback
 */

const { getStore } = require('@netlify/blobs');

// Cache TTL: 24 hours (team structure changes infrequently)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

    // Check cache first (Netlify Blobs)
    let cacheStore;
    let cachedData = null;
    let isStaleCache = false;
    
    try {
      cacheStore = getStore('team-hierarchy-cache');
      const cacheKey = `structure-${contactId}`;
      const cached = await cacheStore.get(cacheKey, { type: 'json' });
      
      if (cached && cached.data && cached.timestamp) {
        const age = Date.now() - cached.timestamp;
        // Use cache if less than 24 hours old
        if (age < CACHE_TTL) {
          cachedData = cached.data;
          console.log(`✅ Using cached team hierarchy (age: ${Math.round(age / 1000 / 60)} minutes)`);
        } else if (age < CACHE_TTL * 2) {
          // Stale cache (24-48 hours) - use as fallback if API fails
          isStaleCache = true;
          cachedData = cached.data;
          console.log(`⚠️ Found stale cache (age: ${Math.round(age / 1000 / 60 / 60)} hours) - will use as fallback`);
        }
      }
    } catch (cacheError) {
      console.warn('⚠️ Cache check failed (will proceed with API call):', cacheError.message);
    }

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
      let isApiLimitError = false;
      
      try {
        const errorText = await contactResponse.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            const errors = Array.isArray(errorData) ? errorData : [errorData];
            const apiLimitError = errors.find(e => e.errorCode === 'REQUEST_LIMIT_EXCEEDED');
            
            if (apiLimitError) {
              isApiLimitError = true;
              errorMessage = 'TotalRequests Limit exceeded.';
            } else {
              errorMessage = errorData.message || errors[0]?.message || errorMessage;
            }
            console.error('❌ Contact query error details:', JSON.stringify(errorData));
          } catch (e) {
            errorMessage = errorText.substring(0, 500) || errorMessage;
          }
        }
      } catch (e) {
        console.error('❌ Error parsing contact response:', e);
      }
      
      // If API limit exceeded and we have cached data, return stale cache
      if (isApiLimitError && cachedData) {
        console.log('⚠️ API limit exceeded - returning stale cache');
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600',
            'X-Cache-Status': 'stale-fallback',
          },
          body: JSON.stringify({
            success: true,
            data: cachedData,
            metadata: {
              ...(cachedData.metadata || {}),
              cached: true,
              stale: true,
              warning: 'API limit exceeded - showing cached data. Some information may be outdated.',
            },
          }),
        };
      }
      
      return {
        statusCode: isApiLimitError ? 403 : contactResponse.status === 403 ? 403 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to fetch contact',
          message: errorMessage,
          statusCode: contactResponse.status,
          suggestion: isApiLimitError
            ? 'Salesforce API daily limit has been reached. Please try again later.'
            : contactResponse.status === 403 
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
    const managerIdsToFetch = [];
    const visitedIds = new Set([contactId]); // Prevent cycles
    let currentManagerId = currentContact.ReportsToId;

    // Collect all manager IDs we need to fetch
    while (currentManagerId && !visitedIds.has(currentManagerId)) {
      visitedIds.add(currentManagerId);
      managerIdsToFetch.push(currentManagerId);
      // We need to fetch these managers first to get their ReportsToId
      // So we'll break here and fetch in batches
      break; // Fetch first batch, then continue if needed
    }

    // Batch query all managers at once, following the chain
    const managers = [];
    let managerIds = [...managerIdsToFetch];
    
    // Follow manager chain iteratively (batch by batch)
    while (managerIds.length > 0) {
      // Fetch managers in batches of 500 (Salesforce limit)
      const batchSize = 500;
      const nextLevelManagerIds = [];
      
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
            
            // Collect next level manager IDs
            if (manager.ReportsToId && !visitedIds.has(manager.ReportsToId)) {
              visitedIds.add(manager.ReportsToId);
              nextLevelManagerIds.push(manager.ReportsToId);
            }
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
                  
                  // Collect next level manager IDs
                  if (manager.ReportsToId && !visitedIds.has(manager.ReportsToId)) {
                    visitedIds.add(manager.ReportsToId);
                    nextLevelManagerIds.push(manager.ReportsToId);
                  }
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
      
      // Continue with next level if any managers found
      managerIds = nextLevelManagerIds;
      if (managerIds.length === 0) break;
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

    // Save to cache
    if (cacheStore) {
      try {
        const cacheKey = `structure-${contactId}`;
        await cacheStore.setJSON(cacheKey, {
          data: structure,
          timestamp: Date.now(),
          metadata: {
            totalContacts: allContacts.length,
            loadedAt: new Date().toISOString(),
          },
        });
        console.log('💾 Saved team hierarchy to cache');
      } catch (cacheError) {
        console.warn('⚠️ Failed to save to cache:', cacheError.message);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
      body: JSON.stringify({
        success: true,
        data: structure,
        metadata: {
          totalContacts: allContacts.length,
          loadedAt: new Date().toISOString(),
          cached: false,
        },
      }),
    };

  } catch (error) {
    console.error('❌ Error fetching team hierarchy structure:', error);
    
    // Check if it's an API limit error
    const errorMessage = error.message || 'An unexpected error occurred';
    const isApiLimitError = errorMessage.includes('REQUEST_LIMIT_EXCEEDED') || 
                           errorMessage.includes('TotalRequests Limit exceeded') ||
                           errorMessage.includes('REQUEST_LIMIT_EXCEEDED');
    
    // If API limit exceeded and we have cached data, return stale cache
    if (isApiLimitError && cachedData) {
      console.log('⚠️ API limit exceeded - returning stale cache from catch block');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          'X-Cache-Status': 'stale-fallback',
        },
        body: JSON.stringify({
          success: true,
          data: cachedData,
          metadata: {
            ...(cachedData.metadata || {}),
            cached: true,
            stale: true,
            warning: 'API limit exceeded - showing cached data. Some information may be outdated.',
          },
        }),
      };
    }
    
    return {
      statusCode: isApiLimitError ? 403 : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch team hierarchy structure',
        message: isApiLimitError ? 'TotalRequests Limit exceeded.' : errorMessage,
        errorCode: isApiLimitError ? 'REQUEST_LIMIT_EXCEEDED' : undefined,
        suggestion: isApiLimitError 
          ? 'Salesforce API daily limit has been reached. Please try again later or contact your administrator.'
          : 'An unexpected error occurred. Please try again.',
      }),
    };
  }
};

