
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Calendar, 
  Mail,
  Building2,
  Hammer,
  Landmark,
  MapPin,
  Home,
  Building,
  Store,
  Hospital,
  Stethoscope,
  Pill,
  Activity,
  Scale,
  Apple,
  BarChart3,
  Leaf,
  Factory,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Truck,
  TrendingUp
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";

const Clients = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Icon mapping for different industries
  const iconMap = {
    'real-estate': Building2,
    'construction': Hammer,
    'heritage': Landmark,
    'development': MapPin,
    'residential': Home,
    'commercial': Building,
    'retail': Store,
    'healthcare': Hospital,
    'medical': Stethoscope,
    'pharmaceutical': Pill,
    'insurance': Activity,
    'manufacturing': Scale,
    'food': Apple,
    'analytics': BarChart3,
    'agriculture': Leaf,
    'steel': Factory,
    'beauty': ShoppingBag,
    'shopping': ShoppingCart,
    'diet': Utensils,
    'logistics': Truck,
    'insights': TrendingUp
  };

  const clientSections = [
    {
      id: 1,
      title: "Real-estate Customers",
      bgColor: "from-blue-900/20 to-cyan-900/20",
      logos: [
        { name: "Benoit Properties", text: "benoitproperties", subtitle: "INTERNATIONAL", location: "USA & UK", iconType: "real-estate" },
        { name: "Prosperity", text: "PROSPERITY", subtitle: "REAL ESTATE", location: "EGY", iconType: "construction" },
        { name: "Erth", text: "إرث", subtitle: "ERTH", location: "KSA", iconType: "heritage" },
        { name: "Aldau", text: "ALDAU", subtitle: "DEVELOPMENT", location: "EGY", iconType: "development" },
        { name: "Memar", text: "معمار", subtitle: "MEMAR", location: "KSA", iconType: "residential" },
        { name: "Nile City", text: "NILE CITY", subtitle: "INVESTMENTS", location: "EGY", iconType: "commercial" },
        { name: "Marakez", text: "MARAKEZ", subtitle: "EGY - KSA", location: "", iconType: "retail" },
        { name: "Dorra", text: "DORRA", subtitle: "DEVELOPMENTS", location: "EGY", iconType: "construction" }
      ]
    },
    {
      id: 2,
      title: "Health-sector Customers",
      bgColor: "from-green-900/20 to-emerald-900/20",
      logos: [
        { name: "Meddbase", text: "meddbase", subtitle: "by carity", location: "Europe", iconType: "healthcare" },
        { name: "Live Tula", text: "LIVE TULA", subtitle: "", location: "US", iconType: "medical" },
        { name: "Avon", text: "AVON", subtitle: "", location: "Egypt", iconType: "pharmaceutical" },
        { name: "Peraya", text: "peraya", subtitle: "Insurance Brokerage", location: "Egypt", iconType: "insurance" }
      ]
    },
    {
      id: 3,
      title: "Manufacturing Customers",
      bgColor: "from-orange-900/20 to-red-900/20",
      logos: [
        { name: "Global Scales", text: "GLOBAL SCALES", subtitle: "& SYSTEMS CO. LTD.", location: "EG", iconType: "manufacturing" },
        { name: "Fruit Nation", text: "FRUIT NATION", subtitle: "", location: "", iconType: "food" },
        { name: "Plan Form", text: "PLAN FORM", subtitle: "CONTROL YOUR VALUE CHAIN", location: "Egypt", iconType: "analytics" },
        { name: "Galina", text: "Galina", subtitle: "Frozen Fruits & Vegetables", location: "", iconType: "agriculture" },
        { name: "Beshay Steel", text: "بشاي الصلب", subtitle: "BESHAY STEEL", location: "Egypt", iconType: "steel" }
      ]
    },
    {
      id: 4,
      title: "Retail Customers",
      bgColor: "from-purple-900/20 to-pink-900/20",
      logos: [
        { name: "Avon", text: "AVON", subtitle: "", location: "", iconType: "beauty" },
        { name: "March Al Shokh", text: "مارح الشوخ", subtitle: "", location: "", iconType: "shopping" },
        { name: "Reef Diet", text: "الريف", subtitle: "REEF DIET", location: "", iconType: "diet" },
        { name: "Town to Town Movers", text: "TOWN TO TOWN MOVERS", subtitle: "THE FRIENDLY MOVERS", location: "", iconType: "logistics" },
        { name: "Retail Insights", text: "retailinsights", subtitle: "", location: "", iconType: "insights" }
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSection((prev) => (prev + 1) % clientSections.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, clientSections.length]);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % clientSections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + clientSections.length) % clientSections.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${clientSections[currentSection].bgColor}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-32 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Our Clients
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Trusted by industry leaders across multiple sectors worldwide
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Client Showcase */}
      <section className="relative z-10 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative">
            {/* Client Container */}
            <div className="relative h-[700px] md:h-[800px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.8,
                    rotateY: 45,
                    z: -100
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                    z: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 1.2,
                    rotateY: -45,
                    z: 100
                  }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.25, 0.1, 0.25, 1],
                    staggerChildren: 0.1
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50"
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-center items-center px-8 md:px-12">
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="text-center mb-16"
                    >
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Some of our other Customers
                      </h2>
                      <p className="text-2xl md:text-3xl text-cyan-400 font-semibold">
                        {clientSections[currentSection].title}
                      </p>
                    </motion.div>

                    {/* Logos Grid */}
                    <motion.div 
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 max-w-6xl mx-auto"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      {clientSections[currentSection].logos.map((logo, index) => (
                        <motion.div
                          key={logo.name}
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            delay: 0.8 + index * 0.1, 
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                        >
                          <div className="text-center space-y-3">
                            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                              {(() => {
                                const IconComponent = iconMap[logo.iconType as keyof typeof iconMap];
                                return IconComponent ? (
                                  <IconComponent className="w-12 h-12 text-brand-primary" />
                                ) : (
                                  <Building2 className="w-12 h-12 text-brand-primary" />
                                );
                              })()}
                            </div>
                            <div className="text-white font-bold text-lg md:text-xl group-hover:text-cyan-400 transition-colors">
                              {logo.text}
                            </div>
                            {logo.subtitle && (
                              <div className="text-gray-300 text-sm md:text-base">
                                {logo.subtitle}
                              </div>
                            )}
                            {logo.location && (
                              <div className="text-gray-400 text-xs md:text-sm">
                                {logo.location}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Cloudastick Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                      className="mt-16 flex items-center space-x-3 text-gray-400"
                    >
                      <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">C</span>
                      </div>
                      <span className="text-white font-bold">CLOUDASTICK</span>
                      <span className="text-gray-400">Partner</span>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-20">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSection}
                className="p-3 bg-gray-800/80 border-gray-600 hover:bg-gray-700 text-white backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayPause}
                className="p-3 bg-gray-800/80 border-gray-600 hover:bg-gray-700 text-white backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSection}
                className="p-3 bg-gray-800/80 border-gray-600 hover:bg-gray-700 text-white backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {clientSections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentSection 
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/50" 
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl p-12 border border-cyan-500/20 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Join Our Client Family?
              </h2>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can help your business grow and succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg"
                  onClick={() => {
                    const subject = encodeURIComponent("Get Started with Cloudastick");
                    window.location.href = `mailto:arezk@cloudastick.com?subject=${subject}`;
                  }}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get Started Today
                </Button>
                <Button 
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white px-8 py-4 text-lg"
                  onClick={() => window.open("https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2txdIQjDOXs9sMVSh5H8_yadDlAOlmJY16CCT86fqUQPYCw6SH3gD0dCiUv8TnITIy1iamOQwY", "_blank")}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book a Meeting
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Clients;
