import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Save, Lock, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { TeamMemberProfile } from '../data/teamProfiles';

interface TeamMemberProfileEditorProps {
  memberId: string;
  memberName: string;
  isOpen: boolean;
  onClose: () => void;
  initialProfile?: TeamMemberProfile | null;
}

const EDIT_PASSWORD = 'Cloudastick@Team$';

const TeamMemberProfileEditor: React.FC<TeamMemberProfileEditorProps> = ({
  memberId,
  memberName,
  isOpen,
  onClose,
  initialProfile,
}) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile fields
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [numberOfCertificates, setNumberOfCertificates] = useState(0);
  const [careerTrack, setCareerTrack] = useState<Array<{ company: string; period: string }>>([]);
  const [bio, setBio] = useState('');
  const [rawMarkdown, setRawMarkdown] = useState('');

  // Load initial profile data
  useEffect(() => {
    if (initialProfile) {
      setYearsOfExperience(initialProfile.yearsOfExperience);
      setNumberOfCertificates(initialProfile.numberOfCertificates);
      setCareerTrack(initialProfile.careerTrack);
      setBio(initialProfile.bio);
      setRawMarkdown(initialProfile.rawMarkdown);
    }
  }, [initialProfile]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setPassword('');
    }
  }, [isOpen]);

  const handlePasswordSubmit = () => {
    if (password === EDIT_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      toast({
        title: 'Authenticated',
        description: 'You can now edit the profile.',
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

  const handleAddCareerEntry = () => {
    setCareerTrack([...careerTrack, { company: '', period: '' }]);
  };

  const handleRemoveCareerEntry = (index: number) => {
    setCareerTrack(careerTrack.filter((_, i) => i !== index));
  };

  const handleCareerEntryChange = (index: number, field: 'company' | 'period', value: string) => {
    const updated = [...careerTrack];
    updated[index] = { ...updated[index], [field]: value };
    setCareerTrack(updated);
  };

  const generateMarkdown = (): string => {
    let md = `# ${memberName}\n\n`;
    md += `## Experience\n`;
    md += `- Years: ${yearsOfExperience}\n`;
    md += `- Certificates: ${numberOfCertificates}\n\n`;
    md += `## Career Track\n`;
    careerTrack.forEach(track => {
      if (track.company && track.period) {
        md += `- ${track.company} (${track.period})\n`;
      }
    });
    md += `\n## Bio\n${bio}\n`;
    return md;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedMarkdown = generateMarkdown();
      setRawMarkdown(updatedMarkdown);

      // Save to Netlify Blobs (we'll create an endpoint for this)
      // For now, we'll save it locally and show a message
      const profileData = {
        memberId,
        memberName,
        yearsOfExperience,
        numberOfCertificates,
        careerTrack,
        bio,
        rawMarkdown: updatedMarkdown,
        updatedAt: new Date().toISOString(),
      };

      // TODO: Call API to save profile edits
      // For now, we'll use localStorage as a temporary solution
      localStorage.setItem(`team-profile-${memberId}`, JSON.stringify(profileData));

      toast({
        title: 'Profile saved',
        description: 'Profile changes have been saved. Note: This is a temporary save. Full backend integration coming soon.',
      });

      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Error saving',
        description: error.message || 'Failed to save profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the password to edit team member profiles (Cloudastick Project Managers only).
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
                onClick={onClose}
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
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile: {memberName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update the team member's profile information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Experience Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years" className="text-gray-300">Years of Experience</Label>
              <Input
                id="years"
                type="number"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="certificates" className="text-gray-300">Number of Certificates</Label>
              <Input
                id="certificates"
                type="number"
                value={numberOfCertificates}
                onChange={(e) => setNumberOfCertificates(parseInt(e.target.value) || 0)}
                className="bg-gray-700 border-gray-600 text-white"
                min="0"
              />
            </div>
          </div>

          {/* Career Track Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-gray-300">Career Track</Label>
              <Button
                onClick={handleAddCareerEntry}
                size="sm"
                variant="outline"
                className="border-gray-600"
              >
                Add Entry
              </Button>
            </div>
            <div className="space-y-3">
              {careerTrack.map((track, index) => (
                <div key={index} className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <Label className="text-gray-400 text-sm">Company</Label>
                    <Input
                      value={track.company}
                      onChange={(e) => handleCareerEntryChange(index, 'company', e.target.value)}
                      placeholder="Company name"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Period</Label>
                    <div className="flex gap-2">
                      <Input
                        value={track.period}
                        onChange={(e) => handleCareerEntryChange(index, 'period', e.target.value)}
                        placeholder="e.g., 2020-2024"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        onClick={() => handleRemoveCareerEntry(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {careerTrack.length === 0 && (
                <p className="text-gray-500 text-sm">No career track entries. Click "Add Entry" to add one.</p>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <Label htmlFor="bio" className="text-gray-300">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Enter bio description..."
              className="bg-gray-700 border-gray-600 text-white min-h-32"
            />
          </div>

          {/* Markdown Preview */}
          <div>
            <Label className="text-gray-300 mb-2 block">Markdown Preview</Label>
            <div className="bg-gray-900 border border-gray-700 rounded p-4 max-h-64 overflow-y-auto">
              <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
                {generateMarkdown()}
              </pre>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberProfileEditor;

