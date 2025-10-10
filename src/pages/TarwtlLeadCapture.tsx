import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TarwtlStartupSequence from '../components/TarwtlStartupSequence';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  city: string;
  country_code: string;
  mobile: string;
  industry: string;
  comments: string;
  products: string[];
  lead_gen_officer: string; // Salesforce userId
}

const TarwtlLeadCapture: React.FC = () => {
  const [showStartup, setShowStartup] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    city: '',
    country_code: '',
    mobile: '',
    industry: '',
    comments: '',
    products: [],
    lead_gen_officer: '', // Will be set to default or selected user
  });
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [personalizedQuote, setPersonalizedQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [selectedOfficerIndex, setSelectedOfficerIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null); // Small motions
  const woosh2Ref = useRef<HTMLAudioElement>(null); // Bigger animations
  const selection1Ref = useRef<HTMLAudioElement>(null); // Sales person selection
  const selection2Ref = useRef<HTMLAudioElement>(null); // Services/Products selection
  const selection3Ref = useRef<HTMLAudioElement>(null); // Carousel page indicators
  const selection4Ref = useRef<HTMLAudioElement>(null); // Clear selection
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tarjama team members for Lead Gen Officer selection
  const teamMembers = [
    { name: 'Ahmed Elhagry', role: 'Sales Representative', userId: '005NM000001VOaAYAW', image: '/Assets/team/Ahmed Elhagry - 005NM000001VOaAYAW.png' },
    { name: 'Amer Rousan', role: 'Sales Representative', userId: 'DEFAULT_USER', image: '/Assets/team/Amer Rousan.png' },
    { name: 'Bara Hamed', role: 'Sales Representative', userId: '005NM000001gxpVYAQ', image: '/Assets/team/Bara Hamed - 005NM000001gxpVYAQ.png' },
    { name: 'Habiba Walid', role: 'Sales Representative', userId: 'DEFAULT_USER', image: '/Assets/team/Habiba walid.png' },
    { name: 'Iyad Ahmad', role: 'Sales Representative', userId: '0053z00000D66YmAAJ', image: '/Assets/team/Iyad Ahmad - 0053z00000D66YmAAJ.png' },
    { name: 'Michel Khoury', role: 'Sales Representative', userId: 'DEFAULT_USER', image: '/Assets/team/Michel khoury.png' },
    { name: 'Mohamed Khedr', role: 'Sales Representative', userId: 'DEFAULT_USER', image: '/Assets/team/Mohamed Khedr.png' },
    { name: 'Mohammad Zayed', role: 'Sales Representative', userId: '005NM000002IRyHYAW', image: '/Assets/team/Mohammad Zayed - 005NM000002IRyHYAW.png' },
    { name: 'Moutasem Al Huneidi', role: 'Sales Representative', userId: '005NM000001M0LlYAK', image: '/Assets/team/Moutasem Al Huneidi - 005NM000001M0LlYAK.png' },
    { name: 'Nicolas Boulos', role: 'Sales Representative', userId: '005NM000001iFdtYAE', image: '/Assets/team/Nicolas Boulos - 005NM000001iFdtYAE.png' },
    { name: 'Nour El Hassan', role: 'Sales Representative', userId: '0053z00000C11ySAAR', image: '/Assets/team/Nour el hassan - 0053z00000C11ySAAR.png' },
    { name: 'Talal El Chammah', role: 'Sales Representative', userId: '005NM0000010MxhYAE', image: '/Assets/team/Talal El Chammah - 005NM0000010MxhYAE.png' },
    { name: 'Zaid Radaideh', role: 'Sales Representative', userId: '005NM000001w3OLYAY', image: '/Assets/team/Zaid radaideh - 005NM000001w3OLYAY.png' },
  ];

  const DEFAULT_USER_ID = '005NM000001gxpVYAQ'; // Default to Bara Hamed if no one selected

  // Inspirational quotes for AI Agents
  const quotes = [
    "The future of business is autonomous—AI agents work while you grow.",
    "Every enterprise task automated is time reclaimed for innovation.",
    "AI agents don't just answer questions—they solve problems in real-time.",
    "Speed, scale, and intelligence—AI agents deliver all three, effortlessly.",
    "Transform data into decisions with AI agents built for Arabic.",
    "Your AI advantage starts with understanding your language and culture.",
    "AI agents: Because efficiency isn't a luxury—it's a competitive edge.",
    "From vision to automation in days, not months.",
    "The best AI doesn't replace humans—it empowers them.",
    "Arabic-first AI means faster, smarter, better results for MENA.",
  ];

  // Haptic feedback helper (reduced to 4% of original values)
  const triggerHaptic = (duration = 1) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(Math.max(1, Math.round(duration * 0.04)));
    }
  };

  // Carousel autoplay
  useEffect(() => {
    // Start autoplay carousel
    carouselIntervalRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % teamMembers.length);
    }, 3000); // Change every 3 seconds

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [teamMembers.length]);

  // Stop autoplay when user selects someone
  useEffect(() => {
    if (selectedOfficerIndex !== null && carouselIntervalRef.current) {
      clearInterval(carouselIntervalRef.current);
      carouselIntervalRef.current = null;
    }
  }, [selectedOfficerIndex]);

  // Capture device info and query params on mount
  useEffect(() => {
    const captureDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const language = navigator.language;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const referrer = document.referrer || 'Direct';
      
      // Detect device type
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
      const deviceType = isMobile ? 'Mobile' : 'Desktop';
      
      // Extract browser info
      let browser = 'Unknown';
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      // Extract OS info
      let os = 'Unknown';
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
      
      // Get query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get('src') || urlParams.get('utm_source') || 'organic';
      
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

  const handleProductToggle = (product: string) => {
    triggerHaptic(40);
    // Play selection2 for services/products selection at 4% volume
    if (selection2Ref.current) {
      selection2Ref.current.volume = 0.04;
      selection2Ref.current.currentTime = 0;
      selection2Ref.current.play().catch(() => {});
    }
    setFormData(prev => {
      const products = prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product];
      return { ...prev, products };
    });
  };

  const handleOfficerSelect = (index: number) => {
    triggerHaptic(40);
    // Play selection1 for sales person selection at 4% volume
    if (selection1Ref.current) {
      selection1Ref.current.volume = 0.04;
      selection1Ref.current.currentTime = 0;
      selection1Ref.current.play().catch(() => {});
    }
    setSelectedOfficerIndex(index);
    setCarouselIndex(index);
    setFormData(prev => ({
      ...prev,
      lead_gen_officer: teamMembers[index].userId
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!formData.country_code) newErrors.country_code = 'Country is required';
    if (formData.products.length === 0) newErrors.products = 'Please select at least one product';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      triggerHaptic(50);
      return;
    }

    setIsSubmitting(true);
    triggerHaptic(40);

    try {
      // Get Lead Gen Officer value
      const selectedOfficer = selectedOfficerIndex !== null 
        ? teamMembers[selectedOfficerIndex] 
        : teamMembers.find(m => m.userId === DEFAULT_USER_ID);

      // If user has ID, use it; otherwise use their name
      const leadOfficerValue = selectedOfficer 
        ? (selectedOfficer.userId !== 'DEFAULT_USER' ? selectedOfficer.userId : selectedOfficer.name)
        : DEFAULT_USER_ID;

      // Add products to comments
      const productsText = `Products of Interest: ${formData.products.join(', ')}\n\n${formData.comments}`;

      // Create a hidden form for Salesforce submission
      const hiddenForm = document.createElement('form');
      hiddenForm.action = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D3z000000fPuB';
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

      // Add all form fields
      addField('oid', '00D3z000000fPuB');
      addField('retURL', 'https://arabic.ai/ai-agents/');
      addField('first_name', formData.first_name);
      addField('last_name', formData.last_name);
      addField('email', formData.email);
      addField('company', formData.company);
      addField('city', formData.city);
      addField('country_code', formData.country_code);
      addField('mobile', formData.mobile);
      addField('industry', formData.industry);
      addField('00NNM00000D5r7R', leadOfficerValue); // Target Owner
      addField('00NJ5000000hzjZ', productsText); // Comments with products
      addField('00NNM00000D1ioR', deviceInfo); // Device Info

      // Create hidden iframe for submission (to avoid page redirect)
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
      triggerHaptic(50);
      
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.play().catch(() => {});
      }

      // Redirect to AI Agents page after 3 seconds
      setTimeout(() => {
        window.location.href = 'https://arabic.ai/ai-agents/';
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      triggerHaptic(100);
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
    
    // Show personalized quote when:
    // 1. First name is fully typed (at least 3 characters)
    // 2. OR when typing in other fields after first name is complete
    const hasValidFirstName = field === 'first_name' ? value.length >= 3 : formData.first_name.length >= 3;
    
    if (hasValidFirstName && !showQuote) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setPersonalizedQuote(randomQuote);
      setShowQuote(true);
      triggerHaptic(30);
    }
    
    // Hide quote if first name is cleared or becomes too short
    if (field === 'first_name' && value.length < 3) {
      setShowQuote(false);
    }
  };

  const scrollToForm = () => {
    setIsTransitioning(true);
    triggerHaptic(30);
    // Play woosh2 for big morph animation at 4% volume
    if (woosh2Ref.current) {
      woosh2Ref.current.volume = 0.04;
      woosh2Ref.current.currentTime = 0;
      woosh2Ref.current.play().catch(() => {});
    }
    
    // Start morph transition
    setTimeout(() => {
      const formElement = document.getElementById('lead-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
    
    // End transition after scroll completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  if (showStartup) {
    return <TarwtlStartupSequence onComplete={handleStartupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Audio Elements */}
      <audio ref={successAudioRef} src="/Assets/cloudastickwebsiteloadmusic.mp3" preload="auto" />
      <audio ref={woosh1Ref} src="/Assets/woosh1.mp3" preload="auto" />
      <audio ref={woosh2Ref} src="/Assets/woosh2.mp3" preload="auto" />
      <audio ref={selection1Ref} src="/Assets/Selection1.mp3" preload="auto" />
      <audio ref={selection2Ref} src="/Assets/Selection2.mp3" preload="auto" />
      <audio ref={selection3Ref} src="/Assets/Selection3.mp3" preload="auto" />
      <audio ref={selection4Ref} src="/Assets/Selection4.mp3" preload="auto" />

      {/* Hero Section - Material 3 Design */}
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
              backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Arabic.ai Logo */}
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
                className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
              />
              <img
                src="/Assets/Gitex/Gitex for Tarjama/arabicai.png"
                alt="Arabic.ai"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6"
          >
            Build Your Company{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Agent
            </span>{' '}
            Today!
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 mb-6 max-w-3xl mx-auto"
          >
            Arabic-native AI agents for customer support, automation, analytics, and personalization
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No AI expertise needed</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Arabic-first by design</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Enterprise-ready & secure</span>
            </div>
          </motion.div>

          {/* CTA Button - Centered */}
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
            onMouseEnter={() => triggerHaptic(20)}
            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group mx-auto"
            whileHover={{ 
              scale: isTransitioning ? 1 : 1.1,
              boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)"
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
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse" />
        </div>
      </section>

      {/* Form Section - Material 3 Design */}
      <section id="lead-form" className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto">
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
            className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 md:p-12"
          >
            {/* Form Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Get your AI Agent up and running as soon as possible!
              </h2>
              <p className="text-lg text-slate-600">
                arabic.ai is here for you!
              </p>
            </div>

            {/* Lead Gen Officer Carousel */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-slate-700 mb-4 text-center">
                Who did you talk to today?
              </label>
              <p className="text-xs text-slate-500 text-center mb-6">Optional - Select if you spoke with someone from our team</p>
              
              <div className="relative max-w-4xl mx-auto">
                {/* Navigation Arrows - Infinite Loop (Now visible on mobile) */}
                <button
                  type="button"
                  onClick={() => {
                    // Play woosh1 for carousel navigation at 4% volume
                    if (woosh1Ref.current) {
                      woosh1Ref.current.volume = 0.04;
                      woosh1Ref.current.currentTime = 0;
                      woosh1Ref.current.play().catch(() => {});
                    }
                    setCarouselIndex(carouselIndex === 0 ? teamMembers.length - 3 : carouselIndex - 1);
                    triggerHaptic(20);
                  }}
                  className="flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center text-slate-600 hover:text-slate-900"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    // Play woosh1 for carousel navigation at 4% volume
                    if (woosh1Ref.current) {
                      woosh1Ref.current.volume = 0.04;
                      woosh1Ref.current.currentTime = 0;
                      woosh1Ref.current.play().catch(() => {});
                    }
                    setCarouselIndex(carouselIndex >= teamMembers.length - 3 ? 0 : carouselIndex + 1);
                    triggerHaptic(20);
                  }}
                  className="flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center text-slate-600 hover:text-slate-900"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Carousel Container */}
                <div className="overflow-hidden rounded-3xl mx-12 md:mx-16">
                  <motion.div
                    animate={{ x: `-${carouselIndex * (100 / 3)}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      const threshold = 50;
                      if (info.offset.x > threshold) {
                        // Swipe right - go to previous
                        setCarouselIndex(carouselIndex === 0 ? teamMembers.length - 3 : carouselIndex - 1);
                        triggerHaptic(20);
                      } else if (info.offset.x < -threshold) {
                        // Swipe left - go to next
                        setCarouselIndex(carouselIndex >= teamMembers.length - 3 ? 0 : carouselIndex + 1);
                        triggerHaptic(20);
                      }
                    }}
                  >
                    {teamMembers.map((member, index) => (
                      <motion.div
                        key={index}
                        className="min-w-[33.333%] px-1 md:px-3"
                        whileHover={{ scale: selectedOfficerIndex === null ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.button
                          type="button"
                          onClick={() => handleOfficerSelect(index)}
                          className={`w-full p-2 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 ${
                            selectedOfficerIndex === index
                              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/40'
                              : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 shadow-lg'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2 md:gap-3">
                            {/* Avatar */}
                            <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-2 md:border-3 ${
                              selectedOfficerIndex === index ? 'border-white/30' : 'border-slate-200'
                            }`}>
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Name Only */}
                            <div className="text-center">
                              <h3 className={`text-sm md:text-lg font-bold leading-tight ${
                                selectedOfficerIndex === index ? 'text-white' : 'text-slate-900'
                              }`}>
                                {member.name}
                              </h3>
                            </div>

                            {/* Selected Indicator */}
                            {selectedOfficerIndex === index && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 mt-1"
                              >
                                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-semibold">Selected</span>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Carousel Indicators - Mobile Swipe Instructions */}
                <div className="md:hidden text-center mt-4">
                  <p className="text-xs text-slate-500">Swipe left/right to navigate</p>
                </div>

                {/* Carousel Indicators - Infinite Loop */}
                <div className="flex justify-center gap-2 mt-4 md:mt-6">
                  {Array.from({ length: Math.ceil(teamMembers.length / 3) }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        // Play selection3 for carousel page indicator at 4% volume
                        if (selection3Ref.current) {
                          selection3Ref.current.volume = 0.04;
                          selection3Ref.current.currentTime = 0;
                          selection3Ref.current.play().catch(() => {});
                        }
                        setCarouselIndex(index);
                        triggerHaptic(20);
                      }}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === carouselIndex
                          ? 'bg-blue-600 w-6 md:w-8'
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Clear Selection */}
                {selectedOfficerIndex !== null && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    type="button"
                    onClick={() => {
                      // Play selection4 for clear action at 4% volume
                      if (selection4Ref.current) {
                        selection4Ref.current.volume = 0.04;
                        selection4Ref.current.currentTime = 0;
                        selection4Ref.current.play().catch(() => {});
                      }
                      setSelectedOfficerIndex(null);
                      setFormData(prev => ({ ...prev, lead_gen_officer: '' }));
                      triggerHaptic(30);
                    }}
                    className="mt-4 mx-auto block text-sm text-slate-500 hover:text-slate-700 underline"
                  >
                    Clear Selection
                  </motion.button>
                )}
              </div>
            </div>

            {/* Product Selector */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Products of Interest *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    name: 'Conversational AI Agent',
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    ),
                    description: 'Virtual assistants for support & sales'
                  },
                  { 
                    name: 'Process Automation Agent',
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    description: 'Automate tasks in HR, finance & ops'
                  },
                  { 
                    name: 'Analytics and Reporting Agent',
                    icon: (
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    ),
                    description: 'Real-time insights & dashboards'
                  },
                ].map((product) => (
                  <motion.button
                    key={product.name}
                    type="button"
                    onClick={() => handleProductToggle(product.name)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center gap-3 text-center ${
                      formData.products.includes(product.name)
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 border-2 border-transparent'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${
                      formData.products.includes(product.name) ? 'text-white' : 'text-blue-600'
                    }`}>
                      {product.icon}
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{product.name}</div>
                      <div className={`text-xs ${
                        formData.products.includes(product.name) ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {product.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.products && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.products}</p>
              )}
            </div>

            {/* Personalized Quote */}
            <AnimatePresence>
              {showQuote && formData.first_name && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-blue-200/50 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Hi {formData.first_name}! Here's today's inspiration:
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
                    onFocus={() => triggerHaptic(20)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.first_name ? 'border-red-500' : 'border-slate-200'
                    } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
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
                    onFocus={() => triggerHaptic(20)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.last_name ? 'border-red-500' : 'border-slate-200'
                    } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email & Company */}
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
                    onFocus={() => triggerHaptic(20)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                    placeholder="john.doe@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    onFocus={() => triggerHaptic(20)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.company ? 'border-red-500' : 'border-slate-200'
                    } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                    placeholder="Company Name"
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                  )}
                </div>
              </div>

              {/* Mobile & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 mb-2">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    onFocus={() => triggerHaptic(20)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.mobile ? 'border-red-500' : 'border-slate-200'
                    } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                    placeholder="+971 50 123 4567"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    onFocus={() => triggerHaptic(20)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200"
                    placeholder="Dubai"
                  />
                </div>
              </div>

              {/* Country & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country_code" className="block text-sm font-semibold text-slate-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country_code"
                    value={formData.country_code}
                    onChange={(e) => handleInputChange('country_code', e.target.value)}
                    onFocus={() => triggerHaptic(20)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 bg-white ${
                      errors.country_code ? 'border-red-500' : 'border-slate-200'
                    } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                  >
                    <option value="">--Select Country--</option>
                    <option value="AE">🇦🇪 United Arab Emirates</option>
                    <option value="SA">🇸🇦 Saudi Arabia</option>
                    <option value="EG">🇪🇬 Egypt</option>
                    <option value="JO">🇯🇴 Jordan</option>
                    <option value="LB">🇱🇧 Lebanon</option>
                    <option value="KW">🇰🇼 Kuwait</option>
                    <option value="QA">🇶🇦 Qatar</option>
                    <option value="BH">🇧🇭 Bahrain</option>
                    <option value="OM">🇴🇲 Oman</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="GB">🇬🇧 United Kingdom</option>
                    <option value="DE">🇩🇪 Germany</option>
                    <option value="FR">🇫🇷 France</option>
                    <option value="IN">🇮🇳 India</option>
                    <option value="CN">🇨🇳 China</option>
                  </select>
                  {errors.country_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.country_code}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    onFocus={() => triggerHaptic(20)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  >
                    <option value="">--Select Industry--</option>
                    <option value="Technology & IT">Technology & IT</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare & Pharmaceuticals">Healthcare & Pharmaceuticals</option>
                    <option value="Education & E-Learning">Education & E-Learning</option>
                    <option value="Government & Public Sector">Government & Public Sector</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="Consulting & Professional Services">Consulting & Professional Services</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Ecommerce & Retail">Ecommerce & Retail</option>
                    <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Real Estate & Construction">Real Estate & Construction</option>
                    <option value="Automotive & Transport">Automotive & Transport</option>
                    <option value="Energy & Utilities">Energy & Utilities</option>
                  </select>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label htmlFor="comments" className="block text-sm font-semibold text-slate-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  onFocus={() => triggerHaptic(20)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Tell us more about your needs..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300"
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
                  'Submit'
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
            <div className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
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
              <img
                src="/Assets/Gitex/Gitex for Tarjama/arabicai.png"
                alt="Arabic.ai"
                className="h-16 object-contain opacity-90"
              />
            </div>
            <p className="text-slate-300 text-lg mb-2">
              Building AI Agents & Apps So Simple, Any Enterprise Can Do It
            </p>
            <p className="text-slate-500 text-sm">
              Your Workflow… Your Data… We just Build & Automate them.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            <div>
              <div className="text-blue-400 font-semibold mb-2">Arabic-First by Design</div>
              <p className="text-slate-400 text-sm">Automate workflows in Arabic with regional intelligence</p>
            </div>
            <div>
              <div className="text-blue-400 font-semibold mb-2">Enterprise-Ready</div>
              <p className="text-slate-400 text-sm">Secure, modular, and seamlessly integrated</p>
            </div>
            <div>
              <div className="text-blue-400 font-semibold mb-2">Fast ROI</div>
              <p className="text-slate-400 text-sm">Unlock measurable results from day one</p>
            </div>
          </div>

          {/* CTA Link */}
          <div className="text-center mb-8">
            <a
              href="https://arabic.ai/ai-agents/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Learn More About AI Agents
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Copyright & Powered By */}
          <div className="text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm mb-3">
              © {new Date().getFullYear()} Arabic.ai. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <span>CRM Powered by</span>
              <a 
                href="https://cloudastick.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
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

export default TarwtlLeadCapture;

