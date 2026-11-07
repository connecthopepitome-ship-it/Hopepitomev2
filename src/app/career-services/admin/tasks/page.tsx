'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeAllTasks,
  saveTask,
  subscribeAllOrders,
  logActivity,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type { CareerTask, TaskStatus, TaskPriority, ServiceOrder, StaffUser } from '@/lib/career/types';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  User,
  Users,
  Trash2,
  X,
  ChevronRight,
  TrendingUp,
  Settings2,
  Calendar,
  Layers,
  ArrowRight,
  Shield,
  Briefcase,
  Check,
} from 'lucide-react';

export default function AdminTasksPage() {
  const { adminProfile, role } = useAdminAuth();
  const [tasks, setTasks] = useState<CareerTask[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  // Filters & State
  const [selectedSprint, setSelectedSprint] = useState('Sprint 44 - Enterprise Rollout');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedSquad, setSelectedSquad] = useState('all');

  // New task form state
  const [orderId, setOrderId] = useState('');
  const [title, setTitle] = useState('');
  const [assignedName, setAssignedName] = useState('');
  const [storyPoints, setStoryPoints] = useState(5);
  const [squadDomain, setSquadDomain] = useState('DevOps & Infra');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [scopeNotes, setScopeNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubTasks = subscribeAllTasks((list) => {
      setTasks(list);
      setLoading(false);
    });

    const unsubOrders = subscribeAllOrders((list) => {
      setOrders(list);
      if (list.length > 0 && !orderId) {
        setOrderId(list[0].id);
      }
    });

    const unsubStaff = subscribeStaffUsers((st) => setStaffList(st));

    return () => {
      unsubTasks();
      unsubOrders();
      unsubStaff();
    };
  }, [orderId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const taskId = `HPE-${Math.floor(4700 + Math.random() * 300)}`;
    const selectedOrder = orders.find((o) => o.id === orderId);

    const newTask: CareerTask = {
      id: taskId,
      orderId: orderId || 'general',
      orderNumber: selectedOrder?.orderNumber || 'HPE-TASK',
      clientId: selectedOrder?.clientId || 'internal',
      title: title.trim(),
      assignedToName: assignedName.trim() || staffList[0]?.fullName || 'Sarah Jenkins',
      status: 'TODO',
      priority,
      dueDate: dueDate || 'Due in 3 days',
      checklist: [
        { id: '1', text: 'Define technical architecture & DoD', completed: false },
        { id: '2', text: 'Execute deployment sprint & test coverage', completed: false },
        { id: '3', text: 'Peer review & UAT compliance sign-off', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    try {
      await saveTask(newTask);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Lead Architect',
        actorRole: role,
        action: 'TASK_CREATED',
        entityType: 'TASK',
        entityId: taskId,
        summary: `Created task "${title}" assigned to ${assignedName || 'staff'}`,
      });

      setShowDrawer(false);
      setTitle('');
      setAssignedName('');
      setScopeNotes('');
    } catch (err: any) {
      alert('Error saving task: ' + (err?.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChecklist = async (task: CareerTask, itemId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const allDone = updatedChecklist.every((i) => i.completed);
    const updatedTask: CareerTask = {
      ...task,
      checklist: updatedChecklist,
      status: allDone ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: allDone ? new Date().toISOString() : undefined,
    };

    try {
      await saveTask(updatedTask);
    } catch (e) {
      console.error('Error updating task checklist:', e);
    }
  };

  const handleUpdateStatus = async (task: CareerTask, newStatus: TaskStatus) => {
    try {
      await saveTask({
        ...task,
        status: newStatus,
        completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
      });
    } catch (err: any) {
      alert('Failed to update status: ' + err?.message);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesAssignee = selectedAssignee === 'all' || (t.assignedToName || '').toLowerCase().includes(selectedAssignee.toLowerCase());
    return matchesPriority && matchesAssignee;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'IN_PROGRESS');
  const reviewTasks = filteredTasks.filter((t) => t.status === 'REVIEW' as any);
  const completedTasks = filteredTasks.filter((t) => t.status === 'COMPLETED');

  return (
    <AdminLayout>
      <div className="flex flex-col w-full gap-5 font-['Manrope',sans-serif]">
        {/* Top Command Ribbon & Header */}
        <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
              <span className="hover:text-slate-800 cursor-pointer">Operations</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hover:text-slate-800 cursor-pointer">Delivery Engine</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#173B8F] font-bold">Staff Task Board</span>
            </nav>

            {/* Right Status Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#173B8F] animate-ping" />
                Sprint Active: Day 6 / 14
              </span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] text-slate-900 font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Staff Operations & Resource Board
              </h1>
              <p className="text-[14px] text-slate-600 leading-relaxed mt-1">
                Multi-disciplinary task distribution, sprint velocity, workload balancing, and SLA adherence across engineering and career delivery squads.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedSprint}
                onChange={(e) => setSelectedSprint(e.target.value)}
                className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold focus:outline-none cursor-pointer"
              >
                <option>Sprint 44 - Enterprise Rollout</option>
                <option>Sprint 43 - Financial Gateway Patch</option>
                <option>Sprint 42 - Core Telemetry v3</option>
              </select>

              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Assignees ({staffList.length || 16})</option>
                {staffList.map((s) => (
                  <option key={s.uid} value={s.fullName}>
                    {s.fullName} ({s.designation})
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">Priority: All</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Standard / Routine</option>
              </select>

              <button
                onClick={() => setShowDrawer(true)}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5 Workload & Sprint Pulse Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* Card 1: Active Tasks */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Active Sprint Tasks
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#173B8F]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {tasks.length || 64}
              </span>
              <span className="text-[12px] text-slate-500">total scheduled</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 text-[12px] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% on schedule</span>
            </div>
          </div>

          {/* Card 2: In Progress */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                In Progress
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {inProgressTasks.length || 22}
              </span>
              <span className="text-[12px] text-slate-500">concurrent items</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#173B8F] h-full rounded-full" style={{ width: '45%' }} />
            </div>
          </div>

          {/* Card 3: Review & QA */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Review & QA
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {reviewTasks.length || 14}
              </span>
              <span className="text-[12px] text-slate-500">in review cycle</span>
            </div>
            <span className="text-[12px] text-slate-500">Avg turnaround: 3.4 hrs</span>
          </div>

          {/* Card 4: Completed */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                Completed (Sprint)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-emerald-800 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {completedTasks.length || 28}
              </span>
              <span className="text-[12px] text-slate-500">deployed</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 text-[12px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>+18.2% vs Sprint 43</span>
            </div>
          </div>

          {/* Card 5: Team Capacity Indicator */}
          <div className="bg-[#173B8F] text-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-200 font-['Plus_Jakarta_Sans',sans-serif]">
                Team Capacity
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold tracking-widest text-[#6ffbbe]">
                SLA OPTIMAL
              </span>
            </div>
            <div className="flex items-end justify-between my-2">
              <div>
                <span className="text-[26px] sm:text-[32px] font-bold tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                  88%
                </span>
                <div className="text-[12px] text-blue-200">16 Staff Allocated</div>
              </div>
              <svg className="w-10 h-10 -mb-1" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#6ffbbe]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="88, 100"
                  strokeLinecap="round"
                  strokeWidth="3.8"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[11px] text-blue-200 pt-1 border-t border-white/10">
              <span>Velocity Balance</span>
              <span className="font-bold text-[#6ffbbe]">12h buffer left</span>
            </div>
          </div>
        </div>

        {/* 4 Columns Interactive Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {/* Column 1: Backlog & Scoping */}
          <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h2 className="text-[14px] font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                  Backlog & Scoping
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-white text-slate-700 text-[11px] font-bold border border-slate-200">
                {todoTasks.length || 8}
              </span>
            </div>

            <div className="space-y-2.5">
              {(todoTasks.length === 0 ? [
                {
                  id: 'HPE-4812',
                  title: 'Multi-Region AWS GovCloud Terraform state federation',
                  assignedToName: 'Alexandre P.',
                  priority: 'MEDIUM',
                  dueDate: 'Due in 5d',
                  points: '5 SP',
                  tags: ['DevOps', 'Cloud'],
                },
                {
                  id: 'HPE-4820',
                  title: 'Sub-resource integrity (SRI) headers audit across micro-frontends',
                  assignedToName: 'Zoya K.',
                  priority: 'HIGH',
                  dueDate: 'Due in 2d',
                  points: '3 SP',
                  tags: ['Security', 'Frontend'],
                },
              ] : todoTasks).map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                    <span className="font-bold text-slate-700">{t.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                      {t.points || '5 SP'}
                    </span>
                  </div>

                  <h3 className="font-bold text-[13px] text-slate-900 leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                    {t.title}
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {t.tags?.[0] || 'DevOps'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
                        {t.assignedToName.charAt(0)}
                      </div>
                      <span className="font-medium text-[11px]">{t.assignedToName}</span>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(t, 'IN_PROGRESS')}
                      className="text-[11px] font-bold text-[#173B8F] hover:underline"
                    >
                      Start →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#173B8F]" />
                <h2 className="text-[14px] font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                  In Progress
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#dae2fd] text-[#00164e] text-[11px] font-bold">
                {inProgressTasks.length || 12}
              </span>
            </div>

            <div className="space-y-2.5">
              {(inProgressTasks.length === 0 ? [
                {
                  id: 'HPE-4791',
                  title: 'Implement OAuth2 PKCE & SSO for Apex Global',
                  assignedToName: 'Sarah Jenkins',
                  priority: 'HIGH',
                  dueDate: 'Due Tomorrow',
                  points: '8 SP',
                  checklist: [{ completed: true }, { completed: true }, { completed: true }, { completed: false }],
                },
                {
                  id: 'HPE-4796',
                  title: 'Kubernetes Cluster Auto-scaler tuning',
                  assignedToName: 'David Chen',
                  priority: 'MEDIUM',
                  dueDate: 'Due in 3d',
                  points: '5 SP',
                  checklist: [{ completed: true }, { completed: false }],
                },
              ] : inProgressTasks).map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">{t.id}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px]">
                        {t.priority}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{t.dueDate}</span>
                  </div>

                  <h3 className="font-bold text-[13px] text-slate-900 leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                    {t.title}
                  </h3>

                  {/* Subtask checklist progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Subtasks Progress</span>
                      <span className="font-bold text-slate-800">
                        {t.checklist ? t.checklist.filter((i: any) => i.completed).length : 2} / {t.checklist?.length || 3}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#173B8F] h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[12px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#132c6b] text-white text-[10px] font-bold flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
                        {t.assignedToName.charAt(0)}
                      </div>
                      <span className="font-medium text-[11px]">{t.assignedToName}</span>
                    </div>
                    <button
                      onClick={() => handleUpdateStatus(t, 'COMPLETED')}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                    >
                      Complete <Check className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: QA & Client Review */}
          <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h2 className="text-[14px] font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                  QA & Client Review
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-white text-slate-700 text-[11px] font-bold border border-slate-200">
                {reviewTasks.length || 7}
              </span>
            </div>

            <div className="space-y-2.5">
              {(reviewTasks.length === 0 ? [
                {
                  id: 'HPE-4775',
                  title: 'Payment Gateway Stripe Integration Webhook hardening',
                  assignedToName: 'Vikram S.',
                  priority: 'CRITICAL',
                  dueDate: 'UAT Ready',
                  points: '13 SP',
                },
                {
                  id: 'HPE-4780',
                  title: 'SLA Dashboard Metrics sync cronjob telemetry',
                  assignedToName: 'Tanya B.',
                  priority: 'MEDIUM',
                  dueDate: 'QA Pass',
                  points: '3 SP',
                },
              ] : reviewTasks).map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-red-600 font-['Plus_Jakarta_Sans',sans-serif]">{t.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                      UAT Ready
                    </span>
                  </div>

                  <h3 className="font-bold text-[13px] text-slate-900 leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                    {t.title}
                  </h3>

                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>2 bugs resolved, ready for sign-off</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[12px] text-slate-600">
                    <span className="font-medium text-[11px]">{t.assignedToName}</span>
                    <button
                      onClick={() => handleUpdateStatus(t, 'COMPLETED')}
                      className="text-[11px] font-bold text-[#173B8F] hover:underline"
                    >
                      Approve & Merge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Completed & Deployed */}
          <div className="bg-slate-100/80 rounded-xl p-3.5 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h2 className="text-[14px] font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                  Completed & Deployed
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                {completedTasks.length || 24}
              </span>
            </div>

            <div className="space-y-2.5">
              {(completedTasks.length === 0 ? [
                {
                  id: 'HPE-4762',
                  title: 'Redis Cluster Redis-Sentinel fallback failover config',
                  assignedToName: 'David Chen',
                  note: 'Deployment tag v2.4.11-rc4 pushed cleanly',
                  time: 'Today, 09:42 EST',
                },
                {
                  id: 'HPE-4759',
                  title: 'Career Profile CSV batch export for HR enterprise tier',
                  assignedToName: 'Elena Rostova',
                  note: 'Validated against 50,000 synthetic test profiles',
                  time: 'Yesterday, 17:15',
                },
              ] : completedTasks).map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5 opacity-90 hover:opacity-100 transition"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">{t.id}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PROD LIVE
                    </span>
                  </div>

                  <h3 className="font-bold text-[13px] text-slate-500 line-through leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                    {t.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {t.note || 'Delivered & verified against production criteria.'}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>{t.assignedToName}</span>
                    <span className="font-mono">{t.time || 'Completed'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-Time Staff Workload Balancing Matrix */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Real-Time Staff Workload Balancing
              </h2>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Continuous allocation tracking based on active story point commitment vs sprint velocity caps.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Balanced Velocity
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Staff 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#173B8F] text-white flex items-center justify-center font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif]">
                    SJ
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">Sarah Jenkins</div>
                    <div className="text-[11px] text-slate-500">Lead Arch (14 SP)</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">95% (High)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            {/* Staff 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif]">
                    DC
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">David Chen</div>
                    <div className="text-[11px] text-slate-500">DevOps (12 SP)</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">80% (Norm)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Staff 3 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif]">
                    ER
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">Elena Rostova</div>
                    <div className="text-[11px] text-slate-500">Career Ops (11 SP)</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">73% (Norm)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '73%' }} />
              </div>
            </div>

            {/* Staff 4 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif]">
                    VS
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">Vikram Singh</div>
                    <div className="text-[11px] text-slate-500">FinTech (16 SP)</div>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold">100% (Cap)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Side Flyout Drawer for 'Add New Task' */}
        {showDrawer && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-end font-['Manrope',sans-serif]">
            <div className="w-full max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                    Operations Task Engine
                  </span>
                  <h2 className="text-[17px] font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">
                    Dispatch New Work Order
                  </h2>
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="p-5 space-y-4 flex-1">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Task Title & Objective *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deploy Canary build for API Gateway v4.2"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white focus:border-[#173B8F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Sprint Destination
                    </label>
                    <select
                      value={selectedSprint}
                      onChange={(e) => setSelectedSprint(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                    >
                      <option>Sprint 44 (Current)</option>
                      <option>Sprint 45 (Upcoming)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Story Points
                    </label>
                    <select
                      value={storyPoints}
                      onChange={(e) => setStoryPoints(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                    >
                      <option value={1}>1 SP (Trivial)</option>
                      <option value={2}>2 SP (Minor)</option>
                      <option value={3}>3 SP (Standard)</option>
                      <option value={5}>5 SP (Moderate)</option>
                      <option value={8}>8 SP (Complex)</option>
                      <option value={13}>13 SP (Architectural)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Squad Domain
                    </label>
                    <select
                      value={squadDomain}
                      onChange={(e) => setSquadDomain(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                    >
                      <option>DevOps & Infra</option>
                      <option>Enterprise IAM</option>
                      <option>Career Workflows</option>
                      <option>FinOps Billing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      SLA Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                    >
                      <option value="LOW">Low (Routine)</option>
                      <option value="MEDIUM">Normal / Standard</option>
                      <option value="HIGH">High (24-48h)</option>
                      <option value="CRITICAL">Critical (Blocker)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Primary Assignee
                  </label>
                  <select
                    value={assignedName}
                    onChange={(e) => setAssignedName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none"
                  >
                    <option value="">Auto-assign to squad lead</option>
                    {staffList.map((s) => (
                      <option key={s.uid} value={s.fullName}>
                        {s.fullName} ({s.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Task Scope & Acceptance Criteria
                  </label>
                  <textarea
                    rows={4}
                    value={scopeNotes}
                    onChange={(e) => setScopeNotes(e.target.value)}
                    placeholder="Detail definition of done, security validations, and target environment..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDrawer(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-md disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Create & Assign Task'}
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
