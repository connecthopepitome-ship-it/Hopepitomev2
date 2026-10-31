/**
 * HOPEPITOME CAREER SERVICES — EDGE FIREBASE IDENTITY TOOLKIT CLIENT
 * Handles serverless, authenticated administrative user operations
 * (Account creation, password resets, account disabling) on Cloudflare Workers
 * using Google OAuth Bearer tokens and the standard Google Identity Toolkit v1 REST API.
 */

import { getGoogleOAuthAccessToken, ServiceAccountCredentials } from './jwt';

export class EdgeAuthAdminClient {
  private projectId: string;
  private credentials?: ServiceAccountCredentials;
  private cachedToken?: { token: string; expiresAt: number };

  constructor(projectId: string, credentials?: ServiceAccountCredentials) {
    this.projectId = projectId;
    this.credentials = credentials;
  }

  private async getAuthHeader(): Promise<string> {
    if (!this.credentials?.private_key || !this.credentials?.client_email) {
      throw new Error('Missing Firebase Admin service account credentials');
    }

    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60) {
      return `Bearer ${this.cachedToken.token}`;
    }

    const token = await getGoogleOAuthAccessToken(this.credentials, [
      'https://www.googleapis.com/auth/identitytoolkit',
      'https://www.googleapis.com/auth/datastore',
    ]);
    this.cachedToken = { token, expiresAt: now + 3500 };
    return `Bearer ${token}`;
  }

  /**
   * Create an employee account in Firebase Authentication
   */
  async createUser(params: {
    email: string;
    password?: string;
    displayName: string;
    emailVerified?: boolean;
    disabled?: boolean;
  }): Promise<{ uid: string; email: string }> {
    const authHeader = await this.getAuthHeader();
    const url = `https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}/accounts`;

    const body: Record<string, any> = {
      email: params.email.trim().toLowerCase(),
      displayName: params.displayName.trim(),
      emailVerified: params.emailVerified !== false,
      disabled: params.disabled === true,
    };

    if (params.password) {
      body.password = params.password;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as any;
      const message = err?.error?.message || 'Failed to create Firebase Auth user';
      throw new Error(message);
    }

    const data = (await res.json()) as { localId: string; email: string };
    return {
      uid: data.localId,
      email: data.email,
    };
  }

  /**
   * Update an employee's password, status (disabled/enabled), or display name
   */
  async updateUser(
    uid: string,
    updates: {
      password?: string;
      disableUser?: boolean;
      displayName?: string;
      email?: string;
    }
  ): Promise<boolean> {
    const authHeader = await this.getAuthHeader();
    const url = `https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}/accounts:update`;

    const body: Record<string, any> = {
      localId: uid,
    };

    if (updates.password) body.password = updates.password;
    if (typeof updates.disableUser === 'boolean') body.disableUser = updates.disableUser;
    if (updates.displayName) body.displayName = updates.displayName;
    if (updates.email) body.email = updates.email;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as any;
      throw new Error(err?.error?.message || 'Failed to update user account');
    }

    return true;
  }

  /**
   * Generate a Password Reset Link (Out-of-band email action)
   */
  async generatePasswordResetLink(email: string): Promise<string> {
    const authHeader = await this.getAuthHeader();
    const url = `https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}/accounts:sendOobCode`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: email.trim().toLowerCase(),
      }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as any;
      throw new Error(err?.error?.message || 'Failed to generate password reset code');
    }

    const data = (await res.json()) as { oobLink: string };
    return data.oobLink;
  }

  /**
   * Delete user from Firebase Auth
   */
  async deleteUser(uid: string): Promise<boolean> {
    const authHeader = await this.getAuthHeader();
    const url = `https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}/accounts:delete`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ localId: uid }),
    });

    return res.ok;
  }
}

/**
 * Generate a cryptographically secure 14-character temporary password
 * containing uppercase, lowercase, numbers, and special symbols
 */
export function generateTemporaryPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#$%^&*';

  const all = upper + lower + digits + symbols;
  const randomBytes = new Uint8Array(14);
  crypto.getRandomValues(randomBytes);

  let pass = '';
  // Ensure at least 1 from each set
  pass += upper[randomBytes[0] % upper.length];
  pass += lower[randomBytes[1] % lower.length];
  pass += digits[randomBytes[2] % digits.length];
  pass += symbols[randomBytes[3] % symbols.length];

  for (let i = 4; i < 14; i++) {
    pass += all[randomBytes[i] % all.length];
  }

  // Shuffle characters
  return pass
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

