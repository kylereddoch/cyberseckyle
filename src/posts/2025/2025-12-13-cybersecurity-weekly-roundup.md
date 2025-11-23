---
date: 2025-11-23T11:00:00-05:00
title: 'Cybersecurity Weekly Roundup for November 16-23, 2025'
description: "Cybersecurity news for November 16–23, 2025: Chrome zero day, Oracle Identity Manager RCE (KEV), FortiWeb exploited, SonicWall SSLVPN bug, Cloudflare outage, WhatsApp enumeration, Logitech breach—with actionable steps"
tags: [cybersecurity weekly roundup, cybersecurity, infosecurity, news]
mastodon_url: https://infosec.exchange/@cyberseckyle/115391528679512830
---

>The Cybersecurity Weekly Roundup is back! I have been on a brief hiatus from writing these weekily summaries, but I am resuming them. I summarize the most important cybersecurity news stories, focusing on practical takeaways for security practitioners. No fluff, just the signal.

### 🧭 Overview

The last seven days were busy: Google rushed a Chrome zero-day fix, CISA added a pre-auth RCE in Oracle Identity Manager to KEV, Fortinet confirmed FortiWeb exploitation, and SonicWall patched an SSLVPN crash bug. A Cloudflare outage reminded everyone how brittle single-vendor edges can be, while WhatsApp enumeration research, a Logitech third-party breach, a 7-Zip PoC, and Salesforce/Gainsight fallout kept identity and edge in the crosshairs. Here’s the signal, minus the noise.

### 1️⃣ Chrome zero-day under active exploitation, patch now

Google shipped an emergency update for a V8 type-confusion bug (CVE-2025-13223). Exploitation is confirmed. Update to 142.0.7444.175/.176 and force browser auto-updates via MDM. Re-authenticate high-value sessions post-patch to invalidate stolen tokens.

**Practitioner take:** Push Chrome updates as a change-without-CAB. Lock extension install to allow-lists for admin and finance users.

### 2️⃣ Oracle Identity Manager pre-auth RCE added to CISA KEV

CISA added CVE-2025-61757 to KEV after evidence of in-the-wild abuse. Pre-authentication RCE on OIM REST services. If internet-exposed and unpatched during the October CPU window, treat as a probable compromise.

**Practitioner take:** Patch OIM, rotate service and integration keys, and review reverse proxy logs for odd HTTP verbs to OIM endpoints.

### 3️⃣ Fortinet FortiWeb path traversal exploited in the wild

CVE-2025-64446 lets unauthenticated attackers create admin users on FortiWeb WAF appliances. Fortinet and multiple vendors confirmed exploitation and fixes are available.

**Practitioner take:** Patch FortiWeb. Audit for rogue admin accounts and unexpected policy changes. If exploitation is suspected, rebuild images rather than tweak in place.

### 4️⃣ SonicWall SonicOS SSLVPN bug can crash firewalls remotely

CVE-2025-40601 is a pre-auth stack overflow in SSLVPN that can force a reboot or DoS on Gen7 and Gen8 devices. SonicWall released fixes and guidance.

**Practitioner take:** Patch now. If you cannot patch, restrict SSLVPN to trusted IPs and watch for repeated service restarts or crash loops.

### 5️⃣ Cloudflare outage shows single-vendor edge fragility

A November 18 Cloudflare outage tied to a Bot Management file generation bug caused widespread HTTP 5xx errors. Not an attack, but a blueprint for resilience planning.

**Practitioner take:** Tabletop provider failover. Use multi-vendor DNS, pre-approved bypass routes, and after-action log sweeps for the reduced control window.

### 6️⃣ WhatsApp enumeration research exposes large-scale metadata risk

University of Vienna researchers demonstrated phone number enumeration at massive scale, with profile data pullable at high rates before Meta tightened limits.

**Practitioner take:** For execs and admins, reduce phone number exposure, move MFA off SMS, and monitor for look-alike registrations.

### 7️⃣ Logitech confirms data theft after third-party zero-day

Logitech disclosed data exfiltration linked to a third-party platform zero-day, with extortion chatter pointing to Clop and prior Oracle E-Business Suite targeting.

**Practitioner take:** Trigger a supplier access review. Re-issue OAuth tokens, rotate API keys, and inspect SSO logs for unusual app scopes.

### 8️⃣ 7-Zip RCE risk rises as public PoC lands

CVE-2025-11001 has a public PoC. NHS England notes likely exploitation scenarios via archive extraction path tricks.

**Practitioner take:** Standardize on 7-Zip 25.00 or newer. Block risky archive types at mail gateways and add EDR rules for suspicious `7z` child processes.

### 9️⃣ Salesforce Gainsight incident ripples to customer orgs

Salesforce confirmed some customer data access via Gainsight-published apps. Investigation is ongoing and access has been revoked.

**Practitioner take:** Rotate connected-app secrets, re-issue OAuth tokens, and review Connected Apps scopes and audit logs in Salesforce.

### 🔟 Dutch police seize 250 servers from bulletproof host

Netherlands authorities dismantled infrastructure used by ransomware crews and fraud operators, seizing around 250 servers. Short-term churn expected as actors re-host.

**Practitioner take:** Refresh threat intel feeds and blocklists. Expect infrastructure pivots and new domains over the next 1 to 2 weeks.

### 🧠 Key Takeaway

Identity and the edge remain the soft underbelly. Shrink public attack surface, practice provider failover like you patch, and treat vendor incidents as your incident until proven otherwise.

#### 🔗 References

1. Google fixes actively exploited Chrome zero-day (CVE-2025-13223): Help Net Security — [https://www.helpnetsecurity.com/2025/11/18/chrome-cve-2025-13223-exploited/](https://www.helpnetsecurity.com/2025/11/18/chrome-cve-2025-13223-exploited/) 
2. Additional coverage of Chrome update: The Hacker News — [https://thehackernews.com/2025/11/google-issues-security-fix-for-actively.html](https://thehackernews.com/2025/11/google-issues-security-fix-for-actively.html)  
3. CISA adds Oracle Identity Manager CVE-2025-61757 to KEV — [https://www.cisa.gov/news-events/alerts/2025/11/21/cisa-adds-one-known-exploited-vulnerability-catalog](https://www.cisa.gov/news-events/alerts/2025/11/21/cisa-adds-one-known-exploited-vulnerability-catalog)  
4. KEV catalog entry listing CVE-2025-61757 — [https://www.cisa.gov/known-exploited-vulnerabilities-catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)  
5. Fortinet PSIRT advisory FG-IR-25-910 (CVE-2025-64446) — [https://fortiguard.fortinet.com/psirt/FG-IR-25-910](https://fortiguard.fortinet.com/psirt/FG-IR-25-910)  
6. Rapid7 analysis of FortiWeb exploitation — [https://www.rapid7.com/blog/post/etr-critical-vulnerability-in-fortinet-fortiweb-exploited-in-the-wild/](https://www.rapid7.com/blog/post/etr-critical-vulnerability-in-fortinet-fortiweb-exploited-in-the-wild/)  
7. SonicWall PSIRT for CVE-2025-40601 — [https://psirt.global.sonicwall.com/vuln-detail/SNWLID-2025-0016](https://psirt.global.sonicwall.com/vuln-detail/SNWLID-2025-0016)  
8. NVD entry for CVE-2025-40601 — [https://nvd.nist.gov/vuln/detail/CVE-2025-40601](https://nvd.nist.gov/vuln/detail/CVE-2025-40601)  
9. Cloudflare postmortem for Nov 18 outage — [https://blog.cloudflare.com/18-november-2025-outage/](https://blog.cloudflare.com/18-november-2025-outage/)  
10. University of Vienna press release on WhatsApp enumeration — [https://www.univie.ac.at/en/news/detail/forscherinnen-entdecken-grosse-sicherheitsluecke-in-whatsapp](https://www.univie.ac.at/en/news/detail/forscherinnen-entdecken-grosse-sicherheitsluecke-in-whatsapp)  
11. Wired recap of WhatsApp enumeration research — [https://www.wired.com/story/a-simple-whatsapp-security-flaw-exposed-billions-phone-numbers/](https://www.wired.com/story/a-simple-whatsapp-security-flaw-exposed-billions-phone-numbers/)  
12. Logitech breach coverage: SecurityWeek — [https://www.securityweek.com/logitech-confirms-data-breach-following-designation-as-oracle-hack-victim/](https://www.securityweek.com/logitech-confirms-data-breach-following-designation-as-oracle-hack-victim/)  
13. The Record on Logitech disclosure — [https://therecord.media/logitech-discloses-data-breach-clop](https://therecord.media/logitech-discloses-data-breach-clop)  
14. NHS England cyber alert on 7-Zip CVE-2025-11001 PoC — [https://digital.nhs.uk/cyber-alerts/2025/cc-4719](https://digital.nhs.uk/cyber-alerts/2025/cc-4719)  
15. Salesforce status on Gainsight-connected app incident — [https://status.salesforce.com/generalmessages/20000233](https://status.salesforce.com/generalmessages/20000233)  
16. TechCrunch on Salesforce and Gainsight — [https://techcrunch.com/2025/11/20/salesforce-says-some-of-its-customers-data-was-accessed-after-gainsight-breach/](https://techcrunch.com/2025/11/20/salesforce-says-some-of-its-customers-data-was-accessed-after-gainsight-breach/)  
17. BleepingComputer on Dutch police seizing bulletproof hosting servers — [https://www.bleepingcomputer.com/news/security/dutch-police-seizes-250-servers-used-by-bulletproof-hosting-service/](https://www.bleepingcomputer.com/news/security/dutch-police-seizes-250-servers-used-by-bulletproof-hosting-service/)