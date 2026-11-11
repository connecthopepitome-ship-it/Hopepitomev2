'use client';

import React from 'react';
import { CareerAuthProvider } from '@/components/career/portal/AuthContext';

export default function JobMatchRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CareerAuthProvider>{children}</CareerAuthProvider>;
}

