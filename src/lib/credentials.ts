export interface HolderCredential {
  credentialId: string;
  recordId: string;
  studentName: string;
  documentName: string;
  issuer: string;
  issuedOn: string;
  documentHash: string;
  status: 'valid' | 'revoked';
  verificationPath: string;
  expiresAt?: string;
}

const HOLDER_CREDENTIAL_KEY = 'securechain_holder_credentials_v2';
const CREDENTIAL_TTL_MS = 3 * 60 * 1000;

function isExpired(credential: HolderCredential): boolean {
  return Boolean(credential.expiresAt && Date.now() >= new Date(credential.expiresAt).getTime());
}

export function getHolderCredentials(): HolderCredential[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HOLDER_CREDENTIAL_KEY);
    const credentials: HolderCredential[] = raw ? JSON.parse(raw) : [];
    const active = credentials.filter((credential) => !isExpired(credential));
    if (active.length !== credentials.length) localStorage.setItem(HOLDER_CREDENTIAL_KEY, JSON.stringify(active));
    return active;
  } catch {
    return [];
  }
}

export function saveHolderCredential(credential: HolderCredential): void {
  if (typeof window === 'undefined') return;
  const existing = getHolderCredentials();
  const updated = [credential, ...existing.filter((item) => item.credentialId !== credential.credentialId)];
  localStorage.setItem(HOLDER_CREDENTIAL_KEY, JSON.stringify(updated));
}

export function makeCredentialId(): string {
  return `SC-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString().slice(-5)}`;
}

export function credentialExpiresAt(): string {
  return new Date(Date.now() + CREDENTIAL_TTL_MS).toISOString();
}
