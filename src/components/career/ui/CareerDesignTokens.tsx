'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2, ChevronDown, Lock } from 'lucide-react';

/**
 * HOPEPITOME CAREER SERVICES — UNIFIED DESIGN SYSTEM TOKENS
 * Primary Purple: #7454F5
 * Secondary Lavender: #A78BFA
 * Deep Navy: #17152F
 * Main Background: #F8F7FC
 * Card Background: #FFFFFF
 * Primary Text: #201D36
 * Secondary Text: #71778A
 * Success: #149B75
 * Warning: #D88A20
 * Error: #D94D58
 */

export const careerColors = {
  primary: '#7454F5',
  primaryHover: '#6342E8',
  secondary: '#A78BFA',
  navy: '#17152F',
  background: '#F8F7FC',
  card: '#FFFFFF',
  textPrimary: '#201D36',
  textSecondary: '#71778A',
  success: '#149B75',
  warning: '#D88A20',
  error: '#D94D58',
};

// ---------------------------------------------------------------------------
// 1. CAREER BADGE
// ---------------------------------------------------------------------------
export interface CareerBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'locked';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function CareerBadge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}: CareerBadgeProps) {
  const variantStyles = {
    primary: 'bg-[#7454F5]/10 text-[#7454F5] border-[#7454F5]/20',
    secondary: 'bg-[#A78BFA]/15 text-[#6342E8] border-[#A78BFA]/30',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
    success: 'bg-[#149B75]/10 text-[#149B75] border-[#149B75]/25',
    warning: 'bg-[#D88A20]/10 text-[#B87115] border-[#D88A20]/25',
    error: 'bg-[#D94D58]/10 text-[#C93B47] border-[#D94D58]/25',
    locked: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {variant === 'locked' && !icon && <Lock className="w-3 h-3 text-slate-400 shrink-0" />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// 2. CAREER CARD
// ---------------------------------------------------------------------------
export interface CareerCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive' | 'accent';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function CareerCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  onClick,
}: CareerCardProps) {
  const variantStyles = {
    default: 'bg-white border border-[#201D36]/[0.08] shadow-[0_2px_8px_rgba(32,29,54,0.03)]',
    elevated: 'bg-white border border-[#201D36]/[0.08] shadow-[0_8px_24px_rgba(32,29,54,0.06)]',
    subtle: 'bg-[#F8F7FC] border border-[#201D36]/[0.05]',
    interactive:
      'bg-white border border-[#201D36]/[0.08] hover:border-[#7454F5]/40 hover:shadow-[0_8px_24px_rgba(116,84,245,0.08)] active:scale-[0.99] transition-all duration-200 cursor-pointer',
    accent:
      'bg-gradient-to-br from-white via-white to-[#7454F5]/[0.03] border border-[#7454F5]/20 shadow-[0_4px_16px_rgba(116,84,245,0.05)]',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl sm:rounded-3xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. CAREER BUTTON
// ---------------------------------------------------------------------------
export interface CareerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function CareerButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: CareerButtonProps) {
  const variantStyles = {
    primary:
      'bg-[#7454F5] hover:bg-[#6342E8] active:bg-[#5233D2] text-white shadow-md shadow-[#7454F5]/20 disabled:bg-slate-300 disabled:shadow-none',
    secondary:
      'bg-[#17152F] hover:bg-[#201D36] active:bg-[#121024] text-white shadow-sm disabled:bg-slate-300',
    outline:
      'bg-white hover:bg-slate-50 text-[#201D36] border border-slate-200 hover:border-[#7454F5]/40 active:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400',
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#201D36] active:bg-slate-200 disabled:text-slate-400',
    destructive:
      'bg-[#D94D58] hover:bg-[#C93B47] text-white shadow-sm disabled:bg-slate-300',
  };

  // Min touch target >= 44px for accessible mobile interaction
  const sizeStyles = {
    sm: 'min-h-[40px] px-3.5 py-2 text-xs rounded-xl gap-1.5',
    md: 'min-h-[46px] px-5 py-2.5 text-sm rounded-xl font-bold gap-2',
    lg: 'min-h-[52px] px-6 py-3.5 text-sm sm:text-base rounded-2xl font-bold gap-2.5',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-150 select-none active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 4. CAREER ACCORDION (Progressive Disclosure for Mobile Reports)
// ---------------------------------------------------------------------------
export interface CareerAccordionProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  isLocked?: boolean;
  onUnlockClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function CareerAccordion({
  title,
  subtitle,
  badge,
  icon,
  defaultOpen = false,
  isLocked = false,
  onUnlockClick,
  children,
  className = '',
}: CareerAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const toggle = () => {
    if (isLocked && onUnlockClick) {
      onUnlockClick();
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? 'bg-white border-[#7454F5]/25 shadow-[0_4px_16px_rgba(116,84,245,0.06)]'
          : 'bg-white/80 hover:bg-white border-slate-200/90 shadow-sm'
      } ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-[#201D36] truncate">
                {title}
              </h3>
              {badge}
              {isLocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7454F5] bg-[#7454F5]/10 px-2 py-0.5 rounded-md">
                  <Lock className="w-2.5 h-2.5" />
                  Premium
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-[#71778A] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {isLocked ? (
            <span className="text-xs font-bold text-[#7454F5] hover:underline hidden sm:inline">
              Unlock
            </span>
          ) : (
            <div
              className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-200 ${
                isOpen ? 'rotate-180 bg-[#7454F5]/10 text-[#7454F5]' : 'text-slate-500'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          )}
        </div>
      </button>

      {isOpen && !isLocked && (
        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-slate-100 text-sm text-[#201D36] animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. CAREER BOTTOM NAVIGATION (Mobile App Experience for Authenticated Portal)
// ---------------------------------------------------------------------------
export interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  badgeCount?: number;
}

export interface CareerBottomNavProps {
  items: BottomNavItem[];
  activeId: string;
}

export function CareerBottomNav({ items, activeId }: CareerBottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full py-1 text-center transition-colors relative ${
                isActive ? 'text-[#7454F5]' : 'text-[#71778A] hover:text-[#201D36]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-2'
                  }`}
                />
                {item.badgeCount && item.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#D94D58] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badgeCount}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-[64px] ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-[#7454F5]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

