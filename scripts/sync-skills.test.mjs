import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  parseSkillFile,
  stripLeadingH1,
  normalizeRelativeSkillLinks,
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

  it("normalizes relative skill links in markdown body to /skills/<slug>/", () => {
    const input = `Refer to [sync-antigravity-conversations](../sync-antigravity-conversations/SKILL.md) or [work-signal](./work-signal).`
    assert.equal(
      normalizeRelativeSkillLinks(input),
      "Refer to [sync-antigravity-conversations](/skills/sync-antigravity-conversations/) or [work-signal](/skills/work-signal/).",
    )
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
    assert.match(md, /npx skills add git@github\.com:yclian\/skills\.git --skill alpha-skill/)
    assert.match(md, /### example prompts/)
    assert.match(md, /'Trigger alpha skill'|\"Trigger alpha skill\"/)
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
    assert.match(indexMd, /title: "?skills"?/)
    assert.match(indexMd, /publish: true/)
    assert.match(indexMd, /npx skills add git@github\.com:yclian\/skills\.git/)
    assert.match(indexMd, /\[alpha-skill\]\(\/skills\/alpha-skill\/\)/)
  })
})
