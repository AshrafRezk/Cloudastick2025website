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
    // Query certificate by Certificate_ID__c
    const escapedCertId = certificateId.replace(/'/g, "\\'");
    const query = `SELECT Id, Certificate_ID__c, Verification_Code__c, Contact__c, Contact__r.Name, Contact__r.Email, Learning_Material__c, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material_Instance__c, Issued_Date__c, Certificate_URL__c, PDF_File_URL__c, Status__c, Metadata__c, Learning_Material__r.Certificate_Logo_URL__c, Learning_Material__r.Certificate_Template__c FROM Certificate__c WHERE Certificate_ID__c = '${escapedCertId}' AND Status__c = 'Active' LIMIT 1`;
    
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

    const cert = data.records[0];

    // Parse metadata if present
    let metadata = {};
    if (cert.Metadata__c) {
      try {
        metadata = JSON.parse(cert.Metadata__c);
      } catch (e) {
        console.warn('Failed to parse certificate metadata:', e);
      }
    }

    console.log('✅ Certificate retrieved successfully:', cert.Certificate_ID__c);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        certificate: {
          id: cert.Id,
          certificateId: cert.Certificate_ID__c,
          verificationCode: cert.Verification_Code__c,
          contactId: cert.Contact__c,
          contactName: cert.Contact__r?.Name || '',
          contactEmail: cert.Contact__r?.Email || '',
          learningMaterialId: cert.Learning_Material__c,
          learningMaterialTitle: cert.Learning_Material__r?.Title__c || '',
          learningMaterialDescription: cert.Learning_Material__r?.Description__c || null,
          learningMaterialInstanceId: cert.Learning_Material_Instance__c,
          issuedDate: cert.Issued_Date__c,
          certificateUrl: cert.Certificate_URL__c || null,
          pdfFileUrl: cert.PDF_File_URL__c || null,
          status: cert.Status__c,
          metadata: metadata,
          certificateLogoUrl: cert.Learning_Material__r?.Certificate_Logo_URL__c || null,
          certificateTemplate: cert.Learning_Material__r?.Certificate_Template__c || null,
        },
      }),
    };
  } catch (error) {
    console.error('❌ Error in getCertificateWithAuth:', error);
    throw error;
  }
}

