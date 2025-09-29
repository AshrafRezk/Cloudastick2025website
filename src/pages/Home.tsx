
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, BarChart3, Users, Zap, ChevronLeft, ChevronRight,
  Code, Palette, Users2, Headphones, Wrench, MessageSquare, 
  Settings, UserCheck, Briefcase, Lightbulb, 
  Globe, Database, Shield as ShieldIcon, Star, Target, Award
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

  // Team members data for hero visuals - Ordered as requested with role-specific icons
  const teamMembers = [
    { 
      id: 5, name: "Mina Michel", role: "Founder of Cloudastick Systems", 
      image: "/Assets/Company Members/Mina_Michel_Founder_of_Cloudastick_Systems.png",
      icons: [Star, Lightbulb],
      hoverElements: ["Vision", "Leadership"],
      color: "from-yellow-400 to-orange-500"
    },
    { 
      id: 9, name: "Mireille Rafik", role: "Marketing Cloud Consultant", 
      image: "/Assets/Company Members/Mireille_Rafik_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: ["Campaigns", "Analytics"],
      color: "from-pink-400 to-purple-500"
    },
    { 
      id: 12, name: "Omar El Borae", role: "Customer Success Manager", 
      image: "/Assets/Company Members/Omar_El_Borae_Customer_Success_Manager.png",
      icons: [Headphones, UserCheck],
      hoverElements: ["Support", "Success"],
      color: "from-green-400 to-teal-500"
    },
    { 
      id: 10, name: "Carine Felix", role: "Brand and People Experience Specialist", 
      image: "/Assets/Company Members/Carine_Felix_Brand_and_People_Experience_Specialist.png",
      icons: [Palette, Users2],
      hoverElements: ["Brand", "Culture"],
      color: "from-purple-400 to-pink-500"
    },
    { 
      id: 6, name: "Luay Aladin", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Luay_Aladin_Salesforce_Consultant.png",
      icons: [Code, Settings],
      hoverElements: ["Development", "Configuration"],
      color: "from-blue-400 to-cyan-500"
    },
    { 
      id: 11, name: "Shady Thomas", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Shady_Thomas_Salesforce_Consultant.png",
      icons: [Wrench, Database],
      hoverElements: ["Integration", "Data"],
      color: "from-indigo-400 to-blue-500"
    },
    { 
      id: 3, name: "Ashraf Rezk", role: "Head of Tech", 
      image: "/Assets/Company Members/Ashraf_Rezk_Head_of_Tech.png",
      icons: [ShieldIcon, Globe],
      hoverElements: ["Security", "Architecture"],
      color: "from-red-400 to-orange-500"
    },
    { 
      id: 2, name: "Martin Ashraf", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Martin_Ashraf_Salesforce_Consultant.png",
      icons: [Target, TrendingUp],
      hoverElements: ["Strategy", "Growth"],
      color: "from-emerald-400 to-green-500"
    },
    { 
      id: 14, name: "Ahmed Salah", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Ahmed_Salah_Salesforce_Consultant.png",
      icons: [Award, Briefcase],
      hoverElements: ["Excellence", "Delivery"],
      color: "from-amber-400 to-yellow-500"
    },
    { 
      id: 16, name: "Maheen Imran", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Maheen_Imran_Salesforce_Consultant.png",
      icons: [Users, Zap],
      hoverElements: ["Collaboration", "Innovation"],
      color: "from-cyan-400 to-blue-500"
    },
    { 
      id: 1, name: "Fady Maged", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Fady_Maged_Salesforce_Consultant.png",
      icons: [Code, BarChart3],
      hoverElements: ["Development", "Analytics"],
      color: "from-violet-400 to-purple-500"
    },
    { 
      id: 4, name: "Andrew Osama", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Andrew_Osama_Salesforce_Consultant.png",
      icons: [Settings, Wrench],
      hoverElements: ["Configuration", "Customization"],
      color: "from-teal-400 to-cyan-500"
    },
    { 
      id: 7, name: "Abdullah", role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Abdullah_Salesforce_Consultant.png",
      icons: [Database, Globe],
      hoverElements: ["Data Management", "Integration"],
      color: "from-orange-400 to-red-500"
    },
    { 
      id: 8, name: "Farida Esam", role: "Marketing Cloud Consultant", 
      image: "/Assets/Company Members/Farida_Esam_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: ["Email Marketing", "Campaigns"],
      color: "from-rose-400 to-pink-500"
    },
    { 
      id: 13, name: "Andrea Makary", role: "Technical Architect", 
      image: "/Assets/Company Members/Andrea_Makary_Technical_Architect.png",
      icons: [ShieldIcon, Globe],
      hoverElements: ["Architecture", "Security"],
      color: "from-slate-400 to-gray-500"
    },
    { 
      id: 15, name: "Mariam Mamdouh", role: "Project Manager", 
      image: "/Assets/Company Members/Mariam_Mamdouh_Project_Manager.png",
      icons: [Briefcase, Target],
      hoverElements: ["Project Delivery", "Timeline"],
      color: "from-lime-400 to-green-500"
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

  // Navigation functions
  const nextMember = () => {
    setCurrentMemberIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentMemberIndex((prevIndex) => (prevIndex - 1 + teamMembers.length) % teamMembers.length);
  };


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
                    From complex integrations to innovative solutions, our team delivers personalized Salesforce expertise that transforms your business.
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
                    
                    {/* Floating elements around the image */}
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
                      <Users className="w-8 h-8 text-white" />
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
                      <Zap className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={prevMember}
              className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-brand-primary/30 hover:bg-brand-primary/10 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-brand-primary" />
            </button>
            
            <button
              onClick={nextMember}
              className="p-3 rounded-full bg-background/80 backdrop-blur-sm border border-brand-primary/30 hover:bg-brand-primary/10 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 text-brand-primary" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMemberIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentMemberIndex
                    ? "bg-brand-primary scale-125"
                    : "bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Showcase Section */}
      <section className="py-16 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the Experts Behind Your Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our diverse team of Salesforce specialists brings years of experience and a human-centered approach to every project.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {teamMembers.slice(0, 12).map((member, index) => (
              <AnimatedSection
                key={member.id}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center cursor-pointer"
                >
                  <div className="relative mb-3">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 backdrop-blur-sm border border-brand-primary/30 p-1 shadow-lg group-hover:shadow-brand-primary/20 transition-all duration-300">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {/* Role-specific icons */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(member.icons[0], { className: "w-3 h-3 text-gray-700" })}
                    </div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {React.createElement(member.icons[1], { className: "w-3 h-3 text-gray-700" })}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {member.role}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link to="/about">
              <Button variant="outline" size="lg">
                Meet the Full Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </AnimatedSection>
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
