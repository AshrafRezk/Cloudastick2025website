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
        const { access_token, instance_url } = JSON.parse(event.body);

        if (!access_token || !instance_url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing authentication details' }),
            };
        }

        // Query for positions where Hire_By__c is today or in the future
        // and Enabled__c is true
        const query = `
      SELECT Id, Name, Type__c, Job_Description__c, Min_Pay__c, Max_Pay__c, 
             Formatted_Name__c, Hire_By__c, Location__c, Responsibilities__c, 
             Skills_Required__c, Educational_Requirements__c
      FROM Position__c 
      WHERE Hire_By__c >= TODAY 
      AND Enabled__c = true 
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
