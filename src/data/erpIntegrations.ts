export interface ERPIntegration {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  description: string;
  gradient: string;
  syncCapabilities: string[];
  integrationPoints: string[];
  keyBenefits: string[];
  industries: string[];
  marketShare: string;
  customerCount: string;
}

export const erpIntegrations: ERPIntegration[] = [
  {
    id: 'oracle-fusion',
    name: 'Oracle Fusion Cloud ERP',
    shortName: 'Oracle Fusion',
    logo: '/Assets/Company Logos/oracle-logo.png', // You'll need to add this logo
    description: 'Complete cloud ERP suite with financials, supply chain, HR, and customer experience.',
    gradient: 'from-red-500 to-orange-600',
    syncCapabilities: [
      'Real-time Data Synchronization',
      'Bidirectional Updates',
      'Automated Workflows',
      'Error Handling & Retry Logic',
      'Data Validation & Mapping'
    ],
    integrationPoints: [
      'Customer Master Data',
      'Product Catalog',
      'Order Management',
      'Financial Transactions',
      'Inventory Levels',
      'Customer Service Cases',
      'Sales Opportunities',
      'Pricing & Discounts'
    ],
    keyBenefits: [
      'Unified Customer View',
      'Real-time Inventory Updates',
      'Automated Order Processing',
      'Streamlined Financial Reporting',
      'Reduced Data Entry'
    ],
    industries: ['Manufacturing', 'Retail', 'Financial Services', 'Healthcare', 'Technology'],
    marketShare: '#2 Cloud ERP',
    customerCount: '30,000+ companies'
  },
  {
    id: 'netsuite',
    name: 'NetSuite ERP',
    shortName: 'NetSuite',
    logo: '/Assets/Company Logos/netsuite-logo.png', // You'll need to add this logo
    description: 'Leading cloud-based ERP solution for growing businesses with comprehensive business management.',
    gradient: 'from-blue-500 to-cyan-600',
    syncCapabilities: [
      'Real-time Integration',
      'Bidirectional Sync',
      'Custom Field Mapping',
      'Automated Data Validation',
      'Conflict Resolution'
    ],
    integrationPoints: [
      'Customer Records',
      'Item Master',
      'Sales Orders',
      'Invoices & Payments',
      'Inventory Management',
      'Financial Data',
      'Customer Support',
      'Project Management'
    ],
    keyBenefits: [
      'Single Source of Truth',
      'Automated Quote-to-Cash',
      'Real-time Financial Reporting',
      'Improved Customer Service',
      'Streamlined Operations'
    ],
    industries: ['SMB', 'Mid-Market', 'E-commerce', 'Manufacturing', 'Professional Services'],
    marketShare: '#1 Mid-Market ERP',
    customerCount: '37,000+ companies'
  },
  {
    id: 'sap',
    name: 'SAP S/4HANA',
    shortName: 'SAP',
    logo: '/Assets/Company Logos/sap-logo.png', // You'll need to add this logo
    description: 'Next-generation ERP suite built on SAP HANA with real-time analytics and intelligent automation.',
    gradient: 'from-blue-600 to-indigo-700',
    syncCapabilities: [
      'Real-time Data Exchange',
      'Master Data Synchronization',
      'Transactional Integration',
      'Custom Object Mapping',
      'Advanced Error Handling'
    ],
    integrationPoints: [
      'Customer Master',
      'Material Master',
      'Sales Orders',
      'Delivery Documents',
      'Billing Documents',
      'Financial Postings',
      'Service Orders',
      'Pricing Conditions'
    ],
    keyBenefits: [
      'Unified Business Processes',
      'Real-time Analytics',
      'Automated Workflows',
      'Compliance & Governance',
      'Scalable Architecture'
    ],
    industries: ['Enterprise', 'Manufacturing', 'Retail', 'Utilities', 'Public Sector'],
    marketShare: '#1 Enterprise ERP',
    customerCount: '50,000+ companies'
  },
  {
    id: 'microsoft-dynamics',
    name: 'Microsoft Dynamics 365',
    shortName: 'Dynamics 365',
    logo: '/Assets/Company Logos/microsoft-dynamics-logo.png', // You'll need to add this logo
    description: 'Comprehensive business applications suite with ERP and CRM capabilities in one platform.',
    gradient: 'from-blue-500 to-purple-600',
    syncCapabilities: [
      'Seamless Integration',
      'Real-time Synchronization',
      'Custom Entity Mapping',
      'Automated Data Flow',
      'Conflict Resolution'
    ],
    integrationPoints: [
      'Customer Accounts',
      'Product Information',
      'Sales Transactions',
      'Financial Data',
      'Inventory Management',
      'Customer Service',
      'Project Management',
      'Human Resources'
    ],
    keyBenefits: [
      'Unified Business Platform',
      'Microsoft Ecosystem Integration',
      'AI-Powered Insights',
      'Flexible Deployment',
      'Cost-Effective Solution'
    ],
    industries: ['SMB', 'Mid-Market', 'Manufacturing', 'Retail', 'Professional Services'],
    marketShare: '#3 Cloud ERP',
    customerCount: '25,000+ companies'
  }
];

export const getERPByIndustry = (industry: string): ERPIntegration[] => {
  return erpIntegrations.filter(erp => 
    erp.industries.includes(industry) || 
    erp.industries.some(ind => industry.toLowerCase().includes(ind.toLowerCase()))
  );
};

export const getAllERPs = (): ERPIntegration[] => {
  return erpIntegrations;
};
