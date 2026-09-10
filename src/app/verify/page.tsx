'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, FileText, ShieldCheck, ShieldWarning, UploadSimple, WarningCircle } from '@phosphor-icons/react';
import { computeSha256, verifyDocumentOnLedger, VerificationResponse } from '@/lib/ledger';

function VerifyContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [step, setStep] = useState('');
  const [tamper, setTamper] = useState(false);

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) return;
    setStep('Checking ledger...');
    verifyDocumentOnLedger(hash).then((response) => { setResult(response); setStep('Complete'); }).catch(() => setStep('Verification failed'));
  }, [searchParams]);

  const verifyUpload = async (file: File) => {
    setCustomFile(file);
    setResult(null);
    setStep('Reading document...');
    try {
      const originalBuffer = await file.arrayBuffer();
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStep('Computing SHA 256...');
      let buffer = originalBuffer;
      if (tamper) {
        const changed = new Uint8Array(originalBuffer.slice(0));
        if (changed.length > 0) changed[0] ^= 255;
        buffer = changed.buffer;
      }
      const hash = await computeSha256(buffer);
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStep('Checking ledger...');
      const response = await verifyDocumentOnLedger(hash);
      setResult(response);
      setStep('Complete');
    } catch (error) {
      console.error('Verification error:', error);
      setStep('Verification failed');
    }
  };

  const resultTitle = result?.outcome === 'valid' ? 'Valid document' : result?.outcome === 'tampered' ? 'Tampered document' : result?.outcome === 'revoked' ? 'Revoked document' : 'Document not found';

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-24 pt-36">
      <header className="mb-10 max-w-2xl"><span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#272727] bg-[#181818] px-3 py-1 text-xs font-mono text-[#2DD4BF]"><ShieldCheck size={14} /> Verifier</span><h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Verify a document</h1><p className="mt-4 text-base leading-relaxed text-[#9B9B9B]">Upload the document received from the holder. SecureChain computes its SHA 256 fingerprint and checks the active ledger record.</p></header>
      <section className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#272727] pb-5"><div><h2 className="text-xl font-bold text-white">Document check</h2><p className="text-sm text-[#9B9B9B]">Only registered documents can return a valid result.</p></div><label className="flex items-center gap-2 text-xs text-[#9B9B9B]"><span>Test a changed file</span><input type="checkbox" checked={tamper} onChange={(event) => setTamper(event.target.checked)} /></label></div>
        <div className="rounded-2xl border-2 border-dashed border-[#313131] bg-[#1F1F1F] p-10 text-center"><input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void verifyUpload(file); }} /><UploadSimple size={30} className="mx-auto text-[#2DD4BF]" /><h2 className="mt-3 text-xl font-bold text-white">Choose a document</h2><p className="mt-2 text-sm text-[#9B9B9B]">The file is read locally and its fingerprint is calculated in your browser.</p><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 rounded-xl bg-[#2DD4BF] px-5 py-3 font-semibold text-black">Browse files</button>{customFile && <p className="mt-4 text-sm text-[#9B9B9B]">Selected: {customFile.name}</p>}</div>
        {step && <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4 text-sm text-[#9B9B9B]"><FileText size={20} className="text-[#2DD4BF]" /> {step}</div>}
        {result && <div className="mt-6 rounded-3xl border border-[#272727] bg-[#1F1F1F] p-6"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181818] text-[#2DD4BF]">{result.outcome === 'valid' ? <CheckCircle size={28} /> : result.outcome === 'tampered' ? <ShieldWarning size={28} /> : <WarningCircle size={28} />}</span><div><h2 className="text-xl font-bold text-white">{resultTitle}</h2><p className="text-sm text-[#9B9B9B]">{result.record?.doc_name ?? 'No active ledger record'}</p></div></div><div className="mt-5 rounded-2xl border border-[#272727] bg-[#181818] p-4"><span className="text-xs text-[#9B9B9B]">Computed SHA 256</span><code className="mt-2 block break-all text-xs font-mono text-[#2DD4BF]">{result.computedHash}</code></div>{result.record && <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm"><p><span className="text-[#9B9B9B]">Issuer: </span><span className="text-white">{result.record.issuer}</span></p><p><span className="text-[#9B9B9B]">Status: </span><span className="text-white">{result.record.status}</span></p></div>}</div>}
      </section>
      <div className="mt-6 flex justify-center gap-3 text-sm"><Link href="/issuer" className="text-[#9B9B9B] hover:text-white">Issuer</Link><span className="text-[#313131]">•</span><Link href="/holder" className="text-[#9B9B9B] hover:text-white">Holder</Link></div>
    </main>
  );
}

export default function VerifyPage() { return <Suspense fallback={<main className="min-h-screen bg-black" />}><VerifyContent /></Suspense>; }
