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

> Part 1 of the Light Offensive to Think Defensively track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/) builds the boundary every later exercise depends on: a lab target that is isolated, disposable, observable, and unquestionably authorized.

Offensive techniques are useful to defenders when they reveal an attack path, the evidence it creates, and the control that interrupts it. The same tools become a problem when the target is a neighbor's device, a workplace system outside an approved test, or an intentionally vulnerable application accidentally bound to a real network interface.

The first lab does not need a cluster. It needs one analysis system, one target, an explicit network design, and a reset that has been tested.

## Write rules that survive curiosity

Put the lab charter beside the notes for every exercise:

```txt
Learning objective:
Systems I own and may test:
Systems and networks that are out of scope:
Network mode and allowed internet access:
Real accounts or data allowed: none
Snapshot and reset procedure:
Where packet captures and logs are stored:
Stop condition:
```

The authorization rule is straightforward: test only systems you own or systems for which you have explicit permission and a defined scope. A public IP address, bug-bounty program, or workplace login is not blanket permission. Read the actual policy before sending a probe.

Use fake users, email addresses, documents, tokens, and passwords. Lab exports and packet captures are easy to forget or share; real data creates a consequence the exercise does not need.

## Start with two systems and one private network

VirtualBox, Hyper-V, VMware Workstation or Fusion, and UTM can all support a small lab. Choose the platform you can patch, snapshot, and troubleshoot. A useful first layout is:

```txt
Host computer
  |
  +-- Analysis VM: browser, Nmap, Wireshark, notes
  |
  +-- Target VM: intentionally vulnerable application

Lab network: internal or host-only
Public exposure: none
```

Network labels differ by hypervisor, so verify behavior rather than trusting the name. In VirtualBox, [internal networking](https://docs.oracle.com/en/virtualization/virtualbox/7.2/user/networkingdetails.html) keeps communication among VMs on the named internal network, while host-only networking also creates a path between the host and those VMs. NAT commonly permits outbound access through the host. Bridged mode places the guest on the physical network and is a poor default for an intentionally vulnerable target.

If the target needs updates, take a snapshot, temporarily attach only the access required, update, then return it to the isolated network. Do not leave a second adapter enabled because it was convenient once.

## Run one target without publishing it

[OWASP Juice Shop](https://devguide.owasp.org/en/07-training-education/01-vulnerable-apps/01-juice-shop/) is intentionally insecure and documented for training. One safe pattern is to run Docker inside the target VM and bind the application to that VM's loopback interface:

```bash
docker pull bkimminich/juice-shop
docker run --rm --name juice-shop-lab -p 127.0.0.1:3000:3000 bkimminich/juice-shop
```

That binding makes the application available only inside the target VM at `http://127.0.0.1:3000`. If the analysis VM must reach it, bind the container to the target VM's isolated-lab address instead and confirm the host firewall allows only the lab subnet. The common shorthand `-p 3000:3000` can publish on every host interface, which is not the boundary this exercise needs.

Record the image tag or digest. Pulling an unspecified `latest` image months later may produce a different target and different challenge behavior. Reproducible exercises need a known version as well as a snapshot.

## Establish the normal state

Before changing or attacking anything, collect a small baseline from inside the lab. Find the target's isolated address, then scan only that address:

```bash
nmap -sV -oA lab-baseline 192.168.56.20
```

Replace the example address with the target VM. `-sV` requests service detection, and `-oA` saves normal, XML, and grepable output under the chosen name. Check that the target address is correct before pressing Enter.

Save:

```txt
VM names and isolated addresses
Open ports and identified services
Target application version
Network mode and attached adapters
Host firewall rule, if one was required
Snapshot name
```

Next, capture one normal browser session with Wireshark or `tcpdump`: open the target, use a fake account, and stop the capture. Identify the DNS request if one exists, TCP connection, HTTP request, and source/destination addresses. This is the before picture for later exercises. Without it, every packet and log line looks equally unusual.

Packet captures can contain credentials and session tokens even in a lab. Use fake values, restrict access to the files, and delete them when they no longer support the lesson.

## Use snapshots for reset and backups for survival

Create snapshots at states that have operational meaning:

```txt
clean-os-and-tools
target-installed-known-version
before-authentication-exercise
before-control-change
```

Then prove the reset. Create a harmless file or change a visible setting, restore the snapshot, and verify that the change disappeared and the target still starts.

A snapshot is not a backup of the lab. It often depends on the original VM disk and hypervisor metadata. Export the lab definition, notes, configuration, and any irreplaceable capture separately if rebuilding the host would matter.

## Prove the boundary from inside and outside

```txt
[ ] The target and analysis VM are the only systems in scope
[ ] Vulnerable services do not answer on the host's home or work interface
[ ] The target cannot reach private home or work devices
[ ] Any temporary internet adapter has been removed
[ ] The Nmap output contains only the intended lab address
[ ] A normal packet capture and target log are saved
[ ] A snapshot restore returns the target to the known state
[ ] Lab files contain no real accounts, tokens, or personal data
[ ] The target image version and lab network design are documented
```

Do the isolation check after every network change, not just during initial setup. The safe lab is not defined by the presence of a vulnerable VM; it is defined by the verified boundary that keeps the VM, its traffic, and the later exercises away from systems that never agreed to participate.
