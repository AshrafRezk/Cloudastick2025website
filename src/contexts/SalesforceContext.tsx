/**
 * Salesforce Context
 * Manages Salesforce authentication state and provides access token throughout the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authenticateSalesforce, refreshTokenIfNeeded, type SalesforceAuthResponse } from '../services/salesforceService';

interface SalesforceContextType {
  authData: SalesforceAuthResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshAuth: () => Promise<void>;
}

const SalesforceContext = createContext<SalesforceContextType | undefined>(undefined);

const STORAGE_KEY = 'salesforce_auth_data';
const STORAGE_EXPIRY_KEY = 'salesforce_auth_expires_at';

/**
 * Load auth data from localStorage
 */
const loadStoredAuth = (): SalesforceAuthResponse | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const expiresAt = localStorage.getItem(STORAGE_EXPIRY_KEY);
    
    if (!stored || !expiresAt) {
      return null;
    }

    const authData: SalesforceAuthResponse = JSON.parse(stored);
    const expiryTime = parseInt(expiresAt, 10);

    // Check if token is still valid
    if (Date.now() >= expiryTime) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_EXPIRY_KEY);
      return null;
    }

    return authData;
  } catch (error) {
    console.error('Error loading stored auth:', error);
    return null;
  }
};

/**
 * Save auth data to localStorage
 */
const saveStoredAuth = (authData: SalesforceAuthResponse): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem(STORAGE_EXPIRY_KEY, authData.expires_at.toString());
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

interface SalesforceProviderProps {
  children: ReactNode;
}

export const SalesforceProvider = ({ children }: SalesforceProviderProps) => {
  const [authData, setAuthData] = useState<SalesforceAuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Authenticate with Salesforce
   */
  const refreshAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if we can refresh existing token
      const refreshed = await refreshTokenIfNeeded(authData);
      
      if (refreshed) {
        setAuthData(refreshed);
        saveStoredAuth(refreshed);
      } else {
        // If refresh didn't return a token, authenticate fresh
        const newAuth = await authenticateSalesforce();
        setAuthData(newAuth);
        saveStoredAuth(newAuth);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to authenticate with Salesforce';
      console.error('Salesforce authentication error:', err);
      setError(errorMessage);
      setAuthData(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize authentication on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // Try to load from localStorage first
      const stored = loadStoredAuth();
      
      if (stored) {
        setAuthData(stored);
        setIsLoading(false);
        
        // Check if token needs refresh in background
        const refreshed = await refreshTokenIfNeeded(stored);
        if (refreshed && refreshed.access_token !== stored.access_token) {
          setAuthData(refreshed);
          saveStoredAuth(refreshed);
        }
      } else {
        // No stored token, authenticate fresh
        await refreshAuth();
      }
    };

    initializeAuth();
  }, []); // Only run on mount

  /**
   * Periodically check and refresh token if needed
   */
  useEffect(() => {
    if (!authData) return;

    // Check token validity every 10 minutes
    const interval = setInterval(async () => {
      const refreshed = await refreshTokenIfNeeded(authData);
      if (refreshed && refreshed.access_token !== authData.access_token) {
        setAuthData(refreshed);
        saveStoredAuth(refreshed);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [authData]);

  return (
    <SalesforceContext.Provider
      value={{
        authData,
        isLoading,
        error,
        refreshAuth,
      }}
    >
      {children}
    </SalesforceContext.Provider>
  );
};

/**
 * Hook to use Salesforce context
 */
export const useSalesforce = (): SalesforceContextType => {
  const context = useContext(SalesforceContext);
  if (context === undefined) {
    throw new Error('useSalesforce must be used within a SalesforceProvider');
  }
  return context;
};

