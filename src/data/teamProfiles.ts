// Team member profile interface and loader
export interface TeamMemberProfile {
  name: string;
  yearsOfExperience: number;
  numberOfCertificates: number;
  careerTrack: Array<{ company: string; period: string }>;
  bio: string;
  rawMarkdown: string;
}

// Helper function to parse markdown profile
export function parseProfileMarkdown(markdown: string): TeamMemberProfile {
  const lines = markdown.split('\n').map(l => l.trim()).filter(l => l);
  
  // Extract name from first line (should be # Name)
  const nameMatch = markdown.match(/^#\s+(.+)$/m);
  const name = nameMatch ? nameMatch[1].trim() : '';
  
  // Extract years of experience
  const yearsMatch = markdown.match(/Years:\s*(\d+)/i);
  const yearsOfExperience = yearsMatch ? parseInt(yearsMatch[1], 10) : 0;
  
  // Extract number of certificates
  const certsMatch = markdown.match(/Certificates:\s*(\d+)/i);
  const numberOfCertificates = certsMatch ? parseInt(certsMatch[1], 10) : 0;
  
  // Extract career track
  const careerTrack: Array<{ company: string; period: string }> = [];
  const careerSectionMatch = markdown.match(/## Career Track\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (careerSectionMatch) {
    const careerLines = careerSectionMatch[1].split('\n')
      .map(l => l.trim())
      .filter(l => l && l.startsWith('-'));
    
    careerLines.forEach(line => {
      const match = line.match(/^-\s*(.+?)\s*\((.+?)\)$/);
      if (match) {
        careerTrack.push({
          company: match[1].trim(),
          period: match[2].trim()
        });
      }
    });
  }
  
  // Extract bio section
  const bioSectionMatch = markdown.match(/## Bio\s*\n([\s\S]*?)$/i);
  const bio = bioSectionMatch ? bioSectionMatch[1].trim() : '';
  
  return {
    name,
    yearsOfExperience,
    numberOfCertificates,
    careerTrack,
    bio,
    rawMarkdown: markdown
  };
}

// Profile data - will be loaded dynamically or statically
// For now, we'll use a function that fetches profiles
export async function loadTeamMemberProfile(slug: string): Promise<TeamMemberProfile | null> {
  try {
    // Try public folder path first (for production)
    let response = await fetch(`/data/team-profiles/${slug}.md`);
    if (!response.ok) {
      // Fallback to src path (for development with Vite)
      response = await fetch(`/src/data/team-profiles/${slug}.md`);
      if (!response.ok) {
        console.warn(`Profile not found for ${slug}`);
        return null;
      }
    }
    const markdown = await response.text();
    return parseProfileMarkdown(markdown);
  } catch (error) {
    console.error(`Error loading profile for ${slug}:`, error);
    return null;
  }
}

// Helper to convert name to slug
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Cache for loaded profiles
const profileCache = new Map<string, TeamMemberProfile>();

export async function getTeamMemberProfile(name: string): Promise<TeamMemberProfile | null> {
  const slug = nameToSlug(name);
  
  if (profileCache.has(slug)) {
    return profileCache.get(slug)!;
  }
  
  const profile = await loadTeamMemberProfile(slug);
  if (profile) {
    profileCache.set(slug, profile);
  }
  
  return profile;
}

