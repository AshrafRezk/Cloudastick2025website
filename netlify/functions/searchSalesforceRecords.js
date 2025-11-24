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
    // Parse request body with error handling
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid request body. Expected JSON.' }),
      };
    }

    const { access_token, instance_url, searchTerm, objectType } = requestData;

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
    // For LIKE queries, we need to escape single quotes and backslashes
    // We escape % and _ to prevent wildcard injection, but users can still use them if needed
    const escapedSearchTerm = searchTerm
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/'/g, "\\'")     // Escape single quotes
      .replace(/%/g, '\\%')     // Escape % wildcards
      .replace(/_/g, '\\_');    // Escape _ wildcards
    
    let soqlQuery = '';

    if (objectType === 'Opportunity') {
      // Use AccountId check to avoid null reference errors
      // Include Account Industry and Website for auto-population
      soqlQuery = `SELECT Id, Name, AccountId, Account.Name, Account.Industry, Account.Website, CloseDate, StageName, Amount FROM Opportunity WHERE (Name LIKE '%${escapedSearchTerm}%' OR (AccountId != null AND Account.Name LIKE '%${escapedSearchTerm}%')) ORDER BY Name LIMIT 20`;
    } else if (objectType === 'SFDC_Project__c') {
      // Try to query with relationship fields, but handle if they don't exist
      // Include Account Industry and Website for auto-population
      soqlQuery = `SELECT Id, Name, Account__c, Account__r.Name, Account__r.Industry, Account__r.Website, Opportunity__c, Opportunity__r.Name FROM SFDC_Project__c WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
    } else if (objectType === 'Account') {
      soqlQuery = `SELECT Id, Name, Type, Industry, Website FROM Account WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
    }

    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Salesforce...');
    console.log('📝 SOQL Query:', soqlQuery);

    let response;
    try {
      response = await fetch(queryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (fetchError) {
      console.error('❌ Network error fetching from Salesforce:', fetchError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to connect to Salesforce',
          message: fetchError.message || 'Network error occurred',
        }),
      };
    }

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (textError) {
        console.error('❌ Failed to read error response:', textError);
        errorText = `HTTP ${response.status}: ${response.statusText}`;
      }
      
      console.error('❌ Salesforce API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 500), // Limit log size
      });
      
      // Try to parse Salesforce error response
      let errorMessage = `Salesforce API error: ${response.status}`;
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          if (Array.isArray(errorData) && errorData[0] && errorData[0].message) {
            errorMessage = errorData[0].message;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch (parseError) {
          // If parsing fails, use the raw error text (truncated if too long)
          errorMessage = errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText;
        }
      }
      
      // Handle specific error cases - check for field-related errors
      // Salesforce can return various error formats for missing fields
      const isFieldError = errorMessage.includes('No such column') || 
                          errorMessage.includes('INVALID_FIELD') ||
                          errorMessage.includes('field does not exist') ||
                          errorMessage.includes('sObject type') ||
                          (errorMessage.includes('Account__r') || errorMessage.includes('Opportunity__r'));
      
      if (isFieldError) {
        // Field doesn't exist - try simpler query for SFDC_Project__c
        if (objectType === 'SFDC_Project__c') {
          console.log('⚠️ Field not found, trying simplified query...');
          const simpleQuery = `SELECT Id, Name FROM SFDC_Project__c WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
          const simpleEncodedQuery = encodeURIComponent(simpleQuery);
          const simpleQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${simpleEncodedQuery}`;
          
          let simpleResponse;
          try {
            simpleResponse = await fetch(simpleQueryUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
          } catch (fetchError) {
            console.error('❌ Network error on simplified query:', fetchError);
            // Fall through to return the original error
          }
          
          if (simpleResponse && simpleResponse.ok) {
            let simpleData;
            try {
              const simpleResponseText = await simpleResponse.text();
              simpleData = JSON.parse(simpleResponseText);
            } catch (parseError) {
              console.error('❌ Failed to parse simplified query response:', parseError);
              // Fall through to return the original error
            }
            
            if (simpleData) {
            const records = (simpleData.records || []).map((record) => ({
              id: record.Id,
              name: record.Name,
              type: 'Project',
              accountName: '',
              accountId: '',
              accountIndustry: '',
              accountWebsite: '',
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
      
      // Return error response instead of throwing
      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Salesforce API error',
          message: errorMessage,
        }),
      };
    }

    // Parse successful response
    let data;
    try {
      const responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse Salesforce response:', parseError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to parse Salesforce response',
          message: 'Invalid JSON response from Salesforce API',
        }),
      };
    }
    
    console.log(`✅ Found ${data.records?.length || 0} records`);

    // Transform records to a consistent format
    const records = (data.records || []).map((record) => {
      try {
        if (objectType === 'Opportunity') {
          // Salesforce returns Account as an object with Name, Industry, Website properties
          const accountName = record.Account ? (record.Account.Name || '') : '';
          const accountIndustry = record.Account ? (record.Account.Industry || '') : '';
          const accountWebsite = record.Account ? (record.Account.Website || '') : '';
          return {
            id: record.Id,
            name: record.Name || '',
            type: 'Opportunity',
            accountName: accountName,
            accountId: record.AccountId || '',
            accountIndustry: accountIndustry,
            accountWebsite: accountWebsite,
            additionalInfo: `Stage: ${record.StageName || 'N/A'} | Close Date: ${record.CloseDate || 'N/A'}`,
          };
        } else if (objectType === 'SFDC_Project__c') {
          // Handle relationship fields - they may not exist
          const accountName = record.Account__r ? (record.Account__r.Name || '') : '';
          const accountIndustry = record.Account__r ? (record.Account__r.Industry || '') : '';
          const accountWebsite = record.Account__r ? (record.Account__r.Website || '') : '';
          const opportunityName = record.Opportunity__r ? (record.Opportunity__r.Name || '') : '';
          return {
            id: record.Id,
            name: record.Name || '',
            type: 'Project',
            accountName: accountName,
            accountId: record.Account__c || '',
            accountIndustry: accountIndustry,
            accountWebsite: accountWebsite,
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
            accountIndustry: record.Industry || '',
            accountWebsite: record.Website || '',
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

