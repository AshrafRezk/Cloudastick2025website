/**
 * Netlify Function to log user behavior tracking and update Salesforce Lead intent
 */

const { getDb } = require('./db');

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
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        const data = JSON.parse(event.body || '{}');
        const { sfrecordId, browser, device, clicks, hovers } = data;

        if (!sfrecordId) {
            return {
                statusCode: 200, // Silent success even if no ID (ignore non-lead traffic)
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        // Get location info from headers
        const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown';
        const locationInfo = {
            ip: ip.split(',')[0].trim(),
            userAgent: event.headers['user-agent'],
        };

        // Generate Intent Summary
        const interestExpressed = clicks.some(c => c.text.includes('Notify Cloudastick Systems with your interest'));

        const clickSummary = clicks.length > 0
            ? `Clicked on: ${clicks.map(c => `${c.element} ("${c.text}")`).join(', ')}.`
            : 'No clicks recorded.';

        const sortedHovers = Object.entries(hovers)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const hoverSummary = sortedHovers.length > 0
            ? `Highest engagement in: ${sortedHovers.map(([id, time]) => `${id} (${Math.round(time / 1000)}s)`).join(', ')}.`
            : 'No specific area engagement recorded.';

        const intentSummary = `User Behavior Report (${new Date().toLocaleString()}):
${interestExpressed ? '🔥 HIGH INTEREST: User clicked "Notify Cloudastick Systems with your interest"!\n' : ''}- Location/IP: ${locationInfo.ip}
- Device: ${device.screenSize} (${device.orientation})
- Browser: ${browser.userAgent}
- ${hoverSummary}
- ${clickSummary}`;

        // Store in Database
        const db = getDb();
        await db`
      INSERT INTO user_tracking (sf_record_id, browser_info, device_info, location_info, click_events, hover_events, intent_summary)
      VALUES (${sfrecordId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(clicks)}, ${JSON.stringify(hovers)}, ${intentSummary})
    `;

        // Update Salesforce Lead
        try {
            // We need to authenticate with Salesforce first to get tokens if we are calling from backend
            const authResponse = await fetch(`${process.env.URL || 'http://localhost:8888'}/.netlify/functions/salesforceAuth`, {
                method: 'POST'
            });

            if (authResponse.ok) {
                const authData = await authResponse.json();
                const { access_token, instance_url } = authData;

                // To append, we need to GET first
                const currentLeadResponse = await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });

                if (currentLeadResponse.ok) {
                    const leadData = await currentLeadResponse.json();
                    const existingIntent = leadData.Salesforce_Power_Intent__c || '';
                    const newIntent = existingIntent
                        ? `${existingIntent}\n\n---\n\n${intentSummary}`
                        : intentSummary;

                    await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            Salesforce_Power_Intent__c: newIntent.substring(0, 32000) // Salesforce limit safety
                        }),
                    });
                }
            }
        } catch (sfError) {
            console.error('Failed to update Salesforce Lead:', sfError);
            // Continue though, as we've saved it to our DB
        }

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true, intentSummary }),
        };

    } catch (error) {
        console.error('Error logging user intent:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
        };
    }
};
