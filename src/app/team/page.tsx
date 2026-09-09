import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  User,
  GenderFemale,
  GenderMale,
} from '@phosphor-icons/react/dist/ssr';

interface Member {
  name: string;
  role: string;
  isFemale?: boolean;
}

const MEMBERS: Member[] = [
  {
    name: 'Neelam Saidev',
    role: 'Team Lead',
    isFemale: false,
  },
  {
    name: 'Aith Sai Teja',
    role: 'Member',
    isFemale: false,
  },
  {
    name: 'Korra Praveen',
    role: 'Member',
    isFemale: false,
  },
  {
    name: 'Radheshyam',
    role: 'Member',
    isFemale: false,
  },
  {
    name: 'Akshya',
    role: 'Member',
    isFemale: true,
  },
  {
    name: 'Mohd Zaheeruddin',
    role: 'Member',
    isFemale: false,
  },
];

export default function TeamPage() {
  return (
    <div className="w-full min-h-screen pt-36 pb-24 px-6 max-w-5xl mx-auto flex flex-col">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-[#272727] text-xs font-mono text-[#2DD4BF] mb-4">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span>Team BlackCaps · TID146</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Team BlackCaps
        </h1>
        <p className="text-base text-[#9B9B9B] leading-relaxed">
          Smart India Hackathon 2026 · Problem Statement SIH26194
        </p>
      </div>

      {/* Team Cards Grid: Name and Role ONLY, Male / Female icons per user requirement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {MEMBERS.map((member) => (
          <div
            key={member.name}
            className="p-6 rounded-3xl border border-[#272727] bg-[#181818] hover:border-[#2DD4BF]/50 hover:shadow-[0_0_25px_-5px_rgba(45,212,191,0.15)] transition-fluid flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center justify-center w-12 h-12 rounded-2xl border ${
                  member.isFemale
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                    : member.role === 'Team Lead'
                    ? 'bg-[#2DD4BF]/15 border-[#2DD4BF]/30 text-[#2DD4BF]'
                    : 'bg-[#1F1F1F] border-[#272727] text-[#38BDF8]'
                }`}
              >
                {member.isFemale ? (
                  <GenderFemale size={24} weight="bold" />
                ) : (
                  <GenderMale size={24} weight="bold" />
                )}
              </span>

              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {member.name}
                </h3>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 mt-1 rounded-full w-max ${
                    member.role === 'Team Lead'
                      ? 'bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30'
                      : 'bg-[#1F1F1F] text-[#9B9B9B] border border-[#272727]'
                  }`}
                >
                  {member.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Overview Card */}
      <div className="p-8 rounded-3xl border border-[#272727] bg-[#181818] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#2DD4BF] font-semibold">
            <ShieldCheck size={16} weight="bold" />
            <span>SecureChain Platform</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Blockchain based digital document verification platform
          </h2>
          <p className="text-sm text-[#9B9B9B] leading-relaxed">
            Eliminates slow, manual paper checks across universities, land registries, and healthcare systems through an immutable distributed ledger with privacy preserving off chain storage.
          </p>
        </div>

        <Link
          href="/verify"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-95 transition-fluid shrink-0 shadow-md"
        >
          <span>Launch Verification Demo</span>
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
