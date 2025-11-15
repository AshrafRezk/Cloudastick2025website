const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'intelligence-capture';
const STORE_KEY = 'records';

const RESPONSE_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

const ok = (body) => ({
  statusCode: 200,
  headers: RESPONSE_HEADERS,
  body: JSON.stringify(body),
});

const errorResponse = (statusCode, message) => ({
  statusCode,
  headers: RESPONSE_HEADERS,
  body: JSON.stringify({ error: message }),
});

const createId = () => `cap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const parseDataUrl = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^data:(.*?);base64,(.*)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1] || 'image/png',
    data: match[2],
  };
};

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const toStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (isNonEmptyString(item) ? item.trim() : null))
    .filter(Boolean);
};

const cleanCompany = (value) => {
  if (!value || typeof value !== 'object') {
    return {
      name: null,
      industry: null,
      website: null,
      location: null,
    };
  }

  const data = value;
  return {
    name: isNonEmptyString(data.name) ? data.name.trim() : null,
    industry: isNonEmptyString(data.industry) ? data.industry.trim() : null,
    website: isNonEmptyString(data.website) ? data.website.trim() : null,
    location: isNonEmptyString(data.location) ? data.location.trim() : null,
  };
};

const callGemini = async (image, instructions) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_VISION_MODEL || 'gemini-1.5-flash';

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: instructions },
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
      topP: 0.8,
      responseMimeType: 'application/json',
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini response missing text payload');
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Unable to parse Gemini response: ${err.message}`);
  }
};

const mergeBriefing = (primary, supplemental) => {
  const summary = isNonEmptyString(primary?.summary)
    ? primary.summary.trim()
    : isNonEmptyString(supplemental?.summary)
    ? supplemental.summary.trim()
    : undefined;

  const projects = [
    ...toStringArray(primary?.projects || []),
    ...toStringArray(supplemental?.projects || []),
  ];

  const products = [
    ...toStringArray(primary?.products || []),
    ...toStringArray(supplemental?.products || []),
  ];

  const latestNews = [
    ...toStringArray(primary?.latestNews || []),
    ...toStringArray(supplemental?.latestNews || []),
  ];

  const salesforceOpportunities = [
    ...toStringArray(primary?.salesforceOpportunities || []),
    ...toStringArray(supplemental?.salesforceOpportunities || []),
  ];

  const nextSteps = [
    ...toStringArray(primary?.nextSteps || []),
    ...toStringArray(supplemental?.nextSteps || []),
  ];

  const result = {
    summary,
    projects: projects.length ? projects : undefined,
    products: products.length ? products : undefined,
    latestNews: latestNews.length ? latestNews : undefined,
    salesforceOpportunities: salesforceOpportunities.length
      ? salesforceOpportunities
      : undefined,
    nextSteps: nextSteps.length ? nextSteps : undefined,
  };

  if (
    !result.summary &&
    !result.projects &&
    !result.products &&
    !result.latestNews &&
    !result.salesforceOpportunities &&
    !result.nextSteps
  ) {
    return undefined;
  }

  return result;
};

const fetchSupplementalNews = async (company) => {
  try {
    const { handler: fetchNewsHandler } = require('./fetchNews');
    const newsResponse = await fetchNewsHandler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({
        companyName: company.name,
        industry: company.industry,
      }),
    });

    if (newsResponse.statusCode !== 200) {
      return { latestNews: [] };
    }

    const payload = JSON.parse(newsResponse.body || '{}');
    const latestNews = Array.isArray(payload.articles)
      ? payload.articles
          .map((article) => {
            if (!article || typeof article !== 'object') {
              return null;
            }

            const title = article.title || 'Untitled article';
            const rawSource = article.source;
            const source =
              typeof rawSource === 'string'
                ? rawSource
                : rawSource && typeof rawSource === 'object'
                ? rawSource.name
                : undefined;
            return source ? `${title} — ${source}` : title;
          })
          .filter(Boolean)
      : [];

    const nextSteps = Array.isArray(payload.events)
      ? payload.events
          .map((event) =>
            event && event.title ? `Potential event: ${event.title}` : null
          )
          .filter(Boolean)
      : [];

    return {
      latestNews,
      nextSteps,
    };
  } catch (err) {
    console.warn('Failed to fetch supplemental news', err);
    return { latestNews: [] };
  }
};

const readRecords = async () => {
  try {
    const store = getStore(STORE_NAME);
    const raw = await store.get(STORE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Unable to read stored capture records', err);
    return [];
  }
};

const writeRecords = async (records) => {
  try {
    const store = getStore(STORE_NAME);
    await store.set(STORE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to persist capture records', err);
  }
};

const sortRecords = (records) =>
  [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

const buildRecord = ({
  classification,
  company,
  decisionMakers,
  notes,
  briefing,
  imageData,
  source,
}) => ({
  id: createId(),
  createdAt: new Date().toISOString(),
  classification: classification || 'Review Required',
  company,
  decisionMakers,
  notes,
  briefing,
  source,
  imagePreview: imageData,
});

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        ...RESPONSE_HEADERS,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod === 'GET') {
    const records = sortRecords(await readRecords());
    return ok({ records });
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse(405, 'Method not allowed');
  }

  try {
    const submission = JSON.parse(event.body || '{}');
    if (!submission.imageData || !isNonEmptyString(submission.imageData)) {
      return errorResponse(400, 'imageData is required for capture analysis');
    }

    const parsedImage = parseDataUrl(submission.imageData);
    if (!parsedImage) {
      return errorResponse(400, 'imageData must be a base64 data URL');
    }

    const geminiInstructions = `You are an enterprise sales intelligence analyst. Analyze the provided photo (business card, brochure, booth signage, etc.) and infer the most likely company and context. Respond in valid JSON with the following schema:
{
  "classification": string // e.g. "Hot Prospect", "Existing Customer", "Partner Opportunity"
  "company": {
    "name": string | null,
    "industry": string | null,
    "website": string | null,
    "location": string | null
  },
  "decisionMakers": [
    {
      "name": string,
      "title": string,
      "email": string | null,
      "linkedin": string | null
    }
  ],
  "notes": string | null,
  "briefing": {
    "summary": string | null,
    "projects": string[],
    "products": string[],
    "latestNews": string[],
    "salesforceOpportunities": string[],
    "nextSteps": string[]
  }
}
Keep arrays concise (max 5 items) and omit speculative personal emails unless they are explicitly visible. If uncertain, use null or empty arrays. Focus Salesforce opportunities on how the platform can help the company.`;

    let geminiPayload = null;
    try {
      geminiPayload = await callGemini(parsedImage, geminiInstructions);
    } catch (err) {
      console.error('Gemini analysis failed', err);
    }

    const company = cleanCompany(geminiPayload?.company);
    const decisionMakers = Array.isArray(geminiPayload?.decisionMakers)
      ? geminiPayload.decisionMakers
          .map((item) => {
            if (!item || typeof item !== 'object') {
              return null;
            }

            const name = isNonEmptyString(item.name)
              ? item.name.trim()
              : 'Unidentified contact';
            const title = isNonEmptyString(item.title) ? item.title.trim() : '';
            const email = isNonEmptyString(item.email)
              ? item.email.trim()
              : undefined;
            const linkedin = isNonEmptyString(item.linkedin)
              ? item.linkedin.trim()
              : undefined;

            if (!name && !title && !email && !linkedin) {
              return null;
            }

            return {
              name: name || 'Unidentified contact',
              title,
              email,
              linkedin,
            };
          })
          .filter(Boolean)
      : [];

    const geminiBriefing = geminiPayload?.briefing || {};
    const supplemental = await fetchSupplementalNews(company);
    const briefing = mergeBriefing(geminiBriefing, supplemental);

    const notes = isNonEmptyString(geminiPayload?.notes)
      ? geminiPayload.notes.trim()
      : !geminiPayload
      ? 'Vision analysis unavailable. Capture stored with limited automated insights.'
      : undefined;

    const record = buildRecord({
      classification: isNonEmptyString(geminiPayload?.classification)
        ? geminiPayload.classification.trim()
        : undefined,
      company,
      decisionMakers,
      notes,
      briefing,
      imageData: submission.imageData,
      source: submission.source || 'unknown',
    });

    const existing = await readRecords();
    const updatedRecords = sortRecords([record, ...existing]).slice(0, 50);
    await writeRecords(updatedRecords);

    return ok({
      record,
      records: updatedRecords,
      message:
        'Capture analyzed successfully. Intelligence has been added to your workspace.',
    });
  } catch (err) {
    console.error('Capture analysis error', err);

    let originalPayload = {};
    try {
      originalPayload = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.warn('Unable to parse original payload for fallback', parseError);
    }

    const fallbackRecord = buildRecord({
      classification: 'Review Required',
      company: {
        name: null,
        industry: null,
        website: null,
        location: null,
      },
      decisionMakers: [],
      notes:
        'Automatic analysis was unavailable. Follow up manually and rerun when services are restored.',
      briefing: {
        summary:
          'Analysis services are currently offline. Please perform manual research and retry once connectivity is restored.',
        nextSteps: [
          'Email the capture to the research team for manual follow-up.',
          'Retry the automated analysis when services are back online.',
        ],
      },
      imageData:
        typeof originalPayload.imageData === 'string'
          ? originalPayload.imageData
          : undefined,
      source: isNonEmptyString(originalPayload.source)
        ? originalPayload.source
        : 'unknown',
    });

    const existing = await readRecords();
    const updatedRecords = sortRecords([fallbackRecord, ...existing]).slice(0, 50);
    await writeRecords(updatedRecords);

    return ok({
      record: fallbackRecord,
      records: updatedRecords,
      message:
        'Capture stored locally because the intelligence service is currently unavailable.',
    });
  }
};
