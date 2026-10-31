'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import {
  subscribeClientOrders,
  subscribeDeliverables,
  updateDeliverableStatus,
  submitRevisionRequest,
  updateServiceOrderStatus,
  logActivity,
} from '@/lib/firebase/firestore';
import type { ServiceOrder, CareerDeliverable, RevisionRequest } from '@/lib/career/types';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileCheck,
  PlusCircle,
  Send,
} from 'lucide-react';

export default function ClientOrdersPage() {
  const { client } = useCareerAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [deliverables, setDeliverables] = useState<CareerDeliverable[]>([]);
  const [loading, setLoading] = useState(true);

  // Revision Modal State
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<CareerDeliverable | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);

  useEffect(() => {
    if (!client?.id) return;
    const unsub = subscribeClientOrders(client.id, (orderList) => {
      setOrders(orderList);
      if (orderList.length > 0 && !selectedOrderId) {
        setSelectedOrderId(orderList[0].id);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [client?.id, selectedOrderId]);

  useEffect(() => {
    if (!selectedOrderId) {
      setDeliverables([]);
      return;
    }
    const unsub = subscribeDeliverables(selectedOrderId, (items) => {
      setDeliverables(items);
    });
    return () => unsub();
  }, [selectedOrderId]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleApproveDeliverable = async (deliverable: CareerDeliverable) => {
    if (!selectedOrder || !client) return;
    try {
      await updateDeliverableStatus(deliverable.id, 'APPROVED');
      await updateServiceOrderStatus(
        selectedOrder.id,
        'FINAL_APPROVED',
        'Final Deliverable Approved by Client',
        100
      );
      await logActivity({
        actorId: client.id,
        actorName: client.fullName,
        actorRole: 'CLIENT',
        action: 'DELIVERABLE_APPROVED',
        entityType: 'DELIVERABLE',
        entityId: deliverable.id,
        summary: `Client approved deliverable ${deliverable.title} (${deliverable.version})`,
      });
      alert('Deliverable approved! Congratulations on completing this career milestone.');
    } catch (e) {
      console.error('Error approving deliverable:', e);
    }
  };

  const handleRequestRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !selectedDeliverable || !client) return;

    if (selectedOrder.revisionsUsed >= selectedOrder.revisionAllowance) {
      alert(
        `All ${selectedOrder.revisionAllowance} complimentary revision rounds have been used for this package tier. Further major structural rewrites require out-of-scope scoping.`
      );
      return;
    }

    setSubmittingRevision(true);
    const revId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rev_${Date.now()}`;

    const newRev: RevisionRequest = {
      id: revId,
      orderId: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      deliverableId: selectedDeliverable.id,
      deliverableVersion: selectedDeliverable.version,
      clientId: client.id,
      revisionNumber: selectedOrder.revisionsUsed + 1,
      feedbackPoints: [revisionFeedback],
      detailedNotes: revisionFeedback,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    try {
      await submitRevisionRequest(newRev);
      await updateDeliverableStatus(selectedDeliverable.id, 'REVISION_REQUESTED', revisionFeedback);
      await updateServiceOrderStatus(
        selectedOrder.id,
        'REVISION',
        `Client Revision Round ${selectedOrder.revisionsUsed + 1} Underway`,
        Math.min(90, selectedOrder.progressPercent)
      );
      await logActivity({
        actorId: client.id,
        actorName: client.fullName,
        actorRole: 'CLIENT',
        action: 'REVISION_REQUESTED',
        entityType: 'REVISION',
        entityId: revId,
        summary: `Requested revision #${selectedOrder.revisionsUsed + 1} for ${selectedDeliverable.title}`,
      });

      setShowRevisionModal(false);
      setRevisionFeedback('');
      alert('Revision request submitted. Our specialist will integrate your feedback.');
    } catch (e) {
      console.error('Error requesting revision:', e);
      alert('Failed to submit revision. Please retry.');
    } finally {
      setSubmittingRevision(false);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Client Work Tracker
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Service Orders & Progress
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Review live milestone progression, download drafts, and submit structured feedback.
            </p>
          </div>
          <Link
            href="/career-services/portal/orders/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Order</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 rounded-2xl border border-[#E6E2DC] text-center space-y-3">
            <Briefcase className="w-10 h-10 text-[#8172A8] mx-auto" />
            <h3 className="text-sm font-bold text-[#17243B]">No career service orders registered</h3>
            <p className="text-xs text-[#777781] max-w-sm mx-auto mb-4">
              Get started by placing a work order for professional resume writing, ATS keyword alignment, or LinkedIn optimization.
            </p>
            <Link
              href="/career-services/portal/orders/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Configure Your Service</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left list: Orders sidebar selector */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#777781] px-1">
                Your Orders ({orders.length})
              </h3>
              <div className="space-y-2.5">
                {orders.map((o) => {
                  const isSelected = selectedOrderId === o.id;
                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-[#17243B] bg-[#FFFFFF] shadow-sm ring-1 ring-[#17243B]'
                          : 'border-[#E6E2DC] bg-[#FFFFFF] hover:border-[#8172A8]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono text-[#777781]">{o.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F7F5F0] text-[#17243B] font-medium border border-[#E6E2DC]">
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#17243B]">
                        {o.serviceType.replace(/_/g, ' ')}
                      </h4>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-[#777781]">
                        <span>Tier: {o.packageTier}</span>
                        <span>{o.progressPercent}% complete</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Order Detail */}
            <div className="lg:col-span-2 space-y-6">
              {selectedOrder && (
                <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6E2DC] gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#8172A8] font-bold">
                          {selectedOrder.orderNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#17243B] text-white">
                          {selectedOrder.packageTier}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-[#17243B] mt-1">
                        {selectedOrder.serviceType.replace(/_/g, ' ')}
                      </h2>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[11px] text-[#777781] block">Revision Allowance</span>
                      <span className="text-xs font-bold text-[#17243B]">
                        {selectedOrder.revisionsUsed} of {selectedOrder.revisionAllowance} rounds used
                      </span>
                    </div>
                  </div>

                  {/* Progress Milestone Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#777781]">
                        Stage: <strong className="text-[#17243B]">{selectedOrder.currentStage}</strong>
                      </span>
                      <span className="font-bold text-[#17243B]">
                        {selectedOrder.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-[#E6E2DC] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8172A8] h-full rounded-full transition-all duration-500"
                        style={{ width: `${selectedOrder.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Specialist & Timeline Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F7F5F0]/60 border border-[#E6E2DC] text-xs">
                    <div>
                      <span className="text-[#777781] text-[11px] block">Assigned Specialist</span>
                      <span className="font-semibold text-[#17243B]">
                        {selectedOrder.assignedStaffName || 'Lead Resume Architect'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#777781] text-[11px] block">Target Date</span>
                      <span className="font-semibold text-[#17243B]">
                        {selectedOrder.targetCompletionDate || 'Under Scoping'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#777781] text-[11px] block">Order Date</span>
                      <span className="font-semibold text-[#17243B]">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Deliverables Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Documents & Deliverables ({deliverables.length})
                      </h3>
                      <span className="text-[11px] text-[#777781]">
                        Secure client download files
                      </span>
                    </div>

                    {deliverables.length === 0 ? (
                      <div className="p-5 rounded-xl border border-dashed border-[#E6E2DC] text-center text-xs text-[#777781]">
                        First draft documents are currently being drafted by your assigned writer. You will be notified as soon as a draft is uploaded for review.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {deliverables.map((del) => (
                          <div
                            key={del.id}
                            className="p-4 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] hover:border-[#8172A8]/50 transition space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-[#17243B]">
                                    {del.title}
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#F7F5F0] text-[#8172A8] border border-[#E6E2DC]">
                                    {del.version}
                                  </span>
                                  {del.approvalStatus === 'APPROVED' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Client Approved ✓
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#777781] mt-0.5">
                                  {del.fileName} • {Math.round(del.fileSize / 1024)} KB
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={del.fileUrl || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-medium text-[#17243B] transition"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download</span>
                                </a>

                                {del.approvalStatus !== 'APPROVED' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setSelectedDeliverable(del);
                                        setShowRevisionModal(true);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-medium transition"
                                    >
                                      <RotateCcw className="w-3.5 h-3.5" />
                                      <span>Request Revision</span>
                                    </button>

                                    <button
                                      onClick={() => handleApproveDeliverable(del)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Approve Draft</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Structured Revision Request Modal */}
        {showRevisionModal && selectedDeliverable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Request Document Revision
                </h3>
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#E6E2DC] text-xs">
                <span className="text-[#777781] block text-[11px]">Selected Deliverable:</span>
                <span className="font-semibold text-[#17243B]">
                  {selectedDeliverable.title} ({selectedDeliverable.version})
                </span>
              </div>

              <form onSubmit={handleRequestRevisionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Specific Adjustment Feedback
                  </label>
                  <p className="text-[11px] text-[#777781] mb-2 leading-relaxed">
                    Be specific about sections to refine (e.g., "Under Role 2, emphasize cloud migration metrics instead of team meetings; adjust summary to spotlight FinTech domain").
                  </p>
                  <textarea
                    rows={4}
                    required
                    value={revisionFeedback}
                    onChange={(e) => setRevisionFeedback(e.target.value)}
                    placeholder="Provide clear bullet points of requested refinements..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRevisionModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRevision}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingRevision ? 'Submitting...' : 'Submit Revision Brief'}</span>
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

