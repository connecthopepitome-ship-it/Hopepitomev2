'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginPasswordlessClient } from '@/lib/firebase/auth';
import { ArrowLeft, Phone, Hash, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mobileNumber, setMobileNumber] = useState('');
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

    if (!mobileNumber.trim()) {
      setError('Please enter your registered mobile number.');
      return;
    }

    if (!workOrderId.trim()) {
      setError('Please enter your Work Order ID (e.g. HP-2026-00001).');
      return;
    }

    setLoading(true);

    try {
      await loginPasswordlessClient(mobileNumber, workOrderId);
      router.push('/career-services/portal/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid mobile number or Work Order ID. Please check and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link
          href="/career-services"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#777781] hover:text-[#17243B] mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Career Services</span>
        </Link>

        <div className="w-10 h-10 rounded-xl bg-[#17243B] flex items-center justify-center text-white font-bold text-base mb-4 shadow-sm">
          HP
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#17243B]">
          Client Career Portal
        </h1>
        <p className="mt-1 text-xs text-[#777781] leading-relaxed">
          Sign in passwordless using your registered mobile number and Work Order ID.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 rounded-2xl border border-[#E6E2DC] shadow-[0_4px_20px_rgba(23,36,59,0.04)]">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Registered Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Registered Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +91 98765 43210 or 9876543210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition font-mono"
                />
              </div>
            </div>

            {/* Input 2: Work Order ID */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#17243B]">
                  Work Order ID
                </label>
                <span className="text-[10px] text-[#8172A8] font-medium">Format: HP-YYYY-XXXXX</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                  <Hash className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={workOrderId}
                  onChange={(e) => setWorkOrderId(e.target.value.toUpperCase())}
                  placeholder="e.g. HP-2026-00001"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition uppercase font-mono tracking-wider font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#17243B] disabled:opacity-50 transition shadow-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E6E2DC] text-center space-y-2">
            <p className="text-xs text-[#777781]">
              Don't have a Work Order ID yet?{' '}
              <Link
                href="/career-services/portal/register"
                className="font-semibold text-[#17243B] hover:text-[#8172A8] transition underline underline-offset-2"
              >
                Register in 10 seconds
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#777781]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero-Password, Single-Token Secure Identity</span>
        </div>
      </div>
    </div>
  );
}

export default function ClientLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
