/**
 * HOPEPITOME CAREER SERVICES — STANDALONE AI JOB MATCH GOOGLE SHEET SYNC
 *
 * Use this in a BRAND-NEW, dedicated Google Sheet (leave any existing sheets untouched).
 *
 * Quick Setup:
 *   1. Open https://sheets.new and name it e.g. "Hopepitome AI Job Match Sync".
 *   2. Open Extensions -> Apps Script, paste this file, and save.
 *   3. Reload the spreadsheet and click:
 *        Hopepitome Job Match -> Setup "MatchedJobs" Sheet
 *      (or run `setupJobMatchSheet()` once from the Apps Script editor).
 *   4. In Apps Script -> Project Settings -> Script Properties, add:
 *        HOPEPITOME_IMPORT_URL = "https://hopepitomev2.connect-hopepitome.workers.dev/api/job-matches/import"
 *        JOB_MATCH_API_KEY     = "<value from Hopepitomev2/.env.local>"
 *   5. In Apps Script -> Triggers, add a Time-driven trigger (Every 15 minutes)
 *      for `syncMatchedJobsToPortal`.
 */

var JOB_MATCH_SHEET_NAME = 'MatchedJobs';
var JOB_MATCH_BATCH_SIZE = 50; // Keeps Cloudflare Worker subrequests & GAS execution well within limits

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

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Hopepitome Job Match')
    .addItem('Setup "MatchedJobs" Sheet', 'setupJobMatchSheet')
    .addItem('Sync Pending Rows Now', 'syncMatchedJobsToPortal')
    .addToUi();
}

/**
 * Initializes the dedicated "MatchedJobs" tab in a brand-new Google Sheet
 * without modifying any other spreadsheet.
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
      firstSheet.getName() === 'Sheet1'
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

  // Add column hints note if sheet was empty
  if (existingLastRow === 0) {
    sheet.getRange(1, 1).setNote('Required: Existing Candidate Work Order ID (e.g. HP-2026-10234) or UID');
    sheet.getRange(1, 10).setNote('Format: YYYY-MM-DD (e.g. 2026-11-11)');
    sheet.getRange(1, 12).setNote('Required: Must start with https:// or http://');
    sheet.getRange(1, 13).setNote('Required: Integer 0 to 100');
    sheet.getRange(1, 17).setNote('Format: YYYY-MM-DD (defaults to today if blank)');
    sheet.getRange(1, 18).setNote('Managed by sync script: leave blank or PENDING; becomes SYNCED or ERROR: ...');
  }

  sheet.autoResizeColumns(1, JOB_MATCH_HEADERS.length);
  SpreadsheetApp.flush();
}

function formatSheetDateValue_(val, timeZone) {
  if (val === null || val === undefined || val === '') return '';
  if (Object.prototype.toString.call(val) === '[object Date]' && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, timeZone || 'UTC', 'yyyy-MM-dd');
  }
  return String(val).trim();
}

// Lock so the 15-min trigger and the manual menu run never send the same rows twice.
function syncMatchedJobsToPortal() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    Logger.log('Another sync is already running. Skipping.');
    return;
  }
  try {
    syncMatchedJobsToPortalInner_();
  } finally {
    lock.releaseLock();
  }
}

function syncMatchedJobsToPortalInner_() {
  var props = PropertiesService.getScriptProperties();
  var endpointUrl = props.getProperty('HOPEPITOME_IMPORT_URL');
  var apiKey = props.getProperty('JOB_MATCH_API_KEY');

  if (!endpointUrl || !apiKey) {
    throw new Error('Missing HOPEPITOME_IMPORT_URL or JOB_MATCH_API_KEY in Script Properties.');
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

  // Stop if a column was renamed/deleted, instead of silently sending blanks.
  var missing = JOB_MATCH_HEADERS.filter(function (h) {
    return headers.indexOf(h) < 0;
  });
  if (missing.length) {
    throw new Error('Missing column(s): ' + missing.join(', ') + '. Run "Setup MatchedJobs Sheet" again.');
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
