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
  gasFileId?: string;
  fileDocId?: string;
  mimeType: string;
  originalFileName: string;
  fileSize: number;
}

export async function storePrivateJobMatchResume(
  firestore: EdgeFirestoreClient,
  callGas: GasBridgeCaller | null,
  params: {
    intakeId: string;
    intakeReference: string;
    candidateId: string;
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
  let gasFileId = '';

  // 1. Upload to private Drive folder via GAS (never public-shared)
  if (callGas) {
    try {
      const gasRes = await callGas({
        action: 'uploadPrivateJobMatchResume',
        candidateId: params.candidateId,
        intakeReference: params.intakeReference,
        fileName: params.fileName,
        mimeType: params.mimeType,
        base64Content: cleanB64,
      });
      if (gasRes?.success && gasRes?.fileId) {
        gasFileId = String(gasRes.fileId);
      }
    } catch (err) {
      console.warn('[Job Match GAS Private Upload Warning]:', err);
    }
  }

  // 2. Store chunked Worker-only binary copy in Firestore for instant, non-public binary streaming
  const chunks: string[] = [];
  for (let i = 0; i < cleanB64.length; i += CHUNK_CHAR_SIZE) {
    chunks.push(cleanB64.slice(i, i + CHUNK_CHAR_SIZE));
  }

  const now = new Date().toISOString();
  await firestore.setDocument('job_match_resume_files', fileDocId, {
    fileDocId,
    intakeId: params.intakeId,
    intakeReference: params.intakeReference,
    candidate_id: params.candidateId,
    original_filename: params.fileName,
    mime_type: params.mimeType,
    file_size: params.fileSize,
    chunk_count: chunks.length,
    gas_file_id: gasFileId || null,
    created_at: now,
  });

  await Promise.all(
    chunks.map((chunkData, idx) =>
      firestore.setDocument('job_match_resume_chunks', `${fileDocId}__${idx}`, {
        fileDocId,
        candidate_id: params.candidateId,
        index: idx,
        data: chunkData,
      })
    )
  );

  const storageReference = gasFileId
    ? `private:gas:${gasFileId}|vault:${fileDocId}`
    : `private:vault:${fileDocId}`;

  return {
    storageReference,
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

