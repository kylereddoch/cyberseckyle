---
date: 2026-08-18T10:00:00-05:00
title: 'CybersecKyle Security How-To Series: Light Offensive to Think Defensively, Part 1 - Build a Safe Lab with Snapshots'
seoTitle: Build a Safe Cybersecurity Lab with Snapshots
description: 'A practical guide to building a safe local cybersecurity lab with virtual machines, isolated networking, snapshots, test accounts, and clear rules before practicing offensive or defensive techniques.'
searchIntent: Help learners build a safe local cybersecurity lab for defensive learning with isolated virtual machines, snapshots, test data, and boundaries that prevent accidental harm.
featuredImage: /assets/images/network-diagram-drawing.png
featuredImageAlt: Network diagram sketch representing a safe lab design with isolated systems and known boundaries.
featuredImageCaption: A good lab gives you room to break things without breaking real things.
tags: [cyberseckyle-howto-series, cybersecurity, security, appsec, security-operations, how-to]
mastodon_post: true
mastodon_url:
mastodon_tags: [Cybersecurity, InfoSec, Lab, BlueTeam, CybersecKyleHowTo]
---

> I am back with Season 5, Part 1 of the Light Offensive to Think Defensively track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). This time we are building a safe lab with snapshots, because the first rule of learning attack paths is not accidentally attacking something you do not own.

Offensive security concepts help defenders understand how small mistakes chain together, why controls matter, and what attackers are actually trying to accomplish. The learning environment matters, though.

You do not practice on random systems. You do not scan networks you do not own. You do not run tools against production because a tutorial made it look easy.

You build a lab.

A good lab gives you room to break things, reset quickly, observe behavior, and learn without creating real-world harm.

## What you are building

By the end of this guide, you should have:

* A defined lab purpose
* One or more virtual machines
* Isolated or controlled networking
* Snapshots before experiments
* Test accounts and fake data
* A reset procedure
* Lab rules written down

Skip the fanciest setup at first. Build a safe one.

## The tool stack I would actually start with

Season 5 should feel more hands-on, so here is the starter stack I would use for this lab.

For virtualization:

* **VirtualBox** if you want free and cross-platform
* **UTM** if you are on macOS and want a Mac-friendly VM experience
* **Hyper-V** if you are on Windows Pro and already have it available
* **VMware Workstation or Fusion** if you already prefer that workflow

For targets:

* **OWASP Juice Shop** for web application practice
* **DVWA** for deliberately vulnerable web app basics
* **Metasploitable** only inside an isolated lab, never bridged to your home network
* A normal Windows or Linux VM that you harden, scan, and monitor yourself

For defender visibility:

* **Wireshark** to see network traffic
* **tcpdump** for quick packet capture on Linux
* **Nmap** to confirm what the lab target exposes
* **Windows Event Viewer** or **Sysmon** for Windows activity
* **journalctl** and application logs for Linux activity
* **Zeek** later, if you want richer network telemetry

I would not install every tool on day one. Start with a hypervisor, one target, one analysis VM, Nmap, and Wireshark. Add more only when the exercise needs it.

## Step 1: Write the lab rules first

Before installing tools, write the rules.

```txt
Lab purpose:
Allowed targets:
Disallowed targets:
Network mode:
Internet access allowed:
Real accounts allowed:
Real customer or family data allowed:
Snapshot requirement:
Reset procedure:
```

My recommended rules:

* Only test systems you own or have explicit permission to test
* Use fake data
* Use test accounts
* Snapshot before experiments
* Keep vulnerable machines isolated
* Do not expose intentionally vulnerable services to the public internet
* Document what you changed

Rules are not there to make the lab boring. They are there to keep the fun from becoming a problem.

## Step 2: Pick a simple lab platform

Common options:

* VirtualBox
* VMware Workstation or Fusion
* UTM on macOS
* Hyper-V on Windows Pro
* Proxmox for a bigger home lab
* Docker for container-focused testing

Start with whatever you can maintain.

For a first lab, one attacker/analysis VM and one target VM is enough.

Example:

```txt
Analysis VM: Linux workstation for tools and notes
Target VM: Intentionally vulnerable app or test server
Network: Host-only or isolated where practical
```

Do not build a cluster before you understand snapshots.

## Step 3: Build one vulnerable web target

For a first practical target, I like OWASP Juice Shop because it is intentionally vulnerable, well documented, and easy to reset.

If you use Docker inside a lab VM, a simple local start looks like this:

```bash
docker pull bkimminich/juice-shop
docker run --rm -p 3000:3000 bkimminich/juice-shop
```

Then open the app from the lab browser:

```txt
http://127.0.0.1:3000
```

If you want the analysis VM to reach it, bind it only on the isolated lab network and document the lab IP.

Do not publish Juice Shop to the public internet. It is supposed to be vulnerable.

## Step 4: Choose network isolation deliberately

Networking is where labs accidentally get messy.

Common modes:

* NAT: VMs can often reach the internet through the host
* Host-only: VMs talk to host and each other, not the wider network
* Internal network: VMs talk only to other VMs on that internal network
* Bridged: VM appears directly on your real network

For vulnerable targets, avoid bridged networking unless you have a specific reason and understand the exposure.

Use host-only or internal networking for intentionally vulnerable systems. Add internet access only when the exercise requires it.

If a vulnerable VM needs updates, snapshot first, temporarily allow internet if needed, update, then return to the safer network mode.

## Step 5: Take a baseline network scan

Once the target is running inside the lab, scan only the lab target.

Example:

```bash
nmap -sV -oA lab-baseline 192.168.56.20
```

What those flags mean:

* `-sV` asks Nmap to identify service versions
* `-oA lab-baseline` saves output in multiple formats
* `192.168.56.20` should be your lab target, not a random system

Your goal is to answer:

```txt
What ports are open?
What services are visible?
What versions are exposed?
Is anything exposed that I did not expect?
```

Save the output with your lab notes. This becomes your before picture.

## Step 6: Capture one packet trace

Open Wireshark on the analysis VM or host interface connected to the lab network.

Then:

1. Start capture.
2. Browse to the lab target.
3. Log in with fake credentials if the lab app supports it.
4. Stop capture.
5. Save the capture as `juice-shop-first-visit.pcapng`.

Now look for:

* DNS queries
* TCP handshake
* HTTP requests
* TLS if configured
* Source and destination addresses

You are not trying to become a packet wizard in one sitting. You are learning what normal lab traffic looks like before you start changing things.

## Step 7: Snapshot before experiments

Snapshots are what make a lab forgiving.

Create snapshots:

* Clean install
* After updates
* Before each exercise
* Before risky configuration changes
* After building a known-good vulnerable state

Name snapshots clearly:

```txt
clean-install-2026-08-18
patched-before-web-test
before-phishing-lab
known-vulnerable-login-demo
```

Do not rely on memory. Future-you will not remember what "snapshot 3" means.

## Step 8: Use fake data and test accounts

Never put real customer, family, banking, or production secrets into a learning lab.

Use:

* Fake names
* Fake emails
* Fake passwords
* Fake API keys
* Fake documents
* Test domains
* Throwaway accounts where needed

If a lab gets compromised, rolled back, exported, or shared, fake data keeps the blast radius low.

## Step 9: Keep notes like a defender

For each exercise, record:

```txt
Goal:
Starting snapshot:
Target:
Commands or actions:
What changed:
Logs generated:
Detection opportunity:
Fix or mitigation:
Ending snapshot or rollback:
```

This is the defender value.

You are not just learning that an attack works. You are learning what it looks like, what logs it creates, and what control would have stopped or detected it.

## Validation drills: prove the lab is safe

### Drill 1: Isolation check

From the target VM, try to reach a device on your real network.

Expected result:

```txt
The vulnerable target cannot reach private home or work devices.
```

### Drill 2: Snapshot restore

Make a harmless change, then restore the snapshot.

Expected result:

```txt
The VM returns to the known state.
```

### Drill 3: Fake data check

Search the lab for real names, real tokens, or production secrets.

Expected result:

```txt
The lab contains only fake data and test credentials.
```

### Drill 4: Rule review

Read the lab rules before an exercise.

Expected result:

```txt
The exercise target is clearly allowed.
```

## Safe lab checklist

```txt
Safe Lab Checklist

Rules
[ ] Lab purpose defined
[ ] Allowed targets listed
[ ] Disallowed targets listed
[ ] Real data banned
[ ] Permission boundary written

Platform
[ ] Virtualization platform selected
[ ] Analysis VM created
[ ] Target VM created
[ ] OWASP Juice Shop or another lab-safe target installed
[ ] Tools installed only where needed
[ ] Updates applied where appropriate

Networking
[ ] Vulnerable targets isolated
[ ] Bridged networking avoided unless justified
[ ] Internet access controlled
[ ] Public exposure checked
[ ] Baseline Nmap output saved
[ ] First Wireshark capture saved

Snapshots
[ ] Clean snapshot created
[ ] Pre-exercise snapshot created
[ ] Snapshot names clear
[ ] Restore tested

Notes
[ ] Exercise notes template created
[ ] Logs location known
[ ] Fix or detection notes captured
```

## Final thought

A safe lab is the permission slip for curiosity.

It lets you break things, observe things, reset things, and learn why defensive controls matter without dragging the real world into your experiment.

Build the boundaries first.

Then go learn.
