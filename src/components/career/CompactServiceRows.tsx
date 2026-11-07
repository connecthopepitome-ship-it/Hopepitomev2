'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ScanText,
  Linkedin,
  BriefcaseBusiness,
  MonitorSmartphone,
  ChevronRight,
  ArrowRight,
  CircleCheck,
  X,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export interface SecondaryServiceItem {
  id: string;
  name: string;
  code: string;
  shortDesc: string;
  fullDesc: string;
  icon: any;
  color: string;
  badge: string;
}

export const SECONDARY_SERVICES: SecondaryServiceItem[] = [
  {
    id: 'ats-optimisation',
    name: 'ATS Resume Optimisation',
    code: 'ATS_OPTIMISATION',
    shortDesc: 'Structure, format and align keywords to pass enterprise ATS filters cleanly.',
    fullDesc: 'Comprehensive restructuring with clean typography, standard headers, and role-matched keyword density for high ATS parse rates.',
    icon: ScanText,
    color: '#7454F5',
    badge: 'High Demand',
  },
  {
    id: 'linkedin-makeover',
    name: 'LinkedIn Profile Makeover',
    code: 'LINKEDIN_MAKEOVER',
    shortDesc: 'Elevate your headline, about summary, and recruiter search visibility.',
    fullDesc: 'Executive branding rewrite including narrative headline, quantified career highlights, and strategic industry skill tags to attract recruiter inbounds.',
    icon: Linkedin,
    color: '#0A66C2',
    badge: 'Visibility',
  },
  {
    id: 'job-search',
    name: 'Managed Job Search & Applications',
    code: 'JOB_SEARCH_SUPPORT',
    shortDesc: 'Targeted company discovery, tailored applications, and submission tracking.',
    fullDesc: 'Our specialists identify curated job openings aligned to your background, prepare targeted cover letters, and log real-time progress.',
    icon: BriefcaseBusiness,
    color: '#149B75',
    badge: 'Managed Service',
  },
  {
    id: 'portfolio-website',
    name: 'Personal Portfolio Website',
    code: 'PORTFOLIO_WEBSITE',
    shortDesc: 'Showcase your case studies, projects, and track record on a custom digital hub.',
    fullDesc: 'Modern, mobile-responsive web portfolio highlighting your achievements, code repositories, or design work with lead capture capabilities.',
    icon: MonitorSmartphone,
    color: '#9B6BFF',
    badge: 'Portfolio',
  },
];

interface CompactServiceRowsProps {
  title?: string;
  subtitle?: string;
  showExploreAllLink?: boolean;
}

export function CompactServiceRows({
  title = 'Other Career Services',
  subtitle = 'Tailored executive career solutions with custom scope-based quotations.',
  showExploreAllLink = true,
}: CompactServiceRowsProps) {
  const [selectedService, setSelectedService] = useState<SecondaryServiceItem | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleOpenQuote = (service: SecondaryServiceItem) => {
    setSelectedService(service);
    setSubmitError(null);
    setSubmittedRef(null);
    setQuoteModalOpen(true);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Please enter your WhatsApp or mobile number.');
      return;
    }
    if (!consent) {
      setSubmitError('Please agree to allow Hopepitome to process your consultation enquiry.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneWhatsapp: phone.trim(),
        selectedServices: [selectedService.name],
        serviceRequired: selectedService.name,
        targetRole: currentRole.trim() || undefined,
        currentDesignation: currentRole.trim() || undefined,
        requirements: `[Custom Quotation Request: ${selectedService.name}] ${notes.trim() || 'Please provide quotation and scoping details.'}`,
        preferredContactMethod: preferredContact,
        consent: true,
      };

      const res = await fetch('/api/career-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to submit quote enquiry. Please try again.');
      }

      setSubmittedRef(data.referenceCode || `HP-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit quotation request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white" id="services">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#7454F5] block">
              Specialized Solutions
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#17152F] tracking-tight mt-0.5">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#71778A] mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          {showExploreAllLink && (
            <Link
              href="/career-services/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#7454F5] hover:text-[#6342E8] shrink-0"
            >
              <span>View all services catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Compact Horizontal Service Rows */}
        <div className="space-y-3">
          {SECONDARY_SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group relative bg-[#F8F7FC] hover:bg-white rounded-2xl border border-slate-200/90 hover:border-[#7454F5]/40 p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Icon & Service Meta */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-white border border-slate-200 shadow-xs group-hover:border-[#7454F5]/30 transition"
                    style={{ color: service.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-[#17152F] group-hover:text-[#7454F5] transition-colors truncate">
                        {service.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#71778A]">
                        {service.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#71778A] mt-0.5 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <span className="text-[11px] font-semibold text-[#71778A] sm:hidden">
                    Custom Quotation
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenQuote(service)}
                    className="min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold text-[#7454F5] bg-white hover:bg-[#7454F5] hover:text-white border border-[#7454F5]/30 transition shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>Request Quote</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          CUSTOM QUOTATION MODAL
         ========================================================================= */}
      {quoteModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            {submittedRef ? (
              /* Success confirmation */
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#149B75]/10 text-[#149B75] flex items-center justify-center mx-auto">
                  <CircleCheck className="w-7 h-7" strokeWidth={1.9} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#17152F]">
                    Quotation Request Submitted
                  </h3>
                  <p className="text-xs text-[#71778A] mt-1 leading-relaxed">
                    We have received your custom quotation enquiry for{' '}
                    <strong className="text-[#17152F]">{selectedService.name}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71778A]">Enquiry Reference:</span>
                    <span className="font-mono font-bold text-[#7454F5]">{submittedRef}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71778A]">Service Requested:</span>
                    <span className="font-semibold text-[#17152F]">{selectedService.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71778A]">Response Window:</span>
                    <span className="font-semibold text-[#149B75]">Within 24 Business Hours</span>
                  </div>
                </div>

                <p className="text-xs text-[#71778A] leading-relaxed">
                  Our career consultant will evaluate your profile and contact you via your preferred channel with a tailored scope proposal. No fixed packages or automated obligations.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="w-full min-h-[46px] rounded-xl text-sm font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] transition shadow-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#7454F5]/10 text-[#7454F5] uppercase mb-1">
                    Custom Quote Request
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#17152F]">
                    {selectedService.name}
                  </h3>
                  <p className="text-xs text-[#71778A] mt-0.5">
                    {selectedService.fullDesc}
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tharun Jose"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-slate-50/50"
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
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#201D36] mb-1">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Current Role / Profession (Optional)
                    </label>
                    <input
                      type="text"
                      value={currentRole}
                      onChange={(e) => setCurrentRole(e.target.value)}
                      placeholder="e.g. IT Procurement Specialist"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Additional Requirements / Goals (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share your target roles, industry, or specific expectations..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#7454F5] bg-slate-50/50 resize-none"
                    />
                  </div>

                  {/* Preferred contact channel */}
                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                      Preferred Contact Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                        { id: 'email', label: 'Email', icon: Mail },
                        { id: 'phone', label: 'Call', icon: Phone },
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
                  <label className="flex items-start gap-2 pt-1 text-xs text-[#71778A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded text-[#7454F5] focus:ring-[#7454F5]"
                    />
                    <span>
                      I consent to Hopepitome contacting me with a customized scope proposal. Data is kept strictly confidential.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="w-1/3 min-h-[46px] rounded-xl text-xs font-bold text-[#71778A] bg-slate-100 hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 min-h-[46px] rounded-xl text-sm font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] disabled:bg-slate-300 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Request Custom Quote</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

