
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";

const Surveys = () => {
  const [currentSurvey, setCurrentSurvey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const surveys = [
    {
      id: 1,
      title: "Customer Satisfaction Survey",
      description: "Comprehensive feedback collection system with real-time analytics and automated follow-ups.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      features: ["Real-time responses", "Automated scoring", "Custom branding", "Mobile optimized"],
      bgColor: "from-blue-900/20 to-purple-900/20"
    },
    {
      id: 2,
      title: "Product Feedback Analysis",
      description: "Advanced product evaluation system with sentiment analysis and recommendation engine.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      features: ["Sentiment analysis", "Visual feedback", "Integration ready", "AI insights"],
      bgColor: "from-green-900/20 to-teal-900/20"
    },
    {
      id: 3,
      title: "Employee Engagement Platform",
      description: "Internal survey system for measuring employee satisfaction and organizational health.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      features: ["Anonymous responses", "Trend analysis", "Department insights", "Action planning"],
      bgColor: "from-orange-900/20 to-red-900/20"
    },
    {
      id: 4,
      title: "Market Research Suite",
      description: "Comprehensive market analysis tools with demographic targeting and competitive insights.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      features: ["Demographic targeting", "Competitive analysis", "Market trends", "Export capabilities"],
      bgColor: "from-cyan-900/20 to-blue-900/20"
    },
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSurvey((prev) => (prev + 1) % surveys.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, surveys.length]);

  const nextSurvey = () => {
    setCurrentSurvey((prev) => (prev + 1) % surveys.length);
  };

  const prevSurvey = () => {
    setCurrentSurvey((prev) => (prev - 1 + surveys.length) % surveys.length);
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
            key={currentSurvey}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${surveys[currentSurvey].bgColor}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-32 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Survey Solutions
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Powerful survey tools that help you gather insights and make data-driven decisions.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Survey Showcase */}
      <section className="relative z-10 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative">
            {/* Survey Container */}
            <div className="relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSurvey}
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
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.img
                      src={surveys[currentSurvey].image}
                      alt={surveys[currentSurvey].title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-gray-900/50" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="w-full max-w-4xl mx-auto px-8 md:px-12">
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="space-y-8"
                      >
                        <div className="space-y-6">
                          <motion.h2 
                            className="text-4xl md:text-6xl font-bold text-white leading-tight"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                          >
                            {surveys[currentSurvey].title}
                          </motion.h2>
                          
                          <motion.p 
                            className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                          >
                            {surveys[currentSurvey].description}
                          </motion.p>
                        </div>

                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        >
                          {surveys[currentSurvey].features.map((feature, index) => (
                            <motion.div
                              key={feature}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                              className="flex items-center space-x-3 text-gray-300"
                            >
                              <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                              <span className="text-sm md:text-base">{feature}</span>
                            </motion.div>
                          ))}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        >
                          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg">
                            Explore Solution
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-6 z-20">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSurvey}
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
                onClick={nextSurvey}
                className="p-3 bg-gray-800/80 border-gray-600 hover:bg-gray-700 text-white backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {surveys.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSurvey(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentSurvey 
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
                Ready to Start Surveying?
              </h2>
              <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
                Create your first survey in minutes and start gathering valuable insights.
              </p>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 text-lg">
                Get Started Now
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Surveys;
