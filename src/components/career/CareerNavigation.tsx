'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Our Services', href: '#services' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Packages', href: '#packages' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact', href: '#contact' },
];

export function CareerNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F7F5F0]/95 backdrop-blur-md shadow-sm border-b border-[#E6E2DC]'
          : 'bg-transparent border-b border-[#E6E2DC]/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Context Tag */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-baseline space-x-2 text-[#17243B] hover:opacity-85 transition-opacity"
            >
              <span className="font-display font-extrabold text-xl tracking-tight text-[#17243B]">
                HOPEPITOME
              </span>
              <span className="text-xs font-mono font-medium tracking-widest text-[#8172A8] uppercase">
                / CAREER
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Career Navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#292D36] hover:text-[#17243B] transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8172A8] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Primary CTA & Back to Main Studio */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs font-mono font-medium text-[#777781] hover:text-[#17243B] transition-colors inline-flex items-center gap-1"
            >
              Business Tech Studio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-[#17243B] text-white hover:bg-[#292D36] active:scale-95 transition-all shadow-sm"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden space-x-3">
            <a
              href="#contact"
              className="sm:inline-flex hidden px-4 py-2 rounded-full text-xs font-semibold uppercase bg-[#17243B] text-white"
            >
              Get Started
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#17243B] hover:bg-[#E6E2DC]/50 focus:outline-none focus:ring-2 focus:ring-[#8172A8]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer (Opaque & High Contrast) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F5F0] border-b border-[#E6E2DC] shadow-xl px-6 pt-4 pb-8 space-y-4">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#17243B] hover:text-[#8172A8] py-2 border-b border-[#E6E2DC]/50 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 flex flex-col space-y-3">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-sm font-semibold uppercase tracking-wider bg-[#17243B] text-white shadow-sm"
            >
              Get Started
            </a>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-xs font-mono font-medium text-[#777781] hover:text-[#17243B] border border-[#E6E2DC] inline-flex items-center justify-center gap-1.5"
            >
              Return to Business Tech Homepage
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

