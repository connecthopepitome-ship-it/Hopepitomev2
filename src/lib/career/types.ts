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
  | 'finance'
  | 'Super Admin'
  | 'Admin'
  | 'Career Consultant'
  | 'Resume Writer'
  | 'Job Search Executive'
  | 'Portfolio Developer'
  | 'Finance'
  | 'Read-only Manager';

export type AdminRole =
  | 'Super Admin'
  | 'Admin'
  | 'Career Consultant'
  | 'Resume Writer'
  | 'Job Search Executive'
  | 'Portfolio Developer'
  | 'Finance'
  | 'Read-only Manager';

export type WorkOrderStatus =
  | 'Registered'
  | 'Information Pending'
  | 'Documents Received'
  | 'Requirements Review'
  | 'Quotation Sent'
  | 'Awaiting Payment'
  | 'Confirmed'
  | 'In Progress'
  | 'Internal Review'
  | 'Client Review'
  | 'Revision Requested'
  | 'Final Delivery'
  | 'Completed'
  | 'Cancelled';

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
  currentWorkOrderId?: string;
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
  currentWorkOrderId?: string;
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
  unitPrice: number; // in INR
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
  currentWorkOrderId?: string;
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

// Phase 5 Exact Collection Models
export interface ClientRecord {
  clientId: string;
  name: string;
  mobile: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  currentWorkOrderId?: string;
  fullName?: string;
  clientCode?: string;
  careerProfile?: {
    currentDesignation?: string;
    totalExperience?: string;
    targetRole?: string;
    targetCountry?: string;
    industry?: string;
    linkedinUrl?: string;
    requirements?: string;
  };
  linkedEnquiries?: string[];
  linkedProjects?: string[];
  uploadedDocuments?: string[];
}

export interface WorkOrderRecord {
  workOrderId: string; // e.g. HP-2026-00001
  clientId: string;
  serviceType: CareerServiceType | string;
  status: WorkOrderStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  driveFolderId?: string;
  driveFolderPath?: string;
  notes?: string;
}

export interface DocumentRecord {
  documentId: string;
  clientId: string;
  workOrderId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  category: 'Original Resume' | 'Client Documents' | 'Certificates' | 'Photos' | 'Working Files' | 'Final Deliverables' | DocumentCategory;
  driveFileId?: string;
  driveFolderId?: string;
  downloadUrl?: string;
  viewUrl?: string;
  uploadedAt: string;
  uploadedBy: 'CLIENT' | 'STAFF';
  status: 'ACTIVE' | 'ARCHIVED' | 'TRASHED';
}

export interface ServiceOrderRecord {
  serviceOrderId: string;
  clientId: string;
  workOrderId: string;
  serviceName: string;
  requirements?: string;
  status: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRecord {
  messageId: string;
  clientId: string;
  workOrderId: string;
  senderId: string;
  senderRole: string;
  message: string;
  createdAt: string;
  readAt?: string;
}

export interface ActivityLogRecord {
  activityId: string;
  clientId?: string;
  workOrderId?: string;
  activityType: string;
  description: string;
  performedBy: string;
  timestamp: string;
}

export interface AdminRecord {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

// =============================================================================
// CRM (CUSTOMER RELATIONSHIP MANAGEMENT) DATA MODELS
// =============================================================================

export type CrmPipelineStage =
  | 'New Lead'
  | 'New'
  | 'Discovery / Needs Assessment'
  | 'Contact Attempted'
  | 'Contacted'
  | 'Qualified'
  | 'Consultation Scheduled'
  | 'Consultation Completed'
  | 'Quotation Preparation'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Won / Ready to Convert'
  | 'Lost'
  | 'Nurture / Follow-up Later';

export type CrmLeadSource =
  | 'WEBSITE'
  | 'WHATSAPP'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'LINKEDIN'
  | 'GOOGLE_SEARCH'
  | 'GOOGLE_ADS'
  | 'REFERRAL'
  | 'EXISTING_CLIENT'
  | 'DIRECT'
  | 'CAMPAIGN'
  | 'OTHER';

export type CrmFollowUpType =
  | 'INITIAL_CONTACT'
  | 'PHONE_CALL'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'CONSULTATION'
  | 'QUOTATION_FOLLOWUP'
  | 'PAYMENT_FOLLOWUP'
  | 'DOCUMENT_FOLLOWUP'
  | 'GENERAL';

export type CrmFollowUpStatus =
  | 'PENDING'
  | 'DUE_TODAY'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'RESCHEDULED'
  | 'CANCELLED';

export type CrmFollowUpOutcome =
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'MORE_INFO'
  | 'CONSULTATION_BOOKED'
  | 'QUOTATION_REQUESTED'
  | 'PRICE_CONCERN'
  | 'NO_RESPONSE'
  | 'CALL_BACK_LATER'
  | 'CONVERTED'
  | 'OTHER';

export interface CrmLead {
  id: string; // Format: LEAD-YYYYMM-XXXX
  fullName: string;
  mobile: string;
  email?: string;
  preferredContactMethod?: 'WHATSAPP' | 'PHONE' | 'EMAIL';
  city?: string;
  country?: string;
  serviceInterestedIn: string;
  enquiryDescription?: string;
  targetRole?: string;
  currentExperienceLevel?: 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE' | 'TRANSITION';
  preferredBudget?: string;
  expectedStartDate?: string;
  additionalRequirements?: string;
  leadSource: CrmLeadSource | string;
  campaignName?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referralName?: string;
  leadOwner: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  stage: CrmPipelineStage;
  estimatedValue?: number; // In INR
  lostReason?: string;
  convertedClientId?: string;
  convertedWorkOrderId?: string;
  convertedProjectId?: string;
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmFollowUp {
  id: string;
  leadId?: string;
  leadName?: string;
  leadPhone?: string;
  clientId?: string;
  title: string;
  description?: string;
  followUpType: CrmFollowUpType;
  assignedStaff: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: CrmFollowUpStatus;
  outcome?: CrmFollowUpOutcome;
  outcomeNotes?: string;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}

export interface CrmActivity {
  id: string;
  leadId?: string;
  clientId?: string;
  activityType:
    | 'LEAD_CREATED'
    | 'STAGE_CHANGED'
    | 'CALL_LOGGED'
    | 'WHATSAPP_LOGGED'
    | 'EMAIL_LOGGED'
    | 'NOTE_ADDED'
    | 'FOLLOWUP_SCHEDULED'
    | 'FOLLOWUP_COMPLETED'
    | 'CONSULTATION_SCHEDULED'
    | 'CONSULTATION_COMPLETED'
    | 'QUOTATION_SENT'
    | 'LEAD_CONVERTED'
    | 'LEAD_LOST';
  title: string;
  description?: string;
  performedBy: string;
  timestamp: string;
}

export interface CrmConsultation {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone?: string;
  scheduledDate: string;
  scheduledTime: string;
  consultantName: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'RESCHEDULED' | 'NO_SHOW' | 'CANCELLED';
  meetingLink?: string;
  discussionNotes?: string;
  recommendedService?: string;
  quotedPrice?: number;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// EMPLOYEE MANAGEMENT & ACCESS CONTROL TYPES
// =============================================================================

export type StaffEmploymentType =
  | 'Full Time'
  | 'Part Time'
  | 'Contract'
  | 'Freelancer'
  | 'Intern';

export type StaffEmploymentStatus =
  | 'Active'
  | 'Pending Activation'
  | 'On Leave'
  | 'Suspended'
  | 'Resigned'
  | 'Terminated';

export type StaffAccountStatus =
  | 'ACTIVE'
  | 'PENDING_ACTIVATION'
  | 'SUSPENDED'
  | 'INACTIVE'
  | 'DEACTIVATED';

export type StaffPermissionModule =
  | 'dashboard'
  | 'crm'
  | 'leads'
  | 'pipeline'
  | 'followups'
  | 'consultations'
  | 'quotations'
  | 'clients'
  | 'profiles'
  | 'documents'
  | 'work_orders'
  | 'service_orders'
  | 'messages'
  | 'reports'
  | 'finance'
  | 'employees'
  | 'settings';

export type StaffPermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'assign'
  | 'approve'
  | 'export'
  | 'manage';

export type StaffRolePermissions = Partial<Record<StaffPermissionModule, StaffPermissionAction[]>>;

export interface StaffUser {
  uid: string;
  employeeId: string; // e.g. HP-EMP-00001
  fullName: string;
  email: string;
  mobile?: string;
  departmentId: string;
  departmentName?: string;
  designation: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  roleId: string; // e.g. super_admin, hr_admin, etc.
  roleName?: string;
  employmentType: StaffEmploymentType;
  joiningDate: string;
  employmentStatus: StaffEmploymentStatus;
  accountStatus: StaffAccountStatus;
  mustChangePassword: boolean;
  emailVerificationStatus?: boolean;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  createdBy?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
}

export interface StaffRole {
  roleId: string;
  roleName: string;
  description: string;
  permissions: StaffRolePermissions;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface StaffDepartment {
  departmentId: string;
  departmentName: string;
  description: string;
  managerId?: string;
  managerName?: string;
  status: 'ACTIVE' | 'INACTIVE';
  employeeCount?: number;
  createdAt: string;
}

export interface StaffPermissionOverride {
  uid: string;
  allowedPermissions: string[]; // e.g. "leads:export", "finance:view"
  restrictedPermissions: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface StaffActivityLog {
  id: string;
  uid: string;
  employeeId: string;
  employeeName?: string;
  activityType: string;
  description: string;
  relatedRecordId?: string;
  timestamp: string;
  ipMetadataWhenAvailable?: string;
}

export interface StaffLoginLog {
  id: string;
  uid: string;
  employeeId?: string;
  email: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'PASSWORD_CHANGED' | 'PASSWORD_RESET_REQUESTED' | 'LOGOUT';
  timestamp: string;
  result: 'SUCCESS' | 'FAILED';
  failureReason?: string;
  safeMetadata?: string;
}

// =============================================================================
// MULTI-SERVICE BUSINESS PLATFORM TYPES (IT SERVICES & CAREER SERVICES)
// =============================================================================

export type BusinessDivision = 'IT_SERVICES' | 'CAREER_SERVICES';

export type ServiceCategoryCode =
  | 'WEBSITE_DEV'
  | 'ECOMMERCE_DEV'
  | 'CUSTOM_APP_DEV'
  | 'ERP_CONSULTING'
  | 'CRM_SOLUTIONS'
  | 'WORKFLOW_AUTOMATION'
  | 'API_INTEGRATIONS'
  | 'BUSINESS_ANALYTICS'
  | 'CLOUD_SUPPORT'
  | 'RESUME_WRITING'
  | 'ATS_OPTIMISATION'
  | 'LINKEDIN_MAKEOVER'
  | 'PORTFOLIO_WEBSITE'
  | 'MANAGED_JOB_SEARCH';

export type PricingModel =
  | 'FIXED_PRICE'
  | 'HOURLY'
  | 'DAILY'
  | 'MILESTONE_BASED'
  | 'MONTHLY_RETAINER'
  | 'ANNUAL_MAINTENANCE'
  | 'SUBSCRIPTION'
  | 'CUSTOM_QUOTATION';

export interface ServicePackage {
  id: string;
  serviceId: string;
  name: string;
  tier: 'STARTER' | 'BUSINESS' | 'ENTERPRISE' | 'CUSTOM';
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
  deliverables: string[];
}

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  division: BusinessDivision;
  categoryCode: ServiceCategoryCode;
  categoryName: string;
  description: string;
  scopeOfWork: string[];
  deliverables: string[];
  defaultDurationDays: number;
  pricingModel: PricingModel;
  defaultPackages: ServicePackage[];
  requiredRequirements?: string[];
  optionalRequirements?: string[];
  defaultMilestones?: string[];
  applicableRoles?: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface Customer360Record {
  id: string; // matches uid or clientId
  clientCode: string; // CL-XXXX or CUST-XXXX
  customerType: 'BUSINESS' | 'INDIVIDUAL';
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  companySize?: string;
  taxId?: string;
  billingAddress?: string;
  city?: string;
  country?: string;
  contactPersonName?: string;
  contactPersonDesignation?: string;
  activeDivisions: BusinessDivision[];
  totalOpportunities?: number;
  totalProjects?: number;
  totalInvoiced?: number;
  totalPaid?: number;
  outstandingBalance?: number;
  activeContracts?: number;
  accountManagerName?: string;
  notes?: string;
  currentWorkOrderId?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryRecord {
  discoveryId: string;
  leadId: string;
  customerId?: string;
  customerName: string;
  customerCompany?: string;
  division: BusinessDivision;
  serviceId: string;
  serviceName: string;
  businessProblem: string;
  currentProcess: string;
  proposedSolution: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  userRoles: string[];
  integrations: string[];
  dataMigrationDetails?: string;
  reportingRequirements?: string[];
  hostingPreference?: string;
  estimatedTimelineWeeks?: number;
  budgetRange?: string;
  risks: string[];
  assumptions: string[];
  outOfScope: string[];
  attachments?: string[];
  completenessScore: number;
  preparedBy: string;
  approvedBy?: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED';
  createdAt: string;
  updatedAt: string;
}

export interface QuotationLineItem {
  id: string;
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
  isRecurring?: boolean;
  recurringFrequency?: 'MONTHLY' | 'ANNUAL';
}

export interface PaymentMilestone {
  id: string;
  title: string;
  percentage: number;
  amount: number;
  dueDate?: string;
  condition: string;
  status: 'PENDING' | 'INVOICED' | 'PAID';
}

export interface QuotationRecord {
  id: string;
  quotationNumber: string; // QT-YYYYMM-XXXX
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  opportunityId?: string;
  leadId?: string;
  division: BusinessDivision;
  lineItems: QuotationLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentMilestones: PaymentMilestone[];
  termsAndConditions: string[];
  validityDays: number;
  validUntil: string;
  status: 'DRAFT' | 'INTERNAL_REVIEW' | 'APPROVED' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  approvedBy?: string;
  clientAcceptedAt?: string;
  clientAcceptanceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | 'DRAFT'
  | 'NEW_INTAKE'
  | 'AWAITING_REVIEW'
  | 'AWAITING_PAYMENT'
  | 'READY_TO_START'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'INTERNAL_REVIEW'
  | 'CLIENT_UAT'
  | 'REVISION'
  | 'COMPLETED'
  | 'CANCELLED'
  | string;

export type CareerEnquiryStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'AWAITING_CUSTOMER'
  | 'APPROVED'
  | 'CONVERTED'
  | 'REJECTED';

export interface CareerEnquiryRecord {
  id: string; // e.g. HP-CAR-202611-4RK6
  referenceCode: string;
  customerId?: string;
  customerName: string;
  email: string;
  phoneWhatsapp?: string;
  preferredContactMethod?: 'Email' | 'WhatsApp' | 'Phone Call';
  selectedServices: string[];
  serviceRequired: string;
  status: CareerEnquiryStatus;
  
  // Career profile submitted
  careerStage?: string;
  currentDesignation?: string;
  totalExperience?: string;
  targetRole?: string;
  targetCountry?: string;
  industry?: string;
  linkedinUrl?: string;
  education?: string;
  skills?: string;
  certifications?: string;
  requirements?: string;
  
  // Uploaded document metadata
  resumeFileName?: string;
  resumeFileSize?: number;
  resumeMimeType?: string;
  resumeDocumentId?: string;
  resumeDriveFileId?: string;
  resumeDownloadUrl?: string;
  resumeViewUrl?: string;
  hasResume: boolean;

  // Linked Project / Work Order / Lead
  projectId?: string;
  workOrderId?: string;
  leadId?: string;
  
  // Audit & timestamps
  submittedAt: string;
  updatedAt: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface ProjectMilestoneRecord {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  orderIndex: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'READY_FOR_UAT' | 'CLIENT_APPROVED' | 'COMPLETED';
  dueDate?: string;
  completedAt?: string;
  paymentMilestoneId?: string;
  deliverablesSummary?: string;
}

export interface EnterpriseProjectRecord {
  id: string; // PRJ-YYYY-XXXXX
  name: string;
  customerId: string;
  customerName: string;
  customerCompany?: string;
  customerEmail?: string;
  customerMobile?: string;
  enquiryId?: string;
  leadId?: string;
  workOrderId?: string;
  division: BusinessDivision;
  serviceId: string;
  serviceName: string;
  services?: string[];
  projectManagerId: string;
  projectManagerName: string;
  teamMembers: { uid: string; name: string; role: string }[];
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: ProjectStatus;
  budget: number;
  contractValue: number;
  progressPercent: number;
  currency: string;
  billingMethod: PricingModel;
  milestones: ProjectMilestoneRecord[];
  careerProfile?: Record<string, any>;
  documents?: any[];
  driveFolderId?: string;
  driveFolderPath?: string;
  createdAt: string;
  updatedAt: string;
}

export type BusinessProjectRecord = EnterpriseProjectRecord;

export interface UniversalTaskRecord {
  taskId: string;
  entityType: 'PROJECT' | 'LEAD' | 'OPPORTUNITY' | 'CUSTOMER' | 'SUPPORT_TICKET' | 'CAREER_ORDER';
  entityId: string;
  entityTitle: string;
  title: string;
  description?: string;
  assignedToId: string;
  assignedToName: string;
  createdBy: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'BLOCKED' | 'INTERNAL_REVIEW' | 'COMPLETED' | 'CANCELLED';
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  checklist: { id: string; text: string; completed: boolean }[];
  createdAt: string;
  completedAt?: string;
}

export type SupportTicketCategory =
  | 'BUG_FIX'
  | 'CHANGE_REQUEST'
  | 'SERVICE_REQUEST'
  | 'INCIDENT'
  | 'MAINTENANCE';

export type SupportTicketStatus =
  | 'OPEN'
  | 'ACKNOWLEDGED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED';

export interface SupportTicketRecord {
  ticketId: string; // TCK-YYYYMM-XXXX
  customerId: string;
  customerName: string;
  customerEmail?: string;
  division?: BusinessDivision;
  customerCompany?: string;
  projectId?: string;
  projectName?: string;
  serviceId?: string;
  serviceName?: string;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
  assignedStaffId?: string;
  assignedStaffName?: string;
  status: SupportTicketStatus;
  responseDeadline?: string;
  resolutionDeadline?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface MaintenanceContractRecord {
  contractId: string; // MNT-YYYY-XXXX
  customerId: string;
  customerName: string;
  customerCompany?: string;
  projectId?: string;
  projectName?: string;
  coveredServices: string[];
  startDate: string;
  endDate: string;
  renewalDate: string;
  fee: number;
  currency: string;
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  supportHoursIncluded: number;
  supportHoursUsed: number;
  slaHours: number;
  status: 'ACTIVE' | 'PENDING_RENEWAL' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CommercialInvoiceRecord {
  invoiceId: string; // INV-YYYYMM-XXXX
  customerId: string;
  customerName: string;
  customerCompany?: string;
  quotationId?: string;
  projectId?: string;
  division: BusinessDivision;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  paidAmount: number;
  outstandingBalance: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentMilestoneId?: string;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommercialPaymentRecord {
  paymentId: string; // PAY-YYYYMM-XXXX
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'UPI' | 'CASH' | 'CHEQUE' | 'OTHER';
  transactionReference?: string;
  recordedByName: string;
  recordedByUid: string;
  notes?: string;
  status: 'CONFIRMED' | 'PENDING_RECONCILIATION' | 'FAILED';
  createdAt: string;
}

// =========================================================================
// SCANNING LEADS MODULE (INDEPENDENT CRM CATEGORY)
// =========================================================================

export type ScanningLeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'FOLLOW_UP_REQUIRED'
  | 'CONVERTED'
  | 'NOT_INTERESTED'
  | 'CLOSED';

export type ScanProcessStatus =
  | 'INITIATED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export type StorageStatus =
  | 'PENDING'
  | 'STORED'
  | 'FAILED'
  | 'RETRY_REQUIRED';

export interface ScanningLeadRecord {
  // Lead Information
  scanning_lead_id: string; // Format: SL-YYYYMMDD-XXXXX
  scan_reference: string; // Stable reference: SCAN-YYYYMMDD-XXXX
  lead_type: 'SCANNING_LEAD';
  source: 'CAREER_STUDIO_ATS_SCANNER';
  created_at: string;
  last_updated_at: string;
  scan_status: ScanProcessStatus;
  scan_error?: string;
  candidate_name?: string;
  email?: string;
  mobile_number?: string;
  location?: string;

  // Resume Information
  original_file_name: string;
  file_extension: string;
  file_size: number;
  mime_type: string;
  google_drive_file_id?: string;
  google_drive_file_url?: string; // Private / Internal reference only
  google_drive_folder_id?: string;
  upload_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  storage_status: StorageStatus;
  storage_error?: string;

  // Assessment Information
  assessment_id?: string;
  overall_score?: number | null;
  assessment_status: 'PENDING' | 'COMPLETED' | 'FAILED';
  scan_completed_at?: string | null;

  // Lead Management
  lead_status: ScanningLeadStatus;
  assigned_to?: string;
  assigned_staff_name?: string;
  admin_notes?: string;
  converted_lead_id?: string;
  converted_client_id?: string;
}





