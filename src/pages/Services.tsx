
import { motion } from "framer-motion";
import { Settings, Database, Cloud, Shield, BarChart, Users } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

const Services = () => {
  const services = [
    {
      icon: Settings,
      title: "Salesforce Implementation",
      description: "Complete Salesforce setup and configuration tailored to your business needs.",
      features: ["Custom object creation", "Workflow automation", "User training", "Data migration"],
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Clean, organize, and optimize your customer data for better insights.",
      features: ["Data cleansing", "Duplicate management", "Import/export", "Data quality rules"],
    },
    {
      icon: Cloud,
      title: "Cloud Migration",
      description: "Seamless migration from legacy systems to modern cloud-based CRM.",
      features: ["Legacy system analysis", "Migration planning", "Data transfer", "Testing & validation"],
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Ensure your CRM meets industry standards and security requirements.",
      features: ["Security audit", "Compliance setup", "Permission management", "Monitoring"],
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Custom dashboards and reports to track your business performance.",
      features: ["Custom dashboards", "KPI tracking", "Automated reports", "Data visualization"],
    },
    {
      icon: Users,
      title: "Training & Support",
      description: "Comprehensive training programs and ongoing support for your team.",
      features: ["User training", "Admin certification", "24/7 support", "Best practices"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive CRM solutions designed to transform your business operations.
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
