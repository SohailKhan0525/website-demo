# Build prompt: SecureChain demo website

Paste everything below this line into Claude Code, v0.dev, bolt.new, or Cursor.
It is written so the AI agent has everything it needs in one go.

---

## What to build

A demo website for **SecureChain**, a blockchain based document verification
platform. This is for a Smart India Hackathon internal round tomorrow. It
needs to look and feel like a real product, but it does not need a real
backend or a real blockchain. Everything can be simulated on the client side.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS. Deploy target is
Vercel, so keep it a standard Next.js app with no server-only dependencies
that would break a static/edge deploy.

**Important:** the demo will be shown live in front of judges, possibly on
weak wifi. Do not call any real external API. All "blockchain" behaviour
(hashing, verifying, confirming) must be faked with local logic and
`setTimeout` delays so it always works offline.

---

## The product, in plain words

Colleges, hospitals, land offices, and other institutions still verify
documents by phone calls and letters, which takes days and is easy to fake.
SecureChain lets an issuer save a fingerprint (a cryptographic hash) of a
document on a shared, tamper proof ledger the moment it is issued. Anyone
can then scan a QR code or upload a copy of the document, and the site
instantly says whether it is genuine, changed, or cancelled, without ever
contacting the issuer.

Sectors it applies to: education certificates, land records, healthcare
records, and government documents.

---

## Pages to build

### 1. `/` — Landing page

Follow the structure below.

### 2. `/verify` — Live demo

A working (simulated) flow:

1. User either uploads a file or picks one of three preloaded sample
   documents (buttons labeled "B.Tech Provisional Certificate", "Land Title
   Deed", "Hospital Discharge Summary").
2. On submit, show a short animated sequence: "Reading file" → "Computing
   SHA-256 fingerprint" → "Checking ledger" → result. Use real
   `crypto.subtle.digest("SHA-256", ...)` on the actual uploaded file bytes,
   so the hash shown on screen is genuinely computed from that file.
3. The "ledger" is a real Supabase table, not a hardcoded array. See
   **Ledger backend (Supabase)** below for the schema and lookup logic.
4. Two of the three sample documents resolve to **Valid** (with a real row
   returned from Supabase: block number, issuer name, issue date). The third
   resolves to **Tampered** (the computed hash does not match the row's
   stored hash). Any hash with no matching row resolves to **Not found on
   ledger** (amber). Keep the three sample rows fixed in the seed data below
   so the demo is repeatable in front of judges.
5. **Offline fallback, required:** wrap the Supabase call with a 2.5 second
   timeout (`Promise.race` against a timeout promise, or `AbortController`).
   If it times out, errors, or the browser is offline (`navigator.onLine`),
   silently fall back to a local copy of the same three seed rows baked into
   the app (a plain TS object, not localStorage), and continue the demo
   exactly as if Supabase had answered. Never show an error screen or a
   spinner that hangs. The judge should never be able to tell whether the
   answer came from Supabase or from the offline copy, the UI is identical
   either way. Optionally show a tiny, calm "offline mode" label near the
   result if the fallback was used, nothing alarming.

### Ledger backend (Supabase)

Use the free tier, one table is enough.

```sql
create table ledger (
  id uuid primary key default gen_random_uuid(),
  doc_hash text not null unique,
  doc_name text not null,
  issuer text not null,
  issued_on date not null,
  status text not null default 'valid', -- 'valid' or 'revoked'
  block_ref text not null
);
```

Seed it with exactly three rows: the hash of the two "Valid" sample files
paired with real issuer/date/block_ref values, and the hash of the original
untampered "Hospital Discharge Summary" file (so that a deliberately edited
copy of that same file, used as the "Tampered" sample, produces a different
hash that does not match this row).

Client calls Supabase directly with the public anon key
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
`.env.local`), read-only, via `supabase.from('ledger').select('*').eq(
'doc_hash', computedHash).maybeSingle()`. No auth needed for a read-only
demo table. Do not expose a service role key on the client.

### 3. `/team` — Team page

Simple grid, one card per member, name and role only:

- Neelam Saidev — Team Lead
- Aith Sai Teja — Member
- Korra Praveen — Member
- Radheshyam — Member
- Akshay — Member
- Mohd Zaheeruddin — Member

---

## Landing page content (use this, do not invent new copy)

**Hero**
- Headline: "Know a document is real, without calling anyone to check."
- Subheadline: "SecureChain records a tamper proof fingerprint of every
  certificate, deed, or record the moment it is issued, so anyone can verify
  it in seconds instead of days."
- Primary CTA: "Try the live verification demo" → links to `/verify`
- Proof line under the CTA: "Built for education, land records, and
  healthcare documents"

**Problem to solution (one section)**
Write 3 to 4 sentences: manual verification today means phone calls, letters,
and weeks of waiting, and forged certificates and land papers cost real money
and real disputes. SecureChain replaces that with one shared ledger that any
authorised issuer writes to and anyone can check against.

**Benefits (four, outcome driven, write in this voice)**
- **Seconds, not weeks** — a verifier gets a Valid, Tampered, or Not found
  result instantly instead of waiting on a reply from the issuer.
- **Nothing to fake** — the original document never leaves the issuer's
  system; only its fingerprint sits on the ledger, so there is nothing
  useful for a forger to copy.
- **One system, many sectors** — the same verification layer works for
  degrees, land titles, and medical records instead of each department
  building its own.
- **Citizens keep their own copy** — a holder gets a digital wallet with
  their verified documents, instead of relying on the issuing office every
  time.

**Tagline reveal section (mandatory per design system, put after benefits)**
Two lines, large type, words fade in on scroll:
"A fingerprint cannot be forged the way a signature can.
That is the whole idea."

**How it works (three steps)**
1. **Issue** — the issuer uploads the document; SecureChain computes its
   fingerprint and writes it to the ledger with a timestamp and issuer ID.
2. **Share** — the holder receives a QR code linked to that fingerprint.
3. **Verify** — anyone scans the QR or uploads a copy; SecureChain
   recomputes the fingerprint and checks it against the ledger.

**FAQ (write six, plain language, this is a judge facing FAQ not a user
manual)**
Cover at least: what happens if the original document changes even slightly,
what happens if someone loses their QR code, why the full document is never
stored on the ledger, whether this needs every institution to adopt it at
once, what "tampered" actually means technically, and what happens if an
issuer wants to cancel or revoke a document after issuing it.

**Final CTA**
Same as hero: "Try the live verification demo"

---

## Visual direction

Dark theme, blockchain and security feeling without leaning on green matrix
cliches. Follow this design system exactly:

**Typography**
- Font: Manrope or Geist for everything. Never Inter, Roboto, or Arial.
- No italics anywhere. No ultra bold (900) weights, cap at semibold/bold.
- Snap every font size to Tailwind's default scale (text-sm through
  text-6xl). Never an arbitrary px or rem value.
- No hyphens inside sentences. No single orphaned word on the last line of
  a heading, use `text-wrap: balance` on headings.

**Color**
- Dark mode backgrounds only from: `#000000`, `#181818`, `#1F1F1F`,
  `#272727`, `#313131`.
- Accent: a teal/blue (e.g. `#2DD4BF` or `#38BDF8`) used for CTAs, the
  Valid state, and links. Do not use green for "Valid" and red for
  "Tampered" alone, also use an icon, since judges will see this on a
  projector where color can wash out.
- Hero heading only: left to right gradient from `#FFFFFF` to `#9B9B9B`.
  This is the only gradient used anywhere, and only on that text.
- No gradients on backgrounds or buttons.

**Spacing and shape**
- Use only Tailwind's default spacing scale.
- Rounded corners from Tailwind's radius scale. If a small element sits
  inside a larger rounded card with less than 32px of gap, its radius
  equals the outer radius minus the gap.
- Borders go all the way around an element or not at all, never one side.

**Icons:** Phosphor icons.

**Motion**
- Every transition uses a custom easing curve, not the default:
  `transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]`
- Sections fade up as they scroll into view (`translate-y-16 blur-md
  opacity-0` → `translate-y-0 blur-0 opacity-100`) using
  `IntersectionObserver` or Framer Motion's `whileInView`. Never a raw
  `window.addEventListener('scroll')`.
- Nav is a floating pill (`rounded-full`, detached from the top edge), not
  a full width bar.

**Content rules**
- No Lorem Ipsum, no "Acme Corp" style placeholder names, no round fake
  numbers. Use the real team names and the copy given above.
- Every button, link, and form field needs hover, active, and focus states.
  A visible focus ring is required, this is an accessibility basic, not
  optional.
- No dead links. Every nav item goes somewhere real inside this app.
- Add a real favicon, a `<title>`, and a meta description.

---

## Also include

- A footer with the team name "BlackCaps", problem statement ID
  "SIH26194", and links to `/` and `/verify` and `/team`.
- A small "This is a hackathon demo, not a production security system"
  note somewhere honest but unobtrusive, for example in the footer. Judges
  respect honesty about scope more than an unqualified security claim.
- Mobile responsive throughout, this will very likely also be opened on a
  judge's phone.

---

## Build order

1. Scaffold the Next.js app, Tailwind config, fonts.
2. Build `/` section by section: hero, benefits, tagline reveal, how it
   works, FAQ, final CTA, footer. Do not rebuild the whole page on each
   change, work one section at a time.
3. Build `/verify` with the SHA-256 + simulated ledger flow described above.
4. Build `/team`.
5. Pass: check every checklist item below before calling it done.

**Ship checklist**
- [ ] One primary action above the fold on `/`, no competing CTAs
- [ ] `/verify` works fully offline, no network calls, deterministic results
- [ ] Real SHA-256 hash shown on screen, computed from the actual file
- [ ] Single typeface, no italics, no arbitrary font sizes
- [ ] Dark backgrounds only from the approved list, one gradient only, on
      the hero heading text
- [ ] Hover, active, and focus states on every interactive element
- [ ] Works on a narrow mobile screen without breaking
- [ ] Favicon, page title, and meta description present

---

## Deploy

After the app runs locally with `npm run dev`, deploy with:

```
npm install -g vercel
vercel
```

Follow the prompts, accept the defaults, and it will give a live `.vercel.app`
URL. Use that URL in the presentation and on the SIH portal submission if a
link is asked for.
