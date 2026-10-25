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
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#9DA3AE] uppercase">
            <span className="text-[#9D85FF] font-bold">04 //</span>
            <span className="text-[#F8F9FA] font-medium">PRACTICAL IMPACT</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-[#9DA3AE] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#9D85FF] inline-block shadow-[0_0_8px_#9D85FF]" />
            <span>FROM MANUAL WORK TO CONNECTED OPERATIONS</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-12 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F8F9FA] mb-4">
            YOUR BUSINESS DOESN&apos;T NEED MORE COMPLEXITY.
            <br />
            <span className="text-dual-accent mt-1 inline-block">
              IT NEEDS THE RIGHT CONNECTIONS.
            </span>
          </h2>
          <p className="text-[#D0D4DC] text-base leading-relaxed font-sans">
            Many business problems do not start with a lack of software. They start when websites,
            spreadsheets, messages, orders and internal processes operate separately.
          </p>
        </div>

        {/* Transformations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {transformations.map((t) => (
            <div
              key={t.step}
              className="p-6 sm:p-8 bg-[#121520]/95 backdrop-blur-md border border-white/[0.14] hover:border-[#9D85FF]/50 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/30"
            >
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="text-[#9D85FF] font-bold">{t.step} // TRANSFORMATION</span>
                  <span className="text-[11px] text-[#9DA3AE] uppercase font-semibold">WORKFLOW UPGRADE</span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="px-3 py-2 bg-red-950/30 border border-red-500/35 rounded flex items-center space-x-2.5 text-xs font-mono text-red-200">
                    <span className="text-red-400 font-bold select-none text-sm">✕</span>
                    <span className="line-through decoration-red-400/80">{t.from}</span>
                  </div>
                  <div className="px-3.5 py-2.5 bg-[#9D85FF]/10 border border-[#9D85FF]/35 rounded flex items-center space-x-2.5 text-base sm:text-lg font-display font-bold text-[#F8F9FA] uppercase tracking-tight">
                    <span className="text-[#9D85FF] font-mono select-none font-bold">→</span>
                    <span className="text-[#E8E2FF]">{t.to}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#D0D4DC] font-sans leading-relaxed pt-3 border-t border-white/[0.1]">
                  {t.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-[#9DA3AE]">
                <span>CONNECTIVE ARCHITECTURE</span>
                <span className="text-[#9D85FF] font-bold">PRACTICAL VALUE</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Callout with CTA */}
        <div className="mt-12 p-8 bg-[#121520]/95 border border-white/[0.16] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-mono tracking-widest text-[#9D85FF] uppercase font-bold block">
              [ OUR PHILOSOPHY ]
            </span>
            <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight text-[#F8F9FA]">
              We start with the problem, not with a software package.
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#D0D4DC] leading-relaxed">
              Tell us what is slowing down your team today. We will evaluate whether a website update,
              an integration, or a focused custom tool is the right step.
            </p>
          </div>

          <a
            href="#contact"
            className="px-6 py-3.5 bg-[#9D85FF] text-[#07080C] hover:bg-white hover:text-[#07080C] transition-colors duration-200 font-mono text-xs uppercase font-bold tracking-wider shrink-0 shadow-lg shadow-[#9D85FF]/25"
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
