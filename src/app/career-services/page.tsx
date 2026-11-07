import { CareerStudioHeader } from '@/components/career/CareerStudioHeader';
import { CareerStudioHero } from '@/components/career/CareerStudioHero';
import { CandidateActivityCard } from '@/components/career/CandidateActivityCard';
import { CompactServiceRows } from '@/components/career/CompactServiceRows';
import { EmbeddedAtsResumeChecker } from '@/components/career/EmbeddedAtsResumeChecker';
import { CareerProcessSection } from '@/components/career/CareerProcessSection';
import { CareerFaqSection } from '@/components/career/CareerFaqSection';
import { CareerFooter } from '@/components/career/CareerFooter';
import { CareerBottomNav } from '@/components/career/CareerBottomNav';

export const metadata = {
  title: 'Hopepitome Career Studio — Scan My Resume & Professional Resume Writing',
  description:
    'Free AI resume assessment, ATS score verification, professional resume writing, and customized career solutions for ambitious professionals.',
};

export default function CareerStudioPage() {
  return (
    <div className="bg-[#FAF8FF] text-[#24233A] min-h-screen flex flex-col relative font-sans antialiased selection:bg-[#7454F5]/20 selection:text-[#7454F5]">
      {/* 1. Compact Header */}
      <CareerStudioHeader />

      {/* Main Career Studio Flow */}
      <main className="flex-1 flex flex-col pb-20 lg:pb-0">
        {/* Section A: Welcome & Two Primary Action Cards (Scan My Resume + Resume Writing) */}
        <CareerStudioHero />

        {/* Section B: My Career Activity (Recent Scans, Unlocked Reports, Active Requests) */}
        <CandidateActivityCard />

        {/* Section C: Other Career Services (Compact Horizontal Rows) */}
        <CompactServiceRows />

        {/* Section D: Free AI Resume & ATS Scanner (Preserved 100%) */}
        <EmbeddedAtsResumeChecker />

        {/* Section E: How It Works Visual Workflow (Progressive Secondary Content) */}
        <CareerProcessSection />

        {/* Section F: Frequently Asked Questions */}
        <CareerFaqSection />
      </main>

      {/* Modern Studio Footer */}
      <CareerFooter />

      {/* Mobile-First Bottom Navigation (Home, Scan, Services, Account) */}
      <CareerBottomNav />
    </div>
  );
}
