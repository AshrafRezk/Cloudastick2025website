/**
 * Vertical Service
 * Handles fetching verticals and their modules from Salesforce
 */

export interface Vertical {
  id: string;
  name: string;
  type: string;
  orgUsername?: string;
  orgPassword?: string;
  demoScriptSummary?: string;
  document?: string;
  companyProfile?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  modules?: VerticalModule[];
}

export interface VerticalModule {
  id: string;
  name: string;
  featureList: string;
  priority: number | null;
  cloudastickEdge: string;
  verticalId: string;
  verticalName: string;
}

export interface VerticalsResponse {
  verticals: Vertical[];
}

export interface VerticalResponse {
  vertical: Vertical;
}

/**
 * Fetch all verticals from Salesforce
 */
export const fetchAllVerticals = async (
  accessToken: string,
  instanceUrl: string
): Promise<Vertical[]> => {
  try {
    console.log('📊 Fetching all verticals...');

    const response = await fetch('/.netlify/functions/fetchVerticals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        instance_url: instanceUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch verticals: ${response.status}`);
    }

    const data: VerticalsResponse = await response.json();
    console.log(`✅ Fetched ${data.verticals.length} verticals`);
    
    return data.verticals;
  } catch (error) {
    console.error('❌ Error fetching verticals:', error);
    throw error;
  }
};

/**
 * Fetch a single vertical with its modules from Salesforce
 */
export const fetchVerticalById = async (
  accessToken: string,
  instanceUrl: string,
  verticalId: string
): Promise<Vertical> => {
  try {
    console.log(`📊 Fetching vertical ${verticalId}...`);

    const response = await fetch('/.netlify/functions/fetchVerticals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        instance_url: instanceUrl,
        verticalId: verticalId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch vertical: ${response.status}`);
    }

    const data: VerticalResponse = await response.json();
    console.log(`✅ Fetched vertical with ${data.vertical.modules?.length || 0} modules`);
    
    return data.vertical;
  } catch (error) {
    console.error('❌ Error fetching vertical:', error);
    throw error;
  }
};

