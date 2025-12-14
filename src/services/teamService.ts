/**
 * Team Service
 * Handles API calls for team hierarchy and team member data
 */

export interface RequirementStats {
  completed: number;
  inProgress: number;
  total: number;
}

export interface ProjectTeamMember {
  id: string;
  name: string;
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
  teamMembers?: ProjectTeamMember[];
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

/**
 * Fetch team hierarchy structure only (fast, no heavy data)
 */
export const fetchTeamHierarchyStructure = async (
  contactId: string,
  authData: { access_token: string; instance_url: string }
): Promise<TeamHierarchy> => {
  try {
    const response = await fetch('/.netlify/functions/getTeamHierarchyStructure', {
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
          errorData = { message: text || `Failed to fetch team hierarchy structure: ${response.status}` };
        }
      } catch (e) {
        errorData = { message: `Failed to fetch team hierarchy structure: ${response.status}` };
      }
      throw new Error(errorData.message || errorData.error || `Failed to fetch team hierarchy structure: ${response.status}`);
    }

    const data: TeamHierarchy = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch team hierarchy structure error:', error);
    throw error;
  }
};

/**
 * Fetch data for a single team member (OKRs, requirements, team builds)
 * Supports pagination
 */
export interface TeamMemberData {
  contactId: string;
  okrs: OKR[];
  requirementsStats: RequirementStats;
  teamBuilds: ProjectAllocation[];
  totalAllocationPercentage: number;
  pagination: {
    okrs: {
      offset: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    teamBuilds: {
      offset: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  };
}

export interface TeamMemberDataResponse {
  success: boolean;
  data: TeamMemberData;
}

// ============================================================================
// MyTeam API Types
// ============================================================================

export interface ContactNode {
  id: string;
  name: string;
  title: string | null;
  email: string | null;
  reportsToId: string | null;
  children: ContactNode[];
}

export interface OKRNode {
  id: string;
  name: string;
  type: string | null;
  status: string | null;
  progress: number | null;
  dueDate: string | null;
  quarter: string | null;
  department: string | null;
  ownerId: string | null;
  ownerName: string | null;
  health: string | null;
  weight: number | null;
  comments: string | null;
  parentObjectiveId: string | null;
  children: OKRNode[];
}

export interface TeamMemberRecord {
  Id: string;
  Name: string;
  Allocation__c?: number | null;
  Allocation_Percentage__c?: number | null;
  Status__c?: string | null;
  [key: string]: any; // Allow additional fields from SObject
}

export interface RequirementRecord {
  Id: string;
  Name: string;
  Title__c?: string | null;
  Status__c: string;
  Due_Date__c?: string | null;
  CompletedDate__c?: string | null;
  Completion__c?: number | null;
  OwnerId: string;
  [key: string]: any;
}

export interface LearningMaterialRecord {
  Id: string;
  Name: string;
  Learner__c: string;
  Material__c?: string | null;
  Progress__c?: number | null;
  Status__c?: string | null;
  Started_On__c?: string | null;
  Completed_On__c?: string | null;
  Score__c?: number | null;
  Time_Taken_Minutes__c?: number | null;
  Attempt_Number__c?: number | null;
  [key: string]: any;
}

export interface MyTeamMutations {
  teamMemberAllocations?: Array<{
    id: string;
    allocationPercentage?: number;
    allocationField?: string;
    fields?: Record<string, any>;
  }>;
  okrsToUpdate?: Array<{
    id: string;
    fields: Record<string, any>;
  }>;
  okrsToCreate?: Array<{
    fields: Record<string, any>;
  }>;
}

export interface MyTeamRequestPayload {
  currentContactId: string;
  mutations?: MyTeamMutations;
}

/**
 * Subordinate data returned by the API for direct reports
 * Contains OKRs, requirement counts, and team members for each subordinate
 */
export interface SubordinateData {
  okrs: OKRNode[];
  requirementCounts: Record<string, number>;
  teamMembers: TeamMemberRecord[];
}

export interface MyTeamResponsePayload {
  contact: ContactNode | null;
  hierarchy: ContactNode[];
  teamMembers: TeamMemberRecord[];
  requirementsInProgress: RequirementRecord[];
  requirementsNotCompleted: RequirementRecord[];
  requirementCounts: Record<string, number>;
  okrs: OKRNode[];
  learningMaterials: LearningMaterialRecord[];
  warnings: string[];
  mutationErrors: string[];
  /**
   * Data for direct reports (subordinates), keyed by Contact ID
   * Only subordinates with Associated_User__c populated will have data
   * Only direct reports (depth = 1) are included
   */
  subordinateData?: Record<string, SubordinateData>;
}

export interface MyTeamResponse {
  success: boolean;
  data: MyTeamResponsePayload;
  warnings?: string[];
  mutationErrors?: string[];
}

// ============================================================================
// MyTeam API Service Functions
// ============================================================================

/**
 * Fetch team data using the new MyTeam REST API
 */
export const fetchMyTeamData = async (
  contactId: string,
  authData: { access_token: string; instance_url: string },
  mutations?: MyTeamMutations
): Promise<MyTeamResponse> => {
  try {
    const url = `${authData.instance_url}/services/apexrest/myteam/`;
    const requestPayload: MyTeamRequestPayload = {
      currentContactId: contactId,
    };

    if (mutations) {
      requestPayload.mutations = mutations;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { error: text || `Failed to fetch team data: ${response.status}` };
        }
      } catch (e) {
        errorData = { error: `Failed to fetch team data: ${response.status}` };
      }
      throw new Error(errorData.error || `Failed to fetch team data: ${response.status}`);
    }

    let data: MyTeamResponsePayload;
    try {
      const responseText = await response.text();
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse MyTeam API response:', parseError);
      throw new Error('Invalid JSON response from MyTeam API');
    }

    // Safely handle requirementCounts with null keys
    if (data.requirementCounts && typeof data.requirementCounts === 'object') {
      const safeCounts: Record<string, number> = {};
      Object.entries(data.requirementCounts).forEach(([key, value]) => {
        if (key !== null && key !== undefined) {
          safeCounts[String(key)] = typeof value === 'number' ? value : 0;
        }
      });
      data.requirementCounts = safeCounts;
    }

    // Safely handle subordinateData requirementCounts with null keys
    if (data.subordinateData && typeof data.subordinateData === 'object') {
      Object.keys(data.subordinateData).forEach(contactId => {
        const subData = data.subordinateData![contactId];
        if (subData?.requirementCounts && typeof subData.requirementCounts === 'object') {
          const safeCounts: Record<string, number> = {};
          Object.entries(subData.requirementCounts).forEach(([key, value]) => {
            if (key !== null && key !== undefined) {
              safeCounts[String(key)] = typeof value === 'number' ? value : 0;
            }
          });
          subData.requirementCounts = safeCounts;
        }
      });
    }

    // Log warnings if any
    if (data.warnings && data.warnings.length > 0) {
      console.warn('MyTeam API Warnings:', data.warnings);
    }

    // Log mutation errors if any
    if (data.mutationErrors && data.mutationErrors.length > 0) {
      console.error('MyTeam API Mutation Errors:', data.mutationErrors);
    }

    return {
      success: true,
      data,
      warnings: data.warnings,
      mutationErrors: data.mutationErrors,
    };
  } catch (error) {
    console.error('Fetch MyTeam data error:', error);
    throw error;
  }
};

// ============================================================================
// Mapping Functions: MyTeam API Response → Existing Interfaces
// ============================================================================

/**
 * Recursively collect all key result nodes from an OKRNode tree
 */
function collectKeyResults(node: OKRNode): OKRNode[] {
  const keyResults: OKRNode[] = [];
  
  // If this node has children, all children are key results (or nested OKRs)
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      // Add the child as a key result
      keyResults.push(child);
      // Recursively collect from grandchildren (for nested structures)
      keyResults.push(...collectKeyResults(child));
    });
  }
  
  return keyResults;
}

/**
 * Transform OKRNode tree structure to flat OKR[] with keyResults
 * The API returns an array of root OKRNodes, each with a recursive children array
 */
function transformOKRTree(okrNodes: OKRNode[]): OKR[] {
  const okrs: OKR[] = [];

  // Filter to get root nodes (objectives with no parent)
  const rootNodes = okrNodes.filter(node => !node.parentObjectiveId);

  rootNodes.forEach(objNode => {
    // Collect all key results from this objective's tree
    const keyResultsNodes = collectKeyResults(objNode);
    
    const keyResults: KeyResult[] = keyResultsNodes.map(krNode => ({
      id: krNode.id,
      name: krNode.name,
      description: krNode.comments || '',
      target: 100, // Default, may not be available in API
      currentValue: krNode.progress || 0,
      progress: krNode.progress || 0,
      status: krNode.status || 'Not Started',
      unit: '', // May not be available in API
      createdDate: '', // May not be available
    }));

    // Extract period and year from quarter if available
    let period = '';
    let year = new Date().getFullYear();
    if (objNode.quarter) {
      const quarterMatch = objNode.quarter.match(/(Q[1-4])\s*(\d{4})/);
      if (quarterMatch) {
        period = quarterMatch[1];
        year = parseInt(quarterMatch[2], 10);
      }
    }

    const okr: OKR = {
      id: objNode.id,
      name: objNode.name,
      objective: objNode.name,
      status: objNode.status || 'Not Started',
      progress: objNode.progress || 0,
      period,
      year,
      startDate: null, // API doesn't provide startDate
      endDate: objNode.dueDate,
      createdDate: '', // May not be available
      keyResults,
    };

    okrs.push(okr);
  });

  return okrs;
}

/**
 * Calculate requirement stats from API response
 * Safely handles requirementCounts that may have null keys
 */
function calculateRequirementStats(
  inProgress: RequirementRecord[],
  notCompleted: RequirementRecord[],
  counts: Record<string, number>
): RequirementStats {
  // Safely process counts, filtering out null keys
  const safeCounts: Record<string, number> = {};
  if (counts && typeof counts === 'object') {
    Object.entries(counts).forEach(([key, value]) => {
      if (key !== null && key !== undefined) {
        safeCounts[String(key)] = typeof value === 'number' ? value : 0;
      }
    });
  }

  const completed = safeCounts['Completed'] || 0;
  const inProgressCount = inProgress.length || safeCounts['In Progress'] || 0;
  const total = inProgressCount + Object.values(safeCounts).reduce((sum, count) => sum + count, 0);

  return {
    completed,
    inProgress: inProgressCount,
    total: Math.max(total, inProgressCount + completed), // Ensure total is at least the sum
  };
}

/**
 * Transform TeamMemberRecord[] to ProjectAllocation[]
 * Note: The API returns Team_Build_Member__c records, which may not have full project details.
 * This is a simplified mapping - you may need to enhance based on actual API response fields.
 */
function transformTeamMembersToAllocations(
  teamMembers: TeamMemberRecord[]
): ProjectAllocation[] {
  return teamMembers.map(tm => {
    const allocation = tm.Allocation__c || tm.Allocation_Percentage__c || 0;
    
    return {
      id: tm.Id,
      name: tm.Name,
      scope: '', // Not available in Team_Build_Member__c
      deliverables: '', // Not available in Team_Build_Member__c
      accountId: null,
      accountName: '', // Not available in Team_Build_Member__c
      opportunityId: null,
      opportunityName: '', // Not available in Team_Build_Member__c
      projectId: null,
      projectName: '', // Not available in Team_Build_Member__c
      allocationPercentage: typeof allocation === 'number' ? allocation : 0,
      createdDate: '', // May not be available
      teamMembers: [],
    };
  });
}

/**
 * Calculate total allocation percentage from team members
 */
function calculateTotalAllocation(teamMembers: TeamMemberRecord[]): number {
  return teamMembers.reduce((sum, tm) => {
    const allocation = tm.Allocation__c || tm.Allocation_Percentage__c || 0;
    return sum + (typeof allocation === 'number' ? allocation : 0);
  }, 0);
}

// ============================================================================
// Subordinate Data Helper Functions
// ============================================================================

/**
 * Flatten OKR tree to get all OKRs (objectives and key results)
 * OKRs are returned as a tree from the API - this flattens them for counting and progress calculation
 */
function flattenOKRTree(okrs: OKRNode[]): OKRNode[] {
  const result: OKRNode[] = [];
  
  function traverse(node: OKRNode) {
    result.push(node);
    if (node.children && node.children.length > 0) {
      node.children.forEach(traverse);
    }
  }
  
  okrs.forEach(traverse);
  return result;
}

/**
 * Calculate total requirements from requirement counts object
 */
function calculateTotalRequirements(requirementCounts: Record<string, number> | undefined): number {
  if (!requirementCounts) return 0;
  return Object.values(requirementCounts).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0);
}

/**
 * Calculate average progress from OKR array
 * Flattens the OKR tree to include all objectives and key results
 */
function calculateAverageProgress(okrs: OKRNode[] | undefined): number {
  if (!okrs || okrs.length === 0) return 0;
  
  // Flatten OKR tree to get all OKRs (including children)
  const allOkrs = flattenOKRTree(okrs);
  
  if (allOkrs.length === 0) return 0;
  
  const totalProgress = allOkrs.reduce((sum, okr) => sum + (okr.progress || 0), 0);
  return Math.round(totalProgress / allOkrs.length);
}

/**
 * Calculate total allocation percentage from subordinate team members
 * Handles multiple possible field names for allocation percentage
 */
function calculateSubordinateAllocation(teamMembers: TeamMemberRecord[] | undefined): number {
  if (!teamMembers || teamMembers.length === 0) return 0;
  
  // Sum allocation percentages from team members
  return teamMembers.reduce((sum, member) => {
    const allocation = member.Allocation_Percentage__c || 
                      member.Allocation__c || 
                      0;
    return sum + (typeof allocation === 'number' ? allocation : 0);
  }, 0);
}

/**
 * Transform ContactNode to TeamMember with data from API response
 * Supports subordinateData for direct reports when available
 */
function transformContactNodeToTeamMember(
  contactNode: ContactNode,
  apiData: MyTeamResponsePayload,
  rootContactId: string
): TeamMember {
  const isCurrentContact = contactNode.id === rootContactId;
  const isDirectReport = contactNode.reportsToId === rootContactId;
  
  // Check if this is a subordinate with data in subordinateData
  const subordinateData = apiData.subordinateData?.[contactNode.id];
  
  let okrs: OKR[] = [];
  let requirementsStats: RequirementStats = { completed: 0, inProgress: 0, total: 0 };
  let teamBuilds: ProjectAllocation[] = [];
  let totalAllocationPercentage = 0;
  
  if (isCurrentContact) {
    // Current user - use the main data from API response
    okrs = transformOKRTree(apiData.okrs);
    requirementsStats = calculateRequirementStats(
      apiData.requirementsInProgress,
      apiData.requirementsNotCompleted,
      apiData.requirementCounts
    );
    teamBuilds = transformTeamMembersToAllocations(apiData.teamMembers);
    totalAllocationPercentage = calculateTotalAllocation(apiData.teamMembers);
  } else if (isDirectReport && subordinateData) {
    // Direct report with subordinateData - use that data
    okrs = transformOKRTree(subordinateData.okrs || []);
    
    // Calculate requirements stats from subordinateData.requirementCounts
    const completed = subordinateData.requirementCounts?.['Completed'] || 0;
    const inProgress = subordinateData.requirementCounts?.['In Progress'] || 0;
    const total = calculateTotalRequirements(subordinateData.requirementCounts);
    requirementsStats = { completed, inProgress, total };
    
    // Transform team members to allocations
    teamBuilds = transformTeamMembersToAllocations(subordinateData.teamMembers || []);
    totalAllocationPercentage = calculateSubordinateAllocation(subordinateData.teamMembers);
  }
  // else: subordinate without data - use default zeros (graceful fallback)

  // Recursively transform subordinates
  const subordinates = contactNode.children.map(child =>
    transformContactNodeToTeamMember(child, apiData, rootContactId)
  );

  return {
    id: contactNode.id,
    name: contactNode.name,
    email: contactNode.email || '',
    reportsToId: contactNode.reportsToId,
    reportsToName: undefined, // Not in API response
    associatedUserId: null, // Not in API response
    subordinates,
    teamBuilds,
    requirementsStats,
    okrs,
    totalAllocationPercentage,
  };
}

/**
 * Transform MyTeam API response to TeamHierarchy structure
 */
export function transformMyTeamResponseToTeamHierarchy(
  apiResponse: MyTeamResponse,
  contactId: string
): TeamHierarchy {
  const { data } = apiResponse;
  
  if (!data.contact) {
    throw new Error('Contact data not found in API response');
  }

  const teamMember = transformContactNodeToTeamMember(data.contact, data, contactId);

  return {
    success: true,
    data: teamMember,
  };
}

/**
 * Transform MyTeam API response to TeamMemberData for a specific contact
 */
export function transformMyTeamResponseToTeamMemberData(
  apiResponse: MyTeamResponse,
  contactId: string
): TeamMemberData {
  const { data } = apiResponse;
  
  // All OKRs in the response are for the current contact
  const contactOKRs = transformOKRTree(data.okrs);
  
  // All team members in the response are for the current contact
  const contactTeamMembers = data.teamMembers;
  
  const requirementsStats = calculateRequirementStats(
    data.requirementsInProgress,
    data.requirementsNotCompleted,
    data.requirementCounts
  );

  return {
    contactId,
    okrs: contactOKRs,
    requirementsStats,
    teamBuilds: transformTeamMembersToAllocations(contactTeamMembers),
    totalAllocationPercentage: calculateTotalAllocation(contactTeamMembers),
    pagination: {
      okrs: {
        offset: 0,
        limit: contactOKRs.length,
        total: contactOKRs.length,
        hasMore: false, // API doesn't support pagination currently
      },
      teamBuilds: {
        offset: 0,
        limit: contactTeamMembers.length,
        total: contactTeamMembers.length,
        hasMore: false, // API doesn't support pagination currently
      },
    },
  };
}

// ============================================================================
// Mutation Helper Functions
// ============================================================================

/**
 * Update team member allocation
 */
export const updateTeamMemberAllocation = async (
  contactId: string,
  allocationId: string,
  allocationPercentage: number,
  authData: { access_token: string; instance_url: string },
  additionalFields?: Record<string, any>
): Promise<MyTeamResponse> => {
  const mutations: MyTeamMutations = {
    teamMemberAllocations: [
      {
        id: allocationId,
        allocationPercentage,
        fields: additionalFields || {},
      },
    ],
  };

  return fetchMyTeamData(contactId, authData, mutations);
};

/**
 * Update an OKR
 */
export const updateOKR = async (
  contactId: string,
  okrId: string,
  fields: Record<string, any>,
  authData: { access_token: string; instance_url: string }
): Promise<MyTeamResponse> => {
  const mutations: MyTeamMutations = {
    okrsToUpdate: [
      {
        id: okrId,
        fields,
      },
    ],
  };

  return fetchMyTeamData(contactId, authData, mutations);
};

/**
 * Create an OKR
 */
export const createOKR = async (
  contactId: string,
  fields: Record<string, any>,
  authData: { access_token: string; instance_url: string }
): Promise<MyTeamResponse> => {
  const mutations: MyTeamMutations = {
    okrsToCreate: [
      {
        fields,
      },
    ],
  };

  return fetchMyTeamData(contactId, authData, mutations);
};

export const fetchTeamMemberData = async (
  contactId: string,
  authData: { access_token: string; instance_url: string },
  options?: {
    okrOffset?: number;
    okrLimit?: number;
    teamBuildOffset?: number;
    teamBuildLimit?: number;
  }
): Promise<TeamMemberDataResponse> => {
  try {
    const response = await fetch('/.netlify/functions/getTeamMemberData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        contactId,
        okrOffset: options?.okrOffset || 0,
        okrLimit: options?.okrLimit || 50,
        teamBuildOffset: options?.teamBuildOffset || 0,
        teamBuildLimit: options?.teamBuildLimit || 20,
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        const text = await response.text();
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { message: text || `Failed to fetch team member data: ${response.status}` };
        }
      } catch (e) {
        errorData = { message: `Failed to fetch team member data: ${response.status}` };
      }
      throw new Error(errorData.message || errorData.error || `Failed to fetch team member data: ${response.status}`);
    }

    const data: TeamMemberDataResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch team member data error:', error);
    throw error;
  }
};

