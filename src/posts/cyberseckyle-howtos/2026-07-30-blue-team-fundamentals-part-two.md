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
mastodon_url: "https://infosec.exchange/@cyberseckyle/117009856276790918"
mastodon_tags: [Cybersecurity, InfoSec, macOS, BlueTeam, CybersecKyleHowTo]
publishedAt: "2026-07-30T16:25:15.164Z"
---

> Part 2 of the Blue Team Fundamentals track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) applies the same evidence-first baseline to macOS: updates, encryption, network exposure, powerful permissions, management, and recovery.

The platform already includes Gatekeeper, XProtect, System Integrity Protection, signed system volumes on current macOS releases, privacy controls, and hardware-backed protections on supported Macs. A baseline does not replace those layers or claim they make the machine immune. It establishes whether the controls that require an owner—FileVault recovery, update behavior, firewall policy, local administrators, profiles, extensions, and backups—are in the expected state.

Personal Macs and managed Macs need different administration. Do not remove a work profile, endpoint extension, certificate, or management component because its purpose is unfamiliar. Identify the owner and policy first.

## Capture a dated state

Record the hardware, operating system, owner, management status, and recovery dependencies:

```txt
Mac model and serial reference:
macOS version and build:
Device owner:
Managed or personal:
FileVault state and recovery-key custodian:
Firewall state:
Local administrators:
Configuration profiles:
System and network extensions:
Backup method and last restore:
```

These commands provide useful evidence without changing settings:

```bash
sw_vers
fdesetup status
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
profiles status -type enrollment
system_profiler SPConfigurationProfileDataType
systemextensionsctl list
dscl . -read /Groups/admin GroupMembership
```

Some output can be lengthy or require elevated access. Save only what is needed, and protect the inventory because it names users, management systems, installed controls, and recovery posture.

## Verify updates and FileVault recovery

Review **System Settings → General → Software Update** and make sure the update policy covers both normal operating-system releases and security responses. A managed environment should document the enforcement and deferral window. A personal machine needs a regular installation habit, not an automatic-download setting followed by months of postponed restarts.

After updating and restarting, run `sw_vers` again and open the applications that matter. The version record should reflect the device after the change, not the version you intended to install.

FileVault should be enabled on a laptop and any Mac that stores sensitive data. `fdesetup status` confirms the local state, but the operational question is whether an authorized person can recover the volume. On a personal Mac, verify the chosen account or protected recovery-key location. On a managed Mac, verify that the personal recovery key is escrowed and retrievable through the device-management service according to policy. Apple's [FileVault deployment overview](https://support.apple.com/en-euro/guide/deployment/dep82064ec40/web) explains the relationship between FileVault, user credentials, and volume protection on current Mac hardware.

Do not paste a recovery key into a general ticket or baseline document. Record the custodian and retrieval test instead.

## Review listening services before firewall exceptions

Turn on the application firewall unless the environment has a documented alternative. Apple's [firewall management reference](https://support.apple.com/guide/deployment/firewall-payload-settings-dep8d306275f/1/web/1.0) shows that managed policy can control the firewall, incoming application rules, stealth mode, and logging; the exact options available depend on the macOS version and management service.

Then review **System Settings → General → Sharing**. File Sharing, Screen Sharing, Remote Login, Remote Management, Media Sharing, Printer Sharing, and content caching all create service exposure. For every enabled service, capture the business or personal need, allowed users, expected networks, and owner.

Do not disable an unknown work service to see who complains. On a managed Mac, find the responsible profile or administrator. On a personal Mac, disable an unneeded service deliberately and verify that normal work continues.

The firewall is not a reason to leave unnecessary listeners enabled. Removing the service reduces exposure and future maintenance; allowing it through the firewall preserves both.

## Audit privacy permissions as high-trust access

Under **System Settings → Privacy & Security**, review Camera, Microphone, Screen & System Audio Recording, Accessibility, Full Disk Access, Files and Folders, Location Services, Bluetooth, Contacts, and Calendars.

Accessibility, Full Disk Access, and screen recording deserve individual justification because they can expose input, files, or visible activity far beyond one document. Record the application, publisher, owner, reason, and review date. Remove permission from an application that is gone or no longer needs the function, then test the workflow that once depended on it.

An application appearing in a privacy list does not necessarily mean it currently has access; read the current toggle and management state. Some entries are controlled by a profile and cannot be changed by the user, which is evidence to trace back to device management rather than a setting to fight locally.

## Account for profiles, extensions, and login persistence

Configuration profiles can install certificates, configure network access, enforce restrictions, approve extensions, and connect the Mac to device management. Compare **System Settings → General → Device Management** with `profiles status -type enrollment` and `system_profiler SPConfigurationProfileDataType`.

For each profile, record:

```txt
Identifier and display name:
Source or management service:
Payload purpose:
Expected device scope:
Removal authority:
Owner:
```

Also review **System Settings → General → Login Items & Extensions** and the output of `systemextensionsctl list`. System extensions from endpoint security, VPN, content filtering, or storage products may be legitimate and necessary, but abandoned extensions and background items should not remain trusted indefinitely.

Finally, compare the local administrator group with the approved access list. A standard daily account can reduce accidental system-wide changes, but demoting users on a managed FileVault Mac requires planning around Secure Token, volume ownership, and support. Make that change through the management process, not as a one-line hardening trick.

## Keep the validation record

```txt
[ ] macOS version and update policy are recorded
[ ] FileVault is active and authorized recovery has been verified
[ ] Current backup can restore a test file
[ ] Firewall state matches the documented policy
[ ] Every enabled Sharing service has a current purpose and owner
[ ] Accessibility, Full Disk Access, and screen-recording grants are justified
[ ] Enrollment and configuration profiles are expected
[ ] System extensions and login items have been reviewed
[ ] Local administrators match the approved list
[ ] A removed permission or service was tested against normal work
[ ] Exceptions and next review date are stored with the baseline
```

The baseline is useful when a later review can identify drift: a new administrator, a profile that arrived from an unexpected source, a backup that stopped completing, or a powerful permission that outlived the application that requested it. The green status in System Settings is only the current view; the dated record makes change visible.
