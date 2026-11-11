'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FilePenLine,
  ScanSearch,
  Linkedin,
  BriefcaseBusiness,
  MonitorSmartphone,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CircleCheck,
  X,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { CareerStudioHeader } from '@/components/career/CareerStudioHeader';
import { CareerBottomNav } from '@/components/career/CareerBottomNav';
import { CareerFooter } from '@/components/career/CareerFooter';
import { SECONDARY_SERVICES, SecondaryServiceItem } from '@/components/career/CompactServiceRows';

export default function CareerServicesCataloguePage() {
  const [selectedService, setSelectedService] = useState<SecondaryServiceItem | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Multi-service selection mode
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  // Enquiry form state
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const svc = new URLSearchParams(window.location.search).get('service');
    if (!svc) return;
    const upper = svc.trim().toUpperCase();
    const matched = SECONDARY_SERVICES.find(
      (s) => s.code.toUpperCase() === upper || s.id.toUpperCase() === upper || s.name.toUpperCase() === upper
    );
    if (matched) {
      setSelectedService(matched);
      setMultiSelected([matched.name]);
      setQuoteModalOpen(true);
    }
  }, []);

  const toggleMultiSelect = (serviceName: string) => {
    setMultiSelected((prev) =>
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName]
    );
  };

  const handleOpenSingleQuote = (service: SecondaryServiceItem) => {
    setSelectedService(service);
    setMultiSelected([service.name]);
    setSubmitError(null);
    setSubmittedRef(null);
    setQuoteModalOpen(true);
  };

  const handleOpenMultiQuote = () => {
    if (multiSelected.length === 0) return;
    const firstMatch = SECONDARY_SERVICES.find((s) => s.name === multiSelected[0]) || SECONDARY_SERVICES[0];
    setSelectedService(firstMatch);
    setSubmitError(null);
    setSubmittedRef(null);
    setQuoteModalOpen(true);
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Please enter your phone or WhatsApp number.');
      return;
    }
    if (!consent) {
      setSubmitError('Please agree to allow us to process your consultation enquiry.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const servicesList = multiSelected.length > 0 ? multiSelected : [selectedService?.name || 'Career Services'];

      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phoneWhatsapp: phone.trim(),
        selectedServices: servicesList,
        serviceRequired: servicesList[0],
        targetRole: currentRole.trim() || undefined,
        currentDesignation: currentRole.trim() || undefined,
        requirements: `[Custom Service Enquiry: ${servicesList.join(' + ')}] ${notes.trim() || 'Requesting tailored scope and quotation proposal.'}`,
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
        throw new Error(data?.error || 'Failed to submit quote request. Please retry.');
      }

      setSubmittedRef(data.referenceCode || `HP-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit quotation request. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF8FF] text-[#24233A] min-h-screen flex flex-col font-sans antialiased selection:bg-[#7454F5]/20 selection:text-[#7454F5]">
      {/* 1. Header */}
      <CareerStudioHeader />

      <main className="flex-1 pt-20 pb-24 sm:pt-24 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
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

          {/* Page Title & Intro */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#7454F5]/20 shadow-xs text-[11px] font-bold text-[#7454F5] uppercase mb-2">
              <BriefcaseBusiness className="w-3.5 h-3.5" strokeWidth={1.9} />
              <span>Services Catalogue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#17152F] tracking-tight">
              Executive Career Solutions
            </h1>
            <p className="text-xs sm:text-sm text-[#71778A] mt-1.5 max-w-xl leading-relaxed">
              Explore our complete suite of career enhancement services. Select individual services or combine multiple solutions for a unified scope proposal.
            </p>
          </div>

          {/* Top 2 Primary Action Cards (Quick Access) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <Link
              href="/career-services/resume-writing"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#7454F5]/40 shadow-xs flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center">
                  <FilePenLine className="w-5 h-5" strokeWidth={1.9} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#7454F5] tracking-wider block">
                    Flagship Service
                  </span>
                  <span className="text-sm font-bold text-[#17152F] group-hover:text-[#7454F5] transition">
                    Professional Resume Writing
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#7454F5]" strokeWidth={1.9} />
            </Link>

            <Link
              href="/career-services#resume-checker"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#149B75]/40 shadow-xs flex items-center justify-between group transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#149B75]/10 text-[#149B75] flex items-center justify-center">
                  <ScanSearch className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#149B75] tracking-wider block">
                    Free Instant Tool
                  </span>
                  <span className="text-sm font-bold text-[#17152F] group-hover:text-[#149B75] transition">
                    AI Resume & ATS Checker
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#149B75]" />
            </Link>
          </div>

          {/* Secondary Services Catalogue List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#71778A] uppercase tracking-wider">
                Specialized Services
              </span>
              {multiSelected.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenMultiQuote}
                  className="text-xs font-bold text-white bg-[#7454F5] px-3 py-1 rounded-lg shadow-xs flex items-center gap-1 active:scale-95"
                >
                  <span>Request Quote for {multiSelected.length} Selected</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {SECONDARY_SERVICES.map((service) => {
              const Icon = service.icon;
              const isChecked = multiSelected.includes(service.name);

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left info */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    {/* Multi select checkbox */}
                    <button
                      type="button"
                      onClick={() => toggleMultiSelect(service.name)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-2.5 sm:mt-0 transition ${
                        isChecked
                          ? 'bg-[#7454F5] border-[#7454F5] text-white'
                          : 'border-slate-300 hover:border-[#7454F5]'
                      }`}
                      aria-label={`Select ${service.name}`}
                    >
                      {isChecked && <CircleCheck className="w-3.5 h-3.5" />}
                    </button>

                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 border border-slate-200"
                      style={{ color: service.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-[#17152F]">
                          {service.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#71778A]">
                          {service.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#71778A] mt-0.5 leading-relaxed">
                        {service.fullDesc}
                      </p>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="shrink-0 flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenSingleQuote(service)}
                      className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#7454F5] bg-[#7454F5]/10 hover:bg-[#7454F5] hover:text-white transition flex items-center gap-1 active:scale-95"
                    >
                      <span>Request Quote</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Banner */}
          <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#71778A]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#149B75] shrink-0" />
              <span>
                <strong>Transparent Scope Policy:</strong> All services are quoted based on verified candidate requirements. No hidden fees or automated recurring charges.
              </span>
            </div>
            <Link
              href="/career-services/access-report"
              className="text-xs font-bold text-[#7454F5] shrink-0 hover:underline"
            >
              Access Report with Reference →
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <CareerFooter />

      {/* Mobile Bottom Navigation */}
      <CareerBottomNav />

      {/* =========================================================================
          QUOTE ENQUIRY MODAL
         ========================================================================= */}
      {quoteModalOpen && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            {submittedRef ? (
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
                    <strong className="text-[#17152F]">
                      {multiSelected.length > 0 ? multiSelected.join(', ') : selectedService.name}
                    </strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71778A]">Enquiry Reference:</span>
                    <span className="font-mono font-bold text-[#7454F5]">{submittedRef}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#71778A]">Turnaround Window:</span>
                    <span className="font-semibold text-[#149B75]">Within 24 Business Hours</span>
                  </div>
                </div>

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
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#7454F5] bg-[#7454F5]/10 px-2.5 py-0.5 rounded-md mb-1">
                    Custom Quote Request
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#17152F]">
                    {multiSelected.length > 1
                      ? `${multiSelected.length} Services Selected`
                      : selectedService.name}
                  </h3>
                  <p className="text-xs text-[#71778A] mt-0.5">
                    {multiSelected.length > 1
                      ? multiSelected.join(' • ')
                      : selectedService.shortDesc}
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
                      placeholder="e.g. IT Sourcing & Procurement"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#7454F5] bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Requirements or Goals (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share any specific requirements or delivery timeline..."
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
                      className="mt-0.5 rounded text-[#7454F5]"
                    />
                    <span>
                      I consent to Hopepitome contacting me with a tailored scope proposal. Data is never shared or sold.
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
                        <span>Submit Quote Request</span>
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
    </div>
  );
}

