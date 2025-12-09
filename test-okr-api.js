/**
 * OKR API test script
 * Tests OKR fetching and creation APIs
 * 
 * Usage:
 *   node test-okr-api.js [production|local] [contactId]
 * 
 * For production testing, you need to:
 *   1. Authenticate with Salesforce in the browser
 *   2. Get credentials from browser console:
 *      localStorage.getItem('salesforce_auth_data')
 *   3. Set environment variables:
 *      export SF_ACCESS_TOKEN="your_token"
 *      export SF_INSTANCE_URL="https://yourinstance.salesforce.com"
 *      export SF_CONTACT_ID="003..." (optional, will try to find one if not provided)
 */

const baseUrl = process.argv[2] === 'production' 
  ? 'https://cloudastick.org'
  : 'http://localhost:8888';

const contactId = process.argv[3] || process.env.SF_CONTACT_ID;

// Get credentials from environment or use test values
const credentials = {
  access_token: process.env.SF_ACCESS_TOKEN || 'test_token',
  instance_url: process.env.SF_INSTANCE_URL || 'https://test.salesforce.com',
};

console.log('🧪 OKR API Test');
console.log('='.repeat(60));
console.log(`Testing: ${baseUrl}`);
console.log(`Using credentials: ${credentials.access_token === 'test_token' ? 'TEST (will fail)' : 'ENV VARIABLES'}`);
console.log(`Contact ID: ${contactId || 'NOT PROVIDED (will try to find one)'}`);
console.log('='.repeat(60));
console.log('');

async function testGetTeamHierarchy(contactId) {
  const url = `${baseUrl}/.netlify/functions/getTeamHierarchy`;
  
  console.log(`\n🔍 Testing getTeamHierarchy for Contact: ${contactId || 'AUTO'}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: credentials.access_token,
        instance_url: credentials.instance_url,
        contactId: contactId || '003000000000000AAA', // Dummy ID if not provided
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
    
    if (status === 200 && data.success) {
      console.log(`   ✅ SUCCESS`);
      const member = data.data;
      console.log(`   📊 Contact: ${member.name} (${member.email})`);
      console.log(`   📊 OKRs: ${member.okrs?.length || 0}`);
      console.log(`   📊 Associated User ID: ${member.associatedUserId || 'NONE'}`);
      
      if (member.okrs && member.okrs.length > 0) {
        console.log(`   📋 OKR Details:`);
        member.okrs.forEach((okr, idx) => {
          console.log(`      ${idx + 1}. ${okr.objective || okr.name}`);
          console.log(`         Status: ${okr.status}, Progress: ${okr.progress}%`);
          console.log(`         Key Results: ${okr.keyResults?.length || 0}`);
        });
      } else {
        console.log(`   ⚠️  No OKRs found for this contact`);
      }
      
      return { success: true, data: member };
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      if (data.message) {
        console.log(`   Details: ${data.message}`);
      }
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    if (error.code === 'ECONNREFUSED') {
      console.log(`   💡 Start Netlify dev: netlify dev`);
    }
    return { success: false, error: error.message };
  }
}

async function testGetOkrMetadata() {
  const url = `${baseUrl}/.netlify/functions/getOkrMetadata`;
  
  console.log(`\n🔍 Testing getOkrMetadata`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: credentials.access_token,
        instance_url: credentials.instance_url,
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
    
    if (status === 200 && data.success) {
      console.log(`   ✅ SUCCESS`);
      console.log(`   📊 OKR Object: ${data.okrObject || 'NOT FOUND'}`);
      console.log(`   📊 KR Object: ${data.krObject || 'NOT FOUND'}`);
      console.log(`   📊 OKR Status Options: ${data.picklists?.okrStatus?.join(', ') || 'NONE'}`);
      console.log(`   📊 OKR Period Options: ${data.picklists?.okrPeriod?.join(', ') || 'NONE'}`);
      return { success: true, data };
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testCreateOKR(contactId) {
  const url = `${baseUrl}/.netlify/functions/createOKR`;
  
  const testObjective = {
    contactId: contactId,
    objective: `Test Objective ${new Date().toISOString()}`,
    status: 'In Progress',
    period: 'Q1',
    year: 2025,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
  };
  
  console.log(`\n🔍 Testing createOKR`);
  console.log(`   Objective: ${testObjective.objective}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: credentials.access_token,
        instance_url: credentials.instance_url,
        ...testObjective,
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
    
    if (status === 200 && data.success) {
      console.log(`   ✅ SUCCESS`);
      console.log(`   📊 Created OKR ID: ${data.id}`);
      console.log(`   📊 Object: ${data.object}`);
      return { success: true, data, okrId: data.id };
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      if (data.message) {
        console.log(`   Details: ${data.message}`);
      }
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testCreateKeyResult(okrId) {
  const url = `${baseUrl}/.netlify/functions/createKeyResult`;
  
  const testKR = {
    okrId: okrId,
    name: `Test Key Result ${new Date().toISOString()}`,
    description: 'Test description',
    target: 100,
    currentValue: 25,
    unit: 'Units',
    status: 'In Progress',
  };
  
  console.log(`\n🔍 Testing createKeyResult`);
  console.log(`   Key Result: ${testKR.name}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: credentials.access_token,
        instance_url: credentials.instance_url,
        ...testKR,
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
    
    if (status === 200 && data.success) {
      console.log(`   ✅ SUCCESS`);
      console.log(`   📊 Created KR ID: ${data.id}`);
      console.log(`   📊 Object: ${data.object}`);
      return { success: true, data };
    } else {
      console.log(`   ❌ FAILED`);
      console.log(`   Error: ${data.error || data.message || 'Unknown error'}`);
      if (data.message) {
        console.log(`   Details: ${data.message}`);
      }
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function findContactId() {
  // Try to query for a contact with Associated_User__c
  console.log(`\n🔍 Attempting to find a Contact ID with Associated_User__c...`);
  
  try {
    const query = `SELECT Id, Name, Email, Associated_User__c FROM Contact WHERE Associated_User__c != null LIMIT 1`;
    const encoded = encodeURIComponent(query);
    const url = `${credentials.instance_url}/services/data/v58.0/query/?q=${encoded}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const contact = data.records[0];
        console.log(`   ✅ Found: ${contact.Name} (${contact.Id})`);
        console.log(`   📊 Associated User: ${contact.Associated_User__c}`);
        return contact.Id;
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Could not auto-find contact: ${error.message}`);
  }
  
  return null;
}

async function runTests() {
  console.log('Starting tests...\n');
  
  if (credentials.access_token === 'test_token') {
    console.log('⚠️  Using test credentials - tests will fail with auth errors');
    console.log('   To test with real data:');
    console.log('   1. Set: export SF_ACCESS_TOKEN="your_token"');
    console.log('   2. Set: export SF_INSTANCE_URL="https://instance.salesforce.com"');
    console.log('   3. Set: export SF_CONTACT_ID="003..." (optional)');
    console.log('   4. Run: node test-okr-api.js production\n');
  }

  const results = {
    metadata: await testGetOkrMetadata(),
  };

  // Try to get or find a contact ID
  let testContactId = contactId;
  if (!testContactId && credentials.access_token !== 'test_token') {
    testContactId = await findContactId();
  }

  if (testContactId) {
    const hierarchyResult = await testGetTeamHierarchy(testContactId);
    results.hierarchy = hierarchyResult;
    
    // Test creation if we have a contact ID
    if (hierarchyResult.success) {
      const createResult = await testCreateOKR(testContactId);
      results.createOKR = createResult;
      
      if (createResult.success && createResult.okrId) {
        results.createKR = await testCreateKeyResult(createResult.okrId);
      }
    }
  } else {
    console.log('\n⚠️  No Contact ID available - skipping hierarchy and creation tests');
    console.log('   Provide a Contact ID as argument or set SF_CONTACT_ID env var');
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS');
  console.log('='.repeat(60));
  console.log(`Metadata:        ${results.metadata.success ? '✅ PASS' : '❌ FAIL'}`);
  if (results.hierarchy) {
    console.log(`Get Hierarchy:   ${results.hierarchy.success ? '✅ PASS' : '❌ FAIL'}`);
    if (results.hierarchy.success && results.hierarchy.data) {
      console.log(`   OKRs Found: ${results.hierarchy.data.okrs?.length || 0}`);
    }
  }
  if (results.createOKR) {
    console.log(`Create OKR:      ${results.createOKR.success ? '✅ PASS' : '❌ FAIL'}`);
  }
  if (results.createKR) {
    console.log(`Create Key Result: ${results.createKR.success ? '✅ PASS' : '❌ FAIL'}`);
  }
  console.log('='.repeat(60));
}

runTests().catch(console.error);

