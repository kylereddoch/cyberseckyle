---
date: 2026-01-24T019:30:00-05:00
title: 'Cybersecurity Weekly Roundup: January 17-24, 2026'
description: "Cisco Unified CM zero-day exploitation, Fortinet SSO abuse, Zoom and GitLab patches, telnetd auth-bypass attacks, plus breach and platform weirdness you should not ignore."
tags: [cybersecurity, infosec, vulnerability-management, incident-response, ransomware, phishing, zero-days]
mastodon_url:
---

{% image "/assets/images/cybersec_weekly_roundup.png", "“Cybersecurity Weekly Roundup” showing a glowing shield with a keyhole over a world map, surrounded by digital interface icons and data streams.", "Cybersecurity Weekly Roundup — the week’s biggest security news, distilled into signal and next steps. (Image generated with ChatGPT)", "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

## 🧭 Overview

The last seven days were loud in all the usual places: Cisco patched an actively exploited Unified CM zero-day and CISA tracked more exploited bugs, Fortinet admins dealt with SSO feature abuse, and Zoom and GitLab shipped fixes that defenders should treat as “today, not someday.” Meanwhile, telnetd reminded everyone that “legacy service” is sometimes just code for “free root,” Zendesk got used as a spam cannon, and browser extensions kept proving they are tiny supply chain time bombs. Here’s the signal, minus the noise.

## 🔥 Critical exploitation and patch-now vulnerabilities

### 1) Cisco Unified CM zero-day exploited in the wild (CVE-2026-20045)

**Brief:** Cisco released fixes for an actively exploited flaw impacting Unified Communications products and related components ([coverage](https://thehackernews.com/2026/01/cisco-fixes-actively-exploited-zero-day.html)).

**My take:** UC platforms sit in a nasty spot: high privilege, often internet-adjacent, and tied to identity and call routing. If an attacker gets code execution here, you are not just losing uptime, you are losing trust in voice workflows and potentially credentials. Treat this like “edge device severity,” even if it lives in a “telephony” mental bucket.  

**Action:** Patch immediately, then hunt for post-exploitation: new local admins, unusual web UI access, and config exports. Confirm the vuln is tracked in CISA KEV to drive internal urgency ([KEV catalog entry](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)).

### 2) Fortinet FortiGate SSO feature abuse creates rogue admins

**Brief:** Reports show automated attacks abusing FortiGate SSO behavior to create unauthorized admin accounts and steal firewall config data ([summary](https://www.techradar.com/pro/security/fortinet-fortigate-devices-hit-in-automated-attacks-which-create-rogue-accounts-and-steal-firewall-data)).  

**My take:** “Steal the config” is a criminally underrated objective. If an attacker gets your rules, VPN settings, and identity integrations, they can map your environment better than your documentation does. This is especially painful for MSP-style multi-tenant ops where patterns repeat.  

**Action:** Audit admin users (especially recently created), review config export logs, and follow vendor mitigations while waiting on definitive patched builds. Reduce external management exposure wherever possible.

### 3) Zoom Node MMR RCE (CVE-2026-22844) is the kind of bug attackers love

**Brief:** Zoom patched a critical command injection issue impacting Node Multimedia Routers that could enable RCE by a meeting participant ([details](https://thehackernews.com/2026/01/zoom-and-gitlab-release-security.html)).  

**My take:** Any vuln that turns “participant” into “code execution” is spicy. On-prem and hybrid meeting infrastructure is often treated as “just conferencing,” which means it is frequently under-monitored compared to core servers. Attackers enjoy that gap.  

**Action:** Patch nodes fast, confirm versions, and add monitoring around node management interfaces and process/network anomalies on the hosts running them.

### 4) GitLab 2FA bypass (CVE-2026-0723) plus DoS bugs

**Brief:** GitLab released fixes for a high-severity 2FA bypass and multiple DoS issues in CE/EE ([official release notes](https://about.gitlab.com/releases/2026/01/21/patch-release-gitlab-18-8-2-released/)).  

**My take:** Source control is a crown jewel. A 2FA bypass is not just account takeover, it is pipeline takeover, secrets exposure, and the start of a supply chain incident. If you self-host, you do not get to procrastinate.  

**Action:** Upgrade to a fixed version, rotate tokens where feasible, and verify MFA enforcement settings. If your GitLab is internet-exposed, assume you are on a short clock.

### 5) GNU InetUtils telnetd auth bypass is being actively exploited (CVE-2026-24061)

**Brief:** A critical telnetd flaw allows remote authentication bypass and root compromise, and active exploitation has been observed ([reporting](https://www.bleepingcomputer.com/news/security/hackers-exploit-critical-telnetd-auth-bypass-flaw-to-get-root/)).  

**My take:** Telnet is the security equivalent of leaving your house keys under a rock, then being shocked the raccoons learned where the rock is. The bigger issue is asset hygiene: if telnetd exists in your environment, what else is living in 2004?  

**Action:** Disable telnet services outright where possible. Where you cannot, patch immediately and firewall it to the ground. Sweep for exposed telnet ports, especially on “appliance-ish” Linux boxes.

### 6) HPE OneView RCE (CVE-2025-37164) seeing botnet-style exploitation

**Brief:** Check Point reported a surge in exploitation attempts shortly after patching, tied to botnet activity targeting HPE OneView ([coverage](https://www.techradar.com/pro/security/new-botnet-targets-hpe-oneview-vulnerability-so-patch-now)).  

**My take:** Management planes are a top-tier target because they turn “one compromised server” into “control the fleet.” Botnet exploitation also means low effort for attackers, which usually means high volume for defenders.  

**Action:** Patch, then segment: restrict management interfaces to admin networks, add MFA where supported, and review logs for suspicious auth and process execution.

## 🧩 Actively exploited vulnerabilities and the “patch priority list”

### 7) CISA adds four more vulnerabilities to KEV

**Brief:** CISA added multiple actively exploited vulnerabilities to the Known Exploited Vulnerabilities catalog ([alert](https://www.cisa.gov/news-events/alerts/2026/01/22/cisa-adds-four-known-exploited-vulnerabilities-catalog)).  

**My take:** KEV is one of the closest things we have to an evidence-based “drop what you’re doing” list. If your patch program does not treat KEV as a priority lane, you are doing patching like it is 2012.  

**Action:** Cross-check your vuln scanner results against KEV weekly, and make KEV items a formal SLA. If you are an MSP, KEV should be the default drumbeat across tenants.

## 🪪 Identity attacks and social engineering

### 8) Okta warns on custom vishing kits targeting SSO credentials

**Brief:** Okta reported real-time vishing-enabled phishing kits targeting SSO accounts, designed to capture creds and walk victims through MFA in the moment ([report](https://www.bleepingcomputer.com/news/security/okta-sso-accounts-targeted-in-vishing-based-data-theft-attacks/)).  

**My take:** This is “help desk cosplay” at scale. If your org still treats phone calls as inherently trustworthy, attackers will keep printing access. The future is not just phishing-resistant MFA. It is process-resistant humans.  

**Action:** Move high-risk users to phishing-resistant MFA (passkeys or FIDO2). Add conditional access rules, network zones, and help desk verification steps that cannot be socially engineered in 30 seconds.

### 9) ShinyHunters claims credit for the SSO vishing wave

**Brief:** The ShinyHunters extortion group claims it is behind the ongoing voice-phishing attacks targeting SSO accounts for data theft and extortion ([coverage](https://www.bleepingcomputer.com/news/security/shinyhunters-claim-to-be-behind-sso-account-data-theft-attacks/)).  

**My take:** Attribution claims are marketing, but they still matter operationally because they shape the extortion playbook. Even if the claim is partly hype, the technique is real and it works.  

**Action:** Make “verify the caller” training concrete: approved callback numbers, ticket validation, and a policy that security never asks for MFA codes. Enforce it.

## 🧪 Platform abuse and ecosystem weirdness

### 10) Zendesk abused as a spam cannon via ticket confirmations

**Brief:** Attackers abused unauthenticated ticket submission flows to generate floods of legitimate Zendesk emails, bypassing typical spam filtering ([analysis](https://www.malwarebytes.com/blog/news/2026/01/spammers-abuse-zendesk-to-flood-inboxes-with-legitimate-looking-emails-but-why)).  

**My take:** This is a reminder that “legitimate SaaS” can still be weaponized as a delivery mechanism. Today it is spam noise. Tomorrow it is brand impersonation and credential capture once victims get conditioned to click.  

**Action:** If you run Zendesk or similar, lock down guest ticket submission controls, add rate limiting, and monitor for spikes in ticket creation and outbound email volume.

### 11) Malicious browser extensions campaign hits 840,000+ users

**Brief:** Researchers uncovered a batch of malicious extensions across Chrome, Firefox, and Edge used to monitor behavior and install backdoors ([coverage](https://www.techradar.com/pro/security/more-malicious-browser-extensions-uncovered-chrome-firefox-and-edge-all-affected)).  

**My take:** Extensions are shadow IT with permissions. In a SaaS-heavy world, that means they are often identity-adjacent too. Blocking “obviously bad” extensions is not enough, because the long game is: look legitimate, act quietly, exfiltrate later.  

**Action:** Enforce an allowlist for extensions in managed browsers, audit installed extensions regularly, and treat browser telemetry as security telemetry.

## 🏦 Breaches and fallout worth tracking

### 12) Under Armour investigating a breach tied to 72M customer records

**Brief:** Under Armour is investigating breach claims after customer data surfaced, with reporting tied to Have I Been Pwned listings ([AP reporting](https://apnews.com/article/6155a46363679c28af4d612ad3f23e36)).  

**My take:** Even when passwords and payment data are not involved, large-scale email and profile leaks fuel highly targeted phishing. Retail brand trust becomes a weapon against users, and then against enterprises through password reuse and social engineering.  

**Action:** For users: unique passwords and phishing awareness. For orgs: watch for Under Armour themed lures in email gateways and user reports.

### 13) Ingram Micro discloses ransomware incident impacting 42,000+ people

**Brief:** Ingram Micro reported a ransomware-related data exposure affecting tens of thousands of individuals ([coverage](https://www.techradar.com/pro/security/ingram-micro-reveals-ransomware-attack-hit-42-000-people-heres-how-to-find-out-more)).  

**My take:** Distribution and IT supply chain companies are high-leverage targets. A breach here is not just their problem. It can become downstream fraud, vendor impersonation, and partner compromise attempts.  

**Action:** If you work with major distributors, tighten vendor email verification, update account contact procedures, and watch for invoice or banking detail change scams.

### 14) CIRO breach confirmation affects roughly 750,000 investors

**Brief:** Canada’s CIRO confirmed a breach impacting hundreds of thousands of investors and sensitive information ([reporting](https://therecord.media/canada-ciro-investing-regulator-confirms-data-breach)).  

**My take:** Regulators are part of your extended enterprise whether you like it or not. This is the uncomfortable lesson: the more entities that hold sensitive identity and financial data, the more “third-party risk” becomes “everyone risk.”  

**Action:** For individuals: take monitoring offers seriously. For defenders: treat regulator notifications and portals as potential phishing vectors and add user warnings accordingly.

## 🌍 Industry signals and research that matter long-term

### 15) Pwn2Own Automotive 2026 drops 76 new zero-days

**Brief:** Pwn2Own Automotive 2026 awarded over $1M for 76 unique zero-day vulnerabilities across automotive and related tech ([ZDI results](https://www.zerodayinitiative.com/blog/2026/1/23/pwn2own-automotive-2026-day-three-results-and-the-master-of-pwn)).  

**My take:** Cars are computers now, chargers are networked, and the attack surface is sprinting ahead of defensive maturity. The lesson for the rest of IT: if your products are becoming “smart,” your threat model must grow up quickly too.  

**Action:** If you support fleets, EV infrastructure, or IoT-adjacent environments, push for segmentation, strong update mechanisms, and vendor security commitments in contracts.

## ✅ Reality check

- **Are we patched where the internet can touch us?** Edge devices, admin portals, remote access, and anything sitting in front of identity or backups.
- **Are we logging the systems attackers actually target?** Not just endpoints. Management planes, firewalls, VPNs, email, SSO, and backup infrastructure need visibility.
- **Do we know if “patched” also means “clean”?** Validate: review new admin accounts, config exports, unexpected logins, and suspicious process activity after patching.
- **Did we reduce exposure, or just update software?** If management interfaces are still broadly reachable, you’re patching a door while leaving windows open.
- **Can we restore fast if this week’s patch becomes next week’s incident?** Backups verified, restore tested, credentials protected, and recovery steps documented.