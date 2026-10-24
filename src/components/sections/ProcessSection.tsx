'use client';

interface Step {
  num: string;
  phase: string;
  subtitle: string;
  description: string;
  output: string;
}

const steps: Step[] = [
  {
    num: '01',
    phase: 'DISCOVER',
    subtitle: 'IMMERSION & AUDIT',
    description:
      'We conduct deep-dive technical consultations or career diagnostics to establish existing constraints, performance bottlenecks, and core strategic goals.',
    output: 'System Audit / Profile Diagnostic Report',
  },
  {
    num: '02',
    phase: 'DEFINE',
    subtitle: 'BLUEPRINT & ARCHITECTURE',
    description:
      'We map the technical architecture, data entities, integration points, or career narrative framework before writing a single line of code or prose.',
    output: 'Technical Specification & Wireframe Blueprint',
  },
  {
    num: '03',
    phase: 'BUILD',
    subtitle: 'PRECISION CRAFT',
    description:
      'Engineered in disciplined sprints: clean, production-grade Next.js/Frappe code for Nexora; bespoke typographic layout and ATS calibration for Elevora.',
    output: 'Functional Software Core / First-Pass Documents',
  },
  {
    num: '04',
    phase: 'REFINE',
    subtitle: 'QUALITY GATE & AUDIT',
    description:
      'Rigorous automated regression testing, security review, responsiveness testing, and executive critique loops ensure no defects reach deployment.',
    output: 'Verification Matrix & Client Review Sandbox',
  },
  {
    num: '05',
    phase: 'DELIVER',
    subtitle: 'DEPLOY & SUSTAIN',
    description:
      'Zero-downtime production deployment, complete documentation handover, and structured revision support as your project enters the real world.',
    output: 'Live Cloud System / Final Polished Assets',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="relative py-28 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-cobalt-blue font-bold">06 //</span>
            <span>HOW WE WORK</span>
          </div>
          <div className="text-xs font-mono tracking-widest uppercase text-muted-stone">
            A FIVE-STAGE DISCIPLINED METHODOLOGY
          </div>
        </div>

        {/* Process Sequence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-16">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="relative p-6 bg-graphite-900 border border-editorial flex flex-col justify-between group hover:border-white/20 transition-all duration-300"
            >
              <div>
                {/* Step Number with Connector */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-extrabold text-cobalt-blue">
                    {step.num}
                  </span>
                  {index < steps.length - 1 && (
                    <span className="hidden md:inline text-muted-stone/40 text-xs font-mono">
                      →
                    </span>
                  )}
                </div>

                {/* Phase Title */}
                <h3 className="font-display font-extrabold text-xl text-warm-white uppercase tracking-tight mb-2">
                  {step.phase}
                </h3>

                <p className="font-mono text-[10px] text-muted-stone tracking-widest uppercase mb-4">
                  {step.subtitle}
                </p>

                <p className="text-stone-light text-xs leading-relaxed mb-6 font-sans">
                  {step.description}
                </p>
              </div>

              {/* Output Artifact */}
              <div className="pt-4 border-t border-white/[0.06] text-[10px] font-mono text-muted-stone">
                <span className="text-warm-white block font-semibold mb-0.5">DELIVERABLE:</span>
                <span>{step.output}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
