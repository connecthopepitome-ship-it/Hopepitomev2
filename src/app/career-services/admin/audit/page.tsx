'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { CareerActivityLog } from '@/lib/career/types';
import { History, ShieldCheck, Filter } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<CareerActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'career_activity_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CareerActivityLog));
        setLogs(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching audit logs:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
              Governance & Security
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              Activity History & Audit Trail
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Append-only audit record tracking client profile submissions, document approvals, and staff interventions.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F7F5F0] px-3.5 py-1.5 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#17243B]">
            <ShieldCheck className="w-4 h-4 text-[#8172A8]" />
            <span>Tamper-Resistant Logging</span>
          </div>
        </div>

        {/* Audit Logs List */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)]">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#777781]">
              No audit logs recorded yet. User and staff actions will stream in live.
            </div>
          ) : (
            <div className="divide-y divide-[#E6E2DC]/80 font-mono text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F7F5F0]/30 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#17243B] text-white">
                      {log.action}
                    </span>
                    <span className="font-sans text-[#292D36] font-medium">
                      {log.summary}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#777781]">
                    <span>
                      {log.actorName} ({log.actorRole})
                    </span>
                    <span>•</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
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

