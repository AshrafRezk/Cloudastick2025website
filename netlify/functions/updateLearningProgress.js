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
      completedOn
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

    // If no instanceId but we have contactId and learningMaterialId, create new instance
    if (!instanceId && contactId && learningMaterialId) {
      console.log('📝 Creating new Learning Material Instance...');
      
      const newInstanceData = {
        Learner__c: contactId, // Try Learner__c first, adjust if different in your org
        Learning_Material__c: learningMaterialId,
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

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: true,
          instanceId: createData.id,
          created: true
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

