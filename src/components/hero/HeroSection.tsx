'use client';

import { StudioSculpture } from '../3d/StudioSculpture';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center pt-24 pb-16 lg:py-0 overflow-hidden border-b border-editorial">
      {/* Editorial Hairline Background Grid */}
      <div className="absolute inset-0 editorial-grid pointer-events-none opacity-40" />

      {/* Vertical Axis Reference Line */}
      <div className="hidden lg:block absolute left-[52%] top-0 bottom-0 w-px bg-white/[0.06] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between py-12">
        {/* Top Header Metric Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-muted-stone pt-4">
          <div className="flex items-center space-x-3">
            <span className="w-1.5 h-1.5 bg-cobalt-blue inline-block" />
            <span>STUDIO / COORD [ 19.0760° N, 72.8777° E ]</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <span>INDEX // 2026.V2</span>
            <span>SPEC: HYBRID ARCHITECTURE</span>
          </div>
        </div>

        {/* Main Asymmetric Grid Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
          {/* Left Column: Grid-Aligned Editorial Typography */}
          <div className="lg:col-span-7 z-10 flex flex-col justify-center">
            {/* Small Brand Identifier */}
            <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-ultra uppercase text-muted-stone mb-6">
              <span className="text-cobalt-blue font-bold">●</span>
              <span>HOPEPITOME / DIGITAL STUDIO</span>
            </div>

            {/* Asymmetric Large Headline with Deliberate Line Breaks */}
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] text-warm-white uppercase mb-8">
              DIGITAL
              <br />
              AMBITION.
              <br />
              <span className="text-silver">ENGINEERED.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="max-w-xl text-stone-light text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-10 font-sans">
              We build digital systems for businesses and distinctive professional
              identities for people.
            </p>

            {/* Division Navigation Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4 border-t border-editorial">
              <a
                href="#nexora"
                className="group flex items-center space-x-3 text-xs font-mono tracking-widest uppercase text-warm-white hover:text-cobalt-blue transition-colors"
              >
                <span className="text-cobalt-blue font-bold">01 /</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  EXPLORE NEXORA
                </span>
                <span className="text-muted-stone group-hover:text-cobalt-blue text-[10px]">
                  →
                </span>
              </a>

              <a
                href="#elevora"
                className="group flex items-center space-x-3 text-xs font-mono tracking-widest uppercase text-warm-white hover:text-cobalt-blue transition-colors"
              >
                <span className="text-cobalt-blue font-bold">02 /</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  DISCOVER ELEVORA
                </span>
                <span className="text-muted-stone group-hover:text-cobalt-blue text-[10px]">
                  →
                </span>
              </a>

              <a
                href="#contact"
                className="group inline-flex items-center space-x-2 text-xs font-mono tracking-widest uppercase text-muted-stone hover:text-warm-white transition-colors sm:ml-auto pt-2 sm:pt-0"
              >
                <span className="border-b border-muted-stone/40 pb-0.5 group-hover:border-warm-white">
                  START A PROJECT
                </span>
                <span className="text-cobalt-blue text-[10px]">↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural 3D Sculptural Installation */}
          <div className="lg:col-span-5 relative h-[420px] sm:h-[500px] lg:h-[620px] w-full flex items-center justify-center">
            {/* 3D Canvas / WebGL Studio Container with pointer-events-none */}
            <div className="absolute -inset-4 sm:-inset-8 lg:-right-24 lg:inset-y-[-10%] flex items-center justify-center">
              <StudioSculpture />
            </div>

            {/* Subtle Vertical Technical Caption */}
            <div className="absolute right-0 bottom-4 hidden xl:flex flex-col items-end text-[10px] font-mono tracking-widest uppercase text-muted-stone/60 space-y-1 pointer-events-none select-none">
              <span>FIG. 01 / SCULPTURAL FORM</span>
              <span>SMOKED GLASS & BRUSHED TITANIUM</span>
            </div>
          </div>
        </div>

        {/* Bottom Hero Metric Bar & Discreet Scroll Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-editorial text-xs font-mono text-muted-stone tracking-widest uppercase gap-4">
          <div className="flex items-center space-x-6">
            <span className="text-warm-white">DIVISIONS // 02</span>
            <span>•</span>
            <span>SYSTEM MODERNIZATION & CAREER CRAFT</span>
          </div>

          <a
            href="#statement"
            className="group flex items-center space-x-3 text-[11px] hover:text-warm-white transition-colors self-start sm:self-auto"
            aria-label="Scroll to Studio Statement"
          >
            <span className="tracking-widest">SCROLL TO DISCOVER</span>
            <span className="w-4 h-4 border border-white/20 flex items-center justify-center text-[10px] text-cobalt-blue group-hover:translate-y-0.5 transition-transform">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
