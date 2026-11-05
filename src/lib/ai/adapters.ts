/**
 * OPENAI GPT-6 LUNA ADAPTER (RESPONSES API)
 * Dedicated single-provider adapter for OpenAI GPT-6 Luna.
 * Uses OpenAI Responses API (/v1/responses) with strict JSON output formatting.
 * All secondary providers and fallback chains are completely removed.
 */

import { SanitizedResumeInput } from './types';
import { ACTIVE_AI_MODEL, calculateGpt6LunaCost } from './models';
import { buildAtsPrompt } from './scoring';

export interface ProviderExecutionResult {
  success: boolean;
  rawJson?: any;
  durationMs: number;
  tokensUsed?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    reasoningTokens?: number;
  };
  estimatedCostUsd?: number;
  errorCode?: number;
  errorReason?: string;
  isRateLimit?: boolean;
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

export class OpenAiAdapter {
  readonly providerName = 'openai' as const;
  readonly modelName = ACTIVE_AI_MODEL.id;

  isConfigured(env: any): boolean {
    const key = env?.OPENAI_API_KEY;
    return Boolean(key && String(key).trim().startsWith('sk-') && String(key).trim().length > 20);
  }

  async execute(input: SanitizedResumeInput, env: any): Promise<ProviderExecutionResult> {
    const startTime = Date.now();
    const apiKey = env?.OPENAI_API_KEY;

    if (!apiKey || !this.isConfigured(env)) {
      return {
        success: false,
        durationMs: 0,
        errorCode: 401,
        errorReason: 'OPENAI_API_KEY environment secret is not configured on this server.',
      };
    }

    const { systemPrompt, userPrompt } = buildAtsPrompt(input);
    const endpoint = ACTIVE_AI_MODEL.apiEndpoint;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s hard timeout

    try {
      const payload = {
        model: this.modelName,
        input: [
          { role: 'system', content: `${systemPrompt}\nOutput valid JSON only.` },
          { role: 'user', content: userPrompt },
        ],
        text: {
          format: { type: 'json_object' },
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;

      if (!res.ok) {
        const errText = await res.text();
        const isRateLimit = res.status === 429;
        return {
          success: false,
          durationMs,
          errorCode: res.status,
          errorReason: `OpenAI Responses API HTTP ${res.status}: ${errText.substring(0, 300)}`,
          isRateLimit,
        };
      }

      const json = (await res.json()) as any;

      // Extract generated text from Responses API output array
      let candidateText = '';
      if (Array.isArray(json?.output)) {
        const messageObj = json.output.find((item: any) => item.type === 'message');
        if (messageObj?.content && Array.isArray(messageObj.content)) {
          const textItem = messageObj.content.find((c: any) => c.type === 'output_text');
          candidateText = textItem?.text || '';
        }
      }

      // Fallback for standard completions if response format varies
      if (!candidateText && json?.choices?.[0]?.message?.content) {
        candidateText = json.choices[0].message.content;
      }

      const parsed = cleanJsonText(candidateText);
      if (!parsed) {
        return {
          success: false,
          durationMs,
          errorCode: 502,
          errorReason: 'OpenAI GPT-6 Luna returned unparseable non-JSON content.',
        };
      }

      const promptTokens = json?.usage?.input_tokens || json?.usage?.prompt_tokens || 0;
      const completionTokens = json?.usage?.output_tokens || json?.usage?.completion_tokens || 0;
      const reasoningTokens = json?.usage?.output_tokens_details?.reasoning_tokens || 0;
      const totalTokens = json?.usage?.total_tokens || promptTokens + completionTokens;
      const estimatedCostUsd = calculateGpt6LunaCost(promptTokens, completionTokens);

      return {
        success: true,
        rawJson: parsed,
        durationMs,
        tokensUsed: {
          promptTokens,
          completionTokens,
          totalTokens,
          reasoningTokens,
        },
        estimatedCostUsd,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const durationMs = Date.now() - startTime;
      const isAbort = err.name === 'AbortError';

      return {
        success: false,
        durationMs,
        errorCode: isAbort ? 408 : 500,
        errorReason: isAbort
          ? 'OpenAI GPT-6 Luna request timed out after 45 seconds.'
          : `OpenAI Connection Error: ${err.message}`,
      };
    }
  }
}
