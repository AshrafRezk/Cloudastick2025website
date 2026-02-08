/**
 * Netlify Function to retrieve certificate data by certificate ID
 * Public endpoint for viewing certificates
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  // Allow both GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📜 Get Certificate - Request received');

    let certificateId;

    if (event.httpMethod === 'GET') {
      // Extract certificate ID from query string or path
      certificateId = event.queryStringParameters?.certificateId || event.path?.split('/').pop();
    } else {
      // POST request
      const { certificateId: certId, access_token, instance_url } = JSON.parse(event.body || '{}');
      certificateId = certId;

      // If access_token is provided, use it (for authenticated requests)
      if (access_token && instance_url) {
        return await getCertificateWithAuth(certificateId, access_token, instance_url);
      }
    }

    if (!certificateId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing certificate ID',
          message: 'certificateId is required',
        }),
      };
    }

    // For public access, we need to use a system user or guest access
    // This requires Salesforce authentication - using environment variables
    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

    if (!clientId || !clientSecret || !tokenUrl) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Salesforce credentials not configured',
        }),
      };
    }

    // Get Salesforce access token
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', clientId);
    formData.append('client_secret', clientSecret);

    const authResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('Salesforce authentication failed:', errorText);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to authenticate with Salesforce',
        }),
      };
    }

    const authData = await authResponse.json();
    const { access_token, instance_url } = authData;

    return await getCertificateWithAuth(certificateId, access_token, instance_url);
  } catch (error) {
    console.error('❌ Error getting certificate:', error);
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

async function getCertificateWithAuth(certificateId, access_token, instance_url) {
  try {
    // Extract instance ID from certificate ID (format: CERT-{InstanceId})
    let instanceId;
    if (certificateId.startsWith('CERT-')) {
      instanceId = certificateId.substring(5); // Remove 'CERT-' prefix
    } else {
      // If it's not in CERT- format, assume it's the instance ID itself
      instanceId = certificateId;
    }

    // Query Learning_Material_Instance__c by ID
    // Certificate is identified by Name field starting with 'CERT-'
    const escapedInstanceId = instanceId.replace(/'/g, "\\'");
    const query = `SELECT Id, Name, Learner__c, Learner__r.Name, Learner__r.Email, Material__c, Material__r.Id, Material__r.Title__c, Material__r.Description__c, Material__r.Certificate_Logo_URL__c, Material__r.Certificate_Template__c, Status__c, Completed_On__c FROM Learning_Material_Instance__c WHERE Id = '${escapedInstanceId}' AND Status__c = 'Completed' LIMIT 1`;

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
      console.error('Failed to query certificate:', errorText);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to query certificate',
          message: errorText,
        }),
      };
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Certificate not found',
          message: 'No active certificate found with the provided ID',
        }),
      };
    }

    const instance = data.records[0];

    // Parse certificate data from Name field (format: CERT-{InstanceId}|{VerificationCode})
    let verificationCode = '';
    if (instance.Name && instance.Name.includes('|')) {
      const parts = instance.Name.split('|');
      if (parts.length >= 2) {
        verificationCode = parts[1];
      }
    }

    const certificateIdFormatted = `CERT-${instance.Id}`;
    const baseUrl = process.env.CERTIFICATE_BASE_URL || 'https://cloudastick.com';
    const certificateUrl = `${baseUrl}/certificate/${certificateIdFormatted}`;
    const issuedDate = instance.Completed_On__c ? instance.Completed_On__c.split('T')[0] : new Date().toISOString().split('T')[0];

    console.log('✅ Certificate retrieved successfully:', certificateIdFormatted);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        certificate: {
          id: instance.Id,
          certificateId: certificateIdFormatted,
          verificationCode: verificationCode,
          contactId: instance.Learner__c,
          contactName: instance.Learner__r?.Name || '',
          contactEmail: instance.Learner__r?.Email || '',
          learningMaterialId: instance.Material__c,
          learningMaterialTitle: instance.Material__r?.Title__c || '',
          learningMaterialDescription: instance.Material__r?.Description__c || null,
          learningMaterialInstanceId: instance.Id,
          issuedDate: issuedDate,
          certificateUrl: certificateUrl,
          pdfFileUrl: null,
          status: 'Active',
          metadata: {},
          certificateLogoUrl: instance.Material__r?.Certificate_Logo_URL__c || null,
          certificateTemplate: instance.Material__r?.Certificate_Template__c || null,
        },
      }),
    };
  } catch (error) {
    console.error('❌ Error in getCertificateWithAuth:', error);
    throw error;
  }
}

