/**
 * HOPEPITOME OPENAI GPT-6 LUNA ASSESSMENT ENGINE
 * Dedicated single-provider execution engine for OpenAI GPT-6 Luna.
 * Replaces all legacy multi-provider failover, secondary models, and quota chains.
 * Provides usage monitoring, token tracking, estimated cost calculation, and strict error handling.
 */

import {
  AtsAssessmentResult,
  ProviderHealthState,
  SanitizedResumeInput,
  OpenAiUsageStats,
} from './types';
import { OpenAiAdapter } from './adapters';
import { anonymizeResumeText } from './privacy';
import { calculateDeterministicAtsScore } from './scoring';
import { ACTIVE_AI_MODEL, calculateGpt6LunaCost } from './models';

// Edge-persisted memory usage store
const memoryUsageStats: OpenAiUsageStats = {
  totalAssessments: 0,
  successfulAssessments: 0,
  failedAssessments: 0,
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  estimatedCostUsd: 0,
  averageLatencyMs: 0,
  monthlyBudgetLimitUsd: 100.0,
  budgetWarningTriggered: false,
};

let totalLatencyAccumulator = 0;

export class AtsOpenAiEngine {
  private adapter: OpenAiAdapter = new OpenAiAdapter();

  /**
   * Health and configuration check for OpenAI GPT-6 Luna
   */
  public getProviderHealth(env: any): ProviderHealthState {
    const configured = this.adapter.isConfigured(env);
    const hasFailures = memoryUsageStats.failedAssessments > 0;
    const currentStatus = !configured ? 'NOT_CONFIGURED' : hasFailures && memoryUsageStats.successfulAssessments === 0 ? 'ERROR' : 'CONNECTED';

    return {
      providerId: 'openai',
      modelId: ACTIVE_AI_MODEL.id,
      configured,
      currentStatus,
      lastSuccessfulRequest: memoryUsageStats.lastSuccessfulRequest,
      lastFailure: memoryUsageStats.lastError ? new Date().toISOString() : undefined,
      lastErrorMessage: memoryUsageStats.lastError,
      totalSuccessCount: memoryUsageStats.successfulAssessments,
      totalFailureCount: memoryUsageStats.failedAssessments,
      lastHealthCheck: new Date().toISOString(),
      adminNotes: 'Single-model exclusive architecture: OpenAI Responses API via GPT-6 Luna.',
    };
  }

  /**
   * Returns current aggregate usage and cost statistics
   */
  public getUsageStats(): OpenAiUsageStats {
    return { ...memoryUsageStats };
  }

  /**
   * Updates monthly spending budget limit
   */
  public setMonthlyBudgetLimit(limitUsd: number) {
    if (typeof limitUsd === 'number' && limitUsd > 0) {
      memoryUsageStats.monthlyBudgetLimitUsd = limitUsd;
      memoryUsageStats.budgetWarningTriggered = memoryUsageStats.estimatedCostUsd >= limitUsd * 0.85;
    }
  }

  /**
   * Executes ATS evaluation strictly using OpenAI GPT-6 Luna.
   * Throws a controlled, user-facing error if OpenAI is unavailable.
   */
  public async analyzeResume(
    rawResumeText: string,
    options: {
      uploadId?: string;
      fileBase64?: string;
      fileMimeType?: string;
      fileSize?: number;
      targetRole?: string;
      targetIndustry?: string;
      jobDescription?: string;
      fileName?: string;
      assessmentId?: string;
    },
    env: any
  ): Promise<AtsAssessmentResult> {
    const startTime = Date.now();
    memoryUsageStats.totalAssessments += 1;

    // 1. Sanitize & Anonymize (PII Removal, preserves fileBase64 / fileMimeType / uploadId)
    const sanitizedInput: SanitizedResumeInput = anonymizeResumeText(
      rawResumeText,
      options.targetRole,
      options.targetIndustry,
      options.jobDescription,
      options.fileName,
      options.fileBase64,
      options.fileMimeType,
      options.uploadId,
      options.fileSize
    );

    const assessmentId =
      options.assessmentId ||
      `ATS-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 2. Execute via OpenAI GPT-6 Luna Adapter
    const result = await this.adapter.execute(sanitizedInput, env);

    if (!result.success || !result.rawJson) {
      memoryUsageStats.failedAssessments += 1;
      memoryUsageStats.lastError = result.errorReason || 'OpenAI inference failed';

      // Internal diagnostic logged on server side
      console.error('[OpenAI GPT-6 Luna Execution Error]:', {
        timestamp: new Date().toISOString(),
        assessmentId,
        uploadId: options.uploadId,
        fileName: options.fileName,
        fileSize: options.fileSize,
        errorCode: result.errorCode,
        reason: result.errorReason,
      });

      const err = new Error(result.errorReason || 'Our resume review service is temporarily unavailable. Please try again shortly.');
      (err as any).statusCode = result.errorCode || 500;
      (err as any).errorType =
        result.errorType ||
        (result.errorCode === 422
          ? 'AI_OUTPUT_VALIDATION_FAILED'
          : result.errorCode === 429
          ? 'OPENAI_RATE_LIMITED'
          : result.errorCode === 413
          ? 'FILE_VALIDATION_FAILED'
          : result.errorCode === 401
          ? 'OPENAI_AUTHENTICATION_FAILED'
          : result.errorCode === 504
          ? 'OPENAI_RESPONSE_FAILED'
          : 'OPENAI_RESPONSE_FAILED');
      (err as any).processingStage = result.processingStage || 'G_RESPONSES_API_REQUEST';
      (err as any).openaiRequestId = result.openaiRequestId;
      (err as any).durationMs = result.durationMs;
      throw err;
    }

    // 3. Update usage statistics upon success
    const promptTokens = result.tokensUsed?.promptTokens || 0;
    const completionTokens = result.tokensUsed?.completionTokens || 0;
    const totalTokens = result.tokensUsed?.totalTokens || promptTokens + completionTokens;
    const estimatedCost = result.estimatedCostUsd || calculateGpt6LunaCost(promptTokens, completionTokens);

    memoryUsageStats.successfulAssessments += 1;
    memoryUsageStats.inputTokens += promptTokens;
    memoryUsageStats.outputTokens += completionTokens;
    memoryUsageStats.totalTokens += totalTokens;
    memoryUsageStats.estimatedCostUsd = Number((memoryUsageStats.estimatedCostUsd + estimatedCost).toFixed(6));
    memoryUsageStats.lastSuccessfulRequest = new Date().toISOString();
    memoryUsageStats.lastError = undefined;

    totalLatencyAccumulator += result.durationMs;
    memoryUsageStats.averageLatencyMs = Math.round(
      totalLatencyAccumulator / memoryUsageStats.successfulAssessments
    );

    if (memoryUsageStats.estimatedCostUsd >= memoryUsageStats.monthlyBudgetLimitUsd * 0.85) {
      memoryUsageStats.budgetWarningTriggered = true;
    }

    // 4. Calculate Deterministic Score & Structured Career Intelligence
    return calculateDeterministicAtsScore(result.rawJson, sanitizedInput, assessmentId, {
      selectedProvider: 'openai',
      modelUsed: ACTIVE_AI_MODEL.id,
      attemptsCount: 1,
      failoverTrail: [
        {
          provider: 'openai',
          model: ACTIVE_AI_MODEL.id,
          success: true,
          durationMs: result.durationMs,
        },
      ],
      totalDurationMs: result.durationMs,
      tokensUsed: {
        promptTokens,
        completionTokens,
        totalTokens,
        reasoningTokens: result.tokensUsed?.reasoningTokens,
      },
      estimatedCostUsd: estimatedCost,
      deterministicValidated: true,
    });
  }

  // Backwards compatibility alias for existing route handlers
  public analyzeResumeWithFailover(
    rawResumeText: string,
    options: any,
    env: any
  ): Promise<AtsAssessmentResult> {
    return this.analyzeResume(rawResumeText, options, env);
  }

  public syncProviderHealth(env: any): Record<string, ProviderHealthState> {
    return {
      openai: this.getProviderHealth(env),
    };
  }
}

export const globalAtsEngine = new AtsOpenAiEngine();
