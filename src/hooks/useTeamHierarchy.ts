/**
 * Custom hook for progressive team hierarchy loading
 * Manages structure loading, current user data, and lazy loading for subordinates
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  fetchMyTeamData,
  transformMyTeamResponseToTeamHierarchy,
  transformMyTeamResponseToTeamMemberData,
  type TeamMember,
  type TeamMemberData,
} from '../services/teamService';
import { useSalesforce } from '../contexts/SalesforceContext';

interface UseTeamHierarchyOptions {
  contactId: string;
  enabled?: boolean;
}

interface TeamHierarchyState {
  structure: TeamMember | null;
  memberData: Map<string, TeamMemberData>;
  loading: {
    structure: boolean;
    currentUser: boolean;
    members: Set<string>;
  };
  error: string | null;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCached = (key: string): any | null => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};

const setCached = (key: string, data: any, ttl: number = 300000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

export const useTeamHierarchy = ({ contactId, enabled = true }: UseTeamHierarchyOptions) => {
  const { authData } = useSalesforce();
  const [state, setState] = useState<TeamHierarchyState>({
    structure: null,
    memberData: new Map(),
    loading: {
      structure: false,
      currentUser: false,
      members: new Set(),
    },
    error: null,
  });

  const loadedMembers = useRef<Set<string>>(new Set());
  const isLoadingStructure = useRef<boolean>(false);
  const hasAttemptedLoad = useRef<string | null>(null); // Track which contactId we've attempted to load

  // Load structure and current user data using new MyTeam API
  const loadStructure = useCallback(async () => {
    if (!authData || !enabled || isLoadingStructure.current) return;

    // Prevent loading the same contactId multiple times
    if (hasAttemptedLoad.current === contactId && state.structure) return;

    const cacheKey = `myteam-${contactId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      // Cached data includes both structure and current user data
      setState(prev => ({
        ...prev,
        structure: cached.structure,
        memberData: new Map([[contactId, cached.memberData]]),
        loading: { ...prev.loading, structure: false, currentUser: false },
      }));
      loadedMembers.current.add(contactId);
      hasAttemptedLoad.current = contactId;
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingStructure.current) return;
    isLoadingStructure.current = true;
    hasAttemptedLoad.current = contactId;

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, structure: true, currentUser: true },
      error: null,
    }));

    try {
      const response = await fetchMyTeamData(contactId, authData);
      if (response.success && response.data) {
        // Transform API response to existing structure
        const teamHierarchy = transformMyTeamResponseToTeamHierarchy(response, contactId);
        const memberData = transformMyTeamResponseToTeamMemberData(response, contactId);

        // Cache both structure and member data together (5 minutes cache)
        setCached(cacheKey, { structure: teamHierarchy.data, memberData }, 300000);

        setState(prev => {
          const newMemberData = new Map(prev.memberData);
          newMemberData.set(contactId, memberData);
          return {
            ...prev,
            structure: teamHierarchy.data,
            memberData: newMemberData,
            loading: { ...prev.loading, structure: false, currentUser: false },
          };
        });
        loadedMembers.current.add(contactId);
      } else {
        throw new Error('Failed to load team data');
      }
    } catch (error) {
      console.error('Failed to load team structure:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load team structure',
        loading: { ...prev.loading, structure: false, currentUser: false },
      }));
    } finally {
      isLoadingStructure.current = false;
    }
  }, [contactId, authData?.access_token, authData?.instance_url, enabled]);

  // Note: Current user data is now loaded together with structure in loadStructure
  // This function is kept for backward compatibility but is no longer needed
  const loadCurrentUserData = useCallback(async () => {
    // Data is already loaded in loadStructure, so this is a no-op
  }, []);

  // Load member data on demand (lazy loading) - uses new MyTeam API
  const loadMemberData = useCallback(async (memberContactId: string) => {
    if (!authData || !enabled || loadedMembers.current.has(memberContactId)) return;

    const cacheKey = `myteam-${memberContactId}`;
    const cached = getCached(cacheKey);
    if (cached && cached.memberData) {
      setState(prev => {
        const newMemberData = new Map(prev.memberData);
        newMemberData.set(memberContactId, cached.memberData);
        return prev;
      });
      loadedMembers.current.add(memberContactId);
      return;
    }

    setState(prev => {
      const newLoadingMembers = new Set(prev.loading.members);
      newLoadingMembers.add(memberContactId);
      return {
        ...prev,
        loading: { ...prev.loading, members: newLoadingMembers },
      };
    });

    try {
      // Use new MyTeam API to fetch data for this subordinate
      const response = await fetchMyTeamData(memberContactId, authData);
      if (response.success && response.data) {
        const memberData = transformMyTeamResponseToTeamMemberData(response, memberContactId);
        
        // Cache the member data (5 minutes cache)
        setCached(cacheKey, { memberData }, 300000);
        
        setState(prev => {
          const newMemberData = new Map(prev.memberData);
          newMemberData.set(memberContactId, memberData);
          const newLoadingMembers = new Set(prev.loading.members);
          newLoadingMembers.delete(memberContactId);
          return {
            ...prev,
            memberData: newMemberData,
            loading: { ...prev.loading, members: newLoadingMembers },
          };
        });
        loadedMembers.current.add(memberContactId);
      } else {
        throw new Error('Failed to load member data');
      }
    } catch (error) {
      console.error(`Failed to load member data for ${memberContactId}:`, error);
      setState(prev => {
        const newLoadingMembers = new Set(prev.loading.members);
        newLoadingMembers.delete(memberContactId);
        return {
          ...prev,
          loading: { ...prev.loading, members: newLoadingMembers },
        };
      });
    }
  }, [authData, enabled]);

  // Merge structure with loaded data
  const getEnrichedMember = useCallback((member: TeamMember): TeamMember => {
    const data = state.memberData.get(member.id);
    if (!data) return member;

    return {
      ...member,
      okrs: data.okrs,
      requirementsStats: data.requirementsStats,
      teamBuilds: data.teamBuilds,
      totalAllocationPercentage: data.totalAllocationPercentage,
      subordinates: member.subordinates.map(sub => getEnrichedMember(sub)),
    };
  }, [state.memberData]);

  // Load structure and current user data on mount (single API call now)
  useEffect(() => {
    // Only load if we have auth data and haven't loaded this contactId yet
    if (
      enabled && 
      authData?.access_token && 
      authData?.instance_url && 
      hasAttemptedLoad.current !== contactId && 
      !isLoadingStructure.current
    ) {
      loadStructure();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, authData?.access_token, authData?.instance_url, contactId]); // Only depend on primitive values

  // Get enriched current user - recompute when structure or memberData changes
  // Use a string key to detect memberData changes (since Map reference changes don't work well with dependencies)
  const memberDataKey = useMemo(() => Array.from(state.memberData.keys()).join(','), [state.memberData]);
  const currentUser = useMemo(() => {
    return state.structure ? getEnrichedMember(state.structure) : null;
  }, [state.structure, memberDataKey, getEnrichedMember]);

  // Check if member data is loaded
  const isMemberDataLoaded = (memberId: string) => {
    return state.memberData.has(memberId) || loadedMembers.current.has(memberId);
  };

  // Check if member is loading
  const isMemberLoading = (memberId: string) => {
    return state.loading.members.has(memberId);
  };

  return {
    currentUser,
    structure: state.structure,
    loading: {
      structure: state.loading.structure,
      currentUser: state.loading.currentUser,
      isMemberLoading,
    },
    error: state.error,
    loadMemberData,
    isMemberDataLoaded,
    refresh: async () => {
      cache.clear();
      loadedMembers.current.clear();
      hasAttemptedLoad.current = null; // Reset so we can load again
      isLoadingStructure.current = false;
      setState({
        structure: null,
        memberData: new Map(),
        loading: {
          structure: false,
          currentUser: false,
          members: new Set(),
        },
        error: null,
      });
      if (enabled && authData) {
        await loadStructure();
      }
    },
  };
};

