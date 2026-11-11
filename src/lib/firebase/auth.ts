/**
 * HOPEPITOME CAREER SERVICES — CLIENT AUTHENTICATION SERVICE
 * Secure authentication wrappers with user-friendly error translations.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';

export type { FirebaseUser };

export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error?.code || '';
  const message = error?.message || String(error);

  switch (code) {
    case 'auth/invalid-email':
      return 'The email address format is invalid. Please check and try again.';
    case 'auth/user-disabled':
      return 'This account has been deactivated. Please contact support.';
    case 'auth/user-not-found':
      return 'No account was found with this email. Please check your spelling or register.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect password or credentials. Please check your details or reset your password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled before completion.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to multiple failed attempts. Please try again later.';
    default:
      return message || 'Authentication failed. Please try again.';
  }
}

export async function loginWithCustomToken(customToken: string): Promise<FirebaseUser> {
  if (!auth) throw new Error('Authentication is initializing. Please retry in a moment.');
  const credential = await signInWithCustomToken(auth, customToken.trim());
  return credential.user;
}

/**
 * Passwordless Client Registration API caller
 * Calls Cloudflare Worker backend to register client with Name & Mobile
 */
export async function registerPasswordlessClient(name: string, mobile: string): Promise<{
  success: boolean;
  clientId: string;
  workOrderId: string;
  name: string;
  isExisting?: boolean;
  message?: string;
}> {
  const res = await fetch('/api/career/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), mobile: mobile.trim() }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to complete registration');
  }
  return data;
}

export const CANDIDATE_SESSION_KEY = 'hp_candidate_session';

export interface CandidateSessionData {
  clientId: string;
  workOrderId: string;
  name: string;
  mobile?: string;
  email?: string;
  clientCode?: string;
  loggedInAt: string;
}

/**
 * Passwordless Client Login API caller
 * Verifies Mobile + Work Order ID on Cloudflare Worker backend,
 * receives Firebase Custom Token, and signs in with Firebase
 */
export async function loginPasswordlessClient(
  mobile: string,
  workOrderId: string,
  rawMobile?: string,
  countryCode?: string
): Promise<{
  user: FirebaseUser | null;
  clientId: string;
  workOrderId: string;
  name: string;
  mobile?: string;
  email?: string;
  clientCode?: string;
}> {
  const res = await fetch('/api/career/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile: mobile.trim(),
      rawMobile: rawMobile?.trim() || mobile.trim(),
      countryCode: countryCode?.trim(),
      workOrderId: workOrderId.trim().toUpperCase(),
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid mobile number or work order ID');
  }

  let user: FirebaseUser | null = null;
  const token = String(data.customToken || '');
  const isDevFallbackToken = token.startsWith('hp_dev_token_') || token.split('.').length !== 3;

  if (!isDevFallbackToken && token) {
    try {
      user = await loginWithCustomToken(token);
    } catch (err: any) {
      if (err?.code === 'auth/user-disabled') {
        throw new Error(getFriendlyAuthErrorMessage(err));
      }
      // If custom token exchange fails in restricted offline/local environments, fall back to worker-verified session
      console.warn('Firebase custom token exchange fallback active:', err?.code || err?.message);
    }
  }

  // Store active work order ID and verified candidate session in session storage
  if (typeof window !== 'undefined') {
    const sessionPayload: CandidateSessionData = {
      clientId: data.clientId,
      workOrderId: data.workOrderId,
      name: data.name || 'Candidate',
      mobile: data.mobile || mobile.trim(),
      email: data.email || '',
      clientCode: data.clientCode || '',
      loggedInAt: new Date().toISOString(),
    };
    sessionStorage.setItem('hp_active_work_order', data.workOrderId);
    sessionStorage.setItem('hp_active_client_id', data.clientId);
    sessionStorage.setItem(CANDIDATE_SESSION_KEY, JSON.stringify(sessionPayload));
  }

  return {
    user,
    clientId: data.clientId,
    workOrderId: data.workOrderId,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    clientCode: data.clientCode,
  };
}

/**
 * Forgot Work Order ID API caller
 * Verifies registered mobile number and generates a fresh active Work Order ID
 */
export async function forgotWorkOrderIdClient(
  mobile: string,
  rawMobile?: string,
  countryCode?: string
): Promise<{
  success: boolean;
  clientId: string;
  workOrderId: string;
  previousWorkOrderId?: string;
  name: string;
  mobile: string;
  message?: string;
}> {
  const res = await fetch('/api/career/auth/forgot-work-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile: mobile.trim(),
      rawMobile: rawMobile?.trim() || mobile.trim(),
      countryCode: countryCode?.trim(),
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    const err: any = new Error(data.error || 'Could not locate or generate a Work Order ID for this mobile.');
    err.status = res.status;
    err.needsRegistration = Boolean(data.needsRegistration || data.notFound || res.status === 404);
    throw err;
  }

  return data;
}

export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) throw new Error('Authentication is initializing. Please retry in a moment.');
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return credential.user;
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<FirebaseUser> {
  if (!auth) throw new Error('Authentication is initializing. Please retry in a moment.');
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (credential.user && displayName.trim()) {
    try {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    } catch (e) {
      console.warn('Profile name update skipped:', e);
    }
  }
  return credential.user;
}

export async function loginWithGoogle(): Promise<FirebaseUser> {
  if (!auth) throw new Error('Authentication is initializing. Please retry in a moment.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error('Authentication is initializing. Please retry in a moment.');
  await sendPasswordResetEmail(auth, email.trim());
}

export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(CANDIDATE_SESSION_KEY);
    sessionStorage.removeItem('hp_active_work_order');
    sessionStorage.removeItem('hp_active_client_id');
  }
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

