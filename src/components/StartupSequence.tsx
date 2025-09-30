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
  const audioRef = useRef<HTMLAudioElement>(null);

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
    
    // Start audio on mouse hover
    playAudio();
  };

  // Handle mouse enter/leave for aura visibility
  const handleMouseEnter = () => {
    setShowAura(true);
    playAudio();
  };

  const handleMouseLeave = () => {
    setShowAura(false);
  };

  // Handle click interaction
  const handleClick = () => {
    playAudio();
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
            className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
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

            {/* Simple Logo Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 1,
                ease: "easeOut"
              }}
              className="text-center relative z-10"
            >
              <img 
                src="/Assets/Company Logos/white-logo-dark.webp" 
                alt="Cloudastick Logo"
                className="w-32 h-32 object-contain mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StartupSequence;