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
const SKILLS_REPO_SSH_URI = "https://github.com/yclian/skills.git"
const SKILLS_REPO_WEB_URL = "https://github.com/yclian/skills"

/**
 * Extracts the leading `# Title` heading text from a markdown body, if present.
 */
export function extractLeadingH1(markdownBody) {
  const trimmed = markdownBody.trimStart()
  const lines = trimmed.split(/\r?\n/)
  if (lines.length > 0) {
    const match = lines[0].match(/^#\s+(.+)$/)
    if (match) {
      return sanitizeEditorialText(match[1])
    }
  }
  return null
}

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
 * Rewrites relative links inside skill markdown bodies:
 * - Cross-skill links like `(../other-skill/SKILL.md)` or `(./other-skill)` -> `(/skills/other-skill/)`
 * - Reference subpage links like `(./references/foo.md)`, `(references/foo.md#sec)`, or inline `` `references/foo.md` `` -> `(/skills/<slug>/references/foo#sec)`
 * - Script/asset links like `(./scripts/foo.py)` or `(./scripts/)` -> GitHub `blob/master` or `tree/master` URLs
 */
export function normalizeRelativeSkillLinks(markdownBody, skillSlug = "") {
  let result = markdownBody

  if (skillSlug) {
    // 1. Rewrite `./references/<name>.md` or `references/<name>.md` markdown links (with optional #anchor)
    result = result.replace(
      /\]\((?:\.\/)?references\/([a-z0-9-_]+)(?:\.md)?(#[^)]+)?\)/gi,
      (_, refSlug, hash = "") => `](/skills/${skillSlug}/references/${refSlug}${hash})`,
    )

    // 2. Rewrite standalone inline code spans `` `references/<name>.md` `` (not already inside `[...]`) into clickable links
    result = result.replace(
      /(?<!\[)`(?:\.\/)?references\/([a-z0-9-_]+)\.md`(?!\])/gi,
      (_, refSlug) => `[\`references/${refSlug}.md\`](/skills/${skillSlug}/references/${refSlug})`,
    )

    // 3. Rewrite `./scripts/` directory link to GitHub tree URL
    result = result.replace(
      /\]\((?:\.\/)?scripts\/\)/gi,
      `](${SKILLS_REPO_WEB_URL}/tree/master/${skillSlug}/scripts)`,
    )

    // 4. Rewrite `./scripts/<file>` to GitHub blob URL
    result = result.replace(
      /\]\((?:\.\/)?scripts\/([^)]+)\)/gi,
      (_, scriptPath) => `](${SKILLS_REPO_WEB_URL}/blob/master/${skillSlug}/scripts/${scriptPath})`,
    )
  }

  // 5. Rewrite sibling skill links `(../other-skill/SKILL.md)` or `(./other-skill)`
  result = result.replace(
    /\]\(\.\.?\/([a-z0-9-]+)(?:\/SKILL\.md|\/)?\)/gi,
    "](/skills/$1/)",
  )

  return result
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
 * Resolves git created and modified dates for a specific path from the source repository.
 */
export function getFolderGitDates(sourceDir, targetPath) {
  try {
    const modified = execFileSync(
      "git",
      ["-C", sourceDir, "log", "-1", "--format=%cs", "--", targetPath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim()
    const created = execFileSync(
      "git",
      ["-C", sourceDir, "log", "--diff-filter=A", "--format=%cs", "-1", "--", targetPath],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim()
    return {
      modified: modified || null,
      created: created || modified || null,
    }
  } catch {
    return { modified: null, created: null }
  }
}

/**
 * Parses a raw `SKILL.md` file into a normalized skill record.
 */
export function parseSkillFile(rawContent, folderSlug, filePath = folderSlug, dates = {}) {
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

  const created = frontmatter.created || frontmatter.date || dates.created || null
  const modified = frontmatter.modified || dates.modified || created || null

  return {
    slug: folderSlug,
    name,
    description,
    examplePrompts,
    related,
    references,
    created,
    modified,
    body: normalizeRelativeSkillLinks(stripLeadingH1(rawBody), folderSlug),
  }
}

/**
 * Parses a raw `<skill>/references/<ref>.md` file into a normalized reference record.
 */
export function parseReferenceFile(rawContent, skillSlug, refSlug, dates = {}) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const frontmatter = match ? YAML.parse(match[1]) || {} : {}
  const rawBody = match ? match[2] || "" : rawContent

  const extractedTitle = extractLeadingH1(rawBody)
  const title = frontmatter.title
    ? sanitizeEditorialText(frontmatter.title)
    : extractedTitle || refSlug

  const description = frontmatter.description
    ? sanitizeEditorialText(frontmatter.description)
    : `Reference documentation for the ${skillSlug} skill: ${title}.`

  const created = frontmatter.created || frontmatter.date || dates.created || null
  const modified = frontmatter.modified || dates.modified || created || null

  return {
    skillSlug,
    slug: refSlug,
    title,
    description,
    created,
    modified,
    body: normalizeRelativeSkillLinks(stripLeadingH1(rawBody), skillSlug),
  }
}

/**
 * Renders the Quartz markdown content for an individual skill page (`content/skills/<slug>.md`).
 */
export function renderSkillPage(skill, allSkillsMap) {
  const frontmatterObj = {
    title: skill.slug,
    description: skill.description,
    publish: true,
    enableToc: true,
    tags: ["skills"],
  }

  if (skill.created) {
    frontmatterObj.created = skill.created
  }
  if (skill.modified) {
    frontmatterObj.modified = skill.modified
    frontmatterObj.date = skill.modified
  }

  const frontmatterYaml = YAML.stringify(frontmatterObj).trim()

  const sections = [
    `---\n${frontmatterYaml}\n---`,
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
 * Renders the Quartz markdown content for a skill reference subpage (`content/skills/<slug>/references/<ref>.md`).
 */
export function renderReferencePage(refRecord) {
  const frontmatterObj = {
    title: refRecord.title,
    description: refRecord.description,
    publish: true,
    enableToc: true,
    tags: ["skills"],
  }

  if (refRecord.created) {
    frontmatterObj.created = refRecord.created
  }
  if (refRecord.modified) {
    frontmatterObj.modified = refRecord.modified
    frontmatterObj.date = refRecord.modified
  }

  const frontmatterYaml = YAML.stringify(frontmatterObj).trim()

  const sections = [
    `---\n${frontmatterYaml}\n---`,
    `> Part of the **[${refRecord.skillSlug}](/skills/${refRecord.skillSlug}/)** skill.`,
    refRecord.body,
    `---\n\n- Back to [${refRecord.skillSlug}](/skills/${refRecord.skillSlug}/)\n- [All skills in yclian/skills](/skills/)`,
  ]

  return sections.join("\n\n") + "\n"
}

/**
 * Renders the Quartz markdown content for the main catalog index (`content/skills/index.md`).
 */
export function renderCatalogIndex(skills) {
  const sorted = [...skills].sort((a, b) => a.slug.localeCompare(b.slug))

  const frontmatterObj = {
    title: "skills",
    description: "Reusable AI agent skills, operational runbooks, and local decision engines.",
    publish: true,
    enableToc: false,
  }

  const latestModified = skills
    .map((s) => s.modified)
    .filter(Boolean)
    .sort()
    .pop()

  if (latestModified) {
    frontmatterObj.modified = latestModified
    frontmatterObj.date = latestModified
  }

  const frontmatterYaml = YAML.stringify(frontmatterObj).trim()

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

  console.log(
    `Local skills directory not found at ${configuredDir}. Cloning ${SKILLS_REPO_GIT_URL}...`,
  )
  await fs.rm(CACHE_SKILLS_DIR, { recursive: true, force: true })
  await fs.mkdir(path.dirname(CACHE_SKILLS_DIR), { recursive: true })
  execFileSync("git", ["clone", SKILLS_REPO_GIT_URL, CACHE_SKILLS_DIR], {
    stdio: "inherit",
  })
  return CACHE_SKILLS_DIR
}

/**
 * Main execution entry point: reads all skills and generates `content/skills/<slug>/index.md`
 * (or `content/skills/<slug>.md` when a skill has no subpages) plus `content/skills/<slug>/references/*.md`.
 */
export async function syncSkills({ sourceDir, outputDir = OUTPUT_SKILLS_DIR } = {}) {
  const resolvedSource = sourceDir || (await resolveSkillsSourceDir())
  const entries = await fs.readdir(resolvedSource, { withFileTypes: true })

  const skillsMap = new Map()
  const referencePages = []
  const skillsWithReferences = new Set()

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue
    const skillSlug = entry.name
    const skillMdPath = path.join(resolvedSource, skillSlug, "SKILL.md")
    if (!existsSync(skillMdPath)) continue

    const raw = await fs.readFile(skillMdPath, "utf8")
    const dates = getFolderGitDates(resolvedSource, skillSlug)
    const skill = parseSkillFile(raw, skillSlug, skillMdPath, dates)
    skillsMap.set(skill.slug, skill)

    const refsDir = path.join(resolvedSource, skillSlug, "references")
    if (existsSync(refsDir)) {
      const refEntries = await fs.readdir(refsDir, { withFileTypes: true })
      for (const refEntry of refEntries) {
        if (!refEntry.isFile() || !refEntry.name.endsWith(".md")) continue
        const refSlug = refEntry.name.replace(/\.md$/i, "")
        const refFilePath = path.join(refsDir, refEntry.name)
        const refRaw = await fs.readFile(refFilePath, "utf8")
        const refRelativeGitPath = path.posix.join(skillSlug, "references", refEntry.name)
        const refDates = getFolderGitDates(resolvedSource, refRelativeGitPath)
        const refRecord = parseReferenceFile(refRaw, skillSlug, refSlug, {
          created: refDates.created || dates.created,
          modified: refDates.modified || dates.modified,
        })
        referencePages.push(refRecord)
        skillsWithReferences.add(skillSlug)
      }
    }
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
    const flatPath = path.join(outputDir, `${skill.slug}.md`)
    const folderIndexPath = path.join(outputDir, skill.slug, "index.md")

    if (skillsWithReferences.has(skill.slug)) {
      await fs.rm(flatPath, { force: true })
      await fs.mkdir(path.join(outputDir, skill.slug), { recursive: true })
      await fs.writeFile(folderIndexPath, pageContent, "utf8")
    } else {
      await fs.rm(folderIndexPath, { force: true })
      await fs.writeFile(flatPath, pageContent, "utf8")
    }
  }

  for (const refRecord of referencePages) {
    const refOutDir = path.join(outputDir, refRecord.skillSlug, "references")
    await fs.mkdir(refOutDir, { recursive: true })
    const refContent = renderReferencePage(refRecord)
    await fs.writeFile(path.join(refOutDir, `${refRecord.slug}.md`), refContent, "utf8")
  }

  console.log(
    `Synced ${allSkills.length} skills and ${referencePages.length} reference pages into ${outputDir}`,
  )
  return allSkills
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  syncSkills().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
