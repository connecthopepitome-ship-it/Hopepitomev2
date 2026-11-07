'use client';

import React from 'react';
import Link from 'next/link';
import {
  ScanSearch,
  FilePenLine,
  ArrowRight,
  ShieldCheck,
  Award,
  LockKeyhole,
  FileText,
} from 'lucide-react';

interface CareerStudioHeroProps {
  onScanClick?: () => void;
}

export function CareerStudioHero({ onScanClick }: CareerStudioHeroProps) {
  const handleScrollToScanner = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onScanClick) {
      onScanClick();
    } else {
      const el = document.getElementById('resume-checker');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="pt-20 pb-8 sm:pt-24 sm:pb-12 bg-gradient-to-b from-[#F8F7FC] via-white to-[#F8F7FC] border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            1. STUDIO IDENTIFICATION & WELCOME HEADLINE
           ========================================================================= */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {/* Studio Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#7454F5]/20 shadow-xs text-[11px] sm:text-xs font-bold text-[#201D36]">
            <span className="w-2 h-2 rounded-full bg-[#7454F5] animate-pulse" />
            <span className="tracking-wide uppercase text-[#7454F5]">Career Studio</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#71778A]">Hopepitome Career-Tech</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#17152F] leading-tight">
            Welcome to Your Career Studio
          </h1>

          {/* Supporting Message */}
          <p className="text-sm sm:text-base text-[#71778A] font-medium leading-relaxed">
            Your next career move starts with the right tools and professional support.
          </p>
        </div>

        {/* =========================================================================
            2. TWO PRIMARY ACTION CARDS (Scan My Resume & Resume Writing)
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 mb-6 sm:mb-8 items-stretch">
          
          {/* PRIMARY ACTION 1 — SCAN MY RESUME (FREE) */}
          <div className="relative group bg-white rounded-2xl sm:rounded-3xl border-2 border-[#7454F5]/30 hover:border-[#7454F5] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Header row: Icon & FREE badge */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center shrink-0">
                  <ScanSearch className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.9} />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#149B75]/10 text-[#149B75] border border-[#149B75]/25">
                  FREE
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#17152F] tracking-tight group-hover:text-[#7454F5] transition-colors">
                  Scan My Resume
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#71778A] leading-relaxed">
                  Check your resume quality, ATS compatibility and career opportunities.
                </p>
              </div>

              {/* Features hint */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-[#71778A]">
                <span className="inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#7454F5]" strokeWidth={1.9} /> AI Career Readiness Score
                </span>
                <span>•</span>
                <span>Role Matching</span>
                <span>•</span>
                <span>Country Compatibility</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-5 mt-auto">
              <a
                href="#resume-checker"
                onClick={handleScrollToScanner}
                className="w-full min-h-[46px] sm:min-h-[48px] px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] active:bg-[#5233D2] flex items-center justify-center gap-2 shadow-sm shadow-[#7454F5]/25 transition active:scale-[0.98]"
              >
                <span>Start Free Scan</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.9} />
              </a>
            </div>
          </div>

          {/* PRIMARY ACTION 2 — RESUME WRITING (CUSTOM QUOTE) */}
          <div className="relative group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-[#17152F]/40 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Header row: Icon & Custom Quote badge */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#17152F]/5 text-[#17152F] flex items-center justify-center shrink-0">
                  <FilePenLine className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.9} />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#7454F5]/10 text-[#7454F5] border border-[#7454F5]/20">
                  Custom Quote
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#17152F] tracking-tight group-hover:text-[#7454F5] transition-colors">
                  Resume Writing
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#71778A] leading-relaxed">
                  Create a professional resume or improve the way your experience is presented.
                </p>
              </div>

              {/* Features hint */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-[#71778A]">
                <span className="inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#17152F]" strokeWidth={1.9} /> Human Career Strategists
                </span>
                <span>•</span>
                <span>ATS Structure</span>
                <span>•</span>
                <span>Tailored Scoping</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-5 mt-auto">
              <Link
                href="/career-services/resume-writing"
                className="w-full min-h-[46px] sm:min-h-[48px] px-5 py-2.5 rounded-xl text-sm font-bold text-[#17152F] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#71778A]" strokeWidth={1.9} />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. SHORT TRUST & PRIVACY BAR (Transparent, No Unverified Claims)
           ========================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 px-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] sm:text-xs text-[#71778A] font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#149B75]" strokeWidth={1.9} />
            <span>24-Hour Privacy Retention</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="w-3.5 h-3.5 text-[#7454F5]" strokeWidth={1.9} />
            <span>Zero Data Selling</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span>Scope-Based Custom Quotes • No Hidden Fees</span>
          </div>
        </div>

      </div>
    </section>
  );
}
