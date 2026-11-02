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
  Share2,
  FileCheck,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronRight,
  Target,
  Briefcase,
  Award,
  BookOpen,
  UserCheck,
  Sliders,
  RefreshCw,
  Phone,
  MessageSquare,
  Mail,
  X,
  ExternalLink,
  Check,
  Compass,
  FileSearch,
  Building2,
  GraduationCap,
} from 'lucide-react';
import type {
  PublicAtsAuditResult,
  LockedImprovementCard,
  RecommendedServiceItem,
  AtsCategoryKey,
} from '@/lib/ai/types';

const CATEGORY_META: Record<
  AtsCategoryKey,
  { icon: any; color: string; bg: string; borderColor: string; maxWeight: number }
> = {
  STRUCTURE_READABILITY: {
    icon: Layers,
    color: '#635BDB',
    bg: '#EEF2FF',
    borderColor: '#C7D2FE',
    maxWeight: 15,
  },
  PROFESSIONAL_SUMMARY: {
    icon: UserCheck,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    borderColor: '#DDD6FE',
    maxWeight: 10,
  },
  SKILLS_RELEVANCE: {
    icon: Sliders,
    color: '#14B8A6',
    bg: '#F0FDFA',
    borderColor: '#99F6E4',
    maxWeight: 20,
  },
  EXPERIENCE_ACHIEVEMENTS: {
    icon: Briefcase,
    color: '#10B981',
    bg: '#ECFDF5',
    borderColor: '#A7F3D0',
    maxWeight: 20,
  },
  EDUCATION_CERTIFICATIONS: {
    icon: BookOpen,
    color: '#F59E0B',
    bg: '#FFFBEB',
    borderColor: '#FDE68A',
    maxWeight: 10,
  },
  FORMATTING_COMPATIBILITY: {
    icon: FileCheck,
    color: '#635BDB',
    bg: '#EEF2FF',
    borderColor: '#C7D2FE',
    maxWeight: 15,
  },
  CONTACT_COMPLETENESS: {
    icon: Award,
    color: '#EC4899',
    bg: '#FDF2F8',
    borderColor: '#FBCFE8',
    maxWeight: 10,
  },
};

// Interactive Sample Audit Preview Data (Universal & Custom Pricing Compliant)
const SAMPLE_PREVIEW: PublicAtsAuditResult = {
  assessmentId: 'SAMPLE-ATS-AUDIT',
  timestamp: new Date().toISOString(),
  targetRole: 'Senior Cloud Solutions Architect',
  targetIndustry: 'Technology & Enterprise SaaS',
  inferredDomain: 'Cloud Infrastructure & Enterprise Systems',
  careerStage: 'Senior professional',
  inferredRole: 'Senior Cloud Solutions Architect',
  overallScore: 78,
  generalQualityScore: 82,
  atsCompatibilityScore: 85,
  grade: 'B',
  interpretation: 'Good',
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
    experienceAlignmentSummary: 'Strong alignment with senior cloud architecture and cross-functional engineering leadership requirements.',
  },
  categories: [
    { category: 'STRUCTURE_READABILITY', title: 'Resume Structure & Readability', weight: 15, rawScore: 80, weightedScore: 12, status: 'GOOD' },
    { category: 'PROFESSIONAL_SUMMARY', title: 'Professional Summary', weight: 10, rawScore: 70, weightedScore: 7, status: 'GOOD' },
    { category: 'SKILLS_RELEVANCE', title: 'Skills & Keyword Relevance', weight: 20, rawScore: 85, weightedScore: 17, status: 'EXCELLENT' },
    { category: 'EXPERIENCE_ACHIEVEMENTS', title: 'Work Experience & Achievements', weight: 20, rawScore: 75, weightedScore: 15, status: 'GOOD' },
    { category: 'EDUCATION_CERTIFICATIONS', title: 'Education & Certifications', weight: 10, rawScore: 80, weightedScore: 8, status: 'GOOD' },
    { category: 'FORMATTING_COMPATIBILITY', title: 'Formatting & ATS Parsing Compatibility', weight: 15, rawScore: 75, weightedScore: 11, status: 'GOOD' },
    { category: 'CONTACT_COMPLETENESS', title: 'Contact Details & Completeness', weight: 10, rawScore: 80, weightedScore: 8, status: 'GOOD' },
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
      title: 'Professional Summary & Executive Pitch',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'What core value proposition is missing from your opening narrative',
        'How to align your summary with your target career trajectory',
        'Tailored 3-sentence elevator pitch rewrite blueprint',
      ],
      recommendedServiceCode: 'RESUME_WRITING',
      recommendedServiceName: 'Professional Resume Writing',
      pricingLabel: 'Quote Based on Requirements',
      ctaText: 'Request a Custom Quote',
      reason: 'Craft an authentic, high-impact elevator pitch tailored to hiring decision-makers.',
    },
    {
      id: 'imp_formatting',
      category: 'FORMATTING_COMPATIBILITY',
      title: 'ATS Formatting & Parser Stability',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Hidden layout elements that trigger text scrambling in Workday and Taleo',
        'Single-column vs two-column compatibility diagnosis for your document',
        'Parse-certified layout guidelines tailored for enterprise ATS portals',
      ],
      recommendedServiceCode: 'ATS_OPTIMISATION',
      recommendedServiceName: 'ATS Resume Optimisation',
      pricingLabel: 'Quote Based on Requirements',
      ctaText: 'Get a Custom Quote',
      reason: 'Ensure seamless 100% parse-compliance across enterprise hiring systems.',
    },
  ],
  recommendedServices: [
    {
      code: 'RESUME_WRITING',
      name: 'Professional Resume Writing',
      pricingLabel: 'Custom Pricing',
      tagline: 'Tailored executive narrative, achievement framing, and strategic career storytelling.',
      quoteMessage:
        'Every professional journey is different. We review your experience, career goals and resume requirements before preparing a customised quotation.',
      ctaText: 'Request a Custom Quote',
      addressedAreas: ['Narrative Positioning', 'Achievement Phrasing', 'Executive Elevator Pitch'],
      isPrimary: true,
    },
    {
      code: 'ATS_OPTIMISATION',
      name: 'ATS Resume Optimisation',
      pricingLabel: 'Custom Pricing',
      tagline: 'Algorithmic structure refinement, parse validation, and keyword alignment across enterprise ATS platforms.',
      quoteMessage:
        'Get your resume reviewed and improved based on its structure, content, target role and optimisation requirements.',
      ctaText: 'Get a Custom Quote',
      addressedAreas: ['ATS Layout Refinement', 'Domain Keyword Alignment', 'Parser Verification'],
      isPrimary: false,
    },
  ],
  isLocked: true,
};

export default function AtsResumeCheckerPage() {
  // Input states
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [careerSeniority, setCareerSeniority] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Workflow states
  const [viewState, setViewState] = useState<'idle' | 'processing' | 'results' | 'sample'>('idle');
  const [processingStage, setProcessingStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<PublicAtsAuditResult | null>(null);
  const [showTextEditor, setShowTextEditor] = useState(false);

  // Modal / Conversion states (Custom Quotation Workflow)
  const [selectedModalCard, setSelectedModalCard] = useState<LockedImprovementCard | null>(null);
  const [selectedService, setSelectedService] = useState<RecommendedServiceItem | null>(null);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [enquirySuccessRef, setEnquirySuccessRef] = useState<string | null>(null);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);

  // Conversion lead form states
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCareerGoals, setLeadCareerGoals] = useState('');
  const [leadRequirements, setLeadRequirements] = useState('');
  const [leadContactMethod, setLeadContactMethod] = useState<'WhatsApp' | 'Email' | 'Phone Call'>('WhatsApp');

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Analytics event tracking helper
  const trackEvent = async (eventName: string, metadata: Record<string, any> = {}) => {
    try {
      await fetch('/api/career/ai/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          assessmentId: auditResult?.assessmentId,
          ...metadata,
        }),
      });
    } catch {
      // Non-blocking telemetry
    }
  };

  useEffect(() => {
    trackEvent('ats_landing_viewed');
  }, []);

  // Clean text extraction from PDF / DOCX / TXT buffer
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
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(selectedFile.size);
    setErrorMessage(null);

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
          setShowTextEditor(true);
          setResumeText(
            `[Scanned or Image-Based PDF Detected]\nPlease paste your resume text here to ensure high-accuracy AI auditing across all categories.`
          );
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }

    trackEvent('resume_uploaded', { fileName: selectedFile.name, fileSize: selectedFile.size });
  };

  // Drag & drop handlers
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

  // Run audit submission with universal intelligence (zero artificial role penalties)
  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeText.trim() || resumeText.length < 50) {
      setErrorMessage('Please upload a resume file with readable text (at least 50 characters).');
      return;
    }

    if (!privacyConsent) {
      setErrorMessage('Please accept the privacy disclosure to proceed with free AI processing.');
      return;
    }

    setViewState('processing');
    setProcessingStage(1);
    setErrorMessage(null);
    trackEvent('ats_audit_started', {
      targetRole: targetRole || 'auto-infer',
      hasJobDescription: Boolean(jobDescription),
    });

    const stageTimer1 = setTimeout(() => setProcessingStage(2), 700);
    const stageTimer2 = setTimeout(() => setProcessingStage(3), 1400);
    const stageTimer3 = setTimeout(() => setProcessingStage(4), 2100);

    try {
      const response = await fetch('/api/career/ai/ats-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim().substring(0, 7000),
          targetRole: targetRole.trim(),
          targetIndustry: targetIndustry.trim(),
          careerSeniority: careerSeniority.trim(),
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
        throw new Error(data.error || 'Failed to complete resume audit. Please retry in a few moments.');
      }

      setAuditResult(data.assessment);
      setViewState('results');
      trackEvent('ats_audit_completed', {
        assessmentId: data.assessment.assessmentId,
        overallScore: data.assessment.overallScore,
        generalQualityScore: data.assessment.generalQualityScore,
        atsCompatibilityScore: data.assessment.atsCompatibilityScore,
      });

      if (data.assessment.targetRole) {
        setLeadCareerGoals(data.assessment.targetRole);
      }
    } catch (err: any) {
      setViewState('idle');
      setErrorMessage(err.message || 'An error occurred during evaluation. Please retry.');
    }
  };

  // Open locked insight modal for custom quotation request
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
    trackEvent('locked_insight_opened', { category: card.category, service: card.recommendedServiceCode });
  };

  // Open service recommendation for custom quotation
  const handleSelectService = (service: RecommendedServiceItem) => {
    setSelectedService(service);
    setSelectedModalCard(null);
    setConversionModalOpen(true);
    trackEvent('service_recommendation_clicked', { serviceCode: service.code });
  };

  // Submit Career Enquiry from Modal (Creates CRM lead with custom quotation preference)
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
        targetRole: leadCareerGoals || targetRole || auditResult?.targetRole || 'Professional Role',
        careerStage: auditResult?.careerStage || 'Experienced professional',
        pricingPreference: 'CUSTOM_QUOTATION',
        requirements: `Origin: Universal ATS Resume Audit (${auditResult?.assessmentId || 'direct'}).
Overall Score: ${auditResult?.overallScore || 'N/A'}/100 (Quality: ${auditResult?.generalQualityScore || 'N/A'}, ATS: ${auditResult?.atsCompatibilityScore || 'N/A'}).
Selected Service: ${selectedService?.name}.
Candidate Notes: ${leadRequirements.trim() || 'Custom quotation requested based on audit.'}`,
        assessmentId: auditResult?.assessmentId,
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
    trackEvent('audit_summary_downloaded');
  };

  const activeResult = viewState === 'sample' ? SAMPLE_PREVIEW : auditResult;

  return (
    <div className="bg-[#F7F8FC] text-[#111B35] min-h-screen flex flex-col font-sans selection:bg-[#635BDB]/20 selection:text-[#635BDB]">
      {/* 1. STICKY BRAND HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <span className="font-extrabold text-xl tracking-tight text-[#111B35]">HOPEPITOME</span>
            <span className="text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#635BDB] text-white uppercase">
              ATS Studio
            </span>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/career-services"
              className="text-xs sm:text-sm font-semibold text-[#111B35]/70 hover:text-[#635BDB] transition-colors"
            >
              Career Services
            </Link>
            <button
              onClick={() => {
                uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#635BDB] hover:bg-[#5249CE] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Audit My Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN VIEWPORT */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* --- VIEW 1: LANDING & UPLOAD VIEW --- */}
        {viewState === 'idle' && (
          <div className="space-y-12">
            {/* Hero Heading */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#635BDB] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Universal Multi-Industry ATS Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111B35] tracking-tight leading-tight">
                How does your resume rate with <span className="text-[#635BDB]">recruiters & ATS</span>?
              </h1>
              <p className="text-base sm:text-lg text-[#111B35]/70 leading-relaxed max-w-2xl mx-auto">
                Get an objective, inclusive AI resume audit calibrated across all professions, experience levels, and
                career stages — from healthcare and engineering to supply chain, finance, and IT.
              </p>

              {/* 3-Step Mini Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left max-w-2xl mx-auto">
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#635BDB] font-extrabold text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-xs font-semibold text-[#111B35]">Upload resume (PDF/DOCX/TXT)</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F0FDFA] text-[#14B8A6] font-extrabold text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-xs font-semibold text-[#111B35]">View 3-dimension fair score</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] font-extrabold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-xs font-semibold text-[#111B35]">Get a bespoke custom quote</span>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {errorMessage && (
              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-start space-x-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Unable to process resume</p>
                  <p className="text-xs text-[#DC2626]/90 mt-0.5">{errorMessage}</p>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-[#DC2626] hover:opacity-70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Form Card */}
            <div
              ref={uploadSectionRef}
              className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-lg overflow-hidden"
            >
              <div className="p-6 sm:p-8 space-y-6">
                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#635BDB] bg-[#EEF2FF]'
                      : file
                      ? 'border-[#10B981] bg-[#ECFDF5]'
                      : 'border-[#CBD5E1] hover:border-[#635BDB] bg-[#F8FAFC]'
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
                      <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-sm text-[#111B35]">{fileName}</p>
                      <p className="text-xs text-[#111B35]/60">
                        {(fileSize / 1024).toFixed(1)} KB • Click to choose a different file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#EEF2FF] text-[#635BDB] flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#111B35]">
                          Drag & drop your resume here, or <span className="text-[#635BDB] underline">browse</span>
                        </p>
                        <p className="text-xs text-[#111B35]/50 mt-1">
                          Supports PDF, DOCX, and TXT (Max file size 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Candidate Context Inputs (Universal - Never Required) */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111B35]/70 mb-1">
                        Target Job Title <span className="text-gray-400 font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Registered Nurse, Lead Architect"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">Leave empty to auto-detect from resume</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111B35]/70 mb-1">
                        Industry / Domain <span className="text-gray-400 font-normal lowercase">(optional)</span>
                      </label>
                      <select
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB] bg-white"
                      >
                        <option value="">Auto-Detect from Resume (Default)</option>
                        <option value="Healthcare & Nursing">Healthcare & Life Sciences</option>
                        <option value="IT, Software & Cloud">IT, Software & Cloud</option>
                        <option value="Engineering & Manufacturing">Engineering & Manufacturing</option>
                        <option value="Supply Chain, Logistics & Procurement">Supply Chain & Logistics</option>
                        <option value="Finance, Banking & Accounting">Finance & Accounting</option>
                        <option value="Sales, Marketing & PR">Sales & Marketing</option>
                        <option value="Human Resources & Recruiting">Human Resources</option>
                        <option value="Education, Academia & Research">Education & Research</option>
                        <option value="Operations & Administration">Operations & Administration</option>
                        <option value="Hospitality & Retail">Hospitality & Retail</option>
                        <option value="Creative, Media & Design">Creative & Design</option>
                        <option value="Consulting & Strategy">Consulting & Strategy</option>
                      </select>
                      <p className="text-[10px] text-gray-400 mt-1">Understands all industries inclusively</p>
                    </div>
                  </div>

                  {/* Career Stage Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111B35]/70 mb-1">
                      Career Stage <span className="text-gray-400 font-normal lowercase">(optional)</span>
                    </label>
                    <select
                      value={careerSeniority}
                      onChange={(e) => setCareerSeniority(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB] bg-white"
                    >
                      <option value="">Auto-Detect from Resume (Default)</option>
                      <option value="Student / Graduate">Student / Recent Graduate</option>
                      <option value="Entry-level">Entry-Level Professional (0-2 years)</option>
                      <option value="Mid-career">Mid-Career Professional (3-7 years)</option>
                      <option value="Experienced professional">Experienced Professional (8+ years)</option>
                      <option value="Senior professional">Senior / Principal Specialist</option>
                      <option value="Manager / Leadership">Team Manager / Leadership</option>
                      <option value="Executive">Executive / Director / C-Suite</option>
                      <option value="Career changer">Career Changer / Returning Professional</option>
                    </select>
                    <p className="text-[10px] text-gray-400 mt-1">Adapts evaluation criteria so graduates and career changers are never unfairly penalized</p>
                  </div>

                  {/* Optional Benchmark Job Description */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowJdInput(!showJdInput)}
                      className="text-xs font-bold text-[#635BDB] hover:underline flex items-center space-x-1"
                    >
                      <span>{showJdInput ? '— Remove Benchmark Job Description' : '+ Add Benchmark Job Description (Optional for Job Match Score)'}</span>
                    </button>
                    {showJdInput && (
                      <div className="mt-2 space-y-1">
                        <textarea
                          rows={4}
                          placeholder="Paste a target job description to compute a separate semantic Job Match score comparing required vs transferable skills..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                        />
                        <p className="text-[11px] text-[#111B35]/60">
                          Job match is assessed as an independent score and does not diminish your general resume quality score.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Text Review Accordion */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setShowTextEditor(!showTextEditor)}
                        className="font-bold text-[#635BDB] hover:underline flex items-center space-x-1"
                      >
                        <span>
                          {showTextEditor ? '▲ Hide Extracted Resume Text' : '▼ Review / Paste Resume Text (Optional)'}
                        </span>
                      </button>
                      {resumeText ? (
                        <span className="text-[11px] text-gray-500 font-semibold">
                          {resumeText.split(/\s+/).filter(Boolean).length} words ({resumeText.length} chars)
                        </span>
                      ) : null}
                    </div>
                    {showTextEditor && (
                      <div className="mt-2 space-y-1">
                        <textarea
                          rows={6}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value.substring(0, 7000))}
                          placeholder="Paste your resume content here or edit the extracted text directly..."
                          className="w-full p-3 rounded-xl border border-[#CBD5E1] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                        />
                        <p className="text-[10px] text-gray-500">
                          You can edit or paste your resume directly to ensure full capture of achievements and skills.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Privacy Disclosure */}
                  <div className="flex items-start space-x-2 pt-2">
                    <input
                      id="privacy-consent"
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#635BDB] border-gray-300 rounded focus:ring-[#635BDB]"
                    />
                    <label htmlFor="privacy-consent" className="text-xs text-[#111B35]/70 cursor-pointer">
                      <strong>Client-Side Privacy Redaction</strong>: Personal emails, direct phone numbers, and physical addresses
                      are redacted client-side before transmission. Resumes are kept strictly confidential.
                    </label>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={handleStartAudit}
                  disabled={!file}
                  className={`w-full py-3.5 rounded-xl text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md transition-all ${
                    file
                      ? 'bg-gradient-to-r from-[#635BDB] to-[#8B5CF6] hover:opacity-95'
                      : 'bg-gray-300 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Check My Resume — Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Sample Preview Trigger */}
              <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] p-4 text-center">
                <button
                  type="button"
                  onClick={() => setViewState('sample')}
                  className="text-xs font-semibold text-[#635BDB] hover:underline"
                >
                  Want to see how it looks? Click here to view a Sample Multi-Score Audit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: AI AUDIT PROCESSING EXPERIENCE --- */}
        {viewState === 'processing' && (
          <div className="max-w-xl mx-auto py-16 text-center space-y-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#EEF2FF] animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#635BDB] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[#635BDB]">
                <Zap className="w-8 h-8 animate-bounce" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-[#111B35]">Analyzing Your Resume Fairly...</h2>
              <p className="text-xs sm:text-sm text-[#111B35]/60 max-w-sm mx-auto">
                Auditing against universal recruiter clarity, enterprise ATS compatibility, and career-stage standards.
              </p>
            </div>

            {/* 5 Progress Stages */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm text-left space-y-4">
              {[
                { stage: 1, title: 'Reading resume text & classifying professional domain' },
                { stage: 2, title: 'Calibrating assessment to candidate career stage & role context' },
                { stage: 3, title: 'Evaluating General Resume Quality & communication impact' },
                { stage: 4, title: 'Auditing ATS Parsing Compatibility & formatting risks' },
                { stage: 5, title: 'Synthesizing 7-category scorecard & tailored recommendations' },
              ].map((item) => {
                const isDone = processingStage > item.stage;
                const isCurrent = processingStage === item.stage;

                return (
                  <div key={item.stage} className="flex items-center space-x-3 text-xs sm:text-sm">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#635BDB] border-t-transparent animate-spin shrink-0"></div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0"></div>
                    )}
                    <span
                      className={`font-medium ${
                        isDone ? 'text-[#10B981]' : isCurrent ? 'text-[#635BDB] font-bold' : 'text-gray-400'
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

        {/* --- VIEW 3: RESULTS DASHBOARD (UNIVERSAL MULTI-SCORE AUDIT & BESPOKE QUOTING) --- */}
        {(viewState === 'results' || viewState === 'sample') && activeResult && (
          <div className="space-y-10">
            {/* Sample Banner */}
            {viewState === 'sample' && (
              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>
                    <strong>SAMPLE AUDIT PREVIEW</strong> — Demonstrating the 3 distinct score dimensions and custom pricing workflow.
                  </span>
                </div>
                <button
                  onClick={() => setViewState('idle')}
                  className="px-3 py-1 bg-[#F59E0B] text-white rounded-lg font-bold text-xs"
                >
                  Upload Your Own Resume
                </button>
              </div>
            )}

            {/* Inferred Context Banner (Confirms Universal Inclusion) */}
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-[#635BDB] flex items-center space-x-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Inferred Profile Context:</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#635BDB] font-semibold">
                  Domain: {activeResult.inferredDomain || 'Professional Services'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] font-semibold">
                  Stage: {activeResult.careerStage || 'Experienced Professional'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#F0FDFA] text-[#0D9488] font-semibold">
                  Primary Role: {activeResult.inferredRole || activeResult.targetRole}
                </span>
              </div>
              <span className="text-gray-500 text-[11px] font-medium">
                Fair & Inclusive Calibration • Zero Rigid Keyword Penalties
              </span>
            </div>

            {/* Header / Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BDB]">Verified AI Assessment</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111B35] tracking-tight">
                  Your Resume Scorecard & Diagnosis
                </h1>
                <p className="text-xs sm:text-sm text-[#111B35]/60 mt-1">
                  Target Trajectory: <strong>{activeResult.targetRole || activeResult.inferredRole}</strong> • Evaluated on{' '}
                  {new Date(activeResult.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handlePrintPdf}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm font-semibold text-[#111B35] hover:bg-gray-50 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Summary PDF</span>
                </button>
                <button
                  onClick={() => {
                    setViewState('idle');
                    setFile(null);
                    setResumeText('');
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#635BDB] text-white text-xs sm:text-sm font-semibold hover:bg-[#5249CE] shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Audit Another Resume</span>
                </button>
              </div>
            </div>

            {/* THREE SEPARATE SCORE DIMENSIONS (PART A SECTION 3 SPECIFICATION) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Pillar 0: Overall Composite Score */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#111B35]/60 mb-2">Overall Score</span>
                <div className="relative w-28 h-28 flex items-center justify-center my-1">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke={
                        activeResult.overallScore >= 85
                          ? '#10B981'
                          : activeResult.overallScore >= 70
                          ? '#635BDB'
                          : activeResult.overallScore >= 50
                          ? '#F59E0B'
                          : '#F97373'
                      }
                      strokeWidth="8"
                      strokeDasharray={`${(activeResult.overallScore / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-[#111B35] tracking-tight">
                      {activeResult.overallScore}
                    </span>
                    <span className="text-[10px] font-semibold text-[#111B35]/50">out of 100</span>
                  </div>
                </div>
                <span
                  className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeResult.overallScore >= 85
                      ? 'bg-[#ECFDF5] text-[#10B981]'
                      : activeResult.overallScore >= 70
                      ? 'bg-[#EEF2FF] text-[#635BDB]'
                      : activeResult.overallScore >= 50
                      ? 'bg-[#FFFBEB] text-[#F59E0B]'
                      : 'bg-[#FEF2F2] text-[#F97373]'
                  }`}
                >
                  Grade {activeResult.grade} • {activeResult.interpretation}
                </span>
              </div>

              {/* Pillar 1: General Resume Quality Score (Independent of Job) */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#635BDB] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-extrabold text-[#635BDB]">{activeResult.generalQualityScore}/100</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111B35]">General Resume Quality</h3>
                  <p className="text-xs text-[#111B35]/60 mt-1 leading-relaxed">
                    Evaluates completeness, career clarity, achievement communication, and presentation independent of any specific job.
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                  Content & Communication Integrity
                </div>
              </div>

              {/* Pillar 2: ATS Compatibility Score */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F0FDFA] text-[#14B8A6] flex items-center justify-center">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-extrabold text-[#14B8A6]">{activeResult.atsCompatibilityScore}/100</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#111B35]">ATS Compatibility Score</h3>
                  <p className="text-xs text-[#111B35]/60 mt-1 leading-relaxed">
                    Evaluates parser readability, section recognize-ability, reading flow, and layout stability across hiring systems.
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                  Workday, Taleo & Greenhouse Readability
                </div>
              </div>

              {/* Pillar 3: Job Match Score (Optional) */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center">
                      <Target className="w-4 h-4" />
                    </div>
                    {activeResult.hasJobDescription && activeResult.jobMatchScore !== null ? (
                      <span className="text-2xl font-extrabold text-[#8B5CF6]">{activeResult.jobMatchScore}%</span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Optional</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#111B35]">Job Description Match</h3>
                  {activeResult.hasJobDescription && activeResult.jobMatchScore !== null ? (
                    <p className="text-xs text-[#111B35]/60 mt-1 leading-relaxed">
                      Semantic skill comparison: {activeResult.jobMatchKeywordSummary?.matchedCount || 0} core skills matched,{' '}
                      {activeResult.jobMatchKeywordSummary?.transferableCount || 0} transferable competencies identified.
                    </p>
                  ) : (
                    <p className="text-xs text-[#111B35]/60 mt-1 leading-relaxed">
                      Calculated only when a benchmark Job Description is provided. Not penalized when omitted.
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 font-medium">
                  {activeResult.hasJobDescription ? 'Semantic Competency Fit' : 'Independent of General Quality'}
                </div>
              </div>
            </div>

            {/* Executive Summary & Key Highlights */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BDB]">Executive Assessment</span>
                <p className="text-sm sm:text-base text-[#111B35] leading-relaxed mt-1 font-medium">
                  {activeResult.summary}
                </p>
              </div>

              {/* Strengths (Short Titles Only) */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] block mb-2">
                  Key Strengths Evidenced in Resume
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeResult.strengthTitles.map((title, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-xs font-semibold text-[#111B35] p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span className="truncate">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seven Standardized Audit Categories */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#111B35]">
                  Seven Standardized Category Dimensions
                </h2>
                <p className="text-xs text-[#111B35]/60">
                  Each dimension is evaluated fairly based on your career stage without penalizing unconventional or non-linear paths.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeResult.categories.map((cat) => {
                  const meta = CATEGORY_META[cat.category] || CATEGORY_META.STRUCTURE_READABILITY;
                  const Icon = meta.icon;

                  return (
                    <div
                      key={cat.category}
                      className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: meta.bg, color: meta.color }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-[#111B35] line-clamp-1">{cat.title}</h3>
                            <span className="text-[10px] font-semibold text-[#111B35]/50">
                              Weight: {cat.weight}%
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cat.status === 'EXCELLENT'
                              ? 'bg-[#ECFDF5] text-[#10B981]'
                              : cat.status === 'GOOD'
                              ? 'bg-[#EEF2FF] text-[#635BDB]'
                              : 'bg-[#FFFBEB] text-[#F59E0B]'
                          }`}
                        >
                          {cat.status}
                        </span>
                      </div>

                      {/* Progress Bar & Numeric Score */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-extrabold text-[#111B35]">
                          <span>Score: {cat.rawScore}/100</span>
                          <span className="text-[#635BDB] font-bold">+{cat.weightedScore} pts</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${cat.rawScore}%`,
                              backgroundColor: meta.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LOCKED DETAILED INSIGHTS (CORE CONVERSION EXPERIENCE) */}
            <div className="space-y-4 pt-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Lock className="w-3 h-3" />
                  <span>Areas Requiring Attention</span>
                </div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-[#111B35]">
                  Locked Detailed Insights & Action Plan
                </h2>
                <p className="text-xs sm:text-sm text-[#111B35]/60">
                  Your free audit identifies the titles of areas needing improvement. Detailed personalized diagnosis,
                  line-by-line rewrite suggestions, and the complete step-by-step roadmap are unlocked when choosing a service.
                </p>
              </div>

              {/* Locked Improvement Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeResult.improvementAreas.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleOpenLockedCard(card)}
                    className="group bg-white rounded-2xl border-2 border-[#CBD5E1]/60 hover:border-[#635BDB] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-md bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                          <h3 className="font-extrabold text-sm sm:text-base text-[#111B35] group-hover:text-[#635BDB] transition-colors">
                            {card.title}
                          </h3>
                        </div>
                        <p className="text-xs font-semibold text-[#111B35]/60 pl-8">{card.teaserSubtitle}</p>
                      </div>

                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#635BDB] shrink-0">
                        {card.pricingLabel || 'Quote Based on Requirements'}
                      </span>
                    </div>

                    {/* Teaser Bullets */}
                    <ul className="mt-3 pl-8 space-y-1.5 text-xs text-[#111B35]/80">
                      {card.teaserBullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#635BDB] shrink-0"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Lock CTA Bar */}
                    <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#635BDB] group-hover:translate-x-0.5 transition-transform">
                      <span className="flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock personalized diagnosis & recommendations</span>
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDED SERVICES & CUSTOM QUOTATION SECTION (PART B SPECIFICATION) */}
            <div className="bg-gradient-to-br from-[#111B35] to-[#1E293B] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
                  Tailored Professional Fixes
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Recommended Career Services for Your Resume
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Hopepitome provides customised resume and career services. Pricing is determined after understanding
                  your exact experience, career trajectory, and project requirements.
                </p>
              </div>

              {/* Service Cards (Strictly No Fixed Prices) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeResult.recommendedServices.map((service) => (
                  <div
                    key={service.code}
                    className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 flex flex-col justify-between space-y-5 hover:bg-white/15 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {service.isPrimary ? (
                          <span className="px-3 py-1 rounded-full bg-[#10B981] text-white text-[10px] font-extrabold uppercase tracking-wider">
                            Primary Recommendation
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                            Complementary Service
                          </span>
                        )}
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/10 text-[#14B8A6]">
                          {service.pricingLabel || 'Custom Pricing'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <p className="text-xs text-gray-200 leading-relaxed font-medium">{service.quoteMessage}</p>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider block">
                          Addresses Identified Needs:
                        </span>
                        {service.addressedAreas.map((area, aIdx) => (
                          <div key={aIdx} className="flex items-center space-x-2 text-xs text-gray-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectService(service)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#635BDB] to-[#8B5CF6] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <span>{service.ctaText || 'Request a Custom Quote'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Guarantees Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Custom Quote Based on Actual Scope</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#14B8A6]" />
                  <span>24-Hour Quotation Turnaround</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Direct Senior Consultant Consultation</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. CUSTOM QUOTATION REQUEST MODAL & MOBILE BOTTOM SHEET */}
      {conversionModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#111B35] to-[#1E293B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6]">
                  Custom Quotation Request
                </span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">{selectedService.name}</h3>
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

            {/* Modal Body / Scrollable Form */}
            <div className="p-6 overflow-y-auto space-y-6">
              {enquirySuccessRef ? (
                /* Success State */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-[#111B35]">Quotation Request Registered!</h4>
                    <p className="text-xs text-[#111B35]/60">
                      Your ATS audit score ({auditResult?.overallScore || '78'}/100) and resume reference have been securely linked.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] inline-block text-xs font-bold text-[#111B35]">
                    Reference ID: <span className="text-[#635BDB]">{enquirySuccessRef}</span>
                  </div>
                  <p className="text-xs text-[#111B35]/70 max-w-sm mx-auto leading-relaxed">
                    A Senior Career Consultant will review your audit findings and career goals to prepare a transparent,
                    tailored quotation within 24 hours.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/919496338879?text=Hello%20Hopepitome%20Career%20Studio,%20I%20completed%20an%20ATS%20audit%20and%20would%20like%20to%20request%20a%20custom%20quote%20for%20${encodeURIComponent(
                        selectedService.name
                      )}%20(Ref:%20${enquirySuccessRef})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:opacity-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message on WhatsApp Directly</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Intake Form */
                <form onSubmit={handleSubmitEnquiry} className="space-y-5">
                  {/* Service Deliverable Highlights */}
                  <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111B35]">Pricing Policy</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#635BDB] text-white">
                        Custom Quotation
                      </span>
                    </div>
                    <p className="text-xs text-[#111B35]/80 leading-relaxed pt-1">
                      {selectedService.quoteMessage}
                    </p>
                  </div>

                  {/* Contact Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anumol Sebastian"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. anumol@example.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98460 00000"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">Target Career Goal / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Tech Lead, Director of Operations"
                        value={leadCareerGoals}
                        onChange={(e) => setLeadCareerGoals(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">Specific Requirements or Timeline</label>
                      <textarea
                        rows={2}
                        placeholder="Tell us about your target geography, timeline, or specific challenges..."
                        value={leadRequirements}
                        onChange={(e) => setLeadRequirements(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">Preferred Contact Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['WhatsApp', 'Email', 'Phone Call'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setLeadContactMethod(method)}
                            className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              leadContactMethod === method
                                ? 'bg-[#635BDB] text-white border-[#635BDB]'
                                : 'bg-white text-[#111B35] border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#111B35]/50 leading-relaxed">
                    By submitting, your resume reference ({fileName || 'Uploaded resume'}) and assessment score (
                    {auditResult?.overallScore || '78'}/100) are securely linked to your enquiry. Pricing will be proposed
                    transparently based on your actual scope. No payment is charged now.
                  </p>

                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#635BDB] to-[#8B5CF6] hover:opacity-95 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition-all"
                  >
                    {enquirySubmitting ? (
                      <span className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <span>Submitting Request...</span>
                      </span>
                    ) : (
                      <span>{selectedService.ctaText || 'Request Custom Quote'}</span>
                    )}
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
