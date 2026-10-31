'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeCrmLeads,
  subscribeCrmFollowUps,
} from '@/lib/firebase/firestore';
import type { CrmLead, CrmFollowUp } from '@/lib/career/types';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function CrmReportsPage() {
  const { adminProfile } = useAdminAuth();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [followUps, setFollowUps] = useState<CrmFollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubLeads = subscribeCrmLeads((data) => {
      setLeads(data);
      setLoading(false);
    });
    const unsubFollowUps = subscribeCrmFollowUps((data) => setFollowUps(data));

    return () => {
      unsubLeads();
      unsubFollowUps();
    };
  }, []);

  // Aggregations
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === 'Won / Ready to Convert').length;
  const lostLeads = leads.filter((l) => l.stage === 'Lost').length;
  const inPipeline = totalLeads - wonLeads - lostLeads;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  // Lead by Source
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.leadSource || 'OTHER';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  // Lead by Service
  const serviceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    const srv = l.serviceInterestedIn || 'Other Services';
    serviceCounts[srv] = (serviceCounts[srv] || 0) + 1;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                CRM Intelligence
              </span>
              <span className="text-[10px] font-semibold bg-[#FAF8FC] text-[#8172A8] px-2 py-0.5 rounded border border-[#E6E2DC]">
                Real-Time Telemetry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Acquisition & Pipeline Analytics
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Analyze multi-channel customer acquisition velocity, conversion efficiency, and source attribution.
            </p>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E6E2DC]">
            <span className="text-[#777781] text-xs font-medium">Total Inbound Leads</span>
            <p className="text-2xl font-bold text-[#17243B] mt-1">{totalLeads}</p>
            <span className="text-[11px] text-emerald-600 font-medium">100% captured</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6E2DC]">
            <span className="text-[#777781] text-xs font-medium">Active In Pipeline</span>
            <p className="text-2xl font-bold text-[#17243B] mt-1">{inPipeline}</p>
            <span className="text-[11px] text-[#8172A8] font-medium">In active negotiation</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6E2DC]">
            <span className="text-[#777781] text-xs font-medium">Converted Deals</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{wonLeads}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Paid client work orders</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6E2DC]">
            <span className="text-[#777781] text-xs font-medium">Funnel Conversion Rate</span>
            <p className="text-2xl font-bold text-[#17243B] mt-1">{conversionRate}%</p>
            <span className="text-[11px] text-emerald-600 font-medium">Lead to client win rate</span>
          </div>
        </div>

        {/* Detailed Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Channel Attribution Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2DC] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#8172A8]" />
                <span>Leads by Acquisition Channel</span>
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(sourceCounts).map(([src, count]) => {
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                return (
                  <div key={src} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-[#17243B]">
                      <span>{src}</span>
                      <span>{count} leads ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#E6E2DC]/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#17243B] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Demand Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2DC] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#8172A8]" />
                <span>Inquiries by Career Service</span>
              </h2>
            </div>

            <div className="space-y-3">
              {Object.entries(serviceCounts).map(([srv, count]) => {
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                return (
                  <div key={srv} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-[#17243B]">
                      <span>{srv}</span>
                      <span>{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-[#E6E2DC]/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8172A8] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

