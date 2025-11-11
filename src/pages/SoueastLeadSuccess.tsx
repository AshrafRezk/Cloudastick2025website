import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Car, Phone, Mail, ExternalLink, Table } from 'lucide-react';
import { carModels, type CarModel } from '../utils/soueastData';

const SoueastLeadSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [videoReady, setVideoReady] = React.useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Get selected cars and user info from URL params
  const selectedCarsParam = searchParams.get('cars');
  const selectedCars = selectedCarsParam ? selectedCarsParam.split(',').filter(Boolean) : [];
  const firstName = searchParams.get('firstName') || '';
  const title = searchParams.get('title') || '';
  
  // Get car details for selected models
  const selectedCarDetails = useMemo(() => {
    return selectedCars
      .map(model => carModels.find(car => car.model === model))
      .filter((car): car is CarModel => car !== undefined);
  }, [selectedCars]);
  
  // Detect language (simple detection based on name or default to English)
  const currentLanguage = React.useMemo(() => {
    // You could add language detection logic here, for now defaulting to English
    return 'en';
  }, []);
  
  // Generate personalized message about car choices
  const personalizedMessage = useMemo(() => {
    if (selectedCarDetails.length === 0) return '';
    
    const name = title && firstName ? `${title} ${firstName}` : firstName || (currentLanguage === 'ar' ? 'عميلنا العزيز' : 'Valued Customer');
    const carNames = selectedCarDetails.map(c => c.model).join(' and ');
    
    const reasons: string[] = [];
    const reasonsAr: string[] = [];
    
    // Check for specific features
    const hasHybrid = selectedCarDetails.some(c => c.model.includes('PHEV') || c.model.includes('DM'));
    const hasPremium = selectedCarDetails.some(c => c.model.includes('PREMIUM') || c.model.includes('LUX'));
    const hasS09 = selectedCarDetails.some(c => c.category === 'S09');
    const hasS07 = selectedCarDetails.some(c => c.category === 'S07');
    const hasS06 = selectedCarDetails.some(c => c.category === 'S06');
    
    if (hasHybrid) {
      reasons.push('eco-friendly hybrid technology that saves fuel and reduces emissions');
      reasonsAr.push('تقنية هجينة صديقة للبيئة توفر الوقود وتقلل الانبعاثات');
    }
    if (hasPremium) {
      reasons.push('premium features like panoramic sunroofs, advanced safety systems, and luxury interiors');
      reasonsAr.push('ميزات مميزة مثل السقف البانورامي وأنظمة السلامة المتقدمة والديكورات الفاخرة');
    }
    if (hasS09) {
      reasons.push('spacious S09 models perfect for families with exceptional comfort and performance');
      reasonsAr.push('موديلات S09 الواسعة المثالية للعائلات مع راحة وأداء استثنائي');
    }
    if (hasS07) {
      reasons.push('versatile S07 models offering the perfect balance of style and functionality');
      reasonsAr.push('موديلات S07 المتعددة الاستخدامات التي توفر التوازن المثالي بين الأناقة والوظائف');
    }
    if (hasS06) {
      reasons.push('compact yet powerful S06 models ideal for city driving and efficiency');
      reasonsAr.push('موديلات S06 المدمجة والقوية المثالية للقيادة في المدينة والكفاءة');
    }
    
    // Add general reasons
    if (reasons.length < 3) {
      reasons.push('advanced turbocharged engines delivering impressive power and efficiency');
      reasons.push('modern technology and safety features for peace of mind');
      reasons.push('excellent value with competitive pricing in the Saudi market');
      reasonsAr.push('محركات توربينية متقدمة توفر قوة وكفاءة مذهلة');
      reasonsAr.push('تقنيات حديثة وميزات السلامة لراحة البال');
      reasonsAr.push('قيمة ممتازة مع أسعار تنافسية في السوق السعودي');
    }
    
    const selectedReasons = reasons.slice(0, 5);
    const selectedReasonsAr = reasonsAr.slice(0, 5);
    const reasonsText = selectedReasons.map((r, i) => `${i + 1}. ${r}`).join('\n');
    const reasonsTextAr = selectedReasonsAr.map((r, i) => `${i + 1}. ${r}`).join('\n');
    
    if (currentLanguage === 'ar') {
      return `${name}، لقد قمت باختيارات ممتازة مع ${carNames}! إليك لماذا هذه الموديلات من Soueast مثالية لك:\n\n${reasonsTextAr}\n\nاختيارك يُظهر ذوقاً رفيعاً في الجمع بين الأداء والتكنولوجيا والقيمة. نحن متحمسون لمساعدتك في تجربة هذه المركبات المذهلة!`;
    }
    
    return `${name}, you've made excellent choices with the ${carNames}! Here's why these Soueast models are perfect for you:\n\n${reasonsText}\n\nYour selection shows great taste in combining performance, technology, and value. We're excited to help you experience these amazing vehicles!`;
  }, [selectedCarDetails, firstName, title, currentLanguage]);

  useEffect(() => {
    // Load YouTube iframe API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set video ready after a short delay to ensure iframe is loaded
    const timer = setTimeout(() => {
      setVideoReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate('/soueast-lead-capture');
  };

  const handleVisitWebsite = () => {
    window.open('https://soueastksa.com', '_blank');
  };

  const handleViewComparison = () => {
    if (selectedCars.length > 0) {
      const carsParam = encodeURIComponent(selectedCars.join(','));
      navigate(`/soueast-comparison?cars=${carsParam}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
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
            backgroundImage: 'radial-gradient(circle, rgba(238, 113, 56, 0.2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 md:py-12 lg:py-16 min-h-screen">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12 lg:mb-16 w-full"
        >
          {/* Soueast Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 mx-auto relative">
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
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-4 md:p-6 relative z-10">
                <img
                  src="/Assets/Customers/Soueast/SoueastLogoTransparent(Black).png"
                  alt="Soueast"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to white logo if black doesn't load
                    (e.target as HTMLImageElement).src = '/Assets/Customers/Soueast/SoueastLogoTransparent(White).png';
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* YouTube Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-4xl mx-auto mb-8 md:mb-12 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20"
          >
            {videoReady && (
              <iframe
                ref={iframeRef}
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/bWLgMcO5opg?autoplay=1&mute=0&controls=1&loop=1&playlist=bWLgMcO5opg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
            {!videoReady && (
              <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center">
                <div className="text-white/70 text-lg">Loading video...</div>
              </div>
            )}
          </motion.div>

          {/* Motto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-4"
          >
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white text-lg md:text-xl font-semibold rounded-full shadow-lg">
              Ease Your Life
            </span>
          </motion.div>

          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-[#ee7138] to-[#d85a20] rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6"
          >
            Thank You!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-3 md:mb-4 max-w-2xl mx-auto"
          >
            Your inquiry has been submitted successfully.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-6"
          >
            Our sales team will reach out to you shortly with personalized offers and more information about your selected vehicles.
          </motion.p>

          {/* Personalized Car Choice Message */}
          {personalizedMessage && selectedCarDetails.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-3xl mx-auto mt-8 p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ee7138] to-[#d85a20] rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {currentLanguage === 'ar' ? 'لماذا اختياراتك مثالية' : 'Why Your Choices Are Perfect'}
                  </h3>
                  <div className="text-white/90 text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {personalizedMessage}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 1.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mb-8 md:mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <Car className="w-8 h-8" />
              What Happens Next?
            </h2>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#ee7138] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Review Your Preferences</h3>
                  <p className="text-white/80">Our team will review your selected cars, budget, and color preferences.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#ee7138] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Personalized Quote</h3>
                  <p className="text-white/80">We'll prepare a customized quote with the best pricing and financing options for your selected vehicles.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-[#ee7138] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Schedule a Test Drive</h3>
                  <p className="text-white/80">We'll contact you to schedule a convenient time for a test drive and answer any questions you may have.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="w-full max-w-md mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Need Immediate Assistance?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/90">
                <Phone className="w-5 h-5 text-[#ee7138]" />
                <span>Call us for immediate support</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Mail className="w-5 h-5 text-[#ee7138]" />
                <span>Email us with any questions</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
          className="flex flex-col gap-4 w-full max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visit Website Button */}
            <motion.button
              onClick={handleVisitWebsite}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-4 bg-gradient-to-r from-[#ee7138] to-[#d85a20] hover:from-[#d85a20] hover:to-[#ee7138] text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Visit Soueast Website
            </motion.button>

            {/* View Comparison Button - Only show if cars were selected */}
            {selectedCars.length >= 2 && (
              <motion.button
                onClick={handleViewComparison}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold rounded-2xl border-2 border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Table className="w-5 h-5" />
                View Comparison Table
              </motion.button>
            )}
          </div>

          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-semibold rounded-2xl border-2 border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Form
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm md:text-base text-white/70">
            Powered by{' '}
            <a 
              href="https://cloudastick.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#ee7138] hover:text-[#d85a20] font-semibold transition-colors duration-200"
            >
              Cloudastick
            </a>
            {' '}• Salesforce Partner
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SoueastLeadSuccess;

