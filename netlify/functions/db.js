/**
 * Neon Database Connection Utility
 * Provides connection pool for all Netlify functions
 */

const { neon } = require('@neondatabase/serverless');

// Get database connection string from environment
// Netlify Neon integration provides NETLIFY_DATABASE_URL
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️ NETLIFY_DATABASE_URL or DATABASE_URL not set. Database operations will fail.');
}

// Create connection pool
let sql = null;

function getDb() {
  if (!DATABASE_URL) {
    throw new Error('NETLIFY_DATABASE_URL or DATABASE_URL environment variable is not set');
  }

  if (!sql) {
    sql = neon(DATABASE_URL);
  }

  return sql;
}

/**
 * Initialize database schema
 * Run this once to create all tables
 */
async function initSchema() {
  const db = getDb();

  // Create contacts table
  await db`
    CREATE TABLE IF NOT EXISTS contacts (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      reports_to_id VARCHAR(255),
      reports_to_name VARCHAR(255),
      associated_user__c VARCHAR(255),
      data JSONB,
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create users table
  await db`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      username VARCHAR(255),
      data JSONB,
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create OKRs table
  await db`
    CREATE TABLE IF NOT EXISTS okrs (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      owner__c VARCHAR(255),
      type__c VARCHAR(255),
      status__c VARCHAR(255),
      parent_objective__c VARCHAR(255),
      due_date__c TIMESTAMP,
      department__c VARCHAR(255),
      quarter__c VARCHAR(255),
      progress__c DECIMAL,
      weight__c DECIMAL,
      overall_health__c VARCHAR(255),
      comments__c TEXT,
      created_date TIMESTAMP,
      data JSONB,
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create blog_posts table
  await db`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id VARCHAR(255) PRIMARY KEY,
      header__c VARCHAR(500),
      content__c TEXT,
      published_date__c TIMESTAMP,
      url_name__c VARCHAR(255),
      data JSONB,
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create requirements table
  await db`
    CREATE TABLE IF NOT EXISTS requirements (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      owner_id VARCHAR(255),
      status__c VARCHAR(255),
      description__c TEXT,
      data JSONB,
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create sfdc_projects table
  await db`
    CREATE TABLE IF NOT EXISTS sfdc_projects (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255),
      owner_id VARCHAR(255),
      status__c VARCHAR(255),
      data JSONB,
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create company_leads table
  await db`
    CREATE TABLE IF NOT EXISTS company_leads (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      industry VARCHAR(255) NOT NULL,
      source VARCHAR(255) DEFAULT 'lead-capture-modal',
      user_agent TEXT,
      ip_address VARCHAR(255),
      referer TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create user_tracking table
  await db`
    CREATE TABLE IF NOT EXISTS user_tracking (
      id SERIAL PRIMARY KEY,
      sf_record_id VARCHAR(255),
      sessionId VARCHAR(255),
      browser_info JSONB,
      device_info JSONB,
      location_info JSONB,
      click_events JSONB,
      hover_events JSONB,
      intent_summary TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create indexes for better query performance
  await db`
    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_contacts_reports_to ON contacts(reports_to_id)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_okrs_owner ON okrs(owner__c)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_requirements_owner ON requirements(owner_id)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_company_leads_created ON company_leads(created_at)
  `;
  await db`
    CREATE INDEX IF NOT EXISTS idx_company_leads_company ON company_leads(company_name)
  `;

  console.log('✅ Database schema initialized');
}

module.exports = {
  getDb,
  initSchema,
};

