/**
 * Salesforce Database Operations
 * Handles all database operations for Salesforce data stored in Neon
 */

const { getDb } = require('./db');

/**
 * Map Salesforce object types to database table names
 */
const TABLE_MAP = {
  'Contact': 'contacts',
  'User': 'users',
  'OKR__c': 'okrs',
  'Blog_Post__c': 'blog_posts',
  'Requirement__c': 'requirements',
  'SFDC_Project__c': 'sfdc_projects',
};

/**
 * Save a Salesforce record to the database
 */
async function saveRecord(objectType, record) {
  const db = getDb();
  const tableName = TABLE_MAP[objectType];
  
  if (!tableName) {
    throw new Error(`Unknown object type: ${objectType}`);
  }
  
  const now = new Date().toISOString();
  
  try {
    switch (objectType) {
      case 'Contact':
        await db`
          INSERT INTO contacts (id, name, email, reports_to_id, reports_to_name, associated_user__c, data, synced_at, updated_at)
          VALUES (${record.Id}, ${record.Name}, ${record.Email}, ${record.ReportsToId}, ${record.ReportsTo?.Name}, ${record.Associated_User__c}, ${JSON.stringify(record)}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            reports_to_id = EXCLUDED.reports_to_id,
            reports_to_name = EXCLUDED.reports_to_name,
            associated_user__c = EXCLUDED.associated_user__c,
            data = EXCLUDED.data,
            synced_at = EXCLUDED.synced_at,
            updated_at = EXCLUDED.updated_at
        `;
        break;
        
      case 'User':
        await db`
          INSERT INTO users (id, name, email, username, data, synced_at, updated_at)
          VALUES (${record.Id}, ${record.Name}, ${record.Email}, ${record.Username}, ${JSON.stringify(record)}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            username = EXCLUDED.username,
            data = EXCLUDED.data,
            synced_at = EXCLUDED.synced_at,
            updated_at = EXCLUDED.updated_at
        `;
        break;
        
      case 'OKR__c':
        await db`
          INSERT INTO okrs (id, name, owner__c, type__c, status__c, parent_objective__c, due_date__c, department__c, quarter__c, progress__c, weight__c, overall_health__c, comments__c, created_date, data, synced_at, updated_at)
          VALUES (${record.Id}, ${record.Name}, ${record.Owner__c}, ${record.Type__c}, ${record.Status__c}, ${record.Parent_Objective__c}, ${record.Due_Date__c ? new Date(record.Due_Date__c) : null}, ${record.Department__c}, ${record.Quarter__c}, ${record.Progress__c}, ${record.Weight__c}, ${record.Overall_Health__c}, ${record.Comments__c}, ${record.CreatedDate ? new Date(record.CreatedDate) : null}, ${JSON.stringify(record)}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            owner__c = EXCLUDED.owner__c,
            type__c = EXCLUDED.type__c,
            status__c = EXCLUDED.status__c,
            parent_objective__c = EXCLUDED.parent_objective__c,
            due_date__c = EXCLUDED.due_date__c,
            department__c = EXCLUDED.department__c,
            quarter__c = EXCLUDED.quarter__c,
            progress__c = EXCLUDED.progress__c,
            weight__c = EXCLUDED.weight__c,
            overall_health__c = EXCLUDED.overall_health__c,
            comments__c = EXCLUDED.comments__c,
            created_date = EXCLUDED.created_date,
            data = EXCLUDED.data,
            synced_at = EXCLUDED.synced_at,
            updated_at = EXCLUDED.updated_at
        `;
        break;
        
      case 'Blog_Post__c':
        await db`
          INSERT INTO blog_posts (id, header__c, content__c, published_date__c, url_name__c, data, synced_at, updated_at)
          VALUES (${record.Id}, ${record.Header__c}, ${record.Content__c}, ${record.Published_Date__c ? new Date(record.Published_Date__c) : null}, ${record.URL_Name__c}, ${JSON.stringify(record)}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE SET
            header__c = EXCLUDED.header__c,
            content__c = EXCLUDED.content__c,
            published_date__c = EXCLUDED.published_date__c,
            url_name__c = EXCLUDED.url_name__c,
            data = EXCLUDED.data,
            synced_at = EXCLUDED.synced_at,
            updated_at = EXCLUDED.updated_at
        `;
        break;
        
      case 'Requirement__c':
        await db`
          INSERT INTO requirements (id, name, owner_id, status__c, description__c, data, synced_at, updated_at)
          VALUES (${record.Id}, ${record.Name}, ${record.OwnerId}, ${record.Status__c}, ${record.Description__c}, ${JSON.stringify(record)}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            owner_id = EXCLUDED.owner_id,
            status__c = EXCLUDED.status__c,
            description__c = EXCLUDED.description__c,
            data = EXCLUDED.data,
            synced_at = EXCLUDED.synced_at,
            updated_at = EXCLUDED.updated_at
        `;
        break;
        
      case 'SFDC_Project__c':
        await db`
          INSERT INTO sfdc_projects (id, name, owner_id, status__c, data, synced_at, updated_at)
          VALUES (${record.Id}, ${record.Name}, ${record.OwnerId}, ${record.Status__c}, ${JSON.stringify(record)}, ${now}, ${now})
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            owner_id = EXCLUDED.owner_id,
            status__c = EXCLUDED.status__c,
            data = EXCLUDED.data,
            synced_at = EXCLUDED.synced_at,
            updated_at = EXCLUDED.updated_at
        `;
        break;
        
      default:
        throw new Error(`Unsupported object type: ${objectType}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${objectType} record ${record.Id}:`, error);
    throw error;
  }
}

/**
 * Get a record by ID
 */
async function getRecord(objectType, recordId) {
  const db = getDb();
  const tableName = TABLE_MAP[objectType];
  
  if (!tableName) {
    throw new Error(`Unknown object type: ${objectType}`);
  }
  
  try {
    // Validate table name to prevent SQL injection
    if (!TABLE_MAP[objectType] || TABLE_MAP[objectType] !== tableName) {
      throw new Error(`Invalid table name: ${tableName}`);
    }
    
    // Use parameterized query with validated table name
    // Table name is validated above, so it's safe to use
    const result = await db(`SELECT * FROM "${tableName}" WHERE id = $1`, [recordId]);
    
    if (result.length === 0) {
      return null;
    }
    
    // Return the full JSONB data if available, otherwise reconstruct from columns
    return result[0].data || result[0];
  } catch (error) {
    console.error(`❌ Error getting ${objectType} record ${recordId}:`, error);
    throw error;
  }
}

/**
 * Get all records for an object type
 */
async function getAllRecords(objectType) {
  const db = getDb();
  const tableName = TABLE_MAP[objectType];
  
  if (!tableName) {
    throw new Error(`Unknown object type: ${objectType}`);
  }
  
  try {
    // Validate table name to prevent SQL injection
    if (!TABLE_MAP[objectType] || TABLE_MAP[objectType] !== tableName) {
      throw new Error(`Invalid table name: ${tableName}`);
    }
    
    // Use parameterized query with validated table name
    const result = await db(`SELECT * FROM "${tableName}" ORDER BY updated_at DESC`);
    
    // Return JSONB data if available, otherwise return full record
    return result.map(row => row.data || row);
  } catch (error) {
    console.error(`❌ Error getting all ${objectType} records:`, error);
    throw error;
  }
}

/**
 * Find contact by email
 */
async function findContactByEmail(email) {
  const db = getDb();
  
  try {
    const result = await db`
      SELECT * FROM contacts WHERE LOWER(email) = LOWER(${email}) LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].data || result[0];
  } catch (error) {
    console.error(`❌ Error finding contact by email ${email}:`, error);
    throw error;
  }
}

/**
 * Find contact by Portal_Username__c
 */
async function findContactByUsername(username) {
  const db = getDb();
  
  try {
    // Query contacts and search in JSONB data for Portal_Username__c
    const result = await db`
      SELECT * FROM contacts 
      WHERE LOWER(data->>'Portal_Username__c') = LOWER(${username}) 
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].data || result[0];
  } catch (error) {
    console.error(`❌ Error finding contact by username ${username}:`, error);
    throw error;
  }
}

/**
 * Get OKRs for a user (by owner__c)
 */
async function getOKRsForUser(userId) {
  const db = getDb();
  
  try {
    const result = await db`
      SELECT * FROM okrs WHERE owner__c = ${userId} ORDER BY created_date DESC
    `;
    
    return result.map(row => row.data || row);
  } catch (error) {
    console.error(`❌ Error getting OKRs for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get OKRs for multiple users
 */
async function getOKRsForUsers(userIds) {
  const db = getDb();
  
  try {
    const result = await db`
      SELECT * FROM okrs WHERE owner__c = ANY(${userIds}) ORDER BY created_date DESC
    `;
    
    return result.map(row => row.data || row);
  } catch (error) {
    console.error(`❌ Error getting OKRs for users:`, error);
    throw error;
  }
}

/**
 * Get requirements for a user (by owner_id)
 */
async function getRequirementsForUser(userId) {
  const db = getDb();
  
  try {
    const result = await db`
      SELECT * FROM requirements WHERE owner_id = ${userId} ORDER BY created_at DESC
    `;
    
    return result.map(row => row.data || row);
  } catch (error) {
    console.error(`❌ Error getting requirements for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get requirements for multiple users
 */
async function getRequirementsForUsers(userIds) {
  const db = getDb();
  
  try {
    const result = await db`
      SELECT * FROM requirements WHERE owner_id = ANY(${userIds}) ORDER BY created_at DESC
    `;
    
    return result.map(row => row.data || row);
  } catch (error) {
    console.error(`❌ Error getting requirements for users:`, error);
    throw error;
  }
}

/**
 * Get all contacts with their reports_to relationships
 */
async function getAllContacts() {
  const db = getDb();
  
  try {
    const result = await db`
      SELECT * FROM contacts ORDER BY name
    `;
    
    return result.map(row => row.data || row);
  } catch (error) {
    console.error(`❌ Error getting all contacts:`, error);
    throw error;
  }
}

/**
 * Clear all records for an object type (for bulk sync refresh)
 */
async function clearObjectType(objectType) {
  const db = getDb();
  const tableName = TABLE_MAP[objectType];
  
  if (!tableName) {
    throw new Error(`Unknown object type: ${objectType}`);
  }
  
  try {
    // Validate table name to prevent SQL injection
    if (!TABLE_MAP[objectType] || TABLE_MAP[objectType] !== tableName) {
      throw new Error(`Invalid table name: ${tableName}`);
    }
    
    // Use parameterized query with validated table name
    await db(`DELETE FROM "${tableName}"`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error clearing ${objectType}:`, error);
    throw error;
  }
}

module.exports = {
  saveRecord,
  getRecord,
  getAllRecords,
  findContactByEmail,
  findContactByUsername,
  getOKRsForUser,
  getOKRsForUsers,
  getRequirementsForUser,
  getRequirementsForUsers,
  getAllContacts,
  clearObjectType,
};

