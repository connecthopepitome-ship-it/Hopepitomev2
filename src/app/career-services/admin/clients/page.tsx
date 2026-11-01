'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  getCareerProfile,
  saveCareerProfile,
  subscribeAllOrders,
  subscribeDocuments,
  subscribeClientInvoices,
  logActivity,
  sendMessage,
} from '@/lib/firebase/firestore';
import type {
  CareerClient,
  CareerProfileData,
  ServiceOrder,
  CareerDocument,
  CareerInvoice,
} from '@/lib/career/types';
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Rocket,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  RotateCcw,
  Receipt,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Edit,
  Save,
  Send,
  UploadCloud,
  Download,
  Building,
  HeartHandshake,
  DollarSign,
  TrendingUp,
  Activity,
  PlusCircle,
  X,
  FileUp,
  ArrowRight,
  Eye,
  ShieldAlert,
  Calendar,
} from 'lucide-react';

export default function AdminClients360Page() {
  const { adminProfile, role } = useAdminAuth();
  const [clients, setClients] = useState<CareerClient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<CareerClient | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<CareerProfileData | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'contracts' | 'orders' | 'timeline' | 'invoices' | 'dossier'>('contracts');
  const [dossierSubTab, setDossierSubTab] = useState<number>(1);
  const [tierFilter, setTierFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Associated client data
  const [clientOrders, setClientOrders] = useState<ServiceOrder[]>([]);
  const [clientDocs, setClientDocs] = useState<CareerDocument[]>([]);
  const [clientInvoices, setClientInvoices] = useState<CareerInvoice[]>([]);

  // Consultant Review Notes state
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Request Additional Information Modal State
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [requestedItems, setRequestedItems] = useState<string[]>([]);
  const [customRequestNote, setCustomRequestNote] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  const standardInfoChecklist = [
    'Please upload your latest resume.',
    'Please confirm your employment dates.',
    'Please share your LinkedIn profile.',
    'Please provide your target job description.',
    'Please share your project details.',
  ];

  useEffect(() => {
    const unsub = subscribeAllOrders((orders) => {
      const clientMap = new Map<string, CareerClient>();
      orders.forEach((o) => {
        if (!clientMap.has(o.clientId)) {
          clientMap.set(o.clientId, {
            id: o.clientId,
            clientCode: `CL-${o.clientId.substring(0, 4).toUpperCase()}`,
            fullName: o.clientName || 'Client Entity',
            email: o.clientEmail || '',
            onboardingCompleted: true,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
          });
        }
      });

      const list = Array.from(clientMap.values());
      setClients(list);
      if (list.length > 0 && !selectedClient) {
        handleSelectClient(list[0]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [selectedClient]);

  const handleSelectClient = async (client: CareerClient) => {
    setSelectedClient(client);
    try {
      const prof = await getCareerProfile(client.id);
      setSelectedProfile(prof);
      setAdminNotes(prof?.adminReviewNotes || '');
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedProfile || !selectedClient) return;
    setSavingNotes(true);
    const updated: CareerProfileData = {
      ...selectedProfile,
      adminReviewNotes: adminNotes,
      status: 'APPROVED',
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveCareerProfile(updated);
      setSelectedProfile(updated);
      await logActivity({
        actorId: adminProfile?.uid || 'staff',
        actorName: adminProfile?.displayName || 'Consultant',
        actorRole: role,
        action: 'PROFILE_REVIEWED',
        entityType: 'PROFILE',
        entityId: selectedClient.id,
        summary: `Reviewed career profile for ${selectedClient.fullName} and updated consultant notes`,
      });
      alert('Consultant notes saved and profile marked as APPROVED.');
    } catch (e) {
      console.error('Error saving notes:', e);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSendInfoRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || (!requestedItems.length && !customRequestNote.trim())) return;

    setSendingRequest(true);
    const allItems = [...requestedItems];
    if (customRequestNote.trim()) {
      allItems.push(customRequestNote.trim());
    }

    try {
      await saveCareerProfile({
        clientId: selectedClient.id,
        status: 'ADDITIONAL_INFO_REQUESTED',
        requestedItems: allItems,
        requestedNotes: customRequestNote.trim() || undefined,
        requestedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const msgId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `msg_${Date.now()}`;
      await sendMessage({
        id: msgId,
        clientId: selectedClient.id,
        senderUid: adminProfile?.uid || 'staff',
        senderName: adminProfile?.displayName || 'Lead Consultant',
        senderRole: 'ADMIN',
        content: `Hello ${selectedClient.fullName}, our review team needs additional details to proceed with your deliverables:\n${allItems.map((item) => `• ${item}`).join('\n')}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      const updatedProf = await getCareerProfile(selectedClient.id);
      setSelectedProfile(updatedProf);

      setShowRequestInfoModal(false);
      setRequestedItems([]);
      setCustomRequestNote('');
      alert('Request dispatched to client portal and message thread.');
    } catch (err) {
      console.error('Error sending info request:', err);
      alert('Failed to send request.');
    } finally {
      setSendingRequest(false);
    }
  };

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.clientCode.toLowerCase().includes(q);
    return matchesSearch;
  });

  const dossierTabs = [
    { id: 1, label: '1. Basic Info' },
    { id: 2, label: '2. Profile Overview' },
    { id: 3, label: '3. Target Roles' },
    { id: 4, label: '4. Employment History' },
    { id: 5, label: '5. Education' },
    { id: 6, label: '6. Certifications' },
    { id: 7, label: '7. Skills Matrix' },
    { id: 8, label: '8. Projects' },
    { id: 9, label: '9. Vault Documents' },
    { id: 10, label: '10. Orders' },
    { id: 11, label: '11. Consultant Notes' },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col w-full gap-5 font-['Manrope',sans-serif]">
        {/* Dynamic Top Control Bar & Breadcrumbs */}
        <div className="p-5 sm:p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
              <span className="hover:text-slate-800 cursor-pointer">Operations</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="hover:text-slate-800 cursor-pointer">CRM & Sales</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#173B8F] font-bold">Customer 360 Directory</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-[11px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                REAL-TIME TELEMETRY ACTIVE
              </span>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] text-[#173B8F] font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Customer 360 & Account Intelligence
              </h1>
              <p className="text-[14px] text-slate-600 leading-relaxed mt-1">
                Holistic client health scores, active contracts, service order history, communication logs, and commercial SLA monitoring across global operational units.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-9 px-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">Tier: All Portfolios ({clients.length || 142})</option>
                <option value="tier1">Tier 1 Enterprise (48)</option>
                <option value="mid">Mid-Market Strategic (64)</option>
                <option value="smb">SMB Fast-Track (30)</option>
              </select>

              <button
                onClick={() => alert('Client data export initiated in CSV format.')}
                className="flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[13px] font-semibold border border-slate-200 transition shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Clients</span>
              </button>

              <button
                onClick={() => {
                  const name = prompt('Enter Client Full Name:');
                  if (name) {
                    alert(`Account for ${name} created in pipeline.`);
                  }
                }}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Summary Intelligence Stat Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">Managed Accounts</span>
              <Building className="w-4 h-4 text-[#173B8F]" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-[#173B8F] tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                {clients.length || 142}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Enterprise Additions</span>
              <span className="text-slate-800 font-bold">+8.4% QoQ</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">Aggregate Client LTV</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-[#173B8F] tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                $4.85M
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">ARR Base</span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Average Contract ACV</span>
              <span className="text-slate-800 font-bold">$84.2K</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">Retention & Health</span>
              <HeartHandshake className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-emerald-800 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                96.8%
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                Optimal
              </span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Portfolio Churn Risk Index</span>
              <span className="text-emerald-700 font-bold">0.8% Critical</span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[12px] uppercase tracking-wider font-bold font-['Plus_Jakarta_Sans',sans-serif]">Open Escalations</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-[26px] sm:text-[32px] font-bold text-slate-900 tabular-nums font-['Plus_Jakarta_Sans',sans-serif]">
                3
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Active Incidents</span>
            </div>
            <div className="flex items-center justify-between text-[12px] text-slate-500 pt-1 border-t border-slate-100">
              <span>SLA Adherence</span>
              <span className="text-emerald-700 font-bold">100% (&lt;2hr SLA)</span>
            </div>
          </div>
        </div>

        {/* Master-Detail Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Master Client Directory (7 Cols Desktop) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by company, stakeholder, or contract ID..."
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-[13px] focus:outline-none focus:border-[#173B8F]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 bg-slate-200/60 px-2 py-1 rounded">
                  {filteredClients.length} Entities
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[12px] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                    <th className="py-3 px-4 font-bold">Client Entity & Tier</th>
                    <th className="py-3 px-3 font-bold">Primary Stakeholder</th>
                    <th className="py-3 px-3 font-bold text-center">Health Score</th>
                    <th className="py-3 px-4 font-bold text-right">Spend / Renewal</th>
                    <th className="py-3 px-3 font-bold text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-800">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-400">
                        No clients matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((c) => {
                      const isSelected = selectedClient?.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => handleSelectClient(c)}
                          className={`transition cursor-pointer ${
                            isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#173B8F] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                                {c.fullName.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-[#173B8F] text-[13px] font-['Plus_Jakarta_Sans',sans-serif]">
                                  {c.fullName}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                                  <span className="px-1.5 py-0.2 rounded bg-slate-100 font-bold text-slate-600">
                                    Tier 1 Enterprise
                                  </span>
                                  <span>{c.clientCode}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-900 text-[13px]">{c.fullName}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{c.email || 'contact@client.io'}</div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              98/100
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right font-['Plus_Jakarta_Sans',sans-serif]">
                            <div className="font-bold text-slate-900 text-[13px] tabular-nums">$340,000</div>
                            <div className="text-[11px] text-slate-500">Renews Nov 2025</div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectClient(c);
                              }}
                              className="p-1 rounded-lg bg-[#173B8F] text-white hover:bg-[#132c6b] transition"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[12px] text-slate-500">
              <span>Showing 1 - {filteredClients.length} of {clients.length} clients</span>
              <span className="font-semibold">Sorted by Commercial Priority</span>
            </div>
          </div>

          {/* Right Column: Selected Customer 360 Flyout / Detail Inspector (5 Cols Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {selectedClient ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Selected Client Header Profile */}
                <div className="p-5 bg-gradient-to-r from-[#173B8F] to-[#132c6b] text-white space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white text-[#173B8F] flex items-center justify-center font-extrabold text-base shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                        {selectedClient.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[17px] font-bold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                            {selectedClient.fullName}
                          </h2>
                          <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        </div>
                        <div className="text-blue-100 text-[12px] mt-0.5 flex items-center gap-2">
                          <span>{selectedClient.clientCode}</span>
                          <span>•</span>
                          <span>Tier 1 Enterprise Partner</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Exporting 360 dossier for ${selectedClient.fullName}...`)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                      title="Export Dossier PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Lead Partner: <strong>Marcus Vance</strong></span>
                    </div>
                    <span className="font-bold text-[#6ffbbe]">99.98% SLA Delivered</span>
                  </div>
                </div>

                {/* Segmented Tab Navigation for Detail Inspector */}
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1 text-[12px] font-bold font-['Plus_Jakarta_Sans',sans-serif]">
                  <button
                    onClick={() => setInspectorTab('contracts')}
                    className={`flex-1 py-1.5 rounded-lg transition text-center ${
                      inspectorTab === 'contracts'
                        ? 'bg-white text-[#173B8F] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Contracts & SLA
                  </button>
                  <button
                    onClick={() => setInspectorTab('orders')}
                    className={`flex-1 py-1.5 rounded-lg transition text-center ${
                      inspectorTab === 'orders'
                        ? 'bg-white text-[#173B8F] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Service Orders
                  </button>
                  <button
                    onClick={() => setInspectorTab('timeline')}
                    className={`flex-1 py-1.5 rounded-lg transition text-center ${
                      inspectorTab === 'timeline'
                        ? 'bg-white text-[#173B8F] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setInspectorTab('invoices')}
                    className={`flex-1 py-1.5 rounded-lg transition text-center ${
                      inspectorTab === 'invoices'
                        ? 'bg-white text-[#173B8F] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Invoices
                  </button>
                </div>

                {/* Tab 1: Contracts & SLA */}
                {inspectorTab === 'contracts' && (
                  <div className="p-5 space-y-4">
                    {/* Active SLA Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[13px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                            Mission-Critical Tier 1 SLA
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Contract Compliant
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                          <div className="text-slate-500">Uptime Delivered</div>
                          <div className="text-[16px] font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">99.98%</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Target: 99.95%</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                          <div className="text-slate-500">Engineering Pod</div>
                          <div className="text-[16px] font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">Dedicated 24/7</div>
                          <div className="text-[10px] text-slate-500">Alpha-9 Platform Core</div>
                        </div>
                      </div>
                    </div>

                    {/* Master Agreement Details */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
                        Active Agreement Details
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-[#173B8F]" />
                          <div>
                            <div className="text-[13px] font-bold text-slate-900">MSA Enterprise Master v3</div>
                            <div className="text-[11px] text-slate-500">Valid Oct 01, 2024 – Nov 30, 2025 • Auto-renewing</div>
                          </div>
                        </div>
                        <span className="text-[13px] font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">$340,000/yr</span>
                      </div>
                    </div>

                    {/* Consultant Review Notes */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-slate-700 uppercase font-['Plus_Jakarta_Sans',sans-serif]">
                          Consultant Notes & Dossier Strategy
                        </span>
                        <button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                          className="px-2.5 py-1 rounded bg-[#173B8F] text-white text-[11px] font-bold hover:bg-[#132c6b] transition disabled:opacity-50"
                        >
                          {savingNotes ? 'Saving...' : 'Save Notes'}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Log strategic account notes, SLA agreements, or consultation outcomes..."
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Service Orders */}
                {inspectorTab === 'orders' && (
                  <div className="p-5 space-y-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900">WO-8891: Realtime Cloud Infrastructure Guard</div>
                        <div className="text-[11px] text-slate-500">Pod: Alpha-9 • Completion: 78% • Sprint 14</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800">
                        In Progress
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900">WO-8703: Disaster Recovery Hot-Site Replication</div>
                        <div className="text-[11px] text-slate-500">Pod: Infra-Ops • Completion: 95% • Validation</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800">
                        In Progress
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Timeline */}
                {inspectorTab === 'timeline' && (
                  <div className="p-5">
                    <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      <div className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#173B8F]" />
                        <div className="text-[12px] font-bold text-slate-900">Annual Executive Review completed</div>
                        <div className="text-[11px] text-slate-500">Oct 24, 2024 at 14:00 UTC by Marcus Vance</div>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <div className="text-[12px] font-bold text-slate-900">SLA Milestone: 99.98% Quarterly Target met</div>
                        <div className="text-[11px] text-slate-500">Oct 01, 2024 by Automated Telemetry Guard</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Invoices */}
                {inspectorTab === 'invoices' && (
                  <div className="p-5 space-y-2">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-bold text-slate-900">INV-2024-Q3-018</div>
                        <div className="text-[11px] text-slate-500">Paid on Oct 04, 2024 • Wire Transfer</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">$85,000.00</div>
                        <span className="text-[10px] text-emerald-700 font-bold">Cleared</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action Suite */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => alert(`Creating work order for ${selectedClient.fullName}...`)}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#173B8F] text-white text-[12px] font-bold hover:bg-[#132c6b] transition shadow-sm"
                  >
                    Create Work Order
                  </button>
                  <button
                    onClick={() => setShowRequestInfoModal(true)}
                    className="py-2 px-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12px] font-semibold hover:bg-slate-100 transition"
                  >
                    Request Info
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-white border border-slate-200 text-center text-slate-400 text-xs">
                Select a client from the directory to inspect their 360° account dossier.
              </div>
            )}
          </div>
        </div>

        {/* Request Info Modal */}
        {showRequestInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-['Manrope',sans-serif]">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-[#173B8F] font-['Plus_Jakarta_Sans',sans-serif]">
                  Request Information from {selectedClient?.fullName}
                </h3>
                <button
                  onClick={() => setShowRequestInfoModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendInfoRequest} className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-slate-800">
                    Select Standard Checklist Items
                  </label>
                  {standardInfoChecklist.map((item) => (
                    <label key={item} className="flex items-center gap-2.5 text-[13px] text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestedItems.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setRequestedItems([...requestedItems, item]);
                          } else {
                            setRequestedItems(requestedItems.filter((i) => i !== item));
                          }
                        }}
                        className="rounded border-slate-300 text-[#173B8F] focus:ring-[#173B8F]"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-slate-800 mb-1">
                    Custom Instructions / Note
                  </label>
                  <textarea
                    rows={3}
                    value={customRequestNote}
                    onChange={(e) => setCustomRequestNote(e.target.value)}
                    placeholder="Specific questions or required documentation..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRequestInfoModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-[13px] font-semibold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingRequest}
                    className="px-4 py-2 rounded-lg bg-[#173B8F] text-white text-[13px] font-bold hover:bg-[#132c6b] transition shadow-md disabled:opacity-50"
                  >
                    {sendingRequest ? 'Dispatching...' : 'Dispatch Request'}
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
