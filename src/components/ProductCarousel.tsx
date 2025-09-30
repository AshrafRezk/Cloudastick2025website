import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, TrendingUp, Users, Zap, Shield, BarChart3, MessageSquare, Database } from "lucide-react";
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
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 }
    }
  });
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: "salesforce",
      name: "Salesforce CRM",
      logo: "/Assets/Product Logos/salesforce.png",
      description: "The world's leading customer relationship management platform",
      businessValue: {
        primaryBenefit: "Transform sales performance and customer relationships",
        timeframe: "within 12 months",
        keyOutcomes: ["Increase sales productivity by 40%", "Improve customer satisfaction scores", "Reduce manual data entry by 60%"],
        costSavings: "Save $50K+ annually on manual processes"
      },
      cloudastickExpertise: {
        specialization: "Enterprise CRM Strategy & Implementation",
        certifications: ["Salesforce Certified Administrator", "Sales Cloud Consultant"],
        successStories: "Helped 50+ companies streamline their sales processes",
        industryFocus: "Manufacturing, Healthcare, Financial Services"
      },
      category: "CRM Platform",
      icon: Users
    },
    {
      id: "marketing-cloud",
      name: "Marketing Cloud",
      logo: "/Assets/Product Logos/salesforce.png", // Using Salesforce logo as base
      description: "Comprehensive marketing automation and customer engagement platform",
      businessValue: {
        primaryBenefit: "Drive personalized customer engagement at scale",
        timeframe: "within 8 months",
        keyOutcomes: ["Increase email open rates by 35%", "Boost customer lifetime value", "Reduce marketing campaign setup time by 70%"],
        costSavings: "Cut marketing operational costs by 30%"
      },
      cloudastickExpertise: {
        specialization: "Marketing Automation & Customer Journey Design",
        certifications: ["Marketing Cloud Email Specialist", "Marketing Cloud Consultant"],
        successStories: "Delivered 30+ successful marketing automation transformations",
        industryFocus: "Retail, E-commerce, B2B Services"
      },
      category: "Marketing Automation",
      icon: MessageSquare
    },
    {
      id: "tableau",
      name: "Tableau",
      logo: "/Assets/Product Logos/tableau.png",
      description: "Powerful data visualization and business intelligence platform",
      businessValue: {
        primaryBenefit: "Turn data into actionable business insights",
        timeframe: "within 6 months",
        keyOutcomes: ["Reduce reporting time from days to minutes", "Enable data-driven decision making", "Identify new revenue opportunities"],
        costSavings: "Eliminate $25K+ in annual reporting costs"
      },
      cloudastickExpertise: {
        specialization: "Business Intelligence & Data Visualization",
        certifications: ["Tableau Desktop Specialist", "Tableau Server Certified Associate"],
        successStories: "Built 25+ analytics dashboards driving business growth",
        industryFocus: "Healthcare, Finance, Manufacturing"
      },
      category: "Business Intelligence",
      icon: BarChart3
    },
    {
      id: "mulesoft",
      name: "MuleSoft",
      logo: "/Assets/Product Logos/mulesoft.png",
      description: "Leading integration platform for connecting applications and data",
      businessValue: {
        primaryBenefit: "Connect systems seamlessly and accelerate digital transformation",
        timeframe: "within 10 months",
        keyOutcomes: ["Reduce integration development time by 80%", "Improve data accuracy across systems", "Enable real-time business processes"],
        costSavings: "Save $100K+ in custom integration development"
      },
      cloudastickExpertise: {
        specialization: "Enterprise Integration & API Strategy",
        certifications: ["MuleSoft Certified Developer", "MuleSoft Certified Architect"],
        successStories: "Completed 20+ complex integration projects",
        industryFocus: "Banking, Insurance, Government"
      },
      category: "Integration Platform",
      icon: Zap
    },
    {
      id: "slack",
      name: "Slack",
      logo: "/Assets/Product Logos/slack.png",
      description: "Collaboration hub that brings teams and tools together",
      businessValue: {
        primaryBenefit: "Boost team productivity and communication efficiency",
        timeframe: "within 4 months",
        keyOutcomes: ["Reduce email volume by 50%", "Accelerate project delivery", "Improve remote team collaboration"],
        costSavings: "Save 2+ hours per employee weekly"
      },
      cloudastickExpertise: {
        specialization: "Workplace Collaboration & Digital Transformation",
        certifications: ["Slack Certified Admin", "Slack Certified Developer"],
        successStories: "Optimized 15+ workspace environments for peak productivity",
        industryFocus: "Technology, Consulting, Media"
      },
      category: "Collaboration",
      icon: Users
    },
    {
      id: "informatica",
      name: "Informatica",
      logo: "/Assets/Product Logos/informatica.png",
      description: "Enterprise data management and integration platform",
      businessValue: {
        primaryBenefit: "Ensure data quality and governance across your organization",
        timeframe: "within 9 months",
        keyOutcomes: ["Improve data accuracy by 95%", "Reduce compliance risks", "Enable trusted analytics and reporting"],
        costSavings: "Avoid $200K+ in potential compliance penalties"
      },
      cloudastickExpertise: {
        specialization: "Data Governance & Quality Management",
        certifications: ["Informatica Certified Professional", "Data Quality Specialist"],
        successStories: "Implemented 12+ enterprise data management solutions",
        industryFocus: "Financial Services, Healthcare, Government"
      },
      category: "Data Management",
      icon: Database
    },
    {
      id: "copado",
      name: "Copado",
      logo: "/Assets/Product Logos/copado.png",
      description: "Leading DevOps platform for Salesforce development and deployment",
      businessValue: {
        primaryBenefit: "Accelerate Salesforce development and reduce deployment risks",
        timeframe: "within 7 months",
        keyOutcomes: ["Deploy 10x faster with zero downtime", "Reduce deployment errors by 90%", "Enable continuous delivery"],
        costSavings: "Save $75K+ annually in deployment costs"
      },
      cloudastickExpertise: {
        specialization: "Salesforce DevOps & Release Management",
        certifications: ["Copado Certified Administrator", "Copado Certified Developer"],
        successStories: "Streamlined DevOps for 10+ Salesforce organizations",
        industryFocus: "Technology, Financial Services, Healthcare"
      },
      category: "DevOps Platform",
      icon: Shield
    },
    {
      id: "quip",
      name: "Quip",
      logo: "/Assets/Product Logos/quip.png",
      description: "Collaborative productivity platform with documents, spreadsheets, and chat",
      businessValue: {
        primaryBenefit: "Enhance team collaboration and document management",
        timeframe: "within 3 months",
        keyOutcomes: ["Reduce document version conflicts by 80%", "Accelerate project collaboration", "Improve team alignment"],
        costSavings: "Eliminate $15K+ in document management tools"
      },
      cloudastickExpertise: {
        specialization: "Collaborative Workspace Design & Implementation",
        certifications: ["Quip Certified Administrator"],
        successStories: "Transformed 8+ organizations' collaboration workflows",
        industryFocus: "Consulting, Marketing, Project Management"
      },
      category: "Productivity",
      icon: MessageSquare
    }
  ];

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

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
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-none w-80 md:w-96"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Product Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 h-96 flex flex-col justify-between hover:border-brand-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10">
                      {/* Product Header */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={product.logo} 
                            alt={product.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.category}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Business Value Badge */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-full px-4 py-2">
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

                    {/* Hover Overlay */}
                    <AnimatePresence>
                      {hoveredProduct === product.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-card/95 backdrop-blur-sm border border-brand-primary/50 rounded-2xl p-6 shadow-2xl shadow-brand-primary/20 z-20"
                        >
                          <div className="h-full flex flex-col justify-between">
                            {/* Business Value Details */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-brand-primary" />
                                <h4 className="text-lg font-semibold text-foreground">
                                  Business Value
                                </h4>
                              </div>
                              <p className="text-sm text-brand-primary font-medium mb-3">
                                {product.businessValue.primaryBenefit}
                              </p>
                              <ul className="space-y-2 mb-6">
                                {product.businessValue.keyOutcomes.map((outcome, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0" />
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Cloudastick Expertise */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <product.icon className="w-5 h-5 text-brand-secondary" />
                                <h4 className="text-lg font-semibold text-foreground">
                                  Cloudastick Expertise
                                </h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Specialization:</span>
                                  <p className="text-foreground font-medium">{product.cloudastickExpertise.specialization}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Success Stories:</span>
                                  <p className="text-foreground font-medium">{product.cloudastickExpertise.successStories}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Industry Focus:</span>
                                  <p className="text-foreground font-medium">{product.cloudastickExpertise.industryFocus}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Certifications:</span>
                                  <div className="mt-1 space-y-1">
                                    {product.cloudastickExpertise.certifications.map((cert, idx) => (
                                      <div key={idx} className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">
                                        {cert}
                                      </div>
                                    ))}
                                  </div>
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
