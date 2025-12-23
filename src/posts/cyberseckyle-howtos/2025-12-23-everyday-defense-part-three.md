---
date: 2025-12-23T13:00:00-05:00
title: "CybersecKyle Security How-To Series: Everyday Defense, Part 3 — Browser Hygiene That Actually Sticks"
description: "A practical browser hardening guide: use profiles on purpose, keep extensions on a leash, tighten anti-tracking settings, and handle downloads safely without breaking your daily workflow."
tags: [cyberseckyle-howto-series, everyday-defense, security, privacy, extensions, browsers, how-to]
mastodon_url: https://infosec.exchange/@cyberseckyle/115771427255912515
---

>This is **Part 3** of the **Everyday Defense** track in my [CybersecKyle Security How-To Series](/blog/introducing-my-new-cyberseckyle-security-how-to-series-the-full-roadmap/). The goal here is simple: make your browser boring to attackers without making your browsing miserable.

{% image "/assets/images/cyberseckyle_security-howto_partthree_hero.png", "Cyber-themed illustration showing a browser window with profile tiles and security icons like a shield, extension puzzle piece, and anti-tracking symbols on a dark purple background.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Browsers are the front door to most modern compromises. Phishing starts in a tab. Drive-by downloads happen in a tab. Malicious extensions live in the browser. Session cookies that equal “instant account takeover” are stored in the browser. You get the idea.

What you want is a setup that is:

- hard to phish
- hard to track
- hard to silently weaponize
- easy to maintain

Let’s build that.

## The baseline rule

Your browser hygiene should work even on your worst day.

If a setup requires constant discipline, it will eventually fail. Instead, we build guardrails:

- separate risky activities by design (profiles)
- reduce the number of moving parts (extensions)
- turn on the security rails already built into the browser
- treat downloads as hostile until proven otherwise

## Step 1: Use profiles like compartments, not decorations

A browser “profile” is a separate bubble of cookies, history, extensions, and saved sessions. This matters because most real-world account takeovers are not “Hollywood hacking.” They are stolen sessions, bad extensions, or you logging into the wrong thing in the wrong context.

### My recommended profile layout

Keep it simple. Three profiles covers most people:

1. **Daily**  
   Social, news, YouTube, Reddit, general browsing. This is the “dirty” profile.

2. **Money**  
   Banking, credit cards, tax sites, payroll, anything that could ruin your week. No casual browsing here.

3. **Admin**  
   Password manager web vault (if you use it), email admin panels, domain registrar, Microsoft 365 admin, Google Workspace admin, home lab dashboards. This profile is for “keys to the kingdom.”

4. **Work**
   Company email, Teams/Slack, ticketing/PSA, documentation, M365/Google tenant user portals, RMM dashboards, client portals, and anything that uses SSO. Treat this as “business sessions only.” No personal browsing, no random downloads, and keep extensions minimal.

#### Quick rules for the Work profile

- Only install extensions you’d be comfortable running on a client endpoint (password manager + blocker, maybe one workflow tool).
- Block notifications by default.
- Downloads go to a dedicated Work folder, and anything executable gets treated as suspicious until verified.

Why this works: tracking cookies, malicious scripts, and sketchy sites that live in Daily have a much harder time reaching sessions in Money or Admin.

### How to set up profiles quickly

- Chrome / Edge / Brave (Chromium): Use the built-in profile switcher and pin each profile to the taskbar/dock with a different icon. Start with Chrome’s official [profile help page](https://support.google.com/chrome/answer/2364824) and mirror the same concept in your browser of choice:
- Vivaldi: Profiles are managed from the **Profile button on the right side of the Address Bar**. Click it, choose **Manage People**, then **Add Person** to create a new profile. You can set a name and avatar, and on Windows/macOS you can also choose to create a **desktop shortcut** for that profile. [Official steps](https://help.vivaldi.com/desktop/tools/user-profiles/):  
  - Alternate path: **Settings → General → Profile Management → Manage Profiles**, or type **“Manage Profiles”** in **Quick Commands**.
  - Switching is just: Profile button → click the profile you want. 
  - *Windows note*: [each profile gets its own taskbar icon](https://help.vivaldi.com/mail/mail-advanced/use-mail-calendar-and-feeds-in-a-separate-user-profile/) when open, and you can pin a profile window to the taskbar and even assign a custom icon if you want.
  - [Guest mode](https://help.vivaldi.com/desktop/tabs/guest-view/) is also in that same Profile menu if you need a temporary “clean” window.
- Firefox: You can use separate profiles (about:profiles) and optionally pair that with [Firefox Multi-Account Containers](https://support.mozilla.org/en-US/kb/containers) (containers give you isolation inside one profile)

### Hard rule for the Money profile

- No random browsing
- No new extensions unless you would bet your paycheck the extension is clean
- No “remember me” on shared/public machines
- Consider making Money a different browser entirely if you want maximum separation (example: Vivaldi for Daily, Firefox for Money)

## Step 2: Extensions are software, and software is risk

Extensions can read pages, inject scripts, and see what you type depending on permissions. Some are great. Some are sketchy. Some are great until they get sold, compromised, or “updated” into spyware.

If you remember one thing from this section, remember this:
**every extension is a supply chain decision.**

A good general read on why MFA and secure habits matter is CISA’s guidance, and it pairs nicely with this ["attack surface reduction" mindset](https://www.cisa.gov/secure-our-world).

### Extension hygiene rules

1. **Fewer is safer.**  
   Most people should run 3 to 6 extensions total.

2. **Prefer one good blocker over five “privacy” add-ons.**  
   Stacking privacy extensions can break sites, create weird fingerprinting patterns, and increase attack surface.

3. **Avoid extensions that want “Read and change all your data on all websites” unless it is absolutely required.**  
   In Chrome-based browsers you can often set “site access” to “On specific sites” in the extension’s details page. That is a huge win.

4. **Audit extensions monthly for 2 minutes.**  
   Chrome/Edge/Vivaldi: `chrome://extensions`  
   Firefox: Add-ons and themes

### What I consider “green flags”

- Known vendor, long-lived reputation, clear privacy policy
- Open-source code with active maintenance (not abandoned)
- Minimal permissions
- No weird monetization tricks
- Update history that looks normal, not “suddenly everything changed last week”

### What I consider “red flags”

- “Free VPN” extensions that are not from a legitimate company
- Extensions that do coupons, shopping injection, “price comparisons,” or “AI assistant for every website”
- Random PDF converters and download helpers
- Anything that demands broad permissions and gives vague reasons
- Low install count plus lots of reviews that feel fake

### My baseline extension set

I’m not married to one stack, but here is a practical baseline:

- A reputable content blocker (ad and tracker blocking).  
  Firefox still supports full uBlock Origin. Chrome-based browsers have moved to Manifest V3 which changes how blockers work, so you may need a compatible blocker in Chromium. Keep this simple and avoid installing multiple blockers at once.
- A password manager extension (if your password manager offers one).  
  Use the official one only. No third-party wrappers.

That’s usually it.

## Step 3: Anti-tracking settings that improve privacy without breaking everything

Anti-tracking is a mix of:
- blocking third-party cookies
- reducing cross-site identifiers
- limiting fingerprinting
- controlling permissions like notifications and location

### Settings you should turn on today

These are available in most modern browsers:

1. **Block third-party cookies** (or enable tracking protection that effectively does this)
   - [Chrome](https://support.google.com/chrome/answer/95647)
   - [Firefox Enhanced Tracking Protection](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop)
   - [Safari tracking prevention overview](https://support.apple.com/guide/safari/prevent-cross-site-tracking-sfri40732/mac)

2. **Disable “Allow sites to send notifications” by default**  
   Browser push notifications are a scam delivery system disguised as a feature. Set it to “Don’t allow” or “Ask” and be stingy.

3. **Turn on HTTPS-Only mode where available**  
   [Firefox has HTTPS-Only Mode](https://support.mozilla.org/en-US/kb/https-only-mode-firefox)  
   Many Chromium browsers have similar “always use secure connections” settings.

4. **Limit site permissions**
   - Location: off unless needed
   - Camera/mic: ask every time unless you live in Zoom
   - Pop-ups and redirects: block
   - Automatic downloads: block or ask

### Fingerprinting reality check

You cannot “fully stop fingerprinting” in a typical consumer browser. You can reduce it, but the best you can do without breaking sites is:

- minimize extensions
- keep fonts and weird privacy add-ons to a minimum
- use built-in tracking protection
- avoid exotic settings that make you uniquely identifiable

If you want the deep rabbit hole, Firefox’s “Resist Fingerprinting” exists but is not enabled by default because it breaks things. For most people, the practical play is “reduce the biggest tracking channels” and keep your browser updated.

## Step 4: Safe downloads without paranoia

Downloads are where attackers love to hide because users are trained to click “Open” fast.

A solid “download safety” routine is:
1) verify the source  
2) verify the file  
3) isolate the execution

### Source rules

- Prefer official vendor sites or official app stores.
- Avoid random “driver download” sites.
- Avoid “cracked” software. It is basically malware-as-a-service.
- If you find a tool via a blog post, confirm it on the vendor’s official domain.

### File rules (quick triage)

Before you open something you downloaded:
- Look at the file type. Make sure Windows is [showing file extensions](https://support.microsoft.com/en-us/windows/common-file-name-extensions-in-windows-da4a4430-8e76-89c5-59f7-1cdbbc75cb01).
- If it is an Office document from the internet, treat it as dangerous. [Microsoft blocks macros from the internet by default now for a reason](https://learn.microsoft.com/en-us/deployoffice/security/internet-macros-blocked).
- If it is an installer, check if it is signed (Windows will show publisher info). If it is unsigned and unexpected, stop.
- Use a reputation scan for questionable files. [VirusTotal](https://www.virustotal.com) is a common option.

### Isolation rules

If you are not sure about a file, do not run it on your main system.
- Windows: use [Windows Sandbox when available](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-overview).
- macOS: [Gatekeeper is your friend](https://support.apple.com/guide/mac-help/open-a-mac-app-from-an-unidentified-developer-mh40616/mac). Do not bypass it casually.
- Linux: use a VM or container for untrusted files.

### My “60 second download pause protocol”

When your mouse is hovering over Open:
1. Do I trust the source domain?  
2. Do I expect this file type?  
3. Is it signed or reputable?  
4. If not, can I isolate it first?

That small pause prevents a shocking number of incidents.

## Step 5: Maintenance routine that takes 10 minutes a month

Browser hygiene fails when it is not maintained. Here is the low-friction schedule that works for real adults with jobs:

### Monthly checklist

- Update browser (and restart it)
- Update extensions
- Remove any extension you have not used in 30 days
- Review site permissions (especially notifications)
- Clear the Downloads folder
- Check that Money and Admin profiles are still clean

### Quarterly checklist

- Rotate your “top ten” session posture
  - Sign out and back into the biggest accounts in your Admin profile
  - Confirm MFA is still enabled
  - Confirm recovery options still work

If you want a dedicated day, call it “Browser Reset Day” and put it on your calendar.

## Quick start setup for most readers

If you want the fastest win, do this today:
1. Create the browser profiles: Daily, Money, Admin, and Work (if you need it).
2. In Money and Admin, install only your password manager and one content blocker.
3. Block third-party cookies and disable notification prompts.
4. Turn on HTTPS-Only mode.
5. **Stop downloading installers from random sites**. Use official sources.

That gets you 80 percent of the benefit with 20 percent of the effort.

## Up next

**Part 4 is phone hardening basics for iOS and Android.** We will cover the settings that matter, what to turn off, and what to leave alone so your phone stays usable.

If you followed Part 1 and Part 2, Part 3 is where everything starts feeling calm. That is the point.