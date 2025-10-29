// Utility function to parse logo filenames and organize by industry
import { clientsData } from '../data/clientsData';

export interface ClientLogo {
  name: string;
  industry: string;
  logoPath: string;
  originalFilename: string;
  description?: string;
  websiteUrl?: string;
}

export interface ClientSection {
  id: number;
  title: string;
  bgColor: string;
  logos: ClientLogo[];
}

// Industry mapping for consistent categorization
const industryMapping: Record<string, string> = {
  'Real Estate': 'Real Estate & Construction',
  'Real Esate': 'Real Estate & Construction', // Fix typo in filename
  'Healthcare': 'Healthcare',
  'Manufacturing': 'Manufacturing',
  'Education': 'Education',
  'Fintech': 'Fintech',
  'Professional Services': 'Professional Services',
  'eCommerce': 'eCommerce',
  'Traveling & Hospitality': 'Travel & Hospitality',
  'Travel & Hospitality': 'Travel & Hospitality',
  'Construction': 'Real Estate & Construction', // Group with Real Estate
  'Automotive': 'Automotive',
  'Non-profit': 'Non-profit',
  'Law': 'Professional Services',
  'Brokerage': 'Professional Services'
};

// Background colors for each industry section
const industryColors: Record<string, string> = {
  'Real Estate & Construction': 'from-blue-900/20 to-cyan-900/20',
  'Healthcare': 'from-green-900/20 to-emerald-900/20',
  'Manufacturing': 'from-orange-900/20 to-red-900/20',
  'Education': 'from-purple-900/20 to-indigo-900/20',
  'Fintech': 'from-cyan-900/20 to-blue-900/20',
  'Professional Services': 'from-gray-900/20 to-slate-900/20',
  'eCommerce': 'from-pink-900/20 to-rose-900/20',
  'Travel & Hospitality': 'from-yellow-900/20 to-amber-900/20',
  'Automotive': 'from-red-900/20 to-orange-900/20',
  'Non-profit': 'from-emerald-900/20 to-green-900/20'
};

// Translation keys for industry titles
const industryTitles: Record<string, string> = {
  'Real Estate & Construction': 'Real Estate & Construction',
  'Healthcare': 'Healthcare',
  'Manufacturing': 'Manufacturing',
  'Education': 'Education',
  'Fintech': 'Fintech',
  'Professional Services': 'Professional Services',
  'eCommerce': 'eCommerce',
  'Travel & Hospitality': 'Travel & Hospitality',
  'Automotive': 'Automotive',
  'Non-profit': 'Non-profit'
};

export function parseLogoFiles(): ClientSection[] {
  // List of all logo files with their parsed data
  const logoFiles = [
    'Afreximbank - Fintech.png',
    'AIM Group - Professional Services.png',
    'Al Bedeawi & Partners - Law.png',
    'Al Tayyar - Traveling & Hospitality.png',
    'ALDAU - Real Estate.png',
    'Almosafer - Traveling & Hospitality.png',
    'Avon - Healthcare.png',
    'Benoit properties - Real Estate.png',
    'Beshay Steel - Manufacturing.png',
    'Classera - Education.png',
    'CREDOLOGOS - Non-profit.png',
    'Deraya - Brokerage.png', // Using first occurrence
    'Dorra - Real Estate.png',
    'Egypt Pannel - Manufacturing.png',
    'Elaa - Traveling & Hospitality.png',
    'Erth - Real Estate.png',
    'FAYVO - Professional Services.png',
    'FedEx - Professional Services.png',
    'Fruit Nation - Manufacturing.png',
    'Galina - Manufacturing.png',
    'Gameness - eCommerce.png',
    'girls who code - Professional Services.png',
    'Global Banding - Manufacturing.png',
    'Global Scales - Manufacturing.png',
    'HDP - Real Estate.png',
    'IMKAN - Real Estate.png',
    'InTuition - Education.png',
    'KAYAN - Automotive.png',
    'Kingfisher - eCommerce.png',
    'LEGACY Ventures - Travel & Hospitality.png',
    'Live Tula - Healthcare.png',
    'Marakez - Real Estate.png',
    'Marid Coffee - Manufacturing.png',
    'meddbase - Healthcare.png',
    'Megatech Arabia - Professional Services.png',
    'Memar - Real Estate.png',
    'Modern Electronics - Professional Services.png',
    'Mozare3 - Manufacturing.png', // Using first occurrence
    'Nile City - Real Estate.png',
    'PadSquad - eCommerce.png',
    'Plantform - Manufacturing.png',
    'Prosperity - Real Esate.png',
    'Reef - Manufacturing.png',
    'Rutgers - Education.png',
    'RUTI - eCommerce.png',
    'Seera - Traveling & Hospitality.png',
    'Solver - Manufacturing.png',
    'Soueast - Automotive.png',
    'Target HR & Manpower - Professional Services.png',
    'Tarjama - Professional Services.png',
    'The American University Cairo - Education.png',
    'Town Movers - Construction.png',
    'TWNAF - Non-profit.png',
    'Venture - Traveling & Hospitality.png',
    'Wellthi - Fintech.png',
    'World Business Council - Professional Services.png'
  ];

  // Parse each logo file
  const parsedLogos: ClientLogo[] = logoFiles.map((filename, index) => {
    const [name, industry] = filename.replace('.png', '').split(' - ');
    const clientName = name.trim();
    const clientData = clientsData[clientName];
    
    return {
      name: clientName,
      industry: industryMapping[industry] || industry,
      logoPath: `/Assets/Customers-Logos-Website/${filename}`,
      originalFilename: filename,
      description: clientData?.description,
      websiteUrl: clientData?.websiteUrl
    };
  });

  // Group by industry
  const industryGroups: Record<string, ClientLogo[]> = {};
  parsedLogos.forEach(logo => {
    if (!industryGroups[logo.industry]) {
      industryGroups[logo.industry] = [];
    }
    industryGroups[logo.industry].push(logo);
  });

  // Convert to sections
  const sections: ClientSection[] = Object.entries(industryGroups).map(([industry, logos], index) => ({
    id: index + 1,
    title: industryTitles[industry] || industry,
    bgColor: industryColors[industry] || 'from-gray-900/20 to-slate-900/20',
    logos
  }));

  // Shuffle sections randomly
  const shuffledSections = sections.sort(() => Math.random() - 0.5);
  
  // Shuffle logos within each section
  shuffledSections.forEach(section => {
    section.logos = section.logos.sort(() => Math.random() - 0.5);
  });

  return shuffledSections;
}

export function getIndustryFilters(sections: ClientSection[]): string[] {
  return sections.map(section => section.title);
}
