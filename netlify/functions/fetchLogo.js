// Using built-in fetch (available in Node.js 18+)

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { website } = JSON.parse(event.body);
    
    if (!website) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Website URL is required' }),
      };
    }

    // Extract domain from website URL
    const extractDomain = (url) => {
      try {
        let domain = url.replace(/^https?:\/\//, '');
        domain = domain.replace(/^www\./, '');
        domain = domain.split('/')[0];
        
        if (domain && domain.includes('.') && !domain.includes(' ')) {
          return domain;
        }
        return null;
      } catch (error) {
        return null;
      }
    };

    const domain = extractDomain(website);
    
    if (!domain) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          logoUrl: null, 
          source: null, 
          error: 'Invalid website URL' 
        }),
      };
    }

    // Try Clearbit Logo API first
    try {
      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
      const response = await fetch(clearbitUrl, { method: 'HEAD' });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              logoUrl: clearbitUrl,
              source: 'clearbit',
              domain: domain
            }),
          };
        }
      }
    } catch (error) {
      console.warn('Clearbit fetch failed:', error);
    }

    // Try Google Favicon as fallback
    try {
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      const response = await fetch(faviconUrl, { method: 'HEAD' });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              logoUrl: faviconUrl,
              source: 'fallback',
              domain: domain
            }),
          };
        }
      }
    } catch (error) {
      console.warn('Favicon fetch failed:', error);
    }

    // No logo found
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logoUrl: null,
        source: null,
        error: 'No logo found for this domain',
        domain: domain
      }),
    };

  } catch (error) {
    console.error('Logo fetch function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        logoUrl: null,
        source: null
      }),
    };
  }
};
