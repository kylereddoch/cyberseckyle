---
layout: newsletter-issue
permalink: /newsletter/defenders-dispatch/issue-010/2026-10-17/
title: Trust Does Not Close the Ticket
seoTitle: "Defender’s Dispatch Issue 010: Trust Does Not Close the Ticket"
description: BeyondTrust, Ivanti, and Cisco exploitation, plus AOMEI updates, refrigeration controls, Nextcloud, and Check Point checks.
searchIntent: Read The Defender’s Dispatch Issue 010 and its practical cybersecurity, IT, and MSP checks.
issueNumber: "010"
issueDateLabel: October 17, 2026
date: 2026-10-17T16:00:00-05:00
emailSubject: "[Issue 010] Defender’s Dispatch: Trust Does Not Close the Ticket"
emailPreview: BeyondTrust, Ivanti, and Cisco exploitation, plus AOMEI, refrigeration, Nextcloud, and Check Point checks.
trackingPath: /newsletter/defenders-dispatch/issue-010
closingNote: That’s all for this week. Find the trusted systems that can reach the most, verify their running state, and keep the evidence needed to answer what happened before the fix.
highlights:
  - BeyondTrust Remote Support zero-day exploitation
  - Ivanti Connect Secure and Cisco Secure Email fixes
  - AOMEI update tampering and refrigeration controller exposure
  - Collabora for Nextcloud and Check Point compromise checks
---

<p class="dispatch-eyebrow">From Kyle’s desk</p>

## Trust does not close the ticket

The systems we trust most often sit closest to everything we are trying to protect. A remote-support appliance can reach endpoints. A VPN gateway can broker internal access. An email security appliance inspects hostile files. Backup and remote-access updaters run with privileges ordinary applications do not need.

That trust is useful, but it cannot be the reason a detection is dismissed. This week’s BeyondTrust, Cisco, and AOMEI cases all show why a clean vendor URL, a completed patch job, or a product category labeled “security” is weak evidence on its own. The more authority a system has, the more important it is to keep logs outside that system and know which credentials and downstream assets it can reach.

For IT teams and MSPs, the practical work is inventory and evidence. Identify the systems that broker access, verify the version and configuration actually running, preserve the exposed-period logs, and write down the next containment step before an incident makes the decision urgent.

---

<p class="dispatch-eyebrow dispatch-eyebrow--blue">Security Signal Weekly</p>

## Security signals and next steps

Three trusted edge systems need patching and a look backward at the period before the fix.

### 01 · BeyondTrust Remote Support exploitation reached appliance-level control

**What happened:** BeyondTrust disclosed CVE-2026-102764 on October 15. The critical origin-validation flaw affects self-hosted Remote Support versions through 26.2.3 and allows an unauthenticated remote attacker to perform file operations on the appliance. Mandiant found the suspected China-nexus actor ARMORY CASTLE exploiting the flaw as a zero-day in late August, then deploying the SAWFLY web shell and BARECLAW tunnel, escalating to root, modifying HAProxy routing, deleting logs, and attempting to extract credentials from the appliance vault.

**Why it matters:** Remote Support exists to give administrators access to other systems. An attacker with appliance-level control can reach stored credentials, support sessions, and the endpoints behind them. Applying the patch closes the known entry point, but it does not remove persistence or answer what the appliance accessed before the fix.

**What to check next:** Apply the BT26-05-RS patch to supported self-hosted appliances and upgrade anything older than 24.3.1 first. Treat an internet-reachable vulnerable appliance as potentially compromised. Review the encrypted appliance logs and Mandiant indicators for SAWFLY, BARECLAW, SUID shell copies, HAProxy changes, and log deletion. Rebuild or replace a compromised appliance through BeyondTrust support, then rotate the credentials, API keys, and endpoint access it stored or brokered. [BeyondTrust’s BT26-05 advisory](https://www.beyondtrust.com/trust-center/security-advisories/bt26-05) lists the affected and fixed versions; [Mandiant’s investigation](https://cloud.google.com/blog/topics/threat-intelligence/armory-castle-exploits-beyondtrust/) documents the observed intrusion.

### 02 · Ivanti Connect Secure has an exploited bypass and an unfinished chain

Ivanti says it is aware of limited in-the-wild exploitation of CVE-2026-104935, an unauthenticated authentication-bypass flaw in limited Connect Secure releases. Fixed releases include 25.1.1.2, 25.1.3.0, 25.1.3.1, and 22.8R2.5, depending on the code line. Ivanti also says a related privilege-escalation flaw used in the same attack chain will receive a separate fix.

Upgrade every affected appliance to the appropriate fixed release and verify the running version. Run Ivanti’s Integrity Checker Tool, preserve the results, and review external network, authentication, configuration, and identity logs from the exposed period. A clean result from one integrity check is not proof that the chain was never used. Restrict management access and track the separate privilege-escalation fix instead of treating the bypass update as the end of the incident question. Ivanti’s [October security update](https://www.ivanti.com/en-gb/blog/october-2026-security-update) and [Patch Tuesday guidance](https://www.ivanti.com/en-gb/blog/october-2026-patch-tuesday) provide the current remediation details.

### 03 · Cisco Secure Email’s inspection path became a root-level exploit path

Cisco is responding to active exploitation of CVE-2026-76519, a CVSS 9.8 arbitrary-file-write flaw in the Advanced Malware Protection feature of Secure Email Gateway. A vulnerable physical or virtual gateway has File Reputation enabled and Content Scanner Tools earlier than 25.3.0.5525. A crafted attachment can reach the vulnerable inspection path and lead to commands running as root. Cisco says there is no workaround.

Run `contentscannerstatus` on every appliance and cluster member. Update Content Scanner Tools to 25.3.0.5525 or later, or install Cisco’s listed fixed AsyncOS release; the scanner update does not require a restart. Search each member’s `system_logs` for `System Security` messages and review firewall and network telemetry outside the appliance because a root-level attacker can remove local evidence. Preserve forensic data before rebuilding a virtual appliance, renew credentials and cryptographic material, and treat exposed cluster SSH keys as part of the recovery scope. The [Cisco advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-esa-afw-zqYJkjxp) includes the commands, fixed releases, and recovery guidance.

---

<p class="dispatch-eyebrow dispatch-eyebrow--green">Operations</p>

## The IT and MSP desk

Three inventory problems that normal endpoint and patch reports can miss.

### AOMEI’s update servers were clean most of the time

Google Threat Intelligence Group and Mandiant found UNC7017 tampering with AOMEI Technology’s update infrastructure between April and July. Each malicious configuration window lasted only five to ten minutes before the servers returned to legitimate content. Systems polling during those windows could receive the CROSSROAD downloader and SHINYROAD backdoor through AOMEI Backupper or AnyViewer. The campaign also used WebDAV for credential coercion and abused legitimate remote-administration software.

Do not close an updater alert because the vendor URL is clean now. Hunt across systems that ran AOMEI Backupper or AnyViewer during the affected period using Mandiant’s published hashes, domains, IP addresses, YARA rules, and `RadminComponentRuntime` task. Preserve cached configuration files under `%PROGRAMFILES(X86)%\AOMEI\*\Tmphtml\` and line them up with proxy and firewall telemetry from the exact alert time. [Mandiant’s supply-chain investigation](https://cloud.google.com/blog/topics/threat-intelligence/investigating-ephemeral-supply-chain-tampering) explains why point-in-time web checks miss this attack.

### Refrigeration controllers need the same exposure review as servers

CERT-FR says it knows of numerous compromises involving Danfoss AK-SM and AK-SC controllers plus Copeland and Dixell XWeb systems. Its alert, first published October 12 and updated October 16, says attack campaigns are probably still underway. It also warns that factory-resetting an exposed, end-of-life controller is not enough because the same vulnerable device is likely to be compromised again.

Inventory each controller by model, firmware, support status, public exposure, remote-management path, and responsible service provider. Remove direct internet exposure, restore remote access only through a secure VPN or protected network, change default passwords, and use the vendor’s strict security mode where available. If a controller is compromised, preserve the needed evidence, reset or restore it, reconfigure it, and fix the access path before returning it to service. The [CERT-FR alert](https://cert.cyber.gouv.fr/alerte/CERTFR-2026-ALE-012/) has the current affected-product list and recovery steps.

### Disabling the Collabora app does not remove the vulnerable files

CVE-2026-110447 is an unauthenticated command-injection flaw in the Collabora Online Built-in CODE Server app for Nextcloud. Versions before 26.4.303 are vulnerable when the bundled CODE server is stopped. The fixed release shipped September 11, while the formal advisory and CVE appeared October 14. Standalone Collabora servers and Nextcloud All-in-One are outside this flaw’s scope.

Upgrade `richdocumentscode` to 26.4.303 or later or remove the app entirely when it is not needed. Disabling it leaves the vulnerable files in place. Inspect the app directory, web root, PHP files, web-server logs, and outbound connections for web shells or requests to `proxy.php`, including evidence from before the disclosure date. If compromise is found, rotate Nextcloud administrator and database credentials, invalidate relevant sessions, and restore changed files from a known-good source. The [Collabora release history](https://github.com/CollaboraOnline/richdocumentscode/releases/) provides the fixed build record.

### Patch and exploit watch: Check Point fixes two pre-authentication paths

Check Point published fixes for CVE-2026-85102 and CVE-2026-93616, both rated CVSS 9.8. CVE-2026-85102 allows pre-authentication code execution through VPN certificate handling, with exploitation attempts observed against Spark customers since September 12. CVE-2026-93616 is a pre-authentication path traversal in the management web service that can execute scripts and load arbitrary Java classes; Check Point observed a handful of targeted attacks on July 23.

Use Check Point’s product-specific support guidance to install the applicable fixes and verify the hotfix take on every gateway and management server. Review certificate-based Mobile Access logins and follow suspicious sessions into internal scanning or service access. Do not count LivePatch Take 28 or 29 as remediation for CVE-2026-93616. The [Check Point advisory](https://blog.checkpoint.com/security/security-advisory-action-required-active-exploitation-of-cve-2026-85102-and-a-management-pre-authentication-vulnerability-cve-2026-93616/) includes the affected trains, observed activity, and support references.

---

<p class="dispatch-eyebrow dispatch-eyebrow--yellow">Rotating field notes</p>

## Two field notes for this week

One way to find the trust brokers before an incident, plus a configuration record that keeps the next response grounded.

### What I’d do Monday morning: name one system that can reach the most

Pick one remote-support, VPN, email security, backup, or management platform. Write down who owns it, whether any interface is public, the version and hotfix actually running, where its logs are copied, which credentials it stores, and which internal systems it can reach.

Do not try to finish the whole environment in one morning. The useful result is one reviewed trust path with an owner and a next action. If that record would be hard to produce during an incident, the gap already exists.

### Configuration Corner: keep evidence outside the trust broker

An attacker with root access to an appliance can alter or delete its local logs. Send authentication, administrative, configuration, and network events to a separate system before they are needed. Keep firewall, proxy, identity, and endpoint telemetry that can confirm what the appliance did after access was gained.

Test the evidence path with one normal administrative action. Make a harmless configuration change or support connection, then confirm the external logs show the actor, source, time, target, and result. A retention setting is not proof that the evidence arrives or remains usable.

---

<p class="dispatch-eyebrow">Worth your time</p>

## [Citizen Lab’s AdFection investigation](https://citizenlab.ca/research/how-discover-tech-turned-targeted-ads-into-a-pipeline-for-spyware/)

Citizen Lab documents a zero-click mercenary-spyware delivery chain that used targeted advertising. It links the campaign with high confidence to Candiru spyware delivered through Discover-Tech’s ad platform and says at least 45 Al Jazeera devices were targeted in 2024 and 2025. The report is worth reading because ordinary phishing advice does not fit this delivery path: the ad can profile and redirect a selected device without a click. For high-risk users, the response moves toward rapid patching, reduced ad tracking, content controls where policy allows, separated browser or device profiles, and enough DNS, proxy, browser, and endpoint telemetry to investigate selective redirects.

<p class="dispatch-eyebrow dispatch-eyebrow--blue">From CybersecKyle</p>

## [Enzo Reader Review: Catching Up on Feedbin in ChatGPT](/blog/enzo-reader-feedbin-chatgpt-review/)

I tested Enzo Reader against my Feedbin collection to see whether it could help me work through an RSS backlog. Quick catch-up summaries, search, and full-text retrieval worked. Date, feed, tag, and favorites filters returned errors in my session, and a saved-item test did not update anything. My review covers where the connection helped, where I went back to Feedbin, what the pricing promises, and the privacy questions I would check before connecting a private collection.

That’s all for this week. Find the trusted systems that can reach the most, verify their running state, and keep the evidence needed to answer what happened before the fix.

\- Kyle

### Have a signal I should see?

[Send me the original source and tell me why it matters](/submit-news/). I review reader submissions for possible inclusion in a future issue, and I will credit you according to the preference you choose.
