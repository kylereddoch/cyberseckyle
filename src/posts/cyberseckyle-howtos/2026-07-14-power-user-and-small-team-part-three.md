---
date: 2026-07-14T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Power User and Small Team, Part 3 - Secrets Management 101 for Side Projects'
seoTitle: Secrets Management 101 for Side Projects
description: 'A practical secrets management guide for side projects and small teams: stop committing keys, use environment variables and secret stores, rotate exposed credentials, and validate that secrets stay out of Git.'
searchIntent: Help developers, creators, and small teams store API keys, tokens, and credentials safely for side projects without overbuilding an enterprise secrets program.
featuredImage: /assets/images/vs-code-screenshot.png
featuredImageAlt: Code editor workspace representing side project configuration and safer handling of secrets.
featuredImageCaption: A secret in Git is not a secret. It is a delayed incident.
tags: [cyberseckyle-howto-series, cybersecurity, security, devsecops, appsec, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, DevSecOps, AppSec, CybersecKyleHowTo]
---

> I am back with Season 3, Part 3 of the Power User and Small Team track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we are cleaning up secrets for side projects: API keys, tokens, credentials, environment files, and the bad habit of letting private things drift into public places.

Side projects collect secrets fast.

One API key for a test. One token for a deploy. One webhook secret. One database URL. One `.env` file copied from a tutorial. One quick commit at 1:00am.

Then the repository goes public, the key gets indexed, and the "tiny project" suddenly has a very adult security problem.

Secrets management sounds enterprise, but the beginner version is simple:

Do not hard-code secrets. Do not commit secrets. Store them somewhere designed for secrets. Rotate them when exposed. Limit what they can do.

Those basics avoid a surprising amount of pain.

## What counts as a secret

A secret is anything that lets someone authenticate, authorize, decrypt, impersonate, or trigger something sensitive.

Examples:

* API keys
* Personal access tokens
* Database URLs
* Webhook signing secrets
* OAuth client secrets
* Private keys
* SSH keys
* Encryption keys
* Session secrets
* Cloud credentials
* Service account JSON files
* Password manager exports

If posting it in a public chat would make you nervous, treat it like a secret.

## What you are building

By the end of this guide, you should have:

* A list of secrets used by your project
* Secrets removed from source code
* `.env` files ignored by Git
* Example environment files that do not contain real values
* Production secrets stored in your hosting provider or secret manager
* Exposed credentials rotated
* A validation check that confirms secrets are not committed

We are not building a huge enterprise vault. We are building sane side-project hygiene.

## Step 1: Inventory project secrets

For each project, create a short inventory.

```txt
Project:
Repository:
Hosting provider:
Database:
Third-party APIs:
Deploy tokens:
Webhook secrets:
Local .env file:
Production secret location:
Owner:
Last rotation:
```

Then list each secret:

```txt
Name:
Purpose:
Where stored locally:
Where stored in production:
Permission scope:
Can rotate:
Last rotated:
```

Do not put the secret value in the inventory. Put the name and location.

## Step 2: Remove secrets from code

Hard-coded secrets usually look like:

```js
const apiKey = "abc123-secret-value";
```

Replace that with environment reads:

```js
const apiKey = process.env.EXAMPLE_API_KEY;
```

Then keep real values in local `.env` files or provider secret settings.

Add `.env` to `.gitignore`:

```txt
.env
.env.local
.env.*.local
```

Do not ignore `.env.example`. That file should be committed with safe placeholder values:

```txt
EXAMPLE_API_KEY=replace-me
DATABASE_URL=replace-me
WEBHOOK_SECRET=replace-me
```

The example file teaches setup without leaking credentials.

## Step 3: Store production secrets outside the repo

Most hosting platforms, CI systems, and deployment tools have secret storage.

Use that for production:

* GitHub Actions secrets
* Vercel environment variables
* Netlify environment variables
* Cloudflare secrets
* AWS Secrets Manager or Parameter Store
* Azure Key Vault
* Google Secret Manager
* Docker or platform-specific secret storage

The exact provider matters less than this rule:

```txt
Production secrets should not live in source code, screenshots, issue comments, or random notes.
```

If a secret is needed by a deploy workflow, store it in the workflow's secret store. If it is needed by the app runtime, store it in the runtime environment.

## Step 4: Limit secret permissions

A secret should only do the job it needs to do.

Prefer:

* Read-only tokens when write is not needed
* Project-scoped tokens over account-wide tokens
* Short-lived tokens where supported
* Separate dev and production credentials
* Separate tokens per integration

Avoid:

* Personal admin tokens for automation
* One token reused across every project
* Cloud credentials with full account access
* Tokens named `test` that run production

Least privilege applies to secrets too.

## Step 5: Rotate anything that was exposed

If a secret was committed, pasted in a public issue, sent to the wrong place, or stored in an exposed log, assume it is compromised.

Do not just delete the line and move on.

Rotate it:

1. Revoke the exposed secret.
2. Create a new one.
3. Update local and production storage.
4. Redeploy or restart the app if needed.
5. Check logs for misuse.
6. Remove the secret from Git history if the exposure requires it.

Deleting from the latest commit does not erase copies from history, forks, caches, or bots that already saw it.

## Step 6: Add a preflight check

Before pushing, run a secrets scan.

Options include:

* GitHub secret scanning for supported repositories
* `gitleaks`
* `trufflehog`
* Provider-specific scanners
* IDE extensions or pre-commit hooks

You do not need ten tools. Pick one that fits your workflow and actually run it.

Also use the simple human check:

```txt
git diff
```

Look at what you are about to push. It catches more than people think.

## Validation drills: prove secrets are not leaking

### Drill 1: Git ignore test

Create or confirm a local `.env` file, then run:

```bash
git status
```

Expected result:

```txt
The real .env file is not staged or tracked.
```

### Drill 2: Example file check

Open `.env.example`.

Expected result:

```txt
The file contains names and placeholders, not real secret values.
```

### Drill 3: Repo search

Search the repo for likely secret names:

```bash
rg "API_KEY|TOKEN|SECRET|PRIVATE_KEY|DATABASE_URL"
```

Expected result:

```txt
Code references environment variable names, not real secret values.
```

### Drill 4: Rotation test

Rotate one low-risk development token.

Expected result:

```txt
You understand the rotation path before a real incident forces it.
```

## Secrets checklist

```txt
Secrets Management Checklist

Inventory
[ ] Project secrets listed by name and purpose
[ ] Secret values not stored in the inventory
[ ] Owners assigned
[ ] Production storage location recorded

Local development
[ ] Real .env files ignored by Git
[ ] .env.example committed with placeholders
[ ] Secrets read from environment variables
[ ] Local secrets stored in password manager or protected files

Production
[ ] Production secrets stored in hosting or CI secret store
[ ] Dev and production credentials separated
[ ] Tokens scoped to minimum permissions
[ ] Old tokens removed

Validation
[ ] git status confirms .env is not tracked
[ ] repo search finds no real secrets
[ ] scanner run where practical
[ ] rotation process tested
```

## Final thought

Secrets problems usually do not start dramatically.

They start with "just for now."

Just hard-code it for testing. Just paste it in the issue. Just commit the `.env` because the deploy is being annoying. Just reuse the admin token because it works.

Then the project grows, the repo moves, the key leaks, and the shortcut becomes the incident.

Keep secrets out of code. Scope them tightly. Rotate what leaks. Make the safe path the normal path.
