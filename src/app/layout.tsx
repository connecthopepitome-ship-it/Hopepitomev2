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
      <body className="bg-graphite-950 text-warm-white font-sans antialiased selection:bg-cobalt-blue selection:text-white overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
