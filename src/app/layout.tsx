import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Baloo_2, Dancing_Script, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

// Baloo 2 is a bold, rounded display font that echoes the chunky lettering in
// the M.R Cake Shop logo, replacing the more formal Playfair Display used in
// earlier drafts. Dancing Script matches the logo's cursive "M.R" strokes and
// tagline, for the one or two spots that need that script treatment.
const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-script',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'M.R Cake Shop | Cakes in Tiruppur',
  description:
    'Explore fresh cream, butter cream and designer cakes from M.R Cake Shop, Tiruppur. Browse our catalogue and send your cake order request directly through WhatsApp.',
  openGraph: {
    title: 'M.R Cake Shop | Cakes in Tiruppur',
    description:
      'Explore fresh cream, butter cream and designer cakes from M.R Cake Shop, Tiruppur. Browse our catalogue and send your cake order request directly through WhatsApp.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${baloo.variable} ${dancingScript.variable} ${inter.variable} font-body antialiased`}>
        <Navbar />
        <main className="pb-24 md:pb-8">
          {children}
          <Footer />
        </main>
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}
