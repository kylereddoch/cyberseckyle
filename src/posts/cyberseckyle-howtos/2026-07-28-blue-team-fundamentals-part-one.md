---
date: 2026-07-28T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Blue Team Fundamentals, Part 1 - Windows Workstation Baseline with Defender and ASR Rules'
seoTitle: Windows Workstation Baseline with Defender and ASR
description: 'A practical blue-team Windows workstation baseline using Microsoft Defender, firewall, BitLocker, SmartScreen, controlled folder access decisions, Attack Surface Reduction rules, and validation checks.'
searchIntent: Help defenders and power users build a practical Windows workstation security baseline with Microsoft Defender, BitLocker, firewall settings, ASR rules, and validation steps.
featuredImage: /assets/images/soc-windows-logs.png
featuredImageAlt: Windows security logs on a workstation representing endpoint baseline validation.
featuredImageCaption: A Windows baseline should make risky behavior harder without turning support into a bonfire.
tags: [cyberseckyle-howto-series, cybersecurity, security, windows, endpoint-security, security-operations, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, Windows, Defender, BlueTeam, CybersecKyleHowTo]
---

> I am back with Season 4, Part 1 of the Blue Team Fundamentals track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we are building a Windows workstation baseline with Microsoft Defender, BitLocker, firewall settings, and Attack Surface Reduction rules that you test before you brag about.

Windows security has a reputation problem because people treat it like two extremes.

Either they leave defaults alone forever, or they paste an enterprise hardening script into a machine they still need to use tomorrow.

Neither is the goal.

A good workstation baseline should reduce common attack paths, make risky behavior harder, preserve recovery, and remain supportable. If nobody can explain the setting or reverse the change, it is not a baseline. It is a future ticket.

This guide moves beyond the Season 2 personal device baseline and into defender territory. We are still staying practical, but the bar is higher now.

## What you are building

By the end of this guide, you should have:

* BitLocker or Device Encryption confirmed
* Microsoft Defender Antivirus healthy
* Defender Firewall enabled
* SmartScreen and reputation protection reviewed
* Attack Surface Reduction rules planned and tested
* Controlled Folder Access decision documented
* Local admin sprawl reviewed
* A validation checklist you can repeat

Treat this as a starter baseline you can understand, not a full CIS benchmark.

## Step 1: Confirm the boring foundation

Before ASR rules or fancy dashboards, check the foundation.

```txt
Windows version:
Patch status:
Device encryption:
Recovery key location:
Defender AV status:
Firewall status:
Primary user admin or standard:
Backup method:
Last restore test:
```

If the device is unpatched, unencrypted, unbacked up, and used daily as local admin, do not start with advanced controls. Fix the floor first.

## Step 2: Check Windows Security health

Open:

```txt
Windows Security
```

Review:

* Virus & threat protection
* Firewall & network protection
* App & browser control
* Device security
* Protection history

You want no unexplained red or yellow warnings.

Defender should be active, current, and able to run a quick scan. If a third-party product is installed, make sure you know which tool is responsible for antivirus and what Defender mode is in.

Security tools that nobody understands are not comforting. They are fog.

## Step 3: Turn on the firewall for every profile

Defender Firewall should be on for:

* Domain
* Private
* Public

Public should be the default for untrusted networks. Private should be reserved for networks you actually trust.

Review inbound rules. Remove old app rules, especially for tools you no longer use.

Be careful with one-click fixes that say "disable firewall." If an app needs access, understand the port, profile, and source before allowing it broadly.

## Step 4: Review SmartScreen and reputation protection

Open:

```txt
Windows Security -> App & browser control -> Reputation-based protection
```

Review:

* Check apps and files
* SmartScreen for Microsoft Edge
* Phishing protection
* Potentially unwanted app blocking
* SmartScreen for Microsoft Store apps

For most workstations, these should be on.

You will not stop every bad thing with these controls, but you can add speed bumps where users are most likely to run untrusted downloads, fake installers, and sketchy utilities.

## Step 5: Plan ASR rules before enforcing them

Attack Surface Reduction rules can block common Office, script, credential theft, and malware behaviors.

They are powerful. They can also break real workflows.

Start in audit mode when possible. Watch what would be blocked. Then move rules to block mode deliberately.

Common ASR areas include:

* Blocking Office from creating child processes
* Blocking executable content from email and webmail
* Blocking credential stealing from LSASS
* Blocking JavaScript or VBScript from launching downloaded executables
* Blocking process creations from PSExec and WMI
* Blocking abuse of vulnerable signed drivers

Do not blindly enable every rule across every machine on a Friday afternoon unless you want to learn new vocabulary from coworkers.

## Step 6: Decide on Controlled Folder Access

Controlled Folder Access can reduce ransomware impact by limiting which apps can modify protected folders.

It can also block legitimate apps until you allow them.

My approach:

1. Test on one machine.
2. Protect common folders first.
3. Review blocks.
4. Allow known-good apps deliberately.
5. Document the decision.

If you cannot monitor or troubleshoot the blocks, consider leaving it as a later hardening step.

## Step 7: Reduce local admin access

Local admin access turns small mistakes into bigger ones.

Review:

```txt
Computer Management -> Local Users and Groups -> Groups -> Administrators
```

Or use PowerShell:

```powershell
Get-LocalGroupMember Administrators
```

Remove stale accounts. Use standard accounts for daily work where practical. If admin access is needed, make it deliberate.

For small teams, consider a local admin password solution or managed approach instead of one shared admin password everywhere.

## Validation drills: prove the baseline works

### Drill 1: Defender health check

Open Windows Security and run a quick scan.

Expected result:

```txt
Defender reports healthy protection and completes the scan.
```

### Drill 2: Firewall profile check

Confirm firewall is enabled for domain, private, and public profiles.

Expected result:

```txt
All profiles are protected, and exceptions are understood.
```

### Drill 3: Encryption check

Run:

```powershell
manage-bde -status
```

Expected result:

```txt
The operating system drive is encrypted and the recovery key is available.
```

### Drill 4: ASR audit review

Enable selected rules in audit mode and review events or reporting.

Expected result:

```txt
You know what would be blocked before enforcing.
```

## Windows baseline checklist

```txt
Windows Workstation Baseline Checklist

Foundation
[ ] Windows updated
[ ] BitLocker or Device Encryption enabled
[ ] Recovery key stored safely
[ ] Backup configured
[ ] Restore tested

Defender
[ ] Defender Antivirus healthy
[ ] Protection updates current
[ ] Quick scan completed
[ ] Protection history reviewed
[ ] Tamper protection reviewed

Firewall and reputation
[ ] Firewall enabled for all profiles
[ ] Inbound rules reviewed
[ ] SmartScreen enabled
[ ] Potentially unwanted app blocking enabled
[ ] Phishing protection reviewed

Hardening
[ ] Local admins reviewed
[ ] ASR rules selected
[ ] ASR audit mode tested
[ ] Controlled Folder Access decision documented
[ ] Exceptions documented

Validation
[ ] Health checks recorded
[ ] User workflow tested
[ ] Rollback notes captured
```

## Final thought

A Windows baseline is not a pile of settings. It is a set of decisions you can defend.

Patch it. Encrypt it. Back it up. Keep Defender healthy. Leave the firewall on. Add ASR rules carefully. Reduce admin access.

Then test the machine like someone still has to use it tomorrow.

That gap is the difference between hardening and creating a support incident with a security label on it.
