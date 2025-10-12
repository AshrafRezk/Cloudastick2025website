import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TarwtlLeadSuccess: React.FC = () => {
  const navigate = useNavigate();
  const videoRefBackground = useRef<HTMLVideoElement>(null);
  const videoRefForeground = useRef<HTMLVideoElement>(null);
  const [videoFailedBackground, setVideoFailedBackground] = useState(false);
  const [videoFailedForeground, setVideoFailedForeground] = useState(false);
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const [foregroundVideoLoaded, setForegroundVideoLoaded] = useState(false);

  // Load Vimeo player script for enhanced functionality
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Ensure background video starts playing with multiple strategies
  useEffect(() => {
    const playVideo = () => {
      if (videoRefBackground.current) {
        const video = videoRefBackground.current;
        
        // Set video properties for better autoplay success
        video.muted = true; // Ensure muted for autoplay
        video.volume = 0;
        video.currentTime = 0;
        
        // Try to play with different strategies
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('✅ Background video playing successfully');
            setVideoFailedBackground(false);
          }).catch((error) => {
            console.log('❌ Background video autoplay failed:', error);
            
            // Try again with user interaction simulation
            setTimeout(() => {
              if (video) {
                video.load(); // Reload video
                video.muted = true;
                video.play().catch((retryError) => {
                  console.log('❌ Background video retry failed:', retryError);
                  setVideoFailedBackground(true);
                });
              }
            }, 1000);
          });
        }
      }
    };

    // Multiple attempts with increasing delays
    const attempts = [0, 500, 1000, 2000];
    const timers = attempts.map(delay => 
      setTimeout(() => {
        playVideo();
      }, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleBackgroundVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.log('❌ Background video failed to load, showing fallback background');
    setVideoFailedBackground(true);
  };

  const handleForegroundVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.log('❌ Foreground video failed to load, showing Vimeo fallback');
    setVideoFailedForeground(true);
  };

  const handleBackgroundVideoLoad = () => {
    console.log('✅ Background video loaded successfully');
    setBackgroundVideoLoaded(true);
  };

  const handleForegroundVideoLoad = () => {
    console.log('✅ Foreground video loaded successfully');
    setForegroundVideoLoaded(true);
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

  const launchMeetAgrid = () => {
    // Reset both video states
    setVideoFailedBackground(false);
    setVideoFailedForeground(false);
    setBackgroundVideoLoaded(false);
    setForegroundVideoLoaded(false);
    
    // Force both videos to reload and play
    if (videoRefBackground.current) {
      videoRefBackground.current.load();
      videoRefBackground.current.play().catch(console.error);
    }
    
    if (videoRefForeground.current) {
      videoRefForeground.current.load();
      videoRefForeground.current.play().catch(console.error);
    }
  };


  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Custom CSS for video controls */}
      <style dangerouslySetInnerHTML={{
        __html: `
          video::-webkit-media-controls-panel {
            display: block !important;
            background: rgba(0, 0, 0, 0.8) !important;
          }
          video::-webkit-media-controls-play-button {
            display: block !important;
          }
          video::-webkit-media-controls-volume-slider {
            display: block !important;
          }
          video::-webkit-media-controls-timeline {
            display: block !important;
          }
          video::-webkit-media-controls-current-time-display {
            display: block !important;
          }
          video::-webkit-media-controls-time-remaining-display {
            display: block !important;
          }
        `
      }} />
              {/* Background Video */}
              {!videoFailedBackground && (
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    ref={videoRefBackground}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onClick={handleBackgroundVideoClick}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 cursor-pointer"
                    style={{ 
                      minWidth: '100%', 
                      minHeight: '100%',
                      width: 'auto',
                      height: 'auto'
                    }}
                    onLoadedData={handleBackgroundVideoLoad}
                    onError={handleBackgroundVideoError}
                    onLoadStart={() => console.log('🔄 Background video loading started')}
                    onCanPlay={() => console.log('▶️ Background video can play')}
                    onPlaying={() => console.log('🎬 Background video is playing')}
                  >
                    <source src="/Assets/arabicaivideo.mp4" type="video/mp4" />
                    <source src="./Assets/arabicaivideo.mp4" type="video/mp4" />
                    <source src="Assets/arabicaivideo.mp4" type="video/mp4" />
                    <source src="https://arabic.ai/Assets/arabicaivideo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Dark Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
                </div>
              )}
      
      {/* Fallback Vimeo background */}
      {videoFailedBackground && (
        <div className="absolute inset-0 overflow-hidden">
          <div style={{padding:'100% 0 0 0', position:'relative'}}>
            <iframe 
              src="https://player.vimeo.com/video/1126666272?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1&amp;loop=1" 
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} 
              title="arabicaivideo"
            />
          </div>
          
          {/* Meet Agrid button for background video */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={launchMeetAgrid}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🎬 Meet Agrid
            </button>
          </div>
          
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        </div>
      )}
      
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />

              {/* Content - Optimized for Desktop and Mobile */}
              <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-12 lg:py-16 min-h-screen">
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-8 md:mb-12 lg:mb-16"
                >
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
                  className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mb-8 md:mb-12"
                >
          <motion.div
            initial={{ borderRadius: "50%" }}
            animate={{ borderRadius: "1rem" }}
            transition={{ duration: 1.5, delay: 1.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl"
          >
            {!videoFailedForeground ? (
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black" style={{ aspectRatio: '16/9' }}>
                <video
                  ref={videoRefForeground}
                  autoPlay
                  loop
                  playsInline
                  controls
                  controlsList="nodownload nofullscreen noremoteplayback"
                  className="w-full h-full object-contain"
                  style={{ 
                    backgroundColor: '#000',
                    minHeight: '320px',
                    '--webkit-media-controls': 'display: block',
                    '--webkit-media-controls-panel': 'display: block',
                    '--webkit-media-controls-play-button': 'display: block',
                    '--webkit-media-controls-volume-slider': 'display: block',
                    '--webkit-media-controls-timeline': 'display: block'
                  } as React.CSSProperties}
                  onLoadedData={handleForegroundVideoLoad}
                  onError={handleForegroundVideoError}
                >
                  <source src="/Assets/agrid-video.mp4" type="video/mp4" />
                  <source src="./Assets/agrid-video.mp4" type="video/mp4" />
                  <source src="Assets/agrid-video.mp4" type="video/mp4" />
                  <source src="https://arabic.ai/Assets/agrid-video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Loading indicator */}
                {!foregroundVideoLoaded && !videoFailedForeground && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                      <p className="text-white/70 text-sm">Loading video...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full rounded-xl shadow-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <div style={{padding:'56.25% 0 0 0', position:'relative'}}>
                  <iframe 
                    src="https://player.vimeo.com/video/1126661789?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;loop=1&amp;muted=0" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} 
                    title="Meet Agrid!"
                  />
                </div>
                
                {/* Meet Agrid button for foreground video */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={launchMeetAgrid}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 backdrop-blur-sm text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-xs font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🎬 Meet Agrid
                  </button>
                </div>
              </div>
            )}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="text-center mt-3"
            >
              <p className="text-white text-sm md:text-base font-medium mb-3">
                Meet Agrid!
              </p>
              <motion.button
                onClick={launchMeetAgrid}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
              >
                🎬 Launch Video Experience
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.2 }}
                  className="flex flex-col sm:flex-row gap-4 w-full max-w-sm md:max-w-md lg:max-w-lg"
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

