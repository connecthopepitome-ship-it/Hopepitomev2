'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  Filter,
  Globe,
  MapPin,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react';
import { CareerBadge, CareerButton, CareerCard } from '../career/ui/CareerDesignTokens';
import { useCareerAuth } from '../career/portal/AuthContext';
import {
  JOB_MATCH_DISCLAIMER,
  JOB_MATCH_EMPTY_STATE_MESSAGE,
  getMatchScoreBand,
  resolveFixMyResumeHref,
} from '@/lib/job-match/constants';
import {
  deleteAllCandidateJobMatchData,
  fetchCandidateJobMatches,
  saveCandidateJobAction,
} from '@/lib/job-match/client';
import type { JobMatchActionType, JobMatchRecord } from '@/lib/job-match/types';

function getScoreStyle(score: number) {
  const band = getMatchScoreBand(score);
  if (band === 'High') {
    return {
      band,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    };
  }
  if (band === 'Medium') {
    return {
      band,
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
    };
  }
  return {
    band,
    bg: 'bg-slate-100 border-slate-200 text-slate-700',
  };
}

export function MatchResultsView() {
  const { user, client } = useCareerAuth();
  const [jobs, setJobs] = useState<JobMatchRecord[]>([]);
  const [summary, setSummary] = useState({
    totalJobs: 0,
    highChanceCount: 0,
    newJobsCount: 0,
    resumeGapCount: 0,
    showResumeGapBanner: false,
  });
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableJobTypes, setAvailableJobTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [chanceFilter, setChanceFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SAVED' | 'APPLIED'>('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCandidateJobMatches(user);
      setJobs(res.jobs || []);
      setSummary(res.summary);
      setAvailableLocations(res.filters?.locations || []);
      setAvailableJobTypes(res.filters?.jobTypes || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load matched jobs. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (client?.id) {
      loadMatches();
    }
  }, [client?.id]);

  const handleAction = async (job: JobMatchRecord, targetAction: JobMatchActionType) => {
    const nextAction: JobMatchActionType | 'CLEAR' =
      job.candidate_action === targetAction && targetAction !== 'NOT_INTERESTED'
        ? 'CLEAR'
        : targetAction;

    setUpdatingId(job.id);
    try {
      await saveCandidateJobAction(job.id, nextAction, user);
      if (nextAction === 'NOT_INTERESTED') {
        setJobs((prev) => {
          const remaining = prev.filter((item) => item.id !== job.id);
          setSummary((s) => ({
            ...s,
            totalJobs: remaining.length,
            highChanceCount: remaining.filter((j) => j.match_score >= 75).length,
          }));
          return remaining;
        });
      } else {
        setJobs((prev) =>
          prev.map((item) =>
            item.id === job.id
              ? { ...item, candidate_action: nextAction === 'CLEAR' ? null : nextAction }
              : item
          )
        );
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to update job status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteAll = async () => {
    setDeletingData(true);
    try {
      const res = await deleteAllCandidateJobMatchData(user);
      setJobs([]);
      setSummary({
        totalJobs: 0,
        highChanceCount: 0,
        newJobsCount: 0,
        resumeGapCount: 0,
        showResumeGapBanner: false,
      });
      setDeleteSuccessMsg(res.message);
      setShowDeleteModal(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete your AI Job Match data.');
      setShowDeleteModal(false);
    } finally {
      setDeletingData(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (locationFilter !== 'ALL' && job.location !== locationFilter) return false;
        if (jobTypeFilter !== 'ALL' && job.job_type !== jobTypeFilter) return false;
        if (chanceFilter !== 'ALL' && getMatchScoreBand(job.match_score) !== chanceFilter) return false;
        if (statusFilter === 'SAVED' && job.candidate_action !== 'SAVED') return false;
        if (statusFilter === 'APPLIED' && job.candidate_action !== 'APPLIED') return false;
        return true;
      })
      .sort((a, b) => b.match_score - a.match_score);
  }, [jobs, locationFilter, jobTypeFilter, chanceFilter, statusFilter]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header & Summary */}
      <CareerCard variant="elevated" padding="md" className="p-5 sm:p-7 bg-white rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#7454F5]">
              <Sparkles className="w-3.5 h-3.5" />
              AI Job Match • My Opportunities
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#17152F] mt-1">
              You match {summary.totalJobs} jobs · {summary.highChanceCount} high-chance
            </h1>
            <p className="text-xs sm:text-sm text-[#71778A] mt-1">
              Curated roles ranked highest by AI fit score with skill gap guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link href="/job-match/intake">
              <CareerButton variant="primary" size="md">
                New Match Request
              </CareerButton>
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 inline-flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete my job-match data</span>
            </button>
          </div>
        </div>
      </CareerCard>

      {deleteSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3">
          <span>{deleteSuccessMsg}</span>
          <button type="button" onClick={() => setDeleteSuccessMsg(null)} className="font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Data-driven Resume Gap Banner */}
      {summary.showResumeGapBanner && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Your resume is holding you back — get it fixed.
              </h3>
              <p className="text-xs text-amber-900 mt-0.5">
                {summary.resumeGapCount} of your {summary.totalJobs} matched roles flagged resume or keyword gaps.
              </p>
            </div>
          </div>
          <Link
            href="/career-services/services?service=ATS_OPTIMISATION"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold text-center whitespace-nowrap transition"
          >
            Fix My Resume
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={loadMatches} className="font-bold underline">
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      {jobs.length > 0 && (
        <CareerCard variant="default" padding="sm" className="p-4 bg-white rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#17152F] mb-3">
            <Filter className="w-3.5 h-3.5 text-[#7454F5]" />
            <span>Filter Opportunities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              aria-label="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#17152F] bg-white"
            >
              <option value="ALL">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by job type"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#17152F] bg-white"
            >
              <option value="ALL">All Job Types</option>
              {availableJobTypes.map((jt) => (
                <option key={jt} value={jt}>
                  {jt}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by match chances"
              value={chanceFilter}
              onChange={(e) => setChanceFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#17152F] bg-white"
            >
              <option value="ALL">All Chances</option>
              <option value="High">High (75–100)</option>
              <option value="Medium">Medium (50–74)</option>
              <option value="Low">Low (Below 50)</option>
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#17152F] bg-white"
            >
              <option value="ALL">Status: All</option>
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
            </select>
          </div>
        </CareerCard>
      )}

      {/* Results List */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 flex justify-center">
          <div className="w-7 h-7 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center space-y-3">
          <BriefcaseBusiness className="w-9 h-9 text-[#7454F5] mx-auto" />
          <h2 className="text-base font-bold text-[#17152F]">{JOB_MATCH_EMPTY_STATE_MESSAGE}</h2>
          <p className="text-xs text-[#71778A] max-w-md mx-auto">
            Your resume intake is being matched against live openings tailored to your target role and locations.
          </p>
          <Link
            href="/job-match/intake"
            className="inline-flex px-4 py-2.5 rounded-xl bg-[#7454F5] text-white text-xs font-bold hover:bg-[#6342E8] transition"
          >
            Check or Submit Intake Request
          </Link>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-[#71778A]">
          No job matches fit your current filter selection. Try resetting a filter above.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const scoreStyle = getScoreStyle(job.match_score);
            const isSaving = updatingId === job.id;
            const fixHref = resolveFixMyResumeHref(job.recommended_service);

            return (
              <CareerCard key={job.id} variant="default" padding="md" className="p-5 sm:p-6 bg-white rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {job.is_new && (
                        <CareerBadge variant="primary" size="sm">
                          New
                        </CareerBadge>
                      )}
                      {job.candidate_action === 'SAVED' && (
                        <CareerBadge variant="secondary" size="sm">
                          Saved
                        </CareerBadge>
                      )}
                      {job.candidate_action === 'APPLIED' && (
                        <CareerBadge variant="success" size="sm">
                          Applied
                        </CareerBadge>
                      )}
                      <span className="text-[11px] font-semibold text-[#71778A]">{job.target_role}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-extrabold text-[#17152F] leading-snug">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#71778A]">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#201D36]">
                        <Building2 className="w-3.5 h-3.5 text-[#7454F5]" />
                        {job.company}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span>{job.job_type}</span>
                      <span>Exp: {job.experience || 'Not stated'}</span>
                      <span>Salary: {job.salary || 'Not stated'}</span>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className={`shrink-0 px-3.5 py-2 rounded-2xl border text-center min-w-[96px] ${scoreStyle.bg}`}
                  >
                    <div className="text-lg font-black leading-none">{job.match_score}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1">
                      {scoreStyle.band} Match
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#71778A] border-y border-slate-100 py-2.5">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Posted: {job.posted_date || job.found_on}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    Source: {job.source}
                  </span>
                  {job.recommended_service && (
                    <span className="font-semibold text-[#7454F5]">
                      Recommended: {job.recommended_service}
                    </span>
                  )}
                </div>

                {/* Match Reason & Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <span className="block font-bold text-emerald-900 mb-1">Why you match</span>
                    <p className="text-emerald-950/90 leading-relaxed">
                      {job.match_reason || 'Strong alignment with your target role and skills.'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
                    <span className="block font-bold text-amber-900 mb-1">What&apos;s holding you back</span>
                    <p className="text-amber-950/90 leading-relaxed">
                      {job.resume_gaps || 'No major resume gaps detected.'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#7454F5] hover:bg-[#6342E8] text-white text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href={fixHref}
                      className="px-3.5 py-2 rounded-xl bg-[#7454F5]/10 hover:bg-[#7454F5]/15 text-[#7454F5] text-xs font-bold inline-flex items-center gap-1.5 transition"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Fix My Resume</span>
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleAction(job, 'SAVED')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1 transition ${
                        job.candidate_action === 'SAVED'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-[#201D36] border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{job.candidate_action === 'SAVED' ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleAction(job, 'APPLIED')}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1 transition ${
                        job.candidate_action === 'APPLIED'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-[#201D36] border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleAction(job, 'NOT_INTERESTED')}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-[#71778A] hover:text-rose-600 hover:border-rose-200 inline-flex items-center gap-1 transition"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Not Interested</span>
                    </button>
                  </div>
                </div>
              </CareerCard>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-center text-[#71778A] pt-2">{JOB_MATCH_DISCLAIMER}</p>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#17152F]">Delete My AI Job Match Data?</h3>
            <p className="text-xs text-[#71778A] leading-relaxed">
              This permanently removes your AI Job Match intake forms, uploaded job-match resumes, imported job opportunities, and saved/applied actions. Your Hopepitome account and unrelated career services remain intact.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingData}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#17152F] bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={deletingData}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {deletingData ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

