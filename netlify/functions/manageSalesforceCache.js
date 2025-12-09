/**
 * Netlify Function to Manage Salesforce Cache
 * 
 * Provides utilities to:
 * - Get cache statistics
 * - Clear all cache
 * - Clear cache for specific object types
 * - Refresh cache for specific records
 * 
 * Usage:
 * POST /.netlify/functions/manageSalesforceCache
 * Body: { action: 'stats' | 'clear' | 'clearObject' | 'invalidate', objectType?, recordId? }
 */

const {
  getCacheStats,
  clearAllCache,
  invalidateObjectType,
  invalidateRecord,
} = require('./salesforceCacheManager');

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { action, objectType, recordId } = JSON.parse(event.body || '{}');

    if (!action) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required parameter: action' }),
      };
    }

    let result;

    switch (action) {
      case 'stats':
        console.log('📊 Getting cache statistics...');
        result = await getCacheStats();
        if (!result) {
          throw new Error('Failed to get cache statistics');
        }
        break;

      case 'clear':
        console.log('🗑️ Clearing all cache...');
        const deletedCount = await clearAllCache();
        result = {
          message: 'All cache cleared',
          deletedCount,
        };
        break;

      case 'clearObject':
        if (!objectType) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Missing required parameter: objectType' }),
          };
        }
        console.log(`🗑️ Clearing cache for object type: ${objectType}...`);
        await invalidateObjectType(objectType);
        result = {
          message: `Cache cleared for ${objectType}`,
          objectType,
        };
        break;

      case 'invalidate':
        if (!objectType || !recordId) {
          return {
            statusCode: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Missing required parameters: objectType and recordId' }),
          };
        }
        console.log(`🔄 Invalidating cache for ${objectType}:${recordId}...`);
        await invalidateRecord(objectType, recordId);
        result = {
          message: `Cache invalidated for ${objectType}:${recordId}`,
          objectType,
          recordId,
        };
        break;

      default:
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            error: 'Invalid action',
            validActions: ['stats', 'clear', 'clearObject', 'invalidate'],
          }),
        };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        action,
        result,
      }),
    };
  } catch (error) {
    console.error('❌ Error managing cache:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to manage cache',
        message: error.message,
      }),
    };
  }
};

