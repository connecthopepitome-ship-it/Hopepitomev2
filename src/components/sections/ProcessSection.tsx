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
    <section id="process" className="relative py-14 sm:py-20 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 sm:pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#9DA3AE] uppercase">
            <span className="text-[#9D85FF] font-bold">07 //</span>
            <span className="text-[#F8F9FA] font-medium">HOW WE WORK</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-[#9DA3AE] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#9D85FF] inline-block shadow-[0_0_8px_#9D85FF]" />
            <span>FOUR-STAGE CLEAR COLLABORATION</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="pt-8 sm:pt-10 pb-6 sm:pb-8 max-w-3xl">
          <h2 className="font-display font-extrabold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F8F9FA] mb-3">
            A CLEAR PROCESS{' '}
            <span className="text-dual-accent inline-block">
              FROM IDEA TO LAUNCH.
            </span>
          </h2>
          <p className="text-[#D0D4DC] text-sm sm:text-base font-sans leading-relaxed">
            Every project follows a straightforward path with defined checkpoints, written agreements,
            and complete transparency from first conversation to deployment.
          </p>
        </div>

        {/* Process Sequence Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 pt-4 sm:pt-6">
          {stages.map((step, index) => (
            <div
              key={step.num}
              className="relative p-5 sm:p-6 bg-[#121520]/95 backdrop-blur-md border border-white/[0.14] flex flex-col justify-between group hover:border-[#9D85FF]/50 hover:bg-[#171B2B] transition-all duration-300 shadow-xl shadow-black/30"
            >
              <div>
                {/* Step Number with Connector */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#9D85FF]">
                    {step.num}
                  </span>
                  {index < stages.length - 1 && (
                    <span className="hidden md:inline text-white/30 text-xs font-mono">
                      →
                    </span>
                  )}
                </div>

                {/* Phase Title */}
                <h3 className="font-display font-bold text-base sm:text-lg text-[#F8F9FA] uppercase tracking-tight mb-1">
                  {step.stageName}
                </h3>

                <p className="font-mono text-[11px] text-[#9D85FF] tracking-wider uppercase mb-2.5 sm:mb-3 font-semibold">
                  {step.subtitle}
                </p>

                <p className="text-[#D0D4DC] text-xs leading-relaxed mb-5 sm:mb-6 font-sans">
                  {step.description}
                </p>
              </div>

              {/* Output Artifact */}
              <div className="pt-3 border-t border-white/[0.1] text-xs font-mono">
                <span className="text-[#E8E2FF] block font-semibold mb-1 text-[11px]">OUTPUT:</span>
                <span className="text-[#D0D4DC] font-sans text-xs">{step.deliverable}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Process Statement */}
        <div className="mt-8 p-4 border border-white/[0.14] bg-[#121520]/80 backdrop-blur-sm text-xs font-mono text-[#D0D4DC] tracking-wide flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <span>
            [ Need more later? A well-planned solution can be extended in stages where its architecture and platform allow. ]
          </span>
          <span className="text-[#F8F9FA] font-semibold shrink-0">SCALABLE FOUNDATION</span>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
