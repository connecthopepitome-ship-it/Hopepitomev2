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

export interface CareerIntelligenceResult {
  profile: StructuredResumeProfile;
  roles: JobRoleRecommendation[];
  industries: IndustryCompatibilityItem[];
  countries: CountryCompatibilityItem[];
  competitiveness: CareerCompetitiveness;
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
}

export interface PublicCareerIntelligence {
  careerStage: string;
  inferredDomain: string;
  inferredRole: string;
  totalYearsExperience: number;
  roles: PublicJobRoleItem[];
  industries: IndustryCompatibilityItem[];
  countries: PublicCountryItem[];
  competitiveness: CareerCompetitiveness;
  recommendations: {
    topRoles: string[];
    topIndustries: string[];
    topCountries: string[];
    suggestedTransitionPathways: string[];
  };
}
