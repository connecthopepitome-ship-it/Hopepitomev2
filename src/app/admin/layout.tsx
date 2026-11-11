'use client';

import React from 'react';
import { AdminAuthProvider } from '@/components/career/admin/AdminAuthContext';

export default function StandaloneAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}

