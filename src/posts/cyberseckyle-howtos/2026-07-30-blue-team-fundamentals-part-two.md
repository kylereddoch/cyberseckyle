---
date: 2026-07-30T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Blue Team Fundamentals, Part 2 - macOS Baseline with Profiles and Audit Basics'
seoTitle: macOS Security Baseline with Profiles and Audits
description: 'A practical macOS blue-team baseline covering FileVault, firewall, Gatekeeper, software updates, privacy permissions, configuration profiles, audit basics, and validation checks.'
searchIntent: Help defenders and power users build a practical macOS workstation baseline with FileVault, profiles, privacy controls, firewall settings, updates, and audit checks.
featuredImage: /assets/images/ghostty-terminal.png
featuredImageAlt: Terminal window on a workstation representing macOS command-line audit checks and baseline review.
featuredImageCaption: macOS has strong defaults, but defaults still need ownership.
tags: [cyberseckyle-howto-series, cybersecurity, security, macos, endpoint-security, security-operations, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, macOS, BlueTeam, CybersecKyleHowTo]
---

> I am back with Season 4, Part 2 of the Blue Team Fundamentals track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we are building a macOS baseline with FileVault, updates, privacy controls, profiles, and a few audit habits that make the machine easier to trust.

macOS security conversations get weird fast.

Some people act like Macs are magically safe. Other people treat every Mac like it needs to become a locked lab appliance.

The practical truth is calmer.

macOS has strong built-in security layers, but those layers still need ownership. Updates need to happen. FileVault needs to be confirmed. Privacy permissions need review. Admin access needs restraint. Profiles need to be understood. Logs need to answer basic questions.

That is the baseline.

## What you are building

By the end of this guide, you should have:

* macOS updates enabled and checked
* FileVault confirmed
* Firewall decision documented
* Gatekeeper and XProtect assumptions understood
* Privacy permissions reviewed
* Local admins reviewed
* Configuration profiles inventoried
* Basic audit commands tested

This is defender-level macOS hygiene without pretending every home Mac is a managed enterprise fleet.

## Step 1: Confirm updates and security responses

Go to:

```txt
System Settings -> General -> Software Update
```

Enable automatic checks and security updates where appropriate. Install available updates, restart, and check again.

For managed environments, document how updates are enforced. For personal or small-team machines, make sure "I will click later forever" is not the update policy.

## Step 2: Confirm FileVault

Go to:

```txt
System Settings -> Privacy & Security -> FileVault
```

FileVault should be on for laptops and any Mac that holds sensitive data.

Then confirm recovery:

```bash
fdesetup status
```

Do not stop at "FileVault is on." Know where the recovery key or recovery method lives. Encryption without recovery planning is a locked door you might someday be on the wrong side of.

## Step 3: Review firewall and sharing

Go to:

```txt
System Settings -> Network -> Firewall
System Settings -> General -> Sharing
```

Turn on the firewall unless you have a documented reason not to. Review sharing services:

* File Sharing
* Screen Sharing
* Remote Login
* Remote Management
* Bluetooth Sharing
* Media Sharing
* Printer Sharing

For each enabled service, write down why it is enabled.

If nobody knows, turn it off and see what complains.

## Step 4: Review privacy permissions

Go to:

```txt
System Settings -> Privacy & Security
```

Review:

* Location Services
* Contacts
* Calendars
* Photos
* Bluetooth
* Microphone
* Camera
* Accessibility
* Full Disk Access
* Files and Folders
* Screen & System Audio Recording
* Developer Tools

Accessibility, Full Disk Access, and screen recording deserve extra attention. Those are powerful permissions. Old apps should not keep them forever because they once needed help.

Remove access that no longer has a current purpose.

## Step 5: Inventory profiles and management

Configuration profiles can enforce settings, install certificates, configure VPN, manage restrictions, and connect a Mac to MDM.

Check:

```txt
System Settings -> General -> Device Management
```

Or:

```bash
profiles list
```

For each profile:

```txt
Profile name:
Installed by:
Purpose:
Managed by:
Removable:
Still needed:
```

If this is a personal Mac and you find an unexpected management profile, investigate immediately. If this is a work Mac, do not remove management profiles without authorization. Ownership matters.

## Step 6: Review users and admin access

Go to:

```txt
System Settings -> Users & Groups
```

List admins:

```bash
dscl . -read /Groups/admin GroupMembership
```

Remove stale admin access. Use standard accounts where practical. For managed fleets, document who gets admin rights and how temporary elevation works.

Admin prompts should mean something.

## Step 7: Run basic audit checks

These commands are not a full audit, but they help you inspect reality.

```bash
sw_vers
fdesetup status
profiles list
systemextensionsctl list
launchctl print-disabled system
```

Also review login items:

```txt
System Settings -> General -> Login Items & Extensions
```

The point is not to memorize commands. The point is to learn what normal looks like on your Mac so weird stands out later.

## Validation drills: prove the baseline works

### Drill 1: FileVault check

Run:

```bash
fdesetup status
```

Expected result:

```txt
FileVault is on, and recovery is understood.
```

### Drill 2: Permission review

Remove one stale permission from Accessibility, Full Disk Access, or Screen Recording.

Expected result:

```txt
Only current trusted apps keep powerful permissions.
```

### Drill 3: Profile inventory

List profiles and identify each one.

Expected result:

```txt
Every profile is expected, owned, and understood.
```

### Drill 4: Sharing check

Disable one unneeded sharing service.

Expected result:

```txt
The Mac exposes fewer services without breaking normal use.
```

## macOS baseline checklist

```txt
macOS Baseline Checklist

Foundation
[ ] macOS updated
[ ] Automatic security updates reviewed
[ ] FileVault enabled
[ ] Recovery method confirmed
[ ] Backup configured
[ ] Restore tested

Network and sharing
[ ] Firewall enabled or decision documented
[ ] Sharing services reviewed
[ ] Remote Login reviewed
[ ] Screen Sharing reviewed

Privacy and apps
[ ] Location permissions reviewed
[ ] Camera and microphone permissions reviewed
[ ] Accessibility permissions reviewed
[ ] Full Disk Access reviewed
[ ] Screen recording permissions reviewed
[ ] Login items reviewed

Management and audit
[ ] Profiles listed
[ ] Unknown profiles investigated
[ ] Admin users reviewed
[ ] System extensions reviewed
[ ] Baseline notes saved
```

## Final thought

macOS security is strongest when you respect both sides of the truth.

The platform gives you solid built-in protections. You still have to manage updates, encryption, permissions, users, profiles, and recovery.

Defaults are a starting point.

Ownership is the baseline.
