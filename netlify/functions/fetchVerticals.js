/**
 * Netlify Function for fetching verticals and their modules from Salesforce
 * Queries Vertical__c and Vertical_Module__c objects
 */

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
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
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    console.log('📊 Fetch Verticals - Request received');

    const { access_token, instance_url, verticalId } = JSON.parse(event.body || '{}');

    if (!access_token || !instance_url) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing access_token or instance_url' }),
      };
    }

    // If verticalId is provided, fetch a single vertical with its modules
    if (verticalId) {
      // Fetch single vertical with all fields
      const verticalQuery = encodeURIComponent(
        `SELECT Id, Name, Type__c, Org_Username__c, Org_Password__c, Demo_Script_Summary__c, Document__c, Company_Profile__c, CreatedDate, LastModifiedDate FROM Vertical__c WHERE Id = '${verticalId}' LIMIT 1`
      );

      const verticalUrl = `${instance_url}/services/data/v58.0/query/?q=${verticalQuery}`;
      console.log('📤 Querying Salesforce for vertical...');

      const verticalResponse = await fetch(verticalUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!verticalResponse.ok) {
        const errorText = await verticalResponse.text();
        console.error('❌ Salesforce API Error:', errorText);
        throw new Error(`Salesforce API error: ${verticalResponse.status} - ${errorText}`);
      }

      const verticalData = await verticalResponse.json();
      
      if (!verticalData.records || verticalData.records.length === 0) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Vertical not found' }),
        };
      }

      const vertical = verticalData.records[0];

      // Fetch modules for this vertical
      const modulesQuery = encodeURIComponent(
        `SELECT Id, Name, Feature_list__c, Priority__c, Cloudastick_Edge__c, Vertical__c, Vertical__r.Name FROM Vertical_Module__c WHERE Vertical__c = '${verticalId}' ORDER BY Priority__c ASC NULLS LAST, Name ASC`
      );

      const modulesUrl = `${instance_url}/services/data/v58.0/query/?q=${modulesQuery}`;
      console.log('📤 Querying Salesforce for modules...');

      const modulesResponse = await fetch(modulesUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!modulesResponse.ok) {
        const errorText = await modulesResponse.text();
        console.error('❌ Salesforce API Error fetching modules:', errorText);
        // Continue even if modules fail - return vertical without modules
      }

      const modulesData = modulesResponse.ok ? await modulesResponse.json() : { records: [] };

      // Transform vertical
      const verticalTransformed = {
        id: vertical.Id,
        name: vertical.Name || '',
        type: vertical.Type__c || '',
        orgUsername: vertical.Org_Username__c || '',
        orgPassword: vertical.Org_Password__c || '',
        demoScriptSummary: vertical.Demo_Script_Summary__c || '',
        document: vertical.Document__c || '',
        companyProfile: vertical.Company_Profile__c || '',
        createdDate: vertical.CreatedDate || null,
        lastModifiedDate: vertical.LastModifiedDate || null,
        modules: (modulesData.records || []).map((module) => ({
          id: module.Id,
          name: module.Name || '',
          featureList: module.Feature_list__c || '',
          priority: module.Priority__c || null,
          cloudastickEdge: module.Cloudastick_Edge__c || '',
          verticalId: module.Vertical__c || '',
          verticalName: module.Vertical__r?.Name || '',
        })),
      };

      console.log(`✅ Fetched vertical with ${verticalTransformed.modules.length} modules`);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vertical: verticalTransformed }),
      };
    } else {
      // Fetch all verticals (without modules for list view)
      const verticalsQuery = encodeURIComponent(
        `SELECT Id, Name, Type__c, Demo_Script_Summary__c, Company_Profile__c, CreatedDate FROM Vertical__c ORDER BY Name ASC`
      );

      const verticalsUrl = `${instance_url}/services/data/v58.0/query/?q=${verticalsQuery}`;
      console.log('📤 Querying Salesforce for all verticals...');

      const verticalsResponse = await fetch(verticalsUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!verticalsResponse.ok) {
        const errorText = await verticalsResponse.text();
        console.error('❌ Salesforce API Error:', errorText);
        throw new Error(`Salesforce API error: ${verticalsResponse.status} - ${errorText}`);
      }

      const verticalsData = await verticalsResponse.json();
      console.log(`✅ Fetched ${verticalsData.records?.length || 0} vertical records`);

      // Transform verticals
      const verticals = (verticalsData.records || []).map((record) => ({
        id: record.Id,
        name: record.Name || '',
        type: record.Type__c || '',
        demoScriptSummary: record.Demo_Script_Summary__c || '',
        companyProfile: record.Company_Profile__c || '',
        createdDate: record.CreatedDate || null,
      }));

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verticals }),
      };
    }

  } catch (error) {
    console.error('❌ Fetch Verticals Function Error:');
    console.error('Error Type:', typeof error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch verticals from Salesforce',
        message: error.message
      }),
    };
  }
};

