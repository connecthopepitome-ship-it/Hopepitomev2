/**
 * HOPEPITOME CAREER SERVICES — GOOGLE APPS SCRIPT WEB APP
 * Automated Private Google Drive Vault Microservice
 *
 * Folder Structure:
 * Hopepitome Career Services/
 *   Clients/
 *     HP-YYYY-XXXXX/
 *       Original Resume/
 *       Client Documents/
 *       Certificates/
 *       Photos/
 *       Working Files/
 *       Final Deliverables/
 *
 * Script Properties Required:
 * - SHARED_SECRET: Secret token matching Cloudflare Worker secret GAS_SHARED_SECRET
 * - ROOT_FOLDER_ID: Drive ID of the "Hopepitome Career Services" root folder
 */

const SUBFOLDER_NAMES = [
  'Original Resume',
  'Client Documents',
  'Certificates',
  'Photos',
  'Working Files',
  'Final Deliverables',
];

function doPost(e) {
  var output = { success: false, error: 'Unknown error' };

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: 'Empty request payload' }, 400);
    }

    var data = JSON.parse(e.postData.contents);
    var scriptProps = PropertiesService.getScriptProperties();
    var configuredSecret = scriptProps.getProperty('SHARED_SECRET');

    // 1. Authenticate Request
    if (!configuredSecret || data.secret !== configuredSecret) {
      return jsonResponse({ success: false, error: 'Unauthorized: Invalid shared secret' }, 401);
    }

    var action = data.action;

    // 2. Route Actions
    switch (action) {
      case 'ping':
        output = handlePing();
        break;

      case 'initWorkOrderFolder':
        output = handleInitWorkOrderFolder(data.workOrderId);
        break;

      case 'uploadFile':
        output = handleUploadFile(data);
        break;

      case 'listFiles':
        output = handleListFiles(data.workOrderId, data.subfolder);
        break;

      case 'getFileMetadata':
        output = handleGetFileMetadata(data.fileId);
        break;

      case 'deleteFile':
        output = handleDeleteFile(data.fileId);
        break;

      default:
        output = { success: false, error: 'Unsupported action: ' + action };
        break;
    }
  } catch (err) {
    output = { success: false, error: err.message || String(err) };
  }

  return jsonResponse(output, output.success ? 200 : 400);
}

function doGet(e) {
  return jsonResponse({
    status: 'online',
    service: 'Hopepitome Career Services Drive Bridge',
    timestamp: new Date().toISOString(),
  });
}

function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * Health check
 */
function handlePing() {
  return {
    success: true,
    message: 'Google Apps Script Drive Bridge is active and authenticated',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Finds or creates the root folder hierarchy
 */
function getOrCreateClientsFolder() {
  var scriptProps = PropertiesService.getScriptProperties();
  var rootId = scriptProps.getProperty('ROOT_FOLDER_ID');
  var rootFolder;

  if (rootId) {
    try {
      rootFolder = DriveApp.getFolderById(rootId);
    } catch (e) {
      // Fallback if ID changed
    }
  }

  if (!rootFolder) {
    var rootFolders = DriveApp.getFoldersByName('Hopepitome Career Services');
    if (rootFolders.hasNext()) {
      rootFolder = rootFolders.next();
    } else {
      rootFolder = DriveApp.createFolder('Hopepitome Career Services');
    }
    scriptProps.setProperty('ROOT_FOLDER_ID', rootFolder.getId());
  }

  // Get or create "Clients" subfolder
  var clientFolders = rootFolder.getFoldersByName('Clients');
  if (clientFolders.hasNext()) {
    return clientFolders.next();
  } else {
    return rootFolder.createFolder('Clients');
  }
}

/**
 * Initializes a client's work order folder with all standard subfolders
 */
function handleInitWorkOrderFolder(workOrderId) {
  if (!workOrderId) {
    return { success: false, error: 'Missing workOrderId' };
  }

  var clientsFolder = getOrCreateClientsFolder();
  var existingFolders = clientsFolder.getFoldersByName(workOrderId);
  var workOrderFolder;

  if (existingFolders.hasNext()) {
    workOrderFolder = existingFolders.next();
  } else {
    workOrderFolder = clientsFolder.createFolder(workOrderId);
  }

  var subfolderMap = {};
  for (var i = 0; i < SUBFOLDER_NAMES.length; i++) {
    var subName = SUBFOLDER_NAMES[i];
    var subIter = workOrderFolder.getFoldersByName(subName);
    var subFolder;
    if (subIter.hasNext()) {
      subFolder = subIter.next();
    } else {
      subFolder = workOrderFolder.createFolder(subName);
    }
    subfolderMap[subName] = subFolder.getId();
  }

  return {
    success: true,
    workOrderId: workOrderId,
    folderId: workOrderFolder.getId(),
    folderUrl: workOrderFolder.getUrl(),
    subfolders: subfolderMap,
  };
}

/**
 * Uploads a file from base64 content into the designated subfolder
 */
function handleUploadFile(data) {
  var workOrderId = data.workOrderId;
  var fileName = data.fileName;
  var mimeType = data.mimeType || 'application/octet-stream';
  var base64Content = data.base64Content;
  var subfolderCategory = data.subfolder || 'Client Documents';

  if (!workOrderId || !fileName || !base64Content) {
    return { success: false, error: 'Missing workOrderId, fileName, or base64Content' };
  }

  // Ensure category is valid
  var targetSubfolderName = 'Client Documents';
  for (var i = 0; i < SUBFOLDER_NAMES.length; i++) {
    if (SUBFOLDER_NAMES[i].toLowerCase() === subfolderCategory.toLowerCase()) {
      targetSubfolderName = SUBFOLDER_NAMES[i];
      break;
    }
  }

  // Get client folder
  var folderInit = handleInitWorkOrderFolder(workOrderId);
  var targetFolderId = folderInit.subfolders[targetSubfolderName];
  var targetFolder = DriveApp.getFolderById(targetFolderId);

  // Decode file
  var decodedBytes = Utilities.base64Decode(base64Content);
  var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);

  // Create file in Drive
  var file = targetFolder.createFile(blob);

  // Set permissions: keep in private drive vault, accessible via webViewLink
  return {
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    mimeType: file.getMimeType(),
    fileSize: file.getSize(),
    subfolder: targetSubfolderName,
    driveFolderId: targetFolderId,
    downloadUrl: file.getDownloadUrl() || 'https://drive.google.com/uc?export=download&id=' + file.getId(),
    viewUrl: file.getUrl(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Lists files in a client's work order folder
 */
function handleListFiles(workOrderId, subfolderName) {
  if (!workOrderId) {
    return { success: false, error: 'Missing workOrderId' };
  }

  var folderInit = handleInitWorkOrderFolder(workOrderId);
  var fileList = [];

  if (subfolderName && folderInit.subfolders[subfolderName]) {
    var subFolder = DriveApp.getFolderById(folderInit.subfolders[subfolderName]);
    var files = subFolder.getFiles();
    while (files.hasNext()) {
      var f = files.next();
      fileList.push({
        fileId: f.getId(),
        fileName: f.getName(),
        mimeType: f.getMimeType(),
        fileSize: f.getSize(),
        subfolder: subfolderName,
        viewUrl: f.getUrl(),
        lastUpdated: f.getLastUpdated().toISOString(),
      });
    }
  } else {
    // List across all subfolders
    for (var i = 0; i < SUBFOLDER_NAMES.length; i++) {
      var sName = SUBFOLDER_NAMES[i];
      var sFolder = DriveApp.getFolderById(folderInit.subfolders[sName]);
      var sFiles = sFolder.getFiles();
      while (sFiles.hasNext()) {
        var file = sFiles.next();
        fileList.push({
          fileId: file.getId(),
          fileName: file.getName(),
          mimeType: file.getMimeType(),
          fileSize: file.getSize(),
          subfolder: sName,
          viewUrl: file.getUrl(),
          lastUpdated: file.getLastUpdated().toISOString(),
        });
      }
    }
  }

  return {
    success: true,
    workOrderId: workOrderId,
    totalFiles: fileList.length,
    files: fileList,
  };
}

/**
 * Gets file metadata
 */
function handleGetFileMetadata(fileId) {
  if (!fileId) return { success: false, error: 'Missing fileId' };
  var file = DriveApp.getFileById(fileId);
  return {
    success: true,
    fileId: file.getId(),
    fileName: file.getName(),
    mimeType: file.getMimeType(),
    fileSize: file.getSize(),
    viewUrl: file.getUrl(),
    downloadUrl: file.getDownloadUrl(),
  };
}

/**
 * Deletes file (moves to trash)
 */
function handleDeleteFile(fileId) {
  if (!fileId) return { success: false, error: 'Missing fileId' };
  var file = DriveApp.getFileById(fileId);
  file.setTrashed(true);
  return {
    success: true,
    fileId: fileId,
    message: 'File moved to trash',
  };
}
