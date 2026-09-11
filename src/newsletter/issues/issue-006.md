---
layout: newsletter-issue
permalink: /newsletter/defenders-dispatch/issue-006/2026-09-11/
title: The Control Plane Needs Its Own Incident Plan
seoTitle: "Defender’s Dispatch Issue 006: The Control Plane Needs Its Own Incident Plan"
description: Exploited MikroTik, Windows, Cisco, and N-central flaws, plus ScreenConnect, cPanel, and Chrome checks.
searchIntent: Read The Defender’s Dispatch Issue 006 and its practical cybersecurity, IT, and MSP checks.
issueNumber: "006"
issueDateLabel: September 11, 2026
date: 2026-09-11T17:36:00-05:00
emailSubject: "[Issue 006] Defender’s Dispatch: The Control Plane Needs Its Own Incident Plan"
emailPreview: Exploited MikroTik, Windows, Cisco, and N-central flaws, plus ScreenConnect, cPanel, and Chrome checks.
trackingPath: /newsletter/defenders-dispatch/issue-006
closingNote: That’s all for this week. Give the control plane an incident plan, preserve its evidence, and verify every path it could have carried an attacker through.
highlights:
  - Exploited MikroTik and Cisco management paths
  - Two exploited Windows privilege-escalation flaws
  - N-central HF4 and ScreenConnect 26.6.5
  - A control-plane myth and one RMM hunt command
---

<p class="dispatch-eyebrow">From Kyle’s desk</p>

## The control plane needs its own incident plan

A router, firewall manager, hosting panel, or RMM server is not just another entry in the asset list. It is where administrators change the rules for everything behind it.

That authority changes the response. Patching an exploited management system can stop the original entry path, but it cannot tell you which accounts were added, policies were changed, tunnels were opened, or downstream systems were reached first. The system you normally trust for visibility may also be the system an attacker used to hide.

Every high-trust platform needs a short incident plan that works without depending on the platform itself. Know where its logs are copied, how to isolate it without losing evidence, which credentials must rotate, and how to rebuild its configuration from something known to be clean. This week’s router and firewall-manager attacks are a good reason to test that plan now.

---

<p class="dispatch-eyebrow dispatch-eyebrow--blue">Security Signal Weekly</p>

## Security signals and next steps

Three exploited paths where the patch is only the first part of the response.

### 01 · MikroTrick turns exposed RouterOS SSH into full control

**What happened:** CERT Polska confirmed that attackers are chaining CVE-2026-67276 and CVE-2026-86060 to bypass SSH authentication and gain full administrative control of MikroTik RouterOS devices. The attacks target systems whose SSH service is reachable from the internet.

**Why it matters:** A compromised router can change traffic paths, expose internal systems, and keep access through users, scripts, scheduled tasks, proxies, or tunnels. MikroTik’s new `Flagged` status detects selected suspicious changes, but a clear status does not prove the device was never compromised.

**What to check next:** Update to RouterOS 7.24.2, 7.23.4 or later in that train, or 6.49.21. Remove SSH, WebFig, and bandwidth-test access from untrusted networks. Check logs and `/system/device-mode/print`, then inspect users, scripts, scheduled tasks, proxies, tunnels, and unfamiliar configuration. If compromise is suspected, preserve logs and configuration before resetting the device, rebuild from a trusted configuration, and rotate passwords, keys, and other secrets. The [CERT Polska alert](https://cert.pl/en/posts/2026/09/vulnerabilities-in-mikrotik-routeros-actively-exploited/) and [MikroTik security notice](https://mikrotik.com/supportsec) provide the response details.

### 02 · Two Windows flaws can carry a foothold to SYSTEM

Microsoft’s September updates address CVE-2026-85880 in Windows Advanced Local Procedure Call and CVE-2026-81963 in the Windows Update Stack. Microsoft marks both privilege-escalation vulnerabilities as exploited. An attacker needs local access first, but reaching SYSTEM can turn a browser, document, or stolen-session foothold into full endpoint control.

Prioritize the September cumulative updates for exposed, privileged, and high-value Windows systems. Verify the resulting OS build instead of relying on an assigned update or a completed deployment job. Review suspicious process chains on endpoints that stayed behind, especially activity moving from a low-privilege process into SYSTEM context. Use the Microsoft entries for [CVE-2026-85880](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-85880) and [CVE-2026-81963](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-81963) to match affected products and updates.

### 03 · Cisco FMC root access is a firewall-policy incident

Cisco confirmed active exploitation of CVE-2026-20079 in August and updated its advisory on September 9. Crafted HTTP requests to the Secure Firewall Management Center web interface can bypass authentication and execute scripts or commands as root. There is no workaround.

Apply Cisco’s fixed release or the correct hotfix for every on-premises FMC instance and restrict the management interface to trusted administrative networks. In expert mode, search `/var/log/messages*` for `package_info` activity that references `/var/tmp/license.tmp`. Cisco says the hotfix prevents future exploitation and may not address an existing compromise. Contact Cisco TAC if the indicator is present and treat firewall policy, administrator identities, integrations, and managed devices as part of the investigation. The [Cisco advisory](https://sec.cloudapps.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-onprem-fmc-authbypass-5JPp45V2) has the exact command and release guidance.

---

<p class="dispatch-eyebrow dispatch-eyebrow--green">Operations</p>

## The IT and MSP desk

Two RMM actions, one hosting-panel fix, and one browser patch that should be measured from the running system.

### N-central HF4 is an MSP-wide incident check

N-able now says it has observed a handful of successful exploits against N-central customers. CVE-2026-86218 can provide pre-authentication access to the server, and Hotfix 4 supersedes the three hotfixes that came before it. For an RMM platform, that is not one server’s problem. The trusted remote-management path can reach every connected customer.

Confirm every on-premises N-central server reports 2026.3.1.14. Hosted instances have been patched by N-able, but hosted customers should still document when their instance was protected and review the available evidence. Search N-central logs for connections from `23.234.64.0/18`, audit recently created users and lookalike email addresses, and review Take Control activity across the full exposure window. Hunt managed endpoints for unexpected `Cloudflared` services and other persistence delivered through the RMM. A clean server check does not prove that a downstream endpoint stayed clean. N-able’s [September security update](https://www.n-able.com/blog/n-central-security-hotfix-september-5-2026) has the current hotfix and indicator guidance.

### ScreenConnect 26.6.5 needs the clients updated too

CVE-2026-84869 affects ScreenConnect versions before 26.6.5. ConnectWise says the client-side flaw can allow files to be transferred and executed through an active remote session without authorization or host confirmation under certain conditions. The server itself is not affected, but ConnectWise rates the bulletin Priority 1 and recommends treating the update as an emergency change or applying it within days.

Cloud servers have already been updated. For on-premises instances, install 26.6.5, then reinstall host clients and update access agents so the client-side protection actually reaches managed systems. If the server update must wait, temporarily remove the `TransferFiles` permission from every role and session group. Verify the server version, client rollout, technician roles, and recent file-transfer or execution activity rather than closing the change after the installer finishes. The [ConnectWise bulletin](https://www.connectwise.com/company/trust/security-bulletins/2026-09-08-screenconnect-bulletin) includes the affected versions, mitigation, and upgrade paths.

### A cPanel mail account can cross every tenant boundary

CVE-2026-67401 is a SQL-injection flaw in cPanel’s EmailTrack functionality. cPanel says an authenticated account with mail-related privileges can create arbitrary files and ultimately execute code as root. All supported versions were affected; the vendor lists patched builds for each supported release line.

Update every cPanel, WHM, and WP Squared host to the appropriate fixed build and verify the installed version after services restart. Inventory mail-enabled accounts and review EmailTrack activity, unexpected root-owned files, web shells, cron jobs, SSH keys, and recently changed site content. If suspicious activity appears, isolate the host and preserve evidence before rotating tenant and administrative secrets. The [cPanel advisory](https://support.cpanel.net/hc/en-us/articles/43187903921559-Security-CVE-2026-67401-SQL-Injection-Vulnerability-in-cPanel-s-EmailTrack-Functionality-September-8-2026) lists the patched builds.

### Patch and exploit watch: Chrome 153 still needs a relaunch

Google released Chrome 153.0.8010.36 for Linux and 153.0.8010.36/.37 for Windows and macOS with 230 security fixes. CVE-2026-87491 is an out-of-bounds write in V8, and Google says an exploit exists in the wild.

Accelerate deployment, require a relaunch, and verify the running version across Windows, macOS, and Linux. Track Edge, Brave, and other Chromium-based browsers separately because their fixed builds and rollout timing differ. Review browser crashes, suspicious child processes, persistence, and unusual identity sessions on endpoints that were behind. The [Chrome release post](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop_0808145027.html) provides the fixed versions and exploitation notice.

---

<p class="dispatch-eyebrow dispatch-eyebrow--yellow">Rotating field notes</p>

## Two different field notes for this week

One assumption worth retiring and one command that can help scope the N-central response.

### Myth vs. reality: patching the RMM closes the incident

**Myth:** Once the RMM server is patched and the indicator scan is clean, the incident is over.

**Reality:** The RMM may have already carried the attacker into customer systems. N-able’s August investigation found attackers using Take Control to reach managed devices and register Cloudflare tunnels for persistence. Patch the server, but also review remote sessions, accounts, scripts, jobs, and downstream endpoint telemetry. “No known indicator found” is not the same conclusion as “no customer was affected.”

### Toolbox & one useful command: find Cloudflared services

Use an approved endpoint shell or EDR live-response session to list Windows services whose name or executable path references Cloudflared:

```powershell
Get-CimInstance Win32_Service | Where-Object { $_.Name -match 'cloudflared' -or $_.PathName -match 'cloudflared' } | Select-Object Name, State, StartMode, StartName, PathName
```

A result is a triage lead, not automatic proof of compromise. Compare the service path, install time, owner, parent activity, DNS and network telemetry, and the corresponding RMM job or technician action. No result only answers this one persistence question; it does not clear the endpoint or the RMM.

---

<p class="dispatch-eyebrow">Worth your time</p>

## [CERT Polska’s MikroTrick response guidance](https://cert.pl/en/posts/2026/09/vulnerabilities-in-mikrotik-routeros-actively-exploited/)

The useful part of this alert is the recovery detail. It explains what the new `Flagged` mechanism can and cannot prove, names the configuration areas worth checking, and tells administrators to preserve logs and configuration before a reset. It also warns against blindly restoring a full backup from a device that may already contain an attacker’s changes.

<p class="dispatch-eyebrow dispatch-eyebrow--blue">From CybersecKyle</p>

## [The N-central Exploits Are an MSP Vendor-Risk Test](/blog/the-n-central-exploits-are-an-msp-vendor-risk-test/)

My latest MSP piece looks past the CVE count and asks what a high-trust vendor should be able to prove: tenant isolation, restricted management access, emergency patching, durable logs, incident communication, and an exit path. N-central’s four hotfixes in five weeks make those questions urgent, but the scorecard applies to every platform trusted with downstream customer access.

\- Kyle

### Have a signal I should see?

[Send me the original source and tell me why it matters](/submit-news/). I review reader submissions for possible inclusion in a future issue, and I will credit you according to the preference you choose.
