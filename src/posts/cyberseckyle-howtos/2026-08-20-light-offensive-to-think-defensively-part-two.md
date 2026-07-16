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

> Part 2 of the Light Offensive to Think Defensively track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) uses a controlled message to test email authentication, filtering, reporting, and response without collecting a real credential or turning coworkers into targets.

A click rate by itself says very little. A recipient may recognize the exercise after opening the message, a gateway may rewrite the link, an automated scanner may visit it, or the reporting button may be too hard to find. The more useful questions are whether the message was authenticated and filtered as expected, whether the report preserved the headers, whether anybody received that report, and whether a stolen password would still be enough to reach the account.

Keep the first exercise inside the lab from Part 1. A workplace campaign requires written authorization, a defined audience, privacy and labor review where applicable, help-desk coordination, and an approved communication plan. Defensive intent does not remove the need for consent and authority.

## Define the lesson and the data boundary

Choose one learning objective:

```txt
Can a user find and use the report-phishing control?
Do reports reach a monitored queue with original headers?
Does the mail system identify a sender-domain mismatch?
Does the help desk follow the documented triage path?
Would MFA or a passkey stop password-only access?
```

Then write the campaign boundary:

```txt
Owner and written approval:
Recipients and excluded groups:
Sending system and domain:
Message theme:
Landing page:
Fields collected:
Fields explicitly not collected:
Retention and deletion date:
Who can see individual results:
Stop condition:
Debrief and support path:
```

Do not collect passwords, MFA codes, recovery answers, payment data, or personal information. Avoid fake medical news, layoffs, legal threats, family emergencies, or other scenarios that create harm unrelated to the control being tested.

## Build the first message in a closed mail path

GoPhish can organize templates, landing pages, groups, and campaign events. A lab mail catcher such as MailHog can receive the message without sending it to a real mailbox. Create one fictional recipient under a reserved test domain, such as `alex@example.test`, and keep both the sender and receiver inside the lab.

The landing page should explain the exercise and provide the lesson. GoPhish landing pages can be configured to capture submitted data, so review the page and campaign settings carefully and leave credential capture disabled. The project's [landing-page documentation](https://docs.getgophish.com/user-guide/documentation/landing-pages) describes those options; do not copy or import a real sign-in page when a plain educational page will test the same report and click path.

Use a unique campaign identifier rather than personal data. A safe event record may contain:

```txt
Campaign ID
Fictional recipient ID
Sent, delivered, reported, or landing-page visit event
Timestamp
```

Even a visit can reveal an IP address and browser details, so collect only fields needed for the stated objective and delete them on schedule.

## Inspect how the message was handled

Read the raw headers from the received test message:

```txt
From
Reply-To
Return-Path
Received
Authentication-Results
Message-ID
```

Identify the visible sender, envelope sender, systems that relayed the message, and the SPF, DKIM, and DMARC results. Part 2 of the Power User track explains [how those three controls align a message with the visible domain](/blog/cyberseckyle-security-how-to-series-power-user-and-small-team-part-2-email-security-with-spf-dkim-and-dmarc/).

In a real approved environment, compare delivery to the expected mail policy. Did the gateway quarantine it, add a banner, rewrite the link, or deliver it normally? Preserve the reason from the provider rather than grading the result only as inbox or spam. A well-authenticated test message may legitimately pass checks designed to identify spoofing; that does not mean the gateway endorses the content.

## Design the prompt around a control

Use a routine scenario that supports the learning objective: a shared document, calendar invitation, password-expiration notice, invoice review, or shipping update. Include a small number of deliberate clues such as a mismatched sender domain, unexpected attachment, link target that differs from its label, request to bypass a normal process, or request for a password.

Document each clue and the control expected to respond:

```txt
Clue: Visible sender and actual domain differ
User action: Inspect the sender and report the message
Technical control: Impersonation or domain policy
Response control: Report arrives with headers and opens a triage task
```

This keeps the exercise from becoming an arbitrary trick. If the organization taught users to trust an exact banner or button that the simulation omits, the result may measure inconsistent design rather than user judgment.

## Test the reporting path end to end

Use the same path people are expected to use for a real message: the provider's report-phishing button, forwarding as an attachment to a monitored security mailbox, or a help-desk workflow.

Verify:

```txt
Who received the report
Whether original headers and message content survived
Whether a ticket or alert was created
Which person owns first review
What that person checks
How the sender, link, or attachment would be contained
How the reporter receives feedback
```

A button that deletes the message locally but sends nothing to a reviewed queue is not a reporting control. A queue without an owner is not much better.

If the exercise includes authentication, use a separate lab identity and a fake password known only to the exercise. Do not ask a participant to enter an actual password. Observe whether MFA, passkeys, device conditions, and sign-in alerts would interrupt password-only access without attempting to defeat them.

## Debrief the system, not the individual

Report what each layer showed:

- Message authentication and gateway handling
- Visibility and quality of the user prompt
- Reporting-path delivery and preserved evidence
- Help-desk or security response time
- Identity controls that limit password-only compromise
- Changes assigned to an owner

Do not publish a leaderboard or treat a click as proof that somebody is careless. Automated systems, accessibility needs, job context, and prompt design all affect the result. Individual data should be visible only to the people named in the approved plan and retained only as long as that plan requires.

The exercise is ready to close when no real secret could have been submitted, every event stayed inside the authorized scope, the report reached a person who could act, and the debrief produced a change to the prompt, mail control, report path, identity policy, or response procedure.
