/**
 * Netlify Function for fetching all blogs from Salesforce with pagination
 * Queries Blog_Post__c object and returns paginated results
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📰 Fetch All Blogs - Request received');

    const { access_token, instance_url, page = 1, pageSize = 10 } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing access_token or instance_url' }),
      };
    }

    const offset = (page - 1) * pageSize;

    // First, get total count
    const countQuery = encodeURIComponent(
      "SELECT COUNT() FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null"
    );
    const countUrl = `${instance_url}/services/data/v58.0/query/?q=${countQuery}`;

    const countResponse = await fetch(countUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!countResponse.ok) {
      const errorText = await countResponse.text();
      throw new Error(`Salesforce API error: ${countResponse.status} - ${errorText}`);
    }

    const countData = await countResponse.json();
    const totalCount = countData.totalSize || 0;

    // Then fetch the paginated records
    const soqlQuery = encodeURIComponent(
      `SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null ORDER BY Published_Date__c DESC LIMIT ${pageSize} OFFSET ${offset}`
    );

    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${soqlQuery}`;

    console.log('📤 Querying Salesforce for blogs...', { page, pageSize, offset });

    const response = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 Salesforce Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Salesforce API Error:', errorText);
      throw new Error(`Salesforce API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.records?.length || 0} blog records`);

    // Transform Salesforce records to blog format
    const blogs = (data.records || []).map((record) => ({
      id: record.Id,
      urlName: record.URL_Name__c || '',
      title: record.Header__c || '',
      content: record.Content__c || '',
      publishedDate: record.Published_Date__c || null,
    }));

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        blogs,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        }
      }),
    };

  } catch (error) {
    console.error('❌ Fetch All Blogs Function Error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch blogs from Salesforce',
        message: error.message
      }),
    };
  }
};

