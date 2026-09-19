# Engineering Instruction: Social Ingestion & Timeline Mining Engine (`timeline-miner`)

> **Target Repository**: `yclian/dotcom` (`https://github.com/yclian/dotcom`)  
> **Status**: Ready for Implementation  
> **Authoritative Design Reference**: `docs/specs/2026-09-13-yclian-com-design.md` & `Oxana/Commitments/Building/2026-09 WWW log.md`  
> **Date**: 2026-09-19  

---

## 1. Executive Summary & Objective

This instruction specifies the architecture, data models, CLI tooling, and Quartz rendering pipeline for **sourcing and mining published items from Substack, Twitter/X, and LinkedIn** into `yclian.com`.

The goal is to transform `yclian.com` into an integrated digital garden and public timeline that captures discrete short thoughts, medium-form social dispatches, and long-form Substack essays without cluttering the global knowledge graph.

---

## 2. Core Architectural Principles: Record vs. Essay

```
┌────────────────────────────────────────────────────────────────────────┐
│                          INGESTION TAXONOMY                            │
├──────────────────────┬──────────────────────┬──────────────────────────┤
│ Content Type         │ Destination Path     │ Graph & Link Treatment   │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ Substack Essay       │ content/essays/      │ Full participant         │
│                      │                      │ graph: true, [[links]]   │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ LinkedIn Post        │ content/timeline/YY/ │ Timeline card            │
│                      │                      │ graph: false (default)   │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ X / Twitter Post     │ content/timeline/YY/ │ Compact card             │
│                      │                      │ graph: false (default)   │
├──────────────────────┼──────────────────────┼──────────────────────────┤
│ X / Twitter Thread   │ content/timeline/YY/ │ Grouped card/accordion   │
│                      │                      │ graph: false (selective) │
└──────────────────────┴──────────────────────┴──────────────────────────┘
```

### Key Guardrails
1. **The Graph Isolation Guardrail**:
   - Short social posts and timeline items **must default to `graph: false`**.
   - Tags handle broad topical classification (e.g. `tags: [systems, architecture]`).
   - Only long-form essays, durable frameworks, and canonical notes participate in the D3 graph view via explicit `[[wikilinks]]`. This prevents hundreds of micro-thoughts from turning the visual graph into unreadable noise.
2. **Repository Firewall & Staging Hygiene**:
   - Raw scrapes, unvetted archive dumps, and staging files run strictly inside local, git-ignored `backstage/intake/`.
   - Only reviewed and approved Markdown records are committed to `content/timeline/YYYY/` with `publish: true`.
   - The status of all records is logged in `backstage/Publishing Ledger.md`.
3. **Orthographic & Editorial Standards**:
   - Adhere strictly to the "Functional Architect" voice (`Oxana/Skills/personal-blogging`).
   - Zero em dashes (`—`) in body prose (use spaced hyphens ` - ` or structural bulleting).
   - Zero prose semicolons.
   - Straight quotation marks only (`"` and `'`).

---

## 3. Directory Layout & Routing Specification

All public items live inside `content/` and compile via Quartz v5 into clean URLs:

```text
content/
├── index.md                        <-- Centerpiece landing page
├── timeline/
│   ├── index.md                    <-- Reverse-chronological timeline (/timeline/)
│   └── 2026/
│       ├── 2026-09-10-operating-model.md
│       └── 2026-09-03-agent-evaluation.md
├── essays/
│   ├── index.md                    <-- Essays directory (/essays/)
│   └── agent-evaluation-production-control-system.md
├── from/
│   ├── index.md                    <-- Filter index (/from/)
│   ├── substack/index.md           <-- Filtered Substack stream (/from/substack/)
│   ├── x/index.md                  <-- Filtered X stream (/from/x/)
│   └── linkedin/index.md           <-- Filtered LinkedIn stream (/from/linkedin/)
└── wine/
    └── wine-legionnaires/          <-- Existing wine dossiers
```

---

## 4. Frontmatter Schemas

### A. Timeline Micro-Record (`content/timeline/YYYY/*.md`)
```yaml
---
title: "The operating model is the system"
date: 2026-09-10T14:30:00+08:00
type: timeline
source: linkedin          # enum: substack | x | linkedin | manual
sourceUrl: "https://www.linkedin.com/posts/yclian_..."
tags:
  - enterprise-systems
  - operating-models
graph: false
publish: true
---
```

### B. Full Long-Form Essay (`content/essays/*.md`)
```yaml
---
title: "Agent Evaluation as a Production Control System"
date: 2026-09-03T10:00:00+08:00
type: essay
source: substack
sourceUrl: "https://yclian.substack.com/p/agent-evaluation-production-control-system"
subtitle: "Why benchmarking without closed-loop feedback fails in enterprise fleets."
tags:
  - agents
  - systems-architecture
graph: true
publish: true
---
```

---

## 5. Platform-Specific Sourcing & Mining Mechanics

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    SUBSTACK     │       │    TWITTER / X   │       │    LINKEDIN     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ Open RSS Feed   │       │ Walled API ($)  │       │ Walled Garden   │
│ Full HTML Text  │       │ Rate limits     │       │ No public feeds │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
    Auto-poll RSS           Archive backfill +       Export CSV backfill +
                            oEmbed / Hermes URL      WeeklySocialDispatch tap
         │                         │                         │
         └────────────────► ┌──────▼──────┐ ◄────────────────┘
                            │  BACKSTAGE  │
                            │ INTAKE QUEUE│
                            └──────┬──────┘
                                   │ Filter & tag
                            ┌──────▼──────┐
                            │   content/  │
                            │  timeline/  │
                            └─────────────┘
```

### Platform 1: Substack (`https://yclian.substack.com/feed`)
- **Access Protocol**: Open public RSS 2.0 / Atom feed. Zero authentication or API tokens needed.
- **Data Payload**: Full post HTML, title, publication date, subtitle/description, canonical URL, and categories.
- **Ingestion Pipeline**:
  1. Fetch `https://yclian.substack.com/feed` using standard HTTP GET.
  2. Parse XML items via `fast-xml-parser` or `rss-parser`.
  3. Extract `content:encoded` (or `description` fallback).
  4. Convert HTML into clean GitHub Flavored Markdown using `turndown` with custom rules to preserve code blocks and clean image embeds.
  5. Sanitize text: convert curly quotes to straight quotes, remove em dashes and prose semicolons.
  6. Generate slug from post title or Substack URL slug.
  7. Check if file already exists in `content/essays/` or `content/timeline/` to guarantee idempotency.
  8. Write target `.md` file with appropriate frontmatter.

### Platform 2: Twitter / X (`@yclian`)
- **Access Protocol**:
  - Official API v2 is paywalled ($100+/mo).
  - Web scraping is blocked by aggressive rate limits and login walls.
- **Ingestion Pipeline**:
  1. **Historical Backfill (Archive Mode)**:
     - User downloads their X archive (`tweets.js`).
     - Script reads `tweets.js`, parses JSON array of tweets.
     - **Filter Criteria**: Exclude `@` replies (unless self-thread), exclude retweets (`RT @...`), minimum length > 50 characters (or media attachment present).
     - Threads are detected by chaining `in_reply_to_status_id_str` matching the author's own tweet IDs. Group threads into a single Markdown file with ordered sections.
     - Emit candidate notes to `backstage/intake/x/` with `date`, `source: x`, `sourceUrl: https://x.com/yclian/status/<id>`.
  2. **Live / Single-URL Ingestion (URL Mode)**:
     - User provides a single tweet URL (e.g. `pnpm ingest https://x.com/yclian/status/123456789`).
     - Script queries Twitter's **free public oEmbed API**:
       `https://publish.twitter.com/oembed?url=https://twitter.com/yclian/status/123456789&omit_script=true`
     - Extracts author, clean HTML, and permalink. Converts HTML to Markdown and writes directly to `content/timeline/YYYY/`.

### Platform 3: LinkedIn (`https://www.linkedin.com/in/yclian`)
- **Access Protocol**: Strict walled garden, no public RSS feeds, anti-bot protection.
- **Ingestion Pipeline**:
  1. **Historical Backfill (Archive Mode)**:
     - User requests personal data archive (Settings $\rightarrow$ Data Privacy $\rightarrow$ Get a copy of your data $\rightarrow$ Posts).
     - LinkedIn produces `Shares.csv` containing `Date`, `ShareCommentary`, and `ShareLink`.
     - Script parses CSV rows, extracts text, strips tracking query parameters from URLs.
     - Formats text into clean paragraphs, writes candidate files to `backstage/intake/linkedin/`.
  2. **Live / Ongoing Capture (Outbound Tap Mode)**:
     - YC's fleet automation (`WeeklySocialDispatch` running on Adara under `FLEETS.md`) already crafts technical dispatches and stores them locally at `Documents\Oxana\Personal\Writing\Social\`.
     - Rather than scraping LinkedIn backwards, tap the outbound source: add an automated intake step that promotes approved dispatch Markdown directly into `content/timeline/YYYY/` with `source: linkedin`.

---

## 6. CLI Tooling Specification (`scripts/mine.ts`)

Create a unified CLI script in the repository: `scripts/mine.ts` (executable via `pnpm mine <command>`).

### Command Surface
```bash
# 1. Sync latest Substack essays and notes
pnpm mine:substack

# 2. Ingest single post via public URL (X or LinkedIn)
pnpm mine:url https://x.com/yclian/status/1834567890123456789
pnpm mine:url https://yclian.substack.com/p/my-new-post

# 3. Import historical archive dumps
pnpm mine:archive --source x --file ./backstage/raw/tweets.js
pnpm mine:archive --source linkedin --file ./backstage/raw/Shares.csv

# 4. Review & promote staged items
pnpm mine:promote --all
pnpm mine:promote --slug 2026-09-10-operating-model
```

### Dependencies to Install
```json
{
  "devDependencies": {
    "fast-xml-parser": "^4.5.0",
    "turndown": "^7.2.0",
    "csv-parse": "^5.6.0",
    "commander": "^13.0.0"
  }
}
```

---

## 7. Quartz Frontend & Rendering Requirements

### A. Timeline Stream Page (`content/timeline/index.md`)
- Serves as the main reverse-chronological feed.
- Rendered with a custom Quartz component or SCSS styling displaying:
  - Source badge (`substack` in orange/coral, `x` in slate/black, `linkedin` in steel blue).
  - Date timestamp.
  - Title linking to the permalink.
  - Excerpt / body text.
  - External source icon linking to `sourceUrl`.

### B. Source Filter Views (`content/from/*/index.md`)
- `content/from/substack/index.md`: Filters and displays only Substack articles.
- `content/from/x/index.md`: Filters and displays only X thoughts and threads.
- `content/from/linkedin/index.md`: Filters and displays only LinkedIn posts.

### C. Top-Left Navigation Integration
Update `quartz/styles/custom.scss` and `content/index.md` so the top-left floating dropdown menus link seamlessly to these new views:
- **channels**: `x`, `substack`, `linktree` (external links).
- **archives**: `timeline`, `wine legionnaires`, `essays` (internal routes).

---

## 8. Phased Implementation Roadmap

When executing this work in a new conversation, proceed in this sequence:

### Phase 1: Substack Feed Synchronizer (Quickest Win)
1. Install `fast-xml-parser` and `turndown`.
2. Write `scripts/sync-substack.ts` targeting `https://yclian.substack.com/feed`.
3. Verify it extracts posts, formats frontmatter, and writes clean Markdown to `content/essays/` or `content/timeline/2026/`.
4. Add npm script `"mine:substack": "tsx scripts/sync-substack.ts"` in `package.json`.

### Phase 2: Timeline Architecture & Quartz Templates
1. Scaffold `content/timeline/index.md`, `content/essays/index.md`, and `content/from/*/index.md`.
2. Add CSS rules in `quartz/styles/custom.scss` for timeline cards, source pill badges, and external link indicators.
3. Verify Quartz build generates valid HTML and responsive layout.

### Phase 3: Single-URL Ingestor (`pnpm mine:url`)
1. Implement Twitter oEmbed parser in `scripts/mine.ts`.
2. Test pasting an X status URL and generating a formatted timeline record.

### Phase 4: Archive Backfill Parsers
1. Build `tweets.js` parser with retweet/reply filtering and thread stitching.
2. Build `Shares.csv` parser for LinkedIn historical exports.
3. Test staging in `backstage/intake/` before bulk promotion.
