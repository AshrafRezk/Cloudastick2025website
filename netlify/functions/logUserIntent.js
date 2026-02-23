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
        console.log('📡 logUserIntent: Request received');
        const data = JSON.parse(event.body || '{}');
        const { sfrecordId, browser, device, clicks, hovers } = data;

        if (!sfrecordId) {
            console.warn('⚠️ logUserIntent: No sfrecordId provided in payload');
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        console.log(`📝 logUserIntent: Processing tracking for Lead ID: ${sfrecordId}`);
        console.log(`📊 Stats: Clicks: ${clicks?.length || 0}, Section Hovers: ${Object.keys(hovers || {}).length}`);

        // Get location info from headers
        const ip = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown';
        const locationInfo = {
            ip: ip.split(',')[0].trim(),
            userAgent: event.headers['user-agent'],
        };

        // Generate Intent Summary
        const interestExpressed = (clicks || []).some(c => c.text?.includes('Notify Cloudastick Systems with your interest'));

        const clickSummary = (clicks || []).length > 0
            ? `Clicked on: ${(clicks || []).map(c => `${c.element} ("${c.text}")`).join(', ')}.`
            : 'No clicks recorded.';

        const sortedHovers = Object.entries(hovers || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const hoverSummary = sortedHovers.length > 0
            ? `Highest engagement in: ${sortedHovers.map(([id, time]) => `${id} (${Math.round(time / 1000)}s)`).join(', ')}.`
            : 'No specific area engagement recorded.';

        const intentSummary = `User Behavior Report (${new Date().toLocaleString()}):
${interestExpressed ? '🔥 HIGH INTEREST: User clicked "Notify Cloudastick Systems with your interest"!\n' : ''}- Location/IP: ${locationInfo.ip}
- Device: ${device?.screenSize || 'Unknown'} (${device?.orientation || 'Unknown'})
- Browser: ${browser?.userAgent || 'Unknown'}
- ${hoverSummary}
- ${clickSummary}`;

        // Store in Database
        try {
            const db = getDb();
            console.log('🗄️ logUserIntent: Inserting raw tracking data into DB...');
            await db`
                INSERT INTO user_tracking (sf_record_id, browser_info, device_info, location_info, click_events, hover_events, intent_summary)
                VALUES (${sfrecordId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(clicks)}, ${JSON.stringify(hovers)}, ${intentSummary})
            `;
            console.log('✅ logUserIntent: DB insertion successful');
        } catch (dbError) {
            console.error('❌ logUserIntent: DB insertion failed:', dbError);
            // Continue to Salesforce update even if DB fails
        }

        // Update Salesforce Lead
        try {
            console.log('☁️ logUserIntent: Starting Salesforce Lead update process...');

            // Construct absolute URL for internal auth function
            const host = event.headers.host;
            const protocol = event.headers['x-forwarded-proto'] || 'http';
            const authUrl = `${protocol}://${host}/.netlify/functions/salesforceAuth`;

            console.log(`🔐 logUserIntent: Fetching token from internally: ${authUrl}`);
            const authResponse = await fetch(authUrl, { method: 'POST' });

            if (authResponse.ok) {
                const authData = await authResponse.json();
                const { access_token, instance_url } = authData;
                console.log(`✅ logUserIntent: Auth successful. Instance: ${instance_url}`);

                // To append, we need to GET first
                console.log(`🔍 logUserIntent: Fetching current Lead data for ${sfrecordId}...`);
                const currentLeadResponse = await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });

                if (currentLeadResponse.ok) {
                    const leadData = await currentLeadResponse.json();
                    console.log('✅ logUserIntent: Lead data retrieved successfully');

                    const existingIntent = leadData.Salesforce_Power_Intent__c || '';
                    const newIntent = existingIntent
                        ? `${existingIntent}\n\n---\n\n${intentSummary}`
                        : intentSummary;

                    console.log('🆙 logUserIntent: PATCHing Lead record with updated intent...');
                    const patchResponse = await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            Salesforce_Power_Intent__c: newIntent.substring(0, 32000)
                        }),
                    });

                    if (patchResponse.ok) {
                        console.log('✅ logUserIntent: Salesforce Lead updated successfully');
                    } else {
                        const patchError = await patchResponse.text();
                        console.error('❌ logUserIntent: Salesforce PATCH failed:', patchResponse.status, patchError);
                    }
                } else {
                    const leadError = await currentLeadResponse.text();
                    console.error('❌ logUserIntent: Salesforce GET Lead failed:', currentLeadResponse.status, leadError);
                }
            } else {
                const authError = await authResponse.text();
                console.error('❌ logUserIntent: Internal auth call failed:', authResponse.status, authError);
            }
        } catch (sfError) {
            console.error('❌ logUserIntent: Unexpected Salesforce process error:', sfError);
        }

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true, intentSummary }),
        };

    } catch (error) {
        console.error('❌ logUserIntent: Top-level error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Internal Server Error', message: error.message }),
        };
    }
};
