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
      console.error('Stage change error:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                Visual Funnel
              </span>
              <span className="text-[10px] font-semibold bg-[#FAF8FC] text-[#8172A8] px-2 py-0.5 rounded border border-[#E6E2DC]">
                12 Progression Stages
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Sales Pipeline Board
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Drag and drop prospect cards between stages to advance deals through your acquisition funnel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/career-services/admin/crm/leads?action=new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </Link>
          </div>
        </div>

        {/* Kanban Board Container with horizontal scroll */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
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
                    className="w-72 shrink-0 bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col max-h-[75vh]"
                  >
                    {/* Stage Header */}
                    <div className="p-3.5 border-b border-[#E6E2DC] bg-[#FAF8FC] rounded-t-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#17243B] truncate max-w-[170px]">{stage}</span>
                        <span className="text-[10px] font-mono font-bold bg-white text-[#8172A8] px-2 py-0.5 rounded-full border border-[#E6E2DC]">
                          {stageLeads.length}
                        </span>
                      </div>
                    </div>

                    {/* Cards Column */}
                    <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px]">
                      {stageLeads.length === 0 ? (
                        <div className="h-24 flex items-center justify-center border-2 border-dashed border-[#E6E2DC]/80 rounded-xl text-[11px] text-[#777781]/70">
                          Drop leads here
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={() => setDraggedLeadId(lead.id)}
                            className="p-3.5 rounded-xl bg-white border border-[#E6E2DC] hover:border-[#8172A8] shadow-sm transition space-y-2 cursor-grab active:cursor-grabbing hover:shadow-md"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h2 className="text-xs font-bold text-[#17243B] line-clamp-1">{lead.fullName}</h2>
                                <span className="text-[10px] font-mono text-[#8172A8]">{lead.id}</span>
                              </div>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
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

                            <p className="text-[11px] text-[#17243B] font-medium line-clamp-1">
                              {lead.serviceInterestedIn}
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-[#777781] pt-1 border-t border-[#E6E2DC]/60">
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
                                    className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                                    title="WhatsApp"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                  </a>
                                )}
                                {lead.mobile && (
                                  <a
                                    href={`tel:${lead.mobile}`}
                                    className="p-1 rounded bg-[#F7F5F0] text-[#17243B] hover:bg-[#E6E2DC] transition"
                                    title="Call"
                                  >
                                    <Phone className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setTargetStage(lead.stage);
                                }}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#8172A8] hover:text-[#17243B] transition"
                              >
                                <span>Move</span>
                                <MoveRight className="w-2.5 h-2.5" />
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

        {/* Modal: Move Lead Stage */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <div>
                  <h2 className="text-sm font-bold text-[#17243B]">Advance Lead Pipeline Stage</h2>
                  <p className="text-[11px] text-[#777781]">{selectedLead.fullName} ({selectedLead.id})</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleMoveStageModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Select New Stage</label>
                  <select
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value as CrmPipelineStage)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    {PIPELINE_STAGES.map(({ stage }) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                {targetStage === 'Lost' && (
                  <div>
                    <label className="block text-xs font-semibold text-red-700 mb-1">Reason for Loss</label>
                    <select
                      value={lostReason}
                      onChange={(e) => setLostReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 text-xs text-[#17243B] bg-red-50/30"
                    >
                      <option value="Price too high / Budget mismatch">Price too high / Budget mismatch</option>
                      <option value="Went with competitor">Went with competitor</option>
                      <option value="No response after multiple attempts">No response after multiple attempts</option>
                      <option value="Postponed job search indefinitely">Postponed job search indefinitely</option>
                      <option value="Already secured employment">Already secured employment</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setSelectedLead(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] transition shadow-sm"
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

