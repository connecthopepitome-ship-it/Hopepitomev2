'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscribeToAuthState, logoutUser, FirebaseUser } from '@/lib/firebase/auth';
import { getCareerClient, getCareerProfile, saveCareerClient, saveCareerProfile } from '@/lib/firebase/firestore';
import type { CareerClient, CareerProfileData } from '@/lib/career/types';

interface AuthContextType {
  user: FirebaseUser | null;
  client: CareerClient | null;
  profile: CareerProfileData | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  client: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useCareerAuth = () => useContext(AuthContext);

export function CareerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [client, setClient] = useState<CareerClient | null>(null);
  const [profile, setProfile] = useState<CareerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (currentUser: FirebaseUser) => {
    try {
      let clientRecord = await getCareerClient(currentUser.uid);
      if (!clientRecord) {
        // Automatically provision client record upon first sign in
        const now = new Date().toISOString();
        const shortCode = currentUser.uid.substring(0, 4).toUpperCase();
        clientRecord = {
          id: currentUser.uid,
          clientCode: `CL-${shortCode}`,
          fullName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Client',
          email: currentUser.email || '',
          onboardingCompleted: false,
          createdAt: now,
          updatedAt: now,
        };
        await saveCareerClient(clientRecord);
      }
      setClient(clientRecord);

      let profileRecord = await getCareerProfile(currentUser.uid);
      if (!profileRecord) {
        profileRecord = {
          clientId: currentUser.uid,
          fullName: clientRecord.fullName,
          email: clientRecord.email,
          careerStage: 'Mid-Level',
          targetRoleTitles: [],
          targetIndustries: [],
          targetGeographies: [],
          preferredWorkType: 'Remote',
          employmentHistory: [],
          education: [],
          certifications: [],
          skills: { technical: [], functional: [], leadership: [], toolsAndPlatforms: [] },
          projects: [],
          status: 'DRAFT',
          updatedAt: new Date().toISOString(),
        };
        await saveCareerProfile(profileRecord);
      }
      setProfile(profileRecord);
    } catch (e) {
      console.error('Failed fetching client profile:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser);
      } else {
        setClient(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setUser(null);
    setClient(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        client,
        profile,
        loading,
        refreshProfile,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

