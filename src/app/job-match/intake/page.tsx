'use client';

import React from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { JobMatchFeatureGate } from '@/components/job-match/JobMatchFeatureGate';
import { IntakeForm } from '@/components/job-match/IntakeForm';

export default function JobMatchIntakePage() {
  return (
    <JobMatchFeatureGate>
      <PortalLayout>
        <IntakeForm />
      </PortalLayout>
    </JobMatchFeatureGate>
  );
}

