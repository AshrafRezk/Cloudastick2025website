import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { BookOpen, Clock, Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Button from "../components/Button";

const Learn = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Target date: October 13th (assuming current year)
  const targetDate = new Date();
  targetDate.setMonth(9); // October (0-indexed)
  targetDate.setDate(13);
  targetDate.setHours(0, 0, 0, 0);

  // If October 13th has passed this year, set it for next year
  if (targetDate < new Date()) {
    targetDate.setFullYear(targetDate.getFullYear() + 1);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const features = [
    {
      icon: BookOpen,
      title: "Vertical Certifications",
      description: "Specialized certifications in specific industry verticals tailored to your business needs."
    },
    {
      icon: Award,
      title: "Tiered Learning Paths",
      description: "Progressive certification tiers from foundational to expert level expertise."
    },
    {
      icon: Users,
      title: "Customer Exclusive",
      description: "Available exclusively for Cloudastick customers with active support contracts."
    },
    {
      icon: Clock,
      title: "Self-Paced Learning",
      description: "Learn at your own pace with flexible scheduling and comprehensive study materials."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Countdown */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              The Cloudastick Education Portal
            </h1>
            <h2 className="text-2xl md:text-4xl font-light mb-8 text-foreground">
              is under construction
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              We're building something amazing for our valued customers. Get ready for comprehensive 
              vertical certifications and tiered learning paths designed specifically for your business needs.
            </p>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-semibold text-foreground mb-8">
              Launching in:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-brand-primary/30 shadow-lg"
                >
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Expected launch: October 13th, {targetDate.getFullYear()}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Get Notified When Live
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg">
                Learn About Our Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What's Coming to the Education Portal
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A comprehensive learning platform designed exclusively for Cloudastick customers, 
              featuring industry-specific certifications and progressive learning paths.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection
                key={feature.title}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border hover:border-brand-primary/30 transition-all duration-300 h-full"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Exclusive Benefits for Cloudastick Customers
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                As a valued Cloudastick customer, you'll have exclusive access to our comprehensive 
                certification program designed to enhance your team's expertise and validate your 
                Salesforce knowledge.
              </p>
              <ul className="space-y-4">
                {[
                  "Free certifications with active support contracts",
                  "Industry-specific vertical certifications",
                  "Progressive tier system from beginner to expert",
                  "Digital certificates with QR verification",
                  "Retake options with flexible scheduling",
                  "Comprehensive study materials and resources"
                ].map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center text-foreground"
                  >
                    <div className="w-2 h-2 bg-brand-primary rounded-full mr-3 flex-shrink-0"></div>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-brand-primary/30">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Ready to Get Certified?
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Contact us to learn more about our certification program and how it can 
                      benefit your organization.
                    </p>
                    <Link to="/contact">
                      <Button variant="primary" size="lg">
                        Contact Us Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated on Our Progress
            </h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Be the first to know when our Education Portal goes live. 
              Join our mailing list for exclusive updates and early access.
            </p>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Learn;
