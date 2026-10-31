'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCrmFollowUps,
  completeCrmFollowUp,
  saveCrmFollowUp,
  logCrmActivity,
} from '@/lib/firebase/firestore';
import type {
  CrmFollowUp,
  CrmFollowUpStatus,
  CrmFollowUpOutcome,
  CrmFollowUpType,
} from '@/lib/career/types';
import {
  PhoneCall,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  User,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function FollowUpsManagementPage() {
  const { adminProfile, role } = useAdminAuth();
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'TODAY' | 'OVERDUE' | 'UPCOMING' | 'COMPLETED' | 'ALL'>('TODAY');

  // Complete Modal State
  const [selectedFollowUp, setSelectedFollowUp] = useState<CrmFollowUp | null>(null);
  const [outcome, setOutcome] = useState<CrmFollowUpOutcome>('INTERESTED');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [scheduleNext, setScheduleNext] = useState(false);
  const [nextDate, setNextDate] = useState('');
  const [nextTitle, setNextTitle] = useState('Follow-up call to review quotation details');
  const [completing, setCompleting] = useState(false);

  // New Follow-up Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueTime, setNewDueTime] = useState('11:00');
  const [newType, setNewType] = useState<CrmFollowUpType>('PHONE_CALL');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsub = subscribeCrmFollowUps((data) => {
      setFollowUps(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Segmenting
  const dueToday = followUps.filter((f) => f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && f.dueDate === todayStr);
  const overdue = followUps.filter((f) => f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && f.dueDate < todayStr);
  const upcoming = followUps.filter((f) => f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && f.dueDate > todayStr);
  const completed = followUps.filter((f) => f.status === 'COMPLETED');

  const displayedList =
    activeTab === 'TODAY'
      ? dueToday
      : activeTab === 'OVERDUE'
      ? overdue
      : activeTab === 'UPCOMING'
      ? upcoming
      : activeTab === 'COMPLETED'
      ? completed
      : followUps;

  // Handle Complete
  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFollowUp) return;
    setCompleting(true);

    try {
      await completeCrmFollowUp(selectedFollowUp.id, outcome, outcomeNotes);

      if (selectedFollowUp.leadId) {
        await logCrmActivity({
          leadId: selectedFollowUp.leadId,
          activityType: 'FOLLOWUP_COMPLETED',
          title: `Follow-up Completed: ${selectedFollowUp.title}`,
          description: `Outcome: ${outcome}. Notes: ${outcomeNotes || 'None'}`,
          performedBy: adminProfile?.displayName || 'Staff',
        });
      }

      // Schedule next follow-up if requested
      if (scheduleNext && nextDate) {
        const nextId = `flw_${Date.now()}`;
        await saveCrmFollowUp({
          id: nextId,
          leadId: selectedFollowUp.leadId,
          leadName: selectedFollowUp.leadName,
          leadPhone: selectedFollowUp.leadPhone,
          title: nextTitle,
          followUpType: 'PHONE_CALL',
          assignedStaff: selectedFollowUp.assignedStaff || adminProfile?.displayName || 'Staff',
          dueDate: nextDate,
          priority: selectedFollowUp.priority,
          status: 'PENDING',
          createdBy: adminProfile?.displayName || 'Staff',
          createdAt: new Date().toISOString(),
        });
      }

      setSelectedFollowUp(null);
      setOutcomeNotes('');
      setScheduleNext(false);
      setNextDate('');
    } catch (err) {
      console.error('Error completing follow-up:', err);
      alert('Failed to complete follow-up.');
    } finally {
      setCompleting(false);
    }
  };

  // Handle Create Follow-up
  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);

    try {
      const followUpId = `flw_${Date.now()}`;
      await saveCrmFollowUp({
        id: followUpId,
        title: newTitle.trim(),
        leadName: newLeadName.trim() || undefined,
        leadPhone: newLeadPhone.trim() || undefined,
        dueDate: newDueDate,
        dueTime: newDueTime,
        followUpType: newType,
        assignedStaff: adminProfile?.displayName || 'Lead Consultant',
        priority: 'MEDIUM',
        status: 'PENDING',
        createdBy: adminProfile?.displayName || 'Staff',
        createdAt: new Date().toISOString(),
      });

      setShowNewModal(false);
      setNewTitle('');
      setNewLeadName('');
      setNewLeadPhone('');
    } catch (err) {
      console.error('Error creating follow-up:', err);
      alert('Failed to create follow-up.');
    } finally {
      setCreating(false);
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
                CRM Communication Cadence
              </span>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {dueToday.length} Due Today
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Follow-ups & Outreach Center
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Ensure zero prospective leads fall through the cracks with structured call cadences and outcome tracking.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('TODAY')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'TODAY'
                ? 'bg-[#17243B] text-white shadow-sm'
                : 'bg-white text-[#292D36] border border-[#E6E2DC] hover:bg-[#F7F5F0]'
            }`}
          >
            Today's Outreach ({dueToday.length})
          </button>

          <button
            onClick={() => setActiveTab('OVERDUE')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'OVERDUE'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            Overdue ({overdue.length})
          </button>

          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'UPCOMING'
                ? 'bg-[#17243B] text-white shadow-sm'
                : 'bg-white text-[#292D36] border border-[#E6E2DC] hover:bg-[#F7F5F0]'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'COMPLETED'
                ? 'bg-[#17243B] text-white shadow-sm'
                : 'bg-white text-[#292D36] border border-[#E6E2DC] hover:bg-[#F7F5F0]'
            }`}
          >
            Completed ({completed.length})
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'ALL'
                ? 'bg-[#17243B] text-white shadow-sm'
                : 'bg-white text-[#292D36] border border-[#E6E2DC] hover:bg-[#F7F5F0]'
            }`}
          >
            All ({followUps.length})
          </button>
        </div>

        {/* List of Follow-ups */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : displayedList.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h2 className="text-xs font-bold text-[#17243B]">No follow-ups in this queue</h2>
              <p className="text-[11px] text-[#777781]">All scheduled outreach tasks are up to date.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]/80">
              {displayedList.map((f) => {
                const isOverdue = f.status !== 'COMPLETED' && f.dueDate < todayStr;
                const isCompleted = f.status === 'COMPLETED';

                return (
                  <div
                    key={f.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-[#F7F5F0]/40 ${
                      isOverdue ? 'bg-red-50/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : isOverdue
                            ? 'bg-red-100 text-red-700'
                            : 'bg-[#F7F5F0] text-[#8172A8] border border-[#E6E2DC]'
                        }`}
                      >
                        <PhoneCall className="w-4 h-4" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xs font-bold text-[#17243B]">{f.title}</h2>
                          {isOverdue && (
                            <span className="text-[9px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                              Overdue
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              Completed: {f.outcome || 'Done'}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#777781]">
                          {f.leadName && (
                            <span className="font-semibold text-[#17243B]">Lead: {f.leadName}</span>
                          )}
                          <span>•</span>
                          <span>Due: {f.dueDate} {f.dueTime ? `at ${f.dueTime}` : ''}</span>
                          <span>•</span>
                          <span>Staff: {f.assignedStaff}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] font-mono">{f.followUpType}</span>
                        </div>

                        {f.outcomeNotes && (
                          <p className="text-[11px] text-[#17243B] bg-[#FAF8FC] p-2 rounded-lg border border-[#E6E2DC] leading-relaxed">
                            Outcome Note: {f.outcomeNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {f.leadPhone && (
                        <a
                          href={`https://wa.me/${f.leadPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {f.leadPhone && (
                        <a
                          href={`tel:${f.leadPhone}`}
                          className="p-2 rounded-lg bg-white text-[#17243B] hover:bg-[#F7F5F0] border border-[#E6E2DC] transition"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => setSelectedFollowUp(f)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Complete & Log</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal: Complete Follow-up with Outcome (Section 6) */}
        {selectedFollowUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <div>
                  <h3 className="text-sm font-bold text-[#17243B]">Complete Follow-up</h3>
                  <p className="text-[11px] text-[#777781]">{selectedFollowUp.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFollowUp(null)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleConfirmComplete} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Follow-up Outcome <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as CrmFollowUpOutcome)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="INTERESTED">Interested in Moving Forward</option>
                    <option value="CONSULTATION_BOOKED">1-on-1 Consultation Booked</option>
                    <option value="QUOTATION_REQUESTED">Quotation Requested</option>
                    <option value="MORE_INFO">Asked for More Information</option>
                    <option value="PRICE_CONCERN">Price Concern / Budget Review</option>
                    <option value="CALL_BACK_LATER">Call Back Later / Reschedule</option>
                    <option value="NO_RESPONSE">No Response / Left Message</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                    <option value="CONVERTED">Converted to Paid Client</option>
                    <option value="OTHER">Other Outcome</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Outcome Notes</label>
                  <textarea
                    rows={3}
                    value={outcomeNotes}
                    onChange={(e) => setOutcomeNotes(e.target.value)}
                    placeholder="Provide details on client's response or specific objections..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                {/* Section 6 requirement: Immediately schedule next follow-up */}
                <div className="pt-2 border-t border-[#E6E2DC] space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleNext}
                      onChange={(e) => setScheduleNext(e.target.checked)}
                      className="rounded border-[#E6E2DC] text-[#8172A8] focus:ring-[#8172A8]"
                    />
                    <span className="text-xs font-semibold text-[#17243B]">Schedule Next Follow-up Now</span>
                  </label>

                  {scheduleNext && (
                    <div className="space-y-3 p-3 rounded-xl bg-[#FAF8FC] border border-[#E6E2DC] mt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Action Title</label>
                        <input
                          type="text"
                          value={nextTitle}
                          onChange={(e) => setNextTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Next Due Date</label>
                        <input
                          type="date"
                          required={scheduleNext}
                          value={nextDate}
                          onChange={(e) => setNextDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setSelectedFollowUp(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={completing}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                  >
                    {completing ? 'Saving...' : 'Record Outcome'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule Follow-up */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">Schedule Outreach Action</h3>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateNew} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Action Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Call back candidate to scope ATS requirements"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Lead Name (Optional)</label>
                    <input
                      type="text"
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      placeholder="e.g. Jonathan Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={newLeadPhone}
                      onChange={(e) => setNewLeadPhone(e.target.value)}
                      placeholder="+91..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Due Time</label>
                    <input
                      type="time"
                      value={newDueTime}
                      onChange={(e) => setNewDueTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Channel</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CrmFollowUpType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="PHONE_CALL">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="QUOTATION_FOLLOWUP">Quotation Follow-up</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                  >
                    {creating ? 'Saving...' : 'Schedule'}
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

