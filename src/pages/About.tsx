
import React from "react";
import { motion } from "framer-motion";
import { 
  Heart, Zap, Users, Eye, Shield, Target, Award, TrendingUp,
  Code, Palette, Users2, Headphones, Wrench, MessageSquare, 
  BarChart3, Settings, UserCheck, Briefcase, Lightbulb, 
  Globe, Database, Shield as ShieldIcon, Star, CreditCard, GraduationCap
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  // Team member images with role-specific icons and hover elements
  const teamMembers = [
    { 
      name: "Mina Michel", 
      role: t('team.founder'), 
      image: "/Assets/Company Members/Mina_Michel_Founder_of_Cloudastick_Systems.png",
      icons: [Star, Lightbulb],
      hoverElements: [t('team.hoverElements.vision'), t('team.hoverElements.leadership')],
      color: "from-yellow-400 to-orange-500"
    },
    { 
      name: "Mireille Rafik", 
      role: t('team.marketingConsultant'), 
      image: "/Assets/Company Members/Mireille_Rafik_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: [t('team.hoverElements.campaigns'), t('team.hoverElements.analytics')],
      color: "from-pink-400 to-purple-500"
    },
    { 
      name: "Omar El Borae", 
      role: t('team.customerSuccess'), 
      image: "/Assets/Company Members/Omar_El_Borae_Customer_Success_Manager.png?v=2",
      icons: [Headphones, UserCheck],
      hoverElements: [t('team.hoverElements.support'), t('team.hoverElements.success')],
      color: "from-green-400 to-teal-500"
    },
    { 
      name: "Carine Felix", 
      role: t('team.brandSpecialist'), 
      image: "/Assets/Company Members/Carine_Felix_Brand_and_People_Experience_Specialist.png",
      icons: [Palette, Users2],
      hoverElements: [t('team.hoverElements.brand'), t('team.hoverElements.culture')],
      color: "from-purple-400 to-pink-500"
    },
    { 
      name: "Luay Aladin", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Luay_Aladin_Salesforce_Consultant.png",
      icons: [Code, Settings],
      hoverElements: [t('team.hoverElements.development'), t('team.hoverElements.configuration')],
      color: "from-blue-400 to-cyan-500"
    },
    { 
      name: "Shady Thomas", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Shady_Thomas_Salesforce_Consultant.png",
      icons: [Wrench, Database],
      hoverElements: [t('team.hoverElements.integration'), t('team.hoverElements.data')],
      color: "from-indigo-400 to-blue-500"
    },
    { 
      name: "Ashraf Rezk", 
      role: t('team.headOfTech'), 
      image: "/Assets/Company Members/Ashraf_Rezk_Head_of_Tech.png",
      icons: [ShieldIcon, Globe],
      hoverElements: [t('team.hoverElements.security'), t('team.hoverElements.architecture')],
      color: "from-red-400 to-orange-500"
    },
    { 
      name: "Martin Ashraf", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Martin_Ashraf_Salesforce_Consultant.png",
      icons: [Target, TrendingUp],
      hoverElements: [t('team.hoverElements.strategy'), t('team.hoverElements.growth')],
      color: "from-emerald-400 to-green-500"
    },
    { 
      name: "Ahmed Salah", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Ahmed_Salah_Salesforce_Consultant.png",
      icons: [Award, Briefcase],
      hoverElements: [t('team.hoverElements.excellence'), t('team.hoverElements.delivery')],
      color: "from-amber-400 to-yellow-500"
    },
    { 
      name: "Maheen Imran", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Maheen_Imran_Salesforce_Consultant.png",
      icons: [Users, Zap],
      hoverElements: [t('team.hoverElements.collaboration'), t('team.hoverElements.innovation')],
      color: "from-cyan-400 to-blue-500"
    },
    { 
      name: "Andrew Osama", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Andrew_Osama_Salesforce_Consultant.png",
      icons: [Settings, Wrench],
      hoverElements: [t('team.hoverElements.configuration'), t('team.hoverElements.customization')],
      color: "from-teal-400 to-cyan-500"
    },
    { 
      name: "Abdullah", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Abdullah_Salesforce_Consultant.png",
      icons: [Database, Globe],
      hoverElements: [t('team.hoverElements.dataManagement'), t('team.hoverElements.integration')],
      color: "from-orange-400 to-red-500"
    },
    { 
      name: "Farida Esam", 
      role: t('team.marketingConsultant'), 
      image: "/Assets/Company Members/Farida_Esam_Marketing_Cloud_Consultant.png",
      icons: [MessageSquare, BarChart3],
      hoverElements: [t('team.hoverElements.emailMarketing'), t('team.hoverElements.campaigns')],
      color: "from-rose-400 to-pink-500"
    },
    { 
      name: "Andrea Makary", 
      role: t('team.technicalArchitect'), 
      image: "/Assets/Company Members/Andrea_Makary_Technical_Architect.png?v=2",
      icons: [ShieldIcon, Globe],
      hoverElements: [t('team.hoverElements.architecture'), t('team.hoverElements.security')],
      color: "from-slate-400 to-gray-500"
    },
    { 
      name: "Mariam Mamdouh", 
      role: t('team.projectManager'), 
      image: "/Assets/Company Members/Mariam_Mamdouh_Project_Manager.png",
      icons: [Briefcase, Target],
      hoverElements: [t('team.hoverElements.projectDelivery'), t('team.hoverElements.timeline')],
      color: "from-lime-400 to-green-500"
    },
    { 
      id: 17, name: "Marina Danial", 
      role: "CFO Cloudastick and COO of Techsa", 
      image: "/Assets/Company Members/Marina_Danial_CFO_Cloudastick_and_COO_of_Techsa.png?v=2",
      icons: [CreditCard, TrendingUp],
      hoverElements: [t('team.hoverElements.finance'), t('team.hoverElements.operations')],
      color: "from-emerald-400 to-teal-500"
    },
    { 
      id: 18, name: "Jenny Maged", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Jenny_Maged_Salesforce_Consultant.png?v=2",
      icons: [Code, Settings],
      hoverElements: [t('team.hoverElements.development'), t('team.hoverElements.configuration')],
      color: "from-blue-400 to-indigo-500"
    },
    { 
      id: 19, name: "John Shedoudy", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/John_Shedoudy_Salesforce_Consultant.png?v=2",
      icons: [Settings, Wrench],
      hoverElements: [t('team.hoverElements.configuration'), t('team.hoverElements.optimization')],
      color: "from-teal-400 to-cyan-500"
    },
    { 
      id: 20, name: "Mariam Mahmoud", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Mariam_Mahmoud_Salesforce_Consultant.png?v=2",
      icons: [Users, UserCheck],
      hoverElements: [t('team.hoverElements.userAdoption'), t('team.hoverElements.training')],
      color: "from-purple-400 to-pink-500"
    },
    { 
      id: 21, name: "Omar Bazid", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Omar_Bazid_Salesforce_Consultant.png?v=2",
      icons: [TrendingUp, Target],
      hoverElements: [t('team.hoverElements.scalability'), t('team.hoverElements.growth')],
      color: "from-green-400 to-emerald-500",
      isAcademy: true
    },
    { 
      id: 22, name: "Sakshi Dokarimare", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Sakshi_Dokarimare_Salesforce_Consultant.png",
      icons: [Code, Target],
      hoverElements: [t('team.hoverElements.development'), t('team.hoverElements.strategy')],
      color: "from-indigo-400 to-blue-500"
    },
    { 
      id: 23, name: "Alyaa Hafez", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Alyaa_Hafez_Salesforce_Consultant.png",
      icons: [GraduationCap, Code],
      hoverElements: [t('team.hoverElements.development'), t('team.hoverElements.innovation')],
      color: "from-cyan-400 to-blue-500",
      isAcademy: true
    },
    { 
      id: 24, name: "Khaled El-Nabawy", 
      role: t('team.salesforceConsultant'), 
      image: "/Assets/Company Members/Khaled_El-Nabawy_Salesforce_Consultant.png",
      icons: [Globe, TrendingUp],
      hoverElements: [t('team.hoverElements.integration'), t('team.hoverElements.strategy')],
      color: "from-sky-400 to-cyan-500",
      isAcademy: true
    }
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.values.reverence'),
      description: t('about.values.reverence.desc'),
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: Zap,
      title: t('about.values.efficiency'),
      description: t('about.values.efficiency.desc'),
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: Users,
      title: t('about.values.inclusion'),
      description: t('about.values.inclusion.desc'),
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Eye,
      title: t('about.values.transparency'),
      description: t('about.values.transparency.desc'),
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: t('about.values.consistency'),
      description: t('about.values.consistency.desc'),
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
              {t('about.hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('about.hero.subtitle')}
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
                  {t('about.story.title')}
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {t('about.story.content')}
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {t('about.story.experience')}
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="right">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-cyan-400 mb-2">500+</div>
                  <div className="text-gray-300">{t('about.stats.projects')}</div>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">98%</div>
                    <div className="text-gray-400 text-sm">{t('about.stats.satisfaction')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">24/7</div>
                    <div className="text-gray-400 text-sm">{t('about.stats.support')}</div>
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
              {t('about.differentiators.title')}
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              t('about.differentiators.industry'),
              t('about.differentiators.boutique'), 
              t('about.differentiators.expertise'),
              t('about.differentiators.services')
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
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('about.values.subtitle')}
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
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('about.team.subtitle')}
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
                      
                      {/* Academy icon */}
                      {member.isAcademy && (
                        <div className="absolute top-0 left-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                      )}
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
