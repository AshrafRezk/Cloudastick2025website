/**
 * Shareable customer-facing page to view project team
 * Read-only view showing selected team members, scope, and deliverables
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, Building2, FileText, Target, Loader2,
  GraduationCap, CheckCircle2
} from 'lucide-react';
import { teamMembers, getTeamMemberById } from '../data/teamMembers';
import { getTeamMemberProfile } from '../data/teamProfiles';
import { getProjectTeam } from '../services/projectTeamService';
import { Label } from '../components/ui/label';

// Helper to get Salesforce auth (same as in projectTeamService)
function getSalesforceAuth(): { access_token: string; instance_url: string } | null {
  try {
    const stored = localStorage.getItem('salesforce_auth_data');
    if (!stored) return null;
    const authData = JSON.parse(stored);
    
    const expiresAt = localStorage.getItem('salesforce_auth_expires_at');
    if (expiresAt && Date.now() >= parseInt(expiresAt, 10)) {
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

const ProjectTeamView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('projectId');
  const companyParam = searchParams.get('company');
  const teamBuildIdParam = searchParams.get('teamBuildId');
  
  // State
  const [projectId, setProjectId] = useState(projectIdParam || '');
  const [companyName, setCompanyName] = useState(companyParam || '');
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [projectScope, setProjectScope] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [teamProfiles, setTeamProfiles] = useState<Record<string, any>>({});
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectIdParam && !companyParam && !teamBuildIdParam) {
        setError('No project ID, company name, or team build ID provided');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        let data: any = null;
        
        // If teamBuildId is provided, fetch directly by ID
        if (teamBuildIdParam) {
          const auth = getSalesforceAuth();
          if (!auth) {
            throw new Error('Salesforce authentication required. Please refresh the page.');
          }
          
          const params = new URLSearchParams();
          params.append('access_token', auth.access_token);
          params.append('instance_url', auth.instance_url);
          params.append('teamBuildId', teamBuildIdParam);
          
          const response = await fetch(`/.netlify/functions/getTeamBuild?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              const sfData = result.data;
              // Map team member names back to IDs
              const selectedTeam = (sfData.teamMembers || [])
                .map((name: string) => {
                  const member = teamMembers.find((m) => m.name === name);
                  return member?.id;
                })
                .filter((id: string | undefined): id is string => !!id);
              
              data = {
                projectId: sfData.accountId || sfData.opportunityId || sfData.projectId || teamBuildIdParam,
                companyName: companyParam || '',
                companyLogo: '',
                selectedTeam,
                projectScope: sfData.scope || '',
                deliverables: sfData.deliverables || '',
              };
            }
          }
        } else {
          // Use regular getProjectTeam for projectId/company
          data = await getProjectTeam(projectIdParam || undefined, companyParam || undefined);
        }
        
        if (data) {
          setProjectId(data.projectId);
          setCompanyName(data.companyName);
          setCompanyLogo(data.companyLogo);
          setSelectedTeam(data.selectedTeam || []);
          setProjectScope(data.projectScope || '');
          setDeliverables(data.deliverables || '');
        } else {
          setError('Project team not found');
        }
      } catch (err: any) {
        console.error('Error loading project data:', err);
        setError(err.message || 'Failed to load project team data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectIdParam, companyParam, teamBuildIdParam]);

  // Load team member profiles
  useEffect(() => {
    const loadProfiles = async () => {
      const profiles: Record<string, any> = {};
      for (const memberId of selectedTeam) {
        const member = getTeamMemberById(memberId);
        if (member) {
          try {
            const profile = await getTeamMemberProfile(member.name);
            if (profile) {
              profiles[memberId] = profile;
            }
          } catch (error) {
            console.error(`Error loading profile for ${member.name}:`, error);
          }
        }
      }
      setTeamProfiles(profiles);
    };

    if (selectedTeam.length > 0) {
      loadProfiles();
    }
  }, [selectedTeam]);

  const selectedTeamMembers = selectedTeam
    .map(id => getTeamMemberById(id))
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading project team...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-500/20 p-4 rounded-lg mb-4">
            <p className="text-red-400 text-lg font-semibold">Error</p>
            <p className="text-gray-300 mt-2">{error}</p>
          </div>
          <p className="text-gray-400 text-sm">
            Please check the URL or contact your project manager for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-6">
            {/* Cloudastick Logo */}
            <div className="flex items-center gap-2">
              <img 
                src="/Assets/Company Logos/white-logo-dark.webp" 
                alt="Cloudastick" 
                className="h-12 w-auto object-contain"
              />
            </div>
            
            {/* Company Logo */}
            {companyName && (
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-gray-600" />
                {companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt={companyName} 
                    className="h-10 w-auto max-w-32 object-contain"
                    onError={() => setCompanyLogo('')}
                  />
                ) : (
                  <div className="h-10 w-32 bg-gray-700 rounded flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <span className="text-lg font-semibold">{companyName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Team</h1>
          <p className="text-gray-400">Your dedicated team of Salesforce experts</p>
        </div>

        {/* Selected Team Display */}
        {selectedTeamMembers.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-cyan-400" />
              Team Members ({selectedTeamMembers.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedTeamMembers.map((member) => {
                const profile = teamProfiles[member.id];
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-lg border-2 border-cyan-400/30 bg-gray-800/50 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="p-4">
                      <div className="relative mb-3">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-cyan-400 rounded-full p-1">
                          <CheckCircle2 className="h-5 w-5 text-gray-900" />
                        </div>
                        {/* Academy icon */}
                        {member.isAcademy && (
                          <div className="absolute top-2 left-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <GraduationCap className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{member.role}</p>
                      {profile && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>{profile.yearsOfExperience} years experience</p>
                          <p>{profile.numberOfCertificates} certificates</p>
                        </div>
                      )}
                      <button
                        onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                        className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        {expandedMember === member.id ? 'Hide' : 'View'} Profile
                      </button>
                    </div>
                    
                    {/* Expanded Profile */}
                    {expandedMember === member.id && profile && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-gray-700 pt-4">
                          <div className="text-sm space-y-2">
                            <div>
                              <strong>Experience:</strong> {profile.yearsOfExperience} years
                            </div>
                            <div>
                              <strong>Certificates:</strong> {profile.numberOfCertificates}
                            </div>
                            {profile.careerTrack && profile.careerTrack.length > 0 && (
                              <div>
                                <strong>Career Track:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                  {profile.careerTrack.map((track: any, idx: number) => (
                                    <li key={idx} className="text-xs">
                                      {track.company} ({track.period})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {profile.bio && (
                              <div>
                                <strong>Bio:</strong>
                                <p className="text-xs mt-1 text-gray-400">{profile.bio}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-8 p-8 bg-gray-800/50 rounded-lg border border-gray-700 text-center">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No team members have been assigned to this project yet.</p>
          </div>
        )}

        {/* Project Scope and Deliverables */}
        {(projectScope || deliverables) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectScope && (
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                <Label className="text-gray-300 mb-4 flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Project Scope
                </Label>
                <div className="text-gray-300 whitespace-pre-wrap">{projectScope}</div>
              </div>
            )}
            {deliverables && (
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
                <Label className="text-gray-300 mb-4 flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Deliverables
                </Label>
                <div className="text-gray-300 whitespace-pre-wrap">{deliverables}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTeamView;

