/**
 * AI JOB MATCH MODULE — TYPE DEFINITIONS
 */

export type JobMatchIntakeStatus =
  | 'Resume received'
  | 'Matching in progress'
  | 'Jobs ready';

export type JobMatchJobType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Internship'
  | 'Remote'
  | 'Hybrid';

export type JobMatchActionType = 'SAVED' | 'APPLIED' | 'NOT_INTERESTED';

export interface IntakeStatusHistoryEntry {
  status: JobMatchIntakeStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface JobMatchIntake {
  id: string;
  intake_reference: string;
  candidate_id: string;
  candidate_code?: string;
  candidate_name: string;
  work_order_id?: string;
  target_role: string;
  preferred_locations: string[];
  experience_years: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  job_type: JobMatchJobType | string;
  key_skills: string[];
  resume_storage_reference: string;
  resume_original_filename: string;
  resume_mime_type: string;
  resume_size: number;
  consent_given: boolean;
  consent_text?: string;
  consent_timestamp: string;
  status: JobMatchIntakeStatus;
  status_history?: IntakeStatusHistoryEntry[];
  staff_notes?: string;
  created_at: string;
  updated_at: string;
  last_updated_at: string;
}

export interface JobMatchRecord {
  id: string;
  candidate_id: string;
  intake_id?: string | null;
  target_role: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience: string;
  salary: string;
  posted_date: string;
  source: string;
  url: string;
  url_hash?: string;
  match_score: number;
  match_band?: 'High' | 'Medium' | 'Low';
  match_reason: string;
  resume_gaps: string;
  recommended_service: string;
  found_on: string;
  first_imported_batch_id?: string;
  created_at: string;
  updated_at: string;
  // Hydrated fields returned by /api/job-match/results
  candidate_action?: JobMatchActionType | null;
  is_new?: boolean;
}

export interface JobMatchCandidateAction {
  id: string;
  candidate_id: string;
  job_match_id: string;
  action: JobMatchActionType;
  created_at: string;
  updated_at: string;
}

export interface JobMatchImportLog {
  id: string;
  import_started_at: string;
  import_completed_at: string;
  total_received: number;
  saved_count: number;
  updated_count: number;
  error_count: number;
  status: 'SUCCESS' | 'PARTIAL_FAILURE' | 'FAILED';
  error_summary: Array<{ index: number; candidateId?: string; message: string }>;
}

export interface JobMatchNotification {
  id: string;
  candidate_id: string;
  batch_key: string;
  title: string;
  message: string;
  new_jobs_count: number;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
}

export interface JobMatchResultsResponse {
  success: boolean;
  candidateId?: string;
  candidateCode?: string;
  jobs: JobMatchRecord[];
  summary: {
    totalJobs: number;
    highChanceCount: number;
    newJobsCount: number;
    resumeGapCount: number;
    showResumeGapBanner: boolean;
  };
  filters: {
    locations: string[];
    jobTypes: string[];
  };
  lastViewedAt: string | null;
}

export interface IncomingGasJobRow {
  candidateId?: string;
  candidateName?: string;
  targetRole?: string;
  title?: string;
  company?: string;
  location?: string;
  jobType?: string;
  experience?: string;
  salary?: string;
  postedDate?: string;
  source?: string;
  url?: string;
  matchScore?: number;
  matchReason?: string;
  resumeGaps?: string;
  recommendedService?: string;
  foundOn?: string;
}

export interface JobMatchControlSettings {
  enabled: boolean;
  intakeOpen: boolean;
  emailNotificationsEnabled: boolean;
  statusBanner: string;
  updatedAt?: string;
  updatedBy?: string;
}

