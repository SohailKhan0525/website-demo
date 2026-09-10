import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SecureChain | Blockchain Document Verification Platform',
  description:
    'SecureChain records a tamper proof fingerprint of every certificate, deed, or record the moment it is issued, so anyone can verify it in seconds instead of days.',
  keywords: [
    'Blockchain Document Verification',
    'Smart India Hackathon',
    'SIH26194',
    'BlackCaps',
    'Decentralized Ledger',
    'Hyperledger Fabric',
    'Digital Credentials',
  ],
  authors: [{ name: 'Team BlackCaps (TID151)' }],
  openGraph: {
    title: 'SecureChain | Blockchain Document Verification Platform',
    description:
      'Know a document is real without calling anyone to check. Instant client side verification powered by distributed ledger technology.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} dark antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#000000] text-[#F5F5F5] font-sans selection:bg-[#2DD4BF]/20 selection:text-[#2DD4BF]">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
