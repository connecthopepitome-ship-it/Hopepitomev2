'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCareerAuth } from './AuthContext';
import { PortalHeader } from './PortalHeader';
import Link from 'next/link';
import {
  LayoutDashboard,
  UserCheck,
  Briefcase,
  FileBox,
  Receipt,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading, client, profile } = useCareerAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/career-services/portal/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-[#777781] tracking-wide">
            Securing Career Session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const navLinks = [
    { label: 'Overview', href: '/career-services/portal/dashboard', icon: LayoutDashboard },
    { label: 'Career Profile Intake', href: '/career-services/portal/onboarding', icon: UserCheck },
    { label: 'Active Orders & Work', href: '/career-services/portal/orders', icon: Briefcase },
    { label: 'Document Vault', href: '/career-services/portal/documents', icon: FileBox },
    { label: 'Consultant Messages', href: '/career-services/portal/messages', icon: MessageSquare },
    { label: 'Invoices & Billing', href: '/career-services/portal/invoices', icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#292D36] flex flex-col font-sans selection:bg-[#8172A8]/20 selection:text-[#17243B]">
      <PortalHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          {/* Client badge card */}
          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#17243B] text-white flex items-center justify-center font-bold text-sm">
                {(client?.fullName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold text-[#17243B] truncate">
                  {client?.fullName || user.displayName || 'Career Client'}
                </h3>
                <p className="text-[11px] font-mono text-[#8172A8]">
                  ID: {client?.clientCode || 'PROVISIONAL'}
                </p>
              </div>
            </div>

            {/* Profile Status Badge */}
            <div className="mt-4 pt-3 border-t border-[#E6E2DC]/60">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-[#777781] font-medium">Profile Method</span>
                <span className="font-semibold text-[#17243B]">
                  {profile?.inputMethod === 'RESUME_UPLOAD'
                    ? 'Resume Upload'
                    : profile?.inputMethod === 'MANUAL_ENTRY'
                    ? 'Manual Form'
                    : 'Flexible'}
                </span>
              </div>
              <div className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF8FC] border border-[#E6E2DC] text-[#17243B] font-medium">
                {profile?.status === 'RESUME_RECEIVED'
                  ? 'Resume Received ✓'
                  : profile?.status === 'ADDITIONAL_INFO_REQUESTED'
                  ? 'Action Requested ⚠️'
                  : profile?.status === 'APPROVED' || profile?.status === 'READY_FOR_SERVICE'
                  ? 'Profile Approved ✓'
                  : profile?.status === 'PARTIALLY_COMPLETED' || profile?.status === 'IN_PROGRESS'
                  ? 'Partially Saved'
                  : 'Start at your pace'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-0.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#17243B] text-white shadow-sm'
                      : 'text-[#292D36] hover:bg-[#F7F5F0] hover:text-[#17243B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8172A8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </Link>
              );
            })}
          </nav>

          {/* New Service Order Promo Card */}
          <div className="bg-gradient-to-br from-[#17243B] to-[#292D36] text-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A69ACB] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Solutions</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed mb-3">
              Need a resume rewrite, ATS keyword overhaul, or LinkedIn revamp?
            </p>
            <Link
              href="/career-services/portal/orders/new"
              className="inline-flex items-center justify-center w-full px-3 py-2 rounded-lg bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-medium transition"
            >
              Order New Service
            </Link>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-[11px] text-[#777781] px-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8172A8]" />
            <span>Strict Client Confidentiality</span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

