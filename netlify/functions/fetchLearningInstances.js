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
    // Note: The field on Learning_Material_Instance__c is Material__c, not Learning_Material__c
    const soqlQuery = `SELECT Id, Name, Learner__c, Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Attempt_Number__c, Time_Taken_Minutes__c, Material__r.Id, Material__r.Title__c, Material__r.Description__c, Material__r.Material_Type__c, Material__r.Material_URL__c, Material__r.Duration__c, Material__r.Category__c, Material__r.Active__c, Material__r.Parent_Material__c, Material__r.Quiz_Questions__c, Material__r.Passing_score__c, Material__r.Quiz_Time_limit_Minutes__c, Material__r.Max_Attempts__c, Material__r.Show_Results__c, Material__r.Randomize_Questions__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' ORDER BY CreatedDate ASC`;
    
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

    // Filter out records where material is not active (if Active__c field exists)
    // Also filter out instances tied to child materials - they should only appear nested under parents
    const activeRecords = records.filter(record => {
      const material = record.Material__r;
      // If Active__c field exists and is false, filter it out
      // If field doesn't exist or is true/null, include it
      if (!material || material.Active__c === false) {
        return false;
      }
      // Filter out instances tied to child materials (materials with a parent)
      // Child material instances should not appear as separate items in the list
      // They will be shown nested under their parent material
      if (material.Parent_Material__c) {
        console.log(`⚠️ Filtering out child material instance: ${record.Id} (Material: ${material.Title__c})`);
        return false;
      }
      return true;
    });

    console.log(`📊 Filtered ${records.length} records to ${activeRecords.length} active records`);

    // For each instance, if the material is a parent (Course), fetch its child materials
    const instancesWithChildren = await Promise.all(
      activeRecords.map(async (record) => {
        const material = record.Material__r;
        
        // If this is a parent material (Module/Course), fetch child materials and their instances
        // The instance is tied to the parent, and child materials are nested underneath
        let childMaterials = [];
        let calculatedParentProgress = record.Progress__c || 0;
        let allChildrenCompleted = false;
        
        if (material && !material.Parent_Material__c) {
          try {
            // Fetch child materials
            const childQuery = `SELECT Id, Title__c, Description__c, Material_Type__c, Material_URL__c, Duration__c, Category__c, Active__c, Quiz_Questions__c, Passing_score__c, Quiz_Time_limit_Minutes__c, Max_Attempts__c, Show_Results__c, Randomize_Questions__c FROM Learning_Material__c WHERE Parent_Material__c = '${material.Id}' AND Active__c = true ORDER BY CreatedDate ASC`;
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
              const childMaterialRecords = childData.records || [];
              
              // If we have child materials, fetch their instances
              if (childMaterialRecords.length > 0) {
                const childIds = childMaterialRecords.map(c => c.Id).map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
                const childInstanceQuery = `SELECT Id, Material__c, Progress__c, Status__c, Started_On__c, Completed_On__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c IN (${childIds})`;
                const encodedChildInstanceQuery = encodeURIComponent(childInstanceQuery);
                const childInstanceQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedChildInstanceQuery}`;
                
                const childInstanceResponse = await fetch(childInstanceQueryUrl, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                let childInstancesMap = {};
                if (childInstanceResponse.ok) {
                  const childInstanceData = await childInstanceResponse.json();
                  (childInstanceData.records || []).forEach(inst => {
                    childInstancesMap[inst.Material__c] = {
                      id: inst.Id,
                      progress: inst.Progress__c || 0,
                      status: inst.Status__c || 'Not Started',
                      startedOn: inst.Started_On__c || null,
                      completedOn: inst.Completed_On__c || null,
                    };
                  });
                  console.log(`📊 Found ${Object.keys(childInstancesMap).length} child instances for ${material.Title__c}`);
                }
                
                // Calculate duration-weighted parent progress
                let totalWeightedProgress = 0;
                let totalDuration = 0;
                let completedChildrenCount = 0;
                
                childMaterials = childMaterialRecords.map((child) => {
                  const childInstance = childInstancesMap[child.Id] || null;
                  const childDuration = child.Duration__c || 0;
                  const childProgress = childInstance ? childInstance.progress : 0;
                  
                  // Calculate weighted contribution
                  totalWeightedProgress += childProgress * childDuration;
                  totalDuration += childDuration;
                  
                  // Check if child is completed
                  if (childInstance && childInstance.progress === 100 && childInstance.status === 'Completed') {
                    completedChildrenCount++;
                  }
                  
                  return {
                    id: child.Id,
                    title: child.Title__c,
                    description: child.Description__c,
                    materialType: child.Material_Type__c,
                    materialUrl: child.Material_URL__c,
                    duration: childDuration,
                    category: child.Category__c,
                    isActive: child.Active__c !== false,
                    parentId: material.Id,
                    isChild: true,
                    instance: childInstance, // Attach instance data to child material
                    quizQuestions: child.Quiz_Questions__c || null,
                    passingScore: child.Passing_score__c || null,
                    quizTimeLimitMinutes: child.Quiz_Time_limit_Minutes__c || null,
                    maxAttempts: child.Max_Attempts__c || null,
                    showResults: child.Show_Results__c || null,
                    randomizeQuestions: child.Randomize_Questions__c || null,
                  };
                });
                
                // Calculate parent progress as duration-weighted average
                if (totalDuration > 0) {
                  calculatedParentProgress = Math.round(totalWeightedProgress / totalDuration);
                  console.log(`📈 Calculated parent progress: ${calculatedParentProgress}% (weighted by duration)`);
                }
                
                // Check if all children are completed
                allChildrenCompleted = completedChildrenCount === childMaterials.length && childMaterials.length > 0;
                
                console.log(`📚 Found ${childMaterials.length} child materials for ${material.Title__c}, ${completedChildrenCount} completed`);
              }
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
          isActive: material.Active__c !== false,
          parentId: material.Parent_Material__c || null,
          isChild: !!material.Parent_Material__c,
          childMaterials: childMaterials, // Add child materials if this is a parent
          quizQuestions: material.Quiz_Questions__c || null,
          passingScore: material.Passing_score__c || null,
          quizTimeLimitMinutes: material.Quiz_Time_limit_Minutes__c || null,
          maxAttempts: material.Max_Attempts__c || null,
          showResults: material.Show_Results__c || null,
          randomizeQuestions: material.Randomize_Questions__c || null,
        } : null;

        // Use calculated progress if we have children, otherwise use the record's progress
        const finalProgress = childMaterials.length > 0 ? calculatedParentProgress : (record.Progress__c || 0);
        
        // Auto-complete parent if all children are completed
        let finalStatus = record.Status__c || 'Not Started';
        if (allChildrenCompleted && childMaterials.length > 0) {
          finalStatus = 'Completed';
          console.log(`✅ Auto-completing parent ${material?.Title__c} - all children completed`);
        }
        
        return {
          id: record.Id,
          name: record.Name,
          contactId: record.Learner__c,
          learningMaterialId: record.Material__c,
          progress: finalProgress,
          status: finalStatus,
          score: record.Score__c || null,
          startedOn: record.Started_On__c || null,
          completedOn: allChildrenCompleted && childMaterials.length > 0 ? new Date().toISOString() : (record.Completed_On__c || null),
          createdDate: record.CreatedDate,
          material: displayMaterial,
          isParent: !material?.Parent_Material__c && childMaterials.length > 0, // Flag to identify parent instances
          attemptNumber: record.Attempt_Number__c || null,
          timeTakenMinutes: record.Time_Taken_Minutes__c || null,
        };
      })
    );
    
    // Keep instances as-is: parent instances contain child materials nested within them
    // The frontend will handle displaying the hierarchy (module with materials underneath)
    const instances = instancesWithChildren;

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

