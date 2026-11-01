'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const footerNav = [
  { label: 'Career Services', href: '#services' },
  { label: 'Why Hopepitome', href: '#why-us' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Client Portal', href: '/career-services/portal/login' },
  { label: 'Staff Workspace', href: '/career-services/admin/login' },
];

export function CareerFooter() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#17152F] text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand & Studio Mission */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <span className="font-extrabold text-xl tracking-tight text-white">
                HOPEPITOME
              </span>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7357F5] to-[#9B6BFF] text-white uppercase">
                Career Studio
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md font-sans">
              Modern digital career branding for ambitious professionals. Executive resumes, ATS optimisation, LinkedIn positioning, portfolio websites, and managed job search assistance.
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#9B6BFF] hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-colors"
              >
                <span>Visit Hopepitome Software & Business Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Studio Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              {footerNav.slice(0, 3).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollTo(e, item.href)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Access Portals */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Authorized Portals
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              {footerNav.slice(3).map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Legal, Confidentiality & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Hopepitome Career Services. All rights reserved. Strictly confidential client data protection.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-white transition-colors">
              Technology Studio
            </Link>
            <span>·</span>
            <Link href="/career-services/portal/login" className="hover:text-white transition-colors">
              Client Portal
            </Link>
            <span>·</span>
            <Link href="/career-services/admin/login" className="hover:text-white transition-colors">
              Staff Sign In
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
