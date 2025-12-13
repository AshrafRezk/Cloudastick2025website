/**
 * Custom hook for progressive team hierarchy loading
 * Manages structure loading, current user data, and lazy loading for subordinates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchMyTeamData,
  transformMyTeamResponseToTeamHierarchy,
  transformMyTeamResponseToTeamMemberData,
  fetchTeamMemberData, // Keep for subordinate data if needed
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

  // Load structure and current user data using new MyTeam API
  const loadStructure = useCallback(async () => {
    if (!authData || !enabled) return;

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
      return;
    }

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
    }
  }, [contactId, authData, enabled]);

  // Note: Current user data is now loaded together with structure in loadStructure
  // This function is kept for backward compatibility but is no longer needed
  const loadCurrentUserData = useCallback(async () => {
    // Data is already loaded in loadStructure, so this is a no-op
  }, []);

  // Load member data on demand (lazy loading)
  const loadMemberData = useCallback(async (memberContactId: string) => {
    if (!authData || !enabled || loadedMembers.current.has(memberContactId)) return;

    const cacheKey = `member-${memberContactId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setState(prev => {
        const newMemberData = new Map(prev.memberData);
        newMemberData.set(memberContactId, cached);
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
      const response = await fetchTeamMemberData(memberContactId, authData);
      if (response.success && response.data) {
        setCached(cacheKey, response.data, 300000); // 5 minutes cache
        setState(prev => {
          const newMemberData = new Map(prev.memberData);
          newMemberData.set(memberContactId, response.data);
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
    if (enabled && authData) {
      loadStructure();
    }
  }, [enabled, authData, loadStructure]);

  // Get enriched current user
  const currentUser = state.structure ? getEnrichedMember(state.structure) : null;

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

