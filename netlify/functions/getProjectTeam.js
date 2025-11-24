const { getStore } = require('@netlify/blobs');

/**
 * Netlify Function to retrieve project team data
 * Gets project team data by projectId or company name
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    const { projectId, company } = event.queryStringParameters || {};

    if (!projectId && !company) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Project ID or company name is required' }),
      };
    }

    console.log('📖 Retrieving project team data:', projectId || company);

    // Initialize Netlify Blobs store
    const store = getStore({
      name: 'project-teams',
      context,
    });

    let projectData = null;

    // If projectId is provided, use it directly
    if (projectId) {
      const data = await store.get(projectId);
      if (data) {
        projectData = JSON.parse(data);
      }
    } else if (company) {
      // If only company name is provided, search the index
      const indexData = await store.get('_project_index');
      if (indexData) {
        const projectIndex = JSON.parse(indexData);
        const matchingProject = projectIndex.find(
          item => item.companyName && item.companyName.toLowerCase() === company.toLowerCase()
        );
        
        if (matchingProject) {
          const data = await store.get(matchingProject.projectId);
          if (data) {
            projectData = JSON.parse(data);
          }
        }
      }
    }

    if (!projectData) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Project not found' }),
      };
    }

    console.log('✅ Project team data retrieved successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        data: projectData,
      }),
    };

  } catch (error) {
    console.error('❌ Error retrieving project team data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to retrieve project team data',
        message: error.message,
      }),
    };
  }
};

