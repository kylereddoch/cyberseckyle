---
date: 2026-10-30T18:10:47-05:00
title: Making My Website Fit the iPhone Duo
seoTitle: How I Made My Website Fit the iPhone Duo's Two Screens
description: The iPhone Duo gave my site three very different Safari layouts. Here is the CSS and menu change I made, what Safari still controls, and how Brim and Wider approach that limit.
searchIntent: Show website owners how to test and improve a responsive site for the iPhone Duo's closed and open Safari viewports, with the limits of Safari's side controls and current Brim and Wider options.
slug: making-my-website-fit-the-iphone-duo
featuredImage: /assets/images/iphone-duo-cyberseckyle-three-layouts.png
featuredImageAlt: Three screenshots of the CybersecKyle homepage on an iPhone Duo, showing the closed outer screen, open inner screen in landscape, and open inner screen in portrait.
featuredImageCaption: 'My site in Safari on the closed outer screen and the open inner screen in landscape and portrait. Screenshots by Kyle Reddoch, October 2026; the surrounding outlines are schematic, not official Apple hardware artwork.'
tags: [personal, blogging, site-tweaks, apple, eleventy]
social:
  post_to: [mastodon, x]
  tags: [iPhoneDuo, WebDesign, Eleventy]
  status:
    mastodon: |-
      My site already worked on the iPhone Duo, but the closed screen made its extra vertical spacing hard to ignore. The open screen in landscape had the same height problem in a wider layout.

      I tightened those areas and fixed the menu state when the viewport changes. Here's the CSS, the limit Safari puts beside its controls, and a look at Wider and Brim:

      {url}

      #iPhoneDuo #Eleventy #WebDesign
    x: |-
      I tightened my site for the iPhone Duo's closed and open screens and fixed the menu on resize. Here's the CSS, Safari's side-control limit, and where Brim and Wider fit: {url} #iPhoneDuo #Eleventy
---

On the iPhone Duo's closed screen, Safari gives my site a short page with its controls running down the right side. The homepage still worked, but its welcome section took up more of that limited height than it needed to. Open the Duo in landscape and the problem changes: there is room for the full navigation, but the viewport is short again. Open it in portrait and the page has a more familiar, taller reading layout.

The image above compares all three views from my Duo. The individual captures appear alongside the changes below. They show a boundary I had to keep straight while working on the site: I can adjust what happens *inside* Safari's page viewport. I cannot move Safari's own controls with my CSS.

## The viewport is the useful clue

[WebKit's Safari 27.1 notes](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/) list the Duo's closed outer viewport at **382 × 580 CSS pixels** in portrait. The open inner display is **669 × 867** in portrait and **951 × 585** in landscape. Those heights are WebKit's small viewport height measurements, with the browser controls visible. Two windows side by side on the inner display give each page a **385 × 571** viewport.

Width alone misses the constraint. A width-only mobile breakpoint handles the closed screen's narrow column, but it says nothing about how much vertical space the welcome block or article header consumes. Inner landscape is wide enough for my desktop navigation, yet only about as tall as the closed screen.

I used ordinary responsive CSS for this. WebKit specifically recommends designing for the available viewport rather than sniffing for a Duo user agent. The experimental Device Posture API would not have told me which of these flat layouts I was looking at anyway: it reports `continuous` for both fully closed and fully open positions. Its `folded` value is for a *partially* folded book or laptop pose.

{% image "/assets/images/iphone-duo-cyberseckyle-folded.png", "CybersecKyle homepage in Safari on the iPhone Duo's closed outer screen, with Safari controls in a strip on the right.", "Closed outer screen. Safari's controls occupy the strip on the right. Screenshot by Kyle Reddoch.", "lazy", "w-64 mx-auto" %}

## What I changed on this site

The homepage is built in Eleventy, with its intro in `src/pages/index.njk`, the shared header and navigation in `src/_layouts/base.njk`, and the styles in `src/assets/starter/cyberseckyle.css`. I gave the existing intro, navigation, and main content areas stable class names so the short-screen rules could be targeted without changing the site's general reading width.

Here are representative rules from the stylesheet:

```css
@media (max-width: 42rem) and (max-height: 650px) {
  .home-intro {
    padding-block: 1rem;
    margin-bottom: 2rem;
  }

  .site-main-shell {
    padding-block: 1rem;
  }

  .post-header {
    margin-block: 1rem 1.5rem;
  }
}

@media (min-width: 48rem) and (max-height: 650px) {
  .site-header-row {
    padding-block: 0.5rem;
  }

  .site-primary-nav {
    padding-block: 0.25rem;
  }

  .site-main-shell {
    padding-block: 1rem;
  }
}
```

The first query tightens the homepage intro and article spacing on short, narrow views. The full rule set also reduces gaps between the topic badges and buttons. The second query trims the header, navigation, and article spacing on short, wider views such as the open Duo in landscape. It also reduces the desktop navigation links' vertical padding slightly. The inner portrait view is tall enough to keep the site's usual spacing. The rules keep all the content and links visible while spending less height on empty space.

{% image "/assets/images/iphone-duo-cyberseckyle-unfolded-landscape.png", "CybersecKyle homepage on the iPhone Duo's open inner screen in landscape, with the full site navigation across the top.", "Open inner screen in landscape. The full navigation fits across the top of a short viewport. Screenshot by Kyle Reddoch." %}

Folding and opening the phone can also cross the breakpoint where my hamburger menu gives way to the full navigation. In `src/assets/starter/main.js`, I added a media-query listener that closes the mobile menu when the wider layout takes over:

```js
const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primary-nav');

if (hamburger && primaryNav) {
  window.matchMedia('(min-width: 48rem)').addEventListener('change', (event) => {
    if (!event.matches) return;
    primaryNav.classList.add('hidden');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
}
```

This listener sits beside the existing click handler for the menu. The last line matters too: if the visual menu closes while the button still announces itself as expanded, the layout is only half fixed.

I checked the changes at WebKit's viewport sizes in a desktop browser, including a menu left open during a resize, and checked for horizontal overflow. The screenshots here are from Safari on my actual Duo after the site update. Desktop viewport simulation helped catch layout behavior; it did not reproduce Safari's right-side controls.

{% image "/assets/images/iphone-duo-cyberseckyle-unfolded-portrait.png", "CybersecKyle homepage on the iPhone Duo's open inner screen in portrait, showing the mobile menu and the first recent article.", "Open inner screen in portrait. The taller viewport shows the first recent article below the welcome section. Screenshot by Kyle Reddoch.", "lazy", "w-64 mx-auto" %}

## The strip beside Safari's controls

On the closed screen, Safari currently keeps the webpage out of the strip behind its side controls. It fills that area with the page's background color. [WebKit says it is investigating](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/) a way to let sites use that space safely, but Safari 27.1 does not offer a settled site-side CSS switch for it.

I noticed [MacStories ran into the same limit](https://www.macstories.net/linked/apple-investigating-options-for-extending-web-content-under-iphone-duos-safari-controls/). They updated their site for the Duo's new viewport sizes, yet their toolbar still cannot extend underneath Safari's controls. That distinction helped me set the scope for my own update: make the content area work better now, without pretending the page controls the browser chrome.

## Brim and Wider take different routes

Two third-party tools try to use that outer-screen space. They are separate from the CSS changes on this site, and the screenshots above show regular Safari without either one enabled.

**[Wider](https://www.getwider.app/)** is a [Safari extension on the App Store](https://apps.apple.com/app/id6824686276). Its developer says it lets pages extend beside Safari's controls on the Duo's outer display, with a button to switch between normal and wide mode for each site. To try it, install the app, turn it on under **Settings → Apps → Safari → Extensions**, then open a site in Safari and allow Wider access from the extensions menu. Reload any pages that were already open. The developer notes that some sites with fixed headers or layout limits may not expand cleanly, so the per-site toggle is useful.

**[Brim Browser](https://testflight.apple.com/join/zJFXVSDY)** is a separate browser, currently offered through a public TestFlight beta. [Its developer describes it](https://x.com/joogps/status/2114766532656202021) as using the full page width while keeping elements clear of the side camera; the [current beta invitation](https://testflight.apple.com/join/zJFXVSDY) specifically lists automatic status-bar avoidance. To install it, [get Apple's TestFlight app](https://testflight.apple.com/), open the Brim invite on your Duo, then tap **Accept** and **Install** if a compatible build and beta slot are available. It is beta software, so availability and behavior can change.

Wider changes how Safari presents a site for someone who installs the extension; Brim offers a different browser. Neither is something I can require of visitors to my website. The site's own responsive layout still needs to read well in normal Safari.

## If you want to check your own site

Start with the [WebKit viewport table](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/), then inspect your page at the closed outer size, outer landscape, both open orientations, and the narrow side-by-side window size. Look at where the first useful content appears, whether a fixed header eats the short views, whether text or buttons overflow, and what happens to an open menu when the viewport changes without a reload.

For my site, the worthwhile change was mostly spacing, plus that menu reset. A height query is useful when it solves a real squeeze; check that reduced padding still leaves links comfortable to tap, especially in a menu. The strip beside Safari's controls remains Safari's decision. If WebKit opens it up later, I can revisit that part with a browser-supported way to keep important content clear of the controls.
