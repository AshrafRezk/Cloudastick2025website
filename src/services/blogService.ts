/**
 * Blog Service
 * Handles fetching blogs from Salesforce via Netlify function
 */

export interface BlogPost {
  id: string;
  urlName: string;
  title: string;
  content: string;
  publishedDate: string | null;
  formattedDate?: string;
  excerpt?: string;
}

export interface BlogResponse {
  blogs: BlogPost[];
}

/**
 * Format date from Salesforce format to readable format
 */
const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Extract excerpt from content (first 150 characters)
 */
const extractExcerpt = (content: string, maxLength: number = 150): string => {
  if (!content) return '';
  
  // Remove HTML tags for excerpt
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).trim() + '...';
};

/**
 * Fetch blogs from Salesforce
 */
export const fetchBlogs = async (
  accessToken: string,
  instanceUrl: string
): Promise<BlogPost[]> => {
  try {
    console.log('📰 Fetching blogs from Salesforce...');

    const response = await fetch('/.netlify/functions/fetchBlogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        instance_url: instanceUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch blogs: ${response.status}`);
    }

    const data: BlogResponse = await response.json();
    
    // Transform and format blog data
    const blogs: BlogPost[] = data.blogs.map((blog) => ({
      ...blog,
      formattedDate: formatDate(blog.publishedDate),
      excerpt: extractExcerpt(blog.content),
    }));

    console.log(`✅ Successfully fetched ${blogs.length} blogs`);
    return blogs;
  } catch (error) {
    console.error('❌ Error fetching blogs:', error);
    throw error;
  }
};

/**
 * Fetch a single blog by URL_Name__c from Salesforce
 */
export const fetchBlogByUrlName = async (
  urlName: string,
  accessToken: string,
  instanceUrl: string
): Promise<BlogPost | null> => {
  try {
    console.log(`📰 Fetching blog with URL name: ${urlName} from Salesforce...`);

    // SOQL query to fetch specific blog by URL_Name__c
    // Escape single quotes in urlName to prevent SOQL injection
    const escapedUrlName = urlName.replace(/'/g, "\\'");
    const soqlQuery = encodeURIComponent(
      `SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE URL_Name__c = '${escapedUrlName}' LIMIT 1`
    );

    const queryUrl = `${instanceUrl}/services/data/v58.0/query/?q=${soqlQuery}`;

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.records || data.records.length === 0) {
      return null;
    }

    const record = data.records[0];
    const blog: BlogPost = {
      id: record.Id,
      urlName: record.URL_Name__c || '',
      title: record.Header__c || '',
      content: record.Content__c || '',
      publishedDate: record.Published_Date__c || null,
      formattedDate: formatDate(record.Published_Date__c),
    };

    console.log('✅ Successfully fetched blog');
    return blog;
  } catch (error) {
    console.error('❌ Error fetching blog by URL name:', error);
    throw error;
  }
};

