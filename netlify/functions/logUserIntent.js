/**
 * Netlify Function: logUserIntent
 * Simplified POST method for Salesforce and smart DB retry logic.
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
        const { sfrecordId, recordType = 'Lead', sessionId, browser, device, clicks: newClicks, hovers: newHovers, videoOpened: newVideoOpened, videoViewDuration: newVideoViewDuration } = payload;

        if (!sfrecordId) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        const ip = (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown').split(',')[0].trim();

        // ------------------------------------------------------------
        // 1. DATA MERGING & SUMMARY (Session + IP Accumulation)
        // ------------------------------------------------------------
        let cumulativeClicks = [...(newClicks || [])];
        let cumulativeHovers = { ...(newHovers || {}) };
        let cumulativeVideoOpened = !!newVideoOpened;
        let cumulativeVideoViewDuration = Number(newVideoViewDuration || 0);

        const db = getDb();

        // SMART RETRY WRAPPER
        const withRetry = async (fn, retries = 3, delay = 500) => {
            for (let i = 0; i < retries; i++) {
                try {
                    return await fn();
                } catch (err) {
                    if (i === retries - 1) throw err;
                    console.warn(`⚠️ DB Retry ${i + 1}/${retries} after ${delay}ms...`);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        };

        // Fetch ALL tracking data for this sfrecordId and IP to accumulate
        let allTrackingData = [];
        try {
            await withRetry(async () => {
                allTrackingData = await db`
                    SELECT sessionId, click_events, hover_events, video_opened, video_view_duration, created_at, updated_at
                    FROM user_tracking
                    WHERE sf_record_id = ${sfrecordId} 
                    AND location_info->>'ip' = ${ip}
                    ORDER BY created_at ASC
                `;
            });
        } catch (dbError) {
            console.error('⚠️ DB Retrieval failed (Non-blocking):', dbError.message);
        }

        // Merge logic: 
        // 1. Identify current session data from DB if it exists
        // 2. Accumulate everything from other sessions from the same IP
        let firstViewAt = new Date();
        let lastViewAt = new Date();
        let sessionCount = 1;

        if (allTrackingData.length > 0) {
            const sessionsMap = new Map();
            allTrackingData.forEach(row => {
                sessionsMap.set(row.sessionid, row);
            });

            // Timestamps based on existing records
            firstViewAt = new Date(allTrackingData[0].created_at);
            lastViewAt = new Date(); // Current interaction is latest
            sessionCount = sessionsMap.size;

            // If the current sessionId is NOT in the sessionsMap yet, it's a "fresh open"
            if (!sessionsMap.has(sessionId)) {
                sessionCount += 1;
            }

            // If current session exists in DB, we merge it with payload first
            const existingInDb = sessionsMap.get(sessionId);
            if (existingInDb) {
                const oldHovers = existingInDb.hover_events || {};
                for (const [key, value] of Object.entries(oldHovers)) {
                    cumulativeHovers[key] = (cumulativeHovers[key] || 0) + value;
                }
                cumulativeClicks = [...(existingInDb.click_events || []), ...(newClicks || [])];
                cumulativeVideoOpened = cumulativeVideoOpened || !!existingInDb.video_opened;
                cumulativeVideoViewDuration = Math.max(cumulativeVideoViewDuration, Number(existingInDb.video_view_duration || 0));

                // Remove from map to avoid double-counting in IP accumulation
                sessionsMap.delete(sessionId);
            }

            // Now accumulate from ALL OTHER sessions from the same IP
            for (const otherSession of sessionsMap.values()) {
                const otherHovers = otherSession.hover_events || {};
                for (const [key, value] of Object.entries(otherHovers)) {
                    cumulativeHovers[key] = (cumulativeHovers[key] || 0) + value;
                }
                // For clicks, we just combine unique actions if possible
                cumulativeClicks = [...(otherSession.click_events || []), ...cumulativeClicks];
                cumulativeVideoOpened = cumulativeVideoOpened || !!otherSession.video_opened;
                cumulativeVideoViewDuration += Number(otherSession.video_view_duration || 0);
            }
        }

        const formatDuration = (ms) => ms < 1000 ? 'briefly' : (ms < 60000 ? `${Math.floor(ms / 1000)}s` : `${Math.floor(ms / 60000)}m`);
        const sectionNames = { 'hero-section': 'Value Proposition', 'hub-and-spoke': 'Platform Hub', 'comparison-table': 'Feature Matrix', 'personalization-section': 'Personalization Engine', 'platform-overview': 'Core Concepts', 'industries-grid': 'Industry Verticals', 'pharma-sections': 'Life Sciences', 'financial-sections': 'FSI Solutions', 'real-estate-sections': 'Property Tech', 'investment-plan-section': 'ROI Plan', 'modules-section': 'Scope Spec', 'techsa-section': 'Partners', 'erp-integration': 'Integration', 'data-cloud': 'Data Intelligence', 'printing-industries': 'Printing Solutions' };

        const sortedHovers = Object.entries(cumulativeHovers).sort((a, b) => b[1] - a[1]).filter(([_, t]) => t > 2000);
        const highInterest = payload.highInterest === true || cumulativeClicks.some(c => c.text && c.text.toLowerCase().includes('is interested'));

        const summarySections = [];
        if (sortedHovers.length > 0) summarySections.push(`📈 ENGAGEMENT HOTSPOTS:\n${sortedHovers.slice(0, 4).map(([id, t]) => `• ${sectionNames[id] || id}: ${formatDuration(t)}`).join('\n')}`);

        if (cumulativeVideoOpened) {
            summarySections.push(`🎥 DEMO VIDEO ENGAGEMENT:\n• User watched the demo video\n• Total view duration: ${cumulativeVideoViewDuration.toFixed(1)} seconds`);
        }

        const significantClicks = cumulativeClicks.filter(c => c.text && c.text.length > 2 && c.element !== 'svg' && !c.text.includes('\n')).map(c => c.text.trim()).filter((v, i, a) => a.indexOf(v) === i).slice(-6);
        if (significantClicks.length > 0) summarySections.push(`🎬 KEY USER ACTIONS:\n${significantClicks.map(text => `• ${text}`).join('\n')}`);

        const totalDurationMs = Object.values(cumulativeHovers).reduce((a, b) => a + b, 0);
        const totalMinutes = (totalDurationMs / 60000).toFixed(1);

        const formatDate = (date) => date.toLocaleString('en-GB', { timeZone: 'UTC', hour12: false }) + ' UTC';

        const intentSummary = `💎 USER INTENT REPORT (Accumulated by Origin IP)

${highInterest ? '🚀 PRIORITY: DIRECT INTEREST EXPRESSED\n\n' : ''}${summarySections.length > 0 ? summarySections.join('\n\n') : '• User is active on the page.'}

🕒 ENGAGEMENT:
• Total Time Spent: ${totalMinutes} minutes
• Link Open Count: ${sessionCount} times
• First Origin View: ${formatDate(firstViewAt)}
• Latest Origin Activity: ${formatDate(lastViewAt)}

📍 CONTEXT:
• Origin: ${ip}
• Device: ${device?.screenSize || 'Desktop'}
• Session: [Ref: ${sessionId || payload.sessionId || 'Sess_' + Date.now()}]`;

        // ------------------------------------------------------------
        // 2. NON-BLOCKING DB STORAGE (with Retry)
        // ------------------------------------------------------------
        try {
            const locationInfo = { ip, userAgent: event.headers['user-agent'] };
            const finalSessionId = sessionId || payload.sessionId || 'Sess_' + Date.now();
            await withRetry(async () => {
                await db`
                    INSERT INTO user_tracking (sf_record_id, sessionId, browser_info, device_info, location_info, click_events, hover_events, video_opened, video_view_duration, intent_summary, updated_at)
                    VALUES (${sfrecordId}, ${finalSessionId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(newClicks || [])}, ${JSON.stringify(newHovers || {})}, ${!!newVideoOpened}, ${Number(newVideoViewDuration || 0)}, ${intentSummary}, CURRENT_TIMESTAMP)
                    ON CONFLICT (sessionId) DO UPDATE SET 
                        click_events = EXCLUDED.click_events,
                        hover_events = EXCLUDED.hover_events,
                        video_opened = EXCLUDED.video_opened,
                        video_view_duration = EXCLUDED.video_view_duration,
                        intent_summary = EXCLUDED.intent_summary,
                        updated_at = EXCLUDED.updated_at
                `.catch(async (e) => {
                    console.log('Insert failed, trying update fallback...', e.message);
                    // Fallback UPDATE by sessionId if no conflict constraint triggered
                    await db`
                        UPDATE user_tracking 
                        SET click_events = ${JSON.stringify(newClicks || [])}, 
                            hover_events = ${JSON.stringify(newHovers || {})}, 
                            video_opened = ${!!newVideoOpened},
                            video_view_duration = ${Number(newVideoViewDuration || 0)},
                            intent_summary = ${intentSummary},
                            updated_at = CURRENT_TIMESTAMP
                        WHERE sessionId = ${finalSessionId}
                    `;
                });
            });
        } catch (dbWriteError) {
            console.error('❌ DB Write failed after retries:', dbWriteError.message);
        }

        // ------------------------------------------------------------
        // 3. SALESFORCE UPDATE (Using POST + Method Override)
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

                    // First, get existing content to merge
                    const sfRes = await fetch(`${instance_url}/services/data/v58.0/sobjects/${recordType}/${sfrecordId}`, {
                        headers: { 'Authorization': `Bearer ${access_token}` }
                    });

                    if (sfRes.ok) {
                        const sfData = await sfRes.json();
                        let existingIntent = sfData.Salesforce_Power_Intent__c || '';
                        let currentInterestLevel = sfData.Interest_Level__c;
                        let newIntent;

                        // 1. DETERMINE NEW INTEREST DATA
                        let newInterestLevel = highInterest ? 'High' : (sortedHovers.length > 5 ? 'Medium' : 'Low');
                        let newReason = '';

                        if (highInterest) {
                            newReason = '🔥 Customer expressed Interest';
                        } else if (sortedHovers.length > 0) {
                            newReason = `User explored ${sortedHovers.length} sections, focused on ${sectionNames[sortedHovers[0][0]] || sortedHovers[0][0]}.`;
                        }

                        // 2. NO-DOWNGRADE & FORCE-FILL LOGIC
                        const levelScores = { 'High': 3, 'Medium': 2, 'Low': 1, null: 0, undefined: 0 };
                        const updateFields = { Salesforce_Power_Intent__c: intentSummary.substring(0, 32000) };

                        // Update if new level is higher OR if current level is empty/null in Salesforce
                        if (!currentInterestLevel || levelScores[newInterestLevel] > levelScores[currentInterestLevel]) {
                            updateFields.Interest_Level__c = newInterestLevel;
                            if (newReason) updateFields.Interest_Level_Reason__c = newReason.substring(0, 255);
                        } else if (newInterestLevel === 'High' && currentInterestLevel === 'High' && highInterest) {
                            // Already high, but user clicked explicit interest button again - update reason
                            updateFields.Interest_Level_Reason__c = newReason.substring(0, 255);
                        }

                        // 3. SET INTENT SUMMARY (OVERRIDE MODE)
                        // This already happened in updateFields initialization

                        // 4. SIMPLE POST METHOD with PATCH OVERRIDE
                        await fetch(`${instance_url}/services/data/v58.0/sobjects/${recordType}/${sfrecordId}?_HttpMethod=PATCH`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${access_token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updateFields),
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
            body: JSON.stringify({ error: criticalError.message }),
        };
    }
};
