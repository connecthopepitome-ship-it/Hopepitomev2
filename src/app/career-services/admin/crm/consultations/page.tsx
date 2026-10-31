'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCrmConsultations,
  saveCrmConsultation,
  logCrmActivity,
} from '@/lib/firebase/firestore';
import type { CrmConsultation } from '@/lib/career/types';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export default function ConsultationsPage() {
  const { adminProfile, role } = useAdminAuth();
  const [consultations, setConsultations] = useState<CrmConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadId, setLeadId] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledTime, setScheduledTime] = useState('15:00');
  const [consultantName, setConsultantName] = useState(adminProfile?.displayName || 'Lead Career Consultant');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [recommendedService, setRecommendedService] = useState('Professional Resume Writing');
  const [discussionNotes, setDiscussionNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeCrmConsultations((data) => {
      setConsultations(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) return;
    setSaving(true);

    const now = new Date().toISOString();
    const id = `cons_${Date.now()}`;

    const newRecord: CrmConsultation = {
      id,
      leadId: leadId.trim() || `lead_${Date.now()}`,
      leadName: leadName.trim(),
      leadPhone: leadPhone.trim() || undefined,
      scheduledDate,
      scheduledTime,
      consultantName,
      status: 'SCHEDULED',
      meetingLink: meetingLink.trim() || undefined,
      recommendedService,
      discussionNotes: discussionNotes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveCrmConsultation(newRecord);
      await logCrmActivity({
        leadId: newRecord.leadId,
        activityType: 'CONSULTATION_SCHEDULED',
        title: `Consultation booked with ${leadName} on ${scheduledDate} at ${scheduledTime}`,
        description: `Consultant: ${consultantName}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });

      setShowModal(false);
      setLeadName('');
      setLeadPhone('');
      setLeadId('');
      setDiscussionNotes('');
    } catch (err) {
      console.error('Error creating consultation:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (item: CrmConsultation, newStatus: 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') => {
    try {
      await saveCrmConsultation({
        ...item,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      await logCrmActivity({
        leadId: item.leadId,
        activityType: 'CONSULTATION_COMPLETED',
        title: `Consultation marked as ${newStatus}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });
    } catch (err) {
      console.error('Error updating status:', err);
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
                CRM Consultation Hub
              </span>
              <span className="text-[10px] font-semibold bg-[#FAF8FC] text-[#8172A8] px-2 py-0.5 rounded border border-[#E6E2DC]">
                {consultations.length} Sessions
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              1-on-1 Career Consultations
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Manage discovery calls, career roadmap sessions, and strategy discussions.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book Consultation</span>
          </button>
        </div>

        {/* List */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : consultations.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Calendar className="w-8 h-8 text-[#8172A8] mx-auto" />
              <h2 className="text-xs font-bold text-[#17243B]">No consultations scheduled</h2>
              <p className="text-[11px] text-[#777781]">Book a strategy session for qualified leads.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]/80">
              {consultations.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-bold text-[#17243B]">{item.leadName}</h2>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'SCHEDULED'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#777781]">
                      Date: {item.scheduledDate} at {item.scheduledTime} • Consultant: {item.consultantName}
                    </p>

                    {item.discussionNotes && (
                      <p className="text-[11px] text-[#17243B] bg-[#FAF8FC] p-2 rounded-lg border border-[#E6E2DC] max-w-xl">
                        Notes: {item.discussionNotes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.meetingLink && (
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E2DC] text-xs font-semibold text-[#17243B] hover:bg-[#F7F5F0] transition"
                      >
                        <Video className="w-3.5 h-3.5 text-[#8172A8]" />
                        <span>Join Meeting</span>
                      </a>
                    )}

                    {item.status === 'SCHEDULED' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(item, 'COMPLETED')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item, 'NO_SHOW')}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-50 transition"
                        >
                          No Show
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Book Session */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">Schedule Consultation Session</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Lead / Candidate Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Thomas Wayne"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Time</label>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Meeting Link (Google Meet / Zoom)</label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Initial Discussion Notes</label>
                  <textarea
                    rows={3}
                    value={discussionNotes}
                    onChange={(e) => setDiscussionNotes(e.target.value)}
                    placeholder="Topics to discuss or candidate's target industries..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                  >
                    {saving ? 'Booking...' : 'Book Session'}
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

