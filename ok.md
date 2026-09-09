# SecureChain — Team Guide for Tomorrow

**Team:** BlackCaps  
**Team ID:** TID146  
**Problem Statement:** SIH26194  
**Project:** SecureChain — Blockchain-Based Digital Document Verification Platform

---

## 1. One sentence to remember

**SecureChain helps an authorised institution register a document once, gives the student a digital credential with a QR code, and lets a verifier check the document later using its SHA-256 fingerprint.**

If anyone asks what blockchain means, say:

> **Blockchain is like a special notebook where we write information, and nobody can secretly change an old entry.**

If anyone asks what a hash means, say:

> **A hash is like a digital fingerprint of a file.**

---

## 2. The three people in our system

### 🏫 Issuer

The issuer is the college, university, government office, hospital, or another authorised organisation.

The issuer:
1. Logs into the issuer page.
2. Enters the student name, document type, and issuing authority.
3. Uploads the original document.
4. SecureChain calculates its SHA-256 hash.
5. The hash is registered in the ledger.
6. A credential ID and verification link are created for the holder.

**Simple line:**
> The issuer registers the original document and creates its digital fingerprint.

### 👨‍🎓 Holder

The holder is the student or citizen who receives the credential.

The holder page shows:
- document name
- student name
- issuer
- issue date
- credential ID
- SHA-256 fingerprint
- QR code

**Simple line:**
> The holder keeps the credential and QR code and can share it when needed.

### 🏢 Verifier

The verifier can be a company, university, bank, government office, or other authorised checker.

The verifier:
1. Gets the document from the holder.
2. Uploads the file to SecureChain.
3. SecureChain calculates the SHA-256 hash again.
4. It compares the new hash with the registered ledger record.
5. It shows the result.

Possible results:
- **Valid** — the hash matches the registered record.
- **Tampered** — a registered document exists, but the submitted file does not match the original fingerprint.
- **Revoked** — the issuer has cancelled the credential.
- **Not found** — no matching registered record was found.

**Simple line:**
> The verifier checks whether the file still matches the original registered fingerprint.

---

## 3. The complete flow

Remember this:

**Issuer → Hash → Ledger → Holder → QR/File → Verifier → Hash again → Compare → Result**

Example:

1. College issues Aryan's B.Tech certificate.
2. SecureChain calculates the certificate's SHA-256 fingerprint.
3. The fingerprint is registered in the ledger.
4. Aryan receives his credential and QR code.
5. Later, a company wants to check the certificate.
6. The company opens SecureChain and uploads the certificate or uses the QR link.
7. SecureChain calculates the hash again.
8. If the hashes match, it shows **Valid**.
9. If the file was changed, it shows **Tampered**.
10. If the issuer cancelled it, it shows **Revoked**.

---

## 4. What our demo actually shows

Our website has these main pages:

### `/` — Overview
Shows:
- the problem
- our solution
- benefits
- project explanation
- FAQ
- link to the demo

### `/issuer` — Issuer Portal
This is the **college/authority side**.

Demo steps:
1. Enter student name.
2. Enter document type.
3. Enter issuing authority.
4. Choose a document.
5. Click **Register certificate**.
6. The page shows the SHA-256 fingerprint, ledger record, block reference, and credential ID.
7. Open the holder page.

### `/holder` — Holder Wallet
This is the **student side**.

It shows the registered credential and generates a QR code for the verification link.

### `/verify` — Verifier
This is the **company/checker side**.

Use the preloaded samples or upload a file.

For the demo, show:
1. B.Tech sample → **Valid**.
2. Hospital sample → **Tampered**.
3. Random/custom file → **Not found**.
4. Use the issuer flow to register a custom file → then verify that same file → **Valid**.

### `/team` — Team
Shows Team BlackCaps and all six members.

---

## 5. Best demo order tomorrow

Do NOT randomly click around.

Use this order:

### Step 1 — Start at Overview
Say:
> This is SecureChain. It is a document verification platform using a cryptographic fingerprint and distributed ledger approach.

### Step 2 — Open Issuer
Say:
> First, the authorised issuer registers the original document.

Upload a sample certificate and click **Register certificate**.

Point to:
- SHA-256
- ledger record
- block reference
- credential ID

### Step 3 — Open Holder
Say:
> Now the student receives the verified credential.

Show:
- credential details
- QR code

### Step 4 — Open Verifier
Say:
> Later, a company can verify the document without calling the college.

Show the B.Tech sample → **Valid**.

Then show the hospital sample → **Tampered**.

Then, if there is enough time, upload a random file → **Not found**.

### Step 5 — Explain the important part
Say:
> We calculate the file hash again during verification. If the fingerprint is different, the document has been changed.

### Step 6 — Finish
Say:
> So the complete flow is issuer, holder, and verifier. The issuer creates the proof, the holder keeps the credential, and the verifier checks the proof.

---

## 6. Very important: what is real in our prototype?

Be honest with judges.

### Implemented in the working website
- Browser-side SHA-256 hashing.
- Document registration flow.
- Ledger record storage through the existing application ledger/database layer.
- Holder credential creation.
- QR code generation for the verification link.
- File verification.
- Valid / Tampered / Not found states.
- Revoked state support in the ledger model.
- Responsive landing page and role-based demo pages.

### Proposed production architecture from our PPT
Our PPT proposes:
- Hyperledger Fabric permissioned blockchain.
- Smart contracts / chaincode for issuance, verification, and revocation.
- IPFS for encrypted off-chain documents.
- DID and Verifiable Credentials for the holder wallet.
- React web portal, Flutter mobile app, and Node.js/Express APIs.
- AES-256 encryption, ECDSA signatures, TLS, and role-based access control.

**Do not say the prototype is already running on Hyperledger Fabric, IPFS, or a real mobile wallet unless we actually deploy those parts.**

If a judge asks, say:
> Our current website is the working prototype of the core flow. The PPT shows the production architecture we propose for scaling it with Hyperledger Fabric, IPFS, and verifiable credentials.

---

## 7. Simple judge questions and answers

### Q: Why blockchain?
> Because multiple authorised organisations can share a tamper-evident ledger instead of depending on one organisation's database.

### Q: Why not just use a normal database?
> A normal database can be changed by an administrator. A distributed ledger gives shared records and an audit trail between participating authorities.

### Q: What is SHA-256?
> It is a cryptographic hash function. We use it to create a digital fingerprint of the document.

### Q: What happens if one character changes?
> The hash changes, so the submitted file will not match the registered fingerprint.

### Q: Do you store the whole certificate on blockchain?
> No. Our design stores the document fingerprint and required metadata on the ledger. The full document stays off-chain for privacy.

### Q: What does tampered mean?
> It means the document was changed and its new hash does not match the registered hash.

### Q: What does revoked mean?
> It means the issuer cancelled a document that was previously valid.

### Q: What if the document is fake but has a QR code?
> The QR code alone is not enough. The verifier still checks the document fingerprint against the registered record.

### Q: What if someone changes the PDF?
> The hash changes, so verification detects the mismatch.

### Q: Who can issue documents?
> Only authorised issuing institutions should be allowed to register documents in the production system.

### Q: Who can verify?
> A verifier such as an employer or institution can check a document through the verification service.

### Q: What if the internet is not available?
> The current prototype has a local fallback for known demo records, but a real distributed ledger verification normally needs network access.

### Q: Is the current prototype actually Hyperledger Fabric?
> No. The current prototype demonstrates the core workflow. Hyperledger Fabric is our proposed production blockchain layer.

### Q: Is IPFS implemented right now?
> The PPT proposes IPFS for encrypted off-chain storage. The current demo does not claim a full IPFS deployment.

### Q: Is the mobile wallet implemented?
> Not as a separate Flutter app in this prototype. The holder flow is demonstrated as a web page with a QR credential.

### Q: How can it work across many sectors?
> The same basic hash-and-verify flow can be reused for education, land, healthcare, and government documents, with different document rules for each sector.

---

## 8. If a judge asks you directly and you get nervous

Keep it short.

You can say:

> I worked mainly on the technical implementation. The core idea is that we create a SHA-256 fingerprint of the document and compare it during verification.

If they ask about your part:

> I worked on the web application and the document verification flow.

If you don't know the answer:

> That part is in our proposed production architecture, but we have not fully implemented it in this prototype yet.

**Never invent an answer.**

---

## 9. PPT — what each slide means

### Slide 1 — Title
Remember:
- SIH26194
- Blockchain & Cybersecurity
- SecureChain
- Team BlackCaps
- TID146

Simple explanation:
> Our project is SecureChain, a blockchain-based digital document verification platform.

### Slide 2 — Proposed Solution
Main idea:
> Authorised issuers register a document fingerprint. The holder gets the credential. A verifier checks it later.

### Slide 3 — Technical Approach
Remember the layers:
- Blockchain / ledger
- Smart contracts
- Off-chain storage
- Identity / credentials
- Web and mobile applications
- Security

Do not claim every proposed production component is already deployed.

### Slide 4 — Feasibility
Main idea:
> We can start with one institution, test the system, then expand.

Challenges include onboarding institutions, old databases, lost keys, and high verification traffic.

### Slide 5 — Impact and Benefits
Remember:
- faster verification
- less manual work
- less document fraud
- useful across sectors
- less paper handling

### Slide 6 — Research and References
If asked:
> We referred to blockchain, verifiable credentials, digital identity, government digital infrastructure, and previous blockchain credential projects.

---

## 10. Team speaking plan

### Saidev
Opening, problem, project introduction, and closing.

### Sai Teja
Explain the proposed solution and the three roles.

### Praveen
Explain the basic working flow.

### Radheshyam
Explain the technical approach and technologies.

### Akshya
Explain impact and benefits.

### Sohail
Main technical/demo support. If directly asked, answer using the short answers in this file.

---

## 11. Three sentences everyone should memorize

> **SecureChain creates a digital fingerprint of a document using SHA-256.**

> **The issuer registers that fingerprint, the holder receives a credential, and the verifier checks the document later.**

> **If the fingerprint matches, it is valid; if it changes, we detect tampering.**

---

## 12. Final warning

Our prototype and our proposed production architecture are not exactly the same thing.

**Prototype:** working web demo of the core issuer → holder → verifier flow.  
**Production proposal:** Hyperledger Fabric + smart contracts + IPFS + DID/Verifiable Credentials + stronger security controls.

If judges ask about something we have not implemented, be honest and call it a **proposed production component**.

That is much better than claiming something that the demo cannot prove.

---

## Quick memory card

**Issuer:** registers.  
**Holder:** keeps.  
**Verifier:** checks.  
**SHA-256:** fingerprint.  
**Ledger:** shared record.  
**Valid:** match.  
**Tampered:** changed file.  
**Revoked:** issuer cancelled it.  
**Not found:** no registered match.
