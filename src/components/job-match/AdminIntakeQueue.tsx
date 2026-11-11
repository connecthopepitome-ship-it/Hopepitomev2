'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '../career/admin/AdminAuthContext';
import { JOB_MATCH_INTAKE_STATUSES, getMatchScoreBand } from '@/lib/job-match/constants';
import {
  deleteAdminJobMatchRecord,
  downloadAdminIntakeResume,
  fetchAdminJobMatchControls,
  fetchAdminJobMatchQueue,
  fetchJobMatchFeatureEnabled,
  isJobMatchBuildEnabled,
  saveAdminJobMatchControls,
  updateAdminIntakeStatus,
} from '@/lib/job-match/client';
import type {
  JobMatchControlSettings,
  JobMatchImportLog,
  JobMatchIntake,
  JobMatchIntakeStatus,
  JobMatchRecord,
} from '@/lib/job-match/types';

function formatBytes(size?: number): string {
  const n = Number(size || 0);
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  if (n >= 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
}

export function AdminIntakeQueue() {
  const { user, hasPermission } = useAdminAuth();
  const [featureEnabled, setFeatureEnabled] = useState(isJobMatchBuildEnabled());
  const [checkingFlag, setCheckingFlag] = useState(true);
  const [intakes, setIntakes] = useState<JobMatchIntake[]>([]);
  const [matchesByCandidate, setMatchesByCandidate] = useState<Record<string, JobMatchRecord[]>>({});
  const [importLogs, setImportLogs] = useState<JobMatchImportLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | JobMatchIntakeStatus>('ALL');
  const [activeTab, setActiveTab] = useState<'queue' | 'logs' | 'controls'>('queue');
  const [controls, setControls] = useState<JobMatchControlSettings>({
    enabled: true,
    intakeOpen: true,
    emailNotificationsEnabled: true,
    statusBanner: '',
  });
  const [aiJobMatchLeadsCount, setAiJobMatchLeadsCount] = useState(0);
  const [savingControls, setSavingControls] = useState(false);
  const [controlsSavedMsg, setControlsSavedMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tab = new URLSearchParams(window.location.search).get('tab');
      if (tab === 'controls' || tab === 'logs' || tab === 'queue') {
        setActiveTab(tab);
      }
    }
  }, []);

  // Detail modal
  const [selectedIntake, setSelectedIntake] = useState<JobMatchIntake | null>(null);
  const [editStatus, setEditStatus] = useState<JobMatchIntakeStatus>('Resume received');
  const [editNotes, setEditNotes] = useState('');
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const canView = hasPermission('job_match', 'view');
  const canEdit = hasPermission('job_match', 'edit');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, ctrlRes] = await Promise.all([
        fetchAdminJobMatchQueue(user),
        fetchAdminJobMatchControls(user).catch(() => null),
      ]);
      setIntakes(res.intakes || []);
      setMatchesByCandidate(res.matchesByCandidate || {});
      setImportLogs(res.importLogs || []);
      if (ctrlRes) {
        setControls(ctrlRes.controls);
        setAiJobMatchLeadsCount(ctrlRes.stats?.aiJobMatchLeadsCount || 0);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to load AI Job Match queue.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveControls = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setSavingControls(true);
    setControlsSavedMsg(null);
    setError(null);
    try {
      const updated = await saveAdminJobMatchControls(controls, user);
      setControls(updated);
      setControlsSavedMsg('AI Job Match admin controls saved.');
    } catch (err: any) {
      setError(err?.message || 'Failed to save AI Job Match controls.');
    } finally {
      setSavingControls(false);
    }
  };

  const handleDeleteMatch = async (candidateId: string, matchId: string) => {
    try {
      await deleteAdminJobMatchRecord(matchId, user);
      setMatchesByCandidate((prev) => ({
        ...prev,
        [candidateId]: (prev[candidateId] || []).filter((m) => m.id !== matchId),
      }));
    } catch (err: any) {
      setError(err?.message || 'Failed to remove match record.');
    }
  };

  const handleCopyText = (id: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const buildOn = isJobMatchBuildEnabled();
    setFeatureEnabled(buildOn);
    setCheckingFlag(false);
    if (buildOn && canView && user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [canView, user]);

  const filteredIntakes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return intakes.filter((i) => {
      if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
      if (!q) return true;
      return (
        i.candidate_id.toLowerCase().includes(q) ||
        (i.candidate_code || '').toLowerCase().includes(q) ||
        i.candidate_name.toLowerCase().includes(q) ||
        i.target_role.toLowerCase().includes(q) ||
        i.intake_reference.toLowerCase().includes(q) ||
        (i.preferred_locations || []).join(' ').toLowerCase().includes(q)
      );
    });
  }, [intakes, searchQuery, statusFilter]);

  const openDetails = (intake: JobMatchIntake) => {
    setSelectedIntake(intake);
    setEditStatus(intake.status);
    setEditNotes(intake.staff_notes || '');
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntake || !canEdit) return;
    setSavingUpdate(true);
    setError(null);
    try {
      const updated = await updateAdminIntakeStatus(
        {
          intakeId: selectedIntake.id,
          status: editStatus,
          staffNotes: editNotes,
        },
        user
      );
      setIntakes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedIntake(updated);
    } catch (err: any) {
      setError(err?.message || 'Failed to update intake status.');
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleDownloadResume = async (intakeId: string) => {
    setDownloadingId(intakeId);
    setError(null);
    try {
      await downloadAdminIntakeResume(intakeId, user);
    } catch (err: any) {
      setError(err?.message || 'Failed to download candidate resume.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (checkingFlag) {
    return (
      <div className="p-12 flex justify-center">
        <div className="w-7 h-7 border-2 border-[#173B8F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!featureEnabled) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
        <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">AI Job Match Disabled</h2>
        <p className="text-xs text-slate-500">
          Set <code>FEATURE_JOB_MATCH=true</code> in configuration to enable AI Job Match operations.
        </p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-2">
        <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">Permission Required</h2>
        <p className="text-xs text-slate-600">
          Your role does not include view permission for the AI Job Match module.
        </p>
      </div>
    );
  }

  const candidateMatches = selectedIntake
    ? matchesByCandidate[selectedIntake.candidate_id] || []
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#173B8F] block">
            Career Operations • AI Job Match
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            AI Job Match Intake Queue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review candidate job-match requests, download resumes securely, update progress, and inspect GAS imports.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'queue'
                ? 'border-[#173B8F] text-[#173B8F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Intake Queue ({intakes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
              activeTab === 'logs'
                ? 'border-[#173B8F] text-[#173B8F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            GAS Import Logs ({importLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('controls')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition inline-flex items-center gap-1.5 ${
              activeTab === 'controls'
                ? 'border-[#173B8F] text-[#173B8F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Admin Controls</span>
          </button>
        </div>

        <Link
          href="/career-services/admin/scanning-leads"
          className="text-xs font-bold text-[#173B8F] hover:underline px-2 py-1"
        >
          View Synced Scanning Leads ({aiJobMatchLeadsCount}) →
        </Link>
      </div>

      {activeTab === 'queue' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Search & Status Filter */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate ID, name, role, location, or reference..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="ALL">All Statuses</option>
              {JOB_MATCH_INTAKE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#173B8F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredIntakes.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">
              <BriefcaseBusiness className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              No AI Job Match intake requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Candidate ID</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4">Preferred Locations</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Submitted Date</th>
                    <th className="py-3 px-4">Intake Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIntakes.map((intake) => (
                    <tr key={intake.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                        <div>{intake.candidate_code || intake.candidate_id}</div>
                        <div className="text-[10px] text-slate-400">{intake.intake_reference}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {intake.candidate_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{intake.target_role}</div>
                        <div className="text-[11px] text-slate-500">{intake.job_type}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[200px]">
                        {(intake.preferred_locations || []).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">{intake.experience_years}</td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(intake.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            intake.status === 'Jobs ready'
                              ? 'bg-emerald-50 text-emerald-700'
                              : intake.status === 'Matching in progress'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {intake.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDownloadResume(intake.id)}
                            disabled={downloadingId === intake.id}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-1"
                            title="Download Resume Securely"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{downloadingId === intake.id ? '...' : 'Resume'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openDetails(intake)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#173B8F] hover:bg-[#132c6b] text-white font-semibold inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'logs' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {importLogs.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-500">No Google Apps Script import logs yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Started</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Received</th>
                    <th className="py-3 px-4">Saved</th>
                    <th className="py-3 px-4">Updated</th>
                    <th className="py-3 px-4">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 px-4 text-slate-700">
                        {new Date(log.import_started_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold">{log.status}</td>
                      <td className="py-3 px-4">{log.total_received}</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">{log.saved_count}</td>
                      <td className="py-3 px-4 text-indigo-700 font-bold">{log.updated_count}</td>
                      <td className="py-3 px-4 text-rose-700 font-bold">{log.error_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Operations Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Intakes
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{intakes.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pending Match
              </span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {intakes.filter((i) => i.status !== 'Jobs ready').length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Jobs Ready
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                {intakes.filter((i) => i.status === 'Jobs ready').length}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Scanning Leads Synced
              </span>
              <p className="text-2xl font-extrabold text-[#173B8F] mt-1">{aiJobMatchLeadsCount}</p>
            </div>
          </div>

          <form
            onSubmit={handleSaveControls}
            className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-xs"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Dedicated AI Job Match Admin Controls
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Control module visibility, intake submissions, email alerts, and portal messages independently.
              </p>
            </div>

            {controlsSavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                {controlsSavedMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.enabled}
                  disabled={!canEdit}
                  onChange={(e) => setControls((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="mt-1 rounded text-[#173B8F]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Module Active Live</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    When disabled, candidate AI Job Match routes pause gracefully while admin controls stay open.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.intakeOpen}
                  disabled={!canEdit}
                  onChange={(e) => setControls((prev) => ({ ...prev, intakeOpen: e.target.checked }))}
                  className="mt-1 rounded text-[#173B8F]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Accept New Intakes</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    Allow candidates to submit new role requests and resumes while viewing existing results.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={controls.emailNotificationsEnabled}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setControls((prev) => ({ ...prev, emailNotificationsEnabled: e.target.checked }))
                  }
                  className="mt-1 rounded text-[#173B8F]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Email Notifications</span>
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    Trigger Apps Script email alerts automatically when new job matches are imported.
                  </span>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Portal Notice Banner (Optional)
              </label>
              <input
                type="text"
                disabled={!canEdit}
                value={controls.statusBanner || ''}
                onChange={(e) => setControls((prev) => ({ ...prev, statusBanner: e.target.value }))}
                placeholder="e.g. UAE & India hiring surge: matches updated every 15 minutes."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                {controls.updatedAt
                  ? `Last updated ${new Date(controls.updatedAt).toLocaleString()} by ${controls.updatedBy || 'Admin'}`
                  : 'Using default active settings (FEATURE_JOB_MATCH=true)'}
              </div>
              {canEdit && (
                <button
                  type="submit"
                  disabled={savingControls}
                  className="px-5 py-2.5 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{savingControls ? 'Saving Controls...' : 'Save Admin Controls'}</span>
                </button>
              )}
            </div>
          </form>

          {/* Google Sheet Sync Helper */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Google Sheet Sync Reference (`MatchedJobs`)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Copy pending candidate rows (`candidateId`, `candidateName`, `targetRole`) directly into your Google Sheet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const tsv = intakes
                    .filter((i) => i.status !== 'Jobs ready')
                    .map(
                      (i) =>
                        `${i.candidate_code || i.candidate_id}\t${i.candidate_name}\t${i.target_role}\t\t\t${(
                          i.preferred_locations || []
                        ).join(', ')}\t${i.job_type}\t${i.experience_years}`
                    )
                    .join('\n');
                  handleCopyText('sheet-tsv', tsv || 'No pending intakes');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 inline-flex items-center gap-1.5 self-start"
              >
                {copiedId === 'sheet-tsv' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === 'sheet-tsv' ? 'Copied Pending Rows!' : 'Copy Pending Rows for Sheet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intake Details Modal */}
      {selectedIntake && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#173B8F]">
                  {selectedIntake.intake_reference} • {selectedIntake.candidate_code || selectedIntake.candidate_id}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {selectedIntake.candidate_name} — {selectedIntake.target_role}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitted {new Date(selectedIntake.created_at).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIntake(null)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Intake Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-500 block">Preferred Locations</span>
                <span className="font-semibold text-slate-900">
                  {(selectedIntake.preferred_locations || []).join(', ')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Experience & Job Type</span>
                <span className="font-semibold text-slate-900">
                  {selectedIntake.experience_years} • {selectedIntake.job_type}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Current / Expected Salary</span>
                <span className="font-semibold text-slate-900">
                  {selectedIntake.current_salary || 'Not stated'} →{' '}
                  {selectedIntake.expected_salary || 'Not stated'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Notice Period</span>
                <span className="font-semibold text-slate-900">
                  {selectedIntake.notice_period || 'Not stated'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Key Skills</span>
                <span className="font-semibold text-slate-900">
                  {(selectedIntake.key_skills || []).length > 0
                    ? selectedIntake.key_skills.join(', ')
                    : 'Not specified'}
                </span>
              </div>
              <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#173B8F]" />
                  <span>
                    <strong>{selectedIntake.resume_original_filename}</strong> (
                    {formatBytes(selectedIntake.resume_size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadResume(selectedIntake.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>

            {/* Staff Status & Notes Update */}
            <form onSubmit={handleSaveDetails} className="space-y-3 border border-slate-200 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Status & Staff Notes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Intake Status
                  </label>
                  <select
                    value={editStatus}
                    disabled={!canEdit}
                    onChange={(e) => setEditStatus(e.target.value as JobMatchIntakeStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {JOB_MATCH_INTAKE_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Consent Timestamp
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    {new Date(selectedIntake.consent_timestamp).toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Staff Notes
                </label>
                <textarea
                  rows={3}
                  disabled={!canEdit}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add internal matching context or consultant notes..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {canEdit && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingUpdate}
                    className="px-4 py-2 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{savingUpdate ? 'Saving...' : 'Save Status & Notes'}</span>
                  </button>
                </div>
              )}
            </form>

            {/* Status History */}
            {Array.isArray(selectedIntake.status_history) && selectedIntake.status_history.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Status History
                </h3>
                <div className="space-y-1.5 text-xs">
                  {selectedIntake.status_history.map((entry, idx) => (
                    <div
                      key={`${entry.changedAt}_${idx}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="font-semibold text-slate-800">
                        {entry.status} {entry.note ? `— ${entry.note}` : ''}
                      </span>
                      <span className="text-slate-500 inline-flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        {entry.changedBy} • {new Date(entry.changedAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imported Job Matches for Candidate */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Imported Job Matches for Candidate ({candidateMatches.length})
              </h3>
              {candidateMatches.length === 0 ? (
                <p className="text-xs text-slate-500">No job matches imported for this candidate yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {candidateMatches.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">
                          {m.title} — {m.company}
                        </div>
                        <div className="text-slate-500">
                          {m.location} • {m.source} • {m.recommended_service}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold shrink-0">
                        {m.match_score} ({getMatchScoreBand(m.match_score)})
                      </span>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMatch(selectedIntake.candidate_id, m.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 shrink-0"
                          title="Remove match record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

