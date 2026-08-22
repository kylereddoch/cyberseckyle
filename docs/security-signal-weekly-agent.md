# Security Signal Weekly Agent Brief

## Purpose

`Security Signal Weekly` is Kyle's refreshed Friday cybersecurity news series. The goal is not to summarize every headline. The goal is to filter the week into 10 high-signal stories that matter to defenders, IT teams, MSPs, small businesses, and security-aware readers.

The finished post should feel like Kyle's site: practical, direct, personal enough to have a point of view, and useful without turning into a sterile news digest.

## Publishing Scope

This automation is the only approved autopublish exception to the normal repo rule of no commits or pushes unless Kyle explicitly asks.

The exception is narrow:

- It applies only to generated `Security Signal Weekly` posts.
- It applies only when the scheduled workflow has been explicitly enabled/configured for autopublishing.
- It must not commit unrelated file changes.
- It must not modify existing posts unless the task is fixing the generated weekly post from the same run.
- It must not push layout, workflow, asset pipeline, or script changes.

If the automation is running in draft mode, create the post and report it for review without committing or pushing.

## Repository Sync

Before creating the post, sync the local checkout with `origin/main`:

```bash
git fetch origin main
git pull --ff-only origin main
```

If the pull cannot fast-forward cleanly, do not publish. Report the sync blocker instead of creating a merge commit or pushing from a stale checkout.

Because a weekly research run can take a while, check the remote again immediately before committing:

```bash
git fetch origin main
```

If `origin/main` advanced after the post was generated, preserve only the generated weekly post, fast-forward from `origin/main`, restore the generated post, rerun `npm run build:11ty`, and publish only if verification still passes. Do not commit the weekly post until the checkout is synced with the remote.

A safe pattern is:

```bash
git fetch origin main
if [ "$(git rev-list --count HEAD..origin/main)" -ne 0 ]; then
  git stash push --include-untracked -m security-signal-weekly-generated-post -- "$GENERATED_POST"
  git pull --ff-only origin main
  git stash pop
  npm run build:11ty
fi
```

`$GENERATED_POST` should be the single Markdown file created by `scripts/create-security-signal-weekly.mjs`.

## Schedule

Target cadence: Friday during the day in Kyle's local timezone.

The exact run time should be configurable. A reasonable default is Friday early afternoon so the post can cover most of the work week while still publishing before the evening.

## Source Priorities

Prefer primary and high-quality sources:

- CISA alerts, Known Exploited Vulnerabilities catalog updates, and emergency directives.
- Vendor advisories and release notes.
- Researcher writeups from credible security teams.
- Reputable security reporting when primary sources are thin or useful for context.
- Kyle's related posts where they help connect the new story to a recurring theme.

Avoid building the article from social posts alone. Social posts can point to a story, but the article should rely on durable sources.

## Story Selection Rubric

Pick 10 stories. Rank stories higher when they involve:

- Active exploitation.
- Internet-facing systems.
- Authentication, identity, SSO, VPN, MDM, RMM, help desk, browser, email, or cloud control planes.
- High-likelihood patch urgency for real organizations.
- Supply chain risk affecting developers, CI/CD, dependencies, signed updates, or security tools.
- Incidents with clear lessons for defenders.
- Stories with practical actions readers can take.
- Topics that match Kyle's recurring lanes: cybersecurity, IT operations, MSP reality, privacy, browser trust, and operational risk.

Do not include a story just because it is loud. Include it because it helps readers understand or act.

## Required Post Shape

Create a structured JSON file first, then render it with the repo script:

```bash
node scripts/create-security-signal-weekly.mjs --input docs/security-signal-weekly.example.json --dry-run
```

For a real weekly run, the agent should create a run-specific JSON input file outside the published content path or in a temporary workspace, then run:

```bash
node scripts/create-security-signal-weekly.mjs --input path/to/security-signal-weekly.json
```

The script creates a Markdown file under `src/posts/YYYY/` with a date-prefixed filename:

```txt
src/posts/2026/2026-05-15-security-signal-weekly-may-9-15-2026.md
```

Use front matter in this order:

```yaml
---
date: 2026-05-15T11:30:00-05:00
title: Security Signal Weekly: May 9-15, 2026
description: The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next.
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: A security operations dashboard showing alert cards, network activity, and a glowing shield representing the week's cybersecurity news.
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
x_post: true
x_url:
---
```

Notes:

- `date` should include the actual local creation time and local offset, usually `-05:00` or the correct current Central time offset. Do not use a fixed placeholder time such as `13:00:00`; if the post is created at 15:24 local time, use a value like `2026-05-22T15:24:00-05:00`.
- `title` can be unquoted unless YAML needs quotes. If the title has a colon or special character, use quotes to avoid parsing issues.
- Quote `description` only when punctuation or characters make YAML parsing safer.
- `tags` are lowercase site taxonomy tags and based on the post's content.
- `mastodon_tags` are Fediverse hashtags without the `#`, usually TitleCase or community-standard casing.
- Leave `mastodon_url:` blank so the existing Mastodon workflow can backfill it.
- Leave `x_url:` blank so the opt-in X workflow can backfill it when X auto-posting is enabled.
- Do not add the old body image shortcode.
- Do not add a detached references section unless Kyle asks for it.

## Reusable Hero Image

Use this reusable featured image:

```yaml
featuredImage: /assets/images/security-signal-weekly.png
```

If the reusable image is replaced later, keep it aligned with the site design:

```txt
A polished editorial hero image for a recurring cybersecurity news column called Security Signal Weekly. Match the CybersecKyle site palette: gray neutrals with blue, pink, and gold accents. Use clean typography, simple alert-card shapes, signal lines, and a restrained security icon. Avoid generic neon cyber dashboards, heavy teal/green palettes, fake UI clutter, and any old "Cybersecurity Weekly Roundup" text.
```

## Article Template

Use this structure:

```md
## Overview

Open with a short, opinionated overview of the week. Mention the biggest pattern across the 10 stories and what defenders should care about.

> **Reality check:** Include one short practical takeaway in Kyle's voice.

## Top 10 Security Signals

### 1. Story title

**What happened:** Explain the facts with inline links to the source material.

**Why it matters:** Explain the defender, MSP, SMB, privacy, or operational angle.

**Action:** Give two or three practical next steps.

### 2. Story title

Repeat the same structure through item 10.

## Closing Notes

End with a practical, human summary of what to prioritize next.
```

## Style Rules

- Keep links inline and close to the claim they support.
- Use `What happened`, `Why it matters`, and `Action` for each story.
- Keep the tone useful and mildly opinionated, not alarmist.
- Write like a practitioner filtering the week for another busy practitioner.
- Avoid emoji in headings.
- Avoid unsupported claims, fake CVEs, or invented dates.
- If facts are uncertain, say so clearly.
- Prefer "patch and verify" over "patch" when deployment confirmation matters.

## Verification

Before autopublishing:

- Confirm only the generated weekly post changed, plus the reusable hero image if this is the first setup run.
- Run `node --check scripts/create-security-signal-weekly.mjs` after script changes.
- Run `npm run build:11ty`.
- Confirm the generated post has `mastodon_post: true` and a blank `mastodon_url:`.
- Confirm the post uses `featuredImage`, not the old body image shortcode.
- Confirm source links are inline and not collected into a detached reference list.

If the build fails, do not publish. Report the error and leave the generated post for review.
