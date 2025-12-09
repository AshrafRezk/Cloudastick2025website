/**
 * Team Service
 * Handles API calls for team hierarchy and team member data
 */

export interface RequirementStats {
  completed: number;
  inProgress: number;
  total: number;
}

export interface ProjectAllocation {
  id: string;
  name: string;
  scope: string;
  deliverables: string;
  accountId: string | null;
  accountName: string;
  opportunityId: string | null;
  opportunityName: string;
  projectId: string | null;
  projectName: string;
  allocationPercentage: number;
  createdDate: string;
}

export interface KeyResult {
  id: string;
  name: string;
  description: string;
  target: number;
  currentValue: number;
  progress: number;
  status: string;
  unit: string;
  createdDate: string;
}

export interface OKR {
  id: string;
  name: string;
  objective: string;
  status: string;
  progress: number;
  period: string;
  year: number;
  startDate: string | null;
  endDate: string | null;
  createdDate: string;
  keyResults: KeyResult[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  reportsToId: string | null;
  reportsToName?: string | null;
  associatedUserId: string | null;
  subordinates: TeamMember[];
  teamBuilds: ProjectAllocation[];
  requirementsStats: RequirementStats;
  okrs: OKR[];
  totalAllocationPercentage: number;
  managers?: TeamMember[]; // Only on current user
}

export interface TeamHierarchy {
  success: boolean;
  data: TeamMember;
}

export interface OkrMetadata {
  success: boolean;
  okrObject: string | null;
  krObject: string | null;
  picklists: {
    okrStatus: string[];
    okrPeriod: string[];
    krStatus: string[];
    krUnit: string[];
  };
  lookupFields: {
    okrContactField: string | null;
    krOkrLookupField: string | null;
  };
}

/**
 * Fetch team hierarchy for a contact
 */
export const fetchTeamHierarchy = async (
  contactId: string,
  authData: { access_token: string; instance_url: string }
): Promise<TeamHierarchy> => {
  try {
    const response = await fetch('/.netlify/functions/getTeamHierarchy', {
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
          errorData = { message: text || `Failed to fetch team hierarchy: ${response.status}` };
        }
      } catch (e) {
        errorData = { message: `Failed to fetch team hierarchy: ${response.status}` };
      }
      throw new Error(errorData.message || errorData.error || `Failed to fetch team hierarchy: ${response.status}`);
    }

    const data: TeamHierarchy = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch team hierarchy error:', error);
    throw error;
  }
};

/**
 * Fetch OKR metadata (picklists and field names)
 */
export const fetchOkrMetadata = async (
  authData: { access_token: string; instance_url: string }
): Promise<OkrMetadata> => {
  try {
    const response = await fetch('/.netlify/functions/getOkrMetadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || `Failed to fetch OKR metadata: ${response.status}`);
    }

    const data: OkrMetadata = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch OKR metadata error:', error);
    throw error;
  }
};

/**
 * Create an OKR (Objective) for a contact
 */
export const createObjective = async (
  params: {
    contactId: string;
    objective: string;
    status?: string;
    period?: string;
    year?: number;
    startDate?: string;
    endDate?: string;
    progress?: number;
  },
  authData: { access_token: string; instance_url: string }
): Promise<{ success: boolean; id: string; object: string }> => {
  try {
    const response = await fetch('/.netlify/functions/createOKR', {
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
      const text = await response.text();
      throw new Error(text || `Failed to create OKR: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Create OKR error:', error);
    throw error;
  }
};

/**
 * Create a Key Result for an OKR
 */
export const createKeyResult = async (
  params: {
    okrId: string;
    name: string;
    description?: string;
    target?: number;
    currentValue?: number;
    unit?: string;
    status?: string;
  },
  authData: { access_token: string; instance_url: string }
): Promise<{ success: boolean; id: string; object: string }> => {
  try {
    const response = await fetch('/.netlify/functions/createKeyResult', {
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
      const text = await response.text();
      throw new Error(text || `Failed to create Key Result: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Create Key Result error:', error);
    throw error;
  }
};

