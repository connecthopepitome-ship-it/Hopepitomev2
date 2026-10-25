'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Robust mobile body scroll lock with iOS Safari compatibility & Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        triggerButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Focus first menu item when opened for accessibility
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 50);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.touchAction = '';
      };
    }
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
    triggerButtonRef.current?.focus();
  };

  const navLinks = [
    { num: '01', label: 'Home', href: '#hero' },
    { num: '02', label: 'What We Build', href: '#services' },
    { num: '03', label: 'Solutions', href: '#transformations' },
    { num: '04', label: 'Our Approach', href: '#process' },
    { num: '05', label: 'About', href: '#about' },
    { num: '06', label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Primary Fixed Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08090D] border-b border-white/[0.16] shadow-xl shadow-black/50 py-3 sm:py-4'
            : 'bg-[#08090D]/95 border-b border-white/[0.12] shadow-lg shadow-black/30 py-3.5 sm:py-5 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Brand Logo & Identifier */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <Link
              href="/"
              className="group flex items-baseline space-x-2 text-[#F8F9FA] transition-opacity hover:opacity-90 py-1"
              aria-label="Hopepitome Digital Studio Home"
            >
              <span className="font-display font-extrabold tracking-tight text-lg sm:text-xl uppercase text-white">
                HOPEPITOME
              </span>
              <span className="w-2 h-2 rounded-full bg-[#9D85FF] shadow-[0_0_8px_#9D85FF] shrink-0 self-center" />
              <span className="text-white/30 text-xs font-mono font-normal">/</span>
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#9DA3AE] font-medium hidden xs:inline">
                DIGITAL STUDIO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-xs font-mono tracking-wider uppercase font-medium"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.num}
                href={link.href}
                className="text-[#D0D4DC] hover:text-white transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9D85FF]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action CTA */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href="#contact"
              className="group relative inline-flex items-center space-x-2 px-4.5 py-2.5 border border-[#9D85FF]/50 text-xs font-mono tracking-wider uppercase text-[#F8F9FA] bg-[#121520] hover:bg-[#9D85FF] hover:text-[#07080C] hover:border-[#9D85FF] transition-all duration-200 shadow-md shadow-black/40 min-h-[44px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9D85FF] group-hover:bg-[#07080C] transition-colors" />
              <span className="font-semibold">Discuss Your Project</span>
              <span className="text-[11px] group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button (Touch Friendly 44x44px minimum) */}
          <button
            ref={triggerButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden min-w-[44px] min-h-[44px] px-3.5 py-2.5 text-[#F8F9FA] hover:text-white border border-white/20 bg-[#121520] active:bg-[#1A1F30] font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label="Open mobile navigation menu"
          >
            <span className="font-semibold text-[11px]">MENU</span>
            <span className="text-[#9D85FF] text-base leading-none font-bold" aria-hidden="true">
              ≡
            </span>
          </button>
        </div>
      </header>

      {/* Full-Screen Opaque Mobile Navigation Overlay (Solid Surface, Zero Mesh Bleed) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="lg:hidden fixed inset-0 z-[100] bg-[#08090D] flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200 select-none"
        >
          {/* Top Bar inside Overlay */}
          <div className="border-b border-white/[0.14] bg-[#08090D] px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold tracking-tight text-lg uppercase text-white">
                HOPEPITOME
              </span>
              <span className="w-2 h-2 rounded-full bg-[#9D85FF] shadow-[0_0_8px_#9D85FF]" />
              <span className="text-white/30 text-xs font-mono">/</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#9DA3AE] font-semibold">
                MENU
              </span>
            </div>

            {/* Dedicated Accessible Close Button (Min 44x44px) */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                triggerButtonRef.current?.focus();
              }}
              className="min-w-[44px] min-h-[44px] px-3.5 py-2 text-[#F8F9FA] hover:text-white border border-white/25 bg-[#121520] active:bg-[#9D85FF] active:text-[#07080C] font-mono text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-md"
              aria-label="Close mobile navigation menu"
            >
              <span className="font-semibold text-[11px]">CLOSE</span>
              <span className="text-[#9D85FF] text-sm font-bold leading-none" aria-hidden="true">
                ✕
              </span>
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="px-5 py-6 flex-1 flex flex-col justify-center space-y-2 max-w-lg mx-auto w-full">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#9DA3AE] block mb-2 px-3">
              // SITE NAVIGATION
            </span>

            {navLinks.map((item, index) => (
              <a
                key={item.num}
                ref={index === 0 ? firstMenuItemRef : undefined}
                href={item.href}
                onClick={handleLinkClick}
                className="group flex items-center justify-between px-3 py-3.5 rounded-sm border border-transparent hover:border-white/[0.14] hover:bg-[#121520] active:bg-[#171B2B] transition-all min-h-[52px]"
              >
                <div className="flex items-center space-x-3.5">
                  <span className="font-mono text-xs text-[#9D85FF] font-bold group-hover:text-[#E8E2FF]">
                    {item.num}
                  </span>
                  <span className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-[#F8F9FA] group-hover:text-white group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                </div>
                <span className="text-[#9DA3AE] group-hover:text-[#9D85FF] font-mono text-sm transition-colors">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* Bottom Action Area with Full-Width CTA */}
          <div className="p-5 border-t border-white/[0.14] bg-[#0A0C12] space-y-4 max-w-lg mx-auto w-full pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <a
              href="#contact"
              onClick={handleLinkClick}
              className="w-full py-4 bg-[#9D85FF] text-[#07080C] active:bg-[#B4A2FF] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-xl shadow-[#9D85FF]/20 min-h-[48px]"
            >
              <span>Discuss Your Project</span>
              <span className="text-sm font-bold">→</span>
            </a>

            {/* Quick Contact Information */}
            <div className="pt-2 text-center space-y-1 font-mono text-[11px] text-[#9DA3AE]">
              <div className="text-[#D0D4DC]">
                Direct Studio: <span className="text-[#E8E2FF]">studio@hopepitome.com</span>
              </div>
              <div className="text-[10px] text-[#9DA3AE]/80">
                Response guaranteed within one business day
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;
