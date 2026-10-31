'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Save,
  Users,
  Layers,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function CrmSettingsPage() {
  const { adminProfile, role } = useAdminAuth();
  const [defaultOwner, setDefaultOwner] = useState('Senior Career Consultant');
  const [followUpSlaHours, setFollowUpSlaHours] = useState('2');
  const [notifyOnNewLead, setNotifyOnNewLead] = useState(true);
  const [autoInitDriveFolder, setAutoInitDriveFolder] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_4px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8172A8]">
                CRM Configuration
              </span>
              <span className="text-[10px] font-semibold bg-[#FAF8FC] text-[#8172A8] px-2 py-0.5 rounded border border-[#E6E2DC]">
                System Preferences
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17243B] mt-0.5">
              CRM & Funnel Settings
            </h1>
            <p className="text-xs text-[#777781] mt-1">
              Configure automated lead routing, follow-up SLAs, and conversion preferences.
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>CRM configuration preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Lead Routing & Assignment */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2DC] space-y-4">
            <h2 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8172A8]" />
              <span>Lead Routing & Assignment</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#17243B] mb-1">
                  Default Lead Owner
                </label>
                <input
                  type="text"
                  value={defaultOwner}
                  onChange={(e) => setDefaultOwner(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30"
                />
                <p className="text-[11px] text-[#777781] mt-1">
                  Automatically assigned to website and social media inquiries.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#17243B] mb-1">
                  Inbound Outreach SLA (Hours)
                </label>
                <input
                  type="number"
                  value={followUpSlaHours}
                  onChange={(e) => setFollowUpSlaHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30"
                />
                <p className="text-[11px] text-[#777781] mt-1">
                  Maximum response time before marking first contact as overdue.
                </p>
              </div>
            </div>
          </div>

          {/* Automation & Google Drive Preferences */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6E2DC] space-y-4">
            <h2 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8172A8]" />
              <span>Automation & Integration Preferences</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnNewLead}
                  onChange={(e) => setNotifyOnNewLead(e.target.checked)}
                  className="rounded border-[#E6E2DC] text-[#8172A8] focus:ring-[#8172A8]"
                />
                <div>
                  <span className="font-semibold text-[#17243B] block">In-App Alerts for New Leads</span>
                  <span className="text-[11px] text-[#777781]">Display dashboard notification banner on new website enquiry</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoInitDriveFolder}
                  onChange={(e) => setAutoInitDriveFolder(e.target.checked)}
                  className="rounded border-[#E6E2DC] text-[#8172A8] focus:ring-[#8172A8]"
                />
                <div>
                  <span className="font-semibold text-[#17243B] block">Automatic Google Drive Vault Provisioning</span>
                  <span className="text-[11px] text-[#777781]">
                    Instantly create work order folder hierarchy via Google Apps Script upon lead conversion
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save CRM Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

