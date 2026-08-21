# The Defender’s Dispatch archive

This implementation keeps the newsletter content in the CybersecKyle repository and uses it to build both the public web archive and a reviewable email artifact. The scheduled task can publish an approved web edition and create a Resend draft, but it is never allowed to send or schedule the broadcast.

## How the pieces fit together

1. An issue starts as Markdown in `src/newsletter/issues/`.
2. Eleventy builds that file into a dated permanent page under `/newsletter/defenders-dispatch/issue-###/YYYY-MM-DD/`.
3. The separate archive page reads the same collection and adds the issue automatically.
4. `npm run newsletter:email-preview` renders the same Markdown into an email-shaped HTML preview. The command only writes a local file under `dist/newsletter/email-preview/`.
5. When an issue is approved later, its reviewed HTML can be moved into the Resend broadcast workflow. Sending remains a separate, explicit action.

## Friday scheduled workflow

The Windows Codex task runs every Friday at 7:00 PM local time. It uses the same Markdown-first structure, with these gates in order:

1. Determine the next zero-padded issue number and create the new Markdown issue under `src/newsletter/issues/`.
2. Validate the repository diff, run the production Eleventy build, and inspect the rendered archive page and dated issue URL.
3. Commit and push only the new issue created by that run.
4. Wait for the site deployment and verify that the canonical web edition is live.
5. Render the same Markdown through the published Resend master template, including the live **View on the web** URL and exactly one issue-specific Tinylytics pixel.
6. Create a new Resend **draft** for review.
7. Stop. Sending or scheduling the broadcast requires a separate, explicit approval.

Because the task reads and writes local project files, the Windows computer must be awake and the Codex app must be running at the scheduled time. The task stops instead of publishing if it finds conflicting pre-existing repository changes, a failed build, a failed deployment, a missing live archive page, a placeholder tracking path, or a missing or duplicated Tinylytics pixel.

The initial sources are `src/newsletter/issues/issue-001.md` and `src/newsletter/issues/issue-002.md`. They are archive versions of the sent August 7 and August 14, 2026 issues, not placeholder copy.

## Preview the website locally

From the repository root:

```powershell
npm install
npm run dev:11ty
```

Open:

- `http://localhost:8080/newsletter/` for the landing page and signup form.
- `http://localhost:8080/newsletter/archive/` for the issue archive.
- `http://localhost:8080/newsletter/defenders-dispatch/issue-001/2026-08-07/` for Issue 001.
- `http://localhost:8080/newsletter/defenders-dispatch/issue-002/2026-08-14/` for the sample issue.

Development builds use Cloudflare’s public Turnstile test widget and put the form in local preview mode unless `NEWSLETTER_API_URL` is explicitly supplied. Submitting the form in this default mode shows the completed interaction but makes no API request, creates no Resend contact, and sends no email.

The production Eleventy build keeps the existing live endpoint and Turnstile site key behavior unchanged.

## Preview the email version

Run:

```powershell
npm run newsletter:email-preview
```

That creates `dist/newsletter/email-preview/issue-002.preview.html`. The preview has a visible local-only banner, includes no Tinylytics pixel, and makes no Resend API request.

To render a different issue:

```powershell
npm run newsletter:email-preview -- src/newsletter/issues/issue-003.md
```

The optional `--production` flag removes the preview banner and includes the issue-specific Tinylytics pixel from `trackingPath`. It still only writes a local HTML file; it does not create, update, schedule, or send a Resend broadcast.

## Secure subscription path

The static site never receives a Resend secret. The browser posts the signup to `workers/newsletter-api`, and the Worker reads its credentials from encrypted Cloudflare secret bindings.

The existing Worker provides:

- strict origin handling with localhost allowed for deliberate testing;
- bounded JSON request bodies and normalized input;
- a honeypot, server-side Cloudflare Turnstile verification, and per-source rate limiting;
- cryptographically random, hashed confirmation tokens stored temporarily in KV;
- double opt-in, with the contact left unsubscribed until confirmation finishes;
- a browser handoff that prevents ordinary email link scanners from activating a subscription;
- structured failure responses without exposing upstream Resend details;
- tests with mocked Resend and Turnstile calls, so the test suite sends no mail and changes no contacts.

`RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` must remain Worker secrets. They must never be added to Eleventy data, browser JavaScript, `wrangler.jsonc`, or committed environment files. The exact Worker setup and test commands are in `workers/newsletter-api/README.md`.

## Add another issue

1. Copy an existing issue Markdown file.
2. Set a unique zero-padded `issueNumber`, date, title, description, email subject, preview text, dated permalink, and `trackingPath`.
3. Write the issue body once in Markdown.
4. Run the Eleventy build and inspect both the archive card and issue page.
5. Render the local email preview and inspect links, personalization placeholders, unsubscribe placeholder, mobile layout, and issue-specific tracking path.
6. After the web edition is live, create the Resend draft for review. Separately authorize sending only after the draft has been checked.

The issue-specific Tinylytics path must use `/newsletter/defenders-dispatch/issue-###`. Never send while the aggregate path or the `issue-###` placeholder remains.
