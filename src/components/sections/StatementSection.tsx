'use client';

export function StatementSection() {
  const principles = [
    {
      num: '01',
      title: 'Start with a real business need.',
      desc: 'We focus on the actual operational friction you face, rather than building features for the sake of technology.',
    },
    {
      num: '02',
      title: 'Build what is useful now.',
      desc: 'Deliver a lean, high-impact version that solves immediate needs first, keeping initial project costs reasonable.',
    },
    {
      num: '03',
      title: 'Connect what you already use.',
      desc: 'We build systems that integrate with your existing email, spreadsheets, payments and messaging channels.',
    },
    {
      num: '04',
      title: 'Expand when your business is ready.',
      desc: 'Clean architecture ensures you can scale and add capabilities gradually as customer volume grows.',
    },
  ];

  return (
    <section id="statement" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Index Marker */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono tracking-widest text-muted-stone uppercase">
          <span className="text-[#8B6CFF] font-bold">02 //</span>
          <span className="text-warm-white">CORE PRINCIPLE</span>
        </div>

        {/* Large Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-14 border-b border-white/[0.08]">
          <div className="lg:col-span-7">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-warm-white uppercase">
              NOT JUST A WEBSITE.
              <br />
              <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#8B6CFF] bg-clip-text text-transparent">
                A BETTER WAY TO DO BUSINESS.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 lg:border-l lg:border-white/[0.08] lg:pl-10">
            <p className="text-warm-white text-base sm:text-lg leading-relaxed font-sans">
              Your website, your online store and the software behind your operations should work together.
            </p>
            <p className="text-stone-light text-sm sm:text-base leading-relaxed font-sans">
              We help you build the right digital foundation, improve how your business runs and add new
              capabilities as you grow.
            </p>
          </div>
        </div>

        {/* Four Supporting Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {principles.map((p) => (
            <div
              key={p.num}
              className="p-5 bg-[#101116]/60 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between hover:border-[#8B6CFF]/40 transition-colors"
            >
              <div>
                <span className="font-mono text-xs text-[#8B6CFF] font-bold block mb-3">
                  {p.num} // PRINCIPLE
                </span>
                <h3 className="text-base font-display font-bold text-warm-white mb-2 leading-snug">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs text-stone-light font-sans leading-relaxed pt-2">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatementSection;
