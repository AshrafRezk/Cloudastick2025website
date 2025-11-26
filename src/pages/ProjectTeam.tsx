import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, CheckCircle2, X, Save, Edit, Lock, 
  Building2, FileText, Target, Loader2,
  Eye, EyeOff, Upload, GraduationCap
} from 'lucide-react';
import { teamMembers, getTeamMemberById } from '../data/teamMembers';
import { getTeamMemberProfile } from '../data/teamProfiles';
import { saveProjectTeam, getProjectTeam, updateProjectTeam, ProjectTeamData } from '../services/projectTeamService';
import { fetchCompanyLogo } from '../services/logoService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import SalesforceLookup, { SalesforceRecord } from '../components/SalesforceLookup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const ProjectTeam: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // URL parameters
  const projectIdParam = searchParams.get('projectId');
  const companyParam = searchParams.get('company');
  
  // State
  const [projectId, setProjectId] = useState(projectIdParam || '');
  const [companyName, setCompanyName] = useState(companyParam || '');
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [projectScope, setProjectScope] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogoOverride, setShowLogoOverride] = useState(false);
  const [manualLogoUrl, setManualLogoUrl] = useState('');
  const [logoLoading, setLogoLoading] = useState(false);
  const [teamProfiles, setTeamProfiles] = useState<Record<string, any>>({});
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  
  // Salesforce lookup state
  const [lookupObjectType, setLookupObjectType] = useState<'Opportunity' | 'SFDC_Project__c' | 'Account'>('SFDC_Project__c');
  const [selectedSalesforceRecord, setSelectedSalesforceRecord] = useState<SalesforceRecord | null>(null);
  const [useManualEntry, setUseManualEntry] = useState(false);
  
  const EDIT_PASSWORD = 'Cloudastick@Team$';

  // Check if user is authenticated (from sessionStorage)
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('project-team-edit-auth') === 'true';
    setIsEditMode(isAuthenticated);
  }, []);

  // Load existing project data
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectIdParam && !companyParam) return;
      
      setIsLoading(true);
      try {
        // Determine record type from URL params or lookup object type
        let recordType: 'Account' | 'Opportunity' | 'SFDC_Project__c' | undefined;
        if (lookupObjectType) {
          recordType = lookupObjectType;
        }
        
        const data = await getProjectTeam(projectIdParam || undefined, companyParam || undefined, recordType);
        if (data) {
          setProjectId(data.projectId);
          setCompanyName(data.companyName);
          setCompanyLogo(data.companyLogo);
          setSelectedTeam(data.selectedTeam || []);
          setProjectScope(data.projectScope || '');
          setDeliverables(data.deliverables || '');
          
          // Set lookup object type based on which field is populated
          if (data.accountId) {
            setLookupObjectType('Account');
            setProjectId(data.accountId);
          } else if (data.opportunityId) {
            setLookupObjectType('Opportunity');
            setProjectId(data.opportunityId);
          } else if (data.projectId_sf) {
            setLookupObjectType('SFDC_Project__c');
            setProjectId(data.projectId_sf);
          }
          
          // If company name exists but no logo, try to fetch
          if (data.companyName && !data.companyLogo) {
            fetchLogoForCompany(data.companyName);
          }
        }
      } catch (error) {
        console.error('Error loading project data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load project team data from Salesforce.';
        
        // Don't show error toast for 404 (not found) - it's expected for new projects
        if (!errorMessage.includes('not found') && !errorMessage.includes('404')) {
          if (errorMessage.includes('authentication') || errorMessage.includes('token')) {
            toast({
              title: 'Authentication Error',
              description: 'Please refresh the page to re-authenticate with Salesforce.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error loading project',
              description: errorMessage,
              variant: 'destructive',
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectIdParam, companyParam, lookupObjectType]);

  // Fetch logo for company
  const fetchLogoForCompany = async (company: string) => {
    if (!company) return;
    
    setLogoLoading(true);
    try {
      // Try to extract website from company name or use a search
      // For now, we'll use the company name as a domain hint
      const result = await fetchCompanyLogo(`https://${company.toLowerCase().replace(/\s+/g, '')}.com`);
      if (result.logoUrl) {
        setCompanyLogo(result.logoUrl);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    } finally {
      setLogoLoading(false);
    }
  };

  // Load team member profiles
  useEffect(() => {
    const loadProfiles = async () => {
      const profiles: Record<string, any> = {};
      for (const member of teamMembers) {
        try {
          const profile = await getTeamMemberProfile(member.name);
          if (profile) {
            profiles[member.id] = profile;
          }
        } catch (error) {
          console.error(`Error loading profile for ${member.name}:`, error);
        }
      }
      setTeamProfiles(profiles);
    };

    loadProfiles();
  }, []);

  // Toggle team member selection
  const toggleTeamMember = (memberId: string) => {
    setSelectedTeam(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Handle password authentication
  const handlePasswordSubmit = () => {
    if (password === EDIT_PASSWORD) {
      setIsEditMode(true);
      sessionStorage.setItem('project-team-edit-auth', 'true');
      setShowPasswordDialog(false);
      setPassword('');
      toast({
        title: 'Edit mode enabled',
        description: 'You can now edit the project team.',
      });
    } else {
      toast({
        title: 'Invalid password',
        description: 'Please enter the correct password.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  // Handle save
  const handleSave = async () => {
    // Use selected Salesforce record ID if available, otherwise use manual projectId
    const recordIdToSave = selectedSalesforceRecord?.id || projectId;
    
    if (!recordIdToSave) {
      toast({
        title: 'Record required',
        description: 'Please select a Salesforce record (Project, Opportunity, or Account) or enter a record ID.',
        variant: 'destructive',
      });
      return;
    }

    // Determine record type
    let recordType: 'Account' | 'Opportunity' | 'SFDC_Project__c' | undefined;
    if (selectedSalesforceRecord) {
      recordType = lookupObjectType;
    } else if (projectId) {
      // Try to infer from ID format (18-char IDs) or default to Project
      // For now, default to Project if not specified
      recordType = 'SFDC_Project__c';
    }

    setIsSaving(true);
    try {
      const data = {
        projectId: recordIdToSave,
        companyName,
        companyLogo: manualLogoUrl || companyLogo,
        selectedTeam,
        projectScope,
        deliverables,
        recordType,
        // Map lookup fields based on record type
        ...(recordType === 'Account' && { accountId: recordIdToSave }),
        ...(recordType === 'Opportunity' && { opportunityId: recordIdToSave }),
        ...(recordType === 'SFDC_Project__c' && { projectId_sf: recordIdToSave }),
      };

      if (isEditMode) {
        await updateProjectTeam(recordIdToSave, data, EDIT_PASSWORD);
        toast({
          title: 'Project updated',
          description: 'Project team data has been updated successfully in Salesforce.',
        });
      } else {
        await saveProjectTeam(data);
        toast({
          title: 'Project saved',
          description: 'Project team data has been saved successfully to Salesforce.',
        });
      }
    } catch (error: any) {
      console.error('Error saving project team:', error);
      const errorMessage = error?.message || 'Failed to save project team data to Salesforce.';
      
      // Check for specific error types
      if (errorMessage.includes('authentication') || errorMessage.includes('token')) {
        toast({
          title: 'Authentication Error',
          description: 'Please refresh the page to re-authenticate with Salesforce.',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('permission') || errorMessage.includes('INSUFFICIENT_ACCESS')) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to perform this action. Please contact your Salesforce administrator.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error saving',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle logo override
  const handleLogoOverride = () => {
    if (manualLogoUrl) {
      setCompanyLogo(manualLogoUrl);
      setShowLogoOverride(false);
      toast({
        title: 'Logo updated',
        description: 'Company logo has been updated.',
      });
    }
  };

  const selectedTeamMembers = selectedTeam
    .map(id => getTeamMemberById(id))
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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

            {/* Edit Button */}
            {!isEditMode && (
              <Button
                onClick={() => setShowPasswordDialog(true)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Team Selection</h1>
          <p className="text-gray-400">Select team members and define project details</p>
        </div>

        {/* Salesforce Record Lookup and Company Name (Editable in edit mode) */}
        {isEditMode && (
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-300">Link to Salesforce Record</Label>
                <button
                  onClick={() => {
                    setUseManualEntry(!useManualEntry);
                    if (!useManualEntry) {
                      setSelectedSalesforceRecord(null);
                    }
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  {useManualEntry ? 'Use Lookup' : 'Enter ID Manually'}
                </button>
              </div>
              
              {!useManualEntry ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm mb-2 block">Record Type</Label>
                      <Select
                        value={lookupObjectType}
                        onValueChange={(value: 'Opportunity' | 'SFDC_Project__c' | 'Account') => {
                          setLookupObjectType(value);
                          setSelectedSalesforceRecord(null);
                          setProjectId('');
                        }}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="SFDC_Project__c">Project</SelectItem>
                          <SelectItem value="Opportunity">Opportunity</SelectItem>
                          <SelectItem value="Account">Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-3">
                      <SalesforceLookup
                        objectType={lookupObjectType}
                        onChange={async (record) => {
                          setSelectedSalesforceRecord(record);
                          if (record) {
                            setProjectId(record.id);
                            // Auto-populate company name from Account
                            if (record.accountName) {
                              setCompanyName(record.accountName);
                            }
                            // Auto-populate website from Account
                            if (record.accountWebsite) {
                              setCompanyWebsite(record.accountWebsite);
                              // Fetch logo using the website
                              setLogoLoading(true);
                              try {
                                const result = await fetchCompanyLogo(record.accountWebsite);
                                if (result.logoUrl) {
                                  setCompanyLogo(result.logoUrl);
                                }
                              } catch (error) {
                                console.error('Error fetching logo:', error);
                              } finally {
                                setLogoLoading(false);
                              }
                            }
                          } else {
                            setProjectId('');
                            setCompanyName('');
                            setCompanyWebsite('');
                            setCompanyLogo('');
                          }
                        }}
                        placeholder={`Search ${lookupObjectType === 'SFDC_Project__c' ? 'Project' : lookupObjectType}...`}
                        label=""
                      />
                    </div>
                  </div>
                  {selectedSalesforceRecord && (
                    <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>
                          <span className="font-semibold">Selected:</span> {selectedSalesforceRecord.name}
                        </div>
                        {selectedSalesforceRecord.accountName && (
                          <div className="text-gray-400">
                            <span className="font-medium">Account:</span> {selectedSalesforceRecord.accountName}
                            {selectedSalesforceRecord.accountIndustry && (
                              <span className="ml-2">• Industry: {selectedSalesforceRecord.accountIndustry}</span>
                            )}
                            {selectedSalesforceRecord.accountWebsite && (
                              <span className="ml-2">• Website: {selectedSalesforceRecord.accountWebsite}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <Input
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      setSelectedSalesforceRecord(null);
                    }}
                    placeholder="Enter Salesforce Record ID (e.g., 0061234567890ABC)"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the Salesforce ID for Project (SFDC_Project__c), Opportunity, or Account
                  </p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        )}
        
        {/* Display selected record info when not in edit mode */}
        {!isEditMode && projectId && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-300">
              <span className="font-semibold">Linked Record ID:</span> {projectId}
            </div>
          </div>
        )}

        {/* Company Logo Section (Edit Mode) */}
        {isEditMode && companyName && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-gray-300">Company Logo</Label>
              <Button
                onClick={() => setShowLogoOverride(!showLogoOverride)}
                variant="ghost"
                size="sm"
                className="text-cyan-400 hover:text-cyan-300"
              >
                {showLogoOverride ? <EyeOff className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                {showLogoOverride ? 'Cancel' : 'Override Logo'}
              </Button>
            </div>
            
            {showLogoOverride ? (
              <div className="space-y-3">
                <Input
                  value={manualLogoUrl}
                  onChange={(e) => setManualLogoUrl(e.target.value)}
                  placeholder="Enter logo URL"
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleLogoOverride}
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Update Logo
                  </Button>
                  <Button
                    onClick={() => {
                      if (companyWebsite) {
                        fetchLogoForCompany(companyWebsite);
                      }
                    }}
                    size="sm"
                    variant="outline"
                    className="border-gray-600"
                    disabled={logoLoading}
                  >
                    {logoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Auto-fetch'}
                  </Button>
                </div>
              </div>
            ) : (
              companyLogo && (
                <img 
                  src={companyLogo} 
                  alt={companyName} 
                  className="h-16 w-auto object-contain"
                />
              )
            )}
          </div>
        )}

        {/* Team Selection Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-cyan-400" />
            Select Team Members
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => {
              const isSelected = selectedTeam.includes(member.id);
              const profile = teamProfiles[member.id];
              
              return (
                <motion.div
                  key={member.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                  onClick={() => toggleTeamMember(member.id)}
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
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-cyan-400 rounded-full p-1">
                          <CheckCircle2 className="h-5 w-5 text-gray-900" />
                        </div>
                      )}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMember(expandedMember === member.id ? null : member.id);
                      }}
                      className="mt-2 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      {expandedMember === member.id ? 'Hide' : 'View'} Profile
                    </button>
                  </div>
                  
                  {/* Expanded Profile */}
                  <AnimatePresence>
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
                            {profile.careerTrack.length > 0 && (
                              <div>
                                <strong>Career Track:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                  {profile.careerTrack.map((track, idx) => (
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
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Team Display */}
        {selectedTeamMembers.length > 0 && (
          <div className="mb-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-cyan-400" />
              Selected Team ({selectedTeamMembers.length})
            </h2>
            <div className="flex flex-wrap gap-4">
              {selectedTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => toggleTeamMember(member.id)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Scope and Deliverables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <Label htmlFor="projectScope" className="text-gray-300 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Project Scope
            </Label>
            <Textarea
              id="projectScope"
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              placeholder="Describe the project scope..."
              className="bg-gray-800 border-gray-600 text-white min-h-32"
              disabled={!isEditMode && !projectIdParam}
            />
          </div>
          <div>
            <Label htmlFor="deliverables" className="text-gray-300 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Deliverables
            </Label>
            <Textarea
              id="deliverables"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="List the project deliverables..."
              className="bg-gray-800 border-gray-600 text-white min-h-32"
              disabled={!isEditMode && !projectIdParam}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving || !projectId}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Project Team
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the password to enable edit mode for Cloudastick Project Managers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-gray-700 border-gray-600 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPassword('');
                }}
                className="border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTeam;

