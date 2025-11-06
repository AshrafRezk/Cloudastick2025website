import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';

type BoothPurpose = 'investors' | 'offices' | 'residents';

const CityscapeStart: React.FC = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [boothPurpose, setBoothPurpose] = useState<BoothPurpose | ''>('');
  const [errors, setErrors] = useState({ companyName: '', boothPurpose: '' });
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');

  // Content by language
  const content = {
    en: {
      title: 'Cityscape',
      titleHighlight: 'Demo',
      subtitle: 'Experience personalized lead capture powered by AI and Salesforce',
      companyLabel: "What's your company name?",
      companyPlaceholder: 'e.g., Acme Real Estate',
      goalLabel: "What's your main goal at Cityscape?",
      continueButton: 'Continue to Lead Capture',
      poweredBy: 'Powered by',
      partner: 'Salesforce Partner',
      errors: {
        companyName: 'Company name is required',
        boothPurpose: 'Please select your booth purpose'
      }
    },
    ar: {
      title: 'معرض سيتي سكيب',
      titleHighlight: 'تجريبي',
      subtitle: 'تجربة التقاط العملاء المحتملين المخصصة المدعومة بالذكاء الاصطناعي وسيلز فورس',
      companyLabel: 'ما اسم شركتك؟',
      companyPlaceholder: 'مثال: شركة العقارات المثالية',
      goalLabel: 'ما هو هدفك الرئيسي في سيتي سكيب؟',
      continueButton: 'متابعة إلى نموذج التسجيل',
      poweredBy: 'مدعوم من',
      partner: 'شريك سيلز فورس',
      errors: {
        companyName: 'اسم الشركة مطلوب',
        boothPurpose: 'يرجى اختيار غرض الجناح الخاص بك'
      }
    }
  };

  const purposes = {
    en: [
      {
        id: 'investors' as BoothPurpose,
        title: 'Attract Investors',
        description: 'Secure funding and partnerships',
        icon: TrendingUpIcon,
        gradient: 'from-emerald-500 to-teal-600'
      },
      {
        id: 'offices' as BoothPurpose,
        title: 'Attract Offices',
        description: 'Ready-to-move business spaces',
        icon: BusinessIcon,
        gradient: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'residents' as BoothPurpose,
        title: 'Attract Residents',
        description: 'Residential property buyers',
        icon: HomeIcon,
        gradient: 'from-purple-500 to-pink-600'
      }
    ],
    ar: [
      {
        id: 'investors' as BoothPurpose,
        title: 'جذب المستثمرين',
        description: 'تأمين التمويل والشراكات',
        icon: TrendingUpIcon,
        gradient: 'from-emerald-500 to-teal-600'
      },
      {
        id: 'offices' as BoothPurpose,
        title: 'جذب المكاتب',
        description: 'مساحات عمل جاهزة للانتقال',
        icon: BusinessIcon,
        gradient: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'residents' as BoothPurpose,
        title: 'جذب السكان',
        description: 'مشترو العقارات السكنية',
        icon: HomeIcon,
        gradient: 'from-purple-500 to-pink-600'
      }
    ]
  };

  const handleLanguageSwitch = () => {
    setCurrentLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const validateForm = (): boolean => {
    const newErrors = { companyName: '', boothPurpose: '' };
    
    if (!companyName.trim()) {
      newErrors.companyName = content[currentLanguage].errors.companyName;
    }
    
    if (!boothPurpose) {
      newErrors.boothPurpose = content[currentLanguage].errors.boothPurpose;
    }
    
    setErrors(newErrors);
    return !newErrors.companyName && !newErrors.boothPurpose;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Store selections in sessionStorage to use in the next page
      sessionStorage.setItem('cityscape_company_name', companyName);
      sessionStorage.setItem('cityscape_booth_purpose', boothPurpose);
      navigate('/cityscape-lead-capture');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
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

      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-block mb-6"
            >
              <LocationCityIcon sx={{ fontSize: { xs: 80, md: 120 } }} className="text-blue-600" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              {content[currentLanguage].title} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{content[currentLanguage].titleHighlight}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
              {content[currentLanguage].subtitle}
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Company Name Input */}
            <div className="mb-8">
              <label htmlFor="companyName" className={`block text-lg font-semibold text-slate-800 mb-3 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {content[currentLanguage].companyLabel}
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) setErrors({ ...errors, companyName: '' });
                }}
                className={`w-full px-6 py-4 rounded-2xl border-2 text-slate-900 text-lg placeholder-slate-400 bg-white ${
                  errors.companyName ? 'border-red-500' : 'border-slate-200'
                } focus:border-blue-500 focus:outline-none transition-colors duration-200`}
                placeholder={content[currentLanguage].companyPlaceholder}
              />
              {errors.companyName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.companyName}
                </motion.p>
              )}
            </div>

            {/* Booth Purpose Selection */}
            <div className="mb-8">
              <label className={`block text-lg font-semibold text-slate-800 mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {content[currentLanguage].goalLabel}
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {purposes[currentLanguage].map((purpose) => {
                  const IconComponent = purpose.icon;
                  return (
                    <motion.button
                      key={purpose.id}
                      type="button"
                      onClick={() => {
                        setBoothPurpose(purpose.id);
                        if (errors.boothPurpose) setErrors({ ...errors, boothPurpose: '' });
                      }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-2xl border-3 transition-all duration-300 ${
                        boothPurpose === purpose.id
                          ? `border-transparent bg-gradient-to-br ${purpose.gradient} text-white shadow-xl`
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="mb-3">
                        <IconComponent sx={{ fontSize: 48 }} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{purpose.title}</h3>
                      <p className={`text-sm ${
                        boothPurpose === purpose.id ? 'text-white/90' : 'text-slate-500'
                      }`}>
                        {purpose.description}
                      </p>
                    
                      {boothPurpose === purpose.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              
              {errors.boothPurpose && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.boothPurpose}
                </motion.p>
              )}
            </div>

            {/* Continue Button */}
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {content[currentLanguage].continueButton}
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-8 text-slate-600"
          >
            <p className="text-sm">
              {content[currentLanguage].poweredBy}{' '}
              <a 
                href="https://cloudastick.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Cloudastick
              </a>
              {' '}• {content[currentLanguage].partner}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CityscapeStart;

