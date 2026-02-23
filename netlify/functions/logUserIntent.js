/**
 * Netlify Function: logUserIntent
 * Resilience: DB failures are non-blocking for Salesforce updates.
 * Diagnostics: 500 responses now include error details for easier debugging.
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
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let payload = {};
    try {
        payload = JSON.parse(event.body || '{}');
        const { sfrecordId, sessionId, browser, device, clicks: newClicks, hovers: newHovers } = payload;

        if (!sfrecordId) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        const ip = (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown').split(',')[0].trim();

        // ------------------------------------------------------------
        // 1. DATA MERGING & SUMMARY (Pure Logic)
        // ------------------------------------------------------------
        let cumulativeClicks = [...(newClicks || [])];
        let cumulativeHovers = { ...(newHovers || {}) };

        // Setup placeholders for DB related data
        let intentSummary = '';
        let highInterest = false;

        // DB-dependent part wrapped in try/catch to be non-blocking
        try {
            const db = getDb();
            let existingSession = [];

            try {
                existingSession = await db`
                    SELECT id, click_events, hover_events, created_at, intent_summary
                    FROM user_tracking
                    WHERE sf_record_id = ${sfrecordId}
                      AND (sessionId = ${sessionId} OR (location_info->>'ip' = ${ip} AND created_at > NOW() - INTERVAL '4 hours'))
                    ORDER BY created_at DESC LIMIT 1
                `;
            } catch (dbError) {
                if (dbError.message.includes('column "sessionid" does not exist')) {
                    await db`ALTER TABLE user_tracking ADD COLUMN sessionId VARCHAR(255)`;
                    existingSession = await db`
                        SELECT id, click_events, hover_events, created_at, intent_summary
                        FROM user_tracking
                        WHERE sf_record_id = ${sfrecordId}
                          AND sessionId = ${sessionId}
                        LIMIT 1
                    `;
                } else throw dbError;
            }

            if (existingSession.length > 0) {
                const oldHovers = existingSession[0].hover_events || {};
                for (const [key, value] of Object.entries(oldHovers)) {
                    cumulativeHovers[key] = (cumulativeHovers[key] || 0) + value;
                }
                cumulativeClicks = [...(existingSession[0].click_events || []), ...(newClicks || [])];
            }
        } catch (e) {
            console.error('⚠️ DB Retrieval failed (Non-blocking):', e.message);
        }

        // Summary Generation logic
        const formatDuration = (ms) => ms < 1000 ? 'briefly' : (ms < 60000 ? `${Math.floor(ms / 1000)}s` : `${Math.floor(ms / 60000)}m`);
        const sectionNames = { 'hero-section': 'Value Proposition', 'hub-and-spoke': 'Platform Hub', 'comparison-table': 'Feature Matrix', 'personalization-section': 'Personalization Engine', 'platform-overview': 'Core Concepts', 'industries-grid': 'Industry Verticals', 'pharma-sections': 'Life Sciences', 'financial-sections': 'FSI Solutions', 'real-estate-sections': 'Property Tech', 'investment-plan-section': 'ROI Plan', 'modules-section': 'Scope Spec', 'techsa-section': 'Partners', 'erp-integration': 'Integration', 'data-cloud': 'Data Intelligence' };

        const sortedHovers = Object.entries(cumulativeHovers).sort((a, b) => b[1] - a[1]).filter(([_, t]) => t > 2000);
        highInterest = cumulativeClicks.some(c => c.text?.toLowerCase().includes('is interested'));

        const summarySections = [];
        if (sortedHovers.length > 0) summarySections.push(`📈 ENGAGEMENT HOTSPOTS:\n${sortedHovers.slice(0, 4).map(([id, t]) => `• ${sectionNames[id] || id}: ${formatDuration(t)}`).join('\n')}`);

        const significantClicks = cumulativeClicks.filter(c => c.text && c.text.length > 2 && c.element !== 'svg' && !c.text.includes('\n')).map(c => c.text.trim()).filter((v, i, a) => a.indexOf(v) === i).slice(-6);
        if (significantClicks.length > 0) summarySections.push(`🎬 KEY USER ACTIONS:\n${significantClicks.map(text => `• ${text}`).join('\n')}`);

        intentSummary = `💎 USER INTENT INSIGHTS [Ref: ${sessionId}]
--------------------------------------------------
${highInterest ? '🚀 PRIORITY: DIRECT INTEREST EXPRESSED\n' : ''}
${summarySections.length > 0 ? summarySections.join('\n\n') : '• User has just arrived on the page.'}

📍 ORIGIN: ${ip} | DEV: ${device?.screenSize || 'Desktop'}
--------------------------------------------------`;

        // ------------------------------------------------------------
        // 2. NON-BLOCKING DB STORAGE
        // ------------------------------------------------------------
        try {
            const db = getDb();
            const locationInfo = { ip, userAgent: event.headers['user-agent'] };
            // Simple upsert logic
            await db`
                INSERT INTO user_tracking (sf_record_id, sessionId, browser_info, device_info, location_info, click_events, hover_events, intent_summary)
                VALUES (${sfrecordId}, ${sessionId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(cumulativeClicks)}, ${JSON.stringify(cumulativeHovers)}, ${intentSummary})
                ON CONFLICT (id) DO UPDATE SET 
                    click_events = EXCLUDED.click_events,
                    hover_events = EXCLUDED.hover_events,
                    intent_summary = EXCLUDED.intent_summary
            `.catch(async () => {
                // Fallback if upsert fails (e.g. no PK conflict because we don't know ID)
                await db`
                    UPDATE user_tracking 
                    SET click_events = ${JSON.stringify(cumulativeClicks)}, 
                        hover_events = ${JSON.stringify(cumulativeHovers)}, 
                        intent_summary = ${intentSummary}
                    WHERE sessionId = ${sessionId}
                `;
            });
        } catch (dbWriteError) {
            console.error('❌ DB Write failed (Non-blocking):', dbWriteError.message);
        }

        // ------------------------------------------------------------
        // 3. SALESFORCE UPDATE (Primary Mission)
        // ------------------------------------------------------------
        try {
            const clientId = process.env.SALESFORCE_CLIENT_ID;
            const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
            const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

            if (clientId && clientSecret && tokenUrl) {
                const formData = new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret });
                const authRes = await fetch(tokenUrl, { method: 'POST', body: formData });

                if (authRes.ok) {
                    const { access_token, instance_url } = await authRes.json();
                    const leadRes = await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                        headers: { 'Authorization': `Bearer ${access_token}` }
                    });

                    if (leadRes.ok) {
                        const leadData = await leadRes.json();
                        let existingIntent = leadData.Salesforce_Power_Intent__c || '';
                        const sessionMarker = `[Ref: ${sessionId}]`;
                        let newIntent;

                        if (existingIntent.includes(sessionMarker)) {
                            const blocks = existingIntent.split('\n\n---\n\n');
                            const idx = blocks.findIndex(b => b.includes(sessionMarker));
                            if (idx !== -1) { blocks[idx] = intentSummary; newIntent = blocks.join('\n\n---\n\n'); }
                            else newIntent = `${existingIntent}\n\n---\n\n${intentSummary}`;
                        } else {
                            newIntent = existingIntent ? `${existingIntent}\n\n---\n\n${intentSummary}` : intentSummary;
                        }

                        await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                            method: 'PATCH',
                            headers: { 'Authorization': `Bearer ${access_token}`, 'Content-Type': 'application/json' },
                            body: JSON.stringify({ Salesforce_Power_Intent__c: newIntent.substring(0, 32000) }),
                        });
                    }
                }
            }
        } catch (sfError) {
            console.error('❌ Salesforce update failed:', sfError.message);
        }

        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: true }),
        };

    } catch (criticalError) {
        console.error('❌ logUserIntent CRITICAL:', criticalError);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: criticalError.message,
                stack: criticalError.stack,
                diagnostics: {
                    hasRecordId: !!payload?.sfrecordId,
                    sessionId: payload?.sessionId || 'none',
                    timestamp: new Date().toISOString()
                }
            }),
        };
    }
};
