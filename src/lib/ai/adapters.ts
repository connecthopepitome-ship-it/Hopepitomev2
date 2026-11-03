/**
 * ATS MULTI-PROVIDER ADAPTER SUITE
 * Implements adapters for:
 * 1. Google Gemini (Priority 1)
 * 2. Groq LPU (Priority 2)
 * 3. Cloudflare Workers AI (Priority 3)
 * 4. OpenRouter Free Catalog (Priority 4)
 * Strict free-tier validation and zero-paid fallback enforcement.
 */

import { AiProviderName, SanitizedResumeInput } from './types';
import { isApprovedFreeModel, getDefaultFreeModel } from './models';
import { buildAtsPrompt } from './scoring';

export interface ProviderExecutionResult {
  success: boolean;
  rawJson?: any;
  durationMs: number;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  errorCode?: number;
  errorReason?: string;
  isRateLimit?: boolean;
  isDailyQuota?: boolean;
}

export interface AiProviderAdapter {
  providerName: AiProviderName;
  modelName: string;
  isConfigured(env: any): boolean;
  execute(input: SanitizedResumeInput, env: any): Promise<ProviderExecutionResult>;
}

function cleanJsonText(raw: string): any {
  if (!raw) return null;
  let text = raw.trim();
  // Strip Markdown code fences if returned
  if (text.includes('```json')) {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
    if (match) text = match[1].trim();
  } else if (text.includes('```')) {
    const match = text.match(/```\s*([\s\S]*?)\s*```/i);
    if (match) text = match[1].trim();
  }
  try {
    return JSON.parse(text);
  } catch {
    // Fallback: extract outermost JSON object { ... }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

// =============================================================================
// ADAPTER 1: GOOGLE GEMINI API (FREE TIER)
// =============================================================================
export class GeminiAdapter implements AiProviderAdapter {
  providerName: AiProviderName = 'gemini';
  modelName: string;

  constructor(modelName?: string) {
    this.modelName = modelName || getDefaultFreeModel('gemini');
    if (!isApprovedFreeModel('gemini', this.modelName)) {
      throw new Error(`[FREE-ONLY VIOLATION] Gemini model '${this.modelName}' is not in the approved free-tier list.`);
    }
  }

  isConfigured(env: any): boolean {
    return Boolean(env?.GEMINI_API_KEY && String(env.GEMINI_API_KEY).trim().length > 10);
  }

  async execute(input: SanitizedResumeInput, env: any): Promise<ProviderExecutionResult> {
    const startTime = Date.now();
    const apiKey = env?.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        durationMs: 0,
        errorCode: 401,
        errorReason: 'GEMINI_API_KEY is not configured in worker environment.',
      };
    }

    const { systemPrompt, userPrompt } = buildAtsPrompt(input);
    const candidateModels = Array.from(new Set([this.modelName, 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite']));
    let lastError: any = null;

    for (const model of candidateModels) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      try {
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
            temperature: 0.2,
            maxOutputTokens: 2500,
          },
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const durationMs = Date.now() - startTime;

        if (!res.ok) {
          const errText = await res.text();
          const isRateLimit = res.status === 429;
          const isDailyQuota = errText.toLowerCase().includes('resource_exhausted') || errText.toLowerCase().includes('quota');
          lastError = {
            success: false,
            durationMs,
            errorCode: res.status,
            errorReason: `Gemini HTTP ${res.status} (${model}): ${errText.substring(0, 300)}`,
            isRateLimit,
            isDailyQuota,
          };
          // If 503 (high demand) or 404, try the next model candidate
          if (res.status === 503 || res.status === 404) {
            continue;
          }
          return lastError;
        }

        const json = await res.json() as any;
        const parts = json?.candidates?.[0]?.content?.parts || [];
        const textPart = parts.find((p: any) => p.text && !p.thought) || parts.find((p: any) => p.text) || parts[0];
        const candidateText = textPart?.text || '';
        const parsed = cleanJsonText(candidateText);

        if (!parsed) {
          lastError = {
            success: false,
            durationMs,
            errorCode: 502,
            errorReason: `Gemini (${model}) returned non-JSON content`,
          };
          continue;
        }

        // Successfully updated active model
        this.modelName = model;

        return {
          success: true,
          rawJson: parsed,
          durationMs,
          tokensUsed: {
            promptTokens: json?.usageMetadata?.promptTokenCount || 0,
            completionTokens: json?.usageMetadata?.candidatesTokenCount || 0,
            totalTokens: json?.usageMetadata?.totalTokenCount || 0,
          },
        };
      } catch (err: any) {
        lastError = {
          success: false,
          durationMs: Date.now() - startTime,
          errorCode: 500,
          errorReason: `Gemini (${model}) Network/Parsing Error: ${err.message}`,
        };
      }
    }

    return (
      lastError || {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: 'All Gemini model candidates exhausted',
      }
    );
  }
}

// =============================================================================
// ADAPTER 2: GROQ LPU API (FREE TIER)
// =============================================================================
export class GroqAdapter implements AiProviderAdapter {
  providerName: AiProviderName = 'groq';
  modelName: string;

  constructor(modelName?: string) {
    this.modelName = modelName || getDefaultFreeModel('groq');
    if (!isApprovedFreeModel('groq', this.modelName)) {
      throw new Error(`[FREE-ONLY VIOLATION] Groq model '${this.modelName}' is not in the approved free-tier list.`);
    }
  }

  isConfigured(env: any): boolean {
    return Boolean(env?.GROQ_API_KEY && String(env.GROQ_API_KEY).trim().length > 10);
  }

  async execute(input: SanitizedResumeInput, env: any): Promise<ProviderExecutionResult> {
    const startTime = Date.now();
    const apiKey = env?.GROQ_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        durationMs: 0,
        errorCode: 401,
        errorReason: 'GROQ_API_KEY is not configured in worker environment.',
      };
    }

    const { systemPrompt, userPrompt } = buildAtsPrompt(input);
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    const candidateModels = Array.from(new Set([this.modelName, 'openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b']));
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const payload = {
          model,
          messages: [
            { role: 'system', content: `${systemPrompt}\nOutput valid JSON.` },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 1600,
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        const durationMs = Date.now() - startTime;

        if (!res.ok) {
          const errText = await res.text();
          const isRateLimit = res.status === 429 || res.status === 413;
          const isDailyQuota = errText.toLowerCase().includes('rate_limit_exceeded') || errText.toLowerCase().includes('daily');
          lastError = {
            success: false,
            durationMs,
            errorCode: res.status,
            errorReason: `Groq HTTP ${res.status} (${model}): ${errText.substring(0, 300)}`,
            isRateLimit,
            isDailyQuota,
          };
          // If 413 (payload/OTPM limit) or 429 (rate limit), try next candidate model
          if (res.status === 413 || res.status === 429) {
            continue;
          }
          return lastError;
        }

        const json = await res.json() as any;
        const content = json?.choices?.[0]?.message?.content;
        const parsed = cleanJsonText(content);

        if (!parsed) {
          lastError = {
            success: false,
            durationMs,
            errorCode: 502,
            errorReason: `Groq (${model}) returned non-JSON content`,
          };
          continue;
        }

        // Successfully updated active model
        this.modelName = model;

        return {
          success: true,
          rawJson: parsed,
          durationMs,
          tokensUsed: {
            promptTokens: json?.usage?.prompt_tokens || 0,
            completionTokens: json?.usage?.completion_tokens || 0,
            totalTokens: json?.usage?.total_tokens || 0,
          },
        };
      } catch (err: any) {
        lastError = {
          success: false,
          durationMs: Date.now() - startTime,
          errorCode: 500,
          errorReason: `Groq (${model}) Network/Parsing Error: ${err.message}`,
        };
      }
    }

    return (
      lastError || {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: 'All Groq model candidates exhausted',
      }
    );
  }
}

// =============================================================================
// ADAPTER 3: CLOUDFLARE WORKERS AI (FREE TIER BINDING)
// =============================================================================
export class CloudflareWorkersAiAdapter implements AiProviderAdapter {
  providerName: AiProviderName = 'cloudflare';
  modelName: string;

  constructor(modelName?: string) {
    this.modelName = modelName || getDefaultFreeModel('cloudflare');
    if (!isApprovedFreeModel('cloudflare', this.modelName)) {
      throw new Error(`[FREE-ONLY VIOLATION] Cloudflare model '${this.modelName}' is not in the approved free-tier list.`);
    }
  }

  isConfigured(env: any): boolean {
    return Boolean(env?.AI && typeof env.AI.run === 'function');
  }

  async execute(input: SanitizedResumeInput, env: any): Promise<ProviderExecutionResult> {
    const startTime = Date.now();
    if (!env?.AI || typeof env.AI.run !== 'function') {
      return {
        success: false,
        durationMs: 0,
        errorCode: 404,
        errorReason: 'Cloudflare Workers AI binding (env.AI) is not enabled on this worker.',
      };
    }

    const { systemPrompt, userPrompt } = buildAtsPrompt(input);

    try {
      const messages = [
        { role: 'system', content: `${systemPrompt}\nOutput raw JSON only.` },
        { role: 'user', content: userPrompt },
      ];

      const response: any = await env.AI.run(this.modelName as any, {
        messages,
        max_tokens: 2500,
        temperature: 0.2,
      });

      const durationMs = Date.now() - startTime;
      const content = response?.response || response?.text || JSON.stringify(response);
      const parsed = cleanJsonText(content);

      return {
        success: true,
        rawJson: parsed,
        durationMs,
        tokensUsed: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: `Cloudflare Workers AI Execution Error: ${err.message}`,
      };
    }
  }
}

// =============================================================================
// ADAPTER 4: OPENROUTER FREE MODELS CATALOG (STRICT :free SUFFIX)
// =============================================================================
export class OpenRouterAdapter implements AiProviderAdapter {
  providerName: AiProviderName = 'openrouter';
  modelName: string;

  constructor(modelName?: string) {
    this.modelName = modelName || getDefaultFreeModel('openrouter');
    if (!isApprovedFreeModel('openrouter', this.modelName)) {
      throw new Error(`[FREE-ONLY VIOLATION] OpenRouter model '${this.modelName}' is not an approved :free model.`);
    }
  }

  isConfigured(env: any): boolean {
    return Boolean(env?.OPENROUTER_API_KEY && String(env.OPENROUTER_API_KEY).trim().length > 10);
  }

  async execute(input: SanitizedResumeInput, env: any): Promise<ProviderExecutionResult> {
    const startTime = Date.now();
    const apiKey = env?.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        durationMs: 0,
        errorCode: 401,
        errorReason: 'OPENROUTER_API_KEY is not configured in worker environment.',
      };
    }

    const { systemPrompt, userPrompt } = buildAtsPrompt(input);
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    const candidateModels = Array.from(new Set([this.modelName, 'liquid/lfm-2.5-2.6b:free', 'nvidia/nemotron-3.5-lightning:free', 'cohere/north-mini-code:free']));
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const payload = {
          model,
          messages: [
            { role: 'system', content: `${systemPrompt}\nOutput valid JSON.` },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 1600,
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://hopepitome.com',
            'X-Title': 'Hopepitome ATS Checker',
          },
          body: JSON.stringify(payload),
        });

        const durationMs = Date.now() - startTime;

        if (!res.ok) {
          const errText = await res.text();
          const isRateLimit = res.status === 429 || res.status === 413;
          const isDailyQuota = errText.toLowerCase().includes('quota') || errText.toLowerCase().includes('credits');
          lastError = {
            success: false,
            durationMs,
            errorCode: res.status,
            errorReason: `OpenRouter HTTP ${res.status} (${model}): ${errText.substring(0, 300)}`,
            isRateLimit,
            isDailyQuota,
          };
          // Try next model if rate limited or server error
          if (res.status === 429 || res.status === 503 || res.status === 404) {
            continue;
          }
          return lastError;
        }

        const json = await res.json() as any;
        const content = json?.choices?.[0]?.message?.content;
        const parsed = cleanJsonText(content);

        if (!parsed) {
          lastError = {
            success: false,
            durationMs,
            errorCode: 502,
            errorReason: `OpenRouter (${model}) returned non-JSON content`,
          };
          continue;
        }

        // Successfully updated active model
        this.modelName = model;

        return {
          success: true,
          rawJson: parsed,
          durationMs,
          tokensUsed: {
            promptTokens: json?.usage?.prompt_tokens || 0,
            completionTokens: json?.usage?.completion_tokens || 0,
            totalTokens: json?.usage?.total_tokens || 0,
          },
        };
      } catch (err: any) {
        lastError = {
          success: false,
          durationMs: Date.now() - startTime,
          errorCode: 500,
          errorReason: `OpenRouter (${model}) Network/Parsing Error: ${err.message}`,
        };
      }
    }

    return (
      lastError || {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: 'All OpenRouter model candidates exhausted',
      }
    );
  }
}

