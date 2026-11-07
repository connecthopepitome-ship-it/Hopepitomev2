'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
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
  subscribeClients,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type {
  CrmLead,
  CrmPipelineStage,
  CrmLeadSource,
  CrmActivity,
  ClientRecord,
  StaffUser,
} from '@/lib/career/types';
import {
  Inbox,
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
  TrendingUp,
  ChevronRight,
  X,
  FileText,
  User,
  Shield,
  Briefcase,
  Layers,
  Link as LinkIcon,
} from 'lucide-react';

const PIPELINE_STAGES: CrmPipelineStage[] = [
  'New',
  'Contacted',
  'Qualified',
  'Discovery / Needs Assessment',
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
  'Website Development',
  'Ecommerce Store Development',
  'Custom Web Application Development',
  'ERP Implementation & Consulting',
  'CRM Implementation & Customisation',
  'Workflow Automation & Process Engineering',
  'API & System Integrations',
  'Business Dashboards & Analytics',
  'Cloud Hosting & SLA Support Maintenance',
  'Professional Resume Writing',
  'ATS Resume Optimisation',
  'LinkedIn Profile Makeover',
  'Personal Portfolio Websites',
  'Managed Job Search & Applications',
  'Executive Career Transition',
];

function LeadsContent() {
  const { adminProfile, role } = useAdminAuth();
  const searchParams = useSearchParams();

  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Active Lead for Drawer
  const [activeLead, setActiveLead] = useState<CrmLead | null>(null);

  // New Lead Modal
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [creatingLead, setCreatingLead] = useState(false);
  const [leadFormError, setLeadFormError] = useState<string | null>(null);

  // New Lead Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [serviceInterestedIn, setServiceInterestedIn] = useState(SERVICES_LIST[0]);
  const [leadSource, setLeadSource] = useState<CrmLeadSource>('DIRECT');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [targetRole, setTargetRole] = useState('');
  const [enquiryDescription, setEnquiryDescription] = useState('');

  // Conversion Modal State (Section 11)
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertAssignedStaffId, setConvertAssignedStaffId] = useState('');
  const [convertLinkOption, setConvertLinkOption] = useState<'NEW' | 'LINK_EXISTING'>('NEW');
  const [convertSelectedClientId, setConvertSelectedClientId] = useState('');
  const [conversionResult, setConversionResult] = useState<{
    workOrderId: string;
    projectId?: string;
    clientId: string;
    message: string;
  } | null>(null);

  // Subscriptions
  useEffect(() => {
    const unsubLeads = subscribeCrmLeads((data) => {
      setLeads(data);
      setLoading(false);
    });

    const unsubClients = subscribeClients((cl) => {
      setClients(cl);
    });

    const unsubStaff = subscribeStaffUsers((st) => {
      setStaffUsers(st);
    });

    return () => {
      unsubLeads();
      unsubClients();
      unsubStaff();
    };
  }, []);

  // Filter Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lead.fullName.toLowerCase().includes(q) ||
        (lead.mobile && lead.mobile.includes(q)) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.serviceInterestedIn && lead.serviceInterestedIn.toLowerCase().includes(q)) ||
        lead.id.toLowerCase().includes(q);

      const matchStage = selectedStage === 'ALL' || lead.stage === selectedStage;
      const matchSource = selectedSource === 'ALL' || lead.leadSource === selectedSource;
      const matchPriority = selectedPriority === 'ALL' || lead.priority === selectedPriority;

      return matchSearch && matchStage && matchSource && matchPriority;
    });
  }, [leads, searchQuery, selectedStage, selectedSource, selectedPriority]);

  // Check matching clients when activeLead changes
  const matchingClients = useMemo(() => {
    if (!activeLead) return [];
    const leadMobileClean = (activeLead.mobile || '').replace(/\D/g, '');
    const leadEmailClean = (activeLead.email || '').trim().toLowerCase();

    return clients.filter((c) => {
      const cMobileClean = (c.mobile || '').replace(/\D/g, '');
      const cEmailClean = (c.email || '').trim().toLowerCase();
      const mobileMatch = leadMobileClean && cMobileClean && (cMobileClean.includes(leadMobileClean) || leadMobileClean.includes(cMobileClean));
      const emailMatch = leadEmailClean && cEmailClean && cEmailClean === leadEmailClean;
      return mobileMatch || emailMatch;
    });
  }, [activeLead, clients]);

  // Handle Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      setLeadFormError('Full Name and Mobile number are required.');
      return;
    }

    setCreatingLead(true);
    setLeadFormError(null);

    const now = new Date().toISOString();
    const leadId = `LEAD-${Date.now().toString().slice(-6)}`;

    const newLeadRecord: CrmLead = {
      id: leadId,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      serviceInterestedIn,
      leadSource,
      priority,
      targetRole: targetRole.trim() || undefined,
      enquiryDescription: enquiryDescription.trim() || undefined,
      stage: 'New',
      leadOwner: adminProfile?.displayName || 'Unassigned',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveCrmLead(newLeadRecord);
      try {
        await logCrmActivity({
          leadId,
          activityType: 'LEAD_CREATED',
          title: `Manual lead created: ${fullName.trim()}`,
          description: `Source: ${leadSource}, Priority: ${priority}, Interested in: ${serviceInterestedIn}`,
          performedBy: adminProfile?.displayName || 'Admin',
        });
      } catch (actErr) {
        console.warn('CRM activity logging warning:', actErr);
      }
      setLeads((prev) => [newLeadRecord, ...prev.filter((l) => l.id !== newLeadRecord.id)]);
      setShowNewLeadModal(false);
      setFullName('');
      setMobile('');
      setEmail('');
      setTargetRole('');
      setEnquiryDescription('');
      setActiveLead(newLeadRecord);
    } catch (err: any) {
      console.error('Error saving lead:', err);
      setLeadFormError(err?.message || 'Failed to save lead record. Please retry.');
    } finally {
      setCreatingLead(false);
    }
  };

  // Handle Quick Change Stage
  const handleChangeStage = async (newStage: CrmPipelineStage) => {
    if (!activeLead) return;
    try {
      await updateCrmLeadStage(activeLead.id, newStage, adminProfile?.displayName || 'Admin');
      setActiveLead((prev) => (prev ? { ...prev, stage: newStage } : null));
    } catch (err: any) {
      alert('Error updating stage: ' + err?.message);
    }
  };

  // Open Conversion Modal (Section 11)
  const handleOpenConvert = () => {
    if (!activeLead) return;
    setConversionResult(null);
    if (matchingClients.length > 0) {
      setConvertLinkOption('LINK_EXISTING');
      setConvertSelectedClientId(matchingClients[0].clientId);
    } else {
      setConvertLinkOption('NEW');
      setConvertSelectedClientId('');
    }
    setShowConvertModal(true);
  };

  // Execute Conversion
  const handleExecuteConversion = async () => {
    if (!activeLead) return;
    setConverting(true);

    try {
      const assignedStaff = staffUsers.find((s) => s.uid === convertAssignedStaffId);
      const res = await fetch('/api/career/crm/lead/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLead.id,
          fullName: activeLead.fullName,
          mobile: activeLead.mobile,
          email: activeLead.email,
          initialService: activeLead.serviceInterestedIn,
          adminName: adminProfile?.displayName || 'Admin',
          existingClientId: convertLinkOption === 'LINK_EXISTING' ? convertSelectedClientId : undefined,
          assignedStaffId: assignedStaff?.uid,
          assignedStaffName: assignedStaff?.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Conversion failed.');
      }

      setConversionResult({
        workOrderId: data.workOrderId,
        projectId: data.projectId,
        clientId: data.clientId,
        message: data.message || 'Lead successfully converted!',
      });

      setActiveLead((prev) =>
        prev
          ? {
              ...prev,
              stage: 'Won / Ready to Convert',
              convertedClientId: data.clientId,
              convertedWorkOrderId: data.workOrderId,
              convertedProjectId: data.projectId,
            }
          : null
      );
    } catch (err: any) {
      console.error('Conversion exception:', err);
      alert(err?.message || 'Error converting lead to client.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-5 font-['Manrope',sans-serif]">
      {/* Header & Primary Actions */}
      <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#173B8F] border border-blue-100 uppercase">
              LEADS PIPELINE
            </span>
            <span className="text-xs text-slate-500 font-medium">Acquisition & Intake</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Leads & Intake Inbox
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture, qualify, schedule consultations, and convert inquiries into active clients.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Lead</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone, email, or lead ID..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#173B8F] shrink-0"
          >
            <option value="ALL">All Stages ({leads.length})</option>
            {PIPELINE_STAGES.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#173B8F] shrink-0"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#173B8F] shrink-0"
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

      {/* Main Content Area: Responsive Switch (Section 10) */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading CRM pipeline...
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-semibold text-slate-700">No leads found</p>
          <p className="text-slate-400">Try adjusting your search query or stage filters.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Compact Lead Cards (< md) */}
          <div className="md:hidden space-y-3">
            {filteredLeads.map((lead) => {
              const isConverted = !!lead.convertedWorkOrderId;
              const phoneClean = (lead.mobile || '').replace(/\D/g, '');
              return (
                <div
                  key={lead.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-sm">{lead.fullName}</span>
                        {isConverted && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            CONVERTED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 block">{lead.id}</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        lead.stage === 'New'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : lead.stage === 'Won / Ready to Convert'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Service</span>
                      <span className="font-medium truncate block">{lead.serviceInterestedIn || 'General'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Contact</span>
                      <span className="font-mono text-slate-800">{lead.mobile || '—'}</span>
                    </div>
                  </div>

                  {/* Mobile Quick Action Buttons (Section 10) */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {lead.mobile && (
                        <>
                          <a
                            href={`tel:${lead.mobile}`}
                            className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${phoneClean}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveLead(lead)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                      >
                        Inspect
                      </button>

                      {!isConverted ? (
                        <button
                          onClick={() => {
                            setActiveLead(lead);
                            handleOpenConvert();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition"
                        >
                          Convert
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">
                          {lead.convertedWorkOrderId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop View: Clean Data Table (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Lead ID & Customer</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Service Interest</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLeads.map((lead) => {
                    const isSelected = activeLead?.id === lead.id;
                    const isConverted = !!lead.convertedWorkOrderId;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setActiveLead(lead)}
                        className={`cursor-pointer transition hover:bg-slate-50/80 ${
                          isSelected ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{lead.fullName}</div>
                          <div className="text-[10px] font-mono text-blue-600">{lead.id}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-[11px] font-mono text-slate-900">{lead.mobile || '—'}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {lead.email || '—'}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-800">
                          {lead.serviceInterestedIn || 'General'}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {lead.leadSource}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              lead.stage === 'New'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : lead.stage === 'Won / Ready to Convert'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {lead.stage}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold ${
                              lead.priority === 'URGENT' || lead.priority === 'HIGH'
                                ? 'text-rose-600'
                                : 'text-slate-500'
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveLead(lead)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                            >
                              Inspect
                            </button>
                            {!isConverted ? (
                              <button
                                onClick={() => {
                                  setActiveLead(lead);
                                  handleOpenConvert();
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition"
                              >
                                Convert
                              </button>
                            ) : (
                              <span className="text-[10px] font-mono text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 rounded">
                                {lead.convertedWorkOrderId}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Slide-out Lead Inspector Drawer */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600">{activeLead.id}</span>
                <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {activeLead.fullName}
                </h2>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              {/* Conversion Ribbon if already converted */}
              {activeLead.convertedWorkOrderId ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Converted to Active Client</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Work Order ID: <span className="font-mono font-bold">{activeLead.convertedWorkOrderId}</span>
                  </p>
                  {activeLead.convertedProjectId && (
                    <p className="text-[11px] text-emerald-700">
                      Project ID: <span className="font-mono font-bold">{activeLead.convertedProjectId}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <div>
                    <span className="text-xs font-bold text-[#173B8F] block">Ready to Convert?</span>
                    <span className="text-[11px] text-slate-500">Initialize Client account & Work Order</span>
                  </div>
                  <button
                    onClick={handleOpenConvert}
                    className="px-3.5 py-1.5 rounded-xl bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition shadow-sm flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Convert Now</span>
                  </button>
                </div>
              )}

              {/* Stage Progress Selector */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Pipeline Stage</span>
                  <span className="font-mono font-bold text-blue-600">{activeLead.stage}</span>
                </div>
                <select
                  value={activeLead.stage}
                  onChange={(e) => handleChangeStage(e.target.value as CrmPipelineStage)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                >
                  {PIPELINE_STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      Move to: {stg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Contact Details
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone / WhatsApp:</span>
                    <span className="font-mono font-bold text-slate-900">{activeLead.mobile}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-mono text-slate-900">{activeLead.email || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-semibold text-[#173B8F]">{activeLead.serviceInterestedIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Source:</span>
                    <span className="font-medium text-slate-800">{activeLead.leadSource}</span>
                  </div>
                </div>
              </div>

              {/* Initial Notes / Brief */}
              {activeLead.enquiryDescription && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Client Requirements / Notes
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {activeLead.enquiryDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Complete CRM to Customer Conversion Modal (Section 11) */}
      {showConvertModal && activeLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Convert Lead to Client & Project
                </h3>
                <p className="text-xs text-slate-500">
                  Review matching records, initialize Work Order & project assignment.
                </p>
              </div>
              <button
                onClick={() => setShowConvertModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conversionResult ? (
              /* Success State */
              <div className="space-y-4 py-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                    Conversion Completed Successfully
                  </h4>
                  <p className="text-xs text-slate-600">{conversionResult.message}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Work Order ID:</span>
                    <span className="font-mono font-bold text-blue-700">{conversionResult.workOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client ID:</span>
                    <span className="font-mono font-bold text-slate-800">{conversionResult.clientId}</span>
                  </div>
                  {conversionResult.projectId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Project ID:</span>
                      <span className="font-mono font-bold text-violet-700">{conversionResult.projectId}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setShowConvertModal(false)}
                    className="w-full py-2.5 rounded-xl bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Form State */
              <div className="space-y-4">
                {/* Duplicate Check Intelligence */}
                {matchingClients.length > 0 ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Matching Client Account Detected</span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      We found {matchingClients.length} existing client(s) with matching contact info. Link to this client or create a separate account?
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="linkOption"
                          checked={convertLinkOption === 'LINK_EXISTING'}
                          onChange={() => setConvertLinkOption('LINK_EXISTING')}
                          className="text-[#173B8F]"
                        />
                        <span>Link to existing client:</span>
                      </label>

                      {convertLinkOption === 'LINK_EXISTING' && (
                        <select
                          value={convertSelectedClientId}
                          onChange={(e) => setConvertSelectedClientId(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-amber-300 text-xs bg-white text-slate-800 focus:outline-none"
                        >
                          {matchingClients.map((c) => (
                            <option key={c.clientId} value={c.clientId}>
                              {c.name} ({c.clientId}) — {c.mobile}
                            </option>
                          ))}
                        </select>
                      )}

                      <label className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="linkOption"
                          checked={convertLinkOption === 'NEW'}
                          onChange={() => setConvertLinkOption('NEW')}
                          className="text-[#173B8F]"
                        />
                        <span>Create new client account anyway</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-xs text-blue-800">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>No duplicate clients found. A new client account will be initialized.</span>
                  </div>
                )}

                {/* Service Details Confirmation */}
                <div className="space-y-1 text-xs">
                  <label className="block font-semibold text-slate-700">Service Offering</label>
                  <input
                    type="text"
                    disabled
                    value={activeLead.serviceInterestedIn}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium"
                  />
                </div>

                {/* Project Manager / Staff Assignment */}
                <div className="space-y-1 text-xs">
                  <label className="block font-semibold text-slate-700">Assign Project Lead / Writer</label>
                  <select
                    value={convertAssignedStaffId}
                    onChange={(e) => setConvertAssignedStaffId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  >
                    <option value="">Unassigned (Assign later)</option>
                    {staffUsers.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.fullName} ({s.roleName || s.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConvertModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={converting}
                    onClick={handleExecuteConversion}
                    className="px-5 py-2 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold transition shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {converting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Confirm Conversion</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  Create New Lead
                </h3>
                <p className="text-xs text-slate-500">Capture initial enquiry and contact details</p>
              </div>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {leadFormError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{leadFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 or +1 number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interested Service</label>
                  <select
                    value={serviceInterestedIn}
                    onChange={(e) => setServiceInterestedIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  >
                    {SERVICES_LIST.map((srv) => (
                      <option key={srv} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value as CrmLeadSource)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  >
                    {LEAD_SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. VP of Product"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Brief / Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={enquiryDescription}
                  onChange={(e) => setEnquiryDescription(e.target.value)}
                  placeholder="Capture specific goals, timeline, or reference websites..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingLead}
                  className="px-5 py-2 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold transition shadow-sm disabled:opacity-50"
                >
                  {creatingLead ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Leads Inbox...</div>}>
        <LeadsContent />
      </Suspense>
    </AdminLayout>
  );
}
