'use client';

import React from 'react';
import {
  GraduationCap,
  Award,
  Compass,
  Zap,
  Sparkles,
} from 'lucide-react';

const audiences = [
  {
    category: 'Stage 01',
    title: 'Fresh Graduates',
    icon: GraduationCap,
    quote: 'Present your education, projects, internships and emerging skills with confidence.',
    description:
      'Starting your career requires showing your potential clearly. We highlight your academic projects, internships, technical coursework, and leadership activities to demonstrate practical capability.',
    recommended: ['Professional Resume Writing', 'LinkedIn Profile Makeover', 'Personal Portfolio Websites'],
    highlight: 'Highlight coursework & practical projects',
  },
  {
    category: 'Stage 02',
    title: 'Experienced Professionals',
    icon: Award,
    quote: 'Communicate your achievements, responsibilities and professional growth clearly.',
    description:
      'Move beyond simple task lists. We structure your years of experience around responsibilities, leadership, and notable achievements so recruiters understand your value right away.',
    recommended: ['Professional Resume Writing', 'ATS Resume Optimisation', 'LinkedIn Profile Makeover'],
    highlight: 'Structure responsibilities & key achievements',
  },
  {
    category: 'Stage 03',
    title: 'Career Changers',
    icon: Compass,
    quote: 'Reposition your transferable skills and experience for a new professional direction.',
    description:
      'Moving into a new industry or discipline? We help reframe your previous background to showcase transferable skills, problem-solving ability, and relevant accomplishments.',
    recommended: ['Targeted Resume Writing', 'ATS Resume Optimisation', 'LinkedIn Profile Makeover'],
    highlight: 'Showcase transferable skills for new roles',
  },
  {
    category: 'Stage 04',
    title: 'Active Job Seekers',
    icon: Zap,
    quote: 'Get organised support with your professional profiles, relevant opportunities and applications.',
    description:
      'Stay organized and responsive during your search. We provide structured application tracking, job portal profile setup, and assistance preparing application materials.',
    recommended: ['Managed Job Search & Applications', 'ATS Resume Optimisation', 'Complete Presence Package'],
    highlight: 'Organise applications & track vacancies',
  },
];

export function CareerAudienceSection() {
  return (
    <section className="py-24 bg-white border-b border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            WHO WE HELP
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            Support for every stage of your professional journey.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans">
            Every career phase brings different priorities. We adapt our document preparation and
            profile presentation to fit your current career step.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-8 flex flex-col justify-between hover:border-[#8172A8]/50 transition-all shadow-xs group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8172A8] px-2.5 py-0.5 rounded bg-white border border-[#E6E2DC]">
                      {aud.category}
                    </span>
                    <div className="p-2 rounded-xl bg-white border border-[#E6E2DC] text-[#17243B] group-hover:text-[#8172A8] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#17243B] mb-2">
                    {aud.title}
                  </h3>

                  {/* Quote */}
                  <blockquote className="text-sm font-medium text-[#17243B] italic border-l-2 border-[#8172A8] pl-3 py-1 mb-4 bg-white/60 rounded-r">
                    &ldquo;{aud.quote}&rdquo;
                  </blockquote>

                  <p className="text-xs sm:text-sm text-[#777781] leading-relaxed mb-6">
                    {aud.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6E2DC]/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#777781] uppercase tracking-wider">Focus Area:</span>
                    <span className="font-semibold text-[#17243B]">{aud.highlight}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aud.recommended.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono bg-white text-[#292D36] px-2.5 py-1 rounded border border-[#E6E2DC]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
