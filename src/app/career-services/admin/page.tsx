'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/components/career/admin/AdminAuthContext';

export default function CareerAdminIndexPage() {
  const router = useRouter();
  const { user, loading, isAuthorized } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (user && isAuthorized) {
        router.replace('/career-services/admin/dashboard');
      } else {
        router.replace('/career-services/admin/login');
      }
    }
  }, [user, loading, isAuthorized, router]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#17243B] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

