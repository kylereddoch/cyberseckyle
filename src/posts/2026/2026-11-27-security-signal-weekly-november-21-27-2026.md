---
date: 2026-11-27T15:05:06-06:00
title: "Security Signal Weekly: November 21-27, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117690479941004147}, x: {url: https://twitter.com/thecyberseckyle/status/2126425033522192728, buffer_id: 6b09f341277f27038a3c882b}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7532190821782081536, buffer_id: 6b09f343c02ca0988ab73c96}}
publishedAt: "2026-11-27T21:16:48.086Z"
---

## Overview

This week's urgent work is concentrated in systems that already have broad authority: collaboration servers tied to Active Directory, virtualization and network control planes, a firewall management interface, an email-security platform, a package registry, and third-party code that runs inside customer websites. Several vendors shipped fixes before defenders learned how much attackers had already done. MiCollab, Xen Orchestra, Juniper Session Smart, Drupal, PAN-OS, and N-able Mail Assure all need some combination of patching and retrospective investigation, not a closed ticket based on a current version alone.

The incident reports carry the same lesson beyond vulnerability management. [Hex.pm](https://hex.pm/blog/security-incident-on-hexpm) could verify that packages were not modified but could not rule out database reads. Optimizely removed injected JavaScript, while affected customers still need to understand what ran on their own sites. Reports involving Radware and Cleverbridge move the response into cloud credentials and payment cards, where the useful evidence sits outside the compromised provider.

> **Reality check:** A fixed version proves what is running now. It does not prove an exposed server was clean yesterday, a stolen token was never used, or injected code left no downstream evidence.

## Top 10 Security Signals

### 1. MiCollab zero-days reached identity and backup systems before the patch

**What happened:** Mitel updated [MISA-2026-0012](https://www.mitel.com/support/security-advisories/mitel-product-security-advisory-misa-2026-0012) for five flaws in MiCollab's Audio, Web and Video Conferencing component, including unauthenticated XML and command injection. [Accenture APEX Labs](https://accenture.github.io/cyber-intelligence/micollab-exploitation/) says attackers used the flaws before Mitel's November 16 advisory, reached root on one MiCollab server within 30 minutes, moved into identity infrastructure, and later accessed backup and database systems. CISA added all five CVEs to its [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog) on November 25. Accenture assesses that AI-assisted tooling probably supported part of the activity, but its sampled telemetry cannot show exactly how the services were used.

**Why it matters:** MiCollab is not an isolated phone server when it holds directory credentials and can reach internal services. A team that installed the patch after November 16 may have closed the entry point while leaving web shells, stolen credentials, altered logs, or activity on downstream systems untouched.

**Action:**

- Apply Mitel's patch for release 10.3 (10.3.0.18) or move to a later fixed release, then verify the running build and patch state on every MiCollab node.
- Use Accenture's indicators and host artifacts to examine MiCollab systems from before November 16, including outbound connections, web-shell locations, local-log gaps, and unexpected privileged commands.
- If compromise is possible, rotate the directory and service credentials available to MiCollab and review domain controllers, backup servers, and database systems the appliance could reach.

### 2. Xen Orchestra authentication bypass became a hypervisor takeover path

**What happened:** Vates says CVE-2026-133469 lets an unauthenticated request present an empty JSON object as an authentication token and obtain an existing user's access. The [Vates advisory](https://docs.vates.tech/security-advisories/advisories/2026/vates-sa-2026-062/) documents active exploitation, malicious virtual-machine changes, and persistence on XCP-ng hosts. Versions 6.9.2 and 6.10.1 contain the fix, and CISA added the flaw to its [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog) on November 25.

**Why it matters:** Xen Orchestra can control virtual machines, hypervisor hosts, backups, and the credentials used to connect them. Administrative access to that plane can become root-level persistence below the guest operating systems, where rebuilding only the management appliance would leave the attacker in place.

**Action:**

- Update Xen Orchestra to 6.9.2 on the stable channel or 6.10.1 on the latest channel, and update xo-server to the fixed package for the selected channel.
- Remove Xen Orchestra from direct internet reach and limit it to a dedicated management network; use Vates' published network and host indicators to check the appliance and every managed pool.
- If compromise is confirmed, follow Vates' clean-reinstallation guidance for affected management and hypervisor systems and rotate pool, backup, directory, mail, proxy, user, and OTP secrets.

### 3. Juniper Session Smart Conductor flaw gives unauthenticated attackers root

**What happened:** Juniper updated its [Session Smart security bulletin](https://supportportal.juniper.net/s/article/2026-10-On-Demand-Security-Bulletin-Session-Smart-Router-and-Session-Smart-Conductor-Multiple-internally-discovered-vulnerabilities-resolved) on November 24 after receiving a report of malicious exploitation of CVE-2026-103406. A crafted Salt minion identifier can reach the Conductor's AutomatedProvisioner and execute commands as root without authentication. Fixed releases are 7.0.5, 7.1.7, and 7.2.3, and CISA added the flaw to the [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/news-events/alerts/2026/11/25/cisa-adds-10-known-exploited-vulnerabilities-catalog) the next day.

**Why it matters:** The Conductor manages the routers in its authority, so root access is a control-plane incident rather than one compromised Linux host. Juniper lists no workaround, and router-to-Conductor communication can make the service reachable across network boundaries that an ordinary management portal would not cross.

**Action:**

- Upgrade each Session Smart Conductor to 7.0.5, 7.1.7, 7.2.3, or a later fixed release and verify the version after every node returns to service.
- Restrict Conductor ports and administrative access to the exact routers and management sources that require them instead of allowing broad untrusted reachability.
- Preserve Conductor logs and inspect root-level commands, Salt key activity, configuration changes, new accounts, persistence, and changes pushed to managed routers during the exposed period.

### 4. Drupal confirms its installer flaw was exploited on live sites

**What happened:** Drupal's [SA-CORE-2026-017 advisory](https://www.drupal.org/sa-core-2026-017) says attackers can use install.php under specific conditions to attempt a reinstall, leading to site takeover or remote code execution. The security team received a report of exploitation on live sites as early as November 19. The fixed branches begin at Drupal 10.6.22, 11.3.22, and 11.4.13, and CISA added CVE-2026-132165 to its [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/news-events/alerts/2026/11/24/cisa-adds-three-known-exploited-vulnerabilities-catalog) on November 24.

**Why it matters:** A successful reinstall can change the site, its database connection, and administrative control in one sequence. Some server permissions reduce the attack paths, but Drupal explicitly says they do not mitigate every path, so a hardened settings.php is not a substitute for the security release.

**Action:**

- Update to the fixed release for the site's supported Drupal branch and verify the deployed code and container or host actually use it.
- Follow Drupal's installer-hardening guidance, including web-server restrictions around install.php and permissions that prevent settings.php from being rewritten.
- Review web, PHP, file-integrity, database, and administrator activity from November 19 onward; rebuild from a trusted source and rotate application secrets when takeover evidence appears.

### 5. Attackers are chaining PHP2Shell with a PAN-OS kernel flaw

**What happened:** The October 23 edition covered PHP2Shell when attackers were probing the PHP flaws before patches arrived. The new development is a confirmed appliance attack chain. Palo Alto Networks says [CVE-2026-46300](https://security.paloaltonetworks.com/PAN-SA-2026-0015), a Linux kernel privilege-escalation flaw fixed across supported PAN-OS branches, has been exploited against management interfaces exposed to the internet. The observed path first uses PHP2Shell to reach the interface and then CVE-2026-46300 to raise privileges.

**Why it matters:** Updating PHP closes the first step, but it does not answer whether an attacker already gained a shell or root access on the firewall. A compromised management plane can expose configuration, credentials, and policy while sitting in the path defenders depend on to contain other systems.

**Action:**

- Match every PAN-OS device to the fixed versions in the advisory, update both the PHP2Shell and kernel components through the supported PAN-OS release, and verify each high-availability peer.
- Remove management profiles from internet-facing dataplane interfaces and allow administrative access only from named internal or out-of-band sources.
- For any device whose management interface was publicly reachable, investigate the pre-patch window for PHP2Shell requests, process execution, configuration changes, new accounts, exported data, and persistence before returning it to trust.

### 6. The Hex package registry contained remote code execution but cannot rule out database reads

**What happened:** On November 23, an attacker sent 69 exploit requests that ran commands on six registry web servers. The [Hex incident report](https://hex.pm/blog/security-incident-on-hexpm) says the team blocked the traffic and replaced the servers with a patched build within about 20 minutes. Hex found no unexpected package changes or database writes, but database reads were not logged, so it cannot rule out access to email addresses, password hashes, two-factor secrets, sessions, audit logs, or some private package data. The project rotated infrastructure credentials and session keys and assigned CVE-2026-129514.

**Why it matters:** The absence of modified packages narrows the software-supply-chain risk, but it does not make account exposure disappear. Package registries connect developer identities, organization memberships, private code, and publishing authority, so a stolen session or 2FA secret can outlive the short server intrusion.

**Action:**

- Change the Hex account password, reset the authenticator-app setup to issue a new two-factor secret and recovery codes, and review organization membership and audit activity.
- Update Hex clients when the new rotatable registry-signing system is released; until then, fetch packages only from repo.hex.pm and not third-party mirrors.
- Treat unexpected Hex-themed email as likely follow-on phishing, verify links independently, and revoke or rotate publishing credentials when account activity cannot be explained.

### 7. N-able Mail Assure incident puts an email-security control on the response list

**What happened:** N-able says it remediated CVE-2026-134624 and restored the Mail Assure dashboard and APIs on November 21. The [vendor's incident update](https://www.n-able.com/blog/mail-assure-incident-update) says it found no exploitation beyond one N-able-hosted server and engaged an outside forensics team. The flaw affects Mail Assure and SpamExperts builds before 20261121.1943 and lets an authenticated API user make the service connect to internal hosts through the LDAP synchronization check. CISA added it to the [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/news-events/alerts/2026/11/23/cisa-adds-two-known-exploited-vulnerabilities-catalog) on November 23.

**Why it matters:** Email-security platforms are trusted by MSPs to sit in the mail path and integrate with customer environments. A server-side request forgery path can turn that trusted service into a way to probe or reach internal systems, while a cloud-hosted fix still leaves customers responsible for checking the access and credentials on their side of the integration.

**Action:**

- Confirm every self-hosted or partner-managed Mail Assure and SpamExperts environment is on build 20261121.1943 or later; for N-able-hosted service, retain the vendor notice and identify which tenants and integrations were in scope.
- Review Mail Assure API users, relay and LDAP synchronization settings, administrative changes, and connections to internal addresses during the incident window.
- Rotate suspicious API or integration credentials and follow N-able's forthcoming root-cause analysis for any additional tenant-specific checks rather than assuming restored mail flow closes the incident.

### 8. Optimizely account impersonation pushed malicious JavaScript into customer sites

**What happened:** Optimizely says an attacker exploited its Web Experimentation account-signup flow on November 16, impersonated users on targeted customer accounts, and inserted malicious JavaScript into customer projects. The [vendor advisory](https://support.optimizely.com/hc/en-us/articles/50521849710605-Security-Advisory-Web-Experimentation-Security-Incident-Updated-November-19-2026) says fewer than 5% of customers were affected, delivery was blocked within three hours of detection, and the injected code was removed. CISA added CVE-2026-132224 to its [Known Exploited Vulnerabilities catalog](https://www.cisa.gov/news-events/alerts/2026/11/24/cisa-adds-three-known-exploited-vulnerabilities-catalog) on November 24.

**Why it matters:** Experimentation snippets are designed to execute code in a customer's site and can reach visitors across many pages. Removing the injected project code stops future delivery, but the affected organization is the one with the web, checkout, content-security-policy, and client-side telemetry needed to determine what visitors received before containment.

**Action:**

- Confirm directly with Optimizely whether each Web Experimentation account was affected and preserve the vendor notice, project history, user activity, and the exact containment times.
- Compare published project JavaScript and snippet changes with approved releases, then review browser-security, web, checkout, and fraud telemetry for the affected delivery window.
- Remove stale users, enforce strong authentication, tighten who can publish project code, and require a review path for changes that execute across production pages.

### 9. Radware customers may need to rotate cloud log-export credentials

**What happened:** [BleepingComputer reports](https://www.bleepingcomputer.com/news/security/radware-discloses-breach-exposing-customer-cloud-access-keys/) that an internal Radware root-cause report describes an unauthenticated Cloud WAF management API exposed to the internet and accessed on November 19. The potentially accessed information includes customer contact data and, for a subset of customers, AWS S3, Azure Blob Storage, or SFTP credentials configured for log export. Radware had not published a public statement when the report appeared, so the affected-customer count and evidence of downstream credential use remain unsettled.

**Why it matters:** A WAF provider does not need access to an application database for this incident to spread. Log-export keys can lead into customer-controlled storage that contains security telemetry, request details, and operational context, and an attempted login may appear only in the customer's cloud audit trail.

**Action:**

- If Radware notifies the organization, rotate every Cloud WAF log-export key, SAS token, or SFTP credential named in the notice and invalidate the old value.
- Review AWS, Azure, and SFTP access records from at least November 19 for unfamiliar source addresses, object reads, listings, permission changes, or failed attempts using the old credential.
- Replace broad account keys with a dedicated least-privilege identity limited to the required log destination, and record what data the exporter could read or write while the old credential was valid.

### 10. Cleverbridge breach notifications include card numbers and security codes

**What happened:** Cleverbridge detected unauthorized activity on November 4 and began notifying affected buyers on November 20. According to [BleepingComputer's reporting and a notification it reviewed](https://www.bleepingcomputer.com/news/security/cleverbridge-warns-hackers-stole-credit-card-numbers-cvvs-in-data-breach/), the copied data for affected people includes payment-card numbers, expiration dates, and CVV or CVC security codes. Cleverbridge has not disclosed how the attacker entered, how many people were affected, or which software merchants' customers are represented.

**Why it matters:** Cleverbridge processes purchases and subscriptions for many software companies, so a buyer may recognize the software brand but not the payment provider named in the notice. Card data with the security code creates an immediate fraud concern, while the incomplete public scope gives criminals room to send convincing fake refund, replacement-card, or account-warning messages.

**Action:**

- Affected cardholders should contact the card issuer through a trusted number, follow its replacement guidance, and monitor transactions and alerts instead of replying to the breach email with payment details.
- Software vendors that use Cleverbridge should confirm whether their buyers are in scope, prepare a support response with the official notification path, and warn that neither vendor will request a full card number or security code by email, text, or phone.
- Preserve the notice and transaction details for dispute or incident records, and keep the unknown victim count, entry method, and dwell time marked as unknown until Cleverbridge publishes more evidence.

## Closing Notes

Start with MiCollab, Xen Orchestra, Juniper Session Smart, Drupal, and internet-exposed PAN-OS management because exploitation is confirmed and several paths end in root or administrative control. Put an owner beside the retrospective checks as well as the updates. Hex and N-able require account and integration review even though the providers contained their known server activity.

For Optimizely, Radware, and Cleverbridge, the useful evidence belongs partly to customers: browser and checkout telemetry, cloud-storage audit logs, and card activity. Provider remediation changes what can happen next. It does not replace the customer's work to establish what happened before containment.
