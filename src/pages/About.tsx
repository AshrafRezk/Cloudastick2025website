
import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, Zap, Users, Eye, Shield, Target, Award, TrendingUp,
  Code, Palette, Users2, Headphones, Wrench, MessageSquare, 
  BarChart3, Settings, UserCheck, Briefcase, Lightbulb, 
  Globe, Database, Shield as ShieldIcon, Star
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

// Team member images with role-specific icons and hover elements
  const teamMembers = [
    { 
      name: "Mina Michel", 
      role: "Founder of Cloudastick Systems", 
      image: "/Assets/Company Members/Mina_Michel_Founder_of_Cloudastick_Systems.png",
      icons: [Star, Lightbulb],
      hoverElements: ["Vision", "Leadership"],
      color: "from-yellow-400 to-orange-500"
    },
    { 
      name: "Mireille Rafik", 
      role: "Marketing Cloud Consultant", 
      image: "/Assets/Company Members/Mireille_Rafik_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: ["Campaigns", "Analytics"],
      color: "from-pink-400 to-purple-500"
    },
    { 
      name: "Omar El Borae", 
      role: "Customer Success Manager", 
      image: "/Assets/Company Members/Omar_El_Borae_Customer_Success_Manager.png",
      icons: [Headphones, UserCheck],
      hoverElements: ["Support", "Success"],
      color: "from-green-400 to-teal-500"
    },
    { 
      name: "Carine Felix", 
      role: "Brand and People Experience Specialist", 
      image: "/Assets/Company Members/Carine_Felix_Brand_and_People_Experience_Specialist.png",
      icons: [Palette, Users2],
      hoverElements: ["Brand", "Culture"],
      color: "from-purple-400 to-pink-500"
    },
    { 
      name: "Luay Aladin", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Luay_Aladin_Salesforce_Consultant.png",
      icons: [Code, Settings],
      hoverElements: ["Development", "Configuration"],
      color: "from-blue-400 to-cyan-500"
    },
    { 
      name: "Shady Thomas", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Shady_Thomas_Salesforce_Consultant.png",
      icons: [Wrench, Database],
      hoverElements: ["Integration", "Data"],
      color: "from-indigo-400 to-blue-500"
    },
    { 
      name: "Ashraf Rezk", 
      role: "Head of Tech", 
      image: "/Assets/Company Members/Ashraf_Rezk_Head_of_Tech.png",
      icons: [ShieldIcon, Globe],
      hoverElements: ["Security", "Architecture"],
      color: "from-red-400 to-orange-500"
    },
    { 
      name: "Martin Ashraf", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Martin_Ashraf_Salesforce_Consultant.png",
      icons: [Target, TrendingUp],
      hoverElements: ["Strategy", "Growth"],
      color: "from-emerald-400 to-green-500"
    },
    { 
      name: "Ahmed Salah", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Ahmed_Salah_Salesforce_Consultant.png",
      icons: [Award, Briefcase],
      hoverElements: ["Excellence", "Delivery"],
      color: "from-amber-400 to-yellow-500"
    },
    { 
      name: "Maheen Imran", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Maheen_Imran_Salesforce_Consultant.png",
      icons: [Users, Zap],
      hoverElements: ["Collaboration", "Innovation"],
      color: "from-cyan-400 to-blue-500"
    },
    { 
      name: "Fady Maged", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Fady_Maged_Salesforce_Consultant.png",
      icons: [Code, BarChart3],
      hoverElements: ["Development", "Analytics"],
      color: "from-violet-400 to-purple-500"
    },
    { 
      name: "Andrew Osama", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Andrew_Osama_Salesforce_Consultant.png",
      icons: [Settings, Wrench],
      hoverElements: ["Configuration", "Customization"],
      color: "from-teal-400 to-cyan-500"
    },
    { 
      name: "Abdullah", 
      role: "Salesforce Consultant", 
      image: "/Assets/Company Members/Abdullah_Salesforce_Consultant.png",
      icons: [Database, Globe],
      hoverElements: ["Data Management", "Integration"],
      color: "from-orange-400 to-red-500"
    },
    { 
      name: "Farida Esam", 
      role: "Marketing Cloud Consultant", 
      image: "/Assets/Company Members/Farida_Esam_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: ["Email Marketing", "Campaigns"],
      color: "from-rose-400 to-pink-500"
    },
    { 
      name: "Andrea Makary", 
      role: "Technical Architect", 
      image: "/Assets/Company Members/Andrea_Makary_Technical_Architect.png",
      icons: [ShieldIcon, Globe],
      hoverElements: ["Architecture", "Security"],
      color: "from-slate-400 to-gray-500"
    },
    { 
      name: "Mariam Mamdouh", 
      role: "Project Manager", 
      image: "/Assets/Company Members/Mariam_Mamdouh_Project_Manager.png",
      icons: [Briefcase, Target],
      hoverElements: ["Project Delivery", "Timeline"],
      color: "from-lime-400 to-green-500"
    }
  ];

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Reverence",
      description: "We begin with respect. We respect the craft of technology and consulting, striving for excellence in every detail. We respect each other's views, knowing that diverse perspectives strengthen our solutions. We respect everyone in the Salesforce ecosystem including healthy competition because it drives us all forward. Most importantly, we deeply respect our customers, treating their trust as our greatest responsibility.",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Zap,
      title: "Efficiency",
      description: "We believe in doing things right and doing them smart. Efficiency means removing waste, optimizing processes, and ensuring our clients see measurable value from every engagement.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Users,
      title: "Inclusion",
      description: "We practice strategic inclusivity, every member, partner, and client is part of the same Cloudastick boat, moving forward together. We welcome and celebrate diverse operational ideas, skills, and viewpoints not only as a matter of fairness, but as a deliberate strategy to fuel creativity, strengthen collaboration, and ensure collective success.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We commit to clarity at every level. Internally, we practice open communication about all matters to ensure alignment and trust. Externally, we engage in proactive communication with our customers, keeping everyone in the know, anticipating questions, and ensuring there are no surprises.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: "Consistency",
      description: "We maintain and commit to what we do. At Cloudastick, we don't just start initiatives, we see them through to completion. Our consistency is about perseverance, reliability, and honoring our commitments, ensuring that what we promise is what we deliver, every time.",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-muted to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We help Fortune 500 companies and startups alike build the CRM of their dreams.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-white">
                  Our Story
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Founded by industry veterans who understand that one size doesn't fit all, 
                  Cloudastick emerged from the need for personalized CRM solutions that truly 
                  understand your business.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  With decades of combined experience in Salesforce consulting and business 
                  transformation, we've helped hundreds of companies optimize their customer 
                  relationships and drive growth.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-cyan-400 mb-2">500+</div>
                  <div className="text-gray-300">Successful Projects</div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">98%</div>
                    <div className="text-gray-400 text-sm">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-gray-400 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800/80 to-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">
              What Sets Us Apart
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Industry-Smart CRM Design",
              "Boutique Attention", 
              "Salesforce Expertise",
              "End-to-End Services"
            ].map((feature, index) => (
              <AnimatedSection
                key={feature}
                delay={index * 0.2}
                direction={index % 2 === 0 ? "left" : "right"}
                className="group"
              >
                <motion.div
                  whileHover={{ 
                    y: -15, 
                    scale: 1.05,
                    rotateY: 5,
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 backdrop-blur-sm overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.6, type: "spring" }}
                    className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full"
                    />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-xl font-bold text-white text-center group-hover:text-cyan-300 transition-colors duration-300"
                  >
                    {feature}
                  </motion.h3>
                  
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 + 0.7, duration: 0.8 }}
                    className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-4 rounded-full group-hover:w-24 transition-all duration-300"
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do at Cloudastick.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimatedSection
                key={value.title}
                delay={index * 0.15}
                className="group"
              >
                <motion.div
                  whileHover={{ 
                    y: -15,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className={`text-center p-8 rounded-2xl ${value.bgColor} border-2 border-transparent hover:border-opacity-50 transition-all duration-500 shadow-lg hover:shadow-2xl`}
                >
                  <motion.div
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1,
                      transition: { duration: 0.6 }
                    }}
                    className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  >
                    <value.icon className={`w-10 h-10 ${value.iconColor}`} />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-bold text-gray-800 mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    {value.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 leading-relaxed text-sm"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {value.description}
                  </motion.p>
                  
                  {/* Decorative element */}
                  <motion.div
                    className={`w-full h-1 bg-gradient-to-r ${value.color} rounded-full mt-6`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Meet the experts behind Cloudastick's success.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                key={member.name}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -15, scale: 1.05 }}
                  className="bg-card/80 rounded-2xl p-6 border border-border hover:border-brand-primary/50 transition-all duration-500 text-center relative overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                  
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-3 border-brand-primary/30 group-hover:border-brand-primary transition-all duration-500 relative">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Role-specific icons */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {React.createElement(member.icons[0], { className: "w-4 h-4 text-gray-700" })}
                      </div>
                      
                      <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {React.createElement(member.icons[1], { className: "w-4 h-4 text-gray-700" })}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                    {member.name}
                  </h3>
                  
                  <p className="text-cyan-400 text-sm mb-3 font-medium">
                    {member.role}
                  </p>
                  
                  {/* Hover elements */}
                  <motion.div
                    className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {member.hoverElements.map((element, idx) => (
                      <motion.span
                        key={element}
                        className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${member.color} text-white shadow-sm`}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.1 }}
                      >
                        {element}
                      </motion.span>
                    ))}
                  </motion.div>
                  
                  {/* Decorative line */}
                  <motion.div
                    className={`w-full h-0.5 bg-gradient-to-r ${member.color} rounded-full mt-4`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
