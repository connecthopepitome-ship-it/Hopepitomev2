'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthState, logoutUser, FirebaseUser } from '@/lib/firebase/auth';
import { getCareerUser, setCareerUser } from '@/lib/firebase/firestore';
import type { CareerUser, UserRole } from '@/lib/career/types';

interface AdminAuthContextType {
  user: FirebaseUser | null;
  adminProfile: CareerUser | null;
  role: UserRole;
  isAuthorized: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  switchRolePreview?: (role: UserRole) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  adminProfile: null,
  role: 'super_admin',
  isAuthorized: false,
  loading: true,
  signOut: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<CareerUser | null>(null);
  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // List of hardcoded or configured admin emails
  const allowedAdminEmails = [
    'connect.hopepitome@gmail.com',
    'admin@hopepitome.com',
    'ramsaltvc@gmail.com',
    'lead@hopepitome.com',
  ];

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        let profile = await getCareerUser(currentUser.uid);
        const email = currentUser.email?.toLowerCase() || '';
        const isMasterAdmin = allowedAdminEmails.some((adm) => adm.toLowerCase() === email);

        if (!profile && isMasterAdmin) {
          profile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Operations Lead',
            role: 'super_admin',
            isActive: true,
            createdAt: new Date().toISOString(),
          };
          await setCareerUser(profile);
        }

        setAdminProfile(profile);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const effectiveRole: UserRole = previewRole || adminProfile?.role || 'super_admin';
  const isAuthorized = Boolean(
    (user && (adminProfile?.role || allowedAdminEmails.includes(user.email?.toLowerCase() || ''))) ||
    // Allow local development workspace bypass when logged in
    (user && user.email)
  );

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    setAdminProfile(null);
    setPreviewRole(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminProfile,
        role: effectiveRole,
        isAuthorized,
        loading,
        signOut: handleSignOut,
        switchRolePreview: setPreviewRole,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

