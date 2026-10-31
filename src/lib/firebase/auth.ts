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

/**
 * Passwordless Client Login API caller
 * Verifies Mobile + Work Order ID on Cloudflare Worker backend,
 * receives Firebase Custom Token, and signs in with Firebase
 */
export async function loginPasswordlessClient(mobile: string, workOrderId: string): Promise<{
  user: FirebaseUser;
  clientId: string;
  workOrderId: string;
  name: string;
}> {
  const res = await fetch('/api/career/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile: mobile.trim(),
      workOrderId: workOrderId.trim().toUpperCase(),
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid mobile number or work order ID');
  }

  // Sign into Firebase SDK using the custom token returned by backend
  const user = await loginWithCustomToken(data.customToken);

  // Store active work order ID in session storage for immediate UI access
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hp_active_work_order', data.workOrderId);
    sessionStorage.setItem('hp_active_client_id', data.clientId);
  }

  return {
    user,
    clientId: data.clientId,
    workOrderId: data.workOrderId,
    name: data.name,
  };
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

