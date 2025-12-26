/**
 * Netlify Function to generate a certificate for a completed course
 * Creates a Certificate__c record in Salesforce with unique ID and verification code
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
    console.log('🎓 Generate Certificate - Request received');

    const {
      access_token,
      instance_url,
      contactId,
      learningMaterialId,
      learningMaterialInstanceId,
      metadata,
    } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url || !contactId || !learningMaterialId || !learningMaterialInstanceId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing required parameters',
          message: 'access_token, instance_url, contactId, learningMaterialId, and learningMaterialInstanceId are required',
        }),
      };
    }

    // Generate unique certificate ID (UUID v4)
    const generateCertificateId = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Generate 8-character alphanumeric verification code
    const generateVerificationCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const certificateId = generateCertificateId();
    const verificationCode = generateVerificationCode();
    const issuedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Check if certificate already exists for this contact + material combination
    const checkExistingQuery = `SELECT Id, Certificate_ID__c FROM Certificate__c WHERE Contact__c = '${contactId.replace(/'/g, "\\'")}' AND Learning_Material__c = '${learningMaterialId.replace(/'/g, "\\'")}' AND Status__c = 'Active' LIMIT 1`;
    const encodedCheckQuery = encodeURIComponent(checkExistingQuery);
    const checkQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedCheckQuery}`;

    const checkResponse = await fetch(checkQueryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.records && checkData.records.length > 0) {
        console.log('⚠️ Certificate already exists for this contact and material');
        // Return existing certificate
        const existingCert = checkData.records[0];
        
        // Fetch full certificate details
        const certQuery = `SELECT Id, Certificate_ID__c, Verification_Code__c, Contact__c, Contact__r.Name, Learning_Material__c, Learning_Material__r.Title__c, Learning_Material_Instance__c, Issued_Date__c, Certificate_URL__c, PDF_File_URL__c, Status__c, Metadata__c, Learning_Material__r.Certificate_Logo_URL__c, Learning_Material__r.Certificate_Template__c FROM Certificate__c WHERE Id = '${existingCert.Id.replace(/'/g, "\\'")}' LIMIT 1`;
        const encodedCertQuery = encodeURIComponent(certQuery);
        const certQueryUrl = `${instance_url}/services/data/v58.0/query/?q=${encodedCertQuery}`;
        
        const certResponse = await fetch(certQueryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (certResponse.ok) {
          const certData = await certResponse.json();
          const cert = certData.records[0];
          
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
                learningMaterialId: cert.Learning_Material__c,
                learningMaterialTitle: cert.Learning_Material__r?.Title__c || '',
                learningMaterialInstanceId: cert.Learning_Material_Instance__c,
                issuedDate: cert.Issued_Date__c,
                certificateUrl: cert.Certificate_URL__c || null,
                pdfFileUrl: cert.PDF_File_URL__c || null,
                status: cert.Status__c,
                metadata: cert.Metadata__c ? JSON.parse(cert.Metadata__c) : {},
                certificateLogoUrl: cert.Learning_Material__r?.Certificate_Logo_URL__c || null,
                certificateTemplate: cert.Learning_Material__r?.Certificate_Template__c || null,
              },
              message: 'Certificate already exists',
            }),
          };
        }
      }
    }

    // Fetch contact and material details for certificate URL generation
    const contactQuery = `SELECT Id, Name FROM Contact WHERE Id = '${contactId.replace(/'/g, "\\'")}' LIMIT 1`;
    const materialQuery = `SELECT Id, Title__c, Certificate_Logo_URL__c, Certificate_Template__c FROM Learning_Material__c WHERE Id = '${learningMaterialId.replace(/'/g, "\\'")}' LIMIT 1`;

    const [contactResponse, materialResponse] = await Promise.all([
      fetch(`${instance_url}/services/data/v58.0/query/?q=${encodeURIComponent(contactQuery)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${instance_url}/services/data/v58.0/query/?q=${encodeURIComponent(materialQuery)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    const contactData = await contactResponse.json();
    const materialData = await materialResponse.json();

    const contact = contactData.records?.[0];
    const material = materialData.records?.[0];

    if (!contact || !material) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Contact or Learning Material not found',
        }),
      };
    }

    // Generate certificate URL (base URL will be set by frontend)
    const baseUrl = process.env.CERTIFICATE_BASE_URL || 'https://cloudastick.com';
    const certificateUrl = `${baseUrl}/certificate/${certificateId}`;

    // Create certificate record
    const certificateData = {
      Contact__c: contactId,
      Learning_Material__c: learningMaterialId,
      Learning_Material_Instance__c: learningMaterialInstanceId,
      Certificate_ID__c: certificateId,
      Verification_Code__c: verificationCode,
      Issued_Date__c: issuedDate,
      Certificate_URL__c: certificateUrl,
      Status__c: 'Active',
      Metadata__c: metadata ? JSON.stringify(metadata) : null,
    };

    const createUrl = `${instance_url}/services/data/v58.0/sobjects/Certificate__c`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(certificateData),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Failed to create certificate:', errorText);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to create certificate',
          message: errorText,
        }),
      };
    }

    const createdCert = await createResponse.json();

    console.log('✅ Certificate created successfully:', createdCert.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        certificate: {
          id: createdCert.id,
          certificateId: certificateId,
          verificationCode: verificationCode,
          contactId: contactId,
          contactName: contact.Name,
          learningMaterialId: learningMaterialId,
          learningMaterialTitle: material.Title__c,
          learningMaterialInstanceId: learningMaterialInstanceId,
          issuedDate: issuedDate,
          certificateUrl: certificateUrl,
          pdfFileUrl: null,
          status: 'Active',
          metadata: metadata || {},
          certificateLogoUrl: material.Certificate_Logo_URL__c || null,
          certificateTemplate: material.Certificate_Template__c || null,
        },
        message: 'Certificate generated successfully',
      }),
    };
  } catch (error) {
    console.error('❌ Error generating certificate:', error);
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

