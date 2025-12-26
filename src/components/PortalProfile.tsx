import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Award, ExternalLink, LogOut, ChevronDown, ChevronUp, Link2 } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';
import { getCertificateUrl } from '../services/certificateService';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';

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
  const { user, logout, completed, certificates, updateTrailheadUrl } = usePortalUser();
  const navigate = useNavigate();
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [isLmsCertificatesOpen, setIsLmsCertificatesOpen] = useState(false);
  const [isTrailheadModalOpen, setIsTrailheadModalOpen] = useState(false);
  const [trailheadUrlInput, setTrailheadUrlInput] = useState('');
  const [isUpdatingTrailhead, setIsUpdatingTrailhead] = useState(false);
  const [trailheadError, setTrailheadError] = useState<string | null>(null);

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

  const handleOpenTrailheadModal = () => {
    setTrailheadUrlInput(user.trailheadUrl || '');
    setTrailheadError(null);
    setIsTrailheadModalOpen(true);
  };

  const handleCloseTrailheadModal = () => {
    setIsTrailheadModalOpen(false);
    setTrailheadUrlInput('');
    setTrailheadError(null);
  };

  const handleSaveTrailheadUrl = async () => {
    if (!trailheadUrlInput.trim()) {
      setTrailheadError('Please enter a Trailhead profile URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(trailheadUrlInput.trim());
    } catch {
      setTrailheadError('Please enter a valid URL');
      return;
    }

    try {
      setIsUpdatingTrailhead(true);
      setTrailheadError(null);
      await updateTrailheadUrl(trailheadUrlInput.trim());
      setIsTrailheadModalOpen(false);
      setTrailheadUrlInput('');
    } catch (error) {
      setTrailheadError(error instanceof Error ? error.message : 'Failed to update Trailhead URL');
    } finally {
      setIsUpdatingTrailhead(false);
    }
  };

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
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

          {/* Trailhead Link or Link Button */}
          {user.trailheadUrl ? (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Trailhead</div>
                <a
                  href={user.trailheadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground flex items-center gap-1 hover:underline"
                >
                  View Profile
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenTrailheadModal}
                className="flex items-center gap-1"
              >
                <Link2 className="w-3 h-3" />
                Update
              </Button>
            </div>
          ) : (
            <motion.button
              onClick={handleOpenTrailheadModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border hover:border-brand-primary/30 transition-colors text-left w-full"
            >
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Trailhead</div>
                <div className="text-sm font-medium text-foreground">
                  Link your Trailhead profile
                </div>
              </div>
            </motion.button>
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

          {/* LMS Certificates Count */}
          {certificates.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Course Certificates</div>
                <div className="text-2xl font-bold text-foreground">{certificates.length}</div>
              </div>
            </div>
          )}

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

        {/* LMS Certificates List */}
        {certificates.length > 0 && (
          <Collapsible 
            open={isLmsCertificatesOpen} 
            onOpenChange={setIsLmsCertificatesOpen}
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
                    Course Certificates ({certificates.length})
                  </span>
                </div>
                {isLmsCertificatesOpen ? (
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
                  opacity: isLmsCertificatesOpen ? 1 : 0,
                  height: isLmsCertificatesOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {certificates.map((certificate, index) => (
                    <motion.div
                      key={certificate.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <motion.button
                        onClick={() => navigate(`/certificate/${certificate.certificateId}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center gap-3 p-3 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg hover:border-green-500/40 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                            {certificate.learningMaterialTitle}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(certificate.issuedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>

      {/* Trailhead URL Modal */}
      <Dialog open={isTrailheadModalOpen} onOpenChange={setIsTrailheadModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Link Your Trailhead Profile</DialogTitle>
            <DialogDescription>
              Paste your Trailhead profile URL to link it to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="trailhead-url" className="text-sm font-medium text-foreground">
                Trailhead Profile URL
              </label>
              <Input
                id="trailhead-url"
                type="url"
                placeholder="https://trailblazer.me/id/..."
                value={trailheadUrlInput}
                onChange={(e) => {
                  setTrailheadUrlInput(e.target.value);
                  setTrailheadError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTrailheadUrl();
                  }
                }}
                className={trailheadError ? 'border-red-500' : ''}
              />
              {trailheadError && (
                <p className="text-sm text-red-500">{trailheadError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCloseTrailheadModal}
                disabled={isUpdatingTrailhead}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveTrailheadUrl}
                disabled={isUpdatingTrailhead || !trailheadUrlInput.trim()}
              >
                {isUpdatingTrailhead ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PortalProfile;

