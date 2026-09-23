---
date: 2026-09-23T11:46:31-05:00
title: The Customer Isn't Always Right About IT
seoTitle: "When MSPs Should Push Back on Client IT and Security Requests"
description: Clients deserve clear explanations and workable options. They also need an MSP willing to challenge requests that weaken security or make reliable support impossible.
searchIntent: Explain why MSPs sometimes need to reject client requests, how to handle disagreements over IT and security, and where to set minimum service requirements.
featuredImage: /assets/images/customer-it-discussion.webp
featuredImageAlt: Two people seated across a table, with one pointing at the screen of a Surface laptop.
featuredImageCaption: 'Photo by <a href="https://unsplash.com/@microsoftedge">Microsoft Edge</a> on <a href="https://unsplash.com/photos/4QKqDeAZf-c">Unsplash</a>, used under the <a href="https://unsplash.com/license">Unsplash License</a>. Shown for illustration.'
tags: [cybersecurity, risk-management, security-operations, editorials]
social:
  post_to: [mastodon, x, linkedin]
  tags: [MSP, ITSupport, Cybersecurity]
  status:
    mastodon: |-
      A client can have a legitimate complaint and still ask for the wrong fix. Turning off MFA or giving everyone admin access can leave a bigger problem behind.

      I wrote about where MSPs need to push back, what they owe the client, and when a service needs a firm boundary.

      {url}

      #MSP #ITSupport #Cybersecurity
    x: |-
      The customer isn't always right about IT. An MSP needs to explain when a requested change weakens security, offer a workable alternative, and be willing to hold the line.

      {url}

      #MSP #Cybersecurity
    linkedin: |-
      A client asks to turn off MFA because the prompts interrupt work. The inconvenience may be real. Removing the protection can still be the wrong answer.

      Managed service providers are paid for technical judgment, including the willingness to challenge a request. That responsibility comes with work: investigate the complaint, explain the consequence, and offer an alternative the business can use.

      In this article, I build on Gary Pica's MSP Success piece and other industry perspectives to look at minimum service requirements, declined recommendations, temporary exceptions, and the effect these decisions have on technicians.

      A client's authority to choose does not require an MSP to promise results that choice makes impossible.

      {url}

      #MSP #ITSupport #Cybersecurity
---

Consider a client who wants multi-factor authentication turned off because the extra prompts are getting in the way of work. The complaint deserves attention. The requested fix deserves scrutiny.

Something may be wrong with the setup. A session policy may be too aggressive, a device may not be registered correctly, or the chosen authentication method may be a poor fit for the people using it. Those are problems an IT provider should investigate. Disabling the protection across the business because someone is tired of it would leave a different problem behind.

This is where an MSP has to be willing to disagree with the person paying the invoice.

Gary Pica makes that case in [The customer is wrong](https://mspsuccess.com/the-customer-is-wrong/), arguing that managed service providers have an obligation to push back when clients make poor security decisions. I agree with that central point.

> A business hires an MSP partly for its judgment. If the provider abandons that judgment whenever a recommendation becomes inconvenient, the client is getting less than it paid for.

The customer isn't always right about IT. We should be able to say that without treating customers as foolish or pretending technical expertise makes us right about everything else.

This disagreement has been part of the industry conversation for years. In a [2021 MSPAlliance article](https://mspalliance.com/msps-and-customer-it-security/), Charles Weaver described providers being prevented from improving security by clients who rejected controls such as MFA, backups, and change management. His argument raises a practical question: if the client declines to have the MSP perform that work, who is going to do it? The need for the control remains after the service is declined.

## A valid complaint can lead to the wrong request

A client knows which application employees need, when the business is busiest, and how much disruption it can tolerate. That knowledge belongs in the decision. It does not establish that a shared administrator account is safe, that a server is recoverable, or that a security alert can be ignored.

The distinction matters because a support request often arrives with a proposed solution already attached. An employee cannot install something, so the request is to make everyone a local administrator. A business application stops working, so the request is to disable endpoint protection. A departing employee's mailbox needs to remain accessible, so someone asks to keep using that person's credentials.

Each request starts with a legitimate need. The proposed change can still create unnecessary access, weaken accountability, or remove a control from far more of the environment than the problem requires.

The technician's job includes finding a better way to meet that need: an approved installation, a narrowly scoped exception after investigation, or delegated mailbox access through named accounts. That takes more work than making the requested change and closing the ticket. It also gives the client a chance to solve the original problem without inheriting another one.

With MFA, there is a concrete reason to hold the line. [CISA recommends it for business systems such as email, file storage, and remote access](https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/require-multifactor-authentication) because passwords alone provide insufficient protection. The provider should explain that exposure and improve the sign-in experience where possible. A complaint about prompts should start a troubleshooting conversation before it becomes approval to weaken authentication.

## “It still works” tells us very little about supportability

A server that starts every morning may be running an unsupported operating system, depending on a failing disk, or hosting an application nobody knows how to reinstall. The client sees a working application. The MSP needs to understand what happens when that application stops working.

That requires answers about security updates, replacement parts, installation media, licensing, dependencies, backups, and recovery time. The fact that employees can open the program today answers none of those questions.

Windows 10 provides a familiar example. [Microsoft ended ordinary Windows 10 support on October 14, 2025](https://support.microsoft.com/en-us/windows/deployment/updates-lifecycle/windows-10-support-has-ended-on-october-14-2025). A computer can continue running afterward. Whether it has applicable extended security coverage, or runs an edition with a different lifecycle, needs to be checked. “It still turns on” cannot establish its support status.

The same reasoning applies to backups. A client may believe that files appearing on several devices means the business can recover from any loss. The MSP should check that assumption before agreeing to remove a backup service.

Cloud services do have recovery capabilities. For example, [Microsoft documents a OneDrive restore feature for Microsoft 365 subscribers that can undo file and folder actions from the preceding 30 days](https://support.microsoft.com/en-us/onedrive/restore-your-onedrive). That is useful. It does not, by itself, establish that every business dataset is covered, that retention meets the client's needs, or that the whole application can be restored in the time available.

I would want the recovery requirement written down and tested before treating the existing arrangement as sufficient. A provider should be able to show what a proposed backup service adds. A client should be able to explain how the business expects to recover if it declines that capability.

## Explain the consequence well enough to challenge it

“Because it's best practice” is a weak answer to a business owner deciding where to spend money. So is a frightening breach statistic with no connection to the system being discussed.

Explain the actual failure. Which account could be taken over? Which files could become unavailable? What would stop working? How long might recovery take, and what evidence supports that estimate? If the answer is uncertain, say what still needs to be checked.

I wrote in [Tech Support Is Mostly Trust Support](/blog/tech-support-is-mostly-trust-support/) about giving people explanations they can use without making them feel foolish. Disagreement makes that more necessary. A client who understands the recommendation can question its cost, suggest a constraint we missed, or compare a reasonable alternative.

MSPs also need to examine their own recommendations. If a control is already included in the client's subscription, explain why another purchase is needed. If a replacement is urgent, identify the support deadline, failure evidence, or security exposure behind that urgency. A preferred vendor or a more convenient management tool may have operational value, but the provider should describe that value honestly.

There will be cases where the client understands the recommendation and cannot fund the full project immediately. Pica's article assumes that understanding the consequences would remove the hesitation. I think that goes too far. Understanding the risk does not create a budget or make a production shutdown easy to schedule.

The useful response is to work out what can be reduced now and what must happen next. Restricting access to a legacy system while arranging its replacement may be defensible. Leaving it indefinitely exposed because the replacement quote was declined needs a much harder conversation.

## An exception needs someone responsible for ending it

[NIST's Cybersecurity Framework](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf) recognizes that organizations may mitigate, transfer, avoid, or accept risk according to their circumstances. Business leadership has a role in setting those priorities. An MSP supplies technical judgment and needs to be clear about what it can support within the resulting decision.

A declined recommendation should leave a useful record: the affected system, the consequence explained, the alternatives offered, who made the decision, and when it will be revisited. Where temporary safeguards are part of the agreement, someone needs to verify that they exist and remain effective.

> Writing “client declined” in a ticket gives the next technician very little to work with.

It does not explain whether the client rejected the cost, disputed the need, postponed the work, or misunderstood what was being proposed. It also does nothing to change the exposed system.

Consider a legacy application that needs three more months before migration. A workable exception might identify the application owner, restrict who can reach it, verify the available recovery procedure, and set a replacement date. The review needs to happen before that date passes. Otherwise a temporary compromise can quietly become the environment everyone is expected to maintain.

That expectation matters to the technicians too. In [Sometimes the best customer is the one you let go](https://mspsuccess.com/sometimes-the-best-customer-is-the-one-you-let-go/), NEXTGen Tech's Trevor Hardy describes how a client's treatment of staff and resistance to recommendations affected his team, and why he eventually ended the relationship. His experience brings a cost into the discussion that the monthly invoice does not capture.

A client who questions a recommendation is not automatically a difficult client. Repeatedly overruling the work, demanding the same outcomes, and blaming the technicians when something fails is a different situation. Staff need clear escalation authority when a request falls outside the agreed standard, and management needs to support the decision it asked them to enforce.

## Some conditions make the service impossible to deliver

There are requests I do not think an MSP should accommodate under an ordinary managed service agreement. Removing authentication protections from privileged remote access is one. Promising a recovery outcome while being denied the ability to maintain or test the necessary backups is another.

[Huntress's guidance on MSP operations](https://www.huntress.com/msp-guide/top-msp-challenges-and-how-to-solve-them) recommends a minimum security standard across clients and warns against selling coverage the provider cannot actually deliver. Huntress sells security services, but the operational argument is worth taking seriously: if the service depends on a control, repeatedly negotiating that control away makes the service harder to deliver consistently.

The provider should establish these minimum conditions during onboarding and review them as the environment changes. [Joint guidance from the NSA, CISA, and international partners](https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/3027304/nsa-partners-issue-guidance-to-secure-managed-service-providers-their-customers/) specifically calls for MFA on MSP accounts accessing customer environments and clear ownership of security responsibilities in provider agreements. These are reasonable subjects for an explicit service requirement.

A client remains entitled to question that requirement and choose a different provider. The MSP also needs to recognize when the conditions a client insists on are incompatible with the work it has agreed to deliver. Changing the scope or arranging an orderly end to the relationship can be more honest than continuing to sell reassurance the team cannot support.

Go back to the request to turn off MFA. A useful response might be:

> “Show us where the prompts are interrupting work. We'll check the configuration and the available sign-in methods. We require MFA for this access, so we need to fix the interruption while keeping that protection in place.”

That gives the client a clear commitment, a reason for the boundary, and a next step. The remaining responsibility belongs to the MSP: investigate the complaint, make the supported improvements, and follow up with the people who have to use the system. Refusing the requested change is only part of doing the job.
