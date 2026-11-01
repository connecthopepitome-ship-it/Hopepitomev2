'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllOrders,
  subscribeAllTasks,
  subscribeAllInvoices,
  subscribeProjects,
  subscribeCrmLeads,
} from '@/lib/firebase/firestore';
import type { ServiceOrder, CareerTask, CareerInvoice, EnterpriseProjectRecord, CrmLead } from '@/lib/career/types';
import {
  Briefcase,
  RotateCcw,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  FolderKanban,
  Users,
  Grid,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { adminProfile, role } = useAdminAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [invoices, setInvoices] = useState<CareerInvoice[]>([]);
  const [projects, setProjects] = useState<EnterpriseProjectRecord[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
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

    const unsubProjects = subscribeProjects((allProjects) => {
      setProjects(allProjects);
    });

    const unsubLeads = subscribeCrmLeads((allLeads) => {
      setLeads(allLeads);
    });

    return () => {
      unsubOrders();
      unsubTasks();
      unsubInvoices();
      unsubProjects();
      unsubLeads();
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
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Ambient Top Command Ribbon */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-xs uppercase tracking-wider font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                COMMAND & TELEMETRY
              </span>
              <span className="text-secondary font-label-md text-xs">•</span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#00236f] text-white">
                {role.toUpperCase()}
              </span>
              <span className="text-secondary font-label-md text-xs hidden sm:inline">
                Welcome back, {adminProfile?.displayName || 'Lead Administrator'}
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Enterprise Operations Control Center
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Supervising multi-division IT engineering solutions, career services studio orders, staff resource utilization, and client deliverables.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href="/career-services/admin/projects"
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition shadow-sm inline-flex items-center gap-1.5"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Project Hub</span>
            </Link>
            <Link
              href="/career-services/admin/tasks"
              className="px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-semibold text-primary transition inline-flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Task Board</span>
            </Link>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Engagements */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Active Engagements</span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {activeOrders.length + projects.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                Live
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>{projects.length} IT Projects • {activeOrders.length} Orders</span>
              <span className="text-primary font-semibold">100% Operational</span>
            </div>
            <div className="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>

          {/* Card 2: Revisions & Quality Review */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Revisions & QA Queue</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-label-sm text-xs font-semibold">
                In Review
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-purple-700 tabular-nums">
                {inRevision.length + pendingReview.length}
              </span>
              <div className="flex items-center gap-1 text-xs text-secondary">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{inRevision.length} Client Feedback</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Client Review Threshold</span>
              <span className="text-emerald-700 font-semibold">96.4% Approval</span>
            </div>
            <div className="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>

          {/* Card 3: Staff Resource Tasks */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Assigned Tasks</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {openTasks.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-label-sm text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sprint Active
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Capacity Balanced</span>
              <span className="text-on-surface font-semibold">84% Load</span>
            </div>
            <div className="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>

          {/* Card 4: Realized Revenue */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Realized Invoicing</span>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                ${totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs text-amber-700 font-semibold font-mono">
                +${pendingInvoiced.toLocaleString()} pend.
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Collection Assurance</span>
              <span className="text-emerald-700 font-semibold">98.2% Settle</span>
            </div>
            <div className="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container h-full rounded-full" style={{ width: '98%' }}></div>
            </div>
          </div>
        </div>

        {/* Priority Action Alerts Ribbon */}
        {(inRevision.length > 0 || pendingReview.length > 0) && (
          <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <AlertCircle className="w-4 h-4 text-purple-700" />
              <span>Priority Studio & Engineering Items Requiring Supervisor Attention</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {inRevision.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white border border-purple-100 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-primary block text-sm">
                      {inRevision.length} Revision Requests Active
                    </span>
                    <span className="text-xs text-secondary">
                      Client feedback notes registered; consultants editing deliverables.
                    </span>
                  </div>
                  <Link
                    href="/career-services/admin/revisions"
                    className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 text-xs font-semibold hover:bg-purple-200 transition"
                  >
                    Open Queue
                  </Link>
                </div>
              )}

              {pendingReview.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white border border-amber-100 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="font-bold text-primary block text-sm">
                      {pendingReview.length} Drafts Awaiting Sign-Off
                    </span>
                    <span className="text-xs text-secondary">
                      Milestone packages delivered to client portal; awaiting sign-off.
                    </span>
                  </div>
                  <Link
                    href="/career-services/admin/deliverables"
                    className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-semibold hover:bg-amber-200 transition"
                  >
                    View Drafts
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Multi-Division Core Navigation Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            href="/career-services/admin/projects"
            className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-5 h-5 text-[#00236f]" />
            </div>
            <h3 className="font-bold text-sm text-primary">Project Management Hub</h3>
            <p className="text-xs text-secondary mt-0.5">SaaS & Enterprise Deliveries</p>
          </Link>

          <Link
            href="/career-services/admin/tasks"
            className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-sm text-primary">Staff Operations Board</h3>
            <p className="text-xs text-secondary mt-0.5">Work Orders & Sprint Kanban</p>
          </Link>

          <Link
            href="/career-services/admin/clients"
            className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="font-bold text-sm text-primary">Customer 360 Directory</h3>
            <p className="text-xs text-secondary mt-0.5">Accounts, Dossiers & SLAs</p>
          </Link>

          <Link
            href="/career-services/admin/services"
            className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-sm transition group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Grid className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-sm text-primary">Service Catalogue Engine</h3>
            <p className="text-xs text-secondary mt-0.5">Bundle Templates & Add-ons</p>
          </Link>
        </div>

        {/* Live Delivery Stream (Responsive Table -> Cards on Mobile) */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/30 gap-2">
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-primary">
                Active Client Pipeline Stream ({orders.length})
              </h2>
              <p className="font-body-sm text-xs text-secondary">
                Real-time operational status across resume development, IT deliverables, and portfolio deployments.
              </p>
            </div>
            <Link
              href="/career-services/admin/orders"
              className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1 transition self-start sm:self-center"
            >
              <span>View full pipeline matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-secondary">
              No orders registered in the system yet. Live client submissions will appear here automatically.
            </div>
          ) : (
            <>
              {/* Desktop Data Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container-low text-secondary font-label-sm uppercase tracking-wider border-b border-outline-variant/30">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Order / Client</th>
                      <th className="py-3 px-4 font-semibold">Service Package</th>
                      <th className="py-3 px-4 font-semibold">Operational Stage</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-body-sm">
                    {orders.slice(0, 8).map((order) => (
                      <tr key={order.id} className="hover:bg-surface-container-low/50 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold text-primary block">
                            {order.orderNumber}
                          </span>
                          <span className="text-on-surface font-semibold block text-sm">
                            {order.clientName}
                          </span>
                          <span className="text-secondary text-xs">{order.clientEmail}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-on-surface font-medium block">
                            {order.serviceType.replace(/_/g, ' ')}
                          </span>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-high text-secondary border border-outline-variant/30">
                            {order.packageTier}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-on-surface">{order.currentStage}</span>
                          <div className="w-24 bg-surface-container-high h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="bg-primary-container h-full rounded-full"
                              style={{ width: `${order.progressPercent || 30}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href="/career-services/admin/orders"
                            className="px-3 py-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-lowest hover:bg-surface-container-low text-xs font-semibold text-primary transition inline-flex items-center gap-1"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5 text-secondary" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Transformation */}
              <div className="md:hidden space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-surface-container-low/40 border border-outline-variant/30 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary">
                        {order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-primary">{order.clientName}</h4>
                      <p className="text-xs text-secondary">{order.serviceType.replace(/_/g, ' ')} • {order.packageTier}</p>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                      <span className="text-secondary font-medium">Stage: {order.currentStage}</span>
                      <Link
                        href="/career-services/admin/orders"
                        className="px-3 py-1.5 rounded-lg bg-primary-container text-white text-xs font-semibold"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
