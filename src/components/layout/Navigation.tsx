'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07080C]/92 backdrop-blur-md border-b border-white/[0.14] shadow-xl shadow-black/40'
          : 'bg-[#07080C]/60 backdrop-blur-sm border-b border-white/[0.08]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo & Identifier */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="group flex items-baseline space-x-2 text-[#F8F9FA] transition-opacity hover:opacity-90"
          >
            <span className="font-display font-extrabold tracking-tight text-lg uppercase text-white">
              HOPEPITOME
            </span>
            <span className="w-2 h-2 rounded-full bg-[#9D85FF] shadow-[0_0_8px_#9D85FF]" />
            <span className="text-white/30 text-xs font-mono font-normal">/</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#9DA3AE] font-medium">
              DIGITAL STUDIO
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-mono tracking-wider uppercase font-medium"
          aria-label="Main Navigation"
        >
          <a
            href="#hero"
            className="text-[#D0D4DC] hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#services"
            className="text-[#D0D4DC] hover:text-white transition-colors"
          >
            What We Build
          </a>
          <a
            href="#transformations"
            className="text-[#D0D4DC] hover:text-white transition-colors"
          >
            Solutions
          </a>
          <a
            href="#process"
            className="text-[#D0D4DC] hover:text-white transition-colors"
          >
            Our Approach
          </a>
          <a
            href="#about"
            className="text-[#D0D4DC] hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-[#D0D4DC] hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Action CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="#contact"
            className="group relative inline-flex items-center space-x-2.5 px-4.5 py-2.5 border border-[#9D85FF]/50 text-xs font-mono tracking-wider uppercase text-[#F8F9FA] bg-[#121520]/90 hover:bg-[#9D85FF] hover:text-[#07080C] hover:border-[#9D85FF] transition-all duration-200 shadow-md shadow-black/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#9D85FF] group-hover:bg-[#07080C] transition-colors" />
            <span className="font-semibold">Discuss Your Project</span>
            <span className="text-[11px] group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden px-3 py-2 text-[#F8F9FA] hover:text-white border border-white/20 bg-[#121520]/90 font-mono text-xs uppercase tracking-widest flex items-center space-x-2"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="font-semibold">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          <span className="text-[#9D85FF] text-sm font-bold">{mobileMenuOpen ? '✕' : '≡'}</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-[#07080C]/98 border-b border-white/20 px-6 py-8 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-4 text-sm font-mono tracking-wider uppercase">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/[0.1] text-[#D0D4DC] hover:text-white"
            >
              <span>Home</span>
              <span className="text-[#9DA3AE] text-xs">Top</span>
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/[0.1] text-[#D0D4DC] hover:text-white"
            >
              <span>What We Build</span>
              <span className="text-[#9D85FF] font-bold">01</span>
            </a>
            <a
              href="#transformations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/[0.1] text-[#D0D4DC] hover:text-white"
            >
              <span>Connected Solutions</span>
              <span className="text-[#9D85FF] font-bold">02</span>
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/[0.1] text-[#D0D4DC] hover:text-white"
            >
              <span>Our Approach</span>
              <span className="text-[#9D85FF] font-bold">03</span>
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 border-b border-white/[0.1] text-[#D0D4DC] hover:text-white"
            >
              <span>About Hopepitome</span>
              <span className="text-[#9DA3AE] text-xs">Studio</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 text-[#D0D4DC] hover:text-white"
            >
              <span>Contact & Project Intake</span>
              <span className="text-[#9D85FF] font-bold">→</span>
            </a>
            <div className="pt-4">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 bg-[#9D85FF] text-[#07080C] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#B4A2FF] transition-colors shadow-lg shadow-[#9D85FF]/20"
              >
                <span>Discuss Your Project</span>
                <span>→</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navigation;
