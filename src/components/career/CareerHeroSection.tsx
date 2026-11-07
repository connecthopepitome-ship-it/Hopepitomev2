'use client';

import React from 'react';
import {
  ScanSearch,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  CircleCheck,
  Linkedin,
  FileCheck2,
  TrendingUp,
} from 'lucide-react';
import { CareerButton, CareerBadge } from './ui/CareerDesignTokens';

export function CareerHeroSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-b from-[#F8F7FC] via-white to-[#F8F7FC]">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#7454F5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#A78BFA]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: HEADLINE, COPY & DUAL CTAS
             ========================================================================= */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            {/* Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#7454F5]/20 shadow-sm text-xs font-bold text-[#201D36]">
              <span className="w-2 h-2 rounded-full bg-[#7454F5] animate-pulse" />
              <span>DIGITAL CAREER STUDIO</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#7454F5]">AI + Executive Advisory</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-[#17152F] leading-[1.15]">
              Present Your Experience.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7454F5] via-[#9B6BFF] to-[#6342E8]">
                Unlock Your Next Career Opportunity.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base md:text-lg text-[#71778A] font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Build a stronger resume, improve ATS compatibility and move forward with a clearer career strategy.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <CareerButton
                size="lg"
                variant="primary"
                onClick={() => scrollTo('#resume-checker')}
                icon={<ScanSearch className="w-4 h-4 text-white" />}
                className="w-full sm:w-auto"
              >
                Scan Your Resume Free
              </CareerButton>

              <CareerButton
                size="lg"
                variant="outline"
                onClick={() => scrollTo('#services')}
                className="w-full sm:w-auto"
              >
                Explore Services & Pricing
              </CareerButton>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 sm:gap-5 text-xs text-[#71778A] font-medium">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="font-bold text-[#201D36]">4.9/5 Rating</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-[#149B75]">
                <Zap className="w-3.5 h-3.5 fill-[#149B75]" />
                <span className="font-bold text-[#201D36]">98% ATS Pass Rate</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5 text-[#7454F5]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold text-[#201D36]">1,200+ Careers Elevated</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: MOBILE-OPTIMIZED CARD COMPOSITION
             ========================================================================= */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md sm:max-w-lg">
              
              {/* Main Executive Resume Preview Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#201D36]/[0.08] shadow-[0_12px_36px_rgba(32,29,54,0.08)] space-y-4">
                
                {/* Profile Header */}
                <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#201D36] truncate">
                        Sourcing & Procurement Lead
                      </h3>
                      <CareerBadge variant="success" size="sm">
                        Verified Match
                      </CareerBadge>
                    </div>
                    <p className="text-xs font-semibold text-[#7454F5]">
                      IT Sourcing • Vendor Negotiations • TCO Analytics
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#149B75]/10 text-[#149B75] border border-[#149B75]/20">
                      <CircleCheck className="w-3 h-3 text-[#149B75]" />
                      <span>96/100 ATS</span>
                    </div>
                  </div>
                </div>

                {/* Score Summary Metrics Preview */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="p-2.5 rounded-xl bg-[#F8F7FC] border border-slate-100 text-center">
                    <div className="text-[10px] text-[#71778A] font-medium uppercase">Quality</div>
                    <div className="text-sm font-black text-[#201D36]">94%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F7FC] border border-slate-100 text-center">
                    <div className="text-[10px] text-[#71778A] font-medium uppercase">ATS Match</div>
                    <div className="text-sm font-black text-[#149B75]">96%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F7FC] border border-slate-100 text-center">
                    <div className="text-[10px] text-[#71778A] font-medium uppercase">Visibility</div>
                    <div className="text-sm font-black text-[#7454F5]">92%</div>
                  </div>
                </div>

                {/* Executive Narrative Excerpt */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-[#71778A] uppercase tracking-wider">
                    Executive Narrative
                  </div>
                  <p className="text-xs text-[#201D36]/80 leading-relaxed font-sans line-clamp-3">
                    5+ years driving end-to-end IT procurement, enterprise RFP management, and strategic vendor negotiations across India and the GCC. Reduced spend by 18% through data-driven TCO modeling.
                  </p>
                </div>

                {/* Sample Key Competencies */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Strategic Sourcing', 'RFP/RFQ', 'Spend Analysis', 'Zycus & Sievo', 'TCO Modeling'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-[#201D36] bg-[#F8F7FC] border border-slate-200/80 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Status Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#71778A]">
                  <span className="flex items-center gap-1 text-[#149B75] font-semibold">
                    <FileCheck2 className="w-3.5 h-3.5" />
                    GPT-6 Luna Audited
                  </span>
                  <span className="text-[#7454F5] font-semibold">Instant Free Scan ↓</span>
                </div>
              </div>

              {/* Floating Pill for Visual Accent */}
              <div className="absolute -bottom-3 -right-2 bg-gradient-to-r from-[#7454F5] to-[#A78BFA] text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg shadow-[#7454F5]/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span>Zero Hardcoded Profiles</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
