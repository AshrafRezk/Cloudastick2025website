/**
 * Netlify Function to fetch open positions from Salesforce
 */

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    // Handle CORS
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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        console.log('fetchPositions called');
        console.log('Event body:', event.body);

        const body = JSON.parse(event.body);
        const { access_token, instance_url } = body;

        console.log('Parsed body keys:', Object.keys(body));

        if (!access_token || !instance_url) {
            console.error('Missing authentication details');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing authentication details' }),
            };
        }

        // Query for positions where Hire_By__c is in the future
        const query = `
      SELECT Id, Name, FullPositionURL__c, Job_Applications__c, Days_Open__c, 
             Educational_Requirements__c, Functional_Area__c, Hire_By__c, 
             Hiring_Manager__c, Job_Description__c, Job_Level__c, Location__c, 
             Max_Pay__c, Min_Pay__c, Open_Date__c, Responsibilities__c, 
             Skills_Required__c, Status__c, Travel_Required__c, Type__c, 
             Years_Of_Experience__c, Enabled__c, Leads__c, Contacts__c, 
             Interview_Document_Action__c, Formatted_Name__c 
      FROM Position__c 
      WHERE Hire_By__c > TODAY
      ORDER BY Hire_By__c ASC
    `;

        const response = await fetch(`${instance_url}/services/data/v58.0/query/?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Salesforce API Error:', errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch positions', details: errorText }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ positions: data.records }),
        };

    } catch (error) {
        console.error('Error in fetchPositions:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error', message: error.message }),
        };
    }
};
