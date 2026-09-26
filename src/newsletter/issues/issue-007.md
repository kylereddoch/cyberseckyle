---
layout: newsletter-issue
permalink: /newsletter/defenders-dispatch/issue-007/2026-09-25/
title: The Configuration Is Part of the Vulnerability
seoTitle: "Defender’s Dispatch Issue 007: The Configuration Is Part of the Vulnerability"
description: Exploited F5, Arista, Check Point, TeamCity, WordPress, SharePoint, and Roundcube flaws with practical checks.
searchIntent: Read The Defender’s Dispatch Issue 007 and its practical cybersecurity, IT, and MSP checks.
issueNumber: "007"
issueDateLabel: September 25, 2026
date: 2026-09-25T19:00:00-05:00
emailSubject: "[Issue 007] Defender’s Dispatch: The Configuration Is Part of the Vulnerability"
emailPreview: Exploited F5, Arista, and Check Point paths, plus TeamCity, WordPress, SharePoint, and Roundcube checks.
trackingPath: /newsletter/defenders-dispatch/issue-007
closingNote: That’s all for this week. Keep the configuration evidence with the version evidence, and use both to decide whether the next ticket is maintenance or incident response.
highlights:
  - Exploited F5, Arista, and Check Point control paths
  - TeamCity, WordPress, and SharePoint response checks
  - Roundcube exploitation in the patch queue
  - A practical configuration-evidence habit
---

<p class="dispatch-eyebrow">From Kyle’s desk</p>

## The configuration is part of the vulnerability

A version number can tell you that software needs attention. It may not tell you whether the vulnerable feature is enabled, which interface exposes it, or what the system can reach if an attacker gets through.

That distinction runs through this week’s F5, Arista, and Check Point advisories. The affected configuration on an access gateway matters. The authentication mode on an SD-WAN orchestrator matters. A firewall gateway and its management server need separate checks because their fixes and attack paths are different.

Keep that evidence with the patch ticket. Record the running version, the role or feature that creates exposure, where the interface is reachable from, and how the fix was verified. If exploitation is confirmed, preserve the same configuration evidence for the investigation. A scanner result is useful, but the decision still depends on how the system is actually used.

---

<p class="dispatch-eyebrow dispatch-eyebrow--blue">Security Signal Weekly</p>

## Security signals and next steps

Three exploited paths where configuration decides the real exposure and response scope.

### 01 · F5 BIG-IP APM exposure depends on the virtual server

**What happened:** F5 disclosed CVE-2026-94127 on September 22 and said the heap-based buffer overflow in BIG-IP Access Policy Manager is being exploited. An unauthenticated attacker can send crafted traffic to an affected virtual server and execute code. The vulnerable setup is specific: the virtual server must have an APM access policy and an OAuth profile configured together.

**Why it matters:** BIG-IP APM can sit in front of remote access, identity flows, and business applications. The product name in an inventory is not enough to determine exposure, and a patched device may still need an investigation if the vulnerable configuration was reachable before the hotfix.

**What to check next:** Use F5’s configuration guidance to identify affected virtual servers, then install the engineering hotfix for the deployed release. Current fixed builds include Hotfix-BIGIP-21.1.0.2.0.30.22-ENG, Hotfix-BIGIP-17.5.1.9.0.160.12-ENG, and Hotfix-BIGIP-17.1.3.5.0.41.14-ENG. Confirm the hotfix on each member of a high-availability pair and preserve APM, OAuth, audit, and network telemetry from the exposed period. The [F5 advisory](https://my.f5.com/manage/s/article/K000162605) has the vendor instructions, and [Rapid7’s analysis](https://www.rapid7.com/blog/post/etr-cve-2026-94127-critical-unauthenticated-rce-in-f5-big-ip-apm/) explains the required configuration and fixed hotfixes.

### 02 · Arista VCO needs a host and edge review

Arista says CVE-2026-93952 is actively exploited against on-premises VeloCloud Orchestrator. Exploitation requires certificate-based Edge-to-Orchestrator authentication, network access to the VCO web interface, and access to the public portion of an Edge authentication certificate. Tenant or operator credentials are not required. Hosted VCO services were affected but have already been patched by Arista.

Match each on-premises orchestrator to the affected-release table. Fixed releases currently include 5.2.3.16 and 6.4.2.8; contact Arista TAC for supported trains that do not yet have a remediated build. Restrict the web interface to trusted administrative networks while the update is pending. Review nginx, backend, system, database, and file-system activity for Arista’s published indicators and preserve the state before rebuilding a suspected host. Because the orchestrator manages certificates, routes, and Edge devices, validate the managed-device state and rotate exposed secrets when the evidence calls for it. The [Arista advisory](https://www.arista.com/en/support/advisories-notices/security-advisory/24765-security-advisory-0183) includes the exact versions, indicators, and post-remediation guidance.

### 03 · Check Point gateways and management servers need separate fixes

Check Point identified active exploitation of CVE-2026-85102 and CVE-2026-93616. The first flaw can turn malformed VPN certificate data into unauthenticated code execution on Security Gateway and Spark products. The second is a pre-authentication path-traversal flaw in the Security Management web service that can execute an arbitrary-path script and load a Java class.

Inventory gateways, Spark appliances, and management servers separately, then apply the exact hotfix or Jumbo Hotfix take for each release. Do not use an active LivePatch indicator as proof that the management-server flaw is covered; Check Point says LivePatch Take 28/29 does not address CVE-2026-93616. Review certificate-based Mobile Access logins, suspicious management web requests, administrator changes, Java class loads, and second-stage activity from VPN sessions. The [Check Point advisory](https://blog.checkpoint.com/security/security-advisory-action-required-active-exploitation-of-cve-2026-85102-and-a-management-pre-authentication-vulnerability-cve-2026-93616/) links to the product-specific fixes and hunting guidance.

---

<p class="dispatch-eyebrow dispatch-eyebrow--green">Operations</p>

## The IT and MSP desk

Three fleet checks and one exploit-watch item for systems that often sit outside the ordinary endpoint report.

### TeamCity exposure reaches builds, secrets, and deployments

JetBrains has received reports of active exploitation of CVE-2026-63077 against unpatched TeamCity On-Premises servers. An unauthenticated attacker with HTTP or HTTPS access can abuse the agent polling protocol to execute operating-system commands with the TeamCity server process’s privileges. TeamCity Cloud already has the required mitigation.

Upgrade on-premises servers to 2025.11.7, 2026.1.3, or a newer fixed release. JetBrains provides a security patch plugin for TeamCity 2017.1 and later when an immediate upgrade is not possible, but the plugin addresses only this CVE. Search server logs for `com.thoughtworks.xstream.converters.ConversionException` and review unauthorized build agents for unexpected names beginning with `scan`. If compromise is plausible, rotate stored repository and deployment credentials and verify artifacts before they move downstream. The [JetBrains update](https://blog.jetbrains.com/teamcity/2026/08/cve-2026-63077-update/) explains the fixed versions, log messages, and temporary plugin.

### WordPress core needs a fleet-wide version check

CVE-2026-87902 is an unauthenticated path-traversal flaw in WordPress page-template resolution. Under affected theme and PHP conditions, a readable local PHP file can turn the flaw into remote code execution. WordPress released fixes on September 22 for every branch back to 4.7, and the Canadian Centre for Cyber Security reported exploitation and CISA’s September 25 addition to the Known Exploited Vulnerabilities catalog.

Update to WordPress 7.1.2 or the fixed maintenance release for the site’s current branch, then verify the running core version from the host or management platform. Include unmanaged sites, old cPanel accounts, staging copies, and container images in the inventory. Review web requests, PHP execution, changed files, new administrator accounts, scheduled tasks, and outbound connections on systems that were exposed before the update. The [WordPress project advisory](https://github.com/WordPress/wordpress-develop/security/advisories/GHSA-7hp8-65ch-5whp) lists every affected and patched branch, and the [Cyber Centre update](https://www.cyber.gc.ca/en/alerts-advisories/wordpress-security-advisory-av26-952) records the exploitation status.

### SharePoint 2016 and 2019 now carry an EOL problem too

The Canadian Centre for Cyber Security says CVE-2026-65660 is being exploited against Microsoft SharePoint Server. The code-injection flaw allows an authenticated attacker to execute arbitrary code. When combined with other SharePoint vulnerabilities, it can become pre-authentication code execution on servers that permit anonymous access.

Update SharePoint 2016 to 16.0.5565.1001, SharePoint 2019 to 16.0.10417.20198, and Subscription Edition to 16.0.19725.20522 or later fixed builds. Check every server in the farm, reduce direct internet exposure, and review IIS, ULS, Windows, identity, Defender, and AMSI telemetry for suspicious requests, web shells, process execution, or farm changes. SharePoint 2016 and 2019 reached end of life on July 15, so the patch ticket also needs a supported-version migration plan. The [Cyber Centre alert](https://www.cyber.gc.ca/en/alerts-advisories/al26-023-vulnerability-impacting-microsoft-sharepoint-server-cve-2026-65660) provides the fixed builds and investigation guidance.

### Patch and exploit watch: Roundcube updates cannot stop at the May minimum

The Canadian Centre for Cyber Security updated its Roundcube alert on September 21 to report exploitation of CVE-2026-48842. Roundcube versions before 1.6.16 and 1.7.1 are vulnerable, and the project has released newer security updates in both maintained branches since those minimum fixes.

Upgrade production systems to the latest supported Roundcube release in the 1.6 LTS or 1.7 branch. Check secondary webmail URLs, abandoned hosting panels, appliance images, and customer-specific installations that may not appear in a normal server patch report. Review web, database, mail, and authentication logs for unusual requests, mailbox access, forwarding changes, new sessions, or administrator actions. The [Cyber Centre advisory](https://www.cyber.gc.ca/en/alerts-advisories/roundcube-security-advisory-av26-503) links to the relevant Roundcube releases.

---

<p class="dispatch-eyebrow dispatch-eyebrow--yellow">Rotating field notes</p>

## Two field notes for this week

One way to make an exposure decision repeatable and one small evidence habit that makes the next investigation easier.

### What I’d do Monday morning: add configuration evidence to one ticket

Choose one internet-facing appliance or server in the urgent queue. Record the running version, the exposed interface, the feature or role that makes the advisory applicable, and the network path an attacker would need. Attach the vendor check or command output that supports the conclusion.

The point is not to make the ticket longer. It is to let the next technician see why the system was considered affected or not affected without reconstructing the decision from memory. If the configuration changes later, the old evidence also shows what was true during the exposure window.

### Small win of the week: save the before-state

Before the patch or hotfix, export the relevant configuration and capture the running version. Store it with the change or incident record where the team can retrieve it without relying on the system being repaired.

A before-state will not prove that a device stayed clean. It can reveal a changed administrator, policy, route, integration, or exposed service when you compare it with the known-good result. On a high-trust system, that comparison is often more useful than a screenshot showing the installer completed.

---

<p class="dispatch-eyebrow">Worth your time</p>

## [Arista’s VeloCloud Orchestrator advisory](https://www.arista.com/en/support/advisories-notices/security-advisory/24765-security-advisory-0183)

This advisory does more than name affected versions. It explains the required authentication configuration, separates hosted from on-premises exposure, provides concrete file, header, and IP indicators, and tells operators which logs and timestamps to preserve before remediation. Its post-remediation section also makes the wider scope clear: validate managed Edge devices and administrator activity instead of treating the orchestrator as an isolated host.

<p class="dispatch-eyebrow dispatch-eyebrow--blue">From CybersecKyle</p>

## [Better CVE Data Should Mean Less Guesswork for Defenders](/blog/better-cve-data-should-mean-less-guesswork-for-defenders/)

My latest vulnerability-management piece looks at CISA’s new CVE quality framework and the work that still needs to reach the technician. Better product identities, clearer affected versions, visible corrections, and useful baselines can reduce avoidable investigation. They cannot replace current inventory or the configuration evidence that tells a team whether a specific system is exposed.

\- Kyle

### Have a signal I should see?

[Send me the original source and tell me why it matters](/submit-news/). I review reader submissions for possible inclusion in a future issue, and I will credit you according to the preference you choose.
