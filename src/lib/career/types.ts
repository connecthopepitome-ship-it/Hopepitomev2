/**
 * HOPEPITOME CAREER SERVICES — CORE TYPES & DATA SCHEMA
 * Defines contracts for Client Portal, Admin Workspace, Work Orders,
 * Career Profiles, Deliverables, Revisions, and Financial Records.
 */

export type UserRole =
  | 'client'
  | 'super_admin'
  | 'admin'
  | 'consultant'
  | 'writer'
  | 'job_search_exec'
  | 'portfolio_dev'
  | 'finance';

export type CareerServiceType =
  | 'RESUME_WRITING'
  | 'ATS_OPTIMISATION'
  | 'LINKEDIN_MAKEOVER'
  | 'PORTFOLIO_WEBSITE'
  | 'MANAGED_JOB_SEARCH';

export type ServiceOrderStatus =
  | 'NEW'
  | 'PROFILE_PENDING'
  | 'IN_REVIEW'
  | 'DRAFTING'
  | 'CLIENT_REVIEW'
  | 'REVISION'
  | 'FINAL_APPROVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProfileStatus =
  | 'NOT_STARTED'
  | 'RESUME_RECEIVED'
  | 'IN_PROGRESS'
  | 'PARTIALLY_COMPLETED'
  | 'INFORMATION_SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'ADDITIONAL_INFO_REQUESTED'
  | 'READY_FOR_SERVICE'
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REVISION_REQUESTED';

export type ProfileInputMethod = 'RESUME_UPLOAD' | 'MANUAL_ENTRY' | 'BOTH' | 'UNDECIDED';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type DeliverableApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REVISION_REQUESTED';

export type RevisionStatus =
  | 'SUBMITTED'
  | 'ACCEPTED_IN_SCOPE'
  | 'ADDITIONAL_SCOPE_REQUIRED'
  | 'COMPLETED';

export type DocumentCategory =
  | 'EXISTING_RESUME'
  | 'COVER_LETTER'
  | 'JOB_SPEC'
  | 'CERTIFICATE'
  | 'PORTFOLIO_ASSET'
  | 'OTHER';

export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';

// 1. Client & User
export interface CareerUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface CareerClient {
  id: string; // matches uid
  clientCode: string; // CL-XXXX
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  careerStage?: string; // Entry, Mid, Senior, Executive, Transitioning
  targetRole?: string;
  onboardingCompleted: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 2. Comprehensive Career Profile
export interface EmploymentRecord {
  id: string;
  company?: string;
  jobTitle?: string;
  location?: string;
  startDate?: string; // YYYY-MM
  endDate?: string; // YYYY-MM
  isCurrent?: boolean;
  responsibilities?: string;
  keyAchievements?: string;
  technologiesUsed?: string;
}

export interface EducationRecord {
  id: string;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  honours?: string;
}

export interface CertificationRecord {
  id: string;
  title?: string;
  issuingOrganization?: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface SkillItem {
  name: string;
  level?: 'Fundamental' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface SkillsMatrix {
  technical?: SkillItem[];
  functional?: SkillItem[];
  leadership?: SkillItem[];
  toolsAndPlatforms?: SkillItem[];
}

export interface ProjectRecord {
  id: string;
  title?: string;
  description?: string;
  role?: string;
  impactMetrics?: string;
  projectUrl?: string;
}

export interface CareerProfileData {
  clientId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  careerStage?: string;
  targetRoleTitles?: string[];
  targetIndustries?: string[];
  targetGeographies?: string[];
  targetSalaryExpectation?: string;
  preferredWorkType?: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  employmentHistory?: EmploymentRecord[];
  education?: EducationRecord[];
  certifications?: CertificationRecord[];
  skills?: SkillsMatrix;
  projects?: ProjectRecord[];
  additionalInformation?: string;
  personalStatement?: string;
  status: ProfileStatus;
  inputMethod?: ProfileInputMethod;
  resumeDocumentId?: string;
  resumeFileName?: string;
  resumeFileUrl?: string;
  resumeUploadedAt?: string;
  requestedItems?: string[];
  requestedNotes?: string;
  requestedAt?: string;
  adminReviewNotes?: string;
  updatedAt: string;
}

// 3. Service Orders
export interface ServiceOrder {
  id: string;
  orderNumber: string; // ORD-YYYYMM-XXXX
  clientId: string;
  clientName: string;
  clientEmail: string;
  serviceType: CareerServiceType;
  packageTier: 'ESSENTIAL' | 'PROFESSIONAL' | 'EXECUTIVE' | 'CUSTOM';
  status: ServiceOrderStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedRole?: UserRole;
  targetCompletionDate?: string;
  startDate?: string;
  revisionAllowance: number;
  revisionsUsed: number;
  currentStage: string;
  progressPercent: number;
  // Specific requirements captured during order creation
  serviceRequirements: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 4. Tasks & Checklists
export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CareerTask {
  id: string;
  orderId: string;
  orderNumber: string;
  clientId: string;
  title: string;
  description?: string;
  assignedToId?: string;
  assignedToName?: string;
  roleRequired?: UserRole;
  status: TaskStatus;
  priority: TaskPriority;
  checklist: TaskChecklistItem[];
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

// 5. Deliverables & Version Control
export interface CareerDeliverable {
  id: string;
  orderId: string;
  orderNumber: string;
  clientId: string;
  title: string;
  version: string; // e.g. v1.0, v1.1, v2.0
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string; // Secure download or storage link
  isDraft: boolean;
  isFinal: boolean;
  approvalStatus: DeliverableApprovalStatus;
  feedbackNotes?: string;
  uploadedByName: string;
  uploadedByUid: string;
  createdAt: string;
}

// 6. Revision Workflow
export interface RevisionRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  deliverableId: string;
  deliverableVersion: string;
  clientId: string;
  revisionNumber: number;
  feedbackPoints: string[];
  detailedNotes: string;
  status: RevisionStatus;
  adminResolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

// 7. Messages & Communication
export interface CareerMessage {
  id: string;
  orderId?: string;
  clientId: string;
  senderUid: string;
  senderName: string;
  senderRole: 'CLIENT' | 'ADMIN';
  content: string;
  attachmentUrls?: string[];
  isRead: boolean;
  createdAt: string;
}

// 8. Documents & Storage
export interface CareerDocument {
  id: string;
  clientId: string;
  orderId?: string;
  fileName: string;
  category: DocumentCategory;
  fileSize: number;
  mimeType: string;
  downloadUrl: string;
  driveFileId?: string;
  uploadedBy: 'CLIENT' | 'ADMIN';
  createdAt: string;
}

// 9. Finance & Invoicing
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in USD
  total: number;
}

export interface CareerInvoice {
  id: string;
  invoiceNumber: string; // INV-YYYYMM-XXXX
  clientId: string;
  clientName: string;
  clientEmail: string;
  orderId?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  transactionReference?: string;
  notes?: string;
  createdAt: string;
}

// 10. Notifications & Audit Logs
export interface CareerNotification {
  id: string;
  recipientUid: string;
  recipientRole: 'CLIENT' | 'ADMIN';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CareerActivityLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'CLIENT' | 'PROFILE' | 'ORDER' | 'TASK' | 'DELIVERABLE' | 'REVISION' | 'INVOICE';
  entityId: string;
  summary: string;
  timestamp: string;
}

