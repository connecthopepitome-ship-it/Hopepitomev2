import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/hero/HeroSection';
import { MainServicesSection } from '@/components/sections/MainServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { FinalCtaSection } from '@/components/sections/FinalCtaSection';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: "Hopepitome | Websites, Online Stores & Custom Business Systems",
  description:
    "We build websites and smart business systems that make your work easier. Websites, e-commerce, custom business software, and workflow automation.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-[#F8F9FA] flex flex-col font-sans selection:bg-[#9D85FF] selection:text-[#07080C]">
      {/* 1. Header Navigation */}
      <Navigation />

      {/* Main Content Area — 5 Focused Sections */}
      <main className="flex-1 flex flex-col">
        {/* Section 1: Hero with Persistent Living 3D Mesh */}
        <HeroSection />

        {/* Section 2: What We Build — 4 Core Disciplines */}
        <MainServicesSection />

        {/* Section 3: See What We Build — Visual Portfolio */}
        <PortfolioSection />

        {/* Section 4: How It Works — 4 Simple Steps */}
        <ProcessSection />

        {/* Section 5: Final CTA & Project Enquiry */}
        <FinalCtaSection />
      </main>

      {/* Studio Footer */}
      <Footer />
    </div>
  );
}
