'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  ShieldCheck,
  Search,
  Clock3,
  CircleCheck,
  CircleX,
  FileText,
  LockKeyhole,
  ArrowRight,
  ArrowLeft,
  Download,
  Printer,
  ChevronDown,
  RotateCcw,
  Globe,
  BriefcaseBusiness,
  Target,
  Award,
} from 'lucide-react';
import {
  CareerCard,
  CareerBadge,
  CareerButton,
  CareerAccordion,
} from '@/components/career/ui/CareerDesignTokens';
import { CareerBottomNav } from '@/components/career/CareerBottomNav';
import type { PublicAtsAuditResult } from '@/lib/ai/types';

export default function AccessReportPage() {
  const [referenceId, setReferenceId] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status: 'idle' | 'pending' | 'approved' | 'expired' | 'not_found'
  const [status, setStatus] = useState<'idle' | 'pending' | 'approved' | 'expired' | 'not_found'>('idle');
  const [resultData, setResultData] = useState<{
    assessment?: PublicAtsAuditResult;
    referenceId?: string;
    submittedAt?: string;
    message?: string;
    remainingSeconds?: number;
  } | null>(null);

  const [countdown, setCountdown] = useState<number>(0);

  // Countdown timer for 24-hour window
  useEffect(() => {
    if (status === 'approved' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, countdown]);

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) {
      setError('Please enter your Assessment Reference Code or Order ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career/report/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId: referenceId.trim().toUpperCase(),
          contact: contact.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setStatus('not_found');
        setError(data?.message || 'No assessment record was found matching this reference code.');
        return;
      }

      setResultData(data);
      if (data.status === 'APPROVED') {
        setStatus('approved');
        setCountdown(data.remainingSeconds || 24 * 3600);
      } else if (data.status === 'PENDING_APPROVAL') {
        setStatus('pending');
      } else if (data.status === 'EXPIRED') {
        setStatus('expired');
      } else {
        setStatus('not_found');
      }
    } catch {
      setError('Connection interrupted. Please verify your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const assessment = resultData?.assessment;

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#201D36] font-sans">
      {/* Top Navigation */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/career-services"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#71778A] hover:text-[#7454F5] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Career Studio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#7454F5] bg-[#7454F5]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>24-Hour Secure Access</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24 lg:pb-12 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7454F5]/10 text-[#7454F5] text-xs font-bold mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>REPORT RETRIEVAL PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17152F] tracking-tight">
            Access Your Career Intelligence Report
          </h1>
          <p className="text-xs sm:text-sm text-[#71778A] leading-relaxed">
            Enter your assessment reference code or enquiry ID to view your verified report. Approved reports remain accessible for 24 hours.
          </p>
        </div>

        {/* Lookup Card */}
        <CareerCard variant="elevated" padding="md" className="max-w-xl mx-auto p-5 sm:p-7">
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                Assessment Reference Code / Order ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                  placeholder="e.g. HP-CAR-202611-XXXX or ATS-..."
                  className="w-full min-h-[46px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#201D36] placeholder-slate-400 focus:outline-none focus:border-[#7454F5] focus:ring-2 focus:ring-[#7454F5]/20 font-mono font-bold tracking-wider uppercase transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#201D36] mb-1.5">
                Registered Email or WhatsApp (Optional Verification)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. name@example.com or +91 98765..."
                  className="w-full min-h-[46px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#201D36] placeholder-slate-400 focus:outline-none focus:border-[#7454F5] focus:ring-2 focus:ring-[#7454F5]/20 transition"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <CircleX className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <CareerButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<Search className="w-4 h-4" />}
            >
              Verify & View Report
            </CareerButton>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#71778A]">
            <span>Need a new assessment?</span>
            <Link
              href="/career-services#resume-checker"
              className="font-bold text-[#7454F5] hover:underline"
            >
              Scan Free Resume →
            </Link>
          </div>
        </CareerCard>

        {/* =====================================================================
            STATE: PENDING APPROVAL
           ===================================================================== */}
        {status === 'pending' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <CareerCard variant="accent" padding="md" className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <Clock3 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Request Pending Review
                </span>
                <h3 className="text-xl font-bold text-[#17152F]">
                  Consultant Verification in Progress
                </h3>
                <p className="text-xs sm:text-sm text-[#71778A] max-w-md mx-auto leading-relaxed">
                  Your report unlock request for reference <strong className="text-[#201D36]">{referenceId}</strong> has been received and queued for consultant approval.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Reference ID:</span>
                  <span className="font-mono font-bold text-[#7454F5]">{referenceId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Configured Request Fee:</span>
                  <span className="font-bold text-slate-800">₹49 (Manual Admin Verification)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Expected Access Duration:</span>
                  <span className="font-bold text-emerald-700">24 Hours from Approval</span>
                </div>
              </div>

              <p className="text-[11px] text-[#71778A]">
                Our team reviews submissions within 2–4 hours. Once unlocked, simply re-enter this reference code to view and download your full intelligence report.
              </p>
            </CareerCard>
          </div>
        )}

        {/* =====================================================================
            STATE: EXPIRED
           ===================================================================== */}
        {status === 'expired' && (
          <div className="max-w-xl mx-auto animate-fadeIn">
            <CareerCard variant="subtle" padding="md" className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
                <LockKeyhole className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#17152F]">
                  24-Hour Access Window Expired
                </h3>
                <p className="text-xs sm:text-sm text-[#71778A] leading-relaxed">
                  To protect candidate document privacy, verified reports are retained for exactly 24 hours. The access window for this report has ended.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/career-services#resume-checker">
                  <CareerButton variant="primary" size="md">
                    Start a New Free Scan
                  </CareerButton>
                </Link>
                <Link href="/career-services/portal/login">
                  <CareerButton variant="outline" size="md">
                    Candidate Portal Login
                  </CareerButton>
                </Link>
              </div>
            </CareerCard>
          </div>
        )}

        {/* =====================================================================
            STATE: APPROVED / UNLOCKED (FULL 24-HOUR ACCESS REPORT)
           ===================================================================== */}
        {status === 'approved' && assessment && (
          <div className="space-y-6 animate-fadeIn">
            {/* Countdown Alert Banner */}
            <div className="bg-gradient-to-r from-[#7454F5] to-[#6342E8] text-white p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                  <Clock3 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    24-Hour Verified Access Active
                  </div>
                  <div className="text-sm sm:text-base font-black">
                    Expires in: {formatCountdown(countdown)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-white text-[#7454F5] hover:bg-slate-100 font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Candidate Header Card */}
            <CareerCard variant="elevated" padding="md" className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-[#17152F]">
                      {assessment.candidateProfile?.name || 'Verified Professional'}
                    </h2>
                    <CareerBadge variant="success" size="sm">
                      Verified Report Unlocked
                    </CareerBadge>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-[#7454F5]">
                    {assessment.inferredRole || assessment.targetRole}
                  </p>
                  <p className="text-xs text-[#71778A]">
                    {assessment.candidateProfile?.totalYearsExperience
                      ? `${assessment.candidateProfile.totalYearsExperience} Years Experience`
                      : 'Verified Experience'}{' '}
                    • {assessment.candidateProfile?.currentLocation || 'Target Market'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-[#7454F5]">
                    {assessment.overallScore}/100
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Career Readiness Score
                  </span>
                </div>
              </div>

              {assessment.candidateProfile?.professionalSummary && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Executive Summary
                  </span>
                  <p className="text-xs sm:text-sm text-[#201D36]/80 leading-relaxed">
                    {assessment.candidateProfile.professionalSummary}
                  </p>
                </div>
              )}
            </CareerCard>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-3 gap-3">
              <CareerCard variant="default" padding="sm" className="p-3.5 text-center">
                <div className="text-[10px] text-[#71778A] font-bold uppercase">Resume Quality</div>
                <div className="text-xl sm:text-2xl font-black text-[#201D36] mt-1">
                  {assessment.generalQualityScore || 85}%
                </div>
              </CareerCard>
              <CareerCard variant="default" padding="sm" className="p-3.5 text-center">
                <div className="text-[10px] text-[#71778A] font-bold uppercase">ATS Compatibility</div>
                <div className="text-xl sm:text-2xl font-black text-[#149B75] mt-1">
                  {assessment.atsCompatibilityScore || 88}%
                </div>
              </CareerCard>
              <CareerCard variant="default" padding="sm" className="p-3.5 text-center">
                <div className="text-[10px] text-[#71778A] font-bold uppercase">Recruiter Visibility</div>
                <div className="text-xl sm:text-2xl font-black text-[#7454F5] mt-1">
                  {assessment.recruiterVisibilityScore || 84}%
                </div>
              </CareerCard>
            </div>

            {/* Deep Intelligence Sections via Progressive Accordions */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#17152F] uppercase tracking-wider px-1">
                Unlocked Career Intelligence Modules
              </h3>

              {/* 1. Career Positioning */}
              {assessment.careerIntelligence?.careerPositioning && (
                <CareerAccordion
                  title="Career Positioning Analysis"
                  subtitle="How employers perceive your professional value"
                  icon={<Target className="w-5 h-5" />}
                  defaultOpen={true}
                >
                  <div className="space-y-4 pt-2">
                    <div className="p-4 rounded-xl bg-[#7454F5]/5 border border-[#7454F5]/20 space-y-1">
                      <span className="text-[10px] font-bold text-[#7454F5] uppercase tracking-wider">
                        Recommended Positioning Pitch
                      </span>
                      <p className="text-xs sm:text-sm text-[#201D36] font-medium leading-relaxed">
                        "{assessment.careerIntelligence.careerPositioning.recommendedPositioningPitch}"
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="font-bold text-slate-500 block mb-1">Career Stage</span>
                        <span className="font-semibold text-[#201D36]">
                          {assessment.careerIntelligence.careerPositioning.careerStage}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="font-bold text-slate-500 block mb-1">Domain Specialisation</span>
                        <span className="font-semibold text-[#201D36]">
                          {(assessment.careerIntelligence.careerPositioning as any).mainSpecialisation || (assessment.careerIntelligence.careerPositioning as any).specialization || 'Strategic Domain'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CareerAccordion>
              )}

              {/* 2. Skills Gap Analysis */}
              {assessment.careerIntelligence?.skillsGapAnalysis && (
                <CareerAccordion
                  title="Skills Gap & High-Impact Keywords"
                  subtitle="Benchmark against top quartile candidate profiles"
                  icon={<Award className="w-5 h-5" />}
                >
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                        Evidenced Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {assessment.careerIntelligence.skillsGapAnalysis.verifiedStrengths?.map((s, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                        High-Impact Keywords to Spotlight
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {assessment.careerIntelligence.skillsGapAnalysis.missingFromResume?.map((m, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                            + {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CareerAccordion>
              )}

              {/* 3. Growth Pathways */}
              {assessment.careerIntelligence?.growthOpportunities && (
                <CareerAccordion
                  title="Career Growth Pathways (3 Tiers)"
                  subtitle="Immediate fit, next-level advancement and adjacent pivots"
                  icon={<BriefcaseBusiness className="w-5 h-5" />}
                >
                  <div className="space-y-3 pt-2">
                    {assessment.careerIntelligence.growthOpportunities.suitableNow?.map((r, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#201D36]">{r.roleTitle}</span>
                          <CareerBadge variant="success" size="sm">Direct Fit</CareerBadge>
                        </div>
                        <p className="text-xs text-[#71778A]">{r.rationale}</p>
                      </div>
                    ))}
                  </div>
                </CareerAccordion>
              )}

              {/* 4. Professional Branding & LinkedIn Assets */}
              {assessment.careerIntelligence?.professionalBranding && (
                <CareerAccordion
                  title="Professional Branding & LinkedIn Assets"
                  subtitle="Executive headlines and recruiter-optimized copy"
                  icon={<Award className="w-5 h-5" />}
                >
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Optimized Resume Headline</span>
                      <p className="font-bold text-[#201D36]">
                        {assessment.careerIntelligence.professionalBranding.targetResumeHeadline}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile Headline</span>
                      <p className="font-bold text-[#7454F5]">
                        {assessment.careerIntelligence.professionalBranding.linkedInHeadline}
                      </p>
                    </div>
                  </div>
                </CareerAccordion>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71778A] border-t border-slate-200">
              <span>Report Assessment ID: {assessment.assessmentId}</span>
              <button
                type="button"
                onClick={handlePrint}
                className="font-bold text-[#7454F5] hover:underline"
              >
                Print Report Document
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile-First Bottom Navigation */}
      <CareerBottomNav />
    </div>
  );
}
