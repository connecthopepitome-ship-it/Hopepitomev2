'use client';

interface Project {
  id: string;
  title: string;
  division: 'NEXORA' | 'ELEVORA';
  category: string;
  year: string;
  brief: string;
  tags: string[];
}

const projects: Project[] = [
  {
    id: 'PRJ_01',
    title: 'KINETIC ERP CORE',
    division: 'NEXORA',
    category: 'ENTERPRISE SYSTEM',
    year: '2026',
    brief:
      'A modular ERP system interface featuring real-time telemetry, automated supplier procurement engines, and ledger reconciliations.',
    tags: ['Frappe Core', 'React', 'MariaDB', 'REST Webhooks'],
  },
  {
    id: 'PRJ_02',
    title: 'AURA ATELIER',
    division: 'ELEVORA',
    category: 'EXECUTIVE MONOGRAPH',
    year: '2026',
    brief:
      'Digital career archive and bespoke interactive monograph engineered for a global industrial design director.',
    tags: ['Next.js App', 'WebGL Monolith', 'Curatorial Typography', 'ATS Portfolio'],
  },
  {
    id: 'PRJ_03',
    title: 'HYPERION COMMERCE',
    division: 'NEXORA',
    category: 'HEADLESS COMMERCE',
    year: '2026',
    brief:
      'High-throughput headless commerce storefront with sub-50ms edge rendering and dynamic inventory state synchronization.',
    tags: ['TypeScript', 'Edge Runtime', 'Tailwind', 'Stripe Connect'],
  },
  {
    id: 'PRJ_04',
    title: 'MONOLITH RESUME ARCHIVE',
    division: 'ELEVORA',
    category: 'CAREER ARCHITECTURE',
    year: '2026',
    brief:
      'Comprehensive executive CV rewrite and confidential leadership profile strategy for a Principal Systems Architect.',
    tags: ['Executive Strategy', 'ATS Parsing Benchmark', 'LinkedIn Authority'],
  },
];

export function SelectedWorkSection() {
  return (
    <section id="work" className="relative py-28 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">05 //</span>
            <span>SELECTED WORK</span>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt-blue inline-block" />
            <span>CONCEPT PROTOTYPES & LAB STUDIES</span>
          </div>
        </div>

        {/* Art-Directed Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-16">
          {projects.map((proj) => (
            <article
              key={proj.id}
              className="group relative bg-graphite-900 border border-editorial p-8 sm:p-10 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
            >
              <div>
                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs font-mono tracking-widest text-muted-stone mb-8">
                  <span className="text-warm-white">{proj.id}</span>
                  <span
                    className={`px-2 py-0.5 border text-[10px] ${
                      proj.division === 'NEXORA'
                        ? 'border-cobalt-blue/40 text-cobalt-blue'
                        : 'border-white/20 text-stone-light'
                    }`}
                  >
                    {proj.division}
                  </span>
                  <span>{proj.year}</span>
                </div>

                {/* Project Title */}
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-warm-white tracking-tight uppercase mb-4 group-hover:text-silver transition-colors">
                  {proj.title}
                </h3>

                <p className="font-mono text-xs text-muted-stone tracking-widest uppercase mb-6">
                  {proj.category}
                </p>

                <p className="text-stone-light text-sm leading-relaxed mb-8 font-sans">
                  {proj.brief}
                </p>
              </div>

              {/* Bottom Tags & Indicator */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {proj.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono tracking-wider text-muted-stone uppercase bg-white/[0.03] px-2 py-1 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span className="text-xs font-mono text-cobalt-blue group-hover:translate-x-1 transition-transform">
                  EXPLORE STUDY →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Note on Authenticity */}
        <div className="mt-12 p-4 border border-white/[0.06] bg-white/[0.01] text-xs font-mono text-muted-stone tracking-wide flex items-center justify-between">
          <span>
            [ ETHICAL NOTICE: All shown work represents studio lab prototypes and architected concept models. ]
          </span>
          <span className="hidden sm:inline text-warm-white">STUDIO ARCHIVE // 2026</span>
        </div>
      </div>
    </section>
  );
}
