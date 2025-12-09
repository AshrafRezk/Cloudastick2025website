/**
 * Netlify Scheduled Function - Bulk Salesforce Sync
 * 
 * This function runs on a schedule (configured in netlify.toml)
 * to automatically sync all Salesforce data using Bulk API
 * 
 * Schedule: Every 6 hours (configurable in netlify.toml)
 */

exports.handler = async (event, context) => {
  console.log('🕐 Scheduled bulk sync triggered at', new Date().toISOString());
  
  try {
    // Get Salesforce credentials from environment variables
    // Note: You'll need to store a long-lived access token or use OAuth flow
    const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
    const instance_url = process.env.SALESFORCE_INSTANCE_URL;
    
    if (!access_token || !instance_url) {
      console.error('❌ Missing Salesforce credentials in environment variables');
      console.error('Set SALESFORCE_ACCESS_TOKEN and SALESFORCE_INSTANCE_URL');
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Missing Salesforce credentials',
          message: 'Set SALESFORCE_ACCESS_TOKEN and SALESFORCE_INSTANCE_URL environment variables'
        }),
      };
    }

    // Construct the sync function URL
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const host = event.headers.host || process.env.URL || 'cloudastick.org';
    const syncUrl = `${protocol}://${host}/.netlify/functions/syncSalesforceBulk`;
    
    console.log('📞 Calling sync function:', syncUrl);
    
    // Call the sync function
    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token,
        instance_url,
        useBulkAPI: true,
        clearCacheFirst: true, // Fresh sync each time
        objects: [
          'Contact',
          'User',
          'OKR__c',
          'Blog_Post__c',
          'Requirement__c',
          'SFDC_Project__c',
        ],
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Sync function failed:', response.status, errorText);
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: 'Sync function failed',
          status: response.status,
          message: errorText
        }),
      };
    }
    
    const result = await response.json();
    console.log('✅ Scheduled sync complete:', JSON.stringify(result, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Bulk sync completed successfully',
        result: result.results
      }),
    };
  } catch (error) {
    console.error('❌ Error in scheduled sync:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Scheduled sync failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
    };
  }
};

