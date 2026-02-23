/**
 * Netlify Function to log user behavior tracking and update Salesforce Lead intent
 * Grouping logic: Same IP + Lead ID + Hour window = Accumulated entry
 * Direct Salesforce Auth to avoid internal timeouts.
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
        const payload = JSON.parse(event.body || '{}');
        const { sfrecordId, sessionId, browser, device, clicks: newClicks, hovers: newHovers } = payload;

        if (!sfrecordId) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        const ip = (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown').split(',')[0].trim();
        const db = getDb();

        // 1. Check for existing session in our DB (deterministic via sessionId)
        let existingSession = [];
        try {
            existingSession = await db`
                SELECT id, click_events, hover_events, created_at, intent_summary
                FROM user_tracking
                WHERE sf_record_id = ${sfrecordId}
                  AND (sessionId = ${sessionId} OR (location_info->>'ip' = ${ip} AND created_at > NOW() - INTERVAL '4 hours'))
                ORDER BY created_at DESC
                LIMIT 1
            `;
        } catch (dbError) {
            // Self-healing: If column sessionId is missing, try to add it
            if (dbError.message.includes('column "sessionid" does not exist')) {
                console.log('🔧 logUserIntent: Attempting to add missing "sessionId" column...');
                try {
                    await db`ALTER TABLE user_tracking ADD COLUMN sessionId VARCHAR(255)`;
                    // Retry the query
                    existingSession = await db`
                        SELECT id, click_events, hover_events, created_at, intent_summary
                        FROM user_tracking
                        WHERE sf_record_id = ${sfrecordId}
                          AND (sessionId = ${sessionId} OR (location_info->>'ip' = ${ip} AND created_at > NOW() - INTERVAL '4 hours'))
                        ORDER BY created_at DESC
                        LIMIT 1
                    `;
                } catch (migrationError) {
                    console.error('❌ logUserIntent: Migration failed:', migrationError);
                    throw dbError; // Throw original if migration also fails
                }
            } else {
                throw dbError;
            }
        }

        let cumulativeClicks = [...(newClicks || [])];
        let cumulativeHovers = { ...(newHovers || {}) };
        let localSessionId = null;
        let isNewSession = true;

        if (existingSession.length > 0) {
            localSessionId = existingSession[0].id;
            isNewSession = false;

            // Merge Hovers
            const oldHovers = existingSession[0].hover_events || {};
            for (const [key, value] of Object.entries(oldHovers)) {
                cumulativeHovers[key] = (cumulativeHovers[key] || 0) + value;
            }

            // Merge Clicks
            cumulativeClicks = [...(existingSession[0].click_events || []), ...(newClicks || [])];
        }

        // 2. Generate "Marketeer / Executive" Summary
        const formatDuration = (ms) => {
            if (ms < 1000) return 'briefly';
            const seconds = Math.floor(ms / 1000);
            if (seconds < 60) return `${seconds}s`;
            return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        };

        const sectionNames = {
            'hero-section': 'Value Proposition',
            'hub-and-spoke': 'Platform Hub',
            'comparison-table': 'Feature Matrix',
            'personalization-section': 'Personalization Engine',
            'platform-overview': 'Core Concepts',
            'industries-grid': 'Industry Verticals',
            'pharma-sections': 'Life Sciences Solutions',
            'financial-sections': 'FSI Solutions',
            'real-estate-sections': 'Property Tech',
            'investment-plan-section': 'ROI / Investment Plan',
            'modules-section': 'Scope Specification',
            'techsa-section': 'Ecosystem Partners',
            'erp-integration': 'Integration Strategy',
            'data-cloud': 'Data Intelligence'
        };

        const sortedHovers = Object.entries(cumulativeHovers)
            .sort((a, b) => b[1] - a[1])
            .filter(([_, time]) => time > 2000); // Filter noise

        const highInterest = cumulativeClicks.some(c => c.text?.toLowerCase().includes('is interested'));
        const hasInteractions = cumulativeClicks.length > 0 || sortedHovers.length > 0;

        const summarySections = [];

        if (sortedHovers.length > 0) {
            summarySections.push(`📈 ENGAGEMENT HOTSPOTS:\n${sortedHovers.slice(0, 4).map(([id, time]) => `• ${sectionNames[id] || id}: ${formatDuration(time)}`).join('\n')}`);
        }

        const significantClicks = cumulativeClicks
            .filter(c => c.text && c.text.length > 2 && c.element !== 'svg' && !c.text.includes('\n'))
            .map(c => c.text.trim())
            .filter((v, i, a) => a.indexOf(v) === i) // Unique
            .slice(-6);

        if (significantClicks.length > 0) {
            summarySections.push(`🎬 KEY USER ACTIONS:\n${significantClicks.map(text => `• ${text}`).join('\n')}`);
        }

        const intentSummary = `💎 USER INTENT INSIGHTS [Ref: ${sessionId}]
--------------------------------------------------
${highInterest ? '🚀 PRIORITY: DIRECT INTEREST EXPRESSED\n' : ''}
${hasInteractions ? summarySections.join('\n\n') : '• User has just arrived on the page.'}

📍 ORIGIN: ${ip} | DEV: ${device?.screenSize || 'Desktop'}
--------------------------------------------------`;

        // 3. Update Database
        const locationInfo = { ip, userAgent: event.headers['user-agent'] };

        if (isNewSession) {
            await db`
                INSERT INTO user_tracking (sf_record_id, sessionId, browser_info, device_info, location_info, click_events, hover_events, intent_summary)
                VALUES (${sfrecordId}, ${sessionId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(cumulativeClicks)}, ${JSON.stringify(cumulativeHovers)}, ${intentSummary})
            `;
        } else {
            await db`
                UPDATE user_tracking
                SET click_events = ${JSON.stringify(cumulativeClicks)},
                    hover_events = ${JSON.stringify(cumulativeHovers)},
                    intent_summary = ${intentSummary}
                WHERE id = ${localSessionId}
            `;
        }

        // 4. Update Salesforce (Direct Auth)
        try {
            const clientId = process.env.SALESFORCE_CLIENT_ID;
            const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
            const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

            if (clientId && clientSecret && tokenUrl) {
                const formData = new URLSearchParams();
                formData.append('grant_type', 'client_credentials');
                formData.append('client_id', clientId);
                formData.append('client_secret', clientSecret);

                const authResponse = await fetch(tokenUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString(),
                });

                if (authResponse.ok) {
                    const { access_token, instance_url } = await authResponse.json();

                    const currentLeadResponse = await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                        headers: { 'Authorization': `Bearer ${access_token}` }
                    });

                    if (currentLeadResponse.ok) {
                        const leadData = await currentLeadResponse.json();
                        let existingIntent = leadData.Salesforce_Power_Intent__c || '';

                        // DETERMINISTIC UPDATE VIA sessionId
                        const sessionMarker = `[Ref: ${sessionId}]`;

                        let newIntent;
                        if (existingIntent.includes(sessionMarker)) {
                            // Find and replace the specific session block
                            const blocks = existingIntent.split('\n\n---\n\n');
                            const sessionBlockIndex = blocks.findIndex(b => b.includes(sessionMarker));

                            if (sessionBlockIndex !== -1) {
                                blocks[sessionBlockIndex] = intentSummary;
                                newIntent = blocks.join('\n\n---\n\n');
                            } else {
                                newIntent = `${existingIntent}\n\n---\n\n${intentSummary}`;
                            }
                        } else {
                            // New visit, append with separator
                            newIntent = existingIntent ? `${existingIntent}\n\n---\n\n${intentSummary}` : intentSummary;
                        }

                        await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${access_token}`,
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                Salesforce_Power_Intent__c: newIntent.substring(0, 32000)
                            }),
                        });
                    }
                }
            }
        } catch (sfError) {
            console.error('❌ logUserIntent: Salesforce direct update failed:', sfError);
        }

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true }),
        };

    } catch (error) {
        console.error('❌ logUserIntent: Critical Error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
