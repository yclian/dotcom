# Technical Design: yclian.com Digital Garden & Wine Legionnaires Dossier

## 1. Overview & Objectives

This specification defines the architecture, design, and deployment strategy for `yclian.com`.

### Core Objectives:
1. **Kill the 404**: Replace the defunct Google Sites endpoint at `yclian.com` with a responsive, typography-focused digital garden.
2. **Launch "The Other Burgundy: Aligoté"**: Publish the complete Wine Legionnaires January 2027 event dossier at `/wine-legionnaires/2027/the-other-burgundy-aligote/`.
3. **Public Repo with Private Safeguards**: Maintain `yclian/yclian.com` as a public GitHub repository while isolating private notes, vendor pricing, and editorial planning strictly on the local machine.
4. **Zero-Cost Edge Infrastructure**: Deploy via Cloudflare Pages on branch `master`, preserving all Google Workspace email and Atlassian domain verification DNS records.

---

## 2. Aesthetics & Typography Specification

The site follows a raw, unadorned editorial aesthetic prioritizing typographic hierarchy:

- **Site Brand & Headings**: `yclian.com` set in a literary Serif (`Newsreader`, with `Slabo` and `Georgia` fallbacks).
- **Structural Elements & Components**: Strictly lowercase (navigation, badges, headers, footer links, metadata tags).
- **Body & Navigation Font**: `Dosis` (clean rounded sans-serif, with `system-ui` fallbacks).
- **Color Palette**:
  - **Light Mode**: Cool off-white background (`#f8f9fa` — clean gallery tone, avoiding warm/yellow ivory) with neutral high-contrast graphite ink (`#18181b`).
  - **Dark Mode**: Automatically selected via `prefers-color-scheme`. Deep neutral slate (`#121214`) with warm-gray/white text (`#e4e4e7`).
- **Layout Density**: Minimalist spacing, centered editorial column, distraction-free reading mode.

---

## 3. Architecture & Repository Boundaries

### Dual-Vault Model
- **Primary Vault (`Oxana`)**: Stores personal life notes, financial management, raw cellar tracking, and private reasoning.
- **Publishing Vault (`yclian.com`)**: Cloned repository opened as an independent second vault in Obsidian. Only publishable notes and local editorial staging live here.

### Repository Layout
```text
C:\Users\yclian\Development\github.com\yclian\yclian.com/
├── .gitignore                      # Ignores backstage/, node_modules/, .quartz-cache/, public/
├── LICENSE                         # Dual MIT (engine) + CC BY-NC 4.0 (prose)
├── README.md                       # Project documentation & commands
├── package.json                    # Quartz v4 dependencies
├── quartz.config.ts                # Typography, themes, and ExplicitPublish filter
├── quartz.layout.ts                # Minimalist header/footer layout components
│
├── backstage/                      # [LOCAL-ONLY / GIT-IGNORED]
│   ├── Publishing Ledger.md        # Status tracker for drafts vs live notes
│   ├── ideas/                      # Unvetted raw concepts
│   └── sourcing/                   # Internal pricing, vendor contacts, private notes
│
└── content/                        # [PUBLIC / COMPILED BY QUARTZ]
    ├── index.md                    # Canonical homepage
    ├── assets/                     # Public images, diagrams, PDFs
    └── wine/
        └── wine-legionnaires/
            ├── index.md            # Wine Legionnaires sessions index
            └── 2027-01-the-other-burgundy-aligote.md  # Aligoté session dossier
```

### Git & Security Firewall
- **Branch**: `master` (canonical production branch).
- **Gitignore Rules**:
  ```gitignore
  # Private local workspace
  backstage/

  # Quartz & Node artifacts
  node_modules/
  .quartz-cache/
  public/
  .env*
  .DS_Store
  Thumbs.db
  ```
- **License**:
  - Code & Quartz configuration: **MIT License**.
  - Prose, tasting notes, and articles: **Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)**.

---

## 4. Content Specifications

### 4.1. Homepage (`content/index.md`)
- **Frontmatter**:
  ```yaml
  ---
  title: "yclian.com"
  publish: true
  enableToc: false
  ---
  ```
- **Content Elements**:
  - Lowercase focus line: `writing, systems, wine, and other things.`
  - Curated link list:
    - [substack](https://yclian.substack.com/)
    - [linktree](https://linktr.ee/yclian)
    - [x / @yclian](https://x.com/yclian)
    - [wine legionnaires](/wine/wine-legionnaires/)
  - Status note: `a new site is taking shape.`

### 4.2. Wine Legionnaires Index (`content/wine/wine-legionnaires/index.md`)
- **Frontmatter**:
  ```yaml
  ---
  title: "wine legionnaires"
  publish: true
  enableToc: false
  ---
  ```
- **Content**: Overview of the tasting collective, format principles, and index table linking to sessions.

### 4.3. Event Dossier (`content/wine/wine-legionnaires/2027-01-the-other-burgundy-aligote.md`)
- **Frontmatter**:
  ```yaml
  ---
  title: "the other burgundy: aligoté"
  description: "Wine Legionnaires — Session dossier for January 2027"
  date: 2026-09-13
  published: 2026-09-13
  publish: true
  permalink: /wine-legionnaires/2027/the-other-burgundy-aligote/
  tags:
    - wine
    - burgundy
    - aligote
    - tastings
  ---
  ```
- **Sections**:
  1. **The Roster (3 + 3 + 4)**:
     - *The Establishment*: 3 Bouzerons (showing terroir variation without palate fatigue).
     - *The Uprising*: 3 named lieux-dits/vineyards (Marsannay, centenarian/heritage parcel, additional named site).
     - *The Other World*: 2 Continental Diaspora bottles + 2 Global Wildcards.
  2. **Essential Clarifications**:
     - *Les Aligoteurs*: Definition and significance (Aligoté + auteurs).
     - *Centenarian*: Vine age definition (~100 years), not a legal classification.
     - *Varietal Thresholds*: 85% rule for international entries vs. 100% legal minimum for Bourgogne Aligoté & Bouzeron AOCs.
  3. **Sourcing Ladder**: Practical fallback guide for international entries where Singapore local stock is limited (Switzerland, Romania, Moldova, Bulgaria).
  4. **Logistics & WhatsApp Brief**: Terse broadcast copy ready for group chat distribution.

### 4.4. Local Publishing Ledger (`backstage/Publishing Ledger.md`)
- Local Markdown ledger tracking workflow states: `idea`, `draft`, `review`, `ready`, `published`, `retired`.

---

## 5. Quartz Engine Configuration

### Explicit Publication Gate
In `quartz.config.ts`, install and enable `Plugin.ExplicitPublish()`:
- Only files containing `publish: true` in their frontmatter will be emitted into `public/`.
- Prevents accidental exposure of work-in-progress notes in `content/`.

### Typography & Asset Ingestion
- In `quartz.config.ts`, load web fonts:
  - Header: `Newsreader`
  - Body: `Dosis`
  - Code: `JetBrains Mono`
- Theme colors customized:
  - `light.light`: `#f8f9fa` (cool off-white)
  - `light.lightgray`: `#e5e7eb`
  - `light.gray`: `#71717a`
  - `light.darkgray`: `#27272a`
  - `light.dark`: `#18181b` (neutral high-contrast text)
  - `dark.light`: `#121214` (neutral deep slate)
  - `dark.dark`: `#f4f4f5`

---

## 6. Cloudflare Pages & DNS Deployment

### Cloudflare Pages Build Pipeline
- **Project Name**: `yclian-com`
- **Connected Repository**: `yclian/yclian.com` (Public)
- **Production Branch**: `master`
- **Build Command**: `npx quartz build`
- **Build Output Directory**: `public`
- **Node Version**: `22.22.2` (set via `NODE_VERSION=22` in Pages environment variables).

### DNS Records Preservation (Strict Checklist)
When switching nameservers from Namecheap BasicDNS to Cloudflare:
- [ ] Retain all Google Workspace MX records.
- [ ] Retain SPF: `v=spf1 include:_spf.google.com ~all`.
- [ ] Retain Google site-verification TXT.
- [ ] Retain 3 Atlassian domain-verification TXT records.
- [ ] Replace apex `A` (`216.239.34.21`) with Cloudflare Pages apex binding.
- [ ] Replace `www` `CNAME` (`ghs.google.com`) with Cloudflare Pages `www` binding.
- [ ] Configure 301 Redirect Rule: `www.yclian.com/*` $\rightarrow$ `https://yclian.com/$1`.

---

## 7. Verification & Testing Plan

1. **Local Build Verification**:
   - Run `npx quartz build` locally to verify clean compilation with zero warnings.
   - Run `npx quartz build --serve` and inspect `http://localhost:8080`.
2. **Git Boundary Audit**:
   - Run `git status` and confirm `backstage/` remains untracked.
   - Verify `public/` is excluded from git commits.
3. **ExplicitPublish Filter Test**:
   - Add a test note with `publish: false` in `content/` $\rightarrow$ confirm it is not rendered in `public/`.
4. **Cloudflare Deployment**:
   - Push to `master` $\rightarrow$ verify Cloudflare Pages completes build in $\approx 60$ seconds.
   - Test `https://yclian.com` and `https://yclian.com/wine-legionnaires/2027/the-other-burgundy-aligote/`.
5. **DNS & Email Continuity**:
   - Send inbound and outbound test emails to `@yclian.com` to verify mail routing remains uninterrupted.
