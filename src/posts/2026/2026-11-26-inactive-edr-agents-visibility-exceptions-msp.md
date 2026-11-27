---
date: 2026-11-26T17:27:57-06:00
title: "When the Security Agent Goes Quiet, Your Dashboard Needs an Exception"
seoTitle: "How MSPs Should Investigate Inactive EDR Agents and Missing Telemetry"
description: "A practical way for MSPs to reconcile endpoint inventory, investigate inactive EDR sensors, and track missing telemetry without overstating coverage."
searchIntent: "Help MSPs investigate inactive EDR agents, reconcile device identities, and document visibility exceptions with an owner and evidence of recovery."
slug: inactive-edr-agents-visibility-exceptions-msp
featuredImage: /assets/images/inactive-edr-agents-visibility-exceptions-msp.webp
featuredImageAlt: "An abstract endpoint inventory with four teal reporting rows and one grey row marked by an amber warning and a flat signal."
featuredImageCaption: "Conceptual illustration generated with OpenAI for this article. No real security console, device identities, or client data are shown."
tags: [cybersecurity, endpoint-security, MSP, threat-detection]
social:
  post_to: [x, mastodon, linkedin]
  tags: [Cybersecurity, EndpointSecurity, MSP]
  status:
    x: |-
      No new alerts. But is the agent still reporting?

      My new article covers inactive EDR agents, the checks I'd make, and a ticket template for tracking visibility gaps.

      {url}

      #Cybersecurity #MSP
    mastodon: |-
      When an endpoint goes quiet, I'd start with its last trustworthy check-in and whether the asset is still meant to be active.

      I wrote about reconciling inventory, checking sensor health, and verifying that telemetry has returned. There's also a ticket template for tracking the gaps.

      What do you check first when an agent stops reporting?

      {url}

      #Cybersecurity #EndpointSecurity #MSP
    linkedin: |-
      If a dashboard says 97% of devices are reporting, I want to know what's happening with the other 3%.

      Those devices might be retired, intentionally offline, or missing telemetry for a reason that still needs investigation. Each needs a documented next step and an owner.

      My new article walks through how I'd approach inactive EDR agents: reconcile the asset inventory, check what the last-seen timestamp actually measures, investigate sensor health, and verify fresh telemetry before closing the ticket.

      It includes Microsoft Defender for Endpoint examples and an exception-record template for MSP teams.

      What evidence do you want in the ticket before calling a device healthy again?

      {url}

      #Cybersecurity #EndpointSecurity #MSP
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117685460129949832}, x: {url: https://twitter.com/thecyberseckyle/status/2126103768928272809, buffer_id: 6b08c80d70e2a88e2cdde05b}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7531869559776059394, buffer_id: 6b08c8119131f7416c590c5a}}
publishedAt: "2026-11-27T00:00:11.848Z"
---

A quiet endpoint is not necessarily a healthy endpoint. If its security agent has stopped reporting, an empty alert list leaves a question open: what can we actually see?

I want a coverage report to make that question easy to answer. A green percentage is useful only when I can account for the devices behind it, including the ones that have gone quiet. For an MSP, that means reconciling the security console with the asset list and giving every unresolved gap an owner.

Microsoft Defender for Endpoint provides a useful example of how to approach this. The workflow below is general practitioner guidance, not a real-client investigation. The aim is to turn an unexplained inventory row into a documented decision.

## Read the health state before choosing the fix

Defender separates **Sensor health state** from **Onboarding status**. A device appearing in the inventory is not, by itself, proof that its sensor is reporting. Microsoft's [device inventory field reference](https://learn.microsoft.com/en-us/defender-endpoint/device-inventory-field-reference#sensor-health-state-values) lists Active, Inactive, and Misconfigured, with Impaired communications and No sensor data under Misconfigured in the portal filter.

I would use those labels to choose the next question:

| Reported state | What I would check next |
| --- | --- |
| Active | Does the recent signal belong to the expected device identity? |
| Inactive | Is the asset still in service, and when should it next be online? |
| Impaired communications | Can the sensor reach the service through its required network path? |
| No sensor data | What telemetry is missing, and what communication still works? |
| Not onboarded | Is this an asset we are responsible for protecting, and has onboarding been assigned? |

The last row is an onboarding question, not another sensor-health value. Keeping those fields separate prevents a discovered device from being counted as a functioning EDR deployment.

Microsoft's [sensor-health guidance](https://learn.microsoft.com/en-us/defender-endpoint/check-sensor-status) describes inactive devices as having stopped reporting for more than seven days in the past month. That is a product reporting threshold. I would set the team's investigation timing around the device's importance and expected use, rather than waiting a week to notice a production system has gone silent.

## Reconcile the asset and its identity

Start with the list of devices the organization expects to manage. Establish who owns the asset, whether it is still in service, and whether it should be online. Then compare that expectation with the RMM, security inventory, and onboarding or retirement records.

A hostname is a useful search term. I would also compare the device identifiers and available asset records before deciding that two rows represent the same machine, or that one missing row proves a device is gone.

Microsoft's [unhealthy-sensor guidance](https://learn.microsoft.com/en-us/defender-endpoint/fix-unhealthy-sensors#inactive-devices) describes unused, reinstalled, renamed, and offboarded devices as reasons for inactive records. It also explains that an old inactive entity can remain after a reinstall or rename while a new entity reports normally.

That changes the next action. A retired laptop needs verified retirement records. A rebuilt machine needs its current identity reconciled with the old one. An active workstation with no current signal needs investigation. Reinstalling the agent before answering those questions can leave the inventory problem unresolved.

## Check what the timestamp actually measures

Record the last trustworthy signal, its source, and its time zone. An RMM check-in tells me when the RMM heard from the device. It does not establish when the EDR service last received useful telemetry.

There is also a distinction within Defender. Microsoft says **Last device update** in the inventory reflects its refresh cadence, typically up to daily, and can lag behind fresher last-seen information on the device page or in Advanced hunting. The [field reference explains that timestamp](https://learn.microsoft.com/en-us/defender-endpoint/device-inventory-field-reference#all-devices-tab).

I would inspect the device detail before declaring a repair unsuccessful because a summary row still looks stale. Equally, I would not close the work from a current timestamp without checking which record and signal it represents.

## Work from reachability toward sensor health

For a device that should be active, confirm that it is powered on and reachable through a trusted management path. Check that the expected security component is present and running, then investigate the service's connectivity and relevant configuration.

On Windows, Defender's EDR sensor runs as LocalSystem and uses WinHTTP. Its proxy configuration is independent of WinINet settings, and the EDR sensor and Microsoft Defender Antivirus have separate proxy settings. Microsoft's [Windows proxy guidance](https://learn.microsoft.com/en-us/defender-endpoint/configure-proxy-internet) explains those distinctions.

My practical conclusion is that a working browser or remote-support session is only one piece of evidence. Test the sensor's required path using the vendor's troubleshooting guidance for the actual platform and deployment.

{% articleCallout "No sensor data does not settle the connectivity question", "caution" %}
Microsoft's [unhealthy-sensor troubleshooting page](https://learn.microsoft.com/en-us/defender-endpoint/fix-unhealthy-sensors#no-sensor-data) describes this state as possible even when the device communicates with the service and reports partial data. Investigate the missing telemetry and the communication that remains; the label alone is not proof of a complete network outage.
{% endarticleCallout %}

Response capability deserves attention too. Microsoft notes that [impaired communications can prevent actions such as isolation, file blocking, or sending files for analysis](https://learn.microsoft.com/en-us/defender-endpoint/check-sensor-status). If a response is needed, verify its actual result and follow the incident process when the action cannot be confirmed.

## Give every visibility exception an owner

The report I want alongside a coverage percentage is a short list of unresolved devices, what is known about each one, and who is doing what next. Here, an exception means a tracked gap in visibility. It is not an antivirus exclusion or permission to disable a control.

A hypothetical report might cover 100 assets expected to have EDR, with 97 meeting the team's current reporting criterion. The other three still need to appear: perhaps one is awaiting an approved retirement check, one is intentionally offline, and one has an unexplained sensor problem. Those are different decisions, even if the dashboard gives all three the same status.

Define the reporting criterion and the expected population alongside the percentage. Remove a retired asset from that population only after its retirement is verified. Keep intentionally offline devices visible with a return date or review point instead of treating silence as success.

{% articleDetails "An exception record to copy into your ticket" %}
Replace these prompts with actual findings. This is a working template, not a completed investigation.

- **Asset and identity:** Expected asset, owner, current device ID, and any previous identity being reconciled.
- **Expected state:** In service, intentionally offline, pending retirement, or another documented state.
- **Observed state:** Sensor health, onboarding status, and the source and time of the observation.
- **Last reliable signal:** Telemetry source, timestamp, time zone, and any freshness limit.
- **Investigation:** Checks performed, evidence, likely cause, and what remains unknown.
- **Next action:** Named owner, action, due date, and escalation point if visibility cannot be restored.
- **Resolution evidence:** Fresh telemetry from the correct device, verified retirement, or an explicitly approved temporary disposition with a review date.
{% endarticleDetails %}

Keep the device identifiers and supporting evidence in the private service record. A client-facing summary can explain the remaining work without reproducing sensitive inventory details.

## Close the loop with evidence of recovery

An installation script returning success is a useful step. Before closing the ticket, I would confirm that the correct device identity is present, that fresh telemetry has arrived, and that the observed sensor health matches the intended result. Record when and where those checks were made.

Restored reporting establishes visibility going forward. It does not, by itself, explain what happened during the gap. If that gap matters to an ongoing investigation, preserve its start and end points and document the limits of the available evidence. This is the same principle behind my [endpoint quarantine investigation checklist](/blog/endpoint-quarantine-investigation-checklist-msp/): the closeout should say what was verified and what still needs attention.

If a laptop is intentionally offline until its owner returns, keep that disposition explicit and assign the follow-up. Unknown is a useful status when it leads to a next action. A dashboard becomes more credible when the missing devices remain part of the conversation.

For your own endpoint reviews, what is the first field you check when an agent stops reporting? I would start with the last trustworthy check-in, then reconcile whether the asset is still supposed to be active.
