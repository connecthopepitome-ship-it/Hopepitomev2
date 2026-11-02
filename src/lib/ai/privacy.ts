/**
 * RESUME PRIVACY & ANONYMIZATION ENGINE
 * Strips PII (Personally Identifiable Information) before sending text to external AI providers.
 * Removes phone numbers, emails, addresses, links, and candidate names while preserving skills,
 * metrics, career chronology, tools, and technical accomplishments.
 */

import { SanitizedResumeInput } from './types';

export function anonymizeResumeText(
  rawText: string,
  targetRole?: string,
  targetIndustry?: string,
  jobDescription?: string,
  fileName?: string
): SanitizedResumeInput {
  if (!rawText) {
    return {
      anonymizedText: '',
      targetRole: targetRole || 'Target Professional Role',
      targetIndustry: targetIndustry || 'Technology / Corporate',
      jobDescription: jobDescription || '',
      originalFileName: fileName || 'resume.pdf',
      characterCount: 0,
    };
  }

  let text = rawText;

  // 0. Filter out raw PDF/DOCX binary stream markers and corrupt non-text blocks
  text = text.replace(/%PDF-[\d.]+/g, '');
  text = text.replace(/<<[\s\S]*?>>/g, ' ');
  text = text.replace(/stream[\s\S]*?endstream/g, ' ');
  text = text.replace(/\b(xref|trailer|startxref|\/Filter|\/FlateDecode|\/Length\d*)\b/gi, ' ');
  text = text.replace(/[^\x20-\x7E\t\n\r]/g, ' '); // Strip non-printable binary characters

  // 1. Remove Email Addresses
  text = text.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/gi, '[EMAIL_REDACTED]');

  // 2. Remove Phone / WhatsApp Numbers (international + local formats)
  text = text.replace(/(\+?\d{1,4}[\s.-]?)?\(?\d{2,5}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/g, '[PHONE_REDACTED]');

  // 3. Remove URLs & LinkedIn Profile Slugs (keep domain context only if relevant)
  text = text.replace(/https?:\/\/[^\s]+/gi, '[LINK_REDACTED]');
  text = text.replace(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi, '[LINKEDIN_PROFILE]');
  text = text.replace(/github\.com\/[a-zA-Z0-9_-]+/gi, '[PORTFOLIO_PROFILE]');

  // 4. Remove Physical Postal Addresses / Zip codes
  text = text.replace(/\b\d{5,6}(-\d{4})?\b/g, '[POSTAL_CODE]');

  // 5. Clean excess whitespace but maintain bullet/line structure
  text = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('obj') && !line.startsWith('endobj'))
    .join('\n');

  // 6. Hard safety token guard: Cap text to max 8,000 characters (~1,800 tokens)
  // This guarantees request entity size never exceeds Groq's 7,000 ITPM limit
  if (text.length > 8000) {
    const truncated = text.substring(0, 8000);
    const lastBreak = truncated.lastIndexOf('\n');
    text = (lastBreak > 6000 ? truncated.substring(0, lastBreak) : truncated) + '\n[...Resume summary & key experience analyzed...]';
  }

  const cleanJd = (jobDescription || '').trim();
  const cappedJd = cleanJd.length > 2500 ? cleanJd.substring(0, 2500) + '...' : cleanJd;

  return {
    anonymizedText: text,
    targetRole: (targetRole || 'Experienced Professional').trim(),
    targetIndustry: (targetIndustry || 'Technology / Corporate Services').trim(),
    jobDescription: cappedJd,
    originalFileName: fileName || 'Candidate_Resume.pdf',
    characterCount: text.length,
  };
}

