---
date: 2025-11-17T12:00:00-05:00
title: 'Chrome’s New Driver’s License Autofill Is a Terrible Idea'
description: "Chrome can now store and autofill driver’s licenses, passports, and vehicle IDs. From a cybersecurity and privacy standpoint, putting government ID numbers into the world’s most-targeted browser is a bad trade, no matter how convenient it feels."
tags: [privacy, pii, security, infosecurity, browsers, editorials]
#mastodon_url: https://infosec.exchange/@cyberseckyle
---

{% image "/assets/images/chrome_dl_autofill_hero.png", "Chrome DL Autofill Hero", null, "eager", "text-center", "!important", [650], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Last week Google quietly gave Chrome a “helpful” upgrade: **enhanced autofill** that can now store and fill in your driver’s license number, passport number, and vehicle details like license plate and VIN.

As someone who lives in browser logs, EDR alerts, and infostealer reports for a living, I think this is a very bad idea.

Yes, the feature is off by default. Yes, Google encrypts the data and asks for confirmation before filling it.

That does not change the core problem:

> You are putting high-value government ID numbers inside the single most targeted consumer app on the planet.

Convenience for you is convenience for attackers too.

## What Chrome’s new “enhanced autofill” actually does

According to [Google’s own announcement](https://blog.google/products/chrome/enhanced-autofill/) and [support docs](https://support.google.com/chrome/answer/142893):

- Enhanced autofill lets Chrome store and autofill:
  - Driver’s license numbers  
  - Passport numbers  
  - Vehicle details such as license plate and VIN
- It is currently **desktop-only**, off by default, and requires you to:
  - Sign into Chrome with a Google account  
  - Manually enable “Enhanced autofill” under *Settings → Autofill and passwords* 
- When enabled, Chrome:
  - Offers to save this information the first time you enter it  
  - Encrypts it and stores it for reuse  
  - Asks you to confirm before filling it into a form
- To improve autofill, **Chrome may send the page URL and form content to Google** when you visit a site with a form.

Malwarebytes, [which did a nice write-up on this](https://www.malwarebytes.com/blog/news/2025/11/should-you-let-chrome-store-your-drivers-license-and-passport), summarized the feature accurately and then asked the right question: *“Should you let Chrome store your driver’s license and passport?”* Their conclusion: just because you can does not mean you should.

I agree.

## Threat model reality: your browser is already a war zone

When I look at features like this, I do not start from marketing claims. I start from incident reports.

Modern **infostealer malware** like [RedLine](https://flare.io/learn/resources/blog/redline-stealer-malware/), Raccoon, Vidar, Lumma and friends exists almost entirely to loot browsers. They are sold as “Malware-as-a-Service” and explicitly target browser data: passwords, cookies, credit card numbers, and **autofill data**.

These tools:

- Decrypt Chrome’s local databases using the same OS-level keys Chrome uses  
- Export everything into log files that get resold in bulk on underground markets  
- Give attackers one-click access to your accounts, sessions, and sensitive personal data  

RedLine, for example, is documented to **steal saved passwords, credit cards, autofill data, and other browser information by decrypting Chromium and Firefox databases with extracted master keys**.

Info-stealer campaigns are not rare edge cases. Security firms are watching **hundreds of thousands of stealer “logs”** show up for sale, each log representing a fully looted system with browser data, credentials, and PII.

So when Chrome offers to hold your driver’s license number next to all that, you are not adding risk in theory. You are adding a new prize to an active, industrialized theft pipeline.

## Government ID numbers are not just “more autofill data”

Addresses and phone numbers leaking is bad. Driver’s license and passport numbers leaking is worse.

Across US states and many other jurisdictions, **driver’s license and government ID numbers are treated as “high-risk” identifiers** under breach notification laws and identity theft statutes. They are used in:

- Credit applications and fraud checks  
- KYC (Know Your Customer) and account opening flows  
- Account recovery flows at banks, utilities, and telcos  
- Background checks and government portals  

You cannot rotate a driver’s license number the way you rotate a password. In many states, getting a new number issued after compromise is slow, painful, or practically impossible.

Putting that kind of identifier into browser autofill concentrates risk in one place, on one device class, that we already know is a prime target.

## Autofill attacks are not hypothetical

Chrome’s team will point out (correctly) that enhanced autofill requires confirmation clicks and is more constrained than classic address autofill. That is helpful, but it does not remove structural issues.

We already know several **abuse patterns** for browser autofill:

### Hidden and off-screen fields

Researchers and security practitioners have shown for years that **autofill will happily fill fields a user cannot see**:

- A [famous demo from 2017](https://thehackernews.com/2017/01/browser-autofill-phishing.html) showed a form with only “Name” and “Email” visible, but hidden fields for address, phone, and credit card details. Browser autofill filled everything into the hidden fields, and the user never saw it happen.
- Academic work on browser form autofill has shown that Chrome triggers its autofill logic based on form structure, and that forms with hidden fields can still trigger autofill flows.

Enhanced autofill adds a higher friction step (you must confirm), but that is still inside a hostile environment:

- A phishing site can design the page so the visible field looks harmless while the real ID field is off-screen or styled to look less sensitive.  
- CSS tricks and overlays can hide or reframe what you are actually agreeing to fill.  

If it is possible to trick users into filling hidden password fields, it is absolutely possible to nudge them into filling an ID field they should have questioned.

### Clickjacking and UI tricks

At DEF CON 33, researchers showed new **clickjacking attacks against major password managers’ browser extensions**, where invisible overlays and pointer-event manipulation tricked users into triggering autofill in ways they did not intend.

Different implementation, same class of problem: when your sensitive data is one UI interaction away from a hostile web page, UI deception becomes a powerful attack surface.

Enhanced autofill sits in that same blast radius.

## “But it is encrypted and off by default” is not enough

Google’s story:

- Sensitive data is encrypted  
- Only saved with your permission  
- Only filled after you confirm  
- Feature is off by default and must be explicitly enabled

All true. All good. Still not sufficient.

Here is the ugly reality from a defender’s point of view:

1. **If malware is running in your user context, it can do what Chrome can do.**  
   Stealer malware already decrypts Chrome’s password and autofill databases using your local OS keys. Encryption at rest helps against offline DB theft; it does not help against active malware on a logged-in session.

2. **Off by default is a speed bump, not a boundary.**  
   Users turn on convenience features. A blog post, a browser prompt, or a “Pro tip” article is all it takes. Malwarebytes is already having to tell people “do not flip this toggle on.”  

3. **“Share page URL and content to improve autofill” widens the privacy surface.**  
   Chrome’s own [help docs](https://support.google.com/chrome/answer/142893)say that with enhanced autofill, **the site URL and form content may be sent to Google** to improve suggestions.  
   Google says it does not send your actual ID number, but this still deepens their visibility into where you are using identity attributes.

4. **Browsers are already a single point of failure.**  
   We are fighting stealer logs where one compromised browser session gives attackers:
   - All your passwords  
   - All your cookies  
   - All your saved credit cards and addresses  
   - Sometimes MFA tokens and crypto wallets

   Handing that same pipeline your government ID numbers is not a smart extension of scope.

From a risk management view, Chrome has bolted some thoughtful controls onto a fundamentally unsafe idea.

## Why a security practitioner would say “no” by default

Speaking as an MSP and security person, here is how I weigh it.

### 1. The upside: you save a few minutes a year

Realistically, how often do you type your driver’s license or passport number into a website?

- DMV or state portal  
- Insurance or vehicle registration portals  
- Occasional rental or travel forms  

For most people, that is a handful of times a year. The time savings is small, and the friction of pulling a wallet out of your pocket is minor.

### 2. The downside: you add a persistent, high-value target

By enabling enhanced autofill and saving your IDs, you are:

- Putting those numbers into a high-theft storage location  
- Allowing them to sync across devices if you have Chrome sync on  
- Trusting that no future bug, extension, or UI dark pattern will mishandle them  

The loss scenario is not “I get more spam.” It is identity theft, fraudulent accounts, and years of cleanup.

That is a terrible trade.

## Better patterns for storing ID numbers

If you absolutely must store your driver’s license or passport number digitally, there are safer patterns than “inside Chrome autofill.”

### Use a dedicated password manager or secure vault

A [dedicated password manager](/blog/cyberseckyle-security-how-to-series-everyday-defense-part-1-password-managers-mfa/) or secure vault:

- Is designed primarily as a **secrets storage system**, not a browser convenience feature  
- Is often independently audited and hardened against stealer malware and web attacks  
- Can let you store ID numbers as secure notes or identity entries and **copy-paste manually**, rather than autofilling them into any field that happens to match a pattern.

Nothing is magic, and password managers have had autofill issues too. But architecturally, “separate vault with strict UX around sensitive data” is a healthier model than “put it into the general browser data pile next to everything else.”

### Use friction intentionally

For high-risk data, friction is a feature, not a bug.

- Storing ID numbers in an encrypted vault that requires an explicit unlock  
- Manually copying them into forms when truly required  
- Pausing to ask “why does this site need my license number at all”  

Those extra steps are security controls. Chrome’s pitch is about shaving them off.

## What I recommend for normal users

If you are not in enterprise IT and you just want a practical answer:

1. **Do not enable enhanced autofill in Chrome.**  
   Leave that toggle off. If you already flipped it on, go to *Settings → Autofill and passwords → Enhanced autofill* and disable it.

2. **Do not store driver’s license, passport, or vehicle IDs in any browser autofill.**  
   This includes addresses or notes fields where you might be tempted to paste them for later.

3. **If you need digital storage, use a reputable password manager or secure notes app.**  
   Treat these numbers like you treat bank account routing details or SSNs.

4. **Stay paranoid about stealer malware.**  
   Keep your OS and browser patched, run reputable endpoint protection, and be cautious with downloads and “cracked” software. Infostealers are routinely delivered through phishing, fake installers, and shady downloads.

The inconvenience of opening your wallet or pulling a card out of a drawer is nothing compared to dealing with a long-term identity fraud mess.

## What I recommend for orgs and MSPs

If you manage fleets of Chrome devices, this feature should land straight on your risk register.

**My take:**

- **Block or discourage autofill for sensitive data by policy.**  
  Chrome already has enterprise policies like `AutofillAddressEnabled` and `AutofillCreditCardEnabled` that let you disable address and card autofill at scale.  
  Treat government ID storage the same way if and when policy hooks arrive. In the meantime, set clear standards: “No storing government ID numbers in browsers.”

- **Harden against infostealers.**  
  Make sure your EDR actually detects common info-stealers and that you are monitoring for stealer logs on dark markets that contain your domains.  
- **Educate users on “convenience creep.”**  
  Train staff that new convenience features which store PII should always be evaluated against your data classification and regulatory posture before adoption.

- **Prefer dedicated identity proofing flows and secure vaults.**  
  For internal apps that require government IDs, build flows that use dedicated storage, strong logging, and access controls, not browser-side autofill.

## Chrome is solving the wrong problem

I get why this feature exists. Government and travel forms are awful. Autofill can be a real usability win.

But from a security perspective, Chrome is solving the least important part of the pain.

The real problems are:

- Websites that ask for too much data  
- Poor design of government and insurance portals  
- The rising value of static identity numbers in a world full of data breaches  

None of those get better when the browser becomes a bigger vault for more sensitive data.

So my position is simple:

> **Your browser should know as little as possible about your government IDs.**  

Chrome’s new driver’s license autofill does the opposite. It takes one of the highest value pieces of PII you have and drops it into the middle of an already over-targeted system.

That might be convenient for a minute. It is very convenient for attackers forever after.

---

### Sources & further reading

- Malwarebytes – [Should you let Chrome store your driver’s license and passport?](https://www.malwarebytes.com/blog/news/2025/11/should-you-let-chrome-store-your-drivers-license-and-passport) (excellent breakdown of Chrome’s enhanced autofill and the risks)
- Google Chrome Blog – [Save time with new Chrome autofill enhancements](https://blog.google/products/chrome/enhanced-autofill/) (Google’s official announcement of the feature)
- Chrome Help – [Fill out forms automatically in Chrome (Computer)](https://support.google.com/chrome/answer/142893) (docs explaining how autofill and “enhanced autofill” behave)
- TechCrunch – [Chrome can now autofill your passport, driver’s license, and vehicle registration info](https://techcrunch.com/2025/11/03/chrome-can-now-autofill-your-passport-drivers-license-and-vehicle-registration-info/) (news coverage of the rollout)
- Android Gadget Hacks – [Chrome enhanced autofill now stores passport & license data](https://android.gadgethacks.com/how-to/chrome-enhanced-autofill-now-stores-passport-license-data-0388943/) (walkthrough of where settings live and what they do)
- Android Central – [Chrome now remembers your driver’s license, passport, and vehicle info so you don’t have to](https://www.androidcentral.com/apps-software/chrome-now-remembers-your-drivers-license-passport-and-vehicle-info-so-you-dont-have-to) (consumer-focused view of the feature)
- Flare – [RedLine Stealer malware: The complete guide](https://flare.io/learn/resources/blog/redline-stealer-malware/) (deep dive into RedLine and how infostealers loot browser data)
- Proofpoint – [New RedLine password stealer malware](https://www.proofpoint.com/us/blog/threat-insight/new-redline-stealer-distributed-using-coronavirus-themed-email-campaign) (background on RedLine distribution and capabilities)
- MITRE ATT&CK – [RedLine Stealer (S1240)](https://attack.mitre.org/software/S1240/) (technical behaviors of RedLine and similar info-stealer families)
- The Hacker News – [Browser autofill feature can leak your personal details to hackers](https://thehackernews.com/2017/01/browser-autofill-phishing.html) (classic demo of hidden-field autofill abuse)
- Lin, Karami & Nikiforakis – [Empirical analysis of the privacy threats of browser form autofill](https://www.cs.uic.edu/~polakis/classes/CS568/fall-2020/autofill-ccs20.pdf) (research paper on how autofill can be abused)
- The Hacker News – [DOM-based extension clickjacking exposes popular password managers](https://thehackernews.com/2025/08/dom-based-extension-clickjacking.html) (shows how browser UI tricks can misuse autofill-like features)
- Field Effect – [New attack method weaponizes privileged browser extensions](https://fieldeffect.com/blog/new-attack-method-weaponizes-privileged-browser-extensions) (more detail on the clickjacking / extension attack surface)
- heylogin – [Analysis of DOM-based extension clickjacking](https://www.heylogin.com/en/post/dom-based-extension-clickjacking) (nice practitioner write-up of the same issue)
- OneStart – [Autofill may be convenient, but it’s also a growing threat](https://onestart.ai/blog/browser-autofill-growing-security-threat/) (good general discussion of autofill as an attack surface)