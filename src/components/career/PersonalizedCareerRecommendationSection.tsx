'use client';

import React, { useEffect } from 'react';
import {
  ArrowRight,
  CircleCheck,
  Check,
  Target,
  FileText,
  ScanSearch,
  Linkedin,
  MonitorSmartphone,
  BriefcaseBusiness,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Info,
  Award,
} from 'lucide-react';
import type { PublicAtsAuditResult } from '@/lib/ai/types';
import {
  generatePersonalizedRecommendations,
  PersonalizedRecommendationResult,
  CareerServiceCode,
} from '@/lib/career/personalized-recommendations';

interface PersonalizedCareerRecommendationSectionProps {
  assessment: PublicAtsAuditResult;
  onSelectService: (serviceName: string, prefillNote?: string) => void;
  className?: string;
}

export function PersonalizedCareerRecommendationSection({
  assessment,
  onSelectService,
  className = '',
}: PersonalizedCareerRecommendationSectionProps) {
  const recData: PersonalizedRecommendationResult = React.useMemo(() => {
    return generatePersonalizedRecommendations(assessment);
  }, [assessment]);

  // Track recommendation viewed event in analytics
  useEffect(() => {
    try {
      fetch('/api/career/ai/ats-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'career_recommendation_viewed',
          assessmentId: assessment.assessmentId,
          serviceCode: recData.primaryService.code,
        }),
      }).catch(() => {});
    } catch {}
  }, [assessment.assessmentId, recData.primaryService.code]);

  const handleCtaClick = (serviceName: string, isPrimary: boolean) => {
    try {
      fetch('/api/career/ai/ats-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: isPrimary
            ? 'career_quote_cta_clicked'
            : 'career_additional_service_selected',
          assessmentId: assessment.assessmentId,
          serviceCode: serviceName,
        }),
      }).catch(() => {});
    } catch {}

    const note = isPrimary
      ? recData.enquiryPrefill.requirementsNote
      : `[Assessment ${assessment.assessmentId}] Interested in custom quote for ${serviceName}. Target Role: ${recData.candidateProfession}.`;

    onSelectService(serviceName, note);
  };

  const getServiceIcon = (code: CareerServiceCode) => {
    switch (code) {
      case 'RESUME_WRITING':
        return <FileText className="w-5 h-5 text-amber-300" />;
      case 'ATS_OPTIMISATION':
        return <ScanSearch className="w-5 h-5 text-cyan-300" />;
      case 'LINKEDIN_MAKEOVER':
        return <Linkedin className="w-5 h-5 text-purple-300" />;
      case 'MANAGED_JOB_SEARCH':
        return <BriefcaseBusiness className="w-5 h-5 text-emerald-300" />;
      case 'PORTFOLIO_WEBSITE':
        return <MonitorSmartphone className="w-5 h-5 text-pink-300" />;
      default:
        return <BriefcaseBusiness className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <section
      id="personalized-recommendation"
      className={`bg-gradient-to-br from-[#17152F] via-[#241F47] to-[#17152F] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl ${className}`}
      aria-label="Personalized Career Recommendation"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7454F5]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#A78BFA]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-8">
        {/* =====================================================================
            1. SECTION HEADER: EYEBROW + DYNAMIC HEADLINE + SUBTITLE
           ===================================================================== */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-wider text-[#A78BFA]">
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>{recData.eyebrow}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {recData.headline}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {recData.introduction}
          </p>
        </div>

        {/* =====================================================================
            2. CANDIDATE-SPECIFIC FINDINGS ("What we identified in your resume")
           ===================================================================== */}
        <div className="bg-white/[0.06] backdrop-blur-md rounded-2xl border border-white/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#A78BFA]" />
              <span>What We Identified in Your Resume</span>
            </span>
            <span className="text-[11px] text-[#A78BFA] font-medium hidden sm:inline">
              Evidence-Grounded Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {recData.findings.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA] block">
                    {f.type === 'DOMAIN_EXPERIENCE'
                      ? 'Professional Domain'
                      : f.type === 'ACHIEVEMENT_COMMUNICATION'
                      ? 'Achievement Impact'
                      : 'Keyword Representation'}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">
                    {f.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                  {f.observation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================================
            3. RECOMMENDED PRIORITY SERVICE CARD (PROMINENT SINGLE CARD)
           ===================================================================== */}
        <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-lg rounded-3xl border border-white/25 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                {getServiceIcon(recData.primaryService.code)}
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  {recData.primaryService.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {recData.primaryService.name}
                </h3>
              </div>
            </div>

            <div className="self-start sm:self-center">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200">
                Custom Tailored Scope
              </span>
            </div>
          </div>

          {/* Service Hook & Personalised Reason */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed italic">
              "{recData.primaryService.hook}"
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {recData.primaryService.primaryReason}
            </p>
          </div>

          {/* 2 to 3 Candidate-Specific Improvement Opportunities */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Specific Improvement Opportunities for Your Background:
            </span>
            <div className="space-y-2">
              {recData.primaryService.improvementOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.06] border border-white/10"
                >
                  <CircleCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {opp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-300 font-medium block">
                Personalized Consultation & Proposal
              </span>
              <span className="text-[11px] text-slate-400">
                No fixed package fees • Pricing tailored to your experience scope
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCtaClick(recData.primaryService.name, true)}
              className="w-full sm:w-auto px-7 py-3.5 min-h-[46px] rounded-2xl text-xs sm:text-sm font-bold text-[#17152F] bg-white hover:bg-slate-100 transition shadow-lg shadow-black/20 flex items-center justify-center gap-2 active:scale-98 select-none"
            >
              <span>{recData.primaryService.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-[#7454F5]" />
            </button>
          </div>
        </div>

        {/* =====================================================================
            4. ADDITIONAL RECOMMENDED SERVICES (UP TO 2 COMPLEMENTARY SERVICES)
           ===================================================================== */}
        {recData.secondaryServices.length > 0 && (
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Additional Relevant Support
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Complementary solutions to maximize your overall market visibility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recData.secondaryServices.map((sec) => (
                <div
                  key={sec.code}
                  className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        {getServiceIcon(sec.code)}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white">
                        {sec.name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sec.whyRelevant}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {sec.keyBenefits.map((b, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[11px] text-slate-300"
                        >
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      {sec.pricingLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCtaClick(sec.name, false)}
                      className="px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition flex items-center gap-1.5 active:scale-98"
                    >
                      <span>{sec.ctaText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Trust Note */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Hopepitome consultants review your assessment before preparing your customized proposal.
          </span>
        </div>
      </div>
    </section>
  );
}

