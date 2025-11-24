const { getStore } = require('@netlify/blobs');

// Password for Cloudastick Project Managers
const EDIT_PASSWORD = 'Cloudastick@Team$';

/**
 * Netlify Function to list all project teams
 * Returns list of all projects from the project index
 * Requires password authentication
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
    // Get password from query parameters
    const { password } = event.queryStringParameters || {};

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

    console.log('📋 Listing all project teams...');

    // Initialize Netlify Blobs store
    const store = getStore('project-teams');

    // Get project index
    let projectIndex = [];
    try {
      const indexData = await store.get('_project_index');
      if (indexData) {
        projectIndex = JSON.parse(indexData);
      }
    } catch (e) {
      console.log('No project index found, returning empty list');
    }

    // Fetch additional details for each project (team member count)
    const projectsWithDetails = await Promise.all(
      projectIndex.map(async (project) => {
        try {
          const projectData = await store.get(project.projectId);
          if (projectData) {
            const data = JSON.parse(projectData);
            return {
              projectId: project.projectId,
              companyName: project.companyName || data.companyName || '',
              updatedAt: project.updatedAt || data.updatedAt || '',
              createdAt: data.createdAt || '',
              teamMemberCount: data.selectedTeam ? data.selectedTeam.length : 0,
              hasScope: !!data.projectScope,
              hasDeliverables: !!data.deliverables,
            };
          }
        } catch (e) {
          console.error(`Error fetching details for ${project.projectId}:`, e);
        }
        // Return basic info if details fetch fails
        return {
          projectId: project.projectId,
          companyName: project.companyName || '',
          updatedAt: project.updatedAt || '',
          teamMemberCount: 0,
          hasScope: false,
          hasDeliverables: false,
        };
      })
    );

    // Sort by updatedAt (most recent first)
    projectsWithDetails.sort((a, b) => {
      const dateA = new Date(a.updatedAt || 0).getTime();
      const dateB = new Date(b.updatedAt || 0).getTime();
      return dateB - dateA;
    });

    console.log(`✅ Found ${projectsWithDetails.length} project teams`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        projects: projectsWithDetails,
        total: projectsWithDetails.length,
      }),
    };

  } catch (error) {
    console.error('❌ Error listing project teams:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to list project teams',
        message: error.message,
      }),
    };
  }
};

