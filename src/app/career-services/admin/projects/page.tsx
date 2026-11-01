'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

const PROJECT_STATUSES: { key: ProjectStatus; label: string; color: string }[] = [
  { key: 'READY_TO_START', label: 'Ready to Start', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'INTERNAL_REVIEW', label: 'Internal Review', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'CLIENT_UAT', label: 'Client UAT', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'COMPLETED', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'ON_HOLD', label: 'On Hold', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

export default function ProjectsDashboardPage() {
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

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeProject, setActiveProject] = useState<EnterpriseProjectRecord | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [projectName, setProjectName] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [projectDivision, setProjectDivision] = useState<BusinessDivision>('IT_SERVICES');
  const [serviceName, setServiceName] = useState('Website Development');
  const [projectManagerId, setProjectManagerId] = useState('');
  const [contractValue, setContractValue] = useState(1500);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [plannedEndDate, setPlannedEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [initialMilestones, setInitialMilestones] = useState(
    'Phase 1: Discovery & Design\nPhase 2: Development & Integration\nPhase 3: UAT & Handover'
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
    setActiveProject(null);
    setProjectName('');
    setSelectedCustomerId(clients[0]?.clientId || '');
    setProjectDivision('IT_SERVICES');
    setServiceName('Website Development');
    setProjectManagerId(staffList[0]?.uid || '');
    setContractValue(1500);
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
      customerName: selectedClient?.name || 'Customer',
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
      progressPercent: 10,
      currency: 'USD',
      billingMethod: 'MILESTONE_BASED',
      milestones: generatedMilestones,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveProject(newProject);
      setShowModal(false);
      setActiveProject(newProject);
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
    if (newStatus === 'IN_PROGRESS' && progress < 25) progress = 35;
    if (newStatus === 'CLIENT_UAT' && progress < 80) progress = 85;

    try {
      await saveProject({
        ...project,
        status: newStatus,
        progressPercent: progress,
        updatedAt: new Date().toISOString(),
      });
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
  const activeCount = projects.filter((p) => p.status === 'IN_PROGRESS' || p.status === 'READY_TO_START' || p.status === 'CLIENT_UAT').length;
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Delivery Engine
              </span>
              <span className="text-xs text-[#777781] font-medium">Enterprise Project Management</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17243B] mt-1 tracking-tight">
              Project Management & Execution Hub
            </h1>
            <p className="text-xs text-[#777781] mt-0.5 max-w-2xl">
              Track multi-division IT solutions and client deliverables with real-time milestone progress, resource assignments, and UAT acceptance.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-white border border-[#E6E2DC] rounded-xl p-0.5 flex items-center shadow-sm">
              <button
                onClick={() => setViewMode('LIST')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  viewMode === 'LIST' ? 'bg-[#17243B] text-white' : 'text-[#777781] hover:text-[#17243B]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('KANBAN')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  viewMode === 'KANBAN' ? 'bg-[#17243B] text-white' : 'text-[#777781] hover:text-[#17243B]'
                }`}
                title="Kanban Board View"
              >
                <Kanban className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#8172A8]" />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_2px_8px_rgba(23,36,59,0.02)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#777781]">Total Projects</span>
            <p className="text-xl font-bold text-[#17243B] mt-1">{projects.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_2px_8px_rgba(23,36,59,0.02)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Active Delivery</span>
            <p className="text-xl font-bold text-amber-700 mt-1">{activeCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_2px_8px_rgba(23,36,59,0.02)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Completed & Handed Over</span>
            <p className="text-xl font-bold text-emerald-700 mt-1">{completedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_2px_8px_rgba(23,36,59,0.02)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Total Contract Value</span>
            <p className="text-xl font-bold text-indigo-800 mt-1">${totalContractValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Division & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2DC] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDivision('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedDivision === 'ALL'
                  ? 'bg-[#17243B] text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-[#17243B] border border-[#E6E2DC]'
              }`}
            >
              All Divisions
            </button>
            <button
              onClick={() => setSelectedDivision('IT_SERVICES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedDivision === 'IT_SERVICES'
                  ? 'bg-indigo-700 text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-indigo-700 border border-[#E6E2DC]'
              }`}
            >
              IT Services
            </button>
            <button
              onClick={() => setSelectedDivision('CAREER_SERVICES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedDivision === 'CAREER_SERVICES'
                  ? 'bg-[#8172A8] text-white shadow-sm'
                  : 'bg-white text-[#777781] hover:text-[#8172A8] border border-[#E6E2DC]'
              }`}
            >
              Career Services
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777781]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or client..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E6E2DC] rounded-xl text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
              />
            </div>
          </div>
        </div>

        {/* Projects View */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#777781]">Loading Projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E6E2DC] p-12 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-[#777781]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#17243B]">No Projects Active</h3>
            <p className="text-xs text-[#777781]">
              Create a new delivery project or convert a won quotation from the CRM pipeline.
            </p>
          </div>
        ) : viewMode === 'LIST' ? (
          /* List View */
          <div className="bg-white rounded-2xl border border-[#E6E2DC] overflow-hidden shadow-[0_2px_8px_rgba(23,36,59,0.02)]">
            <div className="divide-y divide-[#E6E2DC]">
              {filteredProjects.map((prj) => {
                const statusMeta = PROJECT_STATUSES.find((s) => s.key === prj.status) || {
                  label: prj.status,
                  color: 'bg-gray-100 text-gray-700',
                };
                return (
                  <div
                    key={prj.id}
                    className="p-4 sm:p-5 hover:bg-[#F7F5F0]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#17243B] text-white">
                          {prj.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusMeta.color}`}
                        >
                          {statusMeta.label}
                        </span>
                        <span className="text-[11px] text-[#777781] font-medium">
                          {prj.division === 'IT_SERVICES' ? 'IT Solution' : 'Career Service'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#17243B] tracking-tight">{prj.name}</h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#777781]">
                        <span className="flex items-center gap-1 font-medium text-[#17243B]">
                          <Building className="w-3.5 h-3.5 text-[#777781]" />
                          {prj.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#777781]" />
                          PM: {prj.projectManagerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          ${prj.contractValue?.toLocaleString()} {prj.currency}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#777781]" />
                          Due: {prj.plannedEndDate}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex items-center gap-4 shrink-0 sm:w-72">
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#17243B]">
                          <span>Progress</span>
                          <span>{prj.progressPercent || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${prj.progressPercent || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={prj.status}
                        onChange={(e) => handleUpdateStatus(prj, e.target.value as ProjectStatus)}
                        className="px-2.5 py-1.5 rounded-xl border border-[#E6E2DC] text-[11px] font-semibold bg-white text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                      >
                        {PROJECT_STATUSES.map((st) => (
                          <option key={st.key} value={st.key}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Kanban Board View */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {PROJECT_STATUSES.filter((s) => s.key !== 'ON_HOLD').map((st) => {
              const columnProjects = filteredProjects.filter((p) => p.status === st.key);
              return (
                <div key={st.key} className="bg-[#F7F5F0]/60 rounded-2xl p-3 border border-[#E6E2DC] space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-[#17243B]">{st.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white border border-[#E6E2DC] text-[#777781]">
                      {columnProjects.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {columnProjects.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white p-3 rounded-xl border border-[#E6E2DC] shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#777781] font-mono">
                          <span>{p.id}</span>
                          <span className="font-bold text-emerald-700">${p.contractValue}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#17243B] line-clamp-2">{p.name}</h4>
                        <p className="text-[11px] text-[#777781] truncate">{p.customerName}</p>

                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${p.progressPercent || 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Create Project */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E6E2DC] max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-3">
                <div>
                  <h3 className="text-base font-bold text-[#17243B]">Initialize New Project</h3>
                  <p className="text-xs text-[#777781]">Create delivery project and configure milestones.</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-[#777781]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Acme Corp Corporate Website Redesign"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Customer *
                    </label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      {clients.map((c) => (
                        <option key={c.clientId} value={c.clientId}>
                          {c.name} ({c.mobile})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Division
                    </label>
                    <select
                      value={projectDivision}
                      onChange={(e) => setProjectDivision(e.target.value as BusinessDivision)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      <option value="IT_SERVICES">IT & Business Solutions</option>
                      <option value="CAREER_SERVICES">Career Services</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Project Manager
                    </label>
                    <select
                      value={projectManagerId}
                      onChange={(e) => setProjectManagerId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      {staffList.map((st) => (
                        <option key={st.uid} value={st.uid}>
                          {st.fullName} ({st.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Contract Value (USD)
                    </label>
                    <input
                      type="number"
                      value={contractValue}
                      onChange={(e) => setContractValue(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">
                      Target Completion Date
                    </label>
                    <input
                      type="date"
                      value={plannedEndDate}
                      onChange={(e) => setPlannedEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Initial Milestones (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={initialMilestones}
                    onChange={(e) => setInitialMilestones(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E6E2DC] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Initialize Project'}
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
