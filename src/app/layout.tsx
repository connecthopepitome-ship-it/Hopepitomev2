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
  title: 'HOPEPITOME / Experimental Digital Studio & Technology Systems',
  description:
    'Hopepitome is an independent digital studio engineered at the intersection of business technology and professional career branding through Nexora and Elevora.',
  keywords: [
    'Digital Studio',
    'Nexora',
    'Elevora',
    'Software Architecture',
    'ERP Implementation',
    'Career Branding',
    'Custom Software',
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
