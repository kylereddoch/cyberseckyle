---
date: 2026-04-10T14:30:00-05:00
title: Catppuccin Complete UI for Mastodon 2.0
description: A major update to my Catppuccin Mastodon theme with configurable flavors, accent colors, fixed CSS downloads, single-column support, and a cleaner install story.
featuredImage: /assets/images/catppuccin-complete-ui.png
tags: [mastodon, themes, social media]
category: projects
mastodon_url: https://infosec.exchange/@cyberseckyle/116382090542616136
---

When I first shared my Catppuccin Mastodon theme, it was a pretty personal project.

I wanted Mastodon’s web UI to feel more comfortable for me, more intentional, and more in line with the kind of design language I already liked. That first version was focused mainly on a Catppuccin Mocha look and my preferred advanced web layout, especially with the composer moved over to the left.

If you missed that earlier post, you can read it here: [Catppuccin Mocha UI for Mastodon](/blog/catppuccin-mocha-ui-for-mastodon/).

This new release is a much bigger step forward.

## Introducing Catppuccin Complete UI for Mastodon

The project now has a new name: **Catppuccin Complete UI for Mastodon**.

That rename reflects what it has become. This is no longer just a one-off Mocha customization for my own setup. It is now a more complete theme package for Mastodon, still inspired by Bird UI, but rebuilt around Catppuccin and designed to be easier for other people to install, customize, and use.

## What’s New in 2.0

### 1. More than just Mocha

The biggest change is that this is no longer limited to a single Catppuccin flavor.

The theme now supports:

- Mocha
- Macchiato
- Frappe
- Latte

That means both dark and light Catppuccin users now have proper options instead of one fixed palette.

### 2. Accent color selection

On top of flavor switching, the theme now supports Catppuccin accent selection across the palette.

So if you want blue, rosewater, mauve, teal, green, lavender, or something else from the Catppuccin range, you can choose it without editing CSS by hand.

This ended up becoming a bigger improvement than I expected, because once accent colors were configurable, I also had to go back through the UI and make sure those accents were applied more consistently across the interface.

### 3. Better coverage across the UI

A big part of this update was just going through the theme and making it feel more complete.

That included improving accent coverage and fixing places where colors were either inconsistent or not being applied at all. Headers, hashtag links, compose actions, drawer controls, and other parts of the UI now follow the selected theme more closely.

I also spent time fixing contrast and readability issues, especially in lighter themes like Latte and in places where some accent combinations were too weak.

### 4. Advanced web and regular view support

The original project was mostly centered around Mastodon’s advanced web interface.

That is still the most customized version of the theme, and it is where my left-side composer layout really lives, but the theme now also properly supports Mastodon’s regular single-column interface.

That means this project is no longer only for people using advanced web all day.

### 5. A proper UserCSS install

The recommended install is now a real configurable userstyle:

`catppuccin-complete-ui.user.css`

If you use Stylus or a similar extension, you can now choose:

- Catppuccin flavor
- accent color
- composer side
- surface style
- composer width
- timeline column width
- optional active header glow

{% image "/assets/images/stylus-config-panel.png", "Stylus Config Panel for Catppuccin Complete UI showing configuration options", null, "eager", "text-center", "!important", [auto], "(min-width:30em) 50vw, 100vw", ['webp', 'jpeg'] %}

That is a much better experience than editing one giant CSS file manually.

### 6. Fixed CSS downloads too

Not everyone wants a configurable userstyle, and not everyone uses Stylus.

So alongside the UserCSS version, I also added fixed CSS exports for both layouts. There are now organized theme files for each flavor and accent combination, which makes it much easier to grab exactly what you want and drop it into Mastodon custom CSS or another userstyle tool.

### 7. Cleaner internals and easier updates

One of the less visible but most important changes in this release is that the project is now generated through a build script instead of being one giant hand-edited CSS file.

That makes the theme a lot easier to maintain, and it makes future upstream Bird UI updates much less painful to integrate.

In other words, 2.0 is not just a visual refresh. It is also a much better foundation.

## What stayed the same

Even with all the structural changes, the original goal is still the same:

I want Mastodon to feel cleaner, calmer, and nicer to use every day, while still keeping the Catppuccin personality I wanted from the beginning.

The larger left-side composer in advanced web is still here. The project is still very much shaped by my own preferences. It is just much more flexible now.

## Compatibility

Right now I am treating this release as aligned with Mastodon 4.5-era styling.

Upstream Bird UI 3.0.0 currently documents Mastodon 4.5.0 support in its README, and that is the base this project is pinned around. I still expect newer Mastodon builds to occasionally need selector updates, so I would rather be conservative than overclaim compatibility.

## What’s next

There is still plenty I want to keep improving.

Some of that is just continued polish: better coverage, more consistency, and catching the little edge cases that only show up once you start using a theme full time.

I also want to keep exploring where this can go for both advanced web and the regular Mastodon view without losing the design direction that made me build it in the first place.

## Try it out

If you want to use it, the project is available here:

[Catppuccin Mocha UI for Mastodon](https://github.com/kylereddoch/catpuccin-mocha-ui-mastodon)

The recommended install is the configurable UserCSS file, but there are also fixed CSS exports if you want something simpler.

And if you want to support the project, there are support links in the repo as well or you can contribute through the usual [channels](/donate/).

This started as a personal theme experiment, but 2.0 feels like the first version that really earns the word “complete.”