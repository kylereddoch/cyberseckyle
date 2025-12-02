---
date: 2025-12-02T15:00:00-06:00
title: '"Sleeper" Browser Extensions: How a 7-Year Campaign Turned Chrome and Edge into Spyware'
description: "A practical breakdown of the ShadyPanda browser extension campaign that quietly hijacked 4.3M Chrome and Edge users, and how to audit and lock down your own extensions."
tags: [cybersecurity, extensions, malware, privacy, how-to, MSP]
#mastodon_url: 
---

{% image "/assets/images/shadypanda_browser_hero.png", "Flat cyber-style illustration of a hooded figure lurking behind a laptop with a red browser-style screen, surrounded by circuit lines, binary code, gears, and warning triangles, symbolizing malicious browser extensions and spyware.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Over the last few days we learned that millions of people have been happily browsing the web with what amounts to a remote-controlled spyware agent sitting inside their browser. Not a zero-day in some obscure driver, not a sketchy EXE your cousin downloaded, but “Verified” and even “Featured” extensions from the official Chrome and Edge stores.

Koi Security’s research and follow-on reporting from Malwarebytes, BleepingComputer, and others ties this campaign to a threat actor dubbed **ShadyPanda**.[^1][^2][^3] The group has been quietly playing the long game for **seven years**, ultimately impacting more than **4.3 million** browsers worldwide.

As someone who lives in the MSP / cybersecurity world, this hits a nerve. Browser extensions are one of those things that slip past a lot of risk conversations. They feel like toys. ShadyPanda just reminded us they are absolutely not toys.

This post is my practitioner take on what happened, why it matters, and how you can **actually** protect yourself and your users.

## What happened: the ShadyPanda long game

### From wallpapers to full-blown spyware

Koi’s write-up breaks the operation into several phases:[^1]

- **Phase 1 – Wallpaper hustle (2023)**  
  About **145 extensions** (20 Chrome, 125 Edge) showed up as wallpaper packs and simple productivity tools. Behind the scenes they were doing **affiliate fraud**: quietly injecting tracking codes into sites like Amazon and eBay to skim commissions, and logging browsing behavior via analytics.  

- **Phase 2 – Search hijacking (early 2024)**  
  ShadyPanda got bolder. Extensions like **Infinity V+** started:
  - Redirecting searches through known hijacker domains (e.g., *trovi*).  
  - Exfiltrating cookies to attacker-controlled infrastructure.  
  - Streaming search keystrokes to external servers, including partial queries before you even hit Enter.

  At this point the operation evolved from “shady ad money” to **direct manipulation of what you see and where your traffic goes.**

- **Phase 3 – The RCE backdoor (mid-2024)**  
  Here’s the scary part. A small set of extensions (including **Clean Master**) uploaded back in **2018–2019** spent *years* behaving normally and collecting users and glowing reviews. Several even received **“Featured” / “Verified”** badges in the Chrome Web Store.

  Once they had around **300,000 installs**, a silent update dropped a new payload:
  - Every hour, the extension checked `api.extensionplay[.]com` for instructions.  
  - It downloaded arbitrary JavaScript and ran it with full browser API access.  
  - It exfiltrated encrypted browsing data and unique identifiers to `api.cleanmasters[.]store`.  

  As Koi and eSecurity Planet both emphasize, this is not a simple info-stealer; it is a **remote code execution (RCE) backdoor** inside your browser. The attacker chooses what it does next.[^1][^4]  

- **Phase 4 – The spyware empire (Edge, ongoing)**  
  The biggest blast radius is on **Microsoft Edge**. Five extensions published under **Starlab Technology** accumulated **4M+ installs**, led by **WeTab 新标签页 (WeTab New Tab Page)** with ~3M installs.[^1][^3]  

  These extensions:
  - Track every URL and search query.  
  - Log click positions and detailed interaction telemetry.  
  - Fingerprint devices and read web storage and cookies.  
  - Ship data to a mesh of domains, including multiple servers in China.  

  As of the initial reporting, **Chrome removed its copies**, but several Edge extensions remained live in the store.[^2][^3]  

### How they stayed hidden

Technically, ShadyPanda did a few clever things:[^1][^3][^4]

- **Patience as a feature**  
  They let extensions behave normally for months or years to build install counts, reviews, and marketplace trust.

- **Silent, weaponized updates**  
  They leaned on the browser’s own update mechanism. Most users never see when an extension’s code changes.

- **Anti-analysis tricks**  
  The malicious code:
  - Detects developer tools and switches to benign behavior.  
  - Uses heavy obfuscation and a custom JavaScript interpreter to slip past static checks and some CSP rules.  
  - Can leverage service workers as a man-in-the-middle to modify JavaScript on legitimate sites, enabling credential theft and content injection.

From a defender’s perspective, this is an extension-supply-chain attack. The trust anchor (Extension Store + “Verified” badge) becomes the delivery vehicle.

## What this malware can actually do in your browser

Let’s translate the research into impact you can explain to a non-security person (or a client).

In its current form, the RCE-capable extensions can:

- **Monitor your entire browsing history**  
  Every URL, referrer, timestamp, and navigation pattern.

- **Fingerprint your device and profile you**  
  User agent, language, time zone, screen size, platform, plus identifiers synced across devices.

- **Stream real-time interaction data**  
  Search queries as you type, clicks with X/Y coordinates, scroll behavior, and time on page.

- **Modify what you see or inject extra code**  
  With service worker control and full script access, they can:
  - Replace legitimate JavaScript with malicious versions.  
  - Inject extra login fields or fake prompts.  
  - Steal authentication cookies and tokens.

And because the backdoor can receive **new instructions hourly**, the risk is not just “my data was logged” but “the attacker can pivot into whatever they want next”: account takeover, corporate espionage, targeted phishing, even delivery of additional malware.

## The big lesson: marketplace trust is not security

ShadyPanda exploited a simple but brutal reality:  

> Extension marketplaces review code *once* at submission. They do not continuously monitor what happens after approval.[^1][^4]

That means:

- “Verified” and “Featured” are **user-experience labels**, not security attestations.  
- High install counts and five-star reviews mostly prove that the extension was useful *before* it turned.  
- Auto-updates give extension authors (or whoever buys the project later) an instant software-supply-chain channel into millions of browsers.

Treat browser extensions like **mini-applications with privileged access**, not decorative add-ons.

## How to check if you’re affected

Malwarebytes published a nice, user-friendly walkthrough for checking ShadyPanda extension IDs in Chrome and Edge.[^2] I’ll paraphrase the core steps and add some practitioner notes based on that guide.

### 1. Get the list of bad extension IDs

Koi has published the current list of Chrome and Edge extension IDs linked to ShadyPanda in their report.[^1] Save or print that list; you’ll be cross-checking against it.

> **Important:** IDs are profile-specific. If you use multiple profiles (work, personal, school), you must check *each* one.

### 2. Check Google Chrome

1. Open Chrome.  
2. In the address bar, go to: `chrome://extensions/`  
3. Turn on **Developer mode** (toggle in the upper right).  
4. Every extension tile will now show an **ID** string.  
5. Use `Ctrl+F` (or `Cmd+F` on macOS) to search for each suspicious ID from the Koi list.  

If the search jumps to a matching ID, that extension is installed in that profile. If you get “No results,” you are clear for that ID in *that* profile.

To remove a malicious extension:

- Click **Remove** on the extension’s card.  
- Confirm the removal prompt.

Repeat this for every Chrome profile you use.

### 3. Check Microsoft Edge

Edge is Chromium-based, so the flow is almost identical:

1. Open Edge.  
2. Go to: `edge://extensions/`  
3. Enable **Developer mode**.  
4. Locate the extension IDs and search for the Koi list IDs.  
5. Remove anything that matches.

Given that the largest surviving pool of ShadyPanda spyware is on Edge, take this part seriously.

## If you find one of these extensions: treat it as an incident

If you discover a ShadyPanda-linked extension (or anything similar) on your system, you should assume **data exposure and possible account compromise**, not just “some creepy tracking.”

Here’s how I’d handle it as an analyst:

### On a personal machine

1. **Remove the extension immediately** (Chrome/Edge steps above).  
2. **Log out of key accounts** in that browser:
   - Email  
   - Banking and financial apps  
   - Work SaaS (Microsoft 365, Google Workspace, etc.)  
3. **Clear cookies and site data** for sensitive services, or nuke all browsing data for the affected profile.  
4. **Change passwords** for any accounts you use in that browser, starting with:
   - Email  
   - Identity providers (Google, Microsoft, Apple, password manager, SSO)  
5. **Re-issue MFA** where possible:
   - Regenerate app-based tokens  
   - Replace any recovery codes that may have been exposed  
6. **Run a full endpoint scan** with a reputable security product to make sure nothing else piggy-backed on this.

### In an organization / MSP context

If I see this on a client endpoint, I’m treating it like a small browser-level breach:

- **Open an incident ticket** with affected user, host, browser profile, and timeline.  
- **Capture basic forensics**:
  - Browser and OS version  
  - Installed extension list  
  - Network logs if available (proxy/DNS/EDR)  
- **Remove the extension fleet-wide**:
  - Push a removal / deny policy through your browser management stack (Intune, GPO, Chrome Enterprise, etc.).  
- **Force account hygiene**:
  - Require password resets for corporate accounts used in that browser.  
  - Invalidate sessions/tokens where your IdP supports it.  
- **Check for lateral movement**:
  - Review sign-in logs for unusual locations, devices, and MFA prompts.  
- **Document and brief**:
  - Add ShadyPanda indicators (domains, IDs) into your detection content.  
  - Brief leadership and staff in plain language to reset assumptions about extension trust.

## How to harden your browser against extension-driven attacks

Once you clear the immediate fire, it is time to change habits. Here is the practical side of “never trust, always verify” in the browser.

### 1. Practice extension hygiene

For regular users:

- **Uninstall anything you don’t actively use.**  
  Fewer extensions = less attack surface. “Maybe I’ll use it later” is not a valid reason.

- **Be suspicious of “free convenience” extensions.**  
  New tab page replacements, coupon finders, “productivity” tools, random wallpaper packs, etc. These are exactly the categories ShadyPanda abused.

- **Check permissions before you install.**  
  If an extension wants access to “Read and change all your data on all websites,” you need a very strong reason to install it.

For IT and MSPs:

- Build and maintain a **baseline list of approved extensions**.  
- Block everything else via Chrome/Edge policies where possible.

### 2. Lock down extension permissions

Modern Chromium browsers give you some control here:

- Open the extension’s details page and:
  - Set **Site access** to “On specific sites” or “On click” instead of “On all sites.”  
  - Disable “Allow in InPrivate/Incognito” unless absolutely necessary.

That way, even if an extension goes rogue later, its blast radius is smaller.

### 3. Use policy, not vibes, in organizations

If you manage endpoints:

- **Enforce allowlists / denylists**  
  Use `ExtensionInstallAllowlist` / `ExtensionInstallBlocklist` (Chrome) or the Edge equivalents via Intune/GPO to control what can be installed at all.

- **Audit extensions regularly**  
  Pull extension inventory from:
  - Your RMM / EDR  
  - Browser management APIs  
  - Asset discovery tools  

  Look for:
  - Unknown publishers  
  - Extensions with very broad permissions  
  - Newly installed or newly updated extensions across many users

- **Monitor egress**  
  DNS and proxy logs are your friend. Flag large volumes of traffic from browsers to:
  - Newly observed domains  
  - Known ShadyPanda infrastructure (from the Koi indicators)  
  - Suspicious analytics or tracking domains that show up suddenly

- **Stage extension updates in high-risk environments**  
  For developer workstations or privileged admins, consider staging updates or using more restrictive browsing profiles (disposable VMs, sandboxed browsers, etc.).

### 4. Fold this into user education

Most users have no idea that:

- Extensions can be sold to another owner overnight.  
- Updates can silently switch a helpful tool into spyware.  
- A “Verified” badge is not a security review.

Use ShadyPanda as a story in your next awareness session:

> “This is why we restrict extensions, and why we keep asking you to use the approved browser profile.”

Stories stick more than policy PDFs.

## A quick self-audit checklist

Here is a short checklist you can actually hand to a non-technical friend, client, or family member:

- [ ] Go to your extensions page (Chrome: `chrome://extensions/`, Edge: `edge://extensions/`).  
- [ ] Turn on Developer mode and write down any extensions you do not recognize.  
- [ ] Compare IDs against the ShadyPanda list from Koi’s report.[^1]  
- [ ] Remove anything you:
  - Don’t recognize  
  - Don’t actually use  
  - Don’t fully trust with your browsing data  
- [ ] For remaining extensions, reduce permissions (site access, Incognito access).  
- [ ] Change passwords and refresh MFA for high-value accounts if you found anything suspicious.  
- [ ] On work machines, open a ticket so IT can investigate centrally.

ShadyPanda will not be the last group to weaponize browser extensions. The defenders who do best here are the ones who start treating browsers like **critical application platforms**, not just fancy document viewers.

---

#### References and further reading

[^1]: Koi Research. *4.3 Million Browsers Infected: Inside ShadyPanda’s 7-Year Malware Campaign.* <https://www.koi.ai/blog/4-million-browsers-infected-inside-shadypanda-7-year-malware-campaign>  
[^2]: Pieter Arntz. *“Sleeper” browser extensions woke up as spyware on 4 million devices.* Malwarebytes Labs. <https://www.malwarebytes.com/blog/news/2025/12/sleeper-browser-extensions-woke-up-as-spyware-on-4-million-devices>  
[^3]: Bill Toulas. *ShadyPanda browser extensions amass 4.3M installs in malicious campaign.* BleepingComputer. <https://www.bleepingcomputer.com/news/security/shadypanda-browser-extensions-amass-43m-installs-in-malicious-campaign/>  
[^4]: Ken Underhill. *4.3M Users Exposed in ShadyPanda’s Long-Running Browser Hack.* eSecurity Planet. <https://www.esecurityplanet.com/threats/4-3m-users-exposed-in-shadypandas-long-running-browser-hack/>