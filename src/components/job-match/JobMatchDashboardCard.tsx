'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BriefcaseBusiness, ArrowRight, Bell } from 'lucide-react';
import { useCareerAuth } from '../career/portal/AuthContext';
import {
  fetchCandidateIntakes,
  fetchJobMatchFeatureEnabled,
  isJobMatchBuildEnabled,
} from '@/lib/job-match/client';

export function JobMatchDashboardCard() {
  const { user, client } = useCareerAuth();
  const [enabled, setEnabled] = useState(isJobMatchBuildEnabled());
  const [unreadCount, setUnreadCount] = useState(0);
  const [intakeCount, setIntakeCount] = useState(0);

  useEffect(() => {
    let active = true;
    fetchJobMatchFeatureEnabled().then((val) => {
      if (active) setEnabled(val);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !client?.id) return;
    let active = true;
    fetchCandidateIntakes(user)
      .then((res) => {
        if (!active) return;
        setUnreadCount(Number(res.unreadNotifications || 0));
        setIntakeCount(Array.isArray(res.intakes) ? res.intakes.length : 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [enabled, client?.id, user]);

  if (!enabled) return null;

  return (
    <div className="bg-white rounded-2xl border-2 border-[#7454F5]/25 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#7454F5]/10 text-[#7454F5] flex items-center justify-center">
            <BriefcaseBusiness className="w-5 h-5" strokeWidth={1.9} />
          </div>
          {unreadCount > 0 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white bg-[#149B75] px-2.5 py-0.5 rounded-full">
              <Bell className="w-3 h-3" />
              New Matches Ready
            </span>
          ) : (
            <span className="text-[10px] font-black uppercase text-[#7454F5] bg-[#7454F5]/10 px-2 py-0.5 rounded-full">
              AI MATCH
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-[#17152F]">AI Job Match</h3>
        <p className="text-xs text-[#71778A] mt-1 leading-relaxed">
          Discover job opportunities matched to your experience, skills and career goals.
        </p>
      </div>

      <div className="pt-4 mt-auto flex flex-col sm:flex-row gap-2">
        <Link
          href="/job-match/intake"
          className="flex-1 min-h-[42px] px-4 rounded-xl text-xs font-bold text-white bg-[#7454F5] hover:bg-[#6342E8] flex items-center justify-center gap-1.5 transition shadow-xs"
        >
          <span>Find Matching Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        {(intakeCount > 0 || unreadCount > 0) && (
          <Link
            href="/job-match/results"
            className="min-h-[42px] px-3.5 rounded-xl text-xs font-bold text-[#7454F5] bg-[#7454F5]/10 hover:bg-[#7454F5]/15 flex items-center justify-center transition whitespace-nowrap"
          >
            View Matches
          </Link>
        )}
      </div>
    </div>
  );
}

