import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import { salesforceProducts, getProductsByIndustry } from '../data/salesforceProducts';
import { erpIntegrations } from '../data/erpIntegrations';
import { industries, getIndustryById } from '../data/industries';

// Optimized Hub and Spoke Component
const HubAndSpokeVisualization = React.memo(({ 
  products, 
  onProductHover, 
  hoveredProduct 
}: { 
  products: any[], 
  onProductHover: (id: string | null) => void, 
  hoveredProduct: string | null 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Calculate positions once and memoize
  const productPositions = useMemo(() => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.3;
    
    return products.map((product, index) => {
      const angle = (index * 360) / products.length;
      const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
      const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;
      return { ...product, x, y, angle };
    });
  }, [products, dimensions]);

  // Draw canvas with error handling and performance optimization
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // Draw connection lines with batching
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      productPositions.forEach(({ x, y }) => {
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw center hub with gradient
      const gradient = ctx.createRadialGradient(centerX - 10, centerY - 10, 0, centerX, centerY, 40);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#06b6d4');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
      ctx.fill();

      // Draw center logo (Cloud icon)
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☁', centerX, centerY);

      // Draw pulsing ring with optimized animation
      const time = Date.now() * 0.001;
      const pulseRadius = 40 + Math.sin(time * 2) * 5;
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 + Math.sin(time * 2) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
      ctx.stroke();
    } catch (error) {
      console.warn('Canvas drawing error:', error);
    }
  }, [productPositions, dimensions]);

  // Optimized animation loop with reduced frequency
  useEffect(() => {
    let lastTime = 0;
    const targetFPS = 30; // Reduce from 60fps to 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        drawCanvas();
        lastTime = currentTime;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawCanvas]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: Math.min(container.offsetWidth, 800),
          height: 400
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-auto"
      />
      
      {/* Product Icons Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {productPositions.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            className="absolute pointer-events-auto"
            style={{
              left: product.x - 40,
              top: product.y - 40,
            }}
            onMouseEnter={() => onProductHover(product.id)}
            onMouseLeave={() => onProductHover(null)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-20 h-20 bg-gradient-to-br ${product.gradient} rounded-xl flex items-center justify-center cursor-pointer shadow-lg group relative`}
            >
              <product.icon className="w-8 h-8 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            
            {/* Product Label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-center"
            >
              <div className="text-xs text-gray-300 font-medium whitespace-nowrap">
                {product.shortName}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

HubAndSpokeVisualization.displayName = 'HubAndSpokeVisualization';

const SalesforcePower = () => {
  const { t, isRTL } = useLanguage();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showPlatformOverview, setShowPlatformOverview] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Memoized hover handler to prevent unnecessary re-renders
  const handleProductHover = useCallback((productId: string | null) => {
    setHoveredProduct(productId);
  }, []);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const erpRef = useRef<HTMLDivElement>(null);
  const dataCloudRef = useRef<HTMLDivElement>(null);
  const industryRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Haptic feedback function
  const triggerHaptic = (pattern: number[] = [10, 5, 10]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Handle industry selection
  const handleIndustrySelect = (industryId: string) => {
    triggerHaptic([20, 10, 20]);
    setSelectedIndustry(industryId);
    setCurrentSection(1);
    
    // Smooth scroll to platform overview
    setTimeout(() => {
      platformRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 500);
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

  // Get industry-specific products
  const industryProducts = selectedIndustry ? getProductsByIndustry(selectedIndustry) : [];
  const selectedIndustryData = selectedIndustry ? getIndustryById(selectedIndustry) : null;

  // Core products for platform overview - use first 6 products for better visualization
  const coreProducts = salesforceProducts.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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
                {t('hero.badge')}
              </span>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                {t('hero.title')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-16 leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Industry Selection Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
            >
              {industries.slice(0, 8).map((industry, index) => (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIndustrySelect(industry.id)}
                  className={`relative bg-gradient-to-br ${industry.gradient} rounded-2xl p-8 cursor-pointer group transition-all duration-300 hover:shadow-2xl border border-white/20 backdrop-blur-sm`}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-6 group-hover:bg-white/30 transition-colors duration-300">
                      <industry.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors duration-300">
                      {industry.shortName}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      {industry.description.split('.')[0]}.
                    </p>
                    <div className="flex items-center text-white/70 text-xs font-medium">
                      <span>{t('hero.explore')}</span>
                      <ArrowRight className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'} group-hover:translate-x-1 transition-transform duration-300`} />
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {selectedIndustry === industry.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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

      {/* Platform Overview Section */}
      <section ref={platformRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {selectedIndustryData ? `More Than Just CRM for ${selectedIndustryData.name}` : 'More Than Just CRM'}
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {selectedIndustryData 
                  ? `Salesforce provides specialized solutions for ${selectedIndustryData.name.toLowerCase()} with industry-specific clouds and workflows that address your unique challenges.`
                  : 'Salesforce is a complete platform with specialized clouds for every business need'
                }
              </p>
              
              {selectedIndustryData && (
                <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/30 max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                    Key Challenges We Solve for {selectedIndustryData.name}:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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
          <HubAndSpokeVisualization
            products={coreProducts}
            onProductHover={handleProductHover}
            hoveredProduct={hoveredProduct}
          />

          {/* Product Details Panel */}
          <AnimatePresence>
            {hoveredProduct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 max-w-md border border-gray-700 z-30"
              >
                {(() => {
                  const product = coreProducts.find(p => p.id === hoveredProduct);
                  return product ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${product.gradient} rounded-lg flex items-center justify-center`}>
                          <product.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{product.name}</h3>
                          <p className="text-cyan-400 text-sm">{product.category}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                      <div className="space-y-2">
                        {product.keyFeatures.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null;
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { label: 'Companies Using Salesforce', value: '150,000+', icon: Users },
              { label: 'AppExchange Apps', value: '5,000+', icon: Settings },
              { label: 'Market Share', value: '#1 CRM', icon: TrendingUp },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {selectedIndustryData ? `Seamlessly Connects to Your ${selectedIndustryData.name} Systems` : 'Seamlessly Connects to Your Existing Systems'}
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {selectedIndustryData 
                  ? `Salesforce integrates with major ERP systems used in ${selectedIndustryData.name.toLowerCase()} to unify your data and streamline ${selectedIndustryData.name.toLowerCase()} workflows`
                  : 'Salesforce integrates with all major ERP systems for unified business operations'
                }
              </p>
              
              {selectedIndustryData && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30 max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">
                    Common {selectedIndustryData.name} Integrations:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {selectedIndustryData.integrations?.slice(0, 4).map((integration, index) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
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
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {selectedIndustryData ? `Data Cloud: Connect Your ${selectedIndustryData.name} Data` : 'Data Cloud: Connect Everything'}
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {selectedIndustryData 
                  ? `One unified view of your ${selectedIndustryData.name.toLowerCase()} customers and operations, regardless of where data lives across your systems`
                  : 'One unified view of your customer, regardless of where data lives'
                }
              </p>
              
              {selectedIndustryData && (
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/30 max-w-4xl mx-auto">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">
                    {selectedIndustryData.name} Data Sources We Connect:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {selectedIndustryData.dataSources?.slice(0, 4).map((source, index) => (
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
                  Tailored Solutions for {selectedIndustryData.name}
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                  {selectedIndustryData.description}
                </p>
                
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
                  <p className="text-white font-semibold">{metric}</p>
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
                Salesforce vs The Competition
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
                See how Salesforce outperforms leading CRM alternatives in key metrics
              </p>
              <p className="text-sm text-gray-400 max-w-2xl mx-auto">
                Based on industry analysis and customer satisfaction data
              </p>
            </motion.div>
          </AnimatedSection>

          {/* Competitive Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 p-6 bg-gray-800/80 border-b border-gray-700">
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

              {/* Comparison Rows */}
              {[
                {
                  metric: 'Sales Cycle Time',
                  salesforce: { score: 9, label: 'Excellent' },
                  hubspot: { score: 8, label: 'Very Good' },
                  zoho: { score: 8, label: 'Very Good' },
                  freshworks: { score: 8, label: 'Very Good' },
                  odoo: { score: 7, label: 'Good' }
                },
                {
                  metric: 'Implementation Time',
                  salesforce: { score: 6, label: 'Complex' },
                  hubspot: { score: 9, label: 'Very Fast' },
                  zoho: { score: 8, label: 'Fast' },
                  freshworks: { score: 9, label: 'Very Fast' },
                  odoo: { score: 7, label: 'Moderate' }
                },
                {
                  metric: 'Customizability',
                  salesforce: { score: 10, label: 'Limitless' },
                  hubspot: { score: 7, label: 'Good' },
                  zoho: { score: 8, label: 'Very Good' },
                  freshworks: { score: 7, label: 'Good' },
                  odoo: { score: 9, label: 'Excellent' }
                },
                {
                  metric: 'Ease of Use',
                  salesforce: { score: 6, label: 'Learning Curve' },
                  hubspot: { score: 9, label: 'Intuitive' },
                  zoho: { score: 8, label: 'User-Friendly' },
                  freshworks: { score: 9, label: 'Simple' },
                  odoo: { score: 7, label: 'Moderate' }
                },
                {
                  metric: 'Integration & Ecosystem',
                  salesforce: { score: 10, label: '5,000+ Apps' },
                  hubspot: { score: 8, label: '1,000+ Apps' },
                  zoho: { score: 8, label: 'Good Suite' },
                  freshworks: { score: 7, label: 'Growing' },
                  odoo: { score: 9, label: 'All-in-One' }
                },
                {
                  metric: 'Scalability',
                  salesforce: { score: 10, label: 'Enterprise+' },
                  hubspot: { score: 8, label: 'Mid-Market' },
                  zoho: { score: 8, label: 'Mid-Market' },
                  freshworks: { score: 7, label: 'SMB-Mid' },
                  odoo: { score: 9, label: 'Flexible' }
                },
                {
                  metric: 'Cost Effectiveness',
                  salesforce: { score: 6, label: 'Premium' },
                  hubspot: { score: 7, label: 'Moderate' },
                  zoho: { score: 9, label: 'Affordable' },
                  freshworks: { score: 9, label: 'Budget' },
                  odoo: { score: 10, label: 'Low Cost' }
                },
                {
                  metric: 'ROI Potential',
                  salesforce: { score: 10, label: '251% ROI' },
                  hubspot: { score: 8, label: '150% ROI' },
                  zoho: { score: 7, label: '120% ROI' },
                  freshworks: { score: 7, label: '110% ROI' },
                  odoo: { score: 8, label: '140% ROI' }
                }
              ].map((row, index) => (
                <motion.div
                  key={row.metric}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="grid grid-cols-6 gap-4 p-6 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/30 transition-colors duration-200"
                >
                  <div className="col-span-1 flex items-center">
                    <span className="text-white font-medium">{row.metric}</span>
                  </div>
                  {[row.salesforce, row.hubspot, row.zoho, row.freshworks, row.odoo].map((item, idx) => (
                    <div key={idx} className="col-span-1 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.floor(item.score / 2) 
                                ? idx === 0 ? 'bg-cyan-400' : 'bg-yellow-400'
                                : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className={`text-xs font-semibold ${idx === 0 ? 'text-cyan-400' : 'text-gray-300'}`}>
                        {item.score}/10
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                    </div>
                  ))}
                </motion.div>
              ))}
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Salesforce', roi: '251%', color: 'text-cyan-400', bgColor: 'bg-cyan-400' },
                { name: 'HubSpot', roi: '150%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Odoo', roi: '140%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Zoho', roi: '120%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
                { name: 'Freshworks', roi: '110%', color: 'text-gray-400', bgColor: 'bg-gray-400' }
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
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {selectedIndustryData 
                  ? `Let's build your Salesforce solution for ${selectedIndustryData.name}`
                  : 'Discover how Salesforce can revolutionize your business operations'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/salesforce-power-lead-capture">
                  <Button variant="primary" size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    {t('hero.cta')}
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
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => {
                    navigator.vibrate?.(100);
                    const url = selectedIndustry 
                      ? `/salesforce-comparison?industry=${selectedIndustry}&lang=${language}`
                      : `/salesforce-comparison?lang=${language}`;
                    window.open(url, '_blank');
                  }}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
                >
                  <Share2 className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('table.share')}
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
    </div>
  );
};

export default SalesforcePower;
