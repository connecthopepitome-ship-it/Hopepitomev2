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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-center py-10 z-10">
        {/* Main Editorial Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-4">
          {/* Left Column: Bold Typography & Narrative */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center space-x-2.5 text-xs font-mono tracking-widest uppercase text-muted-stone mb-6">
              <span className="w-1.5 h-1.5 bg-[#8B6CFF]" />
              <span className="text-[#E4DBFF]/90 font-medium">
                BUSINESS TECHNOLOGY · WEB · SOFTWARE · AUTOMATION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[4.6rem] tracking-tight leading-[1.02] text-warm-white uppercase mb-8">
              Your business has a next level.{' '}
              <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#8B6CFF] bg-clip-text text-transparent block mt-1">
                Let&apos;s build the systems to get there.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-2xl text-stone-light text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8 font-sans">
              From your first professional website to a complete online store or a custom business
              application, Hopepitome turns your ideas and everyday challenges into digital
              solutions built around the way you work.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <a
                href="#contact"
                className="px-7 py-3.5 bg-white text-graphite-950 hover:bg-[#8B6CFF] hover:text-[#07080B] transition-all duration-300 font-mono text-xs tracking-wider uppercase font-bold flex items-center space-x-2 shadow-lg shadow-white/5"
              >
                <span>Tell Us What You Need</span>
                <span>→</span>
              </a>

              <a
                href="#services"
                className="px-6 py-3.5 border border-white/20 text-warm-white hover:border-[#8B6CFF]/60 hover:bg-[#8B6CFF]/[0.08] transition-all duration-300 font-mono text-xs tracking-wider uppercase flex items-center space-x-2 backdrop-blur-sm"
              >
                <span>Explore Our Solutions</span>
                <span className="text-[#8B6CFF]">↓</span>
              </a>
            </div>

            {/* Supporting Micro-Statement */}
            <p className="text-xs font-mono tracking-wide text-muted-stone mb-10">
              [ Clear scope. Practical solutions. Transparent project pricing. ]
            </p>

            {/* Three Commercial Pillar Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-white/[0.08]">
              {/* Pillar 01 */}
              <a
                href="#services"
                className="p-4 bg-[#101116]/60 border border-white/[0.08] hover:border-[#8B6CFF]/50 transition-all duration-300 backdrop-blur-md group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#8B6CFF] block mb-1">01 // WEB & COMMERCE</span>
                  <h3 className="text-sm font-display font-bold uppercase text-warm-white group-hover:text-[#E4DBFF] transition-colors mb-1">
                    Websites & Stores
                  </h3>
                  <p className="text-[11px] text-stone-light font-sans leading-relaxed">
                    Fast corporate sites, catalogues and online stores designed to make selling easier.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-stone group-hover:text-white transition-colors pt-3">
                  Explore websites →
                </span>
              </a>

              {/* Pillar 02 */}
              <a
                href="#services"
                className="p-4 bg-[#101116]/60 border border-white/[0.08] hover:border-[#8B6CFF]/50 transition-all duration-300 backdrop-blur-md group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#8B6CFF] block mb-1">02 // SOFTWARE</span>
                  <h3 className="text-sm font-display font-bold uppercase text-warm-white group-hover:text-[#E4DBFF] transition-colors mb-1">
                    Custom Web Apps
                  </h3>
                  <p className="text-[11px] text-stone-light font-sans leading-relaxed">
                    Client portals, quotation calculators and dashboards tailored to your processes.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-stone group-hover:text-white transition-colors pt-3">
                  Explore software →
                </span>
              </a>

              {/* Pillar 03 */}
              <a
                href="#services"
                className="p-4 bg-[#101116]/60 border border-white/[0.08] hover:border-[#8B6CFF]/50 transition-all duration-300 backdrop-blur-md group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#8B6CFF] block mb-1">03 // AUTOMATION</span>
                  <h3 className="text-sm font-display font-bold uppercase text-warm-white group-hover:text-[#E4DBFF] transition-colors mb-1">
                    Connected Systems
                  </h3>
                  <p className="text-[11px] text-stone-light font-sans leading-relaxed">
                    Integrations, CRM setups and workflows that eliminate repetitive manual entries.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-stone group-hover:text-white transition-colors pt-3">
                  Explore automation →
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Negative Space allowing the 3D Drape to breathe */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pointer-events-none select-none pr-4">
            <div className="space-y-4 text-right">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-white/10 bg-[#101116]/60 backdrop-blur-md text-[10px] font-mono tracking-widest uppercase text-stone-light">
                <span className="w-1.5 h-1.5 bg-[#8B6CFF] rounded-full animate-ping" />
                <span>3D SPECTRAL FIELD ACTIVE</span>
              </div>
              <p className="text-xs font-mono text-muted-stone tracking-wide max-w-[220px] leading-relaxed">
                Move pointer to displace live fluid wakes · Click anywhere to propagate light ripples
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-white/[0.08] text-xs font-mono text-muted-stone tracking-wider uppercase gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-warm-white font-medium">HOPEPITOME STUDIO</span>
            <span>•</span>
            <span>COMMERCIAL DIGITAL TOOLS &amp; BUSINESS SYSTEMS</span>
          </div>

          <a
            href="#services"
            className="group flex items-center space-x-2 text-[11px] hover:text-warm-white transition-colors self-start sm:self-auto"
            aria-label="Scroll to What We Build"
          >
            <span>DISCOVER WHAT WE BUILD</span>
            <span className="text-[#8B6CFF] group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
