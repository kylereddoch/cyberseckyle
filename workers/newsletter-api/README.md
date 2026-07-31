# Newsletter API Worker

This Cloudflare Worker powers the double opt-in signup flow for **The Defender’s Dispatch**. It keeps Resend credentials off the static Eleventy site, verifies Cloudflare Turnstile, rate-limits signup attempts, creates pending contacts, sends the published confirmation template, triggers the existing `newsletter.subscribed` automation after confirmation, and sends the owner a best-effort notification for each confirmed subscriber.

## What it exposes

- `GET /health`
- `POST /newsletter/subscribe`
- `GET /newsletter/confirm?token=<opaque-token>` — hands the token to the site without activating it
- `POST /newsletter/confirm` — confirms the address when the visible site page loads, with a manual retry available after temporary failures

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

Do not put either value in the Eleventy repository, GitHub Actions variables, or client-side JavaScript.

## Optional variables

Set `FOUNDING_READER_CUTOFF` to an ISO 8601 timestamp if subscribers confirmed before a launch deadline should receive the `founding_reader` property. Leave it empty to store `false`.

Set `NEWSLETTER_NOTIFY_TO` to the address that should receive new-subscriber notifications. If it is empty, the Worker falls back to `SUBMISSION_NOTIFY_TO`; if neither is configured, subscriber notifications are skipped without affecting confirmation.

The allowed site origin, confirmation redirect, expected Turnstile hostname, Resend API base URL, Topic ID, and template ID are already defined in `wrangler.jsonc`.

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
