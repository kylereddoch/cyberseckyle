---
date: 2025-10-03T16:30:00-05:00
title: 'Cybersecurity Weekly Roundup for September 27–October 03, 2025'
description: "A deep dive into top cybersecurity breakthroughs, critical vulnerabilities, and emerging threats from September 27-October 03, 2025, with actionable insights for MSPs and security teams. Curated by me."
tags: [cybersecurity weekly roundup, cybersecurity, infosecurity, news]
mastodon_url: https://infosec.exchange/@cyberseckyle/115312478378688235

It’s been a punchy week. We saw a genuine crypto breakthrough from Signal, a flurry of high-severity patches across browsers and Cisco, and a policy change in Washington that could chill threat-intel sharing. Extortion crews are probing SaaS and supply chains, and ransomware continues to hit operations.

For MSPs and security teams, your near-term playbook is: **ship browser and Cisco updates, track CISA KEV adds, harden identity and SaaS, and validate offline backups.**

---

## Breakthroughs

- **Signal ships a post-quantum ratchet (SPQR).** A practical upgrade that layers post-quantum exchanges into the Signal Protocol. This preserves forward secrecy and improves post-compromise security, and it sets a template other E2EE clients are likely to follow.  
- **U.K. NCSC pushes PQC migrations.** The NCSC reopened its PQC pilot, clarifying language and partner pathways. For enterprises plotting crypto-modernization, this reduces planning ambiguity and gives a firmer glide path.

## Major vulnerabilities and patching

- **Enterprise browsers.** Chrome 141 and Firefox 143 shipped with high-severity fixes. Enforce auto-update, remove blocker extensions, and verify kiosk and VDI images are refreshed.  
- **Cisco advisories.** New and updated notices this week include issues that can trigger control-plane instability or exposure on ASA/FTD and IOS/IOS XE. Inventory versions, minimize internet-exposed management, and monitor for abnormal SNMP or VPN behavior.  
- **CISA KEV momentum.** Several newly added exploited CVEs should drive internal patch SLAs. Treat KEV due dates as operational deadlines, not suggestions.

## Emerging trends and likely impact

- **Extortion pivots to business apps.** Campaigns are leaning into ERP and CRM ecosystems. Expect more board-pressure emails and threats to leak aggregated customer data.  
- **Supply-chain fragility.** Manufacturer and consumer-brand incidents show how quickly operational disruptions ripple through logistics and retail. Prove manual fallbacks and vendor contingencies.  
- **Policy uncertainty.** A lapse in the U.S. cyber-intel sharing framework could make some organizations hesitate to exchange indicators until Congress clarifies liability protections. Build bilateral ISAC/ISAO ties and get counsel involved in your intel workflows.

## Top 10 articles and brief summaries

#### Oracle customer extortion campaign
Oracle warned that threat actors are pressuring E-Business Suite customers with ransom demands after exploiting known flaws. Patch hygiene and credential hardening on business apps should rise in priority.

#### Claims of large-scale theft from Salesforce customer databases
A group is sending extortion emails alleging access to CRM records. Treat this as a SaaS posture wake-up call: review OAuth tokens, IP allowlists, SSO enforcement, and export-anomaly alerts.

#### New entries in CISA’s Known Exploited Vulnerabilities catalog
The latest KEV additions raise patch priority across mixed fleets. Use KEV to drive exception-free change windows.

#### Chrome 141 and Firefox 143 ship security fixes
Browsers remain prime targets, and high-severity fixes continue to land. Enforce updates and track lagging Chromium forks in your estate.

#### U.S. cyber-intel sharing protections lapse
The expiration of the 2015 law may chill voluntary sharing until there is legislative clarity. Expect more conservative legal stances from risk-averse orgs.

#### Asahi incident disrupts orders and shipments in Japan
A cyberattack forced manual workarounds and delayed product flows, a concrete example of operational risk from IT incidents.

#### Renault and Dacia customer data impacted via a third-party provider (U.K.)
Another reminder that vendor access and data sharing magnify exposure. Re-score suppliers and tighten token scopes.

#### Cisco releases updated advisories
Review the semiannual bundle and new notes, especially SNMP-related issues and internet-exposed devices. Add control-plane telemetry where you lack visibility.

#### Signal unveils SPQR (post-quantum ratchet)
A real, deployable move toward post-quantum protections in mainstream messaging. Watch for downstream adoption and guidance from standards bodies.

#### NCSC PQC pilot and guidance
The U.K. is actively smoothing enterprise migrations to PQC. For multinationals, align crypto roadmaps with this guidance to avoid fragmented deployments.

## What matters now (MSP-ready checklist)

- **Ship browser updates** across fleets and shared kiosks. Kill legacy extensions that block upgrades.  
- **Audit Cisco exposure** on management interfaces, SNMP, and VPN. Confirm versions from this week’s advisories.  
- **Map KEV to assets** and set SLAs that beat CISA timelines. Escalate where compensating controls are weak.  
- **Harden SaaS** for Salesforce and Oracle: rotate and scope tokens, enforce SSO, add export and API anomaly alerts.  
- **Scenario-test supply-chain outages,** including offline restore paths and manual order intake.  
- **Start PQC planning** now: inventory cryptographic dependencies, prioritize protocols with internet exposure, and track SPQR as an implementation signal.

---

## References

1. **Reuters:** “Oracle says hackers are trying to extort its customers”  
   <https://www.reuters.com/business/oracle-says-hackers-are-trying-extort-its-customers-2025-10-03/>

2. **TechCrunch:** “Hacking group claims theft of records from Salesforce customer databases”  
   <https://techcrunch.com/2025/10/03/hacking-group-claims-theft-of-1-billion-records-from-salesforce-customer-databases/>

3. **CISA Alert:** “CISA adds five Known Exploited Vulnerabilities to the catalog”  
   <https://www.cisa.gov/news-events/alerts/2025/10/02/cisa-adds-five-known-exploited-vulnerabilities-catalog>

4. **SecurityWeek:** “Chrome 141 and Firefox 143 patches fix high-severity vulnerabilities”  
   <https://www.securityweek.com/chrome-141-and-firefox-143-patches-fix-high-severity-vulnerabilities/>

5. **The Wall Street Journal:** “Congress let cyber-intel sharing act lapse” and **World Economic Forum** explainer  
   <https://www.wsj.com/articles/congress-let-cyber-intel-sharing-act-lapse-does-it-matter-c031e6bd>  
   <https://www.weforum.org/stories/2025/10/key-us-cyber-law-expire-cybersecurity-news/>

6. **Associated Press:** “Cyberattack disrupts orders and shipments at Asahi”  
   <https://apnews.com/article/e8854524dcd02eee4aa9e3d65464d019>

7. **Cybersecurity-Review (news digest page):** “Renault & Dacia customer data impacted via third-party provider (UK)”  
   <https://www.cybersecurity-review.com/news-october-2025/>

8. **Cisco Security Advisories:** Advisory index and SNMP advisory  
   <https://sec.cloudapps.cisco.com/security/center/publicationListing.x>  
   <https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-snmp-x4LPhte>

9. **Signal Blog:** “SPQR: a new post-quantum ratchet for Signal,” and **BleepingComputer** coverage  
   <https://signal.org/blog/spqr/>  
   <https://www.bleepingcomputer.com/news/security/signal-adds-new-cryptographic-defense-against-quantum-attacks/>

10. **techUK:** “NCSC shares update on PQC pilot scheme,” and **Tenable** briefing  
    <https://www.techuk.org/resource/ncsc-shares-update-on-post-quantum-cryptography-pilot-scheme.html>  
    <https://www.tenable.com/blog/cybersecurity-snapshot-cybersecurity-awareness-month-arrives-to-find-ai-security-a-hot-mess-as>