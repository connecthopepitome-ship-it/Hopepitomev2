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
      'A secure environment to upload design assets, schema diagrams, technical briefs, and resume source files with full version history.',
    status: 'BETA TESTING',
  },
  {
    code: '02',
    title: 'MILESTONE & SPRINT TELEMETRY',
    description:
      'Transparent tracking of project progression through real-time phase gates, staging deployments, and executive review links.',
    status: 'IN DEVELOPMENT',
  },
  {
    code: '03',
    title: 'STRUCTURED REVISION DISPATCH',
    description:
      'Submit pinpoint change requests directly against prototypes or CV drafts with threaded developer and editor commentary.',
    status: 'ARCHITECTURE SPECIFIED',
  },
  {
    code: '04',
    title: 'COMMERCIALS & INVOICE LEDGER',
    description:
      'Transparent access to itemized quotations, phase sign-off milestones, and tax-compliant digital invoices in one central vault.',
    status: 'INTEGRATING GATEWAY',
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
              We are engineering a proprietary client dashboard to give every partner full transparency over their digital deliverables—from initial discovery through post-launch evolution.
            </p>
            <div className="p-4 border border-cobalt-blue/30 bg-cobalt-blue/[0.04] text-xs font-mono text-muted-stone">
              <span className="text-cobalt-blue font-bold block mb-1">
                TRANSPARENCY COMMITMENT:
              </span>
              <span>
                During active onboarding, clients receive private staging links and direct access to their assigned technical director or lead consultant.
              </span>
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
