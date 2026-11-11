'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import type {
  AccountHealthStatus,
  CandidateLoginRecord,
  WorkOrderLoginStatus,
} from '@/lib/career/types';
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  HeartPulse,
  History,
  KeyRound,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';

interface LoginManagementSummary {
  totalIds: number;
  activeIds: number;
  revokedIds: number;
  supersededIds: number;
  healthyAccounts: number;
  atRiskAccounts: number;
  criticalAccounts: number;
}

interface AuthLogEntry {
  event: string;
  clientId?: string;
  workOrderId?: string;
  previousWorkOrderId?: string;
  actorId?: string;
  actorName?: string;
  reason?: string;
  mobile?: string;
  timestamp?: string;
}

const HEALTH_BADGE_STYLES: Record<
  AccountHealthStatus,
  { bg: string; text: string; border: string; bar: string; label: string }
> = {
  HEALTHY: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    bar: 'bg-emerald-500',
    label: 'Healthy',
  },
  AT_RISK: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
    label: 'At Risk',
  },
  CRITICAL: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    bar: 'bg-rose-600',
    label: 'Critical',
  },
};

const LOGIN_STATUS_STYLES: Record<
  WorkOrderLoginStatus,
  { bg: string; text: string; border: string }
> = {
  ACTIVE: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  REVOKED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  SUSPENDED: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  SUPERSEDED: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
};

function formatDateTime(iso?: string): string {
  if (!iso) return 'Never';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Never';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminLoginManagementPage() {
  const { user, adminProfile, staffProfile } = useAdminAuth();

  const [records, setRecords] = useState<CandidateLoginRecord[]>([]);
  const [summary, setSummary] = useState<LoginManagementSummary>({
    totalIds: 0,
    activeIds: 0,
    revokedIds: 0,
    supersededIds: 0,
    healthyAccounts: 0,
    atRiskAccounts: 0,
    criticalAccounts: 0,
  });
  const [recentLogs, setRecentLogs] = useState<AuthLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'LOGS'>('DIRECTORY');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [healthFilter, setHealthFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // Modal state for Revoke / Suspend
  const [revokeTarget, setRevokeTarget] = useState<CandidateLoginRecord | null>(null);
  const [revokeAction, setRevokeAction] = useState<'REVOKE' | 'SUSPEND'>('REVOKE');
  const [revokeReason, setRevokeReason] = useState('');
  const [alsoUpdateClient, setAlsoUpdateClient] = useState(true);

  // Drawer state for Account Health inspection
  const [inspectRecord, setInspectRecord] = useState<CandidateLoginRecord | null>(null);

  const adminName =
    staffProfile?.fullName || adminProfile?.displayName || user?.displayName || user?.email || 'Admin';
  const adminId = staffProfile?.uid || user?.uid || 'admin';

  const fetchLoginData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/career/admin/login-management/list', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load login management records.');
      }
      setRecords(data.records || []);
      setSummary(
        data.summary || {
          totalIds: 0,
          activeIds: 0,
          revokedIds: 0,
          supersededIds: 0,
          healthyAccounts: 0,
          atRiskAccounts: 0,
          criticalAccounts: 0,
        }
      );
      setRecentLogs(data.recentLogs || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load candidate login management data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoginData();
  }, [fetchLoginData]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      if (statusFilter !== 'ALL') {
        if (rec.loginStatus !== statusFilter) return false;
      }
      if (healthFilter !== 'ALL') {
        if (rec.healthStatus !== healthFilter) return false;
      }
      if (!q) return true;
      return (
        rec.workOrderId.toLowerCase().includes(q) ||
        rec.clientName.toLowerCase().includes(q) ||
        rec.mobile.toLowerCase().includes(q) ||
        (rec.clientEmail || '').toLowerCase().includes(q) ||
        rec.clientId.toLowerCase().includes(q) ||
        (rec.clientCode || '').toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery, statusFilter, healthFilter]);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleActivate = async (rec: CandidateLoginRecord) => {
    const key = `activate_${rec.workOrderId}_${rec.clientId}`;
    setBusyKey(key);
    setFeedbackBanner(null);
    try {
      const res = await fetch('/api/career/admin/login-management/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workOrderId: rec.workOrderId,
          clientId: rec.clientId,
          action: 'ACTIVATE',
          adminId,
          adminName,
          alsoUpdateClientStatus: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to activate ID.');
      }
      setFeedbackBanner({
        type: 'success',
        text: data.message || `Activated ${rec.workOrderId} successfully.`,
      });
      await fetchLoginData();
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        text: err?.message || 'Unable to activate login ID.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  const handleConfirmRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeTarget) return;
    const key = `revoke_${revokeTarget.workOrderId}_${revokeTarget.clientId}`;
    setBusyKey(key);
    setFeedbackBanner(null);
    try {
      const res = await fetch('/api/career/admin/login-management/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workOrderId: revokeTarget.workOrderId,
          clientId: revokeTarget.clientId,
          action: revokeAction,
          reason: revokeReason.trim() || `${revokeAction === 'REVOKE' ? 'Revoked' : 'Suspended'} by ${adminName}`,
          adminId,
          adminName,
          alsoUpdateClientStatus: alsoUpdateClient,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update login status.');
      }
      setFeedbackBanner({
        type: 'success',
        text: data.message || `Updated ${revokeTarget.workOrderId} status.`,
      });
      setRevokeTarget(null);
      setRevokeReason('');
      await fetchLoginData();
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        text: err?.message || 'Unable to revoke login ID.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  const handleIssueNewId = async (rec: CandidateLoginRecord) => {
    const key = `issue_${rec.clientId}`;
    setBusyKey(key);
    setFeedbackBanner(null);
    try {
      const res = await fetch('/api/career/admin/login-management/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: rec.clientId,
          reason: 'Issued via Admin Login Management console',
          adminId,
          adminName,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to issue new Work Order ID.');
      }
      setFeedbackBanner({
        type: 'success',
        text: `Issued new active Work Order ID ${data.workOrderId} for ${rec.clientName}.`,
      });
      await fetchLoginData();
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        text: err?.message || 'Unable to issue new Work Order ID.',
      });
    } finally {
      setBusyKey(null);
    }
  };

  const inspectedLogs = useMemo(() => {
    if (!inspectRecord) return [];
    return recentLogs.filter(
      (l) =>
        l.clientId === inspectRecord.clientId ||
        (inspectRecord.workOrderId !== 'UNASSIGNED' &&
          (l.workOrderId === inspectRecord.workOrderId || l.previousWorkOrderId === inspectRecord.workOrderId))
    );
  }, [inspectRecord, recentLogs]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Candidate Access & Security Console</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              Candidate Login Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              View Work Order IDs, activate or revoke portal access, issue recovery IDs, and monitor real-time account health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLoginData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Directory</span>
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div
            className={`rounded-xl p-3.5 border flex items-center justify-between gap-3 text-xs font-medium ${
              feedbackBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackBanner.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedbackBanner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="p-1 rounded-lg hover:bg-black/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Login IDs</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{summary.totalIds}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{summary.supersededIds} superseded historical IDs</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Portal IDs</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-emerald-700 mt-2">{summary.activeIds}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Authorized for candidate sign-in</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Revoked / Suspended</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ShieldOff className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-rose-700 mt-2">{summary.revokedIds}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Blocked from login & recovery</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Account Health</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-2xl font-extrabold text-slate-900">{summary.healthyAccounts}</p>
              <span className="text-[11px] font-semibold text-emerald-600">Healthy</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {summary.atRiskAccounts} at risk • {summary.criticalAccounts} critical
            </p>
          </div>
        </div>

        {/* Tabs + Search / Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('DIRECTORY')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'DIRECTORY'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Login Directory ({records.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('LOGS')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'LOGS'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Auth & ID Audit ({recentLogs.length})</span>
              </button>
            </div>

            {activeTab === 'DIRECTORY' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Work Order ID, name, mobile..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#173B8F] focus:bg-white"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#173B8F]"
                >
                  <option value="ALL">All ID Statuses</option>
                  <option value="ACTIVE">Active IDs</option>
                  <option value="REVOKED">Revoked IDs</option>
                  <option value="SUSPENDED">Suspended IDs</option>
                  <option value="SUPERSEDED">Superseded IDs</option>
                </select>

                <select
                  value={healthFilter}
                  onChange={(e) => setHealthFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#173B8F]"
                >
                  <option value="ALL">All Health Tiers</option>
                  <option value="HEALTHY">Healthy</option>
                  <option value="AT_RISK">At Risk</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'DIRECTORY' ? (
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  <div className="w-7 h-7 border-2 border-[#173B8F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Loading candidate login directory & health telemetry...
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No candidate login records match your current search or filter criteria.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Work Order ID</th>
                      <th className="py-3 px-4">ID Status</th>
                      <th className="py-3 px-4">Account Health</th>
                      <th className="py-3 px-4">Telemetry</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredRecords.map((rec) => {
                      const healthStyle = HEALTH_BADGE_STYLES[rec.healthStatus] || HEALTH_BADGE_STYLES.HEALTHY;
                      const statusStyle = LOGIN_STATUS_STYLES[rec.loginStatus] || LOGIN_STATUS_STYLES.ACTIVE;
                      const isRevokedOrSuspended =
                        rec.loginStatus === 'REVOKED' ||
                        rec.loginStatus === 'SUSPENDED' ||
                        ['SUSPENDED', 'REVOKED', 'DEACTIVATED'].includes(rec.clientStatus);
                      const rowKey = `${rec.workOrderId}_${rec.clientId}`;

                      return (
                        <tr key={rowKey} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{rec.clientName}</div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{rec.mobile || 'Missing mobile'}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              {rec.clientCode ? `${rec.clientCode} • ` : ''}
                              {rec.clientId}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                {rec.workOrderId}
                              </span>
                              {rec.workOrderId !== 'UNASSIGNED' && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(rec.workOrderId)}
                                  className="p-1 rounded hover:bg-slate-200 text-slate-500"
                                  title="Copy Work Order ID"
                                >
                                  {copiedId === rec.workOrderId ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              {rec.isCurrentWorkOrder && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                                  CURRENT
                                </span>
                              )}
                              {rec.generatedVia && (
                                <span className="text-[10px] text-slate-400">{rec.generatedVia}</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >
                              {rec.loginStatus}
                            </span>
                            {rec.clientStatus !== 'ACTIVE' && (
                              <div className="text-[10px] font-semibold text-rose-600 mt-1">
                                Client: {rec.clientStatus}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 min-w-[200px]">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${healthStyle.bg} ${healthStyle.text} ${healthStyle.border}`}
                              >
                                <HeartPulse className="w-3 h-3" />
                                {healthStyle.label}
                              </span>
                              <span className="text-[11px] font-extrabold text-slate-700">
                                {rec.healthScore}/100
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
                              <div
                                className={`h-full rounded-full ${healthStyle.bar}`}
                                style={{ width: `${Math.max(4, Math.min(100, rec.healthScore))}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-1">
                              {rec.healthSignals[0] || 'No anomalies detected'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[11px] text-slate-600 space-y-0.5">
                            <div>Last login: {formatDateTime(rec.lastLoginAt)}</div>
                            <div>
                              Logins: <span className="font-semibold text-slate-800">{rec.loginCount || 0}</span> • Fails:{' '}
                              <span
                                className={`font-semibold ${
                                  (rec.failedLoginAttempts || 0) >= 3 ? 'text-red-600' : 'text-slate-800'
                                }`}
                              >
                                {rec.failedLoginAttempts || 0}
                              </span>
                            </div>
                            {(rec.workOrderRegenerationCount || 0) > 0 && (
                              <div className="text-amber-700 font-medium">
                                ID regenerations: {rec.workOrderRegenerationCount}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {isRevokedOrSuspended || rec.loginStatus === 'SUPERSEDED' ? (
                                <button
                                  type="button"
                                  onClick={() => handleActivate(rec)}
                                  disabled={busyKey === `activate_${rec.workOrderId}_${rec.clientId}` || rec.workOrderId === 'UNASSIGNED'}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition disabled:opacity-50 inline-flex items-center gap-1"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Activate
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRevokeTarget(rec);
                                    setRevokeAction('REVOKE');
                                    setRevokeReason('');
                                    setAlsoUpdateClient(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold transition inline-flex items-center gap-1"
                                >
                                  <ShieldOff className="w-3.5 h-3.5" />
                                  Revoke
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleIssueNewId(rec)}
                                disabled={busyKey === `issue_${rec.clientId}`}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition disabled:opacity-50 inline-flex items-center gap-1"
                                title="Generate & activate a fresh Work Order ID"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                New ID
                              </button>

                              <button
                                type="button"
                                onClick={() => setInspectRecord(rec)}
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                                title="Inspect Account Health & Audit"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLogs.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">No authentication or ID audit events recorded yet.</div>
              ) : (
                recentLogs.map((log, idx) => (
                  <div key={`${log.event}_${log.timestamp || idx}_${idx}`} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] font-bold text-slate-700">
                          {log.event}
                        </span>
                        {log.workOrderId && (
                          <span className="font-mono font-bold text-indigo-700">{log.workOrderId}</span>
                        )}
                        {log.previousWorkOrderId && (
                          <span className="text-[11px] text-slate-500">
                            (prev: <span className="font-mono">{log.previousWorkOrderId}</span>)
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Client: <span className="font-mono">{log.clientId || 'N/A'}</span>
                        {log.actorName ? ` • By: ${log.actorName}` : ''}
                        {log.reason ? ` • Reason: ${log.reason}` : ''}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{formatDateTime(log.timestamp)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Revoke / Suspend Confirmation Modal */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/60">
              <div className="flex items-center gap-2">
                <ShieldOff className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Revoke or Suspend Login ID</h3>
                  <p className="text-[11px] text-slate-500">
                    {revokeTarget.clientName} • <span className="font-mono">{revokeTarget.workOrderId}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmRevoke} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRevokeAction('REVOKE')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                    revokeAction === 'REVOKE'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Revoke ID
                </button>
                <button
                  type="button"
                  onClick={() => setRevokeAction('SUSPEND')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                    revokeAction === 'SUSPEND'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Suspend Temporarily
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Reason for Audit Trail</label>
                <textarea
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Candidate requested replacement ID, security concern, or paused engagement..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alsoUpdateClient}
                  onChange={(e) => setAlsoUpdateClient(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>
                  Also block candidate self-recovery via &ldquo;Forgot Work Order ID&rdquo; by setting client status to{' '}
                  <strong>{revokeAction === 'REVOKE' ? 'REVOKED' : 'SUSPENDED'}</strong>.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevokeTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyKey === `revoke_${revokeTarget.workOrderId}_${revokeTarget.clientId}`}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  Confirm {revokeAction === 'REVOKE' ? 'Revocation' : 'Suspension'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Health & Telemetry Drawer */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl border-l border-slate-200 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{inspectRecord.clientName}</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {inspectRecord.workOrderId} • {inspectRecord.clientId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Health Breakdown */}
              {(() => {
                const hs = HEALTH_BADGE_STYLES[inspectRecord.healthStatus] || HEALTH_BADGE_STYLES.HEALTHY;
                return (
                  <div className={`p-4 rounded-2xl border ${hs.bg} ${hs.border}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-extrabold text-sm flex items-center gap-1.5 ${hs.text}`}>
                        <HeartPulse className="w-4 h-4" />
                        Health Status: {hs.label}
                      </span>
                      <span className={`text-lg font-black ${hs.text}`}>{inspectRecord.healthScore}/100</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full ${hs.bar}`}
                        style={{ width: `${Math.max(4, Math.min(100, inspectRecord.healthScore))}%` }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      {inspectRecord.healthSignals.map((sig, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-700">
                          <Activity className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-500" />
                          <span>{sig}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Account Metadata */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Mobile</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inspectRecord.mobile || 'Missing'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Login ID Status</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inspectRecord.loginStatus}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Client Status</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inspectRecord.clientStatus}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Failed Attempts</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inspectRecord.failedLoginAttempts || 0}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Last Login</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{formatDateTime(inspectRecord.lastLoginAt)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Work Order Status</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inspectRecord.workOrderStatus || 'Registered'}</p>
                </div>
                {inspectRecord.revokedReason && (
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-rose-500">Revocation Reason</span>
                    <p className="font-medium text-rose-700 mt-0.5">{inspectRecord.revokedReason}</p>
                  </div>
                )}
              </div>

              {/* Candidate-Specific Activity */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  Recent Security & Login Activity
                </h4>
                {inspectedLogs.length === 0 ? (
                  <p className="text-slate-400 italic">No recent security events found for this account.</p>
                ) : (
                  <div className="space-y-2">
                    {inspectedLogs.map((l, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[10px] text-indigo-700">{l.event}</span>
                          <span className="text-[10px] text-slate-400">{formatDateTime(l.timestamp)}</span>
                        </div>
                        {l.reason && <p className="text-[11px] text-slate-600 mt-1">{l.reason}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={async () => {
                  await handleIssueNewId(inspectRecord);
                  setInspectRecord(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Issue Fresh Work Order ID
              </button>
              <button
                type="button"
                onClick={() => setInspectRecord(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
