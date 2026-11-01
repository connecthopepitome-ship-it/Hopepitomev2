'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    }
  };

  const navLinks = [
    { label: 'What We Build', href: '#what-we-build' },
    { label: 'See What We Build', href: '#portfolio' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#07080C]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3.5'
            : 'bg-transparent border-b border-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2.5 text-white hover:opacity-90 transition-opacity"
            >
              <span className="font-extrabold tracking-tight text-xl uppercase text-white font-display">
                HOPEPITOME
              </span>
              <span className="w-2 h-2 rounded-full bg-[#9D85FF] shadow-[0_0_8px_#9D85FF] shrink-0" />
              <span className="text-white/20 text-xs font-mono">/</span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hidden xs:inline">
                DIGITAL STUDIO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider uppercase font-medium">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/career-services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8E2FF] hover:text-white transition-colors px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
            >
              <Sparkles className="w-3 h-3 text-[#FFD66B]" />
              <span>Career Studio</span>
            </Link>
          </nav>

          {/* Primary Action CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="#discuss-project"
              onClick={(e) => scrollTo(e, '#discuss-project')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7357F5] via-[#9B6BFF] to-[#7357F5] hover:opacity-95 shadow-md shadow-[#7357F5]/30 transition transform active:scale-95"
            >
              <span>Start Your Project</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden space-x-2">
            <a
              href="#discuss-project"
              onClick={(e) => scrollTo(e, '#discuss-project')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7357F5] shadow-sm"
            >
              Start
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-3 px-4 border-t border-white/10 bg-[#090B12]/95 backdrop-blur-xl space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
                >
                  {item.label}
                </a>
              ))}

              <Link
                href="/career-services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-sm font-bold text-[#E8E2FF] bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD66B]" />
                  <span>Hopepitome Career Studio</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>

            <div className="pt-2 border-t border-white/10 flex flex-col space-y-2">
              <a
                href="#discuss-project"
                onClick={(e) => scrollTo(e, '#discuss-project')}
                className="w-full text-center py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7357F5] to-[#9B6BFF] shadow-md"
              >
                Discuss Your Project
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navigation;
