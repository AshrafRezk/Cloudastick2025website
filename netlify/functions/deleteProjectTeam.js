const { getStore } = require('@netlify/blobs');

// Password for Cloudastick Project Managers
const EDIT_PASSWORD = 'Cloudastick@Team$';

/**
 * Netlify Function to delete project team data
 * Requires password authentication for Cloudastick Project Managers
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow DELETE requests
  if (event.httpMethod !== 'DELETE') {
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
    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid request body. Expected JSON.' }),
      };
    }

    const { projectId, password } = requestData;

    if (!projectId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Project ID is required' }),
      };
    }

    // Verify password
    if (!password || password !== EDIT_PASSWORD) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Unauthorized - Invalid password' }),
      };
    }

    console.log('🗑️ Deleting project team data for:', projectId);

    // Initialize Netlify Blobs store
    const store = getStore({
      name: 'project-teams',
      context,
    });

    // Check if project exists
    const existingData = await store.get(projectId);
    if (!existingData) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    // Delete project data
    await store.delete(projectId);

    // Update project index - remove entry
    let projectIndex = [];
    try {
      const indexData = await store.get('_project_index');
      if (indexData) {
        projectIndex = JSON.parse(indexData);
      }
    } catch (e) {
      console.log('No project index found');
    }

    // Remove entry from index
    projectIndex = projectIndex.filter(item => item.projectId !== projectId);

    // Save updated project index
    await store.set('_project_index', JSON.stringify(projectIndex));

    console.log('✅ Project team data deleted successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        projectId,
        message: 'Project team data deleted successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error deleting project team data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to delete project team data',
        message: error.message,
      }),
    };
  }
};

