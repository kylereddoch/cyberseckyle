---
date: 2026-10-29T11:49:01-05:00
title: "A Real Microsoft Sign-in Page Can Still Be Phishing: What MSPs Should Know About MadApe"
seoTitle: "Microsoft 365 Device-Code Phishing: MadApe and MSP Defenses"
description: "Group-IB's MadApe research shows how a legitimate Microsoft sign-in page can be part of a phishing attack and what MSPs should check in Entra ID."
searchIntent: "Help MSPs and Microsoft 365 administrators understand MadApe device-code phishing, identify legitimate device-code use, and evaluate Conditional Access protections."
slug: microsoft-365-device-code-phishing-madape-msp
featuredImage: /assets/images/madape-device-code-phishing.png
featuredImageAlt: "A laptop and smartphone display generic authentication prompts while a glowing connection leads toward a shadowy remote computer."
featuredImageCaption: "Conceptual illustration of device-code phishing. Generated with OpenAI image generation; no real accounts, credentials, or client information are shown."
tags: [cybersecurity, microsoft-365, phishing, MSP, identity-security]
social:
  # Proposed destinations: mastodon, x. Enable after separate social approval.
  post_to: []
  tags: [Cybersecurity, Microsoft365, IdentitySecurity, MSP]
  status:
    mastodon: |-
      A real Microsoft sign-in page doesn't guarantee a legitimate authorization request.

      Group-IB's new MadApe research shows how device-code phishing can get users to approve attacker-initiated authentication, even when MFA succeeds.

      I wrote about what MSPs should check in Entra before rolling out restrictions.

      {url}

      #Microsoft365 #Cybersecurity #MSP
    x: |-
      A genuine Microsoft sign-in page can still be part of phishing. MadApe abuses device-code authentication, and MFA may succeed while an attacker gets access.

      Here's what MSPs should check in Entra.

      {url}

      #MSP
---

An employee receives a PDF that appears to be a shared business document. They open it, follow the link, and eventually reach a legitimate Microsoft sign-in page. They enter a code, complete authentication, and expect the document to open.

The Microsoft login page is real. The authentication may succeed. The problem is that the employee could be approving an authentication request started by an attacker.

That's the issue behind MadApe, a Microsoft device-code phishing kit [documented by Group-IB on October 29, 2026](https://www.group-ib.com/blog/madape-microsoft-device-code-phishing-kit/). The research is another reminder that protecting Microsoft 365 accounts involves more than checking whether MFA is enabled.

For MSPs managing multiple Microsoft 365 tenants, it also raises a practical question: do we actually know which authentication methods our clients need and which ones their environments currently allow?

## What Group-IB found

Group-IB describes a phishing operation that uses business-themed PDF attachments, fake document-sharing pages, and Microsoft device-code authentication.

The initial message may resemble a SharePoint file notification or another routine business document. A link in the PDF takes the recipient through one or more intermediate pages before presenting a device code.

Instead of asking the person to enter a password on a fake Microsoft login page, the phishing site directs them to Microsoft's legitimate device-login portal.

If the person enters the attacker-supplied code and approves the request, the attacker-controlled client can obtain access tokens when the tenant's policies permit it.

Group-IB identified 155 root domains in the infrastructure it studied, with device-code phishing components associated with 97 of them. Those numbers describe infrastructure identified during the investigation. They are not evidence that 155 organizations or users were compromised.

The campaign is important because it abuses a legitimate authentication mechanism rather than depending entirely on a convincing imitation of Microsoft's login page.

## Why MFA can still succeed

Device-code authentication exists for a legitimate reason.

As [Microsoft explains in its authentication-flows documentation](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-authentication-flows), some devices cannot provide the same interactive sign-in experience as a laptop or smartphone. Shared devices, conference room systems, and certain command-line applications may ask a user to enter a code on another device to finish signing in.

The problem is that the user entering the code may not realize who initiated the request.

An attacker can start the device-code flow, obtain a code, and persuade someone else to complete the authorization. The victim may authenticate successfully, including satisfying an MFA requirement, while giving access to the attacker's session.

That does not mean MFA has stopped working. It means the user authenticated a request they did not intend to authorize.

This is an important distinction when explaining an incident to a client. A successful MFA event doesn't prove that the sign-in was expected or that the resulting session belongs to an authorized device.

It also explains why checking for misspelled domains isn't enough. A legitimate Microsoft URL can be part of the malicious workflow.

## What I would check in a Microsoft 365 tenant

I wouldn't start by enabling a blocking policy without knowing what the environment depends on.

For an MSP, the first step should be discovering whether device-code authentication is being used legitimately.

Microsoft provides a way to investigate this in Entra sign-in logs.

### 1. Review device-code sign-in activity

In the Microsoft Entra admin center, open the sign-in logs and filter by the authentication protocol for device-code flow.

Look at which users are authenticating, the applications involved, the resources being accessed, and the available device and location context.

A device-code sign-in is not automatically malicious. But unexpected use deserves investigation, particularly when it involves an administrative account, an unfamiliar application, or an account that has no documented reason to use the flow.

The logs should help answer a basic operational question: which accounts and systems would be affected if we blocked this method?

Microsoft also documents an [**Original transfer method** field](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-authentication-flows#sign-in-logs) that can help identify later activity associated with a session that previously used device-code authentication. That matters because the current sign-in event may not itself show device-code flow even when the session remains subject to an authentication-flows policy.

### 2. Identify legitimate dependencies

Some Microsoft Teams devices and administrative tools may rely on device-code authentication.

Before changing the policy, establish which devices actually need it, who owns them, and whether a safer supported authentication method is available.

For Teams Rooms and similar scenarios, [Microsoft recommends narrowly scoped exceptions](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-teams-devices-device-code-flow) for approved device resource accounts. Its guidance also addresses excluding the Device Registration Service resource from the blocking policy so legitimate registration isn't interrupted.

Exceptions should be documented and reviewed. Excluding a broad group of ordinary users because one device needs the method creates more access than necessary.

### 3. Test a Conditional Access restriction

For appropriately licensed tenants, Microsoft Entra Conditional Access provides an **Authentication flows** condition that can target device-code flow.

[Microsoft's recommended deployment process](https://learn.microsoft.com/en-us/entra/identity/conditional-access/policy-block-authentication-flows) is to configure the blocking policy, begin in report-only mode, review its potential impact, and validate legitimate workflows before enforcing it.

I would want the change record to identify:

- The accounts and resources in scope.
- Any approved device-code dependencies and exceptions.
- The reason those exceptions are needed.
- The report-only findings and test results.
- The emergency-access exclusions needed to prevent an administrator lockout.
- The rollback and support plan if a legitimate workflow is interrupted.


[Conditional Access requires eligible licensing](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview#license-requirements), such as Microsoft Entra ID P1 or Microsoft 365 Business Premium. Licensing and existing policy configuration should be checked before recommending a deployment.

A policy should reduce the attack surface without unexpectedly taking a conference room or business application offline.

## Blocking future sign-ins isn't the entire response

There is another issue worth separating from prevention.

If an employee has already completed a malicious device-code request, blocking future device-code authentications doesn't necessarily remove access already granted.

An investigation needs to look at the affected session, associated sign-ins, application activity, and any evidence of additional access or persistence.

Depending on the evidence, responders may need to revoke sessions, investigate newly registered authentication methods or devices, review suspicious inbox rules and application permissions, and temporarily disable the account during containment.

Microsoft's [guidance on revoking user access](https://learn.microsoft.com/en-us/entra/identity/users/users-revoke-access) explains an important limitation: existing access tokens can remain usable until they expire, and application-issued sessions may require separate action.

That matters when deciding whether the account is adequately contained.

The response should follow the organization's incident process and preserve relevant evidence. Resetting a password is useful in many account-compromise scenarios, but it should not be treated as proof that every token or application permission has been invalidated.

## What this means for MSP operations

The larger lesson isn't that administrators need another security product every time a phishing kit makes the news.

It's that identity controls need owners, documentation, and verification.

An MSP may manage tenants with different licenses, different devices, and different business requirements. A policy that works for one customer may interrupt a legitimate process for another.

That doesn't make a consistent security standard impossible. It means the standard needs a defined baseline and an exception process that reflects actual dependencies.

Group-IB's MadApe research gives administrators a timely reason to revisit device-code authentication. Microsoft's documentation already provides the mechanisms to investigate and restrict it.

I would rather establish which tenants still permit an unnecessary authentication flow now than discover that gap while investigating an account takeover.

A successful sign-in proves that authentication occurred. It doesn't answer whether the right person authorized the right session for the right reason.

And that's the question MSPs need to be able to investigate.
