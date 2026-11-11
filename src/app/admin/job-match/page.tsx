'use client';

import React from 'react';
import { AdminLayout } from '@/components/career/admin/AdminLayout';
import { AdminIntakeQueue } from '@/components/job-match/AdminIntakeQueue';

export default function AdminJobMatchPage() {
  return (
    <AdminLayout>
      <AdminIntakeQueue />
    </AdminLayout>
  );
}

