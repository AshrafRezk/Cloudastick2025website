import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartupSequenceProps {
  onComplete: () => void;
}

const StartupSequence: React.FC<StartupSequenceProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Start the startup sequence
    const startSequence = async () => {
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

  // Keep audio playing even after startup sequence ends
  useEffect(() => {
    return () => {
      // Don't stop audio when component unmounts - let it finish naturally
      // The audio will continue playing in the background
    };
  }, []);

  // Handle audio loading and errors
  const handleAudioLoad = () => {
    console.log('✅ Audio loaded successfully');
    setAudioLoaded(true);
  };

  const handleAudioError = (e: any) => {
    console.log('❌ Audio failed to load:', e);
    console.log('Audio src:', audioRef.current?.src);
    setAudioError(true);
  };

  // Auto-play audio after a brief delay
  const playAudio = async () => {
    if (audioError || !audioLoaded) {
      console.log('⚠️ Audio not available - continuing without sound');
      return;
    }

    try {
      if (audioRef.current) {
        console.log('🎵 Attempting to play audio...');
        audioRef.current.volume = 0.2; // Lower volume to be less intrusive
        await audioRef.current.play();
        console.log('✅ Audio started playing successfully');
      }
    } catch (error) {
      console.log('❌ Audio play failed:', error);
    }
  };

  // Handle audio play on user interaction
  const handleUserInteraction = async () => {
    await playAudio();
  };

  // Auto-play audio after component mounts and audio loads
  useEffect(() => {
    if (audioLoaded && !audioError) {
      // Small delay to ensure smooth startup
      const timer = setTimeout(() => {
        playAudio();
      }, 1500); // Play after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [audioLoaded, audioError]);

  // Fallback: try to load audio manually after a delay
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!audioLoaded && !audioError && audioRef.current) {
        console.log('🔄 Fallback: manually loading audio...');
        audioRef.current.load();
      }
    }, 2000); // Try after 2 seconds if not loaded

    return () => clearTimeout(fallbackTimer);
  }, [audioLoaded, audioError]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
          onClick={handleUserInteraction}
        >
          {/* Background Music */}
          <audio
            ref={audioRef}
            preload="metadata"
            onLoadedData={handleAudioLoad}
            onError={handleAudioError}
            onCanPlayThrough={handleAudioLoad}
            onLoadStart={() => console.log('🔄 Audio loading started')}
            onEnded={() => console.log('🎵 Audio track finished playing')}
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
              src="/Assets/Company Logos/white-logo-dark.webp" 
              alt="Cloudastick Logo"
              className="w-32 h-32 object-contain mx-auto"
            />
            
            {/* Audio Status Indicator */}
            {audioLoaded && !audioError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-4 text-white/60 text-sm"
              >
                Click to enable audio
              </motion.div>
            )}
            
            {audioError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-4 text-white/40 text-xs"
              >
                Audio blocked by browser settings
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupSequence;
