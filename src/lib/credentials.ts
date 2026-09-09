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
}

const HOLDER_CREDENTIAL_KEY = 'securechain_holder_credentials';

export function getHolderCredentials(): HolderCredential[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HOLDER_CREDENTIAL_KEY);
    return raw ? JSON.parse(raw) : [];
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
