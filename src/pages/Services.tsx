
import { motion } from "framer-motion";
import { Settings, Database, Cloud, Shield, BarChart, Users } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { useLanguage } from "../contexts/LanguageContext";

const Services = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      icon: Settings,
      title: t('services.implementation.title'),
      description: t('services.implementation.desc'),
      features: t('services.implementation.features'),
    },
    {
      icon: Database,
      title: t('services.data.title'),
      description: t('services.data.desc'),
      features: t('services.data.features'),
    },
    {
      icon: Cloud,
      title: t('services.migration.title'),
      description: t('services.migration.desc'),
      features: t('services.migration.features'),
    },
    {
      icon: Shield,
      title: t('services.security.title'),
      description: t('services.security.desc'),
      features: t('services.security.features'),
    },
    {
      icon: BarChart,
      title: t('services.analytics.title'),
      description: t('services.analytics.desc'),
      features: t('services.analytics.features'),
    },
    {
      icon: Users,
      title: t('services.training.title'),
      description: t('services.training.desc'),
      features: t('services.training.features'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('services.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('services.hero.subtitle')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.title}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 h-full"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A proven methodology that ensures successful CRM implementation.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your business needs and current processes" },
              { step: "02", title: "Planning", description: "Creating a detailed implementation roadmap" },
              { step: "03", title: "Implementation", description: "Building and configuring your CRM solution" },
              { step: "04", title: "Training & Support", description: "Ensuring your team is ready to succeed" },
            ].map((phase, index) => (
              <AnimatedSection
                key={phase.step}
                delay={index * 0.2}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="text-center p-6 rounded-xl bg-gray-800/80 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="text-4xl font-bold text-cyan-400 mb-4">
                    {phase.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {phase.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {phase.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Specialized solutions for various industries and business sectors.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Automotive", description: "Dealership management and customer service solutions" },
              { title: "Real Estate", description: "Property management and client relationship tools" },
              { title: "Manufacturing", description: "Supply chain and customer order management" },
              { title: "Healthcare", description: "Patient management and healthcare CRM systems" },
              { title: "Financial Services", description: "Client portfolio and compliance management" },
              { title: "Technology", description: "Product development and customer success platforms" },
            ].map((industry, index) => (
              <AnimatedSection
                key={industry.title}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-gray-800/80 rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {industry.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {industry.description}
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

export default Services;
