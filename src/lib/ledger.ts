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
  expires_at?: string;
}

export interface VerificationResponse {
  outcome: 'valid' | 'tampered' | 'not_found' | 'revoked';
  computedHash: string;
  expectedHash?: string;
  record?: LedgerRecord;
  isOfflineFallback: boolean;
  timestamp: string;
}

const LOCAL_STORAGE_KEY = 'securechain_custom_ledger_records_v2';
export const RECORD_TTL_MS = 3 * 60 * 1000;

export async function computeSha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function isExpired(record: LedgerRecord): boolean {
  return Boolean(record.expires_at && Date.now() >= new Date(record.expires_at).getTime());
}

export function getLocalLedgerRecords(): LedgerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const records: LedgerRecord[] = raw ? JSON.parse(raw) : [];
    const active = records.filter((record) => !isExpired(record));
    if (active.length !== records.length) localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(active));
    return active;
  } catch {
    return [];
  }
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
  const expires_at = new Date(Date.now() + RECORD_TTL_MS).toISOString();
  const randomBlockNum = Math.floor(100000 + Math.random() * 900000);
  const block_ref = `BLK-${randomBlockNum}-DEMO`;
  const record: LedgerRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `doc-${Date.now()}`,
    doc_hash: params.doc_hash,
    doc_name: params.doc_name,
    issuer: params.issuer,
    issued_on,
    status: 'valid',
    block_ref,
    expires_at,
  };
  saveLocalLedgerRecord(record);
  if (supabase) {
    try { await supabase.from('ledger').upsert(record, { onConflict: 'doc_hash' }); } catch (err) { console.warn('Supabase upsert warning (local fallback active):', err); }
  }
  return record;
}

export async function verifyDocumentOnLedger(computedHash: string, _isKnownTamperedSample?: boolean, expectedOriginalRecord?: LedgerRecord | null): Promise<VerificationResponse> {
  const isBrowserOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const nowIso = new Date().toISOString();

  if (expectedOriginalRecord && computedHash !== expectedOriginalRecord.doc_hash) {
    return { outcome: 'tampered', computedHash, expectedHash: expectedOriginalRecord.doc_hash, record: { ...expectedOriginalRecord, status: 'tampered' }, isOfflineFallback: false, timestamp: nowIso };
  }

  const localRecords = getLocalLedgerRecords();
  const matchedLocal = localRecords.find((r) => r.doc_hash === computedHash && !isExpired(r));
  if (matchedLocal) {
    return { outcome: matchedLocal.status === 'revoked' ? 'revoked' : matchedLocal.status === 'tampered' ? 'tampered' : 'valid', computedHash, expectedHash: matchedLocal.doc_hash, record: matchedLocal, isOfflineFallback: false, timestamp: nowIso };
  }

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
        if (row.expires_at && !isExpired(row)) {
          return { outcome: row.status === 'revoked' ? 'revoked' : row.status === 'tampered' ? 'tampered' : 'valid', computedHash, expectedHash: row.doc_hash, record: row, isOfflineFallback: false, timestamp: nowIso };
        }
      }
    } catch {}
  }

  return { outcome: 'not_found', computedHash, isOfflineFallback: false, timestamp: nowIso };
}
