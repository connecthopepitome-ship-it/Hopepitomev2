'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeStaffUsers,
  subscribeStaffDepartments,
  subscribeStaffActivityLogs,
  subscribeCrmLeads,
  subscribeAllOrders,
} from '@/lib/firebase/firestore';
import type {
  StaffUser,
  StaffDepartment,
  StaffActivityLog,
  CrmLead,
  ServiceOrder,
} from '@/lib/career/types';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Shield,
  Building2,
  UserPlus,
  ArrowRight,
  Briefcase,
  Inbox,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export default function EmployeeDashboardPage() {
  const { staffProfile, adminProfile, role, hasPermission } = useAdminAuth();

  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [departments, setDepartments] = useState<StaffDepartment[]>([]);
  const [activities, setActivities] = useState<StaffActivityLog[]>([]);
  const [assignedLeads, setAssignedLeads] = useState<CrmLead[]>([]);
  const [assignedOrders, setAssignedOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubStaff = subscribeStaffUsers((users) => {
      setStaffList(users);
      setLoading(false);
    });

    const unsubDepts = subscribeStaffDepartments((depts) => {
      setDepartments(depts);
    });

    const unsubLogs = subscribeStaffActivityLogs((logs) => {
      setActivities(logs.slice(0, 10));
    });

    const unsubLeads = subscribeCrmLeads((leads) => {
      if (staffProfile) {
        const myLeads = leads.filter(
          (l) =>
            l.leadOwner === staffProfile.fullName ||
            l.leadOwner === staffProfile.employeeId ||
            l.leadOwner === staffProfile.email
        );
        setAssignedLeads(myLeads);
      }
    });

    const unsubOrders = subscribeAllOrders((orders) => {
      if (staffProfile) {
        const myOrders = orders.filter(
          (o) =>
            (o as any).assignedStaffId === staffProfile.uid ||
            (o as any).assignedStaffName === staffProfile.fullName
        );
        setAssignedOrders(myOrders);
      }
    });

    return () => {
      unsubStaff();
      unsubDepts();
      unsubLogs();
      unsubLeads();
      unsubOrders();
    };
  }, [staffProfile]);

  const totalEmployees = staffList.length;
  const activeEmployees = staffList.filter((s) => s.accountStatus === 'ACTIVE').length;
  const pendingActivation = staffList.filter((s) => s.accountStatus === 'PENDING_ACTIVATION').length;
  const inactiveEmployees = staffList.filter((s) => s.accountStatus === 'DEACTIVATED' || s.accountStatus === 'SUSPENDED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              STAFF GOVERNANCE & ACCESS
            </span>
            <span className="text-xs text-[#8172A8] font-medium">Enterprise Directory</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17243B]">
            Employee Management Workspace
          </h1>
          <p className="text-xs text-[#777781] mt-0.5">
            Create employee accounts, provision login credentials, configure granular permissions, and govern staff assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('employees', 'create') && (
            <Link
              href="/career-services/admin/employees/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Add Employee</span>
            </Link>
          )}
          <Link
            href="/career-services/admin/employees/directory"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#FFFFFF] text-xs font-semibold text-[#17243B] hover:bg-[#F7F5F0] transition"
          >
            <Users className="w-4 h-4 text-[#8172A8]" />
            <span>Staff Directory</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#777781]">Total Employees</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#17243B] mt-2">{loading ? '—' : totalEmployees}</p>
          <p className="text-[11px] text-[#777781] mt-0.5">Across all departments</p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#777781]">Active Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{loading ? '—' : activeEmployees}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Authorized & active</p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#777781]">Pending Password Setup</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{loading ? '—' : pendingActivation}</p>
          <p className="text-[11px] text-[#777781] mt-0.5">Awaiting initial login</p>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#777781]">Deactivated / On Leave</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#777781] mt-2">{loading ? '—' : inactiveEmployees}</p>
          <p className="text-[11px] text-red-600 font-medium mt-0.5">Login access blocked</p>
        </div>
      </div>

      {/* Logged-in Staff Member Identity & My Assignments */}
      {staffProfile && (
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E6E2DC]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#17243B] text-white flex items-center justify-center font-bold text-base shadow-sm">
                {staffProfile.fullName?.substring(0, 2).toUpperCase() || 'HP'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#17243B]">{staffProfile.fullName}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
                    {staffProfile.employeeId}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {staffProfile.accountStatus}
                  </span>
                </div>
                <p className="text-xs text-[#777781] mt-0.5">
                  {staffProfile.designation} • {staffProfile.departmentName} • Role:{' '}
                  <span className="font-semibold text-[#8172A8]">{staffProfile.roleName || staffProfile.roleId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#777781]">
              <span>Company Email:</span>
              <span className="font-mono font-semibold text-[#17243B] bg-[#F7F5F0] px-2.5 py-1 rounded-lg border border-[#E6E2DC]">
                {staffProfile.email}
              </span>
            </div>
          </div>

          {/* Quick My Assignments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div className="p-4 rounded-xl bg-[#F7F5F0]/60 border border-[#E6E2DC] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#777781] font-medium">My Assigned Leads</p>
                <p className="text-xl font-bold text-[#17243B] mt-1">{assignedLeads.length}</p>
              </div>
              <Link
                href="/career-services/admin/crm/leads"
                className="p-2 rounded-lg bg-white border border-[#E6E2DC] text-[#17243B] hover:text-[#8172A8]"
              >
                <Inbox className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F5F0]/60 border border-[#E6E2DC] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#777781] font-medium">My Assigned Work Orders</p>
                <p className="text-xl font-bold text-[#17243B] mt-1">{assignedOrders.length}</p>
              </div>
              <Link
                href="/career-services/admin/orders"
                className="p-2 rounded-lg bg-white border border-[#E6E2DC] text-[#17243B] hover:text-[#8172A8]"
              >
                <Briefcase className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F5F0]/60 border border-[#E6E2DC] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#777781] font-medium">Access Permissions</p>
                <p className="text-xs font-semibold text-emerald-700 mt-1">Verified & Active</p>
              </div>
              <Link
                href="/career-services/admin/employees/roles"
                className="p-2 rounded-lg bg-white border border-[#E6E2DC] text-[#17243B] hover:text-[#8172A8]"
              >
                <Shield className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Split Section: Department Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Overview */}
        <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#8172A8]" />
              <span>Departments</span>
            </h3>
            <Link
              href="/career-services/admin/employees/departments"
              className="text-[11px] font-semibold text-[#8172A8] hover:text-[#17243B]"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2.5">
            {departments.slice(0, 6).map((dept) => {
              const count = staffList.filter((s) => s.departmentId === dept.departmentId).length;
              return (
                <div
                  key={dept.departmentId}
                  className="p-3 rounded-xl bg-[#F7F5F0]/50 border border-[#E6E2DC] flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#17243B]">{dept.departmentName}</p>
                    <p className="text-[10px] text-[#777781] line-clamp-1">{dept.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FFFFFF] border border-[#E6E2DC] text-[#17243B]">
                    {count} {count === 1 ? 'staff' : 'staff'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit & Activity Stream */}
        <div className="lg:col-span-2 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#17243B] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8172A8]" />
              <span>Recent Employee Audit & Security Activity</span>
            </h3>
            <Link
              href="/career-services/admin/employees/activity"
              className="text-[11px] font-semibold text-[#8172A8] hover:text-[#17243B]"
            >
              Full log
            </Link>
          </div>

          {activities.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#777781]">
              No employee administration activities logged yet.
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#17243B] text-white">
                        {act.activityType}
                      </span>
                      {act.employeeId && (
                        <span className="text-[10px] font-mono text-[#8172A8]">{act.employeeId}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#17243B] font-medium">{act.description}</p>
                  </div>
                  <span className="text-[10px] text-[#777781] shrink-0 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

