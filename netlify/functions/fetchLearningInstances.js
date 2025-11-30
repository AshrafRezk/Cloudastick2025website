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

    console.log('📋 Request details:', {
      hasAccessToken: !!access_token,
      hasInstanceUrl: !!instance_url,
      contactId: contactId,
      contactIdLength: contactId?.length || 0
    });

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
    // Field name is Learner__c based on Salesforce UI
    const escapedContactId = contactId.replace(/'/g, "\\'");
    
    // Query instances - instances are tied to parent materials (courses)
    // We'll also need to fetch child materials separately
    const soqlQuery = `SELECT Id, Name, Learner__c, Learning_Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Learning_Material__r.Id, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material__r.Material_Type__c, Learning_Material__r.Material_URL__c, Learning_Material__r.Duration__c, Learning_Material__r.Category__c, Learning_Material__r.Is_Active__c, Learning_Material__r.Parent_Material__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' ORDER BY CreatedDate ASC`;
    
    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Learning Material Instances...');
    console.log('📝 SOQL Query:', soqlQuery);
    console.log('📋 Contact ID:', contactId);

    const queryResponse = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!queryResponse.ok) {
      const errorText = await queryResponse.text();
      console.error('❌ Salesforce query error:', errorText);
      throw new Error(`Salesforce query failed: ${queryResponse.status} - ${errorText}`);
    }

    const queryData = await queryResponse.json();
    let records = queryData.records || [];
    console.log(`✅ Found ${records.length} Learning Material Instances`);

    if (!queryResponse || !queryResponse.ok) {
      let errorText = 'Unknown error';
      let lastErrorResponse = queryResponse;
      let lastStatus = queryResponse?.status || 400;
      
      try {
        if (queryResponse) {
          // Clone the response before reading to avoid "body is unusable" error
          try {
            const clonedResponse = queryResponse.clone();
            errorText = await clonedResponse.text();
          } catch (cloneError) {
            // If clone fails, try reading directly
            errorText = await queryResponse.text();
          }
        }
      } catch (e) {
        errorText = `HTTP ${lastStatus} - ${e.message || 'Could not read error response'}`;
      }
      
      console.error('❌ Salesforce query error with all field names:', errorText);
      console.error('❌ Last response status:', lastStatus);
      console.error('❌ Contact ID being queried:', contactId);
      console.error('❌ Contact ID length:', contactId?.length);
      console.error('❌ Contact ID first 20 chars:', contactId?.substring(0, 20));
      
      // Return empty results instead of error - user might not have any instances yet
      // This prevents the UI from breaking and allows us to debug the actual issue
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          instances: [],
          notStarted: [],
          inProgress: [],
          completed: [],
          total: 0,
          warning: `Query failed. Check logs for details. Status: ${lastStatus}`,
          debug: {
            contactId: contactId?.substring(0, 20) + '...',
            errorPreview: errorText.substring(0, 300)
          }
        }),
      };
    }

    // Filter out records where material is not active (if Is_Active__c field exists)
    const activeRecords = records.filter(record => {
      const material = record.Learning_Material__r;
      // If Is_Active__c field exists and is false, filter it out
      // If field doesn't exist or is true/null, include it
      return !material || material.Is_Active__c !== false;
    });

    console.log(`📊 Filtered ${records.length} records to ${activeRecords.length} active records`);

    // For each instance, if the material is a parent (Course), fetch its child materials
    const instancesWithChildren = await Promise.all(
      activeRecords.map(async (record) => {
        const material = record.Learning_Material__r;
        
        // If this is a parent material (Course), fetch child materials
        let childMaterials = [];
        if (material && !material.Parent_Material__c && material.Material_Type__c === 'Course') {
          try {
            const childQuery = `SELECT Id, Title__c, Description__c, Material_Type__c, Material_URL__c, Duration__c, Category__c, Is_Active__c FROM Learning_Material__c WHERE Parent_Material__c = '${material.Id}' AND Is_Active__c = true ORDER BY CreatedDate ASC`;
            const encodedChildQuery = encodeURIComponent(childQuery);
            const childQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedChildQuery}`;
            
            const childResponse = await fetch(childQueryUrl, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (childResponse.ok) {
              const childData = await childResponse.json();
              childMaterials = (childData.records || []).map((child) => ({
                id: child.Id,
                title: child.Title__c,
                description: child.Description__c,
                materialType: child.Material_Type__c,
                materialUrl: child.Material_URL__c,
                duration: child.Duration__c || 0,
                category: child.Category__c,
                isActive: child.Is_Active__c !== false,
                parentId: material.Id,
                isChild: true,
              }));
              console.log(`📚 Found ${childMaterials.length} child materials for ${material.Title__c}`);
            }
          } catch (e) {
            console.log('⚠️ Could not fetch child materials:', e);
          }
        }
        
        // Display the parent material info, with child materials attached
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
          isChild: !!material.Parent_Material__c,
          childMaterials: childMaterials, // Add child materials if this is a parent
        } : null;

        return {
          id: record.Id,
          name: record.Name,
          contactId: record.Learner__c,
          learningMaterialId: record.Learning_Material__c,
          progress: record.Progress__c || 0,
          status: record.Status__c || 'Not Started',
          score: record.Score__c || null,
          startedOn: record.Started_On__c || null,
          completedOn: record.Completed_On__c || null,
          createdDate: record.CreatedDate,
          material: displayMaterial,
        };
      })
    );
    
    // Flatten instances: if a parent material has children, create separate instances for each child
    // but keep the parent instance too for the course overview
    const instances = [];
    instancesWithChildren.forEach((instance) => {
      // Add the parent instance
      instances.push(instance);
      
      // If parent has child materials, add instances for each child
      if (instance.material?.childMaterials && instance.material.childMaterials.length > 0) {
        instance.material.childMaterials.forEach((child) => {
          instances.push({
            ...instance,
            id: `${instance.id}-${child.id}`, // Unique ID for child instance
            learningMaterialId: child.id,
            material: child,
            isChildInstance: true,
            parentInstanceId: instance.id,
          });
        });
      }
    });

    console.log(`✅ Fetched ${instances.length} learning material instances`);
    console.log('📊 Instance details:', JSON.stringify(instances.map(i => ({
      id: i.id,
      name: i.name,
      status: i.status,
      progress: i.progress,
      materialTitle: i.material?.title || 'No material',
      materialId: i.material?.id || 'No material ID'
    })), null, 2));

    // Separate by status
    const notStarted = instances.filter(i => i.status === 'Not Started');
    const inProgress = instances.filter(i => i.status === 'In Progress');
    const completed = instances.filter(i => i.status === 'Completed');
    
    console.log(`📈 Status breakdown: ${notStarted.length} not started, ${inProgress.length} in progress, ${completed.length} completed`);

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

