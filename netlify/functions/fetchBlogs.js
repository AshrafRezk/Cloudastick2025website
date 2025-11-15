/**
 * Netlify Function for fetching blogs from Salesforce
 * Queries Blog_Post__c object and returns the latest published blogs
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
    console.log('📰 Fetch Blogs - Request received');

    const { access_token, instance_url } = JSON.parse(event.body || '{}');

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

    // SOQL query to fetch latest 3 published blogs
    const soqlQuery = encodeURIComponent(
      "SELECT Id, Header__c, Content__c, Published_Date__c, URL_Name__c FROM Blog_Post__c WHERE Published_Date__c != null AND URL_Name__c != null ORDER BY Published_Date__c DESC LIMIT 3"
    );

    const queryUrl = `${instance_url}/services/data/v58.0/query/?q=${soqlQuery}`;

    console.log('📤 Querying Salesforce for blogs...');

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

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blogs }),
    };

  } catch (error) {
    console.error('❌ Fetch Blogs Function Error:');
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

