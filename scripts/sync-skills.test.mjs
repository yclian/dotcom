import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  parseSkillFile,
  parseReferenceFile,
  stripLeadingH1,
  normalizeRelativeSkillLinks,
  renderSkillPage,
  renderReferencePage,
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

  it("normalizes relative skill links, reference links, inline reference spans, and script links in markdown body", () => {
    const input = [
      "Refer to [sync-antigravity-conversations](../sync-antigravity-conversations/SKILL.md) or [work-signal](./work-signal).",
      "Load [`references/systems-principles-and-governance.md`](./references/systems-principles-and-governance.md) and [setup](references/setup.md#step-1).",
      "See `references/connector-path.md` for details.",
      "See [`scripts/`](./scripts/) and [`fleet-backup.ps1`](./scripts/fleet-backup.ps1).",
    ].join("\n")

    assert.equal(
      normalizeRelativeSkillLinks(input, "engineering"),
      [
        "Refer to [sync-antigravity-conversations](/skills/sync-antigravity-conversations/) or [work-signal](/skills/work-signal/).",
        "Load [`references/systems-principles-and-governance.md`](/skills/engineering/references/systems-principles-and-governance) and [setup](/skills/engineering/references/setup#step-1).",
        "See [`references/connector-path.md`](/skills/engineering/references/connector-path) for details.",
        "See [`scripts/`](https://github.com/yclian/skills/tree/master/engineering/scripts) and [`fleet-backup.ps1`](https://github.com/yclian/skills/blob/master/engineering/scripts/fleet-backup.ps1).",
      ].join("\n"),
    )
  })

  it("parses and renders a skill reference markdown file with frontmatter and back-link", () => {
    const rawRef = `# Systems Principles & Operational Governance

> **Meta-Principle**: *Principles scale better and last longer than tools.*

## 1. The Eight-Principle Canon
Details here.
`
    const refRecord = parseReferenceFile(
      rawRef,
      "engineering",
      "systems-principles-and-governance",
      { created: "2026-10-18", modified: "2026-11-10" },
    )
    assert.equal(refRecord.skillSlug, "engineering")
    assert.equal(refRecord.slug, "systems-principles-and-governance")
    assert.equal(refRecord.title, "Systems Principles & Operational Governance")
    assert.doesNotMatch(refRecord.body, /^# Systems Principles/)
    assert.match(refRecord.body, /## 1\. The Eight-Principle Canon/)

    const rendered = renderReferencePage(refRecord)
    assert.match(rendered, /publish: true/)
    assert.match(rendered, /title: Systems Principles & Operational Governance/)
    assert.match(rendered, /created: 2026-10-18/)
    assert.match(rendered, /modified: 2026-11-10/)
    assert.match(rendered, /\[engineering\]\(\/skills\/engineering\/\)/)
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
    assert.match(md, /title: "?alpha-skill"?/)
    assert.match(md, /npx skills add https:\/\/github\.com\/yclian\/skills\.git --skill alpha-skill/)
    assert.match(md, /### example prompts/)
    assert.match(md, /'Trigger alpha skill'|\"Trigger alpha skill\"/)
    assert.match(md, /## Usage\n\nRun alpha\./)
    assert.match(md, /\[beta-skill\]\(\/skills\/beta-skill\/\) - Beta helper skill\./)
    assert.match(md, /\[Alpha Spec\]\(https:\/\/example\.com\/alpha\)/)
    assert.doesNotMatch(md, /allowed-tools/)
  })

  it("includes created, modified, and date in frontmatter when provided", () => {
    const skill = {
      slug: "dated-skill",
      name: "dated-skill",
      description: "Dated skill summary.",
      examplePrompts: [],
      related: [],
      references: [],
      created: "2026-09-14",
      modified: "2026-10-17",
      body: "Body.",
    }
    const md = renderSkillPage(skill, new Map([[skill.slug, skill]]))
    assert.match(md, /created: 2026-09-14/)
    assert.match(md, /modified: 2026-10-17/)
    assert.match(md, /date: 2026-10-17/)
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
        created: "2026-09-10",
        modified: "2026-10-17",
        body: "",
      },
    ]
    const indexMd = renderCatalogIndex(skills)
    assert.match(indexMd, /title: "?skills"?/)
    assert.match(indexMd, /publish: true/)
    assert.match(indexMd, /modified: 2026-10-17/)
    assert.match(indexMd, /date: 2026-10-17/)
    assert.match(indexMd, /npx skills add https:\/\/github\.com\/yclian\/skills\.git/)
    assert.match(indexMd, /\[alpha-skill\]\(\/skills\/alpha-skill\/\)/)
  })
})
