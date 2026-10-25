'use client';

interface PortalFeature {
  code: string;
  title: string;
  description: string;
  status: 'In development' | 'Planned' | 'Available';
}

const portalFeatures: PortalFeature[] = [
  {
    code: '01',
    title: 'SEND YOUR REQUIREMENTS',
    description:
      'A structured place to share your project brief, brand files, diagrams, or existing resume documents directly with our team.',
    status: 'In development',
  },
  {
    code: '02',
    title: 'TRACK PROJECT PROGRESS',
    description:
      'Clear visibility into what phase your project is in, upcoming milestones, and private staging preview links.',
    status: 'Planned',
  },
  {
    code: '03',
    title: 'REQUEST CHANGES',
    description:
      'A simple way to submit specific feedback, adjustments, and review notes on drafts without messy email threads.',
    status: 'In development',
  },
  {
    code: '04',
    title: 'ACCESS YOUR FILES',
    description:
      'Download your final website code archives, design assets, editable resume files, and print-ready PDFs at any time.',
    status: 'Planned',
  },
  {
    code: '05',
    title: 'REVIEW QUOTATIONS AND INVOICES',
    description:
      'Access your itemized project estimates, agreed deliverables, payment receipts, and balance records in one place.',
    status: 'Planned',
  },
];

export function ClientPortalSection() {
  return (
    <section id="portal" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">07 //</span>
            <span>CLIENT PORTAL ROADMAP</span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-muted-stone">
            <span className="w-1.5 h-1.5 bg-cobalt-blue rounded-full inline-block animate-pulse" />
            <span>IN ACTIVE DEVELOPMENT</span>
          </div>
        </div>

        {/* Overview Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 items-start">
          <div className="lg:col-span-5">
            <span className="text-[10px] font-mono tracking-wider text-muted-stone uppercase block mb-2 font-bold">
              [ FUTURE CLIENT EXPERIENCE ]
            </span>
            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-warm-white tracking-tight uppercase mb-4">
              YOUR PROJECT,
              <br />
              WITHOUT THE GUESSWORK.
            </h3>
            <p className="text-stone-light text-sm sm:text-base leading-relaxed mb-6 font-sans">
              We are developing a central place for clients to submit requirements, follow project updates, request changes and access their project documents.
            </p>

            <div className="p-4 border border-cobalt-blue/30 bg-cobalt-blue/[0.04] text-xs font-mono text-muted-stone space-y-2">
              <span className="text-cobalt-blue font-bold block uppercase tracking-wider">
                HOW WE CURRENTLY WORK WITH CLIENTS:
              </span>
              <p className="text-stone-light text-xs font-sans leading-relaxed">
                While this portal is being built, all active clients receive private staging URLs, email/WhatsApp updates, and direct access to our team. Client portal accounts will be introduced once security testing is complete.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {portalFeatures.map((feat) => (
              <div
                key={feat.code}
                className="p-5 bg-graphite-900 border border-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="text-cobalt-blue font-bold">{feat.code}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 border uppercase ${
                        feat.status === 'In development'
                          ? 'border-cobalt-blue/40 text-cobalt-blue bg-cobalt-blue/10'
                          : 'border-white/10 text-muted-stone'
                      }`}
                    >
                      {feat.status}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-warm-white uppercase tracking-tight mb-2">
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
