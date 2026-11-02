/**
 * UNIVERSAL INCLUSIVE ATS SCORING & CUSTOM-PRICING CONVERSION ENGINE
 * Evaluates candidate resumes fairly across all industries, professions, and career stages.
 *
 * Distinct Evaluation Dimensions:
 * 1. General Resume Quality Score (Completeness, clarity, impact, career story) - Independent of job
 * 2. ATS Compatibility Score (Text extraction, layout safety, header clarity) - Formatting & parsing
 * 3. Job Match Score (Optional: Semantic skill & seniority alignment) - ONLY when job description supplied
 *
 * 7 Standard Category Weights:
 * - Structure & Readability: 15%
 * - Professional Summary: 10%
 * - Skills & Keyword Relevance: 20%
 * - Work Experience & Achievements: 20%
 * - Education & Certifications: 10%
 * - ATS Formatting & Parsing Compatibility: 15%
 * - Contact Details & Completeness: 10%
 * Total = 100%
 */

import {
  AtsAssessmentResult,
  AtsCategoryEvaluation,
  AtsCategoryKey,
  SanitizedResumeInput,
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

/**
 * BESPOKE SERVICE QUOTATION MESSAGING CATALOGUE (PART B - SECTION 9 SPECIFICATION)
 * Strict zero-fixed-pricing policy. Every service is priced based on bespoke requirements.
 */
export const BESPOKE_SERVICE_CATALOGUE: Record<
  string,
  {
    code: string;
    name: string;
    quoteMessage: string;
    ctaText: string;
    tagline: string;
  }
> = {
  RESUME_WRITING: {
    code: 'RESUME_WRITING',
    name: 'Professional Resume Writing',
    quoteMessage:
      'Every professional journey is different. We review your experience, career goals and resume requirements before preparing a customised quotation.',
    ctaText: 'Request a Custom Quote',
    tagline: 'Tailored executive narrative, achievement framing, and strategic career storytelling.',
  },
  ATS_OPTIMISATION: {
    code: 'ATS_OPTIMISATION',
    name: 'ATS Resume Optimisation',
    quoteMessage:
      'Get your resume reviewed and improved based on its structure, content, target role and optimisation requirements.',
    ctaText: 'Get a Custom Quote',
    tagline: 'Algorithmic structure refinement, parse validation, and keyword alignment across enterprise ATS platforms.',
  },
  LINKEDIN_MAKEOVER: {
    code: 'LINKEDIN_MAKEOVER',
    name: 'LinkedIn Profile Makeover',
    quoteMessage:
      'Your LinkedIn profile requirements depend on your experience, industry and career goals. Let’s understand your needs first.',
    ctaText: 'Request a Consultation',
    tagline: 'Recruiter discoverability, compelling About narrative, and professional digital positioning.',
  },
  MANAGED_JOB_SEARCH: {
    code: 'MANAGED_JOB_SEARCH',
    name: 'Managed Job Search & Applications',
    quoteMessage:
      'Your job-search requirements are unique. We discuss your target roles, application goals and support requirements before proposing a service plan.',
    ctaText: 'Discuss My Requirements',
    tagline: 'End-to-end application management, curated role targeting, and recruiter outreach support.',
  },
  PORTFOLIO_WEBSITE: {
    code: 'PORTFOLIO_WEBSITE',
    name: 'Personal Portfolio Websites',
    quoteMessage:
      'Portfolio scope depends on your profession, content, design expectations and functionality requirements.',
    ctaText: 'Discuss My Project',
    tagline: 'Custom high-performance web portfolio highlighting your casework, projects, and credentials.',
  },
};

/**
 * Builds universal, inclusive AI scanning prompt.
 * Replaces narrow keyword matching with semantic classification across all industries.
 */
export function buildAtsPrompt(input: SanitizedResumeInput): { systemPrompt: string; userPrompt: string } {
  const hasJobDescription = Boolean(input.jobDescription && input.jobDescription.trim().length >= 30);

  const systemPrompt = `You are the Hopepitome Universal ATS Resume Intelligence & Career Evaluation Engine.
You audit resumes objectively, fairly, and inclusively across ALL professions, industries, and career stages.

CRITICAL EVALUATION PRINCIPLES:
1. UNIVERSAL PROFESSIONAL INCLUSION:
   - Resumes originate from IT, engineering, manufacturing, healthcare, finance, logistics, education, sales, marketing, hospitality, retail, creative, consulting, research, and public administration.
   - Do NOT assume all resumes follow tech or corporate norms.
   - If target role or industry is unspecified, infer the candidate's professional domain and primary role from their content. Do NOT penalize for an unspecified target.

2. CAREER-STAGE-AWARE FAIRNESS:
   - Identify candidate career stage: Student / Graduate | Entry-level | Early career | Mid-career | Experienced professional | Senior professional | Manager / Leadership | Executive | Career changer.
   - Adapt evaluation standards:
     * Graduates & Entry-Level: Evaluate projects, academic foundations, internships, coursework, and volunteer leadership. Do NOT penalize for lacking 5+ years of corporate employment.
     * Mid/Experienced: Evaluate domain competencies, project execution, and career momentum.
     * Senior/Executive: Evaluate leadership, strategic impact, team mentorship, and organizational scope.
     * Career Changers & Gaps: Evaluate transferable skills and functional competencies. Never assume a career gap indicates poor quality.

3. ACHIEVEMENT COMMUNICATION:
   - Value qualitative achievements (process improvements, patient care outcomes, client satisfaction, curriculum delivery, team reliability) equally alongside numerical KPIs.
   - Do not demand revenue metrics from professions where revenue is irrelevant (e.g., nurses, teachers, researchers, administrators).

4. THREE DISTINCT EVALUATION SCORES:
   A. General Resume Quality Score (0-100): Completeness, clarity, presentation, experience communication, skills, and structure. Independent of any specific job.
   B. ATS Compatibility Score (0-100): Layout stability, heading recognition, reading order, and parsability. Do NOT penalize clean tables or design elements unless they actually scramble text extraction.
   C. Job Match Score (0-100): ONLY evaluate if a benchmark Job Description is provided. Compare required vs transferable skills semantically. If no Job Description is provided, set jobMatch to null.

5. OUTPUT FORMAT:
   - Output MUST be valid raw JSON only. Do NOT include markdown code fences (\`\`\`json).`;

  const userPrompt = `CANDIDATE CONTEXT:
- Provided Target Role: ${input.targetRole && input.targetRole !== 'Professional Role' ? input.targetRole : 'Infer from resume'}
- Provided Target Industry: ${input.targetIndustry && input.targetIndustry !== 'Corporate / Technology' ? input.targetIndustry : 'Infer from resume'}
${hasJobDescription ? `- Benchmark Job Description:\n${input.jobDescription}\n` : '- Benchmark Job Description: None provided (Perform generic resume quality audit without job match penalty)'}

RESUME TEXT:
${input.anonymizedText}

REQUIRED JSON STRUCTURE:
{
  "inferredDomain": "Primary industry or professional sector (e.g. Healthcare, Software, Supply Chain)",
  "careerStage": "One of: Student / Graduate | Entry-level | Early career | Mid-career | Experienced professional | Senior professional | Manager / Leadership | Executive | Career changer",
  "inferredRole": "Identified primary profession or candidate title",
  "summary": "2-3 sentence executive summary of resume strengths and professional trajectory",
  "generalQualityScore": 82,
  "atsCompatibilityScore": 88,
  "jobMatch": ${
    hasJobDescription
      ? `{
    "score": 78,
    "requiredSkillsFound": ["Skill A", "Skill B"],
    "transferableSkillsFound": ["Skill C", "Skill D"],
    "requiredSkillsNotEvidenced": ["Skill E"],
    "preferredSkillsFound": ["Skill F"],
    "experienceAlignmentSummary": "Brief semantic alignment evaluation"
  }`
      : 'null'
  },
  "topStrengths": [
    "Strength 1: Concise title with verified evidence",
    "Strength 2: Concise title with verified evidence",
    "Strength 3: Concise title with verified evidence"
  ],
  "criticalGaps": [
    "Opportunity 1: Actionable improvement area",
    "Opportunity 2: Actionable improvement area"
  ],
  "matchedKeywords": ["Keyword1", "Keyword2", "Keyword3"],
  "missingKeywords": ["OptionalKeyword1", "OptionalKeyword2"],
  "categories": [
    {
      "category": "STRUCTURE_READABILITY",
      "rawScore": 85,
      "confidence": "HIGH",
      "evidencePoints": ["Clear section headings", "Readable bullet formatting"],
      "missingElements": [],
      "rationale": "Clear hierarchy and logical ordering facilitate rapid human review and automated indexing.",
      "recommendations": ["Enhance visual separation between previous employers"]
    },
    {
      "category": "PROFESSIONAL_SUMMARY",
      "rawScore": 80,
      "confidence": "HIGH",
      "evidencePoints": ["Clear statement of career focus"],
      "missingElements": [],
      "rationale": "Opening overview articulates core value proposition and career level.",
      "recommendations": ["Sharpen the opening sentence to highlight primary specialization"]
    },
    {
      "category": "SKILLS_RELEVANCE",
      "rawScore": 80,
      "confidence": "HIGH",
      "evidencePoints": ["Relevant domain tools and methodologies cited"],
      "missingElements": [],
      "rationale": "Core competencies reflect modern practices appropriate to this discipline.",
      "recommendations": ["Group skills into logical sub-categories"]
    },
    {
      "category": "EXPERIENCE_ACHIEVEMENTS",
      "rawScore": 75,
      "confidence": "HIGH",
      "evidencePoints": ["Clear responsibilities and key projects described"],
      "missingElements": [],
      "rationale": "Work experience demonstrates meaningful contribution and functional progression.",
      "recommendations": ["Highlight the direct outcome or stakeholder benefit of major responsibilities"]
    },
    {
      "category": "EDUCATION_CERTIFICATIONS",
      "rawScore": 85,
      "confidence": "HIGH",
      "evidencePoints": ["Relevant educational background and training noted"],
      "missingElements": [],
      "rationale": "Academic foundations and continuous learning are clearly positioned.",
      "recommendations": ["Include dates or awarding institutions where helpful"]
    },
    {
      "category": "FORMATTING_COMPATIBILITY",
      "rawScore": 85,
      "confidence": "HIGH",
      "evidencePoints": ["Standard chronological layout", "Clean text flow"],
      "missingElements": [],
      "rationale": "Standard fonts and clear hierarchy ensure seamless text extraction across parsers.",
      "recommendations": ["Maintain consistent date and location alignment"]
    },
    {
      "category": "CONTACT_COMPLETENESS",
      "rawScore": 90,
      "confidence": "HIGH",
      "evidencePoints": ["Professional contact identifiers present"],
      "missingElements": [],
      "rationale": "Essential communication details are accessible in the primary header.",
      "recommendations": ["Add customized LinkedIn or professional portfolio URL if available"]
    }
  ]
}`;

  return { systemPrompt, userPrompt };
}

/**
 * DETERMINISTIC SCORE CALCULATOR & SANITIZER
 * Computes exact weighted scores across the 7 agreed categories:
 * - Structure & Readability (15%)
 * - Professional Summary (10%)
 * - Skills & Keyword Relevance (20%)
 * - Work Experience & Achievements (20%)
 * - Education & Certifications (10%)
 * - ATS Formatting & Parsing Compatibility (15%)
 * - Contact Details & Completeness (10%)
 *
 * Separates General Quality, ATS Compatibility, and Job Match scores.
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
    let rawScore = 75; // Fair, calibrated default median for unpenalized profiles
    if (typeof found?.rawScore === 'number' && !isNaN(found.rawScore)) {
      // Clamp between 20 and 100 to avoid artificially zeroing candidates
      rawScore = Math.max(20, Math.min(100, Math.round(found.rawScore)));
    }

    const weightedScore = Math.round((rawScore * meta.weight) / 100);
    const status: AtsCategoryEvaluation['status'] =
      rawScore >= 85 ? 'EXCELLENT' : rawScore >= 70 ? 'GOOD' : rawScore >= 50 ? 'NEEDS_WORK' : 'CRITICAL';

    const confidence: AtsCategoryEvaluation['confidence'] =
      found?.confidence === 'LOW' || found?.confidence === 'MEDIUM' ? found.confidence : 'HIGH';

    parsedCategories.push({
      category: key as AtsCategoryKey,
      title: meta.title,
      weight: meta.weight,
      rawScore,
      weightedScore,
      status,
      confidence,
      rationale: String(found?.rationale || `Evaluation completed for ${meta.title}.`),
      evidencePoints:
        Array.isArray(found?.evidencePoints) && found.evidencePoints.length > 0
          ? found.evidencePoints.map(String)
          : Array.isArray(found?.evidenceFound) && found.evidenceFound.length > 0
          ? found.evidenceFound.map(String)
          : ['Professional documentation and structural flow evaluated.'],
      missingElements:
        Array.isArray(found?.missingElements) && found.missingElements.length > 0
          ? found.missingElements.map(String)
          : Array.isArray(found?.missingOrUnclear)
          ? found.missingOrUnclear.map(String)
          : [],
      recommendations:
        Array.isArray(found?.recommendations) && found.recommendations.length > 0
          ? found.recommendations.map(String)
          : ['Optimize phrasing and align presentation with industry best practices.'],
    });
  }

  // 1. Overall Score across 7 categories
  const overallScore = Math.min(100, parsedCategories.reduce((acc, cat) => acc + cat.weightedScore, 0));

  // 2. Dimension A: General Quality Score (Content & Presentation)
  // Structure (15) + Summary (10) + Skills (20) + Experience (20) + Education (10) + Contact (10) = 85 weight base normalized to 100
  const contentCategories = parsedCategories.filter((c) => c.category !== 'FORMATTING_COMPATIBILITY');
  const contentScoreSum = contentCategories.reduce((acc, c) => acc + c.weightedScore, 0);
  const generalQualityScore = Math.min(100, Math.round((contentScoreSum / 85) * 100));

  // 3. Dimension B: ATS Compatibility Score (Structure + Formatting + Contact)
  // Structure (15) + Formatting (15) + Contact (10) = 40 weight base normalized to 100
  const formatCategories = parsedCategories.filter(
    (c) => c.category === 'STRUCTURE_READABILITY' || c.category === 'FORMATTING_COMPATIBILITY' || c.category === 'CONTACT_COMPLETENESS'
  );
  const formatScoreSum = formatCategories.reduce((acc, c) => acc + c.weightedScore, 0);
  const atsCompatibilityScore = Math.min(100, Math.round((formatScoreSum / 40) * 100));

  // 4. Dimension C: Job Match Score (Only if Job Description supplied)
  const hasJobDescription = Boolean(input.jobDescription && input.jobDescription.trim().length >= 30);
  let jobMatchScore: number | null = null;
  let jobMatchDetails: AtsAssessmentResult['jobMatchDetails'] = undefined;

  if (hasJobDescription && rawModelOutput?.jobMatch) {
    const rawJm = rawModelOutput.jobMatch;
    const scoreVal = typeof rawJm?.score === 'number' && !isNaN(rawJm.score) ? Math.max(25, Math.min(98, Math.round(rawJm.score))) : 70;
    jobMatchScore = scoreVal;
    jobMatchDetails = {
      requiredSkillsFound: Array.isArray(rawJm?.requiredSkillsFound) ? rawJm.requiredSkillsFound.map(String) : [],
      transferableSkillsFound: Array.isArray(rawJm?.transferableSkillsFound) ? rawJm.transferableSkillsFound.map(String) : [],
      requiredSkillsNotEvidenced: Array.isArray(rawJm?.requiredSkillsNotEvidenced) ? rawJm.requiredSkillsNotEvidenced.map(String) : [],
      preferredSkillsFound: Array.isArray(rawJm?.preferredSkillsFound) ? rawJm.preferredSkillsFound.map(String) : [],
      experienceAlignmentSummary: String(rawJm?.experienceAlignmentSummary || 'Semantic job description match analysis.'),
    };
  }

  const grade: AtsAssessmentResult['grade'] =
    overallScore >= 90 ? 'A+' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : 'D';

  const wordCount = input.anonymizedText.split(/\s+/).filter(Boolean).length;
  const inferredDomain = String(rawModelOutput?.inferredDomain || input.targetIndustry || 'Professional Services');
  const careerStage = String(rawModelOutput?.careerStage || 'Experienced professional');
  const inferredRole = String(rawModelOutput?.inferredRole || input.targetRole || 'Professional Role');

  return {
    assessmentId,
    timestamp: new Date().toISOString(),
    targetRole: input.targetRole && input.targetRole !== 'Professional Role' ? input.targetRole : inferredRole,
    targetIndustry: input.targetIndustry && input.targetIndustry !== 'Corporate / Technology' ? input.targetIndustry : inferredDomain,
    inferredDomain,
    careerStage,
    inferredRole,
    overallScore,
    generalQualityScore,
    atsCompatibilityScore,
    jobMatchScore,
    jobMatchDetails,
    grade,
    summary: String(
      rawModelOutput?.summary ||
        `Universal resume evaluation completed for ${inferredRole} (${inferredDomain}) with an overall score of ${overallScore}/100 across 7 standard categories.`
    ),
    topStrengths:
      Array.isArray(rawModelOutput?.topStrengths) && rawModelOutput.topStrengths.length > 0
        ? rawModelOutput.topStrengths.map(String)
        : ['Clear professional progression', 'Consistent section organization', 'Relevant domain competency presentation'],
    criticalGaps:
      Array.isArray(rawModelOutput?.criticalGaps) && rawModelOutput.criticalGaps.length > 0
        ? rawModelOutput.criticalGaps.map(String)
        : ['Strengthen impact communication across key roles', 'Refine section hierarchy for accelerated recruiter skimming'],
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
 * PUBLIC AUDIT TRANSFORMER (FREE TIER VS LOCKED ENFORCEMENT & CUSTOM PRICING)
 *
 * 1. Zero-leakage: Proprietary recommendations and missing keyword details remain strictly locked.
 * 2. Custom Pricing UX: Strips all numeric prices, replaces with custom quotation messaging and bespoke CTAs.
 * 3. Multi-dimensional scores: Exposes General Resume Quality, ATS Compatibility, and optional Job Match.
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

  // Extract short strength titles (titles only, no proprietary details)
  const strengthTitles = (assessment.topStrengths || [])
    .map((s) => {
      const parts = s.split(/[:–—\-]/);
      return parts[0].trim().substring(0, 65);
    })
    .filter(Boolean)
    .slice(0, 4);

  if (strengthTitles.length === 0) {
    strengthTitles.push('Clear Section Hierarchy', 'Relevant Domain Competencies', 'Logical Chronological Order');
  }

  // Teaser metadata for locked insight cards with CUSTOM QUOTATION policy
  const categoryTeaserMap: Record<
    AtsCategoryKey,
    {
      title: string;
      teaserSubtitle: string;
      teaserBullets: string[];
      serviceCode: string;
      serviceName: string;
      ctaText: string;
      reason: string;
    }
  > = {
    STRUCTURE_READABILITY: {
      title: 'Resume Structure & Visual Hierarchy',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Which sections create reading friction in enterprise ATS scanners',
        'How to re-order your career trajectory for maximum visual impact',
        'Standard section header templates that prevent candidate parsing drop-offs',
      ],
      serviceCode: 'ATS_OPTIMISATION',
      serviceName: 'ATS Resume Optimisation',
      ctaText: 'Get a Custom Quote',
      reason: 'Standardise layout hierarchy and eliminate structure parsing bottlenecks.',
    },
    PROFESSIONAL_SUMMARY: {
      title: 'Professional Summary & Executive Pitch',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'What core value proposition is missing from your opening narrative',
        'How to align your summary with your target career trajectory',
        'Tailored 3-sentence elevator pitch rewrite blueprint',
      ],
      serviceCode: 'RESUME_WRITING',
      serviceName: 'Professional Resume Writing',
      ctaText: 'Request a Custom Quote',
      reason: 'Craft an authentic, high-impact elevator pitch tailored to hiring decision-makers.',
    },
    SKILLS_RELEVANCE: {
      title: 'Domain Competencies & Keyword Alignment',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'High-frequency domain competencies missing from your profile',
        'How to group skills into functional categories for human recruiters and ATS',
        'Transferable skill articulation to maximize interview invitations',
      ],
      serviceCode: 'ATS_OPTIMISATION',
      serviceName: 'ATS Resume Optimisation',
      ctaText: 'Get a Custom Quote',
      reason: 'Incorporate relevant industry terminology to bypass algorithmic applicant filters.',
    },
    EXPERIENCE_ACHIEVEMENTS: {
      title: 'Achievement Communication & Impact Phrasing',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Which experience statements read as passive job duties rather than active contributions',
        'How to frame qualitative or quantitative achievements for your specific profession',
        'C-A-R (Context, Action, Result) phrasing rewrites for your major projects',
      ],
      serviceCode: 'RESUME_WRITING',
      serviceName: 'Professional Resume Writing',
      ctaText: 'Request a Custom Quote',
      reason: 'Transform day-to-day duties into compelling evidence of capability and leadership.',
    },
    EDUCATION_CERTIFICATIONS: {
      title: 'Education, Credentials & Continuous Learning',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Strategic placement of academic foundations based on your career stage',
        'How to spotlight professional certifications and licenses without clutter',
        'Recommended accreditations for your target career level',
      ],
      serviceCode: 'RESUME_WRITING',
      serviceName: 'Professional Resume Writing',
      ctaText: 'Request a Custom Quote',
      reason: 'Properly frame academic credentials and highlight accredited qualifications.',
    },
    FORMATTING_COMPATIBILITY: {
      title: 'ATS Formatting & Parser Stability',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Hidden layout elements that trigger text scrambling in Workday and Taleo',
        'Single-column vs two-column compatibility diagnosis for your document',
        'Parse-certified layout guidelines tailored for enterprise ATS portals',
      ],
      serviceCode: 'ATS_OPTIMISATION',
      serviceName: 'ATS Resume Optimisation',
      ctaText: 'Get a Custom Quote',
      reason: 'Ensure seamless 100% parse-compliance across enterprise hiring systems.',
    },
    CONTACT_COMPLETENESS: {
      title: 'Contact Accessibility & Online Profile Presence',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Modern contact header format compliant with privacy and international standards',
        'Custom LinkedIn URL vanity slug and portfolio presence optimization',
        'Location and telephone formatting standards for international recruiters',
      ],
      serviceCode: 'LINKEDIN_MAKEOVER',
      serviceName: 'LinkedIn Profile Makeover',
      ctaText: 'Request a Consultation',
      reason: 'Unify your contact presence and elevate your digital recruiter footprint.',
    },
  };

  // Build locked improvement cards for categories with rawScore < 85 (weakest first)
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
          pricingLabel: 'Quote Based on Requirements',
          ctaText: teaser.ctaText,
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
          pricingLabel: 'Quote Based on Requirements',
          ctaText: teaser.ctaText,
          reason: teaser.reason,
        });
      }
    }
  }

  // Determine Primary & Secondary Recommended Services based on actual weakest categories
  const weakest = sortedCategories[0]?.category;
  const secondWeakest = sortedCategories[1]?.category;

  let primaryDef = BESPOKE_SERVICE_CATALOGUE.ATS_OPTIMISATION;
  let secondaryDef = BESPOKE_SERVICE_CATALOGUE.RESUME_WRITING;

  if (weakest === 'EXPERIENCE_ACHIEVEMENTS' || weakest === 'PROFESSIONAL_SUMMARY') {
    primaryDef = BESPOKE_SERVICE_CATALOGUE.RESUME_WRITING;
    secondaryDef = BESPOKE_SERVICE_CATALOGUE.ATS_OPTIMISATION;
  } else if (weakest === 'CONTACT_COMPLETENESS') {
    primaryDef = BESPOKE_SERVICE_CATALOGUE.RESUME_WRITING;
    secondaryDef = BESPOKE_SERVICE_CATALOGUE.LINKEDIN_MAKEOVER;
  } else if (weakest === 'SKILLS_RELEVANCE') {
    primaryDef = BESPOKE_SERVICE_CATALOGUE.ATS_OPTIMISATION;
    secondaryDef = BESPOKE_SERVICE_CATALOGUE.MANAGED_JOB_SEARCH;
  }

  if (secondWeakest === 'CONTACT_COMPLETENESS' && primaryDef.code !== 'LINKEDIN_MAKEOVER') {
    secondaryDef = BESPOKE_SERVICE_CATALOGUE.LINKEDIN_MAKEOVER;
  }

  const primaryService: RecommendedServiceItem = {
    code: primaryDef.code,
    name: primaryDef.name,
    pricingLabel: 'Custom Pricing',
    tagline: primaryDef.tagline,
    quoteMessage: primaryDef.quoteMessage,
    ctaText: primaryDef.ctaText,
    addressedAreas:
      primaryDef.code === 'RESUME_WRITING'
        ? ['Narrative Positioning', 'Achievement Phrasing', 'Executive Elevator Pitch']
        : ['ATS Layout Refinement', 'Domain Keyword Alignment', 'Parser Verification'],
    isPrimary: true,
  };

  const secondaryService: RecommendedServiceItem = {
    code: secondaryDef.code,
    name: secondaryDef.name,
    pricingLabel: 'Custom Pricing',
    tagline: secondaryDef.tagline,
    quoteMessage: secondaryDef.quoteMessage,
    ctaText: secondaryDef.ctaText,
    addressedAreas:
      secondaryDef.code === 'LINKEDIN_MAKEOVER'
        ? ['LinkedIn Headline & Story', 'Recruiter Discoverability', 'Brand Alignment']
        : secondaryDef.code === 'MANAGED_JOB_SEARCH'
        ? ['Curated Role Discovery', 'Target Outreach', 'Application Tracking']
        : ['Structure Optimization', 'ATS Keyword Injection', 'Format Standardization'],
    isPrimary: false,
  };

  const hasJobDescription = Boolean(jobDescription && jobDescription.trim().length >= 30);

  return {
    assessmentId: assessment.assessmentId,
    timestamp: assessment.timestamp,
    targetRole: assessment.targetRole,
    targetIndustry: assessment.targetIndustry,
    inferredDomain: assessment.inferredDomain,
    careerStage: assessment.careerStage,
    inferredRole: assessment.inferredRole,
    overallScore: assessment.overallScore,
    generalQualityScore: assessment.generalQualityScore,
    atsCompatibilityScore: assessment.atsCompatibilityScore,
    jobMatchScore: hasJobDescription ? assessment.jobMatchScore : null,
    jobMatchDetails: hasJobDescription ? assessment.jobMatchDetails : undefined,
    jobMatchKeywordSummary: hasJobDescription && assessment.jobMatchDetails
      ? {
          matchedCount: assessment.jobMatchDetails.requiredSkillsFound.length,
          sampleKeywords: assessment.jobMatchDetails.requiredSkillsFound.slice(0, 5),
          transferableCount: assessment.jobMatchDetails.transferableSkillsFound.length,
        }
      : undefined,
    grade: assessment.grade,
    interpretation,
    summary: assessment.summary,
    hasJobDescription,
    categories,
    strengthTitles,
    improvementAreas: improvementAreas.slice(0, 5),
    recommendedServices: [primaryService, secondaryService],
    isLocked: true,
  };
}
