
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BarChart3, Users, Zap,
  Code, Palette, Users2, Headphones, Wrench, MessageSquare, 
  Settings, UserCheck, Briefcase, Lightbulb, 
  Globe, Database, Shield as ShieldIcon, Star, Target, Award, TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";
import BlogShifter from "../components/BlogShifter";

const Home = () => {
  // State for animated hero
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [isAutoPlaying] = useState(true);

  // Team members data for hero visuals - Ordered as requested with role-specific icons and descriptions
  const teamMembers = [
    { 
      id: 5, name: "Mina Michel", role: "Founder of Cloudastick Systems", 
      image: "/Assets/Company Members/Mina_Michel_Founder_of_Cloudastick_Systems.png",
      icons: [Star, Lightbulb],
      hoverElements: ["Vision", "Leadership"],
      color: "from-yellow-400 to-orange-500",
      description: "Leading Cloudastick's vision as a trusted Salesforce partner, Mina drives innovation in the ecosystem while building lasting relationships with clients across the Middle East and Africa."
    },
    { 
      id: 9, name: "Mireille Rafik", role: "Marketing Cloud Consultant", 
      image: "/Assets/Company Members/Mireille_Rafik_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: ["Campaigns", "Analytics"],
      color: "from-pink-400 to-purple-500",
      description: "Specializing in Salesforce Marketing Cloud, Mireille helps businesses create personalized customer journeys and drive engagement through data-driven marketing automation strategies."
    },
    { 
      id: 12, name: "Omar El Borae", role: "Customer Success Manager", 
      image: "/Assets/Company Members/Omar_El_Borae_Customer_Success_Manager.png",
      icons: [Headphones, UserCheck],
      hoverElements: ["Support", "Success"],
      color: "from-green-400 to-teal-500",
      description: "Ensuring customer success in the Salesforce ecosystem, Omar works closely with clients to maximize their platform investment and achieve their business transformation goals."
    },
    { 
      id: 10, name: "Carine Felix", role: "Brand and People Experience Specialist", 
      image: "/Assets/Company Members/Carine_Felix_Brand_and_People_Experience_Specialist.png",
      icons: [Palette, Users2],
      hoverElements: ["Brand", "Culture"],
      color: "from-purple-400 to-pink-500",
      description: "Shaping Cloudastick's culture and brand experience, Carine ensures our Salesforce partner services reflect our commitment to excellence and human-centered approach."
    },
    { 
      id: 6, name: "Luay Aladin", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Luay_Aladin_Salesforce_Consultant.png",
      icons: [Code, Settings],
      hoverElements: ["Development", "Configuration"],
      color: "from-blue-400 to-cyan-500",
      description: "Expert in Salesforce development and configuration, Luay delivers custom solutions that extend the platform's capabilities to meet unique business requirements."
    },
    { 
      id: 11, name: "Shady Thomas", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Shady_Thomas_Salesforce_Consultant.png",
      icons: [Wrench, Database],
      hoverElements: ["Integration", "Data"],
      color: "from-indigo-400 to-blue-500",
      description: "Specializing in Salesforce integrations and data management, Shady connects disparate systems and ensures seamless data flow across the entire business ecosystem."
    },
    { 
      id: 3, name: "Ashraf Rezk", role: "Head of Tech", 
      image: "/Assets/Company Members/Ashraf_Rezk_Head_of_Tech.png",
      icons: [ShieldIcon, Globe],
      hoverElements: ["Security", "Architecture"],
      color: "from-red-400 to-orange-500",
      description: "Leading Cloudastick's technical strategy, Ashraf ensures our Salesforce implementations follow best practices for security, scalability, and enterprise architecture."
    },
    { 
      id: 2, name: "Martin Ashraf", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Martin_Ashraf_Salesforce_Consultant.png",
      icons: [Target, TrendingUp],
      hoverElements: ["Strategy", "Growth"],
      color: "from-emerald-400 to-green-500",
      description: "Focused on strategic Salesforce implementations, Martin helps businesses align their CRM strategy with growth objectives and optimize their sales processes."
    },
    { 
      id: 14, name: "Ahmed Salah", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Ahmed_Salah_Salesforce_Consultant.png",
      icons: [Award, Briefcase],
      hoverElements: ["Excellence", "Delivery"],
      color: "from-amber-400 to-yellow-500",
      description: "Delivering excellence in Salesforce consulting, Ahmed ensures every implementation meets the highest standards of quality and delivers measurable business value."
    },
    { 
      id: 16, name: "Maheen Imran", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Maheen_Imran_Salesforce_Consultant.png",
      icons: [Users, Zap],
      hoverElements: ["Collaboration", "Innovation"],
      color: "from-cyan-400 to-blue-500",
      description: "Driving innovation through collaborative Salesforce solutions, Maheen works with cross-functional teams to deliver transformative customer experiences."
    },
    { 
      id: 1, name: "Fady Maged", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Fady_Maged_Salesforce_Consultant.png",
      icons: [Code, BarChart3],
      hoverElements: ["Development", "Analytics"],
      color: "from-violet-400 to-purple-500",
      description: "Combining development expertise with analytics insights, Fady creates powerful Salesforce solutions that provide actionable business intelligence and reporting."
    },
    { 
      id: 4, name: "Andrew Osama", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Andrew_Osama_Salesforce_Consultant.png",
      icons: [Settings, Wrench],
      hoverElements: ["Configuration", "Customization"],
      color: "from-teal-400 to-cyan-500",
      description: "Expert in Salesforce configuration and customization, Andrew tailors the platform to fit unique business processes and workflow requirements."
    },
    { 
      id: 7, name: "Abdullah", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Abdullah_Salesforce_Consultant.png",
      icons: [Database, Globe],
      hoverElements: ["Data Management", "Integration"],
      color: "from-orange-400 to-red-500",
      description: "Specializing in data management and global integrations, Abdullah ensures seamless connectivity between Salesforce and enterprise systems worldwide."
    },
    { 
      id: 8, name: "Farida Esam", role: "Marketing Cloud Consultant", 
      image: "/Assets/Company Members/Farida_Esam_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: ["Email Marketing", "Campaigns"],
      color: "from-rose-400 to-pink-500",
      description: "Focused on Marketing Cloud excellence, Farida designs and executes sophisticated email marketing campaigns that drive customer engagement and ROI."
    },
    { 
      id: 13, name: "Andrea Makary", role: "Technical Architect", 
      image: "/Assets/Company Members/Andrea_Makary_Technical_Architect.png",
      icons: [ShieldIcon, Globe],
      hoverElements: ["Architecture", "Security"],
      color: "from-slate-400 to-gray-500",
      description: "Designing enterprise-grade Salesforce architectures, Andrea ensures scalable, secure, and maintainable solutions that support long-term business growth."
    },
    { 
      id: 15, name: "Mariam Mamdouh", role: "Project Manager", 
      image: "/Assets/Company Members/Mariam_Mamdouh_Project_Manager.png",
      icons: [Briefcase, Target],
      hoverElements: ["Project Delivery", "Timeline"],
      color: "from-lime-400 to-green-500",
      description: "Ensuring successful project delivery, Mariam coordinates complex Salesforce implementations while maintaining timelines, budgets, and stakeholder satisfaction."
    }
  ];

  // Auto-cycling logic
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentMemberIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, teamMembers.length]);



  const currentMember = teamMembers[currentMemberIndex];

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into your business performance with our comprehensive analytics dashboard.",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Manage your customer relationships with powerful tools designed for modern businesses.",
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate your workflows and save time with our intelligent automation features.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-center lg:text-left"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMemberIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                    Meet {currentMember.name.split(' ')[0]}
                  </h1>
                  <h2 className="text-2xl md:text-4xl font-light mb-4 text-foreground">
                    {currentMember.role}
                  </h2>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                    {currentMember.description}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/contact">
                  <Button variant="primary" size="lg">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    Meet the Full Team
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Side - Animated Team Member */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-full blur-3xl scale-150"></div>
                
                {/* Team member image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMemberIndex}
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-brand-primary/30 shadow-2xl">
                      <img 
                        src={currentMember.image} 
                        alt={currentMember.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Role-specific floating icons */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-lg"
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      {React.createElement(currentMember.icons[0], { className: "w-8 h-8 text-white" })}
                    </motion.div>
                    
                    <motion.div
                      className="absolute -bottom-4 -left-4 w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center shadow-lg"
                      animate={{ 
                        y: [0, 10, 0],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      {React.createElement(currentMember.icons[1], { className: "w-6 h-6 text-white" })}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Why Cloudastick?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We've been a registered Salesforce.com partner since 2016, specializing in Salesforce cloud solutions and custom web development.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection
                key={feature.title}
                delay={index * 0.2}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay updated with the latest trends and insights in CRM and business automation.
            </p>
          </AnimatedSection>

          <BlogShifter />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can tailor our CRM solutions to your specific needs.
            </p>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
