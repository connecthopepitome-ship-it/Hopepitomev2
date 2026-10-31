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
    'connect.hopepitome@gmail.com',
    'admin@hopepitome.com',
    'ramsaltvc@gmail.com',
    'lead@hopepitome.com',
  ];

  const fetchProfile = async (currentUser: FirebaseUser) => {
    try {
      const email = currentUser.email?.toLowerCase() || '';
      const isMasterAdmin = allowedAdminEmails.some((adm) => adm.toLowerCase() === email);

      // 1. Fetch Staff User Profile
      let staff = await getStaffUser(currentUser.uid);

      // Auto-bootstrap master admin into staffUsers if not present
      if (!staff && isMasterAdmin) {
        staff = {
          uid: currentUser.uid,
          employeeId: 'HP-EMP-00001',
          fullName: currentUser.displayName || 'Super Admin',
          email: currentUser.email || '',
          departmentId: 'dept_admin',
          departmentName: 'Administration',
          designation: 'Managing Director / Super Admin',
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
        await saveStaffUser(staff);
      }

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
      } else if (isMasterAdmin) {
        // Fallback for bootstrap
        setAdminProfile({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || 'Operations Lead',
          role: 'super_admin',
          isActive: true,
          createdAt: new Date().toISOString(),
        });
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
        setAdminProfile(null);
        setStaffProfile(null);
        setMustChangePassword(false);
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
