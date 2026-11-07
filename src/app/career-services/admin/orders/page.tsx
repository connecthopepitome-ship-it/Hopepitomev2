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
  User,
  ArrowRight,
  Filter,
  ChevronRight,
  TrendingUp,
  X,
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

  const inDrafting = orders.filter((o) => o.status === 'DRAFTING' || o.status === 'IN_REVIEW');
  const inReview = orders.filter((o) => o.status === 'CLIENT_REVIEW' || o.status === 'REVISION');
  const completed = orders.filter((o) => o.status === 'FINAL_APPROVED' || o.status === 'COMPLETED');

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Ambient Top Ribbon */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-xs uppercase tracking-wider font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                STUDIO DELIVERY PIPELINE
              </span>
              <span className="text-secondary font-label-md text-xs">•</span>
              <span className="text-secondary font-label-sm text-xs uppercase tracking-wider font-medium">
                Resume, ATS & Executive Portfolio Orders
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Service Orders Pipeline
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Track client work orders through active drafting, specialized ATS keyword scoring, revision iterations, and final sign-off with clear turnaround velocity.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start xl:self-center">
            <div className="inline-flex p-1 bg-surface-container rounded-lg shadow-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition ${
                  viewMode === 'kanban'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Total Work Orders</span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {orders.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-xs font-bold">
                Live Studio
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>{completed.length} Delivered</span>
              <span className="text-primary font-semibold">100% Tracked</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">In Active Drafting</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-primary tabular-nums">
                {inDrafting.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-label-sm text-xs font-bold">
                Writing Active
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Sprint Queue</span>
              <span className="text-emerald-700 font-semibold">On-Target</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Review & Feedback</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-purple-700 tabular-nums">
                {inReview.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 font-label-sm text-xs font-bold">
                Iteration
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Revisions Allowed: 2/order</span>
              <span className="text-purple-700 font-semibold">Normal</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Delivery Velocity</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-emerald-800 tabular-nums">
                98.4%
              </span>
              <span className="text-xs text-secondary font-mono">SLA Score</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Avg Turnaround: 4.2d</span>
              <span className="text-emerald-700 font-semibold">Optimal</span>
            </div>
          </div>
        </div>

        {/* Pipeline Content Area */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant/30 text-center text-xs text-secondary shadow-xs">
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
                  className="bg-surface-container-low/60 rounded-2xl p-3 border border-outline-variant/30 space-y-3 min-w-[200px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                    <span className="text-xs font-bold text-primary">
                      {col.title}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white text-primary font-mono text-xs font-bold flex items-center justify-center border border-outline-variant/30">
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colOrders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => handleOpenStatusModal(order)}
                        className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/30 hover:border-primary/40 shadow-xs cursor-pointer transition space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-primary font-bold">
                            {order.orderNumber}
                          </span>
                          <span className="font-semibold text-secondary text-[11px] px-1.5 py-0.5 rounded bg-surface-container-high">
                            {order.packageTier}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-primary leading-snug">
                          {order.clientName}
                        </h4>
                        <p className="text-xs text-secondary leading-tight">
                          {order.serviceType.replace(/_/g, ' ')}
                        </p>

                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: `${order.progressPercent}%` }}
                          />
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs text-secondary font-body-sm">
                          <span>Rev: {order.revisionsUsed}/{order.revisionAllowance}</span>
                          <span className="font-semibold text-primary">{order.progressPercent}%</span>
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
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container-low text-secondary font-label-sm uppercase tracking-wider border-b border-outline-variant/30">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order / Client</th>
                    <th className="py-3 px-4 font-semibold">Service Package</th>
                    <th className="py-3 px-4 font-semibold">Stage & Progress</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-surface-container-low/40 transition">
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-primary block">
                          {order.orderNumber}
                        </span>
                        <span className="font-bold text-sm text-on-surface block">
                          {order.clientName}
                        </span>
                        <span className="text-secondary text-xs">{order.clientEmail}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-on-surface font-semibold block">
                          {order.serviceType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-secondary text-xs">{order.packageTier} Tier</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-primary">{order.currentStage}</span>
                        <div className="w-28 bg-surface-container-high h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-primary-container h-full rounded-full"
                            style={{ width: `${order.progressPercent}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenStatusModal(order)}
                          className="px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container-low text-primary text-xs font-semibold transition"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Update Order Status */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-xl border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-primary">Update Order Progress</h3>
                  <p className="text-xs text-secondary">{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg hover:bg-surface-container-low text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Production Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ServiceOrderStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  >
                    <option value="NEW">New Intake</option>
                    <option value="IN_REVIEW">Specialist Scoping</option>
                    <option value="DRAFTING">In Drafting</option>
                    <option value="CLIENT_REVIEW">Client Review</option>
                    <option value="REVISION">Revisions Queue</option>
                    <option value="FINAL_APPROVED">Approved & Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Current Milestone Stage</label>
                  <input
                    type="text"
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    placeholder="e.g. ATS Keyword Optimization"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Progress Percentage ({newProgress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-secondary hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Apply Progress'}
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
