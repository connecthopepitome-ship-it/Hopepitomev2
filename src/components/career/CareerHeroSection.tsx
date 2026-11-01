'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  CheckCircle2,
  Linkedin,
  Globe,
  FileText,
  Award,
  TrendingUp,
  Layers,
} from 'lucide-react';

export function CareerHeroSection() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 bg-gradient-to-b from-[#F5F2FF] via-[#F8F6FF] to-[#FAF8FF]">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7357F5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#FF7187]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-[#48C7E8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: HEADLINE, DESCRIPTION & ACTIONS
             ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Studio Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#7357F5]/20 shadow-sm text-xs font-bold text-[#17152F]">
              <span className="w-2 h-2 rounded-full bg-[#7357F5] animate-pulse" />
              <span>DIGITAL CAREER STUDIO</span>
              <span className="text-[#7357F5]/40">•</span>
              <span className="text-[#7357F5]">Tailored Executive Branding</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#17152F] leading-[1.12]">
              Your Next Career Move{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#48C7E8]">
                Starts Here.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#24233A]/80 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Resume. LinkedIn. Portfolio. Job Search.{' '}
              <span className="text-[#17152F] font-semibold">
                Everything you need to present yourself with confidence.
              </span>
            </p>

            {/* Dual Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                type="button"
                onClick={() => scrollTo('#intake')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-lg shadow-[#7357F5]/30 flex items-center justify-center gap-2.5 transition transform active:scale-95"
              >
                <span>Build My Career Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollTo('#services')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-[#17152F] bg-white hover:bg-white/90 border border-[#7357F5]/20 hover:border-[#7357F5]/40 shadow-sm transition"
              >
                Explore Services
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="pt-4 border-t border-[#7357F5]/10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#24233A]/75 font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span>4.9/5 Rating</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-[#65DDB5]">
                <Zap className="w-3.5 h-3.5 fill-[#65DDB5]" />
                <span className="text-[#24233A]">98% ATS Pass Rate</span>
              </div>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-[#7357F5]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[#24233A]">1,200+ Careers Elevated</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: CREATIVE VISUAL PROFILE COMPOSITION
             ========================================================================= */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              
              {/* Layer 1: Main Executive Resume Card (Centered Base) */}
              <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#7357F5]/15 shadow-2xl shadow-[#7357F5]/10 space-y-4">
                
                {/* Resume Header Area */}
                <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-[#17152F] tracking-tight">
                        Alex Morgan
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Executive Ready
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#7357F5]">
                      VP of Product Strategy & Enterprise Scale
                    </p>
                  </div>

                  {/* ATS Compatibility Score Pill */}
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>98% ATS Match</span>
                    </div>
                  </div>
                </div>

                {/* Executive Summary Excerpt */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Executive Narrative
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    12+ years driving hyper-scale product innovation, expanding enterprise ARR from $8M to $44M. Expert in cloud transformation and cross-functional leadership.
                  </p>
                </div>

                {/* Experience Snapshot */}
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Featured Impact
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F2FF]/70 border border-[#7357F5]/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#17152F]">
                      <span>Head of Cloud Solutions</span>
                      <span className="text-[10px] text-slate-500 font-normal">2021 — Present</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Architected global AI workflow engine accelerating time-to-market by 35%.
                    </p>
                  </div>
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Cloud & AI Strategy', 'P&L Management', 'Cross-Functional Scale', 'ATS Keyword Optimized'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold text-[#17152F] bg-slate-100/90 px-2.5 py-1 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Layer 2: Floating LinkedIn Profile Preview Card (Top-Right Overlay) */}
              <div className="absolute -top-6 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#7357F5]/20 shadow-xl shadow-slate-900/10 space-y-2 max-w-[210px] sm:max-w-[230px] hidden xs:block">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7357F5] to-[#48C7E8] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    AM
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#17152F] flex items-center gap-1">
                      <span>Alex Morgan</span>
                      <Linkedin className="w-3 h-3 text-[#0077B5]" />
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>All-Star Profile</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-600">
                  <span className="font-bold text-[#7357F5]">+142%</span> Recruiter search appearances this week.
                </div>
              </div>

              {/* Layer 3: Floating Portfolio Card (Bottom-Left Overlay) */}
              <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-[#17152F] text-white rounded-2xl p-3.5 border border-white/10 shadow-2xl space-y-2 max-w-[210px] sm:max-w-[230px]">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-[#48C7E8]">
                    <Globe className="w-3 h-3" />
                    <span>alexmorgan.dev</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="text-xs font-bold text-white">
                  Interactive Portfolio Live
                </div>
                <div className="text-[10px] text-slate-300">
                  Case studies, architectural diagrams & executive testimonials.
                </div>
              </div>

              {/* Floating Decorative Skill Tag */}
              <div className="absolute -bottom-10 right-4 bg-gradient-to-r from-[#FF7187] to-[#9B6BFF] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md shadow-[#FF7187]/20 hidden sm:flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Executive Narrative Verified</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
