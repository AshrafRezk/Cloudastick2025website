import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Input } from '../components/ui/input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/requestPasswordReset', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
        headers: { 'Content-Type': 'application/json' }
      });

      // We intentionally don't throw an error if the user isn't found
      // for security reasons, so we just show the success message regardless.
      if (!response.ok) {
        console.error('Password reset request failed');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error requesting password reset:', err);
      // Still show success for security to not leak registered emails,
      // unless it's a clear network error.
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Background decorative elements */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/50 shadow-2xl hover:shadow-brand-primary/20 transition-all duration-500 relative overflow-hidden group"
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/0 via-brand-primary/0 to-brand-secondary/0 group-hover:from-brand-primary/5 group-hover:via-brand-primary/3 group-hover:to-brand-secondary/5 transition-all duration-500 rounded-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <Link to="/learn" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-brand-primary mb-6 lg:mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
              >
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Forgot Password
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter your email and we'll send you a link to reset your password.
              </p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-brand-primary/10 border border-brand-primary/30 rounded-xl p-6 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  If an account exists with that email, we have sent a password reset link. It may take a few minutes to arrive.
                </p>
                <Button onClick={() => window.location.href = '/learn'} className="w-full">
                  Return to Login
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-foreground mb-2 group-focus-within:text-brand-primary transition-colors">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    className="w-full h-12 sm:h-14 text-base px-4 rounded-xl border-2 border-border/50 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all bg-background/50 backdrop-blur-sm"
                    autoComplete="email"
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
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-brand-primary/50 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
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

export default ForgotPassword;
