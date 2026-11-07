'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ScanSearch,
  FilePenLine,
  BriefcaseBusiness,
  UserRound,
  KeyRound,
  ChevronRight,
  ShieldCheck,
  House,
} from 'lucide-react';

interface CareerStudioHeaderProps {
  activeSection?: string;
}

export function CareerStudioHeader({ activeSection }: CareerStudioHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/career-services', exact: true },
    { label: 'Scan Resume', href: '/career-services#resume-checker', isScan: true },
    { label: 'Resume Writing', href: '/career-services/resume-writing' },
    { label: 'Services', href: '/career-services/services' },
  ];

  const handleScanClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/career-services') {
      e.preventDefault();
      const el = document.getElementById('resume-checker');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#7454F5]/10'
            : 'bg-[#F8F7FC]/90 backdrop-blur-sm border-b border-slate-200/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-16 lg:h-18">
            {/* Brand Logo & Career Studio Identification */}
            <div className="flex items-center space-x-2.5">
              <Link
                href="/career-services"
                className="flex items-center space-x-2.5 text-[#17152F] hover:opacity-95 transition-opacity"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#7454F5] to-[#A78BFA] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#7454F5]/30">
                  H
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#17152F]">
                      HOPEPITOME
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#7454F5]/10 text-[#7454F5] uppercase">
                      Studio
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6" aria-label="Career Studio Navigation">
              {navLinks.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href) || (item.isScan && activeSection === 'scan');

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={item.isScan ? handleScanClick : undefined}
                    className={`text-xs sm:text-sm font-semibold transition-colors py-1 ${
                      isActive
                        ? 'text-[#7454F5] font-bold'
                        : 'text-[#201D36]/80 hover:text-[#7454F5]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Link
                href="/career-services/access-report"
                className="text-xs sm:text-sm font-semibold text-[#71778A] hover:text-[#7454F5] transition-colors flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4 text-[#7454F5]" strokeWidth={1.9} />
                <span>Access Report</span>
              </Link>
            </nav>

            {/* Action CTAs (Desktop) */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                href="/career-services/portal/login"
                className="text-xs font-bold text-[#201D36] hover:text-[#7454F5] px-3.5 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-xs flex items-center gap-1.5"
              >
                <UserRound className="w-4 h-4 text-[#7454F5]" strokeWidth={1.9} />
                <span>Candidate Portal</span>
              </Link>

              <Link
                href="/career-services#resume-checker"
                onClick={handleScanClick}
                className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] shadow-sm shadow-[#7454F5]/25 transition active:scale-95"
              >
                <ScanSearch className="w-4 h-4 mr-1.5" strokeWidth={1.9} />
                <span>Scan Resume Free</span>
              </Link>
            </div>

            {/* Mobile Header Right Actions */}
            <div className="flex items-center lg:hidden space-x-2">
              <Link
                href="/career-services#resume-checker"
                onClick={handleScanClick}
                className="px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-bold text-white bg-[#7454F5] flex items-center gap-1.5 shadow-xs"
              >
                <ScanSearch className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Scan Free</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-[#17152F] bg-white border border-slate-200 shadow-xs active:bg-slate-100 focus:outline-none"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.9} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={1.9} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over App Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Surface */}
          <div className="relative bg-[#F8F7FC] rounded-t-3xl max-h-[85vh] overflow-y-auto w-full p-5 shadow-2xl border-t border-white/60 animate-in slide-in-from-bottom duration-200">
            {/* Pull Bar */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#7454F5] text-white flex items-center justify-center font-black text-xs">
                  H
                </div>
                <div>
                  <span className="font-bold text-sm text-[#17152F] block leading-tight">Career Studio</span>
                  <span className="text-[10px] text-[#71778A]">Hopepitome Career-Tech</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" strokeWidth={1.9} />
              </button>
            </div>

            {/* Two Primary Action Shortcuts */}
            <div className="py-3 grid grid-cols-2 gap-2 border-b border-slate-200">
              <Link
                href="/career-services#resume-checker"
                onClick={handleScanClick}
                className="p-3 rounded-xl bg-white border border-[#7454F5]/30 shadow-xs flex flex-col justify-between"
              >
                <div className="w-7 h-7 rounded-lg bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center mb-1">
                  <ScanSearch className="w-4 h-4" strokeWidth={1.9} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#149B75] uppercase tracking-wider block">Free Tool</span>
                  <span className="text-xs font-bold text-[#17152F]">Scan Resume</span>
                </div>
              </Link>

              <Link
                href="/career-services/resume-writing"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div className="w-7 h-7 rounded-lg bg-[#17152F]/10 text-[#17152F] flex items-center justify-center mb-1">
                  <FilePenLine className="w-4 h-4" strokeWidth={1.9} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#7454F5] uppercase tracking-wider block">Custom Quote</span>
                  <span className="text-xs font-bold text-[#17152F]">Resume Writing</span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="py-3 space-y-1">
              <Link
                href="/career-services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#201D36] hover:bg-white active:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <House className="w-4 h-4 text-[#71778A]" strokeWidth={1.9} />
                  <span>Career Studio Home</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={1.9} />
              </Link>

              <Link
                href="/career-services/services"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#201D36] hover:bg-white active:bg-slate-100 transition"
              >
                <div className="flex items-center gap-2.5">
                  <BriefcaseBusiness className="w-4 h-4 text-[#7454F5]" strokeWidth={1.9} />
                  <span>All Career Services</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={1.9} />
              </Link>

              <Link
                href="/career-services/access-report"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#7454F5] bg-[#7454F5]/5 hover:bg-[#7454F5]/10 transition"
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4" strokeWidth={1.9} />
                  <span>Access Report with Code</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#7454F5]" strokeWidth={1.9} />
              </Link>
            </nav>

            {/* Portal & Login Actions */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <Link
                href="/career-services/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-[#201D36] bg-white border border-slate-200 shadow-xs"
              >
                <UserRound className="w-4 h-4 text-[#7454F5]" strokeWidth={1.9} />
                <span>Candidate Portal Sign In</span>
              </Link>

              <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-[#71778A]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#149B75]" strokeWidth={1.9} />
                  <span>24-Hour Privacy Retention</span>
                </div>
                <Link
                  href="/career-services/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium hover:text-[#17152F]"
                >
                  Staff Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
