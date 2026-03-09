import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Loader2, ArrowLeft, Building2, FileText,
  Sparkles, CheckCircle2, Presentation,
  AlertCircle, LogOut, Layers, Edit, Save, X, Plus, Trash2, ExternalLink
} from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { useSalesforce } from '../contexts/SalesforceContext';
import { usePortalUser } from '../contexts/PortalUserContext';
import { fetchVerticalById, type Vertical, type VerticalModule } from '../services/verticalService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import RichTextEditor from '../components/RichTextEditor';
import { MessageSquare, Download } from 'lucide-react';
import OpportunityFeedbackModal from '../components/OpportunityFeedbackModal';

const getProposalDownloadUrl = (url: string) => {
  if (!url) return null;

  // Canva: Return design URL without params
  if (url.includes('canva.com/design/')) {
    return url.split('?')[0];
  }

  // Google Drive File
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([^\/\?]+)/);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }

  return url;
};

const SalesVerticalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authData, isLoading: authLoading } = useSalesforce();
  const { user: portalUser } = usePortalUser();

  // URL Params directly
  const [searchParams] = useSearchParams();
  const showModuleSelection = searchParams.get('modules') === 'true';

  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesUser, setSalesUser] = useState<{ id: string; name: string; email: string } | null>(null);

  // Module selection state
  const [selectedModules, setSelectedModules] = useState<Set<string>>(() => {
    if (!id) return new Set();
    const stored = sessionStorage.getItem(`vertical-modules-selection-${id}`);
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored selection', e);
      }
    }
    return new Set();
  });

  // Persist module selection
  useEffect(() => {
    if (id && showModuleSelection) {
      sessionStorage.setItem(
        `vertical-modules-selection-${id}`,
        JSON.stringify(Array.from(selectedModules))
      );
    }
  }, [id, selectedModules, showModuleSelection]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    featureList?: string;
    cloudastickEdge?: string;
    priority?: number | null;
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    featureList: '',
    cloudastickEdge: '',
    priority: null as number | null,
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingCredentials, setEditingCredentials] = useState(false);
  const [credentialValues, setCredentialValues] = useState({
    orgUsername: '',
    orgPassword: '',
  });
  const [editingCompanyProfile, setEditingCompanyProfile] = useState(false);
  const [companyProfileValue, setCompanyProfileValue] = useState('');
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);

  const handleDownloadProposal = (url: string) => {
    const downloadUrl = getProposalDownloadUrl(url);
    if (!downloadUrl) return;

    if (!hasSubmittedFeedback) {
      setPendingDownload(true);
      setShowFeedbackModal(true);
    } else {
      window.open(downloadUrl, '_blank');
    }
  };

  const handleFeedbackSuccess = (url: string) => {
    setHasSubmittedFeedback(true);
    const downloadUrl = getProposalDownloadUrl(url);
    if (pendingDownload && downloadUrl) {
      window.open(downloadUrl, '_blank');
      setPendingDownload(false);
    }
  };

  // Initialize all modules as selected if no previous selection exists
  useEffect(() => {
    if (vertical?.modules && showModuleSelection) {
      const storageKey = `vertical-modules-selection-${id}`;
      const stored = sessionStorage.getItem(storageKey);

      // Only default to all if nothing is stored
      if (!stored) {
        const allIds = new Set(vertical.modules.map(m => m.id));
        setSelectedModules(allIds);
      }
    }
  }, [vertical, showModuleSelection, id]);

  // Check if user is authenticated
  // Note: Portal_Sales_Access__c is verified during login on /sales page
  // Users must authenticate through /sales first, which enforces the Portal_Sales_Access__c check
  // Also check if user is logged in via portal (for already logged in contacts)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('sales-portal-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setSalesUser(user);
      } catch (error) {
        console.error('Error loading stored user:', error);
        // Check if portal user is logged in
        if (portalUser?.portalSalesAccess) {
          setSalesUser({
            id: portalUser.id,
            name: portalUser.name,
            email: portalUser.email || '',
          });
        } else {
          navigate('/sales');
        }
      }
    } else if (portalUser?.portalSalesAccess) {
      // Already logged in contact - allow access
      const newUser = {
        id: portalUser.id,
        name: portalUser.name,
        email: portalUser.email || '',
      };
      setSalesUser(newUser);
      // Persist to session storage for consistency with the main list page
      sessionStorage.setItem('sales-portal-user', JSON.stringify(newUser));
    } else {
      // Redirect to login if not authenticated
      navigate('/sales');
    }
  }, [navigate, portalUser]);

  // Load vertical data
  useEffect(() => {
    const loadVertical = async () => {
      if (!id || !authData?.access_token || !authData?.instance_url || authLoading) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchVerticalById(authData.access_token, authData.instance_url, id);
        setVertical(data);
        // Reset iframe state when vertical changes
        setIframeError(false);
        setIframeLoaded(false);
      } catch (err) {
        console.error('Error loading vertical:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load vertical details.';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVertical();
  }, [id, authData, authLoading, toast]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('sales-portal-user');
    navigate('/sales');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  // Toggle module selection
  const toggleModuleSelection = (moduleId: string) => {
    const newSelection = new Set(selectedModules);
    if (newSelection.has(moduleId)) {
      newSelection.delete(moduleId);
    } else {
      newSelection.add(moduleId);
    }
    setSelectedModules(newSelection);
  };

  const selectAllModules = () => {
    if (vertical?.modules) {
      const allIds = new Set(vertical.modules.map(m => m.id));
      setSelectedModules(allIds);
    }
  };

  const deselectAllModules = () => {
    setSelectedModules(new Set());
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {authLoading ? 'Authenticating...' : 'Loading vertical details...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !vertical) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <CardTitle className="text-white">Error</CardTitle>
            </div>
            <CardDescription className="text-gray-400">
              {error || 'Vertical not found'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/sales')}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Verticals
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort modules by priority (nulls last)
  const sortedModules = [...(vertical.modules || [])].sort((a, b) => {
    if (a.priority === null && b.priority === null) return 0;
    if (a.priority === null) return 1;
    if (b.priority === null) return -1;
    return (a.priority || 0) - (b.priority || 0);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/sales')}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/20 p-2 rounded-lg">
                  <Presentation className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  {vertical.type && (
                    <h1 className="text-2xl font-bold text-white">{vertical.type}</h1>
                  )}
                  {!vertical.type && (
                    <h1 className="text-2xl font-bold text-white">{vertical.name}</h1>
                  )}
                  <p className="text-sm text-gray-400">{vertical.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-300">{salesUser?.name}</p>
                <p className="text-xs text-gray-500">{salesUser?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Demo Script Summary */}
            {vertical.demoScriptSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-cyan-400" />
                      <CardTitle className="text-white">Demo Script Summary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="text-gray-300 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: vertical.demoScriptSummary || '' }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Company Profile */}
            {vertical.companyProfile && (() => {
              // Helper function to convert URLs to embeddable format
              const getEmbeddableUrl = (url: string): string => {
                // Google Drive PDF conversion
                if (url.includes('drive.google.com/file/d/')) {
                  // Extract file ID from various Google Drive URL formats
                  let fileId = '';

                  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
                  // Format: https://drive.google.com/file/d/FILE_ID/view
                  // Format: https://drive.google.com/file/d/FILE_ID
                  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                  if (fileIdMatch) {
                    fileId = fileIdMatch[1];
                  } else {
                    // Format: https://drive.google.com/open?id=FILE_ID
                    const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                    if (openIdMatch) {
                      fileId = openIdMatch[1];
                    }
                  }

                  if (fileId) {
                    return `https://drive.google.com/file/d/${fileId}/preview`;
                  }
                }

                // Canva links - check if it's already an embed URL or convert it
                if (url.includes('canva.com/design/')) {
                  const designMatch = url.match(/\/design\/([^\?]+)/);
                  if (designMatch) {
                    const designPath = designMatch[1].replace(/\/view$/, '').replace(/\/watch$/, '');
                    return `https://www.canva.com/design/${designPath}/view?embed`;
                  }
                }

                // Return original URL if no conversion needed
                return url;
              };

              // Check if companyProfile is a URL
              const isUrl = vertical.companyProfile.trim().startsWith('http://') ||
                vertical.companyProfile.trim().startsWith('https://');
              const profileUrl = isUrl ? vertical.companyProfile.trim() : null;
              const embeddableUrl = profileUrl ? getEmbeddableUrl(profileUrl) : null;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-cyan-400" />
                          <CardTitle className="text-white">Company Profile</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {profileUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(profileUrl, '_blank', 'noopener,noreferrer')}
                              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in New Tab
                            </Button>
                          )}
                          {profileUrl && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleDownloadProposal(profileUrl)}
                              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Proposal
                            </Button>
                          )}
                          {salesUser && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (editingCompanyProfile) {
                                  setEditingCompanyProfile(false);
                                  setCompanyProfileValue('');
                                  setIframeError(false);
                                  setIframeLoaded(false);
                                } else {
                                  setEditingCompanyProfile(true);
                                  setCompanyProfileValue(vertical.companyProfile || '');
                                  setIframeError(false);
                                  setIframeLoaded(false);
                                }
                              }}
                              className="text-gray-400 hover:text-white"
                            >
                              {editingCompanyProfile ? (
                                <X className="h-4 w-4" />
                              ) : (
                                <Edit className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingCompanyProfile ? (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Company Profile URL or HTML</Label>
                            <Textarea
                              value={companyProfileValue}
                              onChange={(e) => setCompanyProfileValue(e.target.value)}
                              className="bg-gray-800 border-gray-600 text-white text-sm font-mono min-h-[100px]"
                              placeholder="Enter URL (e.g., https://drive.google.com/...) or HTML content"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCompanyProfile(false);
                                setCompanyProfileValue('');
                                setIframeError(false);
                                setIframeLoaded(false);
                              }}
                              className="border-gray-600 text-gray-300"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={async () => {
                                if (!authData?.access_token || !authData?.instance_url || !id) {
                                  toast({
                                    title: 'Error',
                                    description: 'Salesforce authentication required',
                                    variant: 'destructive',
                                  });
                                  return;
                                }
                                setIsSaving(true);
                                try {
                                  const response = await fetch('/.netlify/functions/updateVertical', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      access_token: authData.access_token,
                                      instance_url: authData.instance_url,
                                      verticalId: id,
                                      companyProfile: companyProfileValue,
                                    }),
                                  });
                                  if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.message || 'Failed to update company profile');
                                  }
                                  // Reload vertical data
                                  const updated = await fetchVerticalById(authData.access_token, authData.instance_url, id);
                                  setVertical(updated);
                                  setEditingCompanyProfile(false);
                                  setCompanyProfileValue('');
                                  setIframeError(false);
                                  setIframeLoaded(false);
                                  toast({
                                    title: 'Success',
                                    description: 'Company profile updated successfully',
                                  });
                                } catch (error: any) {
                                  toast({
                                    title: 'Error',
                                    description: error.message || 'Failed to update company profile',
                                    variant: 'destructive',
                                  });
                                } finally {
                                  setIsSaving(false);
                                }
                              }}
                              disabled={isSaving}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white"
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Save
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : profileUrl && !iframeError ? (
                        <div className="flex flex-col gap-4">
                          <div className="w-full relative">
                            <iframe
                              src={embeddableUrl || profileUrl}
                              className="w-full h-[600px] border border-gray-600 rounded-lg"
                              title="Company Profile"
                              allow="fullscreen"
                              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                              onLoad={() => {
                                setIframeLoaded(true);
                              }}
                              onError={() => {
                                setIframeError(true);
                                setIframeLoaded(false);
                              }}
                              style={{ display: iframeError ? 'none' : 'block' }}
                            />
                            {!iframeLoaded && !iframeError && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg">
                                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                              </div>
                            )}
                          </div>

                          {/* Download button directly under the iframe for better visibility */}
                          <div className="flex justify-center">
                            <Button
                              variant="default"
                              size="lg"
                              onClick={() => handleDownloadProposal(profileUrl)}
                              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-cyan-500/20 group"
                            >
                              <Download className="h-5 w-5 mr-3 group-hover:translate-y-1 transition-transform" />
                              Download Proposal as PDF
                            </Button>
                          </div>
                        </div>
                      ) : profileUrl && iframeError ? (
                        <div className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">Unable to display in iframe</p>
                          <Button
                            variant="outline"
                            onClick={() => window.open(profileUrl, '_blank', 'noopener,noreferrer')}
                            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="text-gray-300 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: vertical.companyProfile || '' }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })()}

            {/* Vertical Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-cyan-400" />
                      <CardTitle className="text-white">
                        Modules {sortedModules.length > 0 && `(${sortedModules.length})`}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {showModuleSelection && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={selectAllModules}
                            className="text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={deselectAllModules}
                            className="text-xs border-gray-600 text-gray-400 hover:text-white"
                          >
                            Deselect All
                          </Button>
                        </>
                      )}
                      {salesUser && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCreatingModule(true)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Module
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Features and capabilities for this vertical
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCreatingModule && (
                    <Card className="bg-cyan-500/10 border-cyan-500/30 mb-4">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Create New Module</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-gray-300">Module Name</Label>
                          <Input
                            value={newModule.name}
                            onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                            placeholder="Enter module name"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Priority (optional)</Label>
                          <Input
                            type="number"
                            value={newModule.priority || ''}
                            onChange={(e) => setNewModule({ ...newModule, priority: e.target.value ? parseInt(e.target.value) : null })}
                            className="bg-gray-800 border-gray-600 text-white mt-1"
                            placeholder="Enter priority number"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Feature List</Label>
                          <RichTextEditor
                            value={newModule.featureList}
                            onChange={(value) => setNewModule({ ...newModule, featureList: value })}
                            placeholder="Enter feature list (HTML supported)"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Cloudastick Edge</Label>
                          <RichTextEditor
                            value={newModule.cloudastickEdge}
                            onChange={(value) => setNewModule({ ...newModule, cloudastickEdge: value })}
                            placeholder="Enter Cloudastick Edge content (HTML supported)"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsCreatingModule(false);
                              setNewModule({ name: '', featureList: '', cloudastickEdge: '', priority: null });
                            }}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (!newModule.name.trim()) {
                                toast({
                                  title: 'Error',
                                  description: 'Module name is required',
                                  variant: 'destructive',
                                });
                                return;
                              }
                              if (!authData?.access_token || !authData?.instance_url || !id) {
                                toast({
                                  title: 'Error',
                                  description: 'Salesforce authentication required',
                                  variant: 'destructive',
                                });
                                return;
                              }
                              setIsSaving(true);
                              try {
                                const response = await fetch('/.netlify/functions/createVerticalModule', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({
                                    access_token: authData.access_token,
                                    instance_url: authData.instance_url,
                                    verticalId: id,
                                    name: newModule.name,
                                    featureList: newModule.featureList,
                                    cloudastickEdge: newModule.cloudastickEdge,
                                    priority: newModule.priority,
                                  }),
                                });
                                if (!response.ok) {
                                  const errorData = await response.json();
                                  throw new Error(errorData.message || 'Failed to create module');
                                }
                                // Reload vertical data
                                const updated = await fetchVerticalById(authData.access_token, authData.instance_url, id);
                                setVertical(updated);
                                setIsCreatingModule(false);
                                setNewModule({ name: '', featureList: '', cloudastickEdge: '', priority: null });
                                toast({
                                  title: 'Success',
                                  description: 'Module created successfully',
                                });
                              } catch (error: any) {
                                toast({
                                  title: 'Error',
                                  description: error.message || 'Failed to create module',
                                  variant: 'destructive',
                                });
                              } finally {
                                setIsSaving(false);
                              }
                            }}
                            disabled={isSaving}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Create Module
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {sortedModules.length === 0 && !isCreatingModule ? (
                    <div className="text-center py-8">
                      <Layers className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No modules available for this vertical</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedModules.map((module, index) => (
                        <motion.div
                          key={module.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <Card className="bg-gray-900/50 border-gray-600 hover:border-cyan-500/50 transition-all">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {showModuleSelection && (
                                      <Checkbox
                                        checked={selectedModules.has(module.id)}
                                        onCheckedChange={() => toggleModuleSelection(module.id)}
                                        className="mr-2 border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white"
                                      />
                                    )}
                                    {module.priority !== null && (
                                      <span className="text-cyan-400 font-semibold text-lg">
                                        {module.priority}.
                                      </span>
                                    )}
                                    <CardTitle className="text-white text-lg">
                                      {module.name}
                                    </CardTitle>
                                    {salesUser && (
                                      <div className="flex items-center gap-2 ml-auto">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={async () => {
                                            if (!authData?.access_token || !authData?.instance_url) {
                                              toast({
                                                title: 'Error',
                                                description: 'Salesforce authentication required',
                                                variant: 'destructive',
                                              });
                                              return;
                                            }
                                            if (!confirm(`Are you sure you want to delete "${module.name}"? This action cannot be undone.`)) {
                                              return;
                                            }
                                            setIsDeleting(module.id);
                                            try {
                                              const response = await fetch('/.netlify/functions/deleteVerticalModule', {
                                                method: 'DELETE',
                                                headers: {
                                                  'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                  access_token: authData.access_token,
                                                  instance_url: authData.instance_url,
                                                  moduleId: module.id,
                                                }),
                                              });
                                              if (!response.ok) {
                                                const errorData = await response.json();
                                                throw new Error(errorData.message || 'Failed to delete module');
                                              }
                                              // Reload vertical data
                                              const updated = await fetchVerticalById(authData.access_token, authData.instance_url, id!);
                                              setVertical(updated);
                                              toast({
                                                title: 'Success',
                                                description: 'Module deleted successfully',
                                              });
                                            } catch (error: any) {
                                              toast({
                                                title: 'Error',
                                                description: error.message || 'Failed to delete module',
                                                variant: 'destructive',
                                              });
                                            } finally {
                                              setIsDeleting(null);
                                            }
                                          }}
                                          disabled={isDeleting === module.id}
                                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                          {isDeleting === module.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Trash2 className="h-4 w-4" />
                                          )}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            if (editingModule === module.id) {
                                              setEditingModule(null);
                                              setEditValues({});
                                            } else {
                                              setEditingModule(module.id);
                                              setEditValues({
                                                featureList: module.featureList || '',
                                                cloudastickEdge: module.cloudastickEdge || '',
                                                priority: module.priority,
                                              });
                                            }
                                          }}
                                          className="text-gray-400 hover:text-white"
                                        >
                                          {editingModule === module.id ? (
                                            <X className="h-4 w-4" />
                                          ) : (
                                            <Edit className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  {editingModule === module.id && (
                                    <div className="mb-3">
                                      <Label className="text-gray-300 text-sm mb-1 block">Priority (for ordering)</Label>
                                      <Input
                                        type="number"
                                        value={editValues.priority ?? ''}
                                        onChange={(e) => setEditValues({
                                          ...editValues,
                                          priority: e.target.value ? parseInt(e.target.value) : null
                                        })}
                                        className="bg-gray-800 border-gray-600 text-white w-24"
                                        placeholder="Priority"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">Lower numbers appear first. Leave empty for no priority.</p>
                                    </div>
                                  )}
                                  {editingModule === module.id ? (
                                    <RichTextEditor
                                      value={editValues.featureList || ''}
                                      onChange={(value) => setEditValues({ ...editValues, featureList: value })}
                                      placeholder="Feature list (HTML supported)"
                                      className="mb-3"
                                    />
                                  ) : module.featureList && (
                                    <div
                                      className="text-gray-400 mb-3 prose prose-invert max-w-none"
                                      dangerouslySetInnerHTML={{ __html: module.featureList || '' }}
                                    />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            {(editingModule === module.id || module.cloudastickEdge) && (
                              <CardContent>
                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                                  <div className="flex items-start gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-cyan-400 mb-1">
                                        Cloudastick Edge
                                      </p>
                                      {editingModule === module.id ? (
                                        <RichTextEditor
                                          value={editValues.cloudastickEdge || ''}
                                          onChange={(value) => setEditValues({ ...editValues, cloudastickEdge: value })}
                                          placeholder="Cloudastick Edge (HTML supported)"
                                          className="mb-3"
                                        />
                                      ) : (
                                        <div
                                          className="text-sm text-gray-300 prose prose-invert max-w-none"
                                          dangerouslySetInnerHTML={{ __html: module.cloudastickEdge || '' }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  {editingModule === module.id && (
                                    <div className="flex justify-end gap-2 mt-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingModule(null);
                                          setEditValues({});
                                        }}
                                        className="border-gray-600 text-gray-300"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={async () => {
                                          if (!authData?.access_token || !authData?.instance_url) {
                                            toast({
                                              title: 'Error',
                                              description: 'Salesforce authentication required',
                                              variant: 'destructive',
                                            });
                                            return;
                                          }
                                          setIsSaving(true);
                                          try {
                                            const response = await fetch('/.netlify/functions/updateVerticalModule', {
                                              method: 'POST',
                                              headers: {
                                                'Content-Type': 'application/json',
                                              },
                                              body: JSON.stringify({
                                                access_token: authData.access_token,
                                                instance_url: authData.instance_url,
                                                moduleId: module.id,
                                                featureList: editValues.featureList || '',
                                                cloudastickEdge: editValues.cloudastickEdge || '',
                                                priority: editValues.priority,
                                              }),
                                            });
                                            if (!response.ok) {
                                              const errorData = await response.json();
                                              throw new Error(errorData.message || 'Failed to update module');
                                            }
                                            // Reload vertical data
                                            const updated = await fetchVerticalById(authData.access_token, authData.instance_url, id!);
                                            setVertical(updated);
                                            setEditingModule(null);
                                            setEditValues({});
                                            toast({
                                              title: 'Success',
                                              description: 'Module updated successfully',
                                            });
                                          } catch (error: any) {
                                            toast({
                                              title: 'Error',
                                              description: error.message || 'Failed to update module',
                                              variant: 'destructive',
                                            });
                                          } finally {
                                            setIsSaving(false);
                                          }
                                        }}
                                        disabled={isSaving}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                                      >
                                        {isSaving ? (
                                          <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                          </>
                                        ) : (
                                          <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vertical.type && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-sm text-gray-300">{vertical.type}</p>
                    </div>
                  )}
                  {vertical.orgUsername && vertical.orgPassword && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Quick Login</p>
                      <Button
                        onClick={() => {
                          // Create a form to submit to Salesforce login
                          const form = document.createElement('form');
                          form.method = 'POST';
                          form.action = 'https://login.salesforce.com';
                          form.target = '_blank';

                          const usernameField = document.createElement('input');
                          usernameField.type = 'hidden';
                          usernameField.name = 'username';
                          usernameField.value = vertical.orgUsername;

                          const passwordField = document.createElement('input');
                          passwordField.type = 'hidden';
                          passwordField.name = 'pw';
                          passwordField.value = vertical.orgPassword;

                          form.appendChild(usernameField);
                          form.appendChild(passwordField);
                          document.body.appendChild(form);
                          form.submit();
                          document.body.removeChild(form);
                        }}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Login to Salesforce Org
                      </Button>
                    </div>
                  )}
                  {salesUser && (
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500">Org Credentials</p>
                      {!editingCredentials ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCredentials(true);
                            setCredentialValues({
                              orgUsername: vertical.orgUsername || '',
                              orgPassword: vertical.orgPassword || '',
                            });
                          }}
                          className="text-cyan-400 hover:text-cyan-300 h-6 px-2"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCredentials(false);
                            setCredentialValues({ orgUsername: '', orgPassword: '' });
                          }}
                          className="text-gray-400 hover:text-gray-300 h-6 px-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  {editingCredentials ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Org Username</Label>
                        <Input
                          value={credentialValues.orgUsername}
                          onChange={(e) => setCredentialValues({ ...credentialValues, orgUsername: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white text-sm font-mono"
                          placeholder="Enter org username"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Org Password</Label>
                        <Input
                          type="password"
                          value={credentialValues.orgPassword}
                          onChange={(e) => setCredentialValues({ ...credentialValues, orgPassword: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white text-sm font-mono"
                          placeholder="Enter org password"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCredentials(false);
                            setCredentialValues({ orgUsername: '', orgPassword: '' });
                          }}
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            if (!authData?.access_token || !authData?.instance_url || !id) {
                              toast({
                                title: 'Error',
                                description: 'Salesforce authentication required',
                                variant: 'destructive',
                              });
                              return;
                            }
                            setIsSaving(true);
                            try {
                              const response = await fetch('/.netlify/functions/updateVertical', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  access_token: authData.access_token,
                                  instance_url: authData.instance_url,
                                  verticalId: id,
                                  orgUsername: credentialValues.orgUsername,
                                  orgPassword: credentialValues.orgPassword,
                                }),
                              });
                              if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Failed to update credentials');
                              }
                              // Reload vertical data
                              const updated = await fetchVerticalById(authData.access_token, authData.instance_url, id);
                              setVertical(updated);
                              setEditingCredentials(false);
                              setCredentialValues({ orgUsername: '', orgPassword: '' });
                              toast({
                                title: 'Success',
                                description: 'Org credentials updated successfully',
                              });
                            } catch (error: any) {
                              toast({
                                title: 'Error',
                                description: error.message || 'Failed to update credentials',
                                variant: 'destructive',
                              });
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                          disabled={isSaving}
                          className="bg-cyan-500 hover:bg-cyan-600 text-white"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {vertical.orgUsername && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Org Username</p>
                          <p className="text-sm text-gray-300 font-mono">{vertical.orgUsername}</p>
                        </div>
                      )}
                      {vertical.orgPassword && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Org Password</p>
                          <p className="text-sm text-gray-300 font-mono">{vertical.orgPassword}</p>
                        </div>
                      )}
                    </>
                  )}
                  {vertical.document && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Document</p>
                      <p className="text-sm text-gray-300 break-all">{vertical.document}</p>
                    </div>
                  )}
                  {vertical.createdDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created</p>
                      <p className="text-sm text-gray-300">
                        {new Date(vertical.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Presentation Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-cyan-500/10 backdrop-blur-sm border-cyan-500/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Presentation className="h-5 w-5 text-cyan-400" />
                    <CardTitle className="text-white text-lg">Presentation Tips</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Start with the Demo Script Summary</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Highlight key modules and their priorities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Emphasize Cloudastick Edge features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Use the Company Profile for context</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      <OpportunityFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setPendingDownload(false);
        }}
        onSubmit={() => { }}
        onSuccess={() => {
          if (vertical.companyProfile) {
            handleFeedbackSuccess(vertical.companyProfile);
          }
        }}
      />
    </div>
  );
};

export default SalesVerticalDetail;
