'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeToAuthState,
  logoutUser,
  FirebaseUser,
  CANDIDATE_SESSION_KEY,
  CandidateSessionData,
} from '@/lib/firebase/auth';
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

  const readCachedCandidateSession = (): CandidateSessionData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(CANDIDATE_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CandidateSessionData;
      return parsed?.clientId ? parsed : null;
    } catch {
      return null;
    }
  };

  const fetchUserData = async (currentUser: FirebaseUser, cachedSession?: CandidateSessionData | null) => {
    try {
      const session = cachedSession ?? readCachedCandidateSession();
      const matchingSession = session && session.clientId === currentUser.uid ? session : null;
      const activeWorkOrder =
        (typeof window !== 'undefined' ? sessionStorage.getItem('hp_active_work_order') : null) ||
        matchingSession?.workOrderId ||
        '';

      let clientRecord = await getCareerClient(currentUser.uid);
      if (!clientRecord) {
        // Provision client record safely using verified session details when available
        const now = new Date().toISOString();
        const shortCode = currentUser.uid.substring(0, 4).toUpperCase();
        clientRecord = {
          id: currentUser.uid,
          clientCode: matchingSession?.clientCode || `CL-${shortCode}`,
          fullName: matchingSession?.name || currentUser.displayName || currentUser.email?.split('@')[0] || 'Client',
          email: matchingSession?.email || currentUser.email || '',
          phone: matchingSession?.mobile || currentUser.phoneNumber || '',
          currentWorkOrderId: activeWorkOrder || undefined,
          onboardingCompleted: false,
          createdAt: now,
          updatedAt: now,
        };
        await saveCareerClient(clientRecord);
      } else if (activeWorkOrder && !clientRecord.currentWorkOrderId) {
        clientRecord = { ...clientRecord, currentWorkOrderId: activeWorkOrder };
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
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        const cachedSession = readCachedCandidateSession();
        if (cachedSession) {
          const fallbackUser = {
            uid: cachedSession.clientId,
            displayName: cachedSession.name,
            email: cachedSession.email || '',
            phoneNumber: cachedSession.mobile || null,
          } as unknown as FirebaseUser;
          setUser(fallbackUser);
          await fetchUserData(fallbackUser, cachedSession);
        } else {
          setUser(null);
          setClient(null);
          setProfile(null);
        }
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

