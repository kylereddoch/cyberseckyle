---
date: 2026-11-23T11:21:00-06:00
title: "An Outlook Spoofing Advisory Isn't a Complete Incident Story"
seoTitle: "Outlook Spoofing CVE-2026-124194: What MSPs Should Verify"
description: "Microsoft confirmed exploitation of an Outlook flaw. Here’s how to verify the Office fix and investigate a reported message, starting with what the user opened."
searchIntent: "Help MSPs identify the Office builds that fix CVE-2026-124194 and decide what evidence to collect when a user reports a suspicious Outlook message."
slug: outlook-spoofing-advisory-msp-verification
featuredImage: /assets/images/outlook-spoofing-advisory-msp-verification.webp
featuredImageAlt: "A laptop showing an envelope and a warning triangle beside a paper checklist."
featuredImageCaption: "Editorial illustration generated with OpenAI for this article."
tags: [cybersecurity, vulnerability-management, incident-response, microsoft-365]
social:
  post_to: [mastodon, x]
  tags: [Outlook, IncidentResponse, MSP]
  status:
    mastodon: |-
      If somebody tells the help desk “I opened it in Outlook,” it matters what “it” was. Microsoft explicitly rules out the Preview Pane for CVE-2026-124194. I wrote about the follow-up question I’d ask and the Office build I’d want in the patch ticket.

      {url}

      #Outlook #IncidentResponse
    x: |-
      Microsoft rated CVE-2026-124194 Moderate and confirmed exploitation. Here’s how to check the Outlook fix across Office builds and what to ask a user who reports a suspicious message.

      {url}

      #Outlook #MSP
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117667011015774455}, x: {url: https://twitter.com/thecyberseckyle/status/2124923020095475983, buffer_id: 6b047c654129dae9438159aa}}
publishedAt: "2026-11-23T17:48:20.704Z"
---

If someone calls the help desk and says they opened a suspicious email in Outlook, my first question would be, “Did you read the email, or did you open a file attached to it?” For [CVE-2026-124194](https://msrc.microsoft.com/security-guidance/advisory/CVE-2026-124194), that detail changes what I’d investigate. Microsoft says the flaw requires someone to open a specially prepared file in an affected copy of Outlook. It explicitly rules out the Preview Pane.

Microsoft rated the flaw **Moderate** when it published the advisory on November 10. It also reported that attackers had exploited it. [CISA added it to the Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=CVE-2026-124194) that same day. For an MSP deciding which November updates to chase on overdue laptops, I’d give the observed exploitation more weight than the severity label. Telling a client that one of their users was affected takes evidence from that client.

## What the missing Outlook warning can expose

The word *spoofing* might send a technician looking at the From address. Microsoft’s description points to something the sender field can’t show. When Outlook opens the file, it can contact an external system without giving the user its usual warning. In doing so, it can disclose NTLMv2 authentication data that an attacker could use to impersonate the user. Microsoft classifies the weakness as CWE-356, an inadequate warning about an unsafe action. [The advisory’s FAQ](https://msrc.microsoft.com/security-guidance/advisory/CVE-2026-124194) explains both the interaction and the potential disclosure.

That changes the conversation with the person who reported the message. “I didn’t type my password” is entirely consistent with the risk Microsoft describes. Ask which file they opened, on which device, and roughly when. If they only viewed the message in the reading pane, record that answer. They can report the original through the usual phishing-reporting channel without reopening the file to show the help desk what it did.

## Match the fix to the copy of Office on the device

Microsoft’s November advisory lists 32-bit and 64-bit editions of Office LTSC 2021, Office LTSC 2024, and Microsoft 365 Apps for enterprise. That’s a desktop software inventory question. A list of Exchange Online mailboxes won’t tell you which build of Outlook the person used.

These are the November 10 fixes in [Microsoft’s product and remediation data](https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Nov) and its [Office security release notes](https://learn.microsoft.com/en-us/officeupdates/microsoft365-apps-security-updates#november-10-2026). Use the row for the installed product and servicing channel when checking a later release.

| Installed product | November 10 fix |
| --- | --- |
| Office LTSC 2021 | Build `16.0.14334.21048` |
| Office LTSC 2024 | Build `16.0.17932.21140` |
| Microsoft 365 Apps for enterprise | Varies by channel and version. For version 2610, Current Channel received `20527.20196` and Monthly Enterprise Channel received `20527.20194`. |

A fleet report that treats `20527.20196` as the minimum for every device on version 2610 would put an already-patched Monthly Enterprise laptop back in the queue. Microsoft’s [build history by channel](https://learn.microsoft.com/en-us/officeupdates/update-history-microsoft365-apps-by-date) also lists the November releases for devices on versions 2609 and 2608. Compare each device with its own branch.

In classic Outlook on Windows, [File → Office Account](https://support.microsoft.com/en-us/outlook/getstarted/what-version-of-outlook-do-i-have) shows the product version and build. I’d put that observation, or a fresh device inventory showing the same information, in the patch ticket. Include when it was collected. If a laptop last checked in before the update went out, give someone ownership of checking it when it returns. Counting the deployment as a success today can take that laptop off tomorrow’s work list.

## What to put in the incident ticket

Suppose someone in accounts payable reports that a supplier sent new bank details in an attachment. Accounts payable can hold the change and call the supplier using the number already on file. They don’t need to wait for IT to finish examining the message before protecting the payment.

On the technical side, preserve the original message and headers. Use the message ID in [Exchange Online message trace](https://learn.microsoft.com/en-us/exchange/monitoring/trace-an-email-message/message-trace-modern-eac) to establish who received it and when. A delivery timestamp gives the investigation a starting point. Whether somebody opened the attached file is a question for the recipient and the endpoint records.

If the recipient opened the file, check which Outlook build was running **at the time**. Use endpoint or proxy records to see whether Outlook contacted an unfamiliar destination around the reported opening time. If the connection looks related, preserve the records and escalate the possible credential exposure through the client’s incident process. Include the account and time window so the responder can check subsequent authentication activity.

The awkward case is the laptop that updated overnight. By morning, the technician can verify the fix and accounts payable can confirm the payment was held. The question still open is which build handled the file yesterday afternoon. I’d put that question in the handoff, along with who’s checking the device’s update history. Otherwise the next person to pick up the ticket sees a current build and has every reason to think the work is done.
