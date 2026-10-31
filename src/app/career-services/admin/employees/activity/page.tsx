'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeStaffActivityLogs,
  subscribeStaffLoginLogs,
} from '@/lib/firebase/firestore';
import type { StaffActivityLog, StaffLoginLog } from '@/lib/career/types';
import {
  Activity,
  History,
  ShieldCheck,
  UserX,
  UserCheck,
  KeyRound,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  LogIn,
  LogOut,
} from 'lucide-react';

export default function EmployeeActivityLogsPage() {
  const { hasPermission } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'ACTIVITIES' | 'LOGINS'>('ACTIVITIES');
  const [activityLogs, setActivityLogs] = useState<StaffActivityLog[]>([]);
  const [loginLogs, setLoginLogs] = useState<StaffLoginLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubActivities = subscribeStaffActivityLogs((logs) => {
      setActivityLogs(logs);
      setLoading(false);
    });

    const unsubLogins = subscribeStaffLoginLogs((logins) => {
      setLoginLogs(logins);
    });

    return () => {
      unsubActivities();
      unsubLogins();
    };
  }, []);

  const filteredActivities = activityLogs.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      a.description.toLowerCase().includes(q) ||
      a.activityType.toLowerCase().includes(q) ||
      (a.employeeName && a.employeeName.toLowerCase().includes(q)) ||
      (a.employeeId && a.employeeId.toLowerCase().includes(q))
    );
  });

  const filteredLogins = loginLogs.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      l.email.toLowerCase().includes(q) ||
      l.eventType.toLowerCase().includes(q) ||
      (l.employeeId && l.employeeId.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
              SECURITY AUDIT
            </span>
            <span className="text-xs text-[#8172A8] font-medium">Compliance Logging</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17243B]">
            Staff Activity & Authentication Logs
          </h1>
          <p className="text-xs text-[#777781] mt-0.5">
            Immutable audit record of staff provisioning, credential changes, account status events, and session history.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#F7F5F0] p-1 border border-[#E6E2DC] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVITIES')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'ACTIVITIES'
                ? 'bg-[#17243B] text-white shadow-xs'
                : 'text-[#777781] hover:text-[#17243B]'
            }`}
          >
            Staff Activities ({activityLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOGINS')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'LOGINS'
                ? 'bg-[#17243B] text-white shadow-xs'
                : 'text-[#777781] hover:text-[#17243B]'
            }`}
          >
            Authentication History ({loginLogs.length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777781]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter logs by employee name, ID, email, or action type..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
        />
      </div>

      {/* Main Stream Area */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
        {activeTab === 'ACTIVITIES' ? (
          <div>
            {filteredActivities.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#777781]">
                No staff activity logs recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E6E2DC]">
                {filteredActivities.map((act) => (
                  <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
                          {act.activityType}
                        </span>
                        {act.employeeId && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8172A8]/10 text-[#8172A8]">
                            {act.employeeId}
                          </span>
                        )}
                        {act.employeeName && (
                          <span className="text-xs font-semibold text-[#17243B]">{act.employeeName}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#292D36]">{act.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-mono font-medium text-[#17243B]">
                        {new Date(act.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-[#777781] font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredLogins.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#777781]">
                No authentication events recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#E6E2DC]">
                {filteredLogins.map((log) => (
                  <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          log.result === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {log.eventType === 'LOGOUT' ? (
                          <LogOut className="w-4 h-4" />
                        ) : log.result === 'SUCCESS' ? (
                          <LogIn className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#17243B]">{log.email}</span>
                          {log.employeeId && (
                            <span className="text-[10px] font-mono text-[#8172A8]">({log.employeeId})</span>
                          )}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              log.result === 'SUCCESS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.eventType}
                          </span>
                        </div>
                        {log.failureReason && (
                          <p className="text-[11px] text-red-600 font-medium">{log.failureReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-mono font-medium text-[#17243B]">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-[#777781] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

