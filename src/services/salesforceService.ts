/**
 * Salesforce Service
 * Handles authentication and future API interactions with Salesforce
 */

export interface SalesforceAuthResponse {
  access_token: string;
  instance_url: string;
  token_type: string;
  issued_at: string;
  expires_at: number;
}

export interface SalesforceAuthError {
  error: string;
  message?: string;
}

/**
 * Authenticate with Salesforce using client credentials flow
 * This should be called automatically when the website loads
 */
export const authenticateSalesforce = async (): Promise<SalesforceAuthResponse> => {
  try {
    console.log('🔐 Authenticating with Salesforce...');

    const response = await fetch('/.netlify/functions/salesforceAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: SalesforceAuthError = await response.json();
      throw new Error(errorData.message || `Authentication failed: ${response.status}`);
    }

    const data: SalesforceAuthResponse = await response.json();
    console.log('✅ Salesforce authentication successful');
    
    return data;
  } catch (error) {
    console.error('❌ Salesforce authentication error:', error);
    throw error;
  }
};

/**
 * Check if the current access token is still valid
 */
export const isTokenValid = (expiresAt: number): boolean => {
  // Add a 5-minute buffer to refresh before actual expiration
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() < (expiresAt - bufferTime);
};

/**
 * Refresh the Salesforce access token if needed
 */
export const refreshTokenIfNeeded = async (
  currentToken: SalesforceAuthResponse | null
): Promise<SalesforceAuthResponse | null> => {
  // If no token or token is expired, get a new one
  if (!currentToken || !isTokenValid(currentToken.expires_at)) {
    console.log('🔄 Refreshing Salesforce token...');
    return await authenticateSalesforce();
  }
  
  return currentToken;
};

