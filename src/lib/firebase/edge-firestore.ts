/**
 * HOPEPITOME CAREER SERVICES — EDGE FIRESTORE REST CLIENT
 * High-performance, lightweight Cloudflare Worker client for Google Cloud Firestore.
 * Requires zero node_modules or gRPC dependencies.
 */

import { getGoogleOAuthAccessToken, ServiceAccountCredentials } from './jwt';

export function toFirestoreFields(obj: Record<string, any>): Record<string, any> {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  return fields;
}

export function toFirestoreValue(val: any): any {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export function fromFirestoreDocument(doc: any): Record<string, any> | null {
  if (!doc || !doc.fields) return null;
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(doc.fields)) {
    result[k] = fromFirestoreValue(v);
  }
  return result;
}

export function fromFirestoreValue(val: any): any {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return parseFloat(val.doubleValue);
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('timestampValue' in val) return val.timestampValue;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in val) {
    const obj: Record<string, any> = {};
    for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
      obj[k] = fromFirestoreValue(v);
    }
    return obj;
  }
  return null;
}

export class EdgeFirestoreClient {
  private projectId: string;
  private credentials?: ServiceAccountCredentials;
  private cachedToken?: { token: string; expiresAt: number };

  constructor(projectId: string, credentials?: ServiceAccountCredentials) {
    this.projectId = projectId;
    this.credentials = credentials;
  }

  private async getAuthHeader(): Promise<string | null> {
    if (!this.credentials?.private_key || !this.credentials?.client_email) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && this.cachedToken.expiresAt > now + 60) {
      return `Bearer ${this.cachedToken.token}`;
    }

    try {
      const token = await getGoogleOAuthAccessToken(this.credentials);
      this.cachedToken = { token, expiresAt: now + 3500 };
      return `Bearer ${token}`;
    } catch (e) {
      console.error('[EdgeFirestore] OAuth Token Error:', e);
      return null;
    }
  }

  async getDocument(collectionName: string, documentId: string): Promise<Record<string, any> | null> {
    const authHeader = await this.getAuthHeader();
    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collectionName}/${documentId}`;

    const headers: Record<string, string> = {};
    if (authHeader) headers['Authorization'] = authHeader;

    const res = await fetch(url, { headers });
    if (res.status === 404) return null;
    if (!res.ok) {
      const err = await res.text();
      console.error(`[EdgeFirestore] getDoc error (${res.status}):`, err);
      return null;
    }

    const data = await res.json();
    return fromFirestoreDocument(data);
  }

  async setDocument(
    collectionName: string,
    documentId: string,
    data: Record<string, any>,
    merge = true
  ): Promise<boolean> {
    const authHeader = await this.getAuthHeader();
    const fields = toFirestoreFields(data);

    let url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${collectionName}/${documentId}`;
    if (merge) {
      const updateMask = Object.keys(data)
        .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
        .join('&');
      if (updateMask) url += `?${updateMask}`;
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authHeader) headers['Authorization'] = authHeader;

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ fields }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[EdgeFirestore] setDoc error (${res.status}):`, err);
      return false;
    }
    return true;
  }

  async queryCollection(
    collectionName: string,
    fieldFilter?: { field: string; op: 'EQUAL' | 'GREATER_THAN'; value: any },
    limit = 50
  ): Promise<Record<string, any>[]> {
    const authHeader = await this.getAuthHeader();
    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:runQuery`;

    const structuredQuery: any = {
      from: [{ collectionId: collectionName }],
      limit,
    };

    if (fieldFilter) {
      structuredQuery.where = {
        fieldFilter: {
          field: { fieldPath: fieldFilter.field },
          op: fieldFilter.op,
          value: toFirestoreValue(fieldFilter.value),
        },
      };
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authHeader) headers['Authorization'] = authHeader;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ structuredQuery }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[EdgeFirestore] query error (${res.status}):`, err);
      return [];
    }

    const data = await res.json() as any[];
    const docs: Record<string, any>[] = [];

    for (const item of data) {
      if (item.document) {
        const parsed = fromFirestoreDocument(item.document);
        if (parsed) docs.push(parsed);
      }
    }

    return docs;
  }
}

