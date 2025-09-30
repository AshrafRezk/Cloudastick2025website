import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { TrendingUp, Users, Zap, Shield, BarChart3, MessageSquare, Database, ShoppingCart, Wrench, Headphones, Cloud, Brain, CreditCard, Globe, Smartphone, Leaf, Building, GraduationCap, Monitor } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface Product {
  id: string;
  name: string;
  logo: string;
  description: string;
  businessValue: {
    primaryBenefit: string;
    timeframe: string;
    keyOutcomes: string[];
    costSavings: string;
  };
  cloudastickExpertise: {
    specialization: string;
    certifications: string[];
    successStories: string;
    industryFocus: string;
  };
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ProductCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps"
  });
  
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const products: Product[] = [
    {
      id: "salesforce-crm",
      name: "Sales Cloud CRM",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "The world's leading customer relationship management platform",
      businessValue: {
        primaryBenefit: "Streamline sales processes and boost revenue growth",
        timeframe: "within 12 months",
        keyOutcomes: [
          "Increase sales productivity by 40%",
          "Improve lead conversion rates by 25%",
          "Reduce sales cycle time by 30%"
        ],
        costSavings: "Save $50K+ annually on manual processes"
      },
      cloudastickExpertise: {
        specialization: "End-to-end CRM implementation and optimization",
        certifications: ["Salesforce Certified Administrator", "Sales Cloud Consultant"],
        successStories: "Implemented for 50+ companies across MENA region",
        industryFocus: "Real Estate, Insurance, Manufacturing"
      },
      category: "CRM Platform",
      icon: Users
    },
    {
      id: "marketing-cloud",
      name: "Marketing Cloud",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "Comprehensive marketing automation and customer engagement platform",
      businessValue: {
        primaryBenefit: "Drive personalized customer engagement at scale",
        timeframe: "within 8 months",
        keyOutcomes: [
          "Increase email open rates by 35%",
          "Boost customer lifetime value by 45%",
          "Reduce marketing operational costs by 30%"
        ],
        costSavings: "Cut marketing operational costs by 30%"
      },
      cloudastickExpertise: {
        specialization: "Marketing automation and customer journey optimization",
        certifications: ["Marketing Cloud Email Specialist", "Marketing Cloud Consultant"],
        successStories: "Delivered 200% ROI for retail clients",
        industryFocus: "Retail, E-commerce, Hospitality"
      },
      category: "Marketing Automation",
      icon: BarChart3
    },
    {
      id: "service-cloud",
      name: "Service Cloud",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "Comprehensive customer service platform with AI-powered support",
      businessValue: {
        primaryBenefit: "Deliver exceptional customer service experiences",
        timeframe: "within 6 months",
        keyOutcomes: [
          "Reduce case resolution time by 45%",
          "Increase customer satisfaction by 30%",
          "Automate 60% of routine inquiries"
        ],
        costSavings: "Save $80K+ annually in support costs"
      },
      cloudastickExpertise: {
        specialization: "Customer service transformation and AI integration",
        certifications: ["Service Cloud Consultant", "Field Service Lightning Specialist"],
        successStories: "Achieved 95% customer satisfaction for telecom clients",
        industryFocus: "Telecommunications, Healthcare, Financial Services"
      },
      category: "Customer Service",
      icon: Headphones
    },
    {
      id: "experience-cloud",
      name: "Experience Cloud",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "Build and manage digital experiences for customers, partners, and employees",
      businessValue: {
        primaryBenefit: "Create seamless digital experiences across all touchpoints",
        timeframe: "within 10 months",
        keyOutcomes: [
          "Increase digital engagement by 50%",
          "Reduce support tickets by 35%",
          "Improve self-service adoption by 60%"
        ],
        costSavings: "Reduce support costs by $40K+ annually"
      },
      cloudastickExpertise: {
        specialization: "Digital experience design and community management",
        certifications: ["Experience Cloud Consultant", "Community Cloud Consultant"],
        successStories: "Built 20+ successful digital communities",
        industryFocus: "Education, Non-profit, Technology"
      },
      category: "Digital Experience",
      icon: Globe
    },
    {
      id: "revenue-cloud",
      name: "Revenue Cloud",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "End-to-end revenue management and subscription billing platform",
      businessValue: {
        primaryBenefit: "Optimize revenue operations and subscription management",
        timeframe: "within 9 months",
        keyOutcomes: [
          "Increase revenue recognition accuracy by 90%",
          "Reduce billing errors by 70%",
          "Accelerate quote-to-cash by 40%"
        ],
        costSavings: "Save $60K+ annually on billing operations"
      },
      cloudastickExpertise: {
        specialization: "Revenue operations and subscription billing optimization",
        certifications: ["Revenue Cloud Specialist", "CPQ Specialist"],
        successStories: "Streamlined billing for 30+ subscription businesses",
        industryFocus: "SaaS, Media, Telecommunications"
      },
      category: "Revenue Management",
      icon: CreditCard
    },
    {
      id: "data-cloud",
      name: "Data Cloud",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "Unified data platform for real-time customer insights and AI",
      businessValue: {
        primaryBenefit: "Unlock the power of unified customer data",
        timeframe: "within 7 months",
        keyOutcomes: [
          "Achieve 360-degree customer view",
          "Improve data quality by 80%",
          "Enable real-time personalization"
        ],
        costSavings: "Reduce data management costs by $35K+ annually"
      },
      cloudastickExpertise: {
        specialization: "Data architecture and customer data platform implementation",
        certifications: ["Data Cloud Specialist", "Tableau CRM Specialist"],
        successStories: "Unified data for 25+ enterprise clients",
        industryFocus: "Financial Services, Retail, Healthcare"
      },
      category: "Data Platform",
      icon: Database
    },
    {
      id: "einstein-ai",
      name: "Einstein AI",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "AI-powered insights and automation across the Salesforce platform",
      businessValue: {
        primaryBenefit: "Leverage AI to predict, recommend, and automate",
        timeframe: "within 5 months",
        keyOutcomes: [
          "Increase sales forecast accuracy by 60%",
          "Automate 50% of routine tasks",
          "Improve lead scoring by 45%"
        ],
        costSavings: "Save $45K+ annually through automation"
      },
      cloudastickExpertise: {
        specialization: "AI strategy and implementation across Salesforce ecosystem",
        certifications: ["Einstein Analytics Specialist", "AI Associate"],
        successStories: "Deployed AI solutions for 15+ companies",
        industryFocus: "Technology, Financial Services, Manufacturing"
      },
      category: "Artificial Intelligence",
      icon: Brain
    },
    {
      id: "mulesoft",
      name: "MuleSoft",
      logo: "/Assets/Product Logos/mulesoft.png",
      description: "API-led connectivity platform for seamless system integration",
      businessValue: {
        primaryBenefit: "Connect systems and data for unified business processes",
        timeframe: "within 6 months",
        keyOutcomes: [
          "Reduce integration time by 70%",
          "Increase system connectivity by 80%",
          "Improve data flow efficiency by 60%"
        ],
        costSavings: "Save $55K+ annually on integration costs"
      },
      cloudastickExpertise: {
        specialization: "API strategy and enterprise integration architecture",
        certifications: ["MuleSoft Certified Developer", "MuleSoft Certified Architect"],
        successStories: "Integrated 100+ systems for enterprise clients",
        industryFocus: "Banking, Insurance, Government"
      },
      category: "Integration Platform",
      icon: Zap
    },
    {
      id: "tableau",
      name: "Tableau",
      logo: "/Assets/Product Logos/tableau.png",
      description: "Advanced analytics and data visualization platform",
      businessValue: {
        primaryBenefit: "Transform data into actionable business insights",
        timeframe: "within 4 months",
        keyOutcomes: [
          "Improve decision-making speed by 50%",
          "Increase data-driven insights by 75%",
          "Reduce reporting time by 80%"
        ],
        costSavings: "Save $30K+ annually on reporting costs"
      },
      cloudastickExpertise: {
        specialization: "Data visualization and business intelligence strategy",
        certifications: ["Tableau Desktop Specialist", "Tableau Server Specialist"],
        successStories: "Created 200+ dashboards for business users",
        industryFocus: "Healthcare, Education, Retail"
      },
      category: "Analytics Platform",
      icon: BarChart3
    },
    {
      id: "slack",
      name: "Slack",
      logo: "/Assets/Product Logos/slack.png",
      description: "Collaboration platform that connects teams and workflows",
      businessValue: {
        primaryBenefit: "Enhance team collaboration and productivity",
        timeframe: "within 3 months",
        keyOutcomes: [
          "Increase team productivity by 25%",
          "Reduce email volume by 40%",
          "Improve project visibility by 60%"
        ],
        costSavings: "Save $25K+ annually on communication tools"
      },
      cloudastickExpertise: {
        specialization: "Workflow automation and team collaboration optimization",
        certifications: ["Slack Certified Admin", "Slack Certified Developer"],
        successStories: "Implemented for 40+ remote and hybrid teams",
        industryFocus: "Technology, Consulting, Media"
      },
      category: "Collaboration Platform",
      icon: MessageSquare
    }
  ];

  // Auto-rotation functionality
  useEffect(() => {
    if (!emblaApi) return;

    const autoRotate = () => {
      if (isAutoPlaying && !hoveredProduct) {
        emblaApi.scrollNext();
      }
    };

    const interval = setInterval(autoRotate, 4000);
    return () => clearInterval(interval);
  }, [emblaApi, isAutoPlaying, hoveredProduct]);

  // Track current slide
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentSlideIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Salesforce Ecosystem Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our certified expertise in the Salesforce ecosystem can drive measurable ROI for your business
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Progress Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {products.slice(0, 8).map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlideIndex === index 
                      ? 'bg-brand-primary w-8' 
                      : 'bg-muted-foreground/30 w-2'
                  }`}
                  animate={{
                    scale: currentSlideIndex === index ? 1.2 : 1,
                    opacity: currentSlideIndex === index ? 1 : 0.5
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Carousel Container */}
          <div 
            className="overflow-hidden relative" 
            ref={emblaRef}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Edge Fade Effects */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6">
              {/* First set for infinite loop */}
              {products.map((product, index) => (
                <div
                  key={`${product.id}-1`}
                  className="flex-none w-80 md:w-96"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: currentSlideIndex === index ? 1.05 : 0.95,
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className="relative group"
                  >
                    {/* Product Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 h-80 flex flex-col justify-between hover:border-brand-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10">
                      {/* Product Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={product.logo} 
                            alt={product.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.category}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Business Value Badge */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-full px-3 py-2">
                          <TrendingUp className="w-4 h-4 text-brand-primary" />
                          <span className="text-sm font-semibold text-brand-primary">
                            {product.businessValue.costSavings}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {product.businessValue.timeframe}
                        </p>
                      </div>
                    </div>

                    {/* Hover Overlay - Simplified */}
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-slate-900/95 backdrop-blur-md border-2 border-brand-primary/70 rounded-2xl p-4 shadow-2xl shadow-brand-primary/30 z-30"
                        >
                          <div className="h-full flex flex-col space-y-4 overflow-y-auto">
                            {/* Business Value Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                <h4 className="text-lg font-bold text-white">
                                  Business Value
                                </h4>
                              </div>
                              <p className="text-sm text-cyan-300 font-semibold mb-3 leading-relaxed">
                                {product.businessValue.primaryBenefit}
                              </p>
                              <ul className="space-y-2">
                                {product.businessValue.keyOutcomes.map((outcome, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-100 leading-relaxed">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Cloudastick Expertise Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <product.icon className="w-5 h-5 text-blue-400" />
                                <h4 className="text-lg font-bold text-white">
                                  Cloudastick Expertise
                                </h4>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div>
                                  <span className="text-gray-400 font-medium">Specialization:</span>
                                  <p className="text-white font-semibold mt-1 leading-relaxed">{product.cloudastickExpertise.specialization}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-medium">Success Stories:</span>
                                  <p className="text-white font-semibold mt-1 leading-relaxed">{product.cloudastickExpertise.successStories}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-medium">Industry Focus:</span>
                                  <p className="text-white font-semibold mt-1 leading-relaxed">{product.cloudastickExpertise.industryFocus}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
              
              {/* Second set for infinite loop */}
              {products.map((product, index) => (
                <div
                  key={`${product.id}-2`}
                  className="flex-none w-80 md:w-96"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: currentSlideIndex === index ? 1.05 : 0.95,
                    }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    className="relative group"
                  >
                    {/* Product Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 h-80 flex flex-col justify-between hover:border-brand-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10">
                      {/* Product Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={product.logo} 
                            alt={product.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.category}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Business Value Badge */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-full px-3 py-2">
                          <TrendingUp className="w-4 h-4 text-brand-primary" />
                          <span className="text-sm font-semibold text-brand-primary">
                            {product.businessValue.costSavings}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {product.businessValue.timeframe}
                        </p>
                      </div>
                    </div>

                    {/* Hover Overlay - Simplified */}
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-slate-900/95 backdrop-blur-md border-2 border-brand-primary/70 rounded-2xl p-4 shadow-2xl shadow-brand-primary/30 z-30"
                        >
                          <div className="h-full flex flex-col space-y-4 overflow-y-auto">
                            {/* Business Value Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                <h4 className="text-lg font-bold text-white">
                                  Business Value
                                </h4>
                              </div>
                              <p className="text-sm text-cyan-300 font-semibold mb-3 leading-relaxed">
                                {product.businessValue.primaryBenefit}
                              </p>
                              <ul className="space-y-2">
                                {product.businessValue.keyOutcomes.map((outcome, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-100 leading-relaxed">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Cloudastick Expertise Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <product.icon className="w-5 h-5 text-blue-400" />
                                <h4 className="text-lg font-bold text-white">
                                  Cloudastick Expertise
                                </h4>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div>
                                  <span className="text-gray-400 font-medium">Specialization:</span>
                                  <p className="text-white font-semibold mt-1 leading-relaxed">{product.cloudastickExpertise.specialization}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-medium">Success Stories:</span>
                                  <p className="text-white font-semibold mt-1 leading-relaxed">{product.cloudastickExpertise.successStories}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-medium">Industry Focus:</span>
                                  <p className="text-white font-semibold mt-1 leading-relaxed">{product.cloudastickExpertise.industryFocus}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <AnimatedSection className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Ready to transform your business with our certified Salesforce expertise?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300"
          >
            Get Expert Consultation
          </motion.button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProductCarousel;