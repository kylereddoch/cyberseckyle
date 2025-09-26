---
date: 2025-09-26T16:30:00-05:00
title: 'Cybersecurity Weekly Roundup for September 22–26, 2025'
description: "A deep dive into top cybersecurity breakthroughs, critical vulnerabilities, and emerging threats from September 22-26, 2025, with actionable insights for MSPs and security teams. Curated by me."
tags: [cybersecurity weekly roundup, cybersecurity, infosecurity, news]
mastodon_url: https://infosec.exchange/@cyberseckyle/115272752822210994
---

Forgive me for the last few weeks of absence. I have been sick with pneumonia and have had some back back problems that have made it hard to sit at a computer for long periods of time. I am on the mend now and hope to be back to my normal self.

Let's get back to it.

---

It's been another active week in cybersecurity. Major exploits, ransomware movements, and high-impact vulnerabilities made headlines again. Here's a rundown of the top 10 stories security professionals should be tracking right now.

Cybersecurity this week was defined by a wave of urgent Cisco fixes and a CISA emergency directive, an actively exploited Chrome zero-day added to KEV, and disruptive ransomware hitting critical aviation software and U.S. local government services. For MSP-led environments, Patch Tuesday triage, rapid Chrome and Cisco patching, and tightening identity and network monitoring controls were the highest-impact moves to reduce real-world risk right now.

### Breakthroughs

- Okta showcased AI-driven identity governance and security capabilities at Oktane25, signaling deeper convergence of identity, AI, and automation in enterprise workflows and CIAM, with emphasis on adaptive controls and governance reach into customer identity estates.
- Apple backported zero-day ImageIO fixes (CVE-2025-43300) to older iPhones and iPads, underscoring sustained investment in hardening the mobile ecosystem against sophisticated spyware operations targeting high-risk users.

### Major vulnerabilities

- Cisco disclosed multiple critical issues across Secure Firewall ASA/FTD and IOS XE, with exploitation observed and a CISA emergency directive (ED 25-03) mandating federal action, elevating priority for enterprises and service providers operating Cisco edge and core infrastructure.
- Google patched Chrome zero-day CVE-2025-10585 in V8, with CISA adding it to KEV and recommending urgent patching across enterprises due to active exploitation risk and prevalence of Chromium-based browsers.
- Microsoft’s September Patch Tuesday addressed 80+ CVEs including two zero-days, with nine critical issues spanning RCE, EoP, and information disclosure, reinforcing monthly patch hygiene as a foundational control for Windows estates.

### Emerging trends

- Ransomware activity continues to escalate, with exfiltration-first and affiliate-driven models driving more victims and operational disruption, evidenced by aviation software impact at major European airports and fresh local-government compromises.
- Identity remains a prime battleground, with vendors emphasizing AI-powered governance and detections, while adversaries blend credential theft, social engineering, and device exploits to bypass controls at scale.
- Rapid zero-day cadence across browsers, network devices, and mobile platforms amplifies time-to-patch pressure; KEV additions and emergency directives are increasingly the trigger for immediate operational response in enterprise and MSP contexts.

### Top 10 articles and brief summaries

#### 1️⃣ **CISA Issues Emergency Directive on Compromised Cisco Devices**

CISA has issued Emergency Directive 25-03, mandating federal agencies to immediately identify and mitigate potential compromise of Cisco security devices. This follows active exploitation of previously unknown vulnerabilities in ASA/FTD firewalls and IOS XE systems. The directive sets a critical precedent for enterprise and MSP response protocols when perimeter security is at risk.

#### 2️⃣ **Google Patches Sixth Chrome Zero-Day of 2025 (CVE-2025-10585)**

Google has released an emergency update for Chrome to address CVE-2025-10585, a V8 engine vulnerability actively exploited in the wild. This marks the sixth Chrome zero-day patched this year, highlighting the browser as a primary attack vector. CISA has added the vulnerability to its Known Exploited Vulnerabilities catalog with urgent patching deadlines.

#### 3️⃣ **Multiple Critical Cisco Vulnerabilities Under Active Exploitation**

Cisco disclosed three critical vulnerabilities affecting ASA/FTD and IOS XE platforms, with CVE-2025-20333 (RCE) and CVE-2025-20362 (authentication bypass) already seeing active exploitation. The vulnerabilities can be chained together for complete system compromise, prompting immediate patch deployment across enterprise networks.

#### 4️⃣ **Microsoft September Patch Tuesday Addresses 81 Flaws Including Two Zero-Days**

Microsoft's September update cycle patched 81 vulnerabilities, including two actively exploited zero-days and nine critical-severity issues spanning remote code execution and elevation of privilege. The scope underscores the continued need for rapid patch deployment in Windows-centric environments.

#### 5️⃣ **Ransomware Disrupts Major European Airport Operations**

RTX Corporation confirmed that ransomware compromised Collins Aerospace's MUSE passenger processing software, causing significant disruptions at multiple European airports. The incident highlights the vulnerability of critical aviation infrastructure and the cascading effects of supply chain compromises.

#### 6️⃣ **Ohio County Ransomware Attack Impacts 45,000 Residents**

A ransomware attack on an Ohio county government has compromised personal information of over 45,000 residents, including Social Security numbers and sensitive documents. The incident exemplifies the continued targeting of state and local government infrastructure with limited cybersecurity resources.

#### 7️⃣ **Apple Backports Zero-Day Fixes to Legacy iOS Devices**

Apple has released security updates for older iPhone and iPad models to address CVE-2025-43300, an ImageIO vulnerability being exploited in targeted spyware attacks. The backporting effort demonstrates Apple's commitment to securing devices across the entire ecosystem lifecycle.

#### 8️⃣ **PNC Financial Services Under Investigation for 740,000 Customer Data Breach**

PNC Financial Services faces regulatory investigation following a data breach affecting 740,000 customer records. The incident adds to a growing list of financial services breaches in 2025, emphasizing the need for enhanced data protection in the banking sector.

#### 9️⃣ **Scattered Spider Linked to New Wave of Ransomware Campaigns**

Intelligence reports have connected the Scattered Spider threat group to a fresh series of ransomware attacks targeting enterprise environments. The group's sophisticated social engineering techniques and multi-stage attack chains continue to challenge traditional security controls.

#### 🔟 **Okta Unveils AI-Powered Identity Governance at Oktane25**

At Oktane25, Okta demonstrated new AI-driven identity governance and security capabilities, signaling the industry's shift toward automated identity management and adaptive access controls. The announcements highlight emerging opportunities for MSPs to enhance customer identity security postures.

### Notes on impact

- Cisco’s cluster of high-severity issues plus a federal directive materially raise edge-infrastructure risk for enterprises and service providers, warranting immediate engineering sprints and expanded telemetry on VPN, SNMP, and device integrity.
- The Chrome zero-day streak shows browser engines remain lucrative targets, making automated and enforced update channels a baseline requirement for SOC and endpoint governance.
- Ransomware’s operational impact across aviation and local government reiterates the need to detect data staging/exfiltration earlier in the kill chain and to exercise restoration runbooks that assume partial SaaS outages.

This Cybersecurity Weekly Roundup prioritizes actions for MSP-led environments in the Texas Panhandle and beyond where mixed Cisco stacks, Windows estates, and Chromium browsers are prevalent, pairing vendor directives with pragmatic controls that reduce risk quickly.

#### 🔗 References

* 1. CISA Emergency Directive ED 25-03 - Identify and Mitigate Potential Compromise of Cisco Devices  
([external link](https://www.cisa.gov/news-events/directives/ed-25-03-identify-and-mitigate-potential-compromise-cisco-devices))
* 2. Reuters - US sounds alarm over hackers targeting Cisco security devices  
([external link](https://www.reuters.com/legal/litigation/us-sounds-alarm-over-hackers-targeting-cisco-security-devices-2025-09-25/))
* 3. Rapid7 - Multiple critical vulnerabilities affecting Cisco products CVE-2025-20333, CVE-2025-20362, CVE-2025-20363  
([external link](https://www.rapid7.com/blog/post/etr-cve-2025-20333-cve-2025-20362-cve-2025-20363-multiple-critical-vulnerabilities-affecting-cisco-products/))
* 4. Cisco Security Advisory - ASA/FTD WebVPN Vulnerabilities  
([external link](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-asaftd-webvpn-z5xP8EUB))
* 5. Cisco Security Advisory - IOS XE Software Secure Boot Bypass Vulnerabilities  
([external link](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-secboot-UqFD8AvC))
* 6. BleepingComputer - Google patches sixth Chrome zero-day exploited in attacks this year  
([external link](https://www.bleepingcomputer.com/news/security/google-patches-sixth-chrome-zero-day-exploited-in-attacks-this-year/))
* 7. GBHackers - CISA Issues Alert on Actively Exploited Google Chrome 0-Day Vulnerability  
([external link](https://gbhackers.com/cisa-issues-chrome-0-day-vulnerability/))
* 8. BleepingComputer - Microsoft September 2025 Patch Tuesday fixes 81 flaws, two zero-days  
([external link](https://www.bleepingcomputer.com/news/microsoft/microsoft-september-2025-patch-tuesday-fixes-81-flaws-two-zero-days/))
* 9. Cybersecurity Dive - RTX confirms hack of passenger boarding software involved ransomware  
([external link](https://www.cybersecuritydive.com/news/rtx-hack-passenger-boarding-software-ransomware/761265/))
* 10. The Record - Ransomware attack on Ohio county impacts over 45,000 residents  
([external link](https://therecord.media/ohio-ransomware-attack-impacts-45000))