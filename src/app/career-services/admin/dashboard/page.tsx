'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllOrders,
  subscribeAllTasks,
  subscribeAllInvoices,
  subscribeProjects,
  subscribeCrmLeads,
  subscribeCrmFollowUps,
} from '@/lib/firebase/firestore';
import type {
  ServiceOrder,
  CareerTask,
  CareerInvoice,
  EnterpriseProjectRecord,
  CrmLead,
  CrmFollowUp,
} from '@/lib/career/types';
import {
  Inbox,
  Briefcase,
  CheckSquare,
  CreditCard,
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  UserPlus,
  FilePlus,
  Receipt,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { adminProfile, role } = useAdminAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [invoices, setInvoices] = useState<CareerInvoice[]>([]);
  const [projects, setProjects] = useState<EnterpriseProjectRecord[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubOrders = subscribeAllOrders((allOrders) => {
      setOrders(allOrders);
      setLoading(false);
    });
    const unsubTasks = subscribeAllTasks((allTasks) => setTasks(allTasks));
    const unsubInvoices = subscribeAllInvoices((allInvoices) => setInvoices(allInvoices));
    const unsubProjects = subscribeProjects((allProjects) => setProjects(allProjects));
    const unsubLeads = subscribeCrmLeads((allLeads) => setLeads(allLeads));
    const unsubFollowUps = subscribeCrmFollowUps((allFollowUps) => setFollowUps(allFollowUps));

    return () => {
      unsubOrders();
      unsubTasks();
      unsubInvoices();
      unsubProjects();
      unsubLeads();
      unsubFollowUps();
    };
  }, []);

  // 1. Key Business Indicators (Section 8)
  const newLeadsCount = useMemo(() => {
    return leads.filter((l) => (l.stage === 'New' || l.stage === 'New Lead') || l.stage === 'Contacted').length;
  }, [leads]);

  const activeProjectsCount = useMemo(() => {
    return projects.filter((p) => p.status !== 'COMPLETED' && (p.status as any) !== 'CANCELLED').length;
  }, [projects]);

  const pendingTasksCount = useMemo(() => {
    return tasks.filter((t) => t.status !== 'COMPLETED').length;
  }, [tasks]);

  const outstandingPaymentsTotal = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === 'ISSUED')
      .reduce((sum, inv) => sum + (inv.total || 0), 0);
  }, [invoices]);

  // 2. Today's Priorities
  const todayPriorities = useMemo(() => {
    const list: Array<{ id: string; type: 'TASK' | 'FOLLOWUP' | 'ORDER'; title: string; subtitle: string; tag: string; tagColor: string; href: string }> = [];

    // Urgent / Overdue Tasks
    tasks
      .filter((t) => t.status !== 'COMPLETED' && (t.priority === 'URGENT' || (t.priority as any) === 'HIGH'))
      .slice(0, 3)
      .forEach((t) => {
        list.push({
          id: `task_${t.id}`,
          type: 'TASK',
          title: t.title,
          subtitle: `Assigned: ${t.assignedToName || 'Unassigned'} • Due: ${t.dueDate || 'ASAP'}`,
          tag: t.priority,
          tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
          href: '/career-services/admin/tasks',
        });
      });

    // Scheduled Follow-ups
    followUps
      .filter((f) => f.status !== 'COMPLETED' && f.status !== 'CANCELLED')
      .slice(0, 3)
      .forEach((f) => {
        list.push({
          id: `fu_${f.id}`,
          type: 'FOLLOWUP',
          title: `Follow up: ${f.leadName || 'Prospective Client'}`,
          subtitle: `${f.followUpType || 'Call'} • Due: ${f.dueDate || 'Today'}`,
          tag: 'CALL',
          tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
          href: '/career-services/admin/crm/follow-ups',
        });
      });

    // Pending Client Reviews
    orders
      .filter((o) => o.status === 'CLIENT_REVIEW')
      .slice(0, 2)
      .forEach((o) => {
        list.push({
          id: `ord_${o.id}`,
          type: 'ORDER',
          title: `Awaiting Review: ${o.clientName}`,
          subtitle: `${o.serviceType} • Order #${o.orderNumber}`,
          tag: 'REVIEW',
          tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
          href: '/career-services/admin/orders',
        });
      });

    return list.slice(0, 5);
  }, [tasks, followUps, orders]);

  // Current Date Formatter
  const currentDateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
        {/* Welcome Area (Section 8) */}
        <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{currentDateFormatted}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#173B8F] border border-blue-100 uppercase">
                {role.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              {greetingTime}, {adminProfile?.displayName || 'Administrator'}
            </h1>
            <p className="text-xs text-slate-500">
              Here is what requires your attention across client deliveries and operations today.
            </p>
          </div>

          {/* Quick Actions Bar (Mobile-friendly Grid) */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/career-services/admin/crm/leads"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Lead</span>
            </Link>
            <Link
              href="/career-services/admin/projects"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-violet-600" />
              <span>Projects</span>
            </Link>
            <Link
              href="/career-services/admin/crm/quotations"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quotation</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Business Indicators (Section 8) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: New Leads */}
          <Link
            href="/career-services/admin/crm/leads"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] hover:shadow-md hover:border-blue-200 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                New Leads
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {loading ? '—' : newLeadsCount}
              </span>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center">
                Pipeline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting qualification</p>
          </Link>

          {/* Card 2: Active Projects */}
          <Link
            href="/career-services/admin/projects"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] hover:shadow-md hover:border-violet-200 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Active Projects
              </span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 group-hover:scale-105 transition-transform">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {loading ? '—' : activeProjectsCount}
              </span>
              <span className="text-[11px] text-violet-600 font-semibold">Live delivery</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">IT & Career portfolio</p>
          </Link>

          {/* Card 3: Pending Tasks */}
          <Link
            href="/career-services/admin/tasks"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] hover:shadow-md hover:border-indigo-200 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Pending Tasks
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {loading ? '—' : pendingTasksCount}
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold">In queue</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Staff operations queue</p>
          </Link>

          {/* Card 4: Outstanding Invoices */}
          <Link
            href="/career-services/admin/finance"
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] hover:shadow-md hover:border-emerald-200 transition group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Outstanding Due
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {loading ? '—' : `$${outstandingPaymentsTotal.toLocaleString()}`}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Invoiced</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting client payment</p>
          </Link>
        </div>

        {/* Priorities & Recent Activity Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 2 Cols: Today's Priorities */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Today's Operational Priorities
                </h2>
                <p className="text-[11px] text-slate-500">Urgent tasks, scheduled calls, and review approvals</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {todayPriorities.length} items
              </span>
            </div>

            {todayPriorities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p>No critical bottlenecks or overdue items today.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayPriorities.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition group"
                  >
                    <div className="space-y-0.5 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${item.tagColor}`}>
                          {item.tag}
                        </span>
                        <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#173B8F] transition">
                          {item.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#173B8F] shrink-0 transition" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right 1 Col: Quick Jump Modules */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Quick Operations
              </h2>
              <span className="text-[10px] font-semibold text-blue-600 uppercase">Shortcuts</span>
            </div>

            <div className="space-y-2">
              <Link
                href="/career-services/admin/clients"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Customer 360</p>
                    <p className="text-[10px] text-slate-400">Manage client directory</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition" />
              </Link>

              <Link
                href="/career-services/admin/services"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Service Catalogue</p>
                    <p className="text-[10px] text-slate-400">Configure offerings & SLAs</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
              </Link>

              <Link
                href="/career-services/admin/crm/pipeline"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Sales Pipeline</p>
                    <p className="text-[10px] text-slate-400">Deal velocity Kanban</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition" />
              </Link>

              <Link
                href="/career-services/admin/support"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">SLA Support Center</p>
                    <p className="text-[10px] text-slate-400">Tickets & incident tracking</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Stream (Section 8) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Recent Business Activity
              </h2>
              <p className="text-[11px] text-slate-500">Real-time transactions, leads, and orders</p>
            </div>
            <Link
              href="/career-services/admin/audit"
              className="text-xs text-[#173B8F] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Audit Logs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Inbox className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{lead.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{lead.serviceInterestedIn || 'General Enquiry'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {lead.stage}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
