/**
 * Netlify Function to verify a certificate using certificate ID or verification code
 * Public endpoint for certificate verification
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
    console.log('🔍 Verify Certificate - Request received');

    let certificateId, verificationCode;
    
    if (event.httpMethod === 'GET') {
      certificateId = event.queryStringParameters?.certificateId;
      verificationCode = event.queryStringParameters?.verificationCode;
    } else {
      const body = JSON.parse(event.body || '{}');
      certificateId = body.certificateId;
      verificationCode = body.verificationCode;
    }

    if (!certificateId && !verificationCode) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing parameters',
          message: 'Either certificateId or verificationCode is required',
        }),
      };
    }

    // Get Salesforce access token
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

    // Build query based on provided identifier
    let query;
    if (certificateId) {
      const escapedCertId = certificateId.replace(/'/g, "\\'");
      query = `SELECT Id, Certificate_ID__c, Verification_Code__c, Contact__c, Contact__r.Name, Contact__r.Email, Learning_Material__c, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material_Instance__c, Issued_Date__c, Certificate_URL__c, PDF_File_URL__c, Status__c, Metadata__c, Learning_Material__r.Certificate_Logo_URL__c, Learning_Material__r.Certificate_Template__c FROM Certificate__c WHERE Certificate_ID__c = '${escapedCertId}' LIMIT 1`;
    } else if (verificationCode) {
      const escapedCode = verificationCode.replace(/'/g, "\\'");
      query = `SELECT Id, Certificate_ID__c, Verification_Code__c, Contact__c, Contact__r.Name, Contact__r.Email, Learning_Material__c, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material_Instance__c, Issued_Date__c, Certificate_URL__c, PDF_File_URL__c, Status__c, Metadata__c, Learning_Material__r.Certificate_Logo_URL__c, Learning_Material__r.Certificate_Template__c FROM Certificate__c WHERE Verification_Code__c = '${escapedCode}' LIMIT 1`;
    }

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
          error: 'Failed to verify certificate',
          message: errorText,
        }),
      };
    }

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valid: false,
          certificate: null,
          message: 'Certificate not found or invalid',
        }),
      };
    }

    const cert = data.records[0];

    // Check if certificate is revoked
    if (cert.Status__c !== 'Active') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valid: false,
          certificate: null,
          message: 'Certificate has been revoked',
        }),
      };
    }

    // Parse metadata if present
    let metadata = {};
    if (cert.Metadata__c) {
      try {
        metadata = JSON.parse(cert.Metadata__c);
      } catch (e) {
        console.warn('Failed to parse certificate metadata:', e);
      }
    }

    console.log('✅ Certificate verified successfully:', cert.Certificate_ID__c);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valid: true,
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
        message: 'Certificate is valid',
      }),
    };
  } catch (error) {
    console.error('❌ Error verifying certificate:', error);
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

