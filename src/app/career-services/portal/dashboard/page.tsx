'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { useCareerAuth } from '@/components/career/portal/AuthContext';
import { subscribeClientOrders, subscribeDocuments } from '@/lib/firebase/firestore';
import type { ServiceOrder, CareerDocument } from '@/lib/career/types';
import {
  FileText,
  Clock3,
  CircleCheck,
  CircleX,
  Plus,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  BriefcaseBusiness,
  FileCheck2,
  ScanSearch,
  FilePenLine,
  UserRound,
  KeyRound,
  ShieldCheck,
  LockKeyhole,
} from 'lucide-react';
import {
  CareerCard,
  CareerBadge,
  CareerButton,
} from '@/components/career/ui/CareerDesignTokens';
import { JobMatchDashboardCard } from '@/components/job-match/JobMatchDashboardCard';

interface CachedAssessment {
  assessmentId: string;
  candidateName: string;
  profession: string;
  overallScore: number;
  timestamp: string;
  fileName: string;
  unlocked?: boolean;
}

export default function ClientDashboardPage() {
  const { client, profile, signOut } = useCareerAuth();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [documents, setDocuments] = useState<CareerDocument[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cachedAssessment, setCachedAssessment] = useState<CachedAssessment | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'assessments' | 'requests' | 'account'>('home');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('hopepitome_last_assessment');
      if (stored) {
        setCachedAssessment(JSON.parse(stored));
      }
    } catch {}

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
        return { label: 'In Drafting', variant: 'primary' as const };
      case 'CLIENT_REVIEW':
        return { label: 'Action: Review Draft', variant: 'warning' as const };
      case 'REVISION':
        return { label: 'Revising', variant: 'secondary' as const };
      case 'FINAL_APPROVED':
      case 'COMPLETED':
        return { label: 'Completed', variant: 'success' as const };
      case 'IN_REVIEW':
        return { label: 'Specialist Scoping', variant: 'neutral' as const };
      default:
        return { label: status.replace('_', ' '), variant: 'neutral' as const };
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-5 sm:space-y-6">
        
        {/* Welcome Header */}
        <CareerCard variant="elevated" padding="md" className="p-5 sm:p-7 bg-white rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#7454F5]">
                Candidate Portal • Workspace
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#17152F] mt-1">
                Welcome back, {client?.fullName || 'Candidate'}
              </h1>
              <p className="text-xs sm:text-sm text-[#71778A] mt-1 max-w-xl leading-relaxed">
                Track your active resume drafting milestones, ATS reports, document vault, and consultant updates.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/career-services/portal/orders/new">
                <CareerButton
                  size="md"
                  variant="primary"
                  icon={<Plus className="w-4 h-4" strokeWidth={1.9} />}
                >
                  Order Service
                </CareerButton>
              </Link>
            </div>
          </div>
        </CareerCard>

        {/* 4 Navigation Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2 no-scrollbar">
          {[
            { id: 'home', label: 'Home & Shortcuts' },
            { id: 'assessments', label: 'My Assessments' },
            { id: 'requests', label: `My Requests (${orders.length})` },
            { id: 'account', label: 'Account Profile' },
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  isSel
                    ? 'border-[#7454F5] text-[#7454F5]'
                    : 'border-transparent text-[#71778A] hover:text-[#17152F]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: HOME & SHORTCUTS */}
        {activeTab === 'home' && (
          <div className="space-y-5">
            {/* Primary Action Cards (App Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {/* Action 1: Scan My Resume */}
              <div className="bg-white rounded-2xl border-2 border-[#7454F5]/30 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center">
                      <ScanSearch className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-[#149B75] bg-[#149B75]/10 px-2 py-0.5 rounded-full">
                      FREE
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#17152F]">Scan My Resume</h3>
                  <p className="text-xs text-[#71778A] mt-1 leading-relaxed">
                    Check your resume quality, ATS compatibility and career opportunities.
                  </p>
                </div>
                <div className="pt-4 mt-auto">
                  <Link
                    href="/career-services#resume-checker"
                    className="w-full min-h-[42px] px-4 rounded-xl text-xs font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <span>Start Free Scan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Action 2: Resume Writing */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#17152F]/5 text-[#17152F] flex items-center justify-center">
                      <FilePenLine className="w-5 h-5" strokeWidth={1.9} />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#7454F5] bg-[#7454F5]/10 px-2 py-0.5 rounded-full">
                      Custom Quote
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#17152F]">Resume Writing</h3>
                  <p className="text-xs text-[#71778A] mt-1 leading-relaxed">
                    Create a professional resume or improve the way your experience is presented.
                  </p>
                </div>
                <div className="pt-4 mt-auto">
                  <Link
                    href="/career-services/resume-writing"
                    className="w-full min-h-[42px] px-4 rounded-xl text-xs font-bold text-[#17152F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#71778A]" />
                  </Link>
                </div>
              </div>

              {/* Additive Action 3: AI Job Match (Feature-flagged) */}
              <JobMatchDashboardCard />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <CareerCard variant="default" padding="sm" className="p-4">
                <span className="text-xs font-bold uppercase text-[#71778A] block">Active Work</span>
                <span className="text-2xl font-black text-[#17152F] mt-1 block">{activeOrders.length}</span>
                <span className="text-[10px] text-[#71778A]">In studio pipeline</span>
              </CareerCard>

              <CareerCard variant="default" padding="sm" className="p-4">
                <span className="text-xs font-bold uppercase text-[#71778A] block">Vault Files</span>
                <span className="text-2xl font-black text-[#17152F] mt-1 block">{documents.length}</span>
                <span className="text-[10px] text-[#71778A]">Resumes & deliverables</span>
              </CareerCard>

              <CareerCard variant="default" padding="sm" className="p-4">
                <span className="text-xs font-bold uppercase text-[#71778A] block">Completed</span>
                <span className="text-2xl font-black text-[#149B75] mt-1 block">{completedOrders.length}</span>
                <span className="text-[10px] text-[#71778A]">Approved deliverables</span>
              </CareerCard>

              <CareerCard variant="default" padding="sm" className="p-4">
                <span className="text-xs font-bold uppercase text-[#71778A] block">ATS Report</span>
                <Link
                  href="/career-services/access-report"
                  className="text-xs font-bold text-[#7454F5] hover:underline mt-1 block"
                >
                  Access with Code →
                </Link>
                <span className="text-[10px] text-[#71778A]">24-Hour Verified</span>
              </CareerCard>
            </div>
          </div>
        )}

        {/* TAB 2: MY ASSESSMENTS */}
        {activeTab === 'assessments' && (
          <div className="space-y-4">
            {cachedAssessment ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7454F5] bg-[#7454F5]/10 px-2.5 py-0.5 rounded-md">
                      Latest Scan Result
                    </span>
                    <h3 className="text-base font-bold text-[#17152F] mt-1">
                      {cachedAssessment.profession}
                    </h3>
                    <p className="text-xs text-[#71778A] font-mono mt-0.5">
                      Ref: {cachedAssessment.assessmentId}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#17152F] to-[#241F47] text-white flex flex-col items-center justify-center">
                      <span className="text-lg font-black leading-none">{cachedAssessment.overallScore}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">Score</span>
                    </div>

                    <Link
                      href="/career-services/access-report"
                      className="px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] flex items-center gap-1 shadow-xs"
                    >
                      <span>Open Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#71778A]">
                  <span>Scan Date: {new Date(cachedAssessment.timestamp).toLocaleDateString()}</span>
                  <span className="font-semibold text-[#149B75]">
                    {cachedAssessment.unlocked ? 'Full Report Unlocked' : 'Free Report Active'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <ScanSearch className="w-8 h-8 text-slate-400 mx-auto mb-2" strokeWidth={1.9} />
                <h3 className="text-sm font-bold text-[#17152F]">No Recorded Assessments</h3>
                <p className="text-xs text-[#71778A] mt-1 max-w-sm mx-auto">
                  Run a free AI resume scan to generate your Career Readiness Score and career recommendations.
                </p>
                <Link
                  href="/career-services#resume-checker"
                  className="mt-4 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7454F5]"
                >
                  Start Free Scan
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY REQUESTS */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <CareerCard variant="default" padding="md" className="p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#17152F]">
                  Service Orders & Custom Quotations ({orders.length})
                </h3>
                <Link
                  href="/career-services/portal/orders/new"
                  className="text-xs font-bold text-[#7454F5] hover:underline"
                >
                  + New Request
                </Link>
              </div>

              {loadingOrders ? (
                <div className="py-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#7454F5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-[#71778A]">No active service requests currently in progress.</p>
                  <Link
                    href="/career-services/resume-writing"
                    className="mt-3 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-[#7454F5] bg-[#7454F5]/10"
                  >
                    Request Resume Writing Quote
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => {
                    const badge = getStatusBadge(ord.status);
                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-[#71778A] font-bold">
                              {ord.orderNumber}
                            </span>
                            <CareerBadge variant={badge.variant} size="sm">
                              {badge.label}
                            </CareerBadge>
                          </div>
                          <h4 className="text-sm font-bold text-[#17152F] mt-1">
                            {ord.serviceType.replace(/_/g, ' ')}
                          </h4>
                          <p className="text-xs text-[#71778A] mt-0.5">
                            Stage: {ord.currentStage || 'Initiation'} • Progress: {ord.progressPercent}%
                          </p>
                        </div>

                        <Link
                          href="/career-services/portal/orders"
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#201D36] bg-slate-100 hover:bg-slate-200 transition text-center"
                        >
                          View Details
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </CareerCard>
          </div>
        )}

        {/* TAB 4: ACCOUNT PROFILE */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            <CareerCard variant="default" padding="md" className="p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#17152F] pb-3 border-b border-slate-100">
                Candidate Account Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#71778A] block">Full Name:</span>
                  <span className="font-bold text-[#17152F] text-sm mt-0.5 block">
                    {client?.fullName || 'Candidate'}
                  </span>
                </div>

                <div>
                  <span className="text-[#71778A] block">Email Address:</span>
                  <span className="font-semibold text-[#17152F] mt-0.5 block">
                    {client?.email || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-[#71778A] block">Candidate ID:</span>
                  <span className="font-mono font-bold text-[#7454F5] mt-0.5 block">
                    {client?.clientCode || 'PROVISIONAL'}
                  </span>
                </div>

                <div>
                  <span className="text-[#71778A] block">Profile Status:</span>
                  <span className="font-semibold text-[#149B75] mt-0.5 block">
                    {profile?.status || 'Active'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-[#71778A]">
                  <ShieldCheck className="w-4 h-4 text-[#149B75]" />
                  <span>Confidential 256-bit encrypted data</span>
                </div>

                <button
                  type="button"
                  onClick={signOut}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition text-center"
                >
                  Sign Out of Candidate Portal
                </button>
              </div>
            </CareerCard>
          </div>
        )}

      </div>
    </PortalLayout>
  );
}
