/**
 * Salesforce Cache Manager
 * Centralized caching system for all Salesforce data
 * 
 * Objects cached:
 * - Contacts (Contact)
 * - Users (User)
 * - OKRs (OKR__c)
 * - Blogs (Blog_Post__c)
 * - Requirements (Requirement__c)
 * - Projects (SFDC_Project__c)
 * - Accounts (Account)
 * - Team Hierarchy (custom structure)
 * 
 * Cache Strategy:
 * - Cache TTL: 24 hours (configurable per object type)
 * - Stale-while-revalidate: Serve stale cache (48 hours) if API fails
 * - Cache invalidation via webhooks (CDC/Platform Events)
 */

const { getStore } = require('@netlify/blobs');

// Cache store name for Salesforce data
const CACHE_STORE_NAME = 'salesforce-cache';

// Cache TTL in milliseconds (24 hours)
const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;
const STALE_CACHE_TTL = DEFAULT_CACHE_TTL * 2; // 48 hours

// Object-specific cache TTLs (in milliseconds)
const CACHE_TTLS = {
  'Contact': DEFAULT_CACHE_TTL,
  'User': DEFAULT_CACHE_TTL * 7, // Users change less frequently
  'OKR__c': DEFAULT_CACHE_TTL, // OKRs change frequently
  'Blog_Post__c': DEFAULT_CACHE_TTL, // Blogs change moderately
  'Requirement__c': DEFAULT_CACHE_TTL,
  'SFDC_Project__c': DEFAULT_CACHE_TTL,
  'Account': DEFAULT_CACHE_TTL * 7, // Accounts change less frequently
  'team-hierarchy': DEFAULT_CACHE_TTL,
  'all-contacts': DEFAULT_CACHE_TTL,
  'all-users': DEFAULT_CACHE_TTL * 7,
  'all-okrs': DEFAULT_CACHE_TTL,
  'all-blogs': DEFAULT_CACHE_TTL,
  'all-requirements': DEFAULT_CACHE_TTL,
};

/**
 * Get cache store instance
 */
function getCacheStore() {
  return getStore(CACHE_STORE_NAME);
}

/**
 * Generate cache key for a record
 * @param {string} objectType - Salesforce object API name
 * @param {string} recordId - Salesforce record ID
 * @returns {string} Cache key
 */
function getCacheKey(objectType, recordId) {
  return `${objectType.toLowerCase()}-${recordId}`;
}

/**
 * Generate cache key for a list/query
 * @param {string} objectType - Salesforce object API name
 * @param {string} queryHash - Hash of the query parameters
 * @returns {string} Cache key
 */
function getListCacheKey(objectType, queryHash) {
  return `list-${objectType.toLowerCase()}-${queryHash}`;
}

/**
 * Generate a simple hash from a string (for query hashing)
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get cached data
 * @param {string} cacheKey - Cache key
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<{data: any, isStale: boolean} | null>}
 */
async function getCache(cacheKey, ttl = DEFAULT_CACHE_TTL) {
  try {
    const store = getCacheStore();
    const cached = await store.get(cacheKey, { type: 'json' });
    
    if (!cached || !cached.data || !cached.timestamp) {
      return null;
    }
    
    const age = Date.now() - cached.timestamp;
    const staleAge = ttl * 2; // Consider stale after 2x TTL
    
    if (age < ttl) {
      // Fresh cache
      return {
        data: cached.data,
        isStale: false,
        age: age,
      };
    } else if (age < staleAge) {
      // Stale cache (can be used as fallback)
      return {
        data: cached.data,
        isStale: true,
        age: age,
      };
    } else {
      // Expired cache
      return null;
    }
  } catch (error) {
    console.warn(`⚠️ Cache get error for key ${cacheKey}:`, error.message);
    return null;
  }
}

/**
 * Set cached data
 * @param {string} cacheKey - Cache key
 * @param {any} data - Data to cache
 * @param {object} metadata - Optional metadata
 */
async function setCache(cacheKey, data, metadata = {}) {
  try {
    const store = getCacheStore();
    await store.setJSON(cacheKey, {
      data,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        cachedAt: new Date().toISOString(),
      },
    });
    console.log(`💾 Cached data: ${cacheKey}`);
  } catch (error) {
    console.warn(`⚠️ Cache set error for key ${cacheKey}:`, error.message);
  }
}

/**
 * Delete cached data
 * @param {string} cacheKey - Cache key
 */
async function deleteCache(cacheKey) {
  try {
    const store = getCacheStore();
    await store.delete(cacheKey);
    console.log(`🗑️ Deleted cache: ${cacheKey}`);
  } catch (error) {
    console.warn(`⚠️ Cache delete error for key ${cacheKey}:`, error.message);
  }
}

/**
 * Invalidate cache for a specific record
 * @param {string} objectType - Salesforce object API name
 * @param {string} recordId - Salesforce record ID
 */
async function invalidateRecord(objectType, recordId) {
  const cacheKey = getCacheKey(objectType, recordId);
  await deleteCache(cacheKey);
  console.log(`🔄 Invalidated cache for ${objectType} record: ${recordId}`);
}

/**
 * Invalidate all cache for an object type
 * @param {string} objectType - Salesforce object API name
 */
async function invalidateObjectType(objectType) {
  try {
    const store = getCacheStore();
    const prefix = objectType.toLowerCase() + '-';
    
    // List all keys with this prefix
    let deletedCount = 0;
    for await (const blob of store.list({ prefix })) {
      await store.delete(blob.key);
      deletedCount++;
    }
    
    // Also delete list caches
    const listPrefix = `list-${objectType.toLowerCase()}-`;
    for await (const blob of store.list({ prefix: listPrefix })) {
      await store.delete(blob.key);
      deletedCount++;
    }
    
    console.log(`🔄 Invalidated ${deletedCount} cache entries for ${objectType}`);
  } catch (error) {
    console.error(`❌ Error invalidating object type ${objectType}:`, error.message);
  }
}

/**
 * Invalidate related caches (e.g., when a Contact changes, invalidate team hierarchy)
 * @param {string} objectType - Salesforce object API name
 * @param {string} recordId - Salesforce record ID
 */
async function invalidateRelatedCaches(objectType, recordId) {
  // Invalidate the specific record
  await invalidateRecord(objectType, recordId);
  
  // Invalidate related caches based on object type
  switch (objectType) {
    case 'Contact':
      // Invalidate team hierarchy caches
      await invalidateObjectType('team-hierarchy');
      await invalidateObjectType('all-contacts');
      break;
      
    case 'User':
      // Users affect OKRs and team hierarchy
      await invalidateObjectType('all-users');
      // Invalidate OKRs that might reference this user
      await invalidateObjectType('all-okrs');
      break;
      
    case 'OKR__c':
      // OKRs affect team member data
      await invalidateObjectType('all-okrs');
      // If parent OKR changes, might need to invalidate child OKRs too
      break;
      
    case 'Blog_Post__c':
      await invalidateObjectType('all-blogs');
      break;
      
    case 'Requirement__c':
      await invalidateObjectType('all-requirements');
      break;
      
    default:
      // Invalidate object type lists
      await invalidateObjectType(objectType);
  }
}

/**
 * Get cache stats
 */
async function getCacheStats() {
  try {
    const store = getCacheStore();
    const stats = {
      totalKeys: 0,
      byObjectType: {},
      oldestCache: null,
      newestCache: null,
    };
    
    for await (const blob of store.list()) {
      stats.totalKeys++;
      
      try {
        const cached = await store.get(blob.key, { type: 'json' });
        if (cached && cached.timestamp) {
          const age = Date.now() - cached.timestamp;
          const objectType = blob.key.split('-')[0];
          
          if (!stats.byObjectType[objectType]) {
            stats.byObjectType[objectType] = { count: 0, totalAge: 0 };
          }
          
          stats.byObjectType[objectType].count++;
          stats.byObjectType[objectType].totalAge += age;
          
          if (!stats.oldestCache || age > (Date.now() - stats.oldestCache.timestamp)) {
            stats.oldestCache = { key: blob.key, timestamp: cached.timestamp, age };
          }
          
          if (!stats.newestCache || age < (Date.now() - stats.newestCache.timestamp)) {
            stats.newestCache = { key: blob.key, timestamp: cached.timestamp, age };
          }
        }
      } catch (e) {
        // Skip invalid cache entries
      }
    }
    
    // Calculate average age per object type
    for (const objectType in stats.byObjectType) {
      const typeStats = stats.byObjectType[objectType];
      typeStats.averageAge = Math.round(typeStats.totalAge / typeStats.count);
      delete typeStats.totalAge;
    }
    
    return stats;
  } catch (error) {
    console.error('❌ Error getting cache stats:', error.message);
    return null;
  }
}

/**
 * Clear all cache
 */
async function clearAllCache() {
  try {
    const store = getCacheStore();
    let deletedCount = 0;
    
    for await (const blob of store.list()) {
      await store.delete(blob.key);
      deletedCount++;
    }
    
    console.log(`🗑️ Cleared ${deletedCount} cache entries`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Error clearing cache:', error.message);
    throw error;
  }
}

module.exports = {
  getCache,
  setCache,
  deleteCache,
  invalidateRecord,
  invalidateObjectType,
  invalidateRelatedCaches,
  getCacheKey,
  getListCacheKey,
  simpleHash,
  getCacheStats,
  clearAllCache,
  CACHE_TTLS,
  DEFAULT_CACHE_TTL,
  STALE_CACHE_TTL,
};

