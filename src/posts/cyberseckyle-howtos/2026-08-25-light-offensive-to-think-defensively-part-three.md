---
date: 2026-08-25T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Light Offensive to Think Defensively, Part 3 - Recon and Password Attack Theory Inside the Lab'
seoTitle: Recon and Password Attack Theory Inside the Lab
description: 'A defensive, lab-only guide to understanding reconnaissance and password attack theory: map exposed information, study credential risks, test lockout controls safely, and turn findings into fixes.'
searchIntent: Help learners understand reconnaissance and password attack concepts safely inside an owned lab so they can improve defenses without targeting real systems.
featuredImage: /assets/images/network-ports.jpg
featuredImageAlt: Network ports and service mapping themed image representing lab reconnaissance and exposure review.
featuredImageCaption: Learning the shape of an attack helps you close the doors it depends on.
tags: [cyberseckyle-howto-series, cybersecurity, security, passwords, identity-security, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, Passwords, IdentitySecurity, CybersecKyleHowTo]
x_post: true
x_url:
---

> Part 3 of the Light Offensive to Think Defensively track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) examines what a lab target reveals before authentication and how its identity controls respond to a small, authorized set of failed sign-ins.

This exercise stays inside the isolated lab from Part 1. The target, users, passwords, logs, and test traffic must all be yours. Do not transfer the commands or test cases to public services, workplace systems, or accounts that were not included in written authorization.

The defender's question is not, "How many passwords can this machine guess?" It is, "Which exposed facts make account abuse easier, which control slows it down, and which event tells us it happened?"

## Establish a fake identity set

Create a few fictional users whose roles make the authorization boundary obvious:

```txt
alex.admin@example.test
sam.billing@example.test
jordan.support@example.test
taylor.reader@example.test
```

Give the lab different control states: one disabled account, one normal user, one administrator with MFA if the target supports it, and one account used to observe throttling. Use generated fake passwords that do not resemble your real patterns. Never import a breach corpus or real username list into this exercise.

Record the expected state before testing:

```txt
Account enabled:
Role:
MFA or passkey required:
Failed-attempt policy:
User notification:
Administrator alert:
Relevant log source:
```

## Map only the lab target

Confirm the isolated target address from the lab inventory, then compare it with the baseline from Part 1:

```bash
nmap -sV --script http-title,http-headers -oA recon-web 192.168.56.20
```

The example address must be replaced with the target VM. The two named scripts retrieve ordinary page-title and header information; they are not permission to scan another network.

Review the output for open ports, service names, version banners, page titles, and unexpected listeners. Follow with ordinary requests to the lab web service:

```bash
curl -I http://192.168.56.20:3000/
curl -sS http://192.168.56.20:3000/robots.txt
```

The `robots.txt` file is a crawler instruction, not an access-control list. A path named there remains public if the web server serves it.

For every observation, write the defensive consequence:

```txt
Observation: Development server listens on every interface
Consequence: A bridged or misconfigured VM could expose it beyond the lab
Change: Bind to loopback or the isolated lab address and restrict the host firewall
Validation: Repeat the scan from the lab and from the real network boundary
```

A version banner is not automatically a vulnerability, and hiding a banner does not patch the software. It can still reveal unnecessary implementation detail, but version and configuration must be verified before treating it as a finding.

## Compare authentication responses without harvesting credentials

Use the browser developer tools, OWASP ZAP, or Burp Suite Community as a local proxy while signing in to the lab application with fake accounts. Capture the request and response for:

- A valid username with a wrong fake password
- A nonexistent username
- A disabled fake account
- A password-reset request for an existing and nonexistent fake address

Compare status codes, response body, redirects, headers, and obvious timing differences. A generic message in the page is not enough if the HTTP status or response shape still reveals which account exists. The [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) recommends generic authentication and recovery responses and explains how response discrepancies enable account enumeration.

The fix is not always to make every internal event identical. The application can record a precise reason for defenders while returning a consistent public response to the requester. Test both sides: the user-facing behavior should avoid unnecessary disclosure, and the audit log should retain enough identity and outcome detail to investigate abuse.

## Separate online guessing from offline password exposure

Online password attacks interact with the real authentication service and can be slowed by rate limits, lockouts, MFA, device checks, and detection. Offline attacks begin after an attacker obtains password hashes and are constrained by the password strength and how the verifier salted and hashed them, not by the website's login limit.

That distinction changes the lab work. Do not run a high-volume guessing tool against the application. Use a small manual sequence with the designated fake account to observe:

```txt
Number and timing of allowed failures
Whether delay increases
Whether the account is temporarily locked
Whether another source can continue attempts
What the user sees
What the administrator sees
How recovery works
```

Stop when the documented threshold is reached. Confirm that the control does not make it trivial for anyone to permanently deny service to another user.

For offline theory, generate a tiny set of toy passwords and hashes that exist only in the lab. The lesson is the relative effect of predictable versus long, randomly generated values and the importance of the application's storage method. Do not copy production hashes, real passwords, or breach data. [NIST's current password guidance](https://pages.nist.gov/800-63-4/sp800-63b/passwords/) emphasizes length, blocklists for common or compromised choices, secure hashed storage, and rate limiting instead of arbitrary composition rules.

Password policy is only part of the defense. Unique password-manager-generated credentials limit credential stuffing, while MFA or passkeys reduce what a stolen password can accomplish. Passwords themselves are not phishing-resistant.

## Correlate the activity with defender evidence

Place the scan, web requests, failed sign-ins, lockout, successful login, and control changes on one timeline. Check whether the target records:

```txt
Timestamp and timezone
Account identifier without recording the password
Success or failure outcome
Source address or session context
MFA result
Lockout or throttling action
Administrator or recovery change
```

Do not log submitted passwords, reset tokens, MFA codes, or session secrets. Logging a secret turns the detection layer into another credential store.

Finish with a short before-and-after record:

```txt
[ ] Only the authorized lab target was scanned
[ ] Unexpected listeners and public metadata were reviewed
[ ] Existing and nonexistent accounts return consistent public responses
[ ] Failed-attempt behavior was tested at low volume with a fake account
[ ] MFA or passkeys protect the lab administrator where supported
[ ] Authentication events are visible without storing secrets
[ ] Each observation has a control owner and a repeatable validation step
```

The exercise has done its job when the exposed service is smaller, the public authentication response leaks less, password-only access has less authority, and the failed attempts leave evidence a defender can recognize.
