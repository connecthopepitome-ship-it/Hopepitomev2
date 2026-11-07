'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Linkedin, MapPin, Mail } from 'lucide-react';

export function CareerFooter() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#F8F7F4] text-[#17243B] border-t border-[#E5E0D8] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-10 sm:pb-12 border-b border-[#E5E0D8]">
          
          {/* Column 1 — Brand */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/career-services" className="inline-block focus:outline-none">
              <Image
                src="/brand/epitome-logo-dark.png"
                alt="HopEpitome Strategics"
                width={170}
                height={57}
                className="h-8 sm:h-9 w-auto object-contain"
                priority={false}
              />
            </Link>

            <p className="text-[#5A5A66] text-xs sm:text-[13px] leading-relaxed max-w-sm">
              Modern digital career branding for ambitious professionals. Executive resumes, ATS optimisation, LinkedIn positioning, and career advisory services.
            </p>

            <div className="pt-1">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-[#502CBF] hover:text-[#371994] bg-[#7454F5]/10 hover:bg-[#7454F5]/15 px-3.5 py-2 rounded-xl border border-[#7454F5]/20 transition-colors"
              >
                <span>Visit Technology &amp; Business Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[#17243B] font-bold block uppercase tracking-wider text-xs font-mono">
              Quick Links
            </span>
            <ul className="space-y-2.5 text-xs text-[#5A5A66] font-medium">
              <li>
                <Link
                  href="/career-services"
                  className="hover:text-[#7454F5] transition-colors inline-block"
                >
                  Career Home
                </Link>
              </li>
              <li>
                <Link
                  href="/career-services#resume-checker"
                  className="hover:text-[#7454F5] transition-colors inline-block"
                >
                  Resume Scan
                </Link>
              </li>
              <li>
                <Link
                  href="/career-services/resume-writing"
                  className="hover:text-[#7454F5] transition-colors inline-block"
                >
                  Resume Writing
                </Link>
              </li>
              <li>
                <Link
                  href="/career-services/services"
                  className="hover:text-[#7454F5] transition-colors inline-block"
                >
                  Career Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Contact Information */}
          <div className="lg:col-span-4 space-y-3.5">
            <span className="text-[#17243B] font-bold block uppercase tracking-wider text-xs font-mono">
              Contact
            </span>
            <div className="space-y-3 text-xs">
              <div>
                <a
                  href="mailto:service@hopepitome.com"
                  className="inline-flex items-center space-x-2 text-[#17243B] hover:text-[#7454F5] font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#7454F5] shrink-0" />
                  <span className="underline-offset-4 hover:underline">service@hopepitome.com</span>
                </a>
              </div>

              <div>
                <a
                  href="https://in.linkedin.com/company/hopepitome"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[#5A5A66] hover:text-[#7454F5] transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#7454F5] shrink-0" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 text-[#9999A6]" />
                </a>
              </div>

              <div className="inline-flex items-center space-x-2 text-[#6E6D7A] pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#7454F5] shrink-0" />
                <span>India | UAE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#787885]">
          <div>
            © {new Date().getFullYear()} Hopepitome Career Services. All rights reserved.
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/" className="hover:text-[#17243B] transition-colors">
              Technology Studio
            </Link>
            <span>·</span>
            <Link href="/career-services/portal/login" className="hover:text-[#17243B] transition-colors">
              Client Portal
            </Link>
            <span>·</span>
            <Link href="/career-services/admin/login" className="hover:text-[#17243B] transition-colors">
              Staff Sign In
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default CareerFooter;
