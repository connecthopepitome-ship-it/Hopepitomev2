/**
 * OPENAI GPT-6 LUNA ADAPTER (RESPONSES API)
 * Dedicated single-provider adapter for OpenAI GPT-6 Luna.
 * Uses OpenAI Responses API (/v1/responses) with strict JSON output formatting.
 * All secondary providers and fallback chains are completely removed.
 */

import { SanitizedResumeInput, AtsFailureClassification, ProcessingStage } from './types';
import { ACTIVE_AI_MODEL, calculateGpt6LunaCost } from './models';
import { buildAtsPrompt, INVALID_EXTRACTION_REGEX } from './scoring';

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
  errorType?: AtsFailureClassification;
  processingStage?: ProcessingStage;
  openaiRequestId?: string;
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
        errorType: 'OPENAI_AUTHENTICATION_FAILED',
        processingStage: 'E_PDF_OPENAI_SUBMISSION',
        errorReason: 'OPENAI_API_KEY environment secret is not configured on this server.',
      };
    }

    const { systemPrompt, userPrompt } = buildAtsPrompt(input);
    const endpoint = ACTIVE_AI_MODEL.apiEndpoint;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s hard timeout

    try {
      const userContent: any[] = [];
      if (input.fileBase64) {
        const lowerName = (input.originalFileName || '').toLowerCase();
        // Normalize MIME type strictly by file extension; never pass application/octet-stream to OpenAI
        let mime = 'application/pdf';
        if (lowerName.endsWith('.docx')) {
          mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        } else if (lowerName.endsWith('.txt')) {
          mime = 'text/plain';
        } else if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
          mime = 'image/jpeg';
        } else if (lowerName.endsWith('.png')) {
          mime = 'image/png';
        } else if (lowerName.endsWith('.webp')) {
          mime = 'image/webp';
        } else if (lowerName.endsWith('.pdf')) {
          mime = 'application/pdf';
        } else if (input.fileMimeType && input.fileMimeType !== 'application/octet-stream') {
          mime = input.fileMimeType;
        }

        const cleanBase64 = input.fileBase64.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');

        if (mime.startsWith('image/')) {
          // Native multimodal image understanding for photograph / scan resumes
          userContent.push({
            type: 'input_image',
            image_url: `data:${mime};base64,${cleanBase64}`,
          });
        } else {
          // Standard document input_file for PDF / DOCX
          userContent.push({
            type: 'input_file',
            filename: input.originalFileName || (lowerName.endsWith('.docx') ? 'resume.docx' : 'resume.pdf'),
            file_data: `data:${mime};base64,${cleanBase64}`,
          });
        }
      }
      userContent.push({
        type: 'input_text',
        text: userPrompt,
      });

      const payload = {
        model: this.modelName,
        input: [
          { role: 'system', content: `${systemPrompt}\nOutput valid JSON only.` },
          { role: 'user', content: userContent },
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
      const openaiRequestId = res.headers.get('x-request-id') || undefined;

      if (!res.ok) {
        const errText = await res.text();
        const isRateLimit = res.status === 429;
        let errorType: AtsFailureClassification = 'OPENAI_RESPONSE_FAILED';
        let userReason = `OpenAI API returned HTTP ${res.status}.`;

        if (res.status === 401) {
          errorType = 'OPENAI_AUTHENTICATION_FAILED';
          userReason = 'Authentication error with OpenAI API. Please check server configuration.';
        } else if (res.status === 429) {
          errorType = 'OPENAI_RATE_LIMITED';
          userReason = 'Our resume review service is experiencing high demand right now. Please try again in a few moments.';
        } else if (res.status === 402 || /quota|billing/i.test(errText)) {
          errorType = 'OPENAI_QUOTA_OR_BILLING_ERROR';
          userReason = 'AI review quota limit reached. Please contact support or try again later.';
        } else if (res.status === 400) {
          errorType = /file_data|input_file|unsupported mime/i.test(errText)
            ? 'OPENAI_DOCUMENT_PROCESSING_FAILED'
            : 'OPENAI_RESPONSE_FAILED';
          userReason = 'Unable to process document with OpenAI. Please ensure a standard text-based PDF or Word document is provided.';
        } else if (res.status === 413) {
          errorType = 'FILE_VALIDATION_FAILED';
          userReason = 'The uploaded file is too large for AI review. Please upload a document under 8MB.';
        } else if (res.status >= 500) {
          errorType = 'OPENAI_RESPONSE_FAILED';
          userReason = 'The AI service encountered a temporary error. Please try again shortly.';
        }

        console.error('[OpenAI API Error Diagnostic]:', {
          uploadId: input.uploadId,
          fileName: input.originalFileName,
          fileMimeType: input.fileMimeType,
          fileSize: input.fileSize,
          processingStage: 'G_RESPONSES_API_REQUEST' as ProcessingStage,
          model: this.modelName,
          openaiRequestId,
          httpStatus: res.status,
          errorType,
          errorSummary: errText.substring(0, 400),
          durationMs,
        });

        return {
          success: false,
          durationMs,
          errorCode: res.status,
          errorType,
          processingStage: 'G_RESPONSES_API_REQUEST',
          openaiRequestId,
          errorReason: userReason,
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
          errorType: 'AI_OUTPUT_VALIDATION_FAILED',
          processingStage: 'I_JSON_PARSING',
          openaiRequestId,
          errorReason: 'OpenAI GPT-6 Luna returned unparseable non-JSON content. Please try again.',
        };
      }

      // Candidate Profile and Extraction evaluation
      const prof = String(parsed.candidateProfile?.actualProfession || parsed.inferredRole || '').trim();
      const domain = String(parsed.inferredDomain || parsed.candidateProfile?.inferredDomain || '').trim();
      const hasCategories = Array.isArray(parsed.categories) && parsed.categories.length > 0;
      const hasExtractedData = Boolean(
        parsed.candidateProfile?.name ||
        (parsed.candidateProfile?.actualProfession && !INVALID_EXTRACTION_REGEX.test(parsed.candidateProfile.actualProfession)) ||
        (Array.isArray(parsed.candidateProfile?.skills) && parsed.candidateProfile.skills.length > 0) ||
        (Array.isArray(parsed.candidateProfile?.employmentHistory) && parsed.candidateProfile.employmentHistory.length > 0) ||
        hasCategories
      );

      // ONLY reject if the document output is completely empty and unparseable
      if (!hasExtractedData && parsed.validation && parsed.validation.documentReadable === false && !parsed.summary) {
        return {
          success: false,
          durationMs,
          errorCode: 422,
          errorType: 'AI_OUTPUT_VALIDATION_FAILED',
          processingStage: 'J_PROFILE_VALIDATION',
          openaiRequestId,
          errorReason:
            'We were unable to read clear resume content from this file. Please ensure your resume is an uncorrupted, standard text-based PDF or Word document.',
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

      console.error('[OpenAI Adapter Exception]:', {
        isAbort,
        name: err.name,
        message: err.message,
        uploadId: input.uploadId,
        fileName: input.originalFileName,
        durationMs,
      });

      return {
        success: false,
        durationMs,
        errorCode: isAbort ? 504 : 500,
        errorReason: isAbort
          ? 'The resume review timed out after 45 seconds. Please try again.'
          : 'Failed to connect to the resume review service. Please verify your connection and try again.',
      };
    }
  }
}
