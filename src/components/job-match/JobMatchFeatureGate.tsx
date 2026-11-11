'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useCareerAuth } from '../career/portal/AuthContext';
import { fetchJobMatchFeatureEnabled, isJobMatchBuildEnabled } from '@/lib/job-match/client';

interface JobMatchFeatureGateProps {
  children: React.ReactNode;
}

export function JobMatchFeatureGate({ children }: JobMatchFeatureGateProps) {
  const { user, loading: authLoading } = useCareerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingFlag, setCheckingFlag] = useState(true);
  const [enabled, setEnabled] = useState(isJobMatchBuildEnabled());

  useEffect(() => {
    let mounted = true;
    fetchJobMatchFeatureEnabled()
      .then((val) => {
        if (mounted) {
          setEnabled(val);
          setCheckingFlag(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setEnabled(false);
          setCheckingFlag(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const targetPath = pathname && pathname.startsWith('/job-match') ? pathname : '/job-match/intake';
  const loginHref = `/career-services/portal/login?redirect=${encodeURIComponent(targetPath)}&mode=job-match`;

  useEffect(() => {
    if (!checkingFlag && enabled && !authLoading && !user) {
      router.replace(loginHref);
    }
  }, [checkingFlag, enabled, authLoading, user, loginHref, router]);

  if (checkingFlag || (enabled && authLoading)) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#71778A] tracking-wide">
            Preparing AI Job Match Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!enabled) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-[#17152F]">AI Job Match Unavailable</h1>
          <p className="text-xs text-[#71778A] leading-relaxed">
            AI Job Match is currently disabled for this workspace. Your existing career portal tools and documents remain available.
          </p>
          <Link
            href="/career-services/portal/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#71778A] tracking-wide">
            Redirecting to Candidate Sign In...
          </p>
          <Link
            href={loginHref}
            className="text-xs font-bold text-[#7454F5] hover:underline"
          >
            Continue to Login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

