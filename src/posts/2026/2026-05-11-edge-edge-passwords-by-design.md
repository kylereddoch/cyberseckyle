---
date: 2026-05-11T13:15:00-05:00
title: Microsoft Says It’s “By Design.” Edge’s Plaintext Password Behavior Is Still a Security Problem
description: "Microsoft says Edge loading saved passwords into plaintext memory is by design. That framing misses the real problem: it widens the blast radius after compromise and creates real risk in shared, managed, and MSP-supported environments."
featuredImage: /assets/images/edge_plaintext_passwords_memory.webp
featuredImageAlt: Close-up of a smartphone displaying the Microsoft Edge logo against a blurred blue and orange background.
featuredImageCaption: 
tags: [cybersecurity, security, editorials, MSP, browsers]
mastodon_post: true
mastodon_url: 
mastodon_tags: [Cybersecurity, InfoSec, BrowserSecurity, MicrosoftEdge]
---

> A browser that decrypts your full saved-password vault at launch and leaves it in process memory is not delivering secure convenience. It is widening the blast radius after compromise, and calling that *by design* does not make it a good design.

Last week’s reporting from [Malwarebytes](https://www.malwarebytes.com/blog/news/2026/05/microsoft-says-edges-plaintext-password-behavior-is-by-design), [SANS Internet Storm Center](https://isc.sans.edu/diary/32954), and [Dark Reading](https://www.darkreading.com/cyber-risk/microsoft-edge-passwords-enterprise-risk) put a spotlight on a design choice in Microsoft Edge that should make defenders deeply uncomfortable. Researcher Tom Jøran Sønstebyseter Rønning showed that when users save credentials in Edge, the browser loads **all** of those saved passwords into memory in cleartext when Edge starts, including credentials for sites the user never visits during that session. He later published a proof of concept to demonstrate the issue more directly.

That point matters because this is not just an argument about how passwords are stored *on disk*. Microsoft’s own documentation says Edge encrypts saved passwords at rest using AES and OS-backed protection, and it also says the simple recommendation for many organizations is to use the browser’s built-in password manager. Microsoft even removed an earlier baseline recommendation to disable the built-in password manager in Edge version 114 because it believed newer features improved the tradeoffs. In other words, Microsoft has been positioning the built-in manager as a reasonable enterprise choice. You can see that posture in Microsoft’s own [password manager security documentation](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-security-password-manager-security).

The problem is that **runtime handling is the real story here, not at-rest encryption**. A password vault can look solid in product documentation and still fail at the exact moment the browser launches. That is what makes the “by design” response so frustrating. The researcher’s point was not that Edge fails to encrypt stored credentials on disk. The point was that Edge appears to decrypt the entire vault into readable process memory at startup, and SANS reproduced the behavior with a basic memory-dump workflow. That is not a theoretical nitpick. That is a real reduction in attacker cost.

## “The system was already compromised” is not a serious defense

The weakest part of Microsoft’s posture here is the implied logic that this is acceptable because an attacker would already need local access, elevated permissions, or a compromised session to abuse it. That is not how defenders should think. **Post-compromise security still matters.** Most good security engineering is about making the *next* step harder after the *first* thing goes wrong. If a device is compromised, you want credential theft to be more difficult, noisier, and narrower in scope. You do not want it to become easier and broader.

Google’s own security work on Chromium shows exactly why that logic is weak. In 2024, Google documented that DPAPI protects secrets at rest on Windows but does **not** protect against malware running as the logged-in user, which is exactly why infostealers target browser data so aggressively. Google then introduced [App-Bound Encryption](https://security.googleblog.com/2024/07/improving-security-of-chrome-cookies-on.html) to raise the cost of theft, and Chromium later added process-bound protections to make local memory inspection harder. You do not spend engineering effort on controls like that unless you accept a basic security truth: “already running as the user” is not the end of the story. It is the beginning of the hard part.

That is why the Edge response feels so out of touch to people who actually work incidents. In real environments, defenders do not get to say, “Well, the attacker had code execution, so who cares what else becomes easier?” We care because incident response lives in the gap between **one foothold** and **full environment-wide pain**. Every design choice that helps contain that blast radius matters. Every choice that expands it matters too.

## A browser is not a vault. It is an attack surface with a UI

This is one of the biggest reasons I have never loved the industry habit of treating browsers like neutral, low-risk places to keep more and more secrets. Browsers are not passive lockers. They are massive, high-activity applications that render hostile content, host extensions, maintain session state, broker identity, and sit directly in the path of phishing, infostealers, malicious sites, and post-exploitation abuse.

That was already true before this story. It is even harder to ignore now. My earlier piece on [Chrome’s new driver’s license autofill](https://www.kylereddoch.me/blog/chromes-new-drivers-license-autofill-is-a-terrible-idea/) made the same broader point from a different angle: **putting more sensitive data into the browser increases the value of compromising the browser**.

Microsoft’s own Edge documentation quietly reinforces that concern. The docs note that a malicious extension with page access can inherently access anything on that page, including an autofilled password. That is not some fringe edge case either. It sits right next to the very real browser-extension threat landscape, including the kind of long-running abuse I covered in [“Sleeper” Browser Extensions: How a 7-Year Campaign Turned Chrome and Edge into Spyware](https://www.kylereddoch.me/blog/sleeper-browser-extensions-how-a-7-year-campaign-turned-chrome-and-edge-into-spyware/). A browser that is already a tempting target becomes an even richer target when its saved credentials are sitting decrypted in memory for the life of the session.

There is another uncomfortable wrinkle here too. Microsoft’s support documentation shows that it ended password autofill in Microsoft Authenticator during 2025 and explicitly told users they could still use, view, and manage saved passwords in Edge across devices. That means Microsoft itself has been nudging password-management behavior more directly toward Edge. If that is the direction, then Edge’s runtime credential handling deserves **more** scrutiny, not less.

## Why this is an MSP problem, not just a browser headline

From an MSP perspective, this story is not just about one user saving personal passwords in the wrong place. The real issue is what this looks like in **managed client environments**.

The obvious high-risk cases are shared or semi-shared Windows environments: terminal servers, Citrix hosts, AVD session hosts, RDS boxes, jump servers, lab systems, front-desk workstations, and any environment where multiple users can be logged on simultaneously or where disconnected sessions stay alive longer than they should. Dark Reading reported that Rønning specifically highlighted terminal services, Citrix, VDI, and Windows terminal server scenarios because administrative access on those systems can expose the memory of other logged-on users’ processes. The proof-of-concept README makes the same point bluntly: this is especially problematic in shared environments because an attacker can access Edge processes for logged-on and disconnected users and dump saved credentials.

That changes the threat conversation fast. On a normal single-user laptop, this is already bad because malware or an attacker in the user’s session gets a larger credential jackpot. On a shared session host, it can become a **credential concentration problem**. One compromise can expose multiple users’ stored secrets, especially if admins are loose with session hygiene, disconnected sessions linger, or privileged access is broader than it should be. [Proton’s write-up](https://proton.me/business/blog/microsoft-edge-passwords-exposed) also called out remote desktops, terminal servers, VDI, and systems with multiple logged-on users as especially serious environments for this issue.

MSPs also live in the messy middle where perfect standards rarely exist. Plenty of clients still have users with local admin rights they should not have, lots of line-of-business apps that pressure teams into browser-based convenience, and a long tail of “temporary” shared access that somehow becomes permanent. That is exactly why design decisions like this matter. A control that assumes a clean, single-user, tightly managed endpoint may already be fragile. A control that pre-decrypts the entire vault in memory becomes much harder to defend across the actual environments MSPs inherit and support every day.

## The false sense of safety is part of the problem

What bothers me most is not just the memory behavior itself. It is the **mismatch between the security posture users think they are getting and the one they are actually getting**.

If Edge prompts a user to re-authenticate before revealing a saved password in the interface, the normal human assumption is that the password is meaningfully protected until that point. But the researcher’s finding, echoed in multiple reports, is that the browser process may already have the entire saved credential set available in plaintext memory long before that UI prompt ever appears. That makes the re-authentication prompt feel less like meaningful protection and more like theater.

Security products do not get extra credit for looking careful in the interface while being loose in the runtime model. If anything, that makes things worse because it trains users and admins to trust the wrong signal. I would much rather see a browser that is honest about its limits and minimizes decrypted credential residency than one that presents a polished unlock prompt while the full vault is already sitting in memory.

## What Microsoft should do instead

The better design direction is not mysterious.

A browser password manager should decrypt **only what is needed, when it is needed**, keep that plaintext in memory for the shortest practical window, and invest in runtime protections that make bulk memory scraping harder. That does not eliminate all risk. Nothing does. But it changes the economics for attackers. Google’s security work around App-Bound and process-bound protections is useful here not because Chrome is perfect, but because it shows the right instinct: raise attacker cost, reduce replay value, and make theft noisier.

Microsoft should also stop hiding behind the phrase *by design* as though that settles the argument. Plenty of bad security outcomes are the result of design. That is precisely why defenders care about design. The right question is not whether this behavior was intentional. The right question is whether it is a **defensible security tradeoff** in 2026 for one of the most widely deployed enterprise browsers on the planet.

I do not think it is.

## What I would change in client environments right now

If I were reviewing this across an MSP fleet this week, I would treat it as a policy and hygiene problem first.

### 1. Stop allowing Edge to become the default secret store for managed clients

Microsoft’s [`PasswordManagerEnabled`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/passwordmanagerenabled) policy can disable saving new passwords, but Microsoft’s own policy documentation is clear that this does **not** remove existing saved passwords. Users can still use previously saved credentials, so this is only step one. That means MSPs need to think in terms of **migration and cleanup**, not just prevention.

### 2. Block browser storage for high-value domains immediately

Microsoft’s [`PasswordManagerBlocklist`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/passwordmanagerblocklist) can disable Save and Fill for specified domains. That is exactly where I would start for identity providers, admin portals, client tenant logins, RMM platforms, remote access tools, firewalls, backup consoles, and other crown-jewel systems.

### 3. Do not confuse password monitoring with real mitigation

Edge’s [`PasswordMonitorAllowed`](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/passwordmonitorallowed) feature can warn on weak or breached credentials, which is fine as a hygiene feature, but it does nothing to solve the core issue here. It is not a mitigation for a browser decrypting the full vault into memory at launch.

### 4. Tighten session-host hygiene

Shorter disconnected-session timeouts, better sign-out enforcement, less standing local admin, and tighter control over who can access shared Windows hosts all matter more if Edge-stored credentials may be sitting decrypted in memory.

### 5. Move users toward a real password manager and passkeys where possible

For most managed environments, I still think the saner direction is a dedicated password manager plus MFA and passkeys, not deeper dependence on the browser as a vault. That is the same practical direction I laid out in [Everyday Defense, Part 1 - Password Managers + MFA](https://www.kylereddoch.me/blog/cyberseckyle-security-how-to-series-everyday-defense-part-1-password-managers-mfa/).

## My take

Microsoft is free to call this behavior *by design*. I am free to call it what it looks like from the defender side: **a poor security design choice that lowers the cost of credential theft after compromise**.

That does not mean every Edge user needs to panic or rip the browser off every endpoint immediately. It does mean admins, security teams, and MSPs should stop pretending the built-in password manager is a harmless default in managed environments. The issue here is not that encryption at rest is fake. The issue is that the protection story appears to collapse too early at runtime, in exactly the place where real attackers, infostealers, and post-exploitation operators like to work.

And that is the bottom line for me: a browser should never be designed in a way that turns one compromised session into an easier credential harvest than it needs to be. In 2026, that is not a feature.

It is a failure.
