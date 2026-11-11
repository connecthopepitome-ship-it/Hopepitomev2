-- HOPEPITOME CAREER SERVICES — AI JOB MATCH ADDITIVE MIGRATION
-- Safe additive schema only. Never ALTER, DROP, or replace existing tables.
-- Target Engine: Cloudflare D1 (SQLite) / PostgreSQL Compatible

CREATE TABLE IF NOT EXISTS job_match_intakes (
    id TEXT PRIMARY KEY,
    intake_reference TEXT UNIQUE NOT NULL,
    candidate_id TEXT NOT NULL,
    target_role TEXT NOT NULL,
    preferred_locations TEXT NOT NULL, -- JSON array
    experience_years TEXT NOT NULL,
    current_salary TEXT,
    expected_salary TEXT,
    notice_period TEXT,
    job_type TEXT,
    key_skills TEXT, -- JSON array
    resume_storage_reference TEXT NOT NULL,
    resume_original_filename TEXT NOT NULL,
    resume_mime_type TEXT NOT NULL,
    resume_size INTEGER NOT NULL,
    consent_given INTEGER NOT NULL DEFAULT 1,
    consent_timestamp TIMESTAMP NOT NULL,
    status TEXT NOT NULL DEFAULT 'Resume received' CHECK (status IN ('Resume received', 'Matching in progress', 'Jobs ready')),
    staff_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jmi_candidate_id ON job_match_intakes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_jmi_status ON job_match_intakes(status);

CREATE TABLE IF NOT EXISTS job_matches (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,
    intake_id TEXT REFERENCES job_match_intakes(id) ON DELETE SET NULL,
    target_role TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL,
    experience TEXT,
    salary TEXT,
    posted_date TEXT,
    source TEXT NOT NULL,
    url TEXT NOT NULL,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    match_reason TEXT,
    resume_gaps TEXT,
    recommended_service TEXT,
    found_on TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, url)
);

CREATE INDEX IF NOT EXISTS idx_jm_candidate_score ON job_matches(candidate_id, match_score DESC);

CREATE TABLE IF NOT EXISTS job_match_candidate_actions (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,
    job_match_id TEXT NOT NULL REFERENCES job_matches(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('SAVED', 'APPLIED', 'NOT_INTERESTED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, job_match_id)
);

CREATE INDEX IF NOT EXISTS idx_jmca_candidate_id ON job_match_candidate_actions(candidate_id);

CREATE TABLE IF NOT EXISTS job_match_import_logs (
    id TEXT PRIMARY KEY,
    import_started_at TIMESTAMP NOT NULL,
    import_completed_at TIMESTAMP NOT NULL,
    total_received INTEGER NOT NULL DEFAULT 0,
    saved_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'PARTIAL_FAILURE', 'FAILED')),
    error_summary TEXT
);

