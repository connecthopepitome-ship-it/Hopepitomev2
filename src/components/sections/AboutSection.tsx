'use client';

export function AboutSection() {
  const pillars = [
    {
      label: '01 / UNDERSTAND THE WORK',
      heading: 'Business Context First',
      text: 'We listen to how your team operates day-to-day before discussing code, frameworks or platforms.',
    },
    {
      label: '02 / CHOOSE THE RIGHT SOLUTION',
      heading: 'Pragmatic Engineering',
      text: 'We select the leanest, most reliable tool for your budget — whether an efficient website, an integration, or custom software.',
    },
    {
      label: '03 / BUILD WITH PURPOSE',
      heading: 'Maintainable & Clean',
      text: 'We build fast, secure systems that are documented, easy to maintain, and ready to hand over to your team.',
    },
    {
      label: '04 / FOCUS ON THE USER',
      heading: 'Accessible Daily Usability',
      text: 'We ensure interfaces are intuitive for non-technical staff and clear for customers across mobile and desktop.',
    },
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 border-b border-editorial overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-10 border-b border-editorial gap-4">
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#9DA3AE] uppercase">
            <span className="text-[#9D85FF] font-bold">08 //</span>
            <span className="text-[#F8F9FA] font-medium">ABOUT THE STUDIO</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-[#9DA3AE] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#9D85FF] inline-block shadow-[0_0_8px_#9D85FF]" />
            <span>PRACTICAL TECHNOLOGY · THOUGHTFUL EXECUTION</span>
          </div>
        </div>

        {/* Section Headline & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 pb-12 items-start border-b border-white/[0.14]">
          <div className="lg:col-span-6">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#F8F9FA] mb-6 leading-tight">
              PRACTICAL TECHNOLOGY.{' '}
              <span className="text-dual-accent block mt-1">
                THOUGHTFUL EXECUTION.
              </span>
            </h2>
            <div className="p-4 bg-[#090B10] border border-white/[0.14] text-xs font-mono text-[#D0D4DC] shadow-inner">
              <span className="font-semibold text-[#9D85FF]">HOPEPITOME</span>
              <span className="text-[#9DA3AE]"> // DIGITAL SOLUTIONS STUDIO</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-[#D0D4DC] text-base leading-relaxed font-sans lg:border-l lg:border-white/[0.14] lg:pl-10">
            <p className="text-[#F8F9FA] font-medium text-lg leading-relaxed">
              Hopepitome is a digital solutions studio focused on helping businesses make better use of
              technology. We bring together website development, ecommerce, custom software, business
              systems and automation to solve real operational needs.
            </p>
            <p>
              Our approach is simple: understand the work, choose the right solution, build with purpose
              and make the result useful for the people who depend on it.
            </p>
            <p className="text-xs font-mono text-[#9D85FF] uppercase tracking-wider pt-2 font-semibold">
              [ HONEST TECH WORK · NO UNVERIFIED CLAIMS · FOCUS ON BUSINESS UTILITY ]
            </p>
          </div>
        </div>

        {/* Studio Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="p-6 bg-[#121520]/95 backdrop-blur-md border border-white/[0.14] flex flex-col justify-between hover:border-[#9D85FF]/50 hover:bg-[#171B2B] transition-all duration-300 shadow-xl shadow-black/30"
            >
              <div>
                <span className="text-[11px] font-mono text-[#9D85FF] uppercase tracking-wider block mb-2 font-bold">
                  {p.label}
                </span>
                <h4 className="font-display font-bold text-base text-[#F8F9FA] uppercase mb-2">
                  {p.heading}
                </h4>
                <p className="text-xs sm:text-sm text-[#D0D4DC] font-sans leading-relaxed">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
