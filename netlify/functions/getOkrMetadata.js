/**
 * Netlify Function to fetch OKR metadata (picklists and field names)
 * Attempts multiple object and field name variations to maximize compatibility.
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

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { access_token, instance_url } = JSON.parse(event.body || '{}');
    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ error: 'Missing access_token or instance_url' }),
      };
    }

    // Candidate object names
    const okrObjects = ['OKR__c', 'Objective__c'];
    const krObjects = ['Key_Result__c', 'OKR_Key_Result__c', 'KR__c'];

    const okrMetadata = await describeFirstAvailable(okrObjects, access_token, instance_url);
    const krMetadata = await describeFirstAvailable(krObjects, access_token, instance_url);

    const picklists = {
      okrStatus: getPicklistValues(okrMetadata, ['Status__c', 'Status']),
      okrPeriod: getPicklistValues(okrMetadata, ['Period__c', 'Quarter__c', 'Quarter']),
      krStatus: getPicklistValues(krMetadata, ['Status__c', 'Status']),
      krUnit: getPicklistValues(krMetadata, ['Unit__c', 'Unit']),
    };

    const lookupFields = {
      // Owner__c is a User lookup, not Contact - prioritize it for User relationship
      okrOwnerField: findFirstField(okrMetadata, ['Owner__c']), // User lookup
      okrContactField: findFirstField(okrMetadata, ['Contact__c', 'Employee__c', 'OwnerId', 'ContactId']), // Fallback fields
      krOkrLookupField: findFirstField(krMetadata, ['OKR__c', 'Objective__c', 'Parent_OKR__c']),
    };

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({
        success: true,
        okrObject: okrMetadata?.name || null,
        krObject: krMetadata?.name || null,
        picklists,
        lookupFields,
      }),
    };
  } catch (error) {
    console.error('❌ Error fetching OKR metadata:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: 'Failed to fetch OKR metadata',
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

async function describeFirstAvailable(objects, access_token, instance_url) {
  for (const obj of objects) {
    try {
      const url = `${instance_url}/services/data/v58.0/sobjects/${obj}/describe`;
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      if (resp.ok) {
        const data = await resp.json();
        return data;
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}

function getPicklistValues(meta, fieldNames) {
  if (!meta || !meta.fields) return [];
  for (const name of fieldNames) {
    const field = meta.fields.find((f) => f.name === name);
    if (field && Array.isArray(field.picklistValues)) {
      return field.picklistValues.map((p) => p.value).filter(Boolean);
    }
  }
  return [];
}

function findFirstField(meta, fieldNames) {
  if (!meta || !meta.fields) return null;
  for (const name of fieldNames) {
    const field = meta.fields.find((f) => f.name === name);
    if (field) return field.name;
  }
  return null;
}

