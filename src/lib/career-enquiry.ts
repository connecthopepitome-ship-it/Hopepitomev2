/**
 * HOPEPITOME — CAREER SERVICES ENQUIRY TYPES & VALIDATION
 * Handles input verification, anti-spam protections, reference code generation,
 * and data sanitization for career service leads.
 */

export interface CareerEnquiryInput {
  fullName: string;
  email: string;
  phoneWhatsapp?: string;
  careerStage: string;
  serviceRequired: string;
  targetRole?: string;
  targetCountry?: string;
  requirements: string;
  preferredContactMethod?: 'Email' | 'WhatsApp' | 'Phone Call';
  resumeFileName?: string;
  resumeFileSize?: number;
  consent: boolean;
  botHoneypot?: string;
}

export interface SanitizedCareerEnquiry {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phoneWhatsapp: string | null;
  careerStage: string;
  serviceRequired: string;
  targetRole: string | null;
  targetCountry: string | null;
  requirements: string;
  preferredContactMethod: 'Email' | 'WhatsApp' | 'Phone Call';
  resumeFileName: string | null;
  resumeFileSize: number | null;
  consentGiven: boolean;
  createdAt: string;
  division: 'CAREER_SERVICES';
  status: 'NEW';
}

export interface CareerValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  sanitized?: SanitizedCareerEnquiry;
}

export function generateCareerReferenceCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HP-CAR-${year}${month}-${randomChars}`;
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

export function validateCareerEnquiry(input: unknown): CareerValidationResult {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return { valid: false, errors: { form: 'Invalid request payload format.' } };
  }

  const data = input as Partial<CareerEnquiryInput>;

  // 1. Anti-spam honeypot
  if (data.botHoneypot && data.botHoneypot.trim().length > 0) {
    return { valid: false, errors: { form: 'Automated submission rejected by security policy.' } };
  }

  // 2. Full Name
  const fullName = (data.fullName || '').trim();
  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters.';
  }

  // 3. Email
  const email = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'A valid email address is required so we can follow up with your consultation.';
  }

  // 4. Phone / WhatsApp
  const phoneWhatsapp = (data.phoneWhatsapp || '').trim();
  if (phoneWhatsapp.length > 0 && phoneWhatsapp.length < 6) {
    errors.phoneWhatsapp = 'Contact number must be at least 6 characters.';
  }

  // 5. Career Stage
  const careerStage = (data.careerStage || '').trim();
  if (!careerStage) {
    errors.careerStage = 'Please select your current career stage.';
  }

  // 6. Service Required
  const serviceRequired = (data.serviceRequired || '').trim();
  if (!serviceRequired) {
    errors.serviceRequired = 'Please select the primary career service you need.';
  }

  // 7. Requirements description
  const requirements = (data.requirements || '').trim();
  if (requirements.length < 10) {
    errors.requirements = 'Please provide a brief description of your goals or requirements (at least 10 characters).';
  } else if (requirements.length > 5000) {
    errors.requirements = 'Description cannot exceed 5000 characters.';
  }

  // 8. Consent
  if (!data.consent) {
    errors.consent = 'Please confirm that you agree to our privacy terms.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const sanitized: SanitizedCareerEnquiry = {
    id: generateUUID(),
    referenceCode: generateCareerReferenceCode(),
    fullName,
    email,
    phoneWhatsapp: phoneWhatsapp.length > 0 ? phoneWhatsapp : null,
    careerStage,
    serviceRequired,
    targetRole: data.targetRole ? data.targetRole.trim().substring(0, 150) : null,
    targetCountry: data.targetCountry ? data.targetCountry.trim().substring(0, 100) : null,
    requirements,
    preferredContactMethod: data.preferredContactMethod || 'Email',
    resumeFileName: data.resumeFileName ? data.resumeFileName.trim().substring(0, 200) : null,
    resumeFileSize: typeof data.resumeFileSize === 'number' ? data.resumeFileSize : null,
    consentGiven: true,
    createdAt: new Date().toISOString(),
    division: 'CAREER_SERVICES',
    status: 'NEW',
  };

  return { valid: true, errors: {}, sanitized };
}

