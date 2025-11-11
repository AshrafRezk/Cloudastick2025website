import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, CheckCircle2 } from 'lucide-react';
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
  });
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null);
  const woosh2Ref = useRef<HTMLAudioElement>(null);
  const selection1Ref = useRef<HTMLAudioElement>(null);

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
    },
    ar: {
      title: 'ابحث عن سيارتك المثالية من ساوث إيست',
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
    },
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
      addField('retURL', window.location.origin + '/soueast-success');
      addField('first_name', formData.first_name);
      addField('last_name', formData.last_name);
      addField('email', formData.email);
      addField('mobile', formData.mobile);
      addField('company', formData.company || '');
      addField('00NQE000000wSwn', formData.budget || ''); // Budget custom field
      addField('lead_source', formData.lead_source || 'Organic');
      
      // Add selected cars and colors to description
      const descriptionText = `
Selected Cars: ${formData.selectedCars.join(', ')}
Preferred Colors: ${formData.preferredColors.join(', ')}
Budget: ${formData.budget ? formData.budget + ' SAR' : 'Not specified'}
${formData.description ? '\nAdditional Comments: ' + formData.description : ''}

Device Information:
${deviceInfo}
      `.trim();
      
      addField('description', descriptionText);

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
        window.location.href = '/soueast-success';
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

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
              backgroundImage: 'radial-gradient(circle, rgba(238, 113, 56, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

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
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${errors.mobile ? 'border-red-300' : 'border-slate-200'} text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
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

