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
    console.log(`📋 Instance URL: ${instance_url}`);
    console.log(`🔑 Access Token: ${access_token.substring(0, 10)}...`);

    // Build SOQL query based on object type
    // Escape special SOQL characters to prevent injection
    const escapedSearchTerm = searchTerm
      .replace(/'/g, "\\'")
      .replace(/\\/g, '\\\\')
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_');
    
    let soqlQuery = '';

    if (objectType === 'Opportunity') {
      // Use AccountId check to avoid null reference errors
      soqlQuery = `SELECT Id, Name, AccountId, Account.Name, CloseDate, StageName, Amount FROM Opportunity WHERE (Name LIKE '%${escapedSearchTerm}%' OR (AccountId != null AND Account.Name LIKE '%${escapedSearchTerm}%')) ORDER BY Name LIMIT 20`;
    } else if (objectType === 'SFDC_Project__c') {
      // Try to query with relationship fields, but handle if they don't exist
      // First try with all fields, if it fails, we'll fall back to basic query
      soqlQuery = `SELECT Id, Name, Account__c, Account__r.Name, Opportunity__c, Opportunity__r.Name FROM SFDC_Project__c WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
    } else if (objectType === 'Account') {
      soqlQuery = `SELECT Id, Name, Type, Industry, Website FROM Account WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
    }

    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Salesforce...');
    console.log('📝 SOQL Query:', soqlQuery);

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
      
      // Try to parse Salesforce error response
      let errorMessage = `Salesforce API error: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        if (errorData[0] && errorData[0].message) {
          errorMessage = errorData[0].message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If parsing fails, use the raw error text
        errorMessage = errorText;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('No such column') || errorMessage.includes('INVALID_FIELD')) {
        // Field doesn't exist - try simpler query for SFDC_Project__c
        if (objectType === 'SFDC_Project__c') {
          console.log('⚠️ Field not found, trying simplified query...');
          const simpleQuery = `SELECT Id, Name FROM SFDC_Project__c WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
          const simpleEncodedQuery = encodeURIComponent(simpleQuery);
          const simpleQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${simpleEncodedQuery}`;
          
          const simpleResponse = await fetch(simpleQueryUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (simpleResponse.ok) {
            const simpleData = await simpleResponse.json();
            const records = (simpleData.records || []).map((record) => ({
              id: record.Id,
              name: record.Name,
              type: 'Project',
              accountName: '',
              accountId: '',
              additionalInfo: 'Limited fields available',
            }));
            
            return {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                success: true,
                records,
                totalSize: simpleData.totalSize || 0,
                warning: 'Some fields are not accessible',
              }),
            };
          }
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.records?.length || 0} records`);

    // Transform records to a consistent format
    const records = (data.records || []).map((record) => {
      try {
        if (objectType === 'Opportunity') {
          // Salesforce returns Account as an object with Name property
          const accountName = record.Account ? (record.Account.Name || '') : '';
          return {
            id: record.Id,
            name: record.Name || '',
            type: 'Opportunity',
            accountName: accountName,
            accountId: record.AccountId || '',
            additionalInfo: `Stage: ${record.StageName || 'N/A'} | Close Date: ${record.CloseDate || 'N/A'}`,
          };
        } else if (objectType === 'SFDC_Project__c') {
          // Handle relationship fields - they may not exist
          const accountName = record.Account__r ? (record.Account__r.Name || '') : '';
          const opportunityName = record.Opportunity__r ? (record.Opportunity__r.Name || '') : '';
          return {
            id: record.Id,
            name: record.Name || '',
            type: 'Project',
            accountName: accountName,
            accountId: record.Account__c || '',
            opportunityName: opportunityName,
            opportunityId: record.Opportunity__c || '',
            additionalInfo: accountName ? `Account: ${accountName}` : (opportunityName ? `Opportunity: ${opportunityName}` : ''),
          };
        } else if (objectType === 'Account') {
          return {
            id: record.Id,
            name: record.Name || '',
            type: 'Account',
            accountName: record.Name || '',
            additionalInfo: `${record.Type || 'N/A'} | ${record.Industry || 'N/A'}`,
          };
        }
      } catch (err) {
        console.error('Error transforming record:', err, record);
        return null;
      }
    }).filter(record => record !== null);

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

