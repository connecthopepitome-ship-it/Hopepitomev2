'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCareerAuth } from './AuthContext';
import { PortalHeader } from './PortalHeader';
import Link from 'next/link';
import {
  LayoutDashboard,
  UserRound,
  BriefcaseBusiness,
  Files,
  Receipt,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Award,
  Sparkles,
  Target,
} from 'lucide-react';
import { CareerCard, CareerBadge, CareerBottomNav } from '../ui/CareerDesignTokens';
import { fetchJobMatchFeatureEnabled, isJobMatchBuildEnabled } from '@/lib/job-match/client';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading, client, profile } = useCareerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [jobMatchEnabled, setJobMatchEnabled] = useState(isJobMatchBuildEnabled());

  useEffect(() => {
    let active = true;
    fetchJobMatchFeatureEnabled().then((val) => {
      if (active) setJobMatchEnabled(val);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      const target =
        pathname && pathname !== '/career-services/portal/dashboard'
          ? `/career-services/portal/login?redirect=${encodeURIComponent(pathname)}`
          : '/career-services/portal/login';
      router.push(target);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#71778A] tracking-wide">
            Securing Candidate Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const navLinks = [
    { id: 'dashboard', label: 'Overview', href: '/career-services/portal/dashboard', icon: LayoutDashboard },
    ...(jobMatchEnabled
      ? [
          { id: 'job-match-intake', label: 'AI Job Match', href: '/job-match/intake', icon: Sparkles },
          { id: 'job-match-results', label: 'My Job Matches', href: '/job-match/results', icon: Target },
        ]
      : []),
    { id: 'onboarding', label: 'Career Profile Intake', href: '/career-services/portal/onboarding', icon: UserRound },
    { id: 'orders', label: 'Active Orders & Work', href: '/career-services/portal/orders', icon: BriefcaseBusiness },
    { id: 'documents', label: 'Document Vault', href: '/career-services/portal/documents', icon: Files },
    { id: 'messages', label: 'Consultant Messages', href: '/career-services/portal/messages', icon: MessageSquare },
    { id: 'invoices', label: 'Invoices & Billing', href: '/career-services/portal/invoices', icon: Receipt },
  ];

  // Mobile bottom nav items (5 key touch destinations)
  const mobileNavItems = [
    { id: 'dashboard', label: 'Overview', href: '/career-services/portal/dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Work', href: '/career-services/portal/orders', icon: BriefcaseBusiness },
    { id: 'documents', label: 'Vault', href: '/career-services/portal/documents', icon: Files },
    { id: 'messages', label: 'Chat', href: '/career-services/portal/messages', icon: MessageSquare },
    { id: 'onboarding', label: 'Profile', href: '/career-services/portal/onboarding', icon: UserRound },
  ];

  const currentActiveId =
    pathname.includes('/job-match/intake') ? 'job-match-intake' :
    pathname.includes('/job-match/results') ? 'job-match-results' :
    pathname.includes('/orders') ? 'orders' :
    pathname.includes('/documents') ? 'documents' :
    pathname.includes('/messages') ? 'messages' :
    pathname.includes('/onboarding') ? 'onboarding' :
    'dashboard';

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-[#201D36] flex flex-col font-sans selection:bg-[#7454F5]/15 selection:text-[#17152F]">
      <PortalHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 w-full flex-1 flex flex-col md:flex-row gap-6 pb-24 md:pb-8">
        {/* Sidebar (Desktop & Tablet) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-5">
          {/* Client badge card */}
          <CareerCard variant="default" padding="sm" className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7454F5] to-[#A78BFA] text-white flex items-center justify-center font-black text-sm shadow-sm shadow-[#7454F5]/30">
                {(client?.fullName || user.email || 'C').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden min-w-0">
                <h3 className="text-sm font-bold text-[#17152F] truncate">
                  {client?.fullName || user.displayName || 'Candidate Client'}
                </h3>
                <p className="text-[11px] font-mono text-[#7454F5] font-semibold truncate">
                  ID: {client?.currentWorkOrderId || client?.clientCode || 'PROVISIONAL'}
                </p>
              </div>
            </div>

            {/* Profile Status Badge */}
            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#71778A] font-medium">Profile Status</span>
                <CareerBadge
                  variant={
                    profile?.status === 'APPROVED' || profile?.status === 'READY_FOR_SERVICE'
                      ? 'success'
                      : profile?.status === 'ADDITIONAL_INFO_REQUESTED'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {profile?.status === 'RESUME_RECEIVED'
                    ? 'Resume Received'
                    : profile?.status === 'ADDITIONAL_INFO_REQUESTED'
                    ? 'Action Needed'
                    : profile?.status === 'APPROVED' || profile?.status === 'READY_FOR_SERVICE'
                    ? 'Verified'
                    : 'Active'}
                </CareerBadge>
              </div>
            </div>
          </CareerCard>

          {/* Navigation Links */}
          <nav className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#7454F5] text-white shadow-sm shadow-[#7454F5]/25'
                      : 'text-[#201D36] hover:bg-[#F8F7FC] hover:text-[#7454F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7454F5]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>

          {/* New Service Order Promo Card */}
          <div className="bg-gradient-to-br from-[#17152F] to-[#241F47] text-white p-4 rounded-2xl shadow-md space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Award className="w-3.5 h-3.5" strokeWidth={1.9} />
              <span>Career Solutions</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ready for an executive resume rewrite, LinkedIn revamp, or interview advisory?
            </p>
            <Link
              href="/career-services/portal/orders/new"
              className="inline-flex items-center justify-center w-full px-3 py-2.5 rounded-xl bg-[#7454F5] hover:bg-[#6342E8] text-white text-xs font-bold transition shadow-sm active:scale-95"
            >
              Order New Service
            </Link>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-[11px] text-[#71778A] px-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#149B75]" />
            <span>Strict Client Confidentiality</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar (App Experience) */}
      <CareerBottomNav items={mobileNavItems} activeId={currentActiveId} />
    </div>
  );
}
