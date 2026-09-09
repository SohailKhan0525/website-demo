'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, FileText, QrCode, ShieldCheck, ShieldWarning, UploadSimple, WarningCircle } from '@phosphor-icons/react';
import { SAMPLE_DOCUMENTS, SampleDocument } from '@/lib/sampleDocs';
import { computeSha256, verifyDocumentOnLedger, VerificationResponse } from '@/lib/ledger';

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'samples' | 'upload'>('samples');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleDocument>(SAMPLE_DOCUMENTS[0]);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [step, setStep] = useState('');
  const [tamper, setTamper] = useState(false);

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) return;
    setStep('Checking ledger...');
    verifyDocumentOnLedger(hash).then((response) => {
      setResult(response);
      setStep('Complete');
    }).catch(() => setStep('Verification failed'));
  }, [searchParams]);

  const verifyFile = async (buffer: ArrayBuffer, sample?: SampleDocument) => {
    setStep('Reading document...');
    setResult(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStep('Computing SHA 256...');
      let hash = await computeSha256(buffer);
      if (tamper && !sample?.isTamperedSample) {
        const changed = new Uint8Array(buffer.slice(0));
        if (changed.length > 10) changed[10] ^= 255;
        hash = await computeSha256(changed.buffer);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
      setStep('Checking ledger...');
      const response = await verifyDocumentOnLedger(hash, Boolean(sample?.isTamperedSample));
      setResult(response);
      setStep('Complete');
    } catch (error) {
      console.error('Verification error:', error);
      setStep('Verification failed');
    }
  };

  const verifySample = async (sample: SampleDocument) => {
    setSelectedSample(sample);
    await verifyFile(base64ToArrayBuffer(sample.base64Data), sample);
  };

  const verifyUpload = async (file: File) => {
    setCustomFile(file);
    await verifyFile(await file.arrayBuffer());
  };

  const resultTitle = result?.outcome === 'valid'
    ? 'Valid document'
    : result?.outcome === 'tampered'
      ? 'Tampered document'
      : result?.outcome === 'revoked'
        ? 'Revoked document'
        : 'Document not found';

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-24 pt-36">
      <header className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#272727] bg-[#181818] px-3 py-1 text-xs font-mono text-[#2DD4BF]"><ShieldCheck size={14} /> Verifier portal</div>
        <h1 className="text-4xl font-bold text-white md:text-5xl">Verify a document in seconds</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#9B9B9B]">Upload a document or open this page from a holder QR code. SecureChain computes the SHA 256 fingerprint and checks the ledger record.</p>
        <div className="mt-6 flex justify-center gap-2 text-sm"><Link href="/issuer" className="rounded-full border border-[#272727] bg-[#181818] px-4 py-2 text-[#9B9B9B]">Issuer</Link><Link href="/holder" className="rounded-full border border-[#272727] bg-[#181818] px-4 py-2 text-[#9B9B9B]">Holder</Link></div>
      </header>

      <section className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#272727] pb-5">
          <div className="flex gap-2 rounded-2xl border border-[#272727] bg-[#1F1F1F] p-1">
            <button type="button" onClick={() => setActiveTab('samples')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === 'samples' ? 'bg-[#272727] text-white' : 'text-[#9B9B9B]'}`}>Samples</button>
            <button type="button" onClick={() => setActiveTab('upload')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === 'upload' ? 'bg-[#272727] text-white' : 'text-[#9B9B9B]'}`}>Upload</button>
          </div>
          <label className="flex items-center gap-2 text-xs text-[#9B9B9B]"><span>Simulate file tampering</span><input type="checkbox" checked={tamper} onChange={(event) => setTamper(event.target.checked)} /></label>
        </div>

        {activeTab === 'samples' ? (
          <div className="grid gap-4 md:grid-cols-3">
            {SAMPLE_DOCUMENTS.map((sample) => (
              <article key={sample.id} className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-5">
                <span className="text-xs text-[#9B9B9B]">{sample.category}</span>
                <h2 className="mt-2 text-base font-bold text-white">{sample.name}</h2>
                <p className="mt-2 text-xs leading-relaxed text-[#9B9B9B]">{sample.description}</p>
                <button type="button" onClick={() => void verifySample(sample)} className="mt-4 rounded-xl bg-[#2DD4BF] px-4 py-2 text-sm font-semibold text-black">Verify</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-[#313131] bg-[#1F1F1F] p-10 text-center">
            <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void verifyUpload(file); }} />
            <UploadSimple size={30} className="mx-auto text-[#2DD4BF]" />
            <h2 className="mt-3 text-xl font-bold text-white">Choose a document</h2>
            <p className="mt-2 text-sm text-[#9B9B9B]">The fingerprint is computed in your browser.</p>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 rounded-xl bg-[#2DD4BF] px-5 py-3 font-semibold text-black">Browse files</button>
            {customFile && <p className="mt-4 text-sm text-[#9B9B9B]">Selected: {customFile.name}</p>}
          </div>
        )}

        {step && <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4 text-sm text-[#9B9B9B]"><FileText size={20} className="text-[#2DD4BF]" /> {step}</div>}

        {result && (
          <div className="mt-6 rounded-3xl border border-[#272727] bg-[#1F1F1F] p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181818] text-[#2DD4BF]">{result.outcome === 'valid' ? <CheckCircle size={28} /> : result.outcome === 'tampered' ? <ShieldWarning size={28} /> : <WarningCircle size={28} />}</span>
              <div><h2 className="text-xl font-bold text-white">{resultTitle}</h2><p className="text-sm text-[#9B9B9B]">{result.record?.doc_name ?? 'No matching ledger record'}</p></div>
            </div>
            <div className="mt-5 rounded-2xl border border-[#272727] bg-[#181818] p-4"><span className="text-xs text-[#9B9B9B]">Computed SHA 256</span><code className="mt-2 block break-all text-xs font-mono text-[#2DD4BF]">{result.computedHash}</code></div>
            {result.record && <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm"><p><span className="text-[#9B9B9B]">Issuer: </span><span className="text-white">{result.record.issuer}</span></p><p><span className="text-[#9B9B9B]">Status: </span><span className="text-white">{result.record.status}</span></p></div>}
          </div>
        )}
      </section>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6B6B6B]"><QrCode size={14} /> QR credentials open the same verifier flow.</div>
      <span className="sr-only">Selected sample: {selectedSample.name}</span>
    </main>
  );
}

export default function VerifyPage() {
  return <Suspense fallback={<main className="min-h-screen bg-black" />}><VerifyContent /></Suspense>;
}
