'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, Fingerprint, UploadSimple } from '@phosphor-icons/react';
import { computeSha256, registerDocumentOnLedger, LedgerRecord } from '@/lib/ledger';
import { HolderCredential, makeCredentialId, saveHolderCredential } from '@/lib/credentials';

export default function IssuerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState('Aryan Sharma');
  const [documentType, setDocumentType] = useState('B.Tech Provisional Certificate');
  const [issuer, setIssuer] = useState('Sree Dattha Engineering and Science Technology');
  const [record, setRecord] = useState<LedgerRecord | null>(null);
  const [credential, setCredential] = useState<HolderCredential | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  const canRegister = useMemo(() => Boolean(file && studentName.trim() && documentType.trim() && issuer.trim()), [file, studentName, documentType, issuer]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    setRecord(null);
    setCredential(null);
    setStatus('idle');
    setError('');
  };

  const register = async () => {
    if (!file || !canRegister) return;
    setStatus('processing');
    setError('');
    try {
      const buffer = await file.arrayBuffer();
      const hash = await computeSha256(buffer);
      const ledgerRecord = await registerDocumentOnLedger({
        doc_hash: hash,
        doc_name: documentType.trim(),
        issuer: issuer.trim(),
      });
      const newCredential: HolderCredential = {
        credentialId: makeCredentialId(),
        recordId: ledgerRecord.id,
        studentName: studentName.trim(),
        documentName: documentType.trim(),
        issuer: issuer.trim(),
        issuedOn: ledgerRecord.issued_on,
        documentHash: hash,
        status: 'valid',
        verificationPath: `/verify?hash=${encodeURIComponent(hash)}`,
      };
      saveHolderCredential(newCredential);
      setRecord(ledgerRecord);
      setCredential(newCredential);
      setStatus('done');
    } catch {
      setStatus('error');
      setError('Registration failed. Please try the document again.');
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-24 pt-36">
      <div className="mb-10 max-w-2xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#272727] bg-[#181818] px-3 py-1 text-xs font-mono text-[#2DD4BF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" /> Issuer portal
        </span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Register a document with SecureChain</h1>
        <p className="text-base leading-relaxed text-[#9B9B9B]">An authorized issuer creates the document fingerprint first. The holder then receives a credential that can be verified later.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F1F1F] text-[#2DD4BF]"><FileText size={20} weight="bold" /></span>
            <div><h2 className="text-xl font-bold text-white">Issue credential</h2><p className="text-sm text-[#9B9B9B]">Register the official document</p></div>
          </div>

          <div className="space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white">Student name</span><input value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full rounded-2xl border border-[#313131] bg-[#1F1F1F] px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white">Document type</span><input value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full rounded-2xl border border-[#313131] bg-[#1F1F1F] px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40" /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white">Issuing authority</span><input value={issuer} onChange={(e) => setIssuer(e.target.value)} className="w-full rounded-2xl border border-[#313131] bg-[#1F1F1F] px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/40" /></label>

            <label className="block cursor-pointer rounded-2xl border border-dashed border-[#313131] bg-[#1F1F1F] p-5 hover:border-[#2DD4BF]/60 transition-fluid">
              <input type="file" onChange={handleFile} className="sr-only" />
              <span className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#272727] text-[#2DD4BF]"><UploadSimple size={20} weight="bold" /></span><span><span className="block text-sm font-semibold text-white">{file ? file.name : 'Choose certificate file'}</span><span className="block text-xs text-[#9B9B9B]">The file is hashed in the browser.</span></span></span>
            </label>

            <button type="button" disabled={!canRegister || status === 'processing'} onClick={register} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2DD4BF] px-4 py-3 text-base font-semibold text-black transition-fluid hover:bg-[#14B8A6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
              {status === 'processing' ? 'Registering document...' : 'Register certificate'} <ArrowRight size={18} weight="bold" />
            </button>
            {error && <p className="text-sm text-rose-400" role="alert">{error}</p>}
          </div>
        </section>

        <section className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F1F1F] text-[#38BDF8]"><Fingerprint size={20} weight="bold" /></span><div><h2 className="text-xl font-bold text-white">Registration proof</h2><p className="text-sm text-[#9B9B9B]">What gets linked to the holder</p></div></div>

          {!record && <div className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-5 text-sm leading-relaxed text-[#9B9B9B]">Register a certificate to generate its SHA 256 fingerprint, ledger record, block reference, and holder credential.</div>}

          {record && credential && <div className="space-y-5">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"><div className="flex items-center gap-2 text-emerald-300"><CheckCircle size={20} weight="fill" /><span className="font-semibold">Certificate registered</span></div><p className="mt-2 text-sm text-[#A7F3D0]">The credential is now ready for the holder.</p></div>
            <div className="space-y-4 rounded-2xl border border-[#272727] bg-[#1F1F1F] p-5 text-sm"><div><span className="block text-xs text-[#9B9B9B]">Credential ID</span><span className="font-mono text-white">{credential.credentialId}</span></div><div><span className="block text-xs text-[#9B9B9B]">Block reference</span><span className="font-mono text-[#38BDF8]">{record.block_ref}</span></div><div><span className="block text-xs text-[#9B9B9B]">SHA 256</span><span className="break-all font-mono text-[#2DD4BF]">{record.doc_hash}</span></div></div>
            <Link href="/holder" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#313131] bg-[#272727] px-4 py-3 text-sm font-semibold text-white hover:bg-[#313131] transition-fluid">Open holder credential <ArrowRight size={16} weight="bold" /></Link>
          </div>}
        </section>
      </div>
    </main>
  );
}
