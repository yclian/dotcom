---
title: calendar-tbd-recommender
description: Automatically scans Google Calendar for upcoming events with
  placeholder locations (TBD, TBC, ???, or blank), analyzes meeting format and
  travel context (flights/transits), matches against a curated taste graph of
  venues, and generates contextual recommendations. Can patch confirmed venues
  directly back to the calendar.
publish: true
enableToc: true
tags:
  - skills
---

### install

```bash
npx skills add git@github.com:yclian/skills.git --skill calendar-tbd-recommender
```

### example prompts

- *"Scan my next two weeks of calendar events for TBD locations and suggest venues."*
- *"Find a coffee or cocktail spot for Friday's TBC meeting based on my current travel city."*

---

An agentic venue recommendation engine that audits your calendar for events marked with placeholder locations (e.g. `TBD`, `TBC`, `Location TBD`, or unset), resolves your active geographic city (accounting for flights and travel transits), classifies the meeting context, and recommends personalized dining, cocktail, or coffee venues from a curated taste graph.

---

## Capabilities

1. **Dual-Field Placeholder Detection**:
   - Matches `TBD`, `TBC`, `???`, `Location TBD`, or empty locations across both the event **Summary** (subject) and **Location** fields.
2. **Transit & Geographic Awareness**:
   - Inspects flight events (e.g., `Flight to Kuala Lumpur`, `SQ 114`, `SIN → KUL`) and full-day location blocks to determine the active city on the day of the event.
   - Dynamically selects the appropriate city's venue graph so you are never recommended venues in the wrong city.
3. **Context Classification**:
   - **Format**: 1-on-1 vs. small group (3–4 pax) vs. larger social party.
   - **Time of Day**: Morning coffee/breakfast, business lunch, afternoon tea, evening drinks/dinner, late night.
   - **Emoji & Intent Cues**: Detects tags and emojis like `🍷` (wine bar), `🍸` (cocktails), `☕` (specialty coffee), `🍽️` (seated dining).
4. **Interactive Calendar Patching**:
   - Once a decision is made, the engine can patch the Google Calendar event directly with the chosen venue name, address, and booking notes.

---

## Configuration

The recommender uses a clean YAML configuration file (e.g., `venues.yaml`) defining your taste graph by city:

```yaml
default_city: "Singapore"
cities:
  Singapore:
    timezone: "Asia/Singapore"
    venues:
      - name: "Live Twice"
        category: "cocktails"
        neighborhood: "Bukit Pasoh / Tanjong Pagar"
        vibe: "Intimate mid-century Ginza-style cocktail lounge. Quiet, discreet, perfect for 1v1."
        tags: ["cocktails", "1v1", "evening", "quiet", "drinks"]
        url: "https://www.livetwice.sg/"
        address: "18-20 Bukit Pasoh Rd, Singapore 089834"

      - name: "Somma"
        category: "wine_and_cocktails"
        neighborhood: "Clarke Quay / New Bridge Rd"
        vibe: "Cocktail and Italian wine bar downstairs, modern pasta upstairs."
        tags: ["wine", "cocktails", "dinner", "1v1", "evening"]
        url: "https://www.somma.sg/"
        address: "140 New Bridge Rd, Singapore 059443"

  Kuala Lumpur:
    timezone: "Asia/Kuala_Lumpur"
    venues:
      - name: "Penrose"
        category: "cocktails"
        neighborhood: "Chinatown / Petaling St"
        vibe: "Jon Lee's intimate 25-seater cocktail bar (Asia's 50 Best). Focused 1v1 craft."
        tags: ["cocktails", "1v1", "evening", "craft"]
        url: "https://www.instagram.com/penrose.kl/"
        address: "Petaling Street, Kuala Lumpur"
```

---

## Usage

### 1. Scan Upcoming Events (Dry Run)

```bash
python scripts/calendar_tbd_recommender.py \
  --credentials path/to/credentials.json \
  --calendar-id "your-email@gmail.com" \
  --venues-config path/to/venues.yaml \
  --days-ahead 21
```

### 2. Output to JSON / Markdown Report

```bash
python scripts/calendar_tbd_recommender.py \
  --credentials path/to/credentials.json \
  --calendar-id "your-email@gmail.com" \
  --venues-config path/to/venues.yaml \
  --format markdown
```

### 3. Patch a Resolved Venue to Calendar

Once a venue is selected:

```bash
python scripts/calendar_tbd_recommender.py \
  --credentials path/to/credentials.json \
  --calendar-id "your-email@gmail.com" \
  --patch-event "<EVENT_ID>" \
  --location "Penrose, Petaling St, Kuala Lumpur" \
  --note "Booked 2 pax at 19:00 via Instagram DM."
```

---

## Authentication Modes

- **Service Account (Headless Server / Cron)**: Pass `--credentials /path/to/service-account.json`. Ensure your Google Calendar is shared with the service account email (with *Make changes to events* permission).
- **OAuth User Credentials**: Pass `--credentials /path/to/client_secret.json` or `--token /path/to/token.json`.

---

### related skills & references

**in this collection**

- [todo-in-obsidian](/skills/todo-in-obsidian/) - Review, triage, and carry forward TODOs across weekly journal notes in Obsidian. It runs a full backlog review with disposition codes (DAL, DSE, KIV, NIN...), effort estimates, delegability calls, and carry-forward into the new week's note. Use whenever the user wants to review weekly entries, do a backlog or TODO review, close out last week, carry over todos, triage open items, revive deferred (DLT) items, or plan the coming week from their journal. Trigger even on casual phrasing like "what's still open from last week", "clean up my todos", or "help me plan this week". Always requires access to the weekly journal folder - ask for it first.
- [work-signal](/skills/work-signal/) - Morning triage of a work Gmail inbox: surface what actually needs the user (leadership threads, security/compliance/infrastructure, approvals, colleague asks, executive digests), suppress CI pipeline and vendor noise, and render a markdown brief in chat. Triggers include "/work-signal", "what needs my attention in work email", "triage my inbox", "anything from leadership", "inbox brief", "check unread work email", and the scheduled weekday morning run. Does NOT read one specific email, search mail by topic, compose, reply, or send - and does NOT write the weekly executive summary, which is work-week-recap.

**external references & similar skills**

- [Google Calendar API Reference](https://developers.google.com/calendar/api)
- [yclian/skills Repository](https://github.com/yclian/skills)
- [all skills in yclian/skills](/skills/)
- [explore community skills via npx skills (vercel-labs/agent-skills)](https://github.com/vercel-labs/agent-skills)
