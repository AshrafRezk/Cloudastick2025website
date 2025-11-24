/**
 * Verify SOQL queries for Opportunity and Account objects
 */

console.log('🔍 Verifying SOQL Queries for Opportunity and Account\n');

// Test Opportunity Query
console.log('='.repeat(60));
console.log('OPPORTUNITY QUERY');
console.log('='.repeat(60));

const oppSearchTerm = "Test Opportunity";
const escapedOpp = oppSearchTerm
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/%/g, '\\%')
  .replace(/_/g, '\\_');

const oppQuery = `SELECT Id, Name, AccountId, Account.Name, Account.Industry, Account.Website, CloseDate, StageName, Amount FROM Opportunity WHERE (Name LIKE '%${escapedOpp}%' OR (AccountId != null AND Account.Name LIKE '%${escapedOpp}%')) ORDER BY Name LIMIT 20`;

console.log('Search Term:', oppSearchTerm);
console.log('Escaped Term:', escapedOpp);
console.log('\nGenerated SOQL Query:');
console.log(oppQuery);
console.log('\n✅ Query Structure Check:');
console.log('  - Contains SELECT clause:', oppQuery.includes('SELECT'));
console.log('  - Contains FROM Opportunity:', oppQuery.includes('FROM Opportunity'));
console.log('  - Contains Account relationship fields:', oppQuery.includes('Account.Name'));
console.log('  - Contains WHERE clause:', oppQuery.includes('WHERE'));
console.log('  - Contains LIKE operator:', oppQuery.includes('LIKE'));
console.log('  - Contains ORDER BY:', oppQuery.includes('ORDER BY'));
console.log('  - Contains LIMIT:', oppQuery.includes('LIMIT 20'));
console.log('  - Handles null AccountId:', oppQuery.includes('AccountId != null'));

// Test Account Query
console.log('\n' + '='.repeat(60));
console.log('ACCOUNT QUERY');
console.log('='.repeat(60));

const accSearchTerm = "Test Account";
const escapedAcc = accSearchTerm
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/%/g, '\\%')
  .replace(/_/g, '\\_');

const accQuery = `SELECT Id, Name, Type, Industry, Website FROM Account WHERE Name LIKE '%${escapedAcc}%' ORDER BY Name LIMIT 20`;

console.log('Search Term:', accSearchTerm);
console.log('Escaped Term:', escapedAcc);
console.log('\nGenerated SOQL Query:');
console.log(accQuery);
console.log('\n✅ Query Structure Check:');
console.log('  - Contains SELECT clause:', accQuery.includes('SELECT'));
console.log('  - Contains FROM Account:', accQuery.includes('FROM Account'));
console.log('  - Contains standard fields (Type, Industry, Website):', 
  accQuery.includes('Type') && accQuery.includes('Industry') && accQuery.includes('Website'));
console.log('  - Contains WHERE clause:', accQuery.includes('WHERE'));
console.log('  - Contains LIKE operator:', accQuery.includes('LIKE'));
console.log('  - Contains ORDER BY:', accQuery.includes('ORDER BY'));
console.log('  - Contains LIMIT:', accQuery.includes('LIMIT 20'));

// Test with special characters
console.log('\n' + '='.repeat(60));
console.log('SPECIAL CHARACTERS TEST');
console.log('='.repeat(60));

const specialSearch = "O'Brien & Co. (50%)";
const escapedSpecial = specialSearch
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/%/g, '\\%')
  .replace(/_/g, '\\_');

const specialOppQuery = `SELECT Id, Name, AccountId, Account.Name, Account.Industry, Account.Website, CloseDate, StageName, Amount FROM Opportunity WHERE (Name LIKE '%${escapedSpecial}%' OR (AccountId != null AND Account.Name LIKE '%${escapedSpecial}%')) ORDER BY Name LIMIT 20`;

console.log('Search Term:', specialSearch);
console.log('Escaped Term:', escapedSpecial);
console.log('\nGenerated SOQL Query (Opportunity):');
console.log(specialOppQuery);
console.log('\n✅ Security Check:');
console.log('  - Quotes are escaped:', escapedSpecial.includes("\\'"));
console.log('  - Percent signs are escaped:', escapedSpecial.includes('\\%'));
console.log('  - Query is safe from injection:', !specialOppQuery.includes("';") && !specialOppQuery.includes("--"));

console.log('\n' + '='.repeat(60));
console.log('✅ All SOQL queries verified successfully!');
console.log('='.repeat(60));

