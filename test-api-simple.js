/**
 * Simple API test script for Salesforce Search
 * Can test against production or local Netlify dev server
 * 
 * Usage:
 *   node test-api-simple.js [production|local]
 * 
 * For production testing, you need to:
 *   1. Authenticate with Salesforce in the browser
 *   2. Get credentials from browser console:
 *      localStorage.getItem('salesforce_auth_data')
 *   3. Set environment variables:
 *      export SF_ACCESS_TOKEN="your_token"
 *      export SF_INSTANCE_URL="https://yourinstance.salesforce.com"
 */

const baseUrl = process.argv[2] === 'production' 
  ? 'https://cloudastick.org'
  : 'http://localhost:8888';

const FUNCTION_PATH = '/.netlify/functions/searchSalesforceRecords';

// Get credentials from environment or use test values
const credentials = {
  access_token: process.env.SF_ACCESS_TOKEN || 'test_token',
  instance_url: process.env.SF_INSTANCE_URL || 'https://test.salesforce.com',
};

console.log('🧪 Salesforce Search API Test');
console.log('='.repeat(60));
console.log(`Testing: ${baseUrl}${FUNCTION_PATH}`);
console.log(`Using credentials: ${credentials.access_token === 'test_token' ? 'TEST (will fail)' : 'ENV VARIABLES'}`);
console.log('='.repeat(60));
console.log('');

async function testSearch(objectType, searchTerm) {
  const url = `${baseUrl}${FUNCTION_PATH}`;
  
  console.log(`\n🔍 Testing ${objectType} search: "${searchTerm}"`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: credentials.access_token,
        instance_url: credentials.instance_url,
        searchTerm: searchTerm,
        objectType: objectType,
      }),
    });

    const status = response.status;
    let data;
    
    try {
      const text = await response.text();
      data = JSON.parse(text);
    } catch (e) {
      data = { error: 'Invalid JSON response', raw: e.message };
    }

    console.log(`   Status: ${status}`);
    
    if (status === 200) {
      console.log(`   ✅ SUCCESS`);
      if (data.records) {
        console.log(`   📊 Records found: ${data.records.length}`);
        if (data.records.length > 0) {
          const first = data.records[0];
          console.log(`   📝 First result: ${first.name} (${first.type})`);
          if (first.accountName) {
            console.log(`      Account: ${first.accountName}`);
          }
        }
      }
      return true;
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      if (data.message) {
        console.log(`   Details: ${data.message}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`   💡 Start Netlify dev: netlify dev`);
    }
    return false;
  }
}

async function runTests() {
  console.log('Starting tests...\n');
  
  if (credentials.access_token === 'test_token') {
    console.log('⚠️  Using test credentials - tests will fail with auth errors');
    console.log('   To test with real data:');
    console.log('   1. Set: export SF_ACCESS_TOKEN="your_token"');
    console.log('   2. Set: export SF_INSTANCE_URL="https://instance.salesforce.com"');
    console.log('   3. Run: node test-api-simple.js production\n');
  }

  const results = {
    account: await testSearch('Account', 'Test'),
    opportunity: await testSearch('Opportunity', 'Test'),
    project: await testSearch('SFDC_Project__c', 'deraya'),
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS');
  console.log('='.repeat(60));
  console.log(`Account Search:     ${results.account ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Opportunity Search: ${results.opportunity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Project Search:      ${results.project ? '✅ PASS' : '❌ FAIL'} (deraya)`);
  console.log('='.repeat(60));
}

runTests().catch(console.error);

