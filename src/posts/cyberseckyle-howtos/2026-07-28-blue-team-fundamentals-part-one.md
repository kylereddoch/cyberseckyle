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

> Part 1 of the Blue Team Fundamentals track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) moves from personal-device hygiene to a Windows baseline that can be measured, piloted, and supported.

Hardening a workstation is not a contest to enable the largest number of settings. A control earns its place when it closes a relevant attack path, produces evidence that it is working, and does not break the work the device exists to perform. That last requirement is why copying an enterprise script onto one production laptop is a poor baseline method.

Use a test device or a small pilot group first. Record the current state, the desired setting, how it will be deployed, the event or status that proves it worked, and the rollback. Microsoft changes names and management paths across Windows editions and management products; build around the control and evidence rather than one screenshot.

## Record the foundation before adding hardening

Capture these facts for each workstation:

```txt
Windows edition and version:
Last successful update:
Device owner:
Daily account type:
Microsoft Defender Antivirus state:
Firewall profile state:
BitLocker or Device Encryption state:
Recovery key custody:
Backup and last restore test:
Management method:
```

PowerShell can provide a useful starting record:

```powershell
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber
Get-MpComputerStatus
Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction
Get-BitLockerVolume
Get-LocalGroupMember -Group Administrators
```

Some commands require an elevated session, and some properties vary by Windows edition. Save the relevant output with a date instead of pasting it into a ticket without review; security status can expose device and account details.

Resolve missing updates, failed protection updates, absent backups, unknown local administrators, and missing recovery keys before experimenting with ASR. Advanced rules do not compensate for an unpatched or unrecoverable device.

## Establish the built-in protection state

In Windows Security, review Virus & threat protection, Firewall & network protection, App & browser control, Device security, and Protection history. Determine whether Microsoft Defender Antivirus is active, passive because another antivirus product is responsible, or disabled unexpectedly. A dashboard that says two products are installed is not proof that either one is healthy.

Keep real-time and cloud-delivered protection enabled where the environment supports them, protect the settings from casual changes, and make sure protection intelligence updates. Run a quick scan as a functional check, then verify the result in Protection history or management reporting.

The firewall should be enabled for Domain, Private, and Public profiles. Treat unfamiliar networks as Public, and review inbound allow rules for applications that are gone or rules scoped to every profile when only one was needed. If an application requires inbound access, document the program or port, source scope, profile, owner, and removal condition. "The app would not work" is the beginning of that investigation, not the final rule description.

Under App & browser control, review reputation-based protection, SmartScreen, phishing protection, and potentially unwanted app blocking. These controls add reputation and origin checks around common download and credential-entry paths. They do not justify ignoring a warning or running an unknown installer after another browser downloads it successfully.

## Deploy ASR rules as a controlled change

Attack Surface Reduction rules target behaviors commonly used by malicious documents, scripts, credential theft, lateral movement, and vulnerable drivers. They are behavior controls, so legitimate administration and automation can collide with them.

Build the deployment in this order:

1. Inventory Office macros, line-of-business scripts, software deployment tools, remote administration, developer workflows, and accessibility software.
2. Select rules that address the actual software and attack paths on the pilot devices.
3. Apply the selected rules in Audit mode.
4. Review audit events for long enough to include normal work, updates, and maintenance.
5. Investigate each proposed exclusion and scope it to the smallest rule, file, path, or certificate boundary the management method supports.
6. Move one rule or coherent group to Warn or Block, validate user workflows, and expand gradually.

Microsoft's [ASR deployment guidance](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-deployment-plan) explicitly centers planning and testing, and its [Event Viewer reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-windows-events) identifies the Windows Defender Operational log and the events produced in audit and enforcement modes.

An exclusion is a security decision, not a fix for inconvenient telemetry. Record which rule it affects, the application owner, the evidence that the file is legitimate, and a review date. Broad path exclusions can create a place where the blocked behavior is allowed again.

## Make a separate decision about Controlled Folder Access

Controlled Folder Access limits untrusted applications' ability to change protected folders. It can reduce the reach of ransomware, but applications that legitimately write to those folders may need review or an allow decision.

Pilot it in Audit mode, include the folders that hold valuable user or team data, and test backup, sync, creative, development, and document workflows. Review the corresponding Defender Operational events before enforcement. [Microsoft describes Controlled Folder Access](https://learn.microsoft.com/en-us/defender-business/mdb-asr) as allowing trusted applications to access protected folders; it does not replace tested backups or recovery.

If the small team cannot see or respond to blocks, document that limitation rather than claiming the control is deployed. A postponed control with an owner is safer than an enforced control everyone learns to disable.

## Reduce permanent administrator access

Compare the local Administrators group with the account inventory from Season 3. Remove stale users and unexplained service accounts. Use a standard account for routine work where practical and a separate, named administrative path for elevation.

Small teams should not reuse one local administrator password across every workstation. Use a managed local password solution such as Windows LAPS when the environment supports it, or another process that provides unique credentials, controlled retrieval, and rotation. Keep recovery access from becoming a second unmanaged shared password.

## Validate the baseline as a user and a defender

```txt
[ ] Windows and protection intelligence are current
[ ] Defender Antivirus state and responsible security product are known
[ ] A quick scan completes and its result is visible
[ ] Domain, Private, and Public firewall profiles are enabled
[ ] Inbound exceptions have an owner and narrow scope
[ ] BitLocker or Device Encryption is active and recovery is available
[ ] Local Administrators membership matches the approved list
[ ] Selected ASR rules produced audit evidence during normal work
[ ] Enforced rules were tested against business and support workflows
[ ] Controlled Folder Access has a tested decision, not an assumed setting
[ ] Backup restoration succeeds after the hardening change
[ ] Deployment and rollback notes are stored with the baseline
```

The artifact to keep is the dated baseline and its exceptions, not a screenshot of green icons. A repeatable check can show when the workstation drifts, why an exception exists, and whether a future Windows or application update changed the impact of a rule.
