/**
 * HOPEPITOME CAREER SERVICES — STANDALONE AI JOB MATCH GOOGLE SHEET SYNC
 *
 * Supports 2-way sync in a single dedicated Google Sheet:
 *   1. `CandidateIntakes` tab (Portal -> Google Sheet): pulls candidate AI Job Match
 *      intake submissions automatically without duplicating existing rows.
 *   2. `MatchedJobs` tab (Google Sheet -> Portal): pushes matched job rows back
 *      to the Candidate Portal results page.
 *
 * Quick Setup:
 *   1. Open https://sheets.new and name it e.g. "Hopepitome AI Job Match Sync".
 *   2. Open Extensions -> Apps Script, paste this file, and save.
 *   3. Reload the spreadsheet and click:
 *        Hopepitome Job Match -> Setup "MatchedJobs" & "CandidateIntakes" Sheets
 *      (or run `setupJobMatchSheet()` once from the Apps Script editor).
 *   4. In Apps Script -> Project Settings -> Script Properties, add:
 *        HOPEPITOME_IMPORT_URL = "https://hopepitomev2.connect-hopepitome.workers.dev/api/job-matches/import"
 *        JOB_MATCH_API_KEY     = "<value from Hopepitomev2/.env.local / Cloudflare secret>"
 *   5. In Apps Script -> Triggers, add a Time-driven trigger (Every 15 minutes)
 *      for `syncMatchedJobsToPortal` (pulls new CandidateIntakes AND pushes pending MatchedJobs).
 */

var JOB_MATCH_SHEET_NAME = 'MatchedJobs';
var CANDIDATE_INTAKES_SHEET_NAME = 'CandidateIntakes';
var JOB_MATCH_BATCH_SIZE = 50; // Keeps Cloudflare Worker subrequests & GAS execution well within limits
var DEFAULT_HOPEPITOME_IMPORT_URL = 'https://hopepitomev2.connect-hopepitome.workers.dev/api/job-matches/import';

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
    .addItem('Setup "MatchedJobs" & "CandidateIntakes" Sheets', 'setupJobMatchSheet')
    .addItem('Configure API Key & URL', 'configureJobMatchConnection')
    .addItem('Sync Both Ways Now', 'syncMatchedJobsToPortal')
    .addItem('Pull Candidate Intakes from Portal', 'pullCandidateIntakesFromPortal')
    .addItem('Push Pending Matched Jobs to Portal', 'pushMatchedJobsOnly')
    .addToUi();
}

function configureJobMatchConnection() {
  var ui = SpreadsheetApp.getUi();
  var props = PropertiesService.getScriptProperties();

  var currentUrl = props.getProperty('HOPEPITOME_IMPORT_URL') || DEFAULT_HOPEPITOME_IMPORT_URL;
  var urlResp = ui.prompt(
    'Hopepitome Import URL',
    'Confirm or enter HOPEPITOME_IMPORT_URL (leave as default for production):',
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
  ui.alert('Saved! Now click Hopepitome Job Match -> Sync Both Ways Now.');
}

/**
 * Initializes both dedicated tabs ("MatchedJobs" and "CandidateIntakes")
 * in this spreadsheet without modifying any unrelated workbook.
 */
function setupJobMatchSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Setup MatchedJobs tab
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
  var headerRange = sheet.getRange(1, 1, 1, JOB_MATCH_HEADERS.length);
  headerRange.setValues([JOB_MATCH_HEADERS]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0f172a');
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  // Format postedDate (col 10) and foundOn (col 17) as YYYY-MM-DD plain text/date
  sheet.getRange(2, 10, 500, 1).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(2, 17, 500, 1).setNumberFormat('yyyy-mm-dd');
  sheet.getRange(2, 13, 500, 1).setNumberFormat('0');

  // Helpful dropdown validations
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
    sheet.getRange(1, 1).setNote('Required: Existing Candidate Work Order ID (e.g. HP-2026-10234) or UID');
    sheet.getRange(1, 10).setNote('Format: YYYY-MM-DD (e.g. 2026-11-11)');
    sheet.getRange(1, 12).setNote('Required: Must start with https:// or http://');
    sheet.getRange(1, 13).setNote('Required: Integer 0 to 100');
    sheet.getRange(1, 17).setNote('Format: YYYY-MM-DD (defaults to today if blank)');
    sheet.getRange(1, 18).setNote('Managed by sync script: leave blank or PENDING; becomes SYNCED or ERROR: ...');
  }

  sheet.autoResizeColumns(1, JOB_MATCH_HEADERS.length);

  // 2. Setup CandidateIntakes tab
  ensureCandidateIntakesSheet_(ss);

  SpreadsheetApp.flush();
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

function pullCandidateIntakesFromPortal() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    Logger.log('Another sync is already running. Skipping.');
    return;
  }
  try {
    pullCandidateIntakesFromPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

function pullCandidateIntakesFromPortalInner_() {
  var props = PropertiesService.getScriptProperties();
  var intakesUrl = resolveIntakesUrl_(props);
  var apiKey = String(props.getProperty('JOB_MATCH_API_KEY') || '').trim();

  if (!apiKey) {
    throw new Error('Missing JOB_MATCH_API_KEY in Script Properties (or run Hopepitome Job Match -> Configure API Key & URL).');
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
  for (var r = 1; r < existingValues.length; r++) {
    var ref = String(existingValues[r][refColIdx] || '').trim();
    if (ref) existingRowByRef[ref] = r + 1;
  }

  var nowIso = new Date().toISOString();
  var appended = 0;
  var updated = 0;

  intakes.forEach(function (item) {
    var rowData = [
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
      nowIso,
    ];

    var key = String(item.intakeReference || '').trim();
    if (!key) return;

    var existingRow = existingRowByRef[key];
    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, CANDIDATE_INTAKES_HEADERS.length).setValues([rowData]);
      updated += 1;
    } else {
      sheet.appendRow(rowData);
      existingRowByRef[key] = sheet.getLastRow();
      appended += 1;
    }
  });

  if (appended > 0) {
    sheet.autoResizeColumns(1, CANDIDATE_INTAKES_HEADERS.length);
  }
  SpreadsheetApp.flush();
  Logger.log('CandidateIntakes synced — Appended: ' + appended + ', Updated: ' + updated);
}

// Lock so the 15-min trigger and the manual menu run never send the same rows twice.
function syncMatchedJobsToPortal() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    Logger.log('Another sync is already running. Skipping.');
    return;
  }
  try {
    pullCandidateIntakesFromPortalInner_();
    pushMatchedJobsToPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

function pushMatchedJobsOnly() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    Logger.log('Another sync is already running. Skipping.');
    return;
  }
  try {
    pushMatchedJobsToPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

function pushMatchedJobsToPortalInner_() {
  var props = PropertiesService.getScriptProperties();
  var endpointUrl = resolveImportUrl_(props);
  var apiKey = String(props.getProperty('JOB_MATCH_API_KEY') || '').trim();

  if (!apiKey) {
    throw new Error('Missing JOB_MATCH_API_KEY in Script Properties (or run Hopepitome Job Match -> Configure API Key & URL).');
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(JOB_MATCH_SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet tab "' + JOB_MATCH_SHEET_NAME + '" not found. Run "Setup Sheets" from the menu.');
  }

  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  var timeZone = ss.getSpreadsheetTimeZone() || 'UTC';
  var headers = rows[0].map(function (h) {
    return String(h || '').trim();
  });

  var col = function (name) {
    return headers.indexOf(name);
  };

  // Stop if a column was renamed/deleted, instead of silently sending blanks.
  var missing = JOB_MATCH_HEADERS.filter(function (h) {
    return headers.indexOf(h) < 0;
  });
  if (missing.length) {
    throw new Error('Missing column(s): ' + missing.join(', ') + '. Run "Setup MatchedJobs & CandidateIntakes Sheets" again.');
  }

  var jobs = [];
  var syncedRowIndexes = [];

  for (var i = 1; i < rows.length && jobs.length < JOB_MATCH_BATCH_SIZE; i++) {
    var row = rows[i];
    var candidateId = String(row[col('candidateId')] || '').trim();
    var title = String(row[col('title')] || '').trim();
    var url = String(row[col('url')] || '').trim();

    // Skip blank trailing rows
    if (!candidateId && !title && !url) continue;

    var syncColIdx = col('SyncStatus');
    var status = syncColIdx >= 0 ? String(row[syncColIdx] || '').trim().toUpperCase() : '';
    if (status === 'SYNCED') continue;
    // Don't resend failed rows every 15 min. Fix the row, then clear SyncStatus (or set PENDING) to retry.
    if (status.indexOf('ERROR') === 0) continue;

    jobs.push({
      candidateId: candidateId,
      candidateName: String(row[col('candidateName')] || '').trim(),
      targetRole: String(row[col('targetRole')] || '').trim(),
      title: title,
      company: String(row[col('company')] || '').trim(),
      location: String(row[col('location')] || '').trim(),
      jobType: String(row[col('jobType')] || 'Full-time').trim(),
      experience: String(row[col('experience')] || 'Not stated').trim(),
      salary: String(row[col('salary')] || 'Not stated').trim(),
      postedDate: formatSheetDateValue_(row[col('postedDate')], timeZone),
      source: String(row[col('source')] || '').trim(),
      url: url,
      matchScore: Number(String(row[col('matchScore')] || '0').replace('%', '').trim()),
      matchReason: String(row[col('matchReason')] || '').trim(),
      resumeGaps: String(row[col('resumeGaps')] || '').trim(),
      recommendedService: String(row[col('recommendedService')] || 'ATS Optimisation').trim(),
      foundOn: formatSheetDateValue_(row[col('foundOn')], timeZone),
    });
    syncedRowIndexes.push(i + 1);
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

  var result;
  try {
    result = JSON.parse(response.getContentText() || '{}');
  } catch (e) {
    throw new Error('Import API returned non-JSON (HTTP ' + code + '): ' + response.getContentText().slice(0, 300));
  }
  Logger.log('Saved: ' + result.saved + ', Updated: ' + result.updated + ', Errors: ' + (result.errors || []).length);

  var syncCol = col('SyncStatus') + 1;
  var lastSyncedCol = col('LastSyncedAt') + 1;
  var nowIso = new Date().toISOString();

  var errorIndexes = {};
  (result.errors || []).forEach(function (err) {
    errorIndexes[err.index] = err.message;
  });

  syncedRowIndexes.forEach(function (sheetRow, idx) {
    if (syncCol > 0) {
      sheet.getRange(sheetRow, syncCol).setValue(errorIndexes[idx] ? 'ERROR: ' + errorIndexes[idx] : 'SYNCED');
    }
    if (lastSyncedCol > 0 && !errorIndexes[idx]) {
      sheet.getRange(sheetRow, lastSyncedCol).setValue(nowIso);
    }
  });
}
