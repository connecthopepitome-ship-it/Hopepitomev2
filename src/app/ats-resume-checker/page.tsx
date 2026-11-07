'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CareerStudioHeader } from '@/components/career/CareerStudioHeader';
import { EmbeddedAtsResumeChecker } from '@/components/career/EmbeddedAtsResumeChecker';
import { CareerFooter } from '@/components/career/CareerFooter';
import { CareerBottomNav } from '@/components/career/CareerBottomNav';

export default function AtsResumeCheckerRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Seamlessly transition visitor to integrated career-services page
    if (typeof window !== 'undefined') {
      router.replace('/career-services#resume-checker');
    }
  }, [router]);

  return (
    <div className="bg-[#FAF8FF] text-[#24233A] min-h-screen flex flex-col font-sans antialiased">
      <CareerStudioHeader />
      <main className="flex-1 pt-24 pb-20 lg:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <Link
            href="/career-services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7357F5] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore All Career Services</span>
          </Link>
        </div>
        <EmbeddedAtsResumeChecker />
      </main>
      <CareerFooter />
      <CareerBottomNav />
    </div>
  );
}
