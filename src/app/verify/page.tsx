'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Copy, Cpu, Database, Eye, FileText, LockKey, QrCode, ShieldCheck, ShieldWarning, UploadSimple, WarningCircle, X } from '@phosphor-icons/react';
import { SAMPLE_DOCUMENTS, SampleDocument } from '@/lib/sampleDocs';
import { BAKED_LEDGER_ROWS, computeSha256, LedgerRecord, registerDocumentOnLedger, VerificationResponse, verifyDocumentOnLedger } from '@/lib/ledger';
import { HolderCredential, makeCredentialId, saveHolderCredential } from '@/lib/credentials';

type PipelineStep = 'idle' | 'reading' | 'hashing' | 'querying' | 'complete';

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

function downloadSamplePdf(doc: SampleDocument) {
  const bytes = base64ToArrayBuffer(doc.base64Data);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = doc.fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'samples' | 'upload'>('samples');
  const [selectedSample, setSelectedSample] = useState<SampleDocument>(SAMPLE_DOCUMENTS[0]);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [liveTamperActive, setLiveTamperActive] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SampleDocument | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerDocName, setRegisterDocName] = useState('Official Document');
  const [registerIssuer, setRegisterIssuer] = useState('Accredited Authority');
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);
  const [lastRegisteredRecord, setLastRegisteredRecord] = useState<LedgerRecord | null>(null);
  const [qrHint, setQrHint] = useState('');

  useEffect(() => {
    const hash = searchParams.get('hash');
    if (!hash) return;
    setPipelineStep('querying');
    verifyDocumentOnLedger(hash).then((result) => {
      setVerificationResult(result);
      setPipelineStep('complete');
      setQrHint('Verification request received from the holder credential QR.');
    }).catch(() => setPipelineStep('idle'));
  }, [searchParams]);

  const runVerification = async (fileBuffer: ArrayBuffer, isTamperedSample = false) => {
    try {
      setPipelineStep('reading');
      setVerificationResult(null);
      setRegisterSuccessMsg(null);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setPipelineStep('hashing');
      let computedHash = await computeSha256(fileBuffer);
      if (liveTamperActive && !isTamperedSample) {
        const modified = new Uint8Array(fileBuffer.slice(0));
        if (modified.length > 10) modified[10] ^= 0xff;
        computedHash = await computeSha256(modified.buffer);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
      setPipelineStep('querying');
      const expectedRecord = lastRegisteredRecord ?? BAKED_LEDGER_ROWS.find((row) => row.doc_name === selectedSample.name) ?? null;
      const response = await verifyDocumentOnLedger(computedHash, isTamperedSample, liveTamperActive ? expectedRecord : null);
      await new Promise((resolve) => setTimeout(resolve, 250));
      setVerificationResult(response);
      setPipelineStep('complete');
    } catch (error) {
      console.error('Verification error:', error);
      setPipelineStep('idle');
    }
  };

  const handleVerifySample = async (sample: SampleDocument) => {
    setSelectedSample(sample);
    await runVerification(base64ToArrayBuffer(sample.base64Data), sample.isTamperedSample);
  };

  const handleUpload = async (file: File) => {
    setCustomFile(file);
    setRegisterDocName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Official Document');
    await runVerification(await file.arrayBuffer());
  };

  const registerCurrentFile = async () => {
    if (!customFile || !verificationResult?.computedHash) return;
    setIsRegistering(true);
    setRegisterSuccessMsg(null);
    try {
      const record = await registerDocumentOnLedger({
        doc_hash: verificationResult.computedHash,
        doc_name: registerDocName.trim() || customFile.name,
        issuer: registerIssuer.trim() || 'Accredited Authority',
      });
      const credential: HolderCredential = {
        credentialId: makeCredentialId(),
        recordId: record.id,
        studentName: 'Demo Holder',
        documentName: record.doc_name,
        issuer: record.issuer,
        issuedOn: record.issued_on,
        documentHash: record.doc_hash,
        status: 'valid',
        verificationPath: `/verify?hash=${encodeURIComponent(record.doc_hash)}`,
      };
      saveHolderCredential(credential);
      setLastRegisteredRecord(record);
      setRegisterSuccessMsg(`Document registered as ${credential.credentialId}.`);
      setVerificationResult({ outcome: 'valid', computedHash: record.doc_hash, expectedHash: record.doc_hash, record, isOfflineFallback: false, timestamp: new Date().toISOString() });
      setPipelineStep('complete');
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterSuccessMsg('Registration failed. Check the ledger connection and try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setActiveTab('upload');
    void handleUpload(file);
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedHash(true);
    window.setTimeout(() => setCopiedHash(false), 1500);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-24 pt-36">
      <header className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#272727] bg-[#181818] px-3 py-1 text-xs font-mono text-[#2DD4BF]"><ShieldCheck size={14} /> Verifier portal</div>
        <h1 className="text-4xl font-bold text-white md:text-5xl">Verify a document in seconds</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#9B9B9B]">Upload the document or open this page from a holder QR code. SecureChain recomputes the SHA 256 fingerprint and checks the matching ledger record.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm"><Link href="/issuer" className="rounded-full border border-[#272727] bg-[#181818] px-4 py-2 text-[#9B9B9B] hover:text-white">Issuer</Link><Link href="/holder" className="rounded-full border border-[#272727] bg-[#181818] px-4 py-2 text-[#9B9B9B] hover:text-white">Holder</Link><span className="rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-2 text-[#2DD4BF]">Verifier</span></div>
      </header>

      {qrHint && <div className="mb-6 flex items-center gap-2 rounded-2xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-3 text-sm text-[#99F6E4]"><QrCode size={18} /> {qrHint}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <section className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#272727] pb-5">
            <div className="flex gap-2 rounded-2xl border border-[#272727] bg-[#1F1F1F] p-1"><button type="button" onClick={() => setActiveTab('samples')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === 'samples' ? 'bg-[#272727] text-white' : 'text-[#9B9B9B]'}`}>Samples</button><button type="button" onClick={() => setActiveTab('upload')} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === 'upload' ? 'bg-[#272727] text-white' : 'text-[#9B9B9B]'}`}>Upload</button></div>
            <label className="flex items-center gap-2 text-xs text-[#9B9B9B]"><span>Simulate file tampering</span><input type="checkbox" checked={liveTamperActive} onChange={(event) => setLiveTamperActive(event.target.checked)} /></label>
          </div>

          {activeTab === 'samples' && <div className="grid gap-4 md:grid-cols-3">{SAMPLE_DOCUMENTS.map((doc) => <div key={doc.id} className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-5"><div className="mb-3 flex items-center justify-between gap-2"><span className="text-xs text-[#9B9B9B]">{doc.category}</span><span className="text-xs text-emerald-300">{doc.expectedOutcome === 'tampered' ? 'Tampered' : 'Valid'}</span></div><h3 className="text-base font-bold text-white">{doc.name}</h3><p className="mt-2 text-xs leading-relaxed text-[#9B9B9B]">{doc.description}</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => setPreviewDocument(doc)} className="rounded-lg bg-[#272727] px-3 py-2 text-xs text-white"><Eye size={13} className="mr-1 inline" />Preview</button><button type="button" onClick={() => void handleVerifySample(doc)} className="rounded-lg bg-[#2DD4BF] px-3 py-2 text-xs font-semibold text-black">Verify</button></div>{doc.expectedOutcome === 'valid' && <button type="button" onClick={() => downloadSamplePdf(doc)} className="mt-2 text-xs text-[#9B9B9B] hover:text-white">Save PDF</button>}</div>)}</div>}

          {activeTab === 'upload' && <div className="space-y-4">
            <div onDragOver={(event) => { event.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={(event) => { event.preventDefault(); setIsDragOver(false); const file = event.dataTransfer.files?.[0]; if (file) void handleUpload(file); }} className={`rounded-2xl border-2 border-dashed p-10 text-center ${isDragOver ? 'border-[#2DD4BF] bg-[#1F1F1F]' : 'border-[#313131] bg-[#1F1F1F]'}`}>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              <UploadSimple size={28} className="mx-auto text-[#2DD4BF]" />
              <h2 className="mt-3 text-xl font-bold text-white">Choose a document to verify</h2>
              <p className="mt-2 text-sm text-[#9B9B9B]">The SHA 256 fingerprint is computed in your browser.</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 rounded-2xl bg-[#2DD4BF] px-4 py-3 text-base font-semibold text-black">Browse files</button>
            </div>
            {customFile && <div className="rounded-2xl border border-[#272727] bg-[#1F1F1F] p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-white">{customFile.name}</p><p className="text-xs text-[#9B9B9B]">Ready for SHA 256 verification</p></div><button type="button" onClick={() => void handleUpload(customFile)} className="rounded-full bg-[#272727] px-3 py-2 text-xs font-semibold text-white">Verify again</button></div></div>}
          </div>}

          {pipelineStep !== 'idle' && <div className="mt-8 border-t border-[#272727] pt-6"><div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl border border-[#272727] bg-[#1F1F1F] p-3"><FileText className="text-[#2DD4BF]" /><span className="mt-2 block text-sm font-semibold text-white">Read document</span></div><div className="rounded-xl border border-[#272727] bg-[#1F1F1F] p-3"><Cpu className="text-[#2DD4BF]" /><span className="mt-2 block text-sm font-semibold text-white">Compute SHA 256</span></div><div className="rounded-xl border border-[#272727] bg-[#1F1F1F] p-3"><Database className="text-[#2DD4BF]" /><span className="mt-2 block text-sm font-semibold text-white">Check ledger</span></div></div></div>}

          {verificationResult && pipelineStep === 'complete' && <div className="mt-6 rounded-3xl border border-[#272727] bg-[#1F1F1F] p-6">
            <div className="flex items-center gap-3"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${verificationResult.outcome === 'valid' ? 'bg-emerald-500/10 text-emerald-300' : verificationResult.outcome === 'tampered' ? 'bg-rose-500/10 text-rose-300' : verificationResult.outcome === 'revoked' ? 'bg-orange-500/10 text-orange-300' : 'bg-amber-500/10 text-amber-300'}`}>{verificationResult.outcome === 'valid' ? <CheckCircle size={28} /> : verificationResult.outcome === 'tampered' ? <ShieldWarning size={28} /> : <WarningCircle size={28} />}</span><div><h2 className="text-xl font-bold text-white">{verificationResult.outcome === 'valid' ? 'Valid document' : verificationResult.outcome === 'tampered' ? 'Tampered document' : verificationResult.outcome === 'revoked' ? 'Revoked document' : 'Document not found'}</h2><p className="text-sm text-[#9B9B9B]">{verificationResult.outcome === 'valid' ? 'The submitted fingerprint matches the registered record.' : verificationResult.outcome === 'tampered' ? 'The submitted fingerprint does not match the registered record.' : verificationResult.outcome === 'revoked' ? 'The issuer has marked this credential as revoked.' : 'No matching record exists for this fingerprint.'}</p></div></div>
            {verificationResult.record && <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><span className="block text-xs text-[#9B9B9B]">Document</span><span className="font-semibold text-white">{verificationResult.record.doc_name}</span></div><div><span className="block text-xs text-[#9B9B9B]">Issuer</span><span className="font-semibold text-white">{verificationResult.record.issuer}</span></div><div><span className="block text-xs text-[#9B9B9B]">Block</span><span className="font-mono text-sm text-[#38BDF8]">{verificationResult.record.block_ref}</span></div><div><span className="block text-xs text-[#9B9B9B]">Status</span><span className="font-semibold text-white">{verificationResult.record.status}</span></div></div>}
            <div className="mt-5 rounded-2xl border border-[#272727] bg-[#181818] p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#9B9B9B]">Computed SHA 256</span><button type="button" onClick={() => copyToClipboard(verificationResult.computedHash)} className="text-xs text-[#9B9B9B]">{copiedHash ? 'Copied' : 'Copy'} <Copy size={12} /></button></div><code className="mt-2 block break-all text-xs font-mono text-[#2DD4BF]">{verificationResult.computedHash}</code></div>
            {verificationResult.expectedHash && verificationResult.outcome === 'tampered' && <div className="mt-4 rounded-2xl border border-rose-500/30 bg-[#181818] p-4"><span className="block text-xs text-rose-300">Expected SHA 256</span><code className="mt-2 block break-all text-xs font-mono text-[#9B9B9B]">{verificationResult.expectedHash}</code></div>}
            {registerSuccessMsg && <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">{registerSuccessMsg}</div>}
            {verificationResult.outcome === 'not_found' && customFile && <div className="mt-5 rounded-2xl border border-[#38BDF8]/30 bg-[#38BDF8]/10 p-5"><h3 className="font-bold text-white">Issuer demo</h3><p className="mt-1 text-sm text-[#9B9B9B]">Register this file as an authorised issuer, then it can be verified later.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><input value={registerDocName} onChange={(event) => setRegisterDocName(event.target.value)} className="rounded-xl border border-[#313131] bg-[#181818] px-3 py-2 text-sm text-white" placeholder="Document name" /><input value={registerIssuer} onChange={(event) => setRegisterIssuer(event.target.value)} className="rounded-xl border border-[#313131] bg-[#181818] px-3 py-2 text-sm text-white" placeholder="Issuer" /></div><button type="button" disabled={isRegistering} onClick={() => void registerCurrentFile()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#38BDF8] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-50">{isRegistering ? 'Registering...' : 'Register as issuer'} <ArrowRight size={15} /></button></div>}
          </div>}
        </section>

        <aside className="space-y-4"><div className="rounded-3xl border border-[#272727] bg-[#181818] p-6"><LockKey size={22} className="text-[#2DD4BF]" /><h2 className="mt-3 text-xl font-bold text-white">Privacy by design</h2><p className="mt-2 text-sm leading-relaxed text-[#9B9B9B]">The prototype compares fingerprints instead of putting the document itself into the verification result.</p></div><div className="rounded-3xl border border-[#272727] bg-[#181818] p-6"><QrCode size={22} className="text-[#2DD4BF]" /><h2 className="mt-3 text-xl font-bold text-white">QR ready</h2><p className="mt-2 text-sm leading-relaxed text-[#9B9B9B]">A holder QR can open this verifier with the credential fingerprint in the URL.</p><Link href="/holder" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2DD4BF]">Open holder wallet <ArrowRight size={14} /></Link></div></aside>
      </div>

      {previewDocument && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="w-full max-w-2xl rounded-3xl border border-[#272727] bg-[#181818] p-6"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-white">{previewDocument.name}</h2><p className="mt-1 text-sm text-[#9B9B9B]">{previewDocument.issuer}</p></div><button type="button" onClick={() => setPreviewDocument(null)} className="rounded-full bg-[#272727] p-2 text-white"><X size={16} /></button></div><p className="mt-5 text-sm leading-relaxed text-[#9B9B9B]">{previewDocument.description}</p><button type="button" onClick={() => { const doc = previewDocument; setPreviewDocument(null); void handleVerifySample(doc); }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-4 py-2.5 text-sm font-semibold text-black">Verify this document <ArrowRight size={15} /></button></div></div>}
    </main>
  );
}
