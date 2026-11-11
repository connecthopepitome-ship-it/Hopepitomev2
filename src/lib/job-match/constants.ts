/**
 * AI JOB MATCH MODULE — CONSTANTS & DOMAIN RULES
 * Pure additive constants with zero coupling to unrelated modules.
 */

export const JOB_MATCH_MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export const JOB_MATCH_ALLOWED_EXTENSIONS = ['pdf', 'docx', 'jpg', 'jpeg', 'png'] as const;

export const JOB_MATCH_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
] as const;

export const JOB_MATCH_CONSENT_TEXT =
  'I agree my resume may be processed by Hopepitome staff using AI tools to find matching jobs. My data is not sold, and I can request deletion anytime.';

export const JOB_MATCH_LOCATIONS = [
  // India Cities
  'Bengaluru, India',
  'Mumbai, India',
  'Delhi NCR, India',
  'Hyderabad, India',
  'Chennai, India',
  'Pune, India',
  'Kochi, India',
  'Ahmedabad, India',
  'Kolkata, India',
  // UAE Cities
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Sharjah, UAE',
  'Ajman, UAE',
  // Flexible
  'Remote',
] as const;

export const JOB_MATCH_JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
  'Hybrid',
] as const;

export const JOB_MATCH_INTAKE_STATUSES = [
  'Resume received',
  'Matching in progress',
  'Jobs ready',
] as const;

export const JOB_MATCH_DISCLAIMER =
  'Jobs are sourced from public listings. Please verify details on the employer\'s site before applying.';

export const JOB_MATCH_EMPTY_STATE_MESSAGE =
  'We\'re finding jobs for you — usually within 24 hours.';

export const JOB_MATCH_SCORE_BANDS = {
  HIGH_MIN: 75,
  MEDIUM_MIN: 50,
} as const;

export function getMatchScoreBand(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= JOB_MATCH_SCORE_BANDS.HIGH_MIN) return 'High';
  if (score >= JOB_MATCH_SCORE_BANDS.MEDIUM_MIN) return 'Medium';
  return 'Low';
}

export function isValidJobMatchUrl(rawUrl: string): boolean {
  try {
    const trimmed = String(rawUrl || '').trim();
    if (!/^https?:\/\//i.test(trimmed)) return false;
    const parsed = new URL(trimmed);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Map a recommended service string from GAS to existing Career Services URLs
 * with optional preselection query parameter.
 */
export function resolveFixMyResumeHref(recommendedService?: string): string {
  const normalized = String(recommendedService || '').toLowerCase();
  if (normalized.includes('linkedin')) {
    return '/career-services/services?service=LINKEDIN_MAKEOVER';
  }
  if (normalized.includes('portfolio')) {
    return '/career-services/services?service=PORTFOLIO_WEBSITE';
  }
  if (normalized.includes('managed') || normalized.includes('job search')) {
    return '/career-services/services?service=JOB_SEARCH_SUPPORT';
  }
  if (normalized.includes('writing') || normalized.includes('rewrite')) {
    return '/career-services/portal/orders/new?service=RESUME_WRITING';
  }
  return '/career-services/services?service=ATS_OPTIMISATION';
}

