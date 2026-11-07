'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, ScanSearch, BriefcaseBusiness, UserRound } from 'lucide-react';
import { useCareerAuth } from './portal/AuthContext';

interface CareerBottomNavProps {
  className?: string;
  hideOnLogin?: boolean;
}

export function CareerBottomNav({ className = '', hideOnLogin = true }: CareerBottomNavProps) {
  const pathname = usePathname();
  const { user } = useCareerAuth();

  // Hide on login screen if requested to avoid interfering with keyboard and inputs
  if (hideOnLogin && pathname === '/career-services/portal/login') {
    return null;
  }

  // Determine active item based on current route
  const isHomeActive = pathname === '/career-services' || pathname === '/';
  const isScanActive = pathname.includes('ats-resume-checker');
  const isServicesActive = pathname.startsWith('/career-services/services');
  const isAccountActive = pathname.startsWith('/career-services/portal');

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      href: '/career-services',
      icon: House,
      isActive: isHomeActive && !isScanActive,
    },
    {
      id: 'scan',
      label: 'Scan',
      href: '/career-services#resume-checker',
      icon: ScanSearch,
      isActive: isScanActive,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/career-services') {
          e.preventDefault();
          const el = document.getElementById('resume-checker');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
    },
    {
      id: 'services',
      label: 'Services',
      href: '/career-services/services',
      icon: BriefcaseBusiness,
      isActive: isServicesActive,
    },
    {
      id: 'account',
      label: 'Account',
      href: user ? '/career-services/portal/dashboard' : '/career-services/portal/login',
      icon: UserRound,
      isActive: isAccountActive,
    },
  ];

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[max(0.5rem,env(safe-area-inset-bottom))] ${className}`}
      aria-label="Career Studio Mobile Navigation"
    >
      <div className="flex items-center justify-around h-15 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center w-full h-full py-1 text-center transition-colors relative select-none ${
                active ? 'text-[#7454F5]' : 'text-[#71778A] hover:text-[#201D36]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-105 stroke-[2.2px]' : 'stroke-[1.8px]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none ${
                  active ? 'font-bold text-[#7454F5]' : 'font-medium text-[#71778A]'
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute bottom-0.5 w-6 h-0.5 rounded-full bg-[#7454F5]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
