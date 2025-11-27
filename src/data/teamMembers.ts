// Consolidated team member data structure
import { LucideIcon } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  profileSlug: string; // slug for markdown file
  icons?: LucideIcon[];
  hoverElements?: string[];
  color?: string;
  description?: string;
  isAcademy?: boolean; // indicates if member is part of the academy
}

// Team members data consolidated from About.tsx and Home.tsx
export const teamMembers: TeamMember[] = [
  {
    id: "mina-michel",
    name: "Mina Michel",
    role: "Founder",
    image: "/Assets/Company Members/Mina_Michel_Founder_of_Cloudastick_Systems.png",
    profileSlug: "mina-michel",
    description: "Leading Cloudastick's vision as a trusted Salesforce partner, Mina drives innovation in the ecosystem while building lasting relationships with clients across the Middle East and Africa."
  },
  {
    id: "mireille-rafik",
    name: "Mireille Rafik",
    role: "Marketing Consultant",
    image: "/Assets/Company Members/Mireille_Rafik_Marketing_Cloud_Consultant.png",
    profileSlug: "mireille-rafik",
    description: "Specializing in Salesforce Marketing Cloud, Mireille helps businesses create personalized customer journeys and drive engagement through data-driven marketing automation strategies."
  },
  {
    id: "omar-el-borae",
    name: "Omar El Borae",
    role: "Customer Success Manager",
    image: "/Assets/Company Members/Omar_El_Borae_Customer_Success_Manager.png?v=2",
    profileSlug: "omar-el-borae",
    description: "Ensuring customer success in the Salesforce ecosystem, Omar works closely with clients to maximize their platform investment and achieve their business transformation goals."
  },
  {
    id: "carine-felix",
    name: "Carine Felix",
    role: "Brand and People Experience Specialist",
    image: "/Assets/Company Members/Carine_Felix_Brand_and_People_Experience_Specialist.png",
    profileSlug: "carine-felix",
    description: "Shaping Cloudastick's culture and brand experience, Carine ensures our Salesforce partner services reflect our commitment to excellence and human-centered approach."
  },
  {
    id: "luay-aladin",
    name: "Luay Aladin",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Luay_Aladin_Salesforce_Consultant.png",
    profileSlug: "luay-aladin",
    description: "Expert in Salesforce development and configuration, Luay delivers custom solutions that extend the platform's capabilities to meet unique business requirements."
  },
  {
    id: "shady-thomas",
    name: "Shady Thomas",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Shady_Thomas_Salesforce_Consultant.png",
    profileSlug: "shady-thomas",
    description: "Specializing in Salesforce integrations and data management, Shady connects disparate systems and ensures seamless data flow across the entire business ecosystem."
  },
  {
    id: "ashraf-rezk",
    name: "Ashraf Rezk",
    role: "Head of Tech",
    image: "/Assets/Company Members/Ashraf_Rezk_Head_of_Tech.png",
    profileSlug: "ashraf-rezk",
    description: "Leading Cloudastick's technical strategy, Ashraf ensures our Salesforce implementations follow best practices for security, scalability, and enterprise architecture."
  },
  {
    id: "martin-ashraf",
    name: "Martin Ashraf",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Martin_Ashraf_Salesforce_Consultant.png",
    profileSlug: "martin-ashraf",
    description: "Focused on strategic Salesforce implementations, Martin helps businesses align their CRM strategy with growth objectives and optimize their sales processes."
  },
  {
    id: "ahmed-salah",
    name: "Ahmed Salah",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Ahmed_Salah_Salesforce_Consultant.png",
    profileSlug: "ahmed-salah",
    description: "Delivering excellence in Salesforce consulting, Ahmed ensures every implementation meets the highest standards of quality and delivers measurable business value."
  },
  {
    id: "maheen-imran",
    name: "Maheen Imran",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Maheen_Imran_Salesforce_Consultant.png",
    profileSlug: "maheen-imran",
    description: "Driving innovation through collaborative Salesforce solutions, Maheen works with cross-functional teams to deliver transformative customer experiences."
  },
  {
    id: "fady-maged",
    name: "Fady Maged",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Fady_Maged_Salesforce_Consultant.png",
    profileSlug: "fady-maged",
    description: "Combining development expertise with analytics insights, Fady creates powerful Salesforce solutions that provide actionable business intelligence and reporting."
  },
  {
    id: "andrew-osama",
    name: "Andrew Osama",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Andrew_Osama_Salesforce_Consultant.png",
    profileSlug: "andrew-osama",
    description: "Expert in Salesforce configuration and customization, Andrew tailors the platform to fit unique business processes and workflow requirements."
  },
  {
    id: "abdullah",
    name: "Abdullah",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Abdullah_Salesforce_Consultant.png",
    profileSlug: "abdullah",
    description: "Specializing in data management and global integrations, Abdullah ensures seamless connectivity between Salesforce and enterprise systems worldwide."
  },
  {
    id: "farida-esam",
    name: "Farida Esam",
    role: "Marketing Consultant",
    image: "/Assets/Company Members/Farida_Esam_Marketing_Cloud_Consultant.png",
    profileSlug: "farida-esam",
    description: "Focused on Marketing Cloud excellence, Farida designs and executes sophisticated email marketing campaigns that drive customer engagement and ROI."
  },
  {
    id: "andrea-makary",
    name: "Andrea Makary",
    role: "Technical Architect",
    image: "/Assets/Company Members/Andrea_Makary_Technical_Architect.png?v=2",
    profileSlug: "andrea-makary",
    description: "Designing enterprise-grade Salesforce architectures, Andrea ensures scalable, secure, and maintainable solutions that support long-term business growth."
  },
  {
    id: "mariam-mamdouh",
    name: "Mariam Mamdouh",
    role: "Project Manager",
    image: "/Assets/Company Members/Mariam_Mamdouh_Project_Manager.png",
    profileSlug: "mariam-mamdouh",
    description: "Ensuring successful project delivery, Mariam coordinates complex Salesforce implementations while maintaining timelines, budgets, and stakeholder satisfaction."
  },
  {
    id: "marina-danial",
    name: "Marina Danial",
    role: "CFO Cloudastick and COO of Techsa",
    image: "/Assets/Company Members/Marina_Danial_CFO_Cloudastick_and_COO_of_Techsa.png?v=2",
    profileSlug: "marina-danial",
    description: "Leading financial strategy and operations, Marina ensures Cloudastick's financial health while driving operational excellence across both Cloudastick and Techsa."
  },
  {
    id: "jenny-maged",
    name: "Jenny Maged",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Jenny_Maged_Salesforce_Consultant.png?v=2",
    profileSlug: "jenny-maged",
    description: "Delivering expert Salesforce consulting services, Jenny helps businesses optimize their CRM processes and achieve their digital transformation goals."
  },
  {
    id: "john-shedoudy",
    name: "John Shedoudy",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/John_Shedoudy_Salesforce_Consultant.png?v=2",
    profileSlug: "john-shedoudy",
    description: "Expert in Salesforce implementation and optimization, John delivers tailored solutions that enhance business processes and drive operational efficiency."
  },
  {
    id: "mariam-mahmoud",
    name: "Mariam Mahmoud",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Mariam_Mahmoud_Salesforce_Consultant.png?v=2",
    profileSlug: "mariam-mahmoud",
    description: "Specializing in Salesforce configuration and user adoption, Mariam ensures seamless platform integration and empowers teams to maximize CRM value.",
    isAcademy: true
  },
  {
    id: "omar-bazid",
    name: "Omar Bazid",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Omar_Bazid_Salesforce_Consultant.png?v=2",
    profileSlug: "omar-bazid",
    description: "Focused on delivering scalable Salesforce solutions, Omar combines technical expertise with business acumen to transform customer engagement strategies.",
    isAcademy: true
  },
  {
    id: "sakshi-dokarimare",
    name: "Sakshi Dokarimare",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Sakshi_Dokarimare_Salesforce_Consultant.png",
    profileSlug: "sakshi-dokarimare",
    description: "Expert Salesforce consultant delivering innovative solutions and driving business transformation through strategic CRM implementations."
  },
  {
    id: "alyaa-hafez",
    name: "Alyaa Hafez",
    role: "Salesforce Consultant",
    image: "/Assets/Company Members/Alyaa_Hafez_Salesforce_Consultant.png",
    profileSlug: "alyaa-hafez",
    description: "GUC Graduate and Salesforce Consultant bringing fresh expertise to deliver innovative solutions and drive business transformation in the Salesforce ecosystem."
  }
];

// Helper function to get team member by ID
export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(member => member.id === id);
}

// Helper function to get team member by name
export function getTeamMemberByName(name: string): TeamMember | undefined {
  return teamMembers.find(member => member.name === name);
}

