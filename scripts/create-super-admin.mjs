import fs from 'fs';
import path from 'path';

const serviceAccountPath = 'C:/Users/AU001AW7/.gemini/antigravity/brain/4b122b05-86f7-47e2-b2f0-b5a23dec432e/.user_uploaded/media_1793447903362_117452e7.json';
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

function base64UrlEncode(data) {
  let base64;
  if (typeof data === 'string') {
    base64 = Buffer.from(data).toString('base64');
  } else {
    base64 = Buffer.from(data).toString('base64');
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem) {
  const cleanPem = pem
    .replace(/-----BEGIN[A-Z\s]+-----/g, '')
    .replace(/-----END[A-Z\s]+-----/g, '')
    .replace(/\\n/g, '')
    .replace(/\s+/g, '');

  const buf = Buffer.from(cleanPem, 'base64');
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

async function getAccessToken() {
  const binaryKey = pemToArrayBuffer(serviceAccount.private_key);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: [
      'https://www.googleapis.com/auth/identitytoolkit',
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/firebase',
    ].join(' '),
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

  const tokenData = await res.json();
  return tokenData.access_token;
}

async function main() {
  console.log('Fetching Google OAuth token...');
  const token = await getAccessToken();
  console.log('Got access token!');

  const email = 'hopeadmin@hopepitome.com';
  const password = 'Rams@3608';
  const displayName = 'Hopeadmin';
  const projectId = serviceAccount.project_id;

  // 1. Look up existing user
  console.log(`Checking if ${email} exists...`);
  const lookupRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:lookup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email: [email] }),
    }
  );

  const lookupData = await lookupRes.json();
  let uid = null;

  if (lookupData.users && lookupData.users.length > 0) {
    uid = lookupData.users[0].localId;
    console.log(`User exists with UID: ${uid}. Updating password and details...`);
    const updateRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          localId: uid,
          password: password,
          displayName: displayName,
          emailVerified: true,
          customAttributes: JSON.stringify({
            role: 'super_admin',
            admin: true,
          }),
        }),
      }
    );
    const updateResult = await updateRes.json();
    console.log('Update result:', updateResult);
  } else {
    console.log(`Creating user ${email}...`);
    const createRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          password: password,
          displayName: displayName,
          emailVerified: true,
        }),
      }
    );
    const createData = await createRes.json();
    console.log('Create result:', createData);
    if (!createRes.ok) {
      throw new Error(`Failed to create user: ${JSON.stringify(createData)}`);
    }
    uid = createData.localId;

    // Set custom claims
    console.log(`Setting custom claims for UID: ${uid}...`);
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          localId: uid,
          customAttributes: JSON.stringify({
            role: 'super_admin',
            admin: true,
          }),
        }),
      }
    );
  }

  // 2. Add or update staff document in Firestore
  console.log(`Updating Firestore staff document for UID ${uid}...`);
  const staffDocUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/staff/${uid}`;
  const now = new Date().toISOString();
  
  const staffFields = {
    id: { stringValue: 'EMP-001' },
    uid: { stringValue: uid },
    email: { stringValue: email },
    username: { stringValue: 'Hopeadmin' },
    fullName: { stringValue: 'Hopeadmin Super User' },
    designation: { stringValue: 'Super Admin' },
    department: { stringValue: 'Leadership' },
    role: { stringValue: 'super_admin' },
    status: { stringValue: 'active' },
    phone: { stringValue: '+919961234378' },
    createdAt: { stringValue: now },
    updatedAt: { stringValue: now },
    permissions: {
      mapValue: {
        fields: {
          canManageEmployees: { booleanValue: true },
          canViewAllClients: { booleanValue: true },
          canEditWorkOrders: { booleanValue: true },
          canAccessCrm: { booleanValue: true },
          canManageProjects: { booleanValue: true },
          canManageQuotations: { booleanValue: true },
          canManageServices: { booleanValue: true },
          canManageSupport: { booleanValue: true },
          canManageFinance: { booleanValue: true },
          canDeleteRecords: { booleanValue: true },
          canExportData: { booleanValue: true },
        }
      }
    }
  };

  const fsRes = await fetch(staffDocUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fields: staffFields }),
  });

  const fsResult = await fsRes.json();
  console.log('Firestore staff update result:', fsRes.status, fsResult);

  console.log('SUCCESS! Super admin user hopeadmin@hopepitome.com ready with password Rams@3608');
}

main().catch((err) => {
  console.error('ERROR:', err);
  process.exit(1);
});

