import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TarwtlStartupSequenceProps {
  onComplete: () => void;
}

const TarwtlStartupSequence: React.FC<TarwtlStartupSequenceProps> = ({ onComplete }) => {
  const [currentLogo, setCurrentLogo] = useState<'gitex' | 'tarjama' | 'arabic-ai'>('gitex');
  const [showSequence, setShowSequence] = useState(true);
  const [canStart, setCanStart] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show "Start" button after all logos have displayed
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

    // Logo sequence: Gitex (1.5s) → Tarjama (1.5s) → Arabic.ai (1.5s) → Complete
    const gitexTimer = setTimeout(() => {
      setCurrentLogo('tarjama');
    }, 1500);

    const tarjamaTimer = setTimeout(() => {
      setCurrentLogo('arabic-ai');
    }, 3000);

    const completeTimer = setTimeout(() => {
      setShowSequence(false);
      setTimeout(onComplete, 300);
    }, 4500); // Show Arabic.ai for 1.5s then complete

    return () => {
      clearTimeout(gitexTimer);
      clearTimeout(tarjamaTimer);
      clearTimeout(completeTimer);
    };
  }, [isStarted, onComplete]);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }
  };

  const handleStartJourney = () => {
    triggerHaptic();
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-100 to-gray-50"
        >
          {/* Video Background - Only on initial welcome screen */}
          {!isStarted && (
            <div className="absolute inset-0 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                onEnded={(e) => {
                  // Freeze on last frame by seeking to the end
                  const video = e.currentTarget;
                  video.currentTime = video.duration;
                }}
              >
                <source src="/Assets/Gitex/Gitex for Tarjama/robotvideo.mp4" type="video/mp4" />
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
                  backgroundImage: 'radial-gradient(circle, rgba(100, 100, 100, 0.2) 1px, transparent 1px)',
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
                {/* Arabic.ai Logo (Preview) */}
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
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl" />
                    <img
                      src="/Assets/Gitex/Gitex for Tarjama/arabicai.png"
                      alt="Arabic.ai"
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                    Build Your Company AI Agent Today!
                  </h1>
                  <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                    Arabic-native AI agents for automation, support, and intelligence
                  </p>
                </div>

                {canStart && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleStartJourney}
                    className="mt-12 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-xl shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Start Your Journey
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
                    {currentLogo === 'gitex' && (
                      <motion.div
                        key="gitex"
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-48 h-48 flex items-center justify-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-3xl" />
                          <img
                            src="/Assets/Gitex/Gitex_logo.png"
                            alt="Gitex"
                            className="w-full h-full object-contain relative z-10"
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentLogo === 'tarjama' && (
                      <motion.div
                        key="tarjama"
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="w-48 h-48 flex items-center justify-center"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-teal-400/30 rounded-full blur-3xl" />
                          <img
                            src="/Assets/Gitex/Gitex for Tarjama/tarjama.png"
                            alt="Tarjama"
                            className="w-full h-full object-contain relative z-10"
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentLogo === 'arabic-ai' && (
                      <motion.div
                        key="arabic-ai"
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
                            className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-3xl"
                          />
                          <img
                            src="/Assets/Gitex/Gitex for Tarjama/arabicai.png"
                            alt="Arabic.ai"
                            className="w-full h-full object-contain relative z-10"
                          />
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

export default TarwtlStartupSequence;

