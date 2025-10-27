
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Calendar } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../contexts/LanguageContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Redirect to email
    const subject = encodeURIComponent(`Contact Form - ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:arezk@cloudastick.com?subject=${subject}&body=${body}`;
    
    toast({
      title: t('contact.success.title'),
      description: t('contact.success.desc'),
    });
    
    setFormData({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.info.email'),
      content: "support@cloudastick.com",
      link: "mailto:support@cloudastick.com",
    },
    {
      icon: Phone,
      title: t('contact.info.phone'),
      content: "+2010-05-298-308",
      link: "tel:+2010-05-298-308",
    },
    {
      icon: MapPin,
      title: t('contact.info.address'),
      content: "ArdelGolf, Nasr City, Cairo",
      link: "#",
    },
    {
      icon: Clock,
      title: t('contact.info.hours'),
      content: "Sun-Thursday 9-5pm (Cairo time)",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('contact.hero.subtitle')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <AnimatedSection direction="left">
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('contact.form.title')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.form.name')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder={t('contact.form.name')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t('contact.form.email')} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder={t('contact.form.email')}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder={t('contact.form.company')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                      placeholder={t('contact.form.message')}
                    />
                  </div>
                  
                  <div className="grid gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full"
                      >
                        {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                        <Send className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => window.open("https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2txdIQjDOXs9sMVSh5H8_yadDlAOlmJY16CCT86fqUQPYCw6SH3gD0dCiUv8TnITIy1iamOQwY", "_blank")}
                        className="w-full"
                      >
                        {t('contact.form.bookMeeting')}
                        <Calendar className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </div>
            </AnimatedSection>

            {/* Contact Info */}
            <AnimatedSection direction="right">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Get in touch
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    We'd love to hear from you. Our team is ready to help you 
                    transform your business with the perfect CRM solution.
                  </p>
                </div>

                <div className="grid gap-6">
                  {contactInfo.map((info, index) => (
                    <AnimatedSection
                      key={info.title}
                      delay={index * 0.1}
                      className="group"
                    >
                      <motion.div
                        whileHover={{ x: 10 }}
                        className="flex items-start space-x-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">
                            {info.title}
                          </h3>
                          <p className="text-gray-400">
                            {info.content}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Quick answers to common questions about our services.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does a typical CRM implementation take?",
                answer: "Implementation time varies based on complexity, but most projects are completed within 6-12 weeks.",
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer 24/7 support and maintenance services to ensure your CRM runs smoothly.",
              },
              {
                question: "Can you migrate data from our existing system?",
                answer: "Absolutely! We have experience migrating data from various CRM systems and databases.",
              },
              {
                question: "What industries do you specialize in?",
                answer: "We work with automotive, real estate, manufacturing, healthcare, and many other industries.",
              },
            ].map((faq, index) => (
              <AnimatedSection
                key={faq.question}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400">
                    {faq.answer}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
