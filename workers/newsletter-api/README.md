# Newsletter API Worker

This Cloudflare Worker powers the double opt-in signup and Community Signal submission flows for **The Defender’s Dispatch**. It keeps Resend credentials off the static Eleventy site, verifies Cloudflare Turnstile, rate-limits signup attempts, stores only the subscriber’s first name and email address on the Resend contact, sends the published confirmation template, triggers the existing `newsletter.subscribed` automation after confirmation, and sends the owner a best-effort notification for each confirmed subscriber. Signup source, signup page, and confirmation time are kept only in the temporary confirmation record and owner notification.

Accepted Community Signal submissions are stored as durable `pending-review` records in the private `NEWSLETTER_DATA` KV namespace before acknowledgement and editorial-notification emails are sent. Each record preserves the normalized submission, credit preference, and relationship disclosure. A separate scheduled editorial automation researches pending submissions, records its evidence, advances vetted items through `vetted-candidate` to `needs-review`, and triggers a second owner notification. Queue data is available only through the bearer-token-protected internal API; the browser dashboard contains no submission data until that API authorizes the request.

## What it exposes

- `GET /health`
- `POST /newsletter/subscribe`
- `GET /newsletter/confirm?token=<opaque-token>` — hands the token to the site without activating it
- `POST /newsletter/confirm` — confirms the address when the visible site page loads, with a manual retry available after temporary failures
- `POST /news/submit` — validates, queues, acknowledges, and privately notifies on a Community Signal
- `GET /editorial-queue` — private queue dashboard shell; requires the queue access token before it can load data and lets the owner select or reject reviewed signals
- `GET /internal/editorial-queue` — lists queue records after bearer-token authentication
- `GET /internal/editorial-queue/<submission-id>` — returns one authenticated queue record
- `PATCH /internal/editorial-queue/<submission-id>` — records an authenticated editorial status and review summary

Confirmation tokens are random and expire after 24 hours. Fetching the email link alone only hands the token to the site in the URL fragment; it does not subscribe the address. The visible site page completes confirmation in the browser, which prevents ordinary automated email link scanners from activating subscriptions without requiring a second click from the reader. A short-lived completion receipt makes retries safe without triggering the welcome automation twice.

## Cloudflare setup

1. Create a Turnstile widget for `www.kylereddoch.me`.
2. In **Workers & Pages**, import this GitHub repository as a new application.
3. Set the root directory to `workers/newsletter-api`.
4. Set the deploy command to `npm run deploy`.
5. Add the secrets below under **Settings > Variables and Secrets**.
6. Deploy the Worker.
7. Confirm that `https://<worker-name>.<account-subdomain>.workers.dev/health` reports `"configured": true`.

The `wrangler.jsonc` file contains the existing Resend Topic and confirmation-template IDs and provisions the `NEWSLETTER_DATA` KV binding.

## Worker secrets

- `RESEND_API_KEY` — use a Resend key with full access because this flow sends email and updates Contacts, Topics, and Events.
- `TURNSTILE_SECRET_KEY` — the secret belonging to the production Turnstile widget.
- `EDITORIAL_QUEUE_TOKEN` — a long random bearer token used only by the private queue dashboard and trusted editorial automation. Generate at least 32 random bytes and store it as a Worker secret, never in `wrangler.jsonc` or source control.

Do not put these values in the Eleventy repository, GitHub Actions variables, or client-side JavaScript.

Do not put the editorial queue token in a URL. The dashboard stores it only in the current browser tab's session storage and sends it in the `Authorization` header. Clear it with **Forget token** when using a shared browser.

## Private editorial queue

The queue uses keys beginning with `editorial:community-signal:` in the existing `NEWSLETTER_DATA` namespace. New records start as `pending-review`. Trusted editorial clients may move them to `vetted-candidate`, `needs-review`, `rejected`, `selected`, or `archived` and attach a concise review summary, wording caution, verified source URLs, and the corresponding local queue-file path. Status-only decisions preserve the automated review evidence and add a bounded transition history. Moving a signal to `needs-review` sends the owner one idempotent review-ready email. Archival updates may include `issueNumber` and `issueUrl` so the queue retains where the signal was published.

The intended lifecycle is:

1. `pending-review` — accepted and waiting for automated research.
2. `vetted-candidate` — evidence has been recorded by the vetting automation.
3. `needs-review` — ready for the owner's decision; a review-ready email has been sent.
4. `selected` or `rejected` — the owner's editorial decision.
5. `archived` — a selected signal was actually used in a published newsletter issue.

The internal API returns `503` until `EDITORIAL_QUEUE_TOKEN` exists and `401` when the bearer token is missing or incorrect. The public submission flow continues storing private KV records even when the read token has not been configured.

## Optional variables

Set `NEWSLETTER_NOTIFY_TO` to the address that should receive new-subscriber notifications. If it is empty, the Worker falls back to `SUBMISSION_NOTIFY_TO`; if neither is configured, subscriber notifications are skipped without affecting confirmation.

The allowed site origin, confirmation redirect, expected Turnstile hostname, Resend API base URL, and template ID are already defined in `wrangler.jsonc`.

## Connect the Eleventy site

In the GitHub repository, open **Settings > Secrets and variables > Actions > Variables** and create:

- `NEWSLETTER_API_URL` — the Worker origin without a trailing slash, such as `https://cyberseckyle-newsletter-api.<account-subdomain>.workers.dev`
- `TURNSTILE_SITE_KEY` — the public site key for the `www.kylereddoch.me` Turnstile widget

For local testing, add the same public values to the root `.env` file. Never add the Turnstile secret or Resend API key there for the static-site build.

## Local verification

```text
npm install
npm run check
npm test
```

The test suite uses in-memory KV and mocked upstream services. It does not send email or modify Resend contacts.
