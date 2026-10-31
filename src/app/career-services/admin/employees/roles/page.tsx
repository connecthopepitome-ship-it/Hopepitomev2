'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';
import { subscribeStaffRoles, saveStaffRole } from '@/lib/firebase/firestore';
import type { StaffRole, StaffPermissionModule, StaffPermissionAction } from '@/lib/career/types';
import {
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  DEFAULT_STAFF_ROLES,
} from '@/lib/career/permissions';
import {
  Shield,
  Plus,
  Check,
  X,
  Lock,
  Layers,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function RolesPermissionsPage() {
  const { staffProfile, role, hasPermission } = useAdminAuth();

  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('super_admin');
  const [loading, setLoading] = useState(true);

  // New Role Modal
  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [creatingRole, setCreatingRole] = useState(false);

  useEffect(() => {
    const unsub = subscribeStaffRoles((data) => {
      if (data.length === 0) {
        // Fallback to default roles if Firestore not seeded yet
        setRoles(DEFAULT_STAFF_ROLES as any);
      } else {
        setRoles(data);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const activeRole = roles.find((r) => r.roleId === selectedRoleId) || roles[0];

  const handleCreateCustomRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    setCreatingRole(true);

    try {
      const generatedId = `custom_${newRoleName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const now = new Date().toISOString();

      const newRole: StaffRole = {
        roleId: generatedId,
        roleName: newRoleName.trim(),
        description: newRoleDesc.trim() || 'Custom organizational staff role',
        isSystemRole: false,
        permissions: {
          dashboard: ['view'],
        },
        createdAt: now,
        updatedAt: now,
        createdBy: staffProfile?.fullName || 'Super Admin',
      };

      await saveStaffRole(newRole);
      setShowNewRoleModal(false);
      setNewRoleName('');
      setNewRoleDesc('');
      setSelectedRoleId(generatedId);
      alert(`Custom role "${newRole.roleName}" created successfully.`);
    } catch (err: any) {
      alert(err?.message || 'Error creating role');
    } finally {
      setCreatingRole(false);
    }
  };

  const hasAction = (module: StaffPermissionModule, action: StaffPermissionAction): boolean => {
    if (!activeRole?.permissions) return false;
    const actions = activeRole.permissions[module];
    if (!actions || !Array.isArray(actions)) return false;
    return actions.includes(action) || actions.includes('manage');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#17243B] text-white">
              ACCESS CONTROL
            </span>
            <span className="text-xs text-[#8172A8] font-medium">Granular RBAC Matrix</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#17243B]">
            Roles & Permissions Governance
          </h1>
          <p className="text-xs text-[#777781] mt-0.5">
            Audit system roles and module-level permission enforcement across the entire Hopepitome platform.
          </p>
        </div>

        {hasPermission('employees', 'manage') && (
          <button
            type="button"
            onClick={() => setShowNewRoleModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36] transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Create Custom Role</span>
          </button>
        )}
      </div>

      {/* Role Selector & Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Role Navigation Sidebar */}
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#777781] px-2 mb-2">
            Configured Roles ({roles.length})
          </p>

          <div className="space-y-1">
            {roles.map((r) => {
              const isSelected = r.roleId === selectedRoleId;
              return (
                <button
                  key={r.roleId}
                  type="button"
                  onClick={() => setSelectedRoleId(r.roleId)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#17243B] text-white shadow-sm'
                      : 'text-[#292D36] hover:bg-[#F7F5F0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-[#8172A8]'}`} />
                    <span className="font-semibold">{r.roleName}</span>
                  </div>
                  {r.isSystemRole && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F7F5F0] text-[#777781]'
                      }`}
                    >
                      System
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Matrix View for Active Role */}
        <div className="lg:col-span-3 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-6">
          {activeRole && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E6E2DC]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#17243B]">{activeRole.roleName}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#8172A8]/10 text-[#8172A8]">
                      {activeRole.roleId}
                    </span>
                  </div>
                  <p className="text-xs text-[#777781] mt-1">{activeRole.description}</p>
                </div>
              </div>

              {/* Permission Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E6E2DC] bg-[#F7F5F0]/60 text-[11px] font-semibold text-[#777781] uppercase tracking-wider">
                      <th className="py-3 px-3">Module</th>
                      {PERMISSION_ACTIONS.map((action) => (
                        <th key={action.id} className="py-3 px-2 text-center">
                          {action.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E2DC]">
                    {PERMISSION_MODULES.map((mod) => (
                      <tr key={mod.id} className="hover:bg-[#F7F5F0]/40 transition">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-[#17243B]">{mod.label}</p>
                          <p className="text-[10px] text-[#777781]">{mod.description}</p>
                        </td>
                        {PERMISSION_ACTIONS.map((action) => {
                          const permitted = hasAction(mod.id, action.id);
                          return (
                            <td key={action.id} className="py-3 px-2 text-center">
                              {permitted ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800">
                                  <Check className="w-3 h-3 stroke-[2.5]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[#E6E2DC]">
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Custom Role Modal */}
      {showNewRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E6E2DC] shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-[#17243B] mb-1">Create Custom Staff Role</h3>
            <p className="text-xs text-[#777781] mb-4">
              Add a custom role with defined responsibilities for tailored administrative workflows.
            </p>

            <form onSubmit={handleCreateCustomRole} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Senior Talent Scout"
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#17243B] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Briefly describe what this role is authorized to perform..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E2DC] text-xs text-[#17243B] focus:outline-none focus:border-[#8172A8]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRoleModal(false)}
                  className="flex-1 py-2 px-3 rounded-xl border border-[#E6E2DC] text-xs text-[#777781]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRole}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#17243B] text-white text-xs font-semibold disabled:opacity-50"
                >
                  {creatingRole ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

