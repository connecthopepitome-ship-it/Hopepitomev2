'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCareerEnquiries,
  updateCareerEnquiryStatus,
  subscribeClients,
  subscribeProjects,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type {
  CareerEnquiryRecord,
  CareerEnquiryStatus,
  ClientRecord,
  EnterpriseProjectRecord,
  StaffUser,
} from '@/lib/career/types';
import { formatINR } from '@/lib/currency';
import {
  ClipboardList,
  Search,
  Filter,
  CircleCheck,
  Clock3,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  X,
  Phone,
  Mail,
  User,
  Briefcase,
  Layers,
  ArrowRight,
  Check,
  Calendar,
  Globe,
  RefreshCw,
  Eye,
  MessageSquare,
} from 'lucide-react';

const ENQUIRY_STATUSES: { key: string; label: string; badge: string }[] = [
  { key: 'ALL', label: 'All Enquiries', badge: 'bg-slate-100 text-slate-700' },
  { key: 'NEW', label: 'New', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'UNDER_REVIEW', label: 'Under Review', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'AWAITING_CUSTOMER', label: 'Awaiting Customer', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { key: 'APPROVED', label: 'Approved', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'CONVERTED', label: 'Converted to Project', badge: 'bg-teal-50 text-teal-700 border-teal-200' },
  { key: 'REJECTED', label: 'Archived / Rejected', badge: 'bg-rose-50 text-rose-700 border-rose-200' },
];

const SERVICE_FILTER_OPTIONS = [
  'ALL',
  'Professional Resume Writing',
  'ATS Resume Optimisation',
  'LinkedIn Profile Makeover',
  'Personal Portfolio Websites',
  'Managed Job Search & Applications',
];

function CareerEnquiriesContent() {
  const { adminProfile, hasPermission } = useAdminAuth();

  const [enquiries, setEnquiries] = useState<CareerEnquiryRecord[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [projects, setProjects] = useState<EnterpriseProjectRecord[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedService, setSelectedService] = useState<string>('ALL');
  const [hasResumeOnly, setHasResumeOnly] = useState(false);

  // Active Enquiry for Detail Drawer
  const [activeEnquiry, setActiveEnquiry] = useState<CareerEnquiryRecord | null>(null);

  // Approval Modal State
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approving, setApproving] = useState(false);
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [approvalResult, setApprovalResult] = useState<string | null>(null);

  // Subscriptions
  useEffect(() => {
    const unsubEnquiries = subscribeCareerEnquiries((list) => {
      setEnquiries(list);
      setLoading(false);
    });
    const unsubClients = subscribeClients((cl) => setClients(cl));
    const unsubProjects = subscribeProjects((pr) => setProjects(pr));
    const unsubStaff = subscribeStaffUsers((st) => setStaffUsers(st));

    return () => {
      unsubEnquiries();
      unsubClients();
      unsubProjects();
      unsubStaff();
    };
  }, []);

  // Filtered List
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.customerName.toLowerCase().includes(q) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phoneWhatsapp && item.phoneWhatsapp.includes(q)) ||
        item.referenceCode.toLowerCase().includes(q) ||
        (item.customerId && item.customerId.toLowerCase().includes(q));

      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchService =
        selectedService === 'ALL' ||
        item.serviceRequired === selectedService ||
        (item.selectedServices && item.selectedServices.includes(selectedService));
      const matchResume = !hasResumeOnly || item.hasResume;

      return matchSearch && matchStatus && matchService && matchResume;
    });
  }, [enquiries, searchQuery, selectedStatus, selectedService, hasResumeOnly]);

  // Metrics Summary
  const metrics = useMemo(() => {
    const newCount = enquiries.filter((e) => e.status === 'NEW').length;
    const reviewCount = enquiries.filter((e) => e.status === 'UNDER_REVIEW').length;
    const awaitingCount = enquiries.filter((e) => e.status === 'AWAITING_CUSTOMER').length;
    const approvedCount = enquiries.filter((e) => e.status === 'APPROVED').length;
    const convertedCount = enquiries.filter((e) => e.status === 'CONVERTED' || Boolean(e.projectId)).length;
    return { newCount, reviewCount, awaitingCount, approvedCount, convertedCount };
  }, [enquiries]);

  // Handle Quick Status Change
  const handleStatusChange = async (enquiryId: string, newStatus: CareerEnquiryStatus) => {
    try {
      await updateCareerEnquiryStatus(enquiryId, newStatus, `Status updated to ${newStatus} by ${adminProfile?.displayName || 'Admin'}`);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus, updatedAt: new Date().toISOString() } : e))
      );
      if (activeEnquiry && activeEnquiry.id === enquiryId) {
        setActiveEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert('Error updating status: ' + err?.message);
    }
  };

  // Execute Approval
  const handleApproveEnquiry = async () => {
    if (!activeEnquiry) return;
    setApproving(true);
    setApprovalResult(null);

    try {
      const assigned = staffUsers.find((s) => s.uid === assignedStaffId);
      const res = await fetch('/api/career/enquiry/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryId: activeEnquiry.id,
          adminName: adminProfile?.displayName || 'Admin',
          assignedStaffId: assigned?.uid,
          assignedStaffName: assigned?.fullName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to approve enquiry.');
      }

      setApprovalResult(`Enquiry approved! Project ${data.projectId} is now active in Project Hub.`);
      setActiveEnquiry((prev) =>
        prev
          ? {
              ...prev,
              status: 'APPROVED',
              projectId: data.projectId,
              workOrderId: data.workOrderId,
            }
          : null
      );
    } catch (err: any) {
      alert('Approval error: ' + (err?.message || 'Error'));
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="space-y-5 font-['Manrope',sans-serif]">
      {/* Header & Primary Actions */}
      <div className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100 uppercase">
              CAREER SERVICES
            </span>
            <span className="text-xs text-slate-500 font-medium">Customer Intake &amp; Projects</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Career Enquiries Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time consultation requests, resume uploads, and project activations from the Career Studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/career-services/admin/projects"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Open Project Hub</span>
          </Link>
          <Link
            href="/career-services/admin/clients"
            className="px-4 py-2 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer 360</span>
          </Link>
        </div>
      </div>

      {/* Top 5 Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>New Enquiries</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <span className="text-2xl font-bold text-blue-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.newCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Under Review</span>
            <Clock3 className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-purple-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.reviewCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Awaiting Response</span>
            <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.awaitingCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Approved</span>
            <CircleCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.approvedCount}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>In Project Hub</span>
            <Briefcase className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <span className="text-2xl font-bold text-teal-700 font-['Plus_Jakarta_Sans',sans-serif]">
            {metrics.convertedCount}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, reference ID or Customer ID..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#173B8F] text-slate-900"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
            >
              {ENQUIRY_STATUSES.map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
            >
              <option value="ALL">All Services</option>
              {SERVICE_FILTER_OPTIONS.filter((s) => s !== 'ALL').map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>

            <button
              onClick={() => setHasResumeOnly(!hasResumeOnly)}
              className={`px-3 py-2 text-xs rounded-xl border transition flex items-center gap-1.5 ${
                hasResumeOnly
                  ? 'bg-violet-50 border-violet-200 text-violet-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Attached</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Desktop Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading career enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No career enquiries found</p>
            <p className="text-xs text-slate-400">
              {searchQuery || selectedStatus !== 'ALL'
                ? 'Try adjusting your search criteria or status filter.'
                : 'Customer consultation submissions from the Career Studio will appear here automatically.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Reference &amp; Customer</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Requested Services</th>
                    <th className="py-3 px-4 text-center">Resume</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Project Hub</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enq) => {
                    const servicesList = enq.selectedServices || [enq.serviceRequired];
                    const statusObj = ENQUIRY_STATUSES.find((s) => s.key === enq.status) || ENQUIRY_STATUSES[1];

                    return (
                      <tr
                        key={enq.id}
                        onClick={() => setActiveEnquiry(enq)}
                        className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] font-bold text-[#173B8F] block">
                            {enq.referenceCode}
                          </span>
                          <span className="font-semibold text-slate-900 text-xs block">
                            {enq.customerName}
                          </span>
                          {enq.customerId && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              CID: {enq.customerId}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-800 text-xs block">{enq.email}</span>
                          <span className="text-slate-500 text-[11px] font-mono block">
                            {enq.phoneWhatsapp || 'No phone'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {servicesList.map((srv, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {srv}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {enq.hasResume ? (
                            <a
                              href={enq.resumeDownloadUrl || enq.resumeViewUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">None</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {enq.submittedAt ? new Date(enq.submittedAt).toLocaleDateString('en-IN') : '—'}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusObj.badge}`}>
                            {statusObj.label}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {enq.projectId ? (
                            <Link
                              href="/career-services/admin/projects"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:underline"
                            >
                              <Briefcase className="w-3 h-3" />
                              <span>{enq.projectId}</span>
                            </Link>
                          ) : (
                            <span className="text-[10px] text-slate-400">Draft Intake</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEnquiry(enq);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-[#173B8F] hover:bg-slate-100 transition"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View (< lg) */}
            <div className="lg:hidden divide-y divide-slate-100">
              {filteredEnquiries.map((enq) => {
                const servicesList = enq.selectedServices || [enq.serviceRequired];
                const statusObj = ENQUIRY_STATUSES.find((s) => s.key === enq.status) || ENQUIRY_STATUSES[1];

                return (
                  <div
                    key={enq.id}
                    onClick={() => setActiveEnquiry(enq)}
                    className="p-4 space-y-3 active:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#173B8F] block">
                          {enq.referenceCode}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{enq.customerName}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {enq.phoneWhatsapp || enq.email}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusObj.badge}`}>
                        {statusObj.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {servicesList.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500">
                      <span>Submitted: {new Date(enq.submittedAt).toLocaleDateString('en-IN')}</span>
                      {enq.hasResume ? (
                        <span className="inline-flex items-center gap-1 text-violet-700 font-bold text-[10px]">
                          <FileText className="w-3 h-3" />
                          Resume Attached
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">No Resume</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Complete Enquiry Detail Drawer (Side-panel / Modal) */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div>
                <span className="font-mono text-xs font-bold text-[#173B8F] block">
                  {activeEnquiry.referenceCode}
                </span>
                <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  {activeEnquiry.customerName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {activeEnquiry.customerId && (
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Customer ID: {activeEnquiry.customerId}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">
                    Submitted: {new Date(activeEnquiry.submittedAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveEnquiry(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto text-xs">
              {/* Quick Status Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                  <span className="text-xs font-bold text-slate-800">{activeEnquiry.status}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(activeEnquiry.id, 'UNDER_REVIEW')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeEnquiry.id, 'AWAITING_CUSTOMER')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition"
                  >
                    Awaiting
                  </button>
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="px-3 py-1 rounded-lg text-[10px] font-bold bg-[#173B8F] text-white hover:bg-[#132c6b] transition flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Approve
                  </button>
                </div>
              </div>

              {/* 1. Customer Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  1. Customer Contact Dossier
                </h3>
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Full Name</span>
                    <span className="font-semibold text-slate-900">{activeEnquiry.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Email Address</span>
                    <a href={`mailto:${activeEnquiry.email}`} className="text-blue-600 hover:underline">
                      {activeEnquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Phone / WhatsApp</span>
                    <a
                      href={`https://wa.me/${(activeEnquiry.phoneWhatsapp || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{activeEnquiry.phoneWhatsapp || 'Not provided'}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Preferred Contact</span>
                    <span className="font-medium text-slate-800">{activeEnquiry.preferredContactMethod || 'WhatsApp'}</span>
                  </div>
                </div>
              </div>

              {/* 2. Requested Services */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  2. Requested Career Services
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(activeEnquiry.selectedServices || [activeEnquiry.serviceRequired]).map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-800 font-bold text-xs border border-violet-200"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* 3. Career Profile Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  3. Submitted Career Information
                </h3>
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/50 rounded-xl border border-slate-100">
                  {activeEnquiry.currentDesignation && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Current Designation</span>
                      <span className="font-semibold text-slate-900">{activeEnquiry.currentDesignation}</span>
                    </div>
                  )}
                  {activeEnquiry.totalExperience && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Experience</span>
                      <span className="font-semibold text-slate-900">{activeEnquiry.totalExperience} Years</span>
                    </div>
                  )}
                  {activeEnquiry.targetRole && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Role</span>
                      <span className="font-semibold text-slate-900">{activeEnquiry.targetRole}</span>
                    </div>
                  )}
                  {activeEnquiry.targetCountry && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Target Job Market / Country</span>
                      <span className="font-semibold text-slate-900">{activeEnquiry.targetCountry}</span>
                    </div>
                  )}
                  {activeEnquiry.careerStage && (
                    <div>
                      <span className="text-[10px] text-slate-400 block">Career Stage</span>
                      <span className="font-semibold text-slate-900">{activeEnquiry.careerStage}</span>
                    </div>
                  )}
                  {activeEnquiry.linkedinUrl && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-400 block">LinkedIn Profile</span>
                      <a
                        href={activeEnquiry.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{activeEnquiry.linkedinUrl}</span>
                      </a>
                    </div>
                  )}
                </div>

                {activeEnquiry.requirements && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block mb-1">Additional Requirements / Brief</span>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {activeEnquiry.requirements}
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Uploaded Documents */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  4. Secure Uploaded Documents
                </h3>
                {activeEnquiry.hasResume ? (
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block truncate max-w-xs">
                          {activeEnquiry.resumeFileName || 'Original Resume.pdf'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeEnquiry.resumeFileSize ? `${Math.round(activeEnquiry.resumeFileSize / 1024)} KB` : 'PDF Document'} · Category: Original Resume
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeEnquiry.resumeViewUrl && (
                        <a
                          href={activeEnquiry.resumeViewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </a>
                      )}
                      {activeEnquiry.resumeDownloadUrl && (
                        <a
                          href={activeEnquiry.resumeDownloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-center">
                    No resume uploaded with this initial enquiry.
                  </div>
                )}
              </div>

              {/* 5. Project Hub Status */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  5. Project Delivery Hub
                </h3>
                {activeEnquiry.projectId ? (
                  <div className="p-3.5 bg-teal-50/50 rounded-xl border border-teal-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-teal-600 font-bold block uppercase">Linked Project</span>
                      <span className="font-bold text-teal-900">{activeEnquiry.projectId}</span>
                      <p className="text-[11px] text-teal-700 mt-0.5">
                        Visible in Project Management &amp; Execution Hub
                      </p>
                    </div>
                    <Link
                      href="/career-services/admin/projects"
                      className="px-3 py-1.5 bg-teal-700 text-white rounded-lg font-bold text-xs hover:bg-teal-800 transition flex items-center gap-1"
                    >
                      <span>Open in Project Hub</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-700 font-bold block uppercase">Draft Intake Status</span>
                      <p className="text-xs text-amber-900">
                        Registered as draft intake. Approve below to activate work orders and employee tasks.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowApproveModal(true)}
                      className="px-3 py-1.5 bg-[#173B8F] text-white rounded-lg font-bold text-xs hover:bg-[#132c6b] transition shrink-0 shadow-sm"
                    >
                      Approve &amp; Activate
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveEnquiry(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition"
              >
                Close Dossier
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${(activeEnquiry.phoneWhatsapp || '').replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(activeEnquiry.customerName)},%20this%20is%20Hopepitome%20Career%20Services%20regarding%20your%20enquiry%20${encodeURIComponent(activeEnquiry.referenceCode)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Client</span>
                </a>

                {!activeEnquiry.projectId && (
                  <button
                    type="button"
                    onClick={() => setShowApproveModal(true)}
                    className="px-5 py-2 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve &amp; Convert</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval & Conversion Modal */}
      {showApproveModal && activeEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 font-['Manrope',sans-serif]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-['Plus_Jakarta_Sans',sans-serif]">
                  Approve Career Enquiry
                </h3>
                <p className="text-xs text-slate-500">
                  {activeEnquiry.referenceCode} · {activeEnquiry.customerName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalResult(null);
                }}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {approvalResult ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{approvalResult}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowApproveModal(false);
                      setApprovalResult(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#173B8F] text-white text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600 leading-relaxed">
                  Approving this enquiry will activate the project in Project Hub, issue a production Work Order, and assign initial deliverables to your team.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assign Lead Career Strategist (Optional)
                  </label>
                  <select
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                  >
                    <option value="">Unassigned (Queue for Operations)</option>
                    {staffUsers.map((st) => (
                      <option key={st.uid} value={st.uid}>
                        {st.fullName} ({st.roleName || st.departmentId || 'Staff'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={approving}
                    onClick={handleApproveEnquiry}
                    className="px-5 py-2 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                  >
                    {approving ? 'Activating...' : 'Confirm Approval & Activate'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareerEnquiriesPage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Career Enquiries...</div>}>
        <CareerEnquiriesContent />
      </Suspense>
    </AdminLayout>
  );
}

