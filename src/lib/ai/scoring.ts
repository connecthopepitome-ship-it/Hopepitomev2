/**
 * ATS SCORING PROMPT & DETERMINISTIC ENGINE
 * Evaluates candidate resumes across 5 core dimensions with strict mathematical scoring.
 * Prevents hallucinations by calculating the final score server-side from audited evidence.
 */

import { AtsAssessmentResult, AtsCategoryEvaluation, SanitizedResumeInput, AiProviderName } from './types';

export const ATS_CATEGORY_WEIGHTS = {
  IMPACT_METRICS: 25,
  ATS_FORMATTING: 20,
  KEYWORD_ALIGNMENT: 25,
  BREVITY_STRUCTURE: 15,
  SKILLS_CREDENTIALS: 15,
} as const;

export function buildAtsPrompt(input: SanitizedResumeInput): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are the Hopepitome Enterprise ATS Resume Parsing & Scoring Engine.
You audit professional resumes objectively against global Fortune 500 ATS benchmark rules (Workday, Taleo, Greenhouse, Lever, SAP SuccessFactors).

CRITICAL INSTRUCTIONS:
1. Output MUST be strictly valid raw JSON with NO markdown code fences (no \`\`\`json).
2. Rate the resume honestly across exactly 5 categories (raw score 0-100 each):
   - IMPACT_METRICS (Weight: 25%): Quantifiable business results, % improvements, revenue/cost metrics, volume.
   - ATS_FORMATTING (Weight: 20%): Standard hierarchy, parse-safe structure, clean chronology.
   - KEYWORD_ALIGNMENT (Weight: 25%): Relevancy to target role "${input.targetRole}" and industry "${input.targetIndustry}".
   - BREVITY_STRUCTURE (Weight: 15%): Bullet length, elimination of fluff/cliches, active verb usage.
   - SKILLS_CREDENTIALS (Weight: 15%): Hard skills, technical tools, relevant certifications, educational foundations.
3. For each category provide 2-3 genuine evidence points from the text, missing items, and actionable recommendations.
4. Extract 5-10 matched core keywords and 5-10 missing critical keywords for the target role.
5. Provide a 2-sentence executive summary.`;

  const userPrompt = `TARGET ROLE: ${input.targetRole}
TARGET INDUSTRY: ${input.targetIndustry}
${input.jobDescription ? `BENCHMARK JOB DESCRIPTION:\n${input.jobDescription}\n` : ''}

ANONYMIZED RESUME TEXT:
${input.anonymizedText}

REQUIRED JSON SCHEMA:
{
  "summary": "2-sentence executive review summary",
  "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "criticalGaps": ["Critical Gap 1", "Critical Gap 2"],
  "matchedKeywords": ["Key1", "Key2", "Key3"],
  "missingKeywords": ["MissingKey1", "MissingKey2"],
  "categories": [
    {
      "category": "IMPACT_METRICS",
      "rawScore": 75,
      "evidencePoints": ["Extracted metric 1", "Extracted metric 2"],
      "missingElements": ["Missing item 1"],
      "recommendations": ["Actionable recommendation 1"]
    },
    {
      "category": "ATS_FORMATTING",
      "rawScore": 85,
      "evidencePoints": ["Clean heading hierarchy"],
      "missingElements": [],
      "recommendations": ["Recommendation"]
    },
    {
      "category": "KEYWORD_ALIGNMENT",
      "rawScore": 70,
      "evidencePoints": ["Found relevant skills"],
      "missingElements": ["Missing target framework"],
      "recommendations": ["Inject target industry terminology"]
    },
    {
      "category": "BREVITY_STRUCTURE",
      "rawScore": 80,
      "evidencePoints": ["Punchy bullet phrasing"],
      "missingElements": [],
      "recommendations": ["Shorten summary"]
    },
    {
      "category": "SKILLS_CREDENTIALS",
      "rawScore": 75,
      "evidencePoints": ["Verified certifications"],
      "missingElements": ["Cloud certs missing"],
      "recommendations": ["Highlight domain tools"]
    }
  ]
}`;

  return { systemPrompt, userPrompt };
}

/**
 * DETERMINISTIC SCORE CALCULATOR & SANITIZER
 * Computes exact weighted grade and validates category scores server-side.
 * Formula: Sum of (rawScore * categoryWeight) / 100
 */
export function calculateDeterministicAtsScore(
  rawModelOutput: any,
  input: SanitizedResumeInput,
  assessmentId: string,
  providerAudit: AtsAssessmentResult['providerAudit']
): AtsAssessmentResult {
  const categoriesDef: Record<string, { title: string; weight: number }> = {
    IMPACT_METRICS: { title: 'Impact Phrasing & Business Metrics', weight: 25 },
    ATS_FORMATTING: { title: 'ATS Header & Layout Compliance', weight: 20 },
    KEYWORD_ALIGNMENT: { title: 'Target Role Keyword Alignment', weight: 25 },
    BREVITY_STRUCTURE: { title: 'Executive Brevity & Action Verbs', weight: 15 },
    SKILLS_CREDENTIALS: { title: 'Core Competencies & Credentials', weight: 15 },
  };

  const parsedCategories: AtsCategoryEvaluation[] = [];
  const modelCategories = Array.isArray(rawModelOutput?.categories) ? rawModelOutput.categories : [];

  for (const [key, meta] of Object.entries(categoriesDef)) {
    const found = modelCategories.find((c: any) => c?.category === key);
    let rawScore = 65; // Safe default median
    if (typeof found?.rawScore === 'number' && !isNaN(found.rawScore)) {
      rawScore = Math.max(10, Math.min(100, Math.round(found.rawScore)));
    }

    const weightedScore = Math.round((rawScore * meta.weight) / 100);
    const status: AtsCategoryEvaluation['status'] =
      rawScore >= 85 ? 'EXCELLENT' : rawScore >= 70 ? 'GOOD' : rawScore >= 50 ? 'NEEDS_WORK' : 'CRITICAL';

    parsedCategories.push({
      category: key as any,
      title: meta.title,
      weight: meta.weight,
      rawScore,
      weightedScore,
      status,
      evidencePoints: Array.isArray(found?.evidencePoints) && found.evidencePoints.length > 0
        ? found.evidencePoints.map(String)
        : ['Standard career accomplishments analyzed.'],
      missingElements: Array.isArray(found?.missingElements) ? found.missingElements.map(String) : [],
      recommendations: Array.isArray(found?.recommendations) && found.recommendations.length > 0
        ? found.recommendations.map(String)
        : ['Optimize bullet structure and enhance metric alignment.'],
    });
  }

  // Calculate final deterministic overall score
  const overallScore = parsedCategories.reduce((acc, cat) => acc + cat.weightedScore, 0);

  const grade: AtsAssessmentResult['grade'] =
    overallScore >= 90 ? 'A+' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : 'D';

  const wordCount = input.anonymizedText.split(/\s+/).filter(Boolean).length;

  return {
    assessmentId,
    timestamp: new Date().toISOString(),
    targetRole: input.targetRole || 'Professional Role',
    targetIndustry: input.targetIndustry,
    overallScore,
    grade,
    summary: String(rawModelOutput?.summary || `Assessment completed for ${input.targetRole} role with an overall score of ${overallScore}/100.`),
    topStrengths: Array.isArray(rawModelOutput?.topStrengths) && rawModelOutput.topStrengths.length > 0
      ? rawModelOutput.topStrengths.map(String)
      : ['Clear chronological work experience', 'Consistent professional formatting'],
    criticalGaps: Array.isArray(rawModelOutput?.criticalGaps) && rawModelOutput.criticalGaps.length > 0
      ? rawModelOutput.criticalGaps.map(String)
      : ['Enhance quantifiable achievements with numerical metrics', 'Inject industry-standard technical keywords'],
    categories: parsedCategories,
    matchedKeywords: Array.isArray(rawModelOutput?.matchedKeywords) ? rawModelOutput.matchedKeywords.map(String) : [],
    missingKeywords: Array.isArray(rawModelOutput?.missingKeywords) ? rawModelOutput.missingKeywords.map(String) : [],
    detectedWordCount: wordCount,
    providerAudit: {
      ...providerAudit,
      deterministicValidated: true,
    },
  };
}

