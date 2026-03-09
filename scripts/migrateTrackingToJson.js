/**
 * Standalone script to migrate legacy Salesforce Power Intent data to JSON format.
 */

const fetch = require('node-fetch');

async function migrate() {
    console.log('🚀 Starting Salesforce Intent Migration...');

    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    const tokenUrl = process.env.SALESFORCE_TOKEN_URL;

    if (!clientId || !clientSecret || !tokenUrl) {
        console.error('❌ Missing Salesforce credentials in environment');
        return;
    }

    try {
        const formData = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret
        });

        const authRes = await fetch(tokenUrl, { method: 'POST', body: formData });
        if (!authRes.ok) throw new Error('Auth failed');
        const { access_token, instance_url } = await authRes.json();

        // Query for Leads and Opportunities with non-empty intent
        const queries = [
            `SELECT Id, Salesforce_Power_Intent__c FROM Lead WHERE Salesforce_Power_Intent__c != null`,
            `SELECT Id, Salesforce_Power_Intent__c FROM Opportunity WHERE Salesforce_Power_Intent__c != null`
        ];

        for (const query of queries) {
            const objectType = query.includes('Lead') ? 'Lead' : 'Opportunity';
            const searchRes = await fetch(`${instance_url}/services/data/v58.0/query?q=${encodeURIComponent(query)}`, {
                headers: { 'Authorization': `Bearer ${access_token}` }
            });

            if (!searchRes.ok) continue;

            const { records } = await searchRes.json();
            console.log(`🔍 Found ${records.length} ${objectType} records to process.`);

            for (const record of records) {
                const existingIntent = record.Salesforce_Power_Intent__c;
                const tryParseTracking = (str) => {
                    if (!str || typeof str !== 'string') return null;
                    const trimmed = str.trim();
                    if (!trimmed.startsWith('{') && !trimmed.startsWith('"')) return null;
                    try {
                        const parsed = JSON.parse(trimmed);
                        if (typeof parsed === 'string') return tryParseTracking(parsed);
                        if (parsed && typeof parsed === 'object') return parsed;
                    } catch (e) { return null; }
                    return null;
                };

                const deepFlatten = (data) => {
                    if (!data) return;
                    const parsed = tryParseTracking(data);
                    if (parsed && typeof parsed === 'object') {
                        if (parsed.sessions && typeof parsed.sessions === 'object') {
                            Object.assign(intentJson.sessions, parsed.sessions);
                        }
                        if (parsed.legacyData) deepFlatten(parsed.legacyData);
                    } else if (typeof data === 'string' && data.trim()) {
                        if (!data.trim().startsWith('{')) {
                            if (data.length > (intentJson.legacyData || "").length) {
                                intentJson.legacyData = data.trim();
                            }
                        }
                    }
                };

                console.log(`🔄 Cleaning/Flattening corrupted record ${record.Id}...`);
                deepFlatten(existingIntent);

                // Attempt basic session extraction if markers exist in legacy text
                if (intentJson.legacyData && intentJson.legacyData.includes('[SESSION:')) {
                    const sessionMarkers = intentJson.legacyData.match(/\[SESSION:(sess_[^\]]+)\]/g);
                    if (sessionMarkers) {
                        sessionMarkers.forEach(marker => {
                            const sessId = marker.match(/sess_[^\]]+/)[0];
                            if (!intentJson.sessions[sessId]) {
                                intentJson.sessions[sessId] = {
                                    sessionId: sessId,
                                    migrated: true,
                                    note: "Saved from legacy text"
                                };
                            }
                        });
                    }
                }

                await fetch(`${instance_url}/services/data/v58.0/sobjects/${objectType}/${record.Id}?_HttpMethod=PATCH`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Salesforce_Power_Intent__c: JSON.stringify(intentJson, null, 2) }),
                });
                console.log(`✅ ${record.Id} migrated.`);
            }
        }

        console.log('🏁 Migration complete.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

migrate();
