
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Star } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";

const Feedback = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const reviews = [
    {
      id: 1,
      quote: "Cloudastick have been an incredibly valuable partner for us for many years. They take the time to clearly understand their clients' business requirements not just technical needs, but also strategies, environment and competitors delivering a solution that is a strategic asset.",
      author: "Simon Thorley",
      position: "CEO, InTuition Languages",
      company: "InTuition Languages",
      image: "/lovable-uploads/0394d2f8-7fb7-406b-ae27-dac899d389ca.png",
      rating: 5,
      bgColor: "from-gray-800/90 to-gray-900/95"
    },
    {
      id: 2,
      quote: "We had a fantastic experience working with the Cloudastick team for our Salesforce needs. They consistently met our expectations by being readily available whenever we needed support. Even when encountering unfamiliar challenges, they demonstrated their commitment by thoroughly researching and providing well-informed solutions. Their dedication and problem-solving skills have been invaluable to our team.",
      author: "Nour H.",
      position: "Head of Growth, Meddbase",
      company: "Meddbase",
      image: "/lovable-uploads/5e8ee6e4-e9ed-4b1f-9479-d780948d4621.png",
      rating: 5,
      bgColor: "from-blue-900/90 to-purple-900/95"
    },
    {
      id: 3,
      quote: "The team at Cloudastick did a great job helping us get various cloud based systems integrated with our instance of Salesforce Health Cloud. We had many custom apex classes written to support the workflows we needed. The scope included Salesforce Health Cloud, Salesforce Marketing Cloud, Salesforce Connect, Salesforce Communities.",
      author: "Nick Morrill",
      position: "VP of Software Engineering, Tula HealthLive TULA",
      company: "Tula HealthLive TULA",
      image: "/lovable-uploads/eeb52347-35fe-4e7b-9252-e7b606fba1c4.png",
      rating: 5,
      bgColor: "from-teal-900/90 to-cyan-900/95"
    },
    {
      id: 4,
      quote: "I recommend Cloudastick Systems Co. for any Salesforce Implementation or Support projects because they showed a great dedication, professionalism and technical expertise during the implementation project with our company and they still giving us an unstoppable support and very valuable advises on how to grow the business and increase the effectiveness of our sales people.",
      author: "Ahmed Yousry",
      position: "Sales Effectiveness Project Leader, FedEx",
      company: "FedEx",
      image: "/lovable-uploads/4fe89c11-3a26-4657-b290-84aa60913e64.png",
      rating: 5,
      bgColor: "from-orange-900/90 to-red-900/95"
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
              Customer Reviews
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Hear what our clients have to say about their experience with Cloudastick
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Review Showcase */}
      <section className="relative z-10 py-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative">
            {/* Review Container */}
            <div className="relative h-[700px] md:h-[800px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.9,
                    rotateX: 30
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateX: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 1.1,
                    rotateX: -30
                  }}
                  transition={{ 
                    duration: 1.5, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/50"
                >
                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center">
                    <div className="w-full max-w-6xl mx-auto px-8 md:px-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Review Content */}
                        <motion.div
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="space-y-8"
                        >
                          <div className="space-y-6">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4, duration: 0.8 }}
                            >
                              <StarRating rating={reviews[currentReview].rating} />
                            </motion.div>
                            
                            <motion.blockquote 
                              className="text-lg md:text-xl text-gray-300 leading-relaxed italic"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                            >
                              "{reviews[currentReview].quote}"
                            </motion.blockquote>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6, duration: 0.8 }}
                              className="space-y-2"
                            >
                              <h3 className="text-xl font-bold text-white">
                                {reviews[currentReview].author}
                              </h3>
                              <p className="text-gray-400">
                                {reviews[currentReview].position}
                              </p>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Person Photo & Company Branding */}
                        <motion.div
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                          className="flex flex-col items-center justify-center space-y-8"
                        >
                          {/* Person Photo */}
                          <div className="relative">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-600 shadow-2xl">
                              <img
                                src={reviews[currentReview].image}
                                alt={reviews[currentReview].author}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="w-6 h-6 text-yellow-800 fill-yellow-800" />
                            </div>
                          </div>

                          {/* Company Branding */}
                          <div className="text-center space-y-4">
                            <div className="text-4xl md:text-5xl font-bold text-gray-600 opacity-50">
                              {reviews[currentReview].company}
                            </div>
                            <div className="flex items-center justify-center space-x-4">
                              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                <div className="text-lg font-bold text-gray-800">
                                  {reviews[currentReview].company.charAt(0)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-400 uppercase tracking-wide">
                                  Cloudastick
                                </div>
                                <div className="text-xs text-gray-500">
                                  Your Trusted Salesforce Partner
                                </div>
                              </div>
                            </div>
                          </div>
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
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl p-12 border border-yellow-500/20 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Join Our Success Stories?
              </h2>
              <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
                Let us help you achieve the same level of success as our satisfied clients.
              </p>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg"
                onClick={() => window.open("https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2txdIQjDOXs9sMVSh5H8_yadDlAOlmJY16CCT86fqUQPYCw6SH3gD0dCiUv8TnITIy1iamOQwY", "_blank")}
              >
                Start Your Journey
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
