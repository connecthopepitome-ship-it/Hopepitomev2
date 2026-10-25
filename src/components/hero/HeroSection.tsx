'use client';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center pt-28 pb-16 lg:py-0 overflow-hidden border-b border-white/[0.08]"
    >
      {/* Subtle Hairline Background Grid Overlay */}
      <div className="absolute inset-0 editorial-grid pointer-events-none opacity-20" />

      {/* Vertical Axis Reference Hairline */}
      <div className="hidden lg:block absolute left-[56%] top-0 bottom-0 w-px bg-white/[0.05] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-center py-12 z-10">
        {/* Main Editorial Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-4">
          {/* Left Column: Bold Typography & Narrative */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center space-x-2.5 text-xs font-mono tracking-widest uppercase text-muted-stone mb-6">
              <span className="w-1.5 h-1.5 bg-[#8B6CFF]" />
              <span className="text-[#E4DBFF]/90 font-medium">
                DIGITAL STUDIO · BUSINESS &amp; CAREER
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] tracking-tight leading-[0.95] text-warm-white uppercase mb-8">
              MAKE YOUR
              <br />
              NEXT MOVE
              <br />
              <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#8B6CFF] bg-clip-text text-transparent">
                MATTER.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-2xl text-stone-light text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-10 font-sans">
              We build websites and business systems for growing businesses, and help people present
              their skills and experience with confidence.
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a
                href="#services"
                className="px-7 py-3.5 bg-white text-graphite-950 hover:bg-[#8B6CFF] hover:text-white transition-all duration-300 font-mono text-xs tracking-wider uppercase font-bold flex items-center space-x-2 shadow-lg shadow-white/5"
              >
                <span>Explore our services</span>
                <span>→</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 border border-white/20 text-warm-white hover:border-[#8B6CFF]/60 hover:bg-[#8B6CFF]/[0.08] transition-all duration-300 font-mono text-xs tracking-wider uppercase flex items-center space-x-2 backdrop-blur-sm"
              >
                <span>Talk to our team</span>
                <span className="text-muted-stone">↓</span>
              </a>
            </div>

            {/* Two Division Access Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08]">
              {/* Division 01: Nexora */}
              <a
                href="#nexora"
                className="p-5 bg-[#101116]/60 border border-white/[0.08] hover:border-[#8B6CFF]/50 transition-all duration-300 backdrop-blur-md group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-stone mb-2">
                  <span className="text-[#8B6CFF] font-semibold">01 // DIGITAL ENGINEERING</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-white">→</span>
                </div>
                <h3 className="text-lg font-display font-bold uppercase text-warm-white group-hover:text-[#E4DBFF] transition-colors mb-1">
                  NEXORA
                </h3>
                <p className="text-xs text-stone-light font-sans leading-relaxed">
                  Websites, online stores and custom business software built around how you operate.
                </p>
              </a>

              {/* Division 02: Elevora */}
              <a
                href="#elevora"
                className="p-5 bg-[#101116]/60 border border-white/[0.08] hover:border-[#E4DBFF]/40 transition-all duration-300 backdrop-blur-md group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-stone mb-2">
                  <span className="text-[#E4DBFF] font-semibold">02 // CAREER BRANDING</span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-white">→</span>
                </div>
                <h3 className="text-lg font-display font-bold uppercase text-warm-white group-hover:text-[#E4DBFF] transition-colors mb-1">
                  ELEVORA
                </h3>
                <p className="text-xs text-stone-light font-sans leading-relaxed">
                  Professional resumes, portfolio sites and positioning for your next opportunity.
                </p>
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
                Move pointer anywhere to displace fluid mesh wakes · Click to propagate light ripples
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-white/[0.08] text-xs font-mono text-muted-stone tracking-wider uppercase gap-3">
          <div className="flex items-center space-x-4">
            <span className="text-warm-white font-medium">TWO COMPLEMENTARY DIVISIONS</span>
            <span>•</span>
            <span>NEXORA (BUSINESS SYSTEMS) &amp; ELEVORA (CAREER BRANDING)</span>
          </div>

          <a
            href="#nexora"
            className="group flex items-center space-x-2 text-[11px] hover:text-warm-white transition-colors self-start sm:self-auto"
            aria-label="Scroll to Nexora"
          >
            <span>CONTINUE EXPLORING</span>
            <span className="text-[#8B6CFF] group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
