'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllOrders,
  submitRevisionRequest,
  logActivity,
} from '@/lib/firebase/firestore';
import type { RevisionRequest, ServiceOrder } from '@/lib/career/types';
import { RotateCcw, CheckCircle2, AlertCircle, Clock, Send, MessageSquare } from 'lucide-react';

export default function AdminRevisionsPage() {
  const { adminProfile, role } = useAdminAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample or active revisions view
  const [revisions, setRevisions] = useState<RevisionRequest[]>([]);
  const [selectedRev, setSelectedRev] = useState<RevisionRequest | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeAllOrders((list) => {
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleUpdateRevisionStatus = async (rev: RevisionRequest, newStatus: RevisionRequest['status']) => {
    setSaving(true);
    const updated: RevisionRequest = {
      ...rev,
      status: newStatus,
      adminResolutionNotes: resolutionNotes || rev.adminResolutionNotes,
      resolvedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
    };

    try {
      await submitRevisionRequest(updated);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Lead Architect',
        actorRole: role,
        action: 'REVISION_RESOLVED',
        entityType: 'REVISION',
        entityId: rev.id,
        summary: `Marked revision ${rev.orderNumber} as ${newStatus}`,
      });
      alert(`Revision updated to ${newStatus}.`);
      setSelectedRev(null);
    } catch (e) {
      console.error('Error updating revision:', e);
    } finally {
      setSaving(false);
    }
  };

  const inRevisionOrders = orders.filter((o) => o.status === 'REVISION');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Quality Assurance & Scope Control
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Revisions Management Queue
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Evaluate client revision requests against defined package allowances, accept in-scope adjustments, and track writer revisions.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F7F5F0] px-3.5 py-1.5 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#17243B]">
            <RotateCcw className="w-4 h-4 text-purple-600" />
            <span>{inRevisionOrders.length} Orders in Active Revision</span>
          </div>
        </div>

        {/* Active Orders In Revision */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
            Orders with Revision Requests
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : inRevisionOrders.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#777781]">
              No pending revision requests in the studio queue. All client drafts are currently on track.
            </div>
          ) : (
            <div className="space-y-3">
              {inRevisionOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-purple-200 bg-purple-50/20 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#17243B]">
                          {order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FFFFFF] border border-[#E6E2DC] text-[#17243B]">
                          {order.packageTier}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#17243B] mt-0.5">
                        {order.clientName} ({order.clientEmail})
                      </h4>
                      <p className="text-[11px] text-[#777781]">
                        {order.serviceType.replace(/_/g, ' ')} • Stage: {order.currentStage}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#17243B]">
                        Revisions Used: {order.revisionsUsed} of {order.revisionAllowance}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

