---
date: 2026-02-09T09:30:00-05:00
title: "Don’t Do This: How I Accidentally Simulated Attacker Cleanup"
description: "I accidentally triggered the classic “attacker covering tracks” signal across our fleet. Here’s why that matters, what you lose, and the safer alternatives."
tags: [cybersecurity, windows, soc, MSP, incident-response]
mastodon_url: null
---

{% image "/assets/images/soc-windows-logs.png", "Laptop on a dark desk showing a log viewer, with blurred security dashboards and a red warning icon glowing on monitors in the background.", "(Image generated with ChatGPT)", "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

At **1:15 a.m. on 2/8**, my phone lit up like it was auditioning for a disaster movie.

Our SOC was calling in full panic mode: “Something is clearing activity on endpoints. We’re seeing logs getting wiped.”

My brain did the normal triage routine: compromise? lateral movement? attacker cleanup?

Then the other half of my brain remembered what I did the Thursday before.

I had built a weekly “endpoint maintenance” automation in our RMM. Basic hygiene stuff: temp file cleanup, time drift checks, general maintenance. I scheduled it to run at **1:00 a.m. on 2/8** so nobody would notice.

Except I had also included a script step that clears Windows Event Logs. 😖

So yeah. Everybody noticed.

## Why clearing event logs instantly looks like an attack

Security teams freak out about log clearing because attackers love it too. In fact, “Clear Windows Event Logs” is literally a named technique in the attacker playbook: [MITRE ATT&CK T1070.001](https://attack.mitre.org/techniques/T1070/001/).

Windows even helpfully records “the audit log was cleared” as **Security Event ID 1102**, which exists specifically because this is suspicious behavior ([Microsoft’s Event 1102 documentation](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-1102)). For other channels, clearing often shows up as Event ID **104** (Microsoft calls out both IDs in their write-up on clear events in Windows logging: [104 and 1102 overview](https://techcommunity.microsoft.com/blog/windows-itpro-blog/new-security-capabilities-in-event-tracing-for-windows/3949941)).

So from the SOC’s point of view, the story was simple:

- Many endpoints
- Around the same time
- “Logs cleared” signals lighting up everywhere

That pattern looks a lot like coordinated attacker cleanup. Which is why my “maintenance task” got treated like a live incident. Fair.

## The real damage is not the alert, it’s the missing history

The “log cleared” event is basically the security equivalent of a sticky note that says:  
“Someone cleaned the whiteboard.”

Cool. But what was on the whiteboard?

Clearing logs destroys the easiest timeline you have during an incident: what happened, when it happened, and what else was happening on that system around that time. NIST’s log management guidance is blunt about why logs matter for investigations, detection, and accountability ([NIST SP 800-92: Guide to Computer Security Log Management](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-92.pdf)).

When you clear logs at scale, you create gaps that hurt in a few very practical ways:

- **You break incident timelines.** No timeline means longer investigations and more guessing.
- **You reduce detection quality.** Detections often depend on “what happened before this alert.”
- **You lose context for containment.** If you can’t see how something started, you can’t be confident it won’t restart.
- **You make “normal vs weird” harder.** Baselines rely on history.

If your org centralizes logs into a SIEM, you might still have a copy. If you do not, clearing local logs can be the difference between “we can prove what happened” and “we have vibes and a hunch.”

## Compliance gets cranky because logs are not just for security

Even if you ignore the security angle, a lot of compliance frameworks treat audit logging as a non-negotiable control.

Two examples that show up constantly in the real world:

- **HIPAA** expects mechanisms that “record and examine activity” in systems handling ePHI ([45 CFR 164.312(b) Audit Controls](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312)).
- **PCI DSS 4.0** is explicit about retention: keep audit log history **at least 12 months**, with **three months immediately available** ([PCI DSS v4.0 SAQ D Merchant, Requirement 10.5.1](https://listings.pcisecuritystandards.org/documents/PCI-DSS-v4-0-SAQ-D-Merchant.pdf)).

Even when a standard does not say “thou shalt keep Windows Event Logs forever,” it usually requires you to maintain audit trails long enough for investigations, legal needs, and audits. That general principle is baked into audit record retention controls like [NIST 800-53 AU-11](https://csf.tools/reference/nist-sp-800-53/r5/au/au-11/).

So if you wipe logs without a retention strategy, you are not “doing maintenance.” You are quietly deleting evidence your auditors assume exists.

## What I should have done instead

If your goal is “endpoints should not run out of log space,” clearing is the bluntest instrument possible.

Better options look like boring operational maturity, which is exactly what you want here.

### 1) Keep logs, manage retention

Tune log sizes and retention so you do not hit tiny defaults and lose data at the worst time. Central guidance on logging emphasizes retention decisions should be intentional, risk-based, and tested (see [CISA’s pointer to event logging best practices](https://www.cisa.gov/resources-tools/resources/best-practices-event-logging-and-threat-detection) and the underlying baseline guide PDF from ASD/ACSC partners: [Best practices for event logging and threat detection](https://www.cyber.gov.au/sites/default/files/2024-08/best-practices-for-event-logging-and-threat-detection.pdf)).

### 2) Archive or export, don’t wipe

Windows literally ships tools for exporting and archiving logs. If you must “clean up,” export first.

The built-in `wevtutil` utility supports exporting logs, archiving, and yes, clearing ([Microsoft documentation for wevtutil](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil)). The key is: use the export capability, not the clear button, unless you have a very specific, documented reason.

### 3) Centralize logs so endpoints aren’t the single source of truth

If the endpoint is the only place logs exist, you are one script mistake away from losing your entire investigative record. Central collection (SIEM, log management, Windows Event Forwarding, etc.) removes that single point of failure.

If you want a Windows-native option, Windows Event Collector and Event Forwarding exist for exactly this kind of pipeline ([Windows Event Collector overview](https://learn.microsoft.com/en-us/windows/win32/wec/windows-event-collector)).

### 4) Treat “log clear” as a controlled, audited action

If a system truly needs logs cleared (rare, but it happens), it should be:

- documented,
- approved,
- scoped,
- and communicated to the SOC ahead of time.

Because otherwise your SOC will do their job and assume it is hostile. Which is what they did at 1:15 a.m.

## What I changed after the incident

The fix was immediate and slightly humiliating:

- I disabled the task, removed log clearing entirely, and pushed an update.
- I messaged the SOC with the root cause and the time window so they could close the loop cleanly.
- I started rebuilding the maintenance workflow into two buckets:
  - **safe hygiene** (temp cleanup, disk checks, time drift verification, etc.)
  - **security-sensitive actions** (anything involving logs, auditing, security tools), which now requires review

It also kicked off a bigger internal conversation: are we retaining logs long enough, in the right places, in a way that supports investigations and whatever compliance obligations our clients have?

That conversation is worth having before the next 1:15 a.m. call.

## The checklist I wish I had followed

- Never clear Windows logs as “routine maintenance.” Assume it will be treated like attacker behavior ([MITRE T1070.001](https://attack.mitre.org/techniques/T1070/001/)).
- If retention is the concern, tune retention and storage, and test it.
- Export or archive logs if you must reduce local footprint ([wevtutil supports export and archive](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil)).
- Centralize log collection so endpoints are not the only copy ([Windows Event Collector](https://learn.microsoft.com/en-us/windows/win32/wec/windows-event-collector)).
- Communicate with the SOC before any action that will generate “log cleared” events ([Event 1102 behavior](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-1102)).
- Sanity-check automation with a pilot group first, especially anything that touches evidence.

Clearing logs felt like harmless housekeeping when I added it to the script. In practice, it is closer to showing up at a crime scene with a mop.

My SOC was right to panic.

I just wish they hadn’t been right at 1:15 a.m.