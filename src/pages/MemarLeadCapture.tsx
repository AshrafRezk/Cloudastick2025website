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
  interest: string;
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
    interest: '',
  });
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [personalizedQuote, setPersonalizedQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null);
  const woosh2Ref = useRef<HTMLAudioElement>(null);
  const selection1Ref = useRef<HTMLAudioElement>(null);

  // Inspirational quotes for Investment
  const quotes = {
    en: [
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
    ],
    ar: [
      "أمن مستقبلك بأفضل فرص الاستثمار الآمنة.",
      "نم رأس مالك بثبات مع سجل معمار المثبت.",
      "نجاح الاستثمار يبدأ مع الشريك المناسب - معمار للتطوير.",
      "ابن ثروة تدوم لأجيال مع استثمارات عقارية ذكية.",
      "أمانك المالي هو أولويتنا - استثمر بثقة.",
      "العقارات: الأصول الخالدة التي تزداد قيمتها مع العناية.",
      "دع أموالك تعمل من أجلك مع استثمارات معمار الاستراتيجية.",
      "الاستقرار يلتقي بالنمو في كل مشروع تطويري من معمار.",
      "المستثمرون الأذكياء يختارون معمار للعوائد الموثوقة والمستمرة.",
      "حول رأس مالك إلى ثروة دائمة مع معمار.",
    ]
  };

  // Language content
  const content = {
    en: {
      title: "Invest and Grow Your Capital with Memar",
      subtitle: "The safest investment for anyone seeking stable, reliable returns",
      benefits: ["Proven Track Record", "Secure Investments", "Consistent Returns"],
      formTitle: "Book a Consultancy Meeting with a Memar Investment Professional",
      formSubtitle: "Let's discuss how you can grow your capital safely and securely",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      mobile: "Mobile",
      budget: "Investment Budget (Optional)",
      budgetPlaceholder: "e.g., 100,000 SAR",
      interest: "What's your profile?",
      interestOptions: {
        invest: "Investor",
        supply: "Supplier",
        operate: "Operator"
      },
      description: "Additional Comments",
      descriptionPlaceholder: "Tell us about your investment goals...",
      submitButton: "Book Consultation",
      successMessage: "Your details were sent successfully!",
      footerTitle: "Invest and Grow Your Capital with Memar",
      footerSubtitle: "The safest investment for anyone seeking stable returns",
      features: {
        trackRecord: "Proven Track Record",
        trackRecordDesc: "Years of successful real estate investments",
        secureInvestments: "Secure Investments", 
        secureInvestmentsDesc: "Your capital is protected and managed wisely",
        consistentReturns: "Consistent Returns",
        consistentReturnsDesc: "Reliable growth for your investment portfolio"
      }
    },
    ar: {
      title: "استثمر ونم رأس مالك مع معمار",
      subtitle: "أأمن استثمار لأي شخص يسعى لعوائد مستقرة وموثوقة",
      benefits: ["سجل مثبت", "استثمارات آمنة", "عوائد مستمرة"],
      formTitle: "احجز استشارة مع خبير استثمار معمار",
      formSubtitle: "دعنا نناقش كيف يمكنك تنمية رأس مالك بأمان وثقة",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      mobile: "رقم الجوال",
      budget: "الميزانية الاستثمارية (اختياري)",
      budgetPlaceholder: "مثال: 100,000 ريال سعودي",
      interest: "ما هو ملفك الشخصي؟",
      interestOptions: {
        invest: "مستثمر",
        supply: "مورد",
        operate: "مشغل"
      },
      description: "ملاحظات إضافية",
      descriptionPlaceholder: "حدثنا عن أهدافك الاستثمارية...",
      submitButton: "احجز الاستشارة",
      successMessage: "تم إرسال بياناتك بنجاح!",
      footerTitle: "استثمر ونم رأس مالك مع معمار",
      footerSubtitle: "أأمن استثمار لأي شخص يسعى لعوائد مستقرة",
      features: {
        trackRecord: "سجل مثبت",
        trackRecordDesc: "سنوات من الاستثمارات العقارية الناجحة",
        secureInvestments: "استثمارات آمنة",
        secureInvestmentsDesc: "رأس مالك محمي ومدير بحكمة",
        consistentReturns: "عوائد مستمرة",
        consistentReturnsDesc: "نمو موثوق لمحفظتك الاستثمارية"
      }
    }
  };

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
    if (!formData.interest.trim()) newErrors.interest = 'Please select your interest';
    
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
      addField('00NOm000003yFaM', formData.interest); // Interest dropdown field

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

  const handleLanguageSwitch = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ar' : 'en');
    triggerHaptic(1);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Show personalized quote when typing after first name is complete
    if (field !== 'first_name' && formData.first_name.length >= 3 && !showQuote) {
      const currentQuotes = quotes[currentLanguage];
      const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Audio Elements */}
      <audio ref={successAudioRef} src="/Assets/cloudastickwebsiteloadmusic.mp3" preload="auto" />
      <audio ref={woosh1Ref} src="/Assets/woosh1new.mp3?v=2024101103" preload="auto" />
      <audio ref={woosh2Ref} src="/Assets/woosh2new.mp3?v=2024101103" preload="auto" />
      <audio ref={selection1Ref} src="/Assets/selection1new.mp3?v=2024101103" preload="auto" />

      {/* Language Switcher - Fixed Position */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={handleLanguageSwitch}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={currentLanguage === 'en' ? '/Assets/Cityscape/Memar/ara-lang.png' : '/Assets/Cityscape/Memar/eng-lang.png'}
          alt={currentLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          className="w-6 h-6 object-contain"
        />
      </motion.button>

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
              backgroundImage: 'radial-gradient(circle, rgba(109, 174, 173, 0.1) 1px, transparent 1px)',
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
                className="absolute inset-0 bg-gradient-to-br from-[#6daead]/30 to-[#1c2d36]/30 rounded-full blur-3xl"
              />
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6 relative z-10">
                <img
                  src="/Assets/Cityscape/Memar/Memar_Logo.png?v=20251104"
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
            className={`text-4xl md:text-6xl font-bold text-slate-900 mb-6 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {currentLanguage === 'en' ? (
              <>
                Invest and Grow Your{' '}
                <span className="bg-gradient-to-r from-[#6daead] to-[#1c2d36] bg-clip-text text-transparent">
                  Capital
                </span>{' '}
                with Memar
              </>
            ) : (
              <>
                استثمر ونم رأس مالك{' '}
                <span className="bg-gradient-to-r from-[#6daead] to-[#1c2d36] bg-clip-text text-transparent">
                  مع معمار
                </span>
              </>
            )}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-xl md:text-2xl text-slate-600 mb-6 max-w-3xl mx-auto ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {content[currentLanguage].subtitle}
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base"
          >
            {content[currentLanguage].benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-700">
                <svg className="w-5 h-5 text-[#6daead]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </div>
            ))}
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
            className="w-16 h-16 bg-gradient-to-br from-[#6daead] to-[#1c2d36] hover:from-[#5a9a99] hover:to-[#1a252b] text-white shadow-2xl shadow-[#6daead]/40 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group mx-auto"
            whileHover={{ 
              scale: isTransitioning ? 1 : 1.1,
              boxShadow: "0 25px 50px -12px rgba(109, 174, 173, 0.5)"
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
                {currentLanguage === 'en' ? 'Start' : 'ابدأ الآن'}
              </motion.div>
            </motion.div>
          </motion.button>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-[#6daead]/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#1c2d36]/10 rounded-full blur-xl animate-pulse" />
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#6daead]/10 via-[#1c2d36]/10 to-slate-500/10" />
          
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
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-[#6daead]/10 p-8 md:p-12 border border-white/20"
          >
            {/* Form Header */}
            <div className={`text-center mb-12 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}>
              <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {content[currentLanguage].formTitle}
              </h2>
              <p className={`text-lg text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {content[currentLanguage].formSubtitle}
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
                  className="mb-8 p-6 bg-gradient-to-br from-[#6daead]/5 to-[#1c2d36]/5 rounded-3xl border-2 border-[#6daead]/20 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#6daead] to-[#1c2d36] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1c2d36] mb-1">
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
                  <label htmlFor="first_name" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].firstName} *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.first_name ? 'border-red-500' : 'border-slate-200'
                    } focus:border-[#6daead] focus:outline-none transition-colors duration-200`}
                    placeholder={currentLanguage === 'ar' ? 'عبدالله' : 'Abdallah'}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].lastName} *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.last_name ? 'border-red-500' : 'border-slate-200'
                    } focus:border-[#6daead] focus:outline-none transition-colors duration-200`}
                    placeholder={currentLanguage === 'ar' ? 'أحمد' : 'Ahmed'}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].email} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    } focus:border-[#6daead] focus:outline-none transition-colors duration-200`}
                    placeholder="abdallah.ahmed@email.com"
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].mobile} *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white ${
                      errors.mobile ? 'border-red-500' : 'border-slate-200'
                    } focus:border-[#6daead] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : ''}`}
                    placeholder="+966 50 123 4567"
                    dir="ltr"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {content[currentLanguage].budget}
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#6daead] focus:outline-none transition-colors duration-200"
                  placeholder={content[currentLanguage].budgetPlaceholder}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Interest Selection */}
              <div>
                <label className={`block text-sm font-semibold text-slate-700 mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {content[currentLanguage].interest} *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(content[currentLanguage].interestOptions).map(([key, label]) => (
                    <motion.label
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 ${
                        formData.interest === key
                          ? 'border-[#6daead] bg-[#6daead]/5 shadow-lg shadow-[#6daead]/20'
                          : 'border-slate-200 bg-white hover:border-[#6daead]/50 hover:bg-[#6daead]/2'
                      } ${errors.interest ? 'border-red-500' : ''}`}
                    >
                      <input
                        type="radio"
                        name="interest"
                        value={key}
                        checked={formData.interest === key}
                        onChange={(e) => {
                          handleInputChange('interest', e.target.value);
                          if (selection1Ref.current) {
                            selection1Ref.current.currentTime = 0;
                            selection1Ref.current.play().catch(() => {});
                          }
                          triggerHaptic(1);
                        }}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.interest === key
                            ? 'border-[#6daead] bg-[#6daead]'
                            : 'border-slate-300'
                        }`}>
                          {formData.interest === key && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className={`font-semibold ${
                          formData.interest === key ? 'text-[#6daead]' : 'text-slate-700'
                        }`}>
                          {label}
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>
                {errors.interest && (
                  <p className="text-red-500 text-sm mt-2">{errors.interest}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {content[currentLanguage].description}
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#6daead] focus:outline-none transition-colors duration-200 resize-none"
                  placeholder={content[currentLanguage].descriptionPlaceholder}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-[#6daead] to-[#1c2d36] hover:from-[#5a9a99] hover:to-[#1a252b] disabled:from-slate-400 disabled:to-slate-500 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-[#6daead]/30 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {currentLanguage === 'en' ? 'Submitting...' : 'جاري الإرسال...'}
                  </span>
                ) : (
                  content[currentLanguage].submitButton
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
            <div className="bg-[#6daead] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
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
                  src="/Assets/Cityscape/Memar/Memar_Logo.png?v=20251104"
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
              <div className="text-[#6daead] font-semibold mb-2">Proven Track Record</div>
              <p className="text-slate-400 text-sm">Years of successful real estate investments</p>
            </div>
            <div>
              <div className="text-[#6daead] font-semibold mb-2">Secure Investments</div>
              <p className="text-slate-400 text-sm">Your capital is protected and managed wisely</p>
            </div>
            <div>
              <div className="text-[#6daead] font-semibold mb-2">Consistent Returns</div>
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
                className="text-[#6daead] hover:text-[#5a9a99] font-semibold transition-colors duration-200"
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

