/**
 * Netlify Scheduled Function - Bulk Salesforce Sync
 * 
 * This function runs on a schedule (configured in netlify.toml)
 * to automatically sync all Salesforce data using Bulk API
 * 
 * Schedule: Daily at 1:30 AM (configured in netlify.toml)
 */

exports.handler = async (event, context) => {
  console.log('🕐 Scheduled bulk sync triggered at', new Date().toISOString());
  
  try {
    // Get fresh Salesforce token dynamically using the auth function
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const host = event.headers.host || process.env.URL || 'cloudastick.org';
    const authUrl = `${protocol}://${host}/.netlify/functions/salesforceAuth`;
    
    console.log('🔐 Getting fresh Salesforce token...');
    
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
    });
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('❌ Failed to get Salesforce token:', authResponse.status, errorText);
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to authenticate with Salesforce',
          message: `Auth failed: ${authResponse.status} - ${errorText}`
        }),
      };
    }
    
    const authData = await authResponse.json();
    const { access_token, instance_url } = authData;
    
    if (!access_token || !instance_url) {
      console.error('❌ Invalid auth response - missing access_token or instance_url');
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Invalid authentication response',
          message: 'Auth function did not return access_token and instance_url'
        }),
      };
    }
    
    console.log('✅ Got fresh Salesforce token');

    // Construct the sync function URL (reuse protocol and host from above)
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

