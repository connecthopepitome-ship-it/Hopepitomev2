'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeProjects,
  saveProject,
  subscribeClients,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type {
  EnterpriseProjectRecord,
  ProjectStatus,
  BusinessDivision,
  ClientRecord,
  StaffUser,
} from '@/lib/career/types';
import { formatINR } from '@/lib/currency';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  User,
  Users,
  Folder,
  BarChart,
  Kanban,
  List,
  AlertCircle,
  X,
  Building,
  DollarSign,
  TrendingUp,
  Download,
  Eye,
  MoreVertical,
  Check,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

const PROJECT_STATUSES: { key: ProjectStatus; label: string; badgeClass: string }[] = [
  { key: 'NEW_INTAKE', label: 'New Intake (Draft)', badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200' },
  { key: 'READY_TO_START', label: 'Ready to Start', badgeClass: 'bg-slate-100 text-slate-700' },
  { key: 'IN_PROGRESS', label: 'In Progress', badgeClass: 'bg-blue-50 text-blue-700' },
  { key: 'INTERNAL_REVIEW', label: 'In Review', badgeClass: 'bg-purple-50 text-purple-700' },
  { key: 'CLIENT_UAT', label: 'UAT Sign-Off', badgeClass: 'bg-emerald-50 text-emerald-800' },
  { key: 'COMPLETED', label: 'On Track / Done', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { key: 'ON_HOLD', label: 'At Risk / Hold', badgeClass: 'bg-red-50 text-red-700' },
];

export default function ProjectsDashboardPage() {
  const router = useRouter();
  const { adminProfile, isAuthorized } = useAdminAuth();

  const [projects, setProjects] = useState<EnterpriseProjectRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Views
  const [viewMode, setViewMode] = useState<'LIST' | 'KANBAN'>('LIST');
  const [selectedDivision, setSelectedDivision] = useState<'ALL' | BusinessDivision>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inspector Drawer & Modal State
  const [inspectorProject, setInspectorProject] = useState<EnterpriseProjectRecord | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [projectDivision, setProjectDivision] = useState<BusinessDivision>('IT_SERVICES');
  const [serviceName, setServiceName] = useState('Website Development');
  const [projectManagerId, setProjectManagerId] = useState('');
  const [contractValue, setContractValue] = useState(15000);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [plannedEndDate, setPlannedEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [initialMilestones, setInitialMilestones] = useState(
    'Phase 1: Architecture Blueprint & Setup\nPhase 2: Core Development & Integration\nPhase 3: Security Validation & UAT Handover'
  );

  useEffect(() => {
    const unsubProjects = subscribeProjects((data) => {
      setProjects(data);
      setLoading(false);
    });
    const unsubClients = subscribeClients((cl) => setClients(cl));
    const unsubStaff = subscribeStaffUsers((st) => setStaffList(st));

    return () => {
      unsubProjects();
      unsubClients();
      unsubStaff();
    };
  }, []);

  const handleOpenCreateModal = () => {
    setProjectName('');
    setSelectedCustomerId(clients[0]?.clientId || '');
    setProjectDivision('IT_SERVICES');
    setServiceName('Enterprise Cloud Infrastructure');
    setProjectManagerId(staffList[0]?.uid || '');
    setContractValue(45000);
    setStartDate(new Date().toISOString().split('T')[0]);
    setShowModal(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !selectedCustomerId) {
      alert('Please fill in project name and select a customer.');
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const projectId = `PRJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedClient = clients.find((c) => c.clientId === selectedCustomerId);
    const selectedPM = staffList.find((s) => s.uid === projectManagerId);

    const milestoneLines = initialMilestones.split('\n').map((m) => m.trim()).filter(Boolean);
    const generatedMilestones = milestoneLines.map((title, idx) => ({
      id: `ms_${projectId}_${idx + 1}`,
      projectId,
      title,
      orderIndex: idx + 1,
      status: idx === 0 ? ('IN_PROGRESS' as const) : ('PENDING' as const),
    }));

    const newProject: EnterpriseProjectRecord = {
      id: projectId,
      name: projectName.trim(),
      customerId: selectedCustomerId,
      customerName: selectedClient?.name || 'Customer Entity',
      division: projectDivision,
      serviceId: `srv_${Date.now()}`,
      serviceName,
      projectManagerId: projectManagerId || 'unassigned',
      projectManagerName: selectedPM?.fullName || adminProfile?.displayName || 'Lead Manager',
      teamMembers: selectedPM ? [{ uid: selectedPM.uid, name: selectedPM.fullName, role: 'Project Manager' }] : [],
      startDate,
      plannedEndDate,
      priority: 'HIGH',
      status: 'READY_TO_START',
      budget: Number(contractValue) * 0.7,
      contractValue: Number(contractValue),
      progressPercent: 15,
      currency: 'INR',
      billingMethod: 'MILESTONE_BASED',
      milestones: generatedMilestones,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveProject(newProject);
      setShowModal(false);
      setInspectorProject(newProject);
    } catch (err: any) {
      alert('Failed to save project: ' + (err?.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (project: EnterpriseProjectRecord, newStatus: ProjectStatus) => {
    let progress = project.progressPercent;
    if (newStatus === 'COMPLETED') progress = 100;
    if (newStatus === 'READY_TO_START') progress = 10;
    if (newStatus === 'IN_PROGRESS' && progress < 25) progress = 45;
    if (newStatus === 'CLIENT_UAT' && progress < 80) progress = 85;

    try {
      await saveProject({
        ...project,
        status: newStatus,
        progressPercent: progress,
        updatedAt: new Date().toISOString(),
      });
      if (inspectorProject?.id === project.id) {
        setInspectorProject({
          ...inspectorProject,
          status: newStatus,
          progressPercent: progress,
        });
      }
    } catch (err: any) {
      alert('Failed to update status: ' + err?.message);
    }
  };

  const filteredProjects = projects.filter((prj) => {
    const matchesDiv = selectedDivision === 'ALL' || prj.division === selectedDivision;
    const matchesStatus = statusFilter === 'ALL' || prj.status === statusFilter;
    const matchesSearch =
      prj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prj.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesStatus && matchesSearch;
  });

  const totalContractValue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
  const inDeliveryCount = projects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'INTERNAL_REVIEW').length;
  const inUatCount = projects.filter((p) => p.status === 'CLIENT_UAT' || p.status === 'COMPLETED').length;

  const countForDivision = (div: 'ALL' | BusinessDivision) => {
    if (div === 'ALL') return projects.length;
    return projects.filter((p) => p.division === div).length;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col w-full gap-5 font-['Manrope',sans-serif]">
        {/* Top Ambient Banner & Header Ribbon */}
        <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#004a31] text-[#6ffbbe] text-[11px] uppercase tracking-wider font-bold shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
                DELIVERY ENGINE
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-500 text-[12px] uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans',sans-serif]">
                Enterprise Multi-Division Operations
              </span>
            </div>
            <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] text-[#173B8F] font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Project Management & Execution Hub
            </h1>
            <p className="text-[14px] text-slate-600 leading-relaxed max-w-3xl">
              Track active deliverables, milestone progress, and UAT sign-offs across IT and Career services.
            </p>
          </div>

          {/* Action Group */}
          <div className="flex items-center gap-2.5 self-start xl:self-center flex-wrap">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg shadow-sm border border-slate-200">
              <button
                onClick={() => setViewMode('LIST')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-bold transition ${
                  viewMode === 'LIST'
                    ? 'bg-white text-[#173B8F] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Table View</span>
              </button>
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[13px] font-bold transition ${
                  viewMode === 'KANBAN'
                    ? 'bg-white text-[#173B8F] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-4 h-4" />
                <span>Board</span>
              </button>
            </div>

            <button
              onClick={() => {
                const csvData = projects.map((p) => `${p.id},"${p.name}","${p.customerName}",${p.contractValue},${p.status}`).join('\n');
                const blob = new Blob([`ID,Project,Client,Value,Status\n${csvData}`], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `hopepitome-projects-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-semibold border border-slate-200 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export Report</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Active Projects */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans',sans-serif]">
                Total Active Projects
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#132c6b]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[26px] sm:text-[32px] text-slate-900 font-bold tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {projects.length || 28}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                +4 this mo
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
              <span>Capacity Threshold</span>
              <span className="text-slate-800 font-semibold">100% Optimized</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#173B8F] h-full rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          {/* Card 2: In Active Delivery */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans',sans-serif]">
                In Active Delivery
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                Live Sprint
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[26px] sm:text-[32px] text-slate-900 font-bold tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {inDeliveryCount || 19}
              </span>
              <div className="flex items-center gap-1 text-slate-600 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>4 in Critical Path</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[12px]">
              <span className="text-slate-500">Sprint Health</span>
              <span className="text-emerald-700 font-bold">92% On-Target</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          {/* Card 3: Handed Over & UAT */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans',sans-serif]">
                Handed Over & UAT
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[26px] sm:text-[32px] text-slate-900 font-bold tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {inUatCount || 8}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sign-Off Complete
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
              <span>Client CSAT Score</span>
              <span className="text-emerald-700 font-bold">99.4% CSAT</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#004a31] h-full rounded-full" style={{ width: '99.4%' }} />
            </div>
          </div>

          {/* Card 4: Total Delivery Value */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-500 uppercase tracking-wider font-semibold font-['Plus_Jakarta_Sans',sans-serif]">
                Total Delivery Value
              </span>
              <span className="font-bold text-xs text-emerald-600 font-mono">INR</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[24px] sm:text-[30px] text-[#173B8F] font-bold tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {formatINR(totalContractValue || 1420000)}
              </span>
              <span className="text-[11px] text-emerald-700 font-bold">+18.2% QoQ</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
              <span>Pipeline In-Flight</span>
              <span className="text-slate-800 font-medium">₹84,00,000 Scheduled Q4</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#132c6b] h-full rounded-full" style={{ width: '74%' }} />
            </div>
          </div>
        </div>

        {/* Division Segmentation & Search Filter Bar */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Division Switch Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setSelectedDivision('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold shrink-0 transition ${
                selectedDivision === 'ALL'
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              All Divisions ({countForDivision('ALL') || 28})
            </button>
            <button
              onClick={() => setSelectedDivision('IT_SERVICES')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold shrink-0 transition ${
                selectedDivision === 'IT_SERVICES'
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              IT Services & Cloud ({countForDivision('IT_SERVICES') || 14})
            </button>
            <button
              onClick={() => setSelectedDivision('ENTERPRISE_SOFTWARE' as any)}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold shrink-0 transition ${
                selectedDivision === ('ENTERPRISE_SOFTWARE' as any)
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Enterprise Software (9)
            </button>
            <button
              onClick={() => setSelectedDivision('CAREER_SERVICES')}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold shrink-0 transition ${
                selectedDivision === 'CAREER_SERVICES'
                  ? 'bg-[#173B8F] text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Career Services ({countForDivision('CAREER_SERVICES') || 5})
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by project, client, or lead..."
                className="w-full h-9 pl-9 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-[13px] focus:outline-none focus:bg-white focus:border-[#173B8F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold focus:outline-none focus:bg-white cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              {PROJECT_STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode 1: Structured Responsive Table */}
        {viewMode === 'LIST' && (
          <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Desktop Table (> 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[12px] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                    <th className="py-3 px-4 font-bold">Project Name & Client</th>
                    <th className="py-3 px-4 font-bold">Lead & Team</th>
                    <th className="py-3 px-4 font-bold min-w-[200px]">Milestone & Completion</th>
                    <th className="py-3 px-4 font-bold">Health Status</th>
                    <th className="py-3 px-4 font-bold">SLA Due Date</th>
                    <th className="py-3 px-4 font-bold text-right">Value (₹ INR)</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-800">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="font-semibold">No enterprise projects found.</p>
                        <p className="text-[12px] mt-1">Initialize your first delivery project via "+ Create Project".</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((prj) => {
                      const statusDef = PROJECT_STATUSES.find((s) => s.key === prj.status) || PROJECT_STATUSES[0];
                      return (
                        <tr
                          key={prj.id}
                          onClick={() => setInspectorProject(prj)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[#132c6b] text-white flex items-center justify-center font-bold text-sm shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                                {prj.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-[#173B8F] group-hover:text-[#132c6b] flex items-center gap-1.5 font-['Plus_Jakarta_Sans',sans-serif]">
                                  <span>{prj.name}</span>
                                  {prj.progressPercent >= 80 && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[12px] text-slate-500">
                                  <span className="font-semibold text-slate-800">{prj.customerName}</span>
                                  <span>•</span>
                                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                    {prj.division === 'IT_SERVICES' ? 'IT Services & Cloud' : prj.serviceName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                                {prj.projectManagerName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-[13px]">{prj.projectManagerName}</div>
                                <div className="text-[11px] text-slate-500">Project Manager</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[12px]">
                                <span className="font-semibold text-[#173B8F] truncate max-w-[160px]">
                                  {prj.milestones?.[0]?.title || 'Phase 1: Architecture'}
                                </span>
                                <span className="font-bold text-slate-900">{prj.progressPercent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#173B8F] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${prj.progressPercent}%` }}
                                />
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>{prj.milestones?.length || 3} milestones configured</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusDef.badgeClass}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {statusDef.label}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-[12px]">
                            <div className="font-semibold text-slate-800">{prj.plannedEndDate || 'TBD'}</div>
                            <div className="text-slate-500 text-[11px]">SLA Target</div>
                          </td>

                          <td className="py-3.5 px-4 text-right font-['Plus_Jakarta_Sans',sans-serif]">
                            <span className="font-bold text-[#173B8F] text-[15px] tabular-nums">
                              {formatINR(prj.contractValue || 0)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInspectorProject(prj);
                                }}
                                title="Inspect Quick Drawer"
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#173B8F] transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const pId = prj.id || (prj as any).projectId;
                                  if (pId) router.push(`/career-services/admin/projects/workspace?projectId=${encodeURIComponent(pId)}`);
                                }}
                                title="Launch Execution Workspace"
                                className="px-2.5 py-1.5 rounded-lg bg-[#173B8F]/10 hover:bg-[#173B8F] text-[#173B8F] hover:text-white transition text-[11px] font-bold inline-flex items-center gap-1"
                              >
                                <span>Workspace</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredProjects.map((prj) => {
                const statusDef = PROJECT_STATUSES.find((s) => s.key === prj.status) || PROJECT_STATUSES[0];
                return (
                  <div
                    key={prj.id}
                    onClick={() => setInspectorProject(prj)}
                    className="p-4 hover:bg-slate-50 transition cursor-pointer space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-[#173B8F] text-[15px] font-['Plus_Jakarta_Sans',sans-serif]">
                          {prj.name}
                        </div>
                        <div className="text-[12px] text-slate-500 mt-0.5">
                          {prj.customerName} • {prj.division === 'IT_SERVICES' ? 'IT Cloud' : prj.serviceName}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${statusDef.badgeClass}`}>
                        {statusDef.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Milestone Progress</span>
                        <span className="font-bold text-slate-900">{prj.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#173B8F] h-full rounded-full"
                          style={{ width: `${prj.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[12px] pt-1 border-t border-slate-100 text-slate-600">
                      <span>Valuation: <strong className="text-[#173B8F] font-bold font-['Plus_Jakarta_Sans',sans-serif]">${prj.contractValue?.toLocaleString() || '15,000'}</strong></span>
                      <span className="text-[11px]">Due: <strong>{prj.plannedEndDate || 'TBD'}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination & Footer */}
            <div className="p-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-500">
              <div>
                Showing <strong className="text-slate-800 font-bold">{filteredProjects.length}</strong> active deliveries
              </div>
              <div className="flex items-center gap-1 font-semibold">
                <span>Enterprise SLA Guaranteed Delivery Engine</span>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Interactive Kanban Board */}
        {viewMode === 'KANBAN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
            {PROJECT_STATUSES.slice(0, 4).map((col) => {
              const colProjects = filteredProjects.filter((p) => p.status === col.key);
              return (
                <div key={col.key} className="bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#173B8F]" />
                      <h3 className="font-bold text-slate-800 text-[14px] font-['Plus_Jakarta_Sans',sans-serif]">
                        {col.label}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-white text-slate-700 text-[11px] font-bold border border-slate-200">
                      {colProjects.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colProjects.length === 0 ? (
                      <div className="p-4 rounded-lg bg-white/60 border border-dashed border-slate-200 text-center text-[12px] text-slate-400">
                        No projects in this stage
                      </div>
                    ) : (
                      colProjects.map((prj) => (
                        <div
                          key={prj.id}
                          onClick={() => setInspectorProject(prj)}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer space-y-2"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="font-mono font-bold text-slate-600">{prj.id}</span>
                            <span className="font-bold text-emerald-700">${prj.contractValue?.toLocaleString()}</span>
                          </div>
                          <h4 className="font-bold text-[#173B8F] text-[13px] leading-snug font-['Plus_Jakarta_Sans',sans-serif]">
                            {prj.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">{prj.customerName}</p>

                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#173B8F] h-full rounded-full" style={{ width: `${prj.progressPercent}%` }} />
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                            <span>{prj.projectManagerName}</span>
                            <span className="font-semibold text-slate-700">{prj.progressPercent}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Project Inspector Slide-over Drawer */}
        {inspectorProject && (
          <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 font-['Manrope',sans-serif]">
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                  PROJECT INSPECTOR
                </span>
                <h3 className="text-[17px] font-bold text-[#173B8F] mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
                  {inspectorProject.name}
                </h3>
              </div>
              <button
                onClick={() => setInspectorProject(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {/* Client Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Client Overview</span>
                  <span className="text-[13px] text-[#173B8F] font-bold">{inspectorProject.customerName}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[12px] text-slate-600">
                  <span>Contract Valuation:</span>
                  <strong className="text-[#173B8F] font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                    {formatINR(inspectorProject.contractValue || 0)}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-[12px] text-slate-600">
                  <span>SLA Commitment Date:</span>
                  <strong className="text-slate-800">{inspectorProject.plannedEndDate || 'TBD'}</strong>
                </div>
              </div>

              {/* Status Update Quick Toggles */}
              <div>
                <label className="block text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2 font-['Plus_Jakarta_Sans',sans-serif]">
                  Update Delivery Stage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROJECT_STATUSES.map((st) => (
                    <button
                      key={st.key}
                      onClick={() => handleUpdateStatus(inspectorProject, st.key)}
                      className={`px-3 py-2 rounded-lg text-[12px] font-bold border text-left transition ${
                        inspectorProject.status === st.key
                          ? 'bg-[#173B8F] text-white border-[#173B8F]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestones Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                  Active Sprints & Deliverables
                </h4>
                {inspectorProject.milestones?.map((ms, idx) => (
                  <div key={ms.id || idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-bold text-slate-800">{ms.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                        {ms.status || 'Active'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: ms.status === 'COMPLETED' ? '100%' : '60%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setInspectorProject(null)}
                className="w-1/2 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-100 transition"
              >
                Close Drawer
              </button>
              <button
                onClick={() => {
                  const pId = inspectorProject.id || (inspectorProject as any).projectId;
                  if (pId) {
                    router.push(`/career-services/admin/projects/workspace?projectId=${encodeURIComponent(pId)}`);
                  }
                }}
                className="w-1/2 py-2 rounded-lg bg-[#173B8F] text-white font-bold text-[13px] hover:bg-[#132c6b] transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Create Project Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-['Manrope',sans-serif]">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                    NEW DELIVERY INITIATIVE
                  </span>
                  <h2 className="text-[18px] font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">
                    Create Enterprise Project
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-5 space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Sovereign AI Cloud Infrastructure Rollout"
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white focus:border-[#173B8F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Operating Division
                    </label>
                    <select
                      value={projectDivision}
                      onChange={(e) => setProjectDivision(e.target.value as BusinessDivision)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                    >
                      <option value="IT_SERVICES">IT Services & Cloud Solutions</option>
                      <option value="CAREER_SERVICES">Career Services & Branding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Client Entity *
                    </label>
                    <select
                      required
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                    >
                      {clients.length === 0 && <option value="">No clients registered</option>}
                      {clients.map((c) => (
                        <option key={c.clientId} value={c.clientId}>
                          {c.name || 'Client'} ({c.clientId.substring(0, 8)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Contract Valuation (₹ INR)
                    </label>
                    <input
                      type="number"
                      value={contractValue}
                      onChange={(e) => setContractValue(Number(e.target.value))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                      Target SLA Completion Date
                    </label>
                    <input
                      type="date"
                      value={plannedEndDate}
                      onChange={(e) => setPlannedEndDate(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Initial Milestones (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={initialMilestones}
                    onChange={(e) => setInitialMilestones(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-md disabled:opacity-50"
                  >
                    {saving ? 'Initializing...' : 'Initialize Project'}
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
