/**
 * CAREER COMPATIBILITY & GLOBAL JOB MARKET INTELLIGENCE TYPES
 * Pure TypeScript contracts for:
 * 1. AI Structured Resume Profile
 * 2. Job Role Discovery (Direct-fit, Adjacent, Progression, Transition)
 * 3. Industry Compatibility Scanner
 * 4. Global Country Compatibility Scanner
 * 5. Career Competitiveness, Application Readiness & Selection Outlook
 * 6. Free vs Locked Gating
 */

export type RoleMatchCategory = 'DIRECT_FIT' | 'ADJACENT' | 'PROGRESSION' | 'TRANSITION';
export type MatchClassification = 'Strong' | 'Good' | 'Moderate' | 'Emerging';
export type IndustryCategory = 'CURRENT' | 'COMPATIBLE' | 'TRANSFERABLE' | 'TRANSITION';
export type WorkAuthStatus = 'Known' | 'Unknown' | 'Requires Verification';

export interface StructuredResumeProfile {
  currentOrRecentTitle: string;
  previousTitles: string[];
  totalYearsExperience: number;
  experienceByFunction: { functionName: string; years: number }[];
  professionalSkills: string[];
  technicalSkills: string[];
  domainKnowledge: string[];
  industryExperience: string[];
  education: { degree: string; field?: string; institution?: string; year?: string }[];
  certifications: string[];
  leadershipExposure: { level: string; details: string };
  toolsAndSoftware: string[];
  languages: string[];
  careerProgression: string;
  transferableSkills: string[];
}

export interface RoleScoringDimensions {
  experienceAlignment: number; // weight: 25%
  skillAlignment: number; // weight: 25%
  responsibilityAlignment: number; // weight: 20%
  qualificationAlignment: number; // weight: 10%
  seniorityAlignment: number; // weight: 10%
  domainAlignment: number; // weight: 10%
}

export interface JobRoleRecommendation {
  id: string;
  title: string;
  category: RoleMatchCategory;
  categoryLabel: string;
  compatibilityScore: number; // 0 - 100
  matchClassification: MatchClassification;
  matchReason: string;
  keyStrengths: string[];
  scoringDimensions: RoleScoringDimensions;
  // Proprietary details (gated in public tier)
  missingSkills?: string[];
  qualificationGaps?: string[];
  transitionRoadmap?: string;
}

export interface IndustryCompatibilityItem {
  id: string;
  industryName: string;
  category: IndustryCategory;
  categoryLabel: string;
  compatibilityScore: number; // 0 - 100
  domainKnowledgeMatch: string;
  transferableResponsibilities: string[];
}

export interface CountryScoringDimensions {
  roleAlignment: number; // 25%
  skillAlignment: number; // 20%
  experienceSeniority: number; // 15%
  qualificationAlignment: number; // 10%
  languageAlignment: number; // 10%
  workAuthVisa: number; // 10%
  marketDemandEvidence: number; // 10%
}

export interface CountryCompatibilityItem {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  region: string;
  alignmentScore: number; // 0 - 100 Profile-to-Market Alignment
  suitableRoles: string[];
  relevantIndustries: string[];
  workAuthStatus: WorkAuthStatus;
  marketDataFreshness: string;
  briefExplanation: string;
  isVerifiedLiveDemand: boolean;
  scoringDimensions: CountryScoringDimensions;
  // Proprietary details (gated in public tier)
  visaPathwayDetails?: string;
  regionalApplicationStrategy?: string;
  marketType?: 'CURRENT' | 'PRIOR' | 'TARGET';
  evidenceNote?: string;
}

export interface CareerCompetitiveness {
  profileCompetitiveness: {
    score: number; // 0 - 100
    level: 'High' | 'Competitive' | 'Moderate' | 'Developing';
    summary: string;
  };
  applicationReadiness: {
    score: number; // 0 - 100
    level: 'Ready to Apply' | 'Minor Polish Needed' | 'Optimization Recommended' | 'Restructure Required';
    summary: string;
  };
  selectionOutlook: {
    status:
      | 'Strong profile alignment'
      | 'Competitive with improvements'
      | 'Significant gaps to address'
      | 'Insufficient evidence to assess';
    explanation: string;
    disclaimer: string;
  };
}

// =============================================================================
// COMPREHENSIVE AI CAREER INTELLIGENCE REPORT MODULES
// =============================================================================

export interface CareerPositioningAnalysis {
  professionalIdentity: string;
  careerStage: string;
  experienceLevel: string;
  specialization: string;
  strongestDomain: string;
  communicationEffectiveness: {
    rating: 'Strong' | 'Moderate' | 'Needs Improvement';
    reason: string;
  };
  recommendedPositioningPitch: string;
}

export interface SkillsGapAnalysisResult {
  verifiedStrengths: string[];
  missingFromResume: string[];
  underrepresentedInResume: string[];
  recommendedForDevelopment: {
    tools: string[];
    certifications: string[];
    technicalOrFunctional: string[];
  };
  isLocked?: boolean;
}

export interface CareerGrowthPathways {
  suitableNow: {
    roleTitle: string;
    rationale: string;
    keyCompetencies: string[];
    compatibilityScore: number;
  }[];
  nextLevel: {
    roleTitle: string;
    rationale: string;
    requiredGrowth: string[];
    compatibilityScore: number;
    isLocked?: boolean;
  }[];
  adjacentOpportunities: {
    roleTitle: string;
    rationale: string;
    transferableSkills: string[];
    compatibilityScore: number;
    isLocked?: boolean;
  }[];
}

export interface ApplicationReadinessPillar {
  pillar: string;
  status: 'Optimal' | 'Needs Enhancement' | 'Critical Action';
  observation: string;
}

export interface ApplicationReadinessResult {
  overallScore: number;
  pillars: ApplicationReadinessPillar[];
  prioritizedActionChecklist: {
    priority: 'High' | 'Medium' | 'Low';
    item: string;
    impact: string;
  }[];
  isLocked?: boolean;
}

export interface StarInterviewQuestion {
  question: string;
  purpose: string;
  suggestedStarApproach: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface InterviewPreparationInsights {
  roleSpecificQuestions: StarInterviewQuestion[];
  behavioralQuestions: {
    question: string;
    competencyTested: string;
    keyFocus: string;
  }[];
  technicalQuestions: {
    question: string;
    domainFocus: string;
    keyPointsToCover: string[];
  }[];
  recruiterConcernsToPreempt: {
    concern: string;
    mitigationStrategy: string;
  }[];
  isLocked?: boolean;
}

export interface ProfessionalBrandingInsights {
  targetResumeHeadline: string;
  enhancedExecutiveSummary: string;
  linkedInHeadline: string;
  linkedInAboutSnippet: string;
  coreCompetencyPillars: string[];
  uniqueValueProposition: string;
  isLocked?: boolean;
}

export interface ActionPlanPhase {
  phase: string;
  timeframe: string;
  focus: string;
  milestones: string[];
  expectedOutcome: string;
}

export interface ActionPlan306090Result {
  days1To30: ActionPlanPhase;
  days31To60: ActionPlanPhase;
  days61To90: ActionPlanPhase;
  isLocked?: boolean;
}

export interface InternationalMarketIntelligence {
  currentMarket: {
    country: string;
    code: string;
    status: string;
    marketSummary: string;
  };
  priorMarkets: {
    country: string;
    code: string;
    historySummary: string;
  }[];
  explicitTargetMarkets: {
    country: string;
    code: string;
    demandLevel: string;
    visaFeasibility: string;
    marketNotes: string;
  }[];
  potentialResearchMarkets: {
    country: string;
    code: string;
    relevanceReason: string;
    demandOutlook: string;
  }[];
}

export interface JobDescriptionMatchInsight {
  matchScore: number;
  requiredSkillsFound: string[];
  transferableSkillsFound: string[];
  skillsMissing: string[];
  experienceAlignmentSummary: string;
}

export interface CareerIntelligenceResult {
  profile: StructuredResumeProfile;
  roles: JobRoleRecommendation[];
  industries: IndustryCompatibilityItem[];
  countries: CountryCompatibilityItem[];
  targetCountriesSpecified: boolean;
  evidencedEmploymentCountries: string[];
  competitiveness: CareerCompetitiveness;
  // Advanced Career Intelligence Modules
  careerPositioning?: CareerPositioningAnalysis;
  skillsGapAnalysis?: SkillsGapAnalysisResult;
  growthOpportunities?: CareerGrowthPathways;
  applicationReadiness?: ApplicationReadinessResult;
  interviewPrep?: InterviewPreparationInsights;
  professionalBranding?: ProfessionalBrandingInsights;
  actionPlan306090?: ActionPlan306090Result;
  internationalCareerInsights?: InternationalMarketIntelligence;
  jobDescriptionMatch?: JobDescriptionMatchInsight;
  recommendations: {
    topRoles: string[];
    topIndustries: string[];
    topCountries: string[];
    rolesRequiringPreparation: string[];
    skillsWorthDeveloping: string[];
    qualificationsNeedingRecognition: string[];
    suggestedTransitionPathways: string[];
  };
}

export interface PublicJobRoleItem {
  id: string;
  title: string;
  category: RoleMatchCategory;
  categoryLabel: string;
  compatibilityScore: number;
  matchClassification: MatchClassification;
  matchReason: string;
  keyStrengths: string[];
  isLocked: boolean;
}

export interface PublicCountryItem {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  region: string;
  alignmentScore: number;
  suitableRoles: string[];
  relevantIndustries: string[];
  workAuthStatus: WorkAuthStatus;
  marketDataFreshness: string;
  briefExplanation: string;
  isVerifiedLiveDemand: boolean;
  isLocked: boolean;
  marketType?: 'CURRENT' | 'PRIOR' | 'TARGET';
  evidenceNote?: string;
}

export interface PublicCareerIntelligence {
  careerStage: string;
  inferredDomain: string;
  inferredRole: string;
  totalYearsExperience: number;
  roles: PublicJobRoleItem[];
  industries: IndustryCompatibilityItem[];
  countries: PublicCountryItem[];
  targetCountriesSpecified: boolean;
  evidencedEmploymentCountries: string[];
  competitiveness: CareerCompetitiveness;
  // Advanced Career Intelligence Modules (Public / Gated)
  careerPositioning?: CareerPositioningAnalysis;
  skillsGapAnalysis?: SkillsGapAnalysisResult;
  growthOpportunities?: CareerGrowthPathways;
  applicationReadiness?: ApplicationReadinessResult;
  interviewPrep?: InterviewPreparationInsights;
  professionalBranding?: ProfessionalBrandingInsights;
  actionPlan306090?: ActionPlan306090Result;
  internationalCareerInsights?: InternationalMarketIntelligence;
  jobDescriptionMatch?: JobDescriptionMatchInsight;
  recommendations: {
    topRoles: string[];
    topIndustries: string[];
    topCountries: string[];
    suggestedTransitionPathways: string[];
  };
}

