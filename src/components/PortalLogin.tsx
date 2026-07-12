import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, AlertCircle, Award } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import Button from './Button';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8 xl:p-12 relative overflow-x-hidden">
      {/* Background decorative elements for desktop */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] xl:grid-cols-[1.2fr,1fr] 2xl:grid-cols-[1.3fr,1fr] gap-6 lg:gap-8 xl:gap-12 2xl:gap-16 items-center relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full order-2 lg:order-1 flex-shrink-0"
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-14 border border-border/50 shadow-2xl hover:shadow-brand-primary/20 transition-all duration-500 hover:scale-[1.01] relative overflow-hidden group w-full">
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-brand-primary/0 to-brand-secondary/0 group-hover:from-brand-primary/5 group-hover:via-brand-primary/3 group-hover:to-brand-secondary/5 transition-all duration-500 rounded-3xl pointer-events-none" />
            <div className="relative z-10">
            <div className="text-center mb-8 lg:mb-10 xl:mb-12">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-gradient-to-br from-brand-primary via-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 xl:mb-8 shadow-2xl hover:shadow-brand-primary/50 transition-all duration-300 hover:scale-110 hover:rotate-6"
              >
                <LogIn className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16 text-white" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-foreground mb-2 lg:mb-3 xl:mb-4 leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text"
              >
                Cloudastick Education Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-sm sm:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-md mx-auto"
              >
                Sign in to access your learning materials
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6 xl:space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group"
              >
                <label htmlFor="username" className="block text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-2 lg:mb-3 xl:mb-4 group-focus-within:text-brand-primary transition-colors">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 lg:h-14 xl:h-16 text-base sm:text-lg lg:text-xl px-4 lg:px-6 xl:px-7 rounded-xl border-2 border-border/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 hover:border-brand-primary/50 bg-background/50 backdrop-blur-sm"
                  autoComplete="username"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="group"
              >
                <label htmlFor="password" className="block text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-2 lg:mb-3 xl:mb-4 group-focus-within:text-brand-primary transition-colors">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 lg:h-14 xl:h-16 text-base sm:text-lg lg:text-xl px-4 lg:px-6 xl:px-7 rounded-xl border-2 border-border/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all duration-300 hover:border-brand-primary/50 bg-background/50 backdrop-blur-sm"
                  autoComplete="current-password"
                />
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </motion.div>

              {displayError && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center gap-3 p-4 lg:p-5 bg-destructive/10 border-2 border-destructive/30 rounded-xl text-destructive text-sm sm:text-base lg:text-lg backdrop-blur-sm"
                >
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="font-medium">{displayError}</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 lg:h-16 xl:h-20 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold rounded-xl shadow-2xl hover:shadow-brand-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:brightness-110 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 lg:mr-3 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 lg:mr-3 group-hover:translate-x-1 transition-transform" />
                        <span>Sign In</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </motion.div>
            </form>
            </div>
          </div>
        </motion.div>

        {/* Certified People Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full order-1 lg:order-2 flex-shrink-0"
        >
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-14 border border-border/50 shadow-2xl hover:shadow-brand-primary/20 transition-all duration-500 hover:scale-[1.01] relative overflow-hidden group h-full flex flex-col w-full">
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-bl from-brand-secondary/0 via-brand-secondary/0 to-brand-primary/0 group-hover:from-brand-secondary/5 group-hover:via-brand-secondary/3 group-hover:to-brand-primary/5 transition-all duration-500 rounded-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
            <div className="text-center mb-6 lg:mb-8 xl:mb-10">
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-primary rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 xl:mb-8 shadow-2xl hover:shadow-brand-secondary/50 transition-all duration-300 hover:scale-110 hover:-rotate-6"
              >
                <Award className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16 text-white" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-foreground mb-2 lg:mb-3 xl:mb-4 leading-tight"
              >
                Certified Success Stories
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground max-w-md mx-auto"
              >
                Our clients achieving Salesforce certification excellence
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 flex-1">
              {certifiedPeople.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="bg-muted/50 backdrop-blur-sm rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 border-2 border-border/50 hover:border-brand-primary/70 hover:bg-muted/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 via-brand-primary/0 to-brand-secondary/0 group-hover:from-brand-primary/5 group-hover:via-brand-primary/3 group-hover:to-brand-secondary/5 transition-all duration-500 rounded-2xl pointer-events-none" />
                  <div className="relative z-10 flex items-center gap-4 sm:gap-5 lg:gap-6 xl:gap-7">
                    <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-2xl overflow-hidden bg-muted border-2 border-border group-hover:border-brand-primary/70 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-brand-primary/20">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-foreground mb-1 lg:mb-2 xl:mb-3 line-clamp-1 group-hover:text-brand-primary transition-colors duration-300">
                        {person.name}
                      </h3>
                      <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-muted-foreground line-clamp-1 mb-2 lg:mb-3 xl:mb-4 group-hover:text-foreground/80 transition-colors">
                        {person.company}
                      </p>
                      <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-brand-primary group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs sm:text-sm lg:text-base xl:text-lg text-brand-primary font-semibold group-hover:font-bold transition-all">
                          Salesforce Certified
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {certifiedPeople.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center py-8 lg:py-12 xl:py-16 text-muted-foreground flex-1 flex items-center justify-center"
              >
                <div>
                  <Award className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-auto mb-3 lg:mb-4 xl:mb-5 opacity-50" />
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl">More certifications coming soon</p>
                </div>
              </motion.div>
            )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalLogin;

