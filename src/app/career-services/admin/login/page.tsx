'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginWithEmail, loginWithGoogle, getFriendlyAuthErrorMessage } from '@/lib/firebase/auth';
import { ArrowLeft, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push('/career-services/admin/dashboard');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/career-services/admin/dashboard');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
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

        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
            STAFF OPERATIONS
          </span>
          <span className="text-xs text-[#8172A8] font-medium">Internal Workspace</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-[#17243B]">
          Admin & Consultant Sign In
        </h2>
        <p className="mt-1 text-xs text-[#777781]">
          Access client dossiers, review career profile intakes, manage drafting pipelines, and dispatch deliverables.
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
            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Staff Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hopepitome.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In as Staff</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E6E2DC]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#FFFFFF] text-[#777781] text-[11px]">
                  Or corporate SSO
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-medium text-[#292D36] transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
              <span>Google Workspace Login</span>
            </button>
          </div>

          <p className="mt-8 text-center text-[11px] text-[#777781]">
            Are you a career services client?{' '}
            <Link
              href="/career-services/portal/login"
              className="font-semibold text-[#17243B] underline underline-offset-4 hover:text-[#8172A8] transition"
            >
              Go to Client Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

