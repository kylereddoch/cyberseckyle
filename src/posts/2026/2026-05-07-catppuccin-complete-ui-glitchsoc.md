---
date: 2026-05-07T10:30:00-05:00
title: Catppuccin Complete UI for Mastodon Now Supports GlitchSoc
description: I shipped a dedicated GlitchSoc release for Catppuccin Complete UI for Mastodon, with separate userstyle files, fixed CSS exports, and layout fixes for Glitch-flavored instances.
featuredImage: /assets/images/catppuccin-complete-ui.png
tags: [mastodon, themes, social media, projects]
category: projects
mastodon_post: true
mastodon_url: "https://infosec.exchange/@cyberseckyle/116534097586226619"
mastodon_tags: [Mastodon, Catppuccin, GlitchSoc, OpenSource, Projects]
---

When I released [Catppuccin Complete UI for Mastodon 2.0](/blog/catppuccin-complete-ui-for-mastodon-20/), I felt like the project had finally grown into what I wanted it to be.

It was no longer just my own Mocha-flavored tweak of Bird UI. It had become a more complete Catppuccin theme system with multiple flavors, accent choices, fixed CSS exports, and a much cleaner install story.

But almost immediately after that, another gap showed up.

Not every Mastodon instance is actually running the same front end.

My instance offers the GlitchSoc flavor, and once I started testing the theme there more seriously, it became obvious that the standard Mastodon files were not going to be enough. Things looked close in places, but "close" is not really what I want from a theme project like this. Spacing was off, parts of the post layout felt cramped, some controls were not behaving properly, and the Glitch-specific structure introduced enough little differences that the theme needed its own attention.

So that is what this release is about.

## Why GlitchSoc needed its own version

GlitchSoc is still Mastodon, but it is not identical to the default web UI.

That matters a lot once you start doing heavier interface customization.

The more opinionated a theme becomes, the more it depends on the exact layout structure underneath it. In this case, GlitchSoc handles parts of the compose area, multi-column layout, spacing, and action bars differently enough that the regular Catppuccin Complete UI files were never going to be a perfect fit.

I could have left it in a "mostly works" state and told people to expect weirdness.

I did not want to do that.

If I am going to say the project supports something, I want that support to feel intentional rather than accidental.

## What I added

This update introduces a proper GlitchSoc release track for the theme instead of treating it like an afterthought.

That now includes:

- a dedicated `catppuccin-complete-ui-glitch.user.css` file for Stylus and similar userstyle managers
- `layout-multiple-columns-glitch.css` and `layout-single-column-glitch.css` as fixed CSS downloads
- organized fixed exports under the `themes/glitch-multi-column/` and `themes/glitch-single-column/` folders for every Catppuccin flavor and accent combination

In other words, GlitchSoc is not just getting a compatibility patch. It is getting first-class theme files.

That was the right move.

## The part that took more work than I expected

The trickiest part was not just making GlitchSoc "look better." It was making it behave correctly.

There were a few layout issues that ended up taking real time to chase down. The composer panel width and timeline column width controls were not actually affecting the GlitchSoc layout the way they should have. Some spacing around posts and action bars needed to be adjusted. And once the columns got narrow enough, the relative timestamp area could start getting squeezed until it partially disappeared.

Those are the kinds of bugs that sound small until you are trying to make a polished theme feel reliable.

They also tend to be the kinds of issues that only show up once you actually live in the UI for a bit instead of just glancing at screenshots.

That is why I am glad I pushed on this instead of calling it done too early.

## Why I kept the files separate

One thing I did not want to do was cram GlitchSoc support into the standard Mastodon files in a way that made everything harder to reason about.

There is always a temptation with theme projects to keep piling more conditionals and more selectors into one giant universal file until it becomes impossible to tell what is targeting what.

I would rather avoid that.

So the standard Mastodon files are still the standard Mastodon files, and the GlitchSoc files now exist as their own release path.

That gives people a clearer install experience, and it also gives me a cleaner way to maintain the project going forward. If GlitchSoc diverges further, I have room to adjust without turning the rest of the theme into a mess.

## What this means for the project overall

This release is not as broad as 2.0 was, but I think it matters for a similar reason.

It makes the project more real.

Mastodon is not one perfectly uniform target, especially once you start dealing with different instance flavors and interface variants. Supporting GlitchSoc in a dedicated way makes the theme more useful for actual people using actual instances, not just for the narrowest version of the platform.

It also reinforces what I want this project to be.

I do not want it to just be a personal tweak folder I happen to keep on GitHub. I want it to be a well-kept theme project that people can install with some confidence, whether they are using standard Mastodon or GlitchSoc.

## If you have been following this project

This is probably the clearest arc of the project so far:

- the original [Catppuccin Mocha UI for Mastodon](/blog/catppuccin-mocha-ui-for-mastodon/) release was the first public version of my personal setup
- [Catppuccin Complete UI for Mastodon 2.0](/blog/catppuccin-complete-ui-for-mastodon-20/) turned it into a much more flexible and complete theme system
- this new GlitchSoc update makes that system work better across the version of Mastodon some of us are actually using every day

That feels like solid progress to me.

## Where to find it

The project is still on GitHub here:

[Catppuccin Complete UI for Mastodon](https://github.com/kylereddoch/catpuccin-mocha-ui-mastodon)

If you are on a standard Mastodon web UI, the regular files are still the right place to start.

If your instance offers the GlitchSoc flavor, you should now use the dedicated GlitchSoc files instead.

This was one of those updates that came directly from real use, real testing, and a bunch of little "that still feels off" moments. Honestly, those are often the best kinds of updates, because they usually mean the project is getting more practical instead of just more complicated.
