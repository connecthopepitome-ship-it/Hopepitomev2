'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import {
  subscribeStaffDepartments,
  saveStaffDepartment,
  subscribeStaffUsers,
} from '@/lib/firebase/firestore';
import type { StaffDepartment, StaffUser } from '@/lib/career/types';
import { DEFAULT_DEPARTMENTS } from '@/lib/career/permissions';
import {
  Building2,
  Plus,
  Users,
  Edit,
  CheckCircle2,
  AlertCircle,
  Shield,
  UserCheck,
} from 'lucide-react';

export default function DepartmentsPage() {
  const { staffProfile, hasPermission } = useAdminAuth();

  const [departments, setDepartments] = useState<StaffDepartment[]>([]);
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<StaffDepartment | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubDepts = subscribeStaffDepartments((depts) => {
      if (depts.length === 0) {
        setDepartments(
          DEFAULT_DEPARTMENTS.map((d) => ({
            ...d,
            createdAt: new Date().toISOString(),
          })) as any
        );
      } else {
        setDepartments(depts);
      }
      setLoading(false);
    });

    const unsubStaff = subscribeStaffUsers((users) => {
      setStaffUsers(users);
    });

    return () => {
      unsubDepts();
      unsubStaff();
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setManagerId('');
    setStatus('ACTIVE');
    setShowModal(true);
  };

  const handleOpenEdit = (dept: StaffDepartment) => {
    setEditingDept(dept);
    setName(dept.departmentName);
    setDescription(dept.description);
    setManagerId(dept.managerId || '');
    setStatus(dept.status || 'ACTIVE');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    try {
      const selectedManager = staffUsers.find((u) => u.uid === managerId);
      const departmentId =
        editingDept?.departmentId || `dept_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      const deptData: StaffDepartment = {
        departmentId,
        departmentName: name.trim(),
        description: description.trim(),
        managerId: managerId || undefined,
        managerName: selectedManager?.fullName,
        status,
        createdAt: editingDept?.createdAt || new Date().toISOString(),
      };

      await saveStaffDepartment(deptData);
      setShowModal(false);
    } catch (err: any) {
      alert(err?.message || 'Error saving department');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
              ORGANIZATION
            </span>
            <span className="text-xs text-[#8172A8] font-medium">Department Hierarchy</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17243B]">
            Department Management
          </h1>
          <p className="text-xs text-[#777781] mt-0.5">
            Manage functional divisions, assign department heads, and monitor staff headcount allocation.
          </p>
        </div>

        {hasPermission('employees', 'manage') && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-[#777781]">
            Loading departments...
          </div>
        ) : (
          departments.map((dept) => {
            const count = staffUsers.filter((s) => s.departmentId === dept.departmentId).length;
            return (
              <div
                key={dept.departmentId}
                className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col justify-between space-y-4 hover:border-[#8172A8]/50 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8172A8]/10 text-[#8172A8]">
                      {dept.departmentId}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        dept.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-red-50 text-red-800'
                      }`}
                    >
                      {dept.status || 'ACTIVE'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#17243B]">{dept.departmentName}</h3>
                  <p className="text-xs text-[#777781] line-clamp-2">{dept.description}</p>
                </div>

                <div className="pt-3 border-t border-[#E6E2DC] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#17243B] font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#8172A8]" />
                    <span>{count} staff {count === 1 ? 'member' : 'members'}</span>
                  </div>

                  {hasPermission('employees', 'manage') && (
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(dept)}
                      className="p-1.5 text-[#777781] hover:text-[#17243B] rounded-lg hover:bg-[#F7F5F0]"
                      title="Edit Department"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-[#17243B] mb-1">
              {editingDept ? 'Edit Department' : 'Add Department'}
            </h3>
            <p className="text-xs text-[#777781] mb-4">
              Configure department naming, description, and supervisory head.
            </p>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quality Assurance & Editorial"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Responsibilities and purpose..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Department Head / Manager</label>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none"
                >
                  <option value="">No Manager Assigned</option>
                  {staffUsers.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.fullName} ({u.designation || u.roleName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#E6E2DC] text-xs text-[#777781]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#17243B] text-white text-xs font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

