'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
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
} from 'lucide-react';
import type {
  PublicAtsAuditResult,
  LockedImprovementCard,
  RecommendedServiceItem,
  RoleMatchCategory,
} from '@/lib/ai/types';
import { extractCleanTextFromDocument } from '@/lib/document-parser';

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
  },
  isLocked: true,
};

interface EmbeddedAtsResumeCheckerProps {
  onServiceSelect?: (serviceCode: string, assessmentId?: string) => void;
  className?: string;
}

export function EmbeddedAtsResumeChecker({ onServiceSelect, className = '' }: EmbeddedAtsResumeCheckerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [resumeText, setResumeText] = useState<string>('');
  const [showJdInput, setShowJdInput] = useState<boolean>(false);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // View state: 'idle' | 'processing' | 'results' | 'sample'
  const [viewState, setViewState] = useState<'idle' | 'processing' | 'results' | 'sample'>('idle');
  const [processingStage, setProcessingStage] = useState<number>(1);
  const [auditResult, setAuditResult] = useState<PublicAtsAuditResult | null>(null);

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

  const checkerSectionRef = useRef<HTMLDivElement>(null);

  const handleFile = async (selectedFile: File | null) => {
    if (!selectedFile) return;

    setHighDemandError(null);
    setGenericErrorMessage(null);

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setGenericErrorMessage('Please upload a PDF or DOCX file (under 8MB).');
      return;
    }

    if (selectedFile.size > 8 * 1024 * 1024) {
      setGenericErrorMessage('File size exceeds 8MB. Please choose a smaller document.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const extracted = await extractCleanTextFromDocument(buffer, selectedFile.name);
      if (!extracted || extracted.length < 50) {
        setGenericErrorMessage('We could not read enough clear text from this file. Please ensure it is a text-based PDF or Word document rather than a flat image scan.');
        return;
      }
      setResumeText(extracted);
    } catch (err: any) {
      setGenericErrorMessage('Failed to read file content. Please try another file or plain text format.');
    }
  };

  const handleStartReview = async (textToAssess?: string) => {
    const content = textToAssess || resumeText;

    if (!content || content.trim().length < 50) {
      setGenericErrorMessage('Please upload your resume (PDF or DOCX) to begin the assessment.');
      return;
    }

    if (!privacyConsent) {
      setGenericErrorMessage('Please accept the privacy terms to proceed with the free review.');
      return;
    }

    setHighDemandError(null);
    setGenericErrorMessage(null);
    setViewState('processing');
    setProcessingStage(1);

    // Smooth stage transitions
    const timer1 = setTimeout(() => setProcessingStage(2), 700);
    const timer2 = setTimeout(() => setProcessingStage(3), 1600);
    const timer3 = setTimeout(() => setProcessingStage(4), 2600);
    const timer4 = setTimeout(() => setProcessingStage(5), 3600);

    try {
      const payload: Record<string, any> = {
        resumeText: content,
        fileName: fileName || 'candidate_resume.pdf',
        isPublic: true,
      };

      if (jobDescription.trim().length >= 30) {
        payload.jobDescription = jobDescription.trim();
      }

      const res = await fetch('/api/career/ai/ats-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);

      if (!res.ok || !data.success) {
        setViewState('idle');
        setHighDemandError({
          heading: data?.heading || "We're experiencing high demand.",
          message:
            data?.message ||
            'Our resume review service is temporarily busy. Please try again in a little while. Your resume has not been assessed yet.',
          secondaryText: data?.secondaryText || 'Thank you for your patience.',
        });
        return;
      }

      setAuditResult(data.assessment);
      setViewState('results');
    } catch {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
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
    setFile(null);
    setFileName('');
    setFileSize(0);
    setResumeText('');
    setAuditResult(null);
    setHighDemandError(null);
    setGenericErrorMessage(null);
    setShowJdInput(false);
    setJobDescription('');
  };

  const handleOpenLeadModal = (card?: LockedImprovementCard, service?: RecommendedServiceItem) => {
    setSelectedModalCard(card || null);
    setSelectedService(service || null);
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
      const targetServiceName =
        selectedService?.name ||
        selectedModalCard?.recommendedServiceName ||
        'Professional Resume Writing';

      const payload = {
        fullName: leadName.trim(),
        email: leadEmail.trim().toLowerCase(),
        phoneWhatsapp: leadPhone.trim(),
        serviceRequired: targetServiceName,
        selectedServices: [targetServiceName],
        preferredContactMethod: leadContactMethod,
        targetRole: activeResult?.inferredRole || activeResult?.targetRole,
        totalExperience: activeResult?.careerIntelligence?.totalYearsExperience
          ? `${activeResult.careerIntelligence.totalYearsExperience} years`
          : undefined,
        requirements: `[ATS Assessment Ref: ${activeResult?.assessmentId || 'N/A'}] ${leadRequirements.trim()}`,
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
        alert(data.error || 'Failed to submit your enquiry. Please try again.');
      }
    } catch {
      alert('Unable to submit your enquiry right now. Please check your connection.');
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
            <Sparkles className="w-3.5 h-3.5 text-[#7357F5]" />
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
                className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-[#7357F5] bg-[#7357F5]/5 scale-[0.99]'
                    : file
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-200 hover:border-[#7357F5]/40 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="file"
                  id="career-resume-input"
                  accept=".pdf,.docx,.doc,.txt"
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
                      Supports PDF and DOCX documents (up to 8MB)
                    </span>
                  </label>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                      <FileCheck className="w-7 h-7" />
                    </div>
                    <span className="text-base font-bold text-slate-900">{fileName}</span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {(fileSize / 1024).toFixed(1)} KB • Text ready for review
                    </span>
                    <label
                      htmlFor="career-resume-input"
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
                  disabled={!file}
                  className={`w-full py-4 rounded-2xl text-sm sm:text-base font-bold text-white transition flex items-center justify-center gap-2 shadow-lg ${
                    file
                      ? 'bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-[#7357F5]/30 active:scale-[0.99]'
                      : 'bg-slate-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Check for Free</span>
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
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                      isCurrent
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
            {/* Top Bar: Assessment Badge & Reset Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7357F5]/10 text-[#7357F5] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#17152F]">
                      {activeResult.inferredRole || activeResult.targetRole || 'Professional Profile'}
                    </span>
                    {viewState === 'sample' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                        Sample Preview
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    Ref: {activeResult.assessmentId} • {activeResult.careerStage || 'Experienced Candidate'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartNewAssessment}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#7357F5] bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start New Assessment</span>
                </button>
              </div>
            </div>

            {/* Overall Career Readiness & 3 Core Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
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
                    className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${
                      getScoreColor(activeResult.overallScore).bg
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

            {/* Profile Matching Opportunities (Roles, Industries, Countries) */}
            {activeResult.careerIntelligence && (
              <div className="space-y-6">
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
                      <span className="text-[10px] font-semibold text-slate-400">16 Markets Analyzed</span>
                    </div>

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
                            <span className="px-1.5 py-0.5 rounded bg-slate-200/60 font-medium">
                              Visa: {c.workAuthStatus}
                            </span>
                          </div>
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

            {/* Service Conversion Section ("Make Your Resume Stronger with Hopepitome") */}
            <div className="bg-gradient-to-br from-[#17152F] via-[#241F47] to-[#17152F] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#7357F5]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A69ACB] mb-2 block">
                  Next Step Recommendation
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Make Your Resume Stronger with Hopepitome
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Based on your assessment results, our career strategists can rewrite, optimize, or position your profile for top employer ATS systems.
                </p>

                {/* Recommended Service Cards (Zero fixed prices) */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeResult.recommendedServices.map((srv) => (
                    <div
                      key={srv.code}
                      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-bold text-[#FFD66B] uppercase tracking-wider">
                            {srv.isPrimary ? 'Recommended Priority' : 'Complementary Service'}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1.5">{srv.name}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mb-4">{srv.tagline}</p>

                        <div className="space-y-1 mb-4">
                          {srv.addressedAreas.map((area, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-300 font-medium">{srv.pricingLabel}</span>
                        <button
                          type="button"
                          onClick={() => handleSelectServiceDirect(srv)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-[#17152F] bg-white hover:bg-slate-100 transition shadow-sm flex items-center gap-1"
                        >
                          <span>{srv.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7357F5]/10 text-[#7357F5] text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Personalised Career Guidance</span>
                  </div>

                  <h3 className="text-xl font-black text-[#17152F] tracking-tight">
                    {selectedService?.name || selectedModalCard?.title || 'Unlock Tailored Recommendations'}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Unlock detailed recommendations tailored to your background, including:
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>What specific phrasing needs to change in your summary and experience</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Which quantifiable details should be highlighted for senior roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>How to improve your positioning for target companies and markets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>An example of a professionally rewritten elevator pitch</span>
                    </li>
                  </ul>

                  <form onSubmit={handleSubmitLead} className="mt-6 space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#7357F5] focus:ring-2 focus:ring-[#7357F5]/20 outline-none"
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
                          placeholder="alex@example.com"
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#7357F5] focus:ring-2 focus:ring-[#7357F5]/20 outline-none"
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
                          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-[#7357F5] focus:ring-2 focus:ring-[#7357F5]/20 outline-none"
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
                            className={`py-2 rounded-xl text-xs font-bold border transition ${
                              leadContactMethod === method
                                ? 'bg-[#7357F5] border-[#7357F5] text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Additional Notes (Optional)</label>
                      <textarea
                        rows={2}
                        value={leadRequirements}
                        onChange={(e) => setLeadRequirements(e.target.value)}
                        placeholder="Tell us about your target roles, companies, or timeline..."
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-[#7357F5] focus:ring-2 focus:ring-[#7357F5]/20 outline-none"
                      />
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Pricing is tailored to your experience level and specific requirements. No fixed packages or obligations.
                    </p>

                    <button
                      type="submit"
                      disabled={enquirySubmitting}
                      className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] to-[#9B6BFF] hover:opacity-95 transition shadow-lg shadow-[#7357F5]/30 flex items-center justify-center gap-2"
                    >
                      {enquirySubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <span>Request a Custom Quote</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-[#17152F]">Enquiry Received</h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Thank you! Your resume assessment has been securely linked to your consultation request.
                  </p>
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">Reference Code</span>
                    <span className="text-base font-black text-[#7357F5]">{enquirySuccessRef}</span>
                  </div>
                  <p className="mt-4 text-xs text-slate-500">
                    A Hopepitome senior career consultant will review your assessment and reach out via {leadContactMethod} within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConversionModalOpen(false)}
                    className="mt-6 w-full py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
