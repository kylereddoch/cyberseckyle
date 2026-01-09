---
date: 2026-01-09T14:00:00-05:00
title: "Cybersecurity Weekly Roundup: January 2-9, 2026"
description: "Fifteen stories worth your time this week: KEV updates, high-impact patches, browser ecosystem abuse, and a few reminders that old gear never dies, it just becomes a botnet."
tags: [cybersecurity, cybersecurity weekly roundup, vulnerabilities, incident-response, news]
mastodon_url: ""
---

> New year, same attackers. I’m kicking the Weekly Roundup back into gear for 2026 so we can track what actually matters: the patches worth prioritizing, the campaigns worth watching, and the patterns worth learning from. No doom-scrolling. Just signal.

{% image "/assets/images/cybersec_weekly_roundup.png", "“Cybersecurity Weekly Roundup” showing a glowing shield with a keyhole over a world map, surrounded by digital interface icons and data streams.", "Cybersecurity Weekly Roundup — the week’s biggest security news, distilled into signal and next steps. (Image generated with ChatGPT)", "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

## 🧭 Overview

The last seven days were patch-heavy and attacker-friendly. CISA formally retired a stack of Emergency Directives, but KEV kept moving with newly confirmed exploitation across both modern enterprise tooling and some very old Microsoft Office baggage. Meanwhile, edge and automation platforms (Veeam, Trend Micro Apex Central, n8n, Cisco ISE, legacy D-Link gateways) were the main characters again. On the “humans are the attack surface” front, internal-domain phishing and malicious Chrome extensions both got louder. Here’s the signal, minus the noise.

### 🔥 Patches and KEV moves

#### 1) CISA retired ten Emergency Directives (2019-2024)
**Brief:** [CISA retired ten Emergency Directives](https://www.cisa.gov/news-events/news/cisa-retires-ten-emergency-directives-marking-era-federal-cybersecurity), effectively closing the book on a specific era of “drop everything and patch this now” federal coordination.

**My take:** This is good housekeeping, but it is also a reminder: emergency patch governance only works when you convert “emergency behavior” into “normal behavior.” If your org only responds fast when the sirens are on, you do not have a program, you have adrenaline.

**Action:**
- Treat this as a prompt to review your own “directive-like” playbooks for critical patching.
- Confirm you can identify internet-facing assets and owners fast, without a spreadsheet scavenger hunt.

#### 2) KEV added a fresh HPE OneView RCE and a very old PowerPoint RCE
**Brief:** [CISA added two vulnerabilities to the KEV Catalog](https://www.cisa.gov/news-events/alerts/2026/01/07/cisa-adds-two-known-exploited-vulnerabilities-catalog), including a critical [HPE OneView RCE (CVE-2025-37164)](https://support.hpe.com/hpesc/public/docDisplay?docId=hpesbgn04985en_us&docLocale=en_US) and the ancient but now relevant again [PowerPoint RCE (CVE-2009-0556)](https://nvd.nist.gov/vuln/detail/CVE-2009-0556).

**My take:** Attackers love “weird old stuff” because defenders forget it exists. KEV adding a 2009 Office bug is the cybersecurity version of finding a live grenade in a junk drawer. Also, OneView is high-leverage infrastructure management. If you run it, you do not get to be casual.

**Action:**
- Check the [KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) for your environment, not just for headlines.
- If you still have legacy Office installs around, validate what is actually installed and supported.
- If you run OneView, prioritize HPE’s fix path immediately.

#### 3) Legacy D-Link DSL gateways are being actively exploited for unauthenticated RCE
**Brief:** D-Link published [SAP10488](https://supportannouncement.us.dlink.com/security/publication.aspx?name=SAP10488) for [CVE-2026-0625](https://nvd.nist.gov/vuln/detail/CVE-2026-0625), and multiple reports indicate active exploitation against end-of-life gear.

**My take:** “End of life” is not a label, it is a risk decision. Legacy gateways are perfect botnet fodder because they sit at the edge, rarely get monitored, and often stay deployed until lightning strikes.

**Action:**
- Replace EOL gateways. Hard opinion: stop trying to “secure” abandoned hardware with hope and firewall rules.
- If you cannot replace immediately, isolate management interfaces and restrict inbound exposure aggressively.

#### 4) Cisco ISE patched a vulnerability with public PoC
**Brief:** Cisco issued fixes after a public proof-of-concept for [CVE-2026-20029](https://nvd.nist.gov/vuln/detail/CVE-2026-20029) in Identity Services Engine (ISE) and ISE-PIC gained attention ([coverage here](https://thehackernews.com/2026/01/cisco-patches-ise-security.html)).

**My take:** Even “medium” bugs can be operationally nasty when they sit inside identity and access control plumbing. Also, PoC availability changes risk rapidly, because opportunistic attackers love copying homework.

**Action:**
- Patch ISE per Cisco’s guidance as soon as practical, especially if admin interfaces are broadly reachable.
- Review who has admin credentials and how those creds are protected (MFA, device compliance, admin tiering).

#### 5) Trend Micro Apex Central shipped critical fixes (multiple CVEs)
**Brief:** Trend Micro released a patch for Apex Central addressing multiple issues, including [CVE-2025-69258](https://nvd.nist.gov/vuln/detail/CVE-2025-69258). Trend’s advisory is [here](https://success.trendmicro.com/en-US/solution/KA-0022071), with supporting research from [Tenable](https://www.tenable.com/security/research/tra-2026-01).

**My take:** Central management consoles are “one-to-many” compromise multipliers. If an attacker gets code execution on a central console, you are often one bad afternoon away from fleet-wide pain.

**Action:**
- Patch Apex Central first, then validate console hardening (network location, admin access constraints).
- Confirm logs from the console flow into your SIEM with alerts for unusual process execution.

#### 6) Veeam patched a high-impact RCE path involving operator roles
**Brief:** Veeam published [KB4792](https://www.veeam.com/kb4792) covering [CVE-2025-59470](https://nvd.nist.gov/vuln/detail/CVE-2025-59470), describing how a Backup or Tape Operator role could be abused for remote code execution as `postgres`.

**My take:** Backup infrastructure is the crown-jewel target in ransomware playbooks. Any bug that turns “operator-level access” into “code execution” should be treated as urgent because attackers routinely aim for backup systems early.

**Action:**
- Patch Veeam and then review role assignments (especially operator roles).
- Restrict admin and operator access to dedicated management networks or jump hosts.

#### 7) n8n had a rough week: critical authless exposure plus a serious sandbox escape
**Brief:** n8n disclosed a vulnerability affecting certain form-based workflows ([CVE-2026-21858](https://nvd.nist.gov/vuln/detail/CVE-2026-21858)), with the vendor advisory [here](https://community.n8n.io/t/security-advisory-security-vulnerability-in-n8n-versions-1-65-1-120-4/247305). Separately, reporting also highlighted a high-severity sandbox bypass in the Python Code Node ([coverage](https://www.techradar.com/pro/security/a-critical-n8n-flaw-has-been-discovered-heres-how-to-stay-safe)).

**My take:** Automation tools sit in the middle of everything: APIs, credentials, internal systems, and workflows that quietly run the business. That makes them incredible targets. If you self-host automation, you are effectively running a mini integration platform. Treat it like infrastructure, not a toy.

**Action:**
- Update n8n to the fixed versions and validate exposed forms and endpoints.
- Audit stored credentials and secrets used by workflows, rotate anything high-value if exposure is suspected.
- Limit who can create or edit workflows, and monitor workflow changes like code changes.

### 🧨 Active campaigns and attacker tradecraft

#### 8) “Internal-looking” phishing is surging because of routing and spoofing misconfigurations
**Brief:** Microsoft published a strong write-up on how attackers exploit complex routing and weak spoof protections to make phishing emails look internal: [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/01/06/phishing-actors-exploit-complex-routing-and-misconfigurations-to-spoof-domains/).

**My take:** This is one of those “not a product vulnerability, but you are still owned” situations. When mail flow gets complicated, organizations accidentally create trust gaps. Attackers go shopping in those gaps.

**Action:**
- Enforce SPF, DKIM, and DMARC correctly (and actually move toward DMARC reject where feasible).
- Review connectors, relays, and hybrid routing rules for paths that bypass spoof protections.
- Add user-facing indicators and training around “looks internal” social engineering.

#### 9) Malicious Chrome extensions are harvesting LLM chats and browsing data at scale
**Brief:** Multiple reports describe malicious extensions posing as AI helpers, siphoning conversations and browsing data ([Dark Reading](https://www.darkreading.com/cloud-security/fake-ai-chrome-extensions-steal-900k-users-data), [The Hacker News](https://thehackernews.com/2026/01/two-chrome-extensions-caught-stealing.html)).

**My take:** Browser extensions have quietly become one of the most under-governed enterprise attack surfaces. Add in AI tool hype and you get a perfect storm: users install “productivity” add-ons that can see everything.

**Action:**
- Lock down extension installs via browser enterprise policies where possible.
- Maintain an allowlist for extensions, and treat AI-related extensions as high-risk by default.
- Remind teams that sensitive data typed into web apps is still data leaving the org.

#### 10) Kimwolf botnet: millions of Android devices exposed via ADB
**Brief:** Research points to widespread exposure of Android Debug Bridge leading to large-scale compromise and botnet growth ([Synthient analysis](https://synthient.com/blog/a-broken-system-fueling-botnets)).

**My take:** The internet never forgets a misconfiguration. Anything that turns “debug access” into “remote access” at scale becomes instant botnet infrastructure. The scary part is how boring the root cause is.

**Action:**
- If you manage Android fleets, ensure ADB is disabled and device management policies enforce it.
- For networks, watch for unusual outbound traffic patterns consistent with botnet C2 behavior.

#### 11) ClickFix social engineering: fake BSODs leading to RAT deployment
**Brief:** Securonix detailed a campaign using fake system error prompts (including fake BSOD style lures) to trick users into running attacker-provided commands and ultimately deploying malware: [Securonix write-up](https://www.securonix.com/blog/analyzing-phaltblyx-how-fake-bsods-and-trusted-build-tools-are-used-to-construct-a-malware-infection/).

**My take:** Social engineering is evolving into “guided compromise.” Instead of a simple attachment, attackers walk users through the steps, often using very believable UI theatre. This is exactly why least privilege and application control matter.

**Action:**
- Consider application control for high-risk user groups and environments.
- Train helpdesk teams on recognizing “fake crash” playbooks and how to respond fast.

#### 12) VMware ESXi exploit toolkit appears to pre-date public disclosure by a year
**Brief:** Reporting indicates attackers used a compromised SonicWall VPN foothold to deploy an ESXi exploit toolkit that likely existed long before the relevant ESXi bugs were publicly disclosed ([BleepingComputer](https://www.bleepingcomputer.com/news/security/vmware-esxi-zero-days-likely-exploited-a-year-before-disclosure/), plus [IBM X-Force OSINT](https://exchange.xforce.ibmcloud.com/osint/guid%3A45c7ce985f9944a499f2949cd76e8b88)).

**My take:** This is the nightmare scenario for defenders: “unknown exploitation window” plus virtualization infrastructure. If a threat actor can break out of guest VMs to the host layer, containment assumptions get weird fast.

**Action:**
- Patch ESXi aggressively and inventory exposed management surfaces.
- Review VPN and remote access logs for unusual pivot activity and privileged account abuse.
- Validate backup integrity and segmentation around hypervisor management.

### 🧩 Supply chain and ecosystem risk

#### 13) NodeCordRAT: malicious npm packages targeting crypto workflows and secrets
**Brief:** Zscaler ThreatLabz documented malicious npm packages delivering NodeCordRAT and stealing credentials and secrets: [Zscaler report](https://www.zscaler.com/blogs/security-research/malicious-npm-packages-deliver-nodecordrat).

**My take:** This is supply chain risk at its purest: developers install a thing, the thing installs another thing, and suddenly your environment is bleeding tokens. If you build software, dependency hygiene is not optional.

**Action:**
- Use package allowlisting and lockfiles, and scan dependencies in CI.
- Watch for post-install scripts and unusual outbound connections during builds.
- Rotate exposed secrets and enforce short-lived tokens wherever possible.

#### 14) Ledger customer order data exposed via third-party Global-e incident
**Brief:** Ledger posted a notice about a third-party incident impacting order-related data: [Ledger support article](https://support.ledger.com/article/Global-e-Incident-to-Order-Data---January-2026). Additional coverage appeared in mainstream outlets ([Yahoo Finance](https://finance.yahoo.com/news/protocol-ledger-customer-data-breached-162038171.html)).

**My take:** Third-party incidents are inevitable. The difference between “annoying” and “catastrophic” is what data you share, how you segment vendors, and how quickly you detect and notify. For customers, this kind of exposure also supercharges phishing.

**Action:**
- Expect follow-on phishing if you are in the affected cohort. Verify messages out-of-band.
- For orgs: re-check vendor data minimization and incident notification clauses.

### 🧱 Browser and platform hardening

#### 15) Chrome shipped its first 2026 Stable update with security fixes
**Brief:** Google pushed a Stable update for desktop on January 6 ([Chrome Releases](https://chromereleases.googleblog.com/2026/01/stable-channel-update-for-desktop.html)), and reporting notes the fixed issue was not confirmed exploited at the time ([PCWorld coverage](https://www.pcworld.com/article/3025747/chrome-fixes-a-problematic-security-flaw-in-first-update-of-2026.html)).

**My take:** Browser patch cadence is still one of the best ROI security moves you get for free. The trick is consistency: fast rollout, staged testing, and forcing updates in managed environments.

**Action:**
- Confirm Chrome auto-update is working across endpoints, especially for remote staff devices.
- Pair browser updates with extension governance, otherwise you are patching the door while leaving the window open.

### 🧠 What I’m watching next week
Identity-adjacent tooling and “management plane” apps keep getting hammered because attackers love central choke points. If you run admin consoles, automation platforms, backup infrastructure, or edge gateways, assume you are on the list and patch accordingly.