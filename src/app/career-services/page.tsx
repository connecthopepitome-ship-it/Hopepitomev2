import { CareerNavigation } from '@/components/career/CareerNavigation';
import { CareerIntakeWizard } from '@/components/career/CareerIntakeWizard';
import { CareerFooter } from '@/components/career/CareerFooter';

export const metadata = {
  title: 'Career Services & Executive Intake | Hopepitome',
  description: 'Select your career service, share your resume, and elevate your professional trajectory with our dedicated career consulting strategists.',
};

export default function CareerServicesPage() {
  return (
    <div className="bg-[#FAF8F5] text-[#292D36] min-h-screen flex flex-col relative font-sans">
      {/* 1. Header Navigation */}
      <CareerNavigation />

      {/* 2. Compact Mobile-First Service-First Intake Experience */}
      <main className="flex-1 flex flex-col">
        <CareerIntakeWizard />
      </main>

      {/* 3. Studio Footer */}
      <CareerFooter />
    </div>
  );
}
