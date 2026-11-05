/**
 * HOPEPITOME SINGLE AI MODEL REGISTRY
 * Exclusively configured for OpenAI GPT-6 Luna ('gpt-6-luna').
 * All other models, secondary chains, and fallback providers are strictly decommissioned.
 */

import { OpenAiModelDefinition } from './types';

export const ACTIVE_AI_MODEL: OpenAiModelDefinition = {
  id: 'gpt-6-luna',
  name: 'OpenAI GPT-6 Luna',
  provider: 'openai',
  apiEndpoint: 'https://api.openai.com/v1/responses',
  contextWindowTokens: 128000,
  maxOutputTokens: 4096,
  inputPricingPer1M: 0.15, // $0.15 per 1,000,000 input tokens
  outputPricingPer1M: 0.60, // $0.60 per 1,000,000 output tokens
};

/**
 * Calculates estimated API expenditure in USD for GPT-6 Luna inference.
 */
export function calculateGpt6LunaCost(inputTokens: number, outputTokens: number): number {
  const inCost = (inputTokens / 1_000_000) * ACTIVE_AI_MODEL.inputPricingPer1M;
  const outCost = (outputTokens / 1_000_000) * ACTIVE_AI_MODEL.outputPricingPer1M;
  return Number((inCost + outCost).toFixed(6));
}

export function isApprovedModel(modelId: string): boolean {
  return modelId === ACTIVE_AI_MODEL.id;
}
