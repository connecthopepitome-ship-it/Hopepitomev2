import { CareerNavigation } from '@/components/career/CareerNavigation';
import { CareerHeroSection } from '@/components/career/CareerHeroSection';
import { CareerIntakeWizard } from '@/components/career/CareerIntakeWizard';
import { CareerWhyUsSection } from '@/components/career/CareerWhyUsSection';
import { CareerProcessSection } from '@/components/career/CareerProcessSection';
import { CareerFinalCtaSection } from '@/components/career/CareerFinalCtaSection';
import { CareerFooter } from '@/components/career/CareerFooter';

export const metadata = {
  title: 'Hopepitome Career Services — Modern Digital Career Studio',
  description:
    'Resume writing, ATS optimisation, LinkedIn profile makeovers, portfolio websites, and managed job search assistance for ambitious professionals.',
};

export default function CareerServicesPage() {
  return (
    <div className="bg-[#FAF8FF] text-[#24233A] min-h-screen flex flex-col relative font-sans antialiased selection:bg-[#7357F5]/20 selection:text-[#7357F5]">
      {/* 1. Sticky Navigation Header */}
      <CareerNavigation />

      {/* Main Studio Editorial Flow */}
      <main className="flex-1 flex flex-col">
        {/* 2. Striking Split-Layout Hero Section */}
        <CareerHeroSection />

        {/* 3. Service Selection & Compact 3-Step Intake Flow */}
        <CareerIntakeWizard />

        {/* 4. Why Hopepitome Feature Cards */}
        <CareerWhyUsSection />

        {/* 5. How It Works 3-Step Visual Process */}
        <CareerProcessSection />

        {/* 6. High-Converting Final Call to Action */}
        <CareerFinalCtaSection />
      </main>

      {/* 7. Modern Studio Footer */}
      <CareerFooter />
    </div>
  );
}
