---
date: 2026-06-08T11:04:43-05:00
title: 'CybersecKyle Security How-To Series: Home Network and Devices, Part 2 - Windows 11 and macOS Baselines You Can Live With'
seoTitle: Practical Windows 11 and macOS Security Baselines
description: 'A practical Windows 11 and macOS security baseline you can keep turned on: updates, encryption, built-in protections, firewalls, safer accounts, trusted apps, backups, and quick validation drills.'
searchIntent: Help home users and power users secure Windows 11 and macOS with practical built-in controls that meaningfully reduce risk without making their computers miserable to use.
featuredImage: /assets/images/workspace-laptop.jpg
featuredImageAlt: Laptop workspace representing practical Windows and macOS security baseline work.
featuredImageCaption: A useful computer security baseline should survive contact with daily life.
tags: [cyberseckyle-howto-series, cybersecurity, security, windows, macos, endpoint-security, home-networking, how-to]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116715367400299830"
mastodon_tags: [Cybersecurity, InfoSec, Windows, macOS, EndpointSecurity, CybersecKyleHowTo]
---

> I’m back with Season 2, Part 2 of the Home Network and Devices track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we’re building practical Windows 11 and macOS security baselines: strong enough to stop common problems, calm enough to leave turned on, and simple enough to validate when you are done.

Computer hardening advice has a bad habit of becoming unusable.

Someone starts with a reasonable goal like “make this laptop safer,” then ends up with a 200-page benchmark, twelve warning prompts, broken software, and a user who clicks **Allow** on everything because security has become background noise.

That is not the goal here.

The goal is a computer that stays updated, protects its data when lost or stolen, blocks obvious garbage, limits unnecessary access, and gives you a realistic path back when something goes wrong.

You do not need to turn your personal laptop into a locked-down enterprise workstation. You also should not trust factory defaults forever just because the computer feels new.

You need a baseline you can live with.

## What you are defending against

This guide is focused on the problems most likely to ruin a normal week:

* A stolen or lost laptop exposes your files
* Malware arrives through a sketchy download or fake installer
* An old app or operating system vulnerability gets exploited
* Someone gains more access because you use an administrator account for everything
* Ransomware or hardware failure takes out your local files
* A forgotten sharing feature exposes more than you intended
* Security tools were installed, disabled, or ignored so long ago that nobody knows what is actually protecting the computer

This is not the guide for building a full business security standard. The roadmap already has separate Blue Team guides planned for a [Windows workstation baseline with Defender and ASR rules](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) and a macOS baseline with profiles and audit basics.

This one is for the computers people actually use at home, for side projects, and in small environments where the settings still need to make sense six months later.

## The baseline in 30 minutes

If you do nothing else, do these and stop:

1. Install current operating system and app updates.
2. Confirm disk encryption is on and store the recovery key somewhere safe.
3. Keep the built-in firewall and malware protections enabled.
4. Use a strong login password, PIN, or passkey-backed account with biometrics for convenience.
5. Require sign-in after sleep and learn the keyboard shortcut to lock the computer.
6. Remove software you do not use and stop bypassing app security warnings casually.
7. Review sharing, remote access, and startup items.
8. Make sure important files have a real backup, then restore one file.
9. Turn on the platform’s lost-device feature if the privacy tradeoff makes sense for you.
10. Run the validation drills at the end of this guide.

That baseline is not flashy. It is also more useful than installing five security products and forgetting why they are there.

## Before you touch anything

Do not start by flipping every switch you can find.

First, collect a little context:

```txt
Computer name:
Operating system and version:
Computer make/model:
Primary user account:
Primary account is admin or standard:
Disk encryption status:
Encryption recovery key stored in:
Firewall status:
Malware protection provider:
Automatic update status:
Backup method:
Last successful restore test:
Remote access or sharing features intentionally used:
```

Do not put passwords or recovery keys in this note unless it is stored inside a password manager or another protected vault.

Also finish a backup before making major account, encryption, or security-tool changes. Most of this guide is low risk, but recovery planning should come before confidence.

## One baseline, two operating systems

Windows 11 and macOS do not secure themselves in exactly the same way, but the outcome we want is nearly identical.

<div class="table-wrapper" markdown="1">

<table>
  <thead>
    <tr>
      <th>Security job</th>
      <th>Windows 11</th>
      <th>macOS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Security job">Protect data at rest</td>
      <td data-label="Windows 11">Device Encryption or BitLocker</td>
      <td data-label="macOS">FileVault</td>
    </tr>
    <tr>
      <td data-label="Security job">Block unwanted network access</td>
      <td data-label="Windows 11">Microsoft Defender Firewall</td>
      <td data-label="macOS">Application firewall</td>
    </tr>
    <tr>
      <td data-label="Security job">Reduce malware risk</td>
      <td data-label="Windows 11">Microsoft Defender Antivirus, SmartScreen, reputation-based protection</td>
      <td data-label="macOS">Gatekeeper, notarization, and XProtect</td>
    </tr>
    <tr>
      <td data-label="Security job">Recover from loss or theft</td>
      <td data-label="Windows 11">Find My Device with a Microsoft account</td>
      <td data-label="macOS">Find My Mac and Activation Lock on supported hardware</td>
    </tr>
    <tr>
      <td data-label="Security job">Recover files</td>
      <td data-label="Windows 11">A tested cloud, external-drive, or dedicated backup</td>
      <td data-label="macOS">Time Machine plus an offsite or protected copy</td>
    </tr>
  </tbody>
</table>

</div>

The names are different. The jobs are not.

## Step 1: Update the operating system and the apps

Start with updates because old vulnerabilities do not become safer with age.

### Windows 11

Go to:

```txt
Settings -> Windows Update
```

Install available updates, restart when needed, and check again after the restart. Windows uses monthly security updates, annual feature updates, Microsoft Store updates, and driver updates to keep the operating system current. Microsoft’s [Windows 11 update guidance](https://support.microsoft.com/en-us/windows/delivering-continuous-innovation-in-windows-11-b0aa0a27-ea9a-4365-9224-cb155e517f12) makes the practical requirement pretty simple: install updates and restart when prompted.

Also open the Microsoft Store, go to **Library**, and update installed apps.

For normal home users, I would leave automatic Windows updates on. Pausing an update briefly because you are traveling or finishing important work is reasonable. Treating the pause button like a permanent security strategy is not.

One important 2026 note: normal Windows 10 support ended on **October 14, 2025**. If a computer is still on Windows 10 without a supported update path or an Extended Security Updates plan, the baseline problem is now the operating system itself.

### macOS

Go to:

```txt
System Settings -> General -> Software Update
```

Click the information button beside **Automatic Updates** and enable the options that install macOS updates and security responses or system files. Apple says [keeping macOS current](https://support.apple.com/guide/mac-help/mchlpx1065/mac) ensures the computer receives current features and security updates, and its background security improvements can arrive separately from full operating system updates.

Then update App Store apps and check important third-party apps that manage their own updates.

I do not recommend running beta operating systems on the computer you depend on unless you have a specific reason and a recovery plan. “Newest” and “safest daily driver” are not always the same thing.

## Step 2: Turn on disk encryption and protect the recovery key

Disk encryption protects your data when someone has the physical computer but cannot sign in.

It does not protect you after you unlock the computer. It does not stop malware running inside your account. It does make a lost or stolen laptop much less likely to become a lost or stolen pile of readable files.

### Windows 11: Device Encryption or BitLocker

Go to:

```txt
Settings -> Privacy & security -> Device encryption
```

If your computer supports Device Encryption, turn it on. Microsoft explains that [Device Encryption uses BitLocker technology](https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df) and is available on a wider range of computers than the full BitLocker management interface.

Some Windows 11 devices enable encryption automatically when set up with a Microsoft account or work or school account. Do not assume that happened. Check.

Then confirm where the recovery key is stored. If it is attached to your Microsoft account, verify you can reach it from another device. If you keep another copy, store it somewhere protected and separate from the laptop.

Do not leave the only recovery-key copy in a text file on the encrypted drive. That is security theater with excellent comedic timing.

### macOS: FileVault

Go to:

```txt
System Settings -> Privacy & Security -> FileVault
```

Turn on FileVault and choose a recovery method you understand. Apple’s [FileVault guidance](https://support.apple.com/guide/mac-help/mh11785/mac) is very clear about the tradeoff: FileVault protects access to your data, but if you forget the login password and lose the recovery method, your files may be gone permanently.

Modern Macs with Apple silicon or a T2 Security Chip already encrypt internal storage at the hardware level, but turning on FileVault ties protection to your credentials and adds an important access-control layer.

Store a recovery key away from the Mac. A password manager, protected printed copy, or other secured vault can work. Pick a method you will still be able to reach during a bad day.

## Step 3: Keep the built-in protection stack healthy

This is where I want restraint.

More security software is not automatically more security. Two antivirus products fighting each other, three “cleanup” utilities, and a browser extension that claims to protect everything can create more confusion than protection.

### Windows 11: Windows Security

Open:

```txt
Start -> Windows Security
```

The dashboard should not be full of red warnings. Review these sections:

* **Virus & threat protection:** confirm a protection provider is active and real-time protection is on
* **Firewall & network protection:** confirm the firewall is on for domain, private, and public networks
* **App & browser control:** review reputation-based protection
* **Device security:** review Secure Boot, security processor, and Core isolation details

Microsoft Defender Antivirus is a reasonable built-in baseline for most home users. Microsoft says [real-time protection continuously monitors files and programs](https://support.microsoft.com/en-us/windows/virus-and-threat-protection-in-the-windows-security-app-1362f4cd-d71a-b52a-0b66-c2820032b65e), while tamper protection helps prevent malicious apps from changing important Defender settings.

Under **App & browser control**, keep reputation-based protection and potentially unwanted app blocking enabled. Microsoft recommends enabling both app and download blocking because [potentially unwanted applications](https://support.microsoft.com/en-us/windows/protect-your-pc-from-potentially-unwanted-applications-c7668a25-174e-3b78-0191-faf0607f7a6e) can slow a computer, show unexpected ads, or install more unwanted software.

Under **Device security -> Core isolation**, check Memory integrity. It helps protect the Windows kernel from malicious or vulnerable drivers. If it will not turn on because of an incompatible driver, do not blindly delete things. Update the driver or software, identify what depends on it, and make a deliberate decision. Microsoft’s [Device Security documentation](https://support.microsoft.com/en-us/windows/device-security-in-the-windows-security-app-afa11526-de57-b1c5-599f-3a4c6a61c5e2) explains both the protection and the compatibility tradeoff.

### macOS: Gatekeeper and XProtect

macOS already includes multiple layers of malware protection. Apple describes [Gatekeeper, notarization, and XProtect](https://support.apple.com/guide/security/sec469d47bd8/web) as a layered system that checks trusted software, blocks known malware, and can remediate known infections.

Your job is mostly to stop defeating it.

Go to:

```txt
System Settings -> Privacy & Security
```

Under Security, allow applications from the **App Store and known developers** unless you have a specific reason to be stricter. Apple’s [malware protection guidance](https://support.apple.com/guide/mac-help/mh40596/mac) recommends reliable software sources and explains how macOS checks apps before their first launch.

Sometimes legitimate software requires an override. That does not mean every override is dangerous. It means the warning deserves an actual decision.

Do not build a habit of right-clicking, bypassing the warning, and hoping.

## Step 4: Turn on the firewall and choose network trust carefully

A firewall helps block unwanted inbound connections. It does not make unsafe downloads safe, but it reduces unnecessary exposure.

### Windows 11

Go to:

```txt
Windows Security -> Firewall & network protection
```

Confirm Microsoft Defender Firewall is on for every network profile.

Windows asks whether a network should be **Public** or **Private**. Public is the safer default for airports, hotels, coffee shops, conferences, and networks you do not control. Private allows more discovery and sharing and should be reserved for a network you trust.

Microsoft’s [firewall guidance](https://support.microsoft.com/en-us/windows/firewall-and-network-protection-in-the-windows-security-app-ec0844f7-aebd-0583-67fe-601ecf5d774f) explains that the practical difference is whether other devices on the same network may be able to see or connect to your computer.

When an app asks for firewall access, read the prompt. A game asking for private-network access may make sense. A random utility asking for public-network access deserves a much harder look.

### macOS

Go to:

```txt
System Settings -> Network -> Firewall
```

Turn it on. Apple says the [macOS firewall](https://support.apple.com/guide/mac-help/mh34041/mac) protects against unwanted contact initiated by other computers while still allowing you to control app and service access.

You do not need to enable every advanced option blindly. Start with the firewall on, then review allowed apps and services. If something stops working, understand the connection it needs before allowing it.

## Step 5: Make sign-in convenient enough to keep secure

Security settings fail when they make the owner hate the computer.

Use strong credentials, then use platform features to make daily unlocks easier.

### Windows 11

Go to:

```txt
Settings -> Accounts -> Sign-in options
```

Set up Windows Hello face recognition, fingerprint, or a PIN if supported. Microsoft’s [Windows sign-in guidance](https://support.microsoft.com/en-us/windows/sign-in-options-in-windows-8ae09c04-c5da-41c9-972f-b126a13d18a8) explains that Windows Hello lets you use a device-bound PIN or biometrics instead of repeatedly typing the account password.

Also require sign-in when the computer wakes.

Learn this shortcut:

```txt
Windows key + L
```

It locks the computer immediately.

### macOS

Use a strong Mac login password and Touch ID when supported. In **System Settings -> Lock Screen**, require a password after the display turns off or the screen saver begins.

Learn this shortcut:

```txt
Control + Command + Q
```

It locks the Mac immediately.

The right lock timeout depends on where the computer lives. A desktop in a private home office can tolerate a different timeout than a laptop used in coffee shops. The important part is that walking away does not leave an unlocked session sitting around indefinitely.

## Step 6: Stop using one shared administrator account for everyone

Every person who regularly uses the computer should have their own account.

Separate accounts protect files, browser sessions, saved credentials, and settings from accidental crossover. They also make it easier to remove access later without untangling one shared profile.

For shared computers, make normal users standard users and keep administrator access limited to the people who actually manage the device.

On Windows 11:

```txt
Settings -> Accounts -> Other users
```

On macOS:

```txt
System Settings -> Users & Groups
```

For a single-owner computer, using a separate standard account for daily work is a meaningful improvement, but I will be honest about the tradeoff: it adds prompts and occasional friction. If that friction will make you invent bad workarounds, at minimum keep User Account Control or macOS authorization prompts enabled and treat every request for administrator access as a security decision.

An installer asking for admin access is not a routine welcome screen. It is asking for power.

## Step 7: Remove software, startup items, sharing, and remote access you do not need

Attack surface is often just forgotten convenience.

Start by uninstalling software you do not use. Old utilities, abandoned browser helpers, mystery VPN clients, remote-support tools, and vendor trialware do not become safer by gathering dust.

Then review what launches automatically.

### Windows 11

```txt
Settings -> Apps -> Startup
```

Also review:

```txt
Settings -> System -> Remote Desktop
Settings -> Network & internet -> Advanced network settings -> Advanced sharing settings
```

Turn off Remote Desktop, file sharing, printer sharing, and network discovery if you do not intentionally use them.

### macOS

```txt
System Settings -> General -> Login Items & Extensions
System Settings -> General -> Sharing
```

Review login items, background permissions, Screen Sharing, File Sharing, Remote Login, Remote Management, and other sharing services.

Do not disable something solely because the name is unfamiliar. Look it up, identify the owner, and understand what breaks first. The goal is not to create a mysterious new problem. The goal is to remove access that no longer has a reason to exist.

## Step 8: Protect files from failure and ransomware

Encryption protects files when the computer is locked. Backups protect files when the computer, account, or storage fails.

You need both.

I already covered the full approach in [Backups That Actually Restore](/blog/cyberseckyle-security-how-to-series-everyday-defense-part-6-backups-that-actually-restore/), but the minimum baseline is:

* Important files exist somewhere besides the computer
* The backup has version history or protected recovery points
* At least one copy is offsite or disconnected
* You have restored a file successfully

On Windows 11, Controlled Folder Access can add ransomware resistance by limiting which apps can change protected folders. Microsoft describes it as a powerful control, but it can block legitimate software, so I consider it an optional hardening step rather than part of the zero-annoyance baseline.

Find it here:

```txt
Windows Security -> Virus & threat protection -> Manage ransomware protection
```

Turn it on only when you have time to test your normal applications and review blocks.

On macOS, Time Machine is a strong local backup option, but it should not be your only copy. Encrypt the backup disk and add an offsite or protected backup for the files you cannot replace.

Cloud sync is useful. Cloud sync alone is not the same thing as a tested backup.

## Step 9: Prepare for a lost laptop

Lost-device features create a privacy tradeoff because they depend on an account and location services. I think the trade is worthwhile for most laptops that leave the house, but it should be your decision.

### Windows 11

Microsoft’s [Find My Device](https://support.microsoft.com/en-us/accounts-billing/security/find-and-lock-a-lost-windows-device) can locate and remotely lock a Windows 11 device when it is connected to a Microsoft account and configured ahead of time.

Go to:

```txt
Settings -> Privacy & security -> Find my device
```

Turn it on, then confirm the device appears at:

```txt
account.microsoft.com/devices
```

### macOS

Apple’s [Find My Mac](https://support.apple.com/guide/mac-help/mh36811/mac) can help locate and protect a missing Mac when enabled before it disappears.

Go to:

```txt
System Settings -> your name -> iCloud -> See All -> Find My Mac
```

Turn it on, then confirm the Mac appears in Find My from another Apple device or on iCloud.com.

Do not wait until the laptop is missing to discover the feature was never enabled.

## What I would not turn on blindly

A usable baseline includes knowing when to slow down.

### Every advanced setting you find online

Enterprise benchmarks are valuable, but they assume someone can test, deploy, monitor, troubleshoot, and roll back the settings. A personal computer is not automatically safer because you pasted an enterprise hardening script into an administrator terminal.

### Random registry edits or Terminal commands

If a guide cannot explain what the command changes, how to verify it, and how to undo it, do not run it on a computer you care about.

### Multiple antivirus products

Pick a protection stack you understand. More overlapping products can mean more alerts, performance problems, exclusions, and uncertainty about which tool is actually active.

### Smart App Control without understanding the tradeoff

Windows 11 Smart App Control can block untrusted or unsigned applications, but Microsoft notes that it is designed for clean Windows installations and may not fit computers that regularly run specialized or unsigned tools. It can be a good control on a clean, normal-use computer. It can also become frustrating on a development, repair, or lab machine.

### macOS Lockdown Mode for normal risk

Lockdown Mode is intentionally restrictive and designed for people facing highly sophisticated targeting. It is not the normal baseline for every Mac owner.

Hardening should match the threat. Maximum restriction is not automatically maximum wisdom.

## Validation drills: prove the baseline works

The settings are not done until you prove the important parts.

### Drill 1: The update and restart test

On both operating systems:

1. Check for operating system updates.
2. Install anything pending.
3. Restart.
4. Check again.
5. Update App Store or Microsoft Store apps.

Expected result:

```txt
The operating system reports current, important apps are updated, and no restart is waiting.
```

### Drill 2: The encryption recovery test

Do not intentionally trigger a recovery screen just for fun.

Instead:

1. Confirm encryption reports as enabled.
2. From another trusted device, confirm you can reach the recovery-key location.
3. Confirm the stored key is labeled with the correct computer.

Optional command checks:

Windows PowerShell:

```powershell
manage-bde -status
```

macOS Terminal:

```bash
fdesetup status
```

Expected result:

```txt
The operating system drive is encrypted, and the recovery method is accessible somewhere other than the computer.
```

### Drill 3: The five-second lock test

1. Lock the computer with the keyboard shortcut.
2. Confirm the screen hides your work.
3. Confirm returning requires your PIN, password, or biometric sign-in.

Expected result:

```txt
Walking away does not leave an open session.
```

### Drill 4: The protection dashboard test

Windows:

1. Open Windows Security.
2. Confirm antivirus, firewall, and app/browser protection show no unexplained warnings.
3. Run a Quick scan.

macOS:

1. Confirm Firewall is on.
2. Confirm app installation is limited to the App Store and known developers.
3. Review Login Items and Sharing for anything unexpected.

Expected result:

```txt
Built-in protections are active, and every exception has a reason.
```

### Drill 5: The restore test

1. Create a small text file with today’s date.
2. Let your normal backup process capture it.
3. Delete or move the original.
4. Restore the backup copy.
5. Open it.

Expected result:

```txt
The restored file opens and contains the correct data.
```

### Drill 6: The lost-device reality test

From another device, open the Microsoft account device page or Apple Find My.

Expected result:

```txt
The laptop appears under the correct account, and you understand how to locate or lock it.
```

Do not remotely erase the computer as a test. We are validating the seatbelt, not driving into the wall.

## Common mistakes I see all the time

### “It came with antivirus, so I am covered”

Maybe the built-in protection is active. Maybe an expired trial disabled it. Maybe someone added exclusions during troubleshooting and never removed them.

Open the dashboard and check.

### “Encryption is on, so I do not need a backup”

Encryption protects confidentiality. It does not recover deleted, corrupted, or ransomware-encrypted files.

### “I never restart because updates are annoying”

Some security fixes and background protections do not fully take effect until the computer restarts. Schedule the restart. Do not collect pending reboots like souvenirs.

### “I always click Allow because the app needs to work”

Sometimes it does. Sometimes the prompt is the only moment you get to stop a bad decision. Read the name, publisher, requested access, and reason.

### “Macs do not get malware”

macOS has strong built-in protections. That is not the same as immunity. Apple maintains Gatekeeper, notarization, and XProtect because malicious software targeting Macs exists.

### “I turned off the firewall because one app broke”

Fix the rule or understand the app’s network need. Do not remove the whole boundary because one program asked loudly.

### “I use an admin account because it is my computer”

That is understandable. Just remember that software running as you can often do what you can do. Admin prompts are there to interrupt that path. Treat them like decisions, not decorations.

## Windows 11 and macOS baseline checklist

Copy this into your notes or password manager.

```txt
Windows 11 and macOS Baseline Checklist

Inventory
[ ] Computer name and model recorded
[ ] Operating system version recorded
[ ] Protection provider recorded
[ ] Backup method recorded
[ ] Recovery-key location recorded without putting the key in an unsafe note

Updates
[ ] Operating system updates installed
[ ] Automatic security updates enabled
[ ] Important apps updated
[ ] Unneeded software removed
[ ] Computer restarted after updates

Encryption and recovery
[ ] Device Encryption, BitLocker, or FileVault enabled
[ ] Recovery key or recovery method confirmed
[ ] Recovery method accessible from another trusted device or location
[ ] Recovery key labeled for the correct computer

Built-in protections
[ ] Antivirus or malware protection active
[ ] Firewall enabled
[ ] Windows reputation-based protection enabled where applicable
[ ] Windows Memory integrity reviewed where applicable
[ ] macOS app sources limited to App Store and known developers
[ ] Security warnings and exceptions reviewed

Accounts and lock screen
[ ] Every regular user has a separate account
[ ] Shared users do not have unnecessary admin access
[ ] Strong login credential configured
[ ] Windows Hello or Touch ID configured where available
[ ] Sign-in required after sleep or screen lock
[ ] Lock-screen keyboard shortcut tested

Access and sharing
[ ] Startup or login items reviewed
[ ] Remote access reviewed
[ ] File, printer, screen, and media sharing reviewed
[ ] Unneeded sharing services disabled
[ ] Unknown background items investigated

Backups
[ ] Important files backed up somewhere besides the computer
[ ] Backup has version history or protected recovery points
[ ] Offsite or disconnected copy exists
[ ] One file restored and opened successfully

Lost device
[ ] Find My Device or Find My Mac decision made
[ ] Lost-device feature enabled if desired
[ ] Computer visible from another trusted device or account portal

Validation
[ ] Operating system reports current
[ ] Encryption reports enabled
[ ] Recovery method confirmed
[ ] Firewall reports enabled
[ ] Protection dashboard has no unexplained warnings
[ ] Quick lock test passed
[ ] Restore test passed
```

## A maintenance schedule that will not take over your life

### Weekly

* Install routine updates when prompted
* Restart the computer if one is pending
* Pay attention to security warnings instead of dismissing them automatically

### Monthly

* Open the security dashboard and investigate warnings
* Remove one or two apps you no longer use
* Restore one backed-up file

### Quarterly

* Review startup items, sharing, and remote access
* Confirm encryption and recovery-key access
* Confirm the lost-device portal still sees the laptop
* Review user accounts and remove stale access

### Yearly

* Confirm the operating system and computer are still supported
* Review the whole checklist
* Decide whether your risks or daily use have changed enough to justify stronger controls

## Final thought

A good computer security baseline should feel a little boring.

The computer updates. The disk is encrypted. The firewall stays on. Built-in protections are healthy. Apps come from places you trust. Administrator access means something. Important files can be restored. If the laptop disappears, you know what to do next.

None of that requires turning every setting to maximum or making normal work miserable.

The strongest baseline is not the one with the most controls. It is the one that meaningfully reduces risk and still exists six months from now.

Turn on the protections you can live with. Understand the exceptions you keep. Then prove recovery works before you need it.
