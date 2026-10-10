---
layout: newsletter-issue
permalink: /newsletter/defenders-dispatch/issue-009/2026-10-10/
title: The Running State Is the Evidence
seoTitle: "Defender’s Dispatch Issue 009: The Running State Is the Evidence"
description: AhsayCBS exploitation, Atlassian and NetScaler fixes, plus Cisco NX-API, exposed AI services, Android firmware, and SonicWall checks.
searchIntent: Read The Defender’s Dispatch Issue 009 and its practical cybersecurity, IT, and MSP checks.
issueNumber: "009"
issueDateLabel: October 10, 2026
date: 2026-10-10T16:00:00-05:00
emailSubject: "[Issue 009] Defender’s Dispatch: The Running State Is the Evidence"
emailPreview: AhsayCBS exploitation, Atlassian and NetScaler fixes, plus Cisco, AI service, Android, and SonicWall checks.
trackingPath: /newsletter/defenders-dispatch/issue-009
closingNote: That’s all for this week. Verify the running state, preserve the exposed-period evidence, and close the ticket only when both checks agree.
highlights:
  - AhsayCBS exploitation with no confirmed safe build
  - Atlassian Data Center and SAML-enabled NetScaler fixes
  - Cisco NX-API and exposed AI service checks
  - Android firmware risk and SonicWall SMA1000 hotfixes
---

<p class="dispatch-eyebrow">From Kyle’s desk</p>

## The running state is the evidence

An update record can say a system is current while the process on the wire is still old. A vendor can revise which version is safe after the change window closes. A patch can remove the original path without answering whether someone used it first.

That is the thread connecting this week’s AhsayCBS, Atlassian, NetScaler, Cisco, and SonicWall work. The ticket needs more than the intended version. Record the version and hotfix the system is actually running, the configuration that creates exposure, the time it stopped being reachable, and the evidence reviewed from the period before the fix.

For MSPs, this matters most on systems that concentrate access: backup consoles, remote-access gateways, collaboration platforms, switches, and self-hosted automation. A clean update result is maintenance evidence. It is not an incident finding.

---

<p class="dispatch-eyebrow dispatch-eyebrow--blue">Security Signal Weekly</p>

## Security signals and next steps

Three urgent checks where the version report is only the beginning.

### 01 · AhsayCBS needs containment and compromise review before a safe build exists

**What happened:** Huntress began seeing attackers chain CVE-2026-105133 and CVE-2026-105134 against internet-facing AhsayCBS backup servers on October 7. The chain bypasses authentication, executes code as SYSTEM, and drops JSP web shells. Huntress also observed XMRig miners disguised as Microsoft Edge, persistence through a Windows service, and a vulnerable kernel driver. Its investigation initially treated 10.3.4 as unaffected, then confirmed that release is vulnerable too.

**Why it matters:** AhsayCBS is used by MSPs and system integrators to manage backup operations. The server can hold customer data, backup credentials, storage access, and the authority to change recovery jobs. Removing a miner does not show that the backup environment is trustworthy.

**What to check next:** Restrict the management interface to a VPN or trusted administrative addresses while waiting for confirmed vendor remediation. Hunt for child processes from `cbssvcX64.exe` or `cbssvcX86.exe`, JSP files in the application path, the `MicrosoftEdgeUpdateSvc` service, miner traffic, and Huntress’s published hashes and network indicators. Rebuild a confirmed-compromised host from a known-good source, rotate credentials and keys it could reach, and verify backup data and job configuration separately. [Huntress’s incident research](https://www.huntress.com/blog/ahsaycbs-flaws-exploit) includes the revised affected-version finding and detection guidance.

### 02 · Atlassian Data Center needs a product-by-product patch record

Atlassian disclosed CVE-2026-21589 on October 5 across Bitbucket, Confluence, Jira Service Management, Jira Software, Bamboo, Crowd, Crucible, and Fisheye Data Center. An unauthenticated attacker who knows an exact path can read files inside the web application root. Atlassian rates the flaw critical and says all prior versions are affected, but the fixed release differs by product and branch.

Inventory each self-hosted product and every node or mirror, then move it to a listed fixed release or the latest supported version. Current minimums include Bitbucket 9.4.26, 10.2.8, or 10.5.1; Confluence 9.2.26 or 10.2.19; Jira 9.12.40, 10.3.26, or 11.3.12; Bamboo 10.2.24 or 12.1.12; and Crowd 6.3.7, 7.0.3, 7.1.7, or 7.2.4. Remove internet access or apply Atlassian’s documented WAF or Tomcat mitigation when an immediate update is not possible. Review decoded access logs for traversal patterns and investigate reads of configuration or credential files. The [Atlassian advisory](https://confluence.atlassian.com/security/cve-2026-21589-arbitrary-file-access-vulnerability-impacts-multiple-products-1870495748.html) has the full fixed-version and mitigation tables. Atlassian Cloud is already patched for this issue.

### 03 · NetScaler SAML deployments need another verified upgrade

Citrix’s CVE-2026-88779 bulletin covers a memory-overflow flaw in customer-managed NetScaler ADC and Gateway appliances configured as a SAML service provider or identity provider. Citrix describes the impact as denial of service and rates it 8.7. The precondition makes configuration evidence part of the exposure decision.

Search the configuration for `add authentication samlAction` and `add authentication samlIdPProfile`, then upgrade affected appliances to 14.1-73.41, 13.1-64.28, 14.1-73.41 FIPS, or 13.1-37.282 for FIPS and NDcPP. Verify every node in each pair or cluster after the maintenance window. Preserve crash, reboot, authentication, network, and file-system evidence from the exposed period, especially when an appliance failed repeatedly. The [Citrix bulletin](https://support.citrix.com/external/article/CTX697174/citrix-netscaler-adc-and-citrix-netscale.html) lists the current builds and exact SAML checks.

---

<p class="dispatch-eyebrow dispatch-eyebrow--green">Operations</p>

## The IT and MSP desk

Three checks for management planes and devices that may not appear in the ordinary endpoint report.

### Cisco NX-API turns a switch feature into a root-level path

CVE-2026-76471 is a CVSS 9.8 heap overflow in the NX-API feature of NX-OS. A crafted HTTP request can give an unauthenticated remote attacker root-level code execution or crash an affected Nexus 3000 or standalone NX-OS Nexus 9000 switch. NX-API is disabled by default on those switches, and Cisco says it is not aware of malicious use. UCS 6300 Fabric Interconnects are also affected, but exploitation there requires a valid low-privileged account.

Run `show feature | include nxapi` on Nexus 3000 and 9000 switches, then use Cisco’s Software Checker to identify the fixed NX-OS release for each platform. Disable NX-API when it is not required, restrict management-plane access, and treat Cisco Live Protect as a temporary bridge rather than the final fix. UCS 6300 release 4.3 is fixed in 4.3(6j); older trains need a supported migration. The [Cisco advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-napi-rce-r2shwu2j) includes the affected-product boundaries and current remediation path.

### Exposed AI services are becoming someone else’s infrastructure

Black Lotus Labs says the PoeLLM campaign has affected more than 3,400 servers since April, with exposed LiteLLM, Ollama, Gotenberg, and Gitea services among the targets. Compromised systems mine cryptocurrency, scan for more victims, and proxy exploitation. The malware derives its current command-and-control address from changing words in a poem hosted on GitHub.

Inventory self-hosted AI and developer services, remove direct internet exposure that is not required, require authentication, and assign an owner for patching and logs. Review GPU and CPU use, outbound connections, new SSH activity, scanning, and the indicators in [Black Lotus Labs’ PoeLLM research](https://www.lumen.com/blog/en-us/canto-incognito-tracking-the-poellm-malware). A lab label should not exempt a powerful server from the production exposure review when it holds enterprise data or can reach internal systems.

### Low-cost Android hardware needs a procurement boundary

Bitdefender found platform-signed malware preinstalled in the firmware of inexpensive MediaTek-based Android phones. The persistent system component can silently install and remove apps, grant permissions, load remote code, commit ad fraud, and turn the device into a residential proxy. Bitdefender could not determine where in the supply chain the malware was added, and a factory reset does not remove software embedded in the system partition.

Restrict business enrollment to supported device models with a known update path and require device-integrity checks before granting email, MFA, Wi-Fi, or customer-system access. Replace affected devices instead of treating this as an app cleanup. Review guest and employee networks for residential-proxy activity and segment unmanaged phones from administrative services. [Bitdefender’s Midnight Mimosa analysis](https://www.bitdefender.com/en-gb/blog/labs/midnight-mimosa-malware) explains the firmware component, observed payloads, and limits of the attribution.

### Patch and exploit watch: SonicWall SMA1000 hotfixes need an exposure check

SonicWall’s October 5 notice covers four SMA1000 flaws, led by CVE-2026-102255, a CVSS 10 server-side request forgery issue in the WorkPlace interface. The affected appliances are SMA 6210, 7210, and 8200v on 12.4.3-03526 and earlier or 12.5.0-02952 and earlier. SonicWall says it has no evidence of in-the-wild exploitation, while Previdian reports sensor-observed requests consistent with attempts against the SSRF. That distinction matters: observed attempts do not prove a successful compromise.

Install platform hotfix 12.4.3-03670 or later, or 12.5.0-03082 or later, and verify the running hotfix on each appliance. Restrict WorkPlace and management access, then review requests to local services such as CouchDB, configuration changes, new accounts, and follow-on access to internal systems. The [SonicWall notice](https://www.sonicwall.com/support/notices/kA1VN000002QP3G0AW) is authoritative for affected and fixed builds; [Previdian’s sensor report](https://previdian.com/) provides the separate exploitation-attempt evidence.

---

<p class="dispatch-eyebrow dispatch-eyebrow--yellow">Rotating field notes</p>

## Two field notes for this week

One reminder about the boundary between maintenance and incident response, plus one command that makes a Cisco exposure question answerable.

### Myth vs. reality: a green update report closes the incident

**Myth:** Once the platform reports the fixed version, the ticket can close.

**Reality:** The version proves only the current maintenance state. Close the incident question separately: when was the vulnerable interface reachable, what logs cover that period, which indicators were checked, and what credentials or downstream systems would need attention if the result changes?

For a management system, attach both decisions to the ticket. Record the running version and the person who verified it. Then record whether the exposed-period review found nothing, found suspicious activity, or could not be completed because evidence was missing. “Patched” and “not compromised” are different conclusions.

### Toolbox and one useful command: check NX-API where it runs

On a Nexus 3000 or standalone NX-OS Nexus 9000 switch, run:

`show feature | include nxapi`

The result answers the configuration precondition for CVE-2026-76471. Save the output with the device name, NX-OS version, management address, and Software Checker result. If NX-API is enabled because automation depends on it, document the trusted source ranges before the upgrade instead of disabling it blindly. The command is small; the useful evidence is the configuration and ownership attached to it.

---

<p class="dispatch-eyebrow">Worth your time</p>

## [Chrome’s response to the recent ccTLD registry hijacks](https://blog.google/security/chromes-response-to-recent-cctld-registry-hijacks/)

Google explains how compromises of the .gh, .sl, and .as registry operators let attackers change authoritative DNS and obtain valid HTTPS certificates for domains they did not own. The response is a useful reminder that a valid certificate can coexist with a broken registry or DNS chain. Domain owners should monitor Certificate Transparency across parked and regional domains and publish restrictive CAA records tied to approved certificate authorities, accounts, and validation methods.

<p class="dispatch-eyebrow dispatch-eyebrow--blue">From CybersecKyle</p>

## [Cyber Risk Quantification: A Security Budget You Can Defend](/blog/cyber-risk-quantification-a-security-budget-you-can-defend/)

My latest article looks at the part of a security budget request that a product quote cannot answer: what the business could lose, how often the defined event could happen, what the proposed work would actually change, and where the estimate remains uncertain. It also covers the concentrated exposure inside an MSP’s own identity, remote-management, credential, and backup systems. A big incident-cost figure is not proof that every proposed purchase is justified.

\- Kyle

### Have a signal I should see?

[Send me the original source and tell me why it matters](/submit-news/). I review reader submissions for possible inclusion in a future issue, and I will credit you according to the preference you choose.
