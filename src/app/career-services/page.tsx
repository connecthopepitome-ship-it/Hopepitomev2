import { CareerNavigation } from '@/components/career/CareerNavigation';
import { CareerHeroSection } from '@/components/career/CareerHeroSection';
import { EmbeddedAtsResumeChecker } from '@/components/career/EmbeddedAtsResumeChecker';
import { CareerIntakeWizard } from '@/components/career/CareerIntakeWizard';
import { CareerWhyUsSection } from '@/components/career/CareerWhyUsSection';
import { CareerProcessSection } from '@/components/career/CareerProcessSection';
import { CareerFaqSection } from '@/components/career/CareerFaqSection';
import { CareerFinalCtaSection } from '@/components/career/CareerFinalCtaSection';
import { CareerFooter } from '@/components/career/CareerFooter';

export const metadata = {
  title: 'Hopepitome Career Services — Free AI Resume Checker & Career Studio',
  description:
    'Free AI resume checker, ATS score assessment, professional resume writing, ATS optimisation, LinkedIn profile makeovers, and career positioning for ambitious professionals.',
};

export default function CareerServicesPage() {
  return (
    <div className="bg-[#FAF8FF] text-[#24233A] min-h-screen flex flex-col relative font-sans antialiased selection:bg-[#7357F5]/20 selection:text-[#7357F5]">
      {/* 1. Sticky Navigation Header */}
      <CareerNavigation />

      {/* Main Studio Editorial Flow */}
      <main className="flex-1 flex flex-col">
        {/* Section 1 — Career Services Hero */}
        <CareerHeroSection />

        {/* Section 2 — Embedded AI Resume Checker */}
        <EmbeddedAtsResumeChecker />

        {/* Section 3 — Service Catalogue & Compact Intake Flow */}
        <CareerIntakeWizard />

        {/* Section 4 — Why Hopepitome Feature Cards */}
        <CareerWhyUsSection />

        {/* Section 5 — How It Works 3-Step Visual Process */}
        <CareerProcessSection />

        {/* Section 6 — Frequently Asked Questions */}
        <CareerFaqSection />

        {/* Section 7 — High-Converting Final Call to Action */}
        <CareerFinalCtaSection />
      </main>

      {/* 8. Modern Studio Footer */}
      <CareerFooter />
    </div>
  );
}
