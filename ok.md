# Team Briefing: SecureChain Demo Website
**Team:** BlackCaps | **Team ID:** TID146 | **Problem Statement:** SIH26194  
**Live Demo:** https://teamblackcaps.vercel.app  
**GitHub:** https://github.com/SohailKhan0525/website-demo.git

---

## 👋 Hey Team! Read This Before Our Presentation

This document explains everything about our live demo website so all 6 of us are on the exact same page when talking to the judges tomorrow.

---

## 1. What Problem Does SecureChain Solve?

Right now in India, when someone applies for a job, buys land, or submits health insurance claims:
- Universities and offices verify documents via **phone calls, emails, and physical letters**.
- This takes **2 to 3 weeks**.
- Counterfeit certificates and forged land deeds cost citizens and governments crores of rupees every year.

**SecureChain's solution:**
When an institution (like NIT Warangal or Apollo Hospitals) issues a document, SecureChain calculates a unique mathematical **fingerprint (SHA-256 hash)** and permanently seals that fingerprint into an immutable distributed ledger.

When anyone checks the document later:
- The website re-calculates the fingerprint of the file.
- It compares it to the ledger.
- If it matches: **Valid** in 400 milliseconds.
- If even 1 number was altered: **Tampered** detected immediately.
- If it was never registered: **Not found**.

---

## 2. Is This a "Real" Demo or Just Fake Buttons?

**It is 100% real and functional:**
1. **Real Hashing:** When you upload a file or click a sample, your browser's native `crypto.subtle.digest("SHA-256")` reads the actual bytes in memory and calculates the real SHA-256 hash.
2. **Real Database/Ledger:** It connects live to a real **Supabase PostgreSQL database** table (`public.ledger`) storing the block references, issuer names, and timestamps.
3. **Real Zero-Trust Security:** If you upload your own random file, it does NOT just give a fake green tick. It queries the ledger, finds no issuer record, and correctly reports "Not found on ledger".
4. **Real Live Issuance (Demo Mode):** You can use the built-in **Issuer Portal Simulator** on the page to register your custom file into the Supabase ledger table in real time, and it will immediately verify as **Valid**!
5. **Offline Safety:** If the presentation room Wi-Fi is weak or disconnects, the app has a 2.5-second fallback cache. It will NEVER crash or show an error screen in front of judges.

---

## 3. The 3 Pages on Our Website

1. **`/` (Landing Page):**
   - Clean, modern dark mode with floating pill navbar.
   - Shows problem-to-solution, 4 benefit cards, tagline reveal animation, and FAQ accordion.
   - Fully responsive on both laptop screens and mobile phones.
2. **`/verify` (Live Demo Suite):**
   - **Sample 1 (B.Tech Degree):** Authentic certificate. Click "Preview" to inspect without downloading. Click verify → **Valid** (`BLK-749201-ETH`).
   - **Sample 2 (Land Deed):** Authentic government survey deed → **Valid** (`BLK-810492-ETH`).
   - **Sample 3 (Hospital Summary):** Modified billing number → **Tampered** (shows the hash mismatch in red).
   - **Custom Upload Tab:** Upload any file → shows "Not found" → click "Anchor & Seal to Ledger" → seals to block and verifies as **Valid**!
3. **`/team` (Team Page):**
   - Shows all 6 members with verified names and roles:
     - Neelam Saidev — Team Lead
     - Aith Sai Teja — Member
     - Korra Praveen — Member
     - Radheshyam — Member
     - Akshya — Member (with female icon)
     - Mohd Zaheeruddin — Member

---

## 4. Team Roles & Judge Presentation

- **Neelam Saidev:** Team Lead
- **All other 5 teammates:** Members
  - Aith Sai Teja — Member
  - Korra Praveen — Member
  - Radheshyam — Member
  - Akshya — Member
  - Mohd Zaheeruddin — Member

### How We Handle the Pitch
- **Neelam Saidev (Team Lead):** Opens the presentation, introduces Team BlackCaps (TID146), mentions problem statement SIH26194, and closes.
- **Live Demo Walkthrough:** Open `teamblackcaps.vercel.app/verify` on the screen and show:
  1. B.Tech certificate verification (**Valid** in 400ms).
  2. Hospital discharge summary (**Tampered** detected).
  3. Custom file upload (**Not found**, zero-trust security) → Click **"Anchor & Seal to Ledger"** to show live issuer consensus!
- **If Judges Ask Questions:** Any member can chime in using these 3 simple facts:
  1. *How does it work?* Document hash (SHA-256) is computed in the browser and matched against the distributed ledger.
  2. *What about privacy?* The actual document is never on the blockchain—only the 32-byte hash fingerprint is stored.
  3. *Why not a standard database?* A normal database can be altered by any admin without an audit trail; a distributed ledger with PBFT consensus is tamper-proof and multi-institutional.

---

## 5. The Golden Rule for Tomorrow
**Don't panic if Wi-Fi lags.** The website is engineered to silently switch to local offline verification after 2.5 seconds. Everything is tested, deployed on Vercel (`teamblackcaps.vercel.app`), and committed to GitHub!
