import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MemarLeadSuccess: React.FC = () => {
  const navigate = useNavigate();
  const videoRefBackground = useRef<HTMLVideoElement>(null);
  const [videoFailedBackground, setVideoFailedBackground] = useState(false);
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const [backgroundVideoAttempts, setBackgroundVideoAttempts] = useState(0);

  // Enhanced background video loading strategy
  useEffect(() => {
    const loadAndPlayVideo = async () => {
      if (!videoRefBackground.current) return;
      
      const video = videoRefBackground.current;
      
      // Set optimal video properties for autoplay
      video.muted = true;
      video.volume = 0;
      video.playsInline = true;
      video.preload = 'auto';
      video.currentTime = 0;
      
      // Add event listeners
      const handleCanPlay = () => {
        console.log('✅ Background video can play');
        video.play().catch(error => {
          console.log('❌ Play failed, retrying...', error);
          setTimeout(() => {
            if (video && !video.paused) return;
            video.play().catch(console.error);
          }, 500);
        });
      };
      
      const handleLoadedData = () => {
        console.log('✅ Background video data loaded');
        setVideoFailedBackground(false);
      };
      
      const handleError = () => {
        console.log('❌ Background video error, trying next source...');
      };
      
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('loadeddata', handleLoadedData, { once: true });
      video.addEventListener('error', handleError);
      
      video.load();
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    };

    const loadVideo = () => {
      loadAndPlayVideo().catch(console.error);
    };

    loadVideo();
    
    const timers = [100, 500, 1000, 2000].map(delay => 
      setTimeout(loadVideo, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleBackgroundVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const currentAttempts = backgroundVideoAttempts + 1;
    setBackgroundVideoAttempts(currentAttempts);
    
    console.log(`❌ Background video attempt ${currentAttempts} failed`);
    
    if (currentAttempts >= 3) {
      console.log('❌ All background video attempts failed');
      setVideoFailedBackground(true);
    } else {
      console.log(`🔄 Retrying background video (attempt ${currentAttempts + 1}/3)...`);
      setTimeout(() => {
        if (videoRefBackground.current) {
          videoRefBackground.current.load();
        }
      }, 1000 * currentAttempts);
    }
  };

  const handleBackgroundVideoLoad = () => {
    console.log('✅ Background video loaded successfully');
    setBackgroundVideoLoaded(true);
  };

  const handleBackgroundVideoClick = () => {
    if (videoRefBackground.current && videoRefBackground.current.paused) {
      videoRefBackground.current.play().catch(console.error);
    }
  };

  const handleBack = () => {
    navigate('/memar-lead-capture');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      {/* Background Video */}
      {!videoFailedBackground && (
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRefBackground}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onClick={handleBackgroundVideoClick}
            className="absolute inset-0 w-full h-full object-cover opacity-70 cursor-pointer"
            style={{ 
              minWidth: '100%', 
              minHeight: '100%',
              width: 'auto',
              height: 'auto'
            }}
            onLoadedData={handleBackgroundVideoLoad}
            onError={handleBackgroundVideoError}
          >
            <source src="/Assets/scyscrapers.mp4" type="video/mp4" />
            <source src="./Assets/scyscrapers.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        </div>
      )}
      
      {/* Fallback gradient background */}
      {videoFailedBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-green-900" />
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12 lg:mb-16"
        >
          {/* Memar Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-full blur-3xl"
              />
              <img
                src="/Assets/Cityscape/Memar/Memar_Logo.png"
                alt="Memar"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6"
          >
            Thank You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-3 md:mb-4 max-w-2xl mx-auto"
          >
            Your information has been submitted successfully.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto"
          >
            A Memar investment professional will reach out to you shortly to schedule your consultation.
          </motion.p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.0,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mb-8 md:mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              What Happens Next?
            </h2>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Personalized Review</h3>
                  <p className="text-white/80">Our investment team will review your information and investment goals.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Schedule Consultation</h3>
                  <p className="text-white/80">We'll reach out to schedule a convenient time for your consultation meeting.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Investment Strategy</h3>
                  <p className="text-white/80">During the meeting, we'll discuss tailored investment opportunities perfect for your portfolio.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-sm md:max-w-md lg:max-w-lg"
        >
          {/* Back Button */}
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
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mt-12 text-center"
        >
          <p className="text-sm md:text-base text-white/70">
            Powered by{' '}
            <a 
              href="https://cloudastick.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
            >
              Cloudastick
            </a>
            {' '}• Salesforce Partner
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MemarLeadSuccess;

