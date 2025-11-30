/**
 * Test script to debug Learning Material Instances for Alyaa Hafez
 * Run with: node test-learning-instances.js
 */

// This would need to be run in a Node.js environment with access to Salesforce
// For now, let's create a script that can help debug the actual query

const testContactId = '003xx000004Tabc'; // Replace with actual Contact ID for Alyaa Hafez

console.log('Testing Learning Material Instance queries for Alyaa Hafez');
console.log('Contact ID:', testContactId);
console.log('\n--- Test Query Variations ---\n');

// Test different field names
const fieldNames = ['Learner__c', 'Contact__c', 'Portal_User__c'];

fieldNames.forEach(fieldName => {
  console.log(`\n1. Query with field: ${fieldName} (without Is_Active filter)`);
  const query1 = `SELECT Id, Name, ${fieldName}, Learning_Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Learning_Material__r.Id, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material__r.Material_Type__c, Learning_Material__r.Material_URL__c, Learning_Material__r.Duration__c, Learning_Material__r.Category__c, Learning_Material__r.Is_Active__c, Learning_Material__r.Parent_Material__c, Learning_Material__r.Parent_Material__r.Id, Learning_Material__r.Parent_Material__r.Title__c FROM Learning_Material_Instance__c WHERE ${fieldName} = '${testContactId}' ORDER BY CreatedDate ASC`;
  console.log(query1);
  
  console.log(`\n2. Query with field: ${fieldName} (with Is_Active filter)`);
  const query2 = `SELECT Id, Name, ${fieldName}, Learning_Material__c, Progress__c, Status__c, Score__c, Started_On__c, Completed_On__c, CreatedDate, Learning_Material__r.Id, Learning_Material__r.Title__c, Learning_Material__r.Description__c, Learning_Material__r.Material_Type__c, Learning_Material__r.Material_URL__c, Learning_Material__r.Duration__c, Learning_Material__r.Category__c, Learning_Material__r.Is_Active__c, Learning_Material__r.Parent_Material__c, Learning_Material__r.Parent_Material__r.Id, Learning_Material__r.Parent_Material__r.Title__c FROM Learning_Material_Instance__c WHERE ${fieldName} = '${testContactId}' AND Learning_Material__r.Is_Active__c = true ORDER BY CreatedDate ASC`;
  console.log(query2);
});

console.log('\n--- Instructions ---');
console.log('1. Get the actual Contact ID for Alyaa Hafez from Salesforce');
console.log('2. Update testContactId in this script');
console.log('3. Run these queries in Salesforce Developer Console or Workbench');
console.log('4. Check which field name works and what records are returned');

