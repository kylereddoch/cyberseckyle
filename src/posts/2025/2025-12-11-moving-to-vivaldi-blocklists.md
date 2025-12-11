---
date: 2025-12-11T09:00:00-05:00
title: 'Moving From Chrome, Edge, or Firefox To Vivaldi’s Built-In Blocklists'
description: "A practical, privacy-focused walkthrough of setting up Vivaldi’s built-in tracker and ad blocking sources when you are coming from Chrome, Edge, or Firefox with uBlock and friends."
tags: [vivaldi, browser-privacy, ad-blocking, how-to]
mastodon_url: https://infosec.exchange/@cyberseckyle/115701740817249649
---

{% image "/assets/images/vivaldi-adtrackers.png", "Stylized Vivaldi logo on a red rounded rectangle with block and network icons, symbolizing built-in ad and tracker blocking.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Switching from Chrome, Edge, or even Firefox to Vivaldi usually starts with one question:

> “What do I do about my ad blocker and all my carefully tuned filter lists?”

As someone who lives in Vivaldi for both personal browsing and security work, the blocker setup is actually one of the reasons I stay. Vivaldi ships a full tracker and ad blocker with support for custom lists, so you can get very close to your uBlock Origin or AdGuard setup without depending only on extensions. Vivaldi documents this in their help page on [blocking trackers and ads](https://help.vivaldi.com/desktop/privacy/tracking-and-ad-blocking/).  

This guide walks through how to set up Vivaldi’s blocklists from the perspective of someone migrating from “big browser + extension” to “Vivaldi + built-in blocking,” with some extra notes for privacy-minded folks.

## 1. Mental model shift: from “extension first” to “built-in first”

On Chrome or Edge, the usual stack looks something like:

- uBlock Origin or AdGuard
- Maybe Privacy Badger
- Something for cookie banners
- Maybe a DNS layer like Pi-hole at home

In Vivaldi, the idea flips:

- Network-level blocking is built in (no extension required).
- You can still run extensions on desktop, but the browser’s own blocker does most of the heavy lifting.
- On Android and iOS, extensions are not available, so the built-in blocker is the main tool.

Vivaldi’s tracker blocking uses curated lists, including data derived from DuckDuckGo’s [Tracker Radar](https://github.com/duckduckgo/tracker-radar), plus ad blocking lists you can toggle by category and region. DuckDuckGo explains Tracker Radar as a dataset of common third party domains with rich metadata that can be used to build blocklists, which is exactly what Vivaldi leans on under the hood.  

So instead of “install an extension and import filter lists,” you “turn on Vivaldi’s blocking and then tune the lists inside the browser.”

## 2. Step one: turn on tracker and ad blocking

On desktop:

1. Open **Settings** (gear icon in the bottom left, or `Alt + P`).
2. Go to **Privacy and Security**.
3. Find **Tracker and Ad Blocking**.
4. Set **Default Blocking Level** to one of:
   - `No Blocking`
   - `Block Trackers`
   - `Block Trackers and Ads`

For most people coming from a hardened uBlock setup, **Block Trackers and Ads** is the closest match. The official [Vivaldi help article](https://help.vivaldi.com/desktop/privacy/tracking-and-ad-blocking/) walks through these options in the same way.

On Android, the path is similar:

- Menu → **Settings** → **Privacy** → **Tracker and Ad Blocking** → choose your **Default Blocking Level**. See Vivaldi’s Android help page on [blocking trackers and ads](https://help.vivaldi.com/android/android-privacy/android-tracker-and-ad-blocker/) for screenshots and extra detail.

On iOS, there is a matching feature set, documented in [Tracker and Ad Blocker on iOS](https://help.vivaldi.com/ios/ios-privacy/tracker-and-ad-blocker-on-ios/).

### Per-site control (the “shield” icon)

{% image "/assets/images/vivaldi-per-site-control.png", "Vivaldi browser address bar showing the shield menu for kylereddoch.me with blocking level options: No Blocking, Block Trackers, and Block Trackers and Ads.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Once blocking is enabled globally, you get a **shield icon** in the address bar:

- Click it on any site to toggle between:
  - `No Blocking`
  - `Block Trackers`
  - `Block Trackers and Ads`

This is how you quickly unbreak a bank, a web app, or a streaming site without turning blocking off for everything. The [help page](https://help.vivaldi.com/desktop/privacy/tracking-and-ad-blocking/) and various Vivaldi forum threads walk through this as the normal workflow for managing exceptions.

## 3. Matching your old extension setup: built-in lists to enable

{% image "/assets/images/vivaldi-blocking-sources.png", "Vivaldi Tracker and Ad Blocking settings screen displaying No Blocking, Block Trackers, and Block Trackers and Ads buttons, with a list of site-specific blocking exceptions.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

Now the fun part: translating “uBlock filters I had in Chrome” into “sources I toggle in Vivaldi.”

Go to:

> **Settings → Privacy and Security → Tracker and Ad Blocking → Manage Sources**

You will see two groups:

- **Tracker Blocking Sources**
- **Ad Blocking Sources**

Each list has checkboxes you can turn on or off. These are the same style of lists you are used to in uBlock Origin or AdGuard: EasyList-style ad filters, EasyPrivacy-style tracking lists, regional lists, and annoyance filters.

### A solid baseline for most users

{% image "/assets/images/vivaldi-blocking-sources-list.png", "Vivaldi settings panel listing enabled tracker blocking sources DuckDuckGo Tracker Radar and EasyPrivacy, and ad blocking sources including ABP anti-circumvention, AdBlock Warning Removal, Allow ads from our partners, and EasyList.", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

This is a “sane but not absurd” starting point:

**Tracker Blocking Sources**

- Vivaldi’s default tracker list (based on DuckDuckGo’s Tracker Radar and other curated data).
- Any **regional tracker lists** relevant to your country or language, if available.

**Ad Blocking Sources**

- The core EasyList-style ad list Vivaldi ships with.
- A privacy-focused list similar to EasyPrivacy, if exposed separately.
- **Regional ad lists** for your country or language (important for local news and ISP portals).
- **Annoyance and cookie banner lists:**
  - “EasyList Cookie List”
  - “I don’t care about cookies” style cookie warning lists

The workflow here mirrors what you would do in something like AdGuard or uBlock: core blocking lists, privacy lists, regional lists, and annoyance killers, just controlled through Vivaldi’s settings UI instead of an extension dashboard.

## 4. Bringing your own blocklists into Vivaldi

If you are used to hand-picked lists (AdGuard, custom uBlock filters, GitHub-hosted lists), you can add them directly to Vivaldi’s blocker.

In **Manage Sources**:

1. Scroll to **Tracker Blocking Sources** or **Ad Blocking Sources**.
2. Click **Add List**.
3. Paste the URL of the list (the raw `.txt` filter file) or select a local file.
4. Click **Import**. The list is automatically enabled.

Vivaldi supports custom lists on both desktop and Android. On Android, you do this under **Settings → Privacy → Tracker and Ad Blocking → Sources → Add New Source**, as described in the Android help article.

### Good places to find filter URLs

A few dependable sources when you want more than the built-ins:

- **AdGuard filter catalog**  
  The AdGuard knowledge base article on [AdGuard filters](https://adguard.com/kb/general/ad-filtering/adguard-filters/) lists their base, tracking, and annoyance filters, with links to the raw rule files.

- **uBlock Origin “uAssets” filters**  
  uBlock’s own filter lists live in the [uAssets repository](https://github.com/uBlockOrigin/uAssets). You can click into a list and use the **Raw** URL as a source in Vivaldi.

- **Community-curated Vivaldi bundles**  
  There are community projects built specifically for Vivaldi, like the GitHub repo [Vivaldi: Custom Tracker and Ad Blocker Sources](https://github.com/dayvid3/Vivaldi-Tracker_Ad_Blocking_Lists-Customized), which ships a pre-organized set of sources others are using.

Treat community lists like any other security control: read the description, skim the file, and decide if it fits your threat model.

## 5. Migrating from uBlock or AdGuard: rough mapping

You will not get a perfect one-to-one match for every switch in the uBlock dashboard, but it comes close.

Typical **Chrome/Edge uBlock setup** might look like:

- EasyList
- EasyPrivacy
- Regional list (for your country)
- Annoyances / cookie notices
- Maybe AdGuard tracking filter
- A handful of custom rules

Rough **Vivaldi equivalent**:

- Enable Vivaldi’s default tracker source plus any relevant regional tracker lists.
- Enable EasyList-style ad sources and your regional ad list.
- Turn on both a cookie-banner list and an annoyance list.
- Add AdGuard tracking and annoyance lists as custom sources if you used them before (for example, from the [AdGuard filters](https://adguard.com/kb/general/ad-filtering/adguard-filters/) page or the [AdGuard filters repo](https://github.com/AdguardTeam/AdguardFilters)).
- Export your uBlock “My filters” to a `.txt` file and import that into Vivaldi as a custom list.

Because Vivaldi’s blocker runs at the network level, many of the same rules behave the way you expect, just without the extension UI.

## 6. Desktop and mobile: keeping your blocking consistent

On **desktop**, everything lives under:

> Settings → Privacy and Security → Tracker and Ad Blocking → Manage Sources

On **Android**, the flow is:

1. Menu → **Settings** → **Privacy** → **Tracker and Ad Blocking**
2. Set your **Default Blocking Level**
3. Tap **Sources** to enable or add tracker and ad blocking lists

On **iOS**, you get similar controls under the iOS-specific privacy settings described in [Tracker and Ad Blocker on iOS](https://help.vivaldi.com/ios/ios-privacy/tracker-and-ad-blocker-on-ios/).

If you want desktop and mobile to feel consistent, recreate your key lists on Android and iOS:

- Same regional list
- Same core ad and tracking lists
- Same cookie and annoyance filters

You might not carry over every oddball custom rule, but the general blocking profile can match across devices.

## 7. Do you still need extensions?

Short honest answer: **maybe, but less than on Chrome or Edge**.

On desktop Vivaldi you can still install things like:

- uBlock Origin
- AdGuard
- Privacy Badger
- SponsorBlock and other niche tools

Many Vivaldi users run the **built-in blocker plus one extension** for special use cases, such as very aggressive cosmetic filtering or YouTube-specific behavior.  

From a security and reliability standpoint, a good pattern is:

- Use Vivaldi’s **built-in tracker and ad blocker** for your baseline.
- Layer **one** extension if you have an edge case the built-in blocker does not handle well.
- Avoid stacking multiple heavy blockers that fight each other and make debugging broken sites miserable.

On Android and iOS, the story is simpler: lean on the built-in blocker. That is the main engine by design.

## 8. Privacy stats and troubleshooting broken sites

Vivaldi gives you a handy reality check with **Privacy Statistics**.

- When the blocker is enabled, click the **content blocker / shield** button in the address bar.
- You can see how many trackers and ads were blocked on that page.

This is great when you are wearing your security-analyst hat and want to show someone how much noise gets stripped before a page even loads.

For **broken sites**, my usual triage:

1. Click the shield icon.
2. Drop from `Block Trackers and Ads` to `Block Trackers` or even `No Blocking` for that specific site.
3. If the site works when blocking is loosened, try turning off a specific annoyance or cookie list in Manage Sources so you don’t have to whitelist the site completely.

## 9. A practical starter setup if you are coming from Chrome, Edge, or Firefox

If I had to give a one-screen recipe for someone landing in Vivaldi for the first time with a privacy mindset, it would be:

1. **Default blocking**  
   - Set **Default Blocking Level** to `Block Trackers and Ads`.

2. **Tracker lists**  
   - Keep Vivaldi’s default tracker source enabled (powered by DuckDuckGo Tracker Radar and similar datasets).
   - Add your regional tracker list if available.

3. **Ad lists**  
   - Enable the main EasyList-style ad list.
   - Enable your regional ad list.
   - Turn on at least one annoyance and one cookie-banner list.

4. **Custom lists**  
   - Add AdGuard Base / Tracking / Annoyances if you used them before, pulling URLs from the [AdGuard filters documentation](https://adguard.com/kb/general/ad-filtering/adguard-filters/).
   - Import your old custom filters as a `.txt` file if you have them (for example, exported from the uBlock dashboard described in the wiki page on [Filter lists](https://github.com/gorhill/uBlock/wiki/Dashboard:-Filter-lists) and [My filters](https://github.com/gorhill/uBlock/wiki/Dashboard:-My-filters)).

5. **Per-site tuning**  
   - Use the shield icon to relax blocking on picky web apps, banking portals, or video sites.
   - Avoid disabling blocking globally unless you are actively debugging something.

From there, you can iterate: check privacy stats, refine lists, and occasionally prune any source that overlaps too heavily with others.

Vivaldi will not magically fix the entire internet, but moving from “extension-only blocking” to “browser-level blocking plus a minimal extension layer” gives you more control, less breakage, and fewer moving parts. For people who care about privacy and spend their day thinking about how much data leaks through the browser, that’s a much better default stance.