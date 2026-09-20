---
date: 2026-09-20T11:30:09-05:00
title: "Security Signal Weekly: September 12-18, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117304343430199499}, x: {url: https://twitter.com/thecyberseckyle/status/2101712293817995564, buffer_id: 6ab00bb9aa5c0ff01eacc305}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7507478083138998272, buffer_id: 6ab00bbb12a7a16e8100195b}}
publishedAt: "2026-09-20T16:37:12.518Z"
---

## Overview

The common thread this week is control-plane risk. Cisco confirmed active attacks against email-security and network-access appliances, CISA flagged exploitation of ScreenConnect and GitLab, ransomware crews moved onto a vCenter flaw, and attackers used Artifactory and Conductor weaknesses to turn trusted automation into durable access.

Brevo shows the same problem without a product CVE: a long-lived Cloudflare key let an attacker alter scripts embedded across customer sites. The WordPress and Acronis stories then bring the lesson down to smaller hosting environments. If a system distributes software, grants access, runs workflows, manages infrastructure, or backs up other systems, patching the entry point is only half the job. You also have to check what the attacker could have changed while that trust was available.

> **Reality check:** A fixed build can close the door while leaving the admin account, plugin, token, web shell, or modified script that came through it. Patch and verify, then investigate persistence separately.

## Top 10 Security Signals

### 1. Cisco Secure Email Gateway zero-day turns a crafted message into root access

**What happened:** Cisco says attackers are exploiting CVE-2026-76461, a CVSS 9.8 SQL-injection flaw in AsyncOS email parsing. A specially crafted message can reach a physical or virtual Secure Email Gateway without authentication and lead to command execution as root. [Cisco's advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-inj-2bLVGmhX) says there is no workaround, while [CISA added the flaw to the Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog).

**Why it matters:** This is an email-security appliance being compromised by the traffic it is supposed to inspect. Root access on the gateway can undermine filtering, expose message flows, and give an attacker a trusted position between the internet and internal mail systems.

**Action:**

- Upgrade every affected Secure Email Gateway to Cisco's fixed AsyncOS release and verify the running build on each standalone or clustered appliance.
- Preserve appliance logs and compare systems with Cisco's indicators before declaring the update complete; a root-level attacker may be able to remove local evidence.
- Review outbound connections, configuration changes, administrator activity, and downstream mail or identity events from the period before remediation.

### 2. Cisco ISE authentication bypass is active with no workaround

**What happened:** Cisco confirmed active exploitation of CVE-2026-76460, a maximum-severity authentication bypass in an Identity Services Engine API. [The vendor advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-ISE-ABP-VNSW7Tn5) says an unauthenticated remote attacker can send a crafted request and bypass the web management interface; fixed patches are available for supported ISE and ISE-PIC 3.1 through 3.5 releases, and there is no workaround.

**Why it matters:** ISE helps decide which users and devices may enter the network. Unauthorized management access can weaken network access policy, expose identity and device data, and turn a defensive control plane into the attacker's route around segmentation.

**Action:**

- Apply the fixed ISE patch for every node in the deployment and verify the patch level after services return.
- Restrict management and API access to dedicated administrative networks even after patching.
- Review administrator logins, API calls, policy changes, endpoint registrations, and certificate activity for the exposed period.

### 3. ScreenConnect file-transfer flaw moves from advisory to active exploitation

**What happened:** CISA now lists CVE-2026-84869 as exploited. The flaw affects ScreenConnect clients before 26.6.5 and can allow a low-privileged user in an active remote session to transfer or execute files without the expected authorization or host confirmation. [ConnectWise's bulletin](https://www.connectwise.com/company/trust/security-bulletins/2026-09-08-screenconnect-bulletin) calls for an emergency update and offers removal of the TransferFiles permission only as a temporary mitigation. I also wrote up [a recent unauthorized ScreenConnect investigation](/blog/rogue-screenconnect-incident-response/) where the observed behavior fit the capability described by the advisory, while the available evidence did not prove that this CVE caused the incident.

**Why it matters:** Remote support software is deliberately powerful, and MSPs often deploy it across many customers. Weak authorization inside an active session can turn ordinary support functions into a path for malware execution, while an unauthorized client may also point to social engineering or an earlier compromise.

**Action:**

- Upgrade on-premises ScreenConnect to 26.6.5 or later, update access agents and host clients, and verify the deployed client versions.
- If the update cannot land immediately, remove TransferFiles from every applicable role and session group, then document the exception and deadline.
- Hunt for unexpected sessions, RunFile actions, file transfers, relay connections, new remote clients, and payloads staged in ScreenConnect temporary directories.

### 4. GitLab path traversal exposes files and secrets on self-managed servers

**What happened:** CVE-2026-85706 lets an unauthenticated attacker read arbitrary files through GitLab's repository commits API. GitLab rates the flaw CVSS 10.0, says CISA has added it to the KEV catalog, and provides detection rules in its [critical patch release for 19.3.2, 19.2.6, and 19.1.8](https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-3-2-released/). GitLab.com and GitLab Dedicated are already patched; self-managed installations need an upgrade.

**Why it matters:** Files on a GitLab server can include application secrets, configuration, repository credentials, runner tokens, and integration keys. Arbitrary file read is not limited to source-code disclosure when the host also brokers CI/CD and deployment access.

**Action:**

- Upgrade self-managed GitLab to a fixed release and plan for the database migrations called out in GitLab's release notes.
- Use GitLab's published detections to review repository-commit API requests for traversal attempts and unexpected file paths.
- Rotate secrets that could have been readable from the host and review runner, package, repository, and deployment activity for follow-on access.

### 5. Ransomware crews are exploiting the vCenter flaw defenders were already told to treat as an emergency

**What happened:** CISA updated CVE-2026-59310 to show ransomware use after earlier exploitation had already been reported. The flaw is a critical directory traversal in the vCenter Syslog server that can give an unauthenticated attacker code execution. [Current reporting](https://www.bleepingcomputer.com/news/security/cisa-critical-vmware-vcenter-rce-flaw-now-exploited-by-ransomware-gangs/) says Broadcom patched it on July 29 and that more than 450 vCenter servers remained internet-exposed when the ransomware warning was issued.

**Why it matters:** vCenter is the administrative center of a virtual estate. An attacker who controls it can reach workloads, credentials, snapshots, and recovery paths, which is why ransomware operators value VMware management infrastructure instead of treating it as just another server.

**Action:**

- Confirm the exact vCenter build against Broadcom's fixed releases and remove direct internet exposure from management services.
- Review vCenter, ESXi, identity, and network telemetry for suspicious Syslog requests, reverse tunnels, new accounts, changed permissions, and unusual administrative sessions.
- Test recovery from copies that are isolated from the VMware control plane and rotate credentials available to the appliance if compromise is suspected.

### 6. Artifactory attackers are leaving persistence that survives the patch

**What happened:** Wiz confirmed in-the-wild exploitation of CVE-2026-42016, CVE-2026-42018, and CVE-2026-82329 against self-hosted JFrog Artifactory. [Its investigation](https://www.wiz.io/blog/artifactory-under-attack-in-the-wild-exploitation-of-cve-2026-42016-cve-2026-4201) found attackers chaining token flaws, creating administrator accounts, stealing configuration and cluster keys, adding SSH keys, and installing malicious Groovy plugins for command execution. The plugins can remain after an upgrade because patching closes the entry point but does not remove files already placed in Artifactory's plugin directory.

**Why it matters:** Artifactory holds packages, containers, build inputs, credentials, and trust relationships used throughout software delivery. A persistent plugin inside that system can outlive the vulnerability and turn a package repository into a supply-chain foothold.

**Action:**

- Upgrade self-hosted Artifactory to a fixed release listed in the current [JFrog advisory table](https://docs.jfrog.com/releases/docs/jfrog-security-advisories).
- Inspect administrator accounts, tokens, SSH keys, join-key access, configuration exports, and the Artifactory plugin directory instead of stopping at version compliance.
- Rotate repository and integration credentials and rebuild the service from a known-good state when unauthorized plugins or administrative changes are found.

### 7. Orkes Conductor workflow definitions are being used for unauthenticated code execution

**What happened:** CVE-2026-58138 affects open-source Orkes Conductor before 3.30.2. Attackers can submit an inline workflow containing malicious JavaScript or Python and execute operating-system commands because the evaluator exposes the Java host with broad access. [SecurityWeek reports](https://www.securityweek.com/critical-orkes-conductor-vulnerability-exploited-in-attacks/) that exploitation began in August and Fortinet blocked roughly 1,300 attempts over September 8 and 9.

**Why it matters:** Conductor orchestrates microservices, workflows, and AI agents. A public workflow API with no authentication turns business automation into remote code execution, and the service account may already have broad access to queues, databases, secrets, or cloud resources.

**Action:**

- Upgrade to Conductor 3.30.2 or later and confirm every container, image, and node is running the fixed version.
- Remove public access to workflow API endpoints and enforce authentication and network policy in front of the service.
- Review workflow registrations, inline tasks, child processes, outbound traffic, and service-account activity for commands or definitions that do not match approved automation.

### 8. A stolen Brevo Cloudflare key turned customer-embedded scripts into a malware channel

**What happened:** Brevo says an attacker used a long-lived Cloudflare API key with broad account permissions to deploy a malicious Worker on September 14. The Worker modified Brevo pages and three JavaScript files embedded on customer websites, selectively showing ClickFix lures and attempting to install a malicious WordPress plugin for logged-in administrators. Brevo's [status history](https://status.brevo.com/history) links the resolved incident and post-mortem; [reporting based on that post-mortem](https://www.securityweek.com/brevo-supply-chain-attack-injects-malware-into-100000-websites/) says more than 100,000 sites may have loaded affected code during the roughly five-and-a-half-hour window.

**Why it matters:** The compromise did not require attackers to breach each customer site. One trusted script and one overpowered key created distribution at supply-chain scale, while selective delivery made ordinary spot checks less likely to see the malicious page.

**Action:**

- Organizations that embed Brevo scripts should review web, DNS, endpoint, and WordPress administrator telemetry for September 14 rather than assuming Brevo's cleanup erased downstream effects.
- Hunt for ClickFix behavior, copied Run-dialog commands, new browser downloads, unexpected WordPress plugins, and related endpoint detections.
- Inventory third-party scripts, pin or self-host critical assets where practical, and require scoped, short-lived API credentials with alerting for Worker, route, and DNS changes.

### 9. WooCommerce plugin attacks are uploading PHP backdoors months after the fix

**What happened:** Attackers are exploiting CVE-2026-27540 in WooCommerce Wholesale Lead Capture versions 2.0.3.1 and older. The unauthenticated upload handler accepts an attacker-controlled file-type allowlist, allowing PHP web shells to be written to the site. [BleepingComputer's coverage of Wordfence's findings](https://www.bleepingcomputer.com/news/security/hackers-target-wordpress-sites-via-third-party-woocommerce-plugin/) says the firewall blocked more than 100,000 attempts and that version 2.0.3.2 has contained the fix since February.

**Why it matters:** A patched plugin is only useful if the store actually received the update. Small commerce sites often lack centralized inventory and may keep a web shell after the vulnerable code is replaced, leaving customer data, orders, payment workflows, and site visitors exposed.

**Action:**

- Update Wholesale Lead Capture to 2.0.3.2 or later and confirm the active plugin version from the server, not only the WordPress dashboard notification state.
- Search upload and plugin directories for unexpected PHP files, especially shell.php and recently created or modified scripts.
- Review administrator accounts, scheduled tasks, database users, outbound connections, and content changes; rebuild from a known-good copy if a web shell is found.

### 10. Acronis patches a cPanel backup-plugin flaw used in targeted attacks

**What happened:** Acronis released urgent fixes for CVE-2026-87886, an insecure-permissions flaw that allows local privilege escalation in its Linux backup integrations. The company says exploitation has been detected in limited, targeted attacks against the Backup plugin for cPanel and WHM, not the Plesk extension. [SecurityWeek's report](https://www.securityweek.com/acronis-patches-exploited-vulnerability-in-cpanel-backup-plugin/) lists fixed builds 1.9.3.1021 for cPanel and WHM and 1.8.11.638 for Plesk.

**Why it matters:** Backup software has privileged access to large portions of a hosting server and its customer data. A local foothold that becomes root through the backup layer can threaten every tenant and the recovery copies administrators expect to trust after an incident.

**Action:**

- Upgrade the cPanel and WHM plugin to build 1.9.3.1021 or later and the Plesk extension to 1.8.11.638 or later, then verify the installed build.
- Review local accounts, file ownership and permissions, root-level process activity, cron jobs, SSH keys, and backup configuration changes on affected hosts.
- Validate that backups are intact and isolated, and rotate credentials accessible to the plugin when exploitation or unexplained privilege changes are found.

## Closing Notes

The first queue this week is Cisco Secure Email Gateway, Cisco ISE, ScreenConnect, GitLab, and vCenter because exploitation is confirmed and each product controls access to something larger than itself. Artifactory and Conductor deserve the same urgency wherever they are reachable from untrusted networks.

The investigation work cannot wait until after the maintenance window. Artifactory's surviving plugins, Brevo's modified edge scripts, and the web shells targeting WooCommerce sites show why version compliance and incident closure are different decisions. Patch the documented weakness, verify the running state, and then look for what the attacker may have left behind.
