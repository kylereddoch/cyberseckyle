---
date: 2026-03-12T12:00:00-05:00
title: 'Your Help Desk Is Now Part of the Attack Surface'
description: "Why MSPs need to treat help desk trust, remote support tools, and identity controls as one security problem."
tags: [cybersecurity, MSP, social-engineering, identity-security]
mastodon_url: https://infosec.exchange/@cyberseckyle/116217379988106467
---

{% image "/assets/images/help-desk-attack.png", "Laptop displaying a remote support request beside a ringing smartphone on a desk with a notebook, pen, coffee mug, and mouse, illustrating help desk impersonation and social engineering risk", "(Image generated using ChatGPT)", "eager", "text-center", "!important", [875], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

A lot of security awareness advice still acts like phishing begins and ends in the inbox.

That is not the world we are working in anymore.

Lately, the attack path has looked a lot more like this: flood a user’s inbox with junk, call them while they are frustrated, message them in Microsoft Teams as “Help Desk,” walk them into a remote support session, steal credentials, and then use that foothold to move deeper into the environment. [Microsoft documented this playbook with Storm-1811](https://www.microsoft.com/en-us/security/blog/2024/05/15/threat-actors-misusing-quick-assist-in-social-engineering-attacks-leading-to-ransomware/), and [Sophos later tracked similar campaigns using email bombing and Teams-based vishing](https://www.sophos.com/en-us/blog/sophos-mdr-tracks-two-ransomware-campaigns-using-email-bombing-microsoft-teams-vishing). More recently, [Okta described phishing kits that are now being adapted specifically for live callers](https://www.okta.com/blog/threat-intelligence/phishing-kits-adapt-to-the-script-of-callers/).

That should get every MSP’s attention.

## This hits MSPs differently

In a normal internal IT environment, users already have some baseline sense of who “the help desk” is. In an MSP environment, that trust line gets fuzzier. Clients may talk to multiple technicians. They may get support over email, over the phone, through remote tools, through a vendor portal, or through Microsoft 365 itself. The workflow is legitimate, but it also creates exactly the kind of ambiguity an attacker loves.

That is the uncomfortable truth here: a lot of the behavior we train users to accept from legitimate support looks an awful lot like attacker tradecraft when viewed from the outside.

> A popup.
> A phone call.
> A Teams message.
> A request to join a remote session.
> A prompt to approve MFA.
> A link that looks like a sign-in page.
> A technician asking the user to “help fix the issue quickly.”

That is not just a phishing problem. It is a trust-design problem.

## The industry data is pointing in the same direction

The bigger trend underneath all of this is identity compromise.

[Sophos’ 2026 Active Adversary Report](https://www.sophos.com/en-us/press/press-releases/sophos-active-adversary-report-2026-identity-attacks-dominate-as-threat-groups-proliferate) says identity-rooted attacks continue to rise and that MFA was absent in 59% of the cases they analyzed. [Verizon’s 2025 DBIR](https://www.verizon.com/about/news/2025-data-breach-investigations-report) found that credential abuse and vulnerability exploitation remain leading initial access vectors, with third-party involvement doubling to 30%.

That third-party piece matters for MSPs. Clients do not just inherit our technical capability. They also inherit our operational risk. If our support process is messy, inconsistent, or overly trusting, we become part of the attack path.

## Why I think this matters right now

I work in the MSP world, and one thing that stands out to me is how easy it is for teams to focus on the wrong layer of the problem.

> We talk about spam filtering.
> We talk about phishing emails.
> We talk about endpoint alerts.
> We talk about patching.

All of that matters. None of it is optional. But the newer social engineering chains are built to move around those controls by exploiting people’s trust in support, urgency, and routine IT processes.

That is why this is not just a “train users better” conversation. This is a policy, process, and platform conversation.

## What MSPs should tighten up now

### 1. Define one approved remote support path

Clients should know exactly how your company initiates support.

If your process is “sometimes phone, sometimes email, sometimes Teams, sometimes text, sometimes a pop-up from a tool,” that is chaos with a logo on it.

Make it painfully clear:

- what tools you officially use
- how a technician will identify themselves
- whether you will ever ask a user to launch Quick Assist or another remote support tool
- whether you will ever send sign-in links during a live support interaction
- how a user can verify a request before proceeding

Security gets stronger when legitimate behavior is boring and predictable.

### 2. Treat collaboration tools like part of the phishing surface

Too many organizations still think “phishing awareness” means email awareness.

It does not.

If you use Microsoft 365, Teams is part of your attack surface. [Microsoft observed attackers using Teams to impersonate help desk staff](https://www.microsoft.com/en-us/security/blog/2024/05/15/threat-actors-misusing-quick-assist-in-social-engineering-attacks-leading-to-ransomware/), and [Sophos highlighted abuse of default configurations that allow external users to initiate chats or meetings](https://www.sophos.com/en-us/blog/sophos-mdr-tracks-two-ransomware-campaigns-using-email-bombing-microsoft-teams-vishing).

Review your external access settings. Review who can initiate contact. Review what users are conditioned to trust.

Because attackers already are.

### 3. Reevaluate Quick Assist and every “legit” RMM tool

Attackers love legitimate tools because legitimate tools blend in.

That is why Quick Assist, remote monitoring utilities, admin tools, tunneling tools, and even common scripting behavior keep showing up in real intrusions. [Microsoft explicitly recommended blocking or uninstalling Quick Assist if it is not needed](https://www.microsoft.com/en-us/security/blog/2024/05/15/threat-actors-misusing-quick-assist-in-social-engineering-attacks-leading-to-ransomware/).

That does not mean every organization must rip it out tomorrow. It does mean you should stop treating default availability as a harmless convenience.

For each remote support tool in your stack, ask:

- Is this approved?
- Is it monitored?
- Is it restricted?
- Is there a documented use case?
- Would a junior user know the difference between a legitimate session and a malicious one?

If the answer to the last question is “probably not,” you have work to do.

### 4. Stop pretending basic MFA is the finish line

MFA is necessary. It is not magical.

[Microsoft has been pushing harder toward mandatory MFA for admin surfaces](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-mandatory-multifactor-authentication), and it has also recommended [phishing-resistant methods such as FIDO2 security keys, Windows Hello for Business, and passkeys](https://www.microsoft.com/en-us/security/blog/2026/01/06/phishing-actors-exploit-complex-routing-and-misconfigurations-to-spoof-domains/). [CISA also notes that if phishing-resistant MFA is not available yet, number matching is a better fallback than weaker options](https://www.cisa.gov/MFA).

The real question for MSPs is not “Do we have MFA?”
It is “Can our current MFA model be socially engineered in real time?”

That is a much more honest question, and it leads to better decisions.

### 5. Train users to verify support, not just suspicious email

A mature security culture does not just teach users what to fear. It teaches them what to verify.

Users should know that it is acceptable, and expected, to challenge support requests. They should be allowed to hang up, call back using a known number, open a ticket through the approved portal, or escalate to a manager before granting access.

That should never be treated as inconvenience. That is exactly what good process looks like.

### 6. Preserve the logs that tell the story

There is one more lesson hiding in all of this: if attackers are using legitimate channels and legitimate tools, your visibility matters even more.

When remote support tools, identity events, Teams interactions, endpoint behavior, and admin changes all start to blur together, logs are how you separate a rough Monday from an actual intrusion. If your environment does not retain the right telemetry, or if your logging strategy is inconsistent across clients, you make incident response much harder than it needs to be.

For MSPs, that is not an abstract best practice. That is the difference between quickly answering “what happened?” and spending a day guessing.

## Final thought

I do not think the biggest lesson here is that attackers are getting clever. They always do. The bigger lesson is that support itself has become part of the threat model.

That means MSP security cannot just live in the firewall, the EDR console, or the spam filter. It has to live in the script your technician follows, the remote support tool you allow, the MFA method you enforce, the Teams policy you leave enabled, and the confidence a user has to question a request that feels wrong.

The weird little goblin truth of modern defense is this: sometimes the safest thing a user can do is be a little rude to “IT.”

In 2026, that might be one of the healthiest security habits we can teach.