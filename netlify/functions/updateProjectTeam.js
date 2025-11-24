const { getStore } = require('@netlify/blobs');

// Password for Cloudastick Project Managers
const EDIT_PASSWORD = 'Cloudastick@Team$';

/**
 * Netlify Function to update project team data
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
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow PUT requests
  if (event.httpMethod !== 'PUT') {
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
    // Parse request body with error handling
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

    const { projectId, password, ...updatedFields } = requestData;

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

    console.log('🔄 Updating project team data for:', projectId);

    // Initialize Netlify Blobs store
    const store = getStore({
      name: 'project-teams',
      context,
    });

    // Get existing project data
    let projectData = {};
    try {
      const existingData = await store.get(projectId);
      if (existingData) {
        try {
          projectData = JSON.parse(existingData);
        } catch (parseError) {
          console.error('❌ Failed to parse existing project data:', parseError);
          // Continue with empty projectData
        }
      }
    } catch (e) {
      console.log('No existing project data found, creating new');
    }

    // Merge updated fields
    const updatedData = {
      ...projectData,
      ...updatedFields,
      projectId, // Ensure projectId is preserved
      updatedAt: new Date().toISOString(),
      // Preserve createdAt if it exists
      createdAt: projectData.createdAt || new Date().toISOString(),
    };

    // Save updated project data
    try {
      await store.set(projectId, JSON.stringify(updatedData));
    } catch (saveError) {
      console.error('❌ Failed to save project data:', saveError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Failed to save project data',
          message: 'Unable to save project team data. Please try again.',
        }),
      };
    }

    // Update project index
    let projectIndex = [];
    try {
      const existingIndex = await store.get('_project_index');
      if (existingIndex) {
        try {
          projectIndex = JSON.parse(existingIndex);
        } catch (parseError) {
          console.error('❌ Failed to parse project index:', parseError);
          // Continue with empty index
        }
      }
    } catch (e) {
      console.log('Creating new project index');
    }

    // Update entry in project index
    const indexEntry = {
      projectId,
      companyName: updatedData.companyName || '',
      updatedAt: updatedData.updatedAt,
    };

    // Remove old entry if exists
    projectIndex = projectIndex.filter(item => item.projectId !== projectId);
    // Add updated entry
    projectIndex.push(indexEntry);

    // Save updated project index
    try {
      await store.set('_project_index', JSON.stringify(projectIndex));
    } catch (indexError) {
      console.error('❌ Failed to update project index:', indexError);
      // Don't fail the whole request if index update fails, but log it
    }

    console.log('✅ Project team data updated successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        projectId,
        data: updatedData,
        message: 'Project team data updated successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error updating project team data:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    // Ensure we always return a valid response
    const errorMessage = error.message || 'An unexpected error occurred';
    const sanitizedMessage = errorMessage.length > 200 
      ? errorMessage.substring(0, 200) + '...' 
      : errorMessage;
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to update project team data',
        message: sanitizedMessage,
      }),
    };
  }
};

