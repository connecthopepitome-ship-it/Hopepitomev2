/**
 * AI JOB MATCH MODULE — CLOUDFLARE WORKER API HANDLERS
 * Independent route handler invoked cleanly from src/worker.ts.
 * Enforces FEATURE_JOB_MATCH, server-side Firebase RS256 auth,
 * RBAC staff permissions, GAS Bearer API key auth, sanitization,
 * upserts, private resume streaming, notifications, and deletion.
 */

import type { EdgeFirestoreClient } from '../firebase/edge-firestore';
import {
  JOB_MATCH_ALLOWED_EXTENSIONS,
  JOB_MATCH_ALLOWED_MIME_TYPES,
  JOB_MATCH_BROWSER_GENERIC_MIMES,
  JOB_MATCH_CONSENT_TEXT,
  JOB_MATCH_DISALLOWED_MIME_TYPES,
  JOB_MATCH_INTAKE_STATUSES,
  JOB_MATCH_JOB_TYPES,
  JOB_MATCH_MAX_FILE_SIZE_BYTES,
  getMatchScoreBand,
  isValidJobMatchUrl,
} from './constants';
import {
  authenticateCandidateRequest,
  authenticateStaffRequest,
  buildJobMatchDocId,
  constantTimeEqual,
  extractBearerToken,
  isValidIsoDateString,
  resolveExistingCandidate,
  sanitizePlainText,
  sha256Hex,
  type JobMatchSecurityOverrides,
} from './security';
import {
  deletePrivateJobMatchResume,
  readPrivateJobMatchResume,
  storePrivateJobMatchResume,
  type GasBridgeCaller,
} from './storage';
import type {
  IncomingGasJobRow,
  JobMatchActionType,
  JobMatchControlSettings,
  JobMatchImportLog,
  JobMatchIntake,
  JobMatchIntakeStatus,
  JobMatchNotification,
  JobMatchRecord,
} from './types';

const DEFAULT_JOB_MATCH_CONTROLS: JobMatchControlSettings = {
  enabled: true,
  intakeOpen: true,
  emailNotificationsEnabled: true,
  statusBanner: '',
};

async function loadJobMatchControls(firestore: EdgeFirestoreClient): Promise<JobMatchControlSettings> {
  const doc = await firestore.getDocument('job_match_settings', 'config').catch(() => null);
  if (!doc) return { ...DEFAULT_JOB_MATCH_CONTROLS };
  return {
    enabled: doc.enabled !== false,
    intakeOpen: doc.intakeOpen !== false,
    emailNotificationsEnabled: doc.emailNotificationsEnabled !== false,
    statusBanner: String(doc.statusBanner || ''),
    updatedAt: doc.updatedAt ? String(doc.updatedAt) : undefined,
    updatedBy: doc.updatedBy ? String(doc.updatedBy) : undefined,
  };
}

export interface JobMatchHandlerContext {
  request: Request;
  url: URL;
  env: {
    FEATURE_JOB_MATCH?: string;
    JOB_MATCH_API_KEY?: string;
    ADMIN_EMAIL?: string;
    FIREBASE_PROJECT_ID?: string;
    GAS_WEB_APP_URL?: string;
    GAS_SHARED_SECRET?: string;
    AUTH_RATE_LIMIT_KV?: {
      put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
      get: (key: string) => Promise<string | null>;
    };
  };
  projectId: string;
  firestore: EdgeFirestoreClient;
  callGas: GasBridgeCaller | null;
  securityOverrides?: JobMatchSecurityOverrides;
}

const JOB_MATCH_CORS_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Expose-Headers': 'Content-Disposition',
};

const importRateLimiter = new Map<string, { count: number; windowStart: number }>();

function jsonResponse(payload: Record<string, any>, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JOB_MATCH_CORS_HEADERS,
  });
}

export function isJobMatchFeatureEnabled(flagValue?: string): boolean {
  return String(flagValue || '').trim().toLowerCase() === 'true';
}

function generateIntakeReference(): string {
  const now = new Date();
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JMI-${ym}-${rand}`;
}

function getFileExtension(fileName: string, mimeType?: string): string {
  const fromName = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';
  if ((JOB_MATCH_ALLOWED_EXTENSIONS as readonly string[]).includes(fromName)) {
    return fromName;
  }
  const mime = String(mimeType || '').toLowerCase().split(';')[0].trim();
  if (mime === 'application/pdf') return 'pdf';
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (mime === 'application/msword' || mime === 'application/vnd.ms-word') return 'doc';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/pjpeg') return 'jpg';
  return '';
}

function isAllowedResumeFile(fileName: string, mimeType?: string): { ok: boolean; ext: string } {
  const rawExt = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';
  const mime = String(mimeType || '').toLowerCase().split(';')[0].trim();

  // Reject explicitly dangerous MIME types even if extension was spoofed
  if (mime && (JOB_MATCH_DISALLOWED_MIME_TYPES as readonly string[]).includes(mime)) {
    return { ok: false, ext: '' };
  }

  // Must match allowed extension when filename carries an extension (blocks .exe/.bat/.html etc.)
  if (rawExt && !(JOB_MATCH_ALLOWED_EXTENSIONS as readonly string[]).includes(rawExt)) {
    return { ok: false, ext: '' };
  }

  const ext = getFileExtension(fileName, mime);
  if (!ext) {
    return { ok: false, ext: '' };
  }

  const mimeOk =
    !mime ||
    (JOB_MATCH_ALLOWED_MIME_TYPES as readonly string[]).includes(mime) ||
    (JOB_MATCH_BROWSER_GENERIC_MIMES as readonly string[]).includes(mime);

  return { ok: mimeOk, ext: mimeOk ? ext : '' };
}

function uint8ToBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    parts.push(String.fromCharCode.apply(null, Array.from(slice)));
  }
  return btoa(parts.join(''));
}

function sanitizeDownloadFilename(candidateId: string, candidateName: string, originalFilename: string): string {
  const ext = originalFilename.includes('.') ? originalFilename.split('.').pop()!.toLowerCase() : 'pdf';
  const cleanId = String(candidateId || 'Candidate').replace(/[^A-Za-z0-9_-]/g, '_');
  const cleanName = String(candidateName || 'Resume').trim().replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'Resume';
  return `${cleanId}_${cleanName}.${ext}`;
}

async function checkImportRateLimit(request: Request, env: JobMatchHandlerContext['env']): Promise<boolean> {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'gas-client';
  const now = Date.now();
  const key = `jm_import_rl:${ip}`;

  if (env.AUTH_RATE_LIMIT_KV) {
    try {
      const raw = await env.AUTH_RATE_LIMIT_KV.get(key);
      const parsed = raw ? (JSON.parse(raw) as { count: number; windowStart: number }) : null;
      if (parsed && now - parsed.windowStart < 60_000) {
        if (parsed.count >= 60) return false;
        await env.AUTH_RATE_LIMIT_KV.put(key, JSON.stringify({ count: parsed.count + 1, windowStart: parsed.windowStart }), {
          expirationTtl: 120,
        });
        return true;
      }
      await env.AUTH_RATE_LIMIT_KV.put(key, JSON.stringify({ count: 1, windowStart: now }), {
        expirationTtl: 120,
      });
      return true;
    } catch {
      // Fall through to in-memory limiter
    }
  }

  const current = importRateLimiter.get(key);
  if (current && now - current.windowStart < 60_000) {
    if (current.count >= 60) return false;
    current.count += 1;
    return true;
  }
  importRateLimiter.set(key, { count: 1, windowStart: now });
  return true;
}

/**
 * Entry point for all /api/job-match* and /api/job-matches* routes.
 * Returns null if the pathname does not belong to AI Job Match.
 */
export async function handleJobMatchRoutes(ctx: JobMatchHandlerContext): Promise<Response | null> {
  const { request, url, env, projectId, firestore, callGas, securityOverrides } = ctx;
  const pathname = url.pathname;

  if (!pathname.startsWith('/api/job-match')) {
    return null;
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: JOB_MATCH_CORS_HEADERS });
  }

  const enabled = isJobMatchFeatureEnabled(env.FEATURE_JOB_MATCH);

  // Public runtime feature-flag status endpoint
  if (pathname === '/api/job-match/config' && request.method === 'GET') {
    if (!enabled) {
      return jsonResponse({ success: true, enabled: false }, 200);
    }
    const controls = await loadJobMatchControls(firestore);
    return jsonResponse(
      {
        success: true,
        enabled: controls.enabled,
        ...(controls.updatedAt
          ? { intakeOpen: controls.intakeOpen, statusBanner: controls.statusBanner }
          : {}),
      },
      200
    );
  }

  // Enforce FEATURE_JOB_MATCH globally across every other endpoint
  if (!enabled) {
    return jsonResponse(
      {
        success: false,
        error: 'AI Job Match feature is currently disabled.',
        featureDisabled: true,
      },
      404
    );
  }

  const controls = await loadJobMatchControls(firestore);
  if (!controls.enabled && !pathname.startsWith('/api/job-match/admin')) {
    return jsonResponse(
      {
        success: false,
        error: 'AI Job Match is temporarily paused by administration.',
        adminPaused: true,
      },
      403
    );
  }

  // ===========================================================================
  // 1. GOOGLE APPS SCRIPT JOB IMPORT API (POST /api/job-matches/import)
  // ===========================================================================
  if (pathname === '/api/job-matches/import') {
    if (request.method !== 'POST') {
      return jsonResponse({ success: false, error: 'Method Not Allowed' }, 405);
    }

    const configuredKey = String(env.JOB_MATCH_API_KEY || '').trim();
    const incomingToken = extractBearerToken(request) || '';
    if (!configuredKey || !constantTimeEqual(incomingToken, configuredKey)) {
      return jsonResponse({ success: false, error: 'Unauthorized: Invalid or missing API key.' }, 401);
    }

    const withinLimit = await checkImportRateLimit(request, env);
    if (!withinLimit) {
      return jsonResponse({ success: false, error: 'Rate limit exceeded. Retry later.' }, 429);
    }

    const importStartedAt = new Date().toISOString();
    const logId = `jmimp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      const body = (await request.json().catch(() => null)) as {
        batchId?: string;
        jobs?: IncomingGasJobRow[];
      } | null;

      if (!body || !Array.isArray(body.jobs)) {
        return jsonResponse({ success: false, error: 'Invalid request payload: expected { jobs: [...] }.' }, 400);
      }

      if (body.jobs.length > 500) {
        return jsonResponse({ success: false, error: 'Batch size exceeds maximum limit of 500 rows.' }, 400);
      }

      const batchKeyInput = body.batchId
        ? String(body.batchId)
        : JSON.stringify(
            body.jobs
              .map((j) => ({
                c: String(j?.candidateId || '').trim(),
                u: String(j?.url || '').trim(),
                f: String(j?.foundOn || '').trim(),
              }))
              .sort((a, b) => `${a.c}|${a.u}`.localeCompare(`${b.c}|${b.u}`))
          );
      const batchHash = (await sha256Hex(batchKeyInput)).slice(0, 20);

      let saved = 0;
      let updated = 0;
      const errors: Array<{ index: number; candidateId?: string; message: string }> = [];
      const newlySavedByCandidate = new Map<
        string,
        { count: number; candidateName: string; candidateEmail: string }
      >();
      const resolvedCandidateCache = new Map<
        string,
        Awaited<ReturnType<typeof resolveExistingCandidate>>
      >();

      for (let i = 0; i < body.jobs.length; i++) {
        const row = body.jobs[i];
        if (!row || typeof row !== 'object') {
          errors.push({ index: i, message: 'Invalid job row object.' });
          continue;
        }

        const rawCandId = sanitizePlainText(row.candidateId, 80);
        const title = sanitizePlainText(row.title, 200);
        const company = sanitizePlainText(row.company, 160);
        const targetRole = sanitizePlainText(row.targetRole, 160);
        const location = sanitizePlainText(row.location, 160) || 'Not specified';
        const jobType = sanitizePlainText(row.jobType, 60) || 'Full-time';
        const experience = sanitizePlainText(row.experience, 80) || 'Not stated';
        const salary = sanitizePlainText(row.salary, 100) || 'Not stated';
        const source = sanitizePlainText(row.source, 80) || 'Direct';
        const rawUrl = String(row.url || '').trim();
        const postedDate = sanitizePlainText(row.postedDate, 32);
        const foundOn = sanitizePlainText(row.foundOn, 32) || new Date().toISOString().split('T')[0];
        const matchReason = sanitizePlainText(row.matchReason, 600);
        const resumeGaps = sanitizePlainText(row.resumeGaps, 600);
        const recommendedService = sanitizePlainText(row.recommendedService, 120) || 'ATS Optimisation';
        const rawScore = Number(row.matchScore);

        if (!rawCandId) {
          errors.push({ index: i, message: 'candidateId is required.' });
          continue;
        }
        if (!title || !company || !targetRole) {
          errors.push({
            index: i,
            candidateId: rawCandId,
            message: 'title, company, and targetRole are required.',
          });
          continue;
        }
        if (!isValidJobMatchUrl(rawUrl)) {
          errors.push({
            index: i,
            candidateId: rawCandId,
            message: 'Invalid URL: must begin with https:// or http://.',
          });
          continue;
        }
        if (!Number.isFinite(rawScore) || rawScore < 0 || rawScore > 100) {
          errors.push({
            index: i,
            candidateId: rawCandId,
            message: 'Invalid matchScore: must be a number between 0 and 100.',
          });
          continue;
        }
        if (postedDate && !isValidIsoDateString(postedDate)) {
          errors.push({
            index: i,
            candidateId: rawCandId,
            message: 'Invalid postedDate format (expected YYYY-MM-DD).',
          });
          continue;
        }
        if (!isValidIsoDateString(foundOn)) {
          errors.push({
            index: i,
            candidateId: rawCandId,
            message: 'Invalid foundOn date format (expected YYYY-MM-DD).',
          });
          continue;
        }

        let resolved = resolvedCandidateCache.get(rawCandId);
        if (resolved === undefined) {
          resolved = await resolveExistingCandidate(firestore, rawCandId);
          resolvedCandidateCache.set(rawCandId, resolved);
        }
        if (!resolved) {
          errors.push({
            index: i,
            candidateId: rawCandId,
            message: `Candidate ${rawCandId} does not exist.`,
          });
          continue;
        }

        const canonicalCandidateId = resolved.candidateId;
        const matchDocId = await buildJobMatchDocId(canonicalCandidateId, rawUrl);
        const existingMatch = await firestore.getDocument('job_matches', matchDocId).catch(() => null);

        // Find latest eligible intake for this candidate
        const candidateIntakes = await firestore
          .queryCollection(
            'job_match_intakes',
            { field: 'candidate_id', op: 'EQUAL', value: canonicalCandidateId },
            25
          )
          .catch(() => []);
        candidateIntakes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const matchingIntake =
          candidateIntakes.find(
            (intake) => String(intake.target_role || '').toLowerCase() === targetRole.toLowerCase()
          ) || candidateIntakes[0];

        const now = new Date().toISOString();
        const roundedScore = Math.round(rawScore);

        const matchRecord: JobMatchRecord = {
          id: matchDocId,
          candidate_id: canonicalCandidateId,
          intake_id: matchingIntake?.id || existingMatch?.intake_id || null,
          target_role: targetRole,
          title,
          company,
          location,
          job_type: jobType,
          experience,
          salary,
          posted_date: postedDate || foundOn,
          source,
          url: rawUrl,
          url_hash: matchDocId.split('__')[1],
          match_score: roundedScore,
          match_band: getMatchScoreBand(roundedScore),
          match_reason: matchReason,
          resume_gaps: resumeGaps,
          recommended_service: recommendedService,
          found_on: foundOn,
          first_imported_batch_id: existingMatch?.first_imported_batch_id || batchHash,
          created_at: existingMatch?.created_at || now,
          updated_at: now,
        };

        await firestore.setDocument('job_matches', matchDocId, matchRecord, true);

        if (existingMatch) {
          updated += 1;
        } else {
          saved += 1;
          const prev = newlySavedByCandidate.get(canonicalCandidateId) || {
            count: 0,
            candidateName: resolved.candidateName || sanitizePlainText(row.candidateName, 120) || 'Candidate',
            candidateEmail: resolved.candidateEmail,
          };
          prev.count += 1;
          newlySavedByCandidate.set(canonicalCandidateId, prev);
        }
      }

      // Post-processing for candidates with >= 1 newly saved job
      const now = new Date().toISOString();
      for (const [candidateId, info] of Array.from(newlySavedByCandidate.entries())) {
        // 1. Update latest eligible intake status to 'Jobs ready'
        const candidateIntakes = await firestore
          .queryCollection('job_match_intakes', { field: 'candidate_id', op: 'EQUAL', value: candidateId }, 25)
          .catch(() => []);
        candidateIntakes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const eligibleIntake = candidateIntakes.find((i) => i.status !== 'Jobs ready') || candidateIntakes[0];
        if (eligibleIntake && eligibleIntake.status !== 'Jobs ready') {
          const history = Array.isArray(eligibleIntake.status_history) ? eligibleIntake.status_history : [];
          history.push({
            status: 'Jobs ready',
            changedAt: now,
            changedBy: 'SYSTEM_JOB_IMPORT',
            note: `${info.count} new job match(es) imported.`,
          });
          await firestore.setDocument('job_match_intakes', eligibleIntake.id, {
            status: 'Jobs ready' as JobMatchIntakeStatus,
            status_history: history,
            updated_at: now,
            last_updated_at: now,
          });
        }

        // 2. Idempotent in-app notification (never duplicates on same batch retry)
        const notifId = `${candidateId}__${batchHash}`;
        const existingNotif = await firestore.getDocument('job_match_notifications', notifId).catch(() => null);
        if (!existingNotif) {
          let emailSent = false;
          if (controls.emailNotificationsEnabled && info.candidateEmail && callGas) {
            try {
              const emailRes = await callGas({
                action: 'sendJobMatchEmail',
                to: info.candidateEmail,
                subject: `New AI Job Matches Ready (${info.count}) — Hopepitome Career Services`,
                body: `Hi ${info.candidateName},\n\nWe found ${info.count} new matched job opportunity(ies) for your profile. Sign in to your Hopepitome Candidate Portal to view your matches and insights.\n\nRegards,\nHopepitome Career Services`,
              });
              emailSent = Boolean(emailRes?.success);
            } catch {
              emailSent = false;
            }
          }

          const notifRecord: JobMatchNotification = {
            id: notifId,
            candidate_id: candidateId,
            batch_key: batchHash,
            title: 'New AI Job Matches Available',
            message: `${info.count} new matching job opportunity(ies) ready to review.`,
            new_jobs_count: info.count,
            is_read: false,
            email_sent: emailSent,
            created_at: now,
          };
          await firestore.setDocument('job_match_notifications', notifId, notifRecord, false);
        }
      }

      const importCompletedAt = new Date().toISOString();
      const logRecord: JobMatchImportLog = {
        id: logId,
        import_started_at: importStartedAt,
        import_completed_at: importCompletedAt,
        total_received: body.jobs.length,
        saved_count: saved,
        updated_count: updated,
        error_count: errors.length,
        status: errors.length === 0 ? 'SUCCESS' : saved + updated > 0 ? 'PARTIAL_FAILURE' : 'FAILED',
        error_summary: errors.slice(0, 50),
      };
      await firestore.setDocument('job_match_import_logs', logId, logRecord, false);

      return jsonResponse({ saved, updated, errors }, 200);
    } catch (err: any) {
      const importCompletedAt = new Date().toISOString();
      await firestore
        .setDocument(
          'job_match_import_logs',
          logId,
          {
            id: logId,
            import_started_at: importStartedAt,
            import_completed_at: importCompletedAt,
            total_received: 0,
            saved_count: 0,
            updated_count: 0,
            error_count: 1,
            status: 'FAILED',
            error_summary: [{ index: -1, message: err?.message || 'Internal import error' }],
          },
          false
        )
        .catch(() => {});

      return jsonResponse({ success: false, error: 'Failed to process job match import.' }, 500);
    }
  }

  // ===========================================================================
  // 1B. CANDIDATE SESSION VERIFICATION (GET /api/job-match/session)
  // ===========================================================================
  if (pathname === '/api/job-match/session' && request.method === 'GET') {
    const authResult = await authenticateCandidateRequest(request, firestore, projectId, securityOverrides);
    if (!authResult.ok) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }
    return jsonResponse(
      {
        success: true,
        candidateId: authResult.candidateId,
        candidateCode: authResult.candidateCode,
        candidateName: authResult.candidateName,
        workOrderId: authResult.workOrderId,
      },
      200
    );
  }

  // ===========================================================================
  // 2. CANDIDATE INTAKES (GET / POST /api/job-match/intakes)
  // ===========================================================================
  if (pathname === '/api/job-match/intakes') {
    const authResult = await authenticateCandidateRequest(request, firestore, projectId, securityOverrides);
    if (!authResult.ok) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    if (request.method === 'GET') {
      const intakes = await firestore
        .queryCollection('job_match_intakes', { field: 'candidate_id', op: 'EQUAL', value: authResult.candidateId }, 100)
        .catch(() => []);
      intakes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const notifications = await firestore
        .queryCollection('job_match_notifications', { field: 'candidate_id', op: 'EQUAL', value: authResult.candidateId }, 25)
        .catch(() => []);
      const unreadNotifications = notifications.filter((n) => !n.is_read).length;

      return jsonResponse(
        {
          success: true,
          candidateId: authResult.candidateId,
          candidateCode: authResult.candidateCode,
          intakes,
          unreadNotifications,
        },
        200
      );
    }

    if (request.method === 'POST') {
      if (!controls.intakeOpen) {
        return jsonResponse(
          {
            success: false,
            error: 'New AI Job Match intake submissions are temporarily paused by administration.',
          },
          403
        );
      }

      try {
        let targetRole = '';
        let preferredLocations: string[] = [];
        let experienceYears = '';
        let currentSalary = '';
        let expectedSalary = '';
        let noticePeriod = '';
        let jobType = 'Full-time';
        let keySkills: string[] = [];
        let consentGiven = false;
        let fileName = '';
        let mimeType = '';
        let fileSize = 0;
        let base64Content = '';

        const contentType = (request.headers.get('content-type') || '').toLowerCase();
        if (contentType.includes('multipart/form-data')) {
          const fd = await request.formData();
          targetRole = sanitizePlainText(fd.get('targetRole'), 160);
          experienceYears = sanitizePlainText(fd.get('experienceYears'), 60);
          currentSalary = sanitizePlainText(fd.get('currentSalary'), 80);
          expectedSalary = sanitizePlainText(fd.get('expectedSalary'), 80);
          noticePeriod = sanitizePlainText(fd.get('noticePeriod'), 80);
          jobType = sanitizePlainText(fd.get('jobType'), 60) || 'Full-time';
          consentGiven = fd.get('consentGiven') === 'true';

          const locRaw = fd.get('preferredLocations');
          if (typeof locRaw === 'string') {
            try {
              const parsed = JSON.parse(locRaw);
              if (Array.isArray(parsed)) preferredLocations = parsed.map((l) => sanitizePlainText(l, 100)).filter(Boolean);
            } catch {
              preferredLocations = locRaw.split(',').map((l) => sanitizePlainText(l, 100)).filter(Boolean);
            }
          }

          const skillsRaw = fd.get('keySkills');
          if (typeof skillsRaw === 'string') {
            try {
              const parsed = JSON.parse(skillsRaw);
              if (Array.isArray(parsed)) keySkills = parsed.map((s) => sanitizePlainText(s, 60)).filter(Boolean);
            } catch {
              keySkills = skillsRaw.split(',').map((s) => sanitizePlainText(s, 60)).filter(Boolean);
            }
          }

          const resumeFile = fd.get('resume');
          if (resumeFile && typeof resumeFile === 'object' && 'arrayBuffer' in resumeFile) {
            const f = resumeFile as File;
            fileName = sanitizePlainText(f.name || 'resume.pdf', 180);
            mimeType = f.type || '';
            fileSize = f.size;
            const buf = new Uint8Array(await f.arrayBuffer());
            base64Content = uint8ToBase64(buf);
          }
        } else {
          const body = (await request.json().catch(() => null)) as Record<string, any> | null;
          if (!body) return jsonResponse({ success: false, error: 'Invalid request body.' }, 400);

          targetRole = sanitizePlainText(body.targetRole, 160);
          preferredLocations = Array.isArray(body.preferredLocations)
            ? body.preferredLocations.map((l: unknown) => sanitizePlainText(l, 100)).filter(Boolean)
            : [];
          experienceYears = sanitizePlainText(body.experienceYears, 60);
          currentSalary = sanitizePlainText(body.currentSalary, 80);
          expectedSalary = sanitizePlainText(body.expectedSalary, 80);
          noticePeriod = sanitizePlainText(body.noticePeriod, 80);
          jobType = sanitizePlainText(body.jobType, 60) || 'Full-time';
          keySkills = Array.isArray(body.keySkills)
            ? body.keySkills.map((s: unknown) => sanitizePlainText(s, 60)).filter(Boolean)
            : [];
          consentGiven = body.consentGiven === true;
          fileName = sanitizePlainText(body.fileName, 180);
          mimeType = sanitizePlainText(body.mimeType, 120);
          fileSize = Number(body.fileSize || 0);
          base64Content = String(body.base64Content || '');
        }

        if (!targetRole) {
          return jsonResponse({ success: false, error: 'Target role / job title is required.' }, 400);
        }
        if (preferredLocations.length === 0) {
          return jsonResponse({ success: false, error: 'Please select at least one preferred location.' }, 400);
        }
        if (!experienceYears) {
          return jsonResponse({ success: false, error: 'Total experience is required.' }, 400);
        }
        if (!(JOB_MATCH_JOB_TYPES as readonly string[]).includes(jobType)) {
          return jsonResponse({ success: false, error: 'Please select a valid job type.' }, 400);
        }
        if (!consentGiven) {
          return jsonResponse({ success: false, error: 'Consent confirmation is required to proceed.' }, 400);
        }
        if (!fileName || !base64Content) {
          return jsonResponse({ success: false, error: 'Resume file upload is required.' }, 400);
        }

        const { ok: formatOk, ext } = isAllowedResumeFile(fileName, mimeType);
        if (!formatOk || !ext) {
          return jsonResponse(
            {
              success: false,
              error: 'Only PDF, DOCX, JPG, PNG allowed',
            },
            400
          );
        }

        const cleanB64 = (base64Content.includes(',') ? base64Content.split(',')[1] : base64Content).replace(/\s+/g, '');
        const computedBytes = Math.floor((cleanB64.length * 3) / 4);
        const actualSize = fileSize > 0 ? fileSize : computedBytes;
        if (actualSize > JOB_MATCH_MAX_FILE_SIZE_BYTES || computedBytes > JOB_MATCH_MAX_FILE_SIZE_BYTES) {
          return jsonResponse(
            { success: false, error: 'File too large — max 8 MB' },
            400
          );
        }

        const now = new Date().toISOString();
        const intakeId = `jmi_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const intakeReference = generateIntakeReference();
        const resolvedMime =
          mimeType &&
          !(JOB_MATCH_BROWSER_GENERIC_MIMES as readonly string[]).includes(mimeType.toLowerCase())
            ? mimeType
            : ext === 'pdf'
            ? 'application/pdf'
            : ext === 'docx'
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : ext === 'doc'
            ? 'application/msword'
            : ext === 'png'
            ? 'image/png'
            : 'image/jpeg';

        let stored;
        try {
          stored = await storePrivateJobMatchResume(firestore, callGas, {
            intakeId,
            intakeReference,
            candidateId: authResult.candidateId,
            candidateCode: authResult.candidateCode,
            fileName,
            mimeType: resolvedMime,
            fileSize: actualSize,
            base64Content: cleanB64,
          });
        } catch (uploadErr: any) {
          console.error('[Job Match Private Upload Error]:', uploadErr);
          return jsonResponse({ success: false, error: 'Upload failed, please try again.' }, 500);
        }

        const intakeRecord: JobMatchIntake = {
          id: intakeId,
          intake_reference: intakeReference,
          candidate_id: authResult.candidateId,
          candidate_code: authResult.candidateCode,
          candidate_name: authResult.candidateName,
          work_order_id: authResult.workOrderId,
          target_role: targetRole,
          preferred_locations: preferredLocations.slice(0, 15),
          experience_years: experienceYears,
          current_salary: currentSalary || undefined,
          expected_salary: expectedSalary || undefined,
          notice_period: noticePeriod || undefined,
          job_type: jobType,
          key_skills: keySkills.slice(0, 30),
          resume_storage_reference: stored.storageReference,
          resume_original_filename: fileName,
          resume_mime_type: resolvedMime,
          resume_size: actualSize,
          consent_given: true,
          consent_text: JOB_MATCH_CONSENT_TEXT,
          consent_timestamp: now,
          status: 'Resume received',
          status_history: [
            {
              status: 'Resume received',
              changedAt: now,
              changedBy: `CANDIDATE:${authResult.candidateId}`,
              note: 'Submitted via Candidate AI Job Match Intake.',
            },
          ],
          staff_notes: '',
          created_at: now,
          updated_at: now,
          last_updated_at: now,
        };

        await firestore.setDocument('job_match_intakes', intakeId, intakeRecord, false);

        // Log AI Job Match submission cleanly to Admin Scanning Leads (non-blocking)
        try {
          const regLeadId = authResult.workOrderId ? `jm_reg_${authResult.workOrderId}` : '';
          const existingRegLead = regLeadId
            ? await firestore.getDocument('scanning_leads', regLeadId).catch(() => null)
            : null;
          const scanLeadId =
            existingRegLead && !existingRegLead.assessment_id ? regLeadId : `jm_lead_${intakeId}`;
          const candidateDisplayId = authResult.workOrderId || authResult.candidateCode;

          await firestore.setDocument('scanning_leads', scanLeadId, {
            scanning_lead_id: scanLeadId,
            scan_reference: `${intakeReference} (${candidateDisplayId})`,
            lead_type: 'SCANNING_LEAD',
            source: 'CAREER_STUDIO_AI_JOB_MATCH',
            created_at: existingRegLead?.created_at || now,
            last_updated_at: now,
            scan_status: 'COMPLETED',
            candidate_name: authResult.candidateName,
            email: authResult.candidateEmail || '',
            mobile_number: authResult.candidateMobile || '',
            location: preferredLocations.slice(0, 5).join(', '),
            original_file_name: fileName,
            file_extension: ext,
            file_size: actualSize,
            mime_type: resolvedMime,
            google_drive_file_id: stored.gasFileId || '',
            google_drive_folder_id: stored.driveFolderId || '',
            google_drive_file_url: '',
            upload_status: stored.gasFileId ? 'UPLOADED' : 'VAULT_STORED',
            storage_status: stored.gasFileId ? 'STORED' : 'PENDING',
            assessment_id: intakeId,
            overall_score: null,
            assessment_status: 'COMPLETED',
            scan_completed_at: now,
            lead_status: existingRegLead?.lead_status || 'NEW',
            assigned_to: existingRegLead?.assigned_to || '',
            admin_notes: `AI Job Match Intake • Candidate ID: ${candidateDisplayId} • Target Role: ${targetRole} • Experience: ${experienceYears}`,
          });
        } catch (leadSyncErr) {
          console.warn('[Job Match Scanning Leads Sync Warning]:', leadSyncErr);
        }

        return jsonResponse(
          {
            success: true,
            intake: intakeRecord,
            message: `AI Job Match request submitted (${intakeReference}).`,
          },
          201
        );
      } catch (err: any) {
        return jsonResponse(
          { success: false, error: err?.message || 'Failed to submit AI Job Match intake.' },
          500
        );
      }
    }

    return jsonResponse({ success: false, error: 'Method Not Allowed' }, 405);
  }

  // ===========================================================================
  // 3. CANDIDATE RESULTS (GET /api/job-match/results)
  // ===========================================================================
  if (pathname === '/api/job-match/results' && request.method === 'GET') {
    const authResult = await authenticateCandidateRequest(request, firestore, projectId, securityOverrides);
    if (!authResult.ok) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const [rawJobs, rawActions, viewState, notifications] = await Promise.all([
      firestore
        .queryCollection('job_matches', { field: 'candidate_id', op: 'EQUAL', value: authResult.candidateId }, 250)
        .catch(() => []),
      firestore
        .queryCollection(
          'job_match_candidate_actions',
          { field: 'candidate_id', op: 'EQUAL', value: authResult.candidateId },
          250
        )
        .catch(() => []),
      firestore.getDocument('job_match_candidate_state', authResult.candidateId).catch(() => null),
      firestore
        .queryCollection(
          'job_match_notifications',
          { field: 'candidate_id', op: 'EQUAL', value: authResult.candidateId },
          50
        )
        .catch(() => []),
    ]);

    const actionMap = new Map<string, JobMatchActionType>();
    for (const a of rawActions) {
      if (a.job_match_id && a.action) {
        actionMap.set(String(a.job_match_id), a.action as JobMatchActionType);
      }
    }

    const previousViewedAt = viewState?.last_viewed_results_at ? String(viewState.last_viewed_results_at) : null;
    const prevViewedMs = previousViewedAt ? new Date(previousViewedAt).getTime() : 0;

    const visibleJobs: JobMatchRecord[] = [];
    const locationSet = new Set<string>();
    const jobTypeSet = new Set<string>();

    for (const doc of rawJobs) {
      const action = actionMap.get(String(doc.id)) || null;
      if (action === 'NOT_INTERESTED') {
        continue; // Hidden from candidate's normal active results while retaining underlying record
      }
      const createdMs = doc.created_at ? new Date(String(doc.created_at)).getTime() : 0;
      const isNew = prevViewedMs === 0 ? true : createdMs > prevViewedMs;
      const score = Number(doc.match_score || 0);

      locationSet.add(String(doc.location || 'Not specified'));
      jobTypeSet.add(String(doc.job_type || 'Full-time'));

      visibleJobs.push({
        ...(doc as JobMatchRecord),
        match_score: score,
        match_band: getMatchScoreBand(score),
        candidate_action: action,
        is_new: isNew,
      });
    }

    // Sort highest match_score first
    visibleJobs.sort((a, b) => b.match_score - a.match_score);

    const totalJobs = visibleJobs.length;
    const highChanceCount = visibleJobs.filter((j) => j.match_score >= 75).length;
    const newJobsCount = visibleJobs.filter((j) => j.is_new).length;
    const resumeGapCount = visibleJobs.filter((j) => {
      const gap = String(j.resume_gaps || '').trim().toLowerCase();
      return Boolean(gap && gap !== 'none' && gap !== 'n/a' && gap !== 'not stated');
    }).length;
    const showResumeGapBanner = totalJobs > 0 && resumeGapCount > totalJobs / 2;

    // Update last viewed timestamp & mark notifications as read cleanly
    const now = new Date().toISOString();
    await firestore
      .setDocument(
        'job_match_candidate_state',
        authResult.candidateId,
        {
          candidate_id: authResult.candidateId,
          last_viewed_results_at: now,
          updated_at: now,
        },
        true
      )
      .catch(() => {});

    for (const notif of notifications) {
      if (!notif.is_read && notif.id) {
        await firestore
          .setDocument('job_match_notifications', String(notif.id), { is_read: true }, true)
          .catch(() => {});
      }
    }

    return jsonResponse(
      {
        success: true,
        candidateId: authResult.candidateId,
        candidateCode: authResult.candidateCode,
        jobs: visibleJobs,
        summary: {
          totalJobs,
          highChanceCount,
          newJobsCount,
          resumeGapCount,
          showResumeGapBanner,
        },
        filters: {
          locations: Array.from(locationSet).sort(),
          jobTypes: Array.from(jobTypeSet).sort(),
        },
        lastViewedAt: previousViewedAt,
      },
      200
    );
  }

  // ===========================================================================
  // 4. CANDIDATE JOB ACTIONS (POST /api/job-match/actions)
  // ===========================================================================
  if (pathname === '/api/job-match/actions' && request.method === 'POST') {
    const authResult = await authenticateCandidateRequest(request, firestore, projectId, securityOverrides);
    if (!authResult.ok) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const body = (await request.json().catch(() => null)) as {
      jobMatchId?: string;
      action?: JobMatchActionType | 'CLEAR';
    } | null;

    const jobMatchId = sanitizePlainText(body?.jobMatchId, 160);
    const action = body?.action;

    if (!jobMatchId) {
      return jsonResponse({ success: false, error: 'jobMatchId is required.' }, 400);
    }

    const matchDoc = await firestore.getDocument('job_matches', jobMatchId).catch(() => null);
    if (!matchDoc) {
      return jsonResponse({ success: false, error: 'Job match record not found.' }, 404);
    }
    if (String(matchDoc.candidate_id) !== authResult.candidateId) {
      return jsonResponse({ success: false, error: 'Access denied for this job match.' }, 403);
    }

    const actionDocId = `${authResult.candidateId}__${jobMatchId}`;
    if (action === 'CLEAR') {
      await firestore.deleteDocument('job_match_candidate_actions', actionDocId);
      return jsonResponse({ success: true, jobMatchId, action: null }, 200);
    }

    if (!['SAVED', 'APPLIED', 'NOT_INTERESTED'].includes(String(action))) {
      return jsonResponse({ success: false, error: 'Invalid action value.' }, 400);
    }

    const now = new Date().toISOString();
    const existing = await firestore.getDocument('job_match_candidate_actions', actionDocId).catch(() => null);
    await firestore.setDocument(
      'job_match_candidate_actions',
      actionDocId,
      {
        id: actionDocId,
        candidate_id: authResult.candidateId,
        job_match_id: jobMatchId,
        action,
        created_at: existing?.created_at || now,
        updated_at: now,
      },
      false
    );

    return jsonResponse({ success: true, jobMatchId, action }, 200);
  }

  // ===========================================================================
  // 5. CANDIDATE DATA DELETION (DELETE /api/job-match/data)
  // ===========================================================================
  if (pathname === '/api/job-match/data' && request.method === 'DELETE') {
    const authResult = await authenticateCandidateRequest(request, firestore, projectId, securityOverrides);
    if (!authResult.ok) {
      return jsonResponse({ success: false, error: authResult.error }, authResult.status);
    }

    const body = (await request.json().catch(() => null)) as { confirmDelete?: boolean } | null;
    if (body?.confirmDelete !== true) {
      return jsonResponse(
        { success: false, error: 'Explicit confirmation (confirmDelete: true) is required.' },
        400
      );
    }

    const candidateId = authResult.candidateId;
    const deletionErrors: string[] = [];

    const [intakes, matches, actions, notifications] = await Promise.all([
      firestore.queryCollection('job_match_intakes', { field: 'candidate_id', op: 'EQUAL', value: candidateId }, 250).catch(() => []),
      firestore.queryCollection('job_matches', { field: 'candidate_id', op: 'EQUAL', value: candidateId }, 500).catch(() => []),
      firestore.queryCollection('job_match_candidate_actions', { field: 'candidate_id', op: 'EQUAL', value: candidateId }, 500).catch(() => []),
      firestore.queryCollection('job_match_notifications', { field: 'candidate_id', op: 'EQUAL', value: candidateId }, 250).catch(() => []),
    ]);

    for (const intake of intakes) {
      const storageRes = await deletePrivateJobMatchResume(
        firestore,
        callGas,
        String(intake.resume_storage_reference || ''),
        String(intake.id)
      );
      if (!storageRes.ok) deletionErrors.push(...storageRes.errors);

      const ok = await firestore.deleteDocument('job_match_intakes', String(intake.id));
      if (!ok) deletionErrors.push(`Failed deleting intake ${intake.id}`);
    }

    for (const m of matches) {
      const ok = await firestore.deleteDocument('job_matches', String(m.id));
      if (!ok) deletionErrors.push(`Failed deleting job_match ${m.id}`);
    }

    for (const a of actions) {
      const ok = await firestore.deleteDocument('job_match_candidate_actions', String(a.id));
      if (!ok) deletionErrors.push(`Failed deleting action ${a.id}`);
    }

    for (const n of notifications) {
      const ok = await firestore.deleteDocument('job_match_notifications', String(n.id));
      if (!ok) deletionErrors.push(`Failed deleting notification ${n.id}`);
    }

    await firestore.deleteDocument('job_match_candidate_state', candidateId).catch(() => {});

    if (deletionErrors.length > 0) {
      await firestore
        .setDocument(
          'job_match_deletion_logs',
          `jmdel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          {
            candidate_id: candidateId,
            errors: deletionErrors.slice(0, 50),
            timestamp: new Date().toISOString(),
          },
          false
        )
        .catch(() => {});
      return jsonResponse(
        {
          success: false,
          error: 'Some AI Job Match items could not be deleted cleanly. Issue has been logged for resolution.',
        },
        500
      );
    }

    return jsonResponse(
      {
        success: true,
        deleted: {
          intakes: intakes.length,
          matches: matches.length,
          actions: actions.length,
        },
        message: 'All AI Job Match intakes, resumes, matches, and activity have been permanently deleted.',
      },
      200
    );
  }

  // ===========================================================================
  // 6. ADMIN / STAFF INTAKE QUEUE (GET /api/job-match/admin/intakes)
  // ===========================================================================
  if (pathname === '/api/job-match/admin/intakes' && request.method === 'GET') {
    const staffAuth = await authenticateStaffRequest(
      request,
      firestore,
      projectId,
      'view',
      env.ADMIN_EMAIL,
      securityOverrides
    );
    if (!staffAuth.ok) {
      return jsonResponse({ success: false, error: staffAuth.error }, staffAuth.status);
    }

    const [intakes, matches, importLogs] = await Promise.all([
      firestore.listDocuments('job_match_intakes', 250).catch(() => []),
      firestore.listDocuments('job_matches', 500).catch(() => []),
      firestore.listDocuments('job_match_import_logs', 50).catch(() => []),
    ]);

    intakes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    importLogs.sort((a, b) => new Date(b.import_started_at).getTime() - new Date(a.import_started_at).getTime());

    const matchesByCandidate: Record<string, JobMatchRecord[]> = {};
    for (const m of matches) {
      const cid = String(m.candidate_id || '');
      if (!cid) continue;
      if (!matchesByCandidate[cid]) matchesByCandidate[cid] = [];
      matchesByCandidate[cid].push(m as JobMatchRecord);
    }
    for (const list of Object.values(matchesByCandidate)) {
      list.sort((a, b) => Number(b.match_score || 0) - Number(a.match_score || 0));
    }

    return jsonResponse(
      {
        success: true,
        intakes,
        matchesByCandidate,
        importLogs,
      },
      200
    );
  }

  // ===========================================================================
  // 7. ADMIN UPDATE STATUS & NOTES (POST /api/job-match/admin/intakes/status)
  // ===========================================================================
  if (pathname === '/api/job-match/admin/intakes/status' && request.method === 'POST') {
    const staffAuth = await authenticateStaffRequest(
      request,
      firestore,
      projectId,
      'edit',
      env.ADMIN_EMAIL,
      securityOverrides
    );
    if (!staffAuth.ok) {
      return jsonResponse({ success: false, error: staffAuth.error }, staffAuth.status);
    }

    const body = (await request.json().catch(() => null)) as {
      intakeId?: string;
      status?: JobMatchIntakeStatus;
      staffNotes?: string;
    } | null;

    const intakeId = sanitizePlainText(body?.intakeId, 120);
    if (!intakeId) {
      return jsonResponse({ success: false, error: 'intakeId is required.' }, 400);
    }

    const intake = await firestore.getDocument('job_match_intakes', intakeId).catch(() => null);
    if (!intake) {
      return jsonResponse({ success: false, error: 'Intake record not found.' }, 404);
    }

    const nextStatus = body?.status;
    if (nextStatus && !(JOB_MATCH_INTAKE_STATUSES as readonly string[]).includes(nextStatus)) {
      return jsonResponse({ success: false, error: 'Invalid intake status value.' }, 400);
    }

    const now = new Date().toISOString();
    const updates: Record<string, any> = {
      updated_at: now,
      last_updated_at: now,
    };

    if (body?.staffNotes !== undefined) {
      updates.staff_notes = sanitizePlainText(body.staffNotes, 2000);
    }

    if (nextStatus && nextStatus !== intake.status) {
      const history = Array.isArray(intake.status_history) ? [...intake.status_history] : [];
      history.push({
        status: nextStatus,
        changedAt: now,
        changedBy: staffAuth.staffEmail || staffAuth.staffName,
      });
      updates.status = nextStatus;
      updates.status_history = history;
    }

    await firestore.setDocument('job_match_intakes', intakeId, updates, true);

    return jsonResponse(
      {
        success: true,
        intake: { ...intake, ...updates },
      },
      200
    );
  }

  // ===========================================================================
  // 8. ADMIN SECURE RESUME DOWNLOAD (GET /api/job-match/admin/intakes/resume)
  // ===========================================================================
  if (pathname === '/api/job-match/admin/intakes/resume' && request.method === 'GET') {
    const staffAuth = await authenticateStaffRequest(
      request,
      firestore,
      projectId,
      'view',
      env.ADMIN_EMAIL,
      securityOverrides
    );
    if (!staffAuth.ok) {
      return jsonResponse({ success: false, error: staffAuth.error }, staffAuth.status);
    }

    const intakeId = sanitizePlainText(url.searchParams.get('intakeId'), 120);
    if (!intakeId) {
      return jsonResponse({ success: false, error: 'intakeId query parameter is required.' }, 400);
    }

    const intake = await firestore.getDocument('job_match_intakes', intakeId).catch(() => null);
    if (!intake) {
      return jsonResponse({ success: false, error: 'Intake record not found.' }, 404);
    }

    const fileData = await readPrivateJobMatchResume(
      firestore,
      callGas,
      String(intake.resume_storage_reference || ''),
      intakeId
    );
    if (!fileData) {
      return jsonResponse({ success: false, error: 'Resume file could not be retrieved.' }, 404);
    }

    const downloadName = sanitizeDownloadFilename(
      String(intake.candidate_code || intake.candidate_id),
      String(intake.candidate_name || 'Candidate'),
      String(intake.resume_original_filename || fileData.fileName || 'resume.pdf')
    );

    return new Response(fileData.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': fileData.mimeType || 'application/pdf',
        'Content-Disposition': `attachment; filename="${downloadName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
        'Content-Length': String(fileData.buffer.byteLength),
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
      },
    });
  }

  // ===========================================================================
  // 9. ADMIN CONTROLS & RUNTIME SETTINGS (/api/job-match/admin/controls)
  // ===========================================================================
  if (pathname === '/api/job-match/admin/controls') {
    if (request.method === 'GET') {
      const staffAuth = await authenticateStaffRequest(
        request,
        firestore,
        projectId,
        'view',
        env.ADMIN_EMAIL,
        securityOverrides
      );
      if (!staffAuth.ok) {
        return jsonResponse({ success: false, error: staffAuth.error }, staffAuth.status);
      }

      const [currentControls, scanningLeads] = await Promise.all([
        loadJobMatchControls(firestore),
        firestore.listDocuments('scanning_leads', 200).catch(() => []),
      ]);
      const aiJobMatchLeadsCount = scanningLeads.filter(
        (l) => l?.source === 'CAREER_STUDIO_AI_JOB_MATCH'
      ).length;

      return jsonResponse(
        {
          success: true,
          controls: currentControls,
          stats: {
            aiJobMatchLeadsCount,
          },
        },
        200
      );
    }

    if (request.method === 'POST') {
      const staffAuth = await authenticateStaffRequest(
        request,
        firestore,
        projectId,
        'edit',
        env.ADMIN_EMAIL,
        securityOverrides
      );
      if (!staffAuth.ok) {
        return jsonResponse({ success: false, error: staffAuth.error }, staffAuth.status);
      }

      const body = (await request.json().catch(() => null)) as Partial<JobMatchControlSettings> | null;
      if (!body) {
        return jsonResponse({ success: false, error: 'Invalid settings payload.' }, 400);
      }

      const existing = await loadJobMatchControls(firestore);
      const nextControls: JobMatchControlSettings = {
        enabled: typeof body.enabled === 'boolean' ? body.enabled : existing.enabled,
        intakeOpen: typeof body.intakeOpen === 'boolean' ? body.intakeOpen : existing.intakeOpen,
        emailNotificationsEnabled:
          typeof body.emailNotificationsEnabled === 'boolean'
            ? body.emailNotificationsEnabled
            : existing.emailNotificationsEnabled,
        statusBanner:
          body.statusBanner !== undefined
            ? sanitizePlainText(body.statusBanner, 280)
            : existing.statusBanner,
        updatedAt: new Date().toISOString(),
        updatedBy: staffAuth.staffEmail || staffAuth.staffName,
      };

      await firestore.setDocument('job_match_settings', 'config', nextControls, true);
      return jsonResponse({ success: true, controls: nextControls }, 200);
    }

    return jsonResponse({ success: false, error: 'Method Not Allowed' }, 405);
  }

  // ===========================================================================
  // 10. ADMIN DELETE SINGLE JOB MATCH (DELETE /api/job-match/admin/match)
  // ===========================================================================
  if (pathname === '/api/job-match/admin/match' && request.method === 'DELETE') {
    const staffAuth = await authenticateStaffRequest(
      request,
      firestore,
      projectId,
      'delete',
      env.ADMIN_EMAIL,
      securityOverrides
    );
    if (!staffAuth.ok) {
      return jsonResponse({ success: false, error: staffAuth.error }, staffAuth.status);
    }

    const matchId = sanitizePlainText(url.searchParams.get('matchId'), 180);
    if (!matchId) {
      return jsonResponse({ success: false, error: 'matchId is required.' }, 400);
    }

    await firestore.deleteDocument('job_matches', matchId).catch(() => {});
    return jsonResponse({ success: true, deletedMatchId: matchId }, 200);
  }

  return jsonResponse({ success: false, error: 'Endpoint not found.' }, 404);
}

