/**
 * Test script for Salesforce Search API
 * Tests the actual Netlify function endpoint
 * 
 * Usage:
 *   node test-api-search.js [--local] [--url=<function-url>]
 * 
 * Options:
 *   --local    Test against local Netlify dev server (http://localhost:8888)
 *   --url      Test against specific URL (default: uses local or production)
 */

const BASE_URL_LOCAL = 'http://localhost:8888';
const BASE_URL_PROD = 'https://cloudastick.org'; // Update with your actual domain if different

// Parse command line arguments
const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const urlArg = args.find(arg => arg.startsWith('--url='));
const baseUrl = urlArg 
  ? urlArg.split('=')[1] 
  : (isLocal ? BASE_URL_LOCAL : BASE_URL_PROD);

const FUNCTION_PATH = '/.netlify/functions/searchSalesforceRecords';

console.log('🧪 Testing Salesforce Search API');
console.log('='.repeat(60));
console.log(`Base URL: ${baseUrl}`);
console.log(`Function Path: ${FUNCTION_PATH}`);
console.log(`Full URL: ${baseUrl}${FUNCTION_PATH}`);
console.log('='.repeat(60));
console.log('');

// Test data - you'll need to provide real credentials for actual testing
const testCredentials = {
  // These should be real Salesforce credentials for actual testing
  // For now, we'll test the error handling with invalid/missing credentials
  access_token: process.env.SF_ACCESS_TOKEN || 'test_token_12345',
  instance_url: process.env.SF_INSTANCE_URL || 'https://test.salesforce.com',
};

/**
 * Test the API endpoint
 */
async function testAPI(objectType, searchTerm) {
  const url = `${baseUrl}${FUNCTION_PATH}`;
  
  const payload = {
    access_token: testCredentials.access_token,
    instance_url: testCredentials.instance_url,
    searchTerm: searchTerm,
    objectType: objectType,
  };

  console.log(`\n📤 Testing ${objectType} search for: "${searchTerm}"`);
  console.log(`   URL: ${url}`);
  console.log(`   Payload:`, JSON.stringify({ ...payload, access_token: '***' }, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const status = response.status;
    const statusText = response.statusText;

    console.log(`\n📥 Response Status: ${status} ${statusText}`);

    // Try to parse response
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        console.log('   ⚠️  Response is not valid JSON');
        responseData = { raw: text.substring(0, 200) };
      }
    } else {
      const text = await response.text();
      responseData = { raw: text.substring(0, 200) };
    }

    console.log(`   Response Data:`, JSON.stringify(responseData, null, 2));

    // Analyze response
    if (status === 200) {
      console.log(`   ✅ SUCCESS - Search completed`);
      if (responseData.records) {
        console.log(`   📊 Found ${responseData.records.length} records`);
        if (responseData.records.length > 0) {
          console.log(`   📝 First record:`, JSON.stringify(responseData.records[0], null, 2));
        }
      }
      return { success: true, status, data: responseData };
    } else if (status === 400) {
      console.log(`   ⚠️  CLIENT ERROR - Invalid request`);
      return { success: false, status, error: responseData.error || responseData.message };
    } else if (status === 500) {
      console.log(`   ❌ SERVER ERROR - Function error`);
      return { success: false, status, error: responseData.error || responseData.message };
    } else {
      console.log(`   ⚠️  UNEXPECTED STATUS`);
      return { success: false, status, error: responseData };
    }

  } catch (error) {
    console.log(`   ❌ NETWORK ERROR`);
    console.log(`   Error:`, error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`   💡 Tip: Make sure Netlify dev server is running:`);
      console.log(`      netlify dev`);
    }
    
    return { success: false, error: error.message };
  }
}

/**
 * Test input validation
 */
async function testInputValidation() {
  console.log('\n' + '='.repeat(60));
  console.log('TESTING INPUT VALIDATION');
  console.log('='.repeat(60));

  const url = `${baseUrl}${FUNCTION_PATH}`;

  // Test 1: Missing access_token
  console.log('\n📋 Test 1: Missing access_token');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instance_url: 'https://test.salesforce.com',
        searchTerm: 'test',
        objectType: 'Account',
      }),
    });
    const data = await response.json();
    if (response.status === 400 && data.error?.includes('access_token')) {
      console.log('   ✅ PASSED - Correctly rejected missing access_token');
    } else {
      console.log('   ❌ FAILED - Should return 400 for missing access_token');
    }
  } catch (error) {
    console.log('   ⚠️  Could not test (connection error)');
  }

  // Test 2: Missing instance_url
  console.log('\n📋 Test 2: Missing instance_url');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: 'test_token',
        searchTerm: 'test',
        objectType: 'Account',
      }),
    });
    const data = await response.json();
    if (response.status === 400 && data.error?.includes('instance_url')) {
      console.log('   ✅ PASSED - Correctly rejected missing instance_url');
    } else {
      console.log('   ❌ FAILED - Should return 400 for missing instance_url');
    }
  } catch (error) {
    console.log('   ⚠️  Could not test (connection error)');
  }

  // Test 3: Short search term
  console.log('\n📋 Test 3: Search term too short (< 2 characters)');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: 'test_token',
        instance_url: 'https://test.salesforce.com',
        searchTerm: 'A',
        objectType: 'Account',
      }),
    });
    const data = await response.json();
    if (response.status === 400 && data.error?.includes('2 characters')) {
      console.log('   ✅ PASSED - Correctly rejected short search term');
    } else {
      console.log('   ❌ FAILED - Should return 400 for short search term');
    }
  } catch (error) {
    console.log('   ⚠️  Could not test (connection error)');
  }

  // Test 4: Invalid object type
  console.log('\n📋 Test 4: Invalid object type');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: 'test_token',
        instance_url: 'https://test.salesforce.com',
        searchTerm: 'test',
        objectType: 'InvalidType',
      }),
    });
    const data = await response.json();
    if (response.status === 400 && data.error?.includes('object type')) {
      console.log('   ✅ PASSED - Correctly rejected invalid object type');
    } else {
      console.log('   ❌ FAILED - Should return 400 for invalid object type');
    }
  } catch (error) {
    console.log('   ⚠️  Could not test (connection error)');
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('\n🚀 Starting API Tests...\n');

  // Test input validation first
  await testInputValidation();

  // Test actual searches (will fail with invalid credentials, but tests the function structure)
  console.log('\n' + '='.repeat(60));
  console.log('TESTING SEARCH FUNCTIONALITY');
  console.log('='.repeat(60));
  console.log('\n⚠️  Note: These tests will fail with authentication errors');
  console.log('   unless you provide valid Salesforce credentials.');
  console.log('   Set environment variables:');
  console.log('   - SF_ACCESS_TOKEN');
  console.log('   - SF_INSTANCE_URL\n');

  // Test Account search
  const accountResult = await testAPI('Account', 'Test');

  // Test Opportunity search
  const opportunityResult = await testAPI('Opportunity', 'Test');

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Account Search: ${accountResult.success ? '✅' : '❌'} (Status: ${accountResult.status || 'N/A'})`);
  console.log(`Opportunity Search: ${opportunityResult.success ? '✅' : '❌'} (Status: ${opportunityResult.status || 'N/A'})`);
  console.log('='.repeat(60));

  if (!accountResult.success && accountResult.error?.includes('authentication')) {
    console.log('\n💡 To test with real data:');
    console.log('   1. Authenticate with Salesforce in the app');
    console.log('   2. Get access_token and instance_url from browser localStorage');
    console.log('   3. Set environment variables:');
    console.log('      export SF_ACCESS_TOKEN="your_token"');
    console.log('      export SF_INSTANCE_URL="https://yourinstance.salesforce.com"');
    console.log('   4. Run: node test-api-search.js --local');
  }
}

// Run tests
runTests().catch(console.error);

