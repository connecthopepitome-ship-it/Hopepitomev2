'use client';

import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';

export function CareerFinalCtaSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 sm:py-24 bg-[#17152F] text-white relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7357F5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FF7187]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#A69ACB] border border-white/15">
          <TrendingUp className="w-3.5 h-3.5 text-[#9B6BFF]" />
          <span>Elevate Your Executive Presence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight max-w-2xl mx-auto">
          Ready for your next{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#48C7E8]">
            career move?
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
          Take the first step toward your next promotion or dream role today. Select your service, share your background, and receive your tailored consultation within 2 hours.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollTo('#intake')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-lg shadow-[#7357F5]/40 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#65DDB5]" />
            <span>Strict Client Confidentiality</span>
          </span>
          <span>•</span>
          <span>Fast 2-Hour Consultation Response</span>
        </div>

      </div>
    </section>
  );
}

