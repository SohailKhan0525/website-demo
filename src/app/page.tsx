import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Timer,
  Fingerprint,
  Stack,
  Wallet,
  UploadSimple,
  QrCode,
  CheckCircle,
  Cpu,
  Database,
  LockKey,
} from '@phosphor-icons/react/dist/ssr';
import { TaglineReveal } from '@/components/TaglineReveal';
import { FaqAccordion } from '@/components/FaqAccordion';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-6 flex flex-col items-center justify-center text-center">
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#272727] text-xs font-medium text-[#2DD4BF] mb-8">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span>Smart India Hackathon 2026 · Team BlackCaps (TID146)</span>
        </div>

        {/* Hero Heading: Max width 680px, Left to right #FFFFFF to #9B9B9B gradient text */}
        <div className="max-w-[680px] mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="hero-gradient-text block">
              Know a document is real,
            </span>
            <span className="hero-gradient-text block">
              without calling anyone to check.
            </span>
          </h1>

          {/* Subheadline: Max width 680px, clean sentence wrap */}
          <p className="text-base sm:text-lg md:text-xl text-[#9B9B9B] leading-relaxed mb-8">
            SecureChain records a tamper proof fingerprint of every certificate, deed, or record the moment it is issued, so anyone can verify it in seconds instead of days.
          </p>

          {/* Primary CTA: Only single primary action above the fold */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link
              href="/verify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-[0.98] transition-fluid shadow-lg shadow-[#2DD4BF]/15 relative overflow-hidden group"
            >
              <span className="relative z-10 font-bold">Try the live verification demo</span>
              <ArrowRight size={18} weight="bold" className="relative z-10 group-hover:translate-x-1 transition-fluid" />
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </Link>
          </div>

          {/* Proof line under CTA */}
          <p className="text-xs sm:text-sm text-[#9B9B9B] font-medium tracking-normal">
            Built for education, land records, and healthcare documents
          </p>
        </div>

        {/* Hero Visual: Interactive Live Ledger Preview Card */}
        <div className="w-full max-w-3xl mt-14 mx-auto rounded-3xl border border-[#272727] bg-[#181818] p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#272727] pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#272727]" />
              <span className="w-3 h-3 rounded-full bg-[#272727]" />
              <span className="w-3 h-3 rounded-full bg-[#272727]" />
              <span className="text-xs text-[#9B9B9B] ml-2 font-mono">
                node://fabric.ledger.securechain.org
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] font-mono">
                PBFT Consensus Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-[#1F1F1F] border border-[#272727] flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase text-[#9B9B9B] tracking-wider block mb-1">
                  Document Identity
                </span>
                <span className="text-sm font-semibold text-white block">
                  B.Tech Provisional Degree
                </span>
                <span className="text-xs text-[#9B9B9B] block mt-0.5">
                  Roll: 22BCS1084 · NIT Warangal
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#272727] flex items-center justify-between">
                <span className="text-xs text-[#9B9B9B]">Block</span>
                <span className="text-xs font-mono text-[#38BDF8]">#148920</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1F1F1F] border border-[#272727] flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase text-[#9B9B9B] tracking-wider block mb-1">
                  SHA 256 Digest
                </span>
                <span className="text-xs font-mono text-[#9B9B9B] break-all block leading-tight">
                  7dc50b0cbfc913a2c128b9912d9e1a217fe9c6b5c4ebad488466034e71bdea65
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#272727] flex items-center justify-between">
                <span className="text-xs text-[#9B9B9B]">Method</span>
                <span className="text-xs text-white">Client Native Crypto</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1F1F1F] border border-[#272727] flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase text-[#9B9B9B] tracking-wider block mb-1">
                  Verification Output
                </span>
                <div className="flex items-center gap-1.5 text-[#2DD4BF] font-semibold text-base">
                  <CheckCircle size={18} weight="fill" />
                  <span>Valid Ledger Record</span>
                </div>
                <span className="text-xs text-[#9B9B9B] block mt-1">
                  Zero phone calls needed
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#272727]">
                <Link
                  href="/verify"
                  className="w-full py-1.5 px-3 rounded-lg bg-[#272727] text-white hover:bg-[#313131] active:scale-95 text-xs font-medium flex items-center justify-center gap-1 transition-fluid"
                >
                  <span>Test in Sandbox</span>
                  <ArrowRight size={12} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM TO SOLUTION SECTION */}
      <section className="w-full py-20 px-6 bg-[#181818] border-y border-[#272727]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-start justify-between">
          <div className="md:w-1/3">
            <span className="text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold block mb-2">
              The Reality
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Why paper verification fails modern institutions.
            </h2>
          </div>

          <div className="md:w-2/3 flex flex-col gap-4 text-base md:text-lg text-[#9B9B9B] leading-relaxed">
            <p>
              Manual verification today means phone calls, letters, and weeks of waiting, and forged certificates and land papers cost real money and real disputes.
            </p>
            <p>
              SecureChain replaces that with one shared ledger that any authorised issuer writes to and anyone can check against.
            </p>
            <p>
              Because only the cryptographic digest is stored on the ledger while the actual document remains private, verification is instant, privacy preserving, and mathematically tamper evident.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS (4 OUTCOME DRIVEN CARDS) */}
      <section className="w-full py-24 px-6 bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold block mb-2">
              Measurable Outcomes
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Designed for speed, privacy, and institutional trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] hover:border-[#2DD4BF]/50 hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.15)] transition-fluid flex flex-col justify-between group">
              <div>
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] group-hover:border-[#2DD4BF]/40 group-hover:scale-105 transition-fluid mb-6">
                  <Timer size={24} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2DD4BF] transition-fluid">
                  Seconds, not weeks
                </h3>
                <p className="text-base text-[#9B9B9B] leading-relaxed">
                  A verifier gets a Valid, Tampered, or Not found result instantly instead of waiting on a reply from the issuer.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#272727] flex items-center justify-between text-xs font-mono text-[#2DD4BF]">
                <span>Turnaround: 400ms check</span>
                <span className="text-[#9B9B9B]">Legacy: 14 to 21 days</span>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] hover:border-[#2DD4BF]/50 hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.15)] transition-fluid flex flex-col justify-between group">
              <div>
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] group-hover:border-[#2DD4BF]/40 group-hover:scale-105 transition-fluid mb-6">
                  <Fingerprint size={24} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2DD4BF] transition-fluid">
                  Nothing to fake
                </h3>
                <p className="text-base text-[#9B9B9B] leading-relaxed">
                  The original document never leaves the issuer system; only its fingerprint sits on the ledger, so there is nothing useful for a forger to copy.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#272727] flex items-center justify-between text-xs font-mono text-[#2DD4BF]">
                <span>Zero Knowledge Storage</span>
                <span className="text-[#9B9B9B]">Encrypted off chain</span>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] hover:border-[#2DD4BF]/50 hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.15)] transition-fluid flex flex-col justify-between group">
              <div>
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] group-hover:border-[#2DD4BF]/40 group-hover:scale-105 transition-fluid mb-6">
                  <Stack size={24} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2DD4BF] transition-fluid">
                  One system, many sectors
                </h3>
                <p className="text-base text-[#9B9B9B] leading-relaxed">
                  The same verification layer works for degrees, land titles, and medical records instead of each department building its own.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#272727] flex items-center justify-between text-xs font-mono text-[#2DD4BF]">
                <span>Cross Department Protocol</span>
                <span className="text-[#9B9B9B]">Education, Land, Health</span>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] hover:border-[#2DD4BF]/50 hover:shadow-[0_0_30px_-5px_rgba(45,212,191,0.15)] transition-fluid flex flex-col justify-between group">
              <div>
                <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] group-hover:border-[#2DD4BF]/40 group-hover:scale-105 transition-fluid mb-6">
                  <Wallet size={24} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2DD4BF] transition-fluid">
                  Citizens keep their own copy
                </h3>
                <p className="text-base text-[#9B9B9B] leading-relaxed">
                  A holder gets a digital wallet with their verified documents, instead of relying on the issuing office every time.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#272727] flex items-center justify-between text-xs font-mono text-[#2DD4BF]">
                <span>Self Sovereign Credential</span>
                <span className="text-[#9B9B9B]">W3C DIDs & DigiLocker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MANDATORY TAGLINE REVEAL SECTION (Scroll-triggered word-by-word) */}
      <TaglineReveal />

      {/* 5. HOW IT WORKS (3 STEPS) */}
      <section className="w-full py-24 px-6 bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold block mb-2">
              Verification Protocol
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Three steps from issuance to instant verification.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] flex flex-col justify-between relative">
              <span className="text-5xl font-bold text-[#272727] block mb-4">
                01
              </span>
              <div>
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] mb-4">
                  <UploadSimple size={20} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  Issue
                </h3>
                <p className="text-sm md:text-base text-[#9B9B9B] leading-relaxed">
                  The issuer uploads the document; SecureChain computes its fingerprint and writes it to the ledger with a timestamp and issuer ID.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] flex flex-col justify-between relative">
              <span className="text-5xl font-bold text-[#272727] block mb-4">
                02
              </span>
              <div>
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] mb-4">
                  <QrCode size={20} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  Share
                </h3>
                <p className="text-sm md:text-base text-[#9B9B9B] leading-relaxed">
                  The holder receives a QR code linked to that fingerprint.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[#181818] border border-[#272727] flex flex-col justify-between relative">
              <span className="text-5xl font-bold text-[#272727] block mb-4">
                03
              </span>
              <div>
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] mb-4">
                  <ShieldCheck size={20} weight="bold" />
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  Verify
                </h3>
                <p className="text-sm md:text-base text-[#9B9B9B] leading-relaxed">
                  Anyone scans the QR or uploads a copy; SecureChain recomputes the fingerprint and checks it against the ledger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ARCHITECTURE HIGHLIGHTS (From SIH26194 PPTX) */}
      <section className="w-full py-20 px-6 bg-[#181818] border-y border-[#272727]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold block mb-2">
                Technical Blueprint
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Permissioned ledger with hybrid off chain storage.
              </h2>
            </div>
            <span className="text-xs text-[#9B9B9B] font-mono px-3 py-1.5 rounded-full bg-[#1F1F1F] border border-[#272727]">
              SIH Problem Statement SIH26194
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#1F1F1F] border border-[#272727]">
              <div className="flex items-center gap-3 mb-3">
                <Cpu size={22} className="text-[#38BDF8]" weight="bold" />
                <h3 className="text-base font-semibold text-white">Hyperledger Fabric PBFT</h3>
              </div>
              <p className="text-sm text-[#9B9B9B] leading-relaxed">
                Permissioned consortium network with practical byzantine fault tolerance consensus shared across trusted institutional nodes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1F1F1F] border border-[#272727]">
              <div className="flex items-center gap-3 mb-3">
                <Database size={22} className="text-[#2DD4BF]" weight="bold" />
                <h3 className="text-base font-semibold text-white">Encrypted Off Chain IPFS</h3>
              </div>
              <p className="text-sm text-[#9B9B9B] leading-relaxed">
                Files are never exposed publicly. Documents reside encrypted off chain while immutable 32 byte hashes anchor integrity on chain.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1F1F1F] border border-[#272727]">
              <div className="flex items-center gap-3 mb-3">
                <LockKey size={22} className="text-[#38BDF8]" weight="bold" />
                <h3 className="text-base font-semibold text-white">DigiLocker & W3C Alignment</h3>
              </div>
              <p className="text-sm text-[#9B9B9B] leading-relaxed">
                Native compatibility with national digital public infrastructure and W3C Decentralized Identifiers for citizen digital wallets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="w-full py-24 px-6 bg-[#000000]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold block mb-2">
              Judge Facing FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Technical answers to core evaluation questions.
            </h2>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="w-full py-24 px-6 bg-[#181818] border-t border-[#272727] text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1F1F1F] border border-[#272727] text-[#2DD4BF] mb-6">
            <ShieldCheck size={26} weight="bold" />
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to test live document verification?
          </h2>
          <p className="text-base md:text-lg text-[#9B9B9B] leading-relaxed mb-8">
            Experience the real cryptographic SHA 256 hashing sequence and Supabase ledger lookup in action.
          </p>

          <Link
            href="/verify"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-[0.98] transition-fluid shadow-lg shadow-[#2DD4BF]/15"
          >
            <span>Try the live verification demo</span>
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
