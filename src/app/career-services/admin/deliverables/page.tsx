'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllOrders,
  addDeliverable,
  updateServiceOrderStatus,
  logActivity,
} from '@/lib/firebase/firestore';
import type { CareerDeliverable, ServiceOrder } from '@/lib/career/types';
import {
  FileBox,
  UploadCloud,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  ExternalLink,
} from 'lucide-react';

export default function AdminDeliverablesPage() {
  const { adminProfile, role } = useAdminAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Deliverable Form
  const [orderId, setOrderId] = useState('');
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('v1.0-Draft');
  const [fileUrl, setFileUrl] = useState('');
  const [isFinal, setIsFinal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeAllOrders((list) => {
      setOrders(list);
      if (list.length > 0 && !orderId) {
        setOrderId(list[0].id);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [orderId]);

  const handleUploadDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !orderId) return;

    setSaving(true);
    const delId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `del_${Date.now()}`;
    const selectedOrder = orders.find((o) => o.id === orderId);

    const newDeliverable: CareerDeliverable = {
      id: delId,
      orderId,
      orderNumber: selectedOrder?.orderNumber || 'ORD',
      clientId: selectedOrder?.clientId || 'client',
      title: title.trim(),
      version,
      fileName: `${title.replace(/\s+/g, '_')}_${version}.pdf`,
      fileSize: 245000,
      mimeType: 'application/pdf',
      fileUrl: fileUrl.trim() || 'https://drive.google.com/file/d/sample_deliverable_preview',
      isDraft: !isFinal,
      isFinal,
      approvalStatus: 'PENDING',
      uploadedByName: adminProfile?.displayName || 'Lead Architect',
      uploadedByUid: adminProfile?.uid || 'staff',
      createdAt: new Date().toISOString(),
    };

    try {
      await addDeliverable(newDeliverable);
      if (selectedOrder) {
        await updateServiceOrderStatus(
          selectedOrder.id,
          'CLIENT_REVIEW',
          `${version} Ready for Client Review`,
          75
        );
      }
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Lead Architect',
        actorRole: role,
        action: 'DELIVERABLE_UPLOADED',
        entityType: 'DELIVERABLE',
        entityId: delId,
        summary: `Uploaded deliverable: ${title} (${version}) for order ${selectedOrder?.orderNumber}`,
      });

      setShowUploadModal(false);
      setTitle('');
      setFileUrl('');
      alert('Deliverable published! Client notified for review.');
    } catch (err) {
      console.error('Error uploading deliverable:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Deliverables & Version Control
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Deliverables Dispatch Center
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Upload draft documents for client feedback or release approved final deliverables.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Deliverable</span>
          </button>
        </div>

        {/* Orders with deliverables overview */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
            Orders Awaiting or Active with Deliverables
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#777781]">
              No active orders to attach deliverables to.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F0]/30 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#17243B]">
                        {o.orderNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#F7F5F0] text-[#17243B] border border-[#E6E2DC]">
                        {o.packageTier}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#17243B] mt-0.5">
                      {o.clientName} ({o.clientEmail}) — {o.serviceType.replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setOrderId(o.id);
                        setShowUploadModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-medium transition"
                    >
                      + Attach Deliverable
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Upload Deliverable */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Dispatch Deliverable to Client
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleUploadDeliverable} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Select Target Service Order
                  </label>
                  <select
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber} — {o.clientName} ({o.serviceType.replace(/_/g, ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Deliverable Document Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Executive Resume & Career Dossier"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Version Tag
                    </label>
                    <input
                      type="text"
                      required
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="e.g. v1.0-Draft or v2.0-Final"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#17243B] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFinal}
                        onChange={(e) => setIsFinal(e.target.checked)}
                        className="rounded text-[#8172A8]"
                      />
                      <span>Mark as Final Release</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Google Drive or Secure Asset Link
                  </label>
                  <input
                    type="url"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition disabled:opacity-50"
                  >
                    {saving ? 'Publishing...' : 'Dispatch to Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

