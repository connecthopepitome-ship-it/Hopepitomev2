'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { subscribeDocuments, logActivity } from '@/lib/firebase/firestore';
import type { CareerDocument, DocumentCategory } from '@/lib/career/types';
import {
  FileText,
  UploadCloud,
  Download,
  ShieldCheck,
  Plus,
  CheckCircle2,
  AlertCircle,
  FolderSync,
  ExternalLink,
} from 'lucide-react';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const CATEGORIES = [
  'ALL',
  'Original Resume',
  'Client Documents',
  'Certificates',
  'Photos',
  'Working Files',
  'Final Deliverables',
];

export default function ClientDocumentsVaultPage() {
  const { client, user } = useCareerAuth();
  const [documents, setDocuments] = useState<CareerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Drag and Drop Upload State
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('Client Documents');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeWorkOrderId =
    (typeof window !== 'undefined' ? sessionStorage.getItem('hp_active_work_order') : null) ||
    client?.currentWorkOrderId ||
    'HP-2026-DEFAULT';

  useEffect(() => {
    if (!client?.id) return;
    const unsub = subscribeDocuments(client.id, (docs) => {
      setDocuments(docs);
      setLoading(false);
    });
    return () => unsub();
  }, [client?.id]);

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // 8MB limit
    if (file.size > 8 * 1024 * 1024) {
      return `File exceeds maximum limit of 8MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`;
    }
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    if (!ext || !validExtensions.includes(ext)) {
      return 'Unsupported file format. Please upload PDF, Word (DOC/DOCX), or JPG/PNG image.';
    }
    return null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setUploadError(errorMsg);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setUploadError(errorMsg);
        return;
      }
      setSelectedFile(file);
    }
  };

  const executeUpload = async () => {
    if (!selectedFile || !client?.id) return;
    setUploading(true);
    setUploadProgress(15);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // 1. Read file as Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1] || '';
          resolve(base64);
        };
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(selectedFile);
      const base64Data = await base64Promise;

      setUploadProgress(40);

      // 2. Call Cloudflare Worker endpoint (forwards to Google Apps Script -> Google Drive)
      const res = await fetch('/api/career/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workOrderId: activeWorkOrderId,
          clientId: client.id,
          fileName: selectedFile.name,
          mimeType: selectedFile.type || 'application/pdf',
          subfolder: uploadCategory,
          fileSize: selectedFile.size,
          base64Content: base64Data,
        }),
      });

      setUploadProgress(85);

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload document.');
      }

      setUploadProgress(100);
      setUploadSuccess(`"${selectedFile.name}" securely stored in Google Drive vault.`);

      // Optimistic addition
      if (data.document) {
        setDocuments((prev) => [
          {
            id: data.document.documentId,
            clientId: client.id,
            workOrderId: activeWorkOrderId,
            fileName: data.document.fileName,
            category: data.document.category as DocumentCategory,
            fileSize: data.document.fileSize,
            mimeType: data.document.mimeType,
            downloadUrl: data.document.downloadUrl || data.document.viewUrl,
            driveFileId: data.document.driveFileId,
            uploadedBy: 'CLIENT',
            createdAt: data.document.uploadedAt,
          },
          ...prev,
        ]);
      }

      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setShowUploadModal(false);
        setUploadSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('Upload Error:', err);
      setUploadError(err?.message || 'Network error during upload. Please retry.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    selectedCategory === 'ALL'
      ? true
      : d.category.toLowerCase().replace(/_/g, ' ') === selectedCategory.toLowerCase()
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                Private Document Vault
              </span>
              <span className="text-[10px] font-mono font-medium bg-[#F7F5F0] text-[#17243B] px-2 py-0.5 rounded border border-[#E6E2DC]">
                {activeWorkOrderId}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Career Documents & Deliverables
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Synchronized directly with your encrypted Google Drive vault via Google Apps Script.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl border font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#17243B] text-white border-[#17243B]'
                  : 'bg-[#FFFFFF] text-[#292D36] border-[#E6E2DC] hover:bg-[#F7F5F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Table / Grid */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <FolderSync className="w-10 h-10 text-[#8172A8] mx-auto" />
              <h3 className="text-sm font-bold text-[#17243B]">
                No files found in "{selectedCategory}"
              </h3>
              <p className="text-xs text-[#777781] max-w-sm mx-auto mb-4">
                Drag and drop your previous resumes, certificates, or target job specs to store them in your private Drive folder.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]/80">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F0]/40 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F7F5F0] border border-[#E6E2DC] text-[#8172A8] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#17243B]">{doc.fileName}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#777781] mt-0.5">
                        <span className="font-mono text-[#8172A8] bg-[#F7F5F0] px-1.5 py-0.5 rounded">
                          {doc.category.replace(/_/g, ' ')}
                        </span>
                        <span>•</span>
                        <span>{Math.round(doc.fileSize / 1024)} KB</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-medium text-[#17243B] transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security & Confidentiality Notice */}
        <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E6E2DC] flex items-start gap-3 text-xs text-[#777781] leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-[#8172A8] shrink-0 mt-0.5" />
          <p>
            Files uploaded to your career vault are stored inside your private Google Drive work order folder
            (<code>Hopepitome Career Services/Clients/{activeWorkOrderId}/</code>) through an authenticated Google Apps Script Web App.
          </p>
        </div>

        {/* Phase 7: Drag-and-Drop Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Upload to Google Drive Vault
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {/* Subfolder Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                  Target Drive Folder Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:outline-none focus:border-[#8172A8]"
                >
                  <option value="Original Resume">Original Resume</option>
                  <option value="Client Documents">Client Documents</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Photos">Photos</option>
                  <option value="Working Files">Working Files</option>
                  <option value="Final Deliverables">Final Deliverables</option>
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                  dragActive
                    ? 'border-[#8172A8] bg-[#8172A8]/10'
                    : 'border-[#E6E2DC] hover:border-[#8172A8]/60 bg-[#F7F5F0]/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <UploadCloud className="w-8 h-8 text-[#8172A8] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#17243B]">
                  {selectedFile ? selectedFile.name : 'Choose a file or drag and drop it here'}
                </p>
                <p className="text-[11px] text-[#777781] mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 8 MB)
                </p>
                {selectedFile && (
                  <p className="text-[11px] font-mono text-emerald-700 mt-2 font-medium">
                    {(selectedFile.size / 1024).toFixed(1)} KB selected
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[#17243B] font-medium">
                    <span>Streaming to Google Drive via Apps Script...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#E6E2DC] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#17243B] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeUpload}
                  disabled={!selectedFile || uploading}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                >
                  {uploading ? 'Uploading...' : 'Confirm & Upload'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
