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
    progress: number;
    status: string;
    startedOn?: string | null;
    completedOn?: string | null;
  }; // Instance data for child materials
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

