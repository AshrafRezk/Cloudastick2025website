import { 
  Users, 
  Headphones, 
  BarChart3, 
  ShoppingCart, 
  Globe, 
  MessageSquare, 
  PieChart, 
  Heart, 
  Factory, 
  Phone, 
  CreditCard, 
  Database, 
  Zap, 
  Brain,
  Cloud,
  Workflow,
  Shield,
  Target,
  TrendingUp,
  Settings,
  Wrench,
  Network
} from 'lucide-react';

export interface SalesforceProduct {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  industries: string[];
  useCases: string[];
  integrations: string[];
  keyFeatures: string[];
  category: 'Core' | 'Industry' | 'Integration' | 'AI' | 'Analytics';
  marketShare?: string;
  customerCount?: string;
}

export const salesforceProducts: SalesforceProduct[] = [
  {
    id: 'sales-cloud',
    name: 'Sales Cloud',
    shortName: 'Sales',
    description: 'The world\'s leading CRM platform for sales teams to manage leads, opportunities, and close deals faster.',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-600',
    industries: ['All Industries'],
    useCases: [
      'Lead Management & Qualification',
      'Opportunity Tracking',
      'Sales Forecasting',
      'Territory Management',
      'Quote & Proposal Generation'
    ],
    integrations: ['Service Cloud', 'Marketing Cloud', 'Commerce Cloud', 'Slack', 'Tableau'],
    keyFeatures: [
      'Einstein Lead Scoring',
      'Sales Pipeline Management',
      'Mobile Sales App',
      'Customizable Dashboards',
      'Advanced Reporting'
    ],
    category: 'Core',
    marketShare: '#1 CRM Platform',
    customerCount: '150,000+ companies'
  },
  {
    id: 'service-cloud',
    name: 'Service Cloud',
    shortName: 'Service',
    description: 'Comprehensive customer service platform with AI-powered support, case management, and omnichannel capabilities.',
    icon: Headphones,
    gradient: 'from-green-500 to-emerald-600',
    industries: ['All Industries'],
    useCases: [
      'Case Management',
      'Omnichannel Support',
      'Knowledge Management',
      'Field Service',
      'Customer Self-Service'
    ],
    integrations: ['Sales Cloud', 'Marketing Cloud', 'Experience Cloud', 'Slack', 'MuleSoft'],
    keyFeatures: [
      'Einstein AI for Service',
      'Omnichannel Routing',
      'Knowledge Base',
      'Live Chat & Messaging',
      'Field Service Lightning'
    ],
    category: 'Core',
    marketShare: '#1 Customer Service Platform',
    customerCount: '150,000+ companies'
  },
  {
    id: 'marketing-cloud',
    name: 'Marketing Cloud',
    shortName: 'Marketing',
    description: 'Comprehensive marketing automation platform for personalized customer journeys across all channels.',
    icon: BarChart3,
    gradient: 'from-purple-500 to-pink-600',
    industries: ['Retail', 'E-commerce', 'Financial Services', 'Healthcare', 'Travel'],
    useCases: [
      'Email Marketing Automation',
      'Customer Journey Orchestration',
      'Social Media Marketing',
      'Mobile Marketing',
      'Personalization at Scale'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'Commerce Cloud', 'Data Cloud', 'Tableau'],
    keyFeatures: [
      'Journey Builder',
      'Email Studio',
      'Social Studio',
      'Mobile Studio',
      'Advertising Studio'
    ],
    category: 'Core',
    marketShare: '#1 Marketing Automation',
    customerCount: '50,000+ companies'
  },
  {
    id: 'commerce-cloud',
    name: 'Commerce Cloud',
    shortName: 'Commerce',
    description: 'Complete commerce platform with B2B and B2C capabilities for omnichannel selling, AI-powered personalization, and seamless customer experiences.',
    icon: ShoppingCart,
    gradient: 'from-orange-500 to-red-600',
    industries: ['Retail', 'Fashion', 'Electronics', 'Beauty', 'Home & Garden', 'Manufacturing', 'Distribution', 'Wholesale', 'Technology', 'Industrial'],
    useCases: [
      'Online Store Management (B2C)',
      'B2B Catalog & Quote Management',
      'Product Catalog Management',
      'Account-Based Selling (B2B)',
      'Order Management',
      'Customer Personalization',
      'Bulk Order Processing (B2B)',
      'Mobile Commerce'
    ],
    integrations: ['Sales Cloud', 'Marketing Cloud', 'Service Cloud', 'CPQ', 'Data Cloud', 'MuleSoft'],
    keyFeatures: [
      'Einstein Commerce AI',
      'B2B & B2C Storefronts',
      'Mobile-First Design',
      'Account-Based Commerce',
      'Quote-to-Cash',
      'Global Commerce',
      'Order Management',
      'Pricing & Discounts'
    ],
    category: 'Core',
    marketShare: '#1 Commerce Platform',
    customerCount: '15,000+ companies'
  },
  {
    id: 'experience-cloud',
    name: 'Experience Cloud',
    shortName: 'Experience',
    description: 'Build branded digital experiences, portals, and communities that connect customers, partners, and employees.',
    icon: Globe,
    gradient: 'from-teal-500 to-cyan-600',
    industries: ['All Industries'],
    useCases: [
      'Customer Portals',
      'Partner Communities',
      'Employee Self-Service',
      'Knowledge Sharing',
      'Digital Engagement'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Data Cloud', 'Slack'],
    keyFeatures: [
      'Community Builder',
      'Digital Experience Platform',
      'Content Management',
      'Member Management',
      'Analytics & Insights'
    ],
    category: 'Core',
    marketShare: '#1 Digital Experience Platform',
    customerCount: '25,000+ companies'
  },
  {
    id: 'slack',
    name: 'Slack',
    shortName: 'Slack',
    description: 'Team collaboration platform integrated with Salesforce to bring work together in one place.',
    icon: MessageSquare,
    gradient: 'from-violet-500 to-purple-600',
    industries: ['All Industries'],
    useCases: [
      'Team Collaboration',
      'Sales & Service Integration',
      'Workflow Automation',
      'File Sharing',
      'Video Conferencing'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Tableau', 'MuleSoft'],
    keyFeatures: [
      'Salesforce Integration',
      'Workflow Builder',
      'Huddles & Clips',
      'Canvas',
      'Enterprise Security'
    ],
    category: 'Core',
    marketShare: '#1 Team Collaboration',
    customerCount: '20+ million daily users'
  },
  {
    id: 'tableau-crm',
    name: 'Tableau CRM (Analytics)',
    shortName: 'Analytics',
    description: 'AI-powered analytics platform that brings data insights directly into Salesforce workflows.',
    icon: PieChart,
    gradient: 'from-amber-500 to-orange-600',
    industries: ['All Industries'],
    useCases: [
      'Business Intelligence',
      'Predictive Analytics',
      'Data Visualization',
      'Performance Dashboards',
      'AI-Powered Insights'
    ],
    integrations: ['All Salesforce Clouds', 'External Data Sources', 'MuleSoft', 'Data Cloud'],
    keyFeatures: [
      'Einstein Discovery',
      'Interactive Dashboards',
      'Data Preparation',
      'Mobile Analytics',
      'Natural Language Queries'
    ],
    category: 'Analytics',
    marketShare: '#1 Business Intelligence',
    customerCount: '100,000+ companies'
  },
  {
    id: 'life-sciences-cloud',
    name: 'Life Sciences Cloud',
    shortName: 'Life Sciences',
    description: 'Specialized platform for pharmaceutical, biotech, and medical device companies with compliance and HCP engagement.',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-600',
    industries: ['Pharmaceutical', 'Biotechnology', 'Medical Devices', 'Healthcare'],
    useCases: [
      'HCP Engagement',
      'Clinical Trial Management',
      'Compliance Tracking',
      'Product Launch Management',
      'Medical Affairs'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Data Cloud', 'Veeva'],
    keyFeatures: [
      'HCP Segmentation',
      'Compliance Management',
      'Clinical Trial Tracking',
      'Medical Affairs',
      'Regulatory Reporting'
    ],
    category: 'Industry',
    marketShare: '#1 Life Sciences CRM',
    customerCount: '500+ companies'
  },
  {
    id: 'manufacturing-cloud',
    name: 'Manufacturing Cloud',
    shortName: 'Manufacturing',
    description: 'Industry-specific solution for manufacturing companies with production planning and supply chain management.',
    icon: Factory,
    gradient: 'from-gray-500 to-slate-600',
    industries: ['Manufacturing', 'Automotive', 'Industrial', 'Aerospace', 'Electronics'],
    useCases: [
      'Production Planning',
      'Supply Chain Management',
      'Quality Management',
      'Asset Management',
      'Demand Planning'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'ERP Systems', 'MES Systems', 'MuleSoft'],
    keyFeatures: [
      'Production Planning',
      'Supply Chain Visibility',
      'Quality Management',
      'Asset Tracking',
      'Demand Forecasting'
    ],
    category: 'Industry',
    marketShare: '#1 Manufacturing CRM',
    customerCount: '1,000+ companies'
  },
  {
    id: 'communications-cloud',
    name: 'Communications Cloud (Telecom)',
    shortName: 'Communications',
    description: 'Specialized platform for telecommunications companies with network management and customer lifecycle.',
    icon: Phone,
    gradient: 'from-cyan-500 to-blue-600',
    industries: ['Telecommunications', 'Cable', 'Internet Service', 'Mobile Networks'],
    useCases: [
      'Network Management',
      'Customer Lifecycle',
      'Service Provisioning',
      'Billing & Payments',
      'Field Operations'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'Billing Systems', 'Network OSS', 'MuleSoft'],
    keyFeatures: [
      'Network Asset Management',
      'Service Provisioning',
      'Customer Lifecycle',
      'Field Service',
      'Billing Integration'
    ],
    category: 'Industry',
    marketShare: '#1 Telecom CRM',
    customerCount: '200+ companies'
  },
  {
    id: 'financial-services-cloud',
    name: 'Financial Services Cloud',
    shortName: 'Financial Services',
    description: 'Specialized platform for banking, insurance, and wealth management with compliance and client management.',
    icon: CreditCard,
    gradient: 'from-emerald-500 to-teal-600',
    industries: ['Banking', 'Insurance', 'Wealth Management', 'Fintech', 'Investment'],
    useCases: [
      'Client Relationship Management',
      'Wealth Management',
      'Insurance Policy Management',
      'Compliance Tracking',
      'Risk Management'
    ],
    integrations: ['Sales Cloud', 'Service Cloud', 'Core Banking Systems', 'Trading Platforms', 'MuleSoft'],
    keyFeatures: [
      'Client 360 View',
      'Wealth Management',
      'Compliance Management',
      'Risk Assessment',
      'Regulatory Reporting'
    ],
    category: 'Industry',
    marketShare: '#1 Financial Services CRM',
    customerCount: '2,000+ companies'
  },
  {
    id: 'data-cloud',
    name: 'Data Cloud',
    shortName: 'Data Cloud',
    description: 'Unified data platform that connects all your data sources to create a single source of truth for customer insights.',
    icon: Database,
    gradient: 'from-violet-500 to-purple-600',
    industries: ['All Industries'],
    useCases: [
      'Customer 360',
      'Data Unification',
      'Real-time Insights',
      'Cross-Platform Analytics',
      'AI-Powered Segmentation'
    ],
    integrations: ['All Salesforce Clouds', 'External Systems', 'ERPs', 'Marketing Tools', 'MuleSoft'],
    keyFeatures: [
      'Real-time Data Ingestion',
      'Customer 360',
      'Identity Resolution',
      'Segment Builder',
      'Einstein AI Integration'
    ],
    category: 'Integration',
    marketShare: '#1 Customer Data Platform',
    customerCount: '10,000+ companies'
  },
  {
    id: 'mulesoft',
    name: 'MuleSoft',
    shortName: 'MuleSoft',
    description: 'API-led connectivity platform that connects any system, data, or device with reusable APIs.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-600',
    industries: ['All Industries'],
    useCases: [
      'System Integration',
      'API Management',
      'Data Synchronization',
      'Legacy System Modernization',
      'Microservices Architecture'
    ],
    integrations: ['All Systems', 'ERPs', 'Databases', 'Cloud Platforms', 'Legacy Systems'],
    keyFeatures: [
      'Anypoint Platform',
      'API Management',
      'Data Integration',
      'System Connectors',
      'Monitoring & Analytics'
    ],
    category: 'Integration',
    marketShare: '#1 Integration Platform',
    customerCount: '2,000+ companies'
  },
  {
    id: 'field-service-cloud',
    name: 'Field Service Cloud',
    shortName: 'Field Service',
    description: 'Intelligent field service management platform powered by AI agents to optimize scheduling, dispatch, and customer service.',
    icon: Wrench,
    gradient: 'from-sky-500 to-blue-600',
    industries: ['Manufacturing', 'Utilities', 'Healthcare', 'Telecommunications', 'Construction', 'HVAC'],
    useCases: [
      'Intelligent Scheduling & Dispatch',
      'Mobile Field Service',
      'Asset Management',
      'Preventive Maintenance',
      'Agentforce-Powered Automation'
    ],
    integrations: ['Service Cloud', 'Sales Cloud', 'Commerce Cloud', 'MuleSoft', 'ERP Systems'],
    keyFeatures: [
      'Agentforce AI Agents',
      'Optimized Scheduling Engine',
      'Mobile Field Management',
      'Asset Tracking',
      'Real-time Service Updates'
    ],
    category: 'Industry',
    marketShare: '#1 Field Service Platform',
    customerCount: '3,000+ companies'
  },
  {
    id: 'informatica',
    name: 'Informatica',
    shortName: 'Informatica',
    description: 'Enterprise data integration and management platform for data quality, governance, and cloud data integration.',
    icon: Network,
    gradient: 'from-green-600 to-emerald-700',
    industries: ['Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Government'],
    useCases: [
      'Data Quality Management',
      'Data Governance',
      'Cloud Data Integration',
      'Master Data Management',
      'Enterprise Data Catalog'
    ],
    integrations: ['Data Cloud', 'MuleSoft', 'All ERPs', 'Cloud Data Warehouses', 'Big Data Platforms'],
    keyFeatures: [
      'AI-Powered Data Quality',
      'Enterprise Data Catalog',
      'Cloud Data Integration',
      'Master Data Management',
      'Data Governance'
    ],
    category: 'Integration',
    marketShare: '#1 Data Management Platform',
    customerCount: '7,000+ companies'
  },
  {
    id: 'einstein-ai',
    name: 'Einstein AI',
    shortName: 'Einstein',
    description: 'AI-powered platform that brings artificial intelligence to every Salesforce experience.',
    icon: Brain,
    gradient: 'from-pink-500 to-rose-600',
    industries: ['All Industries'],
    useCases: [
      'Predictive Analytics',
      'Automated Insights',
      'Natural Language Processing',
      'Recommendation Engines',
      'Intelligent Automation'
    ],
    integrations: ['All Salesforce Clouds', 'External AI Models', 'Data Sources', 'Third-party AI'],
    keyFeatures: [
      'Einstein Discovery',
      'Einstein Prediction Builder',
      'Einstein Language',
      'Einstein Vision',
      'Einstein Voice'
    ],
    category: 'AI',
    marketShare: '#1 CRM AI Platform',
    customerCount: '150,000+ companies'
  }
];

export const getProductsByIndustry = (industry: string): SalesforceProduct[] => {
  return salesforceProducts.filter(product => 
    product.industries.includes('All Industries') || 
    product.industries.includes(industry)
  );
};

export const getProductsByCategory = (category: SalesforceProduct['category']): SalesforceProduct[] => {
  return salesforceProducts.filter(product => product.category === category);
};

export const getCoreProducts = (): SalesforceProduct[] => {
  return getProductsByCategory('Core');
};

export const getIndustryProducts = (): SalesforceProduct[] => {
  return getProductsByCategory('Industry');
};
