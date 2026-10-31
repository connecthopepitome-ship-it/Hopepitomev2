'use client';

import React from 'react';
import {
  MessageSquare,
  FileCheck,
  PenTool,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Tell Us About Yourself',
    quote: 'Share your existing resume, professional background, target roles and the services you need.',
    icon: MessageSquare,
    details:
      'Fill out the enquiry form below with your current resume draft or career notes. Let us know your target roles, industries, and preferred timeline.',
  },
  {
    number: '02',
    title: 'We Review Your Requirements',
    quote: 'We understand your experience, goals and expectations before beginning the work.',
    icon: FileCheck,
    details:
      'Our team reviews your background and objectives, clarifying your priorities, key accomplishments, and target roles before beginning the work.',
  },
  {
    number: '03',
    title: 'We Prepare Your Deliverables',
    quote: 'Our team works on the agreed documents, profiles, website or job search support.',
    icon: PenTool,
    details:
      'We write, structure, and format your agreed deliverables according to your chosen package, ensuring clean typography and clear organization.',
  },
  {
    number: '04',
    title: 'Review and Final Delivery',
    quote: 'You review the work, request the revisions included in your package and receive the final deliverables.',
    icon: CheckCircle,
    details:
      'Review your draft materials, request the revisions included in your package, and receive your final editable (DOCX), print-ready (PDF), or web files.',
  },
];

export function CareerProcessSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F7F5F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            HOW IT WORKS
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            A simple process. Personal attention. Clear deliverables.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            Defined milestones with agreed revision allowances. We keep the process straightforward,
            transparent, and focused on your career goals.
          </p>
        </div>

        {/* 4 Process Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E6E2DC] p-6 sm:p-7 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-bold text-[#8172A8]">
                      {st.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#FAF8FC] border border-[#E6E2DC] text-[#17243B]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#17243B] mb-2">
                    {st.title}
                  </h3>

                  <blockquote className="text-xs font-medium text-[#17243B] italic bg-[#FAF8FC] p-2.5 rounded border border-[#E6E2DC]/80 mb-3">
                    &ldquo;{st.quote}&rdquo;
                  </blockquote>

                  <p className="text-xs text-[#777781] leading-relaxed">
                    {st.details}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E2DC]/60 flex items-center justify-between text-[11px] font-mono text-[#8172A8]">
                  <span>Step {st.number}</span>
                  <span className="text-[#777781]">Agreed Timeline</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#17243B] text-white hover:bg-[#292D36] active:scale-95 transition-all shadow-md group"
          >
            <span>Start Your Career Project</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
