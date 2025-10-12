import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TarwtlLeadSuccess: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked, user interaction needed
        console.log('Video autoplay was prevented');
      });
    }
  }, []);

  const handleBack = () => {
    navigate('/tarwtl-lead-capture');
  };

  const handleLearnMore = () => {
    window.location.href = 'https://arabic.ai/';
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Assets/arabicaivideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Thank You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 mb-4 max-w-2xl mx-auto"
          >
            Your information has been submitted successfully.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Our team will reach out to you shortly to discuss your AI Agent needs.
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          {/* Learn More Button (Primary) */}
          <motion.button
            onClick={handleLearnMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-2xl shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Learn More
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>

          {/* Back Button (Secondary) */}
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold rounded-2xl border-2 border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm md:text-base text-white/70">
            Powered by{' '}
            <a 
              href="https://arabic.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              Arabic.ai
            </a>
            {' '}• The Leading Arabic AI Platform
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TarwtlLeadSuccess;

