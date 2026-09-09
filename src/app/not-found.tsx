import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldWarning } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
      <div className="w-16 h-16 rounded-3xl bg-[#181818] border border-[#272727] flex items-center justify-center text-[#2DD4BF] mb-6">
        <ShieldWarning size={32} weight="bold" />
      </div>

      <span className="text-xs font-mono uppercase tracking-widest text-[#2DD4BF] mb-2">
        Error 404 · Unanchored Block
      </span>

      <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
        Page not found on ledger
      </h1>

      <p className="text-base text-[#9B9B9B] max-w-md mb-8 leading-relaxed">
        The route you are looking for does not exist or has been relocated. Return to the home overview or test document verification.
      </p>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1F1F1F] text-white border border-[#272727] hover:bg-[#272727] active:scale-95 transition-fluid"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/verify"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-95 transition-fluid"
        >
          <span>Live Verification</span>
        </Link>
      </div>
    </div>
  );
}
