---
date: 2026-01-30T10:00:00-05:00
title: "I Didn’t Know You Could Do This: The NVRAM Trick That Saved a Mac"
description: "A client tried to factory reset a 2018 iMac and ended up at the flashing folder icon. Here’s how I got it back from the dead using macOS Recovery, installer logs, and a surprisingly slick NVRAM workaround."
tags: [apple, macos, tutorials, how-to]
mastodon_url: https://infosec.exchange/@cyberseckyle/115985445207180376
---

{% image "/assets/images/imac-highsierra-error.jpg", "macOS High Sierra installer in Recovery showing an alert: “The recovery server could not be contacted.”", "The exact roadblock: High Sierra Recovery failing with “The recovery server could not be contacted,” even though the Mac was online.", "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

A client called me with that special kind of panic you can hear through the phone. They had tried to restore their **2018 iMac** to factory settings, something went sideways mid-process, and now the machine would only boot to the **flashing folder with a question mark**.

If you have ever seen that icon, you know the vibe. It is not “slightly inconvenient.” It is “your Mac cannot find a startup disk with a working OS.” [Apple’s own wording](https://support.apple.com/en-us/102601) is basically that exact sentence.

This is the story of how we got it back up and running, and the weird little workaround I learned along the way that I genuinely did not know was possible.

## The symptoms

- Flashing folder icon on boot (no macOS found)
- Booting into Recovery worked
- Reinstalling macOS offered **High Sierra**, but failed with:

> “The Recovery Server Could Not Be Contacted”

That error is extra annoying because it *sounds* like “Wi‑Fi issue,” but it is often not Wi‑Fi. It is more like “this particular installer pipeline is broken in a very specific way.”

## Step 1: Get into the right Recovery mode

On Intel Macs like a 2018 iMac, the key combo matters. Apple documents the differences like this:

- **Command (⌘) + R**: built-in Recovery (usually reinstalls the current installed version, if available)
- **Option (⌥) + Command (⌘) + R**: Internet Recovery for the latest compatible macOS
- **Shift (⇧) + Option (⌥) + Command (⌘) + R**: Internet Recovery for the version that originally shipped (or closest still available)

[Apple’s list is worth bookmarking](https://support.apple.com/en-us/102603) because you will forget it right when you need it.

In this case, Recovery kept steering us into **High Sierra**, which makes sense for a 2018 iMac that originally shipped around that era.

## Step 2: The normal stuff (Disk Utility, erase, format, sanity checks)

Once in Recovery:

1. Open **Disk Utility**
2. Use **View → Show All Devices**
3. Select the internal drive (top-level device, not just a volume)
4. **Erase**
   - Scheme: **GUID Partition Map**
   - Format: **APFS** (or Mac OS Extended Journaled for older workflows, but APFS is typical here)

Then I did the quick “is the internet actually working?” check:

- That globe booted fine
- Wi‑Fi connected
- DNS resolved (at least enough to get into Recovery)

Everything smelled normal.

## Step 3: The reinstall fails, so I go hunting in the logs

When the installer throws “Recovery Server Could Not Be Contacted,” do not just accept your fate. Open the installer logs.

In the macOS installer window, you can pull up **Installer Log** and look for anything that screams “this is the real reason.” In a bunch of these cases, you will see something along the lines of failing to load an Apple Software Update catalog.

That was my breadcrumb.

At this point my brain switched into MSP mode: treat it like a weird production outage. Gather evidence, identify the dependency that is failing, then decide whether you can route around it.

## Step 4: The fix that surprised me (Mr. Macintosh Fix #3)

While searching, I landed on this write-up from [Mr. Macintosh](https://mrmacintosh.com/how-to-fix-the-recovery-server-could-not-be-contacted-error-high-sierra-recovery-is-still-online-but-broken/), and the solution that worked for me was **Fix #3: Change the NVRAM Software Update URL**.

The short version: High Sierra Recovery is trying to hit the software update catalog over **HTTPS**, and in some environments that connection fails due to SSL/TLS weirdness. The workaround is to set an NVRAM variable so Recovery uses an **HTTP** catalog URL instead (so it stops tripping over the secure handshake).

Yes, it feels a little cursed.
Yes, it works.

### The exact command I used

From macOS Recovery, open **Utilities → Terminal**, then run:

```bash
nvram IASUCatalogURL="http://swscan.apple.com/content/catalogs/others/index-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog"
```

That command (and that exact catalog URL) is widely echoed in [community fixes](https://discussions.apple.com/thread/255607212) for the High Sierra Recovery failure.

After running it:

1. Quit Terminal
2. Go back to **Reinstall macOS**
3. Try again

This time, the installer stopped acting like a drama queen and actually proceeded.

*Side note*: I had to run this a few times before it actually took. So if it does not work the first time, try again.

## A quick security note (because… yeah)

Switching from HTTPS to HTTP is **not** something I love recommending casually. HTTP removes transport encryption, which increases the risk of a man-in-the-middle attack on a hostile network. That said, in a controlled environment (trusted network, you are doing a one-time recovery, you clear the setting afterward), it is a practical workaround.

If this is a client machine in the wild, I treat it like any other “temporary bypass”:

- do the minimum to restore service
- then remove the bypass immediately after

## Step 5: Clean up afterward (remove the override)

Once macOS is installed and you are booted normally, you have a couple options:

### Option A: Delete the NVRAM variable

Open Terminal in macOS and run:

```bash
sudo nvram -d IASUCatalogURL
```

### Option B: Reset NVRAM/PRAM

Apple’s key combo list includes the [NVRAM reset shortcut](https://support.apple.com/en-us/102603).

I prefer deleting the specific variable because it is precise and does not nuke other settings, but either approach can work.

## Why I’m sharing this

Because I have been doing IT long enough to respect two truths:

1. Computers are complicated.
2. Computers are also petty.

This issue is a perfect example. The hardware was fine. The client did not “destroy the iMac.” They just fell into a gap where an older recovery workflow depends on an online catalog behaving nicely, and sometimes it does not.

Also, that NVRAM trick was new to me. I knew NVRAM mattered for boot behavior and settings, but using it as a lever to redirect a recovery update catalog felt like discovering a hidden door in a hallway I have walked for years.

So if you are staring at a flashing folder icon and a High Sierra reinstall that refuses to talk to the recovery server, hopefully this saves you the same headache.

And if you are doing this for a client: get consent, confirm whether data recovery is needed before erasing anything, and document what you changed. Future-you deserves nice things.