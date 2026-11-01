'use client';

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center pt-28 sm:pt-36 pb-16 lg:py-0 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full flex flex-col justify-center py-6 sm:py-12 z-10">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
          
          {/* Left Column: Focused Headline & Direct CTAs */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-6 text-left">
            
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono tracking-wider uppercase text-[#E8E2FF] self-start">
              <span className="w-2 h-2 rounded-full bg-[#9D85FF] animate-pulse shadow-[0_0_8px_#9D85FF]" />
              <span className="font-semibold text-white">HOPEPITOME STUDIO</span>
              <span className="text-white/30">•</span>
              <span className="text-[#9D85FF]">Creative Business Tech</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] tracking-tight leading-[1.08] sm:leading-[1.04] text-white">
              Let&apos;s Build Something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D85FF] via-[#E8E2FF] to-[#48C7E8]">
                Great for Your Business.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="max-w-2xl text-slate-300 text-sm sm:text-lg md:text-xl font-normal leading-relaxed font-sans">
              Websites, online stores and custom business systems — built around the way you work.
            </p>

            {/* Dual Call-to-Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => scrollTo('#discuss-project')}
                className="w-full sm:w-auto justify-center px-7 py-3.5 bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] text-white hover:opacity-95 transition-all duration-200 rounded-xl text-xs sm:text-sm font-bold tracking-wide flex items-center space-x-2 shadow-lg shadow-[#7357F5]/30 transform active:scale-95"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#what-we-build')}
                className="w-full sm:w-auto justify-center px-6 py-3.5 bg-[#121520]/80 border border-white/20 text-white hover:border-[#9D85FF]/80 hover:bg-white/10 transition-all duration-200 rounded-xl text-xs sm:text-sm font-semibold tracking-wide flex items-center space-x-2 backdrop-blur-md"
              >
                <span>See What We Build</span>
                <span className="text-[#9D85FF]">↓</span>
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#65DDB5]" />
                <span>Clear Fixed-Price Scoping</span>
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-[#9D85FF]" />
                <span>Fast, Modern Deployments</span>
              </span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#48C7E8]" />
                <span>Direct Developer Access</span>
              </span>
            </div>

          </div>

          {/* Right Column: Space for 3D Mesh with Studio Status Badge */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-end items-end h-full pointer-events-none select-none pr-2">
            <div className="space-y-3 text-right">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 border border-white/15 bg-[#121520]/90 backdrop-blur-md rounded-xl text-[10px] font-mono tracking-widest uppercase text-slate-300 shadow-md">
                <span className="w-2 h-2 bg-[#9D85FF] rounded-full animate-ping shadow-[0_0_8px_#9D85FF]" />
                <span className="font-semibold text-white">3D LIVING MESH ACTIVE</span>
              </div>
              <p className="text-xs font-sans text-slate-400 tracking-wide max-w-[220px] leading-relaxed">
                Move your cursor to ripple the fluid background mesh in real time.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;
