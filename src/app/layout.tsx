import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HOPEPITOME / Digital Solutions for Business & Career Branding',
  description:
    'We build websites and business software through Nexora, and help people present their skills and career experience with confidence through Elevora.',
  keywords: [
    'Digital Studio',
    'Nexora',
    'Elevora',
    'Business Websites',
    'Online Stores',
    'Custom Software',
    'ERP Systems',
    'Career Profiles',
    'Resumes',
    'Portfolios',
    'LinkedIn Improvement',
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { SpectralBackground } from '@/components/background/SpectralBackground';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#07080B] text-warm-white font-sans antialiased selection:bg-[#8B6CFF] selection:text-white overflow-x-hidden min-h-screen relative">
        {/* Persistent 3D Spectral Drape Living Background */}
        <SpectralBackground />

        {/* Content & Interaction Layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
