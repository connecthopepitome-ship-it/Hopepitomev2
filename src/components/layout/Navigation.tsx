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
          ? 'bg-[#07080B]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo & Identifier */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="group flex items-baseline space-x-2 text-warm-white transition-opacity hover:opacity-90"
          >
            <span className="font-display font-extrabold tracking-tight text-lg uppercase text-white">
              HOPEPITOME
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF]" />
            <span className="text-white/20 text-xs font-mono font-normal">/</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-stone">
              DIGITAL STUDIO
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-mono tracking-wider uppercase"
          aria-label="Main Navigation"
        >
          <a
            href="#hero"
            className="text-stone-light hover:text-white transition-colors"
          >
            Home
          </a>
          <a
            href="#services"
            className="text-stone-light hover:text-white transition-colors"
          >
            What We Build
          </a>
          <a
            href="#transformations"
            className="text-stone-light hover:text-white transition-colors"
          >
            Solutions
          </a>
          <a
            href="#process"
            className="text-stone-light hover:text-white transition-colors"
          >
            Our Approach
          </a>
          <a
            href="#about"
            className="text-stone-light hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-stone-light hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Action CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="#contact"
            className="group relative inline-flex items-center space-x-2 px-4 py-2 border border-[#8B6CFF]/40 text-xs font-mono tracking-wider uppercase text-warm-white bg-[#101116]/60 hover:bg-[#8B6CFF] hover:text-[#07080B] hover:border-[#8B6CFF] transition-all duration-300 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF] group-hover:bg-[#07080B] transition-colors" />
            <span className="font-semibold">Discuss Your Project</span>
            <span className="text-[10px] group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-light hover:text-white border border-white/10 bg-[#101116]/60 backdrop-blur-md font-mono text-xs uppercase tracking-widest flex items-center space-x-2"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          <span className="text-[#8B6CFF] text-sm">{mobileMenuOpen ? '✕' : '≡'}</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-[#07080B]/98 border-b border-white/10 px-6 py-8 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-4 text-sm font-mono tracking-wider uppercase">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-white/[0.06] text-stone-light hover:text-white"
            >
              <span>Home</span>
              <span className="text-muted-stone text-xs">Top</span>
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-white/[0.06] text-stone-light hover:text-white"
            >
              <span>What We Build</span>
              <span className="text-[#8B6CFF]">01</span>
            </a>
            <a
              href="#transformations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-white/[0.06] text-stone-light hover:text-white"
            >
              <span>Connected Solutions</span>
              <span className="text-[#8B6CFF]">02</span>
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-white/[0.06] text-stone-light hover:text-white"
            >
              <span>Our Approach</span>
              <span className="text-[#8B6CFF]">03</span>
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 border-b border-white/[0.06] text-stone-light hover:text-white"
            >
              <span>About Hopepitome</span>
              <span className="text-muted-stone text-xs">Studio</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2.5 text-stone-light hover:text-white"
            >
              <span>Contact & Project Intake</span>
              <span className="text-[#8B6CFF]">→</span>
            </a>
            <div className="pt-4">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 bg-[#8B6CFF] text-[#07080B] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
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
