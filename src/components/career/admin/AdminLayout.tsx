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
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAuthorized, mustChangePassword, staffProfile, hasPermission, refreshStaffProfile } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Mobile navigation drawer states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileMore, setShowMobileMore] = useState(false);

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

  // Close mobile drawer on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileMore(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-['Manrope',sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00236F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] font-semibold text-slate-500 tracking-wide">
            Verifying Enterprise Authorization...
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
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center p-4 font-['Manrope',sans-serif]">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">Access Restricted</h2>
          <p className="text-[13px] text-slate-600 leading-relaxed">
            Your account ({user.email}) does not have active staff permissions. Please contact your system administrator or log in with corporate credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/career-services/admin/login"
              className="inline-flex px-4 py-2.5 rounded-xl bg-[#00236F] text-white text-[13px] font-semibold hover:bg-[#1e3a8a] transition"
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
      await updatePassword(auth.currentUser, newPassword);

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

  if (mustChangePassword) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Manrope',sans-serif]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-[#00236F] flex items-center justify-center text-white mx-auto shadow-sm mb-4">
            <KeyRound className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-center text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Mandatory Password Setup
          </h2>
          <p className="mt-1 text-center text-[13px] text-slate-600 max-w-sm mx-auto">
            Welcome to Hopepitome, {staffProfile?.fullName || 'Colleague'}. Please set your new private password before continuing.
          </p>

          <div className="mt-6 bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm">
            {passError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-[13px] text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleFirstTimePasswordChange} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
                  New Private Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 12 characters"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-800 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00236F] focus:ring-1 focus:ring-[#00236F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00236F] hover:bg-[#1e3a8a] text-white text-[13px] font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
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

  const deliveryNavItems = [
    { label: 'Project Management & Board', href: '/career-services/admin/projects', icon: Briefcase },
    { label: 'Service Catalogue Engine', href: '/career-services/admin/services', icon: Layers },
    { label: 'Customer 360 Directory', href: '/career-services/admin/clients', icon: Users },
    { label: 'Staff Task Board', href: '/career-services/admin/tasks', icon: CheckSquare },
    { label: 'Deliverables Vault', href: '/career-services/admin/deliverables', icon: FileBox },
    { label: 'Career Work Orders', href: '/career-services/admin/orders', icon: RotateCcw },
    { label: 'SLA Support & Maintenance', href: '/career-services/admin/support', icon: LifeBuoy },
    { label: 'Audit Trail & Logs', href: '/career-services/admin/audit', icon: History },
  ];

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

  const empNavItems = [
    { label: 'Employee Dashboard', href: '/career-services/admin/employees', icon: LayoutDashboard },
    { label: 'Employee Directory', href: '/career-services/admin/employees/directory', icon: Users },
    { label: 'Add Employee', href: '/career-services/admin/employees/new', icon: UserPlus },
    { label: 'Roles & Permissions', href: '/career-services/admin/employees/roles', icon: Shield },
    { label: 'Departments', href: '/career-services/admin/employees/departments', icon: Building2 },
    { label: 'Activity Logs', href: '/career-services/admin/employees/activity', icon: Activity },
  ];

  const canManageEmployees = hasPermission('employees', 'view');

  const renderNavSection = (title: string, tag: string, items: typeof deliveryNavItems) => (
    <div className="bg-white p-3 rounded-xl border border-[#E0E3E5] shadow-sm space-y-1">
      <div className="flex items-center justify-between px-3 py-1 mb-1">
        <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
          {title}
        </span>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
          {tag}
        </span>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition font-['Manrope',sans-serif] ${
              isActive
                ? 'bg-[#1e3a8a] text-white shadow-sm font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </div>
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-slate-800 flex flex-col font-['Manrope',sans-serif] selection:bg-[#dae2fd] selection:text-[#00164e]">
      <AdminHeader
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        isMobileMenuOpen={showMobileMenu}
      />

      {/* Main Workspace Frame */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1 flex flex-col md:flex-row gap-5 pb-28 md:pb-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-4">
          {renderNavSection('DELIVERY & PROJECTS', 'OPS', deliveryNavItems)}
          {renderNavSection('CRM & SALES', 'ACQ', crmNavItems)}
          {canManageEmployees && renderNavSection('TEAM & ORG', 'STAFF', empNavItems)}

          {/* Operational Cluster Diagnostic Card */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white/60 shadow-sm mt-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Enterprise Cluster</span>
              <span className="text-[#00236F] font-bold">92.4%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1e3a8a] h-full rounded-full" style={{ width: '92.4%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Storage: 4.6TB / 5.0TB</span>
              <span className="text-emerald-700 font-bold">Optimal</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Slide-out Navigation Drawer for Mobile/Tablet (< md) */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-start">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#00236F] text-white flex items-center justify-center font-bold text-xs font-['Plus_Jakarta_Sans',sans-serif]">
                  HP
                </div>
                <span className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  Operations Navigation
                </span>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1">
              {renderNavSection('DELIVERY & PROJECTS', 'OPS', deliveryNavItems)}
              {renderNavSection('CRM & SALES', 'ACQ', crmNavItems)}
              {canManageEmployees && renderNavSection('TEAM & ORG', 'STAFF', empNavItems)}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar (< md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,35,111,0.06)] px-3 py-1 flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))] font-['Manrope',sans-serif]">
        <Link
          href="/career-services/admin/dashboard"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname === '/career-services/admin/dashboard'
              ? 'text-[#00236F] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Home</span>
        </Link>

        <Link
          href="/career-services/admin/crm/leads"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/crm')
              ? 'text-[#00236F] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Inbox className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">CRM</span>
        </Link>

        <Link
          href="/career-services/admin/projects"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/projects')
              ? 'text-[#00236F] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Projects</span>
        </Link>

        <Link
          href="/career-services/admin/employees/directory"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/employees')
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Team</span>
        </Link>

        <button
          onClick={() => setShowMobileMore(true)}
          className="flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl text-slate-500 hover:text-slate-900 font-medium transition"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">More</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer Action Sheet */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 border-t border-slate-200 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
                Operations Menu
              </span>
              <button
                onClick={() => setShowMobileMore(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/career-services/admin/services"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 text-[13px] font-semibold text-slate-900 transition"
              >
                <Layers className="w-4 h-4 text-[#00236F]" />
                <span>Service Catalogue</span>
              </Link>

              <Link
                href="/career-services/admin/crm/quotations"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 text-[13px] font-semibold text-slate-900 transition"
              >
                <Receipt className="w-4 h-4 text-purple-600" />
                <span>Quotations</span>
              </Link>

              <Link
                href="/career-services/admin/support"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 text-[13px] font-semibold text-slate-900 transition"
              >
                <LifeBuoy className="w-4 h-4 text-rose-600" />
                <span>Support & SLAs</span>
              </Link>

              <Link
                href="/career-services/admin/tasks"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 text-[13px] font-semibold text-slate-900 transition"
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Staff Task Board</span>
              </Link>

              <Link
                href="/career-services/admin/clients"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 text-[13px] font-semibold text-slate-900 transition"
              >
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Customers 360</span>
              </Link>

              <Link
                href="/career-services/admin/finance"
                onClick={() => setShowMobileMore(false)}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 text-[13px] font-semibold text-slate-900 transition"
              >
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span>Finance & Billing</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
