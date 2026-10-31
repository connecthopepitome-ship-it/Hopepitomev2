'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeStaffUsers,
  subscribeStaffDepartments,
  subscribeStaffRoles,
} from '@/lib/firebase/firestore';
import type {
  StaffUser,
  StaffDepartment,
  StaffRole,
  StaffAccountStatus,
} from '@/lib/career/types';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  KeyRound,
  UserX,
  UserCheck,
  Edit,
  Eye,
  Shield,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

export default function EmployeeDirectoryPage() {
  const { staffProfile, adminProfile, role, hasPermission } = useAdminAuth();

  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [departments, setDepartments] = useState<StaffDepartment[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');

  // Selected Employee for View / Actions
  const [activeStaff, setActiveStaff] = useState<StaffUser | null>(null);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Edit State
  const [editFullName, setEditFullName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editDeptId, setEditDeptId] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editRoleId, setEditRoleId] = useState('');
  const [editEmpType, setEditEmpType] = useState('Full Time');
  const [savingEdit, setSavingEdit] = useState(false);

  // Reset Password State
  const [resetOption, setResetOption] = useState<'TEMPORARY_PASSWORD' | 'SETUP_LINK'>('TEMPORARY_PASSWORD');
  const [resettingPass, setResettingPass] = useState(false);
  const [resetResult, setResetResult] = useState<{ tempPassword?: string; resetLink?: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Status Change State
  const [statusReason, setStatusReason] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const unsubStaff = subscribeStaffUsers((users) => {
      setStaffList(users);
      setLoading(false);
    });

    const unsubDepts = subscribeStaffDepartments((depts) => {
      setDepartments(depts);
    });

    const unsubRoles = subscribeStaffRoles((r) => {
      setRoles(r);
    });

    return () => {
      unsubStaff();
      unsubDepts();
      unsubRoles();
    };
  }, []);

  // Filtered staff list
  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      s.fullName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.employeeId && s.employeeId.toLowerCase().includes(q)) ||
      (s.designation && s.designation.toLowerCase().includes(q));

    const matchesDept = selectedDept === 'ALL' || s.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || s.accountStatus === selectedStatus;
    const matchesRole = selectedRole === 'ALL' || s.roleId === selectedRole;

    return matchesQuery && matchesDept && matchesStatus && matchesRole;
  });

  const handleOpenEdit = (staff: StaffUser) => {
    setActiveStaff(staff);
    setEditFullName(staff.fullName);
    setEditMobile(staff.mobile || '');
    setEditDeptId(staff.departmentId || '');
    setEditDesignation(staff.designation || '');
    setEditRoleId(staff.roleId || '');
    setEditEmpType(staff.employmentType || 'Full Time');
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStaff) return;
    setSavingEdit(true);

    try {
      const selectedDeptObj = departments.find((d) => d.departmentId === editDeptId);
      const selectedRoleObj = roles.find((r) => r.roleId === editRoleId);

      const res = await fetch('/api/career/admin/employees/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: activeStaff.uid,
          fullName: editFullName,
          mobile: editMobile,
          departmentId: editDeptId,
          departmentName: selectedDeptObj?.departmentName || activeStaff.departmentName,
          designation: editDesignation,
          roleId: editRoleId,
          roleName: selectedRoleObj?.roleName || activeStaff.roleName,
          employmentType: editEmpType,
          adminName: staffProfile?.fullName || 'Admin',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update employee profile');
      }

      setShowEditModal(false);
      alert('Employee profile updated successfully.');
    } catch (err: any) {
      alert(err?.message || 'Error updating employee');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleResetPassword = async () => {
    if (!activeStaff) return;
    setResettingPass(true);
    setResetResult(null);

    try {
      const res = await fetch('/api/career/admin/employees/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: activeStaff.uid,
          email: activeStaff.email,
          option: resetOption,
          adminName: staffProfile?.fullName || 'Admin',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to process password reset');
      }

      setResetResult({
        tempPassword: data.tempPassword,
        resetLink: data.resetLink,
      });
    } catch (err: any) {
      alert(err?.message || 'Error processing reset');
    } finally {
      setResettingPass(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!activeStaff) return;
    setUpdatingStatus(true);

    const isCurrentlyActive = activeStaff.accountStatus === 'ACTIVE';
    const newStatus: StaffAccountStatus = isCurrentlyActive ? 'DEACTIVATED' : 'ACTIVE';

    try {
      const res = await fetch('/api/career/admin/employees/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: activeStaff.uid,
          accountStatus: newStatus,
          adminName: staffProfile?.fullName || 'Admin',
          reason: statusReason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status');
      }

      setShowStatusModal(false);
      setStatusReason('');
      alert(`Account status updated to ${newStatus}.`);
    } catch (err: any) {
      alert(err?.message || 'Error updating status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
              STAFF DIRECTORY
            </span>
            <span className="text-xs text-[#8172A8] font-medium">RBAC Governance</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17243B]">
            All Employees Directory
          </h1>
          <p className="text-xs text-[#777781] mt-0.5">
            Search, inspect, provision credentials, configure roles, and govern active staff accounts.
          </p>
        </div>

        {hasPermission('employees', 'create') && (
          <Link
            href="/career-services/admin/employees/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Create Employee</span>
          </Link>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777781]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees by name, ID (e.g. HP-EMP-00001), email, designation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>

          {/* Account Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_ACTIVATION">Pending Activation</option>
            <option value="DEACTIVATED">Deactivated</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs text-[#17243B] focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            {roles.map((r) => (
              <option key={r.roleId} value={r.roleId}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E2DC] bg-[#F7F5F0]/60 text-[11px] font-semibold text-[#777781] uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Company Email</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2DC]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#777781]">
                    Loading staff directory...
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#777781]">
                    No employees found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr key={staff.uid} className="hover:bg-[#F7F5F0]/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#17243B]">
                      {staff.employeeId || 'HP-EMP-00000'}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#17243B]">
                      {staff.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#777781]">
                      {staff.email}
                    </td>
                    <td className="py-3 px-4 text-[#292D36]">
                      {staff.departmentName || 'Administration'}
                    </td>
                    <td className="py-3 px-4 text-[#777781]">
                      {staff.designation || 'Specialist'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#8172A8]/10 text-[#8172A8]">
                        {staff.roleName || staff.roleId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {staff.accountStatus === 'ACTIVE' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      )}
                      {staff.accountStatus === 'PENDING_ACTIVATION' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Pending Setup
                        </span>
                      )}
                      {staff.accountStatus === 'DEACTIVATED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
                          Deactivated
                        </span>
                      )}
                      {staff.accountStatus === 'SUSPENDED' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-800 border border-red-200">
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveStaff(staff);
                            setShowViewDrawer(true);
                          }}
                          title="View Details"
                          className="p-1.5 rounded-lg border border-[#E6E2DC] text-[#777781] hover:text-[#17243B] hover:bg-[#F7F5F0]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {hasPermission('employees', 'edit') && (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(staff)}
                            title="Edit Employee"
                            className="p-1.5 rounded-lg border border-[#E6E2DC] text-[#777781] hover:text-[#17243B] hover:bg-[#F7F5F0]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {hasPermission('employees', 'manage') && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveStaff(staff);
                              setShowResetModal(true);
                              setResetResult(null);
                            }}
                            title="Reset Credentials"
                            className="p-1.5 rounded-lg border border-[#E6E2DC] text-[#777781] hover:text-[#8172A8] hover:bg-[#F7F5F0]"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {hasPermission('employees', 'manage') && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveStaff(staff);
                              setShowStatusModal(true);
                            }}
                            title={staff.accountStatus === 'ACTIVE' ? 'Deactivate Account' : 'Reactivate Account'}
                            className={`p-1.5 rounded-lg border border-[#E6E2DC] ${
                              staff.accountStatus === 'ACTIVE'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {staff.accountStatus === 'ACTIVE' ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Profile Inspector Slide-Over Drawer */}
      {showViewDrawer && activeStaff && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E6E2DC]">
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6E2DC]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#17243B] text-white flex items-center justify-center font-bold">
                    {activeStaff.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#17243B]">{activeStaff.fullName}</h3>
                    <p className="text-xs text-[#8172A8] font-mono">{activeStaff.employeeId}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowViewDrawer(false)}
                  className="p-2 text-[#777781] hover:text-[#17243B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E6E2DC] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-[#777781] uppercase tracking-wider">Account Status</p>
                  <p className="text-sm font-bold text-[#17243B] mt-0.5">{activeStaff.accountStatus}</p>
                </div>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-white border border-[#E6E2DC]">
                  {activeStaff.employmentType || 'Full Time'}
                </span>
              </div>

              {/* Employee Details Grid */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#17243B] uppercase tracking-wider">Employment Details</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Corporate Email:</span>
                    <span className="font-mono font-medium text-[#17243B]">{activeStaff.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Mobile:</span>
                    <span className="font-mono text-[#17243B]">{activeStaff.mobile || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Department:</span>
                    <span className="font-medium text-[#17243B]">{activeStaff.departmentName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Designation:</span>
                    <span className="font-medium text-[#17243B]">{activeStaff.designation}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Role:</span>
                    <span className="font-semibold text-[#8172A8]">{activeStaff.roleName || activeStaff.roleId}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Joining Date:</span>
                    <span className="text-[#17243B]">{activeStaff.joiningDate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#E6E2DC]/60">
                    <span className="text-[#777781]">Must Change Password:</span>
                    <span className={`font-semibold ${activeStaff.mustChangePassword ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {activeStaff.mustChangePassword ? 'Yes (Pending)' : 'No (Secure)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#E6E2DC] bg-[#F7F5F0]/50 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowViewDrawer(false);
                  handleOpenEdit(activeStaff);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#17243B] text-white text-xs font-semibold text-center"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowViewDrawer(false);
                  setShowResetModal(true);
                }}
                className="py-2.5 px-4 rounded-xl border border-[#E6E2DC] bg-white text-xs font-semibold text-[#17243B]"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && activeStaff && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-[#17243B] mb-1">Edit Employee Profile</h3>
            <p className="text-xs text-[#777781] mb-4">
              Update designation, department, and role for {activeStaff.fullName} ({activeStaff.employeeId}).
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Mobile</label>
                <input
                  type="text"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Department</label>
                <select
                  value={editDeptId}
                  onChange={(e) => setEditDeptId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Assigned Role</label>
                <select
                  value={editRoleId}
                  onChange={(e) => setEditRoleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none"
                >
                  {roles.map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {r.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#E6E2DC] text-xs text-[#777781]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#17243B] text-white text-xs font-semibold disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && activeStaff && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-[#17243B] mb-1">Reset Employee Password</h3>
            <p className="text-xs text-[#777781] mb-4">
              Select credential recovery method for {activeStaff.fullName} ({activeStaff.email}).
            </p>

            {resetResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-800 mb-2">
                    {resetResult.tempPassword ? 'New Temporary Password Generated:' : 'Password Setup Link Generated:'}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 font-mono text-xs text-[#17243B] break-all select-all flex items-center justify-between">
                    <span>{resetResult.tempPassword || resetResult.resetLink}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(resetResult.tempPassword || resetResult.resetLink || '')}
                      className="ml-2 p-1 text-emerald-700 hover:text-emerald-900"
                    >
                      {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-2">
                    {resetResult.tempPassword
                      ? 'The employee will be forced to change this password on their next sign-in.'
                      : 'Share this secure recovery link with the employee to complete password setup.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#17243B] text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-[#E6E2DC] cursor-pointer hover:bg-[#F7F5F0]">
                    <input
                      type="radio"
                      name="resetOption"
                      checked={resetOption === 'TEMPORARY_PASSWORD'}
                      onChange={() => setResetOption('TEMPORARY_PASSWORD')}
                      className="text-[#17243B]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#17243B]">Generate Temporary Password</p>
                      <p className="text-[11px] text-[#777781]">Generate random 14-char key with forced first-login change</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-[#E6E2DC] cursor-pointer hover:bg-[#F7F5F0]">
                    <input
                      type="radio"
                      name="resetOption"
                      checked={resetOption === 'SETUP_LINK'}
                      onChange={() => setResetOption('SETUP_LINK')}
                      className="text-[#17243B]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#17243B]">Password Reset / Setup Link</p>
                      <p className="text-[11px] text-[#777781]">Generate official Firebase recovery link</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 py-2 px-3 rounded-xl border border-[#E6E2DC] text-xs text-[#777781]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={resettingPass}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#17243B] text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {resettingPass ? 'Processing...' : 'Confirm Reset'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deactivate / Reactivate Status Modal */}
      {showStatusModal && activeStaff && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl max-w-sm w-full p-6">
            <h3 className="text-base font-bold text-[#17243B] mb-1">
              {activeStaff.accountStatus === 'ACTIVE' ? 'Deactivate Employee Account' : 'Reactivate Employee Account'}
            </h3>
            <p className="text-xs text-[#777781] mb-4">
              {activeStaff.accountStatus === 'ACTIVE'
                ? `Deactivating ${activeStaff.fullName} (${activeStaff.employeeId}) will immediately revoke their Firebase Auth login and block all API requests.`
                : `Reactivating ${activeStaff.fullName} will restore their access to the employee dashboard.`}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">
                  Reason for Action (Internal Audit)
                </label>
                <textarea
                  rows={2}
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder="e.g. End of contract / Resignation / Account renewal"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#E6E2DC] text-xs text-[#777781]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleToggleStatus}
                  disabled={updatingStatus}
                  className={`flex-1 py-2 px-3 rounded-xl text-white text-xs font-semibold disabled:opacity-50 ${
                    activeStaff.accountStatus === 'ACTIVE'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {updatingStatus
                    ? 'Updating...'
                    : activeStaff.accountStatus === 'ACTIVE'
                    ? 'Confirm Deactivation'
                    : 'Confirm Reactivation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

