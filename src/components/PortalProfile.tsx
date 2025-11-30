import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Award, ExternalLink, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Person, 
  BusinessCenter, 
  Work, 
  Computer, 
  School, 
  Engineering,
  AccountCircle,
  Face,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { usePortalUser } from '../contexts/PortalUserContext';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

// Material 3 icon components for avatars
const avatarOptions = [
  Person,
  BusinessCenter,
  Work,
  Computer,
  Engineering,
  School,
  AccountCircle,
  Face,
  BadgeIcon
];

const getRandomAvatar = (userId: string): React.ComponentType<any> => {
  // Use userId to consistently assign same avatar to same user
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarOptions.length;
  return avatarOptions[index];
};

const PortalProfile = () => {
  const { user, logout, completed } = usePortalUser();
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);

  if (!user) {
    return null;
  }

  const AvatarIcon = getRandomAvatar(user.id);
  const badgeCount = completed.length;
  
  const certifications = user.certificationsList
    ? user.certificationsList
        .split(';')
        .map(cert => cert.trim())
        .filter(cert => cert.length > 0)
    : [];

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
              <AvatarIcon className="w-12 h-12 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl mb-1">{user.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* LinkedIn Link */}
          {user.linkedInUrl && (
            <motion.a
              href={user.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-brand-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <Linkedin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">LinkedIn</div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1">
                  View Profile
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </motion.a>
          )}

          {/* Trailhead Link */}
          {user.trailheadUrl && (
            <motion.a
              href={user.trailheadUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-brand-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Trailhead</div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1">
                  View Profile
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </motion.a>
          )}

          {/* Certifications Count */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">Completed Materials</div>
              <div className="text-2xl font-bold text-foreground">{badgeCount}</div>
            </div>
          </div>

          {/* Salesforce Certifications Count */}
          {user.numberOfCertifications > 0 && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Salesforce Certifications</div>
                <div className="text-2xl font-bold text-foreground">{user.numberOfCertifications}</div>
              </div>
            </div>
          )}
        </div>

        {/* Certifications List */}
        {certifications.length > 0 && (
          <Collapsible 
            open={isCertificationsOpen} 
            onOpenChange={setIsCertificationsOpen}
            className="mt-6"
          >
            <CollapsibleTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-brand-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    Salesforce Certifications ({certifications.length})
                  </span>
                </div>
                {isCertificationsOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </motion.button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: isCertificationsOpen ? 1 : 0,
                  height: isCertificationsOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {certifications.map((certification, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                          <BadgeIcon style={{ fontSize: '1.5rem', color: 'white' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground line-clamp-2">
                            {certification}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default PortalProfile;

