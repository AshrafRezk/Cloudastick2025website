/**
 * Netlify Function to search Salesforce records
 * Supports searching Opportunities, Projects (SFDC_Project__c), and Accounts
 * 
 * Note: Uses global fetch (available in Node.js 18+)
 */

/**
 * Check if error indicates object is not supported/accessible
 */
function isObjectNotSupported(errorMessage, objectType) {
  const lowerError = errorMessage.toLowerCase();
  const lowerObjectType = objectType.toLowerCase();
  
  return (
    lowerError.includes('sobject type') && 
    (lowerError.includes('is not supported') || 
     lowerError.includes('is not accessible') ||
     lowerError.includes('not found')) &&
    lowerError.includes(lowerObjectType)
  ) || (
    lowerError.includes('invalid_type') ||
    lowerError.includes('object type') && lowerError.includes('not available')
  );
}

/**
 * Check if error indicates permission/access issue
 */
function isPermissionError(errorMessage) {
  const lowerError = errorMessage.toLowerCase();
  return (
    lowerError.includes('insufficient access') ||
    lowerError.includes('permission denied') ||
    lowerError.includes('access denied') ||
    lowerError.includes('not authorized') ||
    lowerError.includes('forbidden')
  );
}

/**
 * Check if error indicates field-level issue (not object-level)
 */
function isFieldError(errorMessage) {
  const lowerError = errorMessage.toLowerCase();
  return (
    lowerError.includes('no such column') ||
    lowerError.includes('invalid_field') ||
    lowerError.includes('field does not exist') ||
    lowerError.includes('cannot find field')
  );
}

/**
 * Check object availability using Salesforce Describe API
 * Returns { available: boolean, errorCode?: string, message?: string }
 */
async function checkObjectAvailability(instance_url, access_token, objectType) {
  try {
    const describeUrl = `${instance_url}/services/data/v58.0/sobjects/${objectType}/describe`;
    
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    };
    
    // Add timeout if available
    let controller;
    let timeoutId;
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for describe
      fetchOptions.signal = controller.signal;
    }
    
    let response;
    try {
      response = await fetch(describeUrl, fetchOptions);
      if (timeoutId) clearTimeout(timeoutId);
    } catch (fetchErr) {
      if (timeoutId) clearTimeout(timeoutId);
      throw fetchErr;
    }
    
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = `HTTP ${response.status}`;
      }
      
      // Parse error to determine type
      let errorMessage = errorText;
      try {
        const errorData = JSON.parse(errorText);
        if (Array.isArray(errorData) && errorData[0] && errorData[0].message) {
          errorMessage = errorData[0].message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Use raw text
      }
      
      if (isObjectNotSupported(errorMessage, objectType)) {
        return {
          available: false,
          errorCode: 'OBJECT_NOT_SUPPORTED',
          message: errorMessage
        };
      } else if (isPermissionError(errorMessage)) {
        return {
          available: false,
          errorCode: 'INSUFFICIENT_ACCESS',
          message: errorMessage
        };
      } else {
        return {
          available: false,
          errorCode: 'DESCRIBE_ERROR',
          message: errorMessage
        };
      }
    }
    
    // Object is available
    return { available: true };
  } catch (error) {
    console.error('Error checking object availability:', error);
    // If check fails, we'll proceed with the query anyway
    return { available: true, error: error.message };
  }
}

/**
 * Get user-friendly error message based on error type
 */
function getUserFriendlyErrorMessage(errorMessage, objectType, errorCode) {
  const displayName = objectType === 'SFDC_Project__c' ? 'Project' : objectType;
  
  if (errorCode === 'OBJECT_NOT_SUPPORTED') {
    return `The ${displayName} object is not available in your Salesforce org. Please contact your administrator to enable this object or use a different object type.`;
  } else if (errorCode === 'INSUFFICIENT_ACCESS') {
    return `You don't have permission to access ${displayName} records. Please contact your Salesforce administrator to grant read access.`;
  } else if (isObjectNotSupported(errorMessage, objectType)) {
    return `The ${displayName} object is not available in your Salesforce org. Please contact your administrator or use a different object type.`;
  } else if (isPermissionError(errorMessage)) {
    return `You don't have permission to access ${displayName} records. Please contact your Salesforce administrator.`;
  } else {
    return errorMessage;
  }
}

exports.handler = async (event, context) => {
  // Set timeout to prevent hanging (Netlify functions have a 10s default timeout for free tier, 26s for pro)
  context.callbackWaitsForEmptyEventLoop = false;

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

    // Check object availability before querying (optional but recommended for better UX)
    // This helps catch object-level errors early with clearer messages
    console.log(`🔎 Checking ${objectType} availability...`);
    const availabilityCheck = await checkObjectAvailability(instance_url, access_token, objectType);
    
    if (!availabilityCheck.available) {
      const displayName = objectType === 'SFDC_Project__c' ? 'Project' : objectType;
      const userMessage = getUserFriendlyErrorMessage(
        availabilityCheck.message || 'Object not available',
        objectType,
        availabilityCheck.errorCode
      );
      
      console.error(`❌ Object ${objectType} is not available:`, availabilityCheck.errorCode);
      
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Object not available',
          errorCode: availabilityCheck.errorCode || 'OBJECT_NOT_SUPPORTED',
          message: userMessage,
          objectType: objectType,
          suggestedAction: availabilityCheck.errorCode === 'INSUFFICIENT_ACCESS'
            ? 'Contact your Salesforce administrator to grant read permissions for this object.'
            : 'Verify the object exists in your Salesforce org or use a different object type.'
        }),
      };
    }

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
      // Use global fetch (available in Node.js 18+)
      
      // Create abort controller for timeout (if available)
      let controller;
      let timeoutId;
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      };
      
      // Add timeout if AbortController is available
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
        fetchOptions.signal = controller.signal;
      }
      
      try {
        response = await fetch(queryUrl, fetchOptions);
        if (timeoutId) clearTimeout(timeoutId);
      } catch (fetchErr) {
        if (timeoutId) clearTimeout(timeoutId);
        throw fetchErr;
      }
    } catch (fetchError) {
      console.error('❌ Network error fetching from Salesforce:', fetchError);
      const errorMessage = fetchError.name === 'AbortError' || fetchError.message?.includes('timeout')
        ? 'Request timed out. Please try again.'
        : fetchError.message || 'Network error occurred';
      
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to connect to Salesforce',
          message: errorMessage,
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
      
      // Categorize error type
      const objectNotSupported = isObjectNotSupported(errorMessage, objectType);
      const permissionIssue = isPermissionError(errorMessage);
      const fieldIssue = isFieldError(errorMessage);
      
      // Handle object-level errors first (object not supported or permission issues)
      if (objectNotSupported || permissionIssue) {
        const displayName = objectType === 'SFDC_Project__c' ? 'Project' : objectType;
        const errorCode = objectNotSupported ? 'OBJECT_NOT_SUPPORTED' : 'INSUFFICIENT_ACCESS';
        const userMessage = getUserFriendlyErrorMessage(errorMessage, objectType, errorCode);
        
        console.error(`❌ Object-level error for ${objectType}:`, errorCode);
        
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            error: objectNotSupported ? 'Object not supported' : 'Insufficient access',
            errorCode: errorCode,
            message: userMessage,
            objectType: objectType,
            suggestedAction: permissionIssue
              ? 'Contact your Salesforce administrator to grant read permissions for this object.'
              : 'Verify the object exists in your Salesforce org or use a different object type.'
          }),
        };
      }
      
      // Handle field-level errors - try simpler query for SFDC_Project__c
      if (fieldIssue) {
        if (objectType === 'SFDC_Project__c') {
          console.log('⚠️ Field not found, trying simplified query...');
          const simpleQuery = `SELECT Id, Name FROM SFDC_Project__c WHERE Name LIKE '%${escapedSearchTerm}%' ORDER BY Name LIMIT 20`;
          const simpleEncodedQuery = encodeURIComponent(simpleQuery);
          const simpleQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${simpleEncodedQuery}`;
          
          let simpleResponse;
          try {
            const simpleFetchOptions = {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            };
            
            let simpleController;
            let simpleTimeoutId;
            if (typeof AbortController !== 'undefined') {
              simpleController = new AbortController();
              simpleTimeoutId = setTimeout(() => simpleController.abort(), 20000);
              simpleFetchOptions.signal = simpleController.signal;
            }
            
            try {
              simpleResponse = await fetch(simpleQueryUrl, simpleFetchOptions);
              if (simpleTimeoutId) clearTimeout(simpleTimeoutId);
            } catch (simpleFetchErr) {
              if (simpleTimeoutId) clearTimeout(simpleTimeoutId);
              throw simpleFetchErr;
            }
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
      }
      
      // Return structured error response
      const displayName = objectType === 'SFDC_Project__c' ? 'Project' : objectType;
      const errorCode = fieldIssue ? 'INVALID_FIELD' : 'SALESFORCE_API_ERROR';
      const userMessage = getUserFriendlyErrorMessage(errorMessage, objectType, errorCode);
      
      return {
        statusCode: response.status >= 400 && response.status < 500 ? response.status : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Salesforce API error',
          errorCode: errorCode,
          message: userMessage,
          objectType: objectType,
          rawError: errorMessage, // Include raw error for debugging
          suggestedAction: fieldIssue
            ? 'Some fields may not be accessible. Try a different search or contact your administrator.'
            : 'Please try again or contact your Salesforce administrator if the issue persists.'
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
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Ensure we always return a valid response
    const errorMessage = error.message || 'An unexpected error occurred';
    const sanitizedMessage = errorMessage.length > 200 
      ? errorMessage.substring(0, 200) + '...' 
      : errorMessage;
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to search Salesforce records',
        message: sanitizedMessage,
      }),
    };
  }
};

