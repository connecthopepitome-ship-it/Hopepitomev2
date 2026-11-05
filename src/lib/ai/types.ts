/**
 * HOPEPITOME ATS & OPENAI GPT-6 LUNA CONTRACTS
 * Pure typescript types for single-provider OpenAI GPT-6 Luna engine,
 * deterministic scoring, structured assessment outputs, and usage analytics.
 */

export * from './career-types';
import type { CareerIntelligenceResult, PublicCareerIntelligence } from './career-types';

export type AiProviderName = 'openai';

export type ProviderHealthStatus = 'CONNECTED' | 'NOT_CONFIGURED' | 'ERROR';

export interface OpenAiModelDefinition {
  id: 'gpt-6-luna';
  name: string;
  provider: 'openai';
  apiEndpoint: string;
  contextWindowTokens: number;
  maxOutputTokens: number;
  inputPricingPer1M: number;
  outputPricingPer1M: number;
}

export interface ProviderHealthState {
  providerId: 'openai';
  modelId: 'gpt-6-luna';
  configured: boolean;
  currentStatus: ProviderHealthStatus;
  lastSuccessfulRequest?: string;
  lastFailure?: string;
  lastErrorCode?: number;
  lastErrorMessage?: string;
  totalSuccessCount: number;
  totalFailureCount: number;
  lastHealthCheck: string;
  adminNotes?: string;
}

export interface OpenAiUsageStats {
  totalAssessments: number;
  successfulAssessments: number;
  failedAssessments: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  averageLatencyMs: number;
  lastSuccessfulRequest?: string;
  lastError?: string;
  monthlyBudgetLimitUsd: number;
  budgetWarningTriggered: boolean;
}

export interface DocumentValidationState {
  documentReadable: boolean;
  unreadableReason?: string | null;
  detectedFormat?: 'pdf' | 'docx' | 'text' | 'unknown';
  isContradictory?: boolean;
  validationNotes?: string;
}

export interface CandidateStructuredProfile {
  name: string | null;
  headline: string | null;
  actualProfession: string;
  currentDesignation?: string | null;
  actualProfessionalDomain?: string | null;
  professionalSummary: string | null;
  totalYearsExperience: number;
  currentLocation: string | null;
  previousEmploymentLocations: string[];
  explicitTargetCountries: string[];
  employmentHistory: Array<{
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    location: string;
    responsibilities: string[];
    achievements: string[];
  }>;
  skills: string[];
  toolsAndSoftware: string[];
  education: Array<{
    degree: string;
    institution?: string;
    year?: string;
  }>;
  certifications: string[];
  languages: string[];
}

export interface SanitizedResumeInput {
  uploadId?: string;
  anonymizedText: string;
  targetRole?: string;
  targetIndustry?: string;
  jobDescription?: string;
  originalFileName?: string;
  fileMimeType?: string;
  fileBase64?: string;
  fileSize?: number;
  characterCount: number;
}

export type AtsCategoryKey =
  | 'STRUCTURE_READABILITY'
  | 'PROFESSIONAL_SUMMARY'
  | 'SKILLS_RELEVANCE'
  | 'EXPERIENCE_ACHIEVEMENTS'
  | 'EDUCATION_CERTIFICATIONS'
  | 'FORMATTING_COMPATIBILITY'
  | 'CONTACT_COMPLETENESS';

export type CareerStage =
  | 'STUDENT_GRADUATE'
  | 'ENTRY_LEVEL'
  | 'EARLY_CAREER'
  | 'MID_CAREER'
  | 'EXPERIENCED'
  | 'SENIOR'
  | 'LEADERSHIP_MANAGEMENT'
  | 'EXECUTIVE'
  | 'CAREER_CHANGER';

export interface AtsCategoryEvaluation {
  category: AtsCategoryKey;
  title: string;
  weight: number; // e.g. 15, 10, 20, 20, 10, 15, 10 (Total = 100)
  rawScore: number; // 0 - 100 from model or deterministic rubric
  weightedScore: number; // (rawScore * weight) / 100
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL';
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale?: string;
  evidencePoints: string[];
  missingElements: string[];
  recommendations: string[];
}

export interface AtsAssessmentResult {
  assessmentId: string;
  uploadId?: string;
  timestamp: string;
  targetRole: string;
  targetIndustry?: string;
  inferredDomain?: string;
  careerStage?: string;
  inferredRole?: string;
  overallScore: number; // 0 - 100 deterministic weighted score
  generalQualityScore: number; // Dimension A: General Quality independent of specific job
  atsCompatibilityScore: number; // Dimension B: ATS Parsing & Readability Compatibility
  recruiterVisibilityScore?: number;
  recruiterVisibilityLabel?: 'Strong' | 'Good potential' | 'Needs improvement' | 'Requires significant improvement';
  jobMatchScore?: number | null; // Dimension C: Job Match Score (only if job description supplied)
  jobMatchDetails?: {
    requiredSkillsFound: string[];
    transferableSkillsFound: string[];
    requiredSkillsNotEvidenced: string[];
    preferredSkillsFound: string[];
    experienceAlignmentSummary: string;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  topStrengths: string[];
  criticalGaps: string[];
  categories: AtsCategoryEvaluation[];
  matchedKeywords: string[];
  missingKeywords: string[];
  detectedWordCount: number;
  candidateProfile?: CandidateStructuredProfile;
  documentValidation?: DocumentValidationState;
  careerIntelligence?: CareerIntelligenceResult;
  providerAudit: {
    selectedProvider: 'openai';
    modelUsed: 'gpt-6-luna';
    attemptsCount: number;
    failoverTrail: {
      provider: 'openai';
      model: string;
      success: boolean;
      durationMs: number;
      errorCode?: number;
      errorReason?: string;
    }[];
    totalDurationMs: number;
    tokensUsed: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      reasoningTokens?: number;
    };
    estimatedCostUsd: number;
    deterministicValidated: boolean;
  };
}

export interface PublicAtsCategoryItem {
  category: AtsCategoryKey;
  title: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL';
}

export interface LockedImprovementCard {
  id: string;
  category: AtsCategoryKey;
  title: string;
  teaserSubtitle: string;
  teaserBullets: string[];
  recommendedServiceCode: string;
  recommendedServiceName: string;
  pricingLabel: string; // "Quote Based on Requirements"
  ctaText: string; // "Request a Custom Quote"
  reason: string;
  servicePriceInr?: number;
}

export interface RecommendedServiceItem {
  code: string;
  name: string;
  pricingLabel: string; // "Custom Pricing"
  tagline: string;
  quoteMessage: string;
  ctaText: string;
  addressedAreas: string[];
  isPrimary: boolean;
  priceInr?: number;
}

export interface PublicAtsAuditResult {
  assessmentId: string;
  uploadId?: string;
  timestamp: string;
  targetRole: string;
  targetIndustry?: string;
  inferredDomain?: string;
  careerStage?: string;
  inferredRole?: string;
  overallScore: number;
  generalQualityScore: number;
  atsCompatibilityScore: number;
  recruiterVisibilityScore?: number;
  recruiterVisibilityLabel?: 'Strong' | 'Good potential' | 'Needs improvement' | 'Requires significant improvement';
  jobMatchScore?: number | null;
  jobMatchDetails?: {
    requiredSkillsFound: string[];
    transferableSkillsFound: string[];
    requiredSkillsNotEvidenced: string[];
    preferredSkillsFound: string[];
    experienceAlignmentSummary: string;
  };
  jobMatchKeywordSummary?: {
    matchedCount: number;
    sampleKeywords: string[];
    transferableCount?: number;
  };
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  interpretation: 'Excellent profile presentation' | 'Good potential' | 'Needs improvement' | 'Significant improvements recommended' | 'Excellent' | 'Good' | 'Fair / Needs Attention';
  summary: string;
  hasJobDescription: boolean;
  categories: PublicAtsCategoryItem[];
  strengthTitles: string[];
  improvementAreas: LockedImprovementCard[];
  recommendedServices: RecommendedServiceItem[];
  candidateProfile?: Partial<CandidateStructuredProfile>;
  documentValidation?: DocumentValidationState;
  careerIntelligence?: PublicCareerIntelligence;
  isLocked: boolean;
}

export type AtsFailureClassification =
  | 'FILE_VALIDATION_FAILED'
  | 'DOCUMENT_UPLOAD_FAILED'
  | 'OPENAI_AUTHENTICATION_FAILED'
  | 'OPENAI_QUOTA_OR_BILLING_ERROR'
  | 'OPENAI_RATE_LIMITED'
  | 'OPENAI_DOCUMENT_PROCESSING_FAILED'
  | 'OPENAI_RESPONSE_FAILED'
  | 'AI_OUTPUT_VALIDATION_FAILED'
  | 'FIRESTORE_SAVE_FAILED'
  | 'INTERNAL_SERVER_ERROR';

export type AtsErrorClassification =
  | AtsFailureClassification
  | 'UNREADABLE_DOCUMENT'
  | 'RATE_LIMITED'
  | 'FILE_TOO_LARGE'
  | 'TIMEOUT'
  | 'SERVICE_UNAVAILABLE'
  | 'INVALID_INPUT'
  | 'INTERNAL_ERROR';

export type ProcessingStage =
  | 'A_FILE_SELECTION'
  | 'B_FRONTEND_UPLOAD'
  | 'C_WORKER_REQUEST'
  | 'D_FILE_VALIDATION'
  | 'E_PDF_OPENAI_SUBMISSION'
  | 'F_OPENAI_FILE_PROCESSING'
  | 'G_RESPONSES_API_REQUEST'
  | 'H_GPT6_LUNA_RESPONSE'
  | 'I_JSON_PARSING'
  | 'J_PROFILE_VALIDATION'
  | 'K_FIRESTORE_STORAGE'
  | 'L_FRONTEND_RENDERING';

export interface AtsServerDiagnostic {
  assessmentId: string;
  uploadId?: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  model: string;
  processingStage: ProcessingStage | string;
  durationMs: number;
  statusCode: number;
  errorType: AtsErrorClassification;
  openaiRequestId?: string;
  errorReason?: string;
  retryable: boolean;
}
