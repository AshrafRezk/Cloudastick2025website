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
        const { sfrecordId, browser, device, clicks: newClicks, hovers: newHovers } = payload;

        if (!sfrecordId) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        const ip = (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown').split(',')[0].trim();
        const db = getDb();

        // 1. Check for existing session in the last hour
        const existingSession = await db`
            SELECT id, click_events, hover_events, created_at, intent_summary
            FROM user_tracking
            WHERE sf_record_id = ${sfrecordId}
              AND location_info->>'ip' = ${ip}
              AND created_at > NOW() - INTERVAL '1 hour'
            ORDER BY created_at DESC
            LIMIT 1
        `;

        let cumulativeClicks = [...(newClicks || [])];
        let cumulativeHovers = { ...(newHovers || {}) };
        let sessionId = null;
        let isNewSession = true;

        if (existingSession.length > 0) {
            sessionId = existingSession[0].id;
            isNewSession = false;

            // Merge Hovers
            const oldHovers = existingSession[0].hover_events || {};
            for (const [key, value] of Object.entries(oldHovers)) {
                cumulativeHovers[key] = (cumulativeHovers[key] || 0) + value;
            }

            // Merge Clicks
            cumulativeClicks = [...(existingSession[0].click_events || []), ...(newClicks || [])];
        }

        // 2. Generate "C-Level / Marketeer" Summary
        const formatDuration = (ms) => {
            if (ms < 1000) return 'less than 1s';
            const seconds = Math.floor(ms / 1000);
            if (seconds < 60) return `${seconds}s`;
            const minutes = Math.floor(seconds / 60);
            return `${minutes}m ${seconds % 60}s`;
        };

        const sectionNames = {
            'hero-section': 'Introduction & Hero',
            'hub-and-spoke': 'Platform Hub Concept',
            'comparison-table': 'Feature Comparison',
            'personalization-section': 'Personalization Details',
            'platform-overview': 'Core Platform Capabilities',
            'industries-grid': 'Industry Verticals Browser',
            'pharma-sections': 'Pharma Specific Solutions',
            'financial-sections': 'Financial Services Solutions',
            'real-estate-sections': 'Real Estate Solutions',
            'investment-plan-section': 'Investment & ROI Planner',
            'modules-section': 'Feature Scope Builder',
            'techsa-section': 'Partner Ecosystem (TechSa)',
            'erp-integration': 'ERP & System Integration',
            'data-cloud': 'Data Cloud Strategy'
        };

        const sortedHovers = Object.entries(cumulativeHovers)
            .sort((a, b) => b[1] - a[1])
            .filter(([_, time]) => time > 5000); // Only show relevant engagement (> 5s)

        const highInterest = cumulativeClicks.some(c => c.text?.toLowerCase().includes('is interested'));

        const summarySections = [];

        if (sortedHovers.length > 0) {
            summarySections.push(`📊 TOP ENGAGEMENT AREAS:\n${sortedHovers.slice(0, 3).map(([id, time]) => `- ${sectionNames[id] || id}: ${formatDuration(time)}`).join('\n')}`);
        }

        const significantClicks = cumulativeClicks
            .filter(c => c.text && c.text.length > 2 && c.element !== 'svg' && !c.text.includes('\n'))
            .map(c => c.text.trim())
            .filter((v, i, a) => a.indexOf(v) === i) // Unique
            .slice(-5); // Last 5 unique actions

        if (significantClicks.length > 0) {
            summarySections.push(`🎯 RECENT KEY ACTIONS:\n${significantClicks.map(text => `- ${text}`).join('\n')}`);
        }

        const intentSummary = `🚀 SALESFORCE POWER - INTENT INSIGHTS (${new Date().toLocaleTimeString('en-US', { hour12: true })})
--------------------------------------------------
${highInterest ? '🔥 STATUS: EXPRESS INTEREST (Action Required)\n' : ''}
${summarySections.join('\n\n')}

📱 CONTEXT: ${device?.screenSize || 'Desktop'} | IP: ${ip}
--------------------------------------------------`;

        // 3. Update Database
        const locationInfo = { ip, userAgent: event.headers['user-agent'] };

        if (isNewSession) {
            await db`
                INSERT INTO user_tracking (sf_record_id, browser_info, device_info, location_info, click_events, hover_events, intent_summary)
                VALUES (${sfrecordId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(cumulativeClicks)}, ${JSON.stringify(cumulativeHovers)}, ${intentSummary})
            `;
        } else {
            await db`
                UPDATE user_tracking
                SET click_events = ${JSON.stringify(cumulativeClicks)},
                    hover_events = ${JSON.stringify(cumulativeHovers)},
                    intent_summary = ${intentSummary}
                WHERE id = ${sessionId}
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

                        // SMART ACCUMULATION IN SALESFORCE FIELD
                        const now = new Date();
                        const hourMarker = `(${now.toLocaleDateString()}, ${now.getHours()}:`;

                        let newIntent;
                        if (existingIntent.includes(hourMarker)) {
                            const blocks = existingIntent.split('\n\n---\n\n');
                            const lastBlockIndex = blocks.length - 1;
                            // Search for any block in this hour (usually the last one)
                            let updated = false;
                            for (let i = blocks.length - 1; i >= 0; i--) {
                                if (blocks[i].includes(hourMarker)) {
                                    blocks[i] = intentSummary;
                                    updated = true;
                                    break;
                                }
                            }
                            newIntent = updated ? blocks.join('\n\n---\n\n') : `${existingIntent}\n\n---\n\n${intentSummary}`;
                        } else {
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
