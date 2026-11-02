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
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(text);
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
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${apiKey}`;

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
          maxOutputTokens: 3000,
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
        return {
          success: false,
          durationMs,
          errorCode: res.status,
          errorReason: `Gemini HTTP ${res.status}: ${errText.substring(0, 300)}`,
          isRateLimit,
          isDailyQuota,
        };
      }

      const json = await res.json() as any;
      const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = cleanJsonText(candidateText);

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
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: `Gemini Network/Parsing Error: ${err.message}`,
      };
    }
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

    try {
      const payload = {
        model: this.modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 3000,
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
        const isRateLimit = res.status === 429;
        const isDailyQuota = errText.toLowerCase().includes('rate_limit_exceeded') || errText.toLowerCase().includes('daily');
        return {
          success: false,
          durationMs,
          errorCode: res.status,
          errorReason: `Groq HTTP ${res.status}: ${errText.substring(0, 300)}`,
          isRateLimit,
          isDailyQuota,
        };
      }

      const json = await res.json() as any;
      const content = json?.choices?.[0]?.message?.content;
      const parsed = cleanJsonText(content);

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
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: `Groq Network/Parsing Error: ${err.message}`,
      };
    }
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

    try {
      const payload = {
        model: this.modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 3000,
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
        const isRateLimit = res.status === 429;
        const isDailyQuota = errText.toLowerCase().includes('quota') || errText.toLowerCase().includes('credits');
        return {
          success: false,
          durationMs,
          errorCode: res.status,
          errorReason: `OpenRouter HTTP ${res.status}: ${errText.substring(0, 300)}`,
          isRateLimit,
          isDailyQuota,
        };
      }

      const json = await res.json() as any;
      const content = json?.choices?.[0]?.message?.content;
      const parsed = cleanJsonText(content);

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
      return {
        success: false,
        durationMs: Date.now() - startTime,
        errorCode: 500,
        errorReason: `OpenRouter Network/Parsing Error: ${err.message}`,
      };
    }
  }
}

