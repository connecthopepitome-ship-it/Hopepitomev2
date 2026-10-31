/**
 * HOPEPITOME CAREER SERVICES — FIRESTORE OPERATIONS LAYER
 * Real-time listeners, typed collection helpers, and audit tracking.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type {
  CareerClient,
  CareerProfileData,
  ServiceOrder,
  CareerTask,
  CareerDeliverable,
  RevisionRequest,
  CareerMessage,
  CareerDocument,
  CareerInvoice,
  CareerNotification,
  CareerActivityLog,
  CareerUser,
  UserRole,
  CrmLead,
  CrmPipelineStage,
  CrmFollowUp,
  CrmFollowUpOutcome,
  CrmActivity,
  CrmConsultation,
} from '../career/types';

// Helper to sanitize undefined values before saving to Firestore
function cleanData<T extends Record<string, any>>(obj: T): T {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Timestamp)) {
        result[key] = cleanData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// 1. Users & RBAC
export async function getCareerUser(uid: string): Promise<CareerUser | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'career_users', uid));
    return snap.exists() ? (snap.data() as CareerUser) : null;
  } catch (e) {
    console.error('Error fetching career user:', e);
    return null;
  }
}

export async function setCareerUser(user: CareerUser): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_users', user.uid), cleanData(user), { merge: true });
}

// 2. Client Profile & Extended Data
export async function getCareerClient(clientId: string): Promise<CareerClient | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'career_clients', clientId));
    return snap.exists() ? (snap.data() as CareerClient) : null;
  } catch (e) {
    console.error('Error fetching career client:', e);
    return null;
  }
}

export async function saveCareerClient(client: CareerClient): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_clients', client.id), cleanData(client), { merge: true });
}

export async function getCareerProfile(clientId: string): Promise<CareerProfileData | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'career_profiles', clientId));
    return snap.exists() ? (snap.data() as CareerProfileData) : null;
  } catch (e) {
    console.error('Error fetching career profile:', e);
    return null;
  }
}

export async function saveCareerProfile(profile: Partial<CareerProfileData> & { clientId: string }): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_profiles', profile.clientId), cleanData(profile), { merge: true });
}

// 3. Service Orders
export function subscribeClientOrders(
  clientId: string,
  callback: (orders: ServiceOrder[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, 'career_service_orders'),
    where('clientId', '==', clientId)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceOrder));
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (err) => {
      console.error('Error listening to client orders:', err);
      callback([]);
    }
  );
}

export function subscribeAllOrders(callback: (orders: ServiceOrder[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_service_orders'));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceOrder));
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(orders);
    },
    (err) => {
      console.error('Error listening to all orders:', err);
      callback([]);
    }
  );
}

export async function createServiceOrder(order: Omit<ServiceOrder, 'id'>): Promise<string> {
  if (!db) throw new Error('Database unavailable');
  const docRef = await addDoc(collection(db, 'career_service_orders'), cleanData(order));
  return docRef.id;
}

export async function updateServiceOrderStatus(
  orderId: string,
  status: ServiceOrder['status'],
  stage: string,
  progress: number
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'career_service_orders', orderId), {
    status,
    currentStage: stage,
    progressPercent: progress,
    updatedAt: new Date().toISOString(),
  });
}

// 4. Tasks
export function subscribeTasksForOrder(
  orderId: string,
  callback: (tasks: CareerTask[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_tasks'), where('orderId', '==', orderId));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerTask));
    callback(tasks);
  });
}

export function subscribeAllTasks(callback: (tasks: CareerTask[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_tasks'));
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerTask));
    callback(tasks);
  });
}

export async function saveTask(task: CareerTask): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_tasks', task.id), cleanData(task), { merge: true });
}

// 5. Deliverables & Revisions
export function subscribeDeliverables(
  orderId: string,
  callback: (deliverables: CareerDeliverable[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_deliverables'), where('orderId', '==', orderId));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerDeliverable));
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(items);
  });
}

export async function addDeliverable(deliverable: CareerDeliverable): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_deliverables', deliverable.id), cleanData(deliverable));
}

export async function updateDeliverableStatus(
  deliverableId: string,
  approvalStatus: CareerDeliverable['approvalStatus'],
  feedback?: string
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'career_deliverables', deliverableId), {
    approvalStatus,
    feedbackNotes: feedback || null,
  });
}

export function subscribeRevisions(
  orderId: string,
  callback: (revisions: RevisionRequest[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_revisions'), where('orderId', '==', orderId));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as RevisionRequest));
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(items);
  });
}

export async function submitRevisionRequest(req: RevisionRequest): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_revisions', req.id), cleanData(req));
}

// 6. Messages
export function subscribeMessages(
  clientId: string,
  callback: (messages: CareerMessage[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_messages'), where('clientId', '==', clientId));
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerMessage));
    msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    callback(msgs);
  });
}

export async function sendMessage(msg: CareerMessage): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_messages', msg.id), cleanData(msg));
}

// 7. Documents Vault
export function subscribeDocuments(
  clientId: string,
  callback: (docs: CareerDocument[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_documents'), where('clientId', '==', clientId));
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerDocument));
    docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(docs);
  });
}

export async function addDocumentRecord(docRecord: CareerDocument): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_documents', docRecord.id), cleanData(docRecord));
}

// 8. Invoices & Quotations
export function subscribeClientInvoices(
  clientId: string,
  callback: (invoices: CareerInvoice[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_invoices'), where('clientId', '==', clientId));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerInvoice));
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(items);
  });
}

export function subscribeAllInvoices(callback: (invoices: CareerInvoice[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_invoices'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerInvoice));
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(items);
  });
}

export async function saveInvoice(invoice: CareerInvoice): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'career_invoices', invoice.id), cleanData(invoice), { merge: true });
}

// 9. Activity Log & Audit
export async function logActivity(log: Omit<CareerActivityLog, 'id' | 'timestamp'>): Promise<void> {
  if (!db) return;
  try {
    const logItem: CareerActivityLog = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`,
      ...log,
      timestamp: new Date().toISOString(),
    };
    await addDoc(collection(db, 'career_activity_logs'), cleanData(logItem));
  } catch (e) {
    console.warn('Activity logging warning:', e);
  }
}

// =============================================================================
// CRM FIRESTORE HELPERS
// =============================================================================

// 10. Leads Inbox & Pipeline
export function subscribeCrmLeads(callback: (leads: CrmLead[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'crm_leads'));
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CrmLead));
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(leads);
  });
}

export async function saveCrmLead(lead: CrmLead): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'crm_leads', lead.id), cleanData(lead), { merge: true });
}

export async function updateCrmLeadStage(
  leadId: string,
  stage: CrmPipelineStage,
  lostReason?: string
): Promise<void> {
  if (!db) return;
  const updates: any = {
    stage,
    updatedAt: new Date().toISOString(),
  };
  if (lostReason) {
    updates.lostReason = lostReason;
  }
  await updateDoc(doc(db, 'crm_leads', leadId), cleanData(updates));
}

// 11. Follow-ups
export function subscribeCrmFollowUps(callback: (followUps: CrmFollowUp[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'crm_followups'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CrmFollowUp));
    list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    callback(list);
  });
}

export async function saveCrmFollowUp(followUp: CrmFollowUp): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'crm_followups', followUp.id), cleanData(followUp), { merge: true });
}

export async function completeCrmFollowUp(
  id: string,
  outcome: CrmFollowUpOutcome,
  outcomeNotes?: string
): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'crm_followups', id), {
    status: 'COMPLETED',
    outcome,
    outcomeNotes: outcomeNotes || '',
    completedAt: new Date().toISOString(),
  });
}

// 12. CRM Activity Timeline
export function subscribeCrmActivities(
  leadId: string,
  callback: (activities: CrmActivity[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'crm_activities'), where('leadId', '==', leadId));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CrmActivity));
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  });
}

export async function logCrmActivity(
  activity: Omit<CrmActivity, 'id' | 'timestamp'>
): Promise<void> {
  if (!db) return;
  try {
    const item: CrmActivity = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `act_${Date.now()}`,
      ...activity,
      timestamp: new Date().toISOString(),
    };
    await addDoc(collection(db, 'crm_activities'), cleanData(item));
  } catch (e) {
    console.warn('CRM activity logging warning:', e);
  }
}

// 13. Consultations
export function subscribeCrmConsultations(
  callback: (consultations: CrmConsultation[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'crm_consultations'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CrmConsultation));
    list.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    callback(list);
  });
}

export async function saveCrmConsultation(consultation: CrmConsultation): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'crm_consultations', consultation.id), cleanData(consultation), { merge: true });
}


