'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  FilePenLine,
  FileText,
  ScanText,
  Award,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileCheck2,
  X,
  CircleCheck,
  ShieldCheck,
  Clock3,
  Phone,
  Mail,
  MessageSquare,
  CircleX,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import { CareerStudioHeader } from '@/components/career/CareerStudioHeader';
import { CareerBottomNav } from '@/components/career/CareerBottomNav';
import { CareerFooter } from '@/components/career/CareerFooter';

// Step 1 Service Options
interface ResumeServiceOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: any;
}

const RESUME_SERVICE_OPTIONS: ResumeServiceOption[] = [
  {
    id: 'New Resume Creation',
    name: 'New Resume Creation',
    badge: 'From Scratch',
    description: 'Craft a powerful new resume from the ground up based on your career achievements.',
    icon: FilePenLine,
  },
  {
    id: 'Existing Resume Rewrite',
    name: 'Existing Resume Rewrite',
    badge: 'Popular',
    description: 'Modernize and elevate your current resume into an achievement-driven professional document.',
    icon: FileText,
  },
  {
    id: 'ATS Resume Optimisation',
    name: 'ATS Resume Optimisation',
    badge: 'ATS Compliant',
    description: 'Restructure layout and optimize keyword alignment to pass enterprise ATS screeners.',
    icon: ScanText,
  },
  {
    id: 'Executive Resume Development',
    name: 'Executive Resume Development',
    badge: 'Leadership',
    description: 'Tailored executive dossiers and board-ready bios for directors, VPs, and C-level leaders.',
    icon: Award,
  },
  {
    id: 'Fresh Graduate Resume',
    name: 'Fresh Graduate Resume',
    badge: 'Entry Level',
    description: 'Highlight academic achievements, internships, and project capstones for early career success.',
    icon: GraduationCap,
  },
];

// Delivery expectations
const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Scope (3–5 Business Days)', badge: 'Recommended' },
  { id: 'express', label: 'Express Priority (24–48 Hours)', badge: 'Fast Track' },
  { id: 'flexible', label: 'Flexible / Standard Scoping Window', badge: 'Standard' },
];

// Career Goals
const CAREER_GOALS = [
  'Transition into a new domain or industry',
  'Step up into a senior or executive leadership role',
  'Target international relocation and overseas positions',
  'Land my first full-time role (Entry Level / Graduate)',
  'General professional refresh and career modernization',
];

// Format types
const FORMAT_OPTIONS = [
  'Reverse-Chronological (Standard corporate recruiter format)',
  'Hybrid / Combination (Competencies + employment history)',
  'Executive Dossier (Leadership bio + career timeline)',
  'Let Hopepitome career strategists recommend the optimal format',
];

export default function ResumeWritingJourneyPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Selected service
  const [selectedService, setSelectedService] = useState<string>('Existing Resume Rewrite');

  // Step 2: Background Details & File
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [skipResumeUpload, setSkipResumeUpload] = useState<boolean>(false);
  const [currentDesignation, setCurrentDesignation] = useState<string>('');
  const [yearsOfExperience, setYearsOfExperience] = useState<string>('');
  const [targetJobRole, setTargetJobRole] = useState<string>('');
  const [targetIndustry, setTargetIndustry] = useState<string>('');
  const [preferredCountry, setPreferredCountry] = useState<string>('');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');

  // Step 3: Requirements & Delivery
  const [careerGoal, setCareerGoal] = useState<string>(CAREER_GOALS[0]);
  const [resumeFormat, setResumeFormat] = useState<string>(FORMAT_OPTIONS[0]);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');
  const [deliveryExpectation, setDeliveryExpectation] = useState<string>(DELIVERY_OPTIONS[0].label);

  // Step 4: Contact details
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  const [consent, setConsent] = useState<boolean>(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceCode: string;
    submittedAt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setResumeFile(f);
      setSkipResumeUpload(false);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setResumeBase64(reader.result);
        }
      };
      reader.readAsDataURL(f);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setResumeBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Validation before going to next step
  const handleNext = () => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!selectedService) {
        setErrorMsg('Please select a resume writing service to continue.');
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 2) {
      // Must have either an uploaded resume OR current designation/experience details
      if (!resumeFile && !skipResumeUpload && !currentDesignation.trim()) {
        setErrorMsg('Please either attach your existing resume or enter your current designation.');
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 4) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!phoneNumber.trim()) {
        setErrorMsg('Please enter your WhatsApp or mobile number.');
        return;
      }
      if (!consent) {
        setErrorMsg('Please agree to allow Hopepitome to process your consultation enquiry.');
        return;
      }
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const fullPhone = `${countryCode} ${phoneNumber.trim()}`;
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneWhatsapp: fullPhone,
        selectedServices: [selectedService],
        serviceRequired: selectedService,
        targetRole: targetJobRole.trim() || undefined,
        currentDesignation: currentDesignation.trim() || undefined,
        totalExperience: yearsOfExperience.trim() || undefined,
        targetCountry: preferredCountry.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        requirements: `[Goal: ${careerGoal}] [Format: ${resumeFormat}] [Delivery: ${deliveryExpectation}] ${additionalRequirements.trim()}`,
        preferredContactMethod: preferredContact,
        resumeFileName: resumeFile ? resumeFile.name : undefined,
        resumeFileSize: resumeFile ? resumeFile.size : undefined,
        resumeMimeType: resumeFile ? (resumeFile.type || 'application/pdf') : undefined,
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
        throw new Error(data?.error || 'Failed to submit resume writing request. Please retry.');
      }

      setSubmittedResult({
        referenceCode: data.referenceCode || `HP-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit request. Please check your network and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8FF] text-[#24233A] min-h-screen flex flex-col font-sans antialiased selection:bg-[#7454F5]/20 selection:text-[#7454F5]">
      {/* 1. Header */}
      <CareerStudioHeader />

      <main className="flex-1 pt-20 pb-24 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back shortcut */}
          <div className="mb-4">
            <Link
              href="/career-services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71778A] hover:text-[#7454F5] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Career Studio</span>
            </Link>
          </div>

          {/* If already submitted, display confirmation screen */}
          {submittedResult ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-[#149B75]/10 text-[#149B75] flex items-center justify-center mx-auto shadow-sm">
                <CircleCheck className="w-8 h-8" strokeWidth={1.9} />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#149B75] bg-[#149B75]/10 px-3 py-1 rounded-full">
                  Request Received
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#17152F] tracking-tight mt-2">
                  Your resume writing request has been submitted.
                </h1>
                <p className="text-xs sm:text-sm text-[#71778A] mt-2 max-w-lg mx-auto leading-relaxed">
                  Our senior career strategists are reviewing your background and requirements. We will prepare a customized scope and quotation tailored to your experience level.
                </p>
              </div>

              {/* Reference Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#71778A]">Enquiry Reference:</span>
                  <span className="font-mono font-bold text-[#7454F5] text-sm">
                    {submittedResult.referenceCode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#71778A]">Service Required:</span>
                  <span className="font-semibold text-[#17152F]">{selectedService}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#71778A]">Preferred Contact:</span>
                  <span className="font-semibold text-[#17152F] capitalize">{preferredContact}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#71778A]">Consultant Turnaround:</span>
                  <span className="font-semibold text-[#149B75]">Within 24 Business Hours</span>
                </div>
              </div>

              {/* Quotation Policy Banner */}
              <div className="max-w-md mx-auto p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Scope-Based Custom Quotation:</strong> Hopepitome does not charge fixed generic packages. You will receive an exact proposal based on your career depth and goals with zero automated obligations.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Link
                  href="/career-services"
                  className="w-full sm:w-1/2 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-[#201D36] bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                >
                  Return to Studio
                </Link>
                <Link
                  href="/career-services/portal/login"
                  className="w-full sm:w-1/2 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] shadow-sm flex items-center justify-center transition"
                >
                  Candidate Portal
                </Link>
              </div>
            </div>
          ) : (
            /* =========================================================================
                5-STEP INTERACTIVE WIZARD
               ========================================================================= */
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              
              {/* Stepper Header */}
              <div className="p-5 sm:p-7 border-b border-slate-100 bg-gradient-to-b from-[#F8F7FC] to-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7454F5] bg-[#7454F5]/10 px-2.5 py-0.5 rounded-md">
                    Step {currentStep} of 5
                  </span>
                  <span className="text-xs text-[#71778A] font-medium">
                    {currentStep === 1 && 'Service Selection'}
                    {currentStep === 2 && 'Career Background'}
                    {currentStep === 3 && 'Goals & Scope'}
                    {currentStep === 4 && 'Contact Information'}
                    {currentStep === 5 && 'Review & Submission'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-[#17152F] tracking-tight">
                  Build a Resume That Reflects Your Professional Value.
                </h1>
                <p className="text-xs sm:text-sm text-[#71778A] mt-1 leading-relaxed">
                  Get a professionally written resume tailored to your experience, industry and career goals.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div
                    className="bg-[#7454F5] h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className="mx-5 sm:mx-7 mt-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <CircleX className="w-4 h-4 text-red-600 shrink-0 mt-0.5" strokeWidth={1.9} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* =====================================================================
                  STEP 1 — CHOOSE YOUR RESUME SERVICE
                 ===================================================================== */}
              {currentStep === 1 && (
                <div className="p-5 sm:p-7 space-y-3.5">
                  <div className="mb-2">
                    <h2 className="text-sm font-bold text-[#17152F]">
                      Choose your resume service
                    </h2>
                    <p className="text-xs text-[#71778A] mt-0.5">
                      Select the option that best matches your immediate career requirements.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {RESUME_SERVICE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selectedService === opt.name;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => setSelectedService(opt.name)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#7454F5]/5 border-[#7454F5] shadow-xs'
                              : 'bg-white hover:bg-slate-50/80 border-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? 'bg-[#7454F5] text-white shadow-xs'
                                  : 'bg-slate-100 text-[#71778A]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-bold text-[#17152F]">
                                  {opt.name}
                                </h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#71778A]">
                                  {opt.badge}
                                </span>
                              </div>
                              <p className="text-xs text-[#71778A] mt-0.5 leading-relaxed">
                                {opt.description}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-[#7454F5] bg-[#7454F5] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =====================================================================
                  STEP 2 — SHARE YOUR BACKGROUND
                 ===================================================================== */}
              {currentStep === 2 && (
                <div className="p-5 sm:p-7 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#17152F]">
                      Share your career background
                    </h2>
                    <p className="text-xs text-[#71778A] mt-0.5">
                      Upload your current draft or share your experience details manually.
                    </p>
                  </div>

                  {/* Document upload dropzone */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                      Upload Existing Resume (PDF, DOCX, DOC, TXT)
                    </label>

                    {resumeFile ? (
                      <div className="p-4 rounded-2xl bg-[#149B75]/5 border border-[#149B75]/30 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileCheck2 className="w-6 h-6 text-[#149B75] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#17152F] truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-[10px] text-[#71778A]">
                              {(resumeFile.size / 1024).toFixed(1)} KB • Attached
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-red-600 flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#7454F5] bg-slate-50/50 hover:bg-[#7454F5]/5 text-center cursor-pointer transition"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Upload className="w-6 h-6 text-[#7454F5] mx-auto mb-2" />
                        <p className="text-xs font-bold text-[#17152F]">
                          Tap to select or drop your resume here
                        </p>
                        <p className="text-[11px] text-[#71778A] mt-0.5">
                          PDF, DOCX, DOC or TXT (Max 15MB)
                        </p>
                      </div>
                    )}

                    {/* Manual skip toggle */}
                    <div className="mt-2 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-[#71778A] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={skipResumeUpload}
                          onChange={(e) => {
                            setSkipResumeUpload(e.target.checked);
                            if (e.target.checked) removeFile();
                          }}
                          className="rounded text-[#7454F5]"
                        />
                        <span>I don't have an existing resume (enter details manually)</span>
                      </label>
                    </div>
                  </div>

                  {/* Manual Experience Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Current Designation / Title {!resumeFile && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        type="text"
                        value={currentDesignation}
                        onChange={(e) => setCurrentDesignation(e.target.value)}
                        placeholder="e.g. IT Sourcing Coordinator"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Total Years of Experience
                      </label>
                      <input
                        type="text"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                        placeholder="e.g. 5+ Years"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Target Job Title / Role (Optional)
                      </label>
                      <input
                        type="text"
                        value={targetJobRole}
                        onChange={(e) => setTargetJobRole(e.target.value)}
                        placeholder="e.g. Senior Procurement Manager"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Target Industry / Sector (Optional)
                      </label>
                      <input
                        type="text"
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                        placeholder="e.g. Technology / Supply Chain"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Target Country / Geography (Optional)
                      </label>
                      <input
                        type="text"
                        value={preferredCountry}
                        onChange={(e) => setPreferredCountry(e.target.value)}
                        placeholder="e.g. UAE / India / Singapore"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        LinkedIn Profile URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =====================================================================
                  STEP 3 — REQUIREMENTS & SCOPE
                 ===================================================================== */}
              {currentStep === 3 && (
                <div className="p-5 sm:p-7 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#17152F]">
                      Define your career goals and expectations
                    </h2>
                    <p className="text-xs text-[#71778A] mt-0.5">
                      Help us understand what success looks like for your next career move.
                    </p>
                  </div>

                  {/* Career Goal */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                      Primary Career Goal
                    </label>
                    <div className="space-y-1.5">
                      {CAREER_GOALS.map((goal) => (
                        <label
                          key={goal}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition ${
                            careerGoal === goal
                              ? 'bg-[#7454F5]/5 border-[#7454F5] font-semibold text-[#17152F]'
                              : 'bg-white border-slate-200 text-[#71778A]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="careerGoal"
                            checked={careerGoal === goal}
                            onChange={() => setCareerGoal(goal)}
                            className="text-[#7454F5]"
                          />
                          <span>{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Resume Format Preference */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                      Preferred Resume Format
                    </label>
                    <div className="space-y-1.5">
                      {FORMAT_OPTIONS.map((fmt) => (
                        <label
                          key={fmt}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition ${
                            resumeFormat === fmt
                              ? 'bg-[#7454F5]/5 border-[#7454F5] font-semibold text-[#17152F]'
                              : 'bg-white border-slate-200 text-[#71778A]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="resumeFormat"
                            checked={resumeFormat === fmt}
                            onChange={() => setResumeFormat(fmt)}
                            className="text-[#7454F5]"
                          />
                          <span>{fmt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Expectation */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                      Preferred Turnaround Expectation
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {DELIVERY_OPTIONS.map((del) => {
                        const isSel = deliveryExpectation === del.label;
                        return (
                          <div
                            key={del.id}
                            onClick={() => setDeliveryExpectation(del.label)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                              isSel
                                ? 'bg-[#7454F5]/5 border-[#7454F5] font-bold text-[#17152F]'
                                : 'bg-white border-slate-200 text-[#71778A]'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-[#7454F5] block">
                              {del.badge}
                            </span>
                            <span className="mt-0.5 block">{del.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Additional Instructions or Highlights (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      placeholder="Mention specific projects, metrics, certifications, or awards you want highlighted in the rewrite..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#7454F5] bg-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* =====================================================================
                  STEP 4 — CONTACT DETAILS
                 ===================================================================== */}
              {currentStep === 4 && (
                <div className="p-5 sm:p-7 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#17152F]">
                      Your contact details
                    </h2>
                    <p className="text-xs text-[#71778A] mt-0.5">
                      Where should our senior resume strategist send your custom scope and quotation?
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tharun Jose"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        WhatsApp / Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="w-24 h-11 px-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#7454F5] bg-white shrink-0"
                        >
                          <option value="+91">+91 (IN)</option>
                          <option value="+971">+971 (UAE)</option>
                          <option value="+1">+1 (US/CA)</option>
                          <option value="+44">+44 (UK)</option>
                          <option value="+65">+65 (SG)</option>
                          <option value="+61">+61 (AU)</option>
                          <option value="+49">+49 (DE)</option>
                          <option value="+966">+966 (SA)</option>
                          <option value="+974">+974 (QA)</option>
                        </select>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          className="flex-1 h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred contact channel */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                      Preferred Communication Channel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                        { id: 'email', label: 'Email', icon: Mail },
                        { id: 'phone', label: 'Phone Call', icon: Phone },
                      ].map((ch) => {
                        const Icon = ch.icon;
                        const isSel = preferredContact === ch.id;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => setPreferredContact(ch.id as any)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                              isSel
                                ? 'bg-[#7454F5]/10 text-[#7454F5] border-[#7454F5]/40 font-bold'
                                : 'bg-slate-50 text-[#71778A] border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{ch.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2 text-xs text-[#71778A] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded text-[#7454F5] focus:ring-[#7454F5]"
                      />
                      <span>
                        I consent to Hopepitome contacting me with a tailored scope and quotation proposal. My documents and contact information are protected under strict 24-hour privacy retention rules.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* =====================================================================
                  STEP 5 — REVIEW AND SUBMIT
                 ===================================================================== */}
              {currentStep === 5 && (
                <div className="p-5 sm:p-7 space-y-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#17152F]">
                      Review your request details
                    </h2>
                    <p className="text-xs text-[#71778A] mt-0.5">
                      Verify your selections before submitting for quotation. You can edit any section.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1: Service */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#7454F5] tracking-wider block">
                          Selected Service
                        </span>
                        <span className="text-sm font-bold text-[#17152F]">{selectedService}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-bold text-[#7454F5] flex items-center gap-1 hover:underline"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={1.9} />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Item 2: Document & Background */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#7454F5] tracking-wider block">
                          Resume Document & Experience
                        </span>
                        <span className="text-sm font-bold text-[#17152F]">
                          {resumeFile ? resumeFile.name : (currentDesignation || 'Manual details provided')}
                        </span>
                        {yearsOfExperience && (
                          <p className="text-xs text-[#71778A]">Experience: {yearsOfExperience}</p>
                        )}
                        {targetJobRole && (
                          <p className="text-xs text-[#71778A]">Target Role: {targetJobRole}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs font-bold text-[#7454F5] flex items-center gap-1 hover:underline"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={1.9} />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Item 3: Goals & Scope */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#7454F5] tracking-wider block">
                          Scope & Goal
                        </span>
                        <span className="text-xs font-semibold text-[#17152F] block">{careerGoal}</span>
                        <p className="text-xs text-[#71778A] mt-0.5">{deliveryExpectation}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-xs font-bold text-[#7454F5] flex items-center gap-1 hover:underline"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={1.9} />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Item 4: Contact */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#7454F5] tracking-wider block">
                          Contact Information
                        </span>
                        <span className="text-sm font-bold text-[#17152F]">{fullName}</span>
                        <p className="text-xs text-[#71778A]">{email} • {countryCode} {phoneNumber}</p>
                        <p className="text-[11px] text-[#149B75] font-semibold mt-0.5">
                          Preferred: {preferredContact}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="text-xs font-bold text-[#7454F5] flex items-center gap-1 hover:underline"
                      >
                        <Pencil className="w-3 h-3" strokeWidth={1.9} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#71778A] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#149B75] shrink-0" />
                    <span>
                      Zero upfront payment required. You will review a custom scope proposal tailored to your needs.
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Controls Footer */}
              <div className="p-5 sm:p-7 border-t border-slate-100 bg-[#F8F7FC] flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="min-h-[46px] px-4 rounded-xl text-xs font-bold text-[#71778A] hover:text-[#17152F] bg-white border border-slate-200 transition shadow-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="min-h-[46px] px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] shadow-sm flex items-center gap-2 transition active:scale-95 cursor-pointer ml-auto"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-h-[48px] px-8 rounded-xl text-sm font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] shadow-sm disabled:bg-slate-300 flex items-center gap-2 transition active:scale-95 cursor-pointer ml-auto"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <span>Submit Resume Writing Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <CareerFooter />

      {/* Mobile Bottom Navigation */}
      <CareerBottomNav />
    </div>
  );
}

