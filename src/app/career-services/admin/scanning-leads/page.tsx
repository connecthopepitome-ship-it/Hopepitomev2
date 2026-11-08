'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeScanningLeads,
  updateScanningLead,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type {
  ScanningLeadRecord,
  ScanningLeadStatus,
  ScanProcessStatus,
  StorageStatus,
  StaffUser,
} from '@/lib/career/types';
import {
  ScanText,
  Search,
  Filter,
  CircleCheck,
  Clock3,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  Phone,
  Mail,
  User,
  MapPin,
  RefreshCw,
  Eye,
  MessageSquare,
  AlertTriangle,
  HardDrive,
  UserCheck,
  ArrowRight,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  Upload,
} from 'lucide-react';

const LEAD_STATUS_CONFIG: Record<
  ScanningLeadStatus,
  { label: string; badge: string; dot: string }
> = {
  NEW: {
    label: 'New Lead',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  CONTACTED: {
    label: 'Contacted',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  FOLLOW_UP_REQUIRED: {
    label: 'Follow-up Required',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  CONVERTED: {
    label: 'Converted to CRM',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  NOT_INTERESTED: {
    label: 'Not Interested',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
  CLOSED: {
    label: 'Closed',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
};

const SCAN_STATUS_CONFIG: Record<
  ScanProcessStatus,
  { label: string; badge: string }
> = {
  INITIATED: { label: 'Initiated', badge: 'bg-slate-100 text-slate-700' },
  PROCESSING: { label: 'Processing', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  COMPLETED: { label: 'Completed', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  FAILED: { label: 'Failed', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const STORAGE_STATUS_CONFIG: Record<
  StorageStatus,
  { label: string; badge: string }
> = {
  STORED: { label: 'Google Drive Vault', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  PENDING: { label: 'Drive Pending', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  FAILED: { label: 'Storage Failed', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
  RETRY_REQUIRED: { label: 'Retry Required', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
};

function ScanningLeadsContent() {
  const { staffProfile } = useAdminAuth();

  const [leads, setLeads] = useState<ScanningLeadRecord[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadStatus, setSelectedLeadStatus] = useState<string>('ALL');
  const [selectedScanStatus, setSelectedScanStatus] = useState<string>('ALL');
  const [selectedStorageStatus, setSelectedStorageStatus] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  // Active Lead for Details Drawer
  const [activeLead, setActiveLead] = useState<ScanningLeadRecord | null>(null);

  // Update State in Drawer
  const [editingName, setEditingName] = useState('');
  const [editingEmail, setEditingEmail] = useState('');
  const [editingMobile, setEditingMobile] = useState('');
  const [editingLocation, setEditingLocation] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState<ScanningLeadStatus>('NEW');
  const [editingAssignee, setEditingAssignee] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Storage Retry State
  const [isRetryingStorage, setIsRetryingStorage] = useState(false);
  const [retryStorageError, setRetryStorageError] = useState<string | null>(null);

  // Lead Conversion State
  const [isConverting, setIsConverting] = useState(false);
  const [convertResult, setConvertResult] = useState<string | null>(null);

  // Subscriptions
  useEffect(() => {
    const unsubLeads = subscribeScanningLeads((list) => {
      setLeads(list);
      setLoading(false);
    });
    const unsubStaff = subscribeStaffUsers((st) => setStaffUsers(st));

    return () => {
      unsubLeads();
      unsubStaff();
    };
  }, []);

  // Sync active lead fields when opened
  useEffect(() => {
    if (activeLead) {
      setEditingName(activeLead.candidate_name || '');
      setEditingEmail(activeLead.email || '');
      setEditingMobile(activeLead.mobile_number || '');
      setEditingLocation(activeLead.location || '');
      setEditingNotes(activeLead.admin_notes || '');
      setEditingStatus(activeLead.lead_status || 'NEW');
      setEditingAssignee(activeLead.assigned_to || '');
      setSaveSuccessMsg(null);
      setConvertResult(null);
      setRetryStorageError(null);
    }
  }, [activeLead]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nowMs = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

    return leads.filter((item) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.candidate_name && item.candidate_name.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.mobile_number && item.mobile_number.includes(q)) ||
        (item.scan_reference && item.scan_reference.toLowerCase().includes(q)) ||
        (item.original_file_name && item.original_file_name.toLowerCase().includes(q)) ||
        (item.scanning_lead_id && item.scanning_lead_id.toLowerCase().includes(q));

      // 2. Lead Status
      const matchLeadStatus =
        selectedLeadStatus === 'ALL' || item.lead_status === selectedLeadStatus;

      // 3. Scan Status
      const matchScanStatus =
        selectedScanStatus === 'ALL' || item.scan_status === selectedScanStatus;

      // 4. Storage Status
      const matchStorageStatus =
        selectedStorageStatus === 'ALL' || item.storage_status === selectedStorageStatus;

      // 5. Date Filter
      let matchDate = true;
      if (dateFilter !== 'ALL' && item.created_at) {
        const itemTime = new Date(item.created_at).getTime();
        if (dateFilter === 'TODAY') {
          matchDate = item.created_at.startsWith(todayStr);
        } else if (dateFilter === 'WEEK') {
          matchDate = nowMs - itemTime <= sevenDaysMs;
        } else if (dateFilter === 'MONTH') {
          matchDate = nowMs - itemTime <= thirtyDaysMs;
        }
      }

      return matchSearch && matchLeadStatus && matchScanStatus && matchStorageStatus && matchDate;
    });
  }, [leads, searchQuery, selectedLeadStatus, selectedScanStatus, selectedStorageStatus, dateFilter]);

  // Metrics Summary
  const metrics = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    let todayScans = 0;
    let completedScans = 0;
    let failedScans = 0;
    let pendingFollowUps = 0;
    let storedFiles = 0;

    for (const lead of leads) {
      if (lead.created_at && lead.created_at.startsWith(todayStr)) {
        todayScans++;
      }
      if (lead.scan_status === 'COMPLETED') {
        completedScans++;
      } else if (lead.scan_status === 'FAILED') {
        failedScans++;
      }
      if (lead.lead_status === 'NEW' || lead.lead_status === 'FOLLOW_UP_REQUIRED') {
        pendingFollowUps++;
      }
      if (lead.storage_status === 'STORED') {
        storedFiles++;
      }
    }

    return {
      total: leads.length,
      todayScans,
      completedScans,
      failedScans,
      pendingFollowUps,
      storedFiles,
    };
  }, [leads]);

  // Handle Save Lead Updates
  const handleSaveLead = async () => {
    if (!activeLead) return;
    setIsSaving(true);
    setSaveSuccessMsg(null);

    const assignedStaff = staffUsers.find((s) => s.uid === editingAssignee);
    const assignedName = assignedStaff?.fullName || '';

    try {
      const res = await fetch('/api/career/admin/scanning-leads/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLead.scanning_lead_id,
          candidate_name: editingName,
          email: editingEmail,
          mobile_number: editingMobile,
          location: editingLocation,
          lead_status: editingStatus,
          assigned_to: editingAssignee,
          assigned_staff_name: assignedName,
          admin_notes: editingNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Lead updated successfully.');
        setActiveLead((prev) =>
          prev
            ? {
                ...prev,
                candidate_name: editingName,
                email: editingEmail,
                mobile_number: editingMobile,
                location: editingLocation,
                lead_status: editingStatus,
                assigned_to: editingAssignee,
                assigned_staff_name: assignedName,
                admin_notes: editingNotes,
                last_updated_at: new Date().toISOString(),
              }
            : null
        );
        setLeads((prev) =>
          prev.map((l) =>
            l.scanning_lead_id === activeLead.scanning_lead_id
              ? {
                  ...l,
                  candidate_name: editingName,
                  email: editingEmail,
                  mobile_number: editingMobile,
                  location: editingLocation,
                  lead_status: editingStatus,
                  assigned_to: editingAssignee,
                  assigned_staff_name: assignedName,
                  admin_notes: editingNotes,
                  last_updated_at: new Date().toISOString(),
                }
              : l
          )
        );
      } else {
        alert(data.error || 'Failed to update lead');
      }
    } catch (e: any) {
      alert(e?.message || 'Error updating lead');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Retry / Re-upload to Google Drive Storage
  const handleRetryStorageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeLead) return;
    setIsRetryingStorage(true);
    setRetryStorageError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const rawResult = reader.result as string;
          const pureBase64 = rawResult.includes(',') ? rawResult.split(',')[1] : rawResult;

          const res = await fetch('/api/career/admin/scanning-leads/retry-storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadId: activeLead.scanning_lead_id,
              base64Content: pureBase64,
            }),
          });

          const data = await res.json();
          if (data.success) {
            setActiveLead((prev) =>
              prev
                ? {
                    ...prev,
                    google_drive_file_id: data.fileId,
                    storage_status: 'STORED',
                    storage_error: undefined,
                  }
                : null
            );
            setLeads((prev) =>
              prev.map((l) =>
                l.scanning_lead_id === activeLead.scanning_lead_id
                  ? {
                      ...l,
                      google_drive_file_id: data.fileId,
                      storage_status: 'STORED',
                      storage_error: undefined,
                    }
                  : l
              )
            );
          } else {
            setRetryStorageError(data.error || 'Google Drive retry storage failed.');
          }
        } catch (innerErr: any) {
          setRetryStorageError(innerErr?.message || 'Error uploading file.');
        } finally {
          setIsRetryingStorage(false);
        }
      };
      reader.onerror = () => {
        setRetryStorageError('Failed to read local file.');
        setIsRetryingStorage(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setRetryStorageError(err?.message || 'Failed to initiate storage retry.');
      setIsRetryingStorage(false);
    }
  };

  // Handle Convert to CRM Lead
  const handleConvertToCrm = async () => {
    if (!activeLead) return;
    if (!confirm('Convert this Scanning Lead into an active CRM Sales Lead?')) return;

    setIsConverting(true);
    setConvertResult(null);

    try {
      const res = await fetch('/api/career/admin/scanning-leads/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLead.scanning_lead_id,
          adminName: staffProfile?.fullName || 'Admin',
          serviceInterestedIn: 'Professional Resume Writing',
          priority: 'HIGH',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConvertResult(`Successfully converted to CRM Lead: ${data.crmLeadId}`);
        setActiveLead((prev) =>
          prev
            ? {
                ...prev,
                lead_status: 'CONVERTED',
                converted_lead_id: data.crmLeadId,
              }
            : null
        );
      } else {
        alert(data.error || 'Failed to convert lead');
      }
    } catch (e: any) {
      alert(e?.message || 'Error converting lead');
    } finally {
      setIsConverting(false);
    }
  };

  // Secure File Proxy Launcher (Backend authenticated endpoint)
  const getFileUrl = (leadId: string, action: 'view' | 'download') => {
    return `/api/career/admin/scanning-leads/file?leadId=${encodeURIComponent(leadId)}&action=${action}`;
  };

  return (
    <div className="space-y-6 font-['Manrope',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Scanning Leads
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
              ATS Ingestion CRM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time candidate leads automatically captured from Career Studio ATS resume scans with secure Google Drive storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLoading(true);
              fetch('/api/career/admin/scanning-leads/list', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 400 }),
              })
                .then((r) => r.json())
                .then((d) => {
                  if (d.leads) setLeads(d.leads);
                  setLoading(false);
                })
                .catch(() => setLoading(false));
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Leads */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Total Scans</span>
            <ScanText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.total}
          </div>
          <p className="text-[10px] text-slate-400">All-time scan records</p>
        </div>

        {/* Today's Scans */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-blue-500">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Today's Scans</span>
            <Clock3 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.todayScans}
          </div>
          <p className="text-[10px] text-slate-400">Scanned past 24 hrs</p>
        </div>

        {/* Completed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Completed</span>
            <CircleCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.completedScans}
          </div>
          <p className="text-[10px] text-slate-400">Audit scores available</p>
        </div>

        {/* Failed */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">Failed Scans</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.failedScans}
          </div>
          <p className="text-[10px] text-slate-400">Doc read / parse errors</p>
        </div>

        {/* Pending Follow-ups */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold">Follow-ups</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.pendingFollowUps}
          </div>
          <p className="text-[10px] text-amber-700">New or action required</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, mobile, scan reference, or filename..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#173B8F] text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Date Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((df) => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
                  dateFilter === df
                    ? 'bg-[#173B8F] text-white border-[#173B8F]'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {df === 'ALL' ? 'All Time' : df === 'TODAY' ? 'Today' : df === 'WEEK' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* Lead Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Lead:</span>
            <select
              value={selectedLeadStatus}
              onChange={(e) => setSelectedLeadStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none"
            >
              <option value="ALL">All Lead Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
              <option value="CONVERTED">Converted to CRM</option>
              <option value="NOT_INTERESTED">Not Interested</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Scan Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Scan:</span>
            <select
              value={selectedScanStatus}
              onChange={(e) => setSelectedScanStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none"
            >
              <option value="ALL">All Scan Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Storage Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Drive Storage:</span>
            <select
              value={selectedStorageStatus}
              onChange={(e) => setSelectedStorageStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs focus:outline-none"
            >
              <option value="ALL">All Storage Statuses</option>
              <option value="STORED">Stored in Drive</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed Storage</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || selectedLeadStatus !== 'ALL' || selectedScanStatus !== 'ALL' || selectedStorageStatus !== 'ALL' || dateFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLeadStatus('ALL');
                setSelectedScanStatus('ALL');
                setSelectedStorageStatus('ALL');
                setDateFilter('ALL');
              }}
              className="ml-auto text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold underline"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Scanning Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
              Leads List ({filteredLeads.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              [ Independent Scanning CRM Collection ]
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-2 border-[#173B8F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading Scanning Leads...
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <ScanText className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">No Scanning Leads match the selected filters.</p>
            <p className="text-[11px]">When candidates initiate resume scans in Career Studio, records appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Resume File</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4">Scan Status</th>
                  <th className="py-3 px-4">Drive Storage</th>
                  <th className="py-3 px-4">Lead Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((item) => {
                  const leadConfig = LEAD_STATUS_CONFIG[item.lead_status] || LEAD_STATUS_CONFIG.NEW;
                  const scanConfig = SCAN_STATUS_CONFIG[item.scan_status] || SCAN_STATUS_CONFIG.PROCESSING;
                  const storageConfig = STORAGE_STATUS_CONFIG[item.storage_status] || STORAGE_STATUS_CONFIG.PENDING;

                  const formattedDate = item.created_at
                    ? new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A';

                  return (
                    <tr
                      key={item.scanning_lead_id}
                      onClick={() => setActiveLead(item)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                        {formattedDate}
                      </td>

                      {/* Candidate Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#173B8F] transition">
                          {item.candidate_name || (
                            <span className="text-slate-400 font-normal italic">Anonymous / Not Provided</span>
                          )}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          {item.email ? (
                            <div className="flex items-center gap-1 text-slate-700">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[150px]">{item.email}</span>
                            </div>
                          ) : null}
                          {item.mobile_number ? (
                            <div className="flex items-center gap-1 text-slate-700">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{item.mobile_number}</span>
                            </div>
                          ) : null}
                          {!item.email && !item.mobile_number && (
                            <span className="text-[10px] text-slate-400 italic">No contact provided</span>
                          )}
                        </div>
                      </td>

                      {/* Resume File */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 max-w-[190px]">
                          <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          <div className="truncate">
                            <div className="font-semibold text-slate-800 truncate" title={item.original_file_name}>
                              {item.original_file_name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {item.file_size ? `${Math.round(item.file_size / 1024)} KB` : 'Document'} • {item.file_extension?.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Scan Reference */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                          {item.scan_reference}
                        </span>
                      </td>

                      {/* ATS Score */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.overall_score !== null && item.overall_score !== undefined ? (
                          <span
                            className={`inline-flex items-center justify-center font-bold px-2.5 py-0.5 rounded-full text-[11px] font-mono ${
                              item.overall_score >= 80
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.overall_score >= 60
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {item.overall_score}/100
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Scan Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${scanConfig.badge}`}>
                          {scanConfig.label}
                        </span>
                      </td>

                      {/* Storage Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${storageConfig.badge}`}
                        >
                          <HardDrive className="w-3 h-3" />
                          <span>{storageConfig.label}</span>
                        </span>
                      </td>

                      {/* Lead Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${leadConfig.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${leadConfig.dot}`} />
                          <span>{leadConfig.label}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {item.google_drive_file_id && (
                            <a
                              href={getFileUrl(item.scanning_lead_id, 'view')}
                              target="_blank"
                              rel="noreferrer"
                              title="Securely View Resume"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => setActiveLead(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#173B8F] transition"
                            title="Manage Lead"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Details Slide-Over Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                  <ScanText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    {activeLead.candidate_name || 'Scanning Lead Details'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span>{activeLead.scan_reference}</span>
                    <span>•</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80">
                      ID: {activeLead.scanning_lead_id}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Alert / Notification Feedback */}
              {saveSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
                  <CircleCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {convertResult && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 shrink-0 text-purple-600" />
                  <span>{convertResult}</span>
                </div>
              )}

              {/* 1. Candidate Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Candidate Profile
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Captured from Resume Ingestion
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block">Name</label>
                    <span className="font-bold text-slate-900 text-sm">
                      {activeLead.candidate_name || 'Not detected'}
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block">Location</label>
                    <span className="font-semibold text-slate-800">
                      {activeLead.location || 'Not specified'}
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block">Email</label>
                    {activeLead.email ? (
                      <a href={`mailto:${activeLead.email}`} className="text-blue-600 hover:underline font-medium">
                        {activeLead.email}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">None provided</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block">Mobile / WhatsApp</label>
                    {activeLead.mobile_number ? (
                      <a
                        href={`https://wa.me/${activeLead.mobile_number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{activeLead.mobile_number}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">None provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Resume Document & Storage Vault Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    Google Drive Storage Vault
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    STORAGE_STATUS_CONFIG[activeLead.storage_status]?.badge || ''
                  }`}>
                    {STORAGE_STATUS_CONFIG[activeLead.storage_status]?.label || activeLead.storage_status}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[280px]">
                          {activeLead.original_file_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {Math.round((activeLead.file_size || 0) / 1024)} KB • {activeLead.mime_type}
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeLead.google_drive_file_id ? (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">
                        Drive ID: {activeLead.google_drive_file_id}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={getFileUrl(activeLead.scanning_lead_id, 'view')}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                        <a
                          href={getFileUrl(activeLead.scanning_lead_id, 'download')}
                          className="px-3 py-1.5 rounded-lg bg-[#173B8F] hover:bg-[#132c6b] text-white font-semibold text-xs flex items-center gap-1 transition shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] text-rose-600 font-medium">
                        {retryStorageError || activeLead.storage_error || 'File not available in Google Drive.'}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          isRetryingStorage
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                        }`}>
                          {isRetryingStorage ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>{isRetryingStorage ? 'Uploading to Drive...' : 'Re-upload Resume to Drive'}</span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx"
                            disabled={isRetryingStorage}
                            onChange={handleRetryStorageFile}
                          />
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Select resume to retry Google Drive storage
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Storage Path: Hopepitome / Career Studio / Scanning Leads / {new Date(activeLead.created_at || Date.now()).getFullYear()} /
                </div>
              </div>

              {/* 3. Scan & Assessment Metrics Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                    ATS Assessment Telemetry
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    SCAN_STATUS_CONFIG[activeLead.scan_status]?.badge || ''
                  }`}>
                    {SCAN_STATUS_CONFIG[activeLead.scan_status]?.label || activeLead.scan_status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">ATS Score</span>
                    <span className="text-base font-bold text-slate-900">
                      {activeLead.overall_score !== null && activeLead.overall_score !== undefined
                        ? `${activeLead.overall_score}/100`
                        : 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Engine</span>
                    <span className="text-xs font-semibold text-slate-800">
                      GPT-6 Luna
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Assessment ID</span>
                    <span className="text-[10px] font-mono font-bold text-slate-700 truncate block" title={activeLead.assessment_id}>
                      {activeLead.assessment_id ? activeLead.assessment_id.slice(0, 10) + '...' : 'Pending'}
                    </span>
                  </div>
                </div>

                {activeLead.scan_error && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    <span className="font-bold">Error Diagnostic: </span>
                    {activeLead.scan_error}
                  </div>
                )}
              </div>

              {/* 4. CRM Lead Management Operations */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 block">
                  Lead Management Operations
                </span>

                {/* Candidate Contact Details (Editable) */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                    Candidate Profile Details
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Location</label>
                      <input
                        type="text"
                        value={editingLocation}
                        onChange={(e) => setEditingLocation(e.target.value)}
                        placeholder="City, Country"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Email</label>
                      <input
                        type="email"
                        value={editingEmail}
                        onChange={(e) => setEditingEmail(e.target.value)}
                        placeholder="candidate@email.com"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600 block mb-1">Mobile / WhatsApp</label>
                      <input
                        type="text"
                        value={editingMobile}
                        onChange={(e) => setEditingMobile(e.target.value)}
                        placeholder="+974 / +91 ..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    CRM Lead Status
                  </label>
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value as ScanningLeadStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-[#173B8F] text-slate-800"
                  >
                    <option value="NEW">New Lead</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="FOLLOW_UP_REQUIRED">Follow-up Required</option>
                    <option value="CONVERTED">Converted to Opportunity / Project</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {/* Staff Assignment */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Assign Staff Follow-up
                  </label>
                  <select
                    value={editingAssignee}
                    onChange={(e) => setEditingAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-[#173B8F] text-slate-800"
                  >
                    <option value="">Unassigned</option>
                    {staffUsers.map((st) => (
                      <option key={st.uid} value={st.uid}>
                        {st.fullName} ({st.roleName || st.designation || st.roleId})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Internal Admin Notes */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Internal Consultant Notes
                  </label>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Log conversation history, salary expectations, target industries, or service interest..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-1 focus:ring-[#173B8F] text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Save Changes Button */}
                <button
                  type="button"
                  onClick={handleSaveLead}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CircleCheck className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Update Lead Details'}</span>
                </button>

                {/* Convert to CRM Lead */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">Convert to Sales Pipeline</div>
                    <div className="text-[10px] text-slate-400">Initialize official CRM Lead record</div>
                  </div>
                  {activeLead.converted_lead_id ? (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-mono text-[10px] font-bold border border-purple-200">
                      CRM ID: {activeLead.converted_lead_id}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleConvertToCrm}
                      disabled={isConverting}
                      className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isConverting ? 'Converting...' : 'Convert to CRM Lead'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Created: {new Date(activeLead.created_at || Date.now()).toLocaleTimeString()}</span>
              <button
                onClick={() => setActiveLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScanningLeadsPage() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="p-12 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-2 border-[#173B8F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading Scanning Leads Module...
          </div>
        }
      >
        <ScanningLeadsContent />
      </Suspense>
    </AdminLayout>
  );
}

