import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/hero/HeroSection';
import { StatementSection } from '@/components/sections/StatementSection';
import { DivisionsSection } from '@/components/sections/DivisionsSection';
import { ServiceIndexSection } from '@/components/sections/ServiceIndexSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { ClientPortalSection } from '@/components/sections/ClientPortalSection';
import { FinalCtaSection } from '@/components/sections/FinalCtaSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-graphite-950 text-warm-white flex flex-col">
      {/* Editorial Navigation Bar */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Section 01: Hero with Asymmetric Typography & Live 3D Sculpture */}
        <HeroSection />

        {/* Section 02: Studio Statement Manifesto */}
        <StatementSection />

        {/* Section 03: Two Divisions (NEXORA & ELEVORA) */}
        <DivisionsSection />

        {/* Section 04: Numbered Editorial Service Index */}
        <ServiceIndexSection />

        {/* Section 05: Selected Work & Concept Studies */}
        <SelectedWorkSection />

        {/* Section 06: How We Work (5-Stage Visual Sequence) */}
        <ProcessSection />

        {/* Section 07: Client Project Portal Communication */}
        <ClientPortalSection />

        {/* Section 08: Final Editorial CTA & Project Intake */}
        <FinalCtaSection />
      </main>

      {/* Section 09: Studio Footer */}
      <Footer />
    </div>
  );
}
