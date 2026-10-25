'use client';

import { StudioSculpture } from '../3d/StudioSculpture';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center pt-24 pb-16 lg:py-0 overflow-hidden border-b border-editorial">
      {/* Editorial Hairline Background Grid */}
      <div className="absolute inset-0 editorial-grid pointer-events-none opacity-40" />

      {/* Vertical Axis Reference Line */}
      <div className="hidden lg:block absolute left-[54%] top-0 bottom-0 w-px bg-white/[0.06] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between py-10">
        {/* Top Header Label */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-muted-stone pt-2">
          <div className="flex items-center space-x-3">
            <span className="w-1.5 h-1.5 bg-cobalt-blue inline-block" />
            <span>HOPEPITOME // DIGITAL STUDIO</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <span>BUSINESS SOFTWARE & CAREER BRANDING</span>
          </div>
        </div>

        {/* Main Asymmetric Grid Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto py-6">
          {/* Left Column: Grid-Aligned Editorial Typography */}
          <div className="lg:col-span-7 z-10 flex flex-col justify-center">
            {/* Small Identifier */}
            <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-wider uppercase text-muted-stone mb-5">
              <span className="text-cobalt-blue font-bold">●</span>
              <span>PRACTICAL DIGITAL SOLUTIONS & CAREER PROFILES</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.96] text-warm-white uppercase mb-6">
              GOOD IDEAS
              <br />
              DESERVE TO WORK
              <br />
              <span className="text-silver">IN THE REAL WORLD.</span>
            </h1>

            {/* Clear, Customer-Centric Supporting Copy */}
            <p className="max-w-xl text-stone-light text-base sm:text-lg font-normal leading-relaxed mb-8 font-sans">
              We build websites and business software, and help people present their skills, experience and ambitions with confidence.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#contact"
                className="px-6 py-3.5 bg-white text-graphite-950 hover:bg-cobalt-blue hover:text-white transition-colors duration-200 font-mono text-xs tracking-wider uppercase font-bold flex items-center space-x-2"
              >
                <span>Tell us what you need</span>
                <span>→</span>
              </a>

              <a
                href="#services"
                className="px-6 py-3.5 border border-white/20 text-warm-white hover:border-white/40 hover:bg-white/[0.04] transition-all duration-200 font-mono text-xs tracking-wider uppercase flex items-center space-x-2"
              >
                <span>Explore our services</span>
                <span className="text-muted-stone">↓</span>
              </a>
            </div>

            {/* Two Clear Division Routes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-editorial">
              {/* Route 1: Nexora */}
              <div className="p-4 bg-graphite-900/60 border border-editorial hover:border-cobalt-blue/40 transition-colors">
                <div className="flex items-center justify-between text-[10px] font-mono text-cobalt-blue mb-1">
                  <span>01 // FOR BUSINESSES</span>
                  <span>NEXORA</span>
                </div>
                <p className="text-xs text-stone-light font-sans mb-3 leading-relaxed">
                  Websites, online stores and business systems built around the way you work.
                </p>
                <a
                  href="#nexora"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-warm-white hover:text-cobalt-blue transition-colors font-semibold"
                >
                  <span>Explore business services</span>
                  <span>→</span>
                </a>
              </div>

              {/* Route 2: Elevora */}
              <div className="p-4 bg-graphite-900/60 border border-editorial hover:border-white/30 transition-colors">
                <div className="flex items-center justify-between text-[10px] font-mono text-stone-light mb-1">
                  <span>02 // FOR INDIVIDUALS</span>
                  <span>ELEVORA</span>
                </div>
                <p className="text-xs text-stone-light font-sans mb-3 leading-relaxed">
                  Career profiles, personal websites and practical support for your next opportunity.
                </p>
                <a
                  href="#elevora"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-warm-white hover:text-cobalt-blue transition-colors font-semibold"
                >
                  <span>Explore career services</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual Sculpture */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[480px] lg:h-[580px] w-full flex items-center justify-center">
            <div className="absolute -inset-4 sm:-inset-6 lg:-right-20 lg:inset-y-[-10%] flex items-center justify-center">
              <StudioSculpture />
            </div>

            <div className="absolute right-0 bottom-2 hidden xl:flex flex-col items-end text-[10px] font-mono tracking-widest uppercase text-muted-stone/60 space-y-1 pointer-events-none select-none">
              <span>HOPEPITOME // STUDIO CRAFT</span>
              <span>SMOKED GLASS & COBALT CORE</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-editorial text-xs font-mono text-muted-stone tracking-wider uppercase gap-3">
          <div className="flex items-center space-x-4">
            <span className="text-warm-white">TWO DEDICATED DIVISIONS</span>
            <span>•</span>
            <span>NEXORA (BUSINESS) & ELEVORA (CAREER)</span>
          </div>

          <a
            href="#statement"
            className="group flex items-center space-x-2 text-[11px] hover:text-warm-white transition-colors self-start sm:self-auto"
            aria-label="Scroll to Studio Statement"
          >
            <span>LEARN ABOUT OUR APPROACH</span>
            <span className="text-cobalt-blue group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
