import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Target, 
  TrendingUp, 
  Sparkles,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';

const SalesforcePowerSuccess = () => {
  const successAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play success audio
    if (successAudioRef.current) {
      successAudioRef.current.volume = 0.1;
      successAudioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Audio Element */}
      <audio ref={successAudioRef} preload="auto">
        <source src="/Assets/cloudastickwebsiteloadmusic.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <img 
                  src="/Assets/Company Logos/white-logo-dark.webp" 
                  alt="Cloudastick Logo" 
                  className="h-8 w-auto"
                />
                <div className="text-xl font-bold text-white">CLOUDASTICK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Thank You!
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Your Salesforce journey has begun. Our team will contact you within 24 hours to discuss your personalized solution.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-12">
                  <Sparkles className="w-4 h-4" />
                  Your personalized Salesforce solution is being prepared
                </div>
              </motion.div>

              {/* What Happens Next */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-12"
              >
                <h2 className="text-3xl font-bold text-white mb-8">What Happens Next?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">1. Initial Consultation</h3>
                    <p className="text-gray-400">
                      Our Salesforce experts will schedule a call to understand your specific business needs and challenges.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">2. Custom Solution Design</h3>
                    <p className="text-gray-400">
                      We'll design a tailored Salesforce solution that addresses your industry-specific requirements.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">3. Implementation & Growth</h3>
                    <p className="text-gray-400">
                      We'll implement your solution and provide ongoing support to ensure your success.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Need Immediate Assistance?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="text-white font-semibold">Email Us</p>
                      <p className="text-gray-400 text-sm">info@cloudastick.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="text-white font-semibold">Call Us</p>
                      <p className="text-gray-400 text-sm">+971 4 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                    <div>
                      <p className="text-white font-semibold">Live Chat</p>
                      <p className="text-gray-400 text-sm">Available 24/7</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold text-white mb-8">Why Choose Cloudastick?</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Salesforce Crest Partner', value: 'Gold Level' },
                    { label: 'Certified Experts', value: '50+ Certifications' },
                    { label: 'Projects Delivered', value: '500+' },
                    { label: 'Client Satisfaction', value: '98%' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/contact">
                  <Button variant="primary" size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Contact Us Directly
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                
                <Link to="/salesforce-power">
                  <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                    Explore More Solutions
                  </Button>
                </Link>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesforcePowerSuccess;
