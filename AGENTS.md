# AGENTS.md

## Project Overview

This is Kyle Reddoch's personal Eleventy site, published at `kylereddoch.me` and deployed through GitHub Pages. The site is a customized Eleventy Excellent-based blog with posts, notes, weekly notes, projects, Webmentions, generated OG images, and an opt-in Mastodon publishing workflow.

Treat this as a personal IndieWeb site first and a static site project second. Changes should preserve the author's voice, reduce publishing friction, and keep the site reliable when deployed.

## Repository Map

- `src/posts/YYYY/`: Standard blog posts.
- `src/posts/weeklynotes/YYYY/`: Weekly note posts.
- `src/notes/YYYY/`: Short notes.
- `src/projects/`: Project pages.
- `src/pages/`: Static pages.
- `src/_layouts/`: Nunjucks layouts.
- `src/_includes/`: Nunjucks partials, head metadata, and WebC components.
- `src/_data/`: Eleventy data files.
- `src/assets/starter/`: Main CSS and client-side JavaScript.
- `src/assets/images/`: Source images used by content.
- `src/assets/og-images/`: Existing generated or committed OG preview images.
- `src/common/og-images.njk`: OG image generation entry point.
- `scripts/post-to-mastodon.mjs`: Opt-in Mastodon autopost and front matter backfill workflow.
- `scripts/create-security-signal-weekly.mjs`: Renders structured weekly security story data into a `Security Signal Weekly` Markdown post.
- `docs/security-signal-weekly-agent.md`: Agent brief for the Friday `Security Signal Weekly` research and publishing workflow.
- `.github/workflows/eleventy_build.yml`: Build, deploy, and Mastodon automation workflow.

## Local Commands

- `npm install`: Install dependencies.
- `npm start`: Run the Eleventy dev server.
- `npm run build`: Clean and run the production Eleventy build. This is the main local verification command.
- `npm run build:11ty`: Run the production Eleventy build without the clean step.
- `npm run build-ghpages`: Run the GitHub Pages-style Eleventy build.

Builds can take several minutes because image generation and HTML/CSS minification are meaningful parts of the pipeline. Use longer timeouts before deciding a build is hung.

## Working Style

- Prefer repo-specific evidence over generic Eleventy assumptions.
- Make targeted changes that fit the existing Nunjucks, Eleventy, CSS, and JavaScript patterns.
- Do not rewrite unrelated content, old posts, generated assets, or legacy files unless the task explicitly calls for it.
- If a user asks whether something builds, deploys, or works in the browser, verify it directly and report the concrete result.
- For behavior that depends on the live site, treat "the deploy step finished" and "the public page is reachable" as different states.
- When changing theme startup behavior, keep `src/_layouts/base.njk` and `src/assets/starter/main.js` in sync.
- When changing Webmention response rendering, keep `src/_includes/partials/webmentions.njk` and `src/assets/starter/webmentions.js` in sync.

## Content Voice

Kyle's posts should feel personal, useful, and grounded in real practitioner context. The voice can be conversational and direct, but it should not become sterile release notes or generic SEO filler.

For site-change/tutorial posts:

- Start with the old manual workflow or real annoyance that motivated the change.
- Explain why the change mattered personally.
- Show the implementation with concrete code or examples.
- Keep enough tutorial detail that a reader can learn from it.
- Avoid making the post read like a product announcement.

For cybersecurity commentary:

- Prefer signal over speed.
- Explain the "why" and operational impact, not only what happened.
- Tie claims to primary sources, vendor docs, reputable reporting, or the author's own related posts.
- Keep the practical defender/MSP/business angle clear when relevant.

## Link And Reference Style

Kyle prefers references linked naturally inside the paragraph where the source is used. Do not default to a detached `References` or `Sources` section unless the post format already uses one or the user asks for it.

Preferred:

```md
Recent reporting from [Malwarebytes](https://example.com/report) says the browser downloaded the model in the background, while [Google's own support page](https://example.com/docs) confirms the related setting exists.
```

Avoid:

```md
Recent reporting says the browser downloaded the model in the background.

## References

- https://example.com/report
- https://example.com/docs
```

Use descriptive link text, not bare URLs or "click here." For internal links, prefer root-relative site URLs such as `/blog/the-post-slug/`.

When citing multiple sources for one point, keep them close to the sentence they support. Example:

```md
The shared responsibility model is the cleanest way to think about the boundary between provider-owned and customer-owned controls ([AWS](https://example.com), [Microsoft Azure](https://example.com), [Google Cloud](https://example.com)).
```

## Front Matter Conventions

Standard blog post front matter is YAML between `---` fences. Keep the field order close to existing posts:

```yaml
---
date: 2026-05-13T10:00:00-05:00
title: Example Post Title
description: A concise summary that works for feeds, previews, and metadata.
featuredImage: /assets/images/example-image.jpg
featuredImageAlt: Clear alt text describing the image.
featuredImageCaption: 'Photo by <a href="https://example.com">Name</a> on <a href="https://example.com">Source</a>'
tags: [cybersecurity, privacy, browsers]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, Privacy]
---
```

Notes:

- `date` should include the local offset, usually `-05:00` or the correct current Central time offset.
- `title` can be unquoted unless YAML needs quotes. If the title has a colon or special character, use quotes to avoid parsing issues.
- Quote `description` only when punctuation or characters make YAML parsing safer.
- `featuredImage`, `featuredImageAlt`, and `featuredImageCaption` are optional, but use them together when a post has a hero image.
- `tags` are lowercase site taxonomy tags and based on the post's content.
- `mastodon_tags` are Fediverse hashtags without the `#`, usually TitleCase or community-standard casing.
- For new posts that should autopost, use `mastodon_post: true` and leave `mastodon_url:` blank.
- If a post should not autopost, omit `mastodon_post` and `mastodon_tags`.
- If a post already has a Mastodon discussion thread, keep `mastodon_url` populated with the status URL.

Short notes use simpler front matter:

```yaml
---
date: 2026-05-13T10:00:00-05:00
title: "Short note title"
tags: [notes]
---
```

Weekly notes use the note layout through `src/posts/weeklynotes/weeklynotes.json` and usually include:

```yaml
---
date: 2026-05-13T10:00:00-05:00
title: Week Title (Week 20, 2026)
description: A brief summary of the week.
featuredImage: /assets/images/weeklynotes-hero.png
tags: [weeklynotes]
mastodon_post: true
mastodon_url:
mastodon_tags: [WeeklyNotes, WeekNotes]
---
```

## Mastodon Workflow

Mastodon posting is opt-in. The automation looks for posts with:

```yaml
mastodon_post: true
mastodon_url:
```

After posting, the workflow backfills `mastodon_url` with the returned Mastodon status URL and rebuilds the site so the discussion link is connected.

Default Mastodon status format:

```txt
New by me: {Title}

{url}

{mastodon tags from front matter}
```

Do not include the article description in the Mastodon status unless the user explicitly asks for it.

The workflow should wait for the public article URL and `og:image` URL to be reachable before posting. Do not assume GitHub Pages propagation is complete just because a deploy job has finished.

## Security Signal Weekly

`Security Signal Weekly` is the refreshed weekly cybersecurity news series. The series should publish on Fridays when the dedicated scheduled workflow is enabled.

For these posts:

- Use titles like `Security Signal Weekly: May 9-15, 2026`.
- Pick the top 10 stories from the week, not every interesting story.
- Prioritize active exploitation, CISA/vendor urgency, patch impact, defender usefulness, SMB/MSP relevance, supply chain risk, identity/browser/cloud risk, and stories Kyle can add practical context to.
- Keep source links inline in the paragraph where each claim is used.
- Use `featuredImage: /assets/images/security-signal-weekly.png`.
- Do not put the old roundup image shortcode in the body.
- Use `mastodon_post: true`, leave `mastodon_url:` blank, and set useful `mastodon_tags`.
- Render posts with `node scripts/create-security-signal-weekly.mjs --input path/to/security-signal-weekly.json`.
- The dedicated Friday workflow may autopublish only `Security Signal Weekly` posts that it creates and verifies. This exception does not grant permission to commit, push, or publish other changes.

## Webmentions And Responses

The post UI uses `Responses` as the umbrella section for social reactions and blog-link pings. Keep `mention-of` blog Webmentions visible as `Mentions` rather than collapsing them into likes, reposts, or replies.

When editing this area:

- Static rendering lives in `src/_includes/partials/webmentions.njk`.
- Live client-side rendering lives in `src/assets/starter/webmentions.js`.
- Update both paths together so rendered HTML and refreshed Webmention data behave the same way.

## OG Images

Generated OG images may appear in `dist` during builds and may also exist under `src/assets/og-images`. Do not assume a missing source OG image is a bug without checking how the current build generates that asset.

For publish-sensitive workflows, verify:

- The article URL returns OK.
- The rendered page contains an `og:image` meta tag.
- The referenced OG image URL returns OK.

## Performance And Theme Notes

- `npm run build` is the authoritative local verification step for performance/theme work.
- CSS minification is intentional. If minification becomes slow, check cssnano/SVGO behavior before removing minification entirely.
- Dark mode should be the default only when there is no saved theme preference.
- A saved `localStorage.theme = "light"` preference should still show light mode on later visits.
- Browser verification for theme work should check the `html` class and `#dark-toggle` state on a fresh local origin.

## Verification Expectations

Use the smallest verification that proves the change:

- Docs-only changes: inspect the diff and run `git diff --check`.
- Markdown/content changes: run `npm run build:11ty` when front matter, shortcodes, images, or templates might be affected.
- Layout, data, Webmention, theme, or asset pipeline changes: run `npm run build`; add browser verification when behavior or rendering changed.
- GitHub Pages workflow changes: run `npm run build-ghpages` when practical and inspect the workflow logic carefully.
- JavaScript syntax changes: use `node --check` on edited JS files where applicable.

If a verification command is skipped because it would be too slow or not useful for the change, say so clearly.

## Git And Generated Files

- Do not commit, push, create pull requests, or otherwise publish changes unless Kyle explicitly asks for that action.
- Exception: the dedicated `Security Signal Weekly` scheduled workflow may commit and push only the generated Friday weekly security post when that workflow has been explicitly enabled/configured for autopublishing.
- Do not revert user changes or unrelated dirty files.
- Avoid committing generated `dist` output unless the user specifically asks.
- Be careful with `src/assets/og-images`: some previews are generated artifacts, but the repo may also contain committed OG images.
- Keep edits scoped to the requested files and the supporting files required by the implementation.
