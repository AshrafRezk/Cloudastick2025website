// Service for project team API calls
import { getTeamMemberById, getTeamMemberByName, teamMembers } from '../data/teamMembers';

export interface ProjectTeamData {
  projectId: string;
  companyName: string;
  companyLogo: string;
  selectedTeam: string[]; // Array of team member IDs
  projectScope: string;
  deliverables: string;
  createdAt?: string;
  updatedAt?: string;
  // Salesforce-specific fields
  teamBuildId?: string;
  accountId?: string;
  opportunityId?: string;
  projectId_sf?: string; // Salesforce Project ID (to avoid conflict with projectId)
}

export interface ProjectTeamListItem {
  projectId: string;
  teamBuildId?: string;
  teamBuildName?: string;
  companyName: string;
  updatedAt: string;
  createdAt?: string;
  teamMemberCount: number;
  hasScope: boolean;
  hasDeliverables: boolean;
}

export interface ProjectTeamListResponse {
  success: boolean;
  projects: ProjectTeamListItem[];
  total: number;
}

export interface SaveProjectTeamRequest {
  projectId: string; // This can be Account, Opportunity, or Project ID
  companyName?: string;
  companyLogo?: string;
  selectedTeam?: string[]; // Array of team member IDs
  projectScope?: string;
  deliverables?: string;
  // Salesforce lookup fields
  accountId?: string;
  opportunityId?: string;
  projectId_sf?: string; // Salesforce Project ID
  recordType?: 'Account' | 'Opportunity' | 'SFDC_Project__c';
}

export interface UpdateProjectTeamRequest extends Partial<SaveProjectTeamRequest> {
  password: string;
}

export interface ProjectTeamResponse {
  success: boolean;
  projectId: string;
  message?: string;
  data?: ProjectTeamData;
}

/**
 * Get Salesforce auth data from localStorage
 */
function getSalesforceAuth(): { access_token: string; instance_url: string } | null {
  try {
    const stored = localStorage.getItem('salesforce_auth_data');
    if (!stored) return null;
    const authData = JSON.parse(stored);
    
    // Check if token is expired
    const expiresAt = localStorage.getItem('salesforce_auth_expires_at');
    if (expiresAt && Date.now() >= parseInt(expiresAt, 10)) {
      console.warn('Salesforce token expired');
      return null;
    }
    
    if (!authData.access_token || !authData.instance_url) {
      return null;
    }
    
    return {
      access_token: authData.access_token,
      instance_url: authData.instance_url,
    };
  } catch (error) {
    console.error('Error loading Salesforce auth:', error);
    return null;
  }
}

/**
 * Format Salesforce error message for user display
 */
function formatSalesforceError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    const message = error.message;
    
    // Common Salesforce error patterns
    if (message.includes('INVALID_FIELD') || message.includes('No such column')) {
      return 'The Team build object or fields may not be configured correctly in Salesforce. Please contact your administrator.';
    }
    
    if (message.includes('INSUFFICIENT_ACCESS') || message.includes('permission')) {
      return 'You do not have permission to perform this action. Please contact your Salesforce administrator.';
    }
    
    if (message.includes('NOT_FOUND') || message.includes('does not exist')) {
      return 'The Team build record was not found. It may have been deleted.';
    }
    
    if (message.includes('REQUIRED_FIELD_MISSING')) {
      return 'Required fields are missing. Please check your input and try again.';
    }
    
    if (message.includes('authentication') || message.includes('token')) {
      return 'Salesforce authentication failed. Please refresh the page and try again.';
    }
    
    return message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Save project team data to Salesforce
 */
export async function saveProjectTeam(data: SaveProjectTeamRequest): Promise<ProjectTeamResponse> {
  try {
    const auth = getSalesforceAuth();
    if (!auth) {
      throw new Error('Salesforce authentication required. Please refresh the page.');
    }

    // Map team member IDs to names
    const teamMemberNames = (data.selectedTeam || [])
      .map(id => {
        const member = getTeamMemberById(id);
        return member?.name;
      })
      .filter((name): name is string => !!name);

    // Validate that we have at least one team member if team is provided
    if (data.selectedTeam && data.selectedTeam.length > 0 && teamMemberNames.length === 0) {
      throw new Error('Invalid team member IDs provided. Please select valid team members.');
    }

    // Determine which lookup field to use based on recordType or projectId
    let accountId: string | undefined;
    let opportunityId: string | undefined;
    let projectId_sf: string | undefined;

    if (data.recordType === 'Account' || data.accountId) {
      accountId = data.accountId || data.projectId;
    } else if (data.recordType === 'Opportunity' || data.opportunityId) {
      opportunityId = data.opportunityId || data.projectId;
    } else if (data.recordType === 'SFDC_Project__c' || data.projectId_sf) {
      projectId_sf = data.projectId_sf || data.projectId;
    } else {
      // Default: assume projectId is the lookup (will be determined by which field is populated)
      // Try to infer from the ID format or use projectId for all (Salesforce will handle validation)
      projectId_sf = data.projectId;
    }

    const requestBody = {
      access_token: auth.access_token,
      instance_url: auth.instance_url,
      accountId,
      opportunityId,
      projectId: projectId_sf,
      scope: data.projectScope || '',
      deliverables: data.deliverables || '',
      teamMembers: teamMemberNames,
    };

    const response = await fetch('/.netlify/functions/createTeamBuild', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = formatSalesforceError(errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    return {
      success: true,
      projectId: data.projectId,
      message: result.message || 'Project team saved successfully',
      data: {
        ...data,
        teamBuildId: result.teamBuildId,
        accountId,
        opportunityId,
        projectId_sf,
      },
    };
  } catch (error) {
    console.error('Error saving project team:', error);
    throw error;
  }
}

/**
 * Get project team data from Salesforce by Account/Opportunity/Project ID
 */
export async function getProjectTeam(
  projectId?: string, 
  company?: string,
  recordType?: 'Account' | 'Opportunity' | 'SFDC_Project__c'
): Promise<ProjectTeamData | null> {
  try {
    const auth = getSalesforceAuth();
    if (!auth) {
      throw new Error('Salesforce authentication required. Please refresh the page.');
    }

    if (!projectId) {
      return null;
    }

    // Build query params based on record type
    const params = new URLSearchParams();
    params.append('access_token', auth.access_token);
    params.append('instance_url', auth.instance_url);

    if (recordType === 'Account') {
      params.append('accountId', projectId);
    } else if (recordType === 'Opportunity') {
      params.append('opportunityId', projectId);
    } else if (recordType === 'SFDC_Project__c') {
      params.append('projectId', projectId);
    } else {
      // Try all three lookup fields
      params.append('accountId', projectId);
      params.append('opportunityId', projectId);
      params.append('projectId', projectId);
    }

    const response = await fetch(`/.netlify/functions/getTeamBuild?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = formatSalesforceError(errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.success || !result.data) {
      return null;
    }

    const sfData = result.data;

    // Map team member names back to IDs
    const selectedTeam = (sfData.teamMembers || [])
      .map((name: string) => {
        const member = getTeamMemberByName(name);
        return member?.id;
      })
      .filter((id): id is string => !!id);

    // Determine the primary projectId based on which lookup is populated
    const primaryProjectId = sfData.accountId || sfData.opportunityId || sfData.projectId || projectId;

    return {
      projectId: primaryProjectId,
      companyName: company || '', // Company name not stored in Salesforce, use provided or empty
      companyLogo: '', // Logo not stored in Salesforce
      selectedTeam,
      projectScope: sfData.scope || '',
      deliverables: sfData.deliverables || '',
      createdAt: sfData.createdAt,
      updatedAt: sfData.updatedAt,
      teamBuildId: sfData.teamBuildId,
      accountId: sfData.accountId,
      opportunityId: sfData.opportunityId,
      projectId_sf: sfData.projectId,
    };
  } catch (error) {
    console.error('Error getting project team:', error);
    throw error;
  }
}

/**
 * Update project team data in Salesforce
 */
export async function updateProjectTeam(
  projectId: string,
  updates: Partial<SaveProjectTeamRequest>
): Promise<ProjectTeamResponse> {
  try {
    const auth = getSalesforceAuth();
    if (!auth) {
      throw new Error('Salesforce authentication required. Please refresh the page.');
    }

    // First, get the existing Team build to find the teamBuildId
    // For new builds, getProjectTeam will return null (404), which is expected
    let existing: ProjectTeamData | null = null;
    try {
      existing = await getProjectTeam(projectId, undefined, updates.recordType);
    } catch (error: any) {
      // If getProjectTeam throws with 404 or "not found", that's expected for new builds
      if (error?.message?.includes('not found') || error?.message?.includes('404')) {
        existing = null;
      } else {
        // For other errors, re-throw
        throw error;
      }
    }
    
    if (!existing || !existing.teamBuildId) {
      // If not found, create a new one instead of updating
      return await saveProjectTeam({
        ...updates,
        projectId,
        recordType: updates.recordType,
      } as SaveProjectTeamRequest);
    }

    // Map team member IDs to names if selectedTeam is provided
    let teamMemberNames: string[] | undefined;
    if (updates.selectedTeam !== undefined) {
      teamMemberNames = updates.selectedTeam
        .map(id => {
          const member = getTeamMemberById(id);
          return member?.name;
        })
        .filter((name): name is string => !!name);
      
      // Validate that we have valid team members if team is provided
      if (updates.selectedTeam.length > 0 && teamMemberNames.length === 0) {
        throw new Error('Invalid team member IDs provided. Please select valid team members.');
      }
    }

    // Determine lookup fields
    let accountId: string | undefined;
    let opportunityId: string | undefined;
    let projectId_sf: string | undefined;

    if (updates.recordType === 'Account' || updates.accountId) {
      accountId = updates.accountId || projectId;
    } else if (updates.recordType === 'Opportunity' || updates.opportunityId) {
      opportunityId = updates.opportunityId || projectId;
    } else if (updates.recordType === 'SFDC_Project__c' || updates.projectId_sf) {
      projectId_sf = updates.projectId_sf || projectId;
    } else {
      // Use existing values
      accountId = existing.accountId;
      opportunityId = existing.opportunityId;
      projectId_sf = existing.projectId_sf;
    }

    const requestBody = {
      access_token: auth.access_token,
      instance_url: auth.instance_url,
      teamBuildId: existing.teamBuildId,
      accountId,
      opportunityId,
      projectId: projectId_sf,
      scope: updates.projectScope,
      deliverables: updates.deliverables,
      teamMembers: teamMemberNames,
    };

    const response = await fetch('/.netlify/functions/updateTeamBuild', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = formatSalesforceError(errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    return {
      success: true,
      projectId,
      message: result.message || 'Project team updated successfully',
    };
  } catch (error) {
    console.error('Error updating project team:', error);
    throw error;
  }
}

/**
 * List all project teams from Salesforce
 */
export async function listProjectTeams(): Promise<ProjectTeamListResponse> {
  try {
    const auth = getSalesforceAuth();
    if (!auth) {
      throw new Error('Salesforce authentication required. Please refresh the page.');
    }

    const params = new URLSearchParams();
    params.append('access_token', auth.access_token);
    params.append('instance_url', auth.instance_url);

    const response = await fetch(`/.netlify/functions/listTeamBuilds?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = formatSalesforceError(errorData);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing project teams:', error);
    throw error;
  }
}

/**
 * Delete project team data from Salesforce
 */
export async function deleteProjectTeam(projectId: string): Promise<ProjectTeamResponse> {
  try {
    const auth = getSalesforceAuth();
    if (!auth) {
      throw new Error('Salesforce authentication required. Please refresh the page.');
    }

    // First, get the existing Team build to find the teamBuildId
    const existing = await getProjectTeam(projectId);
    if (!existing || !existing.teamBuildId) {
      throw new Error('Team build not found');
    }

    const requestBody = {
      access_token: auth.access_token,
      instance_url: auth.instance_url,
      teamBuildId: existing.teamBuildId,
    };

    const response = await fetch('/.netlify/functions/deleteTeamBuild', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorData: any;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      const errorMessage = formatSalesforceError(errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    return {
      success: true,
      projectId,
      message: result.message || 'Project team deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting project team:', error);
    throw error;
  }
}

