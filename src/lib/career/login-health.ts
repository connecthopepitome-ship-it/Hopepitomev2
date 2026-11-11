/**
 * HOPEPITOME CAREER SERVICES — CANDIDATE LOGIN NORMALIZATION & ACCOUNT HEALTH ENGINE
 * Shared, deterministic helpers for mobile matching, work-order access checks,
 * and candidate account health telemetry.
 */

import type { AccountHealthStatus, WorkOrderLoginStatus } from './types';

export function normalizeMobile(mobile: string): string {
  if (!mobile) return '';
  return mobile.trim().replace(/[\s\-\(\)\.]/g, '');
}

export function digitsOnly(mobile: string): string {
  if (!mobile) return '';
  return mobile.replace(/\D/g, '');
}

/**
 * Generates normalized candidate phone strings for targeted Firestore lookups.
 */
export function buildMobileVariants(mobile: string, countryCode?: string): string[] {
  const variants = new Set<string>();
  const trimmed = (mobile || '').trim();
  if (!trimmed) return [];

  const norm = normalizeMobile(trimmed);
  const digits = digitsOnly(trimmed);
  const ccDigits = digitsOnly(countryCode || '');

  if (trimmed) variants.add(trimmed);
  if (norm) variants.add(norm);
  if (digits) variants.add(digits);

  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    variants.add(last10);
    variants.add(`0${last10}`);

    if (ccDigits) {
      variants.add(`+${ccDigits}${last10}`);
      variants.add(`${ccDigits}${last10}`);
      variants.add(`+${ccDigits} ${last10}`);
    }
    if (!trimmed.startsWith('+')) {
      variants.add(`+${digits}`);
    }
    // Common India (+91) & US (+1) formatting variants if stored with spaces
    if (digits.startsWith('91') && digits.length === 12) {
      variants.add(`+91${last10}`);
      variants.add(`+91 ${last10}`);
      variants.add(`+91 ${last10.slice(0, 5)} ${last10.slice(5)}`);
    }
  }

  return Array.from(variants).filter(Boolean);
}

/**
 * Safely determines whether two phone numbers represent the same mobile number,
 * handling country-code vs local-number differences without cross-matching distinct country codes.
 */
export function mobilesMatch(storedMobile: string, inputMobile: string): boolean {
  const normA = normalizeMobile(storedMobile);
  const normB = normalizeMobile(inputMobile);
  if (!normA || !normB) return false;

  if (normA === normB) return true;

  const digitsA = digitsOnly(normA);
  const digitsB = digitsOnly(normB);
  if (digitsA.length < 7 || digitsB.length < 7) return false;

  if (digitsA === digitsB) return true;

  const hasExplicitPlusA = normA.startsWith('+');
  const hasExplicitPlusB = normB.startsWith('+');

  // If both specify explicit country codes and full digits don't match,
  // allow match ONLY if one forgot '+' or had an extra leading zero after '+', otherwise reject.
  const localA = digitsA.replace(/^0+/, '');
  const localB = digitsB.replace(/^0+/, '');

  if (localA === localB) return true;

  // Match a 10-digit local number (or 0-prefixed local) against a country-coded number
  const isLocalA = !hasExplicitPlusA && localA.length === 10;
  const isLocalB = !hasExplicitPlusB && localB.length === 10;

  if (isLocalA && digitsB.length >= 11 && digitsB.length <= 14 && digitsB.endsWith(localA)) {
    return true;
  }
  if (isLocalB && digitsA.length >= 11 && digitsA.length <= 14 && digitsA.endsWith(localB)) {
    return true;
  }

  return false;
}

export interface AccountHealthInput {
  clientStatus?: string;
  loginStatus?: WorkOrderLoginStatus | string;
  workOrderStatus?: string;
  mobile?: string;
  loginCount?: number;
  failedLoginAttempts?: number;
  lockedUntil?: string | number | null;
  regenerationCount?: number;
  lastLoginAt?: string;
  createdAt?: string;
  hasWorkOrder?: boolean;
}

export interface AccountHealthResult {
  healthStatus: AccountHealthStatus;
  healthScore: number;
  healthSignals: string[];
}

export function computeAccountHealth(
  input: AccountHealthInput,
  nowMs: number = Date.now()
): AccountHealthResult {
  let score = 100;
  const signals: string[] = [];

  const clientStatus = (input.clientStatus || 'ACTIVE').toUpperCase();
  const loginStatus = (input.loginStatus || 'ACTIVE').toUpperCase();
  const workOrderStatus = input.workOrderStatus || 'Registered';
  const mobileDigits = digitsOnly(input.mobile || '');
  const failedAttempts = Number(input.failedLoginAttempts || 0);
  const loginCount = Number(input.loginCount || 0);
  const regenCount = Number(input.regenerationCount || 0);
  const hasWorkOrder = input.hasWorkOrder !== false;

  const lockedUntilMs =
    typeof input.lockedUntil === 'number'
      ? input.lockedUntil
      : input.lockedUntil
        ? new Date(input.lockedUntil).getTime()
        : 0;
  const isLocked = Number.isFinite(lockedUntilMs) && lockedUntilMs > nowMs;

  const isClientBlocked = ['SUSPENDED', 'REVOKED', 'DEACTIVATED', 'ARCHIVED'].includes(clientStatus);
  const isIdBlocked = ['REVOKED', 'SUSPENDED'].includes(loginStatus);
  const isIdSuperseded = loginStatus === 'SUPERSEDED';
  const isWoCancelled = workOrderStatus === 'Cancelled';

  if (!hasWorkOrder) {
    score -= 60;
    signals.push('No Active Work Order ID');
  }

  if (isClientBlocked) {
    score -= 60;
    signals.push(`Account ${clientStatus}`);
  }

  if (isIdBlocked) {
    score -= 55;
    signals.push(`ID ${loginStatus}`);
  } else if (isIdSuperseded) {
    score -= 20;
    signals.push('ID Superseded');
  }

  if (isWoCancelled) {
    score -= 50;
    signals.push('Work Order Cancelled');
  }

  if (mobileDigits.length < 7) {
    score -= 45;
    signals.push('Missing/Invalid Mobile');
  } else {
    signals.push('Verified Mobile');
  }

  if (isLocked) {
    score -= 35;
    signals.push('Rate-Limit Locked');
  }

  if (failedAttempts >= 3) {
    score -= 25;
    signals.push(`${failedAttempts} Failed Logins`);
  } else if (failedAttempts >= 1) {
    score -= 10;
    signals.push(`${failedAttempts} Failed Login(s)`);
  }

  if (regenCount >= 2) {
    score -= 10;
    signals.push(`${regenCount} ID Regenerations`);
  }

  if (loginCount === 0) {
    const createdMs = input.createdAt ? new Date(input.createdAt).getTime() : 0;
    const ageDays = createdMs ? (nowMs - createdMs) / (1000 * 60 * 60 * 24) : 0;
    if (ageDays > 7) {
      score -= 10;
      signals.push('Never Logged In (>7d)');
    } else {
      signals.push('Awaiting First Login');
    }
  } else if (input.lastLoginAt) {
    const lastLoginMs = new Date(input.lastLoginAt).getTime();
    const idleDays = lastLoginMs ? (nowMs - lastLoginMs) / (1000 * 60 * 60 * 24) : 0;
    if (idleDays > 45) {
      score -= 10;
      signals.push('Dormant (>45d)');
    } else {
      signals.push('Active Engagement');
    }
  } else {
    signals.push('Active Engagement');
  }

  const clampedScore = Math.max(0, Math.min(100, score));

  let healthStatus: AccountHealthStatus = 'HEALTHY';
  if (
    !hasWorkOrder ||
    isClientBlocked ||
    isIdBlocked ||
    isWoCancelled ||
    mobileDigits.length < 7 ||
    isLocked ||
    clampedScore < 50
  ) {
    healthStatus = 'CRITICAL';
  } else if (isIdSuperseded || failedAttempts >= 1 || regenCount >= 2 || clampedScore < 80) {
    healthStatus = 'AT_RISK';
  }

  return {
    healthStatus,
    healthScore: clampedScore,
    healthSignals: signals,
  };
}

