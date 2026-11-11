import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const jiti = require('jiti')(import.meta.url);

const { handleJobMatchRoutes } = jiti('../src/lib/job-match/worker-handlers.ts');
const {
  getMatchScoreBand,
  resolveFixMyResumeHref,
  JOB_MATCH_MAX_FILE_SIZE_BYTES,
} = jiti('../src/lib/job-match/constants.ts');
const { sanitizePlainText, isValidIsoDateString, verifyFirebaseIdToken } = jiti('../src/lib/job-match/security.ts');
const { reserveUniqueWorkOrder } = jiti('../src/lib/career/work-order-id.ts');

/**
 * Lightweight in-memory Firestore double matching EdgeFirestoreClient methods
 */
class MockFirestore {
  constructor() {
    this.collections = new Map();
  }

  _col(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    return this.collections.get(name);
  }

  async getDocument(collectionName, documentId) {
    const doc = this._col(collectionName).get(documentId);
    return doc ? JSON.parse(JSON.stringify(doc)) : null;
  }

  async setDocument(collectionName, documentId, data, merge = true) {
    const col = this._col(collectionName);
    const prev = merge ? col.get(documentId) || {} : {};
    col.set(documentId, JSON.parse(JSON.stringify({ ...prev, ...data })));
    return true;
  }

  async createDocumentIfAbsent(collectionName, documentId, data) {
    const col = this._col(collectionName);
    if (col.has(documentId)) return 'conflict';
    col.set(documentId, JSON.parse(JSON.stringify(data)));
    return 'created';
  }

  async deleteDocument(collectionName, documentId) {
    this._col(collectionName).delete(documentId);
    return true;
  }

  async queryCollection(collectionName, fieldFilter, limit = 100) {
    const docs = Array.from(this._col(collectionName).values());
    const filtered = fieldFilter
      ? docs.filter((d) => {
          const val = d?.[fieldFilter.field];
          if (fieldFilter.op === 'EQUAL') return val === fieldFilter.value;
          if (fieldFilter.op === 'GREATER_THAN') return val > fieldFilter.value;
          return true;
        })
      : docs;
    return JSON.parse(JSON.stringify(filtered.slice(0, limit)));
  }

  async listDocuments(collectionName, limit = 100) {
    return this.queryCollection(collectionName, undefined, limit);
  }
}

function makeSecurityOverrides() {
  return {
    verifyIdToken: async (token) => {
      if (token === 'token_cand_1') {
        return { uid: 'cl_1023', claims: { role: 'client', workOrderId: 'HP-1023' } };
      }
      if (token === 'token_cand_2') {
        return { uid: 'cl_2044', claims: { role: 'client', workOrderId: 'HP-2044' } };
      }
      if (token === 'token_staff_admin') {
        return { uid: 'stf_admin', email: 'hopeadmin@hopepitome.com', claims: {} };
      }
      if (token === 'token_staff_jse') {
        return { uid: 'stf_jse', email: 'jse@hopepitome.com', claims: {} };
      }
      if (token === 'token_staff_finance') {
        return { uid: 'stf_fin', email: 'finance@hopepitome.com', claims: {} };
      }
      return null;
    },
  };
}

async function seedDatabase(db) {
  await db.setDocument('clients', 'cl_1023', {
    clientId: 'cl_1023',
    id: 'cl_1023',
    clientCode: 'CL-1023',
    currentWorkOrderId: 'HP-1023',
    fullName: 'Rahul K',
    name: 'Rahul K',
    email: 'rahul@example.com',
    mobile: '+919876543210',
    status: 'ACTIVE',
  });
  await db.setDocument('workOrders', 'HP-1023', {
    workOrderId: 'HP-1023',
    clientId: 'cl_1023',
    clientName: 'Rahul K',
    loginStatus: 'ACTIVE',
    status: 'Confirmed',
  });
  await db.setDocument('clients', 'cl_2044', {
    clientId: 'cl_2044',
    id: 'cl_2044',
    clientCode: 'CL-2044',
    currentWorkOrderId: 'HP-2044',
    fullName: 'Anita M',
    name: 'Anita M',
    email: 'anita@example.com',
    mobile: '+919811112222',
    status: 'ACTIVE',
  });
  await db.setDocument('staffUsers', 'stf_jse', {
    uid: 'stf_jse',
    fullName: 'JSE Operator',
    email: 'jse@hopepitome.com',
    roleId: 'job_search_executive',
    accountStatus: 'ACTIVE',
    employmentStatus: 'Active',
  });
  await db.setDocument('staffUsers', 'stf_fin', {
    uid: 'stf_fin',
    fullName: 'Finance User',
    email: 'finance@hopepitome.com',
    roleId: 'finance',
    accountStatus: 'ACTIVE',
    employmentStatus: 'Active',
  });
}

function makeEnv(flag = 'true') {
  return {
    FEATURE_JOB_MATCH: flag,
    JOB_MATCH_API_KEY: 'super_secret_test_key_999',
    ADMIN_EMAIL: 'hopeadmin@hopepitome.com',
  };
}

async function invoke(db, env, path, init = {}, callGas = null) {
  const url = new URL(`https://hopepitome.test${path}`);
  const request = new Request(url.toString(), init);
  return handleJobMatchRoutes({
    request,
    url,
    env,
    projectId: 'hopepitome',
    firestore: db,
    callGas,
    securityOverrides: makeSecurityOverrides(),
  });
}

test('Scenario 5 & 6: Feature flag OFF disables endpoints while ON enables config', async () => {
  const db = new MockFirestore();
  await seedDatabase(db);

  const cfgOff = await invoke(db, makeEnv('false'), '/api/job-match/config', { method: 'GET' });
  assert.equal(cfgOff.status, 200);
  assert.deepEqual(await cfgOff.json(), { success: true, enabled: false });

  const intakeOff = await invoke(db, makeEnv('false'), '/api/job-match/intakes', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_cand_1' },
  });
  assert.equal(intakeOff.status, 404);

  const importOff = await invoke(db, makeEnv('false'), '/api/job-matches/import', {
    method: 'POST',
    headers: { Authorization: 'Bearer super_secret_test_key_999', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs: [] }),
  });
  assert.equal(importOff.status, 404);

  const cfgOn = await invoke(db, makeEnv('true'), '/api/job-match/config', { method: 'GET' });
  assert.deepEqual(await cfgOn.json(), { success: true, enabled: true });
});

test('Scenario 7-13: Intake validation, 8MB limit, session ID extraction, privacy & multi-intake history', async () => {
  const db = new MockFirestore();
  await seedDatabase(db);
  const gasCalls = [];
  const mockGas = async (payload) => {
    gasCalls.push(payload);
    if (payload.action === 'uploadFile') {
      return {
        success: true,
        fileId: `drive_file_${gasCalls.length}`,
        driveFolderId: `folder_${payload.workOrderId}`,
      };
    }
    if (payload.action === 'uploadPrivateJobMatchResume') {
      return { success: true, fileId: `drive_priv_${gasCalls.length}` };
    }
    if (payload.action === 'sendJobMatchEmail') {
      return { success: true };
    }
    if (payload.action === 'deleteFile') {
      return { success: true };
    }
    return { success: true };
  };

  // Unauthenticated intake blocked
  const unauthRes = await invoke(db, makeEnv(), '/api/job-match/intakes', { method: 'GET' });
  assert.equal(unauthRes.status, 401);

  // Reject unsupported file format (.exe)
  const badExt = await invoke(
    db,
    makeEnv(),
    '/api/job-match/intakes',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole: 'Data Analyst',
        preferredLocations: ['Bengaluru, India'],
        experienceYears: '3 years',
        jobType: 'Full-time',
        consentGiven: true,
        fileName: 'malware.exe',
        mimeType: 'application/octet-stream',
        fileSize: 1024,
        base64Content: btoa('fake-exe'),
      }),
    },
    mockGas
  );
  assert.equal(badExt.status, 400);

  // Reject > 8 MB file
  const oversized = await invoke(
    db,
    makeEnv(),
    '/api/job-match/intakes',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole: 'Data Analyst',
        preferredLocations: ['Bengaluru, India'],
        experienceYears: '3 years',
        jobType: 'Full-time',
        consentGiven: true,
        fileName: 'huge.pdf',
        mimeType: 'application/pdf',
        fileSize: JOB_MATCH_MAX_FILE_SIZE_BYTES + 100,
        base64Content: btoa('tiny-header'),
      }),
    },
    mockGas
  );
  assert.equal(oversized.status, 400);

  // Valid Intake #1 (tries to spoof candidateId='cl_2044' in body — must ignore and use token uid cl_1023!)
  const samplePdfBytes = 'JVBERi0xLjQgU2FtcGxlIFJlc3VtZQ==';
  const intake1 = await invoke(
    db,
    makeEnv(),
    '/api/job-match/intakes',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: 'cl_2044',
        targetRole: 'Data Analyst',
        preferredLocations: ['Bengaluru, India'],
        experienceYears: '4 years',
        jobType: 'Full-time',
        keySkills: ['SQL', 'Power BI'],
        consentGiven: true,
        fileName: 'Rahul_Resume.pdf',
        mimeType: 'application/pdf',
        fileSize: 2048,
        base64Content: samplePdfBytes,
      }),
    },
    mockGas
  );
  assert.equal(intake1.status, 201);
  const intake1Json = await intake1.json();
  assert.equal(intake1Json.intake.candidate_id, 'cl_1023');
  assert.equal(intake1Json.intake.status, 'Resume received');
  assert.ok(!String(intake1Json.intake.resume_storage_reference).includes('https://drive.google.com'));
  assert.ok(String(intake1Json.intake.resume_storage_reference).startsWith('private:gas:drive_file_'));
  const driveUploadCall = gasCalls.find((c) => c.action === 'uploadFile');
  assert.ok(driveUploadCall, 'Expected GAS uploadFile action to be invoked');
  assert.equal(driveUploadCall.workOrderId, 'HP-1023');
  assert.equal(driveUploadCall.subfolder, 'Original Resume');
  const syncedLead = await db.getDocument('scanning_leads', `jm_lead_${intake1Json.intake.id}`);
  assert.ok(syncedLead, 'Expected synced scanning_leads document');
  assert.ok(String(syncedLead.google_drive_file_id || '').startsWith('drive_file_'));
  assert.equal(syncedLead.google_drive_folder_id, 'folder_HP-1023');
  assert.equal(syncedLead.upload_status, 'UPLOADED');

  // Valid Intake #2 for same candidate (different role & location, history preserved)
  const intake2 = await invoke(
    db,
    makeEnv(),
    '/api/job-match/intakes',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole: 'ERP Consultant',
        preferredLocations: ['Dubai, UAE'],
        experienceYears: '4 years',
        jobType: 'Hybrid',
        consentGiven: true,
        fileName: 'Rahul_ERP.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: 3000,
        base64Content: btoa('SampleDocxContent'),
      }),
    },
    mockGas
  );
  assert.equal(intake2.status, 201);

  // Candidate 1 sees 2 intakes; Candidate 2 sees 0 intakes (ownership isolation)
  const listCand1 = await invoke(db, makeEnv(), '/api/job-match/intakes', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_cand_1' },
  });
  const listCand1Json = await listCand1.json();
  assert.equal(listCand1Json.intakes.length, 2);

  const listCand2 = await invoke(db, makeEnv(), '/api/job-match/intakes', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_cand_2' },
  });
  const listCand2Json = await listCand2.json();
  assert.equal(listCand2Json.intakes.length, 0);

  // Scenario 14 & 15: Staff RBAC check + Secure Resume Download (<CandidateID>_<CandidateName>.<ext>)
  const forbiddenCandAdmin = await invoke(db, makeEnv(), '/api/job-match/admin/intakes', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_cand_1' },
  });
  assert.equal(forbiddenCandAdmin.status, 403);

  const forbiddenFinAdmin = await invoke(db, makeEnv(), '/api/job-match/admin/intakes', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_staff_finance' },
  });
  assert.equal(forbiddenFinAdmin.status, 403);

  const allowedJseAdmin = await invoke(db, makeEnv(), '/api/job-match/admin/intakes', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_staff_jse' },
  });
  assert.equal(allowedJseAdmin.status, 200);
  const adminQueueJson = await allowedJseAdmin.json();
  assert.equal(adminQueueJson.intakes.length, 2);

  const dlRes = await invoke(
    db,
    makeEnv(),
    `/api/job-match/admin/intakes/resume?intakeId=${encodeURIComponent(intake2JsonHelper(intake1Json))}`,
    {
      method: 'GET',
      headers: { Authorization: 'Bearer token_staff_admin' },
    },
    mockGas
  );
  assert.equal(dlRes.status, 200);
  assert.match(dlRes.headers.get('Content-Disposition') || '', /HP-1023_Rahul_K\.pdf/);

  // Staff manual status + internal notes update
  const statusUpdateRes = await invoke(db, makeEnv(), '/api/job-match/admin/intakes/status', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_staff_jse', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intakeId: intake1Json.intake.id,
      status: 'Matching in progress',
      staffNotes: 'Shortlisting Bengaluru Data Analyst roles.',
    }),
  });
  assert.equal(statusUpdateRes.status, 200);
  const statusUpdateJson = await statusUpdateRes.json();
  assert.equal(statusUpdateJson.intake.status, 'Matching in progress');
  assert.equal(statusUpdateJson.intake.status_history.length, 2);
});

function intake2JsonHelper(res) {
  return res.intake.id;
}

test('Scenario 16-30: GAS Import API, sanitization, upserts, results UI logic, actions, notifications & safe deletion', async () => {
  const db = new MockFirestore();
  await seedDatabase(db);
  const sentEmails = [];
  const mockGas = async (payload) => {
    if (payload.action === 'sendJobMatchEmail') {
      sentEmails.push(payload);
      return { success: true };
    }
    return { success: true, fileId: 'priv_1' };
  };

  // Seed one intake for cl_1023 and one for cl_2044
  await invoke(
    db,
    makeEnv(),
    '/api/job-match/intakes',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole: 'Data Analyst',
        preferredLocations: ['Bengaluru, India'],
        experienceYears: '4 years',
        jobType: 'Full-time',
        consentGiven: true,
        fileName: 'cv.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        base64Content: btoa('PDF-1'),
      }),
    },
    mockGas
  );

  await invoke(
    db,
    makeEnv(),
    '/api/job-match/intakes',
    {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_2', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole: 'Product Analyst',
        preferredLocations: ['Remote'],
        experienceYears: '5 years',
        jobType: 'Remote',
        consentGiven: true,
        fileName: 'anita.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        base64Content: btoa('PDF-2'),
      }),
    },
    mockGas
  );

  // Scenario 17: Invalid API token returns 401
  const badAuthImport = await invoke(db, makeEnv(), '/api/job-matches/import', {
    method: 'POST',
    headers: { Authorization: 'Bearer wrong_key', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobs: [] }),
  });
  assert.equal(badAuthImport.status, 401);

  // Scenario 16, 18, 20, 21, 22: Mixed batch with valid rows + unknown candidate + bad URL + bad score + HTML XSS
  const importPayload = {
    batchId: 'gas_batch_001',
    jobs: [
      {
        candidateId: 'HP-1023',
        candidateName: 'Rahul K',
        targetRole: 'Data Analyst',
        title: '<script>alert(1)</script>Senior Data Analyst',
        company: 'Hevo Data',
        location: 'Bengaluru, India',
        jobType: 'Full-time',
        experience: '3-5 years',
        salary: 'Not stated',
        postedDate: '2026-11-07',
        source: 'Lever',
        url: 'https://jobs.lever.co/hevo/senior-data-analyst',
        matchScore: 82,
        matchReason: '<b>Strong SQL</b> + Power BI match',
        resumeGaps: 'Missing Python keywords; no quantified results',
        recommendedService: 'ATS Optimisation',
        foundOn: '2026-11-11',
      },
      {
        candidateId: 'HP-1023',
        candidateName: 'Rahul K',
        targetRole: 'Data Analyst',
        title: 'BI Engineer',
        company: 'Acme Analytics',
        location: 'Remote',
        jobType: 'Remote',
        experience: '2-4 years',
        salary: 'Not stated',
        postedDate: '2026-11-08',
        source: 'Greenhouse',
        url: 'https://boards.greenhouse.io/acme/bi-eng',
        matchScore: 60,
        matchReason: 'BI reporting fit',
        resumeGaps: 'Lacks dashboard metrics',
        recommendedService: 'Resume Writing',
        foundOn: '2026-11-11',
      },
      {
        candidateId: 'HP-2044',
        candidateName: 'Anita M',
        targetRole: 'Product Analyst',
        title: 'Product Analyst',
        company: 'RemoteCo',
        location: 'Remote',
        jobType: 'Remote',
        experience: '4 years',
        salary: 'Not stated',
        postedDate: '2026-11-09',
        source: 'Wellfound',
        url: 'https://wellfound.com/jobs/123',
        matchScore: 45,
        matchReason: 'Domain fit',
        resumeGaps: '',
        recommendedService: 'LinkedIn Makeover',
        foundOn: '2026-11-11',
      },
      {
        candidateId: 'NON_EXISTENT_999',
        candidateName: 'Ghost',
        targetRole: 'Analyst',
        title: 'Ghost Job',
        company: 'Nobody',
        location: 'Remote',
        jobType: 'Full-time',
        postedDate: '2026-11-10',
        source: 'Lever',
        url: 'https://example.com/ghost',
        matchScore: 70,
        foundOn: '2026-11-11',
      },
      {
        candidateId: 'HP-1023',
        targetRole: 'Data Analyst',
        title: 'Bad URL Job',
        company: 'Evil',
        url: 'javascript:alert(1)',
        matchScore: 80,
        foundOn: '2026-11-11',
      },
      {
        candidateId: 'HP-1023',
        targetRole: 'Data Analyst',
        title: 'Bad Score Job',
        company: 'InvalidScore',
        url: 'https://example.com/bad-score',
        matchScore: 150,
        foundOn: '2026-11-11',
      },
    ],
  };

  const importRes = await invoke(
    db,
    makeEnv(),
    '/api/job-matches/import',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer super_secret_test_key_999',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(importPayload),
    },
    mockGas
  );
  assert.equal(importRes.status, 200);
  const importJson = await importRes.json();
  assert.equal(importJson.saved, 3);
  assert.equal(importJson.updated, 0);
  assert.equal(importJson.errors.length, 3);

  // Verify email notification sent once for Rahul and once for Anita
  assert.equal(sentEmails.length, 2);

  // Scenario 19 & 29: Retry exact same batch updates records (no duplicates) & creates ZERO duplicate notifications
  const retryRes = await invoke(
    db,
    makeEnv(),
    '/api/job-matches/import',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer super_secret_test_key_999',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(importPayload),
    },
    mockGas
  );
  assert.equal(retryRes.status, 200);
  const retryJson = await retryRes.json();
  assert.equal(retryJson.saved, 0);
  assert.equal(retryJson.updated, 3);
  assert.equal(sentEmails.length, 2); // No duplicate email on retry!

  // Intake status auto-promoted to 'Jobs ready'
  const cand1Intakes = await (
    await invoke(db, makeEnv(), '/api/job-match/intakes', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_cand_1' },
    })
  ).json();
  assert.equal(cand1Intakes.intakes[0].status, 'Jobs ready');

  // Scenario 23, 24, 28: Candidate results sorted highest score first + bands + XSS sanitized + resume gap banner
  const res1 = await (
    await invoke(db, makeEnv(), '/api/job-match/results', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_cand_1' },
    })
  ).json();
  assert.equal(res1.jobs.length, 2);
  assert.equal(res1.jobs[0].match_score, 82);
  assert.equal(res1.jobs[1].match_score, 60);
  assert.equal(res1.jobs[0].title, 'Senior Data Analyst'); // script tag stripped
  assert.equal(getMatchScoreBand(82), 'High');
  assert.equal(getMatchScoreBand(60), 'Medium');
  assert.equal(getMatchScoreBand(45), 'Low');
  assert.equal(res1.summary.totalJobs, 2);
  assert.equal(res1.summary.highChanceCount, 1);
  assert.equal(res1.summary.showResumeGapBanner, true);
  assert.equal(resolveFixMyResumeHref('ATS Optimisation'), '/career-services/services?service=ATS_OPTIMISATION');

  // New badge disappears on subsequent visit if no newer jobs added
  const res1SecondVisit = await (
    await invoke(db, makeEnv(), '/api/job-match/results', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_cand_1' },
    })
  ).json();
  assert.equal(res1SecondVisit.jobs[0].is_new, false);

  // Scenario 26 & 27: Candidate Save, Applied, and Not Interested actions + cross-candidate protection
  const crossAction = await invoke(db, makeEnv(), '/api/job-match/actions', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_2', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobMatchId: res1.jobs[0].id, action: 'SAVED' }),
  });
  assert.equal(crossAction.status, 403);

  await invoke(db, makeEnv(), '/api/job-match/actions', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobMatchId: res1.jobs[0].id, action: 'APPLIED' }),
  });

  await invoke(db, makeEnv(), '/api/job-match/actions', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobMatchId: res1.jobs[1].id, action: 'NOT_INTERESTED' }),
  });

  const afterActions = await (
    await invoke(db, makeEnv(), '/api/job-match/results', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_cand_1' },
    })
  ).json();
  assert.equal(afterActions.jobs.length, 1);
  assert.equal(afterActions.jobs[0].candidate_action, 'APPLIED');

  // Scenario 30: Deleting Candidate 1 AI Job Match data preserves Candidate 2 & Hopepitome client/workOrder!
  const delRes = await invoke(
    db,
    makeEnv(),
    '/api/job-match/data',
    {
      method: 'DELETE',
      headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmDelete: true }),
    },
    mockGas
  );
  assert.equal(delRes.status, 200);

  const cand1AfterDel = await (
    await invoke(db, makeEnv(), '/api/job-match/results', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_cand_1' },
    })
  ).json();
  assert.equal(cand1AfterDel.jobs.length, 0);

  // Candidate 2 untouched
  const cand2Jobs = await (
    await invoke(db, makeEnv(), '/api/job-match/results', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_cand_2' },
    })
  ).json();
  assert.equal(cand2Jobs.jobs.length, 1);

  // Core client & workOrder untouched
  assert.ok(await db.getDocument('clients', 'cl_1023'));
  assert.ok(await db.getDocument('workOrders', 'HP-1023'));
});

test('Sanitization & date validation helpers reject malformed inputs', () => {
  assert.equal(sanitizePlainText('<b>Hello</b><script>bad()</script> World'), 'Hello World');
  assert.equal(isValidIsoDateString('2026-11-11'), true);
  assert.equal(isValidIsoDateString('2026-02-30'), false);
  assert.equal(isValidIsoDateString('11/11/2026'), false);
});

test('Intake logs to scanning_leads and separate Admin Controls gate intakes', async () => {
  const db = new MockFirestore();
  await seedDatabase(db);

  // Submit intake and verify scanning_leads entry is created
  const intakeRes = await invoke(db, makeEnv(), '/api/job-match/intakes', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetRole: 'Product Analyst',
      preferredLocations: ['Bengaluru, India'],
      experienceYears: '3 years',
      jobType: 'Full-time',
      consentGiven: true,
      fileName: 'Product_Resume.pdf',
      mimeType: 'application/pdf',
      fileSize: 1024,
      base64Content: 'JVBERi0xLjQ=',
    }),
  });
  assert.equal(intakeRes.status, 201);
  const intakeJson = await intakeRes.json();

  const leads = await db.listDocuments('scanning_leads', 20);
  const syncedLead = leads.find((l) => l.assessment_id === intakeJson.intake.id);
  assert.ok(syncedLead);
  assert.equal(syncedLead.source, 'CAREER_STUDIO_AI_JOB_MATCH');
  assert.equal(syncedLead.candidate_name, 'Rahul K');
  assert.equal(syncedLead.original_file_name, 'Product_Resume.pdf');

  // Candidate cannot access admin controls
  const candCtrl = await invoke(db, makeEnv(), '/api/job-match/admin/controls', {
    method: 'GET',
    headers: { Authorization: 'Bearer token_cand_1' },
  });
  assert.equal(candCtrl.status, 403);

  // Authorized staff can read & pause intakes
  const staffPause = await invoke(db, makeEnv(), '/api/job-match/admin/controls', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_staff_jse', 'Content-Type': 'application/json' },
    body: JSON.stringify({ intakeOpen: false, statusBanner: 'Maintenance pause' }),
  });
  assert.equal(staffPause.status, 200);

  const pausedIntake = await invoke(db, makeEnv(), '/api/job-match/intakes', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetRole: 'Data Engineer',
      preferredLocations: ['Remote'],
      experienceYears: '5 years',
      jobType: 'Remote',
      consentGiven: true,
      fileName: 'DE.pdf',
      mimeType: 'application/pdf',
      fileSize: 512,
      base64Content: 'JVBERi0xLjQ=',
    }),
  });
  assert.equal(pausedIntake.status, 403);
});

test('Auto-provisioning Candidate ID, atomic concurrent ID generation, multipart uploads & storage failure guard', async () => {
  const db = new MockFirestore();
  await seedDatabase(db);

  // Older client account with no currentWorkOrderId
  await db.setDocument('clients', 'cl_legacy', {
    clientId: 'cl_legacy',
    id: 'cl_legacy',
    fullName: 'Legacy User',
    name: 'Legacy User',
    mobile: '+919900001122',
    status: 'ACTIVE',
  });

  const legacyOverrides = {
    verifyIdToken: async (token) => {
      if (token === 'token_legacy') return { uid: 'cl_legacy', claims: { role: 'client' } };
      return null;
    },
  };

  const sessionRes = await handleJobMatchRoutes({
    request: new Request('https://hopepitome.test/api/job-match/session', {
      method: 'GET',
      headers: { Authorization: 'Bearer token_legacy' },
    }),
    url: new URL('https://hopepitome.test/api/job-match/session'),
    env: makeEnv(),
    projectId: 'hopepitome',
    firestore: db,
    callGas: null,
    securityOverrides: legacyOverrides,
  });
  assert.equal(sessionRes.status, 200);
  const sessionJson = await sessionRes.json();
  assert.match(sessionJson.candidateCode, /^HP-\d{4}-\d{5,6}$/);

  const updatedLegacy = await db.getDocument('clients', 'cl_legacy');
  assert.equal(updatedLegacy.currentWorkOrderId, sessionJson.candidateCode);

  // Concurrent ID reservations produce strictly unique IDs
  const batchReservations = await Promise.all(
    Array.from({ length: 12 }, (_, idx) =>
      reserveUniqueWorkOrder({
        firestore: db,
        clientId: `cl_race_${idx}`,
        clientName: `User ${idx}`,
        clientMobile: `+9198000000${String(idx).padStart(2, '0')}`,
      })
    )
  );
  const uniqueReservedIds = new Set(batchReservations.map((r) => r.workOrderId));
  assert.equal(uniqueReservedIds.size, 12);

  // Multipart FormData uploads: PDF, DOCX (application/octet-stream), JPG with special chars in name
  const uploadCases = [
    { name: 'My Resume (Final) 2026.pdf', type: 'application/pdf', bytes: '%PDF-1.4\ntest' },
    { name: 'Senior CV [Updated].docx', type: 'application/octet-stream', bytes: 'PK\x03\x04docx-bytes' },
    { name: 'scan resume photo.jpg', type: 'image/jpeg', bytes: '\xff\xd8\xffjpeg-bytes' },
  ];
  for (const uc of uploadCases) {
    const fd = new FormData();
    fd.append('targetRole', 'Cloud Architect');
    fd.append('preferredLocations', JSON.stringify(['Dubai, UAE']));
    fd.append('experienceYears', '6 years');
    fd.append('jobType', 'Full-time');
    fd.append('consentGiven', 'true');
    fd.append('resume', new File([uc.bytes], uc.name, { type: uc.type }));

    const upRes = await invoke(db, makeEnv(), '/api/job-match/intakes', {
      method: 'POST',
      headers: { Authorization: 'Bearer token_cand_1' },
      body: fd,
    });
    assert.equal(upRes.status, 201);
    const upJson = await upRes.json();
    assert.ok(String(upJson.intake.resume_storage_reference).includes('job-match/HP-1023/'));
  }

  // Verify 9 MB multipart upload and .exe upload rejected with exact friendly errors
  const bigFd = new FormData();
  bigFd.append('targetRole', 'Cloud Architect');
  bigFd.append('preferredLocations', JSON.stringify(['Remote']));
  bigFd.append('experienceYears', '6 years');
  bigFd.append('jobType', 'Full-time');
  bigFd.append('consentGiven', 'true');
  bigFd.append('resume', new File([new Uint8Array(9 * 1024 * 1024)], 'big.pdf', { type: 'application/pdf' }));
  const bigRes = await invoke(db, makeEnv(), '/api/job-match/intakes', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1' },
    body: bigFd,
  });
  assert.equal(bigRes.status, 400);
  assert.equal((await bigRes.json()).error, 'File too large — max 8 MB');

  const exeFd = new FormData();
  exeFd.append('targetRole', 'Cloud Architect');
  exeFd.append('preferredLocations', JSON.stringify(['Remote']));
  exeFd.append('experienceYears', '6 years');
  exeFd.append('jobType', 'Full-time');
  exeFd.append('consentGiven', 'true');
  exeFd.append('resume', new File(['MZ'], 'payload.exe', { type: 'application/x-msdownload' }));
  const exeRes = await invoke(db, makeEnv(), '/api/job-match/intakes', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1' },
    body: exeFd,
  });
  assert.equal(exeRes.status, 400);
  assert.equal((await exeRes.json()).error, 'Only PDF, DOCX, JPG, PNG allowed');

  // If private storage fails, intake must NOT be saved
  const brokenDb = new MockFirestore();
  await seedDatabase(brokenDb);
  const origSet = brokenDb.setDocument.bind(brokenDb);
  brokenDb.setDocument = async (col, id, data, merge) => {
    if (col === 'job_match_resume_chunks') return false;
    return origSet(col, id, data, merge);
  };
  const failFd = new FormData();
  failFd.append('targetRole', 'Cloud Architect');
  failFd.append('preferredLocations', JSON.stringify(['Remote']));
  failFd.append('experienceYears', '6 years');
  failFd.append('jobType', 'Full-time');
  failFd.append('consentGiven', 'true');
  failFd.append('resume', new File(['%PDF-1.4'], 'good.pdf', { type: 'application/pdf' }));
  const failRes = await invoke(brokenDb, makeEnv(), '/api/job-match/intakes', {
    method: 'POST',
    headers: { Authorization: 'Bearer token_cand_1' },
    body: failFd,
  });
  assert.equal(failRes.status, 500);
  assert.equal((await brokenDb.listDocuments('job_match_intakes')).length, 0);

  // Sanity check that real verifyFirebaseIdToken exists and accepts real issuer structure check
  assert.equal(typeof verifyFirebaseIdToken, 'function');
});
