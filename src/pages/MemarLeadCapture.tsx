import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemarStartupSequence from '../components/MemarStartupSequence';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  budget: string;
  description: string;
  lead_source: string;
}

const MemarLeadCapture: React.FC = () => {
  const [showStartup, setShowStartup] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    budget: '',
    description: '',
    lead_source: '',
  });
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [personalizedQuote, setPersonalizedQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null);
  const woosh2Ref = useRef<HTMLAudioElement>(null);
  const selection1Ref = useRef<HTMLAudioElement>(null);

  // Inspirational quotes for Investment
  const quotes = [
    "Secure your future with the safest investment opportunities.",
    "Grow your capital steadily with Memar's proven track record.",
    "Investment success starts with the right partner—Memar Developments.",
    "Build wealth that lasts generations with smart real estate investments.",
    "Your financial security is our priority—invest with confidence.",
    "Real estate: The timeless asset that appreciates with care.",
    "Let your money work for you with Memar's strategic investments.",
    "Stability meets growth in every Memar development project.",
    "Smart investors choose Memar for consistent, reliable returns.",
    "Transform your capital into lasting wealth with Memar.",
  ];

  // Haptic feedback helper
  const triggerHaptic = (duration = 1) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(Math.max(1, Math.round(duration * 0.00000002)));
    }
  };

  // Strong haptic feedback
  const triggerStrongHaptic = (duration = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(Math.max(1, Math.round(duration * 0.1)));
    }
  };

  // Crescendo to diminuendo haptic
  const triggerWooshHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([
        50, 10,
        100, 10,
        150, 10,
        100, 10,
        50, 10,
        0
      ].map(v => Math.round(v * 0.05)));
    }
  };

  // Set audio volume to 5% on component mount
  useEffect(() => {
    const setAudioVolume = () => {
      const audioElements = [
        successAudioRef.current,
        woosh1Ref.current,
        woosh2Ref.current,
        selection1Ref.current
      ];

      audioElements.forEach(audio => {
        if (audio) {
          audio.volume = 0.05;
        }
      });
    };

    setAudioVolume();
    const timer = setTimeout(setAudioVolume, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Capture device info and query params on mount
  useEffect(() => {
    const captureDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const language = navigator.language;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const referrer = document.referrer || 'Direct';
      
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
      const deviceType = isMobile ? 'Mobile' : 'Desktop';
      
      let browser = 'Unknown';
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      let os = 'Unknown';
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
      
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('src') || urlParams.get('utm_source') || 'organic';
      
      const leadSource = urlParams.get('lead_source') 
        || urlParams.get('source') 
        || urlParams.get('utm_source')
        || urlParams.get('src')
        || 'Trade Show'; // Default for Cityscape event
      
      setFormData(prev => ({ ...prev, lead_source: leadSource }));
      
      const info = `Device: ${deviceType}
Browser: ${browser}
OS: ${os}
Screen: ${width}x${height}
Language: ${language}
Timezone: ${timezone}
Referrer: ${referrer}
Lead Source: ${source}`;
      
      setDeviceInfo(info);
    };

    captureDeviceInfo();
  }, []);

  const handleStartupComplete = () => {
    setShowStartup(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      triggerHaptic(1);
      return;
    }

    setIsSubmitting(true);
    triggerHaptic(1);

    try {
      // Create a hidden form for Salesforce submission
      const hiddenForm = document.createElement('form');
      hiddenForm.action = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DQE000000FdFZ';
      hiddenForm.method = 'POST';
      hiddenForm.target = 'salesforce-iframe';
      
      // Helper to add hidden fields
      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        hiddenForm.appendChild(input);
      };

      // Add all form fields per the Salesforce web-to-lead code provided
      addField('oid', '00DQE000000FdFZ');
      addField('retURL', window.location.origin + '/memar-success');
      addField('first_name', formData.first_name);
      addField('last_name', formData.last_name);
      addField('email', formData.email);
      addField('mobile', formData.mobile);
      addField('00NQE000000wSwn', formData.budget); // Budget custom field
      addField('description', formData.description);
      addField('lead_source', formData.lead_source);

      // Create hidden iframe for submission
      let iframe = document.getElementById('salesforce-iframe') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'salesforce-iframe';
        iframe.name = 'salesforce-iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      // Append form to body and submit
      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      
      // Clean up form after submission
      setTimeout(() => {
        document.body.removeChild(hiddenForm);
      }, 1000);

      // Show success
      setShowSuccess(true);
      triggerHaptic(1);
      
      // Play woosh sound
      if (woosh1Ref.current) {
        woosh1Ref.current.currentTime = 0;
        woosh1Ref.current.play().catch(() => {});
      }
      
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.play().catch(() => {});
      }

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        window.location.href = '/memar-success';
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      triggerHaptic(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Show personalized quote when typing after first name is complete
    if (field !== 'first_name' && formData.first_name.length >= 3 && !showQuote) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setPersonalizedQuote(randomQuote);
      setShowQuote(true);
      triggerHaptic(1);
    }
    
    // Hide quote if first name is cleared
    if (field === 'first_name' && value.length < 3) {
      setShowQuote(false);
    }
  };

  const scrollToForm = () => {
    setIsTransitioning(true);
    triggerWooshHaptic();
    
    if (woosh2Ref.current) {
      woosh2Ref.current.currentTime = 0;
      woosh2Ref.current.play().catch(() => {});
    }
    
    setTimeout(() => {
      const formElement = document.getElementById('lead-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  if (showStartup) {
    return <MemarStartupSequence onComplete={handleStartupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-slate-50">
      {/* Audio Elements */}
      <audio ref={successAudioRef} src="/Assets/cloudastickwebsiteloadmusic.mp3" preload="auto" />
      <audio ref={woosh1Ref} src="/Assets/woosh1new.mp3?v=2024101103" preload="auto" />
      <audio ref={woosh2Ref} src="/Assets/woosh2new.mp3?v=2024101103" preload="auto" />
      <audio ref={selection1Ref} src="/Assets/selection1new.mp3?v=2024101103" preload="auto" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-30">
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
              backgroundImage: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Memar Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="w-40 h-40 mx-auto relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-full blur-3xl"
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

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Invest and Grow Your{' '}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Capital
            </span>{' '}
            with Memar
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 mb-6 max-w-3xl mx-auto"
          >
            The safest investment for anyone seeking stable, reliable returns
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Proven Track Record</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure Investments</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Consistent Returns</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0],
              scale: isTransitioning ? [1, 1.2, 0.8, 1.5] : 1,
              borderRadius: isTransitioning ? ["50%", "20%", "50%", "0%"] : "50%",
              rotate: isTransitioning ? [0, 180, 360] : 0,
            }}
            transition={{ 
              duration: 0.8, 
              delay: 0.6,
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              scale: isTransitioning ? {
                duration: 0.8,
                times: [0, 0.3, 0.6, 1],
                ease: "easeInOut"
              } : {},
              borderRadius: isTransitioning ? {
                duration: 0.8,
                times: [0, 0.3, 0.6, 1],
                ease: "easeInOut"
              } : {},
              rotate: isTransitioning ? {
                duration: 0.8,
                ease: "easeInOut"
              } : {}
            }}
            onClick={scrollToForm}
            className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-2xl shadow-emerald-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group mx-auto"
            whileHover={{ 
              scale: isTransitioning ? 1 : 1.1,
              boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="flex flex-col items-center"
            >
              <svg 
                className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-xs font-bold mt-1"
              >
                Start
              </motion.div>
            </motion.div>
          </motion.button>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl animate-pulse" />
        </div>
      </section>

      {/* Form Section */}
      <section id="lead-form" className="relative px-4 py-20 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/Assets/scyscrapers.mp4" type="video/mp4" />
          </motion.video>
          
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-slate-500/10" />
          
          {/* Dark overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/10" 
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ 
              opacity: 1, 
              y: 0, 
              scale: isTransitioning ? [0.9, 1.05, 1] : 1 
            }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.8,
              scale: isTransitioning ? {
                duration: 0.6,
                times: [0, 0.5, 1],
                ease: "easeInOut",
                delay: 0.3
              } : {}
            }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-500/10 p-8 md:p-12 border border-white/20"
          >
            {/* Form Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Book a Consultancy Meeting with a Memar Investment Professional
              </h2>
              <p className="text-lg text-slate-600">
                Let's discuss how you can grow your capital safely and securely
              </p>
            </div>

            {/* Personalized Quote */}
            <AnimatePresence>
              {showQuote && formData.first_name && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl border-2 border-emerald-200/50 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-900 mb-1">
                        Hi {formData.first_name}! Here's our investment wisdom:
                      </p>
                      <p className="text-lg text-slate-700 italic leading-relaxed">
                        "{personalizedQuote}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.first_name ? 'border-red-500' : 'border-slate-200'
                    } focus:border-emerald-500 focus:outline-none transition-colors duration-200`}
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.last_name ? 'border-red-500' : 'border-slate-200'
                    } focus:border-emerald-500 focus:outline-none transition-colors duration-200`}
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    } focus:border-emerald-500 focus:outline-none transition-colors duration-200`}
                    placeholder="john.doe@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.mobile ? 'border-red-500' : 'border-slate-200'
                    } focus:border-emerald-500 focus:outline-none transition-colors duration-200`}
                    placeholder="+971 50 123 4567"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 mb-2">
                  Investment Budget (Optional)
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-emerald-500 focus:outline-none transition-colors duration-200"
                  placeholder="e.g., 100,000 AED"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-emerald-500 focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Tell us about your investment goals..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </span>
                ) : (
                  'Book Consultation'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Success Snackbar */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-emerald-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">Your details were sent successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo and Tagline */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-lg flex items-center justify-center p-3">
                <img
                  src="/Assets/Cityscape/Memar/Memar_Logo.png"
                  alt="Memar"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <p className="text-slate-300 text-lg mb-2">
              Invest and Grow Your Capital with Memar
            </p>
            <p className="text-slate-500 text-sm">
              The safest investment for anyone seeking stable returns
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <div>
              <div className="text-emerald-400 font-semibold mb-2">Proven Track Record</div>
              <p className="text-slate-400 text-sm">Years of successful real estate investments</p>
            </div>
            <div>
              <div className="text-emerald-400 font-semibold mb-2">Secure Investments</div>
              <p className="text-slate-400 text-sm">Your capital is protected and managed wisely</p>
            </div>
            <div>
              <div className="text-emerald-400 font-semibold mb-2">Consistent Returns</div>
              <p className="text-slate-400 text-sm">Reliable growth for your investment portfolio</p>
            </div>
          </div>

          {/* Copyright & Powered By */}
          <div className="text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm mb-3">
              © {new Date().getFullYear()} Memar Developments. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <span>CRM Powered by</span>
              <a 
                href="https://cloudastick.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
              >
                Cloudastick
              </a>
              <span>with ❤️</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-500">Salesforce Partner</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MemarLeadCapture;

