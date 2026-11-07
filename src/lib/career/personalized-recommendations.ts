/**
 * HOPEPITOME — PERSONALIZED CAREER SERVICE CONVERSION ENGINE
 * Dynamically synthesizes ATS assessment evidence into tailored, candidate-specific
 * career service recommendations, dynamic conversion hooks, and custom quote prefill data.
 * Zero hardcoded candidate names, zero generic one-size-fits-all recommendations.
 */

import type {
  PublicAtsAuditResult,
  RoleMatchCategory,
} from '@/lib/ai/types';

export type CareerServiceCode =
  | 'RESUME_WRITING'
  | 'ATS_OPTIMISATION'
  | 'LINKEDIN_MAKEOVER'
  | 'MANAGED_JOB_SEARCH'
  | 'PORTFOLIO_WEBSITE';

export interface PrimaryServiceRecommendation {
  code: CareerServiceCode;
  name: string;
  badge: string;
  hook: string;
  primaryReason: string;
  improvementOpportunities: string[];
  pricingLabel: string;
  ctaText: string;
}

export interface SecondaryServiceRecommendation {
  code: CareerServiceCode;
  name: string;
  whyRelevant: string;
  keyBenefits: string[];
  pricingLabel: string;
  ctaText: string;
}

export interface EvidenceObservation {
  type: 'DOMAIN_EXPERIENCE' | 'ACHIEVEMENT_COMMUNICATION' | 'KEYWORD_ALIGNMENT';
  title: string;
  observation: string;
}

export interface PersonalizedRecommendationResult {
  eyebrow: string;
  headline: string;
  introduction: string;
  candidateProfession: string;
  yearsOfExperience: string;
  primaryService: PrimaryServiceRecommendation;
  secondaryServices: SecondaryServiceRecommendation[];
  findings: EvidenceObservation[];
  enquiryPrefill: {
    serviceName: string;
    requirementsNote: string;
  };
}

/**
 * Builds dynamic, candidate-specific recommendation data using existing assessment results.
 * Avoids redundant AI calls while providing deep evidence-grounded copy.
 */
export function generatePersonalizedRecommendations(
  assessment: PublicAtsAuditResult
): PersonalizedRecommendationResult {
  const profile = assessment.candidateProfile;
  const careerIntel = assessment.careerIntelligence;

  // 1. Identify Candidate Profile Details
  const profession =
    profile?.actualProfession ||
    (profile as any)?.profession ||
    careerIntel?.careerPositioning?.professionalIdentity ||
    assessment.inferredRole ||
    assessment.targetRole ||
    'Professional';

  const rawYears =
    profile?.totalYearsExperience ||
    careerIntel?.totalYearsExperience ||
    careerIntel?.careerPositioning?.experienceLevel ||
    '';
  const yearsExp =
    typeof rawYears === 'number'
      ? `${rawYears}+ years`
      : String(rawYears || '').trim();

  // Extract core competencies (top 3-4)
  const competencies: string[] =
    careerIntel?.skillsGapAnalysis?.verifiedStrengths?.slice(0, 4) ||
    profile?.skills?.slice(0, 4) ||
    (profile as any)?.coreCompetencies?.slice(0, 4) ||
    [];

  // Extract missing / high-impact keywords
  const missingKeywords: string[] =
    careerIntel?.skillsGapAnalysis?.missingFromResume?.slice(0, 3) ||
    [];

  // Extract target role
  const targetRole =
    careerIntel?.growthOpportunities?.suitableNow?.[0]?.roleTitle ||
    assessment.targetRole ||
    profession;

  // Category scores
  const categories = assessment.categories || [];
  const getScore = (catId: string): number => {
    const found = categories.find((c) => c.category === catId);
    return found ? found.rawScore : 80;
  };

  const summaryScore = getScore('PROFESSIONAL_SUMMARY');
  const experienceScore = getScore('EXPERIENCE_ACHIEVEMENTS');
  const formattingScore = getScore('FORMATTING_COMPATIBILITY');
  const skillsScore = getScore('SKILLS_RELEVANCE');
  const atsScore = assessment.atsCompatibilityScore || 85;
  const overallScore = assessment.overallScore || 80;

  const commRating = careerIntel?.careerPositioning?.communicationEffectiveness?.rating;
  const isCommunicationEffective = commRating === 'Strong';

  // 2. Select Dynamic Headline Based on Assessment Evidence
  let headline = 'Your Experience Deserves a Stronger Presentation.';

  if (summaryScore < 78 || !isCommunicationEffective) {
    headline = 'Your Experience Deserves a Stronger Presentation.';
  } else if (skillsScore >= 80 && atsScore < 85) {
    headline = "You Have the Skills. Let's Strengthen How Employers See Them.";
  } else if (
    overallScore >= 82 &&
    (careerIntel?.growthOpportunities?.nextLevel?.length || 0) > 0
  ) {
    headline = 'Your Next Career Opportunity Starts with a Better Resume.';
  } else if (
    (profile?.employmentHistory && profile.employmentHistory.length >= 2) ||
    (careerIntel?.countries && careerIntel.countries.length >= 2)
  ) {
    headline = 'Turn Your Professional Experience into a Stronger Career Story.';
  } else {
    headline = 'Your Resume Has Potential. Let’s Make It Stand Out.';
  }

  // 3. Select Primary Service Based on Evidence
  // Determine dominant gap
  let primaryCode: CareerServiceCode = 'RESUME_WRITING';

  if (summaryScore < 80 || experienceScore < 80 || !isCommunicationEffective) {
    primaryCode = 'RESUME_WRITING';
  } else if (atsScore < 85 || formattingScore < 80 || missingKeywords.length >= 2) {
    primaryCode = 'ATS_OPTIMISATION';
  } else if (overallScore >= 85 && (assessment.recruiterVisibilityScore || 80) < 85) {
    primaryCode = 'LINKEDIN_MAKEOVER';
  } else if (overallScore >= 88) {
    primaryCode = 'MANAGED_JOB_SEARCH';
  } else {
    primaryCode = 'RESUME_WRITING';
  }

  // Check if candidate is in IT/Design/Engineering where portfolio adds high leverage
  const isPortfolioRelevant =
    /software|engineer|cloud|developer|architect|designer|data|ai|machine learning/i.test(
      profession
    );

  // 4. Generate Candidate-Specific Hooks & Opportunities
  const comp1 = competencies[0] || 'core domain';
  const comp2 = competencies[1] || 'strategic workflows';
  const comp3 = competencies[2] || 'technical execution';
  const kw1 = missingKeywords[0] || 'high-frequency keywords';
  const kw2 = missingKeywords[1] || 'industry-standard terminology';

  // Specific improvement opportunities tailored to profession & competencies
  const opportunitiesMap: Record<CareerServiceCode, string[]> = {
    RESUME_WRITING: [
      `Your ${comp1} and ${comp2} experience could be highlighted more effectively through measurable, outcome-focused achievements.`,
      `Your work history can be structured to clearly position your background for senior ${targetRole} opportunities.`,
      `Your professional summary can be upgraded into a concise executive pitch that communicates your ${comp3} expertise immediately.`,
    ],
    ATS_OPTIMISATION: [
      `Terminology such as "${kw1}" and "${kw2}" can be seamlessly incorporated into your experience bullets to maximize ATS parsing confidence.`,
      `Section headers and bullet hierarchies can be standardized to ensure flawless parsing across Workday, Greenhouse, and Taleo systems.`,
      `Your verified competencies in ${comp1} can be aligned with keyword benchmarks expected by corporate recruiter search filters.`,
    ],
    LINKEDIN_MAKEOVER: [
      `Your LinkedIn headline and About section can be updated to spotlight your ${yearsExp ? `${yearsExp} in ` : ''}${profession} track record.`,
      `Key achievements in ${comp1} and ${comp2} can be translated into an engaging first-person executive narrative for direct recruiter discoverability.`,
      `Recruiter search keywords for ${targetRole} can be strategically distributed across your skills and experience endorsements.`,
    ],
    MANAGED_JOB_SEARCH: [
      `Targeted applications can be managed directly across verified companies hiring for ${targetRole} in your preferred regions.`,
      `Every application can be tailored with a customized cover letter and resume angle reflecting specific job requisitions.`,
      `Application tracking and follow-up schedules can be organized to maintain active momentum with talent acquisition teams.`,
    ],
    PORTFOLIO_WEBSITE: [
      `Your major ${comp1} and ${comp2} initiatives can be presented with visual case studies, system architectures, and business outcomes.`,
      `A standalone professional domain establishes authority and sets your candidacy apart for executive and specialized roles.`,
      `Interactive project highlights provide recruiters and hiring managers with verifiable proof of your technical depth.`,
    ],
  };

  const primaryHooks: Record<CareerServiceCode, { hook: string; reason: string }> = {
    RESUME_WRITING: {
      hook: "Your experience tells a valuable story. Let's present it in a way that employers can understand quickly.",
      reason: `Your ${yearsExp ? `${yearsExp} ` : ''}background in ${profession} has strong foundation, but your resume currently describes daily responsibilities rather than quantifying business impact and commercial value.`,
    },
    ATS_OPTIMISATION: {
      hook: 'Improve how your professional experience and relevant skills are presented to applicant tracking systems.',
      reason: `While your background in ${comp1} is evidenced, critical terminology such as "${kw1}" is underrepresented, creating unnecessary friction in automated ATS resume filters.`,
    },
    LINKEDIN_MAKEOVER: {
      hook: 'Strengthen your professional online presence so executive recruiters find and reach out to you directly.',
      reason: `Your resume demonstrates verified expertise in ${comp1}, but your online recruiter visibility can be elevated to attract inbound opportunities for ${targetRole}.`,
    },
    MANAGED_JOB_SEARCH: {
      hook: 'Focus your time on interview preparation while our dedicated team manages targeted job applications.',
      reason: `Your profile readiness is strong for ${targetRole}; a structured, consistent outreach strategy will ensure your materials reach hiring managers across priority markets.`,
    },
    PORTFOLIO_WEBSITE: {
      hook: 'Showcase your real-world projects and achievements with an executive personal website.',
      reason: `For specialized ${profession} roles, a digital portfolio provides tangible proof of your technical frameworks, architectures, and leadership achievements.`,
    },
  };

  const serviceNames: Record<CareerServiceCode, string> = {
    RESUME_WRITING: 'Professional Resume Writing',
    ATS_OPTIMISATION: 'ATS Resume Optimisation',
    LINKEDIN_MAKEOVER: 'LinkedIn Profile Makeover',
    MANAGED_JOB_SEARCH: 'Managed Job Search & Applications',
    PORTFOLIO_WEBSITE: 'Personal Portfolio Website',
  };

  const primaryService: PrimaryServiceRecommendation = {
    code: primaryCode,
    name: serviceNames[primaryCode],
    badge: 'Recommended Priority',
    hook: primaryHooks[primaryCode].hook,
    primaryReason: primaryHooks[primaryCode].reason,
    improvementOpportunities: opportunitiesMap[primaryCode],
    pricingLabel: 'Quote Based on Scope',
    ctaText: 'Get My Custom Quote',
  };

  // 5. Select Up to 2 Relevant Secondary Services
  const secondaryCandidates: CareerServiceCode[] = [];

  if (primaryCode === 'RESUME_WRITING') {
    secondaryCandidates.push('ATS_OPTIMISATION');
    secondaryCandidates.push(isPortfolioRelevant ? 'PORTFOLIO_WEBSITE' : 'LINKEDIN_MAKEOVER');
  } else if (primaryCode === 'ATS_OPTIMISATION') {
    secondaryCandidates.push('RESUME_WRITING');
    secondaryCandidates.push(isPortfolioRelevant ? 'PORTFOLIO_WEBSITE' : 'LINKEDIN_MAKEOVER');
  } else if (primaryCode === 'LINKEDIN_MAKEOVER') {
    secondaryCandidates.push('RESUME_WRITING');
    secondaryCandidates.push('MANAGED_JOB_SEARCH');
  } else if (primaryCode === 'MANAGED_JOB_SEARCH') {
    secondaryCandidates.push('RESUME_WRITING');
    secondaryCandidates.push('LINKEDIN_MAKEOVER');
  } else {
    secondaryCandidates.push('RESUME_WRITING');
    secondaryCandidates.push('ATS_OPTIMISATION');
  }

  const secondaryServices: SecondaryServiceRecommendation[] = secondaryCandidates
    .slice(0, 2)
    .map((code) => {
      const whyMap: Record<CareerServiceCode, string> = {
        RESUME_WRITING: `Ensures your accomplishments in ${comp1} are translated into executive, C-A-R formatted bullet points.`,
        ATS_OPTIMISATION: `Aligns your document structure and keyword density with modern ATS screening algorithms for ${targetRole}.`,
        LINKEDIN_MAKEOVER: `Aligns your public recruiter profile with your updated resume narrative for multi-channel recruiter discoverability.`,
        MANAGED_JOB_SEARCH: `Coordinates high-frequency, tailored applications for ${targetRole} positions across your target employment locations.`,
        PORTFOLIO_WEBSITE: `Provides hiring committees with an interactive showcase of your ${comp1} implementations and case studies.`,
      };

      const benefitsMap: Record<CareerServiceCode, string[]> = {
        RESUME_WRITING: ['Achievement-oriented bullet rewriting', 'Executive summary & positioning pitch'],
        ATS_OPTIMISATION: ['Target role keyword injection', 'Single-column parse-safe formatting'],
        LINKEDIN_MAKEOVER: ['Recruiter search optimization', 'Engaging headline & narrative About section'],
        MANAGED_JOB_SEARCH: ['Curated job openings matching your profile', 'Application submission tracking'],
        PORTFOLIO_WEBSITE: ['Live digital showcase with custom domain', 'Visual project and architecture case studies'],
      };

      return {
        code,
        name: serviceNames[code],
        whyRelevant: whyMap[code],
        keyBenefits: benefitsMap[code],
        pricingLabel: 'Quote Based on Scope',
        ctaText: 'Explore Service Quote',
      };
    });

  // 6. Build Candidate-Specific Findings ("What we identified in your resume")
  const findings: EvidenceObservation[] = [
    {
      type: 'DOMAIN_EXPERIENCE',
      title: 'Strong Professional Domain Foundations',
      observation: `Verified background in ${profession}${yearsExp ? ` with ${yearsExp}` : ''}, evidencing competencies across ${comp1}${comp2 ? ` and ${comp2}` : ''}.`,
    },
    {
      type: 'ACHIEVEMENT_COMMUNICATION',
      title: 'Responsibilities vs. Measurable Achievements',
      observation:
        experienceScore < 85
          ? 'Work history currently reads primarily as routine duties. Converting these into Context-Action-Result (C-A-R) impact statements will significantly elevate recruiter engagement.'
          : 'Solid performance accomplishments documented, with room to emphasize scale, percentage gains, and cost or efficiency outcomes.',
    },
    {
      type: 'KEYWORD_ALIGNMENT',
      title: 'Target Role & ATS Keyword Alignment',
      observation:
        missingKeywords.length > 0
          ? `Key terminology such as "${missingKeywords.join('", "')}" could be more prominently integrated to match top-quartile candidate benchmarks for ${targetRole}.`
          : `Keyword density is aligned, but formatting hierarchy can be optimized to ensure seamless multi-system parse compatibility.`,
    },
  ];

  // 7. Prefill data for Consultation Modal
  const enquiryPrefill = {
    serviceName: primaryService.name,
    requirementsNote: `[Assessment ${assessment.assessmentId}] Recommendation: ${primaryService.name}. Target Role: ${targetRole}. Priority focus: ${primaryService.improvementOpportunities[0]}`,
  };

  return {
    eyebrow: 'YOUR PERSONAL CAREER RECOMMENDATION',
    headline,
    introduction:
      'Based on your resume assessment, here are the areas where professional support could strengthen your career presentation.',
    candidateProfession: profession,
    yearsOfExperience: yearsExp,
    primaryService,
    secondaryServices,
    findings,
    enquiryPrefill,
  };
}

