'use client';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center pt-28 sm:pt-32 pb-16 lg:py-0 overflow-hidden border-b border-white/[0.08]"
    >
      {/* Subtle Hairline Background Grid Overlay */}
      <div className="absolute inset-0 editorial-grid pointer-events-none opacity-20" />

      {/* Vertical Axis Reference Hairline */}
      <div className="hidden lg:block absolute left-[56%] top-0 bottom-0 w-px bg-white/[0.05] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-center py-6 sm:py-10 z-10">
        {/* Main Editorial Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-2 sm:py-4">
          {/* Left Column: Bold Typography & Narrative */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center space-x-2 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-[#9DA3AE] mb-4 sm:mb-6">
              <span className="w-2 h-2 bg-[#9D85FF] shadow-[0_0_8px_#9D85FF] shrink-0" />
              <span className="text-[#E8E2FF] font-semibold">
                BUSINESS TECHNOLOGY · WEB · SOFTWARE · AUTOMATION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-tight leading-[1.08] sm:leading-[1.02] text-[#F8F9FA] uppercase mb-5 sm:mb-8">
              Your business has a next level.{' '}
              <span className="text-motion-flow block mt-1">
                Let&apos;s build the systems to get there.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-2xl text-[#D0D4DC] text-sm sm:text-lg md:text-xl font-normal leading-relaxed mb-6 sm:mb-8 font-sans">
              From your first professional website to a complete online store or a custom business
              application, Hopepitome turns your ideas and everyday challenges into digital
              solutions built around the way you work.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-5 w-full sm:w-auto">
              <a
                href="#contact"
                className="w-full sm:w-auto justify-center px-7 py-3.5 bg-white text-[#07080C] hover:bg-[#9D85FF] hover:text-[#07080C] transition-all duration-200 font-mono text-xs tracking-wider uppercase font-bold flex items-center space-x-2 shadow-lg shadow-white/10 min-h-[44px]"
              >
                <span>Tell Us What You Need</span>
                <span>→</span>
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto justify-center px-6 py-3.5 bg-[#121520] border border-white/25 text-[#F8F9FA] hover:border-[#9D85FF]/80 hover:bg-[#9D85FF]/10 transition-all duration-200 font-mono text-xs tracking-wider uppercase flex items-center space-x-2 backdrop-blur-md min-h-[44px]"
              >
                <span>Explore Our Solutions</span>
                <span className="text-[#9D85FF]">↓</span>
              </a>
            </div>

            {/* Supporting Micro-Statement */}
            <p className="text-[11px] sm:text-xs font-mono tracking-wide text-[#9DA3AE] mb-8 sm:mb-10">
              [ Clear scope. Practical solutions. Transparent project pricing. ]
            </p>

            {/* Three Commercial Pillar Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-6 border-t border-white/[0.14]">
              {/* Pillar 01 */}
              <a
                href="#services"
                className="p-4.5 bg-[#121520]/92 border border-white/[0.14] hover:border-[#9D85FF]/60 hover:bg-[#171B2B]/95 transition-all duration-200 backdrop-blur-md group flex flex-col justify-between shadow-md"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#9D85FF] font-bold block mb-1">01 // WEB & COMMERCE</span>
                  <h3 className="text-sm font-display font-bold uppercase text-[#F8F9FA] group-hover:text-[#E8E2FF] transition-colors mb-1.5">
                    Websites & Stores
                  </h3>
                  <p className="text-xs text-[#D0D4DC] font-sans leading-relaxed">
                    Fast corporate sites, catalogues and online stores designed to make selling easier.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#9DA3AE] group-hover:text-white transition-colors pt-3 flex items-center space-x-1">
                  <span>Explore websites</span>
                  <span>→</span>
                </span>
              </a>

              {/* Pillar 02 */}
              <a
                href="#services"
                className="p-4.5 bg-[#121520]/92 border border-white/[0.14] hover:border-[#9D85FF]/60 hover:bg-[#171B2B]/95 transition-all duration-200 backdrop-blur-md group flex flex-col justify-between shadow-md"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#9D85FF] font-bold block mb-1">02 // SOFTWARE</span>
                  <h3 className="text-sm font-display font-bold uppercase text-[#F8F9FA] group-hover:text-[#E8E2FF] transition-colors mb-1.5">
                    Custom Web Apps
                  </h3>
                  <p className="text-xs text-[#D0D4DC] font-sans leading-relaxed">
                    Client portals, quotation calculators and dashboards tailored to your processes.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#9DA3AE] group-hover:text-white transition-colors pt-3 flex items-center space-x-1">
                  <span>Explore software</span>
                  <span>→</span>
                </span>
              </a>

              {/* Pillar 03 */}
              <a
                href="#services"
                className="p-4.5 bg-[#121520]/92 border border-white/[0.14] hover:border-[#9D85FF]/60 hover:bg-[#171B2B]/95 transition-all duration-200 backdrop-blur-md group flex flex-col justify-between shadow-md"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#9D85FF] font-bold block mb-1">03 // AUTOMATION</span>
                  <h3 className="text-sm font-display font-bold uppercase text-[#F8F9FA] group-hover:text-[#E8E2FF] transition-colors mb-1.5">
                    Connected Systems
                  </h3>
                  <p className="text-xs text-[#D0D4DC] font-sans leading-relaxed">
                    Integrations, CRM setups and workflows that eliminate repetitive manual entries.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#9DA3AE] group-hover:text-white transition-colors pt-3 flex items-center space-x-1">
                  <span>Explore systems</span>
                  <span>→</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Negative Space allowing the 3D Drape to breathe */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pointer-events-none select-none pr-4">
            <div className="space-y-4 text-right">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-white/20 bg-[#121520]/90 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase text-[#D0D4DC] shadow-md">
                <span className="w-2 h-2 bg-[#9D85FF] rounded-full animate-ping shadow-[0_0_8px_#9D85FF]" />
                <span className="font-semibold">3D SPECTRAL FIELD ACTIVE</span>
              </div>
              <p className="text-xs font-mono text-[#9DA3AE] tracking-wide max-w-[220px] leading-relaxed">
                Move pointer to displace fluid wakes · Click to propagate light ripples
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-white/[0.14] text-xs font-mono text-[#9DA3AE] tracking-wider uppercase gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-[#F8F9FA] font-semibold">HOPEPITOME STUDIO</span>
            <span className="text-white/20">•</span>
            <span>COMMERCIAL DIGITAL TOOLS &amp; BUSINESS SYSTEMS</span>
          </div>

          <a
            href="#services"
            className="group flex items-center space-x-2 text-xs hover:text-white transition-colors self-start sm:self-auto font-medium"
            aria-label="Scroll to What We Build"
          >
            <span>DISCOVER WHAT WE BUILD</span>
            <span className="text-[#9D85FF] group-hover:translate-y-0.5 transition-transform font-bold">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
