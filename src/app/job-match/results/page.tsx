'use client';

import React from 'react';
import { PortalLayout } from '@/components/career/portal/PortalLayout';
import { JobMatchFeatureGate } from '@/components/job-match/JobMatchFeatureGate';
import { MatchResultsView } from '@/components/job-match/MatchResultsView';

export default function JobMatchResultsPage() {
  return (
    <JobMatchFeatureGate>
      <PortalLayout>
        <MatchResultsView />
      </PortalLayout>
    </JobMatchFeatureGate>
  );
}

