'use client';

export function ConnectedBusinessSection() {
  const transformations = [
    {
      step: '01',
      from: 'Enquiries everywhere',
      to: 'One organized pipeline',
      description:
        'Bring incoming customer inquiries from your website, WhatsApp, email and social channels into a structured workflow with clear ownership, status tracking, and follow-up steps.',
    },
    {
      step: '02',
      from: 'Orders managed manually',
      to: 'A connected order process',
      description:
        'Bring product information, incoming customer orders, payment verification and fulfilment updates into a synchronized process that reduces dropped orders and delivery delays.',
    },
    {
      step: '03',
      from: 'Repeated data entry',
      to: 'Automated information flow',
      description:
        'Reduce the need to copy the same customer names, invoice details, and order rows between disconnected software tools. Compatible tools update automatically.',
    },
    {
      step: '04',
      from: 'Business information scattered',
      to: 'A useful dashboard',
      description:
        'Bring selected operational data, pending tasks, inventory alerts and revenue metrics into a single real-time view to support everyday management decisions.',
    },
  ];

  return (
    <section
      id="transformations"
      className="relative py-24 md:py-32 border-b border-editorial overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-[#8B6CFF] font-bold">04 //</span>
            <span className="text-warm-white">PRACTICAL IMPACT</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] inline-block shadow-[0_0_8px_#8B6CFF]" />
            <span>FROM MANUAL WORK TO CONNECTED OPERATIONS</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-12 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-4">
            YOUR BUSINESS DOESN&apos;T NEED MORE COMPLEXITY.
            <br />
            <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#8B6CFF] bg-clip-text text-transparent">
              IT NEEDS THE RIGHT CONNECTIONS.
            </span>
          </h2>
          <p className="text-stone-light text-base leading-relaxed font-sans">
            Many business problems do not start with a lack of software. They start when websites,
            spreadsheets, messages, orders and internal processes operate separately.
          </p>
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {transformations.map((t) => (
            <div
              key={t.step}
              className="p-6 sm:p-8 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08] hover:border-[#8B6CFF]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="text-[#8B6CFF] font-bold">{t.step} // TRANSFORMATION</span>
                  <span className="text-[10px] text-muted-stone uppercase">WORKFLOW UPGRADE</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-xs font-mono text-muted-stone line-through decoration-red-400/60">
                    <span className="text-red-400 font-bold select-none">✕</span>
                    <span>{t.from}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-base sm:text-lg font-display font-bold text-warm-white uppercase tracking-tight">
                    <span className="text-[#8B6CFF] font-mono select-none">→</span>
                    <span className="text-[#E4DBFF]">{t.to}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-light font-sans leading-relaxed pt-2 border-t border-white/[0.06]">
                  {t.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-muted-stone">
                <span>CONNECTIVE ARCHITECTURE</span>
                <span className="text-[#8B6CFF]">PRACTICAL VALUE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout with CTA */}
        <div className="mt-12 p-8 bg-[#101116]/70 border border-white/[0.1] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-mono tracking-widest text-[#8B6CFF] uppercase font-bold block">
              [ OUR PHILOSOPHY ]
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-warm-white">
              We start with the problem, not with a software package.
            </h3>
            <p className="text-xs font-sans text-stone-light leading-relaxed">
              Tell us what is slowing down your team today. We will evaluate whether a website update,
              an integration, or a focused custom tool is the right step.
            </p>
          </div>

          <a
            href="#contact"
            className="px-6 py-3.5 bg-[#8B6CFF] text-[#07080B] hover:bg-white hover:text-[#07080B] transition-colors duration-200 font-mono text-xs uppercase font-bold tracking-wider shrink-0 shadow-lg shadow-[#8B6CFF]/20"
          >
            <span>Tell Us What&apos;s Slowing You Down</span>
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ConnectedBusinessSection;
