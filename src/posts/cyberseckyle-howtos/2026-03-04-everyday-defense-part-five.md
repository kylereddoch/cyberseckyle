---
date: 2026-03-04T15:00:00-05:00
title: "CybersecKyle Security How-To Series: Everyday Defense Part 5 - Scam Spotting, The 60-Second Pause Protocol"
description: "A one-minute routine that breaks urgency scams, forces verification, and keeps your accounts, money, and time where they belong."
tags: [cyberseckyle-howto-series, everyday-defense, cybersecurity, tutorials, security, scams, phishing]
mastodon_url:
---

> I’m back with **Part 5** of the **Everyday Defense** track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). Here’s what we’re going to cover: the pressure patterns scammers lean on, the exact one-minute routine to follow, and the safest ways to verify messages without using an attacker’s links or phone numbers.

{% image "/assets/images/hero-series-everyday-defense-60s-pause.png", "A warm desk scene with a phone showing an urgent warning, a one-minute timer, and a notebook labeled “Pause Protocol” beside a coffee mug in soft lamplight, landscape.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Most [scams](https://consumer.ftc.gov/scams) do not win because they are clever. They win because they are fast.

In my MSP and security work, the [painful pattern is always the same](/blog/protecting-your-enterprise-from-employee-actions-on-network-devices/): the moment someone feels rushed, they stop verifying. The scammer is not trying to outsmart you. They are trying to outpace you.

So here’s the simplest countermeasure I know: a deliberate 60-second pause. One minute is long enough to break the spell, short enough that you will actually do it, and irritating enough that scammers hate it.

If you want a solid baseline on how phishing actually works (and why the “urgent” wording is such a giveaway), the FTC’s overview is worth a skim: [How to Recognize and Avoid Phishing Scams](https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams).

## What scams are really selling

Scams usually push one (or more) of these buttons:

- **Urgency:** “Right now or else.”
- **Authority:** “IT, your bank, your boss, the IRS.”
- **Fear:** “Suspicious login, account locked, lawsuit.”
- **Opportunity:** “Refund, prize, job offer, limited deal.”
- **Secrecy:** “Do not tell anyone, handle this quietly.”

Your goal is not to memorize every scam flavor of the week. Your goal is to recognize the pressure pattern and slow the situation down.

## The 60-Second Pause Protocol

Set a literal timer. Seriously. Your brain treats a timer like a tiny contract.

### 0 to 10 seconds: Stop the momentum

Hands off keyboard. No clicking. No replying. No “quick question” back to the sender.

Take one breath and say (out loud if you can): **“I do not act while rushed.”**

### 10 to 20 seconds: Name the request

Write the request in plain language:

- “They want me to reset my password.”
- “They want me to pay an invoice.”
- “They want me to install remote support.”
- “They want a code from my authenticator.”

If you cannot describe it simply, that is a red flag by itself.

### 20 to 35 seconds: Check for pressure tells

Scan for: urgency, threats, secrecy, weird stakes, gift cards, crypto, odd formatting, or an emotional hook.

Also scan the channel mismatch:

- A bank texting you from a random number
- A “boss” asking for gift cards over SMS
- “IT support” contacting you from a personal email address

### 35 to 50 seconds: Verify on a clean path

This is the whole game.

Do not use the link or phone number they provided. Use a known-good source:

- [Type the real website yourself](/blog/cyberseckyle-security-how-to-series-everyday-defense-part-3-browser-hygiene-that-actually-sticks/) (or use a bookmark you already trust)
- Call the number on the back of the card
- Use your company directory, ticketing portal, or an internal Teams/Slack message
- If it is a coworker, call them back using a saved contact, not the message thread

If you need a rule: **[verify using a different channel than the one that contacted you](https://www.ncsc.gov.uk/guidance/phishing)**.

If you want a short, practical checklist you can hand to someone who is currently stressed and mid-click, CISA’s guidance is excellent: [Avoiding Social Engineering and Phishing Attacks](https://www.cisa.gov/ncas/tips/st04-014).

### 50 to 60 seconds: Decide and document

Pick one:

- **Proceed** (verified)
- **Delay** (“I will handle this after I verify”)
- **Delete/report** (unverified or suspicious)

If this is work-related, drop a quick note in the ticket or in your team channel: what happened, what you verified, what you did. That tiny paper trail saves you later.

## Common scam patterns and the safest move

<table>
  <thead>
    <tr>
      <th>Pattern</th>
      <th>What it looks like</th>
      <th>Safest response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Pattern">Account panic</td>
      <td data-label="What it looks like">“Unusual login. Reset now.”</td>
      <td data-label="Safest response">Open the real site/app yourself, check security alerts, and only change credentials from the official settings. For Gmail users, follow: <a href="https://support.google.com/mail/answer/8253?hl=en">Avoid and report phishing emails (Google Account Help)</a>.</td>
    </tr>
    <tr>
      <td data-label="Pattern">Payment pressure</td>
      <td data-label="What it looks like">“Wire this today” or “new banking details”</td>
      <td data-label="Safest response">Out-of-band callback to a known number, require a second approver for bank detail changes, and never “confirm” payment details from the same thread.</td>
    </tr>
    <tr>
      <td data-label="Pattern">Tech support trap</td>
      <td data-label="What it looks like">“We found a virus, install this tool”</td>
      <td data-label="Safest response">Hang up or close it. Contact official support or internal IT using known contacts. If you need a quick refresher on the signs, use the FTC overview: <a href="https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams">How to Recognize and Avoid Phishing Scams (FTC)</a>. For call and pop-up style scams, Apple’s guidance is also solid: <a href="https://support.apple.com/en-us/102568">Recognize and avoid phishing messages, calls, and other scams (Apple Support)</a>.</td>
    </tr>
    <tr>
      <td data-label="Pattern">MFA fatigue</td>
      <td data-label="What it looks like">Repeated push prompts, then a “support” call</td>
      <td data-label="Safest response">Deny prompts, change the password, review recent sign-ins, and report it. If you can, enable number matching to reduce blind approvals: <a href="https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-mfa-number-match">Microsoft Entra multifactor authentication number matching</a>.</td>
    </tr>
    <tr>
      <td data-label="Pattern">“Just need a code”</td>
      <td data-label="What it looks like">Someone asks for OTP, MFA code, or password reset code</td>
      <td data-label="Safest response">Never share it. Treat codes like toothbrushes: not transferable, not discussable.</td>
    </tr>
  </tbody>
</table>

## Tiny scripts you can actually use

These work because they are calm, boring, and final.

**For a “boss” text that feels off:**
> “I can help, but I’m going to verify first. I’ll call you back in a minute.”

**For a bank or vendor message:**
> “I don’t take action from links in messages. I’m contacting support using verified contact info.”

**For “IT support” that came out of nowhere:**
> “I’m not installing anything from an unsolicited request. Please open a ticket and I’ll respond through the portal.”

Scammers want you flustered. These lines keep you annoyingly stable.

## How teams can bake this in (so it is not just willpower)

If you manage people or process (even informally), a few defaults reduce risk fast:

- **Two-person approval** for wire transfers and vendor bank-detail changes
- **Callback rule**: verify payment changes using a saved number, not the email thread
- **No “quick favors” over SMS** for money, access, credentials, or gift cards
- **Ticket-only IT work**: if it is real, it can live in the system
- **Phishing-resistant sign-in options** where it matters most (admins, finance, execs), because SMS codes are a soft target

If you want a single takeaway: **build friction for high-impact actions.** Friction is not the enemy. Surprise friction is.

## Quick reality check

The 60-second pause does not make you paranoid. It makes you consistent.

Real organizations can handle verification. Real coworkers can wait one minute. Real support teams do not need your password, your MFA code, or your panic.

If you spot a scam or you think you got burned, **[report it](https://www.ic3.gov/)**.

Scams thrive in the gap between “I should verify” and “I already clicked.” This protocol closes that gap with a timer and a habit.

Season 1 is [Everyday Defense](/tags/everyday-defense/) for a reason: boring, repeatable, and effective beats flashy every time.