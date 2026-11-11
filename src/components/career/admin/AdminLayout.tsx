'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from './AdminAuthContext';
import { AdminHeader } from './AdminHeader';
import { auth } from '@/lib/firebase/config';
import { fetchJobMatchFeatureEnabled, isJobMatchBuildEnabled } from '@/lib/job-match/client';
import { updatePassword } from 'firebase/auth';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  BriefcaseBusiness,
  CheckSquare,
  Files,
  RotateCcw,
  Receipt,
  History,
  ChevronRight,
  UserSearch,
  Kanban,
  PhoneCall,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  UserPlus,
  ShieldCheck,
  Building2,
  Activity,
  LockKeyhole,
  KeyRound,
  CircleX,
  CircleCheck,
  FolderKanban,
  LifeBuoy,
  MoreHorizontal,
  X,
  Search,
  ArrowRight,
  ClipboardList,
  CreditCard,
  Cpu,
  ScanText,
  TriangleAlert,
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
  const [drawerSearch, setDrawerSearch] = useState('');
  const [jobMatchEnabled, setJobMatchEnabled] = useState(isJobMatchBuildEnabled());

  useEffect(() => {
    let active = true;
    fetchJobMatchFeatureEnabled().then((val) => {
      if (active) setJobMatchEnabled(val);
    });
    return () => {
      active = false;
    };
  }, []);

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

  // Close mobile drawers on route change
  useEffect(() => {
    setShowMobileMenu(false);
    setShowMobileMore(false);
    setDrawerSearch('');
  }, [pathname]);

  const canManageEmployees = hasPermission('employees', 'view');
  const canViewJobMatch = jobMatchEnabled && hasPermission('job_match', 'view');

  const careerNavItems = useMemo(() => [
    { label: 'Career Enquiries', href: '/career-services/admin/career-enquiries', icon: ClipboardList, color: 'text-violet-600 bg-violet-50 border-violet-100', badge: 'NEW' },
    { label: 'Scanning Leads', href: '/career-services/admin/scanning-leads', icon: ScanText, color: 'text-amber-600 bg-amber-50 border-amber-100', badge: 'AUTO' },
    { label: 'ATS Resume Audit', href: '/career-services/admin/ats-checker', icon: Cpu, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', badge: 'AI' },
    { label: 'Career Customers', href: '/career-services/admin/clients', icon: UsersRound, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Login Management', href: '/career-services/admin/login-management', icon: KeyRound, color: 'text-indigo-600 bg-indigo-50 border-indigo-100', badge: 'SEC' },
    { label: 'Career Projects', href: '/career-services/admin/projects', icon: FolderKanban, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Career Documents', href: '/career-services/admin/deliverables', icon: Files, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ], []);

  const aiJobMatchNavItems = useMemo(() => [
    { label: 'Intake Queue', href: '/admin/job-match', icon: BriefcaseBusiness, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', badge: 'QUEUE' },
    { label: 'Admin Controls', href: '/admin/job-match?tab=controls', icon: ShieldCheck, color: 'text-violet-600 bg-violet-50 border-violet-100', badge: 'CTRL' },
  ], []);

  const projectDeliveryNavItems = useMemo(() => [
    { label: 'Project Hub', href: '/career-services/admin/projects', icon: FolderKanban, color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { label: 'Work Orders', href: '/career-services/admin/orders', icon: RotateCcw, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    { label: 'Task Board', href: '/career-services/admin/tasks', icon: CheckSquare, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Team Assignments', href: '/career-services/admin/employees/directory', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Service Catalogue', href: '/career-services/admin/services', icon: BriefcaseBusiness, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Support & SLAs', href: '/career-services/admin/support', icon: LifeBuoy, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Audit Trail', href: '/career-services/admin/audit', icon: History, color: 'text-slate-600 bg-slate-50 border-slate-100' },
  ], []);

  const crmNavItems = useMemo(() => [
    { label: 'Scanning Leads', href: '/career-services/admin/scanning-leads', icon: ScanText, color: 'text-amber-600 bg-amber-50 border-amber-100', badge: 'ATS' },
    { label: 'Leads Inbox', href: '/career-services/admin/crm/leads', icon: UserSearch, color: 'text-sky-600 bg-sky-50 border-sky-100' },
    { label: 'Customer Directory', href: '/career-services/admin/clients', icon: UsersRound, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Sales Pipeline', href: '/career-services/admin/crm/pipeline', icon: Kanban, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Quotations', href: '/career-services/admin/crm/quotations', icon: Receipt, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Follow-ups & Calls', href: '/career-services/admin/crm/follow-ups', icon: PhoneCall, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { label: 'Consultations', href: '/career-services/admin/crm/consultations', icon: CalendarDays, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'AI Providers & ATS', href: '/career-services/admin/crm/settings/ai-providers', icon: Cpu, color: 'text-violet-600 bg-violet-50 border-violet-100', badge: 'FREE' },
    { label: 'Sales Reports', href: '/career-services/admin/crm/reports', icon: ChartNoAxesCombined, color: 'text-teal-600 bg-teal-50 border-teal-100' },
  ], []);

  const empNavItems = useMemo(() => [
    { label: 'Staff Overview', href: '/career-services/admin/employees', icon: LayoutDashboard, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'All Employees', href: '/career-services/admin/employees/directory', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Add Employee', href: '/career-services/admin/employees/new', icon: UserPlus, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Roles & RBAC', href: '/career-services/admin/employees/roles', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Departments', href: '/career-services/admin/employees/departments', icon: Building2, color: 'text-teal-600 bg-teal-50 border-teal-100' },
    { label: 'Activity Logs', href: '/career-services/admin/employees/activity', icon: Activity, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ], []);

  // Filtered items for mobile drawer search
  const allNavItems = useMemo(() => [
    ...careerNavItems.map((i) => ({ ...i, category: 'Career Services' })),
    ...(canViewJobMatch ? aiJobMatchNavItems.map((i) => ({ ...i, category: 'AI Job Match' })) : []),
    ...projectDeliveryNavItems.map((i) => ({ ...i, category: 'Project Delivery' })),
    ...crmNavItems.map((i) => ({ ...i, category: 'CRM & Sales' })),
    ...(canManageEmployees ? empNavItems.map((i) => ({ ...i, category: 'Team' })) : []),
  ], [careerNavItems, aiJobMatchNavItems, projectDeliveryNavItems, crmNavItems, empNavItems, canManageEmployees, canViewJobMatch]);

  const searchResults = useMemo(() => {
    if (!drawerSearch.trim()) return null;
    const q = drawerSearch.toLowerCase();
    return allNavItems.filter((item) => item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [drawerSearch, allNavItems]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center font-['Manrope',sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#173B8F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            Authenticating Hopepitome Operations...
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
      <div className="min-h-screen bg-[#F5F7FC] flex items-center justify-center p-4 font-['Manrope',sans-serif]">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto">
            <TriangleAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your account ({user.email}) does not have active staff permissions. Please contact your system administrator or log in with authorized company credentials.
          </p>
          <div className="pt-2">
            <Link
              href="/career-services/admin/login"
              className="inline-flex px-4 py-2.5 rounded-xl bg-[#173B8F] text-white text-xs font-semibold hover:bg-[#132c6b] transition"
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

    if (newPassword.length < 10) {
      setPassError('Password must be at least 10 characters long.');
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
      <div className="min-h-screen bg-[#F5F7FC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Manrope',sans-serif]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-[#173B8F] flex items-center justify-center text-white mx-auto shadow-sm mb-4">
            <KeyRound className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-center text-xl font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
            Mandatory Password Setup
          </h2>
          <p className="mt-1 text-center text-xs text-slate-600 max-w-sm mx-auto">
            Welcome to Hopepitome, {staffProfile?.fullName || 'Colleague'}. Please set your new private password before continuing.
          </p>

          <div className="mt-6 bg-white py-8 px-6 sm:px-10 rounded-2xl border border-slate-200 shadow-sm">
            {passError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700">
                <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleFirstTimePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  New Private Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 10 characters"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#173B8F] focus:ring-1 focus:ring-[#173B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#173B8F] focus:ring-1 focus:ring-[#173B8F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="w-full py-2.5 px-4 rounded-xl bg-[#173B8F] hover:bg-[#132c6b] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {changingPass ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CircleCheck className="w-4 h-4 text-emerald-400" />
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

  const renderNavSection = (
    title: string,
    tag: string,
    items: { label: string; href: string; icon: any; color: string; badge?: string }[]
  ) => (
    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(23,59,143,0.03)] space-y-1">
      <div className="flex items-center justify-between px-2.5 py-1 mb-1">
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
            className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition font-['Manrope',sans-serif] ${
              isActive
                ? 'bg-[#173B8F] text-white shadow-sm font-semibold'
                : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 transition ${
                  isActive ? 'bg-white/20 border-white/30 text-white' : item.color
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{item.label}</span>
            </div>
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#172033] flex flex-col font-['Manrope',sans-serif] selection:bg-blue-100 selection:text-[#173B8F]">
      <AdminHeader
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
        isMobileMenuOpen={showMobileMenu}
      />

      {/* Main Workspace Frame */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1 flex flex-col md:flex-row gap-5 pb-28 md:pb-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-4">
          {renderNavSection('CAREER SERVICES', 'STUDIO', careerNavItems)}
          {canViewJobMatch && renderNavSection('AI JOB MATCH', 'CONTROLS', aiJobMatchNavItems)}
          {renderNavSection('PROJECT DELIVERY', 'EXEC', projectDeliveryNavItems)}
          {renderNavSection('CRM & SALES', 'ACQ', crmNavItems)}
          {canManageEmployees && renderNavSection('TEAM & RBAC', 'STAFF', empNavItems)}

          {/* Quick System Telemetry Card */}
          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm mt-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Cluster
              </span>
              <span className="text-[#173B8F] font-bold">Optimal</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Cloudflare Edge</span>
              <span className="text-emerald-700 font-bold">1ms Latency</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Simplified Searchable Navigation Drawer for Mobile/Tablet (< md) */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-start">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#173B8F] text-white flex items-center justify-center font-bold text-xs shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">
                  HP
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
                    Hopepitome
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Operations Navigator</span>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Input */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={drawerSearch}
                  onChange={(e) => setDrawerSearch(e.target.value)}
                  placeholder="Jump to module..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100/80 border-0 focus:outline-none focus:ring-1 focus:ring-[#173B8F]"
                />
              </div>
            </div>

            {/* Navigation Stream */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {searchResults ? (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Matching Modules ({searchResults.length})
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No matching modules found</div>
                  ) : (
                    searchResults.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                            isActive ? 'bg-[#173B8F] text-white font-semibold' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 ${isActive ? 'bg-white/20 border-white/30 text-white' : item.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span>{item.label}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{item.category}</span>
                        </Link>
                      );
                    })
                  )}
                </div>
              ) : (
                <>
                  {renderNavSection('CAREER SERVICES', 'STUDIO', careerNavItems)}
                  {canViewJobMatch && renderNavSection('AI JOB MATCH', 'CONTROLS', aiJobMatchNavItems)}
                  {renderNavSection('PROJECT DELIVERY', 'EXEC', projectDeliveryNavItems)}
                  {renderNavSection('CRM & SALES', 'ACQ', crmNavItems)}
                  {canManageEmployees && renderNavSection('TEAM', 'STAFF', empNavItems)}
                </>
              )}
            </div>

            {/* User Footer */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#173B8F] text-white flex items-center justify-center text-xs font-bold">
                  {(user?.email || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="text-left truncate max-w-[170px]">
                  <p className="text-xs font-bold text-slate-900 truncate">{staffProfile?.fullName || 'Staff User'}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar (< md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(23,59,143,0.06)] px-3 py-1 flex items-center justify-around pb-[max(0.6rem,env(safe-area-inset-bottom))] font-['Manrope',sans-serif]">
        <Link
          href="/career-services/admin/dashboard"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname === '/career-services/admin/dashboard'
              ? 'text-[#173B8F] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${pathname === '/career-services/admin/dashboard' ? 'bg-blue-50 text-[#173B8F]' : ''}`}>
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">Home</span>
        </Link>

        <Link
          href="/career-services/admin/crm/leads"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/crm')
              ? 'text-[#173B8F] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${pathname.startsWith('/career-services/admin/crm') ? 'bg-sky-50 text-sky-600' : ''}`}>
            <UserSearch className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">CRM</span>
        </Link>

        <Link
          href="/career-services/admin/projects"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/projects')
              ? 'text-[#6558D3] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${pathname.startsWith('/career-services/admin/projects') ? 'bg-violet-50 text-[#6558D3]' : ''}`}>
            <FolderKanban className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">Projects</span>
        </Link>

        <Link
          href="/career-services/admin/employees/directory"
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            pathname.startsWith('/career-services/admin/employees')
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${pathname.startsWith('/career-services/admin/employees') ? 'bg-indigo-50 text-indigo-600' : ''}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">Team</span>
        </Link>

        <button
          onClick={() => setShowMobileMore(true)}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
            showMobileMore ? 'text-[#173B8F] font-bold' : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${showMobileMore ? 'bg-slate-100 text-[#173B8F]' : ''}`}>
            <MoreHorizontal className="w-4 h-4" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">More</span>
        </button>
      </nav>

      {/* Mobile "More" Drawer Action Sheet (< md) */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-5 border-t border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Grab Handle & Header */}
            <div className="flex flex-col items-center gap-1.5 -mt-2 pb-1">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-sm font-bold text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
                  All Modules & Tools
                </span>
                <p className="text-[11px] text-slate-500">Fast access to business operations</p>
              </div>
              <button
                onClick={() => setShowMobileMore(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Group 1: Sales & Commercial */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sales & Commercial
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/career-services/admin/crm/quotations"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Quotations</p>
                    <p className="text-[10px] text-slate-400">Commercial terms</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/finance"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Invoicing</p>
                    <p className="text-[10px] text-slate-400">Ledger & payments</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/crm/pipeline"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Kanban className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Pipeline</p>
                    <p className="text-[10px] text-slate-400">Kanban deals</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/crm/consultations"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Consultations</p>
                    <p className="text-[10px] text-slate-400">Booking calls</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Group 2: Operations & Delivery */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Operations & Delivery
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/career-services/admin/clients"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <UsersRound className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Customers 360</p>
                    <p className="text-[10px] text-slate-400">Directory & dossiers</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/services"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BriefcaseBusiness className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Service Catalog</p>
                    <p className="text-[10px] text-slate-400">Packages & pricing</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/tasks"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Task Board</p>
                    <p className="text-[10px] text-slate-400">Capacity & progress</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/support"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Support & SLAs</p>
                    <p className="text-[10px] text-slate-400">Tickets & uptime</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Group 3: Administration */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Administration & Settings
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/career-services/admin/employees/new"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Add Employee</p>
                    <p className="text-[10px] text-slate-400">Account setup</p>
                  </div>
                </Link>

                <Link
                  href="/career-services/admin/audit"
                  onClick={() => setShowMobileMore(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                    <History className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">Audit Trail</p>
                    <p className="text-[10px] text-slate-400">System event logs</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
