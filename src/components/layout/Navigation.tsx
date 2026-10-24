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
          ? 'bg-graphite-950/90 backdrop-blur-md border-b border-white/[0.08]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Identifier */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="group flex items-baseline space-x-2 text-warm-white transition-opacity hover:opacity-80"
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
            ONLINE
          </span>
        </div>

        {/* Desktop Editorial Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest uppercase">
          <a
            href="#nexora"
            className="text-stone-light hover:text-warm-white transition-colors flex items-center space-x-1 group"
          >
            <span className="text-cobalt-blue text-[10px] group-hover:translate-x-0.5 transition-transform">01</span>
            <span>NEXORA</span>
          </a>
          <a
            href="#elevora"
            className="text-stone-light hover:text-warm-white transition-colors flex items-center space-x-1 group"
          >
            <span className="text-cobalt-blue text-[10px] group-hover:translate-x-0.5 transition-transform">02</span>
            <span>ELEVORA</span>
          </a>
          <a
            href="#services"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            INDEX
          </a>
          <a
            href="#work"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            WORK
          </a>
          <a
            href="#process"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            PROCESS
          </a>
          <a
            href="#portal"
            className="text-muted-stone hover:text-warm-white transition-colors"
          >
            PORTAL
          </a>
        </nav>

        {/* Desktop CTA Action */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#contact"
            className="group relative inline-flex items-center space-x-2 px-4 py-2 border border-white/20 text-xs font-mono tracking-widest uppercase text-warm-white bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cobalt-blue group-hover:scale-125 transition-transform" />
            <span>START A PROJECT</span>
            <span className="text-muted-stone text-[10px] group-hover:text-warm-white transition-colors">↗</span>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-light hover:text-warm-white border border-white/10 font-mono text-xs uppercase tracking-widest flex items-center space-x-2"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
          <span className="text-cobalt-blue text-sm">{mobileMenuOpen ? '✕' : '≡'}</span>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-graphite-950/98 border-b border-white/10 px-6 py-8 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-6 text-sm font-mono tracking-widest uppercase">
            <a
              href="#nexora"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-stone-light hover:text-warm-white"
            >
              <span>01 / NEXORA — DIGITAL ENG</span>
              <span className="text-cobalt-blue">→</span>
            </a>
            <a
              href="#elevora"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-stone-light hover:text-warm-white"
            >
              <span>02 / ELEVORA — CAREER STUDIO</span>
              <span className="text-cobalt-blue">→</span>
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>SERVICE INDEX</span>
              <span className="text-muted-stone text-xs">09 SERVICES</span>
            </a>
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>SELECTED WORK</span>
              <span className="text-muted-stone text-xs">ARCHIVE</span>
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>HOW WE WORK</span>
              <span className="text-muted-stone text-xs">05 STAGES</span>
            </a>
            <a
              href="#portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] text-muted-stone hover:text-warm-white"
            >
              <span>CLIENT PORTAL</span>
              <span className="text-cobalt-blue text-xs font-mono">ROADMAP</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center border border-cobalt-blue text-warm-white bg-cobalt-blue/10 hover:bg-cobalt-blue/20 transition-colors mt-4 text-xs font-mono tracking-widest"
            >
              START A PROJECT ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
