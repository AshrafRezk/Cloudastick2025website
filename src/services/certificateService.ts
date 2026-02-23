/**
 * Certificate Service
 * Handles API calls for certificate functionality
 */

import {
  type Certificate,
  type CertificateVerificationResponse,
  type FetchCertificatesResponse,
} from './learningService';

/**
 * Get certificate by certificate ID (public endpoint)
 * Note: Certificates are automatically generated when courses are completed.
 * No manual generation function is needed.
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
  recipientName?: string
): Promise<CertificateVerificationResponse> => {
  try {
    if (!certificateId && !recipientName) {
      throw new Error('Either certificateId or recipientName is required');
    }

    const response = await fetch('/.netlify/functions/verifyCertificate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        certificateId,
        recipientName,
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
    // Query completed parent instances (courses) with certificate data for the contact
    // Certificates are identified by Name field starting with 'CERT-'
    // Only parent materials (courses) have certificates, not child materials
    const escapedContactId = contactId.replace(/'/g, "\\'");
    const query = `SELECT Id, Name, Learner__c, Learner__r.Name, Material__c, Material__r.Id, Material__r.Title__c, Material__r.Description__c, Material__r.Certificate_Logo_URL__c, Material__r.Certificate_Template__c, Material__r.Parent_Material__c, Status__c, Completed_On__c FROM Learning_Material_Instance__c WHERE Learner__c = '${escapedContactId}' AND Status__c = 'Completed' AND Name LIKE 'CERT-%' AND Material__r.Parent_Material__c = null ORDER BY Completed_On__c DESC`;

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

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cloudastick.com';

    const certificates: Certificate[] = records.map((instance: any) => {
      // Parse certificate data from Name field (format: CERT-{InstanceId}|{VerificationCode})
      let verificationCode = '';
      if (instance.Name && instance.Name.includes('|')) {
        const parts = instance.Name.split('|');
        if (parts.length >= 2) {
          verificationCode = parts[1];
        }
      }

      const certificateId = `CERT-${instance.Id}`;
      const certificateUrl = `${baseUrl}/certificate/${certificateId}`;
      const issuedDate = instance.Completed_On__c ? instance.Completed_On__c.split('T')[0] : new Date().toISOString().split('T')[0];

      return {
        id: instance.Id,
        certificateId: certificateId,
        verificationCode: verificationCode,
        contactId: instance.Learner__c,
        contactName: instance.Learner__r?.Name || '',
        learningMaterialId: instance.Material__c,
        learningMaterialTitle: instance.Material__r?.Title__c || '',
        learningMaterialDescription: instance.Material__r?.Description__c || null,
        learningMaterialInstanceId: instance.Id,
        issuedDate: issuedDate,
        certificateUrl: certificateUrl,
        pdfFileUrl: null,
        status: 'Active' as const,
        metadata: {},
        certificateLogoUrl: instance.Material__r?.Certificate_Logo_URL__c || null,
        certificateTemplate: instance.Material__r?.Certificate_Template__c || null,
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
 * Generate retroactive certificates for already-completed courses
 * Called when a user has zero certificates but has completed parent courses
 */
export const generateRetroactiveCertificates = async (
  contactId: string,
  authData: { access_token: string; instance_url: string }
): Promise<{ generated: number; message: string }> => {
  try {
    const response = await fetch('/.netlify/functions/generateRetroactiveCertificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactId,
        access_token: authData.access_token,
        instance_url: authData.instance_url,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to generate retroactive certificates: ${response.status}`);
    }

    const data = await response.json();
    return {
      generated: data.generated || 0,
      message: data.message || 'Retroactive certificate generation completed',
    };
  } catch (error) {
    console.error('Generate retroactive certificates error:', error);
    throw error;
  }
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

