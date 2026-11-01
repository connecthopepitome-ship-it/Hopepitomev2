'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#07080C] pt-14 sm:pt-20 pb-10 sm:pb-12 border-t border-white/10 text-xs text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-14 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5 text-white">
              <span className="font-extrabold text-xl tracking-tight uppercase font-display">
                HOPEPITOME
              </span>
              <span className="w-2 h-2 rounded-full bg-[#9D85FF] shadow-[0_0_8px_#9D85FF] shrink-0" />
              <span className="text-white/20 text-xs font-mono">/</span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                DIGITAL STUDIO
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              We build websites and smart business systems that make your work easier. From high-converting web stores to custom operational applications and automation workflows.
            </p>

            <div className="pt-2">
              <Link
                href="/career-services"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E8E2FF] hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD66B]" />
                <span>Visit Hopepitome Career Services &amp; Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-white font-bold block uppercase tracking-wider text-xs font-mono">
              WHAT WE BUILD
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#what-we-build"
                  onClick={(e) => scrollTo(e, '#what-we-build')}
                  className="hover:text-white transition-colors"
                >
                  Websites &amp; Online Stores
                </a>
              </li>
              <li>
                <a
                  href="#what-we-build"
                  onClick={(e) => scrollTo(e, '#what-we-build')}
                  className="hover:text-white transition-colors"
                >
                  Custom Business Software
                </a>
              </li>
              <li>
                <a
                  href="#what-we-build"
                  onClick={(e) => scrollTo(e, '#what-we-build')}
                  className="hover:text-white transition-colors"
                >
                  Business Automation Workflows
                </a>
              </li>
              <li>
                <a
                  href="#what-we-build"
                  onClick={(e) => scrollTo(e, '#what-we-build')}
                  className="hover:text-white transition-colors"
                >
                  ERP &amp; CRM Solutions
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Portals Column */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-white font-bold block uppercase tracking-wider text-xs font-mono">
              THE STUDIO
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#portfolio"
                  onClick={(e) => scrollTo(e, '#portfolio')}
                  className="hover:text-white transition-colors"
                >
                  See What We Build (Portfolio)
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollTo(e, '#how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How It Works (4 Steps)
                </a>
              </li>
              <li>
                <a
                  href="#discuss-project"
                  onClick={(e) => scrollTo(e, '#discuss-project')}
                  className="hover:text-white transition-colors"
                >
                  Discuss Your Project
                </a>
              </li>
              <li>
                <Link
                  href="/career-services/portal/login"
                  className="hover:text-white transition-colors"
                >
                  Client Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/career-services/admin/login"
                  className="hover:text-white transition-colors"
                >
                  Staff Workspace
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Hopepitome Studio. Websites, Online Stores &amp; Business Systems.
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#hero"
              onClick={(e) => scrollTo(e, '#hero')}
              className="hover:text-white transition-colors"
            >
              Back to Top ↑
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
