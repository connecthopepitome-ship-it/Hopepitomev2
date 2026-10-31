'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllOrders,
  updateServiceOrderStatus,
  logActivity,
} from '@/lib/firebase/firestore';
import type { ServiceOrder, ServiceOrderStatus } from '@/lib/career/types';
import {
  Briefcase,
  Kanban,
  ListFilter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  User,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AdminOrdersPipelinePage() {
  const { adminProfile, role } = useAdminAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [loading, setLoading] = useState(true);

  // Edit / Status update modal
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [newStatus, setNewStatus] = useState<ServiceOrderStatus>('NEW');
  const [newStage, setNewStage] = useState('');
  const [newProgress, setNewProgress] = useState(10);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeAllOrders((list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenStatusModal = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewStage(order.currentStage || '');
    setNewProgress(order.progressPercent || 10);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);

    try {
      await updateServiceOrderStatus(selectedOrder.id, newStatus, newStage, newProgress);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Lead Architect',
        actorRole: role,
        action: 'ORDER_STATUS_UPDATED',
        entityType: 'ORDER',
        entityId: selectedOrder.id,
        summary: `Changed order ${selectedOrder.orderNumber} status to ${newStatus} (${newProgress}%)`,
      });

      setSelectedOrder(null);
      alert('Order status & milestone progress updated.');
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setSaving(false);
    }
  };

  const columns: { status: ServiceOrderStatus; title: string; count?: number }[] = [
    { status: 'NEW', title: 'New Intake' },
    { status: 'IN_REVIEW', title: 'Specialist Scoping' },
    { status: 'DRAFTING', title: 'In Drafting' },
    { status: 'CLIENT_REVIEW', title: 'Client Review' },
    { status: 'REVISION', title: 'Revisions Queue' },
    { status: 'FINAL_APPROVED', title: 'Approved & Completed' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Operational Production Pipeline
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Service Orders Pipeline
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Visualise work orders across active drafting stages, track turnaround velocity, and manage client milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-[#17243B] text-white border-[#17243B]'
                  : 'bg-white text-[#292D36] border-[#E6E2DC] hover:bg-[#F7F5F0]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-[#17243B] text-white border-[#17243B]'
                  : 'bg-white text-[#292D36] border-[#E6E2DC] hover:bg-[#F7F5F0]'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#FFFFFF] p-12 rounded-2xl border border-[#E6E2DC] text-center text-xs text-[#777781]">
            No service orders registered in the pipeline yet.
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban Board */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 items-start overflow-x-auto pb-4">
            {columns.map((col) => {
              const colOrders = orders.filter((o) => o.status === col.status);
              return (
                <div
                  key={col.status}
                  className="bg-[#F7F5F0]/70 rounded-2xl p-3 border border-[#E6E2DC] space-y-3 min-w-[200px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E6E2DC]">
                    <span className="text-xs font-bold text-[#17243B]">
                      {col.title}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white text-[#17243B] font-mono text-[10px] font-bold flex items-center justify-center border border-[#E6E2DC]">
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => handleOpenStatusModal(order)}
                        className="bg-white p-3 rounded-xl border border-[#E6E2DC] hover:border-[#8172A8] shadow-sm cursor-pointer transition space-y-2"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-[#8172A8] font-bold">
                            {order.orderNumber}
                          </span>
                          <span className="font-semibold text-[#17243B]">
                            {order.packageTier}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#17243B] leading-snug">
                          {order.clientName}
                        </h4>
                        <p className="text-[11px] text-[#777781] leading-tight">
                          {order.serviceType.replace(/_/g, ' ')}
                        </p>

                        <div className="w-full bg-[#E6E2DC] h-1.5 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-[#8172A8] h-full rounded-full"
                            style={{ width: `${order.progressPercent}%` }}
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[10px] text-[#777781]">
                          <span>Rev: {order.revisionsUsed}/{order.revisionAllowance}</span>
                          <span className="font-semibold text-[#17243B]">{order.progressPercent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
            <div className="divide-y divide-[#E6E2DC]">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F5F0]/30 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#17243B]">
                        {o.orderNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#F7F5F0] text-[#17243B] border border-[#E6E2DC]">
                        {o.packageTier}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {o.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#17243B] mt-0.5">
                      {o.clientName} ({o.clientEmail}) — {o.serviceType.replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#777781]">
                      Stage: <strong className="text-[#17243B]">{o.currentStage}</strong> ({o.progressPercent}%)
                    </span>
                    <button
                      onClick={() => handleOpenStatusModal(o)}
                      className="px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-semibold text-[#17243B] transition"
                    >
                      Update Stage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Update Order Milestone & Status */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">
                  Update Order Pipeline Stage
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="bg-[#F7F5F0] p-3 rounded-xl border border-[#E6E2DC] text-xs">
                <span className="font-mono text-[#8172A8] font-bold block">
                  {selectedOrder.orderNumber}
                </span>
                <span className="font-bold text-[#17243B]">
                  {selectedOrder.clientName} — {selectedOrder.serviceType.replace(/_/g, ' ')}
                </span>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ServiceOrderStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="NEW">New Intake</option>
                    <option value="IN_REVIEW">Specialist Scoping</option>
                    <option value="DRAFTING">In Drafting</option>
                    <option value="CLIENT_REVIEW">Action Required: Client Review</option>
                    <option value="REVISION">Revising Draft</option>
                    <option value="FINAL_APPROVED">Final Approved</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Stage Description (Visible to Client)
                  </label>
                  <input
                    type="text"
                    required
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    placeholder="e.g. Executive Narrative Draft Underway"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <label className="font-semibold text-[#17243B]">Completion Progress (%)</label>
                    <span className="font-bold text-[#8172A8]">{newProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="w-full accent-[#8172A8]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Save & Broadcast'}
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

