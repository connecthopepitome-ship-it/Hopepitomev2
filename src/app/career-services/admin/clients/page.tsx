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
} from 'lucide-react';

export default function AdminClients360Page() {
  const { adminProfile, role } = useAdminAuth();
  const [clients, setClients] = useState<CareerClient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<CareerClient | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<CareerProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Associated client data
  const [clientOrders, setClientOrders] = useState<ServiceOrder[]>([]);
  const [clientDocs, setClientDocs] = useState<CareerDocument[]>([]);
  const [clientInvoices, setClientInvoices] = useState<CareerInvoice[]>([]);

  // Consultant Review Notes state
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    // Subscribe to all orders to build active client directory
    const unsub = subscribeAllOrders((orders) => {
      // Deduplicate unique clients from orders
      const clientMap = new Map<string, CareerClient>();
      orders.forEach((o) => {
        if (!clientMap.has(o.clientId)) {
          clientMap.set(o.clientId, {
            id: o.clientId,
            clientCode: `CL-${o.clientId.substring(0, 4).toUpperCase()}`,
            fullName: o.clientName || 'Client',
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

  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.clientCode.toLowerCase().includes(q)
    );
  });

  const tabs = [
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
    { id: 11, label: '11. Tasks' },
    { id: 12, label: '12. Deliverables' },
    { id: 13, label: '13. Revisions' },
    { id: 14, label: '14. Consultant Notes' },
    { id: 15, label: '15. Billing' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Client Dossier 360°
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Client Management Directory
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Deep inspection of client career profiles, work history, skill taxonomy, active orders, and consultant annotations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#777781]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or client ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
            />
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Client List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#777781] px-1">
              Patrons & Clients ({filteredClients.length})
            </h3>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="bg-[#FFFFFF] p-6 rounded-xl border border-[#E6E2DC] text-center text-xs text-[#777781]">
                No clients match your query.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredClients.map((c) => {
                  const isSelected = selectedClient?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectClient(c)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? 'border-[#17243B] bg-white shadow-sm ring-1 ring-[#17243B]'
                          : 'border-[#E6E2DC] bg-[#FFFFFF] hover:border-[#8172A8]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono text-[#8172A8] font-bold">
                          {c.clientCode}
                        </span>
                        <span className="text-[#777781]">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#17243B]">{c.fullName}</h4>
                      <p className="text-[11px] text-[#777781] truncate">{c.email}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: 360° Client Inspector (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedClient ? (
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] overflow-hidden">
                {/* Client Profile Header Bar */}
                <div className="p-6 bg-[#F7F5F0]/40 border-b border-[#E6E2DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#17243B] text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {selectedClient.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#17243B]">
                          {selectedClient.fullName}
                        </h2>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFFFFF] text-[#17243B] border border-[#E6E2DC]">
                          {selectedClient.clientCode}
                        </span>
                      </div>
                      <p className="text-xs text-[#777781] mt-0.5">{selectedClient.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        selectedProfile?.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      Status: {selectedProfile?.status || 'Draft'}
                    </span>
                  </div>
                </div>

                {/* 15 Horizontal Tabs Navigation Bar */}
                <div className="border-b border-[#E6E2DC] bg-[#FFFFFF] overflow-x-auto px-4 py-2">
                  <div className="flex items-center gap-1 min-w-[900px]">
                    {tabs.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                          activeTab === t.id
                            ? 'bg-[#17243B] text-white shadow-sm'
                            : 'text-[#292D36] hover:bg-[#F7F5F0] hover:text-[#17243B]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Contents Container */}
                <div className="p-6">
                  {/* TAB 1: Basic Info */}
                  {activeTab === 1 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Personal & Contact Identification
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[#777781] block">Full Legal Name</span>
                          <span className="font-semibold text-[#17243B]">{selectedClient.fullName}</span>
                        </div>
                        <div>
                          <span className="text-[#777781] block">Email</span>
                          <span className="font-semibold text-[#17243B]">{selectedClient.email}</span>
                        </div>
                        <div>
                          <span className="text-[#777781] block">Phone / WhatsApp</span>
                          <span className="font-semibold text-[#17243B]">{selectedProfile?.phone || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-[#777781] block">Current Location</span>
                          <span className="font-semibold text-[#17243B]">{selectedProfile?.location || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-[#777781] block">LinkedIn URL</span>
                          {selectedProfile?.linkedInUrl ? (
                            <a
                              href={selectedProfile.linkedInUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-[#8172A8] hover:underline flex items-center gap-1"
                            >
                              <span>{selectedProfile.linkedInUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[#777781]">None</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[#777781] block">Portfolio URL</span>
                          {selectedProfile?.portfolioUrl ? (
                            <a
                              href={selectedProfile.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-[#8172A8] hover:underline flex items-center gap-1"
                            >
                              <span>{selectedProfile.portfolioUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[#777781]">None</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Profile Overview */}
                  {activeTab === 2 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Career Stage & Personal Statement
                      </h4>
                      <div className="p-4 rounded-xl bg-[#F7F5F0]/60 border border-[#E6E2DC] text-xs space-y-2">
                        <div>
                          <span className="text-[#777781] block">Career Seniority</span>
                          <span className="font-bold text-[#17243B]">{selectedProfile?.careerStage || 'Mid-Level'}</span>
                        </div>
                        <div>
                          <span className="text-[#777781] block">Work Mode</span>
                          <span className="font-semibold text-[#17243B]">{selectedProfile?.preferredWorkType || 'Remote'}</span>
                        </div>
                        <div>
                          <span className="text-[#777781] block">Personal Statement / Context</span>
                          <p className="text-[#292D36] mt-1 leading-relaxed">
                            {selectedProfile?.personalStatement || 'No personal statement provided.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Target Roles & Preferences */}
                  {activeTab === 3 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Target Positions, Industries & Markets
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-[#777781] block mb-1">Target Roles:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProfile?.targetRoleTitles?.map((r, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[#E6E2DC] font-semibold text-[#17243B]">
                                {r}
                              </span>
                            )) || <span className="text-[#777781]">None specified</span>}
                          </div>
                        </div>

                        <div>
                          <span className="text-[#777781] block mb-1">Target Industries:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProfile?.targetIndustries?.map((ind, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[#E6E2DC] text-[#292D36]">
                                {ind}
                              </span>
                            )) || <span className="text-[#777781]">None specified</span>}
                          </div>
                        </div>

                        <div>
                          <span className="text-[#777781] block mb-1">Target Geographies:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProfile?.targetGeographies?.map((g, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[#E6E2DC] text-[#292D36]">
                                {g}
                              </span>
                            )) || <span className="text-[#777781]">None specified</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Employment History */}
                  {activeTab === 4 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Employment History ({selectedProfile?.employmentHistory?.length || 0} Positions)
                      </h4>
                      <div className="space-y-3">
                        {selectedProfile?.employmentHistory?.map((job) => (
                          <div key={job.id} className="p-4 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#17243B] text-sm">{job.jobTitle} at {job.company}</span>
                              <span className="font-mono text-[#777781]">{job.startDate} — {job.isCurrent ? 'Present' : job.endDate}</span>
                            </div>
                            <p className="text-[#292D36] leading-relaxed">
                              <strong>Responsibilities:</strong> {job.responsibilities}
                            </p>
                            <p className="text-[#292D36] leading-relaxed">
                              <strong>Key Achievements:</strong> {job.keyAchievements}
                            </p>
                            {job.technologiesUsed && (
                              <p className="text-[11px] text-[#777781]">
                                <strong>Tools:</strong> {job.technologiesUsed}
                              </p>
                            )}
                          </div>
                        )) || <div className="text-xs text-[#777781]">No employment entries recorded.</div>}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Education */}
                  {activeTab === 5 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Academic Credentials
                      </h4>
                      {selectedProfile?.education?.map((edu) => (
                        <div key={edu.id} className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 text-xs">
                          <span className="font-bold text-[#17243B] block">{edu.degree} in {edu.fieldOfStudy}</span>
                          <span className="text-[#777781]">{edu.institution} • Class of {edu.graduationYear}</span>
                        </div>
                      )) || <div className="text-xs text-[#777781]">No academic degrees listed.</div>}
                    </div>
                  )}

                  {/* TAB 6: Certifications */}
                  {activeTab === 6 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Professional Certifications
                      </h4>
                      {selectedProfile?.certifications?.map((c) => (
                        <div key={c.id} className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 text-xs">
                          <span className="font-bold text-[#17243B] block">{c.title}</span>
                          <span className="text-[#777781]">{c.issuingOrganization} ({c.issueDate})</span>
                        </div>
                      )) || <div className="text-xs text-[#777781]">No certifications listed.</div>}
                    </div>
                  )}

                  {/* TAB 7: Skills Matrix */}
                  {activeTab === 7 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Categorized Capabilities
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-2">
                          <span className="font-bold text-[#17243B] block">Technical & Engineering</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile?.skills?.technical?.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#E6E2DC] text-[11px]">
                                {s.name}
                              </span>
                            )) || <span className="text-[#777781]">None</span>}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-2">
                          <span className="font-bold text-[#17243B] block">Functional & Domain</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile?.skills?.functional?.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#E6E2DC] text-[11px]">
                                {s.name}
                              </span>
                            )) || <span className="text-[#777781]">None</span>}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-2">
                          <span className="font-bold text-[#17243B] block">Leadership & Strategy</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile?.skills?.leadership?.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#E6E2DC] text-[11px]">
                                {s.name}
                              </span>
                            )) || <span className="text-[#777781]">None</span>}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 space-y-2">
                          <span className="font-bold text-[#17243B] block">Tools & Platforms</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedProfile?.skills?.toolsAndPlatforms?.map((s, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-white border border-[#E6E2DC] text-[11px]">
                                {s.name}
                              </span>
                            )) || <span className="text-[#777781]">None</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 8: Projects */}
                  {activeTab === 8 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Landmark Projects
                      </h4>
                      {selectedProfile?.projects?.map((proj) => (
                        <div key={proj.id} className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/20 text-xs space-y-1">
                          <span className="font-bold text-[#17243B] block">{proj.title} ({proj.role})</span>
                          <p className="text-[#292D36]">{proj.description}</p>
                          <span className="text-[11px] text-[#8172A8] font-medium block">
                            Impact: {proj.impactMetrics}
                          </span>
                        </div>
                      )) || <div className="text-xs text-[#777781]">No projects listed.</div>}
                    </div>
                  )}

                  {/* TAB 9: Vault Documents */}
                  {activeTab === 9 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Uploaded Resumes & Files
                      </h4>
                      <p className="text-xs text-[#777781]">
                        Files uploaded to the private vault by the client are inspectable here.
                      </p>
                    </div>
                  )}

                  {/* TAB 10: Orders */}
                  {activeTab === 10 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Service Orders
                      </h4>
                      <p className="text-xs text-[#777781]">
                        Check the Service Orders pipeline page to assign staff and advance stages.
                      </p>
                    </div>
                  )}

                  {/* TAB 11: Tasks */}
                  {activeTab === 11 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Staff Task Checklist
                      </h4>
                      <p className="text-xs text-[#777781]">
                        Check the Task Board to assign writer actions for this client.
                      </p>
                    </div>
                  )}

                  {/* TAB 12: Deliverables */}
                  {activeTab === 12 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Deliverables & Draft Versions
                      </h4>
                      <p className="text-xs text-[#777781]">
                        Manage upload files via the Deliverables management section.
                      </p>
                    </div>
                  )}

                  {/* TAB 13: Revisions */}
                  {activeTab === 13 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Revision Requests
                      </h4>
                      <p className="text-xs text-[#777781]">
                        Client revision requests and triage notes.
                      </p>
                    </div>
                  )}

                  {/* TAB 14: Consultant Notes & Clarifications */}
                  {activeTab === 14 && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                          Internal Consultant Notes & Scoping Assessment
                        </h4>
                        <p className="text-xs text-[#777781] mt-0.5">
                          Internal notes regarding client career strengths, ATS narrative alignment, and revision boundaries.
                        </p>
                      </div>

                      <textarea
                        rows={6}
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add strategic consultant observations, targeted keywords, or clarification points..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] bg-[#F7F5F0]/30 focus:border-[#8172A8] focus:outline-none"
                      />

                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{savingNotes ? 'Saving...' : 'Save Notes & Approve'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 15: Billing */}
                  {activeTab === 15 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                        Financial Invoices & Payment Status
                      </h4>
                      <p className="text-xs text-[#777781]">
                        Manage invoices, issue quotations, or record direct bank payments in the Finance section.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#FFFFFF] p-12 rounded-2xl border border-[#E6E2DC] text-center text-xs text-[#777781]">
                Select a client from the directory to inspect their full 360° career dossier.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

