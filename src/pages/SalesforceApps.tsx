import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MessageSquare, Filter, Clock, Users, Smartphone, Phone, Send, CheckCircle2, Zap, Sparkles, X, Play, CreditCard, DollarSign, Calculator, TrendingUp, FileText, Heart, ShieldCheck, Headphones, ClipboardList, Target, PieChart, BarChart3, LineChart, UserCheck, ChevronLeft, ChevronRight, Info, FileSignature, Languages, Share2, TrendingDown, Globe } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { ArrowRight } from "lucide-react";

const SalesforceApps = () => {
  const [activeVideoModal, setActiveVideoModal] = useState<number | null>(null);
  const [showAppModal, setShowAppModal] = useState<number | null>(null);
  const vipCarouselRef = useRef<HTMLDivElement>(null);
  const partnerCarouselRef = useRef<HTMLDivElement>(null);

  const apps = [
    {
      icon: Calendar,
      title: "Advanced Sleek Calendar",
      tagline: "Google Calendar meets Salesforce",
      description: "A powerful, modern calendar solution that brings the familiar Google Calendar experience directly into your Salesforce environment.",
      gradient: "from-purple-500 to-pink-600",
      videoEmbed: null,
      category: "Productivity",
      features: [
        {
          icon: Calendar,
          title: "Responsive Calendar Interface",
          description: "Beautiful, intuitive calendar design that works seamlessly across all devices"
        },
        {
          icon: Zap,
          title: "Universal Object Support",
          description: "Log activities on any Salesforce object - Leads, Contacts, Accounts, Opportunities, and custom objects"
        },
        {
          icon: Clock,
          title: "Smart Follow-up Scheduling",
          description: "Easily schedule follow-up activities with drag-and-drop functionality"
        },
        {
          icon: Sparkles,
          title: "Customizable Visual Design",
          description: "Personalize your calendar view with color-coding and visual representations for maximum productivity"
        },
        {
          icon: Filter,
          title: "Advanced Filtering",
          description: "Filter by activity type, customer type, assigned user, status, and more"
        },
        {
          icon: Users,
          title: "Timeline View",
          description: "Advanced timeline visualization to see your activities across time and teams"
        }
      ]
    },
    {
      icon: MessageSquare,
      title: "Omnichannel Messenger",
      tagline: "Connect anywhere, track everything",
      description: "Unified outbound communication platform that connects your team with customers across multiple channels while automatically logging every interaction.",
      gradient: "from-cyan-500 to-blue-600",
      videoEmbed: "https://player.vimeo.com/video/1127501430?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1",
      category: "Communication",
      features: [
        {
          icon: Phone,
          title: "Multi-Channel Communication",
          description: "Reach Leads, Contacts, Account holders, and Opportunity stakeholders via WhatsApp, Signal, Botim, and FaceTime"
        },
        {
          icon: Send,
          title: "Seamless Outbound Messaging",
          description: "Initiate conversations directly from Salesforce records without switching apps"
        },
        {
          icon: CheckCircle2,
          title: "Automatic Interaction Logging",
          description: "Every message, call, and interaction is automatically logged to the relevant Salesforce record"
        },
        {
          icon: Users,
          title: "Smart Contact Management",
          description: "Intelligent routing and contact selection based on record relationships"
        },
        {
          icon: Zap,
          title: "Real-time Sync",
          description: "Instant synchronization of communication history across your team"
        },
        {
          icon: Smartphone,
          title: "Mobile-First Design",
          description: "Optimized for mobile use while maintaining full desktop functionality"
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Plan Engine",
      tagline: "Flexible payment solutions for any business",
      description: "Comprehensive payment plan management system designed for Real Estate, Automotive, and other verticals requiring flexible installment solutions.",
      gradient: "from-emerald-500 to-teal-600",
      videoEmbed: null,
      category: "Finance",
      features: [
        {
          icon: Calculator,
          title: "Automated Payment Calculations",
          description: "Automatically calculate payment schedules, interest rates, and installment amounts"
        },
        {
          icon: DollarSign,
          title: "Flexible Plan Configuration",
          description: "Create custom payment plans tailored to your business needs and customer requirements"
        },
        {
          icon: TrendingUp,
          title: "Multi-Vertical Support",
          description: "Perfect for Real Estate, Automotive, and other industries requiring payment plans"
        },
        {
          icon: FileText,
          title: "Contract Management",
          description: "Generate and manage payment contracts with automated terms and conditions"
        },
        {
          icon: CheckCircle2,
          title: "Payment Tracking",
          description: "Track payment status, overdue amounts, and upcoming installments in real-time"
        },
        {
          icon: Zap,
          title: "Automated Reminders",
          description: "Send automated payment reminders and notifications to customers"
        }
      ]
    },
    {
      icon: Heart,
      title: "Patient Support Program",
      tagline: "Comprehensive care management for pharma",
      description: "Advanced patient support program management solution designed specifically for pharmaceutical companies to deliver exceptional patient care and outcomes.",
      gradient: "from-rose-500 to-pink-600",
      videoEmbed: null,
      category: "Healthcare",
      features: [
        {
          icon: Heart,
          title: "Patient Journey Tracking",
          description: "Monitor and manage complete patient journey from enrollment to program completion"
        },
        {
          icon: ShieldCheck,
          title: "Compliance Management",
          description: "Ensure HIPAA and regulatory compliance with built-in security and privacy controls"
        },
        {
          icon: Headphones,
          title: "Multi-Channel Support",
          description: "Provide patient support through phone, email, SMS, and patient portals"
        },
        {
          icon: ClipboardList,
          title: "Medication Adherence",
          description: "Track medication adherence and send timely reminders to improve patient outcomes"
        },
        {
          icon: Users,
          title: "Care Team Coordination",
          description: "Enable seamless collaboration between healthcare providers, nurses, and support staff"
        },
        {
          icon: BarChart3,
          title: "Outcomes Analytics",
          description: "Measure program effectiveness with comprehensive reporting and analytics"
        }
      ]
    },
    {
      icon: Target,
      title: "Segmentation & Activity Plan Engine",
      tagline: "Precision targeting for pharmaceutical excellence",
      description: "Intelligent segmentation and activity planning engine built for pharmaceutical sales and marketing teams to optimize HCP engagement and maximize ROI.",
      gradient: "from-indigo-500 to-purple-600",
      videoEmbed: null,
      category: "Analytics",
      features: [
        {
          icon: Target,
          title: "Smart HCP Segmentation",
          description: "Automatically segment healthcare professionals based on prescribing patterns, specialty, and engagement"
        },
        {
          icon: LineChart,
          title: "Predictive Analytics",
          description: "Use AI-powered insights to identify high-value targets and optimize resource allocation"
        },
        {
          icon: Calendar,
          title: "Activity Planning",
          description: "Create and manage detailed activity plans with automated scheduling and routing"
        },
        {
          icon: PieChart,
          title: "Territory Management",
          description: "Optimize territory allocation and balance workload across sales representatives"
        },
        {
          icon: UserCheck,
          title: "Call Planning",
          description: "Intelligent call planning with frequency optimization and next-best-action recommendations"
        },
        {
          icon: BarChart3,
          title: "Performance Tracking",
          description: "Real-time tracking of activities, KPIs, and ROI across all channels and touchpoints"
        }
      ]
    },
    {
      icon: FileText,
      title: "Opero Document Generator",
      tagline: "Generate documents in English & Arabic",
      description: "Powerful document generation solution with full English and Arabic language support. Create professional documents directly from Salesforce with dynamic templates.",
      gradient: "from-blue-500 to-indigo-600",
      videoEmbed: null,
      category: "Partner Apps",
      features: [
        {
          icon: Languages,
          title: "Bilingual Support",
          description: "Full support for both English and Arabic document generation with RTL text support"
        },
        {
          icon: FileText,
          title: "Dynamic Templates",
          description: "Create and customize document templates with merge fields from any Salesforce object"
        },
        {
          icon: Zap,
          title: "Automated Generation",
          description: "Automatically generate documents based on workflows, triggers, or manual actions"
        },
        {
          icon: CheckCircle2,
          title: "Multiple Formats",
          description: "Export documents in PDF, Word, and other popular formats"
        },
        {
          icon: Users,
          title: "Batch Processing",
          description: "Generate multiple documents at once for mass communications and reporting"
        },
        {
          icon: ShieldCheck,
          title: "Version Control",
          description: "Track document versions and maintain audit trails for compliance"
        }
      ]
    },
    {
      icon: FileSignature,
      title: "Opero E-signature",
      tagline: "Digital signatures in English & Arabic",
      description: "Streamlined electronic signature solution with full bilingual support. Secure, legally binding signatures integrated directly into your Salesforce workflow.",
      gradient: "from-violet-500 to-purple-600",
      videoEmbed: null,
      category: "Partner Apps",
      features: [
        {
          icon: Languages,
          title: "Arabic & English Support",
          description: "Complete bilingual interface and document support for both English and Arabic"
        },
        {
          icon: FileSignature,
          title: "Secure E-signatures",
          description: "Legally binding electronic signatures with encryption and authentication"
        },
        {
          icon: Smartphone,
          title: "Mobile Signing",
          description: "Sign documents on any device - desktop, tablet, or mobile"
        },
        {
          icon: Clock,
          title: "Real-time Tracking",
          description: "Track document status, view signing progress, and receive instant notifications"
        },
        {
          icon: ShieldCheck,
          title: "Audit Trail",
          description: "Complete audit trail with timestamps, IP addresses, and signer authentication"
        },
        {
          icon: Zap,
          title: "Salesforce Integration",
          description: "Seamlessly integrated with Salesforce records, workflows, and processes"
        }
      ]
    },
    {
      icon: Share2,
      title: "Konnect Insights",
      tagline: "Social media intelligence & engagement",
      description: "Advanced social media content management system with intelligent Case/Lead integration and comprehensive competitor performance analysis.",
      gradient: "from-orange-500 to-red-600",
      videoEmbed: null,
      category: "Partner Apps",
      features: [
        {
          icon: Share2,
          title: "Social Media CMS",
          description: "Manage all your social media content from one centralized platform"
        },
        {
          icon: MessageSquare,
          title: "Case & Lead Integration",
          description: "Automatically convert social media interactions into Salesforce Cases and Leads"
        },
        {
          icon: TrendingUp,
          title: "Competitor Analysis",
          description: "Compare your social media performance against competitors with detailed analytics"
        },
        {
          icon: Users,
          title: "Multi-Channel Support",
          description: "Monitor and engage across all major social media platforms"
        },
        {
          icon: BarChart3,
          title: "Performance Analytics",
          description: "Track engagement metrics, sentiment analysis, and campaign performance"
        },
        {
          icon: Globe,
          title: "Brand Monitoring",
          description: "Real-time brand mention tracking and sentiment analysis across social channels"
        }
      ]
    }
  ];

  const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                VIP Exclusive Apps
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Cloudastick
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                VIP Apps Store
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Browse our premium collection of Salesforce applications
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* VIP Apps Carousel */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Cloudastick VIP Apps</h2>
            <p className="text-gray-400">Exclusive apps built by Cloudastick for Salesforce excellence</p>
          </div>

          <div className="relative group">
            {/* Carousel Navigation Buttons */}
            <button
              onClick={() => scroll('left', vipCarouselRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={() => scroll('right', vipCarouselRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={vipCarouselRef}
              className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pb-4 cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={(e) => {
                const ele = e.currentTarget;
                ele.style.cursor = 'grabbing';
                const startX = e.pageX - ele.offsetLeft;
                const scrollLeft = ele.scrollLeft;

                const handleMouseMove = (e: MouseEvent) => {
                  const x = e.pageX - ele.offsetLeft;
                  const walk = (x - startX) * 2;
                  ele.scrollLeft = scrollLeft - walk;
                };

                const handleMouseUp = () => {
                  ele.style.cursor = 'grab';
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              {apps.filter(app => app.category !== "Partner Apps").map((app, index) => {
                const originalIndex = apps.indexOf(app);
                return (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-80 group/card"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full"
                  >
                    {/* App Card */}
                    <div className={`relative bg-gradient-to-br ${app.gradient} rounded-2xl overflow-hidden shadow-2xl h-[450px]`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col p-8">
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            {app.category}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className="mb-6">
                          {app.videoEmbed ? (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoModal(originalIndex);
                              }}
                              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center relative cursor-pointer"
                            >
                              <app.icon className="w-10 h-10 text-white" />
                              <motion.div
                                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                              >
                                <Play className="w-8 h-8 text-white" />
                              </motion.div>
                            </motion.div>
                          ) : (
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <img 
                                src="/Assets/Company Logos/white-logo-dark.webp" 
                                alt="Cloudastick Logo" 
                                className="w-16 h-16 object-contain p-2"
                              />
                            </div>
                          )}
                        </div>

                        {/* Title & Tagline */}
                        <div className="flex-grow">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {app.title}
                          </h3>
                          <p className="text-white/90 text-sm mb-4">
                            {app.tagline}
                          </p>
                          <p className="text-white/70 text-sm line-clamp-3">
                            {app.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAppModal(originalIndex);
                          }}
                          className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Info className="w-4 h-4" />
                          More Info
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Apps Carousel */}
      <section className="py-12 relative bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Partner Apps</h2>
            <p className="text-gray-400">Powerful integrations from our trusted partners</p>
          </div>

          <div className="relative group">
            {/* Carousel Navigation Buttons */}
            <button
              onClick={() => scroll('left', partnerCarouselRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={() => scroll('right', partnerCarouselRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/90 hover:bg-gray-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={partnerCarouselRef}
              className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pb-4 cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={(e) => {
                const ele = e.currentTarget;
                ele.style.cursor = 'grabbing';
                const startX = e.pageX - ele.offsetLeft;
                const scrollLeft = ele.scrollLeft;

                const handleMouseMove = (e: MouseEvent) => {
                  const x = e.pageX - ele.offsetLeft;
                  const walk = (x - startX) * 2;
                  ele.scrollLeft = scrollLeft - walk;
                };

                const handleMouseUp = () => {
                  ele.style.cursor = 'grab';
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              {apps.filter(app => app.category === "Partner Apps").map((app, index) => {
                const originalIndex = apps.indexOf(app);
                return (
                <motion.div
                  key={app.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-80 group/card"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full"
                  >
                    {/* App Card */}
                    <div className={`relative bg-gradient-to-br ${app.gradient} rounded-2xl overflow-hidden shadow-2xl h-[450px]`}>
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="relative h-full flex flex-col p-8">
                        {/* Category Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                            {app.category}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className="mb-6">
                          {app.videoEmbed ? (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveVideoModal(originalIndex);
                              }}
                              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center relative cursor-pointer"
                            >
                              <app.icon className="w-10 h-10 text-white" />
                              <motion.div
                                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                              >
                                <Play className="w-8 h-8 text-white" />
                              </motion.div>
                            </motion.div>
                          ) : (
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <img 
                                src="/Assets/Company Logos/white-logo-dark.webp" 
                                alt="Cloudastick Logo" 
                                className="w-16 h-16 object-contain p-2"
                              />
                            </div>
                          )}
                        </div>

                        {/* Title & Tagline */}
                        <div className="flex-grow">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {app.title}
                          </h3>
                          <p className="text-white/90 text-sm mb-4">
                            {app.tagline}
                          </p>
                          <p className="text-white/70 text-sm line-clamp-3">
                            {app.description}
                          </p>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAppModal(originalIndex);
                          }}
                          className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Info className="w-4 h-4" />
                          More Info
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )})}
            </div>
          </div>
        </div>
      </section>

      {/* App Info Modal */}
      <AnimatePresence>
        {showAppModal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowAppModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowAppModal(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-br ${apps[showAppModal].gradient} px-8 py-8`}>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      {apps[showAppModal].videoEmbed ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="relative w-full h-full flex items-center justify-center"
                        >
                          {React.createElement(apps[showAppModal].icon, { className: "w-10 h-10 text-white" })}
                        </motion.div>
                      ) : (
                        <img 
                          src="/Assets/Company Logos/white-logo-dark.webp" 
                          alt="Cloudastick Logo" 
                          className="w-16 h-16 object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white mb-3">
                        {apps[showAppModal].category}
                      </span>
                      <h2 className="text-4xl font-bold text-white mb-2">
                        {apps[showAppModal].title}
                      </h2>
                      <p className="text-xl text-white/90 mb-3">
                        {apps[showAppModal].tagline}
                      </p>
                      <p className="text-white/80 text-base leading-relaxed">
                        {apps[showAppModal].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Section */}
                {apps[showAppModal].videoEmbed && (
                  <div className="bg-black">
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        src={apps[showAppModal].videoEmbed}
                        className="absolute inset-0 w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title={apps[showAppModal].title}
                      />
                    </div>
                  </div>
                )}

                {/* Features Section */}
                <div className="px-8 py-8 bg-gray-800/50">
                  <h3 className="text-2xl font-bold text-white mb-6">Key Features</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps[showAppModal].features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${apps[showAppModal].gradient} rounded-lg flex items-center justify-center mb-4`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA Footer */}
                <div className={`bg-gradient-to-r ${apps[showAppModal].gradient} px-8 py-6`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">
                        Interested in {apps[showAppModal].title}?
                      </h4>
                      <p className="text-white/80 text-sm">
                        Contact us to learn more or request a demo
                      </p>
                    </div>
                    <Link to="/contact" onClick={() => setShowAppModal(null)}>
                      <Button variant="secondary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                        Get in Touch
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Salesforce?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the VIP program and get exclusive access to our premium Salesforce applications
            </p>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Get VIP Access Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoModal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setActiveVideoModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveVideoModal(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* App Title */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  {React.createElement(apps[activeVideoModal].icon, { className: "w-8 h-8" })}
                  {apps[activeVideoModal].title}
                </h3>
                <p className={`text-sm bg-gradient-to-r ${apps[activeVideoModal].gradient} bg-clip-text text-transparent mt-1`}>
                  {apps[activeVideoModal].tagline}
                </p>
              </div>

              {/* Video Container */}
              <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
                <iframe
                  src={apps[activeVideoModal].videoEmbed || ''}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={apps[activeVideoModal].title}
                />
              </div>

              {/* App Description */}
              <div className="px-6 py-4 bg-gray-800/50">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {apps[activeVideoModal].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SalesforceApps;
