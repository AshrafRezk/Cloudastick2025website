/**
 * CustomerSurvey.tsx
 *
 * Standalone customer-facing survey page at /survey
 * URL: https://www.cloudastick.org/survey?token=...&accountName=...&projectName=...&consultantName=...&sessionType=...
 * sessionType values: Demo | UAT | Training | Discovery | Project Status | Project Progress so far | Latest Go-Live
 *
 * Page states: loading → form | submitted | expired | invalid
 * BFF routes: /.netlify/functions/surveyContext  (GET)
 *             /.netlify/functions/surveySubmit   (POST)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Send,
  Building2,
  User,
  Mail,
  MessageSquare,
  Calendar,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SurveyContext {
  valid: boolean;
  status: 'pending' | 'submitted' | 'expired' | string;
  expiresAt: string | null;
  accountName: string;
  accountWebsite: string | null;
  accountLogoUrl: string | null;
  projectName: string;
  consultantName: string;
  sessionType: string;
  sessionDate: string | null;
}

type PageState = 'loading' | 'form' | 'submitted' | 'expired' | 'invalid';

interface RatingField {
  key: 'businessUnderstandingRating' | 'businessImpactRating' | 'consultantUnderstandingRating' | 'overallSessionRating';
  label: string;
  description: string;
  icon: React.ReactNode;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const RATING_FIELDS: RatingField[] = [
  {
    key: 'businessUnderstandingRating',
    label: 'Business Understanding',
    description: 'How well does Cloudastick understand your business?',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    key: 'businessImpactRating',
    label: 'Business Impact',
    description: 'What impact is Cloudastick having on your business?',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    key: 'consultantUnderstandingRating',
    label: 'Consultant Understanding',
    description: 'How well does your consultant understand your needs?',
    icon: <User className="w-5 h-5" />,
  },
  {
    key: 'overallSessionRating',
    label: 'Overall Engagement/Session',
    description: 'Overall, how satisfied are you with this engagement/session with Cloudastick?',
    icon: <Star className="w-5 h-5" />,
  },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Below expectations',
  3: 'Acceptable',
  4: 'Good',
  5: 'Excellent',
};

const COMPANY_VALUES = [
  'Reverence',
  'Efficiency',
  'Inclusion',
  'Transparency',
  'Consistency'
];

const RevolvingValues: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0 opacity-15 md:opacity-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
        className="relative flex items-center justify-center"
      >
        {COMPANY_VALUES.map((val, idx, arr) => {
          const angle = (idx * 360) / arr.length;
          return (
            <div
              key={val}
              className="absolute flex items-center justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="-translate-y-[380px] sm:-translate-y-[450px] md:-translate-y-[550px]">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
                >
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <span
                      className="text-5xl sm:text-7xl md:text-[100px] font-black uppercase tracking-[0.15em] text-transparent whitespace-nowrap"
                      style={{
                        WebkitTextStroke: '2px rgba(255,255,255,0.15)',
                        textShadow: '0 0 30px rgba(255,255,255,0.05)',
                      }}
                    >
                      {val}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ─── Helper: logo resolution ───────────────────────────────────────────────────

function extractDomain(url: string): string | null {
  try {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`;
    const { hostname } = new URL(withProtocol);
    return hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

async function resolveLogoUrl(
  accountWebsite: string | null,
  accountLogoUrl: string | null
): Promise<string | null> {
  // 1. Try Clearbit from website domain
  if (accountWebsite) {
    const domain = extractDomain(accountWebsite);
    if (domain) {
      const clearbitUrl = `https://logo.clearbit.com/${domain}`;
      try {
        const res = await fetch(clearbitUrl, { method: 'HEAD' });
        if (res.ok && res.headers.get('content-type')?.startsWith('image/')) {
          return clearbitUrl;
        }
      } catch {
        // fall through
      }

      // 2. Google favicon as fallback
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      try {
        const res = await fetch(faviconUrl, { method: 'HEAD' });
        if (res.ok) return faviconUrl;
      } catch {
        // fall through
      }
    }
  }

  // 3. Salesforce snapshot logo
  if (accountLogoUrl) return accountLogoUrl;

  return null;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Initials avatar shown when no logo is found */
const InitialsAvatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className="h-14 w-14 rounded-xl flex items-center justify-center text-lg font-bold text-white"
      style={{
        background: 'linear-gradient(135deg, hsl(210 100% 50%) 0%, hsl(188 100% 42%) 100%)',
      }}
    >
      {initials || '?'}
    </div>
  );
};

/** Animated star rating widget */
const StarRating: React.FC<{
  value: number;
  onChange: (v: number) => void;
  hasError: boolean;
}> = ({ value, onChange, hasError }) => {
  const [hovered, setHovered] = useState(0);
  const [animatingValue, setAnimatingValue] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hovered || value);
          const isAnimating = animatingValue > 0 && star <= animatingValue;

          return (
            <motion.button
              key={star}
              type="button"
              aria-label={`Rate ${star} out of 5`}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate(50);
                }
                onChange(star);
                setAnimatingValue(star);
                setTimeout(() => setAnimatingValue(0), 600);
              }}
              onMouseEnter={() => setHovered(star)}
              animate={
                isAnimating
                  ? { scale: [1, 1.4, 1], y: [0, -8, 0], rotate: [0, 15, -10, 0] }
                  : { scale: 1, y: 0, rotate: 0 }
              }
              transition={{
                duration: 0.5,
                delay: isAnimating ? star * 0.04 : 0,
                ease: 'easeInOut'
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none"
            >
              <Star
                className={`w-9 h-9 transition-colors duration-200 ${
                  filled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : hasError
                    ? 'text-red-400/50'
                    : 'text-gray-600 hover:text-amber-300'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {(hovered > 0 || value > 0) && (
          <motion.span
            key={hovered || value}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-medium text-amber-400"
          >
            {RATING_LABELS[hovered || value]}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Full-page loading state */
const LoadingState: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6">
    <motion.img
      src="/Assets/Company Logos/white-logo-dark.webp"
      alt="Cloudastick"
      className="h-12 w-auto object-contain opacity-80"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.8, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center gap-3"
    >
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-gray-400 text-sm">Loading your survey…</p>
    </motion.div>
  </div>
);

/** Already-submitted state */
const AlreadySubmittedState: React.FC<{ feedbackNumber?: string }> = ({ feedbackNumber }) => (
  <FullPageMessage
    icon={<CheckCircle2 className="w-16 h-16 text-emerald-400" />}
    title="Already Submitted"
    subtitle={
      feedbackNumber
        ? `Your feedback (${feedbackNumber}) has already been recorded. Thank you!`
        : 'Your feedback has already been recorded. Thank you for your time!'
    }
    color="emerald"
  />
);

/** Expired state */
const ExpiredState: React.FC = () => (
  <FullPageMessage
    icon={<Clock className="w-16 h-16 text-amber-400" />}
    title="Survey Link Expired"
    subtitle="This survey link has expired. Please contact your Cloudastick project manager if you'd still like to share feedback."
    color="amber"
  />
);

/** Invalid / unknown token state */
const InvalidState: React.FC = () => (
  <FullPageMessage
    icon={<AlertTriangle className="w-16 h-16 text-red-400" />}
    title="Invalid Survey Link"
    subtitle="This survey link is invalid or could not be found. Please check your email for the correct link."
    color="red"
  />
);

/** Thank-you state after successful submit */
const ThankYouState: React.FC<{
  feedbackNumber: string;
  accountName: string;
  logoUrl: string | null;
}> = ({ feedbackNumber, accountName, logoUrl }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      {/* Glass card */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Logo row */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <img
            src="/Assets/Company Logos/white-logo-dark.webp"
            alt="Cloudastick"
            className="h-10 w-auto object-contain"
          />
          {accountName && (
            <>
              <div className="h-6 w-px bg-white/20" />
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={accountName}
                  className="h-10 w-auto max-w-[120px] object-contain bg-white/10 rounded-lg p-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <InitialsAvatar name={accountName} />
              )}
            </>
          )}
        </div>

        {/* Check icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(142 76% 36% / 0.3), hsl(142 76% 36% / 0.1))',
              border: '1px solid hsl(142 76% 36% / 0.4)',
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-3">Thank You!</h1>
        <p className="text-gray-300 mb-6">
          Your feedback has been successfully recorded. We truly appreciate you taking the time to share your thoughts.
        </p>

        {feedbackNumber && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'hsl(188 100% 42% / 0.15)',
              border: '1px solid hsl(188 100% 42% / 0.3)',
              color: 'hsl(188 100% 62%)',
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Reference: {feedbackNumber}
          </div>
        )}

        <p className="text-gray-500 text-xs mt-8">
          Your feedback helps us continuously improve our service.
        </p>
      </div>
    </motion.div>
  </div>
);

/** Generic full-page message card */
const FullPageMessage: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: 'emerald' | 'amber' | 'red';
}> = ({ icon, title, subtitle }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md text-center"
    >
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <img
          src="/Assets/Company Logos/white-logo-dark.webp"
          alt="Cloudastick"
          className="h-10 w-auto object-contain mx-auto mb-8 opacity-70"
        />
        <div className="flex justify-center mb-6">{icon}</div>
        <h1 className="text-xl font-bold text-white mb-3">{title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed">{subtitle}</p>
      </div>
    </motion.div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const CustomerSurvey: React.FC = () => {
  const [searchParams] = useSearchParams();

  // URL params (display/prefill only — authoritative data comes from GET /context)
  const tokenParam = searchParams.get('token') ?? '';
  const accountNameParam = searchParams.get('accountName') ?? '';
  const projectNameParam = searchParams.get('projectName') ?? '';
  const consultantNameParam = searchParams.get('consultantName') ?? '';
  const sessionTypeParam = searchParams.get('sessionType') ?? '';

  // Page state machine
  const [pageState, setPageState] = useState<PageState>('loading');
  const [context, setContext] = useState<SurveyContext | null>(null);
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | null>(null);

  // Form state
  const [respondentName, setRespondentName] = useState('');
  const [respondentEmail, setRespondentEmail] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [ratings, setRatings] = useState<Record<string, number>>({
    businessUnderstandingRating: 0,
    businessImpactRating: 0,
    consultantUnderstandingRating: 0,
    overallSessionRating: 0,
  });
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [ratingErrors, setRatingErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Gimmick state
  const gimmickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showGimmick, setShowGimmick] = useState(false);
  const [gimmickMessage, setGimmickMessage] = useState('');

  // ── Gimmick Effect ─────────────────────────────────────────────────────────

  const triggerGimmick = React.useCallback((val: number) => {
    if (!respondentName.trim()) return;

    if (gimmickTimeoutRef.current) {
      clearTimeout(gimmickTimeoutRef.current);
    }

    const nameTrimmed = respondentName.trim();
    const firstName = nameTrimmed.split(/\s+/)[0];

    if (nameTrimmed.toLowerCase() === 'ashraf rezk') {
      setGimmickMessage(`Thank you, Ashraf, we are glad we are making a food impression!`);
    } else if (val >= 4) {
      setGimmickMessage(`Thank you ${firstName}, we are glad we are making a good impression!`);
    } else {
      setGimmickMessage(`Thank you, ${firstName}, We will definetly work on that moving forward!`);
    }

    setShowGimmick(true);

    gimmickTimeoutRef.current = setTimeout(() => {
      setShowGimmick(false);
    }, 1500);
  }, [respondentName]);

  // Thank-you state
  const [feedbackNumber, setFeedbackNumber] = useState('');
  const [alreadySubmittedNumber, setAlreadySubmittedNumber] = useState('');

  // ── Load context on mount ──────────────────────────────────────────────────

  useEffect(() => {
    if (!tokenParam) {
      setPageState('invalid');
      return;
    }

    const loadContext = async () => {
      try {
        const res = await fetch(
          `/.netlify/functions/surveyContext?token=${encodeURIComponent(tokenParam)}`
        );
        const data = await res.json();

        if (res.status === 409) {
          setAlreadySubmittedNumber(data.feedbackId ?? '');
          setPageState('submitted');
          return;
        }
        if (res.status === 410) {
          setPageState('expired');
          return;
        }
        if (!res.ok) {
          setPageState('invalid');
          return;
        }

        // 200 OK
        if (data.status === 'submitted') {
          setPageState('submitted');
          return;
        }
        if (data.status === 'expired') {
          setPageState('expired');
          return;
        }

        setContext(data as SurveyContext);
        setPageState('form');
      } catch {
        setPageState('invalid');
      }
    };

    loadContext();
  }, [tokenParam]);

  // ── Resolve logo once context loads ────────────────────────────────────────

  useEffect(() => {
    if (!context) return;

    resolveLogoUrl(context.accountWebsite, context.accountLogoUrl).then((url) => {
      setResolvedLogoUrl(url);
    });
  }, [context]);

  // ── Form submit ────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      let hasValidationErrors = false;

      // Validate name and email
      const nErr = !respondentName.trim();
      const eErr = !respondentEmail.trim();
      setNameError(nErr);
      setEmailError(eErr);

      if (nErr || eErr) {
        hasValidationErrors = true;
      }

      // Validate all 4 ratings
      const errors: Record<string, boolean> = {};
      RATING_FIELDS.forEach(({ key }) => {
        if (!ratings[key] || ratings[key] < 1) {
          errors[key] = true;
          hasValidationErrors = true;
        }
      });

      if (hasValidationErrors) {
        setRatingErrors(errors);
        // Scroll to first error
        document.querySelector('[data-error="true"], [data-rating-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      setRatingErrors({});
      setSubmitError(null);
      setIsSubmitting(true);

      try {
        const payload = {
          token: tokenParam,
          ...(respondentName.trim() ? { respondentName: respondentName.trim() } : {}),
          ...(respondentEmail.trim() ? { respondentEmail: respondentEmail.trim() } : {}),
          businessUnderstandingRating: ratings.businessUnderstandingRating,
          businessImpactRating: ratings.businessImpactRating,
          consultantUnderstandingRating: ratings.consultantUnderstandingRating,
          overallSessionRating: ratings.overallSessionRating,
          ...(customerFeedback.trim() ? { customerFeedback: customerFeedback.trim() } : {}),
        };

        const res = await fetch('/.netlify/functions/surveySubmit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.status === 409) {
          setAlreadySubmittedNumber(result.feedbackId ?? '');
          setPageState('submitted');
          return;
        }

        if (res.ok && result.success) {
          setFeedbackNumber(result.feedbackNumber ?? '');
          setPageState('submitted');
          return;
        }

        setSubmitError(result.error ?? 'Something went wrong. Please try again.');
      } catch {
        setSubmitError('Network error. Please check your connection and try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [tokenParam, respondentName, respondentEmail, ratings, customerFeedback]
  );

  // ── Derived display values ─────────────────────────────────────────────────

  const displayAccountName = context?.accountName ?? accountNameParam;
  const displayProjectName = context?.projectName ?? projectNameParam;
  const displayConsultantName = context?.consultantName ?? consultantNameParam;
  const displaySessionType = context?.sessionType ?? sessionTypeParam;
  const displaySessionDate = context?.sessionDate ?? null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet>
        <title>Session Feedback — Cloudastick</title>
        <meta name="description" content="Share your feedback about your Cloudastick session." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Full-page gradient background */}
      <div
        className="min-h-screen text-white"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(210 100% 50% / 0.15) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 80%, hsl(188 100% 42% / 0.1) 0%, transparent 50%), ' +
            'hsl(222 84% 5%)',
          fontFamily: "'Inter', 'system-ui', sans-serif",
        }}
      >
        <RevolvingValues />

        {/* ── NON-DISRUPTIVE GIMMICK TOAST ── */}
        <AnimatePresence>
          {showGimmick && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex items-center gap-3 rounded-full px-5 py-3 shadow-lg"
              style={{
                background: 'rgba(20, 20, 30, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(21, 191, 214, 0.3)',
                boxShadow: '0 8px 32px rgba(21,191,214,0.2)',
              }}
            >
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <p className="text-gray-100 text-sm font-medium m-0 whitespace-nowrap">
                {gimmickMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* ── LOADING ── */}
          {pageState === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}

          {/* ── EXPIRED ── */}
          {pageState === 'expired' && (
            <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExpiredState />
            </motion.div>
          )}

          {/* ── INVALID ── */}
          {pageState === 'invalid' && (
            <motion.div key="invalid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <InvalidState />
            </motion.div>
          )}

          {/* ── SUBMITTED / THANK YOU ── */}
          {pageState === 'submitted' && (
            <motion.div key="submitted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {feedbackNumber ? (
                <ThankYouState
                  feedbackNumber={feedbackNumber}
                  accountName={displayAccountName}
                  logoUrl={resolvedLogoUrl}
                />
              ) : (
                <AlreadySubmittedState feedbackNumber={alreadySubmittedNumber} />
              )}
            </motion.div>
          )}

          {/* ── FORM ── */}
          {pageState === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen py-10 px-4 flex flex-col items-center"
            >
              {/* ── Header ─────────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl mb-8 relative z-10"
              >
                <div
                  className="rounded-2xl px-6 py-5"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-5 flex-wrap">
                    {/* Cloudastick logo */}
                    <img
                      src="/Assets/Company Logos/white-logo-dark.webp"
                      alt="Cloudastick"
                      className="h-10 w-auto object-contain"
                    />

                    {/* Divider + customer logo */}
                    {displayAccountName && (
                      <>
                        <div className="h-8 w-px bg-white/15" />
                        <div className="flex items-center gap-3">
                          {resolvedLogoUrl ? (
                            <img
                              src={resolvedLogoUrl}
                              alt={displayAccountName}
                              className="h-10 w-auto max-w-[120px] object-contain bg-white/10 rounded-lg p-1"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          ) : (
                            <InitialsAvatar name={displayAccountName} />
                          )}
                          <span className="text-base font-semibold text-white">{displayAccountName}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Context chips */}
                  {(displayProjectName || displayConsultantName || displaySessionType || displaySessionDate) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {displayProjectName && (
                        <Chip icon={<Briefcase className="w-3.5 h-3.5" />} label={displayProjectName} />
                      )}
                      {displayConsultantName && (
                        <Chip icon={<User className="w-3.5 h-3.5" />} label={displayConsultantName} />
                      )}
                      {displaySessionType && (
                        <Chip icon={<ChevronRight className="w-3.5 h-3.5" />} label={displaySessionType} />
                      )}
                      {displaySessionDate && (
                        <Chip
                          icon={<Calendar className="w-3.5 h-3.5" />}
                          label={new Date(displaySessionDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ── Form Card ──────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-2xl relative z-10"
              >
                <form onSubmit={handleSubmit} noValidate>
                  <div
                    className="rounded-2xl p-6 sm:p-8 space-y-8"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {/* Intro */}
                    <div className="mb-6">
                      <h1 className="text-2xl font-bold text-white mb-1">Share Your Feedback</h1>
                      <p className="text-gray-400 text-sm">
                        This should take less than 2 minutes.
                      </p>
                    </div>

                    {/* ── Required respondent fields ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <User className="w-4 h-4 text-cyan-400" />
                          Your Name
                        </label>
                        <input
                          id="respondent-name"
                          type="text"
                          data-error={nameError ? 'true' : undefined}
                          value={respondentName}
                          onChange={(e) => {
                            setRespondentName(e.target.value);
                            if (e.target.value.trim()) setNameError(false);
                          }}
                          placeholder="e.g. Ahmed Al-Farsi"
                          className={`w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 transition-all ${nameError ? 'ring-2 ring-red-500/50' : ''}`}
                          style={{
                            background: nameError ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.06)',
                            border: nameError ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            '--tw-ring-color': nameError ? 'hsl(0 84% 60% / 0.5)' : 'hsl(188 100% 42% / 0.5)',
                          } as React.CSSProperties}
                        />
                        {nameError && <p className="text-xs text-red-400">Please enter your name.</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          Your Email
                        </label>
                        <input
                          id="respondent-email"
                          type="email"
                          data-error={emailError ? 'true' : undefined}
                          value={respondentEmail}
                          onChange={(e) => {
                            setRespondentEmail(e.target.value);
                            if (e.target.value.trim()) setEmailError(false);
                          }}
                          placeholder="you@company.com"
                          className={`w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 transition-all ${emailError ? 'ring-2 ring-red-500/50' : ''}`}
                          style={{
                            background: emailError ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.06)',
                            border: emailError ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.1)',
                            '--tw-ring-color': emailError ? 'hsl(0 84% 60% / 0.5)' : 'hsl(188 100% 42% / 0.5)',
                          } as React.CSSProperties}
                        />
                        {emailError && <p className="text-xs text-red-400">Please enter your email.</p>}
                      </div>
                    </div>

                    <AnimatePresence>
                      {(respondentName.trim() !== '' && respondentEmail.trim() !== '') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-xl mt-2 mb-2" style={{ background: 'rgba(21, 191, 214, 0.1)', border: '1px solid rgba(21, 191, 214, 0.2)' }}>
                            <p className="text-cyan-50 text-sm leading-relaxed font-medium">
                              Hello {respondentName.trim().split(/\s+/)[0]}, we need you to be completely honest with us, it is the only way we can continuously improve. We care about your customer experience deeply, and your insights are invaluable to us!
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Divider ── */}
                    <div className="h-px bg-white/5" />

                    {/* ── Star rating questions ── */}
                    <div className="space-y-6">
                      <p className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        Rate Your Experience
                      </p>

                      {RATING_FIELDS.map((field, idx) => {
                        const hasError = !!ratingErrors[field.key];
                        return (
                          <motion.div
                            key={field.key}
                            data-rating-error={hasError ? 'true' : undefined}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + idx * 0.07 }}
                            className={`rounded-xl p-4 transition-all duration-300 ${
                              hasError
                                ? 'bg-red-500/5 border border-red-500/30'
                                : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                  style={{
                                    background: hasError
                                      ? 'hsl(0 84% 60% / 0.15)'
                                      : 'hsl(188 100% 42% / 0.12)',
                                    color: hasError ? 'hsl(0 84% 70%)' : 'hsl(188 100% 52%)',
                                  }}
                                >
                                  {field.icon}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-white leading-snug">
                                    {field.label}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                                    {field.description}
                                  </p>
                                  {hasError && (
                                    <p className="text-xs text-red-400 mt-1 font-medium">
                                      Please select a rating
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="mt-1">
                                <StarRating
                                  value={ratings[field.key]}
                                  hasError={hasError}
                                  onChange={(v) => {
                                    if (!respondentName.trim()) {
                                      setNameError(true);
                                      document.querySelector('#respondent-name')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      document.getElementById('respondent-name')?.focus();
                                      return;
                                    }
                                    setRatings((prev) => ({ ...prev, [field.key]: v }));
                                    setRatingErrors((prev) => ({ ...prev, [field.key]: false }));
                                    triggerGimmick(v);
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* ── Divider ── */}
                    <div className="h-px bg-white/5" />

                    {/* ── Free-text comment ── */}
                    <div className="space-y-2">
                      <label
                        htmlFor="customer-feedback"
                        className="text-sm font-medium text-gray-300 flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        Additional Comments{' '}
                        <span className="text-gray-600 font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="customer-feedback"
                        value={customerFeedback}
                        onChange={(e) => setCustomerFeedback(e.target.value)}
                        rows={4}
                        maxLength={32000}
                        placeholder="Any specific thoughts, suggestions, or highlights from the session…"
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:ring-2 resize-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          '--tw-ring-color': 'hsl(188 100% 42% / 0.5)',
                        } as React.CSSProperties}
                      />
                      <p className="text-xs text-gray-600 text-right">
                        {customerFeedback.length.toLocaleString()} / 32,000
                      </p>
                    </div>

                    {/* ── Submit error ── */}
                    <AnimatePresence>
                      {submitError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm text-red-300"
                            style={{
                              background: 'hsl(0 84% 60% / 0.1)',
                              border: '1px solid hsl(0 84% 60% / 0.3)',
                            }}
                          >
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            {submitError}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Submit button ── */}
                    <button
                      id="submit-survey-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                      style={{
                        background: isSubmitting
                          ? 'hsl(210 100% 50% / 0.5)'
                          : 'linear-gradient(135deg, hsl(210 100% 50%) 0%, hsl(188 100% 42%) 100%)',
                        boxShadow: isSubmitting ? 'none' : '0 4px 20px hsl(210 100% 50% / 0.35)',
                        '--tw-ring-color': 'hsl(210 100% 50% / 0.5)',
                      } as React.CSSProperties}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-600 text-center">
                      Your feedback is confidential and goes directly to Cloudastick.
                    </p>
                  </div>
                </form>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-gray-700 mt-8 relative z-10"
              >
                © {new Date().getFullYear()} Cloudastick · cloudastick.org
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Small chip component for session metadata
const Chip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-gray-300"
    style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}
  >
    <span className="text-cyan-400">{icon}</span>
    {label}
  </span>
);

export default CustomerSurvey;
