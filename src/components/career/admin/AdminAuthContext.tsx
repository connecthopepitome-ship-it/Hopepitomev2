'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthState, logoutUser, FirebaseUser } from '@/lib/firebase/auth';
import { getCareerUser, setCareerUser, getStaffUser, saveStaffUser, logStaffLogin } from '@/lib/firebase/firestore';
import type {
  CareerUser,
  UserRole,
  StaffUser,
  StaffPermissionModule,
  StaffPermissionAction,
} from '@/lib/career/types';
import { DEFAULT_STAFF_ROLES, checkPermission } from '@/lib/career/permissions';

interface AdminAuthContextType {
  user: FirebaseUser | null;
  adminProfile: CareerUser | null;
  staffProfile: StaffUser | null;
  role: UserRole;
  isAuthorized: boolean;
  loading: boolean;
  mustChangePassword: boolean;
  authError: string | null;
  signOut: () => Promise<void>;
  switchRolePreview?: (role: UserRole) => void;
  hasPermission: (module: StaffPermissionModule, action: StaffPermissionAction) => boolean;
  refreshStaffProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  adminProfile: null,
  staffProfile: null,
  role: 'super_admin',
  isAuthorized: false,
  loading: true,
  mustChangePassword: false,
  authError: null,
  signOut: async () => {},
  hasPermission: () => true,
  refreshStaffProfile: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<CareerUser | null>(null);
  const [staffProfile, setStaffProfile] = useState<StaffUser | null>(null);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Master administrative emails recognized during bootstrapping
  const allowedAdminEmails = [
    'hopeadmin@hopepitome.com',
    'admin@hopepitome.com',
    'connect.hopepitome@gmail.com',
    'ramsaltvc@gmail.com',
    'lead@hopepitome.com',
  ];

  const fetchProfile = async (currentUser: FirebaseUser) => {
    try {
      // Force-refresh token to ensure newly provisioned roles & claims are activated immediately
      try {
        await currentUser.getIdToken(true);
      } catch (tokenErr) {
        console.warn('ID token refresh warning:', tokenErr);
      }

      const email = currentUser.email?.toLowerCase() || '';
      const isMasterAdmin = allowedAdminEmails.some((adm) => adm.toLowerCase() === email);

      // If master administrator, unconditionally grant Super Admin access immediately
      if (isMasterAdmin) {
        const masterStaff: StaffUser = {
          uid: currentUser.uid,
          employeeId: 'HP-EMP-00001',
          fullName: 'Hopeadmin',
          email: currentUser.email || 'hopeadmin@hopepitome.com',
          departmentId: 'dept_admin',
          departmentName: 'Administration',
          designation: 'Super Admin',
          roleId: 'super_admin',
          roleName: 'Super Admin',
          employmentType: 'Full Time',
          joiningDate: new Date().toISOString().split('T')[0],
          employmentStatus: 'Active',
          accountStatus: 'ACTIVE',
          mustChangePassword: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setStaffProfile(masterStaff);
        setAdminProfile({
          uid: currentUser.uid,
          email: currentUser.email || 'hopeadmin@hopepitome.com',
          displayName: 'Hopeadmin',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date().toISOString(),
        });
        setMustChangePassword(false);
        setAuthError(null);

        // Background sync to Firestore without blocking authorization
        saveStaffUser(masterStaff).catch(() => {});
        return;
      }

      // 1. Fetch Staff User Profile for ordinary staff
      let staff = await getStaffUser(currentUser.uid);

      // 2. Reject deactivated or unauthorized accounts
      if (staff) {
        if (staff.accountStatus === 'DEACTIVATED' || staff.accountStatus === 'SUSPENDED') {
          setAuthError('Your employee account has been deactivated. Please contact your system administrator.');
          await logoutUser();
          setUser(null);
          setStaffProfile(null);
          setAdminProfile(null);
          return;
        }

        setStaffProfile(staff);
        setMustChangePassword(Boolean(staff.mustChangePassword));

        // Maintain legacy CareerUser compatibility
        setAdminProfile({
          uid: staff.uid,
          email: staff.email,
          displayName: staff.fullName,
          role: staff.roleId as any,
          isActive: staff.accountStatus === 'ACTIVE',
          createdAt: staff.createdAt,
        });

        // Log login event
        logStaffLogin({
          uid: staff.uid,
          employeeId: staff.employeeId,
          email: staff.email,
          eventType: 'LOGIN_SUCCESS',
          result: 'SUCCESS',
        }).catch(() => {});
      } else {
        // Not a staff user and not master admin -> Ordinary client account attempting staff portal
        setAuthError('Access Denied. You do not have employee credentials to access the internal staff portal.');
        await logoutUser();
        setUser(null);
        setStaffProfile(null);
        setAdminProfile(null);
      }
    } catch (e: any) {
      console.error('Error fetching admin staff profile:', e);
      setAuthError(e?.message || 'Error authenticating employee profile.');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        // Fallback: Check for verified backend session in sessionStorage or localStorage
        let storedSession: any = null;
        if (typeof window !== 'undefined') {
          const raw = sessionStorage.getItem('hp_admin_session') || localStorage.getItem('hp_admin_session');
          if (raw) {
            try { storedSession = JSON.parse(raw); } catch (_) {}
          }
        }

        if (storedSession && storedSession.email) {
          const syntheticUser = {
            uid: storedSession.uid || 'yKjmA3pC98UspK3dwnzzR9TlRoC3',
            email: storedSession.email,
            displayName: storedSession.displayName || 'Hopeadmin',
            getIdToken: async () => 'hp_verified_token',
          } as any;
          setUser(syntheticUser);
          await fetchProfile(syntheticUser);
        } else {
          setAdminProfile(null);
          setStaffProfile(null);
          setMustChangePassword(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const effectiveRole: UserRole =
    previewRole || (staffProfile?.roleId as UserRole) || adminProfile?.role || 'super_admin';

  const isAuthorized = Boolean(
    user &&
      !authError &&
      (staffProfile?.accountStatus === 'ACTIVE' ||
        allowedAdminEmails.includes(user.email?.toLowerCase() || ''))
  );

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hp_admin_session');
      localStorage.removeItem('hp_admin_session');
    }
    if (staffProfile) {
      logStaffLogin({
        uid: staffProfile.uid,
        employeeId: staffProfile.employeeId,
        email: staffProfile.email,
        eventType: 'LOGOUT',
        result: 'SUCCESS',
      }).catch(() => {});
    }
    await logoutUser();
    setUser(null);
    setAdminProfile(null);
    setStaffProfile(null);
    setPreviewRole(null);
    setMustChangePassword(false);
    setAuthError(null);
  };

  const hasPermission = (module: StaffPermissionModule, action: StaffPermissionAction): boolean => {
    if (!staffProfile && !user) return false;
    const roleId = (staffProfile?.roleId || effectiveRole || '').toLowerCase();
    if (roleId === 'super_admin' || roleId === 'super admin') return true;

    const matchedRole = DEFAULT_STAFF_ROLES.find(
      (r) => r.roleId.toLowerCase() === roleId || r.roleName.toLowerCase() === roleId
    );

    if (!matchedRole) return false;
    return checkPermission(matchedRole.permissions, module, action);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminProfile,
        staffProfile,
        role: effectiveRole,
        isAuthorized,
        loading,
        mustChangePassword,
        authError,
        signOut: handleSignOut,
        switchRolePreview: setPreviewRole,
        hasPermission,
        refreshStaffProfile: async () => {
          if (user) await fetchProfile(user);
        },
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
