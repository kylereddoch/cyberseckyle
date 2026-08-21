---
layout: newsletter-issue
permalink: /newsletter/defenders-dispatch/issue-002/2026-08-14/
title: A Green Checkmark Is Not the Finish Line
seoTitle: "Defender’s Dispatch Issue 002: A Green Checkmark Is Not the Finish Line"
description: Exploited CVEs, Google Workspace changes, a practical alert test, and RipFoundry for Windows.
searchIntent: Read The Defender’s Dispatch Issue 002 and its practical cybersecurity, IT, and MSP checks.
issueNumber: "002"
issueDateLabel: August 14, 2026
date: 2026-08-14T18:07:09-05:00
emailSubject: "[Issue 002] Defender’s Dispatch: A Green Checkmark Is Not the Finish Line"
emailPreview: Exploited CVEs, Google Workspace changes, a practical alert test, and RipFoundry for Windows.
trackingPath: /newsletter/defenders-dispatch/issue-002
closingNote: That’s all for this week. Use the section that matches the work in front of you, and keep the verification step attached to the change.
highlights:
  - Confirmed exploitation
  - Google Workspace changes
  - One practical alert test
  - RipFoundry for Windows
---

<p class="dispatch-eyebrow">From Kyle’s desk</p>

## Different changes need different checks

This issue has three different kinds of work in it. The security queue has confirmed exploitation. The service desk has Google Workspace changes users will notice. The project side has a Windows media workflow built around staging and verification. They do not belong in one urgency bucket.

What connects them is the handoff from change to proof. A patch needs a running version. A SaaS rollout needs a useful user note and a check for automations that depend on old paths. A file copy needs more than a successful command. The newsletter should help with all of that: what changed, who it affects, and the next useful check. Security Signal Weekly stays focused on the exploited items. The rest of the issue steps into administration, service delivery, and practical habits worth borrowing.

---

<p class="dispatch-eyebrow dispatch-eyebrow--blue">Security Signal Weekly</p>

## Security signals and next steps

Three confirmed exploitation signals that belong ahead of the routine August queue.

### 01 · Windows AFD.sys zero-day can turn a foothold into SYSTEM

**What happened:** Microsoft fixed CVE-2026-68820 in the August 11 Windows updates. The AFD.sys use-after-free requires a locally authenticated attacker to win a race condition with a crafted application, but successful exploitation grants SYSTEM privileges. CISA added the flaw to KEV the same day.

**Why it matters:** This is a second-stage bug. A limited foothold can become credential access, security-tool tampering, or lateral movement once the attacker reaches SYSTEM.

**What to check next:** Deploy the applicable August cumulative update to supported Windows endpoints and servers, confirm the running build after reboot, and investigate suspicious service creation or security-control changes after low-privilege activity. Check [Microsoft’s advisory](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-68820) and the [CISA KEV entry](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-68820).

### 02 · Cisco ASA and FTD VPN services are being forced into reloads

Cisco confirmed active exploitation of CVE-2026-20349, a flaw in the Remote Access SSL VPN service that lets an unauthenticated attacker send a crafted HTTP request and repeatedly reload an affected ASA or FTD device. Cisco lists no workaround. Use the [release-specific hotfix table](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-vpn-dos-dzv4mQFF), back up the configuration, confirm an out-of-band recovery path, and review uptime and crash data for unexplained reloads.

### 03 · Metabase SQL injection puts connected data in the incident scope

CVE-2026-72898 gives an unauthenticated remote attacker a path to arbitrary SQL in the Metabase application database and administrator access to the instance. Fixed releases are x.58.24, x.59.21, x.60.17, x.61.11, x.62.9, and x.63.5. Upgrade internet-accessible systems first, then review administrators, API activity, configuration changes, and database queries. Rotate stored database credentials if compromise is suspected. Read the [Metabase advisory](https://github.com/metabase/metabase/security/advisories/GHSA-vwf4-m7j8-wcjf).

[Read the complete Friday brief →](/blog/security-signal-weekly-august-8-14-2026/)

---

<p class="dispatch-eyebrow dispatch-eyebrow--green">Operations</p>

## The IT and MSP desk

Two Google Workspace changes that may show up as user questions or broken assumptions.

### Gmail now warns BCC recipients before Reply All

Gmail now shows a confirmation warning when someone who was BCC’d tries to reply to everyone on the thread. The feature is available by default, applies across Workspace and personal accounts, and has no admin switch. This is a small privacy safeguard, but it will also create a new prompt users may ask about. Let the service desk know the warning is expected and is meant to stop a BCC recipient from revealing their presence accidentally. Read the [Google Workspace announcement](https://workspaceupdates.googleblog.com/2026/07/prevent-accidental-disclosures-with-new-Reply-All-BCC-warnings-in-Gmail.html).

### Google Meet changed where meeting artifacts live

Google Meet now places notes, transcripts, and recordings in a “Google Meet” folder in the host’s My Drive, with subfolders for individual meetings. Attendees with access receive shortcuts in their own Meet folders, and the old “Meet Recordings” folder becomes “Legacy Meet Recordings.” Audit scripts, backup jobs, retention workflows, or help documents that depend on the old folder name or ID. Then tell users where their files moved before the tickets arrive. Review [Google’s rollout details](https://workspaceupdates.googleblog.com/2026/07/google-meet-now-organizes-your-meeting-notes-transcripts-and-recordings-in-your-Google-Drive.html).

### Patch and exploit watch: vCenter and SharePoint

After the three KEV entries, check whether vCenter or on-premises SharePoint belongs in your environment. Broadcom’s VMSA-2026-0006.1 fixes a vCenter authentication bypass and a network-reachable code-execution path with no workaround. SharePoint needs the applicable July and August updates to break the CVE-2026-55040 and CVE-2026-63520 chain. Use [Broadcom’s response matrix](https://support.broadcom.com/web/ecx/support-content-notification/-/external/content/SecurityAdvisories/0/38017), [Rapid7’s SharePoint research](https://www.rapid7.com/blog/post/ve-cve-2026-55040-microsoft-sharepoint-jwt-token-authentication-bypass-fixed/), and [Microsoft’s August entry](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-63520) to match fixes to the products actually installed.

---

<p class="dispatch-eyebrow dispatch-eyebrow--yellow">Rotating field notes</p>

## Two field notes for this week

Small checks that turn patch status and alerting into evidence.

### From the service desk: write the user note before the ticket closes

For every visible SaaS change, add a short user note to the rollout ticket. State what will look different, whether the user needs to do anything, and the first place support should check when it does not behave as expected. The Gmail warning and Google Meet folder change are both good candidates. A two-minute note now can prevent several vague “something changed” tickets later.

### Small win of the week: test one alert from event to owner

Create one safe test event and follow it all the way through collection, parsing, detection, notification, and the first response check. Confirm the user or device identifier and timestamp survived the trip. If the alert fires but nobody receives it—or the response depends on tribal knowledge—the detection is not finished.

---

<p class="dispatch-eyebrow">Worth your time</p>

## [Windows Release Health](https://learn.microsoft.com/en-us/windows/release-health/)

Microsoft’s release-health pages put known issues, affected platforms, safeguards, mitigations, and resolution status in one place. Check them before treating a wave of similar update tickets as unrelated endpoint failures. The same data is available through the Windows Updates API in Microsoft Graph if you want release-health information inside an internal dashboard or support workflow.

<p class="dispatch-eyebrow dispatch-eyebrow--blue">From CybersecKyle</p>

## [I Brought RipFoundry to Windows](/blog/i-brought-ripfoundry-to-windows/)

RipFoundry for Windows keeps the expensive DVD work on the PC attached to the optical drive instead of turning the Jellyfin server into an encoding workspace. It preserves the original MakeMKV remux, validates media before transfer, copies to a temporary destination name, and compares SHA-256 hashes before the file becomes final. It is a media project, but the operating rule travels well: do the risky work in staging and verify the handoff before declaring success.
