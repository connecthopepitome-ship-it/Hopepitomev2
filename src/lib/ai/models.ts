/**
 * HOPEPITOME FREE MODEL REGISTRY & ALLOWLIST
 * Strictly curated models with verified perpetual or quota-free tier access.
 * Rejects any model that introduces billing or accidental pay-per-token charges.
 */

import { AiProviderName, FreeModelDefinition } from './types';

export const VERIFIED_FREE_MODELS: Record<AiProviderName, FreeModelDefinition[]> = {
  gemini: [
    {
      id: 'gemini-3.5-flash',
      name: 'Google Gemini 3.5 Flash (Free Tier)',
      provider: 'gemini',
      verifiedFree: true,
      freeTierTerms: 'Google AI Studio Free Tier: 15 RPM, 1,500 RPD, 1M TPM. Free of charge.',
      maxContextTokens: 1048576,
      rateLimitRpm: 15,
      rateLimitRpd: 1500,
      supportsJsonSchema: true,
      notes: 'Verified live active model with JSON schema support.',
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Google Gemini 3.1 Flash Lite',
      provider: 'gemini',
      verifiedFree: true,
      freeTierTerms: 'Google AI Studio Free Tier: High throughput lightweight inference.',
      maxContextTokens: 1048576,
      rateLimitRpm: 15,
      rateLimitRpd: 1500,
      supportsJsonSchema: true,
    },
    {
      id: 'gemini-flash-lite-latest',
      name: 'Google Gemini Flash-Lite Latest',
      provider: 'gemini',
      verifiedFree: true,
      freeTierTerms: 'Google AI Studio Latest Generation Free Tier.',
      maxContextTokens: 1048576,
      rateLimitRpm: 15,
      rateLimitRpd: 1500,
      supportsJsonSchema: true,
    },
    {
      id: 'gemini-3.8-flash',
      name: 'Google Gemini 3.8 Flash',
      provider: 'gemini',
      verifiedFree: true,
      freeTierTerms: 'Google AI Studio Latest Generation Free Tier.',
      maxContextTokens: 1048576,
      rateLimitRpm: 15,
      rateLimitRpd: 1500,
      supportsJsonSchema: true,
    },
  ],
  groq: [
    {
      id: 'qwen/qwen3.8-27b',
      name: 'Qwen 3.8 27B (Groq Free LPU)',
      provider: 'groq',
      verifiedFree: true,
      freeTierTerms: 'Groq Cloud Free Tier: 30 RPM, 14,400 RPD. Ultra-fast LPU inference.',
      maxContextTokens: 128000,
      rateLimitRpm: 30,
      rateLimitRpd: 14400,
      supportsJsonSchema: true,
      notes: 'Verified live active model on Groq Cloud platform.',
    },
    {
      id: 'openai/gpt-oss-120b',
      name: 'GPT OSS 120B (Groq Free Tier)',
      provider: 'groq',
      verifiedFree: true,
      freeTierTerms: 'Groq Cloud Free Tier: High capacity open weights reasoning.',
      maxContextTokens: 128000,
      rateLimitRpm: 30,
      rateLimitRpd: 1000,
      supportsJsonSchema: true,
    },
    {
      id: 'openai/gpt-oss-20b',
      name: 'GPT OSS 20B (Groq Free Tier)',
      provider: 'groq',
      verifiedFree: true,
      freeTierTerms: 'Groq Cloud Free Tier: Fast compact open weights reasoning.',
      maxContextTokens: 128000,
      rateLimitRpm: 30,
      rateLimitRpd: 14400,
      supportsJsonSchema: true,
    },
  ],
  cloudflare: [
    {
      id: '@cf/meta/llama-3.1-8b-instruct',
      name: 'Cloudflare Workers AI Llama 3.1 8B',
      provider: 'cloudflare',
      verifiedFree: true,
      freeTierTerms: 'Cloudflare Workers AI Free Tier: 10,000 Neurons/day included across all Workers.',
      maxContextTokens: 8192,
      rateLimitRpm: 60,
      rateLimitRpd: 10000,
      supportsJsonSchema: false,
      notes: 'Zero external API key required when bound natively to Worker environment (env.AI).',
    },
    {
      id: '@cf/meta/llama-3-8b-instruct',
      name: 'Cloudflare Workers AI Llama 3 8B',
      provider: 'cloudflare',
      verifiedFree: true,
      freeTierTerms: 'Cloudflare Workers AI Free Tier: 10,000 Neurons/day.',
      maxContextTokens: 8192,
      rateLimitRpm: 60,
      rateLimitRpd: 10000,
      supportsJsonSchema: false,
    },
  ],
  openrouter: [
    {
      id: 'nvidia/nemotron-3.5-lightning:free',
      name: 'NVIDIA Nemotron 3.5 Lightning (OpenRouter Free)',
      provider: 'openrouter',
      verifiedFree: true,
      freeTierTerms: 'OpenRouter Free Model Catalog: Strict :free suffix model with $0 cost.',
      maxContextTokens: 128000,
      rateLimitRpm: 20,
      rateLimitRpd: 1000,
      supportsJsonSchema: true,
      notes: 'Verified live active free model with 0-cost endpoint.',
    },
    {
      id: 'google/gemma-4-31b-it:free',
      name: 'Google Gemma 4 31B (OpenRouter Free)',
      provider: 'openrouter',
      verifiedFree: true,
      freeTierTerms: 'OpenRouter Free Model Catalog.',
      maxContextTokens: 128000,
      rateLimitRpm: 20,
      rateLimitRpd: 500,
      supportsJsonSchema: true,
    },
    {
      id: 'liquid/lfm-2.5-2.6b:free',
      name: 'Liquid LFM 2.5 2.6B (OpenRouter Free)',
      provider: 'openrouter',
      verifiedFree: true,
      freeTierTerms: 'OpenRouter Free Model Catalog.',
      maxContextTokens: 32768,
      rateLimitRpm: 30,
      rateLimitRpd: 1000,
      supportsJsonSchema: true,
    },
  ],
};

/**
 * STRICT FREE-ONLY VERIFIER
 * Validates that an incoming model ID exists in the approved free-tier registry.
 * Rejects any unverified model to prevent paid fallback or accidental billing.
 */
export function isApprovedFreeModel(provider: AiProviderName, modelId: string): boolean {
  const models = VERIFIED_FREE_MODELS[provider] || [];
  return models.some((m) => m.id === modelId && m.verifiedFree);
}

export function getDefaultFreeModel(provider: AiProviderName): string {
  const models = VERIFIED_FREE_MODELS[provider];
  if (!models || models.length === 0) {
    throw new Error(`No verified free model registered for provider: ${provider}`);
  }
  return models[0].id;
}

