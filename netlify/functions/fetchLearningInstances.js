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
    // Include related Learning_Material__c fields
    const escapedContactId = contactId.replace(/'/g, "\\'");
    const soqlQuery = `SELECT Id, Name, Contact__c, Learning_Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Learning_Material__r.Id, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material__r.Material_Type__c, Learning_Material__r.Material_URL__c, Learning_Material__r.Duration__c, Learning_Material__r.Category__c, Learning_Material__r.Is_Active__c FROM Learning_Material_Instance__c WHERE Contact__c = '${escapedContactId}' AND Learning_Material__r.Is_Active__c = true ORDER BY CreatedDate ASC`;
    
    const encodedQuery = encodeURIComponent(soqlQuery);
    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    console.log('📤 Querying Learning Material Instances...');

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
    const records = queryData.records || [];

    // Transform records to a cleaner format
    const instances = records.map((record) => ({
      id: record.Id,
      name: record.Name,
      contactId: record.Contact__c,
      learningMaterialId: record.Learning_Material__c,
      progress: record.Progress__c || 0,
      status: record.Status__c || 'Not Started',
      score: record.Score__c || null,
      startedOn: record.Started_On__c || null,
      completedOn: record.Completed_On__c || null,
      createdDate: record.CreatedDate,
      material: record.Learning_Material__r ? {
        id: record.Learning_Material__r.Id,
        title: record.Learning_Material__r.Title__c,
        description: record.Learning_Material__r.Description__c,
        materialType: record.Learning_Material__r.Material_Type__c,
        materialUrl: record.Learning_Material__r.Material_URL__c,
        duration: record.Learning_Material__r.Duration__c || 0,
        category: record.Learning_Material__r.Category__c,
        isActive: record.Learning_Material__r.Is_Active__c,
      } : null,
    }));

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

