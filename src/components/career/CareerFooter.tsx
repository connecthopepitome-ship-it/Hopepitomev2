'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const footerNav = [
  { label: 'Home (Main Studio)', href: '/' },
  { label: 'Our Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Packages & Pricing', href: '#packages' },
  { label: 'Sample Showcase', href: '#showcase' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Get Started', href: '#contact' },
];

export function CareerFooter() {
  return (
    <footer className="bg-[#17243B] text-white border-t border-[#292D36] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-baseline space-x-2">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                HOPEPITOME
              </span>
              <span className="text-xs font-mono font-medium tracking-widest text-[#A69ACB] uppercase">
                / CAREER SERVICES
              </span>
            </div>

            <p className="text-sm text-[#F7F5F0]/80 leading-relaxed max-w-md font-sans">
              Helping professionals present their experience and take their next career step with
              confidence. From professionally written resumes and ATS optimisation to LinkedIn
              profiles, personal portfolio websites, and job search assistance.
            </p>

            {/* Back to Business Studio Callout Box */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-xs font-mono font-medium text-[#A69ACB] hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors"
              >
                <span>Visit Hopepitome Business Technology & Software Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A69ACB] font-semibold">
              Career Navigation
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#F7F5F0]/75">
              {footerNav.slice(0, 4).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#A69ACB] font-semibold">
              Resources & Enquiry
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#F7F5F0]/75">
              {footerNav.slice(4).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Legal, Confidentiality & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#F7F5F0]/60">
          <div>
            © {new Date().getFullYear()} Hopepitome. All rights reserved. Professional career
            branding, resumes, and portfolio websites.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:text-white transition-colors">
              Business Tech Studio
            </Link>
            <span>·</span>
            <a href="#contact" className="hover:text-white transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
