---
title: skills
description: Reusable AI agent skills, operational runbooks, and local decision engines.
publish: true
enableToc: false
---

A collection of reusable AI agent skills, operational runbooks, and local decision engines built for daily engineering, inbox triage, and personal workflow automation.

### installation

Install the full collection or pick an individual skill using the [`skills` CLI](https://github.com/vercel-labs/agent-skills):

```bash
# install all skills from this repository
npx skills add https://github.com/yclian/skills.git

# or install a specific skill
npx skills add https://github.com/yclian/skills.git --skill <skill-name>
```

---

### catalog

| skill | summary | quick install |
| :--- | :--- | :--- |
| [antigravity-extras](/skills/antigravity-extras/) | Operational tribal knowledge, hidden internals, quirks, and runbooks for Google Antigravity / Antigravity 2.0 that the assistant does not natively know about itself. Covers persistent scheduled tasks (sidecars), browser automation (/browser) CDP boot-up and security quirks, application runtime lifecycle, profile architectures, and process quirks. | `npx skills add https://github.com/yclian/skills.git --skill antigravity-extras` |
| [calendar-tbd-recommender](/skills/calendar-tbd-recommender/) | Automatically scans Google Calendar for upcoming events with placeholder locations (TBD, TBC, ???, or blank), analyzes meeting format and travel context (flights/transits), matches against a curated taste graph of venues, and generates contextual recommendations. Can patch confirmed venues directly back to the calendar. | `npx skills add https://github.com/yclian/skills.git --skill calendar-tbd-recommender` |
| [gmail-filter-manager](/skills/gmail-filter-manager/) | Compose, validate, and safely deploy Gmail gateway routing filters (Terraform) without hitting silent delivery-time failures. Enforces flat boolean clauses, partition symmetry, and pre-apply canary checks. | `npx skills add https://github.com/yclian/skills.git --skill gmail-filter-manager` |
| [laya-system-one](/skills/laya-system-one/) | Build high-speed, zero-token software with Laya: a local non-autoregressive "System 1" decision engine powered by ModernBERT-large (395M). Delivers typed judgments (Choice, Noul, Score) in ~35ms on standard CPU ($0.00 token cost). Use when designing or writing code for fast semantic routing, bulk event/email filtering, data classification pipelines, error triage, or when replacing an expensive LLM prompt-and-parse step with a local machine-native decision head. | `npx skills add https://github.com/yclian/skills.git --skill laya-system-one` |
| [sync-antigravity-conversations](/skills/sync-antigravity-conversations/) | Synchronize and merge Antigravity conversations, transcripts, brain artifacts, project configurations, and summary databases from a source profile or backup archive into a target profile directory. | `npx skills add https://github.com/yclian/skills.git --skill sync-antigravity-conversations` |
| [todo-in-obsidian](/skills/todo-in-obsidian/) | Review, triage, and carry forward TODOs across weekly journal notes in Obsidian. It runs a full backlog review with disposition codes (DAL, DSE, KIV, NIN...), effort estimates, delegability calls, and carry-forward into the new week's note. Use whenever the user wants to review weekly entries, do a backlog or TODO review, close out last week, carry over todos, triage open items, revive deferred (DLT) items, or plan the coming week from their journal. Trigger even on casual phrasing like "what's still open from last week", "clean up my todos", or "help me plan this week". Always requires access to the weekly journal folder - ask for it first. | `npx skills add https://github.com/yclian/skills.git --skill todo-in-obsidian` |
| [work-signal](/skills/work-signal/) | Morning triage of a work Gmail inbox: surface what actually needs the user (leadership threads, security/compliance/infrastructure, approvals, colleague asks, executive digests), suppress CI pipeline and vendor noise, and render a markdown brief in chat. Triggers include "/work-signal", "what needs my attention in work email", "triage my inbox", "anything from leadership", "inbox brief", "check unread work email", and the scheduled weekday morning run. Does NOT read one specific email, search mail by topic, compose, reply, or send - and does NOT write the weekly executive summary, which is work-week-recap. | `npx skills add https://github.com/yclian/skills.git --skill work-signal` |

---

### ecosystem & source

- **Source repository**: [github.com/yclian/skills](https://github.com/yclian/skills)
- **Discover more skills**: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
