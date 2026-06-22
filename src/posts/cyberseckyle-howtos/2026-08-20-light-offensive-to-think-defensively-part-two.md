---
date: 2026-08-20T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Light Offensive to Think Defensively, Part 2 - Phishing Simulation to Study Prompts and Controls'
seoTitle: Phishing Simulation to Study Prompts and Controls
description: 'A safe, defensive phishing simulation guide focused on studying prompts, consent, reporting, MFA, email controls, and user support without tricking real people or collecting real credentials.'
searchIntent: Help defenders and small teams run a safe phishing simulation for learning and control validation without harvesting real credentials or shaming users.
featuredImage: /assets/images/help-desk-attack.png
featuredImageAlt: Help desk and social engineering themed image representing phishing prompts, reporting, and identity controls.
featuredImageCaption: The point of phishing simulation should be better controls, not gotcha moments.
tags: [cyberseckyle-howto-series, cybersecurity, security, social-engineering, identity-security, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, Phishing, IdentitySecurity, CybersecKyleHowTo]
---

> I am back with Season 5, Part 2 of the Light Offensive to Think Defensively track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we are using a phishing simulation to study prompts and controls, not to embarrass people or collect real credentials.

Phishing simulations can be useful.

They can also be mean, lazy, and useless.

If the goal is to trick people and shame them, you are not building security. You are building resentment. The better goal is to understand where prompts fail, where reporting works, where MFA helps, where email controls catch the message, and where users need a better path.

This guide is defensive and controlled.

No real credentials. No surprise humiliation. No testing people without authorization. No sending fake emergencies to people who did not agree to the exercise.

## What you are building

By the end of this guide, you should have:

* A written simulation purpose
* Permission and scope
* A safe landing page that does not collect passwords
* A reporting path
* Email control checks
* MFA and sign-in prompt observations
* A debrief focused on controls, not shame

For a personal lab, this can be entirely self-contained. For a workplace, get approval.

## The tools that make this useful

You can run a phishing simulation with a commercial platform, but for a lab or small internal exercise, these are the kinds of tools and controls worth understanding:

* **GoPhish** for building a controlled campaign and tracking safe clicks
* **MailHog** or a test mailbox for capturing messages in a lab without sending to real people
* **Canarytokens** for safe detection-style links or documents, when approved
* **Microsoft Report Message** or equivalent report-phishing buttons for real user reporting
* **Security admin portals** for Microsoft 365, Google Workspace, or your email provider
* **MXToolbox**, provider dashboards, or header analyzers for SPF, DKIM, and DMARC checks

The goal is not to become a phishing operator. The goal is to learn how the message travels, which controls inspect it, what users see, and what defenders receive when someone reports it.

## Step 1: Define the purpose

Pick one learning goal.

Examples:

* Can users identify a suspicious login prompt?
* Does the report-phishing button work?
* Do email controls flag obvious impersonation?
* Does MFA stop password-only compromise?
* Are people trained to verify payment or gift-card requests out of band?
* Does the help desk know how to respond?

Write:

```txt
Purpose:
Audience:
Approval:
Allowed senders:
Landing page:
Data collected:
What will not be collected:
Debrief plan:
```

The "what will not be collected" line matters.

Do not collect real passwords.

## Step 2: Build a lab-only simulation with GoPhish

If you use GoPhish, keep it scoped and boring.

For a lab:

1. Install GoPhish on a local VM.
2. Create one fake recipient, such as `alex@example.test`.
3. Use a local mail catcher or a test mailbox you control.
4. Build a landing page that explains the exercise.
5. Disable or avoid credential capture.
6. Send only to the fake recipient first.

The useful fields to document:

```txt
Campaign name:
Sending profile:
Landing page:
Recipient group:
What is tracked:
What is not tracked:
Report path:
Debrief link:
```

For a real small-team exercise, do not skip approval. A phishing simulation is still a social engineering exercise, even when the intent is defensive.

## Step 3: Keep the landing page safe

If you use a landing page, make it educational.

It can record:

* Visit count
* Timestamp
* Test campaign ID
* Generic browser information if needed

It should not collect:

* Real passwords
* MFA codes
* Sensitive personal information
* Payment data
* Anything you would regret storing

The page should explain the simulation after the click and provide a calm teaching moment.

Do not build a fake login page that harvests credentials. That is not needed for this learning goal.

## Step 4: Inspect the email headers

After sending a test message, inspect the headers.

Look for:

```txt
SPF:
DKIM:
DMARC:
Return-Path:
From:
Reply-To:
Received:
Message-ID:
```

You are trying to learn whether the message authenticated correctly, where it traveled, and whether the visible sender matches the infrastructure that sent it.

This connects directly back to the Season 3 guide on [email security with SPF, DKIM, and DMARC](/blog/cyberseckyle-security-how-to-series-power-user-and-small-team-part-2-email-security-with-spf-dkim-and-dmarc/). Phishing defense is not just user training. It is also mail authentication, filtering, reporting, and response.

## Step 5: Design the message around the lesson

A good simulation prompt should be realistic enough to teach, not cruel enough to traumatize.

Avoid:

* Fake layoffs
* Fake medical emergencies
* Fake legal threats
* Fake personal crises
* Financial panic with no support plan

Use safer examples:

* Shared document request
* Password expiration notice
* Invoice review prompt
* Shipping update
* Calendar invite
* Security notification

Include clues you want people to notice:

* Sender mismatch
* Odd domain
* Urgent language
* Unexpected attachment
* Link text mismatch
* Request for credentials
* Request to bypass normal process

## Step 6: Test controls, not just clicks

Track defensive questions:

* Did SPF, DKIM, and DMARC behave as expected?
* Did the message land in inbox, spam, or quarantine?
* Did link protection rewrite or warn?
* Did endpoint/browser protection warn?
* Did users report the message?
* Did help desk or mailbox rules catch it?
* Did MFA block account abuse in a related sign-in test?

Clicks are only one signal.

If ten people click but the report button is invisible, training alone is not the fix. If nobody reports because they do not know where to report, that is a process problem. If the email gateway misses an obvious spoof, that is a control problem.

## Step 7: Validate the report path

This is the part I care about most.

Send the test message to yourself and use the normal report path:

* Report Message add-in
* Report phishing button
* Forward as attachment to a security mailbox
* Help desk ticket
* Dedicated abuse or security address

Then confirm:

```txt
Who received it:
What metadata arrived:
Whether headers were preserved:
Whether a ticket or alert was created:
Who is responsible for triage:
```

If a user reports a real phish and nobody sees it, the reporting button is just decoration.

## Step 8: Debrief without shame

The debrief should answer:

* What was the scenario?
* What clues mattered?
* What controls helped?
* What controls failed?
* How should people report next time?
* What will be improved?

Do not publish a leaderboard of who clicked.

That teaches people to fear security, not practice it.

## Validation drills: prove the simulation is safe

### Drill 1: No credential collection

Review the landing page and forms.

Expected result:

```txt
No real passwords, MFA codes, or sensitive information can be submitted.
```

### Drill 2: Scope check

Read the approved audience and sender list.

Expected result:

```txt
The simulation only reaches people and systems in scope.
```

### Drill 3: Reporting path test

Send a test message to yourself and report it through the intended path.

Expected result:

```txt
The report reaches the right mailbox, tool, or person.
```

### Drill 4: Debrief review

Read the debrief before sending.

Expected result:

```txt
The debrief teaches without shaming.
```

## Phishing simulation checklist

```txt
Phishing Simulation Checklist

Scope
[ ] Purpose defined
[ ] Approval obtained
[ ] Audience listed
[ ] Sender/domain approved
[ ] Out-of-scope groups excluded

Safety
[ ] No real credentials collected
[ ] No MFA codes collected
[ ] No sensitive personal data collected
[ ] Landing page educational
[ ] Data retention decided

Controls
[ ] Email authentication checked
[ ] Gateway behavior observed
[ ] Link protection observed
[ ] Reporting path tested
[ ] MFA lesson included where appropriate
[ ] Email headers reviewed
[ ] Triage owner confirmed

Debrief
[ ] Clues explained
[ ] Reporting instructions included
[ ] Control improvements listed
[ ] No shame-based reporting
[ ] Follow-up tasks assigned
```

## Final thought

A phishing simulation should make the whole system better.

People are part of that system, but they are not the only control and they should not be treated like the weakest link for sport.

Study prompts. Test reporting. Validate MFA. Improve email controls. Teach calmly.

The point is not to catch people.

The point is to make the next real phish less likely to work.
