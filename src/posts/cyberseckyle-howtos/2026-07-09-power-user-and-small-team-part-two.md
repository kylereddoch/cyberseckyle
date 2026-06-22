---
date: 2026-07-09T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Power User and Small Team, Part 2 - Email Security with SPF, DKIM, and DMARC'
seoTitle: Email Security with SPF DKIM and DMARC
description: 'A practical guide to improving domain email security with SPF, DKIM, and DMARC: inventory senders, publish safer DNS records, monitor reports, and avoid breaking legitimate email.'
searchIntent: Help domain owners, creators, and small teams configure SPF, DKIM, and DMARC safely so spoofing gets harder without breaking legitimate mail.
featuredImage: /assets/images/workspace-laptop.jpg
featuredImageAlt: Laptop workspace representing domain email configuration and small team security administration.
featuredImageCaption: Email authentication works best when you know who is allowed to send as you.
tags: [cyberseckyle-howto-series, cybersecurity, security, email, identity-security, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, EmailSecurity, DMARC, CybersecKyleHowTo]
---

> I am back with Season 3, Part 2 of the Power User and Small Team track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we are making domain email harder to spoof with SPF, DKIM, and DMARC, without turning DNS into a self-inflicted outage.

Email is still one of the messiest trust systems we use every day.

Your domain might send email from Google Workspace, Microsoft 365, a website host, a newsletter platform, a receipt system, a CRM, a help desk, and that one plugin someone installed two years ago and forgot about.

Then phishing shows up pretending to be you.

SPF, DKIM, and DMARC do not fix all email abuse. They do make it much harder for someone to send mail that claims to be from your domain without authorization. They also give receiving mail systems a clearer signal about what should happen when authentication fails.

The catch: if you guess, you can break your own mail.

So we are going to inventory first.

## What you are building

By the end of this guide, you should have:

* A list of legitimate services that send email for your domain
* SPF reviewed and cleaned up
* DKIM enabled for major senders
* DMARC published in monitoring mode first
* A path toward quarantine or reject once legitimate mail aligns
* A validation test using real messages

This is for domain owners, creators, small teams, homelab folks, and anyone who uses a custom domain for email.

## SPF, DKIM, and DMARC in plain language

SPF answers:

```txt
Which servers are allowed to send mail for this domain?
```

DKIM answers:

```txt
Was this message signed by a system that controls the domain key?
```

DMARC answers:

```txt
If SPF or DKIM does not align with the visible From domain, what should receivers do?
```

The trio matters because attackers often spoof the visible From address. DMARC ties authentication back to the domain the recipient sees.

## Step 1: Inventory every sender

Before changing DNS, list every service that sends as your domain.

```txt
Primary email provider:
Website contact form:
Newsletter:
Transactional email:
Payment receipts:
CRM:
Support desk:
Calendar/scheduling:
Monitoring alerts:
Old services:
```

For each sender:

```txt
Service:
Sends from address:
SPF include or sending IP:
DKIM selector:
DMARC alignment:
Owner:
Still needed:
```

Do not skip this. SPF records turn into junk drawers because people keep adding includes and never remove old services.

## Step 2: Review SPF

SPF is a DNS TXT record. It usually looks something like this:

```txt
v=spf1 include:_spf.google.com include:example-service.com ~all
```

Your job is not to copy that exact record. Your job is to make sure your domain lists the services that actually send mail for you.

Common mistakes:

* Multiple SPF records on the same domain
* Old services still included
* Too many DNS lookups
* Using `+all`, which basically says anyone is allowed
* Using a strict ending before confirming all senders

Start with the provider documentation for each legitimate sender. Merge includes carefully into one SPF record.

If you are not sure, use `~all` while you are validating. Move carefully.

## Step 3: Enable DKIM for real senders

DKIM usually gives you a DNS record to publish. The email provider signs outbound mail with a private key, and receivers verify it with the public DNS record.

Most major email services support DKIM. Many newsletter and transactional platforms do too.

Enable DKIM for:

* Primary email provider
* Newsletter platform
* Transactional email provider
* Website or app mail provider
* Support desk if it sends from your domain

Then send test messages and inspect headers.

You want DKIM to pass and align with your domain or subdomain where possible.

## Step 4: Publish DMARC in monitoring mode

Start DMARC gently.

```txt
v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com
```

That tells receivers to send aggregate reports without asking them to quarantine or reject failing mail yet.

Use a dedicated mailbox or reporting service. DMARC aggregate reports are XML and not exactly beach reading.

Stay in monitoring mode long enough to learn:

* Which services send legitimate mail
* Which messages fail SPF or DKIM
* Whether forwarding breaks SPF but DKIM survives
* Whether old systems need cleanup
* Whether unknown senders are abusing the domain

## Step 5: Move toward enforcement

Once legitimate mail passes and aligns, you can tighten DMARC.

Typical path:

```txt
p=none
p=quarantine
p=reject
```

You can also use percentage rollout:

```txt
p=quarantine; pct=25
p=quarantine; pct=50
p=quarantine; pct=100
p=reject; pct=25
```

Do not jump straight to reject because someone on the internet said it is best practice. It is a good destination when your mail is ready. It is a bad first click when you have not inventoried senders.

## Step 6: Protect lookalike and unused domains

If you own domains that do not send mail, publish records that say so.

For a domain that sends no mail, SPF can be:

```txt
v=spf1 -all
```

DMARC can be:

```txt
v=DMARC1; p=reject
```

Only do this when you are sure the domain does not send mail.

Unused domains are easy spoofing targets because nobody watches them.

## Validation drills: prove email auth works

### Drill 1: DNS record check

Use your DNS provider or a trusted checker to confirm SPF, DKIM, and DMARC records exist.

Expected result:

```txt
One SPF record exists, DKIM records exist for configured senders, and DMARC is published.
```

### Drill 2: Send from primary email

Send a message to a mailbox you control and inspect headers.

Expected result:

```txt
SPF passes or DKIM passes, and DMARC passes.
```

### Drill 3: Send from each service

Send test messages from newsletter, website, support, or transaction systems.

Expected result:

```txt
Every legitimate sender passes DMARC or has a documented fix.
```

### Drill 4: Report review

Review DMARC aggregate reports after a few days.

Expected result:

```txt
Legitimate mail sources are known, and unknown sources are investigated.
```

## SPF DKIM DMARC checklist

```txt
Email Authentication Checklist

Inventory
[ ] Domain email provider listed
[ ] Newsletter sender listed
[ ] Website or app sender listed
[ ] Transactional sender listed
[ ] Old senders reviewed

SPF
[ ] Only one SPF record exists
[ ] Current senders included
[ ] Old includes removed
[ ] Record does not use +all
[ ] Lookup count checked

DKIM
[ ] Primary email DKIM enabled
[ ] Newsletter DKIM enabled if used
[ ] Transactional DKIM enabled if used
[ ] Selectors recorded
[ ] Test messages pass DKIM

DMARC
[ ] DMARC record published
[ ] Monitoring mailbox or service configured
[ ] Reports reviewed
[ ] Legitimate failures fixed
[ ] Enforcement plan documented

Validation
[ ] Primary email test passes
[ ] Each sender test passes
[ ] Unused domains protected where appropriate
```

## Final thought

Email authentication is not glamorous, but it is one of those controls that pays rent quietly.

It will not stop every phishing email. It will not make people immune to scams. It will not fix a compromised mailbox.

But it does help answer an important question:

```txt
Should this system be allowed to send mail as my domain?
```

That question is worth answering before someone else answers it for you.
