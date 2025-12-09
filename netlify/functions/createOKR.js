/**
 * Netlify Function to create an OKR (Objective) record for a Contact
 * Since OKR.Owner__c is a User lookup and Contact.Associated_User__c links to User,
 * we get the Contact's Associated_User__c and use it for Owner__c
 * Tries multiple object and field name variations.
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
    const { access_token, instance_url, contactId, objective, status, period, year, startDate, endDate, progress } =
      JSON.parse(event.body || '{}');

    if (!access_token || !instance_url || !contactId || !objective) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Get the Contact's Associated_User__c (User ID) since OKR.Owner__c is a User lookup
    const escapedContactId = contactId.replace(/'/g, "\\'");
    const contactQuery = `SELECT Id, Associated_User__c FROM Contact WHERE Id = '${escapedContactId}' LIMIT 1`;
    const contactEncoded = encodeURIComponent(contactQuery);
    const contactUrl = `${instance_url}/services/data/v58.0/query/?q=${contactEncoded}`;

    const contactResponse = await fetch(contactUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    let userId = null;
    if (contactResponse.ok) {
      const contactData = await contactResponse.json();
      if (contactData.records && contactData.records.length > 0) {
        userId = contactData.records[0].Associated_User__c;
      }
    }

    if (!userId) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Contact does not have an Associated User' }),
      };
    }

    const escapedObjective = objective;
    const yearValue = year || new Date().getFullYear();

    const okrObjects = ['OKR__c', 'Objective__c'];
    // Owner__c is a User lookup - use userId
    // Also try other field variations as fallback
    const userFields = ['Owner__c']; // Primary: User lookup
    const contactFields = ['Contact__c', 'Employee__c', 'OwnerId', 'ContactId']; // Fallback
    const periodFields = ['Period__c', 'Quarter__c', 'Quarter'];
    const statusFields = ['Status__c', 'Status'];
    const progressFields = ['Progress__c', 'Progress'];

    let createdId = null;
    let usedObject = null;

    for (const obj of okrObjects) {
      // Try Owner__c with userId first (correct relationship)
      for (const userField of userFields) {
        try {
          const body = {
            Name: escapedObjective,
            Objective__c: escapedObjective,
            Objective_Description__c: escapedObjective,
            [userField]: userId, // Use User ID for Owner__c
            Year__c: yearValue,
          };

          if (status) {
            const statusField = statusFields.find(() => true);
            body[statusField] = status;
          }
          if (period) {
            const periodField = periodFields.find(() => true);
            body[periodField] = period;
          }
          if (startDate) body.Start_Date__c = startDate;
          if (endDate) body.End_Date__c = endDate;
          if (progress !== undefined && progress !== null) {
            const progressField = progressFields.find(() => true);
            body[progressField] = progress;
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
            console.warn(`Failed creating OKR on ${obj} via ${userField}:`, text);
          }
        } catch (e) {
          continue;
        }
      }
      if (createdId) break;
      
      // Fallback: try contact fields if Owner__c didn't work
      if (!createdId) {
        for (const contactField of contactFields) {
          try {
            const body = {
              Name: escapedObjective,
              Objective__c: escapedObjective,
              Objective_Description__c: escapedObjective,
              [contactField]: contactId, // Fallback: use Contact ID
              Year__c: yearValue,
            };

            if (status) {
              const statusField = statusFields.find(() => true);
              body[statusField] = status;
            }
            if (period) {
              const periodField = periodFields.find(() => true);
              body[periodField] = period;
            }
            if (startDate) body.Start_Date__c = startDate;
            if (endDate) body.End_Date__c = endDate;
            if (progress !== undefined && progress !== null) {
              const progressField = progressFields.find(() => true);
              body[progressField] = progress;
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
              console.warn(`Failed creating OKR on ${obj} via ${contactField}:`, text);
            }
          } catch (e) {
            continue;
          }
        }
        if (createdId) break;
      }
    }

    if (!createdId) {
      throw new Error('Failed to create OKR with available object/field combinations');
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
    console.error('❌ Error creating OKR:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Failed to create OKR',
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

