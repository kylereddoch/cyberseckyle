---
date: 2026-06-12T10:00:00-05:00
title: "When Siri Helps During Calls, Scammers May Benefit Too"
seoTitle: How Siri AI Call Context Could Help Scammers
description: "Apple’s Call Context feature could be genuinely useful, but surfacing confirmation codes and reservation details during phone calls also creates new social engineering concerns."
searchIntent: Explain how Siri AI Call Context could expose useful details during scam calls and what safeguards users and Apple should apply.
featuredImage: /assets/images/apple-newsroom-call-context-featured.jpg
featuredImageAlt: Apple's Phone app surfacing flight confirmation details during a call using Call Context.
featuredImageCaption: 'Image: <a href="https://www.apple.com/newsroom/2026/06/apple-intelligence-brings-powerful-ai-capabilities-into-everyday-experiences/">Apple</a>'
tags: [ai, apple, cybersecurity, social-engineering]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116737898418699854"
mastodon_tags: [Cybersecurity, InfoSec, AppleIntelligence, SiriAI, AISecurity]
---


One of the most practical Apple Intelligence features announced at WWDC26 might also be one of the easiest for scammers to abuse socially.

Call Context.

Apple says that when users call a business, Call Context can proactively surface relevant information, like a confirmation code or reservation number, directly in the Phone app. Apple’s example is calling an airline to change a flight, where the Phone app can find the confirmation code in Mail. Apple also says Call Context looks at who the user is calling, not what they are saying, and runs entirely on device.

On paper, that is useful. In real life, scammers are going to love anything that brings sensitive context closer to the user during a call.

## Call Context solves a real annoyance

Let’s be honest. We have all been there.

You call an airline, hotel, bank, doctor’s office, repair company, insurance provider, or vendor. They ask for a confirmation number, case number, reservation code, ticket number, or account reference. You put them on speaker, dig through Mail, search Messages, open Notes, check a PDF, or scroll through screenshots.

It is annoying.

Apple’s [Apple Intelligence announcement](https://www.apple.com/newsroom/2026/06/apple-intelligence-brings-powerful-ai-capabilities-into-everyday-experiences/) says Call Context can surface relevant information during the call. That makes sense as a user experience improvement. It reduces friction. It keeps the user in the Phone app. It uses on-device intelligence, which is a better privacy story than sending call audio or personal data to a cloud service.

I can see why people will like it.

The problem is that phone scams also depend on the user being in motion, under pressure, and willing to retrieve information quickly.

## Scammers do not need the feature to be insecure

This is an important point.

Call Context does not have to be technically broken to create risk. The feature may work exactly as designed. It may run entirely on device. It may not share anything with Apple. The phone call may not be analyzed.

The scammer does not need to break any of that.

They only need to manipulate the person.

Social engineering attacks are built around pressure. “We need to verify your account.” “Your reservation will be canceled.” “Your payment failed.” “Your Apple ID has been locked.” “Your bank transfer is pending.” “This is IT support.” “We need the code to finish securing your account.”

Now imagine that during one of those calls, the phone helpfully surfaces the exact confirmation number, reservation code, or email context the scammer wants the user to read aloud.

That is the risk.

Not a data breach. A human breach.

## The assistant may reduce helpful friction

In security, friction is not always bad.

Good friction gives the user time to think. It slows down high-risk actions. It makes weird requests feel weird. A caller asking for a confirmation number may feel less suspicious if the phone instantly offers it up like a normal part of the workflow.

Call Context could unintentionally make the scammer’s job easier by making sensitive information feel “officially relevant.” If the phone found it, users may assume it is safe to share.

That is not always true.

The phone can know that a number relates to the business being called. It cannot know that the person on the other end is trustworthy. Caller ID can be spoofed. Users can call numbers from poisoned search results or scam websites. A malicious email can include a fake support number. A compromised account can send a convincing message.

The assistant can surface context. It cannot replace verification.

## Call Context and business environments

For businesses, this gets even more complicated.

Employees call vendors, banks, software support, telecom providers, insurance carriers, customers, and other service providers all day long. Those calls often involve account numbers, support PINs, ticket IDs, invoice numbers, and sometimes sensitive client information.

If company phones start surfacing related details during calls, employees need to know what is okay to share and what is not.

For an MSP, I would especially care about:

- Vendor support calls.
- Telecom account calls.
- Bank and payment processor calls.
- Domain registrar calls.
- SaaS admin support calls.
- Insurance and compliance calls.
- Client-specific support references.

A scammer pretending to be a vendor does not need full access to the device if they can talk an employee into retrieving the right context.

This is where policy matters. Employees should know that AI-surfaced information is not automatically safe to disclose. They should verify callers through known trusted numbers, not phone numbers from random emails, pop-ups, ads, or search results.

## Confirmation codes are a special category

Apple’s example uses a confirmation code for an airline reservation. That is very different from a one-time passcode for authentication, but users do not always understand the distinction.

Scammers routinely ask for “the code.” Sometimes that means an MFA code. Sometimes it means an account recovery code. Sometimes it means a reservation number. Sometimes it means a support PIN.

The wording matters less than the behavior: the attacker wants the user to read sensitive information over the phone.

If Call Context surfaces anything that looks like a code, users need to pause.

A safe rule: **never read an MFA code, password reset code, account recovery code, or security verification code to someone who called you or pressured you into calling.**

Reservation numbers and ticket IDs are lower risk, but even those can be abused in some situations. For example, a reservation number plus a last name may be enough to modify travel details with certain providers. A support ticket number may help a scammer sound more legitimate on the next call.

## Apple should make the UX security-aware

This is the kind of feature where small UX choices matter.

Apple should avoid making surfaced context look like a recommendation to share. The Phone app should make it clear that the information is for the user’s convenience, not proof the caller is legitimate. If the surfaced item looks like a security code, the warning should be stronger.

Good design here would include:

- Labels showing where the information came from.
- Warnings for authentication codes and recovery codes.
- Clear separation between reservation info and security verification info.
- No automatic reading, sending, or sharing of surfaced codes.
- Easy user education in the feature onboarding.

Apple is good at privacy messaging. This needs security messaging too.

## Why this belongs in security awareness training

Security awareness training often focuses on email phishing, but phone-based attacks still work because humans are easier to pressure in real time.

Call Context should be added to modern training. Not because the feature is bad, but because attackers adapt to new user experiences quickly.

A short training message could be:

“Your phone may help you find relevant information during calls. That does not mean the caller is legitimate. Never share MFA codes, password reset codes, recovery codes, or security verification codes. If a call involves money, account access, passwords, or urgent changes, hang up and call back using a known trusted number.”

That is simple. It is also the kind of message people need before the first scam call happens.

## What users should do

For normal users:

- Do not trust caller ID by itself.
- Do not call numbers from pop-ups or suspicious emails.
- Use the official app, official website, or card statement to find support numbers.
- Never read MFA or password reset codes over the phone.
- Treat AI-surfaced information as convenience, not verification.
- Slow down if the caller creates urgency.

If the caller is legitimate, they can survive a callback through an official number.

## What businesses should do

For businesses and MSP clients:

- Update phone scam training to include AI-surfaced context.
- Require known trusted numbers for vendors, banks, and critical services.
- Document vendor verification procedures.
- Use role-based access so employees do not have more account data than needed.
- Manage company Apple devices and review Apple Intelligence settings.
- Add “do not disclose codes” language to policies and onboarding.

This does not need to be a 40-page policy. A clear one-page process is better than a forgotten binder.

## The bottom line

Call Context sounds genuinely helpful. Apple also says it runs entirely on device, which is the right privacy direction.

But privacy and social engineering are different problems.

A feature can protect data from Apple and still help a scammer pressure a user into reading sensitive details out loud.

That is the real lesson here: AI assistants will increasingly put the right information in front of us at the right time. Attackers will try to make sure they are on the other end of the conversation when that happens.
