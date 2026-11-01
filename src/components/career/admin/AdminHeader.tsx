'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';
import { LogOut, ShieldCheck, Search, Bell, Menu, X, ArrowUpRight } from 'lucide-react';
import type { UserRole } from '@/lib/career/types';

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export function AdminHeader({ onToggleMobileMenu, isMobileMenuOpen }: AdminHeaderProps) {
  const { user, adminProfile, role, signOut, switchRolePreview } = useAdminAuth();
  const pathname = usePathname();

  const rolesList: { value: UserRole; label: string }[] = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'writer', label: 'Resume Writer' },
    { value: 'job_search_exec', label: 'Job Search Exec' },
    { value: 'portfolio_dev', label: 'Portfolio Dev' },
    { value: 'finance', label: 'Finance' },
  ];

  const primaryNav = [
    { label: 'Project Hub', href: '/career-services/admin/projects' },
    { label: 'Customer 360', href: '/career-services/admin/clients' },
    { label: 'Service Catalog', href: '/career-services/admin/services' },
    { label: 'Task Board', href: '/career-services/admin/tasks' },
    { label: 'Quotations', href: '/career-services/admin/crm/quotations' },
    { label: 'SLA Support', href: '/career-services/admin/support' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E0E3E5] shadow-[0_1px_3px_rgba(0,35,111,0.03)] font-['Manrope',sans-serif]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-4 lg:gap-6">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 -ml-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link href="/career-services/admin/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#00236F] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
              HP
            </div>
            <div className="hidden sm:block">
              <span className="text-[15px] font-bold tracking-tight text-[#00236F] block leading-none font-['Plus_Jakarta_Sans',sans-serif]">
                Hopepitome
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5">
                OPERATIONS SUITE v2.4
              </span>
            </div>
          </Link>

          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
            OPERATIONS SUITE v2.4
          </span>

          <div className="h-5 w-[1px] bg-slate-200 hidden lg:block" />

          {/* Top Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 h-14">
            {primaryNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-4 text-[13px] font-semibold transition border-b-2 flex items-center ${
                    isActive
                      ? 'text-[#00236F] border-[#00236F]'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Controls, Telemetry & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Live Telemetry Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              PROD-LIVE
            </span>
          </div>

          {/* Role Preview Selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00236F]" />
            <select
              value={role}
              onChange={(e) => switchRolePreview && switchRolePreview(e.target.value as UserRole)}
              className="bg-transparent text-[11px] font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r.value} value={r.value}>
                  Role: {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
              {(adminProfile?.displayName || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden lg:block">
              <span className="block text-[13px] font-bold text-slate-900 leading-tight">
                {adminProfile?.displayName || user?.email?.split('@')[0] || 'Staff'}
              </span>
              <span className="block text-[11px] text-slate-500 truncate max-w-[130px]">
                {user?.email}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
