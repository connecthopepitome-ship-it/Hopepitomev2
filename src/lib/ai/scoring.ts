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

import {
  AtsAssessmentResult,
  AtsCategoryEvaluation,
  AtsCategoryKey,
  SanitizedResumeInput,
  AiProviderName,
  PublicAtsAuditResult,
  PublicAtsCategoryItem,
  LockedImprovementCard,
  RecommendedServiceItem,
} from './types';

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

/**
 * PUBLIC AUDIT TRANSFORMER (FREE TIER VS LOCKED ENFORCEMENT)
 * Strips all proprietary recommendations, missing keywords, and evidence points from
 * public responses to strictly enforce conversion gating on the backend.
 */
export function transformToPublicAtsAudit(
  assessment: AtsAssessmentResult,
  jobDescription?: string
): PublicAtsAuditResult {
  const categories: PublicAtsCategoryItem[] = assessment.categories.map((c) => ({
    category: c.category,
    title: c.title,
    weight: c.weight,
    rawScore: c.rawScore,
    weightedScore: c.weightedScore,
    status: c.status,
  }));

  // Interpretation label
  let interpretation: PublicAtsAuditResult['interpretation'] = 'Needs Improvement';
  if (assessment.overallScore >= 85) {
    interpretation = 'Excellent';
  } else if (assessment.overallScore >= 70) {
    interpretation = 'Good';
  } else if (assessment.overallScore >= 50) {
    interpretation = 'Fair / Needs Attention';
  }

  // Extract short strength titles (titles only, no deep details)
  const strengthTitles = (assessment.topStrengths || [])
    .map((s) => {
      const parts = s.split(/[:–—\-]/);
      return parts[0].trim().substring(0, 60);
    })
    .filter(Boolean)
    .slice(0, 4);

  if (strengthTitles.length === 0) {
    strengthTitles.push('Clear Chronological Layout', 'Standard Section Headers');
  }

  // Pre-configured teaser metadata for locked insight cards
  const categoryTeaserMap: Record<
    AtsCategoryKey,
    {
      title: string;
      teaserSubtitle: string;
      teaserBullets: string[];
      serviceCode: string;
      serviceName: string;
      priceInr: number;
      reason: string;
    }
  > = {
    STRUCTURE_READABILITY: {
      title: 'Resume Structure & Hierarchy',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Which sections fail automated recruiter skimming scans',
        'How to re-order your career trajectory for maximum visual impact',
        'Executive section headers that prevent enterprise portal parsing drop-offs',
      ],
      serviceCode: 'ATS_OPTIMISATION',
      serviceName: 'ATS Resume Optimisation',
      priceInr: 1999,
      reason: 'Standardise layout hierarchy and eliminate structure parsing bottlenecks.',
    },
    PROFESSIONAL_SUMMARY: {
      title: 'Professional Summary & Positioning',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'What critical value proposition is missing from your opening hook',
        'How to align your summary with your target executive trajectory',
        'Tailored 3-sentence elevator pitch rewrite blueprint',
      ],
      serviceCode: 'RESUME_WRITING',
      serviceName: 'Professional Resume Writing',
      priceInr: 2499,
      reason: 'Craft an irresistible executive elevator pitch tailored to hiring decision-makers.',
    },
    SKILLS_RELEVANCE: {
      title: 'Role-Specific Keywords & Competencies',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Exact high-frequency industry keywords missing from your profile',
        'How to structure core competencies for 90%+ keyword density match',
        'Categorized skills breakdown tailored to target job descriptions',
      ],
      serviceCode: 'ATS_OPTIMISATION',
      serviceName: 'ATS Resume Optimisation',
      priceInr: 1999,
      reason: 'Inject target industry keywords to bypass algorithmic applicant filters.',
    },
    EXPERIENCE_ACHIEVEMENTS: {
      title: 'Achievement Statements & Impact Metrics',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Which experience statements lack quantifiable business impact',
        'How to convert task descriptions into high-value accomplishment bullets',
        'C-A-R (Context, Action, Result) phrasing rewrites for your major projects',
      ],
      serviceCode: 'RESUME_WRITING',
      serviceName: 'Professional Resume Writing',
      priceInr: 2499,
      reason: 'Transform day-to-day duties into high-impact revenue and efficiency metrics.',
    },
    EDUCATION_CERTIFICATIONS: {
      title: 'Education & Credential Positioning',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'How to spotlight continuing education and accredited credentials',
        'Placement optimizations to prevent education from overshadowing achievements',
        'Recommended professional accreditations for your target role',
      ],
      serviceCode: 'RESUME_WRITING',
      serviceName: 'Professional Resume Writing',
      priceInr: 2499,
      reason: 'Properly frame academic foundations and highlight professional credentials.',
    },
    FORMATTING_COMPATIBILITY: {
      title: 'ATS Formatting & Parsing Stability',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Hidden formatting errors that cause automated parsing to fail',
        'Table, column, and margin bugs that scramble data in enterprise portals',
        'Single-column ATS-certified Word and PDF layout template',
      ],
      serviceCode: 'ATS_OPTIMISATION',
      serviceName: 'ATS Resume Optimisation',
      priceInr: 1999,
      reason: 'Ensure 100% parse-compliance across Workday, Taleo, and Greenhouse.',
    },
    CONTACT_COMPLETENESS: {
      title: 'Contact Details & Profile Presence',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Optimized contact header format compliant with privacy & ATS standards',
        'Custom LinkedIn URL vanity slug and portfolio link formatting',
        'Location and telephone formatting standards for international recruiters',
      ],
      serviceCode: 'LINKEDIN_MAKEOVER',
      serviceName: 'LinkedIn Profile Makeover',
      priceInr: 2999,
      reason: 'Unify your contact presence and elevate your digital recruiter footprint.',
    },
  };

  // Build locked improvement cards for categories needing work (sorted by weakest rawScore first)
  const sortedCategories = [...assessment.categories].sort((a, b) => a.rawScore - b.rawScore);
  const improvementAreas: LockedImprovementCard[] = [];

  for (const cat of sortedCategories) {
    if (cat.rawScore < 85) {
      const teaser = categoryTeaserMap[cat.category];
      if (teaser) {
        improvementAreas.push({
          id: `imp_${cat.category.toLowerCase()}`,
          category: cat.category,
          title: teaser.title,
          teaserSubtitle: teaser.teaserSubtitle,
          teaserBullets: teaser.teaserBullets,
          recommendedServiceCode: teaser.serviceCode,
          recommendedServiceName: teaser.serviceName,
          servicePriceInr: teaser.priceInr,
          reason: teaser.reason,
        });
      }
    }
  }

  // If candidate scored high across all, still provide top 2 enhancement blueprints
  if (improvementAreas.length === 0) {
    const top2 = sortedCategories.slice(0, 2);
    for (const cat of top2) {
      const teaser = categoryTeaserMap[cat.category];
      if (teaser) {
        improvementAreas.push({
          id: `imp_${cat.category.toLowerCase()}`,
          category: cat.category,
          title: teaser.title,
          teaserSubtitle: teaser.teaserSubtitle,
          teaserBullets: teaser.teaserBullets,
          recommendedServiceCode: teaser.serviceCode,
          recommendedServiceName: teaser.serviceName,
          servicePriceInr: teaser.priceInr,
          reason: teaser.reason,
        });
      }
    }
  }

  // Determine Primary & Secondary Recommended Services based on actual weakest categories
  const weakest = sortedCategories[0]?.category;
  let primaryService: RecommendedServiceItem = {
    code: 'ATS_OPTIMISATION',
    name: 'ATS Resume Optimisation',
    priceInr: 1999,
    tagline: 'Algorithmic keyword optimization ensuring 90%+ parse scores across Workday, Taleo, and Greenhouse.',
    addressedAreas: ['ATS Layout & Tables', 'Keyword Frequency Injection', 'Parse Verification'],
    isPrimary: true,
  };

  let secondaryService: RecommendedServiceItem = {
    code: 'RESUME_WRITING',
    name: 'Professional Resume Writing',
    priceInr: 2499,
    tagline: 'Executive-level resume writing tailored for leadership and international placement.',
    addressedAreas: ['Accomplishment Metric Phrasing', 'Executive Elevator Pitch', 'C-A-R Bullets'],
    isPrimary: false,
  };

  if (weakest === 'EXPERIENCE_ACHIEVEMENTS' || weakest === 'PROFESSIONAL_SUMMARY') {
    primaryService = {
      code: 'RESUME_WRITING',
      name: 'Professional Resume Writing',
      priceInr: 2499,
      tagline: 'Executive-level resume writing tailored for leadership and international placement.',
      addressedAreas: ['Accomplishment Metric Phrasing', 'Executive Elevator Pitch', 'C-A-R Bullets'],
      isPrimary: true,
    };
    secondaryService = {
      code: 'ATS_OPTIMISATION',
      name: 'ATS Resume Optimisation',
      priceInr: 1999,
      tagline: 'Algorithmic keyword optimization ensuring 90%+ parse scores across Workday, Taleo, and Greenhouse.',
      addressedAreas: ['ATS Layout & Tables', 'Keyword Frequency Injection', 'Parse Verification'],
      isPrimary: false,
    };
  } else if (weakest === 'CONTACT_COMPLETENESS') {
    secondaryService = {
      code: 'LINKEDIN_MAKEOVER',
      name: 'LinkedIn Profile Makeover',
      priceInr: 2999,
      tagline: 'Transform your LinkedIn profile into a recruiter magnet with SEO headlines and storytelling About section.',
      addressedAreas: ['LinkedIn Headline & Story', 'Recruiter Search Discoverability', 'Featured Assets'],
      isPrimary: false,
    };
  }

  // Job Match calculation if jobDescription provided
  const hasJobDescription = Boolean(jobDescription && jobDescription.trim().length > 30);
  let jobMatchScore: number | undefined;
  let jobMatchKeywordSummary: PublicAtsAuditResult['jobMatchKeywordSummary'] | undefined;

  if (hasJobDescription) {
    const matchedCount = assessment.matchedKeywords.length;
    const missingCount = assessment.missingKeywords.length;
    const totalKeywords = Math.max(1, matchedCount + missingCount);
    jobMatchScore = Math.min(95, Math.max(35, Math.round((matchedCount / totalKeywords) * 100)));
    jobMatchKeywordSummary = {
      matchedCount,
      sampleKeywords: assessment.matchedKeywords.slice(0, 5),
    };
  }

  return {
    assessmentId: assessment.assessmentId,
    timestamp: assessment.timestamp,
    targetRole: assessment.targetRole,
    targetIndustry: assessment.targetIndustry,
    overallScore: assessment.overallScore,
    grade: assessment.grade,
    interpretation,
    summary: assessment.summary,
    hasJobDescription,
    jobMatchScore,
    jobMatchKeywordSummary,
    categories,
    strengthTitles,
    improvementAreas: improvementAreas.slice(0, 5),
    recommendedServices: [primaryService, secondaryService],
    isLocked: true,
  };
}


