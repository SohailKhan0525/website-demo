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
    { label: 'Live Verify', href: '/verify' },
    { label: 'Team BlackCaps', href: '/team' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Main Navigation"
          className="pointer-events-auto mt-6 mx-auto flex items-center justify-between gap-6 px-4 py-2 rounded-full border border-[#272727] bg-[#181818]/90 backdrop-blur-xl shadow-2xl transition-fluid"
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-semibold text-sm tracking-tight hover:text-[#2DD4BF] active:scale-95 transition-fluid"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#313131] text-[#2DD4BF]">
              <ShieldCheck size={18} weight="bold" />
            </span>
            <span className="font-bold text-base tracking-normal">SecureChain</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-fluid ${
                    isActive
                      ? 'bg-[#272727] text-white'
                      : 'text-[#9B9B9B] hover:text-white hover:bg-[#1F1F1F]'
                  } active:scale-95`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Primary CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/verify"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-95 transition-fluid shadow-sm"
            >
              <span>Launch Demo</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          {/* Mobile Morphing Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="relative md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#1F1F1F] border border-[#272727] text-white active:scale-95 transition-fluid"
          >
            <div className="w-4 h-3.5 flex flex-col justify-between relative">
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-fluid ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-fluid ${
                  mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-fluid ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile Screen-filling Heavy Glass Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#000000]/95 backdrop-blur-3xl flex flex-col justify-center items-center px-6 transition-fluid">
          <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#181818] border border-[#272727] text-[#2DD4BF]">
                <ShieldCheck size={22} weight="bold" />
              </span>
              <span className="font-bold text-xl text-white">SecureChain</span>
            </div>

            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ transitionDelay: `${(idx + 1) * 75}ms` }}
                  className={`w-full py-3 rounded-2xl text-lg font-medium transition-fluid ${
                    isActive
                      ? 'bg-[#181818] border border-[#272727] text-[#2DD4BF]'
                      : 'text-[#9B9B9B] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-4 py-3 rounded-2xl text-base font-semibold bg-[#2DD4BF] text-[#000000] flex items-center justify-center gap-2 active:scale-95 transition-fluid"
            >
              <span>Try Live Verification</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
