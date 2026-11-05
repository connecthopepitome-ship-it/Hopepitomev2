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

export interface SanitizedResumeInput {
  anonymizedText: string;
  targetRole?: string;
  targetIndustry?: string;
  jobDescription?: string;
  originalFileName?: string;
  fileMimeType?: string;
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
  careerIntelligence?: PublicCareerIntelligence;
  isLocked: boolean;
}
