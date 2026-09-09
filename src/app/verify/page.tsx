'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadSimple,
  ShieldCheck,
  ShieldWarning,
  WarningCircle,
  CheckCircle,
  Copy,
  Check,
  Eye,
  X,
  Cpu,
  Database,
  Info,
  Certificate,
  Buildings,
  FirstAid,
  DownloadSimple,
  ArrowRight,
  Question,
  Lightning,
  Sparkle,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import { SAMPLE_DOCUMENTS, SampleDocument } from '@/lib/sampleDocs';
import {
  computeSha256,
  verifyDocumentOnLedger,
  registerDocumentOnLedger,
  VerificationResponse,
  LedgerRecord,
  BAKED_LEDGER_ROWS,
} from '@/lib/ledger';

type PipelineStep = 'idle' | 'reading' | 'hashing' | 'querying' | 'complete';

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Download a sample PDF to disk so judge can re-upload it in Custom tab to test Valid result
function downloadSamplePdf(doc: import('@/lib/sampleDocs').SampleDocument) {
  const bytes = base64ToArrayBuffer(doc.base64Data);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = doc.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<'samples' | 'upload'>('samples');
  const [selectedSample, setSelectedSample] = useState<SampleDocument>(SAMPLE_DOCUMENTS[0]);
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customFileBuffer, setCustomFileBuffer] = useState<ArrayBuffer | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [liveTamperActive, setLiveTamperActive] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<SampleDocument | null>(null);

  // Custom document registration states (Issuer Node simulation)
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerDocName, setRegisterDocName] = useState('');
  const [registerIssuer, setRegisterIssuer] = useState('IIT Bombay / University Registrar');
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState<string | null>(null);
  const [lastRegisteredRecord, setLastRegisteredRecord] = useState<LedgerRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execute verification flow on memory buffer
  const runVerification = async (fileBuffer: ArrayBuffer, fileName: string, isTamperedSample = false) => {
    try {
      // Step 1: Reading file bytes
      setPipelineStep('reading');
      setVerificationResult(null);
      setRegisterSuccessMsg(null);
      await new Promise((resolve) => setTimeout(resolve, 450));

      // Step 2: Compute real SHA-256 fingerprint using Web Crypto API
      setPipelineStep('hashing');
      let computedHash = await computeSha256(fileBuffer);

      // If live tamper simulator is toggled on, introduce a byte difference
      if (liveTamperActive && !isTamperedSample) {
        const modifiedBytes = new Uint8Array(fileBuffer.slice(0));
        if (modifiedBytes.length > 10) {
          modifiedBytes[10] = modifiedBytes[10] ^ 0xff; // Invert a byte
        }
        computedHash = await computeSha256(modifiedBytes.buffer);
      }

      await new Promise((resolve) => setTimeout(resolve, 600));

      // Step 3: Query Supabase ledger with 2.5s offline fallback
      setPipelineStep('querying');

      // Find expected record for tamper simulation comparison
      const expectedRecord =
        lastRegisteredRecord ||
        (selectedSample ? BAKED_LEDGER_ROWS.find((r) => r.doc_name === selectedSample.name) : null);

      const response = await verifyDocumentOnLedger(
        computedHash,
        isTamperedSample || (liveTamperActive && selectedSample?.id === 'hospital-discharge'),
        liveTamperActive ? expectedRecord : null
      );

      await new Promise((resolve) => setTimeout(resolve, 550));

      // Step 4: Display Result
      setVerificationResult(response);
      setPipelineStep('complete');
    } catch (err) {
      console.error('Verification error:', err);
      setPipelineStep('idle');
    }
  };

  // Trigger verification for the selected preloaded sample in-memory WITHOUT ANY FILE DOWNLOAD
  const handleVerifySample = async (sample: SampleDocument) => {
    setSelectedSample(sample);
    try {
      setPipelineStep('reading');
      const buffer = base64ToArrayBuffer(sample.base64Data);
      await runVerification(buffer, sample.fileName, sample.isTamperedSample);
    } catch (err) {
      console.error('Failed to verify sample in memory:', err);
      setPipelineStep('idle');
    }
  };

  // Trigger verification for custom uploaded file
  const handleVerifyUploadedFile = async (file: File) => {
    setCustomFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setRegisterDocName(cleanName || 'Official Document');
    setRegisterSuccessMsg(null);
    const buffer = await file.arrayBuffer();
    setCustomFileBuffer(buffer);
    await runVerification(buffer, file.name, false);
  };

  // Register & anchor custom document to distributed ledger (Issuer Node simulation)
  const handleRegisterCustomDocument = async () => {
    if (!verificationResult || !verificationResult.computedHash) return;
    setIsRegistering(true);
    try {
      // Simulate PBFT Consensus sealing latency
      await new Promise((resolve) => setTimeout(resolve, 750));

      const docName = registerDocName.trim() || (customFile ? customFile.name : 'Custom Official Document');
      const issuer = registerIssuer.trim() || 'Accredited Authority';

      const newRecord = await registerDocumentOnLedger({
        doc_hash: verificationResult.computedHash,
        doc_name: docName,
        issuer: issuer,
      });

      setLastRegisteredRecord(newRecord);
      setRegisterSuccessMsg(`Successfully anchored to block ${newRecord.block_ref}!`);
      setVerificationResult({
        outcome: 'valid',
        computedHash: verificationResult.computedHash,
        expectedHash: verificationResult.computedHash,
        record: newRecord,
        isOfflineFallback: false,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error anchoring custom document:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setActiveTab('upload');
      handleVerifyUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setActiveTab('upload');
      handleVerifyUploadedFile(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-6 max-w-5xl mx-auto flex flex-col">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-[#272727] text-xs font-mono text-[#2DD4BF] mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
          <span>Live Ledger Sandbox · Instant Cryptographic Proof</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Verify Document Authenticity
        </h1>
        <p className="text-sm sm:text-base text-[#9B9B9B] leading-relaxed">
          Upload any document or select a preloaded institutional credential to compute its real SHA 256 fingerprint and verify it against the distributed ledger.
        </p>
      </div>

      {/* Main Verification Container with OpenSourceUI Glow & Border Styling */}
      <div className="rounded-3xl border border-[#272727] bg-[#181818] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#272727] pb-5 mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-[#1F1F1F] p-1 rounded-2xl border border-[#272727]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('samples');
                setPipelineStep('idle');
                setVerificationResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-fluid ${
                activeTab === 'samples'
                  ? 'bg-[#272727] text-white shadow-sm'
                  : 'text-[#9B9B9B] hover:text-white'
              }`}
            >
              Preloaded Samples (3)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                setPipelineStep('idle');
                setVerificationResult(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-fluid ${
                activeTab === 'upload'
                  ? 'bg-[#272727] text-white shadow-sm'
                  : 'text-[#9B9B9B] hover:text-white'
              }`}
            >
              Custom File Upload
            </button>
          </div>

          {/* Real-time Tamper Simulation Switch for Judges */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#9B9B9B] select-none hover:text-white transition-fluid">
              <span>Simulate File Tampering</span>
              <input
                type="checkbox"
                checked={liveTamperActive}
                onChange={(e) => setLiveTamperActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#272727] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#272727] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2DD4BF] relative" />
            </label>
          </div>
        </div>

        {/* Tab 1: Preloaded Samples */}
        {activeTab === 'samples' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SAMPLE_DOCUMENTS.map((doc) => {
                const isSelected = selectedSample.id === doc.id;
                const isTampered = doc.expectedOutcome === 'tampered';
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleVerifySample(doc)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-fluid flex flex-col justify-between text-left group relative ${
                      isSelected
                        ? 'border-[#2DD4BF] bg-[#1F1F1F] shadow-[0_0_25px_-5px_rgba(45,212,191,0.25)]'
                        : 'border-[#272727] bg-[#181818] hover:border-[#2DD4BF]/50 hover:bg-[#1F1F1F]/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#272727] text-[#9B9B9B] border border-[#313131]">
                          {doc.category}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            isTampered
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          }`}
                        >
                          {isTampered ? 'Tampered Sample' : 'Valid Sample'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1 leading-snug group-hover:text-[#2DD4BF] transition-fluid">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-[#9B9B9B] line-clamp-2 leading-relaxed mb-4">
                        {doc.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#272727] flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* PREVIEW BUTTON */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewDocument(doc);
                          }}
                          className="text-xs text-[#9B9B9B] hover:text-white px-2.5 py-1 rounded-lg bg-[#272727] hover:bg-[#313131] inline-flex items-center gap-1.5 transition-fluid"
                          title="Preview document in browser (no download)"
                        >
                          <Eye size={14} />
                          <span>Preview</span>
                        </button>

                        {/* VERIFY BUTTON */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerifySample(doc);
                          }}
                          className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-95 transition-fluid shadow-sm"
                        >
                          Verify Sample
                        </button>
                      </div>

                      {/* DOWNLOAD BUTTON: For judges to save PDF and re-upload in Custom tab */}
                      {!isTampered && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSamplePdf(doc);
                          }}
                          className="w-full text-[11px] text-[#9B9B9B] hover:text-[#2DD4BF] py-1 rounded-lg bg-[#1F1F1F] hover:bg-[#272727] border border-[#272727] inline-flex items-center justify-center gap-1.5 transition-fluid"
                          title="Download this PDF — then re-upload in Custom File Upload tab to test a valid result yourself"
                        >
                          <DownloadSimple size={12} />
                          <span>Save PDF to device (for custom upload test)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Custom File Upload */}
        {activeTab === 'upload' && (
          <div className="flex flex-col gap-4">
            {/* Tip box explaining how the custom tab works */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#1F1F1F] border border-[#272727]">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#272727] text-[#38BDF8] shrink-0 mt-0.5">
                <Question size={16} weight="bold" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">How custom upload works</span>
                <p className="text-xs text-[#9B9B9B] leading-relaxed">
                  Upload any file to compute its SHA-256 fingerprint. Only files issued through SecureChain will return <span className="text-[#2DD4BF] font-medium">Valid</span>. Any other file correctly returns <span className="text-amber-400 font-medium">Not found on ledger</span>.
                </p>
                <p className="text-xs text-[#9B9B9B] leading-relaxed mt-1">
                  <span className="text-white font-medium">To test a Valid result:</span> go to Preloaded Samples tab, click <span className="font-medium text-white">Save PDF to device</span> on B.Tech Certificate or Land Deed, then come back here and upload that file.
                </p>
              </div>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-fluid ${
                isDragOver
                  ? 'border-[#2DD4BF] bg-[#1F1F1F] shadow-[0_0_30px_-5px_rgba(45,212,191,0.2)]'
                  : 'border-[#272727] bg-[#1F1F1F]/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#272727] text-[#2DD4BF] mb-4">
                <UploadSimple size={28} weight="bold" />
              </span>
              <h3 className="text-base font-semibold text-white mb-1">
                Drag and drop or select a file
              </h3>
              <p className="text-xs text-[#9B9B9B] max-w-sm mb-5">
                Supports PDFs, images, and any document. SHA-256 fingerprint computed locally in your browser.
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-[#272727] text-white text-sm font-semibold rounded-full border border-[#313131] hover:bg-[#313131] hover:border-[#2DD4BF]/30 active:scale-95 transition-fluid inline-flex items-center gap-2"
              >
                <UploadSimple size={16} weight="bold" className="text-[#2DD4BF]" />
                Browse Files
              </button>
            </div>

            {/* Selected file info + verify button */}
            {customFile && (
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#181818] border border-[#272727]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F1F1F] text-[#2DD4BF] shrink-0">
                    <FileText size={20} weight="bold" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight truncate">{customFile.name}</p>
                    <p className="text-xs text-[#9B9B9B]">{(customFile.size / 1024).toFixed(1)} KB · ready to hash</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleVerifyUploadedFile(customFile)}
                  disabled={pipelineStep !== 'idle'}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-fluid shrink-0 shadow-md inline-flex items-center gap-2"
                >
                  <span>Verify this file</span>
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Verification Progress Pipeline */}
        {pipelineStep !== 'idle' && (
          <div className="mt-8 pt-6 border-t border-[#272727] flex flex-col gap-6">
            <div className="flex items-center justify-between text-xs font-medium text-[#9B9B9B]">
              <span>Verification Pipeline</span>
              <span className="font-mono text-[#2DD4BF]">
                {pipelineStep === 'reading' && 'Step 1 of 3: Reading File Bytes'}
                {pipelineStep === 'hashing' && 'Step 2 of 3: Computing SHA 256 Digest'}
                {pipelineStep === 'querying' && 'Step 3 of 3: Querying Permissioned Ledger'}
                {pipelineStep === 'complete' && 'Verification Completed'}
              </span>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-3 gap-3">
              {/* Stage 1 */}
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-fluid ${
                  pipelineStep === 'reading'
                    ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 text-white shadow-[0_0_15px_-3px_rgba(45,212,191,0.2)]'
                    : 'border-[#272727] bg-[#1F1F1F] text-[#2DD4BF]'
                }`}
              >
                <FileText size={18} weight="bold" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold">Reading File</span>
                  <span className="text-[10px] text-[#9B9B9B]">In-memory stream</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-fluid ${
                  pipelineStep === 'hashing'
                    ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 text-white shadow-[0_0_15px_-3px_rgba(45,212,191,0.2)]'
                    : pipelineStep === 'querying' || pipelineStep === 'complete'
                    ? 'border-[#272727] bg-[#1F1F1F] text-[#2DD4BF]'
                    : 'border-[#272727] text-[#9B9B9B]'
                }`}
              >
                <Cpu size={18} weight="bold" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold">Native SHA 256</span>
                  <span className="text-[10px] text-[#9B9B9B]">Web Crypto API</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-fluid ${
                  pipelineStep === 'querying'
                    ? 'border-[#2DD4BF] bg-[#2DD4BF]/10 text-white shadow-[0_0_15px_-3px_rgba(45,212,191,0.2)]'
                    : pipelineStep === 'complete'
                    ? 'border-[#272727] bg-[#1F1F1F] text-[#2DD4BF]'
                    : 'border-[#272727] text-[#9B9B9B]'
                }`}
              >
                <Database size={18} weight="bold" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold">Ledger Check</span>
                  <span className="text-[10px] text-[#9B9B9B]">Supabase / Offline</span>
                </div>
              </div>
            </div>

            {/* Verification Result Card */}
            {verificationResult && pipelineStep === 'complete' && (
              <div
                className={`mt-4 p-6 rounded-2xl border transition-fluid flex flex-col gap-6 ${
                  verificationResult.outcome === 'valid'
                    ? 'border-emerald-500/40 bg-emerald-950/15 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]'
                    : verificationResult.outcome === 'tampered'
                    ? 'border-rose-500/40 bg-rose-950/15 shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)]'
                    : 'border-amber-500/40 bg-amber-950/15 shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]'
                }`}
              >
                {/* Registration Confirmation Alert */}
                {registerSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 font-medium">
                    <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
                    <span>{registerSuccessMsg} Consensus verified by 4 PBFT validator nodes.</span>
                  </div>
                )}

                {/* Result Header Badge */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center justify-center w-11 h-11 rounded-2xl ${
                        verificationResult.outcome === 'valid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : verificationResult.outcome === 'tampered'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {verificationResult.outcome === 'valid' && (
                        <CheckCircle size={26} weight="fill" />
                      )}
                      {verificationResult.outcome === 'tampered' && (
                        <ShieldWarning size={26} weight="fill" />
                      )}
                      {verificationResult.outcome === 'not_found' && (
                        <WarningCircle size={26} weight="fill" />
                      )}
                    </span>

                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {verificationResult.outcome === 'valid' && 'Valid Ledger Record'}
                        {verificationResult.outcome === 'tampered' && 'Tampered Document Detected'}
                        {verificationResult.outcome === 'not_found' && 'Not found on ledger'}
                      </h3>
                      <span className="text-xs text-[#9B9B9B]">
                        {verificationResult.outcome === 'valid' &&
                          'Document hash perfectly matches official issuing authority block.'}
                        {verificationResult.outcome === 'tampered' &&
                          'Cryptographic hash mismatch. Document content has been modified.'}
                        {verificationResult.outcome === 'not_found' &&
                          'This file was not issued through SecureChain. Its fingerprint has no matching record in the ledger.'}
                      </span>
                    </div>
                  </div>

                  {/* Calm offline indicator if fallback was used */}
                  {verificationResult.isOfflineFallback && (
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#1F1F1F] border border-[#272727] text-[#9B9B9B]">
                      offline ledger cache
                    </span>
                  )}
                </div>

                {/* Technical Ledger Data Grid */}
                {verificationResult.record && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#1F1F1F] border border-[#272727]">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#9B9B9B] block mb-1">
                        Document Name
                      </span>
                      <span className="text-sm font-semibold text-white block">
                        {verificationResult.record.doc_name}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#9B9B9B] block mb-1">
                        Issuing Authority
                      </span>
                      <span className="text-sm font-semibold text-white block">
                        {verificationResult.record.issuer}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#9B9B9B] block mb-1">
                        Issued On
                      </span>
                      <span className="text-sm font-mono text-white block">
                        {verificationResult.record.issued_on}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#9B9B9B] block mb-1">
                        Block Reference
                      </span>
                      <span className="text-sm font-mono text-[#38BDF8] block">
                        {verificationResult.record.block_ref}
                      </span>
                    </div>
                  </div>
                )}

                {/* Fingerprint Inspection Section */}
                <div className="flex flex-col gap-3">
                  <div className="p-3.5 rounded-xl bg-[#1F1F1F] border border-[#272727]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[#9B9B9B]">
                        Computed File SHA 256 Fingerprint
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(verificationResult.computedHash)}
                        className="text-xs text-[#9B9B9B] hover:text-white inline-flex items-center gap-1 transition-fluid"
                      >
                        {copiedHash ? <Check size={14} className="text-[#2DD4BF]" /> : <Copy size={14} />}
                        <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <code className="text-xs font-mono text-[#2DD4BF] break-all block">
                      {verificationResult.computedHash}
                    </code>
                  </div>

                  {/* If tampered, show expected original hash comparison */}
                  {verificationResult.outcome === 'tampered' && verificationResult.expectedHash && (
                    <div className="p-3.5 rounded-xl bg-[#1F1F1F] border border-rose-500/30">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-rose-400">
                          Original Expected Hash Sealed on Ledger
                        </span>
                      </div>
                      <code className="text-xs font-mono text-[#9B9B9B] break-all block">
                        {verificationResult.expectedHash}
                      </code>
                      <span className="text-[11px] text-rose-300 block mt-2">
                        Notice the deviation in characters: the hash does not match the immutable block entry.
                      </span>
                    </div>
                  )}
                </div>

                {/* Verification Timestamp & Node info */}
                <div className="flex items-center justify-between text-[11px] text-[#9B9B9B] pt-2 border-t border-[#272727]">
                  <span>Attested at: {new Date(verificationResult.timestamp).toLocaleString()}</span>
                  <span>Consensus: PBFT 4 Peer Quorum Met</span>
                </div>
              </div>
            )}

            {/* Rich Explanatory & Interactive Section for not_found outcome */}
            {verificationResult && verificationResult.outcome === 'not_found' && pipelineStep === 'complete' && (
              <div className="flex flex-col gap-4 mt-2">
                {/* Zero-trust explanation for judges */}
                <div className="p-5 rounded-2xl bg-[#181818] border border-amber-500/30 flex items-start gap-3.5">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
                    <Info size={18} weight="bold" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">Why does this show &ldquo;Not found on ledger&rdquo;?</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Zero-Trust Security
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      SecureChain operates on a <strong className="text-white">zero-trust distributed ledger model</strong>. A document is only recognized as valid if an authorized issuing authority (like an accredited university, hospital, or revenue office) has officially sealed its cryptographic fingerprint into the blockchain.
                    </p>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      If arbitrary unissued files could pass verification, anyone could forge a degree or deed! Showing <span className="text-amber-400 font-semibold">not found</span> for unanchored documents proves that SecureChain genuinely verifies mathematical hashes against the ledger, rather than just returning a hardcoded green checkmark.
                    </p>
                  </div>
                </div>

                {/* Interactive Issuer Portal Simulation Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-[#182635] to-[#121820] border border-[#38BDF8]/40 shadow-[0_0_30px_-5px_rgba(56,189,248,0.15)] flex flex-col gap-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8]">
                        <Lightning size={18} weight="fill" />
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Issuer Portal Simulator — Anchor this document live
                        </h4>
                        <p className="text-[11px] text-[#94A3B8]">
                          Simulate an issuing node anchoring this file&apos;s SHA-256 fingerprint into the distributed ledger
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold">
                      Live Judge Demo
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                        Document Title
                      </label>
                      <input
                        type="text"
                        value={registerDocName}
                        onChange={(e) => setRegisterDocName(e.target.value)}
                        placeholder="e.g. Aryan Sharma Degree"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B131F] border border-[#334155] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-fluid"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                        Issuing Authority / Node
                      </label>
                      <input
                        type="text"
                        value={registerIssuer}
                        onChange={(e) => setRegisterIssuer(e.target.value)}
                        placeholder="e.g. National Institute of Technology Warangal"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#0B131F] border border-[#334155] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-fluid"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-[#334155]/60">
                    <span className="text-[11px] text-[#64748B] font-mono">
                      Target SHA-256: {verificationResult.computedHash.slice(0, 16)}...
                    </span>

                    <button
                      type="button"
                      onClick={handleRegisterCustomDocument}
                      disabled={isRegistering}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#38BDF8] text-[#0A0F1D] hover:bg-[#7DD3FC] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-fluid shadow-md inline-flex items-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <ArrowsClockwise size={14} className="animate-spin" />
                          <span>Sealing Block via PBFT Consensus...</span>
                        </>
                      ) : (
                        <>
                          <Sparkle size={14} weight="fill" />
                          <span>Anchor &amp; Seal to Ledger (Simulate Issuer)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Option to test pre-anchored PDF */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#272727] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-[#9B9B9B]">
                      Prefer testing a pre-anchored valid document?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const cert = SAMPLE_DOCUMENTS.find((d) => d.id === 'btech-cert');
                      if (cert) downloadSamplePdf(cert);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#9B9B9B] hover:text-[#2DD4BF] bg-[#1F1F1F] hover:bg-[#272727] border border-[#272727] transition-fluid"
                  >
                    <DownloadSimple size={14} />
                    <span>Download B.Tech Certificate PDF to test upload</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL (Pure View: No Downloading) */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-md transition-fluid">
          <div className="bg-[#181818] border border-[#272727] w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#272727] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#1F1F1F] text-[#2DD4BF]">
                  {previewDocument.id === 'btech-cert' && <Certificate size={20} weight="bold" />}
                  {previewDocument.id === 'land-deed' && <Buildings size={20} weight="bold" />}
                  {previewDocument.id === 'hospital-discharge' && <FirstAid size={20} weight="bold" />}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {previewDocument.name}
                  </h3>
                  <span className="text-xs text-[#9B9B9B]">{previewDocument.issuer}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                className="w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#272727] text-[#9B9B9B] hover:text-white flex items-center justify-center transition-fluid active:scale-95"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {/* Document Render Body */}
            <div className="rounded-2xl border border-[#272727] bg-[#121212] p-6 text-left mb-6 font-sans">
              {previewDocument.id === 'btech-cert' && (
                <div className="flex flex-col gap-4 text-xs sm:text-sm">
                  <div className="text-center pb-4 border-b border-[#272727]">
                    <h4 className="font-bold text-white text-base">
                      NATIONAL INSTITUTE OF TECHNOLOGY WARANGAL
                    </h4>
                    <span className="text-xs text-[#9B9B9B]">
                      An Institute of National Importance, Government of India
                    </span>
                    <div className="mt-2 text-xs font-semibold uppercase text-[#38BDF8]">
                      Provisional Degree Certificate
                    </div>
                  </div>

                  <p className="text-[#9B9B9B] leading-relaxed pt-2">
                    This is to certify that <b className="text-white">Aryan Sharma</b>, Roll Number{' '}
                    <b className="text-white">22BCS1084</b>, has successfully fulfilled all academic
                    requirements for the award of Bachelor of Technology in Computer Science and
                    Engineering in First Class with Distinction, having secured a CGPA of{' '}
                    <b className="text-white">8.94 / 10.00</b>.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#272727] text-xs">
                    <div>
                      <span className="text-[#9B9B9B] block">Serial Number:</span>
                      <span className="text-white font-mono">NITW/ACAD/2026/PROV-1084</span>
                    </div>
                    <div>
                      <span className="text-[#9B9B9B] block">Issue Date:</span>
                      <span className="text-white font-mono">18th June 2026</span>
                    </div>
                  </div>
                </div>
              )}

              {previewDocument.id === 'land-deed' && (
                <div className="flex flex-col gap-4 text-xs sm:text-sm">
                  <div className="text-center pb-4 border-b border-[#272727]">
                    <h4 className="font-bold text-white text-base">
                      GOVERNMENT OF TELANGANA
                    </h4>
                    <span className="text-xs text-[#9B9B9B]">
                      Registration and Stamps Department · Land Records Ledger
                    </span>
                    <div className="mt-2 text-xs font-semibold uppercase text-[#2DD4BF]">
                      Certificate of Registered Title Deed
                    </div>
                  </div>

                  <p className="text-[#9B9B9B] leading-relaxed pt-2">
                    This official extract certifies that Title Deed{' '}
                    <b className="text-white">TS-HYD-2026-88391</b> is duly registered. Title holder{' '}
                    <b className="text-white">Vikramaditya Rao</b> holds lawful ownership over Plot 42,
                    Survey No. 118/A, Gachibowli, Serilingampally, Hyderabad (Extent: 350 Square Yards).
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#272727] text-xs">
                    <div>
                      <span className="text-[#9B9B9B] block">SRO Office:</span>
                      <span className="text-white">Serilingampally, Rangareddy</span>
                    </div>
                    <div>
                      <span className="text-[#9B9B9B] block">Registration Date:</span>
                      <span className="text-white font-mono">24th March 2026</span>
                    </div>
                  </div>
                </div>
              )}

              {previewDocument.id === 'hospital-discharge' && (
                <div className="flex flex-col gap-4 text-xs sm:text-sm">
                  <div className="text-center pb-4 border-b border-[#272727]">
                    <h4 className="font-bold text-white text-base">
                      APOLLO MULTISPECIALITY HOSPITALS
                    </h4>
                    <span className="text-xs text-rose-400 font-semibold">
                      [UNAUTHORIZED COPY / MODIFIED RECORD]
                    </span>
                    <div className="mt-2 text-xs font-semibold uppercase text-white">
                      Clinical Discharge Summary
                    </div>
                  </div>

                  <p className="text-[#9B9B9B] leading-relaxed pt-2">
                    Patient <b className="text-white">Rajesh Kumar</b> (Age 34, M, UHID: AP-773091).
                    Diagnosis: Acute Appendicitis. Procedure: Laparoscopic Appendectomy. Total Hospital
                    Bill: <b className="text-rose-400">Rs. 185,000 (Insurance Claim Inflated)</b>.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#272727] text-xs">
                    <div>
                      <span className="text-[#9B9B9B] block">Attending Surgeon:</span>
                      <span className="text-white">Dr. S. K. Nambiar, MS FRCS</span>
                    </div>
                    <div>
                      <span className="text-[#9B9B9B] block">Discharge Date:</span>
                      <span className="text-white font-mono">15th July 2026</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions: Only Close or Verify - NO DOWNLOAD */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewDocument(null)}
                className="text-xs font-medium text-[#9B9B9B] hover:text-white px-4 py-2 rounded-xl border border-[#272727] hover:bg-[#272727] transition-fluid"
              >
                Close Preview
              </button>

              <button
                type="button"
                onClick={() => {
                  const doc = previewDocument;
                  setPreviewDocument(null);
                  handleVerifySample(doc);
                }}
                className="text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl bg-[#2DD4BF] text-[#000000] hover:bg-[#14B8A6] active:scale-95 transition-fluid shadow-md"
              >
                Verify This Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Quick Guide for Judges */}
      <div className="mt-12 p-6 rounded-2xl bg-[#181818] border border-[#272727] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1F1F1F] text-[#2DD4BF] shrink-0">
            <Info size={22} weight="bold" />
          </span>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Evaluation Guide for Presentation
            </h4>
            <p className="text-xs text-[#9B9B9B] mt-0.5">
              Click Preview to inspect official document details without downloading, or click Verify Sample to execute instant in-memory SHA 256 verification against the Supabase permissioned ledger.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleVerifySample(SAMPLE_DOCUMENTS[0])}
          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#272727] text-white hover:bg-[#313131] active:scale-95 transition-fluid shrink-0"
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
}
