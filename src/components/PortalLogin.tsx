import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, AlertCircle, Award } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import Button from './Button';
import { Input } from './ui/input';

const PortalLogin = () => {
  const { login, isLoading, error } = usePortalUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter both username and password');
      return;
    }

    try {
      await login(username.trim(), password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setLocalError(errorMessage);
    }
  };

  const displayError = localError || error;

  // Certified people images from clients
  const certifiedPeople = [
    {
      id: 'hadeel-target-hr',
      image: '/Assets/Certified People/Hadeel and Target HR Manpower team certificed on salesforce.png',
      name: 'Hadeel and Target HR Manpower Team',
      company: 'Target HR Manpower'
    },
    {
      id: 'moumen-soueast',
      image: '/Assets/Certified People/Moumen from Soueast automotive certification.png',
      name: 'Moumen',
      company: 'Soueast Automotive'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Cloudastick Education Portal
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your learning materials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="w-full"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full"
                  autoComplete="current-password"
                />
              </div>

              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{displayError}</span>
                </motion.div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Certified People Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Certified Success Stories
              </h2>
              <p className="text-muted-foreground text-sm">
                Our clients achieving Salesforce certification excellence
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {certifiedPeople.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-muted/30 rounded-lg p-4 border border-border/50 hover:border-brand-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-muted border border-border">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                        {person.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {person.company}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Award className="w-4 h-4 text-brand-primary" />
                        <span className="text-xs text-brand-primary font-medium">
                          Salesforce Certified
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {certifiedPeople.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">More certifications coming soon</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalLogin;

