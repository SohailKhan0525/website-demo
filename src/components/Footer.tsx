import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#272727] bg-[#181818] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Brand & Team Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1F1F1F] border border-[#313131] text-[#2DD4BF]">
              <ShieldCheck size={16} weight="bold" />
            </span>
            <span className="font-bold text-base text-white">SecureChain</span>
          </div>
          <p className="text-sm text-[#9B9B9B] max-w-sm leading-relaxed">
            Decentralized document verification platform for educational credentials, land records, and healthcare summaries.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1F1F1F] text-[#9B9B9B] border border-[#272727]">
              Team BlackCaps · TID151
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1F1F1F] text-[#9B9B9B] border border-[#272727]">
              Problem Statement SIH26194
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap gap-8 text-sm">
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-wider text-white font-semibold">Navigation</span>
            <Link href="/" className="text-[#9B9B9B] hover:text-white transition-fluid">
              Landing Page
            </Link>
            <Link href="/verify" className="text-[#9B9B9B] hover:text-white transition-fluid">
              Live Verification Demo
            </Link>
            <Link href="/team" className="text-[#9B9B9B] hover:text-white transition-fluid">
              BlackCaps Team
            </Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase tracking-wider text-white font-semibold">Architecture</span>
            <span className="text-[#9B9B9B]">Hyperledger Fabric PBFT</span>
            <span className="text-[#9B9B9B]">Off Chain Encrypted IPFS</span>
            <span className="text-[#9B9B9B]">W3C Verifiable Credentials</span>
          </div>
        </div>
      </div>

      {/* Required Hackathon Scope Disclaimer & Legal */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#272727] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#9B9B9B]">
        <p className="text-center md:text-left">
          Smart India Hackathon 2026 Innovation Round. Built by Team BlackCaps.
        </p>
        <p className="px-3 py-1 rounded-md bg-[#1F1F1F] border border-[#272727] text-center">
          This is a hackathon demo, not a production security system
        </p>
      </div>
    </footer>
  );
}
