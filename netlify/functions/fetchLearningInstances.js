/**
 * Netlify Function to fetch Learning Material Instances for a Contact
 * Returns all Learning_Material_Instance__c records for the authenticated contact
 * with related Learning_Material__c information
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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📚 Fetch Learning Instances - Request received');

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

    // Query Learning_Material_Instance__c for the contact
    // Note: The lookup field to Contact might be named differently
    // Try common field names: Learner__c, Contact__c, Portal_User__c
    const escapedContactId = contactId.replace(/'/g, "\\'");
    
    // Try different field names - start with most common
    const fieldNames = ['Learner__c', 'Contact__c', 'Portal_User__c'];
    let queryResponse;
    let queryData;
    let records = [];
    
    for (const fieldName of fieldNames) {
      // Try query without Is_Active filter first, then with filter
      const queries = [
        `SELECT Id, Name, ${fieldName}, Learning_Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Learning_Material__r.Id, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material__r.Material_Type__c, Learning_Material__r.Material_URL__c, Learning_Material__r.Duration__c, Learning_Material__r.Category__c, Learning_Material__r.Is_Active__c, Learning_Material__r.Parent_Material__c, Learning_Material__r.Parent_Material__r.Id, Learning_Material__r.Parent_Material__r.Title__c FROM Learning_Material_Instance__c WHERE ${fieldName} = '${escapedContactId}' ORDER BY CreatedDate ASC`,
        `SELECT Id, Name, ${fieldName}, Learning_Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Learning_Material__r.Id, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material__r.Material_Type__c, Learning_Material__r.Material_URL__c, Learning_Material__r.Duration__c, Learning_Material__r.Category__c, Learning_Material__r.Is_Active__c, Learning_Material__r.Parent_Material__c, Learning_Material__r.Parent_Material__r.Id, Learning_Material__r.Parent_Material__r.Title__c FROM Learning_Material_Instance__c WHERE ${fieldName} = '${escapedContactId}' AND Learning_Material__r.Is_Active__c = true ORDER BY CreatedDate ASC`
      ];
      
      for (const soqlQuery of queries) {
        const encodedQuery = encodeURIComponent(soqlQuery);
        const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

        console.log(`📤 Querying Learning Material Instances with field: ${fieldName}...`);
        console.log(`📝 SOQL Query: ${soqlQuery}`);

        queryResponse = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (queryResponse.ok) {
          queryData = await queryResponse.json();
          records = queryData.records || [];
          console.log(`✅ Successfully queried with field: ${fieldName}, found ${records.length} records`);
          break; // Success, exit inner loop
        } else {
          const errorText = await queryResponse.text();
          console.log(`⚠️ Query failed with field ${fieldName}:`, errorText.substring(0, 200));
          // Continue to next query variant
        }
      }
      
      if (queryResponse && queryResponse.ok) {
        break; // Success, exit outer loop
      }
    }

    if (!queryResponse || !queryResponse.ok) {
      const errorText = await queryResponse?.text() || 'Unknown error';
      console.error('❌ Salesforce query error with all field names:', errorText);
      throw new Error(`Salesforce query failed: ${queryResponse?.status || 400} - ${errorText}`);
    }

    // Filter out records where material is not active (if Is_Active__c field exists)
    const activeRecords = records.filter(record => {
      const material = record.Learning_Material__r;
      // If Is_Active__c field exists and is false, filter it out
      // If field doesn't exist or is true/null, include it
      return !material || material.Is_Active__c !== false;
    });

    console.log(`📊 Filtered ${records.length} records to ${activeRecords.length} active records`);

    // Transform records to a cleaner format
    // Handle parent-child material relationships - instances tie to parent materials
    const instances = activeRecords.map((record) => {
      const material = record.Learning_Material__r;
      
      // If this material has a parent, we still show the material itself
      // but we can use parent info for grouping/display if needed
      // Instances are tied to the material specified, which could be parent or child
      const displayMaterial = material ? {
        id: material.Id,
        title: material.Title__c,
        description: material.Description__c,
        materialType: material.Material_Type__c,
        materialUrl: material.Material_URL__c,
        duration: material.Duration__c || 0,
        category: material.Category__c,
        isActive: material.Is_Active__c !== false,
        parentId: material.Parent_Material__c || null,
        parentTitle: material.Parent_Material__r?.Title__c || null,
        isChild: !!material.Parent_Material__c,
      } : null;

      return {
        id: record.Id,
        name: record.Name,
        contactId: record.Learner__c || record.Contact__c || record.Portal_User__c, // Support multiple field names
        learningMaterialId: record.Learning_Material__c,
        progress: record.Progress__c || 0,
        status: record.Status__c || 'Not Started',
        score: record.Score__c || null,
        startedOn: record.Started_On__c || null,
        completedOn: record.Completed_On__c || null,
        createdDate: record.CreatedDate,
        material: displayMaterial,
      };
    });

    console.log(`✅ Fetched ${instances.length} learning material instances`);

    // Separate by status
    const notStarted = instances.filter(i => i.status === 'Not Started');
    const inProgress = instances.filter(i => i.status === 'In Progress');
    const completed = instances.filter(i => i.status === 'Completed');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        instances,
        notStarted,
        inProgress,
        completed,
        total: instances.length
      }),
    };

  } catch (error) {
    console.error('❌ Fetch Learning Instances Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch learning instances',
        message: errorMessage
      }),
    };
  }
};

