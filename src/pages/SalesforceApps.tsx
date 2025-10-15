import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MessageSquare, Filter, Clock, Users, Smartphone, Phone, Send, CheckCircle2, Zap, Sparkles, X, Play } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { ArrowRight } from "lucide-react";

const SalesforceApps = () => {
  const [activeVideoModal, setActiveVideoModal] = useState<number | null>(null);

  const apps = [
    {
      icon: Calendar,
      title: "Advanced Sleek Calendar",
      tagline: "Google Calendar meets Salesforce",
      description: "A powerful, modern calendar solution that brings the familiar Google Calendar experience directly into your Salesforce environment.",
      gradient: "from-purple-500 to-pink-600",
      videoEmbed: null, // Add video embed URL here when available
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-800 via-gray-900 to-black overflow-hidden">
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
              Cloudastick Salesforce
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                VIP Apps
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Premium applications that supercharge your Salesforce experience with cutting-edge features and seamless integration
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="primary" size="lg">
                  Request VIP Access
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Apps Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {apps.map((app, appIndex) => (
              <AnimatedSection key={app.title} delay={appIndex * 0.2}>
                <div className={`relative ${appIndex % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* App Header */}
                  <div className="text-center mb-12">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: app.videoEmbed ? 5 : 0 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => app.videoEmbed && setActiveVideoModal(appIndex)}
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-2xl mb-6 relative overflow-hidden ${
                        app.videoEmbed 
                          ? `bg-gradient-to-br ${app.gradient} cursor-pointer` 
                          : 'bg-gray-800 border-2 border-gray-700'
                      }`}
                    >
                      {app.videoEmbed ? (
                        <>
                          <app.icon className="w-10 h-10 text-white" />
                          <motion.div
                            className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Play className="w-8 h-8 text-white" />
                          </motion.div>
                        </>
                      ) : (
                        <img 
                          src="/Assets/Company Logos/white-logo-dark.webp" 
                          alt="Cloudastick Logo" 
                          className="w-16 h-16 object-contain p-2"
                        />
                      )}
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
                      {app.title}
                    </h2>
                    
                    <p className={`text-xl md:text-2xl font-light bg-gradient-to-r ${app.gradient} bg-clip-text text-transparent mb-4`}>
                      {app.tagline}
                    </p>
                    
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                      {app.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {app.features.map((feature, featureIndex) => (
                      <AnimatedSection
                        key={feature.title}
                        delay={featureIndex * 0.1}
                        className="group"
                      >
                        <motion.div
                          whileHover={{ y: -10, scale: 1.02 }}
                          className="h-full bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden"
                        >
                          {/* Gradient overlay on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                          
                          <div className="relative z-10">
                            <div className={`w-12 h-12 bg-gradient-to-br ${app.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <h3 className="text-lg font-semibold text-white mb-3">
                              {feature.title}
                            </h3>
                            
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose VIP Apps?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built by Salesforce experts, designed for power users
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Native Integration",
                description: "Built directly into Salesforce with no external dependencies",
                icon: Zap
              },
              {
                title: "Enterprise Ready",
                description: "Scalable solutions that grow with your business",
                icon: CheckCircle2
              },
              {
                title: "Always Updated",
                description: "Regular updates and new features included with VIP access",
                icon: Sparkles
              },
              {
                title: "Premium Support",
                description: "Dedicated support team ready to assist you",
                icon: Users
              }
            ].map((benefit, index) => (
              <AnimatedSection
                key={benefit.title}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="text-center p-6 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default SalesforceApps;

