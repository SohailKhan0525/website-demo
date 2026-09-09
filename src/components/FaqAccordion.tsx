'use client';

import React, { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What happens if the original document changes even slightly?',
    answer:
      'Because SecureChain uses cryptographic SHA 256 digests, altering even a single comma, date, or pixel completely changes the resulting hash digest through the avalanche effect. When recomputed during verification, the hash will fail to match the ledger record and immediately trigger an alert.',
  },
  {
    question: 'What happens if someone loses their QR code?',
    answer:
      'The QR code serves only as a lightweight shortcut containing the document fingerprint and ledger address. The citizen can re access their verifiable credential through their digital wallet, or simply provide the digital copy of the original document file to re compute the fingerprint on demand.',
  },
  {
    question: 'Why is the full document never stored directly on the ledger?',
    answer:
      'Storing complete files on a blockchain creates significant privacy concerns and bloats the ledger storage size. SecureChain anchors only the lightweight 32 byte hash digest and the issuer digital signature on chain, while the encrypted file remains securely stored in off chain storage under institutional custody.',
  },
  {
    question: 'Does this platform require every institution to adopt it at once?',
    answer:
      'No. The architecture is designed for progressive onboarding. Individual universities, hospitals, or land registries can join as issuing nodes at their own pace. Verifiers require zero software installation or consortium membership to check documents against the public verification endpoint.',
  },
  {
    question: 'What does tampered actually mean technically?',
    answer:
      'A tampered status indicates that a ledger entry exists under the given document identifier or registry reference, but the cryptographic digest computed from the submitted file does not match the immutable fingerprint sealed into the block at the time of issuance.',
  },
  {
    question: 'What happens if an issuer wants to cancel or revoke a document after issuing it?',
    answer:
      'The authorized issuing node issues a signed revocation transaction referencing the original block entry. The ledger records that the document is no longer valid, and any subsequent verification query returns a revoked warning status with the official revocation reason.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.question}
            className="rounded-2xl border border-[#272727] bg-[#181818] overflow-hidden transition-fluid"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-5 text-left text-white font-medium hover:bg-[#1F1F1F] active:scale-[0.99] transition-fluid gap-4"
            >
              <span className="text-base md:text-lg">{item.question}</span>
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full bg-[#1F1F1F] border border-[#272727] text-[#9B9B9B] transition-fluid shrink-0 ${
                  isOpen ? 'rotate-180 text-[#2DD4BF]' : ''
                }`}
              >
                <CaretDown size={16} weight="bold" />
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-sm md:text-base text-[#9B9B9B] leading-relaxed border-t border-[#272727]/60">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
