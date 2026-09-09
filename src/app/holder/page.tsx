'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Certificate, Copy, FileText, QrCode, ShieldCheck } from '@phosphor-icons/react';
import * as QRCode from 'qrcode';
import { getHolderCredentials, HolderCredential } from '@/lib/credentials';

export default function HolderPage() {
  const [credential, setCredential] = useState<HolderCredential | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const current = getHolderCredentials()[0];
    setCredential(current ?? null);
    if (current) {
      QRCode.toDataURL(`${window.location.origin}${current.verificationPath}`, { margin: 2, width: 220 }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
    }
  }, []);

  const copyId = async () => {
    if (!credential) return;
    await navigator.clipboard.writeText(credential.credentialId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-24 pt-36">
      <div className="mb-10 max-w-2xl">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#272727] bg-[#181818] px-3 py-1 text-xs font-mono text-[#2DD4BF]"><ShieldCheck size={14} /> Holder wallet</span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Your verified credential</h1>
        <p className="text-base leading-relaxed text-[#9B9B9B]">The holder keeps the credential details and verification link. A verifier can use the QR code or the original file to check the ledger record.</p>
      </div>
      {!credential ? (
        <div className="rounded-3xl border border-[#272727] bg-[#181818] p-8"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F1F1F] text-[#2DD4BF]"><FileText size={20} /></span><div><h2 className="text-xl font-bold text-white">No credential yet</h2><p className="mt-1 text-sm text-[#9B9B9B]">Register a document first as an issuer.</p></div></div><Link href="/issuer" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2DD4BF] px-4 py-3 text-base font-semibold text-black hover:bg-[#14B8A6] transition-fluid">Open issuer portal <ArrowRight size={18} /></Link></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2DD4BF]/10 text-[#2DD4BF]"><Certificate size={24} weight="bold" /></span><div><h2 className="text-2xl font-bold text-white">{credential.documentName}</h2><p className="text-sm text-[#9B9B9B]">Issued to {credential.studentName}</p></div></div><span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">VALID</span></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4"><span className="block text-xs text-[#9B9B9B]">Issuer</span><span className="mt-1 block text-sm font-semibold text-white">{credential.issuer}</span></div>
              <div className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4"><span className="block text-xs text-[#9B9B9B]">Issued on</span><span className="mt-1 block font-mono text-sm text-white">{credential.issuedOn}</span></div>
              <div className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4 sm:col-span-2"><span className="block text-xs text-[#9B9B9B]">Credential ID</span><div className="mt-1 flex items-center justify-between gap-3"><span className="font-mono text-sm text-white">{credential.credentialId}</span><button type="button" onClick={copyId} className="inline-flex items-center gap-1 rounded-lg bg-[#272727] px-2.5 py-1.5 text-xs text-[#9B9B9B] hover:text-white transition-fluid">{copied ? 'Copied' : 'Copy'} <Copy size={13} /></button></div></div>
              <div className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4 sm:col-span-2"><span className="block text-xs text-[#9B9B9B]">Document SHA 256</span><span className="mt-1 block break-all font-mono text-xs text-[#2DD4BF]">{credential.documentHash}</span></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/verify" className="inline-flex items-center gap-2 rounded-2xl bg-[#2DD4BF] px-4 py-3 text-sm font-semibold text-black hover:bg-[#14B8A6] transition-fluid">Open verifier <ArrowRight size={16} /></Link><Link href={credential.verificationPath} className="inline-flex items-center gap-2 rounded-2xl border border-[#313131] bg-[#272727] px-4 py-3 text-sm font-semibold text-white hover:bg-[#313131] transition-fluid">Open verification link</Link></div>
          </section>
          <aside className="rounded-3xl border border-[#272727] bg-[#181818] p-6 flex flex-col items-center text-center"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1F1F1F] text-[#2DD4BF]"><QrCode size={20} /></div><h2 className="text-xl font-bold text-white">Verification QR</h2><p className="mt-2 text-sm leading-relaxed text-[#9B9B9B]">Scan this code to open the verifier for this credential.</p>{qrDataUrl ? <img src={qrDataUrl} alt="SecureChain verification QR" className="mt-6 rounded-2xl bg-white p-3" /> : <div className="mt-6 h-[220px] w-[220px] rounded-2xl bg-[#1F1F1F]" />}<p className="mt-4 break-all text-xs text-[#9B9B9B]">{credential.verificationPath}</p></aside>
        </div>
      )}
    </main>
  );
}
