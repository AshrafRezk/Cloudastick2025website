import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartupSequenceProps {
  onComplete: () => void;
}

const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showAura, setShowAura] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [buttonRipple, setButtonRipple] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Create persistent audio element that survives component unmount
  useEffect(() => {
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.src = '/Assets/cloudastickwebsiteloadmusic.mp3';
      audio.volume = 0.2;
      audio.loop = false;
      
      audio.onloadeddata = () => {
        console.log('✅ Audio loaded successfully');
        setAudioLoaded(true);
      };
      
      audio.onerror = (e) => {
        console.log('❌ Audio failed to load:', e);
        setAudioError(true);
      };
      
      audio.onended = () => {
        console.log('🎵 Audio track finished playing');
      };
      
      // Append to body to ensure it persists
      document.body.appendChild(audio);
      audioRef.current = audio;
    }

    return () => {
      // Don't remove audio element - let it continue playing
      // It will be cleaned up when the page unloads
    };
  }, []);

  // Ensure video starts playing
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  // Handle the start button click
  const handleStartExperience = async () => {
    // Trigger ripple effect
    setButtonRipple(true);
    setTimeout(() => setButtonRipple(false), 400);
    
    setIsStarted(true);
    
    // Start audio
    await playAudio();
    
    // Start the startup sequence after a brief delay
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2000); // Show logo for 2 seconds after button click
  };

  // Play audio on first interaction (click or mouse hover)
  const playAudio = async () => {
    if (audioError || !audioLoaded || audioStarted) {
      if (audioStarted) {
        console.log('🎵 Audio already playing - ignoring additional interactions');
      } else {
        console.log('⚠️ Audio not available - continuing without sound');
      }
      return;
    }

    try {
      if (audioRef.current) {
        console.log('🎵 Starting audio on first interaction...');
        await audioRef.current.play();
        setAudioStarted(true);
        console.log('✅ Audio started playing successfully and will continue until finished');
      }
    } catch (error) {
      console.log('❌ Audio play failed:', error);
    }
  };

  // Handle mouse movement for aura effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle mouse enter/leave for aura visibility
  const handleMouseEnter = () => {
    setShowAura(true);
  };

  const handleMouseLeave = () => {
    setShowAura(false);
  };

  return (
    <>
      {/* Persistent Audio Element */}
      {audioRef.current && (
        <div style={{ display: 'none' }}>
          {/* Audio element is managed by useEffect */}
        </div>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center relative overflow-hidden w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ minHeight: '100vh', minWidth: '100vw' }}
          >
            {/* Video Background */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              onLoadedData={() => console.log('✅ Video loaded successfully')}
              onError={(e) => console.log('❌ Video failed to load:', e)}
            >
              <source src="/Assets/scyscrapers.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
            {/* Mouse Aura Effect */}
            {showAura && (
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  left: mousePosition.x - 50,
                  top: mousePosition.y - 50,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0.8, 1],
                  opacity: [0, 0.8, 0.6, 0.8]
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 backdrop-blur-sm border border-cyan-400/50 shadow-lg shadow-cyan-400/20">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse"></div>
                </div>
              </motion.div>
            )}

            {/* Additional Aura Rings */}
            {showAura && (
              <>
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: mousePosition.x - 75,
                    top: mousePosition.y - 75,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 0.9, 1.1],
                    opacity: [0, 0.4, 0.2, 0.4]
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className="w-32 h-32 rounded-full border border-cyan-300/30 animate-ping"></div>
                </motion.div>

                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: mousePosition.x - 100,
                    top: mousePosition.y - 100,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0.8, 1.2],
                    opacity: [0, 0.2, 0.1, 0.2]
                  }}
                  transition={{ 
                    duration: 1,
                    delay: 0.2,
                    ease: "easeOut"
                  }}
                >
                  <div className="w-40 h-40 rounded-full border border-blue-300/20 animate-pulse"></div>
                </motion.div>
              </>
            )}

            {/* Content Area */}
            <div className="text-center relative z-10 flex flex-col items-center justify-center min-h-screen">
              {!isStarted ? (
                /* Enhanced Welcome Experience */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1,
                    ease: "easeOut"
                  }}
                  className="space-y-12"
                >
                  {/* Animated Logo with Boutique Glow */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      delay: 0.5,
                      ease: "easeOut",
                      y: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="relative flex items-center justify-center"
                  >
                    {/* Boutique Radial Gradient Halo */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.12, 0.15, 0.12]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 w-96 h-96 -m-32 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.03) 60%, transparent 100%)',
                        filter: 'blur(50px)'
                      }}
                    />
                    
                    <img 
                      src="/Assets/Company Logos/white-logo-dark.webp" 
                      alt="Cloudastick Logo"
                      className="w-28 h-28 object-contain relative z-10"
                    />
                  </motion.div>

                  {/* Tagline */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 1.2,
                      ease: "easeOut"
                    }}
                  >
                    <p className="text-white/90 text-lg font-light tracking-wide">
                      Tailored CRM Experiences, Elevated.
                    </p>
                  </motion.div>

                  {/* Enhanced Button with Ripple */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: 1.8,
                      ease: "easeOut"
                    }}
                    className="relative"
                  >
                    {/* Ripple Effect */}
                    {buttonRipple && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ 
                          scale: [0, 1.5, 2],
                          opacity: [0.8, 0.4, 0]
                        }}
                        transition={{ 
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-full blur-sm"
                      />
                    )}
                    
                    <motion.button
                      onClick={handleStartExperience}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 text-white px-8 py-4 rounded-full font-medium text-sm hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
                    >
                      Begin Here
                    </motion.button>
                  </motion.div>
                </motion.div>
              ) : (
                /* Logo Display After Start */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 1,
                    ease: "easeOut",
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className="relative flex items-center justify-center"
                >
                  {/* Boutique Radial Gradient Halo */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.12, 0.15, 0.12]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 w-96 h-96 -m-32 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.03) 60%, transparent 100%)',
                      filter: 'blur(50px)'
                    }}
                  />
                  
                  <img 
                    src="/Assets/Company Logos/white-logo-dark.webp" 
                    alt="Cloudastick Logo"
                    className="w-32 h-32 object-contain relative z-10"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StartupSequence;