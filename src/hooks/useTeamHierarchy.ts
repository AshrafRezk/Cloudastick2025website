/**
 * Custom hook for progressive team hierarchy loading
 * Manages structure loading, current user data, and lazy loading for subordinates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTeamHierarchyStructure, fetchTeamMemberData, type TeamMember, type TeamMemberData } from '../services/teamService';
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

  // Load structure (fast, cached for 1 hour)
  const loadStructure = useCallback(async () => {
    if (!authData || !enabled) return;

    const cacheKey = `structure-${contactId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setState(prev => ({ ...prev, structure: cached }));
      return;
    }

    setState(prev => ({ ...prev, loading: { ...prev.loading, structure: true }, error: null }));

    try {
      const response = await fetchTeamHierarchyStructure(contactId, authData);
      if (response.success && response.data) {
        setCached(cacheKey, response.data, 3600000); // 1 hour cache
        setState(prev => ({
          ...prev,
          structure: response.data,
          loading: { ...prev.loading, structure: false },
        }));
      } else {
        throw new Error('Failed to load team structure');
      }
    } catch (error) {
      console.error('Failed to load team structure:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load team structure',
        loading: { ...prev.loading, structure: false },
      }));
    }
  }, [contactId, authData, enabled]);

  // Load current user data (priority)
  const loadCurrentUserData = useCallback(async () => {
    if (!authData || !enabled || !state.structure) return;

    const cacheKey = `member-${contactId}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setState(prev => {
        const newMemberData = new Map(prev.memberData);
        newMemberData.set(contactId, cached);
        return {
          ...prev,
          memberData: newMemberData,
          loading: { ...prev.loading, currentUser: false },
        };
      });
      return;
    }

    setState(prev => ({ ...prev, loading: { ...prev.loading, currentUser: true } }));

    try {
      const response = await fetchTeamMemberData(contactId, authData);
      if (response.success && response.data) {
        setCached(cacheKey, response.data, 300000); // 5 minutes cache
        setState(prev => {
          const newMemberData = new Map(prev.memberData);
          newMemberData.set(contactId, response.data);
          return {
            ...prev,
            memberData: newMemberData,
            loading: { ...prev.loading, currentUser: false },
          };
        });
      } else {
        throw new Error('Failed to load current user data');
      }
    } catch (error) {
      console.error('Failed to load current user data:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, currentUser: false },
      }));
    }
  }, [contactId, authData, enabled, state.structure]);

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

  // Phase 1: Load structure on mount
  useEffect(() => {
    if (enabled && authData) {
      loadStructure();
    }
  }, [enabled, authData, loadStructure]);

  // Phase 2: Load current user data after structure loads
  useEffect(() => {
    if (state.structure && !state.memberData.has(contactId)) {
      loadCurrentUserData();
    }
  }, [state.structure, contactId, loadCurrentUserData]);

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
    refresh: () => {
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
        loadStructure();
      }
    },
  };
};

