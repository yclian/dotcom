# Technical Design: Agent Skills Catalog (`yclian.com/skills`)

## 1. Overview & Objectives

This specification defines the data schema, ingestion pipeline, and presentation architecture for publishing the [`yclian/skills`](https://github.com/yclian/skills) repository onto `yclian.com`.

### Core Objectives:
1. **Immediate CLI Adoption**: Allow visitors to copy the exact one-line installation command (`npx skills add git@github.com:yclian/skills.git --skill <skill>`) at the top of every skill page and from the main index.
2. **Web-Readable Runbooks**: Render each skill's `SKILL.md` documentation, architecture notes, and operational runbooks cleanly within the existing Quartz 5 typographic system.
3. **Enhanced Skill Metadata**: Enrich the upstream `SKILL.md` frontmatter with `example-prompts`, `related` internal skills, and external `references`—improving both the raw skill files and the rendered web catalog.
4. **Minimal Infrastructure Boundary**: Preserve the strict 2-service dependency model (**GitHub + Cloudflare Pages**). Deployment relies on Cloudflare Pages' native GitHub integration (`git push origin master`) with zero third-party secret managers.

---

## 2. Upstream Skill Frontmatter Schema (`yclian/skills`)

Each skill directory (`<slug>/SKILL.md`) in `yclian/skills` will use the following YAML frontmatter schema:

```yaml
---
name: antigravity-extras
description: Operational tribal knowledge, hidden internals, quirks, and runbooks for Google Antigravity / Antigravity 2.0 that agents do not natively know about themselves.
allowed-tools:
  - run_command
  - view_file
  - write_to_file
  - replace_file_content
example-prompts:
  - "Schedule a persistent sidecar task that runs daily at 9am."
  - "Diagnose why my /schedule background task stopped after restarting the app."
  - "Connect to the running Antigravity browser via CDP without triggering security flags."
related:
  - sync-antigravity-conversations
references:
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
  - title: "Vercel Labs agent-skills CLI (npx skills)"
    url: "https://github.com/vercel-labs/agent-skills"
---
```

### Field Rules:
- `name` *(required)*: Canonical slug matching the parent directory name (e.g., `sync-antigravity-conversations`).
- `description` *(required)*: Plain-text summary explaining what problem the skill solves and when an agent should trigger it.
- `allowed-tools` *(optional)*: Preserved in `SKILL.md` for agent runtime consumption, **omitted** from the rendered web UI to avoid visual noise.
- `example-prompts` *(optional)*: 2–3 concrete user prompts that demonstrate how to invoke or benefit from the skill.
- `related` *(optional)*: Array of sibling skill slugs within `yclian/skills` to cross-link.
- `references` *(optional)*: Array of `{ title, url }` objects pointing to external docs, tools, or similar skill registries.

---

## 3. Ingestion & Sync Pipeline (`dotcom`)

### 3.1. Script Location & Dependencies
- **Script**: `scripts/sync-skills.mjs`
- **Runtime**: Pure JavaScript ES Module executed directly via `node ./scripts/sync-skills.mjs` (Node >= 22) using `yaml`, `fs/promises`, and `child_process`. Zero TypeScript compilation or extra dependencies required.

### 3.2. Source Resolution Strategy
When `scripts/sync-skills.mjs` runs:
1. **Local Sibling Discovery (Primary)**: Checks `process.env.SKILLS_DIR` or defaults to `../skills` (`c:\Users\yclian\Development\github.com\yclian\skills`).
2. **Remote Clone Fallback (CI / Standalone)**: If the local directory is absent, shallow-clones `https://github.com/yclian/skills.git` into `.quartz-cache/skills-source`.

### 3.3. Parsing & Transformation Pipeline
```text
[yclian/skills/*/SKILL.md]
        │
        ▼
1. Parse YAML frontmatter + Markdown body (Build Map<slug, SkillRecord>)
        │
        ▼
2. Strip leading H1 (# Title) from body (prevents duplication with Quartz article-title)
        │
        ▼
3. Compose Quartz Markdown:
   - Quartz Frontmatter (title, description, publish: true, tags)
   - Quick Install block (`npx skills add ... --skill <slug>`)
   - Example Prompts callout section
   - Original SKILL.md Markdown body
   - Resolved Related Skills & External References footer
        │
        ▼
[dotcom/content/skills/index.md & dotcom/content/skills/<slug>.md]
```

### 3.4. Build Integration
- **`package.json` scripts**:
  ```json
  "sync-skills": "node ./scripts/sync-skills.mjs",
  "prebuild": "npm run install-plugins && npm run sync-skills"
  ```
- **Git Tracked Content**: The generated `content/skills/*.md` files are committed to the `dotcom` repository. Because Cloudflare Pages runs `npx quartz build` directly, committing the synced markdown guarantees deterministic edge builds while `npm run sync-skills` (and `npm run build`) keeps them synchronized locally.

---

## 4. Presentation & Page Layouts

All pages adhere to `yclian.com`'s editorial aesthetic (`Newsreader` headers, `Dosis` body, `JetBrains Mono` code blocks, lowercase structural labels).

### 4.1. Homepage Navigation (`content/index.md`)
Add `skills` to the homepage navigation dropdown under `archives`:
```html
<div class="nav-dropdown">
  <button class="nav-trigger" type="button" aria-haspopup="true">archives <span class="nav-caret">▾</span></button>
  <div class="nav-menu">
    <a href="/skills/">skills</a>
    <a href="/wine/wine-legionnaires/">wine legionnaires</a>
  </div>
</div>
```

### 4.2. Catalog Index Page (`content/skills/index.md` → `/skills/`)

- **Frontmatter**:
  ```yaml
  ---
  title: "skills"
  description: "Reusable AI agent skills, operational runbooks, and local decision engines."
  publish: true
  enableToc: false
  ---
  ```
- **Page Structure**:
  1. **Editorial Intro**: Brief overview of the agent skills collection and how they extend coding and workflow agents.
  2. **Global Installation Block**:
     ```bash
     # Install all skills from the repository
     npx skills add git@github.com:yclian/skills.git

     # Or install a single skill
     npx skills add git@github.com:yclian/skills.git --skill <skill-name>
     ```
  3. **Available Skills Table**:
     | skill | summary | install |
     | :--- | :--- | :--- |
     | [antigravity-extras](/skills/antigravity-extras/) | Operational tribal knowledge, hidden internals, and runbooks for Antigravity 2.0. | `npx skills add git@github.com:yclian/skills.git --skill antigravity-extras` |
     | ... | ... | ... |
  4. **Ecosystem Discovery Footer**:
     Links to the upstream [`yclian/skills` GitHub repository](https://github.com/yclian/skills) and community skill directories.

### 4.3. Individual Skill Page (`content/skills/<slug>.md` → `/skills/<slug>/`)

- **Frontmatter**:
  ```yaml
  ---
  title: "<slug>"
  description: "<skill description>"
  publish: true
  enableToc: true
  tags:
    - skills
  ---
  ```
- **Page Structure**:
  1. **Summary Lead**: `<description>` rendered cleanly below the title.
  2. **Quick Install Block**:
     ```bash
     npx skills add git@github.com:yclian/skills.git --skill <slug>
     ```
  3. **When to Use & Example Prompts** *(rendered if `example-prompts` is non-empty)*:
     ```markdown
     ### example prompts

     - *"Schedule a persistent sidecar task that runs daily at 9am."*
     - *"Diagnose why my /schedule background task stopped after restarting the app."*
     ```
  4. **Documentation & Runbooks**:
     The body of `SKILL.md` with relative links normalized.
  5. **Related Skills & References Footer**:
     ```markdown
     ---

     ### related skills & references

     **in this collection**
     - [sync-antigravity-conversations](/skills/sync-antigravity-conversations/) — Synchronize and merge Antigravity conversations, transcripts, and profile databases.

     **external references & similar skills**
     - [yclian/skills on GitHub](https://github.com/yclian/skills)
     - [Explore more skills via npx skills (vercel-labs/agent-skills)](https://github.com/vercel-labs/agent-skills)
     ```

---

## 5. Initial Skills Enrichment Mapping

The 7 existing skills in `yclian/skills` will be enriched as follows:

| Skill Slug | Normalized `name` | Related Internal Skills | Key External References |
| :--- | :--- | :--- | :--- |
| `antigravity-extras` | `antigravity-extras` | `sync-antigravity-conversations` | Antigravity Docs, Chrome DevTools Protocol |
| `sync-antigravity-conversations` | `sync-antigravity-conversations` *(fixed from `yclian-antigravity-sync-conversations`)* | `antigravity-extras` | SQLite WAL Documentation |
| `gmail-filter-manager` | `gmail-filter-manager` | `work-signal` | Gmail Search Operators Reference, Terraform Google/Gmail Provider |
| `work-signal` | `work-signal` | `gmail-filter-manager`, `todo-in-obsidian` | Gmail API Reference |
| `calendar-tbd-recommender` | `calendar-tbd-recommender` | `todo-in-obsidian`, `work-signal` | Google Calendar API Reference |
| `laya-system-one` | `laya-system-one` | `work-signal`, `gmail-filter-manager` | ModernBERT (Answer.AI / Hugging Face), Model Context Protocol (MCP) |
| `todo-in-obsidian` | `todo-in-obsidian` | `work-signal`, `calendar-tbd-recommender` | Obsidian Tasks Plugin Documentation |

---

## 6. Error Handling & Testing

1. **Missing Frontmatter Fields**:
   - If `name` or `description` is missing in any `SKILL.md`, `sync-skills.mjs` throws a descriptive build error naming the offending file.
   - If `example-prompts`, `related`, or `references` are omitted, the corresponding section is gracefully skipped or falls back to default catalog links.
2. **Broken Internal `related` Slugs**:
   - If a skill lists a `related` slug that does not exist in `yclian/skills`, `sync-skills.mjs` logs a warning and omits the broken link (or fails in `--strict` mode).
3. **Automated Tests**:
   - `scripts/sync-skills.test.mjs` (runnable via native `node --test ./scripts/sync-skills.test.mjs`) verifying frontmatter extraction, H1 deduplication, install snippet rendering, and related-link resolution.
4. **Build Verification**:
   - Running `npm run build` in `dotcom` must succeed with zero errors and produce `public/skills/index.html` plus `public/skills/<slug>/index.html` for all 7 skills.
