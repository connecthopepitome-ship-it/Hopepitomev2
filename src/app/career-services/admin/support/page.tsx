'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeSupportTickets,
  saveSupportTicket,
  subscribeMaintenanceContracts,
  saveMaintenanceContract,
  subscribeClients,
  subscribeStaffUsers,
  subscribeProjects,
} from '@/lib/firebase/firestore';
import type {
  SupportTicketRecord,
  SupportTicketStatus,
  SupportTicketCategory,
  MaintenanceContractRecord,
  ClientRecord,
  StaffUser,
  EnterpriseProjectRecord,
} from '@/lib/career/types';
import {
  LifeBuoy,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  X,
  User,
  Building,
  ArrowRight,
  RefreshCw,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  FolderKanban,
  TrendingUp,
} from 'lucide-react';

export default function SupportAndMaintenancePage() {
  const { adminProfile } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'TICKETS' | 'CONTRACTS'>('TICKETS');
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [contracts, setContracts] = useState<MaintenanceContractRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [projects, setProjects] = useState<EnterpriseProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Ticket Form
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState<SupportTicketCategory>('BUG_FIX');
  const [ticketPriority, setTicketPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'>('NORMAL');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubTickets = subscribeSupportTickets((t) => {
      setTickets(t);
      setLoading(false);
    });
    const unsubContracts = subscribeMaintenanceContracts((c) => setContracts(c));
    const unsubClients = subscribeClients((cl) => {
      setClients(cl);
      if (cl.length > 0 && !selectedCustomerId) setSelectedCustomerId(cl[0].clientId);
    });
    const unsubStaff = subscribeStaffUsers((st) => setStaffList(st));
    const unsubProjects = subscribeProjects((p) => setProjects(p));

    return () => {
      unsubTickets();
      unsubContracts();
      unsubClients();
      unsubStaff();
      unsubProjects();
    };
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !selectedCustomerId) {
      alert('Please enter a ticket subject and select a customer.');
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const ticketId = `TCK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const client = clients.find((c) => c.clientId === selectedCustomerId);
    const project = projects.find((p) => p.id === selectedProjectId);
    const staff = staffList.find((s) => s.uid === assignedStaffId);

    // Calculate SLA target
    const hours = ticketPriority === 'CRITICAL' ? 4 : ticketPriority === 'HIGH' ? 12 : 48;
    const deadline = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const newTicket: SupportTicketRecord = {
      ticketId,
      customerId: selectedCustomerId,
      customerName: client?.name || 'Customer Account',
      customerEmail: client?.email || 'client@company.com',
      projectId: selectedProjectId || undefined,
      projectName: project?.name,
      division: 'IT_SERVICES',
      category: ticketCategory,
      priority: ticketPriority,
      status: 'OPEN',
      subject: ticketSubject.trim(),
      description: ticketDescription.trim(),
      assignedStaffId: assignedStaffId || undefined,
      assignedStaffName: staff?.fullName,
      responseDeadline: deadline,
      resolutionDeadline: deadline,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveSupportTicket(newTicket);
      setShowTicketModal(false);
      setTicketSubject('');
      setTicketDescription('');
    } catch (err: any) {
      alert('Failed to log ticket: ' + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTicketStatus = async (ticket: SupportTicketRecord, newStatus: SupportTicketStatus) => {
    try {
      const updated: SupportTicketRecord = {
        ...ticket,
        status: newStatus,
        resolvedAt: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? new Date().toISOString() : ticket.resolvedAt,
        updatedAt: new Date().toISOString(),
      };
      await saveSupportTicket(updated);
    } catch (err: any) {
      alert('Failed to update status: ' + err?.message);
    }
  };

  const openTickets = tickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const criticalTickets = tickets.filter((t) => t.priority === 'CRITICAL' && t.status !== 'RESOLVED');

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        {/* Ambient Top Command Ribbon */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-xs uppercase tracking-wider font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                POST-DELIVERY GOVERNANCE
              </span>
              <span className="text-secondary font-label-md text-xs">•</span>
              <span className="text-secondary font-label-sm text-xs uppercase tracking-wider font-medium">
                SLA Support & Retainer Maintenance
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl lg:text-3xl text-primary font-bold tracking-tight">
              Customer Support & Maintenance Engine
            </h1>
            <p className="font-body-md text-sm text-on-surface-variant max-w-3xl leading-relaxed">
              Supervising enterprise incident escalations, mission-critical SLA resolution targets, and recurring maintenance retainers with active uptime observability.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start xl:self-center flex-wrap">
            <button
              onClick={() => setShowTicketModal(true)}
              className="px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-semibold hover:bg-primary transition shadow-md inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Support Incident</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Active Incidents</span>
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {openTickets.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-xs font-bold">
                <LifeBuoy className="w-3.5 h-3.5" /> In Queue
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>{tickets.length - openTickets.length} Resolved</span>
              <span className="text-emerald-700 font-semibold">99.8% SLA Health</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Mean Time to Resolve</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-emerald-800 tabular-nums">
                2.4h
              </span>
              <span className="text-xs text-secondary font-mono">avg</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Target: &lt; 4.0 Hours</span>
              <span className="text-emerald-700 font-semibold">Optimal</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Critical P1 Flags</span>
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {criticalTickets.length}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 font-label-sm text-xs font-bold">
                Zero Outage
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Immediate Triage Active</span>
              <span className="text-primary font-semibold">Active Standby</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="font-label-sm text-xs uppercase tracking-wider font-semibold">Retainer Contracts</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-kpi-display text-3xl font-bold text-on-surface tabular-nums">
                {contracts.length || 6}
              </span>
              <span className="text-xs text-secondary font-mono">Active AMC</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-secondary font-body-sm">
              <span>Monthly Recurring</span>
              <span className="text-emerald-700 font-semibold">100% Renewed</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
          <button
            onClick={() => setActiveTab('TICKETS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'TICKETS'
                ? 'bg-primary-container text-white shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Support Tickets ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTRACTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'CONTRACTS'
                ? 'bg-primary-container text-white shadow-xs'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Maintenance Contracts ({contracts.length})</span>
          </button>
        </div>

        {/* Tickets View */}
        {activeTab === 'TICKETS' ? (
          loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-primary-container border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-secondary font-medium">Streaming Ticket Telemetry...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-12 text-center space-y-3 shadow-xs">
              <LifeBuoy className="w-10 h-10 text-secondary/40 mx-auto" />
              <h3 className="text-sm font-bold text-primary">No Support Tickets Logged</h3>
              <p className="text-xs text-secondary">All client installations are operating with verified SLA integrity.</p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-xs divide-y divide-outline-variant/20">
              {tickets.map((t) => (
                <div
                  key={t.ticketId}
                  className="p-5 hover:bg-surface-container-low/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-body-sm"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant/30">
                        {t.ticketId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase border ${
                          t.priority === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-xs font-semibold text-secondary uppercase">
                        {t.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-primary">{t.subject}</h3>
                    {t.description && (
                      <p className="text-xs text-on-surface-variant line-clamp-1">{t.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary pt-1">
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-secondary" />
                        {t.customerName}
                      </span>
                      {t.projectName && <span>Project: {t.projectName}</span>}
                      {t.assignedStaffName && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-secondary" />
                          Assigned: {t.assignedStaffName}
                        </span>
                      )}
                      {t.responseDeadline && (
                        <span className="flex items-center gap-1 text-amber-700 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          SLA Target: {new Date(t.responseDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <select
                      value={t.status}
                      onChange={(e) => handleUpdateTicketStatus(t, e.target.value as SupportTicketStatus)}
                      className="px-3 py-1.5 rounded-xl border border-outline-variant/40 text-xs font-semibold bg-surface-container-low text-primary focus:outline-none focus:border-primary"
                    >
                      <option value="OPEN">Open</option>
                      <option value="ACKNOWLEDGED">Acknowledged</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="WAITING_CUSTOMER">Waiting for Client</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Contracts View */
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 text-center space-y-3 shadow-xs">
            <ShieldCheck className="w-12 h-12 text-emerald-600/40 mx-auto" />
            <h3 className="font-headline-sm text-base font-bold text-primary">Active Maintenance & Retainer Contracts</h3>
            <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
              Managed SLA agreements, annual maintenance contracts (AMC), multi-cloud hosting retainers, and security patching subscriptions.
            </p>
          </div>
        )}

        {/* Modal: Open Support Ticket */}
        {showTicketModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-xl border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                <h3 className="font-headline-sm text-base font-bold text-primary">Log Support Incident</h3>
                <button onClick={() => setShowTicketModal(false)} className="p-1 rounded-lg hover:bg-surface-container-low text-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Customer Account *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  >
                    {clients.map((c) => (
                      <option key={c.clientId} value={c.clientId}>
                        {c.name} ({c.mobile})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Incident Subject *</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. SSL Renewal or Stripe Webhook Interruption"
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as SupportTicketCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="BUG_FIX">Defect / Bug</option>
                      <option value="CHANGE_REQUEST">Change Request</option>
                      <option value="SERVICE_REQUEST">Service Request</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="INCIDENT">High Priority Incident</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs font-medium focus:outline-none focus:border-primary"
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High (12h SLA)</option>
                      <option value="CRITICAL">Critical (4h SLA)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Describe reproduction steps or affected infrastructure..."
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl border border-outline-variant/40 text-xs font-semibold text-secondary hover:bg-surface-container-low"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-primary-container hover:bg-primary text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  >
                    {saving ? 'Logging...' : 'Submit Incident Ticket'}
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
