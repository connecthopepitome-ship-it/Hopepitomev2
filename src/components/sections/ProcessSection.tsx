'use client';

interface ProcessStage {
  num: string;
  stageName: string;
  subtitle: string;
  description: string;
  deliverable: string;
}

const stages: ProcessStage[] = [
  {
    num: '01',
    stageName: 'UNDERSTAND',
    subtitle: 'DISCOVERY & CONTEXT',
    description:
      'We learn how your business works, who will use the solution, your existing operational tools, and what outcome matters most.',
    deliverable: 'Clear assessment of your business goals and practical constraints.',
  },
  {
    num: '02',
    stageName: 'DEFINE',
    subtitle: 'SCOPE & QUOTATION',
    description:
      'We agree on the features, deliverables, budget, timeline and project boundaries before development begins. No hidden assumptions.',
    deliverable: 'Written scope document, fixed milestone pricing, and agreed schedule.',
  },
  {
    num: '03',
    stageName: 'BUILD & REVIEW',
    subtitle: 'DEVELOPMENT & TESTING',
    description:
      'We design and develop the solution, share progress at agreed staging checkpoints, and test the important customer and admin user journeys.',
    deliverable: 'Private staging link, functional test walkthrough, and refinement rounds.',
  },
  {
    num: '04',
    stageName: 'LAUNCH & HANDOVER',
    subtitle: 'DEPLOYMENT & TRAINING',
    description:
      'We deploy the approved solution, explain how to use it, and hand over the agreed project assets, administrative credentials and code access.',
    deliverable: 'Live production release, training walkthrough, and documentation.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-[#8B6CFF] font-bold">07 //</span>
            <span className="text-warm-white">HOW WE WORK</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] inline-block shadow-[0_0_8px_#8B6CFF]" />
            <span>FOUR-STAGE CLEAR COLLABORATION</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="pt-10 pb-8 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-3">
            A CLEAR PROCESS FROM IDEA TO LAUNCH.
          </h2>
          <p className="text-stone-light text-base font-sans leading-relaxed">
            Every project follows a straightforward path with defined checkpoints, written agreements,
            and complete transparency from first conversation to deployment.
          </p>
        </div>

        {/* Process Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pt-6">
          {stages.map((step, index) => (
            <div
              key={step.num}
              className="relative p-6 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08] flex flex-col justify-between group hover:border-[#8B6CFF]/40 transition-all duration-300"
            >
              <div>
                {/* Step Number with Connector */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-[#8B6CFF]">
                    {step.num}
                  </span>
                  {index < stages.length - 1 && (
                    <span className="hidden md:inline text-muted-stone/40 text-xs font-mono">
                      →
                    </span>
                  )}
                </div>

                {/* Phase Title */}
                <h3 className="font-display font-bold text-lg text-warm-white uppercase tracking-tight mb-1">
                  {step.stageName}
                </h3>

                <p className="font-mono text-[10px] text-muted-stone tracking-wider uppercase mb-3">
                  {step.subtitle}
                </p>

                <p className="text-stone-light text-xs leading-relaxed mb-6 font-sans">
                  {step.description}
                </p>
              </div>

              {/* Output Artifact */}
              <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-muted-stone">
                <span className="text-[#E4DBFF] block font-medium mb-1">OUTPUT:</span>
                <span className="text-stone-light font-sans">{step.deliverable}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Process Statement */}
        <div className="mt-8 p-4 border border-white/[0.08] bg-[#101116]/40 backdrop-blur-sm text-xs font-mono text-muted-stone tracking-wide flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span>
            [ Need more later? A well-planned solution can be extended in stages where its architecture and platform allow. ]
          </span>
          <span className="text-warm-white shrink-0">SCALABLE FOUNDATION</span>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
