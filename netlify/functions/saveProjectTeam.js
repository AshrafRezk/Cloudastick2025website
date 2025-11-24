const { getStore } = require('@netlify/blobs');

/**
 * Netlify Function to save project team data
 * Stores project team selections, scope, and deliverables
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
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
    const { projectId, companyName, companyLogo, selectedTeam, projectScope, deliverables } = JSON.parse(event.body);

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

    console.log('💾 Saving project team data for:', projectId);

    // Initialize Netlify Blobs store
    const store = getStore({
      name: 'project-teams',
      context,
    });

    // Prepare data to save
    const projectData = {
      projectId,
      companyName: companyName || '',
      companyLogo: companyLogo || '',
      selectedTeam: selectedTeam || [],
      projectScope: projectScope || '',
      deliverables: deliverables || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save project data with projectId as key
    await store.set(projectId, JSON.stringify(projectData));

    // Update project index (list of all projects)
    let projectIndex = [];
    try {
      const existingIndex = await store.get('_project_index');
      if (existingIndex) {
        projectIndex = JSON.parse(existingIndex);
      }
    } catch (e) {
      console.log('Creating new project index');
    }

    // Add/update entry in project index
    const indexEntry = {
      projectId,
      companyName: companyName || '',
      updatedAt: new Date().toISOString(),
    };

    // Remove old entry if exists
    projectIndex = projectIndex.filter(item => item.projectId !== projectId);
    // Add new entry
    projectIndex.push(indexEntry);

    // Save updated project index
    await store.set('_project_index', JSON.stringify(projectIndex));

    console.log('✅ Project team data saved successfully');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        projectId,
        message: 'Project team data saved successfully',
      }),
    };

  } catch (error) {
    console.error('❌ Error saving project team data:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to save project team data',
        message: error.message,
      }),
    };
  }
};

