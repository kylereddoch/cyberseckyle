---
date: 2026-03-13T11:30:00-05:00
title: The Network Edge Cleanup Most Teams Cannot Keep Putting Off
description: Unsupported firewalls, routers, VPN appliances, and SD-WAN systems are becoming an avoidable risk. Here is a practical edge security cleanup plan for IT teams, MSPs, and small organizations in 2026.
tags: [cybersecurity, networking, network-security, MSP, patch-management]
mastodon_url: https://infosec.exchange/@cyberseckyle/116222996121076861
---

{% image "/assets/images/network_edge_devices_dusty.png", "Close-up of aging network edge equipment in a dim server room, showing dusty firewall and router appliances with connected Ethernet cables and warning lights", "Old network edge devices often stay in place far longer than they should, creating technical debt and unnecessary security risk", "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

I keep coming back to the same thought lately: a lot of cybersecurity risk is not hiding in some mysterious zero-day fog machine. A lot of it is sitting right at the edge of the network, blinking away like it has all the time in the world.

Firewalls, VPN appliances, routers, switches, load balancers, and SD-WAN gear often get treated like permanent infrastructure. Once they are in place and mostly working, they quietly become “future me’s problem.” That works right up until the future shows up angry. I have written before about how that same neglect shows up in smaller ways too, from [basic port exposure](/blog/20-common-network-ports-you-must-know-and-secure/) to weak device governance in branch and office networks.

And right now, the warning lights are not subtle.

In early February, [CISA, the FBI, and the U.K. NCSC released joint guidance on end-of-support edge devices](https://www.ic3.gov/CSA/2026/260205.pdf). Their point was blunt: threat actors are actively exploiting unsupported edge devices such as firewalls, routers, load balancers, and VPN gateways to get into networks, keep access, and compromise sensitive data. That is not theoretical. That is your perimeter becoming technical debt with an Ethernet port.

CISA followed that with [Binding Operational Directive 26-02](https://www.cisa.gov/news-events/news/cisa-orders-federal-agencies-strengthen-edge-device-security-amid-rising-cyber-threats), which requires federal agencies to identify and remove unsupported edge devices on a defined timeline. Even if you do not work in federal space, the message is still useful: lifecycle management is now a security control, not just a budgeting chore.

Then on February 25, CISA warned about [ongoing exploitation of Cisco SD-WAN systems](https://www.cisa.gov/news-events/alerts/2026/02/25/cisa-and-partners-release-guidance-ongoing-global-exploitation-cisco-sd-wan-systems), including the critical [CVE-2026-20127](https://nvd.nist.gov/vuln/detail/CVE-2026-20127) authentication bypass issue in Cisco Catalyst SD-WAN Controller and Manager. Cisco rated it [critical with a CVSS score of 10.0](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-sdwan-rpa-EHchtZk). That is the sort of advisory that should make every network team stop pretending next maintenance window is a personality trait. I dug into the broader implications of that in [The Cisco SD-WAN Story Is Bigger Than Cisco](/blog/the-cisco-sd-wan-story-is-bigger-than-cisco/), because the bigger issue is how exposed management and stale edge gear keep becoming attacker shortcuts.

There is also the bigger backdrop. In its [2026 Threat Report](https://blog.cloudflare.com/2026-threat-report/), Cloudflare said DDoS attacks more than doubled in 2025 and hyper-volumetric network-layer attacks grew 700%. At the same time, Google said its disruption of the [IPIDEA residential proxy network](https://cloud.google.com/blog/topics/threat-intelligence/disrupting-largest-residential-proxy-network) reduced the pool of available devices by millions. Different stories, same lesson: attackers love cheap infrastructure, weak visibility, and edge systems defenders have not cleaned up.

## What to do about it

This is the practical part. Not the “buy seven products and ascend to zero trust enlightenment” part. Just the boring, useful stuff that actually lowers risk.

### 1. Build an edge inventory that is actually trustworthy

If your team cannot answer “What internet-facing devices do we own, where are they, what versions are they on, and when do vendor support dates end?” then that is the first project.

For each edge device, track:

- device type and role
- model and serial number
- public IP or exposure path
- software and firmware version
- management interface exposure
- owner
- support or end-of-support date
- backup status
- replacement priority

You do not need a perfect CMDB before you start. A spreadsheet that is real beats a platform full of lies.

### 2. Separate supported from unsupported immediately

Do not lump everything into one giant “network refresh” someday bucket.

Create three lanes:

- **Patch now:** Supported devices with available fixes
- **Replace soon:** Devices approaching end-of-support
- **Remove urgently:** Devices already past support or impossible to secure properly

That middle bucket matters more than teams like to admit. Gear that is six months from support end is not “fine.” It is a procurement problem that just has not exploded yet.

### 3. Treat management plane exposure like a real incident risk

If your firewall, switch controller, VPN portal, or SD-WAN admin interface is exposed more broadly than necessary, fix that before lunch.

Practical moves here include:

- limiting admin access by source IP
- requiring MFA for management access
- disabling unused services and legacy protocols
- moving management behind a VPN or dedicated admin path
- reviewing local accounts and stale admin credentials
- validating logging is forwarding somewhere safe and retained appropriately

A lot of ugly edge compromises start with “we meant to lock that down later.” Later is a scam.

### 4. Put vendor lifecycle dates on the calendar now

Most teams are pretty good at reacting to incidents and pretty sloppy at reacting to time.

If a vendor support date is coming, that is not trivia. It should create a real project with budget, owner, replacement path, and maintenance planning attached to it. Unsupported edge devices are basically security exceptions with power cords.

### 5. Watch the stuff attackers are actually using

This is where a lot of programs get weirdly ceremonial. They talk about threat intelligence, then ignore the plain signals.

Start with:

- CISA’s [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- vendor advisories for your firewall, VPN, router, and SD-WAN stack
- CISA and FBI alerts focused on edge and identity abuse
- your own external attack surface scans

If an issue is internet-facing, actively exploited, and tied to authentication bypass or remote code execution, it jumps the line. That is not the time to debate whether next quarter feels better.

## A simple cleanup plan

<table>
  <thead>
    <tr>
      <th>Time frame</th>
      <th>What to do</th>
      <th>Why it matters</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Time frame">This week</td>
      <td data-label="What to do">Inventory every internet-facing firewall, router, VPN appliance, load balancer, wireless controller, and SD-WAN component. Confirm versions and support status.</td>
      <td data-label="Why it matters">You cannot reduce exposure you have not actually identified.</td>
    </tr>
    <tr>
      <td data-label="Time frame">This week</td>
      <td data-label="What to do">Review management interface exposure and restrict it hard. Add MFA where available.</td>
      <td data-label="Why it matters">Management plane exposure is a gift basket for attackers.</td>
    </tr>
    <tr>
      <td data-label="Time frame">This month</td>
      <td data-label="What to do">Patch supported devices, especially anything tied to active exploitation or KEV listings.</td>
      <td data-label="Why it matters">This cuts off known attack paths before they become incidents.</td>
    </tr>
    <tr>
      <td data-label="Time frame">This quarter</td>
      <td data-label="What to do">Create a replacement plan for unsupported or soon-to-be-unsupported gear, with budget and ownership attached.</td>
      <td data-label="Why it matters">End-of-support risk does not get better with age. It just gets cheaper for attackers.</td>
    </tr>
    <tr>
      <td data-label="Time frame">Ongoing</td>
      <td data-label="What to do">Track lifecycle dates as a standard operational process, not a surprise rediscovery project.</td>
      <td data-label="Why it matters">The healthiest network edge is the one that never quietly rots in production.</td>
    </tr>
  </tbody>
</table>

## Final thought

I think a lot of teams still talk about “the edge” like it is just plumbing. It is not. It is one of the most target-rich parts of the environment, and recent guidance is basically telling us to stop treating aging network gear like decorative infrastructure.

For MSPs, internal IT teams, and smaller organizations especially, this is one of the more practical security wins available right now. Inventory the edge. Patch what is supported. Replace what is not. Lock down management access. Track support dates like they actually matter, because they do.

Not every cyber problem can be solved with a checklist. This one can get a lot better with one.

And honestly, I would love to know what other teams are seeing here: are unsupported edge devices still one of the hardest things to get budget for, or has that finally started to change?
