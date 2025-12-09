/**
 * Netlify Function for Contact Portal Login
 * Authenticates portal users by validating Portal_Username__c and Portal_Password__c
 * Uses cache first to reduce API calls
 * 
 * Environment variables required:
 * - SALESFORCE_CLIENT_ID
 * - SALESFORCE_CLIENT_SECRET
 * - SALESFORCE_TOKEN_URL
 */

const {
  getCache,
  setCache,
  getCacheKey,
  getListCacheKey,
  simpleHash,
  CACHE_TTLS,
} = require('./salesforceCacheManager');

/**
 * Find Contact by username from cache
 * @param {string} username - Username to search for
 * @param {object} context - Netlify function context (required for Blobs)
 */
async function findContactByUsernameFromCache(username, context) {
  try {
    // Try to get all contacts from cache (if bulk sync has run)
    const allContactsKey = getListCacheKey('Contact', 'all');
    const cached = await getCache(allContactsKey, CACHE_TTLS['Contact'], context);
    
    if (cached && cached.data && Array.isArray(cached.data)) {
      // Search through cached contacts
      const contact = cached.data.find(c => 
        c.Portal_Username__c && c.Portal_Username__c.toLowerCase() === username.toLowerCase()
      );
      
      if (contact) {
        // Get full contact details from individual cache
        const contactCacheKey = getCacheKey('Contact', contact.Id);
        const contactCached = await getCache(contactCacheKey, CACHE_TTLS['Contact'], context);
        if (contactCached && contactCached.data) {
          return contactCached.data;
        }
        return contact;
      }
    }
    
    return null;
  } catch (error) {
    console.warn('⚠️ Error searching cache for contact:', error.message);
    return null;
  }
}

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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('🔐 Contact Login - Authentication request received');

    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Missing credentials',
          message: 'Username and password are required'
        }),
      };
    }

    // First, authenticate with Salesforce to get access token
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

    if (!clientId || !clientSecret || !tokenUrl) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Salesforce credentials not configured'
        }),
      };
    }

    // Get Salesforce access token
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const authResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Salesforce authentication failed: ${authResponse.status} - ${errorText}`);
    }

    const authData = await authResponse.json();
    const { access_token, instance_url } = authData;

    // Try cache first
    let contact = await findContactByUsernameFromCache(username, context);
    let fromCache = !!contact;

    if (!contact) {
      // Cache miss - query Salesforce
      const escapedUsername = username.replace(/'/g, "\\'");
      const soqlQuery = `SELECT Id, Name, Email, Portal_Username__c, Portal_Password__c, Portal_Access__c, Portal_LMS_Access__c, Portal_Sales_Access__c, Portal_CMS_Access__c, Portal_CPM_Access__c, LinkedInURL__c, TrailheadProfileURL__c, NumberofCertifications__c, Certifications_List__c FROM Contact WHERE Portal_Username__c = '${escapedUsername}' LIMIT 1`;
      
      const encodedQuery = encodeURIComponent(soqlQuery);
      const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

      console.log('📤 Querying Contact by username from Salesforce...');

      const queryResponse = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!queryResponse.ok) {
        const errorText = await queryResponse.text();
        throw new Error(`Salesforce query failed: ${queryResponse.status} - ${errorText}`);
      }

      const queryData = await queryResponse.json();
      const records = queryData.records || [];

      if (records.length === 0) {
        return {
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'Invalid credentials',
            message: 'Username not found'
          }),
        };
      }

      contact = records[0];
      
      // Cache the contact for future logins
      if (contact.Id) {
        const contactCacheKey = getCacheKey('Contact', contact.Id);
        setCache(contactCacheKey, contact, {
          objectType: 'Contact',
          cachedAt: new Date().toISOString(),
        }, context).catch(err => console.warn('⚠️ Failed to cache contact:', err.message));
      }
    } else {
      console.log('✅ Found contact in cache');
    }

    // Check if portal is active
    if (!contact.Portal_Access__c) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Portal access disabled',
          message: 'Your portal access has been disabled. Please contact support.'
        }),
      };
    }

    // Check if LMS access is enabled
    if (!contact.Portal_LMS_Access__c) {
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'LMS access not granted',
          message: 'You do not have access to the Learning Management System.'
        }),
      };
    }

    // Compare password (plain text as specified)
    if (contact.Portal_Password__c !== password) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid credentials',
          message: 'Incorrect password'
        }),
      };
    }

    // Return contact data (excluding password)
    const contactData = {
      id: contact.Id,
      name: contact.Name,
      email: contact.Email,
      linkedInUrl: contact.LinkedInURL__c || null,
      trailheadUrl: contact.TrailheadProfileURL__c || null,
      numberOfCertifications: contact.NumberofCertifications__c || 0,
      certificationsList: contact.Certifications_List__c || null,
      portalLMSAccess: contact.Portal_LMS_Access__c || false,
      portalSalesAccess: contact.Portal_Sales_Access__c || false,
      portalCMSAccess: contact.Portal_CMS_Access__c || false,
      portalCPMAccess: contact.Portal_CPM_Access__c || false,
    };

    console.log('✅ Contact login successful:', contactData.name);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true,
        contact: contactData
      }),
    };

  } catch (error) {
    console.error('❌ Contact Login Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Login failed',
        message: errorMessage
      }),
    };
  }
};

