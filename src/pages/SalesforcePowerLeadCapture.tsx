import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Users, 
  Building2, 
  Mail, 
  Phone, 
  Briefcase,
  MessageSquare,
  Target,
  TrendingUp,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';
import { industries, getIndustryById } from '../data/industries';

interface FormData {
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
  industry: string;
  current_systems: string[];
  areas_of_interest: string[];
  company_size: string;
  message: string;
  lead_source: string;
}

const SalesforcePowerLeadCapture = () => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    company_name: '',
    email: '',
    phone: '',
    industry: '',
    current_systems: [],
    areas_of_interest: [],
    company_size: '',
    message: '',
    lead_source: 'Salesforce Power Page'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deviceInfo, setDeviceInfo] = useState('');
  const [personalizedQuote, setPersonalizedQuote] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const woosh1Ref = useRef<HTMLAudioElement>(null);
  const woosh2Ref = useRef<HTMLAudioElement>(null);
  const selection1Ref = useRef<HTMLAudioElement>(null);

  // Get industry from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const industryParam = urlParams.get('industry');
    if (industryParam) {
      setFormData(prev => ({ ...prev, industry: industryParam }));
    }
  }, [location.search]);

  // Device info capture
  useEffect(() => {
    const deviceInfo = {
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
               navigator.userAgent.includes('Firefox') ? 'Firefox' : 
               navigator.userAgent.includes('Safari') ? 'Safari' : 'Other',
      os: navigator.userAgent.includes('Windows') ? 'Windows' : 
          navigator.userAgent.includes('Mac') ? 'macOS' : 
          navigator.userAgent.includes('Linux') ? 'Linux' : 'Other',
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || 'Direct',
      lead_source: 'Salesforce Power Page'
    };
    
    setDeviceInfo(JSON.stringify(deviceInfo));
  }, []);

  // Inspirational quotes for different industries
  const quotes = {
    'real-estate': [
      "Transform your property business with Salesforce's comprehensive platform.",
      "From lead to lease, Salesforce streamlines every step of your real estate journey.",
      "Build lasting relationships with tenants and buyers using Salesforce's powerful tools."
    ],
    'healthcare-life-sciences': [
      "Accelerate innovation in healthcare with Salesforce's compliance-focused solutions.",
      "From clinical trials to patient care, Salesforce powers the future of healthcare.",
      "Ensure regulatory compliance while delivering exceptional patient experiences."
    ],
    'manufacturing': [
      "Optimize production and customer relationships with Salesforce's manufacturing solutions.",
      "From supply chain to customer service, Salesforce connects every aspect of your business.",
      "Streamline operations and deliver exceptional customer experiences in manufacturing."
    ],
    'telecommunications': [
      "Revolutionize customer experience in telecom with Salesforce's comprehensive platform.",
      "From network management to customer service, Salesforce powers telecom excellence.",
      "Reduce churn and increase customer satisfaction with Salesforce's telecom solutions."
    ],
    'financial-services': [
      "Secure, compliant, and powerful - Salesforce for financial services excellence.",
      "From wealth management to banking, Salesforce delivers trusted financial solutions.",
      "Build stronger client relationships with Salesforce's financial services platform."
    ],
    'retail-b2c': [
      "Create seamless omnichannel experiences with Salesforce's retail solutions.",
      "From online to in-store, Salesforce unifies your retail customer journey.",
      "Personalize every interaction and boost customer lifetime value."
    ],
    'b2b-commerce': [
      "Streamline complex B2B selling with Salesforce's commerce solutions.",
      "From quotes to contracts, Salesforce simplifies B2B commerce.",
      "Accelerate sales cycles and improve customer satisfaction in B2B."
    ],
    'professional-services': [
      "Optimize project delivery and client relationships with Salesforce.",
      "From resource management to client success, Salesforce powers professional services.",
      "Deliver exceptional client experiences with Salesforce's service solutions."
    ],
    'default': [
      "Transform your business with Salesforce's comprehensive platform.",
      "From sales to service, Salesforce powers every aspect of your business.",
      "Accelerate growth and deliver exceptional customer experiences."
    ]
  };

  // Haptic feedback function
  const triggerHaptic = (pattern: number[] = [10, 5, 10]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  // Play audio
  const playAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
      audioRef.current.play().catch(() => {});
    }
  };

  // Handle form field changes
  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    triggerHaptic([5]);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Show personalized quote after name entry
    if (field === 'first_name' && value && !showQuote) {
      const industryQuotes = quotes[formData.industry as keyof typeof quotes] || quotes.default;
      const randomQuote = industryQuotes[Math.floor(Math.random() * industryQuotes.length)];
      setPersonalizedQuote(randomQuote);
      setShowQuote(true);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field: 'current_systems' | 'areas_of_interest', value: string) => {
    triggerHaptic([5]);
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      triggerHaptic([50]);
      return;
    }

    setIsSubmitting(true);
    triggerHaptic([20, 10, 20]);
    playAudio(woosh1Ref);

    try {
      // Prepare form data for Salesforce
      const salesforceData = new FormData();
      salesforceData.append('oid', '00DQE000000FdFZ');
      salesforceData.append('retURL', window.location.origin + '/salesforce-power-success');
      salesforceData.append('first_name', formData.first_name);
      salesforceData.append('last_name', formData.last_name);
      salesforceData.append('email', formData.email);
      salesforceData.append('phone', formData.phone);
      salesforceData.append('company', formData.company_name);
      salesforceData.append('description', `
Industry: ${formData.industry}
Current Systems: ${formData.current_systems.join(', ')}
Areas of Interest: ${formData.areas_of_interest.join(', ')}
Company Size: ${formData.company_size}
Message: ${formData.message}
Device Info: ${deviceInfo}
      `.trim());
      salesforceData.append('lead_source', formData.lead_source);

      const response = await fetch('https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8', {
        method: 'POST',
        body: salesforceData,
      });

      if (response.ok) {
        playAudio(successAudioRef);
        setIsTransitioning(true);
        
        setTimeout(() => {
          setShowSuccess(true);
          setIsTransitioning(false);
        }, 1000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      triggerHaptic([100]);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIndustryData = formData.industry ? getIndustryById(formData.industry) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>

      {/* Audio Elements */}
      <audio ref={successAudioRef} preload="auto">
        <source src="/Assets/cloudastickwebsiteloadmusic.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={woosh1Ref} preload="auto">
        <source src="/Assets/woosh1new.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={woosh2Ref} preload="auto">
        <source src="/Assets/woosh2new.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={selection1Ref} preload="auto">
        <source src="/Assets/selection1new.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link to="/salesforce-power" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Journey
              </Link>
              
              <div className="flex items-center gap-3">
                <img 
                  src="/Assets/Company Logos/white-logo-dark.webp" 
                  alt="Cloudastick Logo" 
                  className="h-8 w-auto"
                />
                <div className="text-xl font-bold text-white">CLOUDASTICK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {selectedIndustryData 
                    ? `Build Your Salesforce Solution for ${selectedIndustryData.name}`
                    : 'Build Your Salesforce Solution'
                  }
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Let's discuss how Salesforce can transform your business operations
                </p>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>

        {/* Personalized Quote */}
        <AnimatePresence>
          {showQuote && personalizedQuote && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
            >
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-6 text-center">
                <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-3" />
                <p className="text-lg text-white font-medium">{personalizedQuote}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Section */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
            >
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-700/50 border ${
                        errors.first_name ? 'border-red-500' : 'border-gray-600'
                      } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your first name"
                    />
                    {errors.first_name && (
                      <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-700/50 border ${
                        errors.last_name ? 'border-red-500' : 'border-gray-600'
                      } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your last name"
                    />
                    {errors.last_name && (
                      <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-700/50 border ${
                      errors.company_name ? 'border-red-500' : 'border-gray-600'
                    } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your company name"
                  />
                  {errors.company_name && (
                    <p className="text-red-400 text-sm mt-1">{errors.company_name}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-700/50 border ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-700/50 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-600'
                      } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Industry Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Systems */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Current Systems (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Oracle', 'SAP', 'NetSuite', 'Microsoft Dynamics', 'Other'].map((system) => (
                      <label key={system} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.current_systems.includes(system)}
                          onChange={() => handleCheckboxChange('current_systems', system)}
                          className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-300">{system}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Areas of Interest */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Areas of Interest (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Sales', 'Service', 'Marketing', 'Commerce', 'Analytics', 'Integration'].map((area) => (
                      <label key={area} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.areas_of_interest.includes(area)}
                          onChange={() => handleCheckboxChange('areas_of_interest', area)}
                          className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-300">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.company_size}
                    onChange={(e) => handleInputChange('company_size', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your specific needs and challenges..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        Get Your Personalized Solution
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center border border-gray-700"
              >
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
                <p className="text-gray-300 mb-6">
                  Your information has been submitted successfully. Our team will contact you within 24 hours to discuss your Salesforce solution.
                </p>
                <Link to="/salesforce-power-success">
                  <Button variant="primary" size="lg" className="w-full">
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SalesforcePowerLeadCapture;
