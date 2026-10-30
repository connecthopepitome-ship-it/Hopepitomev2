'use client';

import React from 'react';
import {
  UserCheck,
  CheckCircle,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const principles = [
  {
    title: 'Personalised Approach',
    quote: 'We shape the work around your experience, goals and target opportunities.',
    description:
      'We do not feed your background into generic automated fill-in-the-blank generators. We take the time to understand your distinctive trajectory, career inflection points, and specific target market before putting pen to paper.',
    icon: UserCheck,
    tag: 'Bespoke Consultation',
  },
  {
    title: 'Clear Deliverables',
    quote: 'You know what is included, what will be delivered and how the process works.',
    description:
      'No ambiguous promises or moving goalposts. Every engagement has a written scope detailing exact file formats (DOCX and PDF), revision allowances, turnaround timelines, and agreed milestones.',
    icon: CheckCircle,
    tag: 'Transparent Scoping',
  },
  {
    title: 'Professional Presentation',
    quote: 'We focus on clarity, structure, consistency and quality.',
    description:
      'Recruiters review documents under intense time constraints. We prioritize clean typographic rhythm, scannable hierarchies, and impact-first metric framing so your capabilities stand out in seconds.',
    icon: Layers,
    tag: 'Editorial Rigor',
  },
  {
    title: 'Practical Support',
    quote: 'From preparing your resume to organising applications, get help with the tasks that take time and attention.',
    description:
      'A job search requires continuous, meticulous organization. We provide realistic, hands-on assistance managing application trackers, formatting documents for specific roles, and keeping your pipeline moving forward.',
    icon: Sparkles,
    tag: 'Operational Relief',
  },
];

export function CareerWhyUsSection() {
  return (
    <section className="py-24 bg-white border-b border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            OUR GUIDING PRINCIPLES
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            Professional support, without the unnecessary complexity.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans">
            We believe in honest craftsmanship, grounded expectations, and meticulous attention to
            detail. We do not make inflated guarantees — we deliver rigorous, thoughtful work.
          </p>
        </div>

        {/* 4 Core Principles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((pr, idx) => {
            const Icon = pr.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 flex flex-col justify-between hover:border-[#8172A8]/50 transition-all shadow-xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8172A8] px-2.5 py-0.5 rounded bg-white border border-[#E6E2DC]">
                      {pr.tag}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white border border-[#E6E2DC] text-[#17243B] group-hover:text-[#8172A8] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#17243B] mb-2">
                    {pr.title}
                  </h3>

                  <blockquote className="text-sm font-medium text-[#17243B] italic bg-white/70 p-3 rounded-lg border-l-2 border-[#8172A8] mb-4">
                    &ldquo;{pr.quote}&rdquo;
                  </blockquote>

                  <p className="text-xs sm:text-sm text-[#777781] leading-relaxed">
                    {pr.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E6E2DC]/80 mt-6 flex items-center justify-between text-xs font-mono text-[#8172A8]">
                  <span>Pillar 0{idx + 1}</span>
                  <span className="text-[#777781]">Hopepitome Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

