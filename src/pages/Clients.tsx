
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Calendar, 
  Mail,
  Filter
} from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";
import { parseLogoFiles, getIndustryFilters, ClientSection } from "../utils/logoParser";

const Clients = () => {
  const { t } = useLanguage();
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // null = show all industries

  // Parse logo files and create sections
  const allClientSections = useMemo(() => parseLogoFiles(), []);
  
  // Get industry filters
  const industryFilters = useMemo(() => getIndustryFilters(allClientSections), [allClientSections]);
  
  // Filter sections based on selected filter
  const clientSections = useMemo(() => {
    if (!selectedFilter) return allClientSections;
    return allClientSections.filter(section => section.title === selectedFilter);
  }, [allClientSections, selectedFilter]);

  useEffect(() => {
    if (isPlaying && clientSections.length > 0) {
      const interval = setInterval(() => {
        setCurrentSection((prev) => (prev + 1) % clientSections.length);
      }, 6000); // Reduced from 8000ms to 6000ms for better pacing
      return () => clearInterval(interval);
    }
  }, [isPlaying, clientSections.length]);

  // Reset current section when filter changes
  useEffect(() => {
    setCurrentSection(0);
  }, [selectedFilter]);

  const nextSection = () => {
    if (clientSections.length > 0) {
      setCurrentSection((prev) => (prev + 1) % clientSections.length);
    }
  };

  const prevSection = () => {
    if (clientSections.length > 0) {
      setCurrentSection((prev) => (prev - 1 + clientSections.length) % clientSections.length);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const clearFilter = () => {
    setSelectedFilter(null);
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
              {t('clients.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t('clients.hero.subtitle')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="relative z-10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !selectedFilter
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/50'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600'
              }`}
            >
              <Filter className="w-4 h-4 mr-2 inline" />
              All Industries
            </motion.button>
            {industryFilters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/50'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
          {selectedFilter && (
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Showing {clientSections.length} section{clientSections.length !== 1 ? 's' : ''} for {selectedFilter}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Client Showcase */}
      <section className="relative z-10 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative">
            {clientSections.length > 0 ? (
              <>
                {/* Client Container */}
                <div className="relative h-[700px] md:h-[800px] rounded-3xl overflow-hidden shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSection}
                      initial={{ 
                        opacity: 0, 
                        y: 50,
                        scale: 0.95
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: 1
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: -50,
                        scale: 1.05
                      }}
                      transition={{ 
                        duration: 0.8, 
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50"
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
                          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto mb-20"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                        >
                          {clientSections[currentSection].logos.map((logo, index) => (
                            <motion.div
                              key={logo.name}
                              initial={{ opacity: 0, y: 30, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ 
                                delay: 0.6 + index * 0.1, 
                                duration: 0.5,
                                ease: "easeOut"
                              }}
                              whileHover={{ 
                                y: -8, 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                              }}
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 hover:border-cyan-400/50 transition-all duration-300 group cursor-pointer"
                            >
                              <div className="text-center space-y-2">
                                <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                  <img
                                    src={logo.logoPath}
                                    alt={`${logo.name} logo`}
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                                    onError={(e) => {
                                      // Fallback to a simple text display if image fails to load
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `<div class="w-16 h-16 md:w-20 md:h-20 bg-cyan-400/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-lg">${logo.name.charAt(0)}</div>`;
                                      }
                                    }}
                                  />
                                </div>
                                <div className="text-white font-bold text-base md:text-lg group-hover:text-cyan-300 transition-colors">
                                  {logo.name}
                                </div>
                                <div className="text-gray-300 text-xs md:text-sm">
                                  {logo.industry}
                                </div>
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

              </>
            ) : (
              /* Empty State */
              <div className="relative h-[700px] md:h-[800px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    No clients found
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Try selecting a different industry filter
                  </p>
                  <Button
                    onClick={clearFilter}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg"
                  >
                    <Filter className="mr-2 h-5 w-5" />
                    Show All Industries
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Controls - Outside main container to prevent overlap */}
      {clientSections.length > 0 && (
        <section className="relative z-10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center space-x-6">
              {/* Indicators */}
              <div className="flex space-x-2">
                {clientSections.map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentSection(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSection 
                        ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 scale-125" 
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                  />
                ))}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevSection}
                  className="p-3 bg-gray-800/90 border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 text-white backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlayPause}
                  className="p-3 bg-gray-800/90 border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 text-white backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSection}
                  className="p-3 bg-gray-800/90 border border-gray-600 hover:bg-gray-700 hover:border-cyan-400 text-white backdrop-blur-sm rounded-full transition-all duration-300 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      )}

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
