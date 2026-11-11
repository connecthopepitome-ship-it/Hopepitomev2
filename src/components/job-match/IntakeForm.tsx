'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleX,
  Clock3,
  FileCheck2,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { CareerBadge, CareerButton, CareerCard } from '../career/ui/CareerDesignTokens';
import { useCareerAuth } from '../career/portal/AuthContext';
import { useJobMatchSession } from './JobMatchFeatureGate';
import {
  JOB_MATCH_ALLOWED_EXTENSIONS,
  JOB_MATCH_CONSENT_TEXT,
  JOB_MATCH_JOB_TYPES,
  JOB_MATCH_LOCATIONS,
  JOB_MATCH_MAX_FILE_SIZE_BYTES,
} from '@/lib/job-match/constants';
import {
  deleteAllCandidateJobMatchData,
  fetchCandidateIntakes,
  submitCandidateIntake,
} from '@/lib/job-match/client';
import type { JobMatchIntake, JobMatchIntakeStatus } from '@/lib/job-match/types';

function getIntakeStatusBadge(status: JobMatchIntakeStatus) {
  switch (status) {
    case 'Jobs ready':
      return { label: 'Jobs ready', variant: 'success' as const };
    case 'Matching in progress':
      return { label: 'Matching in progress', variant: 'warning' as const };
    default:
      return { label: 'Resume received', variant: 'primary' as const };
  }
}

export function IntakeForm() {
  const { user, client } = useCareerAuth();
  const verifiedSession = useJobMatchSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serverCandidateCode, setServerCandidateCode] = useState<string>('');

  // Form state
  const [targetRole, setTargetRole] = useState('');
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [jobType, setJobType] = useState<string>('Full-time');
  const [skillInput, setSkillInput] = useState('');
  const [keySkills, setKeySkills] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  // UI feedback
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ reference: string; role: string } | null>(null);

  // Existing intake history
  const [intakes, setIntakes] = useState<JobMatchIntake[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Delete All AI Job Match Data modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await fetchCandidateIntakes(user);
      if (data.candidateCode) setServerCandidateCode(data.candidateCode);
      setIntakes(data.intakes || []);
      setUnreadNotifications(Number(data.unreadNotifications || 0));
    } catch (err) {
      console.warn('Unable to load job match intakes:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (client?.id) {
      loadHistory();
    }
  }, [client?.id]);

  const toggleLocation = (loc: string) => {
    setPreferredLocations((prev) =>
      prev.includes(loc) ? prev.filter((item) => item !== loc) : [...prev, loc]
    );
  };

  const handleAddSkill = () => {
    const clean = skillInput.trim().replace(/,+$/, '');
    if (!clean) return;
    if (!keySkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setKeySkills((prev) => [...prev, clean].slice(0, 30));
    }
    setSkillInput('');
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateFile = (file: File): string | null => {
    if (file.size > JOB_MATCH_MAX_FILE_SIZE_BYTES) {
      return 'File too large — max 8 MB';
    }
    const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : '';
    if (!ext || !(JOB_MATCH_ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
      return 'Only PDF, DOCX, JPG, PNG allowed';
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) {
      setFormError(err);
      setSelectedFile(null);
      e.target.value = '';
      return;
    }
    setSelectedFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessInfo(null);

    if (!targetRole.trim()) {
      setFormError('Please enter your target role or job title.');
      return;
    }
    if (preferredLocations.length === 0) {
      setFormError('Please select at least one preferred location.');
      return;
    }
    if (!experienceYears.trim()) {
      setFormError('Please specify your total years of experience.');
      return;
    }
    if (!selectedFile) {
      setFormError('Please upload your resume (PDF, DOCX, JPG, or PNG up to 8 MB).');
      return;
    }
    const fileErr = validateFile(selectedFile);
    if (fileErr) {
      setFormError(fileErr);
      return;
    }
    if (!consentGiven) {
      setFormError('Please confirm the data processing consent checkbox to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const pendingSkills = skillInput.trim()
        ? Array.from(new Set([...keySkills, skillInput.trim()]))
        : keySkills;

      const res = await submitCandidateIntake(
        {
          targetRole: targetRole.trim(),
          preferredLocations,
          experienceYears: experienceYears.trim(),
          currentSalary: currentSalary.trim() || undefined,
          expectedSalary: expectedSalary.trim() || undefined,
          noticePeriod: noticePeriod.trim() || undefined,
          jobType,
          keySkills: pendingSkills,
          consentGiven: true,
          file: selectedFile,
        },
        user
      );

      setSuccessInfo({
        reference: res.intake.intake_reference,
        role: res.intake.target_role,
      });

      // Reset inputs to allow submitting a separate role/location request immediately
      setTargetRole('');
      setPreferredLocations([]);
      setExperienceYears('');
      setCurrentSalary('');
      setExpectedSalary('');
      setNoticePeriod('');
      setKeySkills([]);
      setSkillInput('');
      setSelectedFile(null);
      setConsentGiven(false);
      if (fileInputRef.current) fileInputRef.current.value = '';

      await loadHistory();
    } catch (err: any) {
      setFormError(err?.message || 'Upload failed, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayCandidateId =
    verifiedSession?.candidateCode ||
    serverCandidateCode ||
    client?.currentWorkOrderId ||
    client?.clientCode ||
    client?.id ||
    '';

  const handleDeleteAllData = async () => {
    setDeletingData(true);
    try {
      const res = await deleteAllCandidateJobMatchData(user);
      setDeleteFeedback(res.message);
      setIntakes([]);
      setUnreadNotifications(0);
      setShowDeleteModal(false);
    } catch (err: any) {
      setFormError(err?.message || 'Unable to delete AI Job Match data.');
      setShowDeleteModal(false);
    } finally {
      setDeletingData(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <CareerCard variant="elevated" padding="md" className="p-5 sm:p-7 bg-white rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#7454F5]">
              <Sparkles className="w-3.5 h-3.5" />
              AI Job Match • Intake
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#17152F] mt-1">
              Find Matching Jobs
            </h1>
            <p className="text-xs sm:text-sm text-[#71778A] mt-1 max-w-2xl leading-relaxed">
              Submit your target role, preferred cities, and resume. You can submit separate requests for different roles or regions without overwriting earlier requests.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {displayCandidateId && (
              <div className="px-3.5 py-2 rounded-xl bg-[#F8F7FC] border border-[#7454F5]/25 text-xs font-bold text-[#17152F]">
                Your Candidate ID:{' '}
                <code className="font-mono text-[#7454F5] font-black">{displayCandidateId}</code>
              </div>
            )}
            <Link href="/job-match/results">
              <CareerButton variant="secondary" size="md">
                My Job Matches {unreadNotifications > 0 ? `(${unreadNotifications} New)` : ''}
              </CareerButton>
            </Link>
          </div>
        </div>
      </CareerCard>

      {deleteFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3">
          <span>{deleteFeedback}</span>
          <button type="button" onClick={() => setDeleteFeedback(null)} className="text-emerald-700 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {successInfo && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Job-Match Intake Submitted — {successInfo.reference}
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Status: <strong>Resume received</strong> for <strong>{successInfo.role}</strong>. We&apos;re finding matching opportunities for you.
              </p>
            </div>
          </div>
          <Link
            href="/job-match/results"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center whitespace-nowrap transition"
          >
            View My Job Matches
          </Link>
        </div>
      )}

      {/* Intake Form */}
      <CareerCard variant="default" padding="md" className="p-5 sm:p-7 bg-white rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <CircleX className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17152F] mb-1.5">
                Target Role / Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Data Analyst, ERP Consultant"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17152F] mb-1.5">
                Total Experience <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 4 years, 0-2 years, 8+ years"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
                required
              />
            </div>
          </div>

          {/* Preferred Locations Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-[#17152F] mb-1.5">
              Preferred Locations <span className="text-rose-500">*</span>
              <span className="text-[11px] font-normal text-[#71778A] ml-1.5">
                (Select one or more — India, UAE, Remote)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {JOB_MATCH_LOCATIONS.map((loc) => {
                const selected = preferredLocations.includes(loc);
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocation(loc)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      selected
                        ? 'bg-[#7454F5] text-white border-[#7454F5] shadow-xs'
                        : 'bg-[#F8F7FC] text-[#201D36] border-slate-200 hover:border-[#7454F5]/40'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{loc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17152F] mb-1.5">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] bg-white focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
              >
                {JOB_MATCH_JOB_TYPES.map((jt) => (
                  <option key={jt} value={jt}>
                    {jt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17152F] mb-1.5">
                Current Salary <span className="text-[#71778A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(e.target.value)}
                placeholder="e.g. 12 LPA / AED 12k"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17152F] mb-1.5">
                Expected Salary <span className="text-[#71778A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="e.g. 16 LPA / AED 18k"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17152F] mb-1.5">
                Notice Period <span className="text-[#71778A] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)}
                placeholder="e.g. Immediate / 30 days"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
              />
            </div>
          </div>

          {/* Optional Key Skills Tags */}
          <div>
            <label className="block text-xs font-bold text-[#17152F] mb-1.5">
              Key Skills <span className="text-[#71778A] font-normal">(Optional tags — press Enter to add)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. SQL, Power BI, Python, SAP"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#17152F] focus:outline-none focus:ring-2 focus:ring-[#7454F5]/30 focus:border-[#7454F5]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#17152F] inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
            {keySkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {keySkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#7454F5]/10 text-[#7454F5] text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => setKeySkills((prev) => prev.filter((s) => s !== skill))}
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Private Resume Upload */}
          <div>
            <label className="block text-xs font-bold text-[#17152F] mb-1.5">
              Resume Upload <span className="text-rose-500">*</span>
              <span className="text-[11px] font-normal text-[#71778A] ml-1.5">
                (PDF, DOCX, DOC, JPG, PNG • Max 8 MB • Stored privately)
              </span>
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-[#7454F5]/50 rounded-2xl p-5 bg-[#F8F7FC]/60 text-center transition">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={submitting}
                className="hidden"
                id="job-match-resume-upload"
              />
              <label
                htmlFor="job-match-resume-upload"
                className={`block space-y-2 ${submitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#149B75]">
                    <FileCheck2 className="w-5 h-5" />
                    <span>
                      {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-[#7454F5] mx-auto" />
                    <span className="block text-xs font-bold text-[#17152F]">
                      Click to upload your resume
                    </span>
                    <span className="block text-[11px] text-[#71778A]">
                      Accepted formats: PDF, DOCX, DOC, JPG, PNG up to 8 MB
                    </span>
                  </>
                )}
              </label>
            </div>
            {submitting && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#7454F5]/10 border border-[#7454F5]/20 flex items-center gap-2.5 text-xs font-semibold text-[#7454F5]">
                <div className="w-4 h-4 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Uploading your resume securely and saving intake request...</span>
              </div>
            )}
          </div>

          {/* Consent */}
          <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              disabled={submitting}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#7454F5] focus:ring-[#7454F5]"
              required
            />
            <span className="text-xs text-[#201D36] leading-relaxed">{JOB_MATCH_CONSENT_TEXT}</span>
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-[#71778A]">
              Your Candidate ID:{' '}
              <span className="font-mono font-bold text-[#17152F]">
                {displayCandidateId}
              </span>
            </p>
            <CareerButton type="submit" variant="primary" size="lg" loading={submitting} disabled={submitting}>
              {submitting ? 'Uploading Resume & Submitting...' : 'Submit Job Match Request'}
            </CareerButton>
          </div>
        </form>
      </CareerCard>

      {/* Previous Intake History */}
      <CareerCard variant="default" padding="md" className="p-5 sm:p-6 bg-white rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#17152F]">
              Your Job Match Requests ({intakes.length})
            </h2>
            <p className="text-xs text-[#71778A]">
              Complete history of your role & location match requests.
            </p>
          </div>

          {intakes.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete my job-match data
            </button>
          )}
        </div>

        {loadingHistory ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : intakes.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#71778A]">
            <BriefcaseBusiness className="w-7 h-7 text-slate-300 mx-auto mb-2" />
            No AI Job Match intakes submitted yet. Submit the form above to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {intakes.map((item) => {
              const badge = getIntakeStatusBadge(item.status);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#7454F5]">
                        {item.intake_reference}
                      </span>
                      <CareerBadge variant={badge.variant} size="sm">
                        {badge.label}
                      </CareerBadge>
                      <span className="text-[11px] text-[#71778A]">{item.job_type}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#17152F]">{item.target_role}</h3>
                    <p className="text-xs text-[#71778A]">
                      {(item.preferred_locations || []).join(', ')} • {item.experience_years} exp •{' '}
                      {item.resume_original_filename}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#71778A] shrink-0">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    {item.status === 'Jobs ready' && (
                      <Link
                        href="/job-match/results"
                        className="px-3 py-1.5 rounded-xl bg-[#7454F5] text-white font-bold hover:bg-[#6342E8] transition"
                      >
                        View Matches
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CareerCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-[#17152F]">Delete My AI Job Match Data?</h3>
            <p className="text-xs text-[#71778A] leading-relaxed">
              This will permanently delete all of your AI Job Match intake requests, uploaded job-match resumes, imported job opportunities, and saved actions. Your Hopepitome account and other career services will not be affected.
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
                onClick={handleDeleteAllData}
                disabled={deletingData}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
              >
                {deletingData ? 'Deleting...' : 'Confirm Permanent Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

