import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'M R Cake Shop | Cakes in Tiruppur',
  description:
    'Explore fresh cream, butter cream and designer cakes from M R Cake Shop, Tiruppur. Browse our catalogue and send your cake order request directly through WhatsApp.',
  openGraph: {
    title: 'M R Cake Shop | Cakes in Tiruppur',
    description:
      'Explore fresh cream, butter cream and designer cakes from M R Cake Shop, Tiruppur. Browse our catalogue and send your cake order request directly through WhatsApp.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-body antialiased`}>
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
