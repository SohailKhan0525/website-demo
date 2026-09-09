import { supabase } from './supabase';

export interface LedgerRecord {
  id: string;
  doc_hash: string;
  doc_name: string;
  issuer: string;
  issued_on: string;
  status: 'valid' | 'revoked' | 'tampered';
  block_ref: string;
  revocation_reason?: string;
}

export interface VerificationResponse {
  outcome: 'valid' | 'tampered' | 'not_found' | 'revoked';
  computedHash: string;
  expectedHash?: string;
  record?: LedgerRecord;
  isOfflineFallback: boolean;
  timestamp: string;
}

export const BAKED_LEDGER_ROWS: LedgerRecord[] = [
  { id: '11111111-1111-4111-a111-111111111111', doc_hash: '7dc50b0cbfc913a2c128b9912d9e1a217fe9c6b5c4ebad488466034e71bdea65', doc_name: 'B.Tech Provisional Certificate', issuer: 'National Institute of Technology Warangal', issued_on: '2026-06-18', status: 'valid', block_ref: 'BLK-749201-ETH' },
  { id: '22222222-2222-4222-a222-222222222222', doc_hash: '0efd98ef56dc89bb08d036acfbfd4ff6f8dff697a77d4ccc638790461611397e', doc_name: 'Land Title Deed', issuer: 'Dept of Land Revenue, Govt of Telangana', issued_on: '2026-03-24', status: 'valid', block_ref: 'BLK-810492-ETH' },
  { id: '33333333-3333-4333-a333-333333333333', doc_hash: 'db35d8836069b40d2b1929a8d20e7c6645821122b2108effaf973a9f29b8e9ed', doc_name: 'Hospital Discharge Summary', issuer: 'Apollo Multispeciality Hospitals', issued_on: '2026-07-16', status: 'valid', block_ref: 'BLK-932148-ETH' },
];

export const TAMPERED_SAMPLE_HASH = '7e40021878bd8b0b369498ccda8cb0ca40b0c9369f4d49c16bc45754e344b9ef';
export const ORIGINAL_HOSPITAL_HASH = 'db35d8836069b40d2b1929a8d20e7c6645821122b2108effaf973a9f29b8e9ed';
const LOCAL_STORAGE_KEY = 'securechain_custom_ledger_records';

export async function computeSha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getLocalLedgerRecords(): LedgerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveLocalLedgerRecord(record: LedgerRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalLedgerRecords();
    const updated = [record, ...existing.filter((r) => r.doc_hash !== record.doc_hash)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) { console.warn('Failed to save to localStorage:', err); }
}

export function revokeLocalLedgerRecord(docHash: string, reason: string): LedgerRecord | null {
  const record = getLocalLedgerRecords().find((item) => item.doc_hash === docHash);
  if (!record) return null;
  const revoked: LedgerRecord = { ...record, status: 'revoked', revocation_reason: reason };
  saveLocalLedgerRecord(revoked);
  return revoked;
}

export async function registerDocumentOnLedger(params: { doc_hash: string; doc_name: string; issuer: string; issued_on?: string }): Promise<LedgerRecord> {
  const issued_on = params.issued_on || new Date().toISOString().split('T')[0];
  const randomBlockNum = Math.floor(100000 + Math.random() * 900000);
  const block_ref = `BLK-${randomBlockNum}-ETH`;
  const record: LedgerRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `doc-${Date.now()}`,
    doc_hash: params.doc_hash,
    doc_name: params.doc_name,
    issuer: params.issuer,
    issued_on,
    status: 'valid',
    block_ref,
  };
  saveLocalLedgerRecord(record);
  if (supabase) {
    try { await supabase.from('ledger').upsert(record, { onConflict: 'doc_hash' }); } catch (err) { console.warn('Supabase upsert warning (local fallback active):', err); }
  }
  return record;
}

export async function verifyDocumentOnLedger(computedHash: string, isKnownTamperedSample?: boolean, expectedOriginalRecord?: LedgerRecord | null): Promise<VerificationResponse> {
  const isBrowserOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const nowIso = new Date().toISOString();
  if (expectedOriginalRecord && computedHash !== expectedOriginalRecord.doc_hash) {
    return { outcome: 'tampered', computedHash, expectedHash: expectedOriginalRecord.doc_hash, record: { ...expectedOriginalRecord, status: 'tampered' }, isOfflineFallback: false, timestamp: nowIso };
  }
  if (isKnownTamperedSample || computedHash === TAMPERED_SAMPLE_HASH) {
    const originalRecord = BAKED_LEDGER_ROWS.find((r) => r.doc_hash === ORIGINAL_HOSPITAL_HASH)!;
    return { outcome: 'tampered', computedHash, expectedHash: originalRecord.doc_hash, record: { ...originalRecord, status: 'tampered' }, isOfflineFallback: false, timestamp: nowIso };
  }
  const localRecords = getLocalLedgerRecords();
  const matchedLocal = localRecords.find((r) => r.doc_hash === computedHash);
  if (matchedLocal) return { outcome: matchedLocal.status === 'revoked' ? 'revoked' : matchedLocal.status === 'tampered' ? 'tampered' : 'valid', computedHash, expectedHash: matchedLocal.doc_hash, record: matchedLocal, isOfflineFallback: false, timestamp: nowIso };
  if (supabase && isBrowserOnline) {
    try {
      const timeoutPromise = new Promise<{ timeout: true }>((resolve) => setTimeout(() => resolve({ timeout: true }), 2500));
      const fetchPromise = (async () => {
        const { data, error } = await supabase.from('ledger').select('*').eq('doc_hash', computedHash).maybeSingle();
        if (error) throw error;
        return { data };
      })();
      const raceResult = await Promise.race([fetchPromise, timeoutPromise]);
      if (!('timeout' in raceResult) && raceResult.data) {
        const row = raceResult.data as LedgerRecord;
        return { outcome: row.status === 'revoked' ? 'revoked' : row.status === 'tampered' ? 'tampered' : 'valid', computedHash, expectedHash: row.doc_hash, record: row, isOfflineFallback: false, timestamp: nowIso };
      }
    } catch {}
  }
  const matchedBaked = BAKED_LEDGER_ROWS.find((r) => r.doc_hash === computedHash);
  if (matchedBaked) return { outcome: matchedBaked.status === 'revoked' ? 'revoked' : matchedBaked.status === 'tampered' ? 'tampered' : 'valid', computedHash, expectedHash: matchedBaked.doc_hash, record: matchedBaked, isOfflineFallback: true, timestamp: nowIso };
  return { outcome: 'not_found', computedHash, isOfflineFallback: false, timestamp: nowIso };
}
