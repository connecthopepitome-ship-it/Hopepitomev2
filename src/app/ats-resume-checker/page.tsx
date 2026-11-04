'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
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
  Compass,
  Building2,
  Globe,
  TrendingUp,
  Info,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type {
  PublicAtsAuditResult,
  LockedImprovementCard,
  RecommendedServiceItem,
  AtsCategoryKey,
  RoleMatchCategory,
} from '@/lib/ai/types';

// Interactive Sample Audit Preview Data (Universal & Custom Pricing Compliant)
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
  jobMatchDetails: {
    requiredSkillsFound: ['AWS Architecture', 'Kubernetes', 'Microservices', 'Distributed Systems'],
    transferableSkillsFound: ['Agile Team Leadership', 'System Resilience', 'Cost Optimization'],
    requiredSkillsNotEvidenced: ['Terraform Cloud Enterprise'],
    preferredSkillsFound: ['Mentorship', 'CI/CD Pipelines'],
    experienceAlignmentSummary:
      'Strong alignment with senior cloud architecture and cross-functional engineering leadership requirements.',
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
        'How to improve your professional positioning',
        'An example of a professionally rewritten summary',
      ],
      recommendedServiceCode: 'RESUME_WRITING',
      recommendedServiceName: 'Professional Resume Writing',
      pricingLabel: 'Quote Based on Requirements',
      ctaText: 'Request a Custom Quote',
      reason: 'Craft an authentic, high-impact opening summary tailored to hiring decision-makers.',
    },
    {
      id: 'imp_achievements',
      category: 'EXPERIENCE_ACHIEVEMENTS',
      title: 'Achievement Statements & Impact Phrasing',
      teaserSubtitle: 'Experience statements read as job tasks rather than measurable outcomes.',
      teaserBullets: [
        'Which bullet points lack quantified impact or business outcomes',
        'How to frame achievements using the Context-Action-Result method',
        'Professional rewrite templates tailored to your discipline',
      ],
      recommendedServiceCode: 'RESUME_WRITING',
      recommendedServiceName: 'Professional Resume Writing',
      pricingLabel: 'Quote Based on Requirements',
      ctaText: 'Improve My Resume',
      reason: 'Transform day-to-day duties into compelling evidence of capability and leadership.',
    },
    {
      id: 'imp_formatting',
      category: 'FORMATTING_COMPATIBILITY',
      title: 'ATS Formatting & Parser Stability',
      teaserSubtitle: 'Certain layout elements may create reading friction in applicant tracking systems.',
      teaserBullets: [
        'Hidden layout elements that may scramble text extraction in enterprise portals',
        'Single-column vs multi-column compatibility diagnosis for your file',
        'Standard layout formatting guidelines tailored for modern ATS systems',
      ],
      recommendedServiceCode: 'ATS_OPTIMISATION',
      recommendedServiceName: 'ATS Resume Optimisation',
      pricingLabel: 'Quote Based on Requirements',
      ctaText: 'Get My Resume Reviewed',
      reason: 'Ensure seamless readability across automated applicant tracking systems.',
    },
    {
      id: 'imp_keywords',
      category: 'SKILLS_RELEVANCE',
      title: 'Role-Specific Keywords & Competencies',
      teaserSubtitle: 'Important domain keywords and technical competencies are missing.',
      teaserBullets: [
        'High-frequency domain keywords missing from your current profile',
        'How to group skills into functional categories for recruiters and ATS',
        'Transferable skill articulation to maximize interview invitations',
      ],
      recommendedServiceCode: 'ATS_OPTIMISATION',
      recommendedServiceName: 'ATS Resume Optimisation',
      pricingLabel: 'Quote Based on Requirements',
      ctaText: 'Request a Custom Quote',
      reason: 'Incorporate relevant industry terminology to pass applicant screening filters.',
    },
  ],
  recommendedServices: [
    {
      code: 'RESUME_WRITING',
      name: 'Professional Resume Writing',
      pricingLabel: 'Custom Pricing',
      tagline: 'Tailored career narrative, achievement framing, and strategic positioning.',
      quoteMessage:
        'Every professional journey is different. We review your experience, career goals and resume requirements before preparing a customised quotation.',
      ctaText: 'Request a Custom Quote',
      addressedAreas: ['Professional Value Positioning', 'Achievement Framing', 'Career Narrative Rewrite'],
      isPrimary: true,
    },
    {
      code: 'ATS_OPTIMISATION',
      name: 'ATS Resume Optimisation',
      pricingLabel: 'Custom Pricing',
      tagline: 'Structure refinement, parser verification, and keyword alignment across applicant tracking systems.',
      quoteMessage:
        'Get your resume reviewed and improved based on its structure, content, target role and optimisation requirements.',
      ctaText: 'Get My Resume Reviewed',
      addressedAreas: ['ATS Layout Refinement', 'Domain Keyword Alignment', 'Parser Verification'],
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

export default function AtsResumeCheckerPage() {
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

  // Friendly High Demand / Busy Error State
  const [highDemandError, setHighDemandError] = useState<{
    heading: string;
    message: string;
    secondaryText: string;
  } | null>(null);
  const [genericErrorMessage, setGenericErrorMessage] = useState<string | null>(null);

  // Conversion Modal / CRM Intake
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

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Analytics event tracker
  const trackEvent = (eventName: string, metadata: Record<string, any> = {}) => {
    try {
      fetch('/api/career/ai/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          timestamp: new Date().toISOString(),
          metadata,
        }),
      }).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    trackEvent('page_view_simplified_ats', { path: '/ats-resume-checker' });
  }, []);

  // Text extraction from PDF / DOCX / TXT buffer
  const extractCleanTextFromBuffer = (buffer: ArrayBuffer, name: string): string => {
    const decoder = new TextDecoder('latin1');
    const raw = decoder.decode(buffer);

    if (name.toLowerCase().endsWith('.pdf')) {
      const matches: string[] = [];
      const parenRegex = /\(([^()\\]*(?:\\.[^()\\]*)*)\)/g;
      let m;
      while ((m = parenRegex.exec(raw)) !== null) {
        const str = m[1].replace(/\\[nrtbf]/g, ' ').replace(/\\/g, '').trim();
        if (str.length >= 2 && /[a-zA-Z]{2,}/.test(str) && !str.startsWith('/') && !str.startsWith('Font')) {
          matches.push(str);
        }
      }

      if (matches.length >= 15) {
        let combined = matches.join(' ').replace(/\s{2,}/g, ' ').trim();
        if (combined.length > 7000) combined = combined.substring(0, 7000);
        return combined;
      }
    }

    let text = raw
      .replace(/%PDF-[\d.]+/g, '')
      .replace(/<<[\s\S]*?>>/g, ' ')
      .replace(/stream[\s\S]*?endstream/g, ' ')
      .replace(/\b(obj|endobj|xref|trailer|startxref|\/Filter|\/FlateDecode|\/Length\d*)\b/gi, ' ')
      .replace(/[^\x20-\x7E\t\n\r]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    if (text.length > 7000) {
      text = text.substring(0, 7000);
    }

    return text;
  };

  // File parsing handler
  const processSelectedFile = (selectedFile: File) => {
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setGenericErrorMessage('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    setHighDemandError(null);
    setGenericErrorMessage(null);

    const reader = new FileReader();

    if (selectedFile.type.includes('text') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
      reader.onload = () => {
        const txt = String(reader.result || '').substring(0, 7000);
        setResumeText(txt);
      };
      reader.readAsText(selectedFile);
    } else {
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const clean = extractCleanTextFromBuffer(buffer, selectedFile.name);
        if (clean.length >= 60) {
          setResumeText(clean);
        } else {
          setResumeText('Candidate Resume Content Processed.');
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }

    trackEvent('resume_file_selected', { fileName: selectedFile.name, fileSize: selectedFile.size });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processSelectedFile(droppedFile);
    }
  };

  // Run audit submission with friendly high-demand retry handling
  const handleStartAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!resumeText.trim() || resumeText.length < 50) {
      setGenericErrorMessage('Please upload a resume file with readable text (at least 50 characters).');
      return;
    }

    if (!privacyConsent) {
      setGenericErrorMessage('Please agree to confidential processing to continue.');
      return;
    }

    setViewState('processing');
    setProcessingStage(1);
    setHighDemandError(null);
    setGenericErrorMessage(null);
    trackEvent('resume_assessment_started');

    const stageTimer1 = setTimeout(() => setProcessingStage(2), 600);
    const stageTimer2 = setTimeout(() => setProcessingStage(3), 1200);
    const stageTimer3 = setTimeout(() => setProcessingStage(4), 1800);

    try {
      const response = await fetch('/api/career/ai/ats-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim().substring(0, 7000),
          jobDescription: showJdInput && jobDescription.trim().length >= 30 ? jobDescription.trim().substring(0, 2000) : undefined,
          fileName: fileName || 'Candidate_Resume.pdf',
          isPublic: true,
        }),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setProcessingStage(5);

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Classify as friendly high demand
        setHighDemandError({
          heading: data.heading || "We're experiencing high demand.",
          message:
            data.message ||
            'Our resume review service is temporarily busy. Please try again in a little while. Your resume has not been assessed yet.',
          secondaryText: data.secondaryText || 'Thank you for your patience.',
        });
        setViewState('idle');
        return;
      }

      setAuditResult(data.assessment);
      setViewState('results');
      trackEvent('resume_assessment_completed', {
        assessmentId: data.assessment.assessmentId,
        overallScore: data.assessment.overallScore,
      });
    } catch {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      // Clean fallback error message without technical details
      setHighDemandError({
        heading: "We're experiencing high demand.",
        message:
          'Our resume review service is temporarily busy. Please try again in a little while. Your resume has not been assessed yet.',
        secondaryText: 'Thank you for your patience.',
      });
      setViewState('idle');
    }
  };

  // Open locked insight modal
  const handleOpenLockedCard = (card: LockedImprovementCard) => {
    setSelectedModalCard(card);
    const mappedService: RecommendedServiceItem = {
      code: card.recommendedServiceCode,
      name: card.recommendedServiceName,
      pricingLabel: 'Quote Based on Requirements',
      tagline: card.reason,
      quoteMessage:
        'Every professional journey is different. We review your experience, career goals and resume requirements before preparing a customised quotation.',
      ctaText: card.ctaText || 'Request a Custom Quote',
      addressedAreas: card.teaserBullets,
      isPrimary: true,
    };
    setSelectedService(mappedService);
    setConversionModalOpen(true);
    trackEvent('locked_card_opened', { category: card.category, title: card.title });
  };

  // Open service recommendation for custom quote
  const handleSelectService = (service: RecommendedServiceItem) => {
    setSelectedService(service);
    setSelectedModalCard(null);
    setConversionModalOpen(true);
    trackEvent('service_selected', { serviceCode: service.code });
  };

  // Submit Career Enquiry from Modal
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadName.trim() || !leadEmail.trim() || !leadPhone.trim()) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }

    setEnquirySubmitting(true);

    try {
      const payload = {
        fullName: leadName.trim(),
        email: leadEmail.trim(),
        phoneWhatsapp: leadPhone.trim(),
        preferredContactMethod: leadContactMethod,
        serviceRequired: selectedService?.name || 'Professional Resume Writing',
        selectedServices: [selectedService?.name || 'Professional Resume Writing'],
        targetRole: activeResult?.targetRole || activeResult?.inferredRole || 'Professional Role',
        careerStage: activeResult?.careerStage || 'Experienced professional',
        pricingPreference: 'CUSTOM_QUOTATION',
        requirements: `Origin: AI Resume Assessment (${activeResult?.assessmentId || 'direct'}).
Overall Career Readiness Score: ${activeResult?.overallScore || 'N/A'}/100.
Resume Quality: ${activeResult?.generalQualityScore || 'N/A'}% | ATS Compatibility: ${activeResult?.atsCompatibilityScore || 'N/A'}% | Recruiter Visibility: ${activeResult?.recruiterVisibilityLabel || 'Good'}.
Selected Service: ${selectedService?.name}.
Candidate Notes: ${leadRequirements.trim() || 'Custom quotation requested.'}`,
        assessmentId: activeResult?.assessmentId,
        resumeFileName: fileName || 'Candidate_Resume.pdf',
        consent: true,
      };

      const res = await fetch('/api/career-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setEnquirySuccessRef(data.referenceCode || 'HP-CAR-SUCCESS');
      trackEvent('career_enquiry_submitted', {
        referenceCode: data.referenceCode,
        serviceCode: selectedService?.code,
      });
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
    trackEvent('assessment_printed_pdf');
  };

  const activeResult = viewState === 'sample' ? SAMPLE_PREVIEW : auditResult;

  // Simple band color and badge helper
  const getBandInfo = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Excellent profile presentation',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ringColor: '#10B981',
      };
    }
    if (score >= 75) {
      return {
        label: 'Good potential',
        badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        ringColor: '#635BDB',
      };
    }
    if (score >= 60) {
      return {
        label: 'Needs improvement',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        ringColor: '#F59E0B',
      };
    }
    return {
      label: 'Significant improvements recommended',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      ringColor: '#F43F5E',
    };
  };

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col font-sans selection:bg-[#635BDB]/20 selection:text-[#635BDB]">
      {/* 1. BRAND HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">HOPEPITOME</span>
            <span className="text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#635BDB] text-white uppercase">
              Resume AI
            </span>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/career-services"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#635BDB] transition-colors"
            >
              Career Services
            </Link>
            <button
              onClick={() => {
                setViewState('idle');
                uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#635BDB] hover:bg-[#5249CE] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Check My Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* VIEW 1: LANDING & UPLOAD VIEW */}
        {/* ========================================================================= */}
        {viewState === 'idle' && (
          <div className="space-y-10">
            {/* Hero Heading (Plain English Positioning) */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[#635BDB] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Career Assessment</span>
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Your Resume. Your Career Opportunities.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                Upload your resume to discover how strong your profile is, which jobs match your experience and where you could build your career.
              </p>
            </div>

            {/* HIGH DEMAND ERROR CARD (Friendly, Plain Language, Preserves Uploaded Resume) */}
            {highDemandError && (
              <div className="max-w-xl mx-auto p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-3 shadow-xs animate-in fade-in">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-extrabold text-base text-amber-900">{highDemandError.heading}</h3>
                    <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">{highDemandError.message}</p>
                    <p className="text-xs text-amber-700 font-medium">{highDemandError.secondaryText}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                  <span className="text-xs text-amber-700 font-medium">
                    {file ? `Resume ready: ${fileName}` : 'Your text has been preserved.'}
                  </span>
                  <button
                    onClick={() => handleStartAudit()}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {/* GENERIC ERROR ALERT */}
            {genericErrorMessage && (
              <div className="max-w-xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{genericErrorMessage}</span>
                </div>
                <button onClick={() => setGenericErrorMessage(null)} className="text-rose-600 hover:opacity-70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Card */}
            <div
              ref={uploadSectionRef}
              className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#635BDB] bg-indigo-50/50'
                      : file
                      ? 'border-emerald-500 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-[#635BDB] bg-slate-50/60'
                  }`}
                  onClick={() => document.getElementById('resume-file-input')?.click()}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) processSelectedFile(f);
                    }}
                    className="hidden"
                  />

                  {file ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-[#0F172A]">{fileName}</p>
                      <p className="text-xs text-slate-500">
                        {(fileSize / 1024).toFixed(1)} KB • Click to choose a different file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#635BDB] flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#0F172A]">
                          Drag & drop your resume here, or <span className="text-[#635BDB] underline">browse</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, and TXT (Max 10MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Target Job Description */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowJdInput(!showJdInput)}
                    className="text-xs font-semibold text-[#635BDB] hover:text-[#5249CE] flex items-center space-x-1"
                  >
                    {showJdInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{showJdInput ? 'Remove target job description' : 'Have a target job description? (Optional)'}</span>
                  </button>

                  {showJdInput && (
                    <div className="space-y-1 pt-1 animate-in fade-in duration-200">
                      <textarea
                        rows={4}
                        placeholder="Paste a target job description if you would like to see how well your resume matches a specific role..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                      <p className="text-[11px] text-slate-500">
                        Evaluated as an independent match score. Does not lower your general resume score.
                      </p>
                    </div>
                  )}
                </div>

                {/* Privacy Consent */}
                <div className="flex items-start space-x-2 pt-1">
                  <input
                    id="privacy-consent"
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-[#635BDB] border-slate-300 rounded focus:ring-[#635BDB]"
                  />
                  <label htmlFor="privacy-consent" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                    I agree to have my resume reviewed confidentially. Personal contact numbers and emails are kept private.
                  </label>
                </div>

                {/* Primary CTA Button */}
                <button
                  onClick={handleStartAudit}
                  disabled={!file}
                  className={`w-full py-3.5 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-sm transition-all ${
                    file
                      ? 'bg-[#635BDB] hover:bg-[#5249CE] active:scale-[0.99]'
                      : 'bg-slate-300 cursor-not-allowed opacity-75'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Check My Resume — Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Preview Trigger */}
              <div className="bg-slate-50 border-t border-slate-200 p-3.5 text-center">
                <button
                  type="button"
                  onClick={() => setViewState('sample')}
                  className="text-xs font-semibold text-[#635BDB] hover:underline"
                >
                  Want to see how the report looks? View a Sample Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: AI REVIEW IN PROGRESS */}
        {/* ========================================================================= */}
        {viewState === 'processing' && (
          <div className="max-w-md mx-auto py-16 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#635BDB] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[#635BDB]">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">Reviewing Your Resume...</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                Assessing profile clarity, career opportunities, and recruiter presentation.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left space-y-3">
              {[
                { stage: 1, title: 'Reading resume experience and achievements' },
                { stage: 2, title: 'Evaluating profile presentation and clarity' },
                { stage: 3, title: 'Checking applicant tracking system readability' },
                { stage: 4, title: 'Identifying suitable job roles and industries' },
                { stage: 5, title: 'Preparing your career readiness report' },
              ].map((item) => {
                const isDone = processingStage > item.stage;
                const isCurrent = processingStage === item.stage;

                return (
                  <div key={item.stage} className="flex items-center space-x-3 text-xs">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-[#635BDB] border-t-transparent animate-spin shrink-0"></div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
                    )}
                    <span
                      className={`font-medium ${
                        isDone ? 'text-emerald-700' : isCurrent ? 'text-[#635BDB] font-bold' : 'text-slate-400'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: SIMPLIFIED RESULTS DASHBOARD */}
        {/* ========================================================================= */}
        {(viewState === 'results' || viewState === 'sample') && activeResult && (
          <div className="space-y-10">
            {/* Sample Banner */}
            {viewState === 'sample' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>SAMPLE REPORT</strong> — Showing how your career readiness assessment will appear.
                  </span>
                </div>
                <button
                  onClick={() => setViewState('idle')}
                  className="px-3 py-1 bg-amber-800 text-white rounded-lg font-bold text-xs"
                >
                  Upload Your Resume
                </button>
              </div>
            )}

            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BDB]">Assessment Report</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-0.5">
                  Your Career Readiness Report
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Profile: <strong>{activeResult.inferredRole || activeResult.targetRole}</strong> • Assessed on{' '}
                  {new Date(activeResult.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintPdf}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-[#0F172A] hover:bg-slate-50 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PDF</span>
                </button>
                <button
                  onClick={() => {
                    setViewState('idle');
                    setFile(null);
                    setResumeText('');
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#635BDB] text-white text-xs font-semibold hover:bg-[#5249CE] shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Another</span>
                </button>
              </div>
            </div>

            {/* 1. PROMINENT OVERALL CAREER READINESS SCORE */}
            {(() => {
              const band = getBandInfo(activeResult.overallScore);
              return (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                    {/* Main Circular Score Ring */}
                    <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke={band.ringColor}
                          strokeWidth="8"
                          strokeDasharray={`${(activeResult.overallScore / 100) * 263.8} 263.8`}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
                          {activeResult.overallScore}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">out of 100</span>
                      </div>
                    </div>

                    {/* Score Narrative & Bands */}
                    <div className="space-y-3 text-center md:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Overall Career Readiness Score
                        </span>
                        <span className={`text-xs font-extrabold px-3 py-0.5 rounded-full border ${band.badgeBg}`}>
                          {band.label}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                        {activeResult.summary}
                      </p>

                      {/* Transparent Disclaimer */}
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                        This score evaluates how effectively your current resume communicates your professional background and supports your job-search readiness. It does not predict or guarantee actual hiring or interview decisions.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. THREE SUPPORTING RESUME INDICATORS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Indicator 1: Resume Quality */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume Quality</span>
                    <span className="text-2xl font-extrabold text-[#635BDB]">{activeResult.generalQualityScore}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#635BDB] transition-all duration-700"
                      style={{ width: `${activeResult.generalQualityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    How clearly and professionally your resume communicates your experience, achievements and skills.
                  </p>
                </div>
              </div>

              {/* Indicator 2: ATS Compatibility */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Compatibility</span>
                    <span className="text-2xl font-extrabold text-emerald-600">{activeResult.atsCompatibilityScore}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${activeResult.atsCompatibilityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    How easily commonly used applicant tracking systems may extract, scan and understand your content and structure.
                  </p>
                </div>
              </div>

              {/* Indicator 3: Recruiter Visibility */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recruiter Visibility</span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                        activeResult.recruiterVisibilityLabel === 'Strong'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : activeResult.recruiterVisibilityLabel === 'Good potential'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {activeResult.recruiterVisibilityLabel || 'Good potential'}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#8B5CF6] transition-all duration-700"
                      style={{ width: `${activeResult.recruiterVisibilityScore || 80}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    An indicative assessment of how clearly your key accomplishments and capabilities stand out during a recruiter review.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. SUITABLE JOB ROLES & INDUSTRIES (Top 3-5 Matches) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Suitable Job Roles */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A] flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-[#635BDB]" />
                      <span>Matching Job Roles</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Jobs that align with your evidenced background and transferable skills.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(activeResult.careerIntelligence?.roles || []).slice(0, 4).map((role) => (
                    <div
                      key={role.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-[#0F172A]">{role.title}</h4>
                          <span className="text-[10px] font-semibold text-slate-400">({role.categoryLabel})</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{role.matchReason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-[#635BDB]">{role.compatibilityScore}%</span>
                        <span className="text-[10px] font-semibold text-slate-400 block -mt-0.5">match</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Suitable Industries */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#0F172A] flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#10B981]" />
                      <span>Suitable Industries</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sectors where your professional experience and methodologies fit naturally.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(activeResult.careerIntelligence?.industries || []).slice(0, 4).map((ind) => (
                    <div
                      key={ind.id}
                      className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-[#0F172A]">{ind.industryName}</h4>
                          <span className="text-[10px] font-semibold text-slate-400">({ind.categoryLabel})</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{ind.domainKnowledgeMatch}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-emerald-600">{ind.compatibilityScore}%</span>
                        <span className="text-[10px] font-semibold text-slate-400 block -mt-0.5">fit</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. COUNTRY COMPATIBILITY (16-Country Shortlist) */}
            {activeResult.careerIntelligence?.countries && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#635BDB]" />
                    <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A]">Country Market Compatibility</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shortlist of international career markets based on regional industry alignment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeResult.careerIntelligence.countries.slice(0, 6).map((country) => (
                    <div
                      key={country.countryCode}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-2.5"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl leading-none">{country.flagEmoji}</span>
                            <h4 className="font-bold text-sm text-[#0F172A]">{country.countryName}</h4>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-600">{country.alignmentScore}%</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{country.briefExplanation}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Work Authorisation:</span>
                        <span className="font-semibold text-slate-700">{country.workAuthStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                  A profile alignment score reflects resume suitability for regional industry needs. It is not proof that a job vacancy exists or that a candidate is legally authorized to work there.
                </p>
              </div>
            )}

            {/* 5. SIMPLE IMPROVEMENT REPORT (Strengths & Areas Needing Attention) */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Your Strengths */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-base text-[#0F172A]">Your Strengths</h3>
                  </div>

                  <div className="space-y-2.5">
                    {activeResult.strengthTitles.map((title, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start space-x-2.5 text-xs text-emerald-950 font-medium"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Areas Needing Attention */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5 text-[#635BDB]" />
                    <h3 className="font-extrabold text-base text-[#0F172A]">Areas Needing Attention</h3>
                  </div>

                  <div className="space-y-2.5">
                    {activeResult.improvementAreas.slice(0, 4).map((card) => (
                      <div
                        key={card.id}
                        onClick={() => handleOpenLockedCard(card)}
                        className="p-3.5 rounded-2xl bg-indigo-50/40 border border-indigo-100 hover:border-[#635BDB] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#635BDB] transition-colors">
                            {card.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{card.teaserSubtitle}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs font-bold text-[#635BDB] shrink-0 pl-2">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 6. RECOMMENDED HOPEPITOME SERVICES (Strict Custom Pricing Only) */}
            <div className="bg-gradient-to-br from-[#111B35] to-[#1E293B] rounded-3xl p-6 sm:p-10 text-white shadow-lg space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">Customized Support</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Recommended Career Services
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  Hopepitome provides customized resume and career services. Pricing is determined after understanding your specific experience and career goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeResult.recommendedServices.map((service) => (
                  <div
                    key={service.code}
                    className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-[#14B8A6]">
                          {service.isPrimary ? 'Primary Recommendation' : 'Recommended Service'}
                        </span>
                        <span className="text-xs font-bold text-slate-300">Quote Based on Scope</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <p className="text-xs text-slate-200 leading-relaxed">{service.quoteMessage}</p>
                    </div>

                    <button
                      onClick={() => handleSelectService(service)}
                      className="w-full py-3 rounded-xl bg-[#635BDB] hover:bg-[#5249CE] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md transition-all"
                    >
                      <span>{service.ctaText || 'Request a Custom Quote'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. LOCKED INSIGHTS & CUSTOM QUOTE MODAL */}
      {conversionModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-[#111B35] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6]">
                  {selectedModalCard ? 'Unlock Personalized Insights' : 'Custom Quotation Request'}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                  {selectedModalCard ? selectedModalCard.title : selectedService.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setConversionModalOpen(false);
                  setEnquirySuccessRef(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {enquirySuccessRef ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-extrabold text-[#0F172A]">Request Received!</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Your assessment reference has been saved. A career consultant will review your resume and reach out within 24 hours.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                    Reference: {enquirySuccessRef}
                  </div>
                  <button
                    onClick={() => {
                      setConversionModalOpen(false);
                      setEnquirySuccessRef(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#635BDB] text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                  {/* Unlock Preview Box */}
                  {selectedModalCard && (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                      <span className="text-xs font-extrabold text-[#635BDB]">Unlock to discover:</span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {selectedModalCard.teaserBullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#635BDB] shrink-0 mt-1.5"></span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="alex@example.com"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+971 50 ... / +91 ..."
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Contact Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['WhatsApp', 'Phone', 'Email'] as const).map((method) => (
                          <button
                            type="button"
                            key={method}
                            onClick={() => setLeadContactMethod(method)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                              leadContactMethod === method
                                ? 'bg-indigo-50 border-[#635BDB] text-[#635BDB]'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Any specific goals or questions? <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Tell us about the roles you are targeting or challenges you are facing..."
                        value={leadRequirements}
                        onChange={(e) => setLeadRequirements(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-3 rounded-xl bg-[#635BDB] hover:bg-[#5249CE] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-md transition-all"
                  >
                    <span>{enquirySubmitting ? 'Submitting...' : 'Request Custom Quote'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
