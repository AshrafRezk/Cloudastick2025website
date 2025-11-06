import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';
import MemarStartupSequence from '../components/MemarStartupSequence';
import InvestmentBudgetWidget from '../components/InvestmentBudgetWidget';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  company: string;
  budget: string;
  description: string;
  lead_source: string;
  interest: string;
  leadGenOfficerName: string;
  leadGenOfficerId: string;
}

const MemarLeadCapture: React.FC = () => {
  const [showStartup, setShowStartup] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company: '',
    budget: '',
    description: '',
    lead_source: '',
    interest: '',
    leadGenOfficerName: '',
    leadGenOfficerId: '',
  });
  const [accountType, setAccountType] = useState<'individual' | 'company'>('individual');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [personalizedQuote, setPersonalizedQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [selectedPersonIndex, setSelectedPersonIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null);
  const woosh2Ref = useRef<HTMLAudioElement>(null);
  const selection1Ref = useRef<HTMLAudioElement>(null);

  // People data for each interest type
  const peopleByInterest = {
    invest: [
      { name: 'Mohammed Alkhulofi', id: '005QE000001ye22YAA', image: '/Assets/Cityscape/Memar/People/Investor lead owners/Mohammed Alkhulofi - 005QE000001ye22YAA.png' },
      { name: 'Nawaf Alowla', id: '005QE000001y4EfYAl', image: '/Assets/Cityscape/Memar/People/Investor lead owners/Nawaf Alowla - 005QE000001y4EfYAI.png' },
      { name: 'CEO Office', id: '005QE000001y3byYAA', image: '/Assets/Cityscape/Memar/People/Investor lead owners/CEO Office - 005QE000001y3byYAA.png' },
      { name: 'Abdulaziz AlHumaidhi', id: '005QE000001y4EfYAI', image: '/Assets/Cityscape/Memar/People/Investor lead owners/Abdulaziz AlHumaidhi - 005QE000001y4EfYAI.png' },
    ],
    operate: [
      { name: 'Ahmed Ibrahim', id: '005QE000001y4EfYAl', image: '/Assets/Cityscape/Memar/People/Operator lead owners/Ahmed Ibrahim - 005QE000001y4EfYAI.png' },
      { name: 'Hamdi Abdein', id: '005QE000001y4EfYAl', image: '/Assets/Cityscape/Memar/People/Operator lead owners/Hamdi Abdein - 005QE000001y4EfYAI.png' },
    ],
    supply: [
      { name: 'Procurement', id: '005QE000001y4EfYAl', image: '/Assets/Cityscape/Memar/People/Supplier lead owners/Procurement - 005QE000001y4EfYAI.png' },
    ],
  };

  // Get current people list based on selected interest
  const currentPeople = formData.interest ? peopleByInterest[formData.interest as keyof typeof peopleByInterest] || [] : [];

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
      whoDidYouTalkTo: "Who would like to talk to today? *",
      requiredSelection: "Required - Please select someone from our team",
      accountType: "Account Type",
      individual: "Individual",
      company: "Company",
      companyName: "Company Name",
      companyPlaceholder: "e.g., ABC Corporation",
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
      submitButtonOther: "Submit",
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
      whoDidYouTalkTo: "من تود التحدث إليه اليوم؟ *",
      requiredSelection: "مطلوب - يرجى اختيار شخص من فريقنا",
      accountType: "نوع الحساب",
      individual: "فرد",
      company: "شركة",
      companyName: "اسم الشركة",
      companyPlaceholder: "مثال: شركة ABC",
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
      submitButtonOther: "إرسال",
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

  // Auto-select Procurement when supplier is chosen
  useEffect(() => {
    if (formData.interest === 'supply' && currentPeople.length > 0) {
      // Auto-select the first (and only) person for supplier
      setSelectedPersonIndex(0);
      setCarouselIndex(0);
      setFormData(prev => ({
        ...prev,
        leadGenOfficerName: currentPeople[0].name,
        leadGenOfficerId: currentPeople[0].id,
      }));
    } else if (formData.interest && formData.interest !== 'supply') {
      // Reset selection when switching between invest/operate
      setSelectedPersonIndex(null);
      setCarouselIndex(0);
      setFormData(prev => ({
        ...prev,
        leadGenOfficerName: '',
        leadGenOfficerId: '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.interest]);

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
    if (!formData.leadGenOfficerName.trim() || !formData.leadGenOfficerId.trim()) {
      newErrors.leadGenOfficerName = 'Please select a contact person';
    }
    
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
      addField('company', formData.company); // Company name field
      addField('00NQE000000wSwn', formData.budget); // Budget custom field
      addField('description', formData.description);
      addField('lead_source', formData.lead_source);
      addField('00NOm000003yFaM', formData.interest); // Interest dropdown field
      addField('00NOm0000047oll', formData.leadGenOfficerName); // Lead Gen Officer Name
      addField('00NOm0000047ooz', formData.leadGenOfficerId); // Lead Gen Officer ID

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

  const handlePersonSelect = (index: number) => {
    // Don't allow selection change for supplier (locked to Procurement)
    if (formData.interest === 'supply') return;
    
    triggerStrongHaptic(100);
    if (selection1Ref.current) {
      selection1Ref.current.currentTime = 0;
      selection1Ref.current.play().catch(() => {});
    }
    setSelectedPersonIndex(index);
    setCarouselIndex(index);
    setFormData(prev => ({
      ...prev,
      leadGenOfficerName: currentPeople[index].name,
      leadGenOfficerId: currentPeople[index].id,
    }));
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
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${currentLanguage === 'ar' ? 'md:flex md:flex-row-reverse' : ''}`}>
                <div className="md:flex-1">
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

                <div className="md:flex-1">
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
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${currentLanguage === 'ar' ? 'md:flex md:flex-row-reverse' : ''}`}>
                <div className="md:flex-1">
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
                    dir="ltr"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="md:flex-1">
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
                    } focus:border-[#6daead] focus:outline-none transition-colors duration-200`}
                    placeholder="+966 50 123 4567"
                    dir="ltr"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Account Type Toggle */}
              <div>
                <label className={`block text-sm font-semibold text-slate-700 mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {content[currentLanguage].accountType}
                </label>
                <div className="relative">
                  <div className={`inline-flex rounded-2xl bg-slate-100 p-1 gap-1 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setAccountType('individual');
                        if (selection1Ref.current) {
                          selection1Ref.current.currentTime = 0;
                          selection1Ref.current.play().catch(() => {});
                        }
                        triggerHaptic(1);
                      }}
                      className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        accountType === 'individual'
                          ? 'text-white shadow-lg shadow-[#6daead]/30'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                      whileHover={{ scale: accountType === 'individual' ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {accountType === 'individual' && (
                        <motion.div
                          layoutId="accountTypeIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-[#6daead] to-[#1c2d36] rounded-xl"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                      <span className="relative z-10">{content[currentLanguage].individual}</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => {
                        setAccountType('company');
                        if (selection1Ref.current) {
                          selection1Ref.current.currentTime = 0;
                          selection1Ref.current.play().catch(() => {});
                        }
                        triggerHaptic(1);
                      }}
                      className={`relative px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        accountType === 'company'
                          ? 'text-white shadow-lg shadow-[#6daead]/30'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                      whileHover={{ scale: accountType === 'company' ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {accountType === 'company' && (
                        <motion.div
                          layoutId="accountTypeIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-[#6daead] to-[#1c2d36] rounded-xl"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                      <span className="relative z-10">{content[currentLanguage].company}</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Company Name Field - Conditional */}
              <AnimatePresence>
                {accountType === 'company' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="overflow-hidden">
                      <label htmlFor="company" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        {content[currentLanguage].companyName}
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#6daead] focus:outline-none transition-colors duration-200"
                        placeholder={content[currentLanguage].companyPlaceholder}
                        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              {/* People Carousel - Show when interest is selected */}
              <AnimatePresence>
                {formData.interest && currentPeople.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                  >
                    <div className="mb-10">
                      <label className={`block text-sm font-semibold text-slate-700 mb-4 text-center ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        {content[currentLanguage].whoDidYouTalkTo}
                      </label>
                      <p className={`text-xs text-red-600 font-semibold text-center mb-6 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        {content[currentLanguage].requiredSelection}
                      </p>
                      
                      <div className="relative max-w-4xl mx-auto">
                        {/* Navigation Arrows - Only show if more than 3 people */}
                        {currentPeople.length > 3 && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                if (woosh1Ref.current) {
                                  woosh1Ref.current.currentTime = 0;
                                  woosh1Ref.current.play().catch(() => {});
                                }
                                setCarouselIndex(carouselIndex === 0 ? Math.max(0, currentPeople.length - 3) : carouselIndex - 1);
                                triggerWooshHaptic();
                              }}
                              className="flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center text-slate-600 hover:text-slate-900"
                            >
                              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => {
                                if (woosh1Ref.current) {
                                  woosh1Ref.current.currentTime = 0;
                                  woosh1Ref.current.play().catch(() => {});
                                }
                                setCarouselIndex(carouselIndex >= currentPeople.length - 3 ? 0 : carouselIndex + 1);
                                triggerWooshHaptic();
                              }}
                              className="flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center text-slate-600 hover:text-slate-900"
                            >
                              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Carousel Container */}
                        <div className={`overflow-hidden rounded-3xl ${currentPeople.length > 3 ? 'mx-2 md:mx-16' : ''}`}>
                          <motion.div
                            animate={{ 
                              x: currentPeople.length > 3 
                                ? `-${carouselIndex * (window.innerWidth < 768 ? 100 / 2 : 100 / 3)}%`
                                : '0%'
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="flex"
                          >
                            {currentPeople.map((person, index) => (
                              <motion.div
                                key={index}
                                className={`${
                                  currentPeople.length === 1 ? 'min-w-full' :
                                  currentPeople.length === 2 ? 'min-w-[50%]' :
                                  'min-w-[50%] md:min-w-[33.333%]'
                                } px-1 md:px-2`}
                                whileHover={{ scale: formData.interest !== 'supply' && selectedPersonIndex === null ? 1.02 : 1 }}
                                whileTap={{ scale: formData.interest !== 'supply' ? 0.98 : 1 }}
                              >
                                <motion.button
                                  type="button"
                                  onClick={() => handlePersonSelect(index)}
                                  disabled={formData.interest === 'supply'}
                                  className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 min-h-[120px] md:min-h-[140px] ${
                                    selectedPersonIndex === index
                                      ? 'bg-gradient-to-br from-[#6daead] to-[#1c2d36] text-white shadow-xl shadow-[#6daead]/40'
                                      : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200 shadow-lg'
                                  } ${formData.interest === 'supply' ? 'cursor-default' : 'cursor-pointer'}`}
                                >
                                  <div className="flex flex-col items-center gap-2 md:gap-3">
                                    {/* Avatar */}
                                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 md:border-3 ${
                                      selectedPersonIndex === index ? 'border-white/30' : 'border-slate-200'
                                    }`}>
                                      <img
                                        src={person.image}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          // Fallback if image fails to load
                                          e.currentTarget.src = '/Assets/Cityscape/Memar/Memar_Logo.png';
                                        }}
                                      />
                                    </div>
                                    
                                    {/* Name */}
                                    <div className="text-center">
                                      <h3 className={`text-xs md:text-base font-bold leading-tight break-words ${
                                        selectedPersonIndex === index ? 'text-white' : 'text-slate-900'
                                      }`}>
                                        {person.name}
                                      </h3>
                                    </div>

                                    {/* Selected Indicator */}
                                    {selectedPersonIndex === index && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-1 mt-1"
                                      >
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold">{currentLanguage === 'en' ? 'Selected' : 'محدد'}</span>
                                      </motion.div>
                                    )}

                                    {/* Locked Indicator for Supplier */}
                                    {formData.interest === 'supply' && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex items-center gap-1 mt-1"
                                      >
                                        <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-semibold">{currentLanguage === 'en' ? 'Auto-Selected' : 'محدد تلقائيًا'}</span>
                                      </motion.div>
                                    )}
                                  </div>
                                </motion.button>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>

                        {/* Carousel Indicators - Only show if more than 3 people */}
                        {currentPeople.length > 3 && (
                          <div className="flex justify-center gap-2 mt-4 md:mt-6">
                            {Array.from({ length: Math.ceil(currentPeople.length / 3) }, (_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  if (selection1Ref.current) {
                                    selection1Ref.current.currentTime = 0;
                                    selection1Ref.current.play().catch(() => {});
                                  }
                                  setCarouselIndex(index);
                                  triggerStrongHaptic(60);
                                }}
                                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                  index === carouselIndex
                                    ? 'bg-[#6daead] w-6 md:w-8'
                                    : 'bg-slate-300 hover:bg-slate-400'
                                }`}
                              />
                            ))}
                          </div>
                        )}

                      </div>
                      
                      {/* Error message for required selection */}
                      {errors.leadGenOfficerName && (
                        <p className="text-red-500 text-sm mt-2 text-center">{errors.leadGenOfficerName}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Investment Budget Widget - Only show for Investors */}
              <AnimatePresence>
                {formData.interest === 'invest' && (
                  <InvestmentBudgetWidget
                    value={formData.budget}
                    onChange={(value) => handleInputChange('budget', value)}
                    currentLanguage={currentLanguage}
                    onInteraction={() => {
                      triggerHaptic(1);
                      if (woosh1Ref.current) {
                        woosh1Ref.current.currentTime = 0;
                        woosh1Ref.current.play().catch(() => {});
                      }
                    }}
                  />
                )}
              </AnimatePresence>

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
                  formData.interest === 'invest' 
                    ? content[currentLanguage].submitButton 
                    : content[currentLanguage].submitButtonOther
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
              © {new Date().getFullYear()} Memar Development and Investment. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm mb-3">
              <a 
                href="https://www.memar.sa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6daead] hover:text-[#5a9a99] font-semibold transition-colors duration-200"
              >
                www.memar.sa
              </a>
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

