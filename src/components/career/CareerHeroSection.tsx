'use client';

import React from 'react';
import {
  FileText,
  Search,
  Linkedin,
  Globe,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const supportingPoints = [
  {
    icon: FileText,
    label: 'Professional Resume Writing',
    desc: 'Structured for clarity and career impact',
  },
  {
    icon: Search,
    label: 'ATS Resume Optimisation',
    desc: 'Keyword alignment & recruiter readability',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn Profile Makeover',
    desc: 'Stronger headline, summary & story',
  },
  {
    icon: Globe,
    label: 'Personal Portfolio Websites',
    desc: 'Dedicated showcase for your work & projects',
  },
  {
    icon: Briefcase,
    label: 'Managed Job Search & Applications',
    desc: 'Practical search organisation & vacancy tracking',
  },
];

export function CareerHeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#F7F5F0]">
      {/* Subtle Editorial Background Grid Elements */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#17243B 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC]">
                <Sparkles className="w-3 h-3 text-[#8172A8]" />
                CAREER SERVICES · PROFESSIONAL BRANDING
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-[#17243B] tracking-tight leading-[1.08]">
              Your experience deserves a{' '}
              <span className="relative whitespace-nowrap text-[#17243B]">
                stronger
                <span className="absolute bottom-1.5 left-0 right-0 h-3 bg-[#A69ACB]/25 -z-10 rounded-sm" />
              </span>{' '}
              presentation.
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#292D36]/90 leading-relaxed font-sans max-w-2xl">
              From professionally written resumes to LinkedIn profiles, personal portfolio websites
              and job search assistance, we help you present your experience and take your next
              career step with confidence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#services"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-[#17243B] text-white hover:bg-[#292D36] active:scale-95 transition-all shadow-md group"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-white text-[#17243B] border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#FAF8FC] active:scale-95 transition-all shadow-sm"
              >
                Get Started
              </a>
            </div>

            {/* Supporting Points Grid */}
            <div className="pt-8 border-t border-[#E6E2DC]/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {supportingPoints.map((pt, idx) => {
                const Icon = pt.icon;
                return (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-[#E6E2DC] text-[#8172A8] shrink-0 mt-0.5 shadow-2xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h2 className="text-xs font-semibold text-[#17243B] leading-snug">{pt.label}</h2>
                      <p className="text-[11px] text-[#777781] leading-tight mt-0.5">{pt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Layered Editorial Document Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Subtle Shadow Backdrop */}
              <div
                className="absolute -inset-4 bg-gradient-to-tr from-[#A69ACB]/15 via-white/40 to-transparent rounded-3xl -z-10 blur-xl"
                aria-hidden="true"
              />

              {/* Document 1: Main Realistic Executive Resume Preview Sheet */}
              <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl p-6 sm:p-7 relative z-20">
                {/* Document Top Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E6E2DC]/80 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8172A8]/60" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#777781] font-semibold">
                      Illustrative Concept Sample · Fictional Profile
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Clean Structure
                  </span>
                </div>

                {/* Resume Header */}
                <div className="space-y-1">
                  <h2 className="font-display font-bold text-xl text-[#17243B] tracking-tight">
                    SARAH CHEN
                  </h2>
                  <p className="text-xs font-medium text-[#8172A8] font-mono tracking-wide uppercase">
                    SENIOR PRODUCT STRATEGIST
                  </p>
                  <p className="text-[11px] text-[#777781] font-sans">
                    Singapore · sample.chen@example.com · linkedin.com/in/sample-sarahchen
                  </p>
                </div>

                {/* Profile Summary */}
                <div className="mt-4 pt-3 border-t border-[#E6E2DC]/60">
                  <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#777781] font-semibold mb-1">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-[#292D36] leading-relaxed">
                    Product leader with 9+ years managing software development roadmaps, coordinating
                    cross-functional teams, and delivering enterprise digital products.
                  </p>
                </div>

                {/* Sample Experience Entries */}
                <div className="mt-4 pt-3 border-t border-[#E6E2DC]/60">
                  <h3 className="text-[10px] font-mono uppercase tracking-wider text-[#777781] font-semibold mb-2">
                    Key Experience Highlights
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-[#FAF8FC] p-2.5 rounded-lg border border-[#E6E2DC]/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#17243B]">
                          Product Modernisation
                        </span>
                        <span className="text-[10px] font-mono text-[#8172A8] font-semibold">
                          Platform Lead
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777781] mt-0.5">
                        Led platform unification across 3 core business units with zero unplanned downtime.
                      </p>
                    </div>

                    <div className="bg-[#FAF8FC] p-2.5 rounded-lg border border-[#E6E2DC]/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#17243B]">
                          Workflow Optimization
                        </span>
                        <span className="text-[10px] font-mono text-[#8172A8] font-semibold">
                          Operations Lead
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777781] mt-0.5">
                        Streamlined client onboarding steps and automated monthly status reporting.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Competencies */}
                <div className="mt-4 pt-3 border-t border-[#E6E2DC]/60 flex flex-wrap gap-1.5">
                  {[
                    'Product Roadmapping',
                    'Systems Architecture',
                    'Agile Delivery',
                    'Stakeholder Management',
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-[#F2EFF7] text-[#8172A8] text-[10px] font-medium rounded-sm border border-[#E6E2DC]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Document 2: Floating Card — LinkedIn Profile Calibrated Card */}
              <div className="sm:absolute -bottom-7 -left-7 sm:w-64 bg-[#FAF8FC] rounded-xl border border-[#E6E2DC] shadow-lg p-3.5 z-30 mt-4 sm:mt-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
                    <span className="text-[10px] font-mono font-semibold uppercase text-[#17243B]">
                      LinkedIn Makeover
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-[#777781] bg-white px-1.5 py-0.5 rounded border border-[#E6E2DC]">
                    Concept
                  </span>
                </div>
                <p className="text-xs font-medium text-[#17243B]">
                  &ldquo;Senior Systems Lead | Enterprise ERP & Transformation&rdquo;
                </p>
                <p className="text-[10px] text-[#777781] mt-1">
                  Structured About section, search keywords and skills hierarchy.
                </p>
              </div>

              {/* Document 3: Floating Card — Personal Portfolio Preview */}
              <div className="sm:absolute -top-6 -right-6 sm:w-60 bg-white rounded-xl border border-[#E6E2DC] shadow-lg p-3.5 z-30 hidden sm:block">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#8172A8]" />
                    <span className="text-[10px] font-mono font-semibold uppercase text-[#17243B]">
                      Portfolio Website
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-[#777781]" />
                </div>
                <p className="text-xs font-semibold text-[#17243B]">
                  sarahchen.sample / portfolio
                </p>
                <p className="text-[10px] text-[#777781] mt-0.5">
                  Clean responsive portfolio displaying project case studies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
