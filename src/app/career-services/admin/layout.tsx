'use client';

import React from 'react';
import { AdminAuthProvider } from '@/components/career/admin/AdminAuthContext';

export default function CareerAdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}

