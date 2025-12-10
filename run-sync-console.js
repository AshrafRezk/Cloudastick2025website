/**
 * Browser Console Script to Run Salesforce Bulk Sync
 * 
 * Copy and paste this entire script into your browser console
 * while on your cloudastick.org website (after logging in)
 */

(async function runSyncFromConsole() {
  console.log('🔄 Starting Salesforce Bulk Sync...');
  
  try {
    // Get credentials from localStorage
    const stored = localStorage.getItem('salesforce_auth_data');
    const expiresAt = localStorage.getItem('salesforce_auth_expires_at');
    
    if (!stored) {
      console.error('❌ No Salesforce credentials found. Please log in first.');
      return;
    }

    const authData = JSON.parse(stored);
    
    if (!authData.access_token || !authData.instance_url) {
      console.error('❌ Invalid credentials format.');
      return;
    }

    // Check if token is expired
    if (expiresAt) {
      const expiryTime = parseInt(expiresAt, 10);
      if (Date.now() >= expiryTime) {
        console.error('⚠️ Token expired. Please refresh your login.');
        return;
      }
      const expiresIn = Math.round((expiryTime - Date.now()) / 1000 / 60);
      console.log(`✅ Token expires in ${expiresIn} minutes`);
    }

    console.log(`📍 Instance: ${authData.instance_url}`);
    console.log('🔄 Running sync... (this may take 30-60 seconds)');

    // Call sync function
    const response = await fetch('/.netlify/functions/syncSalesforceBulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: authData.access_token,
        instance_url: authData.instance_url,
        clearCacheFirst: true,
      }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      const totalCached = result.results?.totalRecordsCached || 0;
      const duration = result.results?.duration || 0;
      const objects = result.results?.objects || {};
      
      console.log('\n✅ Sync Complete!');
      console.log(`📊 Total records cached: ${totalCached}`);
      console.log(`⏱️ Duration: ${duration}ms`);
      console.log('\n📦 Breakdown by object:');
      
      for (const [objectType, stats] of Object.entries(objects)) {
        console.log(`   ${objectType}: ${stats.cached || 0} records`);
      }
      
      console.log('\n📋 Full result:', result);
    } else {
      console.error('❌ Sync failed:', result.error || result.message);
      console.error('Full response:', result);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();

