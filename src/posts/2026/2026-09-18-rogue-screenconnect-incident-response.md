---
date: 2026-09-18T10:29:18-05:00
title: "From the Field: Investigating an Unauthorized ScreenConnect Session"
seoTitle: "Rogue ScreenConnect Incident: An MSP Response Case Study"
description: A malware alert led to an unauthorized ScreenConnect session, a fake Windows Update executable, and repeated outbound traffic. Here is how I investigated it, contained it, and separated a plausible exploit connection from what the evidence could actually prove.
searchIntent: Explain how an MSP can investigate and contain an unauthorized ScreenConnect installation, correlate endpoint and firewall evidence, and assess whether activity is related to CVE-2026-84869 without overstating attribution.
featuredImage: /assets/images/screenconnect-product-featured.webp
featuredImageAlt: Official ScreenConnect product graphic showing remote support, access, session, and privileged access features on a dark teal background.
featuredImageCaption: "ScreenConnect product graphic. Source: ScreenConnect; used for editorial identification."
tags: [cybersecurity, MSP, incident-response, endpoint-security]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, InfoSec, IncidentResponse, MSP, ScreenConnect]
  status:
    mastodon: |-
      An unauthorized ScreenConnect session, a fake WindowsUpdate.exe, and repeated relay traffic were enough to treat a client workstation as potentially compromised.

      I wrote up the investigation, including what quarantine and a clean second scan did—and did not—prove.

      {url}

      #Cybersecurity #IncidentResponse #MSP #ScreenConnect
    x: |-
      A client that did not use ScreenConnect had an active session and malware in its temp folder.

      What the evidence did—and did not—prove:

      {url}

      #IncidentResponse #MSP
    linkedin: |-
      A client that does not use ScreenConnect had an active remote session, a RunFile action, and malware staged in a ScreenConnect temporary directory.

      This write-up covers how I contained the endpoint, correlated EDR and firewall evidence, searched the rest of the environment, and assessed the recent ScreenConnect vulnerability without claiming more than the evidence supported.

      {url}

      #Cybersecurity #IncidentResponse #MSP #ScreenConnect
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117293003030286528}, x: {url: https://twitter.com/thecyberseckyle/status/2100986509146861594, buffer_id: 6aad67c89f49d0351ae65f6d}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7506752295800479744, buffer_id: 6aad67ca6eac239c6c55353e}}
publishedAt: "2026-09-18T16:33:11.751Z"
---

The alert looked ordinary for about five seconds.

An endpoint protection product had detected and quarantined an executable named `WindowsUpdate.exe`. The name was suspicious but not especially creative. The path was what changed the investigation:

`C:\Users\<user>\Documents\ScreenConnect\Temp\WindowsUpdate.exe`

This client did not use ScreenConnect.

The endpoint record also showed a ScreenConnect `RunFile` action, an active remote session, and components associated with backstage shell and file-manager access. The antivirus engine reported the file as malware and said it had been quarantined successfully, but the execution status was unknown.

That last field mattered. Quarantine meant the product had acted on the file. It did not prove that the file had never run, that the remote session had done nothing else, or that the system was clean.

{% image "/assets/images/screenconnect-datto-edr-alert-redacted.png", "Redacted Datto EDR alert showing WindowsUpdate.exe rated high severity, detected in a ScreenConnect temporary directory, and quarantined.", "The endpoint alert confirmed that the suspicious executable had been quarantined. Client, endpoint, technician, address, policy, and timestamp details have been redacted.", "lazy", "text-center", "!important", [1200], "(min-width:30em) 90vw, 100vw", ['webp', 'jpeg'] %}

What followed became a useful example of how an MSP investigation changes when a legitimate remote support product appears where it has no legitimate reason to exist. It also overlapped with [a newly disclosed ScreenConnect vulnerability](https://github.com/ConnectWise-Advisories/Disclosures/tree/main/CVE-2026-84869) and [a separate campaign involving rogue ScreenConnect clients](https://www.huntress.com/blog/rogue-screenconnect-installations). The overlap was important, but it was not enough to claim attribution.

I have removed or generalized the client name, hostnames, addresses, identifiers, timestamps, and other details that could identify the organization. The technical sequence and response decisions are unchanged.

## The first decision was containment

I isolated the affected Windows workstation through the endpoint security platform and left the detected file in quarantine. I did not restore it for analysis, and I did not remotely connect to the endpoint while it was isolated.

The immediate evidence included:

- an executable masquerading as a Windows update outside a legitimate Windows directory
- a user-profile path created under `Documents\ScreenConnect\Temp`
- an unauthorized ScreenConnect instance and session identifier
- a `RunFile` action tied to the remote session
- ScreenConnect client, backstage-shell, and file-manager components
- an external relay hostname and IP address using TCP port 8041
- an antivirus result of quarantined and remediated, with execution still listed as unknown

A VirusTotal comparison showed 37 of 69 engines flagging the sample at the time of review. That supported treating it as malicious, but it did not explain how the file arrived or whether it executed.

{% image "/assets/images/windowsupdate-virustotal-redacted.png", "Redacted VirusTotal report showing 37 of 69 security vendors flagging WindowsUpdate.exe, with Trojan and riskware detections listed.", "At the time of review, 37 of 69 VirusTotal engines flagged the executable. The sample hash and browser-identifying details have been removed.", "lazy", "text-center", "!important", [1200], "(min-width:30em) 90vw, 100vw", ['webp', 'jpeg'] %}

No single item answered the whole incident. Together they justified treating the workstation as potentially compromised rather than treating the alert as a completed antivirus cleanup.

Port 8041 is commonly associated with ScreenConnect relay traffic, so the outbound destination was not automatically malicious just because of the port. The context made it suspicious: this business did not use ScreenConnect, the session was not authorized, and the relay was tied to the same activity that staged the detected executable.

## I widened the hunt without opening remote sessions

The next concern was scope. A remote access tool on one endpoint can be a one-off social-engineering event, a foothold deployed after another compromise, or part of broader activity across the client environment.

Using the RMM inventory, I searched the client’s full managed endpoint population for the ScreenConnect instance and session identifiers, the relay domain and address, the malware hash, the suspicious executable name, and the ScreenConnect binaries associated with backstage shell, file management, and `RunFile` activity.

I kept the hunt to inventory and management data. There was no reason to open interactive remote sessions to the other endpoints just to answer whether the same artifacts appeared there.

The searches did not identify the same ScreenConnect instance or known indicators on the other managed devices. That reduced the known scope to one workstation. It did not prove that every other endpoint was clean; it showed that the specific indicators available at that point had not spread across the managed inventory.

## The firewall supplied the network half of the story

The first broad firewall search was too large to be useful. Narrowing the time window and searching the affected workstation against the known relay produced the evidence I needed: repeated outbound TCP connections to the external ScreenConnect relay on port 8041.

That correlation mattered more than a reputation score alone. The endpoint alert and the firewall were describing the same event from different sides:

- ScreenConnect activity staged a suspicious file on the workstation.
- The endpoint security product detected and quarantined that file.
- The firewall recorded repeated connections from the workstation to the associated relay.

I added permanent blocks for the known malicious address and domain, including the appropriate domain pattern, in the client’s cloud-managed WatchGuard configuration. I also verified that the blocks were present in the effective configuration instead of assuming that a change saved in the management interface had reached the firewall.

Blocking a known relay does not eradicate an endpoint. Infrastructure changes quickly, and a compromised host can reconnect somewhere else. The blocks reduced the immediate path while the endpoint investigation continued.

## Identity and email checks did not show follow-on abuse

I reviewed the available account and email activity for unusual sign-ins and messages the client did not send. I did not find evidence of either during the reviewed period.

That was reassuring, but the result had boundaries. A clean sign-in review does not tell me what an operator viewed during a remote desktop session, whether credentials were exposed on screen, or whether a browser session already authenticated to a vendor portal was used without generating a new login.

I recommended that the client change passwords for vendor and business services used from the affected workstation and revoke active sessions where the service supports it. Those changes should be made from a known-good device, not from the system under investigation.

## Why the new ScreenConnect vulnerability was relevant

The timing of this incident made [CVE-2026-84869](https://github.com/ConnectWise-Advisories/Disclosures/tree/main/CVE-2026-84869) impossible to ignore.

ConnectWise disclosed the flaw on September 8, 2026. The company describes a client-side file-transfer handling condition in ScreenConnect versions before 26.6.5. Under certain circumstances, an active remote session could transfer and execute files on a host without proper authorization or host confirmation, including through elevated execution actions. ScreenConnect servers themselves are not affected. ConnectWise assigned the issue a CVSS 3.1 score of 9.9 and fixed it in version 26.6.5. The vendor also advised customers who could not patch immediately to remove the `TransferFiles` permission as a temporary mitigation in its [security bulletin](https://www.connectwise.com/company/trust/security-bulletins/2026-09-08-screenconnect-bulletin).

The Canadian Centre for Cyber Security later reported that [CISA added the vulnerability to the Known Exploited Vulnerabilities catalog on September 11](https://www.cyber.gc.ca/en/alerts-advisories/connectwise-security-advisory-av26-903), based on evidence of exploitation in the wild.

The behavior in my case was consistent with the capability described in the advisory: an active ScreenConnect session, a file placed in the ScreenConnect temporary directory, and a `RunFile` action involving an executable that the endpoint product identified as malware.

That is not proof that CVE-2026-84869 was used.

The vulnerability explains how file transfer and execution could be abused through an active session. It does not explain how an unauthorized ScreenConnect client first appeared on a workstation belonging to an organization that did not use the product. It also does not establish which ScreenConnect client version was involved or prove that the session met the vulnerability’s exact exploit conditions.

The evidence supported a connection worth investigating, not a conclusion I could defend as fact.

## A related campaign looked similar, but not identical

The incident also shared characteristics with [research Huntress published on rogue ScreenConnect installations](https://www.huntress.com/blog/rogue-screenconnect-installations). Huntress described social-engineering incidents that installed unauthorized ScreenConnect clients, connected to attacker-controlled infrastructure over port 8041, and used ScreenConnect file-transfer actions to execute payloads from temporary directories.

There were important differences. Huntress observed a four-stage VBScript chain, repeated `wscript.exe` execution, a `WindowsServiceHost` Run key for persistence, and additional payloads. My investigation centered on a different executable name, a different hash, and different relay infrastructure. I did not find the published script names or persistence indicators in the evidence available to me.

That distinction prevents two common investigation errors. The first is assuming that matching a product and port means matching a campaign. The second is ignoring useful threat research because every indicator is not identical. Campaign infrastructure and filenames change; behavior often lasts longer. I used the Huntress findings to improve the hunt without labeling the incident as the same operation.

The likely initial-access possibilities remained broader than the new CVE: social engineering that convinced a user to install remote support software, a fake update or installer, stolen access to an existing session, or another compromise that deployed ScreenConnect as a secondary access tool. That is the trust problem I wrote about in [Your Help Desk Is Now Part of the Attack Surface](/blog/your-help-desk-is-now-part-of-the-attack-surface/), but this endpoint did not retain enough evidence for me to choose one path without speculating.

## The clean second scan was a checkpoint, not a verdict

I did not have external storage available on site, so I could not acquire a full forensic disk image before recovery work continued. That limited the depth of retrospective analysis. The gap belongs in the incident record because it changes how confidently I can rule out execution or persistence.

The client chose not to rebuild or reinstall the workstation at that stage. The detected file remained quarantined, the endpoint and network indicators were blocked, and the system was reconnected under monitoring so another complete AV/EDR scan could run.

The second full scan came back clean.

That result was useful. It showed that the security product did not find additional known malicious artifacts during the post-containment scan. It did not prove that the original executable never ran, that an attacker never accessed data, or that every possible persistence mechanism had been removed. Scan engines can only detect what their telemetry, signatures, and behavioral rules expose.

Because there was no rebuild and no full forensic image, the honest status was contained with residual risk, not “never compromised.” Continued monitoring, credential changes, session revocation, and follow-up review carried more weight than declaring victory from one clean scan.

## What I would carry into the next MSP incident

The most useful signal in this case was not the malware family name. It was the mismatch between the client’s approved environment and what appeared on the workstation. A legitimate remote support product becomes an incident indicator when the organization does not use it.

Every MSP should be able to answer which remote access tools are authorized for each client. That baseline makes an unexpected ScreenConnect, AnyDesk, Quick Assist, Splashtop, or similar client much easier to triage. Without it, malicious remote access can hide inside a software category that technicians see every day.

The investigation also reinforced a few operational habits:

- Preserve the distinction between quarantine and proof of non-execution.
- Correlate endpoint, firewall, RMM, identity, and email evidence before narrowing the story. A useful logging pipeline should shorten the distance between an alert and that timeline, which is the practical standard I use in [Making SIEM Useful](/blog/making-siem-useful-how-it-works-what-it-does-and-why-you-should-care/).
- Search the rest of the environment with the least intrusive method that answers the question.
- Verify that emergency firewall changes are effective, not merely saved.
- Preserve forensic evidence early when the equipment and business decision allow it.
- Record what was not done, such as imaging or rebuilding, and carry that uncertainty into the risk decision.
- Treat a clean scan as validation evidence, not a certificate that no compromise occurred.

There is a broader vendor lesson too. Remote support tools are designed to transfer files, run commands, and bypass physical distance. Those features are why MSPs use them and why attackers want them. A vulnerability that weakens authorization inside an active session is serious, but a fully patched remote tool can still be abused if an attacker convinces a user to install it or obtains legitimate access.

In this incident, the new ScreenConnect vulnerability helped frame the questions. The endpoint and firewall telemetry drove the response. The evidence never closed the gap between “this behavior fits” and “this exploit caused it.”

Keeping that gap visible did not make the investigation weaker. It kept the final assessment honest.
