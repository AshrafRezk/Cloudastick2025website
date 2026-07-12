import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Input } from '../components/ui/input';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // If no token is provided, redirect or show an error
    if (!token) {
      setLocalError('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!password.trim() || !confirmPassword.trim()) {
      setLocalError('Please fill out both password fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return;
    }

    if (!token) {
      setLocalError('Invalid or missing password reset token.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/resetPassword', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/learn');
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resetting password';
      setLocalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/50 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-brand-primary/0 to-brand-secondary/0 group-hover:from-brand-primary/5 group-hover:via-brand-primary/3 group-hover:to-brand-secondary/5 transition-all duration-500 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <KeyRound className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Set New Password
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-primary/10 border border-brand-primary/30 rounded-xl p-6 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Password Reset Successful</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your password has been successfully updated. Redirecting you to login...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-foreground mb-2 group-focus-within:text-brand-primary transition-colors">
                    New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={isLoading || !token}
                    className="w-full h-12 sm:h-14 text-base px-4 rounded-xl border-2 border-border/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all bg-background/50 backdrop-blur-sm"
                  />
                </div>

                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-semibold text-foreground mb-2 group-focus-within:text-brand-primary transition-colors">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isLoading || !token}
                    className="w-full h-12 sm:h-14 text-base px-4 rounded-xl border-2 border-border/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all bg-background/50 backdrop-blur-sm"
                  />
                </div>

                {localError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl text-destructive text-sm"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{localError}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading || !token}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-brand-primary/50 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Resetting...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </span>
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
