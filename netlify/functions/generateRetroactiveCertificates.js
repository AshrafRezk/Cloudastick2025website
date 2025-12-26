/**
 * Netlify Function to retroactively generate certificates for already-completed courses
 * Called when a user has zero certificates but has completed parent courses
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
    console.log('🔄 Retroactive Certificate Generation - Request received');

    const { contactId, access_token, instance_url } = JSON.parse(event.body || '{}');

    if (!contactId || !access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required parameters',
          message: 'contactId, access_token, and instance_url are required',
        }),
      };
    }

    // Query for completed parent instances that don't have certificates yet
    const escapedContactId = contactId.replace(/'/g, "\\'");
    const query = `SELECT Id, Name, Learner__c, Material__c, Material__r.Id, Material__r.Title__c, Material__r.Issue_Certificate__c, Material__r.Parent_Material__c, Status__c, Completed_On__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Status__c = 'Completed' AND (Name NOT LIKE 'CERT-%' OR Name = null) AND Material__r.Parent_Material__c = null ORDER BY Completed_On__c DESC`;
    
    const encodedQuery = encodeURIComponent(query);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to query instances:', errorText);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to query instances',
          message: errorText,
        }),
      };
    }

    const data = await response.json();
    const instances = data.records || [];

    if (instances.length === 0) {
      console.log('ℹ️ No completed parent courses found without certificates');
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          generated: 0,
          message: 'No completed courses found that need certificates',
        }),
      };
    }

    console.log(`📋 Found ${instances.length} completed parent courses to process`);

    let generated = 0;
    let skipped = 0;
    const errors = [];

    // Process each instance
    for (const instance of instances) {
      try {
        const parentMaterialId = instance.Material__c;
        const parentInstanceId = instance.Id;

        // Check if certificate generation is enabled for this material (optional field)
        if (instance.Material__r?.Issue_Certificate__c === false) {
          console.log(`⏭️ Skipping ${instance.Material__r?.Title__c || parentMaterialId}: Certificate generation disabled`);
          skipped++;
          continue;
        }

        // Check if certificate already exists (double-check)
        if (instance.Name && instance.Name.startsWith('CERT-')) {
          console.log(`⏭️ Skipping ${instance.Material__r?.Title__c || parentMaterialId}: Certificate already exists`);
          skipped++;
          continue;
        }

        // Fetch all child materials with quiz information
        const childQuery = `SELECT Id, Title__c, Quiz_Questions__c, Passing_Score__c FROM Learning_Material__c WHERE Parent_Material__c = '${parentMaterialId.replace(/'/g, "\\'")}' AND Active__c = true`;
        const encodedChildQuery = encodeURIComponent(childQuery);
        const childQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedChildQuery}`;
        
        const childResponse = await fetch(childQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!childResponse.ok) {
          errors.push({ instanceId: parentInstanceId, error: 'Failed to fetch child materials' });
          continue;
        }

        const childData = await childResponse.json();
        const childMaterials = childData.records || [];

        if (childMaterials.length === 0) {
          console.log(`⏭️ Skipping ${instance.Material__r?.Title__c || parentMaterialId}: No child materials found`);
          skipped++;
          continue;
        }

        const childIds = childMaterials.map(c => c.Id).map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');

        // Fetch all child instances
        const childInstanceQuery = `SELECT Id, Material__c, Status__c, Score__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c IN (${childIds})`;
        const encodedChildInstanceQuery = encodeURIComponent(childInstanceQuery);
        const childInstanceQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedChildInstanceQuery}`;
        
        const childInstanceResponse = await fetch(childInstanceQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!childInstanceResponse.ok) {
          errors.push({ instanceId: parentInstanceId, error: 'Failed to fetch child instances' });
          continue;
        }

        const childInstanceData = await childInstanceResponse.json();
        const childInstances = childInstanceData.records || [];

        // Check if all children are completed
        const allChildrenCompleted = childMaterials.every((child) => {
          const childInstance = childInstances.find(ci => ci.Material__c === child.Id);
          return childInstance && childInstance.Status__c === 'Completed';
        });

        if (!allChildrenCompleted) {
          console.log(`⏭️ Skipping ${instance.Material__r?.Title__c || parentMaterialId}: Not all child materials completed`);
          skipped++;
          continue;
        }

        // Check if all quizzes passed (if any child has a quiz)
        const hasQuizzes = childMaterials.some(child => child.Quiz_Questions__c);
        if (hasQuizzes) {
          const allQuizzesPassed = childMaterials.every((child) => {
            if (!child.Quiz_Questions__c) return true; // Not a quiz, skip
            
            const childInstance = childInstances.find(ci => ci.Material__c === child.Id);
            if (!childInstance || childInstance.Status__c !== 'Completed') {
              return false;
            }

            // Check if quiz passed
            const score = childInstance.Score__c;
            const passingScore = child.Passing_Score__c;

            if (passingScore === null || passingScore === undefined) {
              return true; // No passing score requirement
            }

            // Normalize passing score (handle both percentage and decimal)
            let passingScorePercent = passingScore;
            if (passingScore > 0 && passingScore <= 1) {
              passingScorePercent = passingScore * 100;
            }

            return score !== null && score !== undefined && score >= passingScorePercent;
          });

          if (!allQuizzesPassed) {
            console.log(`⏭️ Skipping ${instance.Material__r?.Title__c || parentMaterialId}: Not all quizzes passed`);
            skipped++;
            continue;
          }
        }

        // All requirements met, generate certificate
        console.log(`🎓 Generating certificate for: ${instance.Material__r?.Title__c || parentMaterialId}`);

        // Generate certificate ID from instance ID (format: CERT-{InstanceId})
        const certificateId = `CERT-${parentInstanceId}`;

        // Generate verification code (8-character alphanumeric)
        const generateVerificationCode = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let code = '';
          for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return code;
        };

        const verificationCode = generateVerificationCode();
        const certificateName = `${certificateId}|${verificationCode}`;

        // Update the instance record with certificate information
        const updateInstanceUrl = `${instance_url}/services/data/v58.0/sobjects/Learning_Material_Instance__c/${parentInstanceId}`;
        const updateResponse = await fetch(updateInstanceUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Name: certificateName }),
        });

        if (updateResponse.ok) {
          generated++;
          console.log(`✅ Certificate generated: ${certificateId} for ${instance.Material__r?.Title__c || parentMaterialId}`);
        } else {
          const errorText = await updateResponse.text();
          console.error(`⚠️ Failed to generate certificate for ${instance.Material__r?.Title__c || parentMaterialId}:`, errorText);
          errors.push({ instanceId: parentInstanceId, error: errorText });
        }
      } catch (error) {
        console.error(`⚠️ Error processing instance ${instance.Id}:`, error);
        errors.push({ instanceId: instance.Id, error: error.message });
      }
    }

    console.log(`✅ Retroactive certificate generation complete: ${generated} generated, ${skipped} skipped, ${errors.length} errors`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        generated,
        skipped,
        errors: errors.length > 0 ? errors : undefined,
        message: `Processed ${instances.length} courses: ${generated} certificates generated, ${skipped} skipped`,
      }),
    };
  } catch (error) {
    console.error('❌ Error in retroactive certificate generation:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

