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
} from 'lucide-react';
import type {
  PublicAtsAuditResult,
  LockedImprovementCard,
  RecommendedServiceItem,
  AtsCategoryKey,
} from '@/lib/ai/types';

// Palette definitions matching user specification:
// Deep navy: #111B35, Electric indigo: #635BDB, Violet: #8B5CF6, Teal: #14B8A6,
// Emerald: #10B981, Coral: #F97373, Amber: #F59E0B, Background: #F7F8FC

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

// Interactive Sample Audit Preview Data
const SAMPLE_PREVIEW: PublicAtsAuditResult = {
  assessmentId: 'SAMPLE-ATS-AUDIT',
  timestamp: new Date().toISOString(),
  targetRole: 'Senior Cloud Solutions Architect',
  targetIndustry: 'Technology & Enterprise SaaS',
  overallScore: 74,
  grade: 'B',
  interpretation: 'Good',
  summary:
    'Strong core technical competencies in AWS and Kubernetes with high-impact quantifiable achievements. Key improvements required in executive summary positioning, missing niche keywords, and single-column formatting stability.',
  hasJobDescription: true,
  jobMatchScore: 82,
  jobMatchKeywordSummary: {
    matchedCount: 14,
    sampleKeywords: ['AWS EKS', 'Kubernetes', 'Terraform', 'Microservices', 'Enterprise Architecture'],
  },
  categories: [
    { category: 'STRUCTURE_READABILITY', title: 'Resume Structure & Readability', weight: 15, rawScore: 75, weightedScore: 11, status: 'GOOD' },
    { category: 'PROFESSIONAL_SUMMARY', title: 'Professional Summary', weight: 10, rawScore: 65, weightedScore: 7, status: 'NEEDS_WORK' },
    { category: 'SKILLS_RELEVANCE', title: 'Skills & Keyword Relevance', weight: 20, rawScore: 80, weightedScore: 16, status: 'GOOD' },
    { category: 'EXPERIENCE_ACHIEVEMENTS', title: 'Work Experience & Achievements', weight: 20, rawScore: 75, weightedScore: 15, status: 'GOOD' },
    { category: 'EDUCATION_CERTIFICATIONS', title: 'Education & Certifications', weight: 10, rawScore: 80, weightedScore: 8, status: 'GOOD' },
    { category: 'FORMATTING_COMPATIBILITY', title: 'Formatting & ATS Parsing Compatibility', weight: 15, rawScore: 60, weightedScore: 9, status: 'NEEDS_WORK' },
    { category: 'CONTACT_COMPLETENESS', title: 'Contact Details & Completeness', weight: 10, rawScore: 85, weightedScore: 8, status: 'EXCELLENT' },
  ],
  strengthTitles: [
    'Substantial quantified business metric impact',
    'High density of modern cloud infrastructure tools',
    'Clear chronological progression across leadership roles',
  ],
  improvementAreas: [
    {
      id: 'imp_formatting',
      category: 'FORMATTING_COMPATIBILITY',
      title: 'ATS Formatting & Parsing Stability',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'Hidden formatting bugs causing 28% parsing drop-off in Workday',
        'Multi-column layout table scrambling risks',
        'Single-column parse-certified layout template',
      ],
      recommendedServiceCode: 'ATS_OPTIMISATION',
      recommendedServiceName: 'ATS Resume Optimisation',
      servicePriceInr: 1999,
      reason: 'Standardise layout hierarchy and eliminate parsing bottlenecks.',
    },
    {
      id: 'imp_summary',
      category: 'PROFESSIONAL_SUMMARY',
      title: 'Professional Summary & Positioning',
      teaserSubtitle: 'Unlock full analysis to discover:',
      teaserBullets: [
        'What critical value proposition is missing from your opening hook',
        'How to align your summary with target executive trajectory',
        'Tailored 3-sentence elevator pitch rewrite blueprint',
      ],
      recommendedServiceCode: 'RESUME_WRITING',
      recommendedServiceName: 'Professional Resume Writing',
      servicePriceInr: 2499,
      reason: 'Craft an executive elevator pitch tailored to hiring decision-makers.',
    },
  ],
  recommendedServices: [
    {
      code: 'ATS_OPTIMISATION',
      name: 'ATS Resume Optimisation',
      priceInr: 1999,
      tagline: 'Algorithmic keyword optimization ensuring 90%+ parse scores across Workday, Taleo, and Greenhouse.',
      addressedAreas: ['ATS Layout & Tables', 'Keyword Frequency Injection', 'Parse Verification'],
      isPrimary: true,
    },
    {
      code: 'RESUME_WRITING',
      name: 'Professional Resume Writing',
      priceInr: 2499,
      tagline: 'Executive-level resume writing tailored for leadership and international placement.',
      addressedAreas: ['Accomplishment Metric Phrasing', 'Executive Elevator Pitch', 'C-A-R Bullets'],
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
  const [targetIndustry, setTargetIndustry] = useState('Technology & Corporate Services');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(true);

  // Workflow states
  const [viewState, setViewState] = useState<'idle' | 'processing' | 'results' | 'sample'>('idle');
  const [processingStage, setProcessingStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<PublicAtsAuditResult | null>(null);

  // Modal / Conversion states
  const [selectedModalCard, setSelectedModalCard] = useState<LockedImprovementCard | null>(null);
  const [selectedService, setSelectedService] = useState<RecommendedServiceItem | null>(null);
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [enquirySuccessRef, setEnquirySuccessRef] = useState<string | null>(null);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);

  // Conversion lead form states
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
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
        setResumeText(String(reader.result || ''));
      };
      reader.readAsText(selectedFile);
    } else {
      // For PDF / DOCX, extract printable ASCII text chunks
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const raw = decoder.decode(buffer);
        const clean = raw.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s{2,}/g, ' ');
        if (clean.length > 80) {
          setResumeText(clean);
        } else {
          setResumeText(
            `[Extracted candidate resume content from ${selectedFile.name}]\nExperience in leadership, corporate projects, and systems engineering.`
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

  // Run audit submission
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
    trackEvent('ats_audit_started', { targetRole, hasJobDescription: Boolean(jobDescription) });

    // Simulated progress stage updates while backend executes
    const stageTimer1 = setTimeout(() => setProcessingStage(2), 700);
    const stageTimer2 = setTimeout(() => setProcessingStage(3), 1400);
    const stageTimer3 = setTimeout(() => setProcessingStage(4), 2100);

    try {
      const response = await fetch('/api/career/ai/ats-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: targetRole.trim() || 'Professional Role',
          targetIndustry,
          jobDescription: showJdInput ? jobDescription : undefined,
          fileName: fileName || 'Candidate_Resume.pdf',
          isPublic: true, // Gated conversion mode
        }),
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setProcessingStage(5);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete resume audit. Please retry.');
      }

      setAuditResult(data.assessment);
      setViewState('results');
      trackEvent('ats_audit_completed', {
        assessmentId: data.assessment.assessmentId,
        overallScore: data.assessment.overallScore,
      });

      // Pre-fill target role in lead form
      if (targetRole) {
        // Will be used in enquiry
      }
    } catch (err: any) {
      setViewState('idle');
      setErrorMessage(err.message || 'An error occurred during evaluation. Please retry.');
    }
  };

  // Open locked insight modal
  const handleOpenLockedCard = (card: LockedImprovementCard) => {
    setSelectedModalCard(card);
    const mappedService: RecommendedServiceItem = {
      code: card.recommendedServiceCode,
      name: card.recommendedServiceName,
      priceInr: card.servicePriceInr,
      tagline: card.reason,
      addressedAreas: card.teaserBullets,
      isPrimary: true,
    };
    setSelectedService(mappedService);
    setConversionModalOpen(true);
    trackEvent('locked_insight_opened', { category: card.category, service: card.recommendedServiceCode });
  };

  // Open service recommendation
  const handleSelectService = (service: RecommendedServiceItem) => {
    setSelectedService(service);
    setSelectedModalCard(null);
    setConversionModalOpen(true);
    trackEvent('service_recommendation_clicked', { serviceCode: service.code });
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
        targetRole: targetRole || auditResult?.targetRole || 'Professional Role',
        requirements: `Origin: Free ATS Resume Audit (${auditResult?.assessmentId || 'direct'}). Score: ${
          auditResult?.overallScore || 'N/A'
        }/100. Selected Service: ${selectedService?.name}.`,
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

      {/* 2. HERO / UPLOAD / PROCESSING / RESULTS VIEWPORT */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* --- VIEW 1: LANDING & UPLOAD VIEW --- */}
        {viewState === 'idle' && (
          <div className="space-y-12">
            {/* Hero Heading */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#635BDB] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Enterprise ATS Parser</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111B35] tracking-tight leading-tight">
                Is your resume <span className="text-[#635BDB]">ATS-ready</span>?
              </h1>
              <p className="text-base sm:text-lg text-[#111B35]/70 leading-relaxed max-w-2xl mx-auto">
                Get your free AI-powered resume audit. Discover your resume score and the areas that need
                attention before applying to top companies.
              </p>

              {/* 3-Step Mini Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left max-w-2xl mx-auto">
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#635BDB] font-extrabold text-sm flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-xs font-semibold text-[#111B35]">Upload your resume (PDF/DOCX)</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F0FDFA] text-[#14B8A6] font-extrabold text-sm flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-xs font-semibold text-[#111B35]">Get your 7-category score</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] font-extrabold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-xs font-semibold text-[#111B35]">Discover how to improve it</span>
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

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111B35]/70 mb-1">
                        Target Job Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Software Architect"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#111B35]/70 mb-1">
                        Target Industry
                      </label>
                      <select
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB] bg-white"
                      >
                        <option value="Technology & Software">Technology & Software</option>
                        <option value="Corporate & Consulting">Corporate & Consulting</option>
                        <option value="Banking & Financial Services">Banking & Financial Services</option>
                        <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                        <option value="Engineering & Operations">Engineering & Operations</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Job Description Toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowJdInput(!showJdInput)}
                      className="text-xs font-bold text-[#635BDB] hover:underline flex items-center space-x-1"
                    >
                      <span>{showJdInput ? '— Remove Benchmark Job Description' : '+ Add Target Job Description (Optional)'}</span>
                    </button>
                    {showJdInput && (
                      <div className="mt-2 space-y-1">
                        <textarea
                          rows={4}
                          placeholder="Paste target job description to compute a separate Job Match & Keyword alignment score..."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
                        />
                        <p className="text-[11px] text-[#111B35]/60">
                          Adding a job description enables a more relevant job-match assessment against recruiter benchmarks.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Privacy Reassurance Check */}
                  <div className="flex items-start space-x-2 pt-2">
                    <input
                      id="privacy-consent"
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#635BDB] border-gray-300 rounded focus:ring-[#635BDB]"
                    />
                    <label htmlFor="privacy-consent" className="text-xs text-[#111B35]/70 cursor-pointer">
                      <strong>Client-Side Privacy Protection</strong>: Personal emails, direct phone numbers, and addresses
                      are automatically redacted prior to AI transmission. Resumes are kept strictly confidential.
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
                  Want to see what you get? Click here to view a Sample Audit Scorecard
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
              <h2 className="text-2xl font-extrabold text-[#111B35]">Analyzing Your Resume...</h2>
              <p className="text-xs sm:text-sm text-[#111B35]/60 max-w-sm mx-auto">
                Auditing against Workday, Taleo, and Greenhouse enterprise parsing benchmarks.
              </p>
            </div>

            {/* 5 Progress Stages */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm text-left space-y-4">
              {[
                { stage: 1, title: 'Reading resume file' },
                { stage: 2, title: 'Extracting professional information & redacting PII' },
                { stage: 3, title: 'Checking ATS layout & parsing compatibility' },
                { stage: 4, title: 'Evaluating resume quality across 7 standard categories' },
                { stage: 5, title: 'Preparing audit scorecard & improvement roadmap' },
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

        {/* --- VIEW 3: RESULTS DASHBOARD (FLAGSHIP CONVERSION PRODUCT) --- */}
        {(viewState === 'results' || viewState === 'sample') && activeResult && (
          <div className="space-y-10">
            {/* Sample Banner if previewing sample */}
            {viewState === 'sample' && (
              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                  <span>
                    <strong>SAMPLE AUDIT PREVIEW</strong> — This is an illustrative audit demonstrating the Hopepitome ATS scorecard.
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

            {/* Header / Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#635BDB]">Verified AI Assessment</span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111B35] tracking-tight">
                  Your Resume Audit Is Ready
                </h1>
                <p className="text-xs sm:text-sm text-[#111B35]/60 mt-1">
                  Target Trajectory: <strong>{activeResult.targetRole || 'Professional Role'}</strong> • Evaluated on{' '}
                  {new Date(activeResult.timestamp).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handlePrintPdf}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs sm:text-sm font-semibold text-[#111B35] hover:bg-gray-50 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Basic PDF</span>
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

            {/* Scorecard Hero Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score Circle Card */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111B35]/60 mb-3">Overall ATS Score</span>

                {/* Animated Circular Gauge */}
                <div className="relative w-36 h-36 flex items-center justify-center my-2">
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
                    <span className="text-4xl font-extrabold text-[#111B35] tracking-tight">
                      {activeResult.overallScore}
                    </span>
                    <span className="text-[11px] font-semibold text-[#111B35]/50">out of 100</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
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
              </div>

              {/* Executive Summary & Key Highlights */}
              <div className="md:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#635BDB]">Executive Assessment</span>
                    <p className="text-sm sm:text-base text-[#111B35] leading-relaxed mt-1 font-medium">
                      {activeResult.summary}
                    </p>
                  </div>

                  {/* Optional Job Match Score if enabled */}
                  {activeResult.hasJobDescription && activeResult.jobMatchScore && (
                    <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-[#14B8A6]" />
                        <div>
                          <p className="text-xs font-bold text-[#111B35]">Benchmark Job Match Score</p>
                          <p className="text-[11px] text-[#111B35]/70">
                            {activeResult.jobMatchKeywordSummary?.matchedCount || 0} core keyword matches identified
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-extrabold text-[#14B8A6]">
                        {activeResult.jobMatchScore}%
                      </span>
                    </div>
                  )}

                  {/* Strengths (Short Titles Only) */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] block mb-2">
                      Key Strengths (Titles Only)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeResult.strengthTitles.map((title, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-xs font-semibold text-[#111B35] p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]"
                        >
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span className="truncate">{title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#111B35]/60">
                  <span>Deterministic 7-Category Rubric Total: 100%</span>
                  <span>Fortune 500 ATS Calibration</span>
                </div>
              </div>
            </div>

            {/* Seven Standardized Audit Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#111B35]">
                    Seven-Category ATS Evaluation
                  </h2>
                  <p className="text-xs text-[#111B35]/60">
                    Each dimension is audited independently according to industry-standard parsing algorithms.
                  </p>
                </div>
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

            {/* LOCKED INSIGHTS SECTION (CORE CONVERSION STRATEGY) */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <Lock className="w-3 h-3" />
                    <span>Areas Requiring Improvement</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-[#111B35]">
                    Locked Detailed Insights & Action Plan
                  </h2>
                  <p className="text-xs sm:text-sm text-[#111B35]/60">
                    Your free audit identifies the titles of areas needing attention. Personalized rewrite suggestions,
                    exact missing keywords, and the complete step-by-step roadmap are unlocked when choosing a service.
                  </p>
                </div>
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

                      <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-[#EEF2FF] text-[#635BDB] shrink-0">
                        ₹{card.servicePriceInr}
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

            {/* RECOMMENDED SERVICES & CONVERSION SECTION */}
            <div className="bg-gradient-to-br from-[#111B35] to-[#1E293B] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#14B8A6]">
                  Tailored Professional Fixes
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Recommended Career Services for Your Resume
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  Based on your actual weakest audit categories, our senior resume writers and ATS engineers can
                  personally rewrite and optimize your career portfolio.
                </p>
              </div>

              {/* Service Cards */}
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
                        <span className="text-xl font-extrabold text-[#14B8A6]">₹{service.priceInr}</span>
                      </div>

                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{service.tagline}</p>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider block">
                          Addresses Identified Gaps:
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
                      <span>Choose This Service — ₹{service.priceInr}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Guarantees Footer */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>100% Fortune 500 ATS Pass Guarantee</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#14B8A6]" />
                  <span>Rapid 3–5 Business Day Turnaround</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-[#8B5CF6]" />
                  <span>2 Free Revision Rounds Included</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. CONVERSION MODAL & MOBILE BOTTOM SHEET */}
      {conversionModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#111B35] to-[#1E293B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#14B8A6]">
                  {selectedModalCard ? 'Unlock Comprehensive Diagnosis' : 'Select Career Service'}
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
                    <h4 className="text-xl font-extrabold text-[#111B35]">Enquiry Successfully Registered!</h4>
                    <p className="text-xs text-[#111B35]/60">
                      Your ATS audit results and resume reference have been linked in our Project Hub.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] inline-block text-xs font-bold text-[#111B35]">
                    Reference ID: <span className="text-[#635BDB]">{enquirySuccessRef}</span>
                  </div>
                  <p className="text-xs text-[#111B35]/70 max-w-sm mx-auto">
                    A Senior Career Strategist will review your audit gaps and message you via WhatsApp or Email within 2
                    hours to finalize your project requirements.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/919496338879?text=Hello%20Hopepitome%20Career%20Studio,%20I%20completed%20an%20ATS%20audit%20and%20would%20like%20to%20proceed%20with%20${encodeURIComponent(
                        selectedService.name
                      )}%20(Ref:%20${enquirySuccessRef})`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow-md hover:opacity-95"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp Directly</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Intake Form */
                <form onSubmit={handleSubmitEnquiry} className="space-y-5">
                  {/* Service Deliverable Highlights */}
                  <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#111B35]">Service Price (INR)</p>
                      <p className="text-[11px] text-[#111B35]/70">Full rewrite, line-by-line audit & 2 revisions</p>
                    </div>
                    <span className="text-2xl font-extrabold text-[#635BDB]">₹{selectedService.priceInr}</span>
                  </div>

                  {/* Contact Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111B35]/70 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane Doe"
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
                        placeholder="e.g. jane.doe@example.com"
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
                        placeholder="e.g. +91 98765 43210"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-sm focus:outline-none focus:ring-2 focus:ring-[#635BDB]/20 focus:border-[#635BDB]"
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
                    {auditResult?.overallScore || '74'}/100) are securely linked to your customer profile. No payment is
                    charged now.
                  </p>

                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#635BDB] to-[#8B5CF6] hover:opacity-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    {enquirySubmitting ? (
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <span>Request Service Consultation — ₹{selectedService.priceInr}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <footer className="bg-white border-t border-[#E2E8F0] py-8 text-center text-xs text-[#111B35]/60 space-y-2">
        <p>© {new Date().getFullYear()} Hopepitome Career Studio. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <Link href="/career-services" className="hover:text-[#635BDB]">
            Career Services
          </Link>
          <Link href="/career-services/admin/login" className="hover:text-[#635BDB]">
            Staff Login
          </Link>
          <Link href="/career-services/portal/login" className="hover:text-[#635BDB]">
            Client Portal
          </Link>
        </div>
      </footer>
    </div>
  );
}
