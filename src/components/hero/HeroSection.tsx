'use client';

import { SpectralDrape, j, J } from '@/components/ui/spectral-drape';

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center pt-24 pb-16 lg:py-0 overflow-hidden border-b border-editorial bg-graphite-950"
    >
      {/* Editorial Hairline Background Grid */}
      <div className="absolute inset-0 editorial-grid pointer-events-none opacity-30" />

      {/* Atmospheric Spectral Ambience */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#6A4BFF]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[350px] h-[350px] bg-cobalt-blue/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Vertical Axis Reference Line */}
      <div className="hidden lg:block absolute left-[52%] top-0 bottom-0 w-px bg-white/[0.06] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between py-10">
        {/* Top Header Label */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-muted-stone pt-2">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-[#6A4BFF] animate-pulse inline-block" />
            <span>HOPEPITOME // DIGITAL STUDIO</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <span className="text-white/40">SYSTEM STATUS:</span>
            <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              SPECTRAL 3D ACTIVE
            </span>
          </div>
        </div>

        {/* Main Asymmetric Grid Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6">
          {/* Left Column: Grid-Aligned Editorial Typography */}
          <div className="lg:col-span-6 z-10 flex flex-col justify-center">
            {/* Small Identifier Pill */}
            <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-muted-stone mb-5">
              <span className="w-1.5 h-1.5 bg-[#E4DBFF]" />
              <span className="text-[#E4DBFF]/90 font-medium">
                ENGINEERED DIGITAL SYSTEMS & CAREER BRANDING
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.96] text-warm-white uppercase mb-6">
              GOOD IDEAS
              <br />
              DESERVE TO WORK
              <br />
              <span className="bg-gradient-to-r from-white via-[#E4DBFF] to-[#6A4BFF] bg-clip-text text-transparent">
                IN THE REAL WORLD.
              </span>
            </h1>

            {/* Clear, Customer-Centric Supporting Copy */}
            <p className="max-w-xl text-stone-light text-base sm:text-lg font-normal leading-relaxed mb-8 font-sans">
              We design and engineer bespoke web platforms, e-commerce systems, and custom software
              for ambitious businesses — while helping professionals articulate their skills with
              distinctive portfolio presence.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#contact"
                className="px-7 py-3.5 bg-white text-graphite-950 hover:bg-[#6A4BFF] hover:text-white transition-all duration-300 font-mono text-xs tracking-wider uppercase font-bold flex items-center space-x-2 shadow-lg shadow-white/5"
              >
                <span>Tell us what you need</span>
                <span>→</span>
              </a>

              <a
                href="#services"
                className="px-6 py-3.5 border border-white/20 text-warm-white hover:border-[#6A4BFF]/60 hover:bg-[#6A4BFF]/[0.08] transition-all duration-300 font-mono text-xs tracking-wider uppercase flex items-center space-x-2"
              >
                <span>Explore our services</span>
                <span className="text-muted-stone">↓</span>
              </a>
            </div>

            {/* Two Clear Division Routes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-editorial">
              {/* Route 1: Nexora */}
              <div className="p-4 bg-graphite-900/70 border border-white/[0.08] hover:border-[#6A4BFF]/50 transition-all duration-300 backdrop-blur-sm group">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#E4DBFF] mb-1">
                  <span>01 // FOR BUSINESSES</span>
                  <span className="font-bold text-[#6A4BFF] group-hover:text-white transition-colors">
                    NEXORA
                  </span>
                </div>
                <p className="text-xs text-stone-light font-sans mb-3 leading-relaxed">
                  Websites, e-commerce, custom ERP/CRM tools, and software built around how you
                  operate.
                </p>
                <a
                  href="#nexora"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-warm-white hover:text-[#E4DBFF] transition-colors font-semibold"
                >
                  <span>Explore business services</span>
                  <span>→</span>
                </a>
              </div>

              {/* Route 2: Elevora */}
              <div className="p-4 bg-graphite-900/70 border border-white/[0.08] hover:border-[#E4DBFF]/40 transition-all duration-300 backdrop-blur-sm group">
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-light mb-1">
                  <span>02 // FOR INDIVIDUALS</span>
                  <span className="font-bold text-white group-hover:text-[#E4DBFF] transition-colors">
                    ELEVORA
                  </span>
                </div>
                <p className="text-xs text-stone-light font-sans mb-3 leading-relaxed">
                  Executive resumes, portfolio websites, and personal positioning for your next
                  career chapter.
                </p>
                <a
                  href="#elevora"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-warm-white hover:text-[#E4DBFF] transition-colors font-semibold"
                >
                  <span>Explore career services</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Redesigned Spectral Drape Centerpiece */}
          <div className="lg:col-span-6 relative w-full h-[440px] sm:h-[520px] lg:h-[620px] flex items-center justify-center">
            {/* Architectural Frame Container */}
            <div className="relative w-full h-full border border-white/[0.12] bg-gradient-to-b from-graphite-900/80 to-graphite-950/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/80 flex flex-col justify-between">
              {/* Corner Precision Markers */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-white/30 pointer-events-none select-none z-20">
                +
              </div>
              <div className="absolute top-2 right-2 text-[10px] font-mono text-white/30 pointer-events-none select-none z-20">
                +
              </div>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/30 pointer-events-none select-none z-20">
                +
              </div>
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/30 pointer-events-none select-none z-20">
                +
              </div>

              {/* Top Frame Status Bar */}
              <div className="relative z-20 px-4 py-3 border-b border-white/[0.08] bg-graphite-950/40 backdrop-blur-sm flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-muted-stone pointer-events-none select-none">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#6A4BFF] inline-block" />
                  <span className="text-warm-white font-semibold">SPECTRAL DRAPE</span>
                  <span className="text-white/20">/</span>
                  <span className="text-stone-light">3D GLOWING MESH</span>
                </div>
                <div className="hidden sm:flex items-center space-x-3 text-white/40">
                  <span>RES // 44K PTS</span>
                </div>
              </div>

              {/* Spectral Drape Component Instance (<j /> / <SpectralDrape />) */}
              <div className="relative flex-1 w-full h-full">
                <SpectralDrape className="h-full w-full cursor-crosshair" />
              </div>

              {/* Bottom Interactive Telemetry Bar */}
              <div className="relative z-20 px-4 py-3 border-t border-white/[0.08] bg-graphite-950/50 backdrop-blur-sm flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-muted-stone pointer-events-none select-none">
                <div className="flex items-center space-x-2 text-stone-light">
                  <span className="text-[#E4DBFF]">✦</span>
                  <span>MOVE CURSOR TO BRUSH WAKE // CLICK FOR RIPPLE</span>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-white/40">
                  <span>SPECTRAL FIELD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-editorial text-xs font-mono text-muted-stone tracking-wider uppercase gap-3">
          <div className="flex items-center space-x-4">
            <span className="text-warm-white font-medium">TWO COMPLEMENTARY DIVISIONS</span>
            <span>•</span>
            <span>NEXORA (BUSINESS SYSTEMS) & ELEVORA (CAREER BRANDING)</span>
          </div>

          <a
            href="#statement"
            className="group flex items-center space-x-2 text-[11px] hover:text-warm-white transition-colors self-start sm:self-auto"
            aria-label="Scroll to Studio Statement"
          >
            <span>LEARN ABOUT OUR APPROACH</span>
            <span className="text-[#E4DBFF] group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
