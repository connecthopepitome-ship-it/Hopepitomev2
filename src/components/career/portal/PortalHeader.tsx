'use client';

import React from 'react';
import Link from 'next/link';
import { useCareerAuth } from './AuthContext';
import { Bell, LogOut, User, FileText, Compass, MessageSquare } from 'lucide-react';

export function PortalHeader() {
  const { user, client, signOut } = useCareerAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E6E2DC]/80 shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/career-services" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#17243B] flex items-center justify-center text-white font-bold text-sm tracking-wider">
              HP
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-[#17243B] block leading-none">
                Hopepitome
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#8172A8] font-medium block mt-0.5">
                Client Career Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 pl-6 border-l border-[#E6E2DC]">
            <Link
              href="/career-services/portal/dashboard"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Dashboard
            </Link>
            <Link
              href="/career-services/portal/onboarding"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Career Profile
            </Link>
            <Link
              href="/career-services/portal/orders"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              My Orders & Progress
            </Link>
            <Link
              href="/career-services/portal/documents"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Documents Vault
            </Link>
            <Link
              href="/career-services/portal/messages"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#292D36] hover:text-[#17243B] hover:bg-[#F7F5F0] transition"
            >
              Messages
            </Link>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {client && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#F7F5F0] text-[#17243B] border border-[#E6E2DC]">
              {client.clientCode}
            </span>
          )}

          <div className="flex items-center gap-2 pl-2">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-semibold text-[#17243B]">
                {client?.fullName || user?.displayName || user?.email?.split('@')[0]}
              </span>
              <span className="block text-[10px] text-[#777781] truncate max-w-[150px]">
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
      </div>
    </header>
  );
}

