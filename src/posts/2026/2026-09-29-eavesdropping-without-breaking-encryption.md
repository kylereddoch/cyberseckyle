---
date: 2026-09-29T15:23:00-05:00
title: Eavesdropping Does Not Require Breaking Encryption
seoTitle: How Cyber Eavesdropping Works Without Breaking Encryption
description: Device linking, compromised endpoints, and mailbox access can expose private conversations while encryption keeps working. Here is what defenders need to check.
searchIntent: Explain how cyber eavesdropping reaches encrypted conversations through linked devices, endpoints, accounts, and retained copies, and how individuals and MSPs can reduce that exposure.
featuredImage: /assets/images/eavesdropping-linked-devices.png
featuredImageAlt: Conceptual illustration of a phone and laptop exchanging protected messages while an additional desktop monitor receives the same conversation.
featuredImageCaption: Conceptual illustration generated with OpenAI image generation. The devices and messages are illustrative, not screenshots of Signal or WhatsApp.
tags: [cybersecurity, privacy, security-operations]
social:
  post_to: [mastodon, x, linkedin]
  tags: [Cybersecurity, Privacy, Encryption]
  status:
    mastodon: |-
      A linked computer can receive your private messages while the encryption works exactly as designed.

      Schneier's post on WhatsApp and Signal prompted a broader look at eavesdropping: linked devices, compromised endpoints, mailbox rules, and the copies we keep.

      {url}

      #Cybersecurity #Privacy
    x: |-
      Eavesdropping can start with an extra linked device, a compromised laptop, or a mailbox forwarding rule. Breaking encryption may never enter into it.

      {url}

      #Cybersecurity #Privacy
    linkedin: |-
      A business can use encrypted messaging and still leave private conversations exposed through an unauthorized linked device or a compromised endpoint.

      Bruce Schneier's post on WhatsApp and Signal device linking prompted me to look at the broader operational problem. For MSPs and IT teams, that includes mailbox forwarding, application permissions, retained transcripts, and the devices staff use to read client information.

      The article separates network interception from account and endpoint access, explains why encryption still matters, and looks at what an investigation needs beyond a password reset. The practical question is who can receive or retrieve the conversation, and what evidence confirms their access has ended.

      {url}

      #Cybersecurity #Privacy #Encryption #MSP
  posts: {mastodon: {url: https://infosec.exchange/@cyberseckyle/117356256147275305}, x: {url: https://twitter.com/thecyberseckyle/status/2105034709466018269, buffer_id: 6abc21f6d3050be9e374a478}, linkedin: {url: https://www.linkedin.com/feed/update/urn:li:share:7510800497725886464, buffer_id: 6abc21f95df9296bd8d27b1d}}
publishedAt: "2026-09-29T20:39:17.718Z"
---

A computer you do not control can receive your private messages while the encryption works exactly as designed. Link that computer to the account, and the messaging app has another device to deliver to. The security problem is how it became a recipient.

[Bruce Schneier's September 29 post](https://www.schneier.com/blog/archives/2026/09/using-device-linking-to-eavesdrop-on-whatsapp-and-signal.html) draws attention to this use of device linking in WhatsApp and Signal. The underlying [reporting from netzpolitik.org](https://netzpolitik.org/2026/messenger-ueberwachung-immer-mehr-polizei-ueberwacht-messenger-wie-whatsapp/) describes German authorities using messaging clients to monitor accounts without installing a surveillance implant. It also documents a case in which police used temporary access to phones to activate WhatsApp Web. Permission to inspect messages on a phone did not amount to informed permission for continuing access.

Eavesdropping in cybersecurity includes intercepting traffic, but it also includes quietly collecting conversations through a compromised account, an additional device, or software already running where the messages are readable. Obtaining that position may require phishing or an intrusion. Once established, the collection can continue without noticeably interrupting the conversation.

For a business, that could expose a contract negotiation, a customer's recovery information, or the internal discussion of an incident. The encryption label answers only part of the question an IT team needs to ask about those conversations.

## Device linking adds another place to read the conversation

Desktop messaging is useful because it gives another device access to the account. With Signal, [the documented design](https://signal.org/blog/a-synchronized-start-for-linked-devices/) gives each linked device its own encrypted delivery of messages. An unauthorized linked device receives information through that same mechanism. It does not need to solve the encryption protecting traffic destined for the owner's phone.

This has been used outside law enforcement. In February 2025, [Google Threat Intelligence Group reported](https://cloud.google.com/blog/topics/threat-intelligence/russia-targeting-signal-messenger) Russia-aligned actors disguising Signal device-linking requests as group invitations and other legitimate resources. Successful linking let an attacker receive future messages alongside the victim. Google's research also described linking through physical access to captured devices.

[Microsoft documented a related WhatsApp campaign](https://www.microsoft.com/en-us/security/blog/2025/01/16/new-star-blizzard-spear-phishing-campaign-targets-whatsapp-accounts/) in January 2025. Star Blizzard lured targets with an invitation to a supposed group supporting Ukrainian organizations. The eventual QR code initiated device linking. Someone expecting to join a group was being directed to grant account access instead.

{% articleSteps "How a device-linking lure becomes eavesdropping", [
  {title: "A convincing invitation", text: "A message or page presents device linking as a group invitation or security check."},
  {title: "An extra device is linked", text: "The person completes a linking approval that adds an attacker-controlled device to the account."},
  {title: "Messages reach the attacker", text: "New messages are encrypted for the linked device too, allowing its operator to read them."}
] %}

A QR code is only a way to carry information. What matters is the action the application asks you to authorize. Scanning an ordinary code is not automatically an account compromise, and intercepting an SMS registration code is not the same operation as linking a companion device. The app, the workflow, and the approvals involved determine what an attacker gains.

Both [Signal](https://support.signal.org/hc/en-us/articles/360007320551-Linked-Devices) and [WhatsApp](https://faq.whatsapp.com/834124628020911/) already provide ways to inspect and remove linked devices. Schneier calls for that visibility; the existing controls deserve to be part of the explanation. Their usefulness depends on people recognizing unexpected access and knowing what to do about it.

{% articleCallout "Check the devices receiving your messages", "note" %}
In Signal, open **Settings → Linked devices**. In WhatsApp, open **Linked devices** from Settings on iPhone or the three-dot menu on Android. Review the entries against devices you actually use and remove access you no longer need. An unfamiliar entry on an account used for work belongs in the incident-response process.
{% endarticleCallout %}

Do not assume a new device can see only messages sent after it joined. Signal's current support documentation says linking can optionally synchronize existing chats and the last 45 days of media. Exposure depends on what was transferred as well as what arrived afterward. Unlinking cannot retrieve information someone has already copied.

## Network interception still matters

It would be a mistake to read these cases as evidence that encryption has become pointless. Correctly implemented and authenticated encryption makes the network observer's job substantially harder. [TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html#section-1), the protocol behind modern HTTPS connections, is designed to protect the confidentiality and integrity of data even when an attacker controls the network carrying it. That protection ends at the TLS endpoints; a website can still read the information submitted to it.

End-to-end encrypted messaging moves that content boundary to the participants' devices. In its [December 2024 mobile communications guidance](https://www.cisa.gov/sites/default/files/2024-12/guidance-mobile-communications-best-practices.pdf), aimed at highly targeted individuals, CISA recommended end-to-end encrypted communications in response to telecom espionage. The [FBI and CISA had reported](https://www.fbi.gov/news/press-releases/joint-statement-from-fbi-and-cisa-on-the-peoples-republic-of-china-targeting-of-commercial-telecommunications-infrastructure) stolen customer call records and compromised private communications involving a limited number of people, primarily in government or politics. Those findings concerned access through telecom networks, not proof that Signal's encryption had been defeated.

The distinction also applies to everyday network advice. As I covered in [my hotel Wi-Fi article](/blog/that-hotel-wi-fi-password-does-not-make-the-network-safe/), a VPN can protect traffic across an untrusted local network. It cannot remove an unauthorized messaging device, stop a compromised laptop from reading its own screen, or prevent a mailbox from forwarding mail. Buying another network control does not address access that exists at the destination.

## The endpoint and the account can expose readable content

Messages have to become readable somewhere. Malware with sufficient access to a phone or computer may capture what appears on screen, collect local message data, or record keystrokes. Microphone access can let it record a spoken conversation too. [MITRE ATT&CK documents these collection methods](https://attack.mitre.org/tactics/TA0009/). Their availability depends on the malware's permissions and the operating system's protections; merely having an app installed does not grant all of them.

Google's Signal research included a separate collection method: actors stealing message data from compromised Windows systems. That is a different failure from deceptive device linking. Removing an unfamiliar device association addresses one access path. It does not clean an infected computer that still holds the conversation.

My [recent ScreenConnect investigation](/blog/from-the-field-investigating-an-unauthorized-screenconnect-session/) illustrates the evidence problem. An unauthorized remote session raised questions about what an operator could have viewed or accessed. The available records did not establish everything that happened. A clean follow-up scan could not answer whether information had already been seen.

Email creates another route to the same business harm. A mailbox forwarding rule can send an outside party copies of incoming messages. Delegated access or an application with permission to read mail can expose conversations through the service itself. The user's connection to the mailbox may remain encrypted throughout.

[Microsoft's compromised-account guidance](https://learn.microsoft.com/en-us/defender-office-365/responding-to-a-compromised-email-account) therefore includes session revocation and reviews of authentication methods, application consent, mailbox forwarding, and inbox rules. A password reset is one action within that work. It does not, by itself, demonstrate that every way of receiving messages has been removed.

For an MSP, these are familiar administrative features. Their ordinary appearance is part of the difficulty: the question is whether that device, delegate, application, or destination has a legitimate reason to receive the client's information.

## Copies and metadata extend the exposure

A secure conversation can acquire a much longer life when someone exports it, pastes it into a ticket, or saves a meeting transcript. Each copy has its own permissions, retention period, and recovery process. The chat application's encryption does not follow a paragraph into an unrelated system and govern who can read it there.

Consider a technician pasting a client's recovery details into a support ticket so another engineer can finish the job. That may be an understandable workflow, but now access depends on the ticket system, its integrations, and everyone allowed to view the record. A time-limited sharing mechanism in an approved credential vault is a better fit for a secret than an indefinitely retained conversation.

Disappearing messages can reduce how much history remains available during a later compromise. They cannot stop a recipient from saving information while it is visible. [Signal explicitly describes this limitation](https://support.signal.org/hc/en-us/articles/360007320771-Set-and-manage-disappearing-messages), including the simple possibility of photographing the screen. Retention settings are useful when they reduce unnecessary copies; they are not proof that no copy exists.

There is also information around a conversation. Call records can reveal relationships without including the words spoken. Network observers may see destinations, timing, and traffic volume, depending on where they sit and what protections are in use. The [TLS specification discusses traffic analysis](https://www.rfc-editor.org/rfc/rfc8446.html#appendix-E.3) based on encrypted packet lengths and timing. That does not mean someone can read an arbitrary encrypted message from its size, but it explains why confidentiality of content and concealment of activity are separate requirements.

## Give business conversations an owner and an access policy

The practical response starts with deciding where particular information belongs. A customer appointment and a privileged recovery credential do not need identical handling. Staff need an approved way to communicate, a usable way to share secrets, and clear limits on what may be copied into personal messaging accounts.

An approved app also needs an approved device policy. If client conversations can be linked to an unmanaged home computer, the business has accepted an endpoint it may be unable to patch, investigate, or remove from service. Disabling all desktop access may create more friction than the risk justifies. Allowing it on managed devices, with ownership and offboarding checks, is a more workable decision where the platform supports it.

Access reviews should cover the features that actually deliver information:

- **Messaging:** linked devices, group membership, and accounts still used by former staff or contractors.
- **Email:** delegates, external forwarding, inbox rules, and applications permitted to read mail.
- **Meetings and support systems:** recording and transcript access, shared links, exports, and retention.

Training needs the same specificity. Telling employees to avoid suspicious QR codes is less useful than showing the difference between joining a conversation and authorizing another device. A request presented as a routine security check should be verified through an established contact route before granting access.

Product design carries responsibility too. A device-linking prompt should clearly explain that another device will receive private communications. Access should be easy to inspect and revoke. For business use, vendors should explain which changes administrators can log or alert on, and which checks require someone to open the app on a phone. That visibility gap affects whether a small IT team can realistically supervise the service.

## If someone may already be listening

For a work account, contact the responsible IT or security team through a known-good device and a channel outside the suspected compromise. Discussing the response in the affected chat or mailbox can disclose the plan to the person being removed.

Preserve the available device details, suspicious prompts, sign-in records, forwarding configuration, and relevant timestamps while containing access promptly. Revoke unauthorized links, sessions, and permissions through the platform's documented controls. If the endpoint may be compromised, investigate or rebuild it as appropriate; changing credentials on that same device can expose the replacements.

Then establish what the access could reach, how long it existed, and what the evidence actually shows. A successful unlink confirms that a particular association has ended. It does not establish that no messages were read. If the service does not record enough detail to answer that question, the incident assessment needs to say so.

For sensitive business communications, a purchasing review should go beyond asking whether the service uses encryption. Have the provider demonstrate how to identify every device and account with access, remove one, and verify the result. Ask what historical information a newly authorized device receives and what records survive an incident. Those answers tell an MSP what it can investigate when a client reports unexpected access, and which questions it may have to leave unanswered.
