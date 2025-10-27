import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Hero Section
    'hero.badge': 'Beyond CRM - Complete Platform',
    'hero.title': 'Discover the Full Power of Salesforce',
    'hero.subtitle': 'Choose your industry to explore how Salesforce transforms businesses beyond traditional CRM',
    'hero.cta': 'Get Started Now',
    'hero.explore': 'Explore Solutions',
    
    // Platform Overview
    'platform.title': 'More Than Just CRM',
    'platform.title.industry': 'More Than Just CRM for {industry}',
    'platform.subtitle': 'Salesforce is a complete platform with specialized clouds for every business need',
    'platform.subtitle.industry': 'Salesforce provides specialized solutions for {industry} with industry-specific clouds and workflows that address your unique challenges.',
    'platform.challenges': 'Key Challenges We Solve for {industry}:',
    
    // ERP Integration
    'erp.title': 'Seamlessly Connects to Your Existing Systems',
    'erp.title.industry': 'Seamlessly Connects to Your {industry} Systems',
    'erp.subtitle': 'Salesforce integrates with all major ERP systems for unified business operations',
    'erp.subtitle.industry': 'Salesforce integrates with major ERP systems used in {industry} to unify your data and streamline {industry} workflows',
    'erp.integrations': 'Common {industry} Integrations:',
    
    // Data Cloud
    'data.title': 'Data Cloud: Connect Everything',
    'data.title.industry': 'Data Cloud: Connect Your {industry} Data',
    'data.subtitle': 'One unified view of your customer, regardless of where data lives',
    'data.subtitle.industry': 'One unified view of your {industry} customers and operations, regardless of where data lives across your systems',
    'data.sources': '{industry} Data Sources We Connect:',
    
    // Industry Solutions
    'industry.title': 'Tailored Solutions for {industry}',
    'industry.products': 'Industry Products',
    'industry.metrics': 'Success Metrics',
    'industry.useCases': 'Use Cases',
    
    // Competitive Analysis
    'comparison.title': 'Salesforce vs The Competition',
    'comparison.subtitle': 'See how Salesforce outperforms other CRM and business platforms',
    'comparison.metric': 'Metric',
    'comparison.salesforce': 'Salesforce',
    'comparison.hubspot': 'HubSpot',
    'comparison.zoho': 'Zoho',
    'comparison.freshworks': 'Freshworks',
    'comparison.odoo': 'Odoo',
    'comparison.roi': 'ROI Potential',
    'comparison.differentiators': 'Why Salesforce Delivers Superior ROI',
    'comparison.completePlatform': 'Complete Platform',
    'comparison.completePlatform.desc': 'Not just CRM - Sales, Service, Marketing, Commerce, Analytics all integrated',
    'comparison.einstein': 'Einstein AI',
    'comparison.einstein.desc': 'Built-in AI for predictions, recommendations, and automation',
    'comparison.appexchange': 'AppExchange',
    'comparison.appexchange.desc': '5000+ apps and integrations in the ecosystem',
    'comparison.scalability': 'Enterprise Scale',
    'comparison.scalability.desc': 'From startup to Fortune 500, scales with your business',
    'comparison.averageROI': '251% Average ROI',
    'comparison.roiDescription': 'Salesforce customers see an average ROI of 251% within 3 years - significantly higher than competitors',
    
    // Table
    'table.title': 'Salesforce vs Competitors Comparison',
    'table.title.industry': 'Salesforce vs Competitors - {industry} Industry',
    'table.selectIndustry': 'Select Your Industry',
    'table.selectIndustry.desc': 'Choose your industry to see a personalized comparison of Salesforce vs competitors',
    'table.share': 'Share This Comparison',
    'table.copy': 'Copy Link',
    'table.download': 'Download PDF',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.apps': 'Apps',
    'nav.salesforcePlatform': 'Salesforce Platform',
    'nav.clients': 'Clients',
    'nav.learn': 'Learn',
    'nav.feedback': 'Feedback',
    'nav.contact': 'Contact',
    
    // Home Page
    'home.hero.title': 'Transform Your Business with Salesforce',
    'home.hero.subtitle': 'Leading Salesforce implementation partner across the Middle East and Africa',
    'home.hero.cta': 'Get Started',
    'home.hero.explore': 'Explore Our Solutions',
    'home.services.title': 'Our Services',
    'home.services.subtitle': 'Comprehensive Salesforce solutions tailored to your industry',
    'home.team.title': 'Meet Our Team',
    'home.team.subtitle': 'Expert Salesforce consultants dedicated to your success',
    'home.stats.clients': 'Happy Clients',
    'home.stats.projects': 'Projects Completed',
    'home.stats.experience': 'Years Experience',
    'home.stats.certifications': 'Certifications',
    'home.features.analytics.title': 'Advanced Analytics',
    'home.features.analytics.desc': 'Get deep insights into your business performance with our comprehensive analytics dashboard.',
    'home.features.customer.title': 'Customer Management',
    'home.features.customer.desc': 'Manage your customer relationships with powerful tools designed for modern businesses.',
    'home.features.automation.title': 'Automation',
    'home.features.automation.desc': 'Automate your workflows and save time with our intelligent automation features.',
    'home.why.title': 'Why Cloudastick?',
    'home.why.desc': 'We\'ve been a registered Salesforce.com partner since 2016, specializing in Salesforce cloud solutions and custom web development.',
    'home.insights.title': 'Latest Insights',
    'home.insights.desc': 'Stay updated with the latest trends and insights in CRM and business automation.',
    'home.cta.title': 'Ready to Transform Your Business?',
    'home.cta.desc': 'Let\'s discuss how we can tailor our CRM solutions to your specific needs.',
    'home.cta.button': 'Get Started Today',
    'home.cta.meetTeam': 'Meet the Full Team',
    
    // About Page
    'about.hero.title': 'About Cloudastick',
    'about.hero.subtitle': 'Your trusted Salesforce partner in the Middle East and Africa',
    'about.story.title': 'Our Story',
    'about.story.content': 'Founded with a vision to democratize enterprise technology, Cloudastick has grown into a leading Salesforce implementation partner across the Middle East and Africa.',
    'about.story.experience': 'With decades of combined experience in Salesforce consulting and business transformation, we\'ve helped hundreds of companies optimize their customer relationships and drive growth.',
    'about.stats.projects': 'Successful Projects',
    'about.stats.satisfaction': 'Client Satisfaction',
    'about.stats.support': 'Support',
    'about.differentiators.title': 'What Sets Us Apart',
    'about.differentiators.industry': 'Industry-Smart CRM Design',
    'about.differentiators.boutique': 'Boutique Attention',
    'about.differentiators.expertise': 'Salesforce Expertise',
    'about.differentiators.services': 'End-to-End Services',
    'about.team.title': 'Leadership Team',
    'about.team.subtitle': 'Meet the experts behind Cloudastick\'s success.',
    'about.mission.title': 'Our Mission',
    'about.mission.content': 'To empower businesses with cutting-edge Salesforce solutions that drive growth, efficiency, and customer success.',
    'about.values.title': 'Our Values',
    'about.values.subtitle': 'The principles that guide everything we do at Cloudastick.',
    'about.values.excellence': 'Excellence',
    'about.values.excellence.desc': 'Delivering the highest quality solutions and service',
    'about.values.innovation': 'Innovation',
    'about.values.innovation.desc': 'Staying ahead with the latest Salesforce technologies',
    'about.values.partnership': 'Partnership',
    'about.values.partnership.desc': 'Building lasting relationships with our clients',
    'about.values.integrity': 'Integrity',
    'about.values.integrity.desc': 'Transparent, honest, and ethical business practices',
    'about.values.reverence': 'Reverence',
    'about.values.reverence.desc': 'We begin with respect. We respect the craft of technology and consulting, striving for excellence in every detail. We respect each other\'s views, knowing that diverse perspectives strengthen our solutions. We respect everyone in the Salesforce ecosystem including healthy competition because it drives us all forward. Most importantly, we deeply respect our customers, treating their trust as our greatest responsibility.',
    'about.values.efficiency': 'Efficiency',
    'about.values.efficiency.desc': 'We believe in doing things right and doing them smart. Efficiency means removing waste, optimizing processes, and ensuring our clients see measurable value from every engagement.',
    'about.values.inclusion': 'Inclusion',
    'about.values.inclusion.desc': 'We practice strategic inclusivity, every member, partner, and client is part of the same Cloudastick boat, moving forward together. We welcome and celebrate diverse operational ideas, skills, and viewpoints not only as a matter of fairness, but as a deliberate strategy to fuel creativity, strengthen collaboration, and ensure collective success.',
    'about.values.transparency': 'Transparency',
    'about.values.transparency.desc': 'We commit to clarity at every level. Internally, we practice open communication about all matters to ensure alignment and trust. Externally, we engage in proactive communication with our customers, keeping everyone in the know, anticipating questions, and ensuring there are no surprises.',
    'about.values.consistency': 'Consistency',
    'about.values.consistency.desc': 'We maintain and commit to what we do. At Cloudastick, we don\'t just start initiatives, we see them through to completion. Our consistency is about perseverance, reliability, and honoring our commitments, ensuring that what we promise is what we deliver, every time.',
    
    // Services Page
    'services.hero.title': 'Our Services',
    'services.hero.subtitle': 'Comprehensive CRM solutions designed to transform your business operations',
    'services.implementation.title': 'Salesforce Implementation',
    'services.implementation.desc': 'Complete Salesforce setup and configuration tailored to your business needs.',
    'services.implementation.features': ['Custom object creation', 'Workflow automation', 'User training', 'Data migration'],
    'services.data.title': 'Data Management',
    'services.data.desc': 'Clean, organize, and optimize your customer data for better insights.',
    'services.data.features': ['Data cleansing', 'Duplicate management', 'Import/export', 'Data quality rules'],
    'services.migration.title': 'Cloud Migration',
    'services.migration.desc': 'Seamless migration from legacy systems to modern cloud-based CRM.',
    'services.migration.features': ['Legacy system analysis', 'Migration planning', 'Data transfer', 'Testing & validation'],
    'services.security.title': 'Security & Compliance',
    'services.security.desc': 'Ensure your CRM meets industry standards and security requirements.',
    'services.security.features': ['Security audit', 'Compliance setup', 'Permission management', 'Monitoring'],
    'services.analytics.title': 'Analytics & Reporting',
    'services.analytics.desc': 'Custom dashboards and reports to track your business performance.',
    'services.analytics.features': ['Custom dashboards', 'KPI tracking', 'Automated reports', 'Data visualization'],
    'services.training.title': 'Training & Support',
    'services.training.desc': 'Comprehensive training programs and ongoing support for your team.',
    'services.training.features': ['User training', 'Admin certification', '24/7 support', 'Best practices'],
    
    // Clients Page
    'clients.hero.title': 'Our Clients',
    'clients.hero.subtitle': 'Trusted by leading companies across various industries',
    'clients.sections.realEstate': 'Real-estate Customers',
    'clients.sections.healthcare': 'Healthcare Customers',
    'clients.sections.manufacturing': 'Manufacturing Customers',
    'clients.sections.retail': 'Retail Customers',
    'clients.sections.logistics': 'Logistics Customers',
    'clients.sections.analytics': 'Analytics Customers',
    'clients.controls.play': 'Play',
    'clients.controls.pause': 'Pause',
    'clients.controls.next': 'Next',
    'clients.controls.previous': 'Previous',
    
    // Learn Page
    'learn.hero.title': 'The Cloudastick Education Portal',
    'learn.hero.subtitle': 'is under maintenance for 2026 updates',
    'learn.hero.description': 'We\'re building something amazing for our valued customers. Get ready for comprehensive vertical certifications and tiered learning paths designed specifically for your business needs.',
    'learn.launching.title': 'Launching in:',
    'learn.launching.note': 'This countdown is for demonstration purposes. The actual launch date will be announced soon.',
    'learn.countdown.title': 'Next Program Starts In',
    'learn.countdown.days': 'Days',
    'learn.countdown.hours': 'Hours',
    'learn.countdown.minutes': 'Minutes',
    'learn.countdown.seconds': 'Seconds',
    'learn.features.vertical.title': 'Vertical Certifications',
    'learn.features.vertical.desc': 'Specialized certifications in specific industry verticals tailored to your business needs.',
    'learn.features.tiered.title': 'Tiered Learning Paths',
    'learn.features.tiered.desc': 'Progressive certification tiers from foundational to expert level expertise.',
    'learn.features.exclusive.title': 'Customer Exclusive',
    'learn.features.exclusive.desc': 'Available exclusively for Cloudastick customers with active support contracts.',
    'learn.features.paced.title': 'Self-Paced Learning',
    'learn.features.paced.desc': 'Learn at your own pace with flexible scheduling and comprehensive study materials.',
    'learn.cta.register': 'Get Notified When Live',
    'learn.cta.learnMore': 'Learn About Our Services',
    'learn.success.title': 'Our Certified Success Stories',
    'learn.success.subtitle': 'See how our customers have successfully achieved their Salesforce certifications and transformed their businesses with our comprehensive training programs.',
    
    // Contact Page
    'contact.hero.title': 'Contact Us',
    'contact.hero.subtitle': 'Ready to transform your business? Get in touch with our experts',
    'contact.form.title': 'Send us a message',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.company': 'Company',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.submitting': 'Sending...',
    'contact.form.bookMeeting': 'Book a Meeting',
    'contact.info.email': 'Email',
    'contact.info.phone': 'Phone',
    'contact.info.address': 'Address',
    'contact.info.hours': 'Hours',
    'contact.success.title': 'Message Sent!',
    'contact.success.desc': 'Thank you for your message. We\'ll get back to you soon.',
    
    // Feedback Page
    'feedback.hero.title': 'Client Testimonials',
    'feedback.hero.subtitle': 'Hear what our clients say about working with Cloudastick',
    'feedback.controls.play': 'Play',
    'feedback.controls.pause': 'Pause',
    'feedback.controls.next': 'Next',
    'feedback.controls.previous': 'Previous',
    'feedback.rating.excellent': 'Excellent',
    'feedback.rating.good': 'Good',
    'feedback.rating.average': 'Average',
    'feedback.rating.poor': 'Poor',
    
    // Salesforce Apps Page
    'apps.hero.title': 'Salesforce Apps',
    'apps.hero.subtitle': 'Custom-built applications designed to extend your Salesforce capabilities',
    'apps.calendar.title': 'Advanced Sleek Calendar',
    'apps.calendar.tagline': 'Google Calendar meets Salesforce',
    'apps.calendar.desc': 'A powerful, modern calendar solution that brings the familiar Google Calendar experience directly into your Salesforce environment.',
    'apps.omnichannel.title': 'Omnichannel Communication Hub',
    'apps.omnichannel.tagline': 'Unified customer communication platform',
    'apps.omnichannel.desc': 'Seamlessly integrate all customer touchpoints into a single, intelligent communication hub within Salesforce.',
    'apps.features.responsive': 'Responsive Calendar Interface',
    'apps.features.responsive.desc': 'Beautiful, intuitive calendar design that works seamlessly across all devices',
    'apps.features.universal': 'Universal Object Support',
    'apps.features.universal.desc': 'Log activities on any Salesforce object - Leads, Contacts, Accounts, Opportunities, and custom objects',
    'apps.features.smart': 'Smart Follow-up Scheduling',
    'apps.features.smart.desc': 'Easily schedule follow-up activities with drag-and-drop functionality',
    'apps.features.customizable': 'Customizable Visual Design',
    'apps.features.customizable.desc': 'Personalize your calendar view with color-coding and visual representations for maximum productivity',
    'apps.features.filtering': 'Advanced Filtering',
    'apps.features.filtering.desc': 'Filter by activity type, customer type, assigned user, status, and more',
    'apps.features.timeline': 'Timeline View',
    'apps.features.timeline.desc': 'Advanced timeline visualization to see your activities across time and teams',
    'apps.features.fieldService': 'Field Service Management',
    'apps.features.fieldService.desc': 'Perfect for field service teams - schedule service appointments, track technician locations, and manage on-site activities',
    'apps.features.route': 'Route Optimization',
    'apps.features.route.desc': 'Intelligent route planning for sales reps and field workers to maximize daily visits and minimize travel time',
    'apps.features.territory': 'Territory Management',
    'apps.features.territory.desc': 'Visualize and manage field activities by territory, ensuring optimal coverage and balanced workload',
    'apps.features.realtime': 'Real-time Schedule Updates',
    'apps.features.realtime.desc': 'Mobile-friendly calendar that syncs in real-time, perfect for field reps managing appointments on the go',
    'apps.features.checkin': 'Check-in/Check-out Tracking',
    'apps.features.checkin.desc': 'Track field visits with geolocation-enabled check-ins, automatic activity logging, and visit duration tracking',
    'apps.features.analytics': 'Field Activity Analytics',
    'apps.features.analytics.desc': 'Monitor field team productivity, track service completion rates, and analyze visit patterns for continuous improvement',
    'apps.cta.tryDemo': 'Try Demo',
    'apps.cta.learnMore': 'Learn More',
    'apps.cta.getStarted': 'Get Started',
    'apps.cta.contactSales': 'Contact Sales',
    'apps.modal.close': 'Close',
    'apps.modal.play': 'Play',
    'apps.modal.pause': 'Pause',
    'apps.modal.fullscreen': 'Fullscreen',
    'apps.modal.download': 'Download',
    'apps.modal.share': 'Share',
    
    // Salesforce Power Page
    'power.hero.badge': 'Beyond CRM - Complete Platform',
    'power.hero.title': 'Discover the Full Power of Salesforce',
    'power.hero.subtitle': 'Choose your industry to explore how Salesforce transforms businesses beyond traditional CRM',
    'power.hero.cta': 'Get Started Now',
    'power.hero.explore': 'Explore Solutions',
    'power.hero.selectIndustry': 'Select Your Industry',
    'power.hero.selectIndustry.desc': 'Choose your industry to see how Salesforce can transform your business',
    
    // Platform Overview
    'power.platform.title': 'More Than Just CRM',
    'power.platform.title.industry': 'More Than Just CRM for {industry}',
    'power.platform.subtitle': 'Salesforce is a complete platform with specialized clouds for every business need',
    'power.platform.subtitle.industry': 'Salesforce provides specialized solutions for {industry} with industry-specific clouds and workflows that address your unique challenges.',
    'power.platform.challenges': 'Key Challenges We Solve for {industry}:',
    'power.platform.explore': 'Explore Platform',
    'power.platform.learnMore': 'Learn More',
    
    // ERP Integration
    'power.erp.title': 'Seamlessly Connects to Your Existing Systems',
    'power.erp.title.industry': 'Seamlessly Connects to Your {industry} Systems',
    'power.erp.subtitle': 'Salesforce integrates with all major ERP systems for unified business operations',
    'power.erp.subtitle.industry': 'Salesforce integrates with major ERP systems used in {industry} to unify your data and streamline {industry} workflows',
    'power.erp.integrations': 'Common {industry} Integrations:',
    'power.erp.viewAll': 'View All Integrations',
    
    // Data Cloud
    'power.data.title': 'Data Cloud: Connect Everything',
    'power.data.title.industry': 'Data Cloud: Connect Your {industry} Data',
    'power.data.subtitle': 'One unified view of your customer, regardless of where data lives',
    'power.data.subtitle.industry': 'One unified view of your {industry} customers and operations, regardless of where data lives across your systems',
    'power.data.sources': '{industry} Data Sources We Connect:',
    'power.data.explore': 'Explore Data Cloud',
    
    // Industry Solutions
    'power.industry.title': 'Tailored Solutions for {industry}',
    'power.industry.products': 'Industry Products',
    'power.industry.metrics': 'Success Metrics',
    'power.industry.useCases': 'Use Cases',
    'power.industry.seeComparison': 'See Full Comparison',
    'power.industry.customize': 'Customize for Your Industry',
    
    // Competitive Analysis
    'power.comparison.title': 'Why Salesforce Leads the Market',
    'power.comparison.title.industry': 'Why Salesforce Leads {industry}',
    'power.comparison.subtitle': 'Comprehensive comparison with other CRM platforms',
    'power.comparison.subtitle.industry': 'See how Salesforce outperforms competitors in {industry}',
    'power.comparison.viewTable': 'View Comparison Table',
    'power.comparison.shareTable': 'Share This Table',
    'power.comparison.downloadTable': 'Download Table',
    
    // Table/Comparison
    'power.table.title': 'Salesforce vs Competitors',
    'power.table.title.industry': 'Salesforce vs Competitors in {industry}',
    'power.table.selectIndustry': 'Select Industry for Comparison',
    'power.table.selectIndustry.desc': 'Choose your industry to see a customized comparison table',
    'power.table.share': 'Share Table',
    'power.table.download': 'Download PDF',
    'power.table.copy': 'Copy Link',
    'power.table.copied': 'Link Copied!',
    'power.table.shareTitle': 'Share Comparison Table',
    'power.table.shareDesc': 'Share this industry-specific comparison with your team',
    
    // Comparison Metrics
    'power.comparison.metric': 'Overall Performance',
    'power.comparison.roi': 'Average ROI',
    'power.comparison.differentiators': 'Key Differentiators',
    'power.comparison.completePlatform': 'Complete Platform',
    'power.comparison.completePlatform.desc': '20+ specialized clouds in one integrated platform',
    'power.comparison.einstein': 'Einstein AI',
    'power.comparison.einstein.desc': 'Built-in artificial intelligence for predictive insights',
    'power.comparison.appexchange': 'AppExchange',
    'power.comparison.appexchange.desc': 'Largest marketplace of business applications',
    'power.comparison.scalability': 'Enterprise Scalability',
    'power.comparison.scalability.desc': 'Scales from startup to Fortune 500',
    'power.comparison.averageROI': 'Average ROI Comparison',
    'power.comparison.roiDescription': 'Based on industry studies and customer surveys',
    
    // CTA Section
    'power.cta.title': 'Ready to Transform Your Business?',
    'power.cta.title.industry': 'Ready to Transform Your {industry} Business?',
    'power.cta.subtitle': 'Let\'s discuss how Salesforce can revolutionize your operations',
    'power.cta.subtitle.industry': 'Let\'s discuss how Salesforce can revolutionize your {industry} operations',
    'power.cta.contact': 'Contact Us',
    'power.cta.schedule': 'Schedule Demo',
    'power.cta.learnMore': 'Learn More',
    
    // Navigation
    'power.nav.overview': 'Platform Overview',
    'power.nav.erp': 'ERP Integration',
    'power.nav.data': 'Data Cloud',
    'power.nav.industry': 'Industry Solutions',
    'power.nav.comparison': 'Comparison',
    'power.nav.cta': 'Get Started',
    
    // Industry-specific content
    'power.industry.realEstate.challenges': [
      'Lead management across multiple properties',
      'Client relationship tracking',
      'Property portfolio optimization',
      'Commission tracking and reporting'
    ],
    'power.industry.healthcare.challenges': [
      'Patient data management',
      'HIPAA compliance',
      'Care coordination',
      'Revenue cycle management'
    ],
    'power.industry.manufacturing.challenges': [
      'Supply chain visibility',
      'Quality control tracking',
      'Equipment maintenance',
      'Production planning'
    ],
    'power.industry.retail.challenges': [
      'Customer journey mapping',
      'Inventory management',
      'Omnichannel experience',
      'Sales performance tracking'
    ],
    
    // Team Roles
    'team.founder': 'Founder of Cloudastick Systems',
    'team.marketingConsultant': 'Marketing Cloud Consultant',
    'team.customerSuccess': 'Customer Success Manager',
    'team.brandSpecialist': 'Brand and People Experience Specialist',
    'team.salesforceConsultant': 'Salesforce Consultant',
    'team.headOfTech': 'Head of Tech',
    'team.hoverElements.vision': 'Vision',
    'team.hoverElements.leadership': 'Leadership',
    'team.hoverElements.campaigns': 'Campaigns',
    'team.hoverElements.analytics': 'Analytics',
    'team.hoverElements.support': 'Support',
    'team.hoverElements.success': 'Success',
    'team.hoverElements.brand': 'Brand',
    'team.hoverElements.culture': 'Culture',
    'team.hoverElements.development': 'Development',
    'team.hoverElements.configuration': 'Configuration',
    'team.hoverElements.integration': 'Integration',
    'team.hoverElements.data': 'Data',
    'team.hoverElements.security': 'Security',
    'team.hoverElements.architecture': 'Architecture',
    'team.hoverElements.strategy': 'Strategy',
    'team.hoverElements.growth': 'Growth',
    'team.hoverElements.excellence': 'Excellence',
    'team.hoverElements.delivery': 'Delivery',
    'team.hoverElements.collaboration': 'Collaboration',
    'team.hoverElements.innovation': 'Innovation',
    'team.hoverElements.customization': 'Customization',
    'team.hoverElements.dataManagement': 'Data Management',
    'team.hoverElements.emailMarketing': 'Email Marketing',
    'team.hoverElements.projectDelivery': 'Project Delivery',
    'team.hoverElements.timeline': 'Timeline',
    'team.technicalArchitect': 'Technical Architect',
    'team.projectManager': 'Project Manager',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.getStarted': 'Get Started',
    'common.learnMore': 'Learn More',
    'common.contactUs': 'Contact Us',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
  },
  ar: {
    // Hero Section
    'hero.badge': 'أكثر من مجرد CRM - منصة شاملة',
    'hero.title': 'اكتشف القوة الكاملة لـ Salesforce',
    'hero.subtitle': 'اختر صناعتك لاستكشاف كيف يحول Salesforce الشركات إلى ما هو أبعد من CRM التقليدي',
    'hero.cta': 'ابدأ الآن',
    'hero.explore': 'استكشف الحلول',
    
    // Platform Overview
    'platform.title': 'أكثر من مجرد CRM',
    'platform.title.industry': 'أكثر من مجرد CRM لـ {industry}',
    'platform.subtitle': 'Salesforce هو منصة شاملة مع سحابات متخصصة لكل احتياجات الأعمال',
    'platform.subtitle.industry': 'يوفر Salesforce حلولاً متخصصة لـ {industry} مع سحابات مخصصة للصناعة وسير عمل تعالج تحدياتك الفريدة.',
    'platform.challenges': 'التحديات الرئيسية التي نحلها لـ {industry}:',
    
    // ERP Integration
    'erp.title': 'يتصل بسلاسة مع أنظمتك الموجودة',
    'erp.title.industry': 'يتصل بسلاسة مع أنظمة {industry}',
    'erp.subtitle': 'يتكامل Salesforce مع جميع أنظمة ERP الرئيسية للعمليات التجارية الموحدة',
    'erp.subtitle.industry': 'يتكامل Salesforce مع أنظمة ERP الرئيسية المستخدمة في {industry} لتوحيد بياناتك وتبسيط سير عمل {industry}',
    'erp.integrations': 'تكاملات {industry} الشائعة:',
    
    // Data Cloud
    'data.title': 'Data Cloud: ربط كل شيء',
    'data.title.industry': 'Data Cloud: ربط بيانات {industry}',
    'data.subtitle': 'نظرة موحدة لعملائك، بغض النظر عن مكان وجود البيانات',
    'data.subtitle.industry': 'نظرة موحدة لعملاء {industry} وعملياتك، بغض النظر عن مكان وجود البيانات عبر أنظمتك',
    'data.sources': 'مصادر بيانات {industry} التي نربطها:',
    
    // Industry Solutions
    'industry.title': 'حلول مخصصة لـ {industry}',
    'industry.products': 'منتجات الصناعة',
    'industry.metrics': 'مقاييس النجاح',
    'industry.useCases': 'حالات الاستخدام',
    
    // Competitive Analysis
    'comparison.title': 'Salesforce مقابل المنافسين',
    'comparison.subtitle': 'شاهد كيف يتفوق Salesforce على منصات CRM والأعمال الأخرى',
    'comparison.metric': 'المقياس',
    'comparison.salesforce': 'Salesforce',
    'comparison.hubspot': 'HubSpot',
    'comparison.zoho': 'Zoho',
    'comparison.freshworks': 'Freshworks',
    'comparison.odoo': 'Odoo',
    'comparison.roi': 'إمكانات العائد على الاستثمار',
    'comparison.differentiators': 'لماذا يوفر Salesforce عائد استثمار متفوق',
    'comparison.completePlatform': 'منصة شاملة',
    'comparison.completePlatform.desc': 'ليس فقط CRM - المبيعات، الخدمة، التسويق، التجارة، التحليلات كلها متكاملة',
    'comparison.einstein': 'Einstein AI',
    'comparison.einstein.desc': 'ذكاء اصطناعي مدمج للتنبؤات والتوصيات والأتمتة',
    'comparison.appexchange': 'AppExchange',
    'comparison.appexchange.desc': '5000+ تطبيق وتكامل في النظام البيئي',
    'comparison.scalability': 'مقياس المؤسسة',
    'comparison.scalability.desc': 'من الشركات الناشئة إلى Fortune 500، يتوسع مع عملك',
    'comparison.averageROI': '251% متوسط العائد على الاستثمار',
    'comparison.roiDescription': 'عملاء Salesforce يحصلون على متوسط عائد استثمار 251% خلال 3 سنوات - أعلى بكثير من المنافسين',
    
    // Table
    'table.title': 'مقارنة Salesforce مقابل المنافسين',
    'table.title.industry': 'Salesforce مقابل المنافسين - صناعة {industry}',
    'table.selectIndustry': 'اختر صناعتك',
    'table.selectIndustry.desc': 'اختر صناعتك لرؤية مقارنة شخصية لـ Salesforce مقابل المنافسين',
    'table.share': 'شارك هذه المقارنة',
    'table.copy': 'نسخ الرابط',
    'table.download': 'تحميل PDF',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'الخدمات',
    'nav.apps': 'التطبيقات',
    'nav.salesforcePlatform': 'منصة Salesforce',
    'nav.clients': 'العملاء',
    'nav.learn': 'التعلم',
    'nav.feedback': 'التقييمات',
    'nav.contact': 'اتصل بنا',
    
    // Home Page
    'home.hero.title': 'حوّل عملك مع Salesforce',
    'home.hero.subtitle': 'شريك Salesforce الرائد في التنفيذ عبر الشرق الأوسط وأفريقيا',
    'home.hero.cta': 'ابدأ الآن',
    'home.hero.explore': 'استكشف حلولنا',
    'home.services.title': 'خدماتنا',
    'home.services.subtitle': 'حلول Salesforce شاملة مصممة لصناعتك',
    'home.team.title': 'تعرف على فريقنا',
    'home.team.subtitle': 'استشاريو Salesforce خبراء مكرسون لنجاحك',
    'home.stats.clients': 'عميل سعيد',
    'home.stats.projects': 'مشروع مكتمل',
    'home.stats.experience': 'سنة خبرة',
    'home.stats.certifications': 'شهادة',
    'home.features.analytics.title': 'تحليلات متقدمة',
    'home.features.analytics.desc': 'احصل على رؤى عميقة حول أداء عملك مع لوحة التحكم التحليلية الشاملة.',
    'home.features.customer.title': 'إدارة العملاء',
    'home.features.customer.desc': 'إدارة علاقات عملائك بأدوات قوية مصممة للشركات الحديثة.',
    'home.features.automation.title': 'الأتمتة',
    'home.features.automation.desc': 'أتمت سير العمل الخاص بك ووفر الوقت مع ميزات الأتمتة الذكية.',
    'home.why.title': 'لماذا Cloudastick؟',
    'home.why.desc': 'نحن شريك مسجل في Salesforce.com منذ 2016، متخصصون في حلول Salesforce السحابية وتطوير الويب المخصص.',
    'home.insights.title': 'أحدث الرؤى',
    'home.insights.desc': 'ابق محدثاً بأحدث الاتجاهات والرؤى في CRM وأتمتة الأعمال.',
    'home.cta.title': 'مستعد لتحويل عملك؟',
    'home.cta.desc': 'دعنا نناقش كيف يمكننا تخصيص حلول CRM لاحتياجاتك المحددة.',
    'home.cta.button': 'ابدأ اليوم',
    'home.cta.meetTeam': 'تعرف على الفريق الكامل',
    
    // About Page
    'about.hero.title': 'حول Cloudastick',
    'about.hero.subtitle': 'شريك Salesforce الموثوق في الشرق الأوسط وأفريقيا',
    'about.story.title': 'قصتنا',
    'about.story.content': 'تأسست برؤية لدمقرطة التكنولوجيا المؤسسية، نمت Cloudastick لتصبح شريك Salesforce رائد في التنفيذ عبر الشرق الأوسط وأفريقيا.',
    'about.story.experience': 'مع عقود من الخبرة المشتركة في استشارات Salesforce وتحويل الأعمال، ساعدنا مئات الشركات في تحسين علاقات عملائها وتحفيز النمو.',
    'about.stats.projects': 'مشاريع ناجحة',
    'about.stats.satisfaction': 'رضا العملاء',
    'about.stats.support': 'الدعم',
    'about.differentiators.title': 'ما يميزنا',
    'about.differentiators.industry': 'تصميم CRM ذكي للصناعة',
    'about.differentiators.boutique': 'اهتمام بوتيكي',
    'about.differentiators.expertise': 'خبرة Salesforce',
    'about.differentiators.services': 'خدمات شاملة',
    'about.team.title': 'فريق القيادة',
    'about.team.subtitle': 'تعرف على الخبراء وراء نجاح Cloudastick.',
    'about.mission.title': 'مهمتنا',
    'about.mission.content': 'تمكين الشركات بحلول Salesforce المتطورة التي تحفز النمو والكفاءة ونجاح العملاء.',
    'about.values.title': 'قيمنا',
    'about.values.subtitle': 'المبادئ التي توجه كل ما نفعله في Cloudastick.',
    'about.values.excellence': 'التميز',
    'about.values.excellence.desc': 'تقديم أعلى جودة من الحلول والخدمات',
    'about.values.innovation': 'الابتكار',
    'about.values.innovation.desc': 'البقاء في المقدمة بأحدث تقنيات Salesforce',
    'about.values.partnership': 'الشراكة',
    'about.values.partnership.desc': 'بناء علاقات دائمة مع عملائنا',
    'about.values.integrity': 'النزاهة',
    'about.values.integrity.desc': 'ممارسات تجارية شفافة وصادقة وأخلاقية',
    'about.values.reverence': 'الاحترام',
    'about.values.reverence.desc': 'نبدأ بالاحترام. نحترم حرفة التكنولوجيا والاستشارات، نسعى للتميز في كل التفاصيل. نحترم آراء بعضنا البعض، مع العلم أن وجهات النظر المتنوعة تقوي حلولنا. نحترم الجميع في نظام Salesforce البيئي بما في ذلك المنافسة الصحية لأنها تدفعنا جميعاً إلى الأمام. الأهم من ذلك، نحترم عملاءنا بعمق، ونعامل ثقتهم كأكبر مسؤولية لدينا.',
    'about.values.efficiency': 'الكفاءة',
    'about.values.efficiency.desc': 'نؤمن بفعل الأشياء بشكل صحيح وذكي. الكفاءة تعني إزالة الهدر، وتحسين العمليات، وضمان أن عملاءنا يرون قيمة قابلة للقياس من كل مشاركة.',
    'about.values.inclusion': 'الشمولية',
    'about.values.inclusion.desc': 'نمارس الشمولية الاستراتيجية، كل عضو وشريك وعميل هو جزء من نفس قارب Cloudastick، نتقدم معاً. نرحب ونحتفل بالأفكار والمهارات ووجهات النظر التشغيلية المتنوعة ليس فقط كمسألة عدالة، ولكن كاستراتيجية متعمدة لإثارة الإبداع، وتقوية التعاون، وضمان النجاح الجماعي.',
    'about.values.transparency': 'الشفافية',
    'about.values.transparency.desc': 'نلتزم بالوضوح على كل المستويات. داخلياً، نمارس التواصل المفتوح حول جميع الأمور لضمان التنسيق والثقة. خارجياً، نشارك في التواصل الاستباقي مع عملائنا، ونبقي الجميع على علم، ونستبق الأسئلة، ونتأكد من عدم وجود مفاجآت.',
    'about.values.consistency': 'الاتساق',
    'about.values.consistency.desc': 'نحافظ ونلتزم بما نفعله. في Cloudastick، لا نبدأ المبادرات فقط، بل نراها حتى النهاية. اتساقنا يتعلق بالمثابرة والموثوقية وتكريم التزاماتنا، وضمان أن ما نعد به هو ما نقدمه، في كل مرة.',
    
    // Services Page
    'services.hero.title': 'خدماتنا',
    'services.hero.subtitle': 'حلول CRM شاملة مصممة لتحويل عمليات عملك',
    'services.implementation.title': 'تنفيذ Salesforce',
    'services.implementation.desc': 'إعداد وتكوين Salesforce كامل مصمم خصيصاً لاحتياجات عملك.',
    'services.implementation.features': ['إنشاء كائنات مخصصة', 'أتمتة سير العمل', 'تدريب المستخدمين', 'هجرة البيانات'],
    'services.data.title': 'إدارة البيانات',
    'services.data.desc': 'تنظيف وتنظيم وتحسين بيانات عملائك للحصول على رؤى أفضل.',
    'services.data.features': ['تنظيف البيانات', 'إدارة المكررات', 'الاستيراد/التصدير', 'قواعد جودة البيانات'],
    'services.migration.title': 'هجرة السحابة',
    'services.migration.desc': 'هجرة سلسة من الأنظمة القديمة إلى CRM السحابي الحديث.',
    'services.migration.features': ['تحليل الأنظمة القديمة', 'تخطيط الهجرة', 'نقل البيانات', 'الاختبار والتحقق'],
    'services.security.title': 'الأمان والامتثال',
    'services.security.desc': 'تأكد من أن CRM الخاص بك يلبي معايير الصناعة ومتطلبات الأمان.',
    'services.security.features': ['تدقيق الأمان', 'إعداد الامتثال', 'إدارة الأذونات', 'المراقبة'],
    'services.analytics.title': 'التحليلات والتقارير',
    'services.analytics.desc': 'لوحات تحكم وتقارير مخصصة لتتبع أداء عملك.',
    'services.analytics.features': ['لوحات تحكم مخصصة', 'تتبع مؤشرات الأداء', 'تقارير تلقائية', 'تصور البيانات'],
    'services.training.title': 'التدريب والدعم',
    'services.training.desc': 'برامج تدريب شاملة ودعم مستمر لفريقك.',
    'services.training.features': ['تدريب المستخدمين', 'شهادة الإدارة', 'دعم 24/7', 'أفضل الممارسات'],
    
    // Clients Page
    'clients.hero.title': 'عملاؤنا',
    'clients.hero.subtitle': 'موثوق من قبل الشركات الرائدة عبر مختلف الصناعات',
    'clients.sections.realEstate': 'عملاء العقارات',
    'clients.sections.healthcare': 'عملاء الرعاية الصحية',
    'clients.sections.manufacturing': 'عملاء التصنيع',
    'clients.sections.retail': 'عملاء التجزئة',
    'clients.sections.logistics': 'عملاء اللوجستيات',
    'clients.sections.analytics': 'عملاء التحليلات',
    'clients.controls.play': 'تشغيل',
    'clients.controls.pause': 'إيقاف',
    'clients.controls.next': 'التالي',
    'clients.controls.previous': 'السابق',
    
    // Learn Page
    'learn.hero.title': 'بوابة التعليم Cloudastick',
    'learn.hero.subtitle': 'تحت الصيانة لتحديثات 2026',
    'learn.hero.description': 'نحن نبني شيئاً مذهلاً لعملائنا الكرام. استعد للشهادات العمودية الشاملة ومسارات التعلم المتدرجة المصممة خصيصاً لاحتياجات عملك.',
    'learn.launching.title': 'الإطلاق خلال:',
    'learn.launching.note': 'هذا العد التنازلي لأغراض التوضيح. سيتم الإعلان عن تاريخ الإطلاق الفعلي قريباً.',
    'learn.countdown.title': 'البرنامج التالي يبدأ خلال',
    'learn.countdown.days': 'أيام',
    'learn.countdown.hours': 'ساعات',
    'learn.countdown.minutes': 'دقائق',
    'learn.countdown.seconds': 'ثواني',
    'learn.features.vertical.title': 'شهادات عمودية',
    'learn.features.vertical.desc': 'شهادات متخصصة في قطاعات صناعية محددة مصممة لاحتياجات عملك.',
    'learn.features.tiered.title': 'مسارات التعلم المتدرجة',
    'learn.features.tiered.desc': 'مستويات شهادات متدرجة من الأساسي إلى مستوى الخبرة المتقدم.',
    'learn.features.exclusive.title': 'حصري للعملاء',
    'learn.features.exclusive.desc': 'متاح حصرياً لعملاء Cloudastick مع عقود دعم نشطة.',
    'learn.features.paced.title': 'التعلم الذاتي',
    'learn.features.paced.desc': 'تعلم بالسرعة التي تناسبك مع جدولة مرنة ومواد دراسية شاملة.',
    'learn.cta.register': 'احصل على إشعار عند الإطلاق',
    'learn.cta.learnMore': 'تعرف على خدماتنا',
    'learn.success.title': 'قصص نجاحنا المعتمدة',
    'learn.success.subtitle': 'شاهد كيف حقق عملاؤنا بنجاح شهادات Salesforce الخاصة بهم وحولوا أعمالهم ببرامجنا التدريبية الشاملة.',
    
    // Contact Page
    'contact.hero.title': 'اتصل بنا',
    'contact.hero.subtitle': 'مستعد لتحويل عملك؟ تواصل مع خبرائنا',
    'contact.form.title': 'أرسل لنا رسالة',
    'contact.form.name': 'الاسم',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.company': 'الشركة',
    'contact.form.message': 'الرسالة',
    'contact.form.submit': 'إرسال الرسالة',
    'contact.form.submitting': 'جاري الإرسال...',
    'contact.form.bookMeeting': 'احجز اجتماع',
    'contact.info.email': 'البريد الإلكتروني',
    'contact.info.phone': 'الهاتف',
    'contact.info.address': 'العنوان',
    'contact.info.hours': 'ساعات العمل',
    'contact.success.title': 'تم إرسال الرسالة!',
    'contact.success.desc': 'شكراً لرسالتك. سنتواصل معك قريباً.',
    
    // Feedback Page
    'feedback.hero.title': 'شهادات العملاء',
    'feedback.hero.subtitle': 'اسمع ما يقوله عملاؤنا عن العمل مع Cloudastick',
    'feedback.controls.play': 'تشغيل',
    'feedback.controls.pause': 'إيقاف',
    'feedback.controls.next': 'التالي',
    'feedback.controls.previous': 'السابق',
    'feedback.rating.excellent': 'ممتاز',
    'feedback.rating.good': 'جيد',
    'feedback.rating.average': 'متوسط',
    'feedback.rating.poor': 'ضعيف',
    
    // Salesforce Apps Page
    'apps.hero.title': 'تطبيقات Salesforce',
    'apps.hero.subtitle': 'تطبيقات مبنية خصيصاً لتمديد قدرات Salesforce',
    'apps.calendar.title': 'تقويم متقدم أنيق',
    'apps.calendar.tagline': 'Google Calendar يلتقي Salesforce',
    'apps.calendar.desc': 'حل تقويم حديث وقوي يجلب تجربة Google Calendar المألوفة مباشرة إلى بيئة Salesforce.',
    'apps.omnichannel.title': 'مركز التواصل متعدد القنوات',
    'apps.omnichannel.tagline': 'منصة تواصل موحدة للعملاء',
    'apps.omnichannel.desc': 'دمج جميع نقاط اتصال العملاء بسلاسة في مركز تواصل ذكي واحد داخل Salesforce.',
    'apps.features.responsive': 'واجهة تقويم متجاوبة',
    'apps.features.responsive.desc': 'تصميم تقويم جميل وبديهي يعمل بسلاسة عبر جميع الأجهزة',
    'apps.features.universal': 'دعم كائنات عالمي',
    'apps.features.universal.desc': 'تسجيل الأنشطة على أي كائن Salesforce - العملاء المحتملين، جهات الاتصال، الحسابات، الفرص، والكائنات المخصصة',
    'apps.features.smart': 'جدولة المتابعة الذكية',
    'apps.features.smart.desc': 'جدولة أنشطة المتابعة بسهولة مع وظيفة السحب والإفلات',
    'apps.features.customizable': 'تصميم بصري قابل للتخصيص',
    'apps.features.customizable.desc': 'خصص عرض التقويم الخاص بك مع ترميز الألوان والتمثيلات البصرية لأقصى إنتاجية',
    'apps.features.filtering': 'تصفية متقدمة',
    'apps.features.filtering.desc': 'تصفية حسب نوع النشاط، نوع العميل، المستخدم المعين، الحالة، والمزيد',
    'apps.features.timeline': 'عرض الجدول الزمني',
    'apps.features.timeline.desc': 'تصور متقدم للجدول الزمني لرؤية أنشطتك عبر الوقت والفرق',
    'apps.features.fieldService': 'إدارة الخدمة الميدانية',
    'apps.features.fieldService.desc': 'مثالي لفرق الخدمة الميدانية - جدولة مواعيد الخدمة، تتبع مواقع الفنيين، وإدارة الأنشطة في الموقع',
    'apps.features.route': 'تحسين المسار',
    'apps.features.route.desc': 'تخطيط مسار ذكي لمندوبي المبيعات والعاملين الميدانيين لزيادة الزيارات اليومية وتقليل وقت السفر',
    'apps.features.territory': 'إدارة المنطقة',
    'apps.features.territory.desc': 'تصور وإدارة الأنشطة الميدانية حسب المنطقة، ضمان التغطية المثلى وتوزيع العمل المتوازن',
    'apps.features.realtime': 'تحديثات الجدولة في الوقت الفعلي',
    'apps.features.realtime.desc': 'تقويم متوافق مع الهاتف المحمول يزامن في الوقت الفعلي، مثالي لمندوبي المبيعات الميدانيين الذين يديرون المواعيد أثناء التنقل',
    'apps.features.checkin': 'تتبع تسجيل الدخول/الخروج',
    'apps.features.checkin.desc': 'تتبع الزيارات الميدانية مع تسجيل الدخول الممكّن بالموقع الجغرافي، تسجيل النشاط التلقائي، وتتبع مدة الزيارة',
    'apps.features.analytics': 'تحليلات النشاط الميداني',
    'apps.features.analytics.desc': 'مراقبة إنتاجية الفريق الميداني، تتبع معدلات إكمال الخدمة، وتحليل أنماط الزيارة للتحسين المستمر',
    'apps.cta.tryDemo': 'جرب العرض التوضيحي',
    'apps.cta.learnMore': 'اعرف المزيد',
    'apps.cta.getStarted': 'ابدأ الآن',
    'apps.cta.contactSales': 'تواصل مع المبيعات',
    'apps.modal.close': 'إغلاق',
    'apps.modal.play': 'تشغيل',
    'apps.modal.pause': 'إيقاف',
    'apps.modal.fullscreen': 'ملء الشاشة',
    'apps.modal.download': 'تحميل',
    'apps.modal.share': 'مشاركة',
    
    // Salesforce Power Page
    'power.hero.badge': 'أكثر من CRM - منصة شاملة',
    'power.hero.title': 'اكتشف القوة الكاملة لـ Salesforce',
    'power.hero.subtitle': 'اختر صناعتك لاستكشاف كيف يحول Salesforce الشركات إلى ما هو أبعد من CRM التقليدي',
    'power.hero.cta': 'ابدأ الآن',
    'power.hero.explore': 'استكشف الحلول',
    'power.hero.selectIndustry': 'اختر صناعتك',
    'power.hero.selectIndustry.desc': 'اختر صناعتك لترى كيف يمكن لـ Salesforce تحويل عملك',
    
    // Platform Overview
    'power.platform.title': 'أكثر من مجرد CRM',
    'power.platform.title.industry': 'أكثر من مجرد CRM لـ {industry}',
    'power.platform.subtitle': 'Salesforce هو منصة شاملة مع سحابات متخصصة لكل احتياجات الأعمال',
    'power.platform.subtitle.industry': 'يوفر Salesforce حلولاً متخصصة لـ {industry} مع سحابات وسير عمل مخصصة للصناعة تتعامل مع تحدياتك الفريدة.',
    'power.platform.challenges': 'التحديات الرئيسية التي نحلها لـ {industry}:',
    'power.platform.explore': 'استكشف المنصة',
    'power.platform.learnMore': 'اعرف المزيد',
    
    // ERP Integration
    'power.erp.title': 'يتصل بسلاسة مع أنظمتك الموجودة',
    'power.erp.title.industry': 'يتصل بسلاسة مع أنظمة {industry} الخاصة بك',
    'power.erp.subtitle': 'يتكامل Salesforce مع جميع أنظمة ERP الرئيسية لعمليات أعمال موحدة',
    'power.erp.subtitle.industry': 'يتكامل Salesforce مع أنظمة ERP الرئيسية المستخدمة في {industry} لتوحيد بياناتك وتبسيط سير عمل {industry}',
    'power.erp.integrations': 'التكاملات الشائعة لـ {industry}:',
    'power.erp.viewAll': 'عرض جميع التكاملات',
    
    // Data Cloud
    'power.data.title': 'Data Cloud: اربط كل شيء',
    'power.data.title.industry': 'Data Cloud: اربط بيانات {industry} الخاصة بك',
    'power.data.subtitle': 'نظرة موحدة لعملائك، بغض النظر عن مكان وجود البيانات',
    'power.data.subtitle.industry': 'نظرة موحدة لعملاء {industry} وعملياتك، بغض النظر عن مكان وجود البيانات عبر أنظمتك',
    'power.data.sources': 'مصادر بيانات {industry} التي نربطها:',
    'power.data.explore': 'استكشف Data Cloud',
    
    // Industry Solutions
    'power.industry.title': 'حلول مخصصة لـ {industry}',
    'power.industry.products': 'منتجات الصناعة',
    'power.industry.metrics': 'مقاييس النجاح',
    'power.industry.useCases': 'حالات الاستخدام',
    'power.industry.seeComparison': 'شاهد المقارنة الكاملة',
    'power.industry.customize': 'خصص لصناعتك',
    
    // Competitive Analysis
    'power.comparison.title': 'لماذا يقود Salesforce السوق',
    'power.comparison.title.industry': 'لماذا يقود Salesforce {industry}',
    'power.comparison.subtitle': 'مقارنة شاملة مع منصات CRM الأخرى',
    'power.comparison.subtitle.industry': 'شاهد كيف يتفوق Salesforce على المنافسين في {industry}',
    'power.comparison.viewTable': 'عرض جدول المقارنة',
    'power.comparison.shareTable': 'شارك هذا الجدول',
    'power.comparison.downloadTable': 'تحميل الجدول',
    
    // Table/Comparison
    'power.table.title': 'Salesforce مقابل المنافسين',
    'power.table.title.industry': 'Salesforce مقابل المنافسين في {industry}',
    'power.table.selectIndustry': 'اختر الصناعة للمقارنة',
    'power.table.selectIndustry.desc': 'اختر صناعتك لرؤية جدول مقارنة مخصص',
    'power.table.share': 'شارك الجدول',
    'power.table.download': 'تحميل PDF',
    'power.table.copy': 'نسخ الرابط',
    'power.table.copied': 'تم نسخ الرابط!',
    'power.table.shareTitle': 'شارك جدول المقارنة',
    'power.table.shareDesc': 'شارك هذه المقارنة المخصصة للصناعة مع فريقك',
    
    // Comparison Metrics
    'power.comparison.metric': 'الأداء العام',
    'power.comparison.roi': 'متوسط عائد الاستثمار',
    'power.comparison.differentiators': 'المميزات الرئيسية',
    'power.comparison.completePlatform': 'منصة شاملة',
    'power.comparison.completePlatform.desc': '20+ سحابة متخصصة في منصة متكاملة واحدة',
    'power.comparison.einstein': 'Einstein AI',
    'power.comparison.einstein.desc': 'ذكاء اصطناعي مدمج للرؤى التنبؤية',
    'power.comparison.appexchange': 'AppExchange',
    'power.comparison.appexchange.desc': 'أكبر سوق لتطبيقات الأعمال',
    'power.comparison.scalability': 'قابلية التوسع المؤسسية',
    'power.comparison.scalability.desc': 'يتوسع من الشركات الناشئة إلى Fortune 500',
    'power.comparison.averageROI': 'مقارنة متوسط عائد الاستثمار',
    'power.comparison.roiDescription': 'بناءً على دراسات الصناعة واستطلاعات العملاء',
    
    // CTA Section
    'power.cta.title': 'مستعد لتحويل عملك؟',
    'power.cta.title.industry': 'مستعد لتحويل أعمال {industry} الخاصة بك؟',
    'power.cta.subtitle': 'دعنا نناقش كيف يمكن لـ Salesforce أن يحدث ثورة في عملياتك',
    'power.cta.subtitle.industry': 'دعنا نناقش كيف يمكن لـ Salesforce أن يحدث ثورة في عمليات {industry} الخاصة بك',
    'power.cta.contact': 'اتصل بنا',
    'power.cta.schedule': 'جدولة عرض توضيحي',
    'power.cta.learnMore': 'اعرف المزيد',
    
    // Navigation
    'power.nav.overview': 'نظرة عامة على المنصة',
    'power.nav.erp': 'تكامل ERP',
    'power.nav.data': 'Data Cloud',
    'power.nav.industry': 'حلول الصناعة',
    'power.nav.comparison': 'المقارنة',
    'power.nav.cta': 'ابدأ الآن',
    
    // Industry-specific content
    'power.industry.realEstate.challenges': [
      'إدارة العملاء المحتملين عبر عقارات متعددة',
      'تتبع علاقات العملاء',
      'تحسين محفظة العقارات',
      'تتبع وتقرير العمولات'
    ],
    'power.industry.healthcare.challenges': [
      'إدارة بيانات المرضى',
      'الامتثال لـ HIPAA',
      'تنسيق الرعاية',
      'إدارة دورة الإيرادات'
    ],
    'power.industry.manufacturing.challenges': [
      'رؤية سلسلة التوريد',
      'تتبع مراقبة الجودة',
      'صيانة المعدات',
      'تخطيط الإنتاج'
    ],
    'power.industry.retail.challenges': [
      'رسم خريطة رحلة العميل',
      'إدارة المخزون',
      'تجربة متعددة القنوات',
      'تتبع أداء المبيعات'
    ],
    
    // Team Roles
    'team.founder': 'مؤسس Cloudastick Systems',
    'team.marketingConsultant': 'استشاري Marketing Cloud',
    'team.customerSuccess': 'مدير نجاح العملاء',
    'team.brandSpecialist': 'أخصائي العلامة التجارية وتجربة الأشخاص',
    'team.salesforceConsultant': 'استشاري Salesforce',
    'team.headOfTech': 'رئيس التكنولوجيا',
    'team.hoverElements.vision': 'الرؤية',
    'team.hoverElements.leadership': 'القيادة',
    'team.hoverElements.campaigns': 'الحملات',
    'team.hoverElements.analytics': 'التحليلات',
    'team.hoverElements.support': 'الدعم',
    'team.hoverElements.success': 'النجاح',
    'team.hoverElements.brand': 'العلامة التجارية',
    'team.hoverElements.culture': 'الثقافة',
    'team.hoverElements.development': 'التطوير',
    'team.hoverElements.configuration': 'التكوين',
    'team.hoverElements.integration': 'التكامل',
    'team.hoverElements.data': 'البيانات',
    'team.hoverElements.security': 'الأمان',
    'team.hoverElements.architecture': 'الهندسة المعمارية',
    'team.hoverElements.strategy': 'الاستراتيجية',
    'team.hoverElements.growth': 'النمو',
    'team.hoverElements.excellence': 'التميز',
    'team.hoverElements.delivery': 'التسليم',
    'team.hoverElements.collaboration': 'التعاون',
    'team.hoverElements.innovation': 'الابتكار',
    'team.hoverElements.customization': 'التخصيص',
    'team.hoverElements.dataManagement': 'إدارة البيانات',
    'team.hoverElements.emailMarketing': 'التسويق عبر البريد الإلكتروني',
    'team.hoverElements.projectDelivery': 'تسليم المشروع',
    'team.hoverElements.timeline': 'الجدول الزمني',
    'team.technicalArchitect': 'مهندس معماري تقني',
    'team.projectManager': 'مدير المشروع',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.finish': 'إنهاء',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.getStarted': 'ابدأ الآن',
    'common.learnMore': 'اعرف المزيد',
    'common.contactUs': 'اتصل بنا',
    'common.readMore': 'اقرأ المزيد',
    'common.viewAll': 'عرض الكل',
    'common.submit': 'إرسال',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.confirm': 'تأكيد',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
    
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    if (langParam && ['en', 'ar'].includes(langParam)) {
      setLanguage(langParam);
    }
  }, []);

  useEffect(() => {
    setIsRTL(language === 'ar');
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    // Direct lookup using bracket notation
    const currentTranslations = translations[language];
    let value = currentTranslations[key];
    
    // If not found, try English fallback
    if (!value) {
      value = translations.en[key];
    }
    
    // If still not found, return the key
    if (!value) {
      return key;
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
