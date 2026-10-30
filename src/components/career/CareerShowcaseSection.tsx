'use client';

import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  GraduationCap,
  Terminal,
  Globe,
  Linkedin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
} from 'lucide-react';

const showcaseItems = [
  {
    id: 'executive',
    title: 'Executive Resume',
    label: 'Senior Leadership',
    icon: UserCheck,
    tag: 'C-Suite & VP Level',
    candidate: 'Elena Vance — Chief Operations Officer',
    summary:
      'Engineered for a global operations executive with 16+ years scaling enterprise supply chains across 14 countries. Highlights multi-million dollar margin improvements and cross-border organizational leadership.',
    highlights: [
      '+$38M Operating margin efficiency across 3 global acquisitions',
      'Unified 420-person multinational workforce across Americas & EMEA',
      'Implemented automated ERP workflows decreasing fulfillment lag by 64%',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'CHIEF OPERATIONS OFFICER · ENTERPRISE SCALE',
      location: 'London, UK · Executive Advisory',
      competencies: [
        'Enterprise Restructuring',
        'Global Supply Chain ERP',
        'M&A Integration',
        'P&L Optimization ($150M+)',
        'Board Level Reporting',
      ],
      sampleBullet:
        'Architected comprehensive post-merger integration framework across 4 enterprise business units, consolidating overlapping supply routes and capturing $18.4M in year-one synergies.',
    },
  },
  {
    id: 'modern',
    title: 'Modern Professional Resume',
    label: 'Mid-Senior Level',
    icon: FileText,
    tag: 'Product & Strategy',
    candidate: 'Marcus Sterling — Principal Product Manager',
    summary:
      'Refactored from an unfocused 4-page list of responsibilities into a punchy, 2-page impact narrative demonstrating customer growth, platform adoption, and technical execution.',
    highlights: [
      'Grew active enterprise B2B subscriber base from 25K to 180K users',
      'Spearheaded modern REST/GraphQL API product lines generating $8.2M ARR',
      'Cut user churn by 28% through data-informed UX onboarding rebuild',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'PRINCIPAL PRODUCT MANAGER · B2B SAAS PLATFORMS',
      location: 'Berlin, Germany · Remote Strategy',
      competencies: [
        'Product Strategy & Roadmap',
        'Enterprise SaaS',
        'API Architecture',
        'Agile Sprint Governance',
        'Product-Led Growth (PLG)',
      ],
      sampleBullet:
        'Partnered with engineering leadership to migrate legacy monolithic client dashboard to modular micro-frontends, accelerating feature release cadence by 3.5x while improving user NPS by +24 points.',
    },
  },
  {
    id: 'tech',
    title: 'Technical Professional Resume',
    label: 'Engineering & Architecture',
    icon: Terminal,
    tag: 'Cloud & Systems',
    candidate: 'Devon Thorne — Cloud Solutions Architect',
    summary:
      'Calibrated for rigorous ATS systems and engineering hiring managers. Balances infrastructure depth with tangible business continuity metrics and cloud cost governance.',
    highlights: [
      'Designed multi-region AWS/Kubernetes architecture with 99.995% uptime',
      'Optimized annual cloud expenditure saving $420,000 via automated right-sizing',
      'Zero-downtime database migration for 12TB production MariaDB instance',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'LEAD CLOUD & DISTRIBUTED SYSTEMS ARCHITECT',
      location: 'Toronto, Canada · Hybrid Infra',
      competencies: [
        'Kubernetes / Terraform',
        'AWS & Cloudflare Edge',
        'High-Availability Architecture',
        'Zero-Trust Security',
        'CI/CD Pipelines',
      ],
      sampleBullet:
        'Spearheaded zero-trust identity and micro-segmentation rollout across 80+ microservices, successfully passing SOC2 Type II and ISO 27001 enterprise security audits on first inspection.',
    },
  },
  {
    id: 'graduate',
    title: 'Fresh Graduate Resume',
    label: 'Early Career',
    icon: GraduationCap,
    tag: 'Emerging Talent',
    candidate: 'Aria Patel — Associate Data Analyst',
    summary:
      'Structured to elevate university research, capstone data modeling, hackathon accolades, and internship impact into commercial analytical competence for corporate intake programs.',
    highlights: [
      'First Class Honours in Computer Science & Applied Statistics',
      'Capstone predictive churn model recognized with Faculty Innovation Award',
      'Internship project adopted into company-wide customer analytics reporting',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'ASSOCIATE DATA ANALYST · STATISTICAL MODELING',
      location: 'Sydney, Australia · Graduate Program',
      competencies: [
        'Python (Pandas, Scikit-learn)',
        'SQL & Query Optimization',
        'Tableau & PowerBI',
        'Predictive Modeling',
        'A/B Testing Methodology',
      ],
      sampleBullet:
        'Conducted statistical regression analysis on 500,000+ customer transaction rows during summer analyst residency, revealing previously untracked basket abandonment triggers.',
    },
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio Website',
    label: 'Digital Web Presence',
    icon: Globe,
    tag: 'Custom Engineered Web',
    candidate: 'Concept Preview — julian-ross.design',
    summary:
      'Bespoke portfolio website designed to showcase interactive design case studies, design systems architecture, and executive creative leadership on an independent domain.',
    highlights: [
      'High-performance editorial layout with instant sub-second loading',
      'Interactive case study deep-dives with problem-to-solution metrics',
      'Automated contact bridge with calendar booking integration',
    ],
    previewType: 'portfolio',
    previewData: {
      headline: 'JULIAN ROSS — PRINCIPAL DESIGN SYSTEMS ARCHITECT',
      domain: 'julianross.dev / live-portfolio',
      sections: [
        'Selected Works (6 Case Studies)',
        'Design Systems Philosophy',
        'Keynote & Thought Leadership',
        'Downloadable Curriculum Vitae',
      ],
    },
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Profile Presentation',
    label: 'Online Brand Calibration',
    icon: Linkedin,
    tag: 'Social Proof & Searchability',
    candidate: 'Concept Preview — Maya Lin, VP Talent Acquisition',
    summary:
      'Rebuilt LinkedIn headline, banner styling, first-person narrative About section, and featured media to establish recognized authority and attract proactive executive headhunting.',
    highlights: [
      'Headline calibrated with primary executive search strings',
      'Story-driven About section with 4.8x higher inbound recruiter contacts',
      'Featured section organizing keynotes, published articles, and press mentions',
    ],
    previewType: 'linkedin',
    previewData: {
      headline: 'VP Global People Operations & Organizational Design | Keynote Speaker',
      followers: '14,200+ followers · 500+ connections',
      aboutLead:
        '“Building modern workforces that thrive through rapid digital change. Passionate about transparent compensation, inclusive leadership, and high-trust engineering cultures.”',
    },
  },
];

export function CareerShowcaseSection() {
  const [activeTab, setActiveTab] = useState(showcaseItems[0].id);
  const activeItem = showcaseItems.find((item) => item.id === activeTab) || showcaseItems[0];

  return (
    <section id="showcase" className="py-24 bg-[#F7F5F0] relative border-b border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            GALLERY OF WORK SAMPLES
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            See the difference thoughtful presentation makes.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans">
            Explore authentic design concept samples across career levels. We craft each
            deliverable to mirror the nuance, tone, and rigor expected by senior decision-makers.
          </p>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#777781] mt-3">
            <Shield className="w-3.5 h-3.5 text-[#8172A8]" />
            <span>
              Privacy Guarantee: Concept samples utilize fictional profiles to protect confidential client data.
            </span>
          </div>
        </div>

        {/* Interactive Tab Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar mb-8">
          {showcaseItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#17243B] text-white border-[#17243B] shadow-sm'
                    : 'bg-white text-[#292D36] border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#FAF8FC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8172A8]'}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Sample Display Card */}
        <div className="bg-white rounded-3xl border border-[#E6E2DC] p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Sample Context & Strategic Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8172A8] font-bold px-2.5 py-1 rounded bg-[#FAF8FC] border border-[#E6E2DC]">
                  {activeItem.tag}
                </span>
                <h3 className="font-display font-bold text-2xl text-[#17243B] pt-2">
                  {activeItem.candidate}
                </h3>
                <p className="text-xs sm:text-sm text-[#777781] leading-relaxed">
                  {activeItem.summary}
                </p>
              </div>

              {/* Strategic Transformation Highlights */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold">
                  Key Presentation Elements:
                </h4>
                <div className="space-y-2">
                  {activeItem.highlights.map((hl, hIdx) => (
                    <div
                      key={hIdx}
                      className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#FAF8FC] border border-[#E6E2DC]/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#292D36] font-medium leading-relaxed">
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-[#FAF8FC] px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                >
                  <span>Request Similar Custom Crafting</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right: Realistic Document / Asset Mockup Preview */}
            <div className="lg:col-span-7">
              {activeItem.previewType === 'resume' && (
                <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-6 sm:p-8 shadow-inner relative">
                  {/* Mock Paper Sheet */}
                  <div className="bg-white rounded-xl border border-[#E6E2DC] p-6 sm:p-8 shadow-md space-y-5">
                    {/* Sheet Header */}
                    <div className="border-b border-[#E6E2DC] pb-4">
                      <div className="text-[10px] font-mono tracking-widest text-[#8172A8] uppercase font-bold">
                        {activeItem.previewData.headline}
                      </div>
                      <h4 className="font-display font-extrabold text-2xl text-[#17243B] tracking-tight mt-1">
                        {activeItem.candidate.split('—')[0].trim()}
                      </h4>
                      <p className="text-xs text-[#777781] font-mono mt-0.5">
                        {activeItem.previewData.location}
                      </p>
                    </div>

                    {/* Competencies Matrix */}
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#777781] font-semibold mb-2">
                        Core Competency Index
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeItem.previewData.competencies?.map((comp, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[11px] font-mono bg-[#FAF8FC] text-[#292D36] px-2.5 py-1 rounded border border-[#E6E2DC]"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Selected Experience Detail */}
                    <div className="space-y-2 pt-2 border-t border-[#E6E2DC]/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#17243B]">
                          High-Impact Professional Experience
                        </span>
                        <span className="text-[11px] font-mono text-[#777781]">
                          2021 — PRESENT
                        </span>
                      </div>
                      <div className="bg-[#F7F5F0]/60 p-3.5 rounded-lg border border-[#E6E2DC] text-xs text-[#292D36] leading-relaxed">
                        • {activeItem.previewData.sampleBullet}
                      </div>
                    </div>

                    {/* Verification watermark */}
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#777781]">
                      <span>Typography: Syne & Plus Jakarta Sans</span>
                      <span>Verified ATS Structure · Ready for Export</span>
                    </div>
                  </div>
                </div>
              )}

              {activeItem.previewType === 'portfolio' && (
                <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-6 sm:p-8 shadow-inner">
                  {/* Browser Shell Mockup */}
                  <div className="bg-white rounded-xl border border-[#E6E2DC] shadow-md overflow-hidden">
                    {/* Browser Bar */}
                    <div className="bg-[#F7F5F0] px-4 py-2.5 border-b border-[#E6E2DC] flex items-center space-x-3">
                      <div className="flex space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1 text-center bg-white py-1 px-3 rounded-md text-[11px] font-mono text-[#777781] border border-[#E6E2DC]">
                        https://{activeItem.previewData.domain}
                      </div>
                    </div>

                    {/* Web Content Mockup */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#8172A8] font-bold uppercase tracking-wider">
                          Personal Atelier
                        </span>
                        <h4 className="font-display font-extrabold text-xl sm:text-2xl text-[#17243B]">
                          {activeItem.previewData.headline}
                        </h4>
                        <p className="text-xs text-[#777781]">
                          Crafting scalable software design systems for Fortune 500 enterprises.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {activeItem.previewData.sections?.map((sec, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 bg-[#FAF8FC] rounded-lg border border-[#E6E2DC] text-xs font-semibold text-[#17243B] flex items-center justify-between"
                          >
                            <span>{sec}</span>
                            <ExternalLink className="w-3 h-3 text-[#8172A8]" />
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Responsive architecture, live deployment on edge CDN with fast global load times.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItem.previewType === 'linkedin' && (
                <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-6 sm:p-8 shadow-inner">
                  {/* LinkedIn Profile Shell */}
                  <div className="bg-white rounded-xl border border-[#E6E2DC] shadow-md overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-20 bg-gradient-to-r from-[#17243B] to-[#8172A8] relative">
                      <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-full bg-white p-1 border-2 border-white shadow">
                        <div className="w-full h-full rounded-full bg-[#FAF8FC] flex items-center justify-center font-display font-bold text-[#17243B]">
                          ML
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 px-6 pb-6 space-y-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-display font-bold text-xl text-[#17243B]">
                            Maya Lin
                          </h4>
                          <span className="text-[10px] font-mono bg-[#EBF4FA] text-[#0077B5] px-2 py-0.5 rounded font-bold">
                            in
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#17243B] mt-1 leading-snug">
                          {activeItem.previewData.headline}
                        </p>
                        <p className="text-[11px] font-mono text-[#777781] mt-1">
                          {activeItem.previewData.followers}
                        </p>
                      </div>

                      <div className="p-4 bg-[#FAF8FC] rounded-xl border border-[#E6E2DC] text-xs text-[#292D36] italic leading-relaxed">
                        {activeItem.previewData.aboutLead}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] font-mono text-[#0077B5]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Optimized for LinkedIn search discovery & recruiter screening</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

