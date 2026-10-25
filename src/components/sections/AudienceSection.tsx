'use client';

export function AudienceSection() {
  const audiences = [
    {
      num: '01',
      title: 'Small & Local Businesses',
      need: 'Professional Online Presence',
      description:
        'Established or emerging local services seeking a credible, fast-loading digital storefront that answers client questions and captures qualified enquiries.',
    },
    {
      num: '02',
      title: 'Retailers & Product Sellers',
      need: 'Independent Shopping Websites',
      description:
        'Merchants, wholesalers, and social media sellers who want their own branded online store with direct payment processing, inventory tracking, and full customer ownership.',
    },
    {
      num: '03',
      title: 'Growing Companies',
      need: 'Organized Business Systems',
      description:
        'Businesses outgrowing disconnected spreadsheets and group chats that need a centralized ERP, CRM or workflow database to maintain operational control.',
    },
    {
      num: '04',
      title: 'Service Providers',
      need: 'Bookings & Customer Tracking',
      description:
        'Consultants, clinics, agencies and contractors who require automated scheduling, structured client intake forms, and clear appointment workflows.',
    },
    {
      num: '05',
      title: 'Distributors & Operations',
      need: 'Better Data & Workflows',
      description:
        'Trading and logistics teams needing supplier catalogs, procurement purchase orders, stock on hand vs. committed alerts, and delivery status dashboards.',
    },
    {
      num: '06',
      title: 'Founders & Product Builders',
      need: 'Working First Versions (MVP)',
      description:
        'Entrepreneurs with a validated business concept who need a functional, production-ready web application or prototype without enterprise bloat.',
    },
  ];

  return (
    <section id="clients" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#9DA3AE] uppercase">
            <span className="text-[#9D85FF] font-bold">06 //</span>
            <span className="text-[#F8F9FA] font-medium">WHO WE WORK WITH</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-[#9DA3AE] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#9D85FF] inline-block shadow-[0_0_8px_#9D85FF]" />
            <span>PARTNERS IN PRACTICAL GROWTH</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="pt-10 pb-12 max-w-3xl">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F8F9FA] mb-4">
            BUILT FOR THE PEOPLE BUILDING BUSINESSES.
          </h2>
          <p className="text-[#D0D4DC] text-base leading-relaxed font-sans">
            You do not need to arrive with a technical specification. Tell us what your business does,
            what is difficult today and what you want to improve. We will help identify the most practical
            next step.
          </p>
        </div>

        {/* Six Audiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((aud) => (
            <div
              key={aud.num}
              className="p-6 sm:p-8 bg-[#121520]/95 backdrop-blur-md border border-white/[0.14] hover:border-[#9D85FF]/50 hover:bg-[#171B2B] transition-all duration-300 flex flex-col justify-between group shadow-xl shadow-black/30"
            >
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="text-[#9D85FF] font-bold">{aud.num} //</span>
                  <span className="text-[11px] text-[#E8E2FF] uppercase border border-[#9D85FF]/35 bg-[#9D85FF]/10 px-2.5 py-0.5 rounded font-semibold">
                    {aud.need}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-[#F8F9FA] uppercase tracking-tight mb-3 group-hover:text-[#E8E2FF] transition-colors">
                  {aud.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#D0D4DC] font-sans leading-relaxed">
                  {aud.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08]">
                <a
                  href="#contact"
                  className="text-xs font-mono text-[#9D85FF] hover:text-white transition-colors flex items-center space-x-1.5 font-semibold"
                >
                  <span>Discuss solutions for this need</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AudienceSection;
