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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'bg-graphite-950/95 backdrop-blur-md border-b border-white/[0.08]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Identifier */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="group flex items-baseline space-x-2 text-warm-white transition-opacity hover:opacity-85"
          >
            <span className="font-display font-bold tracking-tight text-base uppercase">
              HOPEPITOME
            </span>
            <span className="text-white/30 text-xs font-mono font-normal">/</span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-stone">
              DIGITAL STUDIO
            </span>
          </Link>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-cobalt-blue/40 text-cobalt-blue bg-cobalt-blue/10 ml-2">
            NEXORA & ELEVORA
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center space-x-7 text-xs font-mono tracking-wider uppercase"
          aria-label="Main Navigation"
        >
          <a
            href="#hero"
            className="text-stone-light hover:text-warm-white transition-colors"
          >
            Home
          </a>
          <a
            href="#nexora"
            className="text-stone-light hover:text-warm-white transition-colors flex items-center space-x-1 group"
          >
            <span className="text-cobalt-blue text-[10px] group-hover:translate-x-0.5 transition-transform">01</span>
            <span>Business Services</span>
          </a>
          <a
            href="#elevora"
            className="text-stone-light hover:text-warm-white transition-colors flex items-center space-x-1 group"
          >
            <span className="text-cobalt-blue text-[10px] group-hover:translate-x-0.5 transition-transform">02</span>
            <span>Career Services</span>
          </a>
          <a
            href="#work"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            Our Work
          </a>
          <a
            href="#process"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#contact"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop CTA Action */}
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="#contact"
            className="group relative inline-flex items-center space-x-2 px-4 py-2 border border-white/20 text-xs font-mono tracking-wider uppercase text-warm-white bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt-blue group-hover:scale-125 transition-transform" />
            <span>Tell Us What You Need</span>
            <span className="text-muted-stone text-[10px] group-hover:text-warm-white transition-colors">→</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-stone-light hover:text-warm-white border border-white/10 font-mono text-xs uppercase tracking-widest flex items-center space-x-2"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          <span className="text-cobalt-blue text-sm">{mobileMenuOpen ? '✕' : '≡'}</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bg-graphite-950/98 border-b border-white/10 px-6 py-8 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-5 text-sm font-mono tracking-wider uppercase">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-stone-light hover:text-warm-white"
            >
              <span>Home</span>
              <span className="text-muted-stone text-xs">Top</span>
            </a>
            <a
              href="#nexora"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-stone-light hover:text-warm-white"
            >
              <span>01 / Business Services (Nexora)</span>
              <span className="text-cobalt-blue">→</span>
            </a>
            <a
              href="#elevora"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-stone-light hover:text-warm-white"
            >
              <span>02 / Career Services (Elevora)</span>
              <span className="text-cobalt-blue">→</span>
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>All Services & Capabilities</span>
              <span className="text-muted-stone text-xs">Index</span>
            </a>
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>Our Work</span>
              <span className="text-muted-stone text-xs">Prototypes</span>
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>How It Works</span>
              <span className="text-muted-stone text-xs">5 Steps</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center border border-cobalt-blue text-warm-white bg-cobalt-blue/15 hover:bg-cobalt-blue/25 transition-colors mt-2 text-xs font-mono tracking-wider font-bold"
            >
              Tell Us What You Need →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
