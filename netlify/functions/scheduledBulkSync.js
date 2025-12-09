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
    
    console.log('📞 Calling sync function (fire-and-forget):', syncUrl);
    
    // Call the sync function asynchronously (don't wait for it to complete)
    // This prevents the scheduled function from timing out
    fetch(syncUrl, {
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
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          console.error('❌ Sync function failed:', response.status, errorText);
        });
      }
      return response.json().then(result => {
        console.log('✅ Scheduled sync complete:', JSON.stringify(result, null, 2));
      });
    })
    .catch(error => {
      console.error('❌ Error calling sync function:', error.message);
    });
    
    // Return immediately - don't wait for sync to complete
    // The sync will continue running in the background
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Bulk sync started successfully (running in background)',
        note: 'Check syncSalesforceBulk function logs for sync progress'
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

