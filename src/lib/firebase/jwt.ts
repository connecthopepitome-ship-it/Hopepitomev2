/**
 * HOPEPITOME CAREER SERVICES — FIREBASE CUSTOM TOKEN GENERATOR (EDGE SAFE)
 * Uses standard Web Crypto API (SubtleCrypto) to mint RS256 JWT Custom Tokens
 * without requiring heavy Node.js 'firebase-admin' or gRPC dependencies.
 */

function base64UrlEncode(data: string | Uint8Array | ArrayBuffer): string {
  let base64: string;
  if (typeof data === 'string') {
    const bytes = new TextEncoder().encode(data);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  } else {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleanPem = pem
    .replace(/-----BEGIN[A-Z\s]+-----/g, '')
    .replace(/-----END[A-Z\s]+-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '');

  const binary = atob(cleanPem);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
  project_id?: string;
}

/**
 * Mint a Firebase Custom Token using RS256
 */
export async function mintFirebaseCustomToken(
  uid: string,
  claims: Record<string, any> = {},
  credentials: ServiceAccountCredentials
): Promise<string> {
  const { client_email, private_key } = credentials;

  if (!client_email || !private_key) {
    throw new Error('Missing service account client_email or private_key');
  }

  const binaryKey = pemToArrayBuffer(private_key);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: client_email,
    sub: client_email,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: now,
    exp: now + 3600, // 1 hour expiration
    uid: uid,
    claims: claims,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;
  const messageBytes = new TextEncoder().encode(message);

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    messageBytes
  );

  const encodedSignature = base64UrlEncode(signature);
  return `${message}.${encodedSignature}`;
}

/**
 * Mint an OAuth2 Google Access Token for calling Firestore REST API
 */
export async function getGoogleOAuthAccessToken(
  credentials: ServiceAccountCredentials,
  scopes: string[] = [
    'https://www.googleapis.com/auth/datastore',
    'https://www.googleapis.com/auth/identitytoolkit',
  ]
): Promise<string> {
  const { client_email, private_key } = credentials;
  const binaryKey = pemToArrayBuffer(private_key);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: client_email,
    sub: client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: scopes.join(' '),
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;
  const messageBytes = new TextEncoder().encode(message);

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    messageBytes
  );

  const assertion = `${message}.${base64UrlEncode(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: assertion,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain Google access token: ${errText}`);
  }

  const tokenData = await res.json() as { access_token: string };
  return tokenData.access_token;
}
