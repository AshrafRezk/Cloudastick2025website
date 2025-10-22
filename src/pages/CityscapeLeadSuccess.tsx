import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CityscapeLeadSuccess: React.FC = () => {
  const navigate = useNavigate();
  const videoRefBackground = useRef<HTMLVideoElement>(null);
  const [videoFailedBackground, setVideoFailedBackground] = useState(false);
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const [backgroundVideoAttempts, setBackgroundVideoAttempts] = useState(0);

  // Get company name from session storage
  const companyName = sessionStorage.getItem('cityscape_company_name') || 'Your Company';
  const boothPurpose = sessionStorage.getItem('cityscape_booth_purpose') || 'investors';

  // Enhanced background video loading strategy
  useEffect(() => {
    const loadAndPlayVideo = async () => {
      if (!videoRefBackground.current) return;
      
      const video = videoRefBackground.current;
      
      // Set optimal video properties for autoplay
      video.muted = true;
      video.volume = 0;
      video.playsInline = true;
      video.preload = 'auto';
      video.currentTime = 0;
      
      // Add event listeners
      const handleCanPlay = () => {
        console.log('✅ Background video can play');
        video.play().catch(error => {
          console.log('❌ Play failed, retrying...', error);
          setTimeout(() => {
            if (video && !video.paused) return;
            video.play().catch(console.error);
          }, 500);
        });
      };
      
      const handleLoadedData = () => {
        console.log('✅ Background video data loaded');
        setVideoFailedBackground(false);
      };
      
      const handleError = () => {
        console.log('❌ Background video error, trying next source...');
      };
      
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('loadeddata', handleLoadedData, { once: true });
      video.addEventListener('error', handleError);
      
      video.load();
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    };

    const loadVideo = () => {
      loadAndPlayVideo().catch(console.error);
    };

    loadVideo();
    
    const timers = [100, 500, 1000, 2000].map(delay => 
      setTimeout(loadVideo, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleBackgroundVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const currentAttempts = backgroundVideoAttempts + 1;
    setBackgroundVideoAttempts(currentAttempts);
    
    console.log(`❌ Background video attempt ${currentAttempts} failed`);
    
    if (currentAttempts >= 3) {
      console.log('❌ All background video attempts failed');
      setVideoFailedBackground(true);
    } else {
      console.log(`🔄 Retrying background video (attempt ${currentAttempts + 1}/3)...`);
      setTimeout(() => {
        if (videoRefBackground.current) {
          videoRefBackground.current.load();
        }
      }, 1000 * currentAttempts);
    }
  };

  const handleBackgroundVideoLoad = () => {
    console.log('✅ Background video loaded successfully');
    setBackgroundVideoLoaded(true);
  };

  const handleBackgroundVideoClick = () => {
    if (videoRefBackground.current && videoRefBackground.current.paused) {
      videoRefBackground.current.play().catch(console.error);
    }
  };

  const handleBack = () => {
    navigate('/cityscape');
  };

  // WhatsApp message to Mina
  const handleWhatsAppQuote = () => {
    const message = encodeURIComponent(
      `Hi Mina! I just saw the Cityscape demo for ${companyName}. I'm interested in getting a quote to implement a lead capturing app connected to Salesforce under 4 days for our booth at Cityscape in November!`
    );
    window.open(`https://wa.me/971509699691?text=${message}`, '_blank');
  };

  const handleWhatsAppFullPackage = () => {
    const message = encodeURIComponent(
      `Hi Mina! I'm interested in purchasing Salesforce and the lead capturing app for ${companyName}. I need the MVP ready for our sales team before Cityscape in November. Can we discuss this?`
    );
    window.open(`https://wa.me/971509699691?text=${message}`, '_blank');
  };

  // Trusted companies
  const trustedCompanies = [
    'Erth',
    'Memar',
    'HDP',
    'Marakez',
    'Benoit Properties',
    'Nile City Towers'
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900">
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
            className="absolute inset-0 w-full h-full object-cover opacity-70 cursor-pointer"
            style={{ 
              minWidth: '100%', 
              minHeight: '100%',
              width: 'auto',
              height: 'auto'
            }}
            onLoadedData={handleBackgroundVideoLoad}
            onError={handleBackgroundVideoError}
          >
            <source src="/Assets/scyscrapers.mp4" type="video/mp4" />
            <source src="./Assets/scyscrapers.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        </div>
      )}
      
      {/* Fallback gradient background */}
      {videoFailedBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start px-4 py-8 md:py-12 lg:py-16 min-h-screen overflow-y-auto">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          {/* Checkmark Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Thank You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 mb-3 max-w-2xl mx-auto"
          >
            Your information has been submitted successfully.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-base md:text-lg text-white/80 max-w-2xl mx-auto"
          >
            We'll reach out to you shortly to discuss your Cityscape booth.
          </motion.p>
        </motion.div>

        {/* Vimeo Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="w-full max-w-4xl mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              See How It Works
            </h2>
            <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <iframe 
                src="https://player.vimeo.com/video/1129519409?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '1rem' }} 
                title="Cloudastick Demo"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="w-full max-w-4xl mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
              Get Your Lead Capture App Ready for Cityscape!
            </h3>
            <p className="text-white/90 text-center mb-6 text-lg">
              Contact Mina directly via WhatsApp to get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quick Implementation Button */}
              <motion.button
                onClick={handleWhatsAppQuote}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg transition-all duration-300"
              >
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Quick Quote</div>
                  <div className="text-sm text-white/90">Get the app ready in 4 days</div>
                </div>
              </motion.button>

              {/* Full Package Button */}
              <motion.button
                onClick={handleWhatsAppFullPackage}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl shadow-lg transition-all duration-300"
              >
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1">Full Package</div>
                  <div className="text-sm text-white/90">Salesforce + App + MVP Setup</div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trusted Companies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="w-full max-w-4xl mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              Trusted by Leading Companies
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {trustedCompanies.map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 + (index * 0.1) }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
                >
                  <span className="text-white font-semibold">{company}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-white/80 mt-6 text-sm">
              ...and many more!
            </p>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex gap-4 w-full max-w-sm"
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold rounded-2xl border-2 border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Start
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mt-8 text-center"
        >
          <p className="text-sm md:text-base text-white/70">
            Powered by{' '}
            <a 
              href="https://cloudastick.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              Cloudastick
            </a>
            {' '}• Salesforce Partner
          </p>
        </motion.div>
      </div>

      {/* Vimeo Player Script */}
      <script src="https://player.vimeo.com/api/player.js" async></script>
    </div>
  );
};

export default CityscapeLeadSuccess;

