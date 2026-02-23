import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import {
  ArrowRight,
  ChevronDown,
  Play,
  CheckCircle2,
  Zap,
  Globe,
  Database,
  Users,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  PieChart,
  Heart,
  Factory,
  Phone,
  CreditCard,
  Brain,
  Workflow,
  Shield,
  Target,
  TrendingUp,
  Settings,
  Sparkles,
  Star,
  ArrowDown,
  RefreshCw,
  Headphones,
  Cloud,
  Share2,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Pause,
  Download,
  DollarSign,
  Clock,
  AlertTriangle,
  Info,
  Building2,
  Award,
  GraduationCap,
  Headset,
  Tag,
  UserCheck,
  Layers,
  Paintbrush,
  Search as SearchIcon
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import LeadCaptureModal from '../components/LeadCaptureModal';
import { salesforceProducts, getProductsByIndustry } from '../data/salesforceProducts';
import { erpIntegrations } from '../data/erpIntegrations';
import { industries, getIndustryById, createGenericIndustryData } from '../data/industries';
import { matchIndustryFromUrl } from '../utils/industryMatcher';
import { useToast } from '../hooks/use-toast';
import CompanyLogo from '../components/CompanyLogo';
import { formatWebsiteUrl } from '../services/logoService';
import { enrichCompany as enrichCompanyService, initCompanyIntelligence, CompanyIntelligence } from '../services/companyIntelligence';
import ProductRecommendationBanner from '../components/ProductRecommendationBanner';
import { normalizeWebsiteUrl, formatForLogoFetch } from '../utils/urlNormalizer';
import { getClientsByIndustry, getAllClients } from '../utils/clientFilter';
import { getClientLogoPath } from '../utils/clientLogoHelper';
import ClientModal from '../components/ClientModal';
import { ClientInfo } from '../data/clientsData';
import FigmaDemoModal from '../components/FigmaDemoModal';
import InteractiveStorefrontDemo from '../components/InteractiveStorefrontDemo';
import TechSaSection from '../components/TechSaSection';
import AmadeusSection from '../components/AmadeusSection';
import FleetManagementSection from '../components/FleetManagementSection';
import PharmaSections from '../components/PharmaSections';
import InvestmentPlanSection from '../components/InvestmentPlanSection';
import ModulesSection from '../components/ModulesSection';
import { useSalesforce } from '../contexts/SalesforceContext';
import { fetchAllVerticals, fetchVerticalById, type VerticalModule, type Vertical } from '../services/verticalService';
import { useUserTracking } from '../hooks/useUserTracking';

import ScopeBuilderFab from '../components/ScopeBuilderFab';

// Modern Carousel Hub and Spoke Component
const HubAndSpokeVisualization = React.memo(({
  products,
  onProductHover,
  hoveredProduct
}: {
  products: any[],
  onProductHover: (id: string | null) => void,
  hoveredProduct: string | null
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight' && currentIndex < products.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsAutoPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, products.length]);

  const currentProduct = products[currentIndex];
  const nextProduct = products[(currentIndex + 1) % products.length];
  const prevProduct = products[currentIndex === 0 ? products.length - 1 : currentIndex - 1];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Carousel Container */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Central Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            {/* Central Cloud Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            {/* Pulsing Ring */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-blue-400/50"
            />
          </motion.div>
        </div>

        {/* Product Cards Carousel */}
        <div className="relative h-80 sm:h-96">
          {/* Current Product - Center */}
          <motion.div
            key={`current-${currentIndex}`}
            initial={{ scale: 0.8, opacity: 0, x: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: 0, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            onMouseEnter={() => onProductHover(currentProduct.id)}
            onMouseLeave={() => onProductHover(null)}
            onTouchStart={() => onProductHover(currentProduct.id)}
            onTouchEnd={() => setTimeout(() => onProductHover(null), 2000)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br ${currentProduct.gradient} rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-2xl group relative touch-manipulation border-2 border-white/20`}
            >
              <currentProduct.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white mb-1" />
              <div className="text-xs sm:text-sm text-white font-semibold text-center px-2">
                {currentProduct.shortName}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </motion.div>

          {/* Next Product - Right */}
          <motion.div
            key={`next-${currentIndex}`}
            initial={{ scale: 0.7, opacity: 0.6, x: 200, y: 0 }}
            animate={{ scale: 0.8, opacity: 0.7, x: 120, y: 0 }}
            exit={{ scale: 0.7, opacity: 0.6, x: 200, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5"
            onMouseEnter={() => onProductHover(nextProduct.id)}
            onMouseLeave={() => onProductHover(null)}
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${nextProduct.gradient} rounded-xl flex items-center justify-center cursor-pointer shadow-lg group relative opacity-70`}>
              <nextProduct.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </motion.div>

          {/* Previous Product - Left */}
          <motion.div
            key={`prev-${currentIndex}`}
            initial={{ scale: 0.7, opacity: 0.6, x: -200, y: 0 }}
            animate={{ scale: 0.8, opacity: 0.7, x: -120, y: 0 }}
            exit={{ scale: 0.7, opacity: 0.6, x: -200, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-5"
            onMouseEnter={() => onProductHover(prevProduct.id)}
            onMouseLeave={() => onProductHover(null)}
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${prevProduct.gradient} rounded-xl flex items-center justify-center cursor-pointer shadow-lg group relative opacity-70`}>
              <prevProduct.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-500 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => {
            setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
            setIsAutoPlaying(false);
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/80 hover:bg-gray-700/80 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-10"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={() => {
            setCurrentIndex((currentIndex + 1) % products.length);
            setIsAutoPlaying(false);
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/80 hover:bg-gray-700/80 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 z-10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 hover:bg-gray-700/80 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Product Info Panel */}
      <AnimatePresence>
        {hoveredProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-30 w-80 sm:w-96"
          >
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-2xl">
              {(() => {
                const product = products.find(p => p.id === hoveredProduct);
                if (!product) return null;

                return (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${product.gradient} rounded-lg flex items-center justify-center`}>
                        <product.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.shortName}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {product.description}
                    </p>
                    {product.challenges && product.challenges.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Key Challenges Solved:</h4>
                        <ul className="space-y-1">
                          {product.challenges.slice(0, 3).map((challenge: string, index: number) => (
                            <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

HubAndSpokeVisualization.displayName = 'HubAndSpokeVisualization';

const SalesforcePower = () => {
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showPlatformOverview, setShowPlatformOverview] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [companyWebsite, setCompanyWebsite] = useState<string>('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [showCompanyInput, setShowCompanyInput] = useState<boolean>(false);
  const [hasPrefilledParams, setHasPrefilledParams] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());
  const [showLeadModal, setShowLeadModal] = useState<boolean>(false);
  const [isDirectAccess, setIsDirectAccess] = useState<boolean>(false);
  const [hubDimensions, setHubDimensions] = useState({
    width: typeof window !== 'undefined' && window.innerWidth < 768 ? Math.min(window.innerWidth - 48, 350) : 800,
    height: typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : 600
  });
  const [companyIntelligence, setCompanyIntelligence] = useState<CompanyIntelligence | null>(null);
  const [loadingIntelligence, setLoadingIntelligence] = useState<boolean>(false);
  const [showProductRecommendation, setShowProductRecommendation] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(false);
  const [genericIndustryData, setGenericIndustryData] = useState<ReturnType<typeof createGenericIndustryData> | null>(null);

  // Modules state
  const { authData } = useSalesforce();
  const showModulesSection = searchParams.get('modules') === 'true';
  const [modules, setModules] = useState<VerticalModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<string>>(new Set());
  const [allVerticals, setAllVerticals] = useState<any[]>([]); // Store all verticals once fetched

  // Initialize behavior tracking
  useUserTracking([
    'hero-section',
    'hub-and-spoke',
    'comparison-table',
    'personalization-section',
    'platform-overview',
    'industries-grid',
    'pharma-sections',
    'financial-sections',
    'real-estate-sections',
    'investment-plan-section',
    'modules-section',
    'techsa-section',
    'landing-fleet-management',
    'amadeus-section'
  ]);



  // Handle module toggle
  const handleToggleModule = (moduleId: string) => {
    triggerHaptic([5, 0, 0], '/Assets/selection4new.mp3');
    const newSet = new Set(selectedModuleIds);
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId);
    } else {
      newSet.add(moduleId);
    }
    setSelectedModuleIds(newSet);

    // Persist to session storage
    if (modules.length > 0) {
      const verticalId = modules[0]?.verticalId;
      if (verticalId) {
        sessionStorage.setItem(`vertical-modules-selection-${verticalId}`, JSON.stringify(Array.from(newSet)));
      }
    }
  };

  // Handle vertical change from FAB
  const handleVerticalChange = (verticalId: string) => {
    triggerHaptic([10, 5, 10], '/Assets/selection3new.mp3');

    if (showModulesSection) {
      // If modules section is active, only change the vertical for modules

      // 1. Check if verticalId is already a valid Salesforce ID
      const isDirectId = allVerticals.some(v => v.id === verticalId);

      if (isDirectId) {
        setModulesVerticalId(verticalId);
        return;
      }

      // 2. If not a direct ID, try to map slug to Salesforce ID
      const sfId = getSalesforceVerticalId(verticalId);

      if (sfId) {
        setModulesVerticalId(sfId);
      } else {
        console.warn(`Could not map industry slug '${verticalId}' to a Salesforce Vertical ID.`);
        toast({
          title: "Vertical Not Found",
          description: "The selected industry does not have a mapped Salesforce Vertical yet.",
          variant: "destructive"
        });
      }
      return;
    }

    setSelectedIndustry(verticalId);
    // Optional: Clear or reset modules selection for new vertical if needed, 
    // but useEffect above handles loading stored selection for the new vertical.

    // Update URL to reflect change
    const params = new URLSearchParams(searchParams);
    params.set('industry', verticalId);
    // params.set('modules', 'true'); // Ensure modules mode stays on
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`);

    // Scroll to top or specific section if needed
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle scroll to modules section
  const handleScrollToModules = () => {
    const element = document.getElementById('modules-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Memoized hover handler to prevent unnecessary re-renders
  const handleProductHover = useCallback((productId: string | null) => {
    setHoveredProduct(productId);
  }, []);

  // Handle client logo click
  const handleClientClick = (client: ClientInfo) => {
    triggerHaptic([10, 5, 10], '/Assets/selection4new.mp3');
    setSelectedClient(client);
    setShowClientModal(true);
  };

  // Handle demo modal
  const handleOpenDemo = () => {
    triggerHaptic([15, 10, 15], '/Assets/selection3new.mp3');
    setShowDemoModal(true);
  };

  const handleCloseDemo = () => {
    setShowDemoModal(false);
  };

  // Copy table link function
  const copyTableLink = () => {
    // Haptic feedback with sound
    triggerHaptic([5, 3, 5], '/Assets/woosh1new.mp3');

    // Build URL parameters (simple, no encoding)
    const params = new URLSearchParams();
    params.set('lang', language);

    if (selectedIndustry) {
      params.set('industry', selectedIndustry);
    }

    if (companyName) {
      params.set('cn', companyName);
    }

    if (companyWebsite) {
      params.set('cw', companyWebsite);
    }

    const url = `${window.location.origin}/salesforce-power?${params.toString()}#comparison-table`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share this personalized analysis",
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();

      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Share this personalized analysis",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle lead modal success
  const handleLeadModalSuccess = (data: { companyName: string; industry: string }) => {
    setCompanyName(data.companyName);
    setSelectedIndustry(data.industry);
    setShowLeadModal(false);
    setIsDirectAccess(false);

    // Scroll to comparison table after a short delay
    setTimeout(() => {
      const tableElement = document.getElementById('comparison-table');
      if (tableElement) {
        tableElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };

  // Handle lead modal close
  const handleLeadModalClose = () => {
    setShowLeadModal(false);
    if (isDirectAccess) {
      // If it was a direct access and user closes modal, redirect to main page
      window.location.href = '/salesforce-power';
    }
  };

  // Fetch company logo function with multiple fallback methods
  const fetchCompanyLogo = useCallback(async (website: string) => {
    if (!website || !website.trim()) {
      console.warn('No website provided for logo fetch');
      return;
    }

    setLogoLoading(true);
    setLogoError(false);

    // Normalize the website to get clean domain
    const normalized = normalizeWebsiteUrl(website.trim());
    const domain = normalized.domain || normalized.display || website.trim();

    if (!domain) {
      console.warn('Could not extract domain from website:', website);
      setLogoError(true);
      setLogoLoading(false);
      return;
    }

    console.log('Fetching logo for domain:', domain);

    try {
      // Method 1: Try Netlify function (uses Clearbit + favicon)
      const response = await fetch('/.netlify/functions/fetchLogo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website: domain }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.logoUrl) {
          console.log('Logo found via Netlify function:', data.source);
          setCompanyLogo(data.logoUrl);
          setLogoError(false);
          setLogoLoading(false);
          return;
        }
      }

      // Method 2: Try Clearbit directly as fallback
      console.log('Netlify function did not return logo, trying Clearbit directly...');
      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
      try {
        const clearbitResponse = await fetch(clearbitUrl, { method: 'HEAD' });
        if (clearbitResponse.ok) {
          const contentType = clearbitResponse.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            console.log('Logo found via Clearbit direct');
            setCompanyLogo(clearbitUrl);
            setLogoError(false);
            setLogoLoading(false);
            return;
          }
        }
      } catch (clearbitError) {
        console.warn('Clearbit direct fetch failed:', clearbitError);
      }

      // Method 3: Try Google favicon as last resort
      console.log('Clearbit failed, trying Google favicon...');
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      try {
        const faviconResponse = await fetch(faviconUrl, { method: 'HEAD' });
        if (faviconResponse.ok) {
          const contentType = faviconResponse.headers.get('content-type');
          if (contentType && contentType.startsWith('image/')) {
            console.log('Logo found via Google favicon');
            setCompanyLogo(faviconUrl);
            setLogoError(false);
            setLogoLoading(false);
            return;
          }
        }
      } catch (faviconError) {
        console.warn('Google favicon fetch failed:', faviconError);
      }

      // No logo found from any method
      console.warn('No logo found for domain:', domain);
      setCompanyLogo(null);
      setLogoError(true);
    } catch (error) {
      console.error('Error fetching company logo:', error);
      setCompanyLogo(null);
      setLogoError(true);
    } finally {
      setLogoLoading(false);
    }
  }, []);

  // Handle website input change (no auto-trigger)
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Just update the value - no auto-triggering
    setCompanyWebsite(rawValue);
  };

  // Handle manual analyze button click
  const handleAnalyzeCompany = () => {
    if (!companyWebsite.trim()) return;

    // Haptic feedback with sound
    triggerHaptic([15, 10, 15], '/Assets/selection3new.mp3');

    // Clear previous company data to refetch fresh
    setCompanyName('');
    setCompanyIntelligence(null);
    setSelectedIndustry(null);

    // Normalize the URL
    const normalized = normalizeWebsiteUrl(companyWebsite);
    setCompanyWebsite(normalized.display);

    // Trigger logo and enrichment
    if (normalized.domain) {
      fetchCompanyLogo(normalized.domain);
      enrichCompanyData(normalized.domain);
    }
  };

  // Enrich company data function
  const enrichCompanyData = useCallback(async (website: string) => {
    if (!website.trim() || loadingIntelligence) return;

    setLoadingIntelligence(true);
    try {
      const intelligence = await enrichCompanyService(website);
      setCompanyIntelligence(intelligence);

      // Auto-fill company name if not already set
      if (!companyName && intelligence.companyData.companyName) {
        setCompanyName(intelligence.companyData.companyName);
      }

      // Auto-select industry based on detection (only if not already set from URL)
      if (intelligence.companyData.normalizedIndustry && !selectedIndustry && !genericIndustryData) {
        // Map normalized industry to our industry card IDs (closest matches)
        const industryMapping: { [key: string]: string } = {
          'real-estate': 'real-estate',
          'construction': 'real-estate', // Construction → Real Estate (better match)
          'insurance': 'financial-services', // Insurance → Financial Services
          'manufacturing': 'manufacturing',
          'travel-tourism': 'travel-tourism',
          'education': 'professional-services', // Education → Professional Services (consulting)
          'retail': 'commerce-cloud',
          'healthcare': 'healthcare-life-sciences',
          'finance': 'financial-services',
          'technology': 'professional-services', // Technology → Professional Services (IT consulting)
          'other': 'professional-services' // Default → Professional Services
        };

        const industryId = industryMapping[intelligence.companyData.normalizedIndustry];
        if (industryId) {
          setSelectedIndustry(industryId);
        }
      }

      // Show product recommendation if available
      if (intelligence.recommendedProduct) {
        setShowProductRecommendation(true);
      }

      // Only show success message if not preloading (to avoid duplicate toasts)
      if (!isPreloading) {
        toast({
          title: "✨ All personalized now",
          description: `Ready for ${intelligence.companyData.companyName}`,
        });
      }
    } catch (error) {
      console.error('Failed to enrich company:', error);
      // Don't show error toast - graceful degradation
    } finally {
      setLoadingIntelligence(false);
    }
  }, [loadingIntelligence, companyName, selectedIndustry, genericIndustryData, isPreloading, toast]);

  // Initialize company intelligence service on mount
  useEffect(() => {
    initCompanyIntelligence();
  }, []);

  // Read company info from URL parameters on mount and preload data
  useEffect(() => {
    // Read URL parameters (shortened keys: cn=company name, cw=company website)
    const companyNameParam = searchParams.get('cn') || searchParams.get('companyName');
    const companyWebsiteParam = searchParams.get('cw') || searchParams.get('companyWebsite');
    const industryParam = searchParams.get('industry');

    // Check if we need to preload (have URL params)
    const needsPreload = companyNameParam || companyWebsiteParam || industryParam;

    if (!needsPreload) {
      return; // No URL params, no preloading needed
    }

    // Set preloading state
    setIsPreloading(true);

    // Process industry parameter with matching
    if (industryParam) {
      const matchedIndustry = matchIndustryFromUrl(industryParam);
      if (matchedIndustry) {
        // Found a match, use it
        setSelectedIndustry(matchedIndustry);
        setGenericIndustryData(null);
      } else {
        // No match found, create generic industry data
        const decodedIndustry = decodeURIComponent(industryParam);
        const genericData = createGenericIndustryData(decodedIndustry);
        setGenericIndustryData(genericData);
        setSelectedIndustry(null);
      }
    }

    // Process company name
    if (companyNameParam) {
      setCompanyName(decodeURIComponent(companyNameParam));
    }

    // Process company website and preload data
    const preloadData = async () => {
      try {
        if (companyWebsiteParam) {
          const decodedWebsite = decodeURIComponent(companyWebsiteParam);
          // Normalize the URL
          const normalized = normalizeWebsiteUrl(decodedWebsite);
          setCompanyWebsite(normalized.display);

          // Fetch logo - ensure we always try to fetch it
          // Use the normalized domain (which is clean and ready for logo APIs)
          const logoPromise = fetchCompanyLogo(normalized.domain || normalized.display || decodedWebsite).catch((error) => {
            console.error('Logo fetch failed:', error);
            // Don't block preloading if logo fails - set error state but continue
            setLogoError(true);
            setCompanyLogo(null);
          });

          // Enrich company data directly (avoid dependency on enrichCompanyData callback)
          if (normalized.domain && !loadingIntelligence) {
            setLoadingIntelligence(true);
            try {
              const intelligence = await enrichCompanyService(normalized.domain);
              setCompanyIntelligence(intelligence);

              // Auto-fill company name if not already set
              if (!companyNameParam && intelligence.companyData.companyName) {
                setCompanyName(intelligence.companyData.companyName);
              }

              // Auto-select industry based on detection (only if not already set from URL)
              if (intelligence.companyData.normalizedIndustry && !industryParam && !selectedIndustry && !genericIndustryData) {
                const industryMapping: { [key: string]: string } = {
                  'real-estate': 'real-estate',
                  'construction': 'real-estate',
                  'insurance': 'financial-services',
                  'manufacturing': 'manufacturing',
                  'travel-tourism': 'travel-tourism',
                  'education': 'professional-services',
                  'retail': 'commerce-cloud',
                  'healthcare': 'healthcare-life-sciences',
                  'finance': 'financial-services',
                  'technology': 'professional-services',
                  'other': 'professional-services'
                };

                const industryId = industryMapping[intelligence.companyData.normalizedIndustry];
                if (industryId) {
                  setSelectedIndustry(industryId);
                }
              }

              // Show product recommendation if available
              if (intelligence.recommendedProduct) {
                setShowProductRecommendation(true);
              }
            } catch (error) {
              console.error('Failed to enrich company:', error);
            } finally {
              setLoadingIntelligence(false);
            }
          }

          // Wait for logo to complete
          await logoPromise;
        }

        // Check if both company name and website are pre-filled from URL
        if (companyNameParam && companyWebsiteParam) {
          setHasPrefilledParams(true);
        }
      } catch (error) {
        console.error('Error during preload:', error);
        // Don't block rendering on error, just log it
      } finally {
        // Preloading complete
        setIsPreloading(false);
      }
    };

    preloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, fetchCompanyLogo]);

  // CSV download function
  const downloadComparisonCSV = () => {
    const metrics = selectedIndustryData?.comparisonMetrics || [
      {
        metric: 'Sales Cycle Time',
        salesforce: { score: 10, label: 'AI-Optimized', description: 'Einstein AI-powered sales acceleration and predictive lead scoring' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple automation with limited AI features' },
        zoho: { score: 6, label: 'Standard Process', description: 'Basic sales process management' },
        freshworks: { score: 5, label: 'Limited Features', description: 'Minimal sales automation capabilities' },
        odoo: { score: 4, label: 'Manual Setup', description: 'Requires extensive configuration for sales optimization' }
      },
      {
        metric: 'Implementation Time',
        salesforce: { score: 8, label: 'Rapid Deployment', description: 'Pre-built industry templates and AI-powered setup assistance' },
        hubspot: { score: 9, label: 'Quick Setup', description: 'Simple setup but limited customization' },
        zoho: { score: 7, label: 'Moderate Setup', description: 'Standard implementation process' },
        freshworks: { score: 8, label: 'Fast Setup', description: 'Quick setup with basic features' },
        odoo: { score: 4, label: 'Complex Setup', description: 'Requires significant technical expertise' }
      },
      {
        metric: 'Customizability',
        salesforce: { score: 10, label: 'Unlimited', description: 'Complete platform customization with Einstein AI and AppExchange' },
        hubspot: { score: 5, label: 'Limited', description: 'Basic customization options only' },
        zoho: { score: 6, label: 'Moderate', description: 'Some customization within framework' },
        freshworks: { score: 4, label: 'Very Limited', description: 'Minimal customization capabilities' },
        odoo: { score: 5, label: 'Manual Development', description: 'Requires extensive coding for customization' }
      },
      {
        metric: 'Ease of Use',
        salesforce: { score: 9, label: 'AI-Enhanced', description: 'Einstein AI guidance and intelligent automation reduce complexity' },
        hubspot: { score: 8, label: 'User-Friendly', description: 'Intuitive interface with good UX' },
        zoho: { score: 7, label: 'Moderate Learning', description: 'Some learning curve required' },
        freshworks: { score: 8, label: 'Simple Interface', description: 'Easy to use but limited functionality' },
        odoo: { score: 4, label: 'Technical Required', description: 'Requires technical knowledge for optimal use' }
      },
      {
        metric: 'Integration & Ecosystem',
        salesforce: { score: 10, label: '5,000+ Apps', description: 'Largest ecosystem with native AI integrations and MuleSoft connectivity' },
        hubspot: { score: 6, label: '1,000+ Apps', description: 'Good integration marketplace but limited AI features' },
        zoho: { score: 5, label: 'Zoho Suite', description: 'Good within Zoho ecosystem, limited external integrations' },
        freshworks: { score: 4, label: 'Growing', description: 'Limited integration options, basic connectivity' },
        odoo: { score: 4, label: 'Manual Integration', description: 'Requires custom development for most integrations' }
      },
      {
        metric: 'Scalability',
        salesforce: { score: 10, label: 'Unlimited Scale', description: 'Enterprise-grade scalability with AI-powered performance optimization' },
        hubspot: { score: 6, label: 'Mid-Market', description: 'Good for mid-market, limited enterprise features' },
        zoho: { score: 6, label: 'Mid-Market', description: 'Suitable for mid-market companies' },
        freshworks: { score: 5, label: 'SMB-Mid', description: 'Limited scalability for large enterprises' },
        odoo: { score: 5, label: 'Custom Scale', description: 'Scalable but requires significant technical expertise' }
      },
      {
        metric: 'Cost Effectiveness',
        salesforce: { score: 9, label: 'High Value', description: 'Premium pricing but 341% ROI (Forrester) and AI-powered efficiency gains' },
        hubspot: { score: 7, label: 'Moderate Value', description: 'Good value for basic needs' },
        zoho: { score: 8, label: 'Affordable', description: 'Good value for mid-market' },
        freshworks: { score: 7, label: 'Budget Option', description: 'Low cost but limited features' },
        odoo: { score: 5, label: 'Hidden Costs', description: 'Low base cost but high implementation and maintenance costs' }
      },
      {
        metric: 'ROI Potential',
        salesforce: { score: 10, label: '341% ROI', description: 'Industry-leading ROI with AI-powered automation (Forrester TEI Study)' },
        hubspot: { score: 6, label: '120% ROI', description: 'Moderate ROI with basic automation' },
        zoho: { score: 5, label: '100% ROI', description: 'Basic ROI with limited advanced features' },
        freshworks: { score: 4, label: '80% ROI', description: 'Limited ROI due to basic functionality' },
        odoo: { score: 4, label: '110% ROI', description: 'Moderate ROI but requires significant investment in customization' }
      }
    ];

    const industryName = selectedIndustryData?.name || 'General CRM';
    const date = new Date().toLocaleDateString();

    // CSV header
    const headers = [
      'Metric',
      'Salesforce Score',
      'Salesforce Label',
      'Salesforce Description',
      'HubSpot Score',
      'HubSpot Label',
      'HubSpot Description',
      'Zoho Score',
      'Zoho Label',
      'Zoho Description',
      'Freshworks Score',
      'Freshworks Label',
      'Freshworks Description',
      'Odoo Score',
      'Odoo Label',
      'Odoo Description'
    ];

    // CSV rows
    const rows = metrics.map(metric => [
      metric.metric,
      metric.salesforce.score,
      metric.salesforce.label,
      metric.salesforce.description || '',
      metric.hubspot.score,
      metric.hubspot.label,
      metric.hubspot.description || '',
      metric.zoho.score,
      metric.zoho.label,
      metric.zoho.description || '',
      metric.freshworks.score,
      metric.freshworks.label,
      metric.freshworks.description || '',
      metric.odoo.score,
      metric.odoo.label,
      metric.odoo.description || ''
    ]);

    // Escape CSV values
    const escapeCsvValue = (value: any) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    // Create CSV content
    const csvContent = [
      `# ${industryName} CRM Comparison Study`,
      `# Generated on ${date}`,
      `# Objective comparative analysis for board members`,
      '',
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${industryName.replace(/\s+/g, '_')}_CRM_Comparison_${date.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Downloaded!",
      description: `${industryName} comparison data exported successfully`,
    });
  };

  // Toggle metric expansion
  const toggleMetricExpansion = (metricKey: string) => {
    setExpandedMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metricKey)) {
        newSet.delete(metricKey);
      } else {
        newSet.add(metricKey);
      }
      return newSet;
    });
  };

  // Function to personalize text with company name
  const personalizeText = useCallback((text: string, fallback: string = 'your company', industryName?: string) => {
    if (!companyName) return text;
    return text.replace(/\{company\}/g, companyName).replace(/\{industry\}/g, industryName || fallback);
  }, [companyName]);

  const heroRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const erpRef = useRef<HTMLDivElement>(null);
  const dataCloudRef = useRef<HTMLDivElement>(null);
  const industryRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const forresterRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Haptic feedback function
  const triggerHaptic = (pattern: number[] = [10, 5, 10], soundFile: string = '/Assets/selection1new.mp3') => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }

    // Play sound
    const sound = new Audio(soundFile);
    sound.volume = 0.3;
    sound.play().catch(() => { }); // Ignore errors if sound fails
  };

  // Handle industry selection
  const handleIndustrySelect = (industryId: string) => {
    try {
      triggerHaptic([20, 10, 20], '/Assets/selection2new.mp3');
      setSelectedIndustry(industryId);
      setCurrentSection(1);

      // Add smooth slide animation
      setIsScrolling(true);

      // Smooth scroll to platform overview with slide effect
      setTimeout(() => {
        if (platformRef.current) {
          platformRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        // Reset scrolling state after animation completes
        setTimeout(() => setIsScrolling(false), 1000);
      }, 300);
    } catch (error) {
      console.error('Error in handleIndustrySelect:', error);
    }
  };

  // Handle section navigation
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>, sectionIndex: number) => {
    setIsScrolling(true);
    triggerHaptic([15, 5, 15]);
    setCurrentSection(sectionIndex);

    sectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    setTimeout(() => setIsScrolling(false), 1000);
  };

  // Handle hash navigation to comparison table
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleHashChange = () => {
      if (window.location.hash === '#comparison-table') {
        // Check if company info exists in state or URL params (support both short and long params)
        const hasCompanyInParams = searchParams.get('cn') || searchParams.get('companyName') ||
          searchParams.get('cw') || searchParams.get('companyWebsite');

        // Check if this is a direct access (no company name set and no params)
        if (!companyName && !hasCompanyInParams) {
          setIsDirectAccess(true);
          setShowLeadModal(true);
        } else {
          // If company name is already set or provided via params, just scroll to the table
          const tableElement = document.getElementById('comparison-table');
          if (tableElement) {
            tableElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [companyName, searchParams]);

  // Handle hub dimensions resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setHubDimensions({
        width: isMobile ? Math.min(window.innerWidth - 48, 350) : 800,
        height: isMobile ? 350 : 600
      });
    };

    // Set initial dimensions
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get industry-specific products
  const industryProducts = selectedIndustry ? getProductsByIndustry(selectedIndustry) : [];
  const selectedIndustryData = selectedIndustry
    ? getIndustryById(selectedIndustry)
    : genericIndustryData || null;

  // Fetch all verticals once on mount/auth
  useEffect(() => {
    const loadVerticals = async () => {
      if (!authData?.access_token || !authData?.instance_url || allVerticals.length > 0) return;

      try {
        const data = await fetchAllVerticals(authData.access_token, authData.instance_url);
        setAllVerticals(data);
      } catch (err) {
        console.error("Error pre-loading verticals", err);
      }
    };
    loadVerticals();
  }, [authData, allVerticals.length]);

  // Initialize selected modules from session storage when modules change
  useEffect(() => {
    if (modules.length > 0) {
      if (selectedIndustryData) {
        const verticalId = modules[0]?.verticalId;
        if (verticalId) {
          const stored = sessionStorage.getItem(`vertical-modules-selection-${verticalId}`);
          if (stored) {
            try {
              setSelectedModuleIds(new Set(JSON.parse(stored)));
            } catch (e) {
              console.error("Failed to parse stored selection", e);
              // Fallback to all modules
              setSelectedModuleIds(new Set(modules.map(m => m.id)));
            }
          } else {
            // Default to ALL modules selected if nothing stored
            setSelectedModuleIds(new Set(modules.map(m => m.id)));
          }
        }
      }
    }
  }, [modules, selectedIndustryData]);

  // Separate state for modules vertical (decoupled from page vertical)
  const [modulesVerticalId, setModulesVerticalId] = useState<string | null>(null);
  const [modulesVerticalData, setModulesVerticalData] = useState<Vertical | null>(null);

  // Helper to find Salesforce Vertical ID from Industry Slug
  const getSalesforceVerticalId = useCallback((slug: string) => {
    if (!slug || allVerticals.length === 0) return null;

    // 1. Get Industry Data to find the Name
    const industryData = industries.find(i => i.id === slug);
    if (!industryData) return null;

    // 2. Find matching Vertical in allVerticals by Name or Type
    const matchedVertical = allVerticals.find(v =>
      (v.name && v.name.toLowerCase() === industryData.name.toLowerCase()) ||
      (v.type && v.type.toLowerCase() === industryData.name.toLowerCase()) ||
      // Also try matching against the slug itself if the name logic fails
      (v.name && v.name.toLowerCase().replace(/\s+/g, '-') === slug)
    );

    return matchedVertical ? matchedVertical.id : null;
  }, [allVerticals]);

  // Initialize modulesVerticalId from URL or default
  useEffect(() => {
    if (showModulesSection && !modulesVerticalId) {
      if (selectedIndustry) {
        // Map selectedIndustry (slug) to Salesforce ID
        const sfId = getSalesforceVerticalId(selectedIndustry);
        if (sfId) {
          setModulesVerticalId(sfId);
        } else if (allVerticals.length > 0) {
          // Fallback if mapping fails but we have verticals
          setModulesVerticalId(allVerticals[0].id);
        }
      } else {
        if (allVerticals.length > 0) {
          setModulesVerticalId(allVerticals[0].id);
        }
      }
    }
  }, [showModulesSection, selectedIndustry, modulesVerticalId, allVerticals, getSalesforceVerticalId]);


  // Fetch Modules Data independently
  // Fetch Modules Data independently
  useEffect(() => {
    const fetchModules = async () => {
      // If we are not showing modules, or don't have auth, return
      if (!showModulesSection || !authData?.access_token || !authData?.instance_url) {
        return;
      }

      // If we don't have verticals list yet, fetch it
      if (allVerticals.length === 0) {
        if (!modulesLoading) {
          try {
            const data = await fetchAllVerticals(authData.access_token, authData.instance_url);
            setAllVerticals(data);
            // The next effect run will pick this up
          } catch (e) {
            console.error(e);
          }
        }
        return;
      }

      // If we don't have a specific modules vertical selected yet, we can't fetch modules
      if (!modulesVerticalId) {
        // If we have verticals but no ID, try to set it one last time (race condition guard)
        if (selectedIndustry) {
          const sfId = getSalesforceVerticalId(selectedIndustry);
          if (sfId) {
            setModulesVerticalId(sfId);
            return; // Next render will fetch
          }
        }
        if (allVerticals.length > 0) {
          setModulesVerticalId(allVerticals[0].id);
          return; // Next render will fetch
        }

        setModules([]); // Clear modules if no vertical selected
        setModulesVerticalData(null);
        return;
      }

      try {
        setModulesLoading(true);
        const data = await fetchVerticalById(
          authData.access_token,
          authData.instance_url,
          modulesVerticalId
        );

        if (data) {
          setModulesVerticalData(data);
          const verticalModules = data.modules || [];

          setModules(verticalModules);

          // Pre-select priority modules (1-3)
          const initialSelected = new Set<string>();
          verticalModules.forEach((m: any) => {
            if (m.priority !== null && m.priority <= 3) {
              initialSelected.add(m.id);
            }
          });
          setSelectedModuleIds(initialSelected);

        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast({
          title: "Error",
          description: "Failed to load modules. Please try again.",
          variant: "destructive"
        });
      } finally {
        setModulesLoading(false);
      }
    };

    fetchModules();
  }, [showModulesSection, modulesVerticalId, authData, allVerticals, getSalesforceVerticalId, selectedIndustry]); // Depend on modulesVerticalId instead of selectedIndustryData

  // Check if current industry is retail/commerce related
  const isRetailOrCommerce = useMemo(() => {
    const industryParam = searchParams.get('industry');
    const industryName = selectedIndustryData?.name?.toLowerCase() || '';
    const industryId = selectedIndustry || '';
    const paramLower = (industryParam || '').toLowerCase();

    return (
      industryId === 'commerce-cloud' ||
      industryName.includes('retail') ||
      industryName.includes('commerce') ||
      paramLower.includes('retail') ||
      paramLower.includes('commerce') ||
      paramLower.includes('e-commerce') ||
      paramLower.includes('ecommerce')
    );
  }, [selectedIndustry, selectedIndustryData, searchParams]);

  // Prepare industries for grid display
  // If the selected industry is not in the first 8, replace Telecom with it
  const displayIndustries = useMemo(() => {
    const firstEight = industries.slice(0, 8);

    // Determine which industry to show (selectedIndustry or genericIndustryData)
    const industryToShow = selectedIndustry
      ? getIndustryById(selectedIndustry)
      : genericIndustryData;

    // Check if the industry to show is in the first 8
    const isInFirstEight = industryToShow
      ? firstEight.some(ind => ind.id === industryToShow.id)
      : false;

    // If we have an industry to show and it's not in the first 8, replace Telecom
    if (industryToShow && !isInFirstEight) {
      // Find Telecom index (should be index 3, but let's find it dynamically)
      const telecomIndex = firstEight.findIndex(ind => ind.id === 'telecommunications');
      if (telecomIndex !== -1) {
        const updated = [...firstEight];
        // Replace Telecom with the industry to show
        updated[telecomIndex] = industryToShow;
        return updated;
      }
    }

    return firstEight;
  }, [industries, selectedIndustry, genericIndustryData]);

  // Core products for platform overview - use first 6 products for better visualization
  const coreProducts = salesforceProducts.slice(0, 6);


  // Loading screen when preloading data from URL params
  if (isPreloading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Your Personalized Experience</h2>
          <p className="text-gray-400">Fetching company data and AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="salesforce-power-page" className="min-h-screen bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Product Recommendation Banner */}
      {companyIntelligence?.recommendedProduct && (
        <ProductRecommendationBanner
          productName={companyIntelligence.recommendedProduct.productName}
          productPath={companyIntelligence.recommendedProduct.productPath}
          message={companyIntelligence.recommendedProduct.message}
          icon={companyIntelligence.recommendedProduct.icon}
          onDismiss={() => setShowProductRecommendation(false)}
          isVisible={showProductRecommendation}
        />
      )}

      {/* Client Info Modal */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        client={selectedClient}
      />

      <Helmet>
        <title>
          {selectedIndustryData
            ? `${selectedIndustryData.name} CRM Comparison: Salesforce vs Competitors | Cloudastick`
            : 'Salesforce vs Competitors: Complete CRM Comparison | Cloudastick'
          }
        </title>
        <meta
          name="description"
          content={
            selectedIndustryData
              ? `Objective ${selectedIndustryData.name} CRM comparison study. Compare Salesforce, HubSpot, Zoho, Freshworks, and Odoo for ${selectedIndustryData.name.toLowerCase()} businesses. Download detailed analysis for board members.`
              : 'Comprehensive CRM comparison: Salesforce vs HubSpot, Zoho, Freshworks, Odoo. Objective analysis for CTOs, CFOs, and board members. Download detailed comparison study.'
          }
        />
        <meta
          name="keywords"
          content={
            selectedIndustryData
              ? `${selectedIndustryData.name} CRM comparison, ${selectedIndustryData.name} Salesforce vs competitors, ${selectedIndustryData.name} CRM analysis, board member CRM study, ${selectedIndustryData.name} CRM evaluation, objective CRM comparison`
              : 'Salesforce comparison, CRM comparison, Salesforce vs HubSpot, Salesforce vs Zoho, CRM analysis, board member study, CTO evaluation, CFO analysis, objective CRM study'
          }
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={
          selectedIndustryData
            ? `${selectedIndustryData.name} CRM Comparison: Salesforce vs Competitors`
            : 'Salesforce vs Competitors: Complete CRM Comparison'
        } />
        <meta property="og:description" content={
          selectedIndustryData
            ? `Download our comprehensive ${selectedIndustryData.name} CRM comparison study. Compare Salesforce, HubSpot, Zoho, Freshworks, and Odoo with objective metrics for board members.`
            : 'Download our comprehensive CRM comparison study. Compare Salesforce, HubSpot, Zoho, Freshworks, and Odoo with objective metrics for board members.'
        } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/salesforce-power${selectedIndustry ? `?industry=${selectedIndustry}` : ''}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={
          selectedIndustryData
            ? `${selectedIndustryData.name} CRM Comparison: Salesforce vs Competitors`
            : 'Salesforce vs Competitors: Complete CRM Comparison'
        } />
        <meta name="twitter:description" content={
          selectedIndustryData
            ? `Objective ${selectedIndustryData.name} CRM comparison for board members. Download detailed analysis.`
            : 'Objective CRM comparison for board members. Download detailed analysis.'
        } />
        <link rel="canonical" href={`${window.location.origin}/salesforce-power${selectedIndustry ? `?industry=${selectedIndustry}` : ''}`} />
      </Helmet>
      {/* Hero Section */}
      <section id="hero-section" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(window.innerWidth < 768 ? 10 : 20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 mr-2" />
                {t('power.hero.badge')}
              </span>

              {/* Logos */}
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  {/* Company Logo */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CompanyLogo
                      logoUrl={companyLogo}
                      companyName={companyName || 'Company'}
                      website={companyWebsite}
                      size="large"
                      className="w-24 h-24"
                    />
                  </motion.div>

                  {/* Plus sign */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl text-cyan-400 font-bold"
                  >
                    +
                  </motion.div>

                  {/* Salesforce Logo */}
                  <img
                    src="/Assets/Product Logos/salesforce.png"
                    alt="Salesforce"
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                {companyName
                  ? personalizeText(t('power.hero.title.personalized'), 'your company', selectedIndustryData?.name)
                  : personalizeText(t('power.hero.title'))
                }
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                {companyName
                  ? personalizeText(t('power.hero.subtitle.personalized'), 'your company', selectedIndustryData?.name)
                  : personalizeText(t('power.hero.subtitle'))
                }
              </p>

              {/* Try Demo Button - Only show for Real Estate */}
              {selectedIndustry === 'real-estate' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8 flex justify-center"
                >
                  <button
                    onClick={handleOpenDemo}
                    className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-5 h-5" />
                    <span>Try Demo</span>
                  </button>
                </motion.div>
              )}

              {/* Company Inputs - Only show if not pre-filled from URL */}
              {!hasPrefilledParams && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-8"
                >
                  <div className={`grid grid-cols-1 ${companyName ? 'sm:grid-cols-2' : ''} gap-4 max-w-4xl mx-auto`}>
                    {/* Company Website Input with Analyze Button */}
                    <div className="flex-1">
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Company Website (e.g., example.com)"
                            value={companyWebsite}
                            onChange={handleWebsiteChange}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && companyWebsite.trim() && !loadingIntelligence) {
                                handleAnalyzeCompany();
                              }
                            }}
                            className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          />
                        </div>

                        {/* Analyze Button */}
                        <button
                          onClick={handleAnalyzeCompany}
                          disabled={!companyWebsite.trim() || loadingIntelligence}
                          className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                            ${companyWebsite.trim() && !loadingIntelligence
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }
                          `}
                        >
                          {loadingIntelligence ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Analyzing...</span>
                            </>
                          ) : (
                            <>
                              <span>Analyze</span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Company Name Input - Only shown after name is loaded */}
                    {companyName && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                      >
                        <input
                          type="text"
                          placeholder={t('power.hero.companyPlaceholder')}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm border border-cyan-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-center sm:text-left"
                        />
                        <p className="text-xs text-cyan-400 mt-2 text-center sm:text-left">
                          ✏️ Edit if name is incorrect
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Personalization Status */}
                  {(companyName || companyWebsite || loadingIntelligence) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center justify-center text-sm"
                    >
                      {loadingIntelligence ? (
                        <span className="text-blue-400 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          Personalizing...
                        </span>
                      ) : companyName ? (
                        <span className="text-cyan-400 flex items-center gap-2">
                          ✨ All personalized now
                        </span>
                      ) : null}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Company Intelligence Display */}
              {companyIntelligence && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 space-y-6"
                >
                  {/* Company Info Card */}
                  <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{companyIntelligence.recommendedProduct?.icon || '🏢'}</span>
                        <div>
                          <h4 className="text-xl font-bold text-white">{companyIntelligence.companyData.companyName}</h4>
                          <p className="text-cyan-300 text-sm">{companyIntelligence.companyData.industry}</p>
                        </div>
                      </div>
                      {companyIntelligence.companyData.location && (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          📍 {companyIntelligence.companyData.location}
                        </span>
                      )}
                      {companyIntelligence.companyData.employeeCount && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          👥 {companyIntelligence.companyData.employeeCount} employees
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Insights & Products - Stacked Layout */}
                  <div className="space-y-6">
                    {/* AI Insights Panel - Full Width (only show if valid) */}
                    {companyIntelligence.aiInsights && companyIntelligence.aiInsights.trim().length > 0 && (
                      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          How Salesforce Can Help
                        </h4>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                          {companyIntelligence.aiInsights}
                        </div>
                      </div>
                    )}

                    {/* Company Products Carousel - Full Width */}
                    {companyIntelligence.companyProducts && companyIntelligence.companyProducts.length > 0 && (
                      <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm">
                        <h4 className="text-base font-bold text-white mb-4">
                          Manage, market, and sell {companyIntelligence.companyData.companyName}'s products better
                        </h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {companyIntelligence.companyProducts.map((product, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex-shrink-0"
                            >
                              <div className="px-5 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-200">
                                <span className="text-green-300 text-sm font-medium whitespace-nowrap">{product}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Latest News - Full Width */}
                    {companyIntelligence.news.length > 0 && (
                      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-sm">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          📰 Latest News
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {companyIntelligence.news.slice(0, 3).map((article, index) => (
                            <a
                              key={index}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                            >
                              <p className="text-cyan-300 font-semibold text-sm mb-2 group-hover:text-cyan-200 line-clamp-2">
                                {article.title}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Industry Selection Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-24"
            >
              {displayIndustries.map((industry, index) => {
                // Check if this industry is selected
                // For matched industry: check if selectedIndustry matches
                // For generic industry: check if we have genericIndustryData and no selectedIndustry
                const isSelected = selectedIndustry
                  ? selectedIndustry === industry.id
                  : (genericIndustryData && industry.id === 'generic');

                // Check if another industry is selected (for dimming effect)
                const isNotSelected = selectedIndustry
                  ? selectedIndustry !== industry.id
                  : (genericIndustryData && industry.id !== 'generic');

                return (
                  <motion.div
                    key={industry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isNotSelected ? 0.5 : 1,
                      y: 0,
                      scale: isSelected ? 1.02 : 1
                    }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // If it's the generic industry, don't change selection (it's already selected)
                      if (industry.id === 'generic') {
                        return;
                      }
                      handleIndustrySelect(industry.id);
                    }}
                    className={`relative bg-gradient-to-br ${industry.gradient} rounded-2xl p-4 sm:p-6 md:p-8 cursor-pointer group transition-all duration-300 hover:shadow-2xl backdrop-blur-sm
                      ${isSelected
                        ? 'border-2 border-yellow-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] ring-2 ring-yellow-400/50'
                        : 'border border-white/20 hover:border-white/40'
                      }
                      ${isNotSelected ? 'hover:opacity-70' : ''}
                    `}
                  >
                    {/* Gold glow animation for selected */}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-400/20 rounded-2xl"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}

                    <div className={`absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'bg-yellow-400/10' : ''}`}></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-xl mb-6 group-hover:bg-white/30 transition-colors duration-300">
                        <industry.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isSelected ? 'text-yellow-300' : 'text-white group-hover:text-cyan-200'}`}>
                        {industry.shortName}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed mb-4">
                        {industry.description.split('.')[0]}.
                      </p>
                      <div className="flex items-center text-white/70 text-xs font-medium">
                        <span>{t('power.hero.explore')}</span>
                        <ArrowRight className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'} group-hover:translate-x-1 transition-transform duration-300`} />
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center text-cyan-400"
              >
                <span className="text-sm mb-2">Scroll to explore</span>
                <ArrowDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </AnimatedSection>

        </div>
      </section>

      {/* Trusted By - Auto-Moving Logo Carousel */}
      {(() => {
        const allClients = getAllClients();
        const relevantClients = selectedIndustry ? getClientsByIndustry(selectedIndustry) : [];
        const relevantClientIds = new Set(relevantClients.map(c => c.id));

        // Helper function to check if client matches selected industry
        const isIndustryMatch = (client: ClientInfo) => {
          return selectedIndustry && relevantClientIds.has(client.id);
        };

        // Arrange clients: relevant industry clients first, then others
        const arrangeClients = () => {
          if (!selectedIndustry || relevantClients.length === 0) {
            // No industry selected or no relevant clients - show all clients normally
            return [...allClients, ...allClients];
          }

          // Separate relevant and other clients
          const otherClients = allClients.filter(c => !relevantClientIds.has(c.id));

          // Create carousel with relevant clients appearing 3x more frequently
          // Pattern: [relevant x3, other, relevant x3, other, ...]
          const carouselClients: ClientInfo[] = [];

          // Add relevant clients 3 times
          carouselClients.push(...relevantClients);
          carouselClients.push(...relevantClients);
          carouselClients.push(...relevantClients);

          // Interleave with other clients
          otherClients.forEach((client) => {
            carouselClients.push(client);
          });

          // Duplicate the entire pattern for seamless loop
          return [...carouselClients, ...carouselClients];
        };

        const clientsToShow = arrangeClients();

        return allClients.length > 0 ? (
          <section id="hub-and-spoke" className="py-24 relative overflow-hidden bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {selectedIndustry
                    ? `Trusted by Leading ${selectedIndustryData?.name} Companies`
                    : 'Trusted by Industry Leaders'}
                </h3>
                <p className="text-gray-400 text-sm">
                  Join industry leaders who have transformed their operations with Cloudastick
                </p>
              </motion.div>

              {/* Auto-Moving Logo Carousel */}
              <div className="relative overflow-hidden">
                <motion.div
                  className="flex gap-12 items-center"
                  animate={{
                    x: [0, -1000],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Display clients with relevant ones appearing more frequently */}
                  {clientsToShow.map((client, index) => {
                    const isHighlighted = isIndustryMatch(client);
                    return (
                      <div
                        key={`${client.id}-${index}`}
                        className="flex-shrink-0 group cursor-pointer"
                        onClick={() => handleClientClick(client)}
                      >
                        <div className={`bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 w-56 h-32 flex items-center justify-center ${isHighlighted
                          ? 'border-yellow-400 shadow-lg shadow-yellow-500/30 hover:border-yellow-300 hover:shadow-yellow-400/40'
                          : 'border-gray-600 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30'
                          }`}>
                          <img
                            src={getClientLogoPath(client.name, client.industry)}
                            alt={client.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300 filter brightness-0 invert"
                            onError={(e) => {
                              // Fallback to text if image fails
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="text-center"><h4 class="font-bold text-white text-base">${client.name}</h4><p class="text-xs text-gray-400 mt-1">${client.industry}</p></div>`;
                              }
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-10"></div>
            </div>
          </section>
        ) : null;
      })()}

      {/* Why Work with Cloudastick Systems Section */}
      <section className="py-16 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Why Work with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Cloudastick Systems</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-400 text-lg max-w-3xl mx-auto"
            >
              Your trusted partner for Salesforce excellence with proven expertise and dedicated support
            </motion.p>
          </AnimatedSection>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Award,
                title: '20+ Years Experience',
                description: 'Two decades of proven expertise in Salesforce implementations and digital transformation',
                gradient: 'from-yellow-500 to-orange-600'
              },
              {
                icon: Users,
                title: 'Diverse Expert Resources',
                description: 'Certified Architects, Consultants, and Project Managers ready to deliver excellence',
                gradient: 'from-cyan-500 to-blue-600'
              },
              {
                icon: GraduationCap,
                title: 'Cloudastick Academy',
                description: 'Rapid ramp-up capabilities with our dedicated training and development program',
                gradient: 'from-purple-500 to-pink-600'
              },
              {
                icon: Headset,
                title: '24/7 Global Support',
                description: 'Round-the-clock support with proven track record across multiple regions',
                gradient: 'from-green-500 to-emerald-600'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Meet Our Expert Team</h3>
            <p className="text-gray-400 text-sm">
              Certified professionals dedicated to your success
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-8 items-center"
              animate={{
                x: [0, -1500],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Team members with duplicates for seamless loop */}
              {(() => {
                const teamMembers = [
                  { name: 'Mina Michel', role: 'Founder of Cloudastick Systems', image: 'Mina_Michel_Founder_of_Cloudastick_Systems.png', isAcademy: false },
                  { name: 'Ashraf Rezk', role: 'Head of Tech', image: 'Ashraf_Rezk_Head_of_Tech.png', isAcademy: false },
                  { name: 'Andrea Makary', role: 'Technical Architect', image: 'Andrea_Makary_Technical_Architect.png', isAcademy: false },
                  { name: 'Mariam Mamdouh', role: 'Project Manager', image: 'Mariam_Mamdouh_Project_Manager.png', isAcademy: false },
                  { name: 'Omar El Borae', role: 'Customer Success Manager', image: 'Omar_El_Borae_Customer_Success_Manager.png?v=2', isAcademy: false },
                  { name: 'Ahmed Salah', role: 'Salesforce Consultant', image: 'Ahmed_Salah_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'Farida Esam', role: 'Marketing Cloud Consultant', image: 'Farida_Esam_Marketing_Cloud_Consultant.png', isAcademy: false },
                  { name: 'Mireille Rafik', role: 'Marketing Cloud Consultant', image: 'Mireille_Rafik_Marketing_Cloud_Consultant.png', isAcademy: false },
                  { name: 'Andrew Osama', role: 'Salesforce Consultant', image: 'Andrew_Osama_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'Maheen Imran', role: 'Salesforce Consultant', image: 'Maheen_Imran_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'Carine Felix', role: 'Brand and People Experience Specialist', image: 'Carine_Felix_Brand_and_People_Experience_Specialist.png', isAcademy: false },
                  { name: 'Marina Danial', role: 'CFO Cloudastick and COO of TechSa', image: 'Marina_Danial_CFO_Cloudastick_and_COO_of_Techsa.png', isAcademy: false },
                  { name: 'Jenny Maged', role: 'Salesforce Consultant', image: 'Jenny_Maged_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'John Shedoudy', role: 'Salesforce Consultant', image: 'John_Shedoudy_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'Mariam Mahmoud', role: 'Salesforce Consultant', image: 'Mariam_Mahmoud_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'Omar Bazid', role: 'Salesforce Consultant', image: 'Omar_Bazid_Salesforce_Consultant.png', isAcademy: true },
                  { name: 'Sakshi Dokarimare', role: 'Salesforce Consultant', image: 'Sakshi_Dokarimare_Salesforce_Consultant.png', isAcademy: false },
                  { name: 'Alyaa Hafez', role: 'Salesforce Consultant', image: 'Alyaa_Hafez_Salesforce_Consultant.png', isAcademy: true },
                  { name: 'Khaled El-Nabawy', role: 'Salesforce Consultant', image: 'Khaled_El-Nabawy_Salesforce_Consultant.png', isAcademy: true },
                  { name: 'Muhammed Hesham', role: 'Senior UX/UI Designer', image: 'Muhammed_Hesham_Senior_UX_UI_Designer.png', isAcademy: false }
                ];

                return [...teamMembers, ...teamMembers].map((member, index) => (
                  <div
                    key={`${member.name}-${index}`}
                    className="flex-shrink-0 group"
                  >
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-cyan-400 transition-all duration-300 shadow-lg group-hover:shadow-cyan-500/50 relative">
                        <img
                          src={`/Assets/Company Members/${member.image}`}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        {/* Academy icon */}
                        {member.isAcademy && (
                          <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <GraduationCap className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-900 border border-cyan-400 rounded-lg px-3 py-2 whitespace-nowrap z-10 shadow-xl">
                        <p className="text-white font-semibold text-sm">{member.name}</p>
                        <p className="text-cyan-400 text-xs">{member.role}</p>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </motion.div>
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section id="platform-overview" ref={platformRef} className="py-10 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {companyName
                  ? personalizeText(t('power.platform.title.personalized'), 'your company', selectedIndustryData?.name)
                  : personalizeText(selectedIndustryData
                    ? t('power.platform.title.industry', { industry: selectedIndustryData.name })
                    : t('power.platform.title'), 'your company', selectedIndustryData?.name
                  )
                }
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {companyName
                  ? personalizeText(t('power.platform.subtitle.personalized'), 'your company', selectedIndustryData?.name)
                  : personalizeText(selectedIndustryData
                    ? t('power.platform.subtitle.industry', { industry: selectedIndustryData.name })
                    : t('power.platform.subtitle'), 'your company', selectedIndustryData?.name
                  )
                }
              </p>

              {/* AI Insight for CRM Section */}
              {companyIntelligence?.structuredInsights?.crm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/20"
                >
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                    {companyIntelligence.structuredInsights.crm}
                  </p>
                </motion.div>
              )}

              {selectedIndustryData && (
                <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30 max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                    {companyName
                      ? personalizeText(t('power.platform.challenges.personalized', { company: companyName, industry: selectedIndustryData.name }), 'your company', selectedIndustryData.name)
                      : personalizeText(t('power.platform.challenges', { industry: selectedIndustryData.name }), 'your company', selectedIndustryData.name)
                    }
                  </h3>
                  <div className="grid grid-cols-1 gap-4 text-left">
                    {selectedIndustryData.painPoints?.slice(0, 4).map((painPoint, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{painPoint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatedSection>

          {/* Optimized Hub and Spoke Visualization */}
          <div className="relative flex justify-center items-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] px-4 sm:px-8">
            <div className="relative w-full max-w-4xl">
              <HubAndSpokeVisualization
                products={coreProducts}
                onProductHover={handleProductHover}
                hoveredProduct={hoveredProduct}
              />
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16"
          >
            {[
              { label: 'Companies Using Salesforce', value: '150,000+', icon: Users },
              { label: 'AppExchange Apps', value: '5,000+', icon: Settings },
              { label: 'Market Share', value: '#1 CRM', icon: TrendingUp },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 sm:p-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3D Property Visualization Section - Only for Real Estate */}
      {selectedIndustry === 'real-estate' && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900/30 to-cyan-900/20"></div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/30">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Real Estate Innovation
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Salesforce 3D Model Viewer
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Empower your customers to visualize their future units in stunning 3D.
                  Integrated directly into Salesforce, this immersive experience helps buyers
                  explore properties, customize finishes, and make confident purchasing decisions.
                </p>
              </motion.div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Interactive 3D Model */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-2 lg:order-1"
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm ml-2">Interactive 3D Viewer</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-black/50">
                    <iframe
                      src="https://3dwarehouse.sketchup.com/embed/796431a0-c0d1-4046-afad-24937e815134?token=t0dGLB7xv8E=&binaryName=s21"
                      frameBorder="0"
                      scrolling="no"
                      width="100%"
                      height="400"
                      allowFullScreen
                      title="3D Property Model - Interactive Viewer"
                      className="w-full"
                      style={{ minHeight: '400px' }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">↻</span>
                      Rotate
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">⊕</span>
                      Zoom
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">⇔</span>
                      Pan
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="order-1 lg:order-2"
              >
                <div className="space-y-6">
                  {[
                    {
                      icon: Building2,
                      title: 'Virtual Property Tours',
                      description: 'Let customers explore every corner of their future home from anywhere in the world, 24/7.'
                    },
                    {
                      icon: Paintbrush,
                      title: 'Real-Time Customization',
                      description: 'Visualize different finishes, layouts, and configurations to match customer preferences instantly.'
                    },
                    {
                      icon: BarChart3,
                      title: 'Salesforce Integration',
                      description: 'Track engagement metrics, unit preferences, and automatically sync customer interactions to CRM records.'
                    },
                    {
                      icon: Zap,
                      title: 'Accelerate Sales Cycles',
                      description: 'Reduce decision time by 40% with immersive visualization that builds buyer confidence.'
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 p-4 bg-gradient-to-r from-gray-800/50 to-transparent rounded-xl border border-gray-700/50 hover:border-emerald-500/30 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Amadeus Integration Section - Only for Travel/Tourism */}
      {(selectedIndustry === 'travel-tourism' || selectedIndustry === 'hospitality') && (
        <>
          <AmadeusSection />
          <FleetManagementSection />
        </>
      )}

      {/* Commerce Cloud Storefront Section - Only for Retail/Commerce */}
      {isRetailOrCommerce && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-orange-900/30 to-red-900/20"></div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  Commerce Cloud Innovation
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Salesforce Commerce Cloud Storefront
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Experience the power of Commerce Cloud with a real-world storefront.
                  Built on Salesforce, this platform delivers personalized shopping experiences,
                  intelligent product recommendations, and seamless omnichannel commerce.
                </p>
              </motion.div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Storefront Iframe */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="order-2 lg:order-1"
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/20 shadow-2xl shadow-orange-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm ml-2">Interactive Storefront Demo</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-transparent">
                    <InteractiveStorefrontDemo
                      companyName={companyName || 'Store'}
                      companyLogo={companyLogo}
                      website={companyWebsite}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-3 md:gap-6 mt-4 text-xs md:text-sm text-gray-400 flex-wrap">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
                        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                      </span>
                      <span className="hidden sm:inline">Shopping Cart</span>
                      <span className="sm:hidden">Cart</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-red-500/20 rounded-lg flex items-center justify-center text-red-400">
                        <Star className="w-3 h-3 md:w-4 md:h-4" />
                      </span>
                      <span className="hidden sm:inline">Recommendations</span>
                      <span className="sm:hidden">Recs</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 md:w-6 md:h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400">
                        <Target className="w-3 h-3 md:w-4 md:h-4" />
                      </span>
                      <span className="hidden sm:inline">Personalization</span>
                      <span className="sm:hidden">Personal</span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="order-1 lg:order-2"
              >
                <div className="space-y-6">
                  {[
                    {
                      icon: ShoppingCart,
                      title: 'Smart Shopping Cart',
                      description: 'Advanced cart functionality with saved items, wishlists, and seamless checkout flow powered by Commerce Cloud.'
                    },
                    {
                      icon: Target,
                      title: 'AI-Powered Recommendations',
                      description: 'Einstein Commerce AI analyzes browsing behavior to deliver personalized product recommendations that increase conversion rates.'
                    },
                    {
                      icon: Paintbrush,
                      title: 'Dynamic Hero Sections',
                      description: 'Engaging promotional banners and hero sections that adapt to customer segments and drive engagement.'
                    },
                    {
                      icon: Phone,
                      title: 'Mobile-First Design',
                      description: 'Fully responsive storefront optimized for mobile, tablet, and desktop with consistent experiences across all devices.'
                    },
                    {
                      icon: SearchIcon,
                      title: 'Advanced Search & Filters',
                      description: 'Intelligent product search with filtering, sorting, and faceted navigation to help customers find exactly what they need.'
                    },
                    {
                      icon: CreditCard,
                      title: 'Seamless Checkout',
                      description: 'Streamlined checkout process with multiple payment options, guest checkout, and saved payment methods for returning customers.'
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 p-4 bg-gradient-to-r from-gray-800/50 to-transparent rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Segmentation & Ratings Section - Only for Retail/Commerce */}
      {isRetailOrCommerce && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-gray-900 to-red-900/20"></div>

          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  Customer Intelligence
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Customer Segmentation & Ratings Calculation
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-4">
                  Our advanced segmentation system, implemented for many of our customers,
                  provides comprehensive customer insights through multi-dimensional analysis.
                  This intelligent approach enables targeted marketing, personalized experiences,
                  and data-driven decision making.
                </p>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Each customer is evaluated across four key dimensions to create a calculated segmentation
                  that drives strategic business actions.
                </p>
              </motion.div>
            </AnimatedSection>

            {/* Segmentation Dimensions Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: TrendingUp,
                  title: 'Adoption Rating',
                  levels: ['High', 'Medium', 'Low'],
                  description: 'Measures customer engagement with platform features, usage patterns, and feature adoption rates. High adoption indicates active users maximizing platform value.',
                  color: 'from-blue-500/20 to-cyan-500/20',
                  borderColor: 'border-blue-500/30',
                  iconColor: 'text-blue-400'
                },
                {
                  icon: Sparkles,
                  title: 'Potentiality Rating',
                  levels: ['High', 'Medium', 'Low'],
                  description: 'Assesses growth potential and future value based on business size, growth trajectory, expansion plans, and market position.',
                  color: 'from-purple-500/20 to-pink-500/20',
                  borderColor: 'border-purple-500/30',
                  iconColor: 'text-purple-400'
                },
                {
                  icon: DollarSign,
                  title: 'Purchasing Power',
                  levels: ['Class A', 'Class B', 'Class C'],
                  description: 'Categorizes customers by purchasing capacity. Class A represents high-value customers, Class B mid-market, and Class C entry-level needs.',
                  color: 'from-green-500/20 to-emerald-500/20',
                  borderColor: 'border-green-500/30',
                  iconColor: 'text-green-400'
                },
                {
                  icon: Heart,
                  title: 'Brand Loyalty',
                  levels: ['High', 'Medium', 'Low'],
                  description: 'Measures customer loyalty and retention likelihood based on purchase history, repeat business patterns, and contract length.',
                  color: 'from-red-500/20 to-orange-500/20',
                  borderColor: 'border-red-500/30',
                  iconColor: 'text-red-400'
                }
              ].map((dimension, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${dimension.color} rounded-2xl p-6 border ${dimension.borderColor} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${dimension.color} rounded-xl flex items-center justify-center ${dimension.borderColor} border`}>
                      <dimension.icon className={`w-6 h-6 ${dimension.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{dimension.title}</h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {dimension.levels.map((level, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/90 border border-white/20"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">{dimension.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Calculated Segmentation Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl p-8 border border-orange-500/30 backdrop-blur-sm"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-orange-500/30">
                  <Brain className="w-8 h-8 text-orange-400" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    Calculated Segmentation
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-sm font-medium text-orange-400 border border-orange-500/30">
                      AI-Powered
                    </span>
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                    Our intelligent system combines all four dimensions—Adoption, Potentiality, Purchasing Power,
                    and Brand Loyalty—to generate a comprehensive calculated segmentation. This multi-dimensional
                    analysis creates distinct customer segments that enable:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: Target,
                        title: 'Targeted Marketing',
                        description: 'Deliver personalized campaigns based on customer segment characteristics'
                      },
                      {
                        icon: Zap,
                        title: 'Sales Prioritization',
                        description: 'Focus resources on high-value segments with greatest growth potential'
                      },
                      {
                        icon: BarChart3,
                        title: 'Predictive Analytics',
                        description: 'Forecast customer behavior and optimize engagement strategies'
                      },
                      {
                        icon: Users,
                        title: 'Customer Success',
                        description: 'Tailor support and onboarding based on adoption and loyalty patterns'
                      }
                    ].map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-1">{benefit.title}</h4>
                          <p className="text-gray-400 text-xs leading-relaxed">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      <span className="font-semibold text-orange-400">Implementation Status:</span> This segmentation
                      methodology has been successfully implemented for many of our customers, delivering measurable
                      improvements in customer engagement, conversion rates, and revenue growth.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Salesforce Field Service Section - Only for Retail/Commerce */}
      {isRetailOrCommerce && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-green-900/20"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6 border border-blue-500/30">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                  Field Service Management
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Salesforce Field Service
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-4">
                  Intelligent Mobile Workforce Management
                </p>
                <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                  Empower your technicians with a complete solution for managing work orders,
                  dispatching tickets, and optimizing field operations in real-time.
                </p>
              </motion.div>
            </AnimatedSection>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <AnimatedSection delay={0.2}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                  <img
                    src="https://www.winfomi.com/services/Experience-Cloud-intro.png"
                    alt="Salesforce Field Service Experience"
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h3 className="text-2xl font-bold text-white mb-2">Connected Experience</h3>
                    <p className="text-gray-300">Seamlessly connect your mobile workforce with back-office operations.</p>
                  </div>
                </div>
              </AnimatedSection>

              <div className="space-y-6">
                {[
                  {
                    title: "Smart Dispatching",
                    description: "Automatically assign the right technician with the right skills to the right job.",
                    color: "blue"
                  },
                  {
                    title: "Real-time Asset Management",
                    description: "Track inventory, parts, and customer assets directly from the mobile app.",
                    color: "green"
                  },
                  {
                    title: "Optimized Routing",
                    description: "Reduce travel time and fuel costs with AI-powered route optimization.",
                    color: "purple"
                  }
                ].map((item, idx) => (
                  <AnimatedSection key={idx} delay={0.4 + (idx * 0.1)}>
                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className={`w-12 h-12 rounded-lg bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                        <div className={`w-3 h-3 rounded-full bg-${item.color}-400`}></div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-xl">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white mb-4">Intelligent Work Order Flow</h3>
                <p className="text-gray-400">From ticket creation to skill-based assignment</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 relative">
                {/* Arrow Connector for Desktop */}
                <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                <AnimatedSection delay={0.2} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transitionduration-500"></div>
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                    <img
                      src="https://ablypro.com/wp-content/uploads/2023/03/create-work-order-min-scaled.jpg"
                      alt="Create Work Order"
                      className="w-full h-64 object-cover object-top hover:object-center transition-all duration-700"
                    />
                    <div className="p-6 bg-gray-900/95 backdrop-blur absolute bottom-0 w-full border-t border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">1</span>
                        <h4 className="text-lg font-bold text-white">Create Work Order</h4>
                      </div>
                      <p className="text-sm text-gray-400">Service requests are automatically converted into work orders with all necessary context.</p>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.4} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                    <img
                      src="https://ablypro.com/wp-content/uploads/2023/03/work-skills.jpg"
                      alt="Skill-based Assignment"
                      className="w-full h-64 object-cover object-top hover:object-center transition-all duration-700"
                    />
                    <div className="p-6 bg-gray-900/95 backdrop-blur absolute bottom-0 w-full border-t border-gray-800">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">2</span>
                        <h4 className="text-lg font-bold text-white">Skill-based Assignment</h4>
                      </div>
                      <p className="text-sm text-gray-400">AI matches the work order requirements with technician skills and availability.</p>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* TechSa Section - Only for Commerce, Manufacturing, and Healthcare */}
      {selectedIndustry && ['commerce-cloud', 'healthcare-life-sciences', 'manufacturing'].includes(selectedIndustry) && (
        <TechSaSection />
      )}

      {/* ERP Integration Section */}
      <section id="erp-integration" ref={erpRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <CompanyLogo
                  logoUrl={companyLogo}
                  companyName={companyName || 'Company'}
                  website={companyWebsite}
                  size="medium"
                  className="w-12 h-12"
                />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {companyName
                    ? personalizeText(t('power.erp.title.personalized'), 'your company', selectedIndustryData?.name)
                    : (selectedIndustryData ? `Seamlessly Connects to Your ${selectedIndustryData.name} Systems` : 'Seamlessly Connects to Your Existing Systems')
                  }
                </h2>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {companyName
                  ? personalizeText(t('power.erp.subtitle.personalized'), 'your company', selectedIndustryData?.name)
                  : (selectedIndustryData
                    ? `Salesforce integrates with major ERP systems used in ${selectedIndustryData.name.toLowerCase()} to unify your data and streamline ${selectedIndustryData.name.toLowerCase()} workflows`
                    : 'Salesforce integrates with all major ERP systems for unified business operations'
                  )
                }
              </p>

              {/* AI Insight for Connect Section */}
              {companyIntelligence?.structuredInsights?.connect && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-400/20"
                >
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                    {companyIntelligence.structuredInsights.connect}
                  </p>
                </motion.div>
              )}

              {selectedIndustryData && selectedIndustryData.integrations && selectedIndustryData.integrations.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">
                    Common {selectedIndustryData.name} Integrations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {selectedIndustryData.integrations.slice(0, 4).map((integration, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{integration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatedSection>

          {/* ERP Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {erpIntegrations.map((erp, index) => (
              <motion.div
                key={erp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${erp.gradient} rounded-2xl p-6 group cursor-pointer`}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-2xl font-bold text-white">{erp.shortName.charAt(0)}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{erp.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{erp.description}</p>

                  {/* Sync Indicators */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                      <Zap className="w-4 h-4" />
                      Real-time Sync
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-white/90">
                      <CheckCircle2 className="w-4 h-4" />
                      {erp.customerCount}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Integration Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Unified Data',
                description: 'Single source of truth across all systems',
                icon: Database
              },
              {
                title: 'Real-time Sync',
                description: 'Instant updates across platforms',
                icon: Zap
              },
              {
                title: 'Reduced Complexity',
                description: 'Streamlined business processes',
                icon: Settings
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Data Cloud Section */}
      <section ref={dataCloudRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900"></div>

        {/* Particle Effects */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <CompanyLogo
                  logoUrl={companyLogo}
                  companyName={companyName || 'Company'}
                  website={companyWebsite}
                  size="medium"
                  className="w-12 h-12"
                />
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {companyName
                    ? personalizeText(t('power.datacloud.title.personalized'), 'your company', selectedIndustryData?.name)
                    : (selectedIndustryData ? `Data Cloud: Connect Your ${selectedIndustryData.name} Data` : 'Data Cloud: Connect Everything')
                  }
                </h2>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {companyName
                  ? personalizeText(t('power.datacloud.subtitle.personalized'), 'your company', selectedIndustryData?.name)
                  : (selectedIndustryData
                    ? `One unified view of your ${selectedIndustryData.name.toLowerCase()} customers and operations, regardless of where data lives across your systems`
                    : 'One unified view of your customer, regardless of where data lives'
                  )
                }
              </p>

              {/* AI Insight for Data Cloud Section */}
              {companyIntelligence?.structuredInsights?.dataCloud && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-400/20"
                >
                  <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                    {companyIntelligence.structuredInsights.dataCloud}
                  </p>
                </motion.div>
              )}

              {selectedIndustryData && selectedIndustryData.dataSources && selectedIndustryData.dataSources.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">
                    {selectedIndustryData.name} Data Sources We Connect
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {selectedIndustryData.dataSources.slice(0, 4).map((source, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatedSection>

          {/* Galaxy Visualization */}
          <div className="relative max-w-4xl mx-auto">
            {/* Center Data Cloud */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
                <Database className="w-20 h-20 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Orbiting Platforms */}
            <div className="relative h-96">
              {[
                { icon: Users, name: 'Sales Cloud', angle: 0 },
                { icon: Headphones, name: 'Service Cloud', angle: 60 },
                { icon: BarChart3, name: 'Marketing Cloud', angle: 120 },
                { icon: ShoppingCart, name: 'Commerce Cloud', angle: 180 },
                { icon: Globe, name: 'Experience Cloud', angle: 240 },
                { icon: MessageSquare, name: 'Slack', angle: 300 },
              ].map((platform, index) => {
                const angle = platform.angle;
                const radius = 180;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 360,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + index * 0.1,
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg group"
                    >
                      <platform.icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Data Cloud Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Customer 360',
                description: 'Complete customer view across all touchpoints',
                icon: Users
              },
              {
                title: 'Real-time Insights',
                description: 'Instant data processing and analytics',
                icon: BarChart3
              },
              {
                title: 'AI-Powered',
                description: 'Einstein AI for intelligent segmentation',
                icon: Brain
              },
              {
                title: 'Universal Connector',
                description: 'Connect any data source seamlessly',
                icon: Zap
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industry-Specific Solutions */}
      {selectedIndustry && selectedIndustryData && (
        <section id="industries-grid" ref={industryRef} className="py-24 relative bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {companyName
                    ? personalizeText(t('power.industry.title.personalized'), 'your company', selectedIndustryData?.name)
                    : `Tailored Solutions for ${selectedIndustryData.name}`
                  }
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  {selectedIndustryData.description}
                </p>

                {/* AI Insight for Tailored Solutions Section */}
                {companyIntelligence?.structuredInsights?.tailored && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-400/20"
                  >
                    <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
                      {companyIntelligence.structuredInsights.tailored}
                    </p>
                  </motion.div>
                )}

                {/* Industry Success Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {selectedIndustryData.successMetrics?.slice(0, 3).map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/30"
                    >
                      <div className="text-2xl font-bold text-cyan-400 mb-2">{metric.value}</div>
                      <div className="text-gray-300 text-sm">{metric.description}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatedSection>

            {/* Industry Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {industryProducts.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className={`bg-gradient-to-br ${product.gradient} rounded-2xl p-8 group border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300`}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors duration-300">
                      <product.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors duration-300">{product.name}</h3>
                      <p className="text-white/90 text-sm mb-6 leading-relaxed">{product.description}</p>
                      <div className="space-y-2">
                        {product.keyFeatures.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm text-white/90">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>

            {/* Success Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {selectedIndustryData.successMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400 mb-2">{metric.value}</div>
                  <p className="text-white font-semibold text-sm">{metric.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Pharma Specific Sections */}
      {selectedIndustry === 'healthcare-life-sciences' && (
        <PharmaSections />
      )}

      {/* Competitive Analysis Comparison */}
      <section id="comparison-table" ref={comparisonRef} className="py-24 relative bg-gray-900 scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {companyName
                  ? personalizeText(t('power.comparison.title.personalized'), 'your company', selectedIndustryData?.name)
                  : (selectedIndustryData
                    ? t('power.comparison.title.industry', { industry: selectedIndustryData.name })
                    : t('power.comparison.title')
                  )
                }
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
                {companyName
                  ? personalizeText(t('power.comparison.subtitle.personalized'), 'your company', selectedIndustryData?.name)
                  : (selectedIndustryData
                    ? t('power.comparison.subtitle.industry', { industry: selectedIndustryData.name })
                    : t('power.comparison.subtitle')
                  )
                }
              </p>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                {t('power.comparison.roiDescription')}
              </p>
            </motion.div>
          </AnimatedSection>

          {/* Copy Table Link and CSV Download Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
          >
            <button
              onClick={copyTableLink}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 rounded-full transition-colors duration-200 border border-gray-600 hover:border-gray-500"
              title="Copy table link"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Copy Table Link</span>
                </>
              )}
            </button>

            <button
              onClick={downloadComparisonCSV}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-full transition-all duration-200 border border-cyan-500/30 hover:border-cyan-500/50"
              title="Download comparison as CSV"
            >
              <Download className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Download CSV</span>
            </button>
          </motion.div>

          {/* Executive Summary */}
          {selectedIndustryData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Executive Summary: Why Salesforce Leads in {selectedIndustryData.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Revenue Impact</div>
                      <div className="text-sm text-gray-300">341% ROI over 3 years (Forrester Study)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Operational Efficiency</div>
                      <div className="text-sm text-gray-300">Industry-specific automation & workflows</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">Risk Mitigation</div>
                      <div className="text-sm text-gray-300">Enterprise-grade security & compliance</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Competitive Comparison Table */}
          <motion.div
            id="comparison-table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            {/* Desktop Table - hidden on mobile */}
            <div className="hidden md:block">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
                {/* Table Header */}
                <div className="p-6 bg-gray-800/80 border-b border-gray-700">
                  <div className="grid grid-cols-7 gap-4">
                    <div className="col-span-1 text-gray-400 text-sm font-semibold">Metric</div>
                    <div className="col-span-1 text-center">
                      <div className="text-cyan-400 font-bold text-lg mb-1">Salesforce</div>
                      <div className="text-xs text-gray-400">#1 CRM</div>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="text-white font-semibold">HubSpot</div>
                      <div className="text-xs text-gray-400">SMB Focus</div>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="text-white font-semibold">Zoho</div>
                      <div className="text-xs text-gray-400">Budget</div>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="text-white font-semibold">Freshworks</div>
                      <div className="text-xs text-gray-400">Mid-Market</div>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="text-white font-semibold">Odoo</div>
                      <div className="text-xs text-gray-400">Open Source</div>
                    </div>
                    <div className="col-span-1 text-center">
                      <div className="text-white font-semibold">SalezBuzz</div>
                      <div className="text-xs text-gray-400">Pipeline Focus</div>
                    </div>
                  </div>
                </div>

                {/* Comparison Rows */}
                {(selectedIndustryData?.comparisonMetrics || [
                  {
                    metric: 'Sales Cycle Time',
                    salesforce: { score: 10, label: 'AI-Optimized', description: 'Einstein AI-powered sales acceleration and predictive lead scoring' },
                    hubspot: { score: 6, label: 'Basic Automation', description: 'Simple automation with limited AI features' },
                    zoho: { score: 6, label: 'Standard Process', description: 'Basic sales process management' },
                    freshworks: { score: 5, label: 'Limited Features', description: 'Minimal sales automation capabilities' },
                    odoo: { score: 4, label: 'Manual Setup', description: 'Requires extensive configuration for sales optimization' },
                    salezbuzz: { score: 7, label: 'Good Automation', description: 'Good automation with pipeline tracking capabilities' }
                  },
                  {
                    metric: 'Implementation Time',
                    salesforce: { score: 8, label: 'Rapid Deployment', description: 'Pre-built industry templates and AI-powered setup assistance' },
                    hubspot: { score: 9, label: 'Quick Setup', description: 'Simple setup but limited customization' },
                    zoho: { score: 7, label: 'Moderate Setup', description: 'Standard implementation process' },
                    freshworks: { score: 8, label: 'Fast Setup', description: 'Quick setup with basic features' },
                    odoo: { score: 4, label: 'Complex Setup', description: 'Requires significant technical expertise' },
                    salezbuzz: { score: 8, label: 'Quick Deployment', description: 'Quick deployment for SMBs with pre-configured templates' }
                  },
                  {
                    metric: 'Customizability',
                    salesforce: { score: 10, label: 'Unlimited', description: 'Complete platform customization with Einstein AI and AppExchange' },
                    hubspot: { score: 5, label: 'Limited', description: 'Basic customization options only' },
                    zoho: { score: 6, label: 'Moderate', description: 'Some customization within framework' },
                    freshworks: { score: 4, label: 'Very Limited', description: 'Minimal customization capabilities' },
                    odoo: { score: 5, label: 'Manual Development', description: 'Requires extensive coding for customization' },
                    salezbuzz: { score: 5, label: 'Limited Options', description: 'Limited customization options within predefined framework' }
                  },
                  {
                    metric: 'Ease of Use',
                    salesforce: { score: 9, label: 'AI-Enhanced', description: 'Einstein AI guidance and intelligent automation reduce complexity' },
                    hubspot: { score: 8, label: 'User-Friendly', description: 'Intuitive interface with good UX' },
                    zoho: { score: 7, label: 'Moderate Learning', description: 'Some learning curve required' },
                    freshworks: { score: 8, label: 'Simple Interface', description: 'Easy to use but limited functionality' },
                    odoo: { score: 4, label: 'Technical Required', description: 'Requires technical knowledge for optimal use' },
                    salezbuzz: { score: 8, label: 'Intuitive UI', description: 'Intuitive sales-focused interface designed for ease of use' }
                  },
                  {
                    metric: 'Integration & Ecosystem',
                    salesforce: { score: 10, label: '5,000+ Apps', description: 'Largest ecosystem with native AI integrations and MuleSoft connectivity' },
                    hubspot: { score: 6, label: '1,000+ Apps', description: 'Good integration marketplace but limited AI features' },
                    zoho: { score: 5, label: 'Zoho Suite', description: 'Good within Zoho ecosystem, limited external integrations' },
                    freshworks: { score: 4, label: 'Growing', description: 'Limited integration options, basic connectivity' },
                    odoo: { score: 4, label: 'Manual Integration', description: 'Requires custom development for most integrations' },
                    salezbuzz: { score: 5, label: 'Basic Integrations', description: 'Basic integrations available with common business tools' }
                  },
                  {
                    metric: 'Scalability',
                    salesforce: { score: 10, label: 'Unlimited Scale', description: 'Enterprise-grade scalability with AI-powered performance optimization' },
                    hubspot: { score: 6, label: 'Mid-Market', description: 'Good for mid-market, limited enterprise features' },
                    zoho: { score: 6, label: 'Mid-Market', description: 'Suitable for mid-market companies' },
                    freshworks: { score: 5, label: 'SMB-Mid', description: 'Limited scalability for large enterprises' },
                    odoo: { score: 5, label: 'Custom Scale', description: 'Scalable but requires significant technical expertise' },
                    salezbuzz: { score: 6, label: 'Mid-Market Focus', description: 'Suitable for mid-market companies, limited enterprise capabilities' }
                  },
                  {
                    metric: 'Cost Effectiveness',
                    salesforce: { score: 9, label: 'High Value', description: 'Premium pricing but 341% ROI (Forrester) and AI-powered efficiency gains' },
                    hubspot: { score: 7, label: 'Moderate Value', description: 'Good value for basic needs' },
                    zoho: { score: 8, label: 'Affordable', description: 'Good value for mid-market' },
                    freshworks: { score: 7, label: 'Budget Option', description: 'Low cost but limited features' },
                    odoo: { score: 5, label: 'Hidden Costs', description: 'Low base cost but high implementation and maintenance costs' },
                    salezbuzz: { score: 7, label: 'Affordable Option', description: 'Affordable for smaller teams with decent feature set' }
                  },
                  {
                    metric: 'ROI Potential',
                    salesforce: { score: 10, label: '341% ROI', description: 'Industry-leading ROI with AI-powered automation (Forrester TEI Study)' },
                    hubspot: { score: 6, label: '120% ROI', description: 'Moderate ROI with basic automation' },
                    zoho: { score: 5, label: '100% ROI', description: 'Basic ROI with limited advanced features' },
                    freshworks: { score: 4, label: '80% ROI', description: 'Limited ROI due to basic functionality' },
                    odoo: { score: 4, label: '110% ROI', description: 'Moderate ROI but requires significant investment in customization' },
                    salezbuzz: { score: 6, label: '130% ROI', description: 'Moderate ROI with basic features and pipeline automation' }
                  }
                ]).map((row, index) => (
                  <motion.div
                    key={row.metric}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/30 transition-colors duration-200"
                  >
                    <div
                      className="grid grid-cols-7 gap-4 p-6 cursor-pointer"
                      onClick={() => toggleMetricExpansion(row.metric)}
                    >
                      <div className="col-span-1 flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {/* Business Impact Icon */}
                          {row.metric.toLowerCase().includes('roi') || row.metric.toLowerCase().includes('revenue') ? (
                            <DollarSign className="w-4 h-4 text-green-400" />
                          ) : row.metric.toLowerCase().includes('time') || row.metric.toLowerCase().includes('cycle') ? (
                            <Clock className="w-4 h-4 text-blue-400" />
                          ) : row.metric.toLowerCase().includes('security') || row.metric.toLowerCase().includes('compliance') ? (
                            <Shield className="w-4 h-4 text-red-400" />
                          ) : row.metric.toLowerCase().includes('integration') || row.metric.toLowerCase().includes('ecosystem') ? (
                            <Zap className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Target className="w-4 h-4 text-purple-400" />
                          )}
                          <span className="text-white font-medium">{row.metric}</span>
                        </div>
                        <Info className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
                      </div>
                      {[row.salesforce, row.hubspot, row.zoho, row.freshworks, row.odoo, row.salezbuzz].map((item, idx) => (
                        <div key={idx} className="col-span-1 flex flex-col items-center justify-center group">
                          {/* Score Visualization */}
                          <div className="mb-2">
                            <div
                              className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                              style={{
                                background: `conic-gradient(
                                from -90deg,
                                ${idx === 0 ? '#22d3ee' : '#facc15'} 0%,
                                ${idx === 0 ? '#22d3ee' : '#facc15'} ${(item.score / 10) * 100}%,
                                #4b5563 ${(item.score / 10) * 100}%,
                                #4b5563 100%
                              )`
                              }}
                            >
                              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
                                <div className={`text-lg font-bold ${idx === 0 ? 'text-cyan-400' : 'text-gray-300'}`}>
                                  {item.score}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Score Dots */}
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${i < Math.floor(item.score / 2)
                                  ? idx === 0 ? 'bg-cyan-400' : 'bg-yellow-400'
                                  : 'bg-gray-600'
                                  }`}
                              />
                            ))}
                          </div>

                          {/* Label with Executive Context */}
                          <div className={`text-xs font-semibold ${idx === 0 ? 'text-cyan-400' : 'text-gray-300'} text-center`}>
                            {item.label}
                          </div>

                          {/* Business Impact Indicator */}
                          <div className={`text-xs font-medium mt-1 text-center ${item.score >= 9 ? 'text-green-400' :
                            item.score >= 7 ? 'text-yellow-400' :
                              item.score >= 5 ? 'text-orange-400' : 'text-red-400'
                            }`}>
                            {item.score >= 9 ? 'Exceptional' :
                              item.score >= 7 ? 'Strong' :
                                item.score >= 5 ? 'Moderate' : 'Limited'}
                          </div>

                          {/* Executive Recommendation */}
                          {idx === 0 && item.score >= 8 && (
                            <div className="text-xs text-cyan-400 font-semibold mt-1 text-center">
                              Recommended
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                      {expandedMetrics.has(row.metric) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 bg-gray-800/20">
                            <div className="grid grid-cols-7 gap-4 text-sm">
                              <div className="col-span-1 text-gray-400 font-medium">Details</div>
                              {[
                                { name: 'Salesforce', data: row.salesforce, color: 'text-cyan-400' },
                                { name: 'HubSpot', data: row.hubspot, color: 'text-gray-300' },
                                { name: 'Zoho', data: row.zoho, color: 'text-gray-300' },
                                { name: 'Freshworks', data: row.freshworks, color: 'text-gray-300' },
                                { name: 'Odoo', data: row.odoo, color: 'text-gray-300' },
                                { name: 'SalezBuzz', data: row.salezbuzz, color: 'text-gray-300' }
                              ].map((item, idx) => (
                                <div key={idx} className={`col-span-1 ${item.color}`}>
                                  <div className="font-medium mb-1">{item.name}</div>
                                  <div className="text-xs text-gray-400 leading-relaxed">
                                    {item.data.description || 'No additional details available'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden">
              <div className="space-y-4">
                {(selectedIndustryData?.comparisonMetrics || [
                  {
                    metric: 'Sales Cycle Time',
                    salesforce: { score: 10, label: 'AI-Optimized', description: 'Einstein AI-powered sales acceleration and predictive lead scoring' },
                    hubspot: { score: 6, label: 'Basic Automation', description: 'Simple automation with limited AI features' },
                    zoho: { score: 6, label: 'Standard Process', description: 'Basic sales process management' },
                    freshworks: { score: 5, label: 'Limited Features', description: 'Minimal sales automation capabilities' },
                    odoo: { score: 4, label: 'Manual Setup', description: 'Requires extensive configuration for sales optimization' },
                    salezbuzz: { score: 7, label: 'Good Automation', description: 'Good automation with pipeline tracking capabilities' }
                  },
                  {
                    metric: 'Customization',
                    salesforce: { score: 10, label: 'Unlimited', description: 'Complete platform customization with Einstein AI and AppExchange' },
                    hubspot: { score: 5, label: 'Limited', description: 'Basic customization options only' },
                    zoho: { score: 6, label: 'Moderate', description: 'Some customization within framework' },
                    freshworks: { score: 4, label: 'Very Limited', description: 'Minimal customization capabilities' },
                    odoo: { score: 5, label: 'Manual Development', description: 'Requires extensive coding for customization' },
                    salezbuzz: { score: 5, label: 'Limited Options', description: 'Limited customization options within predefined framework' }
                  },
                  {
                    metric: 'Integration Capabilities',
                    salesforce: { score: 10, label: '5,000+ Apps', description: 'Largest ecosystem with native AI integrations and MuleSoft connectivity' },
                    hubspot: { score: 6, label: '1,000+ Apps', description: 'Good integration marketplace but limited AI features' },
                    zoho: { score: 5, label: 'Zoho Suite', description: 'Good within Zoho ecosystem, limited external integrations' },
                    freshworks: { score: 4, label: 'Growing', description: 'Limited integration options, basic connectivity' },
                    odoo: { score: 4, label: 'Manual Integration', description: 'Requires custom development for most integrations' },
                    salezbuzz: { score: 5, label: 'Basic Integrations', description: 'Basic integrations available with common business tools' }
                  },
                  {
                    metric: 'AI & Analytics',
                    salesforce: { score: 10, label: 'Einstein AI Suite', description: 'Industry-leading AI with predictive analytics, automation, and intelligent insights' },
                    hubspot: { score: 5, label: 'Basic AI', description: 'Limited AI features, basic automation only' },
                    zoho: { score: 4, label: 'Minimal AI', description: 'Very basic AI capabilities' },
                    freshworks: { score: 3, label: 'No AI', description: 'No significant AI features' },
                    odoo: { score: 3, label: 'Manual Analytics', description: 'Basic reporting, no AI-powered insights' },
                    salezbuzz: { score: 5, label: 'Basic Analytics', description: 'Basic analytics with pipeline reporting capabilities' }
                  },
                  {
                    metric: 'Scalability',
                    salesforce: { score: 10, label: 'Unlimited Scale', description: 'Enterprise-grade scalability with AI-powered performance optimization' },
                    hubspot: { score: 6, label: 'Mid-Market', description: 'Good for mid-market, limited enterprise features' },
                    zoho: { score: 6, label: 'Mid-Market', description: 'Suitable for mid-market companies' },
                    freshworks: { score: 5, label: 'SMB-Mid', description: 'Limited scalability for large enterprises' },
                    odoo: { score: 5, label: 'Custom Scale', description: 'Scalable but requires significant technical expertise' },
                    salezbuzz: { score: 6, label: 'Mid-Market Focus', description: 'Suitable for mid-market companies, limited enterprise capabilities' }
                  }
                ]).slice(0, 5).map((row, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-800/50 rounded-xl overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleMetricExpansion(`mobile-${row.metric}`)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-semibold">{row.metric}</h4>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedMetrics.has(`mobile-${row.metric}`) ? 'rotate-180' : ''
                            }`}
                        />
                      </div>
                      <div className="space-y-2 mt-3">
                        {[
                          { name: 'Salesforce', data: row.salesforce, highlight: true },
                          { name: 'HubSpot', data: row.hubspot },
                          { name: 'Zoho', data: row.zoho },
                          { name: 'Freshworks', data: row.freshworks },
                          { name: 'Odoo', data: row.odoo },
                          { name: 'SalezBuzz', data: row.salezbuzz }
                        ].map((item, idx) => (
                          <div key={idx} className={`flex justify-between items-center p-2 rounded ${item.highlight ? 'bg-cyan-500/10' : ''}`}>
                            <span className={item.highlight ? 'text-cyan-400 font-semibold' : 'text-gray-300'}>{item.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${item.highlight ? 'text-cyan-400' : 'text-gray-300'}`}>
                                {item.data.score}/10
                              </span>
                              <span className="text-xs text-gray-500">{item.data.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expandable Details for Mobile */}
                    <AnimatePresence>
                      {expandedMetrics.has(`mobile-${row.metric}`) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 bg-gray-800/30">
                            <div className="space-y-3 text-sm">
                              {[
                                { name: 'Salesforce', data: row.salesforce, color: 'text-cyan-400' },
                                { name: 'HubSpot', data: row.hubspot, color: 'text-gray-300' },
                                { name: 'Zoho', data: row.zoho, color: 'text-gray-300' },
                                { name: 'Freshworks', data: row.freshworks, color: 'text-gray-300' },
                                { name: 'Odoo', data: row.odoo, color: 'text-gray-300' }
                              ].map((item, idx) => (
                                <div key={idx} className={`${item.color}`}>
                                  <div className="font-medium mb-1">{item.name}</div>
                                  <div className="text-xs text-gray-400 leading-relaxed">
                                    {item.data.description || 'No additional details available'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Key Differentiators */}
          <AnimatedSection className="mb-16">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Why Salesforce Delivers 341% ROI (Forrester Study)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Complete Platform',
                  description: 'Not just CRM - Sales, Service, Marketing, Commerce, Analytics all integrated',
                  icon: Settings,
                  stat: '20+ Clouds'
                },
                {
                  title: 'AppExchange',
                  description: '5,000+ pre-built apps and integrations vs limited options',
                  icon: Target,
                  stat: '5,000+ Apps'
                },
                {
                  title: 'Enterprise Scale',
                  description: 'From startup to Fortune 500 - unlimited scalability',
                  icon: TrendingUp,
                  stat: '150K+ Customers'
                },
                {
                  title: 'AI Innovation',
                  description: 'Einstein AI built-in - predictive analytics and automation',
                  icon: Brain,
                  stat: 'AI-Powered'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.title}</h4>
                      <div className="text-cyan-400 text-sm font-semibold">{item.stat}</div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* ROI Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white">341% ROI (Forrester Study)</h3>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Salesforce Lightning delivers 341% ROI over 3 years according to Forrester's Total Economic Impact™ study - significantly higher than competitors
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: 'Salesforce', roi: '341%', color: 'text-cyan-400', bgColor: 'bg-cyan-400' },
                { name: 'HubSpot', roi: '120%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Odoo', roi: '110%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Zoho', roi: '100%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Freshworks', roi: '80%', color: 'text-gray-400', bgColor: 'bg-gray-400' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${item.color} mb-2`}>{item.roi}</div>
                  <div className={`h-2 ${item.bgColor} rounded-full mb-2`} style={{ width: item.name === 'Salesforce' ? '100%' : `${parseInt(item.roi) / 3.41}%` }}></div>
                  <div className="text-sm text-gray-400">{item.name}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">
              *Salesforce ROI from Forrester Consulting TEI Study (2018). Competitor data based on industry studies. Actual results may vary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Forrester TEI Study Section */}
      <section ref={forresterRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Forrester Badge */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-cyan-400" />
                    <span className="text-lg font-bold text-white">Forrester Research</span>
                  </div>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Proven ROI: Independent Study Results
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Forrester Consulting's Total Economic Impact™ study provides objective analysis of
                Salesforce Lightning's business value for decision-makers
              </p>

              {/* Hero ROI Stat */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
              >
                <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    341%
                  </div>
                  <div className="text-2xl md:text-3xl text-white font-semibold mb-2">
                    Return on Investment
                  </div>
                  <div className="text-gray-300 text-lg">
                    Over 3 Years
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatedSection>

          {/* Key Metrics Grid */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  icon: DollarSign,
                  title: 'Sales Efficiency',
                  value: '$1.59M',
                  description: 'In productivity savings over 3 years',
                  detail: '3% increase in sales productivity - over 1 hour saved per week per sales rep'
                },
                {
                  icon: Zap,
                  title: 'Development Speed',
                  value: '50%',
                  description: 'Faster time-to-market for applications',
                  detail: 'Component-based framework enabled rapid app development saving $1M+'
                },
                {
                  icon: TrendingUp,
                  title: 'Productivity Gains',
                  value: '+$366K',
                  description: 'Power user time savings over 3 years',
                  detail: '2 additional hours saved per week for business sponsors and project managers'
                },
                {
                  icon: Users,
                  title: 'Developer Retention',
                  value: '80%',
                  description: 'Reduction in developer turnover',
                  detail: '$169K in hiring cost avoidance savings'
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{metric.title}</h4>
                  </div>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">{metric.value}</div>
                  <p className="text-white text-sm font-semibold mb-2">{metric.description}</p>
                  <p className="text-gray-400 text-xs">{metric.detail}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Additional Benefits */}
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Additional Quantified Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle2, text: 'Enhanced dashboard capabilities and analytics' },
                  { icon: CheckCircle2, text: 'Improved user experience across all touchpoints' },
                  { icon: CheckCircle2, text: 'More efficient use of developer resources' },
                  { icon: CheckCircle2, text: 'Faster application deployment and iteration' },
                  { icon: CheckCircle2, text: 'Reduced training time for new team members' },
                  { icon: CheckCircle2, text: 'Better talent retention through modern tooling' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <benefit.icon className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Download CTA */}
          <AnimatedSection className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Read the Full Study
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Download the complete Forrester Consulting Total Economic Impact™ study for detailed
                methodology, composite organization analysis, and comprehensive financial modeling
              </p>
              <a
                href="/Assets/forrester-tei-of-salesforce-lightning.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic([10, 5, 10], '/Assets/woosh1new.mp3')}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Forrester Study (PDF)
                </Button>
              </a>
              <p className="text-xs text-gray-500 mt-6">
                Source: The Total Economic Impact™ of Salesforce Lightning, a commissioned study conducted by
                Forrester Consulting on behalf of Salesforce, 2018
              </p>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>


      {/* Modules Section */}
      {showModulesSection && (
        <ModulesSection
          modules={modules}
          isLoading={modulesLoading}
          industryName={modulesVerticalData?.name || selectedIndustryData?.name}
          verticalType={modulesVerticalData?.type}
          companyName={companyName}
          companyLogo={companyLogo}
          selectedModules={selectedModuleIds}
          onToggleModule={handleToggleModule}
        />
      )}

      {/* Investment Plan Section */}
      <InvestmentPlanSection />

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {companyName
                  ? personalizeText(t('power.cta.title.personalized'), 'your company', selectedIndustryData?.name)
                  : (selectedIndustryData
                    ? t('power.cta.title.industry', { industry: selectedIndustryData.name })
                    : t('power.cta.title')
                  )
                }
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {companyName
                  ? personalizeText(t('power.cta.subtitle.personalized'), 'your company', selectedIndustryData?.name)
                  : (selectedIndustryData
                    ? t('power.cta.subtitle.industry', { industry: selectedIndustryData.name })
                    : t('power.cta.subtitle')
                  )
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/salesforce-power-lead-capture">
                  <Button variant="primary" size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    {t('power.cta.contact')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </Link>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    triggerHaptic();
                    setSelectedIndustry(null);
                    setCurrentSection(0);
                    heroRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <RefreshCw className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Start Over
                </Button>

              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Progress Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2">
          {[0, 1, 2, 3, 4, 5, 6].map((section) => (
            <button
              key={section}
              onClick={() => {
                const refs = [heroRef, platformRef, erpRef, dataCloudRef, industryRef, comparisonRef, forresterRef];
                if (refs[section]) {
                  scrollToSection(refs[section], section);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSection === section
                ? 'bg-cyan-400 w-8'
                : 'bg-gray-600 hover:bg-gray-500'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={handleLeadModalClose}
        onSuccess={handleLeadModalSuccess}
        title={isDirectAccess ? "Get Your Personalized Analysis" : "Complete Your Profile"}
        subtitle={isDirectAccess ? "Tell us about your company to receive a customized comparison report" : "Add your company details to personalize your experience"}
      />

      {/* Figma Demo Modal */}
      <FigmaDemoModal
        isOpen={showDemoModal}
        onClose={handleCloseDemo}
      />
      {/* Scope Builder FAB */}
      {showModulesSection && (
        <ScopeBuilderFab
          verticals={allVerticals}
          selectedVerticalId={showModulesSection ? modulesVerticalId : selectedIndustry}
          selectedModuleCount={selectedModuleIds.size}
          onVerticalChange={handleVerticalChange}
          onScrollToModules={handleScrollToModules}
        />
      )}

      {/* Express Interest Button (Conditional) */}
      {searchParams.get('sfrecordId') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="fixed bottom-24 right-8 z-50"
        >
          <Button
            onClick={() => {
              triggerHaptic([20, 10, 20], '/Assets/selection3new.mp3');
              toast({
                title: "Interest Notified! 🚀",
                description: `Cloudastick Systems has been notified that ${companyName || 'your company'} is interested.`,
              });
              // The click tracking within useUserTracking will automatically pick this up
            }}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-2xl px-6 py-4 rounded-full font-bold flex items-center gap-2 group transition-all duration-300 hover:scale-110"
          >
            <Heart className="w-5 h-5 group-hover:fill-current transition-colors" />
            <span>Let Salesforce know that {companyName || 'your company'} is interested</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SalesforcePower;
