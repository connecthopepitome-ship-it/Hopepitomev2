'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCareerAuth } from '@/components/career/portal/AuthContext';

export default function CareerPortalIndexPage() {
  const router = useRouter();
  const { user, loading } = useCareerAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/career-services/portal/dashboard');
      } else {
        router.replace('/career-services/portal/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

