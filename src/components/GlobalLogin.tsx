import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, AlertCircle, User, LogOut, Award, Mail, ChevronDown } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';

const GlobalLogin = () => {
  const { user, login, logout, isLoading, error } = usePortalUser();
  const navigate = useNavigate();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
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
      // Login successful - close dialog and clear form
      setIsLoginDialogOpen(false);
      setUsername('');
      setPassword('');
      setLocalError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setLocalError(errorMessage);
    }
  };

  const handleLogout = () => {
    logout();
    // If on learn page, navigate away
    if (window.location.pathname === '/learn') {
      navigate('/');
    }
  };

  const displayError = localError || error;

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // If user is logged in, show user menu
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <div className="text-sm font-medium text-foreground">{user.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
            {user.numberOfCertifications > 0 && (
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Award className="h-3 w-3" />
                {user.numberOfCertifications} Certification{user.numberOfCertifications !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/learn')}>
            <Award className="mr-2 h-4 w-4" />
            Learning Portal
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user is not logged in, show login button
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsLoginDialogOpen(true)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
      </Button>

      <Dialog open={isLoginDialogOpen} onOpenChange={(open) => {
        setIsLoginDialogOpen(open);
        if (!open) {
          // Clear form when dialog closes
          setUsername('');
          setPassword('');
          setLocalError(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Cloudastick Portal
            </DialogTitle>
            <DialogDescription className="text-center">
              Sign in to access your learning materials and portal features
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && username && password) {
                    handleSubmit(e);
                  }
                }}
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
              variant="default"
              className="w-full"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalLogin;

