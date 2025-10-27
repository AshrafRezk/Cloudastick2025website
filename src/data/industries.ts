import { 
  Building2, 
  Heart, 
  Factory, 
  Phone, 
  CreditCard, 
  ShoppingBag, 
  Briefcase, 
  GraduationCap,
  Car,
  Plane,
  Utensils,
  Home,
  Wrench,
  Shield
} from 'lucide-react';

export interface IndustryData {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  description: string;
  recommendedProducts: string[];
  useCases: string[];
  successMetrics: Array<{ value: string; description: string }>;
  keyChallenges: string[];
  marketSize: string;
  growthRate: string;
  painPoints: string[];
  integrations: string[];
  dataSources: string[];
}

export const industries: IndustryData[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    shortName: 'Real Estate',
    icon: Home,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Transform property management, sales, and customer relationships with Salesforce solutions.',
    recommendedProducts: ['sales-cloud', 'service-cloud', 'marketing-cloud', 'experience-cloud'],
    useCases: [
      'Lead Management for Property Sales',
      'Property Portfolio Management',
      'Customer Portal for Tenants',
      'Marketing Automation for Listings',
      'Service Management for Maintenance'
    ],
    successMetrics: [
      { value: '40%', description: 'increase in lead conversion' },
      { value: '30%', description: 'faster property sales cycles' },
      { value: '50%', description: 'improvement in tenant satisfaction' },
      { value: '25%', description: 'reduction in maintenance costs' }
    ],
    keyChallenges: [
      'Managing multiple property portfolios',
      'Lead nurturing across long sales cycles',
      'Tenant relationship management',
      'Marketing across multiple channels'
    ],
    marketSize: '$3.69 trillion globally',
    growthRate: '5.2% annually',
    painPoints: [
      'Fragmented data across multiple systems',
      'Long sales cycles with poor lead tracking',
      'Difficulty managing tenant relationships',
      'Inefficient property maintenance coordination'
    ],
    integrations: [
      'Property Management Systems (Yardi, AppFolio)',
      'MLS (Multiple Listing Service) platforms',
      'Accounting software (QuickBooks, Xero)',
      'Marketing automation tools'
    ],
    dataSources: [
      'Property databases and MLS feeds',
      'Tenant and prospect information',
      'Financial and accounting systems',
      'Marketing and lead generation platforms'
    ]
  },
  {
    id: 'healthcare-life-sciences',
    name: 'Healthcare & Life Sciences',
    shortName: 'Healthcare',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-600',
    description: 'Compliance-focused solutions for pharmaceutical, biotech, and healthcare organizations.',
    recommendedProducts: ['life-sciences-cloud', 'sales-cloud', 'service-cloud', 'marketing-cloud', 'data-cloud'],
    useCases: [
      'HCP (Healthcare Professional) Engagement',
      'Clinical Trial Management',
      'Compliance & Regulatory Tracking',
      'Patient Support Programs',
      'Medical Affairs Management'
    ],
    successMetrics: [
      { value: '60%', description: 'improvement in HCP engagement' },
      { value: '45%', description: 'faster clinical trial enrollment' },
      { value: '90%', description: 'compliance rate maintenance' },
      { value: '35%', description: 'increase in patient satisfaction' }
    ],
    keyChallenges: [
      'Regulatory compliance requirements',
      'Complex approval processes',
      'HCP relationship management',
      'Data privacy and security'
    ],
    marketSize: '$2.83 trillion globally',
    growthRate: '6.8% annually',
    painPoints: [
      'Strict regulatory compliance requirements',
      'Complex multi-stakeholder approval processes',
      'HCP relationship management at scale',
      'Data privacy and security concerns'
    ],
    integrations: [
      'Electronic Health Records (Epic, Cerner)',
      'Clinical trial management systems',
      'Regulatory compliance platforms',
      'Medical device integration systems'
    ],
    dataSources: [
      'Electronic Health Records (EHR)',
      'Clinical trial databases',
      'HCP engagement platforms',
      'Regulatory and compliance systems'
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    shortName: 'Manufacturing',
    icon: Factory,
    gradient: 'from-gray-500 to-slate-600',
    description: 'Streamline production, supply chain, and customer relationships in manufacturing operations.',
    recommendedProducts: ['manufacturing-cloud', 'sales-cloud', 'service-cloud', 'mulesoft', 'data-cloud'],
    useCases: [
      'Production Planning & Scheduling',
      'Supply Chain Management',
      'Quality Control & Compliance',
      'Customer Order Management',
      'Field Service for Equipment'
    ],
    successMetrics: [
      { value: '25%', description: 'reduction in production costs' },
      { value: '40%', description: 'improvement in on-time delivery' },
      { value: '30%', description: 'increase in customer satisfaction' },
      { value: '50%', description: 'reduction in quality issues' }
    ],
    keyChallenges: [
      'Complex supply chain management',
      'Quality control and compliance',
      'Production planning optimization',
      'Customer order fulfillment'
    ],
    marketSize: '$2.1 trillion globally',
    growthRate: '4.1% annually',
    painPoints: [
      'Fragmented production and supply chain data',
      'Quality control and compliance tracking',
      'Production planning and scheduling complexity',
      'Customer order fulfillment inefficiencies'
    ],
    integrations: [
      'ERP systems (SAP, Oracle, NetSuite)',
      'Manufacturing Execution Systems (MES)',
      'Supply chain management platforms',
      'Quality management systems'
    ],
    dataSources: [
      'Production and manufacturing systems',
      'Supply chain and logistics data',
      'Quality control and compliance records',
      'Customer order and fulfillment data'
    ]
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    shortName: 'Telecom',
    icon: Phone,
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Manage network operations, customer lifecycle, and service delivery in telecom environments.',
    recommendedProducts: ['communications-cloud', 'sales-cloud', 'service-cloud', 'marketing-cloud', 'data-cloud'],
    useCases: [
      'Network Asset Management',
      'Customer Lifecycle Management',
      'Service Provisioning & Activation',
      'Billing & Payment Processing',
      'Field Service Operations'
    ],
    successMetrics: [
      '35% improvement in customer retention',
      '50% faster service activation',
      '40% reduction in churn rate',
      '25% increase in ARPU (Average Revenue Per User)'
    ],
    keyChallenges: [
      'Complex network infrastructure',
      'High customer churn rates',
      'Service activation complexity',
      'Billing and payment management'
    ],
    marketSize: '$1.7 trillion globally',
    growthRate: '3.2% annually'
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    shortName: 'Financial Services',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-teal-600',
    description: 'Compliance-focused solutions for banking, insurance, and wealth management organizations.',
    recommendedProducts: ['financial-services-cloud', 'sales-cloud', 'service-cloud', 'marketing-cloud', 'data-cloud'],
    useCases: [
      'Client Relationship Management',
      'Wealth Management & Advisory',
      'Insurance Policy Management',
      'Compliance & Risk Management',
      'Digital Banking Services'
    ],
    successMetrics: [
      '45% improvement in client satisfaction',
      '30% increase in cross-selling',
      '60% faster loan processing',
      '25% reduction in compliance costs'
    ],
    keyChallenges: [
      'Regulatory compliance requirements',
      'Client data security',
      'Complex product offerings',
      'Digital transformation needs'
    ],
    marketSize: '$2.5 trillion globally',
    growthRate: '5.5% annually'
  },
  {
    id: 'retail-b2c',
    name: 'Retail B2C',
    shortName: 'Retail',
    icon: ShoppingBag,
    gradient: 'from-orange-500 to-red-600',
    description: 'Omnichannel retail solutions for customer engagement, e-commerce, and personalized experiences.',
    recommendedProducts: ['commerce-cloud-b2c', 'marketing-cloud', 'sales-cloud', 'service-cloud', 'data-cloud'],
    useCases: [
      'Omnichannel Customer Experience',
      'E-commerce Platform Management',
      'Personalized Marketing Campaigns',
      'Inventory & Order Management',
      'Customer Service & Support'
    ],
    successMetrics: [
      '50% increase in online sales',
      '35% improvement in customer lifetime value',
      '40% increase in email open rates',
      '25% reduction in cart abandonment'
    ],
    keyChallenges: [
      'Omnichannel customer experience',
      'Inventory management across channels',
      'Personalization at scale',
      'Seasonal demand fluctuations'
    ],
    marketSize: '$4.9 trillion globally',
    growthRate: '7.2% annually'
  },
  {
    id: 'b2b-commerce',
    name: 'B2B Commerce',
    shortName: 'B2B Commerce',
    icon: Briefcase,
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Complex B2B selling solutions for wholesale, distribution, and account-based selling.',
    recommendedProducts: ['commerce-cloud-b2b', 'sales-cloud', 'service-cloud', 'marketing-cloud', 'data-cloud'],
    useCases: [
      'B2B Catalog Management',
      'Quote & Proposal Management',
      'Account-Based Selling',
      'Bulk Order Processing',
      'Contract & Pricing Management'
    ],
    successMetrics: [
      '40% increase in average order value',
      '30% faster quote-to-cash cycles',
      '50% improvement in sales productivity',
      '25% reduction in pricing errors'
    ],
    keyChallenges: [
      'Complex pricing structures',
      'Long sales cycles',
      'Account-based selling',
      'Integration with ERP systems'
    ],
    marketSize: '$1.2 trillion globally',
    growthRate: '8.5% annually'
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    shortName: 'Professional Services',
    icon: GraduationCap,
    gradient: 'from-purple-500 to-violet-600',
    description: 'Project-based business solutions for consulting, legal, and professional service organizations.',
    recommendedProducts: ['sales-cloud', 'service-cloud', 'marketing-cloud', 'experience-cloud', 'data-cloud'],
    useCases: [
      'Project & Resource Management',
      'Client Relationship Management',
      'Time & Expense Tracking',
      'Knowledge Management',
      'Client Portal & Collaboration'
    ],
    successMetrics: [
      '35% improvement in project profitability',
      '40% increase in billable hours',
      '30% faster project delivery',
      '50% improvement in client satisfaction'
    ],
    keyChallenges: [
      'Resource allocation and utilization',
      'Project profitability tracking',
      'Client relationship management',
      'Knowledge sharing and collaboration'
    ],
    marketSize: '$4.2 trillion globally',
    growthRate: '6.1% annually'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    shortName: 'Automotive',
    icon: Car,
    gradient: 'from-slate-500 to-gray-600',
    description: 'End-to-end automotive solutions from manufacturing to dealership management and customer service.',
    recommendedProducts: ['manufacturing-cloud', 'sales-cloud', 'service-cloud', 'marketing-cloud', 'data-cloud'],
    useCases: [
      'Dealership Management',
      'Vehicle Sales & Leasing',
      'Service & Maintenance Management',
      'Parts & Inventory Management',
      'Customer Loyalty Programs'
    ],
    successMetrics: [
      '30% increase in vehicle sales',
      '40% improvement in service efficiency',
      '25% increase in customer retention',
      '35% reduction in service costs'
    ],
    keyChallenges: [
      'Complex supply chain management',
      'Dealership network coordination',
      'Service and maintenance scheduling',
      'Customer loyalty and retention'
    ],
    marketSize: '$2.7 trillion globally',
    growthRate: '3.8% annually'
  },
  {
    id: 'travel-tourism',
    name: 'Travel & Tourism',
    shortName: 'Travel',
    icon: Plane,
    gradient: 'from-sky-500 to-blue-600',
    description: 'Customer-centric solutions for airlines, hotels, travel agencies, and tourism organizations.',
    recommendedProducts: ['sales-cloud', 'service-cloud', 'marketing-cloud', 'experience-cloud', 'data-cloud'],
    useCases: [
      'Customer Journey Management',
      'Booking & Reservation Management',
      'Loyalty Program Management',
      'Customer Service & Support',
      'Marketing & Promotions'
    ],
    successMetrics: [
      '45% increase in customer loyalty',
      '30% improvement in booking conversion',
      '40% increase in repeat bookings',
      '25% reduction in customer service costs'
    ],
    keyChallenges: [
      'Seasonal demand fluctuations',
      'Customer loyalty management',
      'Multi-channel booking management',
      'Service recovery and support'
    ],
    marketSize: '$1.6 trillion globally',
    growthRate: '4.7% annually'
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    shortName: 'Food & Beverage',
    icon: Utensils,
    gradient: 'from-amber-500 to-orange-600',
    description: 'Supply chain and customer management solutions for food and beverage companies.',
    recommendedProducts: ['sales-cloud', 'service-cloud', 'marketing-cloud', 'manufacturing-cloud', 'data-cloud'],
    useCases: [
      'Supply Chain Management',
      'Quality Control & Compliance',
      'Customer & Distributor Management',
      'Product Recall Management',
      'Marketing & Promotions'
    ],
    successMetrics: [
      '35% improvement in supply chain efficiency',
      '40% reduction in product recalls',
      '30% increase in distributor satisfaction',
      '25% improvement in quality compliance'
    ],
    keyChallenges: [
      'Supply chain complexity',
      'Quality control and compliance',
      'Product safety and recalls',
      'Seasonal demand management'
    ],
    marketSize: '$8.9 trillion globally',
    growthRate: '5.3% annually'
  },
  {
    id: 'utilities',
    name: 'Utilities',
    shortName: 'Utilities',
    icon: Wrench,
    gradient: 'from-yellow-500 to-amber-600',
    description: 'Customer service and operations management for utility companies and energy providers.',
    recommendedProducts: ['sales-cloud', 'service-cloud', 'marketing-cloud', 'experience-cloud', 'data-cloud'],
    useCases: [
      'Customer Account Management',
      'Service Request Management',
      'Billing & Payment Processing',
      'Field Service Operations',
      'Energy Usage Analytics'
    ],
    successMetrics: [
      '40% improvement in customer satisfaction',
      '30% reduction in service call volume',
      '25% increase in payment collection',
      '35% improvement in field service efficiency'
    ],
    keyChallenges: [
      'Regulatory compliance requirements',
      'Customer service complexity',
      'Field service management',
      'Billing and payment processing'
    ],
    marketSize: '$1.8 trillion globally',
    growthRate: '3.5% annually'
  },
  {
    id: 'government',
    name: 'Government',
    shortName: 'Government',
    icon: Shield,
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Citizen services and internal operations management for government agencies and public sector.',
    recommendedProducts: ['sales-cloud', 'service-cloud', 'marketing-cloud', 'experience-cloud', 'data-cloud'],
    useCases: [
      'Citizen Service Management',
      'Case & Document Management',
      'Public Portal Development',
      'Internal Process Automation',
      'Compliance & Reporting'
    ],
    successMetrics: [
      '50% improvement in citizen satisfaction',
      '40% reduction in processing times',
      '35% increase in digital service adoption',
      '30% improvement in compliance rates'
    ],
    keyChallenges: [
      'Citizen service delivery',
      'Regulatory compliance',
      'Digital transformation',
      'Process automation'
    ],
    marketSize: '$2.2 trillion globally',
    growthRate: '4.2% annually'
  }
];

export const getIndustryById = (id: string): IndustryData | undefined => {
  return industries.find(industry => industry.id === id);
};

export const getIndustriesByCategory = (category: string): IndustryData[] => {
  const categories = {
    'technology': ['telecommunications', 'professional-services'],
    'manufacturing': ['manufacturing', 'automotive', 'food-beverage'],
    'services': ['financial-services', 'professional-services', 'travel-tourism', 'utilities'],
    'retail': ['retail-b2c', 'b2b-commerce'],
    'healthcare': ['healthcare-life-sciences'],
    'real-estate': ['real-estate'],
    'government': ['government']
  };
  
  const industryIds = categories[category as keyof typeof categories] || [];
  return industries.filter(industry => industryIds.includes(industry.id));
};
