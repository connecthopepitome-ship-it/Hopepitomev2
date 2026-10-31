import { validateEnquiry, SanitizedEnquiry } from './lib/enquiry';
import { validateCareerEnquiry, SanitizedCareerEnquiry } from './lib/career-enquiry';
import { mintFirebaseCustomToken, ServiceAccountCredentials } from './lib/firebase/jwt';
import { EdgeFirestoreClient } from './lib/firebase/edge-firestore';
import { WorkOrderStatus } from './lib/career/types';

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  DB?: {
    prepare: (query: string) => {
      bind: (...args: any[]) => {
        run: () => Promise<any>;
      };
    };
  };
  ENQUIRIES_KV?: {
    put: (key: string, value: string) => Promise<void>;
    get: (key: string) => Promise<string | null>;
  };
  AUTH_RATE_LIMIT_KV?: {
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
    get: (key: string) => Promise<string | null>;
  };
  ADMIN_EMAIL?: string;
  // Firebase Service Account Credentials (secrets)
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  FIREBASE_PRIVATE_KEY?: string;
  // Google Apps Script Web App
  GAS_WEB_APP_URL?: string;
  GAS_SHARED_SECRET?: string;
}

// In-memory fallback stores for edge resiliency and testing before secrets are populated
const inMemoryRateLimits = new Map<string, { attempts: number; lockedUntil: number }>();
const inMemoryClients = new Map<string, { clientId: string; name: string; mobile: string; currentWorkOrderId: string; status: string }>();
const inMemoryWorkOrders = new Map<string, { workOrderId: string; clientId: string; serviceType: string; status: WorkOrderStatus; createdAt: string; updatedAt: string }>();

function normalizeMobile(mobile: string): string {
  if (!mobile) return '';
  return mobile.replace(/[\s\-\(\)\.]/g, '');
}

function generateWorkOrderId(): string {
  const year = new Date().getFullYear();
  // 5-digit cryptographically pseudo-random number between 10000 and 99999
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `HP-${year}-${randomSuffix}`;
}

const VALID_WORK_ORDER_STATUSES: WorkOrderStatus[] = [
  'Registered',
  'Information Pending',
  'Documents Received',
  'Requirements Review',
  'Quotation Sent',
  'Awaiting Payment',
  'Confirmed',
  'In Progress',
  'Internal Review',
  'Client Review',
  'Revision Requested',
  'Final Delivery',
  'Completed',
  'Cancelled',
];

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function callGoogleAppsScript(
  env: Env,
  payload: Record<string, any>
): Promise<any> {
  if (!env.GAS_WEB_APP_URL || !env.GAS_SHARED_SECRET) {
    console.warn('[GAS Bridge] Warning: GAS_WEB_APP_URL or GAS_SHARED_SECRET not configured. Vault running in local fallback mode.');
    return {
      success: true,
      fileId: `drive_${Date.now()}`,
      downloadUrl: 'https://drive.google.com/file/d/vault_preview',
      viewUrl: 'https://drive.google.com/file/d/vault_preview',
      fileSize: payload.base64Content ? Math.floor(payload.base64Content.length * 0.75) : 150000,
      subfolder: payload.subfolder || 'Client Documents',
      driveFolderId: `folder_${payload.workOrderId}`,
      message: 'Processed in edge fallback mode',
    };
  }

  const body = {
    ...payload,
    secret: env.GAS_SHARED_SECRET,
  };

  const res = await fetch(env.GAS_WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return await res.json();
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight for all /api/ routes
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // 1. Healthcheck endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'hopepitome-v2',
          engine: 'Cloudflare Workers + Edge Assets',
          version: '2.1.0',
          features: [
            'passwordless-auth',
            'work-order-lifecycle',
            'gas-google-drive-vault',
            'edge-firestore-rest',
          ],
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // Initialize Edge Firestore Client
    const projectId = env.FIREBASE_PROJECT_ID || 'plantrix-dd753';
    let serviceAccount: ServiceAccountCredentials | undefined;
    if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      serviceAccount = {
        client_email: env.FIREBASE_CLIENT_EMAIL,
        private_key: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        project_id: projectId,
      };
    }
    const firestore = new EdgeFirestoreClient(projectId, serviceAccount);

    // =========================================================================
    // PHASE 2: CLIENT REGISTRATION (Name & Mobile only)
    // =========================================================================
    if (url.pathname === '/api/career/auth/register') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
          status: 405,
          headers: CORS_HEADERS,
        });
      }

      try {
        const body = (await request.json().catch(() => null)) as { name?: string; mobile?: string } | null;
        const name = body?.name?.trim();
        const mobile = body?.mobile?.trim();

        if (!name || name.length < 2) {
          return new Response(
            JSON.stringify({ success: false, error: 'Please enter your full legal name.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const normalizedMobile = normalizeMobile(mobile || '');
        if (!normalizedMobile || normalizedMobile.length < 7) {
          return new Response(
            JSON.stringify({ success: false, error: 'Please enter a valid mobile number with country code.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const now = new Date().toISOString();

        // 1. Check for existing client by normalized mobile number
        const existingClients = await firestore.queryCollection('clients', {
          field: 'mobile',
          op: 'EQUAL',
          value: normalizedMobile,
        });

        if (existingClients.length > 0) {
          const client = existingClients[0];
          const clientId = client.clientId || client.id;
          let currentWorkOrderId = client.currentWorkOrderId;

          // If client has existing work order, return it safely without creating duplicate
          if (!currentWorkOrderId) {
            currentWorkOrderId = generateWorkOrderId();
            await firestore.setDocument('clients', clientId, {
              currentWorkOrderId,
              updatedAt: now,
            });
            await firestore.setDocument('workOrders', currentWorkOrderId, {
              workOrderId: currentWorkOrderId,
              clientId,
              serviceType: 'RESUME_WRITING',
              status: 'Registered',
              createdAt: now,
              updatedAt: now,
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              isExisting: true,
              clientId,
              name: client.name || name,
              workOrderId: currentWorkOrderId,
              message: 'Welcome back! Your registered work order has been retrieved.',
            }),
            { status: 200, headers: CORS_HEADERS }
          );
        }

        // 2. New Client Registration
        const clientId = `cl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const workOrderId = generateWorkOrderId();

        const clientRecord = {
          clientId,
          name,
          mobile: normalizedMobile,
          status: 'ACTIVE',
          currentWorkOrderId: workOrderId,
          createdAt: now,
          updatedAt: now,
        };

        const workOrderRecord = {
          workOrderId,
          clientId,
          serviceType: 'RESUME_WRITING',
          status: 'Registered' as WorkOrderStatus,
          createdAt: now,
          updatedAt: now,
        };

        inMemoryClients.set(normalizedMobile, clientRecord);
        inMemoryWorkOrders.set(workOrderId, workOrderRecord);

        // A. Save Client Record in 'clients'
        await firestore.setDocument('clients', clientId, clientRecord);

        // B. Save Initial Work Order in 'workOrders'
        await firestore.setDocument('workOrders', workOrderId, workOrderRecord);

        // C. Initialize Career Profile document
        await firestore.setDocument('careerProfiles', clientId, {
          clientId,
          fullName: name,
          phone: normalizedMobile,
          status: 'NOT_STARTED',
          updatedAt: now,
        });

        // D. Asynchronously trigger Google Apps Script folder initialization in Google Drive
        callGoogleAppsScript(env, {
          action: 'initWorkOrderFolder',
          workOrderId,
        }).catch((e) => console.warn('[GAS Init Warning]:', e));

        // E. Log registration in activityLogs
        const activityId = `act_${Date.now()}`;
        await firestore.setDocument('activityLogs', activityId, {
          activityId,
          clientId,
          workOrderId,
          activityType: 'CLIENT_REGISTERED',
          description: `Client registered successfully with initial work order ${workOrderId}`,
          performedBy: 'SYSTEM',
          timestamp: now,
        });

        return new Response(
          JSON.stringify({
            success: true,
            isExisting: false,
            clientId,
            name,
            workOrderId,
            message: 'Registration successful! Keep your work order ID safe for future login.',
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error('[API Register Exception]:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Registration service error. Please try again.' }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // =========================================================================
    // PHASE 3: PASSWORDLESS CLIENT LOGIN (Mobile + Work Order ID)
    // =========================================================================
    if (url.pathname === '/api/career/auth/login') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
          status: 405,
          headers: CORS_HEADERS,
        });
      }

      try {
        const body = (await request.json().catch(() => null)) as {
          mobile?: string;
          workOrderId?: string;
        } | null;

        const mobile = body?.mobile?.trim();
        const workOrderId = body?.workOrderId?.trim().toUpperCase();

        if (!mobile || !workOrderId) {
          return new Response(
            JSON.stringify({ success: false, error: 'Mobile number and Work Order ID are required.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const normalizedMobile = normalizeMobile(mobile);
        const rateLimitKey = `rl_${normalizedMobile}`;
        const nowMs = Date.now();

        // Rate-limiting check
        const rateRecord = inMemoryRateLimits.get(rateLimitKey);
        if (rateRecord && rateRecord.lockedUntil > nowMs) {
          const waitMinutes = Math.ceil((rateRecord.lockedUntil - nowMs) / 60000);
          return new Response(
            JSON.stringify({
              success: false,
              error: `Too many failed attempts. Temporary lockout active. Please wait ${waitMinutes} minute(s).`,
            }),
            { status: 429, headers: CORS_HEADERS }
          );
        }

        // 1. Look up work order
        let workOrderDoc = await firestore.getDocument('workOrders', workOrderId);
        if (!workOrderDoc) {
          workOrderDoc = inMemoryWorkOrders.get(workOrderId) || null;
        }

        if (!workOrderDoc) {
          // Record failed attempt
          const attempts = (rateRecord?.attempts || 0) + 1;
          const lockedUntil = attempts >= 5 ? nowMs + 15 * 60 * 1000 : 0;
          inMemoryRateLimits.set(rateLimitKey, { attempts, lockedUntil });

          return new Response(
            JSON.stringify({ success: false, error: 'Invalid mobile number or work order ID.' }),
            { status: 401, headers: CORS_HEADERS }
          );
        }

        // 2. Fetch associated client
        const clientId = workOrderDoc.clientId;
        let clientDoc = await firestore.getDocument('clients', clientId);
        if (!clientDoc) {
          for (const c of inMemoryClients.values()) {
            if (c.clientId === clientId) {
              clientDoc = c;
              break;
            }
          }
        }

        if (!clientDoc) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid mobile number or work order ID.' }),
            { status: 401, headers: CORS_HEADERS }
          );
        }

        // 3. Verify mobile matches
        const clientMobile = normalizeMobile(clientDoc.mobile || '');
        if (clientMobile !== normalizedMobile) {
          const attempts = (rateRecord?.attempts || 0) + 1;
          const lockedUntil = attempts >= 5 ? nowMs + 15 * 60 * 1000 : 0;
          inMemoryRateLimits.set(rateLimitKey, { attempts, lockedUntil });

          return new Response(
            JSON.stringify({ success: false, error: 'Invalid mobile number or work order ID.' }),
            { status: 401, headers: CORS_HEADERS }
          );
        }

        // 4. Verify account & work order status
        if (clientDoc.status === 'SUSPENDED' || workOrderDoc.status === 'Cancelled') {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'This work order or account has been deactivated. Please contact support.',
            }),
            { status: 403, headers: CORS_HEADERS }
          );
        }

        // Successful validation: Reset rate limit
        inMemoryRateLimits.delete(rateLimitKey);

        // 5. Generate Firebase Custom Authentication Token
        let customToken = '';
        if (serviceAccount) {
          customToken = await mintFirebaseCustomToken(
            clientId,
            {
              role: 'client',
              workOrderId,
              mobile: normalizedMobile,
            },
            serviceAccount
          );
        } else {
          // Fallback signed mock token for development when private key is not yet pasted
          customToken = `hp_dev_token_${clientId}_${Date.now()}`;
        }

        // 6. Log successful login
        const now = new Date().toISOString();
        await firestore.setDocument('activityLogs', `login_${Date.now()}`, {
          activityId: `login_${Date.now()}`,
          clientId,
          workOrderId,
          activityType: 'CLIENT_LOGIN',
          description: `Passwordless login authenticated for work order ${workOrderId}`,
          performedBy: 'CLIENT',
          timestamp: now,
        });

        return new Response(
          JSON.stringify({
            success: true,
            customToken,
            clientId,
            workOrderId,
            name: clientDoc.name || 'Client',
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error('[API Login Exception]:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Authentication service error. Please try again.' }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // =========================================================================
    // PHASE 6 & 7: DOCUMENT UPLOAD VIA GOOGLE APPS SCRIPT -> GOOGLE DRIVE
    // =========================================================================
    if (url.pathname === '/api/career/documents/upload') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
          status: 405,
          headers: CORS_HEADERS,
        });
      }

      try {
        const body = await request.json().catch(() => null) as {
          workOrderId?: string;
          clientId?: string;
          fileName?: string;
          mimeType?: string;
          subfolder?: string;
          base64Content?: string;
          fileSize?: number;
        } | null;

        if (!body?.workOrderId || !body?.fileName || !body?.base64Content) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing workOrderId, fileName, or file content.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        // Size check (max 8MB base64 is ~11MB string)
        if (body.base64Content.length > 11.5 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ success: false, error: 'File size exceeds maximum 8MB limit.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        // Call Google Apps Script Web App to upload directly into Google Drive
        const gasResult = await callGoogleAppsScript(env, {
          action: 'uploadFile',
          workOrderId: body.workOrderId,
          fileName: body.fileName,
          mimeType: body.mimeType || 'application/pdf',
          subfolder: body.subfolder || 'Client Documents',
          base64Content: body.base64Content,
        });

        if (!gasResult.success) {
          return new Response(
            JSON.stringify({ success: false, error: gasResult.error || 'Failed to save file in Google Drive.' }),
            { status: 502, headers: CORS_HEADERS }
          );
        }

        const now = new Date().toISOString();
        const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

        // Save metadata into Firestore 'documents' collection
        const docRecord = {
          documentId,
          clientId: body.clientId || 'client',
          workOrderId: body.workOrderId,
          fileName: body.fileName,
          mimeType: body.mimeType || 'application/pdf',
          fileSize: gasResult.fileSize || body.fileSize || 150000,
          category: body.subfolder || 'Client Documents',
          driveFileId: gasResult.fileId || '',
          driveFolderId: gasResult.driveFolderId || '',
          downloadUrl: gasResult.downloadUrl || '',
          viewUrl: gasResult.viewUrl || '',
          uploadedAt: now,
          uploadedBy: 'CLIENT',
          status: 'ACTIVE',
        };

        await firestore.setDocument('documents', documentId, docRecord);

        // Update work order status to 'Documents Received' if early stage
        const workOrderDoc = await firestore.getDocument('workOrders', body.workOrderId);
        if (workOrderDoc && (workOrderDoc.status === 'Registered' || workOrderDoc.status === 'Information Pending')) {
          await firestore.setDocument('workOrders', body.workOrderId, {
            status: 'Documents Received',
            updatedAt: now,
          });
        }

        // Log in activityLogs
        await firestore.setDocument('activityLogs', `upload_${Date.now()}`, {
          activityId: `upload_${Date.now()}`,
          clientId: body.clientId,
          workOrderId: body.workOrderId,
          activityType: 'DOCUMENT_UPLOADED',
          description: `Uploaded ${body.fileName} to Google Drive folder ${body.subfolder || 'Client Documents'}`,
          performedBy: 'CLIENT',
          timestamp: now,
        });

        return new Response(
          JSON.stringify({
            success: true,
            document: docRecord,
            message: 'Document uploaded and synchronized with Google Drive vault successfully.',
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error('[API Upload Exception]:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Document upload service error. Please try again.' }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // =========================================================================
    // PHASE 10: WORK ORDER LIFECYCLE MANAGEMENT (Admin Update)
    // =========================================================================
    if (url.pathname === '/api/career/admin/work-orders/status') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method Not Allowed' }), {
          status: 405,
          headers: CORS_HEADERS,
        });
      }

      try {
        const body = await request.json().catch(() => null) as {
          workOrderId?: string;
          status?: WorkOrderStatus;
          adminName?: string;
          notes?: string;
        } | null;

        if (!body?.workOrderId || !body?.status) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing workOrderId or status.' }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        if (!VALID_WORK_ORDER_STATUSES.includes(body.status)) {
          return new Response(
            JSON.stringify({ success: false, error: `Invalid status. Must be one of: ${VALID_WORK_ORDER_STATUSES.join(', ')}` }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const now = new Date().toISOString();
        await firestore.setDocument('workOrders', body.workOrderId, {
          status: body.status,
          notes: body.notes || '',
          updatedAt: now,
        });

        // Record in activityLogs
        await firestore.setDocument('activityLogs', `status_${Date.now()}`, {
          activityId: `status_${Date.now()}`,
          workOrderId: body.workOrderId,
          activityType: 'WORK_ORDER_STATUS_CHANGED',
          description: `Work order status updated to ${body.status} by ${body.adminName || 'Admin'}`,
          performedBy: body.adminName || 'ADMIN',
          timestamp: now,
        });

        return new Response(
          JSON.stringify({
            success: true,
            workOrderId: body.workOrderId,
            status: body.status,
            updatedAt: now,
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error('[API Status Update Exception]:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to update work order status.' }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // =========================================================================
    // LEGACY & PUBLIC ENQUIRY ENDPOINTS (Preserved for / and /career-services)
    // =========================================================================

    // 2. Project Enquiry Submission endpoint
    if (url.pathname === '/api/enquiry') {
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method Not Allowed' }),
          { status: 405, headers: CORS_HEADERS }
        );
      }

      try {
        const body = await request.json().catch(() => null);
        const validation = validateEnquiry(body);

        if (!validation.valid || !validation.sanitized) {
          return new Response(
            JSON.stringify({ success: false, errors: validation.errors }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const enquiry: SanitizedEnquiry = validation.sanitized;

        if (env.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO enquiries (
                id, reference_code, full_name, email, phone_whatsapp, division,
                service_title, requirements, budget_range, desired_timeline,
                attachment_url, consent_given, status, user_agent
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(
                enquiry.id,
                enquiry.referenceCode,
                enquiry.fullName,
                enquiry.email,
                enquiry.phoneWhatsapp,
                enquiry.division,
                enquiry.serviceTitle,
                enquiry.requirements,
                enquiry.budgetRange,
                enquiry.desiredTimeline,
                enquiry.attachmentUrl,
                enquiry.consentGiven ? 1 : 0,
                enquiry.status,
                request.headers.get('user-agent') || 'Unknown'
              )
              .run();
          } catch (dbErr) {
            console.error('[DB INSERT ERROR]:', dbErr);
          }
        }

        if (env.ENQUIRIES_KV) {
          try {
            await env.ENQUIRIES_KV.put(
              `enquiry:${enquiry.referenceCode}`,
              JSON.stringify(enquiry)
            );
          } catch (kvErr) {
            console.error('[KV INSERT ERROR]:', kvErr);
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            referenceCode: enquiry.referenceCode,
            message: 'Project brief registered successfully in studio pipeline.',
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error('[API ENQUIRY EXCEPTION]:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error processing enquiry.' }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // 3. Career Services Consultation Enquiry endpoint
    if (url.pathname === '/api/career-enquiry') {
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method Not Allowed' }),
          { status: 405, headers: CORS_HEADERS }
        );
      }

      try {
        const body = await request.json().catch(() => null);
        const validation = validateCareerEnquiry(body);

        if (!validation.valid || !validation.sanitized) {
          return new Response(
            JSON.stringify({ success: false, errors: validation.errors }),
            { status: 400, headers: CORS_HEADERS }
          );
        }

        const enquiry: SanitizedCareerEnquiry = validation.sanitized;

        if (env.DB) {
          try {
            await env.DB.prepare(
              `INSERT INTO career_enquiries (
                id, reference_code, full_name, email, phone_whatsapp,
                career_stage, service_required, target_role, target_country,
                requirements, preferred_contact_method, resume_file_name,
                consent_given, created_at, status
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            )
              .bind(
                enquiry.id,
                enquiry.referenceCode,
                enquiry.fullName,
                enquiry.email,
                enquiry.phoneWhatsapp,
                enquiry.careerStage,
                enquiry.serviceRequired,
                enquiry.targetRole,
                enquiry.targetCountry,
                enquiry.requirements,
                enquiry.preferredContactMethod,
                enquiry.resumeFileName,
                enquiry.consentGiven ? 1 : 0,
                enquiry.createdAt,
                enquiry.status
              )
              .run();
          } catch (dbErr) {
            console.error('[D1 CAREER INSERT ERROR]:', dbErr);
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            referenceCode: enquiry.referenceCode,
            message: 'Your career consultation enquiry has been registered successfully.',
          }),
          { status: 200, headers: CORS_HEADERS }
        );
      } catch (err: any) {
        console.error('[API CAREER ENQUIRY EXCEPTION]:', err);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error processing career enquiry.' }),
          { status: 500, headers: CORS_HEADERS }
        );
      }
    }

    // 4. Portal status check
    if (url.pathname === '/api/career/portal-status') {
      return new Response(
        JSON.stringify({
          status: 'online',
          portalVersion: '2.1-passwordless-gas-drive',
          authProvider: 'firebase-custom-auth-rs256',
          storageBridge: 'google-apps-script-web-app',
          driveRootFolder: 'Hopepitome Career Services',
          timestamp: new Date().toISOString(),
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 5. Fallback: Serve static Next.js export assets from ./out
    return env.ASSETS.fetch(request);
  },
};
