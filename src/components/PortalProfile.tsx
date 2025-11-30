import { motion } from 'framer-motion';
import { Mail, Linkedin, Award, ExternalLink, LogOut } from 'lucide-react';
import { 
  Person, 
  BusinessCenter, 
  Work, 
  Computer, 
  School, 
  Engineering,
  AccountCircle,
  Face,
  Badge
} from '@mui/icons-material';
import { usePortalUser } from '../contexts/PortalUserContext';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
  Badge
];

const getRandomAvatar = (userId: string): React.ComponentType<any> => {
  // Use userId to consistently assign same avatar to same user
  const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarOptions.length;
  return avatarOptions[index];
};

const PortalProfile = () => {
  const { user, logout, completed } = usePortalUser();

  if (!user) {
    return null;
  }

  const AvatarIcon = getRandomAvatar(user.id);
  const badgeCount = completed.length;

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
        {user.certificationsList && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="text-sm font-medium text-foreground mb-2">Certifications:</div>
            <div className="text-sm text-muted-foreground">{user.certificationsList}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortalProfile;

