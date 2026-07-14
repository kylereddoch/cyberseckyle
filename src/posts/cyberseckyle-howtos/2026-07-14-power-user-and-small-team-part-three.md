---
date: 2026-07-14T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Power User and Small Team, Part 3 - Secrets Management 101 for Side Projects'
seoTitle: Secrets Management 101 for Side Projects
description: 'A working secrets-management baseline for side projects: keep credentials out of Git, scope production access, scan before pushing, and respond correctly when a key leaks.'
searchIntent: Help developers, creators, and small teams store API keys, tokens, and credentials safely for side projects without overbuilding an enterprise secrets program.
featuredImage: /assets/images/vs-code-screenshot.png
featuredImageAlt: Code editor workspace representing side project configuration and safer handling of secrets.
featuredImageCaption: Configuration can name a required credential without storing its value in source code.
tags: [cyberseckyle-howto-series, cybersecurity, devsecops, appsec, how-to]
lastModified: 2026-07-14T12:13:06-05:00
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116919193056760618"
mastodon_tags: [Cybersecurity, InfoSec, DevSecOps, AppSec, CybersecKyleHowTo]
publishedAt: "2026-07-14T16:08:24.214Z"
---

> Part 3 of the Power User and Small Team track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) deals with the credentials that accumulate around side projects: API keys, deployment tokens, database passwords, webhook secrets, and the local files used to hold them.

A side project rarely gets a secrets-management plan on day one. It gets an API key copied from a provider dashboard so a feature can be tested. That key lands in a configuration file, the application works, and attention moves to the next problem.

The risk changes when the repository leaves one computer. Git preserves history, CI systems copy values into build environments, and a token created for a small experiment may have access to an entire account. Deleting the visible line later does not revoke the credential or remove it from earlier commits.

A workable baseline for a small project consists of an inventory, storage outside source control, narrowly scoped access, and a tested response for the day one credential leaks.

## Map the credentials and their dependencies

A secret is a value that grants access or proves identity: an API key, personal access token, database password, private key, OAuth client secret, webhook signing key, or cloud credential. A service URL or public client identifier may be configuration without being secret. Mixing the two leads either to exposed credentials or to a repository full of harmless values treated as classified material.

Before moving anything, record the information needed to manage each real secret:

```txt
Name:
Application or workflow that uses it:
Development, test, or production:
Provider that issued it:
Where the value is stored:
What it can access:
Owner:
Expiration date:
Revocation or rotation procedure:
```

This inventory must never contain the value itself. It should tell a maintainer where the credential comes from, what will break if it changes, and how to disable it. The [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) treats creation, rotation, revocation, and expiration as one lifecycle; a folder full of keys is storage, not lifecycle management.

Pay close attention to credentials reused across projects. A token shared by three applications turns one exposed repository into three cleanup jobs and makes the source of suspicious activity harder to identify.

## Remove the value without hiding the dependency

Source code should name the configuration it expects while the credential stays outside it. In a Node.js project, a hard-coded value like this:

```js
const apiKey = "real-provider-key";
```

can become an environment read with a failure that points to the missing setup:

```js
const apiKey = process.env.EXAMPLE_API_KEY;

if (!apiKey) {
  throw new Error("EXAMPLE_API_KEY is required");
}
```

For local development, many projects load those values from an `.env` file. Ignore the real files while deliberately allowing example files:

```gitignore
.env
.env.*
!.env.example
!.env.*.example
```

Then commit an `.env.example` containing names and unmistakably fake placeholders:

```dotenv
EXAMPLE_API_KEY=replace-with-provider-key
DATABASE_URL=postgresql://user:password@host:5432/database
WEBHOOK_SECRET=replace-with-webhook-secret
```

An example file is setup documentation. It should show required names and safe shapes without containing a working development credential copied over for convenience.

`.gitignore` has a firm boundary: it keeps untracked files untracked but does not retroactively protect a file that has already been committed. The [Git documentation](https://git-scm.com/docs/gitignore) calls this out directly. Check both conditions:

```bash
git check-ignore -v .env
git ls-files -- '.env*'
```

The first command should identify the ignore rule. The second should list only example or template files that were intentionally committed, never a file containing real values. If `.env` is tracked, remove it from the index while leaving the local file in place:

```bash
git rm --cached .env
```

If that file ever reached a shared repository, stop treating this as housekeeping. Rotate every credential it contained before doing anything else.

## Put each production secret where it is used

Production credentials belong in the secret facility provided by the system consuming them: a repository or environment secret for a CI workflow, a protected environment variable for a hosting platform, or a cloud secret manager for an application running in that cloud.

The storage decision should follow the execution boundary. A deployment workflow does not need a credential copied into a developer's `.env`, and an application runtime does not need an account-wide token simply because that token was easy to create. GitHub, for example, supports secrets at repository, organization, and environment scope, and its own [Actions guidance recommends granting the minimum permissions and repository access required](https://docs.github.com/en/enterprise-cloud@latest/actions/concepts/security/secrets).

For each credential:

- Separate development and production values.
- Use a project or service identity instead of a person's administrator token.
- Grant read-only access when the job only reads.
- Limit the token to the repositories, services, or resources it actually uses.
- Prefer an expiration date or short-lived credential when the provider supports one.
- Give separate integrations separate credentials so one can be revoked without breaking the others.

A secret store reduces accidental exposure at rest. It does not make an overpowered token safe, and it cannot prevent an application from printing the value into a log. Review debug output, error handling, build artifacts, and screenshots with that in mind.

## Review staged changes and scan the repository

Review the exact staged patch before committing:

```bash
git diff --cached
```

That catches an unexpected `.env` file, a copied provider response, or a token pasted into a test fixture. Automated scanning covers credential patterns a manual review may miss. Searching for names such as `API_KEY` is unreliable because those names belong in source while an unfamiliar credential value may evade the search entirely.

[Gitleaks](https://github.com/gitleaks/gitleaks) can scan the current repository and its Git history with:

```bash
gitleaks git --redact
```

Run it locally or as a pre-commit/CI control. On GitHub, [push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection) can block supported credential patterns before they land in a repository. Neither control recognizes every secret, so a clean result is evidence that the checks ran, not proof that the repository contains nothing sensitive.

False positives need review rather than automatic suppression. If a test value repeatedly trips a rule, document a narrow exception. Broad ignore rules make the scanner quiet by teaching it not to look.

## When a secret reaches Git

Treat a committed credential as exposed even if the repository was private or the commit was quickly deleted. Other users, automation, logs, caches, and forks may already have a copy.

Contain the access in this order:

1. Revoke the exposed credential or rotate it at the issuing provider.
2. Identify its permissions, every application that used it, and the environments where it was installed.
3. Create a replacement with the smallest practical scope, update the legitimate consumers, and redeploy or restart them.
4. Review provider and application logs from the exposure window for unfamiliar use.
5. Remove the value from the current branch and add the prevention that was missing: an ignore rule, scanner, narrower token, or safer deployment path.
6. Decide whether repository history must be rewritten, then coordinate that work with every collaborator.

GitHub's [guidance for removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository) also puts revocation or rotation first. History rewriting changes commit hashes, can disrupt collaborators, and does not erase copies held in existing clones or forks. That cleanup may still be necessary after the exposed access has been contained.

## A short validation pass

Use this before the next push and after any change to how the project receives credentials:

```txt
[ ] Every secret has an owner, scope, storage location, and revocation path
[ ] Real .env files are ignored and absent from git ls-files output
[ ] .env.example contains placeholders only
[ ] Development and production use different credentials
[ ] Production credentials live in the consuming platform's secret store
[ ] Tokens have the minimum useful permissions and a practical expiration
[ ] git diff --cached has been reviewed
[ ] A repository and history scan has completed without unexplained findings
```

The useful test is whether another maintainer could replace one credential without searching through source files, guessing which systems use it, or granting the replacement more access than it needs. If the inventory and storage setup support that response, the project has moved beyond hiding strings and into actual secrets management.
