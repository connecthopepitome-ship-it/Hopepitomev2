'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCrmLeads,
  saveCrmLead,
  updateCrmLeadStage,
  saveCrmFollowUp,
  logCrmActivity,
  subscribeCrmActivities,
} from '@/lib/firebase/firestore';
import type {
  CrmLead,
  CrmPipelineStage,
  CrmLeadSource,
  CrmActivity,
} from '@/lib/career/types';
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  UserCheck,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Tag,
  Briefcase,
  X,
  History,
} from 'lucide-react';

const PIPELINE_STAGES: CrmPipelineStage[] = [
  'New Lead',
  'Contact Attempted',
  'Contacted',
  'Qualified',
  'Consultation Scheduled',
  'Consultation Completed',
  'Quotation Preparation',
  'Quotation Sent',
  'Negotiation',
  'Won / Ready to Convert',
  'Lost',
  'Nurture / Follow-up Later',
];

const LEAD_SOURCES: CrmLeadSource[] = [
  'WEBSITE',
  'WHATSAPP',
  'INSTAGRAM',
  'FACEBOOK',
  'LINKEDIN',
  'GOOGLE_SEARCH',
  'GOOGLE_ADS',
  'REFERRAL',
  'EXISTING_CLIENT',
  'DIRECT',
  'CAMPAIGN',
  'OTHER',
];

const SERVICES_LIST = [
  'Professional Resume Writing',
  'ATS Resume Optimisation',
  'LinkedIn Profile Makeover',
  'Personal Portfolio Websites',
  'Managed Job Search & Applications',
  'Executive Career Transition',
  'General Career Consultation',
];

function LeadsContent() {
  const { adminProfile, role } = useAdminAuth();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  // Selected Lead for 360° Inspector
  const [activeLead, setActiveLead] = useState<CrmLead | null>(null);
  const [activities, setActivities] = useState<CrmActivity[]>([]);

  // Modals
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showLogCallModal, setShowLogCallModal] = useState(false);
  const [showScheduleFollowUpModal, setShowScheduleFollowUpModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);

  // New Lead Form
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [serviceInterestedIn, setServiceInterestedIn] = useState(SERVICES_LIST[0]);
  const [leadSource, setLeadSource] = useState<CrmLeadSource>('WEBSITE');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [targetRole, setTargetRole] = useState('');
  const [budget, setBudget] = useState('');
  const [enquiryDescription, setEnquiryDescription] = useState('');
  const [creatingLead, setCreatingLead] = useState(false);

  // Follow-up Form
  const [followUpTitle, setFollowUpTitle] = useState('Call back client to discuss package options');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [followUpTime, setFollowUpTime] = useState('11:00');
  const [followUpType, setFollowUpType] = useState('PHONE_CALL');
  const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);

  // Call Logging
  const [callOutcome, setCallOutcome] = useState('Spoke with lead, positive interest');
  const [callNotes, setCallNotes] = useState('');
  const [loggingCall, setLoggingCall] = useState(false);

  // Lost Reason
  const [lostReason, setLostReason] = useState('Price concern / Went with competitor');

  // Converting Lead
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    const unsub = subscribeCrmLeads((data) => {
      setLeads(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Listen to activities when a lead is selected
  useEffect(() => {
    if (!activeLead?.id) {
      setActivities([]);
      return;
    }
    const unsub = subscribeCrmActivities(activeLead.id, (list) => {
      setActivities(list);
    });
    return () => unsub();
  }, [activeLead?.id]);

  // Handle URL query preselect
  useEffect(() => {
    const leadIdParam = searchParams.get('leadId');
    if (leadIdParam && leads.length > 0) {
      const match = leads.find((l) => l.id === leadIdParam);
      if (match) setActiveLead(match);
    }
    if (searchParams.get('action') === 'new') {
      setShowNewLeadModal(true);
    }
  }, [searchParams, leads]);

  // Handle Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || (!mobile.trim() && !email.trim())) {
      alert('Please provide full name and at least one contact method (Mobile or Email).');
      return;
    }

    setCreatingLead(true);
    const now = new Date().toISOString();
    const leadId = `LEAD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLeadRecord: CrmLead = {
      id: leadId,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      serviceInterestedIn,
      leadSource,
      leadOwner: adminProfile?.displayName || 'Lead Consultant',
      priority,
      stage: 'New Lead',
      targetRole: targetRole.trim(),
      preferredBudget: budget.trim(),
      enquiryDescription: enquiryDescription.trim(),
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveCrmLead(newLeadRecord);
      await logCrmActivity({
        leadId,
        activityType: 'LEAD_CREATED',
        title: `Manual lead created: ${fullName}`,
        description: `Source: ${leadSource}, Priority: ${priority}, Interested in: ${serviceInterestedIn}`,
        performedBy: adminProfile?.displayName || 'Admin',
      });

      setShowNewLeadModal(false);
      setFullName('');
      setMobile('');
      setEmail('');
      setTargetRole('');
      setBudget('');
      setEnquiryDescription('');
      setActiveLead(newLeadRecord);
    } catch (err) {
      console.error('Error saving lead:', err);
      alert('Failed to save lead record.');
    } finally {
      setCreatingLead(false);
    }
  };

  // Handle Stage Change
  const handleChangeStage = async (newStage: CrmPipelineStage) => {
    if (!activeLead) return;
    if (newStage === 'Lost') {
      setShowLostModal(true);
      return;
    }

    try {
      await updateCrmLeadStage(activeLead.id, newStage);
      await logCrmActivity({
        leadId: activeLead.id,
        activityType: 'STAGE_CHANGED',
        title: `Pipeline stage moved to "${newStage}"`,
        description: `Updated by ${adminProfile?.displayName || 'Staff'}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });
      setActiveLead((prev) => (prev ? { ...prev, stage: newStage } : null));
    } catch (err) {
      console.error('Stage change error:', err);
    }
  };

  // Handle Mark Lost
  const handleConfirmLost = async () => {
    if (!activeLead) return;
    try {
      await updateCrmLeadStage(activeLead.id, 'Lost', lostReason);
      await logCrmActivity({
        leadId: activeLead.id,
        activityType: 'LEAD_LOST',
        title: `Lead marked as Lost`,
        description: `Reason: ${lostReason}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });
      setShowLostModal(false);
      setActiveLead((prev) => (prev ? { ...prev, stage: 'Lost', lostReason } : null));
    } catch (err) {
      console.error('Error marking lost:', err);
    }
  };

  // Handle Schedule Follow-up
  const handleScheduleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    setSchedulingFollowUp(true);

    try {
      const followUpId = `flw_${Date.now()}`;
      await saveCrmFollowUp({
        id: followUpId,
        leadId: activeLead.id,
        leadName: activeLead.fullName,
        leadPhone: activeLead.mobile,
        title: followUpTitle,
        followUpType: followUpType as any,
        assignedStaff: adminProfile?.displayName || 'Lead Consultant',
        dueDate: followUpDate,
        dueTime: followUpTime,
        priority: activeLead.priority,
        status: 'PENDING',
        createdBy: adminProfile?.displayName || 'Staff',
        createdAt: new Date().toISOString(),
      });

      await logCrmActivity({
        leadId: activeLead.id,
        activityType: 'FOLLOWUP_SCHEDULED',
        title: `Follow-up scheduled for ${followUpDate} at ${followUpTime}`,
        description: `${followUpType}: ${followUpTitle}`,
        performedBy: adminProfile?.displayName || 'Staff',
      });

      setShowScheduleFollowUpModal(false);
      alert('Follow-up scheduled successfully.');
    } catch (err) {
      console.error('Error scheduling follow-up:', err);
    } finally {
      setSchedulingFollowUp(false);
    }
  };

  // Handle Log Call Outcome
  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead) return;
    setLoggingCall(true);

    try {
      await logCrmActivity({
        leadId: activeLead.id,
        activityType: 'CALL_LOGGED',
        title: `Telephone Call Logged: ${callOutcome}`,
        description: callNotes || 'Standard phone communication logged.',
        performedBy: adminProfile?.displayName || 'Staff',
      });

      setShowLogCallModal(false);
      setCallNotes('');
      alert('Call interaction recorded in lead activity timeline.');
    } catch (err) {
      console.error('Error logging call:', err);
    } finally {
      setLoggingCall(false);
    }
  };

  // Handle 1-Click Convert to Client
  const handleConvertToClient = async () => {
    if (!activeLead) return;
    if (
      !confirm(
        `Convert "${activeLead.fullName}" into an active client? This will generate a permanent Work Order ID and initialize their private Google Drive vault.`
      )
    ) {
      return;
    }

    setConverting(true);
    try {
      const res = await fetch('/api/career/crm/lead/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLead.id,
          fullName: activeLead.fullName,
          mobile: activeLead.mobile,
          email: activeLead.email,
          adminName: adminProfile?.displayName || 'Staff',
          initialService: activeLead.serviceInterestedIn,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Conversion failed');
      }

      alert(`Success! ${activeLead.fullName} is now an active client with Work Order ID: ${data.workOrderId}`);
      setActiveLead((prev) =>
        prev
          ? {
              ...prev,
              stage: 'Won / Ready to Convert',
              convertedClientId: data.clientId,
              convertedWorkOrderId: data.workOrderId,
            }
          : null
      );
    } catch (err: any) {
      console.error('Convert Error:', err);
      alert(err?.message || 'Error converting lead to client.');
    } finally {
      setConverting(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Lead ID', 'Name', 'Mobile', 'Email', 'Service', 'Source', 'Stage', 'Priority', 'Owner', 'Created Date'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName}"`,
      l.mobile || '',
      l.email || '',
      `"${l.serviceInterestedIn}"`,
      l.leadSource,
      l.stage,
      l.priority,
      `"${l.leadOwner}"`,
      new Date(l.createdAt).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hopepitome_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters
  const filteredLeads = leads.filter((lead) => {
    const matchesQuery =
      searchQuery === '' ||
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.mobile && lead.mobile.includes(searchQuery)) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'ALL' || lead.stage === selectedStage;
    const matchesSource = selectedSource === 'ALL' || lead.leadSource === selectedSource;

    return matchesQuery && matchesStage && matchesSource;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                CRM Inbound Channel
              </span>
              <span className="text-[10px] font-semibold bg-[#FAF8FC] text-[#8172A8] px-2 py-0.5 rounded border border-[#E6E2DC]">
                {leads.length} Registered Inquiries
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Leads & Inquiries Inbox
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Search, filter, assign, and track all incoming career client opportunities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-[#17243B] text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5 text-[#777781]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setShowNewLeadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#777781] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, email, or Lead ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6E2DC] bg-white text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
            >
              <option value="ALL">All Stages ({leads.length})</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s} ({leads.filter((l) => l.stage === s).length})
                </option>
              ))}
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6E2DC] bg-white text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
            >
              <option value="ALL">All Sources</option>
              {LEAD_SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <AlertCircle className="w-8 h-8 text-[#8172A8] mx-auto" />
              <h2 className="text-xs font-bold text-[#17243B]">No leads matching your criteria</h2>
              <p className="text-[11px] text-[#777781]">Try clearing your search query or stage filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8FC] border-b border-[#E6E2DC] text-[11px] font-semibold text-[#777781] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Lead ID & Name</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Service Interest</th>
                    <th className="py-3.5 px-4">Source</th>
                    <th className="py-3.5 px-4">Stage</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Created</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2DC]/70 text-[#292D36]">
                  {filteredLeads.map((lead) => {
                    const isSelected = activeLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setActiveLead(lead)}
                        className={`cursor-pointer transition hover:bg-[#F7F5F0]/60 ${
                          isSelected ? 'bg-[#FAF8FC]' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#17243B]">{lead.fullName}</div>
                          <div className="text-[10px] font-mono text-[#8172A8]">{lead.id}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-[11px] font-mono text-[#17243B]">{lead.mobile || '—'}</div>
                          <div className="text-[11px] text-[#777781] truncate max-w-[150px]">
                            {lead.email || '—'}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-medium text-[#17243B] block truncate max-w-[180px]">
                            {lead.serviceInterestedIn}
                          </span>
                          {lead.targetRole && (
                            <span className="text-[10px] text-[#777781] truncate block max-w-[180px]">
                              Target: {lead.targetRole}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[10px] font-semibold bg-[#F7F5F0] text-[#17243B] px-2 py-0.5 rounded border border-[#E6E2DC]">
                            {lead.leadSource}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              lead.stage === 'Won / Ready to Convert'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lead.stage === 'Lost'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-[#8172A8]/15 text-[#8172A8]'
                            }`}
                          >
                            {lead.stage}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-semibold ${
                              lead.priority === 'URGENT'
                                ? 'text-red-600'
                                : lead.priority === 'HIGH'
                                ? 'text-amber-600'
                                : 'text-[#777781]'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[11px] text-[#777781]">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLead(lead);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#17243B] text-white text-[11px] font-medium hover:bg-[#292D36] transition shadow-sm"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 4: INDIVIDUAL LEAD PROFILE – 360 DEGREE VIEW (Slide-over panel)
           ========================================================================= */}
        {activeLead && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-sm flex justify-end">
            <div className="bg-[#FFFFFF] w-full max-w-2xl h-full shadow-2xl border-l border-[#E6E2DC] flex flex-col font-sans overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-[#E6E2DC] flex items-center justify-between bg-[#FAF8FC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#17243B] text-white flex items-center justify-center font-bold text-sm">
                    {activeLead.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#17243B]">{activeLead.fullName}</h2>
                    <div className="flex items-center gap-2 text-[11px] text-[#777781]">
                      <span className="font-mono text-[#8172A8]">{activeLead.id}</span>
                      <span>•</span>
                      <span>Source: {activeLead.leadSource}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveLead(null)}
                  className="p-1.5 rounded-lg text-[#777781] hover:text-[#17243B] hover:bg-[#E6E2DC]/50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Communication & Conversion Actions Bar */}
              <div className="p-4 bg-white border-b border-[#E6E2DC] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {activeLead.mobile && (
                    <a
                      href={`https://wa.me/${activeLead.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(activeLead.fullName)},%20thank%20you%20for%20contacting%20Hopepitome%20Career%20Services.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {activeLead.mobile && (
                    <a
                      href={`tel:${activeLead.mobile}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-white text-[#17243B] text-xs font-semibold hover:bg-[#F7F5F0] transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8172A8]" />
                      <span>Call</span>
                    </a>
                  )}

                  {activeLead.email && (
                    <a
                      href={`mailto:${activeLead.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-white text-[#17243B] text-xs font-semibold hover:bg-[#F7F5F0] transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#8172A8]" />
                      <span>Email</span>
                    </a>
                  )}

                  <button
                    onClick={() => setShowLogCallModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-white text-[#17243B] text-xs font-semibold hover:bg-[#F7F5F0] transition"
                  >
                    <span>Log Call</span>
                  </button>
                </div>

                {/* 1-Click Conversion Button */}
                {activeLead.convertedWorkOrderId ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Client: {activeLead.convertedWorkOrderId}</span>
                  </div>
                ) : (
                  <button
                    onClick={handleConvertToClient}
                    disabled={converting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8172A8] hover:bg-[#726399] text-white text-xs font-bold shadow-sm transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{converting ? 'Converting...' : 'Convert to Client'}</span>
                  </button>
                )}
              </div>

              {/* Scrollable Details Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stage Progress Selector */}
                <div className="bg-[#FAF8FC] p-4 rounded-xl border border-[#E6E2DC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#17243B]">Pipeline Stage</span>
                    <span className="font-mono text-[#8172A8] font-bold">{activeLead.stage}</span>
                  </div>

                  <select
                    value={activeLead.stage}
                    onChange={(e) => handleChangeStage(e.target.value as CrmPipelineStage)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E6E2DC] text-xs text-[#17243B] bg-white focus:outline-none focus:border-[#8172A8]"
                  >
                    {PIPELINE_STAGES.map((stg) => (
                      <option key={stg} value={stg}>
                        Move to: {stg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[#777781] block text-[10px] uppercase font-semibold">
                      Service Interested In
                    </span>
                    <span className="font-bold text-[#17243B] mt-0.5 block">{activeLead.serviceInterestedIn}</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[#777781] block text-[10px] uppercase font-semibold">Target Role</span>
                    <span className="font-bold text-[#17243B] mt-0.5 block">
                      {activeLead.targetRole || 'Not specified'}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[#777781] block text-[10px] uppercase font-semibold">Priority & Owner</span>
                    <span className="font-bold text-[#17243B] mt-0.5 block">
                      {activeLead.priority} • {activeLead.leadOwner}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E6E2DC]">
                    <span className="text-[#777781] block text-[10px] uppercase font-semibold">Preferred Budget</span>
                    <span className="font-bold text-[#17243B] mt-0.5 block">
                      {activeLead.preferredBudget || 'Flexible / Scoping'}
                    </span>
                  </div>
                </div>

                {/* Enquiry Requirements Note */}
                {activeLead.enquiryDescription && (
                  <div className="p-4 rounded-xl bg-white border border-[#E6E2DC] space-y-1">
                    <span className="text-[10px] font-semibold text-[#777781] uppercase tracking-wider block">
                      Initial Inquiry Description
                    </span>
                    <p className="text-xs text-[#17243B] leading-relaxed whitespace-pre-wrap">
                      {activeLead.enquiryDescription}
                    </p>
                  </div>
                )}

                {/* Follow-up Action Card */}
                <div className="bg-white p-4 rounded-xl border border-[#E6E2DC] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#17243B]">Schedule Follow-up</h3>
                    <p className="text-[11px] text-[#777781]">Set a calendar task or reminder to call back.</p>
                  </div>
                  <button
                    onClick={() => setShowScheduleFollowUpModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </button>
                </div>

                {/* Chronological Activity Timeline (Section 4) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#17243B] uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-[#8172A8]" />
                      <span>Activity Timeline</span>
                    </h3>
                    <span className="text-[10px] text-[#777781]">{activities.length} recorded events</span>
                  </div>

                  {activities.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-[#E6E2DC] text-center text-xs text-[#777781]">
                      No activities logged yet. Interactions and stage changes will appear here.
                    </div>
                  ) : (
                    <div className="border-l-2 border-[#8172A8]/30 ml-2 space-y-4 py-1">
                      {activities.map((act) => (
                        <div key={act.id} className="relative pl-5 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#8172A8] absolute -left-[5.5px] top-1.5" />
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#17243B]">{act.title}</span>
                            <span className="text-[10px] text-[#777781]">
                              {new Date(act.timestamp).toLocaleDateString()} {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-[11px] text-[#777781] mt-0.5 leading-relaxed">{act.description}</p>
                          )}
                          <span className="text-[10px] text-[#8172A8] mt-0.5 block font-medium">
                            By {act.performedBy}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Lead */}
        {showNewLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">Create New Lead</h3>
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Mobile / WhatsApp</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rachel@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Interested Service</label>
                    <select
                      value={serviceInterestedIn}
                      onChange={(e) => setServiceInterestedIn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    >
                      {SERVICES_LIST.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Lead Source</label>
                    <select
                      value={leadSource}
                      onChange={(e) => setLeadSource(e.target.value as CrmLeadSource)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    >
                      {LEAD_SOURCES.map((src) => (
                        <option key={src} value={src}>
                          {src}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Target Role</label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. VP of Product"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Initial Brief / Notes</label>
                  <textarea
                    rows={3}
                    value={enquiryDescription}
                    onChange={(e) => setEnquiryDescription(e.target.value)}
                    placeholder="Enter candidate's specific background, goals, or requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setShowNewLeadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingLead}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                  >
                    {creatingLead ? 'Saving...' : 'Create Lead Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule Follow-up */}
        {showScheduleFollowUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">Schedule Follow-up</h3>
                <button
                  type="button"
                  onClick={() => setShowScheduleFollowUpModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleScheduleFollowUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Follow-up Action Title</label>
                  <input
                    type="text"
                    required
                    value={followUpTitle}
                    onChange={(e) => setFollowUpTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Due Time</label>
                    <input
                      type="time"
                      value={followUpTime}
                      onChange={(e) => setFollowUpTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Follow-up Channel</label>
                  <select
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="PHONE_CALL">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp Message</option>
                    <option value="EMAIL">Email Follow-up</option>
                    <option value="CONSULTATION">1-on-1 Consultation</option>
                    <option value="QUOTATION_FOLLOWUP">Quotation Discussion</option>
                    <option value="GENERAL">General Follow-up</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setShowScheduleFollowUpModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={schedulingFollowUp}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                  >
                    {schedulingFollowUp ? 'Saving...' : 'Set Follow-up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Log Call Outcome */}
        {showLogCallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-[#17243B]">Log Telephone Interaction</h3>
                <button
                  type="button"
                  onClick={() => setShowLogCallModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleLogCall} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Call Outcome</label>
                  <select
                    value={callOutcome}
                    onChange={(e) => setCallOutcome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="Connected: Interested in Resume Writing">Connected: Interested in Resume Writing</option>
                    <option value="Connected: Consultation Booked">Connected: Consultation Booked</option>
                    <option value="Connected: Requested Quote">Connected: Requested Quote</option>
                    <option value="Connected: Call Back Later">Connected: Call Back Later</option>
                    <option value="No Answer / Voicemail Left">No Answer / Voicemail Left</option>
                    <option value="Busy / Number Switched Off">Busy / Number Switched Off</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Discussion Notes</label>
                  <textarea
                    rows={3}
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Enter summary of conversation..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setShowLogCallModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loggingCall}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#17243B] hover:bg-[#292D36] disabled:opacity-50 transition shadow-sm"
                  >
                    {loggingCall ? 'Logging...' : 'Save Call Record'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Mark Lost with Reason */}
        {showLostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E6E2DC] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6E2DC]">
                <h3 className="text-sm font-bold text-red-700">Mark Lead as Lost</h3>
                <button
                  type="button"
                  onClick={() => setShowLostModal(false)}
                  className="text-xs text-[#777781] hover:text-[#17243B]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-[#777781]">
                  A lost reason is required for sales reporting and pipeline audit.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Reason for Loss</label>
                  <select
                    value={lostReason}
                    onChange={(e) => setLostReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30"
                  >
                    <option value="Price too high / Budget mismatch">Price too high / Budget mismatch</option>
                    <option value="Went with competitor">Went with competitor</option>
                    <option value="No response after multiple attempts">No response after multiple attempts</option>
                    <option value="Postponed job search indefinitely">Postponed job search indefinitely</option>
                    <option value="Already secured employment">Already secured employment</option>
                    <option value="Service out of scope">Service out of scope</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E2DC]">
                  <button
                    type="button"
                    onClick={() => setShowLostModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#777781] hover:text-[#17243B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmLost}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition shadow-sm"
                  >
                    Confirm Lost
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default function LeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LeadsContent />
    </Suspense>
  );
}

