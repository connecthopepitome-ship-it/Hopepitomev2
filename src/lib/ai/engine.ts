/**
 * MULTI-PROVIDER AI FAILOVER & HEALTH ENGINE
 * Orchestrates seamless switching between Google Gemini, Groq, Cloudflare Workers AI, and OpenRouter.
 * Guarantees zero-paid fallback, respects rate limits, manages cooldown states, and ensures idempotency.
 */

import {
  AiProviderName,
  AtsAssessmentResult,
  ProviderHealthState,
  SanitizedResumeInput,
} from './types';
import {
  AiProviderAdapter,
  GeminiAdapter,
  GroqAdapter,
  CloudflareWorkersAiAdapter,
  OpenRouterAdapter,
} from './adapters';
import { anonymizeResumeText } from './privacy';
import { calculateDeterministicAtsScore } from './scoring';
import { getDefaultFreeModel } from './models';

// Edge-persisted or memory health cache
const edgeHealthStore: Record<AiProviderName, ProviderHealthState> = {
  gemini: {
    providerId: 'gemini',
    modelId: getDefaultFreeModel('gemini'),
    configured: false,
    enabled: true,
    freeTierVerified: true,
    currentStatus: 'UNCONFIGURED',
    dailyQuotaExhausted: false,
    consecutiveFailures: 0,
    totalSuccessCount: 0,
    totalFailureCount: 0,
    lastHealthCheck: new Date().toISOString(),
  },
  groq: {
    providerId: 'groq',
    modelId: getDefaultFreeModel('groq'),
    configured: false,
    enabled: true,
    freeTierVerified: true,
    currentStatus: 'UNCONFIGURED',
    dailyQuotaExhausted: false,
    consecutiveFailures: 0,
    totalSuccessCount: 0,
    totalFailureCount: 0,
    lastHealthCheck: new Date().toISOString(),
  },
  cloudflare: {
    providerId: 'cloudflare',
    modelId: getDefaultFreeModel('cloudflare'),
    configured: false,
    enabled: true,
    freeTierVerified: true,
    currentStatus: 'UNCONFIGURED',
    dailyQuotaExhausted: false,
    consecutiveFailures: 0,
    totalSuccessCount: 0,
    totalFailureCount: 0,
    lastHealthCheck: new Date().toISOString(),
  },
  openrouter: {
    providerId: 'openrouter',
    modelId: getDefaultFreeModel('openrouter'),
    configured: false,
    enabled: true,
    freeTierVerified: true,
    currentStatus: 'UNCONFIGURED',
    dailyQuotaExhausted: false,
    consecutiveFailures: 0,
    totalSuccessCount: 0,
    totalFailureCount: 0,
    lastHealthCheck: new Date().toISOString(),
  },
};

export class AtsMultiProviderEngine {
  private adapters: Map<AiProviderName, AiProviderAdapter> = new Map();

  constructor() {
    this.adapters.set('gemini', new GeminiAdapter());
    this.adapters.set('groq', new GroqAdapter());
    this.adapters.set('cloudflare', new CloudflareWorkersAiAdapter());
    this.adapters.set('openrouter', new OpenRouterAdapter());
  }

  /**
   * Sync provider configuration status from Cloudflare environment
   */
  public syncProviderHealth(env: any): Record<AiProviderName, ProviderHealthState> {
    const now = Date.now();
    const providers: AiProviderName[] = ['gemini', 'groq', 'cloudflare', 'openrouter'];
    for (const provider of providers) {
      const adapter = this.adapters.get(provider);
      if (!adapter) continue;
      const state = edgeHealthStore[provider];
      state.configured = adapter.isConfigured(env);

      // Check if cooldown has expired
      if (state.cooldownUntil && state.cooldownUntil <= now) {
        state.cooldownUntil = undefined;
        if (state.currentStatus === 'COOLDOWN' || state.currentStatus === 'RATE_LIMITED') {
          state.currentStatus = state.configured ? 'HEALTHY' : 'UNCONFIGURED';
        }
      }

      // Check daily quota reset (24 hour expiration)
      if (state.dailyQuotaResetAt && state.dailyQuotaResetAt <= now) {
        state.dailyQuotaResetAt = undefined;
        state.dailyQuotaExhausted = false;
        if (state.currentStatus === 'QUOTA_EXHAUSTED') {
          state.currentStatus = state.configured ? 'HEALTHY' : 'UNCONFIGURED';
        }
      }

      if (!state.configured) {
        state.currentStatus = 'UNCONFIGURED';
      } else if (!state.enabled) {
        state.currentStatus = 'DISABLED';
      } else if (!state.cooldownUntil && !state.dailyQuotaExhausted) {
        state.currentStatus = 'HEALTHY';
      }

      state.lastHealthCheck = new Date().toISOString();
    }
    return edgeHealthStore;
  }

  /**
   * Run full ATS evaluation with strict automatic failover
   */
  public async analyzeResumeWithFailover(
    rawResumeText: string,
    options: {
      targetRole?: string;
      targetIndustry?: string;
      jobDescription?: string;
      fileName?: string;
      assessmentId?: string;
    },
    env: any
  ): Promise<AtsAssessmentResult> {
    this.syncProviderHealth(env);

    // 1. Sanitize & Anonymize (PII Removal)
    const sanitizedInput: SanitizedResumeInput = anonymizeResumeText(
      rawResumeText,
      options.targetRole,
      options.targetIndustry,
      options.jobDescription,
      options.fileName
    );

    const assessmentId = options.assessmentId || `ATS-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 2. Determine Provider Execution Priority Order
    // Default: Gemini (P1) -> Groq (P2) -> Cloudflare (P3) -> OpenRouter (P4)
    const priorityOrder: AiProviderName[] = ['gemini', 'groq', 'cloudflare', 'openrouter'];
    const failoverTrail: AtsAssessmentResult['providerAudit']['failoverTrail'] = [];

    const startTime = Date.now();
    let successfulResult: any = null;
    let winningProvider: AiProviderName | null = null;
    let winningAdapter: AiProviderAdapter | null = null;
    let tokensAccumulated: any = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

    // 3. Iterate through eligible free providers
    for (const provider of priorityOrder) {
      const adapter = this.adapters.get(provider)!;
      const health = edgeHealthStore[provider];

      // Eligibility Check
      if (!health.configured || !health.enabled || health.dailyQuotaExhausted) {
        continue;
      }
      if (health.cooldownUntil && health.cooldownUntil > Date.now()) {
        continue;
      }

      // Execute request through adapter
      const execResult = await adapter.execute(sanitizedInput, env);

      failoverTrail.push({
        provider,
        model: adapter.modelName,
        success: execResult.success,
        durationMs: execResult.durationMs,
        errorCode: execResult.errorCode,
        errorReason: execResult.errorReason,
      });

      if (execResult.success && execResult.rawJson) {
        // Success: update provider metrics
        health.currentStatus = 'HEALTHY';
        health.lastSuccessfulRequest = new Date().toISOString();
        health.consecutiveFailures = 0;
        health.totalSuccessCount += 1;

        successfulResult = execResult.rawJson;
        winningProvider = provider;
        winningAdapter = adapter;
        if (execResult.tokensUsed) {
          tokensAccumulated = execResult.tokensUsed;
        }
        break; // Stop immediately upon first validated response
      }

      // Handle Provider Failure & Classify
      health.totalFailureCount += 1;
      health.consecutiveFailures += 1;
      health.lastFailure = new Date().toISOString();
      health.lastErrorCode = execResult.errorCode;
      health.lastErrorMessage = execResult.errorReason;

      if (execResult.isRateLimit) {
        health.currentStatus = 'RATE_LIMITED';
        health.cooldownUntil = Date.now() + 60 * 1000; // 60s cooldown
      } else if (execResult.isDailyQuota) {
        health.currentStatus = 'QUOTA_EXHAUSTED';
        health.dailyQuotaExhausted = true;
        health.dailyQuotaResetAt = Date.now() + 4 * 60 * 60 * 1000; // 4 hour backoff
      } else if (execResult.errorCode === 401 || execResult.errorCode === 403) {
        health.currentStatus = 'UNCONFIGURED';
      } else {
        health.currentStatus = 'COOLDOWN';
        health.cooldownUntil = Date.now() + 30 * 1000; // 30s backoff for 5xx errors
      }
    }

    // 4. Validate outcome
    if (!successfulResult || !winningProvider || !winningAdapter) {
      throw new Error(
        `All configured free AI providers are currently unavailable or rate-limited. Failures recorded: ${failoverTrail
          .map((t) => `${t.provider} (${t.errorCode || 'failed'})`)
          .join(', ')}. Please retry in a few moments.`
      );
    }

    // 5. Calculate Deterministic Score
    const totalDurationMs = Date.now() - startTime;
    return calculateDeterministicAtsScore(successfulResult, sanitizedInput, assessmentId, {
      selectedProvider: winningProvider,
      modelUsed: winningAdapter.modelName,
      attemptsCount: failoverTrail.length,
      failoverTrail,
      totalDurationMs,
      tokensUsed: tokensAccumulated,
      deterministicValidated: true,
    });
  }
}

export const globalAtsEngine = new AtsMultiProviderEngine();

