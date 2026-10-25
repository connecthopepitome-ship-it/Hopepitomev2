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
    <section id="statement" className="relative py-14 sm:py-20 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Index Marker */}
        <div className="flex items-center space-x-3 mb-6 sm:mb-10 text-xs font-mono tracking-widest text-[#9DA3AE] uppercase">
          <span className="text-[#9D85FF] font-bold">02 //</span>
          <span className="text-[#F8F9FA] font-medium">CORE PRINCIPLE</span>
        </div>

        {/* Large Editorial Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start pb-8 sm:pb-14 border-b border-white/[0.14]">
          <div className="lg:col-span-7">
            <h2 className="font-display font-extrabold text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#F8F9FA] uppercase">
              NOT JUST A WEBSITE.
              <br />
              <span className="text-motion-flow mt-1 inline-block">
                A BETTER WAY TO DO BUSINESS.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 lg:border-l lg:border-white/[0.14] lg:pl-10">
            <p className="text-[#F8F9FA] text-sm sm:text-lg leading-relaxed font-sans font-medium">
              Your website, your online store and the software behind your operations should work together.
            </p>
            <p className="text-[#D0D4DC] text-xs sm:text-base leading-relaxed font-sans">
              We help you build the right digital foundation, improve how your business runs and add new
              capabilities as you grow.
            </p>
          </div>
        </div>

        {/* Four Supporting Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-12">
          {principles.map((p) => (
            <div
              key={p.num}
              className="p-5 sm:p-6 bg-[#121520]/92 border border-white/[0.14] backdrop-blur-md flex flex-col justify-between hover:border-[#9D85FF]/50 hover:bg-[#171B2B]/95 transition-all duration-200 shadow-md"
            >
              <div>
                <span className="font-mono text-xs text-[#9D85FF] font-bold block mb-3">
                  {p.num} // PRINCIPLE
                </span>
                <h3 className="text-base font-display font-bold text-[#F8F9FA] mb-2 leading-snug">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs text-[#D0D4DC] font-sans leading-relaxed pt-3 border-t border-white/[0.08]">
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
