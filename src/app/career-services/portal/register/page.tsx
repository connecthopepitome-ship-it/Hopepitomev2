'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerPasswordlessClient } from '@/lib/firebase/auth';
import {
  ArrowLeft,
  User,
  Phone,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function ClientRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success Confirmation State
  const [registrationResult, setRegistrationResult] = useState<{
    workOrderId: string;
    clientId: string;
    name: string;
    isExisting?: boolean;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please enter your full legal name.');
      return;
    }

    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid mobile number including country code.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerPasswordlessClient(fullName, mobileNumber);
      setRegistrationResult({
        workOrderId: res.workOrderId,
        clientId: res.clientId,
        name: res.name || fullName,
        isExisting: res.isExisting,
      });
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyWorkOrderId = () => {
    if (registrationResult?.workOrderId) {
      navigator.clipboard.writeText(registrationResult.workOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // ---------------------------------------------------------------------------
  // Post-Registration Success Confirmation Screen
  // ---------------------------------------------------------------------------
  if (registrationResult) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#17243B]">
              {registrationResult.isExisting ? 'Welcome Back!' : 'Registration Complete!'}
            </h1>
            <p className="text-xs text-[#777781] mt-1 max-w-sm mx-auto">
              {registrationResult.isExisting
                ? 'We located your existing Hopepitome Career Services record.'
                : 'Your dedicated career portal profile and work order have been initialized.'}
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_4px_24px_rgba(23,36,59,0.06)] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#E6E2DC] pb-4">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                Registered Client
              </span>
              <p className="text-lg font-bold text-[#17243B] mt-0.5">{registrationResult.name}</p>
            </div>

            {/* Generated Work Order ID Card */}
            <div className="bg-[#F7F5F0] rounded-xl p-5 border border-[#8172A8]/30">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#17243B]">Your Permanent Work Order ID</span>
                <span className="text-[10px] font-medium bg-[#8172A8]/15 text-[#8172A8] px-2 py-0.5 rounded-full">
                  Access Key
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 bg-white px-4 py-3 rounded-lg border border-[#E6E2DC]">
                <code className="text-xl font-mono font-bold tracking-wide text-[#17243B]">
                  {registrationResult.workOrderId}
                </code>
                <button
                  type="button"
                  onClick={handleCopyWorkOrderId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#17243B] text-white hover:bg-[#292D36] transition shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#777781] mt-2.5 leading-relaxed">
                <strong className="text-[#17243B]">Important:</strong> Save this Work Order ID. You will use your
                registered mobile number and this Work Order ID to sign in to your dashboard anytime—no password required.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6E2DC] bg-white text-xs font-semibold text-[#17243B] hover:bg-[#F7F5F0] transition"
              >
                <Printer className="w-4 h-4 text-[#777781]" />
                <span>Print / Save Receipt</span>
              </button>

              <Link
                href={`/career-services/portal/login?workOrderId=${encodeURIComponent(registrationResult.workOrderId)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm"
              >
                <span>Continue to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Phase 2: Simple 2-Field Registration Form
  // ---------------------------------------------------------------------------
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
          Get Started with Hopepitome
        </h1>
        <p className="mt-1 text-xs text-[#777781] leading-relaxed">
          Register with just your name and mobile number. No password or complicated setup required.
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
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition"
                />
              </div>
            </div>

            {/* Field 2: Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
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
                  placeholder="e.g. +91 98765 43210 or +1 415 555 2671"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-[#777781]">
                Include country code. This number will be used alongside your Work Order ID for passwordless login.
              </p>
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
                  <span>Register & Generate Work Order ID</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E6E2DC] text-center">
            <p className="text-xs text-[#777781]">
              Already have a Work Order ID?{' '}
              <Link
                href="/career-services/portal/login"
                className="font-semibold text-[#17243B] hover:text-[#8172A8] transition underline underline-offset-2"
              >
                Sign in with Mobile & ID
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#777781]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Cloudflare Edge & Firebase Custom Identity</span>
        </div>
      </div>
    </div>
  );
}
