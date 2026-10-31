'use client';

import React from 'react';
import Link from 'next/link';
import { useAdminAuth } from './AdminAuthContext';
import { LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import type { UserRole } from '@/lib/career/types';

export function AdminHeader() {
  const { user, adminProfile, role, signOut, switchRolePreview } = useAdminAuth();

  const rolesList: { value: UserRole; label: string }[] = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'writer', label: 'Resume Writer' },
    { value: 'job_search_exec', label: 'Job Search Exec' },
    { value: 'portfolio_dev', label: 'Portfolio Dev' },
    { value: 'finance', label: 'Finance' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/career-services/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#17243B] flex items-center justify-center text-white font-bold text-sm tracking-wider">
              HP
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-[#17243B] block leading-none">
                Hopepitome
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#8172A8] font-bold block mt-0.5">
                Staff Operations Platform
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 pl-6 border-l border-[#E6E2DC]">
            <Link
              href="/career-services/admin/dashboard"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Dashboard
            </Link>
            <Link
              href="/career-services/admin/clients"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Clients (360°)
            </Link>
            <Link
              href="/career-services/admin/orders"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Service Orders
            </Link>
            <Link
              href="/career-services/admin/tasks"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Tasks
            </Link>
            <Link
              href="/career-services/admin/deliverables"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Deliverables
            </Link>
            <Link
              href="/career-services/admin/revisions"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Revisions
            </Link>
            <Link
              href="/career-services/admin/finance"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Finance
            </Link>
          </nav>
        </div>

        {/* Right side role switch & user badge */}
        <div className="flex items-center gap-3">
          {/* Role selector for operations testing */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#F7F5F0] px-2.5 py-1 rounded-xl border border-[#E6E2DC]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8172A8]" />
            <select
              value={role}
              onChange={(e) => switchRolePreview && switchRolePreview(e.target.value as UserRole)}
              className="bg-transparent text-[11px] font-semibold text-[#17243B] focus:outline-none cursor-pointer"
            >
              {rolesList.map((r) => (
                <option key={r.value} value={r.value}>
                  Role: {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right hidden sm:block pl-2">
            <span className="block text-xs font-semibold text-[#17243B]">
              {adminProfile?.displayName || user?.email?.split('@')[0] || 'Staff'}
            </span>
            <span className="block text-[10px] text-[#777781] truncate max-w-[140px]">
              {user?.email}
            </span>
          </div>

          <button
            onClick={() => signOut()}
            title="Sign Out"
            className="p-2 rounded-lg text-[#777781] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

