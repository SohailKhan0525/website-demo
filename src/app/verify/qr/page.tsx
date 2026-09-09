'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, QrCode, ShieldCheck } from '@phosphor-icons/react';

export default function QrVerifyPage() {
  const params = useSearchParams();
  const hash = params.get('hash');
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-6 pb-24 pt-40 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#181818] border border-[#272727] text-[#2DD4BF]"><QrCode size={28} /></span>
      <h1 className="text-4xl font-bold text-white md:text-5xl">Verify a SecureChain credential</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-[#9B9B9B]">The QR code from the holder credential opens this page and carries the document fingerprint to the verifier.</p>
      {hash && <div className="mt-8 w-full rounded-3xl border border-[#272727] bg-[#181818] p-6 text-left"><span className="block text-xs text-[#9B9B9B]">Document SHA 256 from QR</span><code className="mt-2 block break-all font-mono text-sm text-[#2DD4BF]">{hash}</code></div>}
      <Link href="/verify" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#2DD4BF] px-5 py-3 text-base font-semibold text-black hover:bg-[#14B8A6] active:scale-[0.98] transition-fluid"><ShieldCheck size={18} /> Open verifier <ArrowRight size={18} /></Link>
    </main>
  );
}
