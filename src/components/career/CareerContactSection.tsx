'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileUp,
  X,
  Lock,
  Sparkles,
  Mail,
  Clock,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

const careerStages = [
  'Fresh Graduate (0–1 years)',
  'Experienced Professional (2–7 years)',
  'Senior / Executive (8+ years)',
  'Career Changer / Transitioning',
  'Active Job Seeker',
  'Other / Exploring Options',
];

const serviceOptions = [
  'Professional Resume Writing',
  'ATS Resume Optimisation',
  'LinkedIn Profile Makeover',
  'Personal Portfolio Websites',
  'Managed Job Search & Applications',
  'Multiple Services / Package Discussion',
  'Other Career Inquiry',
];

const contactMethods: Array<'Email' | 'WhatsApp' | 'Phone Call'> = [
  'Email',
  'WhatsApp',
  'Phone Call',
];

export function CareerContactSection() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsapp: '',
    careerStage: careerStages[1],
    serviceRequired: serviceOptions[0],
    targetRole: '',
    industry: '',
    targetCountry: '',
    requirements: '',
    preferredContactMethod: 'Email' as 'Email' | 'WhatsApp' | 'Phone Call',
    consent: true,
    botHoneypot: '',
  });

  const [attachedFile, setAttachedFile] = useState<{ name: string; size: number } | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successData, setSuccessData] = useState<{
    referenceCode: string;
    message: string;
  } | null>(null);

  // Listen for pre-selection events from service & package buttons
  useEffect(() => {
    const handleServiceSelect = (event: Event) => {
      const customEvent = event as CustomEvent<{ service: string }>;
      if (customEvent.detail?.service) {
        setFormData((prev) => ({
          ...prev,
          serviceRequired: customEvent.detail.service,
        }));
        setCurrentStep(1);
      }
    };

    window.addEventListener('select-career-service', handleServiceSelect);
    return () => window.removeEventListener('select-career-service', handleServiceSelect);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds the 10MB limit. Please upload a smaller document.');
        return;
      }
      setAttachedFile({ name: file.name, size: file.size });
    }
  };

  const removeFile = () => {
    setAttachedFile(null);
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (formData.phoneWhatsapp && formData.phoneWhatsapp.trim().length < 6) {
      errors.phoneWhatsapp = 'Contact number must be at least 6 digits if provided.';
    }
    if (!formData.careerStage) {
      errors.careerStage = 'Please select your career stage.';
    }
    if (!formData.serviceRequired) {
      errors.serviceRequired = 'Please select a service.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setErrorMessage(null);
      setCurrentStep(2);
    } else {
      setErrorMessage('Please fill in the required fields before continuing.');
    }
  };

  const handlePrevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (!formData.requirements.trim() || formData.requirements.trim().length < 10) {
      setValidationErrors((prev) => ({
        ...prev,
        requirements: 'Please provide a brief description of your goals or requirements (at least 10 characters).',
      }));
      setErrorMessage('Please describe your requirements in Step 2.');
      return;
    }

    if (!formData.consent) {
      setValidationErrors((prev) => ({
        ...prev,
        consent: 'Please confirm agreement to our privacy terms.',
      }));
      return;
    }

    setStatus('submitting');
    setErrorMessage(null);

    try {
      const fullRequirements = formData.industry
        ? `[Industry: ${formData.industry}] ${formData.requirements}`
        : formData.requirements;

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneWhatsapp: formData.phoneWhatsapp || undefined,
        careerStage: formData.careerStage,
        serviceRequired: formData.serviceRequired,
        targetRole: formData.targetRole || undefined,
        targetCountry: formData.targetCountry || undefined,
        requirements: fullRequirements,
        preferredContactMethod: formData.preferredContactMethod,
        consent: formData.consent,
        botHoneypot: formData.botHoneypot || undefined,
        resumeFileName: attachedFile?.name || undefined,
        resumeFileSize: attachedFile?.size || undefined,
      };

      const res = await fetch('/api/career-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setStatus('error');
        if (data?.errors) {
          setValidationErrors(data.errors);
          setErrorMessage('Please correct the highlighted fields and try again.');
        } else {
          setErrorMessage(data?.error || 'Unable to submit enquiry. Please try again.');
        }
        return;
      }

      setStatus('success');
      setSuccessData({
        referenceCode: data.referenceCode,
        message: data.message,
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage('Network connection error. Please verify your connection and submit again.');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneWhatsapp: '',
      careerStage: careerStages[1],
      serviceRequired: serviceOptions[0],
      targetRole: '',
      industry: '',
      targetCountry: '',
      requirements: '',
      preferredContactMethod: 'Email',
      consent: true,
      botHoneypot: '',
    });
    setAttachedFile(null);
    setCurrentStep(1);
    setStatus('idle');
    setSuccessData(null);
    setValidationErrors({});
    setErrorMessage(null);
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Guidance & Accurate Privacy Terms */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC]">
              <Sparkles className="w-3 h-3 text-[#8172A8]" />
              GET STARTED
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#17243B] tracking-tight">
              Let&apos;s work on your next professional move.
            </h2>

            <p className="text-base text-[#292D36]/80 leading-relaxed font-sans">
              Tell us where you are in your career journey and what support you need. We will help
              you identify the right service, review your background, and provide a clear quotation
              and timeline.
            </p>

            {/* Accurate Privacy & Confidentiality Notice Card */}
            <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-6 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#17243B]">
                <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
                <span>Document Privacy & Confidentiality</span>
              </div>
              <p className="text-xs text-[#777781] leading-relaxed">
                Your resume, contact details, and career discussions are treated with strict
                confidentiality. Materials are shared only with the specialist assigned to your
                project, never sold, and never shared with third-party databases. You can request
                deletion of your submitted documents at any time.
              </p>
              <div className="pt-2 border-t border-[#E6E2DC]/80 flex items-center space-x-2 text-[11px] font-mono text-[#8172A8]">
                <Lock className="w-3.5 h-3.5" />
                <span>Confidential review policy · Direct client access</span>
              </div>
            </div>

            {/* Direct Intake Contact Channels */}
            <div className="space-y-3 pt-2 text-xs font-mono text-[#292D36]">
              <div className="flex items-center space-x-3 p-3 bg-[#F7F5F0] rounded-xl border border-[#E6E2DC]">
                <Mail className="w-4 h-4 text-[#8172A8]" />
                <span>Direct Studio Email: studio@hopepitome.com</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-[#F7F5F0] rounded-xl border border-[#E6E2DC]">
                <Clock className="w-4 h-4 text-[#8172A8]" />
                <span>Response Timeframe: Typically within 1–2 business days</span>
              </div>
            </div>
          </div>

          {/* Right Column: Two-Step Consultation Intake Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8FC] rounded-3xl border border-[#E6E2DC] p-6 sm:p-10 shadow-sm relative">
              {status === 'success' && successData ? (
                /* Success State */
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Enquiry Registered
                    </span>
                    <h3 className="font-display font-bold text-2xl text-[#17243B] mt-2">
                      Thank You, {formData.fullName}.
                    </h3>
                    <p className="text-xs font-mono text-[#8172A8] font-bold">
                      Reference Code: {successData.referenceCode}
                    </p>
                    <p className="text-sm text-[#292D36]/80 max-w-md mx-auto leading-relaxed pt-2">
                      {successData.message}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#E6E2DC] p-5 max-w-md mx-auto text-left text-xs space-y-2 text-[#777781]">
                    <div className="flex justify-between border-b border-[#E6E2DC]/60 pb-2">
                      <span>Service Selected:</span>
                      <strong className="text-[#17243B]">{formData.serviceRequired}</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E6E2DC]/60 pb-2">
                      <span>Career Stage:</span>
                      <strong className="text-[#17243B]">{formData.careerStage}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Preferred Contact:</span>
                      <strong className="text-[#17243B]">{formData.preferredContactMethod}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white px-6 py-3 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                /* Two-Step Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step Progress Indicators */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E6E2DC]">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          currentStep === 1
                            ? 'bg-[#17243B] text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        1
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          currentStep === 1 ? 'text-[#17243B]' : 'text-[#777781]'
                        }`}
                      >
                        Your Details & Service
                      </span>
                    </div>

                    <div className="h-0.5 w-8 bg-[#E6E2DC]" />

                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                          currentStep === 2
                            ? 'bg-[#17243B] text-white'
                            : 'bg-[#E6E2DC] text-[#777781]'
                        }`}
                      >
                        2
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          currentStep === 2 ? 'text-[#17243B]' : 'text-[#777781]'
                        }`}
                      >
                        Career Background & Notes
                      </span>
                    </div>
                  </div>

                  {/* Anti-spam honeypot */}
                  <input
                    type="text"
                    name="botHoneypot"
                    value={formData.botHoneypot}
                    onChange={(e) => setFormData({ ...formData, botHoneypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* STEP 1: Basic Information & Service Choice */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      {/* Full Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Full Name <span className="text-[#8172A8]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Sarah Jenkins"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8] ${
                              validationErrors.fullName ? 'border-rose-300' : 'border-[#E6E2DC]'
                            }`}
                          />
                          {validationErrors.fullName && (
                            <p className="text-[11px] text-rose-600 mt-1">{validationErrors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Email Address <span className="text-[#8172A8]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. sarah@example.com"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8] ${
                              validationErrors.email ? 'border-rose-300' : 'border-[#E6E2DC]'
                            }`}
                          />
                          {validationErrors.email && (
                            <p className="text-[11px] text-rose-600 mt-1">{validationErrors.email}</p>
                          )}
                        </div>
                      </div>

                      {/* WhatsApp / Phone & Service Required */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            WhatsApp / Contact Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phoneWhatsapp}
                            onChange={(e) =>
                              setFormData({ ...formData, phoneWhatsapp: e.target.value })
                            }
                            placeholder="e.g. +65 8123 4567"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8] ${
                              validationErrors.phoneWhatsapp ? 'border-rose-300' : 'border-[#E6E2DC]'
                            }`}
                          />
                          {validationErrors.phoneWhatsapp && (
                            <p className="text-[11px] text-rose-600 mt-1">
                              {validationErrors.phoneWhatsapp}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Service Required <span className="text-[#8172A8]">*</span>
                          </label>
                          <select
                            value={formData.serviceRequired}
                            onChange={(e) =>
                              setFormData({ ...formData, serviceRequired: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                          >
                            {serviceOptions.map((srv) => (
                              <option key={srv} value={srv}>
                                {srv}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Career Stage */}
                      <div>
                        <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                          Current Career Stage <span className="text-[#8172A8]">*</span>
                        </label>
                        <select
                          value={formData.careerStage}
                          onChange={(e) =>
                            setFormData({ ...formData, careerStage: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                        >
                          {careerStages.map((cs) => (
                            <option key={cs} value={cs}>
                              {cs}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Step 1 Action */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#17243B] text-white hover:bg-[#292D36] active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2"
                        >
                          <span>Continue to Step 2: Career Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Career Background & Requirements */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      {/* Target Role & Target Industry */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Target Role or Title
                          </label>
                          <input
                            type="text"
                            value={formData.targetRole}
                            onChange={(e) =>
                              setFormData({ ...formData, targetRole: e.target.value })
                            }
                            placeholder="e.g. Senior Product Manager"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Industry / Sector
                          </label>
                          <input
                            type="text"
                            value={formData.industry}
                            onChange={(e) =>
                              setFormData({ ...formData, industry: e.target.value })
                            }
                            placeholder="e.g. Technology / SaaS / FinTech"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                          />
                        </div>
                      </div>

                      {/* Preferred Job Market & Contact Method */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Country or Preferred Job Market
                          </label>
                          <input
                            type="text"
                            value={formData.targetCountry}
                            onChange={(e) =>
                              setFormData({ ...formData, targetCountry: e.target.value })
                            }
                            placeholder="e.g. Singapore, UAE, UK, Remote"
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                            Preferred Contact Method
                          </label>
                          <select
                            value={formData.preferredContactMethod}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                preferredContactMethod: e.target.value as any,
                              })
                            }
                            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                          >
                            {contactMethods.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                          Brief Description of Requirements <span className="text-[#8172A8]">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={formData.requirements}
                          onChange={(e) =>
                            setFormData({ ...formData, requirements: e.target.value })
                          }
                          placeholder="Briefly describe your goals, career transition points, target companies, or specific timeline..."
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8] ${
                            validationErrors.requirements ? 'border-rose-300' : 'border-[#E6E2DC]'
                          }`}
                        />
                        {validationErrors.requirements && (
                          <p className="text-[11px] text-rose-600 mt-1">
                            {validationErrors.requirements}
                          </p>
                        )}
                      </div>

                      {/* Optional Resume Upload */}
                      <div>
                        <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                          Optional: Attach Existing Resume Draft (PDF, DOCX — Max 10MB)
                        </label>

                        {attachedFile ? (
                          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#8172A8]/50">
                            <div className="flex items-center space-x-2 text-xs text-[#17243B] truncate">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-medium truncate">{attachedFile.name}</span>
                              <span className="text-[10px] font-mono text-[#777781] shrink-0">
                                ({Math.round(attachedFile.size / 1024)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="text-xs text-rose-600 hover:text-rose-800 p-1 rounded-md"
                              title="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#E6E2DC] hover:border-[#8172A8] rounded-xl cursor-pointer bg-white transition-colors">
                            <FileUp className="w-5 h-5 text-[#8172A8] mb-1" />
                            <span className="text-xs font-semibold text-[#17243B]">
                              Click to select file or drag & drop document
                            </span>
                            <span className="text-[10px] text-[#777781] mt-0.5">
                              Files are kept strictly confidential and can be deleted upon request
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.rtf,.txt"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Accurate Privacy Agreement Checkbox */}
                      <div className="pt-1">
                        <label className="flex items-start space-x-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.consent}
                            onChange={(e) =>
                              setFormData({ ...formData, consent: e.target.checked })
                            }
                            className="mt-0.5 rounded border-[#E6E2DC] text-[#8172A8] focus:ring-[#8172A8]"
                          />
                          <span className="text-[11px] text-[#777781] leading-relaxed">
                            I confirm that the information provided is accurate and consent to
                            Hopepitome reviewing my submitted materials solely for career consultation
                            and quotation purposes. Documents are kept confidential and will not be
                            shared with third parties.
                          </span>
                        </label>
                        {validationErrors.consent && (
                          <p className="text-[11px] text-rose-600 mt-1">{validationErrors.consent}</p>
                        )}
                      </div>

                      {/* Navigation buttons: Back & Submit */}
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-white border border-[#E6E2DC] hover:border-[#8172A8] transition-all flex items-center space-x-1.5"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>

                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="flex-1 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#17243B] text-white hover:bg-[#292D36] active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {status === 'submitting' ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Submitting Enquiry...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit My Enquiry</span>
                              <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
