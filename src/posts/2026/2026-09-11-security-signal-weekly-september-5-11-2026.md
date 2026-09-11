---
date: 2026-09-11T14:02:32-05:00
title: "Security Signal Weekly: September 5-11, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/117254055670546789"
mastodon_tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
x_post: true
x_url: "https://twitter.com/thecyberseckyle/status/2098493879536210180"
publishedAt: "2026-09-11T19:28:22.202Z"
x_buffer_post_id: "6aa456574e27fbe1089a83fb"
---

## Overview

This week did not leave much room for leisurely patch testing. Attackers are already chaining MikroTik RouterOS flaws to take over internet-exposed routers, Microsoft fixed two Windows privilege-escalation bugs under active exploitation, Google shipped another Chrome zero-day update, and Cisco confirmed that a root-level FMC authentication bypass has been used in attacks. The practical priority is the same across all four: identify every affected system, deploy the fix, and investigate what happened before the update landed.

The rest of the list is a reminder that high-trust infrastructure deserves the same attention even when exploitation has not been reported. Check Point VPN gateways, cPanel hosts, SAP systems, and GoAnywhere MFT all received consequential fixes. AdaptHealth's breach update and the federal AI-distillation advisory then bring the week back to identity and monitoring: trusted sessions and legitimate API access can still be the path an attacker uses.

> **Reality check:** A successful update job is not proof that every router, browser, firewall manager, and hosting node is on the fixed build. Inventory and version verification are part of the patch, not paperwork after it.

## Top 10 Security Signals

### 1. MikroTrick attacks are taking over exposed MikroTik routers

**What happened:** CERT Polska confirmed that attackers are chaining CVE-2026-67276 and CVE-2026-86060, a combination it calls MikroTrick, to bypass SSH authentication and take full control of RouterOS devices whose SSH service is reachable from the internet. The [researcher's alert](https://cert.pl/en/posts/2026/09/vulnerabilities-in-mikrotik-routeros-actively-exploited/) and [MikroTik's security notice](https://mikrotik.com/supportsec) identify fixed releases in the 7.24, 7.23, and 6.49 trains; MikroTik also added a Flagged status that can surface known unauthorized configuration changes.

**Why it matters:** A compromised router gives an attacker traffic visibility, a durable foothold, and a platform for reaching systems that were never exposed directly. The vendor's Flagged check is useful, but CERT Polska warns that a missing flag does not rule out earlier compromise.

**Action:**

- Upgrade affected RouterOS devices to 7.24.2, 7.23.4 or later in that train, or 6.49.21, and verify the running version after reboot.
- Remove SSH, WebFig, and bandwidth-test access from untrusted networks; use a management VPN or strict source allowlist instead.
- Check logs and /system/device-mode/print for Flagged status, then inspect users, scripts, scheduled tasks, proxies, tunnels, and configuration changes even when the flag is clear.

### 2. Microsoft patches two exploited Windows privilege-escalation flaws

**What happened:** Microsoft's September update fixes CVE-2026-85880 in Windows Advanced Local Procedure Call and CVE-2026-81963 in the Windows Update Stack. Microsoft marks both as exploited; [CrowdStrike's Patch Tuesday analysis](https://www.crowdstrike.com/en-us/blog/patch-tuesday-analysis-september-2026/) says each can let a local attacker reach SYSTEM privileges, while Microsoft's individual entries provide the affected products and updates for [CVE-2026-85880](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-85880) and [CVE-2026-81963](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-81963).

**Why it matters:** These are not initial-access vulnerabilities, but they can turn code running with limited rights into full system control. That makes them valuable after a malicious document, browser exploit, stolen session, or other first foothold.

**Action:**

- Prioritize the September cumulative updates for exposed, privileged, and high-value Windows workstations and servers, then confirm build compliance rather than relying on deployment status alone.
- Review EDR detections and suspicious process chains on systems that were unpatched, especially activity that crossed from a sandboxed or low-privilege process into SYSTEM context.
- Treat confirmed exploitation as an incident: isolate the endpoint, preserve telemetry, and rotate credentials or sessions used from it before returning it to service.

### 3. Chrome fixes another zero-day already used in attacks

**What happened:** Google released Chrome 153.0.8010.36 for Linux, 153.0.8010.36 for Windows, and 153.0.8010.37 for macOS with 230 security fixes. The [Chrome release record](https://chromereleases.googleblog.com/2026/) and [current reporting](https://www.bleepingcomputer.com/news/security/google-patches-seventh-chrome-zero-day-exploited-in-attacks-this-year/) identify CVE-2026-87491 as an out-of-bounds write in V8 and say Google is aware of exploitation in the wild.

**Why it matters:** This is the second exploited V8 flaw defenders have had to move on this month. A browser update can be installed but still inactive until users relaunch, and unmanaged Chromium-based browsers may follow a different patch schedule.

**Action:**

- Accelerate Chrome 153 deployment and require a browser relaunch, then measure the actual running version across Windows, macOS, and Linux devices.
- Track Edge, Brave, and other Chromium-based browsers separately and confirm that each vendor has incorporated the upstream fix.
- Review browser crashes, suspicious child processes, new persistence, and unusual identity sessions on devices that were behind the fixed build.

### 4. Cisco confirms root-level FMC authentication bypass exploitation

**What happened:** Cisco updated its advisory for CVE-2026-20079 on September 9 to confirm active exploitation observed in August. The maximum-severity flaw lets an unauthenticated remote attacker send crafted HTTP requests to the Secure Firewall Management Center web interface and execute scripts or commands as root; [Cisco's advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-onprem-fmc-authbypass-5JPp45V2) says there is no workaround and provides fixed releases, hotfixes, and an indicator to search in /var/log/messages.

**Why it matters:** FMC is a control plane for firewall policy and visibility. Root access there can undermine the controls an organization depends on to segment and inspect the rest of the network, and applying the hotfix does not clean up an appliance that was already compromised.

**Action:**

- Apply Cisco's fixed release or the correct hotfix for every on-premises FMC instance and restrict the management interface to trusted administrative networks.
- Search /var/log/messages for the license.tmp indicator in Cisco's advisory and preserve logs before making additional changes.
- Contact Cisco TAC if the indicator is present, and rebuild or otherwise remediate the manager under incident-response procedures instead of treating the patch as cleanup.

### 5. Check Point ships emergency fixes for two VPN-path RCEs

**What happened:** Check Point disclosed CVE-2026-85102 and CVE-2026-85103, two CVSS 9.8 flaws in VPN certificate processing that can allow unauthenticated remote code execution under specific conditions. The [vendor's announcement](https://community.checkpoint.com/t5/General-Topics/Action-Required-Critical-Security-Advisory-VPN-Vulnerabilities/td-p/281995) says it has no indication of active exploitation and is rolling out Live Patch protection, while [CERT-EU's advisory](https://www.cert.europa.eu/publications/security-advisories/2026-012/) maps the affected Security Gateway, Security Management Server, and Spark Firewall versions.

**Why it matters:** Remote Access VPN and site-to-site VPN terminate at the network perimeter and handle attacker-controlled certificate data before a user is trusted. A pre-authentication memory-safety failure there deserves an emergency change window even without public exploitation evidence.

**Action:**

- Identify gateways and management servers configured for Remote Access VPN or site-to-site VPN and match each release line to Check Point's current hotfix guidance.
- Confirm Live Patch protection where it is enabled; otherwise install the supported Jumbo Hotfix and verify the active patch level on every cluster member.
- Restrict management access, preserve VPN and system logs, and monitor vendor guidance for indicators or a change in exploitation status.

### 6. A cPanel mail-enabled account can become root

**What happened:** WebPros disclosed CVE-2026-67401, a critical SQL injection flaw in cPanel's EmailTrack functionality. An authenticated account with mail-related privileges can create arbitrary files and ultimately execute code as root, putting other tenants on the same host at risk. The [cPanel security advisory](https://support.cpanel.net/hc/en-us/articles/43187903921559-Security-CVE-2026-67401-SQL-Injection-Vulnerability-in-cPanel-s-EmailTrack-Functionality-September-8-2026) and [Canadian Centre for Cyber Security notice](https://www.cyber.gc.ca/en/alerts-advisories/webpros-security-advisory-av26-908) list fixed builds for supported cPanel, WHM, and WP Squared release lines.

**Why it matters:** Shared hosting relies on one customer's account staying inside its own boundary. A path from ordinary mail privileges to root breaks that isolation and can expose every site, database, mailbox, and credential stored on the server.

**Action:**

- Update each cPanel and WHM server to the fixed build for its release line and verify the installed version after the service restart.
- Inventory mail-enabled accounts and review EmailTrack requests, unexpected root-owned files, web shells, cron jobs, SSH keys, and recently changed site content.
- If suspicious activity is found, isolate the host, preserve disk and log evidence, rotate tenant and administrative secrets, and rebuild from a known-good state.

### 7. SAP fixes two unauthenticated routes to business-system takeover

**What happened:** SAP's September Security Patch Day addresses CVE-2026-44756 in Extended Passport processing and CVE-2026-58240 in the NetWeaver Message Server. [CERT-EU's technical summary](https://www.cert.europa.eu/publications/security-advisories/2026-011/) says both are remotely exploitable without authentication and can lead to operating-system command execution as the SAP installation owner; SAP Security Notes 3747649 and 3759472 contain the vendor fixes.

**Why it matters:** SAP systems carry finance, supply-chain, customer, and personnel workflows that are difficult to take offline. The Message Server flaw is especially awkward because the affected service may share the port used by legitimate SAP GUI clients, limiting the value of a simple firewall workaround.

**Action:**

- Have the SAP Basis team map kernel and Message Server versions to Security Notes 3747649 and 3759472 and schedule the supported updates immediately.
- Verify network exposure to the affected services from user, partner, and untrusted segments, then reduce it where business operations allow.
- Review SAP and operating-system logs for unexpected component registration, commands, child processes, or changes made under the SAP service account before patching.

### 8. GoAnywhere MFT path traversal exposes files outside user sandboxes

**What happened:** Fortra released GoAnywhere MFT 7.10.2 to fix CVE-2026-15913. In earlier versions, a Web User with both Secure Folders and Secure Mail permissions can abuse the /attachRemoteFiles endpoint to escape the user's sandboxed home directory and read arbitrary files. [Fortra's advisory](https://www.fortra.com/security/advisories/product-security/fi-2026-011) rates the flaw high severity and does not report active exploitation.

**Why it matters:** Managed file-transfer servers concentrate regulated documents, credentials, connection profiles, and partner data. The attacker needs a particular authenticated permission set, but one compromised customer or partner account can cross a boundary administrators expected the product to enforce.

**Action:**

- Upgrade every affected GoAnywhere MFT deployment to 7.10.2 or later and verify all nodes in clustered or failover environments.
- Find Web Users with both Secure Folders and Secure Mail permissions and remove combinations that are not operationally necessary.
- Review Secure Mail draft attachments, /attachRemoteFiles requests, and file-access logs for paths or reads outside each user's approved folders.

### 9. AdaptHealth breach scope reaches 4.1 million people

**What happened:** AdaptHealth's report to federal regulators now puts the affected population from its June incident at 4,115,802 people. The company's [SEC filing](https://www.sec.gov/Archives/edgar/data/1725255/000110465926080297/ahco-20260627x8k.htm) says a social-engineering attack compromised a third-party contractor's user session and opened cloud-based patient-management, document-storage, and external electronic-health-record portals; the exposed data included protected health information, personally identifiable information, and a stored password file used for insurance billing.

**Why it matters:** The entry point was a valid session tied to a contractor, not a dramatic exploit. That puts session controls, vendor access, and cloud audit coverage at the center of a breach affecting millions of patients and shows why MFA enrollment alone is not enough after authentication succeeds.

**Action:**

- Review contractor identities for least privilege, short session lifetimes, device requirements, phishing-resistant MFA, and prompt termination when work ends.
- Alert on impossible travel, new browser or device use, bulk document access, and cross-application movement by vendor accounts in patient and billing systems.
- Organizations receiving incident details should scope exposed records precisely and use official notification channels; affected patients should be cautious of billing, insurance, and healthcare-themed phishing.

### 10. US agencies detail industrial-scale AI model distillation campaigns

**What happened:** The NSA, CISA, and FBI published a joint advisory alleging that six China-based AI companies have used distributed accounts, cloud platforms, and infrastructure to extract restricted capabilities from US frontier models at industrial scale since late 2024. The [NSA release](https://www.nsa.gov/Press-Room/Press-Releases-Statements/Press-Release-View/Article/4592113/nsa-and-others-warn-china-based-ai-companies-are-distilling-us-frontier-ai-mode/) says the advisory includes detection signals, tactics, and mitigations for model providers and the wider AI ecosystem.

**Why it matters:** This is less a conventional intrusion than abuse of legitimate access at a scale that looks different only when telemetry is joined across accounts, providers, payment methods, and infrastructure. The same monitoring lesson applies to enterprises adopting AI APIs: a valid key can still be used in a way its owner never intended.

**Action:**

- AI service providers should correlate accounts, payment signals, source infrastructure, prompt similarity, request cadence, and sudden maximum-rate usage instead of reviewing each account alone.
- Enterprises should keep AI API keys in managed secret stores, assign them per application, cap usage, alert on geographic or volume anomalies, and rotate exposed credentials.
- Document which vendors, gateways, and internal agents can reach each model so an abnormal usage pattern can be traced to an owner quickly.

## Closing Notes

My first check this week would be the management plane: MikroTik routers with SSH exposure and on-premises Cisco FMC should be treated as possible incident-response cases, not routine patch tickets. Windows and Chrome come next because exploitation is confirmed and the vulnerable population is broad.

Check Point, cPanel, SAP, and GoAnywhere have narrower exposure conditions, but the consequences are serious enough to verify versions now rather than waiting for normal maintenance reports. The AdaptHealth and AI stories make the same operational point from different directions: once a session or API credential is trusted, defenders still need enough context to notice when its behavior stops making sense.
