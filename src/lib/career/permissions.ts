/**
 * HOPEPITOME CAREER SERVICES — ROLE & PERMISSION MATRIX DEFINITIONS
 * Authoritative default roles, module permission mappings, and permission verification engine.
 */

import {
  StaffPermissionModule,
  StaffPermissionAction,
  StaffRole,
  StaffDepartment,
  StaffRolePermissions,
} from './types';

export const PERMISSION_MODULES: { id: StaffPermissionModule; label: string; description: string }[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Access overview dashboard metrics & activity' },
  { id: 'crm', label: 'CRM Overview', description: 'General sales pipeline and CRM views' },
  { id: 'leads', label: 'Leads Inbox', description: 'Manage incoming client leads and inquiries' },
  { id: 'pipeline', label: 'Sales Pipeline', description: 'Visual Kanban pipeline and stage changes' },
  { id: 'followups', label: 'Follow-ups & Calls', description: 'Schedule calls, log outcomes, SLA alerts' },
  { id: 'consultations', label: 'Consultations', description: '1-on-1 strategy sessions and meeting links' },
  { id: 'quotations', label: 'Quotations', description: 'Prepare, dispatch, and review proposals' },
  { id: 'clients', label: 'Clients Directory', description: '360° client records and profiles' },
  { id: 'profiles', label: 'Career Profiles', description: 'Career intakes, employment history, skills' },
  { id: 'documents', label: 'Documents & Vault', description: 'Manage client resumes and deliverables' },
  { id: 'work_orders', label: 'Work Orders', description: 'Official HP-YYYY-XXXXX order lifecycles' },
  { id: 'service_orders', label: 'Service Orders', description: 'Individual service item requests' },
  { id: 'messages', label: 'Internal Messages', description: 'Client communication and staff notes' },
  { id: 'reports', label: 'Reports & Analytics', description: 'Business intelligence and performance stats' },
  { id: 'finance', label: 'Finance & Invoices', description: 'Invoices, payments, and billing records' },
  { id: 'employees', label: 'Employee Management', description: 'Staff directory, accounts, roles, access' },
  { id: 'settings', label: 'System Settings', description: 'Global company and portal configurations' },
];

export const PERMISSION_ACTIONS: { id: StaffPermissionAction; label: string }[] = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'assign', label: 'Assign' },
  { id: 'approve', label: 'Approve' },
  { id: 'export', label: 'Export' },
  { id: 'manage', label: 'Manage' },
];

const ALL_ACTIONS: StaffPermissionAction[] = [
  'view',
  'create',
  'edit',
  'delete',
  'assign',
  'approve',
  'export',
  'manage',
];

export const DEFAULT_DEPARTMENTS: Omit<StaffDepartment, 'createdAt'>[] = [
  {
    departmentId: 'dept_admin',
    departmentName: 'Administration',
    description: 'Executive management, HR, security, and global operations.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_sales',
    departmentName: 'Sales & CRM',
    description: 'Client acquisition, inbound lead qualification, and consultative selling.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_consulting',
    departmentName: 'Career Consulting',
    description: 'Executive strategy sessions, career discovery, and client advising.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_writing',
    departmentName: 'Resume Writing',
    description: 'ATS resume crafting, executive bios, and cover letter development.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_job_search',
    departmentName: 'Job Search Operations',
    description: 'Managed job hunting, application dispatch, and interview coordination.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_portfolio',
    departmentName: 'Portfolio Development',
    description: 'Executive portfolio website engineering and personal branding assets.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_finance',
    departmentName: 'Finance & Billing',
    description: 'Invoicing, payment reconciliation, and accounting.',
    status: 'ACTIVE',
  },
  {
    departmentId: 'dept_management',
    departmentName: 'Management & Operations',
    description: 'Supervisory oversight, performance analytics, and QA governance.',
    status: 'ACTIVE',
  },
];

export const DEFAULT_STAFF_ROLES: Omit<StaffRole, 'createdAt' | 'updatedAt'>[] = [
  {
    roleId: 'super_admin',
    roleName: 'Super Admin',
    description: 'Full unconstrained system access, employee administration, and system controls.',
    isSystemRole: true,
    permissions: {
      dashboard: ALL_ACTIONS,
      crm: ALL_ACTIONS,
      leads: ALL_ACTIONS,
      pipeline: ALL_ACTIONS,
      followups: ALL_ACTIONS,
      consultations: ALL_ACTIONS,
      quotations: ALL_ACTIONS,
      clients: ALL_ACTIONS,
      profiles: ALL_ACTIONS,
      documents: ALL_ACTIONS,
      work_orders: ALL_ACTIONS,
      service_orders: ALL_ACTIONS,
      messages: ALL_ACTIONS,
      reports: ALL_ACTIONS,
      finance: ALL_ACTIONS,
      employees: ALL_ACTIONS,
      settings: ALL_ACTIONS,
    },
  },
  {
    roleId: 'hr_admin',
    roleName: 'HR / Administrator',
    description: 'Manage employee accounts, credentials, departments, and monitor activity logs.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      employees: ['view', 'create', 'edit', 'assign', 'manage', 'export'],
      clients: ['view'],
      reports: ['view'],
      settings: ['view'],
    },
  },
  {
    roleId: 'crm_manager',
    roleName: 'CRM Manager',
    description: 'Oversee all sales leads, assign team ownership, and manage the sales pipeline.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      crm: ALL_ACTIONS,
      leads: ALL_ACTIONS,
      pipeline: ALL_ACTIONS,
      followups: ALL_ACTIONS,
      consultations: ALL_ACTIONS,
      quotations: ['view', 'create', 'edit', 'approve', 'export'],
      clients: ['view', 'create'],
      reports: ['view', 'export'],
    },
  },
  {
    roleId: 'sales_executive',
    roleName: 'Sales Executive',
    description: 'Handle assigned leads, conduct outreach calls, and prepare initial proposals.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      crm: ['view'],
      leads: ['view', 'create', 'edit'],
      pipeline: ['view', 'edit'],
      followups: ['view', 'create', 'edit'],
      consultations: ['view', 'create'],
      quotations: ['view', 'create'],
      clients: ['view'],
    },
  },
  {
    roleId: 'career_consultant',
    roleName: 'Career Consultant',
    description: 'Conduct strategy calls, review career dossiers, and provide professional guidance.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      clients: ['view', 'edit'],
      profiles: ['view', 'edit'],
      consultations: ['view', 'edit'],
      documents: ['view', 'create'],
      work_orders: ['view', 'edit'],
      messages: ['view', 'create'],
    },
  },
  {
    roleId: 'resume_writer',
    roleName: 'Resume Writer',
    description: 'Craft high-impact ATS resumes, upload drafts, and deliver final resume assets.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      clients: ['view'],
      profiles: ['view'],
      documents: ['view', 'create', 'edit'],
      work_orders: ['view', 'edit'],
      messages: ['view', 'create'],
    },
  },
  {
    roleId: 'job_search_executive',
    roleName: 'Job Search Executive',
    description: 'Manage corporate job applications, tracking boards, and interview schedules.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      clients: ['view'],
      profiles: ['view'],
      work_orders: ['view', 'edit'],
      documents: ['view', 'create'],
      messages: ['view', 'create'],
      reports: ['view'],
    },
  },
  {
    roleId: 'portfolio_developer',
    roleName: 'Portfolio Developer',
    description: 'Design and deploy executive portfolio websites and digital presence assets.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      clients: ['view'],
      profiles: ['view'],
      work_orders: ['view', 'edit'],
      documents: ['view', 'create'],
      messages: ['view', 'create'],
    },
  },
  {
    roleId: 'finance',
    roleName: 'Finance',
    description: 'Manage client billing, view signed quotations, issue invoices, and verify payments.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      quotations: ['view', 'approve', 'export'],
      finance: ALL_ACTIONS,
      work_orders: ['view'],
      reports: ['view', 'export'],
    },
  },
  {
    roleId: 'readonly_manager',
    roleName: 'Read-only Manager',
    description: 'Executive view-only oversight across CRM, order progress, and business reports.',
    isSystemRole: true,
    permissions: {
      dashboard: ['view'],
      crm: ['view'],
      leads: ['view'],
      pipeline: ['view'],
      clients: ['view'],
      work_orders: ['view'],
      reports: ['view'],
      finance: ['view'],
    },
  },
];

/**
 * Check if a role or permission set has access to a specific action on a module
 */
export function checkPermission(
  rolePermissions: StaffRolePermissions | undefined,
  module: StaffPermissionModule,
  action: StaffPermissionAction
): boolean {
  if (!rolePermissions) return false;
  const actions = rolePermissions[module];
  if (!actions || !Array.isArray(actions)) return false;
  return actions.includes(action) || actions.includes('manage');
}

