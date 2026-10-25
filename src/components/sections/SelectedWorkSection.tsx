'use client';

import { useState } from 'react';

interface ProjectStudy {
  id: string;
  title: string;
  division: 'NEXORA' | 'ELEVORA';
  category: string;
  problemExplored: string;
  proposedSolution: string;
  workflowDesign: string[];
  technologies: string[];
  statusLabel: string;
}

const projects: ProjectStudy[] = [
  {
    id: 'PRJ_01',
    title: 'OPERATIONAL ERP DASHBOARD',
    division: 'NEXORA',
    category: 'CONCEPT & WORKFLOW STUDY',
    statusLabel: 'CONCEPT DEMONSTRATION',
    problemExplored:
      'Small manufacturing and trading businesses frequently track inventory, suppliers, and purchase orders across disconnected spreadsheets, causing stock discrepancies and missed orders.',
    proposedSolution:
      'We prototyped a unified web-based operational dashboard exploring real-time stock levels, automated low-inventory alerts, and a clear 3-step purchase approval workflow.',
    workflowDesign: [
      'Inventory overview showing stock on hand vs. committed orders',
      'Supplier catalog with lead times and historical pricing',
      'One-click purchase order generation with PDF export',
      'Role-based approval permissions for managers',
    ],
    technologies: ['Frappe Framework', 'Next.js UI', 'MariaDB', 'REST Webhooks'],
  },
  {
    id: 'PRJ_02',
    title: 'INTERACTIVE DESIGN PORTFOLIO',
    division: 'ELEVORA',
    category: 'DESIGN & PORTFOLIO STUDY',
    statusLabel: 'DESIGN DEMONSTRATION',
    problemExplored:
      'Template-based portfolio builders often look generic and fail to communicate a designer’s problem-solving process, resulting in missed client and hiring opportunities.',
    proposedSolution:
      'We designed an interactive personal portfolio concept that highlights research sketches, client briefs, and measurable project outcomes within a clean typographic layout.',
    workflowDesign: [
      'Art-directed project case study cards with process galleries',
      'Interactive project timeline explaining the designer’s exact role',
      'Fast-loading mobile layout tested on iOS and Android browsers',
      'Integrated direct contact form with email dispatch',
    ],
    technologies: ['Next.js App Router', 'Tailwind CSS', 'Framer Motion', 'Web Accessibility'],
  },
  {
    id: 'PRJ_03',
    title: 'MODERN STOREFRONT PROTOTYPE',
    division: 'NEXORA',
    category: 'E-COMMERCE PROTOTYPE',
    statusLabel: 'TECHNICAL PROTOTYPE',
    problemExplored:
      'Traditional e-commerce templates are frequently sluggish on mobile devices, with cluttered category pages and multi-step checkouts that cause high cart abandonment.',
    proposedSolution:
      'We created a lightweight storefront prototype demonstrating instant category filtering, streamlined product pages, and a focused 2-step checkout flow.',
    workflowDesign: [
      'Instant search and tag-based catalog filtering',
      'Fast-loading product detail view with clear image zoom',
      'Minimal cart drawer with transparent shipping calculation',
      'Stripe checkout integration architecture with webhook testing',
    ],
    technologies: ['TypeScript', 'Next.js', 'Edge Caching', 'Stripe Integration'],
  },
  {
    id: 'PRJ_04',
    title: 'CAREER ARCHIVE & RESUME BLUEPRINT',
    division: 'ELEVORA',
    category: 'CAREER FRAMEWORK STUDY',
    statusLabel: 'METHODOLOGY DEMONSTRATION',
    problemExplored:
      'Experienced professionals often struggle to fit diverse project histories and leadership roles into a readable resume that passes automated recruiter screening software.',
    proposedSolution:
      'We developed a two-tier career archive framework: an executive 1-page summary highlighting primary competencies, paired with an organized project ledger for detailed technical reviews.',
    workflowDesign: [
      'Executive summary emphasizing measurable career milestones',
      'ATS-compatible document structure using clean, standard headings',
      'Skills taxonomy mapping technical tools to practical business outcomes',
      'Editable Word source file and print-calibrated PDF template',
    ],
    technologies: ['Editorial Typography', 'ATS Formatting Standards', 'Document Architecture'],
  },
];

export function SelectedWorkSection() {
  const [selectedStudy, setSelectedStudy] = useState<ProjectStudy | null>(null);

  return (
    <section id="work" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">05 //</span>
            <span>OUR WORK & PROTOTYPES</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt-blue inline-block" />
            <span>DESIGN & TECHNICAL DEMONSTRATIONS</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-4 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-3">
            PROJECTS, PROTOTYPES AND IDEAS IN PROGRESS
          </h2>
          <p className="text-stone-light text-sm sm:text-base font-sans leading-relaxed">
            These concept projects demonstrate our technical and design approaches. They explore real-world problems and show how we structure software, interfaces, and career documents.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-10">
          {projects.map((proj) => (
            <article
              key={proj.id}
              className="group relative bg-graphite-900 border border-editorial p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
            >
              <div>
                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs font-mono tracking-wider text-muted-stone mb-6">
                  <span className="text-warm-white">{proj.id}</span>
                  <span
                    className={`px-2 py-0.5 border text-[10px] ${
                      proj.division === 'NEXORA'
                        ? 'border-cobalt-blue/40 text-cobalt-blue'
                        : 'border-white/20 text-stone-light'
                    }`}
                  >
                    {proj.division === 'NEXORA' ? 'BUSINESS SOLUTION' : 'CAREER STUDIO'}
                  </span>
                  <span className="text-[10px] uppercase text-muted-stone/80 border border-white/5 px-1.5 py-0.5">
                    {proj.statusLabel}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="font-display font-bold text-xl sm:text-2xl text-warm-white tracking-tight uppercase mb-2 group-hover:text-silver transition-colors">
                  {proj.title}
                </h3>

                <p className="font-mono text-[11px] text-muted-stone tracking-wider uppercase mb-4">
                  {proj.category}
                </p>

                {/* Plain-Language Problem & Solution Summary */}
                <div className="space-y-3 mb-6 text-xs text-stone-light font-sans leading-relaxed">
                  <div>
                    <strong className="text-warm-white block font-medium mb-0.5">The Problem Explored:</strong>
                    <p className="text-muted-stone text-xs">{proj.problemExplored}</p>
                  </div>
                  <div>
                    <strong className="text-warm-white block font-medium mb-0.5">Proposed Approach:</strong>
                    <p className="text-stone-light text-xs">{proj.proposedSolution}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Tags & Functional Interactive Action */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono tracking-wider text-muted-stone uppercase bg-white/[0.03] px-2 py-0.5 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudy(proj)}
                  className="text-xs font-mono text-cobalt-blue hover:text-warm-white transition-colors flex items-center space-x-1"
                >
                  <span>Explore study details</span>
                  <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Clear Notice on Demonstrations */}
        <div className="mt-10 p-4 border border-white/[0.08] bg-white/[0.02] text-xs font-mono text-muted-stone tracking-wide flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>
            [ NOTE: All featured projects represent concept architecture studies and demonstrations created by Hopepitome to showcase practical workflows. ]
          </span>
          <span className="text-warm-white shrink-0">STUDIO PORTFOLIO</span>
        </div>
      </div>

      {/* Interactive Study Details Modal / Drawer */}
      {selectedStudy && (
        <div
          className="fixed inset-0 z-50 bg-graphite-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-graphite-900 border border-white/20 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-editorial pb-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-cobalt-blue mb-1">
                  <span>{selectedStudy.id}</span>
                  <span>//</span>
                  <span>{selectedStudy.division}</span>
                  <span>//</span>
                  <span className="text-stone-light">{selectedStudy.statusLabel}</span>
                </div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-warm-white">
                  {selectedStudy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudy(null)}
                className="p-1.5 text-muted-stone hover:text-warm-white border border-white/10 text-xs font-mono"
                aria-label="Close study details"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Problem */}
            <div>
              <span className="text-xs font-mono tracking-wider uppercase text-cobalt-blue block mb-1">
                01 / THE PROBLEM BEING EXPLORED
              </span>
              <p className="text-stone-light text-sm font-sans leading-relaxed">
                {selectedStudy.problemExplored}
              </p>
            </div>

            {/* Proposed Solution */}
            <div>
              <span className="text-xs font-mono tracking-wider uppercase text-cobalt-blue block mb-1">
                02 / PROPOSED WORKFLOW & SOLUTION
              </span>
              <p className="text-stone-light text-sm font-sans leading-relaxed">
                {selectedStudy.proposedSolution}
              </p>
            </div>

            {/* Key Workflow Features */}
            <div>
              <span className="text-xs font-mono tracking-wider uppercase text-muted-stone block mb-2 font-bold">
                03 / DEMONSTRATION WORKFLOW FEATURES
              </span>
              <ul className="space-y-1.5 text-xs font-sans text-stone-light">
                {selectedStudy.workflowDesign.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-cobalt-blue font-mono">›</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div className="pt-2 border-t border-editorial">
              <span className="text-[10px] font-mono tracking-wider uppercase text-muted-stone block mb-2">
                TOOLS & TECHNOLOGIES DEMONSTRATED:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedStudy.technologies.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono uppercase bg-white/[0.04] px-2.5 py-1 border border-white/10 text-stone-light"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-editorial flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedStudy(null)}
                className="px-4 py-2 border border-white/10 text-xs font-mono uppercase text-muted-stone hover:text-warm-white"
              >
                Close Study
              </button>

              <a
                href="#contact"
                onClick={() => setSelectedStudy(null)}
                className="px-4 py-2 bg-white text-graphite-950 hover:bg-cobalt-blue hover:text-white transition-colors text-xs font-mono uppercase font-bold"
              >
                Discuss a similar project →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
