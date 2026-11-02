'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  Zap,
  Server,
  Layers,
  ExternalLink,
  Activity,
  FileCheck,
  RotateCw,
  Power,
  Info,
} from 'lucide-react';
import type { ProviderHealthState, FreeModelDefinition } from '@/lib/ai/types';

export default function AiProvidersSettingsPage() {
  const { adminProfile } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [healthMap, setHealthMap] = useState<Record<string, ProviderHealthState> | null>(null);
  const [verifiedModels, setVerifiedModels] = useState<Record<string, FreeModelDefinition[]> | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Sample mini text for live connection testing
  const SAMPLE_RESUME_TEXT = `John Doe - Senior Software Engineer
Experience:
- Led cloud migration for core banking platform, improving transaction latency by 42% and processing $12M daily.
- Built microservices using TypeScript, Node.js, Docker, Kubernetes, and PostgreSQL.
- Mentored 8 junior developers and introduced automated CI/CD pipelines.
Skills: TypeScript, Python, AWS, Docker, Kubernetes, Microservices, CI/CD, SQL.
Education: B.S. in Computer Science.`;

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/career/ai/providers/status');
      const data = await res.json();
      if (data.success) {
        setHealthMap(data.health);
        setVerifiedModels(data.verifiedModels);
      }
    } catch (e) {
      console.error('Failed to fetch AI provider status:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTestEvaluation = async () => {
    setTestingProvider('all');
    setTestResult(null);

    try {
      const res = await fetch('/api/career/ai/ats-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: SAMPLE_RESUME_TEXT,
          targetRole: 'Senior Cloud Solutions Architect',
          targetIndustry: 'Financial Technology',
          fileName: 'Sample_Verification_Resume.pdf',
        }),
      });

      const data = await res.json();
      setTestResult(data);
      // Refresh status after test
      fetchStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Test request failed.',
      });
    } finally {
      setTestingProvider(null);
    }
  };

  const PROVIDER_METADATA: Record<string, { name: string; priority: number; docsUrl: string; logoBg: string; description: string }> = {
    gemini: {
      name: 'Google Gemini AI',
      priority: 1,
      docsUrl: 'https://ai.google.dev/pricing',
      logoBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Primary AI engine. Google AI Studio perpetual free tier (15 RPM, 1,500 RPD) with native JSON schema support.',
    },
    groq: {
      name: 'Groq LPU Cloud',
      priority: 2,
      docsUrl: 'https://groq.com/pricing',
      logoBg: 'bg-orange-50 text-orange-700 border-orange-200',
      description: 'Ultra-fast LPU inference fallback. Free tier: 30 RPM, 1,000 RPD on Llama 3.3 70B & 14,400 RPD on Llama 3.1 8B.',
    },
    cloudflare: {
      name: 'Cloudflare Workers AI',
      priority: 3,
      docsUrl: 'https://developers.cloudflare.com/workers-ai/platform/pricing/',
      logoBg: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Edge-native model execution running directly on Cloudflare Workers global network with 10k neurons/day free.',
    },
    openrouter: {
      name: 'OpenRouter Free Models',
      priority: 4,
      docsUrl: 'https://openrouter.ai/models?max_price=0',
      logoBg: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Final multi-model safety net. Strictly locked to verified ":free" suffix catalog models with guaranteed $0 cost.',
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 font-['Manrope',sans-serif]">
        {/* Top Header Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                AI Orchestration
              </span>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                STRICT FREE-ONLY POLICY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              Multi-Provider AI & Failover Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated cascading failover across 4 free-tier AI engines. Zero paid fallbacks, zero accidental billing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>

            <button
              onClick={handleTestEvaluation}
              disabled={Boolean(testingProvider)}
              className="px-4 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] inline-flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{testingProvider ? 'Executing Failover Test...' : 'Test ATS Failover'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Outcome Panel */}
        {testResult && (
          <div
            className={`p-4 rounded-2xl border ${
              testResult.success
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-red-50/70 border-red-200 text-red-900'
            } text-xs space-y-2`}
          >
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                {testResult.success ? 'Failover Engine Validation Passed' : 'Failover Test Notice'}
              </span>
              {testResult.assessment?.providerAudit && (
                <span className="font-mono text-[11px] bg-white/80 px-2.5 py-0.5 rounded-full border">
                  Provider: {testResult.assessment.providerAudit.selectedProvider.toUpperCase()} (
                  {testResult.assessment.providerAudit.modelUsed}) • {testResult.assessment.providerAudit.totalDurationMs}ms
                </span>
              )}
            </div>

            {testResult.success ? (
              <div className="space-y-1">
                <p>
                  <strong>Calculated Score:</strong> {testResult.assessment.overallScore}/100 (Grade:{' '}
                  {testResult.assessment.grade}) • <strong>Summary:</strong> {testResult.assessment.summary}
                </p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-emerald-800">
                  <span>Failover Trail:</span>
                  {testResult.assessment.providerAudit.failoverTrail.map((t: any, i: number) => (
                    <span key={i} className="px-1.5 py-0.5 bg-white rounded border">
                      {t.provider}: {t.success ? 'SUCCESS' : `FAILED (${t.errorCode})`}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p>{testResult.error}</p>
            )}
          </div>
        )}

        {/* 4 Multi-Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {['gemini', 'groq', 'cloudflare', 'openrouter'].map((providerKey) => {
            const meta = PROVIDER_METADATA[providerKey];
            const health = healthMap?.[providerKey];
            const models = verifiedModels?.[providerKey] || [];

            const isConfigured = health?.configured;
            const status = health?.currentStatus || 'UNCONFIGURED';

            return (
              <div
                key={providerKey}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs ${meta.logoBg}`}
                      >
                        P{meta.priority}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                          {meta.name}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium">Priority {meta.priority} in Failover Chain</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        status === 'HEALTHY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : status === 'RATE_LIMITED'
                          ? 'bg-amber-100 text-amber-800'
                          : status === 'QUOTA_EXHAUSTED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{meta.description}</p>

                  {/* Configuration & Key Status */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Secret Key Binding:</span>
                      <span
                        className={`font-mono text-[11px] font-bold ${
                          isConfigured ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {isConfigured ? 'Configured & Active' : 'Not Set (Fallback will skip)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Active Free Model:</span>
                      <span className="font-mono text-[11px] font-bold text-[#173B8F]">
                        {health?.modelId || models[0]?.id || 'Default'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Success / Failure:</span>
                      <span className="font-mono text-[11px] text-slate-700">
                        {health?.totalSuccessCount || 0} ok / {health?.totalFailureCount || 0} fail
                      </span>
                    </div>

                    {health?.cooldownUntil && (
                      <div className="flex justify-between items-center text-amber-800 font-bold">
                        <span>Cooldown Active:</span>
                        <span>{Math.max(0, Math.round((health.cooldownUntil - Date.now()) / 1000))}s remaining</span>
                      </div>
                    )}
                  </div>

                  {/* Verified Free Models Allowlist */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-['Plus_Jakarta_Sans',sans-serif]">
                      Approved Free-Tier Allowlist:
                    </span>
                    <div className="space-y-1">
                      {models.map((m) => (
                        <div
                          key={m.id}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]"
                        >
                          <span className="font-mono font-semibold text-slate-800">{m.id}</span>
                          <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded">
                            Verified $0
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={meta.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#173B8F] hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Free Tier Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-slate-400">Checked: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Failover Protocol Explainer */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-[0_1px_3px_rgba(23,59,143,0.03)] text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
            <Info className="w-4 h-4 text-[#173B8F]" />
            <span>Automated Cascading Failover Protocol</span>
          </div>
          <p>
            When an ATS check is submitted, the engine initiates analysis with <strong>Google Gemini</strong>. If a rate limit (HTTP 429), quota exhaustion, or server timeout occurs, the request automatically transitions to <strong>Groq LPU</strong>, then <strong>Cloudflare Workers AI</strong>, and finally <strong>OpenRouter Free</strong>.
          </p>
          <p>
            All responses are normalized and scored using our server-side <strong>100-point deterministic rubric</strong>, ensuring identical grading standards regardless of which underlying model processed the resume.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

