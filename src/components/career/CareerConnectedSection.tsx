'use client';

import React from 'react';
import {
  FileText,
  Linkedin,
  Globe,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const touchpoints = [
  {
    step: '01',
    title: 'Resume',
    subtitle: 'Communicate your experience.',
    icon: FileText,
    description:
      'A clearly structured document that summarizes your career background, skills, qualifications, and key accomplishments in a format easy for hiring teams to read.',
    meta: 'Core Document · PDF & Word Formats',
    features: [
      'Clear formatting and typography',
      'Role-relevant experience structure',
      'Delivered in editable DOCX & print PDF',
    ],
  },
  {
    step: '02',
    title: 'LinkedIn Profile',
    subtitle: 'Strengthen your professional presence.',
    icon: Linkedin,
    description:
      'An engaging headline, concise About summary, and organized work history so recruiters and industry peers understand your professional background.',
    meta: 'Online Presence · Recruiter Visibility',
    features: [
      'Search-friendly headline',
      'Engaging About summary narrative',
      'Structured experience and skills tags',
    ],
  },
  {
    step: '03',
    title: 'Portfolio Website',
    subtitle: 'Showcase your actual work.',
    icon: Globe,
    description:
      'A clean personal website to present your case studies, projects, credentials, and achievements in one central, accessible place.',
    meta: 'Personal Website · Domain & Handover',
    features: [
      'Project case study displays',
      'Responsive mobile and desktop design',
      'Direct contact section with lead forwarding',
    ],
  },
  {
    step: '04',
    title: 'Job Search Support',
    subtitle: 'Organise your next opportunity.',
    icon: Briefcase,
    description:
      'Practical assistance with job portal profiles, identifying relevant job openings, and tracking applications so your search stays organized.',
    meta: 'Search Support · Systematic Organisation',
    features: [
      'Job portal profile setup & updates',
      'Application activity tracker sheet',
      'Candidate-approved submissions only',
    ],
  },
];

export function CareerConnectedSection() {
  return (
    <section className="py-24 bg-[#F7F5F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            YOUR COMPLETE PROFESSIONAL PROFILE
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-[#17243B] tracking-tight mb-4">
            More than a resume. A complete professional presence.
          </h2>

          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans max-w-2xl mx-auto">
            Employers may discover you through a resume, a LinkedIn profile, a portfolio or a job
            application. These touchpoints should communicate a consistent and clear picture of your
            professional experience.
          </p>
        </div>

        {/* Connected Journey Grid / Timeline */}
        <div className="relative">
          {/* Subtle Horizontal Connector Line (Desktop) */}
          <div
            className="hidden lg:block absolute top-1/2 left-8 right-8 -translate-y-12 h-0.5 bg-[#E6E2DC] z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {touchpoints.map((tp, idx) => {
              const Icon = tp.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E6E2DC] p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative group"
                >
                  {/* Step Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-[#8172A8] px-2.5 py-1 rounded-full bg-[#FAF8FC] border border-[#E6E2DC]">
                      STEP {tp.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#FAF8FC] border border-[#E6E2DC] text-[#17243B] group-hover:bg-[#F2EFF7] group-hover:text-[#8172A8] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 mb-6">
                    <h3 className="font-display font-bold text-xl text-[#17243B]">
                      {tp.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#8172A8] font-mono">
                      {tp.subtitle}
                    </p>
                    <p className="text-xs text-[#777781] leading-relaxed pt-2">
                      {tp.description}
                    </p>
                  </div>

                  {/* Feature Checkpoints */}
                  <div className="pt-4 border-t border-[#E6E2DC]/80 space-y-2">
                    {tp.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-[11px] text-[#292D36]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8172A8] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Meta */}
                  <div className="mt-5 pt-3 border-t border-[#E6E2DC]/60 text-[10px] font-mono uppercase tracking-wider text-[#777781]">
                    {tp.meta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 bg-white rounded-2xl border border-[#E6E2DC] p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-[#17243B]">
                Ready to bring your career presentation together?
              </h3>
              <p className="text-xs sm:text-sm text-[#777781]">
                Choose an individual service or combine multiple services into a package.
              </p>
            </div>
            <a
              href="#packages"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[#17243B] text-white px-6 py-3 rounded-full hover:bg-[#292D36] transition-all shadow-sm shrink-0"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
