export interface DecisionMaker {
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
}

export interface CompanyExtract {
  name?: string;
  industry?: string;
  website?: string;
  location?: string;
}

export interface CaptureBriefing {
  summary?: string;
  projects?: string[];
  products?: string[];
  latestNews?: string[];
  salesforceOpportunities?: string[];
  nextSteps?: string[];
}

export interface CaptureRecord {
  id: string;
  createdAt: string;
  classification: string;
  company: CompanyExtract | null;
  decisionMakers: DecisionMaker[];
  notes?: string;
  imagePreview?: string;
  briefing?: CaptureBriefing;
  source?: string;
}

export interface CaptureSubmission {
  imageData: string;
  fileName?: string;
  source?: "camera" | "upload";
}

export interface CaptureSubmissionResponse {
  record: CaptureRecord;
  message?: string;
}

const STORAGE_KEY = "cloudastick_intelligence_captures";
const API_ENDPOINT = "/.netlify/functions/intelligence-capture";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidDateString = (value: unknown): value is string =>
  isNonEmptyString(value) && !Number.isNaN(Date.parse(value));

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (isNonEmptyString(entry) ? entry.trim() : null))
    .filter((entry): entry is string => Boolean(entry));
};

const normalizeBriefing = (value: unknown): CaptureBriefing | undefined => {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const data = value as Record<string, unknown>;
  const summary = isNonEmptyString(data.summary)
    ? data.summary.trim()
    : undefined;
  const projects = toStringArray(data.projects);
  const products = toStringArray(data.products);
  const latestNews = toStringArray(data.latestNews);
  const salesforceOpportunities = toStringArray(
    data.salesforceOpportunities
  );
  const nextSteps = toStringArray(data.nextSteps);

  if (
    !summary &&
    !projects.length &&
    !products.length &&
    !latestNews.length &&
    !salesforceOpportunities.length &&
    !nextSteps.length
  ) {
    return undefined;
  }

  return {
    summary,
    projects: projects.length ? projects : undefined,
    products: products.length ? products : undefined,
    latestNews: latestNews.length ? latestNews : undefined,
    salesforceOpportunities: salesforceOpportunities.length
      ? salesforceOpportunities
      : undefined,
    nextSteps: nextSteps.length ? nextSteps : undefined,
  } satisfies CaptureBriefing;
};

const normalizeCompany = (company: unknown): CompanyExtract | null => {
  if (!company || typeof company !== "object") {
    return null;
  }

  const data = company as Record<string, unknown>;
  const normalized: CompanyExtract = {
    name: isNonEmptyString(data.name) ? data.name.trim() : undefined,
    industry: isNonEmptyString(data.industry) ? data.industry.trim() : undefined,
    website: isNonEmptyString(data.website) ? data.website.trim() : undefined,
    location: isNonEmptyString(data.location) ? data.location.trim() : undefined,
  };

  return Object.values(normalized).some((value) => value !== undefined)
    ? normalized
    : null;
};

const normalizeDecisionMakers = (value: unknown): DecisionMaker[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Record<string, unknown>;
      const name = isNonEmptyString(data.name) ? data.name.trim() : undefined;
      const title = isNonEmptyString(data.title) ? data.title.trim() : undefined;
      const email = isNonEmptyString(data.email) ? data.email.trim() : undefined;
      const linkedin = isNonEmptyString(data.linkedin)
        ? data.linkedin.trim()
        : undefined;

      if (!name && !title && !email && !linkedin) {
        return null;
      }

      return {
        name: name ?? "Unknown contact",
        title: title ?? "",
        email,
        linkedin,
      } satisfies DecisionMaker;
    })
    .filter((item): item is DecisionMaker => Boolean(item));
};

const normalizeRecord = (value: unknown): CaptureRecord => {
  const fallbackTimestamp = new Date().toISOString();
  const data = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;

  const normalized: CaptureRecord = {
    id: isNonEmptyString(data.id) ? data.id : `local-${Date.now()}`,
    createdAt: isValidDateString(data.createdAt) ? data.createdAt : fallbackTimestamp,
    classification: isNonEmptyString(data.classification)
      ? data.classification
      : "Unclassified",
    company: normalizeCompany(data.company ?? null),
    decisionMakers: normalizeDecisionMakers(data.decisionMakers),
    notes: isNonEmptyString(data.notes) ? data.notes : undefined,
    imagePreview: isNonEmptyString(data.imagePreview)
      ? data.imagePreview
      : undefined,
    briefing: normalizeBriefing(data.briefing),
    source: isNonEmptyString(data.source) ? data.source : undefined,
  };

  return normalized;
};

const sortRecords = (records: CaptureRecord[]) =>
  [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

const loadStoredRecords = (): CaptureRecord[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortRecords(parsed.map((record) => normalizeRecord(record)));
  } catch (error) {
    console.error("Failed to read stored captures", error);
    return [];
  }
};

const persistRecords = (records: CaptureRecord[]) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const normalized = sortRecords(records.map((record) => normalizeRecord(record)));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    console.error("Failed to persist captures", error);
  }
};

const buildLocalRecord = (submission: CaptureSubmission): CaptureRecord => {
  const timestamp = new Date().toISOString();
  const company: CompanyExtract = {
    name: "Unclassified Prospect",
    industry: "Pending Review",
  };

  return {
    id: `local-${Date.now()}`,
    createdAt: timestamp,
    classification: "Review Required",
    company,
    decisionMakers: [],
    notes:
      "Analysis service unavailable. This record was stored locally for manual follow-up.",
    imagePreview: submission.imageData,
    briefing: {
      summary:
        "Automated analysis is offline. Conduct manual research for company details and try again later.",
      nextSteps: [
        "Re-run this capture once connectivity is restored.",
        "Look up the company name and decision makers manually in the interim.",
      ],
    },
    source: submission.source,
  };
};

const cacheAndReturn = (records: CaptureRecord[]) => {
  const sorted = sortRecords(records);
  persistRecords(sorted);
  return sorted;
};

export const listCaptures = async (): Promise<CaptureRecord[]> => {
  const cached = loadStoredRecords();

  try {
    const response = await fetch(`${API_ENDPOINT}?limit=50`);

    if (!response.ok) {
      throw new Error(`Unable to list captures (${response.status})`);
    }

    const payload = (await response.json()) as { records?: unknown };

    if (Array.isArray(payload.records)) {
      const normalized = payload.records.map((record) => normalizeRecord(record));
      return cacheAndReturn(normalized);
    }

    return cached;
  } catch (error) {
    if (cached.length) {
      console.warn("Falling back to cached capture records", error);
      return cached;
    }

    throw error;
  }
};

export const submitCapture = async (
  payload: CaptureSubmission
): Promise<CaptureSubmissionResponse> => {
  const cached = loadStoredRecords();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Capture submission failed (${response.status})`);
    }

    const data = (await response.json()) as {
      record?: unknown;
      records?: unknown;
      message?: unknown;
    };

    if (Array.isArray(data.records)) {
      const normalized = data.records.map((record) => normalizeRecord(record));
      cacheAndReturn(normalized);
    }

    if (data.record) {
      const normalizedRecord = normalizeRecord(data.record);
      const updated = cacheAndReturn([normalizedRecord, ...cached]);
      return {
        record: updated.find((item) => item.id === normalizedRecord.id) ?? normalizedRecord,
        message: isNonEmptyString(data.message) ? data.message : undefined,
      };
    }

    throw new Error("Capture service did not return a record");
  } catch (error) {
    console.error("Capture submission error", error);
    const fallbackRecord = buildLocalRecord(payload);
    const updated = cacheAndReturn([fallbackRecord, ...cached]);
    return {
      record: updated.find((item) => item.id === fallbackRecord.id) ?? fallbackRecord,
      message:
        "Capture stored locally because the analysis service is currently unavailable.",
    };
  }
};
