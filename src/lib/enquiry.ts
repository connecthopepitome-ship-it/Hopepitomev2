/**
 * HOPEPITOME V2 — ENQUIRY VALIDATION & STORAGE CORE
 * Validates project brief submissions, enforces anti-spam constraints,
 * and standardizes persistent record creation.
 * Optimized for everyday business owners with sensible defaults.
 */

export interface EnquiryInput {
  fullName: string;
  email: string;
  phoneWhatsapp?: string;
  businessName?: string;
  division?: 'NEXORA' | 'ELEVORA' | 'BOTH';
  serviceTitle?: string;
  requirements?: string;
  budgetRange?: string;
  desiredTimeline?: string;
  attachmentUrl?: string;
  consent?: boolean;
  botHoneypot?: string; // Must remain empty
}

export interface SanitizedEnquiry {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phoneWhatsapp: string | null;
  businessName?: string | null;
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
    return { valid: false, errors: { form: 'Automated submission rejected by security policy.' } };
  }

  // 2. Full Name
  const fullName = (data.fullName || '').trim();
  if (fullName.length < 2) {
    errors.fullName = 'Please enter your name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters.';
  }

  // 3. Email
  const email = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  // 4. Phone / WhatsApp
  const phoneWhatsapp = (data.phoneWhatsapp || '').trim();
  if (phoneWhatsapp.length > 0 && phoneWhatsapp.length < 6) {
    errors.phoneWhatsapp = 'Phone or WhatsApp number must be at least 6 digits.';
  }

  // 5. Division (defaults to NEXORA business systems)
  const division = data.division || 'NEXORA';

  // 6. Service Selection
  const serviceTitle = (data.serviceTitle || '').trim() || 'Custom Business Solution';

  // 7. Requirements (Default gracefully if minimal)
  let requirements = (data.requirements || '').trim();
  if (!requirements) {
    requirements = `Project enquiry for: ${serviceTitle}${data.businessName ? ` (${data.businessName})` : ''}.`;
  } else if (requirements.length > 5000) {
    requirements = requirements.substring(0, 5000);
  }

  // 8. Budget Range (Default if not specified)
  const budgetRange = (data.budgetRange || '').trim() || 'Flexible / Discussion';

  // 9. Desired Timeline (Default if not specified)
  const desiredTimeline = (data.desiredTimeline || '').trim() || 'Standard';

  // 10. Attachment URL (Optional)
  const attachmentUrl = (data.attachmentUrl || '').trim();
  if (attachmentUrl) {
    try {
      new URL(attachmentUrl);
    } catch {
      errors.attachmentUrl = 'Attachment must be a valid web URL.';
    }
  }

  // 11. Privacy Consent (Default to true if omitted in rapid intake)
  const consentGiven = data.consent !== undefined ? Boolean(data.consent) : true;

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const sanitized: SanitizedEnquiry = {
    id: generateUUID(),
    referenceCode: generateReferenceCode(),
    fullName,
    email,
    phoneWhatsapp: phoneWhatsapp || null,
    businessName: data.businessName ? data.businessName.trim() : null,
    division: division as 'NEXORA' | 'ELEVORA' | 'BOTH',
    serviceTitle,
    requirements,
    budgetRange,
    desiredTimeline,
    attachmentUrl: attachmentUrl || null,
    consentGiven,
    createdAt: new Date().toISOString(),
    status: 'NEW',
  };

  return { valid: true, errors: {}, sanitized };
}
