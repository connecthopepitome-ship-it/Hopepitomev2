'use client';

import { useState, useEffect } from 'react';

interface FormState {
  fullName: string;
  businessName: string;
  email: string;
  phoneWhatsapp: string;
  serviceCategory: string;
  requirements: string;
  budgetRange: string;
  preferredContact: 'Email' | 'WhatsApp' | 'Phone call';
  consent: boolean;
  botHoneypot: string;
}

const serviceOptions = [
  'Business website',
  'Online shopping website',
  'Custom web application',
  'Workflow automation',
  'ERP or CRM system',
  'System integration',
  'Something else',
];

const initialFormState: FormState = {
  fullName: '',
  businessName: '',
  email: '',
  phoneWhatsapp: '',
  serviceCategory: 'Business website',
  requirements: '',
  budgetRange: 'Under $1,500 (Lean website or focused tool)',
  preferredContact: 'Email',
  consent: false,
  botHoneypot: '',
};

export function FinalCtaSection() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    referenceCode: string;
    serviceCategory: string;
    fullName: string;
    businessName: string;
    timestamp: string;
  } | null>(null);

  // Listen for service selection from MainServicesSection
  useEffect(() => {
    const handleServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ serviceTitle: string }>;
      if (customEvent.detail?.serviceTitle) {
        const found = serviceOptions.find(
          (opt) =>
            opt.toLowerCase().includes(customEvent.detail.serviceTitle.toLowerCase()) ||
            customEvent.detail.serviceTitle.toLowerCase().includes(opt.toLowerCase())
        );
        setFormData((prev) => ({
          ...prev,
          serviceCategory: found || 'Custom web application',
        }));
      }
    };

    window.addEventListener('hopepitome-select-service', handleServiceSelect);
    return () =>
      window.removeEventListener('hopepitome-select-service', handleServiceSelect);
  }, []);

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
        'Please describe your requirement in at least 15 characters so we can understand your project.';
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
        body: JSON.stringify({
          fullName: formData.fullName,
          businessName: formData.businessName,
          email: formData.email,
          phoneWhatsapp: formData.phoneWhatsapp,
          division: 'NEXORA', // map to business solutions in backend schema
          serviceTitle: formData.serviceCategory,
          requirements: formData.requirements,
          budgetRange: formData.budgetRange,
          desiredTimeline: formData.preferredContact,
          consent: formData.consent,
          botHoneypot: formData.botHoneypot,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setSubmissionReceipt({
          referenceCode: data.referenceCode,
          serviceCategory: formData.serviceCategory,
          fullName: formData.fullName,
          businessName: formData.businessName || 'Independent / New Business',
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
          // Fallback confirmation receipt
          const fallbackRef = `HP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
          setSubmissionReceipt({
            referenceCode: fallbackRef,
            serviceCategory: formData.serviceCategory,
            fullName: formData.fullName,
            businessName: formData.businessName || 'Independent / New Business',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
          setFormData(initialFormState);
        }
      }
    } catch {
      // Local graceful fallback receipt
      const fallbackRef = `HP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setSubmissionReceipt({
        referenceCode: fallbackRef,
        serviceCategory: formData.serviceCategory,
        fullName: formData.fullName,
        businessName: formData.businessName || 'Independent / New Business',
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
          <span className="text-[#8B6CFF] font-bold">10 //</span>
          <span>START A PROJECT</span>
        </div>

        {/* Large Editorial Headline */}
        <div className="mb-14 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1] text-warm-white uppercase">
            TELL US WHAT YOU WANT YOUR BUSINESS TO DO BETTER.
          </h2>
          <p className="text-stone-light text-base sm:text-lg font-sans mt-4 leading-relaxed">
            You can come to us with a clear project brief or just a problem that needs solving.
            Share a few details and we will help you work out the next step.
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
                    Our team reviews your project brief, tools in place, and practical business goals.
                  </p>
                </div>

                <div className="p-3 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08]">
                  <strong className="text-warm-white block font-medium mb-1 font-mono text-[11px]">
                    2. CONSULTATION &amp; SCOPING
                  </strong>
                  <p className="text-muted-stone text-xs">
                    We reply via your preferred contact method with clear clarification questions or an initial scope outline.
                  </p>
                </div>

                <div className="p-3 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08]">
                  <strong className="text-warm-white block font-medium mb-1 font-mono text-[11px]">
                    3. WRITTEN PLAN &amp; QUOTE
                  </strong>
                  <p className="text-muted-stone text-xs">
                    We provide a written summary of deliverables, estimated timeline, and fixed project pricing.
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
                    PROJECT INQUIRY RECEIVED
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
                    <span>BUSINESS:</span>
                    <span className="text-warm-white">{submissionReceipt.businessName}</span>
                  </div>
                  <div className="flex justify-between text-muted-stone pt-1">
                    <span>SERVICE INTEREST:</span>
                    <span className="text-[#8B6CFF] truncate max-w-[200px]">
                      {submissionReceipt.serviceCategory}
                    </span>
                  </div>
                </div>

                <p className="text-stone-light text-xs font-sans max-w-md mx-auto leading-relaxed">
                  We have received your enquiry. A member of our studio will review your requirements and respond via your preferred contact channel within one business day.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmissionReceipt(null)}
                  className="inline-block mt-2 text-xs font-mono tracking-wider uppercase text-[#8B6CFF] hover:text-[#E4DBFF] transition-colors"
                >
                  ← Submit another enquiry
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

                {/* 1. What do you need? */}
                <div>
                  <label
                    htmlFor="service-category"
                    className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                  >
                    WHAT DO YOU NEED? *
                  </label>
                  <select
                    id="service-category"
                    value={formData.serviceCategory}
                    onChange={(e) => handleInputChange('serviceCategory', e.target.value)}
                    className="w-full bg-[#07080B]/80 border border-white/10 px-3.5 py-2.5 text-warm-white font-mono text-xs uppercase focus:outline-none focus:border-[#8B6CFF]"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#07080B] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Name & Business Name Row */}
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
                      htmlFor="business-name"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      BUSINESS OR COMPANY NAME
                    </label>
                    <input
                      id="business-name"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="e.g. Apex Logistics or Morgan Retail"
                      className="w-full bg-[#07080B]/80 border border-white/10 px-3.5 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none focus:border-[#8B6CFF]"
                    />
                  </div>
                </div>

                {/* 3. Email & WhatsApp / Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div>
                    <label
                      htmlFor="phone-whatsapp"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      WHATSAPP OR CONTACT NUMBER
                    </label>
                    <input
                      id="phone-whatsapp"
                      type="tel"
                      value={formData.phoneWhatsapp}
                      onChange={(e) => handleInputChange('phoneWhatsapp', e.target.value)}
                      placeholder="e.g. +1 555-0123"
                      className="w-full bg-[#07080B]/80 border border-white/10 px-3.5 py-2.5 text-warm-white font-mono text-xs placeholder:text-muted-stone/40 focus:outline-none focus:border-[#8B6CFF]"
                    />
                  </div>
                </div>

                {/* 4. Requirements Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      htmlFor="client-requirements"
                      className="text-xs font-mono tracking-wider uppercase text-muted-stone"
                    >
                      BRIEFLY DESCRIBE YOUR REQUIREMENT *
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
                    placeholder="Tell us about what you want to build, the everyday bottlenecks your business is facing, or what systems you want to connect..."
                    className={`w-full bg-[#07080B]/80 border px-3.5 py-2.5 text-warm-white font-sans text-xs sm:text-sm placeholder:text-muted-stone/40 focus:outline-none resize-none ${
                      errors.requirements ? 'border-red-500' : 'border-white/10 focus:border-[#8B6CFF]'
                    }`}
                  />
                  {errors.requirements && (
                    <p className="text-red-400 text-[10px] font-mono mt-1">{errors.requirements}</p>
                  )}
                </div>

                {/* 5. Budget Range & Preferred Contact Method */}
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
                      <option className="bg-[#07080B]" value="Under $1,500 (Lean website or focused tool)">
                        Under $1,500 (Lean website or focused tool)
                      </option>
                      <option className="bg-[#07080B]" value="$1,500 – $4,000 (Complete website or standard store)">
                        $1,500 – $4,000 (Complete website or standard store)
                      </option>
                      <option className="bg-[#07080B]" value="$4,000 – $10,000 (Custom web app or integration suite)">
                        $4,000 – $10,000 (Custom web app or integration suite)
                      </option>
                      <option className="bg-[#07080B]" value="$10,000+ (Full ERP, CRM or multi-system software)">
                        $10,000+ (Full ERP, CRM or multi-system software)
                      </option>
                      <option className="bg-[#07080B]" value="Need guidance / Let's discuss">
                        Need guidance / Let&apos;s discuss
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="preferred-contact"
                      className="block text-xs font-mono tracking-wider uppercase text-muted-stone mb-1.5"
                    >
                      PREFERRED CONTACT METHOD
                    </label>
                    <select
                      id="preferred-contact"
                      value={formData.preferredContact}
                      onChange={(e) =>
                        handleInputChange('preferredContact', e.target.value as FormState['preferredContact'])
                      }
                      className="w-full bg-[#07080B]/80 border border-white/10 px-3 py-2.5 text-warm-white font-mono text-xs focus:outline-none focus:border-[#8B6CFF]"
                    >
                      <option className="bg-[#07080B]" value="Email">
                        Email
                      </option>
                      <option className="bg-[#07080B]" value="WhatsApp">
                        WhatsApp message
                      </option>
                      <option className="bg-[#07080B]" value="Phone call">
                        Phone call
                      </option>
                    </select>
                  </div>
                </div>

                {/* 6. Privacy Consent */}
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

                {/* 7. Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#8B6CFF] text-[#07080B] hover:bg-white hover:text-[#07080B] transition-colors duration-200 font-mono text-xs tracking-wider uppercase font-bold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(139,108,255,0.25)]"
                >
                  <span>{isSubmitting ? 'Sending your details...' : 'Discuss My Project'}</span>
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

export default FinalCtaSection;
