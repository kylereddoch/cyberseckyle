---
date: 2026-01-23T10:00:00-05:00
title: Managing Vulnerabilities in an MSP Environment
description: A practical, MSP-ready vulnerability management program that scales across clients, handles zero-days sanely, and proves risk reduction with reporting that actually matters.
tags: [MSP, cybersecurity, vulnerability-management, risk-management, security-operations]
mastodon_url: https://infosec.exchange/@cyberseckyle/115945421540619528
---

{% image "/assets/images/vuln-hero-image.png", "Three-panel photo collage showing MSP-style vulnerability work: a warm-lit desk with a laptop and “Patch” sticky notes, hands holding a tablet in front of server racks with a vulnerability dashboard, and a notebook labeled “Critical / High / Medium” beside a laptop and phone.", "A snapshot of vulnerability management in an MSP world, patching, monitoring, and prioritizing risk across environments. (Image generated with ChatGPT.)", "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

MSPs don’t “manage vulnerabilities.” They manage *other people’s outages* that vulnerabilities become when you ignore them long enough. The trick is building a program that scales across many client environments without turning your team into a patching sweatshop. A lot of that risk gets especially ugly when it lives on forgotten edge gear, which is something I also talk about in [The Network Edge Cleanup Most Teams Cannot Keep Putting Off](/blog/the-network-edge-cleanup-most-teams-cannot-keep-putting-off/).

This is a field guide from the cybersecurity side of the house: how to run vulnerability management across clients, how to prioritize like a grown-up, and how to handle the latest “internet is on fire” CVEs without breaking trust or uptime.

## What makes MSP vulnerability management different

In-house IT usually has one environment and one culture. MSPs have dozens (or hundreds) of mini-civilizations:

* Different maintenance windows, app stacks, business hours, and risk tolerance
* A mix of modern cloud, crusty on-prem, and “this server has vibes” legacy systems
* Shared tooling that can amplify mistakes across tenants if you push bad changes
* Clients who want security, but also want their line-of-business app to keep breathing

So your program needs two things at once: **standardization** (so it scales) and **exceptions handling** (because reality always wins).

## The MSP vulnerability management lifecycle that actually works

### 1) Inventory first, scanning second

If you can’t answer “what do we manage,” your scans will lie to you.

Minimum inventory fields per asset:

* Owner (client, site, department)
* Asset type (endpoint, server, firewall, NAS, SaaS, hypervisor)
* Exposure (internet-facing, VPN-only, internal)
* Criticality (tier 0 identity, tier 1 server, tier 2 user endpoint, etc.)
* Patch mechanism (Windows Update, MDM, vendor firmware, manual)
* Maintenance window and reboot tolerance

This is where MSPs win by being boring. Standardize naming, tiers, and ownership so you can automate everything else.

### 2) Normalize findings into “one queue of work”

You’ll get vulnerabilities from:

* Vulnerability scanners (auth and unauth)
* EDR exposure views
* Patch management missing updates
* Firewall and appliance advisories
* Cloud security posture tools
* Vendor bulletins and CISA KEV

Pipe it into one place (PSA tickets, or a vulnerability board) with consistent fields:

* CVE (if available), product, affected version
* Known exploitation status (KEV, vendor-confirmed, or “no evidence”)
* Exposure (is it reachable from the internet?)
* Business impact (what breaks if we patch?)
* Recommended fix and compensating controls

This is also where MSPs get into trouble if they think only about endpoints and servers. Routers, firewalls, VPNs, and remote support tools belong in the same risk conversation because they are often the systems that make one weak control turn into a much larger incident.

### 3) Prioritize with “Exploitability + Exposure + Impact”

CVSS is useful, but not enough. In MSP land, these three questions beat everything:

1. **Is it being exploited?** Start with CISA’s Known Exploited Vulnerabilities catalog: if it’s in KEV, attackers are already cashing checks. (Use the [KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) as your “drop everything” reference.) ([CISA][1])
2. **Is it exposed?** Internet-facing appliances and management interfaces get prioritized above internal-only issues.
3. **Would compromise hurt?** Identity systems, remote access, firewalls, backups, and admin tooling are always high impact.

### 4) Remediate with SLAs, not vibes

You need agreed timelines that clients sign up for. Here’s a solid MSP baseline:

<section class="grid" aria-label="Vulnerability remediation SLAs" data-layout="50-50">
  <div class="custom-card">
    <h4>P0: Actively exploited</h4>
    <p><strong>Target SLA:</strong> 24–72 hours</p>
    <p><strong>Triggers:</strong> In CISA KEV, vendor confirms active exploitation, or credible exploitation observed</p>
    <p><strong>Typical actions:</strong> Patch fast, or isolate or disable exposure immediately, then patch; hunt for IOCs</p>
    <footer><strong>Client communication:</strong> Same day notice, approval if downtime risk</footer>
  </div>

  <div class="custom-card">
    <h4>P1: Critical exposure</h4>
    <p><strong>Target SLA:</strong> 7 days</p>
    <p><strong>Triggers:</strong> Critical auth bypass or RCE on internet-facing systems, no confirmed exploitation yet</p>
    <p><strong>Typical actions:</strong> Patch in next window; add compensating controls until then</p>
    <footer><strong>Client communication:</strong> Planned maintenance notice</footer>
  </div>

  <div class="custom-card">
    <h4>P2: High</h4>
    <p><strong>Target SLA:</strong> 30 days</p>
    <p><strong>Triggers:</strong> High severity, internal-only, or mitigated by strong controls</p>
    <p><strong>Typical actions:</strong> Bundle with monthly patching; verify after reboot cycles</p>
    <footer><strong>Client communication:</strong> Included in monthly report</footer>
  </div>

  <div class="custom-card">
    <h4>P3: Moderate or Low</h4>
    <p><strong>Target SLA:</strong> 60–90 days</p>
    <p><strong>Triggers:</strong> Lower severity or hard-to-exploit issues</p>
    <p><strong>Typical actions:</strong> Cleanup during normal lifecycle work</p>
    <footer><strong>Client communication:</strong> Trend reporting</footer>
  </div>
</section>

The important part is not the exact numbers. The important part is you can defend them in a breach review without sweating through your shirt.

### 5) Verify and close the loop

A vulnerability is not “fixed” because someone clicked “install updates.” It’s fixed when:

* The version actually changed
* The scanner verifies remediation (or you validate via package/version inventory)
* You confirm the exposure is gone (especially for internet-facing systems)
* You captured evidence in the ticket (before/after)

## The “90-minute drill” for MSP zero-days

When a big vulnerability drops, chaos is optional. Run a repeatable drill:

1. **Triage the advisory**
   Confirm scope, affected versions, exploitation status, and official mitigations. Prefer primary sources: vendor bulletins, CISA alerts/advisories, NVD.

2. **Identify exposed assets across all clients**
   Use your inventory, external scanning, and configs. Internet-facing always first.

3. **Pick the fastest safe risk reduction**

   * If a patch exists and is stable, schedule emergency maintenance.
   * If patching is risky, apply mitigations immediately (disable a feature, restrict management access, block at edge), then patch in a controlled window.

4. **Hunt quickly, don’t panic**
   Review logs and telemetry relevant to the product. Focus on:

   * New admin users
   * Suspicious auth events
   * Unexpected config changes
   * Web shell indicators on appliances
   * Outbound traffic anomalies

5. **Communicate like a professional**
   Clients do not need fear. They need:

   * What it is
   * Whether they are exposed
   * What you are doing now
   * When patching happens
   * Whether any downtime is expected

## Recent real-world vulnerabilities MSPs should care about

Below are examples that fit the MSP pain profile: edge devices, remote access, and tooling used across many customers.

### Ivanti Connect Secure RCE: CVE-2025-22457

CISA published an alert about **CVE-2025-22457** impacting Ivanti Connect Secure, Policy Secure, and ZTA Gateways. It’s a remote unauthenticated issue with serious impact, and it was important enough to be tracked through CISA channels quickly. Review CISA’s alert for version guidance and remediation direction. ([CISA alert](https://www.cisa.gov/news-events/alerts/2025/04/04/ivanti-releases-security-updates-connect-secure-policy-secure-zta-gateways-vulnerability-cve-2025), plus [NVD entry](https://nvd.nist.gov/vuln/detail/CVE-2025-22457)). ([CISA][2])

How to protect clients:

* Patch to fixed versions immediately
* Treat VPN and ZTNA appliances as high-value targets: restrict management interfaces, enforce MFA, and segment management paths
* If you cannot patch within SLA, remove internet exposure or apply vendor mitigations right now, not “next week”

### Palo Alto PAN-OS auth bypass: CVE-2025-0108

Palo Alto Networks documented **CVE-2025-0108**, an authentication bypass in PAN-OS management web interfaces, and noted observed exploit attempts in the wild (including chaining with other issues). ([Vendor advisory](https://security.paloaltonetworks.com/CVE-2025-0108), and [NVD entry](https://nvd.nist.gov/vuln/detail/cve-2025-0108)). ([Palo Alto Networks Security][3])

How to protect clients:

* Never leave firewall management interfaces exposed to the internet unless there is a truly unavoidable reason
* Restrict admin access by source IP, VPN, or a dedicated management network
* Patch promptly and review admin activity and configuration change logs after patching

### Fortinet authentication bypass exploited: CVE-2025-59718 and CVE-2025-59719

Fortinet edge devices are popular and therefore constantly probed. Rapid7 reported active exploitation of **CVE-2025-59718** and **CVE-2025-59719** on exposed FortiGate devices. ([Rapid7 analysis](https://www.rapid7.com/blog/post/etr-critical-vulnerabilities-in-fortinet-cve-2025-59718-cve-2025-59719-exploited-in-the-wild/)). ([Rapid7][4])

How to protect clients:

* Patch immediately across all affected tenants
* Reduce exposure: lock down admin interfaces, confirm MFA, and limit any SSO features per vendor guidance
* Check telemetry for suspicious auth patterns and configuration changes

### Citrix NetScaler exploited vulnerability: CVE-2025-7775

Citrix warned that **CVE-2025-7775** exploitation was observed on unmitigated appliances and urged rapid upgrades. ([Citrix bulletin](https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX694938), plus [Rapid7 summary](https://www.rapid7.com/blog/post/etr-cve-2025-7775-critical-netscaler-vulnerability-exploited-in-the-wild/)). ([Citrix Support][5])

How to protect clients:

* Patch appliances urgently, especially when configured as gateway/AAA services
* Validate the appliance is running the fixed build, not just “we uploaded firmware”
* Add post-change checks: config integrity, admin accounts, session handling

### ConnectWise ScreenConnect: CVE-2025-3935

This one matters for MSPs because it’s *your* remote access fabric. NVD describes **CVE-2025-3935** as a ViewState code injection risk affecting certain ScreenConnect versions. ([NVD entry](https://nvd.nist.gov/vuln/detail/cve-2025-3935)). ([NVD][6])

How to protect your MSP and your clients:

* Patch ScreenConnect aggressively and keep it on a tight update cadence
* Enforce MFA for all admin access, reduce plugin/extension risk, and monitor for suspicious sessions
* Separate tenant instances where feasible and protect your admin plane like it’s production money (because it is)

### ConnectWise Automate: enforce secure agent communications

ConnectWise released a security fix for Automate that focuses on preventing interception/tampering risks by enforcing HTTPS for agent communications. ([ConnectWise bulletin](https://www.connectwise.com/company/trust/security-bulletins/connectwise-automate-2025.9-security-fix)). ([ConnectWise][7])

How to protect clients:

* Upgrade Automate to versions that enforce secure transport
* Audit agents still using insecure paths, especially across on-prem networks with shared infrastructure
* Treat RMM as tier-0 infrastructure: it can deploy “help” to every endpoint, including malicious help

### Windows zero-day example: CVE-2025-62221

Microsoft’s December 2025 updates included an actively exploited Windows zero-day, **CVE-2025-62221**, covered in detail by Krebs’ Patch Tuesday write-up. ([Krebs on Security](https://krebsonsecurity.com/2025/12/microsoft-patch-tuesday-december-2025-edition/), plus [Tenable’s Patch Tuesday analysis](https://www.tenable.com/blog/microsofts-december-2025-patch-tuesday-addresses-56-cves-cve-2025-62221)). ([krebsonsecurity.com][8])

How to protect clients:

* Maintain a reliable monthly patch rhythm, but allow emergency out-of-band pushes for exploited issues
* Confirm reboot completion and patch compliance, especially for laptops that love sleeping through maintenance windows
* Use least privilege and credential protections so “EoP” vulnerabilities don’t become full domain takeovers

## Compensating controls when patching is slow or risky

Sometimes patching immediately is not possible. Fine. Then you **buy down risk** until it is.

Strong compensating controls MSPs can apply fast:

* Remove internet exposure for management interfaces
* Restrict admin portals by source IP and VPN only
* Disable optional services and legacy protocols
* Turn on MFA everywhere, especially remote access and admin tools
* Segment: user networks should not talk to management networks
* Increase logging and alerting around the vulnerable component
* Add temporary WAF/IPS signatures where available, but do not treat that as “patched”

Document these in the ticket as “temporary controls,” with an expiration date. Exceptions should rot if they are left in the dark.

## Reporting that clients actually understand

Stop sending clients a 40-page scan export and calling it a day.

Give them:

* Vulnerabilities by **priority tier** (P0–P3)
* Aging: how many exceeded SLA
* Coverage: percentage of managed assets scanned and patched
* A short narrative: “What changed this month and why it matters”
* A section called **Internet-facing risk**, because that’s where the monsters live

If you want one killer metric: track “Time to Remediate” for P0 and P1 across all clients. It’s the closest thing to a heartbeat for your program.

## Opinionated MSP takeaways

If you run an MSP vulnerability program like a compliance checkbox, you will eventually get boxed in by a real incident. The winning pattern is:

* Standardize the lifecycle and SLAs
* Treat edge devices and remote tooling as tier-0
* Use KEV and vendor exploitation signals to drive emergency work
* Prove remediation with verification, not hope
* Communicate clearly, early, and without theatrics

Security is not magic. It’s mostly ruthless consistency applied to messy systems run by messy humans. The good news is MSPs are built for consistency, once you stop reinventing the wheel per client.

[1]: https://www.cisa.gov/known-exploited-vulnerabilities-catalog?utm_source=chatgpt.com "Known Exploited Vulnerabilities Catalog"
[2]: https://www.cisa.gov/news-events/alerts/2025/04/04/ivanti-releases-security-updates-connect-secure-policy-secure-zta-gateways-vulnerability-cve-2025?utm_source=chatgpt.com "Ivanti Releases Security Updates for Connect ..."
[3]: https://security.paloaltonetworks.com/CVE-2025-0108?utm_source=chatgpt.com "CVE-2025-0108 PAN-OS: Authentication Bypass in the ..."
[4]: https://www.rapid7.com/blog/post/etr-critical-vulnerabilities-in-fortinet-cve-2025-59718-cve-2025-59719-exploited-in-the-wild/?utm_source=chatgpt.com "Critical vulnerabilities in Fortinet CVE-2025-59718 ..."
[5]: https://support.citrix.com/support-home/kbsearch/article?articleNumber=CTX694938&utm_source=chatgpt.com "Citrix Security Bulletin – CVE-2025-7775, ..."
[6]: https://nvd.nist.gov/vuln/detail/cve-2025-3935?utm_source=chatgpt.com "CVE-2025-3935 Detail - NVD"
[7]: https://www.connectwise.com/company/trust/security-bulletins/connectwise-automate-2025.9-security-fix?utm_source=chatgpt.com "ConnectWise Automate 2025.9 Security Fix"
[8]: https://krebsonsecurity.com/2025/12/microsoft-patch-tuesday-december-2025-edition/?utm_source=chatgpt.com "Microsoft Patch Tuesday, December 2025 Edition"
