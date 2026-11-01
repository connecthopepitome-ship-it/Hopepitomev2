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
  StaffUser,
  StaffRole,
  StaffDepartment,
  StaffActivityLog,
  StaffLoginLog,
  ServiceItem,
  EnterpriseProjectRecord,
  QuotationRecord,
  SupportTicketRecord,
  MaintenanceContractRecord,
  DiscoveryRecord,
  UniversalTaskRecord,
  CommercialInvoiceRecord,
  CommercialPaymentRecord,
  ClientRecord,
  CareerEnquiryRecord,
  CareerEnquiryStatus,
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

/**
 * Resilient document persister: writes through client Firestore SDK first;
 * if rejected by rules or network/SSR, automatically fails over to Cloudflare Worker Admin API.
 */
export async function resilientSaveDoc(
  collectionName: string,
  docId: string,
  data: any
): Promise<void> {
  const payload = cleanData(data);
  let savedLocally = false;

  if (db) {
    try {
      const clientWritePromise = setDoc(doc(db, collectionName, docId), payload, { merge: true });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Client SDK write timeout')), 2500)
      );
      await Promise.race([clientWritePromise, timeoutPromise]);
      savedLocally = true;
    } catch (clientErr) {
      console.warn(
        `[Firestore] Client SDK write to ${collectionName}/${docId} rejected or timed out, failing over to Worker API...`,
        clientErr
      );
    }
  }

  if (!savedLocally) {
    let savedViaApi = false;
    try {
      const res = await fetch('/api/career/admin/entity/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: collectionName, id: docId, data: payload }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok && resData.success) {
        savedViaApi = true;
      }
    } catch (apiErr) {
      console.warn(`[Firestore] Worker entity/save error for ${collectionName}:`, apiErr);
    }

    if (!savedViaApi && collectionName === 'crm_leads') {
      try {
        const leadRes = await fetch('/api/career/crm/lead/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const leadData = await leadRes.json().catch(() => ({}));
        if (leadRes.ok && leadData.success) {
          savedViaApi = true;
        }
      } catch (fallbackErr) {
        console.error('[Firestore] Fallback crm/lead/save exception:', fallbackErr);
      }
    }

    if (!savedViaApi) {
      throw new Error(`Failed to save ${collectionName} record. Please verify network connectivity.`);
    }
  }
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
  await resilientSaveDoc('career_users', user.uid, user);
}

// 2. Client Profile & Extended Data
export function subscribeClients(callback: (clients: ClientRecord[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'clients'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ clientId: d.id, ...d.data() } as ClientRecord));
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    callback(list);
  });
}

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
  await resilientSaveDoc('clients', client.id, client);
  await resilientSaveDoc('career_clients', client.id, client).catch(() => {});
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
  await resilientSaveDoc('career_profiles', profile.clientId, profile);
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
  await resilientSaveDoc('career_tasks', task.id, task);
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
  await resilientSaveDoc('career_invoices', invoice.id, invoice);
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
  await resilientSaveDoc('crm_leads', lead.id, lead);
}

export async function updateCrmLeadStage(
  leadId: string,
  stage: CrmPipelineStage,
  lostReason?: string
): Promise<void> {
  const updates: any = {
    stage,
    updatedAt: new Date().toISOString(),
  };
  if (lostReason) {
    updates.lostReason = lostReason;
  }
  await resilientSaveDoc('crm_leads', leadId, updates);
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
  await resilientSaveDoc('crm_followups', followUp.id, followUp);
}

export async function completeCrmFollowUp(
  id: string,
  outcome: CrmFollowUpOutcome,
  outcomeNotes?: string
): Promise<void> {
  const updates = {
    status: 'COMPLETED',
    outcome,
    outcomeNotes: outcomeNotes || '',
    completedAt: new Date().toISOString(),
  };
  await resilientSaveDoc('crm_followups', id, updates);
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
  const item: CrmActivity = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `act_${Date.now()}`,
    ...activity,
    timestamp: new Date().toISOString(),
  };
  try {
    await resilientSaveDoc('crm_activities', item.id, item);
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
  await resilientSaveDoc('crm_consultations', consultation.id, consultation);
}

// 13B. Dedicated Career Enquiries
export function subscribeCareerEnquiries(
  callback: (enquiries: CareerEnquiryRecord[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'career_enquiries'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerEnquiryRecord));
    list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
    callback(list);
  });
}

export async function saveCareerEnquiry(enquiry: CareerEnquiryRecord): Promise<void> {
  await resilientSaveDoc('career_enquiries', enquiry.id, enquiry);
}

export async function updateCareerEnquiryStatus(
  enquiryId: string,
  status: CareerEnquiryStatus,
  adminNotes?: string
): Promise<void> {
  const updates: any = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    updates.adminNotes = adminNotes;
  }
  await resilientSaveDoc('career_enquiries', enquiryId, updates);
}

// =============================================================================
// EMPLOYEE MANAGEMENT & ACCESS CONTROL OPERATIONS
// =============================================================================

// 14. Staff Users Directory
export function subscribeStaffUsers(callback: (users: StaffUser[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'staffUsers'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as StaffUser));
    list.sort((a, b) => (a.employeeId || '').localeCompare(b.employeeId || ''));
    callback(list);
  });
}

export async function getStaffUser(uid: string): Promise<StaffUser | null> {
  if (!db || !uid) return null;
  try {
    const snap = await getDoc(doc(db, 'staffUsers', uid));
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() } as StaffUser;
  } catch (err) {
    console.error('getStaffUser error:', err);
    return null;
  }
}

export async function saveStaffUser(user: StaffUser): Promise<void> {
  await resilientSaveDoc('staff', user.uid, user);
  await resilientSaveDoc('staffUsers', user.uid, user).catch(() => {});
}

// 15. Staff Roles
export function subscribeStaffRoles(callback: (roles: StaffRole[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'staffRoles'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ roleId: d.id, ...d.data() } as StaffRole));
    callback(list);
  });
}

export async function saveStaffRole(role: StaffRole): Promise<void> {
  await resilientSaveDoc('staffRoles', role.roleId, role);
}

// 16. Staff Departments
export function subscribeStaffDepartments(callback: (departments: StaffDepartment[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'staffDepartments'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ departmentId: d.id, ...d.data() } as StaffDepartment));
    list.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
    callback(list);
  });
}

export async function saveStaffDepartment(department: StaffDepartment): Promise<void> {
  await resilientSaveDoc('staffDepartments', department.departmentId, department);
}

// 17. Staff Activity Logs
export function subscribeStaffActivityLogs(
  callback: (logs: StaffActivityLog[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'staffActivityLogs'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as StaffActivityLog));
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  });
}

export async function logStaffActivity(
  activity: Omit<StaffActivityLog, 'id' | 'timestamp'>
): Promise<void> {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `stf_act_${Date.now()}`;
  const item: StaffActivityLog = {
    id,
    ...activity,
    timestamp: new Date().toISOString(),
  };
  try {
    await resilientSaveDoc('staffActivityLogs', item.id, item);
  } catch (e) {
    console.warn('logStaffActivity error:', e);
  }
}

// 18. Staff Login Logs
export function subscribeStaffLoginLogs(callback: (logs: StaffLoginLog[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'staffLoginLogs'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as StaffLoginLog));
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  });
}

export async function logStaffLogin(log: Omit<StaffLoginLog, 'id' | 'timestamp'>): Promise<void> {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`;
  const item: StaffLoginLog = {
    id,
    ...log,
    timestamp: new Date().toISOString(),
  };
  try {
    await resilientSaveDoc('staffLoginLogs', item.id, item);
  } catch (e) {
    console.warn('logStaffLogin warning:', e);
  }
}

// =============================================================================
// MULTI-SERVICE PLATFORM FIRESTORE OPERATIONS (IT & CAREER DIVISIONS)
// =============================================================================

// 19. Service Catalogue
export function subscribeServiceCatalogue(callback: (items: ServiceItem[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'service_catalogue'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceItem));
    list.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    callback(list);
  });
}

export async function saveServiceItem(item: ServiceItem): Promise<void> {
  await resilientSaveDoc('service_catalogue', item.id, item);
}

// 20. Projects & Milestones
export function subscribeProjects(callback: (projects: EnterpriseProjectRecord[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'projects'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as EnterpriseProjectRecord));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  });
}

export async function saveProject(project: EnterpriseProjectRecord): Promise<void> {
  const docId = project.id || (project as any).projectId;
  await resilientSaveDoc('projects', docId, project);
}

export async function getProjectById(projectId: string): Promise<EnterpriseProjectRecord | null> {
  if (!db || !projectId) return null;
  try {
    const snap = await getDoc(doc(db, 'projects', projectId));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as EnterpriseProjectRecord) : null;
  } catch (e) {
    console.error('getProjectById error:', e);
    return null;
  }
}

// 21. Proposals & Quotations
export function subscribeQuotations(callback: (quotes: QuotationRecord[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'quotations'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as QuotationRecord));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  });
}

export async function saveQuotation(quote: QuotationRecord): Promise<void> {
  const docId = quote.id || (quote as any).quotationId;
  await resilientSaveDoc('quotations', docId, quote);
}

// 22. Support Tickets
export function subscribeSupportTickets(callback: (tickets: SupportTicketRecord[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'support_tickets'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ ticketId: d.id, ...d.data() } as SupportTicketRecord));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  });
}

export async function saveSupportTicket(ticket: SupportTicketRecord): Promise<void> {
  await resilientSaveDoc('support_tickets', ticket.ticketId, ticket);
}

// 23. Maintenance Contracts
export function subscribeMaintenanceContracts(callback: (contracts: MaintenanceContractRecord[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'maintenance_contracts'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ contractId: d.id, ...d.data() } as MaintenanceContractRecord));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  });
}

export async function saveMaintenanceContract(contract: MaintenanceContractRecord): Promise<void> {
  await resilientSaveDoc('maintenance_contracts', contract.contractId, contract);
}

// 24. Technical Discoveries
export function subscribeDiscoveries(callback: (discoveries: DiscoveryRecord[]) => void): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, 'discoveries'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ discoveryId: d.id, ...d.data() } as DiscoveryRecord));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  });
}

export async function saveDiscoveryRecord(discovery: DiscoveryRecord): Promise<void> {
  await resilientSaveDoc('discoveries', discovery.discoveryId, discovery);
}

// 25. Universal Tasks
export function subscribeUniversalTasks(
  entityType?: string,
  entityId?: string,
  callback?: (tasks: UniversalTaskRecord[]) => void
): () => void {
  const cb = callback || ((() => {}) as any);
  if (!db) {
    cb([]);
    return () => {};
  }
  let q = query(collection(db, 'universal_tasks'));
  if (entityType && entityId) {
    q = query(collection(db, 'universal_tasks'), where('entityType', '==', entityType), where('entityId', '==', entityId));
  }
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({ taskId: d.id, ...d.data() } as UniversalTaskRecord));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    cb(list);
  });
}

export async function saveUniversalTask(task: UniversalTaskRecord): Promise<void> {
  await resilientSaveDoc('universal_tasks', task.taskId, task);
}



