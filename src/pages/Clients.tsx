
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { 
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
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // null = show all industries

  // Parse logo files and create sections
  const allClientSections = useMemo(() => parseLogoFiles(), []);
  
  // Get industry filters
  const industryFilters = useMemo(() => getIndustryFilters(allClientSections), [allClientSections]);
  
  // Filter sections based on selected filter (but keep all sections)
  const clientSections = useMemo(() => {
    return allClientSections;
  }, [allClientSections]);

  // Get all logos - always show all
  const allLogos = useMemo(() => {
    return allClientSections.flatMap(section => section.logos);
  }, [allClientSections]);

  const clearFilter = () => {
    setSelectedFilter(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-slate-900/20" />
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
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/50'
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
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/50'
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
            {allLogos.length > 0 ? (
              /* Show All Logos with Section Breaks */
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50">
                <div className="relative z-10 p-8 md:p-12">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-center mb-16"
                  >
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight break-words">
                      Our Valued Clients
                    </h2>
                    <p className="text-xl md:text-2xl lg:text-3xl text-cyan-400 font-semibold break-words">
                      Trusted by companies across all industries
                    </p>
                  </motion.div>

                  {/* All Logos Grid - Single Grid with Highlighted Filter */}
                  <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {allLogos.map((logo, index) => {
                      // Check if this logo belongs to the selected filter category
                      const logoSection = allClientSections.find(section => section.logos.includes(logo));
                      const isHighlighted = selectedFilter && logoSection?.title === selectedFilter;
                      
                      return (
                        <motion.div
                          key={logo.name}
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            delay: 0.6 + index * 0.03, 
                            duration: 0.5,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.05,
                            transition: { duration: 0.2 }
                          }}
                          className={`backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-6 border transition-all duration-300 group cursor-pointer min-h-[140px] md:min-h-[180px] flex flex-col justify-between ${
                            isHighlighted
                              ? 'bg-amber-600/30 border-amber-500/50 shadow-lg shadow-amber-600/30 hover:bg-amber-600/40 hover:border-amber-400/70'
                              : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-cyan-400/50'
                          }`}
                        >
                          <div className="text-center space-y-2">
                            <div className="flex justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                              <img
                                src={logo.logoPath}
                                alt={`${logo.name} logo`}
                                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300"
                                onError={(e) => {
                                  // Fallback to a simple text display if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-cyan-400/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm md:text-lg">${logo.name.charAt(0)}</div>`;
                                  }
                                }}
                              />
                            </div>
                            <div className={`font-bold text-xs md:text-sm lg:text-base group-hover:text-cyan-300 transition-colors break-words ${
                              isHighlighted ? 'text-amber-200' : 'text-white'
                            }`}>
                              {logo.name}
                            </div>
                            <div className={`text-xs break-words ${
                              isHighlighted ? 'text-amber-300/80' : 'text-gray-300'
                            }`}>
                              {logo.industry}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Cloudastick Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mt-16 flex items-center justify-center space-x-3 text-gray-400"
                  >
                    <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">C</span>
                    </div>
                    <span className="text-white font-bold">CLOUDASTICK</span>
                    <span className="text-gray-400">Partner</span>
                  </motion.div>
                </div>
              </div>
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
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg"
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
