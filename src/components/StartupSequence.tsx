import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartupSequenceProps {
  onComplete: () => void;
}

const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState<'loading' | 'logo' | 'complete'>('loading');
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Start the startup sequence
    const startSequence = async () => {
      try {
        // Play background music
        if (audioRef.current) {
          audioRef.current.volume = 0.3; // Set volume to 30%
          await audioRef.current.play();
        }
      } catch (error) {
        console.log('Audio autoplay prevented by browser');
      }

      // Phase 1: Loading (1 second)
      setTimeout(() => {
        setCurrentPhase('logo');
      }, 1000);

      // Phase 2: Logo display (3 seconds)
      setTimeout(() => {
        setCurrentPhase('complete');
      }, 4000);

      // Phase 3: Fade out and complete (1 second)
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 5000);
    };

    startSequence();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center"
        >
          {/* Background Music */}
          <audio
            ref={audioRef}
            loop
            preload="auto"
          >
            <source src="/Assets/cloudastickwebsiteloadmusic.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {/* Loading Phase */}
          {currentPhase === 'loading' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-cyan-400 text-lg font-medium">Initializing Cloudastick Systems...</p>
              </div>
            </motion.div>
          )}

          {/* Logo Phase */}
          {currentPhase === 'logo' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -50 }}
              transition={{ 
                duration: 1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="text-center"
            >
              {/* Cloudastick Logo */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25"
                >
                  <img 
                    src="/Assets/Company Logos/white logo for black backgrounds animated.gif" 
                    alt="Cloudastick Logo"
                    className="w-20 h-20 object-contain"
                  />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-4xl font-bold text-white mb-2"
                >
                  Cloudastick
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="text-xl text-cyan-300 font-medium"
                >
                  Salesforce Excellence
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="mt-6"
                >
                  <div className="flex justify-center space-x-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Complete Phase */}
          {currentPhase === 'complete' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25"
              >
                <img 
                  src="/Assets/Company Logos/white logo for black backgrounds animated.gif" 
                  alt="Cloudastick Logo"
                  className="w-20 h-20 object-contain"
                />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold text-white mb-2"
              >
                Cloudastick
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xl text-cyan-300 font-medium"
              >
                Welcome to Excellence
              </motion.p>
            </motion.div>
          )}

          {/* Subtle background animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupSequence;
