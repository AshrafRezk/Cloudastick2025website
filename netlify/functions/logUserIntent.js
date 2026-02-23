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
        const { sfrecordId, sessionId, browser, device, clicks: newClicks, hovers: newHovers } = payload;

        if (!sfrecordId) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No sfrecordId, tracking skipped' }),
            };
        }

        const ip = (event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'Unknown').split(',')[0].trim();

        // ------------------------------------------------------------
        // 1. DATA MERGING & SUMMARY
        // ------------------------------------------------------------
        let cumulativeClicks = [...(newClicks || [])];
        let cumulativeHovers = { ...(newHovers || {}) };

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

        let existingSession = [];
        try {
            await withRetry(async () => {
                existingSession = await db`
                    SELECT id, click_events, hover_events, created_at, intent_summary
                    FROM user_tracking
                    WHERE sessionId = ${sessionId}
                    LIMIT 1
                `;
            });
        } catch (dbError) {
            console.error('⚠️ DB Retrieval failed (Non-blocking):', dbError.message);
        }

        if (existingSession.length > 0) {
            const oldHovers = existingSession[0].hover_events || {};
            for (const [key, value] of Object.entries(oldHovers)) {
                cumulativeHovers[key] = (cumulativeHovers[key] || 0) + value;
            }
            cumulativeClicks = [...(existingSession[0].click_events || []), ...(newClicks || [])];
        }

        const formatDuration = (ms) => ms < 1000 ? 'briefly' : (ms < 60000 ? `${Math.floor(ms / 1000)}s` : `${Math.floor(ms / 60000)}m`);
        const sectionNames = { 'hero-section': 'Value Proposition', 'hub-and-spoke': 'Platform Hub', 'comparison-table': 'Feature Matrix', 'personalization-section': 'Personalization Engine', 'platform-overview': 'Core Concepts', 'industries-grid': 'Industry Verticals', 'pharma-sections': 'Life Sciences', 'financial-sections': 'FSI Solutions', 'real-estate-sections': 'Property Tech', 'investment-plan-section': 'ROI Plan', 'modules-section': 'Scope Spec', 'techsa-section': 'Partners', 'erp-integration': 'Integration', 'data-cloud': 'Data Intelligence' };

        const sortedHovers = Object.entries(cumulativeHovers).sort((a, b) => b[1] - a[1]).filter(([_, t]) => t > 2000);
        const highInterest = cumulativeClicks.some(c => c.text?.toLowerCase().includes('is interested'));

        const summarySections = [];
        if (sortedHovers.length > 0) summarySections.push(`📈 ENGAGEMENT HOTSPOTS:\n${sortedHovers.slice(0, 4).map(([id, t]) => `• ${sectionNames[id] || id}: ${formatDuration(t)}`).join('\n')}`);

        const significantClicks = cumulativeClicks.filter(c => c.text && c.text.length > 2 && c.element !== 'svg' && !c.text.includes('\n')).map(c => c.text.trim()).filter((v, i, a) => a.indexOf(v) === i).slice(-6);
        if (significantClicks.length > 0) summarySections.push(`🎬 KEY USER ACTIONS:\n${significantClicks.map(text => `• ${text}`).join('\n')}`);

        const intentSummary = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 USER INTENT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${highInterest ? '🚀 PRIORITY: DIRECT INTEREST EXPRESSED\n\n' : ''}${summarySections.length > 0 ? summarySections.join('\n\n') : '• User is active on the page.'}

📍 CONTEXT:
• Origin: ${ip}
• Device: ${device?.screenSize || 'Desktop'}
• Session: [Ref: ${sessionId}]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        // ------------------------------------------------------------
        // 2. NON-BLOCKING DB STORAGE (with Retry)
        // ------------------------------------------------------------
        try {
            const locationInfo = { ip, userAgent: event.headers['user-agent'] };
            await withRetry(async () => {
                await db`
                    INSERT INTO user_tracking (sf_record_id, sessionId, browser_info, device_info, location_info, click_events, hover_events, intent_summary)
                    VALUES (${sfrecordId}, ${sessionId}, ${JSON.stringify(browser)}, ${JSON.stringify(device)}, ${JSON.stringify(locationInfo)}, ${JSON.stringify(cumulativeClicks)}, ${JSON.stringify(cumulativeHovers)}, ${intentSummary})
                    ON CONFLICT (sessionId) DO UPDATE SET 
                        click_events = EXCLUDED.click_events,
                        hover_events = EXCLUDED.hover_events,
                        intent_summary = EXCLUDED.intent_summary
                `.catch(async () => {
                    // Fallback UPDATE by sessionId if no conflict constraint triggered
                    await db`
                        UPDATE user_tracking 
                        SET click_events = ${JSON.stringify(cumulativeClicks)}, 
                            hover_events = ${JSON.stringify(cumulativeHovers)}, 
                            intent_summary = ${intentSummary}
                        WHERE sessionId = ${sessionId}
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
                    const leadRes = await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}`, {
                        headers: { 'Authorization': `Bearer ${access_token}` }
                    });

                    if (leadRes.ok) {
                        const leadData = await leadRes.json();
                        let existingIntent = leadData.Salesforce_Power_Intent__c || '';
                        let currentInterestLevel = leadData.Interest_Level__c || 'Low';
                        const sessionMarker = `[Ref: ${sessionId}]`;
                        let newIntent;

                        // 1. DETERMINE NEW INTEREST DATA
                        let newInterestLevel = highInterest ? 'High' : (sortedHovers.length > 5 ? 'Medium' : 'Low');
                        let newReason = '';

                        if (highInterest) {
                            newReason = `User explicitly clicked the Interest button during session ${sessionId}.`;
                        } else if (sortedHovers.length > 0) {
                            newReason = `User explored ${sortedHovers.length} sections, focused on ${sectionNames[sortedHovers[0][0]] || sortedHovers[0][0]}.`;
                        }

                        // 2. NO-DOWNGRADE LOGIC
                        const levelScores = { 'High': 3, 'Medium': 2, 'Low': 1 };
                        const updateFields = { Salesforce_Power_Intent__c: '' };

                        if (levelScores[newInterestLevel] > levelScores[currentInterestLevel]) {
                            updateFields.Interest_Level__c = newInterestLevel;
                            if (newReason) updateFields.Interest_Level_Reason__c = newReason.substring(0, 255);
                        } else if (newInterestLevel === 'High' && currentInterestLevel === 'High') {
                            // If already high, just update reason if it's an explicit interest click
                            if (highInterest) updateFields.Interest_Level_Reason__c = newReason.substring(0, 255);
                        }

                        // 3. MERGE INTENT SUMMARY
                        const SESSION_SEP = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

                        if (existingIntent.includes(sessionMarker)) {
                            const blocks = existingIntent.split(SESSION_SEP);
                            const idx = blocks.findIndex(b => b.includes(sessionMarker));
                            if (idx !== -1) {
                                blocks[idx] = intentSummary;
                                newIntent = blocks.join(SESSION_SEP);
                            } else {
                                newIntent = `${existingIntent}${SESSION_SEP}${intentSummary}`;
                            }
                        } else {
                            newIntent = existingIntent ? `${existingIntent}${SESSION_SEP}${intentSummary}` : intentSummary;
                        }

                        updateFields.Salesforce_Power_Intent__c = newIntent.substring(0, 32000);

                        // 4. SIMPLE POST METHOD with PATCH OVERRIDE
                        await fetch(`${instance_url}/services/data/v58.0/sobjects/Lead/${sfrecordId}?_HttpMethod=PATCH`, {
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
