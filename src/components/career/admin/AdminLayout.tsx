'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';
import { AdminHeader } from './AdminHeader';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  FileBox,
  RotateCcw,
  Receipt,
  History,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAuthorized } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAuthorized)) {
      router.push('/career-services/admin/login');
    }
  }, [user, loading, isAuthorized, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-[#777781] tracking-wide">
            Verifying Staff Authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  const navItems = [
    { label: 'Operations Dashboard', href: '/career-services/admin/dashboard', icon: LayoutDashboard },
    { label: 'Client Directory (360°)', href: '/career-services/admin/clients', icon: Users },
    { label: 'Service Orders Pipeline', href: '/career-services/admin/orders', icon: Briefcase },
    { label: 'Staff Task Board', href: '/career-services/admin/tasks', icon: CheckSquare },
    { label: 'Deliverables & Drafts', href: '/career-services/admin/deliverables', icon: FileBox },
    { label: 'Revisions Queue', href: '/career-services/admin/revisions', icon: RotateCcw },
    { label: 'Finance & Invoices', href: '/career-services/admin/finance', icon: Receipt },
    { label: 'Audit Trail & Logs', href: '/career-services/admin/audit', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#292D36] flex flex-col font-sans selection:bg-[#8172A8]/20 selection:text-[#17243B]">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#777781] px-3 py-1 block">
              Operations Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
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
          </div>

          {/* Security alert indicator */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A69ACB]">
              <ShieldAlert className="w-4 h-4" />
              <span>Privileged Console</span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              All client inspections, document approvals, and billing changes are permanently audited.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

