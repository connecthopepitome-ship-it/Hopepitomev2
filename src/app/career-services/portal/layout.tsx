'use client';

import React from 'react';
import { CareerAuthProvider } from '@/components/career/portal/AuthContext';

export default function CareerPortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CareerAuthProvider>{children}</CareerAuthProvider>;
}

