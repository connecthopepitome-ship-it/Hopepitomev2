'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginPasswordlessClient, forgotWorkOrderIdClient } from '@/lib/firebase/auth';
import {
  ArrowLeft,
  Phone,
  Hash,
  CircleX,
  ShieldCheck,
  KeyRound,
  ScanSearch,
  LockKeyhole,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  UserPlus,
  X,
} from 'lucide-react';
import { CareerButton, CareerCard } from '@/components/career/ui/CareerDesignTokens';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [workOrderId, setWorkOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Work Order ID modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotCountryCode, setForgotCountryCode] = useState('+91');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotNeedsRegistration, setForgotNeedsRegistration] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    workOrderId: string;
    name: string;
    mobile: string;
    message?: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const prefillWorkOrder = searchParams.get('workOrderId');
    if (prefillWorkOrder) {
      setWorkOrderId(prefillWorkOrder.toUpperCase());
    }
  }, [searchParams]);

  const openForgotModal = () => {
    setForgotCountryCode(countryCode);
    setForgotPhone(phoneNumber);
    setForgotError(null);
    setForgotNeedsRegistration(false);
    setGeneratedResult(null);
    setCopiedId(false);
    setShowForgotModal(true);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotNeedsRegistration(false);

    const trimmed = forgotPhone.trim();
    if (!trimmed || trimmed.replace(/\D/g, '').length < 7) {
      setForgotError('Please enter a valid registered mobile number.');
      return;
    }

    setForgotLoading(true);
    try {
      const fullForgotMobile = trimmed.startsWith('+') ? trimmed : `${forgotCountryCode} ${trimmed}`;
      const res = await forgotWorkOrderIdClient(fullForgotMobile, trimmed, forgotCountryCode);
      setGeneratedResult({
        workOrderId: res.workOrderId,
        name: res.name,
        mobile: res.mobile,
        message: res.message,
      });
      setCountryCode(forgotCountryCode);
      setPhoneNumber(trimmed);
      setWorkOrderId(res.workOrderId);
    } catch (err: any) {
      setForgotNeedsRegistration(Boolean(err?.needsRegistration));
      setForgotError(err?.message || 'Unable to generate Work Order ID for this mobile number.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSignInWithGeneratedId = async () => {
    if (!generatedResult) return;
    setShowForgotModal(false);
    setError(null);
    setLoading(true);
    try {
      const trimmed = forgotPhone.trim();
      const fullMobile = trimmed.startsWith('+') ? trimmed : `${forgotCountryCode} ${trimmed}`;
      await loginPasswordlessClient(fullMobile, generatedResult.workOrderId, trimmed, forgotCountryCode);
      router.push('/career-services/portal/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Unable to complete sign in with generated Work Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      setError('Please enter your registered mobile number.');
      return;
    }

    if (!workOrderId.trim()) {
      setError('Please enter your Work Order ID or Reference Code (e.g. HP-2026-00001).');
      return;
    }

    setLoading(true);

    try {
      const fullMobile = trimmedPhone.startsWith('+') ? trimmedPhone : `${countryCode} ${trimmedPhone}`;
      await loginPasswordlessClient(fullMobile, workOrderId.trim(), trimmedPhone, countryCode);
      router.push('/career-services/portal/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid mobile number or Work Order ID. Please check and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/career-services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71778A] hover:text-[#7454F5] mb-4 transition select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Career Studio</span>
        </Link>

        {/* Compact Logo & Brand */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7454F5] to-[#A78BFA] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#7454F5]/30">
            H
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#17152F]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#71778A]">Hopepitome Candidate Workspace</p>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <CareerCard variant="elevated" padding="md" className="p-5 sm:p-7 bg-white rounded-3xl">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-sm sm:text-base font-bold text-[#201D36]">
              Sign In to Candidate Portal
            </h2>
            <p className="mt-0.5 text-xs text-[#71778A] leading-relaxed">
              Access your resume drafting progress, deliverables, and active career services.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 leading-relaxed">
              <CircleX className="w-4 h-4 shrink-0 mt-0.5 text-red-600" strokeWidth={1.9} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Input 1: Mobile Number with Country Code */}
            <div>
              <label className="block text-xs font-bold text-[#201D36] mb-1">
                Registered Mobile Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 h-11 px-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#7454F5] bg-slate-50 shrink-0"
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+971">+971 (UAE)</option>
                  <option value="+1">+1 (US/CA)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+65">+65 (SG)</option>
                  <option value="+61">+61 (AU)</option>
                  <option value="+49">+49 (DE)</option>
                  <option value="+966">+966 (SA)</option>
                  <option value="+974">+974 (QA)</option>
                </select>

                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#201D36] placeholder-slate-400 focus:outline-none focus:border-[#7454F5] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Input 2: Work Order ID or Reference Code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#201D36]">
                  Work Order ID or Reference Code
                </label>
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-[11px] text-[#7454F5] hover:text-[#5B3CE0] font-bold underline underline-offset-2 transition"
                >
                  Forgot Work Order ID?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoCapitalize="characters"
                  autoCorrect="off"
                  value={workOrderId}
                  onChange={(e) => setWorkOrderId(e.target.value.toUpperCase())}
                  placeholder="HP-2026-XXXXX"
                  className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#201D36] placeholder-slate-400 focus:outline-none focus:border-[#7454F5] uppercase font-mono tracking-wider font-bold"
                />
              </div>
              <p className="mt-1 text-[10px] text-[#71778A]">
                Example format: <span className="font-mono font-semibold text-[#201D36]">HP-2026-00001</span>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <CareerButton
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={loading}
                icon={<KeyRound className="w-4 h-4" />}
                className="min-h-[48px]"
              >
                Sign In to Candidate Portal
              </CareerButton>
            </div>
          </form>

          {/* Quick Access & Registration Links */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <Link
                href="/career-services/portal/register"
                className="inline-flex items-center justify-center gap-1.5 font-semibold text-[#173B8F] hover:text-[#112A69] transition"
              >
                <UserPlus className="w-3.5 h-3.5" strokeWidth={1.9} />
                <span>New Candidate? Register</span>
              </Link>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={openForgotModal}
                className="inline-flex items-center justify-center gap-1 font-semibold text-[#7454F5] hover:text-[#5B3CE0] transition"
              >
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.9} />
                <span>Recover / Generate ID</span>
              </button>
            </div>

            <Link
              href="/career-services/access-report"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#7454F5] hover:text-[#6342E8] transition"
            >
              <ScanSearch className="w-3.5 h-3.5" strokeWidth={1.9} />
              <span>Looking for your ATS Scan Report? Access with code here →</span>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71778A]">
              <LockKeyhole className="w-3 h-3 text-[#149B75]" strokeWidth={1.9} />
              <span>256-bit encrypted candidate workspace</span>
            </div>
          </div>
        </CareerCard>

        {/* Staff Sign In Link */}
        <div className="mt-4 text-center">
          <Link
            href="/career-services/admin/login"
            className="text-xs text-[#71778A] hover:text-[#17152F] transition font-medium"
          >
            Consultant & Operations Sign In →
          </Link>
        </div>
      </div>

      {/* Forgot Work Order ID Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#F8F7FC]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7454F5]/10 border border-[#7454F5]/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#7454F5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17152F]">Forgot Work Order ID</h3>
                  <p className="text-[11px] text-[#71778A]">Enter your mobile number to generate a new ID</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {!generatedResult ? (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-[#71778A] leading-relaxed">
                    Enter your registered mobile number. We will verify your candidate profile and generate a fresh active Work Order ID immediately.
                  </p>

                  {forgotError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5 text-red-700 text-xs">
                      <CircleX className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <div className="space-y-1.5">
                        <p>{forgotError}</p>
                        {forgotNeedsRegistration && (
                          <Link
                            href="/career-services/portal/register"
                            className="inline-flex items-center gap-1 font-bold text-[#7454F5] hover:underline"
                          >
                            Register new candidate account →
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#201D36] mb-1">
                      Registered Mobile Number
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={forgotCountryCode}
                        onChange={(e) => setForgotCountryCode(e.target.value)}
                        className="h-11 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-[#201D36] focus:outline-none focus:border-[#7454F5]"
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+65">🇸🇬 +65</option>
                        <option value="+61">🇦🇺 +61</option>
                      </select>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          autoFocus
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-[#201D36] placeholder-slate-400 focus:outline-none focus:border-[#7454F5] font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="h-11 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <CareerButton
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      loading={forgotLoading}
                      icon={<Sparkles className="w-4 h-4" />}
                      className="h-11"
                    >
                      Generate Work Order ID
                    </CareerButton>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-800">
                      New Work Order ID Generated for {generatedResult.name}
                    </p>
                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      <span className="px-3.5 py-2 rounded-lg bg-white border border-emerald-200 font-mono text-base font-extrabold tracking-wider text-[#17152F]">
                        {generatedResult.workOrderId}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(generatedResult.workOrderId);
                          setCopiedId(true);
                          setTimeout(() => setCopiedId(false), 2000);
                        }}
                        className="p-2.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition"
                        title="Copy Work Order ID"
                      >
                        {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-emerald-700">
                      Your previous Work Order ID has been superseded. Use this new ID to access your portal.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="h-11 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Use on Login Form
                    </button>
                    <CareerButton
                      type="button"
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={handleSignInWithGeneratedId}
                      icon={<KeyRound className="w-4 h-4" />}
                      className="h-11"
                    >
                      Sign In Directly with New ID →
                    </CareerButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidateLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
