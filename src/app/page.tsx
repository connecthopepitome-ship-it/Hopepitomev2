import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/hero/HeroSection';
import { StatementSection } from '@/components/sections/StatementSection';
import { MainServicesSection } from '@/components/sections/MainServicesSection';
import { ConnectedBusinessSection } from '@/components/sections/ConnectedBusinessSection';
import { CommercialModelSection } from '@/components/sections/CommercialModelSection';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { FinalCtaSection } from '@/components/sections/FinalCtaSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-warm-white flex flex-col">
      {/* Editorial Navigation Bar */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Section 01: Hero with Bold Headline & Persistent 3D Mesh */}
        <HeroSection />

        {/* Section 02: Core Principle & Business Manifesto */}
        <StatementSection />

        {/* Section 03: What We Build — Six Business Service Disciplines */}
        <MainServicesSection />

        {/* Section 04: From Manual Work to Connected Operations */}
        <ConnectedBusinessSection />

        {/* Section 05: Commercial Approach & Transparent Scoping */}
        <CommercialModelSection />

        {/* Section 06: Who We Work With — Audiences */}
        <AudienceSection />

        {/* Section 07: How We Work — 4-Stage Process */}
        <ProcessSection />

        {/* Section 08: About Hopepitome Studio */}
        <AboutSection />

        {/* Section 09: Frequently Asked Questions */}
        <FaqSection />

        {/* Section 10: Final Project Scoping & Contact Intake */}
        <FinalCtaSection />
      </main>

      {/* Studio Footer */}
      <Footer />
    </div>
  );
}
