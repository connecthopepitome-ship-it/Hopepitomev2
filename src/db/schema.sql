-- HOPEPITOME V2 — ENTERPRISE DATABASE SCHEMA
-- Target Engine: Cloudflare D1 (SQLite) / MariaDB / PostgreSQL Compatible
-- Architecture: Multi-division Digital Studio (Nexora & Elevora)

-- 1. ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    reference_code TEXT UNIQUE NOT NULL, -- Format: HP-YYYYMM-XXXX
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_whatsapp TEXT,
    division TEXT NOT NULL CHECK (division IN ('NEXORA', 'ELEVORA', 'BOTH')),
    service_title TEXT NOT NULL,
    requirements TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    desired_timeline TEXT NOT NULL,
    attachment_url TEXT,
    consent_given INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'REVIEWED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'DECLINED', 'ARCHIVED')),
    client_ip_hash TEXT,
    user_agent TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);

-- 2. CLIENT RECORDS
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    client_code TEXT UNIQUE NOT NULL, -- Format: CL-XXXX
    name TEXT NOT NULL,
    primary_email TEXT UNIQUE NOT NULL,
    phone TEXT,
    organization TEXT,
    portal_access_enabled INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'ARCHIVED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(primary_email);

-- 3. PROJECTS & ENGAGEMENTS
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    project_code TEXT UNIQUE NOT NULL, -- Format: PRJ-YYYY-XXXX
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    division TEXT NOT NULL CHECK (division IN ('NEXORA', 'ELEVORA')),
    scope_summary TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'DISCOVERY' CHECK (status IN ('DISCOVERY', 'SPECIFIED', 'ACTIVE_SPRINT', 'IN_REVIEW', 'DELIVERED', 'ARCHIVED')),
    budget_cents INTEGER NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    start_date DATE,
    target_completion_date DATE,
    staging_url TEXT,
    repository_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- 4. PROJECT MILESTONES & SPRINT TELEMETRY
CREATE TABLE IF NOT EXISTS project_milestones (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_code TEXT NOT NULL, -- e.g. M1, M2
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'APPROVED')),
    target_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON project_milestones(project_id);

-- 5. PROJECT FILES & PRIVATE REPOSITORY
CREATE TABLE IF NOT EXISTS project_files (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL DEFAULT 0,
    mime_type TEXT,
    uploader_type TEXT NOT NULL CHECK (uploader_type IN ('CLIENT', 'ADMIN')),
    uploader_id TEXT NOT NULL,
    is_private INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_project_id ON project_files(project_id);

-- 6. CHANGE REQUESTS & REVISION TRACKING
CREATE TABLE IF NOT EXISTS change_requests (
    id TEXT PRIMARY KEY,
    request_code TEXT UNIQUE NOT NULL, -- Format: CR-XXXX
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    impact_assessment TEXT,
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED')),
    submitted_by TEXT NOT NULL,
    reviewed_by TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cr_project_id ON change_requests(project_id);

-- 7. NUMBERED QUOTATIONS
CREATE TABLE IF NOT EXISTS quotations (
    id TEXT PRIMARY KEY,
    quote_number TEXT UNIQUE NOT NULL, -- Format: QT-YYYYMM-XXXX
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    subtotal_cents INTEGER NOT NULL,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    valid_until DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ISSUED', 'ACCEPTED', 'EXPIRED', 'SUPERSEDED')),
    line_items_json TEXT NOT NULL, -- JSON array of items
    terms_and_conditions TEXT,
    issued_at TIMESTAMP,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotations(client_id);

-- 8. NUMBERED INVOICES & PAYMENT RECORDS
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL, -- Format: INV-YYYYMM-XXXX
    client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
    quotation_id TEXT REFERENCES quotations(id) ON DELETE SET NULL,
    subtotal_cents INTEGER NOT NULL,
    tax_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'VOID')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMP,
    line_items_json TEXT NOT NULL, -- JSON array of line items
    payment_method TEXT,
    transaction_reference TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- 9. RBAC & ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('SUPERADMIN', 'LEAD_ARCHITECT', 'PROJECT_MANAGER', 'FINANCE')),
    is_active INTEGER NOT NULL DEFAULT 1,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. AUDIT LOGGING FOR SECURITY & COMPLIANCE
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_type TEXT NOT NULL CHECK (actor_type IN ('ADMIN', 'CLIENT', 'SYSTEM')),
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload_json TEXT,
    ip_address TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
