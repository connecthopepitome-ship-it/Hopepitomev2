'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllOrders,
  subscribeAllTasks,
  subscribeAllInvoices,
} from '@/lib/firebase/firestore';
import type { ServiceOrder, CareerTask, CareerInvoice } from '@/lib/career/types';
import {
  Users,
  Briefcase,
  Clock,
  RotateCcw,
  CheckSquare,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { adminProfile, role } = useAdminAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [invoices, setInvoices] = useState<CareerInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubOrders = subscribeAllOrders((allOrders) => {
      setOrders(allOrders);
      setLoading(false);
    });

    const unsubTasks = subscribeAllTasks((allTasks) => {
      setTasks(allTasks);
    });

    const unsubInvoices = subscribeAllInvoices((allInvoices) => {
      setInvoices(allInvoices);
    });

    return () => {
      unsubOrders();
      unsubTasks();
      unsubInvoices();
    };
  }, []);

  const activeOrders = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const pendingReview = orders.filter((o) => o.status === 'CLIENT_REVIEW');
  const inRevision = orders.filter((o) => o.status === 'REVISION');
  const openTasks = tasks.filter((t) => t.status !== 'COMPLETED');

  // Revenue calculation
  const totalRevenue = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const pendingInvoiced = invoices
    .filter((inv) => inv.status === 'ISSUED')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome & Operations Overview */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                Career Services Operations Desk
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
                {role.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-1">
              Command & Control Center
            </h1>
            <p className="text-xs text-[#777781] mt-0.5">
              Supervising client career profiles, assignment pipelines, document versions, and billing reconciliation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/career-services/admin/orders"
              className="px-3.5 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm"
            >
              Manage Orders
            </Link>
            <Link
              href="/career-services/admin/clients"
              className="px-3.5 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-semibold text-[#17243B] transition"
            >
              Inspect Clients
            </Link>
          </div>
        </div>

        {/* Operational KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Active Orders</span>
              <Briefcase className="w-4 h-4 text-[#8172A8]" />
            </div>
            <div className="text-2xl font-bold text-[#17243B]">
              {activeOrders.length}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              In writing & development
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Revisions Queue</span>
              <RotateCcw className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {inRevision.length}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              Feedback rounds in progress
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Open Staff Tasks</span>
              <CheckSquare className="w-4 h-4 text-[#8172A8]" />
            </div>
            <div className="text-2xl font-bold text-[#17243B]">
              {openTasks.length}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              Assigned checklist items
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Paid Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#17243B]">
              ${totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-amber-700 mt-0.5 block">
              +${pendingInvoiced.toLocaleString()} pending invoice
            </span>
          </div>
        </div>

        {/* Priority Action Alerts */}
        {(inRevision.length > 0 || pendingReview.length > 0) && (
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17243B]">
              <AlertCircle className="w-4 h-4 text-[#8172A8]" />
              <span>Priority Studio Items Requiring Attention</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {inRevision.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#17243B] block">
                      {inRevision.length} Revision Requests Active
                    </span>
                    <span className="text-[11px] text-[#777781]">
                      Client feedback received; writers updating documents.
                    </span>
                  </div>
                  <Link
                    href="/career-services/admin/revisions"
                    className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-[11px] font-medium hover:bg-purple-200 transition"
                  >
                    Open Queue
                  </Link>
                </div>
              )}

              {pendingReview.length > 0 && (
                <div className="p-3 rounded-xl bg-white border border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#17243B] block">
                      {pendingReview.length} Drafts Awaiting Client Approval
                    </span>
                    <span className="text-[11px] text-[#777781]">
                      Deliverables shared; awaiting client review.
                    </span>
                  </div>
                  <Link
                    href="/career-services/admin/deliverables"
                    className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-medium hover:bg-amber-200 transition"
                  >
                    View Drafts
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Service Orders Stream */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
            <div>
              <h3 className="text-sm font-bold text-[#17243B]">
                Active Service Pipeline ({orders.length})
              </h3>
              <p className="text-xs text-[#777781]">
                Real-time status of all client orders across resume writing, ATS, and portfolios.
              </p>
            </div>
            <Link
              href="/career-services/admin/orders"
              className="text-xs font-semibold text-[#8172A8] hover:text-[#17243B] flex items-center gap-1 transition"
            >
              <span>View full pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#777781]">
              No service orders registered yet. New submissions will stream live here.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]/80">
              {orders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F7F5F0]/30 px-2 rounded-lg transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#17243B]">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#F7F5F0] text-[#17243B] border border-[#E6E2DC]">
                        {order.packageTier}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-[#292D36] mt-0.5 font-semibold">
                      {order.clientName} ({order.clientEmail}) —{' '}
                      <span className="text-[#777781] font-normal">
                        {order.serviceType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#777781] hidden md:inline">
                      Stage: <strong className="text-[#17243B]">{order.currentStage}</strong> ({order.progressPercent}%)
                    </span>
                    <Link
                      href={`/career-services/admin/orders`}
                      className="px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-medium text-[#17243B] transition"
                    >
                      Manage
                    </Link>
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

