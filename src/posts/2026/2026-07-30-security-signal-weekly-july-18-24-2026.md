---
date: 2026-07-30T09:48:00-05:00
title: "Security Signal Weekly: July 18-24, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/117009539408575264"
mastodon_tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
publishedAt: "2026-07-30T15:04:40.139Z"
---

## Overview

This edition is landing a bit late because I was on vacation last Friday. The July 18-24 window was defined by a familiar but uncomfortable pattern: security and management platforms became the attack path. SharePoint, firewall consoles, VPN gateways, IT service management, AI workflow builders, routers, and product lifecycle systems all demanded more than a routine patch checkbox.

> **Reality check:** When the vulnerable product controls identity, policy, remote access, support workflows, or engineering data, patching is only step one. Verify the fixed version, review exposure, and look for evidence that somebody arrived first.

## Top 10 Security Signals

### 1. Attackers used a new SharePoint RCE to steal machine keys

**What happened:** Attackers began exploiting CVE-2026-50522 shortly after public proof-of-concept code appeared. The critical deserialization flaw affects on-premises SharePoint Server 2016, 2019, and Subscription Edition; Microsoft's [July security update](https://support.microsoft.com/en-us/servicing/office/update/2026/5002882) fixes it, while [CERT-EU says](https://cert.europa.eu/publications/security-advisories/2026-009/) observed attacks stole machine keys that can support continued access after patching.

**Why it matters:** This is another reminder that a SharePoint update is not an incident-response plan. If machine keys or authentication material were taken, an attacker may be able to forge trusted tokens and return through an apparently legitimate path.

**Action:**

- Install the July SharePoint security updates across every farm server and run the required configuration steps, then verify the resulting build numbers.
- Assess any internet-exposed server for compromise, including suspicious requests, child processes, files, and machine-key access before returning it to normal service.
- Rotate exposed credentials and IIS or SharePoint key material as appropriate, and remove direct internet exposure where the business does not require it.

### 2. Check Point patched a SmartConsole zero-day that grants full admin access

**What happened:** Check Point disclosed CVE-2026-16232, an authentication bypass in the SmartConsole login process that can let an unauthenticated attacker obtain an application token and authenticate with full administrative privileges. The vendor published [hotfix and investigation guidance](https://support.checkpoint.com/results/sk/sk185169), and [CISA added the flaw to KEV](https://nvd.nist.gov/vuln/detail/CVE-2026-16232) on July 22 after Check Point observed attacks against a small number of internet-exposed management environments.

**Why it matters:** A firewall management server is a control plane. Administrative access can expose policy, objects, logs, and the ability to weaken the very gateways defenders expect to stop lateral movement and data theft.

**Action:**

- Apply the Check Point July security update or the documented Jumbo Hotfix Accumulator to every affected management server.
- Restrict Trusted Clients and management access to approved IP addresses and dedicated administration paths instead of the public internet.
- Use the vendor's audit-log query and indicators to look for application-token authentication and unexpected policy or administrator changes.

### 3. ServiceNow's AI Platform RCE moved from patched to exploited

**What happened:** ServiceNow addressed CVE-2026-6875, a critical sandbox-escape flaw that can allow unauthenticated code execution in the ServiceNow AI Platform. The vendor patched hosted instances and issued fixes for self-hosted deployments in [KB3137947](https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB3137947); on July 20, the [Canadian Centre for Cyber Security updated its alert](https://www.cyber.gc.ca/en/alerts-advisories/servicenow-security-advisory-av26-693) after open-source reporting indicated exploitation in the wild.

**Why it matters:** ServiceNow often connects support, asset, identity, security, and automation workflows. Code execution in that platform can put integration credentials, tickets, configuration data, and downstream actions in reach.

**Action:**

- Confirm hosted instances received the vendor update and upgrade self-hosted instances to one of the fixed family patches ServiceNow lists.
- Review platform and integration logs for unexpected code execution, new accounts, unusual API activity, or outbound connections around the disclosure window.
- Rotate secrets exposed to the platform if compromise is suspected and review which integrations can perform privileged actions without a second approval.

### 4. Clop turned the Windchill and FlexPLM flaw into a data-theft campaign

**What happened:** The Clop extortion group began contacting organizations after apparent attacks against PTC Windchill and FlexPLM systems using CVE-2026-12569. PTC's [active advisory](https://www.ptc.com/en/about/trust-center/advisory-center/active-advisories/windchill-flexplm-rce-vulnerability) provides patches and web-shell indicators, while [Ransom-ISAC and BleepingComputer](https://www.bleepingcomputer.com/news/security/clop-ransomware-targets-windchill-flexplm-in-data-theft-attacks/) linked the July 24 extortion wave to the enterprise software campaign.

**Why it matters:** Product lifecycle systems hold engineering designs, manufacturing records, supplier data, and retail product information. Data theft from that tier can create intellectual-property, regulatory, and supply-chain consequences even when ransomware never encrypts a server.

**Action:**

- Apply PTC's patches for every supported Windchill and FlexPLM release and place externally reachable instances behind trusted access controls.
- Hunt for the documented hex-named JSP web shells, unusual POST requests under the login path, malicious headers, and the latest network indicators.
- If indicators are present, isolate the system, preserve forensic evidence, rotate exposed credentials, and scope data access before restoration.

### 5. Palo Alto confirmed attacks against a GlobalProtect authentication bypass

**What happened:** Palo Alto Networks says it observed limited exploit attempts against unpatched PAN-OS devices affected by CVE-2026-0257. The [GlobalProtect advisory](https://security.paloaltonetworks.com/CVE-2026-0257) describes an authentication-cookie weakness that can let an attacker establish an unauthorized VPN connection when authentication override is enabled with a vulnerable certificate configuration.

**Why it matters:** VPN gateways are supposed to narrow remote access. A bypass turns that trust boundary into an attacker-controlled entry point, and partial upgrades can leave mixed portal and gateway behavior that is easy to misread as remediated.

**Action:**

- Inventory every GlobalProtect portal and gateway, determine whether authentication override cookies are enabled, and upgrade all linked components to fixed PAN-OS versions.
- Use a dedicated certificate for authentication override cookies or disable the feature until the full environment can be upgraded safely.
- Review the Unit 42 indicators and authentication logs for unexpected VPN sessions, then re-enable strict HMAC validation after a phased upgrade is complete.

### 6. CISA flagged an exploited Langflow flaw that can execute code as root

**What happened:** CISA added CVE-2026-0770 to its Known Exploited Vulnerabilities catalog on July 21. The [NVD record](https://nvd.nist.gov/vuln/detail/CVE-2026-0770) and [Zero Day Initiative advisory](https://www.zerodayinitiative.com/advisories/ZDI-26-036/) describe an unauthenticated flaw in Langflow's validate endpoint where attacker-controlled input can reach code execution in the context of the service, potentially as root.

**Why it matters:** AI workflow builders frequently store model keys, database credentials, cloud tokens, and internal service connections. A small public demo instance can therefore become a bridge into much more valuable systems.

**Action:**

- Find internet-facing Langflow instances, upgrade beyond affected releases to the current supported security release, and remove public exposure where it is unnecessary.
- Review requests to validation and code-execution endpoints, container or host process activity, and access to environment variables and stored credentials.
- Run the service as a non-root identity with minimal network reach and rotate API keys or tokens from a clean host if exploitation may have occurred.

### 7. A botnet revived a 2021 DD-WRT router bug

**What happened:** CISA added CVE-2021-27137 to KEV on July 21 after active exploitation surfaced. [Fortinet's analysis](https://www.fortinet.com/blog/threat-research/inside-cross-platform-propagation-of-new-gafgyt-variant-c0xmo) says the C0XMO Gafgyt variant uses the DD-WRT UPnP stack-buffer overflow to spread, launch denial-of-service attacks, and remove competing malware; [NVD notes](https://nvd.nist.gov/vuln/detail/CVE-2021-27137) that builds before 45724 are vulnerable when UPnP is enabled.

**Why it matters:** Old router firmware can disappear from normal vulnerability programs while remaining powered on for years. Once compromised, those devices can provide persistence, attack infrastructure, and a blind spot below endpoint visibility.

**Action:**

- Inventory DD-WRT devices, confirm the running build is 45724 or later, and replace hardware that cannot run a maintained release.
- Disable UPnP unless it is explicitly required and prevent router management or discovery services from being reachable from untrusted networks.
- Look for unexpected processes, outbound scanning, denial-of-service traffic, and configuration changes; rebuild suspicious routers instead of trusting an in-place update.

### 8. U.S. agencies expanded the Iranian PLC warning beyond Rockwell devices

**What happened:** A July 22 update to the joint [FBI, CISA, NSA, EPA, DOE, Cyber Command, and Treasury advisory](https://www.ic3.gov/CSA/2026/260722.pdf) says Iranian-affiliated actors are targeting internet-connected PLCs from Rockwell Automation, Schneider Electric, Siemens, and potentially other vendors. The agencies observed malicious project-file changes and manipulation of HMI and SCADA data that caused operational disruption and financial loss.

**Why it matters:** This is not only a single-vendor vulnerability problem. The actors used legitimate engineering software against exposed or misconfigured controllers, which means asset placement, access control, and project integrity matter as much as patch status.

**Action:**

- Remove PLCs from direct internet exposure and require secure gateways, firewalls, and controlled engineering workstations for administration.
- Review traffic on ports 44818, 2222, 102, 502, and 22 for foreign hosting infrastructure and compare current project files with validated backups.
- Coordinate IT, OT, integrators, and manufacturers before changing device modes or restoring logic so safety and operational requirements remain intact.

### 9. Laundry Bear used a viewed email to steal Zimbra mail and persistence

**What happened:** The UK's NCSC and international partners exposed a Russian state-supported campaign against vulnerable Zimbra Collaboration Suite servers. The [NCSC alert](https://www.ncsc.gov.uk/news/uk-and-partners-expose-russian-state-supported-actors-for-new-zero-click-phishing-campaign) calls the technique Beehive, while [Proofpoint's analysis](https://www.proofpoint.com/us/blog/threat-insight/ta488-targets-zimbra-mailservers-half-click-exploits) explains how CVE-2025-66376 fired when a user viewed or previewed a malicious email, stole credentials and messages, and created an app-specific password for persistent access.

**Why it matters:** This attack bypassed the usual click-or-attachment training message. It also created persistence inside the mail platform, where a normal password reset or endpoint scan could miss the access path.

**Action:**

- Patch Zimbra Collaboration Suite to a release that fixes CVE-2025-66376 and review whether vulnerable versions were exposed during the campaign window.
- Search Zimbra audit logs for CreateAppSpecificPassword activity and remove unexpected passwords named ZimbraWeb or similar.
- Use the published domains, hashes, DNS behavior, and mailbox-export activity to hunt for compromise, then rotate credentials and sessions if indicators are found.

### 10. EY's support-ticket breach exposed the danger hiding in attachments

**What happened:** Ernst & Young disclosed that an unauthorized party accessed a third-party IT service management platform from March 28 through April 12 and downloaded client documents used for tax work. The incident appears in the [California attorney general's breach registry](https://oag.ca.gov/ecrime/databreach/reports/sb24-626542), and [SecurityWeek reported](https://www.securityweek.com/ernst-young-data-breach-affects-personal-financial-information/) that affected records included personal and financial information attached to support tickets.

**Why it matters:** Help desks routinely accumulate screenshots, logs, exports, identity documents, and sensitive attachments that teams would never intentionally place in a general-purpose file share. A support platform must be treated as a high-value data repository, not just workflow plumbing.

**Action:**

- Inventory which ticketing and support systems can receive sensitive attachments, how long those files are retained, and which staff, vendors, and integrations can download them.
- Add controls for bulk export, unusual download volume, third-party administrator access, and attachment handling instead of relying only on login alerts.
- If notified by EY, enroll in the offered monitoring, review financial and tax-account activity, and watch for follow-on phishing that references the breach.

## Closing Notes

Because this edition is late, several advisory deadlines have already passed. Start with the control planes: SharePoint, Check Point, ServiceNow, GlobalProtect, and exposed Langflow. Then work outward to PTC systems, routers, Zimbra, OT access paths, and the quiet data stores hiding inside support workflows. The consistent lesson is that patching matters most when it is paired with exposure review, compromise assessment, and proof that the fix actually landed.
