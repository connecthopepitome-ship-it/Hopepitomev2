/**
 * HOPEPITOME ATS & MULTI-PROVIDER AI CONTRACTS
 * Pure typescript types for free-only AI provider adapters, failover engine,
 * deterministic scoring, and provider health management.
 */

export type AiProviderName = 'gemini' | 'groq' | 'cloudflare' | 'openrouter';

export type ProviderHealthStatus = 'HEALTHY' | 'COOLDOWN' | 'RATE_LIMITED' | 'QUOTA_EXHAUSTED' | 'DISABLED' | 'UNCONFIGURED';

export interface FreeModelDefinition {
  id: string;
  name: string;
  provider: AiProviderName;
  verifiedFree: boolean;
  freeTierTerms: string;
  maxContextTokens: number;
  rateLimitRpm: number;
  rateLimitRpd: number;
  supportsJsonSchema: boolean;
  notes?: string;
}

export interface ProviderHealthState {
  providerId: AiProviderName;
  modelId: string;
  configured: boolean;
  enabled: boolean;
  freeTierVerified: boolean;
  currentStatus: ProviderHealthStatus;
  lastSuccessfulRequest?: string;
  lastFailure?: string;
  lastErrorCode?: number;
  lastErrorMessage?: string;
  cooldownUntil?: number; // epoch ms
  rateLimitResetAt?: number; // epoch ms
  dailyQuotaExhausted: boolean;
  dailyQuotaResetAt?: number; // epoch ms
  consecutiveFailures: number;
  totalSuccessCount: number;
  totalFailureCount: number;
  lastHealthCheck: string;
  adminNotes?: string;
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

export interface AtsCategoryEvaluation {
  category: 'IMPACT_METRICS' | 'ATS_FORMATTING' | 'KEYWORD_ALIGNMENT' | 'BREVITY_STRUCTURE' | 'SKILLS_CREDENTIALS';
  title: string;
  weight: number; // e.g. 25, 20, 25, 15, 15 (Total = 100)
  rawScore: number; // 0 - 100 from model or deterministic rubric
  weightedScore: number; // (rawScore * weight) / 100
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL';
  evidencePoints: string[];
  missingElements: string[];
  recommendations: string[];
}

export interface AtsAssessmentResult {
  assessmentId: string;
  timestamp: string;
  targetRole: string;
  targetIndustry?: string;
  overallScore: number; // 0 - 100 deterministic weighted score
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  topStrengths: string[];
  criticalGaps: string[];
  categories: AtsCategoryEvaluation[];
  matchedKeywords: string[];
  missingKeywords: string[];
  detectedWordCount: number;
  providerAudit: {
    selectedProvider: AiProviderName;
    modelUsed: string;
    attemptsCount: number;
    failoverTrail: {
      provider: AiProviderName;
      model: string;
      success: boolean;
      durationMs: number;
      errorCode?: number;
      errorReason?: string;
    }[];
    totalDurationMs: number;
    tokensUsed?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    deterministicValidated: boolean;
  };
}

export interface AiProviderConfig {
  mode: 'free_only';
  primaryProvider: AiProviderName;
  fallbackProviders: AiProviderName[];
  maxAttempts: number;
  allowPaidFallback: false; // Mandatory hardcoded false
  failoverEnabled: boolean;
  providers: Record<AiProviderName, {
    enabled: boolean;
    model: string;
    priority: number;
  }>;
}

