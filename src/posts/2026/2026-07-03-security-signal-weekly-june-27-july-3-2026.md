---
date: 2026-07-03T15:06:03-05:00
title: "Security Signal Weekly: June 27-July 3, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116857893908160249"
mastodon_tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
publishedAt: "2026-07-03T20:19:13.435Z"
---

## Overview

This week kept circling the same operational lesson: the boring control planes are where the damage starts. Remote support, SharePoint, phone systems, firewalls, Microsoft 365, developer packages, and AI workflow servers all showed up because they sit close to credentials, admin access, customer environments, or production data.

> **Reality check:** If a system can manage users, reach endpoints, route traffic, or run code on behalf of a team, it deserves faster patching and better logging than a normal business app.

## Top 10 Security Signals

### 1. SimpleHelp RMM auth bypass is now an active MSP-grade incident risk

**What happened:** CISA added [CVE-2026-48558](https://www.cisa.gov/news-events/alerts/2026/06/29/cisa-adds-one-known-exploited-vulnerability-catalog) to the Known Exploited Vulnerabilities catalog after active exploitation of SimpleHelp's OpenID Connect authentication bypass, while [Horizon3.ai's disclosure](https://horizon3.ai/attack-research/disclosures/cve-2026-48558-simplehelp-authentication-bypass-iocs/) explains that vulnerable OIDC configurations can let an unauthenticated attacker obtain a technician session. Blackpoint and follow-on reporting tied exploitation to TaskWeaver and Djinn Stealer activity against Windows, macOS, and Linux environments.

**Why it matters:** RMM is not just another server. For an MSP or internal IT team, a technician session can become a path into every managed endpoint, which turns a single exposed support tool into a downstream customer incident.

**Action:**

- Upgrade SimpleHelp to a fixed release and disable OIDC where it is not required.
- Audit technician accounts, group-authenticated users, and SimpleHelp server logs for unfamiliar identities.
- Assume exposed RMM credentials and endpoint secrets may need rotation if exploitation indicators are present.

### 2. CISA flags actively exploited SharePoint Server RCE

**What happened:** CISA added [CVE-2026-45659](https://www.cisa.gov/news-events/alerts/2026/07/01/cisa-adds-one-known-exploited-vulnerability-catalog) to KEV based on active exploitation of Microsoft SharePoint Server, and Microsoft's [MSRC advisory](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-45659) describes a deserialization issue that allows an authorized attacker to execute code over the network.

**Why it matters:** SharePoint often holds internal documents, workflow data, credentials in files, and enough business context to make post-exploitation useful. The fact that this was patched earlier but is now showing exploitation is the real signal: delayed patching creates the attack window.

**Action:**

- Patch all affected SharePoint Server Subscription Edition, 2019, and 2016 systems and verify the installed build.
- Review SharePoint exposure, especially externally reachable portals and partner-facing sites.
- Hunt for unexpected process execution, web shell behavior, newly modified ASPX files, and suspicious authenticated access.

### 3. Cisco confirms Unified CM exploitation after public PoC pressure

**What happened:** Cisco's advisory for [CVE-2026-20230](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-cucm-ssrf-cXPnHcW) now says Cisco PSIRT became aware of active exploitation in June, and CISA had already added the Unified Communications Manager SSRF and file-write flaw to KEV after exploitation reports. The issue affects Unified CM and Unified CM SME systems where the WebDialer service is enabled.

**Why it matters:** Voice infrastructure is easy to under-prioritize because it feels separate from normal endpoint and cloud work. In practice, it is an identity-adjacent communications platform with privileged services, internal reach, and high business disruption value.

**Action:**

- Upgrade Unified CM and Unified CM SME to fixed releases, especially 14SU6 or 15SU5 where applicable.
- Disable the WebDialer service if it is not needed or if patching cannot happen immediately.
- Review device logs and file-system changes for signs of arbitrary file writes or follow-on root activity.

### 4. BlueHammer moved from Windows Defender patch debt to ransomware signal

**What happened:** CISA's KEV catalog entry for [CVE-2026-33825](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-33825) shows Microsoft Defender Antivirus exploitation, and [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/cisa-windows-bluehammer-flaw-now-exploited-by-ransomware-gangs/) that CISA confirmed ransomware crews are exploiting the BlueHammer local privilege escalation flaw.

**Why it matters:** Local privilege escalation bugs are easy to mentally downgrade until ransomware operators pair them with initial access. Once they do, unpatched endpoints become a privilege problem, not just an endpoint hygiene problem.

**Action:**

- Confirm Microsoft Defender platform and engine updates actually landed on endpoints, not just that update jobs ran.
- Prioritize systems with remote access, VPN exposure, help desk tooling, or privileged user activity.
- Correlate Defender update gaps with suspicious privilege changes, service creation, and ransomware precursor behavior.

### 5. Google and partners disrupted NetNut's residential proxy network

**What happened:** Google Threat Intelligence Group said it took action with the FBI, Lumen, and others against the [NetNut residential proxy network](https://cloud.google.com/blog/topics/threat-intelligence/google-continued-disruption-residential-proxy-networks), estimating the network at least 2 million devices and observing suspected NetNut exit nodes used by hundreds of threat clusters in a single June week.

**Why it matters:** Residential proxies make malicious traffic look like normal home or small-business traffic. That weakens simple IP reputation controls and helps attackers hide password spraying, fraud, scraping, and command infrastructure behind addresses defenders hesitate to block.

**Action:**

- Treat residential ISP traffic to admin and authentication endpoints as a risk signal, not automatically benign.
- Tune detections around impossible travel, unusual ASN changes, failed-login bursts, and session creation from new geographies.
- Check unmanaged streaming boxes, Android devices, and low-cost appliances for proxy or malware enrollment signs.

### 6. Azure CLI password spraying exposed weak Conditional Access coverage

**What happened:** Huntress reported an [LSHIY-linked password spray campaign](https://www.huntress.com/blog/lshiy-password-spray-attack) that made more than 81 million attempts against Microsoft accounts between June 12 and June 26, compromising at least 78 accounts across 64 organizations by abusing Azure CLI and Resource Owner Password Credentials flows.

**Why it matters:** The story is not that MFA failed. The story is that Conditional Access policies often cover the paths teams think about while legacy or special-case auth flows remain reachable.

**Action:**

- Require MFA for all users, all cloud apps, and all client app types where possible.
- Restrict Azure CLI access for users who do not need it and review ROPC exposure.
- Prioritize password resets for accounts with breached-password matches, failed spray attempts, or successful Azure CLI sign-ins.

### 7. ARToken showed how mature Microsoft 365 phishing kits have become

**What happened:** Cisco Talos analyzed [ARToken](https://blog.talosintelligence.com/artoken-inside-an-eviltokens-affiliate-panel-targeting-microsoft-365/), an EvilTokens-linked phishing-as-a-service panel targeting Microsoft 365, and found more than 80 API endpoints for device-code phishing, Primary Refresh Token persistence, mailbox access, BEC operations, and SharePoint exfiltration.

**Why it matters:** Modern Microsoft 365 phishing is moving past fake login pages. Attackers are packaging token theft, persistence, mailbox search, and payment-fraud workflows into operator panels that lower the skill needed to run a serious cloud account takeover.

**Action:**

- Monitor device-code authentication, OAuth consent grants, PRT-related anomalies, and suspicious mailbox rule creation.
- Move privileged and finance users toward phishing-resistant MFA where possible.
- Review Microsoft 365 app consent settings and restrict user consent to verified, low-risk applications.

### 8. FortiBleed credentials are being tied to ransomware operations

**What happened:** Follow-on reporting on the [FortiBleed credential theft campaign](https://thehackernews.com/2026/07/fortibleed-credential-theft-linked-to.html) says stolen FortiGate credentials are being linked to INC and Lynx ransomware activity, after earlier reporting described mass FortiGate targeting and large-scale credential collection.

**Why it matters:** Firewall credentials are high-leverage initial access. If attackers can authenticate to edge infrastructure or reuse harvested RADIUS, NTLM, Kerberos, or service credentials, the incident starts behind the perimeter instead of at it.

**Action:**

- Rotate FortiGate, VPN, RADIUS, LDAP, and service credentials that may have been exposed through edge-device compromise.
- Audit Fortinet administrative logins, configuration exports, new accounts, and VPN authentication events.
- Segment management interfaces and remove internet exposure for admin portals wherever possible.

### 9. North Korea-linked npm packages kept pressure on developer workstations

**What happened:** JFrog Security Research found [Lazarus-linked npm malware](https://research.jfrog.com/post/rollup-polyfill-masquerading/) masquerading as Rollup polyfill tooling, including lookalike package names, copied metadata, hidden install-time execution, sandbox checks, and payloads aimed at remote access and developer secret theft.

**Why it matters:** Developer machines and CI jobs are full of deploy tokens, package registry credentials, cloud keys, wallet material, and AI service credentials. A package that looks boring can still become a clean path to production-adjacent secrets.

**Action:**

- Review recent npm installs for Rollup-themed lookalike packages and remove any unexpected dependencies.
- Rotate developer and CI secrets if malicious packages were installed or if install logs are incomplete.
- Add dependency allowlists, lockfile review, and install-script controls for sensitive repositories.

### 10. AI workflow servers are becoming ransomware and extortion targets

**What happened:** Sysdig reported [JADEPUFFER](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion), an agentic ransomware case where an internet-facing Langflow instance was exploited through CVE-2025-3248, then used to pivot toward credentials, Nacos configuration data, and a production database extortion workflow.

**Why it matters:** AI workflow tools often hold the exact secrets attackers want: API keys, cloud credentials, database strings, and access to automation paths. Treating them like experimental side projects is how they become production breach pivots.

**Action:**

- Patch Langflow and similar AI workflow tools, and remove internet exposure unless there is a strong business reason.
- Rotate secrets stored in AI workflow environments after any suspected exposure.
- Log tool execution, outbound callbacks, secret access, and database actions from AI workflow servers.

## Closing Notes

The priority stack this week is straightforward: patch exploited remote support and collaboration systems, close identity policy gaps, inventory browser and developer-side extensions or packages, and stop treating AI workflow servers as harmless lab equipment. The common failure mode is not one flashy exploit. It is trusted tooling with too much reach and too little verification.
