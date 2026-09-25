---
date: 2026-09-25T15:04:25-05:00
title: "Security Signal Weekly: September 19-25, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117333506552854872}, x: {url: https://twitter.com/thecyberseckyle/status/2103578733781086213, buffer_id: 6ab6d5fbb097c5b401a150ff}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7509344520933740545, buffer_id: 6ab6d5fdf28173fa3f4d24e1}}
publishedAt: "2026-09-25T20:13:46.456Z"
---

## Overview

This week's urgent queue is crowded with systems that control access to something larger than themselves. Attackers are exploiting F5 and Check Point access gateways, Arista's SD-WAN orchestrator, SharePoint, TeamCity, and managed switches. CISA's newest additions bring WSO2 API infrastructure and Adobe Commerce into the same patch-and-investigate cycle.

The software details vary, but the operational problem is consistent. A successful update closes one route in; it does not prove that an exposed appliance, CI server, web application, or package consumer stayed clean before the fix. The useful work this week is to identify the affected configuration, verify the running version, and preserve enough evidence to decide whether the ticket is maintenance or incident response.

> **Reality check:** When a vendor says a flaw is exploited, version compliance is only the first question. The second is what the system could reach while it was vulnerable.

## Top 10 Security Signals

### 1. F5 BIG-IP APM zero-day reaches remote code execution through OAuth

**What happened:** F5 says CVE-2026-94127, a heap-based buffer overflow in BIG-IP Access Policy Manager, has been exploited in the wild. An unauthenticated attacker can send crafted traffic to an affected virtual server and execute code. The vulnerable configuration is specific: the same virtual server must have an APM access policy and an OAuth authorization-server profile. [F5's advisory](https://my.f5.com/manage/s/article/K000162605) provides engineering hotfixes, while [Rapid7's analysis](https://www.rapid7.com/blog/post/etr-cve-2026-94127-critical-unauthenticated-rce-in-f5-big-ip-apm/) explains the exposed configuration and confirms that using APM only as an OAuth client or resource server is not enough to trigger the flaw.

**Why it matters:** BIG-IP APM often sits in front of applications, identity flows, and remote-access paths. Code execution there can expose sessions, configuration, credentials, and the trusted network routes the appliance is meant to protect.

**Action:**

- Use F5's configuration checks to identify virtual servers that combine an APM access policy with an OAuth authorization-server profile, then install the correct engineering hotfix for every affected BIG-IP release.
- Restrict access to affected virtual servers where business operations allow and confirm the hotfix is active on each device in a high-availability pair.
- Preserve APM, OAuth, audit, and network telemetry and investigate unexpected requests, child processes, outbound connections, configuration changes, and session activity from the exposed period.

### 2. Arista VeloCloud Orchestrator flaw exposes the SD-WAN control plane

**What happened:** Arista confirmed active exploitation of CVE-2026-93952, a maximum-severity input-validation flaw in on-premises VeloCloud Orchestrator. [Security Advisory 0183](https://www.arista.com/en/support/advisories-notices/security-advisory/24765-security-advisory-0183) says exploitation requires certificate-based Edge-to-Orchestrator authentication, network access to the VCO web interface, and access to the public portion of an Edge authentication certificate; VCO tenant or operator credentials are not required. Fixed releases include 5.2.3.16 and 6.4.2.8, with other supported trains still awaiting fixes when the advisory was published.

**Why it matters:** The orchestrator manages SD-WAN edges, configuration, certificates, and routing policy across many sites. A compromised VCO host can become a route into branch infrastructure rather than an isolated appliance incident.

**Action:**

- Match every on-premises VCO to Arista's affected-release table and deploy a fixed build where available; contact TAC for supported trains that do not yet have a remediated release.
- Restrict the VCO web interface to trusted administrative networks and limit unnecessary outbound traffic until remediation is complete.
- Use Arista's published indicators to review nginx, backend, system, database, and file-system activity, preserving evidence before rebuilding or replacing a suspected orchestrator.

### 3. Check Point faces active attacks against gateways and management servers

**What happened:** Check Point identified exploitation of two separate pre-authentication flaws. CVE-2026-85102 can turn malformed VPN certificate data into remote code execution on Security Gateway and Spark products, while CVE-2026-93616 uses path traversal in the Security Management web service to execute an arbitrary-path script and load a Java class. The [vendor's September 22 advisory](https://blog.checkpoint.com/security/security-advisory-action-required-active-exploitation-of-cve-2026-85102-and-a-management-pre-authentication-vulnerability-cve-2026-93616/) provides fixes and hunting guidance and warns that Check Point LivePatch Take 28/29 does not address the management-server flaw.

**Why it matters:** Gateways terminate VPN trust, and the management server distributes policy across those gateways. Exploitation on either side can expose credentials and sessions; control of both turns perimeter enforcement into an attacker-managed service.

**Action:**

- Inventory Security Gateway, Spark, and Security Management versions separately and apply the exact hotfix or update listed for each affected release.
- Do not treat an active LivePatch indicator as proof that CVE-2026-93616 is covered; verify the management-server Jumbo Hotfix take directly.
- Review certificate-based Mobile Access logins, management web requests, Java class loads, administrator changes, internal scans, and second-stage activity from suspicious VPN sessions.

### 4. CISA adds WSO2 and Adobe Commerce flaws to the exploited list

**What happened:** CISA added CVE-2026-5430 and CVE-2026-71362 to the Known Exploited Vulnerabilities catalog on September 25. [WSO2's advisory](https://security.docs.wso2.com/en/latest/security-announcements/security-advisories/2026/WSO2-2026-5328/) describes a JWT authentication bypass that can compromise administrative accounts across API Manager, API Control Plane, Traffic Manager, and Universal Gateway. The Adobe Commerce flaw is an unauthenticated authorization failure that can let an attacker switch into another customer's session; [current reporting](https://www.bleepingcomputer.com/news/security/cisa-warns-of-sharepoint-wso2-adobe-commerce-flaws-exploited-in-attacks/) confirms both are now in KEV.

**Why it matters:** These products broker APIs and customer transactions. One flaw reaches administrative control over an API platform; the other crosses customer-account boundaries inside an online store. Both can expose data without the noisy malware behavior many teams expect from an intrusion.

**Action:**

- Apply WSO2's public fixes or the required subscription update level for each deployed component, then test that unsupported JWT algorithms are rejected.
- Bring Adobe Commerce and Magento branches to the required supported patch level, apply Adobe's isolated August security patch, and confirm it on every storefront node.
- Review WSO2 administrative and API access plus Commerce customer-session changes, account-data reads, new integrations, and suspicious orders for activity predating remediation.

### 5. SharePoint code injection moves from an August fix to active exploitation

**What happened:** The Canadian Centre for Cyber Security warned on September 24 that CVE-2026-65660 is being exploited against Microsoft SharePoint Server. The [government alert](https://www.cyber.gc.ca/en/alerts-advisories/al26-023-vulnerability-impacting-microsoft-sharepoint-server-cve-2026-65660) says an authenticated attacker can execute arbitrary code and that chaining with other SharePoint flaws can produce pre-authentication code execution when anonymous access is allowed. It lists fixed builds for SharePoint 2016, 2019, and Subscription Edition and notes that the first two reached end of life in July.

**Why it matters:** On-premises SharePoint is tied closely to Active Directory, document stores, service accounts, and internal collaboration. Code execution on the server can provide both sensitive content and a foothold for moving deeper into the Windows environment.

**Action:**

- Identify every on-premises SharePoint farm, prioritize internet-exposed and anonymous-access instances, and update each server to the fixed build listed by Microsoft and the Cyber Centre.
- Plan migration away from end-of-life SharePoint 2016 and 2019 instead of treating the September fix as a new support lifecycle.
- Review web, ULS, Windows, identity, and endpoint telemetry for suspicious authenticated requests, code execution, web shells, service-account use, and changes to farm configuration.

### 6. Ransomware crews are now using the TeamCity flaw in CISA's catalog

**What happened:** CISA updated CVE-2026-63077 to show ransomware use after earlier reports of active exploitation. The flaw lets an unauthenticated attacker reach TeamCity's agent polling protocol and execute operating-system commands with the server process's privileges. [JetBrains' guidance](https://blog.jetbrains.com/teamcity/2026/08/cve-2026-63077-update/) identifies fixed versions 2025.11.7 and 2026.1.3, a patch plugin for older supported installations, log messages to hunt, and unexpected build agents whose names begin with scan.

**Why it matters:** TeamCity can hold repository credentials, build secrets, signing access, and deployment paths. Ransomware on the CI server is serious by itself; a manipulated build or stolen deployment credential can spread the incident into every environment the server can reach.

**Action:**

- Upgrade TeamCity On-Premises to 2025.11.7, 2026.1.3, or a newer fixed release; use the patch plugin only as a temporary measure when a full update cannot land immediately.
- Search logs for com.thoughtworks.xstream.converters.ConversionException, distinguish blocked ForbiddenClassException attempts, and investigate unauthorized agents with scan-style names.
- Restrict TeamCity to trusted networks, rotate stored repository and deployment credentials after suspected compromise, and verify build artifacts and downstream releases before reuse.

### 7. Attackers move onto WordPress core path traversal within hours

**What happened:** WordPress disclosed CVE-2026-87902 on September 22 and shipped fixes for every maintained and legacy branch back to 4.7. The [project advisory](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-7hp8-65ch-5whp) says an unauthenticated attacker can make page-template resolution include a readable local PHP file outside the active theme; under affected theme and PHP conditions, that becomes remote code execution. The [Canadian Cyber Centre](https://www.cyber.gc.ca/en/alerts-advisories/wordpress-security-advisory-av26-952) reported exploitation in the wild the next day.

**Why it matters:** This is a WordPress core issue rather than one vulnerable plugin, and common cPanel and Docker PHP configurations can satisfy part of the RCE chain. Hosting providers and MSPs need a fleet-wide core-version check, not a search for one extension.

**Action:**

- Update WordPress to 7.1.2 or the fixed release for the site's current branch and verify the running core version from the host or management platform.
- Identify sites using themes with top-level page-* directories and PHP environments with readable local targets such as pearcmd.php, but do not delay the core update while assessing prerequisites.
- Review web requests, PHP execution, recently modified files, new administrator accounts, scheduled tasks, and outbound connections for signs that exploitation preceded the update.

### 8. Roundcube installations face exploitation of a flaw patched in May

**What happened:** The Canadian Centre for Cyber Security updated its Roundcube alert on September 21 to report exploitation of CVE-2026-48842. The [alert](https://www.cyber.gc.ca/en/alerts-advisories/roundcube-security-advisory-av26-503) identifies Roundcube versions before 1.6.16 and 1.7.1 as vulnerable, while the project has since shipped newer security releases in both maintained branches.

**Why it matters:** Webmail sits directly on an organization's authentication and message data. A compromise can expose reset links, business conversations, address books, and the material needed for convincing follow-on phishing.

**Action:**

- Upgrade production Roundcube installations to the latest supported 1.6 LTS or 1.7 release rather than stopping at the minimum May fix.
- Confirm that abandoned panels, old hosting images, and secondary webmail endpoints are included in the inventory and no longer expose vulnerable builds.
- Review web, database, mail, and authentication logs for unusual requests, database activity, mailbox access, forwarding changes, new sessions, and administrator actions.

### 9. Zyxel switch exploitation shows the access layer is part of incident scope

**What happened:** CISA added CVE-2026-7273 to KEV after exploitation against Zyxel GS1900 smart managed switches. [Zyxel's advisory](https://www.zyxel.com/global/en/support/security-advisories/zyxel-security-advisory-for-stack-based-buffer-overflow-vulnerability-in-gs1900-series-switches-06-16-2026) says an unauthenticated attacker on the LAN can send crafted HTTP requests to the switch's CGI program and potentially execute operating-system commands. [GreyNoise-backed reporting](https://www.bleepingcomputer.com/news/security/cisa-orders-feds-to-patch-actively-exploited-zyxel-flaw-by-thursday/) connects the activity to data theft from 996 switches in 48 countries.

**Why it matters:** A managed switch is easy to omit from endpoint and server patch reports, yet it carries management credentials, VLAN configuration, traffic visibility, and a trusted position inside the LAN. That makes compromise useful for both collection and lateral movement.

**Action:**

- Match every GS1900 model and firmware build to Zyxel's table, install the listed fixed firmware, and verify the running image after reboot.
- Move the management interface onto a restricted administrative network, remove exposure from ordinary user VLANs, and disable unused management services.
- Export configuration and logs, compare users and VLAN settings with a known-good baseline, and investigate unexpected HTTP requests, outbound traffic, credential access, or changes before returning the switch to service.

### 10. Malicious npm packages move execution out of the install step

**What happened:** Checkmarx found a campaign led by indexed-btree, a malicious look-alike for the legitimate sorted-btree package. Instead of using preinstall or postinstall hooks, the loader hides inside BTree.prototype.set() and runs during ordinary application behavior, bypassing install-script approval controls. [The researchers' findings summarized by BleepingComputer](https://www.bleepingcomputer.com/news/security/malicious-npm-packages-evade-install-script-defenses-at-runtime/) identify nine related packages, Slack and Telegram exfiltration, and an Ethereum Sepolia smart contract used to obtain encrypted second-stage payloads; the packages have been removed from npm.

**Why it matters:** A clean dependency installation is not a clean dependency. Runtime-triggered malware can reach developer laptops, CI runners, application secrets, and production credentials after the controls focused on lifecycle scripts have already declared success.

**Action:**

- Search package manifests, lockfiles, caches, CI artifacts, containers, and deployed bundles for indexed-btree and the nine related package names from the research.
- Remove affected dependencies, rebuild artifacts from a known-good dependency set, and rotate tokens or credentials available to any environment where the malicious code may have executed.
- Add package reputation and code review to dependency intake, then monitor runtime network and process behavior so install-time controls are not the only supply-chain detection layer.

## Closing Notes

The first maintenance windows belong to F5, Arista, Check Point, SharePoint, and TeamCity because exploitation is confirmed and each product can expose a wider trust boundary. WordPress and Roundcube need broad inventory work, while Zyxel is the reminder to include switches and other access-layer devices in the same exploited-vulnerability queue.

The investigation threshold should stay low. An exposed control plane, build server, web application, or package consumer can be patched and still remain untrustworthy. Verify the fix, preserve the pre-fix evidence, and rotate the credentials or sessions that system could reach when the facts justify it.
