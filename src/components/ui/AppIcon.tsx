'use client';

import React from 'react';
import { ICON_REGISTRY, IconName } from '@/lib/icons';

export interface AppIconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted' | 'white' | 'current';
  strokeWidth?: number;
  className?: string;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const SIZE_MAP = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

const VARIANT_MAP = {
  default: 'text-[#201D36]',
  primary: 'text-[#7454F5]',
  secondary: 'text-[#A78BFA]',
  success: 'text-[#149B75]',
  warning: 'text-[#D88A20]',
  error: 'text-[#D94D58]',
  muted: 'text-[#71778A]',
  white: 'text-white',
  current: 'currentColor',
} as const;

export function AppIcon({
  name,
  size = 'md',
  variant = 'current',
  strokeWidth = 1.9,
  className = '',
  ariaLabel,
  onClick,
}: AppIconProps) {
  const IconComponent = ICON_REGISTRY[name] || ICON_REGISTRY.info;
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 20;
  const colorClass = VARIANT_MAP[variant] || '';

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${colorClass} ${className}`}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      onClick={onClick}
    />
  );
}

export default AppIcon;

