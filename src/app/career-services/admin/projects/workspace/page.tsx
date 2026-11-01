'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  saveProject,
  subscribeUniversalTasks,
  saveUniversalTask,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type {
  EnterpriseProjectRecord,
  ClientRecord,
  CareerEnquiryRecord,
  UniversalTaskRecord,
  StaffUser,
  ProjectStatus,
} from '@/lib/career/types';
import { formatINR } from '@/lib/currency';
import {
  Briefcase,
  User,
  FileText,
  CheckSquare,
  Activity,
  Layers,
  ArrowLeft,
  ExternalLink,
  Download,
  Eye,
  Plus,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  UploadCloud,
  FileCode,
  Shield,
  MessageSquare,
  Sparkles,
  ChevronRight,
  X,
  Edit3,
  Check,
} from 'lucide-react';

const WORKSPACE_TABS = [
  { id: 'overview', label: 'Overview', icon: Briefcase },
  { id: 'customer', label: 'Customer Information', icon: User },
  { id: 'documents', label: 'Documents & Files', icon: FileText },
  { id: 'requirements', label: 'Requirements & Scope', icon: Layers },
  { id: 'tasks', label: 'Tasks & Deliverables', icon: CheckSquare },
  { id: 'activity', label: 'Activity & Notes', icon: Activity },
] as const;

type WorkspaceTab = (typeof WORKSPACE_TABS)[number]['id'];

const PROJECT_STATUS_OPTIONS: { key: ProjectStatus; label: string; badge: string }[] = [
  { key: 'NEW_INTAKE', label: 'New Intake', badge: 'bg-amber-100 text-amber-800' },
  { key: 'READY_TO_START', label: 'Ready to Start', badge: 'bg-slate-100 text-slate-800' },
  { key: 'IN_PROGRESS', label: 'In Progress', badge: 'bg-blue-100 text-blue-800' },
  { key: 'INTERNAL_REVIEW', label: 'Internal Review', badge: 'bg-purple-100 text-purple-800' },
  { key: 'CLIENT_UAT', label: 'Client Review / UAT', badge: 'bg-indigo-100 text-indigo-800' },
  { key: 'REVISION', label: 'In Revision', badge: 'bg-orange-100 text-orange-800' },
  { key: 'COMPLETED', label: 'Delivered / Done', badge: 'bg-emerald-100 text-emerald-800' },
  { key: 'ON_HOLD', label: 'On Hold', badge: 'bg-red-100 text-red-800' },
];

function ProjectWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { adminProfile, isAuthorized } = useAdminAuth();

  const projectId = searchParams.get('projectId') || '';

  // Core Data States
  const [project, setProject] = useState<EnterpriseProjectRecord | null>(null);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [enquiry, setEnquiry] = useState<CareerEnquiryRecord | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<UniversalTaskRecord[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [internalNotes, setInternalNotes] = useState<any[]>([]);

  // Modals & Panels
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocTitle, setPreviewDocTitle] = useState<string>('');

  // Task Creation Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState('');

  // Document Upload Form
  const [uploadCategory, setUploadCategory] = useState('Deliverable');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Load project bundle from backend
  const fetchWorkspaceData = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career/admin/project/workspace-bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load project workspace.');
      }

      setProject(json.project);
      setClient(json.client);
      setEnquiry(json.enquiry);
      setDocuments(json.documents || []);

      if (json.project?.internalNotes && Array.isArray(json.project.internalNotes)) {
        setInternalNotes(json.project.internalNotes);
      }
    } catch (err: any) {
      console.error('Workspace load error:', err);
      setError(err.message || 'Unable to load project workspace. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [projectId]);

  // Subscribe to universal tasks for this project
  useEffect(() => {
    if (!projectId) return;
    const unsubTasks = subscribeUniversalTasks('PROJECT', projectId, (loadedTasks) => {
      setTasks(loadedTasks);
    });
    const unsubStaff = subscribeStaffUsers((staff) => {
      setStaffUsers(staff.filter((s) => s.employmentStatus === 'Active' || s.accountStatus === 'ACTIVE'));
    });
    return () => {
      unsubTasks();
      unsubStaff();
    };
  }, [projectId]);

  // Status Change Handler
  const handleUpdateStatus = async (newStatus: ProjectStatus) => {
    if (!project) return;
    try {
      const updated = {
        ...project,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      setProject(updated);
      setShowStatusModal(false);

      await saveProject(updated);

      // Add to internal activity
      const noteEntry = {
        id: `act_${Date.now()}`,
        author: adminProfile?.displayName || 'Administrator',
        text: `Project execution status updated to: ${newStatus}`,
        timestamp: new Date().toISOString(),
        type: 'STATUS_CHANGE',
      };
      const updatedNotes = [noteEntry, ...internalNotes];
      setInternalNotes(updatedNotes);
      await saveProject({
        ...updated,
        internalNotes: updatedNotes,
      } as any);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Add Internal Note Handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !project) return;
    setSavingNote(true);

    try {
      const noteEntry = {
        id: `note_${Date.now()}`,
        author: adminProfile?.displayName || 'Administrator',
        role: (adminProfile as any)?.roleName || (adminProfile as any)?.role || 'Staff',
        text: newNote.trim(),
        timestamp: new Date().toISOString(),
        type: 'NOTE',
      };

      const updatedNotes = [noteEntry, ...internalNotes];
      setInternalNotes(updatedNotes);
      setNewNote('');

      await saveProject({
        ...project,
        internalNotes: updatedNotes,
        updatedAt: new Date().toISOString(),
      } as any);
    } catch (err: any) {
      alert('Failed to add note: ' + err.message);
    } finally {
      setSavingNote(false);
    }
  };

  // Create Universal Task Handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !project) return;

    try {
      const assignedUser = staffUsers.find((s) => s.uid === taskAssignedTo);
      const newTask: UniversalTaskRecord = {
        taskId: `tsk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        entityType: 'PROJECT',
        entityId: projectId,
        entityTitle: project.name,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        assignedToId: taskAssignedTo || 'unassigned',
        assignedToName: assignedUser ? assignedUser.fullName : 'Unassigned',
        createdBy: adminProfile?.displayName || 'System Admin',
        priority: taskPriority,
        status: 'OPEN',
        dueDate: taskDueDate || undefined,
        checklist: [],
        createdAt: new Date().toISOString(),
      };

      await saveUniversalTask(newTask);
      setShowAddTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
    } catch (err: any) {
      alert('Failed to create task: ' + err.message);
    }
  };

  // Toggle Task Status Handler
  const handleToggleTaskStatus = async (task: UniversalTaskRecord) => {
    const nextStatus = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      const updated = {
        ...task,
        status: nextStatus as any,
        completedAt: nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
      };
      await saveUniversalTask(updated);
    } catch (err: any) {
      console.error('Task status update failed:', err);
    }
  };

  // Upload Document Handler
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !project) return;
    setUploading(true);
    setUploadSuccess(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(uploadFile);
      const base64Content = await base64Promise;

      const uploadPayload = {
        workOrderId: project.workOrderId || project.id,
        clientId: project.customerId,
        fileName: uploadFile.name,
        mimeType: uploadFile.type || 'application/pdf',
        subfolder: uploadCategory,
        base64Content,
        fileSize: uploadFile.size,
      };

      const res = await fetch('/api/career/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadPayload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to upload document.');
      }

      const newDoc = json.document;
      const updatedDocs = [newDoc, ...documents];
      setDocuments(updatedDocs);

      // Persist in project document list
      await saveProject({
        ...project,
        documents: updatedDocs,
        updatedAt: new Date().toISOString(),
      });

      setUploadSuccess(`File "${uploadFile.name}" uploaded and synchronized successfully.`);
      setUploadFile(null);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(null);
      }, 1200);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center font-['Manrope',sans-serif] space-y-4">
          <div className="w-10 h-10 border-3 border-[#173B8F] border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <h3 className="font-bold text-slate-800 text-[15px] font-['Plus_Jakarta_Sans',sans-serif]">
              Loading Project Execution Workspace...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Synchronizing customer dossier, documents, and active milestones...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !project) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 font-['Manrope',sans-serif]">
          <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-red-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                Workspace Access Error
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {error || `Unable to load execution workspace for Project '${projectId}'.`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => router.push('/career-services/admin/projects')}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to Project Hub
              </button>
              <button
                onClick={fetchWorkspaceData}
                className="px-4 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const currentStatusObj =
    PROJECT_STATUS_OPTIONS.find((s) => s.key === project.status) || PROJECT_STATUS_OPTIONS[0];

  // Derive career fields accurately
  const careerProfile = {
    ...(client?.careerProfile || {}),
    ...(project.careerProfile || {}),
    ...(enquiry || {}),
  };

  return (
    <AdminLayout>
      <div className="space-y-5 pb-12 font-['Manrope',sans-serif]">
        {/* Workspace Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <Link
              href="/career-services/admin/projects"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition inline-flex items-center gap-1 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Project Hub</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wide">
              {project.id}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {project.customerId && (
              <Link
                href="/career-services/admin/clients"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Client Profile</span>
              </Link>
            )}

            {project.enquiryId && (
              <Link
                href="/career-services/admin/career-enquiries"
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Original Enquiry</span>
              </Link>
            )}

            <button
              onClick={() => setShowStatusModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] transition inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Update Status</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Master Project Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(23,59,143,0.03)]">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentStatusObj.badge}`}
                >
                  {currentStatusObj.label}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  {project.division === 'CAREER_SERVICES' ? 'Career Studio' : 'IT Solutions'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                {project.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#173B8F]" />
                  <span className="font-semibold text-slate-900">{project.customerName}</span>
                  <span className="text-slate-500 font-mono text-[11px]">({project.customerId})</span>
                </div>

                {project.customerEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{project.customerEmail}</span>
                  </div>
                )}

                {project.customerMobile && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{project.customerMobile}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Capsule */}
            <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-6 shrink-0">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                  Contract Value
                </span>
                <span className="text-lg font-bold text-emerald-800 tabular-nums">
                  {formatINR(project.contractValue || 0)}
                </span>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                  SLA Target
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {project.plannedEndDate || 'TBD'}
                </span>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                  Progress
                </span>
                <span className="text-xs font-bold text-[#173B8F] tabular-nums">
                  {project.progressPercent || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Service Tags Pill Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              Active Scope:
            </span>
            {(project.services && project.services.length > 0
              ? project.services
              : [project.serviceName]
            ).map((srv, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-[#173B8F] text-xs font-bold"
              >
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 no-scrollbar">
          {WORKSPACE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#173B8F] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'documents' && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {documents.length}
                  </span>
                )}
                {tab.id === 'tasks' && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tasks.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Delivery Milestones Roadmap */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                      Execution Stages & Milestones
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard operating procedure for {project.serviceName}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#173B8F]">
                    {project.milestones?.filter((m) => m.status === 'COMPLETED').length || 0} of{' '}
                    {project.milestones?.length || 4} Completed
                  </span>
                </div>

                <div className="space-y-3">
                  {(project.milestones || []).map((ms, idx) => (
                    <div
                      key={ms.id || idx}
                      className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 flex items-center justify-between gap-3 hover:bg-white hover:border-[#173B8F]/30 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            ms.status === 'COMPLETED'
                              ? 'bg-emerald-600 text-white'
                              : ms.status === 'IN_PROGRESS'
                              ? 'bg-[#173B8F] text-white ring-4 ring-blue-50'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {ms.status === 'COMPLETED' ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{ms.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Target SLA Due: {ms.dueDate || 'Sprint Scheduled'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ms.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ms.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-[#173B8F]'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {ms.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Quick Cards */}
              <div className="space-y-4">
                {/* Primary Contact Capsule */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                    Assigned Delivery Pod
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500 block font-semibold">
                          Lead Specialist
                        </span>
                        <span className="font-bold text-slate-900">
                          {project.projectManagerName || 'Marcus Vance (Director of Delivery)'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-[#173B8F] text-[10px] font-bold rounded">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <span className="text-[11px] text-slate-500 block font-semibold">
                          Quality Reviewer
                        </span>
                        <span className="font-bold text-slate-900">
                          Executive QA Desk (Super Admin)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                        Assigned
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Uploaded Resume Quick Launch */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                      Primary Uploaded Resume
                    </h3>
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>

                  {documents.length > 0 ? (
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {documents[0].fileName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {documents[0].category || 'Customer Original Resume'} •{' '}
                            {Math.round((documents[0].fileSize || 120000) / 1024)} KB
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 text-[9px] font-bold rounded shrink-0">
                          Available
                        </span>
                      </div>

                      <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between gap-2">
                        {documents[0].viewUrl && (
                          <button
                            onClick={() => {
                              setPreviewDocUrl(documents[0].viewUrl);
                              setPreviewDocTitle(documents[0].fileName);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#173B8F] text-white text-[11px] font-bold hover:bg-[#132c6b] inline-flex items-center gap-1 transition"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        )}

                        {documents[0].downloadUrl && (
                          <a
                            href={documents[0].downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1 transition"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                      No customer document linked yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER INFORMATION */}
        {activeTab === 'customer' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Contact & Legal Identity */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                    Personal & Contact Profile
                  </h3>
                  <span className="text-[11px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded">
                    Verified Customer
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block font-semibold">Full Legal Name</span>
                    <span className="text-slate-900 font-bold text-[13px]">
                      {client?.fullName || project.customerName || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Customer ID</span>
                    <span className="text-[#173B8F] font-mono font-bold text-[13px]">
                      {project.customerId || 'Not assigned'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Email Address</span>
                    <span className="text-slate-900 font-medium">
                      {client?.email || project.customerEmail || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Mobile / WhatsApp</span>
                    <span className="text-slate-900 font-medium">
                      {client?.mobile || project.customerMobile || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Preferred Channel</span>
                    <span className="text-slate-900 font-medium">
                      {careerProfile.preferredContactMethod || 'WhatsApp'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Customer Since</span>
                    <span className="text-slate-900 font-medium">
                      {client?.createdAt
                        ? new Date(client.createdAt).toLocaleDateString()
                        : 'November 2026'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Career & Professional Trajectory */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                    Professional Trajectory & Target Goals
                  </h3>
                  <span className="text-[11px] font-bold bg-blue-50 text-[#173B8F] px-2 py-0.5 rounded">
                    Customer Submitted
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block font-semibold">Current Designation</span>
                    <span className="text-slate-900 font-bold">
                      {careerProfile.currentDesignation || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Total Experience</span>
                    <span className="text-slate-900 font-bold">
                      {careerProfile.totalExperience
                        ? `${careerProfile.totalExperience} Years`
                        : 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Target Job Role</span>
                    <span className="text-[#173B8F] font-bold">
                      {careerProfile.targetRole || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Target Country / Market</span>
                    <span className="text-slate-900 font-bold">
                      {careerProfile.targetCountry || 'Not provided'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Career Stage</span>
                    <span className="text-slate-900 font-medium">
                      {careerProfile.careerStage || 'Experienced Professional'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold">Originating Enquiry</span>
                    <span className="text-slate-900 font-mono font-medium">
                      {project.enquiryId || 'Direct Project Creation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions & Customer Requirements */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Customer Notes & Detailed Requirements
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {careerProfile.requirements ||
                  'No specific custom instructions provided during the initial submission.'}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  Project Document Vault
                </h3>
                <p className="text-xs text-slate-500">
                  Secure Google Drive storage synced with customer records
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] transition inline-flex items-center gap-1.5 shadow-xs"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_rgba(23,59,143,0.03)]">
              {documents.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    No documents currently associated with this project.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {documents.map((doc, idx) => (
                    <div
                      key={doc.documentId || idx}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-[#173B8F] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{doc.fileName}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {doc.category || 'Document'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Uploaded {new Date(doc.uploadedAt || project.createdAt).toLocaleDateString()} by{' '}
                            {doc.uploadedBy || 'Client'} • {Math.round((doc.fileSize || 100000) / 1024)} KB
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {doc.viewUrl && (
                          <button
                            onClick={() => {
                              setPreviewDocUrl(doc.viewUrl);
                              setPreviewDocTitle(doc.fileName);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#173B8F]" />
                            <span>Preview</span>
                          </button>
                        )}

                        {doc.downloadUrl && (
                          <a
                            href={doc.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1 transition shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REQUIREMENTS & SERVICE SCOPE */}
        {activeTab === 'requirements' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif] pb-3 border-b border-slate-100">
                Service Delivery Scope & Objectives
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <h4 className="font-bold text-[#173B8F] uppercase tracking-wider text-[11px]">
                    1. Professional Resume Architecture
                  </h4>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                    <li>Comprehensive audit of candidate's career milestones and trajectory.</li>
                    <li>Restructuring layout into modern executive single/two-page format.</li>
                    <li>Framing accomplishments with metric-driven impact phrasing.</li>
                    <li>2 full rounds of collaborative revisions included.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <h4 className="font-bold text-purple-900 uppercase tracking-wider text-[11px]">
                    2. ATS Keyword Scanning & Benchmarking
                  </h4>
                  <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                    <li>Target job role alignment for: {careerProfile.targetRole || 'Engineer'}.</li>
                    <li>Compliance check for Workday, Taleo, Greenhouse, and Lever parsers.</li>
                    <li>Clean typography and tableless layout elimination to prevent parse errors.</li>
                    <li>Detailed ATS benchmark scorecard delivery.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TASKS & DELIVERABLES */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  Active Sprint Tasks & Deliverables
                </h3>
                <p className="text-xs text-slate-500">
                  Assigned team action items tracked in universal tasks
                </p>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] transition inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_rgba(23,59,143,0.03)]">
              {tasks.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <CheckSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">
                    No tasks currently created for this project.
                  </p>
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 mt-2"
                  >
                    Add first deliverable task
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <div
                      key={task.taskId}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-[#173B8F] text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <span
                            className={`text-xs font-bold ${
                              task.status === 'COMPLETED'
                                ? 'line-through text-slate-400'
                                : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>Assigned to: {task.assignedToName}</span>
                            {task.dueDate && <span>• Due: {task.dueDate}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.priority === 'HIGH' || task.priority === 'URGENT'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-50 text-[#173B8F]'
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ACTIVITY & NOTES */}
        {activeTab === 'activity' && (
          <div className="space-y-5">
            {/* Note Composer */}
            <form
              onSubmit={handleAddNote}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3"
            >
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                Add Internal Consultant Note
              </h3>
              <textarea
                rows={3}
                required
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal delivery milestone notes, customer call outcomes, or revision guidelines..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-[#173B8F]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingNote || !newNote.trim()}
                  className="px-4 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] transition disabled:opacity-50 inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{savingNote ? 'Saving...' : 'Post Internal Note'}</span>
                </button>
              </div>
            </form>

            {/* Note Feed */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif] pb-3 border-b border-slate-100">
                Audit Trail & Consultant Logs
              </h3>

              {internalNotes.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No internal notes recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-bold text-slate-800">{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: UPDATE PROJECT STATUS */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  Update Project Status
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {PROJECT_STATUS_OPTIONS.map((st) => (
                  <button
                    key={st.key}
                    onClick={() => handleUpdateStatus(st.key)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                      project.status === st.key
                        ? 'border-[#173B8F] bg-blue-50 text-[#173B8F]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{st.label}</span>
                    {project.status === st.key && <Check className="w-4 h-4 text-[#173B8F]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD TASK */}
        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  Assign Sprint Deliverable Task
                </h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. ATS Scan & Parse Benchmark Audit"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Provide specific deliverable instructions..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Assigned Staff</label>
                    <select
                      value={taskAssignedTo}
                      onChange={(e) => setTaskAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                    >
                      <option value="">Unassigned</option>
                      {staffUsers.map((st) => (
                        <option key={st.uid} value={st.uid}>
                          {st.fullName} ({st.roleName || st.departmentId || 'Staff'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#173B8F] text-white font-bold hover:bg-[#132c6b]"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD DOCUMENT */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  Upload Project Deliverable
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {uploadSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">
                  {uploadSuccess}
                </div>
              ) : (
                <form onSubmit={handleUploadFile} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Document Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                    >
                      <option value="Deliverable">Final Deliverable (DOCX / PDF)</option>
                      <option value="Draft">Draft Deliverable for Review</option>
                      <option value="ATS Report">ATS Compliance Scorecard</option>
                      <option value="Original Resume">Customer Original Resume</option>
                      <option value="Brief">Working Project Brief</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Select File (PDF/DOCX, max 8MB)</label>
                    <input
                      type="file"
                      required
                      accept=".pdf,.docx,.doc"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#173B8F] file:text-white"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading || !uploadFile}
                      className="px-4 py-2 rounded-xl bg-[#173B8F] text-white font-bold hover:bg-[#132c6b] disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading to Drive...' : 'Upload & Sync'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL: DOCUMENT IN-APP PREVIEW */}
        {previewDocUrl && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#173B8F]" />
                  <span className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif] truncate max-w-md">
                    {previewDocTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={previewDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      setPreviewDocUrl(null);
                      setPreviewDocTitle('');
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-slate-100 p-2">
                <iframe
                  src={previewDocUrl.replace('/view?usp=drivesdk', '/preview').replace('/view', '/preview')}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white"
                  title="Document Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function ProjectWorkspacePage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="min-h-[70vh] flex flex-col items-center justify-center font-['Manrope',sans-serif]">
            <div className="w-9 h-9 border-3 border-[#173B8F] border-t-transparent rounded-full animate-spin" />
          </div>
        </AdminLayout>
      }
    >
      <ProjectWorkspaceContent />
    </Suspense>
  );
}

