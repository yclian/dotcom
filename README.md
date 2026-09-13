# yclian.com

Source repository for `yclian.com` — personal digital garden, essays, systems architecture notes, and Wine Legionnaires tasting session dossiers.

Engineered with **[Quartz v5](https://quartz.jzhao.xyz)** and deployed to **[Cloudflare Pages](https://pages.cloudflare.com/)** with infrastructure managed declaratively via **[Terraform](https://www.terraform.io/)**.

---

## 1. Architecture & Vault Boundaries

This repository is designed to be opened as an **independent secondary vault** in Obsidian, completely segregated from your primary personal vault.

```text
yclian.com/ (Public GitHub Repository)
├── .gitignore                      # Isolates backstage/, credentials, and build caches
├── .env.example                    # Template for Cloudflare API variables
├── LICENSE                         # Dual MIT (engine) + CC BY-NC 4.0 (prose)
├── quartz.config.yaml              # Typography, themes, and ExplicitPublish filter
├── package.json                    # Quartz v5 dependencies
│
├── backstage/                      # [LOCAL-ONLY / GIT-IGNORED]
│   ├── Publishing Ledger.md        # Status tracker for drafts vs live notes
│   ├── ideas/                      # Unvetted raw concepts
│   └── sourcing/                   # Internal pricing, vendor contacts, private notes
│
├── content/                        # [PUBLIC / COMPILED BY QUARTZ]
│   ├── index.md                    # Canonical homepage (yclian.com)
│   ├── assets/                     # Public images, diagrams, PDFs
│   └── wine/
│       └── wine-legionnaires/
│           ├── index.md            # Wine Legionnaires sessions index
│           └── 2027-01-the-other-burgundy-aligote.md  # Aligoté session dossier
│
└── terraform/                      # [INFRASTRUCTURE AS CODE]
    ├── versions.tf                 # Terraform >= 1.5.0, Cloudflare provider ~> 4.35
    ├── variables.tf                # API tokens, account ID, zone ID
    ├── dns.tf                      # Google MX/SPF, Atlassian verification, Pages CNAME
    ├── pages.tf                    # Cloudflare Pages project and domain bindings
    ├── redirects.tf                # HTTP 301 www -> apex redirect ruleset
    └── terraform.tfvars.example    # Variables template
```

### Public Repository Firewall
- **`content/`** contains only public Markdown notes and public assets.
- **`backstage/`** is strictly git-ignored. You can maintain private research, unreleased drafts, internal pricing, and the local `Publishing Ledger.md` here without risking exposure to GitHub.
- **`Plugin.ExplicitPublish`** is enabled in `quartz.config.yaml`: notes in `content/` will only be compiled into HTML if their YAML frontmatter explicitly declares `publish: true`.

---

## 2. Aesthetics & Typography

- **Site Brand & Headings**: `Newsreader` (literary Serif).
- **Navigation & Components**: Strictly lowercase in `Dosis`.
- **Main Body**: `Dosis` rounded clean sans-serif.
- **Palette**:
  - **Light Mode**: Cool off-white background (`#f8f9fa`) with neutral graphite ink (`#18181b`).
  - **Dark Mode**: Neutral deep slate (`#121214`) with light text (`#e4e4e7`), automatically triggered via `prefers-color-scheme`.
- **Editorial Voice**: Adheres to the **Functional Architect** standard: zero em dashes (uses space-enclosed dashes ` - ` or commas), zero semicolons in main prose, straight quotation marks only, and calibrated domain metaphors.

---

## 3. Local Development

### Prerequisites
- Node.js >= 22
- npm >= 10.9

### Commands
```bash
# Install dependencies
npm install

# Local build
npx quartz build

# Local live preview server (http://localhost:8080)
npx quartz build --serve
```

---

## 4. Cloudflare Infrastructure via Terraform

Infrastructure configuration is located in `terraform/`.

### Setup
1. Copy the template:
   ```bash
   cp terraform/terraform.tfvars.example terraform/terraform.tfvars
   ```
2. Populate `terraform/terraform.tfvars` with your Cloudflare API Token, Account ID, and Zone ID.
3. Plan and apply:
   ```bash
   terraform -chdir=terraform init
   terraform -chdir=terraform plan
   terraform -chdir=terraform apply
   ```

### DNS Preservation
The Terraform setup preserves all operational records for `yclian.com`:
- All 5 Google Workspace MX records.
- Google SPF TXT (`v=spf1 include:_spf.google.com ~all`).
- Google Search Console / Workspace domain verification TXT.
- 3 Atlassian domain verification TXT records.
- Apex Pages binding + `www` 301 redirect to apex.

---

## 5. Licensing

- **Software, Layouts, and Configurations**: [MIT License](LICENSE).
- **Written Articles, Dossiers, and Tasting Notes**: [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](LICENSE).
