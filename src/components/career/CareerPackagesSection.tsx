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
  FileCode,
} from 'lucide-react';

const packages = [
  {
    name: 'Resume Essentials',
    tagline: 'Ideal for updating or restructuring your professional resume.',
    tier: 'Core Document',
    turnaround: '3–5 Business Days',
    revisions: '2 Structured Rounds (within 14 days)',
    formats: 'Editable DOCX + Print PDF',
    featured: false,
    deliverables: [
      'Professional resume writing based on your background',
      'Clear section structure and achievement formatting',
      'Clean typography and layout',
      'Editable Word format (DOCX) + print-ready PDF',
      '14-day post-delivery revision window',
    ],
    serviceKey: 'Professional Resume Writing',
  },
  {
    name: 'Career Presence',
    tagline: 'Our recommended package for active job seekers.',
    tier: 'Most Popular',
    turnaround: '5–7 Business Days',
    revisions: '3 Structured Rounds (within 21 days)',
    formats: 'DOCX, PDF & LinkedIn Text Assets',
    featured: true,
    deliverables: [
      'Complete Professional Resume Writing (DOCX + PDF)',
      'ATS Resume Optimisation & keyword alignment',
      'LinkedIn Profile Makeover (Headline, About & Experience)',
      'Skills section organization and profile checklist',
      '21-day post-delivery revision window',
    ],
    serviceKey: 'Multiple Services / Package Discussion',
  },
  {
    name: 'Complete Professional Presence',
    tagline: 'Full professional presentation including your personal website.',
    tier: 'Executive & Comprehensive',
    turnaround: '8–12 Business Days',
    revisions: '3 Structured Rounds (within 30 days)',
    formats: 'DOCX, PDF, Live Website & Handover',
    featured: false,
    deliverables: [
      'Professional Resume Writing & ATS Optimisation',
      'LinkedIn Profile Makeover & headline calibration',
      'Custom Personal Portfolio Website development',
      'Responsive mobile and desktop layout',
      'Project showcase and achievements section',
      'Deployment setup and complete website handover',
      '30-day post-delivery revision window',
    ],
    serviceKey: 'Personal Portfolio Websites',
  },
  {
    name: 'Job Search Assistance',
    tagline: 'Practical hands-on assistance managing your job search.',
    tier: 'Active Search Support',
    turnaround: 'Agreed Weekly Sprints (4-Week Cycle or Monthly)',
    revisions: 'Ongoing coordination during active cycle',
    formats: 'Cloud Spreadsheet Tracker & Packaging',
    featured: false,
    deliverables: [
      'Job portal profile setup and content review',
      'Identifying vacancies matching your criteria',
      'Application preparation assistance',
      'Centralized application activity tracker',
      'Status tracking and follow-up reminders',
      'Candidate approval required before any submission',
    ],
    serviceKey: 'Managed Job Search & Applications',
  },
];

export function CareerPackagesSection() {
  const handleSelectPackage = (serviceKey: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-career-service', { detail: { service: serviceKey } })
      );
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="packages" className="py-24 bg-white border-y border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            PACKAGES & PRICING
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

                {/* Quotation / Pricing Box */}
                <div className="py-3 px-3.5 bg-white rounded-xl border border-[#E6E2DC] mb-5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#777781]">
                    Pricing Model
                  </div>
                  <div className="text-sm font-bold text-[#17243B] mt-0.5">
                    Custom Quote Provided
                  </div>
                  <p className="text-[10px] text-[#777781] mt-0.5">
                    Itemized quotation after reviewing requirements
                  </p>
                </div>

                {/* Timelines and Revisions */}
                <div className="space-y-2 py-3 border-y border-[#E6E2DC]/80 mb-5 text-xs text-[#292D36]">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-3.5 h-3.5 text-[#8172A8] shrink-0 mt-0.5" />
                    <span>
                      Timeline: <strong>{pkg.turnaround}</strong>
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#8172A8] shrink-0 mt-0.5" />
                    <span>
                      Revisions: <strong>{pkg.revisions}</strong>
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileCode className="w-3.5 h-3.5 text-[#8172A8] shrink-0 mt-0.5" />
                    <span>
                      Formats: <strong>{pkg.formats}</strong>
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
                <button
                  type="button"
                  onClick={() => handleSelectPackage(pkg.serviceKey)}
                  className={`w-full text-center py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 ${
                    pkg.featured
                      ? 'bg-[#17243B] text-white hover:bg-[#292D36] shadow-sm'
                      : 'bg-white text-[#17243B] border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#FAF8FC]'
                  }`}
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Policy Clarifications Notice */}
        <div className="mt-14 max-w-4xl mx-auto bg-[#FAF8FC] border border-[#E6E2DC] rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#777781]">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#17243B] mb-1">Defined Revision Windows</h3>
                <p>
                  Every engagement includes structured revision rounds within an agreed window (14
                  to 30 days) to review phrasing, structure, and details.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#17243B] mb-1">Clear Quotations</h3>
                <p>
                  We provide a transparent written quotation detailing scope, timelines, and payment
                  terms before any work begins. No unexpected costs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[#17243B] mb-1">Flexible Scoping</h3>
                <p>
                  Need an expedited turnaround, a specific cover letter draft, or additional role
                  variations? Custom requirements can be agreed during consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
