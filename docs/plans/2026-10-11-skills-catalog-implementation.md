# Agent Skills Catalog (`yclian.com/skills`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish the `yclian/skills` catalog on `yclian.com/skills/` using a pure JavaScript ESM sync pipeline (`scripts/sync-skills.mjs`), enriched `SKILL.md` frontmatter, and Quartz 5 markdown generation.

**Architecture:** A build-time Node.js ES module (`scripts/sync-skills.mjs`) reads all `<slug>/SKILL.md` files from `../skills` (or shallow-clones `https://github.com/yclian/skills.git` as a fallback), extracts structured YAML frontmatter (`name`, `description`, `example-prompts`, `related`, `references`), strips duplicate leading H1 titles, normalizes links, and writes Quartz-ready markdown pages into `content/skills/`. Generated pages are tracked in git and linked from the homepage navigation.

**Tech Stack:** Node.js 22+ (native ES Modules, `node:test`, `node:assert/strict`, `node:fs/promises`), `yaml` (v2.8.2), Quartz v5, Cloudflare Pages.

**Spec:** [`docs/specs/2026-10-11-skills-catalog-design.md`](file:///c:/Users/yclian/Development/github.com/yclian/dotcom/docs/specs/2026-10-11-skills-catalog-design.md)

## Global Constraints

- **Pure JavaScript Only**: Use `.mjs` (ES Modules) for scripts and tests. Do not write TypeScript (`.ts`) for the sync pipeline.
- **Editorial Style**:
  - Structural headings, navigation links, and table headers must be strictly lowercase.
  - Use space-enclosed hyphens (` - `) instead of em dashes in generated catalog prose.
  - Straight quotation marks (`'` and `"`) only.
- **Explicit Publish**: Every generated markdown file in `content/skills/` must include `publish: true` in its frontmatter so `@quartz-community/explicit-publish` includes it in the build.

---

### Task 1: Enrich Upstream `SKILL.md` Frontmatter (`yclian/skills`)

**Files:**
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\antigravity-extras\SKILL.md`
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\sync-antigravity-conversations\SKILL.md`
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\gmail-filter-manager\SKILL.md`
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\work-signal\SKILL.md`
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\calendar-tbd-recommender\SKILL.md`
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\laya-system-one\SKILL.md`
- Modify: `c:\Users\yclian\Development\github.com\yclian\skills\todo-in-obsidian\SKILL.md`

- [ ] **Step 1: Enrich `antigravity-extras/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\antigravity-extras\SKILL.md`:

```yaml
---
name: antigravity-extras
description: Operational tribal knowledge, hidden internals, quirks, and runbooks for Google Antigravity / Antigravity 2.0 that the assistant does not natively know about itself. Covers persistent scheduled tasks (sidecars), browser automation (/browser) CDP boot-up and security quirks, application runtime lifecycle, profile architectures, and process quirks.
allowed-tools:
  - run_command
  - view_file
  - write_to_file
  - replace_file_content
example-prompts:
  - "Schedule a persistent sidecar task that runs every weekday at 9am."
  - "Why did my /schedule background timer disappear after restarting Antigravity?"
  - "Connect to the Antigravity browser via CDP and inspect open tabs."
related:
  - sync-antigravity-conversations
references:
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
  - title: "Chrome DevTools Protocol Documentation"
    url: "https://chromedevtools.github.io/devtools-protocol/"
---
```

- [ ] **Step 2: Normalize `name` and enrich `sync-antigravity-conversations/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\sync-antigravity-conversations\SKILL.md`:

```yaml
---
name: sync-antigravity-conversations
description: Synchronize and merge Antigravity conversations, transcripts, brain artifacts, project configurations, and summary databases from a source profile or backup archive into a target profile directory.
allowed-tools:
  - run_command
  - read_file
  - write_file
example-prompts:
  - "Sync my Antigravity conversations from my laptop backup zip into my local profile."
  - "Merge conversation transcripts and summary databases from a secondary profile directory."
related:
  - antigravity-extras
references:
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
  - title: "SQLite Write-Ahead Logging (WAL)"
    url: "https://www.sqlite.org/wal.html"
---
```

- [ ] **Step 3: Enrich `gmail-filter-manager/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\gmail-filter-manager\SKILL.md`:

```yaml
---
name: gmail-filter-manager
description: Compose, validate, and safely deploy Gmail gateway routing filters (Terraform) without hitting silent delivery-time failures. Enforces flat boolean clauses, partition symmetry, and pre-apply canary checks.
allowed-tools:
  - run_command
  - view_file
  - replace_file_content
example-prompts:
  - "Add a new vendor domain to the automated archive routing filter and validate partition symmetry."
  - "Audit our Gmail Terraform filter rules for nested boolean clauses that could silently fail at SMTP delivery."
related:
  - work-signal
  - laya-system-one
references:
  - title: "Gmail Search Operators Reference"
    url: "https://support.google.com/mail/answer/7190"
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
---
```

- [ ] **Step 4: Enrich `work-signal/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\work-signal\SKILL.md`:

```yaml
---
name: work-signal
description: >-
  Morning triage of a work Gmail inbox: surface what actually needs the user
  (leadership threads, security/compliance/infrastructure, approvals, colleague
  asks, executive digests), suppress CI pipeline and vendor noise, and render a
  markdown brief in chat. Triggers include "/work-signal", "what needs my
  attention in work email", "triage my inbox", "anything from leadership",
  "inbox brief", "check unread work email", and the scheduled weekday morning
  run. Does NOT read one specific email, search mail by topic, compose, reply,
  or send - and does NOT write the weekly executive summary, which is
  work-week-recap.
example-prompts:
  - "/work-signal"
  - "What needs my attention in work email this morning?"
  - "Triage my unread work inbox and surface any leadership or approval threads."
related:
  - gmail-filter-manager
  - todo-in-obsidian
  - laya-system-one
references:
  - title: "Gmail API Reference"
    url: "https://developers.google.com/gmail/api"
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
---
```

- [ ] **Step 5: Enrich `calendar-tbd-recommender/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\calendar-tbd-recommender\SKILL.md`:

```yaml
---
name: calendar-tbd-recommender
description: Audits Google Calendar for events marked with placeholder locations (TBD, TBC, ???, or blank), dynamically detects travel and flight context, and recommends personalized dining, cocktail, or coffee venues from a curated taste graph.
allowed-tools:
  - run_command
  - view_file
  - write_to_file
  - replace_file_content
example-prompts:
  - "Scan my next two weeks of calendar events for TBD locations and suggest venues."
  - "Find a coffee or cocktail spot for Friday's TBC meeting based on my current travel city."
related:
  - todo-in-obsidian
  - work-signal
references:
  - title: "Google Calendar API Reference"
    url: "https://developers.google.com/calendar/api"
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
---
```

- [ ] **Step 6: Enrich `laya-system-one/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\laya-system-one\SKILL.md`:

```yaml
---
name: laya-system-one
license: MIT
description: >
  Build high-speed, zero-token software with Laya: a local non-autoregressive
  "System 1" decision engine powered by ModernBERT-large (395M). Delivers typed
  judgments (Choice, Noul, Score) in ~35ms on standard CPU ($0.00 token cost).
  Use when designing or writing code for fast semantic routing, bulk event/email
  filtering, data classification pipelines, error triage, or when replacing an
  expensive LLM prompt-and-parse step with a local machine-native decision head.
example-prompts:
  - "Set up the Laya daemon and configure the MCP gateway for fast local classification."
  - "Replace this LLM email triage prompt with a zero-token Laya Choice judgment."
  - "Score incoming alerts on a 1-3 urgency ladder using Laya's local HTTP endpoint."
related:
  - work-signal
  - gmail-filter-manager
references:
  - title: "ModernBERT (Answer.AI / Hugging Face)"
    url: "https://huggingface.co/answerdotai/ModernBERT-large"
  - title: "Model Context Protocol (MCP)"
    url: "https://modelcontextprotocol.io/"
---
```

- [ ] **Step 7: Enrich `todo-in-obsidian/SKILL.md` frontmatter**

Update the YAML frontmatter in `c:\Users\yclian\Development\github.com\yclian\skills\todo-in-obsidian\SKILL.md`:

```yaml
---
name: todo-in-obsidian
description: Review, triage, and carry forward TODOs across weekly journal notes in Obsidian. Runs a full backlog review with disposition codes (DAL, DSE, KIV, NIN...), effort estimates, delegability calls, and carry-forward into the new week's note.
metadata:
  version: 2.2.0
example-prompts:
  - "What's still open from last week's journal? Help me triage and roll over my TODOs."
  - "Close out last week's Obsidian note and plan this week's backlog."
related:
  - work-signal
  - calendar-tbd-recommender
references:
  - title: "Obsidian Tasks Plugin Documentation"
    url: "https://publish.obsidian.md/tasks/"
  - title: "yclian/skills Repository"
    url: "https://github.com/yclian/skills"
---
```

- [ ] **Step 8: Commit changes in `yclian/skills`**

Run in `c:\Users\yclian\Development\github.com\yclian\skills`:
```powershell
git add */SKILL.md
git commit -m "docs(skills): enrich frontmatter with example-prompts, related skills, and references"
```

---

### Task 2: Pure JavaScript Sync Pipeline & Unit Tests (`dotcom/scripts/sync-skills.mjs`)

**Files:**
- Create: `c:\Users\yclian\Development\github.com\yclian\dotcom\scripts\sync-skills.test.mjs`
- Create: `c:\Users\yclian\Development\github.com\yclian\dotcom\scripts\sync-skills.mjs`
- Modify: `c:\Users\yclian\Development\github.com\yclian\dotcom\package.json`

- [ ] **Step 1: Write the failing unit tests in `scripts/sync-skills.test.mjs`**

Create `c:\Users\yclian\Development\github.com\yclian\dotcom\scripts\sync-skills.test.mjs`:

```javascript
import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  parseSkillFile,
  stripLeadingH1,
  renderSkillPage,
  renderCatalogIndex,
} from "./sync-skills.mjs"

describe("sync-skills pipeline", () => {
  it("parses frontmatter and body from SKILL.md", () => {
    const raw = `---
name: test-skill
description: A fast test skill for unit verification.
allowed-tools:
  - run_command
example-prompts:
  - "Run the test skill now."
related:
  - other-skill
references:
  - title: "Example Docs"
    url: "https://example.com/docs"
---

# Test Skill Heading

Body paragraph here.
`
    const parsed = parseSkillFile(raw, "test-skill")
    assert.equal(parsed.slug, "test-skill")
    assert.equal(parsed.name, "test-skill")
    assert.equal(parsed.description, "A fast test skill for unit verification.")
    assert.deepEqual(parsed.examplePrompts, ["Run the test skill now."])
    assert.deepEqual(parsed.related, ["other-skill"])
    assert.deepEqual(parsed.references, [{ title: "Example Docs", url: "https://example.com/docs" }])
    assert.equal(parsed.body, "Body paragraph here.")
  })

  it("strips leading H1 from markdown body without removing H2 headings", () => {
    const input = `\n# Main Title\n\nIntro text.\n\n## Section 1\nDetails.`
    assert.equal(stripLeadingH1(input), "Intro text.\n\n## Section 1\nDetails.")
  })

  it("renders individual skill page with install block, prompts, and resolved related links", () => {
    const skill = {
      slug: "alpha-skill",
      name: "alpha-skill",
      description: "Alpha skill summary.",
      examplePrompts: ["Trigger alpha skill"],
      related: ["beta-skill"],
      references: [{ title: "Alpha Spec", url: "https://example.com/alpha" }],
      body: "## Usage\n\nRun alpha.",
    }
    const allSkillsMap = new Map([
      ["alpha-skill", skill],
      [
        "beta-skill",
        {
          slug: "beta-skill",
          name: "beta-skill",
          description: "Beta helper skill.",
          examplePrompts: [],
          related: [],
          references: [],
          body: "",
        },
      ],
    ])

    const md = renderSkillPage(skill, allSkillsMap)
    assert.match(md, /publish: true/)
    assert.match(md, /title: "alpha-skill"/)
    assert.match(md, /npx skills add git@github\.com:yclian\/skills\.git --skill alpha-skill/)
    assert.match(md, /### example prompts/)
    assert.match(md, /"Trigger alpha skill"/)
    assert.match(md, /## Usage\n\nRun alpha\./)
    assert.match(md, /\[beta-skill\]\(\/skills\/beta-skill\/\) - Beta helper skill\./)
    assert.match(md, /\[Alpha Spec\]\(https:\/\/example\.com\/alpha\)/)
    assert.doesNotMatch(md, /allowed-tools/)
  })

  it("renders catalog index page with global install and skills table", () => {
    const skills = [
      {
        slug: "alpha-skill",
        name: "alpha-skill",
        description: "Alpha skill summary.",
        examplePrompts: [],
        related: [],
        references: [],
        body: "",
      },
    ]
    const indexMd = renderCatalogIndex(skills)
    assert.match(indexMd, /title: "skills"/)
    assert.match(indexMd, /publish: true/)
    assert.match(indexMd, /npx skills add git@github\.com:yclian\/skills\.git/)
    assert.match(indexMd, /\[alpha-skill\]\(\/skills\/alpha-skill\/\)/)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run in `c:\Users\yclian\Development\github.com\yclian\dotcom`:
```powershell
node --test ./scripts/sync-skills.test.mjs
```
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `./sync-skills.mjs`.

- [ ] **Step 3: Implement `scripts/sync-skills.mjs` in pure JavaScript**

Create `c:\Users\yclian\Development\github.com\yclian\dotcom\scripts\sync-skills.mjs`:

```javascript
import fs from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import YAML from "yaml"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, "..")
const DEFAULT_LOCAL_SKILLS_DIR = path.resolve(REPO_ROOT, "..", "skills")
const CACHE_SKILLS_DIR = path.resolve(REPO_ROOT, ".quartz-cache", "skills-source")
const OUTPUT_SKILLS_DIR = path.resolve(REPO_ROOT, "content", "skills")
const SKILLS_REPO_GIT_URL = "https://github.com/yclian/skills.git"
const SKILLS_REPO_SSH_URI = "git@github.com:yclian/skills.git"

/**
 * Strips the leading `# Title` heading from a markdown body so Quartz's
 * `@quartz-community/article-title` component does not render duplicate titles.
 */
export function stripLeadingH1(markdownBody) {
  const trimmed = markdownBody.trimStart()
  const lines = trimmed.split(/\r?\n/)
  if (lines.length > 0 && /^#\s+/.test(lines[0])) {
    return lines.slice(1).join("\n").trim()
  }
  return trimmed.trim()
}

/**
 * Sanitizes prose strings to adhere to yclian.com editorial rules (no em dashes).
 */
export function sanitizeEditorialText(text) {
  if (!text) return ""
  return String(text)
    .replace(/\s*—\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Parses a raw `SKILL.md` file into a normalized skill record.
 */
export function parseSkillFile(rawContent, folderSlug, filePath = folderSlug) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) {
    throw new Error(`Missing YAML frontmatter in ${filePath}`)
  }

  const frontmatter = YAML.parse(match[1]) || {}
  const rawBody = match[2] || ""

  const name = frontmatter.name ? String(frontmatter.name).trim() : folderSlug
  const description = sanitizeEditorialText(frontmatter.description)

  if (!description) {
    throw new Error(`Missing required 'description' in frontmatter of ${filePath}`)
  }

  const examplePrompts = Array.isArray(frontmatter["example-prompts"])
    ? frontmatter["example-prompts"].map((p) => String(p).trim()).filter(Boolean)
    : []

  const related = Array.isArray(frontmatter.related)
    ? frontmatter.related.map((r) => String(r).trim()).filter(Boolean)
    : []

  const references = Array.isArray(frontmatter.references)
    ? frontmatter.references
        .filter((ref) => ref && ref.title && ref.url)
        .map((ref) => ({
          title: sanitizeEditorialText(ref.title),
          url: String(ref.url).trim(),
        }))
    : []

  return {
    slug: folderSlug,
    name,
    description,
    examplePrompts,
    related,
    references,
    body: stripLeadingH1(rawBody),
  }
}

/**
 * Renders the Quartz markdown content for an individual skill page (`content/skills/<slug>.md`).
 */
export function renderSkillPage(skill, allSkillsMap) {
  const frontmatterYaml = YAML.stringify({
    title: skill.slug,
    description: skill.description,
    publish: true,
    enableToc: true,
    tags: ["skills"],
  }).trim()

  const sections = [
    `---\n${frontmatterYaml}\n---`,
    `${skill.description}`,
    `### install\n\n\`\`\`bash\nnpx skills add ${SKILLS_REPO_SSH_URI} --skill ${skill.slug}\n\`\`\``,
  ]

  if (skill.examplePrompts.length > 0) {
    const promptLines = skill.examplePrompts.map((p) => `- *"${p.replace(/"/g, "'")}"*`).join("\n")
    sections.push(`### example prompts\n\n${promptLines}`)
  }

  sections.push(`---\n\n${skill.body}`)

  const relatedItems = []
  for (const relSlug of skill.related) {
    const target = allSkillsMap.get(relSlug)
    if (target) {
      relatedItems.push(`- [${target.slug}](/skills/${target.slug}/) - ${target.description}`)
    }
  }

  const referenceItems = [
    ...skill.references.map((ref) => `- [${ref.title}](${ref.url})`),
    `- [all skills in yclian/skills](/skills/)`,
    `- [explore community skills via npx skills (vercel-labs/agent-skills)](https://github.com/vercel-labs/agent-skills)`,
  ]

  const footerParts = [`---\n\n### related skills & references`]
  if (relatedItems.length > 0) {
    footerParts.push(`**in this collection**\n\n${relatedItems.join("\n")}`)
  }
  footerParts.push(`**external references & similar skills**\n\n${referenceItems.join("\n")}`)

  sections.push(footerParts.join("\n\n"))

  return sections.join("\n\n") + "\n"
}

/**
 * Renders the Quartz markdown content for the main catalog index (`content/skills/index.md`).
 */
export function renderCatalogIndex(skills) {
  const sorted = [...skills].sort((a, b) => a.slug.localeCompare(b.slug))

  const frontmatterYaml = YAML.stringify({
    title: "skills",
    description: "Reusable AI agent skills, operational runbooks, and local decision engines.",
    publish: true,
    enableToc: false,
  }).trim()

  const tableRows = sorted
    .map(
      (s) =>
        `| [${s.slug}](/skills/${s.slug}/) | ${s.description} | \`npx skills add ${SKILLS_REPO_SSH_URI} --skill ${s.slug}\` |`,
    )
    .join("\n")

  return `---
${frontmatterYaml}
---

A collection of reusable AI agent skills, operational runbooks, and local decision engines built for daily engineering, inbox triage, and personal workflow automation.

### installation

Install the full collection or pick an individual skill using the [\`skills\` CLI](https://github.com/vercel-labs/agent-skills):

\`\`\`bash
# install all skills from this repository
npx skills add ${SKILLS_REPO_SSH_URI}

# or install a specific skill
npx skills add ${SKILLS_REPO_SSH_URI} --skill <skill-name>
\`\`\`

---

### catalog

| skill | summary | quick install |
| :--- | :--- | :--- |
${tableRows}

---

### ecosystem & source

- **Source repository**: [github.com/yclian/skills](https://github.com/yclian/skills)
- **Discover more skills**: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
`
}

/**
 * Resolves the source directory containing `<slug>/SKILL.md` directories.
 */
export async function resolveSkillsSourceDir() {
  const configuredDir = process.env.SKILLS_DIR
    ? path.resolve(process.env.SKILLS_DIR)
    : DEFAULT_LOCAL_SKILLS_DIR

  if (existsSync(configuredDir)) {
    return configuredDir
  }

  console.log(`Local skills directory not found at ${configuredDir}. Cloning ${SKILLS_REPO_GIT_URL}...`)
  await fs.rm(CACHE_SKILLS_DIR, { recursive: true, force: true })
  await fs.mkdir(path.dirname(CACHE_SKILLS_DIR), { recursive: true })
  execFileSync("git", ["clone", "--depth", "1", SKILLS_REPO_GIT_URL, CACHE_SKILLS_DIR], {
    stdio: "inherit",
  })
  return CACHE_SKILLS_DIR
}

/**
 * Main execution entry point: reads all skills and generates `content/skills/*.md`.
 */
export async function syncSkills({
  sourceDir,
  outputDir = OUTPUT_SKILLS_DIR,
} = {}) {
  const resolvedSource = sourceDir || (await resolveSkillsSourceDir())
  const entries = await fs.readdir(resolvedSource, { withFileTypes: true })

  const skillsMap = new Map()

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue
    const skillMdPath = path.join(resolvedSource, entry.name, "SKILL.md")
    if (!existsSync(skillMdPath)) continue

    const raw = await fs.readFile(skillMdPath, "utf8")
    const skill = parseSkillFile(raw, entry.name, skillMdPath)
    skillsMap.set(skill.slug, skill)
  }

  if (skillsMap.size === 0) {
    throw new Error(`No SKILL.md files found in ${resolvedSource}`)
  }

  await fs.mkdir(outputDir, { recursive: true })

  const allSkills = Array.from(skillsMap.values())
  const indexContent = renderCatalogIndex(allSkills)
  await fs.writeFile(path.join(outputDir, "index.md"), indexContent, "utf8")

  for (const skill of allSkills) {
    const pageContent = renderSkillPage(skill, skillsMap)
    await fs.writeFile(path.join(outputDir, `${skill.slug}.md`), pageContent, "utf8")
  }

  console.log(`Synced ${allSkills.length} skills into ${outputDir}`)
  return allSkills
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  syncSkills().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
```

- [ ] **Step 4: Run the unit tests to verify they pass**

Run in `c:\Users\yclian\Development\github.com\yclian\dotcom`:
```powershell
node --test ./scripts/sync-skills.test.mjs
```
Expected: PASS (4 passing tests).

- [ ] **Step 5: Wire `sync-skills` into `package.json`**

Modify `c:\Users\yclian\Development\github.com\yclian\dotcom\package.json` scripts section:
```json
    "sync-skills": "node ./scripts/sync-skills.mjs",
    "install-plugins": "npx tsx ./quartz/plugins/loader/install-plugins.ts",
    "prebuild": "npm run install-plugins && npm run sync-skills",
```

- [ ] **Step 6: Commit Task 2**

Run in `c:\Users\yclian\Development\github.com\yclian\dotcom`:
```powershell
git add scripts/sync-skills.mjs scripts/sync-skills.test.mjs package.json
git commit -m "feat(skills): add pure JS skills sync script and unit tests"
```

---

### Task 3: Generate Skills Catalog Pages, Update Homepage Nav & Verify Quartz Build

**Files:**
- Create: `c:\Users\yclian\Development\github.com\yclian\dotcom\content\skills\index.md` (via `npm run sync-skills`)
- Create: `c:\Users\yclian\Development\github.com\yclian\dotcom\content\skills\*.md` (via `npm run sync-skills`)
- Modify: `c:\Users\yclian\Development\github.com\yclian\dotcom\content\index.md`

- [ ] **Step 1: Run `npm run sync-skills` to generate `content/skills/` pages**

Run in `c:\Users\yclian\Development\github.com\yclian\dotcom`:
```powershell
npm run sync-skills
```
Expected: `Synced 7 skills into ...\content\skills`

- [ ] **Step 2: Add `/skills/` link to homepage navigation (`content/index.md`)**

Modify `c:\Users\yclian\Development\github.com\yclian\dotcom\content\index.md` lines 17-22:
```html
    <div class="nav-dropdown">
      <button class="nav-trigger" type="button" aria-haspopup="true">archives <span class="nav-caret">▾</span></button>
      <div class="nav-menu">
        <a href="/skills/">skills</a>
        <a href="/wine/wine-legionnaires/">wine legionnaires</a>
      </div>
    </div>
```

- [ ] **Step 3: Run full Quartz build and verify emitted HTML files**

Run in `c:\Users\yclian\Development\github.com\yclian\dotcom`:
```powershell
npm run build
```
Verify that `public/skills/index.html` and `public/skills/<slug>/index.html` (or `public/skills/<slug>.html`) exist for all 7 skills.

- [ ] **Step 4: Commit generated content and homepage navigation**

Run in `c:\Users\yclian\Development\github.com\yclian\dotcom`:
```powershell
git add content/index.md content/skills/
git commit -m "feat(content): publish agent skills catalog and link in homepage navigation"
```
