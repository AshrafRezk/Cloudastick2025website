/**
 * Netlify Function to update Learning Material Instance progress
 * Supports updating Progress__c, Status__c, Started_On__c, Completed_On__c
 * Can also create a new instance if one doesn't exist
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
    console.log('📊 Update Learning Progress - Request received');

    const {
      access_token,
      instance_url,
      instanceId,
      contactId,
      learningMaterialId,
      progress,
      status,
      score,
      startedOn,
      completedOn,
      attemptNumber,
      timeTakenMinutes
    } = JSON.parse(event.body || '{}');

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

    // Helper function to check if material is a child (has a parent)
    const checkIfChildMaterial = async (materialId) => {
      try {
        const materialQuery = `SELECT Id, Parent_Material__c FROM Learning_Material__c WHERE Id = '${materialId.replace(/'/g, "\\'")}' LIMIT 1`;
        const encodedQuery = encodeURIComponent(materialQuery);
        const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

        const response = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const material = data.records?.[0];
          return material?.Parent_Material__c || null;
        }
        return null;
      } catch (e) {
        console.log('⚠️ Could not check if material is child:', e);
        return null;
      }
    };

    // Helper function to recalculate parent progress
    const recalculateParentProgress = async (parentMaterialId, contactId) => {
      try {
        // Fetch all child materials for the parent
        const childQuery = `SELECT Id, Duration__c FROM Learning_Material__c WHERE Parent_Material__c = '${parentMaterialId.replace(/'/g, "\\'")}' AND Active__c = true`;
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
          console.log('⚠️ Could not fetch child materials for parent recalculation');
          return;
        }

        const childData = await childResponse.json();
        const childMaterials = childData.records || [];

        if (childMaterials.length === 0) {
          return;
        }

        const childIds = childMaterials.map(c => c.Id).map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
        const escapedContactId = contactId.replace(/'/g, "\\'");

        // Fetch all child instances
        const childInstanceQuery = `SELECT Id, Material__c, Progress__c, Status__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c IN (${childIds})`;
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
          console.log('⚠️ Could not fetch child instances for parent recalculation');
          return;
        }

        const childInstanceData = await childInstanceResponse.json();
        const childInstances = childInstanceData.records || [];

        // Create a map of material ID to instance
        const instanceMap = {};
        childInstances.forEach(inst => {
          instanceMap[inst.Material__c] = inst;
        });

        // Calculate duration-weighted progress
        let totalWeightedProgress = 0;
        let totalDuration = 0;
        let completedChildrenCount = 0;

        childMaterials.forEach(child => {
          const childDuration = child.Duration__c || 0;
          const childInstance = instanceMap[child.Id];
          const childProgress = childInstance ? (childInstance.Progress__c || 0) : 0;

          totalWeightedProgress += childProgress * childDuration;
          totalDuration += childDuration;

          if (childInstance && childInstance.Progress__c === 100 && childInstance.Status__c === 'Completed') {
            completedChildrenCount++;
          }
        });

        // Find parent instance
        const parentInstanceQuery = `SELECT Id FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c = '${parentMaterialId.replace(/'/g, "\\'")}' LIMIT 1`;
        const encodedParentInstanceQuery = encodeURIComponent(parentInstanceQuery);
        const parentInstanceQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedParentInstanceQuery}`;

        const parentInstanceResponse = await fetch(parentInstanceQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!parentInstanceResponse.ok || !parentInstanceResponse) {
          console.log('⚠️ Could not find parent instance for recalculation');
          return;
        }

        const parentInstanceData = await parentInstanceResponse.json();
        const parentInstance = parentInstanceData.records?.[0];

        if (!parentInstance) {
          console.log('⚠️ Parent instance not found');
          return;
        }

        // Calculate parent progress
        const calculatedProgress = totalDuration > 0 ? Math.round(totalWeightedProgress / totalDuration) : 0;
        const allChildrenCompleted = completedChildrenCount === childMaterials.length && childMaterials.length > 0;

        // Update parent instance
        const parentUpdateData = {
          Progress__c: calculatedProgress,
        };

        if (allChildrenCompleted) {
          parentUpdateData.Status__c = 'Completed';
          parentUpdateData.Progress__c = 100;
          parentUpdateData.Completed_On__c = new Date().toISOString();
        } else if (calculatedProgress > 0) {
          parentUpdateData.Status__c = 'In Progress';
        }

        const parentUpdateUrl = `${instance_url}/services/data/v58.0/sobjects/Learning_Material_Instance__c/${parentInstance.Id}`;
        const parentUpdateResponse = await fetch(parentUpdateUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parentUpdateData),
        });

        if (parentUpdateResponse.ok) {
          console.log(`✅ Recalculated parent progress: ${calculatedProgress}%${allChildrenCompleted ? ' (auto-completed)' : ''}`);

          // Check certificate eligibility if parent was just completed
          if (allChildrenCompleted && contactId) {
            await checkAndGenerateCertificate(parentMaterialId, parentInstance.Id, contactId);
          }
        } else {
          const errorText = await parentUpdateResponse.text();
          console.log('⚠️ Failed to update parent progress:', errorText);
        }
      } catch (e) {
        console.log('⚠️ Error recalculating parent progress:', e);
      }
    };

    // Helper function to check certificate eligibility and generate certificate
    const checkAndGenerateCertificate = async (parentMaterialId, parentInstanceId, contactId) => {
      try {
        // Check if certificate generation is enabled for this material (optional field)
        const materialQuery = `SELECT Id, Title__c, Issue_Certificate__c FROM Learning_Material__c WHERE Id = '${parentMaterialId.replace(/'/g, "\\'")}' LIMIT 1`;
        const encodedMaterialQuery = encodeURIComponent(materialQuery);
        const materialQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedMaterialQuery}`;

        const materialResponse = await fetch(materialQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!materialResponse.ok) {
          console.log('⚠️ Could not fetch parent material for certificate check');
          return;
        }

        const materialData = await materialResponse.json();
        const parentMaterial = materialData.records?.[0];

        if (!parentMaterial) {
          console.log('⚠️ Could not find parent material');
          return;
        }

        // Check if certificate generation is enabled (optional field - if it doesn't exist, allow certificates)
        if (parentMaterial.Issue_Certificate__c === false) {
          console.log('ℹ️ Certificate generation not enabled for this course');
          return;
        }

        // Check if certificate already exists (check if instance Name field starts with 'CERT-')
        const instanceCheckQuery = `SELECT Id, Name FROM Learning_Material_Instance__c WHERE Id = '${parentInstanceId.replace(/'/g, "\\'")}' LIMIT 1`;
        const encodedInstanceCheckQuery = encodeURIComponent(instanceCheckQuery);
        const instanceCheckQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedInstanceCheckQuery}`;

        const instanceCheckResponse = await fetch(instanceCheckQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (instanceCheckResponse.ok) {
          const instanceCheckData = await instanceCheckResponse.json();
          const existingInstance = instanceCheckData.records?.[0];
          if (existingInstance && existingInstance.Name && existingInstance.Name.startsWith('CERT-')) {
            console.log('ℹ️ Certificate already exists for this course');
            return;
          }
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
          console.log('⚠️ Could not fetch child materials for certificate check');
          return;
        }

        const childData = await childResponse.json();
        const childMaterials = childData.records || [];

        if (childMaterials.length === 0) {
          console.log('ℹ️ No child materials found, checking standalone completion status...');

          // For standalone materials, we need to check the instance itself
          // We can reuse the parentInstanceId which refers to the material instance
          const instanceQuery = `SELECT Id, Status__c, Score__c FROM Learning_Material_Instance__c WHERE Id = '${parentInstanceId.replace(/'/g, "\\'")}' LIMIT 1`;
          const encodedInstanceQuery = encodeURIComponent(instanceQuery);
          const instanceQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedInstanceQuery}`;

          const instanceResponse = await fetch(instanceQueryUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!instanceResponse.ok) {
            console.log('⚠️ Could not fetch instance for certificate check');
            return;
          }

          const instanceData = await instanceResponse.json();
          const instance = instanceData.records?.[0];

          if (!instance || instance.Status__c !== 'Completed') {
            console.log('ℹ️ Instance not completed, certificate not eligible');
            return;
          }

          // Check quiz score if applicable
          if (parentMaterial.Quiz_Questions__c) {
            const score = instance.Score__c;
            const passingScore = parentMaterial.Passing_Score__c;

            if (passingScore !== null && passingScore !== undefined) {
              // Normalize passing score (handle both percentage and decimal)
              let passingScorePercent = passingScore;
              if (passingScore > 0 && passingScore <= 1) {
                passingScorePercent = passingScore * 100;
              }

              if (score === null || score === undefined || score < passingScorePercent) {
                console.log('ℹ️ Quiz score below passing score, certificate not eligible');
                return;
              }
            }
          }

          // If we are here, it means it's a standalone material, completed (and passed if quiz)
          // Proceed to generate certificate (fall through to existing logic)
        } else {
          // Existing logic for child materials
          const childIds = childMaterials.map(c => c.Id).map(id => `'${id.replace(/'/g, "\\'")}'`).join(',');
          const escapedContactId = contactId.replace(/'/g, "\\'");

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
            console.log('⚠️ Could not fetch child instances for certificate check');
            return;
          }

          const childInstanceData = await childInstanceResponse.json();
          const childInstances = childInstanceData.records || [];

          // Check if all children are completed
          const allChildrenCompleted = childMaterials.every((child) => {
            const childInstance = childInstances.find(ci => ci.Material__c === child.Id);
            return childInstance && childInstance.Status__c === 'Completed';
          });

          if (!allChildrenCompleted) {
            console.log('ℹ️ Not all child materials are completed, certificate not eligible');
            return;
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
              console.log('ℹ️ Not all quizzes passed, certificate not eligible');
              return;
            }
          }
        }

        // All requirements met, generate certificate
        console.log('🎓 Certificate eligibility confirmed, generating certificate...');

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
        const baseUrl = process.env.CERTIFICATE_BASE_URL || 'https://cloudastick.com';
        const certificateUrl = `${baseUrl}/certificate/${certificateId}`;

        // Store certificate data in the instance's Name field
        // Format: CERT-{InstanceId}|{VerificationCode}
        // This allows us to identify certificates and retrieve verification codes
        const certificateName = `${certificateId}|${verificationCode}`;

        // Update the instance record with certificate information
        const updateInstanceData = {
          Name: certificateName,
        };

        const updateInstanceUrl = `${instance_url}/services/data/v58.0/sobjects/Learning_Material_Instance__c/${parentInstanceId}`;
        const updateInstanceResponse = await fetch(updateInstanceUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateInstanceData),
        });

        if (updateInstanceResponse.ok) {
          console.log('✅ Certificate generated successfully on instance:', parentInstanceId);
          console.log('   Certificate ID:', certificateId);
          console.log('   Verification Code:', verificationCode);
        } else {
          const errorText = await updateInstanceResponse.text();
          console.error('⚠️ Failed to generate certificate:', errorText);
        }
      } catch (e) {
        console.error('⚠️ Error checking/generating certificate:', e);
      }
    };

    // If no instanceId but we have contactId and learningMaterialId, upsert (check if exists first)
    if (!instanceId && contactId && learningMaterialId) {
      console.log('📝 Upserting Learning Material Instance...');

      // Check if material is a quiz and get max attempts
      let materialMaxAttempts = null;
      let materialType = null;
      try {
        const materialQuery = `SELECT Material_Type__c, Max_Attempts__c FROM Learning_Material__c WHERE Id = '${learningMaterialId.replace(/'/g, "\\'")}' LIMIT 1`;
        const encodedMaterialQuery = encodeURIComponent(materialQuery);
        const materialQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedMaterialQuery}`;
        const materialResponse = await fetch(materialQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });
        if (materialResponse.ok) {
          const materialData = await materialResponse.json();
          const material = materialData.records?.[0];
          if (material) {
            materialType = material.Material_Type__c;
            materialMaxAttempts = material.Max_Attempts__c;
          }
        }
      } catch (e) {
        console.log('⚠️ Could not fetch material info:', e);
      }

      const isQuiz = materialType === 'Quiz';

      // For quizzes, count existing completed attempts to determine next attempt number
      // Attempt numbers are set when quizzes are submitted (Completed status)
      let nextAttemptNumber = 1;
      let currentMaxAttempt = 0;
      if (isQuiz) {
        try {
          const escapedContactId = contactId.replace(/'/g, "\\'");
          const escapedMaterialId = learningMaterialId.replace(/'/g, "\\'");
          // Query for completed attempts using Attempt_Number__c field
          // Only count completed attempts since attempt number is set on submission
          const attemptsQuery = `SELECT Attempt_Number__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c = '${escapedMaterialId}' AND Attempt_Number__c != null AND Status__c = 'Completed' ORDER BY Attempt_Number__c DESC LIMIT 1`;
          const encodedAttemptsQuery = encodeURIComponent(attemptsQuery);
          const attemptsQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedAttemptsQuery}`;
          const attemptsResponse = await fetch(attemptsQueryUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          });
          if (attemptsResponse.ok) {
            const attemptsData = await attemptsResponse.json();
            const lastAttempt = attemptsData.records?.[0];
            if (lastAttempt && lastAttempt.Attempt_Number__c) {
              currentMaxAttempt = lastAttempt.Attempt_Number__c;
              nextAttemptNumber = currentMaxAttempt + 1;
              console.log(`📊 Current max attempt: ${currentMaxAttempt}, Next attempt number: ${nextAttemptNumber}`);
            } else {
              console.log(`📊 No previous completed attempts found, next attempt will be 1`);
            }
          }

          // Check max attempts
          if (materialMaxAttempts && nextAttemptNumber > materialMaxAttempts) {
            return {
              statusCode: 400,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                error: 'Maximum attempts reached',
                message: `You have reached the maximum number of attempts (${materialMaxAttempts}) for this quiz.`
              }),
            };
          }
        } catch (e) {
          console.log('⚠️ Could not check attempts:', e);
        }
      }

      // Check if instance already exists
      const escapedContactId = contactId.replace(/'/g, "\\'");
      const escapedMaterialId = learningMaterialId.replace(/'/g, "\\'");

      // For quizzes, find the latest instance (by Attempt_Number__c DESC, then CreatedDate DESC) to update
      // For non-quizzes, find any existing instance
      let existingQuery;
      if (isQuiz && !instanceId) {
        // For quiz materials, find the latest instance to update (not create new)
        // Order by Attempt_Number__c DESC first to get the highest attempt, then by CreatedDate
        existingQuery = `SELECT Id, Attempt_Number__c, Status__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c = '${escapedMaterialId}' ORDER BY Attempt_Number__c DESC, CreatedDate DESC LIMIT 1`;
      } else {
        existingQuery = `SELECT Id FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Material__c = '${escapedMaterialId}' LIMIT 1`;
      }

      let finalInstanceId;
      let wasCreated = false;

      const encodedExistingQuery = encodeURIComponent(existingQuery);
      const existingQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedExistingQuery}`;

      const existingResponse = await fetch(existingQueryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (existingResponse.ok) {
        const existingData = await existingResponse.json();
        const existingInstance = existingData.records?.[0];

        if (existingInstance) {
          // Update existing instance
          console.log('📝 Updating existing Learning Material Instance:', existingInstance.Id);
          finalInstanceId = existingInstance.Id;

          const updateData = {};
          if (progress !== undefined && progress !== null) {
            updateData.Progress__c = Math.min(100, Math.max(0, progress));
          }
          if (status) {
            updateData.Status__c = status;
          }
          if (score !== undefined && score !== null) {
            updateData.Score__c = score;
          }
          if (startedOn) {
            updateData.Started_On__c = startedOn;
          }
          if (completedOn) {
            updateData.Completed_On__c = completedOn;
          }
          if (timeTakenMinutes !== undefined && timeTakenMinutes !== null) {
            updateData.Time_Taken_Minutes__c = timeTakenMinutes;
          }

          // For quizzes, handle attempt number based on status
          if (isQuiz) {
            // If explicitly provided, use it
            if (attemptNumber !== undefined && attemptNumber !== null) {
              updateData.Attempt_Number__c = attemptNumber;
              console.log(`🔄 Using provided attempt number: ${attemptNumber}`);
            } else if (status === 'Completed') {
              // Submitting quiz - set attempt number based on completed attempts
              // First submission = 1, second = 2, etc.
              updateData.Attempt_Number__c = nextAttemptNumber;
              console.log(`🔄 Quiz submitted: setting attempt number to ${nextAttemptNumber} (based on ${currentMaxAttempt} completed attempts)`);
            } else if (status === 'In Progress') {
              // Starting a quiz - don't set attempt number yet, it will be set on submission
              // Keep existing attempt number if present (for continuing), otherwise don't set it
              if (existingInstance.Attempt_Number__c !== null && existingInstance.Attempt_Number__c !== undefined) {
                // Use existing attempt number (for continuing an in-progress quiz)
                updateData.Attempt_Number__c = existingInstance.Attempt_Number__c;
                console.log(`🔄 Starting quiz: using existing attempt number ${updateData.Attempt_Number__c}`);
              } else {
                // Don't set attempt number yet - it will be set when quiz is submitted
                // The attempt number is only set on completion
                console.log(`🔄 Starting quiz: attempt number will be set to ${nextAttemptNumber} on submission`);
              }
            } else {
              // Other statuses - use existing or calculated
              if (existingInstance.Attempt_Number__c !== null && existingInstance.Attempt_Number__c !== undefined) {
                updateData.Attempt_Number__c = existingInstance.Attempt_Number__c;
              } else {
                updateData.Attempt_Number__c = nextAttemptNumber;
              }
            }
          } else if (attemptNumber !== undefined) {
            updateData.Attempt_Number__c = attemptNumber;
          }

          // Auto-complete logic
          if (status === 'Completed' && (!updateData.Progress__c || updateData.Progress__c < 100)) {
            updateData.Progress__c = 100;
          }
          if (updateData.Progress__c === 100 && status !== 'Completed') {
            updateData.Status__c = 'Completed';
            if (!updateData.Completed_On__c) {
              updateData.Completed_On__c = new Date().toISOString();
            }
          }

          const updateUrl = `${instance_url}/services/data/v58.0/sobjects/Learning_Material_Instance__c/${finalInstanceId}`;
          const updateResponse = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Failed to update instance: ${updateResponse.status} - ${errorText}`);
          }
        } else {
          // No existing instance, create new one
          wasCreated = true;
          finalInstanceId = await createNewInstance();
        }
      } else {
        // Query failed, try to create
        wasCreated = true;
        finalInstanceId = await createNewInstance();
      }

      async function createNewInstance() {
        console.log('📝 Creating new Learning Material Instance...');

        const newInstanceData = {
          Learner__c: contactId,
          Material__c: learningMaterialId,
          Progress__c: progress || 0,
          Status__c: status || 'Not Started',
          Started_On__c: startedOn || new Date().toISOString(),
        };

        if (score !== undefined && score !== null) {
          newInstanceData.Score__c = score;
        }

        if (completedOn) {
          newInstanceData.Completed_On__c = completedOn;
        }

        // Quiz-specific fields
        if (isQuiz) {
          // For quizzes, attempt number is only set when quiz is completed (submitted)
          // When starting (In Progress), don't set attempt number yet
          if (status === 'Completed') {
            // Quiz is being submitted - set attempt number
            if (attemptNumber !== undefined && attemptNumber !== null) {
              newInstanceData.Attempt_Number__c = attemptNumber;
              console.log(`🔄 Creating new quiz instance (completed) with provided attempt number: ${attemptNumber}`);
            } else {
              newInstanceData.Attempt_Number__c = nextAttemptNumber;
              console.log(`🔄 Creating new quiz instance (completed) with calculated attempt number: ${nextAttemptNumber}`);
            }
          } else {
            // Starting quiz (In Progress) - don't set attempt number yet
            // It will be set when the quiz is submitted
            console.log(`🔄 Creating new quiz instance (in progress) - attempt number will be set on submission`);
          }
        } else if (attemptNumber !== undefined) {
          newInstanceData.Attempt_Number__c = attemptNumber;
        }

        if (timeTakenMinutes !== undefined && timeTakenMinutes !== null) {
          newInstanceData.Time_Taken_Minutes__c = timeTakenMinutes;
        }

        const createUrl = `${instance_url}/services/data/v58.0/sobjects/Learning_Material_Instance__c`;
        const createResponse = await fetch(createUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newInstanceData),
        });

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          throw new Error(`Failed to create instance: ${createResponse.status} - ${errorText}`);
        }

        const createData = await createResponse.json();
        console.log('✅ Created new Learning Material Instance:', createData.id);
        return createData.id;
      }

      // Check if this is a child material and recalculate parent progress
      const parentMaterialId = await checkIfChildMaterial(learningMaterialId);
      if (parentMaterialId) {
        console.log('🔄 Child material detected, recalculating parent progress...');
        await recalculateParentProgress(parentMaterialId, contactId);
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          instanceId: finalInstanceId,
          created: wasCreated,
          updated: !wasCreated
        }),
      };
    }

    // Update existing instance
    if (!instanceId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing instanceId or contactId/learningMaterialId' }),
      };
    }

    console.log('📝 Updating Learning Material Instance:', instanceId);

    const updateData = {};

    if (progress !== undefined && progress !== null) {
      updateData.Progress__c = Math.min(100, Math.max(0, progress)); // Clamp between 0-100
    }

    if (status) {
      updateData.Status__c = status;
    }

    if (score !== undefined && score !== null) {
      updateData.Score__c = score;
    }

    if (startedOn) {
      updateData.Started_On__c = startedOn;
    }

    if (completedOn) {
      updateData.Completed_On__c = completedOn;
    }

    // Quiz-specific fields
    if (timeTakenMinutes !== undefined && timeTakenMinutes !== null) {
      updateData.Time_Taken_Minutes__c = timeTakenMinutes;
    }

    if (attemptNumber !== undefined && attemptNumber !== null) {
      updateData.Attempt_Number__c = attemptNumber;
    }

    // If status is Completed, ensure progress is 100
    if (status === 'Completed' && (!updateData.Progress__c || updateData.Progress__c < 100)) {
      updateData.Progress__c = 100;
    }

    // If progress reaches 100, set status to Completed if not already
    if (updateData.Progress__c === 100 && status !== 'Completed') {
      updateData.Status__c = 'Completed';
      if (!updateData.Completed_On__c) {
        updateData.Completed_On__c = new Date().toISOString();
      }
    }

    // If status is In Progress and no Started_On__c, set it
    if ((status === 'In Progress' || updateData.Status__c === 'In Progress') && !startedOn) {
      updateData.Started_On__c = new Date().toISOString();
    }

    const updateUrl = `${instance_url}/services/data/v58.0/sobjects/Learning_Material_Instance__c/${instanceId}`;

    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      throw new Error(`Failed to update instance: ${updateResponse.status} - ${errorText}`);
    }

    console.log('✅ Updated Learning Material Instance successfully');

    // Check if this is a child material and recalculate parent progress
    // First, get the material ID from the instance
    try {
      const instanceQuery = `SELECT Material__c FROM Learning_Material_Instance__c WHERE Id = '${instanceId.replace(/'/g, "\\'")}' LIMIT 1`;
      const encodedInstanceQuery = encodeURIComponent(instanceQuery);
      const instanceQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedInstanceQuery}`;

      const instanceQueryResponse = await fetch(instanceQueryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (instanceQueryResponse.ok) {
        const instanceData = await instanceQueryResponse.json();
        const materialId = instanceData.records?.[0]?.Material__c;

        if (materialId) {
          const parentMaterialId = await checkIfChildMaterial(materialId);
          if (parentMaterialId && contactId) {
            console.log('🔄 Child material detected, recalculating parent progress...');
            await recalculateParentProgress(parentMaterialId, contactId);
          }
        }
      }
    } catch (e) {
      console.log('⚠️ Could not check for parent recalculation:', e);
    }

    // Check if this is a standalone material and check for certificate eligibility
    // We do this if it's NOT a child material (parentMaterialId would be null)
    // AND if the status is Completed
    try {
      // We need to fetch the instance again to be sure of the status or use the one we just updated
      // Since we don't have the updated status readily available in all paths, let's query the instance
      // But we can infer from updateData or newInstanceData if we really want to optimize

      const instanceQuery = `SELECT Material__c, Status__c FROM Learning_Material_Instance__c WHERE Id = '${instanceId.replace(/'/g, "\\'")}' LIMIT 1`;
      const encodedInstanceQuery = encodeURIComponent(instanceQuery);
      const instanceQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedInstanceQuery}`;

      const instanceQueryResponse = await fetch(instanceQueryUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (instanceQueryResponse.ok) {
        const instanceData = await instanceQueryResponse.json();
        const instance = instanceData.records?.[0];

        if (instance && instance.Status__c === 'Completed') {
          // Check if it has a parent
          const parentMaterialId = await checkIfChildMaterial(instance.Material__c);

          if (!parentMaterialId && contactId) {
            console.log('🔄 Standalone material completed, checking certificate eligibility...');
            await checkAndGenerateCertificate(instance.Material__c, instanceId, contactId);
          }
        }
      }
    } catch (e) {
      console.log('⚠️ Could not check validation for standalone certificate:', e);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        instanceId,
        updated: true
      }),
    };

  } catch (error) {
    console.error('❌ Update Learning Progress Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to update learning progress',
        message: errorMessage
      }),
    };
  }
};

