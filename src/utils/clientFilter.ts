// Client filtering utility

import { clientsData, ClientInfo } from '../data/clientsData';

/**
 * Get relevant clients by industry
 */
export const getClientsByIndustry = (selectedIndustry: string): ClientInfo[] => {
  const allClients = Object.values(clientsData);
  
  // Industry mapping to client industry strings
  const industryMapping: { [key: string]: string[] } = {
    'real-estate': ['Real Estate & Construction', 'Real Estate'],
    'healthcare-life-sciences': ['Healthcare', 'Pharmaceutical'],
    'manufacturing': ['Manufacturing', 'Industrial'],
    'telecommunications': ['Telecommunications', 'Telecom'],
    'financial-services': ['Fintech', 'Banking', 'Financial Services', 'Insurance'],
    'insurance': ['Insurance', 'Brokerage', 'Financial Services'],
    'retail-b2c': ['Retail', 'E-commerce'],
    'b2b-commerce': ['B2B', 'Distribution', 'Wholesale'],
    'professional-services': ['Professional Services', 'Consulting', 'Technology', 'Education'],
    'travel-tourism': ['Travel & Hospitality', 'Tourism', 'Hotels'],
  };
  
  const relevantIndustries = industryMapping[selectedIndustry] || [];
  
  if (relevantIndustries.length === 0) {
    // Return all clients if no specific mapping
    return allClients.slice(0, 6);
  }
  
  // Filter clients by industry
  const filtered = allClients.filter(client =>
    relevantIndustries.some(industry =>
      client.industry.toLowerCase().includes(industry.toLowerCase()) ||
      industry.toLowerCase().includes(client.industry.toLowerCase())
    )
  );
  
  // Return up to 6 relevant clients, but show more for real-estate to highlight big names
  const limit = selectedIndustry === 'real-estate' ? 20 : 6;
  return filtered.slice(0, limit);
};

/**
 * Get all clients
 */
export const getAllClients = (): ClientInfo[] => {
  return Object.values(clientsData);
};

