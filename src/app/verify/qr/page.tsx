'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, QrCode, ShieldCheck, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { verifyDocumentOnLedger, VerificationResponse } from '@/lib/ledger';

export default function QrVerifyPage() {
  const params = useSearchParams();
  const hash = params.get('hash');
  const [result, setResult] = useState<VerificationResponse | null>(null);

  useEffect(() => {
    if (!hash) return;
    verifyDocumentOnLedger(hash).then(setResult).catch(() => setResult(null));
  }, [hash]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center px-6 pb-24 pt-40 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#272727] bg-[#181818] text-[#2DD4BF]"><QrCode size={28} /></span>
      <h1 className="text-4xl font-bold text-white md:text-5xl">Verify a SecureChain credential</h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-[#9B9B9B]">The holder QR opens this page with the credential fingerprint. SecureChain checks that fingerprint against the ledger.</p>
      {!hash && <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-200">No fingerprint was included in this QR link.</div>}
      {hash && <div className="mt-8 w-full rounded-3xl border border-[#272727] bg-[#181818] p-6 text-left"><span className="block text-xs text-[#9B9B9B]">Document SHA 256 from QR</span><code className="mt-2 block break-all font-mono text-sm text-[#2DD4BF]">{hash}</code>{result && <div className="mt-5 flex items-center gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${result.outcome === 'valid' ? 'bg-emerald-500/10 text-emerald-300' : result.outcome === 'revoked' ? 'bg-orange-500/10 text-orange-300' : 'bg-amber-500/10 text-amber-300'}`}>{result.outcome === 'valid' ? <CheckCircle size={22} /> : <WarningCircle size={22} />}</span><div className="text-left"><p className="font-semibold text-white">{result.outcome === 'valid' ? 'Credential found' : result.outcome === 'revoked' ? 'Credential revoked' : 'Credential not found'}</p><p className="text-xs text-[#9B9B9B]">{result.record?.doc_name ?? 'No matching ledger record'}</p></div></div>}</div>}
      <Link href={hash ? `/verify?hash=${encodeURIComponent(hash)}` : '/verify'} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#2DD4BF] px-5 py-3 text-base font-semibold text-black hover:bg-[#14B8A6] active:scale-[0.98] transition-fluid"><ShieldCheck size={18} /> Continue to verifier <ArrowRight size={18} /></Link>
    </main>
  );
}
