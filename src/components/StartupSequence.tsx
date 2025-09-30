import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartupSequenceProps {
  onComplete: () => void;
}

const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
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

      // Show logo for 3 seconds, then fade out
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 3000);
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
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
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

          {/* Simple Logo Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
            className="text-center"
          >
            <img 
              src="/Assets/Company Logos/white logo for dark backgrounds.webp" 
              alt="Cloudastick Logo"
              className="w-32 h-32 object-contain mx-auto"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupSequence;
