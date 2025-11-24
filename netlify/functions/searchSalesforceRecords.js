/**
 * Netlify Function to search Salesforce records
 * Supports searching Opportunities, Projects (SFDC_Project__c), and Accounts
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
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
    const { access_token, instance_url, searchTerm, objectType } = JSON.parse(event.body || '{}');

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

    if (!searchTerm || searchTerm.trim().length < 2) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Search term must be at least 2 characters' }),
      };
    }

    // Validate object type
    const validObjectTypes = ['Opportunity', 'SFDC_Project__c', 'Account'];
    if (!objectType || !validObjectTypes.includes(objectType)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid object type. Must be Opportunity, SFDC_Project__c, or Account' }),
      };
    }

    console.log(`🔍 Searching ${objectType} for: "${searchTerm}"`);

    // Build SOQL query based on object type
    let soqlQuery = '';
    const escapedSearchTerm = searchTerm.replace(/'/g, "\\'");

    if (objectType === 'Opportunity') {
      soqlQuery = `SELECT Id, Name, AccountId, Account.Name, CloseDate, StageName, Amount FROM Opportunity WHERE Name LIKE '%${escapedSearchTerm}%' OR Account.Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
    } else if (objectType === 'SFDC_Project__c') {
      // Adjust field names based on your custom object structure
      soqlQuery = `SELECT Id, Name, Account__c, Account__r.Name, Opportunity__c, Opportunity__r.Name FROM SFDC_Project__c WHERE Name LIKE '%${escapedSearchTerm}%' OR (Account__r.Name LIKE '%${escapedSearchTerm}%') OR (Opportunity__r.Name LIKE '%${escapedSearchTerm}%') ORDER BY Name LIMIT 20`;
    } else if (objectType === 'Account') {
      soqlQuery = `SELECT Id, Name, Type, Industry, Website FROM Account WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
    }

    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Salesforce...');

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Salesforce API Error:', errorText);
      throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.records?.length || 0} records`);

    // Transform records to a consistent format
    const records = (data.records || []).map((record) => {
      if (objectType === 'Opportunity') {
        return {
          id: record.Id,
          name: record.Name,
          type: 'Opportunity',
          accountName: record.Account?.Name || '',
          accountId: record.AccountId || '',
          additionalInfo: `Stage: ${record.StageName || 'N/A'} | Close Date: ${record.CloseDate || 'N/A'}`,
        };
      } else if (objectType === 'SFDC_Project__c') {
        return {
          id: record.Id,
          name: record.Name,
          type: 'Project',
          accountName: record.Account__r?.Name || '',
          accountId: record.Account__c || '',
          opportunityName: record.Opportunity__r?.Name || '',
          opportunityId: record.Opportunity__c || '',
          additionalInfo: record.Account__r?.Name ? `Account: ${record.Account__r.Name}` : '',
        };
      } else if (objectType === 'Account') {
        return {
          id: record.Id,
          name: record.Name,
          type: 'Account',
          accountName: record.Name,
          additionalInfo: `${record.Type || 'N/A'} | ${record.Industry || 'N/A'}`,
        };
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        records,
        totalSize: data.totalSize || 0,
      }),
    };

  } catch (error) {
    console.error('❌ Search Salesforce Records Function Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to search Salesforce records',
        message: error.message,
      }),
    };
  }
};

