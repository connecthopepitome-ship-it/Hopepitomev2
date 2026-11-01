/**
 * HOPEPITOME — CAREER SERVICES ENQUIRY TYPES & VALIDATION
 * Handles input verification, anti-spam protections, reference code generation,
 * and data sanitization for career service leads.
 * Optimized for mobile-first, friction-free intake where all career profile details are optional.
 */

export interface CareerEnquiryInput {
  fullName: string;
  email: string;
  phoneWhatsapp?: string;
  selectedServices?: string[];
  serviceRequired?: string;
  careerStage?: string;
  targetRole?: string;
  targetCountry?: string;
  currentDesignation?: string;
  totalExperience?: string;
  linkedinUrl?: string;
  requirements?: string;
  preferredContactMethod?: 'Email' | 'WhatsApp' | 'Phone Call';
  resumeFileName?: string;
  resumeFileSize?: number;
  resumeMimeType?: string;
  resumeFileBase64?: string;
  consent?: boolean;
  botHoneypot?: string;
}

export interface SanitizedCareerEnquiry {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phoneWhatsapp: string | null;
  selectedServices: string[];
  serviceRequired: string;
  careerStage: string;
  targetRole: string | null;
  targetCountry: string | null;
  currentDesignation: string | null;
  totalExperience: string | null;
  linkedinUrl: string | null;
  requirements: string;
  preferredContactMethod: 'Email' | 'WhatsApp' | 'Phone Call';
  resumeFileName: string | null;
  resumeFileSize: number | null;
  resumeMimeType: string | null;
  resumeFileBase64?: string | null;
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

  // 2. Full Name (Required, at least 2 characters)
  const fullName = (data.fullName || '').trim();
  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters.';
  }

  // 3. Email (Required, valid format)
  const email = (data.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'A valid email address is required so we can follow up with your consultation.';
  }

  // 4. Phone / WhatsApp (Required, at least 6 characters)
  const phoneWhatsapp = (data.phoneWhatsapp || '').trim();
  if (phoneWhatsapp.length < 6) {
    errors.phoneWhatsapp = 'A valid contact / WhatsApp number is required (at least 6 digits).';
  }

  // 5. Selected Services (At least 1 service required)
  let selectedServices: string[] = [];
  if (Array.isArray(data.selectedServices) && data.selectedServices.length > 0) {
    selectedServices = data.selectedServices.map((s) => String(s).trim()).filter(Boolean);
  } else if (data.serviceRequired && data.serviceRequired.trim()) {
    selectedServices = [data.serviceRequired.trim()];
  }

  if (selectedServices.length === 0) {
    selectedServices = ['Professional Resume Writing'];
  }

  const primaryService = selectedServices[0] || 'Professional Resume Writing';

  // 6. Career Stage (Optional, default to Experienced Professional)
  const careerStage = (data.careerStage || '').trim() || 'Experienced Professional';

  // 7. Requirements description (Optional, auto-generated summary if omitted)
  let requirements = (data.requirements || '').trim();
  if (!requirements) {
    requirements = `Consultation requested for: ${selectedServices.join(', ')}.`;
  } else if (requirements.length > 5000) {
    requirements = requirements.substring(0, 5000);
  }

  // 8. Consent (Default to true if omitted in rapid-intake)
  const consentGiven = data.consent !== undefined ? Boolean(data.consent) : true;

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const sanitized: SanitizedCareerEnquiry = {
    id: generateUUID(),
    referenceCode: generateCareerReferenceCode(),
    fullName,
    email,
    phoneWhatsapp: phoneWhatsapp.length > 0 ? phoneWhatsapp : null,
    selectedServices,
    serviceRequired: primaryService,
    careerStage,
    targetRole: data.targetRole ? data.targetRole.trim().substring(0, 150) : null,
    targetCountry: data.targetCountry ? data.targetCountry.trim().substring(0, 100) : null,
    currentDesignation: data.currentDesignation ? data.currentDesignation.trim().substring(0, 150) : null,
    totalExperience: data.totalExperience ? data.totalExperience.trim().substring(0, 50) : null,
    linkedinUrl: data.linkedinUrl ? data.linkedinUrl.trim().substring(0, 250) : null,
    requirements,
    preferredContactMethod: data.preferredContactMethod || 'WhatsApp',
    resumeFileName: data.resumeFileName ? data.resumeFileName.trim().substring(0, 200) : null,
    resumeFileSize: typeof data.resumeFileSize === 'number' ? data.resumeFileSize : null,
    resumeMimeType: data.resumeMimeType ? data.resumeMimeType.trim() : null,
    resumeFileBase64: data.resumeFileBase64 || null,
    consentGiven,
    createdAt: new Date().toISOString(),
    division: 'CAREER_SERVICES',
    status: 'NEW',
  };

  return { valid: true, errors: {}, sanitized };
}
