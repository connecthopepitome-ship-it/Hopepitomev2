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
          <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-muted-stone uppercase">
            <span className="text-[#8B6CFF] font-bold">08 //</span>
            <span className="text-warm-white">ABOUT THE STUDIO</span>
          </div>
          <div className="text-xs font-mono tracking-wider uppercase text-muted-stone flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] inline-block shadow-[0_0_8px_#8B6CFF]" />
            <span>PRACTICAL TECHNOLOGY · THOUGHTFUL EXECUTION</span>
          </div>
        </div>

        {/* Section Headline & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 pb-12 items-start border-b border-white/[0.08]">
          <div className="lg:col-span-6">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-warm-white mb-6 leading-tight">
              PRACTICAL TECHNOLOGY.{' '}
              <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#8B6CFF] bg-clip-text text-transparent block mt-1">
                THOUGHTFUL EXECUTION.
              </span>
            </h2>
            <div className="p-4 bg-[#101116]/40 border border-white/[0.06] text-xs font-mono text-muted-stone">
              <span>HOPEPITOME DIGITAL SOLUTIONS STUDIO</span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-stone-light text-base leading-relaxed font-sans lg:border-l lg:border-white/[0.08] lg:pl-10">
            <p className="text-warm-white font-medium text-lg leading-relaxed">
              Hopepitome is a digital solutions studio focused on helping businesses make better use of
              technology. We bring together website development, ecommerce, custom software, business
              systems and automation to solve real operational needs.
            </p>
            <p>
              Our approach is simple: understand the work, choose the right solution, build with purpose
              and make the result useful for the people who depend on it.
            </p>
            <p className="text-xs font-mono text-muted-stone uppercase tracking-wider pt-2">
              [ HONEST TECH WORK · NO UNVERIFIED CLAIMS · FOCUS ON BUSINESS UTILITY ]
            </p>
          </div>
        </div>

        {/* Studio Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="p-6 bg-[#101116]/60 backdrop-blur-md border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#8B6CFF] uppercase tracking-wider block mb-2 font-bold">
                  {p.label}
                </span>
                <h4 className="font-display font-bold text-base text-warm-white uppercase mb-2">
                  {p.heading}
                </h4>
                <p className="text-xs text-stone-light font-sans leading-relaxed">
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
