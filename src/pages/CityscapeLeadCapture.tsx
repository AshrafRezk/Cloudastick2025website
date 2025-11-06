import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CityscapeStartupSequence from '../components/CityscapeStartupSequence';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  company: string;
  budget: string;
  description: string;
  lead_source: string;
}

type BoothPurpose = 'investors' | 'offices' | 'residents';

const CityscapeLeadCapture: React.FC = () => {
  const navigate = useNavigate();
  const [showStartup, setShowStartup] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [boothPurpose, setBoothPurpose] = useState<BoothPurpose>('investors');
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company: '',
    budget: '',
    description: '',
    lead_source: 'Cityscape Demo',
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

  // Content based on booth purpose and language
  const contentByPurpose = {
    investors: {
      en: {
        title: 'Secure Investment Opportunities',
        subtitle: 'Connect with strategic investors ready to fund your vision',
        features: ['Capital Growth', 'Strategic Partnerships', 'Market Expansion'],
        gradient: 'from-emerald-500 to-teal-600',
        icon: TrendingUpIcon,
        quotes: [
          "Smart investments begin with the right opportunities.",
          "Your vision deserves the right investors.",
          "Building wealth through strategic partnerships.",
          "Secure funding for your next big venture.",
          "Investment opportunities that match your ambitions."
        ]
      },
      ar: {
        title: 'فرص استثمارية آمنة',
        subtitle: 'تواصل مع مستثمرين استراتيجيين جاهزين لتمويل رؤيتك',
        features: ['نمو رأس المال', 'شراكات استراتيجية', 'توسع السوق'],
        gradient: 'from-emerald-500 to-teal-600',
        icon: TrendingUpIcon,
        quotes: [
          "الاستثمارات الذكية تبدأ بالفرص الصحيحة.",
          "رؤيتك تستحق المستثمرين المناسبين.",
          "بناء الثروة من خلال الشراكات الاستراتيجية.",
          "احصل على التمويل لمشروعك الكبير القادم.",
          "فرص استثمارية تتناسب مع طموحاتك."
        ]
      }
    },
    offices: {
      en: {
        title: 'Premium Office Spaces',
        subtitle: 'Modern workspaces ready for your business to move in',
        features: ['Prime Locations', 'Modern Facilities', 'Flexible Terms'],
        gradient: 'from-blue-500 to-indigo-600',
        icon: BusinessIcon,
        quotes: [
          "Your business deserves a world-class workspace.",
          "Elevate your operations with premium office spaces.",
          "Location matters - choose excellence.",
          "Modern spaces for modern businesses.",
          "Where innovation meets infrastructure."
        ]
      },
      ar: {
        title: 'مساحات مكتبية متميزة',
        subtitle: 'مساحات عمل حديثة جاهزة لانتقال عملك',
        features: ['مواقع متميزة', 'مرافق حديثة', 'شروط مرنة'],
        gradient: 'from-blue-500 to-indigo-600',
        icon: BusinessIcon,
        quotes: [
          "عملك يستحق مساحة عمل عالمية المستوى.",
          "ارتقِ بعملياتك مع مساحات مكتبية متميزة.",
          "الموقع مهم - اختر التميز.",
          "مساحات حديثة للأعمال الحديثة.",
          "حيث يلتقي الابتكار بالبنية التحتية."
        ]
      }
    },
    residents: {
      en: {
        title: 'Your Dream Home Awaits',
        subtitle: 'Discover exceptional residential properties for your family',
        features: ['Family-Friendly', 'Prime Locations', 'Quality Living'],
        gradient: 'from-purple-500 to-pink-600',
        icon: HomeIcon,
        quotes: [
          "Your dream home is waiting for you.",
          "Quality living spaces for modern families.",
          "Create memories in your perfect home.",
          "Invest in comfort, invest in life.",
          "Where your family's future begins."
        ]
      },
      ar: {
        title: 'منزل أحلامك في انتظارك',
        subtitle: 'اكتشف عقارات سكنية استثنائية لعائلتك',
        features: ['مناسبة للعائلات', 'مواقع متميزة', 'حياة راقية'],
        gradient: 'from-purple-500 to-pink-600',
        icon: HomeIcon,
        quotes: [
          "منزل أحلامك ينتظرك.",
          "مساحات معيشة عالية الجودة للعائلات العصرية.",
          "اصنع ذكريات في منزلك المثالي.",
          "استثمر في الراحة، استثمر في الحياة.",
          "حيث يبدأ مستقبل عائلتك."
        ]
      }
    }
  };

  // Form content by language
  const formContent = {
    en: {
      formTitle: "Let's Get Started",
      formSubtitle: "Share your details and we'll reach out to discuss opportunities",
      insightPrefix: "Hi",
      insightSuffix: "! Here's our insight:",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      mobile: "Mobile",
      budget: "Budget (Optional)",
      budgetPlaceholder: "e.g., 100,000 AED",
      description: "Additional Comments",
      descriptionPlaceholder: "Tell us more about your requirements...",
      submitButton: "Submit Details",
      submitting: "Submitting...",
      successMessage: "Your details were sent successfully!",
      errors: {
        firstName: 'First name is required',
        lastName: 'Last name is required',
        email: 'Email is required',
        emailInvalid: 'Invalid email format',
        mobile: 'Mobile number is required'
      }
    },
    ar: {
      formTitle: "لنبدأ",
      formSubtitle: "شارك تفاصيلك وسنتواصل معك لمناقشة الفرص",
      insightPrefix: "مرحباً",
      insightSuffix: "! إليك رؤيتنا:",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      mobile: "رقم الجوال",
      budget: "الميزانية (اختياري)",
      budgetPlaceholder: "مثال: 100,000 درهم",
      description: "تعليقات إضافية",
      descriptionPlaceholder: "أخبرنا المزيد عن متطلباتك...",
      submitButton: "إرسال التفاصيل",
      submitting: "جاري الإرسال...",
      successMessage: "تم إرسال تفاصيلك بنجاح!",
      errors: {
        firstName: 'الاسم الأول مطلوب',
        lastName: 'اسم العائلة مطلوب',
        email: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'صيغة البريد الإلكتروني غير صحيحة',
        mobile: 'رقم الجوال مطلوب'
      }
    }
  };

  // Load selections from sessionStorage
  useEffect(() => {
    const savedCompanyName = sessionStorage.getItem('cityscape_company_name');
    const savedPurpose = sessionStorage.getItem('cityscape_booth_purpose') as BoothPurpose;
    
    if (!savedCompanyName || !savedPurpose) {
      navigate('/cityscape');
      return;
    }
    
    setCompanyName(savedCompanyName);
    setBoothPurpose(savedPurpose);
    setFormData(prev => ({ ...prev, company: savedCompanyName }));
  }, [navigate]);

  // Set audio volume to 5% on component mount
  useEffect(() => {
    const setAudioVolume = () => {
      const audioElements = [
        successAudioRef.current,
        woosh1Ref.current,
        woosh2Ref.current,
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

  // Capture device info on mount
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
      
      const info = `Device: ${deviceType}
Browser: ${browser}
OS: ${os}
Screen: ${width}x${height}
Language: ${language}
Timezone: ${timezone}
Referrer: ${referrer}
Company: ${companyName}
Purpose: ${boothPurpose}`;
      
      setDeviceInfo(info);
    };

    if (companyName && boothPurpose) {
      captureDeviceInfo();
    }
  }, [companyName, boothPurpose]);

  // Haptic feedback helper
  const triggerHaptic = (duration = 30) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(Math.max(1, Math.round(duration * 0.1)));
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
      navigator.vibrate([50, 10, 100, 10, 150, 10, 100, 10, 50, 10, 0].map(v => Math.round(v * 0.05)));
    }
  };

  const handleStartupComplete = () => {
    setShowStartup(false);
  };

  const handleLanguageSwitch = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const fc = formContent[currentLanguage];
    
    if (!formData.first_name.trim()) newErrors.first_name = fc.errors.firstName;
    if (!formData.last_name.trim()) newErrors.last_name = fc.errors.lastName;
    if (!formData.email.trim()) newErrors.email = fc.errors.email;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = fc.errors.emailInvalid;
    if (!formData.mobile.trim()) newErrors.mobile = fc.errors.mobile;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      triggerStrongHaptic(50);
      return;
    }

    setIsSubmitting(true);
    triggerHaptic(30);

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

      // Add all form fields
      addField('oid', '00DQE000000FdFZ');
      addField('retURL', window.location.origin + '/cityscape-success');
      addField('first_name', formData.first_name);
      addField('last_name', formData.last_name);
      addField('email', formData.email);
      addField('mobile', formData.mobile);
      addField('company', formData.company);
      addField('00NQE000000wSwn', formData.budget); // Budget custom field
      addField('description', `${formData.description}\n\nBooth Purpose: ${boothPurpose}\n\n${deviceInfo}`);
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
      triggerHaptic(40);
      
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
        navigate('/cityscape-success');
      }, 2000);
      } catch (error) {
      console.error('Error submitting form:', error);
      triggerStrongHaptic(50);
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
      const quotes = contentByPurpose[boothPurpose][currentLanguage].quotes;
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

  // Generate logo with company initials
  const generateLogo = (name: string) => {
    const words = name.trim().split(' ');
    const initials = words.length >= 2 
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
    return initials;
  };

  if (showStartup && companyName && boothPurpose) {
    const content = contentByPurpose[boothPurpose][currentLanguage];
    return (
      <CityscapeStartupSequence 
        onComplete={handleStartupComplete}
        companyName={companyName}
        gradient={content.gradient}
      />
    );
  }

  const content = contentByPurpose[boothPurpose][currentLanguage];
  const fc = formContent[currentLanguage];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
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
      
      {/* Audio Elements */}
      <audio ref={successAudioRef} src="/Assets/cloudastickwebsiteloadmusic.mp3" preload="auto" />
      <audio ref={woosh1Ref} src="/Assets/woosh1new.mp3?v=2024101103" preload="auto" />
      <audio ref={woosh2Ref} src="/Assets/woosh2new.mp3?v=2024101103" preload="auto" />

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
              backgroundImage: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Company Logo */}
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
                className={`absolute inset-0 bg-gradient-to-br ${content.gradient} opacity-30 rounded-full blur-3xl`}
              />
              <div className={`w-full h-full bg-gradient-to-br ${content.gradient} rounded-3xl shadow-2xl flex items-center justify-center p-6 relative z-10`}>
                <div className="text-6xl font-bold text-white">
                  {generateLogo(companyName)}
                </div>
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
            <span className={`bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent`}>
              {companyName}
            </span>
            <br />
            {content.title}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 mb-6 max-w-3xl mx-auto"
          >
            {content.subtitle}
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12 text-sm md:text-base"
          >
            {content.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-700">
                <svg className={`w-5 h-5 bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* Floating Elements */}
          <div className={`absolute top-20 left-10 w-20 h-20 bg-gradient-to-br ${content.gradient} opacity-10 rounded-full blur-xl animate-pulse`} />
          <div className={`absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br ${content.gradient} opacity-10 rounded-full blur-xl animate-pulse`} />
          <div className={`absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-br ${content.gradient} opacity-5 rounded-full blur-2xl animate-pulse`} style={{ animationDelay: '1s' }} />
          <div className={`absolute bottom-1/3 left-20 w-16 h-16 bg-gradient-to-br ${content.gradient} opacity-5 rounded-full blur-xl animate-pulse`} style={{ animationDelay: '2s' }} />

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
            className={`w-16 h-16 bg-gradient-to-br ${content.gradient} hover:opacity-90 text-white shadow-2xl shadow-opacity-40 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group mx-auto`}
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
          <div className={`absolute inset-0 bg-gradient-to-br ${content.gradient} opacity-10`} />
          
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
              } : {
                duration: 0.5,
                ease: "easeOut"
              }
            }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20"
          >
            {/* Form Header */}
            <div className={`text-center mb-12 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}>
              <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {fc.formTitle}
              </h2>
              <p className={`text-lg text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {fc.formSubtitle}
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
                  className={`mb-8 p-6 bg-gradient-to-br ${content.gradient} bg-opacity-5 rounded-3xl border-2 border-opacity-20 shadow-lg`}
                  style={{ borderColor: 'currentColor' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className={`w-12 h-12 bg-gradient-to-br ${content.gradient} rounded-full flex items-center justify-center text-white shadow-lg`}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <LightbulbIcon />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold text-slate-800 mb-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        {fc.insightPrefix} {formData.first_name}{fc.insightSuffix}
                      </p>
                      <p className={`text-lg text-slate-700 italic leading-relaxed ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
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
                    {fc.firstName} *
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
                    placeholder={currentLanguage === 'ar' ? 'أحمد' : 'John'}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {fc.lastName} *
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
                    placeholder={currentLanguage === 'ar' ? 'محمد' : 'Doe'}
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
                    {fc.email} *
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
                    placeholder="john.doe@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="mobile" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {fc.mobile} *
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
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {fc.budget}
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200"
                  placeholder={fc.budgetPlaceholder}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {fc.description}
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                  placeholder={fc.descriptionPlaceholder}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-5 bg-gradient-to-r ${content.gradient} hover:opacity-90 disabled:opacity-50 text-white text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {fc.submitting}
                  </span>
                ) : (
                  fc.submitButton
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
            <div className={`bg-gradient-to-r ${content.gradient} text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold">{fc.successMessage}</span>
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
              <div className={`h-16 w-16 bg-gradient-to-br ${content.gradient} rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-white`}>
                {generateLogo(companyName)}
              </div>
            </div>
            <p className="text-slate-300 text-lg mb-2">
              {companyName} - {content.title}
            </p>
            <p className="text-slate-500 text-sm">
              Cityscape 2025 - November
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            {content.features.map((feature, index) => (
              <div key={index}>
                <div className={`bg-gradient-to-r ${content.gradient} bg-clip-text text-transparent font-semibold mb-2`}>{feature}</div>
                <p className="text-slate-400 text-sm">Excellence in every detail</p>
              </div>
            ))}
          </div>

          {/* Copyright & Powered By */}
          <div className="text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm mb-3">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
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

export default CityscapeLeadCapture;

