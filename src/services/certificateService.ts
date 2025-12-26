/**
 * Certificate Service
 * Handles API calls for certificate functionality
 */

import {
  type Certificate,
  type CertificateGenerationRequest,
  type CertificateGenerationResponse,
  type CertificateVerificationResponse,
  type FetchCertificatesResponse,
} from './learningService';

/**
 * Generate a certificate for a completed course
 */
export const generateCertificate = async (
  request: CertificateGenerationRequest,
  authData: { access_token: string; instance_url: string }
): Promise<CertificateGenerationResponse> => {
  try {
    const response = await fetch('/.netlify/functions/generateCertificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        ...request,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to generate certificate: ${response.status}`);
    }

    const data: CertificateGenerationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Generate certificate error:', error);
    throw error;
  }
};

/**
 * Get certificate by certificate ID (public endpoint)
 */
export const getCertificate = async (certificateId: string): Promise<Certificate | null> => {
  try {
    const response = await fetch('/.netlify/functions/getCertificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificateId }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to get certificate: ${response.status}`);
    }

    const data = await response.json();
    return data.certificate || null;
  } catch (error) {
    console.error('Get certificate error:', error);
    throw error;
  }
};

/**
 * Verify certificate using certificate ID or verification code
 */
export const verifyCertificate = async (
  certificateId?: string,
  verificationCode?: string
): Promise<CertificateVerificationResponse> => {
  try {
    if (!certificateId && !verificationCode) {
      throw new Error('Either certificateId or verificationCode is required');
    }

    const response = await fetch('/.netlify/functions/verifyCertificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        certificateId,
        verificationCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to verify certificate: ${response.status}`);
    }

    const data: CertificateVerificationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Verify certificate error:', error);
    throw error;
  }
};

/**
 * Fetch all certificates for a contact
 */
export const fetchCertificates = async (
  contactId: string,
  authData: { access_token: string; instance_url: string }
): Promise<FetchCertificatesResponse> => {
  try {
    // Query certificates for the contact
    const query = `SELECT Id, Certificate_ID__c, Verification_Code__c, Contact__c, Contact__r.Name, Learning_Material__c, Learning_Material__r.Title__c, Learning_Material_Instance__c, Issued_Date__c, Certificate_URL__c, PDF_File_URL__c, Status__c, Metadata__c, Learning_Material__r.Certificate_Logo_URL__c, Learning_Material__r.Certificate_Template__c FROM Certificate__c WHERE Contact__c = '${contactId.replace(/'/g, "\\'")}' AND Status__c = 'Active' ORDER BY Issued_Date__c DESC`;
    
    const encodedQuery = encodeURIComponent(query);
    const queryUrl = `${authData.instance_url}/services/data/v58.0/query/?q=${encodedQuery}`;

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch certificates: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const records = data.records || [];

    const certificates: Certificate[] = records.map((cert: any) => {
      let metadata = {};
      if (cert.Metadata__c) {
        try {
          metadata = JSON.parse(cert.Metadata__c);
        } catch (e) {
          console.warn('Failed to parse certificate metadata:', e);
        }
      }

      return {
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
        status: cert.Status__c as 'Active' | 'Revoked',
        metadata: metadata,
        certificateLogoUrl: cert.Learning_Material__r?.Certificate_Logo_URL__c || null,
        certificateTemplate: cert.Learning_Material__r?.Certificate_Template__c || null,
      };
    });

    return {
      certificates,
      total: certificates.length,
    };
  } catch (error) {
    console.error('Fetch certificates error:', error);
    throw error;
  }
};

/**
 * Get certificate URL for a certificate ID
 */
export const getCertificateUrl = (certificateId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/certificate/${certificateId}`;
};

/**
 * Get verification URL
 */
export const getVerificationUrl = (certificateId?: string, verificationCode?: string): string => {
  const baseUrl = window.location.origin;
  if (certificateId) {
    return `${baseUrl}/verify-certificate?certificateId=${encodeURIComponent(certificateId)}`;
  } else if (verificationCode) {
    return `${baseUrl}/verify-certificate?verificationCode=${encodeURIComponent(verificationCode)}`;
  }
  return `${baseUrl}/verify-certificate`;
};

