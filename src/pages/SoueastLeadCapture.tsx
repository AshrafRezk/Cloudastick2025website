import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CheckCircle2, MapPin, Phone, Mail, MessageSquare, CreditCard } from 'lucide-react';
import SoueastBudgetWidget from '../components/SoueastBudgetWidget';
import SoueastCarSelector from '../components/SoueastCarSelector';
import SoueastColorSelector from '../components/SoueastColorSelector';
import SoueastCarComparison from '../components/SoueastCarComparison';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  company: string;
  budget: string;
  selectedCars: string[];
  preferredColors: string[];
  description: string;
  lead_source: string;
  branch: string;
  preferredContactMethod: string;
  subChannel: string;
  title: string;
  enquiryType: string;
}

const SoueastLeadCapture: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    company: '',
    budget: '80000', // Default budget to show some cars initially
    selectedCars: [],
    preferredColors: [],
    description: '',
    lead_source: '',
    branch: '',
    preferredContactMethod: '',
    subChannel: '',
    title: '',
    enquiryType: '',
  });
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [personalizedQuote, setPersonalizedQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [videoFailedBackground, setVideoFailedBackground] = useState(false);
  const [backgroundVideoLoaded, setBackgroundVideoLoaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null);
  const woosh2Ref = useRef<HTMLAudioElement>(null);
  const selection1Ref = useRef<HTMLAudioElement>(null);
  const videoRefBackground = useRef<HTMLVideoElement>(null);

  // Language content
  const content = {
    en: {
      title: 'Find Your Perfect Soueast',
      motto: 'Ease Your Life',
      subtitle: 'Explore our premium vehicle lineup and find the car that matches your style and budget',
      formTitle: 'Get Your Personalized Quote',
      formSubtitle: 'Fill in your details and we\'ll get back to you with the best offers',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      mobile: 'Mobile',
      company: 'Company (Optional)',
      companyPlaceholder: 'e.g., ABC Corporation',
      description: 'Additional Comments',
      descriptionPlaceholder: 'Tell us about your preferences...',
      submitButton: 'Submit Inquiry',
      submitButtonSubmitting: 'Submitting...',
      successMessage: 'Your details were sent successfully!',
      required: 'Required',
      invalidEmail: 'Invalid email format',
      selectAtLeastOneCar: 'Please select at least one car',
      branch: 'Branch',
      branchPlaceholder: 'Select a branch',
      preferredContactMethod: 'Preferred Contact Method',
      preferredContactMethodPlaceholder: 'Select preferred method',
      subChannel: 'Sub Channel',
      subChannelPlaceholder: 'Select sub channel',
      title: 'Title',
      titlePlaceholder: 'e.g., Mr., Mrs., Dr.',
      enquiryType: 'Enquiry Type',
      enquiryTypePlaceholder: 'Select enquiry type',
    },
    ar: {
      title: 'ابحث عن سيارتك المثالية من Soueast',
      motto: 'سهّل حياتك',
      subtitle: 'استكشف مجموعة سياراتنا المميزة وابحث عن السيارة التي تناسب أسلوبك وميزانيتك',
      formTitle: 'احصل على عرضك الشخصي',
      formSubtitle: 'املأ بياناتك وسنتواصل معك بأفضل العروض',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      mobile: 'رقم الجوال',
      company: 'الشركة (اختياري)',
      companyPlaceholder: 'مثال: شركة ABC',
      description: 'ملاحظات إضافية',
      descriptionPlaceholder: 'أخبرنا عن تفضيلاتك...',
      submitButton: 'إرسال الاستفسار',
      submitButtonSubmitting: 'جاري الإرسال...',
      successMessage: 'تم إرسال بياناتك بنجاح!',
      required: 'مطلوب',
      invalidEmail: 'صيغة البريد الإلكتروني غير صحيحة',
      selectAtLeastOneCar: 'يرجى اختيار سيارة واحدة على الأقل',
      branch: 'الفرع',
      branchPlaceholder: 'اختر الفرع',
      preferredContactMethod: 'طريقة التواصل المفضلة',
      preferredContactMethodPlaceholder: 'اختر طريقة التواصل',
      subChannel: 'القناة الفرعية',
      subChannelPlaceholder: 'اختر القناة الفرعية',
      title: 'المسمى الوظيفي',
      titlePlaceholder: 'مثال: السيد، السيدة، الدكتور',
      enquiryType: 'نوع الاستفسار',
      enquiryTypePlaceholder: 'اختر نوع الاستفسار',
    },
  };

  // Haptic feedback helper - subtle vibration
  const triggerHaptic = (duration = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(Math.max(10, Math.min(50, duration)));
    }
  };

  // Strong haptic feedback - more noticeable vibration
  const triggerStrongHaptic = (duration = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(Math.max(50, Math.min(200, duration)));
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
        video.play().catch(error => {
          console.log('Video play failed, retrying...', error);
          setTimeout(() => {
            if (video && !video.paused) return;
            video.play().catch(console.error);
          }, 500);
        });
      };
      
      const handleLoadedData = () => {
        setVideoFailedBackground(false);
        setBackgroundVideoLoaded(true);
      };
      
      const handleError = () => {
        console.log('Background video error');
        setVideoFailedBackground(true);
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
      const isTablet = /iPad|Android/i.test(userAgent) && !isMobile;
      const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';
      
      // Extract browser info
      let browser = 'Unknown';
      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
      else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Edg')) browser = 'Edge';
      
      // Extract OS info
      let os = 'Unknown';
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
      
      // Get query parameters
      const urlParams = new URLSearchParams(window.location.search);
      
      // Capture lead source from URL params (check multiple param names)
      const leadSource = urlParams.get('lead_source') 
        || urlParams.get('source') 
        || urlParams.get('utm_source')
        || urlParams.get('src')
        || 'Organic'; // Default
      
      // Set lead source in form data
      setFormData(prev => ({ ...prev, lead_source: leadSource }));
      
      const info = `Device: ${deviceType}
Browser: ${browser}
OS: ${os}
Screen: ${width}x${height}
Language: ${language}
Timezone: ${timezone}
Referrer: ${referrer}
User Agent: ${userAgent}`;
      
      setDeviceInfo(info);
    };

    captureDeviceInfo();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = content[currentLanguage].required;
    if (!formData.last_name.trim()) newErrors.last_name = content[currentLanguage].required;
    if (!formData.email.trim()) newErrors.email = content[currentLanguage].required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = content[currentLanguage].invalidEmail;
    }
    if (!formData.mobile.trim()) newErrors.mobile = content[currentLanguage].required;
    if (formData.selectedCars.length === 0) {
      newErrors.selectedCars = content[currentLanguage].selectAtLeastOneCar;
    }
    
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
    triggerHaptic(1);

    try {
      // Create a hidden form for Salesforce submission
      const hiddenForm = document.createElement('form');
      hiddenForm.action = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DQE000005J5XN';
      hiddenForm.method = 'POST';
      hiddenForm.target = 'salesforce-iframe';
      
      // Helper to add hidden fields
      const addField = (name: string, value: string) => {
        if (!value) return; // Skip empty values
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        hiddenForm.appendChild(input);
      };

      // Helper to add checkbox field
      const addCheckbox = (name: string, checked: boolean) => {
        if (checked) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = '1';
          hiddenForm.appendChild(input);
        }
      };

      // Helper to convert color codes to color names
      const getColorNameByCode = (colorCode: string): string => {
        const colorMap: Record<string, string> = {
          '#2d5016': 'Mountain Green',
          '#FFFFFF': 'Snow White',
          '#4a4a4a': 'Phantom Grey',
          '#8b8b8b': 'Moon Grey',
          '#1e3a5f': 'Ocean Blue',
          '#000000': 'Starlit Black',
        };
        return colorMap[colorCode] || colorCode;
      };

      // Map lead source to Salesforce values
      const mapLeadSource = (source: string): string => {
        const sourceLower = source.toLowerCase();
        // Map common URL param values to Salesforce lead_source options
        if (sourceLower.includes('event') || sourceLower.includes('gitex') || sourceLower.includes('exhibition')) return 'Events';
        if (sourceLower.includes('social') || sourceLower.includes('instagram') || sourceLower.includes('facebook') || sourceLower.includes('tiktok') || sourceLower.includes('snapchat') || sourceLower.includes('twitter') || sourceLower.includes('x')) return 'Social media';
        if (sourceLower.includes('ad') || sourceLower.includes('google') || sourceLower.includes('display')) return 'Ads';
        if (sourceLower.includes('walk') || sourceLower.includes('visit')) return 'Walk-in';
        if (sourceLower.includes('friend') || sourceLower.includes('referral')) return 'Friends';
        if (sourceLower.includes('website') || sourceLower.includes('organic') || sourceLower.includes('direct')) return 'Website';
        if (sourceLower.includes('influencer')) return 'Influencers';
        if (sourceLower.includes('call') || sourceLower.includes('phone')) return 'Call Center';
        // Default to Website if no match
        return 'Website';
      };

      // Add all form fields per Salesforce web-to-lead form
      addField('oid', '00DQE000005J5XN');
      addField('retURL', window.location.origin + '/soueast-success');
      addField('first_name', formData.first_name);
      addField('last_name', formData.last_name);
      addField('email', formData.email);
      // Mobile number with country code (00966 for Saudi Arabia)
      const fullMobileNumber = formData.mobile ? `00966${formData.mobile}` : '';
      addField('mobile', fullMobileNumber);
      addField('company', formData.company || '');
      addField('lead_source', mapLeadSource(formData.lead_source || 'Website'));
      
      // Models of Interest (multi-select field: 00NOm000004E6JN)
      // For multi-select, Salesforce expects semicolon-separated values
      if (formData.selectedCars.length > 0) {
        formData.selectedCars.forEach(carModel => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = '00NOm000004E6JN';
          input.value = carModel;
          hiddenForm.appendChild(input);
        });
      }
      
      // Colors of Interest (multi-select field: 00NOm000004E6Pp)
      // Convert color codes to color names and submit as multi-select
      if (formData.preferredColors.length > 0) {
        formData.preferredColors.forEach(colorCode => {
          const colorName = getColorNameByCode(colorCode);
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = '00NOm000004E6Pp';
          input.value = colorName;
          hiddenForm.appendChild(input);
        });
      }
      
      // Comments field (00NQE00000GkBor2AF) - rich text field
      let commentsText = '';
      
      // User's actual comment/description
      if (formData.description) {
        commentsText += `${formData.description}`;
      }
      
      // Add separator line breaks before technical information
      if (formData.description || (formData.budget && parseInt(formData.budget) > 0)) {
        commentsText += '\n\n---\n\n';
      }
      
      // Budget information
      if (formData.budget && parseInt(formData.budget) > 0) {
        commentsText += `Budget: ${parseInt(formData.budget).toLocaleString('en-US')} SAR\n\n`;
      }
      
      // Device and location information
      commentsText += `Device Information:\n${deviceInfo}`;
      addField('00NQE00000GkBor2AF', commentsText);
      
      // Has Budget checkbox (00NQE000006PDWT) - check if budget is provided
      if (formData.budget && parseInt(formData.budget) > 0) {
        addCheckbox('00NQE000006PDWT', true);
      }

      // Branch (00NQE00000CUPYN)
      if (formData.branch) {
        addField('00NQE00000CUPYN', formData.branch);
      }

      // Preferred Contact Method (00NQE00000GG0PR)
      if (formData.preferredContactMethod) {
        addField('00NQE00000GG0PR', formData.preferredContactMethod);
      }

      // Sub Channel (00NQE00000CUdpp)
      if (formData.subChannel) {
        addField('00NQE00000CUdpp', formData.subChannel);
      }

      // Title
      if (formData.title) {
        addField('title', formData.title);
      }

      // Enquiry Type (00NQE00000Gk6kL)
      if (formData.enquiryType) {
        addField('00NQE00000Gk6kL', formData.enquiryType);
      }

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

      // Redirect to success page with selected cars in URL params
      const selectedCarsParam = encodeURIComponent(formData.selectedCars.join(','));
      setTimeout(() => {
        window.location.href = `/soueast-success?cars=${selectedCarsParam}`;
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      triggerStrongHaptic(100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageSwitch = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ar' : 'en');
    triggerHaptic(1);
  };

  // Inspirational quotes about Soueast and automotive
  const quotes = {
    en: [
      "{name}, your perfect Soueast is waiting to ease your life.",
      "{name}, discover the freedom of driving with Soueast's premium vehicles.",
      "{name}, experience innovation and style with Soueast's cutting-edge technology.",
      "{name}, find your ideal companion on the road with Soueast.",
      "{name}, elevate your driving experience with Soueast's exceptional quality.",
      "{name}, join thousands of satisfied drivers who chose Soueast.",
      "{name}, make every journey memorable with a Soueast vehicle.",
      "{name}, unlock premium features and performance with Soueast.",
      "{name}, drive with confidence knowing you chose Soueast excellence.",
      "{name}, your next adventure starts with Soueast.",
    ],
    ar: [
      "{name}، سيارتك المثالية من Soueast في انتظارك لتسهيل حياتك.",
      "{name}، اكتشف حرية القيادة مع سيارات Soueast المميزة.",
      "{name}، جرب الابتكار والأناقة مع تقنية Soueast المتطورة.",
      "{name}، ابحث عن رفيقك المثالي على الطريق مع Soueast.",
      "{name}، ارتق بتجربة القيادة مع جودة Soueast الاستثنائية.",
      "{name}، انضم إلى آلاف السائقين الراضين الذين اختاروا Soueast.",
      "{name}، اجعل كل رحلة لا تُنسى مع سيارة Soueast.",
      "{name}، افتح الميزات المميزة والأداء مع Soueast.",
      "{name}، قُد بثقة مع العلم أنك اخترت تميز Soueast.",
      "{name}، مغامرتك القادمة تبدأ مع Soueast.",
    ]
  };

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Show personalized quote when typing last name after first name is complete
    if (field === 'last_name' && typeof value === 'string' && formData.first_name.length >= 3 && !showQuote && value.length > 0) {
      const currentQuotes = quotes[currentLanguage];
      const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
      const personalized = randomQuote.replace('{name}', formData.first_name);
      setPersonalizedQuote(personalized);
      setShowQuote(true);
      triggerHaptic(1);
    }
    
    // Hide quote if first name is cleared
    if (field === 'first_name' && typeof value === 'string' && value.length < 3) {
      setShowQuote(false);
    }
  };

  const scrollToForm = () => {
    setIsTransitioning(true);
    
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
        className="fixed top-6 right-6 z-50 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-semibold text-[#ee7138] whitespace-nowrap">
          {currentLanguage === 'en' ? 'العربية' : 'English'}
        </span>
      </motion.button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
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
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              style={{ 
                minWidth: '100%', 
                minHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
              onError={() => setVideoFailedBackground(true)}
            >
              <source src="/Assets/Customers/Soueast/SOUEAST — Distinct by design..mp4" type="video/mp4" />
              <source src="./Assets/Customers/Soueast/SOUEAST — Distinct by design..mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60" />
          </div>
        )}
        
        {/* Fallback background pattern */}
        {videoFailedBackground && (
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
                backgroundImage: 'radial-gradient(circle, rgba(238, 113, 56, 0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Soueast Logo */}
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
                className="absolute inset-0 bg-gradient-to-br from-[#ee7138]/30 to-black/30 rounded-full blur-3xl"
              />
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6 relative z-10">
                <img
                  src="/Assets/Customers/Soueast/SoueastLogoTransparent(Black).png"
                  alt="Soueast"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Motto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white text-lg md:text-xl font-semibold rounded-full shadow-lg">
              {content[currentLanguage].motto}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-4xl md:text-6xl font-bold text-slate-900 mb-6 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {content[currentLanguage].title}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {content[currentLanguage].subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={scrollToForm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Car className="w-5 h-5" />
            {content[currentLanguage].formTitle}
          </motion.button>
        </div>
      </section>

      {/* Form Section */}
      <section id="lead-form" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="mb-8 text-center">
              <h2 className={`text-3xl font-bold text-slate-900 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {content[currentLanguage].formTitle}
              </h2>
              <p className={`text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {content[currentLanguage].formSubtitle}
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Personalized Quote */}
              <AnimatePresence>
                {showQuote && formData.first_name && personalizedQuote && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 p-6 bg-gradient-to-br from-[#ee7138]/10 to-[#d85a20]/10 rounded-2xl border-2 border-[#ee7138]/30 shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#ee7138] to-[#d85a20] rounded-full flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold text-[#ee7138] mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {currentLanguage === 'en' 
                            ? `Hi ${formData.first_name}! Here's something special for you:`
                            : `مرحباً ${formData.first_name}! إليك شيئاً مميزاً لك:`}
                        </p>
                        <p className={`text-lg text-slate-800 italic leading-relaxed ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          "{personalizedQuote}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Budget Widget */}
              <SoueastBudgetWidget
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

              {/* Car Selector */}
              <SoueastCarSelector
                budget={parseInt(formData.budget) || 0}
                selectedCars={formData.selectedCars}
                onSelectionChange={(cars) => handleInputChange('selectedCars', cars)}
                currentLanguage={currentLanguage}
                onInteraction={() => {
                  triggerHaptic(1);
                  if (selection1Ref.current) {
                    selection1Ref.current.currentTime = 0;
                    selection1Ref.current.play().catch(() => {});
                  }
                }}
              />

              {/* Error for car selection */}
              {errors.selectedCars && (
                <div className={`text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {errors.selectedCars}
                </div>
              )}

              {/* Color Selector */}
              {formData.selectedCars.length > 0 && (
                <SoueastColorSelector
                  selectedColors={formData.preferredColors}
                  onSelectionChange={(colors) => handleInputChange('preferredColors', colors)}
                  currentLanguage={currentLanguage}
                  onInteraction={() => {
                    triggerHaptic(1);
                    if (selection1Ref.current) {
                      selection1Ref.current.currentTime = 0;
                      selection1Ref.current.play().catch(() => {});
                    }
                  }}
                />
              )}

              {/* Car Comparison */}
              {formData.selectedCars.length >= 2 && (
                <SoueastCarComparison
                  selectedCarModels={formData.selectedCars}
                  currentLanguage={currentLanguage}
                  onRemoveCar={(model) => {
                    handleInputChange('selectedCars', formData.selectedCars.filter(c => c !== model));
                  }}
                />
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].firstName} *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${errors.first_name ? 'border-red-300' : 'border-slate-200'} text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.first_name && (
                    <p className={`mt-1 text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {errors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].lastName} *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${errors.last_name ? 'border-red-300' : 'border-slate-200'} text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.last_name && (
                    <p className={`mt-1 text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {errors.last_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].email} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${errors.email ? 'border-red-300' : 'border-slate-200'} text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  {errors.email && (
                    <p className={`mt-1 text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].mobile} *
                  </label>
                  <div className={`flex items-stretch rounded-2xl border-2 ${errors.mobile ? 'border-red-300' : 'border-slate-200'} focus-within:border-[#ee7138] transition-colors duration-200 overflow-hidden`}>
                    {/* Country Code - Pre-filled */}
                    <div className={`px-4 py-3 bg-slate-100 text-slate-600 font-medium flex items-center justify-center border-r-2 border-slate-200 ${currentLanguage === 'ar' ? 'border-l-2 border-r-0' : ''}`} dir="ltr">
                      00966
                    </div>
                    {/* Mobile Number Input */}
                    <input
                      type="tel"
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('mobile', value);
                      }}
                      placeholder={currentLanguage === 'ar' ? '5X XXX XXXX' : '5X XXX XXXX'}
                      className={`flex-1 px-4 py-3 text-slate-900 placeholder-slate-400 bg-white focus:outline-none ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                      dir="ltr"
                      maxLength={9}
                    />
                  </div>
                  {errors.mobile && (
                    <p className={`mt-1 text-sm text-red-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="md:col-span-2">
                  <label htmlFor="company" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].company}
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder={content[currentLanguage].companyPlaceholder}
                    className={`w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].title}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      handleInputChange('title', e.target.value);
                      triggerHaptic(10);
                    }}
                    placeholder={content[currentLanguage].titlePlaceholder}
                    className={`w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>

                {/* Branch - Prominent Field */}
                <div className="md:col-span-2">
                  <label htmlFor="branch" className={`block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 ${currentLanguage === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <MapPin className="w-4 h-4 text-[#ee7138]" />
                    {content[currentLanguage].branch}
                  </label>
                  <div className="relative">
                    <select
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => {
                        handleInputChange('branch', e.target.value);
                        triggerHaptic(10);
                        if (selection1Ref.current) {
                          selection1Ref.current.currentTime = 0;
                          selection1Ref.current.play().catch(() => {});
                        }
                      }}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl border-2 ${formData.branch ? 'border-[#ee7138] bg-[#ee7138]/5' : 'border-slate-200'} text-slate-900 bg-white focus:border-[#ee7138] focus:outline-none transition-all duration-200 appearance-none cursor-pointer font-medium ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <option value="">{content[currentLanguage].branchPlaceholder}</option>
                      <option value="Riyadh">Riyadh</option>
                      <option value="Jeddah">Jeddah</option>
                      <option value="Dammam">Dammam</option>
                    </select>
                    <div className={`absolute top-1/2 -translate-y-1/2 ${currentLanguage === 'ar' ? 'left-4' : 'right-4'} pointer-events-none`}>
                      <svg className="w-5 h-5 text-[#ee7138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label htmlFor="preferredContactMethod" className={`block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 ${currentLanguage === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <Phone className="w-4 h-4 text-[#ee7138]" />
                    {content[currentLanguage].preferredContactMethod}
                  </label>
                  <div className="relative">
                    <select
                      id="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={(e) => {
                        handleInputChange('preferredContactMethod', e.target.value);
                        triggerHaptic(10);
                        if (selection1Ref.current) {
                          selection1Ref.current.currentTime = 0;
                          selection1Ref.current.play().catch(() => {});
                        }
                      }}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl border-2 ${formData.preferredContactMethod ? 'border-[#ee7138] bg-[#ee7138]/5' : 'border-slate-200'} text-slate-900 bg-white focus:border-[#ee7138] focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <option value="">{content[currentLanguage].preferredContactMethodPlaceholder}</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="SMS">SMS</option>
                      <option value="Post">Post</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                    <div className={`absolute top-1/2 -translate-y-1/2 ${currentLanguage === 'ar' ? 'left-4' : 'right-4'} pointer-events-none`}>
                      <svg className="w-5 h-5 text-[#ee7138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sub Channel */}
                <div>
                  <label htmlFor="subChannel" className={`block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 ${currentLanguage === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <MessageSquare className="w-4 h-4 text-[#ee7138]" />
                    {content[currentLanguage].subChannel}
                  </label>
                  <div className="relative">
                    <select
                      id="subChannel"
                      value={formData.subChannel}
                      onChange={(e) => {
                        handleInputChange('subChannel', e.target.value);
                        triggerHaptic(10);
                        if (selection1Ref.current) {
                          selection1Ref.current.currentTime = 0;
                          selection1Ref.current.play().catch(() => {});
                        }
                      }}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl border-2 ${formData.subChannel ? 'border-[#ee7138] bg-[#ee7138]/5' : 'border-slate-200'} text-slate-900 bg-white focus:border-[#ee7138] focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <option value="">{content[currentLanguage].subChannelPlaceholder}</option>
                      <option value="Phone Call">Phone Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Inbound">Inbound</option>
                      <option value="SMS">SMS</option>
                      <option value="Email">Email</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Google Display">Google Display</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Snapchat">Snapchat</option>
                      <option value="X">X</option>
                      <option value="SE Website">SE Website</option>
                      <option value="Auto Show">Auto Show</option>
                      <option value="Mall Exhibition">Mall Exhibition</option>
                      <option value="Launch Event">Launch Event</option>
                      <option value="Telesales">Telesales</option>
                      <option value="Radio">Radio</option>
                      <option value="OOH">OOH</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className={`absolute top-1/2 -translate-y-1/2 ${currentLanguage === 'ar' ? 'left-4' : 'right-4'} pointer-events-none`}>
                      <svg className="w-5 h-5 text-[#ee7138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enquiry Type */}
                <div>
                  <label htmlFor="enquiryType" className={`block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2 ${currentLanguage === 'ar' ? 'text-right flex-row-reverse' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <CreditCard className="w-4 h-4 text-[#ee7138]" />
                    {content[currentLanguage].enquiryType}
                  </label>
                  <div className="relative">
                    <select
                      id="enquiryType"
                      value={formData.enquiryType}
                      onChange={(e) => {
                        handleInputChange('enquiryType', e.target.value);
                        triggerHaptic(10);
                        if (selection1Ref.current) {
                          selection1Ref.current.currentTime = 0;
                          selection1Ref.current.play().catch(() => {});
                        }
                      }}
                      className={`w-full px-4 py-3 pr-10 rounded-2xl border-2 ${formData.enquiryType ? 'border-[#ee7138] bg-[#ee7138]/5' : 'border-slate-200'} text-slate-900 bg-white focus:border-[#ee7138] focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <option value="">{content[currentLanguage].enquiryTypePlaceholder}</option>
                      <option value="Cash">Cash</option>
                      <option value="Lease to Own">Lease to Own</option>
                    </select>
                    <div className={`absolute top-1/2 -translate-y-1/2 ${currentLanguage === 'ar' ? 'left-4' : 'right-4'} pointer-events-none`}>
                      <svg className="w-5 h-5 text-[#ee7138]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {content[currentLanguage].description}
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 resize-none ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={content[currentLanguage].descriptionPlaceholder}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {content[currentLanguage].submitButtonSubmitting}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {content[currentLanguage].submitButton}
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SoueastLeadCapture;

