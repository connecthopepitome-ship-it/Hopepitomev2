'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Share2,
  FileCheck,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCw,
} from 'lucide-react';
import type { AtsAssessmentResult, AtsCategoryEvaluation } from '@/lib/ai/types';

export default function AtsCheckerWorkspacePage() {
  const { adminProfile } = useAdminAuth();

  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Cloud Solutions Architect');
  const [targetIndustry, setTargetIndustry] = useState('Technology & Cloud Infrastructure');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState('Candidate_Resume.pdf');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<AtsAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // File Upload Helper (Reads Base64 for OpenAI GPT-6 Luna native document analysis)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const mime =
      file.type ||
      (file.name.endsWith('.pdf')
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    setFileMimeType(mime);

    const base64Reader = new FileReader();
    base64Reader.onload = () => {
      setFileBase64(String(base64Reader.result || ''));
    };
    base64Reader.readAsDataURL(file);

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(String(reader.result || ''));
      };
      reader.readAsText(file);
    }
  };

  const [adminAnalytics, setAdminAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/career/admin/ats-analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setAdminAnalytics(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const handleRunEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileBase64 && (!resumeText.trim() || resumeText.length < 30)) {
      setError('Please provide resume content or upload a resume file (PDF/DOCX) to audit.');
      return;
    }

    setLoading(true);
    setError(null);
    setAssessment(null);

    try {
      const res = await fetch('/api/career/ai/ats-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim().substring(0, 7000),
          fileBase64: fileBase64 || undefined,
          fileMimeType: fileMimeType || undefined,
          targetRole,
          targetIndustry,
          jobDescription: jobDescription ? jobDescription.trim().substring(0, 2000) : undefined,
          fileName,
          isPublic: false, // Internal admin gets full unredacted recommendations
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'ATS Analysis failed.');
      }

      setAssessment(data.assessment);
      if (data.assessment.categories?.length > 0) {
        setExpandedCategory(data.assessment.categories[0].category);
      }
    } catch (err: any) {
      setError(err.message || 'ATS Evaluation failed. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 font-['Manrope',sans-serif]">
        {/* Header */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                Career Services Engine
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-[#173B8F] px-2 py-0.5 rounded border border-blue-200">
                7-CATEGORY DETERMINISTIC RUBRIC
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              ATS Resume Audit & Compliance Checker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Audits resumes across Fortune 500 ATS benchmark rules with multi-provider free AI failover.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/ats-resume-checker"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#635BDB] to-[#8B5CF6] text-white text-xs font-bold shadow-sm hover:opacity-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Public ATS Checker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Conversion & Acquisition Metrics Banner */}
        {adminAnalytics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Audits</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{adminAnalytics.totalAudits}</span>
              <span className="text-[11px] text-slate-400">Public & admin submissions</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] block">Converted to Enquiries</span>
              <span className="text-2xl font-extrabold text-[#10B981] mt-0.5 block">{adminAnalytics.convertedAudits}</span>
              <span className="text-[11px] text-slate-400">Customer leads acquired</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#635BDB] block">Conversion Rate</span>
              <span className="text-2xl font-extrabold text-[#635BDB] mt-0.5 block">{adminAnalytics.conversionRate}%</span>
              <span className="text-[11px] text-slate-400">Audit-to-lead ratio</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] block">Active AI Engine</span>
              <span className="text-base font-extrabold text-[#111B35] mt-1 block">OpenAI (GPT-6 Luna)</span>
              <span className="text-[11px] text-[#10B981] font-semibold">Production Active</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Configuration Column */}
          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleRunEvaluation} className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4 shadow-[0_1px_3px_rgba(23,59,143,0.03)] text-xs">
              <h2 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif] pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Upload & Audit Parameters</span>
                <Sparkles className="w-4 h-4 text-[#173B8F]" />
              </h2>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Professional Role *</label>
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Cloud Solutions Architect"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Target Industry / Domain</label>
                <input
                  type="text"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  placeholder="e.g. Financial Technology / Enterprise SaaS"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Upload Resume Document (PDF, DOCX, TXT)</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleFileUpload}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#173B8F] file:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Resume Text Content (Auto-Anonymized) *</label>
                <textarea
                  rows={8}
                  required
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste candidate resume text or upload document above. All emails, phone numbers, and addresses will be automatically redacted before AI analysis."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Benchmark Job Description (Optional)</label>
                <textarea
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste target job listing text to audit keyword alignment and match score..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-[11px] text-slate-800 focus:bg-white focus:outline-none focus:border-[#173B8F]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 flex items-start gap-2 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Multi-Provider Failover...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Audit Resume Compliance</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Presentation Column */}
          <div className="lg:col-span-7 space-y-4">
            {!assessment && !loading && (
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center space-y-3 shadow-[0_1px_3px_rgba(23,59,143,0.03)]">
                <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                  No Active Assessment
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload a candidate resume or paste content on the left to run an automated 7-category compliance check.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-4 shadow-[0_1px_3px_rgba(23,59,143,0.03)]">
                <div className="w-10 h-10 border-3 border-[#173B8F] border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Executing Multi-Provider AI Audit...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Anonymizing PII, evaluating keyword relevance, and checking failover health...
                  </p>
                </div>
              </div>
            )}

            {assessment && (
              <div className="space-y-4">
                {/* Score Overview Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold font-['Plus_Jakarta_Sans',sans-serif] ${
                          assessment.grade === 'A+' || assessment.grade === 'A'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : assessment.grade === 'B'
                            ? 'bg-blue-50 text-[#173B8F] border border-blue-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span className="text-2xl">{assessment.grade}</span>
                        <span className="text-[10px] uppercase font-semibold">Grade</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                            {assessment.overallScore}/100
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Deterministic Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Target Role: <strong className="text-slate-800">{assessment.targetRole}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-[11px] text-slate-500 font-mono">
                      <span>ID: {assessment.assessmentId}</span>
                      <div className="text-[#173B8F] font-bold">
                        Provider: {assessment.providerAudit.selectedProvider.toUpperCase()} ({assessment.providerAudit.modelUsed})
                      </div>
                      <span>Latency: {assessment.providerAudit.totalDurationMs}ms</span>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <strong>Executive Review:</strong> {assessment.summary}
                  </div>

                  {/* Top Strengths & Gaps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                      <span className="font-bold text-emerald-900 block">Top Strengths:</span>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside">
                        {assessment.topStrengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
                      <span className="font-bold text-amber-900 block">Critical Gaps to Fix:</span>
                      <ul className="space-y-1 text-slate-700 list-disc list-inside">
                        {assessment.criticalGaps.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 7-Category Breakdown List */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif] pb-2 border-b border-slate-100">
                    7-Category ATS Rubric Breakdown
                  </h3>

                  <div className="space-y-2">
                    {assessment.categories.map((cat) => {
                      const isExpanded = expandedCategory === cat.category;
                      return (
                        <div
                          key={cat.category}
                          className="rounded-xl border border-slate-200/80 overflow-hidden transition"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                            className="w-full p-3 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between text-left text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  cat.status === 'EXCELLENT'
                                    ? 'bg-emerald-500'
                                    : cat.status === 'GOOD'
                                    ? 'bg-blue-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              <div>
                                <span className="font-bold text-slate-900">{cat.title}</span>
                                <span className="text-slate-400 text-[10px] ml-1.5 font-mono">
                                  (Weight: {cat.weight}%)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-900 tabular-nums">
                                {cat.rawScore}/100 ({cat.weightedScore} pts)
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-4 bg-white border-t border-slate-100 space-y-3 text-xs">
                              <div>
                                <span className="font-bold text-slate-800 block text-[11px] mb-1">
                                  Evidence Detected in Resume:
                                </span>
                                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                                  {cat.evidencePoints.map((p, i) => (
                                    <li key={i}>{p}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <span className="font-bold text-[#173B8F] block text-[11px] mb-1">
                                  Actionable Optimization Recommendations:
                                </span>
                                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                                  {cat.recommendations.map((r, i) => (
                                    <li key={i}>{r}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Keywords Audit */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-3 text-xs">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif] pb-2 border-b border-slate-100">
                    Keyword Alignment & Gap Analysis
                  </h3>

                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1.5">
                      Matched Keywords ({assessment.matchedKeywords.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assessment.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px]">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-800 block mb-1.5">
                      Missing Recommended Keywords ({assessment.missingKeywords.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {assessment.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[11px]">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

