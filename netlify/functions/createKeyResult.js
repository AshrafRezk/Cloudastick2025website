/**
 * Netlify Function to create a Key Result for an OKR
 * Tries multiple object and lookup field variations.
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { access_token, instance_url, okrId, name, description, target, unit, status, currentValue } =
      JSON.parse(event.body || '{}');

    if (!access_token || !instance_url || !okrId || !name) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    const krObjects = ['Key_Result__c', 'OKR_Key_Result__c', 'KR__c'];
    const lookupFields = ['OKR__c', 'Objective__c', 'Parent_OKR__c'];
    const statusFields = ['Status__c', 'Status'];
    const targetFields = ['Target__c', 'Target'];
    const currentFields = ['Current_Value__c', 'CurrentValue__c', 'Current__c'];
    const descriptionFields = ['Description__c', 'Key_Result__c', 'Details__c'];
    const unitFields = ['Unit__c', 'Unit'];

    let createdId = null;
    let usedObject = null;

    for (const obj of krObjects) {
      for (const lookup of lookupFields) {
        try {
          const body = {
            Name: name,
            [lookup]: okrId,
          };

          const descField = descriptionFields.find(() => true);
          if (description) body[descField] = description;

          if (target !== undefined && target !== null) {
            const targetField = targetFields.find(() => true);
            body[targetField] = target;
          }

          if (currentValue !== undefined && currentValue !== null) {
            const currentField = currentFields.find(() => true);
            body[currentField] = currentValue;
          }

          if (unit) {
            const unitField = unitFields.find(() => true);
            body[unitField] = unit;
          }

          if (status) {
            const statusField = statusFields.find(() => true);
            body[statusField] = status;
          }

          const url = `${instance_url}/services/data/v58.0/sobjects/${obj}`;
          const resp = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          if (resp.ok) {
            const data = await resp.json();
            if (data.id) {
              createdId = data.id;
              usedObject = obj;
              break;
            }
          } else {
            const text = await resp.text();
            console.warn(`Failed creating Key Result on ${obj} via ${lookup}:`, text);
          }
        } catch (e) {
          continue;
        }
      }
      if (createdId) break;
    }

    if (!createdId) {
      throw new Error('Failed to create Key Result with available object/field combinations');
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        id: createdId,
        object: usedObject,
      }),
    };
  } catch (error) {
    console.error('❌ Error creating Key Result:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Failed to create Key Result',
        message: error.message || 'An unexpected error occurred',
      }),
    };
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

