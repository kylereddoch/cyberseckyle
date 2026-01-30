---
date: 2026-01-30T16:00:00-05:00
title: 'Cybersecurity Weekly Roundup: January 24–30, 2026'
description: "Fortinet and Microsoft shipped urgent fixes, Ivanti EPMM and SolarWinds WHD landed in the “drop everything” bucket, supply chain risk showed up in AV and JavaScript tooling, and even physical access systems caught heat."
tags: [cybersecurity weekly roundup, cybersecurity, infosec, weekly-roundup, vulnerability-management, incident-response, news]
mastodon_url: null
---

{% image "/assets/images/cybersec_weekly_roundup.png", "“Cybersecurity Weekly Roundup” showing a glowing shield with a keyhole over a world map, surrounded by digital interface icons and data streams.", "Cybersecurity Weekly Roundup — the week’s biggest security news, distilled into signal and next steps. (Image generated with ChatGPT)", "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

### 🧭 Overview

The last seven days came in hot. [Fortinet](https://www.fortiguard.com/psirt/FG-IR-26-060) pushed fixes for an actively exploited FortiCloud SSO auth bypass, [Microsoft shipped an emergency Office patch](https://www.scworld.com/brief/actively-exploited-microsoft-office-zero-day-fixed), and [Ivanti EPMM](https://forums.ivanti.com/s/article/Security-Advisory-Ivanti-Endpoint-Manager-Mobile-EPMM-CVE-2026-1281-CVE-2026-1340) landed more pre-auth RCE fun that nobody asked for. [SolarWinds Web Help Desk](https://documentation.solarwinds.com/en/success_center/whd/content/release_notes/whd_2026-1_release_notes.htm) dropped multiple critical bugs, while supply chain risk popped up in an antivirus vendor and JavaScript package managers. Even physical access systems got dragged into the spotlight with dormakaba door-control issues. Here’s the week, minus the fluff.

> **Reality check:** If it authenticates users or touches the edge, assume it is being probed right now. “We’ll patch next maintenance window” is how weekends get deleted.

## 🔥 Patch and Exploit Watch

### 1) Fortinet FortiCloud SSO auth bypass exploited in the wild (CVE-2026-24858)

**What happened:** Fortinet released updates and guidance for an authentication bypass involving FortiCloud SSO admin login, tracked as [CVE-2026-24858](https://www.fortiguard.com/psirt/FG-IR-26-060). [CISA also published an alert](https://www.cisa.gov/news-events/alerts/2026/01/28/fortinet-releases-guidance-address-ongoing-exploitation-authentication-bypass-vulnerability-cve-2026) emphasizing risk when FortiCloud SSO is enabled.

**My take:** This is exactly why “convenience auth” features make me twitch. The blast radius is not just one device, it is the trust relationship around cloud-linked admin login. If your org standardizes on a vendor, a single auth edge like this becomes a target multiplier.

**Action:**  

- Patch affected Fortinet products immediately and validate versions against the advisory.  
- If you do not absolutely need FortiCloud SSO for admin login, disable it and document why.  
- Audit admin access paths: local admin, SSO, VPN, and any “helpful” cloud connectors.

### 2) Microsoft Office zero-day fixed out-of-band (CVE-2026-21509)

**What happened:** Microsoft issued emergency updates for an actively exploited Office security feature bypass tracked as [CVE-2026-21509](https://www.scworld.com/brief/actively-exploited-microsoft-office-zero-day-fixed).

**My take:** Office exploitation is still the classic “initial access tax” because it is everywhere. When Microsoft goes out-of-band, treat it like a fire alarm, not a calendar invite.

**Action:**  

- Prioritize patching endpoints used by finance, HR, executives, and anyone who handles attachments daily.  
- Verify update deployment, do not assume “it pushed.” Spot-check a sample of machines.  
- Tighten attachment handling: disable macros where you can, and enforce protected view policies.

### 3) Ivanti EPMM pre-auth RCE vulnerabilities exploited (CVE-2026-1281, CVE-2026-1340)

**What happened:** Ivanti disclosed two critical EPMM bugs, including pre-auth remote code execution, tracked as [CVE-2026-1281 and CVE-2026-1340](https://forums.ivanti.com/s/article/Security-Advisory-Ivanti-Endpoint-Manager-Mobile-EPMM-CVE-2026-1281-CVE-2026-1340). Researchers also published deeper technical analysis and exploitation context, including [watchTowr’s breakdown](https://labs.watchtowr.com/someone-knows-bash-far-too-well-and-we-love-it-ivanti-epmm-pre-auth-rces-cve-2026-1281-cve-2026-1340/) and Rapid7’s [threat report and remediation notes](https://www.rapid7.com/blog/post/etr-critical-ivanti-endpoint-manager-mobile-epmm-zero-day-exploited-in-the-wild-eitw-cve-2026-1281-1340/).

**My take:** MDM is a crown-jewel control plane. If an attacker gets your mobile management server, they can pivot into identity, tokens, profiles, and device posture. This is not “just another CVE.” This is “who owns the fleet?”

**Action:**  

- Patch EPMM immediately and follow vendor guidance for detection and log review.  
- Restrict management interfaces and APIs to trusted networks only. No open internet exposure.  
- Rotate credentials and API keys that your MDM touches, especially if you see suspicious access.

### 4) SolarWinds Web Help Desk hit with multiple critical bugs (unauth RCE + auth bypass)

**What happened:** SolarWinds released WHD 2026.1 to address several critical issues including deserialization-driven unauthenticated RCE and authentication bypass. See the vendor’s [WHD 2026.1 release notes](https://documentation.solarwinds.com/en/success_center/whd/content/release_notes/whd_2026-1_release_notes.htm) and Rapid7’s [analysis and mitigation guidance](https://www.rapid7.com/blog/post/etr-multiple-critical-solarwinds-web-help-desk-vulnerabilities-cve-2025-40551-40552-40553-40554/). SecurityWeek also summarizes impact and urgency in their [coverage](https://www.securityweek.com/solarwinds-patches-critical-web-help-desk-vulnerabilities/).

**My take:** Help desk tooling is “soft center” infrastructure: it holds credentials, tickets with sensitive detail, integrations, and often runs longer than anyone admits. Deserialization RCE without auth is the kind of bug attackers love because it turns into instant shells.

**Action:**  

- Upgrade to WHD 2026.1 fast. If you cannot, isolate the server and lock down access hard.  
- Review exposed services and confirm the application is not reachable from the public internet.  
- Rotate credentials used in WHD integrations (mail, LDAP, API tokens) after patching.

### 5) SmarterMail auth bypass exploitation and 6,000+ exposed servers

**What happened:** Shadowserver reported over 6,000 internet-exposed SmarterMail servers likely vulnerable to automated hijacking attempts exploiting a critical authentication bypass. See [BleepingComputer’s write-up](https://www.bleepingcomputer.com/news/security/over-6-000-smartermail-servers-exposed-to-automated-hijacking-attacks/) and the underlying CVE record for [CVE-2026-23760](https://nvd.nist.gov/vuln/detail/CVE-2026-23760).

**My take:** Email infrastructure is a persistence playground. If someone can reset an admin password without proper verification, the story ends with mailbox rules, credential harvesting, and long-term access. Also, 6,000 exposed servers is not a “niche product” problem. That is a “we keep putting admin surfaces on the internet” problem.

**Action:**  

- Patch to a fixed SmarterMail build immediately.  
- Remove direct internet exposure where possible. Put it behind VPN, ZTNA, or at least strict allowlists.  
- Audit for suspicious admin resets, new accounts, and mailbox rule tampering.

### 6) CISA continues to wave the “exploited in the wild” flag

**What happened:** CISA published multiple alerts this week tied to active exploitation, including their [Fortinet exploitation alert](https://www.cisa.gov/news-events/alerts/2026/01/28/fortinet-releases-guidance-address-ongoing-exploitation-authentication-bypass-vulnerability-cve-2026), and vendor disclosures echoed exploitation for other high-impact products.

**My take:** CISA alerts are a prioritization gift. You do not have to guess what attackers are actively using today. This is as close as you get to a real-world “patch this first” list without paying for threat intel.

**Action:**  

- Build a habit: check CISA alerts weekly and map them to your asset inventory.  
- If your org cannot patch fast, invest in compensating controls that actually matter: exposure reduction, segmentation, and monitoring.

## 🧬 Supply Chain and Developer Ecosystem

### 7) Google disrupts IPIDEA, a large residential proxy network used by threat actors

**What happened:** Google detailed disruption efforts against IPIDEA, described as a large residential proxy network used by cybercrime groups. Start with [Google’s threat intelligence write-up](https://cloud.google.com/blog/topics/threat-intelligence/disrupting-largest-residential-proxy-network), and for broader context see [Reuters’ reporting](https://www.reuters.com/world/google-disrupts-ipidea-largest-residential-proxy-network-used-by-550-threat-groups-2026-01-30/).

**My take:** Residential proxies are how attackers blend in. When you see logins from “random US cable ISP IPs,” it might not be a traveling employee. Proxy services keep making “impossible travel” less obvious. Detection has to move beyond IP reputation alone.

**Action:**  

- Enforce phishing-resistant MFA where possible, and use conditional access that considers device posture and session risk.  
- Monitor for “normal-looking” logins that have abnormal behavior: new device fingerprints, odd API usage, weird geo patterns.

### 8) eScan antivirus supply chain compromise pushed signed malicious updates

**What happened:** Multiple reports indicate a supply chain compromise involving eScan updates, including [Kaspersky’s analysis](https://securelist.com/escan-supply-chain-compromise/115590/) and coverage from [Help Net Security](https://www.helpnetsecurity.com/2026/01/28/escan-supply-chain-compromise/) and [Morphisec](https://www.morphisec.com/blog/escan-antivirus-supply-chain-attack/).

**My take:** The nightmare scenario is not “AV missed malware.” It is “AV delivered malware.” Signed updates are a trust shortcut, and attackers know it. This is also a reminder that “security vendor” does not mean “immune.”

**Action:**  

- Confirm whether you run eScan in any environment. If yes, follow vendor and third-party guidance immediately.  
- Expand supply chain monitoring: watch update processes, certificate changes, and unusual outbound from security agents.  
- Have a playbook for “trusted tool turns hostile,” including rapid isolation and replacement.

### 9) PackageGate: multiple JavaScript package managers hit with bypass flaws

**What happened:** Researchers disclosed “PackageGate” issues affecting JavaScript package managers, enabling attackers to bypass protections and run malicious code in lifecycle hooks and related flows. See [SecurityWeek’s coverage](https://www.securityweek.com/packagengate-bugs-let-attackers-bypass-protections-in-npm-pnpm-vlt-and-bun/) and a technical angle via [Koi Security’s post](https://www.koi.security/blog/packagegate-supply-chain-attack-vulnerabilities).

**My take:** The modern software supply chain is basically a trust pyramid made of toothpicks. Attackers do not have to compromise your company if they can compromise your dependencies or tooling. The scary part is how quietly these attacks land, and how “normal” they look in CI logs.

**Action:**  

- Pin dependencies, use lockfiles, and treat lifecycle scripts as high-risk.  
- Add provenance checks where possible (SBOM, signed artifacts, trusted registries).  
- Monitor CI runners like production systems, because attackers absolutely do.

### 10) Malicious VS Code “AI helper” extensions racked up massive installs

**What happened:** Reports flagged malicious Visual Studio Code extensions using AI branding and other lures, with significant install counts. See [The Hacker News coverage](https://thehackernews.com/2026/01/malicious-vs-code-ai-extensions.html).

**My take:** Developer workstations are attack accelerators. Compromise one developer environment and you can get tokens, source code, build credentials, and a path into production. “Just an extension” is never just an extension.

**Action:**  

- Restrict extension installs in managed environments and audit what is already installed.  
- Rotate exposed tokens if you suspect dev tooling compromise.  
- Treat dev endpoints as privileged assets, not “regular laptops.”

## 🔐 Libraries, Automation, and the Stuff Everyone Depends On

### 11) OpenSSL patched 12 vulnerabilities, including a high-severity RCE

**What happened:** OpenSSL released fixes for a dozen vulnerabilities, including a high-severity bug described as potentially leading to RCE in certain conditions. See [SecurityWeek’s summary](https://www.securityweek.com/high-severity-remote-code-execution-vulnerability-patched-in-openssl/) and deeper technical context from [Datadog Security Labs](https://securitylabs.datadoghq.com/articles/opensslaid/).

**My take:** Crypto libraries are boring until they are not, and when they break, everything breaks. The real risk is not only direct exploitation, it is the long tail of systems that never get rebuilt or redeployed with updated base images.

**Action:**  

- Patch OpenSSL across servers, containers, appliances, and base images.  
- Rebuild images instead of patching a single host and calling it done.  
- Confirm which apps are statically linked, because those often get missed.

### 12) n8n sandbox escape flaws enable remote code execution (CVE-2026-1470, CVE-2026-0863)

**What happened:** JFrog disclosed two flaws in n8n’s sandboxing that can lead to RCE, including [CVE-2026-1470 and CVE-2026-0863](https://research.jfrog.com/post/achieving-remote-code-execution-on-n8n-via-sandbox-escape/). BleepingComputer also summarizes impact and exploitation paths in their [report](https://www.bleepingcomputer.com/news/security/new-sandbox-escape-flaw-exposes-n8n-instances-to-rce-attacks/).

**My take:** Workflow automation platforms are identity and secrets brokers. They hold API keys, OAuth tokens, and automation logic that touches everything. If you run n8n, you are effectively running a mini control plane. Sandboxes failing is a predictable failure mode, and it keeps happening.

**Action:**  

- Patch n8n immediately and restrict access to trusted users only.  
- Audit stored credentials inside n8n and rotate high-value tokens post-patch.  
- Reduce exposure: do not leave automation panels open to the internet.

## 🏢 Physical Meets Digital

### 13) dormakaba access control vulnerabilities could enable remote door unlocking

**What happened:** SEC Consult published advisories on multiple critical dormakaba flaws that could allow attackers to unlock doors and compromise physical access infrastructure. Start with [SEC Consult’s advisory](https://sec-consult.com/vulnerability-lab/advisory/multiple-critical-vulnerabilities-in-dormakaba-access-manager/) and SecurityWeek’s summary of real-world exposure and impact in [their coverage](https://www.securityweek.com/access-system-flaws-enabled-hackers-to-unlock-doors-at-major-european-firms/).

**My take:** Physical security systems are computers with consequences. They get deployed, then ignored, then forgotten, then owned. If a badge system is on the network, it needs the same vulnerability management maturity as anything else.

**Action:**  

- Patch per vendor guidance and confirm you are not exposing management interfaces to the internet.  
- Segment physical access infrastructure from user networks.  
- Audit credentials and remove default or weak passwords aggressively.

## 🧨 Breach and Extortion Watch

### 14) Nike investigates extortion claim tied to a large alleged data theft

**What happened:** Reports say Nike is investigating after the WorldLeaks group claimed to have stolen and leaked a large dataset. See [Dark Reading’s report](https://www.darkreading.com/cyberattacks-data-breaches/worldeaks-extortion-group-stole-1.4tb-nike-data) and [BleepingComputer’s coverage](https://www.bleepingcomputer.com/news/security/nike-investigates-data-breach-after-extortion-gang-leaks-files/).

**My take:** Even when customer PII is not the headline, corporate internal data can still be high-value: design, manufacturing workflows, contracts, and internal process documentation are gold for competitors and criminals. Extortion groups will keep monetizing “non-PII” because it still hurts.

**Action:**  

- Treat internal docs as sensitive. DLP and access governance matter beyond “PII.”  
- Assume credential reuse and lateral movement happened if a large dataset walked out.  
- Prepare comms early. The timeline moves fast when leak sites are involved.

## 🕵️ Threat Intel and Campaigns

### 15) China-linked UAT-8099 targets IIS servers with BadIIS SEO malware

**What happened:** Cisco Talos detailed ongoing activity by UAT-8099 targeting vulnerable IIS servers, including new persistence mechanisms and region-focused variants. Read [Talos’ analysis](https://blog.talosintelligence.com/uat-8099-new-persistence-mechanisms-and-regional-focus/) and Broadcom’s [protection bulletin](https://www.broadcom.com/support/security-center/protection-bulletin/uat-8099-targets-vulnerable-iis-servers-in-southeast-asia).

**My take:** IIS compromise is often treated like “just a web server problem,” but it becomes an identity and trust problem the moment a legitimate site starts redirecting users or serving injected content. SEO fraud campaigns can be a stepping stone to malware delivery and credential theft.

**Action:**  

- Patch IIS hosts, remove weak upload paths, and lock down web shells with monitoring.  
- Hunt for suspicious local users (Talos mentions patterns like hidden accounts) and unexpected scheduled tasks.  
- Add detection for odd outbound from web servers. A web server that talks like a workstation is usually lying.

## Closing Notes

If you only have time for one thing: patch the actively exploited stuff first and reduce exposure second. That combo saves more weekends than any shiny tool ever will.