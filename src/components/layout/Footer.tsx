'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BriefcaseBusiness, Linkedin, MapPin, Mail } from 'lucide-react';

export function Footer() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#07080C] pt-14 sm:pt-18 pb-10 sm:pb-12 border-t border-white/10 text-xs text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Column 1 — Brand */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block focus:outline-none">
              <Image
                src="/brand/epitome-logo-white.png"
                alt="HopEpitome Strategics"
                width={170}
                height={57}
                className="h-8 sm:h-9 w-auto object-contain"
                priority={false}
              />
            </Link>

            <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed max-w-sm">
              We build websites and smart business systems that make your work easier. From high-converting web stores to custom operational applications and automation workflows.
            </p>

            <div className="pt-1">
              <Link
                href="/career-services"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E8E2FF] hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
              >
                <BriefcaseBusiness className="w-3.5 h-3.5 text-[#9D85FF]" />
                <span>Visit Career Studio &amp; ATS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-white font-bold block uppercase tracking-wider text-xs font-mono">
              Quick Links
            </span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => scrollTo(e, '#hero')}
                  className="hover:text-white transition-colors inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => scrollTo(e, '#how-it-works')}
                  className="hover:text-white transition-colors inline-block"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#what-we-build"
                  onClick={(e) => scrollTo(e, '#what-we-build')}
                  className="hover:text-white transition-colors inline-block"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  onClick={(e) => scrollTo(e, '#portfolio')}
                  className="hover:text-white transition-colors inline-block"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#discuss-project"
                  onClick={(e) => scrollTo(e, '#discuss-project')}
                  className="hover:text-white transition-colors inline-block"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 — Contact Information */}
          <div className="lg:col-span-4 space-y-3.5">
            <span className="text-white font-bold block uppercase tracking-wider text-xs font-mono">
              Contact
            </span>
            <div className="space-y-3 text-xs">
              <div>
                <a
                  href="mailto:service@hopepitome.com"
                  className="inline-flex items-center space-x-2 text-slate-200 hover:text-white font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#9D85FF] shrink-0" />
                  <span className="underline-offset-4 hover:underline">service@hopepitome.com</span>
                </a>
              </div>

              <div>
                <a
                  href="https://in.linkedin.com/company/hopepitome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-slate-300 hover:text-[#9D85FF] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#9D85FF] shrink-0" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </div>

              <div className="inline-flex items-center space-x-2 text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#9D85FF] shrink-0" />
                <span>India | UAE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Hopepitome. All rights reserved.
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
