import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TarwtlLeadSuccess: React.FC = () => {
  const navigate = useNavigate();
  const videoRefBackground = useRef<HTMLVideoElement>(null);
  const videoRefForeground = useRef<HTMLVideoElement>(null);
  const [videoFailedBackground, setVideoFailedBackground] = useState(false);
  const [videoFailedForeground, setVideoFailedForeground] = useState(false);

  // Ensure background video starts playing
  useEffect(() => {
    const playVideo = () => {
      if (videoRefBackground.current) {
        videoRefBackground.current.play().catch((error) => {
          console.log('Background video autoplay prevented:', error);
          // Try again after a short delay
          setTimeout(() => {
            if (videoRefBackground.current) {
              videoRefBackground.current.play().catch((retryError) => {
                console.log('Background video retry failed:', retryError);
              });
            }
          }, 1000);
        });
      }
    };

    // Try to play immediately
    playVideo();

    // Also try after component is fully mounted
    const timer = setTimeout(playVideo, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackgroundVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.log('❌ Background video failed to load, showing fallback background');
    setVideoFailedBackground(true);
  };

  const handleForegroundVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.log('❌ Foreground video failed to load, showing Vimeo fallback');
    setVideoFailedForeground(true);
  };

  const handleBackgroundVideoClick = () => {
    if (videoRefBackground.current && videoRefBackground.current.paused) {
      videoRefBackground.current.play().catch(console.error);
    }
  };

  const handleBack = () => {
    navigate('/tarwtl-lead-capture');
  };

  const handleLearnMore = () => {
    window.location.href = 'https://arabic.ai/';
  };


  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
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
            className="absolute inset-0 w-full h-full object-cover opacity-80 cursor-pointer"
            onLoadedData={() => console.log('✅ Background video loaded successfully')}
            onError={handleBackgroundVideoError}
            onLoadStart={() => console.log('🔄 Background video loading started')}
            onCanPlay={() => console.log('▶️ Background video can play')}
          >
            <source src="/Assets/arabicaivideo.mp4" type="video/mp4" />
            <source src="./Assets/arabicaivideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        </div>
      )}
      
      {/* Fallback gradient background */}
      {videoFailedBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-indigo-900/80" />
      )}
      
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />

      {/* Content - Thank You Message First */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 min-h-screen">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
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

        {/* Video Section - Morph Transition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            delay: 1.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="w-full max-w-4xl mb-12"
        >
          <motion.div
            initial={{ borderRadius: "50%" }}
            animate={{ borderRadius: "1rem" }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl"
          >
            {!videoFailedForeground ? (
              <video
                ref={videoRefForeground}
                autoPlay
                muted
                loop
                playsInline
                controls
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-64 md:h-80 rounded-xl object-cover shadow-lg"
                style={{ 
                  backgroundColor: '#000',
                  '--webkit-media-controls-panel': 'display: block'
                } as React.CSSProperties}
                onLoadedData={() => console.log('✅ Foreground video loaded successfully')}
                onError={handleForegroundVideoError}
              >
                <source src="/Assets/agrid-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-64 md:h-80 rounded-xl shadow-lg overflow-hidden">
                <div style={{padding:'75% 0 0 0', position:'relative'}}>
                  <iframe 
                    src="https://player.vimeo.com/video/1126661789?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;muted=1" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} 
                    title="Meet Agrid!"
                  />
                </div>
              </div>
            )}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="text-white text-sm md:text-base text-center mt-3 font-medium"
            >
              Meet Agrid!
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
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

