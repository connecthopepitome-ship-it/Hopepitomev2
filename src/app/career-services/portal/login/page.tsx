'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginPasswordlessClient } from '@/lib/firebase/auth';
import {
  ArrowLeft,
  Phone,
  Hash,
  CircleX,
  ShieldCheck,
  KeyRound,
  ScanSearch,
  LockKeyhole,
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

  useEffect(() => {
    const prefillWorkOrder = searchParams.get('workOrderId');
    if (prefillWorkOrder) {
      setWorkOrderId(prefillWorkOrder.toUpperCase());
    }
  }, [searchParams]);

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
      // Send both raw and formatted mobile to allow flexible auth lookup
      const fullMobile = trimmedPhone.startsWith('+') ? trimmedPhone : `${countryCode} ${trimmedPhone}`;
      await loginPasswordlessClient(fullMobile, workOrderId.trim());
      router.push('/career-services/portal/dashboard');
    } catch (err: any) {
      // Also fallback attempt with raw number if user entered with country code
      try {
        await loginPasswordlessClient(trimmedPhone, workOrderId.trim());
        router.push('/career-services/portal/dashboard');
      } catch {
        setError(err?.message || 'Invalid mobile number or Work Order ID. Please check and retry.');
      }
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
                <span className="text-[10px] text-[#7454F5] font-semibold">e.g. HP-2026-00001</span>
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

          {/* Quick Access to Report without Login */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-center">
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
