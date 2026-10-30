import { CareerNavigation } from '@/components/career/CareerNavigation';
import { CareerHeroSection } from '@/components/career/CareerHeroSection';
import { CareerServicesSection } from '@/components/career/CareerServicesSection';
import { CareerConnectedSection } from '@/components/career/CareerConnectedSection';
import { CareerAudienceSection } from '@/components/career/CareerAudienceSection';
import { CareerProcessSection } from '@/components/career/CareerProcessSection';
import { CareerPackagesSection } from '@/components/career/CareerPackagesSection';
import { CareerShowcaseSection } from '@/components/career/CareerShowcaseSection';
import { CareerWhyUsSection } from '@/components/career/CareerWhyUsSection';
import { CareerFaqSection } from '@/components/career/CareerFaqSection';
import { CareerContactSection } from '@/components/career/CareerContactSection';
import { CareerFooter } from '@/components/career/CareerFooter';

export default function CareerServicesPage() {
  return (
    <div className="bg-[#F7F5F0] text-[#292D36] min-h-screen flex flex-col relative">
      {/* 1. Dedicated Career Navigation */}
      <CareerNavigation />

      {/* Main Editorial Content Flow */}
      <main className="flex-1 flex flex-col">
        {/* 2. Hero Section: Editorial Headline, Real-World Document Mockups & Clear CTAs */}
        <CareerHeroSection />

        {/* 3. Five Core Disciplines: Resume, ATS, LinkedIn, Portfolio, Job Search Operations */}
        <CareerServicesSection />

        {/* 4. Signature Section: Your Career Presence, Connected (Interactive Ecosystem Journey) */}
        <CareerConnectedSection />

        {/* 5. Who We Help: 4 Audience Stages (Graduates, Experienced, Changers, Active Seekers) */}
        <CareerAudienceSection />

        {/* 6. Four-Stage Process: Intake, Review, Deliverable Preparation, Review & Delivery */}
        <CareerProcessSection />

        {/* 7. Packages & Transparent Scoping: 4 Tiers with Revision Allowances & SLAs */}
        <CareerPackagesSection />

        {/* 8. Concept Showcase: Authentic Gallery of Fictional Work Samples */}
        <CareerShowcaseSection />

        {/* 9. Why Choose Hopepitome: 4 Core Principles without Fluff or False Guarantees */}
        <CareerWhyUsSection />

        {/* 10. Frequently Asked Questions: 12 Rigorous & Honest Answers */}
        <CareerFaqSection />

        {/* 11. Consultation Intake Channel: Fully Functional Lead Capture with File Upload */}
        <CareerContactSection />
      </main>

      {/* 12. Dedicated Studio Footer with Return Link to Business Technology Homepage */}
      <CareerFooter />
    </div>
  );
}

