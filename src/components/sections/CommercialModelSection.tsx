'use client';

export function CommercialModelSection() {
  const principles = [
    {
      title: 'One-time project pricing',
      description:
        'Pay an agreed project fee for the defined work, rather than being forced to purchase an ongoing development retainer or subscription.',
      badge: 'FIXED-SCOPE CERTAINTY',
    },
    {
      title: 'Scope agreed in advance',
      description:
        'Understand the deliverables, included features, delivery timeline and revision allowance clearly before approving the project.',
      badge: 'CLEAR BOUNDARIES',
    },
    {
      title: 'Built around your budget',
      description:
        'Start with the most useful, lean version of your website or system now, then add enhancements as your customer volume grows.',
      badge: 'PHASED ROADMAPS',
    },
    {
      title: 'Your project, clearly handed over',
      description:
        'We document the delivered work, configuration, administrative access and handover responsibilities. Ownership terms are defined in your agreement.',
      badge: 'TRANSPARENT HANDOVER',
    },
  ];

  const costBreakdown = [
    {
      type: 'ONE-TIME PROJECT FEE',
      scope: 'Hopepitome Studio Design & Development',
      terms: 'Agreed fixed quote covering custom UI design, frontend coding, backend development, integrations, and deployment handover.',
      recurring: 'No monthly fee to Hopepitome for delivered fixed-scope code.',
    },
    {
      type: 'INFRASTRUCTURE & DOMAIN',
      scope: 'Domain Name & Cloud Hosting',
      terms: 'Annual domain renewal (.com / .org) and monthly/annual cloud server or CDN hosting paid directly to providers.',
      recurring: 'Direct provider invoice (typically low for standard business traffic).',
    },
    {
      type: 'COMMERCIAL SERVICES',
      scope: 'Payment Gateways & Third-Party APIs',
      terms: 'Stripe, PayPal, WhatsApp Business APIs, or transactional email services (e.g. SendGrid, Postmark).',
      recurring: 'Per-transaction processing fees or tiered usage directly with providers.',
    },
    {
      type: 'OPTIONAL ASSISTANCE',
      scope: 'Future Upgrades & Support Retainers',
      terms: 'Optional on-demand hourly tasks, milestone feature extensions, or scheduled maintenance agreements if desired.',
      recurring: 'Entirely optional; only contracted if your team specifically requests ongoing support.',
    },
  ];

  return (
    <section id="pricing" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-[#8B6CFF] font-bold">05 //</span>
            <span className="text-warm-white">COMMERCIAL APPROACH</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] inline-block shadow-[0_0_8px_#8B6CFF]" />
            <span>AFFORDABLE, HONEST, TRANSPARENT SCOPING</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-12 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-4 leading-tight">
            PROFESSIONAL DIGITAL SOLUTIONS.
            <br />
            <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#8B6CFF] bg-clip-text text-transparent">
              WITHOUT UNNECESSARY COMMITMENTS.
            </span>
          </h2>
          <p className="text-stone-light text-base leading-relaxed font-sans">
            We believe businesses should know what they are paying for before a project begins. We scope
            each project around its actual requirements, agree on deliverables, and provide a clear quotation
            before development starts.
          </p>
        </div>

        {/* Four Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="p-6 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08] hover:border-[#8B6CFF]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#8B6CFF] tracking-wider uppercase block mb-3 font-semibold">
                  [ {p.badge} ]
                </span>
                <h3 className="font-display font-bold text-lg text-warm-white uppercase mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-light font-sans leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Cost Breakdown Table */}
        <div className="p-8 sm:p-10 bg-[#101116]/70 border border-white/[0.1] backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#8B6CFF] uppercase tracking-wider block font-bold">
                CLARITY ON COSTS
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-warm-white uppercase tracking-tight">
                HOW COSTS ARE STRUCTURED
              </h3>
            </div>
            <div className="text-xs font-mono text-muted-stone">
              <span>PRINCIPLE: NO HIDDEN COMPULSIONS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {costBreakdown.map((item, i) => (
              <div key={i} className="p-4 bg-[#07080B]/60 border border-white/[0.06] space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#E4DBFF] uppercase block">
                    {item.type}
                  </span>
                  <h4 className="text-sm font-display font-bold text-warm-white uppercase mt-1 mb-2">
                    {item.scope}
                  </h4>
                  <p className="text-xs text-stone-light font-sans leading-relaxed">
                    {item.terms}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-[#8B6CFF]">
                  {item.recurring}
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Honesty Notice Banner */}
          <div className="mt-8 p-5 bg-[#07080B]/90 border border-[#8B6CFF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs font-sans text-stone-light leading-relaxed max-w-2xl">
              <strong className="text-warm-white font-mono uppercase block mb-1">
                OUR PROMISE TO BUSINESS OWNERS:
              </strong>
              No compulsory monthly development subscriptions for fixed-scope projects. Any ongoing third-party
              infrastructure fees, domain fees or optional maintenance costs are clearly explained before project approval.
            </p>
            <a
              href="#contact"
              className="px-6 py-3 bg-[#8B6CFF] text-[#07080B] hover:bg-white hover:text-[#07080B] transition-colors font-mono text-xs uppercase font-bold tracking-wider shrink-0"
            >
              Request a Project Quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommercialModelSection;
