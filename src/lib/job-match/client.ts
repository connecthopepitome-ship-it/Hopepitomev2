/**
 * AI JOB MATCH MODULE — FRONTEND API & FEATURE FLAG CLIENT
 * Always obtains live Firebase Auth ID tokens rather than trusting client-stored IDs.
 */

'use client';

import { auth } from '../firebase/config';
import type {
  JobMatchActionType,
  JobMatchControlSettings,
  JobMatchImportLog,
  JobMatchIntake,
  JobMatchIntakeStatus,
  JobMatchRecord,
  JobMatchResultsResponse,
} from './types';

let cachedRuntimeFlag: boolean | null = null;

export function isJobMatchBuildEnabled(): boolean {
  return String(process.env.NEXT_PUBLIC_FEATURE_JOB_MATCH || '').trim().toLowerCase() === 'true';
}

export async function fetchJobMatchFeatureEnabled(): Promise<boolean> {
  if (!isJobMatchBuildEnabled()) return false;
  if (cachedRuntimeFlag !== null) return cachedRuntimeFlag;
  try {
    const res = await fetch('/api/job-match/config', { cache: 'no-store' });
    if (!res.ok) {
      cachedRuntimeFlag = false;
      return false;
    }
    const data = (await res.json()) as { enabled?: boolean };
    cachedRuntimeFlag = Boolean(data?.enabled);
    return cachedRuntimeFlag;
  } catch {
    return false;
  }
}

async function getBearerIdToken(userOverride?: { getIdToken?: () => Promise<string> } | null): Promise<string> {
  if (userOverride && typeof userOverride.getIdToken === 'function') {
    const t = await userOverride.getIdToken();
    if (t) return t;
  }
  if (auth?.currentUser) {
    const t = await auth.currentUser.getIdToken();
    if (t) return t;
  }
  throw new Error('Your authenticated session has expired. Please sign in again.');
}

export async function verifyCandidateJobMatchSession(userOverride?: any): Promise<{
  candidateId: string;
  candidateCode: string;
  candidateName: string;
  workOrderId: string;
}> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/session', {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    const err = new Error(data?.error || 'Authentication required. Please sign in to continue.');
    (err as any).status = res.status;
    throw err;
  }
  return data;
}

export async function fetchCandidateIntakes(userOverride?: any): Promise<{
  candidateId: string;
  candidateCode: string;
  intakes: JobMatchIntake[];
  unreadNotifications: number;
}> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/intakes', {
    method: 'GET',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    const err = new Error(data?.error || 'Failed to load job match intakes.');
    (err as any).status = res.status;
    throw err;
  }
  return data;
}

export async function submitCandidateIntake(
  payload: {
    targetRole: string;
    preferredLocations: string[];
    experienceYears: string;
    currentSalary?: string;
    expectedSalary?: string;
    noticePeriod?: string;
    jobType: string;
    keySkills: string[];
    consentGiven: boolean;
    file: File;
  },
  userOverride?: any
): Promise<{ intake: JobMatchIntake; message: string }> {
  const token = await getBearerIdToken(userOverride);
  const formData = new FormData();
  formData.append('targetRole', payload.targetRole);
  formData.append('preferredLocations', JSON.stringify(payload.preferredLocations));
  formData.append('experienceYears', payload.experienceYears);
  if (payload.currentSalary) formData.append('currentSalary', payload.currentSalary);
  if (payload.expectedSalary) formData.append('expectedSalary', payload.expectedSalary);
  if (payload.noticePeriod) formData.append('noticePeriod', payload.noticePeriod);
  formData.append('jobType', payload.jobType);
  formData.append('keySkills', JSON.stringify(payload.keySkills));
  formData.append('consentGiven', String(payload.consentGiven));
  formData.append('resume', payload.file);

  const res = await fetch('/api/job-match/intakes', {
    method: 'POST',
    credentials: 'include',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    const err = new Error(data?.error || 'Upload failed, please try again.');
    (err as any).status = res.status;
    throw err;
  }
  return data;
}

export async function fetchCandidateJobMatches(userOverride?: any): Promise<JobMatchResultsResponse> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/results', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to load job matches.');
  }
  return data;
}

export async function saveCandidateJobAction(
  jobMatchId: string,
  action: JobMatchActionType | 'CLEAR',
  userOverride?: any
): Promise<void> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/actions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jobMatchId, action }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update job status.');
  }
}

export async function deleteAllCandidateJobMatchData(userOverride?: any): Promise<{
  message: string;
}> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/data', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ confirmDelete: true }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete AI Job Match data.');
  }
  return data;
}

export async function fetchAdminJobMatchQueue(userOverride?: any): Promise<{
  intakes: JobMatchIntake[];
  matchesByCandidate: Record<string, JobMatchRecord[]>;
  importLogs: JobMatchImportLog[];
}> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/admin/intakes', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to load admin intake queue.');
  }
  return data;
}

export async function updateAdminIntakeStatus(
  params: {
    intakeId: string;
    status?: JobMatchIntakeStatus;
    staffNotes?: string;
  },
  userOverride?: any
): Promise<JobMatchIntake> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/admin/intakes/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update intake status.');
  }
  return data.intake;
}

export async function downloadAdminIntakeResume(intakeId: string, userOverride?: any): Promise<void> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch(`/api/job-match/admin/intakes/resume?intakeId=${encodeURIComponent(intakeId)}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || 'Failed to download resume.');
  }

  const disposition = res.headers.get('Content-Disposition') || '';
  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  const asciiMatch = disposition.match(/filename="([^"]+)"/i);
  const filename = utf8Match
    ? decodeURIComponent(utf8Match[1])
    : asciiMatch
    ? asciiMatch[1]
    : `resume_${intakeId}.pdf`;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function fetchAdminJobMatchControls(userOverride?: any): Promise<{
  controls: JobMatchControlSettings;
  stats: { aiJobMatchLeadsCount: number };
}> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/admin/controls', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to load AI Job Match admin controls.');
  }
  return {
    controls: data.controls,
    stats: data.stats || { aiJobMatchLeadsCount: 0 },
  };
}

export async function saveAdminJobMatchControls(
  controls: Partial<JobMatchControlSettings>,
  userOverride?: any
): Promise<JobMatchControlSettings> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch('/api/job-match/admin/controls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(controls),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to save AI Job Match controls.');
  }
  cachedRuntimeFlag = null;
  return data.controls;
}

export async function deleteAdminJobMatchRecord(matchId: string, userOverride?: any): Promise<void> {
  const token = await getBearerIdToken(userOverride);
  const res = await fetch(`/api/job-match/admin/match?matchId=${encodeURIComponent(matchId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete job match record.');
  }
}

