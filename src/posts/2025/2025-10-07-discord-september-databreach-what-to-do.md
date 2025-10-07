---
date: 2025-10-07T14:00:00-05:00
title: 'What To Do If You Were Affected By The Discord September 20th Security Incident'
description: "Practical, security focused steps to take if you received Discord’s September 20, 2025 breach notification. Includes account hardening, identity protection, and anti‑phishing tips."
tags: [cybersecurity, infosecurity, news, discord]
mastodon_url: https://infosec.exchange/@cyberseckyle/115334541393623997
---

![Discord data breach hero image](/assets/images/discord_data_breach_hero.png){loading="eager" eleventy:widths="auto"}

On or around **September 20, 2025**, attackers compromised a **third‑party customer service provider** used by Discord. Discord reports that the intruder accessed data tied to **support interactions** for a limited set of users. Impacted users are being notified by email.

> If you got the notification: proceed through the steps below in order. If you are unsure whether the email is real, treat it as hostile and verify through Discord directly.

## What data may have been exposed

- Names, Discord usernames, email addresses, and contact details.  
- Limited billing metadata, IP addresses, and support ticket contents.  
- For a small number of users, **images of government‑issued IDs** submitted for age‑verification appeals. If this applies to you, the Discord email should say so clearly.

### What was not exposed

Discord indicates no passwords, full card numbers or CVV, or general Discord messages/activity were taken. The incident targeted a support vendor, not Discord’s core production systems.

## Step 1: Verify the email is legitimate, then avoid clicking links

Phishing thrives on confusion. If you received an email:

1. Check the sender. Discord breach notices reference **noreply[at]discord[dot]com**.  
2. Do not click through. Open the Discord app or go to **discord.com** directly to verify.  
3. Cross‑check against Discord’s official incident update.

## Step 2: Lock down your Discord account

Even if passwords were not reported stolen, hardening your account is the smart move.

1. **Turn on Multi‑Factor Authentication (MFA).** Prefer **passkeys** or **hardware security keys**, then **authenticator app** codes. Store **backup codes** offline.  
2. **Change your Discord password** and make it **unique**. If you reuse passwords, change those other accounts too.  
3. **Review Active Devices and Sessions** in Discord and sign out of anything unfamiliar.  
4. **Audit Authorized Apps and Connections**. Remove anything you do not recognize.  
5. Be cautious with **QR code logins**. Approve only logins you initiate, on your device, at that moment.

**Power‑user tip:** Use a password manager for unique credentials. Prefer a passphrase of 14+ characters if you cannot use a manager.

## Step 3: If your **ID image** was included, add identity‑theft safeguards

If the notification states your **driver’s license or passport image** was accessed, treat this like an identity risk event:

1. **Place a credit freeze** with **Equifax, Experian, and TransUnion**. This blocks new credit in your name unless you thaw it.  
2. **Monitor credit** and consider a **fraud alert** if you want fewer hurdles than a full freeze.  
3. **Replace your driver’s license** if your state recommends it after exposure. Start with your state DMV portal.

## Step 4: Expect follow‑on scams

Watch for targeted phishing that references your support ticket, “age verification,” or billing. Red flags include pressure to re‑verify your identity, QR codes to “secure” your account, or requests for card details. If anything feels off, do not click. Navigate to **discord.com** or the app directly and check your messages there.

## Step 5: Extra hygiene for the whole stack

- **Password manager** across all accounts, plus MFA on your **email** first.  
- Check your primary email on **Have I Been Pwned** to understand broader breach exposure.  
- **Dispute charges** you do not recognize with your bank immediately.  
- **Server owners and community mods**: rotate any bot tokens, webhooks, or OAuth secrets that were ever shared via support tickets.

---

## Quick checklist

- [ ] Verified the email through the app or site  
- [ ] Turned on MFA with passkeys or a hardware key and stored backup codes  
- [ ] Changed to a unique password and reviewed devices and authorized apps  
- [ ] If ID was exposed: placed **credit freezes** and started any DMV steps  
- [ ] Set an ongoing phishing watch and avoid QR prompts you did not initiate

---

## References and further reading

- Discord: *Update on a Security Incident Involving Third‑Party Customer Service* — official incident statement.  
- TechRadar coverage of Discord’s support‑vendor breach and notice details.  
- The Verge reporting on scope, support‑provider compromise, and ID images.  
- Malwarebytes Labs write‑up on possible exposed data categories.  
- The Guardian update noting that a subset of **government‑ID images** was accessed.  
- SecurityWeek overview of the support‑vendor compromise and stolen user info.  
- Discord Help Center: setting up **MFA**, **passkeys/security keys**, and **backup codes**.  
- U.S. FTC: **credit freezes** and **fraud alerts** explained.  
- USA.gov: replacing lost or stolen **IDs**.  
- Have I Been Pwned: breach lookups and **Pwned Passwords** corpus.  
- Hive Systems: 2025 password‑cracking time estimates.

> Tip for readers: bookmark this page and re‑run the checklist every time a service you use discloses a data incident.