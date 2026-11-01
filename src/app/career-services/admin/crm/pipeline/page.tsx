'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCrmLeads,
  updateCrmLeadStage,
  logCrmActivity,
} from '@/lib/firebase/firestore';
import type { CrmLead, CrmPipelineStage } from '@/lib/career/types';
import {
  Kanban,
  Plus,
  Phone,
  MessageSquare,
  AlertCircle,
  Clock,
  UserCheck,
  ChevronRight,
  ArrowRight,
  MoveRight,
  FolderKanban,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const PIPELINE_STAGES: { stage: CrmPipelineStage; color: string }[] = [
  { stage: 'New Lead', color: 'border-blue-400 bg-blue-50/40 text-blue-900' },
  { stage: 'Contact Attempted', color: 'border-amber-400 bg-amber-50/40 text-amber-900' },
  { stage: 'Contacted', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-900' },
  { stage: 'Qualified', color: 'border-purple-400 bg-purple-50/40 text-purple-900' },
  { stage: 'Consultation Scheduled', color: 'border-cyan-400 bg-cyan-50/40 text-cyan-900' },
  { stage: 'Consultation Completed', color: 'border-teal-400 bg-teal-50/40 text-teal-900' },
  { stage: 'Quotation Preparation', color: 'border-orange-400 bg-orange-50/40 text-orange-900' },
  { stage: 'Quotation Sent', color: 'border-yellow-500 bg-yellow-50/40 text-yellow-900' },
  { stage: 'Negotiation', color: 'border-violet-500 bg-violet-50/40 text-violet-900' },
  { stage: 'Won / Ready to Convert', color: 'border-emerald-500 bg-emerald-50/60 text-emerald-900' },
  { stage: 'Nurture / Follow-up Later', color: 'border-slate-400 bg-slate-50/40 text-slate-900' },
  { stage: 'Lost', color: 'border-red-400 bg-red-50/40 text-red-900' },
];

export default function SalesPipelinePage() {
  const { adminProfile, role } = useAdminAuth();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);

  // Dragging state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Stage change modal / Move modal
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [targetStage, setTargetStage] = useState<CrmPipelineStage>('Contacted');
  const [lostReason, setLostReason] = useState('Price concern / Budget mismatch');

  useEffect(() => {
    const unsub = subscribeCrmLeads((data) => {
      setLeads(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleStageDrop = async (newStage: CrmPipelineStage) => {
    if (!draggedLeadId) return;
    const lead = leads.find((l) => l.id === draggedLeadId);
    if (!lead || lead.stage === newStage) {
      setDraggedLeadId(null);
      return;
    }

    try {
      await updateCrmLeadStage(lead.id, newStage);
      await logCrmActivity({
        leadId: lead.id,
        activityType: 'STAGE_CHANGED',
        title: `Stage moved from "${lead.stage}" to "${newStage}"`,
        description: `Updated via visual Kanban pipeline by ${adminProfile?.displayName || 'Staff'}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });
    } catch (err) {
      console.error('Drag stage error:', err);
    } finally {
      setDraggedLeadId(null);
    }
  };

  const handleMoveStageModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const isLost = targetStage === 'Lost';
      await updateCrmLeadStage(selectedLead.id, targetStage, isLost ? lostReason : undefined);
      await logCrmActivity({
        leadId: selectedLead.id,
        activityType: isLost ? 'LEAD_LOST' : 'STAGE_CHANGED',
        title: `Pipeline stage moved to "${targetStage}"`,
        description: isLost ? `Reason: ${lostReason}` : `Updated by ${adminProfile?.displayName || 'Staff'}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });
      setSelectedLead(null);
    } catch (err) {
      console.error('Move modal error:', err);
    }
  };

  const wonLeads = leads.filter((l) => l.stage === 'Won / Ready to Convert');
  const activeFunnel = leads.filter((l) => l.stage !== 'Won / Ready to Convert' && l.stage !== 'Lost');

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Ambient Top Ribbon */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-xs uppercase tracking-wider font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                DEAL ENGINE & PIPELINE
              </span>
              <span className="text-secondary font-label-md text-xs">•</span>
              <span className="text-secondary font-label-sm text-xs uppercase tracking-wider font-medium">
                Visual Acquisition Funnel
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Enterprise Sales Pipeline Board
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Drag and drop prospect cards between lifecycle stages to advance deals through discovery, quotation preparation, and contract conversion.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start xl:self-center flex-wrap">
            <Link
              href="/career-services/admin/crm/leads?action=new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Capture New Lead</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Active Funnel</span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {activeFunnel.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-xs font-bold">
                In Flight
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>{leads.length} Total Captured</span>
              <span className="text-primary font-semibold">Live CRM</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Won & Converting</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-emerald-800 tabular-nums">
                {wonLeads.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-label-sm text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" /> High Velocity
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Ready for Work Order</span>
              <span className="text-emerald-700 font-semibold">Ready</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Conversion Velocity</span>
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {leads.length > 0 ? Math.round((wonLeads.length / leads.length) * 100) : 0}%
              </span>
              <span className="text-xs text-secondary font-mono">Won Rate</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Target: &gt; 25%</span>
              <span className="text-on-surface font-semibold">Healthy</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Consultations Logged</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {leads.filter((l) => l.stage.includes('Consultation')).length}
              </span>
              <span className="text-xs text-secondary font-mono">Sessions</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Diagnostic Phase</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Kanban Board Container with visible scroll affordance */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto pb-6">
            <div className="inline-flex gap-4 min-w-full">
              {PIPELINE_STAGES.map(({ stage, color }) => {
                const stageLeads = leads.filter((l) => l.stage === stage);

                return (
                  <div
                    key={stage}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleStageDrop(stage)}
                    className="w-72 shrink-0 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs flex flex-col max-h-[75vh]"
                  >
                    {/* Stage Header */}
                    <div className="p-3.5 border-b border-outline-variant/30 bg-surface-container-low rounded-t-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary truncate max-w-[170px]">{stage}</span>
                        <span className="text-xs font-mono font-bold bg-white text-primary px-2 py-0.5 rounded-full border border-outline-variant/30">
                          {stageLeads.length}
                        </span>
                      </div>
                    </div>

                    {/* Cards Column */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
                      {stageLeads.length === 0 ? (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-outline-variant/40 rounded-xl text-xs text-secondary/70">
                          Drop leads here
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={() => setDraggedLeadId(lead.id)}
                            className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 shadow-xs transition space-y-2 cursor-grab active:cursor-grabbing hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-xs font-bold text-primary line-clamp-1">{lead.fullName}</h3>
                                <span className="text-xs font-mono text-secondary">{lead.id}</span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  lead.priority === 'URGENT'
                                    ? 'bg-red-100 text-red-800'
                                    : lead.priority === 'HIGH'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {lead.priority}
                              </span>
                            </div>

                            <p className="text-xs text-on-surface font-medium line-clamp-1">
                              {lead.serviceInterestedIn}
                            </p>

                            <div className="flex items-center justify-between text-xs text-secondary pt-1 border-t border-outline-variant/20">
                              <span>{lead.leadSource}</span>
                              <span>{lead.leadOwner || 'Unassigned'}</span>
                            </div>

                            {/* Quick Action Footer */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1">
                                {lead.mobile && (
                                  <a
                                    href={`https://wa.me/${lead.mobile.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                    title="WhatsApp"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {lead.mobile && (
                                  <a
                                    href={`tel:${lead.mobile}`}
                                    className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                                    title="Call Phone"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setTargetStage(lead.stage);
                                }}
                                className="text-xs font-semibold text-primary hover:text-primary-container inline-flex items-center gap-0.5"
                              >
                                <span>Move</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal: Move Stage */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-xl border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <h3 className="font-headline-sm text-base font-bold text-primary">Move Funnel Stage</h3>
                <button onClick={() => setSelectedLead(null)} className="p-1 rounded-lg hover:bg-surface-container-low text-secondary">
                  ✕
                </button>
              </div>

              <form onSubmit={handleMoveStageModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Target Stage</label>
                  <select
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value as CrmPipelineStage)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.stage} value={s.stage}>
                        {s.stage}
                      </option>
                    ))}
                  </select>
                </div>

                {targetStage === 'Lost' && (
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Reason for Lost Deal</label>
                    <input
                      type="text"
                      value={lostReason}
                      onChange={(e) => setLostReason(e.target.value)}
                      placeholder="e.g. Budget mismatch or selected alternative"
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                <div className="pt-3 border-t border-outline-variant/30 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-secondary hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-semibold shadow-xs transition"
                  >
                    Update Stage
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
