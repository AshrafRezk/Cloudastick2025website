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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16 items-center">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full order-2 lg:order-1"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-border/50 shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300">
            <div className="text-center mb-8 lg:mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg"
              >
                <LogIn className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-2 lg:mb-3 leading-tight">
                Cloudastick Education Portal
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Sign in to access your learning materials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="username" className="block text-sm sm:text-base font-medium text-foreground mb-2 lg:mb-3">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 lg:h-14 text-base sm:text-lg px-4 lg:px-5 rounded-lg border-2 focus:border-brand-primary transition-colors"
                  autoComplete="username"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label htmlFor="password" className="block text-sm sm:text-base font-medium text-foreground mb-2 lg:mb-3">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 lg:h-14 text-base sm:text-lg px-4 lg:px-5 rounded-lg border-2 focus:border-brand-primary transition-colors"
                  autoComplete="current-password"
                />
              </motion.div>

              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 lg:p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm sm:text-base"
                >
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{displayError}</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Certified People Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full order-1 lg:order-2"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-border/50 shadow-2xl hover:shadow-brand-primary/10 transition-all duration-300">
            <div className="text-center mb-6 lg:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-lg"
              >
                <Award className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </motion.div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-2 lg:mb-3 leading-tight">
                Certified Success Stories
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                Our clients achieving Salesforce certification excellence
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
              {certifiedPeople.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-muted/40 rounded-xl p-4 sm:p-5 lg:p-6 border border-border/50 hover:border-brand-primary/50 hover:bg-muted/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="flex items-center gap-4 sm:gap-5 lg:gap-6">
                    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden bg-muted border-2 border-border group-hover:border-brand-primary/50 transition-all duration-300 shadow-md group-hover:shadow-lg">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg lg:text-xl text-foreground mb-1 lg:mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground line-clamp-1 mb-2 lg:mb-3">
                        {person.company}
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-brand-primary" />
                        <span className="text-xs sm:text-sm lg:text-base text-brand-primary font-medium">
                          Salesforce Certified
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {certifiedPeople.length === 0 && (
              <div className="text-center py-8 lg:py-12 text-muted-foreground">
                <Award className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-3 lg:mb-4 opacity-50" />
                <p className="text-sm sm:text-base lg:text-lg">More certifications coming soon</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalLogin;

