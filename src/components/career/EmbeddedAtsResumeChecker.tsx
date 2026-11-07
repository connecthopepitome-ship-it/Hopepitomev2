'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  UploadCloud,
  ScanSearch,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronRight,
  Target,
  Briefcase,
  Award,
  RefreshCw,
  Phone,
  MessageSquare,
  Mail,
  X,
  Check,
  Globe,
  TrendingUp,
  Info,
  Compass,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  Linkedin,
  ListChecks,
  UserCheck,
  Lightbulb,
  HelpCircle,
  Layers,
} from 'lucide-react';
import type {
  PublicAtsAuditResult,
  LockedImprovementCard,
  RecommendedServiceItem,
  RoleMatchCategory,
} from '@/lib/ai/types';
import { extractCleanTextFromDocument } from '@/lib/document-parser';
import { PersonalizedCareerRecommendationSection } from './PersonalizedCareerRecommendationSection';

// Sample preview data for interactive demonstration
const SAMPLE_PREVIEW: PublicAtsAuditResult = {
  assessmentId: 'SAMPLE-ATS-AUDIT',
  timestamp: new Date().toISOString(),
  targetRole: 'Senior Cloud Solutions Architect',
  targetIndustry: 'Technology & Enterprise SaaS',
  inferredDomain: 'Cloud Infrastructure & Enterprise Systems',
  careerStage: 'Senior professional',
  inferredRole: 'Senior Cloud Solutions Architect',
  overallScore: 82,
  generalQualityScore: 85,
  atsCompatibilityScore: 88,
  recruiterVisibilityScore: 84,
  recruiterVisibilityLabel: 'Good potential',
  grade: 'A',
  interpretation: 'Good potential',
  summary:
    'Strong core technical depth and verified career progression with high-impact system modernization achievements. Key improvements identified in executive summary positioning, parser-safe layout standardization, and strategic keyword alignment.',
  hasJobDescription: true,
  jobMatchScore: 84,
  jobMatchKeywordSummary: {
    matchedCount: 12,
    sampleKeywords: ['AWS Architecture', 'Kubernetes', 'Microservices', 'Distributed Systems', 'DevOps'],
    transferableCount: 4,
  },
  categories: [
    { category: 'STRUCTURE_READABILITY', title: 'Resume Structure & Readability', weight: 15, rawScore: 85, weightedScore: 13, status: 'GOOD' },
    { category: 'PROFESSIONAL_SUMMARY', title: 'Professional Summary', weight: 10, rawScore: 75, weightedScore: 8, status: 'GOOD' },
    { category: 'SKILLS_RELEVANCE', title: 'Skills & Keyword Relevance', weight: 20, rawScore: 88, weightedScore: 18, status: 'EXCELLENT' },
    { category: 'EXPERIENCE_ACHIEVEMENTS', title: 'Work Experience & Achievements', weight: 20, rawScore: 82, weightedScore: 16, status: 'GOOD' },
    { category: 'EDUCATION_CERTIFICATIONS', title: 'Education & Certifications', weight: 10, rawScore: 85, weightedScore: 9, status: 'GOOD' },
    { category: 'FORMATTING_COMPATIBILITY', title: 'Formatting & ATS Parsing Compatibility', weight: 15, rawScore: 88, weightedScore: 13, status: 'GOOD' },
    { category: 'CONTACT_COMPLETENESS', title: 'Contact Details & Completeness', weight: 10, rawScore: 90, weightedScore: 9, status: 'EXCELLENT' },
  ],
  strengthTitles: [
    'Substantial system modernization and engineering impact',
    'Demonstrated expertise across core cloud infrastructure tools',
    'Clear chronological progression with verified career momentum',
  ],
  improvementAreas: [
    {
      id: 'imp_summary',
      category: 'PROFESSIONAL_SUMMARY',
      title: 'Professional Summary & Value Pitch',
      teaserSubtitle: 'Your summary may not communicate your strongest professional value clearly.',
      teaserBullets: [
        'What core value proposition is missing from your opening narrative',
        'Which details should be highlighted for senior roles',
        'Tailored 3-sentence elevator pitch rewrite blueprint',
      ],
      recommendedServiceCode: 'RESUME_WRITING',
      recommendedServiceName: 'Professional Resume Writing',
      pricingLabel: 'Quote Based on Scope',
      ctaText: 'Improve My Resume',
      reason: 'Elevate your opening profile narrative to capture recruiter interest within 6 seconds.',
    },
    {
      id: 'imp_experience',
      category: 'EXPERIENCE_ACHIEVEMENTS',
      title: 'Experience Achievements & Impact Phrasing',
      teaserSubtitle: 'Several bullet points read like routine duties rather than achievements.',
      teaserBullets: [
        'Phrasing adjustments to highlight scope and outcomes',
        'Action-oriented verbs to strengthen executive positioning',
        'C-A-R (Context-Action-Result) framing for key initiatives',
      ],
      recommendedServiceCode: 'RESUME_WRITING',
      recommendedServiceName: 'Professional Resume Writing',
      pricingLabel: 'Quote Based on Scope',
      ctaText: 'Improve My Resume',
      reason: 'Transform daily task descriptions into clear evidence of business contribution.',
    },
    {
      id: 'imp_skills',
      category: 'SKILLS_RELEVANCE',
      title: 'Skills & Keyword Organization',
      teaserSubtitle: 'High-value domain capabilities can be structured for faster parsing.',
      teaserBullets: [
        'How to group skills into functional categories',
        'Strategic placement to align with hiring manager priorities',
        'Balancing technical keywords with leadership competencies',
      ],
      recommendedServiceCode: 'ATS_OPTIMISATION',
      recommendedServiceName: 'ATS Resume Optimisation',
      pricingLabel: 'Quote Based on Scope',
      ctaText: 'Get a Custom Quote',
      reason: 'Enhance readability for both automated applicant filters and hiring managers.',
    },
  ],
  recommendedServices: [
    {
      code: 'RESUME_WRITING',
      name: 'Professional Resume Writing',
      pricingLabel: 'Custom Pricing',
      tagline: 'Collaborate with a senior resume strategist to articulate your career story.',
      quoteMessage: 'Personalized quote provided based on career level and depth of work history.',
      ctaText: 'Improve My Resume',
      addressedAreas: ['Executive Summary Framing', 'Achievement Metrics', 'Career Narrative'],
      isPrimary: true,
    },
    {
      code: 'ATS_OPTIMISATION',
      name: 'ATS Resume Optimisation',
      pricingLabel: 'Custom Pricing',
      tagline: 'Reformat and align your resume for parse compliance across modern hiring systems.',
      quoteMessage: 'Scope determined after assessing layout complexity and target job profiles.',
      ctaText: 'Get a Custom Quote',
      addressedAreas: ['ATS Layout Compatibility', 'Keyword Structuring', 'Parser Hierarchy'],
      isPrimary: false,
    },
  ],
  careerIntelligence: {
    careerStage: 'Senior professional',
    inferredDomain: 'Cloud Infrastructure & Enterprise Systems',
    inferredRole: 'Senior Cloud Solutions Architect',
    totalYearsExperience: 8,
    roles: [
      {
        id: 'sample_role_1',
        title: 'Senior Cloud Solutions Architect',
        category: 'DIRECT_FIT',
        categoryLabel: 'Direct Match',
        compatibilityScore: 92,
        matchClassification: 'Strong',
        matchReason: 'Direct match based on your enterprise cloud design, microservices, and technical leadership track record.',
        keyStrengths: ['Enterprise cloud migration experience', 'Microservices design authority', 'Multi-cloud optimization'],
        isLocked: false,
      },
      {
        id: 'sample_role_2',
        title: 'Principal Infrastructure Architect',
        category: 'PROGRESSION',
        categoryLabel: 'Next Level',
        compatibilityScore: 86,
        matchClassification: 'Strong',
        matchReason: 'Natural next-step leadership role expanding into organization-wide technical governance.',
        keyStrengths: ['Scalable systems design', 'Technical roadmapping', 'Cost governance'],
        isLocked: false,
      },
      {
        id: 'sample_role_3',
        title: 'Platform Engineering Lead',
        category: 'ADJACENT',
        categoryLabel: 'Transferable Role',
        compatibilityScore: 84,
        matchClassification: 'Good',
        matchReason: 'High transferability of containerization, CI/CD orchestration, and developer tooling skills.',
        keyStrengths: ['Kubernetes cluster management', 'Automation mastery', 'Site reliability engineering'],
        isLocked: false,
      },
      {
        id: 'sample_role_4',
        title: 'Cloud Strategy & Transformation Consultant',
        category: 'TRANSITION',
        categoryLabel: 'Career Transition',
        compatibilityScore: 78,
        matchClassification: 'Good',
        matchReason: 'Strong advisory capability to guide enterprise clients on modern cloud adoption strategies.',
        keyStrengths: ['Technical communication', 'Vendor evaluation', 'Modernization roadmapping'],
        isLocked: false,
      },
    ],
    industries: [
      {
        id: 'sample_ind_1',
        industryName: 'Enterprise SaaS & Cloud Infrastructure',
        category: 'CURRENT',
        categoryLabel: 'Core Industry',
        compatibilityScore: 94,
        domainKnowledgeMatch: 'Direct alignment based on your recent enterprise technology track record.',
        transferableResponsibilities: ['Architecture reviews', 'High-availability deployments', 'Zero-downtime releases'],
      },
      {
        id: 'sample_ind_2',
        industryName: 'Fintech & Core Banking Systems',
        category: 'COMPATIBLE',
        categoryLabel: 'Compatible Industry',
        compatibilityScore: 88,
        domainKnowledgeMatch: 'Strong overlap in data security, compliance standards, and resilient transaction processing.',
        transferableResponsibilities: ['Financial regulatory compliance', 'Encryption standards', 'Resilient microservices'],
      },
      {
        id: 'sample_ind_3',
        industryName: 'Healthcare Technology & Life Sciences',
        category: 'TRANSFERABLE',
        categoryLabel: 'Transferable Industry',
        compatibilityScore: 82,
        domainKnowledgeMatch: 'High demand for secure distributed data pipelines and HIPAA-compliant infrastructures.',
        transferableResponsibilities: ['Secure infrastructure design', 'Disaster recovery', 'Auditing standards'],
      },
    ],
    countries: [
      {
        countryCode: 'AE',
        countryName: 'United Arab Emirates',
        flagEmoji: '🇦🇪',
        region: 'Middle East / GCC',
        alignmentScore: 88,
        suitableRoles: ['Cloud Architect', 'DevOps Lead', 'Enterprise Solutions Lead'],
        relevantIndustries: ['Corporate Management', 'Fintech', 'Aviation'],
        workAuthStatus: 'Requires Verification',
        marketDataFreshness: '2026 Guidelines',
        briefExplanation: 'High demand for senior enterprise technology talent across regional headquarters in Dubai and Abu Dhabi.',
        isVerifiedLiveDemand: true,
        isLocked: false,
      },
      {
        countryCode: 'IN',
        countryName: 'India',
        flagEmoji: '🇮🇳',
        region: 'South Asia / Domestic',
        alignmentScore: 92,
        suitableRoles: ['Principal Architect', 'Cloud Practice Head', 'Staff Engineer'],
        relevantIndustries: ['Technology', 'Financial Services', 'Enterprise SaaS'],
        workAuthStatus: 'Known',
        marketDataFreshness: '2026 Market Report',
        briefExplanation: 'Rapid expansion in global capability centers (GCCs) and domestic enterprise tech platforms.',
        isVerifiedLiveDemand: true,
        isLocked: false,
      },
      {
        countryCode: 'GB',
        countryName: 'United Kingdom',
        flagEmoji: '🇬🇧',
        region: 'Western Europe',
        alignmentScore: 82,
        suitableRoles: ['Cloud Infrastructure Specialist', 'Platform Lead'],
        relevantIndustries: ['Fintech', 'Professional Services', 'E-commerce'],
        workAuthStatus: 'Requires Verification',
        marketDataFreshness: '2026 Shortage Occupations',
        briefExplanation: 'Eligible engineering competencies align with Skilled Worker shortage occupation criteria.',
        isVerifiedLiveDemand: true,
        isLocked: false,
      },
      {
        countryCode: 'SG',
        countryName: 'Singapore',
        flagEmoji: '🇸🇬',
        region: 'Southeast Asia',
        alignmentScore: 85,
        suitableRoles: ['Regional Cloud Architect', 'Enterprise Solutions Consultant'],
        relevantIndustries: ['Banking & Finance', 'Regional Technology HQs'],
        workAuthStatus: 'Requires Verification',
        marketDataFreshness: '2026 Compass Framework',
        briefExplanation: 'Strong regional hub demand; points-based Compass framework values evidenced technology leadership.',
        isVerifiedLiveDemand: true,
        isLocked: false,
      },
      {
        countryCode: 'DE',
        countryName: 'Germany',
        flagEmoji: '🇩🇪',
        region: 'European Union',
        alignmentScore: 78,
        suitableRoles: ['Cloud Systems Engineer', 'Senior DevOps Consultant'],
        relevantIndustries: ['Industrial Automation', 'Enterprise Software', 'Automotive'],
        workAuthStatus: 'Requires Verification',
        marketDataFreshness: '2026 EU Blue Card',
        briefExplanation: 'Strong tech demand under EU Blue Card regulations; English widely accepted in Berlin/Munich hubs.',
        isVerifiedLiveDemand: true,
        isLocked: false,
      },
    ],
    targetCountriesSpecified: true,
    evidencedEmploymentCountries: ['United Arab Emirates', 'India'],
    competitiveness: {
      profileCompetitiveness: {
        score: 84,
        level: 'Competitive',
        summary: 'Your profile demonstrates strong domain competency and verifiable career momentum compared to candidate benchmarks.',
      },
      applicationReadiness: {
        score: 88,
        level: 'Minor Polish Needed',
        summary: 'Your resume layout is clean and parse-friendly, with core contact details and employment dates clearly positioned.',
      },
      selectionOutlook: {
        status: 'Competitive with improvements',
        explanation:
          'Your resume communicates solid qualifications that position you well for relevant opportunities. Targeted improvements in executive summary framing and achievement metrics will further strengthen recruiter engagement.',
        disclaimer:
          'Presentation assessment only. Actual interview invitations and hiring decisions depend on employer requirements, applicant competition, and legal work eligibility.',
      },
    },
    recommendations: {
      topRoles: ['Senior Cloud Solutions Architect', 'Principal Infrastructure Architect'],
      topIndustries: ['Enterprise SaaS & Cloud Infrastructure', 'Fintech & Core Banking Systems'],
      topCountries: ['India', 'United Arab Emirates', 'Singapore'],
      suggestedTransitionPathways: ['Cloud Strategy & Transformation Consultant'],
    },
    careerPositioning: {
      professionalIdentity: 'Senior Cloud Solutions Architect',
      careerStage: 'Senior professional',
      experienceLevel: '8+ years in Enterprise Cloud Architecture',
      specialization: 'Multi-Cloud Migrations, Kubernetes, Distributed Systems',
      strongestDomain: 'Cloud Infrastructure & Enterprise Systems',
      communicationEffectiveness: {
        rating: 'Strong',
        reason: 'Resume articulates high-scale cloud deployments, cost governance, and microservices design authority effectively.',
      },
      recommendedPositioningPitch: 'Senior Cloud Solutions Architect with 8+ years architecting fault-tolerant distributed systems across AWS and Azure for Fortune 500 enterprises.',
    },
    skillsGapAnalysis: {
      verifiedStrengths: ['Multi-Cloud Architecture', 'Kubernetes Cluster Orchestration', 'Terraform IaC', 'CI/CD Pipelines', 'Microservices Design', 'Zero-Downtime Migration', 'Cost Optimization'],
      missingFromResume: ['FinOps Cloud Cost Governance', 'Zero Trust Architecture', 'Service Mesh (Istio)'],
      underrepresentedInResume: ['Quantified cloud migration cost-avoidance metrics across multi-million dollar budgets'],
      recommendedForDevelopment: {
        tools: ['Terraform Cloud', 'Istio Service Mesh', 'Datadog Enterprise'],
        certifications: ['AWS Solutions Architect Professional', 'CKA (Certified Kubernetes Administrator)'],
        technicalOrFunctional: ['Enterprise FinOps Governance', 'Multi-Region High Availability Disaster Recovery'],
      },
      isLocked: true,
    },
    growthOpportunities: {
      suitableNow: [
        {
          roleTitle: 'Senior Cloud Solutions Architect',
          rationale: 'Direct alignment with enterprise cloud migrations, container orchestration, and technical governance.',
          keyCompetencies: ['AWS / Azure Architecture', 'Kubernetes', 'Terraform'],
          compatibilityScore: 92,
        },
      ],
      nextLevel: [
        {
          roleTitle: 'Principal Infrastructure Architect',
          rationale: 'Natural advancement expanding into organization-wide technical governance and C-suite architectural roadmapping.',
          requiredGrowth: ['Executive stakeholder engagement', 'Multi-million enterprise budget ownership'],
          compatibilityScore: 86,
          isLocked: true,
        },
      ],
      adjacentOpportunities: [
        {
          roleTitle: 'Platform Engineering Lead',
          rationale: 'High transferability of developer tooling, infrastructure automation, and site reliability engineering.',
          transferableSkills: ['DevOps Automation', 'CI/CD Pipelines', 'SRE Practices'],
          compatibilityScore: 84,
          isLocked: true,
        },
      ],
    },
    applicationReadiness: {
      overallScore: 88,
      pillars: [
        { pillar: 'Headline & Title Clarity', status: 'Optimal', observation: 'Clear designation as Senior Cloud Solutions Architect creates instant recruiter resonance.' },
        { pillar: 'Executive Summary Framing', status: 'Optimal', observation: 'Strong 3-sentence summary highlights scale, tools, and technical leadership.' },
        { pillar: 'Quantified Achievements', status: 'Needs Enhancement', observation: 'Quantify cloud migration savings ($/%) across key enterprise projects.' },
        { pillar: 'ATS Parse & Keywords', status: 'Optimal', observation: 'Single-column structure passes modern ATS parsers without text fragmentation.' },
        { pillar: 'Work Chronology', status: 'Optimal', observation: 'Logical career progression from systems engineer to senior cloud architect.' },
        { pillar: 'Core Domain Skills', status: 'Optimal', observation: 'High-frequency cloud infrastructure competencies grouped logically.' },
        { pillar: 'Education & Certifications', status: 'Optimal', observation: 'B.Tech in Computer Science and AWS certifications clearly positioned.' },
        { pillar: 'Contact & Online Presence', status: 'Optimal', observation: 'LinkedIn URL and professional contact details formatted to international standards.' },
      ],
      prioritizedActionChecklist: [
        { priority: 'High', item: 'Quantify AWS/Azure cloud migration cost savings and uptime improvements with exact percentages.', impact: 'Increases recruiter shortlisting by 40% for principal-level roles.' },
        { priority: 'High', item: 'Spotlight FinOps and Zero Trust security keywords in your latest position accomplishments.', impact: 'Pushes profile into top 5% of automated ATS search ranking.' },
        { priority: 'Medium', item: 'Highlight mentoring and cross-functional leadership of junior platform engineers.', impact: 'Demonstrates readiness for Director / Principal leadership tracks.' },
      ],
      isLocked: true,
    },
    interviewPrep: {
      roleSpecificQuestions: [
        {
          question: 'How did you execute zero-downtime cloud migrations for high-transaction enterprise microservices?',
          purpose: 'Assesses architectural risk mitigation, canary deployment strategies, and fault tolerance under production loads.',
          suggestedStarApproach: {
            situation: 'Migrating a legacy monolithic banking core to AWS containerized microservices handling 5,000+ RPS.',
            task: 'Ensure continuous 99.99% availability without transactional data loss or database locks.',
            action: 'Implemented blue/green deployment with Route 53 weighted routing and dual-write database replication.',
            result: 'Completed migration across 12 services with zero downtime and reduced latency by 35%.',
          },
        },
      ],
      behavioralQuestions: [
        { question: 'Tell me about a time you resolved an architectural dispute between engineering and security teams.', competencyTested: 'Stakeholder Influence & Technical Diplomacy', keyFocus: 'Balance compliance standards with developer velocity.' },
      ],
      technicalQuestions: [
        { question: 'How do you design multi-region disaster recovery with RPO < 1 min and RTO < 5 mins on AWS?', domainFocus: 'Enterprise Cloud Resilience', keyPointsToCover: ['Aurora Global Database', 'Active-active Route 53 latency routing', 'Cross-region S3 replication'] },
      ],
      recruiterConcernsToPreempt: [
        { concern: 'Verifying hands-on infrastructure coding versus purely high-level advisory design.', mitigationStrategy: 'Lead with specific Terraform and Kubernetes manifest implementations you directly authored.' },
      ],
      isLocked: true,
    },
    professionalBranding: {
      targetResumeHeadline: 'Senior Cloud Solutions Architect | Multi-Cloud & Distributed Systems | 8+ Years Experience',
      enhancedExecutiveSummary: 'Results-oriented Senior Cloud Solutions Architect with 8+ years leading enterprise cloud modernization, container orchestration, and multi-region infrastructure design. Trusted partner to C-suite and engineering leadership in driving zero-downtime migrations, automating CI/CD pipelines, and enforcing FinOps governance.',
      linkedInHeadline: 'Senior Cloud Solutions Architect | AWS & Azure Multi-Cloud | Kubernetes • Terraform • FinOps',
      linkedInAboutSnippet: 'I architect resilient, high-throughput cloud infrastructure that scales with business growth.\n\nOver the past 8+ years, I have spearheaded cloud transformation initiatives for enterprise clients, reducing compute expenditures while accelerating deployment cycles through Infrastructure as Code (Terraform) and container orchestration (Kubernetes).\n\nPassionate about cloud architecture, platform engineering, and technical mentorship.',
      coreCompetencyPillars: ['Enterprise Cloud Architecture (AWS / Azure)', 'Kubernetes & Container Orchestration', 'Infrastructure as Code (Terraform / Ansible)', 'FinOps Cloud Cost Optimization'],
      uniqueValueProposition: 'Delivering resilient, cost-optimized enterprise cloud architectures with zero-downtime operational precision.',
      isLocked: true,
    },
    actionPlan306090: {
      days1To30: {
        phase: 'Immediate Optimization (Days 1–30)',
        timeframe: 'Days 1 to 30',
        focus: 'Resume restructuring, ATS parse verification, and high-frequency keyword infusing.',
        milestones: ['Reformat resume to single-column parse-compliant template', 'Infuse missing FinOps & Zero Trust keywords', 'Upgrade LinkedIn headline and About section'],
        expectedOutcome: 'Achieve 92% ATS parse score and 100% recruiter search discoverability.',
      },
      days31To60: {
        phase: 'Market Positioning & Targeted Outreach (Days 31–60)',
        timeframe: 'Days 31 to 60',
        focus: 'Target employer mapping and specialized recruiter networking.',
        milestones: ['Map 25 target enterprise employers in UAE and Singapore', 'Engage directly with 15 specialized tech recruiters', 'Submit 15 tailored applications for Principal / Senior Architect roles'],
        expectedOutcome: 'Secure 3–5 initial recruiter screening calls.',
      },
      days61To90: {
        phase: 'Interview Conversion & Strategic Placement (Days 61–90)',
        timeframe: 'Days 61 to 90',
        focus: 'System design panel interviews and compensation benchmarking.',
        milestones: ['Complete mock system design interviews with STAR methodology', 'Benchmark market compensation across Dubai and Singapore', 'Negotiate competitive total compensation package'],
        expectedOutcome: 'Secure formal offer letter for Senior / Principal Cloud Architect.',
      },
      isLocked: true,
    },
    internationalCareerInsights: {
      currentMarket: { country: 'India', code: 'IN', status: 'Active Base', marketSummary: 'Rapid growth in Global Capability Centers (GCCs) and multinational enterprise cloud divisions.' },
      priorMarkets: [{ country: 'United Arab Emirates', code: 'AE', historySummary: 'Documented regional track record in Dubai tech hub.' }],
      explicitTargetMarkets: [
        { country: 'Singapore', code: 'SG', demandLevel: 'High', visaFeasibility: 'Points-based Compass framework values verified tech credentials', marketNotes: 'High regional HQ demand for enterprise cloud leadership.' },
      ],
      potentialResearchMarkets: [
        { country: 'United Kingdom', code: 'GB', relevanceReason: 'Skilled worker shortage occupation for cloud engineers.', demandOutlook: 'High demand in London fintech sector.' },
      ],
    },
  },
  isLocked: true,
};

interface EmbeddedAtsResumeCheckerProps {
  onServiceSelect?: (serviceCode: string, assessmentId?: string) => void;
  className?: string;
}

export function EmbeddedAtsResumeChecker({ onServiceSelect, className = '' }: EmbeddedAtsResumeCheckerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>('');
  const [uploadId, setUploadId] = useState<string>('');
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [showJdInput, setShowJdInput] = useState<boolean>(false);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // View state: 'idle' | 'processing' | 'results' | 'sample'
  const [viewState, setViewState] = useState<'idle' | 'processing' | 'results' | 'sample'>('idle');
  const [processingStage, setProcessingStage] = useState<number>(1);
  const [auditResult, setAuditResult] = useState<PublicAtsAuditResult | null>(null);
  const [activeSection, setActiveSection] = useState<string>('sec-overview');
  const [expandedStarIndex, setExpandedStarIndex] = useState<number | null>(0);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Friendly High Demand Error State
  const [highDemandError, setHighDemandError] = useState<{
    heading: string;
    message: string;
    secondaryText: string;
  } | null>(null);
  const [genericErrorMessage, setGenericErrorMessage] = useState<string | null>(null);

  // Conversion / Enquiry Modal
  const [conversionModalOpen, setConversionModalOpen] = useState<boolean>(false);
  const [selectedModalCard, setSelectedModalCard] = useState<LockedImprovementCard | null>(null);
  const [selectedService, setSelectedService] = useState<RecommendedServiceItem | null>(null);
  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadContactMethod, setLeadContactMethod] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');
  const [leadRequirements, setLeadRequirements] = useState<string>('');
  const [enquirySubmitting, setEnquirySubmitting] = useState<boolean>(false);
  const [enquirySuccessRef, setEnquirySuccessRef] = useState<string | null>(null);
  const [isUnlockRequest, setIsUnlockRequest] = useState<boolean>(true);
  const [selectedAddonServices, setSelectedAddonServices] = useState<string[]>([]);

  const checkerSectionRef = useRef<HTMLDivElement>(null);
  const activeFileRef = useRef<File | null>(null);
  const activeBase64Ref = useRef<string | null>(null);

  const handleFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Immediately clear previous error states and previous file data
    setHighDemandError(null);
    setGenericErrorMessage(null);
    setFileBase64(null);
    setFileMimeType('');
    setResumeText('');
    setAuditResult(null);

    activeFileRef.current = selectedFile;
    activeBase64Ref.current = null;

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.jpg', '.jpeg', '.png', '.webp'];
    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setGenericErrorMessage('Please upload a PDF, DOCX, or image document (under 8MB).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (selectedFile.size > 8 * 1024 * 1024) {
      setGenericErrorMessage('File size exceeds 8MB. Please choose a smaller document.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Generate fresh unique upload ID for each new file
    const newUploadId = `UPL-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setUploadId(newUploadId);

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    setIsReadingFile(false);

    const mime =
      lowerName.endsWith('.pdf')
        ? 'application/pdf'
        : lowerName.endsWith('.docx')
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : lowerName.endsWith('.txt')
            ? 'text/plain'
            : lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')
              ? 'image/jpeg'
              : lowerName.endsWith('.png')
                ? 'image/png'
                : lowerName.endsWith('.webp')
                  ? 'image/webp'
                  : selectedFile.type && selectedFile.type !== 'application/octet-stream'
                    ? selectedFile.type
                    : 'application/pdf';
    setFileMimeType(mime);

    // Read as Base64 for direct native document understanding in GPT-6 Luna
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      if (base64Url && base64Url.length > 50) {
        activeBase64Ref.current = base64Url;
        setFileBase64(base64Url);
      }
      setIsReadingFile(false);

      // Best effort local text extraction for immediate preview for DOCX/TXT only (NEVER for PDF)
      if (!lowerName.endsWith('.pdf')) {
        try {
          const buffer = await selectedFile.arrayBuffer();
          const extracted = await extractCleanTextFromDocument(buffer, selectedFile.name);
          if (extracted && extracted.trim().length >= 30) {
            setResumeText(extracted.trim());
          }
        } catch {
          // Safe to ignore because backend GPT-6 Luna parses the document directly
        }
      }
    };
    reader.onerror = () => {
      setIsReadingFile(false);
      setGenericErrorMessage('Failed to read file content. Please try another file.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleStartReview = async (textToAssess?: string) => {
    if (isSubmitting || viewState === 'processing') return;

    const targetFile = activeFileRef.current || file;
    const currentFileName = targetFile?.name || fileName || '';
    const lower = currentFileName.toLowerCase();
    const isDocFile = Boolean(lower.endsWith('.pdf') || lower.endsWith('.docx') || lower.endsWith('.doc'));

    let activeBase64 = activeBase64Ref.current || fileBase64;
    let activeSize = targetFile?.size || fileSize || 0;

    // If targetFile is present, direct binary FormData is used. Otherwise, verify fallback content.
    const content = textToAssess || resumeText;

    if (!targetFile && !activeBase64 && (!content || content.trim().length < 30)) {
      setGenericErrorMessage('Please upload your resume (PDF or DOCX) to begin the assessment.');
      return;
    }

    if (!privacyConsent) {
      setGenericErrorMessage('Please accept the privacy terms to proceed with the free review.');
      return;
    }

    setHighDemandError(null);
    setGenericErrorMessage(null);
    setIsSubmitting(true);
    setViewState('processing');
    setProcessingStage(1);

    // Unique assessment ID for this run
    const assessmentId = `ATS-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Smooth stage transitions
    const timer1 = setTimeout(() => setProcessingStage(2), 700);
    const timer2 = setTimeout(() => setProcessingStage(3), 1600);
    const timer3 = setTimeout(() => setProcessingStage(4), 2600);
    const timer4 = setTimeout(() => setProcessingStage(5), 3600);

    try {
      let res: Response;

      if (targetFile) {
        // Preferred production-grade transport: Direct binary FormData upload (bypasses FileReader overhead)
        const fd = new FormData();
        fd.append('file', targetFile);
        fd.append('uploadId', uploadId || `UPL-${Date.now()}`);
        fd.append('assessmentId', assessmentId);
        fd.append('fileName', currentFileName || targetFile.name);
        fd.append('fileSize', String(targetFile.size));
        fd.append('isPublic', 'true');
        if (jobDescription.trim().length >= 30) {
          fd.append('jobDescription', jobDescription.trim());
        }
        res = await fetch('/api/career/ai/ats-evaluate', {
          method: 'POST',
          body: fd,
        });
      } else {
        const payload: Record<string, any> = {
          uploadId: uploadId || `UPL-${Date.now()}`,
          assessmentId,
          resumeText: content || '',
          fileBase64: activeBase64 || undefined,
          fileMimeType: fileMimeType || (lower.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
          fileSize: activeSize,
          fileName: currentFileName || 'candidate_resume.pdf',
          isPublic: true,
        };

        if (jobDescription.trim().length >= 30) {
          payload.jobDescription = jobDescription.trim();
        }

        res = await fetch('/api/career/ai/ats-evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json().catch(() => ({}));

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsSubmitting(false);

      if (!res.ok || !data.success) {
        setViewState('idle');
        setHighDemandError({
          heading:
            data?.heading ||
            (data?.errorType === 'UNREADABLE_DOCUMENT'
              ? 'Unable to Read Document'
              : data?.errorType === 'RATE_LIMITED'
                ? 'High Demand Experienced'
                : data?.errorType === 'FILE_TOO_LARGE'
                  ? 'File Size Exceeded'
                  : "We're experiencing high demand."),
          message:
            data?.message ||
            'Our resume review service is temporarily busy. Please try again in a little while. Your resume has not been assessed yet.',
          secondaryText: data?.secondaryText || 'Thank you for your patience.',
        });
        return;
      }

      setAuditResult(data.assessment);
      setViewState('results');

      // Cache lightweight assessment metadata for Candidate Activity card & portal
      try {
        if (typeof window !== 'undefined' && data.assessment) {
          localStorage.setItem(
            'hopepitome_last_assessment',
            JSON.stringify({
              assessmentId: data.assessment.assessmentId,
              candidateName: data.assessment.candidateProfile?.candidateName || 'Candidate',
              profession:
                data.assessment.candidateProfile?.actualProfession ||
                data.assessment.inferredRole ||
                'Professional',
              overallScore: data.assessment.overallScore || 0,
              timestamp: new Date().toISOString(),
              fileName: targetFile?.name || currentFileName || 'Resume.pdf',
              unlocked: data.assessment.isUnlocked || false,
            })
          );
        }
      } catch {}
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsSubmitting(false);
      setViewState('idle');
      setHighDemandError({
        heading: "We're experiencing high demand.",
        message:
          'Our resume review service is temporarily busy. Please try again in a little while. Your resume has not been assessed yet.',
        secondaryText: 'Thank you for your patience.',
      });
    }
  };

  const handleStartNewAssessment = () => {
    if (viewState === 'results') {
      const confirmed = window.confirm(
        'Start a new assessment? Your current career report view will be reset.'
      );
      if (!confirmed) return;
    }
    setViewState('idle');
    activeFileRef.current = null;
    activeBase64Ref.current = null;
    setFile(null);
    setFileName('');
    setFileSize(0);
    setFileBase64(null);
    setFileMimeType('');
    setResumeText('');
    setUploadId('');
    setAuditResult(null);
    setHighDemandError(null);
    setGenericErrorMessage(null);
    setShowJdInput(false);
    setJobDescription('');
    setIsReadingFile(false);
    setIsSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenLeadModal = (card?: LockedImprovementCard, service?: RecommendedServiceItem) => {
    setIsUnlockRequest(false);
    setSelectedModalCard(card || null);
    setSelectedService(service || null);
    setSelectedAddonServices([]);
    if (!leadName && activeResult?.candidateProfile?.name) {
      setLeadName(activeResult.candidateProfile.name);
    }
    setLeadRequirements(
      card
        ? `Focus requested on: ${card.title}. Reason: ${card.reason}`
        : service
          ? `Inquiry for ${service.name}. Addressed areas: ${service.addressedAreas.join(', ')}`
          : 'Resume consultation and assessment review.'
    );
    setEnquirySuccessRef(null);
    setConversionModalOpen(true);
  };

  const handleOpenCustomQuoteModal = (serviceName: string, prefillNote?: string) => {
    setIsUnlockRequest(false);
    setSelectedModalCard(null);
    setSelectedService({
      code: 'CUSTOM',
      name: serviceName,
      tagline: 'Custom Tailored Service Scope',
      pricingLabel: 'Quote Based on Scope',
      ctaText: 'Get My Custom Quote',
      quoteMessage: prefillNote || 'Request a custom service quotation tailored to your career background.',
      isPrimary: true,
      addressedAreas: [],
    });
    setSelectedAddonServices([]);
    if (!leadName && activeResult?.candidateProfile?.name) {
      setLeadName(activeResult.candidateProfile.name);
    }
    setLeadRequirements(
      prefillNote ||
      `[ATS Assessment Ref: ${activeResult?.assessmentId || 'N/A'}] Requesting personalized custom quote for ${serviceName}. Target Role: ${activeResult?.inferredRole || activeResult?.targetRole || 'Professional'}.`
    );
    setEnquirySuccessRef(null);
    setConversionModalOpen(true);
  };

  const handleOpenUnlockModal = (sectionTitle?: string) => {
    setIsUnlockRequest(true);
    setSelectedModalCard(null);
    setSelectedService(null);
    setSelectedAddonServices([]);
    if (!leadName && activeResult?.candidateProfile?.name) {
      setLeadName(activeResult.candidateProfile.name);
    }
    setLeadRequirements(
      sectionTitle
        ? `Requesting complete Career Intelligence Report unlock (₹49) for section: ${sectionTitle}`
        : 'Requesting complete Career Intelligence Report unlock (₹49)'
    );
    setEnquirySuccessRef(null);
    setConversionModalOpen(true);
  };

  const toggleAddonService = (serviceName: string) => {
    setSelectedAddonServices((prev) =>
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName]
    );
  };

  const handleSelectServiceDirect = (service: RecommendedServiceItem) => {
    if (onServiceSelect) {
      onServiceSelect(service.code, activeResult?.assessmentId);
    } else {
      handleOpenLeadModal(undefined, service);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      alert('Please fill in your name, email, and contact number.');
      return;
    }

    setEnquirySubmitting(true);
    try {
      const targetServiceName = isUnlockRequest
        ? 'Premium Career Intelligence Report Unlock (₹49)'
        : (selectedService?.name || selectedModalCard?.recommendedServiceName || 'Professional Resume Writing');

      const allServices = isUnlockRequest
        ? ['Premium Career Intelligence Report Unlock (₹49)', ...selectedAddonServices]
        : [targetServiceName, ...selectedAddonServices];

      const payload = {
        fullName: leadName.trim(),
        email: leadEmail.trim().toLowerCase(),
        phoneWhatsapp: leadPhone.trim(),
        serviceRequired: targetServiceName,
        selectedServices: allServices,
        preferredContactMethod: leadContactMethod,
        targetRole: activeResult?.inferredRole || activeResult?.targetRole,
        totalExperience: activeResult?.candidateProfile?.totalYearsExperience || activeResult?.careerIntelligence?.totalYearsExperience
          ? `${activeResult?.candidateProfile?.totalYearsExperience || activeResult?.careerIntelligence?.totalYearsExperience} years`
          : undefined,
        requirements: `[ATS Assessment Ref: ${activeResult?.assessmentId || 'N/A'}] ${isUnlockRequest ? '[REQUEST: ₹49 Premium Report Unlock (Zero Payment Gateway - Admin Approval Needed)] ' : ''}${leadRequirements.trim()}`,
        leadSource: 'integrated_career_services_ats_checker',
        assessmentId: activeResult?.assessmentId,
        consent: true,
      };

      const res = await fetch('/api/career-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setEnquirySuccessRef(data.referenceCode || `HP-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        alert(data.error || 'Failed to submit your request. Please try again.');
      }
    } catch {
      alert('Unable to submit your request right now. Please check your connection.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const activeResult = viewState === 'sample' ? SAMPLE_PREVIEW : auditResult;

  // Formatting helpers
  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-500', stroke: '#10B981', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 75) return { text: 'text-violet-600', stroke: '#7357F5', bg: 'bg-violet-50 text-violet-700 border-violet-200' };
    if (score >= 60) return { text: 'text-amber-500', stroke: '#F59E0B', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { text: 'text-rose-500', stroke: '#EF4444', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const getInterpretationLabel = (score: number): string => {
    if (score >= 90) return 'Excellent Profile Presentation';
    if (score >= 75) return 'Good Potential';
    if (score >= 60) return 'Needs Improvement';
    return 'Significant Improvements Recommended';
  };

  const getRoleBadgeStyle = (category: RoleMatchCategory) => {
    switch (category) {
      case 'DIRECT_FIT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PROGRESSION':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'ADJACENT':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <section
      id="resume-checker"
      ref={checkerSectionRef}
      className={`relative scroll-mt-24 py-16 sm:py-20 bg-gradient-to-b from-[#FAF8FF] via-white to-[#FAF8FF] ${className}`}
    >
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-[#7357F5]/5 via-[#48C7E8]/5 to-[#FF7187]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* =========================================================================
            SECTION HEADER
           ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#7357F5]/20 shadow-sm text-xs font-bold text-[#7357F5] mb-3">
            <ScanSearch className="w-3.5 h-3.5 text-[#7357F5]" />
            <span>FREE AI RESUME CHECKER</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#17152F] tracking-tight leading-tight">
            Discover What Your Resume Can Do.
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Check your resume quality, ATS compatibility, matching job roles and potential career markets — all in one place.
          </p>
        </div>

        {/* =========================================================================
            STATE 1: IDLE / UPLOAD INTERFACE
           ========================================================================= */}
        {viewState === 'idle' && (
          <div className="max-w-3xl mx-auto">
            {/* Friendly High Demand Notification */}
            {highDemandError && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/90 p-5 sm:p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-amber-950">{highDemandError.heading}</h3>
                    <p className="mt-1 text-sm text-amber-900 leading-relaxed">{highDemandError.message}</p>
                    <p className="mt-1 text-xs text-amber-800/80 font-medium">{highDemandError.secondaryText}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleStartReview()}
                        className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 transition shadow-sm flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHighDemandError(null)}
                        className="text-xs font-semibold text-amber-900 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generic File Error Alert */}
            {genericErrorMessage && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{genericErrorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setGenericErrorMessage(null)}
                  className="text-rose-500 hover:text-rose-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Card */}
            <div className="bg-white rounded-3xl border border-[#7357F5]/20 shadow-xl shadow-[#7357F5]/5 p-6 sm:p-10">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFile(e.dataTransfer.files?.[0] || null);
                }}
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 ${isDragging
                    ? 'border-[#7357F5] bg-[#7357F5]/5 scale-[0.99]'
                    : file
                      ? 'border-emerald-300 bg-emerald-50/30'
                      : 'border-slate-200 hover:border-[#7357F5]/40 hover:bg-slate-50/50'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="career-resume-input"
                  accept=".pdf,.docx,.doc,.txt,.jpg,.jpeg,.png,.webp"
                  onChange={(e) => handleFile(e.target.files?.[0] || null)}
                  className="sr-only"
                />

                {!file ? (
                  <label htmlFor="career-resume-input" className="cursor-pointer flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7357F5]/10 to-[#9B6BFF]/15 text-[#7357F5] flex items-center justify-center mb-4 shadow-inner">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-[#17152F]">
                      Drag and drop your resume here, or <span className="text-[#7357F5] underline underline-offset-4">browse</span>
                    </span>
                    <span className="mt-2 text-xs sm:text-sm text-slate-500">
                      Supports PDF, DOCX, and photo/scanned documents (up to 8MB)
                    </span>
                  </label>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <span className="text-base font-bold text-slate-900">{fileName}</span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {(fileSize / 1024).toFixed(1)} KB • {isReadingFile ? 'Reading document...' : 'Ready for assessment'}
                    </span>
                    <label
                      htmlFor="career-resume-input"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-3 text-xs font-bold text-[#7357F5] hover:underline cursor-pointer"
                    >
                      Change File
                    </label>
                  </div>
                )}
              </div>

              {/* Optional Target Job Description Toggle */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#7357F5] transition"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#7357F5]" />
                    <span>Targeting a specific role? Add job description (Optional)</span>
                  </span>
                  {showJdInput ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showJdInput && (
                  <div className="mt-3">
                    <textarea
                      rows={4}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the target job description or requirements here to receive customized job-match insights..."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#7357F5] focus:ring-2 focus:ring-[#7357F5]/20 outline-none transition"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Optional: Adds keyword alignment and requirement coverage metrics.
                    </p>
                  </div>
                )}
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="mt-5 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="privacy-consent-embedded"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#7357F5] focus:ring-[#7357F5]/30 cursor-pointer"
                />
                <label htmlFor="privacy-consent-embedded" className="text-xs text-slate-500 leading-snug cursor-pointer select-none">
                  I agree to have my resume analyzed for this free career assessment. Documents are handled confidentially and never sold or shared.
                </label>
              </div>

              {/* Primary Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleStartReview()}
                  disabled={!file || isReadingFile || isSubmitting}
                  className={`w-full py-4 rounded-2xl text-sm sm:text-base font-bold text-white transition flex items-center justify-center gap-2 shadow-lg ${file && !isReadingFile && !isSubmitting
                      ? 'bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-[#7357F5]/30 active:scale-[0.99]'
                      : 'bg-slate-300 cursor-not-allowed shadow-none'
                    }`}
                >
                  <ScanSearch className="w-4 h-4" />
                  <span>
                    {isReadingFile
                      ? 'Preparing Document...'
                      : isSubmitting
                        ? 'Reviewing Your Resume...'
                        : 'Upload & Check for Free'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Preview Trigger */}
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setViewState('sample')}
                  className="text-xs font-semibold text-slate-500 hover:text-[#7357F5] transition underline underline-offset-4"
                >
                  Want to see a sample report first? Click here to view a preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: PROCESSING / INLINE SCANNING EXPERIENCE
           ========================================================================= */}
        {viewState === 'processing' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#7357F5]/20 shadow-xl shadow-[#7357F5]/5 p-8 sm:p-12 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#7357F5]/20 border-t-[#7357F5] animate-spin" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#7357F5]/10 to-[#9B6BFF]/20 flex items-center justify-center text-[#7357F5]">
                <FileText className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#17152F] tracking-tight">
              Reviewing Your Resume
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Our AI career scanner is evaluating your profile against modern recruitment benchmarks.
            </p>

            {/* 5 Sequential Processing Stages */}
            <div className="mt-8 space-y-3 max-w-md mx-auto text-left">
              {[
                { stage: 1, label: 'Reading your resume' },
                { stage: 2, label: 'Understanding your experience' },
                { stage: 3, label: 'Checking resume quality and ATS compatibility' },
                { stage: 4, label: 'Identifying matching careers and industries' },
                { stage: 5, label: 'Preparing your career report' },
              ].map((item) => {
                const isCompleted = processingStage > item.stage;
                const isCurrent = processingStage === item.stage;

                return (
                  <div
                    key={item.stage}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${isCurrent
                        ? 'bg-[#7357F5]/10 border border-[#7357F5]/20 text-[#17152F]'
                        : isCompleted
                          ? 'bg-slate-50 text-slate-700'
                          : 'opacity-40 text-slate-400'
                      }`}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-[#7357F5] border-t-transparent animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: RESULTS / INLINE CAREER REPORT
           ========================================================================= */}
        {(viewState === 'results' || viewState === 'sample') && activeResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Personalized Candidate Introduction Card */}
            <div className="bg-gradient-to-br from-white via-[#7357F5]/[0.02] to-[#7357F5]/[0.05] rounded-3xl border border-[#7357F5]/20 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17152F] tracking-tight">
                      Hello, {activeResult.candidateProfile?.name || 'Professional'}
                    </h2>
                    {viewState === 'sample' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                        Sample Preview
                      </span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-[#7357F5]">
                    {activeResult.candidateProfile?.actualProfession || activeResult.inferredRole || activeResult.targetRole || 'Professional Profile'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {activeResult.candidateProfile?.totalYearsExperience ? (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {activeResult.candidateProfile.totalYearsExperience}+ Years Experience
                      </span>
                    ) : null}
                    {activeResult.candidateProfile?.currentLocation ? (
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {activeResult.candidateProfile.currentLocation}
                      </span>
                    ) : null}
                    {activeResult.careerStage ? (
                      <span className="px-3 py-1 rounded-full bg-[#7357F5]/10 text-[#7357F5] text-xs font-semibold">
                        {activeResult.careerStage}
                      </span>
                    ) : null}
                    <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-xs font-medium">
                      Ref: {activeResult.assessmentId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={handleStartNewAssessment}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#7357F5] bg-white hover:bg-slate-50 border border-slate-200 transition shadow-sm flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Start New Assessment</span>
                  </button>
                </div>
              </div>

              {(activeResult.candidateProfile?.professionalSummary || activeResult.summary) && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {activeResult.candidateProfile?.professionalSummary || activeResult.summary}
                  </p>
                </div>
              )}
            </div>

            {/* Section Quick Navigation Bar */}
            <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2 shadow-md flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'sec-overview', label: 'Overview' },
                { id: 'sec-positioning', label: 'Positioning' },
                { id: 'sec-skills-gap', label: 'Skills Gap' },
                { id: 'sec-pathways', label: 'Growth Pathways' },
                { id: 'sec-readiness', label: 'Readiness Review' },
                { id: 'sec-interview', label: 'Interview Prep' },
                { id: 'sec-branding', label: 'Branding & LinkedIn' },
                { id: 'sec-action-plan', label: '30-60-90 Plan' },
                { id: 'sec-markets', label: 'Global Markets' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${activeSection === tab.id
                      ? 'bg-[#7357F5] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#7357F5] hover:bg-slate-100'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overall Career Readiness & 3 Core Indicators */}
            <div id="sec-overview" className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Primary Circular Score Card */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-[#7357F5]/20 shadow-xl shadow-[#7357F5]/5 p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Overall Career Readiness
                </span>

                {/* Circular Radial Score */}
                <div className="relative w-40 h-40 my-3 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={getScoreColor(activeResult.overallScore).stroke}
                      strokeWidth="10"
                      strokeDasharray={314.159}
                      strokeDashoffset={314.159 - (314.159 * activeResult.overallScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl sm:text-5xl font-black ${getScoreColor(activeResult.overallScore).text}`}>
                      {activeResult.overallScore}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">out of 100</span>
                  </div>
                </div>

                {/* Score Interpretation Band */}
                <div className="mt-2">
                  <span
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(activeResult.overallScore).bg
                      }`}
                  >
                    {activeResult.interpretation || getInterpretationLabel(activeResult.overallScore)}
                  </span>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-relaxed max-w-sm">
                  Evaluates resume communication clarity, presentation effectiveness, and ATS structure.
                </p>

                {/* Disclaimer */}
                <p className="mt-2 text-[10px] text-slate-400 italic">
                  *Indicative communication assessment. Does not constitute a hiring guarantee or interview prediction.
                </p>
              </div>

              {/* Three Supporting Indicators */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Resume Quality */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7357F5] flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Indicator 1
                    </span>
                    <h4 className="text-base font-bold text-[#17152F] mt-1">Resume Quality</h4>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Clarity and professionalism with which your achievements and career progression are communicated.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-[#17152F]">
                      {activeResult.generalQualityScore || 85}%
                    </span>
                    <span className="text-[11px] font-bold text-[#7357F5]">Presentation</span>
                  </div>
                </div>

                {/* 2. ATS Compatibility */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#0E7490] flex items-center justify-center mb-3">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Indicator 2
                    </span>
                    <h4 className="text-base font-bold text-[#17152F] mt-1">ATS Compatibility</h4>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      Ease with which standard corporate applicant tracking systems parse your document structure.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-2xl font-black text-[#17152F]">
                      {activeResult.atsCompatibilityScore || 88}%
                    </span>
                    <span className="text-[11px] font-bold text-[#0E7490]">Parse Rate</span>
                  </div>
                </div>

                {/* 3. Recruiter Visibility */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Indicator 3
                    </span>
                    <h4 className="text-base font-bold text-[#17152F] mt-1">Recruiter Visibility</h4>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      How quickly a hiring manager can identify your primary value proposition and competencies.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#17152F]">
                        {activeResult.recruiterVisibilityScore || 84}%
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {activeResult.recruiterVisibilityLabel || 'Good potential'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Career Positioning Analysis */}
            {activeResult.careerIntelligence?.careerPositioning && (
              <div id="sec-positioning" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#7357F5] flex items-center justify-center">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        Career Positioning Analysis
                      </h3>
                      <p className="text-xs text-slate-500">
                        How your experience and professional identity position you in the hiring market
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7357F5]/10 text-[#7357F5]">
                    {activeResult.careerIntelligence.careerPositioning.communicationEffectiveness?.rating || 'Strong'} Communication
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Professional Identity</span>
                    <p className="text-sm font-bold text-[#17152F]">
                      {activeResult.careerIntelligence.careerPositioning.professionalIdentity}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Career Stage</span>
                    <p className="text-sm font-bold text-[#17152F]">
                      {activeResult.careerIntelligence.careerPositioning.careerStage}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Experience Level</span>
                    <p className="text-sm font-bold text-[#17152F]">
                      {activeResult.careerIntelligence.careerPositioning.experienceLevel}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Primary Domain</span>
                    <p className="text-sm font-bold text-[#17152F]">
                      {activeResult.careerIntelligence.careerPositioning.strongestDomain}
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50/60 to-indigo-50/40 border border-[#7357F5]/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#7357F5] uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>Recommended Professional Positioning Pitch</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    "{activeResult.careerIntelligence.careerPositioning.recommendedPositioningPitch}"
                  </p>
                  <p className="text-[11px] text-slate-500 pt-1">
                    {activeResult.careerIntelligence.careerPositioning.communicationEffectiveness?.reason}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Skills Gap Analysis */}
            {activeResult.careerIntelligence?.skillsGapAnalysis && (
              <div id="sec-skills-gap" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        Skills Gap & Keyword Alignment
                      </h3>
                      <p className="text-xs text-slate-500">
                        Benchmarked against competitive hiring requirements in your field
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    {activeResult.careerIntelligence.skillsGapAnalysis.verifiedStrengths?.length || 0} Evidenced Skills
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Verified Strengths */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-[#17152F] uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Evidenced Core Competencies
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeResult.careerIntelligence.skillsGapAnalysis.verifiedStrengths?.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing & High-Value Competencies */}
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        High-Impact Keywords to Spotlight
                      </span>
                      <span className="text-[11px] font-bold text-amber-700">Recruiter Priority</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeResult.careerIntelligence.skillsGapAnalysis.missingFromResume?.map((kw, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-white border border-amber-200 text-xs font-semibold text-amber-900 shadow-2xs">
                          + {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-amber-800/80 pt-1">
                      Integrating these high-frequency terminology clusters into your work history will increase ATS keyword ranking into the top quartile.
                    </p>
                  </div>
                </div>

                {/* Recommended for Development */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17152F] uppercase tracking-wider flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[#7357F5]" />
                      Targeted Career Development Roadmap
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenLeadModal(activeResult.improvementAreas?.[0] || null)}
                      className="text-xs font-bold text-[#7357F5] hover:underline flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock Custom Upskilling Plan</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tools & Software</span>
                      <ul className="text-xs text-slate-700 space-y-1 font-medium">
                        {activeResult.careerIntelligence.skillsGapAnalysis.recommendedForDevelopment?.tools?.map((t, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7357F5]" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Certifications & Credentials</span>
                      <ul className="text-xs text-slate-700 space-y-1 font-medium">
                        {activeResult.careerIntelligence.skillsGapAnalysis.recommendedForDevelopment?.certifications?.map((c, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Strategic Competencies</span>
                      <ul className="text-xs text-slate-700 space-y-1 font-medium">
                        {activeResult.careerIntelligence.skillsGapAnalysis.recommendedForDevelopment?.technicalOrFunctional?.map((f, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Career Growth Pathways */}
            {activeResult.careerIntelligence?.growthOpportunities && (
              <div id="sec-pathways" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[#0E7490] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        Career Growth Pathways (3 Tiers)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Roles structured by immediate suitability, advancement, and lateral transition
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tier 1: Suitable Now */}
                  <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                          Tier 1 • Suitable Now
                        </span>
                        <span className="text-xs font-bold text-emerald-700">Immediate Fit</span>
                      </div>
                      <div className="space-y-2">
                        {activeResult.careerIntelligence.growthOpportunities.suitableNow?.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-emerald-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#17152F]">{r.roleTitle}</span>
                              <span className="text-xs font-extrabold text-emerald-600">{r.compatibilityScore}%</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{r.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-700/80 font-medium pt-2">
                      Ready for immediate direct-hire applications with current credentials.
                    </span>
                  </div>

                  {/* Tier 2: Next Level */}
                  <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-200/60 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                          Tier 2 • Next Level
                        </span>
                        <span className="text-xs font-bold text-[#7357F5]">Progression</span>
                      </div>
                      <div className="space-y-2">
                        {activeResult.careerIntelligence.growthOpportunities.nextLevel?.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-purple-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#17152F]">{r.roleTitle}</span>
                              <span className="text-xs font-extrabold text-[#7357F5]">{r.compatibilityScore}%</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{r.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenLeadModal(activeResult.improvementAreas?.[0] || null)}
                      className="w-full py-2 rounded-xl bg-white hover:bg-purple-50 text-xs font-bold text-[#7357F5] border border-purple-200 transition flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Promotion Strategy</span>
                    </button>
                  </div>

                  {/* Tier 3: Adjacent & Transferable */}
                  <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/60 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                          Tier 3 • Adjacent Pivot
                        </span>
                        <span className="text-xs font-bold text-blue-700">Transferable</span>
                      </div>
                      <div className="space-y-2">
                        {activeResult.careerIntelligence.growthOpportunities.adjacentOpportunities?.map((r, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-white border border-blue-100 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#17152F]">{r.roleTitle}</span>
                              <span className="text-xs font-extrabold text-blue-600">{r.compatibilityScore}%</span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2">{r.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenLeadModal(activeResult.improvementAreas?.[0] || null)}
                      className="w-full py-2 rounded-xl bg-white hover:bg-blue-50 text-xs font-bold text-blue-700 border border-blue-200 transition flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Transition Blueprint</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Job Application Readiness Review */}
            {activeResult.careerIntelligence?.applicationReadiness && (
              <div id="sec-readiness" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 text-[#7357F5] flex items-center justify-center">
                      <ListChecks className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        Job Application Readiness Review (8 Pillars)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Comprehensive structural and recruiter review checklist
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#17152F]">
                      {activeResult.careerIntelligence.applicationReadiness.overallScore || 85}%
                    </span>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Readiness</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeResult.careerIntelligence.applicationReadiness.pillars?.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#17152F]">{p.pillar}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : p.status === 'Needs Enhancement' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{p.observation}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prioritized Action Checklist */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17152F] uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Prioritized Enhancement Checklist
                    </span>
                    <span className="text-[11px] font-bold text-[#7357F5]">Ranked by ROI</span>
                  </div>

                  <div className="space-y-2.5">
                    {activeResult.careerIntelligence.applicationReadiness.prioritizedActionChecklist?.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 mt-0.5 ${item.priority === 'High' ? 'bg-red-100 text-red-700' : item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {item.priority} Priority
                          </span>
                          <span className="text-xs text-slate-800 font-medium leading-snug">{item.item}</span>
                        </div>
                        <span className="text-[11px] text-[#7357F5] font-semibold shrink-0 pl-7 sm:pl-0">
                          {item.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Interview Preparation Insights */}
            {activeResult.careerIntelligence?.interviewPrep && (
              <div id="sec-interview" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7357F5] flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        Interview Preparation & STAR Framework
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tailored questions grounded in your actual background and accomplishments
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#7357F5]/10 text-[#7357F5]">
                    STAR Framework
                  </span>
                </div>

                {/* Interactive STAR Question 1 */}
                {activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions?.[0] && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-[#7357F5]/20 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#7357F5] text-white text-[10px] font-bold uppercase tracking-wider">
                          Sample Target Interview Question
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#17152F] mt-2">
                          "{activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions[0].question}"
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Evaluator's Purpose: {activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions[0].purpose}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black text-[#7357F5] uppercase tracking-wider block">S — Situation</span>
                        <p className="text-xs text-slate-600 leading-snug">
                          {activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions[0].suggestedStarApproach?.situation}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black text-[#0E7490] uppercase tracking-wider block">T — Task</span>
                        <p className="text-xs text-slate-600 leading-snug">
                          {activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions[0].suggestedStarApproach?.task}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block">A — Action</span>
                        <p className="text-xs text-slate-600 leading-snug">
                          {activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions[0].suggestedStarApproach?.action}
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">R — Result</span>
                        <p className="text-xs text-slate-600 leading-snug">
                          {activeResult.careerIntelligence.interviewPrep.roleSpecificQuestions[0].suggestedStarApproach?.result}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Locked Questions Teaser & Recruiter Concerns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-[#17152F] flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-[#7357F5]" />
                      Recruiter Concerns to Preempt
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {activeResult.careerIntelligence.interviewPrep.recruiterConcernsToPreempt?.map((c, idx) => (
                        <li key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-0.5">
                          <span className="font-bold text-slate-800 block">{c.concern}</span>
                          <span className="text-slate-500 text-[11px] block">{c.mitigationStrategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#17152F] to-[#241F47] text-white flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase mb-2">
                        <Lock className="w-3 h-3 text-[#FFD66B]" />
                        <span>Premium Module</span>
                      </div>
                      <h4 className="text-base font-bold text-white">Full STAR Interview Blueprint</h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        Unlock 10+ personalized behavioral, technical, and executive questions mapped directly to your work history.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenLeadModal(activeResult.improvementAreas?.[0] || null)}
                      className="mt-4 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-[#17152F] transition flex items-center justify-center gap-1.5"
                    >
                      <span>Get Custom Quote for Interview Prep</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Professional Branding & LinkedIn */}
            {activeResult.careerIntelligence?.professionalBranding && (
              <div id="sec-branding" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0077B5] flex items-center justify-center">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        Professional Branding & LinkedIn Optimization
                      </h3>
                      <p className="text-xs text-slate-500">
                        Executive framing and digital recruiter footprint alignment
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                    Personal Brand
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Target Resume Headline & UVP */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Resume Headline</span>
                      <p className="text-sm font-bold text-[#17152F]">
                        {activeResult.careerIntelligence.professionalBranding.targetResumeHeadline}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unique Value Proposition (UVP)</span>
                      <p className="text-xs sm:text-sm text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200">
                        "{activeResult.careerIntelligence.professionalBranding.uniqueValueProposition}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Core Competency Pillars</span>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {activeResult.careerIntelligence.professionalBranding.coreCompetencyPillars?.map((p, idx) => (
                          <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7357F5]" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Copywriting (Preview / Locked) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-white border border-blue-200/80 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0077B5] uppercase tracking-wider flex items-center gap-1.5">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn SEO Headline
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Recruiter SEO</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#17152F] bg-white p-3 rounded-xl border border-slate-200">
                        {activeResult.careerIntelligence.professionalBranding.linkedInHeadline}
                      </p>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">About Section Narrative Preview</span>
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed max-h-24 overflow-hidden relative">
                          <p className="whitespace-pre-line">{activeResult.careerIntelligence.professionalBranding.linkedInAboutSnippet}</p>
                          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenLeadModal(activeResult.improvementAreas?.[0] || null)}
                      className="w-full py-2.5 rounded-xl bg-[#7357F5] hover:bg-[#6344E8] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock Complete Executive LinkedIn Narrative</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. 30-60-90 Day Strategic Career Action Plan */}
            {activeResult.careerIntelligence?.actionPlan306090 && (
              <div id="sec-action-plan" className="scroll-mt-20 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                        30-60-90 Day Strategic Career Action Plan
                      </h3>
                      <p className="text-xs text-slate-500">
                        Phased execution roadmap to transition from evaluation to confirmed offers
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                    Phased Roadmap
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Days 1–30 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#7357F5]/10 text-[#7357F5] text-[10px] font-bold uppercase">
                          Phase 1 • Days 1–30
                        </span>
                        <span className="text-xs font-bold text-slate-700">Optimization</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#17152F]">
                        {activeResult.careerIntelligence.actionPlan306090.days1To30?.focus}
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        {activeResult.careerIntelligence.actionPlan306090.days1To30?.milestones?.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-slate-200 text-[11px] text-[#7357F5] font-bold">
                      Goal: {activeResult.careerIntelligence.actionPlan306090.days1To30?.expectedOutcome}
                    </div>
                  </div>

                  {/* Days 31–60 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0E7490]/10 text-[#0E7490] text-[10px] font-bold uppercase">
                          Phase 2 • Days 31–60
                        </span>
                        <span className="text-xs font-bold text-slate-700">Outreach</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#17152F]">
                        {activeResult.careerIntelligence.actionPlan306090.days31To60?.focus}
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        {activeResult.careerIntelligence.actionPlan306090.days31To60?.milestones?.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-slate-200 text-[11px] text-[#0E7490] font-bold">
                      Goal: {activeResult.careerIntelligence.actionPlan306090.days31To60?.expectedOutcome}
                    </div>
                  </div>

                  {/* Days 61–90 */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          Phase 3 • Days 61–90
                        </span>
                        <span className="text-xs font-bold text-slate-700">Conversion</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#17152F]">
                        {activeResult.careerIntelligence.actionPlan306090.days61To90?.focus}
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        {activeResult.careerIntelligence.actionPlan306090.days61To90?.milestones?.map((m, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-slate-200 text-[11px] text-emerald-700 font-bold">
                      Goal: {activeResult.careerIntelligence.actionPlan306090.days61To90?.expectedOutcome}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Matching Opportunities (Roles, Industries, Countries) */}
            {activeResult.careerIntelligence && (
              <div id="sec-markets" className="scroll-mt-20 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                  <Compass className="w-5 h-5 text-[#7357F5]" />
                  <h3 className="text-lg sm:text-xl font-bold text-[#17152F]">
                    Matching Opportunities & Market Shortlist
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Matching Roles */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#7357F5]" />
                      <h4 className="text-sm font-bold text-[#17152F]">Top Matching Roles</h4>
                    </div>

                    <div className="space-y-3">
                      {activeResult.careerIntelligence.roles.slice(0, 4).map((role) => (
                        <div key={role.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#17152F] leading-snug">{role.title}</span>
                            <span className="text-xs font-extrabold text-[#7357F5] shrink-0">
                              {role.compatibilityScore}%
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getRoleBadgeStyle(role.category)}`}>
                              {role.categoryLabel}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] text-slate-500 leading-tight line-clamp-2">
                            {role.matchReason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suitable Industries */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#48C7E8]" />
                      <h4 className="text-sm font-bold text-[#17152F]">Suitable Industries</h4>
                    </div>

                    <div className="space-y-3">
                      {activeResult.careerIntelligence.industries.slice(0, 3).map((ind) => (
                        <div key={ind.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#17152F] leading-snug">{ind.industryName}</span>
                            <span className="text-xs font-extrabold text-[#0E7490] shrink-0">
                              {ind.compatibilityScore}%
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] text-slate-500 leading-tight line-clamp-2">
                            {ind.domainKnowledgeMatch}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Country Compatibility */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-bold text-[#17152F]">Country Compatibility</h4>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {activeResult.careerIntelligence.targetCountriesSpecified
                          ? `${activeResult.careerIntelligence.countries.length} Markets (Target & Documented)`
                          : `${activeResult.careerIntelligence.countries.length} Documented ${activeResult.careerIntelligence.countries.length === 1 ? 'Market' : 'Markets'}`}
                      </span>
                    </div>

                    {!activeResult.careerIntelligence.targetCountriesSpecified && (
                      <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="leading-snug">
                          <span className="font-bold">Target employment countries not specified.</span>
                          <span className="block text-amber-700/90 text-[10px] mt-0.5">
                            Results grounded strictly in evidenced employment history: {activeResult.careerIntelligence.evidencedEmploymentCountries?.join(', ') || 'Documented markets'}.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {activeResult.careerIntelligence.countries.slice(0, 4).map((c) => (
                        <div key={c.countryCode} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{c.flagEmoji}</span>
                              <span className="text-xs font-bold text-[#17152F]">{c.countryName}</span>
                            </div>
                            <span className="text-xs font-extrabold text-emerald-600">
                              {c.alignmentScore}%
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                            <span>{c.region}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-200/70 font-semibold text-slate-700">
                              {c.marketType === 'TARGET' ? 'Target Market' : c.marketType === 'CURRENT' ? 'Current Employment Base' : 'Verified Regional Experience'}
                            </span>
                          </div>
                          {c.evidenceNote && (
                            <p className="mt-1.5 text-[10px] text-slate-500 leading-tight">
                              {c.evidenceNote}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Strengths */}
              <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-base font-bold text-[#17152F]">Your Key Strengths</h3>
                  </div>

                  <ul className="space-y-3">
                    {activeResult.strengthTitles.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                  These verified foundations will form the core of your professional positioning.
                </div>
              </div>

              {/* Locked Improvement Areas */}
              <div className="md:col-span-7 bg-white rounded-3xl border border-[#7357F5]/20 shadow-xl shadow-[#7357F5]/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#7357F5]" />
                    <h3 className="text-base font-bold text-[#17152F]">Areas Needing Attention</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#7357F5] bg-[#7357F5]/10 px-2.5 py-1 rounded-full">
                    Personalised Roadmap
                  </span>
                </div>

                <div className="space-y-3">
                  {activeResult.improvementAreas.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => handleOpenLeadModal(card)}
                      className="group p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/90 hover:border-[#7357F5]/40 transition cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#17152F] group-hover:text-[#7357F5] transition">
                          {card.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{card.teaserSubtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#7357F5] hidden sm:inline">
                          Unlock Advice
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#7357F5]/10 group-hover:bg-[#7357F5] text-[#7357F5] group-hover:text-white flex items-center justify-center transition">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personalized Career Service Conversion Section */}
            <PersonalizedCareerRecommendationSection
              assessment={activeResult}
              onSelectService={(serviceName, prefillNote) =>
                handleOpenCustomQuoteModal(serviceName, prefillNote)
              }
            />
          </div>
        )}

        {/* =========================================================================
            MODAL: PERSONALIZED RECOMMENDATIONS & CUSTOM QUOTE ENQUIRY
           ========================================================================= */}
        {conversionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setConversionModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              {!enquirySuccessRef ? (
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7454F5]/10 text-[#7454F5] text-xs font-bold mb-3">
                    <Award className="w-3.5 h-3.5" />
                    <span>
                      {isUnlockRequest ? 'Premium Career Intelligence' : 'Personalised Career Guidance'}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-black text-[#17152F] tracking-tight">
                      {isUnlockRequest
                        ? 'Unlock Complete Career Intelligence Report'
                        : selectedService?.name || selectedModalCard?.title || 'Personalised Career Guidance'}
                    </h3>
                  </div>

                  {isUnlockRequest ? (
                    <div className="mt-2 space-y-3">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#7454F5]/10 via-[#A78BFA]/10 to-[#7454F5]/5 border border-[#7454F5]/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#7454F5] uppercase tracking-wider block">
                            Configured Request Fee
                          </span>
                          <span className="text-lg font-black text-[#17152F]">₹49</span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#149B75] bg-[#149B75]/10 px-2.5 py-1 rounded-lg border border-[#149B75]/20">
                          24-Hour Verified Access
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-1">
                        <div className="font-bold text-[#17152F] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#149B75]" />
                          <span>Zero Payment Gateway Required</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          In accordance with application policy, no automated payment gateway is connected. Submitting this request issues an assessment reference code; our administrators verify your report and grant 24-hour access.
                        </p>
                      </div>

                      <div className="text-xs text-slate-700">
                        <span className="font-bold text-[#17152F] block mb-1.5">
                          Full Report Modules Included:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />Executive Positioning Pitch</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />Skills Gap & Target Keywords</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />3-Tier Career Growth Pathways</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />8-Pillar Application Readiness</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />STAR Method Interview Prep</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />LinkedIn & Branding Assets</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />30-60-90 Day Career Plan</span>
                          <span className="flex items-center"><Check className="w-3.5 h-3.5 text-[#149B75] mr-1 shrink-0" />Global Market Compatibility</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <div className="p-3.5 rounded-2xl bg-[#7454F5]/5 border border-[#7454F5]/20 text-xs text-slate-700">
                        <span className="font-bold text-[#7454F5] block mb-0.5">
                          Tailored Service: {selectedService?.name || 'Custom Career Consultation'}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Our senior career strategists will analyze your assessment findings (Ref: {activeResult?.assessmentId}) and prepare a customized scope proposal without fixed packages or automated obligations.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmitLead} className="mt-5 space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Tharun Jose"
                        className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#7454F5] focus:ring-2 focus:ring-[#7454F5]/20 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#7454F5] focus:ring-2 focus:ring-[#7454F5]/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone</label>
                        <input
                          type="tel"
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#7454F5] focus:ring-2 focus:ring-[#7454F5]/20 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Contact Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['WhatsApp', 'Phone', 'Email'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setLeadContactMethod(method)}
                            className={`min-h-[40px] py-2 rounded-xl text-xs font-bold border transition ${leadContactMethod === method
                                ? 'bg-[#7454F5] border-[#7454F5] text-white shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Service Quotation Checkboxes */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        {isUnlockRequest
                          ? 'Also request a custom quote for career services (Optional):'
                          : 'Combine with complementary services for your proposal (Optional):'}
                      </label>
                      <div className="space-y-1.5 text-xs text-slate-700">
                        {[
                          'Professional Resume Writing',
                          'ATS Resume Optimisation',
                          'LinkedIn Profile Makeover',
                          'Personal Portfolio Website',
                          'Managed Job Search & Applications',
                        ]
                          .filter((srv) => srv !== selectedService?.name)
                          .map((srv) => (
                            <label
                              key={srv}
                              className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-[11px]"
                            >
                              <input
                                type="checkbox"
                                checked={selectedAddonServices.includes(srv)}
                                onChange={() => toggleAddonService(srv)}
                                className="w-3.5 h-3.5 rounded text-[#7454F5] focus:ring-[#7454F5]/30 cursor-pointer"
                              />
                              <span>{srv}</span>
                            </label>
                          ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
                      <textarea
                        rows={2}
                        value={leadRequirements}
                        onChange={(e) => setLeadRequirements(e.target.value)}
                        placeholder="Target roles, industry focus, or timeline..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#7454F5] focus:ring-2 focus:ring-[#7454F5]/20 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={enquirySubmitting}
                      className="w-full min-h-[46px] py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7454F5] via-[#9B6BFF] to-[#7454F5] hover:opacity-95 transition shadow-lg shadow-[#7454F5]/25 flex items-center justify-center gap-2 active:scale-98"
                    >
                      {enquirySubmitting ? (
                        <span>Submitting Request...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>
                            {isUnlockRequest
                              ? 'Submit Unlock Request (₹49)'
                              : 'Request a Custom Quote'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#17152F]">
                      {isUnlockRequest ? 'Unlock Request Submitted' : 'Enquiry Received'}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {isUnlockRequest
                        ? 'Your ₹49 report unlock request is queued for administrator review. Once verified, access will be granted for 24 hours.'
                        : 'Your resume assessment has been securely linked to your consultation request.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                      Assessment Reference Code
                    </span>
                    <span className="text-base font-black font-mono text-[#7454F5] block">
                      {enquirySuccessRef}
                    </span>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Save this code to check your report status anytime.
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/career-services/access-report"
                      className="w-full min-h-[44px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#7454F5] text-white text-xs font-bold hover:bg-[#6342E8] shadow-sm transition"
                    >
                      <span>Track / Access Report with Code →</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setConversionModalOpen(false)}
                      className="w-full min-h-[40px] py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
