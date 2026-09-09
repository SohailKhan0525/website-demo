# How to Show the SecureChain Demo to Judges (SIH 2026)
**Live Site URL:** https://teamblackcaps.vercel.app  
**Team ID:** TID146 | **Problem Statement:** SIH26194 | **Team Name:** BlackCaps

---

## ⚡ The 3-Minute Live Showcase (Do this in front of judges)

### Step 1: Open the Homepage (30 seconds)
1. Open `https://teamblackcaps.vercel.app` on laptop (or hand your phone to the judge).
2. Point to the header badge: `Smart India Hackathon 2026 · Team BlackCaps (TID146)`.
3. Say this exact line:
   > *"Respected judges, colleges and land offices still verify papers using manual phone calls and physical letters, which takes 2 to 3 weeks and is easy to forge. SecureChain seals an immutable cryptographic fingerprint on a distributed ledger at the moment a document is issued, dropping verification time to 400 milliseconds."*
4. Click **"Launch Demo"** (or **"Try the live verification demo"**).

---

### Step 2: Verify Genuine Document (45 seconds)
1. On `/verify`, you see three sample cards under **Preloaded Samples (3)**.
2. Click **"Preview"** on the **B.Tech Provisional Certificate** card:
   - The certificate modal opens instantly in the browser (showing Aryan Sharma, NIT Warangal, CGPA 8.94).
   - Say: *"Judges can inspect full credential details right inside the browser. Notice that zero files were downloaded to the device."*
3. Click **"Verify This Document"** inside the modal:
   - Point at the 3-step animated pipeline: **Reading File → Native SHA 256 → Ledger Check**.
   - Result appears: **Valid Ledger Record** (Block `BLK-749201-ETH`).
   - Say: *"The browser computed the real SHA-256 hash using the Web Crypto API, verified it against our permissioned Supabase ledger, and confirmed it as 100% authentic in under 500ms."*

---

### Step 3: Demonstrate Fraud & Tamper Detection (45 seconds)
1. On the third card, **Hospital Discharge Summary** (marked with red badge):
2. Click **"Verify Sample"**:
   - Result appears: **Tampered Document Detected** (in warning red).
   - Point to the hash comparison on screen.
   - Say: *"In this medical summary, a single billing figure was altered. Because of the cryptographic avalanche effect, changing even 1 byte completely changes the SHA-256 hash. SecureChain instantly detects that the document was tampered with post-issuance."*

---

### Step 4: The Judge Test — Custom Upload & Issuer Simulator (60 seconds)
1. Switch to the **"Custom File Upload"** tab.
2. Drag and drop any random PDF or file from your laptop:
3. Click **"Verify this file"**.
4. Result shows: **Not found on ledger** (in amber).
   - Say: *"Judges often ask: 'Are you just hardcoding green checkmarks?' No! SecureChain enforces a zero-trust policy. Because this random file was never anchored by an authorized authority, it is rejected."*
5. Scroll down to the **Issuer Portal Simulator**:
   - Pre-filled title: e.g. `Aryan Sharma Degree`
   - Authority: e.g. `IIT Bombay / University Registrar`
   - Click **"Anchor & Seal to Ledger (Simulate Issuer)"**.
   - Watch the PBFT consensus animation seal the block.
   - The card flips immediately to **Valid Ledger Record** (Block `BLK-XXXXXX-ETH`)!
   - Say: *"We just simulated an accredited institution issuing this credential. It is now sealed in our Postgres blockchain ledger table and verifies instantly anywhere in the world."*

---

### Step 5: Show Team Page (10 seconds)
1. Click **"Team BlackCaps"** in the navbar:
2. Shows all 6 members with verified roles and male/female icons (Akshya has the female icon).

---

## 💡 Quick Answers to Tough Judge Questions

- **"Is this a real blockchain?"**  
  *"This demo uses a real Supabase ledger table with real client-side Web Crypto SHA-256 hashing. Our full enterprise architecture is Hyperledger Fabric PBFT consensus as detailed in Slide 3 of our PPT."*
- **"What about data privacy?"**  
  *"The full document is never saved on the public ledger. Only the 32-byte mathematical SHA-256 hash is stored. It is mathematically impossible to reverse-engineer personal data from a hash."*
- **"What if the internet drops?"**  
  *"The platform has an offline-first architecture with a 2.5-second timeout safeguard. It continues verifying seamlessly even with zero internet."*
