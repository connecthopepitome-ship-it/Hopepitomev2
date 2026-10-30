'use client';

import React from 'react';
import {
  Check,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

const packages = [
  {
    name: 'Resume Essentials',
    tagline: 'Ideal for updating or refactoring your core document.',
    tier: 'Core Document',
    turnaround: '3–5 Business Days',
    revisions: '2 Rounds of Revisions',
    featured: false,
    deliverables: [
      'Professional resume writing from intake notes',
      'Impact metric extraction & narrative structuring',
      'Clean executive typographic layout',
      'Industry-tailored presentation',
      'Delivery in editable DOCX + print-ready PDF',
      'Post-delivery 14-day revision window',
    ],
    ctaText: 'Discuss Resume Essentials',
    serviceKey: 'Resume Crafting',
  },
  {
    name: 'Career Presence',
    tagline: 'The recommended suite for active job search readiness.',
    tier: 'Most Popular',
    turnaround: '5–7 Business Days',
    revisions: '3 Rounds of Revisions',
    featured: true,
    deliverables: [
      'Full Professional Resume Crafting (DOCX + PDF)',
      'ATS Resume Optimisation & keyword relevance alignment',
      'LinkedIn Profile Makeover (Headline, About & Experience)',
      'Skills matrix indexing & search visibility guidance',
      'Target role alignment strategy review',
      'Post-delivery 21-day revision window',
    ],
    ctaText: 'Discuss Career Presence',
    serviceKey: 'Multiple Services',
  },
  {
    name: 'Complete Professional Presence',
    tagline: 'Comprehensive personal branding with a custom website.',
    tier: 'Executive & Senior',
    turnaround: '8–12 Business Days',
    revisions: 'Unlimited within 30-Day Window',
    featured: false,
    deliverables: [
      'Full Professional Resume Crafting & ATS Optimisation',
      'LinkedIn Profile Makeover & network positioning',
      'Custom Personal Portfolio Website development',
      'Responsive design with project case studies gallery',
      'Contact bridge integration with domain setup assistance',
      'Full handover with self-management documentation',
    ],
    ctaText: 'Discuss Complete Presence',
    serviceKey: 'Personal Portfolio Development',
  },
  {
    name: 'Job Search Assistance',
    tagline: 'Hands-on operational support for your active search.',
    tier: 'Active Search Operations',
    turnaround: 'Agreed Weekly Sprint Cycle',
    revisions: 'Continuous Active Collaboration',
    featured: false,
    deliverables: [
      'Job portal profiles setup & optimization',
      'Targeted vacancy identification & suitability screening',
      'Application preparation assistance & packaging',
      'Centralized application activity & status tracker',
      'Follow-up schedule tracking & cadence guidance',
      'Consent-driven submissions — candidate maintains full control',
    ],
    ctaText: 'Discuss Job Search Support',
    serviceKey: 'Managed Job Search & Applications',
  },
];

export function CareerPackagesSection() {
  return (
    <section id="packages" className="py-24 bg-white border-y border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            TRANSPARENT SCOPING
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            Choose the support that fits your next step.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            Clear deliverables, agreed pricing and defined revision allowances. Choose an
            individual service or combine services into a package.
          </p>
        </div>

        {/* 4 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                pkg.featured
                  ? 'bg-[#FAF8FC] border-[#8172A8] shadow-lg ring-1 ring-[#8172A8]/30'
                  : 'bg-white border-[#E6E2DC] shadow-xs hover:border-[#8172A8]/50'
              }`}
            >
              {/* Featured Badge */}
              {pkg.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#17243B] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {pkg.tier}
                  </span>
                </div>
              )}

              <div>
                {!pkg.featured && (
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#8172A8] px-2 py-0.5 rounded bg-[#FAF8FC] border border-[#E6E2DC] inline-block mb-3">
                    {pkg.tier}
                  </span>
                )}

                <h3 className="font-display font-bold text-xl text-[#17243B] mb-2 mt-1">
                  {pkg.name}
                </h3>

                <p className="text-xs text-[#777781] leading-relaxed mb-5 min-h-[36px]">
                  {pkg.tagline}
                </p>

                {/* Scoping Basis / Quotation Callout */}
                <div className="py-3 px-3.5 bg-white rounded-xl border border-[#E6E2DC] mb-5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#777781]">
                    Pricing Model
                  </div>
                  <div className="text-sm font-bold text-[#17243B] mt-0.5">
                    Request a Custom Quote
                  </div>
                  <p className="text-[10px] text-[#777781] mt-0.5">
                    Tailored to your career level & specific scope
                  </p>
                </div>

                {/* Timelines and Revisions */}
                <div className="space-y-2 py-3 border-y border-[#E6E2DC]/80 mb-5 text-xs text-[#292D36]">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                    <span>
                      Turnaround: <strong>{pkg.turnaround}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                    <span>
                      Revisions: <strong>{pkg.revisions}</strong>
                    </span>
                  </div>
                </div>

                {/* Deliverables List */}
                <div className="space-y-2.5 mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#777781] font-semibold">
                    Included Deliverables:
                  </div>
                  {pkg.deliverables.map((item, dIdx) => (
                    <div key={dIdx} className="flex items-start space-x-2 text-xs text-[#292D36]">
                      <Check className="w-3.5 h-3.5 text-[#8172A8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href="#contact"
                  className={`w-full text-center py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 ${
                    pkg.featured
                      ? 'bg-[#17243B] text-white hover:bg-[#292D36] shadow-sm'
                      : 'bg-white text-[#17243B] border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#FAF8FC]'
                  }`}
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Clarifications & Policy Notice */}
        <div className="mt-14 max-w-4xl mx-auto bg-[#FAF8FC] border border-[#E6E2DC] rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#777781]">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#17243B] mb-1">Defined Revision Policy</h3>
                <p>
                  Every engagement includes dedicated revision rounds to review typography, narrative
                  framing, and factual emphasis before final sign-off.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#17243B] mb-1">Transparent Quotations</h3>
                <p>
                  No hidden fees or unexpected charges. You receive a complete written scope of
                  deliverables, timelines, and payment terms upfront.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#17243B] mb-1">Custom Add-On Services</h3>
                <p>
                  Need an urgent 48-hour rush turnaround, extra targeted role variations, or custom
                  domain setup? Add-ons can be integrated during intake.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

