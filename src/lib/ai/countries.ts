/**
 * GLOBAL COUNTRY MARKET CATALOGUE & ALIGNMENT LOGIC
 * Covers verified international job markets with flags, regions, official labour benchmarks,
 * work authorisation criteria, and data freshness tracking.
 */

import { CountryCompatibilityItem, WorkAuthStatus } from './career-types';

export interface CountryDefinition {
  code: string;
  name: string;
  flag: string;
  region: string;
  primaryLanguages: string[];
  visaSchemeName: string;
  officialDataSource: string;
  typicalWorkAuthStatus: WorkAuthStatus;
  keySectors: string[];
}

export const GLOBAL_COUNTRIES_CATALOGUE: CountryDefinition[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    region: 'South Asia / Domestic',
    primaryLanguages: ['English', 'Hindi'],
    visaSchemeName: 'Domestic Citizen / OCI Employment',
    officialDataSource: 'National Career Service / MoLE Market Report 2026',
    typicalWorkAuthStatus: 'Known',
    keySectors: ['Technology', 'Financial Services', 'Manufacturing', 'Healthcare', 'Supply Chain'],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East / GCC',
    primaryLanguages: ['English', 'Arabic'],
    visaSchemeName: 'Standard Employment / Green / Golden Visa',
    officialDataSource: 'MoHRE UAE National Occupation Guidelines 2026',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Corporate Management', 'Fintech', 'Aviation', 'Healthcare', 'Logistics', 'Construction'],
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Middle East / GCC',
    primaryLanguages: ['English', 'Arabic'],
    visaSchemeName: 'Qiwa Work Permit / Premium Residency',
    officialDataSource: 'Ministry of Human Resources & Social Development (MHRSD)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Vision 2030 Projects', 'Infrastructure', 'Petrochemical', 'Healthcare', 'Digital Tech'],
  },
  {
    code: 'QA',
    name: 'Qatar',
    flag: '🇶🇦',
    region: 'Middle East / GCC',
    primaryLanguages: ['English', 'Arabic'],
    visaSchemeName: 'Ministry of Labour Work Residence Permit',
    officialDataSource: 'Ministry of Labour Qatar Labour Statistics',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Energy', 'Banking & Finance', 'Hospitality', 'Engineering', 'Healthcare'],
  },
  {
    code: 'OM',
    name: 'Oman',
    flag: '🇴🇲',
    region: 'Middle East / GCC',
    primaryLanguages: ['English', 'Arabic'],
    visaSchemeName: 'Ministry of Labour Employment Visa',
    officialDataSource: 'Oman Vision 2040 Economic Priorities',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Logistics', 'Energy & Industrial', 'Tourism', 'Healthcare'],
  },
  {
    code: 'BH',
    name: 'Bahrain',
    flag: '🇧🇭',
    region: 'Middle East / GCC',
    primaryLanguages: ['English', 'Arabic'],
    visaSchemeName: 'LMRA Work Visa',
    officialDataSource: 'Bahrain Labour Market Regulatory Authority (LMRA)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Financial Services', 'Fintech', 'Aluminium/Manufacturing', 'IT'],
  },
  {
    code: 'KW',
    name: 'Kuwait',
    flag: '🇰🇼',
    region: 'Middle East / GCC',
    primaryLanguages: ['English', 'Arabic'],
    visaSchemeName: 'PAM Private Sector Work Permit',
    officialDataSource: 'Public Authority for Manpower Kuwait',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Oil & Gas', 'Banking', 'Healthcare', 'Trading & Retail'],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe / UK',
    primaryLanguages: ['English'],
    visaSchemeName: 'Skilled Worker Visa (Shortage / Salary Threshold)',
    officialDataSource: 'UK Visas and Immigration (UKVI) & ONS Labour Index 2026',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['NHS Healthcare', 'Software & Cloud', 'Fintech', 'Engineering', 'Education'],
  },
  {
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    region: 'Europe / EU',
    primaryLanguages: ['English'],
    visaSchemeName: 'Critical Skills Employment Permit (CSEP)',
    officialDataSource: 'Department of Enterprise, Trade and Employment (DETE)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Biopharma', 'Medical Devices', 'EMEA Cloud Tech', 'Financial Services'],
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe / EU',
    primaryLanguages: ['German', 'English'],
    visaSchemeName: 'EU Blue Card / Chancenkarte (Opportunity Card)',
    officialDataSource: 'Federal Employment Agency (Bundesagentur für Arbeit 2026)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Automotive', 'Mechanical Engineering', 'SAP / Tech', 'Renewable Energy'],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    region: 'Europe / EU',
    primaryLanguages: ['English', 'Dutch'],
    visaSchemeName: 'Highly Skilled Migrant (Kennismigrant)',
    officialDataSource: 'IND Immigration and Naturalisation Service',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Semiconductors', 'Logistics & Trade', 'Agri-tech', 'Fintech'],
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'North America',
    primaryLanguages: ['English', 'French'],
    visaSchemeName: 'Express Entry (FSWP / PNP / Category-Based)',
    officialDataSource: 'Immigration, Refugees and Citizenship Canada (IRCC NOC 2026)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Healthcare', 'STEM / Cloud', 'Trades & Construction', 'Transport'],
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    primaryLanguages: ['English'],
    visaSchemeName: 'Skills in Demand Visa (Core Skills / Specialist)',
    officialDataSource: 'Jobs and Skills Australia (JSA Priority Occupation List 2026)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Mining & Resources', 'Healthcare & Aged Care', 'Cloud & Cyber', 'Civil Engineering'],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    region: 'Oceania',
    primaryLanguages: ['English'],
    visaSchemeName: 'Green List Straight to Residence / Work to Residence',
    officialDataSource: 'Immigration New Zealand (INZ Skill Shortage List)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Healthcare', 'Primary Industries', 'Construction Management', 'IT'],
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    region: 'Asia-Pacific',
    primaryLanguages: ['English', 'Mandarin'],
    visaSchemeName: 'Employment Pass (COMPASS Framework)',
    officialDataSource: 'Ministry of Manpower (MOM Shortage Occupation List 2026)',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Wealth Management', 'Biomedical Sciences', 'AI & Deep Tech', 'Supply Chain Hub'],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    region: 'Asia-Pacific',
    primaryLanguages: ['English', 'Malay'],
    visaSchemeName: 'Employment Pass (Expatriate Services Division)',
    officialDataSource: 'TalentCorp Malaysia Critical Occupations List',
    typicalWorkAuthStatus: 'Requires Verification',
    keySectors: ['Shared Services / GBS', 'Electronics Manufacturing', 'Fintech', 'Oil & Gas'],
  },
];

/**
 * Deterministic helper to compute country alignment score based on the 7 weighted dimensions:
 * 1. Role alignment: 25%
 * 2. Skills alignment: 20%
 * 3. Experience & seniority alignment: 15%
 * 4. Qualification alignment: 10%
 * 5. Language alignment: 10%
 * 6. Work authorisation & visa compatibility: 10%
 * 7. Market demand evidence: 10%
 */
export function calculateCountryAlignmentScore(
  dimensions: CountryCompatibilityItem['scoringDimensions']
): number {
  const weighted =
    (dimensions.roleAlignment * 25 +
      dimensions.skillAlignment * 20 +
      dimensions.experienceSeniority * 15 +
      dimensions.qualificationAlignment * 10 +
      dimensions.languageAlignment * 10 +
      dimensions.workAuthVisa * 10 +
      dimensions.marketDemandEvidence * 10) /
    100;
  return Math.max(20, Math.min(98, Math.round(weighted)));
}

