'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FileUser,
  ScanSearch,
  Linkedin,
  MonitorSmartphone,
  BriefcaseBusiness,
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

interface ServiceCardOption {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgLight: string;
  borderColor: string;
  accentBadge: string;
  description: string;
}

const SERVICES_CATALOGUE: ServiceCardOption[] = [
  {
    id: 'Professional Resume Writing',
    name: 'Professional Resume Writing',
    icon: FileUser,
    color: '#7357F5', // Electric violet
    bgLight: 'bg-[#7357F5]/5',
    borderColor: 'border-[#7357F5]/30',
    accentBadge: 'bg-[#7357F5]/10 text-[#7357F5]',
    description: 'Build a professional resume that tells your story.',
  },
  {
    id: 'ATS Resume Optimisation',
    name: 'ATS Resume Optimisation',
    icon: ScanSearch,
    color: '#48C7E8', // Bright cyan
    bgLight: 'bg-[#48C7E8]/5',
    borderColor: 'border-[#48C7E8]/30',
    accentBadge: 'bg-[#48C7E8]/10 text-[#0E7490]',
    description: 'Improve structure, readability and role relevance.',
  },
  {
    id: 'LinkedIn Profile Makeover',
    name: 'LinkedIn Profile Makeover',
    icon: Linkedin,
    color: '#9B6BFF', // Vibrant purple
    bgLight: 'bg-[#9B6BFF]/5',
    borderColor: 'border-[#9B6BFF]/30',
    accentBadge: 'bg-[#9B6BFF]/10 text-[#9B6BFF]',
    description: 'Strengthen your professional online presence.',
  },
  {
    id: 'Personal Portfolio Website',
    name: 'Personal Portfolio Website',
    icon: MonitorSmartphone,
    color: '#FF7187', // Coral
    bgLight: 'bg-[#FF7187]/5',
    borderColor: 'border-[#FF7187]/30',
    accentBadge: 'bg-[#FF7187]/10 text-[#E11D48]',
    description: 'Showcase your projects, skills and achievements.',
  },
  {
    id: 'Managed Job Search & Applications',
    name: 'Managed Job Search & Applications',
    icon: BriefcaseBusiness,
    color: '#65DDB5', // Mint
    bgLight: 'bg-[#65DDB5]/5',
    borderColor: 'border-[#65DDB5]/30',
    accentBadge: 'bg-[#65DDB5]/15 text-[#047857]',
    description: 'Organise your job search and application activity.',
  },
];

export function CareerIntakeWizard() {
  // Step state: 1 = Services, 2 = Resume/Profile, 3 = Contact, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Selected services (multi-selection)
  const [selectedServices, setSelectedServices] = useState<string[]>(['Professional Resume Writing']);

  // Step 2: Resume upload and optional profile
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [skipResume, setSkipResume] = useState(false);

  // Step 2: Optional career fields
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [targetJobRole, setTargetJobRole] = useState('');
  const [preferredCountry, setPreferredCountry] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);

  // Step 3: Contact information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone Call' | 'Email'>('WhatsApp');
  const [consent, setConsent] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceCode: string;
    leadId?: string;
    services: string[];
    fileName?: string | null;
    submittedAt: string;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((s) => s !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Handle file selection
  const handleFile = (file: File | null) => {
    if (!file) return;
    setFileError(null);
    setSkipResume(false);

    if (file.size > 8 * 1024 * 1024) {
      setFileError('File size exceeds 8MB. Please select a smaller document.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'rtf'].includes(ext || '')) {
      setFileError('Please select a valid PDF, DOCX, DOC, or RTF document.');
      return;
    }

    setResumeFile(file);
    setUploadProgress(40);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || result;
      setResumeBase64(base64);
      setUploadProgress(100);
    };
    reader.onerror = () => {
      setFileError('Failed to read file. Please retry.');
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeBase64(null);
    setUploadProgress(0);
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
      setSubmitError('Please provide your full name (at least 2 characters).');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitError('Please provide a valid email address.');
      return;
    }

    if (!phoneWhatsapp.trim() || phoneWhatsapp.trim().length < 6) {
      setSubmitError('Please provide a valid contact / WhatsApp number.');
      return;
    }

    if (!consent) {
      setSubmitError('Please agree to allow us to process your consultation enquiry.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneWhatsapp: phoneWhatsapp.trim(),
        selectedServices,
        serviceRequired: selectedServices[0] || 'Professional Resume Writing',
        targetRole: targetJobRole.trim() || undefined,
        currentDesignation: currentDesignation.trim() || undefined,
        totalExperience: yearsOfExperience.trim() || undefined,
        targetCountry: preferredCountry.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        requirements: additionalRequirements.trim() || `Consultation requested for: ${selectedServices.join(', ')}`,
        preferredContactMethod: preferredContact,
        resumeFileName: (!skipResume && resumeFile) ? resumeFile.name : undefined,
        resumeFileSize: (!skipResume && resumeFile) ? resumeFile.size : undefined,
        resumeMimeType: (!skipResume && resumeFile) ? (resumeFile.type || 'application/pdf') : undefined,
        resumeFileBase64: (!skipResume && resumeBase64) ? resumeBase64 : undefined,
        consent: true,
      };

      const res = await fetch('/api/career-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data?.errors ? Object.values(data.errors).join(', ') : (data?.error || 'Failed to submit enquiry.'));
      }

      setSubmittedResult({
        referenceCode: data.referenceCode,
        leadId: data.leadId,
        services: selectedServices,
        fileName: (!skipResume && resumeFile) ? resumeFile.name : null,
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });

      setStep(4);
      const intakeElement = document.getElementById('intake');
      if (intakeElement) {
        intakeElement.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Enquiry submission error:', err);
      setSubmitError(err?.message || 'Error submitting enquiry. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRefCode = () => {
    if (submittedResult?.referenceCode) {
      navigator.clipboard.writeText(submittedResult.referenceCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <section id="intake" className="py-12 sm:py-16 bg-[#FAF8FF]">
      <div id="services" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Card Shell */}
        <div className="bg-white rounded-3xl border border-[#7357F5]/15 shadow-xl shadow-[#7357F5]/5 p-5 sm:p-8 md:p-10 transition-all">
          
          {/* Header & Step Indicator */}
          {step < 4 && (
            <div className="pb-6 border-b border-slate-100 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7357F5] bg-[#7357F5]/10 px-3 py-1 rounded-full mb-1.5">
                    <span>Interactive Career Intake</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#17152F] tracking-tight">
                    {step === 1 && 'Step 1 — Choose Your Service'}
                    {step === 2 && 'Step 2 — Share Your Resume or Profile'}
                    {step === 3 && 'Step 3 — Your Details & Consultation'}
                  </h2>
                </div>

                {/* Modern Progress Pill: 01 Services → 02 Resume → 03 Contact */}
                <div className="flex items-center gap-1 sm:gap-2 text-xs font-bold text-slate-400 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 self-start sm:self-center">
                  <span className={`px-2.5 py-1 rounded-xl transition ${step === 1 ? 'bg-[#7357F5] text-white shadow-sm' : step > 1 ? 'text-[#7357F5]' : 'text-slate-400'}`}>
                    01 Services
                  </span>
                  <span>→</span>
                  <span className={`px-2.5 py-1 rounded-xl transition ${step === 2 ? 'bg-[#7357F5] text-white shadow-sm' : step > 2 ? 'text-[#7357F5]' : 'text-slate-400'}`}>
                    02 Resume
                  </span>
                  <span>→</span>
                  <span className={`px-2.5 py-1 rounded-xl transition ${step === 3 ? 'bg-[#7357F5] text-white shadow-sm' : 'text-slate-400'}`}>
                    03 Contact
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 1: CHOOSE YOUR SERVICE
             ========================================================================= */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Select one or multiple services. We will build a unified consultation proposal covering your exact goals.
                </p>
                <div className="text-xs font-bold text-[#7357F5] bg-[#7357F5]/10 px-3 py-1 rounded-xl border border-[#7357F5]/20 self-start sm:self-center">
                  {selectedServices.length} {selectedServices.length === 1 ? 'Service Selected' : 'Services Selected'}
                </div>
              </div>

              {/* Five Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {SERVICES_CATALOGUE.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  const Icon = srv.icon;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`relative p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#7357F5] bg-gradient-to-br from-[#7357F5]/5 via-white to-[#9B6BFF]/5 shadow-md shadow-[#7357F5]/10 ring-2 ring-[#7357F5]/20'
                          : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        {/* Top Row: Icon + Checkmark */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                            style={{ backgroundColor: `${srv.color}15`, color: srv.color }}
                          >
                            <Icon className="w-5 h-5" />
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                              isSelected
                                ? 'bg-[#7357F5] border-[#7357F5] text-white'
                                : 'border-slate-300 bg-white text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-sm font-bold text-[#17152F] leading-snug mb-1.5">
                          {srv.name}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3">
                          {srv.description}
                        </p>
                      </div>

                      {/* Small visual accent pill */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded-md ${srv.accentBadge}`}>
                          {isSelected ? 'Selected' : 'Click to Select'}
                        </span>
                        {isSelected && (
                          <span className="text-[#7357F5] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Included in Scope</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA for Step 1 */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 text-center sm:text-left">
                  Multiple services will be consolidated into a single seamless consultation proposal.
                </span>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] to-[#9B6BFF] hover:opacity-95 shadow-md shadow-[#7357F5]/25 flex items-center justify-center gap-2 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: SHARE RESUME OR PROFILE
             ========================================================================= */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Sharing an existing document helps our strategists assess your experience faster. All career fields are completely optional.
                </p>
              </div>

              {/* Upload Card Area */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold text-[#17152F]">
                    Have an existing resume?
                  </h3>
                  <span className="text-[11px] text-slate-400">Supported: PDF, DOCX, RTF (Max 8MB)</span>
                </div>

                {!resumeFile ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFile(e.dataTransfer.files?.[0] || null);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      skipResume
                        ? 'border-slate-200 bg-slate-50/50 opacity-60'
                        : 'border-[#7357F5]/30 hover:border-[#7357F5] bg-[#7357F5]/5 hover:bg-[#7357F5]/10'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.rtf"
                      onChange={(e) => handleFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />

                    <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#7357F5] mb-3">
                      <Upload className="w-6 h-6" />
                    </div>

                    <div className="text-sm font-bold text-[#17152F]">
                      Upload it and let our team understand your experience.
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Drag & drop your file here, or click to browse from your device.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-bold text-emerald-950 truncate">
                          {resumeFile.name}
                        </div>
                        <div className="text-[11px] text-emerald-700 flex items-center gap-2">
                          <span>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-800">Ready for secure upload</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0"
                      title="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <div className="text-xs text-red-600 font-semibold">{fileError}</div>
                )}

                {/* Alternative Quick Options */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      removeFile();
                      setSkipResume(true);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                      skipResume
                        ? 'bg-[#7357F5] text-white border-[#7357F5] font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    I don't have a resume yet
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      removeFile();
                      setSkipResume(true);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                      skipResume
                        ? 'bg-[#7357F5] text-white border-[#7357F5] font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    I'll share my resume later
                  </button>
                </div>
              </div>

              {/* Optional Profile Information Accordion */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-[#17152F] hover:bg-slate-100/60 transition"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7357F5]" />
                    <span>Optional: Add Current Role & Goals</span>
                  </span>
                  {showOptionalDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showOptionalDetails && (
                  <div className="p-4 pt-1 border-t border-slate-200/80 bg-white space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Current Designation
                        </label>
                        <input
                          type="text"
                          value={currentDesignation}
                          onChange={(e) => setCurrentDesignation(e.target.value)}
                          placeholder="e.g. Senior Product Manager"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Years of Experience
                        </label>
                        <input
                          type="text"
                          value={yearsOfExperience}
                          onChange={(e) => setYearsOfExperience(e.target.value)}
                          placeholder="e.g. 8 years"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Target Job Role
                        </label>
                        <input
                          type="text"
                          value={targetJobRole}
                          onChange={(e) => setTargetJobRole(e.target.value)}
                          placeholder="e.g. VP of Product Strategy"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Preferred Country / Market
                        </label>
                        <input
                          type="text"
                          value={preferredCountry}
                          onChange={(e) => setPreferredCountry(e.target.value)}
                          placeholder="e.g. Singapore, UAE, UK, India"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          LinkedIn URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">
                          Additional Requirements or Notes
                        </label>
                        <textarea
                          rows={2}
                          value={additionalRequirements}
                          onChange={(e) => setAdditionalRequirements(e.target.value)}
                          placeholder="Brief notes on timeline, dream companies or target focus..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] to-[#9B6BFF] hover:opacity-95 shadow-md shadow-[#7357F5]/25 flex items-center gap-2 transition"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: CONTACT & SUBMISSION
             ========================================================================= */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-slate-600">
                  Please provide your contact details so our lead career strategist can deliver your consultation plan and quote.
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                  {submitError}
                </div>
              )}

              {/* Summary Pill of selections */}
              <div className="p-3.5 rounded-2xl bg-[#7357F5]/5 border border-[#7357F5]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-[#17152F]">
                  <span className="font-bold text-[#7357F5]">Selected:</span> {selectedServices.join(', ')}
                </div>
                {resumeFile && !skipResume && (
                  <div className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px]">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{resumeFile.name}</span>
                  </div>
                )}
              </div>

              {/* Required Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#17152F] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#17152F] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#17152F] mb-1">
                    WhatsApp / Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    placeholder="e.g. +91 99612 34378"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#7357F5]"
                  />
                </div>
              </div>

              {/* Preferred Channel */}
              <div>
                <label className="block text-xs font-bold text-[#17152F] mb-2">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600' },
                    { id: 'Phone Call', label: 'Phone Call', icon: Phone, color: 'text-blue-600' },
                    { id: 'Email', label: 'Email', icon: Mail, color: 'text-[#7357F5]' },
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
                            ? 'border-[#7357F5] bg-[#7357F5]/10 text-[#7357F5] font-bold'
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

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#7357F5] focus:ring-[#7357F5] border-slate-300"
                  />
                  <span>
                    I consent to having Hopepitome process my enquiry and contact me regarding career services. Documents are handled strictly in confidence.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-lg shadow-[#7357F5]/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit My Enquiry</span>
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
          {step === 4 && submittedResult && (
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Enquiry Logged Successfully
                </span>
                <h3 className="text-2xl font-black text-[#17152F]">
                  Thank You, {fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  Your enquiry has been securely registered in the Hopepitome Studio. Our lead career strategist will connect with your proposal within 2 hours.
                </p>
              </div>

              {/* Reference Code Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-br from-[#7357F5]/5 via-white to-[#9B6BFF]/5 border border-[#7357F5]/20 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Enquiry Reference ID
                    </div>
                    <div className="text-base font-black text-[#7357F5] tracking-wide">
                      {submittedResult.referenceCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyRefCode}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#7357F5] shadow-sm flex items-center gap-1 transition"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-[#7357F5]/10 text-xs space-y-1 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Requested Services:</span>
                    <span className="font-bold text-[#17152F]">{submittedResult.services.join(', ')}</span>
                  </div>
                  {submittedResult.fileName && (
                    <div className="flex items-center justify-between">
                      <span>Resume File:</span>
                      <span className="font-bold text-emerald-700">{submittedResult.fileName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Submitted:</span>
                    <span className="font-bold text-[#17152F]">{submittedResult.submittedAt}</span>
                  </div>
                </div>
              </div>

              {/* What Happens Next Roadmap */}
              <div className="max-w-md mx-auto text-left space-y-2.5 pt-2">
                <div className="text-xs font-bold text-[#17152F]">What Happens Next:</div>
                <div className="space-y-2">
                  {[
                    { num: '01', title: 'Consultation & Review', desc: 'Strategist audits your profile against target roles.' },
                    { num: '02', title: 'Proposal & Scope', desc: 'Direct WhatsApp/Email discussion with customized timeline.' },
                    { num: '03', title: 'Preparation & Unlimited Revisions', desc: 'Complete drafting with 14-day revision guarantee.' },
                  ].map((s) => (
                    <div key={s.num} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="w-6 h-6 rounded-lg bg-[#7357F5] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                        {s.num}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#17152F]">{s.title}</div>
                        <div className="text-[11px] text-slate-500 font-sans">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/career-services/portal/login"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#17152F] hover:bg-slate-800 transition shadow-sm"
                >
                  Client Portal
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSubmittedResult(null);
                    setResumeFile(null);
                    setResumeBase64(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#17152F] bg-slate-100 hover:bg-slate-200 transition"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
