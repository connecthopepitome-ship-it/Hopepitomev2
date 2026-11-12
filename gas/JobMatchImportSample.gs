/**
 * HOPEPITOME CAREER SERVICES — 100% AUTOMATIC AI JOB MATCH GOOGLE SHEET SYNC
 *
 * Fully automatic 2-way sync (zero manual pushes needed after initial setup):
 *   1. Portal -> Sheet (`CandidateIntakes` tab): automatically pulls submitted candidate
 *      intakes so Claude / your matching workflow always sees new candidates & targets.
 *   2. Sheet -> Web UI (`MatchedJobs` tab): automatically pushes new or updated job
 *      rows written by Claude straight to the Candidate Portal (`/job-match/results`),
 *      using both an installable `onChange` trigger (near real-time) and a 1-minute
 *      polling trigger (catches API / Claude edits where `onEdit` does not fire).
 *
 * One-Time Setup:
 *   1. Paste this entire file into Extensions -> Apps Script (`Code.gs`), Save, and reload the Sheet.
 *   2. In the Spreadsheet menu click:
 *        Hopepitome Job Match -> Configure API Key & URL
 *      and paste `JOB_MATCH_API_KEY` (from Hopepitomev2/.env.local line 23).
 *   3. Click:
 *        Hopepitome Job Match -> Setup Sheets & Enable Auto-Sync
 *      Approve Google permissions once. Both `onChange` and 1-minute auto-sync triggers
 *      are installed programmatically — no manual sync clicks are required afterwards.
 */

var JOB_MATCH_SHEET_NAME = 'MatchedJobs';
var CANDIDATE_INTAKES_SHEET_NAME = 'CandidateIntakes';
var JOB_MATCH_BATCH_SIZE = 50; // Keeps Cloudflare Worker subrequests & GAS execution well within limits
var DEFAULT_HOPEPITOME_IMPORT_URL = 'https://hopepitomev2.connect-hopepitome.workers.dev/api/job-matches/import';
var ROW_DIGESTS_PROP_KEY = 'JOB_MATCH_ROW_DIGESTS_V1';
var MAX_STORED_DIGESTS = 300;
var INTAKE_PULL_MIN_INTERVAL_MS = 60 * 1000; // Pull new candidate intakes at most once per minute

var JOB_MATCH_HEADERS = [
  'candidateId',
  'candidateName',
  'targetRole',
  'title',
  'company',
  'location',
  'jobType',
  'experience',
  'salary',
  'postedDate',
  'source',
  'url',
  'matchScore',
  'matchReason',
  'resumeGaps',
  'recommendedService',
  'foundOn',
  'SyncStatus',
  'LastSyncedAt',
];

var CANDIDATE_INTAKES_HEADERS = [
  'intakeReference',
  'candidateId',
  'candidateName',
  'targetRole',
  'preferredLocations',
  'experienceYears',
  'jobType',
  'currentSalary',
  'expectedSalary',
  'noticePeriod',
  'keySkills',
  'resumeFilename',
  'driveFileId',
  'status',
  'submittedAt',
  'LastPulledAt',
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Hopepitome Job Match')
    .addItem('Setup Sheets & Enable Auto-Sync', 'setupAndEnableAutoSync')
    .addItem('Configure API Key & URL', 'configureJobMatchConnection')
    .addItem('Run Auto-Sync Now (Optional)', 'syncMatchedJobsToPortal')
    .addToUi();
}

/**
 * Prompts once for API key & URL from inside Google Sheets (no Project Settings hunting required).
 */
function configureJobMatchConnection() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var currentUrl = props.getProperty('HOPEPITOME_IMPORT_URL') || DEFAULT_HOPEPITOME_IMPORT_URL;
  var urlResp = ui.prompt(
    'Hopepitome Import URL',
    'Confirm or enter HOPEPITOME_IMPORT_URL (leave blank to keep default):',
    ui.ButtonSet.OK_CANCEL
  );
  if (urlResp.getSelectedButton() !== ui.Button.OK) return;
  var chosenUrl = String(urlResp.getResponseText() || '').trim() || currentUrl;

  var keyResp = ui.prompt(
    'Hopepitome Job Match API Key',
    'Paste JOB_MATCH_API_KEY (from Hopepitomev2/.env.local line 23):',
    ui.ButtonSet.OK_CANCEL
  );
  if (keyResp.getSelectedButton() !== ui.Button.OK) return;
  var chosenKey = String(keyResp.getResponseText() || '').trim();
  if (!chosenKey) {
    ui.alert('JOB_MATCH_API_KEY cannot be blank.');
    return;
  }

  props.setProperties({
    HOPEPITOME_IMPORT_URL: chosenUrl,
    JOB_MATCH_API_KEY: chosenKey,
  });
  ui.alert('Saved! Now click Hopepitome Job Match -> Setup Sheets & Enable Auto-Sync.');
}

/**
 * Sets up both tabs AND automatically installs background + onChange triggers
 * so Claude updates auto-push to the web UI with zero manual clicks.
 */
function setupAndEnableAutoSync() {
  setupJobMatchSheet();
  enableAutoSyncTriggers_();

  var props = PropertiesService.getScriptProperties();
  var apiKey = String(props.getProperty('JOB_MATCH_API_KEY') || '').trim();
  if (apiKey) {
    syncMatchedJobsToPortal();
  }

  try {
    SpreadsheetApp.getUi().alert(
      apiKey
        ? 'All set! Sheets configured, automatic triggers enabled (On-Change + Every 1 Minute), and initial sync completed.'
        : 'Sheets created and auto-triggers enabled! Next, click Hopepitome Job Match -> Configure API Key & URL so sync can authenticate.'
    );
  } catch (e) {}
}

/**
 * Backwards-compatible alias if someone calls setupJobMatchSheet() directly.
 */
function setupJobMatchSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = ss.getSheetByName(JOB_MATCH_SHEET_NAME);
  if (!sheet) {
    var firstSheet = ss.getSheets()[0];
    if (
      firstSheet &&
      ss.getSheets().length === 1 &&
      firstSheet.getLastRow() === 0 &&
      (firstSheet.getName() === 'Sheet1' || firstSheet.getName() === 'Machedjob')
    ) {
      firstSheet.setName(JOB_MATCH_SHEET_NAME);
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet(JOB_MATCH_SHEET_NAME);
    }
  }

  var existingLastRow = sheet.getLastRow();
  markSelfWriting_();
  var headerRange = sheet.getRange(1, 1, 1, JOB_MATCH_HEADERS.length);
  headerRange.setValues([JOB_MATCH_HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0f172a');
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  sheet.getRange(2, 10, 500, 1).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(2, 17, 500, 1).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(2, 13, 500, 1).setNumberFormat('0');

  var jobTypeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'Hybrid'], true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, 7, 500, 1).setDataValidation(jobTypeRule);

  var serviceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(
      ['ATS Optimisation', 'Resume Writing', 'LinkedIn Makeover', 'Portfolio Website', 'Managed Job Search'],
      true
    )
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, 16, 500, 1).setDataValidation(serviceRule);

  if (existingLastRow === 0) {
    sheet.getRange(1, 1).setNote('Required: Candidate ID (e.g. HP-2026-10234)');
    sheet.getRange(1, 10).setNote('Format: YYYY-MM-DD (e.g. 2026-11-11)');
    sheet.getRange(1, 12).setNote('Required: Must start with https:// or http://');
    sheet.getRange(1, 13).setNote('Required: Integer 0 to 100');
    sheet.getRange(1, 17).setNote('Format: YYYY-MM-DD (defaults to today if blank)');
    sheet.getRange(1, 18).setNote('Auto-managed: becomes SYNCED automatically after pushing to Portal');
  }

  sheet.autoResizeColumns(1, JOB_MATCH_HEADERS.length);
  ensureCandidateIntakesSheet_(ss);
  SpreadsheetApp.flush();
}

function enableAutoSyncTriggers_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var triggers = ScriptApp.getProjectTriggers();

  // Remove duplicates so we always maintain exactly 1 time trigger + 1 onChange trigger
  triggers.forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (
      fn === 'syncMatchedJobsToPortal' ||
      fn === 'onSheetChangeAutoSync' ||
      fn === 'pullCandidateIntakesFromPortal'
    ) {
      ScriptApp.deleteTrigger(t);
    }
  });

  // 1. Near-instant push whenever Claude / API / human inserts or changes sheet rows
  ScriptApp.newTrigger('onSheetChangeAutoSync')
    .forSpreadsheet(ss)
    .onChange()
    .create();

  // 2. Guaranteed 1-minute background sync (catches Sheets API writes that bypass change triggers + pulls CandidateIntakes)
  ScriptApp.newTrigger('syncMatchedJobsToPortal')
    .timeBased()
    .everyMinutes(1)
    .create();
}

function ensureCandidateIntakesSheet_(ss) {
  var intakeSheet = ss.getSheetByName(CANDIDATE_INTAKES_SHEET_NAME);
  if (!intakeSheet) {
    intakeSheet = ss.insertSheet(CANDIDATE_INTAKES_SHEET_NAME);
  }
  var intakeHeader = intakeSheet.getRange(1, 1, 1, CANDIDATE_INTAKES_HEADERS.length);
  intakeHeader.setValues([CANDIDATE_INTAKES_HEADERS]);
  intakeHeader.setFontWeight('bold');
  intakeHeader.setBackground('#173B8F');
  intakeHeader.setFontColor('#ffffff');
  intakeSheet.setFrozenRows(1);
  intakeSheet.autoResizeColumns(1, CANDIDATE_INTAKES_HEADERS.length);
  return intakeSheet;
}

function resolveImportUrl_(props) {
  return String(props.getProperty('HOPEPITOME_IMPORT_URL') || DEFAULT_HOPEPITOME_IMPORT_URL).trim();
}

function resolveIntakesUrl_(props) {
  var explicit = props.getProperty('HOPEPITOME_INTAKES_URL');
  if (explicit) return explicit;
  var importUrl = resolveImportUrl_(props);
  if (importUrl.indexOf('/api/job-matches/import') !== -1) {
    return importUrl.replace('/api/job-matches/import', '/api/job-matches/intakes');
  }
  return importUrl.replace(/\/+$/, '') + '/api/job-matches/intakes';
}

function formatSheetDateValue_(val, timeZone) {
  if (val === null || val === undefined || val === '') return '';
  if (Object.prototype.toString.call(val) === '[object Date]' && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, timeZone || 'UTC', 'yyyy-MM-dd');
  }
  return String(val).trim();
}

function parseMatchScore_(rawVal) {
  var cleaned = String(rawVal === null || rawVal === undefined ? '0' : rawVal).replace('%', '').trim();
  var num = Number(cleaned);
  if (!isFinite(num)) return 0;
  // Handle Google Sheets percentage auto-formatting (e.g. 0.85 -> 85)
  if (num > 0 && num < 1) {
    return Math.round(num * 100);
  }
  return Math.round(num);
}

function markSelfWriting_() {
  try {
    CacheService.getScriptCache().put('JM_SELF_WRITING', '1', 15);
  } catch (e) {}
}

function isSelfWriting_() {
  try {
    return CacheService.getScriptCache().get('JM_SELF_WRITING') === '1';
  } catch (e) {
    return false;
  }
}

function computeRowDigest_(jobObj) {
  var canonical = [
    jobObj.candidateId,
    jobObj.candidateName,
    jobObj.targetRole,
    jobObj.title,
    jobObj.company,
    jobObj.location,
    jobObj.jobType,
    jobObj.experience,
    jobObj.salary,
    jobObj.postedDate,
    jobObj.source,
    jobObj.url,
    String(jobObj.matchScore),
    jobObj.matchReason,
    jobObj.resumeGaps,
    jobObj.recommendedService,
    jobObj.foundOn,
  ].join('|');

  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, canonical, Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < bytes.length; i++) {
    var b = bytes[i];
    if (b < 0) b += 256;
    var s = b.toString(16);
    if (s.length === 1) s = '0' + s;
    hex += s;
  }
  return hex.slice(0, 12);
}

function loadRowDigests_(props) {
  try {
    var raw = props.getProperty(ROW_DIGESTS_PROP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveRowDigests_(props, digests) {
  var keys = Object.keys(digests);
  if (keys.length > MAX_STORED_DIGESTS) {
    var trimmed = {};
    var start = keys.length - MAX_STORED_DIGESTS;
    for (var i = start; i < keys.length; i++) {
      trimmed[keys[i]] = digests[keys[i]];
    }
    digests = trimmed;
  }
  props.setProperty(ROW_DIGESTS_PROP_KEY, JSON.stringify(digests));
}

function rowKeyFor_(candidateId, url) {
  return String(candidateId).trim().toUpperCase() + '|' + String(url).trim().slice(0, 180);
}

/**
 * Triggered immediately when rows are added/edited in the Sheet.
 * Ignores writes performed by this script itself so there are never feedback loops.
 */
function onSheetChangeAutoSync(e) {
  if (isSelfWriting_()) return;
  var changeType = e && e.changeType ? String(e.changeType) : '';
  if (changeType === 'FORMAT') return;

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    pushMatchedJobsToPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

/**
 * Main 1-minute automatic sync loop (pulls new CandidateIntakes AND pushes new/updated MatchedJobs).
 */
function syncMatchedJobsToPortal() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    Logger.log('Another sync is already running. Skipping.');
    return;
  }
  try {
    pullCandidateIntakesIfDue_();
    pushMatchedJobsToPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

function pullCandidateIntakesFromPortal() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    pullCandidateIntakesFromPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

function pullCandidateIntakesIfDue_() {
  var cache = CacheService.getScriptCache();
  try {
    if (cache.get('JM_LAST_INTAKE_PULL')) return;
    pullCandidateIntakesFromPortalInner_();
    cache.put('JM_LAST_INTAKE_PULL', '1', Math.floor(INTAKE_PULL_MIN_INTERVAL_MS / 1000));
  } catch (err) {
    Logger.log('CandidateIntakes pull warning: ' + (err && err.message ? err.message : err));
  }
}

function pullCandidateIntakesFromPortalInner_() {
  var props = PropertiesService.getScriptProperties();
  var intakesUrl = resolveIntakesUrl_(props);
  var apiKey = String(props.getProperty('JOB_MATCH_API_KEY') || '').trim();

  if (!apiKey) {
    throw new Error('Missing JOB_MATCH_API_KEY in Script Properties (click Hopepitome Job Match -> Configure API Key & URL).');
  }

  var response = UrlFetchApp.fetch(intakesUrl, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + apiKey,
    },
    muteHttpExceptions: true,
  });

  var code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('Intakes pull API failed with HTTP ' + code + ': ' + response.getContentText());
  }

  var result = JSON.parse(response.getContentText() || '{}');
  var intakes = Array.isArray(result.intakes) ? result.intakes : [];

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ensureCandidateIntakesSheet_(ss);

  var existingValues = sheet.getDataRange().getValues();
  var headers = existingValues[0].map(function (h) {
    return String(h || '').trim();
  });
  var refColIdx = headers.indexOf('intakeReference');
  if (refColIdx < 0) refColIdx = 0;

  var existingRowByRef = {};
  var existingRowDataByRef = {};
  for (var r = 1; r < existingValues.length; r++) {
    var ref = String(existingValues[r][refColIdx] || '').trim();
    if (ref) {
      existingRowByRef[ref] = r + 1;
      existingRowDataByRef[ref] = existingValues[r];
    }
  }

  var nowIso = new Date().toISOString();
  var appended = 0;
  var updated = 0;

  intakes.forEach(function (item) {
    var key = String(item.intakeReference || '').trim();
    if (!key) return;

    var coreFields = [
      String(item.intakeReference || ''),
      String(item.candidateId || ''),
      String(item.candidateName || ''),
      String(item.targetRole || ''),
      String(item.preferredLocations || ''),
      String(item.experienceYears || ''),
      String(item.jobType || ''),
      String(item.currentSalary || ''),
      String(item.expectedSalary || ''),
      String(item.noticePeriod || ''),
      String(item.keySkills || ''),
      String(item.resumeFilename || ''),
      String(item.driveFileId || ''),
      String(item.status || ''),
      String(item.submittedAt || ''),
    ];

    var existingRow = existingRowByRef[key];
    if (existingRow) {
      var prev = existingRowDataByRef[key];
      var changed = false;
      for (var c = 0; c < coreFields.length; c++) {
        if (String(prev[c] || '') !== coreFields[c]) {
          changed = true;
          break;
        }
      }
      if (changed) {
        markSelfWriting_();
        sheet.getRange(existingRow, 1, 1, CANDIDATE_INTAKES_HEADERS.length).setValues([coreFields.concat([nowIso])]);
        updated += 1;
      }
    } else {
      markSelfWriting_();
      sheet.appendRow(coreFields.concat([nowIso]));
      existingRowByRef[key] = sheet.getLastRow();
      appended += 1;
    }
  });

  if (appended > 0) {
    markSelfWriting_();
    sheet.autoResizeColumns(1, CANDIDATE_INTAKES_HEADERS.length);
  }
  if (appended > 0 || updated > 0) {
    SpreadsheetApp.flush();
    Logger.log('CandidateIntakes synced — Appended: ' + appended + ', Updated: ' + updated);
  }
}

function pushMatchedJobsToPortalInner_() {
  var props = PropertiesService.getScriptProperties();
  var endpointUrl = resolveImportUrl_(props);
  var apiKey = String(props.getProperty('JOB_MATCH_API_KEY') || '').trim();

  if (!apiKey) {
    throw new Error('Missing JOB_MATCH_API_KEY in Script Properties (click Hopepitome Job Match -> Configure API Key & URL).');
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(JOB_MATCH_SHEET_NAME);
  if (!sheet) return;

  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  var timeZone = ss.getSpreadsheetTimeZone() || 'UTC';
  var headers = rows[0].map(function (h) {
    return String(h || '').trim();
  });

  var col = function (name) {
    return headers.indexOf(name);
  };

  var missing = JOB_MATCH_HEADERS.filter(function (h) {
    return headers.indexOf(h) < 0;
  });
  if (missing.length) {
    throw new Error('Missing column(s): ' + missing.join(', ') + '. Run "Setup Sheets & Enable Auto-Sync" again.');
  }

  var digests = loadRowDigests_(props);
  var jobs = [];
  var syncedRowIndexes = [];
  var syncedRowKeys = [];
  var syncedRowDigests = [];

  for (var i = 1; i < rows.length && jobs.length < JOB_MATCH_BATCH_SIZE; i++) {
    var row = rows[i];
    var candidateId = String(row[col('candidateId')] || '').trim();
    var targetRole = String(row[col('targetRole')] || '').trim();
    var title = String(row[col('title')] || '').trim();
    var company = String(row[col('company')] || '').trim();
    var url = String(row[col('url')] || '').trim();

    // Skip blank or partially written draft rows until Claude fills required job fields
    if (!candidateId || !targetRole || !title || !company || !url) continue;

    var jobObj = {
      candidateId: candidateId,
      candidateName: String(row[col('candidateName')] || '').trim(),
      targetRole: targetRole,
      title: title,
      company: company,
      location: String(row[col('location')] || '').trim(),
      jobType: String(row[col('jobType')] || 'Full-time').trim(),
      experience: String(row[col('experience')] || 'Not stated').trim(),
      salary: String(row[col('salary')] || 'Not stated').trim(),
      postedDate: formatSheetDateValue_(row[col('postedDate')], timeZone),
      source: String(row[col('source')] || '').trim(),
      url: url,
      matchScore: parseMatchScore_(row[col('matchScore')]),
      matchReason: String(row[col('matchReason')] || '').trim(),
      resumeGaps: String(row[col('resumeGaps')] || '').trim(),
      recommendedService: String(row[col('recommendedService')] || 'ATS Optimisation').trim(),
      foundOn: formatSheetDateValue_(row[col('foundOn')], timeZone),
    };

    var key = rowKeyFor_(candidateId, url);
    var digest = computeRowDigest_(jobObj);

    var syncColIdx = col('SyncStatus');
    var status = syncColIdx >= 0 ? String(row[syncColIdx] || '').trim().toUpperCase() : '';

    // Skip if already ERROR: unless Claude edited any cell in the row (digest changed) or cleared status
    if (status.indexOf('ERROR') === 0 && digests[key] === digest) continue;

    // Skip if already SYNCED AND row fields are unchanged; if Claude updated ANY field, auto-push update!
    if (status === 'SYNCED' && digests[key] === digest) continue;

    jobs.push(jobObj);
    syncedRowIndexes.push(i + 1);
    syncedRowKeys.push(key);
    syncedRowDigests.push(digest);
  }

  if (jobs.length === 0) return;

  var payload = {
    batchId: 'gas_' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMdd_HHmmss'),
    jobs: jobs,
  };

  var response = UrlFetchApp.fetch(endpointUrl, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + apiKey,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    throw new Error('Import API failed with HTTP ' + code + ': ' + response.getContentText());
  }

  var result = JSON.parse(response.getContentText() || '{}');
  Logger.log('Auto-pushed Saved: ' + result.saved + ', Updated: ' + result.updated + ', Errors: ' + (result.errors || []).length);

  var syncCol = col('SyncStatus') + 1;
  var lastSyncedCol = col('LastSyncedAt') + 1;
  var nowIso = new Date().toISOString();

  var errorIndexes = {};
  (result.errors || []).forEach(function (err) {
    errorIndexes[err.index] = err.message;
  });

  markSelfWriting_();
  syncedRowIndexes.forEach(function (sheetRow, idx) {
    digests[syncedRowKeys[idx]] = syncedRowDigests[idx];
    if (syncCol > 0) {
      sheet.getRange(sheetRow, syncCol).setValue(errorIndexes[idx] ? 'ERROR: ' + errorIndexes[idx] : 'SYNCED');
    }
    if (lastSyncedCol > 0 && !errorIndexes[idx]) {
      sheet.getRange(sheetRow, lastSyncedCol).setValue(nowIso);
    }
  });
  saveRowDigests_(props, digests);
  SpreadsheetApp.flush();
}
