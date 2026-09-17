import type { Metadata } from 'next';
import { Geist, Playfair_Display } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'], display: 'swap' });
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], display: 'swap', style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: 'FORMA — Architecture, Interiors & Direction',
  description: 'FORMA is an independent architecture studio creating quiet, enduring spaces across residential, hospitality and cultural work.',
  keywords: ['architecture studio', 'interior design', 'FORMA', 'architecture portfolio'],
  authors: [{ name: 'FORMA Studio' }],
  openGraph: { title: 'FORMA — Architecture, Interiors & Direction', description: 'Spaces that stay with you.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geist.variable} ${playfair.variable}`}><body className="antialiased">{children}</body></html>;
}
