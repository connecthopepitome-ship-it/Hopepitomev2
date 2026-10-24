'use client';

import { useState } from 'react';

interface ServiceItem {
  number: string;
  title: string;
  division: 'NEXORA' | 'ELEVORA';
  category: string;
  description: string;
  deliverables: string[];
}

const services: ServiceItem[] = [
  {
    number: '01',
    title: 'BUSINESS WEBSITES & WEB APPS',
    division: 'NEXORA',
    category: 'DIGITAL ENGINEERING',
    description:
      'Architectural websites engineered with Next.js, headless CMS, and ultra-fast edge delivery, tailored for distinguished corporate positioning.',
    deliverables: ['Custom Next.js App', 'Design System', 'Fluid Responsive Layouts', 'Edge CDN Deployment'],
  },
  {
    number: '02',
    title: 'COMMERCE SYSTEMS & CHECKOUTS',
    division: 'NEXORA',
    category: 'HIGH-SCALE COMMERCE',
    description:
      'High-conversion commerce architectures, headless storefronts, custom checkout pipelines, and international payment gateways.',
    deliverables: ['Headless Storefront', 'Inventory Sync', 'Global Payment Gateways', 'Performance Auditing'],
  },
  {
    number: '03',
    title: 'CUSTOM ENTERPRISE SOFTWARE',
    division: 'NEXORA',
    category: 'FULL-STACK SOFTWARE',
    description:
      'Tailored internal tooling, SaaS foundations, distributed microservices, and secure multi-tenant cloud platforms.',
    deliverables: ['Modular Architecture', 'Role-Based Access Control', 'Automated Testing', 'CI/CD Pipelines'],
  },
  {
    number: '04',
    title: 'ERP & BUSINESS SYSTEMS',
    division: 'NEXORA',
    category: 'ENTERPRISE ARCHITECTURE',
    description:
      'Frappe / ERPNext and bespoke ERP implementation, workflow customization, financial ledger integrations, and migration consulting.',
    deliverables: ['Frappe DocType Modeling', 'Server Hooks & APIs', 'Workflow Automation', 'Safe Data Migrations'],
  },
  {
    number: '05',
    title: 'RESUME & CAREER BRANDING',
    division: 'ELEVORA',
    category: 'CAREER ATELIER',
    description:
      'High-impact executive CVs and resumes designed to withstand ATS algorithms while commanding executive attention.',
    deliverables: ['Strategic CV Architecture', 'ATS Optimization', 'Executive Summary', 'Dual-Format Export'],
  },
  {
    number: '06',
    title: 'PERSONAL PORTFOLIOS',
    division: 'ELEVORA',
    category: 'DIGITAL CRAFT',
    description:
      'Signature interactive portfolios for executives, creative directors, founders, and technical architects.',
    deliverables: ['Custom Interaction Design', 'Project Case Studies', 'Dynamic Showcase', 'Fast Worldwide Hosting'],
  },
  {
    number: '07',
    title: 'LINKEDIN & JOB PORTAL MANAGEMENT',
    division: 'ELEVORA',
    category: 'AUTHORITY POSITIONING',
    description:
      'Complete narrative overhaul of your LinkedIn presence, executive bio, and job board positioning for confidential opportunity sourcing.',
    deliverables: ['Headline & About Architecture', 'SEO Keyword Ingestion', 'Network Positioning Guide', 'Portal Audit'],
  },
];

export function ServiceIndexSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="services" className="relative py-28 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">04 //</span>
            <span>SERVICE INDEX</span>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase text-muted-stone">
            NUMBERED CAPABILITIES REGISTER
          </div>
        </div>

        {/* Editorial Numbered List */}
        <div className="divide-y divide-white/[0.08] border-b border-white/[0.08]">
          {services.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={item.number}
                className="group transition-colors duration-200"
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* Main Row */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="w-full py-8 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 focus:outline-none focus-visible:bg-white/[0.02]"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline space-x-6 lg:space-x-12">
                    {/* Index Number */}
                    <span className="font-mono text-sm md:text-base text-muted-stone group-hover:text-cobalt-blue transition-colors">
                      {item.number}
                    </span>

                    {/* Service Name */}
                    <h3 className="font-display font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight text-warm-white group-hover:translate-x-2 transition-transform duration-300">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-6 self-start md:self-auto pl-12 md:pl-0">
                    {/* Division Badge */}
                    <span
                      className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border ${
                        item.division === 'NEXORA'
                          ? 'border-cobalt-blue/40 text-cobalt-blue bg-cobalt-blue/10'
                          : 'border-white/20 text-warm-white bg-white/5'
                      }`}
                    >
                      {item.division}
                    </span>

                    <span className="text-stone-light text-xs font-mono">
                      {isOpen ? '—' : '+'}
                    </span>
                  </div>
                </button>

                {/* Expanded Details */}
                {isOpen && (
                  <div className="pl-12 lg:pl-20 pb-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-sm animate-in fade-in duration-200">
                    <div className="md:col-span-7">
                      <p className="text-stone-light leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <span className="text-xs font-mono text-muted-stone uppercase">
                        CATEGORY: {item.category}
                      </span>
                    </div>

                    <div className="md:col-span-5 md:border-l md:border-white/[0.08] md:pl-8">
                      <span className="tech-label block mb-3">[ CORE DELIVERABLES ]</span>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-stone uppercase">
                        {item.deliverables.map((deliv, i) => (
                          <div key={i} className="flex items-center space-x-1.5">
                            <span className="text-cobalt-blue text-[10px]">■</span>
                            <span className="truncate">{deliv}</span>
                          </div>
                        ))}
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
