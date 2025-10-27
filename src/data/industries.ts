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
  comparisonMetrics: Array<{
    metric: string;
    metricKey: string; // Translation key for the metric name
    salesforce: { score: number; label: string; description?: string };
    hubspot: { score: number; label: string; description?: string };
    zoho: { score: number; label: string; description?: string };
    freshworks: { score: number; label: string; description?: string };
    odoo: { score: number; label: string; description?: string };
  }>;
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
    ],
    comparisonMetrics: [
      {
        metric: 'Property Listing Management & MLS Integration',
        metricKey: 'realEstate.metrics.propertyListing',
        salesforce: { score: 10, label: 'Full MLS Integration', description: 'Seamless MLS sync with real-time updates' },
        hubspot: { score: 6, label: 'Basic Integration', description: 'Limited MLS connectivity' },
        zoho: { score: 7, label: 'Good Integration', description: 'Standard MLS features' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic property management' },
        odoo: { score: 8, label: 'Custom Integration', description: 'Customizable MLS connection' }
      },
      {
        metric: 'Virtual Tour & Open House Scheduling',
        metricKey: 'realEstate.metrics.virtualTours',
        salesforce: { score: 9, label: 'Advanced Scheduling', description: 'AI-powered tour scheduling with calendar sync' },
        hubspot: { score: 7, label: 'Good Scheduling', description: 'Basic appointment booking' },
        zoho: { score: 8, label: 'Integrated Calendar', description: 'Calendar integration with reminders' },
        freshworks: { score: 6, label: 'Basic Booking', description: 'Simple scheduling system' },
        odoo: { score: 7, label: 'Custom Solution', description: 'Configurable scheduling module' }
      },
      {
        metric: 'Tenant Portal with Maintenance Requests',
        metricKey: 'realEstate.metrics.tenantPortal',
        salesforce: { score: 10, label: 'Full Portal Suite', description: 'Complete tenant self-service portal' },
        hubspot: { score: 5, label: 'Basic Forms', description: 'Simple contact forms only' },
        zoho: { score: 7, label: 'Good Portal', description: 'Tenant portal with basic features' },
        freshworks: { score: 6, label: 'Support Tickets', description: 'Ticket-based maintenance requests' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Highly customizable tenant portal' }
      },
      {
        metric: 'Lease Management & Renewal Automation',
        metricKey: 'realEstate.metrics.leaseManagement',
        salesforce: { score: 9, label: 'Automated Workflows', description: 'AI-powered lease renewal predictions' },
        hubspot: { score: 4, label: 'Manual Process', description: 'Basic contact management only' },
        zoho: { score: 7, label: 'Good Tracking', description: 'Lease tracking with reminders' },
        freshworks: { score: 5, label: 'Basic Tracking', description: 'Simple lease management' },
        odoo: { score: 8, label: 'Full ERP Integration', description: 'Complete lease lifecycle management' }
      },
      {
        metric: 'Commission Tracking & Split Calculations',
        metricKey: 'realEstate.metrics.commissionTracking',
        salesforce: { score: 10, label: 'Advanced Calculations', description: 'Complex commission rules and splits' },
        hubspot: { score: 3, label: 'Not Available', description: 'No commission tracking' },
        zoho: { score: 6, label: 'Basic Tracking', description: 'Simple commission calculations' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic sales tracking only' },
        odoo: { score: 9, label: 'Full Accounting', description: 'Integrated commission accounting' }
      },
      {
        metric: 'Property Inspection Checklist Mobile App',
        metricKey: 'realEstate.metrics.inspectionApp',
        salesforce: { score: 10, label: 'Mobile-First Design', description: 'Offline-capable inspection app' },
        hubspot: { score: 4, label: 'Basic Mobile', description: 'Simple mobile forms' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile app with checklists' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile interface' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile app' }
      },
      {
        metric: 'Document e-Signature Integration',
        metricKey: 'realEstate.metrics.eSignature',
        salesforce: { score: 10, label: 'Native Integration', description: 'Built-in DocuSign and Adobe Sign' },
        hubspot: { score: 6, label: 'Third-Party', description: 'Requires external integration' },
        zoho: { score: 8, label: 'Good Integration', description: 'Zoho Sign integration' },
        freshworks: { score: 5, label: 'Basic', description: 'Limited signature options' },
        odoo: { score: 7, label: 'Custom Integration', description: 'Configurable signature solutions' }
      },
      {
        metric: 'Multi-Property Portfolio Dashboard',
        metricKey: 'realEstate.metrics.portfolioDashboard',
        salesforce: { score: 10, label: 'Advanced Analytics', description: 'AI-powered portfolio insights' },
        hubspot: { score: 5, label: 'Basic Reports', description: 'Simple reporting only' },
        zoho: { score: 8, label: 'Good Dashboards', description: 'Comprehensive reporting suite' },
        freshworks: { score: 6, label: 'Limited Analytics', description: 'Basic performance metrics' },
        odoo: { score: 9, label: 'Full BI Suite', description: 'Complete business intelligence' }
      },
      {
        metric: 'Rental Payment Processing Integration',
        metricKey: 'realEstate.metrics.paymentProcessing',
        salesforce: { score: 9, label: 'Multiple Gateways', description: 'Stripe, PayPal, and banking integration' },
        hubspot: { score: 4, label: 'Not Available', description: 'No payment processing' },
        zoho: { score: 7, label: 'Good Integration', description: 'Zoho Payment integration' },
        freshworks: { score: 5, label: 'Basic', description: 'Limited payment options' },
        odoo: { score: 8, label: 'Full Accounting', description: 'Complete payment and accounting suite' }
      },
      {
        metric: 'Tenant Screening & Background Checks',
        metricKey: 'realEstate.metrics.tenantScreening',
        salesforce: { score: 9, label: 'Integrated Screening', description: 'Third-party screening service integration' },
        hubspot: { score: 3, label: 'Not Available', description: 'No screening capabilities' },
        zoho: { score: 6, label: 'Basic Screening', description: 'Simple background check forms' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic applicant tracking' },
        odoo: { score: 7, label: 'Custom Workflow', description: 'Configurable screening process' }
      },
      {
        metric: 'Maintenance Vendor Management',
        metricKey: 'realEstate.metrics.vendorManagement',
        salesforce: { score: 10, label: 'Full Vendor Suite', description: 'Vendor portal, ratings, and payment tracking' },
        hubspot: { score: 4, label: 'Basic Contact', description: 'Simple contact management' },
        zoho: { score: 7, label: 'Good Management', description: 'Vendor tracking and communication' },
        freshworks: { score: 6, label: 'Ticket System', description: 'Vendor ticket management' },
        odoo: { score: 8, label: 'Procurement Suite', description: 'Complete vendor and procurement management' }
      },
      {
        metric: 'Property Performance Analytics',
        metricKey: 'realEstate.metrics.performanceAnalytics',
        salesforce: { score: 10, label: 'AI-Powered Insights', description: 'Einstein Analytics for property performance' },
        hubspot: { score: 5, label: 'Basic Reports', description: 'Simple performance tracking' },
        zoho: { score: 8, label: 'Good Analytics', description: 'Comprehensive performance reports' },
        freshworks: { score: 6, label: 'Limited Analytics', description: 'Basic performance metrics' },
        odoo: { score: 9, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Lead Source Attribution for Properties',
        metricKey: 'realEstate.metrics.leadAttribution',
        salesforce: { score: 10, label: 'Advanced Attribution', description: 'Multi-touch attribution modeling' },
        hubspot: { score: 8, label: 'Good Attribution', description: 'Source tracking and reporting' },
        zoho: { score: 7, label: 'Basic Attribution', description: 'Lead source tracking' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic lead tracking' },
        odoo: { score: 7, label: 'Custom Tracking', description: 'Configurable attribution rules' }
      },
      {
        metric: 'Comparative Market Analysis (CMA) Tools',
        metricKey: 'realEstate.metrics.cmaTools',
        salesforce: { score: 9, label: 'Advanced CMA', description: 'AI-powered market analysis tools' },
        hubspot: { score: 3, label: 'Not Available', description: 'No CMA capabilities' },
        zoho: { score: 6, label: 'Basic CMA', description: 'Simple market comparison tools' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic reporting only' },
        odoo: { score: 7, label: 'Custom Solution', description: 'Configurable market analysis' }
      },
      {
        metric: 'HOA Communication & Management',
        metricKey: 'realEstate.metrics.hoaManagement',
        salesforce: { score: 9, label: 'Community Portal', description: 'Full HOA management and communication' },
        hubspot: { score: 5, label: 'Basic Communication', description: 'Simple email marketing' },
        zoho: { score: 7, label: 'Good Communication', description: 'Community communication tools' },
        freshworks: { score: 6, label: 'Support Focus', description: 'HOA support ticket system' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable community management' }
      },
      {
        metric: 'Property Valuation & Appraisal Tools',
        metricKey: 'realEstate.metrics.valuationTools',
        salesforce: { score: 8, label: 'Integrated Valuation', description: 'Third-party valuation service integration' },
        hubspot: { score: 3, label: 'Not Available', description: 'No valuation tools' },
        zoho: { score: 6, label: 'Basic Tools', description: 'Simple valuation calculators' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic property data' },
        odoo: { score: 7, label: 'Custom Integration', description: 'Configurable valuation workflows' }
      },
      {
        metric: 'Rent Roll Management & Analysis',
        metricKey: 'realEstate.metrics.rentRoll',
        salesforce: { score: 10, label: 'Advanced Rent Roll', description: 'AI-powered rent optimization' },
        hubspot: { score: 4, label: 'Not Available', description: 'No rent roll capabilities' },
        zoho: { score: 7, label: 'Good Management', description: 'Comprehensive rent tracking' },
        freshworks: { score: 5, label: 'Basic Tracking', description: 'Simple rent management' },
        odoo: { score: 9, label: 'Full Accounting', description: 'Complete rent and accounting integration' }
      },
      {
        metric: 'Property Tax Management & Tracking',
        metricKey: 'realEstate.metrics.taxManagement',
        salesforce: { score: 9, label: 'Integrated Tax Tools', description: 'Tax calculation and filing integration' },
        hubspot: { score: 3, label: 'Not Available', description: 'No tax management' },
        zoho: { score: 7, label: 'Good Tracking', description: 'Tax tracking and reminders' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic document management' },
        odoo: { score: 8, label: 'Full Accounting', description: 'Complete tax and accounting suite' }
      },
      {
        metric: 'Insurance Claims & Risk Management',
        metricKey: 'realEstate.metrics.insuranceClaims',
        salesforce: { score: 9, label: 'Claims Management', description: 'Integrated insurance claims processing' },
        hubspot: { score: 4, label: 'Not Available', description: 'No claims management' },
        zoho: { score: 6, label: 'Basic Tracking', description: 'Simple claims tracking' },
        freshworks: { score: 5, label: 'Ticket System', description: 'Claims as support tickets' },
        odoo: { score: 7, label: 'Custom Workflow', description: 'Configurable claims process' }
      }
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
    ],
    comparisonMetrics: [
      {
        metric: 'Medical Rep Visit Tracking with Geo-Location',
        metricKey: 'healthcare.metrics.visitTracking',
        salesforce: { score: 10, label: 'Advanced GPS Tracking', description: 'Real-time location tracking with compliance reporting' },
        hubspot: { score: 4, label: 'Basic Location', description: 'Simple location logging only' },
        zoho: { score: 6, label: 'Good Tracking', description: 'Location tracking with basic analytics' },
        freshworks: { score: 3, label: 'Not Available', description: 'No location tracking' },
        odoo: { score: 7, label: 'Custom Tracking', description: 'Configurable location tracking' }
      },
      {
        metric: 'Sample Distribution & Inventory Management',
        metricKey: 'healthcare.metrics.sampleDistribution',
        salesforce: { score: 10, label: 'Full Sample Suite', description: 'Complete sample lifecycle management with chain of custody' },
        hubspot: { score: 2, label: 'Not Available', description: 'No sample management' },
        zoho: { score: 5, label: 'Basic Inventory', description: 'Simple inventory tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No sample capabilities' },
        odoo: { score: 8, label: 'Full Inventory', description: 'Complete inventory management suite' }
      },
      {
        metric: 'HCP (Healthcare Professional) Engagement Scoring',
        metricKey: 'healthcare.metrics.hcpEngagement',
        salesforce: { score: 10, label: 'AI-Powered Scoring', description: 'Einstein AI for HCP engagement prediction' },
        hubspot: { score: 6, label: 'Basic Scoring', description: 'Simple engagement tracking' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Engagement analytics and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic interaction tracking' },
        odoo: { score: 6, label: 'Custom Scoring', description: 'Configurable engagement metrics' }
      },
      {
        metric: 'Regulatory Compliance Tracking (FDA, EMA)',
        metricKey: 'healthcare.metrics.regulatoryCompliance',
        salesforce: { score: 10, label: 'Full Compliance Suite', description: 'Built-in FDA/EMA compliance workflows' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance tracking' },
        zoho: { score: 5, label: 'Basic Compliance', description: 'Simple compliance checklists' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Clinical Trial Patient Management',
        metricKey: 'healthcare.metrics.clinicalTrials',
        salesforce: { score: 9, label: 'Trial Management', description: 'Complete clinical trial patient tracking' },
        hubspot: { score: 2, label: 'Not Available', description: 'No trial management' },
        zoho: { score: 5, label: 'Basic Tracking', description: 'Simple patient tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No trial capabilities' },
        odoo: { score: 6, label: 'Custom Solution', description: 'Configurable trial management' }
      },
      {
        metric: 'Adverse Event Reporting & Pharmacovigilance',
        metricKey: 'healthcare.metrics.adverseEvents',
        salesforce: { score: 10, label: 'Full PV Suite', description: 'Complete pharmacovigilance and adverse event reporting' },
        hubspot: { score: 2, label: 'Not Available', description: 'No PV capabilities' },
        zoho: { score: 4, label: 'Basic Reporting', description: 'Simple incident reporting' },
        freshworks: { score: 3, label: 'Not Available', description: 'No PV features' },
        odoo: { score: 6, label: 'Custom PV', description: 'Configurable adverse event workflows' }
      },
      {
        metric: 'Territory & Account Planning for Medical Reps',
        metricKey: 'healthcare.metrics.territoryPlanning',
        salesforce: { score: 10, label: 'Advanced Territory', description: 'AI-powered territory optimization and planning' },
        hubspot: { score: 5, label: 'Basic Planning', description: 'Simple territory assignment' },
        zoho: { score: 7, label: 'Good Planning', description: 'Territory management with analytics' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic account assignment' },
        odoo: { score: 8, label: 'Custom Territory', description: 'Configurable territory management' }
      },
      {
        metric: 'Sample Reconciliation & Chain of Custody',
        metricKey: 'healthcare.metrics.sampleReconciliation',
        salesforce: { score: 10, label: 'Full Chain of Custody', description: 'Complete sample tracking with regulatory compliance' },
        hubspot: { score: 2, label: 'Not Available', description: 'No sample tracking' },
        zoho: { score: 5, label: 'Basic Tracking', description: 'Simple sample logging' },
        freshworks: { score: 3, label: 'Not Available', description: 'No sample capabilities' },
        odoo: { score: 7, label: 'Custom Tracking', description: 'Configurable sample management' }
      },
      {
        metric: 'Key Opinion Leader (KOL) Relationship Management',
        metricKey: 'healthcare.metrics.kolManagement',
        salesforce: { score: 9, label: 'KOL Suite', description: 'Complete KOL engagement and relationship management' },
        hubspot: { score: 6, label: 'Basic CRM', description: 'Simple contact management' },
        zoho: { score: 7, label: 'Good CRM', description: 'Relationship tracking and analytics' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic contact management' },
        odoo: { score: 8, label: 'Custom CRM', description: 'Configurable relationship management' }
      },
      {
        metric: 'Medical Affairs Activity Tracking',
        metricKey: 'healthcare.metrics.medicalAffairs',
        salesforce: { score: 9, label: 'Medical Affairs Suite', description: 'Complete medical affairs workflow management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No medical affairs features' },
        zoho: { score: 6, label: 'Basic Tracking', description: 'Simple activity tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic task management' },
        odoo: { score: 7, label: 'Custom Workflow', description: 'Configurable medical affairs processes' }
      },
      {
        metric: 'Veeva Vault Integration Capabilities',
        metricKey: 'healthcare.metrics.veevaIntegration',
        salesforce: { score: 10, label: 'Native Veeva', description: 'Built-in Veeva Vault integration' },
        hubspot: { score: 2, label: 'Not Available', description: 'No Veeva integration' },
        zoho: { score: 4, label: 'Basic Integration', description: 'Limited Veeva connectivity' },
        freshworks: { score: 2, label: 'Not Available', description: 'No Veeva support' },
        odoo: { score: 5, label: 'Custom Integration', description: 'Configurable Veeva connection' }
      },
      {
        metric: 'Mobile Field Force Automation',
        metricKey: 'healthcare.metrics.mobileAutomation',
        salesforce: { score: 10, label: 'Mobile-First', description: 'Offline-capable mobile app for field reps' },
        hubspot: { score: 5, label: 'Basic Mobile', description: 'Simple mobile interface' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile app with field capabilities' },
        freshworks: { score: 4, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile app' }
      },
      {
        metric: 'Signature Capture for Sample Acknowledgment',
        metricKey: 'healthcare.metrics.signatureCapture',
        salesforce: { score: 10, label: 'Native eSignature', description: 'Built-in signature capture with compliance' },
        hubspot: { score: 4, label: 'Not Available', description: 'No signature capture' },
        zoho: { score: 6, label: 'Basic eSignature', description: 'Simple signature capture' },
        freshworks: { score: 3, label: 'Not Available', description: 'No signature features' },
        odoo: { score: 7, label: 'Custom eSignature', description: 'Configurable signature workflows' }
      },
      {
        metric: 'Speaker Program Management',
        metricKey: 'healthcare.metrics.speakerPrograms',
        salesforce: { score: 9, label: 'Speaker Suite', description: 'Complete speaker program management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No speaker management' },
        zoho: { score: 6, label: 'Basic Management', description: 'Simple speaker tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic event management' },
        odoo: { score: 7, label: 'Custom Events', description: 'Configurable speaker programs' }
      },
      {
        metric: 'Medical Education Event Tracking',
        metricKey: 'healthcare.metrics.medicalEducation',
        salesforce: { score: 9, label: 'Education Suite', description: 'Complete medical education event management' },
        hubspot: { score: 5, label: 'Basic Events', description: 'Simple event management' },
        zoho: { score: 7, label: 'Good Events', description: 'Event management with analytics' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic event tracking' },
        odoo: { score: 8, label: 'Custom Events', description: 'Configurable education management' }
      },
      {
        metric: 'Patient Support Program Management',
        metricKey: 'healthcare.metrics.patientSupport',
        salesforce: { score: 9, label: 'Patient Suite', description: 'Complete patient support program management' },
        hubspot: { score: 5, label: 'Basic Support', description: 'Simple patient contact management' },
        zoho: { score: 7, label: 'Good Support', description: 'Patient support with case management' },
        freshworks: { score: 6, label: 'Support Focus', description: 'Patient support ticket system' },
        odoo: { score: 8, label: 'Custom Support', description: 'Configurable patient support workflows' }
      },
      {
        metric: 'Clinical Data Integration & Analytics',
        metricKey: 'healthcare.metrics.clinicalData',
        salesforce: { score: 10, label: 'Advanced Analytics', description: 'Einstein Analytics for clinical data insights' },
        hubspot: { score: 4, label: 'Not Available', description: 'No clinical data capabilities' },
        zoho: { score: 6, label: 'Basic Analytics', description: 'Simple data reporting' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic data tracking' },
        odoo: { score: 7, label: 'Custom Analytics', description: 'Configurable clinical data management' }
      },
      {
        metric: 'Regulatory Submission Management',
        metricKey: 'healthcare.metrics.regulatorySubmissions',
        salesforce: { score: 9, label: 'Submission Suite', description: 'Complete regulatory submission workflow' },
        hubspot: { score: 2, label: 'Not Available', description: 'No submission management' },
        zoho: { score: 4, label: 'Basic Tracking', description: 'Simple document tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No regulatory features' },
        odoo: { score: 6, label: 'Custom Workflow', description: 'Configurable submission processes' }
      },
      {
        metric: 'HCP Credentialing & Verification',
        metricKey: 'healthcare.metrics.hcpCredentialing',
        salesforce: { score: 8, label: 'Credentialing Suite', description: 'HCP verification and credentialing management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No credentialing features' },
        zoho: { score: 5, label: 'Basic Verification', description: 'Simple contact verification' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic contact management' },
        odoo: { score: 7, label: 'Custom Verification', description: 'Configurable credentialing workflows' }
      }
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
    ],
    comparisonMetrics: [
      {
        metric: 'Production Planning & Scheduling Optimization',
        metricKey: 'manufacturing.metrics.productionPlanning',
        salesforce: { score: 9, label: 'AI-Powered Planning', description: 'Einstein AI for production optimization' },
        hubspot: { score: 3, label: 'Not Available', description: 'No production planning' },
        zoho: { score: 6, label: 'Basic Planning', description: 'Simple scheduling tools' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic task management' },
        odoo: { score: 8, label: 'Full MRP', description: 'Complete manufacturing resource planning' }
      },
      {
        metric: 'Supply Chain Visibility & Management',
        metricKey: 'manufacturing.metrics.supplyChain',
        salesforce: { score: 10, label: 'End-to-End Visibility', description: 'Complete supply chain orchestration' },
        hubspot: { score: 4, label: 'Not Available', description: 'No supply chain management' },
        zoho: { score: 7, label: 'Good Tracking', description: 'Supply chain tracking and analytics' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic vendor management' },
        odoo: { score: 9, label: 'Full SCM', description: 'Complete supply chain management suite' }
      },
      {
        metric: 'Quality Control & Compliance Tracking',
        metricKey: 'manufacturing.metrics.qualityControl',
        salesforce: { score: 9, label: 'Quality Suite', description: 'Complete quality management with compliance' },
        hubspot: { score: 3, label: 'Not Available', description: 'No quality management' },
        zoho: { score: 6, label: 'Basic QC', description: 'Simple quality tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic issue tracking' },
        odoo: { score: 8, label: 'Quality Module', description: 'Configurable quality management' }
      },
      {
        metric: 'Equipment Maintenance & Field Service',
        metricKey: 'manufacturing.metrics.equipmentMaintenance',
        salesforce: { score: 10, label: 'Field Service Suite', description: 'Complete equipment lifecycle management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No field service capabilities' },
        zoho: { score: 7, label: 'Good Service', description: 'Service management with scheduling' },
        freshworks: { score: 6, label: 'Service Focus', description: 'Service ticket management' },
        odoo: { score: 8, label: 'Maintenance Module', description: 'Configurable maintenance management' }
      },
      {
        metric: 'Inventory Management & Optimization',
        metricKey: 'manufacturing.metrics.inventoryManagement',
        salesforce: { score: 9, label: 'Smart Inventory', description: 'AI-powered inventory optimization' },
        hubspot: { score: 3, label: 'Not Available', description: 'No inventory management' },
        zoho: { score: 7, label: 'Good Inventory', description: 'Inventory tracking and management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic asset tracking' },
        odoo: { score: 9, label: 'Full Inventory', description: 'Complete inventory management suite' }
      },
      {
        metric: 'Customer Order Management & Fulfillment',
        metricKey: 'manufacturing.metrics.orderManagement',
        salesforce: { score: 10, label: 'Order Orchestration', description: 'End-to-end order lifecycle management' },
        hubspot: { score: 6, label: 'Basic CRM', description: 'Simple order tracking' },
        zoho: { score: 8, label: 'Good Orders', description: 'Order management with fulfillment' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic order tracking' },
        odoo: { score: 9, label: 'Full ERP', description: 'Complete order to cash process' }
      },
      {
        metric: 'Work Order Management & Tracking',
        metricKey: 'manufacturing.metrics.workOrders',
        salesforce: { score: 9, label: 'Work Order Suite', description: 'Complete work order lifecycle management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No work order management' },
        zoho: { score: 6, label: 'Basic Orders', description: 'Simple work order tracking' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic task management' },
        odoo: { score: 8, label: 'Work Orders', description: 'Configurable work order management' }
      },
      {
        metric: 'BOM (Bill of Materials) Management',
        metricKey: 'manufacturing.metrics.bomManagement',
        salesforce: { score: 8, label: 'BOM Suite', description: 'Complete bill of materials management' },
        hubspot: { score: 2, label: 'Not Available', description: 'No BOM capabilities' },
        zoho: { score: 5, label: 'Basic BOM', description: 'Simple product structure tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No BOM features' },
        odoo: { score: 9, label: 'Full BOM', description: 'Complete bill of materials management' }
      },
      {
        metric: 'Production Cost Tracking & Analysis',
        metricKey: 'manufacturing.metrics.costTracking',
        salesforce: { score: 9, label: 'Cost Analytics', description: 'Advanced cost tracking and analysis' },
        hubspot: { score: 3, label: 'Not Available', description: 'No cost tracking' },
        zoho: { score: 6, label: 'Basic Costs', description: 'Simple cost tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic financial tracking' },
        odoo: { score: 9, label: 'Full Costing', description: 'Complete cost accounting suite' }
      },
      {
        metric: 'Regulatory Compliance & Documentation',
        metricKey: 'manufacturing.metrics.regulatoryCompliance',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete regulatory compliance management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic document management' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Supplier Relationship Management',
        metricKey: 'manufacturing.metrics.supplierManagement',
        salesforce: { score: 9, label: 'Supplier Suite', description: 'Complete supplier lifecycle management' },
        hubspot: { score: 5, label: 'Basic CRM', description: 'Simple contact management' },
        zoho: { score: 7, label: 'Good Suppliers', description: 'Supplier tracking and communication' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic vendor management' },
        odoo: { score: 8, label: 'Procurement Suite', description: 'Complete procurement management' }
      },
      {
        metric: 'Production Analytics & Performance Metrics',
        metricKey: 'manufacturing.metrics.productionAnalytics',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for production insights' },
        hubspot: { score: 4, label: 'Not Available', description: 'No production analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Production reporting and analytics' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic performance tracking' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Mobile Production Floor Management',
        metricKey: 'manufacturing.metrics.mobileProduction',
        salesforce: { score: 10, label: 'Mobile-First', description: 'Offline-capable mobile production app' },
        hubspot: { score: 4, label: 'Basic Mobile', description: 'Simple mobile interface' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile app for production' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile production app' }
      },
      {
        metric: 'Capacity Planning & Resource Optimization',
        metricKey: 'manufacturing.metrics.capacityPlanning',
        salesforce: { score: 9, label: 'Capacity Suite', description: 'AI-powered capacity planning and optimization' },
        hubspot: { score: 3, label: 'Not Available', description: 'No capacity planning' },
        zoho: { score: 6, label: 'Basic Planning', description: 'Simple capacity tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic resource management' },
        odoo: { score: 8, label: 'Capacity Module', description: 'Configurable capacity management' }
      },
      {
        metric: 'Product Lifecycle Management (PLM)',
        metricKey: 'manufacturing.metrics.productLifecycle',
        salesforce: { score: 8, label: 'PLM Integration', description: 'Product lifecycle management integration' },
        hubspot: { score: 3, label: 'Not Available', description: 'No PLM capabilities' },
        zoho: { score: 5, label: 'Basic PLM', description: 'Simple product tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No PLM features' },
        odoo: { score: 7, label: 'PLM Module', description: 'Configurable product lifecycle management' }
      },
      {
        metric: 'Environmental & Safety Compliance',
        metricKey: 'manufacturing.metrics.environmentalSafety',
        salesforce: { score: 8, label: 'EHS Suite', description: 'Environmental health and safety management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No EHS capabilities' },
        zoho: { score: 5, label: 'Basic EHS', description: 'Simple safety tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic incident management' },
        odoo: { score: 7, label: 'EHS Module', description: 'Configurable EHS management' }
      },
      {
        metric: 'Lean Manufacturing & Continuous Improvement',
        metricKey: 'manufacturing.metrics.leanManufacturing',
        salesforce: { score: 9, label: 'Lean Suite', description: 'Lean manufacturing and continuous improvement tools' },
        hubspot: { score: 3, label: 'Not Available', description: 'No lean capabilities' },
        zoho: { score: 6, label: 'Basic Lean', description: 'Simple improvement tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 7, label: 'Lean Module', description: 'Configurable lean management' }
      },
      {
        metric: 'Warranty & Service Management',
        metricKey: 'manufacturing.metrics.warrantyService',
        salesforce: { score: 10, label: 'Service Suite', description: 'Complete warranty and service management' },
        hubspot: { score: 5, label: 'Basic Service', description: 'Simple service tracking' },
        zoho: { score: 7, label: 'Good Service', description: 'Service management with warranty tracking' },
        freshworks: { score: 6, label: 'Service Focus', description: 'Service ticket management' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable service management' }
      }
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
      { value: '35%', description: 'improvement in customer retention' },
      { value: '50%', description: 'faster service activation' },
      { value: '40%', description: 'reduction in churn rate' },
      { value: '25%', description: 'increase in ARPU (Average Revenue Per User)' }
    ],
    keyChallenges: [
      'Complex network infrastructure',
      'High customer churn rates',
      'Service activation complexity',
      'Billing and payment management'
    ],
    painPoints: [
      'Fragmented customer communication channels',
      'Poor call center efficiency',
      'Manual case routing and management',
      'Inefficient customer interaction tracking'
    ],
    integrations: [
      'SAP',
      'Oracle',
      'Microsoft Dynamics',
      'ServiceNow',
      'Zendesk'
    ],
    dataSources: [
      'Customer databases',
      'Network management systems',
      'Billing platforms',
      'Service ticketing systems'
    ],
    marketSize: '$1.7 trillion globally',
    growthRate: '3.2% annually',
    comparisonMetrics: [
      {
        metric: 'Network Asset Management & Inventory',
        metricKey: 'telecom.metrics.networkAssets',
        salesforce: { score: 9, label: 'Asset Suite', description: 'Complete network asset lifecycle management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No asset management' },
        zoho: { score: 6, label: 'Basic Assets', description: 'Simple asset tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic inventory management' },
        odoo: { score: 8, label: 'Asset Module', description: 'Configurable asset management' }
      },
      {
        metric: 'Service Provisioning & Activation Automation',
        metricKey: 'telecom.metrics.serviceProvisioning',
        salesforce: { score: 10, label: 'Automation Suite', description: 'AI-powered service provisioning workflows' },
        hubspot: { score: 3, label: 'Not Available', description: 'No provisioning capabilities' },
        zoho: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic task automation' },
        odoo: { score: 7, label: 'Custom Workflows', description: 'Configurable provisioning processes' }
      },
      {
        metric: 'Customer Lifecycle Management',
        metricKey: 'telecom.metrics.customerLifecycle',
        salesforce: { score: 10, label: 'Lifecycle Suite', description: 'Complete customer journey management' },
        hubspot: { score: 8, label: 'Good Lifecycle', description: 'Customer journey tracking and automation' },
        zoho: { score: 7, label: 'Good CRM', description: 'Customer relationship management' },
        freshworks: { score: 6, label: 'Basic Lifecycle', description: 'Simple customer tracking' },
        odoo: { score: 8, label: 'Custom CRM', description: 'Configurable customer management' }
      },
      {
        metric: 'Billing & Payment Processing Integration',
        metricKey: 'telecom.metrics.billingPayment',
        salesforce: { score: 9, label: 'Billing Suite', description: 'Complete billing and payment management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No billing capabilities' },
        zoho: { score: 7, label: 'Good Billing', description: 'Billing and invoicing management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic payment tracking' },
        odoo: { score: 9, label: 'Full Accounting', description: 'Complete billing and accounting suite' }
      },
      {
        metric: 'Field Service Operations Management',
        metricKey: 'telecom.metrics.fieldService',
        salesforce: { score: 10, label: 'Field Service Suite', description: 'Complete field service management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No field service capabilities' },
        zoho: { score: 7, label: 'Good Service', description: 'Service management with scheduling' },
        freshworks: { score: 6, label: 'Service Focus', description: 'Service ticket management' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable field service management' }
      },
      {
        metric: 'Network Performance Monitoring',
        metricKey: 'telecom.metrics.networkMonitoring',
        salesforce: { score: 8, label: 'Monitoring Integration', description: 'Third-party network monitoring integration' },
        hubspot: { score: 3, label: 'Not Available', description: 'No monitoring capabilities' },
        zoho: { score: 6, label: 'Basic Monitoring', description: 'Simple performance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic system monitoring' },
        odoo: { score: 7, label: 'Custom Monitoring', description: 'Configurable monitoring workflows' }
      },
      {
        metric: 'Customer Support & Call Center Management',
        metricKey: 'telecom.metrics.callCenter',
        salesforce: { score: 10, label: 'Service Cloud', description: 'Complete call center and support management' },
        hubspot: { score: 6, label: 'Basic Support', description: 'Simple support ticket system' },
        zoho: { score: 8, label: 'Good Support', description: 'Call center and support management' },
        freshworks: { score: 9, label: 'Support Focus', description: 'Advanced support and ticketing system' },
        odoo: { score: 7, label: 'Support Module', description: 'Configurable support management' }
      },
      {
        metric: 'Churn Prediction & Retention Management',
        metricKey: 'telecom.metrics.churnPrediction',
        salesforce: { score: 10, label: 'AI Churn Prediction', description: 'Einstein AI for churn prediction and retention' },
        hubspot: { score: 6, label: 'Basic Analytics', description: 'Simple customer analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Customer behavior analytics' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer tracking' },
        odoo: { score: 7, label: 'Custom Analytics', description: 'Configurable customer analytics' }
      },
      {
        metric: 'Service Level Agreement (SLA) Management',
        metricKey: 'telecom.metrics.slaManagement',
        salesforce: { score: 9, label: 'SLA Suite', description: 'Complete SLA tracking and management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No SLA management' },
        zoho: { score: 6, label: 'Basic SLA', description: 'Simple SLA tracking' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic performance tracking' },
        odoo: { score: 7, label: 'SLA Module', description: 'Configurable SLA management' }
      },
      {
        metric: 'Mobile Network Optimization',
        metricKey: 'telecom.metrics.networkOptimization',
        salesforce: { score: 8, label: 'Optimization Tools', description: 'Network optimization and planning tools' },
        hubspot: { score: 3, label: 'Not Available', description: 'No network optimization' },
        zoho: { score: 5, label: 'Basic Tools', description: 'Simple optimization tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No network features' },
        odoo: { score: 6, label: 'Custom Tools', description: 'Configurable optimization workflows' }
      },
      {
        metric: 'Customer Self-Service Portal',
        metricKey: 'telecom.metrics.selfService',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete customer self-service portal' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple customer portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Customer self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused customer portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable customer portal' }
      },
      {
        metric: 'Revenue Assurance & Fraud Detection',
        metricKey: 'telecom.metrics.revenueAssurance',
        salesforce: { score: 9, label: 'Revenue Suite', description: 'Complete revenue assurance and fraud detection' },
        hubspot: { score: 3, label: 'Not Available', description: 'No revenue assurance' },
        zoho: { score: 5, label: 'Basic Analytics', description: 'Simple revenue tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic financial tracking' },
        odoo: { score: 7, label: 'Custom Analytics', description: 'Configurable revenue management' }
      },
      {
        metric: 'Network Capacity Planning',
        metricKey: 'telecom.metrics.capacityPlanning',
        salesforce: { score: 8, label: 'Planning Tools', description: 'Network capacity planning and forecasting' },
        hubspot: { score: 3, label: 'Not Available', description: 'No capacity planning' },
        zoho: { score: 5, label: 'Basic Planning', description: 'Simple capacity tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No planning features' },
        odoo: { score: 6, label: 'Custom Planning', description: 'Configurable capacity management' }
      },
      {
        metric: 'Trouble Ticket Management',
        metricKey: 'telecom.metrics.troubleTickets',
        salesforce: { score: 10, label: 'Ticket Suite', description: 'Complete trouble ticket lifecycle management' },
        hubspot: { score: 5, label: 'Basic Tickets', description: 'Simple ticket tracking' },
        zoho: { score: 7, label: 'Good Tickets', description: 'Ticket management with automation' },
        freshworks: { score: 9, label: 'Ticket Focus', description: 'Advanced ticket management system' },
        odoo: { score: 7, label: 'Ticket Module', description: 'Configurable ticket management' }
      },
      {
        metric: 'Service Quality Management',
        metricKey: 'telecom.metrics.serviceQuality',
        salesforce: { score: 9, label: 'Quality Suite', description: 'Complete service quality management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No quality management' },
        zoho: { score: 6, label: 'Basic Quality', description: 'Simple quality tracking' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic performance tracking' },
        odoo: { score: 7, label: 'Quality Module', description: 'Configurable quality management' }
      },
      {
        metric: 'Customer Experience Analytics',
        metricKey: 'telecom.metrics.customerExperience',
        salesforce: { score: 10, label: 'Experience Analytics', description: 'AI-powered customer experience insights' },
        hubspot: { score: 7, label: 'Good Analytics', description: 'Customer experience tracking' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Customer behavior analytics' },
        freshworks: { score: 6, label: 'Basic Analytics', description: 'Simple experience tracking' },
        odoo: { score: 7, label: 'Custom Analytics', description: 'Configurable experience analytics' }
      },
      {
        metric: 'Regulatory Compliance Management',
        metricKey: 'telecom.metrics.regulatoryCompliance',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete regulatory compliance management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Partner & Channel Management',
        metricKey: 'telecom.metrics.partnerManagement',
        salesforce: { score: 9, label: 'Partner Suite', description: 'Complete partner and channel management' },
        hubspot: { score: 6, label: 'Basic Partners', description: 'Simple partner tracking' },
        zoho: { score: 7, label: 'Good Partners', description: 'Partner relationship management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic partner tracking' },
        odoo: { score: 8, label: 'Partner Module', description: 'Configurable partner management' }
      }
    ]
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
      { value: '45%', description: 'improvement in client satisfaction' },
      { value: '30%', description: 'increase in cross-selling' },
      { value: '60%', description: 'faster loan processing' },
      { value: '25%', description: 'reduction in compliance costs' }
    ],
    keyChallenges: [
      'Regulatory compliance requirements',
      'Client data security',
      'Complex product offerings',
      'Digital transformation needs'
    ],
    painPoints: [
      'Complex regulatory compliance requirements',
      'Poor client relationship management',
      'Manual wealth management processes',
      'Inefficient risk assessment and reporting'
    ],
    integrations: [
      'SAP Banking',
      'Oracle Financial Services',
      'FISERV',
      'Fiserv',
      'Temenos'
    ],
    dataSources: [
      'Core banking systems',
      'Investment platforms',
      'Risk management systems',
      'Compliance databases'
    ],
    marketSize: '$2.5 trillion globally',
    growthRate: '5.5% annually',
    comparisonMetrics: [
      {
        metric: 'Client Relationship Management & Onboarding',
        metricKey: 'financial.metrics.clientOnboarding',
        salesforce: { score: 10, label: 'Full Onboarding Suite', description: 'Complete client onboarding with KYC/AML' },
        hubspot: { score: 6, label: 'Basic CRM', description: 'Simple contact management' },
        zoho: { score: 7, label: 'Good CRM', description: 'Client relationship management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic contact management' },
        odoo: { score: 8, label: 'Custom CRM', description: 'Configurable client management' }
      },
      {
        metric: 'Wealth Management & Portfolio Tracking',
        metricKey: 'financial.metrics.wealthManagement',
        salesforce: { score: 9, label: 'Wealth Suite', description: 'Complete wealth management and portfolio tracking' },
        hubspot: { score: 3, label: 'Not Available', description: 'No wealth management' },
        zoho: { score: 5, label: 'Basic Tracking', description: 'Simple portfolio tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No wealth features' },
        odoo: { score: 7, label: 'Custom Wealth', description: 'Configurable wealth management' }
      },
      {
        metric: 'Regulatory Compliance & Risk Management',
        metricKey: 'financial.metrics.regulatoryCompliance',
        salesforce: { score: 10, label: 'Compliance Suite', description: 'Complete regulatory compliance and risk management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Loan Processing & Credit Management',
        metricKey: 'financial.metrics.loanProcessing',
        salesforce: { score: 9, label: 'Loan Suite', description: 'Complete loan processing and credit management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No loan management' },
        zoho: { score: 6, label: 'Basic Loans', description: 'Simple loan tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic case management' },
        odoo: { score: 8, label: 'Loan Module', description: 'Configurable loan management' }
      },
      {
        metric: 'Insurance Policy Management',
        metricKey: 'financial.metrics.insurancePolicies',
        salesforce: { score: 9, label: 'Insurance Suite', description: 'Complete insurance policy lifecycle management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No insurance features' },
        zoho: { score: 6, label: 'Basic Policies', description: 'Simple policy tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic case management' },
        odoo: { score: 7, label: 'Policy Module', description: 'Configurable policy management' }
      },
      {
        metric: 'Anti-Money Laundering (AML) & KYC',
        metricKey: 'financial.metrics.amlKyc',
        salesforce: { score: 10, label: 'AML/KYC Suite', description: 'Complete AML and KYC compliance management' },
        hubspot: { score: 2, label: 'Not Available', description: 'No AML/KYC capabilities' },
        zoho: { score: 4, label: 'Basic KYC', description: 'Simple identity verification' },
        freshworks: { score: 3, label: 'Not Available', description: 'No compliance features' },
        odoo: { score: 6, label: 'Custom KYC', description: 'Configurable KYC workflows' }
      },
      {
        metric: 'Investment Advisory & Financial Planning',
        metricKey: 'financial.metrics.investmentAdvisory',
        salesforce: { score: 8, label: 'Advisory Tools', description: 'Investment advisory and financial planning tools' },
        hubspot: { score: 3, label: 'Not Available', description: 'No advisory features' },
        zoho: { score: 5, label: 'Basic Planning', description: 'Simple financial planning' },
        freshworks: { score: 3, label: 'Not Available', description: 'No advisory capabilities' },
        odoo: { score: 6, label: 'Custom Advisory', description: 'Configurable advisory tools' }
      },
      {
        metric: 'Digital Banking & Mobile Services',
        metricKey: 'financial.metrics.digitalBanking',
        salesforce: { score: 9, label: 'Digital Suite', description: 'Complete digital banking and mobile services' },
        hubspot: { score: 4, label: 'Not Available', description: 'No banking features' },
        zoho: { score: 6, label: 'Basic Mobile', description: 'Simple mobile interface' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic mobile access' },
        odoo: { score: 7, label: 'Custom Mobile', description: 'Configurable mobile banking' }
      },
      {
        metric: 'Fraud Detection & Security',
        metricKey: 'financial.metrics.fraudDetection',
        salesforce: { score: 9, label: 'Security Suite', description: 'Advanced fraud detection and security management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No fraud detection' },
        zoho: { score: 5, label: 'Basic Security', description: 'Simple security tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic security features' },
        odoo: { score: 6, label: 'Custom Security', description: 'Configurable security workflows' }
      },
      {
        metric: 'Customer Onboarding & KYC Automation',
        metricKey: 'financial.metrics.customerOnboarding',
        salesforce: { score: 10, label: 'Automated Onboarding', description: 'AI-powered customer onboarding and KYC automation' },
        hubspot: { score: 4, label: 'Not Available', description: 'No onboarding automation' },
        zoho: { score: 6, label: 'Basic Onboarding', description: 'Simple customer setup' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic customer management' },
        odoo: { score: 7, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Investment Performance Analytics',
        metricKey: 'financial.metrics.investmentAnalytics',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for investment performance' },
        hubspot: { score: 4, label: 'Not Available', description: 'No investment analytics' },
        zoho: { score: 6, label: 'Basic Analytics', description: 'Simple performance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic reporting' },
        odoo: { score: 7, label: 'Custom Analytics', description: 'Configurable investment analytics' }
      },
      {
        metric: 'Regulatory Reporting & Documentation',
        metricKey: 'financial.metrics.regulatoryReporting',
        salesforce: { score: 9, label: 'Reporting Suite', description: 'Complete regulatory reporting and documentation' },
        hubspot: { score: 3, label: 'Not Available', description: 'No regulatory reporting' },
        zoho: { score: 5, label: 'Basic Reporting', description: 'Simple report generation' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic document management' },
        odoo: { score: 7, label: 'Custom Reporting', description: 'Configurable reporting workflows' }
      },
      {
        metric: 'Client Communication & Document Management',
        metricKey: 'financial.metrics.clientCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete client communication and document management' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Client communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Trading & Transaction Management',
        metricKey: 'financial.metrics.tradingTransactions',
        salesforce: { score: 8, label: 'Trading Integration', description: 'Trading platform integration and transaction management' },
        hubspot: { score: 2, label: 'Not Available', description: 'No trading capabilities' },
        zoho: { score: 5, label: 'Basic Trading', description: 'Simple transaction tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No trading features' },
        odoo: { score: 6, label: 'Custom Trading', description: 'Configurable trading workflows' }
      },
      {
        metric: 'Risk Assessment & Monitoring',
        metricKey: 'financial.metrics.riskAssessment',
        salesforce: { score: 9, label: 'Risk Suite', description: 'Complete risk assessment and monitoring' },
        hubspot: { score: 3, label: 'Not Available', description: 'No risk management' },
        zoho: { score: 6, label: 'Basic Risk', description: 'Simple risk tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic risk management' },
        odoo: { score: 7, label: 'Risk Module', description: 'Configurable risk management' }
      },
      {
        metric: 'Client Portal & Self-Service',
        metricKey: 'financial.metrics.clientPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete client self-service portal' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple client portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Client self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused client portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable client portal' }
      },
      {
        metric: 'Compliance Audit & Documentation',
        metricKey: 'financial.metrics.complianceAudit',
        salesforce: { score: 9, label: 'Audit Suite', description: 'Complete compliance audit and documentation' },
        hubspot: { score: 3, label: 'Not Available', description: 'No audit capabilities' },
        zoho: { score: 5, label: 'Basic Audit', description: 'Simple audit tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic documentation' },
        odoo: { score: 7, label: 'Custom Audit', description: 'Configurable audit workflows' }
      },
      {
        metric: 'Multi-Currency & International Banking',
        metricKey: 'financial.metrics.multiCurrency',
        salesforce: { score: 8, label: 'Currency Suite', description: 'Multi-currency and international banking support' },
        hubspot: { score: 3, label: 'Not Available', description: 'No currency features' },
        zoho: { score: 6, label: 'Basic Currency', description: 'Simple currency tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No currency capabilities' },
        odoo: { score: 8, label: 'Currency Module', description: 'Configurable multi-currency support' }
      }
    ]
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
      { value: '50%', description: 'increase in online sales' },
      { value: '35%', description: 'improvement in customer lifetime value' },
      { value: '40%', description: 'increase in email open rates' },
      { value: '25%', description: 'reduction in cart abandonment' }
    ],
    keyChallenges: [
      'Omnichannel customer experience',
      'Inventory management across channels',
      'Personalization at scale',
      'Seasonal demand fluctuations'
    ],
    painPoints: [
      'Disconnected online and offline experiences',
      'Poor inventory management across channels',
      'Manual customer service processes',
      'Inefficient loyalty program management'
    ],
    integrations: [
      'Shopify',
      'Magento',
      'WooCommerce',
      'BigCommerce',
      'Amazon'
    ],
    dataSources: [
      'E-commerce platforms',
      'POS systems',
      'Inventory management',
      'Customer databases'
    ],
    marketSize: '$4.9 trillion globally',
    growthRate: '7.2% annually',
    comparisonMetrics: [
      {
        metric: 'Omnichannel Customer Experience Management',
        metricKey: 'retail.metrics.omnichannelExperience',
        salesforce: { score: 10, label: 'Full Omnichannel', description: 'Complete unified customer experience across all channels' },
        hubspot: { score: 7, label: 'Good Omnichannel', description: 'Multi-channel customer engagement' },
        zoho: { score: 7, label: 'Good Omnichannel', description: 'Unified customer experience' },
        freshworks: { score: 6, label: 'Basic Omnichannel', description: 'Multi-channel support' },
        odoo: { score: 8, label: 'Custom Omnichannel', description: 'Configurable omnichannel experience' }
      },
      {
        metric: 'E-commerce Platform Integration',
        metricKey: 'retail.metrics.ecommerceIntegration',
        salesforce: { score: 10, label: 'Native Commerce', description: 'Built-in Commerce Cloud with full integration' },
        hubspot: { score: 6, label: 'Basic Integration', description: 'Simple e-commerce integration' },
        zoho: { score: 7, label: 'Good Integration', description: 'E-commerce platform integration' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic e-commerce support' },
        odoo: { score: 9, label: 'Full E-commerce', description: 'Complete e-commerce management suite' }
      },
      {
        metric: 'Personalized Marketing & Recommendations',
        metricKey: 'retail.metrics.personalizedMarketing',
        salesforce: { score: 10, label: 'AI Personalization', description: 'Einstein AI for personalized marketing and recommendations' },
        hubspot: { score: 8, label: 'Good Personalization', description: 'Advanced personalization features' },
        zoho: { score: 7, label: 'Good Personalization', description: 'Customer personalization tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic personalization' },
        odoo: { score: 7, label: 'Custom Personalization', description: 'Configurable personalization rules' }
      },
      {
        metric: 'Inventory Management & Stock Optimization',
        metricKey: 'retail.metrics.inventoryManagement',
        salesforce: { score: 9, label: 'Smart Inventory', description: 'AI-powered inventory optimization and management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No inventory management' },
        zoho: { score: 7, label: 'Good Inventory', description: 'Inventory tracking and management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic inventory tracking' },
        odoo: { score: 9, label: 'Full Inventory', description: 'Complete inventory management suite' }
      },
      {
        metric: 'Order Management & Fulfillment',
        metricKey: 'retail.metrics.orderManagement',
        salesforce: { score: 10, label: 'Order Orchestration', description: 'Complete order lifecycle management and fulfillment' },
        hubspot: { score: 5, label: 'Basic Orders', description: 'Simple order tracking' },
        zoho: { score: 8, label: 'Good Orders', description: 'Order management with fulfillment' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic order tracking' },
        odoo: { score: 9, label: 'Full Orders', description: 'Complete order to cash process' }
      },
      {
        metric: 'Customer Loyalty & Rewards Management',
        metricKey: 'retail.metrics.loyaltyManagement',
        salesforce: { score: 9, label: 'Loyalty Suite', description: 'Complete loyalty program management' },
        hubspot: { score: 6, label: 'Basic Loyalty', description: 'Simple loyalty tracking' },
        zoho: { score: 7, label: 'Good Loyalty', description: 'Customer loyalty management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer tracking' },
        odoo: { score: 8, label: 'Custom Loyalty', description: 'Configurable loyalty programs' }
      },
      {
        metric: 'Mobile Commerce & App Management',
        metricKey: 'retail.metrics.mobileCommerce',
        salesforce: { score: 10, label: 'Mobile-First', description: 'Native mobile commerce and app management' },
        hubspot: { score: 5, label: 'Basic Mobile', description: 'Simple mobile interface' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile commerce capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile commerce' }
      },
      {
        metric: 'Customer Service & Support',
        metricKey: 'retail.metrics.customerService',
        salesforce: { score: 10, label: 'Service Cloud', description: 'Complete customer service and support management' },
        hubspot: { score: 7, label: 'Good Service', description: 'Customer service tools' },
        zoho: { score: 8, label: 'Good Service', description: 'Customer service management' },
        freshworks: { score: 9, label: 'Service Focus', description: 'Advanced customer service platform' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable service management' }
      },
      {
        metric: 'Analytics & Business Intelligence',
        metricKey: 'retail.metrics.analytics',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for retail insights' },
        hubspot: { score: 7, label: 'Good Analytics', description: 'Customer and sales analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Business intelligence and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Payment Processing & Checkout',
        metricKey: 'retail.metrics.paymentProcessing',
        salesforce: { score: 9, label: 'Payment Suite', description: 'Complete payment processing and checkout management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No payment processing' },
        zoho: { score: 7, label: 'Good Payments', description: 'Payment processing integration' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic payment tracking' },
        odoo: { score: 8, label: 'Full Payments', description: 'Complete payment and accounting suite' }
      },
      {
        metric: 'Product Catalog Management',
        metricKey: 'retail.metrics.productCatalog',
        salesforce: { score: 9, label: 'Catalog Suite', description: 'Complete product catalog management' },
        hubspot: { score: 5, label: 'Basic Catalog', description: 'Simple product management' },
        zoho: { score: 7, label: 'Good Catalog', description: 'Product catalog management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic product tracking' },
        odoo: { score: 8, label: 'Full Catalog', description: 'Complete product management suite' }
      },
      {
        metric: 'Customer Segmentation & Targeting',
        metricKey: 'retail.metrics.customerSegmentation',
        salesforce: { score: 10, label: 'AI Segmentation', description: 'AI-powered customer segmentation and targeting' },
        hubspot: { score: 8, label: 'Good Segmentation', description: 'Advanced customer segmentation' },
        zoho: { score: 7, label: 'Good Segmentation', description: 'Customer segmentation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer grouping' },
        odoo: { score: 7, label: 'Custom Segmentation', description: 'Configurable customer segmentation' }
      },
      {
        metric: 'Returns & Refunds Management',
        metricKey: 'retail.metrics.returnsRefunds',
        salesforce: { score: 9, label: 'Returns Suite', description: 'Complete returns and refunds management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No returns management' },
        zoho: { score: 6, label: 'Basic Returns', description: 'Simple returns tracking' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic case management' },
        odoo: { score: 8, label: 'Returns Module', description: 'Configurable returns management' }
      },
      {
        metric: 'Multi-Store & Location Management',
        metricKey: 'retail.metrics.multiStore',
        salesforce: { score: 9, label: 'Multi-Store Suite', description: 'Complete multi-store and location management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No multi-store features' },
        zoho: { score: 6, label: 'Basic Multi-Store', description: 'Simple location tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic location management' },
        odoo: { score: 8, label: 'Multi-Store Module', description: 'Configurable multi-store management' }
      },
      {
        metric: 'Seasonal & Promotional Campaigns',
        metricKey: 'retail.metrics.seasonalCampaigns',
        salesforce: { score: 9, label: 'Campaign Suite', description: 'Complete seasonal and promotional campaign management' },
        hubspot: { score: 8, label: 'Good Campaigns', description: 'Advanced marketing campaigns' },
        zoho: { score: 7, label: 'Good Campaigns', description: 'Marketing campaign management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic campaign tracking' },
        odoo: { score: 7, label: 'Custom Campaigns', description: 'Configurable campaign management' }
      },
      {
        metric: 'Customer Feedback & Reviews Management',
        metricKey: 'retail.metrics.feedbackReviews',
        salesforce: { score: 9, label: 'Feedback Suite', description: 'Complete customer feedback and reviews management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Customer feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Customer feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Supply Chain & Vendor Management',
        metricKey: 'retail.metrics.supplyChain',
        salesforce: { score: 8, label: 'Supply Chain Suite', description: 'Complete supply chain and vendor management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No supply chain management' },
        zoho: { score: 7, label: 'Good Supply Chain', description: 'Supply chain management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic vendor management' },
        odoo: { score: 9, label: 'Full Supply Chain', description: 'Complete supply chain management suite' }
      },
      {
        metric: 'Cross-Channel Data Synchronization',
        metricKey: 'retail.metrics.dataSynchronization',
        salesforce: { score: 10, label: 'Real-Time Sync', description: 'Real-time data synchronization across all channels' },
        hubspot: { score: 6, label: 'Basic Sync', description: 'Simple data synchronization' },
        zoho: { score: 7, label: 'Good Sync', description: 'Multi-channel data sync' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic data integration' },
        odoo: { score: 8, label: 'Custom Sync', description: 'Configurable data synchronization' }
      }
    ]
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
      { value: '40%', description: 'increase in average order value' },
      { value: '30%', description: 'faster quote-to-cash cycles' },
      { value: '50%', description: 'improvement in sales productivity' },
      { value: '25%', description: 'reduction in pricing errors' }
    ],
    keyChallenges: [
      'Complex pricing structures',
      'Long sales cycles',
      'Account-based selling',
      'Integration with ERP systems'
    ],
    painPoints: [
      'Complex B2B sales processes',
      'Manual quote and order management',
      'Poor customer self-service',
      'Integration with ERP systems'
    ],
    integrations: [
      'SAP Ariba',
      'Oracle Procurement',
      'Coupa',
      'Jaggaer',
      'Basware'
    ],
    dataSources: [
      'Procurement systems',
      'Supplier databases',
      'Contract management',
      'Pricing systems'
    ],
    marketSize: '$1.2 trillion globally',
    growthRate: '8.5% annually',
    comparisonMetrics: [
      {
        metric: 'B2B Catalog Management & Product Configuration',
        metricKey: 'b2b.metrics.catalogManagement',
        salesforce: { score: 10, label: 'Full B2B Catalog', description: 'Complete B2B catalog with product configuration' },
        hubspot: { score: 4, label: 'Not Available', description: 'No B2B catalog management' },
        zoho: { score: 6, label: 'Basic Catalog', description: 'Simple product catalog' },
        freshworks: { score: 3, label: 'Not Available', description: 'No catalog features' },
        odoo: { score: 8, label: 'Full Catalog', description: 'Complete product catalog management' }
      },
      {
        metric: 'Quote & Proposal Management',
        metricKey: 'b2b.metrics.quoteProposal',
        salesforce: { score: 10, label: 'Quote Suite', description: 'Complete quote and proposal management' },
        hubspot: { score: 5, label: 'Basic Quotes', description: 'Simple quote generation' },
        zoho: { score: 7, label: 'Good Quotes', description: 'Quote management with templates' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic quote tracking' },
        odoo: { score: 8, label: 'Quote Module', description: 'Configurable quote management' }
      },
      {
        metric: 'Account-Based Selling & Territory Management',
        metricKey: 'b2b.metrics.accountBasedSelling',
        salesforce: { score: 10, label: 'ABS Suite', description: 'Complete account-based selling and territory management' },
        hubspot: { score: 7, label: 'Good ABS', description: 'Account-based marketing and selling' },
        zoho: { score: 7, label: 'Good ABS', description: 'Account management and territory planning' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic account management' },
        odoo: { score: 8, label: 'Custom ABS', description: 'Configurable account-based selling' }
      },
      {
        metric: 'Bulk Order Processing & Approval Workflows',
        metricKey: 'b2b.metrics.bulkOrderProcessing',
        salesforce: { score: 9, label: 'Bulk Order Suite', description: 'Complete bulk order processing with approval workflows' },
        hubspot: { score: 3, label: 'Not Available', description: 'No bulk order processing' },
        zoho: { score: 6, label: 'Basic Bulk', description: 'Simple bulk order handling' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic order management' },
        odoo: { score: 8, label: 'Bulk Orders', description: 'Configurable bulk order processing' }
      },
      {
        metric: 'Contract & Pricing Management',
        metricKey: 'b2b.metrics.contractPricing',
        salesforce: { score: 9, label: 'Contract Suite', description: 'Complete contract and pricing management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No contract management' },
        zoho: { score: 6, label: 'Basic Contracts', description: 'Simple contract tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic document management' },
        odoo: { score: 8, label: 'Contract Module', description: 'Configurable contract management' }
      },
      {
        metric: 'Customer Self-Service Portal',
        metricKey: 'b2b.metrics.selfServicePortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete B2B customer self-service portal' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple customer portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Customer self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable customer portal' }
      },
      {
        metric: 'ERP Integration & Data Synchronization',
        metricKey: 'b2b.metrics.erpIntegration',
        salesforce: { score: 10, label: 'Full ERP Integration', description: 'Complete ERP integration and data synchronization' },
        hubspot: { score: 4, label: 'Not Available', description: 'No ERP integration' },
        zoho: { score: 7, label: 'Good Integration', description: 'ERP integration capabilities' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic integration' },
        odoo: { score: 9, label: 'Native ERP', description: 'Built-in ERP with full integration' }
      },
      {
        metric: 'Multi-Level Pricing & Discount Management',
        metricKey: 'b2b.metrics.pricingDiscounts',
        salesforce: { score: 10, label: 'Pricing Suite', description: 'Complete multi-level pricing and discount management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No pricing management' },
        zoho: { score: 6, label: 'Basic Pricing', description: 'Simple pricing management' },
        freshworks: { score: 3, label: 'Not Available', description: 'No pricing features' },
        odoo: { score: 8, label: 'Pricing Module', description: 'Configurable pricing management' }
      },
      {
        metric: 'Supplier & Vendor Management',
        metricKey: 'b2b.metrics.supplierManagement',
        salesforce: { score: 9, label: 'Supplier Suite', description: 'Complete supplier and vendor management' },
        hubspot: { score: 5, label: 'Basic CRM', description: 'Simple contact management' },
        zoho: { score: 7, label: 'Good Suppliers', description: 'Supplier relationship management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic vendor management' },
        odoo: { score: 9, label: 'Procurement Suite', description: 'Complete procurement management' }
      },
      {
        metric: 'Credit Management & Payment Terms',
        metricKey: 'b2b.metrics.creditManagement',
        salesforce: { score: 9, label: 'Credit Suite', description: 'Complete credit management and payment terms' },
        hubspot: { score: 3, label: 'Not Available', description: 'No credit management' },
        zoho: { score: 6, label: 'Basic Credit', description: 'Simple credit tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No credit features' },
        odoo: { score: 8, label: 'Credit Module', description: 'Configurable credit management' }
      },
      {
        metric: 'Sales Territory & Channel Management',
        metricKey: 'b2b.metrics.territoryChannel',
        salesforce: { score: 10, label: 'Territory Suite', description: 'Complete sales territory and channel management' },
        hubspot: { score: 6, label: 'Basic Territory', description: 'Simple territory assignment' },
        zoho: { score: 7, label: 'Good Territory', description: 'Territory and channel management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic territory tracking' },
        odoo: { score: 8, label: 'Territory Module', description: 'Configurable territory management' }
      },
      {
        metric: 'B2B Analytics & Reporting',
        metricKey: 'b2b.metrics.analyticsReporting',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for B2B insights' },
        hubspot: { score: 7, label: 'Good Analytics', description: 'Sales and marketing analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Business intelligence and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Customer Onboarding & Setup',
        metricKey: 'b2b.metrics.customerOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete B2B customer onboarding and setup' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple customer setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Customer onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Multi-Currency & International Support',
        metricKey: 'b2b.metrics.multiCurrency',
        salesforce: { score: 9, label: 'Currency Suite', description: 'Complete multi-currency and international support' },
        hubspot: { score: 4, label: 'Not Available', description: 'No multi-currency support' },
        zoho: { score: 7, label: 'Good Currency', description: 'Multi-currency support' },
        freshworks: { score: 3, label: 'Not Available', description: 'No currency features' },
        odoo: { score: 8, label: 'Currency Module', description: 'Configurable multi-currency support' }
      },
      {
        metric: 'Compliance & Regulatory Management',
        metricKey: 'b2b.metrics.complianceRegulatory',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete compliance and regulatory management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Mobile B2B Commerce',
        metricKey: 'b2b.metrics.mobileCommerce',
        salesforce: { score: 9, label: 'Mobile B2B', description: 'Complete mobile B2B commerce capabilities' },
        hubspot: { score: 5, label: 'Basic Mobile', description: 'Simple mobile interface' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile commerce capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile commerce' }
      },
      {
        metric: 'Customer Communication & Collaboration',
        metricKey: 'b2b.metrics.communicationCollaboration',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete customer communication and collaboration' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Customer communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'b2b.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
      { value: '35%', description: 'improvement in project profitability' },
      { value: '40%', description: 'increase in billable hours' },
      { value: '30%', description: 'faster project delivery' },
      { value: '50%', description: 'improvement in client satisfaction' }
    ],
    keyChallenges: [
      'Resource allocation and utilization',
      'Project profitability tracking',
      'Client relationship management',
      'Knowledge sharing and collaboration'
    ],
    painPoints: [
      'Poor project resource allocation',
      'Manual time and expense tracking',
      'Inefficient client communication',
      'Fragmented knowledge management'
    ],
    integrations: [
      'Microsoft Project',
      'Asana',
      'Monday.com',
      'Smartsheet',
      'Jira'
    ],
    dataSources: [
      'Project management systems',
      'Time tracking tools',
      'Client databases',
      'Financial systems'
    ],
    marketSize: '$4.2 trillion globally',
    growthRate: '6.1% annually',
    comparisonMetrics: [
      {
        metric: 'Project & Resource Management',
        metricKey: 'professional.metrics.projectManagement',
        salesforce: { score: 9, label: 'Project Suite', description: 'Complete project and resource management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No project management' },
        zoho: { score: 7, label: 'Good Projects', description: 'Project management with resource planning' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic project tracking' },
        odoo: { score: 8, label: 'Project Module', description: 'Configurable project management' }
      },
      {
        metric: 'Time & Expense Tracking',
        metricKey: 'professional.metrics.timeExpense',
        salesforce: { score: 9, label: 'Time Suite', description: 'Complete time and expense tracking' },
        hubspot: { score: 3, label: 'Not Available', description: 'No time tracking' },
        zoho: { score: 7, label: 'Good Time', description: 'Time tracking and expense management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic time tracking' },
        odoo: { score: 8, label: 'Time Module', description: 'Configurable time and expense tracking' }
      },
      {
        metric: 'Client Relationship Management',
        metricKey: 'professional.metrics.clientRelationship',
        salesforce: { score: 10, label: 'Client Suite', description: 'Complete client relationship management' },
        hubspot: { score: 8, label: 'Good CRM', description: 'Advanced client relationship management' },
        zoho: { score: 7, label: 'Good CRM', description: 'Client relationship management' },
        freshworks: { score: 6, label: 'Basic CRM', description: 'Simple client management' },
        odoo: { score: 8, label: 'Custom CRM', description: 'Configurable client management' }
      },
      {
        metric: 'Knowledge Management & Collaboration',
        metricKey: 'professional.metrics.knowledgeManagement',
        salesforce: { score: 9, label: 'Knowledge Suite', description: 'Complete knowledge management and collaboration' },
        hubspot: { score: 6, label: 'Basic Knowledge', description: 'Simple knowledge base' },
        zoho: { score: 7, label: 'Good Knowledge', description: 'Knowledge management system' },
        freshworks: { score: 6, label: 'Knowledge Focus', description: 'Knowledge base and support' },
        odoo: { score: 7, label: 'Knowledge Module', description: 'Configurable knowledge management' }
      },
      {
        metric: 'Client Portal & Self-Service',
        metricKey: 'professional.metrics.clientPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete client portal and self-service' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple client portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Client self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused client portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable client portal' }
      },
      {
        metric: 'Billing & Invoicing Management',
        metricKey: 'professional.metrics.billingInvoicing',
        salesforce: { score: 9, label: 'Billing Suite', description: 'Complete billing and invoicing management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No billing capabilities' },
        zoho: { score: 7, label: 'Good Billing', description: 'Billing and invoicing management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic billing tracking' },
        odoo: { score: 9, label: 'Full Billing', description: 'Complete billing and accounting suite' }
      },
      {
        metric: 'Resource Allocation & Utilization',
        metricKey: 'professional.metrics.resourceAllocation',
        salesforce: { score: 9, label: 'Resource Suite', description: 'Complete resource allocation and utilization' },
        hubspot: { score: 3, label: 'Not Available', description: 'No resource management' },
        zoho: { score: 6, label: 'Basic Resources', description: 'Simple resource tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic resource management' },
        odoo: { score: 8, label: 'Resource Module', description: 'Configurable resource management' }
      },
      {
        metric: 'Project Profitability & Analytics',
        metricKey: 'professional.metrics.projectProfitability',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for project profitability' },
        hubspot: { score: 4, label: 'Not Available', description: 'No profitability analytics' },
        zoho: { score: 6, label: 'Basic Analytics', description: 'Simple project analytics' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic reporting' },
        odoo: { score: 8, label: 'Full Analytics', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Client Communication & Collaboration',
        metricKey: 'professional.metrics.clientCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete client communication and collaboration' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Client communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Document Management & Version Control',
        metricKey: 'professional.metrics.documentManagement',
        salesforce: { score: 9, label: 'Document Suite', description: 'Complete document management and version control' },
        hubspot: { score: 5, label: 'Basic Documents', description: 'Simple document storage' },
        zoho: { score: 7, label: 'Good Documents', description: 'Document management system' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic document storage' },
        odoo: { score: 8, label: 'Document Module', description: 'Configurable document management' }
      },
      {
        metric: 'Team Collaboration & Communication',
        metricKey: 'professional.metrics.teamCollaboration',
        salesforce: { score: 8, label: 'Collaboration Suite', description: 'Complete team collaboration and communication' },
        hubspot: { score: 6, label: 'Basic Collaboration', description: 'Simple team communication' },
        zoho: { score: 7, label: 'Good Collaboration', description: 'Team collaboration tools' },
        freshworks: { score: 6, label: 'Collaboration Focus', description: 'Team communication and support' },
        odoo: { score: 7, label: 'Custom Collaboration', description: 'Configurable collaboration tools' }
      },
      {
        metric: 'Client Onboarding & Setup',
        metricKey: 'professional.metrics.clientOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete client onboarding and setup' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple client setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Client onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic client management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Project Templates & Workflows',
        metricKey: 'professional.metrics.projectTemplates',
        salesforce: { score: 9, label: 'Template Suite', description: 'Complete project templates and workflows' },
        hubspot: { score: 4, label: 'Not Available', description: 'No project templates' },
        zoho: { score: 6, label: 'Basic Templates', description: 'Simple project templates' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic workflow management' },
        odoo: { score: 8, label: 'Template Module', description: 'Configurable project templates' }
      },
      {
        metric: 'Client Satisfaction & Feedback',
        metricKey: 'professional.metrics.clientSatisfaction',
        salesforce: { score: 9, label: 'Satisfaction Suite', description: 'Complete client satisfaction and feedback management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Client feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Client feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Compliance & Audit Management',
        metricKey: 'professional.metrics.complianceAudit',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete compliance and audit management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Mobile Time Tracking & Field Management',
        metricKey: 'professional.metrics.mobileTimeTracking',
        salesforce: { score: 9, label: 'Mobile Suite', description: 'Complete mobile time tracking and field management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No mobile time tracking' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile time tracking capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile time tracking' }
      },
      {
        metric: 'Client Reporting & Dashboards',
        metricKey: 'professional.metrics.clientReporting',
        salesforce: { score: 10, label: 'Reporting Suite', description: 'Complete client reporting and dashboards' },
        hubspot: { score: 6, label: 'Basic Reporting', description: 'Simple reporting tools' },
        zoho: { score: 7, label: 'Good Reporting', description: 'Client reporting and dashboards' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic reporting' },
        odoo: { score: 8, label: 'Full Reporting', description: 'Complete reporting and analytics suite' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'professional.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
      { value: '30%', description: 'increase in vehicle sales' },
      { value: '40%', description: 'improvement in service efficiency' },
      { value: '25%', description: 'increase in customer retention' },
      { value: '35%', description: 'reduction in service costs' }
    ],
    keyChallenges: [
      'Complex supply chain management',
      'Dealership network coordination',
      'Service and maintenance scheduling',
      'Customer loyalty and retention'
    ],
    painPoints: [
      'Disconnected production and sales data',
      'Poor supply chain visibility',
      'Manual quality control processes',
      'Inefficient equipment maintenance scheduling'
    ],
    integrations: [
      'SAP Automotive',
      'Oracle Automotive',
      'DealerSocket',
      'CDK Global',
      'Reynolds & Reynolds'
    ],
    dataSources: [
      'Dealer management systems',
      'Parts inventory systems',
      'Service scheduling',
      'Customer databases'
    ],
    marketSize: '$2.7 trillion globally',
    growthRate: '3.8% annually',
    comparisonMetrics: [
      {
        metric: 'Dealership Management & Operations',
        metricKey: 'automotive.metrics.dealershipManagement',
        salesforce: { score: 9, label: 'Dealership Suite', description: 'Complete dealership management and operations' },
        hubspot: { score: 4, label: 'Not Available', description: 'No dealership management' },
        zoho: { score: 6, label: 'Basic Dealership', description: 'Simple dealership tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic location management' },
        odoo: { score: 8, label: 'Dealership Module', description: 'Configurable dealership management' }
      },
      {
        metric: 'Vehicle Sales & Leasing Management',
        metricKey: 'automotive.metrics.vehicleSales',
        salesforce: { score: 10, label: 'Sales Suite', description: 'Complete vehicle sales and leasing management' },
        hubspot: { score: 6, label: 'Basic Sales', description: 'Simple sales tracking' },
        zoho: { score: 7, label: 'Good Sales', description: 'Sales management with leasing' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic sales tracking' },
        odoo: { score: 8, label: 'Sales Module', description: 'Configurable sales management' }
      },
      {
        metric: 'Service & Maintenance Management',
        metricKey: 'automotive.metrics.serviceMaintenance',
        salesforce: { score: 10, label: 'Service Suite', description: 'Complete service and maintenance management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No service management' },
        zoho: { score: 7, label: 'Good Service', description: 'Service management with scheduling' },
        freshworks: { score: 6, label: 'Service Focus', description: 'Service ticket management' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable service management' }
      },
      {
        metric: 'Parts & Inventory Management',
        metricKey: 'automotive.metrics.partsInventory',
        salesforce: { score: 9, label: 'Parts Suite', description: 'Complete parts and inventory management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No inventory management' },
        zoho: { score: 7, label: 'Good Inventory', description: 'Parts inventory management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic inventory tracking' },
        odoo: { score: 9, label: 'Full Inventory', description: 'Complete inventory management suite' }
      },
      {
        metric: 'Customer Loyalty & Retention Programs',
        metricKey: 'automotive.metrics.customerLoyalty',
        salesforce: { score: 9, label: 'Loyalty Suite', description: 'Complete customer loyalty and retention programs' },
        hubspot: { score: 6, label: 'Basic Loyalty', description: 'Simple loyalty tracking' },
        zoho: { score: 7, label: 'Good Loyalty', description: 'Customer loyalty management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer tracking' },
        odoo: { score: 8, label: 'Custom Loyalty', description: 'Configurable loyalty programs' }
      },
      {
        metric: 'Vehicle Configuration & Customization',
        metricKey: 'automotive.metrics.vehicleConfiguration',
        salesforce: { score: 8, label: 'Configuration Suite', description: 'Complete vehicle configuration and customization' },
        hubspot: { score: 3, label: 'Not Available', description: 'No configuration features' },
        zoho: { score: 5, label: 'Basic Config', description: 'Simple configuration tracking' },
        freshworks: { score: 3, label: 'Not Available', description: 'No configuration features' },
        odoo: { score: 7, label: 'Config Module', description: 'Configurable vehicle management' }
      },
      {
        metric: 'Warranty & Service Contract Management',
        metricKey: 'automotive.metrics.warrantyService',
        salesforce: { score: 9, label: 'Warranty Suite', description: 'Complete warranty and service contract management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No warranty management' },
        zoho: { score: 6, label: 'Basic Warranty', description: 'Simple warranty tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic contract management' },
        odoo: { score: 8, label: 'Warranty Module', description: 'Configurable warranty management' }
      },
      {
        metric: 'Customer Communication & Support',
        metricKey: 'automotive.metrics.customerCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete customer communication and support' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Customer communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Mobile Service & Field Management',
        metricKey: 'automotive.metrics.mobileService',
        salesforce: { score: 10, label: 'Mobile Suite', description: 'Complete mobile service and field management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No mobile service capabilities' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile service capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile service management' }
      },
      {
        metric: 'Analytics & Performance Monitoring',
        metricKey: 'automotive.metrics.analyticsPerformance',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for automotive insights' },
        hubspot: { score: 6, label: 'Basic Analytics', description: 'Simple sales analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Business intelligence and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Supply Chain & Vendor Management',
        metricKey: 'automotive.metrics.supplyChain',
        salesforce: { score: 9, label: 'Supply Chain Suite', description: 'Complete supply chain and vendor management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No supply chain management' },
        zoho: { score: 7, label: 'Good Supply Chain', description: 'Supply chain management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic vendor management' },
        odoo: { score: 9, label: 'Full Supply Chain', description: 'Complete supply chain management suite' }
      },
      {
        metric: 'Quality Control & Compliance',
        metricKey: 'automotive.metrics.qualityControl',
        salesforce: { score: 9, label: 'Quality Suite', description: 'Complete quality control and compliance' },
        hubspot: { score: 3, label: 'Not Available', description: 'No quality management' },
        zoho: { score: 6, label: 'Basic Quality', description: 'Simple quality tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic issue tracking' },
        odoo: { score: 8, label: 'Quality Module', description: 'Configurable quality management' }
      },
      {
        metric: 'Customer Portal & Self-Service',
        metricKey: 'automotive.metrics.customerPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete customer portal and self-service' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple customer portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Customer self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused customer portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable customer portal' }
      },
      {
        metric: 'Multi-Location & Network Management',
        metricKey: 'automotive.metrics.multiLocation',
        salesforce: { score: 9, label: 'Network Suite', description: 'Complete multi-location and network management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No multi-location features' },
        zoho: { score: 6, label: 'Basic Multi-Location', description: 'Simple location tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic location management' },
        odoo: { score: 8, label: 'Multi-Location Module', description: 'Configurable multi-location management' }
      },
      {
        metric: 'Customer Onboarding & Setup',
        metricKey: 'automotive.metrics.customerOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete customer onboarding and setup' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple customer setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Customer onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Compliance & Regulatory Management',
        metricKey: 'automotive.metrics.complianceRegulatory',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete compliance and regulatory management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Customer Feedback & Reviews Management',
        metricKey: 'automotive.metrics.customerFeedback',
        salesforce: { score: 9, label: 'Feedback Suite', description: 'Complete customer feedback and reviews management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Customer feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Customer feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'automotive.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
      { value: '45%', description: 'increase in customer loyalty' },
      { value: '30%', description: 'improvement in booking conversion' },
      { value: '40%', description: 'increase in repeat bookings' },
      { value: '25%', description: 'reduction in customer service costs' }
    ],
    keyChallenges: [
      'Seasonal demand fluctuations',
      'Customer loyalty management',
      'Multi-channel booking management',
      'Service recovery and support'
    ],
    painPoints: [
      'Fragmented booking and reservation systems',
      'Poor customer journey tracking',
      'Manual loyalty program management',
      'Inefficient customer service processes'
    ],
    integrations: [
      'Amadeus',
      'Sabre',
      'Travelport',
      'Booking.com',
      'Expedia'
    ],
    dataSources: [
      'Booking systems',
      'Reservation platforms',
      'Customer databases',
      'Loyalty programs'
    ],
    marketSize: '$1.6 trillion globally',
    growthRate: '4.7% annually',
    comparisonMetrics: [
      {
        metric: 'Customer Journey Management',
        metricKey: 'travel.metrics.customerJourney',
        salesforce: { score: 10, label: 'Journey Suite', description: 'Complete customer journey management' },
        hubspot: { score: 8, label: 'Good Journey', description: 'Customer journey tracking and automation' },
        zoho: { score: 7, label: 'Good Journey', description: 'Customer journey management' },
        freshworks: { score: 6, label: 'Basic Journey', description: 'Simple customer tracking' },
        odoo: { score: 8, label: 'Custom Journey', description: 'Configurable customer journey management' }
      },
      {
        metric: 'Booking & Reservation Management',
        metricKey: 'travel.metrics.bookingReservation',
        salesforce: { score: 9, label: 'Booking Suite', description: 'Complete booking and reservation management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No booking management' },
        zoho: { score: 6, label: 'Basic Booking', description: 'Simple booking tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic reservation tracking' },
        odoo: { score: 7, label: 'Booking Module', description: 'Configurable booking management' }
      },
      {
        metric: 'Loyalty Program Management',
        metricKey: 'travel.metrics.loyaltyProgram',
        salesforce: { score: 9, label: 'Loyalty Suite', description: 'Complete loyalty program management' },
        hubspot: { score: 6, label: 'Basic Loyalty', description: 'Simple loyalty tracking' },
        zoho: { score: 7, label: 'Good Loyalty', description: 'Customer loyalty management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer tracking' },
        odoo: { score: 8, label: 'Custom Loyalty', description: 'Configurable loyalty programs' }
      },
      {
        metric: 'Customer Service & Support',
        metricKey: 'travel.metrics.customerService',
        salesforce: { score: 10, label: 'Service Cloud', description: 'Complete customer service and support management' },
        hubspot: { score: 7, label: 'Good Service', description: 'Customer service tools' },
        zoho: { score: 8, label: 'Good Service', description: 'Customer service management' },
        freshworks: { score: 9, label: 'Service Focus', description: 'Advanced customer service platform' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable service management' }
      },
      {
        metric: 'Marketing & Promotions Management',
        metricKey: 'travel.metrics.marketingPromotions',
        salesforce: { score: 9, label: 'Marketing Suite', description: 'Complete marketing and promotions management' },
        hubspot: { score: 8, label: 'Good Marketing', description: 'Advanced marketing automation' },
        zoho: { score: 7, label: 'Good Marketing', description: 'Marketing campaign management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic marketing tracking' },
        odoo: { score: 7, label: 'Custom Marketing', description: 'Configurable marketing management' }
      },
      {
        metric: 'Multi-Channel Booking Integration',
        metricKey: 'travel.metrics.multiChannelBooking',
        salesforce: { score: 9, label: 'Channel Suite', description: 'Complete multi-channel booking integration' },
        hubspot: { score: 4, label: 'Not Available', description: 'No booking integration' },
        zoho: { score: 6, label: 'Basic Integration', description: 'Simple channel integration' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic integration' },
        odoo: { score: 7, label: 'Custom Integration', description: 'Configurable channel integration' }
      },
      {
        metric: 'Customer Analytics & Insights',
        metricKey: 'travel.metrics.customerAnalytics',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for travel insights' },
        hubspot: { score: 7, label: 'Good Analytics', description: 'Customer and marketing analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Business intelligence and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Mobile Travel Management',
        metricKey: 'travel.metrics.mobileTravel',
        salesforce: { score: 9, label: 'Mobile Suite', description: 'Complete mobile travel management' },
        hubspot: { score: 5, label: 'Basic Mobile', description: 'Simple mobile interface' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile travel capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile travel management' }
      },
      {
        metric: 'Customer Communication & Notifications',
        metricKey: 'travel.metrics.customerCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete customer communication and notifications' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Customer communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Revenue Management & Pricing',
        metricKey: 'travel.metrics.revenueManagement',
        salesforce: { score: 8, label: 'Revenue Suite', description: 'Complete revenue management and pricing' },
        hubspot: { score: 3, label: 'Not Available', description: 'No revenue management' },
        zoho: { score: 6, label: 'Basic Revenue', description: 'Simple revenue tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic financial tracking' },
        odoo: { score: 7, label: 'Revenue Module', description: 'Configurable revenue management' }
      },
      {
        metric: 'Customer Portal & Self-Service',
        metricKey: 'travel.metrics.customerPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete customer portal and self-service' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple customer portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Customer self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused customer portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable customer portal' }
      },
      {
        metric: 'Partner & Channel Management',
        metricKey: 'travel.metrics.partnerChannel',
        salesforce: { score: 9, label: 'Partner Suite', description: 'Complete partner and channel management' },
        hubspot: { score: 6, label: 'Basic Partners', description: 'Simple partner tracking' },
        zoho: { score: 7, label: 'Good Partners', description: 'Partner relationship management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic partner tracking' },
        odoo: { score: 8, label: 'Partner Module', description: 'Configurable partner management' }
      },
      {
        metric: 'Customer Onboarding & Setup',
        metricKey: 'travel.metrics.customerOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete customer onboarding and setup' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple customer setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Customer onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Compliance & Regulatory Management',
        metricKey: 'travel.metrics.complianceRegulatory',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete compliance and regulatory management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Customer Feedback & Reviews Management',
        metricKey: 'travel.metrics.customerFeedback',
        salesforce: { score: 9, label: 'Feedback Suite', description: 'Complete customer feedback and reviews management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Customer feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Customer feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'travel.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
      { value: '35%', description: 'improvement in supply chain efficiency' },
      { value: '40%', description: 'reduction in product recalls' },
      { value: '30%', description: 'increase in distributor satisfaction' },
      { value: '25%', description: 'improvement in quality compliance' }
    ],
    keyChallenges: [
      'Supply chain complexity',
      'Quality control and compliance',
      'Product safety and recalls',
      'Seasonal demand management'
    ],
    painPoints: [
      'Complex supply chain operations',
      'Manual quality control processes',
      'Poor product traceability',
      'Inefficient distributor management'
    ],
    integrations: [
      'SAP Food & Beverage',
      'Oracle Food & Beverage',
      'Infor Food & Beverage',
      'Epicor',
      'Sage'
    ],
    dataSources: [
      'Supply chain systems',
      'Quality management',
      'Distribution networks',
      'Regulatory databases'
    ],
    marketSize: '$8.9 trillion globally',
    growthRate: '5.3% annually',
    comparisonMetrics: [
      {
        metric: 'Supply Chain Management & Traceability',
        metricKey: 'foodBeverage.metrics.supplyChain',
        salesforce: { score: 9, label: 'Supply Chain Suite', description: 'Complete supply chain management and traceability' },
        hubspot: { score: 4, label: 'Not Available', description: 'No supply chain management' },
        zoho: { score: 7, label: 'Good Supply Chain', description: 'Supply chain management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic vendor management' },
        odoo: { score: 9, label: 'Full Supply Chain', description: 'Complete supply chain management suite' }
      },
      {
        metric: 'Quality Control & Compliance Management',
        metricKey: 'foodBeverage.metrics.qualityControl',
        salesforce: { score: 9, label: 'Quality Suite', description: 'Complete quality control and compliance management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No quality management' },
        zoho: { score: 6, label: 'Basic Quality', description: 'Simple quality tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic issue tracking' },
        odoo: { score: 8, label: 'Quality Module', description: 'Configurable quality management' }
      },
      {
        metric: 'Customer & Distributor Management',
        metricKey: 'foodBeverage.metrics.customerDistributor',
        salesforce: { score: 10, label: 'Customer Suite', description: 'Complete customer and distributor management' },
        hubspot: { score: 7, label: 'Good CRM', description: 'Customer relationship management' },
        zoho: { score: 7, label: 'Good CRM', description: 'Customer and distributor management' },
        freshworks: { score: 6, label: 'Basic CRM', description: 'Simple customer management' },
        odoo: { score: 8, label: 'Custom CRM', description: 'Configurable customer management' }
      },
      {
        metric: 'Product Recall Management',
        metricKey: 'foodBeverage.metrics.productRecall',
        salesforce: { score: 9, label: 'Recall Suite', description: 'Complete product recall management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No recall management' },
        zoho: { score: 5, label: 'Basic Recall', description: 'Simple recall tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic case management' },
        odoo: { score: 7, label: 'Recall Module', description: 'Configurable recall management' }
      },
      {
        metric: 'Marketing & Promotions Management',
        metricKey: 'foodBeverage.metrics.marketingPromotions',
        salesforce: { score: 9, label: 'Marketing Suite', description: 'Complete marketing and promotions management' },
        hubspot: { score: 8, label: 'Good Marketing', description: 'Advanced marketing automation' },
        zoho: { score: 7, label: 'Good Marketing', description: 'Marketing campaign management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic marketing tracking' },
        odoo: { score: 7, label: 'Custom Marketing', description: 'Configurable marketing management' }
      },
      {
        metric: 'Inventory Management & Optimization',
        metricKey: 'foodBeverage.metrics.inventoryManagement',
        salesforce: { score: 9, label: 'Smart Inventory', description: 'AI-powered inventory optimization' },
        hubspot: { score: 3, label: 'Not Available', description: 'No inventory management' },
        zoho: { score: 7, label: 'Good Inventory', description: 'Inventory tracking and management' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic inventory tracking' },
        odoo: { score: 9, label: 'Full Inventory', description: 'Complete inventory management suite' }
      },
      {
        metric: 'Regulatory Compliance & Documentation',
        metricKey: 'foodBeverage.metrics.regulatoryCompliance',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete regulatory compliance and documentation' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Customer Service & Support',
        metricKey: 'foodBeverage.metrics.customerService',
        salesforce: { score: 10, label: 'Service Cloud', description: 'Complete customer service and support management' },
        hubspot: { score: 7, label: 'Good Service', description: 'Customer service tools' },
        zoho: { score: 8, label: 'Good Service', description: 'Customer service management' },
        freshworks: { score: 9, label: 'Service Focus', description: 'Advanced customer service platform' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable service management' }
      },
      {
        metric: 'Analytics & Business Intelligence',
        metricKey: 'foodBeverage.metrics.analytics',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for food & beverage insights' },
        hubspot: { score: 6, label: 'Basic Analytics', description: 'Simple analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Business intelligence and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Mobile Field Management',
        metricKey: 'foodBeverage.metrics.mobileField',
        salesforce: { score: 9, label: 'Mobile Suite', description: 'Complete mobile field management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No mobile field capabilities' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile field capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile field management' }
      },
      {
        metric: 'Customer Communication & Notifications',
        metricKey: 'foodBeverage.metrics.customerCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete customer communication and notifications' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Customer communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Revenue Management & Pricing',
        metricKey: 'foodBeverage.metrics.revenueManagement',
        salesforce: { score: 8, label: 'Revenue Suite', description: 'Complete revenue management and pricing' },
        hubspot: { score: 3, label: 'Not Available', description: 'No revenue management' },
        zoho: { score: 6, label: 'Basic Revenue', description: 'Simple revenue tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic financial tracking' },
        odoo: { score: 7, label: 'Revenue Module', description: 'Configurable revenue management' }
      },
      {
        metric: 'Customer Portal & Self-Service',
        metricKey: 'foodBeverage.metrics.customerPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete customer portal and self-service' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple customer portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Customer self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused customer portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable customer portal' }
      },
      {
        metric: 'Partner & Channel Management',
        metricKey: 'foodBeverage.metrics.partnerChannel',
        salesforce: { score: 9, label: 'Partner Suite', description: 'Complete partner and channel management' },
        hubspot: { score: 6, label: 'Basic Partners', description: 'Simple partner tracking' },
        zoho: { score: 7, label: 'Good Partners', description: 'Partner relationship management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic partner tracking' },
        odoo: { score: 8, label: 'Partner Module', description: 'Configurable partner management' }
      },
      {
        metric: 'Customer Onboarding & Setup',
        metricKey: 'foodBeverage.metrics.customerOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete customer onboarding and setup' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple customer setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Customer onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Customer Feedback & Reviews Management',
        metricKey: 'foodBeverage.metrics.customerFeedback',
        salesforce: { score: 9, label: 'Feedback Suite', description: 'Complete customer feedback and reviews management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Customer feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Customer feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'foodBeverage.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
      { value: '40%', description: 'improvement in customer satisfaction' },
      { value: '30%', description: 'reduction in service call volume' },
      { value: '25%', description: 'increase in payment collection' },
      { value: '35%', description: 'improvement in field service efficiency' }
    ],
    keyChallenges: [
      'Regulatory compliance requirements',
      'Customer service complexity',
      'Field service management',
      'Billing and payment processing'
    ],
    painPoints: [
      'Complex regulatory compliance requirements',
      'Poor customer service efficiency',
      'Manual field service scheduling',
      'Inefficient billing and payment processes'
    ],
    integrations: [
      'SAP Utilities',
      'Oracle Utilities',
      'CISCO',
      'GE Digital',
      'Schneider Electric'
    ],
    dataSources: [
      'Customer information systems',
      'Metering systems',
      'Billing platforms',
      'Field service systems'
    ],
    marketSize: '$1.8 trillion globally',
    growthRate: '3.5% annually',
    comparisonMetrics: [
      {
        metric: 'Customer Account Management',
        metricKey: 'utilities.metrics.customerAccount',
        salesforce: { score: 10, label: 'Account Suite', description: 'Complete customer account management' },
        hubspot: { score: 7, label: 'Good CRM', description: 'Customer relationship management' },
        zoho: { score: 7, label: 'Good CRM', description: 'Customer account management' },
        freshworks: { score: 6, label: 'Basic CRM', description: 'Simple customer management' },
        odoo: { score: 8, label: 'Custom CRM', description: 'Configurable customer management' }
      },
      {
        metric: 'Service Request Management',
        metricKey: 'utilities.metrics.serviceRequest',
        salesforce: { score: 10, label: 'Service Suite', description: 'Complete service request management' },
        hubspot: { score: 6, label: 'Basic Service', description: 'Simple service tracking' },
        zoho: { score: 7, label: 'Good Service', description: 'Service request management' },
        freshworks: { score: 8, label: 'Service Focus', description: 'Advanced service management' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable service management' }
      },
      {
        metric: 'Billing & Payment Processing',
        metricKey: 'utilities.metrics.billingPayment',
        salesforce: { score: 9, label: 'Billing Suite', description: 'Complete billing and payment processing' },
        hubspot: { score: 4, label: 'Not Available', description: 'No billing capabilities' },
        zoho: { score: 7, label: 'Good Billing', description: 'Billing and payment management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic payment tracking' },
        odoo: { score: 9, label: 'Full Billing', description: 'Complete billing and accounting suite' }
      },
      {
        metric: 'Field Service Operations',
        metricKey: 'utilities.metrics.fieldService',
        salesforce: { score: 10, label: 'Field Service Suite', description: 'Complete field service operations' },
        hubspot: { score: 4, label: 'Not Available', description: 'No field service capabilities' },
        zoho: { score: 7, label: 'Good Service', description: 'Field service management' },
        freshworks: { score: 6, label: 'Service Focus', description: 'Service ticket management' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable field service management' }
      },
      {
        metric: 'Energy Usage Analytics',
        metricKey: 'utilities.metrics.energyAnalytics',
        salesforce: { score: 9, label: 'Analytics Suite', description: 'Complete energy usage analytics' },
        hubspot: { score: 4, label: 'Not Available', description: 'No energy analytics' },
        zoho: { score: 6, label: 'Basic Analytics', description: 'Simple usage tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 7, label: 'Custom Analytics', description: 'Configurable energy analytics' }
      },
      {
        metric: 'Regulatory Compliance Management',
        metricKey: 'utilities.metrics.regulatoryCompliance',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete regulatory compliance management' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Customer Communication & Notifications',
        metricKey: 'utilities.metrics.customerCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete customer communication and notifications' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Customer communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Mobile Field Management',
        metricKey: 'utilities.metrics.mobileField',
        salesforce: { score: 10, label: 'Mobile Suite', description: 'Complete mobile field management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No mobile field capabilities' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile field capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile field management' }
      },
      {
        metric: 'Customer Portal & Self-Service',
        metricKey: 'utilities.metrics.customerPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete customer portal and self-service' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple customer portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Customer self-service portal' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused customer portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable customer portal' }
      },
      {
        metric: 'Customer Onboarding & Setup',
        metricKey: 'utilities.metrics.customerOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete customer onboarding and setup' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple customer setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Customer onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic customer management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Customer Feedback & Reviews Management',
        metricKey: 'utilities.metrics.customerFeedback',
        salesforce: { score: 9, label: 'Feedback Suite', description: 'Complete customer feedback and reviews management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Customer feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Customer feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'utilities.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
      { value: '50%', description: 'improvement in citizen satisfaction' },
      { value: '40%', description: 'reduction in processing times' },
      { value: '35%', description: 'increase in digital service adoption' },
      { value: '30%', description: 'improvement in compliance rates' }
    ],
    keyChallenges: [
      'Citizen service delivery',
      'Regulatory compliance',
      'Digital transformation',
      'Process automation'
    ],
    painPoints: [
      'Poor citizen service delivery',
      'Complex regulatory compliance processes',
      'Manual document management',
      'Inefficient case processing'
    ],
    integrations: [
      'Microsoft Government',
      'Oracle Government',
      'SAP Public Sector',
      'ServiceNow',
      'Salesforce Government Cloud'
    ],
    dataSources: [
      'Citizen databases',
      'Case management systems',
      'Document repositories',
      'Compliance systems'
    ],
    marketSize: '$2.2 trillion globally',
    growthRate: '4.2% annually',
    comparisonMetrics: [
      {
        metric: 'Citizen Service Management',
        metricKey: 'government.metrics.citizenService',
        salesforce: { score: 10, label: 'Citizen Suite', description: 'Complete citizen service management' },
        hubspot: { score: 6, label: 'Basic Service', description: 'Simple citizen tracking' },
        zoho: { score: 7, label: 'Good Service', description: 'Citizen service management' },
        freshworks: { score: 7, label: 'Service Focus', description: 'Citizen service platform' },
        odoo: { score: 8, label: 'Service Module', description: 'Configurable citizen service management' }
      },
      {
        metric: 'Case & Document Management',
        metricKey: 'government.metrics.caseDocument',
        salesforce: { score: 9, label: 'Case Suite', description: 'Complete case and document management' },
        hubspot: { score: 4, label: 'Not Available', description: 'No case management' },
        zoho: { score: 6, label: 'Basic Cases', description: 'Simple case tracking' },
        freshworks: { score: 6, label: 'Case Focus', description: 'Case management system' },
        odoo: { score: 7, label: 'Case Module', description: 'Configurable case management' }
      },
      {
        metric: 'Public Portal Development',
        metricKey: 'government.metrics.publicPortal',
        salesforce: { score: 10, label: 'Portal Suite', description: 'Complete public portal development' },
        hubspot: { score: 6, label: 'Basic Portal', description: 'Simple public portal' },
        zoho: { score: 7, label: 'Good Portal', description: 'Public portal development' },
        freshworks: { score: 6, label: 'Support Portal', description: 'Support-focused portal' },
        odoo: { score: 8, label: 'Custom Portal', description: 'Configurable public portal' }
      },
      {
        metric: 'Internal Process Automation',
        metricKey: 'government.metrics.processAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete internal process automation' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Process automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable process automation' }
      },
      {
        metric: 'Compliance & Reporting',
        metricKey: 'government.metrics.complianceReporting',
        salesforce: { score: 9, label: 'Compliance Suite', description: 'Complete compliance and reporting' },
        hubspot: { score: 3, label: 'Not Available', description: 'No compliance features' },
        zoho: { score: 6, label: 'Basic Compliance', description: 'Simple compliance tracking' },
        freshworks: { score: 4, label: 'Limited', description: 'Basic audit trails' },
        odoo: { score: 7, label: 'Custom Compliance', description: 'Configurable compliance workflows' }
      },
      {
        metric: 'Citizen Communication & Notifications',
        metricKey: 'government.metrics.citizenCommunication',
        salesforce: { score: 9, label: 'Communication Suite', description: 'Complete citizen communication and notifications' },
        hubspot: { score: 7, label: 'Good Communication', description: 'Email and communication tools' },
        zoho: { score: 7, label: 'Good Communication', description: 'Citizen communication management' },
        freshworks: { score: 6, label: 'Communication Focus', description: 'Communication and support tools' },
        odoo: { score: 8, label: 'Custom Communication', description: 'Configurable communication workflows' }
      },
      {
        metric: 'Mobile Government Services',
        metricKey: 'government.metrics.mobileServices',
        salesforce: { score: 9, label: 'Mobile Suite', description: 'Complete mobile government services' },
        hubspot: { score: 5, label: 'Basic Mobile', description: 'Simple mobile interface' },
        zoho: { score: 7, label: 'Good Mobile', description: 'Mobile government capabilities' },
        freshworks: { score: 5, label: 'Limited Mobile', description: 'Basic mobile access' },
        odoo: { score: 8, label: 'Custom Mobile', description: 'Configurable mobile government services' }
      },
      {
        metric: 'Citizen Analytics & Insights',
        metricKey: 'government.metrics.citizenAnalytics',
        salesforce: { score: 10, label: 'AI Analytics', description: 'Einstein Analytics for government insights' },
        hubspot: { score: 6, label: 'Basic Analytics', description: 'Simple citizen analytics' },
        zoho: { score: 7, label: 'Good Analytics', description: 'Government analytics and reporting' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic analytics' },
        odoo: { score: 8, label: 'Full BI', description: 'Complete business intelligence suite' }
      },
      {
        metric: 'Citizen Onboarding & Registration',
        metricKey: 'government.metrics.citizenOnboarding',
        salesforce: { score: 9, label: 'Onboarding Suite', description: 'Complete citizen onboarding and registration' },
        hubspot: { score: 6, label: 'Basic Onboarding', description: 'Simple citizen setup' },
        zoho: { score: 7, label: 'Good Onboarding', description: 'Citizen onboarding management' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic citizen management' },
        odoo: { score: 8, label: 'Custom Onboarding', description: 'Configurable onboarding workflows' }
      },
      {
        metric: 'Citizen Feedback & Reviews Management',
        metricKey: 'government.metrics.citizenFeedback',
        salesforce: { score: 9, label: 'Feedback Suite', description: 'Complete citizen feedback and reviews management' },
        hubspot: { score: 6, label: 'Basic Feedback', description: 'Simple feedback collection' },
        zoho: { score: 7, label: 'Good Feedback', description: 'Citizen feedback management' },
        freshworks: { score: 6, label: 'Feedback Focus', description: 'Citizen feedback and support' },
        odoo: { score: 7, label: 'Custom Feedback', description: 'Configurable feedback management' }
      },
      {
        metric: 'Workflow Automation & Process Management',
        metricKey: 'government.metrics.workflowAutomation',
        salesforce: { score: 10, label: 'Automation Suite', description: 'Complete workflow automation and process management' },
        hubspot: { score: 6, label: 'Basic Automation', description: 'Simple workflow automation' },
        zoho: { score: 7, label: 'Good Automation', description: 'Workflow automation tools' },
        freshworks: { score: 5, label: 'Limited', description: 'Basic process management' },
        odoo: { score: 8, label: 'Custom Automation', description: 'Configurable workflow automation' }
      }
    ]
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
