import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hopepitome Career Services | Professional Resumes, ATS Optimisation & Personal Branding',
  description:
    'Present your experience, showcase your skills and manage your job search with greater confidence. Professional resume crafting, ATS optimisation, LinkedIn profile makeovers, personal portfolio websites and managed job search assistance.',
  keywords: [
    'Hopepitome Career Services',
    'Professional Resume Writing',
    'ATS Resume Optimisation',
    'LinkedIn Profile Makeover',
    'Personal Portfolio Website',
    'Executive Resume Service',
    'Job Search Assistance',
    'Career Branding Studio',
    'Job Application Management',
  ],
  openGraph: {
    title: 'Hopepitome Career Services | Professional Resumes & Career Branding',
    description:
      'Your experience deserves a stronger presentation. We help job seekers and professionals present their experience and navigate their next step with confidence.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Hopepitome',
  },
};

export default function CareerServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#F7F5F0] text-[#292D36] min-h-screen flex flex-col font-sans selection:bg-[#8172A8] selection:text-white relative z-20">
      {children}
    </div>
  );
}

