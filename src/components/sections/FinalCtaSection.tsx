'use client';

import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Globe,
  Code2,
  Zap,
  Users,
} from 'lucide-react';

interface ProjectFormState {
  fullName: string;
  businessName: string;
  email: string;
  phoneWhatsapp: string;
  serviceTitle: string;
  requirements: string;
  consent: boolean;
  botHoneypot: string;
}

const SERVICE_CATEGORIES = [
  { id: 'Websites & Online Stores', label: 'Websites & Stores', icon: Globe },
  { id: 'Custom Business Software', label: 'Custom Software', icon: Code2 },
  { id: 'Business Automation', label: 'Automation', icon: Zap },
  { id: 'ERP & CRM Solutions', label: 'ERP & CRM', icon: Users },
  { id: 'General Project Idea', label: 'Other / Just an Idea', icon: Sparkles },
];

export function FinalCtaSection() {
  const [formData, setFormData] = useState<ProjectFormState>({
    fullName: '',
    businessName: '',
    email: '',
    phoneWhatsapp: '',
    serviceTitle: 'Websites & Online Stores',
    requirements: '',
    consent: true,
    botHoneypot: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    referenceCode: string;
    fullName: string;
    serviceTitle: string;
    timestamp: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setError('Please provide your name (minimum 2 characters).');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!formData.phoneWhatsapp.trim() || formData.phoneWhatsapp.trim().length < 6) {
      setError('Please provide a valid phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          businessName: formData.businessName.trim() || undefined,
          email: formData.email.trim().toLowerCase(),
          phoneWhatsapp: formData.phoneWhatsapp.trim(),
          division: 'NEXORA',
          serviceTitle: formData.serviceTitle,
          requirements: formData.requirements.trim() || `Discussion requested for: ${formData.serviceTitle}${formData.businessName ? ` (${formData.businessName})` : ''}`,
          budgetRange: 'Flexible / Discussion',
          desiredTimeline: 'Standard',
          consent: formData.consent,
          botHoneypot: formData.botHoneypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data?.errors ? Object.values(data.errors).join(', ') : (data?.error || 'Enquiry submission failed.'));
      }

      setSubmissionReceipt({
        referenceCode: data.referenceCode,
        fullName: formData.fullName.trim(),
        serviceTitle: formData.serviceTitle,
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      });

      // Scroll to receipt
      const el = document.getElementById('discuss-project');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      console.error('Project enquiry error:', err);
      setError(err?.message || 'Error submitting enquiry. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyRef = () => {
    if (submissionReceipt?.referenceCode) {
      navigator.clipboard.writeText(submissionReceipt.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="discuss-project" className="py-20 sm:py-28 bg-[#07080C] text-white relative overflow-hidden border-t border-white/10">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7357F5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#48C7E8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-wider uppercase text-[#9D85FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD66B]" />
            <span>Start Your Project</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Have an idea?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D85FF] via-[#E8E2FF] to-[#48C7E8]">
              Let&apos;s make it happen.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-sans max-w-xl mx-auto leading-relaxed">
            Tell us what you need. No technical knowledge required.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#121520]/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          
          {!submissionReceipt ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Banner */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-medium">
                  {error}
                </div>
              )}

              {/* Bot Honeypot */}
              <input
                type="text"
                value={formData.botHoneypot}
                onChange={(e) => setFormData({ ...formData, botHoneypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Step 1: Select What You Need */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2.5">
                  1. What does your business need?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SERVICE_CATEGORIES.map((cat) => {
                    const isSelected = formData.serviceTitle === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceTitle: cat.id })}
                        className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 text-xs font-bold ${
                          isSelected
                            ? 'border-[#9D85FF] bg-[#9D85FF]/20 text-white shadow-sm ring-1 ring-[#9D85FF]/40'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#9D85FF]' : 'text-slate-400'}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Contact Information */}
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  2. Who should we contact?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9D85FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Business or Project Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Acme Retail"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9D85FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9D85FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneWhatsapp}
                      onChange={(e) => setFormData({ ...formData, phoneWhatsapp: e.target.value })}
                      placeholder="e.g. +1 555-0199 or +91..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9D85FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Brief Details */}
              <div className="pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  3. Tell us briefly about what you want to achieve (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="Share any specific goals, target timeline, or features you have in mind..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#9D85FF]"
                />
              </div>

              {/* Privacy and Submit */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#65DDB5] shrink-0" />
                  <span>Your details are kept strictly confidential. No spam, ever.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-lg shadow-[#7357F5]/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Brief...</span>
                    </>
                  ) : (
                    <>
                      <span>Discuss Your Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Submission Success Receipt */
            <div className="text-center py-6 sm:py-8 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 text-[#65DDB5] flex items-center justify-center shadow-lg border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-[#65DDB5] border border-emerald-500/30">
                  Project Enquiry Registered
                </span>
                <h3 className="text-2xl font-black text-white">
                  Thank You, {submissionReceipt.fullName.split(' ')[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  We have logged your project inquiry in our studio pipeline. A senior technical solution architect will contact you within 2 hours with an initial plan.
                </p>
              </div>

              {/* Reference ID Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Project Reference ID
                    </div>
                    <div className="text-base font-mono font-bold text-[#9D85FF] tracking-wider">
                      {submissionReceipt.referenceCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyRef}
                    className="p-2 rounded-xl bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white shadow-sm flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-white/10 text-xs space-y-1 text-slate-400 font-sans">
                  <div className="flex items-center justify-between">
                    <span>Solution Scope:</span>
                    <span className="font-semibold text-white">{submissionReceipt.serviceTitle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Received:</span>
                    <span className="font-semibold text-white">{submissionReceipt.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionReceipt(null);
                    setFormData({
                      fullName: '',
                      businessName: '',
                      email: '',
                      phoneWhatsapp: '',
                      serviceTitle: 'Websites & Online Stores',
                      requirements: '',
                      consent: true,
                      botHoneypot: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  Submit Another Project Idea
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}

export default FinalCtaSection;
