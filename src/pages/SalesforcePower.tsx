import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import { salesforceProducts, getProductsByIndustry } from '../data/salesforceProducts';
import { erpIntegrations } from '../data/erpIntegrations';
import { industries, getIndustryById } from '../data/industries';

const SalesforcePower = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showPlatformOverview, setShowPlatformOverview] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  
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

  // Core products for platform overview
  const coreProducts = salesforceProducts.filter(p => p.category === 'Core');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Beyond CRM - Complete Platform
              </span>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Discover the Full
                <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Power of Salesforce
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
                Choose your industry to explore how Salesforce transforms businesses beyond traditional CRM
              </p>
            </motion.div>

            {/* Industry Selection Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"
            >
              {industries.slice(0, 8).map((industry, index) => (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIndustrySelect(industry.id)}
                  className={`relative bg-gradient-to-br ${industry.gradient} rounded-2xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <industry.icon className="w-12 h-12 text-white mb-4 mx-auto" />
                    <h3 className="text-lg font-bold text-white mb-2">
                      {industry.shortName}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {industry.description.split('.')[0]}.
                    </p>
                  </div>
                  
                  <motion.div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </motion.div>
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
                More Than Just CRM
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Salesforce is a complete platform with specialized clouds for every business need
              </p>
            </motion.div>
          </AnimatedSection>

          {/* Hub and Spoke Visualization */}
          <div className="relative max-w-4xl mx-auto">
            {/* Center Hub */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                <img 
                  src="/Assets/Product Logos/salesforce.png" 
                  alt="Salesforce Platform" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </motion.div>

            {/* Product Spokes */}
            <div className="relative h-96">
              {coreProducts.map((product, index) => {
                const angle = (index * 360) / coreProducts.length;
                const radius = 150;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-20 h-20 bg-gradient-to-br ${product.gradient} rounded-xl flex items-center justify-center cursor-pointer shadow-lg group`}
                    >
                      <product.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    {/* Connection Line */}
                    <svg
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ zIndex: -1 }}
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2={-x}
                        y2={-y}
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        className="opacity-50"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>
                );
              })}
            </div>

            {/* Product Details Panel */}
            <AnimatePresence>
              {hoveredProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 max-w-md border border-gray-700"
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
          </div>

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
                Seamlessly Connects to Your Existing Systems
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Salesforce integrates with all major ERP systems for unified business operations
              </p>
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
                Data Cloud: Connect Everything
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                One unified view of your customer, regardless of where data lives
              </p>
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
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  {selectedIndustryData.description}
                </p>
              </motion.div>
            </AnimatedSection>

            {/* Industry Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {industryProducts.slice(0, 6).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`bg-gradient-to-br ${product.gradient} rounded-2xl p-6 group`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-white/80 text-sm mb-4">{product.description}</p>
                      <div className="space-y-1">
                        {product.keyFeatures.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-white/90">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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

      {/* Why Salesforce Comparison */}
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
                Why Choose Salesforce?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how Salesforce compares to traditional CRM solutions
              </p>
            </motion.div>
          </AnimatedSection>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Platform vs CRM',
                description: 'Complete platform vs basic CRM functionality',
                score: 10,
                icon: Settings
              },
              {
                title: 'Customization',
                description: 'AppExchange with 5,000+ apps vs limited options',
                score: 10,
                icon: Target
              },
              {
                title: 'Scalability',
                description: 'Startup to enterprise vs limited growth',
                score: 9,
                icon: TrendingUp
              },
              {
                title: 'Innovation',
                description: 'AI, automation, analytics built-in vs basic features',
                score: 10,
                icon: Brain
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(item.score / 2) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-cyan-400 font-bold ml-2">{item.score}/10</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
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
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
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
                  <RefreshCw className="mr-2 h-5 w-5" />
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
    </div>
  );
};

export default SalesforcePower;
