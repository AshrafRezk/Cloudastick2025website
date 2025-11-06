import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MemarStartupSequenceProps {
  onComplete: () => void;
}

const MemarStartupSequence: React.FC<MemarStartupSequenceProps> = ({ onComplete }) => {
  const [currentLogo, setCurrentLogo] = useState<'cityscape' | 'memar'>('cityscape');
  const [showSequence, setShowSequence] = useState(true);
  const [canStart, setCanStart] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const onCompleteRef = React.useRef(onComplete);
  
  // Audio refs for sound effects
  const woosh1Ref = React.useRef<HTMLAudioElement>(null);
  const woosh2Ref = React.useRef<HTMLAudioElement>(null);

  // Update ref when onComplete changes
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Show "Start" button after initial delay
    const timer = setTimeout(() => {
      setCanStart(true);
    }, 1000);

    // Auto-play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    // Logo sequence: Cityscape (1.8s) → Memar (1.8s) → Complete
    const cityscapeTimer = setTimeout(() => {
      // Play woosh for logo transition
      if (woosh2Ref.current) {
        woosh2Ref.current.volume = 0.04;
        woosh2Ref.current.currentTime = 0;
        woosh2Ref.current.play().catch(() => {});
      }
      setCurrentLogo('memar');
    }, 1800);

    const completeTimer = setTimeout(() => {
      // Play woosh for final transition
      if (woosh2Ref.current) {
        woosh2Ref.current.volume = 0.04;
        woosh2Ref.current.currentTime = 0;
        woosh2Ref.current.play().catch(() => {});
      }
      setShowSequence(false);
      
      setTimeout(() => {
        onCompleteRef.current();
      }, 300);
    }, 3600); // Show Memar for 1.8s then complete

    return () => {
      clearTimeout(cityscapeTimer);
      clearTimeout(completeTimer);
    };
  }, [isStarted]);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([1, 1, 1]);
    }
  };

  const handleStartJourney = () => {
    triggerHaptic();
    // Play woosh2 for button click
    if (woosh2Ref.current) {
      woosh2Ref.current.volume = 0.04;
      woosh2Ref.current.currentTime = 0;
      woosh2Ref.current.play().catch(() => {});
    }
    setIsStarted(true);
    setCanStart(false);
  };

  return (
    <AnimatePresence>
      {showSequence && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50"
        >
          {/* Audio Elements */}
          <audio ref={woosh1Ref} src="/Assets/woosh1new.mp3?v=2024101103" preload="auto" volume="0.05" />
          <audio ref={woosh2Ref} src="/Assets/woosh2new.mp3?v=2024101103" preload="auto" volume="0.05" />

          {/* Video Background - Only on initial welcome screen */}
          {!isStarted && (
            <div className="absolute inset-0 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              >
                <source src="/Assets/scyscrapers.mp4" type="video/mp4" />
              </video>
              {/* Gradient overlay to ensure text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/70" />
            </div>
          )}

          {/* Animated Background Pattern - Only during logo sequence */}
          {isStarted && (
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-full h-full"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(109, 174, 173, 0.2) 1px, transparent 1px)',
                  backgroundSize: '50px 50px',
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            {!isStarted ? (
              /* Initial Welcome State */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center space-y-8"
              >
                {/* Memar Logo (Preview) */}
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6daead]/30 to-[#1c2d36]/30 rounded-full blur-3xl" />
                    <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4 relative z-10">
                      <img
                        src="/Assets/Cityscape/Memar/Memar_Logo.png"
                        alt="Memar"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                    Invest and Grow Your Capital with Memar
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                    The safest investment for anyone seeking stable returns
                  </p>
                </div>

                {canStart && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleStartJourney}
                    className="mt-12 px-10 py-4 bg-gradient-to-r from-[#6daead] to-[#1c2d36] hover:from-[#5a9a99] hover:to-[#1a252b] text-white font-semibold rounded-full shadow-xl shadow-[#6daead]/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Start your journey
                  </motion.button>
                )}
              </motion.div>
            ) : (
              /* Logo Sequence */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {/* Logo Display */}
                <div className="flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {currentLogo === 'cityscape' && (
                      <motion.div
                        key="cityscape"
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-64 h-64 flex items-center justify-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#6daead]/30 to-[#1c2d36]/30 rounded-full blur-3xl" />
                          <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6 relative z-10">
                            <img
                              src="/Assets/Cityscape/Cityscape assets/Cityscape_Logo.png"
                              alt="Cityscape"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentLogo === 'memar' && (
                      <motion.div
                        key="memar"
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-56 h-56 flex items-center justify-center"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                              opacity: [0.3, 0.4, 0.3],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="absolute inset-0 bg-gradient-to-br from-[#6daead]/40 to-[#1c2d36]/40 rounded-full blur-3xl"
                          />
                          <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6 relative z-10">
                            <img
                              src="/Assets/Cityscape/Memar/Memar_Logo.png"
                              alt="Memar"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemarStartupSequence;

