import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { TrendingUp, Users, Zap, Shield, BarChart3, MessageSquare, Database, ShoppingCart, Wrench, Headphones, Cloud, Brain, CreditCard, Globe, Smartphone, Leaf, Building, GraduationCap, Monitor, Star, Award, Handshake } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface Customer {
  id: string;
  name: string;
  logo: string;
  industry: string;
  partnershipYears: string;
  products: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }[];
  successStory: string;
  businessImpact: string;
  testimonial?: string;
}

const CustomerCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1,
    skipSnaps: false,
    dragFree: true,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 }
    }
  });
  const [hoveredCustomer, setHoveredCustomer] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMouseOverCarousel, setIsMouseOverCarousel] = useState(false);

  const customers: Customer[] = [
    {
      id: "fedex",
      name: "FedEx",
      logo: "/Assets/Company Logos/blue-logo.png", // Using Cloudastick logo as placeholder
      industry: "Logistics & Transportation",
      partnershipYears: "5+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "Sales pipeline management" }
      ],
      successStory: "Streamlined global sales operations across multiple regions",
      businessImpact: "Increased sales efficiency by 40% and improved customer tracking",
      testimonial: "Cloudastick transformed our sales processes with Salesforce."
    },
    {
      id: "intuition",
      name: "Intuition",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Financial Services",
      partnershipYears: "4+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "Customer relationship management" },
        { name: "Service Cloud", icon: Headphones, description: "Customer support optimization" },
        { name: "Experience Cloud", icon: Monitor, description: "Client portal development" }
      ],
      successStory: "Built comprehensive client management and support system",
      businessImpact: "Enhanced client satisfaction and reduced support response time by 50%",
      testimonial: "The integrated Salesforce solution revolutionized our client experience."
    },
    {
      id: "memar",
      name: "Memar",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Real Estate",
      partnershipYears: "3+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "Property sales management" },
        { name: "Marketing Cloud", icon: MessageSquare, description: "Lead generation campaigns" }
      ],
      successStory: "Automated property sales and marketing processes",
      businessImpact: "Increased lead conversion by 35% and streamlined property management",
      testimonial: "Salesforce integration transformed our real estate operations."
    },
    {
      id: "beshay-steel",
      name: "Beshay Steel",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Manufacturing",
      partnershipYears: "6+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "B2B sales management" }
      ],
      successStory: "Optimized steel sales processes and customer relationships",
      businessImpact: "Improved order processing efficiency and customer satisfaction",
      testimonial: "Long-term partnership with Cloudastick has been invaluable."
    },
    {
      id: "nile-towers",
      name: "Nile Towers",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Real Estate Development",
      partnershipYears: "4+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "Property sales tracking" },
        { name: "Service Cloud", icon: Headphones, description: "Resident support services" }
      ],
      successStory: "Integrated property sales and resident services management",
      businessImpact: "Enhanced resident experience and streamlined property operations",
      testimonial: "Cloudastick's expertise in real estate Salesforce solutions is unmatched."
    },
    {
      id: "modern-electronics",
      name: "Modern Electronics",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Electronics & Technology",
      partnershipYears: "5+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "Multi-brand sales management" },
        { name: "Experience Cloud", icon: Monitor, description: "Partner portal development" },
        { name: "MuleSoft", icon: Zap, description: "System integrations" },
        { name: "Service Cloud", icon: Headphones, description: "Customer support" },
        { name: "Marketing Cloud", icon: MessageSquare, description: "Brand marketing campaigns" }
      ],
      successStory: "Built comprehensive ecosystem for Sony and other major brands",
      businessImpact: "Unified operations across multiple brands and improved partner collaboration",
      testimonial: "The integrated Salesforce ecosystem transformed our multi-brand operations."
    },
    {
      id: "tech-solutions",
      name: "Tech Solutions Inc",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Technology Consulting",
      partnershipYears: "3+ years",
      products: [
        { name: "Sales Cloud", icon: Users, description: "Consulting sales pipeline" },
        { name: "Platform Cloud", icon: Globe, description: "Custom application development" }
      ],
      successStory: "Streamlined consulting sales and custom development processes",
      businessImpact: "Improved project delivery and client relationship management",
      testimonial: "Cloudastick's platform expertise accelerated our digital transformation."
    },
    {
      id: "healthcare-plus",
      name: "Healthcare Plus",
      logo: "/Assets/Company Logos/blue-logo.png",
      industry: "Healthcare",
      partnershipYears: "4+ years",
      products: [
        { name: "Health Cloud", icon: Users, description: "Patient relationship management" },
        { name: "Service Cloud", icon: Headphones, description: "Patient support services" }
      ],
      successStory: "Enhanced patient care and healthcare service delivery",
      businessImpact: "Improved patient satisfaction and operational efficiency",
      testimonial: "Salesforce Health Cloud transformed our patient care processes."
    }
  ];

  // Auto-scroll functionality
  const autoScroll = useCallback(() => {
    if (emblaApi && isAutoPlaying && !isMouseOverCarousel) {
      emblaApi.scrollNext();
    }
  }, [emblaApi, isAutoPlaying, isMouseOverCarousel]);

  // Mouse-based scrolling with throttling
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!emblaApi || !isMouseOverCarousel) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const mouseX = e.clientX;
    const threshold = rect.width * 0.25;
    
    const now = Date.now();
    if (handleMouseMove.lastScroll && now - handleMouseMove.lastScroll < 500) return;
    
    if (mouseX < centerX - threshold) {
      emblaApi.scrollPrev();
      handleMouseMove.lastScroll = now;
    } else if (mouseX > centerX + threshold) {
      emblaApi.scrollNext();
      handleMouseMove.lastScroll = now;
    }
  }, [emblaApi, isMouseOverCarousel]);

  // Touch/gesture support for mobile
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!emblaApi || !isMouseOverCarousel) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const touchX = touch.clientX;
    const threshold = rect.width * 0.25;
    
    const now = Date.now();
    if (handleTouchMove.lastScroll && now - handleTouchMove.lastScroll < 500) return;
    
    if (touchX < centerX - threshold) {
      emblaApi.scrollPrev();
      handleTouchMove.lastScroll = now;
    } else if (touchX > centerX + threshold) {
      emblaApi.scrollNext();
      handleTouchMove.lastScroll = now;
    }
  }, [emblaApi, isMouseOverCarousel]);

  // Set up auto-scroll interval
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(autoScroll, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [emblaApi, autoScroll]);

  return (
    <section className="py-20 bg-gradient-to-br from-muted/50 via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Handshake className="w-8 h-8 text-brand-primary" />
            <h2 className="text-4xl font-bold text-foreground">
              Long Term Partnerships
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building lasting relationships with industry leaders through successful Salesforce implementations
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Customer Carousel Container */}
          <div 
            className="overflow-hidden cursor-grab active:cursor-grabbing" 
            ref={emblaRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseEnter={() => setIsMouseOverCarousel(true)}
            onMouseLeave={() => setIsMouseOverCarousel(false)}
          >
            <div className="flex gap-6">
              {/* First set of customers for infinite loop */}
              {customers.map((customer, index) => (
                <div
                  key={`${customer.id}-1`}
                  className="flex-none w-80 md:w-96"
                  onMouseEnter={() => setHoveredCustomer(customer.id)}
                  onMouseLeave={() => setHoveredCustomer(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Customer Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 h-96 flex flex-col justify-between hover:border-brand-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10">
                      {/* Customer Header */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={customer.logo} 
                            alt={customer.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {customer.industry}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-brand-primary">
                          <Star className="w-4 h-4" />
                          <span>{customer.partnershipYears}</span>
                        </div>
                      </div>

                      {/* Products Badge */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-full px-4 py-2">
                          <Award className="w-4 h-4 text-brand-primary" />
                          <span className="text-sm font-semibold text-brand-primary">
                            {customer.products.length} Salesforce Products
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <AnimatePresence>
                      {hoveredCustomer === customer.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-slate-900/98 backdrop-blur-md border-2 border-brand-primary/70 rounded-2xl p-6 shadow-2xl shadow-brand-primary/30 z-20"
                        >
                          <div className="h-full flex flex-col justify-between">
                            {/* Customer Details */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <Handshake className="w-6 h-6 text-cyan-400" />
                                <h4 className="text-xl font-bold text-white">
                                  Partnership Details
                                </h4>
                              </div>
                              <p className="text-base text-cyan-300 font-semibold mb-4 leading-relaxed">
                                {customer.successStory}
                              </p>
                              <p className="text-sm text-gray-200 mb-4 leading-relaxed">
                                {customer.businessImpact}
                              </p>
                            </div>

                            {/* Salesforce Products */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Cloud className="w-6 h-6 text-blue-400" />
                                <h4 className="text-lg font-bold text-white">
                                  Salesforce Products
                                </h4>
                              </div>
                              <div className="space-y-2">
                                {customer.products.map((product, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm">
                                    <product.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <div>
                                      <span className="text-white font-medium">{product.name}</span>
                                      <p className="text-gray-300 text-xs">{product.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {customer.testimonial && (
                                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                  <p className="text-xs text-blue-300 italic">"{customer.testimonial}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
              
              {/* Second set of customers for infinite loop */}
              {customers.map((customer, index) => (
                <div
                  key={`${customer.id}-2`}
                  className="flex-none w-80 md:w-96"
                  onMouseEnter={() => setHoveredCustomer(customer.id)}
                  onMouseLeave={() => setHoveredCustomer(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Customer Card */}
                    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 h-96 flex flex-col justify-between hover:border-brand-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-primary/10">
                      {/* Customer Header */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-muted/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <img 
                            src={customer.logo} 
                            alt={customer.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {customer.industry}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-brand-primary">
                          <Star className="w-4 h-4" />
                          <span>{customer.partnershipYears}</span>
                        </div>
                      </div>

                      {/* Products Badge */}
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-full px-4 py-2">
                          <Award className="w-4 h-4 text-brand-primary" />
                          <span className="text-sm font-semibold text-brand-primary">
                            {customer.products.length} Salesforce Products
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <AnimatePresence>
                      {hoveredCustomer === customer.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 bg-slate-900/98 backdrop-blur-md border-2 border-brand-primary/70 rounded-2xl p-6 shadow-2xl shadow-brand-primary/30 z-20"
                        >
                          <div className="h-full flex flex-col justify-between">
                            {/* Customer Details */}
                            <div>
                              <div className="flex items-center gap-2 mb-4">
                                <Handshake className="w-6 h-6 text-cyan-400" />
                                <h4 className="text-xl font-bold text-white">
                                  Partnership Details
                                </h4>
                              </div>
                              <p className="text-base text-cyan-300 font-semibold mb-4 leading-relaxed">
                                {customer.successStory}
                              </p>
                              <p className="text-sm text-gray-200 mb-4 leading-relaxed">
                                {customer.businessImpact}
                              </p>
                            </div>

                            {/* Salesforce Products */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Cloud className="w-6 h-6 text-blue-400" />
                                <h4 className="text-lg font-bold text-white">
                                  Salesforce Products
                                </h4>
                              </div>
                              <div className="space-y-2">
                                {customer.products.map((product, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm">
                                    <product.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                    <div>
                                      <span className="text-white font-medium">{product.name}</span>
                                      <p className="text-gray-300 text-xs">{product.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {customer.testimonial && (
                                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                  <p className="text-xs text-blue-300 italic">"{customer.testimonial}"</p>
                                </div>
                              )}
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
            Ready to join our growing list of successful partnerships?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-brand-primary/25 transition-all duration-300"
          >
            Start Your Partnership
          </motion.button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CustomerCarousel;
