'use client';

import { useState, useEffect } from 'react';

export interface ServiceDetail {
  number: string;
  id: string;
  title: string;
  division: 'NEXORA' | 'ELEVORA';
  category: string;
  targetCustomer: string;
  scopeOverview: string;
  deliverables: string[];
  process: { step: string; label: string; desc: string }[];
  quotationPath: string;
}

export const studioServices: ServiceDetail[] = [
  {
    number: '01',
    id: 'business-websites',
    title: 'BUSINESS WEBSITE DEVELOPMENT',
    division: 'NEXORA',
    category: 'DIGITAL ENGINEERING',
    targetCustomer:
      'Growing enterprises, B2B firms, professional consultancies, and technology ventures seeking distinguished brand authority and lightning-fast web performance.',
    scopeOverview:
      'Full-lifecycle development of bespoke marketing websites and corporate web properties engineered with Next.js App Router, responsive design systems, headless content architecture, and global edge delivery.',
    deliverables: [
      'Tailored Next.js / React application codebase',
      'Accessible, token-driven custom CSS design system',
      'Headless CMS or Markdown content structure',
      'SEO schema, OpenGraph, and sitemap generation',
      'Edge CDN routing with global SSL deployment',
      'Zero-downtime deployment pipeline configuration',
    ],
    process: [
      { step: '01', label: 'ARCHITECTURE SPEC', desc: 'Sitemap structuring, technical stack selection, and responsive layout blueprints.' },
      { step: '02', label: 'SPRINT DEVELOPMENT', desc: 'Modular component engineering, typography hierarchy, and content integration.' },
      { step: '03', label: 'PERFORMANCE AUDIT', desc: 'Core Web Vitals calibration, cross-device testing, and production deployment.' },
    ],
    quotationPath:
      'Scoped on structural requirements: page quantity, interactive component complexity, content authoring needs, and third-party integration points. Custom fixed-price quote provided following technical intake.',
  },
  {
    number: '02',
    id: 'ecommerce-stores',
    title: 'E-COMMERCE & ONLINE STORES',
    division: 'NEXORA',
    category: 'COMMERCE ARCHITECTURE',
    targetCustomer:
      'Direct-to-consumer brands, specialty retailers, and B2B distributors demanding frictionless checkout experiences and dependable inventory synchronization.',
    scopeOverview:
      'Engineering headless storefronts and modern online stores featuring modular checkout flows, multi-currency payment gateway integrations, catalog management, and automated order webhooks.',
    deliverables: [
      'Headless storefront with ultra-fast catalog navigation',
      'Integrated checkout via Stripe, PayPal, or regional gateways',
      'Inventory, variant, and pricing synchronization engine',
      'Automated customer transaction emails & webhook receipts',
      'Cart recovery and abandoned session architecture',
      'Administrative order and inventory management view',
    ],
    process: [
      { step: '01', label: 'CATALOG MODELING', desc: 'SKU structure, currency configurations, and payment provider verification.' },
      { step: '02', label: 'STOREFRONT CRAFT', desc: 'Product showcase UX, cart state engine, and checkout pipeline implementation.' },
      { step: '03', label: 'PAYMENT INTEGRATION', desc: 'End-to-end sandbox transaction testing, tax rules, and webhook audit.' },
    ],
    quotationPath:
      'Evaluated by catalog scale, variant matrix, payment processor choices, ERP/warehouse hooks, and custom checkout requirements.',
  },
  {
    number: '03',
    id: 'custom-software',
    title: 'CUSTOM SOFTWARE DEVELOPMENT',
    division: 'NEXORA',
    category: 'FULL-STACK SYSTEMS',
    targetCustomer:
      'Mid-market organizations, startups, and operational teams outgrowing off-the-shelf SaaS and needing proprietary internal tools or customer-facing platforms.',
    scopeOverview:
      'End-to-end architecture and implementation of scalable web applications, API services, database layers, and operational portals built with clean code and strict separation of concerns.',
    deliverables: [
      'Modular full-stack repository (Node.js / Python / TypeScript)',
      'Relational schema design (PostgreSQL / SQLite / MariaDB)',
      'Secure REST or GraphQL API with token-based authentication',
      'Role-based access control (RBAC) and audit logging',
      'Comprehensive test suites (unit, integration, and API tests)',
      'Infrastructure as Code / Dockerized deployment configs',
    ],
    process: [
      { step: '01', label: 'SYSTEM BLUEPRINT', desc: 'Domain entity modeling, data relationship maps, and API interface contracts.' },
      { step: '02', label: 'SPRINT EXECUTION', desc: 'Iterative backend and frontend development with continuous staging previews.' },
      { step: '03', label: 'VERIFICATION GATE', desc: 'Automated test execution, security review, and staged production rollout.' },
    ],
    quotationPath:
      'Defined by feature specifications, data entity complexity, user permission tiers, and external system integrations. Delivered with milestone-based commercial terms.',
  },
  {
    number: '04',
    id: 'erp-consulting',
    title: 'ERP IMPLEMENTATION & CONSULTING',
    division: 'NEXORA',
    category: 'ENTERPRISE ARCHITECTURE',
    targetCustomer:
      'Manufacturers, trading companies, professional services firms, and growing operations seeking Frappe / ERPNext implementation or custom business system upgrades.',
    scopeOverview:
      'Specialized engineering in Frappe Framework and ERPNext. Custom DocType development, workflow state machines, server hooks, financial ledger integrations, and safe database migration scripts.',
    deliverables: [
      'Custom Frappe application or ERPNext configuration',
      'Specialized DocTypes, Child Tables, and relational fields',
      'Server-side validation scripts, hooks, and whitelisted APIs',
      'Form event handlers and curated list views',
      'Safe migration patches and upgrade-compatible architecture',
      'Admin documentation and administrator workflow training',
    ],
    process: [
      { step: '01', label: 'PROCESS AUDIT', desc: 'Detailed business process mapping from quotation to ledger accounting.' },
      { step: '02', label: 'DOCTYPE MODELING', desc: 'Schema creation, permission configuration, and custom script development.' },
      { step: '03', label: 'MIGRATION & GO-LIVE', desc: 'Data sanitization, staging verification, parallel testing, and production cutover.' },
    ],
    quotationPath:
      'Priced according to business process scope, module selection (Sales, Buying, Stock, Accounts, HR), custom DocType count, and legacy data migration complexity.',
  },
  {
    number: '05',
    id: 'crm-automation',
    title: 'CRM & WORKFLOW AUTOMATION',
    division: 'NEXORA',
    category: 'BUSINESS AUTOMATION',
    targetCustomer:
      'Sales teams, account managers, and service providers losing pipeline velocity due to fragmented communication and manual lead entry.',
    scopeOverview:
      'Centralized customer relationship management pipelines, lead capture webhooks, automated customer follow-up sequences, and synchronized communications across your operational stack.',
    deliverables: [
      'Custom lead pipeline with stage progression rules',
      'Automated enquiry capture from web forms and landing pages',
      'Notification triggers via transactional email or WhatsApp API',
      'Customer communication timeline and notes repository',
      'Executive pipeline metrics and conversion rate reports',
      'Data hygiene and duplicate prevention protocols',
    ],
    process: [
      { step: '01', label: 'FUNNEL DIAGNOSTIC', desc: 'Review existing lead intake, sales friction points, and customer touchpoints.' },
      { step: '02', label: 'PIPELINE SETUP', desc: 'Custom pipeline stages, field requirements, and automated routing rules.' },
      { step: '03', label: 'AUTOMATION TESTING', desc: 'Trigger verification, webhook resiliency testing, and handover.' },
    ],
    quotationPath:
      'Scoped based on lead volume, integration endpoints, required communication channels, and automated workflow logic complexity.',
  },
  {
    number: '06',
    id: 'resume-cv-creation',
    title: 'EXECUTIVE RESUME & CV CREATION',
    division: 'ELEVORA',
    category: 'CAREER ATELIER',
    targetCustomer:
      'C-suite leaders, senior technology architects, functional directors, and ambitious professionals targeting competitive international appointments.',
    scopeOverview:
      'Strategic career repositioning and complete editorial restructuring of your CV. Engineered to navigate Applicant Tracking Systems (ATS) while commanding immediate executive credibility among hiring committees.',
    deliverables: [
      'Comprehensive 1-to-1 strategic career diagnostic intake',
      'Bespoke executive CV engineered in ATS-parsed formats',
      'Value proposition distillation and leadership impact metrics',
      'Targeted 1-page executive summary / executive bio',
      'Editable master source files (Word / Docs) and print-ready PDF',
      'Revision rounds within standard review period',
    ],
    process: [
      { step: '01', label: 'DIAGNOSTIC INTAKE', desc: 'Deep dive into career trajectory, key achievements, and target role criteria.' },
      { step: '02', label: 'NARRATIVE SYNTHESIS', desc: 'Drafting high-impact executive prose with verified ATS keyword calibration.' },
      { step: '03', label: 'POLISH & FINALIZATION', desc: 'Collaborative review cycle, typography alignment, and multi-format delivery.' },
    ],
    quotationPath:
      'Tiered by career seniority (Senior Specialist, Management/Director, C-Suite / Executive Advisory) and breadth of career history.',
  },
  {
    number: '07',
    id: 'personal-portfolios',
    title: 'PERSONAL PORTFOLIO WEBSITES',
    division: 'ELEVORA',
    category: 'DIGITAL CRAFT',
    targetCustomer:
      'Creative directors, software architects, design leaders, consultants, and founders who need a distinctive personal brand that stands out from boilerplate templates.',
    scopeOverview:
      'Bespoke personal web monographs featuring artful typographic layouts, interactive project case studies, and fast worldwide hosting to present your accomplishments with prestige.',
    deliverables: [
      'Custom personal website built with modern front-end standards',
      'Art-directed case study modules and project archives',
      'Executive bio, press mentions, and thought leadership sections',
      'Custom domain configuration and edge deployment',
      'Direct contact / inquiry dispatch integration',
      'Mobile-optimized responsive layouts',
    ],
    process: [
      { step: '01', label: 'ARCHIVE CURATION', desc: 'Selecting hallmark projects, extracting impact metrics, and defining visual tone.' },
      { step: '02', label: 'ATELIER CODING', desc: 'Crafting responsive layouts, refined micro-interactions, and fast media loading.' },
      { step: '03', label: 'DOMAIN LAUNCH', desc: 'Testing across mobile/desktop, SSL installation, and live domain cutover.' },
    ],
    quotationPath:
      'Determined by case study depth, custom visual assets, interactive media needs, and domain setup requirements.',
  },
  {
    number: '08',
    id: 'linkedin-optimization',
    title: 'LINKEDIN PROFILE OPTIMIZATION',
    division: 'ELEVORA',
    category: 'AUTHORITY POSITIONING',
    targetCustomer:
      'Executives, consultants, and industry practitioners seeking inbound board, advisory, or high-tier leadership opportunities through strategic LinkedIn positioning.',
    scopeOverview:
      'Total narrative overhaul of your LinkedIn presence. From an attention-commanding headline and compelling narrative About section to strategic keyword integration and network engagement guidelines.',
    deliverables: [
      'Strategic headline crafted for executive search discoverability',
      'Compelling first-person narrative About / Summary section',
      'Restructured experience entries highlighting quantifiable outcomes',
      'Featured section curation (articles, case studies, media)',
      'Custom branded executive banner graphic',
      'LinkedIn algorithm best-practices & outreach guide',
    ],
    process: [
      { step: '01', label: 'PROFILE AUDIT', desc: 'Analysis of current search visibility, narrative gaps, and competitor benchmarking.' },
      { step: '02', label: 'NARRATIVE REWRITE', desc: 'Composing executive headline, bio, and achievement bullets.' },
      { step: '03', label: 'PROFILE IMPLEMENTATION', desc: 'Guidance or direct implementation, banner delivery, and rollout review.' },
    ],
    quotationPath:
      'Available as an independent strategic engagement or bundled with an executive resume package.',
  },
  {
    number: '09',
    id: 'job-portal-management',
    title: 'JOB PORTAL & CAREER PRESENCE',
    division: 'ELEVORA',
    category: 'CAREER STRATEGY',
    targetCustomer:
      'Senior professionals actively conducting confidential searches who require consistent, polished representation across premier career portals.',
    scopeOverview:
      'Comprehensive calibration of your digital career profiles across leading regional and global platforms (e.g. Indeed, Glassdoor, industry associations, executive talent networks), ensuring consistent positioning.',
    deliverables: [
      'Cross-platform narrative consistency audit',
      'Standardized bio and achievement profiles formatted per portal',
      'Targeted keyword alignment matching specific job descriptions',
      'Confidential application guidance and outreach templates',
      'Profile setup checklists and tracking ledger',
    ],
    process: [
      { step: '01', label: 'PORTAL SELECTION', desc: 'Identify premier portals and industry directories relevant to target roles.' },
      { step: '02', label: 'ASSET CALIBRATION', desc: 'Format descriptions, metadata tags, and credentials for each platform.' },
      { step: '03', label: 'SANITY AUDIT', desc: 'Verify cross-portal consistency and search discoverability.' },
    ],
    quotationPath:
      'Based on the number of target portals and depth of custom tailoring required per industry discipline.',
  },
];

export function ServiceIndexSection() {
  const [filter, setFilter] = useState<'ALL' | 'NEXORA' | 'ELEVORA'>('ALL');
  const [activeId, setActiveId] = useState<string | null>('business-websites');

  const filteredServices = studioServices.filter(
    (s) => filter === 'ALL' || s.division === filter
  );

  const handleInquire = (service: ServiceDetail) => {
    // Dispatch custom event so the enquiry form picks it up
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('hopepitome-select-service', {
          detail: {
            division: service.division,
            serviceTitle: service.title,
          },
        })
      );
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="services" className="relative py-28 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-editorial gap-6">
          <div>
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase mb-3">
              <span className="text-cobalt-blue font-bold">04 //</span>
              <span>SERVICE DISCOVERY REGISTER</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-warm-white uppercase">
              COMPREHENSIVE CAPABILITIES
            </h2>
          </div>

          {/* Division Filter Pills */}
          <div className="flex items-center space-x-2 text-xs font-mono tracking-wider">
            {(['ALL', 'NEXORA', 'ELEVORA'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 uppercase transition-all border ${
                  filter === tab
                    ? 'border-cobalt-blue bg-cobalt-blue/15 text-warm-white font-bold'
                    : 'border-white/10 text-muted-stone hover:text-warm-white hover:border-white/25'
                }`}
              >
                {tab === 'ALL' ? 'ALL SERVICES (09)' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Numbered Interactive Accordion */}
        <div className="divide-y divide-white/[0.08] border-b border-white/[0.08]">
          {filteredServices.map((item) => {
            const isOpen = activeId === item.id;
            return (
              <div
                key={item.id}
                className={`group transition-colors duration-200 ${
                  isOpen ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                }`}
              >
                {/* Header Row */}
                <button
                  type="button"
                  onClick={() => setActiveId(isOpen ? null : item.id)}
                  className="w-full py-7 px-2 sm:px-4 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 focus:outline-none focus-visible:bg-white/[0.03]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline space-x-6 lg:space-x-10">
                    <span className="font-mono text-sm md:text-base text-muted-stone group-hover:text-cobalt-blue transition-colors shrink-0">
                      {item.number}
                    </span>

                    <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-warm-white group-hover:text-silver transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 self-start md:self-auto pl-12 md:pl-0">
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border ${
                        item.division === 'NEXORA'
                          ? 'border-cobalt-blue/40 text-cobalt-blue bg-cobalt-blue/10'
                          : 'border-white/20 text-stone-light bg-white/5'
                      }`}
                    >
                      {item.division}
                    </span>

                    <span className="text-stone-light text-xs font-mono w-4 text-center">
                      {isOpen ? '—' : '+'}
                    </span>
                  </div>
                </button>

                {/* Expanded Full Drawer */}
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-10 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-8 text-sm animate-in fade-in duration-200">
                    {/* Left: Overview, Target Customer & Process */}
                    <div className="lg:col-span-7 space-y-6">
                      <div>
                        <span className="tech-label block mb-2">[ TARGET AUDIENCE ]</span>
                        <p className="text-warm-white font-sans text-sm leading-relaxed">
                          {item.targetCustomer}
                        </p>
                      </div>

                      <div>
                        <span className="tech-label block mb-2">[ SCOPE OVERVIEW ]</span>
                        <p className="text-stone-light font-sans text-sm leading-relaxed">
                          {item.scopeOverview}
                        </p>
                      </div>

                      <div>
                        <span className="tech-label block mb-3">[ EXECUTION PROCESS ]</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {item.process.map((p) => (
                            <div
                              key={p.step}
                              className="p-3 bg-graphite-900 border border-editorial text-xs"
                            >
                              <div className="font-mono text-[10px] text-cobalt-blue mb-1">
                                STAGE {p.step} // {p.label}
                              </div>
                              <p className="text-muted-stone text-[11px] leading-snug">
                                {p.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Deliverables, Quotation Path & Direct CTA */}
                    <div className="lg:col-span-5 lg:border-l lg:border-white/[0.08] lg:pl-8 flex flex-col justify-between space-y-6">
                      <div>
                        <span className="tech-label block mb-3">[ CONCRETE DELIVERABLES ]</span>
                        <ul className="space-y-2 text-xs font-mono text-muted-stone uppercase">
                          {item.deliverables.map((deliv, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-cobalt-blue text-[10px] mt-0.5">■</span>
                              <span className="text-stone-light normal-case font-sans text-xs">
                                {deliv}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-white/[0.02] border border-white/[0.08] space-y-2">
                        <span className="text-[10px] font-mono text-warm-white uppercase tracking-wider block">
                          QUOTATION & SCOPING PATH
                        </span>
                        <p className="text-xs text-muted-stone font-sans leading-relaxed">
                          {item.quotationPath}
                        </p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => handleInquire(item)}
                          className="w-full py-3 px-4 bg-white text-graphite-950 hover:bg-cobalt-blue hover:text-white transition-colors duration-200 font-mono text-xs tracking-widest uppercase font-bold flex items-center justify-center space-x-2"
                        >
                          <span>INQUIRE FOR {item.title}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
