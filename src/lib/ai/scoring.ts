/**
 * ATS SCORING PROMPT & DETERMINISTIC ENGINE (7-CATEGORY SPECIFICATION)
 * Evaluates candidate resumes across exactly 7 standardized dimensions:
 * 1. Resume Structure & Readability (Weight: 15%)
 * 2. Professional Summary (Weight: 10%)
 * 3. Skills & Keyword Relevance (Weight: 20%)
 * 4. Work Experience & Achievements (Weight: 20%)
 * 5. Education & Certifications (Weight: 10%)
 * 6. Formatting & ATS Parsing Compatibility (Weight: 15%)
 * 7. Contact Details & Completeness (Weight: 10%)
 * Total Weight = 100%
 */

import { AtsAssessmentResult, AtsCategoryEvaluation, AtsCategoryKey, SanitizedResumeInput, AiProviderName } from './types';

export const ATS_CATEGORY_WEIGHTS: Record<AtsCategoryKey, { title: string; weight: number }> = {
  STRUCTURE_READABILITY: { title: 'Resume Structure & Readability', weight: 15 },
  PROFESSIONAL_SUMMARY: { title: 'Professional Summary', weight: 10 },
  SKILLS_RELEVANCE: { title: 'Skills & Keyword Relevance', weight: 20 },
  EXPERIENCE_ACHIEVEMENTS: { title: 'Work Experience & Achievements', weight: 20 },
  EDUCATION_CERTIFICATIONS: { title: 'Education & Certifications', weight: 10 },
  FORMATTING_COMPATIBILITY: { title: 'Formatting & ATS Parsing Compatibility', weight: 15 },
  CONTACT_COMPLETENESS: { title: 'Contact Details & Completeness', weight: 10 },
};

export function buildAtsPrompt(input: SanitizedResumeInput): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are the Hopepitome Enterprise ATS Resume Parsing & Scoring Engine.
You audit professional resumes objectively against global Fortune 500 ATS benchmark rules (Workday, Taleo, Greenhouse, Lever, SAP SuccessFactors).

CRITICAL INSTRUCTIONS:
1. Output MUST be strictly valid raw JSON with NO markdown code fences (no \`\`\`json).
2. Rate the resume honestly across exactly 7 categories (raw score 0-100 each):
   - STRUCTURE_READABILITY (Weight: 15%): Logical flow, clear sections, bullet hierarchy, executive readability.
   - PROFESSIONAL_SUMMARY (Weight: 10%): Value proposition, elevator pitch strength, alignment with target trajectory.
   - SKILLS_RELEVANCE (Weight: 20%): Hard technical skills, domain tools, target role alignment for "${input.targetRole}".
   - EXPERIENCE_ACHIEVEMENTS (Weight: 20%): Quantifiable business impact, metrics, %, volume, action verbs.
   - EDUCATION_CERTIFICATIONS (Weight: 10%): Degree foundations, accredited credentials, continuing education.
   - FORMATTING_COMPATIBILITY (Weight: 15%): Standard header conventions, parse-safe fonts/tables, layout stability.
   - CONTACT_COMPLETENESS (Weight: 10%): Presence of essential profile elements (location, professional links, clear headers).
3. For each category provide 2-3 genuine evidence points from the text, missing elements, and actionable recommendations.
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
      "category": "STRUCTURE_READABILITY",
      "rawScore": 85,
      "evidencePoints": ["Clear section headings"],
      "missingElements": [],
      "recommendations": ["Optimize bullet hierarchy"]
    },
    {
      "category": "PROFESSIONAL_SUMMARY",
      "rawScore": 75,
      "evidencePoints": ["Concise opening summary"],
      "missingElements": ["Missing target title"],
      "recommendations": ["Tailor opening pitch"]
    },
    {
      "category": "SKILLS_RELEVANCE",
      "rawScore": 80,
      "evidencePoints": ["Relevant domain tools"],
      "missingElements": ["Missing niche tech"],
      "recommendations": ["Highlight specialized frameworks"]
    },
    {
      "category": "EXPERIENCE_ACHIEVEMENTS",
      "rawScore": 70,
      "evidencePoints": ["Included metrics"],
      "missingElements": ["More revenue figures needed"],
      "recommendations": ["Inject metric density"]
    },
    {
      "category": "EDUCATION_CERTIFICATIONS",
      "rawScore": 85,
      "evidencePoints": ["Accredited degree"],
      "missingElements": [],
      "recommendations": ["Add recent certifications"]
    },
    {
      "category": "FORMATTING_COMPATIBILITY",
      "rawScore": 90,
      "evidencePoints": ["Clean ATS margins"],
      "missingElements": [],
      "recommendations": ["Avoid multi-column tables"]
    },
    {
      "category": "CONTACT_COMPLETENESS",
      "rawScore": 95,
      "evidencePoints": ["Complete header presence"],
      "missingElements": [],
      "recommendations": ["Ensure portfolio links are active"]
    }
  ]
}`;

  return { systemPrompt, userPrompt };
}

/**
 * DETERMINISTIC SCORE CALCULATOR & SANITIZER (7-CATEGORY SPECIFICATION)
 * Computes exact weighted grade and validates category scores server-side.
 * Formula: Sum of (rawScore * categoryWeight) / 100
 */
export function calculateDeterministicAtsScore(
  rawModelOutput: any,
  input: SanitizedResumeInput,
  assessmentId: string,
  providerAudit: AtsAssessmentResult['providerAudit']
): AtsAssessmentResult {
  const parsedCategories: AtsCategoryEvaluation[] = [];
  const modelCategories = Array.isArray(rawModelOutput?.categories) ? rawModelOutput.categories : [];

  for (const [key, meta] of Object.entries(ATS_CATEGORY_WEIGHTS)) {
    const found = modelCategories.find((c: any) => c?.category === key);
    let rawScore = 70; // Safe default median
    if (typeof found?.rawScore === 'number' && !isNaN(found.rawScore)) {
      rawScore = Math.max(10, Math.min(100, Math.round(found.rawScore)));
    }

    const weightedScore = Math.round((rawScore * meta.weight) / 100);
    const status: AtsCategoryEvaluation['status'] =
      rawScore >= 85 ? 'EXCELLENT' : rawScore >= 70 ? 'GOOD' : rawScore >= 50 ? 'NEEDS_WORK' : 'CRITICAL';

    parsedCategories.push({
      category: key as AtsCategoryKey,
      title: meta.title,
      weight: meta.weight,
      rawScore,
      weightedScore,
      status,
      evidencePoints: Array.isArray(found?.evidencePoints) && found.evidencePoints.length > 0
        ? found.evidencePoints.map(String)
        : ['Standard career trajectory and formatting analyzed.'],
      missingElements: Array.isArray(found?.missingElements) ? found.missingElements.map(String) : [],
      recommendations: Array.isArray(found?.recommendations) && found.recommendations.length > 0
        ? found.recommendations.map(String)
        : ['Enhance phrasing and align with industry benchmarks.'],
    });
  }

  // Calculate final deterministic overall score across all 7 categories
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
    summary: String(rawModelOutput?.summary || `Assessment completed for ${input.targetRole} role with an overall score of ${overallScore}/100 across 7 standard ATS categories.`),
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

