/**
 * Shared Hopepitome Candidate / Work Order ID generator (`HP-YYYY-XXXXX`).
 * Uses cryptographic randomness + atomic database uniqueness reservation
 * (`createDocumentIfAbsent`) with automatic collision retry (never KV counters).
 */

import type { EdgeFirestoreClient } from '../firebase/edge-firestore';

const WORK_ORDER_ID_REGEX = /^HP-(?:\d{4}-)?\d{4,6}$/i;

export function isCanonicalWorkOrderId(value: unknown): boolean {
  return WORK_ORDER_ID_REGEX.test(String(value || '').trim());
}

export function generateWorkOrderId(digits = 5): string {
  const year = new Date().getFullYear();
  const min = digits === 6 ? 100000 : 10000;
  const span = digits === 6 ? 900000 : 90000;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const suffix = min + (buf[0] % span);
  return `HP-${year}-${suffix}`;
}

export interface ReserveWorkOrderOptions {
  firestore: EdgeFirestoreClient;
  clientId: string;
  clientName: string;
  clientMobile: string;
  serviceType?: string;
  generatedVia?: string;
  inMemoryWorkOrders?: Map<string, Record<string, any>>;
}

/**
 * Generates and atomically claims a unique `workOrders/<HP-YYYY-XXXXX>` record,
 * retrying automatically if another concurrent signup claims the same ID.
 */
export async function reserveUniqueWorkOrder(
  opts: ReserveWorkOrderOptions
): Promise<{ workOrderId: string; workOrderRecord: Record<string, any> }> {
  const now = new Date().toISOString();

  for (let attempt = 0; attempt < 15; attempt++) {
    const digits = attempt >= 10 ? 6 : 5;
    const candidateId = generateWorkOrderId(digits);

    if (opts.inMemoryWorkOrders?.has(candidateId)) {
      continue;
    }

    const workOrderRecord: Record<string, any> = {
      workOrderId: candidateId,
      clientId: opts.clientId,
      clientName: opts.clientName,
      clientMobile: opts.clientMobile,
      serviceType: opts.serviceType || 'RESUME_WRITING',
      status: 'Registered',
      loginStatus: 'ACTIVE',
      generatedVia: opts.generatedVia || 'REGISTRATION',
      loginCount: 0,
      failedLoginAttempts: 0,
      createdAt: now,
      updatedAt: now,
    };

    if (typeof (opts.firestore as any).createDocumentIfAbsent === 'function') {
      const outcome = await opts.firestore.createDocumentIfAbsent('workOrders', candidateId, workOrderRecord);
      if (outcome === 'created') {
        opts.inMemoryWorkOrders?.set(candidateId, workOrderRecord);
        return { workOrderId: candidateId, workOrderRecord };
      }
      if (outcome === 'conflict') {
        continue;
      }
    } else {
      const existing = await opts.firestore.getDocument('workOrders', candidateId).catch(() => null);
      if (existing) {
        continue;
      }
      await opts.firestore.setDocument('workOrders', candidateId, workOrderRecord, false);
      opts.inMemoryWorkOrders?.set(candidateId, workOrderRecord);
      return { workOrderId: candidateId, workOrderRecord };
    }
  }

  throw new Error('Unable to reserve a unique Candidate ID right now. Please try again.');
}

/**
 * Ensures a logged-in candidate has a valid canonical Candidate ID (`HP-YYYY-XXXXX`)
 * persisted in their profile (`clients`, `workOrders`), generating one automatically if missing.
 */
export async function ensureCandidateWorkOrderId(
  firestore: EdgeFirestoreClient,
  clientId: string,
  clientDoc: Record<string, any> | null,
  fallbackInfo: { name: string; email?: string; mobile?: string }
): Promise<{ workOrderId: string; clientDoc: Record<string, any> }> {
  const existingWoId = String(clientDoc?.currentWorkOrderId || '').trim().toUpperCase();
  if (existingWoId && isCanonicalWorkOrderId(existingWoId)) {
    const existingWo = await firestore.getDocument('workOrders', existingWoId).catch(() => null);
    if (!existingWo) {
      const now = new Date().toISOString();
      await firestore
        .createDocumentIfAbsent('workOrders', existingWoId, {
          workOrderId: existingWoId,
          clientId,
          clientName: String(clientDoc?.fullName || clientDoc?.name || fallbackInfo.name || 'Candidate'),
          clientMobile: String(clientDoc?.mobile || clientDoc?.phone || fallbackInfo.mobile || ''),
          serviceType: 'JOB_MATCH',
          status: 'Registered',
          loginStatus: 'ACTIVE',
          generatedVia: 'AUTO_BACKFILL',
          loginCount: 0,
          failedLoginAttempts: 0,
          createdAt: now,
          updatedAt: now,
        })
        .catch(() => {});
    }
    return { workOrderId: existingWoId, clientDoc: clientDoc || {} };
  }

  const resolvedName = String(clientDoc?.fullName || clientDoc?.name || fallbackInfo.name || 'Candidate');
  const resolvedMobile = String(clientDoc?.mobile || clientDoc?.phone || fallbackInfo.mobile || '');
  const now = new Date().toISOString();

  const { workOrderId } = await reserveUniqueWorkOrder({
    firestore,
    clientId,
    clientName: resolvedName,
    clientMobile: resolvedMobile,
    serviceType: 'JOB_MATCH',
    generatedVia: 'JOB_MATCH_AUTO_PROVISION',
  });

  const existingIds: string[] = Array.isArray(clientDoc?.workOrderIds)
    ? clientDoc!.workOrderIds.map((id: unknown) => String(id))
    : [];

  const updatedClient: Record<string, any> = {
    ...(clientDoc || {}),
    clientId,
    id: clientId,
    name: resolvedName,
    fullName: resolvedName,
    email: String(clientDoc?.email || fallbackInfo.email || ''),
    mobile: resolvedMobile,
    status: clientDoc?.status || 'ACTIVE',
    currentWorkOrderId: workOrderId,
    workOrderIds: Array.from(new Set([...existingIds, workOrderId])),
    createdAt: clientDoc?.createdAt || now,
    updatedAt: now,
  };

  await firestore.setDocument('clients', clientId, updatedClient, true);
  return { workOrderId, clientDoc: updatedClient };
}
