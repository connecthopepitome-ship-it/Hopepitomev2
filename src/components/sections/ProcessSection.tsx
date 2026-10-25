'use client';

interface ProcessStage {
  num: string;
  stageName: string;
  subtitle: string;
  description: string;
  whatHappens: string;
}

const stages: ProcessStage[] = [
  {
    num: '01',
    stageName: 'TELL US WHAT YOU NEED',
    subtitle: 'INITIAL INTAKE',
    description:
      'You share your goals, target audience, and any existing materials (such as your current website, draft resume, or system requirements).',
    whatHappens: 'Clear understanding of your goals and required deliverables.',
  },
  {
    num: '02',
    stageName: 'AGREE ON THE PLAN',
    subtitle: 'SCOPE & TIMELINE',
    description:
      'We outline exactly what we will deliver, the fixed price or milestone structure, and an estimated schedule so there are no surprises.',
    whatHappens: 'A written plan, agreed scope, and delivery schedule.',
  },
  {
    num: '03',
    stageName: 'WE GET TO WORK',
    subtitle: 'CRAFT & DEVELOPMENT',
    description:
      'We build your website, software, or career documents. We keep you updated and ask questions if we need clarification.',
    whatHappens: 'First-round documents or private staging preview link.',
  },
  {
    num: '04',
    stageName: 'REVIEW & REQUEST CHANGES',
    subtitle: 'FEEDBACK & REVISION',
    description:
      'You review the work and let us know what needs adjusting. We refine the text, design, or functionality within our agreed revision rounds.',
    whatHappens: 'Adjustments made based on your specific feedback.',
  },
  {
    num: '05',
    stageName: 'RECEIVE YOUR FINISHED WORK',
    subtitle: 'HANDOVER & SUPPORT',
    description:
      'We launch your website, deliver your final editable files and PDFs, or deploy your software with documentation on how to use it.',
    whatHappens: 'Live digital system or final polished career files ready to share.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">06 //</span>
            <span>HOW WE WORK</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone">
            A SIMPLE, 5-STAGE COLLABORATION PROCESS
          </div>
        </div>

        {/* Section Heading */}
        <div className="pt-10 pb-8 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-3">
            FROM YOUR FIRST IDEA TO THE FINISHED WORK
          </h2>
          <p className="text-stone-light text-sm sm:text-base font-sans leading-relaxed">
            Every project follows a straightforward path with clear communication, written agreements, and defined review points.
          </p>
        </div>

        {/* Process Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 pt-6">
          {stages.map((step, index) => (
            <div
              key={step.num}
              className="relative p-5 bg-graphite-900 border border-editorial flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
            >
              <div>
                {/* Step Number with Connector */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-cobalt-blue">
                    {step.num}
                  </span>
                  {index < stages.length - 1 && (
                    <span className="hidden md:inline text-muted-stone/40 text-xs font-mono">
                      →
                    </span>
                  )}
                </div>

                {/* Phase Title */}
                <h3 className="font-display font-bold text-base sm:text-lg text-warm-white uppercase tracking-tight mb-1">
                  {step.stageName}
                </h3>

                <p className="font-mono text-[10px] text-muted-stone tracking-wider uppercase mb-3">
                  {step.subtitle}
                </p>

                <p className="text-stone-light text-xs leading-relaxed mb-5 font-sans">
                  {step.description}
                </p>
              </div>

              {/* Output Artifact */}
              <div className="pt-3 border-t border-white/[0.06] text-[10px] font-mono text-muted-stone">
                <span className="text-warm-white block font-medium mb-0.5">OUTCOME:</span>
                <span className="text-stone-light font-sans">{step.whatHappens}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
