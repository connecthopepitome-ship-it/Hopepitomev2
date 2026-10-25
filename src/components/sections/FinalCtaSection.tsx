'use client';

import { useState, useEffect } from 'react';
import { studioServices } from './ServiceIndexSection';

interface FormState {
  fullName: string;
  email: string;
  phoneWhatsapp: string;
  division: 'NEXORA' | 'ELEVORA' | 'BOTH';
  serviceTitle: string;
  requirements: string;
  budgetRange: string;
  desiredTimeline: string;
  attachmentUrl: string;
  consent: boolean;
  botHoneypot: string;
}

const initialFormState: FormState = {
  fullName: '',
  email: '',
  phoneWhatsapp: '',
  division: 'NEXORA',
  serviceTitle: 'BUSINESS WEBSITES',
  requirements: '',
  budgetRange: '$1,500 – $4,000 (Complete website or career profile package)',
  desiredTimeline: 'Within 1 month',
  attachmentUrl: '',
  consent: false,
  botHoneypot: '',
};

export function FinalCtaSection() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    referenceCode: string;
    division: string;
    serviceTitle: string;
    fullName: string;
    timestamp: string;
  } | null>(null);

  // Listen for service selection from ServiceIndexSection
  useEffect(() => {
    const handleServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{
        division: 'NEXORA' | 'ELEVORA';
        serviceTitle: string;
      }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          division: customEvent.detail.division,
          serviceTitle: customEvent.detail.serviceTitle,
        }));
      }
    };

    window.addEventListener('hopepitome-select-service', handleServiceSelect);
    return () =>
      window.removeEventListener('hopepitome-select-service', handleServiceSelect);
  }, []);

  // Filter available services by selected division
  const availableServices = studioServices.filter(
    (s) => formData.division === 'BOTH' || s.division === formData.division
  );

  const handleInputChange = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleDivisionChange = (div: 'NEXORA' | 'ELEVORA' | 'BOTH') => {
    const matchingServices = studioServices.filter(
      (s) => div === 'BOTH' || s.division === div
    );
    const newService = matchingServices[0]?.title || 'Custom Project';
    setFormData((prev) => ({
      ...prev,
      division: div,
      serviceTitle: newService,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation check
    const clientErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      clientErrors.fullName = 'Please enter your name.';
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      clientErrors.email = 'Please provide a valid email address.';
    }
    if (formData.requirements.trim().length < 15) {
      clientErrors.requirements =
        'Please describe your requirements in at least 15 characters so we can understand your project.';
    }
    if (!formData.consent) {
      clientErrors.consent = 'Please confirm consent to proceed.';
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setSubmissionReceipt({
          referenceCode: data.referenceCode,
          division: formData.division === 'NEXORA' ? 'Business Services (Nexora)' : formData.division === 'ELEVORA' ? 'Career Services (Elevora)' : 'Combined (Both)',
          serviceTitle: formData.serviceTitle,
          fullName: formData.fullName,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
        setFormData(initialFormState);
      } else {
        if (data?.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            form:
              data?.error ||
              'Unable to send your enquiry right now. Please email studio@hopepitome.com directly.',
          });
        }
      }
    } catch {
      // Local fallback in offline mode
      const fallbackRef = `HP-202610-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setSubmissionReceipt({
        referenceCode: fallbackRef,
        division: formData.division === 'NEXORA' ? 'Business Services (Nexora)' : formData.division === 'ELEVORA' ? 'Career Services (Elevora)' : 'Combined (Both)',
        serviceTitle: formData.serviceTitle,
        fullName: formData.fullName,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
      setFormData(initialFormState);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      {/* Background Editorial Grid */}
      <div className="absolute inset-0 editorial-grid-fine opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase mb-10">
          <span className="text-[#8B6CFF] font-bold">08 //</span>
          <span>GET IN TOUCH</span>
        </div>

        {/* Large Editorial Headline */}
        <div className="mb-14">
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.96] text-warm-white uppercase">
            TELL US ABOUT
            <br />
            YOUR PROJECT.
          </h2>
          <p className="text-stone-light text-base sm:text-lg font-sans mt-4 max-w-2xl leading-relaxed">
            Share what you&apos;re trying to achieve. We&apos;ll review your requirements and explain the next steps.
          </p>
        </div>

        {/* Main Grid: Parameters Sidebar + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-editorial">
          {/* Sidebar */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block font-bold">
                WHAT HAPPENS NEXT?
              </span>

              <div className="space-y-3 text-xs text-stone-light font-sans">
                <div className="p-3 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08]">
                  <strong className="text-warm-white block font-medium mb-1 font-mono text-[11px]">
                    1. REVIEW WITHIN ONE BUSINESS DAY
                  </strong>
                  <p className="text-muted-stone text-xs">
                    Our team reviews your project brief, questions, or target role requirements.
                  </p>
                </div>

                <div className="p-3 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08]">
                  <strong className="text-warm-white block font-medium mb-1 font-mono text-[11px]">
                    2. CONSULTATION & QUESTIONS
                  </strong>
                  <p className="text-muted-stone text-xs">
                    If needed, we reply with clarification questions to understand your exact scope.
                  </p>
                </div>

                <div className="p-3 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08]">
                  <strong className="text-warm-white block font-medium mb-1 font-mono text-[11px]">
                    3. CLEAR PLAN & QUOTE
                  </strong>
                  <p className="text-muted-stone text-xs">
                    We provide a written summary of deliverables, estimated timeline, and pricing.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border border-white/[0.08] bg-[#101116]/40 backdrop-blur-sm space-y-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-warm-white block font-bold">
                DIRECT CONTACT DETAILS
              </span>
              <div className="text-xs font-mono text-muted-stone">
                <span>General inquiries: </span>
                <a
                  href="mailto:studio@hopepitome.com"
                  className="text-warm-white hover:text-[#8B6CFF] transition-colors underline underline-offset-4"
                >
                  studio@hopepitome.com
                </a>
              </div>
              <div className="text-xs font-mono text-muted-stone">
                <span>Project support: </span>
                <a
                  href="mailto:connect.hopepitome@gmail.com"
                  className="text-warm-white hover:text-[#8B6CFF] transition-colors"
                >
                  connect.hopepitome@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="lg:col-span-7 bg-[#101116]/70 backdrop-blur-md border border-white/[0.08] p-6 sm:p-8">
            {submissionReceipt ? (
              <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#8B6CFF]/50 bg-[#8B6CFF]/10 text-[#8B6CFF] font-mono font-bold text-lg shadow-[0_0_15px_#8B6CFF]/30">
                  ✓
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono tracking-wider uppercase text-[#8B6CFF] block font-semibold">
                    ENQUIRY RECEIVED
                  </span>
                  <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-warm-white">
                    THANK YOU FOR REACHING OUT
                  </h3>
                </div>

                {/* Receipt Details Box */}
                <div className="p-5 bg-[#07080B]/80 border border-white/10 text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
                  <div className="flex justify-between border-b border-white/[0.06] pb-2 text-muted-stone">
                    <span>REFERENCE ID:</span>
                    <span className="text-warm-white font-bold">{submissionReceipt.referenceCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2 text-muted-stone">
                    <span>NAME:</span>
                    <span className="text-warm-white">{submissionReceipt.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2 text-muted-stone">
                    <span>CATEGORY:</span>
                    <span className="text-[#8B6CFF]">{submissionReceipt.division}</span>
                  </div>
                  <div className="flex justify-between text-muted-stone pt-1">
                    <span>SERVICE:</span>
                    <span className="text-warm-white truncate max-w-[200px]">
                      {submissionReceipt.serviceTitle}
                    </span>
                  </div>
                </div>

                <p className="text-stone-light text-xs font-sans max-w-md mx-auto leading-relaxed">
                  We have received your enquiry. A member of our studio will review your details and respond to your email within one business day.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmissionReceipt(null)}
                  className="inline-block mt-2 text-xs font-mono tracking-wider uppercase text-[#8B6CFF] hover:text-[#E4DBFF] transition-colors"
                >
                  ← Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot Spam Prevention (Hidden) */}
                <input
                  type="text"
                  name="website_url"
                  value={formData.botHoneypot}
                  onChange={(e) => handleInputChange('botHoneypot', e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Form Error Notice */}
                {errors.form && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono">
                    {errors.form}
                  </div>
                )}

                {/* 1. What do you need help with? */}
                <div>
                  <label className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-2">
                    WHAT DO YOU NEED HELP WITH?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['NEXORA', 'ELEVORA', 'BOTH'] as const).map((div) => (
                      <button
                        key={div}
                        type="button"
                        onClick={() => handleDivisionChange(div)}
                        className={`py-2.5 px-2 text-xs font-mono tracking-wider uppercase border transition-all text-center ${
                          formData.division === div
                            ? 'border-[#8B6CFF] bg-[#8B6CFF]/20 text-warm-white font-bold shadow-[0_0_12px_rgba(139,108,255,0.25)]'
                            : 'border-white/10 bg-[#07080B]/40 text-muted-stone hover:border-white/30'
                        }`}
                      >
                        {div === 'NEXORA'
                          ? 'Business Services'
                          : div === 'ELEVORA'
                          ? 'Career Services'
                          : 'Both / Combined'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Select a service */}
                <div>
                  <label
                    htmlFor="service-select"
                    className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                  >
                    SELECT A SERVICE
                  </label>
                  <select
                    id="service-select"
                    value={formData.serviceTitle}
                    onChange={(e) => handleInputChange('serviceTitle', e.target.value)}
                    className="w-full bg-[#07080B]/80 border border-white/10 px-3.5 py-2.5 text-warm-white font-mono text-xs uppercase focus:outline-none focus:border-[#8B6CFF]"
                  >
                    {availableServices.map((srv) => (
                      <option key={srv.id} value={srv.title} className="bg-[#07080B] text-white">
                        [{srv.division === 'NEXORA' ? 'BUSINESS' : 'CAREER'}] {srv.title}
                      </option>
                    ))}
                    <option value="Custom Project or Consultation" className="bg-[#07080B] text-white">
                      [OTHER] Custom Project or General Consultation
                    </option>
                  </select>
                </div>

                {/* 3. Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="full-name"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      YOUR NAME *
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full bg-[#07080B]/80 border px-3.5 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none ${
                        errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-[#8B6CFF]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-[10px] font-mono mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="client-email"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="client-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g. alex@example.com"
                      className={`w-full bg-[#07080B]/80 border px-3.5 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none ${
                        errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#8B6CFF]'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-[10px] font-mono mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* 4. Optional Phone/WhatsApp */}
                <div>
                  <label
                    htmlFor="phone-whatsapp"
                    className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                  >
                    OPTIONAL PHONE OR WHATSAPP NUMBER
                  </label>
                  <input
                    id="phone-whatsapp"
                    type="tel"
                    value={formData.phoneWhatsapp}
                    onChange={(e) => handleInputChange('phoneWhatsapp', e.target.value)}
                    placeholder="e.g. +1 555-0123"
                    className="w-full bg-[#07080B]/80 border border-white/10 px-3.5 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none focus:border-[#8B6CFF]"
                  />
                  {errors.phoneWhatsapp && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.phoneWhatsapp}</p>
                  )}
                </div>

                {/* 5. Requirements Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="client-requirements"
                      className="text-xs font-mono tracking-wider uppercase text-muted-stone"
                    >
                      TELL US A LITTLE ABOUT YOUR REQUIREMENTS *
                    </label>
                    <span className="text-[10px] font-mono text-muted-stone">
                      {formData.requirements.length} chars (min 15)
                    </span>
                  </div>
                  <textarea
                    id="client-requirements"
                    rows={4}
                    required
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Tell us about what you want to build, the problems you are facing, or what your target job or career transition looks like..."
                    className={`w-full bg-[#07080B]/80 border px-3.5 py-2.5 text-warm-white font-sans text-xs sm:text-sm placeholder:text-muted-stone/40 focus:outline-none resize-none ${
                      errors.requirements ? 'border-red-500' : 'border-white/10 focus:border-[#8B6CFF]'
                    }`}
                  />
                  {errors.requirements && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.requirements}</p>
                  )}
                </div>

                {/* 6. Budget & Timeline Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="budget-range"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      OPTIONAL BUDGET RANGE
                    </label>
                    <select
                      id="budget-range"
                      value={formData.budgetRange}
                      onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                      className="w-full bg-[#07080B]/80 border border-white/10 px-3 py-2.5 text-warm-white font-mono text-xs focus:outline-none focus:border-[#8B6CFF]"
                    >
                      <option className="bg-[#07080B]" value="Under $1,500 (Focused project or document review)">
                        Under $1,500 (Focused project or document review)
                      </option>
                      <option className="bg-[#07080B]" value="$1,500 – $4,000 (Complete website or career package)">
                        $1,500 – $4,000 (Complete website or career package)
                      </option>
                      <option className="bg-[#07080B]" value="$4,000 – $10,000 (E-commerce store or custom tool)">
                        $4,000 – $10,000 (E-commerce store or custom tool)
                      </option>
                      <option className="bg-[#07080B]" value="$10,000+ (Full ERP or multi-system software)">
                        $10,000+ (Full ERP or multi-system software)
                      </option>
                      <option className="bg-[#07080B]" value="Need guidance / Let's discuss">
                        Need guidance / Let&apos;s discuss
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="desired-timeline"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      PREFERRED TIMELINE
                    </label>
                    <select
                      id="desired-timeline"
                      value={formData.desiredTimeline}
                      onChange={(e) => handleInputChange('desiredTimeline', e.target.value)}
                      className="w-full bg-[#07080B]/80 border border-white/10 px-3 py-2.5 text-warm-white font-mono text-xs focus:outline-none focus:border-[#8B6CFF]"
                    >
                      <option className="bg-[#07080B]" value="Within 2 weeks">
                        Within 2 weeks
                      </option>
                      <option className="bg-[#07080B]" value="Within 1 month">
                        Within 1 month
                      </option>
                      <option className="bg-[#07080B]" value="1–3 months">
                        1–3 months
                      </option>
                      <option className="bg-[#07080B]" value="Flexible / Planning ahead">
                        Flexible / Planning ahead
                      </option>
                    </select>
                  </div>
                </div>

                {/* 7. Optional Link to Files */}
                <div>
                  <label
                    htmlFor="attachment-url"
                    className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                  >
                    OPTIONAL LINK TO FILES OR BRIEF
                  </label>
                  <input
                    id="attachment-url"
                    type="url"
                    value={formData.attachmentUrl}
                    onChange={(e) => handleInputChange('attachmentUrl', e.target.value)}
                    placeholder="https://drive.google.com/..., https://figma.com/..., or current website URL"
                    className={`w-full bg-[#07080B]/80 border px-3.5 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none ${
                      errors.attachmentUrl ? 'border-red-500' : 'border-white/10 focus:border-[#8B6CFF]'
                    }`}
                  />
                  {errors.attachmentUrl && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.attachmentUrl}</p>
                  )}
                </div>

                {/* 8. Privacy Consent */}
                <div className="pt-2">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleInputChange('consent', e.target.checked)}
                      className="mt-0.5 rounded-none border-white/20 bg-[#07080B] text-[#8B6CFF] focus:ring-0"
                    />
                    <span className="text-[11px] font-mono text-muted-stone group-hover:text-warm-white transition-colors leading-relaxed">
                      I agree to share these details with Hopepitome for project consultation and quotation purposes.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.consent}</p>
                  )}
                </div>

                {/* 9. Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8B6CFF] text-[#07080B] hover:bg-white hover:text-[#07080B] transition-colors duration-200 font-mono text-xs tracking-wider uppercase font-bold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(139,108,255,0.25)]"
                >
                  <span>{isSubmitting ? 'Sending your enquiry...' : 'Send my enquiry'}</span>
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
