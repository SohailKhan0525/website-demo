'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ArrowRight } from '@phosphor-icons/react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
    { label: 'Overview', href: '/' },
    { label: 'Issuer', href: '/issuer' },
    { label: 'Holder', href: '/holder' },
    { label: 'Verifier', href: '/verify' },
    { label: 'Team', href: '/team' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav aria-label="Main Navigation" className="pointer-events-auto mt-6 mx-auto flex items-center justify-between gap-3 px-4 py-2 rounded-full border border-[#272727] bg-[#181818]/90 backdrop-blur-xl shadow-2xl transition-fluid">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold text-sm tracking-tight hover:text-[#2DD4BF] active:scale-95 transition-fluid">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#313131] text-[#2DD4BF]"><ShieldCheck size={18} weight="bold" /></span>
            <span className="font-bold text-base">SecureChain</span>
          </Link>
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return <Link key={link.href} href={link.href} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-fluid active:scale-95 ${active ? 'bg-[#272727] text-white' : 'text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F]'}`}>{link.label}</Link>;
            })}
          </div>
          <div className="hidden md:flex items-center"><Link href="/verify" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-[#2DD4BF] text-black hover:bg-[#14B8A6] active:scale-95 transition-fluid"><span>Launch verifier</span><ArrowRight size={14} weight="bold" /></Link></div>
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen} className="relative flex xl:hidden items-center justify-center w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#272727] text-white active:scale-95 transition-fluid">
            <div className="w-4 h-3.5 flex flex-col justify-between relative"><span className={`w-full h-0.5 bg-white rounded-full transition-fluid ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} /><span className={`w-full h-0.5 bg-white rounded-full transition-fluid ${mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} /><span className={`w-full h-0.5 bg-white rounded-full transition-fluid ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} /></div>
          </button>
        </nav>
      </header>
      {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col justify-center items-center px-6 transition-fluid">
        <div className="flex flex-col items-center gap-4 text-center w-full max-w-sm">
          {navLinks.map((link, idx) => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ transitionDelay: `${(idx + 1) * 75}ms` }} className={`w-full py-3 rounded-2xl text-lg font-medium transition-fluid ${pathname === link.href ? 'bg-[#181818] border border-[#272727] text-[#2DD4BF]' : 'text-[#9B9B9B] hover:text-white'}`}>{link.label}</Link>)}
          <Link href="/verify" onClick={() => setMobileMenuOpen(false)} className="w-full mt-2 py-3 rounded-2xl text-base font-semibold bg-[#2DD4BF] text-black flex items-center justify-center gap-2 active:scale-95 transition-fluid">Launch verifier <ArrowRight size={16} weight="bold" /></Link>
        </div>
      </div>}
    </>
  );
}
