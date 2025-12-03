import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, Building2, FileText, 
  Sparkles, CheckCircle2, Presentation, 
  AlertCircle, LogOut, Layers
} from 'lucide-react';
import { useSalesforce } from '../contexts/SalesforceContext';
import { fetchVerticalById, type Vertical, type VerticalModule } from '../services/verticalService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';

const SalesVerticalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authData, isLoading: authLoading } = useSalesforce();
  
  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesUser, setSalesUser] = useState<{ id: string; name: string; email: string } | null>(null);

  // Check if user is authenticated
  // Note: Portal_Sales_Access__c is verified during login on /sales page
  // Users must authenticate through /sales first, which enforces the Portal_Sales_Access__c check
  useEffect(() => {
    const storedUser = sessionStorage.getItem('sales-portal-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setSalesUser(user);
      } catch (error) {
        console.error('Error loading stored user:', error);
        navigate('/sales');
      }
    } else {
      // Redirect to login if not authenticated
      navigate('/sales');
    }
  }, [navigate]);

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
                  <h1 className="text-2xl font-bold text-white">{vertical.name}</h1>
                  {vertical.type && (
                    <p className="text-sm text-gray-400">{vertical.type}</p>
                  )}
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
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {vertical.demoScriptSummary}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Company Profile */}
            {vertical.companyProfile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-cyan-400" />
                      <CardTitle className="text-white">Company Profile</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {vertical.companyProfile}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Vertical Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-5 w-5 text-cyan-400" />
                    <CardTitle className="text-white">
                      Modules {sortedModules.length > 0 && `(${sortedModules.length})`}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-400">
                    Features and capabilities for this vertical
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sortedModules.length === 0 ? (
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
                                    <CardTitle className="text-white text-lg">
                                      {module.name}
                                    </CardTitle>
                                    {module.priority !== null && (
                                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                                        Priority {module.priority}
                                      </Badge>
                                    )}
                                  </div>
                                  {module.featureList && (
                                    <CardDescription className="text-gray-400 mb-3">
                                      {module.featureList}
                                    </CardDescription>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            {module.cloudastickEdge && (
                              <CardContent>
                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                                  <div className="flex items-start gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm font-semibold text-cyan-400 mb-1">
                                        Cloudastick Edge
                                      </p>
                                      <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {module.cloudastickEdge}
                                      </p>
                                    </div>
                                  </div>
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
    </div>
  );
};

export default SalesVerticalDetail;
