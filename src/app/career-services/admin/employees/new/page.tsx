'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeStaffDepartments,
  subscribeStaffRoles,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type {
  StaffDepartment,
  StaffRole,
  StaffUser,
  StaffEmploymentType,
} from '@/lib/career/types';
import {
  UserPlus,
  ArrowLeft,
  KeyRound,
  Shield,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Mail,
  User,
  Phone,
  Calendar,
  Briefcase,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function AddEmployeePage() {
  const router = useRouter();
  const { staffProfile } = useAdminAuth();

  const [departments, setDepartments] = useState<StaffDepartment[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);

  // Form State - Section A
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportingManagerId, setReportingManagerId] = useState('');
  const [employmentType, setEmploymentType] = useState<StaffEmploymentType>('Full Time');

  // Form State - Section B
  const [credentialOption, setCredentialOption] = useState<'TEMPORARY_PASSWORD' | 'SETUP_LINK'>('TEMPORARY_PASSWORD');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success Modal (Displayed ONLY ONCE)
  const [createdResult, setCreatedResult] = useState<{
    employeeId: string;
    username: string;
    tempPassword?: string;
    resetLink?: string;
    fullName: string;
    credentialOption: string;
  } | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const unsubDepts = subscribeStaffDepartments((depts) => {
      setDepartments(depts);
      if (depts.length > 0 && !departmentId) {
        setDepartmentId(depts[0].departmentId);
      }
    });

    const unsubRoles = subscribeStaffRoles((r) => {
      setRoles(r);
    });

    const unsubUsers = subscribeStaffUsers((users) => {
      setStaffUsers(users);
    });

    return () => {
      unsubDepts();
      unsubRoles();
      unsubUsers();
    };
  }, []);

  const [roleId, setRoleId] = useState('career_consultant');

  const copyText = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const selectedDept = departments.find((d) => d.departmentId === departmentId);
      const selectedRole = roles.find((r) => r.roleId === roleId);
      const selectedManager = staffUsers.find((u) => u.uid === reportingManagerId);

      const res = await fetch('/api/career/admin/employees/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
          departmentId,
          departmentName: selectedDept?.departmentName || 'Administration',
          designation: designation.trim() || 'Career Specialist',
          joiningDate,
          reportingManagerId,
          reportingManagerName: selectedManager?.fullName || '',
          roleId,
          roleName: selectedRole?.roleName || 'Career Consultant',
          employmentType,
          credentialOption,
          adminName: staffProfile?.fullName || 'Admin',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create employee');
      }

      // Display the single-view credentials modal
      setCreatedResult({
        employeeId: data.employeeId,
        username: data.username,
        tempPassword: data.tempPassword,
        resetLink: data.resetLink,
        fullName: fullName.trim(),
        credentialOption: data.credentialOption,
      });
    } catch (err: any) {
      console.error('Create Employee Error:', err);
      setError(err?.message || 'Error creating employee account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/career-services/admin/employees/directory"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#777781] hover:text-[#17243B] mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Staff Directory</span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-[#17243B]">
            Create Employee Account
          </h1>
          <p className="text-xs text-[#777781] mt-0.5">
            Provision a new staff profile, assign role permissions, and generate initial login credentials.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section A: Employee Information */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6E2DC]">
            <User className="w-4 h-4 text-[#8172A8]" />
            <h2 className="text-sm font-bold text-[#17243B]">Section A — Employee Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jessica Sterling"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Company Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jessica.s@hopepitome.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Mobile Number (Optional)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Designation / Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Career Consultant"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Assigned Role & Permissions <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
              >
                {roles.map((r) => (
                  <option key={r.roleId} value={r.roleId}>
                    {r.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Employment Type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as StaffEmploymentType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                Reporting Manager
              </label>
              <select
                value={reportingManagerId}
                onChange={(e) => setReportingManagerId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
              >
                <option value="">No Direct Manager / Executive</option>
                {staffUsers.map((u) => (
                  <option key={u.uid} value={u.uid}>
                    {u.fullName} ({u.designation || u.roleName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section B: Login Credential Setup */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E6E2DC]">
            <KeyRound className="w-4 h-4 text-[#8172A8]" />
            <h2 className="text-sm font-bold text-[#17243B]">Section B — Login Credential Provisioning</h2>
          </div>

          <p className="text-xs text-[#777781]">
            Select how the initial login credentials should be generated for this employee.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`p-4 rounded-xl border cursor-pointer transition ${
                credentialOption === 'TEMPORARY_PASSWORD'
                  ? 'border-[#17243B] bg-[#17243B]/5 ring-1 ring-[#17243B]'
                  : 'border-[#E6E2DC] hover:bg-[#F7F5F0]'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="credOption"
                  checked={credentialOption === 'TEMPORARY_PASSWORD'}
                  onChange={() => setCredentialOption('TEMPORARY_PASSWORD')}
                  className="mt-0.5 text-[#17243B]"
                />
                <div>
                  <p className="text-xs font-bold text-[#17243B]">Option 1: Generate Temporary Password</p>
                  <p className="text-[11px] text-[#777781] mt-1 leading-relaxed">
                    The backend generates a secure 14-character random password shown once. The employee will be forced to set their own permanent password on first login.
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`p-4 rounded-xl border cursor-pointer transition ${
                credentialOption === 'SETUP_LINK'
                  ? 'border-[#17243B] bg-[#17243B]/5 ring-1 ring-[#17243B]'
                  : 'border-[#E6E2DC] hover:bg-[#F7F5F0]'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="credOption"
                  checked={credentialOption === 'SETUP_LINK'}
                  onChange={() => setCredentialOption('SETUP_LINK')}
                  className="mt-0.5 text-[#17243B]"
                />
                <div>
                  <p className="text-xs font-bold text-[#17243B]">Option 2: Password Setup Link</p>
                  <p className="text-[11px] text-[#777781] mt-1 leading-relaxed">
                    Creates the account in pending activation state and generates an official Firebase setup link you can send directly to the employee.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/career-services/admin/employees/directory"
            className="px-5 py-2.5 rounded-xl border border-[#E6E2DC] text-xs font-semibold text-[#777781] hover:bg-[#FFFFFF]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Create Employee Account</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ONE-TIME CREDENTIAL DISPLAY MODAL */}
      {createdResult && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17243B]">Account Successfully Created</h3>
                <p className="text-xs text-[#777781]">
                  Employee ID: <span className="font-mono font-bold text-[#17243B]">{createdResult.employeeId}</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
              <p className="font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> One-Time Credential Notice
              </p>
              For security compliance, temporary credentials are never stored in plaintext. Copy or share these credentials with the employee now.
            </div>

            {/* Credential Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#777781] mb-1">
                  Employee Username / Email
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0] text-xs font-mono text-[#17243B]">
                  <span>{createdResult.username}</span>
                  <button
                    type="button"
                    onClick={() => copyText(createdResult.username, 'username')}
                    className="p-1 text-[#777781] hover:text-[#17243B]"
                  >
                    {copiedField === 'username' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {createdResult.tempPassword && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#777781] mb-1">
                    Temporary Password (Forced Change on First Sign In)
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-mono font-bold text-emerald-900">
                    <span>{createdResult.tempPassword}</span>
                    <button
                      type="button"
                      onClick={() => copyText(createdResult.tempPassword || '', 'password')}
                      className="p-1 text-emerald-700 hover:text-emerald-950"
                    >
                      {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {createdResult.resetLink && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#777781] mb-1">
                    Password Setup Link
                  </label>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0] text-xs font-mono text-[#17243B] break-all">
                    <span className="line-clamp-2">{createdResult.resetLink}</span>
                    <button
                      type="button"
                      onClick={() => copyText(createdResult.resetLink || '', 'link')}
                      className="p-1 text-[#777781] hover:text-[#17243B] shrink-0 ml-2"
                    >
                      {copiedField === 'link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#777781] mb-1">
                  Employee Login Portal URL
                </label>
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0] text-xs font-mono text-[#17243B]">
                  <span>https://hopepitomev2.connect-hopepitome.workers.dev/career-services/admin/login</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        'https://hopepitomev2.connect-hopepitome.workers.dev/career-services/admin/login',
                        'url'
                      )
                    }
                    className="p-1 text-[#777781] hover:text-[#17243B]"
                  >
                    {copiedField === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreatedResult(null);
                router.push('/career-services/admin/employees/directory');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold text-center transition"
            >
              I Have Securely Saved These Credentials → Return to Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

