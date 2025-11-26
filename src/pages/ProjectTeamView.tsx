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
import { fetchCompanyLogo } from '../services/logoService';
import { Label } from '../components/ui/label';
import { useSalesforce } from '../contexts/SalesforceContext';

// Helper to get Salesforce auth from context
function getSalesforceAuth(authData: any): { access_token: string; instance_url: string } | null {
  if (!authData || !authData.access_token || !authData.instance_url) {
    return null;
  }
  
  return {
    access_token: authData.access_token,
    instance_url: authData.instance_url,
  };
}

// Helper to check if a string matches Salesforce ID pattern (15 or 18 characters, alphanumeric)
function isSalesforceId(value: string): boolean {
  // Salesforce IDs are 15 or 18 characters, alphanumeric
  const salesforceIdPattern = /^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$/;
  return salesforceIdPattern.test(value);
}

// Helper to fetch Salesforce image with authentication and convert to data URL
async function fetchSalesforceImage(
  imageUrl: string,
  auth: { access_token: string; instance_url: string }
): Promise<string | null> {
  try {
    // Check if it's a Salesforce URL or ContentDocument reference
    if (!imageUrl) {
      return null;
    }
    
    // Trim whitespace
    imageUrl = imageUrl.trim();
    
    // Check if it's a ContentDocument ID (Salesforce ID pattern)
    if (isSalesforceId(imageUrl)) {
      // Query ContentVersion to get the actual file download URL
      try {
        const escapedId = imageUrl.replace(/'/g, "\\'");
        const soqlQuery = encodeURIComponent(
          `SELECT ContentDocumentId, VersionDataUrl, FileExtension, ContentType FROM ContentVersion WHERE ContentDocumentId = '${escapedId}' ORDER BY CreatedDate DESC LIMIT 1`
        );
        const queryUrl = `${auth.instance_url}/services/data/v58.0/query/?q=${soqlQuery}`;
        
        const queryResponse = await fetch(queryUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (queryResponse.ok) {
          const queryData = await queryResponse.json();
          if (queryData.records && queryData.records.length > 0) {
            const versionDataUrl = queryData.records[0].VersionDataUrl;
            if (versionDataUrl) {
              // Use the VersionDataUrl to fetch the image
              imageUrl = versionDataUrl;
              console.log('Resolved ContentDocument ID to URL:', versionDataUrl);
            } else {
              console.warn('ContentVersion query returned no VersionDataUrl for ID:', imageUrl);
              return null;
            }
          } else {
            console.warn('No ContentVersion found for ContentDocument ID:', imageUrl);
            return null;
          }
        } else {
          const errorText = await queryResponse.text();
          console.warn('Failed to query ContentVersion:', queryResponse.status, errorText);
          return null;
        }
      } catch (queryError) {
        console.warn('Error querying ContentVersion for ID:', imageUrl, queryError);
        return null;
      }
    }
    
    // If it's not a Salesforce URL (external URL), return as-is
    const isSalesforceUrl = imageUrl.startsWith(auth.instance_url) || 
                           imageUrl.startsWith('/') ||
                           imageUrl.includes('salesforce.com') ||
                           imageUrl.includes('sfc/servlet.shepherd');
    
    if (!isSalesforceUrl) {
      // Not a Salesforce URL, return as-is (might be external URL)
      return imageUrl;
    }
    
    // Construct full URL if it's a relative path
    let fullUrl: string;
    if (imageUrl.startsWith('/')) {
      fullUrl = `${auth.instance_url}${imageUrl}`;
    } else if (imageUrl.startsWith('http')) {
      fullUrl = imageUrl;
    } else {
      // Try to construct a proper URL
      fullUrl = `${auth.instance_url}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    // For ContentDocument URLs (sfc/servlet.shepherd), they should work with auth headers
    // Some URLs might need session ID in query params, but auth header should be sufficient
    
    // Fetch image with authentication
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${auth.access_token}`,
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      console.warn('Failed to fetch Salesforce image:', response.status, response.statusText, fullUrl);
      // Log more details for debugging
      try {
        const errorText = await response.text();
        console.warn('Response body:', errorText.substring(0, 200));
      } catch (e) {
        // Ignore error reading response
      }
      return null;
    }
    
    // Check if response is actually an image
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.warn('Salesforce image URL did not return an image. Content-Type:', contentType, 'URL:', fullUrl);
      return null;
    }
    
    // Convert to blob then data URL
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Error fetching Salesforce image:', error);
    return null;
  }
}

const ProjectTeamView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get('projectId');
  const companyParam = searchParams.get('company');
  const teamBuildIdParam = searchParams.get('teamBuildId');
  
  // Salesforce authentication
  const { authData, isLoading: isAuthLoading, error: authError, refreshAuth } = useSalesforce();
  
  // State
  const [projectId, setProjectId] = useState(projectIdParam || '');
  const [companyName, setCompanyName] = useState(companyParam || '');
  const [opportunityName, setOpportunityName] = useState<string>('');
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [projectScope, setProjectScope] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [teamProfiles, setTeamProfiles] = useState<Record<string, any>>({});
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);

  // Load project data - wait for authentication first
  useEffect(() => {
    const loadProjectData = async () => {
      // Wait for authentication to complete
      if (isAuthLoading) {
        return; // Still authenticating, wait
      }
      
      // Check authentication error
      if (authError) {
        setError(`Authentication failed: ${authError}. Please refresh the page.`);
        setIsLoading(false);
        return;
      }
      
      // Check if we have authentication data
      if (!authData) {
        // Try to refresh authentication
        try {
          await refreshAuth();
          return; // Will retry after refresh
        } catch (err) {
          setError('Failed to authenticate with Salesforce. Please refresh the page.');
          setIsLoading(false);
          return;
        }
      }
      
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
          const auth = getSalesforceAuth(authData);
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
              
              // Initialize data object with team build data
              data = {
                projectId: sfData.accountId || sfData.opportunityId || sfData.projectId || teamBuildIdParam,
                companyName: companyParam || '',
                companyLogo: '',
                selectedTeam,
                projectScope: sfData.scope || '',
                deliverables: sfData.deliverables || '',
              };
              
              // Step 1: Extract Opportunity__c ID from team_build__c record
              const opportunityId = sfData.opportunityId;
              
              if (opportunityId) {
                // Step 2: Fetch Opportunity by ID (including Account relationship)
                try {
                  const oppUrl = `${auth.instance_url}/services/data/v58.0/sobjects/Opportunity/${opportunityId}?fields=Id,Name,AccountId`;
                  const oppResponse = await fetch(oppUrl, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${auth.access_token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (oppResponse.ok) {
                    const oppData = await oppResponse.json();
                    
                    // Extract Opportunity Name and Account ID
                    const oppName = oppData.Name || '';
                    const accountId = oppData.AccountId;
                    
                    // Store Opportunity Name
                    if (oppName) {
                      setOpportunityName(oppName);
                  }
                    
                    // Step 3: Fetch Account by ID (including Name and Logo fields)
                    if (accountId) {
                      try {
                        const accountUrl = `${auth.instance_url}/services/data/v58.0/sobjects/Account/${accountId}?fields=Name,Website,Automated_Logo_URL__c`;
                  const accountResponse = await fetch(accountUrl, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${auth.access_token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                        
                  if (accountResponse.ok) {
                    const accountData = await accountResponse.json();
                          
                          // Extract Account Name
                          const accountName = accountData.Name || '';
                          if (accountName) {
                            setCompanyName(accountName);
                            data.companyName = accountName;
                          }
                          
                          // Extract Account Website
                          const accountWebsite = accountData.Website || '';
                          if (accountWebsite) {
                            setCompanyWebsite(accountWebsite);
                          }
                          
                          // Step 4: Fetch and display Account Logo
                          // Use Automated_Logo_URL__c field as specified
                          const accountLogo = accountData.Automated_Logo_URL__c || null;
                          
                          if (accountLogo) {
                            setLogoLoading(true);
                            try {
                              const fetchedImageUrl = await fetchSalesforceImage(accountLogo, auth);
                              if (fetchedImageUrl) {
                                setCompanyLogo(fetchedImageUrl);
                                data.companyLogo = fetchedImageUrl;
                              } else {
                                // If fetching failed, try to use original URL
                                setCompanyLogo(accountLogo);
                                data.companyLogo = accountLogo;
                              }
                            } catch (error) {
                              console.error('Error fetching Salesforce image:', error);
                              // Fallback to original URL
                              setCompanyLogo(accountLogo);
                              data.companyLogo = accountLogo;
                            } finally {
                              setLogoLoading(false);
                            }
                          } else if (accountWebsite) {
                            // Fallback: Try to fetch logo from website if no Account logo found
                setLogoLoading(true);
                try {
                              const logoResult = await fetchCompanyLogo(accountWebsite);
                  if (logoResult.logoUrl) {
                    setCompanyLogo(logoResult.logoUrl);
                                data.companyLogo = logoResult.logoUrl;
                  }
                } catch (error) {
                              console.error('Error fetching logo from website:', error);
                } finally {
                  setLogoLoading(false);
                            }
                          }
                        }
                      } catch (accountError) {
                        console.warn('Error fetching Account details:', accountError);
                      }
                    }
                  }
                } catch (oppError) {
                  console.warn('Error fetching Opportunity details:', oppError);
                }
              }
            }
          }
        } else {
          // Use regular getProjectTeam for projectId/company
          data = await getProjectTeam(projectIdParam || undefined, companyParam || undefined);
        }
        
        if (data) {
          setProjectId(data.projectId);
          // Company name will be set from Account if Opportunity/Account fetch succeeded
          // Otherwise, use the value from data (which might be from companyParam or other source)
          if (data.companyName) {
          setCompanyName(data.companyName);
          }
          // Logo will be set during Account fetch if successful
          // Only set from data if we haven't already set it
          if (data.companyLogo && !companyLogo) {
          setCompanyLogo(data.companyLogo);
          }
          setSelectedTeam(data.selectedTeam || []);
          setProjectScope(data.projectScope || '');
          setDeliverables(data.deliverables || '');
          
          // Fetch company logo if we have website or company name (for non-teamBuildId flows)
          if (!teamBuildIdParam) {
            if (companyWebsite && !data.companyLogo) {
              setLogoLoading(true);
              try {
                const logoResult = await fetchCompanyLogo(companyWebsite);
                if (logoResult.logoUrl) {
                  setCompanyLogo(logoResult.logoUrl);
                }
              } catch (error) {
                console.error('Error fetching logo:', error);
              } finally {
                setLogoLoading(false);
              }
            } else if (data.companyName && !data.companyLogo) {
              // Try to fetch logo using company name as domain hint
              setLogoLoading(true);
              try {
                const domainHint = `https://${data.companyName.toLowerCase().replace(/\s+/g, '')}.com`;
                const logoResult = await fetchCompanyLogo(domainHint);
                if (logoResult.logoUrl) {
                  setCompanyLogo(logoResult.logoUrl);
                }
              } catch (error) {
                console.error('Error fetching logo:', error);
              } finally {
                setLogoLoading(false);
              }
            }
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdParam, companyParam, teamBuildIdParam, isAuthLoading, authData, authError]);

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

  // Show loading while authenticating or loading project data
  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {isAuthLoading ? 'Loading your project details...' : 'Loading project team...'}
          </p>
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
                {logoLoading ? (
                  <div className="h-10 w-32 bg-gray-700 rounded flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                  </div>
                ) : companyLogo ? (
                  <img 
                    src={companyLogo} 
                    alt={companyName} 
                    className="h-12 w-auto max-w-40 object-contain bg-white/10 p-2 rounded"
                    onError={() => setCompanyLogo('')}
                  />
                ) : (
                  <div className="h-12 w-40 bg-gray-700 rounded flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <span className="text-xl font-semibold">{companyName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Team</h1>
          {companyName && (
            <p className="text-xl text-cyan-400 font-semibold mb-2">{companyName}</p>
          )}
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
                      <p className="text-sm text-gray-400 mb-3">{member.role}</p>
                      {profile && (
                        <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Experience</span>
                            <span className="text-sm font-semibold text-cyan-400">{profile.yearsOfExperience} years</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Certificates</span>
                            <span className="text-sm font-semibold text-cyan-400">{profile.numberOfCertificates}</span>
                          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {projectScope && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Project Scope</h3>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{projectScope}</div>
              </motion.div>
            )}
            {deliverables && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Deliverables</h3>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{deliverables}</div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTeamView;

