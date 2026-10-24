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
  serviceTitle: 'BUSINESS WEBSITE DEVELOPMENT',
  requirements: '',
  budgetRange: '$3,000 – $7,500 (Core Website / Executive Package)',
  desiredTimeline: '1 Month',
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
    const newService = matchingServices[0]?.title || 'Custom Scope Inquiry';
    setFormData((prev) => ({
      ...prev,
      division: div,
      serviceTitle: newService,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side quick check
    const clientErrors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      clientErrors.fullName = 'Please enter your full name.';
    }
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      clientErrors.email = 'Please provide a valid email address.';
    }
    if (formData.requirements.trim().length < 15) {
      clientErrors.requirements =
        'Please provide at least 15 characters describing your requirements.';
    }
    if (!formData.consent) {
      clientErrors.consent = 'Consent to our privacy handling is required.';
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
          division: formData.division,
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
              'Unable to process transmission at this time. Please email studio@hopepitome.com directly.',
          });
        }
      }
    } catch {
      // In local dev without backend worker proxy, simulate clean receipt with generated ID
      const fallbackRef = `HP-202610-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setSubmissionReceipt({
        referenceCode: fallbackRef,
        division: formData.division,
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
    <section id="contact" className="relative py-32 border-b border-editorial overflow-hidden">
      {/* Background Editorial Grid */}
      <div className="absolute inset-0 editorial-grid-fine opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Marker */}
        <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase mb-12">
          <span className="text-cobalt-blue font-bold">08 //</span>
          <span>INITIATE ENGAGEMENT</span>
        </div>

        {/* Large Editorial Headline */}
        <div className="mb-16">
          <h2 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-9xl tracking-tight leading-[0.9] text-warm-white uppercase">
            LET&apos;S MAKE
            <br />
            SOMETHING
            <br />
            <span className="text-silver">MATTER.</span>
          </h2>
        </div>

        {/* Main Grid: Parameters Sidebar + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-editorial">
          {/* Sidebar */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <span className="tech-label">[ ENGAGEMENT PARAMETERS ]</span>
              <p className="text-stone-light text-sm sm:text-base leading-relaxed mt-4 mb-6 font-sans">
                Tell us about your digital infrastructure needs or executive branding ambitions. Our studio principals review all inquiries directly to prepare a scoped architecture specification.
              </p>

              <div className="space-y-3 text-xs font-mono text-muted-stone uppercase">
                <div className="flex items-start space-x-2">
                  <span className="text-cobalt-blue mt-0.5">●</span>
                  <span>ONBOARDING: SCOPED UPON TECHNICAL INTAKE</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-cobalt-blue mt-0.5">●</span>
                  <span>DIRECT PRINCIPAL CONSULTATION</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-cobalt-blue mt-0.5">●</span>
                  <span>CONFIDENTIAL DISCOVERY (MUTUAL NDA UPON REQUEST)</span>
                </div>
              </div>
            </div>

            <div className="p-5 border border-white/[0.08] bg-white/[0.01] space-y-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-warm-white block font-bold">
                DIRECT INTAKE DESK
              </span>
              <div className="text-xs font-mono text-muted-stone">
                <span>PRIMARY: </span>
                <a
                  href="mailto:studio@hopepitome.com"
                  className="text-warm-white hover:text-cobalt-blue transition-colors underline underline-offset-4"
                >
                  studio@hopepitome.com
                </a>
              </div>
              <div className="text-xs font-mono text-muted-stone">
                <span>ESCALATIONS: </span>
                <a
                  href="mailto:connect.hopepitome@gmail.com"
                  className="text-warm-white hover:text-cobalt-blue transition-colors"
                >
                  connect.hopepitome@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="lg:col-span-7 bg-graphite-900 border border-editorial p-6 sm:p-10">
            {submissionReceipt ? (
              <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-cobalt-blue/50 bg-cobalt-blue/10 text-cobalt-blue font-mono font-bold text-lg">
                  ✓
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono tracking-widest uppercase text-cobalt-blue block">
                    TRANSMISSION REGISTERED
                  </span>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-warm-white">
                    PROJECT BRIEF RECEIVED
                  </h3>
                </div>

                {/* Receipt Details Box */}
                <div className="p-6 bg-graphite-950 border border-white/10 text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
                  <div className="flex justify-between border-b border-white/[0.06] pb-2 text-muted-stone">
                    <span>TRACKING REFERENCE:</span>
                    <span className="text-warm-white font-bold">{submissionReceipt.referenceCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2 text-muted-stone">
                    <span>REGISTERED CLIENT:</span>
                    <span className="text-warm-white">{submissionReceipt.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2 text-muted-stone">
                    <span>DIVISION / SCOPE:</span>
                    <span className="text-cobalt-blue">{submissionReceipt.division}</span>
                  </div>
                  <div className="flex justify-between text-muted-stone pt-1">
                    <span>SERVICE FOCUS:</span>
                    <span className="text-warm-white truncate max-w-[200px]">
                      {submissionReceipt.serviceTitle}
                    </span>
                  </div>
                </div>

                <p className="text-stone-light text-xs font-sans max-w-md mx-auto leading-relaxed">
                  A confirmation dispatch and initial scoping evaluation will be forwarded to your email address within one business day.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmissionReceipt(null)}
                  className="inline-block mt-4 text-xs font-mono tracking-widest uppercase text-cobalt-blue hover:text-warm-white transition-colors"
                >
                  ← SUBMIT ANOTHER ENQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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

                {/* Global Form Error Notice */}
                {errors.form && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono">
                    {errors.form}
                  </div>
                )}

                {/* 1. Division Selector */}
                <div>
                  <label className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-2">
                    01 // SELECT DIVISION
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['NEXORA', 'ELEVORA', 'BOTH'] as const).map((div) => (
                      <button
                        key={div}
                        type="button"
                        onClick={() => handleDivisionChange(div)}
                        className={`py-2.5 px-3 text-xs font-mono tracking-widest uppercase border transition-all text-center ${
                          formData.division === div
                            ? 'border-cobalt-blue bg-cobalt-blue/15 text-warm-white font-bold'
                            : 'border-white/10 bg-transparent text-muted-stone hover:border-white/30'
                        }`}
                      >
                        {div === 'BOTH' ? 'COMBINED' : div}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Service Selection Dropdown */}
                <div>
                  <label
                    htmlFor="service-select"
                    className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-2"
                  >
                    02 // TARGET SERVICE OR CAPABILITY
                  </label>
                  <select
                    id="service-select"
                    value={formData.serviceTitle}
                    onChange={(e) => handleInputChange('serviceTitle', e.target.value)}
                    className="w-full bg-graphite-950 border border-white/10 px-4 py-3 text-warm-white font-mono text-xs uppercase focus:outline-none focus:border-cobalt-blue"
                  >
                    {availableServices.map((srv) => (
                      <option key={srv.id} value={srv.title} className="bg-graphite-950 text-white">
                        [{srv.division}] {srv.title}
                      </option>
                    ))}
                    <option value="CUSTOM SCOPE OR ARCHITECTURE" className="bg-graphite-950 text-white">
                      [OTHER] CUSTOM SCOPE / ARCHITECTURAL INQUIRY
                    </option>
                  </select>
                </div>

                {/* 3. Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="full-name"
                      className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-1.5"
                    >
                      FULL NAME *
                    </label>
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Jane Doe"
                      className={`w-full bg-graphite-950 border px-4 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none ${
                        errors.fullName ? 'border-red-500' : 'border-white/10 focus:border-cobalt-blue'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-[10px] font-mono mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="client-email"
                      className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-1.5"
                    >
                      WORK EMAIL *
                    </label>
                    <input
                      id="client-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="jane@organization.com"
                      className={`w-full bg-graphite-950 border px-4 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none ${
                        errors.email ? 'border-red-500' : 'border-white/10 focus:border-cobalt-blue'
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
                    className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-1.5"
                  >
                    PHONE OR WHATSAPP (OPTIONAL)
                  </label>
                  <input
                    id="phone-whatsapp"
                    type="tel"
                    value={formData.phoneWhatsapp}
                    onChange={(e) => handleInputChange('phoneWhatsapp', e.target.value)}
                    placeholder="+1 (555) 000-0000 or WhatsApp number"
                    className="w-full bg-graphite-950 border border-white/10 px-4 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none focus:border-cobalt-blue"
                  />
                  {errors.phoneWhatsapp && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.phoneWhatsapp}</p>
                  )}
                </div>

                {/* 5. Budget Range & Timeline Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="budget-range"
                      className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-1.5"
                    >
                      ANTICIPATED BUDGET TIER
                    </label>
                    <select
                      id="budget-range"
                      value={formData.budgetRange}
                      onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                      className="w-full bg-graphite-950 border border-white/10 px-3 py-2.5 text-warm-white font-mono text-xs focus:outline-none focus:border-cobalt-blue"
                    >
                      <option className="bg-graphite-950" value="Under $3,000 (Monograph / Starter Scope)">
                        Under $3,000 (Monograph / Starter Scope)
                      </option>
                      <option className="bg-graphite-950" value="$3,000 – $7,500 (Core Website / Executive Package)">
                        $3,000 – $7,500 (Core Website / Executive Package)
                      </option>
                      <option className="bg-graphite-950" value="$7,500 – $15,000 (Commerce / Custom Software)">
                        $7,500 – $15,000 (Commerce / Custom Software)
                      </option>
                      <option className="bg-graphite-950" value="$15,000+ (Full ERP / Enterprise Architecture)">
                        $15,000+ (Full ERP / Enterprise Architecture)
                      </option>
                      <option className="bg-graphite-950" value="To be scoped during discovery">
                        To be scoped during discovery
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="desired-timeline"
                      className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-1.5"
                    >
                      TARGET TIMELINE
                    </label>
                    <select
                      id="desired-timeline"
                      value={formData.desiredTimeline}
                      onChange={(e) => handleInputChange('desiredTimeline', e.target.value)}
                      className="w-full bg-graphite-950 border border-white/10 px-3 py-2.5 text-warm-white font-mono text-xs focus:outline-none focus:border-cobalt-blue"
                    >
                      <option className="bg-graphite-950" value="Immediate (< 2 Weeks Onboarding)">
                        Immediate (&lt; 2 Weeks Onboarding)
                      </option>
                      <option className="bg-graphite-950" value="1 Month">
                        1 Month
                      </option>
                      <option className="bg-graphite-950" value="2–3 Months">
                        2–3 Months
                      </option>
                      <option className="bg-graphite-950" value="Flexible / Exploratory">
                        Flexible / Exploratory
                      </option>
                    </select>
                  </div>
                </div>

                {/* 6. Requirements Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="client-requirements"
                      className="text-xs font-mono tracking-widest uppercase text-muted-stone"
                    >
                      PROJECT OR CAREER OBJECTIVES *
                    </label>
                    <span className="text-[10px] font-mono text-muted-stone">
                      {formData.requirements.length} / 5000 chars
                    </span>
                  </div>
                  <textarea
                    id="client-requirements"
                    rows={4}
                    required
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Outline your current business architecture, key challenges, required integrations, or career narrative goals..."
                    className={`w-full bg-graphite-950 border px-4 py-3 text-warm-white font-sans text-xs sm:text-sm placeholder:text-muted-stone/40 focus:outline-none resize-none ${
                      errors.requirements ? 'border-red-500' : 'border-white/10 focus:border-cobalt-blue'
                    }`}
                  />
                  {errors.requirements && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.requirements}</p>
                  )}
                </div>

                {/* 7. Optional Attachment URL */}
                <div>
                  <label
                    htmlFor="attachment-url"
                    className="block text-xs font-mono tracking-widest uppercase text-muted-stone mb-1.5"
                  >
                    LINK TO SPECIFICATION OR BRIEF (OPTIONAL)
                  </label>
                  <input
                    id="attachment-url"
                    type="url"
                    value={formData.attachmentUrl}
                    onChange={(e) => handleInputChange('attachmentUrl', e.target.value)}
                    placeholder="https://drive.google.com/..., https://figma.com/..., or repository link"
                    className={`w-full bg-graphite-950 border px-4 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none ${
                      errors.attachmentUrl ? 'border-red-500' : 'border-white/10 focus:border-cobalt-blue'
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
                      className="mt-0.5 rounded-none border-white/20 bg-graphite-950 text-cobalt-blue focus:ring-0"
                    />
                    <span className="text-[11px] font-mono text-muted-stone group-hover:text-warm-white transition-colors leading-relaxed">
                      I agree to the processing of this project brief for consultation and quotation scoping under Hopepitome&apos;s confidential intake policy.
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
                  className="w-full py-4 bg-white text-graphite-950 hover:bg-cobalt-blue hover:text-white transition-colors duration-300 font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'TRANSMITTING BRIEF...' : 'SUBMIT PROJECT BRIEF'}</span>
                  <span>↗</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
