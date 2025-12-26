/**
 * Portal User Context
 * Manages authenticated portal user session and learning data
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSalesforce } from './SalesforceContext';
import {
  loginContact,
  fetchLearningInstances,
  updateLearningProgress,
  updateTrailheadUrl,
  type Contact,
  type LearningMaterialInstance,
  type FetchInstancesResponse,
  type UpdateProgressResponse,
  type UpdateTrailheadResponse,
  type Certificate,
} from '../services/learningService';
import { fetchCertificates, generateRetroactiveCertificates } from '../services/certificateService';

interface PortalUserContextType {
  user: Contact | null;
  instances: LearningMaterialInstance[];
  notStarted: LearningMaterialInstance[];
  inProgress: LearningMaterialInstance[];
  completed: LearningMaterialInstance[];
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshInstances: () => Promise<void>;
  refreshCertificates: () => Promise<void>;
  updateProgress: (params: {
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
  }) => Promise<UpdateProgressResponse>;
  updateTrailheadUrl: (trailheadUrl: string) => Promise<UpdateTrailheadResponse>;
}

const PortalUserContext = createContext<PortalUserContextType | undefined>(undefined);

const STORAGE_KEY = 'portal_user_data';

/**
 * Load user data from localStorage
 */
const loadStoredUser = (): Contact | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading stored user:', error);
    return null;
  }
};

/**
 * Save user data to localStorage
 */
const saveStoredUser = (user: Contact | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

interface PortalUserProviderProps {
  children: ReactNode;
}

export const PortalUserProvider = ({ children }: PortalUserProviderProps) => {
  const { authData } = useSalesforce();
  const [user, setUser] = useState<Contact | null>(null);
  const [instances, setInstances] = useState<LearningMaterialInstance[]>([]);
  const [notStarted, setNotStarted] = useState<LearningMaterialInstance[]>([]);
  const [inProgress, setInProgress] = useState<LearningMaterialInstance[]>([]);
  const [completed, setCompleted] = useState<LearningMaterialInstance[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize user from localStorage on mount
   */
  useEffect(() => {
    const storedUser = loadStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  /**
   * Fetch instances and certificates when user is logged in and auth is ready
   */
  useEffect(() => {
    if (user && authData) {
      refreshInstances();
      refreshCertificates();
    }
  }, [user, authData]);

  /**
   * Login function
   */
  const login = async (username: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginContact(username, password);
      
      if (response.success && response.contact) {
        setUser(response.contact);
        saveStoredUser(response.contact);
      } else {
        throw new Error('Login failed: Invalid response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setUser(null);
      saveStoredUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = (): void => {
    setUser(null);
    setInstances([]);
    setNotStarted([]);
    setInProgress([]);
    setCompleted([]);
    setCertificates([]);
    saveStoredUser(null);
    setError(null);
  };

  /**
   * Refresh learning instances
   */
  const refreshInstances = async (): Promise<void> => {
    if (!user || !authData) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response: FetchInstancesResponse = await fetchLearningInstances(
        user.id,
        {
          access_token: authData.access_token,
          instance_url: authData.instance_url,
        }
      );

      setInstances(response.instances);
      setNotStarted(response.notStarted);
      setInProgress(response.inProgress);
      setCompleted(response.completed);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch instances';
      setError(errorMessage);
      console.error('Error fetching instances:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update learning progress
   */
  const updateProgress = async (params: {
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
  }): Promise<UpdateProgressResponse> => {
    if (!authData) {
      throw new Error('Salesforce authentication required');
    }

    try {
      const result = await updateLearningProgress(params, {
        access_token: authData.access_token,
        instance_url: authData.instance_url,
      });

      // Refresh instances after update
      await refreshInstances();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Refresh certificates for the logged-in user
   * If user has zero certificates but completed parent courses exist, 
   * automatically generate retroactive certificates
   */
  const refreshCertificates = async (): Promise<void> => {
    if (!user || !authData) {
      return;
    }

    try {
      // First, fetch existing certificates
      const response = await fetchCertificates(user.id, {
        access_token: authData.access_token,
        instance_url: authData.instance_url,
      });

      setCertificates(response.certificates);

      // If user has zero certificates, check if they have completed parent courses
      // If yes, generate retroactive certificates
      if (response.certificates.length === 0) {
        // Check if user has any completed parent courses
        const completedParentCourses = completed.filter(
          instance => !instance.material?.isChild && instance.status === 'Completed'
        );

        if (completedParentCourses.length > 0) {
          console.log(`🔄 User has ${completedParentCourses.length} completed parent courses but no certificates. Generating retroactive certificates...`);
          
          try {
            const retroactiveResult = await generateRetroactiveCertificates(user.id, {
              access_token: authData.access_token,
              instance_url: authData.instance_url,
            });

            if (retroactiveResult.generated > 0) {
              console.log(`✅ Generated ${retroactiveResult.generated} retroactive certificate(s)`);
              
              // Refresh certificates again to show the newly generated ones
              const updatedResponse = await fetchCertificates(user.id, {
                access_token: authData.access_token,
                instance_url: authData.instance_url,
              });
              
              setCertificates(updatedResponse.certificates);
            } else {
              console.log('ℹ️ No certificates were generated (courses may not meet eligibility requirements)');
            }
          } catch (retroError) {
            console.error('Error generating retroactive certificates:', retroError);
            // Don't block UI if retroactive generation fails
          }
        } else {
          console.log('ℹ️ User has no completed parent courses, skipping retroactive certificate generation');
        }
      } else {
        // User already has certificates, skip retroactive generation
        console.log(`ℹ️ User already has ${response.certificates.length} certificate(s), skipping retroactive generation`);
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      // Don't set error state for certificates as it's not critical
    }
  };

  /**
   * Update Trailhead Profile URL
   */
  const updateTrailheadUrlHandler = async (trailheadUrl: string): Promise<UpdateTrailheadResponse> => {
    if (!authData || !user) {
      throw new Error('Salesforce authentication and user required');
    }

    try {
      const result = await updateTrailheadUrl(
        user.id,
        trailheadUrl,
        {
          access_token: authData.access_token,
          instance_url: authData.instance_url,
        }
      );

      // Update user in state and localStorage
      const updatedUser = { ...user, trailheadUrl };
      setUser(updatedUser);
      saveStoredUser(updatedUser);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update Trailhead URL';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <PortalUserContext.Provider
      value={{
        user,
        instances,
        notStarted,
        inProgress,
        completed,
        certificates,
        isLoading,
        error,
        login,
        logout,
        refreshInstances,
        refreshCertificates,
        updateProgress,
        updateTrailheadUrl: updateTrailheadUrlHandler,
      }}
    >
      {children}
    </PortalUserContext.Provider>
  );
};

/**
 * Hook to use Portal User context
 */
export const usePortalUser = (): PortalUserContextType => {
  const context = useContext(PortalUserContext);
  if (context === undefined) {
    throw new Error('usePortalUser must be used within a PortalUserProvider');
  }
  return context;
};

