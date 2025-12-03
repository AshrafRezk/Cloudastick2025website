import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Loader2, Search, Building2, 
  ArrowRight, Presentation, FileText, Sparkles,
  AlertCircle, LogIn
} from 'lucide-react';
import { useSalesforce } from '../contexts/SalesforceContext';
import { fetchAllVerticals, type Vertical } from '../services/verticalService';
import { loginSalesContact } from '../services/learningService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';

interface SalesUser {
  id: string;
  name: string;
  email: string;
}

const SalesVerticals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authData, isLoading: authLoading } = useSalesforce();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [salesUser, setSalesUser] = useState<SalesUser | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Data state
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [filteredVerticals, setFilteredVerticals] = useState<Vertical[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const storedUser = sessionStorage.getItem('sales-portal-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setSalesUser(user);
        setIsAuthenticated(true);
        if (authData) {
          loadVerticals();
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        sessionStorage.removeItem('sales-portal-user');
      }
    }
  }, [authData]);

  // Load verticals when authenticated
  useEffect(() => {
    if (isAuthenticated && authData && !authLoading) {
      loadVerticals();
    }
  }, [isAuthenticated, authData, authLoading]);

  // Filter verticals based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVerticals(verticals);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = verticals.filter(vertical => 
      vertical.name.toLowerCase().includes(term) ||
      vertical.type?.toLowerCase().includes(term) ||
      vertical.demoScriptSummary?.toLowerCase().includes(term)
    );
    setFilteredVerticals(filtered);
  }, [searchTerm, verticals]);

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const response = await loginSalesContact(username.trim(), password);
      
      if (response.success && response.contact) {
        // Portal_Sales_Access__c is checked in the salesLogin function
        // Only contacts with Portal_Sales_Access__c = true can access this portal
        setSalesUser({
          id: response.contact.id,
          name: response.contact.name,
          email: response.contact.email || '',
        });
        setIsAuthenticated(true);
        sessionStorage.setItem('sales-portal-user', JSON.stringify({
          id: response.contact.id,
          name: response.contact.name,
          email: response.contact.email || '',
        }));
        setUsername('');
        setPassword('');
        
        if (authData) {
          await loadVerticals();
        }
        
        toast({
          title: 'Login successful',
          description: `Welcome, ${response.contact.name}!`,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      setLoginError(errorMessage);
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSalesUser(null);
    setVerticals([]);
    setFilteredVerticals([]);
    sessionStorage.removeItem('sales-portal-user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  // Load verticals from Salesforce
  const loadVerticals = async () => {
    if (!authData?.access_token || !authData?.instance_url) {
      toast({
        title: 'Authentication required',
        description: 'Please wait for Salesforce authentication to complete.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchAllVerticals(authData.access_token, authData.instance_url);
      setVerticals(data);
      setFilteredVerticals(data);
    } catch (error) {
      console.error('Error loading verticals:', error);
      toast({
        title: 'Failed to load verticals',
        description: error instanceof Error ? error.message : 'An error occurred while loading verticals.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-cyan-500/20 p-3 rounded-full">
              <Presentation className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Cloudastick Sales Support Access
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Please enter your portal credentials to access vertical presentations.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !password) {
                    e.preventDefault();
                    document.getElementById('password')?.focus();
                  }
                }}
                placeholder="Enter your username"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white"
                autoFocus
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && username && password) {
                    handleLogin(e);
                  }
                }}
                placeholder="Enter your password"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white"
                required
              />
            </div>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}
            <Button
              type="submit"
              disabled={isLoggingIn || !username || !password}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">
            {authLoading ? 'Authenticating...' : 'Loading verticals...'}
          </p>
        </div>
      </div>
    );
  }

  // Main content - verticals grid
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Presentation className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cloudastick Sales Support</h1>
                <p className="text-sm text-gray-400">Vertical Presentations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-300">{salesUser?.name}</p>
                <p className="text-xs text-gray-500">{salesUser?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search verticals by name, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Verticals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredVerticals.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No verticals found' : 'No verticals available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Try adjusting your search terms.' 
                : 'There are no verticals available at this time.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVerticals.map((vertical, index) => (
              <motion.div
                key={vertical.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer h-full flex flex-col hover:shadow-lg hover:shadow-cyan-500/10"
                  onClick={() => navigate(`/sales/vertical/${vertical.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-cyan-500/20 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-cyan-400" />
                      </div>
                    </div>
                    {vertical.type ? (
                      <>
                        <CardTitle className="text-white text-xl mb-2">
                          {vertical.type}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mb-2">{vertical.name}</p>
                      </>
                    ) : (
                      <CardTitle className="text-white text-xl mb-2">
                        {vertical.name}
                      </CardTitle>
                    )}
                    {vertical.demoScriptSummary && (
                      <div 
                        className="text-gray-400 line-clamp-2 prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: vertical.demoScriptSummary }}
                      />
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <FileText className="h-4 w-4" />
                        <span>View Details</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-cyan-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesVerticals;

