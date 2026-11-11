/**
 * AI JOB MATCH MODULE — PRIVATE RESUME STORAGE ADAPTER
 * Stores up to 8 MB candidate resumes strictly privately (never public Drive URLs).
 * Primary: Google Apps Script private folder (`uploadPrivateJobMatchResume`) when live.
 * Sidecar/Resiliency: Chunked Worker-only Firestore storage (`job_match_resume_files` +
 * `job_match_resume_chunks` locked by `allow read, write: if false` in firestore.rules)
 * so downloads always stream as authenticated Worker binary bytes without public links.
 */

import type { EdgeFirestoreClient } from '../firebase/edge-firestore';

const CHUNK_CHAR_SIZE = 480_000; // Safely below Firestore 1 MiB per-document limit

export interface GasBridgeCaller {
  (payload: Record<string, any>): Promise<any>;
}

export interface StoredResumeMetadata {
  storageReference: string;
  storageKey: string;
  gasFileId?: string;
  fileDocId?: string;
  mimeType: string;
  originalFileName: string;
  fileSize: number;
}

function buildSafeStorageKey(candidateId: string, originalFileName: string): string {
  const safeCand = String(candidateId || 'candidate').replace(/[^A-Za-z0-9_-]/g, '_') || 'candidate';
  const trimmed = String(originalFileName || 'resume.pdf').trim();
  const dotIdx = trimmed.lastIndexOf('.');
  const rawBase = dotIdx > 0 ? trimmed.slice(0, dotIdx) : trimmed;
  const rawExt = dotIdx > 0 ? trimmed.slice(dotIdx + 1) : 'pdf';
  const safeBase =
    rawBase
      .replace(/[^A-Za-z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 64) || 'resume';
  const safeExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'pdf';
  return `job-match/${safeCand}/${Date.now()}_${safeBase}.${safeExt}`;
}

export async function storePrivateJobMatchResume(
  firestore: EdgeFirestoreClient,
  callGas: GasBridgeCaller | null,
  params: {
    intakeId: string;
    intakeReference: string;
    candidateId: string;
    candidateCode?: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    base64Content: string;
  }
): Promise<StoredResumeMetadata> {
  const cleanB64 = (params.base64Content.includes(',')
    ? params.base64Content.split(',')[1]
    : params.base64Content
  ).replace(/\s+/g, '');

  const fileDocId = `jmr_${params.intakeId}`;
  const storageKey = buildSafeStorageKey(params.candidateCode || params.candidateId, params.fileName);

  // 1. Store chunked Worker-only binary copy in Firestore FIRST with strict error checking
  const chunks: string[] = [];
  for (let i = 0; i < cleanB64.length; i += CHUNK_CHAR_SIZE) {
    chunks.push(cleanB64.slice(i, i + CHUNK_CHAR_SIZE));
  }

  if (chunks.length === 0) {
    throw new Error('Upload failed, please try again.');
  }

  const now = new Date().toISOString();
  const metaSaved = await firestore.setDocument('job_match_resume_files', fileDocId, {
    fileDocId,
    storage_key: storageKey,
    intakeId: params.intakeId,
    intakeReference: params.intakeReference,
    candidate_id: params.candidateId,
    candidate_code: params.candidateCode || params.candidateId,
    original_filename: params.fileName,
    mime_type: params.mimeType,
    file_size: params.fileSize,
    chunk_count: chunks.length,
    gas_file_id: null,
    created_at: now,
  });

  if (!metaSaved) {
    throw new Error('Upload failed, please try again.');
  }

  const chunkResults = await Promise.all(
    chunks.map((chunkData, idx) =>
      firestore.setDocument('job_match_resume_chunks', `${fileDocId}__${idx}`, {
        fileDocId,
        candidate_id: params.candidateId,
        index: idx,
        data: chunkData,
      })
    )
  );

  if (chunkResults.some((ok) => !ok)) {
    // Roll back partial metadata so incomplete uploads never leave dangling records
    await firestore.deleteDocument('job_match_resume_files', fileDocId).catch(() => {});
    throw new Error('Upload failed, please try again.');
  }

  // 2. Best-effort private Drive backup via GAS (guarded by timeout so large uploads never stall)
  let gasFileId = '';
  if (callGas) {
    try {
      const gasPromise = callGas({
        action: 'uploadPrivateJobMatchResume',
        candidateId: params.candidateCode || params.candidateId,
        intakeReference: params.intakeReference,
        storageKey,
        fileName: params.fileName,
        mimeType: params.mimeType,
        base64Content: cleanB64,
      });
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 4500));
      const gasRes = await Promise.race([gasPromise, timeoutPromise]);
      if (gasRes?.success && gasRes?.fileId) {
        gasFileId = String(gasRes.fileId);
        await firestore
          .setDocument('job_match_resume_files', fileDocId, { gas_file_id: gasFileId }, true)
          .catch(() => {});
      }
    } catch (err) {
      console.warn('[Job Match GAS Private Upload Warning]:', err);
    }
  }

  const storageReference = gasFileId
    ? `private:gas:${gasFileId}|vault:${storageKey}|doc:${fileDocId}`
    : `private:vault:${storageKey}|doc:${fileDocId}`;

  return {
    storageReference,
    storageKey,
    gasFileId: gasFileId || undefined,
    fileDocId,
    mimeType: params.mimeType,
    originalFileName: params.fileName,
    fileSize: params.fileSize,
  };
}

export async function readPrivateJobMatchResume(
  firestore: EdgeFirestoreClient,
  callGas: GasBridgeCaller | null,
  storageReference: string,
  intakeId: string
): Promise<{ buffer: Uint8Array; mimeType: string; fileName: string } | null> {
  const fileDocId = `jmr_${intakeId}`;
  const fileMeta = await firestore.getDocument('job_match_resume_files', fileDocId).catch(() => null);

  if (fileMeta && Number(fileMeta.chunk_count) > 0) {
    const chunkCount = Number(fileMeta.chunk_count);
    const chunkDocs = await Promise.all(
      Array.from({ length: chunkCount }, (_, idx) =>
        firestore.getDocument('job_match_resume_chunks', `${fileDocId}__${idx}`).catch(() => null)
      )
    );
    if (chunkDocs.every((c) => Boolean(c?.data))) {
      const fullBase64 = chunkDocs.map((c) => String(c!.data)).join('');
      const bin = atob(fullBase64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
      }
      return {
        buffer: bytes,
        mimeType: String(fileMeta.mime_type || 'application/pdf'),
        fileName: String(fileMeta.original_filename || 'resume.pdf'),
      };
    }
  }

  // Fallback to private GAS retrieval by fileId
  const gasMatch = String(storageReference || '').match(/gas:([^|]+)/);
  const gasFileId = gasMatch?.[1] || fileMeta?.gas_file_id;
  if (gasFileId && callGas) {
    try {
      const gasRes = await callGas({
        action: 'getFileContent',
        fileId: String(gasFileId),
      });
      if (gasRes?.success && gasRes?.base64Content) {
        const clean = String(gasRes.base64Content).includes(',')
          ? String(gasRes.base64Content).split(',')[1]
          : String(gasRes.base64Content);
        const bin = atob(clean.replace(/\s+/g, ''));
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          bytes[i] = bin.charCodeAt(i);
        }
        return {
          buffer: bytes,
          mimeType: String(gasRes.mimeType || fileMeta?.mime_type || 'application/pdf'),
          fileName: String(gasRes.fileName || fileMeta?.original_filename || 'resume.pdf'),
        };
      }
    } catch (err) {
      console.warn('[Job Match GAS Read Error]:', err);
    }
  }

  return null;
}

export async function deletePrivateJobMatchResume(
  firestore: EdgeFirestoreClient,
  callGas: GasBridgeCaller | null,
  storageReference: string,
  intakeId: string
): Promise<{ ok: boolean; errors: string[] }> {
  const errors: string[] = [];
  const fileDocId = `jmr_${intakeId}`;
  const fileMeta = await firestore.getDocument('job_match_resume_files', fileDocId).catch(() => null);

  const gasMatch = String(storageReference || '').match(/gas:([^|]+)/);
  const gasFileId = gasMatch?.[1] || fileMeta?.gas_file_id;

  if (gasFileId && callGas) {
    try {
      await callGas({ action: 'deleteFile', fileId: String(gasFileId) });
    } catch (err: any) {
      errors.push(`GAS delete error (${gasFileId}): ${err?.message || String(err)}`);
    }
  }

  const chunkCount = Number(fileMeta?.chunk_count || 0);
  for (let i = 0; i < chunkCount; i++) {
    try {
      await firestore.deleteDocument('job_match_resume_chunks', `${fileDocId}__${i}`);
    } catch (err: any) {
      errors.push(`Chunk delete error (${i}): ${err?.message || String(err)}`);
    }
  }

  try {
    await firestore.deleteDocument('job_match_resume_files', fileDocId);
  } catch (err: any) {
    errors.push(`Resume metadata delete error (${fileDocId}): ${err?.message || String(err)}`);
  }

  return { ok: errors.length === 0, errors };
}

