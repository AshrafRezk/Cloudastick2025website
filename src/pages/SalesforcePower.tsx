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
  Building2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import LeadCaptureModal from '../components/LeadCaptureModal';
import { salesforceProducts, getProductsByIndustry } from '../data/salesforceProducts';
import { erpIntegrations } from '../data/erpIntegrations';
import { industries, getIndustryById } from '../data/industries';
import { useToast } from '../hooks/use-toast';
import CompanyLogo from '../components/CompanyLogo';
import { formatWebsiteUrl } from '../services/logoService';
import { enrichCompany, initCompanyIntelligence, CompanyIntelligence } from '../services/companyIntelligence';
import ProductRecommendationBanner from '../components/ProductRecommendationBanner';
import { normalizeWebsiteUrl, formatForLogoFetch } from '../utils/urlNormalizer';
import { getClientsByIndustry } from '../utils/clientFilter';

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
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
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

  // Memoized hover handler to prevent unnecessary re-renders
  const handleProductHover = useCallback((productId: string | null) => {
    setHoveredProduct(productId);
  }, []);

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

  // Fetch company logo function
  const fetchCompanyLogo = useCallback(async (website: string) => {
    if (!website.trim()) return;
    
    setLogoLoading(true);
    setLogoError(false);
    
    try {
      const response = await fetch('/.netlify/functions/fetchLogo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website: website.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logo');
      }

      const data = await response.json();
      
      if (data.logoUrl) {
        setCompanyLogo(data.logoUrl);
        setLogoError(false);
      } else {
        setCompanyLogo(null);
        setLogoError(true);
      }
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
      const intelligence = await enrichCompany(website);
      setCompanyIntelligence(intelligence);
      
      // Auto-fill company name if not already set
      if (!companyName && intelligence.companyData.companyName) {
        setCompanyName(intelligence.companyData.companyName);
      }
      
      // Auto-select industry based on detection (user can change it)
      if (intelligence.companyData.normalizedIndustry && !selectedIndustry) {
        // Map normalized industry to our industry card IDs (closest matches)
        const industryMapping: { [key: string]: string } = {
          'real-estate': 'real-estate',
          'construction': 'manufacturing', // Construction → Manufacturing (closest)
          'insurance': 'financial-services', // Insurance → Financial Services
          'manufacturing': 'manufacturing',
          'travel-tourism': 'travel-tourism',
          'education': 'professional-services', // Education → Professional Services (consulting)
          'retail': 'retail-b2c',
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
      
      // Simple success message
      toast({
        title: "✨ All personalized now",
        description: `Ready for ${intelligence.companyData.companyName}`,
      });
    } catch (error) {
      console.error('Failed to enrich company:', error);
      // Don't show error toast - graceful degradation
    } finally {
      setLoadingIntelligence(false);
    }
  }, [loadingIntelligence, companyName, selectedIndustry, toast]);

  // Initialize company intelligence service on mount
  useEffect(() => {
    initCompanyIntelligence();
  }, []);

  // Read company info from URL parameters on mount
  useEffect(() => {
    // Read URL parameters (shortened keys: cn=company name, cw=company website)
    const companyNameParam = searchParams.get('cn') || searchParams.get('companyName');
    const companyWebsiteParam = searchParams.get('cw') || searchParams.get('companyWebsite');
    const industryParam = searchParams.get('industry');
    
    if (companyNameParam) {
      setCompanyName(decodeURIComponent(companyNameParam));
    }
    
    if (industryParam) {
      setSelectedIndustry(industryParam);
    }
    
    if (companyWebsiteParam) {
      const decodedWebsite = decodeURIComponent(companyWebsiteParam);
      // Normalize the URL
      const normalized = normalizeWebsiteUrl(decodedWebsite);
      setCompanyWebsite(normalized.display);
      
      // Fetch logo and enrich using normalized domain
      fetchCompanyLogo(normalized.domain);
      
      // Only enrich if no company name was provided
      if (!companyNameParam) {
        enrichCompanyData(normalized.domain);
      }
    }
  }, [searchParams, fetchCompanyLogo, enrichCompanyData]);

  // CSV download function
  const downloadComparisonCSV = () => {
    const metrics = selectedIndustryData?.comparisonMetrics || [
      {
        metric: 'Sales Cycle Time',
        salesforce: { score: 10, label: 'AI-Optimized', description: 'Einstein AI-powered sales acceleration and predictive lead scoring' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple automation with limited AI features' },
        zoho: { score: 6, label: 'Standard Process', description: 'Basic sales process management' },
        freshworks: { score: 5, label: 'Limited Features', description: 'Minimal sales automation capabilities' },
        odoo: { score: 7, label: 'Manual Setup', description: 'Requires extensive configuration for sales optimization' }
      },
      {
        metric: 'Implementation Time',
        salesforce: { score: 8, label: 'Rapid Deployment', description: 'Pre-built industry templates and AI-powered setup assistance' },
        hubspot: { score: 9, label: 'Quick Setup', description: 'Simple setup but limited customization' },
        zoho: { score: 7, label: 'Moderate Setup', description: 'Standard implementation process' },
        freshworks: { score: 8, label: 'Fast Setup', description: 'Quick setup with basic features' },
        odoo: { score: 5, label: 'Complex Setup', description: 'Requires significant technical expertise' }
      },
      {
        metric: 'Customizability',
        salesforce: { score: 10, label: 'Unlimited', description: 'Complete platform customization with Einstein AI and AppExchange' },
        hubspot: { score: 5, label: 'Limited', description: 'Basic customization options only' },
        zoho: { score: 6, label: 'Moderate', description: 'Some customization within framework' },
        freshworks: { score: 4, label: 'Very Limited', description: 'Minimal customization capabilities' },
        odoo: { score: 7, label: 'Manual Development', description: 'Requires extensive coding for customization' }
      },
      {
        metric: 'Ease of Use',
        salesforce: { score: 9, label: 'AI-Enhanced', description: 'Einstein AI guidance and intelligent automation reduce complexity' },
        hubspot: { score: 8, label: 'User-Friendly', description: 'Intuitive interface with good UX' },
        zoho: { score: 7, label: 'Moderate Learning', description: 'Some learning curve required' },
        freshworks: { score: 8, label: 'Simple Interface', description: 'Easy to use but limited functionality' },
        odoo: { score: 6, label: 'Technical Required', description: 'Requires technical knowledge for optimal use' }
      },
      {
        metric: 'Integration & Ecosystem',
        salesforce: { score: 10, label: '5,000+ Apps', description: 'Largest ecosystem with native AI integrations and MuleSoft connectivity' },
        hubspot: { score: 6, label: '1,000+ Apps', description: 'Good integration marketplace but limited AI features' },
        zoho: { score: 5, label: 'Zoho Suite', description: 'Good within Zoho ecosystem, limited external integrations' },
        freshworks: { score: 4, label: 'Growing', description: 'Limited integration options, basic connectivity' },
        odoo: { score: 6, label: 'Manual Integration', description: 'Requires custom development for most integrations' }
      },
      {
        metric: 'Scalability',
        salesforce: { score: 10, label: 'Unlimited Scale', description: 'Enterprise-grade scalability with AI-powered performance optimization' },
        hubspot: { score: 6, label: 'Mid-Market', description: 'Good for mid-market, limited enterprise features' },
        zoho: { score: 6, label: 'Mid-Market', description: 'Suitable for mid-market companies' },
        freshworks: { score: 5, label: 'SMB-Mid', description: 'Limited scalability for large enterprises' },
        odoo: { score: 7, label: 'Custom Scale', description: 'Scalable but requires significant technical expertise' }
      },
      {
        metric: 'Cost Effectiveness',
        salesforce: { score: 9, label: 'High Value', description: 'Premium pricing but highest ROI and AI-powered efficiency gains' },
        hubspot: { score: 7, label: 'Moderate Value', description: 'Good value for basic needs' },
        zoho: { score: 8, label: 'Affordable', description: 'Good value for mid-market' },
        freshworks: { score: 7, label: 'Budget Option', description: 'Low cost but limited features' },
        odoo: { score: 6, label: 'Hidden Costs', description: 'Low base cost but high implementation and maintenance costs' }
      },
      {
        metric: 'ROI Potential',
        salesforce: { score: 10, label: '251% ROI', description: 'Industry-leading ROI with AI-powered automation and insights' },
        hubspot: { score: 6, label: '120% ROI', description: 'Moderate ROI with basic automation' },
        zoho: { score: 5, label: '100% ROI', description: 'Basic ROI with limited advanced features' },
        freshworks: { score: 4, label: '80% ROI', description: 'Limited ROI due to basic functionality' },
        odoo: { score: 6, label: '110% ROI', description: 'Moderate ROI but requires significant investment in customization' }
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
    sound.play().catch(() => {}); // Ignore errors if sound fails
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
  const selectedIndustryData = selectedIndustry ? getIndustryById(selectedIndustry) : null;

  // Core products for platform overview - use first 6 products for better visualization
  const coreProducts = salesforceProducts.slice(0, 6);


  return (
    <div className="min-h-screen bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
                  {companyLogo && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CompanyLogo 
                        logoUrl={companyLogo} 
                        companyName={companyName || 'Company'} 
                        size="large"
                        className="w-24 h-24"
                      />
                    </motion.div>
                  )}
                  
                  {/* Plus sign when both logos are present */}
                  {companyLogo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-2xl text-cyan-400 font-bold"
                    >
                      +
                    </motion.div>
                  )}
                  
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

              {/* Company Inputs */}
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
                      {/* AI Insights Panel - Full Width */}
                      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          How Salesforce Can Help
                        </h4>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                          {companyIntelligence.aiInsights}
                        </div>
                      </div>

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
            </motion.div>

            {/* Industry Selection Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-24"
            >
              {industries.slice(0, 8).map((industry, index) => {
                const isSelected = selectedIndustry === industry.id;
                const isNotSelected = selectedIndustry && selectedIndustry !== industry.id;
                
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
                    onClick={() => handleIndustrySelect(industry.id)}
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
      {selectedIndustry && (() => {
        const relevantClients = getClientsByIndustry(selectedIndustry);
        return relevantClients.length > 0 ? (
          <section className="py-12 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Trusted by Leading {selectedIndustryData?.name} Companies
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
                  {/* Duplicate clients for seamless loop */}
                  {[...relevantClients, ...relevantClients].map((client, index) => (
                    <div
                      key={`${client.id}-${index}`}
                      className="flex-shrink-0 group"
                    >
                      <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 w-48 h-24 flex items-center justify-center">
                        <div className="text-center">
                          <h4 className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                            {client.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{client.industry}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-10"></div>
            </div>
          </section>
        ) : null;
      })()}

      {/* Platform Overview Section */}
      <section ref={platformRef} className="py-10 sm:py-16 md:py-20 relative overflow-hidden">
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

      {/* ERP Integration Section */}
      <section ref={erpRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                {companyLogo && (
                  <CompanyLogo 
                    logoUrl={companyLogo} 
                    companyName={companyName || 'Company'} 
                    size="medium"
                    className="w-12 h-12"
                  />
                )}
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
                {companyLogo && (
                  <CompanyLogo 
                    logoUrl={companyLogo} 
                    companyName={companyName || 'Company'} 
                    size="medium"
                    className="w-12 h-12"
                  />
                )}
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
        <section ref={industryRef} className="py-20 relative overflow-hidden">
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

      {/* Competitive Analysis Comparison */}
      <section ref={comparisonRef} className="py-20 relative overflow-hidden">
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
                      <div className="text-sm text-gray-300">251% average ROI vs 150% competitors</div>
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
                  <div className="grid grid-cols-6 gap-4">
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
                  odoo: { score: 7, label: 'Manual Setup', description: 'Requires extensive configuration for sales optimization' }
                },
                {
                  metric: 'Implementation Time',
                  salesforce: { score: 8, label: 'Rapid Deployment', description: 'Pre-built industry templates and AI-powered setup assistance' },
                  hubspot: { score: 9, label: 'Quick Setup', description: 'Simple setup but limited customization' },
                  zoho: { score: 7, label: 'Moderate Setup', description: 'Standard implementation process' },
                  freshworks: { score: 8, label: 'Fast Setup', description: 'Quick setup with basic features' },
                  odoo: { score: 5, label: 'Complex Setup', description: 'Requires significant technical expertise' }
                },
                {
                  metric: 'Customizability',
                  salesforce: { score: 10, label: 'Unlimited', description: 'Complete platform customization with Einstein AI and AppExchange' },
                  hubspot: { score: 5, label: 'Limited', description: 'Basic customization options only' },
                  zoho: { score: 6, label: 'Moderate', description: 'Some customization within framework' },
                  freshworks: { score: 4, label: 'Very Limited', description: 'Minimal customization capabilities' },
                  odoo: { score: 7, label: 'Manual Development', description: 'Requires extensive coding for customization' }
                },
                {
                  metric: 'Ease of Use',
                  salesforce: { score: 9, label: 'AI-Enhanced', description: 'Einstein AI guidance and intelligent automation reduce complexity' },
                  hubspot: { score: 8, label: 'User-Friendly', description: 'Intuitive interface with good UX' },
                  zoho: { score: 7, label: 'Moderate Learning', description: 'Some learning curve required' },
                  freshworks: { score: 8, label: 'Simple Interface', description: 'Easy to use but limited functionality' },
                  odoo: { score: 6, label: 'Technical Required', description: 'Requires technical knowledge for optimal use' }
                },
                {
                  metric: 'Integration & Ecosystem',
                  salesforce: { score: 10, label: '5,000+ Apps', description: 'Largest ecosystem with native AI integrations and MuleSoft connectivity' },
                  hubspot: { score: 6, label: '1,000+ Apps', description: 'Good integration marketplace but limited AI features' },
                  zoho: { score: 5, label: 'Zoho Suite', description: 'Good within Zoho ecosystem, limited external integrations' },
                  freshworks: { score: 4, label: 'Growing', description: 'Limited integration options, basic connectivity' },
                  odoo: { score: 6, label: 'Manual Integration', description: 'Requires custom development for most integrations' }
                },
                {
                  metric: 'Scalability',
                  salesforce: { score: 10, label: 'Unlimited Scale', description: 'Enterprise-grade scalability with AI-powered performance optimization' },
                  hubspot: { score: 6, label: 'Mid-Market', description: 'Good for mid-market, limited enterprise features' },
                  zoho: { score: 6, label: 'Mid-Market', description: 'Suitable for mid-market companies' },
                  freshworks: { score: 5, label: 'SMB-Mid', description: 'Limited scalability for large enterprises' },
                  odoo: { score: 7, label: 'Custom Scale', description: 'Scalable but requires significant technical expertise' }
                },
                {
                  metric: 'Cost Effectiveness',
                  salesforce: { score: 9, label: 'High Value', description: 'Premium pricing but highest ROI and AI-powered efficiency gains' },
                  hubspot: { score: 7, label: 'Moderate Value', description: 'Good value for basic needs' },
                  zoho: { score: 8, label: 'Affordable', description: 'Good value for mid-market' },
                  freshworks: { score: 7, label: 'Budget Option', description: 'Low cost but limited features' },
                  odoo: { score: 6, label: 'Hidden Costs', description: 'Low base cost but high implementation and maintenance costs' }
                },
                {
                  metric: 'ROI Potential',
                  salesforce: { score: 10, label: '251% ROI', description: 'Industry-leading ROI with AI-powered automation and insights' },
                  hubspot: { score: 6, label: '120% ROI', description: 'Moderate ROI with basic automation' },
                  zoho: { score: 5, label: '100% ROI', description: 'Basic ROI with limited advanced features' },
                  freshworks: { score: 4, label: '80% ROI', description: 'Limited ROI due to basic functionality' },
                  odoo: { score: 6, label: '110% ROI', description: 'Moderate ROI but requires significant investment in customization' }
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
                    className="grid grid-cols-6 gap-4 p-6 cursor-pointer"
                    onClick={() => toggleMetricExpansion(row.metric)}
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        {/* Business Impact Icon */}
                        {row.metric.toLowerCase().includes('roi') || row.metric.toLowerCase().includes('revenue') ? (
                          <DollarSign className="w-4 h-4 text-green-400" title="Revenue Impact" />
                        ) : row.metric.toLowerCase().includes('time') || row.metric.toLowerCase().includes('cycle') ? (
                          <Clock className="w-4 h-4 text-blue-400" title="Efficiency Impact" />
                        ) : row.metric.toLowerCase().includes('security') || row.metric.toLowerCase().includes('compliance') ? (
                          <Shield className="w-4 h-4 text-red-400" title="Risk & Compliance" />
                        ) : row.metric.toLowerCase().includes('integration') || row.metric.toLowerCase().includes('ecosystem') ? (
                          <Zap className="w-4 h-4 text-yellow-400" title="Technical Integration" />
                        ) : (
                          <Target className="w-4 h-4 text-purple-400" title="Business Capability" />
                        )}
                        <span className="text-white font-medium">{row.metric}</span>
                      </div>
                      <Info className="w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors" />
                    </div>
                    {[row.salesforce, row.hubspot, row.zoho, row.freshworks, row.odoo].map((item, idx) => (
                      <div key={idx} className="col-span-1 flex flex-col items-center justify-center group">
                        {/* Score Visualization */}
                        <div className="relative mb-2">
                          <div className="w-16 h-16 rounded-full border-2 border-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <div className={`text-lg font-bold ${idx === 0 ? 'text-cyan-400' : 'text-gray-300'}`}>
                              {item.score}
                            </div>
                          </div>
                          {/* Score Ring */}
                          <div 
                            className={`absolute inset-0 rounded-full border-2 ${
                              idx === 0 ? 'border-cyan-400' : 'border-yellow-400'
                            }`}
                            style={{
                              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((item.score * 3.6 - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((item.score * 3.6 - 90) * Math.PI / 180)}%)`
                            }}
                          />
                        </div>
                        
                        {/* Score Dots */}
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                i < Math.floor(item.score / 2) 
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
                        <div className={`text-xs font-medium mt-1 text-center ${
                          item.score >= 9 ? 'text-green-400' : 
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
                          <div className="grid grid-cols-6 gap-4 text-sm">
                            <div className="col-span-1 text-gray-400 font-medium">Details</div>
                            {[
                              { name: 'Salesforce', data: row.salesforce, color: 'text-cyan-400' },
                              { name: 'HubSpot', data: row.hubspot, color: 'text-gray-300' },
                              { name: 'Zoho', data: row.zoho, color: 'text-gray-300' },
                              { name: 'Freshworks', data: row.freshworks, color: 'text-gray-300' },
                              { name: 'Odoo', data: row.odoo, color: 'text-gray-300' }
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
                  odoo: { score: 7, label: 'Manual Setup', description: 'Requires extensive configuration for sales optimization' }
                },
                {
                  metric: 'Customization',
                  salesforce: { score: 10, label: 'Unlimited', description: 'Complete platform customization with Einstein AI and AppExchange' },
                  hubspot: { score: 5, label: 'Limited', description: 'Basic customization options only' },
                  zoho: { score: 6, label: 'Moderate', description: 'Some customization within framework' },
                  freshworks: { score: 4, label: 'Very Limited', description: 'Minimal customization capabilities' },
                  odoo: { score: 7, label: 'Manual Development', description: 'Requires extensive coding for customization' }
                },
                {
                  metric: 'Integration Capabilities',
                  salesforce: { score: 10, label: '5,000+ Apps', description: 'Largest ecosystem with native AI integrations and MuleSoft connectivity' },
                  hubspot: { score: 6, label: '1,000+ Apps', description: 'Good integration marketplace but limited AI features' },
                  zoho: { score: 5, label: 'Zoho Suite', description: 'Good within Zoho ecosystem, limited external integrations' },
                  freshworks: { score: 4, label: 'Growing', description: 'Limited integration options, basic connectivity' },
                  odoo: { score: 6, label: 'Manual Integration', description: 'Requires custom development for most integrations' }
                },
                {
                  metric: 'AI & Analytics',
                  salesforce: { score: 10, label: 'Einstein AI Suite', description: 'Industry-leading AI with predictive analytics, automation, and intelligent insights' },
                  hubspot: { score: 5, label: 'Basic AI', description: 'Limited AI features, basic automation only' },
                  zoho: { score: 4, label: 'Minimal AI', description: 'Very basic AI capabilities' },
                  freshworks: { score: 3, label: 'No AI', description: 'No significant AI features' },
                  odoo: { score: 4, label: 'Manual Analytics', description: 'Basic reporting, no AI-powered insights' }
                },
                {
                  metric: 'Scalability',
                  salesforce: { score: 10, label: 'Unlimited Scale', description: 'Enterprise-grade scalability with AI-powered performance optimization' },
                  hubspot: { score: 6, label: 'Mid-Market', description: 'Good for mid-market, limited enterprise features' },
                  zoho: { score: 6, label: 'Mid-Market', description: 'Suitable for mid-market companies' },
                  freshworks: { score: 5, label: 'SMB-Mid', description: 'Limited scalability for large enterprises' },
                  odoo: { score: 7, label: 'Custom Scale', description: 'Scalable but requires significant technical expertise' }
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
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          expandedMetrics.has(`mobile-${row.metric}`) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <div className="space-y-2 mt-3">
                      {[
                        { name: 'Salesforce', data: row.salesforce, highlight: true },
                        { name: 'HubSpot', data: row.hubspot },
                        { name: 'Zoho', data: row.zoho },
                        { name: 'Freshworks', data: row.freshworks },
                        { name: 'Odoo', data: row.odoo }
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
              Why Salesforce Delivers Superior ROI
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
              <h3 className="text-3xl font-bold text-white">251% Average ROI</h3>
            </div>
            <p className="text-lg text-gray-300 mb-6">
              Salesforce customers see an average ROI of 251% within 3 years - significantly higher than competitors
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { name: 'Salesforce', roi: '251%', color: 'text-cyan-400', bgColor: 'bg-cyan-400' },
                { name: 'HubSpot', roi: '120%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Odoo', roi: '110%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Zoho', roi: '100%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Freshworks', roi: '80%', color: 'text-gray-400', bgColor: 'bg-gray-400' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${item.color} mb-2`}>{item.roi}</div>
                  <div className={`h-2 ${item.bgColor} rounded-full mb-2`} style={{ width: item.name === 'Salesforce' ? '100%' : `${parseInt(item.roi) / 2.51}%` }}></div>
                  <div className="text-sm text-gray-400">{item.name}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">
              *ROI data based on industry studies and customer surveys. Actual results may vary.
            </p>
          </motion.div>
        </div>
      </section>

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
          {[0, 1, 2, 3, 4, 5].map((section) => (
            <button
              key={section}
              onClick={() => {
                const refs = [heroRef, platformRef, erpRef, dataCloudRef, industryRef, comparisonRef];
                if (refs[section]) {
                  scrollToSection(refs[section], section);
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === section 
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
    </div>
  );
};

export default SalesforcePower;
