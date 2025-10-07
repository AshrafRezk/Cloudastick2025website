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
  });
  const [deviceInfo, setDeviceInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);

  // Haptic feedback helper
  const triggerHaptic = (duration = 30) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

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
    setFormData(prev => {
      const products = prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product];
      return { ...prev, products };
    });
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
      // Create form data for Salesforce
      const salesforceData = new FormData();
      salesforceData.append('oid', '00D3z000000fPuB');
      salesforceData.append('retURL', 'https://arabic.ai');
      salesforceData.append('first_name', formData.first_name);
      salesforceData.append('last_name', formData.last_name);
      salesforceData.append('email', formData.email);
      salesforceData.append('company', formData.company);
      salesforceData.append('city', formData.city);
      salesforceData.append('country_code', formData.country_code);
      salesforceData.append('mobile', formData.mobile);
      salesforceData.append('industry', formData.industry);
      
      // Add products to comments
      const productsText = `Products of Interest: ${formData.products.join(', ')}\n\n${formData.comments}`;
      salesforceData.append('00NJ5000000hzjZ', productsText);
      
      // Add device info
      salesforceData.append('00NNM00000D1ioR', deviceInfo);

      // Submit to Salesforce
      await fetch('https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D3z000000fPuB', {
        method: 'POST',
        body: salesforceData,
        mode: 'no-cors', // Salesforce doesn't support CORS
      });

      // Show success
      setShowSuccess(true);
      triggerHaptic(50);
      
      // Play success sound
      if (successAudioRef.current) {
        successAudioRef.current.play().catch(() => {});
      }

      // Reset form after delay
      setTimeout(() => {
        setFormData({
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
        });
        setShowSuccess(false);
      }, 5000);
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
  };

  const scrollToForm = () => {
    triggerHaptic(30);
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (showStartup) {
    return <TarwtlStartupSequence onComplete={handleStartupComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Success Audio */}
      <audio ref={successAudioRef} src="/Assets/cloudastickwebsiteloadmusic.mp3" preload="auto" />

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
            Let's talk about{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Arabic.ai
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto"
          >
            AI-Powered Arabic NLP Solutions for Salesforce
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={scrollToForm}
            onMouseEnter={() => triggerHaptic(20)}
            className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Get Started
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 md:p-12"
          >
            {/* Form Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Share Your Details
              </h2>
              <p className="text-lg text-slate-600">
                We'll get back to you within 24 hours
              </p>
            </div>

            {/* Product Selector */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Products of Interest *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Salesforce', logo: '/Assets/Product Logos/salesforce.png' },
                  { name: 'MuleSoft', logo: '/Assets/Product Logos/mulesoft.png' },
                  { name: 'Tableau', logo: '/Assets/Product Logos/tableau.png' },
                  { name: 'Slack', logo: '/Assets/Product Logos/slack.png' },
                  { name: 'Copado', logo: '/Assets/Product Logos/copado.png' },
                  { name: 'Informatica', logo: '/Assets/Product Logos/informatica.png' },
                  { name: 'Quip', logo: '/Assets/Product Logos/quip.png' },
                ].map((product) => (
                  <motion.button
                    key={product.name}
                    type="button"
                    onClick={() => handleProductToggle(product.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.products.includes(product.name)
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 border-2 border-transparent'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                    }`}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center ${
                      formData.products.includes(product.name) ? 'brightness-0 invert' : ''
                    }`}>
                      <img src={product.logo} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <span className="text-sm">{product.name}</span>
                  </motion.button>
                ))}
              </div>
              {errors.products && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.products}</p>
              )}
            </div>

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
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${
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
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${
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
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${
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
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${
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
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${
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
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors duration-200"
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
                    className={`w-full px-4 py-3 rounded-2xl border-2 ${
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
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors duration-200"
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
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
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
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/Assets/Gitex/Gitex for Tarjama/arabicai.png"
              alt="Arabic.ai"
              className="h-16 object-contain opacity-90"
            />
          </div>
          <p className="text-slate-400 mb-2">
            AI-Powered Arabic NLP Solutions for Salesforce
          </p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Arabic.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TarwtlLeadCapture;

