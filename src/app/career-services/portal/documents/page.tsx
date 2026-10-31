'use client';

import React, { useState, useEffect } from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import {
  subscribeDocuments,
  addDocumentRecord,
  logActivity,
} from '@/lib/firebase/firestore';
import type { CareerDocument, DocumentCategory } from '@/lib/career/types';
import {
  FileText,
  UploadCloud,
  Download,
  Trash2,
  FileCheck,
  ShieldCheck,
  Plus,
  Filter,
} from 'lucide-react';

export default function ClientDocumentsVaultPage() {
  const { client, user } = useCareerAuth();
  const [documents, setDocuments] = useState<CareerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Upload Form State
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<DocumentCategory>('EXISTING_RESUME');
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!client?.id) return;
    const unsub = subscribeDocuments(client.id, (docs) => {
      setDocuments(docs);
      setLoading(false);
    });
    return () => unsub();
  }, [client?.id]);

  const handleFileUploadSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id || !fileName.trim()) return;

    setUploading(true);
    const docId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `doc_${Date.now()}`;

    const newDoc: CareerDocument = {
      id: docId,
      clientId: client.id,
      fileName: fileName.trim(),
      category: fileCategory,
      fileSize: Math.floor(Math.random() * (450000 - 120000) + 120000), // ~120KB - 450KB
      mimeType: 'application/pdf',
      downloadUrl: fileUrl.trim() || 'https://drive.google.com/file/d/vault_preview',
      driveFileId: `drive_${Date.now()}`,
      uploadedBy: 'CLIENT',
      createdAt: new Date().toISOString(),
    };

    try {
      await addDocumentRecord(newDoc);
      await logActivity({
        actorId: client.id,
        actorName: client.fullName,
        actorRole: 'CLIENT',
        action: 'DOCUMENT_UPLOADED',
        entityType: 'CLIENT',
        entityId: client.id,
        summary: `Uploaded document: ${fileName} (${fileCategory})`,
      });

      setShowUploadModal(false);
      setFileName('');
      setFileUrl('');
      alert('Document securely added to your career vault.');
    } catch (err) {
      console.error('Error adding document:', err);
      alert('Upload failed. Please retry.');
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    selectedCategory === 'ALL' ? true : d.category === selectedCategory
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Private Document Vault
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Career Documents & Uploads
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Store your existing CVs, cover letters, certificates, and target vacancy specs in one secure location.
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
          {['ALL', 'EXISTING_RESUME', 'JOB_SPEC', 'COVER_LETTER', 'CERTIFICATE', 'PORTFOLIO_ASSET'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl border font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#17243B] text-white border-[#17243B]'
                    : 'bg-[#FFFFFF] text-[#292D36] border-[#E6E2DC] hover:bg-[#F7F5F0]'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>

        {/* Documents Table / Grid */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <UploadCloud className="w-10 h-10 text-[#8172A8] mx-auto" />
              <h3 className="text-sm font-bold text-[#17243B]">
                No documents found in this category
              </h3>
              <p className="text-xs text-[#777781] max-w-sm mx-auto mb-4">
                Upload your prior resume versions, vacancy descriptions, or portfolios to share with your writing team.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Now</span>
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
                      <h4 className="text-xs font-bold text-[#17243B]">
                        {doc.fileName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#777781] mt-0.5">
                        <span className="font-mono">{doc.category.replace(/_/g, ' ')}</span>
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
            Your career documents are encrypted at rest and accessible exclusively by assigned senior writers and consultants. We never sell, share, or index your documents for public search engines.
          </p>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Upload Career File
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleFileUploadSim} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Document Title or File Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. John_Doe_Resume_2024.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Document Category
                  </label>
                  <select
                    value={fileCategory}
                    onChange={(e) => setFileCategory(e.target.value as DocumentCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="EXISTING_RESUME">Existing Resume / CV</option>
                    <option value="JOB_SPEC">Target Job Vacancy Spec</option>
                    <option value="COVER_LETTER">Cover Letter</option>
                    <option value="CERTIFICATE">Certificate / Credential</option>
                    <option value="PORTFOLIO_ASSET">Portfolio Asset / Case Study</option>
                    <option value="OTHER">Other Career Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Drive Link or Secure Attachment URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                  <p className="text-[10px] text-[#777781] mt-1">
                    Paste a Google Drive or Dropbox link, or leave empty for automated vault storage.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition disabled:opacity-50"
                  >
                    {uploading ? 'Storing...' : 'Save to Vault'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

