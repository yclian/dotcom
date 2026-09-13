# yclian.com Infrastructure, Quartz Digital Garden & Wine Legionnaires Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy `yclian.com` on Cloudflare Pages using Quartz v4 and Terraform, publishing the Wine Legionnaires Aligoté dossier under the Functional Architect editorial protocol while securing the public git boundary.

**Architecture:** A static digital garden powered by Quartz v4 deployed on Cloudflare Pages with IaC managed via Terraform. Content is partitioned into a public `content/` folder and a local-only, gitignored `backstage/` folder for private editorial workflows. Typography is strictly styled (Newsreader serif headline, Dosis body, lowercase structural components).

**Tech Stack:** Quartz v4 (Node.js 22, TypeScript), Terraform v1.15+ (Cloudflare Provider v4), Cloudflare Pages & DNS, Markdown/Obsidian.

**Spec:** [`docs/specs/2026-09-13-yclian-com-design.md`](file:///C:/Users/yclian/Development/github.com/yclian/yclian.com/docs/specs/2026-09-13-yclian-com-design.md)  
**Writing Style Guide:** [`C:\Users\yclian\Documents\Oxana\Skills\personal-blogging\SKILL.md`](file:///C:/Users/yclian/Documents/Oxana/Skills/personal-blogging/SKILL.md) & [`resources/wine-blogging.md`](file:///C:/Users/yclian/Documents/Oxana/Skills/personal-blogging/resources/wine-blogging.md)

## Global Constraints

- Branch is strictly `master` (never rename to main).
- Git repository `yclian/yclian.com` is public: `cf.secret.txt`, `.env*`, `terraform.tfstate*`, and `backstage/` MUST be completely gitignored.
- No em dashes (—) anywhere in prose: use commas, periods, or space-enclosed dashes ( - ).
- No semicolons in main body sentences.
- Straight quotation marks (' ' and " ") only (no curly/smart quotes).
- Structural elements, navigation, and badges must be strictly lowercase.
- All Google Workspace MX, SPF, Google site-verification, and Atlassian TXT records must be preserved in Terraform DNS.

---

### Task 1: Security Firewall, Secrets & Licensing

**Files:**
- Create: `.gitignore`
- Create: `.env`
- Create: `.env.example`
- Modify: `LICENSE`

**Interfaces:**
- Consumes: `cf.secret.txt` token
- Produces: Sanitized git environment where secrets and `backstage/` are invisible to git.

- [ ] **Step 1: Write `.gitignore` to lock down secrets and backstage**
Ensure `.gitignore` contains:
```gitignore
# Security & Credentials
cf.secret.txt
*.secret.txt
.env
.env.*
!.env.example

# Terraform state & cache
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl

# Local Private Vault Workspace
backstage/

# Node & Quartz Artifacts
node_modules/
.quartz-cache/
public/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS artifacts
.DS_Store
Thumbs.db
```

- [ ] **Step 2: Create `.env` and `.env.example` with inline docs**
Read token from `cf.secret.txt` and generate `.env`:
```bash
CLOUDFLARE_API_TOKEN=<token from cf.secret.txt>
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ZONE_ID=
```
Create `.env.example` documenting all three variables and permissions required.

- [ ] **Step 3: Update `LICENSE` to Dual MIT + CC BY-NC 4.0**
Update `LICENSE` to grant MIT for code/configurations and CC BY-NC 4.0 for prose/articles.

- [ ] **Step 4: Verify git status ignores secrets**
Run `git status` and verify `cf.secret.txt`, `.env`, and `backstage/` do NOT appear as untracked files.

- [ ] **Step 5: Commit Task 1**
```bash
git add .gitignore .env.example LICENSE
git commit -m "chore: configure security gitignore, env templates, and dual licensing"
```

---

### Task 2: Cloudflare Terraform Infrastructure

**Files:**
- Create: `terraform/versions.tf`
- Create: `terraform/variables.tf`
- Create: `terraform/dns.tf`
- Create: `terraform/pages.tf`
- Create: `terraform/redirects.tf`
- Create: `terraform/terraform.tfvars.example`

**Interfaces:**
- Consumes: Cloudflare API credentials from environment/tfvars
- Produces: Declarative infrastructure code for `yclian.com` DNS, Cloudflare Pages project, and 301 apex redirect rule.

- [ ] **Step 1: Create `terraform/versions.tf`**
Define Terraform version (>= 1.5.0) and Cloudflare provider `cloudflare/cloudflare` (~> 4.35).

- [ ] **Step 2: Create `terraform/variables.tf`**
Define variables: `cloudflare_api_token`, `account_id`, `zone_id`, `domain_name` (default: `"yclian.com"`).

- [ ] **Step 3: Create `terraform/dns.tf` with strict record preservation**
Declare DNS records:
- 5 Google Workspace MX records (aspmx.l.google.com, etc.).
- Google SPF TXT record (`v=spf1 include:_spf.google.com ~all`).
- Google site verification TXT record.
- 3 Atlassian domain verification TXT records.
- Apex `CNAME` pointing to Pages project.
- `www` `CNAME` pointing to apex.

- [ ] **Step 4: Create `terraform/pages.tf` & `terraform/redirects.tf`**
Declare `cloudflare_pages_project` for `yclian-com` configured for `master` branch, build command `npx quartz build`, output dir `public`, and `NODE_VERSION="22"`.
Declare 301 URL redirect rule from `www.yclian.com/*` to `https://yclian.com/$1`.

- [ ] **Step 5: Verify Terraform configuration**
Run `terraform fmt -check` and `terraform -chdir=terraform init -backend=false`.

- [ ] **Step 6: Commit Task 2**
```bash
git add terraform/
git commit -m "feat(infra): add Cloudflare Terraform configurations for DNS, Pages, and redirects"
```

---

### Task 3: Quartz v4 Engine & Typography Configuration

**Files:**
- Create: `package.json`
- Create: `quartz.config.ts`
- Create: `quartz.layout.ts`
- Create: `quartz/` engine files (via Quartz v4 bootstrap)

**Interfaces:**
- Consumes: Node.js 22 runtime
- Produces: Functioning Quartz SSG engine with `ExplicitPublish` filter, custom Google Fonts (`Newsreader` + `Dosis`), and cool off-white palette.

- [ ] **Step 1: Scaffold Quartz v4 base**
Initialize Quartz v4 in the project root.

- [ ] **Step 2: Configure `quartz.config.ts` with ExplicitPublish & Fonts**
- Add `Plugin.ExplicitPublish()` to the emitters list.
- Set typography fonts:
  - Header: `"Newsreader", Georgia, serif`
  - Body: `"Dosis", system-ui, sans-serif`
  - Code: `"JetBrains Mono", monospace`
- Set palette:
  - Light mode background: `#f8f9fa` (cool off-white gallery tone).
  - Light mode text: `#18181b` (high-contrast graphite).
  - Dark mode background: `#121214` (deep slate).
  - Dark mode text: `#e4e4e7`.

- [ ] **Step 3: Configure `quartz.layout.ts` for lowercase component styling**
Configure header, search, page title, and explorer components to enforce lowercase aesthetic.

- [ ] **Step 4: Test build execution**
Run `npx quartz build` to ensure the compilation pipeline functions without errors.

- [ ] **Step 5: Commit Task 3**
```bash
git add package.json quartz.config.ts quartz.layout.ts
git commit -m "feat(engine): configure Quartz v4 with ExplicitPublish and Newsreader/Dosis typography"
```

---

### Task 4: Editorial Content & Wine Legionnaires Dossier

**Files:**
- Create: `content/index.md`
- Create: `content/wine/wine-legionnaires/index.md`
- Create: `content/wine/wine-legionnaires/2027-01-the-other-burgundy-aligote.md`
- Create: `backstage/Publishing Ledger.md`

**Interfaces:**
- Consumes: Functional Architect blogging protocol from `personal-blogging/SKILL.md` and `wine-blogging.md`
- Produces: Canonical homepage and January 2027 Aligoté event dossier ready for public release.

- [ ] **Step 1: Write `content/index.md`**
Create minimalist lowercase homepage:
- Title: `yclian.com`
- Focus: `writing, systems, wine, and other things.`
- Links: `substack`, `linktree`, `x / @yclian`, `wine legionnaires`.
- Note: `a new site is taking shape.`
- Frontmatter: `publish: true`.

- [ ] **Step 2: Write `content/wine/wine-legionnaires/index.md`**
Create hub page introducing Wine Legionnaires tasting principles and links to sessions.

- [ ] **Step 3: Write `content/wine/wine-legionnaires/2027-01-the-other-burgundy-aligote.md`**
Write the full dossier strictly adhering to the **Functional Architect Wine Blogging Protocol**:
- Zero em dashes (use commas, periods, or space-enclosed dashes ` - `).
- Zero semicolons in main prose sentences.
- Straight quotation marks (' ' and " ").
- 1.5 paragraph intro framing the Aligoté shift (from high-acid blending workhorse to serious terroir wine).
- 3 + 3 + 4 Flight Roster:
  - 3 Bouzerons (The Establishment).
  - 3 Lieux-dits / Heritage parcels (The Uprising).
  - 2 Continental Diaspora + 2 Global Wildcards (The Other World).
- Clear definitions: Les Aligoteurs (Aligoté + auteurs), centenarian vine age definition, 85% international vs 100% Burgundy AOC threshold.
- Sourcing fallback ladder for Singapore.
- WhatsApp broadcast-ready copy block.

- [ ] **Step 4: Create `backstage/Publishing Ledger.md`**
Create local Markdown status ledger with table tracking draft status, source paths, and public URLs.

- [ ] **Step 5: Run Pre-Publication Style Audit**
Verify:
1. No em dashes in markdown.
2. No semicolons in main prose.
3. Straight quotes only.
4. Only `publish: true` files are emitted by Quartz.

- [ ] **Step 6: Commit Task 4**
```bash
git add content/
git commit -m "feat(content): add homepage and Wine Legionnaires Aligoté session dossier"
```

---

### Task 5: End-to-End Verification & Documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Built `public/` directory and git repo
- Produces: Fully verified site ready for Cloudflare Pages deployment.

- [ ] **Step 1: Verify local build**
Run `npx quartz build` and inspect generated HTML files in `public/`.
Confirm `/wine-legionnaires/2027/the-other-burgundy-aligote/index.html` is generated.

- [ ] **Step 2: Verify git status and privacy firewall**
Run `git status`. Confirm:
- `backstage/` is untracked and clean.
- `cf.secret.txt` and `.env` are untracked and clean.
- `public/` is not committed.

- [ ] **Step 3: Write comprehensive `README.md`**
Document the dual-vault Obsidian workflow, local commands (`npx quartz build --serve`), Terraform deployment steps, and DNS verification instructions.

- [ ] **Step 4: Commit Task 5 and push to origin master**
```bash
git add README.md
git commit -m "docs: add repository operations guide and deployment instructions"
git push origin master
```
