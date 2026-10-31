'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { subscribeClientOrders, subscribeDocuments, subscribeDeliverables } from '@/lib/firebase/firestore';
import type { ServiceOrder, CareerDocument, CareerDeliverable } from '@/lib/career/types';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

export default function ClientDashboardPage() {
  const { client, profile, user } = useCareerAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [documents, setDocuments] = useState<CareerDocument[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!client?.id) return;

    const unsubOrders = subscribeClientOrders(client.id, (orderList) => {
      setOrders(orderList);
      setLoadingOrders(false);
    });

    const unsubDocs = subscribeDocuments(client.id, (docList) => {
      setDocuments(docList);
    });

    return () => {
      unsubOrders();
      unsubDocs();
    };
  }, [client?.id]);

  const activeOrders = orders.filter(
    (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  );
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED');

  const getStatusBadge = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'DRAFTING':
        return { label: 'In Drafting', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'CLIENT_REVIEW':
        return { label: 'Action Required: Review Draft', bg: 'bg-amber-50 text-amber-800 border-amber-200 font-semibold animate-pulse' };
      case 'REVISION':
        return { label: 'Revising', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'FINAL_APPROVED':
      case 'COMPLETED':
        return { label: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'IN_REVIEW':
        return { label: 'Specialist Scoping', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default:
        return { label: status.replace('_', ' '), bg: 'bg-[#F7F5F0] text-[#17243B] border-[#E6E2DC]' };
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Career Client Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Welcome back, {client?.fullName || 'Client'}
            </h1>
            <p className="text-xs text-[#777781] mt-1 max-w-xl">
              Track the live drafting progress of your professional resume, ATS keywords, LinkedIn profile, or portfolio build.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/career-services/portal/orders/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Order New Service</span>
            </Link>
          </div>
        </div>

        {/* Reassuring Profile Status Card */}
        {profile?.status === 'ADDITIONAL_INFO_REQUESTED' ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">
                  Action Requested by Consultant
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  {profile.requestedNotes || 'Our specialist team has requested additional clarification or files.'}
                </p>
              </div>
            </div>
            <Link
              href="/career-services/portal/onboarding"
              className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium shrink-0 transition"
            >
              Respond to Request
            </Link>
          </div>
        ) : profile?.resumeFileName || profile?.status === 'RESUME_RECEIVED' ? (
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Resume Received: {profile.resumeFileName}
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Your existing resume is securely on file. Our team can work directly from your document without requiring you to re-enter employment history.
                </p>
              </div>
            </div>
            <Link
              href="/career-services/portal/onboarding"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shrink-0 transition"
            >
              Manage Resume File
            </Link>
          </div>
        ) : (
          <div className="bg-[#FAF8FC] border border-[#E6E2DC] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#8172A8] shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#17243B]">
                  Share your career information your way
                </h4>
                <p className="text-[11px] text-[#777781] mt-0.5">
                  “You don’t need to have everything ready. Start with what you have, and add the rest whenever you’re ready.”
                </p>
              </div>
            </div>
            <Link
              href="/career-services/portal/onboarding"
              className="px-3.5 py-1.5 rounded-lg bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-medium shrink-0 transition"
            >
              Upload Resume or Fill Form
            </Link>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Active Orders</span>
              <Clock className="w-4 h-4 text-[#8172A8]" />
            </div>
            <div className="text-2xl font-bold text-[#17243B]">
              {activeOrders.length}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              In active studio pipeline
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Career Information</span>
              <FileText className="w-4 h-4 text-[#8172A8]" />
            </div>
            <div className="text-sm font-bold text-[#17243B] truncate">
              {profile?.status === 'RESUME_RECEIVED'
                ? 'Resume Received'
                : profile?.status === 'ADDITIONAL_INFO_REQUESTED'
                ? 'Info Requested'
                : profile?.status === 'APPROVED' || profile?.status === 'READY_FOR_SERVICE'
                ? 'Approved'
                : profile?.status === 'PARTIALLY_COMPLETED' || profile?.status === 'IN_PROGRESS'
                ? 'Partially Saved'
                : 'Not started'}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              {profile?.resumeFileName ? profile.resumeFileName : 'Flexible progress'}
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Completed Works</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#17243B]">
              {completedOrders.length}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              Approved final deliverables
            </span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <div className="flex items-center justify-between text-[#777781] mb-2">
              <span className="text-xs font-medium">Stored Documents</span>
              <Briefcase className="w-4 h-4 text-[#8172A8]" />
            </div>
            <div className="text-2xl font-bold text-[#17243B]">
              {documents.length}
            </div>
            <span className="text-[11px] text-[#777781] mt-0.5 block">
              Resumes, specs & files
            </span>
          </div>
        </div>

        {/* Active Orders Section */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E2DC]/80">
            <div>
              <h2 className="text-base font-bold text-[#17243B]">
                Active Work Orders & Live Progress
              </h2>
              <p className="text-xs text-[#777781]">
                Real-time workflow milestones and assigned specialist updates.
              </p>
            </div>
            <Link
              href="/career-services/portal/orders"
              className="text-xs font-medium text-[#8172A8] hover:text-[#17243B] flex items-center gap-1 transition"
            >
              <span>View all orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-[#F7F5F0] text-[#8172A8] flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#17243B]">
                No active career service orders
              </h3>
              <p className="text-xs text-[#777781] max-w-sm mx-auto mt-1 mb-5">
                Ready to elevate your career presentation? Choose a service to begin with our expert team.
              </p>
              <Link
                href="/career-services/portal/orders/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Select a Career Service</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-[#E6E2DC] hover:border-[#8172A8]/50 bg-[#F7F5F0]/20 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] font-mono font-medium text-[#777781]">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#17243B] mt-1">
                          {order.serviceType.replace(/_/g, ' ')}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/career-services/portal/orders`}
                          className="px-3 py-1.5 rounded-lg border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-xs font-medium text-[#17243B] transition"
                        >
                          View Details & Files
                        </Link>
                      </div>
                    </div>

                    {/* Progress Bar & Stage */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#777781] text-[11px]">
                          Current Stage: <strong className="text-[#17243B]">{order.currentStage || 'Initiation'}</strong>
                        </span>
                        <span className="font-semibold text-xs text-[#17243B]">
                          {order.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E6E2DC] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#8172A8] h-full rounded-full transition-all duration-500"
                          style={{ width: `${order.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#777781] pt-1 border-t border-[#E6E2DC]/60">
                      <span>Package: {order.packageTier}</span>
                      <span>
                        Revisions: {order.revisionsUsed} of {order.revisionAllowance} used
                      </span>
                      <span>Target: {order.targetCompletionDate || 'Under Scoping'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Help & Next Step Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#8172A8]" />
              <span>Next Steps Recommendation</span>
            </h3>
            <p className="text-xs text-[#777781] leading-relaxed mb-4">
              To guarantee your resumes are tailored for ATS algorithmic scoring and executive readability, upload any existing resume files and targeted job vacancy descriptions.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/career-services/portal/documents"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B] transition"
              >
                <span>Upload Documents</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.02)]">
            <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[#8172A8]" />
              <span>Dedicated Consultant Support</span>
            </h3>
            <p className="text-xs text-[#777781] leading-relaxed mb-4">
              Have specific questions about career transition, industry pivots, or document formatting? Communicate directly with our team.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/career-services/portal/messages"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F5F0] hover:bg-[#E6E2DC] text-xs font-medium text-[#17243B] transition"
              >
                <span>Open Consultant Chat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

