/**
 * HOPEPITOME FREE MODEL REGISTRY & ALLOWLIST
 * Strictly curated models with verified perpetual or quota-free tier access.
 * Rejects any model that introduces billing or accidental pay-per-token charges.
 */

import { AiProviderName, FreeModelDefinition } from './types';

export const VERIFIED_FREE_MODELS: Record<AiProviderName, FreeModelDefinition[]> = {
  gemini: [
    {
      id: 'gemini-1.5-flash',
      name: 'Google Gemini 1.5 Flash (Free Tier)',
      provider: 'gemini',
      verifiedFree: true,
      freeTierTerms: 'Google AI Studio Free Tier: 15 RPM, 1,500 RPD, 1M TPM. Free of charge.',
      maxContextTokens: 1048576,
      rateLimitRpm: 15,
      rateLimitRpd: 1500,
      supportsJsonSchema: true,
      notes: 'Ultra-fast, structured JSON response mode natively supported via response_mime_type.',
    },
    {
      id: 'gemini-1.5-flash-8b',
      name: 'Google Gemini 1.5 Flash-8B (Free Tier)',
      provider: 'gemini',
      verifiedFree: true,
      freeTierTerms: 'Google AI Studio Free Tier: High throughput lightweight model.',
      maxContextTokens: 1048576,
      rateLimitRpm: 15,
      rateLimitRpd: 1500,
      supportsJsonSchema: true,
      notes: 'Lightweight sub-variant with identical structured output support.',
    },
  ],
  groq: [
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B Versatile (Groq Free Tier)',
      provider: 'groq',
      verifiedFree: true,
      freeTierTerms: 'Groq Cloud Free Tier: 30 RPM, 1,000 RPD, 6,000 TPM. Free LPU inference.',
      maxContextTokens: 128000,
      rateLimitRpm: 30,
      rateLimitRpd: 1000,
      supportsJsonSchema: true,
      notes: 'High-intelligence reasoning on Groq LPU with JSON mode.',
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B Instant (Groq Free Tier)',
      provider: 'groq',
      verifiedFree: true,
      freeTierTerms: 'Groq Cloud Free Tier: 30 RPM, 14,400 RPD, 20,000 TPM.',
      maxContextTokens: 128000,
      rateLimitRpm: 30,
      rateLimitRpd: 14400,
      supportsJsonSchema: true,
      notes: 'Sub-second latency fallback when 70B reaches rate limits.',
    },
    {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B (Groq Free Tier)',
      provider: 'groq',
      verifiedFree: true,
      freeTierTerms: 'Groq Cloud Free Tier: 30 RPM, 14,400 RPD.',
      maxContextTokens: 32768,
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
      id: 'meta-llama/llama-3.3-70b-instruct:free',
      name: 'Llama 3.3 70B Instruct (OpenRouter Free)',
      provider: 'openrouter',
      verifiedFree: true,
      freeTierTerms: 'OpenRouter Free Model Catalog: Strict :free suffix model with $0 cost.',
      maxContextTokens: 128000,
      rateLimitRpm: 20,
      rateLimitRpd: 200,
      supportsJsonSchema: true,
      notes: 'Guaranteed 0-cost endpoint flagged with :free tag.',
    },
    {
      id: 'meta-llama/llama-3.1-8b-instruct:free',
      name: 'Llama 3.1 8B Instruct (OpenRouter Free)',
      provider: 'openrouter',
      verifiedFree: true,
      freeTierTerms: 'OpenRouter Free Model Catalog: Strict :free suffix model with $0 cost.',
      maxContextTokens: 128000,
      rateLimitRpm: 20,
      rateLimitRpd: 500,
      supportsJsonSchema: true,
    },
    {
      id: 'google/gemini-2.0-flash-exp:free',
      name: 'Gemini 2.0 Flash Experimental (OpenRouter Free)',
      provider: 'openrouter',
      verifiedFree: true,
      freeTierTerms: 'OpenRouter Free Model Catalog: Experimental free tier.',
      maxContextTokens: 1048576,
      rateLimitRpm: 10,
      rateLimitRpd: 200,
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

