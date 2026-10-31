'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCrmLeads,
  subscribeCrmFollowUps,
  subscribeCrmConsultations,
} from '@/lib/firebase/firestore';
import type { CrmLead, CrmFollowUp, CrmConsultation } from '@/lib/career/types';
import {
  Users,
  Clock,
  PhoneCall,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Inbox,
  Kanban,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function CrmDashboardPage() {
  const { adminProfile, role } = useAdminAuth();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>([]);
  const [consultations, setConsultations] = useState<CrmConsultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubLeads = subscribeCrmLeads((data) => {
      setLeads(data);
      setLoading(false);
    });
    const unsubFollowUps = subscribeCrmFollowUps((data) => setFollowUps(data));
    const unsubConsultations = subscribeCrmConsultations((data) => setConsultations(data));

    return () => {
      unsubLeads();
      unsubFollowUps();
      unsubConsultations();
    };
  }, []);

  // Metrics calculation
  const todayStr = new Date().toISOString().split('T')[0];

  const newLeadsCount = leads.filter((l) => l.stage === 'New Lead').length;
  const wonCount = leads.filter((l) => l.stage === 'Won / Ready to Convert').length;
  const conversionRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0;

  const dueTodayFollowUps = followUps.filter(
    (f) => f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && f.dueDate === todayStr
  );
  const overdueFollowUps = followUps.filter(
    (f) => f.status !== 'COMPLETED' && f.status !== 'CANCELLED' && f.dueDate < todayStr
  );
  const scheduledConsultations = consultations.filter((c) => c.status === 'SCHEDULED');

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                CRM & Sales Center
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Live Pipeline
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Customer Relationship Management
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              End-to-end customer acquisition, sales funnel tracking, and timely follow-up coordination.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/career-services/admin/crm/leads?action=new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Lead</span>
            </Link>
            <Link
              href="/career-services/admin/crm/pipeline"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] hover:bg-[#F7F5F0] text-[#17243B] text-xs font-semibold transition"
            >
              <Kanban className="w-4 h-4 text-[#8172A8]" />
              <span>Visual Pipeline</span>
            </Link>
          </div>
        </div>

        {/* Action Required Alert Banner if overdue or due today */}
        {(overdueFollowUps.length > 0 || dueTodayFollowUps.length > 0) && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xs font-bold text-amber-900">
                  Follow-ups Needing Attention: {overdueFollowUps.length} Overdue, {dueTodayFollowUps.length} Due Today
                </h2>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Timely communication directly impacts deal conversion. Review your pending call and message tasks.
                </p>
              </div>
            </div>
            <Link
              href="/career-services/admin/crm/follow-ups"
              className="shrink-0 text-xs font-semibold text-amber-900 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
            >
              View Follow-ups →
            </Link>
          </div>
        )}

        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
            <div className="flex items-center justify-between text-[#777781] text-xs font-medium">
              <span>Total Inquiries</span>
              <Users className="w-4 h-4 text-[#8172A8]" />
            </div>
            <p className="text-2xl font-bold text-[#17243B] mt-2">{leads.length}</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
              <span>{newLeadsCount} awaiting first contact</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
            <div className="flex items-center justify-between text-[#777781] text-xs font-medium">
              <span>Due Today Follow-ups</span>
              <PhoneCall className="w-4 h-4 text-[#8172A8]" />
            </div>
            <p className="text-2xl font-bold text-[#17243B] mt-2">{dueTodayFollowUps.length}</p>
            <div className="flex items-center gap-1 text-[11px] text-[#777781] mt-1 font-medium">
              <span>{overdueFollowUps.length} overdue</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
            <div className="flex items-center justify-between text-[#777781] text-xs font-medium">
              <span>Consultations</span>
              <Calendar className="w-4 h-4 text-[#8172A8]" />
            </div>
            <p className="text-2xl font-bold text-[#17243B] mt-2">{scheduledConsultations.length}</p>
            <div className="flex items-center gap-1 text-[11px] text-[#8172A8] mt-1 font-medium">
              <span>Scheduled meetings</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
            <div className="flex items-center justify-between text-[#777781] text-xs font-medium">
              <span>Conversion Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-[#17243B] mt-2">{conversionRate}%</p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-medium">
              <span>{wonCount} converted clients</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/career-services/admin/crm/leads"
            className="p-5 rounded-2xl bg-white border border-[#E6E2DC] hover:border-[#8172A8] transition shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FC] text-[#8172A8] flex items-center justify-center mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-[#17243B] group-hover:text-[#8172A8] transition flex items-center justify-between">
              <span>Leads Inbox</span>
              <ArrowRight className="w-4 h-4 text-[#777781] group-hover:translate-x-1 transition" />
            </h2>
            <p className="text-xs text-[#777781] mt-1">
              Filter by new inquiries, priority, service interest, and assign owners.
            </p>
          </Link>

          <Link
            href="/career-services/admin/crm/pipeline"
            className="p-5 rounded-2xl bg-white border border-[#E6E2DC] hover:border-[#8172A8] transition shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FC] text-[#8172A8] flex items-center justify-center mb-3">
              <Kanban className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-[#17243B] group-hover:text-[#8172A8] transition flex items-center justify-between">
              <span>Sales Pipeline</span>
              <ArrowRight className="w-4 h-4 text-[#777781] group-hover:translate-x-1 transition" />
            </h2>
            <p className="text-xs text-[#777781] mt-1">
              Visual 12-stage Kanban pipeline tracking prospects to conversion.
            </p>
          </Link>

          <Link
            href="/career-services/admin/crm/follow-ups"
            className="p-5 rounded-2xl bg-white border border-[#E6E2DC] hover:border-[#8172A8] transition shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FC] text-[#8172A8] flex items-center justify-center mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-[#17243B] group-hover:text-[#8172A8] transition flex items-center justify-between">
              <span>Follow-ups Center</span>
              <ArrowRight className="w-4 h-4 text-[#777781] group-hover:translate-x-1 transition" />
            </h2>
            <p className="text-xs text-[#777781] mt-1">
              Call, WhatsApp, and email queue with outcome tracking.
            </p>
          </Link>
        </div>

        {/* Recent Inquiries & Conversion Pipeline Preview */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#17243B]">Recent Website Inquiries & Leads</h2>
              <p className="text-xs text-[#777781]">Live incoming customer briefs from website and direct channels</p>
            </div>
            <Link
              href="/career-services/admin/crm/leads"
              className="text-xs font-semibold text-[#8172A8] hover:text-[#17243B] transition"
            >
              View All ({leads.length}) →
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#777781]">
              No leads registered yet. Submit an enquiry from the website or click "Create New Lead".
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]/70">
              {leads.slice(0, 6).map((lead) => (
                <div key={lead.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#17243B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {lead.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#17243B]">{lead.fullName}</span>
                        <span className="text-[10px] font-mono text-[#8172A8]">{lead.id}</span>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF8FC] text-[#8172A8] border border-[#E6E2DC]">
                          {lead.stage}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#777781] mt-0.5">
                        {lead.serviceInterestedIn} • Source: {lead.leadSource} • Mobile: {lead.mobile || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {lead.mobile && (
                      <a
                        href={`https://wa.me/${lead.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.fullName)},%20thank%20you%20for%20contacting%20Hopepitome%20Career%20Services.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E6E2DC] text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {lead.mobile && (
                      <a
                        href={`tel:${lead.mobile}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E6E2DC] text-[11px] font-medium text-[#17243B] bg-white hover:bg-[#F7F5F0] transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    )}
                    <Link
                      href={`/career-services/admin/crm/leads?leadId=${lead.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#17243B] text-white text-[11px] font-semibold hover:bg-[#292D36] transition shadow-sm"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

