---
date: 2026-04-27T14:00:00-05:00
title: "CybersecKyle Security How-To Series: Everyday Defense (Part 6) - Backups That Actually Restore"
description: Backups are not real until you test them. A practical, in-depth guide to building, verifying, and restoring backups across Windows, macOS, and Linux so you are actually protected when it matters.
featuredImage: /assets/images/laptop_ext_hhd.jpg
featuredImageAlt: Laptop computer with external hard drives and memory cards data is transferred and backed up.
tags: [cyberseckyle-howto-series, backups, security, how-to, everyday-defense]
mastodon_url:
---

> I’m back with **Part 6** of the **Everyday Defense** track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we’re locking in backups that actually restore, building a setup that survives ransomware and failure, and walking through how to verify your backups before you ever have to rely on them.

Backups are one of those things everyone says they have...right up until the moment they need them.

Then it turns into *“it should be backed up somewhere”* or *“I think OneDrive has it”* or worse, silence.

In my world, backups don’t count unless they restore. That’s the line. Not configured. Not running. Not showing a green checkmark. If you haven’t restored from it, you don’t have a backup. You have a hope.

This one matters more than almost anything else in this series because when everything else fails, backups are what save you.

## What good backups actually look like

Let’s clear up the biggest misconception right away.

A backup **is not**:

- Your files sitting in OneDrive or Google Drive  
- A USB drive you copied files to once  
- A NAS sitting on the same network as everything else  

Those can be part of a strategy, but they are not the strategy.

A real backup approach follows the 3-2-1 rule:

- 3 copies of your data  
- 2 different types of storage  
- 1 copy offsite  

If you want to bring that into today’s threat landscape, especially with ransomware, expand it to 3-2-1-1-0:

- 1 immutable or offline copy  
- 0 errors when tested  

That last one is where most setups fail.

## The real problem is silent failure

Hardware failure is expected. Drives die. Systems crash.

What causes real damage is thinking you are protected when you are not.

I have seen:

- Backup jobs “succeeding” but not capturing actual data  
- Expired credentials breaking backups quietly  
- Cloud sync overwriting good files with corrupted ones  
- Ransomware encrypting both production data and backup shares  

And the worst one  
No one ever tested a restore

You do not want to discover your backup is broken during an incident.

## What we are actually building

A solid, real-world setup should include:

- A local backup for fast recovery  
- An offsite backup for disaster recovery  
- A protected copy that ransomware cannot touch  
- A repeatable way to verify everything works  

You do not need enterprise tools, but you do need intention.

## A practical backup strategy that works

### Local backup (fast recovery)

{% image "/assets/images/laptop_with_usbs_desk.jpg", "USB flash drives, external hard drives connected to a laptop on a desk for data", null, "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

This is your “I need it back now” layer.

- External drive or local NAS  
- Automated backups  
- Versioning enabled  

This protects you from:

- Accidental deletion  
- File corruption  
- Quick recovery scenarios  

**Important note**  
If it is always connected, it is vulnerable. Treat this as convenience, not your only protection.

### Cloud backup (offsite protection)

{% image "/assets/images/server_rack.jpg", "Server racks In server room cloud data center", null, "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

This is your “everything is gone” layer.

- Dedicated backup service  
- Encrypted backups  
- Retention and version history  

This protects against:

- Theft  
- Fire  
- Hardware failure  
- Local ransomware impact  

Cloud sync is not backup. If a file gets deleted or encrypted locally, sync will replicate the damage.

### Immutable or offline backup (ransomware defense)

This is the layer most people skip and regret.

Options:

- Immutable cloud storage  
- Air-gapped external drives  
- Write-once storage  

This protects against:

- Ransomware deleting backups  
- Admin account compromise  
- Malicious actions  

If an attacker gets access, assume they will target your backups first.

## Windows: setting up backups that actually work

### File History (simple and effective)

1. Plug in an external drive  
2. Go to Settings → Update & Security → Backup  
3. Click Add a drive  
4. Turn on automatic backups  
5. Configure:
   - Backup frequency (hourly recommended)  
   - Retention (as long as possible)  
   - Include important folders  

This gives you:

- File versioning  
- Quick restores  

It does not give you:

- Offsite protection  
- Ransomware resistance  

### System Image Backup (full recovery)

1. Open Control Panel → Backup and Restore  
2. Click Create a system image  
3. Choose your backup location  
4. Run the backup  

Pair this with a recovery USB so you can actually restore your system.

### Add a real cloud backup

Use a true backup solution, not just sync.

Examples:

- Backblaze  
- iDrive  

These provide:

- Versioning  
- Protection from deletion propagation  
- Recovery after ransomware  

## macOS: Time Machine done properly

### Enable Time Machine

1. Plug in an external drive  
2. Go to System Settings → General → Time Machine  
3. Select the drive  
4. Enable automatic backups  

Time Machine:

- Runs hourly  
- Keeps historical versions  
- Supports full system restore  

### Encrypt your backup

Always enable encryption when setting up the disk.

If someone gets your backup drive, they should not get your data.

### Add offsite protection

Time Machine is local. You still need:

- A rotated external drive  
- Or a cloud backup service  

## Linux: flexible but requires discipline

### rsync (reliable and simple)

Basic example:

```bash
rsync -avh /home/user/ /mnt/backup/home/
```

To automate:

```bash
crontab -e
```

Add:

```bash
0 2 * * * rsync -avh /home/user/ /mnt/backup/home/
```

This runs daily at 2 AM.

### Timeshift (system snapshots)

- Install Timeshift  
- Configure external storage  
- Schedule snapshots  

This gives you system-level rollback similar to Windows and macOS.

### Encrypted offsite backups

Tools like Restic or Borg allow:

- Encrypted backups  
- Remote storage  
- Deduplication  
- Versioning  

This is where Linux setups can be extremely powerful if configured properly.

## What you should actually back up

Focus on what matters:

- Documents  
- Photos and videos  
- Business or client data  
- Configuration and exports  

Do not waste space on:

- Reinstallable applications  
- Temporary files  
- Operating system clutter  

If you can reinstall it, do not back it up.

## Protecting backups from ransomware

If your backup is always connected and writable, it is vulnerable.

You need at least one of these:

- A disconnected external backup  
- Immutable storage  
- Separate credentials for backup systems  

Never use the same admin credentials for both production and backup access.

## The step everyone skips: testing restores

{% image "/assets/images/person_laptop_checklists.jpg", "Person reviewing files on laptop", null, "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

This is the difference between confidence and chaos.

Do this monthly:

1. Pick a random file  
2. Restore it  
3. Open and verify it works  

Occasionally go further:

- Restore a full folder  
- Restore to a different machine  
- Simulate full recovery  

If you have never tested a restore, you are not ready.

## Common mistakes I see constantly

*“I use OneDrive, I am good”*
Sync is not backup

*“My NAS handles everything”*
If it is on the network, it is at risk

*“I set it up once”*  
Backups drift and break over time

*“I will deal with it later”*  
That mindset turns small issues into major losses

## A simple checklist you can follow this week

- Local backup configured and automated  
- Cloud backup in place  
- At least one offline or immutable copy  
- Versioning enabled  
- Monthly restore test scheduled  

If you can check all of these, you are ahead of most people.

## Final thought

Backups are boring until they are the only thing that matters.

You do not need an enterprise setup. You do not need expensive tools. But you do need to be intentional.

Because when something goes wrong, and it will, the only question that matters is this:

Can you get your data back?

If the answer is not a confident yes, that is where you start.
