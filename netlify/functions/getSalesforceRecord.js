/**
 * Netlify Function: getSalesforceRecord
 * Secured proxy for fetching specific Salesforce record fields.
 */

exports.handler = async (event, context) => {
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
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { recordId, objectType, fields } = JSON.parse(event.body || '{}');

        if (!recordId || !objectType) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'recordId and objectType are required' }),
            };
        }

        // Salesforce credentials from environment variables
        const clientId = process.env.SALESFORCE_CLIENT_ID;
        const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
        const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

        if (!clientId || !clientSecret || !tokenUrl) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Salesforce credentials not configured' }),
            };
        }

        // Get Access Token
        const formData = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        });

        const authRes = await fetch(tokenUrl, { method: 'POST', body: formData });
        if (!authRes.ok) {
            throw new Error(`Salesforce Auth failed: ${authRes.status}`);
        }

        const { access_token, instance_url } = await authRes.json();

        // Fetch Record
        const fieldList = fields ? fields.join(',') : 'Id,Name';
        const url = `${instance_url}/services/data/v58.0/sobjects/${objectType}/${recordId}?fields=${fieldList}`;

        const sfRes = await fetch(url, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!sfRes.ok) {
            const errorText = await sfRes.text();
            return {
                statusCode: sfRes.status,
                body: JSON.stringify({ error: 'Salesforce fetch failed', details: errorText }),
            };
        }

        const data = await sfRes.json();

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error('❌ getSalesforceRecord error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
