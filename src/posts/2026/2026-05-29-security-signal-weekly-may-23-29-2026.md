---
date: 2026-05-29T15:10:03-05:00
title: "Security Signal Weekly: May 23-29, 2026"
description: "The week's biggest cybersecurity stories, filtered for defender impact, patch urgency, active exploitation, and what IT teams should actually do next."
featuredImage: /assets/images/security-signal-weekly.png
featuredImageAlt: "Security Signal Weekly editorial graphic with the series title, signal bars, and cybersecurity alert panels in the CybersecKyle site colors."
tags: [cybersecurity, infosec, security-signal-weekly, vulnerability-management, incident-response, threat-intel, news]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116659718376136907"
mastodon_tags: [Cybersecurity, InfoSec, ThreatIntel, WeeklySecurity]
---

## Overview

This week had a very practical theme: the boring systems that run websites, endpoints, identity, and developer workflows are still the easiest places for attackers to turn one weak spot into a larger incident. The loudest stories were not just new bugs. They were bugs and campaigns that gave attackers management access, session tokens, credentials, or a path from a public service into internal systems.

> **Reality check:** If a system can publish code, manage endpoints, authenticate users, or run internet-facing content, it deserves the same urgency as a firewall when exploitation starts.

## Top 10 Security Signals

### 1. CISA puts an actively exploited Drupal SQL injection on a one-week clock

**What happened:** CISA added Drupal Core CVE-2026-9082 to the Known Exploited Vulnerabilities catalog after active exploitation was reported, and [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/cisa-orders-feds-to-patch-actively-exploited-drupal-vulnerability/) that federal agencies were given until May 27 to patch. The bug affects Drupal's database abstraction API, can be exploited without authentication against PostgreSQL-backed sites, and Imperva said it had already seen more than 15,000 attack attempts across nearly 6,000 sites.

**Why it matters:** Drupal is common in government, education, research, media, and large enterprise environments. An unauthenticated SQL injection against a public CMS is not a niche web bug; it is a direct path to data exposure, privilege escalation, and potentially remote code execution on systems that often publish trusted content.

**Action:**

- Patch affected Drupal sites immediately and verify the deployed version, especially for PostgreSQL-backed installations.
- Review web logs and WAF telemetry for exploitation attempts, not only successful compromise indicators.
- Rotate credentials and audit admin accounts if suspicious database or content changes are found.

### 2. LiteSpeed cPanel plugin flaw gives attackers root-level script execution

**What happened:** CISA added LiteSpeed cPanel user-end plugin CVE-2026-48172 to KEV, and [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/cisa-gives-feds-4-days-to-patch-actively-exploited-cpanel-plugin-flaw/) a four-day federal deadline ending May 29. LiteSpeed's advisory said versions 2.3 through 2.4.4 were at risk and that the Redis enable/disable handling flaw could let unauthenticated remote attackers execute arbitrary scripts with root privileges.

**Why it matters:** Hosting control panels concentrate multiple tenants, web roots, databases, and email workflows behind one management surface. For MSPs, agencies, and small businesses running shared hosting, this is exactly the kind of vulnerability that can quietly turn one exposed server into many compromised websites.

**Action:**

- Update the LiteSpeed cPanel user-end plugin to the fixed version and verify the WHM-bundled plugin actually changed.
- Run LiteSpeed's recommended log check for cpanel_jsonapi_func=redisAble and investigate unexpected IP addresses.
- Inspect recent root-level script execution, new files in web roots, and account-level persistence.

### 3. FortiClient EMS exploitation is being used to ship an infostealer as a fake update

**What happened:** Attackers are exploiting FortiClient EMS CVE-2026-35616 to deliver the EKZ credential stealer, with [BleepingComputer citing Arctic Wolf](https://www.bleepingcomputer.com/news/security/hackers-exploit-forticlient-ems-flaw-to-push-infostealer-malware/) on activity observed in May. The campaign abused endpoint management infrastructure, modified VPN and policy settings, and pushed PowerShell payloads disguised as Fortinet endpoint updates.

**Why it matters:** Endpoint management tooling is supposed to have broad reach. When attackers control that trust path, they do not need to convince each workstation individually; they can make the management plane deliver the malware for them.

**Action:**

- Patch FortiClient EMS to a fixed release and confirm exposed EMS instances are not reachable from the open internet.
- Hunt for unexpected Remote Access Profile changes, certificate-authentication anomalies, and suspicious FortiClient-launched scripts.
- Rotate credentials and invalidate browser sessions on endpoints that may have received the fake update.

### 4. Marimo exploitation shows how AI agents can speed up post-compromise movement

**What happened:** Sysdig published a case study showing an attacker who used an LLM agent after compromising an internet-reachable Marimo notebook through CVE-2026-39987; [Sysdig said](https://www.sysdig.com/blog/ai-agent-at-the-wheel-how-an-attacker-used-llms-to-move-from-a-cve-to-an-internal-database-in-4-pivots) the chain moved from the notebook to cloud credentials, AWS Secrets Manager, an SSH bastion, and a PostgreSQL database dump in under an hour.

**Why it matters:** The important part is not that AI made magic happen. It is that the attacker could adapt quickly after landing on a real environment. Internet-facing notebooks, AI tools, and lab services often sit near secrets, and agent-driven post-exploitation lowers the effort needed to turn that access into a useful pivot.

**Action:**

- Update Marimo to 0.23.0 or later, or restrict access to the terminal WebSocket path if upgrading is delayed.
- Audit environment variables, .env files, AWS credentials, SSH keys, and database secrets reachable from notebook hosts.
- Look for credential reads followed by cloud API calls, Secrets Manager access, or short SSH bursts from unusual infrastructure.

### 5. An unpatched Gogs zero-day can turn self-hosted Git into server RCE

**What happened:** Rapid7 disclosed a critical Gogs argument-injection issue, and [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/new-gogs-zero-day-flaw-lets-hackers-get-remote-code-execution/) that the latest Gogs releases were still unpatched as of May 28. The flaw lets an authenticated user inject the --exec flag into git rebase through a malicious branch name during the 'Rebase before merging' workflow, and default open registration can make that 'authenticated' requirement much weaker in practice.

**Why it matters:** A self-hosted Git service is both source-code storage and an identity boundary. If attackers can execute code as the Gogs process, they may read private repositories, API tokens, SSH keys, password hashes, and other secrets that become a launchpad into CI/CD or production systems.

**Action:**

- Disable public registration on exposed Gogs instances and restrict access to trusted networks until a fix is available.
- Disable rebase-before-merge workflows where possible and review repository settings for risky merge options.
- Audit Gogs logs, repository hooks, access tokens, SSH keys, and private repository access for suspicious activity.

### 6. Ghost CMS SQL injection is feeding ClickFix malware campaigns across hundreds of sites

**What happened:** A campaign is exploiting Ghost CMS CVE-2026-26980 to steal admin API keys, inject malicious JavaScript into posts, and serve ClickFix lures; [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/ghost-cms-sql-injection-flaw-exploited-in-large-scale-clickfix-campaign/) that Qianxin XLab saw impact across more than 700 domains. The fixed Ghost release was 6.19.1, but unpatched sites are still being used to deliver fake Cloudflare prompts and malware payloads.

**Why it matters:** This is a good reminder that public content systems can become supply-chain infrastructure for attackers. Readers trust the site they are visiting, while the attacker uses that trust to push a browser-side social-engineering flow.

**Action:**

- Upgrade Ghost to 6.19.1 or later and verify every production instance, not only the primary site.
- Rotate Ghost admin API keys and review article bodies, themes, and injected scripts for unauthorized changes.
- Preserve admin API logs where available and notify users if the site served ClickFix lures during the compromise window.

### 7. FBI warns Kali365 is packaging Microsoft 365 device-code phishing for wider abuse

**What happened:** The FBI warned about Kali365, a phishing-as-a-service platform that targets Microsoft 365 accounts by abusing OAuth device code authentication; [BleepingComputer summarized](https://www.bleepingcomputer.com/news/security/fbi-warns-of-kali365-phishing-service-targeting-microsoft-365-accounts/) the FBI PSA and Arctic Wolf reporting on campaigns that steal OAuth tokens, bypass MFA, and create mailbox rules or register new devices after compromise.

**Why it matters:** This is the identity story defenders keep running into: MFA can be present and still be bypassed when the workflow tricks a user into authorizing the attacker's session. The attacker ends up with cloud and SaaS access that looks legitimate enough to blend in.

**Action:**

- Restrict or block OAuth device code flow with Conditional Access where the business does not need it.
- Audit device-code sign-ins, new device registrations, suspicious mailbox rules, and impossible-travel patterns.
- Train help desk and users that legitimate Microsoft device login pages can still be abused when the code came from an attacker.

### 8. Laravel Lang package tags were hijacked to distribute credential-stealing malware

**What happened:** A supply-chain attack hit third-party Laravel Lang localization packages after attackers rewrote GitHub tags to point at malicious commits; [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/laravel-lang-packages-hijacked-to-deploy-credential-stealing-malware/) that StepSecurity, Aikido, and Socket warned about compromised historical versions and a Composer-loaded helper file that downloaded cross-platform credential-stealing malware.

**Why it matters:** This one is nasty because the attacker did not need to create an obviously new malicious package. By poisoning tags, they abused the trust developers place in versioned dependencies and package manager workflows.

**Action:**

- Audit Composer installs and lockfiles for affected Laravel Lang package versions and reinstall from clean sources.
- Rotate exposed developer, cloud, GitHub, CI/CD, SSH, Vault, database, Slack, Stripe, and .env secrets on impacted systems.
- Add controls that verify source integrity and flag tag rewrites or dependency artifacts that drift from expected commits.

### 9. Glassworm disruption shows developer malware is getting more resilient

**What happened:** CrowdStrike, Google, and Shadowserver disrupted Glassworm's command-and-control channels, and [BleepingComputer reported](https://www.bleepingcomputer.com/news/security/glassworm-botnet-disrupted-after-resilient-c2-infrastructure-takedown/) that the botnet had targeted developers through malicious OpenVSX and VS Code extensions, GitHub repositories, and npm packages. Its C2 design used Solana blockchain memos, BitTorrent DHT, Google Calendar, and direct server connections, which all had to be disrupted together.

**Why it matters:** Developer workstations are production-adjacent assets now. A malicious extension or package that steals wallets, Git credentials, or cloud secrets can be just as damaging as malware on a server, especially when the victim has repository or deployment access.

**Action:**

- Inventory IDE extensions and remove unapproved OpenVSX or VS Code extensions from developer machines.
- Hunt for Glassworm indicators, including CrowdStrike's published network indicator and any unusual extension update behavior.
- Apply least privilege to developer tokens and rotate secrets exposed on machines with suspicious extension or package activity.

### 10. Charter breach keeps the spotlight on SaaS identity and Salesforce exposure

**What happened:** Charter confirmed a breach after ShinyHunters claimed responsibility, and [BleepingComputer later reported](https://www.bleepingcomputer.com/news/security/charter-communications-data-breach-affects-49-million-accounts/) that Have I Been Pwned found 4.9 million affected accounts in the leaked data. The attackers claimed they used vishing to compromise a Microsoft Entra account and steal Salesforce data, while Charter disputed that sensitive personal information or CPNI was exfiltrated.

**Why it matters:** Even with disputed details, the operational lesson is familiar: SaaS data theft often starts with identity, social engineering, and broad application access rather than a classic malware outbreak. For customers and small businesses, the practical risk is follow-on phishing, account validation, and social-engineering fuel.

**Action:**

- Review SaaS app access for overbroad Entra, Salesforce, and support-system permissions.
- Require phishing-resistant MFA for privileged SaaS users and harden help desk identity-verification workflows.
- Monitor for customer-targeted phishing using breached names, emails, phone numbers, addresses, or support context.

## Closing Notes

The priority stack this week is straightforward: patch exploited public systems first, close identity paths that hand attackers valid sessions, and treat developer and endpoint management tools as production control planes. The trick is not just knowing the headline. It is proving the fix landed and then checking whether the attacker got there first.
