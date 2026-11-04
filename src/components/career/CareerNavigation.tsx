'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Sparkles, User, Shield } from 'lucide-react';

const navItems = [
  { label: 'Free Resume Checker', href: '#resume-checker' },
  { label: 'Services', href: '#services' },
  { label: 'Why Hopepitome', href: '#why-us' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faqs' },
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5F2FF]/90 backdrop-blur-md shadow-sm border-b border-[#7357F5]/10'
          : 'bg-[#F5F2FF]/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Studio Pill */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2.5 text-[#17152F] hover:opacity-90 transition-opacity"
            >
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#17152F]">
                HOPEPITOME
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-[#7357F5] to-[#9B6BFF] text-white uppercase shadow-sm">
                Career Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Career Navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-xs sm:text-sm font-semibold text-[#24233A]/80 hover:text-[#7357F5] transition-colors relative py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/career-services/portal/login"
              className="text-xs font-bold text-[#17152F] hover:text-[#7357F5] px-3.5 py-2 rounded-xl border border-[#7357F5]/20 bg-white/80 hover:bg-white transition shadow-sm flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#7357F5]" />
              <span>Client Portal</span>
            </Link>

            <Link
              href="/career-services/admin/login"
              className="text-xs font-bold text-[#24233A]/70 hover:text-[#17152F] px-3 py-2 rounded-xl hover:bg-white/60 transition"
              title="Staff & Consultant Login"
            >
              Staff Sign In
            </Link>

            <a
              href="#intake"
              onClick={(e) => scrollToSection(e, '#intake')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-md shadow-[#7357F5]/25 transition-all transform active:scale-95"
            >
              <span>Build My Profile</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden space-x-2">
            <a
              href="#intake"
              onClick={(e) => scrollToSection(e, '#intake')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7357F5]"
            >
              Get Started
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#17152F] hover:bg-white/70 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-[#7357F5]/10 bg-[#F5F2FF] space-y-3">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-[#24233A] hover:bg-white/70 transition"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#7357F5]/10 flex flex-col space-y-2">
              <Link
                href="/career-services/portal/login"
                className="px-3 py-2 text-xs font-semibold text-[#17152F] bg-white rounded-xl border border-[#7357F5]/20 text-center"
              >
                Client Portal Login
              </Link>
              <Link
                href="/career-services/admin/login"
                className="px-3 py-2 text-xs font-semibold text-[#24233A]/70 text-center hover:text-[#17152F]"
              >
                Staff Workspace Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
