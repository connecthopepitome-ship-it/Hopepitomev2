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
  Activity,
  FileCheck,
  ExternalLink,
  DollarSign,
  Layers,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import type { ProviderHealthState, OpenAiUsageStats, OpenAiModelDefinition } from '@/lib/ai/types';

export default function AiProvidersSettingsPage() {
  const { adminProfile } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [health, setHealth] = useState<ProviderHealthState | null>(null);
  const [usage, setUsage] = useState<OpenAiUsageStats | null>(null);
  const [modelDetails, setModelDetails] = useState<OpenAiModelDefinition | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Budget management state
  const [budgetInput, setBudgetInput] = useState<string>('100.00');
  const [savingBudget, setSavingBudget] = useState(false);
  const [budgetSaveSuccess, setBudgetSaveSuccess] = useState(false);

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
        setHealth(data.health?.openai || null);
        setUsage(data.usage || null);
        setModelDetails(data.modelDetails || null);
        if (data.usage?.monthlyBudgetLimitUsd) {
          setBudgetInput(data.usage.monthlyBudgetLimitUsd.toFixed(2));
        }
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
    setTestingConnection(true);
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
      // Refresh status after live test
      fetchStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Test request failed.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveBudget = async () => {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val <= 0) return;
    setSavingBudget(true);
    setBudgetSaveSuccess(false);

    try {
      const res = await fetch('/api/career/ai/settings/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyBudgetLimitUsd: val }),
      });
      const data = await res.json();
      if (data.success && data.usage) {
        setUsage(data.usage);
        setBudgetSaveSuccess(true);
        setTimeout(() => setBudgetSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save budget:', err);
    } finally {
      setSavingBudget(false);
    }
  };

  const isConnected = health?.configured && health?.currentStatus === 'CONNECTED';
  const isBudgetWarning = usage?.budgetWarningTriggered || false;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12 font-['Manrope',sans-serif]">
        {/* Top Header Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                AI Provider Architecture
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-[#173B8F] px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#173B8F]" />
                EXCLUSIVE: OPENAI GPT-6 LUNA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              OpenAI Production Engine Settings
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dedicated single-model AI execution via OpenAI Responses API (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">gpt-6-luna</code>).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>

            <button
              onClick={handleTestEvaluation}
              disabled={testingConnection}
              className="px-4 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-bold hover:bg-[#132c6b] inline-flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{testingConnection ? 'Testing GPT-6 Luna...' : 'Test Connection'}</span>
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
                {testResult.success ? 'GPT-6 Luna Test Passed Successfully' : 'Connection Test Failed'}
              </span>
              {testResult.assessment?.providerAudit && (
                <span className="font-mono text-[11px] bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Model: {testResult.assessment.providerAudit.modelUsed} • {testResult.assessment.providerAudit.totalDurationMs}ms
                </span>
              )}
            </div>

            {testResult.success ? (
              <div className="space-y-1">
                <p>
                  <strong>Calculated Score:</strong> {testResult.assessment.overallScore}/100 (Grade:{' '}
                  {testResult.assessment.grade}) • <strong>Summary:</strong> {testResult.assessment.summary}
                </p>
                <div className="flex items-center gap-3 pt-1 font-mono text-[11px] text-emerald-800">
                  <span>Input Tokens: {testResult.assessment.providerAudit.tokensUsed?.promptTokens}</span>
                  <span>Output Tokens: {testResult.assessment.providerAudit.tokensUsed?.completionTokens}</span>
                  <span>Total Tokens: {testResult.assessment.providerAudit.tokensUsed?.totalTokens}</span>
                  <span>Est. Cost: ${testResult.assessment.providerAudit.estimatedCostUsd?.toFixed(6)}</span>
                </div>
              </div>
            ) : (
              <p className="font-mono text-red-700">{testResult.error}</p>
            )}
          </div>
        )}

        {/* Budget Warning Banner if Triggered */}
        {isBudgetWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Monthly Budget Threshold Alert</h3>
              <p className="mt-0.5">
                Current usage (${usage?.estimatedCostUsd.toFixed(4)}) has reached 85% of your configured monthly budget limit (${usage?.monthlyBudgetLimitUsd.toFixed(2)}). Consider adjusting your budget limit or monitoring usage velocity.
              </p>
            </div>
          </div>
        )}

        {/* Main Status & Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Active Model Specification Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#173B8F]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                    OpenAI GPT-6 Luna
                  </h3>
                  <span className="font-mono text-[11px] text-slate-500">gpt-6-luna</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  isConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : health?.configured
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {health?.currentStatus || (health?.configured ? 'READY' : 'UNCONFIGURED')}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              OpenAI flagship fast reasoning model invoked via the Responses API (<code className="font-mono text-[11px]">/v1/responses</code>) with strict JSON output formatting.
            </p>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Environment Secret:</span>
                <span className={`font-mono text-[11px] font-bold ${health?.configured ? 'text-emerald-700' : 'text-red-600'}`}>
                  {health?.configured ? 'OPENAI_API_KEY (Active)' : 'OPENAI_API_KEY (Missing)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Context Window:</span>
                <span className="font-mono text-[11px] font-bold text-slate-800">
                  {modelDetails?.contextWindowTokens.toLocaleString() || '128,000'} tokens
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Max Output:</span>
                <span className="font-mono text-[11px] font-bold text-slate-800">
                  {modelDetails?.maxOutputTokens.toLocaleString() || '4,096'} tokens
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Input Pricing:</span>
                <span className="font-mono text-[11px] font-bold text-[#173B8F]">
                  ${modelDetails?.inputPricingPer1M || 0.15} / 1M tokens
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Output Pricing:</span>
                <span className="font-mono text-[11px] font-bold text-[#173B8F]">
                  ${modelDetails?.outputPricingPer1M || 0.60} / 1M tokens
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Single Model Exclusive</span>
              <a
                href="https://platform.openai.com/docs/models"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#173B8F] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Usage & Cost Monitoring Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                    Usage & Cost Telemetry
                  </h3>
                  <span className="text-[11px] text-slate-500">Live Production Counters</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ${usage?.estimatedCostUsd.toFixed(4) || '0.0000'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Audits</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block">{usage?.totalAssessments || 0}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{usage?.successfulAssessments || 0} successful</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Avg Latency</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5 block">{usage?.averageLatencyMs || 0}ms</span>
                <span className="text-[10px] text-slate-400">Response speed</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Input Tokens</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{(usage?.inputTokens || 0).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Prompt volume</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Output Tokens</span>
                <span className="text-sm font-bold text-slate-800 mt-1 block">{(usage?.outputTokens || 0).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Response volume</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-medium">Last Successful Request:</span>
              <span className="font-mono text-slate-800 font-semibold">
                {usage?.lastSuccessfulRequest ? new Date(usage.lastSuccessfulRequest).toLocaleTimeString() : 'None yet'}
              </span>
            </div>
          </div>

          {/* Monthly Budget Management Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                    Monthly Spend Controls
                  </h3>
                  <span className="text-[11px] text-slate-500">Budget Limit & Safeguards</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Configure your monthly budget ceiling. An administrative warning banner activates automatically when spending reaches 85% of this threshold.
            </p>

            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Monthly Budget Limit (USD)</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="5"
                      min="10"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#173B8F]/20"
                    />
                  </div>
                  <button
                    onClick={handleSaveBudget}
                    disabled={savingBudget}
                    className="px-4 py-2 bg-[#173B8F] text-white font-bold rounded-lg hover:bg-[#132c6b] transition disabled:opacity-50 text-xs shrink-0"
                  >
                    {savingBudget ? 'Saving...' : 'Save Limit'}
                  </button>
                </div>
              </div>

              {budgetSaveSuccess && (
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Budget ceiling updated successfully.</span>
                </div>
              )}

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Warning Threshold (85%):</span>
                  <span className="font-mono font-bold text-amber-700">
                    ${((usage?.monthlyBudgetLimitUsd || 100) * 0.85).toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${isBudgetWarning ? 'bg-amber-500' : 'bg-[#173B8F]'}`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((usage?.estimatedCostUsd || 0) / (usage?.monthlyBudgetLimitUsd || 100)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Architecture Guarantee Notice */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-[0_1px_3px_rgba(23,59,143,0.03)] text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Enterprise Security & Architecture Policy</span>
          </div>
          <p>
            The Hopepitome ATS Resume Checker operates strictly with <strong>OpenAI GPT-6 Luna</strong>. Multi-provider fallbacks, secondary provider chains, and free-tier cascading models have been completely decommissioned.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Server-Side Secret:</strong> <code className="font-mono">OPENAI_API_KEY</code> is bound directly to Cloudflare Worker secrets and is never exposed to the client or version control.</li>
            <li><strong>Deterministic Scoring Rubric:</strong> Scores are computed using our strict 7-category, 100-point deterministic rubric based on verified candidate profile facts.</li>
            <li><strong>Fail-Safe Availability:</strong> If OpenAI experiences latency or service interruptions, users receive a friendly, non-technical notification without leaking backend details.</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
