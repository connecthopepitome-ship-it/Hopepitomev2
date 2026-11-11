/**
 * AI JOB MATCH MODULE — SECURITY, AUTHENTICATION, SANITIZATION & PERMISSIONS
 * Server-side token verification (RS256 JWKS), timing-safe secret checks,
 * HTML/XSS stripping, URL/date validation, and candidate resolution.
 */

import { DEFAULT_STAFF_ROLES, checkPermission } from '../career/permissions';
import type { StaffPermissionAction, StaffRolePermissions } from '../career/types';
import type { EdgeFirestoreClient } from '../firebase/edge-firestore';

const MASTER_ADMIN_EMAILS = [
  'hopeadmin@hopepitome.com',
  'admin@hopepitome.com',
  'connect.hopepitome@gmail.com',
  'ramsaltvc@gmail.com',
  'lead@hopepitome.com',
];

const FIREBASE_JWK_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

interface CachedJwks {
  keys: Array<JsonWebKey & { kid?: string }>;
  expiresAt: number;
}

let cachedJwks: CachedJwks | null = null;

export interface VerifiedFirebaseToken {
  uid: string;
  email?: string;
  phoneNumber?: string;
  claims: Record<string, any>;
}

export interface JobMatchSecurityOverrides {
  verifyIdToken?: (token: string, projectId: string) => Promise<VerifiedFirebaseToken | null>;
}

function base64UrlToUint8Array(segment: string): Uint8Array {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((segment.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

function decodeJwtJson(segment: string): any {
  const bytes = base64UrlToUint8Array(segment);
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

async function fetchFirebasePublicJwks(): Promise<Array<JsonWebKey & { kid?: string }>> {
  const now = Date.now();
  if (cachedJwks && cachedJwks.expiresAt > now) {
    return cachedJwks.keys;
  }

  const res = await fetch(FIREBASE_JWK_URL, { method: 'GET' });
  if (!res.ok) {
    throw new Error(`Failed to fetch Firebase JWKS: ${res.status}`);
  }
  const data = (await res.json()) as { keys?: Array<JsonWebKey & { kid?: string }> };
  const keys = Array.isArray(data?.keys) ? data.keys : [];
  const cacheControl = res.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeMs = maxAgeMatch ? Math.min(Number(maxAgeMatch[1]) * 1000, 3600_000) : 1800_000;

  cachedJwks = { keys, expiresAt: now + maxAgeMs };
  return keys;
}

/**
 * Cryptographically verifies a Firebase Auth ID token using RS256 and Google's public JWKs.
 */
export async function verifyFirebaseIdToken(
  token: string,
  projectId: string,
  overrides?: JobMatchSecurityOverrides
): Promise<VerifiedFirebaseToken | null> {
  if (!token || typeof token !== 'string') return null;

  if (overrides?.verifyIdToken) {
    return overrides.verifyIdToken(token, projectId);
  }

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const header = decodeJwtJson(parts[0]);
    const payload = decodeJwtJson(parts[1]);

    if (header?.alg !== 'RS256' || !header?.kid) return null;

    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload?.sub || typeof payload.sub !== 'string') return null;
    if (payload.aud !== projectId) return null;
    if (payload.iss !== `https://securetoken.googleapis.com/${projectId}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp <= nowSec) return null;
    if (typeof payload.iat === 'number' && payload.iat > nowSec + 300) return null;

    const jwks = await fetchFirebasePublicJwks();
    const jwk = jwks.find((k) => k.kid === header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signedData = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlToUint8Array(parts[2]);
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature as unknown as BufferSource,
      signedData as unknown as BufferSource
    );
    if (!valid) return null;

    return {
      uid: payload.user_id || payload.sub,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      phoneNumber: typeof payload.phone_number === 'string' ? payload.phone_number : undefined,
      claims: payload,
    };
  } catch {
    return null;
  }
}

export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/**
 * Constant-time string equality check for API secret comparison.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const maxLen = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < maxLen; i++) {
    const ab = i < aBytes.length ? aBytes[i] : 0;
    const bb = i < bBytes.length ? bBytes[i] : 0;
    diff |= ab ^ bb;
  }
  return diff === 0 && aBytes.length > 0;
}

/**
 * Verifies that an incoming request comes from an authenticated active candidate
 * and checks client account status server-side.
 */
export async function authenticateCandidateRequest(
  request: Request,
  firestore: EdgeFirestoreClient,
  projectId: string,
  overrides?: JobMatchSecurityOverrides
): Promise<
    | {
      ok: true;
      candidateId: string;
      candidateCode: string;
      candidateName: string;
      candidateEmail: string;
      candidateMobile: string;
      workOrderId: string;
    }
  | { ok: false; status: number; error: string }
> {
  const token = extractBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: 'Authentication required. Please sign in to continue.' };
  }

  const verified = await verifyFirebaseIdToken(token, projectId, overrides);
  if (!verified?.uid) {
    return { ok: false, status: 401, error: 'Invalid or expired candidate session. Please sign in again.' };
  }

  // Reject staff/admin tokens mistakenly used on candidate endpoints unless they represent a client doc
  const roleClaim = String(verified.claims?.role || '').toLowerCase();
  if (roleClaim && roleClaim !== 'client') {
    return { ok: false, status: 403, error: 'Candidate session required for this action.' };
  }

  const candidateId = verified.uid;
  const clientDoc =
    (await firestore.getDocument('clients', candidateId).catch(() => null)) ||
    (await firestore.getDocument('career_clients', candidateId).catch(() => null));

  if (!clientDoc) {
    return { ok: false, status: 403, error: 'Candidate account record not found.' };
  }

  const accountStatus = String(clientDoc.status || 'ACTIVE').toUpperCase();
  if (['SUSPENDED', 'REVOKED', 'DEACTIVATED', 'ARCHIVED'].includes(accountStatus)) {
    return { ok: false, status: 403, error: 'Candidate account is suspended or deactivated.' };
  }

  return {
    ok: true,
    candidateId,
    candidateCode: String(
      clientDoc.currentWorkOrderId ||
        clientDoc.clientCode ||
        `CL-${candidateId.slice(-4).toUpperCase()}`
    ),
    candidateName: String(clientDoc.fullName || clientDoc.name || verified.claims?.name || 'Candidate'),
    candidateEmail: String(clientDoc.email || verified.email || ''),
    candidateMobile: String(clientDoc.mobile || clientDoc.phone || verified.phoneNumber || ''),
    workOrderId: String(clientDoc.currentWorkOrderId || verified.claims?.workOrderId || ''),
  };
}

/**
 * Verifies an authenticated staff user and checks module permission server-side.
 */
export async function authenticateStaffRequest(
  request: Request,
  firestore: EdgeFirestoreClient,
  projectId: string,
  requiredAction: StaffPermissionAction,
  adminEmailEnv?: string,
  overrides?: JobMatchSecurityOverrides
): Promise<
  | { ok: true; staffUid: string; staffEmail: string; staffName: string; roleId: string }
  | { ok: false; status: number; error: string }
> {
  const token = extractBearerToken(request);
  if (!token) {
    return { ok: false, status: 401, error: 'Staff authentication required.' };
  }

  const verified = await verifyFirebaseIdToken(token, projectId, overrides);
  if (!verified?.uid) {
    return { ok: false, status: 401, error: 'Invalid or expired staff session.' };
  }

  const email = String(verified.email || '').trim().toLowerCase();
  const extraAdmins = String(adminEmailEnv || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const allMasterEmails = new Set([...MASTER_ADMIN_EMAILS, ...extraAdmins]);

  if (email && allMasterEmails.has(email)) {
    return {
      ok: true,
      staffUid: verified.uid,
      staffEmail: email,
      staffName: String(verified.claims?.name || 'Super Admin'),
      roleId: 'super_admin',
    };
  }

  const staffDoc = await firestore.getDocument('staffUsers', verified.uid).catch(() => null);
  if (!staffDoc) {
    return { ok: false, status: 403, error: 'Access denied. Authorized staff account required.' };
  }

  if (
    staffDoc.accountStatus === 'DEACTIVATED' ||
    staffDoc.accountStatus === 'SUSPENDED' ||
    staffDoc.employmentStatus === 'Terminated'
  ) {
    return { ok: false, status: 403, error: 'Staff account is deactivated.' };
  }

  const roleId = String(staffDoc.roleId || '').toLowerCase();
  if (roleId === 'super_admin' || roleId === 'super admin') {
    return {
      ok: true,
      staffUid: verified.uid,
      staffEmail: String(staffDoc.email || email),
      staffName: String(staffDoc.fullName || 'Staff'),
      roleId: 'super_admin',
    };
  }

  const roleDef = DEFAULT_STAFF_ROLES.find(
    (r) => r.roleId.toLowerCase() === roleId || r.roleName.toLowerCase() === roleId
  );

  // Also check custom role overrides in staffRoles collection if present
  let effectivePermissions: StaffRolePermissions | undefined = roleDef?.permissions;
  if (!effectivePermissions && staffDoc.roleId) {
    const customRole = await firestore.getDocument('staffRoles', String(staffDoc.roleId)).catch(() => null);
    if (customRole?.permissions) {
      effectivePermissions = customRole.permissions as StaffRolePermissions;
    }
  }

  if (!checkPermission(effectivePermissions, 'job_match', requiredAction)) {
    return { ok: false, status: 403, error: 'You do not have permission to access AI Job Match.' };
  }

  return {
    ok: true,
    staffUid: verified.uid,
    staffEmail: String(staffDoc.email || email),
    staffName: String(staffDoc.fullName || staffDoc.email || 'Staff'),
    roleId,
  };
}

/**
 * Strips HTML tags, dangerous protocol strings, and control characters to prevent HTML/XSS injection.
 */
export function sanitizePlainText(value: unknown, maxLength = 500): string {
  if (value === null || value === undefined) return '';
  let str = String(value)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/(?:javascript|vbscript|data):/gi, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (str.length > maxLength) {
    str = str.slice(0, maxLength).trim();
  }
  return str;
}

export function isValidIsoDateString(value: unknown): boolean {
  const s = String(value || '').trim();
  if (!s) return false;
  if (!/^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/.test(s)) return false;
  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return false;
  // Validate calendar month/day didn't roll over on YYYY-MM-DD inputs
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    return (
      parsed.getUTCFullYear() === y &&
      parsed.getUTCMonth() + 1 === m &&
      parsed.getUTCDate() === d
    );
  }
  return true;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data as unknown as BufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function normalizeUrlForKey(rawUrl: string): string {
  const trimmed = String(rawUrl || '').trim();
  try {
    const u = new URL(trimmed);
    u.hash = '';
    const pathname = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol.toLowerCase()}//${u.host.toLowerCase()}${pathname}${u.search}`;
  } catch {
    return trimmed.toLowerCase();
  }
}

export async function buildJobMatchDocId(canonicalCandidateId: string, url: string): Promise<string> {
  const normalizedUrl = normalizeUrlForKey(url);
  const urlHash = (await sha256Hex(normalizedUrl)).slice(0, 24);
  const safeCand = canonicalCandidateId.replace(/[^A-Za-z0-9_-]/g, '_');
  return `${safeCand}__${urlHash}`;
}

/**
 * Resolves a candidate identifier passed by Google Apps Script
 * (can be clients.id, clients.clientCode, or a Work Order ID like HP-2026-00001)
 * against existing Firestore candidate records.
 */
export async function resolveExistingCandidate(
  firestore: EdgeFirestoreClient,
  rawCandidateId: string
): Promise<{
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateCode: string;
} | null> {
  const id = String(rawCandidateId || '').trim();
  if (!id) return null;

  // 1. Direct lookup on clients / career_clients by document ID
  const directClient =
    (await firestore.getDocument('clients', id).catch(() => null)) ||
    (await firestore.getDocument('career_clients', id).catch(() => null));

  if (directClient) {
    const resolvedId = String(directClient.clientId || directClient.id || id);
    return {
      candidateId: resolvedId,
      candidateName: String(directClient.fullName || directClient.name || 'Candidate'),
      candidateEmail: String(directClient.email || ''),
      candidateCode: String(directClient.currentWorkOrderId || directClient.clientCode || resolvedId),
    };
  }

  // 2. Lookup by clientCode (e.g., CL-1023 or HP-1023)
  const byClientCode = await firestore
    .queryCollection('clients', { field: 'clientCode', op: 'EQUAL', value: id.toUpperCase() }, 1)
    .catch(() => []);
  if (byClientCode.length > 0) {
    const c = byClientCode[0];
    const resolvedId = String(c.clientId || c.id || (c as any)._docId);
    return {
      candidateId: resolvedId,
      candidateName: String(c.fullName || c.name || 'Candidate'),
      candidateEmail: String(c.email || ''),
      candidateCode: String(c.currentWorkOrderId || c.clientCode || id),
    };
  }

  // 3. Lookup by workOrders document ID or clients.currentWorkOrderId
  const wo = await firestore.getDocument('workOrders', id.toUpperCase()).catch(() => null);
  if (wo?.clientId) {
    const woClient = await firestore.getDocument('clients', String(wo.clientId)).catch(() => null);
    if (woClient) {
      const resolvedId = String(woClient.clientId || woClient.id || wo.clientId);
      return {
        candidateId: resolvedId,
        candidateName: String(woClient.fullName || woClient.name || wo.clientName || 'Candidate'),
        candidateEmail: String(woClient.email || wo.clientEmail || ''),
        candidateCode: String(woClient.currentWorkOrderId || id.toUpperCase()),
      };
    }
  }

  const byCurrentWo = await firestore
    .queryCollection('clients', { field: 'currentWorkOrderId', op: 'EQUAL', value: id.toUpperCase() }, 1)
    .catch(() => []);
  if (byCurrentWo.length > 0) {
    const c = byCurrentWo[0];
    const resolvedId = String(c.clientId || c.id || (c as any)._docId);
    return {
      candidateId: resolvedId,
      candidateName: String(c.fullName || c.name || 'Candidate'),
      candidateEmail: String(c.email || ''),
      candidateCode: String(c.currentWorkOrderId || c.clientCode || id.toUpperCase()),
    };
  }

  return null;
}

