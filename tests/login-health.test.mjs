import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeMobile,
  digitsOnly,
  buildMobileVariants,
  mobilesMatch,
  computeAccountHealth,
} from '../src/lib/career/login-health.ts';

test('normalizeMobile and digitsOnly strip formatting cleanly', () => {
  assert.equal(normalizeMobile(' +91 98765-43210 '), '+919876543210');
  assert.equal(digitsOnly('+91 (987) 654.3210'), '919876543210');
});

test('buildMobileVariants produces local and country-coded lookups', () => {
  const variants = buildMobileVariants('98765 43210', '+91');
  assert.ok(variants.includes('9876543210'));
  assert.ok(variants.includes('+919876543210'));
  assert.ok(variants.includes('919876543210'));
  assert.ok(variants.includes('09876543210'));
});

test('mobilesMatch handles formatting and 10-digit vs country code variance safely', () => {
  assert.equal(mobilesMatch('+91 98765 43210', '+919876543210'), true);
  assert.equal(mobilesMatch('+919876543210', '9876543210'), true);
  assert.equal(mobilesMatch('9876543210', '+91 98765-43210'), true);
  assert.equal(mobilesMatch('+44 7911123456', '+91 7911123456'), false);
  assert.equal(mobilesMatch('+919876543210', '12345'), false);
});

test('computeAccountHealth scores healthy, at-risk, and critical accounts deterministically', () => {
  const nowMs = Date.UTC(2026, 10, 11, 12, 0, 0);

  const healthy = computeAccountHealth(
    {
      clientStatus: 'ACTIVE',
      loginStatus: 'ACTIVE',
      workOrderStatus: 'Confirmed',
      mobile: '+919876543210',
      loginCount: 3,
      failedLoginAttempts: 0,
      lastLoginAt: new Date(nowMs - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(nowMs - 5 * 24 * 60 * 60 * 1000).toISOString(),
      hasWorkOrder: true,
    },
    nowMs
  );
  assert.equal(healthy.healthStatus, 'HEALTHY');
  assert.equal(healthy.healthScore, 100);

  const atRisk = computeAccountHealth(
    {
      clientStatus: 'ACTIVE',
      loginStatus: 'ACTIVE',
      workOrderStatus: 'Registered',
      mobile: '+919876543210',
      loginCount: 1,
      failedLoginAttempts: 2,
      lastLoginAt: new Date(nowMs - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(nowMs - 10 * 24 * 60 * 60 * 1000).toISOString(),
      hasWorkOrder: true,
    },
    nowMs
  );
  assert.equal(atRisk.healthStatus, 'AT_RISK');
  assert.ok(atRisk.healthScore < 100 && atRisk.healthScore >= 50);

  const critical = computeAccountHealth(
    {
      clientStatus: 'REVOKED',
      loginStatus: 'REVOKED',
      workOrderStatus: 'Confirmed',
      mobile: '+919876543210',
      failedLoginAttempts: 5,
      lockedUntil: nowMs + 60_000,
      hasWorkOrder: true,
    },
    nowMs
  );
  assert.equal(critical.healthStatus, 'CRITICAL');
  assert.equal(critical.healthScore, 0);
});

