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
  type Contact,
  type LearningMaterialInstance,
  type FetchInstancesResponse,
} from '../services/learningService';

interface PortalUserContextType {
  user: Contact | null;
  instances: LearningMaterialInstance[];
  notStarted: LearningMaterialInstance[];
  inProgress: LearningMaterialInstance[];
  completed: LearningMaterialInstance[];
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshInstances: () => Promise<void>;
  updateProgress: (params: {
    instanceId?: string;
    contactId?: string;
    learningMaterialId?: string;
    progress?: number;
    status?: 'Not Started' | 'In Progress' | 'Completed';
    score?: number | null;
    startedOn?: string;
    completedOn?: string;
  }) => Promise<void>;
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
   * Fetch instances when user is logged in and auth is ready
   */
  useEffect(() => {
    if (user && authData) {
      refreshInstances();
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
  }): Promise<void> => {
    if (!authData) {
      throw new Error('Salesforce authentication required');
    }

    try {
      await updateLearningProgress(params, {
        access_token: authData.access_token,
        instance_url: authData.instance_url,
      });

      // Refresh instances after update
      await refreshInstances();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
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
        isLoading,
        error,
        login,
        logout,
        refreshInstances,
        updateProgress,
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

