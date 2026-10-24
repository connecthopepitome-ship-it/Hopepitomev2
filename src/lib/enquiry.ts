/**
 * HOPEPITOME V2 — ENQUIRY VALIDATION & STORAGE CORE
 * Validates project brief submissions, enforces anti-spam constraints,
 * and standardizes persistent record creation.
 */

export interface EnquiryInput {
  fullName: string;
  email: string;
  phoneWhatsapp?: string;
  division: 'NEXORA' | 'ELEVORA' | 'BOTH';
  serviceTitle: string;
  requirements: string;
  budgetRange: string;
  desiredTimeline: string;
  attachmentUrl?: string;
  consent: boolean;
  botHoneypot?: string; // Must remain empty
}

export interface SanitizedEnquiry {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phoneWhatsapp: string | null;
  division: 'NEXORA' | 'ELEVORA' | 'BOTH';
  serviceTitle: string;
  requirements: string;
  budgetRange: string;
  desiredTimeline: string;
  attachmentUrl: string | null;
  consentGiven: boolean;
  createdAt: string;
  status: 'NEW';
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized?: SanitizedEnquiry;
}

export function generateReferenceCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HP-${year}${month}-${randomChars}`;
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function validateEnquiry(input: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: { form: 'Invalid request payload format.' } };
  }

  const data = input as Partial<EnquiryInput>;

  // 1. Anti-spam honeypot detection
  if (data.botHoneypot && data.botHoneypot.trim().length > 0) {
    // Silently mark as invalid or bot rejection
    return { valid: false, errors: { form: 'Automated submission rejected by security policy.' } };
  }

  // 2. Full Name
  const fullName = (data.fullName || '').trim();
  if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters.';
  }

  // 3. Email
  const email = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'A valid corporate or personal email address is required.';
  }

  // 4. Phone / WhatsApp (Optional)
  const phoneWhatsapp = (data.phoneWhatsapp || '').trim();
  if (phoneWhatsapp.length > 0 && phoneWhatsapp.length < 7) {
    errors.phoneWhatsapp = 'Phone or WhatsApp number must be at least 7 digits.';
  }

  // 5. Division
  const division = data.division;
  if (!division || !['NEXORA', 'ELEVORA', 'BOTH'].includes(division)) {
    errors.division = 'Select a valid division (Nexora, Elevora, or Combined).';
  }

  // 6. Service Selection
  const serviceTitle = (data.serviceTitle || '').trim();
  if (!serviceTitle || serviceTitle.length < 3) {
    errors.serviceTitle = 'Please specify the primary service or engagement scope.';
  }

  // 7. Project / Career Requirements
  const requirements = (data.requirements || '').trim();
  if (requirements.length < 15) {
    errors.requirements = 'Please describe your requirements in at least 15 characters.';
  } else if (requirements.length > 5000) {
    errors.requirements = 'Requirements description cannot exceed 5000 characters.';
  }

  // 8. Budget Range
  const budgetRange = (data.budgetRange || '').trim();
  if (!budgetRange) {
    errors.budgetRange = 'Please indicate an anticipated budget tier or scoping preference.';
  }

  // 9. Desired Timeline
  const desiredTimeline = (data.desiredTimeline || '').trim();
  if (!desiredTimeline) {
    errors.desiredTimeline = 'Please select a desired project timeline.';
  }

  // 10. Attachment URL (Optional)
  const attachmentUrl = (data.attachmentUrl || '').trim();
  if (attachmentUrl) {
    try {
      new URL(attachmentUrl);
    } catch {
      errors.attachmentUrl = 'Attachment must be a valid web URL (e.g. Google Drive, Figma, or Dropbox link).';
    }
  }

  // 11. Privacy Consent
  if (!data.consent) {
    errors.consent = 'You must acknowledge the privacy notice to submit an enquiry.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const sanitized: SanitizedEnquiry = {
    id: generateUUID(),
    referenceCode: generateReferenceCode(),
    fullName,
    email,
    phoneWhatsapp: phoneWhatsapp || null,
    division: division as 'NEXORA' | 'ELEVORA' | 'BOTH',
    serviceTitle,
    requirements,
    budgetRange,
    desiredTimeline,
    attachmentUrl: attachmentUrl || null,
    consentGiven: Boolean(data.consent),
    createdAt: new Date().toISOString(),
    status: 'NEW',
  };

  return { valid: true, errors: {}, sanitized };
}
