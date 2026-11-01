'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';
import { AdminHeader } from './AdminHeader';
import { auth } from '@/lib/firebase/config';
import { updatePassword } from 'firebase/auth';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CheckSquare,
  FileBox,
  RotateCcw,
  Receipt,
  History,
  ChevronRight,
  Inbox,
  Kanban,
  PhoneCall,
  Calendar,
  BarChart3,
  Settings,
  UserPlus,
  Shield,
  Building2,
  Activity,
  Lock,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  Layers,
  LifeBuoy,
  MoreHorizontal,
  X,
  FileSpreadsheet,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAuthorized, mustChangePassword, staffProfile, hasPermission, refreshStaffProfile } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Mandatory first-login password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/career-services/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-[#777781] tracking-wide">
            Verifying Staff Authorization...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl border border-[#E6E2DC] shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#17243B]">Access Restricted</h2>
          <p className="text-xs text-[#777781] leading-relaxed">
            Your account ({user.email}) does not have active staff permissions. Please contact your system administrator or log in with corporate credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/career-services/admin/login"
              className="inline-flex px-4 py-2.5 rounded-xl bg-[#17243B] text-white text-xs font-semibold hover:bg-[#292D36]"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle mandatory first login password change
  const handleFirstTimePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (newPassword.length < 12) {
      setPassError('Password must be at least 12 characters long.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setPassError('Password must contain uppercase letters, lowercase letters, and numbers.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }

    setChangingPass(true);
    try {
      if (!auth?.currentUser) throw new Error('Authentication state not found.');
      // 1. Update password in Firebase Auth
      await updatePassword(auth.currentUser, newPassword);

      // 2. Call backend Worker API to clear mustChangePassword and log event
      const res = await fetch('/api/career/admin/employees/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update account security status');
      }

      await refreshStaffProfile();
    } catch (err: any) {
      console.error('Password change error:', err);
      setPassError(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setChangingPass(false);
    }
  };

  // If employee must change password, strictly block access until updated
  if (mustChangePassword) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-[#17243B] flex items-center justify-center text-white mx-auto shadow-sm mb-4">
            <KeyRound className="w-6 h-6 text-[#8172A8]" />
          </div>
          <h2 className="text-center text-xl font-bold tracking-tight text-[#17243B]">
            Mandatory Password Setup
          </h2>
          <p className="mt-1 text-center text-xs text-[#777781] max-w-sm mx-auto">
            Welcome to Hopepitome, {staffProfile?.fullName || 'Colleague'}. Because this is your first sign-in or a temporary password was assigned, please set your new private password before continuing.
          </p>

          <div className="mt-6 bg-[#FFFFFF] py-8 px-6 sm:px-10 rounded-2xl border border-[#E6E2DC] shadow-[0_4px_20px_rgba(23,36,59,0.04)]">
            {passError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleFirstTimePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                  New Private Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 12 characters"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17243B] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#777781]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#E6E2DC] bg-[#F7F5F0]/30 text-xs text-[#17243B] placeholder-[#777781]/60 focus:outline-none focus:border-[#8172A8] focus:ring-1 focus:ring-[#8172A8]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F7F5F0] rounded-xl text-[11px] text-[#777781] space-y-1">
                <p className="font-semibold text-[#17243B]">Password Policy Guidelines:</p>
                <p>• At least 12 characters in length</p>
                <p>• Include uppercase & lowercase letters</p>
                <p>• Include numbers and special symbols (!@#$%^&*)</p>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="w-full py-2.5 px-4 rounded-xl bg-[#17243B] hover:bg-[#292D36] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {changingPass ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Set Password & Enter Workspace</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const [showMobileMore, setShowMobileMore] = useState(false);

  const crmNavItems = [
    { label: 'CRM Overview', href: '/career-services/admin/crm', icon: LayoutDashboard },
    { label: 'Leads Inbox', href: '/career-services/admin/crm/leads', icon: Inbox },
    { label: 'Sales Pipeline (Kanban)', href: '/career-services/admin/crm/pipeline', icon: Kanban },
    { label: 'Commercial Quotations', href: '/career-services/admin/crm/quotations', icon: Receipt },
    { label: 'Follow-ups & Calls', href: '/career-services/admin/crm/follow-ups', icon: PhoneCall },
    { label: 'Consultations', href: '/career-services/admin/crm/consultations', icon: Calendar },
    { label: 'Sales Analytics', href: '/career-services/admin/crm/reports', icon: BarChart3 },
    { label: 'CRM Settings', href: '/career-services/admin/crm/settings', icon: Settings },
  ];

  const deliveryNavItems = [
    { label: 'Project Management & Board', href: '/career-services/admin/projects', icon: Briefcase },
    { label: 'Service Catalogue Engine', href: '/career-services/admin/services', icon: Layers },
    { label: 'Customer 360 Directory', href: '/career-services/admin/clients', icon: Users },
    { label: 'Staff Task Board', href: '/career-services/admin/tasks', icon: CheckSquare },
    { label: 'Deliverables & Vault', href: '/career-services/admin/deliverables', icon: FileBox },
    { label: 'Career Work Orders', href: '/career-services/admin/orders', icon: RotateCcw },
    { label: 'SLA Support & Maintenance', href: '/career-services/admin/support', icon: LifeBuoy },
    { label: 'Finance & Invoicing', href: '/career-services/admin/finance', icon: Receipt },
    { label: 'Audit Trail & Logs', href: '/career-services/admin/audit', icon: History },
  ];

  const empNavItems = [
    { label: 'Employee Dashboard', href: '/career-services/admin/employees', icon: LayoutDashboard },
    { label: 'Employee Directory', href: '/career-services/admin/employees/directory', icon: Users },
    { label: 'Add Employee', href: '/career-services/admin/employees/new', icon: UserPlus },
    { label: 'Roles & Permissions', href: '/career-services/admin/employees/roles', icon: Shield },
    { label: 'Departments', href: '/career-services/admin/employees/departments', icon: Building2 },
    { label: 'Activity Logs', href: '/career-services/admin/employees/activity', icon: Activity },
  ];

  const canManageEmployees = hasPermission('employees', 'view');

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#292D36] flex flex-col font-sans selection:bg-[#8172A8]/20 selection:text-[#17243B]">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6 pb-24 md:pb-8">
        {/* Desktop Sidebar (Hidden on small screens) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-4">
          {/* Service Catalogue & Delivery Group */}
          <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-1">
            <div className="flex items-center justify-between px-3 py-1 mb-0.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-700">
                Delivery & Projects
              </span>
              <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                IT & Multi-Service
              </span>
            </div>
            {deliveryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#17243B] text-white shadow-sm font-semibold'
                      : 'text-[#292D36] hover:bg-[#F7F5F0] hover:text-[#17243B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </Link>
              );
            })}
          </div>

          {/* CRM Navigation Group */}
          <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-1">
            <div className="flex items-center justify-between px-3 py-1 mb-0.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8172A8]">
                CRM & Sales
              </span>
              <span className="text-[9px] font-semibold bg-[#8172A8]/10 text-[#8172A8] px-1.5 py-0.5 rounded">
                Acquisition
              </span>
            </div>
            {crmNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#17243B] text-white shadow-sm font-semibold'
                      : 'text-[#292D36] hover:bg-[#F7F5F0] hover:text-[#17243B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8172A8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </Link>
              );
            })}
          </div>

          {/* Employee Management Navigation Group (Visible if authorized) */}
          {canManageEmployees && (
            <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#E6E2DC] shadow-[0_1px_3px_rgba(23,36,59,0.03)] space-y-1">
              <div className="flex items-center justify-between px-3 py-1 mb-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700">
                  Team & Organization
                </span>
                <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                  Staff & Access
                </span>
              </div>
              {empNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-[#17243B] text-white shadow-sm font-semibold'
                        : 'text-[#292D36] hover:bg-[#F7F5F0] hover:text-[#17243B]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                  </Link>
                );
              })}
            </div>
          )}
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Persistent Mobile Bottom Navigation Bar (< md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E6E2DC] shadow-[0_-2px_10px_rgba(23,36,59,0.06)] px-3 py-1.5 flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link
          href="/career-services/admin/dashboard"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname === '/career-services/admin/dashboard'
              ? 'text-[#17243B] font-bold'
              : 'text-[#777781] hover:text-[#17243B]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Home</span>
        </Link>

        <Link
          href="/career-services/admin/crm/leads"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/crm')
              ? 'text-[#8172A8] font-bold'
              : 'text-[#777781] hover:text-[#17243B]'
          }`}
        >
          <Inbox className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">CRM</span>
        </Link>

        <Link
          href="/career-services/admin/projects"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/projects')
              ? 'text-indigo-600 font-bold'
              : 'text-[#777781] hover:text-[#17243B]'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Projects</span>
        </Link>

        <Link
          href="/career-services/admin/employees/directory"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/employees')
              ? 'text-emerald-700 font-bold'
              : 'text-[#777781] hover:text-[#17243B]'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">Team</span>
        </Link>

        <button
          onClick={() => setShowMobileMore(true)}
          className="flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl text-[#777781] hover:text-[#17243B] transition"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">More</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer / Action Sheet */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 border-t border-[#E6E2DC] shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E6E2DC] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#17243B]">
                Navigation Drawer
              </span>
              <button
                onClick={() => setShowMobileMore(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#777781]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/career-services/admin/services"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Service Catalogue</span>
              </Link>

              <Link
                href="/career-services/admin/crm/quotations"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <Receipt className="w-4 h-4 text-purple-600" />
                <span>Quotations</span>
              </Link>

              <Link
                href="/career-services/admin/support"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <LifeBuoy className="w-4 h-4 text-rose-600" />
                <span>Support & SLAs</span>
              </Link>

              <Link
                href="/career-services/admin/finance"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Finance & Invoices</span>
              </Link>

              <Link
                href="/career-services/admin/tasks"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Task Board</span>
              </Link>

              <Link
                href="/career-services/admin/deliverables"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <FileBox className="w-4 h-4 text-amber-600" />
                <span>Deliverables Vault</span>
              </Link>

              <Link
                href="/career-services/admin/clients"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <Users className="w-4 h-4 text-indigo-700" />
                <span>Customers 360</span>
              </Link>

              <Link
                href="/career-services/admin/crm/settings"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-[#F7F5F0] rounded-xl flex items-center gap-2.5 text-xs font-semibold text-[#17243B]"
              >
                <Settings className="w-4 h-4 text-gray-700" />
                <span>CRM Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
