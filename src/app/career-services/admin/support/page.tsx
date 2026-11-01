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

    // Calculate SLA deadline based on priority
    const hours = ticketPriority === 'CRITICAL' ? 4 : ticketPriority === 'HIGH' ? 12 : 24;
    const deadline = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    const newTicket: SupportTicketRecord = {
      ticketId,
      customerId: selectedCustomerId,
      customerName: client?.name || 'Customer',
      projectId: selectedProjectId || undefined,
      projectName: project?.name,
      subject: ticketSubject.trim(),
      description: ticketDescription.trim(),
      category: ticketCategory,
      priority: ticketPriority,
      assignedStaffId: assignedStaffId || undefined,
      assignedStaffName: staff?.fullName,
      status: 'OPEN',
      responseDeadline: deadline,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await saveSupportTicket(newTicket);
      setShowTicketModal(false);
      setTicketSubject('');
      setTicketDescription('');
    } catch (err: any) {
      alert('Failed to save ticket: ' + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTicketStatus = async (ticket: SupportTicketRecord, status: SupportTicketStatus) => {
    try {
      await saveSupportTicket({
        ...ticket,
        status,
        updatedAt: new Date().toISOString(),
        resolvedAt: status === 'RESOLVED' || status === 'CLOSED' ? new Date().toISOString() : ticket.resolvedAt,
      });
    } catch (err: any) {
      alert('Failed to update ticket: ' + err?.message);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                Post-Delivery Operations
              </span>
              <span className="text-xs text-[#777781] font-medium">SLA Support & Maintenance</span>
            </div>
            <h1 className="text-2xl font-bold text-[#17243B] mt-1 tracking-tight">
              Customer Support & Maintenance Contracts
            </h1>
            <p className="text-xs text-[#777781] mt-0.5 max-w-2xl">
              Manage IT customer issue tickets, SLA resolution deadlines, and annual/monthly maintenance retainer renewals.
            </p>
          </div>

          <button
            onClick={() => setShowTicketModal(true)}
            className="px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#8172A8]" />
            <span>Open Support Ticket</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#E6E2DC] pb-4">
          <button
            onClick={() => setActiveTab('TICKETS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'TICKETS'
                ? 'bg-[#17243B] text-white shadow-sm'
                : 'bg-white text-[#777781] hover:text-[#17243B] border border-[#E6E2DC]'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Support Tickets ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTRACTS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'CONTRACTS'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'bg-white text-[#777781] hover:text-rose-700 border border-[#E6E2DC]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Maintenance Contracts ({contracts.length})</span>
          </button>
        </div>

        {/* Tickets View */}
        {activeTab === 'TICKETS' ? (
          loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#777781]">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6E2DC] p-12 text-center space-y-3">
              <LifeBuoy className="w-10 h-10 text-[#777781]/40 mx-auto" />
              <h3 className="text-sm font-bold text-[#17243B]">No Support Tickets Active</h3>
              <p className="text-xs text-[#777781]">All client projects are operating with 100% uptime.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E6E2DC] overflow-hidden shadow-sm divide-y divide-[#E6E2DC]">
              {tickets.map((t) => (
                <div
                  key={t.ticketId}
                  className="p-4 sm:p-5 hover:bg-[#F7F5F0]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#17243B] text-white">
                        {t.ticketId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          t.priority === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : t.priority === 'HIGH'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                      <span className="text-[11px] font-semibold text-[#777781] uppercase">
                        {t.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#17243B]">{t.subject}</h3>
                    {t.description && (
                      <p className="text-xs text-[#292D36]/80 line-clamp-1">{t.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#777781]">
                      <span className="font-semibold text-[#17243B] flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-[#777781]" />
                        {t.customerName}
                      </span>
                      {t.projectName && <span>Project: {t.projectName}</span>}
                      {t.assignedStaffName && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-[#777781]" />
                          Assigned: {t.assignedStaffName}
                        </span>
                      )}
                      {t.responseDeadline && (
                        <span className="flex items-center gap-1 text-amber-700">
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
                      className="px-3 py-1.5 rounded-xl border border-[#E6E2DC] text-xs font-semibold bg-white text-[#17243B] focus:outline-none focus:border-[#8172A8]"
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
          <div className="bg-white rounded-2xl border border-[#E6E2DC] p-6 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-emerald-600/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#17243B]">Maintenance & Retainer Contracts</h3>
            <p className="text-xs text-[#777781] max-w-md mx-auto">
              Ongoing annual maintenance contracts (AMC), hosting agreements, and monthly retainers generated from accepted proposals.
            </p>
          </div>
        )}

        {/* Modal: Open Support Ticket */}
        {showTicketModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E6E2DC] space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-3">
                <h3 className="text-base font-bold text-[#17243B]">Log Support Ticket</h3>
                <button onClick={() => setShowTicketModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-[#777781]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Customer *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                  >
                    {clients.map((c) => (
                      <option key={c.clientId} value={c.clientId}>
                        {c.name} ({c.mobile})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. SSL Certificate Renewal or Checkout Bug"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value as SupportTicketCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      <option value="BUG_FIX">Bug / Technical Defect</option>
                      <option value="CHANGE_REQUEST">Change Request</option>
                      <option value="SERVICE_REQUEST">Service Request</option>
                      <option value="MAINTENANCE">Scheduled Maintenance</option>
                      <option value="INCIDENT">High Priority Incident</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17243B] mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs font-medium focus:outline-none focus:border-[#8172A8]"
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High (12h SLA)</option>
                      <option value="CRITICAL">Critical (4h SLA)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17243B] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Describe issue reproduction steps or request details..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs focus:outline-none focus:border-[#8172A8]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E6E2DC] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {saving ? 'Logging...' : 'Submit Ticket'}
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
