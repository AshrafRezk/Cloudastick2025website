import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CityscapeStartupSequenceProps {
  onComplete: () => void;
}

const CityscapeStartupSequence: React.FC<CityscapeStartupSequenceProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'logo' | 'text' | 'complete'>('logo');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Set audio volume to 5%
    if (audioRef.current) {
      audioRef.current.volume = 0.05;
      audioRef.current.play().catch(console.error);
    }

    // Logo stage - 2 seconds
    const logoTimer = setTimeout(() => {
      setStage('text');
    }, 2000);

    // Text stage - 1.5 seconds
    const textTimer = setTimeout(() => {
      setStage('complete');
    }, 3500);

    // Complete - call onComplete after fade out
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"
        >
          {/* Audio */}
          <audio ref={audioRef} src="/Assets/cloudastickwebsiteloadmusic.mp3" preload="auto" />

          {/* Content Container */}
          <div className="text-center">
            {/* Logo/Icon Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: stage === 'logo' ? [0, 1.2, 1] : 1,
                rotate: stage === 'logo' ? [180, 0] : 0,
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.34, 1.56, 0.64, 1],
                times: [0, 0.7, 1]
              }}
              className="mb-8"
            >
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-white rounded-full blur-3xl"
                />
                
                {/* Main Icon */}
                <div className="relative">
                  <motion.div
                    className="text-8xl md:text-9xl"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🌆
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Text Animation */}
            <AnimatePresence>
              {stage === 'text' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.h1
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Cityscape Demo
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-xl md:text-2xl text-white/90 font-light"
                  >
                    Powered by Cloudastick
                  </motion.p>

                  {/* Loading dots */}
                  <motion.div
                    className="flex justify-center gap-2 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 bg-white rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Background Animated Circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/5"
                style={{
                  width: `${200 + i * 100}px`,
                  height: `${200 + i * 100}px`,
                  left: '50%',
                  top: '50%',
                  x: '-50%',
                  y: '-50%',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CityscapeStartupSequence;

