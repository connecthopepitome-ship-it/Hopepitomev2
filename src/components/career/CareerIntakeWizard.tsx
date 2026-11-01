'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  ScanSearch,
  Linkedin,
  Globe,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileCheck,
  X,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Star,
  Zap,
} from 'lucide-react';

interface ServiceOption {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  icon: any;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
  features: string[];
}

const CAREER_SERVICES: ServiceOption[] = [
  {
    id: 'Professional Resume Writing',
    name: 'Professional Resume Writing',
    badge: 'Most Popular',
    badgeColor: 'bg-violet-600 text-white',
    icon: FileText,
    color: '#7C3AED',
    bgLight: 'bg-violet-50/70',
    borderColor: 'border-violet-200',
    description: 'Executive, leadership & mid-level resumes tailored to showcase your authentic career trajectory.',
    features: ['Custom Value Proposition', 'ATS Keyword Engineering', 'Achievement-led Storytelling'],
  },
  {
    id: 'ATS Resume Optimisation',
    name: 'ATS Resume Optimisation',
    badge: 'High Demand',
    badgeColor: 'bg-emerald-600 text-white',
    icon: ScanSearch,
    color: '#059669',
    bgLight: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    description: 'Format re-structuring and parser alignment to score 95%+ on enterprise applicant tracking systems.',
    features: ['Format Re-engineering', 'Job Description Mapping', 'ATS Scanner Report'],
  },
  {
    id: 'LinkedIn Profile Makeover',
    name: 'LinkedIn Profile Makeover',
    badge: 'High Impact',
    badgeColor: 'bg-blue-600 text-white',
    icon: Linkedin,
    color: '#2563EB',
    bgLight: 'bg-blue-50/70',
    borderColor: 'border-blue-200',
    description: 'All-star profile positioning with strategic keywords to turn your LinkedIn into a recruiter magnet.',
    features: ['High-Converting Headline', 'Search-Optimized About Story', 'Featured Section Strategy'],
  },
  {
    id: 'Personal Portfolio Websites',
    name: 'Personal Portfolio Website',
    badge: 'Executive',
    badgeColor: 'bg-purple-600 text-white',
    icon: Globe,
    color: '#9333EA',
    bgLight: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    description: 'Sleek, responsive digital showcase presenting your leadership credentials and case studies.',
    features: ['Interactive Case Studies', 'Custom Domain Ready', 'Mobile & Desktop Optimized'],
  },
  {
    id: 'Managed Job Search & Applications',
    name: 'Managed Job Search & Applications',
    badge: 'Full Concierge',
    badgeColor: 'bg-rose-600 text-white',
    icon: Briefcase,
    color: '#E11D48',
    bgLight: 'bg-rose-50/70',
    borderColor: 'border-rose-200',
    description: 'Dedicated search specialists actively filtering and submitting targeted applications weekly.',
    features: ['Weekly Targeted Submissions', 'Application Audit Sheet', 'Direct Recruiter Outreach'],
  },
];

const FAQS = [
  {
    q: 'How fast will I receive my initial consultation and draft?',
    a: 'Within 2 hours of submitting your request, our lead career strategist will connect with you via WhatsApp or Email. First drafts are typically delivered within 48 to 72 hours.',
  },
  {
    q: 'Can I select multiple services together?',
    a: 'Yes! You can choose any combination—such as Resume Writing + LinkedIn Makeover. Bundled requests automatically receive priority scheduling.',
  },
  {
    q: 'What if I do not have an updated resume right now?',
    a: 'No problem! You can select "Skip for Now" or share brief notes. We conduct an intake questionnaire or consultation call to build your profile from scratch.',
  },
  {
    q: 'How many revisions do I get?',
    a: 'Every engagement includes unlimited revisions within 14 days of first draft delivery to guarantee 100% satisfaction and ATS compliance.',
  },
  {
    q: 'How are my documents kept secure?',
    a: 'Your resume and personal details are encrypted and stored in an isolated, private Google Drive cloud vault. We never share or sell your career data.',
  },
];

export function CareerIntakeWizard() {
  // Step state: 1 = Services, 2 = Resume/Details, 3 = Contact, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Selected services (supports multi-select)
  const [selectedServices, setSelectedServices] = useState<string[]>(['Professional Resume Writing']);

  // Step 2: Intake mode ('upload' | 'manual' | 'both' | 'skip')
  const [intakeMode, setIntakeMode] = useState<'upload' | 'manual' | 'both' | 'skip'>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Optional career details
  const [targetRole, setTargetRole] = useState('');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [totalExperience, setTotalExperience] = useState('');
  const [targetCountry, setTargetCountry] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showNotesAccordion, setShowNotesAccordion] = useState(false);

  // Step 3: Contact information
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone Call' | 'Email'>('WhatsApp');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    referenceCode: string;
    leadId?: string;
    services: string[];
    fileName?: string | null;
    submittedAt: string;
  } | null>(null);

  // FAQ open/close state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter((s) => s !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);
    if (file.size > 8 * 1024 * 1024) {
      setFileError('File size exceeds 8MB. Please choose a smaller document.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'rtf'].includes(ext || '')) {
      setFileError('Please upload a PDF or Microsoft Word (.docx/.doc) document.');
      return;
    }

    setResumeFile(file);

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Only = result.split(',')[1] || result;
      setResumeBase64(base64Only);
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeBase64(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Final Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setSubmitError('Please enter your full legal name (minimum 2 characters).');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    if (!mobile.trim() || mobile.trim().length < 6) {
      setSubmitError('Please enter a valid mobile or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneWhatsapp: mobile.trim(),
        selectedServices,
        serviceRequired: selectedServices[0] || 'Professional Resume Writing',
        targetRole: targetRole.trim() || undefined,
        currentDesignation: currentDesignation.trim() || undefined,
        totalExperience: totalExperience.trim() || undefined,
        targetCountry: targetCountry.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        requirements: additionalNotes.trim() || `Consultation requested for: ${selectedServices.join(', ')}`,
        preferredContactMethod: preferredContact,
        resumeFileName: resumeFile?.name || undefined,
        resumeFileSize: resumeFile?.size || undefined,
        resumeMimeType: resumeFile?.type || (resumeFile?.name.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf'),
        resumeFileBase64: resumeBase64 || undefined,
        consent: true,
      };

      const res = await fetch('/api/career-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data?.errors ? Object.values(data.errors).join(', ') : (data?.error || 'Submission failed. Please retry.'));
      }

      setSubmittedData({
        referenceCode: data.referenceCode,
        leadId: data.leadId,
        services: selectedServices,
        fileName: resumeFile?.name || null,
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });

      setStep(4);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err?.message || 'Failed to submit career request. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefCode = () => {
    if (submittedData?.referenceCode) {
      navigator.clipboard.writeText(submittedData.referenceCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-[#FAF8F5] via-[#F3EEFF] to-[#FAF8F5]">
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
          {/* Top Floating Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4 p-1.5 px-3 rounded-full bg-white/90 border border-violet-100 shadow-sm text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9/5 Rating</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Zap className="w-3.5 h-3.5" />
              <span>98% ATS Pass Rate</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-violet-700">1,200+ Careers Elevated</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight mb-3">
            Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">Career Trajectory</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select your service, share your resume or basic goals, and our executive career strategists will tailor a bespoke consultation roadmap within 2 hours.
          </p>

          {/* Stepper Progress Bar */}
          {step < 4 && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                <span className={step >= 1 ? 'text-violet-700 font-extrabold' : 'text-slate-400'}>1. Select Services</span>
                <span className={step >= 2 ? 'text-violet-700 font-extrabold' : 'text-slate-400'}>2. Resume & Details</span>
                <span className={step >= 3 ? 'text-violet-700 font-extrabold' : 'text-slate-400'}>3. Contact & Submit</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. MAIN WIZARD CONTAINER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-violet-500/5 p-5 sm:p-8">
          
          {/* =========================================================================
              STEP 1: SERVICE SELECTION
             ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
                    <span>Step 1: Choose Your Career Services</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                      Multi-select enabled
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click to select one or multiple services you wish to consult on.
                  </p>
                </div>
                <div className="text-xs font-semibold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-xl self-start sm:self-center border border-violet-100">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'} Selected
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {CAREER_SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  const Icon = srv.icon;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${
                        isSelected
                          ? 'border-violet-600 bg-gradient-to-br from-violet-50/80 via-white to-purple-50/40 shadow-md ring-2 ring-violet-500/20'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      {/* Top Row: Icon + Badge + Checkmark */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                            style={{ backgroundColor: `${srv.color}15`, color: srv.color }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#0F172A] leading-snug">
                              {srv.name}
                            </h3>
                            {srv.badge && (
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${srv.badgeColor}`}>
                                {srv.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-violet-600 border-violet-600 text-white'
                              : 'border-slate-300 bg-white text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {srv.description}
                      </p>

                      {/* Micro Features */}
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                        {srv.features.map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-violet-600" />
                            <span>{f}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  💡 You can change or customize these services with your strategist anytime.
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/25 flex items-center justify-center gap-2 transition"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: RESUME UPLOAD & CAREER DETAILS (100% OPTIONAL)
             ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
                    <span>Step 2: Share Resume or Career Goals</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      100% Optional
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your existing resume, enter target details manually, or skip ahead.
                  </p>
                </div>
              </div>

              {/* 4 Intake Options Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upload', label: 'Upload Resume', icon: Upload, desc: 'PDF / Word' },
                  { id: 'manual', label: 'Enter Details', icon: FileText, desc: 'Target Role' },
                  { id: 'both', label: 'Upload + Details', icon: Sparkles, desc: 'Full Intake' },
                  { id: 'skip', label: 'Skip for Now', icon: ArrowRight, desc: 'Call Discussion' },
                ].map((tab) => {
                  const active = intakeMode === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setIntakeMode(tab.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        active
                          ? 'border-violet-600 bg-violet-50/80 text-violet-900 shadow-sm font-bold ring-1 ring-violet-500/30'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${active ? 'text-violet-700' : 'text-slate-400'}`} />
                      <div className="text-xs leading-snug">{tab.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{tab.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* OPTION A: UPLOAD RESUME */}
              {(intakeMode === 'upload' || intakeMode === 'both') && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Upload Existing Resume (PDF or DOCX, max 8MB)
                  </label>

                  {!resumeFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-violet-200 hover:border-violet-400 rounded-2xl p-6 text-center bg-violet-50/30 hover:bg-violet-50/60 cursor-pointer transition"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc,.rtf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-violet-600 mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Click to select or drag & drop your resume file
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Supported: PDF, DOCX, DOC (up to 8MB) • Direct secure Google Drive upload
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-emerald-900 truncate">
                            {resumeFile.name}
                          </div>
                          <div className="text-[10px] text-emerald-700">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready for secure upload
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <div className="text-xs text-red-600 font-medium">{fileError}</div>
                  )}
                </div>
              )}

              {/* OPTION B: ENTER DETAILS MANUALLY */}
              {(intakeMode === 'manual' || intakeMode === 'both') && (
                <div className="space-y-3.5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    <span>Target Career Details (Optional)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Target Role / Industry
                      </label>
                      <input
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. VP of Product, Cloud Architect"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Current Designation
                      </label>
                      <input
                        type="text"
                        value={currentDesignation}
                        onChange={(e) => setCurrentDesignation(e.target.value)}
                        placeholder="e.g. Senior Product Manager"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Total Experience
                      </label>
                      <select
                        value={totalExperience}
                        onChange={(e) => setTotalExperience(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                      >
                        <option value="">Select Experience (Optional)</option>
                        <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                        <option value="Mid Career (3-7 years)">Mid Career (3-7 years)</option>
                        <option value="Senior Professional (8-14 years)">Senior Professional (8-14 years)</option>
                        <option value="Executive / Leadership (15+ years)">Executive / Leadership (15+ years)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Target Country / Region
                      </label>
                      <input
                        type="text"
                        value={targetCountry}
                        onChange={(e) => setTargetCountry(e.target.value)}
                        placeholder="e.g. Singapore, UAE, UK, India"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        LinkedIn Profile URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* OPTION D: SKIP FOR NOW MESSAGE */}
              {intakeMode === 'skip' && (
                <div className="p-5 rounded-2xl bg-violet-50/50 border border-violet-100 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-violet-100 flex items-center justify-center text-violet-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">No problem! We've got you covered.</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    You do not need to prepare anything right now. Our senior career consultant will connect with you to understand your background and goals directly.
                  </p>
                </div>
              )}

              {/* Expandable Notes Accordion */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowNotesAccordion(!showNotesAccordion)}
                  className="w-full p-3.5 px-4 text-left flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span className="flex items-center gap-2">
                    <span>➕ Add Specific Requirements or Notes (Optional)</span>
                  </span>
                  {showNotesAccordion ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {showNotesAccordion && (
                  <div className="p-4 pt-1 bg-slate-50/50 border-t border-slate-100">
                    <textarea
                      rows={3}
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Share any target companies, career transition details, or questions..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/25 flex items-center gap-2 transition"
                >
                  <span>Continue to Contact Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: CONTACT INFORMATION & SUBMISSION
             ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] flex items-center gap-2">
                    <span>Step 3: Where Should We Send Your Consultation?</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We will send your bespoke package recommendations, pricing, and next steps here.
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {submitError}
                </div>
              )}

              {/* Selected Services Summary Pill */}
              <div className="p-3 rounded-2xl bg-violet-50/70 border border-violet-100 flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-violet-900">
                  <span className="font-bold">Requesting:</span> {selectedServices.join(' • ')}
                </div>
                {resumeFile && (
                  <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <FileCheck className="w-3 h-3" />
                    <span>{resumeFile.name} attached</span>
                  </div>
                )}
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-800 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramsal R R"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Mobile / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. +91 99612 34378"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramsal.rr@wsa.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-violet-600"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600' },
                    { id: 'Phone Call', label: 'Phone Call', icon: Phone, color: 'text-blue-600' },
                    { id: 'Email', label: 'Email', icon: Mail, color: 'text-violet-600' },
                  ].map((ch) => {
                    const active = preferredContact === ch.id;
                    const Icon = ch.icon;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setPreferredContact(ch.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition flex items-center justify-center gap-1.5 ${
                          active
                            ? 'border-violet-600 bg-violet-50 text-violet-900 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${ch.color}`} />
                        <span className="text-xs">{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Toggle & Privacy Consent */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-700">
                    Receive instant consultation updates, sample links, and quotes on WhatsApp
                  </span>
                </label>

                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Your contact information and documents are strictly confidential and protected by enterprise NDAs.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Career Request 🚀</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              STEP 4: CONFIRMATION SCREEN
             ========================================================================= */}
          {step === 4 && submittedData && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Request Confirmed & Synchronized
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  Thank You, {fullName.split(' ')[0]}!
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your career consultation has been logged in the Hopepitome Career Hub. A dedicated senior strategist is reviewing your submission.
                </p>
              </div>

              {/* Reference Code Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-br from-violet-50 via-white to-purple-50 border border-violet-200 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Reference Code
                    </div>
                    <div className="text-base font-black text-violet-700 tracking-wide">
                      {submittedData.referenceCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyRefCode}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-violet-700 shadow-sm flex items-center gap-1 transition"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-violet-100 text-xs space-y-1">
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>Services:</span>
                    <span className="font-bold text-slate-800">{submittedData.services.join(', ')}</span>
                  </div>
                  {submittedData.fileName && (
                    <div className="text-slate-600 flex items-center justify-between">
                      <span>Resume File:</span>
                      <span className="font-bold text-emerald-700">{submittedData.fileName}</span>
                    </div>
                  )}
                  <div className="text-slate-600 flex items-center justify-between">
                    <span>Submitted On:</span>
                    <span className="font-bold text-slate-800">{submittedData.submittedAt}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps Roadmap */}
              <div className="max-w-md mx-auto text-left space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-800">What Happens Next:</div>
                <div className="space-y-2">
                  {[
                    { step: '1', title: 'Review within 2 hours', desc: 'Our lead strategist audits your profile & requirements.' },
                    { step: '2', title: 'Consultation & Roadmap', desc: `We contact you via ${preferredContact} with recommended scope and options.` },
                    { step: '3', title: 'Drafting & Deliverables', desc: 'Work begins with unlimited revisions and ATS compliance guarantee.' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="w-6 h-6 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{s.title}</div>
                        <div className="text-[11px] text-slate-500">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/career-services/portal/login"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm"
                >
                  Access Client Portal
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSubmittedData(null);
                    setResumeFile(null);
                    setResumeBase64(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. CONCISE FAQS ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">Clear, transparent answers about our career consulting engagements.</p>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-violet-700 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-violet-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

