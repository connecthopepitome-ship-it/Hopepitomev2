'use client';

interface PortalFeature {
  code: string;
  title: string;
  description: string;
  status: string;
}

const portalFeatures: PortalFeature[] = [
  {
    code: '01',
    title: 'REQUIREMENTS & SPECIFICATIONS INTAKE',
    description:
      'A structured environment to upload technical briefs, architecture diagrams, brand guidelines, and resume drafts with full version history.',
    status: 'IN ARCHITECTURE',
  },
  {
    code: '02',
    title: 'MILESTONE & SPRINT TELEMETRY',
    description:
      'Clear visibility into project progression, phase milestones, private staging preview URLs, and review schedules.',
    status: 'ROADMAP // PLANNED',
  },
  {
    code: '03',
    title: 'STRUCTURED REVISION DISPATCH',
    description:
      'Centralized tracking for feedback, change requests, and scope adjustments with threaded responses from the engineering lead.',
    status: 'IN ARCHITECTURE',
  },
  {
    code: '04',
    title: 'COMMERCIALS & INVOICE LEDGER',
    description:
      'Direct access to itemized project quotations, agreed deliverables, milestone sign-offs, and numbered payment records.',
    status: 'ROADMAP // PLANNED',
  },
];

export function ClientPortalSection() {
  return (
    <section id="portal" className="relative py-28 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">07 //</span>
            <span>CLIENT PROJECT PORTAL</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-muted-stone">
            <span className="w-1.5 h-1.5 bg-cobalt-blue animate-pulse inline-block" />
            <span>COMMUNICATED WORKFLOW & ROADMAP</span>
          </div>
        </div>

        {/* Overview Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 items-start">
          <div className="lg:col-span-5">
            <span className="tech-label">[ UNIFIED CLIENT EXPERIENCE ]</span>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-warm-white tracking-tight uppercase mt-4 mb-6">
              THE HOPEPITOME
              <br />
              PROJECT PORTAL
            </h3>
            <p className="text-stone-light text-base leading-relaxed mb-6 font-sans">
              We are architecting a centralized client portal to provide clients with structured visibility over their deliverables, technical milestones, and revision histories. This portal is currently in active development.
            </p>
            <div className="p-4 border border-cobalt-blue/30 bg-cobalt-blue/[0.04] text-xs font-mono text-muted-stone space-y-2">
              <span className="text-cobalt-blue font-bold block uppercase tracking-wider">
                CURRENT CLIENT COLLABORATION MODEL:
              </span>
              <p className="text-stone-light text-xs font-sans leading-relaxed">
                During active engagements, partners receive private staging URLs, direct access to the technical lead or portfolio strategist, and scheduled walkthrough sessions. Portal accounts will be provisioned directly upon module launch.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {portalFeatures.map((feat) => (
              <div
                key={feat.code}
                className="p-6 bg-graphite-900 border border-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 text-xs font-mono">
                    <span className="text-cobalt-blue font-bold">{feat.code}</span>
                    <span className="text-[10px] text-muted-stone px-2 py-0.5 border border-white/10 uppercase">
                      {feat.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-base text-warm-white uppercase tracking-tight mb-2">
                    {feat.title}
                  </h4>
                  <p className="text-stone-light text-xs leading-relaxed font-sans">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
