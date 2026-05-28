---
date: 2026-05-28T09:45:00-05:00
title: Passkeys Are Better Than Passwords, but They Are Not a Silver Bullet
seoTitle: Passkeys Are Better Than Passwords, but Not a Silver Bullet
description: Passkeys are a major improvement over passwords, but weak recovery flows, SMS fallbacks, legacy credentials, and help desk shortcuts can still give attackers a way around them.
searchIntent: Help readers understand why passkeys are stronger than passwords but still require hardened recovery flows, fallback cleanup, and layered identity security.
featuredImage: /assets/images/passkeys-not-silver-bullet.png
featuredImageAlt: A glowing digital key protecting a locked account while a dim side door labeled recovery remains slightly open in the background.
featuredImageCaption: Passkeys are a major upgrade, but the weakest recovery path can still decide the outcome.
tags: [cybersecurity, passkeys, mfa, security]
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116652806015844084"
mastodon_tags: [Cybersecurity, InfoSec, Passkeys, IdentitySecurity, MFA]
---

I like passkeys. Let me get that out of the way first.

Passkeys are one of the better authentication improvements we have seen in years. They reduce password reuse, make phishing harder, and remove one of the ugliest parts of account security: the shared secret. A password is something you know, something you can type, something you can accidentally give away, and something a company can lose in a breach. A passkey changes that model.

I was catching up on my podcast queue recently and hit a section in [Cybersecurity Today](https://castro.fm/episode/sog8te) that made me stop and think. The segment was about why passkeys are not enough by themselves, and I thought it was worth giving the episode some love because the point was practical, not anti-passkey. The takeaway was simple: *passkeys are not the same thing as complete account security.*

That is where I think the conversation needs to mature.

The problem is not that passkeys are weak. The problem is that attackers do not have to attack your strongest control. They only have to find the weakest path that still gets them into the account.

> Attackers Don’t Break Passkeys. They Bypass Them.

## Passkeys are legitimately better than passwords

A passkey is not just a nicer password. It is a different authentication model.

With a traditional password, the user and the service both depend on a shared secret. You know the password, and the service has some way to verify it. Even when the service stores it as a hash, the password itself is still something that can be phished, reused, stolen from a device, intercepted through a fake login page, or sprayed across other services.

Passkeys work differently. They use public key cryptography. The private key stays with the user’s device, hardware key, or credential provider. The public key is stored by the website or application. During sign-in, the service sends a challenge, and the user’s device signs that challenge without exposing the private key.

That is the big security win.

The [FIDO Alliance](https://fidoalliance.org/passkeys/) explains that passkeys use challenge-response authentication based on asymmetric cryptography, which gives relying parties phishing resistance and removes sensitive password secrets from the server side. [Microsoft’s Entra documentation](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-passkeys-fido2) also describes passkeys as origin-bound public key credentials that cannot be replayed or shared with malicious actors.

That matters because phishing usually depends on tricking a user into giving the attacker something reusable. A password can be reused. An SMS code can be relayed. A TOTP code can be entered into a fake page. A passkey does not work that way when properly implemented because it is tied to the legitimate site or application.

That is why passkeys deserve the hype.

Just not all of it.

## The weakest credential still wins

The podcast section hit on the part that I think gets overlooked in a lot of passkey marketing: the account is not only protected by the passkey. It is protected by every method that can still get someone into the account.

That includes:

- the password that still exists “just in case”
- the SMS recovery code
- the backup email account
- the security question
- the old authenticator method nobody removed
- the help desk reset process
- the emergency recovery workflow
- the legacy app that still accepts older authentication

This is the uncomfortable part. You can add a passkey and still leave the account vulnerable if the old paths remain active.

That is the same recovery problem I was trying to make practical in [Everyday Defense, Part 2 - 2FA Rescue and Recovery](/blog/cyberseckyle-security-how-to-series-everyday-defense-part-2-2fa-rescue-and-recovery/): stronger sign-in only helps if the backup path is planned, protected, and tested too.

Google even says this plainly in its own [passkey help documentation](https://support.google.com/accounts/answer/13548313?hl=en): adding a passkey to a Google Account does not automatically remove existing authentication or recovery factors. Google also says passkeys are more secure against phishing because they cannot be shared, copied, written down, or accidentally given to someone else, but that does not mean every other path into the account disappears.

That is the distinction.

A passkey can protect the normal sign-in flow while the recovery flow remains soft.

> Passkeys Are Strong, but Your Recovery Flow Might Still Be Weak.

This is where attackers are going to spend their time. They are not going to sit around trying to “crack” a passkey if there is a recovery form, phone number, support workflow, or stale password that gives them a cheaper path.

Attackers are practical. If the front door has a reinforced smart lock, they will check the side door.

## Recovery is where the corner cases live

The UK’s National Cyber Security Centre has been pretty direct about this. In its post, [Passkeys: they’re not perfect but they’re getting better](https://www.ncsc.gov.uk/blog-post/passkeys-not-perfect-getting-better), the NCSC says attackers are more likely to focus on weaknesses in account recovery and reset requests for passkey-protected accounts, including email, phone, chat, and recovery key abuse.

That is the whole game right there.

Passkeys make the primary login path stronger, so attackers shift toward the recovery path. That does not make passkeys bad. It means the battlefield moves.

NIST makes a similar point in [SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html). The guidance says the weak point in many authentication mechanisms is what happens when someone loses control of an authenticator and needs to replace it. NIST specifically calls out human-assisted recovery as a place where social engineering creates risk.

That lines up with what we see in the real world.

Account recovery has always been a compromise between security and support. Businesses do not want users locked out forever. Help desks do not want painful recovery workflows. Users do not want to show three forms of proof to get back into an account. So organizations build fallback paths. Then attackers study those fallback paths.

This is also why I keep coming back to [the help desk as part of the attack surface](/blog/your-help-desk-is-now-part-of-the-attack-surface/). If the reset process can be socially engineered, the passkey may never be the thing the attacker has to defeat.

That is why “we have passkeys now” cannot be the end of the discussion.

## Passkeys do not erase legacy identity debt

One of the biggest mistakes organizations can make is treating passkeys like a checkbox.

Roll out passkeys. Announce better security. Move on.

That sounds great in a press release, but identity security does not work that way. Every old credential, old recovery method, old device registration, old admin account, and old exception policy still matters.

This is especially true in Microsoft 365 and Google Workspace environments, where an account may have multiple authentication methods registered over time. A user might have a passkey, Microsoft Authenticator, SMS, a personal phone number, a backup email, and a password still hanging around. Some of those methods may be acceptable for normal users. Some may be completely inappropriate for privileged accounts.

That is the bigger point I made when writing about [NIST’s 2025 password guidance](/blog/responding-to-nist-s-2025-password-standard-update-sp-800-63b-4/): passwords may still exist for support and compatibility reasons, but they should be treated like a legacy factor, not the security finish line.

Microsoft’s guidance around [phishing-resistant passwordless authentication in Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-plan-prerequisites-phishing-resistant-passwordless-authentication) makes the strategic direction pretty clear: passwords are a primary attack vector, and organizations should move toward phishing-resistant passwordless authentication as part of a Zero Trust approach. Microsoft also points out that Conditional Access and authentication method reporting become important pieces of a real deployment.

That is the part MSPs and IT teams need to pay attention to.

Passkeys are not just a user convenience project. They are an identity governance project.

## The side door matters as much as the front door

> Passkeys Aren’t Enough If the Side Door Is Still Open.

For personal accounts, that side door might be SMS recovery, a weak email account, or a reused password. For businesses, the side door can be much bigger.

It can be a help desk process where a user calls in and says, “I lost my phone.” It can be a shared admin account nobody wants to touch because it might break something. It can be an old break-glass account with a password stored in a vault but no recent test. It can be a vendor account that supports passkeys for normal login but still allows password reset through email. It can even be a browser-saved password that keeps hanging around after the organization thinks it has moved on, which is one reason I am skeptical of [treating browsers as enterprise vaults](/blog/microsoft-says-its-by-design-edges-plaintext-password-behavior-is-still-a-security-problem/).

The attacker does not care that your primary login flow is modern. They care whether one of those fallback paths can be abused.

Here is how I would think about it from an MSP or IT admin perspective:

<table>
  <thead>
    <tr>
      <th>Identity Path</th>
      <th>Why It Matters</th>
      <th>What To Check</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td data-label="Identity Path">Passkey sign-in</td>
      <td data-label="Why It Matters">This is the strong front door and should reduce phishing risk.</td>
      <td data-label="What To Check">Verify users can actually sign in with passkeys across managed devices and supported apps.</td>
    </tr>
    <tr>
      <td data-label="Identity Path">Password fallback</td>
      <td data-label="Why It Matters">A password can still be phished, reused, sprayed, or stolen.</td>
      <td data-label="What To Check">Determine whether passwords can be removed, blocked, or restricted for high-risk users.</td>
    </tr>
    <tr>
      <td data-label="Identity Path">SMS recovery</td>
      <td data-label="Why It Matters">SMS remains vulnerable to SIM swapping, interception, and social engineering.</td>
      <td data-label="What To Check">Remove SMS from privileged accounts and phase it out where better options exist.</td>
    </tr>
    <tr>
      <td data-label="Identity Path">Backup email</td>
      <td data-label="Why It Matters">The recovery email becomes part of the account’s security boundary.</td>
      <td data-label="What To Check">Make sure backup email accounts are protected with strong MFA and are not personal throwaway accounts.</td>
    </tr>
    <tr>
      <td data-label="Identity Path">Help desk reset</td>
      <td data-label="Why It Matters">Support workflows are prime targets for impersonation.</td>
      <td data-label="What To Check">Require documented identity verification, approval trails, and alerts for recovery events.</td>
    </tr>
    <tr>
      <td data-label="Identity Path">Break-glass accounts</td>
      <td data-label="Why It Matters">Emergency access is necessary, but dangerous when unmanaged.</td>
      <td data-label="What To Check">Store credentials securely, monitor usage, test access, and keep recovery paths intentionally narrow.</td>
    </tr>
  </tbody>
</table>

That table is the real passkey conversation.

Not “did we turn on passkeys?”

The better question is, “What can still get someone into this account if the passkey is unavailable?”

## Not all MFA is equal

This is another place where the industry has to be more honest.

For years, we trained users and businesses to think of MFA as one bucket. Password plus any second step was treated as good enough. And yes, almost any MFA is better than no MFA. But that does not mean every MFA method provides the same protection.

The [Phishing-Resistant Authenticator Playbook](https://www.idmanagement.gov/playbooks/altauthn/) from IDManagement.gov lays this out clearly. It separates phishable methods like email, SMS, mobile app OTP, and push notifications from phishing-resistant methods like PKI and FIDO2. The reason is simple: phishing-resistant authentication uses public key cryptography and avoids handing a reusable secret or code to a fake site.

That is a big deal.

A one-time code still depends on the user putting the right number in the right place. A push prompt still depends on the user recognizing whether the request is legitimate. SMS still depends on the phone number not being hijacked. Email recovery still depends on the mailbox not already being compromised.

Passkeys reduce those problems. But if the account still allows the weaker methods as fallback, those weaker methods still define part of the account’s security.

This is why the phrase “phishing-resistant MFA” matters. It is not marketing fluff. It is a way of saying the authentication method is designed to resist the most common phishing and relay patterns instead of hoping the user catches every trick.

## The MSP angle: rollout is the easy part, cleanup is the work

For MSPs, passkeys are going to create a familiar problem.

The client will hear “passkeys are safer” and want the benefit. Users will like the easier login. Vendors will market it as simple. But the actual work is in cleanup, policy, documentation, and support process.

That means asking questions like:

- Which clients are ready for passkeys today?
- Which applications actually support them?
- Which accounts should be prioritized first?
- Are privileged users required to use phishing-resistant methods?
- Are SMS and voice call methods still enabled?
- Can users self-register weak recovery methods?
- What happens when someone loses a device?
- Who approves account recovery?
- What evidence is required before the help desk resets access?
- Are recovery events logged and reviewed?
- Do break-glass accounts have separate monitoring?

This is not glamorous work, but it is the work that makes passkeys meaningful.

For Microsoft 365 environments, I would start with privileged roles, executive users, finance users, and anyone with access to sensitive data. Then I would review authentication methods, Conditional Access policies, self-service password reset settings, and recovery workflows. If a client has Entra ID P1, Conditional Access can help enforce stronger authentication for the right users and apps.

For Google Workspace, I would look at passkey availability, 2-Step Verification enforcement, admin recovery settings, user recovery options, and whether backup methods are appropriate for the account risk.

The goal is not to make recovery impossible. The goal is to stop recovery from being the easiest attack path.

That fits the broader layered approach I laid out in [Protecting Your Enterprise From “Employee Actions” on Network Devices](/blog/protecting-your-enterprise-from-employee-actions-on-network-devices/): identity, device posture, process, and detection all have to work together when people and support workflows are part of the risk.

## Users need the right message too

One thing I would avoid is telling users, “Passkeys mean you cannot be hacked.”

That is not true, and it creates the wrong mindset.

A better message is:

Passkeys make sign-in safer because they are much harder to phish than passwords. But you still need to protect your recovery options, your devices, your email account, and any backup methods tied to the account.

That is practical. It does not oversell the technology. It tells users what changed and what still matters.

For the phone side of that advice, [my phone hardening guide](/blog/cyberseckyle-security-how-to-series-everyday-defense-part-4-phone-hardening-you-can-live-with/) is the practical companion piece, because your phone is often the device unlock, MFA prompt, recovery channel, and password reset machine all at once.

For normal users, the advice is pretty straightforward:

- Use passkeys where they are available.
- Keep device screen locks enabled.
- Keep operating systems and browsers updated.
- Remove SMS recovery where better options exist.
- Protect the email account used for recovery.
- Store recovery codes somewhere safe.
- Be suspicious of “lost passkey” or “account recovery” prompts you did not start.

For business users, especially admins and executives, I would be stricter. Privileged accounts should not rely on SMS, weak recovery emails, or casual help desk resets. Those accounts need stronger identity proofing and tighter controls because they are worth more to attackers.

## My take

Passkeys are absolutely better than passwords.

But passkeys are not magic. They do not fix bad recovery processes. They do not clean up stale credentials. They do not remove every weak MFA method by default. They do not stop a help desk from being socially engineered. They do not protect a backup email account that is already compromised.

That is not a knock against passkeys. That is just how security works.

A strong control is still only one control.

The podcast framed it well: the pitch around passkeys has sometimes overpromised that adoption alone would solve the credential problem. It was always going to break down in the corner cases, and the corner cases are where attackers live.

That line is worth sitting with.

Attackers live in the exception paths. They live in the recovery flow. They live in the forgotten password option. They live in the temporary bypass. They live in the “we will clean that up later” backlog.

So yes, adopt passkeys. Push them. Teach users why they matter. Encourage vendors to support them. Make them the default where possible.

But do not stop there.

Remove weak fallback methods. Harden recovery. Monitor authentication changes. Document the help desk process. Treat identity recovery like an attack surface, not a convenience feature.

Passkeys are a better front door.

Now close the side door.
