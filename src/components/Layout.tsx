
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Home } from "lucide-react";
import { useState } from "react";
import Mira from "./Mira";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../contexts/LanguageContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { name: 'home-icon', path: "/", isIcon: true },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.services'), path: "/services" },
    { name: t('nav.apps'), path: "/salesforce-apps" },
    { name: t('nav.salesforce'), path: "/salesforce-power" },
    { name: t('nav.clients'), path: "/clients" },
    { name: t('nav.learn'), path: "/learn" },
    { name: t('nav.feedback'), path: "/feedback" },
    { name: t('nav.contact'), path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <img 
                  src="/Assets/Company Logos/white-logo-dark.webp" 
                  alt="Cloudastick Logo" 
                  className="h-8 w-auto"
                />
                <div className="text-2xl font-bold italic text-foreground"
                  style={{ 
                    fontFamily: 'Helvetica, Arial, sans-serif'
                  }}
                >
                  CLOUDASTICK
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-brand-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.isIcon ? (
                    <Home className="w-5 h-5" />
                  ) : (
                    item.name
                  )}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand-primary/10 rounded-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button and language switcher */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <button
                className="p-2 rounded-md text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? "text-brand-primary bg-brand-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.isIcon ? (
                    <Home className="w-5 h-5" />
                  ) : null}
                  {item.isIcon ? 'Home' : item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Mira Chatbot */}
      <Mira />
    </div>
  );
};

export default Layout;
