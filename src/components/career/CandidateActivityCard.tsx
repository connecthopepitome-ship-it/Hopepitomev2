'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ScanSearch,
  Clock3,
  ArrowRight,
  ShieldCheck,
  CircleCheck,
  FileCheck2,
  UserRound,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useCareerAuth } from './portal/AuthContext';
import { subscribeClientOrders } from '@/lib/firebase/firestore';
import type { ServiceOrder } from '@/lib/career/types';

interface CachedAssessment {
  assessmentId: string;
  candidateName: string;
  profession: string;
  overallScore: number;
  timestamp: string;
  fileName: string;
  unlocked?: boolean;
}

export function CandidateActivityCard() {
  const { user, client } = useCareerAuth();
  const [cachedAssessment, setCachedAssessment] = useState<CachedAssessment | null>(null);
  const [recentOrders, setRecentOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try reading recent assessment from local storage
    try {
      const stored = localStorage.getItem('hopepitome_last_assessment');
      if (stored) {
        setCachedAssessment(JSON.parse(stored));
      }
    } catch {}

    // 2. If logged in, listen to active orders
    if (client?.id) {
      const unsub = subscribeClientOrders(client.id, (orders) => {
        setRecentOrders(orders.slice(0, 3));
        setLoading(false);
      });
      return () => unsub();
    } else {
      setLoading(false);
    }
  }, [client?.id]);

  // If no logged in user and no recent assessment in cache, render a friendly discovery strip
  if (!user && !cachedAssessment) {
    return (
      <section className="py-6 bg-[#F8F7FC] border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center shrink-0">
                <ScanSearch className="w-5 h-5 text-[#7454F5]" strokeWidth={1.9} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17152F]">
                  Already have an Assessment Reference Code or Order?
                </h3>
                <p className="text-xs text-[#71778A]">
                  Access your 24-hour approved report or sign in to your Candidate Workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/career-services/access-report"
                className="px-3 py-2 rounded-xl text-xs font-bold text-[#7454F5] bg-[#7454F5]/10 hover:bg-[#7454F5]/20 transition flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Access Report</span>
              </Link>
              <Link
                href="/career-services/portal/login"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#201D36] bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5"
              >
                <UserRound className="w-3.5 h-3.5 text-[#71778A]" strokeWidth={1.9} />
                <span>Portal Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 bg-[#F8F7FC] border-y border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#149B75]" />
            <h2 className="text-sm sm:text-base font-bold text-[#17152F] tracking-tight">
              My Career Activity
            </h2>
            {client && (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#7454F5]/10 text-[#7454F5]">
                {client.clientCode}
              </span>
            )}
          </div>

          <Link
            href={user ? '/career-services/portal/dashboard' : '/career-services/portal/login'}
            className="text-xs font-bold text-[#7454F5] hover:text-[#6342E8] flex items-center gap-1"
          >
            <span>{user ? 'Candidate Dashboard' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.9} />
          </Link>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          
          {/* Card A: Last Resume Assessment */}
          {cachedAssessment ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7454F5] bg-[#7454F5]/10 px-2 py-0.5 rounded-md">
                    Recent Scan
                  </span>
                  <span className="text-[11px] text-[#71778A] flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5" strokeWidth={1.9} />
                    {new Date(cachedAssessment.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#17152F] truncate">
                      {cachedAssessment.profession}
                    </h3>
                    <p className="text-xs text-[#71778A] truncate mt-0.5 font-mono">
                      Ref: {cachedAssessment.assessmentId}
                    </p>
                  </div>

                  {/* Circular Score Pill */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#17152F] to-[#241F47] text-white flex flex-col items-center justify-center shrink-0">
                    <span className="text-sm font-black leading-none">
                      {cachedAssessment.overallScore}
                    </span>
                    <span className="text-[8px] text-slate-300 font-bold uppercase">Score</span>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#71778A]">Report Status:</span>
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      cachedAssessment.unlocked ? 'text-[#149B75]' : 'text-amber-600'
                    }`}
                  >
                    {cachedAssessment.unlocked ? (
                      <>
                        <CircleCheck className="w-3.5 h-3.5" strokeWidth={1.9} />
                        <span>Premium Unlocked</span>
                      </>
                    ) : (
                      <span>Free Report Available</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 mt-2">
                <a
                  href="#resume-checker"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('resume-checker');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full min-h-[38px] rounded-xl text-xs font-bold text-[#7454F5] bg-[#7454F5]/10 hover:bg-[#7454F5]/20 flex items-center justify-center gap-1 transition"
                >
                  <span>View Assessment Report</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.9} />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 shadow-xs flex flex-col justify-between text-center items-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                <ScanSearch className="w-5 h-5" strokeWidth={1.9} />
              </div>
              <h3 className="text-sm font-bold text-[#17152F]">No Recent Assessments</h3>
              <p className="text-xs text-[#71778A] mt-1 max-w-xs leading-relaxed">
                Check your ATS score and career readiness using our free scanner.
              </p>
              <a
                href="#resume-checker"
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] shadow-xs"
              >
                Scan Resume Free
              </a>
            </div>
          )}

          {/* Card B: Recent Orders & Service Requests */}
          {recentOrders.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#149B75] bg-[#149B75]/10 px-2 py-0.5 rounded-md">
                    Active Requests ({recentOrders.length})
                  </span>
                  <Link
                    href="/career-services/portal/orders"
                    className="text-[11px] font-bold text-[#7454F5]"
                  >
                    View All →
                  </Link>
                </div>

                <div className="space-y-2 mt-2">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-[#17152F] block truncate">
                          {ord.serviceType ? ord.serviceType.replace(/_/g, ' ') : 'Career Service'}
                        </span>
                        <span className="text-[10px] text-[#71778A] font-mono">
                          {ord.orderNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#7454F5]">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-2">
                <Link
                  href="/career-services/portal/dashboard"
                  className="w-full min-h-[38px] rounded-xl text-xs font-bold text-[#201D36] bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1 transition"
                >
                  <span>Open Candidate Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#71778A]" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#17152F] bg-slate-100 px-2 py-0.5 rounded-md">
                    Custom Quotations
                  </span>
                  <span className="text-[11px] text-[#71778A]">Scope Proposals</span>
                </div>

                <h3 className="text-sm font-bold text-[#17152F] mt-1">
                  Professional Resume Writing & Scoping
                </h3>
                <p className="text-xs text-[#71778A] mt-1 leading-relaxed">
                  Submit your details for a tailored resume writing or LinkedIn makeover quote. No fixed packages or automatic charges.
                </p>
              </div>

              <div className="pt-3 mt-2">
                <Link
                  href="/career-services/resume-writing"
                  className="w-full min-h-[38px] rounded-xl text-xs font-bold text-[#17152F] bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1 transition"
                >
                  <span>Request Resume Writing Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71778A]" />
                </Link>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
