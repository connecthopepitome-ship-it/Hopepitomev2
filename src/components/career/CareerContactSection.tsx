'use client';

import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileUp,
  X,
  Lock,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
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
  'Resume Crafting',
  'ATS Resume Optimisation',
  'LinkedIn Profile Makeover',
  'Personal Portfolio Development',
  'Managed Job Search & Applications',
  'Multiple Services (Package Discussion)',
];

const contactMethods: Array<'Email' | 'WhatsApp' | 'Phone Call'> = [
  'Email',
  'WhatsApp',
  'Phone Call',
];

export function CareerContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneWhatsapp: '',
    careerStage: careerStages[1],
    serviceRequired: serviceOptions[0],
    targetRole: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);
    setValidationErrors({});

    try {
      const payload = {
        ...formData,
        resumeFileName: attachedFile?.name || null,
        resumeFileSize: attachedFile?.size || null,
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
      targetCountry: '',
      requirements: '',
      preferredContactMethod: 'Email',
      consent: true,
      botHoneypot: '',
    });
    setAttachedFile(null);
    setStatus('idle');
    setSuccessData(null);
    setValidationErrors({});
    setErrorMessage(null);
  };

  return (
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Guidance & Confidentiality Notice */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC]">
              <Sparkles className="w-3 h-3 text-[#8172A8]" />
              CONFIDENTIAL INTAKE
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#17243B] tracking-tight">
              Let&apos;s work on your next professional move.
            </h2>

            <p className="text-base text-[#292D36]/80 leading-relaxed font-sans">
              Tell us where you are in your career journey and what support you need. We will help
              you identify the right service, review your background, and provide a clear quotation
              and timeline.
            </p>

            {/* Privacy & Confidentiality Guarantee Card */}
            <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-6 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#17243B]">
                <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
                <span>Strict Client Data Privacy Commitment</span>
              </div>
              <p className="text-xs text-[#777781] leading-relaxed">
                Your resume, contact details, work history, and target career discussions are held
                in strict professional confidence. We never share client materials with external third
                parties, recruiters, or public databases.
              </p>
              <div className="pt-2 border-t border-[#E6E2DC]/80 flex items-center space-x-2 text-[11px] font-mono text-[#8172A8]">
                <Lock className="w-3.5 h-3.5" />
                <span>End-to-end encrypted transfer & storage policy</span>
              </div>
            </div>

            {/* Intake Contact Channels */}
            <div className="space-y-3 pt-2 text-xs font-mono text-[#292D36]">
              <div className="flex items-center space-x-3 p-3 bg-[#F7F5F0] rounded-xl border border-[#E6E2DC]">
                <Mail className="w-4 h-4 text-[#8172A8]" />
                <span>Direct Studio Email: studio@hopepitome.com</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-[#F7F5F0] rounded-xl border border-[#E6E2DC]">
                <MessageSquare className="w-4 h-4 text-[#8172A8]" />
                <span>Consultation Response SLA: Within 24 business hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Consultation Intake Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FAF8FC] rounded-3xl border border-[#E6E2DC] p-8 sm:p-10 shadow-sm relative">
              {status === 'success' && successData ? (
                /* Success State */
                <div className="text-center py-10 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Intake Registered
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
                      <span>Service Requested:</span>
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
                /* Main Form */
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1: Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                        placeholder="e.g. sarah@domain.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8] ${
                          validationErrors.email ? 'border-rose-300' : 'border-[#E6E2DC]'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="text-[11px] text-rose-600 mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: WhatsApp / Phone & Preferred Contact Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                  {/* Row 3: Career Stage & Primary Service Required */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                  {/* Row 4: Target Role & Target Country / Market */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                        Target Role or Industry
                      </label>
                      <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        placeholder="e.g. Senior Product Manager / FinTech"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E6E2DC] text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
                      />
                    </div>

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
                  </div>

                  {/* Description of Requirements */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                      Brief Description of Requirements <span className="text-[#8172A8]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Share your goals, career challenges, target companies, or specific timelines..."
                      className={`w-full px-4 py-3 rounded-xl border text-xs bg-white text-[#292D36] focus:outline-none focus:ring-2 focus:ring-[#8172A8] ${
                        validationErrors.requirements ? 'border-rose-300' : 'border-[#E6E2DC]'
                      }`}
                    />
                    {validationErrors.requirements && (
                      <p className="text-[11px] text-rose-600 mt-1">
                        {validationErrors.requirements}
                      </p>
                    )}
                  </div>

                  {/* Optional Resume Upload Area */}
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                      Optional: Attach Existing Resume / Career Notes (PDF, DOCX — Max 10MB)
                    </label>

                    {attachedFile ? (
                      <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#8172A8]/50">
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
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#E6E2DC] hover:border-[#8172A8] rounded-xl cursor-pointer bg-white transition-colors">
                        <FileUp className="w-6 h-6 text-[#8172A8] mb-1" />
                        <span className="text-xs font-semibold text-[#17243B]">
                          Click to select or drag & drop document
                        </span>
                        <span className="text-[11px] text-[#777781] mt-0.5">
                          PDF, DOCX, or RTF formats accepted
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

                  {/* Privacy Agreement & Consent */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 rounded border-[#E6E2DC] text-[#8172A8] focus:ring-[#8172A8]"
                      />
                      <span className="text-[11px] text-[#777781] leading-relaxed">
                        I confirm that the information provided is accurate and consent to
                        Hopepitome reviewing my submitted materials solely for career consultation
                        and quotation purposes in accordance with confidential data protection standards.
                      </span>
                    </label>
                    {validationErrors.consent && (
                      <p className="text-[11px] text-rose-600 mt-1">{validationErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#17243B] text-white hover:bg-[#292D36] active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Registering Consultation...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit My Enquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

