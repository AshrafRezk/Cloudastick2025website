import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Briefcase, Presentation, 
  ArrowRight, Award, Mail, User, 
  CheckCircle2, XCircle, Loader2
} from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';

interface SystemAccess {
  id: string;
  name: string;
  acronym: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  hasAccess: boolean;
  color: string;
  gradient: string;
}

const Profile = () => {
  const { user, logout } = usePortalUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/');
      return;
    }
    setIsLoading(false);
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Define available systems
  const systems: SystemAccess[] = [
    {
      id: 'lms',
      name: 'Learning Management System',
      acronym: 'LMS',
      description: 'Access your learning materials, track progress, and earn certifications',
      icon: <BookOpen className="h-8 w-8" />,
      path: '/learn',
      hasAccess: user.portalLMSAccess || false,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'cms',
      name: 'Case Management System',
      acronym: 'CMS',
      description: 'Manage and track support cases, tickets, and customer service requests',
      icon: <Briefcase className="h-8 w-8" />,
      path: '/cases',
      hasAccess: user.portalCMSAccess || false,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
    },
    {
      id: 'sss',
      name: 'Sales Support System',
      acronym: 'SSS',
      description: 'Access vertical presentations, sales materials, and customer resources',
      icon: <Presentation className="h-8 w-8" />,
      path: '/sales',
      hasAccess: user.portalSalesAccess || false,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  // Color class mappings
  const colorClasses = {
    blue: {
      badge: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      icon: 'text-blue-500',
      border: 'hover:border-blue-500/50',
      arrow: 'text-blue-500',
    },
    green: {
      badge: 'bg-green-500/10 text-green-600 border-green-500/20',
      icon: 'text-green-500',
      border: 'hover:border-green-500/50',
      arrow: 'text-green-500',
    },
    purple: {
      badge: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      icon: 'text-purple-500',
      border: 'hover:border-purple-500/50',
      arrow: 'text-purple-500',
    },
  };

  const getColorClasses = (color: string) => colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  const availableSystems = systems.filter(system => system.hasAccess);
  const unavailableSystems = systems.filter(system => !system.hasAccess);

  const handleSystemClick = (system: SystemAccess) => {
    if (system.hasAccess) {
      navigate(system.path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-2xl">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-3xl mb-2">{user.name}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.numberOfCertifications > 0 && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>{user.numberOfCertifications} Certification{user.numberOfCertifications !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  Logout
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Available Systems */}
        {availableSystems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Available Systems</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSystems.map((system, index) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card
                    className={`bg-card/80 backdrop-blur-sm border-border ${getColorClasses(system.color).border} transition-all cursor-pointer h-full group`}
                    onClick={() => handleSystemClick(system)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${system.gradient} text-white`}>
                          {system.icon}
                        </div>
                        <Badge className={getColorClasses(system.color).badge}>
                          {system.acronym}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{system.name}</CardTitle>
                      <CardDescription>{system.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className={`h-4 w-4 ${getColorClasses(system.color).icon}`} />
                          <span>Access Granted</span>
                        </div>
                        <ArrowRight className={`h-5 w-5 ${getColorClasses(system.color).arrow} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Unavailable Systems */}
        {unavailableSystems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Request Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unavailableSystems.map((system, index) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="text-muted-foreground">
                            {system.icon}
                          </div>
                        </div>
                        <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                          {system.acronym}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{system.name}</CardTitle>
                      <CardDescription>{system.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        <span>Access Not Available</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Contact your administrator to request access
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Systems Available */}
        {availableSystems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl mb-2">No System Access</CardTitle>
                <CardDescription>
                  You don't have access to any systems yet. Please contact your administrator to request access.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;

