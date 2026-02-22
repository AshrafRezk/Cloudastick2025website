/**
 * Learning Service
 * Handles API calls for the LMS portal functionality
 */

import { useSalesforce } from '../contexts/SalesforceContext';

export interface Contact {
  id: string;
  name: string;
  email: string;
  linkedInUrl: string | null;
  trailheadUrl: string | null;
  numberOfCertifications: number;
  certificationsList: string | null;
  portalLMSAccess?: boolean;
  portalSalesAccess?: boolean;
  portalCMSAccess?: boolean;
  portalCPMAccess?: boolean;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description: string | null;
  materialType: string;
  materialUrl: string | null;
  duration: number;
  category: string | null;
  isActive: boolean;
  parentId: string | null;
  isChild: boolean;
  childMaterials?: LearningMaterial[]; // Child materials nested under parent modules
  instance?: {
    id: string;
    name: string;
    progress: number;
    status: string;
    score?: number | null;
    startedOn?: string | null;
    completedOn?: string | null;
  }; // Instance data for child materials
  // Quiz-related fields
  quizQuestions?: string | null; // JSON string from Quiz_Questions_c
  passingScore?: number | null; // from Passing_Score_c
  quizTimeLimitMinutes?: number | null; // from Quiz_Time_Limit_Minutes_c
  maxAttempts?: number | null; // from Max_Attempts_c
  showResults?: boolean | null; // from Show_Results_c
  randomizeQuestions?: boolean | null; // from Randomize_Questions_c
}

export interface LearningMaterialInstance {
  id: string;
  name: string;
  contactId: string;
  learningMaterialId: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  score: number | null;
  startedOn: string | null;
  completedOn: string | null;
  createdDate: string;
  material: LearningMaterial | null;
  isParent?: boolean; // Flag to identify parent instances (modules with children)
  // Quiz attempt tracking fields
  attemptNumber?: number | null; // from Attempt_Number_c
  timeTakenMinutes?: number | null; // from Time_Taken_Minutes_c
}

export interface LoginResponse {
  success: boolean;
  contact: Contact;
}

export interface FetchInstancesResponse {
  instances: LearningMaterialInstance[];
  notStarted: LearningMaterialInstance[];
  inProgress: LearningMaterialInstance[];
  completed: LearningMaterialInstance[];
  total: number;
}

export interface UpdateProgressResponse {
  success: boolean;
  instanceId: string;
  created?: boolean;
  updated?: boolean;
}

export interface UpdateTrailheadResponse {
  success: boolean;
  message: string;
  contactId: string;
  trailheadUrl: string;
}

// Quiz-related interfaces
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single-choice' | 'multi-choice';
  options: string[];
  correctAnswer: number | number[]; // Index or array of indices for correct answers
  points: number;
  explanation?: string;
}

export interface QuizData {
  version: string;
  totalQuestions: number;
  totalPoints: number;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: string;
  answer: number | number[]; // Selected answer index(es)
}

export interface QuizResult {
  score: number; // Percentage score
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeTakenMinutes: number;
}

// Certificate-related interfaces
export interface Certificate {
  id: string;
  certificateId: string; // Certificate_ID__c - unique identifier for public links
  verificationCode: string; // Verification_Code__c
  contactId: string;
  contactName: string;
  learningMaterialId: string;
  learningMaterialTitle: string;
  learningMaterialInstanceId: string;
  issuedDate: string; // ISO date string
  certificateUrl: string | null;
  pdfFileUrl: string | null;
  status: 'Active' | 'Revoked';
  metadata?: Record<string, any>; // Parsed from Metadata__c JSON
  // Additional fields from related objects
  certificateLogoUrl?: string | null; // From Learning_Material__c.Certificate_Logo_URL__c
  certificateTemplate?: string | null; // From Learning_Material__c.Certificate_Template__c
}

export interface CertificateGenerationRequest {
  contactId: string;
  learningMaterialId: string;
  learningMaterialInstanceId: string;
  metadata?: Record<string, any>;
}

export interface CertificateGenerationResponse {
  success: boolean;
  certificate: Certificate | null;
  message?: string;
}

export interface CertificateVerificationResponse {
  valid: boolean;
  certificates: Certificate[]; // Changed from single certificate to array
  message?: string;
}

export interface FetchCertificatesResponse {
  certificates: Certificate[];
  total: number;
}

/**
 * Login with portal credentials
 */
export const loginContact = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch('/.netlify/functions/contactLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Login with sales portal credentials (checks Portal_Sales_Access__c)
 */
export const loginSalesContact = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch('/.netlify/functions/salesLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Sales login error:', error);
    throw error;
  }
};

/**
 * Fetch learning material instances for a contact
 */
export const fetchLearningInstances = async (
  contactId: string,
  authData: { access_token: string; instance_url: string }
): Promise<FetchInstancesResponse> => {
  try {
    const response = await fetch('/.netlify/functions/fetchLearningInstances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        contactId,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text || `Failed to fetch instances: ${response.status}` };
        }
      } catch (e) {
        errorData = { message: `Failed to fetch instances: ${response.status}` };
      }
      throw new Error(errorData.message || errorData.error || `Failed to fetch instances: ${response.status}`);
    }

    const data: FetchInstancesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch instances error:', error);
    throw error;
  }
};

/**
 * Update learning material instance progress
 */
export const updateLearningProgress = async (
  params: {
    instanceId?: string;
    contactId?: string;
    learningMaterialId?: string;
    progress?: number;
    status?: 'Not Started' | 'In Progress' | 'Completed';
    score?: number | null;
    startedOn?: string;
    completedOn?: string;
    attemptNumber?: number | null;
    timeTakenMinutes?: number | null;
  },
  authData: { access_token: string; instance_url: string }
): Promise<UpdateProgressResponse> => {
  try {
    const response = await fetch('/.netlify/functions/updateLearningProgress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        ...params,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update progress: ${response.status}`);
    }

    const data: UpdateProgressResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Update progress error:', error);
    throw error;
  }
};

/**
 * Update Contact's Trailhead Profile URL
 */
export const updateTrailheadUrl = async (
  contactId: string,
  trailheadUrl: string,
  authData: { access_token: string; instance_url: string }
): Promise<UpdateTrailheadResponse> => {
  try {
    const response = await fetch('/.netlify/functions/updateContactTrailhead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        contactId,
        trailheadUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update Trailhead URL: ${response.status}`);
    }

    const data: UpdateTrailheadResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Update Trailhead URL error:', error);
    throw error;
  }
};

/**
 * Fetch current quiz attempt number for a learner and material
 */
export const fetchQuizAttemptNumber = async (
  contactId: string,
  learningMaterialId: string,
  authData: { access_token: string; instance_url: string }
): Promise<number> => {
  try {
    const response = await fetch('/.netlify/functions/fetchQuizAttemptNumber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        contactId,
        learningMaterialId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch attempt number: ${response.status}`);
    }

    const data = await response.json();
    return data.maxAttemptNumber || 0;
  } catch (error) {
    console.error('Fetch quiz attempt number error:', error);
    throw error;
  }
};

