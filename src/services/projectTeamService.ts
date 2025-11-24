// Service for project team API calls

export interface ProjectTeamData {
  projectId: string;
  companyName: string;
  companyLogo: string;
  selectedTeam: string[]; // Array of team member IDs
  projectScope: string;
  deliverables: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveProjectTeamRequest {
  projectId: string;
  companyName?: string;
  companyLogo?: string;
  selectedTeam?: string[];
  projectScope?: string;
  deliverables?: string;
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
 * Save project team data
 */
export async function saveProjectTeam(data: SaveProjectTeamRequest): Promise<ProjectTeamResponse> {
  try {
    const response = await fetch('/.netlify/functions/saveProjectTeam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save project team');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving project team:', error);
    throw error;
  }
}

/**
 * Get project team data by projectId or company name
 */
export async function getProjectTeam(projectId?: string, company?: string): Promise<ProjectTeamData | null> {
  try {
    const params = new URLSearchParams();
    if (projectId) {
      params.append('projectId', projectId);
    }
    if (company) {
      params.append('company', company);
    }

    const response = await fetch(`/.netlify/functions/getProjectTeam?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get project team');
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error getting project team:', error);
    throw error;
  }
}

/**
 * Update project team data (password protected)
 */
export async function updateProjectTeam(
  projectId: string,
  updates: Partial<SaveProjectTeamRequest>,
  password: string
): Promise<ProjectTeamResponse> {
  try {
    const response = await fetch('/.netlify/functions/updateProjectTeam', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId,
        password,
        ...updates,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update project team');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project team:', error);
    throw error;
  }
}

