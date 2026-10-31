'use client';

import React, { useState } from 'react';
import {
  FileText,
  UserCheck,
  GraduationCap,
  Terminal,
  Globe,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  Info,
} from 'lucide-react';

const showcaseItems = [
  {
    id: 'graduate',
    title: 'Fresh Graduate Resume',
    label: 'Early Career',
    icon: GraduationCap,
    tag: 'Illustrative Concept · Early Career',
    candidate: 'Aria Patel',
    roleTitle: 'Associate Data Analyst',
    summary:
      'Designed to structure academic projects, university coursework, internships, and analytical tool proficiencies into a clear, workforce-ready presentation.',
    highlights: [
      'Degree in Computer Science & Statistics with academic project honors',
      'Capstone project analyzing transactional datasets to identify user patterns',
      'Internship experience building automated SQL and dashboard reports',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'ASSOCIATE DATA ANALYST · STATISTICAL ANALYSIS',
      location: 'Melbourne, Australia · sample.aria@example.com',
      competencies: [
        'Python (Pandas, NumPy)',
        'SQL & Query Design',
        'Tableau & PowerBI',
        'Statistical Modeling',
        'Excel Modeling',
      ],
      sampleBullet:
        'Analyzed customer survey and transactional data during graduate residency, creating interactive dashboard summaries to support quarterly planning.',
    },
    serviceToPreselect: 'Professional Resume Writing',
  },
  {
    id: 'experienced',
    title: 'Experienced Professional Resume',
    label: 'Mid–Senior Level',
    icon: FileText,
    tag: 'Illustrative Concept · Mid–Senior Level',
    candidate: 'Marcus Sterling',
    roleTitle: 'Senior Product Manager',
    summary:
      'Refactored from an unfocused list of daily tasks into an organized narrative highlighting feature ownership, team coordination, and delivery milestones.',
    highlights: [
      'Managed agile product roadmaps for B2B web applications',
      'Collaborated with engineering, design, and marketing across two-week sprints',
      'Rebuilt customer onboarding experience, improving task completion rates',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'SENIOR PRODUCT MANAGER · DIGITAL PLATFORMS',
      location: 'London, UK · sample.marcus@example.com',
      competencies: [
        'Product Roadmapping',
        'User Research & Discovery',
        'Agile Sprint Planning',
        'Cross-Functional Leadership',
        'Feature Prioritisation',
      ],
      sampleBullet:
        'Coordinated development and release of new self-service client portal, partnering with 8 engineers and UX designers to launch on schedule.',
    },
    serviceToPreselect: 'Professional Resume Writing',
  },
  {
    id: 'executive',
    title: 'Executive Resume',
    label: 'Leadership',
    icon: UserCheck,
    tag: 'Illustrative Concept · Leadership Level',
    candidate: 'Elena Vance',
    roleTitle: 'Director of Operations',
    summary:
      'Engineered for senior leadership candidates with 12+ years of management background. Focuses on organizational leadership, operational efficiency, and team growth.',
    highlights: [
      'Led regional operations across 3 regional distribution hubs',
      'Standardized vendor service contracts and procurement processes',
      'Supported transition to unified enterprise ERP workflows across departments',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'DIRECTOR OF OPERATIONS · ENTERPRISE SYSTEMS',
      location: 'Singapore · sample.elena@example.com',
      competencies: [
        'Operations Management',
        'Process Standardisation',
        'ERP Workflow Integration',
        'Vendor Governance',
        'Cross-Department Coordination',
      ],
      sampleBullet:
        'Oversaw operations team restructuring across three business units, introducing standardized performance milestones and regular cross-team reviews.',
    },
    serviceToPreselect: 'Professional Resume Writing',
  },
  {
    id: 'tech',
    title: 'Technical Professional Resume',
    label: 'Engineering & Cloud',
    icon: Terminal,
    tag: 'Illustrative Concept · Technical Level',
    candidate: 'Devon Thorne',
    roleTitle: 'Cloud Solutions Architect',
    summary:
      'Calibrated for technical recruiters and engineering managers. Balances infrastructure proficiencies with systems reliability, security, and cloud cost awareness.',
    highlights: [
      'Architected resilient AWS cloud infrastructure using Terraform',
      'Implemented automated CI/CD deployment pipelines for containerized microservices',
      'Coordinated security reviews and infrastructure audit preparations',
    ],
    previewType: 'resume',
    previewData: {
      headline: 'CLOUD SOLUTIONS ARCHITECT · INFRASTRUCTURE & DEVOPS',
      location: 'Toronto, Canada · sample.devon@example.com',
      competencies: [
        'AWS & Cloudflare Architecture',
        'Kubernetes & Docker',
        'Terraform & Infrastructure as Code',
        'CI/CD Pipelines (GitHub Actions)',
        'Systems Monitoring & Observability',
      ],
      sampleBullet:
        'Led migration of containerized backend workloads to managed cloud infrastructure, setting up automated health monitoring and deployment rollbacks.',
    },
    serviceToPreselect: 'ATS Resume Optimisation',
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio Website',
    label: 'Web Presence',
    icon: Globe,
    tag: 'Illustrative Concept · Personal Website',
    candidate: 'Julian Ross',
    roleTitle: 'Design & Product Portfolio',
    summary:
      'A clean personal website designed to showcase case studies, design system work, professional credentials, and direct contact links on an independent domain.',
    highlights: [
      'Fast-loading responsive layout optimized for mobile and desktop screens',
      'Structured case study overviews with clear problem-and-solution sections',
      'Built-in contact section with lead routing and downloadable resume link',
    ],
    previewType: 'portfolio',
    previewData: {
      headline: 'JULIAN ROSS — PRODUCT DESIGN & SYSTEMS',
      domain: 'sample-julianross.example / work',
      sections: [
        'Selected Project Case Studies',
        'Design System Work Overview',
        'Experience & Credentials',
        'Direct Contact Channel',
      ],
    },
    serviceToPreselect: 'Personal Portfolio Websites',
  },
];

export function CareerShowcaseSection() {
  const [activeTab, setActiveTab] = useState(showcaseItems[0].id);
  const activeItem = showcaseItems.find((item) => item.id === activeTab) || showcaseItems[0];

  const handlePreselect = (serviceName: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-career-service', { detail: { service: serviceName } })
      );
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="showcase" className="py-24 bg-[#F7F5F0] relative border-b border-[#E6E2DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider uppercase bg-[#F2EFF7] text-[#8172A8] border border-[#E6E2DC] mb-3">
            <Sparkles className="w-3 h-3 text-[#8172A8]" />
            SAMPLE SHOWCASE
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#17243B] tracking-tight mb-4">
            See the difference thoughtful presentation makes.
          </h2>
          <p className="text-base sm:text-lg text-[#292D36]/80 leading-relaxed font-sans">
            Review illustrative concept samples across different career levels. We craft each
            document to present experience clearly, accurately, and without unnecessary fluff.
          </p>

          {/* Transparent Illustrative Concept Notice */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-[#E6E2DC] flex items-start space-x-2.5 max-w-2xl text-xs text-[#777781]">
            <Info className="w-4 h-4 text-[#8172A8] shrink-0 mt-0.5" />
            <span>
              <strong>Concept Notice:</strong> The profiles and work samples shown below are
              illustrative concept designs created with fictional identities to protect client
              privacy. They demonstrate formatting, hierarchy, and presentation quality.
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
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
            {/* Left: Sample Context & Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8172A8] font-bold px-2.5 py-1 rounded bg-[#FAF8FC] border border-[#E6E2DC]">
                  {activeItem.tag}
                </span>
                <h3 className="font-display font-bold text-2xl text-[#17243B] pt-2">
                  {activeItem.candidate} — {activeItem.roleTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#777781] leading-relaxed">
                  {activeItem.summary}
                </p>
              </div>

              {/* Sample Presentation Elements */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#777781] font-semibold">
                  Sample Presentation Elements:
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
                <button
                  type="button"
                  onClick={() => handlePreselect(activeItem.serviceToPreselect)}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#17243B] bg-[#FAF8FC] px-5 py-2.5 rounded-full border border-[#E6E2DC] hover:border-[#8172A8] hover:bg-[#F2EFF7] transition-all group"
                >
                  <span>Request Similar Custom Crafting</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Realistic Document Mockup Preview */}
            <div className="lg:col-span-7">
              {activeItem.previewType === 'resume' && (
                <div className="bg-[#FAF8FC] rounded-2xl border border-[#E6E2DC] p-6 sm:p-8 shadow-inner relative">
                  {/* Mock Paper Sheet */}
                  <div className="bg-white rounded-xl border border-[#E6E2DC] p-6 sm:p-8 shadow-md space-y-5">
                    {/* Sheet Header */}
                    <div className="border-b border-[#E6E2DC] pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-widest text-[#8172A8] uppercase font-bold">
                          {activeItem.previewData.headline}
                        </span>
                        <span className="text-[9px] font-mono text-[#777781] bg-[#FAF8FC] px-2 py-0.5 rounded border border-[#E6E2DC]">
                          Illustrative Sample
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-2xl text-[#17243B] tracking-tight mt-1">
                        {activeItem.candidate}
                      </h4>
                      <p className="text-xs text-[#777781] font-mono mt-0.5">
                        {activeItem.previewData.location}
                      </p>
                    </div>

                    {/* Competencies Matrix */}
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#777781] font-semibold mb-2">
                        Core Competencies & Tools
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

                    {/* Experience Detail */}
                    <div className="space-y-2 pt-2 border-t border-[#E6E2DC]/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#17243B]">
                          Experience & Contribution Example
                        </span>
                        <span className="text-[11px] font-mono text-[#777781]">
                          SAMPLE TIMELINE
                        </span>
                      </div>
                      <div className="bg-[#F7F5F0]/60 p-3.5 rounded-lg border border-[#E6E2DC] text-xs text-[#292D36] leading-relaxed">
                        • {activeItem.previewData.sampleBullet}
                      </div>
                    </div>

                    {/* Verification watermark */}
                    <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#777781]">
                      <span>Clean typography & ATS-compatible structure</span>
                      <span>Format: Editable DOCX & Print PDF</span>
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
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-[#8172A8] font-bold uppercase tracking-wider">
                          Illustrative Portfolio Design
                        </span>
                        <h4 className="font-display font-extrabold text-xl sm:text-2xl text-[#17243B]">
                          {activeItem.previewData.headline}
                        </h4>
                        <p className="text-xs text-[#777781]">
                          Showcasing case studies, product work, and professional background.
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
                        <span>Responsive layout with clear typography, project galleries, and contact section.</span>
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
