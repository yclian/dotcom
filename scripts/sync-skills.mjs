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
 * Rewrites relative skill links like `(../other-skill/SKILL.md)` to `(/skills/other-skill/)`.
 */
export function normalizeRelativeSkillLinks(markdownBody) {
  return markdownBody.replace(
    /\]\(\.\.?\/([a-z0-9-]+)(?:\/SKILL\.md|\/)?\)/gi,
    "](/skills/$1/)",
  )
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
    body: normalizeRelativeSkillLinks(stripLeadingH1(rawBody)),
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

  console.log(
    `Local skills directory not found at ${configuredDir}. Cloning ${SKILLS_REPO_GIT_URL}...`,
  )
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
export async function syncSkills({ sourceDir, outputDir = OUTPUT_SKILLS_DIR } = {}) {
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
