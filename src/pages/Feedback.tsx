
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Star, Quote, Sparkles, Award } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";
import { useLanguage } from "../contexts/LanguageContext";

const Feedback = () => {
  const { t } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      quote: "Cloudastick have been an incredibly valuable partner for us for many years. They take the time to clearly understand their clients' business requirements not just technical needs, but also strategies, environment and competitors delivering a solution that is a strategic asset.",
      author: "Simon Thorley",
      position: "CEO, InTuition Languages",
      company: "InTuition Languages",
      image: "/Assets/Customers Individuals Photos/Simon Thorley CEO, InTuition Languages.png",
      rating: 5,
      bgColor: "from-indigo-900/95 via-purple-900/95 to-pink-900/95",
      accentColor: "from-indigo-400 to-purple-400"
    },
    {
      id: 2,
      quote: "We had a fantastic experience working with the Cloudastick team for our Salesforce needs. They consistently met our expectations by being readily available whenever we needed support. Even when encountering unfamiliar challenges, they demonstrated their commitment by thoroughly researching and providing well-informed solutions. Their dedication and problem-solving skills have been invaluable to our team.",
      author: "Nour H.",
      position: "Head of Growth, Meddbase",
      company: "Meddbase",
      image: "/Assets/Customers Individuals Photos/Nour H. Head of Growth. Meddbase.png",
      rating: 5,
      bgColor: "from-blue-900/95 via-cyan-900/95 to-teal-900/95",
      accentColor: "from-blue-400 to-cyan-400"
    },
    {
      id: 3,
      quote: "The team at Cloudastick did a great job helping us get various cloud based systems integrated with our instance of Salesforce Health Cloud. We had many custom apex classes written to support the workflows we needed. The scope included Salesforce Health Cloud, Salesforce Marketing Cloud, Salesforce Connect, Salesforce Communities.",
      author: "Nick Morrill",
      position: "VP of Software Engineering, Tula Health",
      company: "Tula Health",
      image: "/Assets/Customers Individuals Photos/Nick Morrill VP of Software Engineering, Tula Health_Live TULA.png",
      rating: 5,
      bgColor: "from-teal-900/95 via-emerald-900/95 to-green-900/95",
      accentColor: "from-teal-400 to-emerald-400"
    },
    {
      id: 4,
      quote: "I recommend Cloudastick Systems Co. for any Salesforce Implementation or Support projects because they showed a great dedication, professionalism and technical expertise during the implementation project with our company and they still giving us an unstoppable support and very valuable advises on how to grow the business and increase the effectiveness of our sales people.",
      author: "Ahmed Yousry",
      position: "Sales Effectiveness Project Leader, FedEx",
      company: "FedEx",
      image: "/Assets/Customers Individuals Photos/Ahmed Yousry Sales Effectiveness Project Leader, FedEx.png",
      rating: 5,
      bgColor: "from-orange-900/95 via-red-900/95 to-rose-900/95",
      accentColor: "from-orange-400 to-red-400"
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 transform rotate-45 scale-150" />
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-600 to-gray-700 transform -rotate-45 scale-150 translate-x-1/4" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentReview}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${reviews[currentReview].bgColor}`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-gray-800/30 to-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-6 tracking-tight">
              {t('feedback.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t('feedback.hero.subtitle')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Review Showcase */}
      <section className="relative z-10 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative">
            {/* Review Container */}
            <div className="relative min-h-[850px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.95,
                    y: 20
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.95,
                    y: -20
                  }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-2 border-gray-700/50"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className={`absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br ${reviews[currentReview].accentColor} blur-3xl`}
                    />
                    <motion.div
                      animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br ${reviews[currentReview].accentColor} blur-3xl`}
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center py-12">
                    <div className="w-full max-w-7xl mx-auto px-8 md:px-12">
                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                        
                        {/* Full Figure Photo - Takes 2 columns */}
                        <motion.div
                          initial={{ opacity: 0, x: -50, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.8 }}
                          className="lg:col-span-2 flex justify-center"
                        >
                          <div className="relative group">
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${reviews[currentReview].accentColor} blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl`} />
                            
                            {/* Main Image Container */}
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-gray-700/50 group-hover:border-gray-600 transition-all duration-500">
                              <motion.img
                                src={reviews[currentReview].image}
                                alt={reviews[currentReview].author}
                                className="w-full h-[650px] object-contain object-bottom bg-gradient-to-br from-gray-800/50 to-gray-900/50"
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.8 }}
                              />
                              
                              {/* Overlay Gradient */}
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Award Badge */}
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                              className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${reviews[currentReview].accentColor} rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-900`}
                            >
                              <Award className="w-10 h-10 text-white" />
                            </motion.div>

                            {/* 5 Star Badge */}
                            <motion.div
                              initial={{ scale: 0, y: 20 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{ delay: 0.8, type: "spring" }}
                              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-full shadow-2xl border-2 border-yellow-400"
                            >
                              <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-white fill-white" />
                                ))}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Review Content - Takes 3 columns */}
                        <motion.div
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                          className="lg:col-span-3 space-y-8"
                        >
                          {/* Quote Icon */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className={`w-16 h-16 bg-gradient-to-br ${reviews[currentReview].accentColor} rounded-2xl flex items-center justify-center shadow-xl`}
                          >
                            <Quote className="w-8 h-8 text-white" />
                          </motion.div>

                          {/* Rating */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex items-center gap-3"
                          >
                            <StarRating rating={reviews[currentReview].rating} />
                            <span className="text-yellow-400 font-bold text-xl">5.0</span>
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                          </motion.div>
                          
                          {/* Quote Text */}
                          <motion.blockquote 
                            className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                          >
                            <span className="text-yellow-400 text-4xl font-serif leading-none">"</span>
                            <span className="italic">{reviews[currentReview].quote}</span>
                            <span className="text-yellow-400 text-4xl font-serif leading-none">"</span>
                          </motion.blockquote>

                          {/* Author Info */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="space-y-3 pt-6 border-t-2 border-gray-700/50"
                          >
                            <h3 className={`text-3xl font-bold bg-gradient-to-r ${reviews[currentReview].accentColor} bg-clip-text text-transparent`}>
                              {reviews[currentReview].author}
                            </h3>
                            <p className="text-lg text-gray-300 font-medium">
                              {reviews[currentReview].position}
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                              <div className={`px-4 py-2 bg-gradient-to-r ${reviews[currentReview].accentColor} rounded-full`}>
                                <span className="text-white font-bold text-sm">
                                  {reviews[currentReview].company}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Award className="w-4 h-4" />
                                <span>Verified Client</span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
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
                onClick={prevReview}
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
                onClick={nextReview}
                className="p-3 bg-gray-800/80 border-gray-600 hover:bg-gray-700 text-white backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentReview 
                      ? "bg-yellow-400 shadow-lg shadow-yellow-400/50" 
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
            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-red-600/20 rounded-3xl p-16 border-2 border-yellow-500/30 backdrop-blur-md shadow-2xl">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full blur-3xl"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center mb-6">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>

                  <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent mb-6">
                    Ready to Join Our Success Stories?
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Let us help you achieve the same level of success as our satisfied clients. 
                    <span className="block mt-2 text-yellow-300 font-semibold">
                      Transform your business with Cloudastick today!
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                  <Button 
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                    onClick={() => window.open("https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2txdIQjDOXs9sMVSh5H8_yadDlAOlmJY16CCT86fqUQPYCw6SH3gD0dCiUv8TnITIy1iamOQwY", "_blank")}
                  >
                    <span className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6" />
                      Start Your Journey
                      <Sparkles className="w-6 h-6" />
                    </span>
                  </Button>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm">Trusted by Industry Leaders</span>
                  </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-yellow-500/30"
                >
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">50+</div>
                    <div className="text-gray-300">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">100%</div>
                    <div className="text-gray-300">5-Star Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">10+</div>
                    <div className="text-gray-300">Years Experience</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
