---
date: 2026-05-22T13:00:00-05:00
title: "Security Signal Weekly: May 16-22, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116620103952634381"
mastodon_tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
---

## Overview

This week had a very clear pattern: attackers and researchers kept circling the tools that sit closest to trust. Endpoint protection, CMS platforms, VPNs, cloud identities, developer tooling, and admin planes all showed up in the signal pile. The practical lesson is not glamorous, but it is the work: know where your control planes are, patch the exposed ones quickly, and verify the fix instead of assuming the green checkbox tells the whole story.

> **Reality check:** The riskiest system in the room is often the one everyone treats as plumbing.

## Top 10 Security Signals

### 1. Drupal's PostgreSQL SQL injection flaw moved from urgent patch to active exploitation

**What happened:** [Drupal disclosed SA-CORE-2026-004](https://www.drupal.org/security) for CVE-2026-9082, a highly critical Drupal Core SQL injection issue affecting PostgreSQL-backed sites that can be reached by anonymous users and may lead to information disclosure, privilege escalation, or remote code execution. [CISA added CVE-2026-9082 to the KEV catalog on May 22](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-9082), and [BleepingComputer reported that Drupal updated the advisory after exploit attempts were detected in the wild](https://www.bleepingcomputer.com/news/security/drupal-critical-sql-injection-flaw-now-targeted-in-attacks/).

**Why it matters:** This is the kind of web-app bug that moves fast because defenders have to find every exposed site, every old branch, and every vendor-hosted instance while attackers only need one forgotten install. Drupal shops that use PostgreSQL should treat this as internet-facing patch urgency, not a routine CMS update.

**Action:**

- Upgrade affected Drupal branches immediately and verify the running version after deployment.
- Prioritize PostgreSQL-backed public sites, but do not skip the update on other database backends because the release also carries dependency fixes.
- Review web logs for suspicious requests around the advisory window and confirm WAF rules are a temporary layer, not the fix.

### 2. Microsoft Defender flaws were exploited against the tool meant to protect endpoints

**What happened:** [CISA added CVE-2026-41091 and CVE-2026-45498 to KEV on May 20](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-41091), covering a Microsoft Defender link-following privilege escalation and a Defender denial-of-service issue. Microsoft Security Update Guide entries exist for [CVE-2026-41091](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-41091) and [CVE-2026-45498](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-45498), while [BleepingComputer noted that Microsoft began rolling out fixes after the bugs were exploited as zero-days](https://www.bleepingcomputer.com/news/security/microsoft-warns-of-new-defender-zero-days-exploited-in-attacks/).

**Why it matters:** Security tooling is part of the attack surface. A local privilege escalation in Defender can turn a foothold into SYSTEM access, and a Defender availability issue can create the exact blind spot attackers want before they bring louder tools into the environment.

**Action:**

- Confirm Defender engine and platform versions have reached the fixed builds across managed Windows endpoints.
- Look for hosts where Defender health, tamper protection, or update telemetry is stale or missing.
- Treat unusual Defender service failures as investigation leads, especially on systems with recent privilege or remote-access activity.

### 3. Trend Micro Apex One joined KEV after exploitation was observed

**What happened:** [Trend Micro published a May 21 advisory](https://success.trendmicro.com/ja-JP/solution/KA-0022974) covering multiple Apex One and Standard Endpoint Protection vulnerabilities and confirmed that CVE-2026-34926 had been used in real attacks. [CISA added the Apex One directory traversal issue to KEV](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-34926), and [BleepingComputer summarized that the on-premises Apex One server flaw can let an attacker with prior server admin access inject malicious code for deployment to agents](https://www.bleepingcomputer.com/news/security/trend-micro-warns-of-apex-one-zero-day-exploited-in-attacks/).

**Why it matters:** Endpoint management servers are high-value because they can push changes to many machines at once. Even when a bug requires prior access, the blast radius is ugly if an attacker reaches the management tier.

**Action:**

- Apply Trend Micro's fixed Apex One build and verify server and agent versions, not just the patch job.
- Restrict administrative access to the Apex One server and review recent admin logons or configuration changes.
- Look for unexpected agent-side deployments or policy changes around the exploitation window.

### 4. Langflow's AI workflow vulnerability landed in KEV

**What happened:** [NVD describes CVE-2025-34291](https://nvd.nist.gov/vuln/detail/CVE-2025-34291) as a chained Langflow issue where permissive CORS and a SameSite=None refresh token cookie can allow account takeover and remote code execution through authenticated endpoints. [CISA added it to KEV on May 21](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2025-34291), and [Obsidian Security's original writeup](https://www.obsidiansecurity.com/blog/cve-2025-34291-critical-account-takeover-and-rce-vulnerability-in-the-langflow-ai-agent-workflow-platform) explains why AI workflow platforms are dangerous places to concentrate tokens and downstream service credentials.

**Why it matters:** AI workflow tools are becoming integration hubs. If one of those hubs stores API keys, SaaS tokens, cloud credentials, or automation secrets, a compromise can become a credential-spill problem across everything the workflow can touch.

**Action:**

- Inventory self-hosted or developer-run Langflow instances and remove public exposure where it is not required.
- Restrict allowed CORS origins, review token handling, and follow vendor or maintainer mitigation guidance.
- Rotate secrets connected to vulnerable Langflow workspaces if exploitation is suspected or logging is incomplete.

### 5. SonicWall Gen6 SSL-VPN MFA bypass showed why incomplete fixes still count as exposure

**What happened:** [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/hackers-bypass-sonicwall-vpn-mfa-due-to-incomplete-patching/) that attackers brute-forced VPN credentials and bypassed MFA on SonicWall Gen6 SSL-VPN appliances where CVE-2024-12802 firmware updates had been installed but required LDAP remediation steps were not completed. The vendor guidance linked from the report says Gen6 devices need both firmware and manual LDAP reconfiguration, while Gen7 and Gen8 devices are remediated through newer firmware.

**Why it matters:** This is MSP and IT-ops pain in one story: the device can look patched, the ticket can look closed, and the environment can still be vulnerable. VPN flaws also land directly in the initial-access lane, especially when attackers already have or can brute-force valid credentials.

**Action:**

- For SonicWall Gen6 SSL-VPN, verify both firmware and the LDAP configuration remediation steps.
- Hunt VPN logs for CLI-style sessions, event IDs called out by vendor or researcher guidance, and successful logins from suspicious hosting or VPN infrastructure.
- Retire unsupported Gen6 appliances where practical instead of carrying permanent exception risk.

### 6. Cisco patched a maximum-severity Secure Workload API access bug

**What happened:** [Cisco disclosed CVE-2026-20223](https://www.cisco.com/c/en/us/support/docs/csa/cisco-sa-csw-pnbsa-g8WEnuy.html), a CVSS 10.0 Cisco Secure Workload vulnerability in internal REST API access validation that could let an unauthenticated remote attacker access site resources with Site Admin privileges. Cisco says there are no workarounds, fixed releases are available for on-prem deployments, and SaaS deployments have already been addressed.

**Why it matters:** A workload security platform with tenant-boundary and Site Admin impact is a control-plane problem. Even without known exploitation, this is one of those advisories where the absence of a workaround should make patch scheduling very boring and very fast.

**Action:**

- Upgrade on-prem Cisco Secure Workload deployments to the fixed release path Cisco lists for your branch.
- Check whether any internal REST API exposure is reachable from networks that do not need it.
- Review admin activity and configuration changes in Secure Workload after patching, especially in multi-tenant environments.

### 7. Ubiquiti shipped a heavy UniFi OS security bulletin with multiple critical paths

**What happened:** [Ubiquiti Security Advisory Bulletin 064](https://community.ui.com/releases/r/security/064) listed five UniFi OS issues, including CVE-2026-33000 and multiple CVSS 10.0-class findings affecting UniFi OS devices and servers. NVD entries for issues such as [CVE-2026-33000](https://nvd.nist.gov/vuln/detail/CVE-2026-33000) and [CVE-2026-34909](https://nvd.nist.gov/vuln/detail/CVE-2026-34909) describe network-reachable command injection or path traversal conditions, and the bulletin directs customers to fixed UniFi OS releases.

**Why it matters:** UniFi gear is common in small-business and prosumer networks, which means these patches hit the exact places where admins may also be remote, busy, and tempted to wait. Network appliances are quiet until they are not.

**Action:**

- Update affected UniFi OS devices and servers to the fixed versions in the bulletin.
- Before and after updating, confirm management interfaces are not exposed beyond trusted admin networks.
- Review access logs and administrative accounts for unexpected changes, especially on internet-adjacent controllers.

### 8. GitHub tied unauthorized internal-repo access to a poisoned VS Code extension

**What happened:** [GitHub said it detected and contained a compromise of an employee device on May 18](https://github.blog/security/investigating-unauthorized-access-to-githubs-internal-repositories/) involving a poisoned third-party VS Code extension, with current evidence pointing to exfiltration of GitHub-internal repositories and no evidence of customer-owned repos being affected. [BleepingComputer linked the incident to the Nx Console/TanStack supply-chain activity](https://www.bleepingcomputer.com/news/security/github-links-repo-breach-to-tanstack-npm-supply-chain-attack/) and reported that the malicious extension was designed to steal credentials and secrets for services including npm, AWS, Kubernetes, GitHub, GCP, and Docker.

**Why it matters:** Developer workstations are production-adjacent now. A malicious IDE extension can reach source, tokens, cloud credentials, build systems, and package publishing paths faster than a lot of traditional malware ever could.

**Action:**

- Audit installed IDE extensions and remove anything that is unneeded, untrusted, or outside policy.
- Rotate developer and CI/CD secrets exposed to compromised workstations or extension runtimes.
- Use least-privilege tokens, short-lived credentials, and repository/workflow scoping so one developer endpoint cannot become a full supply-chain incident.

### 9. Storm-2949 turned password reset abuse into a cloud-wide breach path

**What happened:** [Microsoft reported](https://www.microsoft.com/en-us/security/blog/2026/05/18/storm-2949-turned-compromised-identity-into-cloud-wide-breach/) that Storm-2949 used social engineering consistent with Self-Service Password Reset abuse to compromise Microsoft Entra ID accounts, remove existing MFA methods, enroll Microsoft Authenticator on attacker-controlled devices, and then move into Microsoft 365 and Azure resources. Microsoft described data access across OneDrive, SharePoint, Azure App Services, Key Vaults, Storage, SQL, VMs, and ScreenConnect-based post-compromise activity.

**Why it matters:** This is the cleanest reminder of the week that identity is infrastructure. Once attackers own a privileged cloud identity, they can use normal admin features to do abnormal things while blending into expected cloud-management behavior.

**Action:**

- Require phishing-resistant MFA for privileged users and monitor for new MFA method registration on high-value accounts.
- Audit Azure RBAC, Key Vault access, publishing profiles, VM Run Command, and VMAccess usage for suspicious patterns.
- Make SSPR help-desk scripts explicit: users should not approve MFA prompts or reset flows initiated by someone else over a call.

### 10. Microsoft disrupted Fox Tempest's malware-signing-as-a-service operation

**What happened:** [Microsoft exposed Fox Tempest](https://www.microsoft.com/en-us/security/blog/2026/05/19/exposing-fox-tempest-a-malware-signing-service-operation/) as a financially motivated malware-signing-as-a-service operation used to distribute malicious code, including ransomware, and said its Digital Crimes Unit disrupted the offering in May. [Microsoft's legal update](https://blogs.microsoft.com/on-the-issues/2026/05/19/disrupting-fox-tempest-a-cybercrime-service/) says the service helped criminals disguise malware as legitimate software through fraudulent access to code-signing tools such as Microsoft Artifact Signing.

**Why it matters:** Code signing is supposed to support trust, not replace scrutiny. When criminals sell signed malware as a service, defenders need to remember that a valid-looking signature is only one signal in a much larger trust decision.

**Action:**

- Alert on newly seen signed binaries from unusual publishers, especially installers impersonating collaboration or remote-access tools.
- Prefer vendor portals, managed app catalogs, and allowlisted software sources over search-engine downloads.
- Review detections that treat code signing as a blanket allow condition and add behavior-based checks around installers and RMM deployment.

## Closing Notes

If I had to pick the defender priority stack this week, I would start with exploited internet-facing software, then security and management control planes, then identity paths that let attackers turn normal admin features into breach tooling. The specific products will change next week. The pattern will not.
