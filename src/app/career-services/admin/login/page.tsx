'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginWithEmail, sendPasswordReset, getFriendlyAuthErrorMessage } from '@/lib/firebase/auth';
import { ArrowLeft, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, KeyRound, CheckCircle2, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      // AdminAuthProvider will automatically verify staffUsers status and accountStatus
      router.push('/career-services/admin/dashboard');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(false);
    setForgotLoading(true);

    try {
      await sendPasswordReset(forgotEmail);
      setForgotSuccess(true);
    } catch (err: any) {
      setForgotError(getFriendlyAuthErrorMessage(err));
    } finally {
      setForgotLoading(false);
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

        {/* Company Logo & Internal Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#17243B] flex items-center justify-center text-white font-bold text-base shadow-sm">
            HP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
                INTERNAL WORKSPACE
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Secure SSO
              </span>
            </div>
            <p className="text-xs text-[#777781] mt-0.5 font-medium">Hopepitome Career Services</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-[#17243B]">
          Staff & Consultant Sign In
        </h2>
        <p className="mt-1 text-xs text-[#777781]">
          Log in with your authorized company email and password to access CRM pipelines, client dossiers, and work orders.
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
                Company Email / Username
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
                  placeholder="name@hopepitome.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#17243B]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-[11px] font-medium text-[#8172A8] hover:text-[#17243B] transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#777781] hover:text-[#17243B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#E6E2DC] text-[#17243B] focus:ring-[#8172A8]"
                />
                <span className="text-[11px] text-[#777781]">Remember this session</span>
              </label>
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
                  <span>Sign In to Staff Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-[#777781]">
            Are you a career services client?{' '}
            <Link
              href="/career-services/portal/login"
              className="font-semibold text-[#17243B] underline underline-offset-4 hover:text-[#8172A8] transition"
            >
              Sign In with Mobile & Work Order
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl max-w-sm w-full p-6">
            <div className="w-10 h-10 rounded-xl bg-[#8172A8]/10 text-[#8172A8] flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#17243B]">Reset Your Staff Password</h3>
            <p className="text-xs text-[#777781] mt-1">
              Enter your registered company email address. We will send an official Firebase recovery link to reset your credentials.
            </p>

            {forgotSuccess ? (
              <div className="my-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>Password recovery email dispatched. Please check your corporate inbox and spam folder.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-3">
                {forgotError && (
                  <div className="p-2.5 rounded-lg bg-red-50 text-xs text-red-700">
                    {forgotError}
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Company Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@hopepitome.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSuccess(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl border border-[#E6E2DC] text-xs text-[#777781] hover:bg-[#F7F5F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#17243B] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            )}

            {forgotSuccess && (
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-[#17243B] text-white text-xs font-semibold"
              >
                Return to Login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
